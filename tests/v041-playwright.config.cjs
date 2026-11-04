'use strict';
const { defineConfig, devices } = require('@playwright/test');
module.exports = defineConfig({
  testDir: __dirname,
  testMatch: 'visual-v041.spec.cjs',
  timeout: 60000,
  expect: {timeout:15000},
  workers:2,retries:0,
  reporter: [['list'],['html',{outputFolder:'artifacts/v041-playwright-report',open:'never'}]],
  outputDir:'artifacts/v041-test-results',
  projects:[
    {name:'chromium',use:{...devices['Desktop Chrome']}},
    {name:'firefox',use:{...devices['Desktop Firefox']}},
    {name:'webkit',use:{...devices['Desktop Safari']}}
  ]
});
