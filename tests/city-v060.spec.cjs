const {test,expect}=require('@playwright/test'),path=require('path'),fs=require('fs'),{pathToFileURL}=require('url');
const url=pathToFileURL(path.resolve(__dirname,'../荒謬市長_v0.6.0.html')).href;
async function state(page){return page.evaluate(()=>JSON.parse(JSON.stringify(game)))}
async function open(page,view){const b=page.locator('#c60-dock [data-city-view="'+view+'"]');if(await b.getAttribute('aria-expanded')!=='true')await b.click();await expect(page.locator('#c60-sheet')).toBeVisible()}
async function safe(page){const i=await page.evaluate(()=>cards[game.order[game.turn-1]][2].map((o,i)=>({o,i})).filter(({o})=>(o[2].money||0)>=0&&!(o[3]&&o[3][1].money<0)).sort((a,b)=>((a.o[2].debt||0)-(b.o[2].debt||0))*10-((a.o[2].pop||0)-(b.o[2].pop||0))*2-((a.o[2].ai||0)-(b.o[2].ai||0)))[0].i);await open(page,'action');await page.locator('#action [data-v2="policy"][data-index="'+i+'"]').click()}
async function admin(page,type){await open(page,'admin');await page.locator('#action [data-v2="admin"][data-type="'+type+'"]').click()}
async function build(page,i,type){await page.locator('.c60-plot[data-index="'+i+'"]').focus();await page.keyboard.press('Enter');await expect(page.locator('#c60-sheet')).toBeVisible();await expect(page.locator('#c60-sheet-title')).toBeFocused();await page.locator('#action [data-v2="build"][data-type="'+type+'"]').click()}
async function defer(page){await open(page,'action');await page.locator('#action [data-tab="defer"]').click();await expect(page.locator('#action [data-tab="defer"]')).toBeFocused();await page.locator('#action [data-v2="defer"]').click()}
async function capture(page,info,name){const dir=path.resolve(__dirname,'../artifacts/v060-screenshots',info.project.name);fs.mkdirSync(dir,{recursive:true});await page.screenshot({path:path.join(dir,name+'.png')})}
async function noOverflow(page){const d=await page.evaluate(()=>({w:innerWidth,doc:document.documentElement.scrollWidth,body:document.body.scrollWidth}));expect(d.doc).toBeLessThanOrEqual(d.w+1);expect(d.body).toBeLessThanOrEqual(d.w+1)}

for (const [locale, language, documentLanguage] of [
  ['zh-TW', 'zh', 'zh-Hant'],
  ['en-GB', 'en', 'en'],
  ['fr-BE', 'fr', 'fr'],
  ['nl-BE', 'nl', 'nl'],
  ['ja-JP', 'en', 'en'],
]) {
  test.describe('Browser locale ' + locale, () => {
    test.use({ locale });

    test('chooses the interface language on the first visit', async ({ page }) => {
      await page.goto(url);
      await expect(page.locator('.lang select')).toHaveValue(language);
      await expect(page.locator('html')).toHaveAttribute('lang', documentLanguage);
      expect(await page.evaluate(() => localStorage.getItem('absurd-mayor-language'))).toBeNull();
    });
  });
}

test('remembers an explicit language choice without changing the save', async ({ page }) => {
  await page.goto(url);
  await page.evaluate(() => {
    persist();
    localStorage.setItem('absurd-mayor-language', 'nl');
  });
  await page.reload();
  const picker = page.locator('.lang select');
  await expect(picker).toHaveValue('nl');
  const save = await page.evaluate(() => localStorage.getItem('absurd-mayor-v51'));

  await picker.selectOption('fr');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  expect(await page.evaluate(() => localStorage.getItem('absurd-mayor-v51'))).toBe(save);
  await page.reload();
  await expect(picker).toHaveValue('fr');
  expect(await page.evaluate(() => localStorage.getItem('absurd-mayor-v51'))).toBe(save);
});

