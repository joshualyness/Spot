import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const sesClient = new SESClient({})

export async function sendSesEmail(params: {
  to: string
  subject: string
  html: string
}): Promise<void> {
  const from = process.env.SES_FROM_EMAIL
  if (!from) {
    throw new Error('SES_FROM_EMAIL is not set')
  }

  await sesClient.send(
    new SendEmailCommand({
      Source: from,
      Destination: { ToAddresses: [params.to] },
      Message: {
        Subject: { Data: params.subject, Charset: 'UTF-8' },
        Body: {
          Html: { Data: params.html, Charset: 'UTF-8' }
        }
      }
    })
  )
}
