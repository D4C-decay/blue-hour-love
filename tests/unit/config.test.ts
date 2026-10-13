import { describe, it, expect } from 'vitest'
import { config, greeting } from '../../src/lib/config'

describe('config', () => {
  it('contiene los datos mínimos para Fase 1', () => {
    expect(config.to).toBe('Amy')
    expect(config.from).toBe('Eddy')
    expect(config.quote).toMatch(/un amor verdadero/i)
    expect(config.tvStatic.message).toMatch(/sintonizar es la tuya/i)
  })

  it('greeting devuelve "Para Amy"', () => {
    expect(greeting(config)).toBe('Para Amy')
  })
})
