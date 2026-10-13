import { el } from '../lib/dom'
import { greeting, type LoveConfig } from '../lib/config'
import { typewriter } from '../lib/typewriter'

export interface Section {
  element: HTMLElement
  start?: () => void
  destroy?: () => void
}

/** Hero: saludo, título con aberración cromática y la frase (máquina de escribir). */
export function initHero(cfg: LoveConfig): Section {
  const hero = el('section', 'hero')
  hero.id = 'hero'

  const eyebrow = el('p', 'hero__eyebrow', greeting(cfg))

  const title = el('h1', 'hero__title', cfg.title)
  title.dataset.text = cfg.title

  const quote = el('p', 'hero__quote')
  quote.setAttribute('aria-live', 'polite')

  const scroll = el('a', 'hero__scroll', 'desliza ↓')
  scroll.href = '#tv'
  scroll.setAttribute('aria-label', 'Bajar a la televisión')

  hero.append(eyebrow, title, quote, scroll)

  return {
    element: hero,
    start: () => {
      typewriter(quote, cfg.quote, { speed: 38, delay: 600 })
    },
  }
}
