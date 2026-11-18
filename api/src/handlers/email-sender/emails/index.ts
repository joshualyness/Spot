import * as emailVerification from './email-verification'
import * as emailChange from './email-change'
import * as forgotPassword from './forgot-password'
import { applyCodeToHtml } from '../lib/render'

export function buildCognitoEmail(
  kind: 'email_verification' | 'email_change' | 'forgot_password',
  plaintextCode: string
): { subject: string; html: string } {
  const payload = { codeParameter: plaintextCode }
  if (kind === 'forgot_password') {
    return {
      subject: forgotPassword.subject,
      html: applyCodeToHtml(forgotPassword.html(payload), plaintextCode)
    }
  }
  if (kind === 'email_change') {
    return {
      subject: emailChange.subject,
      html: applyCodeToHtml(emailChange.html(payload), plaintextCode)
    }
  }
  return {
    subject: emailVerification.subject,
    html: applyCodeToHtml(emailVerification.html(payload), plaintextCode)
  }
}
