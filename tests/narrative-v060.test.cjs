'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm');
const {environment,safePolicy}=require('./v060-engine.cjs');
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
test('employee response follows the latest recorded training or consultation choice',()=>{
 const {api}=environment(),g=api.game;g.order=[7,4,...Array.from({length:15},(_,i)=>i).filter(i=>![7,4].includes(i))];api.choosePolicy(g,2);assert.equal(api.characterPositions52(g)[0].key,'workerDeferred');api.deferAction(g);api.doSettle(g);api.choosePolicy(g,0);const person=api.characterPositions52(g)[0];assert.equal(person.key,'workerTraining');assert.equal(person.evidence.turn,2);assert.equal(person.stance,'acknowledgement');
});
test('sticker response does not claim retraining was delivered',()=>{
 const {api}=environment(),g=api.game;g.order=[7,...Array.from({length:15},(_,i)=>i).filter(i=>i!==7)];api.choosePolicy(g,1);assert.equal(api.characterPositions52(g)[0].key,'workerStickers');assert.equal(api.characterPositions52(g)[0].stance,'accountability');
});
test('a preserved cargo building with stopped flights is not reported as an operating service',()=>{
 const {api}=environment(),g=api.game;g.phase='build';api.develop(g,1,'lab');assert.equal(g.tiles[3].type,'original');assert.equal(api.metrics(g).traffic,0);assert.equal(api.characterPositions52(g).find(x=>x.role==='shop').key,'shopGrounded');
});
test('recorded transport subsidy is acknowledged without claiming delivery success',()=>{
 const {api}=environment(),g=api.game;g.order=[2,...Array.from({length:15},(_,i)=>i).filter(i=>i!==2)];api.choosePolicy(g,0);const shop=api.characterPositions52(g).find(x=>x.role==='shop');assert.equal(shop.key,'shopFunded');assert.equal(shop.stance,'followup');assert.equal(shop.evidence.turn,1);
});
test('engineer distinguishes working results from policy scores and power shortage',()=>{
 const {api,g}=coexist();assert.equal(api.characterPositions52(g).find(x=>x.role==='engineer').key,'engineerResults');g.phase='build';api.develop(g,0,'data');g.phase='build';api.develop(g,1,'data');assert.equal(api.characterPositions52(g).find(x=>x.role==='engineer').key,'shortageEnd');
 const h=api.newGame();h.ai=60;assert.equal(api.characterPositions52(h).find(x=>x.role==='engineer').key,'engineerNoOutput');
});
test('reporter recognises coexistence while separately holding the closure announcement to account',()=>{
 const {api,g}=coexist();const p=api.characterPositions52(g).find(x=>x.role==='reporter');assert.equal(p.key,'reporterCoexist');assert.equal(api.endingKey(g),'airport');assert.deepEqual([...api.promises(g)],[true,true,true]);api.takeLoan(g); // A finished game cannot add a new loan.
 assert.equal(api.characterPositions52(g).find(x=>x.role==='reporter').key,'reporterCoexist');
 const e=environment();e.api.takeLoan(e.api.game);assert.equal(e.api.characterPositions52(e.api.game).find(x=>x.role==='reporter').key,'reporterPending');
});
test('old incomplete staff history withholds judgment and present facts remain usable',()=>{
 const raw=environment({},41,'荒謬市長_v0.5.0.html').api.game;const e=environment({'absurd-mayor-v02':JSON.stringify(raw)}),p=e.api.characterPositions52(e.api.game);assert.equal(p[0].key,'workerUnknown');assert.equal(p[0].stance,'incomplete');assert.equal(p[1].key,'shopActive');assert.equal(p[3].key,'unknown');
});
test('late facilities with low checkpoint score are not described as passing inspection',()=>{
 const {api}=environment(),g=api.game;g.order=Array.from({length:15},(_,i)=>i);
 for(let turn=1;turn<=8;turn++){api.choosePolicy(g,0);if(turn===8)api.develop(g,7,'lab');else api.deferAction(g);api.doSettle(g)}
 const e=g.story.events.find(x=>x.kind==='milestone'&&x.turn===8);assert.equal(e.key,'milestone8b');assert.equal(api.storyReaction51(e)[1],'checkpoint8Growing');
});
test('all character responses have four-language text and rendering does not change a saved field',()=>{
 const {api,g,ctx}=coexist(),before=JSON.stringify(g);for(const lang of ['zh','en','fr','nl']){vm.runInContext('lang='+JSON.stringify(lang),ctx);const html=api.epilogue52(g);assert.equal((html.match(/data-character=/g)||[]).length,4);assert.ok(html.includes('data-stance="'));assert.ok(!html.includes('undefined'));assert.equal(JSON.stringify(g),before)}
});
module.exports={coexist};
