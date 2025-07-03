import { Locator, Page } from '@playwright/test';

import testData from '../test-data/testData.json';

export class ShopPage {
  readonly page: Page;
  readonly listProduct: Locator;
  readonly menuShop: Locator;

  constructor(page: Page) {
    this.page = page;
    this.listProduct = page.locator('li');
    this.menuShop = page.getByRole('link',{name:'Shop',exact: true });
 
  }

  async getProductPrice(product:string[]):Promise<Map<string, string>>
  {
    const pricesMap = new Map<string, string>();
    for (const name of product) {
    const price=await this.listProduct.filter({hasText:name});
    const tt=await price.locator('span').textContent();
    pricesMap.set(name, tt?? '');
   
    }
     return pricesMap;
  }

 async addProducts() {
    for (const product of testData.products) {
    for (let i = 0; i < product.count; i++) {
      const productName:Locator=this.listProduct.filter({hasText:product.name});
      await productName.getByRole('link',{name:'Buy'}).click();
     
    }
  }    
 } 


}