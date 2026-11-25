# v74: Meridian Station hub (on foot) with weapon, armour and ship shops; ships with their own flight stats
import sys
src,dst=sys.argv[1],sys.argv[2]
s=open(src).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:90]);s=s.replace(a,b)

# ---------- ships: each has its own speed, handling, shield and weapons ----------
SHIPS=r'''const SHIPS={kestrel:{n:'Kestrel shuttle',d:'The all-rounder you flew out of Thalassa.',price:0,cruise:140,boost:224,turn:1.75,shield:150,gunCd:.07,gunDmg:1,heat:4.2,msl:8,macCd:5,macDmg:45,tint:null,scale:.92},
  swiftwing:{n:'Swiftwing interceptor',d:'Fast and nimble, a light shield.',price:2500,cruise:175,boost:290,turn:2.2,shield:100,gunCd:.055,gunDmg:.9,heat:3.6,msl:6,macCd:6,macDmg:40,tint:0x3f8fd8,scale:.82},
  lancer:{n:'Lancer strike craft',d:'Hard-hitting guns and a quick heavy cannon.',price:4500,cruise:155,boost:250,turn:1.9,shield:180,gunCd:.065,gunDmg:1.25,heat:4,msl:10,macCd:3.5,macDmg:55,tint:0xb0402e,scale:.95},
  bastion:{n:'Bastion gunship',d:'Slow, heavily shielded, twelve missiles, a huge cannon.',price:7000,cruise:115,boost:190,turn:1.35,shield:280,gunCd:.08,gunDmg:1.6,heat:4.6,msl:12,macCd:4,macDmg:70,tint:0x6a7a5a,scale:1.12}};
const SHIPK=Object.keys(SHIPS),curShip=()=>SHIPS[WAL.ship]||SHIPS.kestrel;
// a bought ship is the same airframe in its own colours and size
function shipLook(g,SH){if(!SH.tint)return;const hull=shuttleMats().hull,m=hull.clone();m.color.setHex(SH.tint).convertSRGBToLinear();g.traverse(o=>{if(o.isMesh&&o.material===hull)o.material=m});g.scale.setScalar(SH.scale)}
'''
rep("function flyStart(st){",SHIPS+"function flyStart(st){")
rep("S.g=shuttleModel();S.g.position.copy(S.pos);","S.ship=curShip();S.msl=S.ship.msl;S.g=shuttleModel();shipLook(S.g,S.ship);S.g.position.copy(S.pos);")
rep("hp=100;shMax=150;shield=150;","hp=100;shMax=S.ship.shield;shield=S.ship.shield;")
rep("let tgt=bk?224:S.thr*140;","let tgt=bk?S.ship.boost:S.thr*S.ship.cruise;")
rep("const dh=ad(yaw,S.h),dp=pitch-S.p,rt=1.75*dt;","const dh=ad(yaw,S.h),dp=pitch-S.p,rt=S.ship.turn*dt;")
rep("S.gcd=.07;","S.gcd=S.ship.gunCd;")
rep("flyShot(m,d,900+S.spd,FTRC,7,.13,1,true);S.heat+=4.2;","flyShot(m,d,900+S.spd,FTRC,7,.13,S.ship.gunDmg,true);S.heat+=S.ship.heat;")
rep("if(S.msl<8){S.mslT+=dt;if(S.mslT>4){S.mslT=0;S.msl++}}","if(S.msl<S.ship.msl){S.mslT+=dt;if(S.mslT>4){S.mslT=0;S.msl++}}")
rep("S.msl/8*100","S.msl/S.ship.msl*100")
rep("S.mac>0)return;S.mac=5;","S.mac>0)return;S.mac=S.ship.macCd;")
rep("if(best){flyHit(best,45);","if(best){flyHit(best,S.ship.macDmg);")
rep("(1-S.mac/5)*100","(1-S.mac/S.ship.macCd)*100")

