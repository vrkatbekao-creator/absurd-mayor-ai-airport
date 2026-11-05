'use strict';
// Compare the actual shipped engines, including every saved field at each phase.
const {environment,safePolicy,act}=require('../tests/v052-engine.cjs'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const count=Number((process.argv.find(x=>x.startsWith('--seeds='))||'--seeds=2000').split('=')[1]);
const routes={private:[['admin','investment'],['build',0,'lab'],['admin','partnership'],['build',4,'park'],['admin','greenfund'],['build',3,'lab'],['build',6,'park']],public:[['build',0,'lab'],['build',3,'lab'],['build',4,'park'],['build',6,'park'],['admin','consult'],['admin','audit'],['upgrade',0],['admin','research']],airport:[['admin','research'],['admin','consult'],['admin','audit']],publicity:[['build',0,'show'],['build',4,'show'],['build',3,'show']],overbuild:[['build',1,'data'],['build',2,'data'],['admin','consult'],['admin','research'],['admin','audit'],...[0,3,4,6,7,8].map(i=>['build',i,'data']),['upgrade',1]],coexist:[['admin','investment'],['build',7,'lab'],['admin','partnership'],['build',6,'park'],['build',8,'park'],['upgrade',7]]};
const report={version:'0.5.2',baseline:'0.5.1.1',seeds:count,scope:'Six fixed action routes, paired identical policy orders, all saved fields after policy/action/settlement, round-6 and completed-save reloads. No claim of exhaustive or optimal-policy balance.',pairedGames:count*6,simulatedGames:count*12,strategies:{}};
for(const [name,route] of Object.entries(routes)){
 const sum={money:0,pop:0,ai:0,publicCost:0,traffic:0},endings={};let met=0;
 for(let seed=1;seed<=count;seed++){
  const old=environment({},seed,'荒謬市長_v0.5.1.1.html');let next=environment({},seed);const a=old.api.game;let b=next.api.game;b.order=[...a.order];
  const same=phase=>assert.equal(JSON.stringify(b),JSON.stringify(a),name+' '+seed+' '+phase);
  for(let n=0;n<12;n++){
   let option=safePolicy(old.api,a);const opts=old.api.cards[a.order[a.turn-1]][2];if(name==='publicity'||name==='overbuild')option=opts.map((o,i)=>({i,v:name==='publicity'?(o[2].hype||0):-(o[2].money||0)})).sort((x,y)=>y.v-x.v)[0].i;
   for(const [api,g] of [[old.api,a],[next.api,b]]){assert.equal(api.choosePolicy(g,option),true);if(name==='overbuild'&&n===0)assert.equal(api.takeLoan(g),true)}same('policy '+n);
   const x=route[n]||['defer'];for(const [api,g] of [[old.api,a],[next.api,b]])assert.equal(x[0]==='upgrade'?api.upgrade(g,x[1]):act(api,g,x),true,name+' action');same('action '+n);
   old.api.doSettle(a);next.api.doSettle(b);same('settle '+n);assert.equal(next.api.valid(JSON.parse(JSON.stringify(b))),true);
   if(n===5||n===11){next=environment({'absurd-mayor-v51':JSON.stringify(b)},seed);b=next.api.game;same('reload '+n);assert.equal(next.randomCalls,0)}
  }
  assert.equal(next.api.endingKey(b),old.api.endingKey(a));assert.deepEqual([...next.api.promises(b)],[...old.api.promises(a)]);
  const m=next.api.metrics(b);if(name==='coexist'){assert.equal(m.traffic,80);assert.equal(b.lost,0);assert.equal(next.api.assessment52(b).industry,'coexist')}
  for(const k of Object.keys(sum))sum[k]+=k==='traffic'?m.traffic:k==='publicCost'?next.api.publicBurden(b):b[k];const ending=next.api.endingKey(b);endings[ending]=(endings[ending]||0)+1;if(next.api.promises(b).every(Boolean))met++;
 }
 report.strategies[name]={games:count,means:Object.fromEntries(Object.entries(sum).map(([k,v])=>[k,v/count])),allPledges:met,endings};console.log(name+': '+JSON.stringify(report.strategies[name]));
}
fs.mkdirSync(path.resolve(__dirname,'../artifacts'),{recursive:true});fs.writeFileSync(path.resolve(__dirname,'../artifacts/regression-v0.5.2.json'),JSON.stringify(report,null,2));
