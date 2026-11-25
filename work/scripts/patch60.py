p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
# ---------------- flight HUD markup and styles
rep('<div class="msg" id="msg"></div>','<div class="msg" id="msg"></div>\n  <div class="fhud" id="fhud" hidden><div id="ftg"></div><div class="fbar"><div class="fspd"><b id="fspd">0</b><span>MPH</span></div><div class="fcol"><div class="frow"><span>THROTTLE</span><div class="meter" id="fthr"><i></i></div></div><div class="frow"><span>AFTERBURN</span><div class="meter" id="fbst"><i></i></div></div></div><div class="fcol"><div class="frow"><span>GUNS</span><div class="meter" id="fgun"><i></i></div></div><div class="frow"><span id="fmslT">MISSILES 8</span><div class="meter" id="fmsl"><i></i></div></div><div class="frow"><span id="fmacT">HEAVY CANNON</span><div class="meter" id="fmac"><i></i></div></div></div></div><div class="fshl"><div class="frow"><span>SHIELD</span><div class="meter" id="fsh"><i></i></div></div><div class="frow"><span>HULL</span><div class="meter" id="fhp"><i></i></div></div></div></div>')
rep(".msg.on{opacity:1}",""".msg.on{opacity:1}
.fhud{position:absolute;inset:0;pointer-events:none;font-family:var(--display);font-weight:700;letter-spacing:.12em;text-shadow:0 1px 0 #000;font-size:10px;color:var(--fg)}
.fhud .fbar{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);display:flex;gap:18px;align-items:flex-end}
.fhud .fspd{display:flex;flex-direction:column;align-items:center;min-width:92px}.fhud .fspd b{font-size:34px;line-height:1;font-variant-numeric:tabular-nums;color:#e8f6ff}.fhud .fspd span{font-size:10px;color:var(--dim)}
.fhud .fcol{display:flex;flex-direction:column;gap:4px}.fhud .frow{display:flex;gap:8px;align-items:center}.fhud .frow span{min-width:94px;font-size:9px;color:var(--dim)}
.fhud .meter{width:110px;height:6px}.fhud #fthr i{background:#6fd8ff}.fhud #fbst i{background:#ffb238}.fhud #fgun i{background:#ffd27a}.fhud #fgun.over i{background:var(--hurt)}.fhud #fmsl i{background:#ff7a5a}.fhud #fmac i{background:#c9a6ff}
.fhud .fshl{position:absolute;left:10px;top:10px;display:flex;flex-direction:column;gap:5px}.fhud #fsh i{background:var(--shield)}.fhud #fhp i{background:var(--leaf)}
.fhud .tg{position:absolute;width:26px;height:26px;margin:-13px 0 0 -13px;border:1.5px solid rgba(255,80,60,.85);box-sizing:border-box}
.fhud .tg i{position:absolute;left:50%;top:100%;transform:translateX(-50%);font-style:normal;font-size:8px;color:rgba(255,140,120,.95);white-space:nowrap;margin-top:2px}
.fhud .tg.lk{border-color:#ffb238;border-radius:50%;width:40px;height:40px;margin:-20px 0 0 -20px}.fhud .tg.lk i{color:#ffb238}
@media (max-width:620px){.fhud .fbar{gap:8px;transform:translateX(-50%) scale(.82);transform-origin:bottom center}}""")
# ---------------- flight module
rep("const pb=new T.Group();scene.add(pb);pb.visible=false;",r"""/* ---------- Mission 2: the shuttle Kestrel. Arcade flight: machine guns, homing missiles and a heavy mass-accelerator cannon ---------- */
var FLY=null;const FLV={},MPH=2.23694,fv1=new T.Vector3(),fv2=new T.Vector3(),fv3=new T.Vector3(),fUp=new T.Vector3();
function shuttleModel(){const g=new T.Group(),H=MAT.plate,D=MAT.plateD,A=MAT.accent;
  g.add(mesh(GEO.box,H,2.4,1.4,8,0,0,.4),mesh(GEO.box,D,2.6,.5,7,0,-.75,.6),mesh(GEO.box,A,2.45,.12,6,0,.2,.6));
  {const n=mesh(GEO.cone,H,1.2,3,1.05,0,0,-5.0);n.rotation.x=-Math.PI/2;g.add(n)}
  g.add(mesh(GEO.sph,MAT.pane,.95,.6,1.7,0,.72,-2.3));
  for(const sx of[-1,1]){const w=mesh(GEO.box,H,3.4,.22,3,sx*2.8,-.25,1.4);w.rotation.y=sx*.12;g.add(w);g.add(mesh(GEO.box,A,3.2,.24,.4,sx*2.9,-.25,.1));
    const gp=mesh(GEO.cyl,D,.2,2.2,.2,sx*4.3,-.25,0);gp.rotation.x=Math.PI/2;g.add(gp);
    for(const k of[0,1]){const m=mesh(GEO.cyl,MAT.white,.11,1.5,.11,sx*(1.9+k*.45),-.62,1.2);m.rotation.x=Math.PI/2;g.add(m)}
    const en=mesh(GEO.cyl,D,.55,1.8,.55,sx*.85,0,4.6);en.rotation.x=Math.PI/2;g.add(en);const fn=mesh(GEO.box,D,.15,1.6,1.8,sx*.9,1.1,3.6);fn.rotation.z=-sx*.25;g.add(fn)}
  {const b=mesh(GEO.cyl,D,.24,6,.24,0,-1.05,-1.8);b.rotation.x=Math.PI/2;g.add(b);const r=mesh(GEO.cyl,MAT.strip,.3,.3,.3,0,-1.05,-4.8);r.rotation.x=Math.PI/2;g.add(r)}
  const flames=[];for(const sx of[-1,1]){const q=glow(0x7fd8ff,2.6,.85);q.position.set(sx*.85,0,5.7);g.add(q);flames.push(q)}g.userData.flames=flames;g.rotation.order='YXZ';return g}
function interceptorModel(){const g=new T.Group();g.add(mesh(GEO.box,MAT.armorD,1.5,.9,6,0,0,0));{const n=mesh(GEO.cone,MAT.armorD,.75,2.6,.7,0,0,4.2);n.rotation.x=Math.PI/2;g.add(n)}
  for(const sx of[-1,1]){const w=mesh(GEO.box,MAT.bruteA,4.6,.16,2.2,sx*2.6,0,-.5);w.rotation.y=sx*.4;g.add(w);g.add(mesh(GEO.box,MAT.eye,.22,.22,1.6,sx*4.6,0,-1.3))}
  const e=glow(0xff3030,3.4,.95);e.position.set(0,.3,2.8);g.add(e);const t=glow(0xff7a40,4,.8);t.position.set(0,0,-3.4);g.add(t);return g}
function gunboatModel(){const g=new T.Group();g.add(mesh(GEO.box,MAT.armorD,6,3,18,0,0,0),mesh(GEO.box,MAT.bruteA,7,1,12,0,1.8,-1),mesh(GEO.box,MAT.eye,6.2,.3,.3,0,.6,9));
  for(const sx of[-1,1]){g.add(mesh(GEO.box,MAT.armorD,3,2,10,sx*4.4,-.6,-2));const t=mesh(GEO.cyl,MAT.armor,.9,1,.9,sx*2,2.6,3);g.add(t);const br=mesh(GEO.cyl,MAT.armorD,.22,3.4,.22,sx*2,2.8,4.6);br.rotation.x=Math.PI/2;g.add(br)}
  for(const z of[-6,0,6]){const q=glow(0xff3030,3,.9);q.position.set(0,1.8,z);g.add(q)}{const q=glow(0xff7a40,9,.8);q.position.set(0,0,-10);g.add(q)}return g}
const FTRC=bas({color:0xffe6a0,transparent:true,opacity:.95,blending:T.AdditiveBlending,depthWrite:false,fog:false}),FBOLT=bas({color:0xff4a3a,transparent:true,opacity:.95,blending:T.AdditiveBlending,depthWrite:false,fog:false}),
  FPLAS=bas({color:0xff6a2a,transparent:true,opacity:.9,blending:T.AdditiveBlending,depthWrite:false,fog:false}),FMACM=bas({color:0xd8c4ff,transparent:true,opacity:1,blending:T.AdditiveBlending,depthWrite:false,fog:false});
// near-field dust: short streaks around the camera that stretch with speed, so 500 mph reads as fast
const FDUST=(()=>{const N=260,a=new Float32Array(N*6),g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(a,3));const l=new T.LineSegments(g,new T.LineBasicMaterial({color:0xcfe6ff,transparent:true,opacity:.35,fog:false,depthWrite:false}));l.frustumCulled=false;l.visible=false;scene.add(l);
  const P=[];for(let i=0;i<N;i++)P.push(new T.Vector3((Math.random()-.5)*160,(Math.random()-.5)*160,(Math.random()-.5)*160));return{l,a,P,N}})();
function dustTick(){const D=FDUST,c=cam.position,v=FLY.vel,k=Math.max(.4,FLY.spd*.045);for(let i=0;i<D.N;i++){const q=D.P[i];for(const ax of['x','y','z']){if(q[ax]-c[ax]>80)q[ax]-=160;else if(q[ax]-c[ax]<-80)q[ax]+=160}
  const o=i*6;D.a[o]=q.x;D.a[o+1]=q.y;D.a[o+2]=q.z;const L=k/Math.max(1,FLY.spd);D.a[o+3]=q.x-v.x*L;D.a[o+4]=q.y-v.y*L;D.a[o+5]=q.z-v.z*L}D.l.geometry.attributes.position.needsUpdate=true}
function nearHull(p){return Math.abs(p.x)<125&&p.z>-AZ-40&&p.z<AZ+110&&p.y>-60&&p.y<110}
function segDist(a,b,c){fv1.subVectors(b,a);const L2=fv1.lengthSq()||1e-6;let t=fv2.subVectors(c,a).dot(fv1)/L2;t=Math.max(0,Math.min(1,t));fv3.copy(a).addScaledVector(fv1,t);return fv3.distanceTo(c)}
function flyBoom(p,s){const m=bas({color:0xffc070,transparent:true,opacity:.95,fog:false,blending:T.AdditiveBlending,depthWrite:false}),g=mesh(GEO.sph,m,.5,.5,.5,p.x,p.y,p.z);scene.add(g);blasts.push({g,m,t:0,r:s*9});
  const g2=glow(0xffa040,s*26,.9);g2.position.copy(p);scene.add(g2);fxq.push({t:.35,fn:()=>scene.remove(g2)});sparkle(p,0xffb238,Math.round(14+s*8),18*s);sparkle(p,0xffffff,8,26*s);
  if(cam.position.distanceTo(p)<900)sfx('boom');if(!reduced&&cam.position.distanceTo(p)<120)shake=Math.max(shake,.15)}
function flyEnemy(kind,x,y,z){const g=kind==='gun'?gunboatModel():interceptorModel();g.position.set(x,y,z);scene.add(g);const dir=new T.Vector3(FLY.pos.x-x,FLY.pos.y-y,FLY.pos.z-z).normalize();
  const e={kind,g,p:g.position,dir,hp:kind==='gun'?40:6,max:kind==='gun'?40:6,r:kind==='gun'?11:4.5,sp:kind==='gun'?55:150,st:'attack',t:0,cd:1+Math.random()*2,burst:0,bt:0,bdir:new T.Vector3(),flash:0};FLY.en.push(e);return e}
function flyShot(p,dir,speed,mat,len,w,dmg,mine){const g=mesh(GEO.box,mat,w,w,len,p.x,p.y,p.z);g.lookAt(p.x+dir.x,p.y+dir.y,p.z+dir.z);scene.add(g);FLY.shots.push({g,p:g.position,v:dir.clone().multiplyScalar(speed),t:mine?1.4:3.2,dmg,mine,prev:p.clone()})}
function flyHit(e,n){if(e.hp<=0)return;e.hp-=n;e.flash=.08;sparkle(e.p,0xffd27a,3,8);if(e.hp>0)return;flyBoom(e.p,e.kind==='gun'?2.6:1.3);scene.remove(e.g);FLY.en.splice(FLY.en.indexOf(e),1);FLY.kills++;score+=e.kind==='gun'?600:150;sfx('kill');if(FLY.lockE===e){FLY.lockE=null;FLY.lockP=0}}
function flyAim(out){cam.getWorldDirection(out);return out}
function flyMissile(){const S=FLY;if(!S||state!=='playing'||S.msl<=0||S.mcd>0)return;S.msl--;S.mcd=.45;const tgt=S.lockP>=.6?S.lockE:null;const side=S.mside=-(S.mside||1);
  const g=new T.Group();g.add(mesh(GEO.box,MAT.white,.25,.25,1.6));const fl=glow(0xffa060,2.2,.9);fl.position.z=-.9;g.add(fl);fUp.set(side*1.9,-.62,1.2).applyEuler(S.g.rotation);g.position.copy(S.pos).add(fUp);scene.add(g);
  const dir=flyAim(new T.Vector3());S.msls.push({g,p:g.position,dir,spd:Math.max(S.spd+40,140),t:7,tgt,trail:0});sfx('mortar');if(!tgt&&!S.tipNoLock){S.tipNoLock=1;say('No lock · hold a target in the ring first',2)}}
function flyMAC(){const S=FLY;if(!S||state!=='playing'||S.mac>0)return;S.mac=5;const a=flyAim(new T.Vector3()),o=fUp.set(0,-1.05,-4.9).applyEuler(S.g.rotation).add(S.pos).clone(),end=o.clone().addScaledVector(a,3200);
  let best=null,bd=1e9;for(const e of S.en){const t=fv2.subVectors(e.p,o).dot(a);if(t<0||t>3200)continue;if(segDist(o,end,e.p)<e.r+2.5&&t<bd){bd=t;best=e}}const hitP=best?o.clone().addScaledVector(a,bd):end;
  const L=o.distanceTo(hitP),b=mesh(GEO.box,FMACM,.5,.5,L);b.position.copy(o).lerp(hitP,.5);b.lookAt(hitP);scene.add(b);const fl=glow(0xd8c4ff,14,.95);fl.position.copy(o);scene.add(fl);
  S.beams.push({g:b,t:.28,fl});if(best){flyHit(best,45);flyBoom(hitP,1)}S.spd=Math.max(0,S.spd-18);if(!reduced)shake=Math.max(shake,.35);tone('sawtooth',90,30,.5,.25);tone('square',1600,200,.18,.08);if(!S.tipMac){S.tipMac=1}}
function flyStart(st){const S=FLY={stage:st,pos:new T.Vector3(0,3,205),vel:new T.Vector3(),h:Math.PI,p:0,roll:0,spd:0,thr:0,boost:1,heat:0,over:0,gcd:0,gside:1,mcd:0,msl:8,mslT:0,mac:0,lockE:null,lockP:0,
    en:[],shots:[],msls:[],beams:[],ph:'hangar',kills:0,t:0,tut:0,endT:0,spawned:0};
  S.g=shuttleModel();S.g.position.copy(S.pos);scene.add(S.g);yaw=Math.PI;pitch=0;veh=null;ROW.on=false;rwG.visible=false;LAST={m:2,s:st};
  FLV.fn=scene.fog.near;FLV.ff=scene.fog.far;FLV.cn=cam.near;FLV.cf=cam.far;scene.fog.near=40000;scene.fog.far=90000;cam.near=.3;cam.far=60000;cam.updateProjectionMatrix();FDUST.l.visible=true;
  hp=100;shMax=150;shield=150;shDelay=0;$('hud').hidden=true;$('radar').hidden=true;$('fhud').hidden=false;$('wave').textContent='2-'+st;
  setObj('STAGE 2-1 · LAUNCH · LEAVE THE HANGAR');comm('R',"Easy on the throttle in here. Hangar walls don't move.");say(touchUI?'Left stick throttle · right side steers':'W throttle · mouse steers · Shift afterburner · Space brakes',5)}
function flyExit(){if(!FLY)return;const S=FLY;scene.remove(S.g);for(const e of S.en)scene.remove(e.g);for(const q of S.shots)scene.remove(q.g);for(const m of S.msls)scene.remove(m.g);for(const b of S.beams){scene.remove(b.g);scene.remove(b.fl)}
  FLY=null;scene.fog.near=FLV.fn;scene.fog.far=FLV.ff;cam.near=FLV.cn;cam.far=FLV.cf;cam.updateProjectionMatrix();FDUST.l.visible=false;$('fhud').hidden=true;$('ftg').innerHTML='';engineOff()}
function flyStageDone(){const S=FLY;if(document.pointerLockElement)document.exitPointerLock();setState('paused');for(const id of['ovKeys','classes','loadout','superpick'])$(id).hidden=true;
  $('ovTitle').textContent='Stage 2-1 complete';const txt='Kestrel is clear of Thalassa with '+S.kills+' kills. Next: stage 2-2, the rescue of the Halcyon, coming in the next update.';$('ovText').textContent=txt;
  $('go').textContent='Fly on (free flight)';$('retry').hidden=false;$('retry').textContent='Retry stage 2-1';LAST={m:2,s:1};S.ph='free';setObj('FREE FLIGHT')}
function flyTick(dt){const S=FLY;S.t+=dt;
  // controls: the shuttle turns toward where the camera aims
  if(keys.KeyW||keys.ArrowUp&&false||mvY<-.35)S.thr=Math.min(1,S.thr+.55*dt);if(keys.KeyS||mvY>.35)S.thr=Math.max(0,S.thr-.8*dt);
  if(keys.KeyA)yaw+=1.3*dt;if(keys.KeyD)yaw-=1.3*dt;if(keys.ArrowLeft)yaw+=1.3*dt;if(keys.ArrowRight)yaw-=1.3*dt;if(keys.ArrowUp)pitch=Math.min(1.45,pitch+dt);if(keys.ArrowDown)pitch=Math.max(-1.45,pitch-dt);
  const near=nearHull(S.pos),bk=(keys.ShiftLeft||keys.ShiftRight)&&S.boost>0.02&&!near;if(bk)S.boost=Math.max(0,S.boost-dt/6);else S.boost=Math.min(1,S.boost+dt/9);
  let tgt=bk?224:S.thr*140;if(keys.Space)tgt=0;if(near)tgt=Math.min(tgt,40);S.spd+=(tgt-S.spd)*Math.min(1,dt*(tgt>S.spd?(bk?1.3:.75):(keys.Space?2.2:.8)));
  const dh=ad(yaw,S.h),dp=pitch-S.p,rt=1.75*dt;S.h+=Math.max(-rt,Math.min(rt,dh));S.p+=Math.max(-rt,Math.min(rt,dp));S.roll+=(c1(dh*1.6)*.95-S.roll)*Math.min(1,dt*4);
  const cp=Math.cos(S.p);S.vel.set(-Math.sin(S.h)*cp,Math.sin(S.p),-Math.cos(S.h)*cp).multiplyScalar(S.spd);S.pos.addScaledVector(S.vel,dt);
  if(near||S.pos.y<-40&&Math.abs(S.pos.x)<130){const bx=S.pos.x,by=S.pos.y,bz=S.pos.z;pushOut(S.pos,2.4,true);if(Math.abs(S.pos.x-bx)+Math.abs(S.pos.y-by)+Math.abs(S.pos.z-bz)>1e-3){S.spd*=.6;if(!reduced)shake=Math.max(shake,.12);hurt(2)}
    if(inHull(S.pos.x,S.pos.z)&&S.pos.y<2.6)S.pos.y=2.6}
  {const R=S.pos.length();if(R>14000){S.pos.multiplyScalar(14000/R);if(msgT<=0)say('Edge of the operation area',1.4)}}
  S.g.position.copy(S.pos);S.g.rotation.set(S.p,S.h,S.roll);for(const q of S.g.userData.flames)q.scale.setScalar((1.2+S.spd/60)*(bk?1.8:1)*(.9+Math.random()*.2));
  pos.copy(S.pos);eye.copy(S.pos);vy=0;
  if(shDelay>0)shDelay-=dt;else shield=Math.min(shMax,shield+22*dt);
  if(!eng)engineOn();if(eng){eng.o.frequency.value=38+S.spd*.55;eng.g.gain.value=muted?0:0.035*CFG.vol}
  // weapons
  S.gcd-=dt;S.mcd-=dt;S.mac=Math.max(0,S.mac-dt);S.over=Math.max(0,S.over-dt);S.heat=Math.max(0,S.heat-28*dt);if(S.msl<8){S.mslT+=dt;if(S.mslT>4){S.mslT=0;S.msl++}}
  const aim=flyAim(fv3.clone()),conv=cam.position.clone().addScaledVector(aim,700);
  if((firing||padFire)&&S.gcd<=0&&S.over<=0&&S.ph!=='hangar'){S.gcd=.07;S.gside=-S.gside;const m=fUp.set(S.gside*4.3,-.25,-1.2).applyEuler(S.g.rotation).add(S.pos).clone(),d=conv.clone().sub(m).normalize();
    d.x+=(Math.random()-.5)*.006;d.y+=(Math.random()-.5)*.006;d.normalize();flyShot(m,d,900+S.spd,FTRC,7,.13,1,true);S.heat+=4.2;if(S.heat>=100){S.over=1.6;S.heat=100;say('Guns overheated',1)}tone('square',220,90,.05,.025)}
  // lock: the enemy nearest the centre of the screen, inside a 12 degree cone
  {let best=null,bd=.978;for(const e of S.en){fv1.subVectors(e.p,cam.position);const d=fv1.length();if(d>1900)continue;const c=fv1.dot(aim)/d;if(c>bd){bd=c;best=e}}
    if(best&&best===S.lockE)S.lockP+=dt;else{S.lockE=best;S.lockP=0}if(S.lockE&&S.lockP>=.6&&!S.tipLock){S.tipLock=1;say('Locked · G fires a homing missile · F fires the heavy cannon',3.5)}}
  // shots
  for(let i=S.shots.length-1;i>=0;i--){const q=S.shots[i];q.prev.copy(q.p);q.p.addScaledVector(q.v,dt);q.t-=dt;let gone=q.t<=0;
    if(q.mine){for(const e of S.en){if(segDist(q.prev,q.p,e.p)<e.r){flyHit(e,q.dmg);gone=true;break}}}
    else if(segDist(q.prev,q.p,S.pos)<3.6){hurt(q.dmg);gone=true;if(state!=='playing')return}
    if(gone){scene.remove(q.g);S.shots.splice(i,1)}}
  for(let i=S.msls.length-1;i>=0;i--){const m=S.msls[i];m.t-=dt;m.spd=Math.min(320,m.spd+160*dt);if(m.tgt&&S.en.includes(m.tgt)){fv1.subVectors(m.tgt.p,m.p).normalize();m.dir.lerp(fv1,Math.min(1,dt*3.2)).normalize()}
    m.p.addScaledVector(m.dir,m.spd*dt);m.g.lookAt(m.p.x+m.dir.x,m.p.y+m.dir.y,m.p.z+m.dir.z);m.trail-=dt;if(m.trail<=0){m.trail=.04;sparkle(m.p,0xc8c8c8,1,1.5)}
    let boom=m.t<=0;for(const e of S.en)if(e.p.distanceTo(m.p)<e.r+6){boom=true;break}
    if(boom){flyBoom(m.p,1.1);for(const e of S.en.slice()){const d=e.p.distanceTo(m.p);if(d<e.r+26)flyHit(e,d<e.r+8?14:7)}scene.remove(m.g);S.msls.splice(i,1)}}
  for(let i=S.beams.length-1;i>=0;i--){const b=S.beams[i];b.t-=dt;b.g.material.opacity=Math.max(0,b.t/.28);if(b.t<=0){scene.remove(b.g);scene.remove(b.fl);S.beams.splice(i,1)}}
  // enemies
  for(const e of S.en.slice()){const to=fv1.subVectors(S.pos,e.p),d=to.length()||1;e.cd-=dt;e.bt-=dt;
    if(e.kind==='int'){if(e.st==='break'){e.t-=dt;fv2.copy(e.bdir);if(e.t<=0)e.st='attack'}else{fv2.copy(to).addScaledVector(S.vel,d/450).normalize();if(d<170){e.st='break';e.t=1.6+Math.random()*1.6;e.bdir.set(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize().addScaledVector(e.dir,.6).normalize()}}
      e.dir.lerp(fv2,Math.min(1,dt*1.5)).normalize();e.p.addScaledVector(e.dir,e.sp*dt);
      if(e.st==='attack'&&d<850&&e.dir.dot(fv2.copy(to).divideScalar(d))>.975&&e.cd<=0){e.cd=2.2+Math.random()*1.2;e.burst=3}
      if(e.burst>0&&e.bt<=0){e.bt=.12;e.burst--;const ld=fv2.copy(to).addScaledVector(S.vel,d/520).normalize();ld.x+=(Math.random()-.5)*.03;ld.y+=(Math.random()-.5)*.03;ld.normalize();flyShot(e.p.clone().addScaledVector(e.dir,4),ld,520,FBOLT,4,.3,3,false)}}
    else{const want=fv2.copy(to);if(d<650)want.cross(fUp.set(0,1,0));want.normalize();e.dir.lerp(want,Math.min(1,dt*.6)).normalize();e.p.addScaledVector(e.dir,e.sp*dt);
      if(d<1300&&e.cd<=0){e.cd=1.7;const ld=fv2.copy(to).addScaledVector(S.vel,d/300).normalize();const g=new T.Group();g.add(mesh(GEO.sph,FPLAS,1.2,1.2,1.2),glow(0xff6a2a,9,.9));g.position.copy(e.p);g.lookAt(e.p.x+ld.x,e.p.y+ld.y,e.p.z+ld.z);scene.add(g);
        S.shots.push({g,p:g.position,v:ld.clone().multiplyScalar(300),t:6,dmg:9,mine:false,prev:e.p.clone()});sfx('spit')}}
    e.g.lookAt(e.p.x+e.dir.x,e.p.y+e.dir.y,e.p.z+e.dir.z)}
  // the stage
  if(S.ph==='hangar'&&S.pos.z>330){S.ph='w1';comm('C',"Contacts ahead, Kestrel. Four interceptors. Weapons free.");say(touchUI?'Fire to shoot':'Click to fire the machine guns',3);
    for(let i=0;i<4;i++)flyEnemy('int',(Math.random()-.5)*700,(Math.random()-.5)*300+40,1600+Math.random()*500)}
  else if(S.ph==='w1'&&!S.en.length){S.ph='w2';comm('C',"Second flight inbound, with a gunboat. It throws plasma. Keep moving.");
    for(let i=0;i<5;i++)flyEnemy('int',(Math.random()-.5)*900,(Math.random()-.5)*400,S.pos.z+1500+Math.random()*600);flyEnemy('gun',0,60,S.pos.z+1800)}
  else if(S.ph==='w2'&&!S.en.length){S.ph='end';S.endT=0;comm('C',"Lanes are clear. Kestrel, new orders. The transport Halcyon is being boarded off your bow, with survivors aboard. Go get them.");comm('R',"Then we go get them.")}
  else if(S.ph==='end'){S.endT+=dt;if(S.endT>4&&!commCur&&!COMMS.length&&!VOICE.busy||S.endT>40){flyStageDone();return}}
  const n=S.en.length;setObj(S.ph==='hangar'?'STAGE 2-1 · LAUNCH · LEAVE THE HANGAR':S.ph==='end'?'STAGE 2-1 · STAND BY · FLEET COMMAND':S.ph==='free'?'FREE FLIGHT':'STAGE 2-1 · DESTROY THE INTERCEPTORS · '+n+' LEFT')}
function flyCam(dt){const S=FLY,sh=shake>0?shake*.35:0;cam.rotation.set(pitch+(Math.random()-.5)*sh*.05,yaw+(Math.random()-.5)*sh*.05,S.roll*.2);cam.updateMatrixWorld();cam.getWorldDirection(fv2);fUp.set(0,1,0).applyQuaternion(cam.quaternion);
  const back=nearHull(S.pos)?11:14+S.spd*.02;cam.position.copy(S.pos).addScaledVector(fv2,-back).addScaledVector(fUp,3.6);cam.updateMatrixWorld();dustTick()}
const FTG=[];function flyHud(){const S=FLY;$('fspd').textContent=Math.round(S.spd*MPH);$('fthr').firstElementChild.style.width=S.thr*100+'%';$('fbst').firstElementChild.style.width=S.boost*100+'%';
  const gb=$('fgun');gb.firstElementChild.style.width=S.heat+'%';gb.classList.toggle('over',S.over>0);$('fmslT').textContent='MISSILES '+S.msl+(S.lockE?(S.lockP>=.6?' · LOCKED':' · LOCKING'):'');$('fmsl').firstElementChild.style.width=S.msl/8*100+'%';
  $('fmacT').textContent=S.mac>0?'HEAVY CANNON '+S.mac.toFixed(1)+' S':'HEAVY CANNON READY';$('fmac').firstElementChild.style.width=(1-S.mac/5)*100+'%';
  $('fsh').firstElementChild.style.width=shield/shMax*100+'%';$('fhp').firstElementChild.style.width=hp+'%';$('score').textContent=score.toLocaleString();
  const box=$('ftg'),W=cv.clientWidth,H=cv.clientHeight;let k=0;for(const e of S.en){fv1.copy(e.p).project(cam);if(fv1.z>1||Math.abs(fv1.x)>1.1||Math.abs(fv1.y)>1.1)continue;let d=FTG[k];if(!d){d=document.createElement('div');d.className='tg';d.appendChild(document.createElement('i'));box.appendChild(d);FTG[k]=d}
    d.hidden=false;d.style.left=((fv1.x*.5+.5)*W)+'px';d.style.top=((-fv1.y*.5+.5)*H)+'px';const lk=e===S.lockE;d.classList.toggle('lk',lk);d.firstChild.textContent=(lk?(S.lockP>=.6?'LOCK ':'... '):'')+Math.round(e.p.distanceTo(S.pos))+' M';k++}
  for(let i=k;i<FTG.length;i++)FTG[i].hidden=true}
const pb=new T.Group();scene.add(pb);pb.visible=false;""")
# ---------------- hooks into the game loop, input, state and death
rep("function update(dt){allyTick(dt);","function update(dt){if(FLY){flyTick(dt);weaponFxTick(dt);return}allyTick(dt);")
rep("if(state!=='menu'){radar();hud()}","if(state!=='menu'){if(FLY)flyHud();else{radar();hud()}}")
rep("  if(INTRO.on){}\n  else if(state==='menu')","  if(INTRO.on){}\n  else if(FLY&&state!=='menu'){flyCam(dt)}\n  else if(state==='menu')")
rep("vm.visible=state!=='menu'&&!veh&&cineT<=0&&!INTRO.on;","vm.visible=state!=='menu'&&!veh&&cineT<=0&&!INTRO.on&&!FLY;")
rep("function grenade(){const wk=weapon;","function grenade(){if(FLY){flyMissile();return}const wk=weapon;")
rep("function melee(){const wk=weapon;","function melee(){if(FLY){flyMAC();return}const wk=weapon;")
rep("function surge(K){","function surge(K){if(FLY)return;")
rep("function openWheel(){","function openWheel(){if(FLY)return;")
rep("function toggleVeh(){","function toggleVeh(){if(FLY)return;")
rep("function startReload(){","function startReload(){if(FLY)return;")
rep("function swap(w,dir=1){","function swap(w,dir=1){if(FLY)return;")
rep("mission=null;bossN=0;gap=1.2;endT=0;","flyExit();mission=null;bossN=0;gap=1.2;endT=0;")
rep("$('pad').hidden=!(play&&touchUI&&!(INTRO&&INTRO.on));","if(FLY){$('hud').hidden=true;$('radar').hidden=true;$('fhud').hidden=!game}\n  $('pad').hidden=!(play&&touchUI&&!(INTRO&&INTRO.on));")
rep("$('go').textContent='New game';syncCont();LAST={m:1,s:Math.max(1,wave)};$('retry').hidden=false;$('retry').textContent='Retry stage 1-'+LAST.s}",
    "$('go').textContent='New game';syncCont();if(FLY){$('ovTitle').textContent='Kestrel lost';$('ovText').textContent='The shuttle broke up with '+FLY.kills+' kills.';LAST={m:2,s:FLY.stage}}else LAST={m:1,s:Math.max(1,wave)};$('retry').hidden=false;$('retry').textContent='Retry stage '+LAST.m+'-'+LAST.s}")
