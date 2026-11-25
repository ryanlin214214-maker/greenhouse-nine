# v93 D: cutscenes preloaded (all actors built and shaders compiled at the start, shown per shot; a frame-time cap so a
# hitch never skips story time), walkers plant their feet on the floor (shared: gameplay, cutscenes, Meridian NPCs),
# strides matched to speed in the cutscenes, Rowan in his suit in the boarding shot.
import sys
s=open(sys.argv[1]).read()
def R(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:90]);s=s.replace(a,b)
R(open('intro_orig.js').read(),open('intro_new.js').read())
# the march: stride rate matched to walking speed (the gait cycles at a fixed rate, so a slow walk with a full stride skated)
R("else{a.pos.z=a.z0+t*1.7;","else{const z1=a.z0+t*1.7;a.cd=(a.cd||0)+Math.abs(z1-a.pos.z);a.pos.z=z1;a.cine=a.type>=5;a.mv=.7;")
R("if(a.rowan){a.pos.x=-5.5+Math.min(1,t/5.5)*4.1;a.pos.z=193+Math.min(1,t/5.5)*8.5;a.mv=t<5.5?1:0;","if(a.rowan){const x1=-5.5+Math.min(1,t/5.5)*4.1,z1=193+Math.min(1,t/5.5)*8.5;a.cd=(a.cd||0)+Math.hypot(x1-a.pos.x,z1-a.pos.z);a.pos.x=x1;a.pos.z=z1;a.cine=t<5.5;a.mv=t<5.5?.7:0;")
# foot planting: after the pose (base gait + combat layer), lift or lower the body so the lowest sole rests on the floor.
# Floor = the group's world height minus e.r (how the game already places walkers: feet at pos.y - r).
R("  const av=new T.Vector3();\n",
  "  const av=new T.Vector3();\n"
  "  const SOLE=[],PV=new T.Vector3(),PW=new T.Vector3();\n"
  "  const soles=()=>{if(SOLE.length)return SOLE[0]!==null;g.updateMatrixWorld(true);for(const[h,k]of legs){const inv=new T.Matrix4().copy(k.matrixWorld).invert(),B=new T.Box3(),b=new T.Box3(),M=new T.Matrix4();k.traverse(m=>{if(!m.isMesh||!m.visible)return;if(!m.geometry.boundingBox)m.geometry.computeBoundingBox();b.copy(m.geometry.boundingBox).applyMatrix4(M.multiplyMatrices(inv,m.matrixWorld));B.union(b)});if(B.isEmpty())continue;const cx=(B.min.x+B.max.x)/2;SOLE.push([h,k,new T.Vector3(cx,B.min.y,B.min.z),new T.Vector3(cx,B.min.y,B.max.z)])}if(!SOLE.length)SOLE.push(null);return SOLE[0]!==null};\n"
  "  const lowSole=()=>{let lo=1e9;for(const[h,k,a,b]of SOLE){lo=Math.min(lo,PV.copy(a).applyMatrix4(k.matrixWorld).y,PV.copy(b).applyMatrix4(k.matrixWorld).y)}return lo};\n"
  "  const plant=e=>{const fr=e.r;if(fr===undefined||e.dying||e.roll>0||(e.unf!==undefined&&e.unf<1)||Math.abs(e.vy||0)>.6||(e.jet||0)>0)return;if(!soles())return;g.updateMatrixWorld(true);\n"
  "    const gy=g.getWorldPosition(PW).y,sc=g.getWorldScale(PV).y||1,d=Math.max(-.6,Math.min(.6,(gy-fr)-lowSole()));root.position.y+=d/sc};\n"
  # cinematic stepping walk: each foot locks to a spot on the floor while it carries weight (60% of its cycle), swings
  # in an arc to the next spot, the pelvis rides at a fixed share of leg length, and both legs are solved (two-bone,
  # in the leg's own plane) to reach their foot targets. Used when e.cine is set; e.cd is the distance walked so far.
  "  const IV=new T.Vector3(),IW=new T.Vector3();\n"
  "  const ik=(i,tw)=>{const[h,k]=legs[i],S0=SOLE[i];if(!S0)return;root.worldToLocal(IW.copy(tw));const Dy=IW.y-h.position.y,Dz=IW.z-h.position.z,ay=k.position.y,az=k.position.z,by=(S0[2].y+S0[3].y)/2,bz=(S0[2].z+S0[3].z)/2,la=Math.hypot(ay,az),lb=Math.hypot(by,bz),D=Math.min(la+lb-1e-4,Math.max(Math.abs(la-lb)+1e-4,Math.hypot(Dy,Dz)));\n"
  "    const c=Math.max(-1,Math.min(1,(D*D-la*la-lb*lb)/(2*la*lb))),pa=Math.atan2(az,ay),pb=Math.atan2(bz,by);let t2=pa-pb+Math.acos(c);t2=Math.atan2(Math.sin(t2),Math.cos(t2));if(t2<0)t2=pa-pb-Math.acos(c);\n"
  "    const vy=ay+by*Math.cos(t2)-bz*Math.sin(t2),vz=az+by*Math.sin(t2)+bz*Math.cos(t2);h.rotation.set(Math.atan2(Dz,Dy)-Math.atan2(vz,vy),0,0);k.rotation.set(t2,0,0)};\n"
  "  const cineWalk=e=>{if(!soles()||SOLE.length<2)return;g.updateMatrixWorld(true);const gs=g.getWorldScale(PV).y||1,rs=root.scale.y,h0=legs[0][0],k0=legs[0][1],S0=SOLE[0],Lt=Math.hypot(k0.position.y,k0.position.z)+Math.hypot((S0[2].y+S0[3].y)/2,(S0[2].z+S0[3].z)/2),Lw=Lt*rs*gs,s=.55*Lw,d=e.cd||0;\n"
  "    root.position.y=(.93*Lw-e.r)/gs-h0.position.y*rs+Math.cos(d/s*Math.PI*2)*.012/gs;root.updateMatrixWorld(true);const fl=g.getWorldPosition(PW).y-e.r;\n"
  "    for(let i=0;i<2;i++){const tau=(d-i*s)/(2*s)+.3,kk=Math.floor(tau),u=tau-kk;let F=(kk-.3)*2*s+i*s+.6*s,ht=0;if(u>=.6){const w=(u-.6)/.4,sm=w*w*(3-2*w);F+=sm*2*s;ht=Math.sin(Math.PI*w)*.11*Lw}\n"
  "      IV.set(legs[i][0].position.x*rs,0,(F-d)/gs);g.localToWorld(IV);IV.y=fl+ht+.005;ik(i,IV);for(let it=0;it<2;it++){root.updateMatrixWorld(true);const[,k,ta,tb]=SOLE[i];const lo=Math.min(PW.copy(ta).applyMatrix4(k.matrixWorld).y,PW.copy(tb).applyMatrix4(k.matrixWorld).y);if(lo>=fl+ht-.003)break;IV.y+=fl+ht-lo;ik(i,IV)}}};\n"
  # natural ground speed of the full-stride gait, for matching cutscene walking speed
  "  const stride=()=>{if(!soles())return 1;g.updateMatrixWorld(true);const hy=SOLE[0][0].getWorldPosition(PW).y,L=Math.max(.3,hy-lowSole());return 2*L*Math.sin(.55)*(v===2||v===5?13:v===1?6:9)/Math.PI};\n")
