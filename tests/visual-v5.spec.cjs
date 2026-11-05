'use strict';
const { test, expect } = require('@playwright/test');
const { pathToFileURL } = require('node:url');
const { mkdirSync } = require('node:fs');
const path = require('node:path');

const gameUrl = pathToFileURL(path.resolve(__dirname, '../荒謬市長_v0.5.0.html')).href;
const screenDir = path.resolve(__dirname, '../artifacts/v5-screenshots');
const sizes = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'tablet-1024', width: 1024, height: 768 },
  { name: 'mobile-390', width: 390, height: 844 }
];
const languages = [
  { code: 'zh', htmlLang: 'zh-Hant' },
  { code: 'en', htmlLang: 'en' },
  { code: 'fr', htmlLang: 'fr' },
  { code: 'nl', htmlLang: 'nl' }
];

async function press(page, locator, touch) {
  if (touch) await locator.tap();
  else await locator.click();
}

async function start(page, language = 'zh', touch = false) {
  await page.addInitScript(() => { let seed=41; Math.random=()=>((seed=(seed*16807)%2147483647)-1)/2147483646; });
  await page.goto(gameUrl, { waitUntil: 'load' });
  await expect(page.locator('#modal [data-v2="close"]')).toBeVisible();
  await page.locator('.lang select').selectOption(language);
  await press(page, page.locator('[data-v2="close"]'), touch);
  await expect(page.locator('#modal .overlay')).toHaveCount(0);
}

async function verifyNoHorizontalOverflow(page) {
  const result = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
    bodyWidth: document.body.scrollWidth
  }));
  if (result.bodyWidth > result.viewportWidth + 1) {
    const offenders = await page.evaluate(() => [...document.querySelectorAll('body *')]
      .filter(el => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1);
      })
      .map(el => ({
        tag: el.tagName, className: String(el.className || '').slice(0, 100),
        text: (el.innerText || '').slice(0, 70),
        width: Math.round(el.getBoundingClientRect().width),
        right: Math.round(el.getBoundingClientRect().right)
      })).slice(0, 14));
    console.log('OVERFLOW_DIAGNOSTIC', JSON.stringify({ viewport: result.viewportWidth, offenders }));
  }
  expect.soft(result.scrollWidth, JSON.stringify(result)).toBeLessThanOrEqual(result.viewportWidth + 1);
  expect.soft(result.bodyWidth, JSON.stringify(result)).toBeLessThanOrEqual(result.viewportWidth + 1);
}

