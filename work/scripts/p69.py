# v69 gameplay patch: loops, wingmen landing, stronger ace, space visibility, sounds, auto sprint/afterburner
import sys
src,dst=sys.argv[1],sys.argv[2]
s=open(src).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]);s=s.replace(a,b)

# ---------- 1. flight: full loops ----------
# outside flight (on foot, vehicles, the hangar, scripted landings) pitch stays capped; in flight it is free, and while upside down left/right swap so the stick still turns toward the pilot's own left/right
rep("const look=(dx,dy,s)=>{s*=CFG.sens;yaw-=dx*s;pitch=Math.max(-1.45,Math.min(1.45,pitch-dy*s*(CFG.inv?-1:1)))};",
    "const flyFree=()=>!!FLY&&FLY.ph!=='hangar'&&FLY.ph!=='arrive',pcap=p=>flyFree()?p:Math.max(-1.45,Math.min(1.45,p)),ysg=()=>flyFree()&&Math.cos(pitch)<0?-1:1;\n"
    "const look=(dx,dy,s)=>{s*=CFG.sens;yaw-=dx*s*ysg();pitch=pcap(pitch-dy*s*(CFG.inv?-1:1))};")
rep("yaw-=ax(2)*3.2*k;pitch=Math.max(-1.45,Math.min(1.45,pitch-ax(3)*2.4*k*(CFG.inv?-1:1)));",
    "yaw-=ax(2)*3.2*k*ysg();pitch=pcap(pitch-ax(3)*2.4*k*(CFG.inv?-1:1));")
rep("if(keys.KeyA)yaw+=1.3*dt;if(keys.KeyD)yaw-=1.3*dt;if(keys.ArrowLeft)yaw+=1.3*dt;if(keys.ArrowRight)yaw-=1.3*dt;if(keys.ArrowUp)pitch=Math.min(1.45,pitch+dt);if(keys.ArrowDown)pitch=Math.max(-1.45,pitch-dt);",
    "{const yg=ysg();if(keys.KeyA)yaw+=1.3*dt*yg;if(keys.KeyD)yaw-=1.3*dt*yg;if(keys.ArrowLeft)yaw+=1.3*dt*yg;if(keys.ArrowRight)yaw-=1.3*dt*yg;if(keys.ArrowUp)pitch=pcap(pitch+dt);if(keys.ArrowDown)pitch=pcap(pitch-dt)}")
# a half loop leaves the shuttle upside down facing back. The same attitude is heading+pi, pitch pi-p, roll+pi: once the stick is
# left alone for a moment (or a scripted phase takes over) swap to that form, and the shuttle and camera roll back upright (an Immelmann)
rep("function flyTick(dt){const S=FLY;S.t+=dt;",
    "function flyUpright(S,dt){const TAU=2*Math.PI;if(pitch>Math.PI){pitch-=TAU;S.p-=TAU}else if(pitch<-Math.PI){pitch+=TAU;S.p+=TAU}\n"
    "  if(Math.abs(pitch-(S.lp===undefined?pitch:S.lp))>1e-4)S.pIdle=0;else S.pIdle=(S.pIdle||0)+dt;\n"
    "  if(Math.cos(S.p)<0&&Math.cos(pitch)<0&&(S.pIdle>.8||!flyFree())){S.h+=Math.PI;yaw+=Math.PI;S.p=(S.p>0?Math.PI:-Math.PI)-S.p;pitch=(pitch>0?Math.PI:-Math.PI)-pitch;S.roll+=Math.PI;S.camR=(S.camR||0)+Math.PI*.8;S.pIdle=0}\n"
    "  S.lp=pitch;if(S.camR){S.camR*=Math.exp(-dt*2.6);if(Math.abs(S.camR)<1e-3)S.camR=0}}\n"
    "function flyTick(dt){const S=FLY;S.t+=dt;flyUpright(S,dt);")
