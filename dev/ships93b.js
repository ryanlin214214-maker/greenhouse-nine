// ---- v93: roster handling, weapons and special abilities, and the enemy bomber and ion ship.
// Per ship: acc (throttle response), brk (brake), boostT (seconds of afterburner), hull (durability: hull damage x100/hull),
// cam [distance, height], fov (degrees added), prim ('guns' or 'ion'), spec (F key), mslK ('std' or 'srm'), trc (tracer).
const ROLEC={kestrel:'#e0702a',swiftwing:'#3a78c8',lancer:'#c0503a',wisp:'#2f9a9a',halberd:'#9a9a5a',arclight:'#8a6cff',bastion:'#7a8a6a'};
function shipMz(S,i){const U=S.g.userData,L=U.mz&&U.mz.length?U.mz:[[-2.5,-.55,-3.1],[2.5,-.55,-3.1]],m=L[i%L.length];S.g.updateMatrixWorld(true);return S.g.localToWorld(new T.Vector3(m[0],m[1],m[2]))}
const TRC={y:FTRC,b:bas({color:0x9fd8ff,transparent:true,opacity:.95,blending:T.AdditiveBlending,depthWrite:false,fog:false}),o:bas({color:0xffa040,transparent:true,opacity:.95,blending:T.AdditiveBlending,depthWrite:false,fog:false}),
  t:bas({color:0x9fffe8,transparent:true,opacity:.9,blending:T.AdditiveBlending,depthWrite:false,fog:false}),r:bas({color:0xff7a5a,transparent:true,opacity:.95,blending:T.AdditiveBlending,depthWrite:false,fog:false})};
// per-frame: role parts (bomb bay doors, torpedo lights, the ion core and its arcs, the radome)
function shipAnimX(S,dt){const U=S.g.userData;
  if(U.bay){const B=U.bay,to=S.arm>0||S.bayT>0?1:0;B.open+=(to-B.open)*Math.min(1,dt*4);for(const d of B.doors)d.rotation.z=-d.userData.sx*B.open*1.35;
    for(let i=0;i<B.torps.length;i++)B.torps[i].visible=i<S.torp;for(const l of B.lights)l.visible=S.arm>0?(time*8%1)<.5:B.open>.5;S.bayT=Math.max(0,(S.bayT||0)-dt)}
  if(U.ion){const I=U.ion,c=S.ionC||0,fl=S.ionF||0,st=c>=1?3:c>=.66?2:c>=.33?1:c>0?.5:0;I.core.scale.setScalar(.05+c*.75+fl*2.2);I.core.material.opacity=Math.min(1,c*1.3+fl);
    I.core2.scale.setScalar(st>=2?.12+(c-.6)*.9+Math.sin(time*40)*.05:.01+fl*1.2);I.core2.material.opacity=st>=2?.9:fl;
    for(const k of U.coils)k.material.emissiveIntensity=.3+c*2.4+(st>=3?Math.sin(time*30)*.6:0);
    // arcs: short jagged sparks round the muzzle from stage two
    if(!I.L){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(new Float32Array(16*2*3*3),3));I.L=new T.LineSegments(geo,new T.LineBasicMaterial({color:0xcff6ff,transparent:true,opacity:.9,blending:T.AdditiveBlending,depthWrite:false,fog:false}));I.L.frustumCulled=false;S.g.add(I.L)}
    const a=I.L.geometry.attributes.position.array,m=I.mz;let n=0;if(st>=2||fl>.1){const R=.35+c*.9;for(let k=0;k<16;k++){let x=m[0],y=m[1],z=m[2];const tx=m[0]+(Math.random()-.5)*R*2.4,ty=m[1]+(Math.random()-.5)*R*2.4,tz=m[2]+Math.random()*R*1.6;
        for(let j=0;j<3;j++){const u=(j+1)/3,nx=x+(tx-x)/(3-j)+(Math.random()-.5)*.25,ny=y+(ty-y)/(3-j)+(Math.random()-.5)*.25,nz=z+(tz-z)/(3-j);a.set([x,y,z,nx,ny,nz],n);n+=6;x=nx;y=ny;z=nz}}}
    a.fill(0,n);I.L.geometry.attributes.position.needsUpdate=true;I.L.visible=n>0;S.ionF=Math.max(0,fl-dt*3)}
  if(U.radome)U.radome.rotation.y+=dt*1.6}
