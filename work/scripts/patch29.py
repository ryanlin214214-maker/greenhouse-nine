import re
p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:90]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]

# ---------- full inventory: all six guns, keyed by kind
rep("const power=()=>Math.round((guns[0].pow+guns[1].pow)/2);","const power=()=>Math.round(guns.reduce((a,g)=>a+g.pow,0)/guns.length);\nconst ORDER=[2,3,0,1,4,5];")
rep("function newGuns(){guns=[mkGun(LOAD[0]),mkGun(LOAD[1])]}newGuns();","function newGuns(){guns=WPN.map((_,k)=>mkGun(k))}newGuns();")
rep("let reloadT=0,","let grenCdK=[0,0,0,0,0,0],meleeCdK=[0,0,0,0,0,0],grenMaxK=[6,6,6,6,6,6],meleeMaxK=[4,4,4,4,4,4],supCd=[0,0,0],supT=[0,0,0],wheelOpen=false,wheelSel=-1,wx=0,wy=0,dryT=0;\nlet reloadT=0,")
rep("const SUPERS=[{n:'Ember Ronin'","const SUP_CD=[45,40,40];\nconst SUPERS=[{n:'Ember Ronin'")
# reset
rep("weapon=0;grenCd=0;meleeCd=0;meleeA=0;superQ=0;","weapon=2;grenCdK.fill(0);meleeCdK.fill(0);supCd.fill(0);supT.fill(0);wheelOpen=false;meleeA=0;superQ=0;")
rep("superT=0;superKind=-1;cineT=0;pb.visible=false;","cineT=0;pb.visible=false;")
# swap: any of six
rep("function swap(w){if(state!=='playing'||time-swapT<0.25)return;swapT=time;weapon=w===undefined?1-weapon:w;reloadT=0;spinV=0;",
    "function swap(w,dir=1){if(state!=='playing'||time-swapT<0.15)return;if(w===undefined){const i=ORDER.indexOf(weapon);w=ORDER[(i+dir+6)%6]}if(w===weapon)return;swapT=time;weapon=w;reloadT=0;spinV=0;")
# empty guns stay selectable but fire nothing
rep("  if(W.mode==='mag'&&G.mag<=0){startReload();fireCd=.2;return}",
    "  if(W.mode==='mag'&&G.mag<=0){if(!W.inf&&G.res<=0){fireCd=.3;sfx('dry');if(dryT<=0){dryT=1.5;say(W.name+' is empty',1)}return}startReload();fireCd=.2;return}")
rep("if(!W.inf&&G.res<=0){if(msgT<=0)say('Out of ammo · swap weapons',1.2);return}","if(!W.inf&&G.res<=0)return;")
# per-weapon grenade and melee cooldowns
rep("function grenade(){if(state!=='playing'||grenCd>0||veh)return;const W=WPN[guns[weapon].k],K=W.gren.kind;grenMax=grenCd=W.gren.cd*CLS[cls].gren/6;",
    "function grenade(){const wk=weapon;if(state!=='playing'||grenCdK[wk]>0||veh||cineT>0)return;const W=WPN[wk],K=W.gren.kind;grenMaxK[wk]=grenCdK[wk]=W.gren.cd*CLS[cls].gren/6;")
rep("function melee(){if(state==='playing'&&superT>0&&superKind===0&&cineT<=0){if(fireCd<=0){fireCd=.38;roninSlash()}return}if(state!=='playing'||meleeCd>0||veh||cineT>0)return;const W=WPN[guns[weapon].k],M=W.mel;meleeMax=meleeCd=M.cd*(cls===0?.85:1);",
    "function melee(){const wk=weapon;if(state!=='playing'||meleeCdK[wk]>0||veh||cineT>0)return;const W=WPN[wk],M=W.mel;meleeMaxK[wk]=meleeCdK[wk]=M.cd*(cls===0?.85:1);")
