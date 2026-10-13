import { el } from '../lib/dom'
import type { LoveConfig } from '../lib/config'
import type { Section } from './hero'

export function initFooterTvs(cfg: LoveConfig): Section {
  const root = el('section', 'footertvs')
  root.id = 'footertvs'

  const title = el('h2', 'footertvs__title', 'Vertedero de televisiones')
  const grid = el('div', 'footertvs__grid')
  cfg.footerMessages.forEach((msg) => {
    const tv = el('button', 'footertv')
    tv.type = 'button'
    const screen = el('div', 'footertv__screen')
    const text = el('div', 'footertv__text', msg)
    text.hidden = true
    screen.append(text)
    tv.append(screen)
    tv.addEventListener('click', () => {
      text.hidden = false
    })
    grid.append(tv)
  })
  root.append(title, grid)
  return { element: root }
}
