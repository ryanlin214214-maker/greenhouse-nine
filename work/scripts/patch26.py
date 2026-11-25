p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:90]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]

# ---------- weapon table, loadout, gun state
between("const NAMES=[","const tmpN=new T.Vector3();","""const WPN=[
  {name:'Arc Welder',short:'ARC',slot:0,el:0,mode:'heat',cd:.1,dmg:1,heat:8,col:0x9fefff,snd:'shoot',rec:1,mz:-.92,
    gren:{n:'FIRE',cd:7,kind:'fire'},mel:{n:'BLADE',cd:6,kind:'sword'}},
  {name:'Briar Lance',short:'LANCE',slot:1,el:1,mode:'mag',mag:6,res:24,reload:1.7,cd:.7,dmg:6,pierce:1,col:0xe3d2ff,snd:'lance',rec:2,mz:-1.02,
    gren:{n:'THORN',cd:7,kind:'thorn'},mel:{n:'WHIP',cd:4,kind:'whip'}},
  {name:'Rook Rifle',short:'RIFLE',slot:0,el:0,mode:'mag',mag:32,res:192,reload:1.6,cd:.08,dmg:.85,spread:.012,col:0xffd27a,snd:'ar',rec:.8,mz:-.95,
    gren:{n:'FRAG',cd:6,kind:'frag'},mel:{n:'PUNCH',cd:3.5,kind:'punch'}},
  {name:'Wren Sidearm',short:'PISTOL',slot:0,el:0,mode:'mag',mag:12,res:0,inf:1,reload:1.0,cd:.17,dmg:2.1,spread:.004,col:0xffe6b0,snd:'pistol',rec:1.4,mz:-.36,
    gren:{n:'STUN',cd:6,kind:'stun'},mel:{n:'DASH',cd:4,kind:'dash'}},
  {name:'Mule Launcher',short:'LAUNCH',slot:1,el:2,mode:'mag',mag:5,res:20,reload:2.1,cd:.6,dmg:6,proj:'gl',col:0xffb238,snd:'gl',rec:2.2,mz:-.74,
    gren:{n:'CLUSTER',cd:8,kind:'cluster'},mel:{n:'STOMP',cd:5,kind:'stomp'}},
  {name:'Harrow Cannon',short:'HARROW',slot:1,el:1,mode:'mag',mag:90,res:180,reload:2.6,cd:.055,dmg:.75,spread:.028,spin:1,col:0xc9a6ff,snd:'cannon',rec:.7,mz:-.84,
    gren:{n:'WELL',cd:9,kind:'well'},mel:{n:'CHARGE',cd:5,kind:'charge'}}];
const POOL=[[0,2,3],[1,4,5]];
let LOAD=[0,1];try{const q=JSON.parse(localStorage.getItem('gh9-load')||'null');if(q&&POOL[0].includes(q[0])&&POOL[1].includes(q[1]))LOAD=q}catch(e){}
let reloadT=0,reloadDur=1,spinV=0,swordT=0,dashT=0,grenMax=6,meleeMax=4,drumAng=0,dashDmg=0,fires=[],wells=[],rings=[],fxq=[],camFx=[];const dashV=new T.Vector3(),dashHit=new Set();
""")
rep("function newGuns(){guns=[{name:NAMES[0][0],rar:0,pow:1},{name:NAMES[1][0],rar:0,pow:1}]}newGuns();",
    "function mkGun(k,rar=0,pow=1){const W=WPN[k];return{k,name:W.name,rar,pow,mag:W.mode==='mag'?W.mag:0,res:W.res||0}}\nfunction newGuns(){guns=[mkGun(LOAD[0]),mkGun(LOAD[1])]}newGuns();\nfunction refill(f){for(const G of guns){const W=WPN[G.k];if(W.mode==='mag'&&!W.inf)G.res=Math.min(W.res*1.5,G.res+Math.ceil(W.res*f))}}\nfunction needAmmo(){return guns.some(G=>{const W=WPN[G.k];return W.mode==='mag'&&!W.inf&&G.res<W.res})}")
rep("weapon=0,ammo=12,grenCd=0,","weapon=0,grenCd=0,")
rep("newGuns();\n  weapon=0;ammo=12;grenCd=0;meleeCd=0;meleeA=0;superQ=0;novaA=0;hurtA=0;queue=[];",
    "newGuns();\n  weapon=0;grenCd=0;meleeCd=0;meleeA=0;superQ=0;novaA=0;hurtA=0;queue=[];reloadT=0;spinV=0;swordT=0;dashT=0;clear(fires);clear(wells);clear(rings);fxq.length=0;for(const c of camFx)cam.remove(c.g);camFx.length=0;")
