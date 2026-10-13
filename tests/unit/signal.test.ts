import { describe, it, expect } from 'vitest'
import {
  clamp,
  approach,
  accelerationMagnitude,
  shakeToProgress,
  staticAmount,
  isTuned,
} from '../../src/lib/signal'

describe('signal helpers', () => {
  it('clamp respeta límites', () => {
    expect(clamp(1.5)).toBe(1)
    expect(clamp(-0.5)).toBe(0)
    expect(clamp(0.4)).toBe(0.4)
  })

  it('approach se acerca al objetivo', () => {
    expect(approach(0, 1, 0.25)).toBeCloseTo(0.25)
    expect(approach(0.75, 1, 1)).toBe(1)
  })

  it('accelerationMagnitude calcula hipotenusa', () => {
    expect(accelerationMagnitude({ x: 3, y: 4, z: 0 })).toBeCloseTo(5)
    expect(accelerationMagnitude(null)).toBe(0)
    expect(accelerationMagnitude({})).toBe(0)
  })

  it('shakeToProgress solo responde sobre umbral', () => {
    expect(shakeToProgress(5)).toBe(0)
    expect(shakeToProgress(13)).toBeGreaterThan(0)
  })

  it('staticAmount decrece al subir progreso', () => {
    expect(staticAmount(0)).toBeCloseTo(1)
    expect(staticAmount(1)).toBeCloseTo(0)
  })

  it('isTuned detecta umbral', () => {
    expect(isTuned(0.97)).toBe(false)
    expect(isTuned(0.98)).toBe(true)
    expect(isTuned(1)).toBe(true)
  })
})