for (const size of sizes) {
  test.describe(size.name, () => {
    test.use({
      viewport: { width: size.width, height: size.height },
      hasTouch: size.width === 390
    });

    for (const language of languages) {
      test('render, operate and capture ' + language.code, async ({ page }, info) => {
        const touch = size.width === 390;
        const pageErrors = [], externalRequests = [];
        page.on('pageerror', e => pageErrors.push(String(e)));
        page.on('request', request => {
          if (/^https?:\/\//.test(request.url())) externalRequests.push(request.url());
        });

        await start(page, language.code, touch);
        await expect(page.locator('html')).toHaveAttribute('lang', language.htmlLang);
        await expect(page.locator('#map .tile')).toHaveCount(9);
        await expect(page.locator('#action [data-v2="policy"]')).toHaveCount(3);
        await verifyNoHorizontalOverflow(page);
        await expect(page.locator('#v041-brief > div')).toHaveCount(6);
        await expect(page.locator('#v041-metrics')).not.toHaveAttribute('open', '');
        const dir = path.join(screenDir, info.project.name);
        mkdirSync(dir, { recursive: true });
        const capture=async(prefix,fullPage=true)=>page.screenshot({path:path.join(dir,prefix+'-'+size.name+'-'+language.code+'.png'),fullPage});
        await capture('default');
        await page.locator('#v041-jump').click();
        await expect(page.locator('#action')).toBeFocused();
        await capture('jump',false);
        const distance=await page.locator('#action').evaluate(el=>Math.round(el.getBoundingClientRect().top));
        expect(distance).toBeGreaterThanOrEqual(-1);
        expect(distance).toBeLessThanOrEqual(100);
        await expect(page.locator('[data-v2="policy"]').first()).toBeInViewport();
        await page.locator('#v041-summary').click();
        await expect(page.locator('#stats .v04-metric')).toHaveCount(6);
        await capture('indicators-open');
        await page.locator('#v041-summary').click();
        await expect(page.locator('#stats')).toBeHidden();

        await press(page, page.locator('[data-v2="policy"]').first(), touch);
        await expect(page.locator('[data-v2="tile"]')).toHaveCount(9);
        await press(page, page.locator('[data-v2="tile"][data-index="0"]'), touch);
        await expect(page.locator('[data-v2="build"]')).toHaveCount(6);
        await expect(page.locator('.action-tabs .action-tab')).toHaveCount(3);
        await expect(page.locator('#action .forecast')).toHaveCount(6);
        await expect(page.locator('#action .v041-card details')).toHaveCount(6);
        await expect(page.locator('#action .v041-card details').first()).not.toHaveAttribute('open', '');
        await verifyNoHorizontalOverflow(page);

        const picture = path.join(dir, size.name + '-' + language.code + '.png');
        await page.screenshot({ path: picture, fullPage: true });
        await info.attach('gameplay-screenshot', {
          path: picture, contentType: 'image/png'
        });
        const disclosure=page.locator('.v041-card summary').first();
        const decisionName=await page.locator('[data-v2="build"]').first().innerText();
        expect(decisionName).toMatch(/AI|IA/);
        await expect(disclosure).toHaveAccessibleName(/.+/);
        await disclosure.focus();await page.keyboard.press('Enter');
        await expect(page.locator('.v041-card details').first()).toHaveAttribute('open','');
        await expect(page.locator('.v041-card .forecast').first()).toBeVisible();
        await expect(disclosure).toBeFocused();
        await verifyNoHorizontalOverflow(page);await capture('building-open');
        await page.keyboard.press('Enter');
        await expect(page.locator('[data-v2="build"]')).toHaveCount(6);
        // Visual QA: inspect all three civic-action groups and the settlement phase,
        // not merely the default construction list.
        const tabs=page.locator('#action .action-tab');
        await expect(tabs).toHaveCount(3);
        const tabSize=await tabs.evaluateAll(els=>els.map(el=>{
          const r=el.getBoundingClientRect();
          return {width:r.width,height:r.height,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth};
        }));
        for(const tab of tabSize){
          expect(tab.height,'tab touch target height').toBeGreaterThanOrEqual(44);
          expect(tab.width,'tab should not be clipped').toBeGreaterThanOrEqual(60);
          expect(tab.scrollWidth,'tab label must fit or wrap').toBeLessThanOrEqual(tab.clientWidth+1);
        }
        await press(page,page.locator('[data-v2="action-tab"][data-tab="admin"]'),touch);
        await expect(page.locator('#action [data-v2="admin"]')).toHaveCount(4);
        await expect(page.locator('#action [data-v2="build"]')).toHaveCount(0);
        await verifyNoHorizontalOverflow(page);
        await page.screenshot({path:path.join(dir,'admin-'+size.name+'-'+language.code+'.png'),fullPage:true});
        await press(page,page.locator('[data-v2="action-tab"][data-tab="defer"]'),touch);
        await expect(page.locator('#action [data-v2="defer"]')).toHaveCount(1);
        await verifyNoHorizontalOverflow(page);
        await page.screenshot({path:path.join(dir,'defer-'+size.name+'-'+language.code+'.png'),fullPage:true});
        await press(page,page.locator('[data-v2="action-tab"][data-tab="land"]'),touch);
        await press(page,page.locator('#action [data-v2="build"][data-type="lab"]'),touch);
        await expect(page.locator('#v042-feedback')).toContainText('-18');
        expect(await page.locator('.v042-changed .v042-art').evaluate(e=>getComputedStyle(e).animationName)).toBe('v042-arrive');
        await expect(page.locator('#action [data-v2="settle"]')).toHaveCount(1);
        await verifyNoHorizontalOverflow(page);
        await page.screenshot({path:path.join(dir,'settlement-'+size.name+'-'+language.code+'.png'),fullPage:true});
        await page.locator('[data-v2="settle"]').click();
        await page.locator('[data-v2="policy"]').first().click();
        await page.locator('[data-v2="tile"][data-index="0"]').click();
        await expect(page.locator('[data-v2="upgrade"]')).toHaveCount(1);
        await capture('upgrade-closed');
        await page.locator('.v041-card summary').click();
        await expect(page.locator('.v041-card .forecast')).toBeVisible();
        await verifyNoHorizontalOverflow(page);await capture('upgrade-open');
        expect(pageErrors, 'uncaught browser script errors').toEqual([]);
        expect(externalRequests, 'game must remain offline/self-contained').toEqual([]);
      });
    }
  });
}

test.describe('full interactive playthrough and persistence', () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  test('12 turns with real UI clicks, final report and restart', async ({ page }, info) => {
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await start(page);
    for (let turn = 1; turn <= 12; turn++) {
      await expect(page.locator('#action [data-v2="policy"]')).toHaveCount(3);
      await page.locator('#action [data-v2="policy"]').first().click();
      await page.locator('#map [data-v2="tile"][data-index="8"]').click();
      await page.locator('[data-v2="action-tab"][data-tab="defer"]').click();
    await page.locator('[data-v2="defer"]').click();
      await page.locator('[data-v2="settle"]').click();
      if (turn < 12) await expect(page.locator('.round b')).toHaveText(String(turn + 1).padStart(2, '0'));
    }
    await expect(page.locator('#endtitle')).toBeVisible();
    // The initial modal focus belongs to the outcome heading, before interacting.
    await expect(page.locator('#endtitle')).toBeFocused();
    // v0.4 moves the detailed numeric report into a native disclosure.
    await expect(page.locator('#modal .v04-details')).toBeVisible();
    await expect(page.locator('#modal .result')).toBeHidden();
    await page.locator('#modal .v04-details summary').click();
    await expect(page.locator('#modal .result')).toBeVisible();
    await expect(page.locator('#modal .audit-row')).toHaveCount(3);
    await expect(page.locator('#modal .audit')).toBeVisible();
    // After clicking the disclosure, keyboard focus should remain on its summary,
    // not jump back to the heading.
    await expect(page.locator('#modal .v04-details summary')).toBeFocused();
    mkdirSync(path.join(screenDir, 'chromium'), { recursive: true });
    const picture = path.join(screenDir, 'chromium', 'final-result.png');
    await page.screenshot({ path: picture, fullPage: true });
    await info.attach('final-report', { path: picture, contentType: 'image/png' });
    page.once('dialog', d => d.accept());
    await page.locator('#modal [data-v2="restart"]').click();
    await expect(page.locator('#introtitle')).toBeVisible();
    await expect(page.locator('.round b')).toHaveText('01');
    expect(errors).toEqual([]);
  });

  test('preserve policy, plot selection and language after reload', async ({ page }, info) => {
    await start(page, 'en');
    await page.locator('#action [data-v2="policy"]').first().click();
    await page.locator('#map [data-v2="tile"][data-index="3"]').click();
    await page.locator('.lang select').selectOption('nl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'nl');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'nl');
    await expect(page.locator('.lang select')).toHaveValue('nl');
    await expect(page.locator('[data-v2="build"]')).toHaveCount(6);
        await expect(page.locator('.action-tabs .action-tab')).toHaveCount(3);
        await expect(page.locator('#action .forecast')).toHaveCount(6);
        await expect(page.locator('#action .v041-card details')).toHaveCount(6);
        await expect(page.locator('#action .v041-card details').first()).not.toHaveAttribute('open', '');
    await expect(page.locator('#map [data-index="3"]')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('[data-v2="action-tab"][data-tab="defer"]').click();
    await page.locator('[data-v2="defer"]').click();
    await page.locator('[data-v2="settle"]').click();
    await expect(page.locator('.round b')).toHaveText('02');
  });

  test('keyboard focus enters, remains within and exits the intro dialog', async ({ page }, info) => {
    await page.goto(gameUrl);
    await expect(page.locator('#introtitle')).toBeVisible();
    const first=page.locator('#modal [data-v2="close"]');
    await expect(page.locator('#introtitle')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(first).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(first).toBeFocused();
    const focus = await page.evaluate(() => ({
      activeTag: document.activeElement?.tagName || 'none',
      modalLabel: !!document.querySelector('#modal [role="dialog"][aria-modal="true"]'),
      focusInsideDialog: !!document.querySelector('#modal [role="dialog"]')?.contains(document.activeElement)
    }));
    const dir=path.join(screenDir,info.project.name);
    mkdirSync(dir,{recursive:true});
    require('node:fs').writeFileSync(path.join(dir,'a11y-initial-focus.json'),JSON.stringify(focus,null,2)+'\n');
    expect(focus.modalLabel).toBe(true);
    expect(focus.activeTag).toBe('BUTTON');
    expect(focus.focusInsideDialog).toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.locator('#modal .overlay')).toHaveCount(0);
    await expect(page.locator('[data-v2="policy"]').first()).toBeFocused();
  });
  test('built plot remains intact, may upgrade once, and administration may be used once', async ({ page }, info) => {
    await start(page);
    await page.locator('[data-v2="policy"]').first().click();
    await page.locator('[data-v2="tile"][data-index="0"]').click();
    await expect(page.locator('[data-v2="build"]')).toHaveCount(6);
        await expect(page.locator('.action-tabs .action-tab')).toHaveCount(3);
        await expect(page.locator('#action .forecast')).toHaveCount(6);
        await expect(page.locator('#action .v041-card details')).toHaveCount(6);
        await expect(page.locator('#action .v041-card details').first()).not.toHaveAttribute('open', '');
    await page.locator('[data-v2="build"][data-type="lab"]').click();
    await page.locator('[data-v2="settle"]').click();
    await page.locator('[data-v2="policy"]').first().click();
    await page.locator('[data-v2="tile"][data-index="0"]').click();
    await expect(page.locator('[data-v2="build"]')).toHaveCount(0);
    await expect(page.locator('[data-v2="upgrade"]')).toHaveCount(1);
    await page.locator('[data-v2="upgrade"]').click();
    await page.locator('[data-v2="settle"]').click();
    await page.locator('[data-v2="policy"]').first().click();
    await page.locator('[data-v2="tile"][data-index="0"]').click();
    await expect(page.locator('[data-v2="upgrade"]')).toHaveCount(0);
    await page.locator('[data-v2="action-tab"][data-tab="admin"]').click();
    await page.locator('[data-v2="admin"][data-type="research"]').click();
    await page.locator('[data-v2="settle"]').click();
    await page.locator('[data-v2="policy"]').first().click();
    await page.locator('[data-v2="action-tab"][data-tab="admin"]').click();
    await expect(page.locator('[data-v2="admin"][data-type="research"]')).toBeDisabled();
    await page.locator('[data-v2="action-tab"][data-tab="defer"]').click();
    await page.locator('[data-v2="defer"]').click();
    await page.locator('[data-v2="settle"]').click();
    await expect(page.locator('.round b')).toHaveText('05');
    await page.reload();
    await expect(page.locator('.round b')).toHaveText('05');
    await expect(page.locator('[data-v2="policy"]')).toHaveCount(3);
  });

});


test.describe('v0.4 visual-first contract', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('dashboard meters, nine illustrated tiles, 12-turn timeline and policy chips', async ({page},info) => {
    await start(page,'nl');
    await expect(page.locator('#stats .v04-metric')).toHaveCount(6);
    await expect(page.locator('#stats .v04-meter')).toHaveCount(6);
    await expect(page.locator('.v04-step')).toHaveCount(12);
    await expect(page.locator('#map.v04-city-map .tile')).toHaveCount(9);
    await expect(page.locator('#action .v04-effect-row')).toHaveCount(3);
    await expect(page.locator('#action .v04-effect').first()).toBeVisible();
    await page.locator('[data-v2="policy"]').first().click();
    await page.locator('[data-v2="tile"][data-index="3"]').click();
    await expect(page.locator('#action [data-v2="build"]')).toHaveCount(6);
    await expect(page.locator('#action [data-v2="build"] .v04-effect-row')).toHaveCount(6);
    await expect(page.locator('#action .v041-card .forecast')).toHaveCount(6);
    await page.locator('[data-v2="action-tab"][data-tab="admin"]').click();
    await expect(page.locator('[data-v2="admin"] .v04-effect-row')).toHaveCount(4);
    await verifyNoHorizontalOverflow(page);
  });
  test('result provides accessible title, outcome illustration, comparison and disclosure', async ({page},info)=>{
    await start(page,'fr');
    for(let i=0;i<12;i++){
      await page.locator('[data-v2="policy"]').first().click();
      await page.locator('[data-v2="action-tab"][data-tab="defer"]').click();
      await page.locator('[data-v2="defer"]').click();
      await page.locator('[data-v2="settle"]').click();
    }
    await expect(page.locator('#endtitle')).toBeFocused();
    await expect(page.locator('#modal .v04-end-illustration')).toBeVisible();
    await expect(page.locator('#modal .v04-compare>div')).toHaveCount(2);
    await expect(page.locator('#modal .v04-details')).toHaveCount(1);
    await expect(page.locator('#modal .audit-row')).toHaveCount(3);
    await page.locator('#modal .v04-details summary').click();
    await expect(page.locator('#modal .v04-details .result')).toBeVisible();
    await verifyNoHorizontalOverflow(page);
  });
});


// Rendering-only fixtures exercise every building and exceptional city state.
for (const language of languages) test('city art, states and reduced motion '+language.code,async({page},info)=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 await start(page,language.code);
 await expect(page.locator('#map .v042-art')).toHaveCount(9);
 await expect(page.locator('#map small')).toHaveCount(0);
 await expect(page.locator('#map')).not.toContainText(/名目容量|Nominal capacity|Capacité nominale|Nominale capaciteit/);
 await expect(page.locator('#map .v042-art:not([aria-hidden="true"])')).toHaveCount(0);
 await page.locator('[data-v2="policy"]').first().click();
 await expect(page.locator('#v042-feedback')).not.toBeEmpty();
 await page.evaluate(()=>{window.feedbackMutations=0;new MutationObserver(records=>window.feedbackMutations+=records.length).observe(document.getElementById('v042-feedback'),{subtree:true,childList:true,characterData:true})});
 await page.locator('[data-v2="tile"][data-index="0"]').click();
 expect(await page.evaluate(()=>window.feedbackMutations)).toBe(0);
 await page.locator('[data-v2="build"][data-type="data"]').click();
 await expect(page.locator('#map [data-index="0"] .v042-art')).toHaveAttribute('data-art','data');
 expect(await page.locator('.v042-changed .v042-art').evaluate(e=>getComputedStyle(e).animationName)).toBe('none');
 await page.evaluate(()=>{
  const g=JSON.parse(localStorage.getItem('absurd-mayor-v02'));
  const types=[['lab','🧪','AI 孵化中心',2],['data','🖥️','資料中心',2],['show','🎪','AI 展示館',1],['power','⚡','電力設施',1],['park','🌿','綠地保護區',1],['market','🏪','轉型商業區',2]];
  types.forEach(([type,icon,name,level],i)=>g.tiles[i]={type,icon,name,traffic:0,level});
  g.phase='build';g.selected=1;localStorage.setItem('absurd-mayor-v02',JSON.stringify(g));
 });await page.reload();
 await expect(page.locator('#map .v042-art')).toHaveCount(9);
 await expect(page.locator('#map small')).toHaveCount(0);
 await expect(page.locator('#map')).not.toContainText(/名目容量|Nominal capacity|Capacité nominale|Nominale capaciteit/);
 await expect(page.locator('#map [data-index="1"]')).toHaveClass(/is-blackout/);
 await expect(page.locator('#map [data-index="1"]')).toHaveAccessibleName(/2/);
 await expect(page.locator('#v042-map-state .warning')).toHaveCount(2);
 await verifyNoHorizontalOverflow(page);
 const dir=path.join(screenDir,info.project.name);mkdirSync(dir,{recursive:true});
 await page.screenshot({path:path.join(dir,'city-states-'+language.code+'.png'),fullPage:true});
 const before=await page.evaluate(()=>localStorage.getItem('absurd-mayor-v02'));
 await page.locator('.lang select').selectOption(language.code);await page.locator('#v041-summary').click();
 expect(await page.evaluate(()=>localStorage.getItem('absurd-mayor-v02'))).toBe(before);
});

