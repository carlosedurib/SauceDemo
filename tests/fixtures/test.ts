import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { InventoryPage } from '../pages/inventory';
import { CartPage } from '../pages/cart';
import { CheckoutPage } from '../pages/checkout';
import { users } from './users';

type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

test.beforeEach(async ({ page, loginPage, inventoryPage }) => {
  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);
  await page.waitForURL(/inventory.html/);
  await inventoryPage.sortDropdown.waitFor({ state: 'visible' });
});

export { expect } from '@playwright/test';
