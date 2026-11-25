p='/home/user/greenhouse-nine/index.html'
s=open(p).read()
def rep(a,b,c=1):
  global s
  assert s.count(a)==c,(s.count(a),a[:100]); s=s.replace(a,b)
rep("{m:2,s:3,t:'Run to Meridian',d:'500 mph · blockade',ready:false}","{m:2,s:3,t:'Run to Meridian',d:'500 mph · minefield · blockade · Meridian Station',ready:true}")
# enemies: mines
rep("const g=kind==='gun'?gunboatModel():kind==='pod'?podModel():interceptorModel();","const g=kind==='gun'?gunboatModel():kind==='pod'?podModel():kind==='mine'?mineModel():interceptorModel();")
rep("K={gun:[40,11,55],pod:[14,5,0],int:[6,4.5,150]}[kind];","K={gun:[40,11,55],pod:[14,5,0],mine:[2,3,0],int:[6,4.5,150]}[kind];")
rep("    else if(e.kind==='pod'){","    else if(e.kind==='mine'){e.g.rotation.y+=dt*.6;if(d<24){flyBoom(e.p,1.6);scene.remove(e.g);S.en.splice(S.en.indexOf(e),1);hurt(18);if(state!=='playing')return;continue}}\n    else if(e.kind==='pod'){")
rep("    if(e.kind!=='pod')e.g.lookAt(","    if(e.kind!=='pod'&&e.kind!=='mine')e.g.lookAt(")
rep("{let best=null,bd=.978;for(const e of S.en){fv1.subVectors(e.p,cam.position);","{let best=null,bd=.978;for(const e of S.en){if(e.kind==='mine')continue;fv1.subVectors(e.p,cam.position);")
rep("for(const e of S.en){fv1.copy(e.p).project(cam);if(fv1.z>1","for(const e of S.en){if(e.kind==='mine'&&e.p.distanceTo(S.pos)>500)continue;fv1.copy(e.p).project(cam);if(fv1.z>1")
rep("let tgt=null,bd=1600;for(const e of S.en){const d=e.p.distanceTo(w.p);","let tgt=null,bd=1600;for(const e of S.en){if(e.kind==='mine')continue;const d=e.p.distanceTo(w.p);")
# operation area wider in 2-3
rep("{const R=S.pos.length();if(R>15000&&S.t-(S.farT||-99)>12){","{const R=S.pos.length(),LIM=S.stage===3?30000:15000;if(R>LIM&&S.t-(S.farT||-99)>12){")
rep("if(R>19000){const tw=Math.atan2(S.pos.x,S.pos.z);","if(R>LIM+4000){const tw=Math.atan2(S.pos.x,S.pos.z);")
# rotated ship collision
rep("function shipPush(H,p,r){const o=H.g.position;for(const b of H.boxes){const lx=b[0]+o.x-r,ly=b[1]+o.y-r,lz=b[2]+o.z-r,hx=b[3]+o.x+r,hy=b[4]+o.y+r,hz=b[5]+o.z+r;\n    if(p.x>lx&&p.x<hx&&p.y>ly&&p.y<hy&&p.z>lz&&p.z<hz){const m=[p.x-lx,hx-p.x,p.y-ly,hy-p.y,p.z-lz,hz-p.z],k=m.indexOf(Math.min(...m));if(k===0)p.x=lx;else if(k===1)p.x=hx;else if(k===2)p.y=ly;else if(k===3)p.y=hy;else if(k===4)p.z=lz;else p.z=hz;return true}}return false}",
"""function shipPush(H,p,r){const o=H.g.position,a=H.g.rotation.y,c=Math.cos(a),sn=Math.sin(a),dx=p.x-o.x,dz=p.z-o.z,q={x:dx*c-dz*sn,y:p.y-o.y,z:dx*sn+dz*c};let hit=false;
  for(const b of H.boxes){const lx=b[0]-r,ly=b[1]-r,lz=b[2]-r,hx=b[3]+r,hy=b[4]+r,hz=b[5]+r;
    if(q.x>lx&&q.x<hx&&q.y>ly&&q.y<hy&&q.z>lz&&q.z<hz){const m=[q.x-lx,hx-q.x,q.y-ly,hy-q.y,q.z-lz,hz-q.z],k=m.indexOf(Math.min(...m));if(k===0)q.x=lx;else if(k===1)q.x=hx;else if(k===2)q.y=ly;else if(k===3)q.y=hy;else if(k===4)q.z=lz;else q.z=hz;hit=true;break}}
  if(!hit&&H.tori)for(const[ty,R0,tb]of H.tori){const rr=Math.hypot(q.x,q.z)||1e-6,dy=q.y-ty,dr=rr-R0,dd=Math.hypot(dr,dy),lim=tb+r;if(dd<lim){const k=lim/(dd||1e-6);const nr=R0+dr*k;q.x*=nr/rr;q.z*=nr/rr;q.y=ty+dy*k;hit=true;break}}
  if(hit){p.x=o.x+q.x*c+q.z*sn;p.y=o.y+q.y;p.z=o.z-q.x*sn+q.z*c}return hit}""")
