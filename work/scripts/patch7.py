p='index.html';s=open(p).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]

# ---------- html / css
rep('<div class="hint" id="hint" hidden>','<div class="vh" id="veh" hidden></div>\n  <div class="hint" id="hint" hidden>')
rep(".hint{position:absolute;",".vh{position:absolute;left:0;right:0;bottom:30px;text-align:center;font-family:var(--display);font-weight:700;font-size:13px;letter-spacing:.14em;color:var(--amber);text-shadow:0 1px 0 #000;pointer-events:none}\n.hint{position:absolute;")
rep('<div class="pad" id="pad" hidden>','<div class="pad" id="pad" hidden><button type="button" data-act="ride">Ride</button>')
rep("Q swap weapon · G or right-click grenade · F melee · X surge · P pause","Q swap weapon · G or right-click grenade · F melee · X surge · P pause<br>E enters or leaves a vehicle · rover: WASD drive, Space brake · skiff: W/S throttle, mouse steers, A/D turn")
rep("else if(act==='jump')jumpQ=true;else surge();","else if(act==='jump')jumpQ=true;else if(act==='ride')toggleVeh();else surge();")
rep("else if(c==='KeyX')surge();","else if(c==='KeyX')surge();else if(c==='KeyE')toggleVeh();")

# ---------- scale
rep("const A=110,boxes=[]","const A=350,boxes=[]")
rep("for(let i=-10;i<=10;i++)for(const sg of[-1,1]){box(i*11,1,","for(let i=-10;i<=10;i++)for(const sg of[-1,1]){box(i*A/10,1,")
rep("box(sg*(A+0.25),1,i*11,0.25,2.3,0.25,MAT.metal,false)}","box(sg*(A+0.25),1,i*A/10,0.25,2.3,0.25,MAT.metal,false)}")
rep("wireframe:true,fog:false}),240,240,240,0,-70,0)","wireframe:true,fog:false}),A*2.2,A*2.2,A*2.2,0,-A*0.6,0)")
rep("scene.fog=new T.Fog(lin(0x0e2a36),90,430);","scene.fog=new T.Fog(lin(0x0e2a36),150,980);")
rep("const R=3000,TL=0.75,PY=-(R+260)*Math.cos(TL),PZ=(R+260)*Math.sin(TL),","const R=9000,TL=0.75,PY=-(R+780)*Math.cos(TL),PZ=(R+780)*Math.sin(TL),")
rep("R+42,R+42,R+42));","R+126,R+126,R+126));")
rep("R+14,R+14,R+14);","R+42,R+42,R+42);")
rep("if(Math.abs(x)<4&&z<46)continue;","if(Math.abs(x)<8)continue;")

# ---------- materials
rep("MAT.lily=std(","""{const po=(m,f)=>{m.polygonOffset=true;m.polygonOffsetFactor=f;m.polygonOffsetUnits=f;m.userData.noShadow=true;return m};po(MAT.water,-2);
 MAT.road=po(std({color:0x1b2326,roughness:0.85,metalness:0.2}),-2);MAT.line=po(bas({color:0xb87a22}),-4);MAT.mark=po(bas({color:0xaab8b4}),-4)}
MAT.pane.side=T.DoubleSide;
MAT.armor=std({color:0x2f5560,roughness:0.45,metalness:0.6});MAT.armorD=std({color:0x16272c,roughness:0.5,metalness:0.6});
MAT.tire=std({color:0x0e1416,roughness:0.9});MAT.canopy=std({color:0x0d2a33,roughness:0.05,metalness:1});
MAT.lily=std(""")

