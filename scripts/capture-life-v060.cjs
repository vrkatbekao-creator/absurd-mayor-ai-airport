// Reproducible visual fixture: twelve legal actions, leaving the final settlement unplayed.
const {chromium}=require('@playwright/test'),{pathToFileURL}=require('url'),path=require('path'),fs=require('fs');
(async()=>{
 const animate=process.argv.includes('--frames'),executable=process.env.MAYOR_BROWSER_EXECUTABLE||(process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':null);
 const browser=await chromium.launch({headless:true,...(executable?{executablePath:executable}:{})}),page=await browser.newPage({viewport:{width:1024,height:900},reducedMotion:animate?'no-preference':'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));const out=path.resolve(__dirname,'../artifacts/v060-showcase');fs.mkdirSync(out,{recursive:true});
 if(animate)await page.clock.install({time:new Date('2026-11-06T12:00:00Z')});
 await page.addInitScript(()=>{let seed=41;Math.random=()=>((seed=(seed*16807)%2147483647)-1)/2147483646});
 await page.goto(pathToFileURL(path.resolve(__dirname,'../荒謬市長_v0.6.0.html')).href);if(animate)await page.clock.pauseAt(new Date('2026-11-06T12:05:00Z'));await page.locator('[data-v2="close"]').click();
 const fixture=await page.evaluate(()=>{
  const route=[['build',7,'lab'],['build',8,'market'],['build',5,'power'],['build',3,'data'],['build',6,'park'],['build',4,'show'],['upgrade',7],['upgrade',8],['upgrade',5],['upgrade',3],['upgrade',6],['upgrade',4]];
  for(let n=0;n<route.length;n++){const opts=cards[game.order[game.turn-1]][2],safe=opts.map((o,i)=>({o,i})).filter(({o})=>(o[2].money||0)>=0&&!(o[3]&&o[3][1].money<0)).sort((a,b)=>(a.o[2].debt||0)-(b.o[2].debt||0))[0]?.i??0;choosePolicy(game,safe);const [kind,i,type]=route[n];if(!(kind==='build'?develop(game,i,type):upgrade(game,i)))throw Error('Invalid visual fixture');if(n<route.length-1)doSettle(game)}drawV2();return {valid:valid(game),state:JSON.parse(JSON.stringify(game)),metrics:metrics()};
 });
 const night=async()=>{await page.locator('#c60-dock [data-city-view="settings"]').click();await page.locator('[data-city-night]').click();await page.keyboard.press('Escape');await page.mouse.move(0,0)};
 if(animate)await page.clock.runFor(800);await page.mouse.move(0,0);await page.screenshot({path:path.join(out,'day.png'),animations:'disabled'});
 if(animate){for(let n=0;n<60;n++){if(n)await page.clock.runFor(100);if(n===30)await night();await page.screenshot({path:path.join(out,'frame-'+String(n).padStart(2,'0')+'.png'),animations:'disabled'})}}
 else await night();
 await page.screenshot({path:path.join(out,'night.png'),animations:'disabled'});
 const after=await page.evaluate(()=>JSON.parse(JSON.stringify(game)));if(JSON.stringify(after)!==JSON.stringify(fixture.state)||errors.length)throw Error('Visual activity changed game or raised errors');
 fs.writeFileSync(path.join(out,'fixture.json'),JSON.stringify({...fixture,errors,animated:animate},null,2));await browser.close();console.log(out);
})().catch(e=>{console.error(e);process.exitCode=1});
