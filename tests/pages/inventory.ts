import { type Page, type Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly sortDropdown: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly items: Locator;
  readonly itemPrices: Locator;
  readonly itemNames: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.items = page.locator('.inventory_item');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.itemNames = page.getByTestId('inventory-item-name');
  }

  private addToCartButton(productSlug: string): Locator {
    return this.page.getByTestId(`add-to-cart-${productSlug}`);
  }

  async addToCartBySlug(productSlug: string) {
    await this.addToCartButton(productSlug).click();
  }

  async addFirstItemToCart() {
    await this.items.first().getByRole('button', { name: /add to cart/i }).click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async getPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  async getNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
