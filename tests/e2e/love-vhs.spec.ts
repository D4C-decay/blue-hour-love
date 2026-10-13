import { test, expect } from '@playwright/test'

test('¿Me amas? : al pulsar "Sí" aparece el corazón 8-bit y el mensaje', async ({ page }) => {
  await page.goto('/')

  const love = page.locator('#lovevhs')
  await love.scrollIntoViewIfNeeded()

  await expect(love.getByRole('button', { name: 'Sí' })).toBeVisible()
  await expect(love.locator('.pixel-sad')).toBeVisible()
  await expect(love.locator('.lovevhs__msg')).toHaveAttribute('aria-hidden', 'true')

  await love.getByRole('button', { name: 'Sí' }).click()

  await expect(love).toHaveClass(/is-yes/)
  await expect(love.locator('.pixel-heart')).toBeVisible()
  await expect(love.locator('.lovevhs__msg')).toBeVisible()
  await expect(love.locator('.lovevhs__msg')).toHaveText(/Sabía que dirías que sí/)
  await expect(page.locator('body > .heart-rain')).toBeAttached()
})

test('botón "No" cambia de texto al intentar esquivarlo', async ({ page }) => {
  await page.goto('/')

  const love = page.locator('#lovevhs')
  await love.scrollIntoViewIfNeeded()

  const no = love.locator('.lovevhs__btn--no')
  await expect(no).toHaveText('No')
  await no.dispatchEvent('pointerover')
  await expect(no).not.toHaveText('No')
})