// ---- weapons and specials (F key = spec, R = decoys on the recon ship)
function flySpecial(){const S=FLY;if(FC.on||!S||state!=='playing')return;const sp=S.ship.spec||'mac';
  if(sp==='mac')return flyMAC();if(S.spc>0)return;
  if(sp==='torp'){if(S.torp>0&&!(S.arm>0)){S.arm=1.25;S.torpT2=S.lockP>=.4?S.lockE:null;tone('sawtooth',180,520,1.2,.05);say('Torpedo arming',1.2)}return}
  if(sp==='dash'){S.spc=7;S.dash=1.6;tone('sawtooth',300,900,.4,.06);if(!reduced)shake=Math.max(shake,.2);return}
  if(sp==='flak'){S.spc=9;flak(S);return}
  if(sp==='ew'){S.spc=14;ewPulse(S);return}
  if(sp==='vent'){if(S.heat<20)return;S.spc=10;S.heat=0;S.over=0;S.enr=Math.max(0,S.enr-35);S.ventT=1;PFX.smoke(S.pos.clone(),{n:14,spd:4,size:[1,5],life:1.6,up:0,c0:.8,c1:.95,alpha:.5});tone('square',900,120,.5,.05);return}}
function flyDecoy(){const S=FLY;if(!S||FC.on||S.ship.spec!=='ew'||!(S.dec>0))return;S.dec--;S.decs=S.decs||[];
  for(let k=0;k<4;k++){const p=S.pos.clone().addScaledVector(S.vel.clone().normalize(),-8),v=new T.Vector3((Math.random()-.5)*60,(Math.random()-.5)*60-10,(Math.random()-.5)*60).addScaledVector(S.vel,.4);const gl=glow(0xffe0a0,6,1);gl.position.copy(p);scene.add(gl);S.decs.push({p:gl.position,v,t:4,g:gl})}
  let n=0;if(S.emsl)for(const m of S.emsl)if(m.p.distanceTo(S.pos)<2600){m.dec=S.decs[S.decs.length-1-(n++%4)];}
  for(const e of FLY.en){if(e.tp&&e.tp.p.distanceTo(S.pos)<2600)e.tp.dec=S.decs[S.decs.length-1]}
  sfx('mortar');say(n?'Decoys out · '+n+' missile'+(n>1?'s':'')+' pulled away':'Decoys out',1.4)}
function ewPulse(S){const r=new T.Mesh(new T.SphereGeometry(1,24,12),new T.MeshBasicMaterial({color:0x6fffe0,wireframe:true,transparent:true,opacity:.5,blending:T.AdditiveBlending,depthWrite:false,fog:false}));r.position.copy(S.pos);scene.add(r);S.fx93=S.fx93||[];S.fx93.push({g:r,t:0,T:.8,k:'pulse'});
  const f=flyAim(new T.Vector3());let n=0;for(const e of S.en){const d=e.p.distanceTo(S.pos);if(d<3200&&fv1.subVectors(e.p,S.pos).normalize().dot(f)>.2){e.mark=12;e.jam=6;n++}}
  let j=0;if(S.emsl)for(const m of S.emsl)if(m.p.distanceTo(S.pos)<2200){m.jam=3;j++}
  tone('sine',300,1600,.6,.06);say('EW pulse · '+n+' marked'+(j?' · '+j+' missile'+(j>1?'s':'')+' jammed':''),1.8)}