test('v0.4.2 save loads unchanged and identical decisions produce identical state',async({browser})=>{
 const states=[];
 for(const version of ['0.4.2','0.5.0']){
  const context=await browser.newContext();const page=await context.newPage();
  await page.addInitScript(()=>{let seed=41;Math.random=()=>((seed=seed*16807%2147483647)-1)/2147483646});
  await page.goto(pathToFileURL(path.resolve(__dirname,'../荒謬市長_v'+version+'.html')).href);
  await page.locator('[data-v2="close"]').click();
  for(let i=0;i<12;i++){
   await page.locator('[data-v2="policy"]').first().click();
   if(i===0){await page.locator('[data-v2="tile"][data-index="0"]').click();await page.locator('[data-v2="build"][data-type="lab"]').click()}
   else if(i===1){await page.locator('[data-v2="tile"][data-index="0"]').click();await page.locator('[data-v2="upgrade"]').click()}
   else if(i===2){await page.locator('[data-tab="admin"]').click();await page.locator('[data-v2="admin"][data-type="research"]').click()}
   else{await page.locator('[data-tab="defer"]').click();await page.locator('[data-v2="defer"]').click()}
   await page.locator('[data-v2="settle"]').click();
  }
  await expect(page.locator('#endtitle')).toBeVisible();
  states.push(await page.evaluate(()=>JSON.parse(localStorage.getItem('absurd-mayor-v02'))));
  if(version==='0.4.2'){
   const state=states[0];await page.goto(gameUrl);
   await page.evaluate(g=>localStorage.setItem('absurd-mayor-v02',JSON.stringify(g)),state);await page.reload();
   await expect(page.locator('#endtitle')).toBeVisible();
   expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('absurd-mayor-v02')))).toEqual(state);
  }
  await context.close();
 }
 expect(states[1]).toEqual(states[0]);
});

