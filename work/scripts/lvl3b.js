// ---------- flight stages 3-1, 3-3 and 4-1
function farAim(obj,want){if(!obj)return;FAR.quaternion.identity();FAR.updateMatrixWorld(true);const d=obj.getWorldPosition(new T.Vector3()).sub(FAR.position).normalize();FAR.quaternion.setFromUnitVectors(d,want.clone().normalize())}
function farJup(){if(!FARX.jup)FARX.jup=FAR.children.find(o=>o.isMesh&&Math.abs(o.scale.x-1300)<1)||null;return FARX.jup}
function l3Common(S,st){msgT=0;$('msg').classList.remove('on');S.l3=true;S.stage=st;S.noHull=true;S.wing=null;$('wave').textContent=L3N[st];LAST={m:st===41?5:4,s:st===41?1:st===31?1:3};S.fleet=[];S.lastOut=new T.Vector3();S.inSh=false;
  worldShow(false);if(FARX.belt)FARX.belt.visible=false;if(FARX.dg)FARX.dg.visible=false;l3FxClear()}
function l3Start(S,st){l3Common(S,st);
  if(st===31){hubBuild();HUB.g.visible=true;if(HUB.ysign)for(const o of HUB.ysign)o.visible=false;FAR.rotation.set(-2.529,2.006,-2.617);if(HUB.myShip)HUB.myShip.visible=false;meriSortie(S);S.l3to=true;fadeSet(1);fade(0,1.2);fcTitle('STAGE 3-1','FIRST STRIKE');
    comm('C',"Kestrel, you're cleared to launch. The Wellmonger's command ship is holding station over Europa, and you carry the only Nova warhead we have left. Make it count.");
    comm('R',"Imani is down there. Let's end this before it starts.");return}
  if(st===33){const D=S.dr=dreadModel();scene.add(D.g);l3Fleet(S,true);farAim(FARX.eur,new T.Vector3(1,-.3,.2));
    const P=D.g.localToWorld(D.bayP.clone());P.y+=2.4;S.pos.copy(P);S.h=-Math.PI/2;S.p=0;S.roll=0;S.spd=0;S.thr=0;yaw=S.h;pitch=0;S.ph='launch';S.toT=0;S.noDie=15;S.ct=25;
    S.g.position.copy(S.pos);S.g.rotation.set(0,S.h,0);fadeSet(1);fade(0,1.2);fcTitle('STAGE 3-3','THE ESCAPE');
    comm('R',"Strapped in. Go, go, go! That charge doesn't care whose side we're on.");return}
  if(st===41){eurBuild();EUR.g.visible=true;if(FARX.eur)FARX.eur.visible=false;farAim(farJup(),new T.Vector3(.38,.26,-.89));S.fogC=scene.fog.color.getHex();scene.fog.color.setHex(0x0b121a);scene.fog.near=2500;scene.fog.far=24000;
    renderer.toneMappingExposure=FLV.ex*.9;S.pos.set(0,1700,8800);S.h=0;S.p=-.3;S.roll=0;yaw=0;pitch=-.3;S.V=new T.Vector3(0,-38,-180);S.spd=S.V.length();S.fuel=1;S.ph='fall';S.fT=0;S.noDie=5;hp=22;shield=0;S.grooves=[];
    S.g.position.copy(S.pos);fadeSet(1);fade(0,2.2);fcTitle('LEVEL 4','EUROPA');
    comm('R',"Engines are gone! The retro thrusters still answer. Hold W to burn them, it's all we've got!");comm('R',"Flat ice dead ahead. Keep her nose up and bleed off the speed.");return}}
// the rest of the Dark's fleet, already arrived (3-3) or jumping in (3-1)
const FLEET=[[-6000,900,-3000,.16,.6],[-5000,-1400,4000,.16,2.2],[-9000,400,1000,.2,3.6],[-3500,2600,-8000,.12,5],[-2500,-2800,7500,.12,7.5],
  [2500,1800,-6500,.035,1.4],[3500,-1500,6800,.035,2.9],[1500,2600,3000,.035,4.3],[-1500,3000,-2500,.035,6.2],[6000,2200,-4500,.035,8.8],[5500,-2600,3500,.035,10.4]];
function l3Fleet(S,now){for(const[x,y,z,k,t]of FLEET){const g=fleetShip(k),p=new T.Vector3(x,y,z),n=new T.Vector3(4000,0,0).sub(p).normalize();n.y*=.3;n.normalize();scene.add(g);const f={g,k,n,sp:60+k*200};S.fleet.push(f);
  if(now){g.position.copy(p).addScaledVector(n,-1400*k/.16);g.lookAt(g.position.clone().add(n));g.rotateY(Math.PI)}else{g.visible=false;f.at=t;f.p=p}}}
function l3Arrive(S){if(HUB.g&&!HUB.on)HUB.g.visible=false;FAR.rotation.set(0,0,0);farAim(FARX.eur,new T.Vector3(-1,-.42,-.25));
  const D=S.dr=dreadModel();scene.add(D.g);l3Fleet(S,false);
  S.pos.set(9800,250,600);S.h=Math.PI/2;S.p=0;S.roll=0;yaw=S.h;pitch=-.02;S.spd=120;S.thr=.6;S.ph='approach';S.ft=0;S.lastOut.copy(S.pos);S.g.position.copy(S.pos);S.g.rotation.set(0,S.h,0);
  fcStart('in',S,'STAGE 3-1','FIRST STRIKE');comm('C',"That's her. The Wellmonger's command ship. Ten kilometres of hull.");comm('C',"Close to seven kilometres and launch the Nova warhead.")}
