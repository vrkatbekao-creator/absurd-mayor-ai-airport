'use strict';
const { test, expect } = require('@playwright/test');
const { pathToFileURL } = require('node:url');
const { mkdirSync } = require('node:fs');
const path = require('node:path');

const gameUrl = pathToFileURL(path.resolve(__dirname, '../荒謬市長_v0.3.html')).href;
const screenDir = path.resolve(__dirname, '../artifacts/screenshots');
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

        await press(page, page.locator('[data-v2="policy"]').first(), touch);
        await expect(page.locator('[data-v2="tile"]')).toHaveCount(9);
        await press(page, page.locator('[data-v2="tile"][data-index="0"]'), touch);
        await expect(page.locator('[data-v2="build"]')).toHaveCount(6);
        await expect(page.locator('.action-tabs .action-tab')).toHaveCount(3);
        await expect(page.locator('#action .forecast')).toHaveCount(6);
        await verifyNoHorizontalOverflow(page);

        const dir = path.join(screenDir, info.project.name);
        mkdirSync(dir, { recursive: true });
        const picture = path.join(dir, size.name + '-' + language.code + '.png');
        await page.screenshot({ path: picture, fullPage: true });
        await info.attach('gameplay-screenshot', {
          path: picture, contentType: 'image/png'
        });
        expect(pageErrors, 'uncaught browser script errors').toEqual([]);
        expect(externalRequests, 'game must remain offline/self-contained').toEqual([]);
      });
    }
  });
}

test.describe('full interactive playthrough and persistence', () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  test('12 turns with real UI clicks, final report and restart', async ({ page }, info) => {
    test.skip(info.project.name !== 'chromium', 'Full UI playthrough is exercised in Chromium; smoke cases cover all browsers.');
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
    await expect(page.locator('#modal .result')).toBeVisible();
    await expect(page.locator('#modal .audit-row')).toHaveCount(3);
    await expect(page.locator('#modal .audit')).toBeVisible();
    await expect(page.locator('#modal [data-v2="restart"]')).toBeFocused();
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
    test.skip(info.project.name !== 'chromium', 'Save reload validation is run in Chromium file origin.');
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
    await expect(first).toBeFocused();
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
    test.skip(info.project.name !== 'chromium', 'Behavioral controls are validated in Chromium.');
    await start(page);
    await page.locator('[data-v2="policy"]').first().click();
    await page.locator('[data-v2="tile"][data-index="0"]').click();
    await expect(page.locator('[data-v2="build"]')).toHaveCount(6);
        await expect(page.locator('.action-tabs .action-tab')).toHaveCount(3);
        await expect(page.locator('#action .forecast')).toHaveCount(6);
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
