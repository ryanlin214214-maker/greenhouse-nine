# v93 A: the ship roster. Six new ships (interceptor, multirole, recon/EW, bomber, ion cannon ship, gunship) with their own
# models, handling, weapons and specials; enemy bomber and ion ship; Hangar 0 display and the shipwright comparison.
import sys
s=open(sys.argv[1]).read()
def R(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:100]);s=s.replace(a,b)
a=s.find('const SHIPS={kestrel:');b=s.find('};',a)+2;s=s[:a]+open('ships93t.js').read().strip()+s[b:]
R("// enemy craft (original designs): built from shared geometry and materials","// enemy craft (original designs): built from shared geometry and materials",1)
s=s.replace("// enemy craft (original designs): built from shared geometry and materials",open('ships93.js').read()+"\n// enemy craft (original designs): built from shared geometry and materials",1)
s=s.replace("// ---- stage transitions (fly-off, fly-in, landing camera)",open('ships93b.js').read()+"\n// ---- stage transitions (fly-off, fly-in, landing camera)",1)
# gun sounds per ship
R("fmg:{vol:.22,len:.075,lp:3400,f0:210,f1:80,crack:.016,hp:3000}","fmg:{vol:.22,len:.075,lp:3400,f0:210,f1:80,crack:.016,hp:3000},fmgL:{vol:.17,len:.05,lp:5200,f0:330,f1:150,crack:.012,hp:4200},fmgH:{vol:.3,len:.11,lp:2200,f0:150,f1:55,crack:.022,hp:2000},fmgT:{vol:.15,len:.055,lp:6400,f0:430,f1:250,crack:.01,hp:5200}")
# shuttleAnim: flame size per engine, missile meshes as a share of the load
R("U.cones.forEach(([a,b])=>{const f=.4+k*1.2+(boost?1.4:0),fl=.9+Math.random()*.2;a.scale.set(.3,1.2*f*fl,.3);b.scale.set(.48,2*f*fl,.48);",
  "U.cones.forEach(([a,b,r])=>{const q=(r||.6)/.6,f=.4+k*1.2+(boost?1.4:0),fl=.9+Math.random()*.2;a.scale.set(.3*q,1.2*f*fl*q,.3*q);b.scale.set(.48*q,2*f*fl*q,.48*q);")
R("if(U.msls)U.msls.forEach((m,i)=>m.visible=i<Math.ceil(msl/2));","if(U.msls)U.msls.forEach((m,i)=>m.visible=i<Math.ceil(msl/(U.mslMax||8)*U.msls.length));")
# flyStart: the chosen ship's model and state
R("S.ship=curShip();S.msl=S.ship.msl;S.g=shuttleModel();shipLook(S.g,S.ship);",
  "S.ship=curShip();S.msl=S.ship.msl;S.g=shipModel(WAL.ship in SHIPS?WAL.ship:'kestrel');S.g.userData.mslMax=Math.max(1,S.ship.msl);S.torp=S.ship.torp||0;S.enr=100;S.ionC=0;S.dec=S.ship.spec==='ew'?3:0;S.spc=0;S.pos.y+=(S.g.userData.gy||2.05)-2.05;"
  "try{$('fgun').previousElementSibling.textContent=S.ship.prim==='ion'?'ION HEAT':'GUNS';cam.fov=CFG.fov+(portrait?14:0)+(S.ship.fov||0);cam.updateProjectionMatrix()}catch(e){}")
# handling: afterburner length, throttle response, brakes, dash, turn penalties (ion charging, disruption)
R("S.bk=bk;if(bk)S.boost=Math.max(0,S.boost-dt/6);","S.bk=bk;if(bk)S.boost=Math.max(0,S.boost-dt/(S.ship.boostT||6));")
R("let tgt=bk?S.ship.boost:S.thr*S.ship.cruise;if(keys.Space&&!FC.on)tgt=0;if(near)tgt=Math.min(tgt,40);S.spd+=(tgt-S.spd)*Math.min(1,dt*(tgt>S.spd?(bk?1.3:.75):(keys.Space?2.2:.8)));",
  "let tgt=bk?S.ship.boost:S.thr*S.ship.cruise;if(S.dash>0)tgt=S.ship.boost*1.25;if(keys.Space&&!FC.on)tgt=0;if(near)tgt=Math.min(tgt,40);const AK=(S.ship.acc||.75)/.75;S.spd+=(tgt-S.spd)*Math.min(1,dt*(tgt>S.spd?(bk||S.dash>0?1.3*AK:.75*AK):(keys.Space?(S.ship.brk||2.2):.8)));")