rep("S.roll+=(c1(dh*1.6)*.95-S.roll)*Math.min(1,dt*4);",
    "S.roll+=(c1(dh*1.6*(Math.cos(S.p)<0?-1:1))*.95-S.roll)*Math.min(1,dt*(Math.abs(S.roll)>1.2?2.6:4));")
rep("cam.rotation.set(pitch+(Math.random()-.5)*sh*.05,yaw+(Math.random()-.5)*sh*.05,S.roll*.2);",
    "cam.rotation.set(pitch+(Math.random()-.5)*sh*.05,yaw+(Math.random()-.5)*sh*.05,S.roll*.2+(S.camR||0));")

# ---------- 2. auto sprint / afterburner (Settings) ----------
rep("const CFG={q:(portrait||matchMedia('(pointer: coarse)').matches)?'low':'high',sens:1,vol:0.8,inv:false,fov:74};",
    "const CFG={q:(portrait||matchMedia('(pointer: coarse)').matches)?'low':'high',sens:1,vol:0.8,inv:false,fov:74,auto:true};")
rep('<label for="setInv">Invert vertical aim <input id="setInv" type="checkbox"></label>',
    '<label for="setInv">Invert vertical aim <input id="setInv" type="checkbox"></label>\n    <label for="setAuto">Automatic sprint and afterburner <input id="setAuto" type="checkbox"></label>')
rep("$('setInv').checked=!!CFG.inv;","$('setInv').checked=!!CFG.inv;$('setAuto').checked=CFG.auto!==false;")
rep("$('setInv').addEventListener('change',e=>{CFG.inv=e.target.checked;applyCfg()});",
    "$('setInv').addEventListener('change',e=>{CFG.inv=e.target.checked;applyCfg()});\n$('setAuto').addEventListener('change',e=>{CFG.auto=e.target.checked;applyCfg()});")
rep("sprintT=f>0.5&&!firing&&!padFire?sprintT+dt:0;",
    "sprintT=f>0.5&&!firing&&!padFire&&(CFG.auto!==false||keys.ShiftLeft||keys.ShiftRight)?sprintT+dt:0;")
rep("WASD move (auto sprint)","WASD move (auto sprint, or hold Shift when it is off in Settings)")
# afterburner: with the option on it lights whenever the throttle is held at full; it drops out when the tank runs dry and comes back at a third
rep("const near=!S.noHull&&nearHull(S.pos),bk=(keys.ShiftLeft||keys.ShiftRight)&&S.boost>0.02&&!near;",
    "const near=!S.noHull&&nearHull(S.pos);if(S.boost<.04)S.abLock=1;else if(S.boost>.33)S.abLock=0;\n"
    "  const autoAB=CFG.auto!==false&&!S.abLock&&S.ph!=='hangar'&&S.ph!=='dock'&&S.ph!=='arrive'&&(keys.KeyW||mvY<-.35)&&S.thr>.98,bk=((keys.ShiftLeft||keys.ShiftRight)||autoAB)&&S.boost>0.02&&!near;")

# ---------- 3. wingmen land beside you at Meridian ----------
rep("bay:P(0,RIM+330,34),land:P(0,RIM+310,2.6)}}",
    "bay:P(0,RIM+330,34),land:P(0,RIM+310,2.6),wland:[P(0,RIM+270,2.6,-12),P(0,RIM+270,2.6,12)]}}")