rep("const mood=INTRO.on?'intro':state!=='playing'&&state!=='paused'?'calm':mission&&","const mood=INTRO.on?'intro':state!=='playing'&&state!=='paused'?'calm':FLY?(FLY.en.length?'combat':'calm'):mission&&")
# ---------------- Level 2 cutscene: reuse the intro player with its own shots, title and a callback
rep("function introStart(){for(const q of INTRO.shots)vwarm(q.text);INTRO.on=true;","function introStart(shots,after,sub){INTRO.shots=shots||INTRO1;INTRO.after=after||null;$('cineTitle').lastChild.textContent=sub||'Level 1 · The Thalassa encounter';for(const q of INTRO.shots)vwarm(q.text);INTRO.on=true;")
rep("function introEnd(){if(!INTRO.on)return;INTRO.on=false;voiceStop();introClear();introShow(false);for(const[k,t]of STORY.intro)comm(k,t)}",
    "function introEnd(){if(!INTRO.on)return;INTRO.on=false;voiceStop();introClear();introShow(false);if(INTRO.after){const f=INTRO.after;INTRO.after=null;f()}else for(const[k,t]of STORY.intro)comm(k,t)}")
rep("if(i!==INTRO.i){INTRO.i=i;$('cineText').textContent=q.text;introClear();if(q.text)speak(q.text,'N');else voiceStop();",
    """if(i!==INTRO.i){INTRO.i=i;$('cineText').textContent=q.text;introClear();if(q.text)speak(q.text,q.k||'N');else voiceStop();
    if(q.act==='board'||q.act==='launch'){const g=shuttleModel();g.position.set(0,2.2,205);g.rotation.set(0,Math.PI,0);scene.add(g);INTRO.actors.push({g,pos:g.position,shuttle:true})}
    if(q.act==='board'){const g=new T.Group(),rg=walkerRig(g,8);g.position.set(-9,.95,188);scene.add(g);INTRO.actors.push({g,pos:g.position,rig:rg,mv:1,vy:0,kick:0,ph:0,crouch:0,jet:0,burst:0,ch:0,ft:0,rowan:true})}""")
