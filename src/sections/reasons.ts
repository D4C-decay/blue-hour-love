import { el, prefersReducedMotion } from '../lib/dom'
import type { LoveConfig } from '../lib/config'
import type { Section } from './hero'

const TUNE_MS = 600

/** Televisor con estática que se "sintoniza" al pulsar y revela su mensaje. */
function createStaticTv(text: string, index: number): HTMLButtonElement {
  const tv = el('button', 'minitv')
  tv.type = 'button'
  tv.style.setProperty('--i', String(index))
  tv.setAttribute('aria-pressed', 'false')
  tv.setAttribute('aria-label', 'Televisor: pulsa para revelar el mensaje')

  const screen = el('span', 'minitv__screen')
  const staticEl = el('span', 'minitv__static')
  staticEl.setAttribute('aria-hidden', 'true')
  const hint = el('span', 'minitv__hint', 'PULSA')
  hint.setAttribute('aria-hidden', 'true')
  const message = el('span', 'minitv__msg', text)
  message.setAttribute('aria-hidden', 'true')

  screen.append(staticEl, message, hint)
  tv.append(screen)

  let tuned = false
  function tune() {
    if (tuned) return
    tuned = true
    tv.classList.add('is-tuning')

    const reveal = () => {
      tv.classList.remove('is-tuning')
      tv.classList.add('is-tuned')
      tv.setAttribute('aria-pressed', 'true')
      tv.setAttribute('aria-label', text)
      message.setAttribute('aria-hidden', 'false')
    }

    if (prefersReducedMotion()) reveal()
    else window.setTimeout(reveal, TUNE_MS)
  }

  tv.addEventListener('click', tune)
  return tv
}

export function initReasons(cfg: LoveConfig): Section {
  const root = el('section', 'reasons')
  root.id = 'reasons'

  const title = el('h2', 'reasons__title', 'Razones por las que te amo')

  const flipWrap = el('div', 'reasons__group')
  const flipTitle = el('h3', 'reasons__subtitle', 'Cosas que amo de ti')
  const flipGrid = el('div', 'reasons__tvgrid')
  cfg.reasons.flip.forEach((text, i) => flipGrid.append(createStaticTv(text, i)))
  flipWrap.append(flipTitle, flipGrid)

  const scratchWrap = el('div', 'reasons__group')
  const scratchTitle = el('h3', 'reasons__subtitle', 'Secretitos')
  const scratchGrid = el('div', 'reasons__tvgrid')
  cfg.reasons.scratch.forEach((text, i) =>
    scratchGrid.append(createStaticTv(text, i)),
  )
  scratchWrap.append(scratchTitle, scratchGrid)

  root.append(title, flipWrap, scratchWrap)
  return { element: root }
}
