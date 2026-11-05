'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm');
const {environment,safePolicy}=require('./v052-engine.cjs');
function coexist(stop=12){const e=environment(),{api}=e,g=api.game;g.order=[...environment({},41,'荒謬市長_v0.5.1.1.html').api.game.order];const route=[['admin','investment'],['build',7,'lab'],['admin','partnership'],['build',6,'park'],['build',8,'park'],['upgrade',7]];
 for(let n=0;n<stop;n++){api.choosePolicy(g,safePolicy(api,g));const x=route[n]||['defer'];const ok=x[0]==='admin'?api.administration(g,x[1]):x[0]==='build'?api.develop(g,x[1],x[2]):x[0]==='upgrade'?api.upgrade(g,x[1]):api.deferAction(g);assert.equal(ok,true);api.doSettle(g)}api.configureV51();api.configureV052();return {...e,g};}
test('coexistence is an industrial success and a political reversal without changing ending rules',()=>{
 const {api,g}=coexist();const before=JSON.stringify(g),a=api.assessment52(g);assert.equal(a.industry,'coexist');assert.equal(a.politics,'retained');assert.equal(a.traffic,80);assert.equal(a.ai,58);assert.equal(a.met,3);assert.equal(api.endingKey(g),'airport');assert.ok(api.assessmentPanel52().includes('data-industry="coexist"'));assert.equal(JSON.stringify(g),before);
});
test('policy score alone is not described as operating AI',()=>{const {api}=environment(),g=api.game;g.ai=60;assert.equal(api.assessment52(g).industry,'policyOnly');g.hype=100;assert.equal(api.assessment52(g).industry,'publicity')});
test('industrial branches cover smaller airport, closure, shortage, ecology and no facilities',()=>{
 const {api}=environment(),g=api.game;assert.equal(api.assessment52(g).industry,'airportOnly');g.phase='build';api.develop(g,0,'lab');g.ai=50;assert.equal(api.assessment52(g).industry,'mixed');assert.equal(api.assessment52(g).politics,'partial');g.phase='build';api.develop(g,1,'data');assert.equal(api.assessment52(g).industry,'replacement');g.phase='build';api.develop(g,2,'data');assert.equal(api.assessment52(g).industry,'shortage');
 const h=api.newGame();h.phase='build';api.develop(h,6,'park');h.phase='build';api.develop(h,8,'park');assert.equal(api.assessment52(h).industry,'green');
});
test('checkpoint text uses the city at that turn rather than later construction',()=>{
 const {api,g}=coexist(4),e=g.story.events.find(x=>x.kind==='milestone');const before=api.milestoneText52(g,e);assert.match(before,/其他地塊.*AI/);g.phase='build';api.develop(g,1,'data');assert.equal(api.metrics(g).traffic,0);assert.equal(api.milestoneText52(g,e),before);assert.equal(api.historyState52(g,e).tiles[1].type,'original');
});
test('incomplete old history remains unknown, while present-day facts are still visible',()=>{
 const old=environment({},41,'荒謬市長_v0.5.0.html').api.game;old.turn=5;const e=environment({'absurd-mayor-v02':JSON.stringify(old)}),g=e.api.game;e.api.configureV51();e.api.configureV052();const a=e.api.assessment52(g);assert.equal(a.verified,2);assert.equal(a.financeUnknown,true);assert.match(e.api.milestoneText52(g,{turn:4,key:'milestone4b'}),/舊歷史不足/);assert.match(e.api.assessmentPanel52(),/無法核實/);
});
test('four languages share all assessment keys and summaries without writing state',()=>{
 const {api,g,ctx}=coexist();const before=JSON.stringify(g);for(const lang of ['zh','en','fr','nl']){vm.runInContext('lang='+JSON.stringify(lang),ctx);for(const [k,v] of Object.entries(api.N52))assert.ok(v[lang],k);assert.ok(api.assessmentPanel52().length>100)}assert.equal(JSON.stringify(g),before);
});
module.exports={coexist};
