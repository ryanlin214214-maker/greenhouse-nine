p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
# ---------- classes no longer carry the super; the super is picked separately
rep("d:'Heavy shield · boost jump · shockwave surge'","d:'Heavy shield · boost jump · harder melee'")
rep("d:'Fast · double jump · overdrive surge'","d:'Fast · double jump · quick reloads'")
rep("d:'Glide · quick recharge · healing surge'","d:'Glide · fast shield recharge'")
rep("const dashV=new T.Vector3(),dashHit=new Set();","""const dashV=new T.Vector3(),dashHit=new Set();
const SUPERS=[{n:'Ember Ronin',short:'RONIN',d:'20 s fire samurai · flaming sword waves · half damage taken',dur:20},
  {n:'Glacier Slam',short:'GLACIER',d:'Leap and slam · freezes the area · frost aura 10 s',dur:10},
  {n:'Voltaic Tempest',short:'TEMPEST',d:'10 s of chain lightning that leaps between machines',dur:10}];
let SUPK=0;try{SUPK=Math.max(0,Math.min(2,+localStorage.getItem('gh9-super')||0))}catch(e){}
let superT=0,superKind=-1,cineT=0,cineD=1.6,cineK=0,cineFx=0,frostTick=0,voltTick=0,waves=[],bolts=[];""")
# ---------- player body for third-person super animations (walker variant 7)
rep("root.scale.setScalar([1,1.45,.78,1,1.1,.85,1][v])","root.scale.setScalar([1,1.45,.78,1,1.1,.85,1,1.05][v])")
rep("const A1=[MAT.armor,MAT.bruteA,MAT.stalkA,MAT.snipA,MAT.shieldA,MAT.detA,MAT.rocketA][v],A2=MAT.armorD,AM=MAT.amber,EY=v>=2?MAT.eye:MAT.eyeA",
    "const A1=[MAT.armor,MAT.bruteA,MAT.stalkA,MAT.snipA,MAT.shieldA,MAT.detA,MAT.rocketA,MAT.playerA][v],A2=MAT.armorD,AM=MAT.amber,EY=v===7?MAT.strip:v>=2?MAT.eye:MAT.eyeA")
