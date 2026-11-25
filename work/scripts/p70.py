# v70 animation pass: a combat layer on the walker rig (enemies and Rowan) and a first-person layer for the player
import sys
src,dst=sys.argv[1],sys.argv[2]
s=open(src).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]);s=s.replace(a,b)

# ---------- walker combat layer ----------
COMBAT=r'''const sm=(a,b,x)=>{const q=Math.max(0,Math.min(1,(x-a)/(b-a)));return q*q*(3-2*q)},bo=x=>1+2.7*Math.pow(x-1,3)+1.7*Math.pow(x-1,2),BL=(o,ax,val,w)=>{o.rotation[ax]+=(val-o.rotation[ax])*w};
  // combat layer, applied after the base pose each frame: weight in the run, bracing, recoil, lunges, staggers, landings, dodge rolls and the unfold on arrival
  function combat(e,t,dt){if(e.dying){root.rotation.set(0,0,0);return}let ry=0,rz=0,py=0;const m=e.mv||0,w=t*(v===2||v===5?13:v===1?6:9)+e.ph;
    pel.rotation.y=-Math.sin(w)*.14*m;head.rotation.y-=tor.rotation.y*.8;py-=Math.abs(Math.cos(w))*.035*m;tor.rotation.x+=.08*m;
    if((v===2||v===5)&&!((e.kick||0)>.05))for(let i=0;i<2;i++)arms[i][0].rotation.x+=Math.sin(w+(i?0:Math.PI))*.55*m;
    if(e.see&&(e.burst||0)<=0&&e.cd>0&&e.cd<.4){const k=1-e.cd/.4;for(let i=0;i<2;i++){legs[i][0].rotation.x-=.25*k;legs[i][1].rotation.x+=.45*k}py-=.06*k;tor.rotation.x+=.14*k}
    if((e.kick||0)>0)tor.rotation.x-=e.kick*.1;
    if((e.lunge||0)>0){const k=Math.min(1,e.lunge/.2);tor.rotation.x+=.55*k;head.rotation.x+=.4*k;for(let i=0;i<2;i++)BL(arms[i][0],'x',.9,k)}
    if((e.stag||0)>0){const k=Math.sin(Math.min(1,e.stag/.55)*Math.PI),q=e.stagS||1;tor.rotation.x-=.55*k;tor.rotation.z+=q*.3*k;head.rotation.x-=.5*k;legs[0][0].rotation.x+=.5*k;legs[1][0].rotation.x-=.35*k;legs[1][1].rotation.x+=.5*k;rz+=q*.18*k;
      for(let i=0;i<2;i++)arms[i][0].rotation.z+=(i?-1:1)*.6*k}
    if((e.landT||0)>0){const p=1-e.landT/.7,k=p<.12?bo(p/.12):1-sm(.55,1,p);BL(legs[0][0],'x',-1.45,k);BL(legs[0][1],'x',1.6,k);BL(legs[1][0],'x',-.15,k);BL(legs[1][1],'x',2.3,k);py-=.42*k;BL(tor,'x',.6,k);head.rotation.x+=.45*k;
      BL(arms[0][0],'x',.2,k);BL(arms[0][0],'z',.45,k)}
    if(e.roll){const p=Math.min(1,e.roll.t/.55),k=Math.sin(p*Math.PI);for(let i=0;i<2;i++){BL(legs[i][0],'x',-1.5,k);BL(legs[i][1],'x',2.5,k);BL(arms[i][0],'x',-2.2,k*.8)}BL(tor,'x',1.0,k);head.rotation.x+=.6*k;rz+=e.roll.s*Math.PI*2*sm(0,1,p);py-=.3*k}
    if(e.unf!==undefined&&e.unf<1){const u=e.unf,L=bo(sm(0,.42,u)),Tq=bo(sm(.22,.66,u)),Aq=bo(sm(.45,.86,u)),Hq=bo(sm(.68,1,u));
      for(let i=0;i<2;i++){BL(legs[i][0],'x',-1.55,1-L);BL(legs[i][1],'x',2.65,1-L);BL(arms[i][0],'x',-2.9,1-Aq);BL(arms[i][1],'x',-2.2,1-Aq)}
      BL(tor,'x',1.35,1-Tq);py-=.55*(1-L);ry+=(1-Tq)*1.4*(e.ph>3?1:-1);head.scale.setScalar(Math.max(.2,.25+.75*Hq));if(gun)gun.scale.setScalar(Math.max(.2,.3+.7*Aq))}
    else{if(head.scale.x!==1)head.scale.setScalar(1);if(gun&&gun.scale.x!==1)gun.scale.setScalar(1)}
    root.position.y=py;root.rotation.set(0,ry,rz)}
  const av=new T.Vector3();
  return{aim,segs:{pel,tor,head,arms,legs,gun},'''
