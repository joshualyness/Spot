import { renderTemplate } from '../../lib/render'
import template from './template.html'

export const subject = 'Verify your Spot email'

export function html(vars: { codeParameter: string }): string {
  return renderTemplate(template, vars)
}
