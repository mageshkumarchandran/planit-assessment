import { defineConfig } from '@playwright/test';

export const browserName = 'chromium';

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