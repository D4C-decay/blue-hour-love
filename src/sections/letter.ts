import { el, prefersReducedMotion } from '../lib/dom'
import { typewriter } from '../lib/typewriter'
import type { LoveConfig } from '../lib/config'
import type { Section } from './hero'

export function initLetter(cfg: LoveConfig): Section {
  const root = el('section', 'letter')
  root.id = 'letter'

  const title = el('h2', 'letter__title', 'Una carta para ti')
  const envelope = el('button', 'letter__envelope', cfg.letter.prompt)
  envelope.type = 'button'
  envelope.setAttribute('aria-expanded', 'false')

  const card = el('article', 'letter__card', '')
  card.setAttribute('aria-live', 'polite')
  card.hidden = true
  const text = el('p', 'letter__text')
  const close = el('button', 'letter__close', cfg.letter.closeHint)
  close.type = 'button'

  card.append(text, close)
  root.append(title, envelope, card)

  let cancelType = () => {}

  function openCard() {
    envelope.setAttribute('aria-expanded', 'true')
    envelope.hidden = true
    card.hidden = false
    text.textContent = ''
    cancelType = typewriter(text, cfg.letter.text, {
      speed: prefersReducedMotion() ? 0 : 28,
      delay: 200,
    })
  }

  function closeCard() {
    cancelType()
    card.hidden = true
    envelope.hidden = false
    envelope.setAttribute('aria-expanded', 'false')
    text.textContent = cfg.letter.text
  }

  envelope.addEventListener('click', openCard)
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openCard()
    }
  })
  close.addEventListener('click', closeCard)
  close.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      closeCard()
    }
  })

  return { element: root, start: () => {} }
}