rep("function wingTick(S,dt){if(!S.wing)return;const fw=WV1.set(-Math.sin(S.h),0,-Math.cos(S.h)),rt=WV2.set(Math.cos(S.h),0,-Math.sin(S.h));\n  for(const w of S.wing){",
    "function wingLand(S,w,i,dt){const M=S.meri,slot=WV3.copy(M.wland[i]).applyMatrix4(M.g.matrixWorld),hov=fv4.copy(slot);hov.y+=28;if(!w.ld&&w.p.distanceTo(hov)<6)w.ld=1;\n"
    "  const tg=w.ld?slot:hov,to=fv5.subVectors(tg,w.p),d=to.length(),v=w.ld?Math.min(9,2+d*.8):Math.min(110,8+d*1.1);if(d>.05)w.p.addScaledVector(to,Math.min(d,v*dt)/d);w.spd=v;\n"
    "  const r=M.g.rotation.y;w.dir.lerp(fv6.set(-Math.sin(r),0,-Math.cos(r)),Math.min(1,dt*1.5)).normalize();w.g.lookAt(w.p.x-w.dir.x,w.p.y-w.dir.y,w.p.z-w.dir.z);shuttleAnim(w.g,w.ld&&d<1?0:30,false,0,8,1,w.ld&&d<14,dt)}\n"
    "const fv4=new T.Vector3(),fv5=new T.Vector3(),fv6=new T.Vector3();\n"
    "function wingTick(S,dt){if(!S.wing)return;const fw=WV1.set(-Math.sin(S.h),0,-Math.cos(S.h)),rt=WV2.set(Math.cos(S.h),0,-Math.sin(S.h)),LD=S.ph==='arrive'&&S.meri&&S.meri.wland;let wi=0;\n"
    "  for(const w of S.wing){if(LD){wingLand(S,w,wi++,dt);continue}")
# in formation, slow and close to a ship, they hold above you instead of below
rep("want.copy(S.pos).addScaledVector(rt,w.s*22).addScaledVector(fw,16);want.y-=3;",
    "want.copy(S.pos).addScaledVector(rt,w.s*22).addScaledVector(fw,16);want.y+=S.spd<45?8:-3;")
# give them time to settle before the stage ends
rep("if(S.endT>4&&!commCur&&!COMMS.length&&!VOICE.busy||S.endT>30){flyStageDone();return true}}",
    "if(S.endT>7&&!commCur&&!COMMS.length&&!VOICE.busy||S.endT>30){flyStageDone();return true}}")

# ---------- 4. the ace: a real boss ----------
rep("ace:[140,8,175]","ace:[1000,8,175]")
rep("else if(e.kind==='ace'){const A=e.ace||(e.ace={mt:5});A.mt-=dt;",
    "else if(e.kind==='ace'){const A=e.ace||(e.ace={mt:5,ph:0,jt:0,jk:2,gt:2,gb:0,gbt:0,jd:new T.Vector3()});A.mt-=dt;A.jk-=dt;A.jt-=dt;A.gt-=dt;A.gbt-=dt;\n"
    "      // at two thirds and one third health: two interceptors join, a missile comes at once, and the ace flies faster\n"
    "      {const ph=e.hp<e.max/3?2:e.hp<e.max*2/3?1:0;if(ph>A.ph){A.ph=ph;e.sp=175+ph*30;for(let k=0;k<2;k++)flyEnemy('int',e.p.x+(Math.random()-.5)*400,e.p.y+(Math.random()-.5)*150,e.p.z+(Math.random()-.5)*400);A.mt=Math.min(A.mt,.8);say(ph===1?'The ace calls in two interceptors':'The ace is hurt. Missiles incoming, keep turning',3)}}\n"
    "      // when you line up behind it, it jinks hard to one side\n"
    "      {cam.getWorldDirection(ACEV);const tv=fv6.subVectors(e.p,S.pos).normalize();if(A.jk<=0&&d<1100&&ACEV.dot(tv)>.985){A.jk=1.4+Math.random()*1.2;A.jt=.9;A.jd.crossVectors(e.dir,fUp.set(Math.random()-.5,Math.random()-.5,Math.random()-.5)).normalize()}}")
