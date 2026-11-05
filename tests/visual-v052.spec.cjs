'use strict';
const {test,expect}=require('@playwright/test'),{pathToFileURL}=require('node:url'),path=require('node:path'),fs=require('node:fs');
const url=pathToFileURL(path.resolve(__dirname,'../荒謬市長_v0.5.2.html')).href;
const root=path.resolve(__dirname,'../artifacts/v052-screenshots');
async function start(page,lang='zh'){
 await page.addInitScript(()=>{let seed=41;Math.random=()=>((seed=(seed*16807)%2147483647)-1)/2147483646});await page.goto(url);await page.locator('.lang select').selectOption(lang);await page.locator('[data-v2="close"]').click();const order=require('./v0511-engine.cjs').environment({},41).api.game.order;await page.evaluate(order=>{game.order=order;persist();drawV2()},[...order]);
}
async function safePolicy(page){const option=await page.evaluate(()=>cards[game.order[game.turn-1]][2].map((o,i)=>({o,i})).filter(({o})=>(o[2].money||0)>=0&&!(o[3]&&o[3][1].money<0)).sort((a,b)=>((a.o[2].debt||0)-(b.o[2].debt||0))*10-((a.o[2].pop||0)-(b.o[2].pop||0))*2-((a.o[2].ai||0)-(b.o[2].ai||0)))[0].i);await page.locator('[data-v2="policy"][data-index="'+option+'"]').click()}
async function state(page){return page.evaluate(()=>JSON.parse(JSON.stringify({game,valid:valid(game),pledges:promises(),public:publicBurden(),pending:pendingBurden()})))}
async function admin(page,key){await page.locator('[data-v2="action-tab"][data-tab="admin"]').click();await page.locator('[data-v2="admin"][data-type="'+key+'"]').click()}
async function build(page,plot,type){await page.locator('[data-v2="tile"][data-index="'+plot+'"]').click();await page.locator('[data-v2="build"][data-type="'+type+'"]').click()}
async function noOverflow(page){const r=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,body:document.body.scrollWidth}));expect(r.scroll,JSON.stringify(r)).toBeLessThanOrEqual(r.width+1);expect(r.body,JSON.stringify(r)).toBeLessThanOrEqual(r.width+1)}
async function capture(page,info,name){const dir=path.join(root,info.project.name);fs.mkdirSync(dir,{recursive:true});await page.screenshot({path:path.join(dir,name+'.png'),fullPage:true})}
for(const width of [390,1024,1440])for(const lang of ['zh','en','fr','nl']){
 test.describe(width+' '+lang,()=>{test.use({viewport:{width,height:width===390?844:900}});
 test('offline twelve-turn financed route, disclosures, reloads and screenshots',async({page},info)=>{
  const errors=[],requests=[];page.on('pageerror',e=>errors.push(String(e)));page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url())});
  await start(page,lang);await expect(page.locator('html')).toHaveAttribute('lang',lang==='zh'?'zh-Hant':lang);await expect(page.locator('#map .tile')).toHaveCount(9);await expect(page.locator('#v041-brief > div')).toHaveCount(6);await noOverflow(page);
  await page.locator('#v041-jump').focus();await page.keyboard.press('Enter');await expect(page.locator('#action')).toBeFocused();expect(await page.locator('#action').evaluate(e=>e.getBoundingClientRect().top)).toBeLessThanOrEqual(100);
  await capture(page,info,'default-'+width+'-'+lang);
  for(let n=1;n<=12;n++){
   await safePolicy(page);
   if(n===1){await page.locator('[data-v2="action-tab"][data-tab="admin"]').click();const locked=page.locator('[data-v2="admin"][data-type="partnership"]');await expect(locked).toBeDisabled();await expect(locked.locator('.v51-condition')).not.toBeEmpty();
    const before=await state(page);const disclosure=page.locator('.v041-card').first().locator('summary');await disclosure.focus();await page.keyboard.press('Enter');expect((await state(page)).game.phase).toBe(before.game.phase);
    await admin(page,'investment');expect((await state(page)).game.private).toBe(18);
   }else if(n===2){await page.locator('[data-v2="tile"][data-index="0"]').click();const lab=page.locator('[data-v2="build"][data-type="lab"]');await expect(lab).toContainText('18');await capture(page,info,'funded-build-'+width+'-'+lang);await lab.click();
   }else if(n===3)await admin(page,'partnership');
   else if(n===4)await build(page,4,'park');
   else if(n===5)await admin(page,'greenfund');
   else if(n===6)await build(page,3,'lab');
   else if(n===7)await build(page,6,'park');
   else{await page.locator('[data-v2="action-tab"][data-tab="defer"]').click();await page.locator('[data-v2="defer"]:visible').click()}
   await page.locator('[data-v2="settle"]').click();let result=await state(page);expect(result.valid).toBe(true);expect(result.public).toBe(0);
   if([4,8].includes(n)){await page.reload();const reloaded=await state(page);expect(reloaded.game).toEqual(result.game);await expect(page.locator('#v51-reaction')).not.toBeEmpty()}
  }
  const result=await state(page);expect(result.pledges).toEqual([true,true,true]);expect(result.game.spent).toBe(48);expect(result.game.private).toBe(54);expect(result.game.story.events.length).toBeGreaterThan(36);await expect(page.locator('#endtitle')).toBeFocused();await expect(page.locator('#modal .v51-epilogue p')).toHaveCount(4);await noOverflow(page);
  await page.locator('#modal .v51-ledger summary').click();await page.locator('#modal .v51-journal summary').click();await capture(page,info,'ending-'+width+'-'+lang);await page.reload();expect((await state(page)).pledges).toEqual([true,true,true]);expect(errors).toEqual([]);expect(requests).toEqual([]);
 });});
}
for(const lang of ['zh','en','fr','nl']){
 test('causal callbacks and public bills survive reload '+lang,async({page},info)=>{
  await start(page,lang);await page.evaluate(()=>{game.order=[1,7,2,...Array.from({length:15},(_,i)=>i).filter(i=>![1,7,2].includes(i))];persist();drawV2()});
  for(let n=1;n<=5;n++){
   if(n===1)await page.locator('[data-v2="policy"][data-index="0"]').click();else if(n===2)await page.locator('[data-v2="policy"][data-index="2"]').click();else if(n===3)await page.locator('[data-v2="policy"][data-index="1"]').click();else await safePolicy(page);
   await page.locator('[data-v2="action-tab"][data-tab="defer"]').click();await page.locator('[data-v2="defer"]:visible').click();await page.locator('[data-v2="settle"]').click();await page.reload();
  }
  const r=await state(page);expect(r.public).toBe(28);expect(r.pending).toBe(0);expect(r.game.story.events.filter(e=>e.kind==='consequence').map(e=>e.sourceTurn)).toEqual([1,2,3]);
  await page.locator('#v51-story-host summary').click();await page.locator('#v51-ledger-host summary').click();await noOverflow(page);await capture(page,info,'callbacks-'+lang);
 });
 test('optional music and keyboard controls remain functional '+lang,async({page})=>{
  await start(page,lang);await expect(page.locator('[data-music-toggle]').first()).toHaveAttribute('aria-pressed','false');const button=page.locator('[data-music-toggle]').first();await button.focus();await page.keyboard.press('Enter');await expect(button).toHaveAttribute('aria-pressed','true',{timeout:15000});await page.keyboard.press('Enter');await expect(button).toHaveAttribute('aria-pressed','false');await noOverflow(page);
 });
}
test('legacy import is conservative, explicit and leaves V0.5.0 untouched',async({page})=>{
 const {environment}=require('./v052-engine.cjs');const old=environment({},41,'荒謬市長_v0.5.0.html').api.game;old.turn=4;const raw=JSON.stringify(old);
 await page.addInitScript(raw=>localStorage.setItem('absurd-mayor-v02',raw),raw);await page.goto(url);const r=await state(page);expect(r.game.finance.legacy).toBe(true);expect(r.pledges[2]).toBe(false);expect(r.game.finance.capital).toEqual([]);expect(await page.evaluate(()=>localStorage.getItem('absurd-mayor-v02'))).toBe(raw);
 await page.locator('#v51-ledger-host summary').click();await expect(page.locator('#v51-ledger-host .v51-notice')).toBeVisible();await page.reload();expect((await state(page)).game.story.incomplete).toBe(true);
});
test('reduced motion and accessible disclosure names survive language switching',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await start(page);await safePolicy(page);await page.locator('[data-v2="action-tab"][data-tab="admin"]').click();for(const lang of ['en','fr','nl','zh']){await page.locator('.lang select').selectOption(lang);await expect(page.locator('#v51-ledger-host summary')).toHaveAccessibleName(/.+/);for(const summary of await page.locator('.v041-card summary').all())await expect(summary).toHaveAccessibleName(/.+/)}
 const animations=await page.locator('.v042-scene').first().evaluate(e=>getComputedStyle(e).animationName);expect(animations).toBe('none');
});
for(const lang of ['zh','en','fr','nl'])test('loan cost, principal and repayment remain distinct '+lang,async({page},info)=>{
 await page.setViewportSize({width:390,height:844});const errors=[];page.on('pageerror',e=>errors.push(String(e)));await start(page,lang);await expect(page.locator('h1')).toContainText('V0.5.1.1');await safePolicy(page);
 await page.locator('[data-v2="loan"]').click();await build(page,0,'park');let s=await state(page);expect(s.public).toBe(9);expect(s.pending).toBe(18);expect(s.game.private).toBe(0);expect(await page.evaluate(()=>pendingPrincipal51())).toBe(15);
 await page.locator('#v51-ledger-host summary').click();await expect(page.locator('#v51-ledger-host .v51-totals div')).toHaveCount(6);await noOverflow(page);await capture(page,info,'loan-accounting-'+lang);
 const before=s.game;await page.reload();expect((await state(page)).game).toEqual(before);await page.locator('[data-v2="settle"]').click();
 await safePolicy(page);await page.locator('[data-tab="defer"]').click();await page.locator('[data-v2="defer"]:visible').click();await page.locator('[data-v2="settle"]').click();expect(await page.evaluate(()=>pendingPrincipal51())).toBe(8);expect((await state(page)).public).toBe(9);
 await page.reload();expect((await state(page)).pending).toBe(9);await expect(page.locator('#v51-ledger-host .v51-entries')).toContainText(await page.evaluate(()=>ft('principalPart')+' 7'));expect(errors).toEqual([]);
});