rep("ammo=Math.min(24,ammo+(boss?12:4));","refill(boss?1:.4);clear(fires);clear(wells);")
rep("else if(p.k===1&&ammo<24){ammo=Math.min(24,ammo+4);say('Lance cells',1)}","else if(p.k===1&&needAmmo()){refill(.35);say('Ammo',1)}")
# loot of any kind for either slot
rep("const[x,y,z]=place(e,0.7),slot=Math.random()*2|0,","const[x,y,z]=place(e,0.7),slot=Math.random()*2|0,lk=POOL[slot][Math.random()*3|0],")
rep("loots.push({g,y:y+0.7,slot,rar,pow:w+rar,name:NAMES[slot][Math.random()*4|0]})}","loots.push({g,y:y+0.7,slot,k:lk,rar,pow:w+rar,name:WPN[lk].name})}")
rep("if((1+(L.pow-1)*0.12)*RAR[L.rar].m>gunMult(L.slot)){guns[L.slot]={name:L.name,rar:L.rar,pow:L.pow};say(RAR[L.rar].n+' '+L.name+' · Power '+L.pow,2.4,RAR[L.rar].c)}",
    "const nm=(1+(L.pow-1)*0.12)*RAR[L.rar].m,cur=gunMult(L.slot),same=guns[L.slot].k===L.k;if(same?nm>cur:nm*1.3>=cur){guns[L.slot]=mkGun(L.k,L.rar,L.pow);if(weapon===L.slot)reloadT=0;say(RAR[L.rar].n+' '+L.name+' · Power '+L.pow,2.4,RAR[L.rar].c)}")

