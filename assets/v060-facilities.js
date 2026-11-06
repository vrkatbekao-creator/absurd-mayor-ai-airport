// Injected inside the city presentation closure; visual levels never enter game state.
function facilityProfile(type,level){
 const floors={lab:[0,2,7],data:[0,3,6],market:[0,1,2],show:[0,1,1],power:[0,1,1],park:[0,1,2]};
 return {floors:(floors[type]||[0,1,2])[level],vertical:type==='lab'||type==='data'};
}
function growthPhaseLabel(type,phase){
 if(type==='park')return ({foundation:s3('soil'),frame:s3('paths'),floors:s3('planting'),roof:s3('landscape')})[phase]||st(phase);
 if(type==='power')return ({frame:s3('pads'),floors:s3('equipment'),roof:s3('wiring')})[phase]||st(phase);
 if(phase==='floors'&&['market','show'].includes(type))return s3('expanding');
 return st(phase);
}
function facilityGeometry(type,level,x,y,m,animation=null){
 const p=animation?.progress??1,fromLevel=animation?.fromLevel||0;
 const material=p<.38?0:ease((p-.38)/.41),v=animation?fromLevel+(level-fromLevel)*material:level;
 const roof=p>=.79,roofAmount=clamp((p-.79)/.14),fromFloors=facilityProfile(type,fromLevel).floors;
 const floorCount=fromFloors+(facilityProfile(type,level).floors-fromFloors)*material;
 let out='';
 if(type!=='park'){const top=type==='show'&&level>1?-12:-5,right=type==='show'&&level>1?82:78;out+=poly([[x-5,y+top,2],[x+right,y+top,2],[x+right,y+66,2],[x-5,y+66,2]],'#c9c4a3')}
 if(type==='lab'){
  // Keep the S2 laboratory footprint and floor proportions.
  out=poly([[x-5,y-5,2],[x+73,y-5,2],[x+73,y+62,2],[x-5,y+62,2]],'#c9c4a3');
  out+=building(x,y,68,57,floorCount,m,type,{roof,opacity:roofAmount,lift:14*(1-roofAmount),unlit:p<.93,litFloors:fromFloors});
 }else if(type==='data'){
  out+=building(x,y,70,55,floorCount,m,type,{roof,opacity:roofAmount,lift:12*(1-roofAmount),unlit:p<.93,litFloors:fromFloors});
  if(floorCount>0){out+='<g data-facility-server>';for(let n=0;n<Math.ceil(floorCount);n++){const h=Math.min(1,floorCount-n)*17;out+=poly([[x+29,y+55.5,n*17],[x+43,y+55.5,n*17],[x+43,y+55.5,n*17+h],[x+29,y+55.5,n*17+h]],'#466b70')}out+='</g>'}
  if(roof){out+='<g data-facility-cooling opacity="'+roofAmount+'">';for(let n=0;n<3;n++){out+=box(x+8+n*19,y+25,floorCount*17+5,14,17,6,'#91ada9');const a=P(x+15+n*19,y+33,floorCount*17+12);out+='<ellipse cx="'+a[0]+'" cy="'+a[1]+'" rx="6" ry="3" fill="#365961"/>'}out+='</g>'}
 }else if(type==='market'){
  out+=building(x,y,43,38,Math.min(2,v),m,type,{roof,opacity:roofAmount,unlit:p<.93,litFloors:fromFloors});
  if(v>1)out+='<g data-facility-wing>'+box(x+45,y+6,0,27*(v-1),35,20,'#a2c7ba')+'</g>';
  const stalls=v<1?3*v:3+2*(v-1);out+='<g data-facility-stalls>';
  for(let n=0;n<Math.ceil(stalls);n++){const amount=Math.min(1,stalls-n);out+=box(x+n*16,y+48,0,15*amount,19,17,'#d8d7b6');out+=poly([[x+n*16,y+68,12],[x+15*amount+n*16,y+68,12],[x+15*amount+n*16,y+44,21],[x+n*16,y+44,21]],n%2?'#dfb478':'#679c95');out+=box(x+3+n*16,y+64,2,Math.max(1,9*amount),2,8,'#416b61')}
  out+='</g>';
 }else if(type==='show'){
  const body=Math.min(1,v);out+=building(x,y,64,51,body,m,type,{roof,opacity:roofAmount,unlit:p<.93});
  if(roof){out+='<g data-facility-pavilion opacity="'+roofAmount+'">';for(let n=0;n<4;n++)out+=poly([[x+n*16,y,21],[x+16+n*16,y,21],[x+16+n*16,y+52,21],[x+n*16,y+52,21]],n%2?'#e4c28a':'#93babc');out+='</g>'}
  if(v>1)out+='<g data-facility-wing>'+box(x+63,y-10,0,17*(v-1),58,24,'#e3bf8c')+box(x+13,y+62,0,47,10*(v-1),8,'#b48e5d')+'</g>';
 }else if(type==='power'){
  const count=v<1?3*v:3+2*(v-1);out+='<g data-facility-transformers>';
  for(let n=0;n<Math.ceil(count);n++){const a=Math.min(1,count-n);out+=box(x+n*15,y+7,0,11,42,20*a,'#92b5a7');if(a>.5)out+=box(x+3+n*15,y+16,20*a,5,24,9*a,'#d3d6b9')}
  out+='</g>';if(roof){out+='<g data-facility-busbar opacity="'+roofAmount+'">'+box(x-1,y+55,1,Math.min(77,24+25*v),7,10,'#6c8f80')+'</g>'}
 }else if(type==='park'){
  out=poly([[x-9,y-9,1],[x+81,y-9,1],[x+81,y+79,1],[x-9,y+79,1]],'#bed49a');
  const scale=animation?(fromLevel?1:p<.16?0:p<.38?ease((p-.16)/.22):1):1,treeHeight=v<=1?23*v:23+17*(v-1),crown=Math.max(.15,Math.min(1.4,treeHeight/28));
  out+='<g data-facility-paths>'+poly([[x-6,y+35,2],[x-6+84*scale,y+35,2],[x-6+84*scale,y+41,2],[x-6,y+41,2]],'#ded4b0');if(v>1)out+=poly([[x+37,y-6,2],[x+43,y-6,2],[x+43,y-6+78*(v-1),2],[x+37,y-6+78*(v-1),2]],'#ded4b0');out+='</g>';
  if(v>0){out+='<g data-facility-trees>';for(const [a,b] of [[5,9],[34,11],[65,24],[13,59],[66,63]])out+=tree(x+a,y+b,treeHeight,crown);if(v>1){out+=tree(x+42,y+65,treeHeight*.8,crown);out+=tree(x+68,y-1,treeHeight*.85,crown)}out+='</g>'}
  if(roof){out+='<g data-facility-amenities opacity="'+roofAmount+'">'+box(x+38,y+45,0,19,4,8,'#d0aa70');if(v>1)out+=box(x+7,y+42,0,16,4,8,'#d0aa70')+poly([[x+44,y+14,2],[x+65,y+14,2],[x+65,y+29,2],[x+44,y+29,2]],'#84b9b6');out+='</g>'}
 }
 if(animation&&p<1){
  if(['lab','data','market','show'].includes(type))out+=construction(x,y,Math.floor(floorCount),Math.max(1,facilityProfile(type,level).floors),p);
  else{out+='<g data-growth-fence>';for(let n=0;n<6;n++)out+=box(x-7+n*15,y+77,0,10,2,8,'#d2bb86');out+='</g>';if(type==='park')out+=box(x+69,y+59,0,8,10,5,'#90aaa2')}
 }
 if(animation&&p>=.93&&p<1)out+=poly([[x-10,y-10,2],[x+82,y-10,2],[x+82,y+76,2],[x-10,y+76,2]],'none','stroke="#d8b46b" stroke-width="3" opacity="'+Math.sin((p-.93)/.07*Math.PI)*.65+'"');
 return out;
}