rep("  for(const a of INTRO.actors){if(q.act==='drones'){","""  for(const a of INTRO.actors){if(a.shuttle){if(q.act==='launch'){const k=Math.max(0,(t-1)/(q.d-1));a.pos.set(0,2.2+k*16,205+k*k*520);for(const f of a.g.userData.flames)f.scale.setScalar(1.5+k*4)}if(q.act==='launch')cam.lookAt(a.pos);continue}
    if(a.rowan){a.pos.x=-9+Math.min(1,t/5.5)*7.2;a.pos.z=188+Math.min(1,t/5.5)*13;a.mv=t<5.5?1:0;a.g.rotation.y=Math.atan2(7.2,13);try{a.rig.anim(a,time,dt)}catch(err){}continue}
    if(q.act==='drones'){""")
rep("cam.position.set(L(q.p[0],q.p[3]),L(q.p[1],q.p[4]),L(q.p[2],q.p[5]));cam.lookAt(L(q.l[0],q.l[3]),L(q.l[1],q.l[4]),L(q.l[2],q.l[5]));",
    "cam.position.set(L(q.p[0],q.p[3]),L(q.p[1],q.p[4]),L(q.p[2],q.p[5]));if(q.act!=='launch')cam.lookAt(L(q.l[0],q.l[3]),L(q.l[1],q.l[4]),L(q.l[2],q.l[5]));else{const a=INTRO.actors.find(x=>x.shuttle);if(a)cam.lookAt(a.pos)}")