# ---------- firing
between("function fire(){\n","function grenade(){","""function fire(){
  const G=guns[weapon],W=WPN[G.k],od=overT>0;
  if(reloadT>0)return;
  if(W.mode==='mag'&&G.mag<=0){startReload();fireCd=.2;return}
  if(W.mode==='mag')G.mag--;else{if(!od)heat+=W.heat;if(heat>=100){heat=100;over=true;say('Overheated',1.2);sfx('over')}}
  fireCd=W.cd*(od?.6:1)/(W.spin?(.3+.7*spinV):1);flash=W.proj?.05:(W.pierce?.12:.06);recoil=W.rec;sfx(W.snd);sinceFire=0;
  const org=veh?cam.position:eye;cam.getWorldDirection(tmp);
  if(W.spread){tmp.x+=(Math.random()-.5)*W.spread*2;tmp.y+=(Math.random()-.5)*W.spread*2;tmp.z+=(Math.random()-.5)*W.spread*2;tmp.normalize()}
  if(veh)tmp2.copy(veh.pos);else muzzle.getWorldPosition(tmp2);
  const dm=gunMult(weapon)*(od?2:1)*W.dmg;
  if(W.proj==='gl'){drumAng+=1.047;const g=new T.Group();g.add(mesh(GEO.sph,MAT.amber,.11,.11,.16),glow(0xffb238,2.4,.9));g.position.copy(tmp2);scene.add(g);
    grenades.push({g,v:tmp.clone().multiplyScalar(40).add(new T.Vector3(0,1.5,0)),t:3,kind:'gl',dm,grav:7});if(W.mode==='mag'&&G.mag<=0)startReload();return}
  const o=[org.x,org.y,org.z],d=[tmp.x,tmp.y,tmp.z],wall=rayBoxes(o,d,veh?170:90);
  let hit=null,hd=wall;const all=[];
  for(const e of enemies){if(e.dying)continue;const ox=e.pos.x-o[0],oy=e.pos.y-o[1],oz=e.pos.z-o[2],t=ox*d[0]+oy*d[1]+oz*d[2];
    if(t<0||t>wall)continue;const R=e.r*1.2+t*0.012,q=ox*ox+oy*oy+oz*oz-t*t;
    if(q<R*R){e.c=q<(e.r*0.45)**2;all.push(e);if(t<hd){hit=e;hd=t}}}
  const end=W.pierce?wall:hd;tmp.multiplyScalar(end).add(org);
  beam.position.copy(tmp2).add(tmp).multiplyScalar(0.5);beam.lookAt(tmp);const th=(W.pierce?0.03:W.spin?.009:0.012)*(veh?5:1);beam.scale.set(th,th,tmp2.distanceTo(tmp));
  beamMat.color.set(W.col);sparkle(tmp,W.col,W.pierce?4:2,3);mfl.color.set(W.col);
  if(W.pierce)for(const e of all)damage(e,dm,W.el,e.c,true);else if(hit)damage(hit,dm,W.el,hit.c,true);
  if(W.mode==='mag'&&G.mag<=0)startReload();
}
function startReload(){if(veh)return;const G=guns[weapon],W=WPN[G.k];if(W.mode!=='mag'||reloadT>0||G.mag>=W.mag)return;
  if(!W.inf&&G.res<=0){if(msgT<=0)say('Out of ammo · swap weapons',1.2);return}reloadDur=reloadT=W.reload*(cls===1?.85:1);sfx('reload')}
function finishReload(){const G=guns[weapon],W=WPN[G.k];const n=W.inf?W.mag-G.mag:Math.min(W.mag-G.mag,G.res);G.mag+=n;if(!W.inf)G.res-=n;sfx('swap')}
// ---------- weapon grenades
const GRCOL={fire:0xff7a2a,thorn:0xc9a6ff,frag:0xffb238,stun:0x6fd8ff,cluster:0xffb238,well:0x9a6ae0,bomblet:0xffb238};
function grenade(){if(state!=='playing'||grenCd>0||veh)return;const W=WPN[guns[weapon].k],K=W.gren.kind;grenMax=grenCd=W.gren.cd*CLS[cls].gren/6;cam.getWorldDirection(tmp);
  const g=new T.Group(),c=GRCOL[K];g.add(mesh(GEO.sph,bas({color:c}),.14,.14,.14),glow(c,4,.9));g.position.copy(eye).addScaledVector(tmp,0.5);scene.add(g);
  grenades.push({g,v:tmp.clone().multiplyScalar(17).add(new T.Vector3(0,2.5,0)),t:K==='fire'?1.6:2,kind:K,dm:1});sfx('swap')}
function ringFx(p,r,col,y=.12){const m=bas({color:col,transparent:true,opacity:.85,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}),g=mesh(GEO.ring,m,1,1,1,p.x,p.y+y,p.z);g.rotation.x=-Math.PI/2;scene.add(g);rings.push({g,m,t:0,r})}
function blast(p,r,dmg,el,col,quiet){const m=bas({color:col,transparent:true,opacity:0.85,fog:false}),g=mesh(GEO.sph,m,0.5,0.5,0.5,p.x,p.y,p.z);scene.add(g);
  blasts.push({g,m,t:0,r});sparkle(p,col,14,9);if(!quiet)sfx('boom');if(!reduced)shake=Math.max(shake,0.1);
  const c=new T.Vector3(p.x,Math.max(p.y,0.3),p.z);for(const e of enemies){if(e.dying)continue;const d=e.pos.distanceTo(c);if(d<r+e.r&&los(c,e.pos))damage(e,dmg*(d<r*.5?1:.55),el)}return c}
function grenBoom(K,p,dm){const k=1+0.1*(power()-1);
  if(K==='gl'){blast(p,4.5,dm,2,0xffb238);return}
  if(K==='bomblet'){blast(p,2.8,3*k,2,0xffb238,true);return}
  if(K==='fire'){blast(p,4,5*k,2,0xff7a2a);const fm=bas({color:0xff6a1a,transparent:true,opacity:.55,depthWrite:false,blending:T.AdditiveBlending}),fg=new T.Group(),fy=groundAt(p.x,p.z,p.y+.5);
    const disc=mesh(new T.CircleGeometry(1,24),fm,5.5,5.5,1,0,.06,0);disc.rotation.x=-Math.PI/2;fg.add(disc);const fl=[];for(let i=0;i<9;i++){const a=i/9*6.283,q=glow(i%2?0xff7a2a:0xffc040,1.6,.8);q.position.set(Math.cos(a)*(1+hash(i,7)*3.5),.6,Math.sin(a)*(1+hash(i,8)*3.5));fg.add(q);fl.push(q)}
    fg.position.set(p.x,fy,p.z);scene.add(fg);fires.push({g:fg,fm,fl,t:6,tick:0,r:5.5,dm:1.1*k});return}
  if(K==='thorn'){blast(p,3.4,5*k,1,0xc9a6ff);for(let i=1;i<=2;i++)fxq.push({t:i*.35,fn:()=>{const q=p.clone();q.x+=(Math.random()-.5)*4;q.z+=(Math.random()-.5)*4;blast(q,3,4*k,1,0xc9a6ff)}});return}
  if(K==='frag'){blast(p,5.5,8*k,2,0xffb238);sparkle(p,0xffffff,20,14);return}
  if(K==='stun'){const c=blast(p,6.5,2*k,0,0x6fd8ff);ringFx(c,7,0x6fd8ff);for(const e of enemies)if(!e.dying&&e.pos.distanceTo(c)<7+e.r&&e.type!==3)e.slowT=4;return}
  if(K==='cluster'){blast(p,3.5,4*k,2,0xffb238);for(let i=0;i<6;i++){const a=i/6*6.283,g=new T.Group();g.add(mesh(GEO.sph,MAT.amber,.09,.09,.09),glow(0xffb238,1.6,.8));g.position.copy(p);g.position.y+=.4;scene.add(g);
      grenades.push({g,v:new T.Vector3(Math.cos(a)*6,6+Math.random()*3,Math.sin(a)*6),t:.6+Math.random()*.4,kind:'bomblet',dm:1})}return}
  if(K==='well'){const m=bas({color:0x6a3ab8,transparent:true,opacity:.6,depthWrite:false,blending:T.AdditiveBlending}),g=new T.Group();g.add(mesh(GEO.sph,bas({color:0x0a0410}),.8,.8,.8),mesh(GEO.tor,m,2,2,2),glow(0x9a6ae0,8,.7));
    g.position.copy(p);g.position.y=Math.max(p.y,1.4);scene.add(g);wells.push({g,m,t:3,r:10,dm:9*k});sfx('nova');return}
  explode(p)}
function weaponFxTick(dt){
  for(let i=fxq.length-1;i>=0;i--){const q=fxq[i];q.t-=dt;if(q.t<=0){fxq.splice(i,1);q.fn()}}
  for(let i=fires.length-1;i>=0;i--){const f=fires[i];f.t-=dt;f.tick-=dt;f.fm.opacity=.35+.2*Math.sin(time*9+i)*(f.t>1?1:f.t);for(const q of f.fl)q.scale.setScalar(1.2+Math.random()*1.2);
    if(f.tick<=0){f.tick=.5;for(const e of enemies){if(e.dying)continue;const dx=e.pos.x-f.g.position.x,dz=e.pos.z-f.g.position.z;if(dx*dx+dz*dz<(f.r+e.r)**2&&Math.abs(e.pos.y-f.g.position.y)<3.5){damage(e,f.dm,2);sparkle(e.pos,0xff7a2a,3,3)}}}
    if(f.t<=0){scene.remove(f.g);fires.splice(i,1)}}
  for(let i=wells.length-1;i>=0;i--){const w=wells[i],c=w.g.position;w.t-=dt;w.g.rotation.y+=dt*4;w.g.children[1].rotation.x+=dt*3;
    for(const e of enemies){if(e.dying||e.type===3||e.type===4)continue;tmp2.copy(c).sub(e.pos);const d=tmp2.length();if(d<w.r&&d>.6)e.pos.addScaledVector(tmp2,Math.min(1,dt*9/d))}
    if(w.t<=0){scene.remove(w.g);wells.splice(i,1);blast(c,5.5,w.dm,1,0x9a6ae0);ringFx(c,8,0x9a6ae0)}}
  for(let i=rings.length-1;i>=0;i--){const r=rings[i];r.t+=dt;const k=r.t/.35;r.g.scale.setScalar(.5+k*r.r);r.m.opacity=.85*(1-k);if(k>=1){scene.remove(r.g);rings.splice(i,1)}}
  for(let i=camFx.length-1;i>=0;i--){const c=camFx[i];c.t+=dt;const k=c.t/c.d;c.m.opacity=.9*(1-k);c.g.rotation.z=c.r0+k*c.dr;if(k>=1){cam.remove(c.g);camFx.splice(i,1)}}
  if(dashT>0){dashT-=dt;movePlayer(dashV.x*dt,0,dashV.z*dt);eye.set(pos.x,pos.y+EYE,pos.z);
    for(const e of enemies){if(e.dying||dashHit.has(e))continue;if(e.pos.distanceTo(eye)<e.r+2.2){dashHit.add(e);damage(e,dashDmg);sparkle(e.pos,0xffe6b0,8,6);if(e.type<3||e.type>=5){tmp2.copy(e.pos).sub(eye).setY(0).normalize();e.pos.addScaledVector(tmp2,dashV.length()>25?4:2)}}}}}
""")
# grenade loop: per-kind, proximity fire grenade sticks and waits
between("  for(let i=grenades.length-1;i>=0;i--){const g=grenades[i],p=g.g.position;g.t-=dt;g.v.y-=14*dt;p.addScaledVector(g.v,dt);","  navT-=dt;","""  for(let i=grenades.length-1;i>=0;i--){const g=grenades[i],p=g.g.position;g.t-=dt;
    if(g.stuck){let trig=g.t<=0;if(!trig)for(const e of enemies)if(!e.dying&&e.type!==4&&e.pos.distanceTo(p)<e.r+3.2){trig=true;break}
      g.g.scale.setScalar(1+Math.abs(Math.sin(time*(g.t<1.5?24:8)))*.4);if(trig){scene.remove(g.g);grenades.splice(i,1);grenBoom(g.kind,p.clone(),g.dm)}continue}
    g.v.y-=(g.grav||14)*dt;p.addScaledVector(g.v,dt);
    let boom=g.t<=0||p.y<0.12||inBox(p.x,p.y,p.z),hitE=false;
    if(!boom)for(const e of enemies)if(!e.dying&&e.pos.distanceTo(p)<e.r+0.3){boom=true;hitE=true;break}
    if(boom){p.addScaledVector(g.v,-dt);if(g.kind==='fire'&&!hitE&&g.t>0){g.stuck=true;g.t=5;if(p.y<0.15)p.y=0.15;continue}
      scene.remove(g.g);grenades.splice(i,1);grenBoom(g.kind,p.clone(),g.dm)}}
  weaponFxTick(dt);
""")
rep("b.g.scale.setScalar(0.5+k*4)","b.g.scale.setScalar(0.5+k*(b.r||4))")

