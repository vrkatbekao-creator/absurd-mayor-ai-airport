'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {environment,play}=require('./v0511-engine.cjs');
function buildState(){const e=environment(),g=e.api.game;g.phase='build';return {...e,g}}
test('private capital is segregated and project allocations conserve money',()=>{
 const {api,g}=buildState();assert.equal(api.administration(g,'investment'),true);assert.equal(g.money,65);assert.equal(g.private,18);
 g.phase='build';assert.equal(api.develop(g,0,'lab'),true);assert.equal(g.money,65);assert.equal(g.spent,18);assert.equal(api.publicBurden(g),0);assert.equal(api.promises(g)[2],true);assert.equal(api.valid(g),true);
 g.phase='build';assert.equal(api.administration(g,'investment'),false);
});
test('public construction cannot be erased by later investment',()=>{
 const {api,g}=buildState();api.develop(g,0,'park');assert.equal(api.publicBurden(g),6);g.phase='build';api.administration(g,'investment');assert.equal(api.publicBurden(g),6);assert.equal(api.promises(g)[2],false);
});
test('green capital is restricted to parks and power',()=>{
 const {api,g}=buildState();g.ai=12;api.develop(g,0,'park');g.phase='build';assert.equal(api.administration(g,'greenfund'),true);
 assert.equal(api.projectQuote(g,'lab',18).private,0);assert.equal(api.projectQuote(g,'power',14).private,12);
 g.phase='build';api.develop(g,4,'park');assert.equal(g.finance.capital[0].used,6);assert.equal(api.valid(g),true);
});
test('funding gates require real progress, public support and adequate power',()=>{
 const {api,g}=buildState();assert.equal(api.administration(g,'partnership'),false);g.ai=4;g.pop=39;assert.equal(api.administration(g,'partnership'),false);g.pop=40;
 assert.equal(api.administration(g,'partnership'),true);assert.equal(g.finance.share,true);g.phase='build';assert.equal(api.administration(g,'partnership'),false);
});
test('upgrades allocate remaining private funds and only charge the public shortfall',()=>{
 const {api,g}=buildState();api.administration(g,'investment');g.phase='build';api.develop(g,0,'park');g.phase='build';api.upgrade(g,0);
 assert.equal(g.spent,11);assert.equal(g.money,65);assert.equal(g.finance.capital[0].used,11);assert.equal(api.valid(g),true);
});
test('free-electricity advance is not equity; obligations are counted at signing and once when paid',()=>{
 const {api,g}=buildState();g.phase='policy';g.order=[1,...Array.from({length:15},(_,i)=>i).filter(i=>i!==1)];api.choosePolicy(g,0);
 assert.equal(g.private,0);assert.equal(g.money,77);assert.equal(api.publicBurden(g),18);assert.equal(api.pendingBurden(g),18);
 api.deferAction(g);api.doSettle(g);for(let n=2;n<=4;n++){api.choosePolicy(g,2);api.deferAction(g);api.doSettle(g)}
 assert.equal(g.finance.obligations[0].paid,true);assert.equal(api.pendingBurden(g),0);assert.equal(api.publicBurden(g),18);assert.equal(api.valid(g),true);
 const callback=g.story.events.find(e=>e.kind==='consequence'&&e.card===1);assert.equal(callback.sourceTurn,1);assert.equal(callback.turn,4);
});
test('late contracts and loan repayments stay visible beyond turn twelve',()=>{
 const {api,g}=buildState();g.turn=12;g.phase='policy';g.order=[...Array.from({length:15},(_,i)=>i).filter(i=>i!==1)];g.order.splice(11,0,1);api.choosePolicy(g,0);api.takeLoan(g);api.deferAction(g);api.doSettle(g);
 assert.equal(api.publicBurden(g),21);assert.equal(api.pendingBurden(g),36);assert.deepEqual([...g.finance.obligations.map(o=>o.due)].sort(),[13,14,15]);assert.equal(g.private,0);assert.equal(api.valid(g),true);
});
test('policy and administrative costs are public; revenues never erase them',()=>{
 const {api,g}=buildState();api.administration(g,'research');assert.equal(api.publicBurden(g),7);g.phase='policy';g.order=[5,...Array.from({length:15},(_,i)=>i).filter(i=>i!==5)];api.choosePolicy(g,0);assert.equal(api.publicBurden(g),7);
});
test('twelve-turn route fulfills all three pledges with per-turn save reloads',()=>{
 const {env,g,rows}=play(41,true);assert.deepEqual([...env.api.promises(g)],[true,true,true]);assert.equal(g.finance.capital.length,3);assert.equal(g.spent,48);assert.equal(env.api.publicBurden(g),0);assert.equal(g.turn,12);assert.equal(g.phase,'done');assert.ok(g.story.events.length>8);assert.equal(g.milestones.length,3);
 const output=path.join(__dirname,'../artifacts/v0511-route.json');fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify({seed:41,rows,ending:env.api.endingKey(g),storyEvents:g.story.events.length},null,2));
});
test('fixed finance route works across 1000 reproducible shuffled policy orders without a required card',()=>{
 let minPop=100,minMoney=Infinity,minAI=Infinity;for(let seed=1;seed<=1000;seed++){
  const {env,g}=play(seed);assert.deepEqual([...env.api.promises(g)],[true,true,true],'seed '+seed);minPop=Math.min(minPop,g.pop);minMoney=Math.min(minMoney,g.money);minAI=Math.min(minAI,g.ai);
 }
 const report={seeds:1000,minEndingSupport:minPop,minEndingTreasury:minMoney,minEndingAI:minAI,scope:'One fixed finance route with an adaptive safe-policy rule; not a proof of universal balance.'};
 fs.writeFileSync(path.join(__dirname,'../artifacts/v0511-seed-summary.json'),JSON.stringify(report,null,2));
});
test('V0.5.0 import preserves original storage and never duplicates its cash or capital',()=>{
 const old=environment({},41,'荒謬市長_v0.5.0.html');const g=old.api.game;g.phase='build';old.api.administration(g,'investment');g.phase='build';old.api.develop(g,0,'park');old.api.doSettle(g);
 const saved=JSON.stringify(g),e=environment({'absurd-mayor-v02':saved});assert.equal(e.api.game.version,3);assert.equal(e.api.game.money,g.money);assert.equal(e.api.game.private,8);assert.equal(e.api.game.finance.capital.length,0);assert.equal(e.api.publicBurden(e.api.game),6);assert.equal(e.api.promises(e.api.game)[2],false);assert.equal(e.api.game.story.incomplete,true);assert.equal(e.api.valid(e.api.game),true);assert.equal(e.storage.get('absurd-mayor-v02'),saved);
 const reload=environment({'absurd-mayor-v51':JSON.stringify(e.api.game),'absurd-mayor-v02':saved});assert.equal(reload.api.game.finance.legacy,true);
});
test('invalid V0.5.1 save starts fresh and does not silently revert to V0.5.0',()=>{
 const e=environment({'absurd-mayor-v51':'{"version":3}','absurd-mayor-v02':JSON.stringify(environment({},1,'荒謬市長_v0.5.0.html').api.game)});assert.equal(e.api.game.finance.legacy,false);assert.equal(e.api.game.spent,0);
});
test('reject corrupted allocations, overspending, duplicated ids and missing ledger fields',()=>{
 const {env,g}=play();for(const mutate of [x=>delete x.finance,x=>x.finance.capital[0].used++,x=>x.finance.projects[0].private++,x=>x.finance.capital.push({...x.finance.capital[0]}),x=>x.finance.capital[0].amount=999,x=>x.private=999,x=>x.story.events[0].card=999]){
  const copy=JSON.parse(JSON.stringify(g));mutate(copy);assert.equal(env.api.valid(copy),false);
 }
});
test('narrative chains preserve source turns and do not alter economic state',()=>{
 const {api,g,ctx}=buildState();g.phase='policy';g.order=[7,2,...Array.from({length:15},(_,i)=>i).filter(i=>i!==7&&i!==2)];api.choosePolicy(g,2);api.deferAction(g);api.doSettle(g);api.choosePolicy(g,1);api.deferAction(g);api.doSettle(g);api.choosePolicy(g,2);api.deferAction(g);api.doSettle(g);api.choosePolicy(g,2);api.deferAction(g);api.doSettle(g);
 const callbacks=g.story.events.filter(e=>e.kind==='consequence');assert.ok(callbacks.some(e=>e.card===7&&e.sourceTurn===1&&e.turn===3));assert.ok(callbacks.some(e=>e.card===2&&e.sourceTurn===2&&e.turn===4));
 const before=JSON.stringify(g);for(const e of g.story.events){api.storyReaction51(e);api.eventTitle51(e);api.source51(e)}api.epilogue51();assert.equal(JSON.stringify(g),before);assert.equal(api.valid(g),true);
});
test('all five existing ending predicates classify correctly and four languages share story keys',()=>{
 const {api,g,ctx}=buildState();const vm=require('node:vm');api.configureV51();
 for(const lang of ['zh','en','fr','nl']){vm.runInContext('lang='+JSON.stringify(lang),ctx);for(const [key,value] of Object.entries(api.F51))assert.ok(value[lang],key+' '+lang);assert.ok(api.epilogue51().length>100)}
 assert.equal(api.endingKey(g),'airport');g.hype=90;assert.equal(api.endingKey(g),'ppt');g.tiles[0]={...g.tiles[0],type:'data',level:2,traffic:0};g.tiles[4]={...g.tiles[4],type:'data',level:2,traffic:0};assert.equal(api.endingKey(g),'heater');
 g.tiles[0].type='lab';g.tiles[4].type='lab';g.ai=60;g.aiValue=100;g.debt=0;assert.equal(api.endingKey(g),'miracle');g.ai=0;g.tiles[0].type=g.tiles[4].type=g.tiles[6].type='park';assert.equal(api.endingKey(g),'pigeon');
});
test('deficit financing fees count as public cost and cannot be removed from the ledger',()=>{
 const {api,g}=buildState();g.money=-10;api.deferAction(g);api.doSettle(g);assert.equal(api.publicBurden(g),3);assert.equal(api.valid(g),true);
 const copy=JSON.parse(JSON.stringify(g));copy.finance.charges=[];assert.equal(api.valid(copy),false);
});
test('investors receive only a share of actual AI cash income, with no treasury guarantee',()=>{
 const {api,g}=buildState();g.ai=4;api.administration(g,'partnership');api.doSettle(g);assert.equal(g.story.events.find(e=>e.kind==='settlement').share,0);
 g.phase='build';api.develop(g,0,'lab');api.doSettle(g);const e=g.story.events.filter(e=>e.kind==='settlement').at(-1);assert.equal(e.production,4);assert.equal(e.share,0);
 const route=play();assert.ok(route.g.story.events.some(e=>e.kind==='settlement'&&e.production===8&&e.share===1));
});
test('five complete twelve-turn playthroughs reach the five ending classes with valid save roundtrips',()=>{
 const targets=['heater','pigeon','ppt','airport','miracle'];
 for(const target of targets){if(target==='miracle'){const {env,g}=play();assert.equal(env.api.endingKey(g),target);continue}
  const {api}=environment({},41);let g=api.game;
  for(let n=1;n<=12;n++){
   const opts=api.cards[g.order[g.turn-1]][2];const option=target==='ppt'?opts.map((o,i)=>({i,h:o[2].hype||0})).sort((a,b)=>b.h-a.h)[0].i:require('./v0511-engine.cjs').safePolicy(api,g);api.choosePolicy(g,option);
   if(target==='heater'&&n<=2)api.develop(g,n===1?0:4,'data');else if(target==='heater'&&n===3)api.upgrade(g,0);else if(target==='pigeon'&&n<=3)api.develop(g,[0,4,6][n-1],'park');else if(target==='ppt'&&n===1)api.develop(g,0,'show');else api.deferAction(g);
   api.doSettle(g);g=JSON.parse(JSON.stringify(g));assert.equal(api.valid(g),true,target+' turn '+n);
  }
  assert.equal(api.endingKey(g),target);
 }
});
test('high-spending failed strategies keep valid saves with more than 24 public charge entries',()=>{
 const {api}=environment({},16);let g=api.game;
 for(let n=1;n<=12;n++){
  const options=api.cards[g.order[g.turn-1]][2];const option=options.map((o,i)=>({i,c:-(o[2].money||0)})).sort((a,b)=>b.c-a.c)[0].i;api.choosePolicy(g,option);
  if(n<=2)api.develop(g,n,'data');else if(n<=5)api.administration(g,['consult','research','audit'][n-3]);else if(n<=11)api.develop(g,[0,3,4,6,7,8][n-6],'data');else api.upgrade(g,1);
  api.doSettle(g);g=JSON.parse(JSON.stringify(g));assert.equal(api.valid(g),true,'turn '+n);
 }
 assert.equal(g.finance.charges.length,25);assert.ok(g.money<0);assert.equal(api.promises(g)[2],false);
});
test('loan principal is a cash liability; public cost counts its interest once',()=>{
 const {api,g}=buildState();api.takeLoan(g);assert.equal(g.money,80);assert.equal(g.private,0);assert.equal(api.publicBurden(g),3);assert.equal(api.pendingBurden(g),18);assert.equal(api.pendingPrincipal51(g),15);
 api.develop(g,0,'park');assert.equal(g.money,74);assert.equal(api.publicBurden(g),9);assert.equal(api.valid(g),true);
});
test('repaying both installments lowers outstanding principal without charging the project twice',()=>{
 const {api,g}=buildState();api.takeLoan(g);api.deferAction(g);api.doSettle(g);
 for(let n=2;n<=3;n++){api.choosePolicy(g,require('./v0511-engine.cjs').safePolicy(api,g));api.deferAction(g);api.doSettle(g);assert.equal(api.publicBurden(g),3);assert.equal(api.pendingPrincipal51(g),n===2?8:0);assert.equal(api.pendingBurden(g),n===2?9:0);assert.equal(api.valid(g),true)}
});
test('V0.5.1 saves with unpaid loans load exactly and recompute derived cost',()=>{
 const old=environment({},41,'荒謬市長_v0.5.1.html');const g=old.api.game;g.phase='build';old.api.takeLoan(g);old.api.develop(g,0,'park');const raw=JSON.stringify(g);assert.equal(old.api.publicBurden(g),24);
 const next=environment({'absurd-mayor-v51':raw});assert.equal(JSON.stringify(next.api.game),raw);assert.equal(next.api.publicBurden(next.api.game),9);assert.equal(next.api.pendingBurden(next.api.game),18);assert.equal(next.api.valid(next.api.game),true);
});
test('paired old/new runs preserve every saved field, cash flow, promise and ending',()=>{
 const previous=environment({},41,'荒謬市長_v0.5.1.html'),next=environment({},41);let a=previous.api.game,b=next.api.game;
 for(let n=1;n<=12;n++){for(const [api,g] of [[previous.api,a],[next.api,b]]){api.choosePolicy(g,require('./v0511-engine.cjs').safePolicy(api,g));if(n===1)api.takeLoan(g);if(n===1)api.develop(g,0,'lab');else if(n===2)api.develop(g,3,'lab');else api.deferAction(g);api.doSettle(g)}
  assert.equal(JSON.stringify(a),JSON.stringify(b));assert.deepEqual([...previous.api.promises(a)],[...next.api.promises(b)]);assert.equal(previous.api.publicBurden(a)-next.api.publicBurden(b),15);
 }
 assert.equal(previous.api.endingKey(a),next.api.endingKey(b));
});
