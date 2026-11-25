p='/home/user/greenhouse-nine/index.html'
s=open(p).read()
def rep(a,b,c=1):
  global s
  assert s.count(a)==c,(s.count(a),a[:100]); s=s.replace(a,b)
rep("const WHO={C:['FLEET COMMAND · EUROPA ORBITAL','cmd'],","const WHO={H:['CAPT. INES VARGA · HALCYON','cmd'],C:['FLEET COMMAND · EUROPA ORBITAL','cmd'],")
rep("P={N:[0,.95,.92],R:[1,1.08,1.03],L:[2,.55,.85],G:[0,.7,.95],C:[3,.8,1.04]}[k]","P={N:[0,.95,.92],R:[1,1.08,1.03],L:[2,.55,.85],G:[0,.7,.95],C:[3,.8,1.04],H:[4,1.05,1.0]}[k]")
rep("{m:2,s:2,t:'Rescue',d:'Halcyon under attack · pick up allies',ready:false}","{m:2,s:2,t:'Rescue',d:'Halcyon under attack · boarding pods · dock · wingmen',ready:true}")
# flyEnemy: pods
rep("function flyEnemy(kind,x,y,z){const g=kind==='gun'?gunboatModel():interceptorModel();g.position.set(x,y,z);scene.add(g);const dir=new T.Vector3(FLY.pos.x-x,FLY.pos.y-y,FLY.pos.z-z).normalize();\n  const e={kind,g,p:g.position,dir,hp:kind==='gun'?40:6,max:kind==='gun'?40:6,r:kind==='gun'?11:4.5,sp:kind==='gun'?55:150,",
"function flyEnemy(kind,x,y,z){const g=kind==='gun'?gunboatModel():kind==='pod'?podModel():interceptorModel();g.position.set(x,y,z);scene.add(g);const dir=new T.Vector3(FLY.pos.x-x,FLY.pos.y-y,FLY.pos.z-z).normalize(),K={gun:[40,11,55],pod:[14,5,0],int:[6,4.5,150]}[kind];\n  const e={kind,g,p:g.position,dir,hp:K[0],max:K[0],r:K[1],sp:K[2],")
rep("FLY.kills++;score+=e.kind==='gun'?600:150;","FLY.kills++;score+=e.kind==='gun'?600:e.kind==='pod'?300:150;")
# pod AI branch
rep("    else{const want=fv2.copy(to);if(d<650)want.cross(fUp.set(0,1,0));",
"    else if(e.kind==='pod'){if(d<900&&e.cd<=0){e.cd=1.8+Math.random();e.burst=4}if(e.burst>0&&e.bt<=0){e.bt=.15;e.burst--;const ld=fv2.copy(to).addScaledVector(S.vel,d/480).normalize();ld.x+=(Math.random()-.5)*.04;ld.y+=(Math.random()-.5)*.04;ld.normalize();flyShot(e.p.clone().addScaledVector(ld,4),ld,480,FBOLT,4,.3,4,false)}}\n    else{const want=fv2.copy(to);if(d<650)want.cross(fUp.set(0,1,0));")
rep("    e.g.lookAt(e.p.x+e.dir.x,e.p.y+e.dir.y,e.p.z+e.dir.z)}\n  // the stage\n  if(S.ph==='hangar'&&S.pos.z>330){",
"    if(e.kind!=='pod')e.g.lookAt(e.p.x+e.dir.x,e.p.y+e.dir.y,e.p.z+e.dir.z)}\n  if(S.ph==='to2')stage2Setup(S);\n  wingTick(S,dt);halcTick(S,dt);\n  // the stage\n  if(S.stage===2){if(stage2Tick(S,dt))return}else{\n  if(S.ph==='hangar'&&S.pos.z>330){")
rep("'STAGE 2-1 · DESTROY THE INTERCEPTORS · '+n+' LEFT')}\nfunction flyCam(","'STAGE 2-1 · DESTROY THE INTERCEPTORS · '+n+' LEFT')}}\nfunction flyCam(")
# collision with the Halcyon
rep("  else S.pos.addScaledVector(S.vel,dt);\n  // no wall at the edge","  else S.pos.addScaledVector(S.vel,dt);\n  if(S.halc&&shipPush(S.halc,S.pos,2.4))flyCrash(S);\n  // no wall at the edge")
# flyStart: stage 2 jump
rep("  setObj('STAGE 2-1 · LAUNCH · LEAVE THE HANGAR');comm('R',\"Easy on the throttle in here. Hangar walls don't move.\");say(touchUI?'Left stick throttle · right side steers':'W throttle · mouse steers · Shift afterburner · Space brakes',5)}",
"  if(st===2){S.pos.set(0,40,1500);S.spd=90;S.thr=.65;S.ph='to2';stage2Setup(S);say(touchUI?'Left stick throttle · right side steers':'W throttle · mouse steers · Shift afterburner · Space brakes',5);return}\n  setObj('STAGE 2-1 · LAUNCH · LEAVE THE HANGAR');comm('R',\"Easy on the throttle in here. Hangar walls don't move.\");say(touchUI?'Left stick throttle · right side steers':'W throttle · mouse steers · Shift afterburner · Space brakes',5)}")
rep("function flyExit(){if(!FLY)return;const S=FLY;scene.remove(S.g);","function flyExit(){if(!FLY)return;const S=FLY;scene.remove(S.g);if(S.halc)scene.remove(S.halc.g);if(S.wing)for(const w of S.wing)scene.remove(w.g);")
# stage done generalized
old=s[s.index("function flyStageDone(){"):s.index("function flyTick(dt){")]
rep(old,"""function flyStageDone(){const S=FLY,st=S.stage||1;if(document.pointerLockElement)document.exitPointerLock();setState('paused');for(const id of['ovKeys','classes','loadout','superpick'])$(id).hidden=true;
  $('ovTitle').textContent='Stage 2-'+st+' complete';const txt=st===1?'Kestrel is clear of Thalassa with '+S.kills+' kills. Next: stage 2-2, the rescue of the Halcyon.':'The Halcyon is safe and fourteen of her crew are aboard. Moth and Ferro fly your wing. Next: stage 2-3, the run to Meridian Station, coming in the next update.';$('ovText').textContent=txt;
  $('go').textContent=st===1?'Continue to stage 2-2':'Fly on (free flight)';$('retry').hidden=false;$('retry').textContent='Retry stage 2-'+st;LAST={m:2,s:st};S.ph=st===1?'to2':'free';setObj(st===1?'STAGE 2-2 · STAND BY':'FREE FLIGHT')}
""")
# new functions before flyStageDone
rep("function flyStageDone(){","""// ---- stage 2-2: the Halcyon, a civilian transport being boarded. Original design, about 175 m long, lying along x
function halcyonModel(){const M=shuttleMats(),g=new T.Group();
  greeble(g,'halc',(a,R)=>{const H=M.hull,D=M.dark,Tr=M.trim,Me=M.metal,Bu=M.burnt,Gl=M.glass;
    R(H,110,18,24,0,0,0,0,0,0,1.2);R(D,112,1.6,24.6,0,-4,0,0,0,0,.3);R(H,28,14,20,68,-1,0,0,0,0,1);R(H,14,9,15,86,-2.5,0,0,0,-.18,.9);R(D,6,4,13,93,-4.5,0,0,0,-.3,.5);
    R(H,90,3,7,5,10.5,0,0,0,0,.5);R(H,15,7,13,-30,14,0,0,0,0,.8);R(Gl,.5,1.6,11,-22.4,14.6,0,0,0,0,.1);for(const s of[-1,1])R(Gl,13,1.2,.4,-30,14.6,s*6.55,0,0,0,.1);
    R(H,22,24,30,-64,0,0,0,0,0,1.2);for(const y of[-6,6])for(const z of[-8,8]){a(new T.CylinderGeometry(3.4,4.2,7,18,1,true),Me,1,1,1,-78.5,y,z,0,0,1.571);a(GEO.cyl,D,3.5,.6,3.5,-75.2,y,z,0,0,1.571)}
    for(const s of[-1,1])for(let k=0;k<6;k++){const x=-42+k*15;if(s>0&&Math.abs(x-12)<9)continue;R(k%3?D:Tr,12,11,5,x,0,s*14.6,0,0,0,.5);for(const e of[-6,6])R(Me,.4,11.4,5.4,x+e,0,s*14.6,0,0,0,.1)}
    a(GEO.cyl,D,5,5,5,12,0,14.5,1.571,0,0);a(GEO.tor,Tr,4.6,4.6,4.6,12,0,17.2);for(const y of[-6.5,6.5])R(Me,14,1,6,12,y,14.5,0,0,0,.2);
    for(const s of[-1,1])R(Me,34,.5,12,-38,-9,s*21,s*-.3,0,0,.15);for(let k=0;k<4;k++)a(GEO.cyl,Me,.15,6+k*1.5,.15,-26+k*2.5,20+k*.7,-4+k*1.5);a(GEO.sph,Me,2.5,.8,2.5,-36,18.3,0);
    for(const s of[-1,1]){R(Tr,100,.5,.2,0,7.5,s*12.05,0,0,0,.05);for(let x=56;x<=80;x+=3)R(Gl,1.2,.8,.2,x,2,s*10.05,0,0,0,.05)}
    for(const[x,y,z,w,d]of[[-12,9.1,4,9,6],[38,9.1,-5,7,5],[-55,12.1,-6,8,7],[60,6.1,4,6,5]])R(Bu,w,.2,d,x,y,z,0,0,0,.05)},true);
  const fires=[];for(const[x,y,z]of[[-10,9.5,12.6],[35,-9.5,8],[-55,12.5,-8],[60,2,-10.6],[20,9.5,-12.6]]){const f=glow(0xff7a2a,9,.9);f.position.set(x,y,z);f.userData.s=9;g.add(f);fires.push(f)}
  const ring=new T.Mesh(new T.TorusGeometry(10,.25,6,40),bas({color:0x5ccf6a,transparent:true,opacity:.7,fog:false}));ring.position.set(12,0,34);ring.visible=false;g.add(ring);
  for(let i=0;i<4;i++){const t=i*Math.PI/2,b=mesh(GEO.sph,SHM.green,.5,.5,.5,12+Math.cos(t)*5.6,Math.sin(t)*5.6,17.4);g.add(b)}
  const boxes=[[-75,-12,-15,55,12,15],[-48,-6,12,45,6,17.5],[-48,-6,-17.5,45,6,-12],[54,-8,-10,94,6,10],[-38,9,-7,-22,18,7]];
  return{g,fires,ring,boxes,collar:new T.Vector3(12,0,34),pods:[[[-50,12.2,0],[0,1,0]],[[30,12.2,0],[0,1,0]],[[62,0,-10.2],[0,0,-1]],[[-15,-12.2,0],[0,-1,0]]]}}
function podModel(){const E=enemyShipKit(),g=new T.Group(),U=new T.Vector3(0,1,0);g.add(inst(kit('pod',a=>{a(GEO.cone,E.hull,2.2,5,2.2,0,4.1,0);a(GEO.cyl,E.hull,2.4,3.2,2.4,0,1.6,0);a(GEO.cyl,E.dark,2.8,.6,2.8,0,.3,0);
    for(let i=0;i<4;i++){const t=i*Math.PI/2+.4,d=new T.Vector3(Math.cos(t)*.7,-1,Math.sin(t)*.7).normalize();a(GEO.cone,E.dark,.35,2.6,.35,Math.cos(t)*2.4,-.4,Math.sin(t)*2.4,new T.Quaternion().setFromUnitVectors(U,d))}
    for(let i=0;i<3;i++){const t=i*2.094;a(GEO.sph,E.eye,.35,.35,.35,Math.cos(t)*2.2,2.6,Math.sin(t)*2.2);a(GEO.cyl,E.dark,.18,1.6,.18,Math.cos(t)*2.6,2.6,Math.sin(t)*2.6,0,-t,1.571)}a(GEO.tor,E.plate,2.5,2.5,2.5,0,3.3,0,1.571,0,0)}),false));
  const q=glow(0xff3a2a,6,.8);q.position.y=3;g.add(q);return g}
function shipPush(H,p,r){const o=H.g.position;for(const b of H.boxes){const lx=b[0]+o.x-r,ly=b[1]+o.y-r,lz=b[2]+o.z-r,hx=b[3]+o.x+r,hy=b[4]+o.y+r,hz=b[5]+o.z+r;
    if(p.x>lx&&p.x<hx&&p.y>ly&&p.y<hy&&p.z>lz&&p.z<hz){const m=[p.x-lx,hx-p.x,p.y-ly,hy-p.y,p.z-lz,hz-p.z],k=m.indexOf(Math.min(...m));if(k===0)p.x=lx;else if(k===1)p.x=hx;else if(k===2)p.y=ly;else if(k===3)p.y=hy;else if(k===4)p.z=lz;else p.z=hz;return true}}return false}
function flyCrash(S){const imp=S.spd;S.spd*=imp>45?.3:.6;if(!reduced)shake=Math.max(shake,imp>45?.4:.12);if(imp>45&&S.t-(S.crashT||-9)>.6){S.crashT=S.t;hurt(Math.min(60,imp*.14));sfx('boom');sparkle(S.pos,0xffd27a,16,10);if(msgT<=0)say('Hull impact',1)}}
function stage2Setup(S){S.stage=2;$('wave').textContent='2-2';LAST={m:2,s:2};const fw=new T.Vector3(-Math.sin(S.h),0,-Math.cos(S.h)),c=S.pos.clone().addScaledVector(fw,2600);c.y=Math.max(-200,Math.min(300,S.pos.y));if(c.length()>11000)c.setLength(11000);
  const H=halcyonModel();H.g.position.copy(c);scene.add(H.g);H.g.updateMatrixWorld(true);S.halc=H;H.collarW=H.collar.clone().add(c);S.ph='approach';S.dock=0;S.dockWave=0;S.fireT=0;
  for(const[lp,n]of H.pods){const N=new T.Vector3(...n),e=flyEnemy('pod',c.x+lp[0]+N.x*1.2,c.y+lp[1]+N.y*1.2,c.z+lp[2]+N.z*1.2);e.g.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),N);e.cd=2}
  comm('C',"Kestrel, the Halcyon is two kilometres ahead. Boarding pods are clamped to her hull. Knock them off without hitting the ship.")}
function halcTick(S,dt){const H=S.halc;if(!H)return;for(const f of H.fires)f.scale.setScalar(f.userData.s*(.75+Math.random()*.5));H.ring.visible=S.ph==='dock';if(H.ring.visible)H.ring.material.opacity=.45+.3*Math.sin(S.t*5);
  S.fireT-=dt;if(S.fireT<=0){S.fireT=.12;const f=H.fires[Math.random()*H.fires.length|0];f.getWorldPosition(fv1);if(fv1.distanceTo(S.pos)<1500){sparkle(fv1,0x6a6460,2,5);sparkle(fv1,0xffa040,2,7)}}}
const WV1=new T.Vector3(),WV2=new T.Vector3(),WV3=new T.Vector3();
function wingSpawn(S,from){S.wing=[];for(const s of[-1,1]){const g=shuttleModel();g.scale.setScalar(.8);g.position.copy(from).add(WV1.set(s*14,4,10));scene.add(g);S.wing.push({g,p:g.position,dir:new T.Vector3(0,0,1),spd:40,cd:1,bt:0,burst:0,s})}}
function wingTick(S,dt){if(!S.wing)return;const fw=WV1.set(-Math.sin(S.h),0,-Math.cos(S.h)),rt=WV2.set(Math.cos(S.h),0,-Math.sin(S.h));
  for(const w of S.wing){let tgt=null,bd=1600;for(const e of S.en){const d=e.p.distanceTo(w.p);if(d<bd){bd=d;tgt=e}}let spd;const want=WV3;
    if(tgt){want.subVectors(tgt.p,w.p).normalize();spd=150;if(bd<110)want.addScaledVector(rt,w.s).normalize();if(bd<800&&w.dir.dot(want)>.97&&w.cd<=0){w.cd=1.3+Math.random();w.burst=6}}
    else{want.copy(S.pos).addScaledVector(rt,w.s*22).addScaledVector(fw,16);want.y-=3;want.sub(w.p);const d=want.length();if(d<5)want.copy(fw);else want.divideScalar(d);spd=Math.min(260,S.spd+d*1.2)}
    w.dir.lerp(want,Math.min(1,dt*2)).normalize();w.spd+=(spd-w.spd)*Math.min(1,dt*1.5);w.p.addScaledVector(w.dir,w.spd*dt);w.cd-=dt;w.bt-=dt;
    if(w.burst>0&&w.bt<=0&&tgt){w.bt=.09;w.burst--;const m=w.p.clone().addScaledVector(w.dir,6),ld=tgt.p.clone().sub(m).normalize();flyShot(m,ld,900,FTRC,7,.13,.6,true)}
    if(S.halc)shipPush(S.halc,w.p,3);w.g.lookAt(w.p.x-w.dir.x,w.p.y-w.dir.y,w.p.z-w.dir.z);shuttleAnim(w.g,w.spd,false,0,8,1,false,dt)}}
function stage2Tick(S,dt){const H=S.halc;if(!H){setObj('STAGE 2-2 · STAND BY');return false}const hc=H.g.position,d=S.pos.distanceTo(hc),pods=S.en.filter(e=>e.kind==='pod').length;
  if(S.ph==='approach'){S.navP=hc;S.navL='HALCYON';if(d<1300){S.ph='pods';S.navP=null;comm('H',"Kestrel, this is Captain Varga of the Halcyon. They're cutting into our cargo deck. Please hurry.");comm('C',"Four pods, Kestrel, and interceptors flying cover. Watch your fire near the hull.");
      for(let i=0;i<4;i++)flyEnemy('int',hc.x+(Math.random()-.5)*900,hc.y+(Math.random()-.5)*300,hc.z+(Math.random()-.5)*900)}}
  else if(S.ph==='pods'){if(!S.en.length){S.ph='dock';S.dock=0;comm('H',"Pods are off! Our docking collar is on the starboard side, lights on. Bring her in slow.");say('Fly into the green ring slowly (under 45 mph) and hold still',4)}}
  else if(S.ph==='dock'){const P=H.collarW;S.navP=P;S.navL='DOCK';const dd=S.pos.distanceTo(P);if(dd<30&&S.spd<20)S.dock=Math.min(1,S.dock+dt/5);else S.dock=Math.max(0,S.dock-dt/6);
    if(S.dock>.15&&!S.dockWave){S.dockWave=1;comm('C',"More company inbound. Hold that dock, Kestrel.");for(let i=0;i<3;i++)flyEnemy('int',hc.x+(Math.random()-.5)*1400,hc.y+200,hc.z+1700+Math.random()*400)}
    if(S.dock>=1){S.ph='docked';S.endT=0;S.navP=null;sfx('pick');comm('H',"Hatch sealed. Fourteen crew coming across, and my two escort pilots are launching.");comm('R',"Welcome aboard, everyone. Mind the seed trays.");comm('H',"Moth and Ferro are yours, Kestrel. They will fly your wing to Meridian.");wingSpawn(S,P)}}
  else if(S.ph==='docked'){S.endT+=dt;if(S.endT>6&&!S.en.length){S.ph='w3';comm('C',"Last wave on the scope, with a gunboat. Clear it and the Halcyon can run.");
      for(let i=0;i<4;i++)flyEnemy('int',S.pos.x+(Math.random()-.5)*1200,S.pos.y+(Math.random()-.5)*400,S.pos.z+1600+Math.random()*500);flyEnemy('gun',hc.x,hc.y+120,hc.z-1600)}}
  else if(S.ph==='w3'){if(!S.en.length){S.ph='end2';S.endT=0;comm('C',"Halcyon is clear. Good work, Kestrel. Meridian is waiting.")}}
  else if(S.ph==='end2'){S.endT+=dt;if(S.endT>4&&!commCur&&!COMMS.length&&!VOICE.busy||S.endT>40){flyStageDone();return true}}
  const n=S.en.length;setObj(S.ph==='approach'?'STAGE 2-2 · RESCUE · REACH THE HALCYON · '+Math.round(d)+' M':S.ph==='pods'?'STAGE 2-2 · DESTROY THE BOARDING PODS · '+pods+' LEFT'+(n>pods?' · '+(n-pods)+' FIGHTERS':''):
    S.ph==='dock'?'STAGE 2-2 · DOCK AT THE COLLAR · '+(S.dock>0?Math.round(S.dock*100)+'%':Math.round(S.pos.distanceTo(H.collarW))+' M · UNDER 45 MPH'):S.ph==='docked'?'STAGE 2-2 · SURVIVORS BOARDING':S.ph==='w3'?'STAGE 2-2 · PROTECT THE HALCYON · '+n+' LEFT':S.ph==='free'?'FREE FLIGHT':'STAGE 2-2 · STAND BY · FLEET COMMAND');return false}
function flyStageDone(){""")
# HUD nav marker
rep("  for(let i=k;i<FTG.length;i++)FTG[i].hidden=true}","""  for(let i=k;i<FTG.length;i++)FTG[i].hidden=true;
  let nv=$('fnav');if(!nv){nv=document.createElement('div');nv.id='fnav';nv.className='tg';nv.appendChild(document.createElement('i'));box.appendChild(nv)}
  if(S.navP){fv1.copy(S.navP).project(cam);const on=fv1.z<1&&Math.abs(fv1.x)<1.1&&Math.abs(fv1.y)<1.1;nv.hidden=!on;if(on){nv.style.left=((fv1.x*.5+.5)*W)+'px';nv.style.top=((-fv1.y*.5+.5)*H)+'px';nv.firstChild.textContent=S.navL+' '+Math.round(S.navP.distanceTo(S.pos))+' M'}}else nv.hidden=true}""")
open(p,'w').write(s);print('ok')
