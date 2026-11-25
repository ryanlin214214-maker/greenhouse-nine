// ---------- v93: 3-3's real nuclear strike, the controlled approach to Europa (4-1) and the first Europa ground map (4-2).
// 3-3: the charge you planted drops the shield but the ship holds; you arm and launch the second Nova into the exposed
// core (arming countdown, travel, detonation, fleet reaction), outrun the blast wave, regroup with Vesper, then the nine
// chasers and Sable, whose missile cripples you. 4-1: a guided approach to the Thule Relay: corridor rings on a glide path,
// retro (W) and lift (Space) thrusters, gear that deploys low, autoland in the last stretch, snow blast and touchdown.
// 4-2: on foot from the pad to the relay: wind-driven snow, ice spires and an arch, a courtyard fight among containers, a
// buried dome to find, a ridge walk, and the relay's control room where you restore the beacon.
function n2Launch(S){const D=S.dr;const g=new T.Group();g.add(mesh(GEO.cyl,MAT.white,.6,4,.6,0,0,0),glow(0xfff0c0,30,1));g.children[0].rotation.x=Math.PI/2;g.position.copy(S.pos);scene.add(g);
  S.nk={g,p:g.position,dir:new T.Vector3(-Math.sin(S.h),0,-Math.cos(S.h)),spd:Math.max(200,S.spd+60),tr:0};S.ph='n2fly';sfx('mortar');tone('sawtooth',90,900,1.2,.08);comm('R',"Nova away! Come on, come on...")}
function l33Tick(S,dt){const D=S.dr;if(!D)return false;S.navP=S.navP||new T.Vector3();
  if(S.ph==='shield'){S.st2=(S.st2||0)+dt;setObj('STAGE 3-3 · THE CHARGE HAS GONE OFF');S.navP.copy(D.g.position);S.navL='COMMAND SHIP';
    if(S.st2<1.6){D.shA=.4+S.st2*.4;shieldHit(S,D.g.position,4);if(Math.random()<dt*10){const z=(Math.random()-.5)*6000;bigFire(D.g.localToWorld(new T.Vector3((Math.random()-.5)*600,(Math.random()-.5)*200,z)),300+Math.random()*400,1.6,0xd090ff,.8)}}
    else if(!D.shOff){D.shOff=true;bigFire(D.g.position,16000,2.5,0xd090ff,.7);tone('sine',800,60,1.4,.1);comm('C',"Shield's down! Their shield is down!");comm('V',"She's still flying, Kestrel. You've got the second Nova. Put it in her heart.");comm('R',"Turn us around. Let's finish it.")}
    if(S.st2>5){S.ph='nova2';S.n2Ready=true}}
  else if(S.ph==='nova2'){S.navP.copy(D.g.position);S.navL='CORE';const d=S.pos.distanceTo(D.g.position);
    if(S.n2Arm>0){S.n2Arm-=dt;setObj('STAGE 3-3 · NOVA ARMING · '+Math.ceil(S.n2Arm));if(Math.floor(S.n2Arm*2)!==S.n2b){S.n2b=Math.floor(S.n2Arm*2);tone('square',900,900,.06,.05)}if(S.n2Arm<=0){S.n2Ready=false;n2Launch(S)}}
    else setObj(touchUI?'STAGE 3-3 · MISSILE BUTTON · ARM AND LAUNCH THE SECOND NOVA · '+(d/1000).toFixed(1)+' KM':'STAGE 3-3 · G · ARM AND LAUNCH THE SECOND NOVA · '+(d/1000).toFixed(1)+' KM')}
  else if(S.ph==='n2fly'){const N=S.nk;N.spd=Math.min(950,N.spd+220*dt);L3B.copy(D.g.position).sub(N.p).normalize();N.dir.lerp(L3B,Math.min(1,dt*1.4)).normalize();N.p.addScaledVector(N.dir,N.spd*dt);N.g.lookAt(N.p.clone().add(N.dir));
    N.tr-=dt;if(N.tr<=0){N.tr=.05;bigFire(N.p,70,1.4,0xffd8b0,.5,false)}S.navP.copy(N.p);S.navL='NOVA';setObj('STAGE 3-3 · NOVA IN FLIGHT · '+(N.p.distanceTo(D.g.position)/1000).toFixed(1)+' KM TO THE CORE');
    if(N.p.distanceTo(D.g.position)<700){scene.remove(N.g);S.nk=null;S.ph='boom';S.bt=1.7;S.bq=0;flashW();comm('C',"Detonation! Detonation! Core breach on the command ship!");comm('V',"Look at her go. That's for Thalassa.");setTimeout(()=>{try{comm('R',"Now get us out of here. That wave is coming.")}catch(e){}},2500)}}
  else if(S.ph==='blast'){const W=S.bw;W.r+=900*dt;W.g.scale.setScalar(W.r);W.g.material.opacity=Math.max(0,.35*(1-W.r/15000));const d=S.pos.distanceTo(W.c);setObj('STAGE 3-3 · OUTRUN THE BLAST WAVE · '+Math.round(Math.max(0,d-W.r))+' M');S.navP.copy(S.pos).addScaledVector(L3B.subVectors(S.pos,W.c).normalize(),3000);S.navL='AWAY';
    if(!W.hit&&W.r>d){W.hit=1;if(!reduced)shake=Math.max(shake,.9);hurt(28,W.c);S.spd*=.6;S.roll+=2.2;say('Caught by the blast wave',1.6)}
    if(W.r>15000){scene.remove(W.g);S.ph='regroup';S.rg=0;const v=S.ves=multiroleShip();scene.add(v);v.position.copy(S.pos).add(new T.Vector3(-Math.sin(S.h)*900,80,-Math.cos(S.h)*900));S.vesD=new T.Vector3(-Math.sin(S.h),0,-Math.cos(S.h));comm('V',"Kestrel, Vesper. I'm off your nose. Form up, we're going home.")}}
  else if(S.ph==='regroup'){const v=S.ves;S.rg+=dt;v.position.addScaledVector(S.vesD,140*dt);v.lookAt(v.position.clone().sub(S.vesD));const d=v.position.distanceTo(S.pos);S.navP.copy(v.position);S.navL='VESPER';setObj('STAGE 3-3 · REGROUP WITH VESPER · '+Math.round(d)+' M');
    if(d<500||S.rg>40){S.ph='tail';S.tt=0;S.k0=S.kills;comm('V',"Contacts behind us. Nine of them. Break, break!");comm('R',"Company. Nine of them, right on our tail.");const bk=L3B.set(Math.sin(S.h),0,Math.cos(S.h));for(let i=0;i<9;i++){const p=S.pos.clone().addScaledVector(bk,1300+Math.random()*700).add(new T.Vector3((Math.random()-.5)*900,(Math.random()-.5)*400,(Math.random()-.5)*900));const e=flyEnemy('int',p.x,p.y,p.z);e.cd=1.5+Math.random()*2}
      setTimeout(()=>{if(S.ves){flyBoom(S.ves.position,2.2);scene.remove(S.ves);S.ves=null;try{comm('V',"I'm hit! I'm out of it, Kestrel. Run for Europa, I'll find you!")}catch(e){}}},14000)}}
  else return false;
  return true}
