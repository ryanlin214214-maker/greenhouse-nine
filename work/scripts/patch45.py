p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
# ---------------- music ----------------
rep('<button id="mute" type="button">Sound on</button>','<button id="mute" type="button">Sound on</button>\n  <button id="mus" type="button">Music on</button>')
rep("$('mute').addEventListener('click',()=>{muted=!muted;$('mute').textContent=muted?'Sound off':'Sound on'});","$('mute').addEventListener('click',()=>{muted=!muted;$('mute').textContent=muted?'Sound off':'Sound on'});\n$('mus').addEventListener('click',()=>{musOn=!musOn;$('mus').textContent=musOn?'Music on':'Music off'});")
rep("function sfx(k){","""/* ---------- music: a step sequencer with four layers (pad, bass, drums, lead) that fade with what is happening ---------- */
let musOn=true;const MUS={g:null,t:0,step:0,bar:0,L:{},noise:null,mood:''};
const MOODM={intro:{bpm:76,pad:1,bass:0,drum:0,arp:.9},calm:{bpm:88,pad:.8,bass:0,drum:0,arp:.35},combat:{bpm:116,pad:.6,bass:1,drum:1,arp:.3},boss:{bpm:132,pad:.8,bass:1,drum:1,arp:1}};
const PROG=[[146.83,[0,3,7]],[116.54,[0,4,7]],[174.61,[0,4,7]],[130.81,[0,4,7]]],PROGB=[[146.83,[0,3,7]],[116.54,[0,4,7]],[98,[0,3,7]],[110,[0,4,7]]];
function musInit(){if(MUS.g)return;const g=MUS.g=ac.createGain();g.gain.value=0;g.connect(ac.destination);
  for(const k of['pad','bass','drum','arp']){const n=ac.createGain();n.gain.value=0;n.connect(g);MUS.L[k]=n}
  const b=ac.createBuffer(1,Math.floor(ac.sampleRate*.3),ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;MUS.noise=b;MUS.t=ac.currentTime+.1}
function mNote(dst,type,f,t,dur,vol,att,cut){const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(vol,t+(att||.01));g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  if(cut){const fl=ac.createBiquadFilter();fl.type='lowpass';fl.frequency.value=cut;o.connect(fl);fl.connect(g)}else o.connect(g);g.connect(dst);o.start(t);o.stop(t+dur+.05)}
function mNoise(dst,t,dur,vol,hp){const q=ac.createBufferSource(),g=ac.createGain(),f=ac.createBiquadFilter();q.buffer=MUS.noise;f.type='highpass';f.frequency.value=hp;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);q.connect(f);f.connect(g);g.connect(dst);q.start(t);q.stop(t+dur+.02)}
function mKick(dst,t,vol){const o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(42,t+.14);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+.22);o.connect(g);g.connect(dst);o.start(t);o.stop(t+.25)}
function musicTick(){if(!ac)return;try{musInit();const mood=INTRO.on?'intro':state!=='playing'&&state!=='paused'?'calm':mission&&mission.boss&&!mission.done?'boss':mission&&alive()>0?'combat':'calm',M=MOODM[mood],now=ac.currentTime;MUS.mood=mood;
  MUS.g.gain.setTargetAtTime(muted||!musOn?0:CFG.vol*(state==='paused'?.2:.55),now,.3);for(const k in MUS.L)MUS.L[k].gain.setTargetAtTime(M[k],now,.8);
  if(MUS.t<now-.3)MUS.t=now+.05;let guard=0;
  while(MUS.t<now+.18&&guard++<8){const t=MUS.t,sp=60/M.bpm/4,st=MUS.step,P=(mood==='boss'?PROGB:PROG)[MUS.bar%4],root=P[0],ch=P[1],fr=n=>root*Math.pow(2,n/12);
    if(st===0)for(const n of ch){mNote(MUS.L.pad,'sawtooth',fr(n),t,sp*16,.05,sp*3,650);mNote(MUS.L.pad,'sine',fr(n+12),t,sp*16,.03,sp*4)}
    if(st%2===0)mNote(MUS.L.bass,'sawtooth',root/2*(st%8===6?2:1),t,sp*1.7,.16,.005,380);
    if(st%4===0)mKick(MUS.L.drum,t,.5);if(st%8===4)mNoise(MUS.L.drum,t,.12,.16,1800);if(st%4===2)mNoise(MUS.L.drum,t,.04,.07,7000);if(mood==='boss'&&(st===10||st===14))mKick(MUS.L.drum,t,.35);
    if(mood==='boss'||mood==='combat')mNote(MUS.L.arp,'triangle',fr(ch[st%3]+12+(st%8>=4?12:0)),t,sp*.9,.07,.005);
    else if(st===0||st===6||st===12)mNote(MUS.L.arp,'sine',fr(ch[(st/6+MUS.bar)%3|0]+24),t,sp*10,.07,.01);
    MUS.step=(st+1)%16;if(MUS.step===0)MUS.bar++;MUS.t+=sp}}catch(e){}}
function sfx(k){""")
rep("  padTick(dt);lightTick(dt);\n","  padTick(dt);lightTick(dt);musicTick();\n")
# ---------------- cutscene: title card, animated machines ----------------
rep('<div class="cine" id="cine" hidden><div class="cfade" id="cineFade"></div>','<div class="cine" id="cine" hidden><div class="cfade" id="cineFade"></div><div class="ctitle" id="cineTitle"><b>Greenhouse Nine</b><i>Level 1 · The Thalassa encounter</i></div>')
rep(".cine span{",""".cine .ctitle{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;opacity:0;text-align:center}
.cine .ctitle b{font-family:var(--display);font-size:clamp(26px,6.5vw,60px);letter-spacing:.22em;text-transform:uppercase;color:var(--amber)}
.cine .ctitle i{font-family:var(--display);font-style:normal;font-size:clamp(10px,1.8vw,15px);letter-spacing:.3em;text-transform:uppercase;color:#e8f0ee}
.cine span{""")
rep("var INTRO={on:false,t:0,i:-1,grace:0,shots:[\n","var INTRO={on:false,t:0,i:-1,grace:0,actors:[],shots:[\n {d:4.5,title:1,p:[-700,2500,-500,-700,2500,-500],l:[700,4300,-2300,700,4300,-2300],text:''},\n")
rep("{d:7,p:[34,11.7,12,24,12.6,6],l:[-20,8,-10,-24,10,-12],","{d:8,act:'drones',p:[34,11.7,12,24,12.6,6],l:[-20,8,-10,-24,10,-12],")
rep("{d:6,p:[0,1.7,-46,0,1.7,-86],l:[0,1.8,-150,0,1.8,-150],","{d:7,act:'march',p:[0,1.5,-72,0,1.6,-58],l:[0,1.8,-150,0,1.8,-150],")
rep("function introEnd(){if(!INTRO.on)return;INTRO.on=false;introShow(false);","""function introActor(type,x,y,z){const m=model(type);m.g.position.set(x,y,z);scene.add(m.g);const gl=glow(0xff3030,type>=5?1.3:1.8,.01);gl.position.y=type>=5?1.55:0;m.g.add(gl);
  INTRO.actors.push({type,pos:m.g.position,g:m.g,rig:m.rig,parts:m.parts,wings:m.wings,gl,ph:Math.random()*6,mv:1,kick:0,ch:0,lunge:0,vy:0,dying:0,flash:0,burst:0,bt:0,ft:0,cd:1,spd:3,side:1,hp:1,aim:m.rig&&m.rig.aim,x0:x,y0:y,z0:z})}
function introClear(){for(const a of INTRO.actors)scene.remove(a.g);INTRO.actors.length=0}
function introEnd(){if(!INTRO.on)return;INTRO.on=false;introClear();introShow(false);""")
rep("if(INTRO.on){INTRO.on=false;introShow(false)}","if(INTRO.on){INTRO.on=false;introClear();introShow(false)}")
rep("if(i!==INTRO.i){INTRO.i=i;$('cineText').textContent=q.text}","""if(i!==INTRO.i){INTRO.i=i;$('cineText').textContent=q.text;introClear();
    if(q.act==='drones')for(const[ty,x,y,z]of[[0,-10,11,-6],[0,-2,13,2],[0,6,10,-3],[1,-16,9,3],[0,12,14,4],[1,2,8,-8],[0,-6,15,6],[0,16,11,-7]])introActor(ty,x,y,z);
    if(q.act==='march')for(const[ty,x,z]of[[5,-1.5,-104],[5,1.5,-107],[6,0,-111],[7,-3,-113],[10,3,-115],[5,-1.2,-118],[5,1.8,-121]])introActor(ty,x,0,z)}
  // machines: drones hang in the well and their lights go red part-way through; troopers march up the spine
  for(const a of INTRO.actors){if(q.act==='drones'){const k=Math.max(0,Math.min(1,(u-.4)/.25));a.pos.y=a.y0+Math.sin(time*1.3+a.ph)*.35;a.g.rotation.y=Math.atan2(cam.position.x-a.pos.x,cam.position.z-a.pos.z)*k+a.ph*(1-k);a.gl.material.opacity=k*.85;if(a.wings)for(const w of a.wings)w.rotation.y+=dt*30}
    else{a.pos.z=a.z0+t*3.2;a.gl.material.opacity=.8;if(a.rig){try{a.rig.anim(a,time,dt)}catch(err){a.rig=null}}}}
  $('cineTitle').style.opacity=q.title?Math.max(0,Math.min(1,t/1.2,(q.d-t)/1)):0;""")
rep("$('cineFade').style.opacity=Math.max(0,1-t/.7,1-(q.d-t)/.7)}","const fd=q.title?1:Math.max(0,1-t/.7,1-(q.d-t)/.7);$('cineFade').style.opacity=fd;$('cineText').style.opacity=1-fd}")
open(p,'w').write(s);print('ok')