R("const dh=ad(yaw,S.h),dp=pitch-S.p,rt=S.ship.turn*dt;","const dh=ad(yaw,S.h),dp=pitch-S.p,rt=S.ship.turn*dt*((S.ionC||0)>.05?.5:1)*(S.dash>0?1.3:1)*(S.dis>0?.4:1);")
# guns: per-ship muzzles, tracers and sound; the ion ship's trigger charges instead
R("if((firing||padFire)&&!FC.on&&S.gcd<=0&&S.over<=0&&S.ph!=='hangar'){S.gcd=S.ship.gunCd;S.gside=-S.gside;const m=fUp.set(S.gside*2.3,-.5,-3.2).applyEuler(S.g.rotation).add(S.pos).clone(),d=conv.clone().sub(m).normalize();",
  "if((firing||padFire)&&!FC.on&&S.gcd<=0&&S.over<=0&&S.ph!=='hangar'&&S.ship.prim!=='ion'){S.gcd=S.ship.gunCd;S.gside=-S.gside;S.gi=(S.gi||0)+1;const m=shipMz(S,S.gi),d=conv.clone().sub(m).normalize();")
R("flyShot(m,d,900+S.spd,FTRC,7,.13,S.ship.gunDmg,true);","flyShot(m,d,900+S.spd,TRC[S.ship.trc]||FTRC,S.ship.trc==='o'?8:S.ship.trc==='b'?6:7,S.ship.trc==='o'?.18:.12,S.ship.gunDmg,true);")
R("say('Guns overheated',1)}gun(GUNS.fmg)}","say('Guns overheated',1)}gun(GUNS[{swiftwing:'fmgL',wisp:'fmgT',bastion:'fmgH',halberd:'fmgH'}[WAL.ship]]||GUNS.fmg)}")
# lock: interceptor and recon lock faster, closer, in a wider cone
R("{let best=null,bd=.978;","{let best=null,bd=S.ship.lockC||.978;")
R("for(const e of S.en){if(e.kind==='mine')continue;fv1.subVectors(e.p,cam.position);const d=fv1.length();if(d>1900)continue;","for(const e of S.en){if(e.kind==='mine')continue;fv1.subVectors(e.p,cam.position);const d=fv1.length();if(d>(S.ship.lockR||1900))continue;")
R("S.lockE&&S.lockP>=.6&&!S.tipLock","S.lockE&&S.lockP>=(S.ship.lockT||.6)&&!S.tipLock")
R("const tgt=S.lockP>=.6?S.lockE:null;","const tgt=S.lockP>=(S.ship.lockT||.6)?S.lockE:null;")
R("S.msls.push({g,p:g.position,dir,spd:Math.max(S.spd+40,140),t:7,tgt,trail:0});","const srm=S.ship.mslK==='srm';S.msls.push({g,p:g.position,dir,spd:Math.max(S.spd+(srm?90:40),140),t:srm?3.6:7,tgt,trail:0,acc:srm?280:160,trn:srm?5.2:3.2});")
R("m.spd=Math.min(320,m.spd+160*dt);","m.spd=Math.min(m.acc>200?400:320,m.spd+(m.acc||160)*dt);")
R("m.dir.lerp(fv1,Math.min(1,dt*3.2)).normalize()}","m.dir.lerp(fv1,Math.min(1,dt*(m.trn||3.2))).normalize()}")
# HUD
R("$('fmslT').textContent='MISSILES '+S.msl+(S.lockE?(S.lockP>=.6?' · LOCKED':' · LOCKING'):'');$('fmsl').firstElementChild.style.width=S.msl/S.ship.msl*100+'%';",
  "$('fmslT').textContent=(S.ship.mslK==='srm'?'SR MISSILES ':'MISSILES ')+S.msl+(S.lockE?(S.lockP>=(S.ship.lockT||.6)?' · LOCKED':' · LOCKING'):'');$('fmsl').firstElementChild.style.width=S.msl/Math.max(1,S.ship.msl)*100+'%';")
