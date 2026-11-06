/* Presentation layer only. No new game rules or persisted fields. */
(()=>{
 'use strict';
 const T={
 zh:{title:'荒謬市長',city:'機場小城',round:'回合',policy:'政策',land:'地塊',admin:'行政',finance:'財政',goals:'政見',settings:'設定',settle:'結算',close:'回地圖',details:'完整說明',treasury:'市庫',private:'可用專款',pending:'待付現金',public:'公共負擔',unknown:'無法核實',due:'到期回合',empty:'目前沒有待付帳款',locked:'先完成本回合政策，再安排市政行動。',choose:'點地塊，安排城市的下一步',done:'任期完成',history:'完整紀錄',met:'達成',unmet:'未達',power:'供電',restart:'重新開始',read:'人物回應',effects:'詳細效果',from:'現在',to:'完成後',airport:'機場整體',income:'機場收入',capacity:'名目容量',build:'建設',upgrade:'升級'},
 en:{title:'Absurd Mayor',city:'Airport city',round:'Round',policy:'Policy',land:'Plots',admin:'City hall',finance:'Finance',goals:'Pledges',settings:'Settings',settle:'Settle',close:'Back to map',details:'Full explanation',treasury:'Treasury',private:'Available funds',pending:'Cash due',public:'Public burden',unknown:'Unverified',due:'Due round',empty:'No outstanding bills',locked:'Finish this round’s policy before taking a municipal action.',choose:'Pick a plot to shape the city',done:'Term complete',history:'Full record',met:'Met',unmet:'Unmet',power:'Power',restart:'Restart',read:'Character reactions',effects:'Detailed effects',from:'Now',to:'After',airport:'Airport total',income:'Airport income',capacity:'Nominal capacity',build:'Build',upgrade:'Upgrade'},
 fr:{title:'Maire absurde',city:'Ville aéroportuaire',round:'Tour',policy:'Politique',land:'Parcelles',admin:'Mairie',finance:'Finances',goals:'Promesses',settings:'Réglages',settle:'Bilan',close:'Retour à la carte',details:'Explication complète',treasury:'Trésorerie',private:'Fonds disponibles',pending:'Échéances à payer',public:'Charge publique',unknown:'Non vérifiable',due:'Tour d’échéance',empty:'Aucune facture en attente',locked:'Terminez la politique de ce tour avant une action municipale.',choose:'Choisissez une parcelle pour façonner la ville',done:'Mandat terminé',history:'Historique complet',met:'Tenue',unmet:'Non tenue',power:'Électricité',restart:'Recommencer',read:'Réactions des personnages',effects:'Effets détaillés',from:'Maintenant',to:'Après',airport:'Ensemble de l’aéroport',income:'Recettes aéroportuaires',capacity:'Capacité nominale',build:'Construire',upgrade:'Améliorer'},
 nl:{title:'Absurdistische burgemeester',city:'Luchthavenstad',round:'Ronde',policy:'Beleid',land:'Kavels',admin:'Stadhuis',finance:'Financiën',goals:'Beloften',settings:'Instellingen',settle:'Afronden',close:'Naar de kaart',details:'Volledige uitleg',treasury:'Stadskas',private:'Beschikbare fondsen',pending:'Nog te betalen',public:'Publieke lasten',unknown:'Niet verifieerbaar',due:'Vervalt in ronde',empty:'Geen openstaande rekeningen',locked:'Rond eerst het beleid van deze ronde af voor een gemeentelijke actie.',choose:'Kies een kavel en geef de stad vorm',done:'Ambtstermijn voltooid',history:'Volledig overzicht',met:'Behaald',unmet:'Niet behaald',power:'Stroom',restart:'Opnieuw beginnen',read:'Reacties van personages',effects:'Gedetailleerde effecten',from:'Nu',to:'Daarna',airport:'Luchthaven als geheel',income:'Luchthaveninkomsten',capacity:'Nominale capaciteit',build:'Bouwen',upgrade:'Uitbreiden'}
 };
 const tr=k=>T[lang][k],q=s=>document.querySelector(s),el=(tag,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;return e};
 const shell=q('.shell'),layout=q('.layout'),mapPanel=layout.firstElementChild,actionPanel=layout.lastElementChild;
 const ui={view:'action',open:false,last:null,previous:null},baseDraw=drawV2;
 const city=el('section','c60-city');city.id='c60-city';mapPanel.append(city);
 city.innerHTML='<div class="c60-caption"><strong></strong><span></span></div><svg class="c60-scene" viewBox="0 0 760 480" aria-hidden="true"></svg><div class="c60-plots"></div><div class="c60-selected"><span></span></div>';
 const dock=el('nav','c60-dock');dock.id='c60-dock';shell.append(dock);
 const sheet=el('section','c60-sheet');sheet.id='c60-sheet';sheet.hidden=true;sheet.setAttribute('aria-labelledby','c60-sheet-title');
 sheet.innerHTML='<header class="c60-sheet-head"><h2 id="c60-sheet-title" tabindex="-1"></h2><button type="button" class="c60-close" data-city-close></button></header><div class="c60-sheet-body"></div>';
 shell.append(sheet);const sheetBody=q('.c60-sheet-body');
 const hosts={action:actionPanel,finance:el('div'),goals:el('div'),settings:el('div'),locked:el('div')};
 const financeVisual=el('div'),goalVisual=el('div');hosts.finance.append(financeVisual,q('#v51-ledger-host'));hosts.goals.append(goalVisual,q('#v041-metrics'));
 const lower=q('.lower');[...lower.children].forEach(p=>{const detail=el('details','c60-full'),summary=el('summary');summary.dataset.cityHeading='history';detail.append(summary,p);hosts.goals.append(detail)});
 const storyDetail=el('details','c60-full'),storySummary=el('summary');storySummary.dataset.cityHeading='read';storyDetail.append(storySummary,q('#v51-reaction'),q('#v51-story-host'));hosts.goals.append(storyDetail);
 const news=el('details','c60-full'),newsSummary=el('summary');newsSummary.dataset.cityHeading='history';news.append(newsSummary,q('.news'),q('#v04-timeline'));hosts.goals.append(news);
 const music=q('.v5-audio-bar');if(music)hosts.settings.append(music);
 const settingsButtons=el('div');hosts.settings.append(settingsButtons);
 const feedback=q('#v042-feedback');sheet.before(feedback);feedback.style.cssText='position:relative;margin:8px 0 0';
 Object.entries(hosts).forEach(([key,host])=>{host.dataset.cityHost=key;host.hidden=true;sheetBody.append(host)});
 document.body.classList.add('city060');

 // A single continuous isometric city. Accessible native plot buttons sit over it.
 const P=(x,y,z=0)=>[380+(x-y)*.866,92+(x+y)*.5-z];
 const points=a=>a.map(p=>P(...p).map(v=>v.toFixed(1)).join(',')).join(' ');
 const poly=(a,fill,attrs='')=>'<polygon points="'+points(a)+'" fill="'+fill+'" '+attrs+'/>';
 function box(x,y,z,w,d,h,roof='#a8c8c7',front='#e3d9b7',side='#91ad99'){
  return poly([[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]],side)+poly([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]],front)+poly([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],roof);
 }
 function tree(x,y,h=31){const b=P(x,y,1),t=P(x,y,h);return '<path d="M'+b+'L'+t+'" stroke="#8c9f7b" stroke-width="4"/><ellipse cx="'+t[0]+'" cy="'+t[1]+'" rx="11" ry="15" fill="#7b9f76"/><ellipse cx="'+(t[0]-4)+'" cy="'+(t[1]-4)+'" rx="8" ry="12" fill="#b5cb8a"/>'}
 function building(x,y,w,d,floors,m,type){let out=poly([[x+10,y+10,0],[x+w+22,y+10,0],[x+w+22,y+d+13,0],[x+10,y+d+13,0]],'#294b3524');
  for(let f=0;f<floors;f++){const z=f*17;out+=box(x,y,z,w,d,17);for(let j=0;j<4;j++){const glass=m.demand>m.supply&&builds[type]?.ai>0?'#64776a':'#5896a0';out+=poly([[x+7+j*(w-9)/4,y+d+.3,z+5],[x+13+j*(w-9)/4,y+d+.3,z+5],[x+13+j*(w-9)/4,y+d+.3,z+12],[x+7+j*(w-9)/4,y+d+.3,z+12]],glass);out+=poly([[x+w+.3,y+7+j*(d-9)/4,z+5],[x+w+.3,y+13+j*(d-9)/4,z+5],[x+w+.3,y+13+j*(d-9)/4,z+12],[x+w+.3,y+7+j*(d-9)/4,z+12]],glass)}}
  out+=box(x-3,y-3,floors*17,w+6,d+6,4);out+=box(x+9,y+10,floors*17+4,w*.38,d*.27,8,'#91b1a6');out+=box(x+w*.62,y+7,floors*17+4,w*.21,d*.5,2,'#417e90');return out;
 }
 function renderMap(){const m=metrics();let svg=poly([[-27,-27,-9],[357,-27,-9],[357,357,-9],[-27,357,-9]],'#8ba393')+poly([[-27,-27,0],[357,-27,0],[357,357,0],[-27,357,0]],'#80988b');
  for(let r=0;r<3;r++)for(let c=0;c<3;c++){const x=c*110,y=r*110;svg+=poly([[x,y,1],[x+98,y,1],[x+98,y+98,1],[x,y+98,1]],'#bfd09e')}
  for(const n of [104,214]){svg+=poly([[-17,n,1],[347,n,1],[347,n+2,1],[-17,n+2,1]],'#e4dfbf')+poly([[n,-17,1],[n+2,-17,1],[n+2,347,1],[n,347,1]],'#e4dfbf')}
  for(const [c,r] of [[0,0],[1,0],[0,1],[2,0],[1,1],[0,2],[2,1],[1,2],[2,2]]){
   const i=r*3+c,t=game.tiles[i],x=c*110+17,y=r*110+17,up=(t.level||1)===2;
   const type=t.type==='original'?['terminal','runway','tower','cargo','hangar','substation','forest','housing','birds'][i]:t.type;
   svg+='<g data-city-building="'+i+'" data-city-type="'+type+'" data-city-level="'+(t.level||1)+'">';
   if(type==='runway'){svg+=poly([[x-7,y-10,2],[x+72,y-10,2],[x+72,y+75,2],[x-7,y+75,2]],'#6e8a80');for(let a=0;a<5;a++)svg+=poly([[x+28,y-4+a*16,3],[x+32,y-4+a*16,3],[x+32,y+5+a*16,3],[x+28,y+5+a*16,3]],'#f7f2d7')}
   else if(['forest','birds','park'].includes(type)){for(const [a,b,h] of [[10,10,31],[44,12,36],[65,37,27],[15,56,30],[58,65,32]])svg+=tree(x+a,y+b,h+(up?9:0));svg+=poly([[x-8,y+34,2],[x+76,y+34,2],[x+76,y+40,2],[x-8,y+40,2]],'#e2d6b5');if(type!=='forest'){svg+=box(x+39,y+39,1,20,4,8,'#d8b47e');const p=P(x+12,y+49,14);svg+='<ellipse cx="'+p[0]+'" cy="'+p[1]+'" rx="5" ry="3" fill="#e7e6cf"/>'}}
   else if(['substation','power'].includes(type)){for(let a=0;a<(up?4:3);a++){svg+=box(x+a*19,y+10,1,12,47,19,'#a8c4b0');svg+=box(x+3+a*19,y+19,20,6,27,9,'#d1d5bd')}svg+=box(x+3,y+65,0,59,8,7,'#829d8b')}
   else if(type==='tower'){svg+=building(x+5,y+5,27,27,4,m,type);svg+=box(x-3,y-3,68,44,44,16,'#a5c7c6','#5a9296','#487e83')}
   else if(type==='market'){svg+=building(x,y,68,56,up?3:1,m,type);for(let a=0;a<4;a++)svg+=box(x+a*17,y+57,1,16,17,15,a%2?'#e1c68b':'#6b9995')}
   else if(type==='show'){svg+=building(x,y,up?79:67,up?72:60,up?2:1,m,type);svg+=box(x+15,y+61,1,42,12,17,'#e2b981')}
   else if(type==='housing'){svg+=building(x,y,33,35,2,m,type)+building(x+43,y+30,30,39,2,m,type);svg+=tree(x+14,y+72,20)}
   else svg+=building(x,y,type==='data'?72:68,type==='hangar'?70:57,type==='lab'?(up?7:2):type==='data'?(up?6:3):up?3:type==='terminal'?2:1,m,type);
   svg+='</g>';
  }
  if(game.selected!==null){const x=game.selected%3*110,y=Math.floor(game.selected/3)*110;svg+=poly([[x+1,y+1,3],[x+97,y+1,3],[x+97,y+97,3],[x+1,y+97,3]],'none','stroke="#efd18a" stroke-width="4"')}
  svg+=box(104,72,2,8,18,7,'#f1d3a0')+box(169,214,2,17,8,6,'#a2c4bf');
  q('.c60-scene').innerHTML=svg;
  const plotHost=q('.c60-plots');plotHost.innerHTML=game.tiles.map((tile,i)=>{const p=P(i%3*110+49,Math.floor(i/3)*110+49,16);const label=loc(tile.name)+(tile.type==='original'?'':' · '+am('level')+' '+(tile.level||1));return '<button type="button" class="c60-plot" data-v2="tile" data-index="'+i+'" style="--x:'+p[0]/760*100+'%;--y:'+p[1]/480*100+'%" aria-label="'+esc(label)+'" aria-pressed="'+(game.selected===i)+'"><span class="c60-plot-label" aria-hidden="true">'+esc(label)+'</span></button>'}).join('');
  // SVG uses meet scaling; match the native target layer to its rendered rectangle.
  const fit=()=>{const w=city.clientWidth,h=ui.open&&!sheet.hidden?Math.max(150,sheet.getBoundingClientRect().top-city.getBoundingClientRect().top-6):city.clientHeight,s=Math.min(w/760,h/480);q('.c60-scene').style.height=h+'px';plotHost.style.cssText='width:'+760*s+'px;height:'+480*s+'px;left:'+(w-760*s)/2+'px;top:'+(h-480*s)/2+'px'};fit();cityFit=fit;
  q('.c60-caption strong').textContent=tr('city');q('.c60-caption>span').textContent=tr('round')+' '+game.turn+' / 12';
  q('.c60-selected span').textContent=(game.selected!==null?loc(game.tiles[game.selected].name)+' · ':'')+V042[lang][m.traffic===0?'ground':'open']+' · '+V042[lang][m.demand>m.supply?'short':'power'];
 }
 let cityFit=()=>{};new ResizeObserver(()=>cityFit()).observe(city);
 function comic(prop,type=''){return '<div class="c60-comic '+type+'" aria-hidden="true"><span class="person"><span class="shirt"></span><span class="face"></span><span class="hair"></span></span><span class="prop">'+prop+'</span></div>'}
 function fullText(parent,nodes,label){if(!nodes.length)return;const d=el('details','c60-full'),s=el('summary');s.textContent=label;d.append(s,...nodes);parent.append(d)}
 function decorateAction(){const action=q('#action');
  if(game.phase==='policy'){
   const event=action.querySelector('.event'),p=event?.querySelector('p');event?.classList.add('c60-policy-event');if(p)fullText(event,[p],tr('details'));
   const options=action.querySelectorAll('[data-v2="policy"]'),cardIndex=game.order[game.turn-1];action.querySelector('.choices')?.classList.add('c60-policy-choices');
   const props=[['🚧','🤝','🎖️'],['🔌','🤝','🖊️'],['📦','🔮','🎤'],['💡','🖌️','📅'],['📚','🎟️','📑'],['🍜','💡','🚫'],['💰','📋','🎤'],['📚','🏷️','⏰'],['📦','💸','📚'],['🌳','🎖️','🧳'],['🏗️','🎬','🍱'],['💸','🖊️','🔌'],['🔬','🏆','💻'],['🖼️','📺','📷'],['📑','🎤','🔮']][cardIndex];
   options.forEach((button,i)=>{button.insertAdjacentHTML('afterbegin',comic(props[i],i===2?'delay':i===0?'train':''));const option=cards[cardIndex][2][i],due=[...button.querySelectorAll('.v04-effect.later')].find(e=>e.textContent.includes('⏱'));if(due&&option[3])due.textContent='📅 '+tr('due')+' '+(game.turn+option[3][0]);const duplicate=button.querySelector('.v04-choice-detail');if(duplicate)duplicate.remove()});
  }
  action.querySelectorAll('[data-v2="build"],[data-v2="upgrade"],[data-v2="admin"]').forEach(button=>{
   if(button.dataset.v2==='admin')button.insertAdjacentHTML('afterbegin',comic(['investment','partnership','greenfund'].includes(button.dataset.type)?'💼':button.dataset.type==='consult'?'💬':'🔎'));
   else{const type=button.dataset.type||game.tiles[game.selected]?.type;if(builds[type])button.insertAdjacentHTML('afterbegin','<span class="c60-thumb" aria-hidden="true">'+v042Art(type,button.dataset.v2==='upgrade'?2:1,false,false)+'</span>')}
  });
  // Keep real airport-wide comparisons together, never on individual plots.
  if(game.phase==='build'&&actionView==='land'&&game.selected!==null){const tile=game.tiles[game.selected],event=action.querySelector('.event');
   if(event){const paragraphs=[...event.querySelectorAll(':scope > p')];fullText(event,paragraphs,tr('details'));
    if(tile.type==='original'){const m=metrics();event.insertAdjacentHTML('beforeend','<p class="c60-airport-total">'+esc(tr('airport')+' · '+tr('capacity')+' '+m.nominal+'/80 · '+tr('income')+' '+m.airport)+'</p>')}
   }
  }
  if(game.phase==='settle'){const p=action.querySelector('.event p');if(p){const parent=p.parentElement;fullText(parent,[p],tr('details'))}}
 }
 function renderFinance(){const f=game.finance,available=f.capital.reduce((n,c)=>n+c.amount-c.used,0);financeVisual.innerHTML='<div class="c60-funds">'+[[tr('treasury'),game.money],[tr('private'),available],[tr('pending'),pendingBurden()]].map(([name,value])=>'<div class="c60-fund"><div class="c60-purse" aria-hidden="true">'+value+'</div><span>'+esc(name)+'</span><span class="v5-sr-only">'+value+'</span></div>').join('')+'</div><p>'+esc(tr('public')+': '+(f.legacy?tr('unknown')+' · ':'')+publicBurden())+'</p>';
  const due=f.obligations.filter(o=>!o.paid).sort((a,b)=>a.due-b.due);financeVisual.insertAdjacentHTML('beforeend',due.length?'<ol class="c60-timeline">'+due.map(o=>'<li>📅 '+esc(tr('due')+' '+o.due)+'<br><strong>'+o.amount+'</strong></li>').join('')+'</ol>':'<p class="hint">'+esc(tr('empty'))+'</p>');
 }
 function renderGoals(){const m=metrics(),p=promises(),labels=[msg('promise1'),msg('promise2'),msg('promise3')],values=[game.ai+'/50',m.parks+'/2',publicBurden()];goalVisual.innerHTML='<div class="c60-goals">'+labels.map((label,i)=>'<div class="c60-goal"><strong aria-hidden="true">'+['🧠','🌳','🏛️'][i]+'</strong><div><p>'+esc(label)+'</p><b>'+values[i]+(i===1?' · '+tr('power')+' '+m.supply+'/'+m.demand:'')+'</b></div><span class="stamp">'+esc(i===2&&game.finance.legacy?tr('unknown'):tr(p[i]?'met':'unmet'))+'</span></div>').join('')+'</div>'}
 function closeSheet(restore=true){ui.open=false;sheet.hidden=true;cityFit();dock.querySelectorAll('button').forEach(b=>b.setAttribute('aria-expanded','false'));if(restore)(dock.querySelector('[data-city-view="'+ui.view+'"]')||dock.firstElementChild)?.focus({preventScroll:true})}
 function showSheet(view,trigger,focus=true){ui.open=true;ui.view=view;ui.last=trigger||dock.querySelector('[data-city-view="'+view+'"]');renderSheet();if(focus)q('#c60-sheet-title').focus({preventScroll:true})}
 function renderSheet(){sheet.hidden=!ui.open;if(!ui.open)return;Object.values(hosts).forEach(host=>host.hidden=true);let host=ui.view;
  const title=ui.view==='action'?tr(game.phase==='policy'?'policy':game.phase==='settle'?'settle':'land'):tr(ui.view==='admin'?'admin':ui.view);
  if(ui.view==='admin'||ui.view==='land'){if(game.phase==='build')host='action';else{host='locked';const next=game.phase==='policy'?'policy':'settle';hosts.locked.innerHTML='<p>'+esc(game.phase==='policy'?tr('locked'):msg('settle'))+'</p><button type="button" class="primary" data-city-view="action">'+esc(tr(next))+'</button>'}}
  if(!hosts[host])host='action';hosts[host].hidden=false;q('#c60-sheet-title').textContent=title;q('[data-city-close]').textContent=tr('close');
  dock.querySelectorAll('button').forEach(b=>b.setAttribute('aria-expanded',String(b.dataset.cityView===ui.view)));sheet.scrollTop=0;cityFit();
 }
 function renderChrome(){q('h1').textContent=tr('title')+' · V0.6.0';const next=game.phase==='settle'?'settle':game.phase==='policy'?'policy':'land';
  const short={zh:{settings:'設定',goals:'政見'},en:{settings:'Options',goals:'Pledges'},fr:{settings:'Options',goals:'Objectifs'},nl:{settings:'Opties',goals:'Beloften'}}[lang];
  dock.setAttribute('aria-label',tr('city'));dock.innerHTML=[['action',game.finished?'done':next,'▶'],['land','land','🏗️'],['admin','admin','🏛️'],['finance','finance','💰'],['goals','goals','🎯'],['settings','settings','⚙️']].map(([view,label,icon],i)=>'<button type="button" data-city-view="'+view+'" aria-controls="c60-sheet" aria-expanded="false" aria-label="'+esc((short[label]?short[label]+' · ':'')+tr(label))+'"'+(i===0?' class="c60-next"':'')+'><span aria-hidden="true">'+icon+'</span><span>'+esc(short[label]||tr(label))+'</span></button>').join('');
  q('#c60-city').setAttribute('aria-label',tr('city'));q('.c60-plots').setAttribute('aria-label',tr('land'));q('.c60-plots').setAttribute('role','group');
  document.querySelectorAll('[data-city-heading]').forEach(e=>e.textContent=tr(e.dataset.cityHeading));settingsButtons.innerHTML='<button type="button" class="choice" data-v2="restart">'+esc(tr('restart'))+'</button>';
  if(game.finished)closeSheet(false);else renderSheet();
 }
 drawV2=function(){const focus=document.activeElement,plot=focus?.classList.contains('c60-plot')?focus.dataset.index:null;baseDraw();decorateAction();renderMap();renderFinance();renderGoals();renderChrome();const pending=ui.focus;ui.focus=null;if(!q('#modal [role="dialog"]')){const target=pending==='sheet'?q('#c60-sheet-title'):pending==='next'?dock.querySelector('[data-city-view="action"]'):pending?.startsWith('tab:')?q('#action [data-tab="'+pending.slice(4)+'"]'):plot!==null&&!ui.open?q('.c60-plot[data-index="'+plot+'"]'):null;target?.focus({preventScroll:true})}};
 document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.matches('[data-city-close]')){closeSheet();return}
  if(b.dataset.cityView){const view=b.dataset.cityView;if(ui.open&&ui.view===view){closeSheet();return}if(game.finished){showEnd();return}if((view==='admin'||view==='land')&&game.phase==='build'){actionView=view==='admin'?'admin':'land';drawV2()}showSheet(view,b);return}
  if(b.dataset.v2==='close')dock.querySelector('[data-city-view="action"]')?.focus({preventScroll:true});
  if(b.dataset.v2==='tile'&&game.phase!=='build'){const index=Number(b.dataset.index);q('.c60-selected span').textContent=loc(game.tiles[index].name)+' · '+(game.phase==='policy'?tr('locked'):tr('settle'));}
 });
 document.addEventListener('click',e=>{const b=e.target.closest('[data-v2]');if(!b)return;const a=b.dataset.v2;
  if(a==='tile'&&game.phase==='build'){ui.open=true;ui.view='land';ui.focus='sheet'}
  else if(a==='action-tab')ui.focus='tab:'+b.dataset.tab;
  else if(['policy','build','upgrade','admin','defer','settle'].includes(a)){ui.open=false;ui.focus='next'}
 },true);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&ui.open&&!q('#modal [role="dialog"]')){e.preventDefault();closeSheet()}});
 drawV2();
})();
