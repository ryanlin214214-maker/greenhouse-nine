p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
# looser joints so the body can fold
rep("link(S.tor,S.head,.45,.3);for(const[sh,el]of S.arms){link(S.tor,sh,1.1,.4);link(sh,el,.9,.2)}link(S.tor,S.pel,.35,.25);for(const[h,k]of S.legs){link(S.pel,h,.8,.25);link(h,k,.9,.1)}",
    "link(S.tor,S.head,.5,.3);for(const[sh,el]of S.arms){link(S.tor,sh,1.3,.5);link(sh,el,1.2,.2)}link(S.tor,S.pel,.7,.3);for(const[h,k]of S.legs){link(S.pel,h,1.3,.3);link(h,k,1.4,.1)}")
# topple: shove the chest back from above its centre, sweep the shins the other way, and keep every part awake and loose while it falls
rep("const T0=B.get(S.tor).b,imp=(boom?9:4.5)*T0.mass;T0.applyImpulse(new CN.Vec3(dir.x*imp,(boom?4:.6)*T0.mass,dir.z*imp),T0.position);",
    """const T0=B.get(S.tor).b,imp=(boom?9:5.5)*T0.mass;T0.applyImpulse(new CN.Vec3(dir.x*imp,(boom?4:.3)*T0.mass,dir.z*imp),new CN.Vec3(T0.position.x,T0.position.y+.4,T0.position.z));
    T0.angularVelocity.set(dir.z*4,(Math.random()-.5)*2,-dir.x*4);
    for(const[h,k]of S.legs){const K=B.get(k).b,H=B.get(h).b,sd=(Math.random()-.5)*1.5;K.applyImpulse(new CN.Vec3((-dir.x*3+dir.z*sd)*K.mass,0,(-dir.z*3-dir.x*sd)*K.mass),K.position);H.applyImpulse(new CN.Vec3(-dir.x*1.2*H.mass,0,-dir.z*1.2*H.mass),H.position)}
    for(const q of C.parts){q.b.allowSleep=false;q.b.angularDamping=.12;q.b.linearDamping=.02}""")
# stay loose for the fall, then damp and allow sleep
rep("C.t-=dt;if(C.t<8.4&&!C.damp){C.damp=1;for(const q of C.parts){q.b.linearDamping=.35;q.b.angularDamping=.92}}","C.t-=dt;if(C.t<7.2&&!C.damp){C.damp=1;for(const q of C.parts){q.b.linearDamping=.3;q.b.angularDamping=.85;q.b.allowSleep=true}}")
# Rowan weakens enemies and leaves the kill to the player
rep("if(e.type===11&&Math.hypot(e.pos.x-pos.x,e.pos.z-pos.z)<9)continue;if(!los(o,e.pos))continue;best=e;bd=d}","if(e.type===11&&Math.hypot(e.pos.x-pos.x,e.pos.z-pos.z)<9)continue;if(e.hp<=(e.hp0||e.hp)*.35)continue;if(!los(o,e.pos))continue;best=e;bd=d}")
rep("if(!best)ROW.cd=.2;else{ROW.cd=.5;","if(!best)ROW.cd=.2;else{ROW.cd=.7;if(!best.hp0)best.hp0=best.hp;")
rep("damage(best,.8*(1+.07*(Math.max(wave,1)-1)),-1,false,false);","damage(best,Math.min(.5*(1+.07*(Math.max(wave,1)-1)),Math.max(.05,best.hp-(best.hp0||best.hp)*.3)),-1,false,false);")
open(p,'w').write(s);print('ok')