# ---------- outer world
rep("flush();\nfor(const q of PADS){","""// ---- the outer deck: roads, airstrip, fields, groves, domes, outposts
const GLOWS=[];
{const road=(x,z,w,d)=>{box(x,0,z,w,0.05,d,MAT.road,false);if(w>d)box(x,0.02,z,w,0.05,0.35,MAT.line,false);else box(x,0.02,z,0.35,0.05,d,MAT.line,false)};
 road(0,116,10,24);
 for(const sg of[-1,1]){road(0,128*sg,266,10);road(128*sg,0,10,266);road(0,214*sg,10,162);road(214*sg,0,162,10);road(0,300*sg,610,10);road(300*sg,0,10,610)}
 for(const d of[150,190,230,270])for(const[x,z]of[[7,-d],[7,d],[-d,7],[d,7]]){box(x,0,z,0.5,9,0.5,MAT.metal);blob(GEO.sph,MAT.strip,0.45,0.45,0.45,x,9.3,z);GLOWS.push([x,9.3,z,0x8fe6ff,5,0.6])}
 // airstrip
 box(235,0,-70,190,0.06,18,MAT.road,false);road(140,-33,10,56);
 for(let i=0;i<9;i++)box(158+i*20,0.03,-70,8,0.05,0.5,MAT.mark,false);for(const x of[143,327])for(let k=-3;k<=3;k++)box(x,0.03,-70+k*2.2,4,0.05,0.9,MAT.mark,false);
 for(let x=140;x<=330;x+=19)for(const z of[-79.6,-60.4])GLOWS.push([x,0.4,z,0x8fe6ff,2.4,0.8]);
 box(141,0,-98,1,7,16,MAT.hull);box(159,0,-98,1,7,16,MAT.hull);box(150,0,-106,19,7,1,MAT.hull);box(150,7,-98,19,0.5,17,MAT.metal);box(150,6.88,-89.6,19.1,0.12,0.2,MAT.amber,false);
 box(172,0,-98,5,14,5,MAT.hull);box(172,14,-98,7,3,7,MAT.glass);box(172,17,-98,7.6,0.3,7.6,MAT.metal);GLOWS.push([172,18.5,-98,0xff5a5a,5,0.8]);
 for(let i=0;i<8;i++)box(188+i*7,0,-97-hash(i,71)*4,3+hash(i,72)*2,1+Math.floor(hash(i,73)*3),2.4,i%2?MAT.crateA:MAT.crateB);
 // crop fields
 for(const[cx,cz,w,d]of[[-215,-70,110,90],[-215,70,110,90],[215,75,110,90],[-70,-215,90,110],[70,-215,90,110],[-70,215,90,110],[70,215,90,110]]){const ax=w>d,n=Math.floor((ax?d:w)/2.6);
   for(let i=0;i<n;i++){const o=(i-(n-1)/2)*2.6,h=0.35+hash(i,cx+cz|0)*0.3,m=i%2?MAT.leaf:MAT.leafD;if(ax)box(cx,0,cz+o,w,h,1.3,m,false);else box(cx+o,0,cz,1.3,h,d,m,false)}}
 // groves
 {let k=200;for(const[cx,cz]of[[165,165],[-165,165],[-165,-165],[165,-165],[-255,35],[255,-35],[35,255],[-35,-255]])for(let i=0;i<7;i++){const a=i*0.9+hash(k,5)*2,r=3+hash(k,6)*8;tree(cx+Math.cos(a)*r,cz+Math.sin(a)*r,k++)}}
 // greenhouse domes
 const capG=new T.SphereGeometry(1,32,12,0,6.283,0,1.571),ringG=new T.TorusGeometry(1,0.02,6,48);ringG.rotateX(Math.PI/2);
 {let k=300;for(const[cx,cz]of[[-200,160],[200,160],[-200,-160],[200,-160]]){blob(capG,MAT.pane,16,16,16,cx,0,cz);blob(ringG,MAT.amber,16,16,16,cx,0.3,cz);blob(ringG,MAT.metal,11.3,16,11.3,cx,11.3,cz);
   tree(cx,cz,k++);tree(cx+6,cz+5,k++);tree(cx-6,cz+4,k++);planter(cx,0,cz-8,10,1.6);box(cx+7,0,cz-4,2,2.5,2,MAT.glass);GLOWS.push([cx,8,cz,0xffb238,12,0.25])}}
 // outposts
 let oi=0;for(const sx of[-1,1])for(const sz of[-1,1]){const cx=240*sx,cz=240*sz,i=oi++;
   box(cx,0,cz-12,16,6,10,MAT.hull);box(cx,6,cz-12,12,2.5,7,MAT.glass);box(cx,5.88,cz-12,16.12,0.12,10.12,MAT.amber,false);box(cx,8.5,cz-12,13,0.3,8,MAT.metal);
   box(cx-16,0,cz+2,8,4,12,MAT.hull);box(cx+16,0,cz+2,8,4,12,MAT.hull);box(cx-13,0,cz+18,14,3,1,MAT.vine);box(cx+13,0,cz+18,14,3,1,MAT.vine);
   for(let k=0;k<6;k++)box(cx-6+hash(k,i*7+1)*12,0,cz+3+hash(k,i*7+2)*11,2+hash(k,i*7+3)*1.5,1+Math.floor(hash(k,i*7+4)*2),2,k%2?MAT.crateA:MAT.crateB);
   box(cx+10,0,cz-20,0.6,18,0.6,MAT.metal);blob(GEO.sph,MAT.strip,0.7,0.7,0.7,cx+10,18.5,cz-20);GLOWS.push([cx+10,18.5,cz-20,0x8fe6ff,7,0.8]);
   pad(cx-11,0,cz-4,18.5);planter(cx,0,cz+24,10,1.6)}
}
flush();
for(const[x,y,z,c,sz,o]of GLOWS){const gl=glow(c,sz,o);gl.position.set(x,y,z);scene.add(gl)}
for(const q of PADS){""")