// ---- 4-1: the approach to the Thule Relay
const EUP={pad:new T.Vector3(0,0,200)};
function eurApproachStart(S){const E=eurBuild();E.g.visible=true;if(FARX.eur)FARX.eur.visible=false;farAim(farJup(),new T.Vector3(.38,.26,-.89));S.fogC=scene.fog.color.getHex();scene.fog.color.setHex(0x0b121a);scene.fog.near=2500;scene.fog.far=24000;renderer.toneMappingExposure=FLV.ex*.9;
  EUP.pad.y=eurH(0,200);if(!E.relay){E.relay=eurRelayFar();E.g.add(E.relay)}
  S.pos.set(0,2300,11500);S.h=0;S.p=-.12;S.roll=0;yaw=0;pitch=-.12;S.V=new T.Vector3(0,-22,-190);S.spd=S.V.length();S.ph='approach';S.fT=0;S.noDie=5;hp=Math.max(hp,40);shield=0;S.gear=0;S.fuel=1;
  // the corridor: rings on a glide path from 1.8 km up to 80 m over the pad's approach
  S.rings=[];for(let k=0;k<9;k++){const u=k/8,z=9000-u*8300,y=EUP.pad.y+1800*(1-u)**1.4+80,r=new T.Mesh(new T.TorusGeometry(70-u*35,1.4,6,48),bas({color:0x6fe3ff,transparent:true,opacity:.55,blending:T.AdditiveBlending,depthWrite:false,fog:false}));r.position.set(0,y,z);scene.add(r);S.rings.push(r)}
  S.g.position.copy(S.pos);fadeSet(1);fade(0,2.2);fcTitle('LEVEL 4','EUROPA · THE THULE RELAY');
  comm('R',"One engine left, and it's coughing. There, the Thule Relay! Lights on the ice, dead ahead.");comm('R',"Follow the rings down. W burns the retros, Space for the lift jets. Gentle, Kestrel. Gentle.")}