function l3FcDone(S,k){if(k==='out'&&S.stage===31&&S.ph==='jump'){l3Arrive(S);return}l3Done(S.stage)}
// G (or the missile button) launches the warhead once it is armed
function l3Nuke(S){if(!S.nukeArm||FC.on)return false;S.nukeArm=false;S.ph='warhead';const g=new T.Group();g.add(mesh(GEO.cyl,MAT.white,.6,4,.6,0,0,0));g.children[0].rotation.x=Math.PI/2;g.add(glow(0xfff0d0,26,1));
  g.position.copy(S.pos).add(L3A.set(0,-2,0));scene.add(g);S.nk={g,p:g.position,dir:flyAim(new T.Vector3()),spd:S.spd+80,tr:0};comm('R',"Warhead away!");say('NOVA WARHEAD AWAY',2.5);tone('sawtooth',120,600,.6,.08);return true}
function l3Shield(S,dt){const D=S.dr;if(!D||!D.sh)return;const u=D.sh.material.uniforms;u.uT.value+=dt;u.uHT.value+=dt;D.shA=Math.max(.05,(D.shA||.05)-dt*.12);u.uA.value=D.shOff?0:D.shA;D.sh.visible=!D.shOff||u.uA.value>0;
  if(D.shOff)return;if(S.stage===33){D.shA=Math.min(D.shA,.03);return}const inn=inShield(S,S.pos);
  S.repT=Math.max(0,(S.repT||0)-dt);if(inn&&!S.inSh){const slowOK=S.landOK&&S.spd<=89.4&&S.repT<=0;if(!slowOK){L3A.copy(S.lastOut);D.g.worldToLocal(L3A);L3A.divide(SHR).normalize().multiply(SHR).normalize();S.pos.copy(S.lastOut).addScaledVector(L3A,30);S.lastOut.copy(S.pos);S.spd=Math.min(S.spd,35);S.h+=Math.PI;yaw+=Math.PI;S.repT=1.2;shieldHit(S,S.pos,.35);D.shA=Math.max(D.shA,.25);
      if(S.t-(S.bumpT||-9)>1.2){S.bumpT=S.t;hurt(6,S.pos);sfx('boom');if(!reduced)shake=Math.max(shake,.3);say(S.landOK?'TOO FAST FOR THE SHIELD · UNDER 200 MPH':'THE SHIELD IS UP',2.5);if(S.landOK&&!S.bumpTip){S.bumpTip=1;comm('R',"Too fast! Under two hundred at the shield or it swats us.")}}}
    else{S.inSh=true;shieldHit(S,S.pos,.25);say('Through the shield',1.5);tone('sine',300,120,.5,.05)}}
  else if(!inn){S.inSh=false;S.lastOut.copy(S.pos)}}
// keep the player out of the fleet ships (an oriented box per ship)
function l3FleetPush(S,dt){for(const f of S.fleet){if(!f.g.visible)continue;if(f.st==='move'){L3B.set(0,0,-1).applyQuaternion(f.g.quaternion);f.g.position.addScaledVector(L3B,f.sp*.25*dt)}
  if(f.g.position.distanceTo(S.pos)>6000*f.k+400)continue;L3A.copy(S.pos);f.g.worldToLocal(L3A);const hx=1150*f.k+3,hy=320*f.k+3,hz=5600*f.k+3;
  if(Math.abs(L3A.x)<hx&&Math.abs(L3A.y)<hy&&Math.abs(L3A.z)<hz){const m=[hx-Math.abs(L3A.x),hy-Math.abs(L3A.y),hz-Math.abs(L3A.z)],k=m.indexOf(Math.min(...m));if(k===0)L3A.x=Math.sign(L3A.x)*hx;else if(k===1)L3A.y=Math.sign(L3A.y)*hy;else L3A.z=Math.sign(L3A.z)*hz;f.g.localToWorld(L3A);S.pos.copy(L3A);flyCrash(S)}}}
function l3Portal(S,p,n,R,cb){return portalOpen(S,p,n,R,null,{onOut:cb})}
// three arrivals staged across the player's view: a cruiser bursting through left to right, a frigate right to left close
// in, and a heavy cruiser high and far, each through a portal bigger than the last
function l3Show(S){const fw=new T.Vector3(-Math.sin(S.h),0,-Math.cos(S.h)),rt=new T.Vector3(Math.cos(S.h),0,-Math.sin(S.h)),up=new T.Vector3(0,1,0);
  [[.4,2700,950,-1900,1,.16,1100],[2.2,1700,-380,1400,-1,.035,260],[4.4,5200,2000,-500,1,.22,1500]].forEach(([t,f,u,r,sd,k,R])=>{const p=S.pos.clone().addScaledVector(fw,f).addScaledVector(up,u).addScaledVector(rt,r),n=rt.clone().multiplyScalar(sd).addScaledVector(fw,-.25).normalize();
    const g=fleetShip(k);g.visible=false;scene.add(g);const F={g,k,n,sp:60+k*200,p,at:undefined};S.fleet.push(F);setTimeout(()=>{if(FLY===S&&S.ph!=='done')portalOpen(S,p,n,R,g,{sp:F.sp,v0:k*52000})},t*1000)})}
