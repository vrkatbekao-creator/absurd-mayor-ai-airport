'use strict';
const { defineConfig, devices } = require('@playwright/test');
module.exports = defineConfig({
  testDir: __dirname,
  testMatch: 'visual-v04.spec.cjs',
  timeout: 60000,
  expect: {timeout:15000},
  workers:2,retries:0,
  reporter: [['list'],['html',{outputFolder:'artifacts/v04-playwright-report',open:'never'}]],
  outputDir:'artifacts/v04-test-results',
  projects:[
    {name:'chromium',use:{...devices['Desktop Chrome']}},
    {name:'firefox',use:{...devices['Desktop Firefox']}},
    {name:'webkit',use:{...devices['Desktop Safari']}}
  ]
});