function flak(S){for(let k=0;k<18;k++){const d=new T.Vector3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize(),p=S.pos.clone().addScaledVector(d,120+Math.random()*320);setTimeout(()=>{if(!FLY)return;PFX.smoke(p,{n:3,spd:3,size:[3,9],life:1.4,up:0,c0:.15,c1:.35,alpha:.7});sparkle(p,0xffb060,4,12)},k*35)}
  for(const e of S.en.slice()){const d=e.p.distanceTo(S.pos);if(d<520)flyHit(e,22*(1-d/700))}if(S.emsl)for(let i=S.emsl.length-1;i>=0;i--){const m=S.emsl[i];if(m.p.distanceTo(S.pos)<520){flyBoom(m.p,.8);scene.remove(m.g);S.emsl.splice(i,1)}}
  for(const e of S.en)if(e.tp&&e.tp.p.distanceTo(S.pos)<520)e.tp.t=0;
  for(let k=0;k<5;k++)setTimeout(()=>sfx('mortar'),k*70);say('Flak',.8)}
function torpLaunch(S){const U=S.g.userData,i=S.torp-1;S.torp--;S.bayT=1.6;const src=U.bay&&U.bay.torps[i],p=src?src.getWorldPosition(new T.Vector3()):S.pos.clone();
  const g=new T.Group();const b=mesh(GEO.cyl,shuttleMats().msl,.24,3.6,.24);b.rotation.x=Math.PI/2;g.add(b);const t=mesh(GEO.cone,shuttleMats().mslTip,.24,.7,.24);t.rotation.x=-Math.PI/2;t.position.z=-2.1;g.add(t);const fl=glow(0xffc070,5,1);fl.position.z=2;g.add(fl);
  g.position.copy(p);scene.add(g);const dir=new T.Vector3(0,0,-1).applyQuaternion(S.g.quaternion);
  let tg=S.torpT2&&S.en.includes(S.torpT2)?S.torpT2:null;if(!tg){const f=flyAim(new T.Vector3());let bd=.94;for(const e of S.en){const c=fv1.subVectors(e.p,S.pos).normalize().dot(f);if(c>bd&&e.p.distanceTo(S.pos)<4000){bd=c;tg=e}}}
  S.torps=S.torps||[];S.torps.push({g,p:g.position,dir,spd:Math.max(40,S.spd*.6),t:16,tgt:tg,tr:0,age:0});sfx('mortar');tone('sine',140,90,.6,.08);say(tg?'Torpedo away · tracking':'Torpedo away',1.4)}
function bigBoom(p,R){PFX.boom(p,R/38,true);const ring=new T.Mesh(new T.TorusGeometry(1,.06,6,48),new T.MeshBasicMaterial({color:0xffd8a0,transparent:true,opacity:.8,blending:T.AdditiveBlending,depthWrite:false,fog:false}));ring.position.copy(p);ring.lookAt(cam.position);scene.add(ring);
  const fl=glow(0xfff0d0,R*1.6,.8);fl.position.copy(p);scene.add(fl);FLY.fx93=FLY.fx93||[];FLY.fx93.push({g:ring,t:0,T:1.1,k:'ring',R},{g:fl,t:0,T:.3,k:'flash'});
  sfx('boom');setTimeout(()=>sfx('boom'),160);if(!reduced)shake=Math.max(shake,Math.min(.8,R/(p.distanceTo(FLY.pos)+40)*4))}
