# v71 stage transitions: a fly-off (the Kestrel burns away from a cinematic camera and jumps) before each stage card,
# a fly-in (she drops out of the jump past the camera, which then swings in behind her) at the start of the next stage,
# an outside camera for the landing at Meridian, fades instead of hard cuts, letterbox bars and a stage title
import sys
src,dst=sys.argv[1],sys.argv[2]
s=open(src).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]);s=s.replace(a,b)

FCJS=r'''// ---- stage transitions (fly-off, fly-in, landing camera)
const FC={on:false,k:'',t:0,hand:2.7,ending:0,et0:0,jumped:0,sc:.92,cpos:new T.Vector3(),look:new T.Vector3(),cq:new T.Quaternion(),P0:new T.Vector3(),P1:new T.Vector3(),fw:new T.Vector3(),ctr:new T.Vector3(),a0:0},FCF=[];
function fcEl(id,css,early){let d=document.getElementById(id);if(!d){d=document.createElement('div');d.id=id;d.style.cssText=css;if(early)cv.parentElement.insertBefore(d,cv.nextSibling);else cv.parentElement.appendChild(d)}return d}
const FADECSS='position:absolute;inset:0;background:#000;pointer-events:none;z-index:4;opacity:0';
function fadeSet(v){const d=fcEl('fadeL',FADECSS);d.style.transition='none';d.style.opacity=v}
function fade(v,sec){const d=fcEl('fadeL',FADECSS);d.style.transition='opacity '+sec+'s ease';void d.offsetWidth;d.style.opacity=v}
function flashW(){const d=fcEl('flashL','position:absolute;inset:0;background:#e8f6ff;pointer-events:none;z-index:4;opacity:0');d.style.transition='none';d.style.opacity=.5;void d.offsetWidth;d.style.transition='opacity .5s ease-out';d.style.opacity=0}
// black bars sit just above the game but under the radio box, so radio lines read like subtitles
function letterbox(on){const d=fcEl('lbox','position:absolute;inset:0;pointer-events:none;overflow:hidden',true);
  if(!d.firstChild)d.innerHTML='<i style="position:absolute;left:0;right:0;top:0;height:10%;background:#000;transition:transform .6s ease;transform:translateY(-100%)"></i><i style="position:absolute;left:0;right:0;bottom:0;height:10%;background:#000;transition:transform .6s ease;transform:translateY(100%)"></i>';
  d.children[0].style.transform=on?'translateY(0)':'translateY(-100%)';d.children[1].style.transform=on?'translateY(0)':'translateY(100%)'}
function fcTitle(a,b){const d=fcEl('fctitle','position:absolute;left:0;right:0;top:20%;text-align:center;color:#dcebe4;pointer-events:none;z-index:5;opacity:0;transition:opacity .9s ease');
  d.innerHTML='<div style="font:700 12px monospace;letter-spacing:.4em;color:#ffb238">'+a+'</div><div style="font:700 30px \'Chakra Petch\',sans-serif;letter-spacing:.22em;margin-top:8px;text-shadow:0 0 18px rgba(0,0,0,.8)">'+b+'</div>';
  void d.offsetWidth;d.style.opacity=1;clearTimeout(fcTitle.t);fcTitle.t=setTimeout(()=>{d.style.opacity=0},2800)}
// a jump flash: a bright burst that grows and fades where a ship enters or leaves the jump
function jumpFlash(p,big){const m=new T.SpriteMaterial({map:glowTex,color:0xdff4ff,blending:T.AdditiveBlending,depthWrite:false,transparent:true,fog:false}),g=new T.Sprite(m);g.position.copy(p);g.scale.setScalar(big?90:50);scene.add(g);FCF.push({g,m,t:0,s:big?90:50})}
function fcFlashTick(dt){for(let i=FCF.length-1;i>=0;i--){const f=FCF[i];f.t+=dt;const k=f.t/.7;f.g.scale.setScalar(f.s*(1+k*2.5));f.m.opacity=Math.max(0,1-k);if(k>=1){scene.remove(f.g);f.m.dispose();FCF.splice(i,1)}}}
function fcReset(){FC.on=false;FC.ending=0;fadeSet(0);letterbox(false);const t=document.getElementById('fctitle');if(t)t.style.opacity=0;
  if(FLY){if(FLY.g){FLY.g.visible=true;FLY.g.scale.setScalar(FC.sc)}if(FLY.wing)for(const w of FLY.wing){w.g.visible=true;w.jumped=0}}}
function fcStart(k,S,a,b){if(FC.on)fcReset();if(k==='out'&&Math.cos(S.p)<0){S.h+=Math.PI;yaw+=Math.PI;S.p=(S.p>0?Math.PI:-Math.PI)-S.p;pitch=(pitch>0?Math.PI:-Math.PI)-pitch;S.roll+=Math.PI;S.camR=(S.camR||0)+Math.PI*.8}Object.assign(FC,{on:true,k,t:0,ending:0,jumped:0,sc:S.g.scale.x});$('fhud').hidden=true;letterbox(true);
  const fw=FC.fw.set(-Math.sin(S.h)*Math.cos(S.p),Math.sin(S.p),-Math.cos(S.h)*Math.cos(S.p)).normalize(),rt=fv1.set(Math.cos(S.h),0,-Math.sin(S.h));
  if(k==='out'){FC.ho=S.h;const d=new T.Vector3();for(const dh of[0,.5,-.5,1,-1,1.6,-1.6,2.4,-2.4,Math.PI]){d.set(-Math.sin(S.h+dh),0,-Math.cos(S.h+dh));let ok=true;for(const r of[150,300,500,700])if(!fcFree(S,fv9.copy(S.pos).addScaledVector(d,r))){ok=false;break}if(ok){FC.ho=S.h+dh;break}}
    d.set(-Math.sin(FC.ho),0,-Math.cos(FC.ho));FC.cpos.copy(fcCamPick(S,S.pos,d,[[120,34,10],[120,-34,10],[70,60,30],[70,-60,30],[0,0,90],[-50,0,40]]));FC.look.copy(S.pos)}
  else if(k==='in'){S.p=0;pitch=0;yaw=S.h;fw.set(-Math.sin(S.h),0,-Math.cos(S.h));FC.P1.copy(S.pos);const D=new T.Vector3();let pick=null;
    for(const[a,L]of[[0,950],[.45,950],[-.4,950],[0,450],[.6,450]]){D.copy(fw).multiplyScalar(Math.cos(a)).addScaledVector(fv9.set(0,-1,0),Math.sin(a)).normalize();const P0=fv8.copy(S.pos).addScaledVector(D,-L).clone();if(fcLine(S,P0,S.pos,8)&&fcFree(S,P0)){pick=[D.clone(),P0];break}}
    if(!pick)pick=[fw.clone(),S.pos.clone().addScaledVector(fw,-950)];FC.D=pick[0];FC.P0.copy(pick[1]);FC.cpos.copy(fcCamPick(S,S.pos,fw,[[42,26,6],[42,-26,6],[60,40,25],[30,0,40],[-30,30,20]]));FC.look.copy(FC.P0);
    S.pos.copy(FC.P0);fadeSet(1);fade(0,.9);if(a)fcTitle(a,b);jumpFlash(FC.P0,true);sfx('warp');if(S.wing)S.wing.forEach((w,i)=>{w.g.visible=true;w.jumped=0})}
  else if(k==='land'){const M=S.meri;FC.ctr.copy(M.land).applyMatrix4(M.g.matrixWorld);FC.a0=M.g.rotation.y+1.0;FC.look.copy(S.pos)}}
// clearance: is a point clear of Thalassa's hull (footprint and hangar mouth), the Halcyon and Meridian?
const fv8=new T.Vector3(),fv9=new T.Vector3();
function fcFree(S,p){if(!S.noHull&&(Math.abs(p.x)<AX+60&&p.z>-AZ-80&&p.z<AZ+170&&p.y>-70&&p.y<120||nearHull(p)))return false;
  if(S.halc){fv8.copy(p);if(shipPush(S.halc,fv8,30))return false}if(S.meri){fv8.copy(p);if(shipPush(S.meri,fv8,30))return false}return true}
function fcLine(S,a,b,n){for(let i=1;i<n;i++)if(!fcFree(S,fv9.lerpVectors(a,b,i/n)))return false;return true}
// picks a camera spot from offsets (ahead, side, up) relative to a direction, clear of hulls with a clear view of the ship
function fcCamPick(S,at,dir,list){const rt=fv1.set(-dir.z,0,dir.x).normalize(),c=new T.Vector3();
  for(const o of list){c.copy(at).addScaledVector(dir,o[0]).addScaledVector(rt,o[1]);c.y+=o[2];if(fcFree(S,c)&&fcLine(S,c,at,6))return c}return c}
function fcEnd(){if(FC.on&&!FC.ending){FC.ending=1;FC.et0=FC.t;fade(1,.85)}}
function fcFinish(S){const k=FC.k;FC.on=false;FC.ending=0;letterbox(false);S.g.visible=true;S.g.scale.setScalar(FC.sc);if(S.wing)for(const w of S.wing){w.g.visible=true;w.jumped=0}
  if(k==='out'||k==='land'){flyStageDone();return true}$('fhud').hidden=false;return false}
// places the ship on its fly-in path: it drops out of the jump about a kilometre back and brakes hard to cruise speed
function fcPlace(S){const u=Math.min(1,FC.t/FC.hand),e=1-Math.pow(1-u,3);S.pos.lerpVectors(FC.P0,FC.P1,e);if(FC.D){S.p=Math.asin(Math.max(-1,Math.min(1,FC.D.y)))*(1-e);pitch=S.p}S.spd=Math.max(90,3*Math.pow(1-u,2)*950/FC.hand);S.thr=.65;S.vel.copy(FC.D||FC.fw).multiplyScalar(S.spd);
  if(S.wing){const rt=fv1.set(Math.cos(S.h),0,-Math.sin(S.h));for(const w of S.wing){w.p.copy(S.pos).addScaledVector(rt,w.s*22).addScaledVector(FC.fw,-14);w.p.y+=3;w.dir.copy(FC.fw);w.spd=S.spd}}
  S.g.scale.set(FC.sc,FC.sc,FC.sc*(1+Math.max(0,1-FC.t/.35)*9))}
// returns true when it has ended the stage (the game is paused on the stage card)
function fcTick(S,dt){FC.t+=dt;
  if(FC.k==='out'){yaw+=ad(FC.ho,yaw)*Math.min(1,dt*2.5);pitch+=(0-pitch)*Math.min(1,dt*1.5);S.thr=1;
    if(FC.t>2.7&&!FC.jumped){FC.jumped=1;jumpFlash(S.pos,false);flashW();sfx('warp')}
    if(FC.jumped){const k=Math.min(1,(FC.t-2.7)/.22);S.g.scale.set(FC.sc,FC.sc,FC.sc*(1+k*14));if(k>=1)S.g.visible=false}
    if(S.wing)S.wing.forEach((w,i)=>{if(FC.t>2.9+i*.16&&!w.jumped){w.jumped=1;jumpFlash(w.p,false);w.g.visible=false}});
    if(FC.t>3.35)fcEnd()}
  else if(FC.k==='in'){if(FC.t<FC.hand){yaw=S.h}else if(FC.t>FC.hand+.95)return fcFinish(S)}
  if(FC.ending&&FC.t-FC.et0>1.0)return fcFinish(S);return false}
function fcCam(S,dt){const t=FC.t;
  if(FC.k==='out'){cam.position.copy(FC.cpos);FC.look.lerp(S.pos,Math.min(1,dt*7));cam.lookAt(FC.look);cam.updateMatrixWorld();dustTick();return true}
  if(FC.k==='land'){const a=FC.a0-t*.12,c=FC.ctr;cam.position.set(c.x+Math.sin(a)*78,c.y+26,c.z+Math.cos(a)*78);FC.look.lerp(S.pos,Math.min(1,dt*4));cam.lookAt(FC.look);cam.updateMatrixWorld();dustTick();return true}
  if(FC.k==='in'&&t<FC.hand){cam.position.copy(FC.cpos);FC.look.lerp(S.pos,Math.min(1,dt*9));cam.lookAt(FC.look);cam.updateMatrixWorld();FC.cq.copy(cam.quaternion);dustTick();return true}
  return false}
// after the hand-over the normal chase camera runs, eased in from the last cinematic view
function fcBlend(){if(!FC.on||FC.k!=='in'||FC.t<FC.hand)return;const q=Math.min(1,(FC.t-FC.hand)/.9),w=q*q*(3-2*q);cam.position.lerpVectors(FC.cpos,cam.position,w);cam.quaternion.slerpQuaternions(FC.cq,cam.quaternion,w);cam.updateMatrixWorld()}
'''
rep("function flyStart(st){",FCJS+"function flyStart(st){fcReset();if(st===1){fadeSet(1);fade(0,1.4);fcTitle('STAGE 2-1','LAUNCH FROM THALASSA')}")
rep("function flyTick(dt){const S=FLY;S.t+=dt;flyUpright(S,dt);","function flyTick(dt){const S=FLY;S.t+=dt;fcFlashTick(dt);if(FC.on&&fcTick(S,dt))return;flyUpright(S,dt);")
rep("function flyCam(dt){const S=FLY,sh=shake>0?shake*.35:0;","function flyCam(dt){const S=FLY,sh=shake>0?shake*.35:0;if(FC.on&&fcCam(S,dt))return;")
rep("cam.updateMatrixWorld();dustTick()}","cam.updateMatrixWorld();fcBlend();dustTick()}")
rep("S.g.position.copy(S.pos);S.g.rotation.set(S.p,S.h,S.roll);","if(FC.on&&FC.k==='in'&&FC.t<FC.hand)fcPlace(S);S.g.position.copy(S.pos);S.g.rotation.set(S.p,S.h,S.roll);")
# no damage, firing or braking while a transition plays; the fly-off runs on the afterburner
rep("function hurt(n){if(cineT>0)return;","function hurt(n){if(cineT>0||FC.on)return;")
rep("if((firing||padFire)&&S.gcd<=0&&S.over<=0&&S.ph!=='hangar'){","if((firing||padFire)&&!FC.on&&S.gcd<=0&&S.over<=0&&S.ph!=='hangar'){")
rep("function flyMissile(){const S=FLY;if(!S||","function flyMissile(){const S=FLY;if(FC.on||!S||")
rep("function flyMAC(){const S=FLY;if(!S||","function flyMAC(){const S=FLY;if(FC.on||!S||")
rep("if(keys.Space)tgt=0;","if(keys.Space&&!FC.on)tgt=0;")
rep("bk=((keys.ShiftLeft||keys.ShiftRight)||autoAB)&&S.boost>0.02&&!near;","bk=(((keys.ShiftLeft||keys.ShiftRight)||autoAB)&&S.boost>0.02||FC.on&&FC.k==='out')&&!near;")
# stage ends: fly off (2-1, 2-2) or watch the landing (2-3), then the stage card
rep("else if(S.ph==='end2'){S.endT+=dt;if(S.endT>4&&!commCur&&!COMMS.length&&!VOICE.busy||S.endT>40){flyStageDone();return true}}",
    "else if(S.ph==='end2'){S.endT+=dt;if(S.endT>4&&!commCur&&!COMMS.length&&!VOICE.busy||S.endT>40){if(!FC.on)fcStart('out',S)}}")