# ---------- the hub ----------
HUB=r'''// ---- Meridian Station concourse: a walkable hub far from Thalassa (its own collision boxes are swapped in), ivory and gold
// after the owner's concept art. Three shop counters (weapons, armour, ships) and an exit terminal. No combat here.
const HUB={on:false,g:null,boxes:[],pts:[],vend:[],ring:null,turn:null,THB:null,offers:null,shop:null,near:null},HC=new T.Vector3(0,0,-2400);let SHOPOPEN=false,HUBNEXT=false;
function gunClone(k){const CM=charMats(),drop=new Set([VMS,CM.joint,MAT.glove,MAT.amber]),c=VMG[k].clone(true);c.position.set(0,0,0);c.rotation.set(0,0,0);c.scale.setScalar(1);const rm=[];c.traverse(o=>{o.visible=true;if(o.isMesh&&drop.has(o.material))rm.push(o)});for(const o of rm)o.parent.remove(o);return c}
function hubSign(txt,sub,col){return bas({map:paint(512,(g,S)=>{g.clearRect(0,0,S,S);g.fillStyle='rgba(12,22,40,.88)';g.fillRect(0,S*.3,S,S*.4);g.fillStyle=col;g.fillRect(0,S*.3,S,6);g.fillRect(0,S*.7-6,S,6);
  g.font='700 54px "Chakra Petch",sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#f4ead2';g.fillText(txt,S/2,S*.45);g.font='600 26px "IBM Plex Mono",monospace';g.fillStyle=col;g.fillText(sub,S/2,S*.6)}),transparent:true,side:T.DoubleSide})}
function hubBuild(){if(HUB.g)return;const G=HUB.g=new T.Group();scene.add(G);const X=HC.x,Z=HC.z,W=22,L=45,H=14,B=HUB.boxes,
  iv=std({color:0xd9d2c2,roughness:.55,metalness:.1}),iv2=std({color:0xbdb5a3,roughness:.6,metalness:.1}),gd=std({color:0xc9a24a,roughness:.3,metalness:.85}),st=std({color:0xcfc8b8,roughness:.5,metalness:.05}),
  nv=std({color:0x23406e,roughness:.7}),lt=bas({color:0xffe2a8}),cy=bas({color:0x8fe6ff}),M=(geo,m,sx,sy,sz,x,y,z,ry=0)=>{const o=mesh(geo,m,sx,sy,sz,X+x,y,Z+z);o.rotation.y=ry;G.add(o);return o},
  SB=(x0,y0,z0,x1,y1,z1)=>B.push({lo:[X+Math.min(x0,x1),y0,Z+Math.min(z0,z1)],hi:[X+Math.max(x0,x1),y1,Z+Math.max(z0,z1)]});
  // floor, carpet runner, gold inlays
  M(GEO.box,st,2*W,.1,2*L,0,-.05,0);M(GEO.box,nv,6,.02,2*L-6,0,.01,0);for(const sx of[-1,1])M(GEO.box,gd,.12,.025,2*L-6,sx*3.2,.012,0);for(let z=-L+6;z<=L-6;z+=9)M(GEO.box,gd,2*W-4,.02,.1,0,.012,z);
  // window wall (west): gold pilasters, sill and header, open to space
  for(let z=-L;z<=L;z+=9){M(GEO.box,gd,.9,H,.9,-W,H/2,z);M(GEO.box,iv2,.5,H,1.3,-W-.2,H/2,z)}M(GEO.box,iv,.6,1,2*L,-W,.5,0);M(GEO.box,iv,.6,H-8.5,2*L,-W,8.5+(H-8.5)/2,0);M(GEO.box,gd,.7,.15,2*L,-W,1.02,0);SB(-W-.6,0,-L,-W+.3,H,L);
  // east wall with three shop alcoves (weapons, armour, ships)
  const SH=[['w',-25,'ARMOURY','WEAPONS','#ffb238'],['a',0,'OUTFITTER','ARMOUR','#8fe6ff'],['s',25,'SHIPWRIGHT','SHIPS','#c9a6ff']];let zc=-L;
  for(const[k,z0,t1,t2,col]of SH){const a=z0-6,b=z0+6;if(a-zc>.1){M(GEO.box,iv,.8,H,a-zc,W,H/2,(zc+a)/2);SB(W-.4,0,zc,W+.4,H,a)}zc=b;
    for(const sz of[-1,1]){M(GEO.box,iv,8,H,.6,W+4,H/2,z0+sz*6);SB(W,0,z0+sz*6-.3,W+8,H,z0+sz*6+.3);M(GEO.box,gd,.5,H,.7,W+.1,H/2,z0+sz*6)}
    M(GEO.box,iv2,.6,H,12.6,W+8,H/2,z0);SB(W+7.7,0,z0-6,W+8.3,H,z0+6);M(GEO.box,gd,8.2,.4,12.6,W+4,8,z0);M(GEO.box,iv,8,H-8.2,12.6,W+4,8.2+(H-8.2)/2,z0);
    M(GEO.box,iv2,1.2,1.1,6.5,W+2.6,.55,z0);M(GEO.box,gd,1.3,.08,6.6,W+2.6,1.12,z0);SB(W+2,0,z0-3.25,W+3.2,1.1,z0+3.25);M(GEO.box,lt,.05,.05,6.4,W+1.95,1.0,z0);
    const sg=new T.Mesh(new T.PlaneGeometry(6,6),hubSign(t1,t2,col));sg.position.set(X+W+7.6,5.4,Z+z0);sg.rotation.y=-Math.PI/2;G.add(sg);
    const v=new T.Group();v.position.set(X+W+4.6,.95,Z+z0);v.rotation.y=-Math.PI/2;G.add(v);const rig=walkerRig(v,7);HUB.vend.push({rig,E:{mv:0,ph:z0,vy:0,kick:0,crouch:0,jet:0,burst:0,cd:1,ch:0,ft:0}});
    HUB.pts.push({k,x:X+W+.8,z:Z+z0,r:3.4,label:{w:'E · BROWSE WEAPONS',a:'E · BROWSE ARMOUR',s:'E · BROWSE SHIPS'}[k]});
    const pl=new T.PointLight(0xfff0d8,9*LP,16,2);pl.position.set(X+W+4,6,Z+z0);G.add(pl)}
  M(GEO.box,iv,.8,H,L-zc,W,H/2,(zc+L)/2);SB(W-.4,0,zc,W+.4,H,L);
  // shop displays: guns on a rack, armour on stands, a ship on a turntable
  [2,6,7,5].forEach((k,i)=>{const c=gunClone(k),w=new T.Group();w.add(c);w.scale.setScalar(1.6);w.position.set(X+W+7.3,2.4+(i%2)*1.6,Z-25-3+(i>>1)*6);w.rotation.y=Math.PI/2;G.add(w)});
  for(const sz of[-1,1]){const v=new T.Group();v.position.set(X+W+6,1.05,Z+sz*4.2);v.rotation.y=-Math.PI/2;G.add(v);walkerRig(v,7);M(GEO.cyl,gd,.7,.1,.7,W+6,.05,sz*4.2)}
  {const t=new T.Group();t.position.set(X+W+5.4,1.6,Z+25);G.add(t);const sm=shuttleModel();sm.scale.setScalar(.28);t.add(sm);HUB.turn=t;M(GEO.cyl,gd,1.8,.12,1.8,W+5.4,.06,25);
    const rg=mesh(new T.TorusGeometry(1.9,.03,6,48),cy,1,1,1,X+W+5.4,.2,Z+25);rg.rotation.x=Math.PI/2;G.add(rg)}
  // end walls: the exit to the hangar decks (north) and a banner wall (south)
  for(const ez of[-L,L]){M(GEO.box,iv,2*W,H,.8,0,H/2,ez);SB(-W,0,ez-.4,W,H,ez+.4)}
  {const sg=new T.Mesh(new T.PlaneGeometry(9,9),hubSign('HANGAR DECKS','LEAVE MERIDIAN','#ffb238'));sg.position.set(X,6.5,Z-L+.45);G.add(sg);
    M(GEO.box,iv2,2.4,1.2,.9,0,.6,-L+1.2);M(GEO.box,cy,2,.6,.05,0,1.2,-L+.74);SB(-1.2,0,-L,1.2,1.2,-L+1.65);HUB.pts.push({k:'x',x:X,z:Z-L+2.4,r:3,label:'E · LEAVE MERIDIAN'})}
  for(const sx of[-1,1]){const bn=new T.Mesh(new T.PlaneGeometry(5,11),bas({map:paint(256,(g,S)=>{g.fillStyle='#1d3a6e';g.fillRect(0,0,S,S);g.fillStyle='#c9a24a';g.fillRect(8,8,S-16,6);g.fillRect(8,S-14,S-16,6);
    g.save();g.translate(S/2,S/2);g.rotate(-Math.PI/2);g.font='700 34px "Chakra Petch",sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#f4ead2';g.fillText('MERIDIAN',0,0);g.restore()}),side:T.DoubleSide}));bn.position.set(X+sx*9,7.5,Z+L-.45);bn.rotation.y=Math.PI;G.add(bn)}
  // ceiling: gold ribs and light strips
  M(GEO.box,iv,2*W,.4,2*L,0,H+.2,0);for(let z=-L+4.5;z<L;z+=9)M(GEO.box,gd,2*W,.5,.5,0,H-.25,z);for(const sx of[-1,1])M(GEO.box,lt,.4,.06,2*L-2,sx*8,H-.05,0);
  // centre: a fountain with a tree and the turning gold armillary rings, benches round it
  M(GEO.cyl,iv2,4,.6,4,0,.3,8);M(GEO.cyl,MAT.water,3.6,.05,3.6,0,.58,8);M(GEO.cyl,MAT.bark,.25,3,.25,0,2,8);M(GEO.sph,MAT.leaf,1.8,1.4,1.8,0,4,8);SB(-4,0,4,4,.6,12);
  {const r=new T.Group();r.position.set(X,8.5,Z+8);G.add(r);for(let i=0;i<3;i++){const t=mesh(new T.TorusGeometry(2.2-i*.35,.06,8,64),gd,1,1,1,0,0,0);t.rotation.x=i*1.05;r.add(t)}r.add(mesh(GEO.sph,lt,.35,.35,.35,0,0,0));HUB.ring=r}
  for(const[bx,bz]of[[-8,-14],[8,-14],[-8,24],[8,24]]){M(GEO.box,gd,4,.45,1.1,bx,.22,bz);M(GEO.box,nv,4,.1,1,bx,.5,bz);SB(bx-2,0,bz-.55,bx+2,.5,bz+.55)}
  for(const z of[-30,0,30]){const pl=new T.PointLight(0xffe6c0,10*LP,30,2);pl.position.set(X,11,Z+z);G.add(pl)}
  G.visible=false}
function hubOffers(){const wv=Math.max(1,SAVE?SAVE.wave:1),roll=()=>{const r=Math.random();return r<.5?1:r<.85?2:3},O={w:[],a:[]};
  for(let i=0;i<6;i++){const rar=roll(),pow=2+rar+Math.min(6,wv),k=i<2?[6,7][i]:Math.random()*WPN.length|0;O.w.push({k,rar,pow,price:Math.round((120+90*rar*rar+25*pow)/10)*10})}
  for(let i=0;i<6;i++){const rar=roll(),pow=2+rar+Math.min(6,wv);O.a.push({t:Math.random()*4|0,p:i%4,rar,pow,price:Math.round((100+70*rar*rar+20*pow)/10)*10})}return O}
function hubEnter(){hubBuild();if(!HUB.THB){HUB.THB=boxes.slice()}boxes.length=0;for(const b of HUB.boxes)boxes.push(b);gridN=-1;worldShow(false);HUB.g.visible=true;HUB.on=true;HUB.offers=hubOffers();
  pos.set(HC.x,0,HC.z+38);vy=0;yaw=0;pitch=0;eye.set(pos.x,pos.y+EYE,pos.z);mission=null;gap=1e9;queue.length=0;ROW.on=false;rwG.visible=false;COMMS.length=0;commCur=null;
  setObj('MERIDIAN · CONCOURSE · WALK UP TO A COUNTER AND PRESS E');say('Meridian Station. Spend your credits here.',3)}
function hubLeave(){if(!HUB.on)return;HUB.on=false;if(HUB.g)HUB.g.visible=false;if(HUB.THB){boxes.length=0;for(const b of HUB.THB)boxes.push(b);HUB.THB=null}gridN=-1;worldShow(true)}
function hubTick(dt){if(!HUB.on)return;if(HUB.ring){HUB.ring.rotation.y+=dt*.3;HUB.ring.children.forEach((c,i)=>{if(c.geometry&&c.geometry.type==='TorusGeometry')c.rotation.z+=dt*(.2+i*.15)})}if(HUB.turn)HUB.turn.rotation.y+=dt*.5;
  for(const v of HUB.vend){try{v.rig.anim(v.E,time,dt)}catch(e){}}
  let nr=null,bd=1e9;for(const q of HUB.pts){const d=Math.hypot(pos.x-q.x,pos.z-q.z);if(d<q.r&&d<bd){bd=d;nr=q}}HUB.near=nr;const el=$('veh');if(state==='playing'){el.hidden=!nr;if(nr)el.textContent=nr.label}}
function hubUse(){const q=HUB.near;if(!q)return;if(q.k==='x'){pause();$('ovTitle').textContent='Meridian Station';$('ovText').textContent='Pick where to go next, or stay and shop.';missionsBuild();$('missions').hidden=false;$('go').textContent='Stay at Meridian';return}shopOpen(q.k)}
// ---- the shop panel
function shopOpen(k){if(state!=='playing')return;HUB.shop=k;SHOPOPEN=true;setState('paused');overlay.hidden=true;$('shop').hidden=false;if(document.pointerLockElement)document.exitPointerLock();shopRender()}
function shopClose(){if(!SHOPOPEN)return;SHOPOPEN=false;$('shop').hidden=true;resume()}
function shopBuy(i){const k=HUB.shop,O=HUB.offers;
  if(k==='s'){const id=SHIPK[i],SH=SHIPS[id];if(WAL.ships.includes(id)){WAL.ship=id;walSave();sfx('swap');say(SH.n+' is your ship now',2);shopRender();return}if(WAL.cr<SH.price){say('Not enough credits',1.5);sfx('dry');return}WAL.cr-=SH.price;WAL.ships.push(id);WAL.ship=id;walSave();sfx('pick');say('Bought the '+SH.n+'. It is your ship now.',2.5);shopRender();return}
  const o=(k==='w'?O.w:O.a)[i];if(!o||o.sold)return;if(WAL.cr<o.price){say('Not enough credits',1.5);sfx('dry');return}WAL.cr-=o.price;walSave();o.sold=true;if(k==='w')invAddGun(o.k,o.rar,o.pow);else invAddArm({t:o.t,rar:o.rar,pow:o.pow,p:o.p});sfx('pick');writeSave();shopRender()}
function shopRender(){const k=HUB.shop,O=HUB.offers;$('shopT').textContent=k==='w'?'ARMOURY · WEAPONS':k==='a'?'OUTFITTER · ARMOUR':'SHIPWRIGHT · SHIPS';$('shopCr').textContent=WAL.cr.toLocaleString()+' CR';let h='';
  const card=(rc,title,line,price,i,state2)=>'<div class="card" style="--rc:'+rc+'"><b>'+title+'</b>'+line+'<br><button type="button" data-b="'+i+'"'+(state2==='sold'?' disabled':'')+'>'+(state2==='sold'?'SOLD':state2==='use'?'IN USE':state2==='own'?'FLY THIS SHIP':'BUY · '+price.toLocaleString()+' CR')+'</button></div>';
  if(k==='w')h=O.w.map((o,i)=>{const W=WPN[o.k];return card(RAR[o.rar].c,RAR[o.rar].n+' '+W.name,'Power '+o.pow+' · x'+gMult(o.rar,o.pow).toFixed(2)+' damage<br>grenade '+W.gren.n+' · melee '+W.mel.n,o.price,i,o.sold?'sold':'')}).join('');
  else if(k==='a')h=O.a.map((o,i)=>card(RAR[o.rar].c,RAR[o.rar].n+' '+pName(o),PSLOT[o.p]+' · Power '+o.pow+'<br>'+armLine(o),o.price,i,o.sold?'sold':'')).join('');
  else h=SHIPK.map((id,i)=>{const S2=SHIPS[id];return card(S2.tint?'#'+S2.tint.toString(16).padStart(6,'0'):'#dcebe4',S2.n,S2.d+'<br>'+Math.round(S2.cruise*MPH)+' mph cruise · '+Math.round(S2.boost*MPH)+' boost · shield '+S2.shield+' · '+S2.msl+' missiles · cannon '+S2.macDmg,S2.price,i,WAL.ship===id?'use':WAL.ships.includes(id)?'own':'')}).join('');
  $('shopBody').innerHTML='<div class="cards">'+h+'</div>'}
'''
rep("function startAt(m,s,skip){",HUB+"function startAt(m,s,skip){")
# the hub as a destination: Missions list, after Mission 2, and leaving it again
rep("{m:2,s:3,t:'Run to Meridian',d:'500 mph · minefield · blockade · Meridian Station',ready:true}]}];",
    "{m:2,s:3,t:'Run to Meridian',d:'500 mph · minefield · blockade · Meridian Station',ready:true}]},\n {n:'Meridian Station',st:[{m:3,s:1,t:'The Concourse',d:'Hub · weapon, armour and ship shops · spend credits',ready:true}]}];")
