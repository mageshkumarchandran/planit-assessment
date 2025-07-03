import { chromium, defineConfig } from '@playwright/test';

type BrowserName = 'chromium' | 'firefox' | 'webkit';
const browser = process.env.BROWSER;

const browserName: BrowserName = isBrowserName(browser) ? browser : 'chromium';

export default defineConfig({
  reporter: [['html', { open: 'always' }]],
  testDir: './tests',
  projects: [
    {
      name: 'Toys application',
      use: {
        baseURL: 'http://jupiter.cloud.planittesting.com',
        headless: false,
        browserName,
      },
    }
  ]
});

function isBrowserName(browser: string | undefined): browser is BrowserName {
  return browser === 'chromium' || browser === 'firefox' || browser === 'webkit';
}