rep("  if(S.halc&&shipPush(S.halc,S.pos,2.4))flyCrash(S);","  if(S.halc&&shipPush(S.halc,S.pos,2.4))flyCrash(S);if(S.meri&&shipPush(S.meri,S.pos,2.4))flyCrash(S);")
rep("    if(S.halc)shipPush(S.halc,w.p,3);w.g.lookAt(","    if(S.halc)shipPush(S.halc,w.p,3);if(S.meri)shipPush(S.meri,w.p,3);w.g.lookAt(")
# flyTick hooks
rep("  if(S.ph==='to2')stage2Setup(S);\n  wingTick(S,dt);halcTick(S,dt);\n  // the stage\n  if(S.stage===2){if(stage2Tick(S,dt))return}else{",
"  if(S.ph==='to2')stage2Setup(S);if(S.ph==='to3')stage3Setup(S);\n  wingTick(S,dt);halcTick(S,dt);meriTick(S,dt);\n  // the stage\n  if(S.stage===3){if(stage3Tick(S,dt))return}else if(S.stage===2){if(stage2Tick(S,dt))return}else{")
rep("  if(st===2){S.pos.set(0,40,1500);S.spd=90;S.thr=.65;S.ph='to2';stage2Setup(S);",
"  if(st===3){S.pos.set(0,40,1500);S.spd=90;S.thr=.65;S.ph='to3';stage3Setup(S);wingSpawn(S,S.pos);say(touchUI?'Left stick throttle · right side steers':'W throttle · mouse steers · Shift afterburner · Space brakes',5);return}\n  if(st===2){S.pos.set(0,40,1500);S.spd=90;S.thr=.65;S.ph='to2';stage2Setup(S);")
rep("function flyExit(){if(!FLY)return;const S=FLY;scene.remove(S.g);if(S.halc)scene.remove(S.halc.g);","function flyExit(){if(!FLY)return;const S=FLY;scene.remove(S.g);if(S.halc)scene.remove(S.halc.g);if(S.meri)scene.remove(S.meri.g);")
# stage done
old=s[s.index("function flyStageDone(){const S=FLY,st=S.stage||1;"):s.index("function flyTick(dt){")]
rep(old,"""function flyStageDone(){const S=FLY,st=S.stage||1;if(document.pointerLockElement)document.exitPointerLock();setState('paused');for(const id of['ovKeys','classes','loadout','superpick'])$(id).hidden=true;saveM2(st);
  $('ovTitle').textContent=st===3?'Mission 2 complete':'Stage 2-'+st+' complete';
  const txt=st===1?'Kestrel is clear of Thalassa with '+S.kills+' kills. Next: stage 2-2, the rescue of the Halcyon.':st===2?'The Halcyon is safe and fourteen of her crew are aboard. Moth and Ferro fly your wing. Next: stage 2-3, the run to Meridian Station.':
    'Kestrel is down in Meridian\\'s bay three with Rowan, the Halcyon\\'s crew and '+S.kills+' kills behind her. The Wellmonger knows your name now. Mission 3, the war on Europa, comes later.';$('ovText').textContent=txt;
  $('go').textContent=st===3?'Fly on (free flight)':'Continue to stage 2-'+(st+1);$('retry').hidden=false;$('retry').textContent='Retry stage 2-'+st;LAST={m:2,s:st};S.ph=st===1?'to2':st===2?'to3':'free';setObj(st===3?'FREE FLIGHT':'STAGE 2-'+(st+1)+' · STAND BY')}
// ---- stage 2-3: the run to Meridian Station. Original station: a spire, two counter-rotating rings, a docking bay and solar wings
function meridianModel(){const M=shuttleMats(),g=new T.Group();
  greeble(g,'meri',(a,R)=>{const H=M.hull,D=M.dark,Tr=M.trim,Me=M.metal,Gl=M.glass;
    a(GEO.cyl,H,22,320,22,0,0,0);for(const y of[-60,60])a(GEO.cyl,D,32,16,32,0,y,0);a(GEO.cone,H,22,60,22,0,190,0);a(GEO.cone,H,22,60,22,0,-190,0,Math.PI,0,0);for(const y of[-130,-100,100,130])a(GEO.cyl,Tr,23,3,23,0,y,0);
    for(let k=0;k<40;k++){const t=k*.9,y=-150+k*7.5;R(Gl,.4,1.2,4,Math.cos(t)*22.1,y,Math.sin(t)*22.1,0,-t,0,.1)}
    R(H,100,44,60,0,0,58,0,0,0,2);R(D,72,28,6,0,-2,86.5,0,0,0,.4);for(const y of[13.5,-17.5])R(Tr,78,2,1.2,0,y,89);for(const x of[-38,38])R(Tr,2,33,1.2,x,-2,89);
    for(let x=-30;x<=30;x+=10)R(Gl,6,2,.3,x,18,88.2,0,0,0,.1);R(Me,104,3,64,0,23.5,58,0,0,0,.5);for(const s of[-1,1])R(Me,4,30,8,s*48,26,58,0,0,0,.4);
    for(const s of[-1,1]){a(GEO.cyl,Me,3,120,3,s*80,150,0,0,0,1.571);R(Me,4,90,160,s*170,150,0,0,0,0,.6);for(let k=-3;k<=3;k++)R(D,4.4,88,.8,s*170,150,k*22,0,0,0,.1)}
    for(let k=0;k<6;k++)a(GEO.cyl,Me,.6,30+k*6,.6,-8+k*3,230+k*3,4)},true);
  const tori=[],rings=[];for(const y of[-90,90]){const r=new T.Group();r.position.y=y;g.add(r);r.add(new T.Mesh(new T.TorusGeometry(200,10,10,72),M.hull));r.children[0].rotation.x=Math.PI/2;
    for(let k=0;k<4;k++){const sp=mesh(GEO.cyl,M.metal,3,178,3,0,0,0);sp.rotation.z=Math.PI/2;sp.rotation.y=k*Math.PI/4;sp.position.set(Math.cos(k*Math.PI/4)*111*0,0,0);r.add(sp)}
    for(let k=0;k<12;k++){const t=k*Math.PI/6,l=mesh(GEO.box,SHM.white,2,1,2,Math.cos(t)*200,10.5,Math.sin(t)*200);r.add(l)}rings.push(r);tori.push([y,200,10])}
  const beacons=[];for(const y of[222,-222]){const b=glow(0xff3030,40,.9);b.position.y=y;g.add(b);beacons.push(b)}{const q=glow(0x8fe6ff,60,.5);q.position.set(0,-2,86);g.add(q)}
  return{g,rings,beacons,tori,boxes:[[-24,-222,-24,24,222,24],[-50,-22,28,50,26,86],[-52,22,26,52,25,90]],bay:new T.Vector3(0,-2,140)}}
function mineModel(){const E=enemyShipKit(),g=new T.Group();g.add(inst(kit('mine',a=>{a(GEO.ico,E.hull,2.2,2.2,2.2);for(let i=0;i<8;i++){const d=new T.Vector3(Math.sin(i*2.4)*Math.cos(i),Math.cos(i*1.3),Math.sin(i)*.9).normalize();a(GEO.cone,E.dark,.3,1.6,.3,d.x*2.4,d.y*2.4,d.z*2.4,new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),d))}}),false));
  const q=glow(0xff3030,7,.8);g.add(q);return g}
function stage3Setup(S){S.stage=3;$('wave').textContent='2-3';LAST={m:2,s:3};S.navP=null;const fw=new T.Vector3(-Math.sin(S.h),0,-Math.cos(S.h)),A=S.pos.clone();A.y=Math.max(-200,Math.min(300,A.y));
  const M=meridianModel(),mp=A.clone().addScaledVector(fw,8000);M.g.position.copy(mp);M.g.rotation.y=S.h;scene.add(M.g);M.g.updateMatrixWorld(true);S.meri=M;M.bayW=M.bay.clone().applyMatrix4(M.g.matrixWorld);
  S.r3={A,fw,rt:new T.Vector3(-fw.z,0,fw.x),blk:0,gun:0,chase:0};S.ph='run';S.endT=0;S.turT=0;
  const P=(along,lat,up)=>A.clone().addScaledVector(fw,along).addScaledVector(S.r3.rt,lat).add(new T.Vector3(0,up,0));
  for(let i=0;i<36;i++){const p=P(2500+hash(i,61)*3000,(hash(i,62)-.5)*1200,(hash(i,63)-.5)*500);flyEnemy('mine',p.x,p.y,p.z)}
  for(const lat of[-500,0,500]){const p=P(5600,lat,40);const e=flyEnemy('gun',p.x,p.y,p.z);e.sp=8;e.cd=3}
  comm('C',"Kestrel, Meridian is eight kilometres out. The Wellmonger's blockade sits across the lane, with a minefield in front of it. Burn hard and don't stop.")}
function meriTick(S,dt){const M=S.meri;if(!M)return;M.rings[0].rotation.y+=dt*.05;M.rings[1].rotation.y-=dt*.05;for(const b of M.beacons)b.visible=Math.sin(S.t*3)>0;
  // Meridian's guns cover the last two kilometres
  if(S.ph==='cover'||S.ph==='arrive'){S.turT-=dt;if(S.turT<=0){S.turT=.35;const mp=M.g.position;let best=null,bd=2600;for(const e of S.en){if(e.kind==='mine')continue;const d=e.p.distanceTo(mp);if(d<bd){bd=d;best=e}}
      if(best){const from=mp.clone().add(new T.Vector3((Math.random()-.5)*120,(Math.random()-.5)*200,(Math.random()-.5)*120)),dir=best.p.clone().sub(from).normalize();flyShot(from,dir,1600,FTRC,14,.5,4,true)}}}}
function stage3Tick(S,dt){const M=S.meri,R3=S.r3;if(!M){setObj('STAGE 2-3 · STAND BY');return false}const along=fv1.subVectors(S.pos,R3.A).dot(R3.fw),left=Math.max(0,Math.round(S.pos.distanceTo(M.bayW)));S.navP=M.bayW;S.navL='MERIDIAN';
  const P=(al,lat,up)=>R3.A.clone().addScaledVector(R3.fw,al).addScaledVector(R3.rt,lat).add(new T.Vector3(0,up,0));
  if(S.ph==='run'){if(along>1800&&!R3.blk){R3.blk=1;comm('R',"Mines. Lovely. Don't touch the red ones.");comm('C',"Blockade guns are tracking you. Gunboats on the line, interceptors launching.");for(let i=0;i<6;i++){const p=P(4200+Math.random()*600,(Math.random()-.5)*900,(Math.random()-.5)*300);flyEnemy('int',p.x,p.y,p.z)}}
    if(along>5800){S.ph='cover';comm('C',"You're through! Meridian's guns are covering you now. Get inside, bay three.");for(let i=0;i<4;i++){const p=P(along-1400,(Math.random()-.5)*600,(Math.random()-.5)*200);flyEnemy('int',p.x,p.y,p.z)}}}
  else if(S.ph==='cover'){if(S.pos.distanceTo(M.bayW)<90){S.ph='arrive';S.endT=0;S.thr=0;for(const e of S.en.slice())if(e.kind==='mine'){scene.remove(e.g);S.en.splice(S.en.indexOf(e),1)}
      comm('C',"Kestrel, welcome to Meridian. Bay three is yours. Take her in.");comm('R',"We made it. Imani, if you can hear this, we made it.");comm('C',"Good flying, Kestrel. The Wellmonger knows your name now. Get some rest.")}}
  else if(S.ph==='arrive'){S.endT+=dt;S.spd=Math.min(S.spd,20);for(const e of S.en.slice())if(e.p.distanceTo(S.pos)<2500)flyHit(e,99);if(S.endT>4&&!commCur&&!COMMS.length&&!VOICE.busy||S.endT>45){flyStageDone();return true}}
  const n=S.en.filter(e=>e.kind!=='mine').length;setObj(S.ph==='run'?'STAGE 2-3 · RUN TO MERIDIAN · '+left.toLocaleString()+' M'+(along<5800?' · BLOCKADE AT '+Math.max(0,Math.round(5600-along)).toLocaleString()+' M':''):S.ph==='cover'?'STAGE 2-3 · REACH BAY THREE · '+left.toLocaleString()+' M'+(n?' · '+n+' CHASING':''):S.ph==='arrive'?'STAGE 2-3 · DOCKING AT MERIDIAN':S.ph==='free'?'FREE FLIGHT':'STAGE 2-3');return false}
""")
# mission 2 progress, kept apart from the Mission 1 save
rep("let SAVE=null,saveRef=null,saveBusy=false,NOSAVE=false,LAST={m:1,s:1};","let SAVE=null,saveRef=null,saveBusy=false,NOSAVE=false,LAST={m:1,s:1},M2=0,m2Ref=null;\ntry{M2=Math.max(0,Math.min(3,Math.floor(+localStorage.getItem('gh9-m2'))||0))}catch(e){}\nfunction saveM2(st){if(st<=M2)return;M2=st;try{localStorage.setItem('gh9-m2',String(M2))}catch(e){}if(m2Ref)m2Ref.set({st:M2,t:Date.now()}).catch(()=>{});syncCont()}")
rep("saveRef=db.doc('data/users/'+id+'/save');const sn=await saveRef.get();","saveRef=db.doc('data/users/'+id+'/save');m2Ref=db.doc('data/users/'+id+'/m2');try{const m=await m2Ref.get();if(m.exists){const v=Math.max(0,Math.min(3,Math.floor(+m.data().st)||0));if(v>M2){M2=v;try{localStorage.setItem('gh9-m2',String(M2))}catch(e){}}}}catch(e){}const sn=await saveRef.get();")
rep("const done=SAVE&&S.m===1&&SAVE.wave>=S.s;","const done=S.m===1?SAVE&&SAVE.wave>=S.s:M2>=S.s;")
rep("function syncCont(){missionsBuild();$('stagesBtn').hidden=state==='paused';if(state==='paused')$('missions').hidden=true;const b=$('cont');b.hidden=!SAVE||state==='paused';if(SAVE)b.textContent=SAVE.wave>=CAMP.length?'Continue · endless stage '+(SAVE.wave+1):'Continue · stage '+(SAVE.wave+1)+' of '+CAMP.length;",
"function contM2(){return M2>0&&M2<3&&(!SAVE||SAVE.done)}\nfunction syncCont(){missionsBuild();$('stagesBtn').hidden=state==='paused';if(state==='paused')$('missions').hidden=true;const b=$('cont');b.hidden=!(SAVE||contM2())||state==='paused';if(contM2())b.textContent='Continue · Mission 2, stage 2-'+(M2+1);else if(SAVE)b.textContent=SAVE.wave>=CAMP.length?'Continue · endless stage '+(SAVE.wave+1):'Continue · stage '+(SAVE.wave+1)+' of '+CAMP.length;")
rep("function continueGame(){if(!SAVE)return;","function continueGame(){if(contM2()){startAt(2,M2+1);return}if(!SAVE)return;")
rep("if(m===2){begin(true);NOSAVE=true;if(skip)flyStart(s);","if(m===2){begin(true);NOSAVE=true;if(skip||s>1)flyStart(s);")
open(p,'w').write(s);print('ok')
