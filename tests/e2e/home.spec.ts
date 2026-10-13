import { test, expect } from '@playwright/test'

test('carga y muestra hero + TV (Fase 1)', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Blue Hour Love')
  await expect(page.getByText('Para Amy')).toBeVisible()
  await expect(page.getByRole('button', { name: /Sintonizar/i })).toBeVisible()
  await expect(page.getByText(/Agita el teléfono o mantén pulsada/i)).toBeVisible()
})

test('revela mensaje al mantener pulsado el botón (fallback accesible)', async ({ page }) => {
  await page.goto('/')
  const button = page.getByRole('button', { name: /Sintonizar/i })
  await button.focus()
  await page.keyboard.down('Enter')
  // Espera a que la TV se sintonice (progreso lento; damos margen)
  await expect(page.locator('.tv.is-tuned .tv__message')).toBeVisible({ timeout: 7000 })
  await expect(page.locator('.tv').getByRole('status')).toContainText(/señal|sintonizar/i)
  await page.keyboard.up('Enter')
})
