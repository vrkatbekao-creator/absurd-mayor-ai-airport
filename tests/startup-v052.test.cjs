'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const {environment,safePolicy}=require('./v052-engine.cjs');
test('new game has one shuffle; resume consumes no random numbers and preserves old keys',()=>{
 const e=environment({'absurd-mayor-v1':'legacy-sentinel'});assert.equal(e.randomCalls,14);assert.equal(vm.runInContext('typeof fresh+":"+typeof s+":"+typeof policy',e.ctx),'undefined:undefined:undefined');
 const raw=JSON.stringify(e.api.game),loaded=environment({'absurd-mayor-v51':raw,'absurd-mayor-v1':'legacy-sentinel'});assert.equal(loaded.randomCalls,0);assert.equal(JSON.stringify(loaded.api.game),raw);assert.equal(loaded.storage.get('absurd-mayor-v1'),'legacy-sentinel');assert.deepEqual(loaded.writes,[]);
 vm.runInContext('persist()',loaded.ctx);assert.equal(loaded.storage.get('absurd-mayor-v1'),'legacy-sentinel');assert.ok(loaded.writes.every(k=>['absurd-mayor-v51','absurd-mayor-language'].includes(k)));
 vm.runInContext('game=newGame()',loaded.ctx);assert.equal(loaded.randomCalls,14);
});
test('shipped data script has no old engine, DOM events or startup rendering',()=>{
 const s=fs.readFileSync(path.join(__dirname,'../荒謬市長_v0.5.2.html'),'utf8');const data=s.match(/<script id="v052-data">([\s\S]*?)<\/script>/)[1];assert.doesNotMatch(data,/document\.|localStorage|Math\.random|function fresh|let s=/);assert.match(data,/const cards=/);assert.match(data,/const builds=/);assert.match(s,/V052_ENGINE_END/);
});
test('fixed policy orders preserve every state through policy, action, settlement and reload',()=>{
 const routes={private:[['admin','investment'],['build',0,'lab'],['admin','partnership'],['build',4,'park'],['admin','greenfund'],['build',3,'lab'],['build',6,'park']],coexist:[['admin','investment'],['build',7,'lab'],['admin','partnership'],['build',6,'park'],['build',8,'park'],['upgrade',7]],public:[['build',0,'lab'],['build',3,'lab'],['build',4,'park'],['build',6,'park'],['admin','consult'],['admin','audit'],['upgrade',0],['admin','research']],airport:[['admin','research'],['admin','consult'],['admin','audit']]};
 for(let seed=1;seed<=100;seed++)for(const [name,route] of Object.entries(routes)){
  const old=environment({},seed,'荒謬市長_v0.5.1.1.html');let next=environment({},seed);const a=old.api.game;let b=next.api.game;b.order=[...a.order];
  for(let n=0;n<12;n++){
   const option=safePolicy(old.api,a);old.api.choosePolicy(a,option);next.api.choosePolicy(b,option);assert.equal(JSON.stringify(b),JSON.stringify(a),name+' policy '+seed);
   for(const [api,g] of [[old.api,a],[next.api,b]]){const x=route[n]||['defer'];const ok=x[0]==='admin'?api.administration(g,x[1]):x[0]==='build'?api.develop(g,x[1],x[2]):x[0]==='upgrade'?api.upgrade(g,x[1]):api.deferAction(g);assert.equal(ok,true)}
   assert.equal(JSON.stringify(b),JSON.stringify(a));old.api.doSettle(a);next.api.doSettle(b);assert.equal(JSON.stringify(b),JSON.stringify(a),name+' settle '+seed);
   next=environment({'absurd-mayor-v51':JSON.stringify(b)},seed);b=next.api.game;assert.equal(JSON.stringify(b),JSON.stringify(a));
  }assert.equal(next.api.endingKey(b),old.api.endingKey(a));
 }
});