# ---------- weapon melee: all area attacks
between("function melee(){","function surge(){","""function melee(){if(state!=='playing'||meleeCd>0||veh)return;const W=WPN[guns[weapon].k],M=W.mel;meleeMax=meleeCd=M.cd*(cls===0?.85:1);meleeA=0.2;
  cam.getWorldDirection(tmp);tmp.y=0;tmp.normalize();const k=(cls===0?1.4:1)*(1+0.1*(power()-1));
  const arc=(range,cos,dmg,kb,up=0,el=-1)=>{for(const e of enemies){if(e.dying)continue;tmp2.copy(e.pos).sub(eye);const d=tmp2.length()||1;tmp2.y=0;const hd=tmp2.length()||1;
      if(d<range+e.r&&tmp2.dot(tmp)/hd>cos&&los(eye,e.pos)){if(kb&&(e.type<3||e.type>=5)){e.pos.addScaledVector(tmp2,kb*(e.type===6?.35:1)/hd);if(up&&e.type>=5)e.vy=up}damage(e,dmg,el);sparkle(e.pos,0xffffff,4,4)}}};
  const slash=(col,r0,dr,dur=.35)=>{const m=bas({color:col,transparent:true,opacity:.9,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}),g=new T.Mesh(new T.RingGeometry(1.3,2.1,32,1,0,Math.PI*.9),m);g.position.set(0,0,-1.6);cam.add(g);camFx.push({g,m,t:0,d:dur,r0,dr})};
  const feet=new T.Vector3(pos.x,pos.y,pos.z);
  switch(M.kind){
    case'sword':swordT=.45;sfx('sword');slash(0xff8a3a,.4,-2.6);fxq.push({t:.12,fn:()=>{arc(5.5,-.1,13*k,2.5,0,2)}});break;
    case'whip':sfx('whip');ringFx(feet,5.5,0xc9a6ff);arc(5.5,-1.1,5*k,3,0,1);break;
    case'punch':sfx('melee');ringFx(new T.Vector3(eye.x+tmp.x*2.5,pos.y,eye.z+tmp.z*2.5),4.5,0xffd27a);arc(6.5,.45,7*k,5);break;
    case'dash':sfx('jet');dashT=.24;dashV.copy(tmp).multiplyScalar(34);dashDmg=6*k;dashHit.clear();slash(0xffe6b0,1.57,0,.25);break;
    case'stomp':sfx('boom');ringFx(feet,7,0xffb238);if(!reduced)shake=Math.max(shake,.2);arc(7,-1.1,6*k,2,8,2);break;
    case'charge':sfx('jet');dashT=.34;dashV.copy(tmp).multiplyScalar(26);dashDmg=9*k;dashHit.clear();slash(0xc9a6ff,1.57,0,.34);break}}
""")
# shields block gun shots (not explosions or melee)
rep("function damage(e,n,el=-1,crit=false){","function damage(e,n,el=-1,crit=false,shot=false){")
rep("if(e.type===10&&(el===0||el===1)&&!((e.burst||0)>0))","if(e.type===10&&shot&&!((e.burst||0)>0))")
# slow from the stun grenade
rep("let mx,mz,sp=e.spd;","let mx,mz,sp=e.spd*((e.slowT=(e.slowT||0)-dt)>0?.35:1);")
rep("if(go){p.x+=mx*e.spd*dt;","if(go){const sl=(e.slowT=(e.slowT||0)-dt)>0?.35:1;p.x+=mx*e.spd*sl*dt;")
rep("p.y+=my*e.spd*dt;p.z+=mz*e.spd*dt}","p.y+=my*e.spd*sl*dt;p.z+=mz*e.spd*sl*dt}")