# ---------- collision helper
rep("function pushOut(o,r){","function pushOut(o,r,free){")
rep("  if(o.y<r)o.y=r;const L=A-0.1-r;","  if(free)return;if(o.y<r)o.y=r;const L=A-0.1-r;")

# ---------- troopers
rep("function model(type){const g=new T.Group();let wings=[];","function model(type){const g=new T.Group();let wings=[],legs=null;")
rep("  else{g.add(mesh(GEO.sph,MAT.violet,0.9,0.8,1));","""  else if(type===5){g.add(mesh(GEO.box,MAT.armor,0.72,0.8,0.46,0,0.25,0),mesh(GEO.box,MAT.armorD,0.44,0.38,0.42,0,0.86,0.02),mesh(GEO.box,MAT.eyeA,0.36,0.1,0.06,0,0.88,0.24),
      mesh(GEO.box,MAT.armorD,0.2,0.2,0.8,0.46,0.32,0.28),mesh(GEO.box,MAT.amber,0.08,0.08,0.1,0.46,0.32,0.7),mesh(GEO.box,MAT.armorD,0.18,0.56,0.2,-0.46,0.2,0),mesh(GEO.box,MAT.armorD,0.5,0.5,0.22,0,0.3,-0.32));
    legs=[];for(const sx of[-0.2,0.2]){const L=new T.Group();L.position.set(sx,-0.15,0);L.add(mesh(GEO.box,MAT.armor,0.24,0.75,0.28,0,-0.375,0),mesh(GEO.box,MAT.armorD,0.26,0.12,0.4,0,-0.69,0.06));g.add(L);legs.push(L)}}
  else{g.add(mesh(GEO.sph,MAT.violet,0.9,0.8,1));""")
between("  const gl=type===0?glow(0xff3b3b","const ER=","""  const gl=type===0?glow(0xff3b3b,1.1,0.9):type===1?glow(0x9dff7a,1.5,0.8):type===5?glow(0xffb238,0.9,0.7):glow(0xffb238,2.4,0.8);
  gl.position.set(0,type===5?0.88:type===2?0.12:0.02,type===5?0.3:type===2?1.02:0.5);g.add(gl);
  return{g,wings,parts,legs}}
""")
rep("const ER=[0.5,0.55,1.0,3,0.7];","const ER=[0.5,0.55,1.0,3,0.7,0.9];")
rep("  else Object.assign(e,{hp:16*k,spd:4,cd:0.8,ph:Math.random()*6});","""  else if(type===5)Object.assign(e,{hp:3*k,spd:3.6+Math.min(w*0.1,1.2),cd:1+Math.random()*1.5,ph:Math.random()*6,vy:0,burst:0,bt:0,stuck:0,hops:0,mv:0,side:Math.random()<.5?-1:1,legs:m.legs});
  else Object.assign(e,{hp:16*k,spd:4,cd:0.8,ph:Math.random()*6});""")