rep("e.dir.lerp(fv2,Math.min(1,dt*1.8)).normalize();e.p.addScaledVector(e.dir,e.sp*dt);\n      // heavy cannon",
    "if(A.jt>0)fv2.addScaledVector(A.jd,1.1).normalize();e.dir.lerp(fv2,Math.min(1,dt*(A.jt>0?3.2:1.8))).normalize();e.p.addScaledVector(e.dir,e.sp*dt);\n"
    "      // twin guns: short bursts whenever it has you in front\n"
    "      if(e.st==='attack'&&d<750&&e.dir.dot(fv5.copy(to).divideScalar(d))>.97&&A.gt<=0){A.gt=1.1+Math.random()*.6;A.gb=6}\n"
    "      if(A.gb>0&&A.gbt<=0){A.gbt=.08;A.gb--;const ld=fv5.copy(to).addScaledVector(S.vel,d/600).normalize();ld.x+=(Math.random()-.5)*.025;ld.y+=(Math.random()-.5)*.025;ld.normalize();flyShot(e.p.clone().addScaledVector(e.dir,6),ld,600,FBOLT,4,.3,5,false)}\n"
    "      // heavy cannon")
rep("if(e.st==='attack'&&d<1000&&e.dir.dot(fv2.copy(to).divideScalar(d))>.96&&e.cd<=0){e.cd=2.4;e.burst=2}",
    "if(e.st==='attack'&&d<1000&&e.dir.dot(fv2.copy(to).divideScalar(d))>.96&&e.cd<=0){e.cd=2.2;e.burst=3}")
rep("S.shots.push({g,p:g.position,v:ld.clone().multiplyScalar(420),t:4,dmg:14,mine:false,prev:g.position.clone()});sfx('spit')}",
    "S.shots.push({g,p:g.position,v:ld.clone().multiplyScalar(420),t:4,dmg:20,mine:false,prev:g.position.clone()});gun(GUNS.ace)}")
rep("if(A.mt<=0&&d<1800){A.mt=9+Math.random()*3;aceMissile(S,e)}}",
    "if(A.mt<=0&&d<1800){A.mt=(A.ph?7:9)+Math.random()*3;aceMissile(S,e)}}")
rep("function aceMissile(S,e){","const ACEV=new T.Vector3();\nfunction aceMissile(S,e){")

# ---------- 5. space: see the enemies ----------
# the ice moon was a bright flat white that drowned the grey fighters; tone it down
rep("const planet=mesh(new T.SphereGeometry(1,96,64),bas({map:land,color:0x969696,fog:false}),R,R,R);",
    "const planet=mesh(new T.SphereGeometry(1,96,64),bas({map:land,color:0x5c6066,fog:false}),R,R,R);")
# every enemy ship carries a red marker light that stays a few pixels wide at any range, drawn solid so it shows over bright ice too
rep("const e={kind,g,p:g.position,dir,hp:K[0],max:K[0],r:K[1],sp:K[2],st:'attack',t:0,cd:1+Math.random()*2,burst:0,bt:0,bdir:new T.Vector3(),flash:0};FLY.en.push(e);return e}",
    "const e={kind,g,p:g.position,dir,hp:K[0],max:K[0],r:K[1],sp:K[2],st:'attack',t:0,cd:1+Math.random()*2,burst:0,bt:0,bdir:new T.Vector3(),flash:0};FLY.en.push(e);\n"
    "  if(kind!=='mine'){const b=new T.Sprite(BEACM||(BEACM=new T.SpriteMaterial({map:glowTex,color:0xff2a1a,depthWrite:false,transparent:true,fog:false})));b.renderOrder=7;g.add(b);e.bc=b}return e}\n"
    "let BEACM=null;function beaconTick(S){for(const e of S.en)if(e.bc){const d=e.p.distanceTo(cam.position),k=Math.max(2.5,d*.011)/(e.g.scale.x||1);e.bc.scale.set(k,k,1)}}")
rep("function flyHud(){const S=FLY;","function flyHud(){const S=FLY;beaconTick(S);")
rep(".tg{position:absolute;width:26px;height:26px;margin:-13px 0 0 -13px;border:1.5px solid rgba(255,80,60,.85);box-sizing:border-box}",
    ".tg{position:absolute;width:28px;height:28px;margin:-14px 0 0 -14px;border:2px solid #ff4a36;box-sizing:border-box;box-shadow:0 0 0 1px rgba(0,0,0,.55),inset 0 0 0 1px rgba(0,0,0,.45),0 0 8px rgba(255,60,40,.55)}")
