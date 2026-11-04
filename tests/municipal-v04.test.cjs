'use strict';

// v0.2.1 action-layer contract tests. Runs the shipped in-page engine, never a reimplementation.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','荒謬市長_v0.4.html'),'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(x=>x[1]);
assert.equal(scripts.length,2);
const legacyCut=scripts[0].indexOf("document.addEventListener('click',");
const v2Cut=scripts[1].indexOf("document.addEventListener('click',e=>{let b=e.target.closest('[data-v2]')");
assert.ok(legacyCut>0&&v2Cut>0);
function environment(save){
  const storage=new Map(save?Object.entries(save):[]);
  const localStorage={
    getItem:k=>storage.has(k)?storage.get(k):null,
    setItem:(k,v)=>storage.set(k,String(v)),
    removeItem:k=>storage.delete(k)
  };
  const ctx=vm.createContext({localStorage,console});
  vm.runInContext(scripts[0].slice(0,legacyCut),ctx,{timeout:3000});
  vm.runInContext(scripts[1].slice(0,v2Cut),ctx,{timeout:3000});
  const api=vm.runInContext('({game,newGame,valid,metrics,promises,endingKey,choosePolicy,develop,upgrade,administration,deferAction,doSettle,municipal,A,builds,M})',ctx);
  return {api,ctx,storage};
}
const {api}=environment();
const {newGame,valid,metrics,promises,endingKey,choosePolicy,develop,upgrade,administration,deferAction,doSettle}=api;
function enterAction(g){g.phase='build';return g;}
function play12(pick){
  const g=newGame();g.order=Array.from({length:15},(_,i)=>i);
  for(let i=0;i<12;i++){
    assert.equal(g.phase,'policy');
    choosePolicy(g,1);
    assert.equal(g.phase,'build');
    assert.equal(pick(g,i),true);
    assert.equal(g.phase,'settle');
    doSettle(g);
  }
  assert.equal(g.turn,12);
  assert.equal(g.phase,'done');
  assert.equal(g.finished,true);
  assert.equal(g.milestones.length,3);
  assert.equal(valid(JSON.parse(JSON.stringify(g))),true);
  return g;
}
test('12-turn zero-construction strategy is valid and retains airport',()=>{
  const g=play12(g=>deferAction(g));
  assert.equal(metrics(g).traffic,80);
  assert.equal(g.spent,0);
  assert.equal(g.deferred,12);
  assert.equal(g.debt>=12,true);
  assert.equal(promises(g)[2],true);
});
test('construction is restricted to original plots; no overwrite',()=>{
  const g=enterAction(newGame());
  assert.equal(develop(g,3,'lab'),true);
  const old={...g.tiles[3]};
  const money=g.money,spent=g.spent;
  enterAction(g);
  assert.equal(develop(g,3,'data'),false);
  assert.deepEqual({...g.tiles[3]},old);
  assert.equal(g.money,money);
  assert.equal(g.spent,spent);
  assert.equal(metrics(g).redeveloped,1);
});
test('single level upgrade is effective, preserves type, and is not free',()=>{
  const g=enterAction(newGame());
  assert.equal(develop(g,3,'lab'),true);
  const before=metrics(g),money=g.money,spent=g.spent;
  enterAction(g);
  assert.equal(upgrade(g,3),true);
  assert.equal(g.tiles[3].type,'lab');
  assert.equal(g.tiles[3].level,2);
  assert.equal(metrics(g).ai,before.ai+2);
  assert.equal(metrics(g).demand,before.demand+1);
  assert.equal(metrics(g).redeveloped,before.redeveloped);
  assert.equal(g.money,money-11);
  assert.equal(g.spent,spent+11);
  enterAction(g);
  assert.equal(upgrade(g,3),false);
});
test('power upgrade raises supply, market upgrade raises business income',()=>{
  const g=enterAction(newGame());
  develop(g,6,'power');
  assert.equal(metrics(g).supply,13); // untouched old substation still supplies +3
  enterAction(g);upgrade(g,6);
  assert.equal(metrics(g).supply,16);
  enterAction(g);develop(g,7,'market');
  assert.equal(metrics(g).biz,3);
  enterAction(g);upgrade(g,7);
  assert.equal(metrics(g).biz,4);
});
test('administration is at most once per option; investment ledger reconciles',()=>{
  const g=enterAction(newGame());
  assert.equal(administration(g,'investment'),true);
  assert.equal(g.money,73);
  assert.equal(g.private,8);
  assert.equal(g.debt,5);
  enterAction(g);
  assert.equal(administration(g,'investment'),false);
  assert.equal(g.money,73);
  assert.equal(g.private,8);
  assert.equal(administration(g,'research'),true);
  assert.equal(g.ai,6);
  enterAction(g);
  assert.equal(administration(g,'consult'),true);
  enterAction(g);
  assert.equal(administration(g,'audit'),true);
  enterAction(g);
  assert.equal(administration(g,'audit'),false);
  assert.deepEqual(Object.keys(g.adminUsed).sort(),['audit','consult','investment','research']);
  assert.equal(administration(g,'nonsense'),false);
});
test('deferral costs political capital and can be repeated indefinitely',()=>{
  const g=enterAction(newGame());
  deferAction(g);assert.equal(g.pop,58);assert.equal(g.debt,4);
  enterAction(g);
  deferAction(g);assert.equal(g.pop,56);assert.equal(g.debt,5);
});
test('can complete 12 rounds with limited construction, upgrades and administration',()=>{
  const g=play12((g,i)=>{
    if(i===0)return develop(g,3,'lab');
    if(i===1)return develop(g,0,'market');
    if(i===2)return upgrade(g,3);
    if(i===3)return administration(g,'research');
    if(i===4)return upgrade(g,0);
    if(i===5)return administration(g,'consult');
    if(i===6)return administration(g,'investment');
    if(i===7)return administration(g,'audit');
    return deferAction(g);
  });
  assert.equal(metrics(g).redeveloped,2);
  assert.equal(g.tiles[3].level,2);
  assert.equal(g.tiles[0].level,2);
});
test('old v0.2 saved game loads without new optional fields',()=>{
  const g=newGame();
  delete g.adminUsed;delete g.deferred;
  g.tiles[3]={icon:'🧪',name:'AI 孵化中心',traffic:0,type:'lab'};
  assert.equal(valid(JSON.parse(JSON.stringify(g))),true);
  const {api:restored}=environment({'absurd-mayor-v02':JSON.stringify(g)});
  assert.equal(restored.game.tiles[3].level,1);
  assert.equal(restored.game.deferred,0);
  assert.deepEqual(Object.keys(restored.game.adminUsed),[]);
});
test('all five narrative endings remain representative and mutually prioritized',()=>{
  const miracle=newGame();for(const i of [0,3])miracle.tiles[i]={icon:'🧪',name:'AI 孵化中心',type:'lab',traffic:0,level:1};
  miracle.ai=80;miracle.aiValue=100;miracle.lost=20;
  assert.equal(endingKey(miracle),'miracle');
  const heater=newGame();for(const i of [6,7,8])heater.tiles[i]={icon:'🖥️',name:'資料中心',type:'data',traffic:0,level:1};
  assert.equal(endingKey(heater),'heater');
  const pigeon=newGame();for(const i of [6,7,8])pigeon.tiles[i]={icon:'🌿',name:'綠地保護區',type:'park',traffic:0,level:1};
  assert.equal(endingKey(pigeon),'pigeon');
  const ppt=newGame();ppt.hype=75;assert.equal(endingKey(ppt),'ppt');
  assert.equal(endingKey(newGame()),'airport');
});
test('localized rules mention municipal phase, not maintenance',()=>{
  assert.match(api.M.rules.zh,/市政行動/);
  assert.match(api.M.rules.en,/municipal action/);
  assert.match(api.M.rules.fr,/action municipale/);
  assert.match(api.M.rules.nl,/stadsactie/);
  for(const lang of ['zh','en','fr','nl']){
    for(const key of ['choose','build','upgrade','municipal','consult','research','investment','audit','defer','defCost']){
      assert.ok(api.A[lang][key]);
    }
  }
});
test('seeded random games always complete with new legal actions and preserve rules',()=>{
  let seed=20261104;
  const rng=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
  const b=['lab','data','show','power','park','market'];
  for(let run=0;run<300;run++){
    const g=newGame();
    g.order=Array.from({length:15},(_,i)=>i);
    for(let turn=0;turn<12;turn++){
      choosePolicy(g,Math.floor(rng()*3));
      const availableOriginal=g.tiles.map((t,i)=>t.type==='original'?i:-1).filter(i=>i>=0);
      const availableUpgrade=g.tiles.map((t,i)=>t.type!=='original'&&(t.level||1)===1?i:-1).filter(i=>i>=0);
      const availAdmin=Object.keys(api.municipal).filter(k=>!g.adminUsed[k]);
      const p=rng();
      if(p<.35&&availableOriginal.length)develop(g,availableOriginal[Math.floor(rng()*availableOriginal.length)],b[Math.floor(rng()*b.length)]);
      else if(p<.6&&availableUpgrade.length)upgrade(g,availableUpgrade[Math.floor(rng()*availableUpgrade.length)]);
      else if(p<.8&&availAdmin.length)administration(g,availAdmin[Math.floor(rng()*availAdmin.length)]);
      else deferAction(g);
      assert.equal(g.phase,'settle');
      doSettle(g);
    }
    assert.equal(g.finished,true);
    assert.equal(valid(JSON.parse(JSON.stringify(g))),true);
    if(endingKey(g)==='miracle')assert.ok(metrics(g).redeveloped>=2);
  }
});
