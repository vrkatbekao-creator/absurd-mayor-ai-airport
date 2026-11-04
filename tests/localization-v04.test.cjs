'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','荒謬市長_v0.4.html'),'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(x=>x[1]);
assert.equal(scripts.length,2);
const old=scripts[0].indexOf("document.addEventListener('click',");
const next=scripts[1].indexOf("document.addEventListener('click',e=>{let b=e.target.closest('[data-v2]')");
assert.ok(old>=0&&next>=0);
function load(){
  const ctx=vm.createContext({localStorage:{getItem:()=>null,setItem:()=>{}},console});
  vm.runInContext(scripts[0].slice(0,old),ctx);
  vm.runInContext(scripts[1].slice(0,next),ctx);
  const api=vm.runInContext('({M,A,UX,initialTiles,builds,dictionaries,cards,endInfo,newGame,metrics,administration,previewMunicipal})',ctx);
  return {ctx,api};
}
const {api}=load(),langs=['zh','en','fr','nl'];
test('M, municipal UI, and v0.3 messaging cover each language',()=>{
  for(const [key,vals] of Object.entries(api.M))for(const lang of langs){
    assert.equal(typeof vals[lang],'string',lang+' missing M.'+key);
    assert.ok(vals[lang].trim(),lang+' empty M.'+key);
  }
  const keys=Object.keys(api.UX.zh);
  for(const lang of langs){
    assert.deepEqual(Object.keys(api.UX[lang]).sort(),keys.slice().sort(),'UX keys mismatched: '+lang);
    for(const [k,v] of Object.entries(api.UX[lang])){
      if(Array.isArray(v)){assert.equal(v.length,3);v.forEach(x=>assert.ok(x.trim()))}
      else assert.equal(typeof v,'string',lang+'.'+k);
    }
    assert.deepEqual(Object.keys(api.A[lang]).sort(),Object.keys(api.A.zh).sort());
  }
});
test('four-language instructions describe civic actions, not mandatory rebuilding',()=>{
  for(const lang of langs)assert.doesNotMatch(api.M.phaseIntro[lang],/maintain one plot|onderhouden|ou entretien|維護一地塊/i);
  assert.match(api.M.phaseIntro.en,/Twelve turns/i);
  assert.match(api.M.phaseIntro.nl,/Twaalf rondes/i);
});
test('all land/building/event/end names are translated in fr/nl/en',()=>{
  const values=[...api.initialTiles.map(x=>x[1]),...Object.values(api.builds).map(x=>x.name),
    ...api.cards.flatMap(c=>[c[0],c[1],...c[2].map(o=>o[0])]),
    ...Object.values(api.endInfo).flatMap(x=>x)];
  for(const lang of ['en','fr','nl'])for(const value of values)
    assert.ok(api.dictionaries[lang][value]?.trim(),lang+' missing: '+value);
});
test('signed financing and treasury captions exist',()=>{
  for(const lang of langs)assert.ok(api.UX[lang].treasury?.trim(),lang+' missing treasury caption');
  const g=api.newGame();g.phase='build';
  assert.equal(api.administration(g,'investment'),true);
  assert.equal(g.money,73);assert.equal(g.private,8);
});
test('forecast reports realized AI production when energy is insufficient',()=>{
  const {ctx}=load(),state=vm.runInContext('({g:newGame()})',ctx),g=state.g;
  for(const i of [6,7])g.tiles[i]={icon:'🖥️',name:'資料中心',type:'data',traffic:0,level:1};
  const result=vm.runInContext('previewMunicipal('+JSON.stringify(g)+",8,'data',false)",ctx);
  // Existing production 12 at demand 8; adding data increases demand to 12,
  // actual output falls from 12 to floor(18/2)=9.
  assert.match(result,/12→9/);
});
