import { test, expect } from '@playwright/test'

test('la galería está bloqueada y pide contraseña', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Nuestra galería' })).toBeVisible()
  await expect(page.getByLabel('Contraseña')).toBeVisible()
  await expect(page.getByRole('button', { name: /Desbloquear/i })).toBeVisible()
  await expect(page.locator('.gallery__grid')).toBeHidden()
})

test('con contraseña incorrecta muestra error y no revela fotos', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Contraseña').fill('clave-incorrecta')
  await page.getByRole('button', { name: /Desbloquear/i }).click()
  await expect(page.getByRole('status')).toContainText(/incorrecta/i, {
    timeout: 15000,
  })
  await expect(page.locator('.gallery__grid')).toBeHidden()
})
