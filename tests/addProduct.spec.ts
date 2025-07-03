import { test } from '@playwright/test';
import { CartPage } from '../pages/CartPage'
import { ContactPage } from '../pages/ContactPage'
import { ShopPage } from '../pages/ShopPage'
import testData from '../test-data/testData.json'
import { generateContactData } from '../test-data/testDataGenerator';


let cartPage: CartPage;
let contactPage: ContactPage;
let shopPage: ShopPage;
test.beforeEach(async ({ page }) => {
  
  contactPage = new ContactPage(page);

  await page.goto('/');

});

test('Validate errors on contact screen @errorvalidation @aa', async ({}, testInfo) => {

  await contactPage.menuContact.click();
  await contactPage.buttonSubmit.click();
  await contactPage.validateErrorDescription([{ element: contactPage.errorForeName, errorKey: 'forename' },
  { element: contactPage.errorEmail, errorKey: 'email' },
  { element: contactPage.errorMessage, errorKey: 'message' }]);

  testInfo.annotations.push({
    type: 'info',
    description: 'Error messages has been validated successfully.',
  });

});

for (let i = 1; i <= 5; i++) {
  test(`Submit contact details ${i} @contactsubmit @aa`, async ({ }, testInfo) => {

    const data = generateContactData();
    await contactPage.menuContact.click();

    await contactPage.submitContactDetails(data);
    await contactPage.validateSuccess(testData.feedback);
    testInfo.annotations.push({
      type: 'info',
      description: `${1} st contact details submitted successfully`,
    });

  });
}

test('Add products aand validate price and total @addproduct @aa ', async ({ page }, testInfo) => {

  shopPage = new ShopPage(page);
  cartPage = new CartPage(page);
  await shopPage.menuShop.click();

  await shopPage.addProducts();
  const productNames = testData.products.map(product => product.name);
  const mag = await shopPage.getProductPrice(productNames);
  await cartPage.menuCart.click();
  await cartPage.validateTotal('Subtotal')
  await cartPage.validateSubtotal(productNames, 'Price', 'Quantity');
  await cartPage.validatePrice(productNames, mag);
  testInfo.annotations.push({
    type: 'info',
    description: 'Products added and validated successfully',
  });

});