R("$('fmacT').textContent=S.mac>0?'HEAVY CANNON '+S.mac.toFixed(1)+' S':'HEAVY CANNON READY';$('fmac').firstElementChild.style.width=(1-S.mac/S.ship.macCd)*100+'%';",
  "if(!rosterHud(S)){$('fmacT').textContent=S.mac>0?'HEAVY CANNON '+S.mac.toFixed(1)+' S':'HEAVY CANNON READY';$('fmac').firstElementChild.style.width=(1-S.mac/S.ship.macCd)*100+'%'}")
# chase camera per ship
R("const back=!S.noHull&&nearHull(S.pos)?11:14+S.spd*.02;cam.position.copy(S.pos).addScaledVector(fv2,-back).addScaledVector(fUp,3.6);",
  "const CS=S.ship.cam||[14,3.6],back=!S.noHull&&nearHull(S.pos)?CS[0]*.8:CS[0]+S.spd*.02;cam.position.copy(S.pos).addScaledVector(fv2,-back).addScaledVector(fUp,CS[1]);")
# enemy missiles: decoys pull them, the EW pulse jams them
R("fv1.subVectors(S.pos,m.p);const dd=fv1.length();fv1.divideScalar(dd||1);","if(m.jam>0)m.jam-=dt;const MT=m.dec&&m.dec.t>0?m.dec.p:S.pos;fv1.subVectors(MT,m.p);const dd=fv1.length();fv1.divideScalar(dd||1);")
R("if(ang>1e-4)m.dir.lerp(fv1,Math.min(1,mx/ang)).normalize();","if(ang>1e-4&&!(m.jam>0))m.dir.lerp(fv1,Math.min(1,mx/ang)).normalize();")
R("if(dd<9){flyBoom(m.p,1.2);scene.remove(m.g);S.emsl.splice(i,1);hurt(30,m.p);","if(dd<9&&MT!==S.pos){flyBoom(m.p,1.2);scene.remove(m.g);S.emsl.splice(i,1);continue}if(dd<9){flyBoom(m.p,1.2);scene.remove(m.g);S.emsl.splice(i,1);hurt(30,m.p);")
# enemies: disruption, the roster AI, interceptors flank, escorts guard their heavy ship
R("for(const e of S.en.slice()){const to=fv1.subVectors(S.pos,e.p),d=to.length()||1;e.cd-=dt;e.bt-=dt;\n    if(e.kind==='int'){",
  "for(const e of S.en.slice()){const to=fv1.subVectors(S.pos,e.p),d=to.length()||1;e.cd-=dt;e.bt-=dt;\n    if(e.dis>0&&e.kind!=='ebm'&&e.kind!=='eion'){e.dis-=dt;e.p.addScaledVector(e.dir,e.sp*.4*dt);if(Math.random()<dt*10)sparkle(e.p,0x8fe6ff,2,6);e.g.lookAt(e.p.x+e.dir.x,e.p.y+e.dir.y,e.p.z+e.dir.z);continue}\n"
  "    if(e.kind==='ebm'||e.kind==='eion'){rosterEnemy(S,e,dt,to,d)}else if(e.kind==='int'){")
R("fv2.copy(to).addScaledVector(S.vel,d/450).normalize();if(d<170){e.st='break';",
  "fv2.copy(to).addScaledVector(S.vel,d/450);if(e.esc&&S.en.includes(e.esc)&&e.esc.p.distanceTo(S.pos)>1300){fv2.subVectors(e.esc.p,e.p).addScaledVector(e.esc.dir,-60).add(fUp.set(e.side||40,25,0))}else if(d>380){if(!e.side)e.side=(Math.random()<.5?-1:1)*(120+Math.random()*120);fv2.add(fUp.set(0,1,0).cross(to).normalize().multiplyScalar(e.side*Math.min(1,(d-380)/600)))}fv2.normalize();if(d<170){e.st='break';")