for(const width of [390,1024,1440])for(const lang of ['zh','en','fr','nl'])for(const route of ['coexist','financed'])test(`${route} map, floating panels, twelve rounds and saves ${width} ${lang}`,async({page},info)=>{
 await page.setViewportSize({width,height:width===390?844:900});await page.emulateMedia({reducedMotion:'reduce'});const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url())});
 await page.addInitScript(()=>{let seed=41;Math.random=()=>((seed=(seed*16807)%2147483647)-1)/2147483646});await page.goto(url);await page.locator('.lang select').selectOption(lang);await page.locator('[data-v2="close"]').click();await expect(page.locator('#c60-dock [data-city-view="action"]')).toBeFocused();
 await expect(page.locator('.c60-plot')).toHaveCount(9);await expect(page.locator('#v041-brief > div')).toHaveCount(6);await expect(page.locator('.c60-city')).toBeVisible();await expect(page.locator('html')).toHaveAttribute('lang',lang==='zh'?'zh-Hant':lang);await noOverflow(page);
 await expect(page.locator('.c60-slogan')).toBeVisible();await expect(page.locator('.c60-slogan')).toHaveText({zh:'AI 起飛，飛機停飛！',en:'AI takes off, planes grounded!',fr:'L’IA décolle, les avions restent au sol !',nl:'AI stijgt op, vliegtuigen blijven aan de grond!'}[lang]);
 if(route==='coexist'){
  await capture(page,info,`map-${width}-${lang}`);const before=await state(page);await open(page,'action');await expect(page.locator('#action .c60-comic')).toHaveCount(3);await expect(page.locator('#action .c60-full')).not.toHaveAttribute('open','');await page.locator('#action .c60-full summary').click();expect(await state(page)).toEqual(before);await page.locator('#action .c60-full summary').click();
  await capture(page,info,`policy-${width}-${lang}`);await page.keyboard.press('Escape');await expect(page.locator('#c60-sheet')).toBeHidden();await expect(page.locator('#c60-dock [data-city-view="action"]')).toBeFocused();
  for(const view of ['finance','goals','settings','admin']){await open(page,view);await noOverflow(page);if(view==='finance'){await expect(page.locator('.c60-fund')).toHaveCount(3);await capture(page,info,`finance-${width}-${lang}`)}if(view==='settings'){const slider=page.locator('#v5-music-volume');await slider.focus();await page.keyboard.press('Home');await expect(slider).toHaveValue('0');await page.keyboard.press('End');await expect(slider).toHaveValue('100')}expect(await state(page)).toEqual(before);await page.keyboard.press('Escape')}
  const controls=await page.locator('#c60-dock button,.c60-plot').evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return {w:b.width,h:b.height}}));for(const r of controls){expect(r.w).toBeGreaterThanOrEqual(44);expect(r.h).toBeGreaterThanOrEqual(44)}
 }
 for(let n=1;n<=12;n++){
  await safe(page);
  if(n===1)await admin(page,'investment');
  else if(n===2)await build(page,route==='coexist'?7:0,'lab');
  else if(n===3)await admin(page,'partnership');
  else if(n===4)await build(page,route==='coexist'?6:4,'park');
  else if(n===5){if(route==='coexist')await build(page,8,'park');else await admin(page,'greenfund')}
  else if(n===6){if(route==='coexist'){await page.locator('.c60-plot[data-index="7"]').click();await page.locator('#action [data-v2="upgrade"]').click();await expect(page.locator('.c60-scene [data-city-building="7"]')).toHaveAttribute('data-city-level','2');await capture(page,info,`grown-${width}-${lang}`)}else await build(page,3,'lab')}
  else if(n===7&&route==='financed')await build(page,6,'park');else await defer(page);
  await expect(page.locator('#c60-sheet')).toBeHidden();await open(page,'action');await page.locator('#action [data-v2="settle"]').click();const saved=await state(page);expect(await page.evaluate(()=>valid(game))).toBe(true);expect(await page.evaluate(()=>publicBurden())).toBe(0);
  if([4,8].includes(n)){await page.reload();expect(await state(page)).toEqual(saved);await expect(page.locator('#c60-sheet')).toBeHidden()}
 }
 expect(await page.evaluate(()=>[...promises()])).toEqual([true,true,true]);if(route==='coexist'){expect(await page.evaluate(()=>metrics().traffic)).toBe(80);expect(await page.evaluate(()=>game.spent)).toBe(41)}else expect(await page.evaluate(()=>game.spent)).toBe(48);
 await expect(page.locator('#endtitle')).toBeFocused();await noOverflow(page);const saved=await state(page);await page.reload();expect(await state(page)).toEqual(saved);expect(errors).toEqual([]);expect(requests).toEqual([]);
});