function l3Ints(S,n,dist,gun){const fw=L3B.set(-Math.sin(S.h),0,-Math.cos(S.h)),rt=new T.Vector3(Math.cos(S.h),0,-Math.sin(S.h));for(let i=0;i<n;i++){const p=S.pos.clone().addScaledVector(fw,dist).addScaledVector(rt,(Math.random()-.5)*1400).add(new T.Vector3(0,(Math.random()-.5)*500,0)),nn=S.pos.clone().sub(p).normalize();
  l3Portal(S,p,nn,45,()=>{const e=flyEnemy(gun&&!i?'gun':'int',p.x+nn.x*40,p.y+nn.y*40,p.z+nn.z*40);e.dir.copy(nn);e.cd=2.5})}}
function l3Tick(S,dt){const D=S.dr;if(D&&shipPush(D,S.pos,2.4))flyCrash(S);l3Shield(S,dt);l3FleetPush(S,dt);
  for(const f of S.fleet)if(f.at!==undefined&&S.ph!=='approach'&&S.ph!=='armed'&&S.ph!=='warhead'&&S.ph!=='det'&&S.ph!=='brief'&&S.ph!=='takeoff'&&S.ph!=='jump'&&S.ft>=f.at){f.at=undefined;f.g.visible=false;f.g.position.copy(f.p);const fp=portalOpen(S,f.p,f.n,Math.max(120,f.k*3800),f.g,{sp:f.sp,v0:f.k*42000});fp.done=()=>{f.st='move'}}
  for(const f of S.fleet)if(!f.st&&f.g.visible&&f.at===undefined&&!L3FX.some(q=>q.ship===f.g))f.st='move';
  if(S.stage===31)return l3Tick31(S,dt);if(S.stage===33)return l3Tick33(S,dt);return false}
