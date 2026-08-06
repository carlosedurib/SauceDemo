import { type Page, type Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
    this.checkoutButton = page.getByTestId('checkout');
  }

  removeButton(productSlug: string): Locator {
    return this.page.getByTestId(`remove-${productSlug}`);
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
