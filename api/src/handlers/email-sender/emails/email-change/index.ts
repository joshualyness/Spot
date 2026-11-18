import { renderTemplate } from '../../lib/render'
import template from './template.html'

export const subject = 'Confirm your new Spot email'

export function html(vars: { codeParameter: string }): string {
  return renderTemplate(template, vars)
}
