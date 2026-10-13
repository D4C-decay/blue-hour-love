import { el, prefersReducedMotion } from '../lib/dom'
import { sadFaceSvg, heartSvg } from '../lib/pixel-art'
import { celebrateHearts } from '../lib/hearts'
import type { LoveConfig } from '../lib/config'
import type { Section } from './hero'

export function initLoveVhs(cfg: LoveConfig): Section {
  const root = el('section', 'lovevhs')
  root.id = 'lovevhs'

  const title = el('h2', 'lovevhs__title', '¿Me amas?')
  const wrap = el('div', 'lovevhs__wrap')

  const tv = el('div', 'lovevhs__tv')
  const screen = el('div', 'lovevhs__screen')

  const sad = el('div', 'pixel-sad')
  sad.innerHTML = sadFaceSvg()
  sad.setAttribute('aria-hidden', 'true')
  const tear = el('span', 'pixel-sad__tear')
  sad.append(tear)

  const heart = el('div', 'pixel-heart')
  heart.innerHTML = heartSvg()
  heart.setAttribute('aria-hidden', 'true')

  const message = el('p', 'lovevhs__msg', cfg.loveVhs.message)
  message.setAttribute('aria-hidden', 'true')

  screen.append(sad, heart, message)
  tv.append(screen)

  const cassette = el('div', 'lovevhs__cassette')
  const yes = el('button', 'lovevhs__btn lovevhs__btn--yes', 'Sí')
  const no = el('button', 'lovevhs__btn lovevhs__btn--no', cfg.loveVhs.noLabels[0] ?? 'No')

  cassette.append(yes, no)
  wrap.append(tv, cassette)
  root.append(title, wrap)

  const labels = cfg.loveVhs.noLabels.length > 0 ? cfg.loveVhs.noLabels : ['No']
  let labelIndex = 0
  let dodging = false

  function dodge() {
    if (dodging) return
    dodging = true
    labelIndex = (labelIndex + 1) % labels.length
    no.textContent = labels[labelIndex] ?? 'No'
    const maxX = Math.max(40, window.innerWidth - 140)
    const maxY = Math.max(40, window.innerHeight - 140)
    const x = Math.random() * maxX
    const y = Math.random() * maxY
    no.style.transform = `translate3d(${x}px, ${y}px, 0)`
    setTimeout(() => (dodging = false), 350)
  }

  let answered = false
  function onYes() {
    if (answered) return
    answered = true
    root.classList.add('is-yes')
    yes.disabled = true
    no.disabled = true
    message.setAttribute('aria-hidden', 'false')
    celebrateHearts()
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
  }

  return { element: root, start: () => {} }
}
