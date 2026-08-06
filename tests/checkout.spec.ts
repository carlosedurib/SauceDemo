import { test, expect } from './fixtures/test';
import { checkoutInfo } from './fixtures/users';

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartBySlug('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();
  });

  test('completar checkout com dados válidos exibe confirmação do pedido', async ({
    checkoutPage,
    page,
  }) => {
    await checkoutPage.fillInfo(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode
    );
    await checkoutPage.continueToOverview();

    await expect(page).toHaveURL(/checkout-step-two.html/);
    await expect(checkoutPage.summaryItems).toHaveCount(1);
    await expect(checkoutPage.totalLabel).toContainText('Total: $');

    await checkoutPage.finish();

    await expect(page).toHaveURL(/checkout-complete.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('total exibido é a soma do subtotal com o imposto', async ({ checkoutPage }) => {
    await checkoutPage.fillInfo(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode
    );
    await checkoutPage.continueToOverview();

    const subtotalText = await checkoutPage.subtotalLabel.textContent();
    const taxText = await checkoutPage.taxLabel.textContent();
    const totalText = await checkoutPage.totalLabel.textContent();

    const subtotal = parseFloat(subtotalText!.replace('Item total: $', ''));
    const tax = parseFloat(taxText!.replace('Tax: $', ''));
    const total = parseFloat(totalText!.replace('Total: $', ''));

    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test('nome em branco impede avançar e exibe erro', async ({ checkoutPage }) => {
    await checkoutPage.fillInfo('', checkoutInfo.lastName, checkoutInfo.postalCode);
    await checkoutPage.continueToOverview();

    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('sobrenome em branco impede avançar e exibe erro', async ({ checkoutPage }) => {
    await checkoutPage.fillInfo(checkoutInfo.firstName, '', checkoutInfo.postalCode);
    await checkoutPage.continueToOverview();

    await expect(checkoutPage.errorMessage).toContainText('Last Name is required');
  });

  test('CEP em branco impede avançar e exibe erro', async ({ checkoutPage }) => {
    await checkoutPage.fillInfo(checkoutInfo.firstName, checkoutInfo.lastName, '');
    await checkoutPage.continueToOverview();

    await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
  });

  test('cancelar no overview retorna para a lista de produtos', async ({ checkoutPage, page }) => {
    await checkoutPage.fillInfo(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode
    );
    await checkoutPage.continueToOverview();

    await checkoutPage.cancelButton.click();

    await expect(page).toHaveURL(/inventory.html/);
  });
});