// the relay as seen from the air: pad lights, path lights, the buildings' warm windows and the beacon mast
function eurRelayFar(){const g=new T.Group(),y=EUP.pad.y,W=bas({color:0xffc070}),C=bas({color:0x6fe3ff});
  for(let k=0;k<16;k++){const a=k/16*6.283,q=glow(k%2?0x6fe3ff:0xffd090,9,.95);q.position.set(Math.cos(a)*22,y+1,200+Math.sin(a)*22);g.add(q)}
  for(let z=170;z>40;z-=14){for(const s of[-1,1]){const q=glow(0xffc070,6,.8);q.position.set(s*4,y+2,z);g.add(q)}}
  const bl=new T.Mesh(new T.BoxGeometry(44,14,32),std({color:0x2a3138,roughness:.6,metalness:.5}));bl.position.set(0,y+7,-10);g.add(bl);for(let i=0;i<8;i++){const w=mesh(GEO.box,W,3,1.2,.2,-15+i*4.3,y+9,6.2);g.add(w)}
  const m=mesh(GEO.cyl,std({color:0x3a4048,roughness:.5,metalness:.6}),.8,60,.8,18,y+30,-20);g.add(m);const bc=glow(0xff4030,16,1);bc.position.set(18,y+61,-20);g.add(bc);g.userData.beacon=bc;return g}
function eurApproach(S,dt){S.fT+=dt;const K=S.ph,E=EUR,gy=eurH(S.pos.x,S.pos.z),alt=S.pos.y-gy,P=EUP.pad,dp=Math.hypot(S.pos.x-P.x,S.pos.z-P.z);
  if(K==='approach'){const fw=L3B.set(-Math.sin(S.h)*Math.cos(S.p),Math.sin(S.p),-Math.cos(S.h)*Math.cos(S.p));const sp=S.V.length();
    // steer: the velocity turns toward where the nose points; W retro, Space lift; Europa's gravity pulls down
    S.V.lerp(fw.clone().multiplyScalar(sp),Math.min(1,dt*.55));S.V.y-=1.31*dt;if(keys.KeyW||mvY<-.35){const k=Math.max(0,sp-22*dt)/(sp||1);S.V.multiplyScalar(k);S.burn=1}else S.burn=0;if(keys.Space||jumpQ){S.V.y+=5*dt;S.lift=1}else S.lift=0;
    const dh=ad(yaw,S.h),dpp=pitch-S.p;S.h+=Math.max(-1*dt,Math.min(1*dt,dh));S.p+=Math.max(-.8*dt,Math.min(.8*dt,dpp));S.roll+=(Math.max(-.6,Math.min(.6,dh))-S.roll)*Math.min(1,dt*2);
    S.pos.addScaledVector(S.V,dt);S.spd=S.V.length();S.vel.copy(S.V);
    if(!S.gear&&alt<320){S.gear=1;sfx('swap');say('Gear down',1.2)}
    // a smoking engine
    S.sm=(S.sm||0)-dt;if(S.sm<=0){S.sm=.05;PFX.smoke(S.g.localToWorld(new T.Vector3(1,0,6)),{n:1,spd:2,size:[1.5,5],life:2.2,up:0,c0:.2,c1:.45,alpha:.55})}
    for(const r of S.rings){const d=r.position.distanceTo(S.pos);r.material.opacity=d<120?.85:.45;if(d<r.geometry.parameters.radius&&!r.userData.ok){r.userData.ok=1;tone('sine',700,900,.12,.05)}}
    const vs=S.V.y;setObj('STAGE 4-1 · THULE RELAY · PAD 1 · '+Math.round(dp)+' M · ALT '+Math.round(alt)+' M · SINK '+Math.max(0,Math.round(-vs))+' M/S · '+(S.gear?'GEAR DOWN':'GEAR UP'));
    S.navP=S.navP||new T.Vector3();S.navP.set(P.x,P.y+10,P.z);S.navL='PAD 1';
    if(dp<260&&alt<140&&sp<70){S.ph='autoland';S.al=0;S.a0=S.pos.clone();S.v0=S.V.clone();S.h0=S.h;comm('R',"Autoland's got her. Hands off the stick.");say('AUTOLAND',1.5)}
    if(alt<4){const hard=sp>70;S.ph='touch';S.tT=0;S.tp=S.pos.clone();S.tp.y=gy;S.hard=hard;eurTouch(S,hard)}}
  else if(K==='autoland'){S.al+=dt;const u=Math.min(1,S.al/7),e=u*u*(3-2*u),tgt=L3A.set(P.x,P.y+(S.g.userData.gy||2.05)+.4,P.z);
    S.pos.lerpVectors(S.a0,tgt,e);S.pos.y=S.a0.y+(tgt.y-S.a0.y)*Math.min(1,u*1.15);S.h=S.h0+ad(0,S.h0)*e;S.p*=.95;S.roll*=.92;S.spd=S.v0.length()*(1-e);S.gear=1;
    S.sm=(S.sm||0)-dt;if(S.sm<=0){S.sm=.04;const a=S.pos.y-P.y;if(a<40)PFX.smoke(new T.Vector3(P.x+(Math.random()-.5)*30,P.y+.5,P.z+(Math.random()-.5)*30),{n:2,spd:7+20*(1-a/40),size:[2,8],life:1.6,up:.2,c0:.85,c1:.95,alpha:.55})}
    setObj('STAGE 4-1 · AUTOLAND · '+Math.round(S.pos.y-P.y-(S.g.userData.gy||2.05))+' M');if(u>=1){S.ph='touch';S.tT=0;S.tp=S.pos.clone();S.hard=false;eurTouch(S,false)}}
  else if(K==='touch'){S.tT+=dt;const k=Math.max(0,1-S.tT/.5);S.pos.y=S.tp.y-(S.hard?.6:.25)*Math.sin(Math.min(1,S.tT/.35)*Math.PI)*k;S.spd*=.9;S.roll*=.85;S.p*=.85;
    if(S.tT>2.2&&!S.fd){S.fd=1;fade(1,1.4)}if(S.tT>3.8){for(const r of S.rings||[])scene.remove(r);S.rings=[];l3Done(41);return true}}
  S.g.position.copy(S.pos);S.g.rotation.set(S.p,S.h,S.roll);shuttleAnim(S.g,K==='touch'?0:Math.min(200,S.spd),false,S.roll,S.msl,S.mac,!!S.gear,dt);try{shipAnimX(S,dt)}catch(e){}pos.copy(S.pos);eye.copy(S.pos);vy=0;
  if(!eng)engineOn();engSet(30+(S.burn?60:0)+(S.lift?40:0),.05,200+S.spd*4,.02+(S.burn?.05:0));return true}
