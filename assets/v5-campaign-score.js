/* Original score: City on the Move. D major, 120 BPM, 32 bars / 64 seconds.
   No samples, lyrics, external assets, or use of the game's random generator. */
const MayorScore = (() => {
  const beat=.5, duration=64;
  const chords={D:[50,57,62,66],G:[43,55,59,66],Bm:[47,54,59,62],A:[45,57,61,64],Fs:[42,54,57,62],Em:[40,55,59,62],Fm:[42,54,57,61]};
  const progression=['D','G','Bm','A','D','A','Bm','G','Fs','Em','G','A','Bm','G','D','A','D','Em','Fm','G','Bm','G','D','A','G','Fs','Em','A','Bm','G','A','D'];
  // Newly composed eight-bar brass refrain; beat positions include syncopated rests.
  const hook=[[[0,66,.5],[.75,69,.5],[1.5,71,.75],[3,69,.5]],[[0,74,.75],[1,71,.5],[2,69,.75],[3.25,66,.5]],[[0,66,.5],[1,69,.5],[1.75,73,.75],[3,71,.5]],[[.5,69,.75],[2,66,.5],[3,64,.75]],[[0,66,.75],[1.25,69,.5],[2,74,.75],[3,73,.5]],[[0,71,.5],[.75,69,.5],[1.5,67,.75],[3,66,.5]],[[0,64,.5],[1,66,.5],[2,69,1]],[[0,67,.5],[1,64,.75],[2.5,61,.5],[3.25,64,.5]]];
  function plan(){
    const notes=[];const add=(bar,t,kind,n,d,v=.8)=>notes.push({at:(bar*4+t)*beat,kind,n,d:d*beat,v});
    progression.forEach((key,bar)=>{
      const c=chords[key],full=bar>=4&&bar<28;
      [0,1.5,2,3.5].forEach((t,j)=>c.slice(1).forEach((n,k)=>add(bar,t+k*.027,'guitar',n+(j%2?12:0),1.3,j%2?.43:.68)));
      [0,1,2,3].forEach((t,j)=>add(bar,t,'bass',(j===2?c[0]+7:c[0])+(j===3&&bar%4===3?12:0),.76,.82));
      [0,2].forEach(t=>add(bar,t,'kick',0,.4,full?.9:.65));
      [1,3].forEach(t=>{add(bar,t,'snare',0,.32,full?.7:.4);if(full)add(bar,t+.025,'clap',0,.2,.38)});
      for(let t=0;t<4;t+=.5)add(bar,t,'hat',0,.12,t%1?.3:.42);
      if(bar%4===3) [2.5,3,3.5].forEach((t,j)=>add(bar,t,'snare',0,.22,.3+j*.12));
      if(full){
        const melody=hook[(bar-4+8)%8];
        melody.forEach(([t,n,d])=>add(bar,t,bar>=12&&bar<16?'keys':'brass',n,d,.76));
        if(bar>=16&&bar<24) [0,2].forEach((t,j)=>add(bar,t,'keys',c[1]+12+j*0,.7,.35));
      }else{
        [0,1.5,2.5].forEach((t,j)=>add(bar,t,'keys',c[1+j%3]+12,.7,.6));
      }
      if(bar>=16)c.slice(1).forEach(n=>add(bar,0,'pad',n,3.8,.24));
    });
    return notes.sort((a,b)=>a.at-b.at);
  }
  function setup(ctx,dest=ctx.destination){
    let seed=21971;const rnd=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296*2-1};
    const master=ctx.createGain(),compressor=ctx.createDynamicsCompressor(),dry=ctx.createGain(),send=ctx.createGain(),reverb=ctx.createConvolver(),wet=ctx.createGain();
    master.gain.value=.25;compressor.threshold.value=-18;compressor.knee.value=18;compressor.ratio.value=3;compressor.attack.value=.01;compressor.release.value=.2;
    dry.connect(master);send.connect(reverb);reverb.connect(wet);wet.gain.value=.12;wet.connect(master);master.connect(compressor);compressor.connect(dest);
    const ir=ctx.createBuffer(2,Math.floor(ctx.sampleRate*.7),ctx.sampleRate);
    for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<d.length;i++)d[i]=rnd()*Math.pow(1-i/d.length,2.6)*.45}reverb.buffer=ir;
    const noise=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);const nd=noise.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=rnd();
    const real=new Float32Array([0,0,0,0,0,0]),imag=new Float32Array([0,1,.44,.2,.1,.04]);
    return {ctx,master,dry,send,noise,rnd,plucks:new Map(),horn:ctx.createPeriodicWave(real,imag)};
  }
  const hz=n=>440*Math.pow(2,(n-69)/12);
  function note(m,e,time){
    const c=m.ctx,t=Math.max(time,c.currentTime),g=c.createGain(),f=c.createBiquadFilter();
    const length=e.kind==='pad'?e.d+.15:e.kind==='guitar'?1.15:e.d+.25;
    g.gain.setValueAtTime(.00001,t);f.type='lowpass';f.frequency.value=5000;g.connect(f);f.connect(m.dry);
    if(['guitar','keys','brass','pad'].includes(e.kind))f.connect(m.send);
    const release=()=>{g.disconnect();f.disconnect()};
    function osc(type,freq,amp,attack=.008){const o=c.createOscillator();o.type=type;o.frequency.setValueAtTime(freq,t);o.connect(g);g.gain.linearRampToValueAtTime(amp*e.v,t+attack);g.gain.exponentialRampToValueAtTime(.00001,t+length);o.start(t);o.stop(t+length+.02);o.onended=release;return o}
    function nsource(highpass,amp,decay){const s=c.createBufferSource();s.buffer=m.noise;const h=c.createBiquadFilter();h.type='highpass';h.frequency.value=highpass;s.connect(h);h.connect(g);g.gain.linearRampToValueAtTime(amp*e.v,t+.003);g.gain.exponentialRampToValueAtTime(.00001,t+decay);s.start(t);s.stop(t+decay+.01);s.onended=()=>{h.disconnect();release()}}
    if(e.kind==='guitar'){
      if(!m.plucks.has(e.n)){
        const b=c.createBuffer(1,Math.ceil(c.sampleRate*1.2),c.sampleRate),d=b.getChannelData(0),size=Math.max(2,Math.round(c.sampleRate/hz(e.n))),ring=new Float32Array(size);
        for(let i=0;i<size;i++)ring[i]=m.rnd();for(let i=0;i<d.length;i++){const j=i%size;d[i]=ring[j];ring[j]=.497*(ring[j]+ring[(j+1)%size])}m.plucks.set(e.n,b);
      }
      const s=c.createBufferSource();s.buffer=m.plucks.get(e.n);s.connect(g);g.gain.linearRampToValueAtTime(.23*e.v,t+.004);g.gain.exponentialRampToValueAtTime(.00001,t+length);s.start(t);s.stop(t+length);s.onended=release;
    }else if(e.kind==='bass'){f.frequency.value=520;osc('triangle',hz(e.n-12),.15)}
    else if(e.kind==='brass'){f.frequency.value=2100;const o=osc('sine',hz(e.n),.075,.025);o.setPeriodicWave(m.horn)}
    else if(e.kind==='keys'){f.frequency.value=3400;osc('sine',hz(e.n),.09);}
    else if(e.kind==='pad'){f.frequency.value=700;osc('triangle',hz(e.n),.035,.15)}
    else if(e.kind==='kick'){f.frequency.value=800;const o=osc('sine',125,.32,.003);o.frequency.exponentialRampToValueAtTime(43,t+.14)}
    else if(e.kind==='snare'){f.frequency.value=6800;nsource(850,.105,.13)}
    else if(e.kind==='hat'){f.frequency.value=13000;nsource(7500,.04,.047)}
    else if(e.kind==='clap'){f.frequency.value=4500;nsource(1400,.065,.09)}
  }
  return Object.freeze({duration,beat,plan,setup,note,title:'City on the Move'});
})();