rep("grenCd=Math.max(0,grenCd-dt);meleeCd=Math.max(0,meleeCd-dt);","for(let i=0;i<6;i++){grenCdK[i]=Math.max(0,grenCdK[i]-dt);meleeCdK[i]=Math.max(0,meleeCdK[i]-dt)}for(let i=0;i<3;i++)supCd[i]=Math.max(0,supCd[i]-dt);dryT-=dt;")
# kills shave super cooldowns instead of filling one meter
rep("superQ=Math.min(100,superQ+(e.type===2?30:e.type===6||e.type===9?14:7));","{const s2=e.type===2?6:e.type===6||e.type===9?2.5:1;for(let i=0;i<3;i++)supCd[i]=Math.max(0,supCd[i]-s2)}")
s=s.replace("score+=5000;superQ=100;","score+=5000;supCd.fill(0);")
# ---------- supers: each with its own cooldown, and they stack
between("function surge(){","function startSuper(K){","""function surge(K){if(K===undefined)K=SUPK;if(state!=='playing'||veh||supCd[K]>0||supT[K]>0)return;supCd[K]=SUP_CD[K];SUPK=K;
  const col=['#ff8a3a','#8fe6ff','#c9a6ff'][K];
  if(cineT>0||supT.some(t=>t>0)){startSuper(K);say(SUPERS[K].n,1.4,col);sfx('nova');return}
  cineK=K;cineT=cineD=1.4;cineFx=0;firing=false;reloadT=0;
  say(SUPERS[K].n,1.8,col);sfx('nova');pb.visible=true;pbSword.visible=K===0;pbAura.visible=K===0;pbFrost.visible=K===1;pbVolt.visible=K===2;if(pbR.segs.gun)pbR.segs.gun.visible=K!==0}
""")
rep("function startSuper(K){const k=1+0.1*(power()-1);superKind=K;superT=SUPERS[K].dur;shield=shMax;novaA=.8;",
    "function startSuper(K){const k=1+0.1*(power()-1);supT[K]=SUPERS[K].dur;shield=shMax;novaA=.8;")
rep("function endSuper(){superT=0;superKind=-1}\n","")
between("  if(cineT>0){cineT-=dt;if(cineT<=0){pb.visible=false;startSuper(cineK)}return}","  if(superT<=0)endSuper()}","""  if(cineT>0){cineT-=dt;if(cineT<=0){pb.visible=false;startSuper(cineK)}}
  const k=1+0.1*(power()-1);for(let i=0;i<3;i++)if(supT[i]>0)supT[i]=Math.max(0,supT[i]-dt);
  if(supT[1]>0){frostTick-=dt;if(frostTick<=0){frostTick=.5;const f=new T.Vector3(pos.x,pos.y+.3,pos.z);ringFx(f,8,0x8fe6ff);
      for(const e of enemies)if(!e.dying&&e.pos.distanceTo(eye)<8+e.r){damage(e,1.5*k,0);if(e.type!==3)e.slowT=1}}}
  if(supT[2]>0){voltTick-=dt;if(voltTick<=0){voltTick=.3;let from=eye,hitS=new Set();
      for(let j=0;j<4;j++){let best=null,bd=j?10:30;for(const e of enemies){if(e.dying||hitS.has(e))continue;const d=e.pos.distanceTo(from);if(d<bd&&los(from,e.pos)){bd=d;best=e}}
        if(!best)break;hitS.add(best);zap(j?from:new T.Vector3(eye.x,eye.y-.3,eye.z),best.pos);damage(best,3*k,1);from=best.pos.clone()}if(hitS.size)sfx('bolt')}}""")
rep("  if(superT<=0)endSuper()}","}")
rep("function hurt(n){if(cineT>0)return;if(superT>0&&superKind===0)n*=.5;","function hurt(n){if(cineT>0)return;if(supT[0]>0)n*=.5;")
rep("if(superT>0&&superKind===0){fireCd=.38;roninSlash()}","if(supT[0]>0){fireCd=.38;roninSlash()}")
rep("sws=swordT>0||(superT>0&&superKind===0);","sws=swordT>0||supT[0]>0;")
s=s.replace("const _sx=1;","")