rep("MAT.shieldA=std({color:0x3a5a80","MAT.playerA=std({color:0xc8ccce,roughness:.4,metalness:.5});MAT.shieldA=std({color:0x3a5a80")
rep("/* ---------- combat ---------- */","""/* ---------- supers ---------- */
const pb=new T.Group();scene.add(pb);pb.visible=false;const pbR=walkerRig(pb,7),pE={mv:0,vy:0,kick:0,ph:0,crouch:0,jet:0,burst:0,ch:0,ft:0,pos:new T.Vector3()};
const pbSword=new T.Group();pbR.segs.arms[1][1].add(pbSword);pbSword.position.set(0,-.38,.02);
{const bm=bas({color:0xff8a3a,transparent:true,opacity:.95,blending:T.AdditiveBlending,depthWrite:false});pbSword.add(mesh(GEO.box,MAT.gunD,.05,.05,.24,0,0,.05),mesh(GEO.box,bm,.05,.1,1.5,0,0,.9),glow(0xff8a3a,2.4,.7))}
const pbAura=new T.Group();pb.add(pbAura);
for(let i=0;i<10;i++){const a=i/10*6.283,c=mesh(GEO.cone,bas({color:i%2?0xff7a2a:0xffc040,transparent:true,opacity:.7,blending:T.AdditiveBlending,depthWrite:false}),.18,1.4,.18,Math.cos(a)*.55,-.2,Math.sin(a)*.55);pbAura.add(c)}
pbAura.add(glow(0xff8a3a,5,.6));
const pbFrost=glow(0x8fe6ff,6,.7),pbVolt=glow(0xc9a6ff,6,.8);pb.add(pbFrost,pbVolt);
const voltMat=new T.LineBasicMaterial({color:0xd8c0ff,transparent:true,blending:T.AdditiveBlending,depthWrite:false});
function zap(a,b){const pts=[];const n=7;for(let i=0;i<=n;i++){const t=i/n;pts.push(new T.Vector3(a.x+(b.x-a.x)*t+(i&&i<n?(Math.random()-.5)*.9:0),a.y+(b.y-a.y)*t+(i&&i<n?(Math.random()-.5)*.9:0),a.z+(b.z-a.z)*t+(i&&i<n?(Math.random()-.5)*.9:0)))}
  const g=new T.Line(new T.BufferGeometry().setFromPoints(pts),voltMat);scene.add(g);bolts.push({g,t:.14})}
function surge(){if(state!=='playing'||superQ<100||veh||cineT>0||superT>0)return;superQ=0;cineK=SUPK;cineT=cineD=1.6;cineFx=0;firing=false;reloadT=0;
  say(SUPERS[SUPK].n,1.8,['#ff8a3a','#8fe6ff','#c9a6ff'][SUPK]);sfx('nova');pb.visible=true;pbSword.visible=SUPK===0;pbAura.visible=SUPK===0;pbFrost.visible=SUPK===1;pbVolt.visible=SUPK===2;if(pbR.segs.gun)pbR.segs.gun.visible=SUPK!==0}
function startSuper(K){const k=1+0.1*(power()-1);superKind=K;superT=SUPERS[K].dur;shield=shMax;novaA=.8;
  if(K===0){hp=Math.max(hp,100);say('Ember Ronin · click or melee to slash',2,'#ff8a3a')}
  if(K===1){const f=new T.Vector3(pos.x,pos.y+.3,pos.z);blast(f,12,14*k,0,0x8fe6ff);ringFx(f,16,0x8fe6ff);if(!reduced)shake=.35;
    for(const e of enemies)if(!e.dying&&e.pos.distanceTo(f)<16&&e.type!==3){e.slowT=6;sparkle(e.pos,0xdff8ff,6,4)}}
  if(K===2)voltTick=0}
function endSuper(){superT=0;superKind=-1}
function roninSlash(){const k=1+0.1*(power()-1);swordT=.45;sfx('sword');
  {const m=bas({color:0xff8a3a,transparent:true,opacity:.85,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}),g=new T.Mesh(new T.RingGeometry(.85,1.1,32,1,0,Math.PI*.9),m);g.position.set(0,-.05,-2.2);cam.add(g);camFx.push({g,m,t:0,d:.3,r0:.4,dr:-2.6})}
  cam.getWorldDirection(tmp);tmp.y=0;tmp.normalize();
  for(const e of enemies){if(e.dying)continue;tmp2.copy(e.pos).sub(eye);const d=tmp2.length()||1;tmp2.y=0;const hd=tmp2.length()||1;if(d<7+e.r&&tmp2.dot(tmp)/hd>.1&&los(eye,e.pos)){damage(e,9*k,2);sparkle(e.pos,0xff8a3a,6,5)}}
  const m=bas({color:0xff7a2a,transparent:true,opacity:.9,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}),g=new T.Group(),c=new T.Mesh(new T.RingGeometry(1.4,2,24,1,0,Math.PI),m);c.rotation.x=-Math.PI/2;g.add(c,glow(0xff8a3a,4,.6));
  g.position.set(eye.x,eye.y-.4,eye.z);g.rotation.y=Math.atan2(tmp.x,tmp.z)+Math.PI/2;scene.add(g);waves.push({g,m,v:tmp.clone().multiplyScalar(30),t:.9,hit:new Set(),dm:7*k})}
function superTick(dt){
  for(let i=bolts.length-1;i>=0;i--){bolts[i].t-=dt;if(bolts[i].t<=0){scene.remove(bolts[i].g);bolts[i].g.geometry.dispose();bolts.splice(i,1)}}
  for(let i=waves.length-1;i>=0;i--){const w=waves[i],p=w.g.position;w.t-=dt;p.addScaledVector(w.v,dt);w.m.opacity=.9*Math.min(1,w.t*2);
    for(const e of enemies){if(e.dying||w.hit.has(e))continue;if(e.pos.distanceTo(p)<e.r+2.4){w.hit.add(e);damage(e,w.dm,2);sparkle(e.pos,0xff8a3a,6,5)}}
    if(w.t<=0||inBox(p.x,p.y,p.z)){scene.remove(w.g);waves.splice(i,1)}}
  if(cineT>0){cineT-=dt;if(cineT<=0){pb.visible=false;startSuper(cineK)}return}
  if(superT<=0)return;superT-=dt;const k=1+0.1*(power()-1);
  if(superKind===1){frostTick-=dt;if(frostTick<=0){frostTick=.5;const f=new T.Vector3(pos.x,pos.y+.3,pos.z);ringFx(f,8,0x8fe6ff);
      for(const e of enemies)if(!e.dying&&e.pos.distanceTo(eye)<8+e.r){damage(e,1.5*k,0);if(e.type!==3)e.slowT=1}}}
  if(superKind===2){voltTick-=dt;if(voltTick<=0){voltTick=.3;let from=eye,hitS=new Set();
      for(let j=0;j<4;j++){let best=null,bd=j?10:30;for(const e of enemies){if(e.dying||hitS.has(e))continue;const d=e.pos.distanceTo(from);if(d<bd&&los(from,e.pos)){bd=d;best=e}}
        if(!best)break;hitS.add(best);zap(j?from:new T.Vector3(eye.x,eye.y-.3,eye.z),best.pos);damage(best,3*k,1);from=best.pos.clone()}if(hitS.size)sfx('bolt')}}
  if(superT<=0)endSuper()}
const _cv=new T.Vector3();
function cineCam(dt){const ph=1-cineT/cineD,ry=yaw+Math.PI;pb.position.set(pos.x,pos.y+1.02,pos.z);pb.rotation.set(0,ry,0);pbR.anim(pE,time,dt);
  const S=pbR.segs,K=cineK;
  if(K===0){const r=Math.min(1,ph*2.2);S.arms[1][0].rotation.set(-2.7*r,0,-.25);S.arms[1][1].rotation.x=-.3*r;S.arms[0][0].rotation.set(-1.2*r,0,.6);pbAura.scale.setScalar(.4+ph*1.1);
    for(const c of pbAura.children)c.scale.y=1.1+Math.random()*.8;if(Math.random()<.5)sparkle(pb.position,0xff8a3a,2,3)}
  if(K===1){const up=ph<.6?Math.sin(ph/.6*Math.PI)*2.2:0;pb.position.y+=up;const ar=ph<.6?-2.8:-.4;for(const[sh]of S.arms)sh.rotation.set(ar,0,0);
    if(ph>.62&&!cineFx){cineFx=1;ringFx(new T.Vector3(pos.x,pos.y,pos.z),10,0x8fe6ff);sparkle(new T.Vector3(pos.x,pos.y+.5,pos.z),0xdff8ff,24,10);sfx('boom');if(!reduced)shake=.3}}
  if(K===2){pb.position.y+=ph*1.1;S.arms[0][0].rotation.set(-1.5,0,1.3);S.arms[1][0].rotation.set(-1.5,0,-1.3);if(Math.random()<.6){const a=pb.position.clone();zap(a,a.clone().add(new T.Vector3((Math.random()-.5)*5,Math.random()*3,(Math.random()-.5)*5)))}}
  const off=.95-ph*1.9,d0=4.6,ch=new T.Vector3(pb.position.x,pb.position.y+.4,pb.position.z);
  _cv.set(Math.sin(ry+off),.28,Math.cos(ry+off)).normalize();let d=d0;const hitD=rayBoxes([ch.x,ch.y,ch.z],[_cv.x,_cv.y,_cv.z],d0);if(hitD<d0)d=Math.max(1.2,hitD-.4);
  cam.position.copy(ch).addScaledVector(_cv,d);cam.lookAt(ch)}

/* ---------- combat ---------- */""")
# ---------- hooks: input, movement, damage, firing, camera, reset
rep("function hurt(n){if(veh)n*=0.5;","function hurt(n){if(cineT>0)return;if(superT>0&&superKind===0)n*=.5;if(veh)n*=0.5;")
rep("function toggleVeh(){if(state!=='playing')return;","function toggleVeh(){if(state!=='playing'||cineT>0)return;")
rep("  if(veh)vehTick(dt);else{","  if(veh)vehTick(dt);else if(cineT>0){vy=0;eye.set(pos.x,pos.y+EYE,pos.z)}else{")
rep("   if((firing||padFire)&&fireCd<=0&&reloadT<=0&&(Wf.mode!=='heat'||!over))fire()}",
    "   if(cineT<=0&&(firing||padFire)&&fireCd<=0){if(superT>0&&superKind===0){fireCd=.38;roninSlash()}else if(reloadT<=0&&(Wf.mode!=='heat'||!over))fire()}}\n  superTick(dt);if(state!=='playing')return;")
