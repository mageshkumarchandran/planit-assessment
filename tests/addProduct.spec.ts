import { test } from '@playwright/test';
import { CartPage } from '../pages/CartPage'
import { ContactPage } from '../pages/ContactPage'
import { ShopPage } from '../pages/ShopPage'
import testData from '../test-data/testData.json'
import { generateContactData } from '../test-data/testDataGenerator';
import { errorDescription } from '../interfaces/interface'


let cartPage: CartPage;
let contactPage: ContactPage;
let shopPage: ShopPage;
test.beforeEach(async ({ page }) => {

  contactPage = new ContactPage(page);
  await page.goto('/');

});

test('Validate errors on contact screen @errorValidation @executeTest', async ({ }, testInfo) => {

  await contactPage.menuContact.click();
  await contactPage.buttonSubmit.click();

  //create object with element locators and error descriptions
  const errors: errorDescription[] = [{ element: contactPage.errorForeName, errorKey: 'forename' },
  { element: contactPage.errorEmail, errorKey: 'email' },
  { element: contactPage.errorMessage, errorKey: 'message' }]

  await contactPage.validateErrorDescription(errors);

  testInfo.annotations.push({
    type: 'info',
    description: 'Error messages has been validated successfully.',
  });

});

for (let i = 1; i <= 5; i++) {
  test(`Submit contact details ${i} @contactSubmit @executeTest`, async ({ }, testInfo) => {

    //test data is unique for each iterations
    const data = generateContactData();

    await contactPage.menuContact.click();
    await contactPage.submitContactDetails(data);
    await contactPage.validateSubmission(testData.feedback);

    testInfo.annotations.push({
      type: 'info',
      description: `${1} st contact details submitted successfully`,
    });

  });
}

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