# ---------- wheel: hold Tab (controller L1, touch Wheel button); time slows while open
rep('<div class="msg" id="msg"></div>','<div class="msg" id="msg"></div>\n  <div class="wheel" id="wheel" hidden><div class="wcen" id="wcen">WEAPONS · SUPERS</div></div>')
rep(".hurt,.nova{",""".wheel{position:absolute;left:50%;top:50%;width:min(86vmin,380px);aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;z-index:4;
  background:radial-gradient(circle,rgba(8,20,22,.55) 0 22%,rgba(8,20,22,.82) 23% 47%,rgba(8,20,22,.7) 48% 100%);border:1px solid var(--line)}
.wheel button{position:absolute;transform:translate(-50%,-50%);width:27%;padding:6px 4px;font-size:10px;line-height:1.25;letter-spacing:.06em;background:rgba(19,37,40,.85);display:flex;flex-direction:column;align-items:center;gap:1px}
.wheel button b{font-family:var(--display);font-size:12px;color:var(--fg)}
.wheel button i{font-style:normal;color:var(--dim);font-size:9px;font-family:var(--mono)}
.wheel button.sup{width:22%;border-color:var(--lance)}
.wheel button.sel{border-color:var(--amber);background:#2a200f}
.wheel button.cur b{color:var(--amber)}
.wheel button.empty b{color:var(--hurt)}
.wcen{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-family:var(--display);font-size:9px;letter-spacing:.14em;color:var(--dim);text-align:center;pointer-events:none}
.hurt,.nova{""")
rep("/* ---------- combat ---------- */","""/* ---------- weapon and super wheel ---------- */
const WB=[];
ORDER.forEach((k,i)=>{const a=-Math.PI/2+i*Math.PI/3,b=document.createElement('button');b.type='button';b.style.left=(50+Math.cos(a)*36)+'%';b.style.top=(50+Math.sin(a)*36)+'%';
  b.addEventListener('click',()=>{wheelSel=i;closeWheel(true)});b.addEventListener('pointerenter',()=>{wheelSel=i});$('wheel').appendChild(b);WB.push(b)});
[0,1,2].forEach(K=>{const a=-Math.PI/2+K*2*Math.PI/3,b=document.createElement('button');b.type='button';b.className='sup';b.style.left=(50+Math.cos(a)*16)+'%';b.style.top=(50+Math.sin(a)*16)+'%';
  b.addEventListener('click',()=>{wheelSel=6+K;closeWheel(true)});b.addEventListener('pointerenter',()=>{wheelSel=6+K});$('wheel').appendChild(b);WB.push(b)});
function openWheel(){if(state!=='playing'||veh||wheelOpen)return;wheelOpen=true;wx=wy=0;wheelSel=-1;firing=false;$('wheel').hidden=false;syncWheel()}
function closeWheel(apply){if(!wheelOpen)return;wheelOpen=false;$('wheel').hidden=true;if(!apply||wheelSel<0)return;if(wheelSel<6)swap(ORDER[wheelSel]);else surge(wheelSel-6)}
function wheelAim(dx,dy){wx+=dx;wy+=dy;const r=Math.hypot(wx,wy);if(r>140){wx*=140/r;wy*=140/r}const rr=Math.min(r,140),a=Math.atan2(wy,wx);
  if(rr<25)wheelSel=-1;else if(rr<75){wheelSel=6+((Math.round((a+Math.PI/2)/(2*Math.PI/3))%3)+3)%3}else wheelSel=((Math.round((a+Math.PI/2)/(Math.PI/3))%6)+6)%6}
function syncWheel(){ORDER.forEach((k,i)=>{const G=guns[k],W=WPN[k],b=WB[i],emp=W.mode==='mag'&&!W.inf&&G.mag<=0&&G.res<=0;
    b.className=(wheelSel===i?'sel ':'')+(weapon===k?'cur ':'')+(emp?'empty':'');
    b.innerHTML='<b>'+(i+1)+' '+W.short+'</b><i>'+(W.mode==='heat'?'heat':emp?'EMPTY':G.mag+' / '+(W.inf?'∞':G.res))+'</i><i>'+W.gren.n+(grenCdK[k]>0?' '+Math.ceil(grenCdK[k])+'s':' ✓')+' · '+W.mel.n+(meleeCdK[k]>0?' '+Math.ceil(meleeCdK[k])+'s':' ✓')+'</i>'});
  [0,1,2].forEach(K=>{const b=WB[6+K];b.className='sup'+(wheelSel===6+K?' sel':'');b.innerHTML='<b>'+'ZXC'[K]+' '+SUPERS[K].short+'</b><i>'+(supT[K]>0?'ACTIVE':supCd[K]>0?Math.ceil(supCd[K])+'s':'READY')+'</i>'})}

/* ---------- combat ---------- */""")
# input: number keys, Tab wheel, Z/X/C supers, mouse wheel cycles
rep("if(c==='Digit1')swap(0);else if(c==='Digit2')swap(1);else if(c==='KeyQ')swap();",
    "if(/^Digit[1-6]$/.test(c))swap(ORDER[+c[5]-1]);else if(c==='KeyQ')swap();else if(c==='Tab')openWheel();else if(c==='KeyZ')surge(0);else if(c==='KeyC')surge(2);")
