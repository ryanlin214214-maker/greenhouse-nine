p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
# 1. far scenery goes into one group that travels with the camera, so it can never be reached
a="// sky, the planet below and far scenery";i=s.index(a);j=s.index("\n// sparks\nconst sparks",i)
blk=s[i:j];n=blk.count("scene.add(");blk=blk.replace("scene.add(","FAR.add(")
s=s[:i]+"// far scenery lives in FAR, which follows the camera every frame: planets, the Blade, stations and traffic stay out of reach\nconst FAR=new T.Group();scene.add(FAR);\n"+blk+"""
{// paint the backdrop farthest-first, behind everything real: nothing in it writes depth
  const ord=[];for(const c of FAR.children){const b=new T.Box3().setFromObject(c),sp=b.getBoundingSphere(new T.Sphere());ord.push([c,isFinite(sp.radius)?sp.center.length()-sp.radius*.5:1e9])}
  ord.sort((a,b)=>b[1]-a[1]);ord.forEach(([c],k)=>{c.traverse(o=>{o.renderOrder=-1000+k;if(o.material){for(const m of[].concat(o.material)){m.depthWrite=false}}o.castShadow=false;o.receiveShadow=false})})}"""+s[j:]
print('moved',n,'objects into FAR')
rep("if(composer&&bloomOn){try{composer.render()}","FAR.position.copy(cam.position);if(composer&&bloomOn){try{composer.render()}")
# 2. flight: the whole outer hull is solid, enemies are solid, no hard edge
rep("function nearHull(p){return Math.abs(p.x)<125&&p.z>-AZ-40&&p.z<AZ+110&&p.y>-60&&p.y<110}",
    "function nearHull(p){return inHull(p.x,p.z)&&p.y<34&&p.y>-2||Math.abs(p.x)<62&&p.z>AZ-12&&p.z<AZ+105&&p.y>-24&&p.y<44}\nfunction hullZone(p){return Math.abs(p.x)<390&&p.z>-660&&p.z<430&&p.y>-150&&p.y<170}")
rep("const cp=Math.cos(S.p);S.vel.set(-Math.sin(S.h)*cp,Math.sin(S.p),-Math.cos(S.h)*cp).multiplyScalar(S.spd);S.pos.addScaledVector(S.vel,dt);\n  if(near||S.pos.y<-40&&Math.abs(S.pos.x)<130){const bx=S.pos.x,by=S.pos.y,bz=S.pos.z;pushOut(S.pos,2.4,true);if(Math.abs(S.pos.x-bx)+Math.abs(S.pos.y-by)+Math.abs(S.pos.z-bz)>1e-3){S.spd*=.6;if(!reduced)shake=Math.max(shake,.12);hurt(2)}\n    if(inHull(S.pos.x,S.pos.z)&&S.pos.y<2.6)S.pos.y=2.6}\n  {const R=S.pos.length();if(R>14000){S.pos.multiplyScalar(14000/R);if(msgT<=0)say('Edge of the operation area',1.4)}}",
    """const cp=Math.cos(S.p);S.vel.set(-Math.sin(S.h)*cp,Math.sin(S.p),-Math.cos(S.h)*cp).multiplyScalar(S.spd);
  // around Thalassa, move in short steps and push out of the hull so nothing can be flown through, even at 500 mph
  if(hullZone(S.pos)||hullZone(fv1.copy(S.pos).addScaledVector(S.vel,dt))){const L=S.spd*dt,nst=Math.max(1,Math.ceil(L/1.5));let hit=false;
    for(let k=0;k<nst;k++){S.pos.addScaledVector(S.vel,dt/nst);const bx=S.pos.x,by=S.pos.y,bz=S.pos.z;pushOut(S.pos,2.4,true);if(inHull(S.pos.x,S.pos.z)&&S.pos.y<2.6&&S.pos.y>-4)S.pos.y=2.6;if(Math.abs(S.pos.x-bx)+Math.abs(S.pos.y-by)+Math.abs(S.pos.z-bz)>1e-3){hit=true;break}}
    if(hit){const imp=S.spd;S.spd*=imp>45?.3:.6;if(!reduced)shake=Math.max(shake,imp>45?.4:.12);if(imp>45&&S.t-(S.crashT||-9)>.6){S.crashT=S.t;hurt(Math.min(60,imp*.14));sfx('boom');sparkle(S.pos,0xffd27a,16,10);if(msgT<=0)say('Hull impact',1)}}}
  else S.pos.addScaledVector(S.vel,dt);
  // no wall at the edge of the operation area: Fleet Command calls you back, and far out the autopilot turns you round
  {const R=S.pos.length();if(R>15000&&S.t-(S.farT||-99)>12){S.farT=S.t;comm('C',"Kestrel, you are leaving the operation area. Come about.")}if(R>19000){const tw=Math.atan2(S.pos.x,S.pos.z);yaw+=ad(tw,yaw)*Math.min(1,dt*.8);pitch+=(-Math.atan2(S.pos.y,Math.hypot(S.pos.x,S.pos.z))-pitch)*Math.min(1,dt*.8)}}""")
# enemies are solid: ramming hurts both, and they cannot fly through Thalassa
rep("    e.g.lookAt(e.p.x+e.dir.x,e.p.y+e.dir.y,e.p.z+e.dir.z)}\n  // the stage",
    """    if(hullZone(e.p))pushOut(e.p,e.r,true);
    {const dd=e.p.distanceTo(S.pos);if(dd<e.r+2.6&&S.t-(e.ramT||-9)>.5){e.ramT=S.t;fv2.subVectors(S.pos,e.p).normalize();S.pos.addScaledVector(fv2,e.r+2.8-dd);hurt(e.kind==='gun'?30:24);S.spd*=e.kind==='gun'?.3:.55;if(!reduced)shake=Math.max(shake,.45);sfx('boom');if(msgT<=0)say('Collision',1);flyHit(e,e.kind==='gun'?8:99);if(state!=='playing')return;continue}}
    e.g.lookAt(e.p.x+e.dir.x,e.p.y+e.dir.y,e.p.z+e.dir.z)}
  // the stage""")
open(p,'w').write(s);print('ok')