between("function spawnAt(type,t=0){","const pickType=","""function spawnPos(){let x=0,z=0;for(let k=0;k<8;k++){const a=Math.random()*6.283,r=(veh?38:24)+Math.random()*(veh?26:10);x=clampA(pos.x+Math.cos(a)*r);z=clampA(pos.z+Math.sin(a)*r);if(Math.hypot(x-pos.x,z-pos.z)>16)break}return[x,z]}
function spawnAt(type,t=0){const[x,z]=spawnPos();queue.push({t,type,x,y:type===5?24+Math.random()*6:7+Math.random()*3,z})}
function trooperTick(e,dt){const p=e.pos,dx=eye.x-p.x,dy=eye.y-p.y,dz=eye.z-p.z,hd=Math.hypot(dx,dz)||1,d=Math.hypot(dx,dy,dz)||1;
  if(hd>170){const[x,z]=spawnPos();p.set(x,26,z);e.vy=0;return}
  e.cd-=dt;e.bt-=dt;e.vy-=19*dt;
  const see=d<70&&los(p,eye);let mx,mz;
  if(!see||hd>18){mx=dx/hd;mz=dz/hd}else if(hd<8){mx=-dx/hd;mz=-dz/hd}else{mx=-dz/hd*e.side*0.6;mz=dx/hd*e.side*0.6}
  const ox=p.x,oz=p.z,st=e.spd*dt;p.x+=mx*st;p.z+=mz*st;p.y+=e.vy*dt;
  const py=p.y;pushOut(p,e.r);const gr=p.y>py+1e-5;if(gr&&e.vy<0)e.vy=0;
  const moved=Math.hypot(p.x-ox,p.z-oz);e.mv=gr?1:0;
  if(gr){if(moved<st*0.4){e.stuck+=dt;if(e.stuck>0.5){e.stuck=0;e.hops=Math.min(e.hops+1,4);e.vy=7+e.hops*2.4;e.side=-e.side}}else{e.stuck=0;if(moved>st*0.9)e.hops=0}}
  if(see&&d<60){if(e.cd<=0){e.burst=3;e.cd=2+Math.random()*1.2}
    if(e.burst>0&&e.bt<=0){e.bt=0.15;e.burst--;const g=new T.Group();g.add(mesh(GEO.box,MAT.eyeA,0.07,0.07,0.7),glow(0xffb238,0.8,0.8));g.position.set(p.x,p.y+0.3,p.z);
      const v=new T.Vector3(dx/d+(Math.random()-.5)*0.06,(dy-0.3)/d+(Math.random()-.5)*0.06,dz/d+(Math.random()-.5)*0.06).normalize();g.lookAt(p.x+v.x,p.y+0.3+v.y,p.z+v.z);scene.add(g);
      shots.push({g,v:v.multiplyScalar(30),t:3,dmg:5});sfx('bolt')}}}
""")
rep("const pickType=()=>wave>=2&&Math.random()<0.3?1:0;","const pickType=()=>{const r=Math.random();return r<0.4?5:wave>=2&&r<0.62?1:0};")
rep("if(!e.dying&&e.type<3)n++;return n};","if(!e.dying&&(e.type<3||e.type===5))n++;return n};")
rep("    if(e.type>=3){if(e.type===3)bossTick(e,dt);continue}","    if(e.type===5){trooperTick(e,dt);if(state!=='playing')return;continue}\n    if(e.type>=3){if(e.type===3)bossTick(e,dt);continue}")
rep("    let mx=dx/d,my=dy/d,mz=dz/d,go=true;e.cd-=dt;","    if(hd>170){const[x,z]=spawnPos();p.set(x,8,z);continue}\n    let mx=dx/d,my=dy/d,mz=dz/d,go=true;e.cd-=dt;")
rep("sparkle(e.pos,[0xffb238,0xff4fa3,0xc9a6ff,0xffb238,0x9dff7a][e.type]","sparkle(e.pos,[0xffb238,0xff4fa3,0xc9a6ff,0xffb238,0x9dff7a,0xffb238][e.type]")
rep("{if(e.type<3)e.pos.addScaledVector(tmp2,1.5/d);damage(e,k)}","{if(e.type<3||e.type===5)e.pos.addScaledVector(tmp2,1.5/d);damage(e,k)}")
rep("    rc.fillStyle=e.type===4?'#9dff7a':","    rc.fillStyle=e.type===5?'#ff8a5a':e.type===4?'#9dff7a':")
rep("    if(state!=='paused'){e.g.position.y+=Math.sin(time*4+e.ph)*0.004;","    if(e.type===5){const sw=Math.sin(time*9+e.ph)*0.7*e.mv;e.legs[0].rotation.x=sw;e.legs[1].rotation.x=-sw;e.g.rotation.y=Math.atan2(eye.x-e.pos.x,eye.z-e.pos.z);continue}\n    if(state!=='paused'){e.g.position.y+=Math.sin(time*4+e.ph)*0.004;")
rep("  else if(k==='spit')tone('sine',500,180,.15,.04);","  else if(k==='spit')tone('sine',500,180,.15,.04);\n  else if(k==='bolt')tone('square',720,300,.05,.03);")
rep("const hitP=Math.hypot(p.x-pos.x,p.z-pos.z)<0.5&&p.y>pos.y-0.1&&p.y<pos.y+PH+0.1;","const hitP=Math.hypot(p.x-pos.x,p.z-pos.z)<(veh?1.8:0.5)&&p.y>pos.y-0.1&&p.y<pos.y+PH+(veh?1:0.1);")
rep("if(hitP){hurt(12);if(state!=='playing')return}","if(hitP){hurt(s2.dmg||12);if(state!=='playing')return}")
rep("function hurt(n){shDelay=","function hurt(n){if(veh)n*=0.5;shDelay=")