# ---------- update: firing, spin-up, reload tick
rep("  if((firing||padFire)&&fireCd<=0&&(weapon===1||!over))fire();",
    "  {const Wf=WPN[guns[weapon].k],tr=(firing||padFire)&&!veh;if(Wf.spin)spinV=tr&&reloadT<=0?Math.min(1,spinV+dt*1.4):Math.max(0,spinV-dt*1.2);\n   if(reloadT>0){reloadT-=dt;if(reloadT<=0)finishReload()}swordT=Math.max(0,swordT-dt);\n   if((firing||padFire)&&fireCd<=0&&reloadT<=0&&(Wf.mode!=='heat'||!over))fire()}")
rep("function swap(w){if(state!=='playing'||time-swapT<0.25)return;swapT=time;weapon=w===undefined?1-weapon:w;",
    "function swap(w){if(state!=='playing'||time-swapT<0.25)return;swapT=time;weapon=w===undefined?1-weapon:w;reloadT=0;spinV=0;")

# ---------- input: reload key, controller, touch
rep("else if(c==='KeyE')toggleVeh();","else if(c==='KeyE')toggleVeh();else if(c==='KeyR')startReload();")
rep("if(hit(2))toggleVeh();","if(hit(2)){if(veh||vehs.some(v=>Math.hypot(v.pos.x-pos.x,v.pos.z-pos.z)<5))toggleVeh();else startReload()}")
rep('<div class="pad" id="pad" hidden><button type="button" data-act="ride">Ride</button>','<div class="pad" id="pad" hidden><button type="button" data-act="ride">Ride</button><button type="button" data-act="reload">Reload</button>')
rep("else if(act==='ride')toggleVeh();","else if(act==='ride')toggleVeh();else if(act==='reload')startReload();")