for(const language of languages)test('optional music controls, preferences and focus '+language.code,async({page})=>{
 await page.addInitScript(()=>{const A=window.AudioContext||window.webkitAudioContext;window.__audioContexts=[];if(A){window.AudioContext=function(...args){const c=new A(...args);window.__audioContexts.push(c);return c};window.AudioContext.prototype=A.prototype;}});
 await start(page,language.code);
 const button=page.locator('.v5-audio-bar [data-music-toggle]'),slider=page.locator('#v5-music-volume');
 await expect(button).toHaveAttribute('aria-pressed','false');
 expect(await page.evaluate(()=>window.__audioContexts.length)).toBe(0);
 const saved=await page.evaluate(()=>localStorage.getItem('absurd-mayor-v02'));
 await button.focus();await page.keyboard.press('Enter');await expect(button).toHaveAttribute('aria-pressed','true');
 await expect.poll(()=>page.evaluate(()=>window.__audioContexts[0]?.state)).toBe('running');
 await expect(button).toBeFocused();
 await slider.focus();await page.keyboard.press('Home');await expect(slider).toHaveValue('0');
 await expect(page.locator('#v5-volume-value')).toHaveText('0%');
 expect(await page.evaluate(()=>localStorage.getItem('absurd-mayor-v02'))).toBe(saved);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))});
 await expect.poll(()=>page.evaluate(()=>window.__audioContexts[0].state)).toBe('suspended');
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'))});
 await expect.poll(()=>page.evaluate(()=>window.__audioContexts[0].state)).toBe('running');
 await button.click();await expect(button).toHaveAttribute('aria-pressed','false');
 await expect.poll(()=>page.evaluate(()=>window.__audioContexts[0].state)).toBe('suspended');
 for(let i=0;i<3;i++){await button.click();await button.click()}
 await expect(button).toHaveAttribute('aria-pressed','false');expect(await page.evaluate(()=>window.__audioContexts.length)).toBe(1);
 await page.reload();await expect(slider).toHaveValue('0');await expect(button).toHaveAttribute('aria-pressed','false');
 expect(await page.evaluate(()=>window.__audioContexts.length)).toBe(0);
 await verifyNoHorizontalOverflow(page);
});

