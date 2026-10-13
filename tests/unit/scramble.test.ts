import { describe, it, expect } from 'vitest'
import { scrambleFrame } from '../../src/lib/scramble'

const text = 'hola mundo'
const fixedRandom = () => 0

describe('scrambleFrame', () => {
  it('devuelve el texto completo al 100%', () => {
    expect(scrambleFrame(text, 1, fixedRandom)).toBe(text)
  })

  it('conserva la longitud y los espacios', () => {
    const out = scrambleFrame(text, 0.5, fixedRandom)
    expect(out).toHaveLength(text.length)
    expect(out[4]).toBe(' ')
  })

  it('congela el prefijo resuelto según el progreso', () => {
    const out = scrambleFrame(text, 0.5, fixedRandom)
    const revealed = Math.floor(text.length * 0.5)
    expect(out.slice(0, revealed)).toBe(text.slice(0, revealed))
  })

  it('sustituye los caracteres no resueltos por ruido', () => {
    const out = scrambleFrame(text, 0, fixedRandom)
    expect(out).not.toBe(text)
  })
})
