p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:80]); s=s.replace(a,b)
rep('<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/UnrealBloomPass.js"></script>',
    '<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/UnrealBloomPass.js"></script>\n<script src="https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.6.2/cannon.min.js"></script>')
rep("put(J(root,0,-.1,0),n+'P',","const pel=J(root,0,-.1,0);put(pel,n+'P',")
rep("  return{aim,anim(e,t,dt){","  return{aim,segs:{pel,tor,head,arms,legs,gun},anim(e,t,dt){")
rep("/* ---------- combat ---------- */","""/* ---------- ragdolls: limbs on cannon.js bodies, colliding only with the floor and nearby walls ---------- */
const CN=window.CANNON||null;let PW=null;const CORPSES=[],STAT=new Map(),_bx=new T.Box3(),_bv=new T.Vector3(),_bq=new T.Quaternion();
function physWorld(){if(PW||!CN)return PW;PW=new CN.World();PW.gravity.set(0,-17,0);PW.broadphase=new CN.NaiveBroadphase();PW.solver.iterations=8;
  const g=new CN.Body({mass:0,collisionFilterGroup:1,collisionFilterMask:2});g.addShape(new CN.Plane());g.quaternion.setFromAxisAngle(new CN.Vec3(1,0,0),-Math.PI/2);PW.addBody(g);return PW}
function addStatics(x,z){const out=[];for(const b of nearList(x-7,z-7,x+7,z+7)){let st=STAT.get(b);
    if(!st){const body=new CN.Body({mass:0,collisionFilterGroup:1,collisionFilterMask:2});body.addShape(new CN.Box(new CN.Vec3((b.hi[0]-b.lo[0])/2,(b.hi[1]-b.lo[1])/2,(b.hi[2]-b.lo[2])/2)));
      body.position.set((b.lo[0]+b.hi[0])/2,(b.lo[1]+b.hi[1])/2,(b.lo[2]+b.hi[2])/2);PW.addBody(body);st={body,n:0};STAT.set(b,st)}st.n++;out.push(b)}return out}
function dropStatics(list){for(const b of list){const st=STAT.get(b);if(st&&--st.n<=0){PW.removeBody(st.body);STAT.delete(b)}}}
function partBody(obj,mass,vel){obj.updateMatrixWorld(true);_bx.setFromObject(obj);const c=_bx.getCenter(new T.Vector3()),sz=_bx.getSize(new T.Vector3());obj.getWorldQuaternion(_bq);obj.getWorldPosition(_bv);
  const body=new CN.Body({mass,collisionFilterGroup:2,collisionFilterMask:1,linearDamping:.15,angularDamping:.35});body.addShape(new CN.Box(new CN.Vec3(Math.max(.07,sz.x*.36),Math.max(.07,sz.y*.36),Math.max(.07,sz.z*.36))));
  body.position.set(c.x,c.y,c.z);body.quaternion.set(_bq.x,_bq.y,_bq.z,_bq.w);body.velocity.set(vel.x+(Math.random()-.5)*1.5,vel.y+Math.random()*1.5,vel.z+(Math.random()-.5)*1.5);
  body.angularVelocity.set((Math.random()-.5)*4,(Math.random()-.5)*4,(Math.random()-.5)*4);const off=_bv.clone().sub(c).applyQuaternion(_bq.clone().invert());PW.addBody(body);return{b:body,obj,off}}
function freeCorpse(C){for(const p of C.parts)PW.removeBody(p.b);for(const c of C.cons)PW.removeConstraint(c);for(const o of C.objs)scene.remove(o);dropStatics(C.stat)}
function ragdoll(e){if(!physWorld())return;try{const dir=new T.Vector3(e.pos.x-eye.x,0,e.pos.z-eye.z).normalize(),vel=new T.Vector3(dir.x*5,3,dir.z*5);
  for(const[o,m]of e.parts)o.material=m;if(e.shell){e.g.remove(e.shell);e.shell=null}if(e.aim)e.aim.visible=false;
  const C={parts:[],cons:[],t:10,objs:[],stat:addStatics(e.pos.x,e.pos.z)},S=e.rig&&e.rig.segs;
  if(S){const list=[S.head,S.arms[0][1],S.arms[1][1],S.legs[0][1],S.legs[1][1],S.gun,S.arms[0][0],S.arms[1][0],S.legs[0][0],S.legs[1][0],S.tor,S.pel].filter(Boolean);
    e.g.updateMatrixWorld(true);const jw=new Map();for(const o of list)jw.set(o,o.getWorldPosition(new T.Vector3()));for(const o of list)scene.attach(o);
    const B=new Map();for(const o of list){const q=partBody(o,o===S.tor?3:o===S.gun?.6:1,vel);B.set(o,q);C.parts.push(q);C.objs.push(o)}
    const link=(a,b)=>{const P=B.get(a),Q=B.get(b);if(!P||!Q)return;const w=jw.get(b),v=new CN.Vec3(w.x,w.y,w.z),c=new CN.PointToPointConstraint(P.b,P.b.pointToLocalFrame(v),Q.b,Q.b.pointToLocalFrame(v));PW.addConstraint(c);C.cons.push(c)};
    link(S.tor,S.head);for(const[sh,el]of S.arms){link(S.tor,sh);link(sh,el)}link(S.tor,S.pel);for(const[h,k]of S.legs){link(S.pel,h);link(h,k)}scene.remove(e.g)}
  else{const q=partBody(e.g,2,vel);C.parts.push(q);C.objs.push(e.g)}
  for(const o of C.objs)o.traverse(q=>{if(q.isMesh)q.castShadow=false});e.corpse=true;CORPSES.push(C);while(CORPSES.length>(lowFx?5:10))freeCorpse(CORPSES.shift())}catch(err){e.corpse=false}}
function corpseTick(dt){if(!PW||!CORPSES.length)return;PW.step(1/60,dt,3);
  for(let i=CORPSES.length-1;i>=0;i--){const C=CORPSES[i];C.t-=dt;
    for(const q of C.parts){const b=q.b;_bq.set(b.quaternion.x,b.quaternion.y,b.quaternion.z,b.quaternion.w);q.obj.quaternion.copy(_bq);_bv.copy(q.off).applyQuaternion(_bq);
      q.obj.position.set(b.position.x+_bv.x,b.position.y+_bv.y-(C.t<1?(1-C.t)*1.2:0),b.position.z+_bv.z)}
    if(C.t<=0){freeCorpse(C);CORPSES.splice(i,1)}}}
function clearCorpses(){if(PW)while(CORPSES.length)freeCorpse(CORPSES.pop())}

/* ---------- combat ---------- */""")
rep("e.dying=0.001;sparkle(e.pos,e.type>=5?GP","e.dying=0.001;if(e.type!==3&&e.type!==4)ragdoll(e);sparkle(e.pos,e.type>=5?GP")
rep("  navT-=dt;if(navT<=0){navT=.35;navFlow()}","  navT-=dt;if(navT<=0){navT=.35;navFlow()}\n  corpseTick(dt);")
rep("  for(let i=enemies.length-1;i>=0;i--){const e=enemies[i];\n    e.flash-=dt;","  for(let i=enemies.length-1;i>=0;i--){const e=enemies[i];\n    if(e.corpse){enemies.splice(i,1);continue}\n    e.flash-=dt;")
rep("clear(enemies);clear(shots);","clearCorpses();clear(enemies);clear(shots);")
open(p,'w').write(s);print('ok')