rep("var INTRO={on:false,t:0,i:-1,grace:0,actors:[],shots:[","var INTRO1,INTRO={on:false,t:0,i:-1,grace:0,actors:[],after:null,shots:[")
rep("function introShow(on){","""INTRO1=INTRO.shots;
const L2SHOTS=[{d:4.5,title:1,p:[380,120,780,380,120,780],l:[0,10,150,0,10,150],text:''},
 {d:8,k:'C',p:[420,140,820,330,100,660],l:[0,10,150,0,10,180],text:'Thalassa, this is Fleet Command. Your shuttle, Kestrel, is fueled in Hangar Two. Meridian Station is waiting for you.'},
 {d:8,act:'board',k:'R',p:[-15,3.2,186,-11,2.4,192],l:[0,1.6,205,0,1.8,205],text:"Seed case is strapped in. I'm riding in the back, and I've still got the pruner if anything gets close."},
 {d:7,act:'launch',p:[55,22,330,40,18,360],l:[0,10,250,0,10,250],text:'Two survivors and one shuttle. Every machine between Thalassa and Meridian Station has turned against them.'},
 {d:7,k:'C',p:[0,40,600,0,60,700],l:[700,900,3400,700,900,3400],text:"Kestrel, be advised. The Wellmonger's interceptors are hunting the lanes. Guns hot the moment you clear the hull."}];
function introShow(on){""")
# ---------------- mission list and start
rep("{m:2,s:1,t:'Launch',d:'Shuttle · interceptors',ready:false}","{m:2,s:1,t:'Launch',d:'Shuttle · interceptors and a gunboat',ready:true}")
rep("function startAt(m,s){LAST={m,s};NOSAVE=false;","function startAt(m,s,skip){LAST={m,s};NOSAVE=false;\n  if(m===2){begin(true);NOSAVE=true;if(skip)flyStart(s);else introStart(L2SHOTS,()=>flyStart(s),'Level 2 · Flight to Meridian Station');return}")
rep("$('retry').addEventListener('click',()=>startAt(LAST.m,LAST.s));","$('retry').addEventListener('click',()=>startAt(LAST.m,LAST.s,true));")
# the Level 1 ending offers Mission 2
rep("$('go').textContent='Keep fighting';speak(txt,'N');","$('go').textContent='Keep fighting';$('retry').hidden=false;$('retry').textContent='Start Level 2';LAST={m:2,s:1};speak(txt,'N');")
rep("Level 2, the ground invasion, is not built yet. You can keep fighting endless stages aboard the station.","Start Level 2 to take the shuttle out, or keep fighting endless stages aboard the station.")
open(p,'w').write(s);print('ok')
