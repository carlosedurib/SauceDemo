import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login';

test.describe('Login SauceDemo', () => {
  test('deve logar com sucesso e exibir a lista de produtos', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });
});