R("return{aim,segs:{pel,tor,head,arms,legs,gun},","return{stride,feet:()=>{if(!soles())return[];g.updateMatrixWorld(true);return SOLE.map(([h,k,a,b])=>{const p=a.clone().applyMatrix4(k.matrixWorld),q=b.clone().applyMatrix4(k.matrixWorld);const lo=p.y<q.y?p:q;lo.mid=p.clone().add(q).multiplyScalar(.5);return lo})},aim,segs:{pel,tor,head,arms,legs,gun},")
R("aimM.opacity=e.ft>0?1:.25+.25*Math.sin(t*25)}}combat(e,t,dt)}}}","aimM.opacity=e.ft>0?1:.25+.25*Math.sin(t*25)}}combat(e,t,dt);if(e.cine&&e.r!==undefined&&!e.dying)cineWalk(e);else plant(e)}}}")
# Meridian's walking NPCs: their rig state carries r (group at .95, floor 0) so they plant too
R("E:{mv:0,ph:Math.random()*6,vy:0,kick:0,crouch:0,jet:0,burst:0,cd:1,ch:0,ft:0}","E:{mv:0,ph:Math.random()*6,vy:0,kick:0,crouch:0,jet:0,burst:0,cd:1,ch:0,ft:0,r:.95}")
open(sys.argv[2],'w').write(s);print('p103 ok')