function l3Tick31(S,dt){const D=S.dr;
  if(S.l3to&&S.ph==='free'){S.l3to=false;S.ph='brief';S.bt=0;setObj('STAGE 3-1 · CLEAR OF MERIDIAN · STAND BY TO JUMP');comm('R',"Clear of the station. Plotting the jump to Europa.")}
  if(S.ph==='brief'){S.bt+=dt;if(HUB.mer&&shipPush(HUB.mer,S.pos,2.4))S.spd*=.5;if(S.bt>6&&!FC.on){S.ph='jump';fcStart('out',S)}return false}
  if(!D)return false;const dc=S.pos.length(),km=v=>(v/1000).toFixed(1)+' KM';S.navP=S.navP||new T.Vector3();
  if(S.ph==='approach'){S.navP.set(0,0,0);S.navL='COMMAND SHIP';setObj('STAGE 3-1 · CLOSE TO WARHEAD RANGE · '+km(Math.max(0,dc-7000)));if(dc<7000){S.ph='armed';S.nukeArm=true;comm('C',"You're in range, Kestrel. Launch the warhead.");say(touchUI?'MISSILE BUTTON · LAUNCH THE NOVA WARHEAD':'G · LAUNCH THE NOVA WARHEAD',6)}}
  else if(S.ph==='armed'){S.navP.set(0,0,0);S.navL='COMMAND SHIP';setObj(touchUI?'STAGE 3-1 · MISSILE BUTTON · LAUNCH THE NOVA WARHEAD':'STAGE 3-1 · G · LAUNCH THE NOVA WARHEAD')}
  else if(S.ph==='warhead'){const N=S.nk;N.spd=Math.min(700,N.spd+160*dt);L3B.copy(D.g.position).sub(N.p).normalize();N.dir.lerp(L3B,Math.min(1,dt*1.6)).normalize();N.p.addScaledVector(N.dir,N.spd*dt);N.g.lookAt(N.p.clone().add(N.dir));
    N.tr-=dt;if(N.tr<=0){N.tr=.05;bigFire(N.p,70,1.4,0xffd8b0,.5,false)}S.navP.copy(N.p);S.navL='WARHEAD';setObj('STAGE 3-1 · WARHEAD · '+km(Math.max(0,N.p.distanceTo(D.g.position)-2000)));
    if(inShield(S,N.p)){scene.remove(N.g);S.nk=null;S.ph='det';S.dt=0;flashW();shieldHit(S,N.p,3.2);D.shA=.7;bigFire(N.p,7000,4.5,0xfff0e0,1);bigFire(N.p,4200,7,0xffa050,.85);
      const sh=new T.Mesh(new T.TorusGeometry(1,.02,8,96),bas({color:0xffe0c0,transparent:true,opacity:.8,blending:T.AdditiveBlending,depthWrite:false,fog:false}));sh.position.copy(N.p);sh.lookAt(S.pos);scene.add(sh);L3FX.push({kind:'ring',g:sh,t:0,R:9000,life:4});
      sfx('boom');setTimeout(()=>sfx('boom'),250);tone('sawtooth',50,20,3,.12);if(!reduced)shake=.8}}
  else if(S.ph==='det'){S.dt+=dt;setObj('STAGE 3-1 · DIRECT HIT');S.navP.set(0,0,0);S.navL='COMMAND SHIP';
    if(S.dt>2.5&&!S.l1){S.l1=1;comm('R',"Direct hit. Tell me that was a direct hit.");comm('C',"It was. Full yield, right on their shield. And... nothing. Not a mark on her.");comm('R',"Then the shield's the problem. Something inside that ship is feeding it.")}
    if(S.dt>9){S.ph='fleet';S.ft=0}}
  else if(S.ph==='fleet'||S.ph==='land'){S.ft+=dt;
    if(!S.f0){S.f0=1;comm('C',"Jump signatures! Multiple! They're coming through right on top of you!");say('JUMP SIGNATURES · MULTIPLE',3);l3Show(S)}
    if(S.ft>1.8&&!S.f1){S.f1=1;comm('R',"That's not a fleet. That's the whole sky.")}
    if(S.ft>3&&!S.w1){S.w1=1;l3Ints(S,4,1500)}if(S.ft>9&&!S.w2){S.w2=1;l3Ints(S,4,1700)}if(S.ft>16&&!S.w3){S.w3=1;l3Ints(S,4,1800,true)}
    if(S.ft>11&&!S.landOK){S.landOK=true;S.ph='land';comm('C',"Kestrel, you can't fight that. Listen: their shield lets slow traffic through. Their own landers cross it under two hundred.");comm('C',"Get aboard that ship and find what feeds the shield.");comm('R',"Starboard side, there's a bay with its lights on. Slow down before the shield.")}
    if(S.ft>24&&S.t-(S.wT||0)>22&&S.en.filter(e=>e.kind==='int').length<3){S.wT=S.t;l3Ints(S,3,1600)}
    const bayW=D.g.localToWorld(L3B.set(1520,20,0)).clone();S.navP.copy(bayW);S.navL=S.landOK?'LANDING BAY':'COMMAND SHIP';
    setObj(S.landOK?'STAGE 3-1 · LAND IN THE STARBOARD BAY · UNDER 200 MPH THROUGH THE SHIELD · UNDER 70 TO LAND · '+km(S.pos.distanceTo(bayW)):'STAGE 3-1 · JUMP SIGNATURES · STAY ALIVE · '+S.en.length+' HOSTILES');
    if(S.landOK){L3A.copy(S.pos);D.g.worldToLocal(L3A);const inBay=L3A.x>1150&&L3A.x<1405&&Math.abs(L3A.z)<190&&L3A.y>-40&&L3A.y<85;
      if(inBay&&S.spd<70){S.ph='landing';S.toT=0;S.l0=S.pos.clone();S.lh0=S.h;S.lv0=S.spd;for(const e of S.en)scene.remove(e.g);S.en.length=0;for(const q of S.shots)scene.remove(q.g);S.shots.length=0;if(S.emsl){for(const m of S.emsl)scene.remove(m.g);S.emsl.length=0}
        comm('R',"We're in. Nobody shoot anything yet.");setObj('STAGE 3-1 · LANDING');D.bay.userData.L.intensity=2*LP}
      else if(inBay&&S.t-(S.slowT||-9)>3){S.slowT=S.t;say('Too fast to land: under 70',1.5)}}}
  return false}
