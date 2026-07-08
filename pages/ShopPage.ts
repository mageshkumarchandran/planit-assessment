import { Locator, Page } from '@playwright/test';
import { products } from '../interfaces/interface';

import testData from '../test-data/testData.json';

export class ShopPage {
  readonly page: Page;
  readonly listProduct: Locator;
  readonly menuShop: Locator;

  constructor(page: Page) {
    this.page = page;
    this.listProduct = page.locator('li');
    this.menuShop = page.getByRole('link', { name: 'Shop', exact: true });

  }

  /**
   * Create map with product and price details on shop page
   * @param products - list of products to be added
   * @returns Map containing product as name and price as value
   */
  async getProductPrice(products: string[]): Promise<Map<string, string>> {
    const pricesMap = new Map<string, string>();
    for (const product of products) {
      const productRow = await this.listProduct.filter({ hasText: product });
      const price = await productRow.locator('span').textContent();
      pricesMap.set(product, price ?? '');

    }
    return pricesMap;
  }

 /**
  * 
  * @param productList - list of products to be added
  */
  async addProducts(productList:products[]) {
    for (const product of productList) {
      for (let i = 0; i < product.count; i++) {
        const productName: Locator = this.listProduct.filter({ hasText: product.name });
        await productName.getByRole('link', { name: 'Buy' }).click();

      }
    }
  }

}