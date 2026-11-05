/* Audio preferences are separate from the version-2 game save. */
(() => {
 const key='absurd-mayor-audio-settings-v1',labels={
  zh:{play:'播放配樂',pause:'暫停配樂',volume:'音量',on:'配樂已播放',off:'配樂已暫停',error:'此瀏覽器暫時無法播放配樂',title:'V5.0 · 城市向前 — 原創競選配樂'},
  en:{play:'Play music',pause:'Pause music',volume:'Volume',on:'Music playing',off:'Music paused',error:'Music is unavailable in this browser',title:'V5.0 · City on the Move — original campaign music'},
  fr:{play:'Activer la musique',pause:'Mettre en pause',volume:'Volume',on:'Musique activée',off:'Musique en pause',error:'La musique est indisponible dans ce navigateur',title:'V5.0 · En avant, la ville — musique de campagne originale'},
  nl:{play:'Muziek afspelen',pause:'Muziek pauzeren',volume:'Volume',on:'Muziek speelt',off:'Muziek gepauzeerd',error:'Muziek is niet beschikbaar in deze browser',title:'V5.0 · De stad vooruit — originele campagnemuziek'}
 };
 let volume=28;try{const p=JSON.parse(localStorage.getItem(key));if(Number.isFinite(p?.volume))volume=Math.max(0,Math.min(100,p.volume))}catch(_){}
 let mix=null,wanted=false,timer=null,epoch=0,index=0,loop=0,error=false;const score=MayorScore.plan();
 const bar=document.createElement('section');bar.className='v5-audio-bar';bar.innerHTML='<button type="button" class="v5-music-button" data-music-toggle aria-pressed="false"></button><label class="v5-volume-label" for="v5-music-volume"></label><input id="v5-music-volume" type="range" min="0" max="100" step="1"><output id="v5-volume-value" for="v5-music-volume"></output><small id="v5-track-title"></small><span id="v5-music-status" class="v5-sr-only" role="status" aria-live="polite"></span>';
 document.querySelector('.hero').before(bar);const slider=bar.querySelector('input');slider.value=volume;
 const text=()=>labels[document.documentElement.lang==='zh-Hant'?'zh':document.documentElement.lang]||labels.en;
 function render(){const t=text();document.querySelectorAll('[data-music-toggle]').forEach(b=>{b.textContent=(wanted?'⏸ ':'♫ ')+(wanted?t.pause:t.play);b.setAttribute('aria-pressed',String(wanted));b.setAttribute('aria-describedby','v5-track-title')});bar.querySelector('label').textContent=t.volume;slider.setAttribute('aria-label',t.volume);slider.setAttribute('aria-valuetext',volume+'%');bar.querySelector('output').value=volume+'%';document.getElementById('v5-track-title').textContent=t.title;const message=error?t.error:wanted?t.on:t.off;const status=document.getElementById('v5-music-status');if(status.textContent!==message)status.textContent=message;status.className=error?'v5-audio-error':'v5-sr-only';}
 function tick(){if(!wanted||!mix||mix.ctx.state!=='running'||document.hidden)return;const now=mix.ctx.currentTime;
  // Never schedule a backlog after a browser interruption.
  if(epoch+loop*MayorScore.duration+score[index].at<now-.3){epoch=now+.04;index=0;loop=0}
  while(epoch+loop*MayorScore.duration+score[index].at<now+.22){MayorScore.note(mix,score[index],epoch+loop*MayorScore.duration+score[index].at);if(++index===score.length){index=0;loop++}}
 }
 async function start(){
  try{
   if(!mix){const A=window.AudioContext||window.webkitAudioContext;if(!A)throw Error('audio unavailable');mix=MayorScore.setup(new A());mix.master.gain.value=0;epoch=mix.ctx.currentTime+.05;}
   await mix.ctx.resume();if(!wanted){await mix.ctx.suspend();return}
   error=false;mix.master.gain.cancelScheduledValues(mix.ctx.currentTime);mix.master.gain.setValueAtTime(0,mix.ctx.currentTime);mix.master.gain.linearRampToValueAtTime(volume/100,mix.ctx.currentTime+.2);
   if(timer===null)timer=setInterval(tick,80);tick();render();
  }catch(_){wanted=false;error=true;if(timer!==null){clearInterval(timer);timer=null}render()}
 }
 function stop(){if(timer!==null){clearInterval(timer);timer=null}if(mix){const c=mix.ctx;mix.master.gain.cancelScheduledValues(c.currentTime);mix.master.gain.setValueAtTime(mix.master.gain.value,c.currentTime);mix.master.gain.linearRampToValueAtTime(0,c.currentTime+.12);setTimeout(()=>{if(!wanted)c.suspend().catch(()=>{})},160)}render()}
 document.addEventListener('click',e=>{if(!e.target.closest('[data-music-toggle]'))return;wanted=!wanted;error=false;render();if(wanted)start();else stop()});
 slider.addEventListener('input',()=>{volume=Number(slider.value);if(mix){mix.master.gain.cancelScheduledValues(mix.ctx.currentTime);mix.master.gain.setTargetAtTime(wanted?volume/100:0,mix.ctx.currentTime,.04)}try{localStorage.setItem(key,JSON.stringify({volume}))}catch(_){}render()});
 document.addEventListener('visibilitychange',()=>{if(!mix)return;if(document.hidden)mix.ctx.suspend().catch(()=>{});else if(wanted)start()});
 window.addEventListener('pagehide',()=>{wanted=false;if(timer!==null)clearInterval(timer);timer=null;if(mix)mix.ctx.suspend().catch(()=>{});render()});
 new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 new MutationObserver(render).observe(document.getElementById('modal'),{childList:true});render();
})();