function eurTouch(S,hard){const P=S.tp;for(let k=0;k<3;k++)PFX.smoke(P.clone().add(new T.Vector3(0,.5,0)),{n:18,spd:14,size:[3,10],life:2.4,up:.2,c0:.85,c1:.97,alpha:.6});sfx('boom');if(!reduced)shake=Math.max(shake,hard?.7:.3);
  if(hard){hurt(20,P);comm('R',"Hard landing! But we're down. We're down.")}else comm('R',"Down. We're down. Nice flying, Kestrel.");comm('C',"...Kestrel, Fleet... signal's weak... the relay's beacon... restore it and we can find you...")}

// ---- 4-2: Europa on foot. A world like the command-ship interior: it swaps collision, rooms, lamps and nav walls.
const EUW={on:false,g:null,boxes:[],fix:[],navw:[],sv:null,snow:null};
function eurMapBuild(){if(EUW.g)return EUW;const g=new T.Group(),B=EUW.boxes=[],NW=EUW.navw=[],FX=EUW.fix=[];
  const snowT=paint(512,(c,S)=>{c.fillStyle='#d9e4ee';c.fillRect(0,0,S,S);for(let i=0;i<5000;i++){const v=200+Math.random()*55|0;c.fillStyle='rgba('+v+','+(v+5)+','+(v+12)+',.35)';c.fillRect(Math.random()*S,Math.random()*S,1+Math.random()*3,1+Math.random()*2)}});snowT.repeat.set(160,160);
  const SNOW=std({map:snowT,roughness:.85,metalness:0,color:0xc8d4e0}),ICE=std({color:0x8fb8d8,roughness:.12,metalness:.1,transparent:true,opacity:.92}),ICED=std({color:0x5a86a8,roughness:.2,metalness:.15}),
    MET=std({color:0x39424a,roughness:.55,metalness:.6}),MED=std({color:0x22282e,roughness:.6,metalness:.6}),HAZ=std({color:0xd8a420,roughness:.5,metalness:.3}),WIN=bas({color:0xffc070}),PAD=std({color:0x30363c,roughness:.7,metalness:.4}),CY=bas({color:0x6fe3ff}),CON=[std({color:0x8a3a2a,roughness:.6,metalness:.4}),std({color:0x2a5a8a,roughness:.6,metalness:.4}),std({color:0x5a6a3a,roughness:.6,metalness:.4})];
  // collision helper: a solid box (visible with mat, or invisible), also on the robots' wall list when it is a thin wall
  const S=(x0,y0,z0,x1,y1,z1,mat,floor)=>{if(mat){const m=new T.Mesh(new T.BoxGeometry(x1-x0,y1-y0,z1-z0),mat);m.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);m.castShadow=m.receiveShadow=true;g.add(m)}
    const q={lo:[x0,y0,z0],hi:[x1,y1,z1]};if(floor)q.floor=true;B.push(q);const dx=x1-x0,dz=z1-z0;if(!floor&&y0<.6&&y1-y0>1.6){if(dx<1.6&&dz>dx)NW.push(['x',(x0+x1)/2,z0,z1]);else if(dz<1.6)NW.push(['z',(z0+z1)/2,x0,x1])}return q};
  const lamp=(x,y,z,c,r)=>FX.push({x,y,z,c:c||0xffb070,i:1.5,r:r||22,rm:null,top:false,used:false});
  // ground: a snowfield 1.5 km round (the walkable area is the valley in the middle)
  {const gr=new T.Mesh(new T.CircleGeometry(1500,64),SNOW);gr.rotation.x=-Math.PI/2;gr.receiveShadow=true;g.add(gr)}
  // the valley walls: ice cliffs and spires that close the playable area (x +-105, z +-255), instanced shards
  {const sp=[],sh=new T.ConeGeometry(1,1,6);for(let i=0;i<260;i++){const side=i%2?1:-1,z=-280+(i>>1)*4.4+(Math.random()-.5)*3,x=side*(112+Math.random()*30+(Math.abs(z)>200?0:0)),h=14+Math.random()*46+(Math.random()<.1?40:0),w=4+Math.random()*7;sp.push([x,h/2-1,z,w,h,w*(.6+Math.random()*.5),Math.random()*6])}
   for(let i=0;i<60;i++){const z=(i<30?-1:1)*(262+Math.random()*30),x=-110+(i%30)*7.6,h=18+Math.random()*40,w=5+Math.random()*6;sp.push([x,h/2-1,z,w,h,w,Math.random()*6])}
   for(let i=0;i<140;i++){const a=Math.random()*6.283,r=420+Math.random()*900,h=60+Math.random()*260,w=25+Math.random()*60;sp.push([Math.cos(a)*r,h/2-5,Math.sin(a)*r,w,h,w*.7,Math.random()*6])}
   const im=new T.InstancedMesh(sh,ICED,sp.length),d=new T.Object3D();sp.forEach((q,i)=>{d.position.set(q[0],q[1],q[2]);d.scale.set(q[3],q[4],q[5]);d.rotation.set((Math.random()-.5)*.15,q[6],(Math.random()-.5)*.15);d.updateMatrix();im.setMatrixAt(i,d.matrix)});im.castShadow=true;g.add(im);
   for(const s of[-1,1]){S(s>0?104:-125,0,-280,s>0?125:-104,30,280);}S(-125,0,-282,125,30,-258);S(-125,0,258,125,30,282)}
  // the landing pad (40 m, lit ring) at z 200
  {const pd=new T.Mesh(new T.CylinderGeometry(20,20.6,.6,48),PAD);pd.position.set(0,.3,200);pd.receiveShadow=true;g.add(pd);B.push({lo:[-14,0,186],hi:[14,.6,214],floor:true});const rg=new T.Mesh(new T.TorusGeometry(19,.18,6,64),CY);rg.rotation.x=Math.PI/2;rg.position.set(0,.62,200);g.add(rg);
   for(let k=0;k<16;k++){const a=k/16*6.283,q=glow(k%2?0x6fe3ff:0xffd090,2.2,.9);q.position.set(Math.cos(a)*20.4,.9,200+Math.sin(a)*20.4);g.add(q)}lamp(0,8,200,0xcfe6ff,30)}
  // the path from the pad to the relay: light posts every 14 m, a little raised walkway
  for(let z=176;z>40;z-=14){for(const s of[-1,1]){S(s*5-.15,0,z-.15,s*5+.15,3.2,z+.15,MET);const q=glow(0xffc070,2,.9);q.position.set(s*5,3.3,z);g.add(q)}lamp(0,4,z,0xffb070,16)}
  {const wk=new T.Mesh(new T.BoxGeometry(6,.14,140),MED);wk.position.set(0,.07,108);wk.receiveShadow=true;g.add(wk)}
  // courtyard containers (cover) between the path and the relay
  for(const[x,z,r,c]of[[-16,70,0,0],[-22,58,1.57,1],[14,78,0,2],[24,62,0,0],[-8,46,.4,1],[10,40,0,2],[30,44,1.57,1],[-30,40,0,2]]){const w=r?2.6:6,d=r?6:2.6;S(x-w/2,0,z-d/2,x+w/2,2.6,z+d/2,CON[c]);if((x+z)%3===0)S(x-w/2,2.6,z-d/2,x+w/2,5.2,z+d/2,CON[(c+1)%3])}
  // the relay building: x -22..22, z -26..6, 12 m high; a door on the south face (x -2..2), a corridor north to the
  // control room (x -9..9, z -24..-12), windows with warm light; roof is solid
  {const H=12,t=.5;S(-22,0,6-t,-2,H,6,MET);S(2,0,6-t,22,H,6,MET);S(-2,3.4,6-t,2,H,6,MET);S(-22,0,-26,-22+t,H,6,MET);S(22-t,0,-26,22,H,6,MET);S(-22,0,-26,22,H,-26+t,MET);S(-22,H,-26,22,H+.6,6,MED);
   S(-2-t,0,-12,-2,4,6-t);S(2,0,-12,2+t,4,6-t);// corridor walls (inside), invisible: the interior lining shows them
   {const L=new T.Mesh(new T.BoxGeometry(.3,4,17.5),MED);L.position.set(-2.15,2,-3.25);g.add(L);const L2=L.clone();L2.position.x=2.15;g.add(L2);const C=new T.Mesh(new T.BoxGeometry(4.6,.2,17.5),MED);C.position.set(0,4,-3.25);g.add(C)}
   S(-9,0,-12-t,-2,4,-12);S(2,0,-12-t,9,4,-12);S(-9,0,-24,-9+t,4,-12);S(9-t,0,-24,9,4,-12);S(-9,0,-24,9,4,-24+t);S(-9,4,-24,9,4.3,-12);
   {const fl=new T.Mesh(new T.BoxGeometry(44,.1,32),MED);fl.position.set(0,.05,-10);fl.receiveShadow=true;g.add(fl)}
   for(let i=0;i<9;i++){const w=mesh(GEO.box,WIN,3,1.4,.15,-18+i*4.5,8.5,6.1);g.add(w)}for(const x of[-6,-3,3,6]){const w=mesh(GEO.box,WIN,.15,1.2,2,x<0?-22.1:22.1,6,-8+x);g.add(w)}
   const dfr=new T.Mesh(new T.BoxGeometry(5,.4,.6),HAZ);dfr.position.set(0,3.6,6.2);g.add(dfr);for(const s of[-1,1]){const p=new T.Mesh(new T.BoxGeometry(.4,3.6,.6),HAZ);p.position.set(s*2.2,1.8,6.2);g.add(p)}
   // control room: consoles and the beacon console
   for(const[x,z]of[[-6,-22],[6,-22],[-7,-15],[7,-15]])S(x-1.2,0,z-.5,x+1.2,1.1,z+.5,MED);EUW.cons=new T.Mesh(new T.BoxGeometry(3,1.2,1),std({color:0x22282e,emissive:0x2a6a8a,emissiveIntensity:.8}));EUW.cons.position.set(0,.6,-22.4);g.add(EUW.cons);B.push({lo:[-1.5,0,-22.9],hi:[1.5,1.2,-21.9]});
   lamp(0,3.6,-18,0xcfe6ff,14);lamp(0,3.6,-4,0xffd0a0,12);lamp(0,10,10,0xffb070,24);
   // the beacon mast beside the relay
   S(17,0,-21,19,60,-19,MET);const bc=glow(0xff4030,10,1);bc.position.set(18,61,-20);g.add(bc);EUW.beacon=bc;bc.material=bc.material.clone();bc.material.opacity=.15}
  // the ridge: a raised walkway along the east side (4 m up), reached by steps, with a view over the courtyard
  {for(let k=0;k<22;k++)S(60,0,120-k*.28-.28,72,(k+1)*.18,120-k*.28,MED,true);S(60,0,40,72,4,113.8,MET,true);S(60,4,40,60.3,5.1,113.8);for(let z=44;z<112;z+=12){const q=glow(0xffc070,2,.8);q.position.set(61,5.3,z);g.add(q)}lamp(66,7,80,0xffb070,22)}
  // the buried dome: half sunk in the snow at x -70, z -60, with an opening on its east side; a log and a cache inside
  {const dm=new T.Mesh(new T.SphereGeometry(16,32,16,0,Math.PI*2,0,Math.PI/2.3),std({color:0x6a7480,roughness:.4,metalness:.5,side:T.DoubleSide}));dm.position.set(-70,-3,-60);g.add(dm);
   for(let a=0;a<6.283;a+=.2){if(Math.abs(Math.atan2(Math.sin(a),Math.cos(a)))<.35)continue;const x=-70+Math.cos(a)*15,z=-60+Math.sin(a)*15;S(x-1.5,0,z-1.5,x+1.5,8,z+1.5)}
   EUW.cache=new T.Vector3(-74,0,-60);const ch=mesh(GEO.box,HAZ,1.4,.9,1,-74,.45,-60);g.add(ch);const cq=glow(0xffd27a,2,.8);cq.position.set(-74,1.4,-60);g.add(cq);lamp(-70,5,-60,0x9fd8ff,14)}
  // the ice arch: a landmark at the north-west, two pillars and a span (walk under it)
  {S(-60,0,-200,-52,26,-192,ICE);S(-30,0,-200,-22,26,-192,ICE);const sp=new T.Mesh(new T.TorusGeometry(19,4,8,24,Math.PI),ICE);sp.position.set(-41,22,-196);g.add(sp)}
  EUW.room={n:'EUROPA',x0:-110,x1:110,z0:-258,z1:258,h:60};MOODK.EUROPA='E';if(!MOODS.E)MOODS.E={hi:.85,sky:0xbcd6ff,gr:0x2a3440,lc:0xffb070,li:1.4};for(const f of FX)f.rm=EUW.room;
  // wind-driven snow round the camera
  {const n=900,a=new Float32Array(n*3);for(let i=0;i<a.length;i++)a[i]=(Math.random()-.5)*80;const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(a,3));EUW.snow=new T.Points(geo,new T.PointsMaterial({color:0xeaf4ff,size:.09,transparent:true,opacity:.75,depthWrite:false,fog:true}));EUW.snow.frustumCulled=false;g.add(EUW.snow)}
  EUW.g=g;return EUW}
