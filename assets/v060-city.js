/* Presentation layer only. No new game rules or persisted fields. */
(()=>{
 'use strict';
 const T={
 zh:{title:'荒謬市長',city:'機場小城',round:'回合',policy:'政策',land:'地塊',admin:'行政',finance:'財政',goals:'政見',settings:'設定',settle:'結算',close:'回地圖',details:'完整說明',treasury:'市庫',private:'可用專款',pending:'待付現金',public:'公共負擔',unknown:'無法核實',due:'到期回合',empty:'目前沒有待付帳款',locked:'先完成本回合政策，再安排市政行動。',choose:'點地塊，安排城市的下一步',done:'任期完成',history:'完整紀錄',met:'達成',unmet:'未達',power:'供電',restart:'重新開始',read:'人物回應',effects:'詳細效果',from:'現在',to:'完成後',airport:'機場整體',income:'機場收入',capacity:'名目容量',build:'建設',upgrade:'升級'},
 en:{title:'Absurd Mayor',city:'Airport city',round:'Round',policy:'Policy',land:'Plots',admin:'City hall',finance:'Finance',goals:'Pledges',settings:'Settings',settle:'Settle',close:'Back to map',details:'Full explanation',treasury:'Treasury',private:'Available funds',pending:'Cash due',public:'Public burden',unknown:'Unverified',due:'Due round',empty:'No outstanding bills',locked:'Finish this round’s policy before taking a municipal action.',choose:'Pick a plot to shape the city',done:'Term complete',history:'Full record',met:'Met',unmet:'Unmet',power:'Power',restart:'Restart',read:'Character reactions',effects:'Detailed effects',from:'Now',to:'After',airport:'Airport total',income:'Airport income',capacity:'Nominal capacity',build:'Build',upgrade:'Upgrade'},
 fr:{title:'Maire absurde',city:'Ville aéroportuaire',round:'Tour',policy:'Politique',land:'Parcelles',admin:'Mairie',finance:'Finances',goals:'Promesses',settings:'Réglages',settle:'Bilan',close:'Retour à la carte',details:'Explication complète',treasury:'Trésorerie',private:'Fonds disponibles',pending:'Échéances à payer',public:'Charge publique',unknown:'Non vérifiable',due:'Tour d’échéance',empty:'Aucune facture en attente',locked:'Terminez la politique de ce tour avant une action municipale.',choose:'Choisissez une parcelle pour façonner la ville',done:'Mandat terminé',history:'Historique complet',met:'Tenue',unmet:'Non tenue',power:'Électricité',restart:'Recommencer',read:'Réactions des personnages',effects:'Effets détaillés',from:'Maintenant',to:'Après',airport:'Ensemble de l’aéroport',income:'Recettes aéroportuaires',capacity:'Capacité nominale',build:'Construire',upgrade:'Améliorer'},
 nl:{title:'Absurdistische burgemeester',city:'Luchthavenstad',round:'Ronde',policy:'Beleid',land:'Kavels',admin:'Stadhuis',finance:'Financiën',goals:'Beloften',settings:'Instellingen',settle:'Afronden',close:'Naar de kaart',details:'Volledige uitleg',treasury:'Stadskas',private:'Beschikbare fondsen',pending:'Nog te betalen',public:'Publieke lasten',unknown:'Niet verifieerbaar',due:'Vervalt in ronde',empty:'Geen openstaande rekeningen',locked:'Rond eerst het beleid van deze ronde af voor een gemeentelijke actie.',choose:'Kies een kavel en geef de stad vorm',done:'Ambtstermijn voltooid',history:'Volledig overzicht',met:'Behaald',unmet:'Niet behaald',power:'Stroom',restart:'Opnieuw beginnen',read:'Reacties van personages',effects:'Gedetailleerde effecten',from:'Nu',to:'Daarna',airport:'Luchthaven als geheel',income:'Luchthaveninkomsten',capacity:'Nominale capaciteit',build:'Bouwen',upgrade:'Uitbreiden'}
 };
 const S2={
  zh:{slogan:'AI 起飛，飛機停飛！',foundation:'地基',frame:'施工骨架',floors:'逐層成長',roof:'屋頂與設備',finish:'建設完成',skip:'略過動畫',replay:'重看成長',start:'施工動畫開始，可略過；建設已生效。',complete:'建設完成。',growth:'建築成長'},
  en:{slogan:'AI takes off, planes grounded!',foundation:'Foundations',frame:'Structural frame',floors:'Rising floors',roof:'Roof and equipment',finish:'Construction complete',skip:'Skip animation',replay:'Replay growth',start:'Construction animation started. You can skip it; the project already takes effect.',complete:'Construction complete.',growth:'Building growth'},
  fr:{slogan:'L’IA décolle, les avions restent au sol !',foundation:'Fondations',frame:'Ossature',floors:'Les étages montent',roof:'Toit et équipements',finish:'Construction terminée',skip:'Passer l’animation',replay:'Revoir la croissance',start:'Animation de construction lancée. Vous pouvez la passer ; le projet est déjà effectif.',complete:'Construction terminée.',growth:'Croissance du bâtiment'},
  nl:{slogan:'AI stijgt op, vliegtuigen blijven aan de grond!',foundation:'Fundering',frame:'Draagconstructie',floors:'Verdiepingen groeien',roof:'Dak en installaties',finish:'Bouw voltooid',skip:'Animatie overslaan',replay:'Groei opnieuw bekijken',start:'De bouwanimatie is gestart. U kunt deze overslaan; het project is al van kracht.',complete:'Bouw voltooid.',growth:'Gebouwgroei'}
 };
 const st=k=>S2[lang][k];
 const tr=k=>T[lang][k],q=s=>document.querySelector(s),el=(tag,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;return e};
 const shell=q('.shell'),layout=q('.layout'),mapPanel=layout.firstElementChild,actionPanel=layout.lastElementChild;
 const ui={view:'action',open:false,last:null,previous:null},baseDraw=drawV2;
 const growth={current:null,last:null,raf:0,gameRef:game,lastPaint:0};
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const slogan=el('p','c60-slogan');q('.top').after(slogan);
 const city=el('section','c60-city');city.id='c60-city';mapPanel.append(city);
 city.innerHTML='<div class="c60-caption"><strong></strong><span></span></div><svg class="c60-scene" viewBox="0 0 760 480" aria-hidden="true"></svg><div class="c60-plots"></div><div class="c60-selected"><span></span></div>';
 const growthBar=el('div','c60-growth');growthBar.hidden=true;
 growthBar.innerHTML='<div><strong class="c60-growth-label"></strong><ol class="c60-growth-steps" aria-hidden="true"><li>▱</li><li>⌂</li><li>▤</li><li>✦</li></ol></div><button type="button" data-growth-control></button>';
 city.append(growthBar);
 const growthStatus=el('span','v5-sr-only');growthStatus.setAttribute('role','status');growthStatus.setAttribute('aria-live','polite');growthStatus.setAttribute('aria-atomic','true');city.after(growthStatus);
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
 function tree(x,y,h=31,size=1){const b=P(x,y,1),t=P(x,y,h);return '<path d="M'+b+'L'+t+'" stroke="#8c9f7b" stroke-width="4"/><ellipse cx="'+t[0]+'" cy="'+t[1]+'" rx="'+11*size+'" ry="'+15*size+'" fill="#7b9f76"/><ellipse cx="'+(t[0]-4*size)+'" cy="'+(t[1]-4*size)+'" rx="'+8*size+'" ry="'+12*size+'" fill="#b5cb8a"/>'}
 function building(x,y,w,d,floors,m,type,options={}){let out=poly([[x+10,y+10,0],[x+w+22,y+10,0],[x+w+22,y+d+13,0],[x+10,y+d+13,0]],'#294b3524');
  for(let f=0;f<Math.ceil(floors);f++){const z=f*17,h=Math.min(1,floors-f)*17;out+='<g data-floor="'+(f+1)+'">'+box(x,y,z,w,d,h,...(palette4[type]||palette4.terminal));out+=poly([[x,y+d+.5,z+1],[x+w,y+d+.5,z+1],[x+w,y+d+.5,z+2],[x,y+d+.5,z+2]],'#ffffff55');const top=Math.min(12,h-2);if(top>5)for(let j=0;j<4;j++){const glass=m.demand>m.supply&&builds[type]?.ai>0?'#64776a':options.unlit&&f>=(options.litFloors||0)?'#a7b8a3':'#5896a0';out+=poly([[x+7+j*(w-9)/4,y+d+.3,z+5],[x+13+j*(w-9)/4,y+d+.3,z+5],[x+13+j*(w-9)/4,y+d+.3,z+top],[x+7+j*(w-9)/4,y+d+.3,z+top]],glass);out+=poly([[x+w+.3,y+7+j*(d-9)/4,z+5],[x+w+.3,y+13+j*(d-9)/4,z+5],[x+w+.3,y+13+j*(d-9)/4,z+top],[x+w+.3,y+7+j*(d-9)/4,z+top]],glass)}out+='</g>'}
  if(options.roof!==false){const z=floors*17+(options.lift||0);out+='<g data-growth-roof opacity="'+(options.opacity??1)+'">'+box(x-3,y-3,z,w+6,d+6,4)+box(x+9,y+10,z+4,w*.38,d*.27,8,'#91b1a6')+box(x+w*.62,y+7,z+4,w*.21,d*.5,2,'#417e90')+'</g>'}return out+architecture4(type,x,y,w,d,floors,options.roof!==false);
 }
 /* V060_FACILITIES */
 /* V060_ART */
 const stageFor=p=>p<.16?'foundation':p<.38?'frame':p<.79?'floors':p<.93?'roof':'finish';
 const clamp=p=>Math.max(0,Math.min(1,p)),ease=p=>1-Math.pow(1-clamp(p),2);
 function construction(x,y,baseFloors,targetFloors,p){const a=P(x+87,y+4,0),b=P(x+87,y+4,targetFloors*17+38),c=P(x-16,y+4,targetFloors*17+38),tail=P(x+107,y+4,targetFloors*17+38),hook=P(x+15+Math.sin(p*Math.PI)*22,y+4,Math.max(baseFloors*17+15,targetFloors*17*(.4+p*.4)));
  let out='<g data-growth-crane opacity="'+(p>.93?1-(p-.93)/.07:1)+'"><path d="M'+a+'L'+b+'L'+c+'M'+b+'L'+tail+'M'+c+'L'+P(x+87,y+4,targetFloors*17+56)+'L'+tail+'" fill="none" stroke="#d39b48" stroke-width="3.5" stroke-linejoin="round"/><path d="M'+P(x+15+Math.sin(p*Math.PI)*22,y+4,targetFloors*17+38)+'L'+hook+'" fill="none" stroke="#586e59" stroke-width="1.5"/>';
  out+=box(x+101,y, targetFloors*17+32,11,9,9,'#647f6e')+'</g>';
  // The fence and cross-braced frame are physical construction details, not icons.
  out+='<g data-growth-fence>';for(let n=0;n<7;n++)out+=box(x-9+n*14,y+78,0,10,2,11,n%2?'#e3c482':'#e8dcbc');out+='</g>';
  const z=baseFloors*17,top=Math.min(targetFloors*17,z+35+(p>.38?20:0));
  if(p>=.16&&p<.79){out+='<g data-growth-frame fill="none" stroke="#b5894e" stroke-width="2">';for(const [dx,dy] of [[0,0],[68,0],[68,57],[0,57]]){const a=P(x+dx,y+dy,z),b=P(x+dx,y+dy,top);out+='<path d="M'+a+'L'+b+'"/>'}out+='<polygon points="'+points([[x,y,top],[x+68,y,top],[x+68,y+57,top],[x,y+57,top]])+'"/><path d="M'+P(x,y+57,z)+'L'+P(x+68,y+57,top)+'M'+P(x+68,y+57,z)+'L'+P(x,y+57,top)+'"/></g>'}return out;
 }
 function paintGrowth(){const a=growth.current||growth.last;if(!a)return;const target=q('.c60-scene [data-city-building="'+a.index+'"]');if(!target)return;const m=metrics(),x=a.index%3*110+17,y=Math.floor(a.index/3)*110+17,p=growth.current?a.progress:1;
  target.innerHTML=facilityGeometry(a.type,a.toLevel,x,y,m,growth.current?a:null);const t=p<.38?0:ease((p-.38)/.41);target.dataset.drawnFloors=(a.from+(a.to-a.from)*t).toFixed(2);city.dataset.growthPhase=growth.current?stageFor(p):'complete';updateGrowthBar();cityFit();renderRecap();syncLife();cameraLabels4();
 }
 function updateGrowthBar(){const a=growth.current||growth.last;growthBar.hidden=!a||ui.open;if(!a)return;growthBar.setAttribute('role','group');growthBar.setAttribute('aria-label',st('growth'));const phase=growth.current?stageFor(a.progress):'finish',text=loc(game.tiles[a.index].name)+' · '+growthPhaseLabel(a.type,phase);if(q('.c60-growth-label').textContent!==text)q('.c60-growth-label').textContent=text;const button=growthBar.querySelector('button');if(button.textContent!==st(growth.current?'skip':'replay'))button.textContent=st(growth.current?'skip':'replay');growthBar.querySelectorAll('li').forEach((e,i)=>{e.classList.toggle('active',i<=({foundation:0,frame:1,floors:2,roof:3,finish:3})[phase])});q('.c60-selected').hidden=!growthBar.hidden;
 }
 function finishGrowth(announce=true){cancelAnimationFrame(growth.raf);growth.raf=0;if(!growth.current)return;growth.last={...growth.current,progress:1};growth.current=null;paintGrowth();growthStatus.lang=lang==='zh'?'zh-Hant':lang;growthStatus.textContent=announce?loc(game.tiles[growth.last.index].name)+' · '+st('complete'):''}
 function clearGrowth(){cancelAnimationFrame(growth.raf);growth.raf=0;growth.current=null;growth.last=null;growthBar.hidden=true;delete city.dataset.growthPhase;q('.c60-selected').hidden=false;growthStatus.textContent=''}
 function startGrowth(a){cancelAnimationFrame(growth.raf);const type=game.tiles[a.index].type,fromLevel=a.from==='original'?0:a.level,toLevel=game.tiles[a.index].level||1,from=facilityProfile(type,fromLevel).floors,to=facilityProfile(type,toLevel).floors;growth.last=null;growth.current={index:a.index,type,fromLevel,toLevel,from,to,turn:game.turn,progress:0,started:performance.now(),duration:fromLevel?(['lab','data'].includes(type)?3400:2800):type==='park'?2200:2600};growth.lastPaint=performance.now();growthStatus.lang=lang==='zh'?'zh-Hant':lang;growthStatus.textContent=loc(game.tiles[a.index].name)+' · '+st('start');paintGrowth();cityFit();
  if(reduced.matches||document.hidden){finishGrowth();return}
  function tick(now){const c=growth.current;if(!c)return;c.progress=clamp((now-c.started)/c.duration);if(now-growth.lastPaint>=30||c.progress===1){growth.lastPaint=now;paintGrowth()}if(c.progress===1)finishGrowth();else growth.raf=requestAnimationFrame(tick)}growth.raf=requestAnimationFrame(tick);
 }
 growthBar.querySelector('button').addEventListener('click',()=>{if(growth.current)finishGrowth();else if(growth.last){const a=growth.last;startGrowth({index:a.index,from:a.fromLevel?a.type:'original',level:a.fromLevel||1})}});
 reduced.addEventListener('change',()=>{if(reduced.matches)finishGrowth()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)finishGrowth(false)});window.addEventListener('pagehide',()=>finishGrowth(false));
 function renderMap(){const m=metrics();let svg=poly([[-27,-27,-9],[357,-27,-9],[357,357,-9],[-27,357,-9]],'#71917f')+poly([[-27,-27,0],[357,-27,0],[357,357,0],[-27,357,0]],'#779689');
  for(let r=0;r<3;r++)for(let c=0;c<3;c++){const x=c*110,y=r*110;svg+=poly([[x,y,1],[x+98,y,1],[x+98,y+98,1],[x,y+98,1]],'#a9c58c')}
  for(const n of [104,214]){svg+=poly([[-17,n,1],[347,n,1],[347,n+2,1],[-17,n+2,1]],'#e4dfbf')+poly([[n,-17,1],[n+2,-17,1],[n+2,347,1],[n,347,1]],'#e4dfbf')}
  for(const [c,r] of [[0,0],[1,0],[0,1],[2,0],[1,1],[0,2],[2,1],[1,2],[2,2]]){
   const i=r*3+c,t=game.tiles[i],x=c*110+17,y=r*110+17,up=(t.level||1)===2;
   const type=t.type==='original'?['terminal','runway','tower','cargo','hangar','substation','forest','housing','birds'][i]:t.type;
   const pulse=life.recap&&performance.now()-life.recap.started<1100&&!reduced.matches&&((life.recap.production>0&&builds[type]?.ai>0)||(life.recap.airport>0&&t.type==='original'&&i<5));
   svg+='<g '+(pulse?'class="c60-output-pulse" style="animation-delay:-'+(performance.now()-life.recap.started)+'ms" ':'')+'data-city-building="'+i+'" data-city-type="'+type+'" data-city-level="'+(t.level||1)+'">';
   if(t.type!=='original')svg+=facilityGeometry(type,t.level||1,x,y,m);
   else if(type==='runway'){svg+=poly([[x-7,y-10,2],[x+72,y-10,2],[x+72,y+75,2],[x-7,y+75,2]],'#6e8a80');for(let a=0;a<5;a++)svg+=poly([[x+28,y-4+a*16,3],[x+32,y-4+a*16,3],[x+32,y+5+a*16,3],[x+28,y+5+a*16,3]],'#f7f2d7')}
   else if(['forest','birds','park'].includes(type)){for(const [a,b,h] of [[10,10,31],[44,12,36],[65,37,27],[15,56,30],[58,65,32]])svg+=tree(x+a,y+b,h+(up?9:0));svg+=poly([[x-8,y+34,2],[x+76,y+34,2],[x+76,y+40,2],[x-8,y+40,2]],'#e2d6b5');if(type!=='forest'){svg+=box(x+39,y+39,1,20,4,8,'#d8b47e');const p=P(x+12,y+49,14);svg+='<ellipse cx="'+p[0]+'" cy="'+p[1]+'" rx="5" ry="3" fill="#e7e6cf"/>'}}
   else if(['substation','power'].includes(type)){for(let a=0;a<(up?4:3);a++){svg+=box(x+a*19,y+10,1,12,47,19,'#a8c4b0');svg+=box(x+3+a*19,y+19,20,6,27,9,'#d1d5bd')}svg+=box(x+3,y+65,0,59,8,7,'#829d8b')}
   else if(type==='tower'){svg+=building(x+5,y+5,27,27,4,m,type);svg+=box(x-3,y-3,68,44,44,16,'#a5c7c6','#5a9296','#487e83')}
   else if(type==='market'){svg+=building(x,y,68,56,up?3:1,m,type);for(let a=0;a<4;a++)svg+=box(x+a*17,y+57,1,16,17,15,a%2?'#e1c68b':'#6b9995')}
   else if(type==='show'){svg+=building(x,y,up?79:67,up?72:60,up?2:1,m,type);svg+=box(x+15,y+61,1,42,12,17,'#e2b981')}
   else if(type==='housing'){svg+=building(x,y,33,35,2,m,type)+building(x+43,y+30,30,39,2,m,type);svg+=tree(x+14,y+72,20)}
   else{if(type==='lab')svg+=poly([[x-5,y-5,2],[x+73,y-5,2],[x+73,y+62,2],[x-5,y+62,2]],'#c9c4a3');svg+=building(x,y,type==='data'?72:68,type==='hangar'?70:57,type==='lab'?(up?7:2):type==='data'?(up?6:3):up?3:type==='terminal'?2:1,m,type)}
   svg+='</g>';
  }
  if(game.selected!==null){const x=game.selected%3*110,y=Math.floor(game.selected/3)*110;svg+=poly([[x+1,y+1,3],[x+97,y+1,3],[x+97,y+97,3],[x+1,y+97,3]],'none','stroke="#efd18a" stroke-width="4"')}
  svg+='<g class="c60-operations" aria-hidden="true" pointer-events="none"></g>';
  q('.c60-scene').innerHTML=svg;paintGrowth();
  const plotHost=q('.c60-plots');plotHost.innerHTML=game.tiles.map((tile,i)=>{const p=P(i%3*110+49,Math.floor(i/3)*110+49,16);const condition=tile.type==='original'&&i<5&&m.traffic===0?V042[lang].ground:builds[tile.type]?.ai>0&&m.demand>m.supply?V042[lang].short:'';const label=loc(tile.name)+(tile.type==='original'?'':' · '+am('level')+' '+(tile.level||1))+(condition?' · '+condition:'');return '<button type="button" class="c60-plot" data-v2="tile" data-index="'+i+'" style="--x:'+p[0]/760*100+'%;--y:'+p[1]/480*100+'%" aria-label="'+esc(label)+'" aria-pressed="'+(game.selected===i)+'"><span class="c60-plot-label" aria-hidden="true">'+esc(label)+'</span></button>'}).join('');
  // SVG uses meet scaling; match the native target layer to its rendered rectangle.
  const fit=()=>{const w=city.clientWidth,h=ui.open&&!sheet.hidden?Math.max(150,sheet.getBoundingClientRect().top-city.getBoundingClientRect().top-6):city.clientHeight-(growth.current||growth.last||life.recap?80:0),a=growth.current,strength=a&&!reduced.matches?ease(a.progress/.16)*(1-ease((a.progress-.84)/.16)):0,z=a?1+.45*strength:camera4.zoom;
   const focal=a?P(a.index%3*110+49,Math.floor(a.index/3)*110+49,(facilityProfile(a.type,a.toLevel).vertical?a.to*7:18)):[camera4.x,camera4.y],cx=a?380+(focal[0]-380)*strength:focal[0],cy=a?240+(focal[1]-240)*strength:focal[1],top=Math.min(0,...game.tiles.map((t,i)=>P(i%3*110+17,Math.floor(i/3)*110+17,(builds[t.type]?facilityProfile(t.type,t.level||1).floors:i===2?5:i===0?2:1)*17+25)[1]))-14,W=720,H=480-top,vx=cx-W/2/z,vy=cy-H/2/z,s=Math.min(w/W,h/H)*z,scene=q('.c60-scene');camera4.scale=s;scene.style.height=h+'px';scene.setAttribute('viewBox',vx+' '+vy+' '+W/z+' '+H/z);plotHost.style.cssText='width:'+760*s+'px;height:'+480*s+'px;left:'+((w-W/z*s)/2-vx*s)+'px;top:'+((h-H/z*s)/2-vy*s)+'px'};fit();cityFit=fit;
  q('.c60-caption strong').textContent=tr('city');q('.c60-caption>span').textContent=tr('round')+' '+game.turn+' / 12';
  q('.c60-selected span').textContent=(game.selected!==null?loc(game.tiles[game.selected].name)+' · ':'')+V042[lang][m.traffic===0?'ground':'open']+' · '+V042[lang][m.demand>m.supply?'short':'power'];
 }
 let cityFit=()=>{};new ResizeObserver(()=>cityFit()).observe(city);
 /* V060_LIFE */
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
 function closeSheet(restore=true){ui.open=false;sheet.hidden=true;cityFit();updateGrowthBar();renderLifeUI();dock.querySelectorAll('button').forEach(b=>b.setAttribute('aria-expanded','false'));if(restore)(dock.querySelector('[data-city-view="'+ui.view+'"]')||dock.firstElementChild)?.focus({preventScroll:true})}
 function showSheet(view,trigger,focus=true){finishGrowth(false);ui.open=true;ui.view=view;ui.last=trigger||dock.querySelector('[data-city-view="'+view+'"]');renderSheet();updateGrowthBar();renderLifeUI();if(focus)q('#c60-sheet-title').focus({preventScroll:true})}
 function renderSheet(){sheet.hidden=!ui.open;if(!ui.open)return;Object.values(hosts).forEach(host=>host.hidden=true);let host=ui.view;
  const title=ui.view==='action'?tr(game.phase==='policy'?'policy':game.phase==='settle'?'settle':'land'):tr(ui.view==='admin'?'admin':ui.view);
  if(ui.view==='admin'||ui.view==='land'){if(game.phase==='build')host='action';else{host='locked';const next=game.phase==='policy'?'policy':'settle';hosts.locked.innerHTML='<p>'+esc(game.phase==='policy'?tr('locked'):msg('settle'))+'</p><button type="button" class="primary" data-city-view="action">'+esc(tr(next))+'</button>'}}
  if(!hosts[host])host='action';hosts[host].hidden=false;q('#c60-sheet-title').textContent=title;q('[data-city-close]').textContent=tr('close');
  dock.querySelectorAll('button').forEach(b=>b.setAttribute('aria-expanded',String(b.dataset.cityView===ui.view)));sheet.scrollTop=0;cityFit();updateGrowthBar();renderLifeUI();
 }
 function renderChrome(){q('h1').textContent=tr('title')+' · V0.6.0';slogan.textContent=st('slogan');const next=game.phase==='settle'?'settle':game.phase==='policy'?'policy':'land';
  const short={zh:{settings:'設定',goals:'政見'},en:{settings:'Options',goals:'Pledges'},fr:{settings:'Options',goals:'Objectifs'},nl:{settings:'Opties',goals:'Beloften'}}[lang];
  dock.setAttribute('aria-label',tr('city'));dock.innerHTML=[['action',game.finished?'done':next,'▶'],['land','land','🏗️'],['admin','admin','🏛️'],['finance','finance','💰'],['goals','goals','🎯'],['settings','settings','⚙️']].map(([view,label,icon],i)=>'<button type="button" data-city-view="'+view+'" aria-controls="c60-sheet" aria-expanded="false" aria-label="'+esc((short[label]?short[label]+' · ':'')+tr(label))+'"'+(i===0?' class="c60-next"':'')+'><span aria-hidden="true">'+icon+'</span><span>'+esc(short[label]||tr(label))+'</span></button>').join('');
  q('#c60-city').setAttribute('aria-label',tr('city'));q('.c60-plots').setAttribute('aria-label',tr('land'));q('.c60-plots').setAttribute('role','group');
  document.querySelectorAll('[data-city-heading]').forEach(e=>e.textContent=tr(e.dataset.cityHeading));settingsButtons.innerHTML='<button type="button" class="choice" data-v2="restart">'+esc(tr('restart'))+'</button><button type="button" class="choice" data-city-night></button><p class="c60-life-note"></p>';
  if(game.finished)closeSheet(false);else renderSheet();renderLifeUI();
 }
 drawV2=function(){const focus=document.activeElement,plot=focus?.classList.contains('c60-plot')?focus.dataset.index:null,transition=ui.transition,settleBefore=ui.settleBefore;ui.transition=null;ui.settleBefore=null;if(growth.gameRef!==game)life.recap=null;const active=growth.current||growth.last;if(growth.gameRef!==game||active&&(active.turn!==game.turn||game.tiles[active.index].type!==active.type||(game.tiles[active.index].level||1)!==active.toLevel))clearGrowth();growth.gameRef=game;baseDraw();if(settleBefore&&(game.turn>settleBefore.turn||game.finished&&!settleBefore.finished))makeRecap(settleBefore);decorateAction();renderMap();renderFinance();renderGoals();renderChrome();decorateArt4();if(transition&&builds[game.tiles[transition.index].type]&&(transition.from==='original'||game.tiles[transition.index].level!==transition.level))startGrowth(transition);const pending=ui.focus;ui.focus=null;if(!q('#modal [role="dialog"]')){const target=pending==='sheet'?q('#c60-sheet-title'):pending==='next'?dock.querySelector('[data-city-view="action"]'):pending?.startsWith('tab:')?q('#action [data-tab="'+pending.slice(4)+'"]'):plot!==null&&!ui.open?q('.c60-plot[data-index="'+plot+'"]'):null;target?.focus({preventScroll:true})}};
 document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.matches('[data-city-close]')){closeSheet();return}
  if(b.dataset.cityView){const view=b.dataset.cityView;if(ui.open&&ui.view===view){closeSheet();return}if(game.finished){showEnd();return}if((view==='admin'||view==='land')&&game.phase==='build'){actionView=view==='admin'?'admin':'land';drawV2()}showSheet(view,b);return}
  if(b.dataset.v2==='close'){dock.querySelector('[data-city-view="action"]')?.focus({preventScroll:true});renderLifeUI()}
  if(b.dataset.v2==='tile'&&game.phase!=='build'){const index=Number(b.dataset.index);q('.c60-selected span').textContent=loc(game.tiles[index].name)+' · '+(game.phase==='policy'?tr('locked'):tr('settle'));}
 });
 document.addEventListener('click',e=>{const b=e.target.closest('[data-v2]');if(!b)return;const a=b.dataset.v2;
  if(a==='settle'&&game.phase==='settle')ui.settleBefore={...v042Snapshot(),finished:game.finished};
  if(['policy','build','upgrade','admin','defer','settle','revise','loan'].includes(a))life.recap=null;
  if(['build','upgrade'].includes(a)&&game.phase==='build'&&game.selected!==null){const tile=game.tiles[game.selected];if(a==='build'&&builds[b.dataset.type]||a==='upgrade'&&builds[tile.type]){finishGrowth(false);ui.transition={index:game.selected,from:tile.type,level:tile.level||1}}}
  if(a==='tile'&&game.phase==='build'){ui.open=true;ui.view='land';ui.focus='sheet'}
  else if(a==='action-tab')ui.focus='tab:'+b.dataset.tab;
  else if(['policy','build','upgrade','admin','defer','settle'].includes(a)){ui.open=false;ui.focus='next'}
 },true);
 document.addEventListener('keydown',e=>{if(e.key==='Tab'&&growth.current)finishGrowth(false);if(e.key==='Escape'&&ui.open&&!q('#modal [role="dialog"]')){e.preventDefault();closeSheet()}});
 drawV2();
})();