// Exercise the complete coexistence route through actual controls in every matrix cell.
for(const width of [390,1024,1440])for(const lang of ['zh','en','fr','nl'])test('airport and AI coexistence, historical checkpoints and character voices '+width+' '+lang,async({page},info)=>{
 await page.setViewportSize({width,height:width===390?844:900});const errors=[];page.on('pageerror',e=>errors.push(String(e)));await start(page,lang);
 for(let n=1;n<=12;n++){
  await safePolicy(page);
  if(n===1)await admin(page,'investment');else if(n===2)await build(page,7,'lab');else if(n===3)await admin(page,'partnership');else if(n===4)await build(page,6,'park');else if(n===5)await build(page,8,'park');else if(n===6){await page.locator('[data-v2="tile"][data-index="7"]').click();await page.locator('[data-v2="upgrade"]').click()}
  else{await page.locator('[data-v2="action-tab"][data-tab="defer"]').click();await page.locator('[data-v2="defer"]:visible').click()}
  await page.locator('[data-v2="settle"]').click();const s=await state(page);expect(s.valid).toBe(true);expect(s.public).toBe(0);expect(await page.evaluate(()=>metrics().traffic)).toBe(80);
  if(n===4||n===8){expect(await page.evaluate(()=>{const e=game.story.events.find(e=>e.kind==='milestone'&&e.turn===(game.turn-1));return milestoneText52(game,e)})).toContain(await page.evaluate(n=>nt(n===4?'m4Coexist':'m8Working'),n));await page.reload();expect((await state(page)).game).toEqual(s.game)}
 }
 expect((await state(page)).pledges).toEqual([true,true,true]);await expect(page.locator('#endtitle')).toBeFocused();await expect(page.locator('[data-industry="coexist"]')).toBeVisible();await expect(page.locator('[data-politics="retained"]')).toBeVisible();await expect(page.locator('.v052-voices [data-character]')).toHaveCount(4);expect(await page.evaluate(()=>endingKey())).toBe('airport');
 await expect(page.locator('[data-character="reporter"]')).toContainText(await page.evaluate(()=>nt('reporterCoexist')));await noOverflow(page);
 // Viewport captures respect the fixed scrollable dialog. Element screenshots of an
 // over-height dialog can otherwise include the page hidden behind it.
 const modal=page.locator('#modal .modal');await modal.evaluate(e=>e.scrollTop=0);await page.screenshot({path:path.join(root,info.project.name,'coexist-top-'+width+'-'+lang+'.png')});
 await page.locator('.v052-voices').evaluate(e=>e.scrollIntoView({block:'start'}));await page.screenshot({path:path.join(root,info.project.name,'coexist-voices-'+width+'-'+lang+'.png')});
 await expect(page.locator('#v052-assessment-title')).toHaveAccessibleName(/.+/);const before=(await state(page)).game;await page.reload();expect((await state(page)).game).toEqual(before);
 expect(errors).toEqual([]);
});