# hits: marked targets take more, shields soak part of each hit; kills of the new kinds
R("function flyHit(e,n){if(e.hp<=0)return;e.hp-=n;","function flyHit(e,n){if(e.hp<=0)return;if(e.mark>0)n*=1.35;if(e.shp>0){const s=Math.min(e.shp,n*.6);e.shp-=s;n-=s;if(Math.random()<.4)sparkle(e.p,0x8fbfff,3,10)}e.hp-=n;")
R("flyBoom(e.p,e.kind==='gun'?2.6:e.kind==='ace'?3.4:1.3);","if(e.ln)scene.remove(e.ln);flyBoom(e.p,e.kind==='gun'?2.6:e.kind==='ace'?3.4:e.kind==='ebm'||e.kind==='eion'?3:1.3);")
R("score+=e.kind==='gun'?600:","score+=e.kind==='ebm'||e.kind==='eion'?800:e.kind==='gun'?600:")
R("cr(e.kind==='gun'?60:","cr(e.kind==='ebm'||e.kind==='eion'?70:e.kind==='gun'?60:")
# per-frame roster work after the ship animates
R("shuttleAnim(S.g,S.spd,bk,S.roll,S.msl,S.mac,S.ph==='hangar'&&S.spd<10,dt);","shuttleAnim(S.g,S.spd,bk,S.roll,S.msl,S.mac,S.ph==='hangar'&&S.spd<10,dt);shipAnimX(S,dt);rosterTick(S,dt);etpTick(S,dt);")
# keys: F is the ship's special; R drops decoys in flight
R("function melee(){if(FLY){flyMAC();","function melee(){if(FLY){flySpecial();")
R("else if(c==='KeyR')startReload();","else if(c==='KeyR'){if(FLY)flyDecoy();else startReload()}")
# hull durability: hits scale with the ship's hull rating
R("function hurt(n,src){if(cineT>0||FC.on||SPEC.on)return;","function hurt(n,src){if(cineT>0||FC.on||SPEC.on)return;if(FLY&&FLY.ship&&FLY.ship.hull)n*=100/FLY.ship.hull;")
# Meridian take-off and landing: the wheels on the pad whatever the ship
R("if(t<2){const u=sm01(t/2);x=x0;y=2.4+u*5;","if(t<2){const u=sm01(t/2);x=x0;y=(S.g.userData.gy||2.05)+.07+u*5;")
R("y=P0.y+(2.4-P0.y)*sm01((t-1)/4);","y=P0.y+((S.g.userData.gy||2.05)+.07-P0.y)*sm01((t-1)/4);")
R("S.pos.set(O.x-50,2.4,O.z+1103);S.h0=Math.PI*.82;","S.pos.set(O.x-50,(S.g.userData.gy||2.05)+.07,O.z+1103);S.h0=Math.PI*.82;")
R("if(inH&&S.pos.y<2.4)S.pos.y=2.4;","if(inH&&S.pos.y<(S.g.userData.gy||2.05)+.07)S.pos.y=(S.g.userData.gy||2.05)+.07;")
# Hangar 0: pads, display ships, signs, collision, your ship refreshes when you change ship
s=s.replace("// ---- v93: the ship roster.",open('ships93h.js').read()+"\n// ---- v93: the ship roster.",1)
R("for(const[x,z]of[[-50,1152],[-18,1158],[18,1158],[50,1152],[-50,1103]]){C(dk,10,.06,x,.035,z);a(new T.RingGeometry(9.75,10.15,64,1),cyD,1,1,1,x,.075,z,-1.571,0,0);for(let k=0;k<12;k++){const u=k*Math.PI/6;A(am,1.2,.08,.35,x+Math.cos(u)*11.6,.06,z+Math.sin(u)*11.6,-u)}}",
  "for(const[x,z,r]of[[-26,1160,9],[26,1160,10],[-62,1140,10],[62,1140,12.5],[-58,1180,14.5],[58,1180,11.5],[-50,1103,14.5]]){C(dk,r,.06,x,.035,z);a(new T.RingGeometry(r-.25,r+.15,64,1),cyD,1,1,1,x,.075,z,-1.571,0,0);for(let k=0;k<12;k++){const u=k*Math.PI/6;A(am,1.2,.08,.35,x+Math.cos(u)*(r+1.6),.06,z+Math.sin(u)*(r+1.6),-u)}}")