test('unavailable audio is non-blocking and visibly explained',async({page})=>{
 await page.addInitScript(()=>{window.AudioContext=undefined;window.webkitAudioContext=undefined});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));await start(page);
 await page.locator('.v5-audio-bar [data-music-toggle]').click();
 await expect(page.locator('#v5-music-status')).toBeVisible();
 await expect(page.locator('.v5-audio-bar [data-music-toggle]')).toHaveAttribute('aria-pressed','false');
 await page.locator('[data-v2="policy"]').first().click();await expect(page.locator('.action-tabs')).toBeVisible();expect(errors).toEqual([]);
});

test('representative score PCM is finite, audible and unclipped at the loop boundary',async({page})=>{
 test.setTimeout(90000);await start(page);
 const stats=await page.evaluate(async()=>{
  const sr=22050,ctx=new OfflineAudioContext(2,Math.ceil(sr*9.2),sr),mix=MayorScore.setup(ctx);mix.master.gain.value=.8;
  const score=MayorScore.plan();[4,17,31,0].forEach((bar,slot)=>{for(const e of score)if(e.at>=bar*2&&e.at<(bar+1)*2)MayorScore.note(mix,e,e.at-bar*2+slot*2)});
  const b=await ctx.startRendering(),d=b.getChannelData(0);let peak=0,sum=0,bad=0,boundary=0;
  for(let i=0;i<d.length;i++){const x=d[i];if(!Number.isFinite(x))bad++;peak=Math.max(peak,Math.abs(x));sum+=x*x;if(i>=sr*5.9&&i<sr*6.1)boundary+=x*x}
  return{peak,rms:Math.sqrt(sum/d.length),bad,boundary,events:MayorScore.plan().length,duration:MayorScore.duration};
 });
 expect(stats.duration).toBe(64);expect(stats.events).toBeGreaterThan(500);expect(stats.bad).toBe(0);expect(stats.peak).toBeLessThan(1);expect(stats.rms).toBeGreaterThan(.003);expect(stats.boundary).toBeGreaterThan(.01);
});