rep("function melee(){if(state!=='playing'||meleeCd>0||veh)return;","function melee(){if(state==='playing'&&superT>0&&superKind===0&&cineT<=0){if(fireCd<=0){fireCd=.38;roninSlash()}return}if(state!=='playing'||meleeCd>0||veh||cineT>0)return;")
rep("vm.visible=state!=='menu'&&!veh;","vm.visible=state!=='menu'&&!veh&&cineT<=0;")
rep("  else if(veh){const car=veh.kind==='car'","  else if(cineT>0&&state!=='menu'){cineCam(dt)}\n  else if(veh){const car=veh.kind==='car'")
rep("const K=guns[weapon].k,Wc=WPN[K],rl=reloadT>0?Math.sin((1-reloadT/reloadDur)*Math.PI):0,sws=swordT>0;","const K=guns[weapon].k,Wc=WPN[K],rl=reloadT>0?Math.sin((1-reloadT/reloadDur)*Math.PI):0,sws=swordT>0||(superT>0&&superKind===0);")
rep("if(sws){const ph=1-swordT/.45;","if(sws&&swordT<=0){swordG.rotation.set(.55,.35,-.35);swordG.position.set(.14,-.06,-.05)}else if(sws){const ph=1-swordT/.45;")
rep("reloadT=0;spinV=0;swordT=0;dashT=0;clear(fires);","reloadT=0;spinV=0;swordT=0;dashT=0;superT=0;superKind=-1;cineT=0;pb.visible=false;clear(waves);for(const b of bolts)scene.remove(b.g);bolts.length=0;clear(fires);")
rep("   chip('cG',1-grenCd/grenMax,W.gren.n);chip('cM',1-meleeCd/meleeMax,W.mel.n);chip('cS',superQ/100)}",
    "   chip('cG',1-grenCd/grenMax,W.gren.n);chip('cM',1-meleeCd/meleeMax,W.mel.n);chip('cS',superT>0?superT/SUPERS[superKind].dur:superQ/100,SUPERS[superT>0?superKind:SUPK].short);$('cS').classList.toggle('active',superT>0)}")