test('actual browser has a single game startup, conservative resume and one restart shuffle',async({page})=>{
 await page.addInitScript(()=>{window.qaRandom=0;window.qaClicks=0;const old=Math.random;Math.random=()=>{window.qaRandom++;return old()};const listen=EventTarget.prototype.addEventListener;EventTarget.prototype.addEventListener=function(type,...args){if(this===document&&type==='click')window.qaClicks++;return listen.call(this,type,...args)};localStorage.setItem('absurd-mayor-v1','sentinel')});
 await page.goto(url);expect(await page.evaluate(()=>({random:qaRandom,clicks:qaClicks,legacy:typeof fresh+':'+typeof s}))).toEqual({random:14,clicks:2,legacy:'undefined:undefined'});await expect(page.locator('#modal .modal')).toHaveCount(1);await page.locator('[data-v2="close"]').click();await safePolicy(page);const before=(await state(page)).game;await page.reload();expect(await page.evaluate(()=>qaRandom)).toBe(0);expect((await state(page)).game).toEqual(before);expect(await page.evaluate(()=>localStorage.getItem('absurd-mayor-v1'))).toBe('sentinel');
 page.once('dialog',dialog=>dialog.accept());await page.locator('[data-v2="restart"]').first().click();expect(await page.evaluate(()=>qaRandom)).toBe(14);await expect(page.locator('#introtitle')).toBeFocused();
});