rep("else if(c==='KeyX')surge();","else if(c==='KeyX')surge(1);")
rep("if(state==='playing'&&(e.code==='Space'||e.code.startsWith('Arrow')))e.preventDefault();","if(state==='playing'&&(e.code==='Space'||e.code==='Tab'||e.code.startsWith('Arrow')))e.preventDefault();")
rep("addEventListener('keyup',e=>{keys[e.code]=false});","addEventListener('keyup',e=>{keys[e.code]=false;if(e.code==='Tab')closeWheel(true)});")
rep("wheel',e=>{if(state==='playing'){e.preventDefault();swap()}},{passive:false});","wheel',e=>{if(state==='playing'){e.preventDefault();swap(undefined,e.deltaY>0?1:-1)}},{passive:false});")
s=re.sub(r"document\.addEventListener\('mousemove',e=>\{if\(!locked\|\|state!=='playing'\)return;camIdle=0;",
         "document.addEventListener('mousemove',e=>{if(!locked||state!=='playing')return;if(wheelOpen){wheelAim(e.movementX,e.movementY);return}camIdle=0;",s,count=1)
assert "if(wheelOpen){wheelAim(e.movementX" in s
# controller: hold L1 for the wheel; D-pad left/up/right for the supers
rep("  const k=CFG.sens*dt;yaw-=ax(2)*3.2*k;","  if(now[4]&&!wheelOpen)openWheel();if(!now[4]&&padPrev[4]&&wheelOpen)closeWheel(true);if(wheelOpen){wx=ax(2)*140;wy=ax(3)*140;wheelAim(0,0)}\n  const k=wheelOpen?0:CFG.sens*dt;yaw-=ax(2)*3.2*k;")
rep("  if((now[4]&&hit(5))||(now[5]&&hit(4))||hit(10)&&now[11])surge();","  if(hit(14))surge(0);if(hit(12))surge(1);if(hit(15))surge(2);if(hit(13))swap();")
# touch: the old surge button opens the wheel
rep('data-act="surge">Surge</button>','data-act="surge">Wheel</button>')
s=s.replace("else if(act==='ride')toggleVeh();","else if(act==='ride')toggleVeh();else if(act==='surge'){wheelOpen?closeWheel(false):openWheel();continue}",1)
# time slows while the wheel is open
rep("  if(state==='playing'){update(dt);commsTick(dt)}","  if(state==='playing'){update(wheelOpen?dt*.2:dt);commsTick(dt);if(wheelOpen)syncWheel()}")
rep("function pause(){setState('paused');","function pause(){closeWheel(false);setState('paused');")

# ---------- HUD: current weapon's grenade and melee, three super chips
rep('<div class="chip" id="cS">SURGE<div class="meter"><i></i></div></div>','<div class="chip" id="cS0">Z RONIN<div class="meter"><i></i></div></div><div class="chip" id="cS1">X GLACIER<div class="meter"><i></i></div></div><div class="chip" id="cS2">C TEMPEST<div class="meter"><i></i></div></div>')
rep("   chip('cG',1-grenCd/grenMax,W.gren.n);chip('cM',1-meleeCd/meleeMax,W.mel.n);chip('cS',superT>0?superT/SUPERS[superKind].dur:superQ/100,SUPERS[superT>0?superKind:SUPK].short);$('cS').classList.toggle('active',superT>0)}",
    "   chip('cG',1-grenCdK[weapon]/grenMaxK[weapon],'G '+W.gren.n);chip('cM',1-meleeCdK[weapon]/meleeMaxK[weapon],'F '+W.mel.n);\n   for(let K=0;K<3;K++){chip('cS'+K,supT[K]>0?supT[K]/SUPERS[K].dur:1-supCd[K]/SUP_CD[K]);$('cS'+K).classList.toggle('active',supT[K]>0)}}")
