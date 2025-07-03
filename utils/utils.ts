import { Locator, Page } from '@playwright/test';


export class Utils {

//Validate response Body
 static async  waitForElementToHidden(page:Page,locator:string) {
 await page.locator('h1',{ hasText: 'Sending Feedback' }).waitFor({ state: 'hidden' });
  }

  static async  getAttributeValue(locator:Locator,attribute:string) {
 await locator.getAttribute(attribute);
  }

   static  removeNonDigits(attribute:string) {
    return parseFloat(attribute.replace(/[^0-9.]/g, ''));
  }

  static formatCurrency(value:number):string
  {
    
const formatter = new Intl.NumberFormat('en-NZ', {
  style: 'currency',
  currency: 'NZD',
});

const formatted = formatter.format(value);
return formatted;
  }

}

