import { expect, test } from "@playwright/test";
import { CartPage } from "../pages/CartPage";
import { ShopPage } from "../pages/ShopPage";
import testData from "../test-data/testData.json";

let cartPage: CartPage;
let shopPage: ShopPage;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Add products and validate price and total @addProduct @executeTest ", async ({
  page,
}, testInfo) => {
  shopPage = new ShopPage(page);
  cartPage = new CartPage(page);

  await shopPage.menuShop.click();
  await shopPage.addProducts(testData.products);

  const productNames: string[] = testData.products.map(
    (product) => product.name,
  );
  const productPrice = await shopPage.getProductPrice(productNames);

  await cartPage.menuCart.click();

  await expect(
    await cartPage.validateTotalPrice("Subtotal"),
    "Total price is incorrect",
  ).toBe(true);

  const mismatch = await cartPage.validateSubtotal(productNames);

  await expect(
    mismatch,
    `Sub total is incorrect for products:${mismatch.join(",")}`,
  ).toHaveLength(0);

  const incorrectPrice = await cartPage.validatePrice(
    productNames,
    productPrice,
  );

  await expect(
    incorrectPrice,
    `Incorrect price for products:${incorrectPrice.join(",")}`,
  ).toHaveLength(0);

  testInfo.annotations.push({
    type: "info",
    description: "Products added and validated successfully",
  });
});
