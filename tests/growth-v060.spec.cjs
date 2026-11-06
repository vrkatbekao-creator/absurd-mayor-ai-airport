const {test,expect}=require('@playwright/test'),path=require('path'),fs=require('fs'),{pathToFileURL}=require('url');
const {environment}=require('./v060-engine.cjs');
const url=pathToFileURL(path.resolve(__dirname,'../荒謬市長_v0.6.0.html')).href;
const slogans={zh:'AI 起飛，飛機停飛！',en:'AI takes off, planes grounded!',fr:'L’IA décolle, les avions restent au sol !',nl:'AI stijgt op, vliegtuigen blijven aan de grond!'};
const snapshot=page=>page.evaluate(()=>JSON.parse(JSON.stringify(game)));
async function start(page,lang='zh',reduce=false){
 await page.emulateMedia({reducedMotion:reduce?'reduce':'no-preference'});await page.clock.install({time:new Date('2026-11-06T12:00:00Z')});
 await page.addInitScript(()=>{let seed=41;Math.random=()=>((seed=(seed*16807)%2147483647)-1)/2147483646});
 await page.goto(url);await page.clock.pauseAt(new Date('2026-11-06T12:05:00Z'));await page.locator('.lang select').selectOption(lang);await page.locator('[data-v2="close"]').click();
 await page.evaluate(()=>{choosePolicy(game,0);game.selected=7;actionView='land';drawV2()});
}
async function action(page,upgrade=false){
 await page.locator('.c60-plot[data-index="7"]').focus();await page.keyboard.press('Enter');await expect(page.locator('#c60-sheet-title')).toBeFocused();
 const before=await snapshot(page),e=environment({'absurd-mayor-v51':JSON.stringify(before)}),expected=e.api.game;
 expect(upgrade?e.api.upgrade(expected,7):e.api.develop(expected,7,'lab')).toBe(true);
 await page.locator('#action [data-v2="'+(upgrade?'upgrade':'build')+'"]'+(upgrade?'':'[data-type="lab"]')).click();
 expect(await snapshot(page)).toEqual(JSON.parse(JSON.stringify(expected)));await expect(page.locator('#c60-sheet')).toBeHidden();await expect(page.locator('#c60-dock [data-city-view="action"]')).toBeFocused();
 return snapshot(page);
}
async function readyUpgrade(page){await page.evaluate(()=>{doSettle(game);choosePolicy(game,0);game.selected=7;actionView='land';drawV2()});}
async function stored(page){return page.evaluate(()=>localStorage.getItem('absurd-mayor-v51'))}
async function shot(page,info,name){const dir=path.resolve(__dirname,'../artifacts/v060-screenshots',info.project.name);fs.mkdirSync(dir,{recursive:true});await page.mouse.move(0,0);await page.screenshot({path:path.join(dir,name+'.png'),animations:'disabled'})}
async function geometry(page){return page.locator('.c60-scene [data-city-building="7"]').evaluate(e=>{const floors=[...e.querySelectorAll('[data-floor]')],boxes=floors.map(f=>f.getBBox());return {count:floors.length,height:boxes.length?Math.max(...boxes.map(b=>b.y+b.height))-Math.min(...boxes.map(b=>b.y)):0,base: floors[0]?.querySelector('polygon')?.getAttribute('points')}})}
async function noOverflow(page){expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true)}
for(const width of [390,1024,1440])for(const lang of ['zh','en','fr','nl'])test(`layered construction, roof, upgrade, replay and slogan ${width} ${lang}`,async({page},info)=>{
 await page.setViewportSize({width,height:width===390?844:900});const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url())});await start(page,lang);
 await expect(page.locator('.c60-slogan')).toHaveText(slogans[lang]);await expect(page.locator('.c60-slogan')).toBeVisible();
 const post=await action(page),raw=await stored(page);await expect(page.locator('#c60-city')).toHaveAttribute('data-growth-phase','foundation');await expect(page.locator('[data-growth-crane]')).toHaveCount(1);expect((await geometry(page)).count).toBe(0);await shot(page,info,`foundation-${width}-${lang}`);
 await page.clock.runFor(600);await expect(page.locator('#c60-city')).toHaveAttribute('data-growth-phase','frame');await expect(page.locator('[data-growth-frame]')).toHaveCount(1);
 await page.clock.runFor(900);await expect(page.locator('#c60-city')).toHaveAttribute('data-growth-phase','floors');const middle=await geometry(page);expect(middle.count).toBeGreaterThan(0);await expect(page.locator('.c60-scene [data-city-building="7"] [data-growth-roof]')).toHaveCount(0);await shot(page,info,`build-floors-${width}-${lang}`);
 await page.clock.runFor(800);await expect(page.locator('#c60-city')).toHaveAttribute('data-growth-phase','roof');await expect(page.locator('.c60-scene [data-city-building="7"] [data-growth-roof]')).toHaveCount(1);
 await page.clock.runFor(600);await expect(page.locator('#c60-city')).toHaveAttribute('data-growth-phase','complete');await expect(page.locator('[data-growth-crane],[data-growth-frame],[data-growth-fence]')).toHaveCount(0);expect((await geometry(page)).count).toBe(2);expect(await snapshot(page)).toEqual(post);expect(await stored(page)).toBe(raw);
 // Replay and skip are purely presentational and retain the same focused control.
 await page.locator('[data-growth-control]').focus();await page.keyboard.press('Enter');await expect(page.locator('#c60-city')).toHaveAttribute('data-growth-phase','foundation');await page.clock.runFor(650);await page.keyboard.press('Enter');await expect(page.locator('[data-growth-control]')).toBeFocused();await expect(page.locator('#c60-city')).toHaveAttribute('data-growth-phase','complete');expect(await snapshot(page)).toEqual(post);expect(await stored(page)).toBe(raw);
 await readyUpgrade(page);const initial=await geometry(page),upgraded=await action(page,true),upRaw=await stored(page);expect((await geometry(page)).count).toBe(2);expect((await geometry(page)).base).toBe(initial.base);await shot(page,info,`upgrade-foundation-${width}-${lang}`);
 await page.clock.runFor(900);await expect(page.locator('#c60-city')).toHaveAttribute('data-growth-phase','frame');
 expect(Number((await page.locator('.c60-scene').getAttribute('viewBox')).split(' ')[2])).toBeLessThan(760);
 await page.clock.runFor(1000);await expect(page.locator('#c60-city')).toHaveAttribute('data-growth-phase','floors');expect((await geometry(page)).count).toBeGreaterThan(2);expect((await geometry(page)).count).toBeLessThanOrEqual(7);await shot(page,info,`upgrade-floors-${width}-${lang}`);
 await page.clock.runFor(1100);await expect(page.locator('#c60-city')).toHaveAttribute('data-growth-phase','roof');await shot(page,info,`upgrade-roof-${width}-${lang}`);
 await page.clock.runFor(650);await expect(page.locator('#c60-city')).toHaveAttribute('data-growth-phase','complete');const complete=await geometry(page);expect(complete.count).toBe(7);expect(complete.height).toBeGreaterThan(initial.height+70);expect(complete.base).toBe(initial.base);await expect(page.locator('[data-growth-crane],[data-growth-fence]')).toHaveCount(0);expect(await snapshot(page)).toEqual(upgraded);expect(await stored(page)).toBe(upRaw);await shot(page,info,`growth-complete-${width}-${lang}`);await noOverflow(page);
 const bar=await page.locator('[data-growth-control]').boundingBox();expect(bar.height).toBeGreaterThanOrEqual(44);expect(bar.width).toBeGreaterThanOrEqual(44);expect(errors).toEqual([]);expect(requests).toEqual([]);
});
test('reduced motion builds and upgrades instantly without changing saves',async({page})=>{
 await page.setViewportSize({width:390,height:844});await start(page,'nl',true);const built=await action(page);await expect(page.locator('#c60-city')).toHaveAttribute('data-growth-phase','complete');await expect(page.locator('[data-growth-crane]')).toHaveCount(0);await page.clock.runFor(5000);expect(await snapshot(page)).toEqual(built);await readyUpgrade(page);const upgraded=await action(page,true);expect((await geometry(page)).count).toBe(7);await expect(page.locator('#c60-city')).toHaveAttribute('data-growth-phase','complete');await page.locator('[data-growth-control]').click();await expect(page.locator('#c60-city')).toHaveAttribute('data-growth-phase','complete');expect(await snapshot(page)).toEqual(upgraded);
});
test('navigation and rapid settlement never wait for construction; high-rise neighbours stay reachable',async({page})=>{
 await start(page);const built=await action(page);await page.locator('#c60-dock [data-city-view="finance"]').click();await expect(page.locator('#c60-city')).toHaveAttribute('data-growth-phase','complete');expect(await snapshot(page)).toEqual(built);await page.keyboard.press('Escape');await page.locator('[data-growth-control]').click();await page.locator('#c60-dock [data-city-view="action"]').click();await page.locator('[data-v2="settle"]').click();const next=await snapshot(page);await page.clock.runFor(6000);expect(await snapshot(page)).toEqual(next);await expect(page.locator('.c60-growth')).toBeHidden();
 await page.evaluate(()=>{choosePolicy(game,0);game.selected=7;drawV2()});await action(page,true);await page.locator('[data-growth-control]').click();await page.evaluate(()=>{doSettle(game);choosePolicy(game,0);drawV2()});
 for(let i=0;i<9;i++){await page.locator('.c60-plot[data-index="'+i+'"]').focus();await page.keyboard.press('Enter');expect(await page.evaluate(()=>game.selected)).toBe(i);await expect(page.locator('#c60-sheet-title')).toBeFocused();await page.keyboard.press('Escape')}
 await noOverflow(page);
});
test('reload during animation restores the completed building without replay or new save fields',async({page})=>{
 await start(page);const built=await action(page),raw=await stored(page);await page.clock.runFor(700);await page.locator('[data-growth-control]').click();const finalMarkup=await page.locator('.c60-scene [data-city-building="7"]').innerHTML();await page.locator('[data-growth-control]').click();await page.clock.runFor(700);await page.reload();await expect(page.locator('.c60-plot')).toHaveCount(9);expect(await snapshot(page)).toEqual(built);expect(await stored(page)).toBe(raw);expect((await geometry(page)).count).toBe(2);expect(await page.locator('.c60-scene [data-city-building="7"]').innerHTML()).toBe(finalMarkup);await expect(page.locator('.c60-growth')).toBeHidden();await expect(page.locator('[data-growth-crane]')).toHaveCount(0);await page.clock.runFor(6000);expect(await snapshot(page)).toEqual(built);
});
test('language and motion preference changes mid-animation preserve state and announce only milestones',async({page})=>{
 await start(page);await page.evaluate(()=>{window.growthAnnouncements=[];new MutationObserver(()=>growthAnnouncements.push(document.querySelector('.c60-city').nextElementSibling.textContent)).observe(document.querySelector('.c60-city').nextElementSibling,{childList:true,subtree:true})});
 const built=await action(page);await page.clock.runFor(1500);const before=await geometry(page);await page.locator('.lang select').selectOption('fr');await expect(page.locator('.c60-slogan')).toHaveText(slogans.fr);expect((await geometry(page)).count).toBe(before.count);expect(await snapshot(page)).toEqual(built);await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('#c60-city')).toHaveAttribute('data-growth-phase','complete');expect(await snapshot(page)).toEqual(built);await page.clock.runFor(6000);await expect(page.locator('[data-growth-crane]')).toHaveCount(0);const messages=await page.evaluate(()=>growthAnnouncements);expect(messages.filter(Boolean).length).toBeLessThanOrEqual(2);expect(messages.join(' ')).not.toContain('undefined');
});
test('completed lab windows remain dim under an actual power shortage',async({page})=>{
 await start(page,'en',true);await page.evaluate(()=>{develop(game,5,'data');doSettle(game);choosePolicy(game,0);game.selected=7;drawV2()});const saved=await action(page);expect(await page.evaluate(()=>metrics().demand>metrics().supply)).toBe(true);await expect(page.locator('.c60-selected')).toBeHidden();await expect(page.locator('#c60-city')).toHaveAttribute('data-growth-phase','complete');expect(await page.locator('.c60-scene [data-city-building="7"] [data-floor="1"] polygon[fill="#64776a"]').count()).toBeGreaterThan(0);expect(await snapshot(page)).toEqual(saved);
});
