import { test, expect } from './fixtures/test';

test.describe('Ordenação de produtos', () => {
  test('ordena por nome A-Z', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('az');

    const names = await inventoryPage.getNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));

    expect(names).toEqual(sorted);
  });

  test('ordena por nome Z-A', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');

    const names = await inventoryPage.getNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));

    expect(names).toEqual(sorted);
  });

  test('ordena por preço crescente', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getPrices();
    const sorted = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sorted);
  });

  test('ordena por preço decrescente', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');

    const prices = await inventoryPage.getPrices();
    const sorted = [...prices].sort((a, b) => b - a);

    expect(prices).toEqual(sorted);
  });
});
