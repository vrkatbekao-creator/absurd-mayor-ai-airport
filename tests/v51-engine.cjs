'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function environment(save={},seed=41,file='荒謬市長_v0.5.1.html'){
 const html=fs.readFileSync(path.join(__dirname,'..',file),'utf8');
 const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(x=>x[1]);
 const storage=new Map(Object.entries(save)),localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,''+v),removeItem:k=>storage.delete(k)};
 const random=()=>((seed=(seed*16807)%2147483647)-1)/2147483646;
 const ctx=vm.createContext({localStorage,console,Math:Object.assign(Object.create(Math),{random})});
 const cuts=[scripts[0].indexOf("document.addEventListener('click',"),scripts[1].indexOf("document.getElementById('v041-jump').addEventListener")];
 if(cuts.some(n=>n<0))throw Error('Engine cut missing');
 for(let i=0;i<2;i++)vm.runInContext(scripts[i].slice(0,cuts[i]),ctx,{timeout:3000});
 const names='game,newGame,valid,metrics,promises,endingKey,choosePolicy,develop,upgrade,administration,deferAction,doSettle,builds,cards,municipal';
 const extra=(file.includes('v0.5.1')||file.includes('v5.1'))?',projectQuote,publicBurden,pendingBurden,financeReady,takeLoan,migrateV50,validV2,storyReaction51,eventTitle51,source51,epilogue51,F51,configureV51':'';
 const api=vm.runInContext('({'+names+extra+'})',ctx);return {api,ctx,storage};
}
function safePolicy(api,g){
 const options=api.cards[g.order[g.turn-1]][2];
 return options.map((o,i)=>({o,i})).filter(({o})=>(o[2].money||0)>=0&&!(o[3]&&o[3][1].money<0)).sort((a,b)=>((a.o[2].debt||0)-(b.o[2].debt||0))*10-((a.o[2].pop||0)-(b.o[2].pop||0))*2-((a.o[2].ai||0)-(b.o[2].ai||0)))[0].i;
}
const route=[g=>['admin','investment'],g=>['build',0,'lab'],g=>['admin','partnership'],g=>['build',4,'park'],g=>['admin','greenfund'],g=>['build',3,'lab'],g=>['build',6,'park']];
function act(api,g,action){const [k,a,b]=action;if(k==='admin')return api.administration(g,a);if(k==='build')return api.develop(g,a,b);return api.deferAction(g)}
function play(seed=41,reload=false){let env=environment({},seed),g=env.api.game;const rows=[];
 for(let n=0;n<12;n++){
  const api=env.api;api.choosePolicy(g,safePolicy(api,g));
  const action=n<route.length?route[n](g):['defer'];if(!act(api,g,action))throw Error('Action locked at turn '+g.turn+' '+JSON.stringify(action)+' ai='+g.ai+' pop='+g.pop);
  api.doSettle(g);if(!api.valid(g))throw Error('Invalid save at turn '+(n+1));
  rows.push({turn:n+1,money:g.money,pop:g.pop,ai:g.ai,debt:g.debt,private:g.private,spent:g.spent,public:api.publicBurden(g),pledges:[...api.promises(g)]});
  if(reload){env=environment({'absurd-mayor-v51':JSON.stringify(g)},seed);g=env.api.game}
 }
 return {env,g,rows};
}
module.exports={environment,safePolicy,play,act};