rep("else if(S.ph==='end'){S.endT+=dt;if(S.endT>4&&!commCur&&!COMMS.length&&!VOICE.busy||S.endT>40){flyStageDone();return}}",
    "else if(S.ph==='end'){S.endT+=dt;if(S.endT>4&&!commCur&&!COMMS.length&&!VOICE.busy||S.endT>40){if(!FC.on)fcStart('out',S)}}")
rep("if(S.pos.distanceTo(M.bayW)<90){S.ph='arrive';S.endT=0;S.thr=0;","if(S.pos.distanceTo(M.bayW)<90){S.ph='arrive';S.endT=0;S.thr=0;fcStart('land',S);")
rep("if(S.endT>7&&!commCur&&!COMMS.length&&!VOICE.busy||S.endT>30){flyStageDone();return true}}",
    "if(S.endT>7&&!commCur&&!COMMS.length&&!VOICE.busy||S.endT>30){if(FC.on&&FC.k==='land')fcEnd();else if(!FC.on){flyStageDone();return true}}}")
# stage starts: fly in
rep("if(S.ph==='to2')stage2Setup(S);if(S.ph==='to3')stage3Setup(S);",
    "if(S.ph==='to2'){stage2Setup(S);fcStart('in',S,'STAGE 2-2','RESCUE THE HALCYON')}if(S.ph==='to3'){stage3Setup(S);fcStart('in',S,'STAGE 2-3','THE RUN TO MERIDIAN')}")
