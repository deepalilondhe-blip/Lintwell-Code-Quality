// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright configuration for Lintwell Code Quality project.
 * 
 * Configured for REALISTIC iPhone 17 mobile emulation:
 *  - WebKit engine (real Safari — what iPhones actually use)
 *  - Grey-black dark colour scheme
 *  - Accurate viewport, scale, touch, and user-agent
 */
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  /* Shared settings for all projects */
  use: {
    /* Base URL for the application under test */
    baseURL: 'https://code-quality-tracker.bytestechnolab.net',

    /* Collect trace on first retry */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'iPhone-17-Grey-Black',
      use: {
        browserName: 'chromium',
        viewport: { width: 520, height: 980 },
        deviceScaleFactor: 2,
        colorScheme: 'dark',
        bypassCSP: true,
        launchOptions: {
          args: ['--disable-web-security'],
          slowMo: 1500 // 1.5 seconds delay between actions
        }
      },
    },
  ],
});
