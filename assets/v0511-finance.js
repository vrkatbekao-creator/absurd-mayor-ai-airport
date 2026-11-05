/* V0.5.1.1 finance: segregated paid-in equity, project allocations and public liabilities. */
function newFinance(){return {version:1,legacy:false,legacySpent:0,legacyPrivate:0,capital:[],projects:[],charges:[],obligations:[],share:false}}
function newStory(){return {version:1,incomplete:false,events:[]}}
function remember(g,event){g.story.events.push({turn:g.turn,...event})}
function financeRule(key){return {
 investment:{amount:18,pop:-3,debt:2,hype:2},
 partnership:{amount:24,pop:-3,debt:0,hype:0},
 greenfund:{amount:12,pop:0,debt:0,hype:-4}
}[key]}
function financeReady(g,key){
 if(!financeRule(key)||g.adminUsed[key])return false;
 const m=metrics(g);
 return key==='investment'||(g.pop>=40&&m.demand<=m.supply&&g.ai>=(key==='partnership'?4:12)&&(key!=='greenfund'||m.parks>=1));
}
function capitalEligible(capital,type){return capital.kind!=='greenfund'||['park','power'].includes(type)}
function privateAvailable(g,type){return g.finance.capital.filter(c=>capitalEligible(c,type)).reduce((n,c)=>n+c.amount-c.used,0)}
function projectQuote(g,type,cost){const paid=Math.min(cost,privateAvailable(g,type));return {cost,private:paid,public:cost-paid}}
function financeProject(g,plot,type,cost,kind){
 const q=projectQuote(g,type,cost),allocations=[];let left=q.private;
 for(const c of g.finance.capital){if(!capitalEligible(c,type)||left===0)continue;const amount=Math.min(left,c.amount-c.used);if(amount){c.used+=amount;left-=amount;allocations.push({capitalId:c.id,amount})}}
 g.money-=q.public;g.spent+=cost;
 g.finance.projects.push({turn:g.turn,kind,plot,type,...q,allocations});
}
function publicCharge(g,amount,kind){if(amount>0)g.finance.charges.push({turn:g.turn,amount,kind})}
function publicObligation(g,amount,due,origin,sourceTurn,card,option){
 const id='o'+(g.finance.obligations.length+1);
 g.finance.obligations.push({id,amount,due,origin,sourceTurn,card:card??null,option:option??null,paid:false});return id;
}
function loanPrincipal51(o){return o.origin==='loan'?(o.due===o.sourceTurn+1?7:8):0}
function pendingPrincipal51(g=game){return g.finance.obligations.filter(o=>!o.paid).reduce((n,o)=>n+loanPrincipal51(o),0)}
function publicBurden(g=game){const f=g.finance;return f.legacySpent+f.projects.reduce((n,p)=>n+p.public,0)+f.charges.reduce((n,c)=>n+c.amount,0)+f.obligations.reduce((n,o)=>n+o.amount-loanPrincipal51(o),0)}
function pendingBurden(g=game){return g.finance.obligations.filter(o=>!o.paid).reduce((n,o)=>n+o.amount,0)}
function investorShare(g,produced){return g.finance.share?Math.floor(Math.floor(produced/3)/2):0}
function takeLoan(g){
 if(g.loan||g.finished)return false;g.loan=true;apply(g,{money:15,debt:2});
 for(let n=1;n<=2;n++){const due=g.turn+n,id=publicObligation(g,9,due,'loan',g.turn);g.queue.push({due,effect:{money:-9},obligation:id,sourceTurn:g.turn})}
 remember(g,{kind:'loan'});return true;
}
function migrateV50(v){
 const g=JSON.parse(JSON.stringify(v));g.version=3;g.adminUsed=g.adminUsed||{};g.finance=newFinance();g.finance.legacy=true;g.finance.legacySpent=g.spent;g.finance.legacyPrivate=g.private;g.story=newStory();g.story.incomplete=true;
 g.log=g.log.filter(e=>e.kind!=='build'||e.type!=='maintain');
 for(const q of g.queue){if(!Number.isInteger(q.card)||!cards[q.card]||!Number.isInteger(q.option)||!cards[q.card][2][q.option]){delete q.card;delete q.option}delete q.sourceTurn;if(q.effect.money<0)q.obligation=publicObligation(g,-q.effect.money,q.due,'legacy',null,q.card,q.option)}
 return g;
}
function validFinance(g){
 const f=g.finance,integer=n=>Number.isSafeInteger(n)&&n>=0,turn=n=>Number.isInteger(n)&&n>=1&&n<=12;
 if(!f||f.version!==1||typeof f.legacy!=='boolean'||typeof f.share!=='boolean'||!integer(f.legacySpent)||!integer(f.legacyPrivate)||!['capital','projects','charges','obligations'].every(k=>Array.isArray(f[k])))return false;
 if(f.capital.length>3||f.projects.length>12||f.charges.length>27||f.obligations.length>16||(!f.legacy&&(f.legacySpent||f.legacyPrivate)))return false;
 const ids=new Set(),used=new Map();
 for(const c of f.capital){const r=financeRule(c.kind);if(!r||c.id!==c.kind||ids.has(c.id)||!turn(c.turn)||c.turn>g.turn||c.amount!==r.amount||!integer(c.used)||c.used>c.amount||!g.adminUsed[c.kind])return false;ids.add(c.id);used.set(c.id,0)}
 for(const p of f.projects){if(!turn(p.turn)||p.turn>g.turn||!['build','upgrade'].includes(p.kind)||!Number.isInteger(p.plot)||p.plot<0||p.plot>8||!builds[p.type]||!integer(p.cost)||!integer(p.private)||!integer(p.public)||p.cost!==p.private+p.public||p.cost!==(p.kind==='build'?builds[p.type].cost:Math.max(5,Math.ceil(builds[p.type].cost*.6)))||!Array.isArray(p.allocations))return false;
  let sum=0;const seen=new Set();for(const a of p.allocations){const c=f.capital.find(c=>c.id===a.capitalId);if(!c||c.turn>p.turn||!capitalEligible(c,p.type)||!integer(a.amount)||a.amount===0||seen.has(c.id))return false;seen.add(c.id);sum+=a.amount;used.set(c.id,used.get(c.id)+a.amount)}if(sum!==p.private)return false;
 }
 if(f.capital.some(c=>used.get(c.id)!==c.used)||g.spent!==f.legacySpent+f.projects.reduce((n,p)=>n+p.cost,0)||g.private!==f.legacyPrivate+f.capital.reduce((n,c)=>n+c.amount,0)||f.share!==f.capital.some(c=>c.kind==='partnership'))return false;
 for(const c of f.charges)if(!turn(c.turn)||c.turn>g.turn||!integer(c.amount)||c.amount===0||!['policy','admin','financing'].includes(c.kind))return false;
 const obligations=new Set();for(const o of f.obligations){if(typeof o.id!=='string'||obligations.has(o.id)||!integer(o.amount)||!o.amount||!Number.isInteger(o.due)||o.due<1||o.due>15||!['policy','loan','legacy'].includes(o.origin)||typeof o.paid!=='boolean'||(o.sourceTurn!==null&&(!turn(o.sourceTurn)||o.sourceTurn>g.turn)))return false;obligations.add(o.id);
  if(o.origin==='policy'&&(!Number.isInteger(o.card)||!cards[o.card]||!Number.isInteger(o.option)||!cards[o.card][2][o.option]))return false;
  const matches=g.queue.filter(q=>q.obligation===o.id);if(o.paid?matches.length!==0:matches.length!==1||matches[0].due!==o.due||matches[0].effect.money!==-o.amount)return false;
 }
 if(g.queue.some(q=>(q.effect.money<0&&!obligations.has(q.obligation))||(q.obligation&&!obligations.has(q.obligation))))return false;
 const s=g.story;if(!s||s.version!==1||typeof s.incomplete!=='boolean'||s.incomplete!==f.legacy||!Array.isArray(s.events)||s.events.length>100)return false;
 const expectedCharges=[];let expectedObligations=0;
 for(const e of s.events){
  if(e.kind==='policy'){
   const c=cards[e.card]?.[2]?.[e.option];if(!c)return false;if(c[2].money<0)expectedCharges.push({turn:e.turn,amount:-c[2].money,kind:'policy'});
   if(c[3]?.[1].money<0){expectedObligations++;if(!f.obligations.some(o=>o.origin==='policy'&&o.sourceTurn===e.turn&&o.card===e.card&&o.option===e.option&&o.due===e.turn+c[3][0]&&o.amount===-c[3][1].money))return false}
  }
  if(e.kind==='admin'){
   if(financeRule(e.key)){if(!f.capital.some(c=>c.kind===e.key&&c.turn===e.turn))return false}
   else{const cost={consult:6,research:7,audit:4}[e.key];if(!cost)return false;expectedCharges.push({turn:e.turn,amount:cost,kind:'admin'})}
  }
  if(e.kind==='loan'){expectedObligations+=2;for(let n=1;n<=2;n++)if(!f.obligations.some(o=>o.origin==='loan'&&o.sourceTurn===e.turn&&o.amount===9&&o.due===e.turn+n))return false}
  if(e.kind==='settlement'&&e.fee>0)expectedCharges.push({turn:e.turn,amount:e.fee,kind:'financing'});
 }
 if(f.charges.length!==expectedCharges.length||f.charges.some((c,i)=>['turn','amount','kind'].some(k=>c[k]!==expectedCharges[i][k]))||f.obligations.filter(o=>o.origin!=='legacy').length!==expectedObligations)return false;
 return s.events.every(e=>{if(!e||!turn(e.turn)||e.turn>g.turn||!['policy','build','upgrade','admin','defer','settlement','consequence','milestone','loan','revise'].includes(e.kind))return false;
  if(e.kind==='policy')return Number.isInteger(e.card)&&!!cards[e.card]&&Number.isInteger(e.option)&&!!cards[e.card][2][e.option];
  if(['build','upgrade'].includes(e.kind))return !!builds[e.type]&&Number.isInteger(e.plot)&&e.plot>=0&&e.plot<9;
  if(e.kind==='admin')return ['consult','research','investment','audit','partnership','greenfund'].includes(e.key);
  if(e.kind==='milestone')return ['milestone4a','milestone4b','milestone8a','milestone8b','milestone12'].includes(e.key);
  if(e.kind==='settlement')return ['airport','production','share','fee'].every(k=>integer(e[k]));
  if(e.kind==='consequence')return (e.sourceTurn===null||turn(e.sourceTurn))&&(e.card===null||Number.isInteger(e.card)&&!!cards[e.card]&&Number.isInteger(e.option)&&!!cards[e.card][2][e.option]);
  return true;
 });
}
function valid(v){
 if(!v||v.version!==3||!v.adminUsed||typeof v.adminUsed!=='object'||Array.isArray(v.adminUsed)||Object.entries(v.adminUsed).some(([k,a])=>!['consult','research','investment','audit','partnership','greenfund'].includes(k)||a!==true))return false;
 const adminUsed=Object.fromEntries(Object.entries(v.adminUsed).filter(([k])=>!['partnership','greenfund'].includes(k)));
 return validV2({...v,version:2,adminUsed})&&validFinance(v);
}
