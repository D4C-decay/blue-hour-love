import { describe, it, expect } from 'vitest'
import { galleryVariant } from '../../src/lib/gallery-layout'

describe('galleryVariant', () => {
  it('es determinista para un mismo índice', () => {
    expect(galleryVariant(3)).toEqual(galleryVariant(3))
  })

  it('reparte estática y quemaduras entre 13 polaroids', () => {
    const variants = Array.from({ length: 13 }, (_, i) => galleryVariant(i))
    expect(variants.some((v) => v.static)).toBe(true)
    expect(variants.some((v) => v.burn)).toBe(true)
  })

  it('nunca marca estática y quemadura a la vez', () => {
    for (let i = 0; i < 13; i += 1) {
      const v = galleryVariant(i)
      expect(v.static && v.burn).toBe(false)
    }
  })

  it('inclina todas las polaroids dentro de un rango suave', () => {
    for (let i = 0; i < 13; i += 1) {
      expect(Math.abs(galleryVariant(i).tilt)).toBeLessThanOrEqual(3)
    }
  })
})
