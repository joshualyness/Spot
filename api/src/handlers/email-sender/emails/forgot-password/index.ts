import { renderTemplate } from '../../lib/render'
import template from './template.html'

export const subject = 'Reset your Spot password'

export function html(vars: { codeParameter: string }): string {
  return renderTemplate(template, vars)
}