function l3Tick33(S,dt){const D=S.dr;S.navP=S.navP||new T.Vector3();const eu=FARX.eur?FARX.eur.getWorldPosition(new T.Vector3()).sub(FAR.position).normalize():new T.Vector3(1,-.3,.2);S.navP.copy(S.pos).addScaledVector(eu,20000);S.navL='EUROPA';
  if(S.ph==='clear'){S.ct-=dt;const s=Math.max(0,Math.ceil(S.ct));setObj('STAGE 3-3 · GET CLEAR · THE CHARGE BLOWS IN 0:'+String(s).padStart(2,'0')+' · '+(S.pos.length()/1000).toFixed(1)+' KM');
    if(S.ct<10&&!S.c10){S.c10=1;comm('R',"Ten seconds! Don't look back.")}if(S.ct<=0){S.ph='boom';S.bt=0;S.bq=0}}
  else if(S.ph==='boom'){S.bt+=dt;S.bq-=dt;setObj('STAGE 3-3 · THE COMMAND SHIP IS GOING UP');
    if(S.bq<=0&&S.bt<7){S.bq=.16;const z=(Math.random()-.5)*10000,w=drW(z)*.85;const p=D.g.localToWorld(new T.Vector3((Math.random()-.5)*2*w,(Math.random()-.5)*300,z));bigFire(p,500+Math.random()*900,2.6,Math.random()<.5?0xffa040:0xff6a30,.95)}
    const u=D.sh.material.uniforms;if(S.bt<1.6){D.shA=.4+S.bt*.4;shieldHit(S,D.g.position,4)}else if(!D.shOff){D.shOff=true;bigFire(D.g.position,16000,2.5,0xd090ff,.7);tone('sine',800,60,1.4,.1)}
    if(S.bt>1.8&&!S.b1){S.b1=1;flashW();bigFire(D.g.localToWorld(new T.Vector3(0,0,1500)),9000,5,0xfff0e0,1);bigFire(D.g.position,6000,8,0xff8a40,.9);sfx('boom');setTimeout(()=>sfx('boom'),300);tone('sawtooth',45,18,3.5,.14);
      const sh=new T.Mesh(new T.TorusGeometry(1,.015,8,128),bas({color:0xffd0a0,transparent:true,opacity:.8,blending:T.AdditiveBlending,depthWrite:false,fog:false}));sh.position.copy(D.g.position);sh.lookAt(S.pos);scene.add(sh);L3FX.push({kind:'ring',g:sh,t:0,R:16000,life:5})}
    if(S.bt>2&&!S.brk){S.brk=[[D.parts.prow,new T.Vector3(-15,-8,-45),new T.Vector3(.004,0,.012)],[D.parts.stern,new T.Vector3(20,10,40),new T.Vector3(-.005,0,-.01)],[D.parts.mid,new T.Vector3(0,-14,0),new T.Vector3(0,.003,.006)]];S.ft2=0}
    if(S.bt>3.6&&!S.b2){S.b2=1;if(!reduced)shake=.9;sfx('boom');comm('R',"Look at it. Look at it burn.");comm('C',"Shield's down! The command ship is breaking up! Kestrel, outstanding!")}
    if(S.bt>7){S.ph='tail';S.tt=0;S.k0=S.kills;comm('R',"Company. Nine of them, right on our tail.");const bk=L3B.set(Math.sin(S.h),0,Math.cos(S.h));for(let i=0;i<9;i++){const p=S.pos.clone().addScaledVector(bk,1300+Math.random()*700).add(new T.Vector3((Math.random()-.5)*900,(Math.random()-.5)*400,(Math.random()-.5)*900));const e=flyEnemy('int',p.x,p.y,p.z);e.cd=1.5+Math.random()*2}}}
  else if(S.ph==='tail'){S.tt+=dt;const n=S.en.filter(e=>e.kind==='int').length;setObj(S.ace?'STAGE 3-3 · THE ACE · SABLE · HEAD FOR EUROPA':'STAGE 3-3 · '+n+' ON YOUR TAIL · HEAD FOR EUROPA');
    if(S.tt>5&&!S.t1){S.t1=1;comm('C',"Kestrel, we can't reach you. Run for Europa, we'll find you there.")}
    if(!S.ace&&(S.tt>32||S.kills-S.k0>=5||S.floorHit)){const bk=L3B.set(Math.sin(S.h),0,Math.cos(S.h)),p=S.pos.clone().addScaledVector(bk,1900);S.ace=flyEnemy('ace',p.x,p.y+150,p.z);S.at=0;S.ace.g.traverse(o=>{if(o.isMesh&&o.material&&o.material.color&&!o.material.map){o.material=o.material.clone();o.material.color.multiply(new T.Color(1,.75,.75))}});
      comm('C',"One more contact, coming in fast. It's an ace. A new one.");comm('R',"Fleet chatter calls it Sable. It's playing with us.")}
    if(S.ace){S.at+=dt;if((S.at>16||S.floorHit&&S.at>6)&&!S.km){const A=S.ace;const g=new T.Group();g.add(mesh(GEO.cyl,MAT.white,.35,2.4,.35,0,0,0),glow(0xff3020,6,1));g.children[0].rotation.x=Math.PI/2;g.position.copy(A.p);scene.add(g);S.km={g,p:g.position,dir:A.dir.clone(),spd:320};
        comm('R',"Missile! It's not breaking off! It's not breaking off!");tone('sawtooth',180,1200,.5,.08)}
      if(S.km){const K=S.km;K.spd=Math.min(520,K.spd+200*dt);L3B.copy(S.pos).sub(K.p);const dd=L3B.length();K.dir.lerp(L3B.divideScalar(dd||1),Math.min(1,dt*6)).normalize();K.p.addScaledVector(K.dir,K.spd*dt);K.g.lookAt(K.p.clone().add(K.dir));
        S.warn=true;S.warnD=dd;if(dd<14){scene.remove(K.g);S.km=null;flyBoom(S.pos,2.4);hp=14;shield=0;S.ph='down';S.toT=0;for(const q of S.shots)scene.remove(q.g);S.shots.length=0;if(S.emsl){for(const m of S.emsl)scene.remove(m.g);S.emsl.length=0}
          comm('R',"We're hit! We're hit! The engines are gone!");comm('C',"Kestrel, you're going down over Europa. Brace! Brace!")}}}}
  // the wreck drifts apart and keeps burning
  if(S.brk){S.ft2+=dt;S.bf=(S.bf||0)-dt;for(const[g,v,w]of S.brk){g.position.addScaledVector(v,dt);g.rotation.x+=w.x*dt;g.rotation.y+=w.y*dt;g.rotation.z+=w.z*dt}
    if(S.bf<=0&&S.ft2<60){S.bf=.35;for(const[g]of S.brk){const z=g===D.parts.prow?-1800:g===D.parts.stern?2000:(Math.random()<.5?-1800:2000);const p=g.localToWorld(new T.Vector3((Math.random()-.5)*1400,(Math.random()-.5)*300,z));bigFire(p,450+Math.random()*500,1.8,0xff7a30,.8)}}}
  return false}
