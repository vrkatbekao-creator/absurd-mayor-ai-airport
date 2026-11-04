'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.resolve(__dirname,'../荒謬市長_v0.4.html'),'utf8');
const blocks=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
assert.equal(blocks.length,2);
const a=blocks[0].indexOf("document.addEventListener('click',");
const b=blocks[1].indexOf("document.addEventListener('click',e=>{let b=e.target.closest('[data-v2]')");
assert.ok(a>0&&b>0);
function api(){
 const storage=new Map();
 const ctx=vm.createContext({localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},console});
 vm.runInContext(blocks[0].slice(0,a),ctx);
 vm.runInContext(blocks[1].slice(0,b),ctx);
 const x=vm.runInContext('({newGame,metrics,endingKey,choosePolicy,develop,upgrade,administration,deferAction,doSettle,valid,VIS,statSpecs,v04Stats,v04Timeline,v04Chips,v04MapTile,v04PolicyScene,shortTileName})',ctx);
 return {ctx,...x};
}
test('six bars and data labels render under all four languages',()=>{
 const {ctx,newGame,metrics,v04Stats}=api();
 for(const language of ['zh','en','fr','nl']){
  vm.runInContext("lang='"+language+"'",ctx);
  const m=metrics(newGame()),s=v04Stats(m);
  assert.equal((s.match(/class="v04-meter"/g)||[]).length,6);
  assert.equal((s.match(/class="stat v04-metric"/g)||[]).length,6);
  assert.ok(s.includes('80/80'));
  assert.ok(!s.includes('undefined'),language+' has missing label');
  assert.ok(!s.includes('NaN'),language+' invalid bar');
 }
});
test('AI meter uses the campaign target 50, with a localized threshold label',()=>{
 const {ctx,statSpecs,newGame,metrics,v04Stats,VIS}=api();
 assert.equal(statSpecs.find(x=>x.key==='ai').max,50);
 for(const language of ['zh','en','fr','nl']){
  vm.runInContext("lang='"+language+"'",ctx);
  const stats=v04Stats(metrics(newGame()));
  assert.ok(stats.includes(VIS[language].aiTarget),language+' pledge target missing');
  assert.ok(!stats.includes('undefined'));
 }
});
test('all 12 milestones render; current round advances in simulation',()=>{
 const {ctx,newGame,choosePolicy,deferAction,doSettle,v04Timeline}=api();
 const initial=v04Timeline();
 assert.equal((initial.match(/role="listitem"/g)||[]).length,12);
 assert.equal((initial.match(/milestone/g)||[]).length,3);
 assert.equal((initial.match(/aria-current="step"/g)||[]).length,1);
 const g=newGame();
 for(let i=0;i<4;i++){choosePolicy(g,1);deferAction(g);doSettle(g);}
 assert.equal(g.turn,5);
 // Visual helper uses the active engine game, which is advanced separately.
 const steps=vm.runInContext('v04Timeline()',ctx);
 assert.equal((steps.match(/role="listitem"/g)||[]).length,12);
});
test('positive promise debt is negative, publicity has neutral styling',()=>{
 const {v04Chips}=api();
 assert.match(v04Chips({money:-8,pop:5,debt:2},false),/📋[^<]*\+2/);
 assert.match(v04Chips({debt:2},false),/v04-effect negative/);
 assert.match(v04Chips({debt:-2},false),/v04-effect (?!negative)/);
 assert.match(v04Chips({hype:10},false),/v04-effect neutral/);
 assert.match(v04Chips({money:-12},true),/later/);
});
test('all original and redeveloped map tiles remain accessible',()=>{
 const {newGame,metrics,v04MapTile}=api();const g=newGame(),m=metrics(g);
 const tiles=g.tiles.map((t,i)=>v04MapTile(t,i,m));
 assert.equal(tiles.length,9);
 assert.ok(tiles.every(x=>x.includes('aria-label=')&&x.includes('data-v2="tile"')));
 assert.ok(tiles.every(x=>x.includes('data-type="original"')));
 g.tiles[3]={icon:'🧪',name:'AI 孵化中心',type:'lab',traffic:0,level:2};
 const after=v04MapTile(g.tiles[3],3,metrics(g));
 assert.match(after,/data-type="lab"/);
 assert.match(after,/Lv\.2/);
 assert.match(after,/data-index="3"/);
});
test('critical simulation and persistence checks: 500 deterministic mixed games',()=>{
 const {newGame,choosePolicy,develop,upgrade,administration,deferAction,doSettle,valid}=api();
 let seed=4042026;function rand(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
 const types=['lab','data','show','power','park','market'];
 for(let n=0;n<500;n++){
   const g=newGame();g.order=Array.from({length:15},(_,i)=>i);
   for(let turn=0;turn<12;turn++){
     assert.equal(g.phase,'policy');choosePolicy(g,Math.floor(rand()*3));
     const free=g.tiles.map((t,i)=>t.type==='original'?i:-1).filter(i=>i>=0);
     const ups=g.tiles.map((t,i)=>t.type!=='original'&&t.level===1?i:-1).filter(i=>i>=0);
     const admin=['consult','research','investment','audit'].filter(k=>!g.adminUsed[k]);
     const r=rand();let ok=false;
     if(r<.4&&free.length)ok=develop(g,free[Math.floor(rand()*free.length)],types[Math.floor(rand()*types.length)]);
     else if(r<.65&&ups.length)ok=upgrade(g,ups[Math.floor(rand()*ups.length)]);
     else if(r<.86&&admin.length)ok=administration(g,admin[Math.floor(rand()*admin.length)]);
     else ok=deferAction(g);
     if(!ok)ok=deferAction(g);
     assert.equal(ok,true);assert.equal(g.phase,'settle');doSettle(g);
   }
   assert.equal(g.finished,true);
   assert.equal(g.turn,12);
   assert.equal(valid(JSON.parse(JSON.stringify(g))),true);
 }
});
test('visual HTML remains offline and feature scripts are syntactically valid',()=>{
 assert.ok(!/<script[^>]*src\s*=/i.test(html));
 assert.ok(!/<link[^>]*href\s*=\s*["']https?:/i.test(html));
 for(const block of blocks)assert.doesNotThrow(()=>new Function(block));
});

test('v0.4 presentation does not mutate v0.3 financial, policy or ending model',()=>{
 const stable=fs.readFileSync(path.resolve(__dirname,'../荒謬市長_v0.3.html'),'utf8');
 const original=stable.slice(stable.indexOf('function metrics(g=game)'),stable.indexOf('function drawV2(){')).trim();
 const v04=html.slice(html.indexOf('function metrics(g=game)'),html.indexOf('/* v0.4 presentation helpers')).trim();
 assert.ok(original.length>12000);
 assert.equal(v04,original,'core economics, promises and civic actions must be identical to stable v0.3');
});

test('airport grounding and insufficient power are flagged without hiding labels',()=>{
 const {newGame,metrics,v04MapTile}=api();
 const g=newGame();
 g.tiles[1]={icon:'🧠',name:'資料中心',type:'data',traffic:0,level:1};
 let m=metrics(g);
 assert.equal(m.traffic,0,'runway removal grounds airport');
 assert.match(v04MapTile(g.tiles[1],1,m),/is-grounded/);
 g.tiles[3]={icon:'🧠',name:'資料中心',type:'data',traffic:0,level:1};
 g.tiles[4]={icon:'🧠',name:'資料中心',type:'data',traffic:0,level:1};
 m=metrics(g);
 assert.ok(m.demand>m.supply);
 assert.match(v04MapTile(g.tiles[3],3,m),/is-blackout/);
 assert.match(v04MapTile(g.tiles[3],3,m),/aria-label=/);
});