rep(".chip .meter{width:clamp(44px,9vw,62px);height:5px}",".chip .meter{width:clamp(40px,7vw,56px);height:5px}")

# ---------- loot: any of the six; worse copies give ammo instead
rep("const[x,y,z]=place(e,0.7),slot=Math.random()*2|0,lk=POOL[slot][Math.random()*3|0],","const[x,y,z]=place(e,0.7),lk=Math.random()*6|0,")
rep("loots.push({g,y:y+0.7,slot,k:lk,rar,pow:w+rar,name:WPN[lk].name})}","loots.push({g,y:y+0.7,k:lk,rar,pow:w+rar,name:WPN[lk].name})}")
rep("const nm=(1+(L.pow-1)*0.12)*RAR[L.rar].m,cur=gunMult(L.slot),same=guns[L.slot].k===L.k;if(same?nm>cur:nm*1.3>=cur){guns[L.slot]=mkGun(L.k,L.rar,L.pow);if(weapon===L.slot)reloadT=0;say(RAR[L.rar].n+' '+L.name+' · Power '+L.pow,2.4,RAR[L.rar].c)}\n    else{score+=100;say('Salvage +100',1)}",
    "const nm=(1+(L.pow-1)*0.12)*RAR[L.rar].m,cur=gunMult(L.k);if(nm>cur){guns[L.k]=mkGun(L.k,L.rar,L.pow);if(weapon===L.k)reloadT=0;say(RAR[L.rar].n+' '+L.name+' · Power '+L.pow,2.4,RAR[L.rar].c)}\n    else{const G=guns[L.k],W=WPN[L.k];score+=100;if(W.mode==='mag'&&!W.inf){G.res=Math.min(W.res*1.5,G.res+W.mag*2);say(W.short+' ammo +'+W.mag*2,1)}else say('Salvage +100',1)}")

# ---------- menu: no pickers (you carry everything); saves upgrade from the two-gun version
rep('<div class="loadout" id="loadout"></div>','<div class="loadout" id="loadout" hidden></div>')
rep('<div class="loadout" id="superpick"></div>','<div class="loadout" id="superpick" hidden></div>')
rep("$('classes').hidden=false;$('loadout').hidden=false;$('superpick').hidden=false","$('classes').hidden=false")
s=s.replace("Pick a class, two weapons and a super","You carry all six guns and all three supers. Pick a class")
rep("G grenade · F melee: every gun has its own · X surge · E vehicle","1–6 or scroll: guns · hold Tab: weapon and super wheel · Z X C: supers · G grenade · F melee (each gun has its own, every one on its own cooldown) · E vehicle")
between("function validSave(o){","function syncCont(){","""function validSave(o){try{if(!o||(o.v!==1&&o.v!==2))return null;const w=Math.floor(+o.wave);if(!(w>=1&&w<=999))return null;const c=Math.floor(+o.cls);if(!(c>=0&&c<=2))return null;
  if(!Array.isArray(o.guns)||(o.guns.length!==2&&o.guns.length!==6))return null;const g=WPN.map((_,k)=>({k,rar:0,pow:1}));
  for(const q of o.guns){const k=Math.floor(+q.k);if(!(k>=0&&k<6))return null;g[k]={k,rar:Math.max(0,Math.min(4,Math.floor(+q.rar)||0)),pow:Math.max(1,Math.min(999,Math.floor(+q.pow)||1))}}
  if(o.v===1){const top=Math.max(...g.map(q=>q.pow));for(const q of g)if(q.pow===1)q.pow=Math.max(1,top-1)}
  return{v:2,t:+o.t||0,wave:w,cls:c,score:Math.max(0,Math.floor(+o.score)||0),guns:g}}catch(e){return null}}
""")
rep("function writeSave(){SAVE={v:1,t:Date.now(),wave,cls,score,sup:SUPK,guns:guns.map(g=>({k:g.k,rar:g.rar,pow:g.pow}))};","function writeSave(){SAVE={v:2,t:Date.now(),wave,cls,score,guns:guns.map(g=>({k:g.k,rar:g.rar,pow:g.pow}))};")
rep("function continueGame(){if(!SAVE)return;cls=SAVE.cls;SUPK=SAVE.sup;syncCls();syncSup();begin();wave=SAVE.wave;score=SAVE.score;bossN=Math.max(0,SAVE.wave-1);\n  guns=SAVE.guns.map(q=>mkGun(q.k,q.rar,q.pow));LOAD=[guns[0].k,guns[1].k];syncLoad();",
    "function continueGame(){if(!SAVE)return;cls=SAVE.cls;syncCls();begin();wave=SAVE.wave;score=SAVE.score;bossN=Math.max(0,SAVE.wave-1);\n  guns=SAVE.guns.map(q=>mkGun(q.k,q.rar,q.pow));")