rep(".tg i{position:absolute;left:50%;top:100%;transform:translateX(-50%);font-style:normal;font-size:8px;color:rgba(255,140,120,.95);white-space:nowrap;margin-top:2px}",
    ".tg i{position:absolute;left:50%;top:100%;transform:translateX(-50%);font-style:normal;font-size:9px;font-weight:700;color:#ff8a76;white-space:nowrap;margin-top:2px;text-shadow:0 0 3px #000,0 0 2px #000}")

# ---------- 6. sound ----------
# all sound effects go through one compressor bus, so they can be louder without clipping; guns are built from a noise crack,
# a filtered noise body and a pitched thump instead of a single beep
rep("let ac=null,muted=false;\nfunction tone(type,f0,f1,dur,vol,delay=0){if(!ac||muted)return;const t=ac.currentTime+delay,o=ac.createOscillator(),g=ac.createGain();",
    "let ac=null,muted=false,SBUS=null,NZB=null;\n"
    "function sbus(){if(SBUS)return SBUS;const c=ac.createDynamicsCompressor();c.threshold.value=-16;c.knee.value=10;c.ratio.value=5;c.attack.value=.002;c.release.value=.14;const g=ac.createGain();g.gain.value=1.7;const L=ac.createDynamicsCompressor();L.threshold.value=-2;L.knee.value=0;L.ratio.value=20;L.attack.value=.001;L.release.value=.08;c.connect(g).connect(L).connect(ac.destination);c.out=g;SBUS=c;\n"
    "  const b=ac.createBuffer(1,ac.sampleRate,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;NZB=b;return c}\n"
    "const GUNS={ar:{vol:.34,len:.13,lp:3200,f0:165,f1:50,hp:2600},pistol:{vol:.42,len:.17,lp:2800,f0:200,f1:55,hp:2200,mech:2600},cannon:{vol:.26,len:.085,lp:2300,f0:140,f1:60,crack:.018},\n"
    "  gl:{vol:.42,len:.3,lp:900,f0:105,f1:38,hp:900,th:1.3},shotgun:{vol:.6,len:.36,lp:1500,f0:115,f1:34,crack:.04,th:1.3},snipe:{vol:.55,len:.55,lp:4200,f0:150,f1:38,crack:.05,th:1.2},\n"
    "  shoot:{vol:.3,len:.12,lp:3000,f0:170,f1:60},fmg:{vol:.22,len:.075,lp:3400,f0:210,f1:80,crack:.016,hp:3000},mac:{vol:.8,len:.75,lp:1300,f0:95,f1:26,crack:.06,th:1.5},\n"
    "  ace:{vol:.28,len:.3,lp:1100,f0:120,f1:40},boom:{vol:.55,len:.9,lp:800,f0:80,f1:24,crack:.05,hp:900,th:1.2}};\n"
    "function gun(o){if(!ac||muted||!o)return;try{const B=sbus(),t=ac.currentTime,v=o.vol*CFG.vol,j=1+(Math.random()-.5)*.1,cr=o.crack||.03;\n"
    "  const n=ac.createBufferSource();n.buffer=NZB;n.playbackRate.value=j;const hp=ac.createBiquadFilter();hp.type='highpass';hp.frequency.value=o.hp||1800;const g1=ac.createGain();\n"
    "  g1.gain.setValueAtTime(v*.9,t);g1.gain.exponentialRampToValueAtTime(.0001,t+cr);n.connect(hp).connect(g1).connect(B);n.start(t,Math.random()*.5,cr+.02);\n"
    "  const n2=ac.createBufferSource();n2.buffer=NZB;n2.playbackRate.value=j;const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(o.lp,t);lp.frequency.exponentialRampToValueAtTime(Math.max(120,o.lp*.22),t+o.len);\n"
    "  const g2=ac.createGain();g2.gain.setValueAtTime(v,t);g2.gain.exponentialRampToValueAtTime(.0001,t+o.len);n2.connect(lp).connect(g2).connect(B);n2.start(t,Math.random()*.4,o.len+.02);\n"
    "  const os=ac.createOscillator();os.type='sine';os.frequency.setValueAtTime(o.f0*j,t);os.frequency.exponentialRampToValueAtTime(o.f1,t+o.len*.7);const g3=ac.createGain();\n"
    "  g3.gain.setValueAtTime(v*(o.th||1),t);g3.gain.exponentialRampToValueAtTime(.0001,t+o.len*.8);os.connect(g3).connect(B);os.start(t);os.stop(t+o.len);\n"
    "  if(o.mech)tone('square',o.mech,o.mech*.6,.02,.04,o.len*.4)}catch(e){}}\n"
    "function tone(type,f0,f1,dur,vol,delay=0){if(!ac||muted)return;const t=ac.currentTime+delay,o=ac.createOscillator(),g=ac.createGain();")
