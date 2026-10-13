import { el } from '../lib/dom'
import type { LoveConfig } from '../lib/config'
import type { Section } from './hero'

export function initReasons(cfg: LoveConfig): Section {
  const root = el('section', 'reasons')
  root.id = 'reasons'

  const title = el('h2', 'reasons__title', 'Razones por las que te amo')

  const flipWrap = el('div', 'reasons__group')
  const flipTitle = el('h3', 'reasons__subtitle', 'Cosas que amo de ti')
  const flipGrid = el('div', 'reasons__flipgrid')
  cfg.reasons.flip.forEach((text) => {
    const card = el('button', 'flipcard', '')
    card.type = 'button'
    const front = el('div', 'flipcard__face flipcard__face--front', '❤️')
    const back = el('div', 'flipcard__face flipcard__face--back', text)
    card.append(front, back)
    card.addEventListener('click', () => card.classList.toggle('is-flipped'))
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        card.classList.toggle('is-flipped')
      }
    })
    flipGrid.append(card)
  })
  flipWrap.append(flipTitle, flipGrid)

  const deckWrap = el('div', 'reasons__group')
  const deckTitle = el('h3', 'reasons__subtitle', 'Momentos que atesoro')
  const deckStack = el('div', 'deck')
  const deckPrev = el('button', 'deck__btn', '‹')
  const deckNext = el('button', 'deck__btn', '›')
  const deckDots = el('div', 'deck__dots')
  const deckNav = el('div', 'deck__nav')
  deckNav.append(deckPrev, deckNext)
  deckWrap.append(deckTitle, deckStack, deckNav, deckDots)

  let deckIdx = 0
  function renderDeck() {
    deckStack.innerHTML = ''
    cfg.reasons.deck.forEach((text, i) => {
      const card = el('article', 'deck__card', text)
      card.style.setProperty('--i', String(i - deckIdx))
      deckStack.append(card)
    })
    deckDots.innerHTML = ''
    cfg.reasons.deck.forEach((_, i) => {
      const dot = el('span', i === deckIdx ? 'deck__dot is-active' : 'deck__dot')
      deckDots.append(dot)
    })
  }
  deckPrev.addEventListener('click', () => {
    deckIdx = (deckIdx - 1 + cfg.reasons.deck.length) % cfg.reasons.deck.length
    renderDeck()
  })
  deckNext.addEventListener('click', () => {
    deckIdx = (deckIdx + 1) % cfg.reasons.deck.length
    renderDeck()
  })
  renderDeck()

  const scratchWrap = el('div', 'reasons__group')
  const scratchTitle = el('h3', 'reasons__subtitle', 'Secretitos')
  const scratchGrid = el('div', 'reasons__scratchgrid')
  cfg.reasons.scratch.forEach((text) => {
    const card = el('div', 'scratchcard')
    const reveal = el('div', 'scratchcard__reveal', text)
    const cover = el('div', 'scratchcard__cover', 'RASCA')
    card.append(reveal, cover)
    let revealed = false
    function revealCard() {
      if (revealed) return
      revealed = true
      cover.style.opacity = '0'
      setTimeout(() => cover.remove(), 600)
    }
    card.addEventListener('pointerdown', revealCard)
    card.addEventListener('pointermove', () => {})
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        revealCard()
      }
    })
    scratchGrid.append(card)
  })
  scratchWrap.append(scratchTitle, scratchGrid)

  root.append(title, flipWrap, deckWrap, scratchWrap)
  return { element: root }
}
