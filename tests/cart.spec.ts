import { test } from '@playwright/test';
import { CartPage } from '../pages/CartPage'
import { ShopPage } from '../pages/ShopPage'
import testData from '../test-data/testData.json'

let cartPage: CartPage;
let shopPage: ShopPage;

test.beforeEach(async ({ page }) => {
    await page.goto('/');

});


test('Add products and validate price and total @addProduct @executeTest ', async ({ page }, testInfo) => {

  shopPage = new ShopPage(page);
  cartPage = new CartPage(page);

  await shopPage.menuShop.click();
  await shopPage.addProducts(testData.products);

  const productNames = testData.products.map(product => product.name);
  const productPrice = await shopPage.getProductPrice(productNames);

  await cartPage.menuCart.click();
  await cartPage.validateTotal('Subtotal')
  await cartPage.validateSubtotal(productNames, 'Price', 'Quantity');
  await cartPage.validatePrice(productNames, productPrice);

  testInfo.annotations.push({
    type: 'info',
    description: 'Products added and validated successfully',
  });

});