rep("g.gain.setValueAtTime(Math.max(0.0001,vol*CFG.vol),t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g).connect(ac.destination);o.start(t);o.stop(t+dur)}",
    "g.gain.setValueAtTime(Math.max(0.0001,vol*CFG.vol),t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g).connect(sbus());o.start(t);o.stop(t+dur)}")
rep("  if(k==='shoot')tone('sawtooth',900,200,.08,.05);","  if(k==='shoot'){gun(GUNS.shoot);tone('sawtooth',900,200,.06,.03)}")
rep("else if(k==='boom'){tone('triangle',140,30,.45,.2);tone('sawtooth',90,40,.3,.1)}","else if(k==='boom'){gun(GUNS.boom);tone('triangle',140,30,.45,.16)}")
rep("else if(k==='shotgun'){tone('sawtooth',300,60,.18,.08);tone('square',150,40,.12,.05)}","else if(k==='shotgun'){gun(GUNS.shotgun);tone('square',150,40,.1,.03)}")
rep("else if(k==='snipe'){tone('sawtooth',1800,200,.2,.08);tone('square',400,80,.15,.05)}","else if(k==='snipe'){gun(GUNS.snipe);tone('sawtooth',1800,200,.15,.04)}")
rep("else if(k==='ar'){tone('square',520,180,.05,.035);tone('sawtooth',220,90,.04,.02)}","else if(k==='ar')gun(GUNS.ar);")
rep("else if(k==='pistol'){tone('square',700,160,.08,.05);tone('triangle',300,80,.08,.04)}","else if(k==='pistol')gun(GUNS.pistol);")
rep("else if(k==='gl')tone('triangle',180,70,.22,.08);","else if(k==='gl'){gun(GUNS.gl);tone('triangle',180,70,.22,.05)}")
rep("else if(k==='cannon')tone('sawtooth',360,200,.03,.025);","else if(k==='cannon')gun(GUNS.cannon);")
# flight guns: the machine guns and the heavy cannon
rep("if(S.heat>=100){S.over=1.6;S.heat=100;say('Guns overheated',1)}tone('square',220,90,.05,.025)}",
    "if(S.heat>=100){S.over=1.6;S.heat=100;say('Guns overheated',1)}gun(GUNS.fmg)}")
rep("tone('sawtooth',90,30,.5,.25);tone('square',1600,200,.18,.08);if(!S.tipMac){S.tipMac=1}}",
    "gun(GUNS.mac);tone('square',1600,200,.18,.06);if(!S.tipMac){S.tipMac=1}}")
# engine: the old one was a bare sawtooth whose pitch was snapped every frame (the glitchy buzz). Now a soft low hum plus a band of
# rushing air (the swoosh) that opens up with speed, turning and the afterburner, all moved with smooth ramps
rep("function engineOff(){if(eng){try{eng.o.stop()}catch(e){}eng=null}}",
    "function engineOff(){if(eng){try{eng.o.stop();if(eng.n)eng.n.stop()}catch(e){}eng=null}}\n"
    "function engSet(f,g,nf,ng){if(!eng)return;const t=ac.currentTime,m=muted||state!=='playing'?0:1;eng.o.frequency.setTargetAtTime(f,t,.08);eng.g.gain.setTargetAtTime(g*m*CFG.vol,t,.08);\n"
    "  if(eng.n){eng.nf.frequency.setTargetAtTime(nf,t,.12);eng.ng.gain.setTargetAtTime(ng*m*CFG.vol,t,.1)}}")
