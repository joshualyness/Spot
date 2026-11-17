import type { CustomEmailSenderTriggerEvent, SQSEvent } from 'aws-lambda'
import { buildCognitoEmail } from './emails'
import { decryptCognitoCode } from './lib/decrypt-code'
import { sendSesEmail } from './lib/send-ses'

function isSqsEvent(event: unknown): event is SQSEvent {
  return (
    typeof event === 'object' &&
    event !== null &&
    'Records' in event &&
    Array.isArray((event as SQSEvent).Records) &&
    (event as SQSEvent).Records[0]?.eventSource === 'aws:sqs'
  )
}

function isCustomEmailSenderEvent(event: unknown): event is CustomEmailSenderTriggerEvent {
  return (
    typeof event === 'object' &&
    event !== null &&
    'triggerSource' in event &&
    String((event as CustomEmailSenderTriggerEvent).triggerSource).startsWith('CustomEmailSender_')
  )
}

/**
 * Cognito Custom Email Sender: decrypt code with KMS / Encryption SDK, send HTML via SES.
 * Do not log verification codes.
 *
 * SQS: reserved for future app emails — currently ignored (no notification templates).
 */
export const handler = async (event: CustomEmailSenderTriggerEvent | SQSEvent): Promise<void> => {
  if (isSqsEvent(event)) {
    console.log(`email-sender: ignoring ${event.Records.length} SQS message(s)`)
    return
  }

  if (isCustomEmailSenderEvent(event)) {
    await handleCustomEmailSender(event)
    return
  }

  console.warn('email-sender: unknown event shape, ignoring')
}

async function handleCustomEmailSender(event: CustomEmailSenderTriggerEvent): Promise<void> {
  const attrs = event.request.userAttributes as Record<string, string | undefined>
  const to = attrs.email
  if (!to) {
    throw new Error(`email-sender: missing user email for ${event.triggerSource}`)
  }

  let plaintextCode = ''
  if (event.request.code) {
    plaintextCode = await decryptCognitoCode(event.request.code)
  }

  let built: { subject: string; html: string } | undefined

  switch (event.triggerSource) {
    case 'CustomEmailSender_SignUp':
    case 'CustomEmailSender_ResendCode':
      built = buildCognitoEmail('email_verification', plaintextCode)
      break
    case 'CustomEmailSender_UpdateUserAttribute':
    case 'CustomEmailSender_VerifyUserAttribute':
      built = buildCognitoEmail('email_change', plaintextCode)
      break
    case 'CustomEmailSender_ForgotPassword':
      built = buildCognitoEmail('forgot_password', plaintextCode)
      break
    case 'CustomEmailSender_AdminCreateUser':
      built = buildCognitoEmail('email_verification', plaintextCode)
      break
    default:
      console.log(`email-sender: no template for ${event.triggerSource}, skipping send`)
      return
  }

  if (!plaintextCode) {
    throw new Error(`email-sender: missing decrypted code for ${event.triggerSource}`)
  }

  await sendSesEmail({
    to,
    subject: built.subject,
    html: built.html
  })

  console.log(`email-sender: sent ${event.triggerSource} via SES`)
}
