"""Reproduce the single offline V5.1 HTML from the preserved V5.0 release."""
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
s = (root / '荒謬市長_v5.0.html').read_text(encoding='utf-8')

def replace(old, new):
    global s
    assert s.count(old) == 1, (old[:90], s.count(old))
    s = s.replace(old, new)

def function(name, new):
    global s
    pattern = r'^function ' + name + r'\([^\n]+$'
    s, n = re.subn(pattern, lambda _: new, s, flags=re.M)
    assert n == 1, name

replace("const VKEY='absurd-mayor-v02'", "const VKEY='absurd-mayor-v51'")
replace('function valid(v){', 'function validV2(v){')
replace("function newGame(){return {version:2,", "function newGame(){return {version:3,finance:newFinance(),story:newStory(),")
finance = (root / 'assets/v51-finance.js').read_text(encoding='utf-8')
presentation = (root / 'assets/v51-presentation.js').read_text(encoding='utf-8')
replace("const VKEY='absurd-mayor-v51'", finance + '\n' + presentation + "\nconst VKEY='absurd-mayor-v51'")

start = s.index("let game,notice='';try{")
end = s.index('\n', start)
s = s[:start] + """let game,notice='';try{
 const raw=localStorage.getItem(VKEY);
 if(raw){const obj=JSON.parse(raw);if(valid(obj))game=obj;else notice='invalid51'}
 else{const old=localStorage.getItem('absurd-mayor-v02');if(old){const obj=JSON.parse(old);if(validV2(obj)){const copy=migrateV50(obj);if(valid(copy)){game=copy;notice='migrated51'}else notice='invalid51'}else notice='invalid51'}}
}catch(_){notice='invalid51'}if(!game)game=newGame();game.adminUsed=game.adminUsed||{};game.deferred=game.deferred||0;game.tiles.forEach(t=>{if(t.type!=='original'&&!t.level)t.level=1});""" + s[end:]
function('promises', "function promises(g=game){const m=metrics(g);return [g.ai>=50,m.parks>=2&&m.demand<=m.supply,!g.finance.legacy&&publicBurden(g)===0]}")
function('choosePolicy', """function choosePolicy(g,i){
 if(g.phase!=='policy')return false;const idx=g.order[g.turn-1],c=cards[idx][2][i];if(!c)return false;
 publicCharge(g,Math.max(0,-(c[2].money||0)),'policy');apply(g,c[2]);
 if(c[3]){const due=g.turn+c[3][0],q={due,effect:{...c[3][1]},card:idx,option:i,sourceTurn:g.turn};if(q.effect.money<0)q.obligation=publicObligation(g,-q.effect.money,due,'policy',g.turn,idx,i);g.queue.push(q)}
 const e={kind:'policy',card:idx,option:i};g.log.unshift({turn:g.turn,...e});g.log=g.log.slice(0,8);remember(g,e);g.phase='build';return true;
}""")
function('finishAction', "function finishAction(g,kind,data={}){g.log.unshift({turn:g.turn,kind,...data});g.log=g.log.slice(0,8);remember(g,{kind,...data});g.phase='settle';g.selected=null}")
replace('g.money-=b.cost;g.spent+=b.cost;', "financeProject(g,idx,type,b.cost,'build');")
replace('g.money-=cost;g.spent+=cost;', "financeProject(g,idx,tile.type,cost,'upgrade');")
replace('investment:{cost:-8,pop:-3,hype:2,debt:2,ai:0}', 'investment:{cost:0,pop:-3,hype:2,debt:2,ai:0},\n partnership:{cost:0,pop:-3,hype:0,debt:0,ai:0},\n greenfund:{cost:0,pop:0,hype:-4,debt:0,ai:0}')
function('administration', """function administration(g,key){
 if(g.phase!=='build'||!municipal[key]||g.adminUsed[key])return false;const r=financeRule(key),a=municipal[key];if(r&&!financeReady(g,key))return false;
 if(r){g.finance.capital.push({id:key,kind:key,turn:g.turn,amount:r.amount,used:0});g.private+=r.amount;if(key==='partnership')g.finance.share=true}
 else publicCharge(g,Math.max(0,a.cost),'admin');
 g.adminUsed[key]=true;apply(g,{money:-a.cost,pop:a.pop,hype:a.hype,debt:a.debt,ai:a.ai});finishAction(g,'admin',{key});return true;
}""")
replace("g.milestones.push({turn:g.turn,key,lost:g.lost,aiValue:g.aiValue,traffic:m.traffic});", "g.milestones.push({turn:g.turn,key,lost:g.lost,aiValue:g.aiValue,traffic:m.traffic});remember(g,{kind:'milestone',key});")
function('doSettle', """function doSettle(g){
 if(g.phase!=='settle')return false;const m=metrics(g),short=m.demand>m.supply,produced=short?Math.floor(m.ai/2):m.ai,share=investorShare(g,produced);
 g.lost+=8-m.airport;g.aiValue+=produced;apply(g,{money:m.airport+m.biz+Math.floor(produced/3)-share-4,ai:produced,pop:(short?-3:0)+(g.debt>=6?-2:0)});
 for(const q of g.queue.filter(q=>q.due===g.turn)){apply(g,q.effect);if(q.obligation)g.finance.obligations.find(o=>o.id===q.obligation).paid=true;remember(g,{kind:'consequence',card:q.card??null,option:q.option??null,sourceTurn:q.sourceTurn??null})}
 g.queue=g.queue.filter(q=>q.due>g.turn);let fee=0,penalty=0;if(g.money<0){fee=3;g.money-=fee;g.deficit++;g.distressTurns++;if(g.deficit>=2){penalty=3;apply(g,{pop:-3})}}else g.deficit=0;
 g.log.unshift({turn:g.turn,kind:'settlement',airport:m.airport,production:produced,fee,penalty});remember(g,{kind:'settlement',airport:m.airport,production:produced,share});milestone(g);g.log=g.log.slice(0,8);
 if(g.turn===12){g.finished=true;g.phase='done'}else{g.turn++;g.phase='policy'}return true;
}""")
replace("if(a==='loan'&&!game.loan&&!game.finished){game.loan=true;apply(game,{money:15,debt:2});game.queue.push({due:game.turn+1,effect:{money:-9}},{due:game.turn+2,effect:{money:-9}})}", "if(a==='loan')takeLoan(game);")
replace("game.revised=true;apply(game,{pop:-4,debt:-2})", "game.revised=true;apply(game,{pop:-4,debt:-2});remember(game,{kind:'revise'})")
replace("const admins=Object.entries(municipal).map(([k,a])=>", "const admins=Object.entries(municipal).map(([k,a])=>") # anchor verification
start = s.index('const admins=Object.entries(municipal).map(')
end = s.index('\n', start)
s=s[:start]+"const admins=Object.entries(municipal).map(([k,a])=>adminCard51(k,a)).join('');"+s[end:]
replace("[t.public,t.measurePublic+': '+game.spent+'; '+msg('private')+': '+game.private,v[2]]", "[t.public,ft('public')+': '+publicBurden()+'; '+ft('pending')+': '+pendingBurden()+(game.finance.legacy?' · '+ft('unknown'):''),v[2]]")
replace("${v041Badge('💰',V041_LABELS[lang].cost,'−'+b.cost,true)}", "${v041Badge('💰',V041_LABELS[lang].cost,b.cost,false)}${fundingChips(game,k,b.cost)}")
replace("${v041Badge('💰',V041_LABELS[lang].cost,'−'+Math.max(5,Math.ceil(builds[tile.type].cost*.6)),true)}", "${v041Badge('💰',V041_LABELS[lang].cost,Math.max(5,Math.ceil(builds[tile.type].cost*.6)),false)}${fundingChips(game,tile.type,Math.max(5,Math.ceil(builds[tile.type].cost*.6)))}")
replace('persist();if(game.finished)showEnd()}', 'renderV51();persist();if(game.finished)showEnd()}')
replace('${promiseAudit()}<p>${msg(\'endHelp\')}</p>', '${epilogue51()}${promiseAudit()}${financePanel51()}${storyPanel51()}<p>${msg(\'endHelp\')}</p>')
replace("${msg(p[2]?'yes':'no')}", "${game.finance.legacy?ft('unknown'):msg(p[2]?'yes':'no')}")
replace("publicCost:publicBurden()", "publicCost:publicBurden()") if 'publicCost:publicBurden()' in s else None
replace('power:m.supply-m.demand}}', 'power:m.supply-m.demand,private:game.private,publicCost:publicBurden()}}')
replace("changes=['money','pop','ai','hype','debt','traffic','power']", "changes=['money','pop','ai','hype','debt','traffic','power','private','publicCost']")
replace("drawV2();if(!game.finished&&game.turn===1&&game.phase==='policy')showIntro(notice);", "mountV51();drawV2();if(!game.finished&&game.turn===1&&game.phase==='policy')showIntro(notice);")
style=(root/'assets/v51.css').read_text(encoding='utf-8')
replace('</style>', '\n'+style+'\n</style>')
(root/'荒謬市長_v5.1.html').write_text(s,encoding='utf-8')
print('Built offline V5.1:',len(s.encode('utf-8')),'bytes')