rep("function engineOn(){if(!ac||eng)return;try{const o=ac.createOscillator(),g=ac.createGain();o.type='sawtooth';o.frequency.value=50;g.gain.value=0;o.connect(g).connect(ac.destination);o.start();eng={o,g}}catch(e){}}",
    "function engineOn(){if(!ac||eng)return;try{sbus();const o=ac.createOscillator(),g=ac.createGain(),lp=ac.createBiquadFilter();o.type='sawtooth';o.frequency.value=50;lp.type='lowpass';lp.frequency.value=380;g.gain.value=0;o.connect(lp).connect(g).connect(ac.destination);o.start();\n"
    "  const n=ac.createBufferSource();n.buffer=NZB;n.loop=true;const nf=ac.createBiquadFilter();nf.type='bandpass';nf.frequency.value=400;nf.Q.value=.7;const ng=ac.createGain();ng.gain.value=0;n.connect(nf).connect(ng).connect(ac.destination);n.start();eng={o,g,n,nf,ng}}catch(e){}}")
rep("if(!eng)engineOn();if(eng){eng.o.frequency.value=45+Math.abs(v.v)*(car?3:2.4);eng.g.gain.value=muted?0:0.03*CFG.vol}}",
    "if(!eng)engineOn();engSet(45+Math.abs(v.v)*(car?3:2.4),.05,300+Math.abs(v.v)*25,.012+Math.abs(v.v)*.0015)}")
rep("if(!eng)engineOn();if(eng){eng.o.frequency.value=38+S.spd*.55;eng.g.gain.value=muted?0:0.035*CFG.vol}",
    "if(!eng)engineOn();{const tr=Math.min(1,Math.abs(dh)*3+Math.abs(dp)*3),sp=S.spd/224;engSet(36+S.spd*.32,.05+(bk?.03:0),280+sp*1900+tr*700+(bk?600:0),.02+sp*.09+tr*.07+(bk?.07:0))}")
open(dst,'w').write(s);print('ok',len(s))
s=open(dst).read()
# space lighting: in flight the bright interior reflections are cut and exposure lowered a little, for contrast; restored on landing
rep("FLV.fn=scene.fog.near;FLV.ff=scene.fog.far;","FLV.fn=scene.fog.near;FLV.ff=scene.fog.far;if(FLV.env===undefined){FLV.env=scene.environmentIntensity;FLV.ex=renderer.toneMappingExposure}scene.environmentIntensity=FLV.env*.5;renderer.toneMappingExposure=FLV.ex*.9;")
rep("FLY=null;scene.fog.near=FLV.fn;scene.fog.far=FLV.ff;","FLY=null;if(FLV.env!==undefined){scene.environmentIntensity=FLV.env;renderer.toneMappingExposure=FLV.ex}scene.fog.near=FLV.fn;scene.fog.far=FLV.ff;")
open(dst,'w').write(s);print('ok2',len(s))
s=open(dst).read()
# while a radio voice is talking the guns dip a little, so the line can be heard
rep("MUS.g.gain.setTargetAtTime(muted||!musOn?0:CFG.vol*(state==='paused'?.2:.55)*(VOICE.busy?.4:1),now,.3);",
    "MUS.g.gain.setTargetAtTime(muted||!musOn?0:CFG.vol*(state==='paused'?.2:.55)*(VOICE.busy?.4:1),now,.3);if(SBUS&&SBUS.out)SBUS.out.gain.setTargetAtTime(VOICE.busy?1.15:1.7,now,.15);")
open(dst,'w').write(s);print('ok3',len(s))