for(const lang of ['zh','en','fr','nl'])test('current facts and incomplete history remain distinct in the ending '+lang,async({page},info)=>{
 await start(page,lang);const {environment,safePolicy:select}=require('./v052-engine.cjs'),old=environment({},41,'荒謬市長_v0.5.0.html'),a=old.api;while(!a.game.finished){a.choosePolicy(a.game,select(a,a.game));if(a.game.turn===1)a.develop(a.game,1,'lab');else a.deferAction(a.game);a.doSettle(a.game)}const e=environment({'absurd-mayor-v02':JSON.stringify(a.game)}),g=e.api.game;expect(e.api.valid(g)).toBe(true);
 await page.evaluate(g=>{game=g;persist();drawV2();showEnd()},JSON.parse(JSON.stringify(g)));await expect(page.locator('[data-character="employee"]')).toContainText(await page.evaluate(()=>nt('workerUnknown')));await expect(page.locator('[data-character="shop"]')).toContainText(await page.evaluate(()=>nt('shopGrounded')));await expect(page.locator('.v052-assessment')).toContainText(await page.evaluate(()=>nt('financeUnknown')));const raw=JSON.stringify((await state(page)).game);await page.reload();expect(JSON.stringify((await state(page)).game)).toBe(raw);await noOverflow(page);
});