# ---------- view models: rifle, sidearm, launcher, rotary cannon, energy blade
rep("const muzzle=new T.Object3D();muzzle.position.set(0,.01,-.92);vm.add(muzzle);","""// Rook Rifle: light plated assault rifle, rail, holo sight, vented handguard, separate magazine
const arG=new T.Group();vm.add(arG);
arG.add(VK(a=>{const L=MAT.plate,D=MAT.gunD,O=MAT.accent;a(GEO.box,L,.15,.17,.56,0,0,.06);a(GEO.box,D,.13,.08,.5,0,-.11,.08);a(GEO.box,D,.16,.035,.7,0,.105,-.04);
  for(let i=0;i<12;i++)a(GEO.box,D,.17,.02,.025,0,.13,-.36+i*.06);a(GEO.box,L,.13,.13,.42,0,-.01,-.42);for(let i=0;i<5;i++)for(const s of[-1,1])a(GEO.box,D,.006,.05,.05,s*.066,-.01,-.28-i*.075);
  a(GEO.box,O,.135,.03,.4,0,.055,-.42);a(GEO.cyl,D,.028,.3,.028,0,0,-.74,1.571,0,0);a(GEO.box,D,.07,.07,.11,0,0,-.9);for(const s of[-1,1])a(GEO.box,D,.075,.02,.06,0,s*.025,-.9);
  a(GEO.box,D,.09,.2,.11,0,-.22,.2,-.3,0,0);a(GEO.box,D,.11,.11,.24,0,-.03,.45);a(GEO.box,L,.1,.17,.08,0,-.04,.56);a(GEO.box,D,.05,.06,.1,0,.16,-.02);
  a(GEO.box,D,.09,.08,.012,0,.21,-.06);a(GEO.box,D,.09,.08,.012,0,.21,.02);a(GEO.box,D,.01,.08,.09,-.045,.21,-.02);a(GEO.box,D,.01,.08,.09,.045,.21,-.02);
  a(GEO.box,D,.03,.03,.05,.08,.03,.1);a(GEO.box,D,.06,.1,.04,0,-.14,-.5);armsKit(a,-.42)}));
const arMag=J(arG,0,-.17,-.06);arMag.add(VK(a=>{a(GEO.box,MAT.gunD,.07,.26,.12,0,-.1,0,.18,0,0);a(GEO.box,MAT.accent,.072,.03,.122,0,-.21,-.02,.18,0,0)}));
arG.add(mesh(GEO.ring,reticleMat,.025,.025,.025,0,.21,-.02));
// Wren Sidearm: compact plated pistol with a serrated slide, held two-handed
const piG=new T.Group();vm.add(piG);
piG.add(VK(a=>{const L=MAT.plate,D=MAT.gunD,O=MAT.accent;a(GEO.box,L,.12,.09,.48,0,.06,-.06);for(let i=0;i<6;i++)for(const s of[-1,1])a(GEO.box,D,.004,.06,.012,s*.061,.06,.12-i*.025);
  a(GEO.box,O,.124,.015,.3,0,.105,-.12);a(GEO.box,D,.11,.07,.4,0,-.02,-.04);a(GEO.box,D,.1,.24,.12,0,-.17,.12,-.25,0,0);a(GEO.box,D,.03,.06,.07,0,-.09,0);
  a(GEO.cyl,D,.022,.06,.022,0,.06,-.33,1.571,0,0);a(GEO.box,D,.02,.03,.02,0,.12,-.26);a(GEO.box,D,.05,.03,.02,0,.12,.14);a(GEO.box,O,.02,.02,.015,0,.14,.14);
  a(GEO.box,MAT.glove,.11,.12,.13,.02,-.21,.18);a(GEO.box,MAT.glove,.11,.1,.12,-.07,-.19,.15);a(GEO.box,MAT.sleeve,.13,.12,.14,.04,-.31,.26,.5,0,0);a(GEO.box,MAT.sleeve,.12,.11,.14,-.1,-.3,.25,.4,.3,0)}));
const piMag=J(piG,0,-.27,.15);piMag.add(VK(a=>a(GEO.box,MAT.gunD,.085,.06,.1,0,-.02,0,-.25,0,0)));
// Mule Launcher: drum-fed grenade launcher with a fat tube and foregrip
const glG=new T.Group();vm.add(glG);
glG.add(VK(a=>{const L=MAT.plate,D=MAT.gunD,O=MAT.accent;a(GEO.box,D,.14,.15,.5,0,0,.15);a(GEO.cyl,L,.075,.62,.075,0,.05,-.4,1.571,0,0);a(GEO.cyl,D,.085,.08,.085,0,.05,-.72,1.571,0,0);
  a(GEO.cyl,O,.08,.03,.08,0,.05,-.62,1.571,0,0);a(GEO.box,D,.03,.1,.5,0,.15,-.3);a(GEO.box,D,.1,.22,.12,0,-.2,.25,-.3,0,0);a(GEO.box,D,.08,.16,.08,0,-.14,-.42);
  a(GEO.box,L,.12,.13,.2,0,0,.48);a(GEO.box,D,.06,.06,.12,0,.21,-.05);for(const s of[-1,1])a(GEO.box,O,.006,.05,.3,s*.072,0,.15);armsKit(a,-.42)}));
const glDrum=J(glG,0,-.02,-.08);glDrum.add(VK(a=>{a(GEO.cyl,MAT.gunD,.17,.26,.17,0,0,0,1.571,0,0);for(let i=0;i<6;i++){const r=i/6*6.283;a(GEO.cyl,MAT.accent,.04,.27,.04,Math.cos(r)*.11,Math.sin(r)*.11,0,1.571,0,0)}}));
// Harrow Cannon: six-barrel rotary cannon with a carry handle and side ammo box
const caG=new T.Group();vm.add(caG);
caG.add(VK(a=>{const L=MAT.plate,D=MAT.gunD,O=MAT.accent;a(GEO.box,L,.22,.22,.46,0,0,.12);a(GEO.box,O,.225,.04,.3,0,.08,.12);a(GEO.cyl,D,.12,.12,.12,0,0,-.16,1.571,0,0);
  a(GEO.box,D,.06,.03,.3,0,.2,.05);a(GEO.box,D,.04,.1,.04,0,.14,-.08);a(GEO.box,D,.04,.1,.04,0,.14,.18);a(GEO.box,D,.1,.22,.12,0,-.22,.28,-.3,0,0);
  for(let i=0;i<4;i++)a(GEO.box,D,.23,.01,.06,0,-.06+i*.04,.3);armsKit(a,-.18)}));
const caSpin=J(caG,0,0,-.2);caSpin.add(VK(a=>{for(let i=0;i<6;i++){const r=i/6*6.283;a(GEO.cyl,MAT.gunD,.022,.62,.022,Math.cos(r)*.06,Math.sin(r)*.06,-.3,1.571,0,0)}
  a(GEO.cyl,MAT.gunD,.1,.03,.1,0,0,-.42,1.571,0,0);a(GEO.cyl,MAT.gunD,.1,.03,.1,0,0,-.58,1.571,0,0);a(GEO.cyl,MAT.accent,.1,.015,.1,0,0,-.5,1.571,0,0)}));
const caBox=J(caG,-.17,-.06,.12);caBox.add(VK(a=>{a(GEO.box,MAT.gunD,.12,.18,.22);a(GEO.box,MAT.accent,.122,.03,.222,0,.06,0)}));
// energy blade summoned by the Arc Welder's melee
const swordG=new T.Group();vm.add(swordG);swordG.visible=false;
swordG.add(VK(a=>{a(GEO.box,MAT.gunD,.05,.05,.24,0,0,.14);a(GEO.box,MAT.accent,.16,.04,.04,0,0,.02);a(GEO.box,MAT.glove,.11,.12,.13,0,-.04,.18);a(GEO.box,MAT.sleeve,.13,.12,.16,.02,-.12,.3,.5,0,0)}));
{const bm=bas({color:0xff8a3a,transparent:true,opacity:.95,blending:T.AdditiveBlending,depthWrite:false});swordG.add(mesh(GEO.box,bm,.03,.08,1.1,0,0,-.55),mesh(GEO.box,bas({color:0xfff0d0}),.012,.025,1.08,0,0,-.55),glow(0xff8a3a,1.4,.6))}
const VMG=[arcG,lanG,arG,piG,glG,caG],MAGP={2:arMag,3:piMag,4:glDrum,5:caBox},MAGY={2:-.17,3:-.27,4:-.02,5:-.06};
const muzzle=new T.Object3D();muzzle.position.set(0,.01,-.92);vm.add(muzzle);""")
between("    vm.position.set(0.075+Math.sin(bob)*0.004*bo-sw*0.05,","    emitMat.color.setRGB(","""    const K=guns[weapon].k,Wc=WPN[K],rl=reloadT>0?Math.sin((1-reloadT/reloadDur)*Math.PI):0,sws=swordT>0;
    vm.position.set(0.075+Math.sin(bob)*0.004*bo-sw*0.05,-0.07-Math.abs(Math.cos(bob))*0.004*bo-rl*.03,-0.2+recoil*0.012-sw*0.07);
    vm.rotation.set(recoil*0.04+rl*.35,sws?0:sw*0.5,rl*.45);
    for(let i=0;i<VMG.length;i++)VMG[i].visible=!sws&&i===K;swordG.visible=sws;
    if(sws){const ph=1-swordT/.45;swordG.rotation.set(-.25,1.15-ph*2.5,-.5+ph*.3);swordG.position.set(.12-ph*.2,-.02,-.05)}
    for(const k in MAGP){const mp=MAGP[k],ph=reloadT>0&&+k===K?1-reloadT/reloadDur:1;mp.position.y=MAGY[k]-(ph<.35?ph/.35:ph<.65?1:1-(ph-.65)/.35)*.35;mp.visible=!(ph>.35&&ph<.65)}
    glDrum.rotation.z+=(drumAng-glDrum.rotation.z)*Math.min(1,dt*12);caSpin.rotation.z+=dt*spinV*40;
    arcSpin.rotation.z+=dt*((firing||padFire)&&K===0&&!over?22:1.2);const pr=K===1?Math.min(1,recoil*.6)*.03:0;lanTop.position.y=.055+pr;lanBot.position.y=-.055-pr;
    lanCore.scale.x=.02*(1+(flash>0&&K===1?Math.random()*1.5:0));muzzle.position.z=Wc.mz;mglow.position.z=Wc.mz-.02;
""")
# ---------- HUD
between("  const lance=weapon===1,hb=$('heat');","  {const el=$('veh');","""  {const G=guns[weapon],W=WPN[G.k],hb=$('heat'),isH=W.mode==='heat';$('wname').textContent=W.short;$('wname').style.color=RAR[G.rar].c;
   hb.firstElementChild.style.width=(isH?heat:G.mag/W.mag*100)+'%';hb.classList.toggle('over',isH&&over);hb.classList.toggle('lance',!isH);
   $('ammo').textContent=reloadT>0?'RELOADING':isH?'':G.mag+' / '+(W.inf?'∞':G.res);$('cross').classList.toggle('hot',isH&&over);
   chip('cG',1-grenCd/grenMax,W.gren.n);chip('cM',1-meleeCd/meleeMax,W.mel.n);chip('cS',superQ/100)}
""")
rep("function chip(id,v){","function chip(id,v,lab){if(lab){const c=$(id);if(c.firstChild.nodeValue!==lab)c.firstChild.nodeValue=lab}")
rep(".hud .lab{width:38px;",".hud .lab{min-width:38px;")
# ---------- sounds
rep("  else if(k==='beep')tone(","""  else if(k==='ar'){tone('square',520,180,.05,.035);tone('sawtooth',220,90,.04,.02)}
  else if(k==='pistol'){tone('square',700,160,.08,.05);tone('triangle',300,80,.08,.04)}
  else if(k==='gl')tone('triangle',180,70,.22,.08);
  else if(k==='cannon')tone('sawtooth',360,200,.03,.025);
  else if(k==='reload'){tone('square',300,280,.05,.04);tone('square',500,480,.05,.04,.25)}
  else if(k==='sword'){tone('sawtooth',900,300,.25,.06);tone('sine',1600,600,.2,.04)}
  else if(k==='whip')tone('sawtooth',1200,200,.18,.05);
  else if(k==='beep')tone(""")