function ionFire(S,c){const f=flyAim(new T.Vector3()),o=shipMz(S,0),L=3000,end=o.clone().addScaledVector(f,L),rad=2+c*6;let best=null,bd=1e9;
  for(const e of S.en){const t=fv2.subVectors(e.p,o).dot(f);if(t<0||t>L)continue;if(segDist(o,end,e.p)<e.r+rad&&t<bd){bd=t;best=e}}
  const hit=best?o.clone().addScaledVector(f,bd):end,len=o.distanceTo(hit);
  const w=.4+c*2.4,bm=new T.Mesh(new T.CylinderGeometry(1,1,1,10,1,true),new T.MeshBasicMaterial({color:c>=.99?0xeaffff:0x8fe6ff,transparent:true,opacity:1,blending:T.AdditiveBlending,depthWrite:false,fog:false}));
  bm.position.copy(o).lerp(hit,.5);bm.lookAt(hit);bm.rotateX(Math.PI/2);bm.scale.set(w,len,w);scene.add(bm);
  // the short electrical trail: a jagged line down the beam that fades after the beam
  const P=[],N=28;for(let k=0;k<=N;k++){const q=o.clone().lerp(hit,k/N);if(k&&k<N)q.add(new T.Vector3((Math.random()-.5),(Math.random()-.5),(Math.random()-.5)).multiplyScalar(w*1.6));P.push(q)}
  const ln=new T.Line(new T.BufferGeometry().setFromPoints(P),new T.LineBasicMaterial({color:0xdffaff,transparent:true,opacity:1,blending:T.AdditiveBlending,depthWrite:false,fog:false}));scene.add(ln);
  const fl=glow(0xbff4ff,6+c*22,1);fl.position.copy(o);scene.add(fl);S.fx93=S.fx93||[];S.fx93.push({g:bm,t:0,T:.22+c*.12,k:'fade'},{g:ln,t:0,T:.45,k:'fade'},{g:fl,t:0,T:.25,k:'flash'});
  if(best){let dmg=10+150*Math.pow(c,1.6);if(best.shp>0){const s=Math.min(best.shp,dmg*2.5);best.shp-=s;dmg=Math.max(0,dmg-s/2.5)}flyHit(best,dmg);if(c>=.99&&best.hp>0){best.dis=2.6;say('Target disrupted',1.2)}sparkle(hit,0x8fe6ff,10,22);if(c>.5)flyBoom(hit,.6+c)}
  S.ionF=1;S.spd=Math.max(0,S.spd-12*c);if(!reduced)shake=Math.max(shake,.12+c*.4);gun(GUNS.mac);tone('sawtooth',2200,90,.25+c*.3,.05+c*.08)}
// per frame: ion charging, torpedoes, decoys, effects, reloads
function rosterTick(S,dt){const SH=S.ship;S.spc=Math.max(0,(S.spc||0)-dt);S.dis=Math.max(0,(S.dis||0)-dt);S.dash=Math.max(0,(S.dash||0)-dt);S.ventT=Math.max(0,(S.ventT||0)-dt);
  if(SH.spec==='ew'){S.decT=(S.decT||0)+dt;if(S.dec<3&&S.decT>10){S.decT=0;S.dec++}}
  if(SH.spec==='torp'){if(S.torp<SH.torp){S.torpR=(S.torpR||0)+dt;if(S.torpR>10){S.torpR=0;S.torp++}}if(S.arm>0){S.arm-=dt;if(S.arm<=0){S.arm=0;torpLaunch(S)}}}
  if(SH.prim==='ion'){const hold=(firing||padFire)&&!FC.on&&S.ph!=='hangar'&&S.over<=0&&!(S.ventT>0);
    if(hold&&S.enr>0){const c0=S.ionC||0;S.ionC=Math.min(1,c0+dt/2.4);S.enr=Math.max(0,S.enr-22*dt);S.heat=Math.min(100,S.heat+(38+20*S.ionC+(S.ionC>=1?30:0))*dt);
      for(const th of[.33,.66,1])if(c0<th&&S.ionC>=th){tone('sine',500+th*900,600+th*1200,.12,.06);if(th===1)say('Ion cannon · full charge',.8)}
      S.ionW=(S.ionW||0)-dt;if(S.ionW<=0){S.ionW=.09;tone('sine',180+S.ionC*700,200+S.ionC*760,.1,.02+S.ionC*.02)}
      if(S.heat>=100){ionFire(S,S.ionC);S.ionC=0;S.over=1.8;say('Ion cannon overheated',1)}}
    else{if(S.ionC>0){if(S.ionC>.12)ionFire(S,S.ionC);S.ionC=0}S.enr=Math.min(100,(S.enr||0)+14*dt)}}
  if(S.torps)for(let i=S.torps.length-1;i>=0;i--){const m=S.torps[i];m.t-=dt;m.age+=dt;m.spd=Math.min(250,m.spd+(m.age>.6?75:10)*dt);
    if(m.age>.8&&m.tgt&&S.en.includes(m.tgt)){fv1.subVectors(m.tgt.p,m.p).normalize();const ang=Math.acos(Math.max(-1,Math.min(1,m.dir.dot(fv1))));if(ang>1e-4)m.dir.lerp(fv1,Math.min(1,dt*1.1/ang)).normalize()}
    m.p.addScaledVector(m.dir,m.spd*dt);m.g.lookAt(m.p.x-m.dir.x,m.p.y-m.dir.y,m.p.z-m.dir.z);m.tr-=dt;if(m.tr<=0){m.tr=.035;PFX.smoke(m.p.clone(),{n:1,spd:.3,size:[1.4,4.5],life:1.8,up:0,c0:.6,c1:.85,alpha:.45})}
    let boom=m.t<=0;for(const e of S.en)if(e.p.distanceTo(m.p)<e.r+9){boom=true;break}
    if(boom){bigBoom(m.p,70);for(const e of S.en.slice()){const d=e.p.distanceTo(m.p);if(d<90+e.r)flyHit(e,(e.shp>0?1.4:1)*(40+260*Math.max(0,1-d/(90+e.r))))}if(S.boomHook)S.boomHook(m.p,90);scene.remove(m.g);S.torps.splice(i,1)}}
  if(S.decs)for(let i=S.decs.length-1;i>=0;i--){const q=S.decs[i];q.t-=dt;q.p.addScaledVector(q.v,dt);q.v.multiplyScalar(1-dt*.6);q.g.material.opacity=Math.min(1,q.t);if(Math.random()<dt*20)PFX.fire(q.p.clone(),{n:1});if(q.t<=0){scene.remove(q.g);S.decs.splice(i,1)}}
  if(S.fx93)for(let i=S.fx93.length-1;i>=0;i--){const q=S.fx93[i];q.t+=dt;const u=q.t/q.T;
    if(q.k==='pulse'){q.g.scale.setScalar(20+u*3200);q.g.material.opacity=.45*(1-u)}else if(q.k==='ring'){q.g.scale.setScalar(5+u*q.R*1.6);q.g.material.opacity=.8*(1-u);q.g.lookAt(cam.position)}
    else if(q.k==='flash'){q.g.material.opacity=Math.max(0,1-u)}else q.g.material.opacity=Math.max(0,1-u);
    if(u>=1){scene.remove(q.g);S.fx93.splice(i,1)}}
  for(const e of S.en){if(e.mark>0)e.mark-=dt;if(e.jam>0)e.jam-=dt}}
