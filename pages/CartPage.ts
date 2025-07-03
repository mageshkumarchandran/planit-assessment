import { Locator, Page, expect } from '@playwright/test';
import { Utils } from '../utils/utils';


export class CartPage {
  readonly page: Page;
  readonly tableHeder: Locator;
  readonly tableBody: Locator;
  readonly menuCart: Locator;
  readonly total: Locator
  constructor(page: Page) {
    this.page = page;
    this.tableHeder = page.locator('table th');
    this.tableBody = page.locator('table tbody tr');
    this.total = page.locator('strong', { hasText: 'Total' });
    this.menuCart = page.getByRole('link', { name: 'Cart (' });

  }


  async getTableColumnIndex(column: string, locator: Locator): Promise<number> {
    const getHeaders: string[] = await locator.allTextContents();
    return getHeaders.findIndex(header => header.trim() === column);

  }
  async covertTextToNumber(text: string): Promise<number> {

    return parseFloat(text);

  }
  async sumValuesFromSpecificColumnInTable(column: string, headerLocator: Locator, bodyLocator: Locator): Promise<number> {
    await this.page.waitForSelector('table');
    const indeex = await this.getTableColumnIndex(column, headerLocator)
    const val = await this.tableBody.locator(`td:nth-child(${indeex + 1})`).allTextContents();
    const total = val.map(text => parseFloat(text.replace(/[^0-9.]/g, '')));
    return total.reduce((sum, val) => sum + val, 0);

  }
  async getValueFromSpecificColumnInTable(product: string, column: string): Promise<string> {
    let val = null;
    const indeex = await this.getTableColumnIndex(column, this.tableHeder)
    if (column != 'Quantity') {
      val = await this.tableBody.filter({ hasText: product }).locator(`td:nth-child(${indeex + 1})`).textContent() ?? '';
    }
    else {
      val = await this.tableBody.filter({ hasText: product }).locator(`td:nth-child(${indeex + 1}) input`).getAttribute('value') ?? '';

    }
    return val;
  }


  async validateTotal(price: string) {
    await this.page.waitForSelector('table');
    const actual = await this.total.textContent()

    const tt = await this.sumValuesFromSpecificColumnInTable(price, this.tableHeder, this.tableBody);
    await expect(actual).toContain(tt.toString());


  }

  async validateSubtotal(product: string[], price: string, quality: string) {
    for (const productw of product) {

      const priceValaue = await this.getValueFromSpecificColumnInTable(productw, price);
      const QuantityValaue = await this.getValueFromSpecificColumnInTable(productw, quality);
      let expected = Utils.removeNonDigits(priceValaue) * Utils.removeNonDigits(QuantityValaue);
      const actual = await this.getValueFromSpecificColumnInTable(productw, 'Subtotal');
      await expect(actual).toEqual(Utils.formatCurrency(expected));
    }
  }

  async validatePrice(product: string[], mapp: Map<string, string>) {
    for (const productw of product) {
      const actual = await this.getValueFromSpecificColumnInTable(productw, 'Price');
      const expected = mapp.get(productw);
      await expect(actual).toEqual(expected);
    }
  }


}