function eurMapEnter(){const M=eurMapBuild();try{cmdLeave()}catch(e){}try{glbLeave()}catch(e){}M.sv={boxes:boxes.slice(),rooms:ROOMS.slice(),fix:FIX.slice(),navw:NAVW.slice(),doorv:DOORV.slice(),bg:scene.background&&scene.background.getHex?scene.background.getHex():null,fc:scene.fog.color.getHex(),fn:scene.fog.near,ff:scene.fog.far};
  boxes.length=0;for(const b of M.boxes)boxes.push(b);ROOMS.length=0;ROOMS.push(M.room);FIX.length=0;for(const f of M.fix)FIX.push(f);NAVW.length=0;for(const w of M.navw)NAVW.push(w);DOORV.length=0;
  gridN=-1;NAV=null;SPN=null;COVER=null;COVERMAP=null;WPR.key=null;for(const q of LPOOL){if(q.f)q.f.used=false;q.f=null;q.k=0}
  worldShow(false);scene.add(M.g);M.on=true;scene.fog.color.setHex(0x8aa4bc);scene.fog.near=120;scene.fog.far=1600;if(scene.background&&scene.background.setHex)scene.background.setHex(0x0b1420);farAim(farJup(),new T.Vector3(.2,.35,-.92));if(FARX.eur)FARX.eur.visible=false}
