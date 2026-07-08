import { config } from 'node:process';
import type { FullConfig } from '@playwright/test';
import { chromium} from '@playwright/test';
async function globalSetup(config: FullConfig) {
const url= config.projects[0].use.baseURL;
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
  
    await browser.close();
  

}

export default globalSetup;