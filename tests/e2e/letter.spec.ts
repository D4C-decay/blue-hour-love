import { test, expect } from '@playwright/test'

test('la carta revela el texto nuevo al abrir el sobre', async ({ page }) => {
  await page.goto('/')

  const letter = page.locator('#letter')
  await letter.scrollIntoViewIfNeeded()

  await expect(letter.getByText('Una carta para ti')).toBeVisible()
  await letter.getByRole('button', { name: /Abre la carta/i }).click()

  await expect(letter.locator('.letter__text')).toContainText(
    /más hermosa, te amo con la certeza egoísta/i,
    { timeout: 12000 },
  )
})
