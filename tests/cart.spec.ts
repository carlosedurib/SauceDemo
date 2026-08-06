import { test, expect } from './fixtures/test';

test.describe('Carrinho', () => {
  test('adicionar produto exibe badge com contagem correta', async ({ inventoryPage }) => {
    await inventoryPage.addToCartBySlug('sauce-labs-backpack');

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('adicionar múltiplos produtos soma o badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCartBySlug('sauce-labs-backpack');
    await inventoryPage.addToCartBySlug('sauce-labs-bike-light');

    await expect(inventoryPage.cartBadge).toHaveText('2');
  });

  test('produto adicionado aparece no carrinho com nome e preço corretos', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addToCartBySlug('sauce-labs-backpack');
    await inventoryPage.goToCart();

    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.cartItems.first()).toContainText('Sauce Labs Backpack');
    await expect(cartPage.cartItems.first()).toContainText('$29.99');
  });

  test('remover produto do carrinho zera a lista e o badge', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartBySlug('sauce-labs-backpack');
    await inventoryPage.goToCart();

    await cartPage.removeButton('sauce-labs-backpack').click();

    await expect(cartPage.cartItems).toHaveCount(0);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('continuar comprando retorna para a lista de produtos', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartBySlug('sauce-labs-backpack');
    await inventoryPage.goToCart();

    await cartPage.continueShoppingButton.click();

    await expect(inventoryPage.page).toHaveURL(/inventory.html/);
  });
});