R("const PADS=[[-50,1152],[-18,1158],[18,1158],[50,1152]];SHIPK.forEach((id,i)=>{if(i>=4)return;const sh=shuttleModel();shipLook(sh,SHIPS[id]);sh.position.set(PADS[i][0],2.2,PADS[i][1]);sh.rotation.y=Math.PI;try{shuttleAnim(sh,0,0,0,8,1,true,10)}catch(_){}objs.push(sh)});",
  "HUB.padBox=[];for(const id in PAD93){const[x,z]=PAD93[id],sh=shipModel(id);sh.position.set(x,(sh.userData.gy||2.05)+.065,z);sh.rotation.y=Math.PI;try{shuttleAnim(sh,0,0,0,99,1,true,10)}catch(_){}sh.updateMatrixWorld(true);const bb=new T.Box3().setFromObject(sh);HUB.padBox.push([bb.min.x-.4,bb.min.z-.4,bb.max.x+.4,bb.max.z+.4,id]);objs.push(sh)}")
R("{const sh=shuttleModel();shipLook(sh,curShip());sh.position.set(-50,2.2,1103);sh.rotation.y=Math.PI*.82;try{shuttleAnim(sh,0,0,0,8,1,true,10)}catch(_){}D.add(sh);HUB.myShip=sh}","HUB.g=HUB.g||G;hubMyShip();")
a=s.find("SHIPK.forEach((id,i)=>{if(i>=4)return;const S2=SHIPS[id];sign(holoSign(");b=s.find("});",a)+3
s=s[:a]+"for(const id in PAD93){const S2=SHIPS[id],[x,z]=PAD93[id],bx=HUB.padBox.find(q=>q[4]===id);sign(holoSign(S2.n.toUpperCase(),S2.role.toUpperCase()+' · '+S2.price.toLocaleString()+' CR',ROLEC[id]||'#8fe6ff'),11,11,x,11,bx[1]-2.5,Math.PI)}"+s[b:]
R("for(const[x,z]of[[-50,1152],[-18,1158],[18,1158],[50,1152],[-50,1103]])SB(x-7.5,0,z-8,x+7.5,14,z+8);","for(const q of HUB.padBox)SB(q[0],0,q[1],q[2],14,q[3]);SB(-63,0,1090,-37,14,1116);")
R("{k:'x',x:OX-40,z:OZ+1100,r:4.5,label:'E · BOARD YOUR SHIP · TAKE OFF'}","{k:'x',x:OX-34.5,z:OZ+1103,r:4.5,label:'E · BOARD YOUR SHIP · TAKE OFF'}")
# shipwright: comparison cards; changing ship swaps the one on your pad
R("else h=SHIPK.map((id,i)=>{const S2=SHIPS[id];return card(S2.tint?'#'+S2.tint.toString(16).padStart(6,'0'):'#dcebe4',S2.n,S2.d+'<br>'+Math.round(S2.cruise*MPH)+' mph cruise · '+Math.round(S2.boost*MPH)+' boost · shield '+S2.shield+' · '+S2.msl+' missiles · cannon '+S2.macDmg,S2.price,i,WAL.ship===id?'use':WAL.ships.includes(id)?'own':'')}).join('');",
  "else h=SHIPK.map((id,i)=>shipCard(id,i)).join('');")
R("if(WAL.ships.includes(id)){WAL.ship=id;walSave();sfx('swap');say(SH.n+' is your ship now',2);shopRender();return}","if(WAL.ships.includes(id)){WAL.ship=id;walSave();sfx('swap');say(SH.n+' is your ship now',2);hubMyShip();shopRender();return}")
R("WAL.cr-=SH.price;WAL.ships.push(id);WAL.ship=id;walSave();sfx('pick');say('Bought the '+SH.n+'. It is your ship now.',2.5);shopRender();return}","WAL.cr-=SH.price;WAL.ships.push(id);WAL.ship=id;walSave();sfx('pick');say('Bought the '+SH.n+'. It is your ship now.',2.5);hubMyShip();shopRender();return}")
open(sys.argv[2],'w').write(s);print('p105 ok')
