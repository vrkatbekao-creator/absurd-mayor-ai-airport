/* S4 artwork and manual camera. All state here is transient presentation state. */
const A4={
 zh:{zoom:'近看',overview:'全城',camera:'地圖視角',drag:'拖曳移動；鍵盤 Tab 逐塊查看。',steps:['選一個政策','安排市政行動','結算看變化'],rules:'玩法與完整說明',warning:'改建跑道或塔台，所有航班就會停飛。',voices:'市民的聲音',now:'目前',after:'升級後',term:'12 回合任期'},
 en:{zoom:'Closer',overview:'Whole city',camera:'Map view',drag:'Drag to move; use Tab to visit each plot.',steps:['Choose a policy','Plan a city action','Settle and see changes'],rules:'Rules and full explanation',warning:'Converting the runway or tower stops every flight.',voices:'City voices',now:'Now',after:'After upgrade',term:'A 12-turn term'},
 fr:{zoom:'Zoomer',overview:'Toute la ville',camera:'Vue de la carte',drag:'Glissez pour déplacer ; Tab parcourt les parcelles.',steps:['Choisir une politique','Prévoir une action','Faire le bilan'],rules:'Règles et explications',warning:'Transformer la piste ou la tour arrête tous les vols.',voices:'Voix de la ville',now:'Maintenant',after:'Après amélioration',term:'Un mandat de 12 tours'},
 nl:{zoom:'Dichterbij',overview:'Hele stad',camera:'Kaartweergave',drag:'Sleep om te bewegen; Tab bezoekt elke kavel.',steps:['Kies een beleid','Plan een stadsactie','Reken af en kijk'],rules:'Spelregels en uitleg',warning:'De startbaan of toren verbouwen stopt alle vluchten.',voices:'Stemmen uit de stad',now:'Nu',after:'Na verbetering',term:'Een termijn van 12 rondes'}
};
const a4=k=>A4[lang][k];
const targets4={zh:['AI 實績','綠地','公共專案負擔','且不缺電','含合約義務'],en:['AI results','Parks','Public project burden','No power shortage','Includes contract obligations'],fr:['Résultats IA','Espaces verts','Charge publique des projets','Sans pénurie électrique','Obligations contractuelles incluses'],nl:['AI-resultaat','Groengebieden','Publieke projectlasten','Geen stroomtekort','Inclusief contractverplichtingen']};
const palette4={lab:['#80c5c2','#fff0ce','#4c9694'],data:['#547eaa','#dae7ef','#345678'],market:['#4d9b8c','#f7dfad','#b97b53'],show:['#e5ac56','#ffebbe','#bc714c'],power:['#e8c96b','#d6dfba','#628a79'],terminal:['#78aaa9','#f4e6bc','#779c8c'],cargo:['#84a6a1','#f0d7ad','#718c87'],hangar:['#96b6b0','#f4e4c2','#75978c'],housing:['#c68562','#f6e1b6','#7d9d89'],tower:['#74b6be','#f6e5bd','#5f978f']};
function architecture4(type,x,y,w,d,floors,roof){
 if(floors<.8)return '';const z=floors*17;let out='';
 if(['lab','data','terminal','housing'].includes(type))out+=poly([[x+w*.38,y+d+.6,0],[x+w*.6,y+d+.6,0],[x+w*.6,y+d+.6,12],[x+w*.38,y+d+.6,12]],'#356971')+box(x+w*.3,y+d,0,w*.4,6,2,'#c7b78d');
 if(type==='terminal'){out+=box(x+2,y+d-2,14,w-4,12,3,'#8cb4ad');for(let n=0;n<5;n++)out+=poly([[x+4+n*12,y+d+.8,3],[x+13+n*12,y+d+.8,3],[x+13+n*12,y+d+.8,13],[x+4+n*12,y+d+.8,13]],'#578f94')}
 if(type==='cargo'){for(let n=0;n<3;n++)out+=poly([[x+5+n*21,y+d+.6,0],[x+21+n*21,y+d+.6,0],[x+21+n*21,y+d+.6,13],[x+5+n*21,y+d+.6,13]],'#537c77');out+=box(x+5,y+d+3,0,15,7,9,'#e0af6d')+box(x+22,y+d+3,0,10,7,6,'#c38d59')}
 if(type==='hangar'){const edge=y+d+.8;out+=poly([[x+6,edge,0],[x+w-6,edge,0],[x+w-6,edge,13],[x+w-13,edge,22],[x+w/2,edge,27],[x+13,edge,22],[x+6,edge,13]],'#426e74');if(roof)out+=poly([[x-3,y-3,z+2],[x+w/2,y-3,z+17],[x+w/2,y+d+3,z+17],[x-3,y+d+3,z+2]],'#b4d1c6')+poly([[x+w/2,y-3,z+17],[x+w+3,y-3,z+2],[x+w+3,y+d+3,z+2],[x+w/2,y+d+3,z+17]],'#6e9b95')}
 if(type==='lab'&&roof){out+=box(x+43,y+28,z+5,17,18,2,'#467c94');out+=box(x+47,y+30,z+7,1,14,1,'#b0dad1')+box(x+54,y+30,z+7,1,14,1,'#b0dad1');const a=P(x+18,y+18,z+13),b=P(x+18,y+18,z+28);out+='<path d="M'+a+'L'+b+'" stroke="#47766f" stroke-width="2"/>';out+='<circle cx="'+b[0]+'" cy="'+b[1]+'" r="3" fill="#d39c4c"/>'}
 if(type==='housing'&&roof)out+=poly([[x-3,y-3,z+1],[x+w/2,y-3,z+13],[x+w/2,y+d+3,z+13],[x-3,y+d+3,z+1]],'#d58c61')+poly([[x+w/2,y-3,z+13],[x+w+3,y-3,z+1],[x+w+3,y+d+3,z+1],[x+w/2,y+d+3,z+13]],'#a25f47');
 return '<g data-architecture="'+type+'">'+out+'</g>';
}
function artSvg(content,view='0 0 240 112',cls=''){return '<svg class="'+cls+'" viewBox="'+view+'" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">'+content+'</svg>'}
function artPath(d,fill='none',stroke='#234d48',width=2){return '<path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+width+'" stroke-linecap="round" stroke-linejoin="round"/>'}
function artRect(x,y,w,h,fill,rx=4){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+rx+'" fill="'+fill+'"/>'}
function artIcon(kind){const paths={
 plane:artPath('M3 17L12 12 12 4Q14 1 16 4L16 12 25 17 25 20 16 17 16 24 20 27 20 29 14 27 8 29 8 27 12 24 12 17 3 20Z','#f8e8bd'),
 plug:artPath('M9 3V10M19 3V10M6 10H22V15Q22 22 15 22V29M9 15H19','#edbd56'),
 report:artPath('M6 2H19L25 8V29H6ZM19 2V8H25M10 13H21M10 18H21M10 23H17','#fff2cf'),
 coin:'<circle cx="15" cy="15" r="12" fill="#edbb57" stroke="#805f29" stroke-width="2"/>'+artPath('M19 9H13Q8 9 10 14L19 17Q22 22 15 22H10M15 6V25','none','#805f29'),
 tree:artPath('M15 18V29M8 25H22','none','#446b49')+'<circle cx="15" cy="12" r="10" fill="#6f9d63"/><circle cx="11" cy="8" r="6" fill="#b4d27e"/>',
 book:artPath('M2 5Q9 1 15 6Q21 1 28 5V27Q21 23 15 28Q9 23 2 27ZM15 6V28M6 10L11 11M20 10L24 9','#f9e4af'),
 mic:artPath('M11 3Q15 0 19 3V16Q15 21 11 16ZM7 13V17Q15 29 23 17V13M15 24V30M10 30H20','#80b2ac'),
 box:artPath('M2 8L15 2 28 8 28 24 15 30 2 24ZM2 8L15 14 28 8M15 14V30M9 5L22 11V17','#dab47a'),
 calendar:artRect(3,6,25,24,'#fbefcd')+artRect(3,6,25,7,'#cf7757')+artPath('M9 3V9M22 3V9M10 19H12M19 19H21M10 25H12M19 25H21'),
 trophy:artPath('M8 3H23V10Q23 20 16 21Q8 20 8 10ZM8 6H3V12Q3 16 9 16M23 6H28V12Q28 16 22 16M16 21V28M10 29H22','#e7b44b'),
 camera:artRect(2,8,28,20,'#628d8b')+artRect(8,3,14,9,'#628d8b')+'<circle cx="16" cy="18" r="7" fill="#e5d9b8"/><circle cx="16" cy="18" r="4" fill="#2c5960"/>',
 paint:artPath('M8 3H22V12L18 17H12L8 12ZM12 17V28H18V17','#94b872')+artPath('M10 5H20M11 9H19','none','#f6e0af'),
 screen:artRect(1,3,30,21,'#375f64')+artRect(4,6,24,15,'#c0d9cf')+artPath('M16 24V30M10 30H22M8 16L13 11 18 14 24 8'),
 pigeon:artPath('M4 20Q1 10 10 10Q16 0 22 9L29 13 23 15Q22 26 10 26L3 30 6 22M11 14Q22 13 17 22','#91b4b0')+'<circle cx="21" cy="9" r="1.4" fill="#234d48"/>',
 robot:artRect(3,6,26,22,'#80b5b0',7)+artPath('M16 1V6M10 29V32M23 29V32M0 13V22M32 13V22')+'<circle cx="10" cy="15" r="2" fill="#214e48"/><circle cx="22" cy="15" r="2" fill="#214e48"/>'+artPath('M11 22H21'),
 check:artPath('M4 17L11 24 28 5','none','#386c55',4),
 magnify:'<circle cx="13" cy="13" r="10" fill="#d6e4cf" stroke="#284f49" stroke-width="3"/>'+artPath('M21 21L30 30','none','#284f49',4)
};return paths[kind]||paths.report}
function artAt(kind,x,y,scale=1){return '<g transform="translate('+x+' '+y+') scale('+scale+')">'+artIcon(kind)+'</g>'}
function portrait4(role='reporter',stance='followup'){
 const skin={employee:'#edb888',shop:'#b97b50',engineer:'#e6b48a',reporter:'#dca17b'}[role],shirt={employee:'#df9250',shop:'#4c9a8a',engineer:'#538b9a',reporter:'#385c65'}[role];
 let out='<circle cx="40" cy="40" r="38" fill="'+(stance==='accountability'?'#f1dac3':stance==='incomplete'?'#e5e5d9':'#dce9cb')+'"/>';
 out+=artPath('M14 79V67Q15 51 39 51Q64 51 66 67V79',shirt,'none')+artRect(34,45,12,14,skin,3)+'<ellipse cx="40" cy="34" rx="18" ry="21" fill="'+skin+'"/>';
 out+=artPath(role==='shop'?'M22 34Q15 6 42 10Q66 11 59 39L53 23Q36 29 26 22Z':role==='reporter'?'M21 38Q15 13 36 11Q58 6 60 30L52 25 47 18Q36 27 26 26Z':'M22 30Q17 12 40 12Q62 12 58 30L52 23Q40 27 26 23Z','#274e45','none');
 out+='<circle cx="33" cy="34" r="1.8" fill="#264b43"/><circle cx="47" cy="34" r="1.8" fill="#264b43"/>';
 out+=artPath(stance==='accountability'?'M34 46Q40 42 46 46':stance==='acknowledgement'?'M33 43Q40 50 47 43':'M35 45H45','none','#704c3c',1.8);
 if(role==='employee')out+=artPath('M20 24H61L58 14Q40 3 23 14Z','#638e94','none')+artPath('M23 61L32 79M55 60L48 79','none','#ffe9a7',5);
 if(role==='engineer')out+=artPath('M18 24H62L58 17Q56 4 41 4Q24 3 22 18Z','#e5b44f','#886b33',1.5)+artPath('M40 5V20','none','#f9d780',4)+artPath('M25 32H37V39H26ZM43 32H55V39H43M37 34H43','none','#315b61',1.4);
 if(role==='shop')out+=artPath('M23 61L29 77H54L58 61M32 56V69M50 56V69','none','#efe1b9',4);
 if(role==='reporter')out+=artAt('mic',54,49,.7);
 return artSvg(out,'0 0 80 80','c60-portrait');
}
const sceneKinds4=['plane','robot','box','paint','book','market','coin','worker','report','pigeon','slides','plug','trophy','advert','budget'];
const optionKinds4=[['plane','coin','trophy'],['plug','coin','mic'],['box','screen','mic'],['plug','paint','calendar'],['book','trophy','report'],['market','robot','report'],['coin','report','mic'],['book','robot','calendar'],['report','coin','robot'],['tree','pigeon','box'],['screen','slides','market'],['coin','report','plug'],['book','trophy','screen'],['report','screen','camera'],['report','mic','screen']];
function policyScene4(index,mini=false,option=0){
 const kind=mini?optionKinds4[index][option]:sceneKinds4[index],role=[0,2,7].includes(index)?'employee':index===9?'shop':[1,3,11,12].includes(index)?'engineer':'reporter';
 let out=artRect(0,0,240,112,'#e9efdb',16)+'<circle cx="191" cy="27" r="24" fill="#f4d49b"/>'+artPath('M0 91Q53 70 99 89T240 83V112H0Z','#c3d2af','none');
 const props={market:artRect(65,46,100,44,'#f4dfb5')+artPath('M55 49L73 24H160L176 49Z','#cb7954','none')+artPath('M76 26L67 49M104 26L101 49M132 26L136 49M158 26L169 49','none','#f5d887',10)+artRect(82,63,29,27,'#45746c')+artRect(124,61,25,17,'#88bcb2'),
 worker:artAt('book',80,36,1.6)+artPath('M134 80V47Q145 29 157 47V80','#669a91','none')+'<circle cx="145" cy="29" r="13" fill="#e9b182"/>'+artRect(129,17,34,9,'#507f86')+artAt('box',172,62,.8),
 slides:artRect(76,24,102,60,'#476b6b')+artRect(82,30,90,48,'#fff1cc')+'<text x="127" y="61" text-anchor="middle" font-size="29" font-weight="800" fill="#b36d42">480</text>'+artPath('M127 85V100M105 101H149')+artAt('report',181,61,.8),
 advert:artRect(62,14,133,72,'#4c747b')+artRect(68,20,121,60,'#bcd7cf')+artPath('M80 71L107 33 128 62 148 39 176 72Z','#789c8d','none')+artAt('plane',131,24,.8)+artPath('M81 86V103M179 86V103','none','#3a6359',5),
 budget:artRect(75,30,103,61,'#e3c58a')+artRect(84,19,88,13,'#e3c58a')+artPath('M89 50H160M89 64H160M89 78H141','none','#b28c4f',3)+artAt('magnify',156,48,1.6),
 plane:artPath('M65 82H214M70 91H200','none','#77978a',4)+artAt('plane',96,21,2)+artAt('report',167,43,1.3),
 robot:artAt('robot',95,23,2)+artAt('plug',167,48,1.3)+artPath('M135 86Q178 110 192 87','none','#cc8855',3),
 box:artAt('box',89,40,1.7)+artAt('plane',159,19,1.3)+artPath('M147 79L185 79M176 73L185 79 176 85','none','#50746b',3),
 paint:artAt('plug',94,30,1.8)+artAt('paint',154,37,1.6)+artRect(146,85,51,8,'#94b872'),
 book:artAt('book',100,32,1.9)+artAt('trophy',170,48,1),
 coin:artAt('coin',97,27,2)+artAt('calendar',171,52,1)+artAt('magnify',158,21,.65),
 report:artAt('report',92,14,2.4)+artAt('robot',173,54,.9),
 pigeon:artRect(83,72,98,20,'#bb9562')+artAt('pigeon',112,26,1.8)+artAt('mic',178,36,1.2),
 plug:artAt('plug',95,24,2)+artPath('M163 86V55L185 39 207 55V86Z','#dfb982','none')+artRect(176,61,15,25,'#4a8078'),
 trophy:artAt('trophy',108,22,1.9)+'<circle cx="184" cy="65" r="21" fill="#80b5b0"/>'+artPath('M164 65H205M184 44Q168 65 184 86Q200 65 184 44','none','#f2e2b6',1.5)
 };
 out+=(props[kind]||artAt(kind,105,27,2));out+='<g transform="translate(3 32) scale(.82)">'+portrait4(role,'followup').replace(/^<svg[^>]*>|<\/svg>$/g,'')+'</g>';
 if(mini)out+=artRect(209,86,23,18,'#fff0cd',8)+'<text x="220" y="99" text-anchor="middle" font-size="12" fill="#31564a">'+(option+1)+'</text>';
 return artSvg(out,'0 0 240 112','c60-event-art');
}
function facilityPreview4(type,level,scaleLevel=level){
 const height=facilityProfile(type,scaleLevel).floors*17,top=Math.min(46,69-height),body=facilityGeometry(type,level,17,17,metrics());
 return artSvg(poly([[0,0,0],[98,0,0],[98,98,0],[0,98,0]],'#a8c293')+body,'287 '+top+' 190 '+(204-top),'c60-facility-art');
}
const camera4={zoom:1,x:380,y:240,scale:1,drag:null,ignore:0};
const cameraControls4=el('div','c60-camera');city.append(cameraControls4);
cameraControls4.innerHTML='<button type="button" data-city-zoom aria-pressed="false"></button><p id="c60-camera-help" hidden></p>';
function cameraLabels4(){const b=cameraControls4.querySelector('button');b.textContent=(camera4.zoom>1?'− ':'+ ')+a4(camera4.zoom>1?'overview':'zoom');b.setAttribute('aria-label',a4(camera4.zoom>1?'overview':'zoom')+' · '+a4('camera'));b.setAttribute('aria-pressed',String(camera4.zoom>1));const p=q('#c60-camera-help');p.textContent=a4('drag');p.hidden=camera4.zoom===1;city.classList.toggle('c60-zoomed',camera4.zoom>1);cameraControls4.hidden=ui.open||!!growth.current}
function cameraFocus4(i){const p=P(i%3*110+49,Math.floor(i/3)*110+49,18);camera4.x=Math.max(200,Math.min(560,p[0]));camera4.y=Math.max(100,Math.min(360,p[1]));cityFit()}
cameraControls4.querySelector('button').addEventListener('click',()=>{camera4.zoom=camera4.zoom>1?1:1.65;if(camera4.zoom===1){camera4.x=380;camera4.y=240}else if(game.selected!==null)cameraFocus4(game.selected);cameraLabels4();cityFit()});
city.addEventListener('pointerdown',()=>{camera4.pointerFocus=true},true);
for(const event of ['pointerup','pointercancel'])document.addEventListener(event,()=>{camera4.pointerFocus=false},true);
city.addEventListener('focusin',e=>{const b=e.target.closest('.c60-plot');if(b&&camera4.zoom>1&&!ui.open&&!camera4.pointerFocus)cameraFocus4(Number(b.dataset.index))});
city.addEventListener('pointerdown',e=>{if(camera4.zoom===1||ui.open||growth.current||e.button!==0||e.target.closest('.c60-camera,.c60-motion,.c60-growth,.c60-recap'))return;camera4.drag={id:e.pointerId,x:e.clientX,y:e.clientY,cx:camera4.x,cy:camera4.y,moved:false}});
city.addEventListener('pointermove',e=>{const d=camera4.drag;if(!d||d.id!==e.pointerId)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(!d.moved&&Math.hypot(dx,dy)<8)return;if(!d.moved){d.moved=true;city.setPointerCapture(e.pointerId)}e.preventDefault();camera4.x=Math.max(200,Math.min(560,d.cx-dx/camera4.scale));camera4.y=Math.max(100,Math.min(360,d.cy-dy/camera4.scale));cityFit()});
for(const event of ['pointerup','pointercancel'])city.addEventListener(event,e=>{const d=camera4.drag;if(!d||d.id!==e.pointerId)return;if(d.moved)camera4.ignore=performance.now()+350;camera4.drag=null;if(city.hasPointerCapture(e.pointerId))city.releasePointerCapture(e.pointerId)});
city.addEventListener('click',e=>{if(e.detail>0&&performance.now()<camera4.ignore&&!e.target.closest('.c60-camera,.c60-motion')){e.preventDefault();e.stopImmediatePropagation()}},true);
function decorateArt4(){
 cameraLabels4();const action=q('#action');
 const funds=[...financeVisual.querySelectorAll('.c60-fund')],amounts=funds.map(e=>Number(e.querySelector('.c60-purse').textContent)),maximum=Math.max(1,...amounts.map(Math.abs));funds.forEach((e,i)=>e.insertAdjacentHTML('beforeend','<span class="c60-amount-bar" aria-hidden="true"><i class="'+(amounts[i]<0?'negative':'')+'" style="width:'+Math.abs(amounts[i])/maximum*100+'%"></i></span>'));
 const scaleNote={zh:'圖示採同一比例；待付為現金義務。',en:'Same scale; bills represent cash obligations.',fr:'Même échelle ; les échéances sont des obligations de paiement.',nl:'Gelijke schaal; openstaande rekeningen zijn betalingsverplichtingen.'};financeVisual.querySelector('.c60-funds')?.insertAdjacentHTML('afterend','<p class="c60-scale-note">'+esc(scaleNote[lang])+'</p>');
 goalVisual.querySelectorAll('.c60-goal').forEach((e,i)=>{const m=metrics(),n=i===0?game.ai:m.parks,max=i===0?50:2,value=Math.max(0,Math.min(1,n/max));e.querySelector('p').setAttribute('aria-label',msg('promise'+(i+1)));e.querySelector('p').textContent=targets4[lang][i];e.querySelector('strong').innerHTML=artSvg((i<2?'<circle cx="20" cy="20" r="17" fill="none" stroke="#c2d1b2" stroke-width="3"/><circle cx="20" cy="20" r="17" fill="none" stroke="#457a5c" stroke-width="3" stroke-dasharray="'+value*106.81+' 106.81" transform="rotate(-90 20 20)"/>':'')+'<g transform="translate(8 8) scale(.75)">'+artIcon(['robot','tree','coin'][i])+'</g>','0 0 40 40')});
 if(game.phase==='policy'){
  const index=game.order[game.turn-1],event=action.querySelector('.event');event?.insertAdjacentHTML('afterbegin','<div class="c60-policy-scene">'+policyScene4(index)+'</div>');
  action.querySelectorAll('.c60-comic').forEach((e,i)=>{e.classList.add('c60-option-art');e.innerHTML=policyScene4(index,true,i)});
 }
 action.querySelectorAll('[data-v2="build"],[data-v2="upgrade"]').forEach(b=>{const type=b.dataset.type||game.tiles[game.selected]?.type,thumb=b.querySelector('.c60-thumb');if(!thumb||!builds[type])return;if(b.dataset.v2==='upgrade'){thumb.classList.add('c60-before-after');thumb.innerHTML='<span>'+facilityPreview4(type,1,2)+'<small>'+esc(a4('now'))+'</small></span><span aria-hidden="true">→</span><span>'+facilityPreview4(type,2)+'<small>'+esc(a4('after'))+'</small></span>'}else thumb.innerHTML=facilityPreview4(type,1)});
 action.querySelectorAll('[data-v2="admin"] .c60-comic').forEach(e=>{const key=e.closest('button').dataset.type,kind=['investment','partnership','greenfund'].includes(key)?'coin':key==='consult'?'mic':key==='research'?'book':'report';e.classList.add('c60-admin-art');e.innerHTML=artSvg(artAt(kind,92,11,2.5),'0 0 240 104','c60-event-art')});
 q('#v51-reaction .v51-reaction')?.insertAdjacentHTML('afterbegin',portrait4([...game.story.events].reverse().map(storyReaction51).find(Boolean)?.[0]||'reporter'));
 const outcome=q('.c60-ending-art');if(outcome&&q('.c60-scene [data-city-building]')){const copy=q('.c60-scene').cloneNode(true);copy.querySelector('.c60-operations')?.remove();copy.querySelectorAll('.c60-output-pulse').forEach(e=>{e.removeAttribute('class');e.removeAttribute('style')});outcome.innerHTML=copy.innerHTML;outcome.setAttribute('viewBox','30 -60 700 560');outcome.dataset.illustration='actual-city'}
}
const baseVoices4=readingVoices521;
readingVoices521=function(){const t=document.createElement('template');t.innerHTML=baseVoices4();t.content.querySelectorAll('.v0521-person').forEach(e=>{const x=characterPositions52().find(x=>x.role===e.dataset.readingKey);e.querySelector('summary').insertAdjacentHTML('afterbegin',portrait4(x.role,x.stance))});return t.innerHTML};
const baseOutcome4=showReadingEnd521;
showReadingEnd521=function(){const old=q('#modal .v0521-reading'),active=document.activeElement,saved=old&&readingGame521===game&&old.contains(active)&&active.id?{id:active.id,offset:active.getBoundingClientRect().top-old.getBoundingClientRect().top}:null;baseOutcome4();const end=q('#modal .v04-end-illustration .scene-emoji');if(end)end.outerHTML=artSvg(artAt(({heater:'plug',miracle:'robot',pigeon:'pigeon',ppt:'screen',airport:'plane'})[endingKey()],5,5,2.3),'0 0 84 84','c60-ending-art');if(saved){const target=document.getElementById(saved.id);if(target){target.focus({preventScroll:true});readingAlign521(target,saved.offset)}}};
const baseIntro4=showIntro;
showIntro=function(key){baseIntro4(key);const pane=q('#modal .modal');pane.classList.add('c60-intro');const title=q('#introtitle'),start=pane.querySelector('[data-v2="close"]'),paragraphs=[...pane.querySelectorAll(':scope > p')],explanation=paragraphs.filter(p=>p.textContent!==msg('intro')&&!p.querySelector('b'));title.textContent=tr('title')+' · V0.6.0';
 title.insertAdjacentHTML('beforebegin','<div class="c60-intro-art">'+policyScene4(0)+'<span>'+esc(a4('term'))+'</span></div>');title.insertAdjacentHTML('afterend','<p class="c60-intro-slogan">'+esc(st('slogan'))+'</p>');
 const steps=el('ol','c60-intro-steps');steps.innerHTML=a4('steps').map((text,i)=>'<li>'+artSvg(artAt(['report','tree','check'][i],0,0,1),'0 0 32 32')+'<b>'+(i+1)+'</b><span>'+esc(text)+'</span></li>').join('');start.before(steps);
 const warning=el('p','c60-intro-warning');warning.textContent=a4('warning');steps.after(warning);
 const targets=targets4[lang],goals=el('div','c60-intro-pledges'),pledges=[msg('promise1'),msg('promise2'),msg('promise3')];goals.innerHTML=pledges.map((text,i)=>'<span aria-label="'+esc(text)+'">'+artSvg(artAt(['robot','tree','coin'][i],0,0),'0 0 32 32')+'<span aria-hidden="true"><small>'+esc(targets[i])+'</small><b>'+['≥ 50','≥ 2','0'][i]+'</b>'+(i?'<small>'+esc(targets[i+2])+'</small>':'')+'</span></span>').join('');warning.before(goals);
 const details=el('details','c60-intro-rules'),summary=el('summary');summary.textContent=a4('rules');details.append(summary,...explanation);for(const text of pledges){const p=el('p');p.textContent=text;details.append(p)}start.after(details);title.focus({preventScroll:true});pane.scrollTop=0;
};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&q('#introtitle')){e.preventDefault();e.stopImmediatePropagation();q('#modal').innerHTML='';dock.querySelector('[data-city-view="action"]')?.focus({preventScroll:true});syncLife()}},true);
if(q('#introtitle'))showIntro(notice);