function eurMapLeave(){const M=EUW;if(!M.on)return;const v=M.sv;boxes.length=0;for(const b of v.boxes)boxes.push(b);ROOMS.length=0;for(const r of v.rooms)ROOMS.push(r);FIX.length=0;for(const f of v.fix){f.used=false;f.top=false;FIX.push(f)}NAVW.length=0;for(const w of v.navw)NAVW.push(w);DOORV.length=0;for(const d of v.doorv)DOORV.push(d);
  gridN=-1;NAV=null;SPN=null;COVER=null;COVERMAP=null;WPR.key=null;for(const q of LPOOL){q.f=null;q.k=0}scene.remove(M.g);M.on=false;scene.fog.color.setHex(v.fc);scene.fog.near=v.fn;scene.fog.far=v.ff;if(v.bg!==null&&scene.background.setHex)scene.background.setHex(v.bg);FAR.quaternion.identity();if(FARX.eur)FARX.eur.visible=true;worldShow(true);EUW.ph=''}
// stage 4-2: from the pad to the relay; the courtyard fight; the beacon
function eurStart(){LAST={m:5,s:2};eurMapEnter();const M=EUW;pos.set(-8,.62,196);yaw=Math.PI;pitch=0;vy=0;eye.set(pos.x,pos.y+EYE,pos.z);$('wave').textContent='4-2';mission=null;gap=1e9;wave=6;
  M.ph='walk';M.t=0;M.hold=0;M.found=false;if(M.beacon)M.beacon.material.opacity=.15;if(!M.ship){M.ship=shipModel(WAL.ship in SHIPS?WAL.ship:'kestrel');M.ship.position.set(4,(M.ship.userData.gy||2.05)+.6,203);M.ship.rotation.y=.4;try{shuttleAnim(M.ship,0,0,0,99,1,true,10)}catch(e){}M.g.add(M.ship);
    PFX.emit(()=>M.ship.localToWorld(new T.Vector3(1,0,6)),{rate:6,dur:9999,fire:false,ss:[1,4],slife:3,far:400,c0:.25,c1:.5,alpha:.5})}
  try{rowanJoin(true)}catch(e){}fadeSet(1);fade(0,1.6);setObj('STAGE 4-2 · REACH THE THULE RELAY');
  comm('R',"Cold. So cold the suit's complaining. The relay's straight up the lit path.");comm('R',"Keep your eyes open. Nothing's moved down here for a long time, which means something should have.")}
