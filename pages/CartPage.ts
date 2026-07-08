import { Locator, Page, expect } from "@playwright/test";
import { Utils } from "../utility/utils";

export class CartPage {
  readonly page: Page;
  readonly tableHeader: Locator;
  readonly tableBody: Locator;
  readonly menuCart: Locator;
  readonly totalAmount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tableHeader = page.getByRole("columnheader");
    this.tableBody = page.locator("table tbody tr");
    this.totalAmount = page.getByText("Total:");
    this.menuCart = page.getByRole("link", { name: "Cart (" });
  }
  /**
   * Get the index of specific column in a table
   * @param columnName - name of the column in table
   * @param tableHeader -locator of the table header
   * @returns column index
   */
  async getTableColumnIndex(
    columnName: string,
    tableHeader: Locator,
  ): Promise<number> {
    const allColumnNames: string[] = await tableHeader.allTextContents();
    return allColumnNames.findIndex((header) => header.trim() === columnName);
  }

  /**
   * Sum the values from specific column in a table
   * @param columnName
   * @param tableHeader
   * @returns sum of values
   */
  async sumProductPrice(
    columnName: string,
    tableHeader: Locator,
  ): Promise<number> {
    const columnIndex:number = await this.getTableColumnIndex(columnName, tableHeader);
    const cellTexts:string[] = await this.tableBody
      .locator(`td:nth-child(${columnIndex + 1})`)
      .allTextContents();
    const numericValues:number[] = cellTexts.map((text) => Utils.removeNonDigits(text));
    const total:number = numericValues.reduce((sum, val) => sum + val, 0);

    return total;
  }

  /**
   * Get the value from specific column and row in a table
   * @param product -name of the product
   * @param columnName
   * @returns value of a specific cell
   */
  async getColumnValues(product: string, columnName: string): Promise<string> {
    let columnValue: string;
    const columnIndex:number = await this.getTableColumnIndex(
      columnName,
      this.tableHeader,
    );
    if (columnName != "Quantity")
      columnValue =
        (await this.tableBody
          .filter({ hasText: product })
          .locator(`td:nth-child(${columnIndex + 1})`)
          .textContent()) ?? "";
    else
      columnValue =
        (await this.tableBody
          .filter({ hasText: product })
          .locator(`td:nth-child(${columnIndex + 1}) input`)
          .getAttribute("value")) ?? "";

    return columnValue;
  }

  /**
   * Validates that the total amount matches the sum of product prices listed in the table.
   * @param columnName
   */
  async validateTotalPrice(columnName: string) {
    await this.page.waitForSelector("table");

    const total: string | null = await this.totalAmount.textContent();
    const actualTotal: number = Utils.covertToNumber(total);

    const expectedTotal: number = await this.sumProductPrice(
      columnName,
      this.tableHeader,
    );
    return actualTotal === expectedTotal;
  }

  /**
   *  * Validates that the sub total of each product matches the price multiplied by quantity in the table.
   * @param productNames  - list of products added
   * @param priceColumn   -column name(price)
   * @param qualityColumn  - column name(quantity)
   */
  async validateSubtotal(productNames: string[]) {
    const failures: string[] = [];
    for (const product of productNames) {
      const priceValue = await this.getColumnValues(product, "Price");
      const quantityValue = await this.getColumnValues(product, "Quantity");

      let expectedSubTotal: number =
        Utils.removeNonDigits(priceValue) *
        Utils.removeNonDigits(quantityValue);

      const subTotal: string = await this.getColumnValues(product, "Subtotal");

      const actualSubTotal: number = Utils.covertToNumber(subTotal);

      if (actualSubTotal !== expectedSubTotal)
        failures.push(product);
    }
    return failures;
  }

  /**
   *  Compare the selected product price from Shop page with the Cart page
   * @param productNames - list of products
   * @param priceMap - Map contains product as key and price as value
   */
  async validatePrice(productNames: string[], priceMap: Map<string, string>) {
    const mismatch: string[] = [];

    for (const product of productNames) {
      const actualPrice: string = await this.getColumnValues(product, "Price");
      const expectedPrice: string | undefined = priceMap.get(product);

      if (actualPrice !== expectedPrice)
        mismatch.push(
          product + ":" + "actual" + actualPrice + "expected:" + expectedPrice,
        );
    }
    return mismatch;
  }
}