# ---------- vehicles
rep("/* ---------- view model ---------- */","""/* ---------- vehicles ---------- */
let veh=null,camIdle=9,eng=null;const vehs=[];
const ad=(a,b)=>{let d=(a-b)%6.2831853;if(d>3.1415927)d-=6.2831853;if(d<-3.1415927)d+=6.2831853;return d},c1=v=>Math.max(-1,Math.min(1,v));
function shadowAll(g){g.traverse(o=>{if(o.isMesh)o.castShadow=true})}
function carModel(){const g=new T.Group();
  g.add(mesh(GEO.box,MAT.gun,1.9,0.45,3.7,0,-0.55,0),mesh(GEO.box,MAT.amber,1.94,0.1,3.74,0,-0.36,0),mesh(GEO.box,MAT.gunD,1.6,0.5,1.5,0,-0.08,0.75),mesh(GEO.box,MAT.gunD,1.5,0.3,1.1,0,-0.2,-1.15),
    mesh(GEO.box,MAT.gunD,0.08,0.9,0.08,-0.75,0.3,-0.05),mesh(GEO.box,MAT.gunD,0.08,0.9,0.08,0.75,0.3,-0.05),mesh(GEO.box,MAT.gunD,1.58,0.08,0.08,0,0.75,-0.05),
    mesh(GEO.box,MAT.gunD,0.08,0.08,1.5,-0.75,0.75,0.7),mesh(GEO.box,MAT.gunD,0.08,0.08,1.5,0.75,0.75,0.7),mesh(GEO.box,MAT.white,0.3,0.14,0.05,-0.6,-0.45,-1.87),mesh(GEO.box,MAT.white,0.3,0.14,0.05,0.6,-0.45,-1.87),
    mesh(GEO.box,MAT.eye,0.3,0.12,0.05,-0.6,-0.45,1.87),mesh(GEO.box,MAT.eye,0.3,0.12,0.05,0.6,-0.45,1.87));
  for(const[x,z]of[[-1.05,-1.25],[1.05,-1.25],[-1.05,1.3],[1.05,1.3]]){const w=mesh(GEO.cyl,MAT.tire,0.52,0.42,0.52,x,-0.78,z);w.rotation.z=Math.PI/2;g.add(w)}
  shadowAll(g);for(const x of[-0.6,0.6]){const q=glow(0xdffcff,1.4,0.6);q.position.set(x,-0.45,-1.95);g.add(q)}return g}
function planeModel(){const g=new T.Group(),nose=mesh(GEO.cone,MAT.amber,0.46,1,0.46,0,0,-3.7);nose.rotation.x=-Math.PI/2;
  g.add(mesh(GEO.sph,MAT.gun,0.75,0.7,3.4),nose,mesh(GEO.sph,MAT.canopy,0.5,0.42,1,0,0.42,-0.9),mesh(GEO.box,MAT.gun,9.5,0.12,1.6,0,-0.05,0.3),
    mesh(GEO.box,MAT.amber,0.15,0.5,1.7,-4.8,0.15,0.3),mesh(GEO.box,MAT.amber,0.15,0.5,1.7,4.8,0.15,0.3),mesh(GEO.box,MAT.gun,3.4,0.1,0.9,0,0.1,2.9),mesh(GEO.box,MAT.gunD,0.12,1.2,1.1,0,0.65,2.8),
    mesh(GEO.box,MAT.amber,9.52,0.05,0.2,0,0.02,-0.4));
  for(const sx of[-1,1]){const e=mesh(GEO.cyl,MAT.gunD,0.3,1.7,0.3,sx*1.8,-0.3,0.4);e.rotation.x=Math.PI/2;g.add(e,mesh(GEO.box,MAT.gunD,0.12,0.12,2.2,sx*0.8,-1.44,0),mesh(GEO.box,MAT.gunD,0.1,0.8,0.1,sx*0.8,-1,-0.6),mesh(GEO.box,MAT.gunD,0.1,0.8,0.1,sx*0.8,-1,0.6))}
  shadowAll(g);for(const sx of[-1,1]){const q=glow(0x8fe6ff,2,0.8);q.position.set(sx*1.8,-0.3,1.4);g.add(q)}return g}
function homeVeh(v){v.pos.set(v.home[0],v.r,v.home[1]);v.h=v.home[2];v.v=0;v.vy=0;v.p=0;v.roll=0;v.thr=0;v.lost=0;v.g.rotation.set(0,v.h,0)}
function addVeh(kind,x,z,h){const g=kind==='car'?carModel():planeModel();g.rotation.order='YXZ';scene.add(g);const v={kind,g,pos:g.position,r:kind==='car'?1.3:1.5,home:[x,z,h]};vehs.push(v);homeVeh(v)}
addVeh('car',3,22,Math.PI);addVeh('car',146,-50,-1.571);addVeh('plane',152,-70,-1.571);addVeh('plane',-200,215,-1.571);
for(const sx of[-1,1])for(const sz of[-1,1])addVeh('car',240*sx+5,240*sz+29,Math.PI);
function engineOff(){if(eng){try{eng.o.stop()}catch(e){}eng=null}}
function engineOn(){if(!ac||eng)return;try{const o=ac.createOscillator(),g=ac.createGain();o.type='sawtooth';o.frequency.value=50;g.gain.value=0;o.connect(g).connect(ac.destination);o.start();eng={o,g}}catch(e){}}
function toggleVeh(){if(state!=='playing')return;
  if(veh){const v=veh;veh=null;engineOff();pos.set(v.pos.x+Math.cos(v.h)*2.4,Math.max(0,v.pos.y-v.r),v.pos.z-Math.sin(v.h)*2.4);vy=0;pitch=0;if(v.kind==='car')v.v*=0.3;sfx('swap');return}
  let b=null,bd=5;for(const v of vehs){const d=Math.hypot(v.pos.x-pos.x,v.pos.y-v.r-pos.y,v.pos.z-pos.z);if(d<bd){bd=d;b=v}}
  if(b){veh=b;yaw=b.h;pitch=b.kind==='car'?-0.12:0;camIdle=9;sfx('swap');say(b.kind==='car'?'Rover':'Skiff',1)}}
function vehTick(dt){const v=veh,p=v.pos,car=v.kind==='car',boost=keys.ShiftLeft||keys.ShiftRight;
  let f=0,s=0;if(keys.KeyW)f+=1;if(keys.KeyS)f-=1;if(keys.KeyD)s+=1;if(keys.KeyA)s-=1;f=c1(f-mvY);s=c1(s+mvX);camIdle+=dt;
  if(car){if(keys.ArrowUp)f=1;if(keys.ArrowDown)f=-1;if(keys.ArrowRight)s=1;if(keys.ArrowLeft)s=-1;
    if(f>0)v.v+=22*f*dt;else if(f<0)v.v+=(v.v>0?42:14)*f*dt;else v.v-=Math.sign(v.v)*Math.min(Math.abs(v.v),5*dt);
    if(keys.Space||jumpQ)v.v-=Math.sign(v.v)*Math.min(Math.abs(v.v),48*dt);
    v.v=Math.max(-10,Math.min(boost?40:30,v.v));
    v.h-=s*1.9*dt*c1(v.v/9);v.roll+=(-s*Math.min(1,Math.abs(v.v)/25)*0.1-v.roll)*Math.min(1,dt*6);
    v.vy-=19*dt;const fx=-Math.sin(v.h),fz=-Math.cos(v.h),ox=p.x,oz=p.z;p.x+=fx*v.v*dt;p.z+=fz*v.v*dt;p.y+=v.vy*dt;
    const py=p.y;pushOut(p,v.r);if(p.y>py+1e-5)v.vy=0;
    const want=Math.abs(v.v)*dt;if(want>0.03&&Math.hypot(p.x-ox,p.z-oz)<want*0.55){if(Math.abs(v.v)>9){sfx('boom');if(!reduced)shake=Math.max(shake,0.15)}v.v*=0.4}
    if(Math.abs(v.v)>7)for(const e of enemies)if(!e.dying&&e.type!==3&&e.pos.distanceTo(p)<e.r+1.7){damage(e,5+Math.abs(v.v)*0.3);if(e.type!==4){e.pos.x+=fx*2;e.pos.z+=fz*2}v.v*=0.93}
    if(camIdle>1.2){yaw+=ad(v.h,yaw)*Math.min(1,dt*3);pitch+=(-0.12-pitch)*Math.min(1,dt*2)}
    v.g.rotation.set(0,v.h,v.roll)}
  else{if(keys.ArrowUp)pitch=Math.min(1.45,pitch+dt);if(keys.ArrowDown)pitch=Math.max(-1.45,pitch-dt);if(keys.ArrowRight)s=1;if(keys.ArrowLeft)s=-1;
    const deck=Math.abs(p.x)<A+1&&Math.abs(p.z)<A+1,onG=deck&&p.y<=v.r+0.02;
    v.thr=Math.max(0,Math.min(1,v.thr+f*0.7*dt));if(keys.Space)v.thr=Math.max(0,v.thr-1.5*dt);
    const tgt=v.thr*(boost?85:62);v.v+=(tgt-v.v)*Math.min(1,dt*(tgt>v.v?0.9:0.6));if(onG&&v.thr<0.05)v.v=Math.max(0,v.v-9*dt);
    yaw-=s*1.1*dt;let tp=pitch;if(onG)tp=v.v>21?Math.max(0,tp):0;
    const dh=ad(yaw,v.h),hr=(onG?Math.min(1,v.v/12):1)*1.7*dt;v.h+=Math.max(-hr,Math.min(hr,dh));
    v.p+=Math.max(-1.5*dt,Math.min(1.5*dt,tp-v.p));v.roll+=((onG?0:c1(dh*1.6)*0.9)-v.roll)*Math.min(1,dt*4);
    const cp=Math.cos(v.p),ox=p.x,oy=p.y,oz=p.z;p.x+=-Math.sin(v.h)*cp*v.v*dt;p.y+=Math.sin(v.p)*v.v*dt;p.z+=-Math.cos(v.h)*cp*v.v*dt;
    if(!onG&&v.v<17)p.y-=(17-v.v)*0.9*dt;
    const bx=p.x,by=p.y,bz=p.z;pushOut(p,v.r,true);if(Math.abs(p.x-bx)+Math.abs(p.y-by)+Math.abs(p.z-bz)>1e-4){v.v*=0.75;if(!reduced)shake=Math.max(shake,0.12)}
    if(Math.abs(p.x)<A+1&&Math.abs(p.z)<A+1&&p.y<v.r){if(oy>=v.r-0.3||deck){p.y=v.r;if(v.p<0)v.p*=0.5}else{p.x=ox;p.z=oz;v.v*=0.5}}
    const LIM=A+450;if(Math.abs(p.x)>LIM||Math.abs(p.z)>LIM||p.y>450||p.y<-120){p.x=Math.max(-LIM,Math.min(LIM,p.x));p.z=Math.max(-LIM,Math.min(LIM,p.z));p.y=Math.max(-120,Math.min(450,p.y));if(msgT<=0)say('Edge of the airspace',1.2)}
    for(const e of enemies)if(!e.dying&&e.type!==3&&e.pos.distanceTo(p)<e.r+2.4)damage(e,12);
    v.g.rotation.set(v.p,v.h,v.roll)}
  jumpQ=false;pos.set(p.x,p.y-v.r,p.z);eye.set(p.x,p.y+0.4,p.z);vy=0;ground=true;
  if(!eng)engineOn();if(eng){eng.o.frequency.value=45+Math.abs(v.v)*(car?3:2.4);eng.g.gain.value=muted?0:0.03*CFG.vol}}
function idleVehs(dt){for(const v of vehs){if(v===veh)continue;const p=v.pos;
  if(v.kind==='car'){if(v.v){v.v*=Math.max(0,1-3*dt);if(Math.abs(v.v)<0.3)v.v=0;p.x+=-Math.sin(v.h)*v.v*dt;p.z+=-Math.cos(v.h)*v.v*dt;pushOut(p,v.r)}}
  else{const deck=Math.abs(p.x)<A+1&&Math.abs(p.z)<A+1;
    if(!deck||p.y<v.r-0.5){v.lost+=dt;p.y-=20*dt;if(v.lost>3)homeVeh(v)}
    else if(p.y>v.r+0.01||v.v>0.1){v.vy-=19*dt;v.v*=Math.max(0,1-0.8*dt);p.x+=-Math.sin(v.h)*v.v*dt;p.z+=-Math.cos(v.h)*v.v*dt;p.y+=v.vy*dt;pushOut(p,v.r);
      if(p.y<=v.r+1e-3){v.vy=0;v.p*=0.8;v.roll*=0.8;v.v*=Math.max(0,1-4*dt)}v.g.rotation.set(v.p,v.h,v.roll)}}}}

/* ---------- view model ---------- */""")
rep("  // player\n  let f=0,s=0;","  // player\n  if(veh)vehTick(dt);else{\n  let f=0,s=0;")
rep("  eye.set(pos.x,pos.y+EYE,pos.z);\n  // weapon","  eye.set(pos.x,pos.y+EYE,pos.z)}\n  idleVehs(dt);\n  // weapon")
rep("document.addEventListener('mousemove',e=>{if(!locked||state!=='playing')return;","document.addEventListener('mousemove',e=>{if(!locked||state!=='playing')return;camIdle=0;")
rep("else if(t.identifier===lookId){look(","else if(t.identifier===lookId){camIdle=0;look(")
# fire from vehicles
rep("  cam.getWorldDirection(tmp);const o=[eye.x,eye.y,eye.z],d=[tmp.x,tmp.y,tmp.z],wall=rayBoxes(o,d,90);","  const org=veh?cam.position:eye;cam.getWorldDirection(tmp);const o=[org.x,org.y,org.z],d=[tmp.x,tmp.y,tmp.z],wall=rayBoxes(o,d,veh?170:90);")
rep("const end=lance?wall:hd;muzzle.getWorldPosition(tmp2);tmp.multiplyScalar(end).add(eye);","const end=lance?wall:hd;if(veh)tmp2.copy(veh.pos);else muzzle.getWorldPosition(tmp2);tmp.multiplyScalar(end).add(org);")
rep("const th=lance?0.03:0.012;","const th=(lance?0.03:0.012)*(veh?5:1);")
# camera
rep("  else{const sh=shake>0?shake*0.12:0;\n    cam.position.set(eye.x,","""  else if(veh){const car=veh.kind==='car',sh=shake>0?shake*0.08:0;cam.rotation.set(pitch+(Math.random()-.5)*sh,yaw+(Math.random()-.5)*sh,0);cam.getWorldDirection(tmp);
    cam.position.copy(veh.pos).addScaledVector(tmp,car?-7.5:-13);cam.position.y+=car?2.6:3.6;
    if(veh.pos.y>0&&cam.position.y<0.5&&Math.abs(cam.position.x)<A+2&&Math.abs(cam.position.z)<A+2)cam.position.y=0.5}
  else{const sh=shake>0?shake*0.12:0;
    cam.position.set(eye.x,""")
