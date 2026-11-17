/** Replace Cognito / template placeholders with the plaintext verification code. */
export function applyCodeToHtml(html: string, code: string): string {
  return html
    .replaceAll('{####}', code)
    .replaceAll('{{codeParameter}}', code)
    .replaceAll('{{code}}', code)
}

/** Replace `{{key}}` placeholders in an HTML/string template. */
export function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? '')
}
