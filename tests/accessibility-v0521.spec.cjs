'use strict';
const {test,expect}=require('@playwright/test'),path=require('node:path'),{pathToFileURL}=require('node:url');
const url=pathToFileURL(path.resolve(__dirname,'../荒謬市長_v0.5.2.1.html')).href;
for(const lang of ['zh','en','fr','nl'])test('intro click and Escape restore stable policy focus, translated language name '+lang,async({page})=>{
 await page.goto(url);await page.locator('.lang select').selectOption(lang);await expect(page.locator('.lang select')).toHaveAccessibleName(({zh:'介面語言',en:'Interface language',fr:'Langue de l’interface',nl:'Interfacetaal'})[lang]);await expect(page.locator('#introtitle')).toBeFocused();
 await page.keyboard.press('Tab');await expect(page.locator('[data-v2="close"]')).toBeFocused();await page.keyboard.press('Shift+Tab');await expect(page.locator('[data-v2="close"]')).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('[data-v2="policy"]').first()).toBeFocused();await expect(page.getByRole('dialog')).toHaveCount(0);
 page.once('dialog',d=>d.accept());await page.locator('[data-v2="restart"]').click();await page.keyboard.press('Escape');await expect(page.locator('[data-v2="policy"]').first()).toBeFocused();
});
test('cancel restart keeps the same outcome DOM, reading position, disclosures and focus',async({page})=>{
 const {play}=require('./v052-engine.cjs'),g=play().g;await page.addInitScript(g=>localStorage.setItem('absurd-mayor-v51',JSON.stringify(g)),JSON.parse(JSON.stringify(g)));await page.goto(url);await page.locator('#modal .v51-ledger summary').click();const button=page.locator('#modal [data-v2="restart"]');await button.focus();
 const before=await page.evaluate(()=>{window.qaOriginal=document.querySelector('#modal .modal');return {scroll:qaOriginal.scrollTop,save:JSON.stringify(game)}});page.once('dialog',d=>d.dismiss());await page.keyboard.press('Enter');
 expect(await page.evaluate(()=>qaOriginal===document.querySelector('#modal .modal'))).toBe(true);expect(await page.locator('#modal .modal').evaluate(e=>e.scrollTop)).toBe(before.scroll);expect(await page.evaluate(()=>JSON.stringify(game))).toBe(before.save);await expect(button).toBeFocused();await expect(page.locator('#modal .v51-ledger')).toHaveAttribute('open','');
});
test('focus list excludes closed details and hidden or disabled descendants',async({page})=>{
 await page.goto(url);expect(await page.evaluate(()=>{const d=document.querySelector('[role="dialog"]'),box=document.createElement('div');box.innerHTML='<details><summary id="qa-summary">Summary</summary><button id="qa-closed">Hidden detail</button></details><button hidden id="qa-hidden">Hidden</button><button disabled id="qa-disabled">Disabled</button>';d.append(box);return ['qa-summary','qa-closed','qa-hidden','qa-disabled'].map(id=>dialogFocusable521(document.getElementById(id)))})).toEqual([true,false,false,false]);
 await page.locator('#qa-summary').focus();await page.keyboard.press('Tab');await expect(page.locator('[data-v2="close"]')).toBeFocused();
});