# ---------- loadout picker on the menu, and controls text
rep('<div class="classes" id="classes"></div>','<div class="classes" id="classes"></div>\n    <div class="loadout" id="loadout"></div>')
rep(".pad{position:absolute",""".loadout{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:100%;max-width:480px}
.loadout button{padding:5px 4px;font-size:10px;letter-spacing:.06em;color:var(--dim)}
.loadout button[aria-pressed="true"]{border-color:var(--amber);color:var(--fg);background:#20190e}
.pad{position:absolute""")
rep("$('classes').hidden=true","$('classes').hidden=true;$('loadout').hidden=true")
rep("$('classes').hidden=false","$('classes').hidden=false;$('loadout').hidden=false")
rep("function syncCls(){","""for(let sl=0;sl<2;sl++)for(const k of POOL[sl]){const b=document.createElement('button');b.type='button';b.textContent=WPN[k].name;b.dataset.k=k;b.dataset.sl=sl;
  b.addEventListener('click',()=>{LOAD[sl]=k;try{localStorage.setItem('gh9-load',JSON.stringify(LOAD))}catch(e){}syncLoad()});$('loadout').appendChild(b)}
function syncLoad(){for(const b of $('loadout').children)b.setAttribute('aria-pressed',LOAD[+b.dataset.sl]===+b.dataset.k)}syncLoad();
function syncCls(){""")
between('<p class="keys" id="ovKeys">','<div class="classes"','<p class="keys" id="ovKeys">WASD move (auto sprint) · Space jump, again in the air for your class move · click fire · R reload · Q swap<br>G grenade · F melee: every gun has its own · X surge · E vehicle · P pause · controller and phone supported<br>Pick a class, then a primary and a heavy weapon</p>\n    ')
open(p,'w').write(s);print('ok',len(s))
