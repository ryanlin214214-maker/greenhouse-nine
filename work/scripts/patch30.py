p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:90]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]
between("function physWorld(){","function addStatics(x,z){","""let MAT_ST=null,MAT_BODY=null;
function physWorld(){if(PW||!CN)return PW;PW=new CN.World();PW.gravity.set(0,-26,0);PW.broadphase=new CN.NaiveBroadphase();PW.solver.iterations=12;PW.allowSleep=true;
  MAT_ST=new CN.Material('static');MAT_BODY=new CN.Material('body');PW.addContactMaterial(new CN.ContactMaterial(MAT_ST,MAT_BODY,{friction:.75,restitution:.02}));
  PW.defaultContactMaterial.friction=.6;PW.defaultContactMaterial.restitution=.02;
  const g=new CN.Body({mass:0,material:MAT_ST,collisionFilterGroup:1,collisionFilterMask:2});g.addShape(new CN.Plane());g.quaternion.setFromAxisAngle(new CN.Vec3(1,0,0),-Math.PI/2);PW.addBody(g);return PW}
""")
rep("if(!st){const body=new CN.Body({mass:0,collisionFilterGroup:1,collisionFilterMask:2});","if(!st){const body=new CN.Body({mass:0,material:MAT_ST,collisionFilterGroup:1,collisionFilterMask:2});")
between("function partBody(obj,mass,vel){","function freeCorpse(C){","""function partBody(obj,dens,vel){obj.updateMatrixWorld(true);_bx.setFromObject(obj);const c=_bx.getCenter(new T.Vector3()),sz=_bx.getSize(new T.Vector3());obj.getWorldQuaternion(_bq);obj.getWorldPosition(_bv);
  const hx=Math.max(.08,sz.x*.45),hy=Math.max(.08,sz.y*.45),hz=Math.max(.08,sz.z*.45),mass=Math.max(1.2,Math.min(60,8*hx*hy*hz*dens*1000));
  const body=new CN.Body({mass,material:MAT_BODY,collisionFilterGroup:2,collisionFilterMask:1,linearDamping:.04,angularDamping:.6});body.addShape(new CN.Box(new CN.Vec3(hx,hy,hz)));
  body.allowSleep=true;body.sleepSpeedLimit=.35;body.sleepTimeLimit=.35;
  body.position.set(c.x,c.y,c.z);body.quaternion.set(_bq.x,_bq.y,_bq.z,_bq.w);body.velocity.set(vel.x,vel.y,vel.z);
  body.angularVelocity.set((Math.random()-.5)*.6,(Math.random()-.5)*.6,(Math.random()-.5)*.6);const off=_bv.clone().sub(c).applyQuaternion(_bq.clone().invert());PW.addBody(body);return{b:body,obj,off}}
""")
between("function ragdoll(e){","function corpseTick(dt){","""function ragdoll(e){if(!physWorld())return;try{const dir=new T.Vector3(e.pos.x-eye.x,0,e.pos.z-eye.z).normalize(),boom=e.lastEl===2,vel=new T.Vector3(dir.x*1.2,0,dir.z*1.2);
  for(const[o,m]of e.parts)o.material=m;if(e.shell){e.g.remove(e.shell);e.shell=null}if(e.aim)e.aim.visible=false;
  const C={parts:[],cons:[],t:10,objs:[],stat:addStatics(e.pos.x,e.pos.z),thud:0,h0:e.pos.y},S=e.rig&&e.rig.segs,heavy=e.type===6?1.6:e.type===7?.8:1;
  if(S){const list=[S.head,S.arms[0][1],S.arms[1][1],S.legs[0][1],S.legs[1][1],S.gun,S.arms[0][0],S.arms[1][0],S.legs[0][0],S.legs[1][0],S.tor,S.pel].filter(Boolean);
    e.g.updateMatrixWorld(true);const jw=new Map(),up=new Map();for(const o of list){jw.set(o,o.getWorldPosition(new T.Vector3()));up.set(o,new T.Vector3(0,1,0).applyQuaternion(o.getWorldQuaternion(new T.Quaternion())))}
    for(const o of list)scene.attach(o);
    const B=new Map();for(const o of list){const q=partBody(o,(o===S.gun?.35:o===S.tor?1.1:.9)*heavy,vel);B.set(o,q);C.parts.push(q);C.objs.push(o)}
    const link=(a,b,ang,tw)=>{const P=B.get(a),Q=B.get(b);if(!P||!Q)return;const w=jw.get(b),v=new CN.Vec3(w.x,w.y,w.z),u=up.get(b),U=new CN.Vec3(u.x,u.y,u.z);
      const qa=P.b.quaternion.inverse(),qb=Q.b.quaternion.inverse();
      const c=CN.ConeTwistConstraint?new CN.ConeTwistConstraint(P.b,Q.b,{pivotA:P.b.pointToLocalFrame(v),pivotB:Q.b.pointToLocalFrame(v),axisA:qa.vmult(U),axisB:qb.vmult(U),angle:ang,twistAngle:tw,maxForce:1e6})
        :new CN.PointToPointConstraint(P.b,P.b.pointToLocalFrame(v),Q.b,Q.b.pointToLocalFrame(v));PW.addConstraint(c);C.cons.push(c)};
    link(S.tor,S.head,.45,.3);for(const[sh,el]of S.arms){link(S.tor,sh,1.1,.4);link(sh,el,.9,.2)}link(S.tor,S.pel,.35,.25);for(const[h,k]of S.legs){link(S.pel,h,.8,.25);link(h,k,.9,.1)}
    // one shove at the torso from the hit direction; explosions throw harder
    const T0=B.get(S.tor).b,imp=(boom?9:4.5)*T0.mass;T0.applyImpulse(new CN.Vec3(dir.x*imp,(boom?4:.6)*T0.mass,dir.z*imp),T0.position);
    if(S.gun){const G=B.get(S.gun);if(G)G.b.applyImpulse(new CN.Vec3(dir.x*2,1.5,dir.z*2),G.b.position)}
    scene.remove(e.g)}
  else{const q=partBody(e.g,e.type===9?2.2:.8,vel);q.b.applyImpulse(new CN.Vec3(dir.x*(boom?8:3)*q.b.mass,(boom?3:0)*q.b.mass,dir.z*(boom?8:3)*q.b.mass),q.b.position);
    q.b.angularVelocity.set((Math.random()-.5)*3,(Math.random()-.5)*3,(Math.random()-.5)*3);C.parts.push(q);C.objs.push(e.g)}
  // a thud and dust when the heaviest part hits something hard
  const main=C.parts.reduce((a,b)=>b.b.mass>a.b.mass?b:a,C.parts[0]);
  main.b.addEventListener('collide',ev=>{let v=0;try{v=Math.abs(ev.contact.getImpactVelocityAlongNormal())}catch(_){}if(v>2.5&&time-C.thud>.3){C.thud=time;const p=main.b.position,q=new T.Vector3(p.x,p.y-.3,p.z);
      sparkle(q,0x9a968a,Math.min(14,4+v*1.2|0),1.5+v*.25);tone('triangle',90+Math.random()*30,40,.18,Math.min(.12,.025*v*Math.sqrt(main.b.mass)/4));if(!reduced&&main.b.mass>25&&eye.distanceTo(q)<12)shake=Math.max(shake,.06)}});
  for(const o of C.objs)o.traverse(q=>{if(q.isMesh)q.castShadow=false});e.corpse=true;CORPSES.push(C);while(CORPSES.length>(lowFx?5:10))freeCorpse(CORPSES.shift())}catch(err){e.corpse=false}}
""")
rep("function damage(e,n,el=-1,crit=false,shot=false){","function damage(e,n,el=-1,crit=false,shot=false){e.lastEl=el;")
rep("function corpseTick(dt){if(!PW||!CORPSES.length)return;PW.step(1/60,dt,3);","function corpseTick(dt){if(!PW||!CORPSES.length)return;PW.step(1/90,dt,4);")
open(p,'w').write(s);print('ok')
