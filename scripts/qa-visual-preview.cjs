'use strict';
const {chromium}=require('@playwright/test');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
(async()=>{
const browser=await chromium.launch({headless:true});
const href=pathToFileURL(path.resolve(__dirname,'../荒謬市長_v0.3.html')).href;
const presets=[
  {name:'mobile-nl-build',w:390,h:844,lang:'nl',phase:'build'},
  {name:'mobile-fr-admin',w:390,h:844,lang:'fr',phase:'admin'},
  {name:'tablet-nl-build',w:1024,h:768,lang:'nl',phase:'build'},
  {name:'mobile-zh-ending',w:390,h:844,lang:'zh',phase:'ending'},
  {name:'desktop-en-build',w:1440,h:900,lang:'en',phase:'build'}
];
for(const item of presets){
 const context=await browser.newContext({viewport:{width:item.w,height:item.h}});
 const page=await context.newPage();
 await page.goto(href);
 await page.locator('.lang select').selectOption(item.lang);
 await page.locator('#modal [data-v2="close"]').click();
 if(item.phase==='ending'){
  for(let i=0;i<12;i++){
   await page.locator('[data-v2="policy"]').first().click();
   await page.locator('[data-v2="action-tab"][data-tab="defer"]').click();
   await page.locator('[data-v2="defer"]').click();
   await page.locator('[data-v2="settle"]').click();
  }
 } else {
  await page.locator('[data-v2="policy"]').first().click();
  await page.locator('[data-v2="tile"][data-index="0"]').click();
  if(item.phase==='admin')await page.locator('[data-v2="action-tab"][data-tab="admin"]').click();
 }
 const jpeg=await page.screenshot({type:'jpeg',quality:43,fullPage:item.phase!=='ending'});
 console.log('QA_IMAGE_START '+item.name);
 console.log(jpeg.toString('base64'));
 console.log('QA_IMAGE_END '+item.name);
 await context.close();
}
await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