// scripted phases: landing in the command ship's bay (3-1), the launch and the fall (3-3), all of 4-1
function l3Script(S,dt){if(!S.l3)return false;l3FxTick(S,dt);let x,y,z,h,p,v;
  if(S.stage===41)return l3Fall(S,dt);
  if(S.stage===31&&S.ph==='landing'){S.toT+=dt;const t=S.toT,D=S.dr,P1=D.g.localToWorld(D.bayP.clone()).add(L3B.set(0,2.4,0)),u=sm01(t/5);x=S.l0.x+(P1.x-S.l0.x)*u;z=S.l0.z+(P1.z-S.l0.z)*u;y=S.l0.y+(P1.y-S.l0.y)*sm01((t-.6)/4.4);h=S.lh0+ad(Math.PI/2,S.lh0)*u;p=0;v=Math.max(0,S.lv0*(1-t/3));
    if(t>4.2&&!S.fd){S.fd=1;fade(1,1)}if(t>5.4){l3Done(31);return true}}
  else if(S.stage===33&&S.ph==='launch'){S.toT+=dt;const t=S.toT,P0=S.dr.g.localToWorld(S.dr.bayP.clone()).add(L3B.set(0,2.4,0));h=-Math.PI/2;p=0;
    if(t<1.6){x=P0.x;y=P0.y+sm01(t/1.6)*6;z=P0.z;v=3}else{const u=Math.min(1,(t-1.6)/2.6),e=u*u;x=P0.x+e*420;y=P0.y+6+e*20;z=P0.z;v=20+e*200}
    if(t>4.2){S.ph='clear';S.thr=.8;S.spd=180;yaw=h;pitch=0;comm('R',"Twenty-five seconds. Fly!");return false}}
  else if(S.stage===33&&S.ph==='down'){S.toT+=dt;const t=S.toT;S.h+=1.1*dt;S.roll+=2.4*dt;S.p+=(-.7-S.p)*Math.min(1,dt*.9);v=170;h=S.h;p=S.p;S.vel.set(-Math.sin(h)*Math.cos(p),Math.sin(p),-Math.cos(h)*Math.cos(p)).multiplyScalar(v);
    S.warn=false;x=S.pos.x+S.vel.x*dt;y=S.pos.y+S.vel.y*dt;z=S.pos.z+S.vel.z*dt;yaw=h;pitch=p*.6;S.bf=(S.bf||0)-dt;if(S.bf<=0){S.bf=.06;PFX.fire(S.pos.clone(),{n:2})}
    if(t>3.8&&!S.fd){S.fd=1;fade(1,1.8)}if(t>6){l3Done(33);return true}}
  else return false;
  S.pos.set(x,y,z);S.h=h;S.p=p;S.spd=v;if(!(S.stage===33&&S.ph==='down'))S.roll*=.9;S.g.position.copy(S.pos);S.g.rotation.set(S.p,S.h,S.roll);shuttleAnim(S.g,v,false,0,S.msl,S.mac,v<10,dt);pos.copy(S.pos);eye.copy(S.pos);vy=0;
  if(!eng)engineOn();engSet(36+v*.32,.05,280+v*9,.02+v/2400);if(S.stage===33&&S.ph==='down'&&!reduced)shake=Math.max(shake,.25);return true}
function l3Clear(S){l3FxClear();if(S.dr){scene.remove(S.dr.g);S.dr=null}for(const f of S.fleet||[])scene.remove(f.g);S.fleet=[];if(S.nk){scene.remove(S.nk.g);S.nk=null}if(S.km){scene.remove(S.km.g);S.km=null}
  if(EUR)EUR.g.visible=false;if(FARX.eur)FARX.eur.visible=true;FAR.quaternion.identity();if(FARX.belt)FARX.belt.visible=true;if(FARX.dg)FARX.dg.visible=true;if(S.fogC!==undefined)scene.fog.color.setHex(S.fogC);if(HUB.g&&!HUB.on)HUB.g.visible=false;S.l3to=false}

// ---------- Level 4: Europa. The Kestrel falls with dead engines; the retro thrusters (W) are all you have.
let EUR=null;
function eurH(x,z){const ax=Math.abs(x),m=Math.min(1,Math.max(0,(ax-650)/900));const plain=2.2*Math.sin(x*.004+1)*Math.sin(z*.0031)+1.4*Math.sin(z*.011+x*.002);
  const n1=Math.sin(x*.0021+Math.sin(z*.0013)*2.1)*Math.cos(z*.0017-x*.0006);const rid=Math.pow(1-Math.abs(Math.sin(x*.0047+z*.0011+Math.sin(z*.0021)*1.7)),4)*70+Math.pow(1-Math.abs(Math.sin(z*.0039-x*.0019)),5)*45;
  const far=Math.max(0,(Math.hypot(x,z+1500)-10000)/3000);return plain+m*(n1*28+rid)+far*far*500}
