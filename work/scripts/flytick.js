function flyTick(dt){const S=FLY;
S.t+=dt;
fcFlashTick(dt);
if(FC.on&&fcTick(S,dt))return;
if(meriScript(S,dt)||l3Script(S,dt))return;
flyUpright(S,dt);

  // controls: the shuttle turns toward where the camera aims
  if(keys.KeyW||keys.ArrowUp&&false||mvY<-.35)S.thr=Math.min(1,S.thr+.55*dt);
if(keys.KeyS||mvY>.35)S.thr=Math.max(0,S.thr-.8*dt);

  {const yg=ysg();
if(keys.KeyA)yaw+=1.3*dt*yg;
if(keys.KeyD)yaw-=1.3*dt*yg;
if(keys.ArrowLeft)yaw+=1.3*dt*yg;
if(keys.ArrowRight)yaw-=1.3*dt*yg;
if(keys.ArrowUp)pitch=pcap(pitch+dt);
if(keys.ArrowDown)pitch=pcap(pitch-dt)}
  const near=!S.noHull&&nearHull(S.pos);
if(S.boost<.04)S.abLock=1;
else if(S.boost>.33)S.abLock=0;

  const autoAB=CFG.auto!==false&&!S.abLock&&S.ph!=='hangar'&&S.ph!=='dock'&&S.ph!=='arrive'&&(keys.KeyW||mvY<-.35)&&S.thr>.98,bk=(((keys.ShiftLeft||keys.ShiftRight)||autoAB)&&S.boost>0.02||FC.on&&FC.k==='out')&&!near;
S.bk=bk;
if(bk)S.boost=Math.max(0,S.boost-dt/6);
else S.boost=Math.min(1,S.boost+dt/9);

  let tgt=bk?S.ship.boost:S.thr*S.ship.cruise;
if(keys.Space&&!FC.on)tgt=0;
if(near)tgt=Math.min(tgt,40);
S.spd+=(tgt-S.spd)*Math.min(1,dt*(tgt>S.spd?(bk?1.3:.75):(keys.Space?2.2:.8)));

  const dh=ad(yaw,S.h),dp=pitch-S.p,rt=S.ship.turn*dt;
S.h+=Math.max(-rt,Math.min(rt,dh));
S.p+=Math.max(-rt,Math.min(rt,dp));
S.roll+=(c1(dh*1.6*(Math.cos(S.p)<0?-1:1))*.95-S.roll)*Math.min(1,dt*(Math.abs(S.roll)>1.2?2.6:4));

  const cp=Math.cos(S.p);
S.vel.set(-Math.sin(S.h)*cp,Math.sin(S.p),-Math.cos(S.h)*cp).multiplyScalar(S.spd);

  // around Thalassa, move in short steps and push out of the hull so nothing can be flown through, even at 500 mph
  if(!S.noHull&&(hullZone(S.pos)||hullZone(fv1.copy(S.pos).addScaledVector(S.vel,dt)))){const L=S.spd*dt,nst=Math.max(1,Math.ceil(L/1.5));
let hit=false;

    for(let k=0;
k<nst;
k++){S.pos.addScaledVector(S.vel,dt/nst);
const bx=S.pos.x,by=S.pos.y,bz=S.pos.z;
pushOut(S.pos,2.4,true);
if(inHull(S.pos.x,S.pos.z)&&S.pos.y<2.6&&S.pos.y>-4)S.pos.y=2.6;
if(Math.abs(S.pos.x-bx)+Math.abs(S.pos.y-by)+Math.abs(S.pos.z-bz)>1e-3){hit=true;
break}}
    if(hit){const imp=S.spd;
S.spd*=imp>45?.3:.6;
if(!reduced)shake=Math.max(shake,imp>45?.4:.12);
if(imp>45&&S.t-(S.crashT||-9)>.6){S.crashT=S.t;
hurt(Math.min(60,imp*.14));
sfx('boom');
sparkle(S.pos,0xffd27a,16,10);
if(msgT<=0)say('Hull impact',1)}}}
  else S.pos.addScaledVector(S.vel,dt);

  if(S.halc&&shipPush(S.halc,S.pos,2.4))flyCrash(S);
if(S.meri&&shipPush(S.meri,S.pos,2.4))flyCrash(S);

  // no wall at the edge of the operation area: Fleet Command calls you back, and far out the autopilot turns you round
  {const R=S.pos.length(),LIM=S.stage===3||S.stage>30?40000:15000;
if(R>LIM&&S.t-(S.farT||-99)>12){S.farT=S.t;
comm('C',"Kestrel, you are leaving the operation area. Come about.")}if(R>LIM+4000){const tw=Math.atan2(S.pos.x,S.pos.z);
yaw+=ad(tw,yaw)*Math.min(1,dt*.8);
pitch+=(-Math.atan2(S.pos.y,Math.hypot(S.pos.x,S.pos.z))-pitch)*Math.min(1,dt*.8)}}
  if(FC.on&&FC.k==='in'&&FC.t<FC.hand)fcPlace(S);
S.g.position.copy(S.pos);
S.g.rotation.set(S.p,S.h,S.roll);
shuttleAnim(S.g,S.spd,bk,S.roll,S.msl,S.mac,S.ph==='hangar'&&S.spd<10,dt);

  pos.copy(S.pos);
eye.copy(S.pos);
vy=0;

  if(hp<50&&!S.smk){S.smk=PFX.emit(o=>{o.set(0,.2,3.4).applyEuler(S.g.rotation).add(S.pos);
return true},{rate:22,dur:Infinity,alive:()=>{const ok=FLY===S&&hp<50;
if(!ok)S.smk=null;
return ok},fire:false,ss:[1,4.5],sup:0,slife:2.4,far:800,c0:.12,c1:.38,alpha:.65})}
  if(S.smk)S.smk.fire=hp<25;

  if(shDelay>0)shDelay-=dt;
else shield=Math.min(shMax,shield+15*dt);

  if(!eng)engineOn();
{const tr=Math.min(1,Math.abs(dh)*3+Math.abs(dp)*3),sp=S.spd/224;
engSet(36+S.spd*.32,.05+(bk?.03:0),280+sp*1900+tr*700+(bk?600:0),.02+sp*.09+tr*.07+(bk?.07:0))}
  // weapons
  S.gcd-=dt;
S.mcd-=dt;
S.mac=Math.max(0,S.mac-dt);
S.over=Math.max(0,S.over-dt);
S.heat=Math.max(0,S.heat-28*dt);
if(S.msl<S.ship.msl){S.mslT+=dt;
if(S.mslT>4){S.mslT=0;
S.msl++}}
  const aim=flyAim(fv3.clone()),conv=cam.position.clone().addScaledVector(aim,700);

  if((firing||padFire)&&!FC.on&&S.gcd<=0&&S.over<=0&&S.ph!=='hangar'){S.gcd=S.ship.gunCd;
S.gside=-S.gside;
const m=fUp.set(S.gside*2.3,-.5,-3.2).applyEuler(S.g.rotation).add(S.pos).clone(),d=conv.clone().sub(m).normalize();

    d.x+=(Math.random()-.5)*.006;
d.y+=(Math.random()-.5)*.006;
d.normalize();
flyShot(m,d,900+S.spd,FTRC,7,.13,S.ship.gunDmg,true);
S.heat+=S.ship.heat;
if(S.heat>=100){S.over=1.6;
S.heat=100;
say('Guns overheated',1)}gun(GUNS.fmg)}
  // lock: the enemy nearest the centre of the screen, inside a 12 degree cone
  {let best=null,bd=.978;
for(const e of S.en){if(e.kind==='mine')continue;
fv1.subVectors(e.p,cam.position);
const d=fv1.length();
if(d>1900)continue;
const c=fv1.dot(aim)/d;
if(c>bd){bd=c;
best=e}}
    if(best&&best===S.lockE)S.lockP+=dt;
else{S.lockE=best;
S.lockP=0}if(S.lockE&&S.lockP>=.6&&!S.tipLock){S.tipLock=1;
say('Locked · G fires a homing missile · F fires the heavy cannon',3.5)}}
  // shots
  for(let i=S.shots.length-1;
i>=0;
i--){const q=S.shots[i];
q.prev.copy(q.p);
q.p.addScaledVector(q.v,dt);
q.t-=dt;
let gone=q.t<=0;

    if(q.mine){for(const e of S.en){if(segDist(q.prev,q.p,e.p)<e.r){flyHit(e,q.dmg);
gone=true;
break}}}
    else if(segDist(q.prev,q.p,S.pos)<3.6){hurt(q.dmg,HSRC.copy(q.p).addScaledVector(q.v,-.3));
gone=true;
if(state!=='playing')return}
    if(gone){scene.remove(q.g);
S.shots.splice(i,1)}}
  for(let i=S.msls.length-1;
i>=0;
i--){const m=S.msls[i];
m.t-=dt;
m.spd=Math.min(320,m.spd+160*dt);
if(m.tgt&&S.en.includes(m.tgt)){fv1.subVectors(m.tgt.p,m.p).normalize();
m.dir.lerp(fv1,Math.min(1,dt*3.2)).normalize()}
    m.p.addScaledVector(m.dir,m.spd*dt);
m.g.lookAt(m.p.x+m.dir.x,m.p.y+m.dir.y,m.p.z+m.dir.z);
m.trail-=dt;
if(m.trail<=0){m.trail=.04;
sparkle(m.p,0xc8c8c8,1,1.5)}
    let boom=m.t<=0;
for(const e of S.en)if(e.p.distanceTo(m.p)<e.r+6){boom=true;
break}
    if(boom){flyBoom(m.p,1.1);
for(const e of S.en.slice()){const d=e.p.distanceTo(m.p);
if(d<e.r+26)flyHit(e,d<e.r+8?14:7)}scene.remove(m.g);
S.msls.splice(i,1)}}
  for(let i=S.beams.length-1;
i>=0;
i--){const b=S.beams[i];
b.t-=dt;
b.g.material.opacity=Math.max(0,b.t/.28);
if(b.t<=0){scene.remove(b.g);
scene.remove(b.fl);
S.beams.splice(i,1)}}
  // enemy homing missiles
  S.warn=false;
S.warnD=1e9;
if(S.emsl)for(let i=S.emsl.length-1;
i>=0;
i--){const m=S.emsl[i];
m.t-=dt;
m.spd=Math.min(270,m.spd+90*dt);
fv1.subVectors(S.pos,m.p);
const dd=fv1.length();
fv1.divideScalar(dd||1);

    const ang=Math.acos(Math.max(-1,Math.min(1,m.dir.dot(fv1)))),mx=m.turn*dt;
if(ang>1e-4)m.dir.lerp(fv1,Math.min(1,mx/ang)).normalize();
m.p.addScaledVector(m.dir,m.spd*dt);
m.g.lookAt(m.p.x+m.dir.x,m.p.y+m.dir.y,m.p.z+m.dir.z);

    m.tr-=dt;
if(m.tr<=0){m.tr=.03;
PFX.smoke(m.p,{n:1,spd:.2,size:[.8,3],life:1.4,up:0,c0:.55,c1:.8,alpha:.5})}
    if(dd<2500&&m.t>0){S.warn=true;
S.warnD=Math.min(S.warnD,dd)}
    if(dd<9){flyBoom(m.p,1.2);
scene.remove(m.g);
S.emsl.splice(i,1);
hurt(30,m.p);
if(msgT<=0)say('Missile hit',1);
if(state!=='playing')return;
continue}
    if(m.t<=0){flyBoom(m.p,.8);
scene.remove(m.g);
S.emsl.splice(i,1)}}
  if(S.warn){S.beep=(S.beep||0)-dt;
if(S.beep<=0){S.beep=.12+Math.min(.5,S.warnD/2500*.5);
tone('square',1500,1500,.05,.035)}}
  // enemies
  for(const e of S.en.slice()){const to=fv1.subVectors(S.pos,e.p),d=to.length()||1;
e.cd-=dt;
e.bt-=dt;

    if(e.kind==='int'){if(e.st==='break'){e.t-=dt;
fv2.copy(e.bdir);
if(e.t<=0)e.st='attack'}else{fv2.copy(to).addScaledVector(S.vel,d/450).normalize();
if(d<170){e.st='break';
e.t=1.6+Math.random()*1.6;
e.bdir.set(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize().addScaledVector(e.dir,.6).normalize()}}
      e.dir.lerp(fv2,Math.min(1,dt*1.5)).normalize();
e.p.addScaledVector(e.dir,e.sp*dt);

      if(e.st==='attack'&&d<850&&e.dir.dot(fv2.copy(to).divideScalar(d))>.975&&e.cd<=0){e.cd=2.2+Math.random()*1.2;
e.burst=3}
      if(e.burst>0&&e.bt<=0){e.bt=.12;
e.burst--;
const ld=fv2.copy(to).addScaledVector(S.vel,d/520).normalize();
ld.x+=(Math.random()-.5)*.03;
ld.y+=(Math.random()-.5)*.03;
ld.normalize();
flyShot(e.p.clone().addScaledVector(e.dir,4),ld,520,FBOLT,4,.3,5,false)}}
    else if(e.kind==='ace'){const A=e.ace||(e.ace={mt:5,ph:0,jt:0,jk:2,gt:2,gb:0,gbt:0,jd:new T.Vector3()});
A.mt-=dt;
A.jk-=dt;
A.jt-=dt;
A.gt-=dt;
A.gbt-=dt;

      // at two thirds and one third health: two interceptors join, a missile comes at once, and the ace flies faster
      {const ph=e.hp<e.max/3?2:e.hp<e.max*2/3?1:0;
if(ph>A.ph){A.ph=ph;
e.sp=175+ph*30;
for(let k=0;
k<2;
k++)flyEnemy('int',e.p.x+(Math.random()-.5)*400,e.p.y+(Math.random()-.5)*150,e.p.z+(Math.random()-.5)*400);
A.mt=Math.min(A.mt,.8);
say(ph===1?'The ace calls in two interceptors':'The ace is hurt. Missiles incoming, keep turning',3)}}
      // when you line up behind it, it jinks hard to one side
      {cam.getWorldDirection(ACEV);
const tv=fv6.subVectors(e.p,S.pos).normalize();
if(A.jk<=0&&d<1100&&ACEV.dot(tv)>.985){A.jk=1.4+Math.random()*1.2;
A.jt=.9;
A.jd.crossVectors(e.dir,fUp.set(Math.random()-.5,Math.random()-.5,Math.random()-.5)).normalize()}}
      // attack runs, a hard break past you, then round again
      if(e.st==='break'){e.t-=dt;
fv2.copy(e.bdir);
if(e.t<=0)e.st='attack'}else{fv2.copy(to).addScaledVector(S.vel,d/600).normalize();
if(d<230){e.st='break';
e.t=2+Math.random()*1.4;
e.bdir.set(Math.random()-.5,(Math.random()-.5)*.6,Math.random()-.5).normalize().addScaledVector(e.dir,.8).normalize()}}
      if(A.jt>0)fv2.addScaledVector(A.jd,1.1).normalize();
e.dir.lerp(fv2,Math.min(1,dt*(A.jt>0?3.2:1.8))).normalize();
e.p.addScaledVector(e.dir,e.sp*dt);

      // twin guns: short bursts whenever it has you in front
      if(e.st==='attack'&&d<750&&e.dir.dot(fv5.copy(to).divideScalar(d))>.97&&A.gt<=0){A.gt=1.1+Math.random()*.6;
A.gb=6}
      if(A.gb>0&&A.gbt<=0){A.gbt=.08;
A.gb--;
const ld=fv5.copy(to).addScaledVector(S.vel,d/600).normalize();
ld.x+=(Math.random()-.5)*.025;
ld.y+=(Math.random()-.5)*.025;
ld.normalize();
flyShot(e.p.clone().addScaledVector(e.dir,6),ld,600,FBOLT,4,.3,5,false)}
      // heavy cannon: two big, slow rounds on each lined-up pass
      if(e.st==='attack'&&d<1000&&e.dir.dot(fv2.copy(to).divideScalar(d))>.96&&e.cd<=0){e.cd=2.2;
e.burst=3}
      if(e.burst>0&&e.bt<=0){e.bt=.28;
e.burst--;
const ld=fv2.copy(to).addScaledVector(S.vel,d/420).normalize(),g=new T.Group();
g.add(mesh(GEO.sph,FPLAS,.9,.9,.9),glow(0xff7a2a,7,.9));
g.position.copy(e.p).addScaledVector(e.dir,8);
scene.add(g);

        S.shots.push({g,p:g.position,v:ld.clone().multiplyScalar(420),t:4,dmg:20,mine:false,prev:g.position.clone()});
gun(GUNS.ace)}
      // a homing missile about every ten seconds
      if(A.mt<=0&&d<1800){A.mt=(A.ph?7:9)+Math.random()*3;
aceMissile(S,e)}}
    else if(e.kind==='mine'){e.g.rotation.y+=dt*.6;
if(d<160)e.p.addScaledVector(to,Math.min(d,40*dt)/d);
if(d<24){flyBoom(e.p,1.6);
scene.remove(e.g);
S.en.splice(S.en.indexOf(e),1);
hurt(18,e.p);
if(state!=='playing')return;
continue}}
    else if(e.kind==='pod'){if(d<900&&e.cd<=0){e.cd=1.8+Math.random();
e.burst=4}if(e.burst>0&&e.bt<=0){e.bt=.15;
e.burst--;
const ld=fv2.copy(to).addScaledVector(S.vel,d/480).normalize();
ld.x+=(Math.random()-.5)*.04;
ld.y+=(Math.random()-.5)*.04;
ld.normalize();
flyShot(e.p.clone().addScaledVector(ld,4),ld,480,FBOLT,4,.3,4,false)}}
    else{const want=fv2.copy(to);
if(d<650)want.cross(fUp.set(0,1,0));
want.normalize();
e.dir.lerp(want,Math.min(1,dt*.6)).normalize();
e.p.addScaledVector(e.dir,e.sp*dt);

      if(d<1300&&e.cd<=0){e.cd=1.7;
const ld=fv2.copy(to).addScaledVector(S.vel,d/300).normalize();
const g=new T.Group();
g.add(mesh(GEO.sph,FPLAS,1.2,1.2,1.2),glow(0xff6a2a,9,.9));
g.position.copy(e.p);
g.lookAt(e.p.x+ld.x,e.p.y+ld.y,e.p.z+ld.z);
scene.add(g);

        S.shots.push({g,p:g.position,v:ld.clone().multiplyScalar(300),t:6,dmg:9,mine:false,prev:e.p.clone()});
sfx('spit')}}
    if(!S.noHull&&hullZone(e.p))pushOut(e.p,e.r,true);

    {const dd=e.p.distanceTo(S.pos);
if(dd<e.r+2.6&&S.t-(e.ramT||-9)>.5){e.ramT=S.t;
fv2.subVectors(S.pos,e.p).normalize();
S.pos.addScaledVector(fv2,e.r+2.8-dd);
hurt(e.kind==='gun'?30:24,e.p);
S.spd*=e.kind==='gun'?.3:.55;
if(!reduced)shake=Math.max(shake,.45);
sfx('boom');
if(msgT<=0)say('Collision',1);
flyHit(e,e.kind==='gun'?8:99);
if(state!=='playing')return;
continue}}
    if(e.kind!=='pod'&&e.kind!=='mine')e.g.lookAt(e.p.x+e.dir.x,e.p.y+e.dir.y,e.p.z+e.dir.z)}
  if(S.ph==='to2'){stage2Setup(S);
fcStart('in',S,'STAGE 2-2','RESCUE THE HALCYON')}if(S.ph==='to3'){stage3Setup(S);
fcStart('in',S,'STAGE 2-3','THE RUN TO MERIDIAN')}
  wingTick(S,dt);
halcTick(S,dt);
meriTick(S,dt);

  // the stage
  if(S.stage===3){if(stage3Tick(S,dt))return}else if(S.stage===2){if(stage2Tick(S,dt))return}else if(S.stage===4){stage4Tick(S,dt)}else if(S.stage>30){if(l3Tick(S,dt))return}else{
  if(S.ph==='hangar'&&S.pos.z>330){S.ph='w1';
comm('C',"Contacts ahead, Kestrel. Four interceptors. Weapons free.");
say(touchUI?'Fire to shoot':'Click to fire the machine guns',3);

    for(let i=0;
i<4;
i++)flyEnemy('int',(Math.random()-.5)*700,(Math.random()-.5)*300+40,1600+Math.random()*500)}
  else if(S.ph==='w1'&&!S.en.length){S.ph='w2';
comm('C',"Second flight inbound, with a gunboat. It throws plasma. Keep moving.");

    for(let i=0;
i<5;
i++)flyEnemy('int',(Math.random()-.5)*900,(Math.random()-.5)*400,S.pos.z+1500+Math.random()*600);
flyEnemy('gun',0,60,S.pos.z+1800)}
  else if(S.ph==='w2'&&!S.en.length){S.ph='end';
S.endT=0;
comm('C',"Lanes are clear. Kestrel, new orders. The transport Halcyon is being boarded off your bow, with survivors aboard. Go get them.");
comm('R',"Then we go get them.")}
  else if(S.ph==='end'){S.endT+=dt;
if(S.endT>4&&!commCur&&!COMMS.length&&!VOICE.busy||S.endT>40){if(!FC.on)fcStart('out',S)}}
  const n=S.en.length;
setObj(S.ph==='hangar'?'STAGE 2-1 · LAUNCH · LEAVE THE HANGAR':S.ph==='end'?'STAGE 2-1 · STAND BY · FLEET COMMAND':S.ph==='free'?'FREE FLIGHT':'STAGE 2-1 · DESTROY THE INTERCEPTORS · '+n+' LEFT')}}