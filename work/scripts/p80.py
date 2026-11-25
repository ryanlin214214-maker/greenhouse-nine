import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()

def rep(old, new, n=1):
    global s
    c = s.count(old)
    assert c == n, (c, old[:90])
    s = s.replace(old, new)

# 1) groundTick: smoothed velocity and acceleration in the model's own frame (forward / side), for the momentum springs;
#    duck timer; ducking slows them down
rep("const moved=Math.hypot(p.x-ox,p.z-oz);e.mv=gr&&(mx||mz)?Math.min(1,sp/3):0;",
    "const moved=Math.hypot(p.x-ox,p.z-oz);e.mv=gr&&(mx||mz)?Math.min(1,sp/3):0;"
    "{const it=1/Math.max(dt,1e-3);let ivx=(p.x-ox)*it,ivz=(p.z-oz)*it;if(ivx*ivx+ivz*ivz>400){ivx=ivz=0;e.svx=e.svz=0}const k=Math.min(1,dt*10),px0=e.svx||0,pz0=e.svz||0;"
    "e.svx=px0+(ivx-px0)*k;e.svz=pz0+(ivz-pz0)*k;const ax=Math.max(-40,Math.min(40,(e.svx-px0)*it)),az=Math.max(-40,Math.min(40,(e.svz-pz0)*it)),ry=e.g?e.g.rotation.y:0,fx=Math.sin(ry),fz=Math.cos(ry);"
    "e.aF=ax*fx+az*fz;e.aS=ax*fz-az*fx;e.vF=e.svx*fx+e.svz*fz;e.vS=e.svx*fz-e.svz*fx}")
rep("e.cd-=dt;e.bt-=dt;e.vy-=19*dt;",
    "e.cd-=dt;e.bt-=dt;e.vy-=19*dt;e.duckT=Math.max(0,(e.duckT||0)-dt);")
rep("if(e.ch>0)sp*=0.2;if(e.lunge>0)sp*=2.6;",
    "if(e.ch>0)sp*=0.2;if(e.duckT>0)sp*=.35;if(e.lunge>0)sp*=2.6;")
# when the player aims straight at one and it does not roll, it often ducks instead
rep("else e.rcd=.6", "else{e.rcd=.6;if(Math.random()<.55)e.duckT=Math.max(e.duckT||0,.5+Math.random()*.35)}")
# a hit sometimes makes it duck after the flinch
rep("e.hitT=.22;", "e.hitT=.22;if(Math.random()<.3)e.duckT=Math.max(e.duckT||0,.4+Math.random()*.3);")

# 2) combat layer: combat run, strafing gait, duck, and momentum springs (under-damped so starts and stops overshoot and wobble)
MOVE = r"""    // movement feel: a low combat run with bent knees and a level head, side-steps when strafing, ducking,
    // and springs pushed by acceleration: speeding up rocks the body back, stopping throws it forward and it wobbles to rest
    if(!e.dying&&!(e.unf!==undefined&&e.unf<1)){const S=e.spr||(e.spr={f:0,fv:0,s:0,sv:0,dk:0}),h=Math.min(dt,.033),gun0=v!==2&&v!==5;
      const cs=m*(e.see?1:.55)*(v===1?.6:1);for(let i=0;i<2;i++){legs[i][0].rotation.x-=.22*cs;legs[i][1].rotation.x+=.38*cs}py-=.08*cs;tor.rotation.x+=.16*cs;head.rotation.x-=.18*cs;
      const vf=Math.abs(e.vF||0),vs=Math.abs(e.vS||0),sk=m*Math.min(1,vs/(vf+vs+.01))*1.4;if(sk>.05){const q=Math.min(1,sk);
        for(let i=0;i<2;i++){legs[i][0].rotation.x*=1-.65*q;legs[i][0].rotation.z+=(i?-1:1)*(.08+Math.max(0,Math.sin(w+(i?Math.PI:0)))*.32)*q*Math.sign(e.vS||1)*(i?-1:1)}
        tor.rotation.y+=.12*q*Math.sign(e.vS||1);rz-=.05*q*Math.sign(e.vS||1)}
      S.dk+=(((e.duckT||0)>0?1:0)-S.dk)*Math.min(1,dt*12);if(S.dk>.01){const k=S.dk;for(let i=0;i<2;i++){BL(legs[i][0],'x',-1.15-(i?.15:0),k);BL(legs[i][1],'x',2.0+(i?.2:0),k)}py-=.34*k;tor.rotation.x+=.32*k;head.rotation.x-=.3*k;
        if(!gun0)for(let i=0;i<2;i++)BL(arms[i][0],'x',-1.3,k*.6)}
      const tf=Math.max(-.42,Math.min(.42,-(e.aF||0)*.024)),ts=Math.max(-.3,Math.min(.3,(e.aS||0)*.016));
      {const n=Math.min(8,Math.ceil(dt/.016)),hh=dt/n;for(let j=0;j<n;j++){S.fv+=(95*(tf-S.f)-8*S.fv)*hh;S.f+=S.fv*hh;S.sv+=(95*(ts-S.s)-8*S.sv)*hh;S.s+=S.sv*hh}}
      tor.rotation.x+=S.f;head.rotation.x-=S.f*.55;tor.rotation.z+=S.s*.8;rz+=S.s*.35;py-=Math.abs(S.f)*.05;
      if(gun0&&gun){gun.rotation.x+=S.f*.18;gun.position.y+=S.f*.03}else for(let i=0;i<2;i++){arms[i][0].rotation.x-=S.f*.9;arms[i][1].rotation.x-=Math.abs(S.f)*.5}}
"""
rep("    root.position.y=py;root.rotation.set(0,ry,rz)}", MOVE + "    root.position.y=py;root.rotation.set(0,ry,rz)}")

# 3) player: the view pitches back a touch when you speed up and dips forward when you stop, on a spring with a little overshoot
rep("FP.dipV+=(-FP.dip*120-FP.dipV*14)*dt;FP.dip+=FP.dipV*dt;",
    "FP.dipV+=(-FP.dip*120-FP.dipV*14)*dt;FP.dip+=FP.dipV*dt;"
    "{const it=1/Math.max(dt,1e-3);let vx=(pos.x-(FP.mx===undefined?pos.x:FP.mx))*it,vz=(pos.z-(FP.mz===undefined?pos.z:FP.mz))*it;FP.mx=pos.x;FP.mz=pos.z;if(vx*vx+vz*vz>900||veh||!ground)vx=vz=0;"
    "const vf=-(vx*Math.sin(yaw)+vz*Math.cos(yaw)),v0=FP.mvf||0;FP.mvf=v0+(vf-v0)*Math.min(1,dt*10);const af=Math.max(-40,Math.min(40,(FP.mvf-v0)*it)),h=Math.min(dt,.033);"
    "{const tg=Math.max(-.022,Math.min(.022,af*.0012))*r,n=Math.min(8,Math.ceil(dt/.016)),hh=dt/n;FP.mp=FP.mp||0;FP.mpV=FP.mpV||0;for(let j=0;j<n;j++){FP.mpV+=(140*(tg-FP.mp)-10*FP.mpV)*hh;FP.mp+=FP.mpV*hh}}}")
rep("cam.rotation.set(pitch+(Math.random()-.5)*sh+FP.punch,yaw+(Math.random()-.5)*sh,FP.roll);",
    "cam.rotation.set(pitch+(Math.random()-.5)*sh+FP.punch+(FP.mp||0),yaw+(Math.random()-.5)*sh,FP.roll);")

open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))