rep(".chip.ready .meter i{background:var(--bloom)}",".chip.ready .meter i{background:var(--bloom)}\n.chip.active{color:var(--amber)}.chip.active .meter i{background:var(--amber)}")
# ---------- super picker on the menu
rep('<div class="loadout" id="loadout"></div>','<div class="loadout" id="loadout"></div>\n    <div class="loadout" id="superpick"></div>')
rep("$('loadout').hidden=true","$('loadout').hidden=true;$('superpick').hidden=true")
rep("$('loadout').hidden=false","$('loadout').hidden=false;$('superpick').hidden=false")
rep("function syncLoad(){","""SUPERS.forEach((q,i)=>{const b=document.createElement('button');b.type='button';b.textContent=q.n;b.title=q.d;b.dataset.i=i;
  b.addEventListener('click',()=>{SUPK=i;try{localStorage.setItem('gh9-super',i)}catch(e){}syncSup()});$('superpick').appendChild(b)});
function syncSup(){for(const b of $('superpick').children)b.setAttribute('aria-pressed',+b.dataset.i===SUPK)}syncSup();
function syncLoad(){""")

# ---------- saving progress: the player's private save in their claude.ai account, with a browser fallback
rep('<button class="go" id="go" type="button">Start shift</button>','<div class="gorow"><button class="go" id="cont" type="button" hidden>Continue</button><button class="go" id="go" type="button">Start shift</button></div>\n    <p class="keys" id="saveNote"></p>')
rep(".loadout{display:grid;",".gorow{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}\n#cont{background:var(--shield);border-color:var(--shield)}\n.loadout{display:grid;")
rep("function begin(){$('settings').hidden=true;","""let SAVE=null,saveRef=null,saveBusy=false;
function validSave(o){try{if(!o||o.v!==1)return null;const w=Math.floor(+o.wave);if(!(w>=1&&w<=999))return null;const c=Math.floor(+o.cls);if(!(c>=0&&c<=2))return null;
  if(!Array.isArray(o.guns)||o.guns.length!==2)return null;const g=o.guns.map((q,i)=>({k:Math.floor(+q.k),rar:Math.max(0,Math.min(4,Math.floor(+q.rar)||0)),pow:Math.max(1,Math.min(999,Math.floor(+q.pow)||1))}));
  if(g.some((q,i)=>!POOL[i].includes(q.k)))return null;return{v:1,t:+o.t||0,wave:w,cls:c,score:Math.max(0,Math.floor(+o.score)||0),sup:Math.max(0,Math.min(2,Math.floor(+o.sup)||0)),guns:g}}catch(e){return null}}
function syncCont(){const b=$('cont');b.hidden=!SAVE||state==='paused';if(SAVE)b.textContent='Continue · stage '+(SAVE.wave+1);
  $('saveNote').textContent=SAVE?(saveRef?'Progress is saved to your claude.ai account.':'Progress is saved in this browser.'):''}
async function saveInit(){try{const L=localStorage.getItem('gh9-save');if(L)SAVE=validSave(JSON.parse(L))}catch(e){}syncCont();
  try{if(!window.claude||!claude.use)return;const db=await claude.use('db'),u=await claude.use('user');if(!db||!u)return;const id=await u.id();if(!id)return;
    saveRef=db.doc('data/users/'+id+'/save');const sn=await saveRef.get();if(sn.exists){const v=validSave(sn.data());if(v&&(!SAVE||v.t>=SAVE.t))SAVE=v}}catch(e){}syncCont()}
function writeSave(){SAVE={v:1,t:Date.now(),wave,cls,score,sup:SUPK,guns:guns.map(g=>({k:g.k,rar:g.rar,pow:g.pow}))};try{localStorage.setItem('gh9-save',JSON.stringify(SAVE))}catch(e){}
  if(saveRef&&!saveBusy){saveBusy=true;saveRef.set(SAVE).catch(()=>{}).finally(()=>{saveBusy=false})}}
function continueGame(){if(!SAVE)return;cls=SAVE.cls;SUPK=SAVE.sup;syncCls();syncSup();begin();wave=SAVE.wave;score=SAVE.score;bossN=Math.max(0,SAVE.wave-1);
  guns=SAVE.guns.map(q=>mkGun(q.k,q.rar,q.pow));LOAD=[guns[0].k,guns[1].k];syncLoad();mission=null;gap=1.5;say('Resuming at stage '+(wave+1),2)}
$('cont').addEventListener('click',continueGame);
function begin(){$('settings').hidden=true;$('cont').hidden=true;""")
rep("function complete(){const boss=!!mission.boss;","function complete(){const boss=!!mission.boss;setTimeout(writeSave,0);")
rep("  $('go').textContent='Try again'}","  $('go').textContent='New game';syncCont()}")
rep("applyCfg();\ndemo();","applyCfg();saveInit();\ndemo();")
open(p,'w').write(s);print('ok',len(s))
