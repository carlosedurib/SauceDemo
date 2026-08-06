import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login';
import { users } from './fixtures/users';

test.describe('Login', () => {
  test('login com sucesso redireciona para a lista de produtos', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('usuário bloqueado recebe mensagem de erro e permanece na tela de login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('senha incorreta exibe mensagem de credenciais inválidas', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, 'senha_errada');

    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match any user in this service'
    );
  });

  test('campos vazios exibem erro pedindo o username', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('senha vazia exibe erro pedindo a senha', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.usernameInput.fill(users.standard.username);
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toContainText('Password is required');
  });
});
