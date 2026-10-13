import { test, expect } from '@playwright/test'

test('razones: TVs con estática revelan al pulsar y no existe el mazo', async ({ page }) => {
  await page.goto('/')

  const reasons = page.locator('#reasons')
  await reasons.scrollIntoViewIfNeeded()

  await expect(page.getByText('Cosas que amo de ti')).toBeVisible()
  await expect(page.getByText('Momentos que atesoro')).toHaveCount(0)
  await expect(page.getByText('Secretitos')).toBeVisible()

  const firstTv = reasons.locator('.minitv').first()
  await expect(firstTv.locator('.minitv__msg')).toHaveCSS('opacity', '0')
  await firstTv.click()
  await expect(firstTv).toHaveClass(/is-tuned/)
  await expect(firstTv.locator('.minitv__msg')).toBeVisible()
  await expect(firstTv.locator('.minitv__msg')).toHaveText(/Por cómo iluminas/)

  const secondGroupTv = reasons.locator('.reasons__group').nth(1).locator('.minitv').first()
  await secondGroupTv.click()
  await expect(secondGroupTv.locator('.minitv__msg')).toBeVisible()
  await expect(secondGroupTv.locator('.minitv__msg')).toHaveText(/Tu mano buscando/)
})
