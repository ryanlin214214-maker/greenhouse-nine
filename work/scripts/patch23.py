p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:80]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]
NEW=r"""const BOSS={matriarch:{title:'The Matriarch',name:'MATRIARCH',hint:'DESTROY THE SHIELD NODES',down:'SHIELD DOWN, HIT THE CORE',tip:'Shielded: destroy the orbiting nodes',open:'Shield down: hit the core',close:'Shield restored'},
  colossus:{title:'The Colossus',name:'COLOSSUS',hint:'DESTROY THE POWER CELLS',down:'ARMOR OPEN, HIT THE CHEST CORE',tip:'Armored: shoot the glowing power cells on its frame',open:'Armor open: hit the chest core',close:'Armor sealed',baseY:6,r:3,
    slots:[[-3.1,2.6,0],[3.1,2.6,0],[0,1.4,-2.4],[0,-1.2,1.9]]},
  widow:{title:'The Widow',name:'WIDOW',hint:'DESTROY THE COOLANT VENTS',down:'ARMOR OPEN, HIT THE SENSOR EYE',tip:'Armored: shoot the coolant vents on its back',open:'Armor open: hit the sensor eye',close:'Armor sealed',baseY:3.2,r:3.5,
    slots:[[-1.7,2,-1.2],[1.7,2,-1.2],[0,2.2,-2.6],[0,1.7,1.5]]}};
const KINDS=['matriarch','colossus','widow'];
function colossusModel(){const g=new T.Group(),A1=MAT.armor,A2=MAT.armorD,AM=MAT.amber;const B=(m,sx,sy,sz,x,y,z,par=g)=>{const o=mesh(GEO.box,m,sx,sy,sz,x,y,z);par.add(o);return o};
  B(A1,4.2,3,2.8,0,.8,0);B(A2,3.4,1.2,2.4,0,-.9,0);B(A2,3.6,1.8,.3,0,.9,1.45);B(AM,3.7,.15,.32,0,1.7,1.5);B(AM,3.7,.15,.32,0,.1,1.5);B(A2,2.6,2.4,1.2,0,1,-1.9);
  for(const x of[-.8,.8]){g.add(mesh(GEO.cyl,A2,.35,2.2,.35,x,3,-2.1));const q=glow(0xff8a3a,2.2,.8);q.position.set(x,4.2,-2.1);g.add(q)}
  const head=new T.Group();head.position.set(0,2.6,.4);g.add(head);B(A2,1.4,1,1.4,0,.4,0,head);B(MAT.eye,1.1,.18,.1,0,.45,.72,head);B(A1,1.6,.25,1.6,0,.95,0,head);
  for(const s of[-1,1])B(A1,1.6,1,1.8,s*2.7,2,0);
  const arms=[];for(const s of[-1,1]){const sh=new T.Group();sh.position.set(s*2.7,1.3,0);g.add(sh);B(A2,.9,2.2,.9,0,-1.1,0,sh);const el=new T.Group();el.position.set(0,-2.2,0);sh.add(el);
    const c=mesh(GEO.cyl,A2,.42,2.6,.42,0,-.2,1.1);c.rotation.x=Math.PI/2;el.add(c);el.add(mesh(GEO.cyl,AM,.48,.3,.48,0,-.2,2.4));el.children[1].rotation.x=Math.PI/2;arms.push([sh,el])}
  const legs=[];for(const s of[-1,1]){const hip=new T.Group();hip.position.set(s*1.4,-1.4,0);g.add(hip);B(A1,1.1,2.6,1.3,0,-1.2,0,hip);const kn=new T.Group();kn.position.set(0,-2.4,0);hip.add(kn);
    B(A2,.9,2.4,1,0,-1.1,0,kn);B(A1,1.2,.5,.4,0,-.2,.6,kn);B(A2,1.4,.4,2.2,0,-2.3,.3,kn);legs.push([hip,kn])}
  const iris=new T.Group();iris.position.set(0,.8,1.65);g.add(iris);iris.add(mesh(GEO.sph,MAT.eyeA,.75,.75,.4),mesh(GEO.tor,A2,.55,.55,.55,0,0,.25));const pupil=mesh(GEO.sph,MAT.dark,.32,.32,.15,0,0,.33);iris.add(pupil);
  const parts=[];g.traverse(o=>{if(o.isMesh){o.castShadow=true;parts.push([o,o.material])}});const gl=glow(0xffb238,4,.7);gl.position.set(0,.8,2.1);g.add(gl);
  return{g,wings:[],parts,rig:{anim(e,t,dt){const m=e.mv||0,w=t*3.2;for(let i=0;i<2;i++){const[h,k]=legs[i],q=w+(i?Math.PI:0);h.rotation.x=-Math.sin(q)*.35*m;k.rotation.x=Math.max(0,Math.sin(q+1.2))*.5*m}
    g.children[0].position.y=.8+Math.abs(Math.sin(w))*.15*m;e.kick=Math.max(0,(e.kick||0)-dt*3);for(const[sh,el]of arms){sh.rotation.x=-1.2-e.kick*.3;el.rotation.x=-.3+e.kick*.2}
    head.rotation.y=Math.sin(t*.7)*.3;pupil.position.x=Math.sin(t*.9)*.1;iris.scale.setScalar(1+(e.vuln>0?Math.sin(t*12)*.06:0))}}}}
function widowModel(){const g=new T.Group(),A1=MAT.armor,A2=MAT.armorD,AM=MAT.amber;
  g.add(mesh(GEO.hex,A1,3.2,1.4,3.8),mesh(GEO.hex,A2,3.3,.4,3.9,0,-.7,0),mesh(GEO.sph,A2,2.4,1,2.6,0,.6,-.4),mesh(GEO.hex,AM,3.32,.1,3.92,0,.25,0));
  for(let i=0;i<4;i++)g.add(mesh(GEO.box,A2,2.2,.12,.3,0,1.2,-1.6+i*.9));
  const tur=new T.Group();tur.position.set(0,1.4,.4);g.add(tur);tur.add(mesh(GEO.cyl,A2,1.1,.6,1.1),mesh(GEO.box,A1,1.6,.7,1.8,0,.5,.2));
  for(const s of[-1,1]){const c=mesh(GEO.cyl,A2,.2,2.6,.2,s*.45,.5,1.6);c.rotation.x=Math.PI/2;tur.add(c);tur.add(mesh(GEO.box,AM,.26,.26,.2,s*.45,.5,2.9))}
  const iris=new T.Group();iris.position.set(0,.1,3.05);g.add(iris);iris.add(mesh(GEO.sph,MAT.eyeA,.7,.7,.4),mesh(GEO.tor,A2,.5,.5,.5,0,0,.22));const pupil=mesh(GEO.sph,MAT.dark,.3,.3,.15,0,0,.3);iris.add(pupil);
  for(const x of[-1.1,1.1])g.add(mesh(GEO.sph,MAT.eye,.22,.22,.15,x,.3,2.95));
  const legs=[];const ang=[-.55,0,.55,Math.PI-.55,Math.PI,Math.PI+.55];ang.forEach((a,i)=>{const hip=new T.Group();hip.position.set(Math.cos(a)*2.6,-.2,-Math.sin(a)*2.6);hip.rotation.y=a;g.add(hip);
    const u=mesh(GEO.box,A2,2.8,.4,.5,1.1,.8,0);u.rotation.z=Math.atan2(1.6,2.2);hip.add(u);const kn=new T.Group();kn.position.set(2.2,1.6,0);hip.add(kn);
    const l=mesh(GEO.box,A1,4.8,.45,.55,.6,-2.3,0);l.rotation.z=Math.atan2(-4.6,1.2);kn.add(l);kn.add(mesh(GEO.cone,AM,.25,.6,.25,1.2,-4.5,0));kn.children[1].rotation.z=Math.PI;legs.push([hip,kn,a,i])});
  const parts=[];g.traverse(o=>{if(o.isMesh){o.castShadow=true;parts.push([o,o.material])}});const gl=glow(0xffb238,3.4,.7);gl.position.set(0,.1,3.4);g.add(gl);
  return{g,wings:[],parts,rig:{anim(e,t,dt){const m=e.mv||0,w=t*6;for(const[h,k,a,i]of legs){const q=w+(i%2?Math.PI:0);h.rotation.set(0,a+Math.sin(q)*.25*m,Math.max(0,Math.sin(q+1))*.25*m)}
    g.children[0].position.y=Math.abs(Math.sin(w))*.08*m;e.kick=Math.max(0,(e.kick||0)-dt*8);tur.position.z=.4-e.kick*.15;pupil.position.x=Math.sin(t*1.3)*.12;iris.scale.setScalar(1+(e.vuln>0?Math.sin(t*12)*.06:0))}}}}
function mkBoss(kind='matriarch'){const B=BOSS[kind],m=kind==='colossus'?colossusModel():kind==='widow'?widowModel():bossModel(),k=1+0.14*(wave-1),a=Math.random()*6.283;
  const pr=roomAt(pos.x,pos.z),H=pr&&pr.h>=24?pr:ROOMS.find(r=>r.n==='COMMONS');m.g.position.set((H.x0+H.x1)/2+Math.cos(a)*14,B.baseY||12,(H.z0+H.z1)/2+Math.sin(a)*14);scene.add(m.g);
  const hp=(90+45*wave)*k*(kind==='widow'?.9:1);
  const e={...EB(),hall:H,kind,baseY:B.baseY,type:3,pos:m.g.position,g:m.g,wings:m.wings,parts:m.parts,rig:m.rig,r:B.r||3,hp,max:hp,vuln:0,pods:[],cv:3.5,cs:6,cm:9,tip:false,burst:0,bt:0};enemies.push(e);growPods(e);return e}
function bossTick(e,dt){const K=e.kind||'matriarch',B=BOSS[K],walker=K!=='matriarch',p=e.pos,dx=eye.x-p.x,dz=eye.z-p.z,hd=Math.hypot(dx,dz)||1,ux=dx/hd,uz=dz/hd,ph=e.hp<e.max/3?3:e.hp<e.max*2/3?2:1;
  const want=hd>(walker?14:20)?1:hd<(walker?7:12)?-1:0,sp=e.vuln>0?0:K==='colossus'?2.4:K==='widow'?3.8:3.4;p.x=clampA(p.x+(ux*want-uz*0.4)*sp*dt);p.z=clampA(p.z+(uz*want+ux*0.4)*sp*dt);
  if(e.hall){const H=e.hall;p.x=Math.max(H.x0+7,Math.min(H.x1-7,p.x));p.z=Math.max(H.z0+7,Math.min(H.z1-7,p.z))}
  if(walker){p.y=e.baseY;e.mv=sp>0?1:0;const yaw=e.g.rotation.y,c=Math.cos(yaw),sn=Math.sin(yaw);e.pods.forEach((q,i)=>{const o=B.slots[i%4];q.pos.set(p.x+o[0]*c+o[2]*sn,p.y+o[1],p.z-o[0]*sn+o[2]*c)})}
  else{p.y+=((e.vuln>0?3.4:8.5+Math.sin(time)*0.8)-p.y)*Math.min(1,dt*1.5);for(const q of e.pods){q.ang+=dt*1.1;q.pos.set(p.x+Math.cos(q.ang)*4.8,p.y+Math.sin(q.ang*2)*1.1,p.z+Math.sin(q.ang)*4.8)}}
  if(e.vuln>0){e.vuln-=dt;if(e.vuln<=0){growPods(e);say(B.close,1.5)}return}
  e.cv-=dt;e.cs-=dt;e.cm-=dt;e.bt-=dt;const d=Math.hypot(dx,eye.y-p.y,dz)||1;
  if(K==='widow'&&e.burst>0&&e.bt<=0){e.bt=.12;e.burst--;e.kick=1;hv.set(p.x,p.y+1.6,p.z);bolt(hv,dx,eye.y-hv.y+.3,dz,d,.07,30,6,1);sfx('bolt')}
  if(e.cv<=0){
    if(K==='matriarch'){e.cv=3.4-ph*0.5;const n=1+ph*2;sfx('spit');
      for(let i=0;i<n;i++){const a=(i-(n-1)/2)*0.1,c=Math.cos(a),sn=Math.sin(a),vx=(dx*c-dz*sn)/d,vz=(dx*sn+dz*c)/d;
        const g=mesh(GEO.sph,MAT.spore,0.26,0.26,0.26,p.x,p.y-0.5,p.z);g.add(glow(0xff7a3a,7));scene.add(g);shots.push({g,v:new T.Vector3(vx*13,(eye.y-p.y+0.5)/d*13,vz*13),t:7})}}
    else if(K==='colossus'){e.cv=6-ph*.8;e.kick=1;sfx('rocket');const n=2+ph;for(let i=0;i<n;i++){const a=Math.random()*6.283,r=i?2+Math.random()*5:0,x=pos.x+Math.cos(a)*r,z=pos.z+Math.sin(a)*r,T0=1.6+i*.2;
        const g=mesh(GEO.sph,MAT.spore,.3,.3,.3,p.x,p.y+3,p.z);g.add(glow(0xff7a3a,5));scene.add(g);shots.push({g,v:new T.Vector3((x-p.x)/T0,(pos.y-(p.y+3)+0.5*14*T0*T0)/T0,(z-p.z)/T0),t:T0,grav:14,vis:1});
        const rg=mesh(GEO.ring,slamMat,1,1,1,x,pos.y+.12,z);rg.rotation.x=-Math.PI/2;scene.add(rg);slams.push({g:rg,t:T0,T:T0,r:4,dmg:14,x,y:pos.y,z})}}
    else{e.cv=3-ph*.4;e.burst=4+ph;e.bt=0}}
  if(e.cs<=0){e.cs=7.5-ph*1.2;
    if(K==='colossus'&&hd<11){const rg=mesh(GEO.ring,slamMat,1,1,1,p.x,.12,p.z);rg.rotation.x=-Math.PI/2;scene.add(rg);slams.push({g:rg,t:1.1,T:1.1,r:9,dmg:24,x:p.x,y:0,z:p.z});sfx('over')}
    else{const g=mesh(GEO.ring,slamMat,1,1,1,pos.x,pos.y+0.12,pos.z);g.rotation.x=-Math.PI/2;scene.add(g);slams.push({g,t:1.3,x:pos.x,y:pos.y,z:pos.z});sfx('over')}}
  if(e.cm<=0){e.cm=15-ph*2;if(alive()<6)for(let i=0;i<1+ph;i++){const t=K==='matriarch'?0:K==='colossus'?5:(Math.random()<.5?7:11),x=p.x+(Math.random()-.5)*10,z=p.z+(Math.random()-.5)*10;
      enemies.push(mk(t,x,t>=5?1.5:p.y-2,z))}}}
"""
between("function mkBoss(){","\nfunction nextMission(",NEW)
rep("if(e.type===3&&e.vuln<=0){n*=0.12;crit=false;if(!e.tip){e.tip=true;say('Shielded: destroy the orbiting nodes',2.5)}}","if(e.type===3&&e.vuln<=0){n*=0.12;crit=false;if(!e.tip){e.tip=true;say(BOSS[e.kind||'matriarch'].tip,2.5)}}")
rep("say('Shield down: hit the core',2.5);sfx('nova')}return}","say(BOSS[b.kind||'matriarch'].open,2.5);sfx('nova')}return}")
rep("m.boss=mkBoss();bossN++;storyBoss('matriarch');say('Boss · The Matriarch',3)}}","const kind=KINDS[bossN%KINDS.length];m.boss=mkBoss(kind);bossN++;storyBoss(kind);say('Boss · '+BOSS[kind].title,3)}}")
rep("(b.vuln>0?'MATRIARCH SHIELD DOWN, HIT THE CORE':'MATRIARCH: DESTROY THE SHIELD NODES')","(BOSS[b.kind].name+(b.vuln>0?' · '+BOSS[b.kind].down:' · '+BOSS[b.kind].hint))")
rep("    if(state!=='paused'){e.g.position.y+=Math.sin(time*4+e.ph)*0.004;","    if(e.type===3&&e.kind&&e.kind!=='matriarch'){e.g.rotation.y=Math.atan2(eye.x-e.pos.x,eye.z-e.pos.z);continue}\n    if(state!=='paused'){e.g.position.y+=Math.sin(time*4+e.ph)*0.004;")
rep("""boss:{matriarch:[['R',"Something huge just lifted out of the drone foundry. A carrier, with shield nodes circling it."],['L',"The Matriarch carries the song. Let her sing to you."]]},""",
"""boss:{matriarch:[['R',"Something huge just lifted out of the drone foundry. A carrier, with shield nodes circling it."],['L',"The Matriarch carries the song. Let her sing to you."]],
    colossus:[['R',"That's a hull-breaker frame. It used to weld armor onto the outer hull. Now it's walking. Shoot the power cells on its frame."],['L',"The Colossus was built to hold this station together. It still is."]],
    widow:[['R',"Spider tank, up from the cargo lifts. Six legs, twin cannons, and it's carrying passengers. Go for the vents on its back."],['L',"The Widow keeps the nest. You are standing in the nest."]]},""")
open(p,'w').write(s);print('ok')