// the special line on the flight HUD
function rosterHud(S){const SH=S.ship,sp=SH.spec||'mac',T1=$('fmacT'),B1=$('fmac').firstElementChild;if(sp==='mac')return false;let t='',w=0;
  if(sp==='torp'){t='TORPEDOES '+S.torp+' · '+(S.arm>0?'ARMING':S.torp?'F ARMS':'RELOADING');w=S.arm>0?1-S.arm/1.25:S.torp<SH.torp?(S.torpR||0)/10:1}
  else if(sp==='vent'){const c=S.ionC||0;t='ION '+(c>=1?'FULL':c>=.66?'STAGE 3':c>=.33?'STAGE 2':c>0?'STAGE 1':'HOLD FIRE')+' · ENERGY '+Math.round(S.enr||0)+'%';w=c}
  else{const nm={dash:'DASH',flak:'FLAK',ew:'EW PULSE'}[sp];t=nm+(S.spc>0?' '+S.spc.toFixed(1)+' S':' READY · F')+(sp==='ew'?' · DECOYS '+S.dec+' (R)':'');w=S.spc>0?1-S.spc/({dash:7,flak:9,ew:14}[sp]):1}
  T1.textContent=t;B1.style.width=Math.round(w*100)+'%';return true}

// ---- enemy roster: the Dark's bomber and ion ship, built on the same silhouettes as ours (black hull, red seams), so
// players learn the shapes. Bombers commit to long attack runs and drop a slow torpedo you can shoot down or outturn;
// ion ships line up, show a charging glow and a red aim line for 2.6 s (locked for the last 0.6 s), then fire.
let EDK=null;
function enemyRosterModel(kind){const g=kind==='ebm'?bomberShip():ionShip(),M=shuttleMats(),K=shipKitMats();
  if(!EDK)EDK={hull:std({color:0x1c1a20,roughness:.45,metalness:.6}),seam:std({color:0x401010,roughness:.4,metalness:.5,emissive:0xff2a1a,emissiveIntensity:1.6}),dark:std({color:0x0e0c10,roughness:.5,metalness:.7})};
  g.traverse(o=>{if(!o.isMesh)return;const m=o.material;if(m===M.hull||m===M.fusM||m===K.olive||m===K.violet||m===K.armor)o.material=EDK.hull;else if(m===M.trim||m===K.warn)o.material=EDK.seam;else if(m===M.dark||m===K.armorD||m===M.metal)o.material=EDK.dark});
  const U=g.userData;U.gear.visible=false;for(const q of U.nav||[])q.visible=false;for(const q of U.flames)q.material=q.material.clone(),q.material.color.setHex(0xff5a3a);
  const w=new T.Group();w.add(g);g.rotation.y=Math.PI;w.userData.inner=g;return w}
