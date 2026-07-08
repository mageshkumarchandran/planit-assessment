import { Locator } from "@playwright/test";

export class Utils {
  static async waitForElementToHidden(locator: Locator): Promise<string> {
    return (await locator.waitFor({ state: "hidden" })) ?? "";
  }

  static async getAttributeValue(
    locator: Locator,
    attribute: string,
  ): Promise<string> {
    return (await locator.getAttribute(attribute)) ?? "";
  }

  static removeNonDigits(attribute: string): number {
    return parseFloat(attribute.replace(/[^0-9.]/g, ""));
  }
  static covertToNumber(value: string | null): number {
    return Number(value?.replace(/[^0-9.-]/g, ""));
  }
}