rep("function startAt(m,s,skip){LAST={m,s};NOSAVE=false;",
    "function startAt(m,s,skip){LAST={m,s};NOSAVE=false;HUBNEXT=false;\n"
    "  if(m===3){if(SAVE){cls=SAVE.cls;syncCls()}begin(true);NOSAVE=!SAVE;if(SAVE){wave=SAVE.wave;score=SAVE.score;guns=SAVE.guns.map(q=>mkGun(q.k,q.rar,q.pow,q.mods));{const q=JSON.parse(JSON.stringify({i:SAVE.inv||{g:[],a:[]},a:SAVE.arm||[0,1,2,3].map(p=>({t:4,rar:0,pow:1,p}))}));INV=q.i;ARMP=q.a}applyArmour();shield=shMax;attSync()}hubEnter();return}")
rep("function begin(noIntro){","function begin(noIntro){if(typeof HUB!=='undefined'&&HUB.on)hubLeave();")
rep("$('go').addEventListener('click',()=>{state==='paused'?resume():begin()});","$('go').addEventListener('click',()=>{if(HUBNEXT){HUBNEXT=false;startAt(3,1);return}state==='paused'?resume():begin()});")
rep("$('go').textContent=st===3?'Fly on (free flight)':","HUBNEXT=st===3;$('go').textContent=st===3?'Enter Meridian (shops)':")
# no fighting at Meridian; E uses counters
rep("else if(c==='KeyE')toggleVeh();","else if(c==='KeyE'){if(HUB.on)hubUse();else toggleVeh()}")
rep("if(cineT<=0&&!SPEC.on&&(firing||padFire)&&fireCd<=0)","if(cineT<=0&&!SPEC.on&&!HUB.on&&(firing||padFire)&&fireCd<=0)")
rep("function grenade(){if(FLY){flyMissile();return}","function grenade(){if(FLY){flyMissile();return}if(HUB.on)return;")
rep("function melee(){if(FLY){flyMAC();return}","function melee(){if(FLY){flyMAC();return}if(HUB.on)return;")
rep("function surge(K){if(FLY)return;","function surge(K){if(FLY||HUB.on)return;")
rep("if(INVOPEN&&(e.code==='KeyI'||e.code==='Escape')&&!e.repeat){invClose();e.preventDefault();return}",
    "if(INVOPEN&&(e.code==='KeyI'||e.code==='Escape')&&!e.repeat){invClose();e.preventDefault();return}\n  if(SHOPOPEN&&(e.code==='KeyE'||e.code==='Escape')&&!e.repeat){shopClose();e.preventDefault();return}")