rep("const av=new T.Vector3();\n  return{aim,segs:{pel,tor,head,arms,legs,gun},",COMBAT)
rep("aimM.opacity=e.ft>0?1:.25+.25*Math.sin(t*25)}}}}}","aimM.opacity=e.ft>0?1:.25+.25*Math.sin(t*25)}}combat(e,t,dt)}}}")

# ---------- enemy behaviour that drives it ----------
rep("aim:m.rig&&m.rig.aim});","aim:m.rig&&m.rig.aim});if(state==='playing'&&type!==9)e.unf=0;")
# arrival: they unfold before they move or shoot (still fall, still take hits)
rep("if(hd>170){const[x,z]=spawnPos();p.set(x,1.5,z);e.vy=0;e.ch=0;return}",
    "if(hd>170){const[x,z]=spawnPos();p.set(x,1.5,z);e.vy=0;e.ch=0;return}\n"
    "  if(e.unf!==undefined&&e.unf<1){if(e.unf===0&&d<40){sfx('unfold');sparkle(p,0x8fe6ff,8,3)}e.unf=Math.min(1,e.unf+dt/.95);e.vy-=19*dt;p.y+=e.vy*dt;const qy=p.y;pushOut(p,e.r);if(p.y>qy+1e-5&&e.vy<0)e.vy=0;e.mv=0;e.gr0=true;return}\n"
    "  e.rcd=(e.rcd||0)-dt;e.landT=Math.max(0,(e.landT||0)-dt);e.stag=Math.max(0,(e.stag||0)-dt);")
rep("let tgt=null;e.crouch=0;","e.see=see;let tgt=null;e.crouch=0;")
# dodge roll when you line up on them; stagger steps back; landings plant them for a beat
rep("e.jt=Math.max(0,(e.jt||0)-dt);\n  if(e.ch>0)sp*=0.2;if(e.lunge>0)sp*=2.6;",
    "e.jt=Math.max(0,(e.jt||0)-dt);\n"
    "  if(e.roll){e.roll.t+=dt;mx=e.roll.x;mz=e.roll.z;sp=8.5;if(e.roll.t>=.55){e.roll=null;e.rcd=3.5+Math.random()*3;if(d<30)sfx('land')}}\n"
    "  else if(P.atk!=='melee'&&P.atk!=='bomb'&&see&&hd>5&&hd<40&&e.jet<=0&&e.rcd<=0&&e.st!=='cover'&&!e.ch&&!(e.stag>0)){cam.getWorldDirection(RLV);if(-(dx*RLV.x+dy*RLV.y+dz*RLV.z)/d>.993){if(Math.random()<.45){const q=Math.random()<.5?-1:1;e.roll={t:0,s:q,x:-dz/hd*q,z:dx/hd*q};if(e.spot)release(e);sfx('roll')}else e.rcd=.6}}\n"
    "  if(e.stag>0&&!e.roll){mx=-dx/hd;mz=-dz/hd;sp=1.6}\n"
    "  if(e.ch>0)sp*=0.2;if(e.lunge>0)sp*=2.6;if(e.landT>.25&&!e.roll)sp*=.1;")
rep("const py=p.y;pushOut(p,e.r);const gr=p.y>py+1e-5;if(gr&&e.vy<0)e.vy=0;",
    "const py=p.y,vy0=e.vy;pushOut(p,e.r);const gr=p.y>py+1e-5;if(gr&&!e.gr0&&vy0<-5&&!e.roll){e.landT=.7;if(d<35){sfx('land');PFX.smoke(fv7.set(p.x,p.y-e.r+.1,p.z),{n:6,spd:2.6,size:[.5,1.5],life:.9,up:.15,drag:2.2,spread:.6,c0:.32,c1:.5,alpha:.45});if(d<9&&!reduced)shake=Math.max(shake,.14)}}e.gr0=gr;if(gr&&e.vy<0)e.vy=0;")
