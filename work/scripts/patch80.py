p='/home/user/greenhouse-nine/index.html'
s=open(p).read()
def rep(a,b,c=1):
  global s
  assert s.count(a)==c,(s.count(a),a[:100]); s=s.replace(a,b)
# walker: extra movement and a death reaction
rep("    tor.position.y=-.02+Math.abs(Math.sin(w))*.03*m-(cr?.3:0);tor.rotation.y=Math.sin(w)*.08*m+Math.sin(t*.7+e.ph)*.06;tor.rotation.x=v===2?.35:v===5?.25:0;",
"""    const idle=1-Math.min(1,m),yr=e.g?ad(e.g.rotation.y,e.yawP===undefined?e.g.rotation.y:e.yawP)/Math.max(dt,1e-3):0;if(e.g)e.yawP=e.g.rotation.y;e.lean=(e.lean||0)+(Math.max(-1,Math.min(1,yr*.6))-(e.lean||0))*Math.min(1,dt*5);
    tor.position.y=-.02+Math.abs(Math.sin(w))*.03*m-(cr?.3:0)+Math.sin(t*1.8+e.ph)*.008;tor.rotation.y=Math.sin(w)*.08*m+Math.sin(t*.7+e.ph)*.06;tor.rotation.x=(v===2?.35:v===5?.25:0)+.1*m+Math.sin(t*1.8+e.ph)*.015;
    pel.position.x=Math.sin(t*.6+e.ph)*.04*idle;tor.rotation.z=-Math.sin(t*.6+e.ph)*.035*idle-e.lean*.12;for(let i=0;i<2;i++)legs[i][0].rotation.z=(i?-1:1)*.04*idle*Math.sin(t*.6+e.ph);
    if((e.hitT||0)>0){e.hitT-=dt;const h=Math.max(0,e.hitT/.22);tor.rotation.x-=.32*h;tor.rotation.z+=(e.hitS||1)*.14*h}""")
rep("    e.kick=Math.max(0,(e.kick||0)-dt*(v===2||v===5?4:6));const k=e.kick;head.rotation.y=Math.sin(t*1.3+e.ph)*.35;head.rotation.x=Math.sin(t*.9+e.ph)*.08-(v===2?.3:0);",
"    e.kick=Math.max(0,(e.kick||0)-dt*(v===2||v===5?4:6));const k=e.kick;head.rotation.y=Math.sin(t*1.3+e.ph)*.35;head.rotation.x=Math.sin(t*.9+e.ph)*.08-(v===2?.3:0)-((e.hitT||0)>0?.35*e.hitT/.22:0);")
rep("      gun.position.z=GZ-k*.05;gun.rotation.x=-k*.1}\n    if(aim){",
"      gun.position.z=GZ-k*.05;gun.rotation.x=-k*.1;gun.position.y=GY+Math.sin(w*2)*.015*m}\n    if(aim){")
rep("return{aim,segs:{pel,tor,head,arms,legs,gun},anim(e,t,dt){",
"""return{aim,segs:{pel,tor,head,arms,legs,gun},
  // death reaction before the ragdoll takes over: knees give, the torso snaps back from the hit and twists, head drops back, arms and gun fall
  death(e,k){if(!e.d0){e.d0={leg:legs.map(([h,n])=>[h.rotation.x,n.rotation.x]),arm:arms.map(([a,b])=>[a.rotation.x,a.rotation.z,b.rotation.x]),tx:tor.rotation.x,gy:gun?gun.position.y:0}}const D=e.d0,s=e.hitS||1,L=(a,b)=>a+(b-a)*k;
    for(let i=0;i<2;i++){legs[i][0].rotation.x=L(D.leg[i][0],-.75-(i?.2:0));legs[i][1].rotation.x=L(D.leg[i][1],1.45+(i?.2:0))}root.position.y=-.32*k;
    tor.rotation.x=L(D.tx,-.55);tor.rotation.z=s*.3*k;head.rotation.x=-.75*k;
    for(let i=0;i<2;i++){arms[i][0].rotation.x=L(D.arm[i][0],-.25);arms[i][0].rotation.z=L(D.arm[i][1],(i?-1:1)*.35);arms[i][1].rotation.x=L(D.arm[i][2],-.3)}
    if(gun){gun.position.y=D.gy-.3*k;gun.rotation.x=.7*k}jets.visible=false},
  anim(e,t,dt){""")
# damage: flinch on hits, death reaction for walkers (explosions still throw bodies at once)
rep("  if(e.hp>0){sfx('hit');return}\n  e.dying=0.001;if(e.type===11)detonate(e.pos.clone());if(e.type!==4)ragdoll(e);",
"  if(e.hp>0){sfx('hit');e.hitT=.22;e.hitS=Math.random()<.5?-1:1;return}\n  e.dying=0.001;if(e.type===11)detonate(e.pos.clone());if(e.type!==4){if(e.rig&&e.rig.death&&e.lastEl!==2&&e.type!==11){e.dth=0;e.hitS=Math.random()<.5?-1:1;e.dthV=new T.Vector3(e.pos.x-eye.x,0,e.pos.z-eye.z).normalize().multiplyScalar(1.6)}else ragdoll(e)}")
rep("    e.flash-=dt;const wt=e.flash>0||e.dying>0;",
"    e.flash-=dt;const wt=e.flash>0||(e.dying>0&&e.dth===undefined);")
rep("    if(e.dying){e.dying+=dt;e.g.scale.setScalar(",
"    if(e.dying&&e.dth!==undefined){e.dth+=dt;const k=Math.min(1,e.dth/.3),kk=1-(1-k)*(1-k);try{e.rig.death(e,kk)}catch(_){}if(e.dthV)e.pos.addScaledVector(e.dthV,dt*(1-k));if(e.dth>=.3){e.dth=undefined;ragdoll(e);e.dying=.001}continue}\n    if(e.dying){e.dying+=dt;e.g.scale.setScalar(")
# gentler ragdoll push when it follows a death reaction
rep("const T0=B.get(S.tor).b,imp=(boom?9:5.5)*T0.mass;T0.applyImpulse(new CN.Vec3(dir.x*imp,(boom?4:.3)*T0.mass,dir.z*imp),new CN.Vec3(T0.position.x,T0.position.y+.4,T0.position.z));\n    T0.angularVelocity.set(dir.z*4,(Math.random()-.5)*2,-dir.x*4);",
"const T0=B.get(S.tor).b,imp=(boom?9:2.4)*T0.mass;T0.applyImpulse(new CN.Vec3(dir.x*imp,(boom?4:.1)*T0.mass,dir.z*imp),new CN.Vec3(T0.position.x,T0.position.y+.4,T0.position.z));\n    T0.angularVelocity.set(dir.z*(boom?4:1.8),(Math.random()-.5)*(boom?2:.8),-dir.x*(boom?4:1.8));")
rep("for(const[h,k]of S.legs){const K=B.get(k).b,H=B.get(h).b,sd=(Math.random()-.5)*1.5;K.applyImpulse(new CN.Vec3((-dir.x*3+dir.z*sd)*K.mass,0,(-dir.z*3-dir.x*sd)*K.mass),K.position);",
"for(const[h,k]of S.legs){const K=B.get(k).b,H=B.get(h).b,sd=(Math.random()-.5)*1.5,kk=boom?3:1;K.applyImpulse(new CN.Vec3((-dir.x*kk+dir.z*sd*.5)*K.mass,0,(-dir.z*kk-dir.x*sd*.5)*K.mass),K.position);")
open(p,'w').write(s);print('ok')
