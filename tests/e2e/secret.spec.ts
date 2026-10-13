import { test, expect } from '@playwright/test'

test('mensaje secreto: la radio se sintoniza al pulsar la antena', async ({ page }) => {
  await page.goto('/')

  const secret = page.locator('#secret')
  await secret.scrollIntoViewIfNeeded()

  const antenna = secret.getByRole('button', { name: 'Encender la radio' })
  await expect(antenna).toBeVisible()
  await expect(secret.locator('.radio__msg')).toHaveAttribute('aria-hidden', 'true')

  await antenna.click()

  await expect(secret).toHaveClass(/is-tuned/, { timeout: 8000 })
  await expect(secret.locator('.radio__msg')).toHaveAttribute('aria-hidden', 'false')
  await expect(secret.locator('.radio__msg')).toContainText(/mil y una películas de amor/i)
  await expect(secret.locator('.secret__status')).toContainText(/mil y una películas/i)
})
