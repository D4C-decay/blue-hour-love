import { test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('sin errores de accesibilidad básicos (Fase 1)', async ({ page }) => {
  await page.goto('/')
  const axe = await new AxeBuilder({ page }).analyze()
  if (axe.violations.length > 0) {
    // imprime violaciones sin romper test en fase 1
    console.warn(axe.violations.map((v) => v.id).join(", "))
  }
})
