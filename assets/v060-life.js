// Ambient activity is illustrative. All operating conditions and recap values are derived.
const S3={
 zh:{soil:'整地',paths:'步道成形',planting:'植栽成長',landscape:'景觀設施',equipment:'設備增設',expanding:'擴建量體',pause:'暫停動態',resume:'播放動態',motion:'城市動畫',reduced:'減少動態',night:'夜景',changes:'最近變化',note:'街景與日夜為視覺示意，車輛與人數不代表實際收益或人口。'},
 en:{soil:'Groundworks',paths:'Paths taking shape',planting:'Growing greenery',landscape:'Park amenities',equipment:'Adding equipment',expanding:'Expanding buildings',pause:'Pause motion',resume:'Play motion',motion:'City animation',reduced:'Motion reduced',night:'Night view',changes:'Latest changes',note:'Street activity and day or night are illustrative. Vehicle and pedestrian counts do not represent actual income or population.'},
 fr:{soil:'Terrassement',paths:'Création des chemins',planting:'Croissance végétale',landscape:'Aménagement du parc',equipment:'Ajout d’équipements',expanding:'Extension des bâtiments',pause:'Pause',resume:'Animer',motion:'Animations de la ville',reduced:'Mouvement réduit',night:'Vue nocturne',changes:'Derniers changements',note:'La vie des rues et le jour ou la nuit sont illustratifs. Le nombre de véhicules et de passants ne représente ni les recettes ni la population réelles.'},
 nl:{soil:'Grondwerk',paths:'Paden aanleggen',planting:'Groeiend groen',landscape:'Parkvoorzieningen',equipment:'Meer installaties',expanding:'Gebouwen uitbreiden',pause:'Pauze',resume:'Afspelen',motion:'Stadsanimaties',reduced:'Minder beweging',night:'Nachtbeeld',changes:'Laatste wijzigingen',note:'Straatleven en dag of nacht zijn illustratief. Het aantal voertuigen en voorbijgangers staat niet voor werkelijk inkomen of inwonertal.'}
};
Object.assign(S3.zh,{pads:'設備基座',wiring:'線路接通',pause:'暫停街景',resume:'播放街景',motion:'街景動畫'});
Object.assign(S3.en,{pads:'Equipment pads',wiring:'Connecting cables',pause:'Pause activity',resume:'Play activity',motion:'Ambient city activity'});
Object.assign(S3.fr,{pads:'Socles des équipements',wiring:'Raccordement des câbles',motion:'Animations d’ambiance'});
Object.assign(S3.nl,{pads:'Installatievoeten',wiring:'Kabels aansluiten',motion:'Omgevingsanimaties'});
function s3(key){return S3[lang][key]}
const life={enabled:true,raf:0,elapsed:0,last:0,lastPaint:0,night:false,suspended:false,recap:null};
const motionButton=el('button','c60-motion');motionButton.type='button';motionButton.dataset.cityMotion='';q('.c60-caption').append(motionButton);
const recap=el('section','c60-recap');recap.hidden=true;city.append(recap);
const changeDetails=el('details','c60-full'),changeSummary=el('summary'),changeBody=el('div');changeDetails.dataset.cityChanges='';changeDetails.hidden=true;changeDetails.append(changeSummary,changeBody);goalVisual.after(changeDetails);
new MutationObserver(()=>{
 const hidden=v042Last?.kind==='settle';feedback.classList.toggle('c60-feedback-sr',hidden);changeDetails.hidden=!feedback.textContent.trim();changeSummary.textContent=s3('changes');if(changeBody.innerHTML!==feedback.innerHTML)changeBody.innerHTML=feedback.innerHTML;
}).observe(feedback,{childList:true,subtree:true,characterData:true});
function motionAllowed(){return life.enabled&&!reduced.matches&&!document.hidden&&!life.suspended&&!game.finished&&!ui.open&&!growth.current&&!q('#modal [role="dialog"]')}
function plane(x,y,z){return box(x-2,y-14,z,4,28,3,'#f7f1db','#e3e3cd','#a5bfb5')+poly([[x-22,y+2,z+1],[x+22,y+2,z+1],[x+5,y-6,z+1],[x-5,y-6,z+1]],'#f5edd2')+poly([[x-10,y+12,z+3],[x+10,y+12,z+3],[x+3,y+6,z+3],[x-3,y+6,z+3]],'#6c9eaa')+box(x-1,y-13,z+2,2,7,3,'#44778b')}
function truck(x,y,horizontal=false){return box(x,y,2,horizontal?17:8,horizontal?8:17,8,'#c7d8c4')+box(x+(horizontal?17:0),y+(horizontal?0:17),2,horizontal?7:8,horizontal?8:7,6,'#d8b77a')}
function person(x,y,n){const a=P(x,y,9),b=P(x,y,2);return '<g><path d="M'+a+'L'+b+'" stroke="'+(n%2?'#627e83':'#bf9c65')+'" stroke-width="3.5"/><circle cx="'+a[0]+'" cy="'+(a[1]-1.5)+'" r="2.5" fill="#dfc490"/></g>'}
function paintOperations(){
 const layer=q('.c60-operations');if(!layer)return;const m=metrics(),short=m.demand>m.supply,phase=(life.elapsed%8500)/8500,stationary=!motionAllowed();let html='';
 layer.dataset.airport=m.traffic>0?'open':'grounded';layer.dataset.power=short?'reduced':'adequate';layer.dataset.motion=motionAllowed()?'running':'paused';
 if(m.traffic>0){const p=reduced.matches?.08:phase,opacity=reduced.matches?1:Math.min(1,p*10,(1-p)*8);html+='<g data-operation="flight" opacity="'+opacity+'">'+plane(158,92-230*p,Math.max(0,p-.18)*105)+'</g>'}
 if(m.traffic>0&&game.tiles[3].type==='original')html+='<g data-operation="cargo">'+truck(101,18+245*((life.elapsed%9000)/9000))+'</g>';
 const visible=i=>!(growth.current?.index===i&&growth.current.fromLevel===0);
 if(game.tiles.some((t,i)=>t.type==='market'&&visible(i)))html+='<g data-operation="trade">'+truck(14+245*((life.elapsed%10500)/10500),210,true)+'</g>';
 const places=game.tiles.map((t,i)=>({t,i})).filter(({t,i})=>visible(i)&&(['park','market'].includes(t.type)||t.type==='original'&&i===7)).slice(0,3);
 for(const {i} of places){const x=i%3*110+12,y=Math.floor(i/3)*110+88,step=(life.elapsed%7000)/7000;html+='<g data-operation="people">'+person(x+56*step,y,0)+person(x+52-40*step,y-3,1)+'</g>'}
 for(let i=0;i<9;i++)if(game.tiles[i].type==='data'&&growth.current?.index!==i){
  const t=game.tiles[i],height=(t.level===2?6:3)*17,angle=life.elapsed*(short?.018:.06),center=P(i%3*110+17+34,Math.floor(i/3)*110+17+33,height+12);
  html+='<g data-operation="cooling" data-load="'+(short?'reduced':'normal')+'" transform="rotate('+angle+' '+center[0]+' '+center[1]+')"><path d="M'+(center[0]-5)+','+center[1]+'h10M'+center[0]+','+(center[1]-3)+'v6" stroke="#c8d9c9" stroke-width="1.5" fill="none"/></g>';
 }
 layer.innerHTML=html;
}
function updateLifeLabels(){
 const label=s3(reduced.matches?'reduced':life.enabled?'pause':'resume');if(motionButton.textContent!==label)motionButton.textContent=label;motionButton.disabled=reduced.matches;const name=label+' · '+s3('motion');if(motionButton.getAttribute('aria-label')!==name)motionButton.setAttribute('aria-label',name);
 city.classList.toggle('c60-night',life.night);changeSummary.textContent=s3('changes');const night=q('[data-city-night]');if(night){night.textContent=s3('night');night.setAttribute('aria-pressed',String(life.night))}const note=q('.c60-life-note');if(note)note.textContent=s3('note');
}
function syncLife(){
 updateLifeLabels();const allowed=motionAllowed();city.dataset.cityMotion=allowed?'running':'paused';
 if(!allowed){cancelAnimationFrame(life.raf);life.raf=0;life.last=0;paintOperations();return}
 if(life.raf){paintOperations();return}life.last=performance.now();
 function tick(now){if(!motionAllowed()){life.raf=0;syncLife();return}life.elapsed+=Math.max(0,Math.min(200,now-life.last));life.last=now;if(now-life.lastPaint>=50){life.lastPaint=now;paintOperations()}life.raf=requestAnimationFrame(tick)}
 paintOperations();life.raf=requestAnimationFrame(tick);
}
function renderRecap(){
 recap.hidden=!life.recap||ui.open||!!growth.current||!!growth.last||game.finished;if(recap.hidden)return;const a=life.recap;
 recap.setAttribute('aria-label',msg('round')+' '+a.turn+' · '+msg('settle'));recap.innerHTML='<strong>'+esc(msg('round')+' '+a.turn+' · '+msg('settle'))+'</strong><div>'+[['money','💰'],['ai','🧠'],['pop','🤝']].map(([key,icon])=>'<span data-recap-key="'+key+'" class="'+(a.delta[key]<0?'negative':a.delta[key]>0?'positive':'neutral')+'"><span aria-hidden="true">'+icon+'</span> '+esc(VIS[lang][key])+' <b>'+(a.delta[key]>0?'+':'')+a.delta[key]+'</b></span>').join('')+'</div>';
}
function makeRecap(before){
 const entry=game.log.find(x=>x.kind==='settlement'&&x.turn===before.turn);life.recap={turn:before.turn,delta:{money:game.money-before.money,ai:game.ai-before.ai,pop:game.pop-before.pop},production:entry?.production||0,airport:entry?.airport||0,started:performance.now()};
 if(!reduced.matches)recap.animate([{opacity:.4,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:800,easing:'ease-out'});
}
function renderLifeUI(){renderRecap();syncLife();cityFit();cameraLabels4()}
motionButton.addEventListener('click',()=>{life.enabled=!life.enabled;syncLife()});
document.addEventListener('click',event=>{const b=event.target.closest('[data-city-night]');if(!b)return;life.night=!life.night;updateLifeLabels();paintOperations()});
document.addEventListener('visibilitychange',syncLife);window.addEventListener('pagehide',()=>{life.suspended=true;syncLife()});window.addEventListener('pageshow',()=>{life.suspended=false;syncLife()});
reduced.addEventListener('change',()=>{if(reduced.matches)recap.getAnimations().forEach(a=>a.cancel());syncLife()});
