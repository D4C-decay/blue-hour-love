import { el, prefersReducedMotion } from '../lib/dom'
import type { LoveConfig } from '../lib/config'
import type { Section } from './hero'

export function initLoveVhs(_cfg: LoveConfig): Section {
  const root = el('section', 'lovevhs')
  root.id = 'lovevhs'

  const title = el('h2', 'lovevhs__title', '¿Me amas?')
  const wrap = el('div', 'lovevhs__wrap')

  const tv = el('div', 'lovevhs__tv')
  const screen = el('div', 'lovevhs__screen')
  const heart = el('div', 'lovevhs__heart', '❤')
  heart.setAttribute('aria-hidden', 'true')
  const message = el('p', 'lovevhs__msg', _cfg.loveVhs.message)
  message.setAttribute('aria-hidden', 'true')
  screen.append(heart, message)

  const cassette = el('div', 'lovevhs__cassette')
  const yes = el('button', 'lovevhs__btn lovevhs__btn--yes', 'Sí')
  const no = el('button', 'lovevhs__btn lovevhs__btn--no', 'No')

  cassette.append(yes, no)
  wrap.append(tv, cassette)
  root.append(title, wrap)

  let dodging = false

  function dodge() {
    if (dodging) return
    dodging = true
    const maxX = Math.max(40, window.innerWidth - 120)
    const maxY = Math.max(40, window.innerHeight - 120)
    const x = Math.random() * maxX
    const y = Math.random() * maxY
    no.style.transform = `translate3d(${x}px, ${y}px, 0)`
    setTimeout(() => (dodging = false), 350)
  }

  function onYes() {
    root.classList.add('is-yes')
    yes.disabled = true
    no.disabled = true
    message.setAttribute('aria-hidden', 'false')
    setTimeout(() => {
      heart.style.animationPlayState = 'running'
      heart.classList.add('is-pulse')
    }, 400)
  }

  no.addEventListener('pointerover', dodge)
  no.addEventListener('focus', dodge)
  no.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      dodge()
    }
  })
  yes.addEventListener('click', onYes)

  if (prefersReducedMotion()) {
    no.style.transition = 'none'
    heart.style.animation = 'none'
  }

  return { element: root, start: () => {} }
}
