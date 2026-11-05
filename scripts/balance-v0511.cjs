'use strict';
// Runs the shipped HTML engine. No economic rules are reimplemented here.
const {environment,safePolicy,act}=require('../tests/v0511-engine.cjs'),fs=require('node:fs'),path=require('node:path');
const version=(process.argv.find(x=>x.startsWith('--version='))||'--version=0.5.1.1').split('=')[1];
const count=Number((process.argv.find(x=>x.startsWith('--seeds='))||'--seeds=2000').split('=')[1]);
const routes={
 private:[['admin','investment'],['build',0,'lab'],['admin','partnership'],['build',4,'park'],['admin','greenfund'],['build',3,'lab'],['build',6,'park']],
 public:[['build',0,'lab'],['build',3,'lab'],['build',4,'park'],['build',6,'park'],['admin','consult'],['admin','audit'],['upgrade',0],['admin','research']],
 airport:[['admin','research'],['admin','consult'],['admin','audit']],
 publicity:[['build',0,'show'],['build',4,'show'],['build',3,'show']],
 overbuild:[['build',1,'data'],['build',2,'data'],['admin','consult'],['admin','research'],['admin','audit'],... [0,3,4,6,7,8].map(i=>['build',i,'data']),['upgrade',1]]
};
const summary={version,seeds:count,scope:'Five fixed action routes on paired shuffled policy orders. Safe policies for private/public/airport; maximum immediate publicity or public spending for the other two routes. No claim of optimal play or all-policy coverage.',strategies:{}};
for(const [name,route] of Object.entries(routes)){
 const sum={money:0,pop:0,ai:0,publicCost:0,lost:0,aiValue:0},ending={},mins={money:Infinity,pop:Infinity},maxs={money:-Infinity,pop:-Infinity};let allPledges=0,deficitGames=0;
 for(let seed=1;seed<=count;seed++){
  const {api}=environment({},seed,'荒謬市長_v'+version+'.html');let g=api.game;
  for(let n=0;n<12;n++){
   let option=safePolicy(api,g);const opts=api.cards[g.order[g.turn-1]][2];
   if(name==='publicity')option=opts.map((o,i)=>({i,v:o[2].hype||0})).sort((a,b)=>b.v-a.v)[0].i;
   if(name==='overbuild')option=opts.map((o,i)=>({i,v:-(o[2].money||0)})).sort((a,b)=>b.v-a.v)[0].i;
   api.choosePolicy(g,option);if(name==='overbuild'&&n===0)api.takeLoan(g);
   const action=route[n]||['defer'];const ok=action[0]==='upgrade'?api.upgrade(g,action[1]):act(api,g,action);if(!ok)throw Error(name+' seed '+seed+' turn '+(n+1)+' locked');
   api.doSettle(g);g=JSON.parse(JSON.stringify(g));if(!api.valid(g))throw Error(name+' seed '+seed+' turn '+(n+1)+' invalid');
  }
  for(const k of Object.keys(sum))sum[k]+=k==='publicCost'?api.publicBurden(g):g[k];for(const k of Object.keys(mins)){mins[k]=Math.min(mins[k],g[k]);maxs[k]=Math.max(maxs[k],g[k])}
  const e=api.endingKey(g);ending[e]=(ending[e]||0)+1;if(api.promises(g).every(Boolean))allPledges++;if(g.distressTurns>0)deficitGames++;
 }
 summary.strategies[name]={games:count,means:Object.fromEntries(Object.entries(sum).map(([k,v])=>[k,Number((v/count).toFixed(2))])),mins,maxs,endings:ending,allPledges,deficitGames};
 console.log(name+': '+JSON.stringify(summary.strategies[name]));
}
fs.mkdirSync(path.resolve(__dirname,'../artifacts'),{recursive:true});fs.writeFileSync(path.resolve(__dirname,'../artifacts/balance-v'+version+'.json'),JSON.stringify(summary,null,2));