function flyEnemyR(kind,x,y,z){const e=flyEnemy('int',x,y,z);scene.remove(e.g);const w=enemyRosterModel(kind);w.position.copy(e.p);scene.add(w);w.add(e.bc);e.g=w;e.p=w.position;e.kind=kind;
  Object.assign(e,kind==='ebm'?{hp:70,max:70,r:13,sp:95,shp:40,st:'approach'}:{hp:85,max:85,r:11,sp:85,shp:60,st:'hold',ch:0});return e}
function rosterEnemy(S,e,dt,to,d){const U=e.g.userData.inner.userData;
  if(e.dis>0){e.dis-=dt;e.p.addScaledVector(e.dir,e.sp*.4*dt);if(Math.random()<dt*10)sparkle(e.p,0x8fe6ff,2,6);e.ch=0;if(U.ion)U.ion.core.material.opacity=0;return}
  if(e.kind==='ebm'){
    if(e.st==='approach'){fv2.copy(to).normalize();if(d<2600&&e.dir.dot(fv2)>.9){e.st='run';e.rt=0}}
    else if(e.st==='run'){fv2.copy(to).normalize();e.rt+=dt;
      if(d<1300&&!e.tp&&!(e.jam>0)){const g=new T.Group();g.add(mesh(GEO.cyl,FPLAS,.5,3,.5),glow(0xff5a2a,8,1));g.position.copy(e.p).addScaledVector(e.dir,10);scene.add(g);
        e.tp={g,p:g.position,v:e.dir.clone().multiplyScalar(140),t:12,hp:6};S.etp=S.etp||[];S.etp.push(e.tp);say('Torpedo inbound · shoot it or turn',2);sfx('mortar')}
      if(d<520||e.rt>24){e.st='break';e.t=3;e.bdir.copy(e.dir).add(new T.Vector3(Math.random()-.5,.6,Math.random()-.5)).normalize()}}
    else{fv2.copy(e.bdir);e.t-=dt;if(e.t<=0){e.st='approach';e.tp=null}}
    e.dir.lerp(fv2,Math.min(1,dt*(e.st==='run'?.35:.6))).normalize();e.p.addScaledVector(e.dir,e.sp*dt);
    if(U.bay)U.bay.open+=((e.st==='run'?1:0)-U.bay.open)*Math.min(1,dt*3);if(U.bay)for(const dd of U.bay.doors)dd.rotation.z=-dd.userData.sx*U.bay.open*1.35}
  else{// ion ship: hold 1.4-2.4 km, turn to face you, charge, fire
    const want=fv2.copy(to).normalize();if(d<1400)want.negate();else if(d<2400&&e.ch<=0)want.cross(fUp.set(0,1,0)).normalize().lerp(fv5.copy(to).normalize(),.4).normalize();
    if(e.ch>0)want.copy(to).normalize();e.dir.lerp(want,Math.min(1,dt*(e.ch>0?.9:.5))).normalize();e.p.addScaledVector(e.dir,e.sp*(e.ch>0?.25:1)*dt);
    if(!e.aim)e.aim=new T.Vector3();
    if(e.ch<=0&&e.cd<=0&&d<3000&&e.dir.dot(fv5.copy(to).normalize())>.94&&!(e.jam>0)){e.ch=2.6;e.cd=7+Math.random()*3;say('Ion ship charging · break the line',2.2)}
    const I=U.ion;if(e.ch>0){e.ch-=dt;const c=1-e.ch/2.6;if(e.ch>.6)e.aim.copy(S.pos);
      I.core.scale.setScalar(.2+c*1.6);I.core.material=I.core.material===shipKitMats().ionA?I.core.material.clone():I.core.material;I.core.material.color.setHex(0xff6a8a);I.core.material.opacity=Math.min(1,c*1.4);
      if(!e.ln){e.ln=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(),new T.Vector3()]),new T.LineBasicMaterial({color:0xff3050,transparent:true,opacity:.6,blending:T.AdditiveBlending,depthWrite:false,fog:false}));e.ln.frustumCulled=false;scene.add(e.ln)}
      const mz=I.core.getWorldPosition(new T.Vector3()),pa=e.ln.geometry.attributes.position.array;pa.set([mz.x,mz.y,mz.z,e.aim.x,e.aim.y,e.aim.z]);e.ln.geometry.attributes.position.needsUpdate=true;e.ln.material.opacity=.25+.6*c*(e.ch<.6?(time*12%1<.5?1:.4):1);
      S.ionWarn=Math.max(S.ionWarn||0,c);if(Math.random()<dt*6)tone('sine',300+c*900,320+c*920,.08,.02);
      if(e.ch<=0){e.ch=0;I.core.material.opacity=0;scene.remove(e.ln);e.ln=null;const dirA=e.aim.clone().sub(mz).normalize(),far=mz.clone().addScaledVector(dirA,4000),dl=segDist(mz,far,S.pos);
        const bm=new T.Mesh(new T.CylinderGeometry(1,1,1,8,1,true),new T.MeshBasicMaterial({color:0xff7a9a,transparent:true,opacity:1,blending:T.AdditiveBlending,depthWrite:false,fog:false}));const L=Math.min(4000,mz.distanceTo(S.pos)+400);
        bm.position.copy(mz).addScaledVector(dirA,L/2);bm.lookAt(mz.clone().addScaledVector(dirA,L));bm.rotateX(Math.PI/2);bm.scale.set(2.2,L,2.2);scene.add(bm);S.fx93=S.fx93||[];S.fx93.push({g:bm,t:0,T:.35,k:'fade'});tone('sawtooth',1600,80,.4,.07);
        if(dl<22){const s=shield;hurt(38,mz);if(s>0)shield=Math.max(0,shield-30);S.dis=1.4;say('Ion hit · systems disrupted',1.6)}else say('Ion shot missed',.9)}}
    else if(e.ln){scene.remove(e.ln);e.ln=null}}}