rep("function groundTick(e,dt){","const RLV=new T.Vector3(),fv7=new T.Vector3();\nfunction groundTick(e,dt){")
# a heavy hit (a crit, or a third of what it had left) knocks it off balance
rep("if(e.hp>0){sfx('hit');e.hitT=.22;e.hitS=Math.random()<.5?-1:1;return}",
    "if(e.hp>0){sfx('hit');e.hitT=.22;e.hitS=Math.random()<.5?-1:1;if(e.type>=5&&e.type!==9&&(crit||n>(e.hp+n)*.33)&&!((e.stag||0)>0)&&!(e.unf<1)){e.stag=.55;e.stagS=e.hitS;e.roll=null}return}")

# ---------- sounds for the new moves ----------
rep("else if(k==='jet')tone('sawtooth',90,160,.4,.04);",
    "else if(k==='jet')tone('sawtooth',90,160,.4,.04);\n"
    "  else if(k==='unfold'){tone('sawtooth',220,880,.35,.045);tone('sawtooth',330,990,.3,.03,.2);tone('square',1400,700,.03,.06,.42);tone('square',1200,600,.03,.06,.62);tone('square',900,450,.04,.07,.85)}\n"
    "  else if(k==='roll')gun({vol:.14,len:.28,lp:1300,f0:90,f1:50,hp:600,crack:.01});\n"
    "  else if(k==='land')gun({vol:.3,len:.35,lp:650,f0:70,f1:30,crack:.02,hp:500,th:1.4});\n"
    "  else if(k==='slide')gun({vol:.16,len:.6,lp:2200,f0:60,f1:40,hp:900,crack:.02,th:.4});")

# ---------- first person ----------
FP=r'''const FP={spr:0,draw:1,sx:0,sy:0,ly:0,lp:0,dip:0,dipV:0,punch:0,roll:0,sl:0,slT:0,slCd:0,slV:new T.Vector3(),insp:-1,air:false,airV:0};
const sm2=(a,b,x)=>{const q=Math.max(0,Math.min(1,(x-a)/(b-a)));return q*q*(3-2*q)};
// first-person motion: sprint carry, draw on swap, the gun lagging the view, a spring dip on landing, recoil kick, roll into strafes and slides, inspect
function fpTick(dt){const r=reduced?0:1;FP.spr+=((sprintT>0.35&&ground&&FP.slT<=0?1:0)-FP.spr)*Math.min(1,dt*8);FP.draw=Math.min(1,(time-swapT)/.34);
  const dy=ad(yaw,FP.ly),dp=pitch-FP.lp;FP.ly=yaw;FP.lp=pitch;const k=Math.min(1,dt*9);FP.sx+=(Math.max(-.035,Math.min(.035,dy*.9))*r-FP.sx)*k;FP.sy+=(Math.max(-.03,Math.min(.03,dp*.9))*r-FP.sy)*k;
  if(!ground){FP.air=true;FP.airV=Math.min(FP.airV,vy)}else if(FP.air){FP.air=false;const f=Math.min(1,Math.max(0,(-FP.airV-3)/11));if(f>0){FP.dipV-=f*1.8*r;if(f>.45)sfx('land')}FP.airV=0}
  FP.dipV+=(-FP.dip*120-FP.dipV*14)*dt;FP.dip+=FP.dipV*dt;FP.punch*=Math.exp(-dt*14);
  const st=(keys.KeyD?1:0)-(keys.KeyA?1:0)+mvX;FP.roll+=((-st*.018-FP.sl*.07)*r-FP.roll)*Math.min(1,dt*6);FP.sl+=((FP.slT>0?1:0)-FP.sl)*Math.min(1,dt*10);FP.slCd-=dt;
  if(FP.insp>=0){FP.insp+=dt;if(FP.insp>2.3||firing||padFire||reloadT>0||time-swapT<.4)FP.insp=-1}}
function fpVM(){const s=FP.spr,d=1-FP.draw,de=d*d*d,pz=FP.insp>=0?FP.insp/2.3:0,ins=pz>0?Math.sin(Math.min(1,pz/.18)*Math.PI/2)*(1-sm2(.8,1,pz)):0,flip=pz>0?sm2(.35,.6,pz)-sm2(.6,.85,pz):0;
  vm.position.x+=-FP.sx*.6+s*.03+Math.sin(bob)*.008*s-ins*.05;vm.position.y+=FP.sy*.5-s*.035-de*.16+FP.dip*.25-Math.abs(Math.cos(bob))*.01*s+ins*.025-FP.sl*.02;vm.position.z+=s*.02;
  vm.rotation.x+=-s*.32-de*1.1+FP.sy*1.2;vm.rotation.y+=FP.sx*1.4+s*.35+ins*1.05;vm.rotation.z+=s*.42+de*.7+flip*.9-ins*.25+FP.sl*.3;
  if(reloadT>0){const ph=1-reloadT/reloadDur,jo=Math.exp(-Math.pow((ph-.66)/.035,2)),pu=Math.exp(-Math.pow((ph-.86)/.045,2));vm.position.y+=jo*.025;vm.rotation.x-=jo*.12;vm.position.z+=pu*.035;vm.rotation.z+=sm2(0,.25,ph)*(1-sm2(.75,1,ph))*.25}}
'''
rep("let sprintT=0,cls=0,","let sprintT=0,cls=0,")  # anchor check only
s=s.replace("let sprintT=0,cls=0,",FP+"let sprintT=0,cls=0,",1)
rep("cam.position.set(eye.x,eye.y+(reduced?0:Math.abs(Math.sin(bob))*0.05),eye.z);\n    cam.rotation.set(pitch+(Math.random()-.5)*sh,yaw+(Math.random()-.5)*sh,0);",
    "fpTick(dt);cam.position.set(eye.x,eye.y+(reduced?0:Math.abs(Math.sin(bob))*0.05*(1+FP.spr*.6))+FP.dip-FP.sl*.55,eye.z);\n    cam.rotation.set(pitch+(Math.random()-.5)*sh+FP.punch,yaw+(Math.random()-.5)*sh,FP.roll);")