rep("  // camera\n","  vm.visible=state!=='menu'&&!veh;\n  // camera\n")
rep("vehicles","vehicles") if False else None
# state / reset / hud / radar / missions
rep("clear(blasts);clear(loots);clear(slams);clear(cores);mission=null;","clear(blasts);clear(loots);clear(slams);clear(cores);veh=null;engineOff();for(const v of vehs)homeVeh(v);mission=null;")
rep("$('pad').hidden=!(play&&touchUI);if(!play){","$('pad').hidden=!(play&&touchUI);if(!play){engineOff();")
rep("  $('hurt').style.opacity=Math.max(hurtA,","""  {const el=$('veh');let t='';const k=touchUI?'RIDE':'E';
    if(veh)t=(veh.kind==='car'?'ROVER · ':'SKIFF · ')+Math.round(Math.abs(veh.v)*3.6)+' KM/H'+(veh.kind==='car'?'':' · ALT '+Math.round(veh.pos.y)+' M')+' · '+k+' TO EXIT';
    else if(state==='playing')for(const v of vehs)if(Math.hypot(v.pos.x-pos.x,v.pos.y-v.r-pos.y,v.pos.z-pos.z)<5){t=k+' · '+(v.kind==='car'?'DRIVE THE ROVER':'FLY THE SKIFF');break}
    el.hidden=!t;if(t)el.textContent=t}
  $('hurt').style.opacity=Math.max(hurtA,""")