rep("S.ph='to2';stage2Setup(S);","S.ph='to2';stage2Setup(S);fcStart('in',S,'STAGE 2-2','RESCUE THE HALCYON');")
rep("S.ph='to3';stage3Setup(S);wingSpawn(S,S.pos);","S.ph='to3';stage3Setup(S);wingSpawn(S,S.pos);fcStart('in',S,'STAGE 2-3','THE RUN TO MERIDIAN');")
rep("jumpFx('TRANSIT','MERIDIAN APPROACH · STAGE 2-3');sfx('nova');","")
# leaving flight or going to the menu clears everything
rep("function flyExit(){if(!FLY)return;","function flyExit(){fcReset();if(!FLY)return;")
rep("function setState(s){state=s;","function setState(s){state=s;try{if(s==='menu')fcReset();else if(s==='playing'&&FLY&&!FC.on)fade(0,.8)}catch(e){}")
# the jump sound: a rising whine into a deep whoosh
rep("else if(k==='jet')tone('sawtooth',90,160,.4,.04);",
    "else if(k==='jet')tone('sawtooth',90,160,.4,.04);\n  else if(k==='warp'){tone('sine',180,1500,.55,.07);gun({vol:.4,len:1.1,lp:2600,f0:160,f1:30,crack:.06,hp:1200,th:.8})}")
open(dst,'w').write(s);print('ok',len(s))
s=open(dst).read()
# leaving flight empties the bracket container; forget the cached brackets too, or the next flight reuses detached ones and enemies get no box
rep("$('ftg').innerHTML='';engineOff()}","$('ftg').innerHTML='';FTG.length=0;engineOff()}")
open(dst,'w').write(s);print('ok-ftg')
s=open(dst).read()
# the weapon draw never goes outside 0..1 (a restarted clock must not throw the gun off screen)
rep("FP.draw=Math.min(1,(time-swapT)/.34);","FP.draw=Math.max(0,Math.min(1,(time-swapT)/.34));")
# the recoil kick on the camera is only a look: shots still go where the crosshair points
rep("const org=veh?cam.position:eye;cam.getWorldDirection(tmp);","const org=veh?cam.position:eye;cam.getWorldDirection(tmp);if(!veh&&FP.punch){const sp=Math.sin(pitch);tmp.x-=FP.punch*Math.sin(yaw)*sp;tmp.y-=FP.punch*Math.cos(pitch);tmp.z-=FP.punch*Math.cos(yaw)*sp;tmp.normalize()}")
open(dst,'w').write(s);print('ok-fixes')