rep("vm.rotation.set(recoil*0.04+rl*.35,sws?0:sw*0.5,rl*.45);","vm.rotation.set(recoil*0.04+rl*.35,sws?0:sw*0.5,rl*.45);fpVM();")
rep("recoil=W.rec;","recoil=W.rec;FP.punch+=Math.min(.02,W.rec*.004)*(reduced?0:1);")
# slide: V while sprinting. Momentum carries you low along the floor for most of a second; jumping ends it
rep("const sp=(sprintT>0.35?9:6.2)*CLS[cls].spd*dt,sn=Math.sin(yaw),cs=Math.cos(yaw);",
    "const sp=(sprintT>0.35?9:6.2)*CLS[cls].spd*dt,sn=Math.sin(yaw),cs=Math.cos(yaw);\n"
    "  if(keys.KeyV&&sprintT>0.35&&ground&&FP.slT<=0&&FP.slCd<=0){FP.slT=.75;FP.slCd=1.1;FP.slV.set(-sn,0,-cs).multiplyScalar(13.5*CLS[cls].spd);sfx('slide')}")
rep("movePlayer((-sn*f+cs*s)*sp,vy*dt,(-cs*f-sn*s)*sp);",
    "if(FP.slT>0){FP.slT-=dt;FP.slV.multiplyScalar(Math.exp(-dt*2.4));movePlayer(FP.slV.x*dt+cs*s*sp*.3,vy*dt,FP.slV.z*dt-sn*s*sp*.3);if(vy>0.5)FP.slT=0}\n"
    "  else movePlayer((-sn*f+cs*s)*sp,vy*dt,(-cs*f-sn*s)*sp);")
rep("else if(c==='KeyG')grenade();","else if(c==='KeyI'){if(FP.insp<0&&reloadT<=0)FP.insp=0}else if(c==='KeyG')grenade();")
rep("Space jump, again in the air for your class move","Space jump, again in the air for your class move · V slide while sprinting · I inspect your gun")
open(dst,'w').write(s);print('ok',len(s))