function eurTick(dt){const M=EUW;if(!M.on||state!=='playing')return;M.t+=dt;
  // snow streams on the wind past the camera
  {const a=M.snow.geometry.attributes.position.array,c=cam.position;for(let i=0;i<a.length;i+=3){a[i]+=dt*7;a[i+1]-=dt*(1.2+(i%7)*.15);a[i+2]+=dt*2.2;for(let k=0;k<3;k++){const d=a[i+k]-c.getComponent(k);if(d>40)a[i+k]-=80;else if(d<-40)a[i+k]+=80}}M.snow.geometry.attributes.position.needsUpdate=true}
  if(M.beacon&&M.ph==='done')M.beacon.material.opacity=(time*1.4%1)<.5?1:.25;
  if(!M.found&&pos.distanceTo(M.cache)<3){M.found=true;cr(150);comm('G',"Thule Relay, survey log nine. The dome readings are wrong again. Something under the ice is keeping time with the Blade.");say('Supply cache · +150 CR',2)}
  if(M.ph==='walk'){setObj('STAGE 4-2 · REACH THE THULE RELAY · '+Math.round(Math.hypot(pos.x,pos.z-6))+' M');if(pos.z<100){M.ph='fight';M.ft=0;cmdSpawn([[5,-20,30,0],[5,20,28,.5],[7,0,12,1],[8,-30,20,2],[13,26,14,3],[5,-10,-30,6],[13,-24,-40,7]]);comm('R',"Movement by the containers! Get to cover!")}}
  else if(M.ph==='fight'){M.ft+=dt;const n=enemies.filter(e=>!e.dying).length+queue.length;setObj('STAGE 4-2 · CLEAR THE COURTYARD · '+n+' LEFT');if(M.ft>4&&n===0){M.ph='beacon';comm('R',"Clear. Inside, the control room's at the back. Let's get that beacon lit.")}}
  else if(M.ph==='beacon'){const d=Math.hypot(pos.x,pos.z+21.6);setObj('STAGE 4-2 · RESTORE THE BEACON · '+(d<2.6?(touchUI?'STAND AT THE CONSOLE':'HOLD E AT THE CONSOLE'):Math.round(d)+' M'));
    const pad=(()=>{try{const gp=navigator.getGamepads&&navigator.getGamepads()[0];return!!(gp&&gp.buttons[2]&&gp.buttons[2].pressed)}catch(e){return false}})();if(d<2.6&&(keys.KeyE||touchUI||pad)){M.hold+=dt;if(M.hold>3){M.ph='done';M.dt=0;sfx('swap');comm('R',"Beacon's live. If anyone's out there, they can see us now.");comm('C',"...Kestrel! We have your beacon! Hold on, we're coming. Fleet Command out.")}}else M.hold=Math.max(0,M.hold-dt)}
  else if(M.ph==='done'){M.dt+=dt;setObj('STAGE 4-2 · THE BEACON IS LIT');if(M.dt>6&&!M.end){M.end=1;l3Done(42)}}}