rep("function resume(){if(INVOPEN){INVOPEN=false}$('gear').hidden=true;","function resume(){if(INVOPEN){INVOPEN=false}$('gear').hidden=true;SHOPOPEN=false;$('shop').hidden=true;")
rep("function dmgTick(dt){crTick();gearTick(dt);","function dmgTick(dt){crTick();gearTick(dt);hubTick(dt);")
# shop panel markup and events
rep('<div class="gear" id="gear" hidden>','<div class="panel inv" id="shop" hidden><h3 id="shopT">SHOP</h3><p class="sub">Credits: <b id="shopCr" style="color:#ffd27a"></b> · bought guns and armour go to your loadout (I)</p><div id="shopBody"></div><button type="button" id="shopClose">Close · E</button></div>\n  <div class="gear" id="gear" hidden>')
rep("$('gvC').addEventListener('click',()=>{GR.mode='c';benchSync()});",
    "$('gvC').addEventListener('click',()=>{GR.mode='c';benchSync()});$('shopClose').addEventListener('click',()=>shopClose());\n"
    "$('shopBody').addEventListener('click',e=>{const b=e.target.closest('[data-b]');if(b&&!b.disabled)shopBuy(+b.dataset.b)});")
rep(".inv .card b{display:block;color:var(--rc);font-size:12px}",".inv .card b{display:block;color:var(--rc);font-size:12px}.inv .card button{margin-top:6px;font-size:10px;padding:4px 8px}.inv .card button[disabled]{opacity:.45}")
open(dst,'w').write(s);print('ok',len(s))
s=open(dst).read()
# the ship's bounds clamp only applies aboard Thalassa, not at Meridian
rep("pos.x=Math.max(-AX+.1+PR,Math.min(AX-.1-PR,pos.x));pos.z=Math.max(-AZ+.1+PR,Math.min(AZ-.1-PR,pos.z))}","if(!HUB.on){pos.x=Math.max(-AX+.1+PR,Math.min(AX-.1-PR,pos.x));pos.z=Math.max(-AZ+.1+PR,Math.min(AZ-.1-PR,pos.z))}}")
open(dst,'w').write(s);print('ok-clamp')
s=open(dst).read()
# the hub was blown out (treated as outdoors in full sun): indoor fill, a third of the sun, lower exposure, softer lamps, darker stone
rep("m=MOODS[r?MOODK[r.n]:'X'],a=Math.min(1,dt*2.5);","m=MOODS[HUB.on?'A':r?MOODK[r.n]:'X'],a=Math.min(1,dt*2.5);")
rep("hemi.intensity+=(m.hi*LH*(FLY?.4:1)-hemi.intensity)*a;","hemi.intensity+=(m.hi*LH*(FLY?.4:HUB.on?.5:1)-hemi.intensity)*a;")
rep("const pl=new T.PointLight(0xfff0d8,9*LP,16,2);","const pl=new T.PointLight(0xfff0d8,3*LP,16,2);")
rep("const pl=new T.PointLight(0xffe6c0,10*LP,30,2);","const pl=new T.PointLight(0xffe6c0,3.2*LP,30,2);")
rep("iv=std({color:0xd9d2c2,roughness:.55,metalness:.1}),iv2=std({color:0xbdb5a3,roughness:.6,metalness:.1}),","iv=std({color:0xb9b1a0,roughness:.6,metalness:.1}),iv2=std({color:0x9c9483,roughness:.65,metalness:.1}),")
rep("st=std({color:0xcfc8b8,roughness:.5,metalness:.05}),","st=std({color:0xa8a192,roughness:.55,metalness:.05}),")
rep("lt=bas({color:0xffe2a8}),","lt=bas({color:0xd9b878}),")
rep("HUB.g.visible=true;HUB.on=true;HUB.offers=hubOffers();","HUB.g.visible=true;HUB.on=true;HUB.offers=hubOffers();if(HUB.sun0===undefined){HUB.sun0=sun.intensity;HUB.ex0=renderer.toneMappingExposure}sun.intensity=HUB.sun0*.3;renderer.toneMappingExposure=HUB.ex0*.85;")
rep("function hubLeave(){if(!HUB.on)return;HUB.on=false;","function hubLeave(){if(!HUB.on)return;HUB.on=false;if(HUB.sun0!==undefined){sun.intensity=HUB.sun0;renderer.toneMappingExposure=HUB.ex0}")
open(dst,'w').write(s);print('ok-light')
