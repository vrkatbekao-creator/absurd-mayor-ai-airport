'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const previous=require('./v0511-engine.cjs'),cache=new Map();
function environment(save={},seed=41,file='荒謬市長_v0.6.0.html'){
 if(!file.includes('v0.5.2')&&!file.includes('v0.6.0'))return previous.environment(save,seed,file);
 let compiled=cache.get(file);
 if(!compiled){const html=fs.readFileSync(path.join(__dirname,'..',file),'utf8');
  const script=id=>{const m=html.match(new RegExp('<script id="'+id+'">([\\s\\S]*?)<\\/script>'));if(!m)throw Error('Missing stable script '+id);return m[1]};
  const data=script('v052-data'),engine=script('v052-engine'),cut=engine.indexOf('/* V052_ENGINE_END:');if(cut<0)throw Error('Missing bootstrap boundary');
  compiled=[new vm.Script(data),new vm.Script(engine.slice(0,cut))];cache.set(file,compiled);
 }
 let randomCalls=0;const random=()=>{randomCalls++;return((seed=(seed*16807)%2147483647)-1)/2147483646};
 const storage=new Map(Object.entries(save)),writes=[],localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>{writes.push(k);storage.set(k,''+v)},removeItem:k=>storage.delete(k)};
 const ctx=vm.createContext({localStorage,console,Math:Object.assign(Object.create(Math),{random})});
 for(const script of compiled)script.runInContext(ctx,{timeout:3000});
 const api=vm.runInContext('({game,newGame,valid,metrics,promises,endingKey,choosePolicy,develop,upgrade,administration,deferAction,doSettle,builds,cards,municipal,projectQuote,publicBurden,pendingBurden,financeReady,takeLoan,migrateV50,validV2,storyReaction51,eventTitle51,source51,epilogue51,F51,configureV51,loanPrincipal51,pendingPrincipal51,...(typeof assessment52==="function"?{assessment52,historyState52,milestoneText52,assessmentPanel52,N52,configureV052}:{}),...(typeof characterPositions52==="function"?{characterPositions52,epilogue52}:{})})',ctx);
 return {api,ctx,storage,writes,get randomCalls(){return randomCalls}};
}
function play(seed=41,reload=false,order){let env=environment({},seed),g=env.api.game;if(order)g.order=[...order];const rows=[];
 for(let n=0;n<12;n++){
  const api=env.api;api.choosePolicy(g,previous.safePolicy(api,g));const action=[['admin','investment'],['build',0,'lab'],['admin','partnership'],['build',4,'park'],['admin','greenfund'],['build',3,'lab'],['build',6,'park']][n]||['defer'];if(!previous.act(api,g,action))throw Error('Locked seed '+seed+' turn '+g.turn);api.doSettle(g);if(!api.valid(g))throw Error('Invalid save');
  rows.push({turn:n+1,money:g.money,pop:g.pop,ai:g.ai,debt:g.debt,private:g.private,spent:g.spent,public:api.publicBurden(g),pledges:[...api.promises(g)]});
  if(reload){env=environment({'absurd-mayor-v51':JSON.stringify(g)},seed);g=env.api.game}
 }return {env,g,rows};
}
module.exports={environment,play,safePolicy:previous.safePolicy,act:previous.act};