// enemy torpedoes: slow, homing a little, can be shot (6 hp) or pulled by decoys
function etpTick(S,dt){if(!S.etp)return;for(let i=S.etp.length-1;i>=0;i--){const m=S.etp[i];m.t-=dt;const tgt=m.dec&&m.dec.t>0?m.dec.p:S.pos;fv1.subVectors(tgt,m.p);const d=fv1.length();fv1.divideScalar(d||1);
    const sp=m.v.length();m.v.lerp(fv1.multiplyScalar(sp),Math.min(1,dt*.5));m.p.addScaledVector(m.v,dt);m.g.lookAt(m.p.clone().add(m.v));if(Math.random()<dt*25)PFX.smoke(m.p.clone(),{n:1,spd:.2,size:[1,3],life:1.2,up:0,c0:.5,c1:.8,alpha:.4});
    for(const q of S.shots)if(q.mine&&segDist(q.prev,q.p,m.p)<3){m.hp-=q.dmg;q.t=0}
    if(d<12&&tgt===S.pos){bigBoom(m.p,40);hurt(45,m.p);m.t=-1}else if(d<10){bigBoom(m.p,30);m.t=-1}else if(m.hp<=0){flyBoom(m.p,1.2);m.t=-1;cr(10);say('Torpedo destroyed',.9)}
    if(m.t<=0){scene.remove(m.g);S.etp.splice(i,1)}}}
