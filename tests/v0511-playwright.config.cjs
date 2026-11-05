'use strict';
const path=require('node:path'),{defineConfig,devices}=require('@playwright/test');
module.exports=defineConfig({testDir:__dirname,testMatch:'visual-v0511.spec.cjs',timeout:90000,expect:{timeout:15000},workers:2,retries:0,reporter:[['list'],['html',{outputFolder:path.resolve(__dirname,'../artifacts/v0511-playwright-report'),open:'never'}]],outputDir:path.resolve(__dirname,'../artifacts/v0511-test-results'),projects:[{name:'chromium',use:{...devices['Desktop Chrome']}},{name:'firefox',use:{...devices['Desktop Firefox']}},{name:'webkit',use:{...devices['Desktop Safari']}}]});
