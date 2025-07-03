import { Locator, Page, expect } from '@playwright/test';
import { Utils } from '../utility/utils';


export class CartPage {
  readonly page: Page;
  readonly tableHeader: Locator;
  readonly tableBody: Locator;
  readonly menuCart: Locator;
  readonly totalAmount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tableHeader = page.locator('table th');
    this.tableBody = page.locator('table tbody tr');
    this.totalAmount = page.locator('strong', { hasText: 'Total' });
    this.menuCart = page.getByRole('link', { name: 'Cart (' });

  }

  async getTableColumnIndex(columnName: string, tableHeader: Locator): Promise<number> 
  {
    const allColumnNames: string[] = await tableHeader.allTextContents();
    return allColumnNames.findIndex(header => header.trim() === columnName);
  }
  
  async sumColumnValues(columnName: string, tableHeader: Locator): Promise<number> {

    const columnIndex = await this.getTableColumnIndex(columnName, tableHeader)
    const cellTexts = await this.tableBody.locator(`td:nth-child(${columnIndex + 1})`).allTextContents();
    const numericValues = cellTexts.map(text => Utils.removeNonDigits(text));
    const total=numericValues.reduce((sum, val) => sum + val, 0);

    return total;

  }
  async getColumnValues(product: string, columnName: string): Promise<string> {
    let columnValue:string;
    const columnIndex = await this.getTableColumnIndex(columnName, this.tableHeader)
    if (columnName != 'Quantity') 
      columnValue = await this.tableBody.filter({ hasText: product }).locator(`td:nth-child(${columnIndex + 1})`).textContent() ?? '';
    else 
      columnValue = await this.tableBody.filter({ hasText: product }).locator(`td:nth-child(${columnIndex + 1}) input`).getAttribute('value') ?? '';

    return columnValue;
  }


  async validateTotal(columnName: string) {
    await this.page.waitForSelector('table');
    const actualTotal = await this.totalAmount.textContent()
    const expectedTotal = await this.sumColumnValues(columnName, this.tableHeader);

    await expect(actualTotal).toContain(expectedTotal.toString());

  }

  async validateSubtotal(productNames: string[], priceColumn: string, qualityColumn: string) {

    for (const product of productNames) {

      const priceValue = await this.getColumnValues(product, priceColumn);
      const quantityValue = await this.getColumnValues(product, qualityColumn);
      const expectedSubTotal = Utils.removeNonDigits(priceValue) * Utils.removeNonDigits(quantityValue);
      const actualSubTotal = await this.getColumnValues(product, 'Subtotal');

      await expect(actualSubTotal).toEqual(Utils.formatCurrency(expectedSubTotal));
    }
  }

  //This function compares the selected product price from Shop page with the Cart page
  async validatePrice(productNames: string[], priceMap: Map<string, string>) {
    for (const product of productNames) {
      const actualPrice = await this.getColumnValues(product, 'Price');
      const expectedPrice = priceMap.get(product);

      await expect(actualPrice).toEqual(expectedPrice);
    }
  }


}