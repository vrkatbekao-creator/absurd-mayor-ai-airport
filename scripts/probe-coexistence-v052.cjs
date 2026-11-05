'use strict';
const {environment,safePolicy}=require('../tests/v0511-engine.cjs'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const file=path.resolve(__dirname,'../荒謬市長_v0.5.1.1.html'),bytes=fs.readFileSync(file);
if(crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex')!=='0b102f7eeaf496666a8c068688c77ad05497dd88')throw Error('Planning baseline changed');
const route=[['admin','investment'],['build',7,'lab'],['admin','partnership'],['build',6,'park'],['build',8,'park'],['upgrade',7]];
const sum={money:0,pop:0,ai:0,publicCost:0,traffic:0,lost:0},endings={};let all=0,minAI=Infinity,minPop=Infinity;const samples=[];
for(let seed=1;seed<=2000;seed++){
 const {api}=environment({},seed),g=api.game;
 for(let n=0;n<12;n++){
  api.choosePolicy(g,safePolicy(api,g));const a=route[n]||['defer'];
  const ok=a[0]==='admin'?api.administration(g,a[1]):a[0]==='build'?api.develop(g,a[1],a[2]):a[0]==='upgrade'?api.upgrade(g,a[1]):api.deferAction(g);
  if(!ok)throw Error('Locked seed '+seed+' turn '+(n+1));api.doSettle(g);if(!api.valid(JSON.parse(JSON.stringify(g))))throw Error('Invalid save');
 }
 const m=api.metrics(g);if(m.traffic!==80||g.lost!==0)throw Error('Airport changed');if(api.promises(g).every(Boolean))all++;
 for(const k of Object.keys(sum))sum[k]+=k==='publicCost'?api.publicBurden(g):k==='traffic'?m.traffic:g[k];minAI=Math.min(minAI,g.ai);minPop=Math.min(minPop,g.pop);
 const ending=api.endingKey(g);endings[ending]=(endings[ending]||0)+1;
 if(seed===41)samples.push({seed,money:g.money,pop:g.pop,ai:g.ai,debt:g.debt,spent:g.spent,private:g.private,publicCost:api.publicBurden(g),traffic:m.traffic,lost:g.lost,promises:[...api.promises(g)],ending});
}
const report={version:'0.5.1.1',scope:'Planning probe: one airport/AI coexistence route, 2000 seeded policy orders with safe-policy selector; not optimal-strategy coverage.',route,games:2000,allPromises:all,means:Object.fromEntries(Object.entries(sum).map(([k,v])=>[k,v/2000])),minAI,minPop,endings,samples};
const output=path.resolve(__dirname,'../qa/coexistence-planning-v052.json');fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