# ---------- stop leaking geometry and materials on repeated abilities
rep("function ringFx(p,r,col,y=.12){","const SLASH_G=new T.RingGeometry(.85,1.08,32,1,0,Math.PI*.9),WAVE_G=new T.RingGeometry(1.4,2,24,1,0,Math.PI),FIRE_G=new T.CircleGeometry(1,24);\nfunction ringFx(p,r,col,y=.12){")
rep("g=new T.Mesh(new T.RingGeometry(.85,1.05,32,1,0,Math.PI*.9),m);g.position.set(0,-.05,-2.2);m.opacity=.7;","g=new T.Mesh(SLASH_G,m);g.position.set(0,-.05,-2.2);m.opacity=.7;")
rep("g=new T.Mesh(new T.RingGeometry(.85,1.1,32,1,0,Math.PI*.9),m);g.position.set(0,-.05,-2.2);cam.add(g);","g=new T.Mesh(SLASH_G,m);g.position.set(0,-.05,-2.2);cam.add(g);")
rep("c=new T.Mesh(new T.RingGeometry(1.4,2,24,1,0,Math.PI),m);","c=new T.Mesh(WAVE_G,m);")
rep("const disc=mesh(new T.CircleGeometry(1,24),fm,5.5,5.5,1,0,.06,0);","const disc=mesh(FIRE_G,fm,5.5,5.5,1,0,.06,0);")
rep("if(k>=1){cam.remove(c.g);camFx.splice(i,1)}","if(k>=1){cam.remove(c.g);c.m.dispose();camFx.splice(i,1)}")
rep("if(k>=1){scene.remove(r.g);rings.splice(i,1)}","if(k>=1){scene.remove(r.g);r.m.dispose();rings.splice(i,1)}")
rep("if(w.t<=0||inBox(p.x,p.y,p.z)){scene.remove(w.g);waves.splice(i,1)}","if(w.t<=0||inBox(p.x,p.y,p.z)){scene.remove(w.g);w.m.dispose();waves.splice(i,1)}")
rep("if(f.t<=0){scene.remove(f.g);fires.splice(i,1)}","if(f.t<=0){scene.remove(f.g);f.fm.dispose();fires.splice(i,1)}")
rep("if(w.t<=0){scene.remove(w.g);wells.splice(i,1);","if(w.t<=0){scene.remove(w.g);w.m.dispose();wells.splice(i,1);")
rep("  else if(k==='whip')tone(","  else if(k==='dry')tone('square',160,140,.03,.03);\n  else if(k==='whip')tone(")
open(p,'w').write(s)
left=[m.start() for m in re.finditer(r'superT|superKind|grenCd\b|meleeCd\b|grenMax\b|meleeMax\b|superQ|POOL|LOAD|syncLoad|syncSup|\.slot\b',s)]
for i in left:print(s.count('\n',0,i)+1,s[max(0,i-50):i+50].replace('\n',' '))
print('ok',len(s))