test('music can be paused with the ending keyboard focus trap active',async({page})=>{
 await start(page);await page.locator('.v5-audio-bar [data-music-toggle]').click();
 for(let i=0;i<12;i++){await page.locator('[data-v2="policy"]').first().click();await page.locator('[data-tab="defer"]').click();await page.locator('[data-v2="defer"]').click();await page.locator('[data-v2="settle"]').click()}
 await expect(page.locator('#endtitle')).toBeFocused();const button=page.locator('#modal [data-music-toggle]');await expect(button).toHaveAttribute('aria-pressed','true');
 await button.focus();await page.keyboard.press('Enter');await expect(button).toHaveAttribute('aria-pressed','false');await expect(button).toBeFocused();
});


test('an audio backend that never starts times out without blocking gameplay',async({page})=>{
 await page.addInitScript(()=>{const A=window.AudioContext||window.webkitAudioContext;window.AudioContext=function(...args){const c=new A(...args);c.resume=()=>new Promise(()=>{});return c}});
 await start(page);await page.locator('.v5-audio-bar [data-music-toggle]').click();
 await expect(page.locator('.v5-audio-bar [data-music-toggle]')).toHaveAttribute('aria-busy','true');
 await page.locator('[data-v2="policy"]').first().click();await expect(page.locator('.action-tabs')).toBeVisible();
 await expect(page.locator('#v5-music-status')).toBeVisible({timeout:8000});
 await expect(page.locator('.v5-audio-bar [data-music-toggle]')).toHaveAttribute('aria-pressed','false');
});
