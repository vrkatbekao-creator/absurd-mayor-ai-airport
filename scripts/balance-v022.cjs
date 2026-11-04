'use strict';
// Reproducible 800-run comparison using shipped v0.2.1 embedded engine.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const html=fs.readFileSync(path.resolve(__dirname,'../荒謬市長_v0.2.html'),'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(x=>x[1]);
if(scripts.length!==2)throw Error('HTML structure changed');
const a=scripts[0].indexOf("document.addEventListener('click',");
const b=scripts[1].indexOf("document.addEventListener('click',e=>{let b=e.target.closest('[data-v2]')");
if(a<0||b<0)throw Error('Cannot isolate in-page model');
const ctx=vm.createContext({localStorage:{getItem:()=>null,setItem:()=>{}},console});
vm.runInContext(scripts[0].slice(0,a),ctx);
vm.runInContext(scripts[1].slice(0,b),ctx);
const {newGame,valid,metrics,endingKey,choosePolicy,develop,upgrade,administration,deferAction,doSettle,cards,municipal}
=vm.runInContext('({newGame,valid,metrics,endingKey,choosePolicy,develop,upgrade,administration,deferAction,doSettle,cards,municipal})',ctx);
const endings=['heater','miracle','pigeon','ppt','airport'];
function rng(seed){let z=seed>>>0;return ()=>{z=(Math.imul(z,1664525)+1013904223)>>>0;return z/4294967296}}
function deck(seed){const r=rng(seed),a=Array.from({length:15},(_,i)=>i);for(let i=14;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function impact(e,mode){return (e.money||0)*1.2+(e.pop||0)*1.5+(e.ai||0)*1.6+(e.hype||0)*(mode==='propaganda'?.95:.2)-(e.debt||0)*2.5}
function choose(g,mode,r){if(mode==='random')return Math.floor(r()*3);const c=cards[g.order[g.turn-1]];return c[2].map((o,i)=>({i,score:impact(o[2],mode)+(o[3]&&g.turn+o[3][0]<=12?.65*impact(o[3][1],mode):0)+r()*.01})).sort((x,y)=>y.score-x.score)[0].i}
const plans={
preserve:[['admin','audit'],['admin','consult'],['admin','research'],['admin','investment']],
gradual:[['build',3,'lab'],['build',6,'power'],['upgrade',3],['build',4,'data'],['upgrade',4],['admin','research'],['admin','consult'],['build',7,'park'],['admin','audit'],['build',0,'market'],['admin','investment']],
aggressive:[['build',1,'data'],['build',2,'lab'],['build',3,'data'],['build',4,'lab'],['build',5,'power'],['build',6,'power'],['upgrade',1],['upgrade',2],['upgrade',3],['upgrade',4],['admin','research'],['admin','audit']],
upgrade:[['build',3,'data'],['upgrade',3],['build',4,'lab'],['upgrade',4],['build',6,'power'],['upgrade',6],['admin','research'],['admin','audit'],['admin','consult'],['build',7,'market'],['upgrade',7],['admin','investment']],
administration:[['admin','consult'],['admin','research'],['admin','investment'],['admin','audit']],
propaganda:[['build',6,'show'],['upgrade',6],['build',7,'show'],['upgrade',7],['build',8,'show'],['upgrade',8],['admin','investment'],['admin','audit'],['admin','consult'],['admin','research']],
green:[['build',6,'park'],['build',7,'park'],['build',8,'park'],['upgrade',6],['upgrade',7],['upgrade',8],['admin','consult'],['admin','audit'],['admin','research'],['admin','investment']],
random:[]
};
function act(g,mode,turn,r){
  if(mode!=='random'){const p=plans[mode][turn];if(!p)return deferAction(g);
    if(p[0]==='build')return develop(g,p[1],p[2])||deferAction(g);
    if(p[0]==='upgrade')return upgrade(g,p[1])||deferAction(g);
    if(p[0]==='admin')return administration(g,p[1])||deferAction(g);
    return deferAction(g);
  }
  const plots=g.tiles.map((t,i)=>t.type==='original'?i:-1).filter(i=>i>=0);
  const ups=g.tiles.map((t,i)=>t.type!=='original'&&(t.level||1)===1?i:-1).filter(i=>i>=0);
  const admins=Object.keys(municipal).filter(k=>!g.adminUsed[k]);
  const k=r(),types=['lab','data','show','power','park','market'];
  if(k<.38&&plots.length)return develop(g,plots[Math.floor(r()*plots.length)],types[Math.floor(r()*types.length)]);
  if(k<.65&&ups.length)return upgrade(g,ups[Math.floor(r()*ups.length)]);
  if(k<.85&&admins.length)return administration(g,admins[Math.floor(r()*admins.length)]);
  return deferAction(g);
}
function play(mode,seed){
  const r=rng(seed^0x9e3779b9),g=newGame();g.order=deck(seed);
  for(let t=0;t<12;t++){
    if(g.phase!=='policy')throw Error('Bad phase');
    choosePolicy(g,choose(g,mode,r));
    if(g.phase!=='build'||!act(g,mode,t,r)||g.phase!=='settle')throw Error('Bad action '+mode);
    doSettle(g);
  }
  if(!g.finished||!valid(JSON.parse(JSON.stringify(g))))throw Error('Broken final state');
  const m=metrics(g),ending=endingKey(g);
  if(!endings.includes(ending))throw Error('Unknown ending');
  return {money:g.money,pop:g.pop,ai:g.ai,aiValue:g.aiValue,lost:g.lost,spent:g.spent,debt:g.debt,distressTurns:g.distressTurns,traffic:m.traffic,redeveloped:m.redeveloped,ending};
}
const samples=100,summary={};
function avg(rows,k){return +(rows.reduce((n,r)=>n+r[k],0)/rows.length).toFixed(2)}
for(const name of Object.keys(plans)){
  const rows=Array.from({length:samples},(_,i)=>play(name,20261104+i*7919));
  summary[name]={games:samples,money:avg(rows,'money'),support:avg(rows,'pop'),AI:avg(rows,'ai'),AIValue:avg(rows,'aiValue'),airportLoss:avg(rows,'lost'),traffic:avg(rows,'traffic'),spending:avg(rows,'spent'),debt:avg(rows,'debt'),redeveloped:avg(rows,'redeveloped'),distress:rows.filter(x=>x.distressTurns>0).length,endings:Object.fromEntries(endings.map(k=>[k,rows.filter(x=>x.ending===k).length]))};
}
const dir=path.resolve(__dirname,'../artifacts/balance');fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'v022_baseline.json'),JSON.stringify({seed:20261104,samplesPerStrategy:samples,summary},null,2)+'\n');
let report='# v0.2.2 balance baseline\n\n800 deterministic complete games (8 strategies × 100). Same seeded 12/15 event decks across strategies. Shared deterministic policy heuristic (propaganda mode weights hype). These are scripted comparisons, not human play or an optimization proof.\n\n';
report+='| Strategy | Treasury | Support | AI | AI value | Airport loss | Traffic | Distress/100 | Heater | Miracle | Pigeon | PPT | Airport |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n';
for(const [name,v] of Object.entries(summary))report+=[name,v.money,v.support,v.AI,v.AIValue,v.airportLoss,v.traffic,v.distress,...endings.map(k=>v.endings[k])].join(' | ').replace(/^/,'| ').concat(' |\n');
report+='\nAll quantities are fictional game units. Future balancing must replay identical seeds and compare the whole distribution, not only the AI miracle rate.\n';
fs.writeFileSync(path.join(dir,'v022_baseline.md'),report);
console.log('V022_BALANCE_JSON_START');
console.log(JSON.stringify(summary));
console.log('V022_BALANCE_JSON_END');
console.log(report);
