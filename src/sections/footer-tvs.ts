import { el } from '../lib/dom'
import type { LoveConfig } from '../lib/config'
import type { Section } from './hero'

/** Cementerio de televisiones: algunas funcionan, otras están rotas y con antenas torcidas. */
export function initFooterTvs(cfg: LoveConfig): Section {
  const root = el('section', 'footertvs')
  root.id = 'footertvs'

  const title = el('h2', 'footertvs__title', 'Cementerio de televisiones')
  const grid = el('div', 'footertvs__grid')

  cfg.footerMessages.forEach((msg, i) => {
    const broken = i % 2 === 1
    const tv = el('button', broken ? 'footertv footertv--broken' : 'footertv')
    tv.type = 'button'
    tv.style.setProperty(
      '--antenna-tilt',
      `${broken ? -24 - (i % 3) * 9 : -6 + (i % 3) * 5}deg`,
    )
    tv.style.setProperty('--tilt', `${broken ? -3 + (i % 2) * 6 : 0}deg`)
    tv.setAttribute(
      'aria-label',
      broken ? `Televisión averiada: pulsa para intentar leer el mensaje` : 'Televisión: pulsa para leer el mensaje',
    )

    const antenna = el('span', 'footertv__antenna')
    antenna.setAttribute('aria-hidden', 'true')

    const screen = el('div', 'footertv__screen')
    const text = el('div', 'footertv__text', msg)
    text.hidden = true
    screen.append(text)

    tv.append(antenna, screen)
    tv.addEventListener('click', () => {
      text.hidden = false
      if (broken) tv.classList.add('is-glitch')
    })
    grid.append(tv)
  })

  root.append(title, grid)
  return { element: root }
}