rep("  for(const t of targets()){const ex=t.x-pos.x,","""  rc.fillStyle='#8fe6ff';for(const v of vehs){if(v===veh)continue;const ex=v.pos.x-pos.x,ez=v.pos.z-pos.z;let fw=(ex*fx+ez*fz)*2.4,rt=(ex*-fz+ez*fx)*2.4;if(Math.hypot(fw,rt)<66)rc.fillRect(76+rt-3,76-fw-5,6,10)}
  for(const t of targets()){const ex=t.x-pos.x,""")
rep("const SITES=[","const SITES=[{n:'THE AIRSTRIP',x:200,y:0,z:-70},{n:'THE NORTH-EAST OUTPOST',x:240,y:0,z:-231},{n:'THE SOUTH-WEST OUTPOST',x:-240,y:0,z:249},{n:'THE NORTH-WEST DOME',x:-193,y:0,z:-152},")
rep("const CORE_SPOTS=[","const CORE_SPOTS=[[240,8.8,-252],[-240,8.8,228],[235,55,-70],[194,0,152],[0,0,300],[-300,0,0],[172,17.3,-98],")
rep("if(d<1.7&&Math.abs(pos.y-c.y)<2.2){","if(d<(veh?8:1.7)&&Math.abs(pos.y-c.y)<(veh?9:2.2)){")
open(p,'w').write(s)
print('ok',len(s))