function eurBuild(){if(EUR)return EUR;const g=new T.Group();scene.add(g);
  const tex=paint(1024,(c,S)=>{c.fillStyle='#c6d4de';c.fillRect(0,0,S,S);for(let i=0;i<5000;i++){const v=180+Math.random()*60|0;c.fillStyle='rgba('+(v-14)+','+(v-4)+','+v+','+(.08+Math.random()*.12)+')';c.fillRect(Math.random()*S,Math.random()*S,2+Math.random()*14,2+Math.random()*14)}
    for(let k=0;k<26;k++){let x=Math.random()*S,y=Math.random()*S,a=Math.random()*6.28;c.strokeStyle='rgba(84,108,128,'+(.25+Math.random()*.3)+')';c.lineWidth=.8+Math.random()*2.2;c.beginPath();c.moveTo(x,y);for(let s=0;s<30;s++){a+=(Math.random()-.5)*.5;x+=Math.cos(a)*14;y+=Math.sin(a)*14;c.lineTo(x,y)}c.stroke()}
    for(let k=0;k<10;k++){const x=Math.random()*S,y=Math.random()*S,r=30+Math.random()*90;const gr=c.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(150,172,190,.35)');gr.addColorStop(1,'rgba(150,172,190,0)');c.fillStyle=gr;c.fillRect(x-r,y-r,2*r,2*r)}});
  tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.repeat.set(70,70);
  const N=300,SZ=30000,geo=new T.PlaneGeometry(SZ,SZ,N,N);geo.rotateX(-Math.PI/2);geo.translate(0,0,-1500);const P=geo.attributes.position,col=new Float32Array(P.count*3);
  for(let i=0;i<P.count;i++){const x=P.getX(i),z=P.getZ(i),y=eurH(x,z);P.setY(i,y);const n=Math.sin(x*.0009+z*.0007)*.5+.5,hi=Math.min(1,Math.max(0,y/90));const r=.74+hi*.2-n*.08,gg=.82+hi*.14-n*.06,b=.9+hi*.08-n*.03;col[i*3]=r;col[i*3+1]=gg;col[i*3+2]=b}
  geo.setAttribute('color',new T.BufferAttribute(col,3));geo.computeVertexNormals();const ground=new T.Mesh(geo,std({map:tex,vertexColors:true,roughness:.38,metalness:.05}));ground.receiveShadow=false;g.add(ground);
  // ice spires along the ridges, boulders at the plain's edges, mountains on the horizon
  {const L=[],B=[];let sd=3;const rnd=()=>(sd=(sd*9301+49297)%233280)/233280;for(let i=0;i<360;i++){const s=rnd()<.5?-1:1,x=s*(950+rnd()*6000),z=-12000+rnd()*21000;L.push([x,eurH(x,z)-3,z,6+rnd()*16,30+rnd()*110,rnd()*.4-.2])}
   for(let i=0;i<220;i++){const s=rnd()<.5?-1:1,x=s*(380+rnd()*420),z=-9000+rnd()*17000;B.push([x,eurH(x,z),z,1.5+rnd()*4.5])}
   const im=new T.InstancedMesh(new T.ConeGeometry(1,1,5),std({color:0xdde8f0,roughness:.25,metalness:.1}),L.length),d=new T.Object3D();L.forEach((q,i)=>{d.position.set(q[0],q[1]+q[4]/2,q[2]);d.rotation.set(q[5],i,q[5]*.6);d.scale.set(q[3],q[4],q[3]);d.updateMatrix();im.setMatrixAt(i,d.matrix)});g.add(im);
   const ib=new T.InstancedMesh(new T.IcosahedronGeometry(1,0),std({color:0xc4d2dc,roughness:.4,metalness:.05}),B.length);B.forEach((q,i)=>{d.position.set(q[0],q[1]+q[3]*.3,q[2]);d.rotation.set(i,i*2,0);d.scale.set(q[3]*1.3,q[3],q[3]);d.updateMatrix();ib.setMatrixAt(i,d.matrix)});g.add(ib);
   const mt=std({color:0xaabccc,roughness:.5,metalness:.05});for(let i=0;i<18;i++){const a=i/18*6.283+rnd()*.2,r=12500+rnd()*2500,R=1800+rnd()*1800,H=900+rnd()*1500;const m=new T.Mesh(new T.ConeGeometry(R,H,7),mt);m.position.set(Math.sin(a)*r,H/2-60,-1500+Math.cos(a)*r);m.rotation.y=rnd()*3;g.add(m)}}
  // the groove the wreck cuts into the ice
  {const gm=new T.InstancedMesh(new T.BoxGeometry(5,.2,7),std({color:0x5a6a78,roughness:.9}),400);gm.count=0;g.add(gm);g.userData.gr=gm}
  g.visible=false;EUR={g};return EUR}
function l3Fall(S,dt){S.fT+=dt;const K=S.ph;
  if(K==='fall'){pitch=Math.max(-1.1,Math.min(.3,pitch));const rt=.85*dt;S.h+=Math.max(-rt,Math.min(rt,ad(yaw,S.h)));S.p+=Math.max(-rt,Math.min(rt,pitch-S.p));S.roll+=(Math.max(-.9,Math.min(.9,ad(yaw,S.h)*1.6))-S.roll)*Math.min(1,dt*3);
    const fw=L3B.set(-Math.sin(S.h)*Math.cos(S.p),Math.sin(S.p),-Math.cos(S.h)*Math.cos(S.p));S.V.y-=4*dt;{const hs=Math.hypot(S.V.x,S.V.z),k=Math.min(1,dt*.7);S.V.x+=(-Math.sin(S.h)*hs-S.V.x)*k;S.V.z+=(-Math.cos(S.h)*hs-S.V.z)*k}   // no air on Europa: heading turns the drift, only the retro fights gravity
    
    const retro=(keys.KeyW||mvY<-.35||keys.Space)&&S.fuel>0;if(retro){S.V.addScaledVector(fw,-18*dt);S.V.y+=12*dt;S.fuel=Math.max(0,S.fuel-dt/9);S.rf=(S.rf||0)-dt;if(S.rf<=0){S.rf=.05;const q=S.pos.clone().addScaledVector(fw,7);bigFire(q,14,.35,0x9fd8ff,.7,false)}}
    S.pos.addScaledVector(S.V,dt);S.spd=S.V.length();const gh=eurH(S.pos.x,S.pos.z),alt=S.pos.y-gh;
    setObj('LEVEL 4 · EUROPA · ALTITUDE '+Math.max(0,Math.round(alt))+' M · SINK '+Math.max(0,Math.round(-S.V.y))+' M/S · '+(S.fuel>0?'RETRO '+Math.round(S.fuel*100)+'% (HOLD '+(touchUI?'THROTTLE':'W')+')':'RETRO EMPTY'));
    if(alt<600&&!S.a6){S.a6=1;comm('R',"Six hundred metres! Nose up, nose up!")}
    if(alt<2.2){S.imp=Math.max(0,-S.V.y);S.ph='skid';S.V.y=0;hp=Math.max(6,hp-S.imp*.5);PFX.smoke(S.pos.clone(),{n:26,spd:14,size:[4,14],life:2.6,up:2,c0:.85,c1:.97,alpha:.75});sparkle(S.pos,0xffffff,30,20);sparkle(S.pos,0xffc080,12,14);sfx('boom');if(!reduced)shake=.9;S.spin=(Math.random()-.5)*.7;S.sk=0;comm('R',"Hold on!");S.pos.y=gh+1.6}}
  else if(K==='skid'){S.sk+=dt;const hv=Math.hypot(S.V.x,S.V.z),dec=12+S.imp*.25,nv=Math.max(0,hv-dec*dt);if(hv>0){S.V.x*=nv/hv;S.V.z*=nv/hv}
    S.pos.x+=S.V.x*dt;S.pos.z+=S.V.z*dt;const gh=eurH(S.pos.x,S.pos.z);S.pos.y=gh+1.5+Math.abs(Math.sin(S.sk*9))*Math.min(1.2,nv/60);S.h+=S.spin*dt;S.spin*=Math.exp(-dt*.8);S.p+=(.04-S.p)*Math.min(1,dt*3);S.roll=Math.sin(S.sk*5)*Math.min(.12,nv/500);
    const ahead=eurH(S.pos.x+S.V.x*.4,S.pos.z+S.V.z*.4);if(ahead-gh>5&&nv>5){S.V.x*=.15;S.V.z*=.15;PFX.smoke(S.pos.clone(),{n:20,spd:12,size:[4,12],life:2.4,up:2,c0:.85,c1:.97,alpha:.75});sparkle(S.pos,0xffffff,24,18);sfx('boom');S.imp+=30;if(!reduced)shake=.8}
    S.sp2=(S.sp2||0)-dt;if(S.sp2<=0&&nv>3){S.sp2=.05;PFX.smoke(S.pos.clone().add(L3A.set(0,-1,0)),{n:2,spd:4+nv*.05,size:[2,7],life:1.8,up:1,c0:.82,c1:.95,alpha:.6});sparkle(S.pos,0xffffff,3,8);
      const gm=EUR.g.userData.gr;if(gm.count<400){const d=new T.Object3D();d.position.set(S.pos.x,gh+.05,S.pos.z);d.rotation.y=Math.atan2(S.V.x,S.V.z);d.updateMatrix();gm.setMatrixAt(gm.count++,d.matrix);gm.instanceMatrix.needsUpdate=true}}
    if(!reduced)shake=Math.max(shake,Math.min(.4,nv/300));setObj('LEVEL 4 · EUROPA · '+Math.round(nv*MPH)+' MPH ON THE ICE');
    if(nv<1){S.ph='rest';S.rT=0;comm('R',"...We're alive. The Kestrel's done flying, but we're alive.");comm('R',"Rowan to anyone on Europa. We're down on the ice. Imani, if you can hear this, I'm coming.")}}
  else if(K==='rest'){S.rT+=dt;setObj('LEVEL 4 · EUROPA · DOWN ON THE ICE');if(S.rT>5&&!S.fd){S.fd=1;fade(1,2)}if(S.rT>7.5){l3Done(41);S.ph='done';return true}}
  S.g.position.copy(S.pos);S.g.rotation.set(S.p,S.h,S.roll);shuttleAnim(S.g,K==='fall'?40:0,false,S.roll,S.msl,S.mac,K!=='fall',dt);pos.copy(S.pos);eye.copy(S.pos);vy=0;
  if(K==='fall'){yaw=yaw;S.vel.copy(S.V)}else{yaw=S.h;S.vel.set(S.V.x,0,S.V.z)}
  if(!eng)engineOn();engSet(30+S.spd*.2,.04,200+S.spd*4,K==='rest'?.004:.02+S.spd/3000);return true}
