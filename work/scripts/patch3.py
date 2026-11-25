p='index.html';s=open(p).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:70]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:70]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]

rep("const SKY=0x0a1a22,scene=new T.Scene();scene.background=new T.Color(SKY);scene.fog=new T.Fog(SKY,28,100);",
"""const lowFx=portrait||matchMedia('(pointer: coarse)').matches;
renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
const lin=h=>new T.Color(h).convertSRGBToLinear();
const scene=new T.Scene();scene.background=lin(0x0c2030);scene.fog=new T.Fog(lin(0x0e2a36),32,125);""")
between("scene.add(new T.HemisphereLight","\n/* ---------- textures and materials","""scene.add(new T.HemisphereLight(0x9fcfff,0x1c3a2a,0.5));
const sun=new T.DirectionalLight(0xffd9a8,1.5);sun.position.set(28,46,14);sun.castShadow=true;
sun.shadow.mapSize.set(lowFx?1024:2048,lowFx?1024:2048);
{const c=sun.shadow.camera;c.left=-42;c.right=42;c.top=42;c.bottom=-42;c.near=5;c.far=130}
sun.shadow.bias=-0.0006;sun.shadow.normalBias=0.04;scene.add(sun);
""")
between("/* ---------- textures and materials ---------- */","/* ---------- world ---------- */","""/* ---------- textures and materials ---------- */
function hash(x,y){let n=(x*374761393+y*668265263)|0;n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296}
const ANISO=renderer.capabilities.getMaxAnisotropy();
function paint(size,fn,srgb=true){const c=document.createElement('canvas');c.width=c.height=size;fn(c.getContext('2d'),size);
  const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;if(srgb)t.encoding=T.sRGBEncoding;t.anisotropy=ANISO;return t}
function grime(g,S,n,a){for(let i=0;i<n;i++){const v=Math.random()>0.5?255:0;g.fillStyle=`rgba(${v},${v},${v},${Math.random()*a})`;
  g.fillRect(Math.random()*S,Math.random()*S,1+Math.random()*4,1+Math.random()*4)}}
function panels(g,S,base,n){g.fillStyle=base;g.fillRect(0,0,S,S);grime(g,S,3000,0.07);const p=S/n;
  for(let i=0;i<n;i++)for(let j=0;j<n;j++){const x=i*p,y=j*p;
    const gr=g.createLinearGradient(x,y,x,y+p);gr.addColorStop(0,'rgba(255,255,255,.10)');gr.addColorStop(1,'rgba(0,0,0,.16)');g.fillStyle=gr;g.fillRect(x+3,y+3,p-6,p-6);
    g.strokeStyle='rgba(0,0,0,.6)';g.lineWidth=3;g.strokeRect(x+1.5,y+1.5,p-3,p-3);
    g.strokeStyle='rgba(255,255,255,.18)';g.lineWidth=1;g.strokeRect(x+4.5,y+4.5,p-9,p-9);
    g.fillStyle='rgba(0,0,0,.55)';for(const[rx,ry]of[[11,11],[p-11,11],[11,p-11],[p-11,p-11]]){g.beginPath();g.arc(x+rx,y+ry,2.4,0,7);g.fill()}}}
const TX={
  hull:paint(256,(g,S)=>panels(g,S,'#5d8b93',2)),
  floor:paint(256,(g,S)=>{panels(g,S,'#3d5d5a',2);g.strokeStyle='rgba(255,178,56,.35)';g.lineWidth=2;g.strokeRect(20,20,S/2-40,S/2-40)}),
  vine:paint(256,(g,S)=>{panels(g,S,'#27413c',2);
    for(let k=0;k<6;k++){const x0=20+k*42;g.strokeStyle=k%2?'#3f9d4c':'#2f7d3e';g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(x0,-10);
      g.bezierCurveTo(x0+50,S*0.3,x0-50,S*0.6,x0+10,S+10);g.stroke();
      for(let i=0;i<16;i++){const t=i/16,y=t*S,x=x0+Math.sin(t*6.283)*26+(Math.random()-.5)*22;g.fillStyle=['#4fb85a','#3f9d4c','#62c96a'][i%3];
        g.beginPath();g.ellipse(x,y,9,4.5,Math.random()*3,0,7);g.fill()}}
    for(let i=0;i<10;i++){const x=24+hash(i,3)*208,y=24+hash(i,9)*208;g.fillStyle='#ff4fa3';
      for(let q=0;q<5;q++){g.beginPath();g.ellipse(x+Math.cos(q*1.257)*5,y+Math.sin(q*1.257)*5,4.5,4.5,0,0,7);g.fill()}
      g.fillStyle='#ffd27a';g.beginPath();g.arc(x,y,3,0,7);g.fill()}}),
  glass:paint(256,(g,S)=>{const gr=g.createLinearGradient(0,0,0,S);gr.addColorStop(0,'#ffd27a');gr.addColorStop(.6,'#ff9a2e');gr.addColorStop(1,'#a3470f');g.fillStyle=gr;g.fillRect(0,0,S,S);
    for(let i=0;i<60;i++){const x=hash(i,1)*S,h=40+hash(i,2)*120;g.strokeStyle=i%3?'#1c5a30':'#12401f';g.lineWidth=3+hash(i,4)*3;g.beginPath();g.moveTo(x,S);
      g.quadraticCurveTo(x+(hash(i,5)-.5)*40,S-h*0.6,x+(hash(i,6)-.5)*50,S-h);g.stroke()}
    g.fillStyle='#16262a';g.fillRect(0,0,S,10);g.fillRect(0,S-10,S,10);g.fillRect(0,0,10,S);g.fillRect(S-10,0,10,S);g.fillRect(S/2-4,0,8,S)}),
  metal:paint(128,(g,S)=>{g.fillStyle='#34454a';g.fillRect(0,0,S,S);grime(g,S,900,0.08);g.strokeStyle='rgba(0,0,0,.45)';g.lineWidth=2;
    for(let i=-S;i<S*2;i+=16){g.beginPath();g.moveTo(i,0);g.lineTo(i+S,S);g.stroke();g.beginPath();g.moveTo(i+S,0);g.lineTo(i,S);g.stroke()}}),
};
const glowTex=paint(64,(g,S)=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.22,'rgba(255,255,255,.55)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,S,S)});
const glowMats={};
function glow(color,size,op=0.8){const k=color+'|'+op,m=glowMats[k]||(glowMats[k]=new T.SpriteMaterial({map:glowTex,color,blending:T.AdditiveBlending,depthWrite:false,transparent:true,opacity:op,fog:false}));
  const sp=new T.Sprite(m);sp.scale.set(size,size,1);return sp}
const std=(o)=>{if(typeof o.color==='number')o.color=lin(o.color);if(typeof o.emissive==='number')o.emissive=lin(o.emissive);return new T.MeshStandardMaterial(o)},bas=(o)=>new T.MeshBasicMaterial(o);
const MAT={
  hull:std({map:TX.hull,bumpMap:TX.hull,bumpScale:0.02,roughness:0.55,metalness:0.45}),
  vine:std({map:TX.vine,bumpMap:TX.vine,bumpScale:0.03,roughness:0.8,metalness:0.1}),
  glass:std({map:TX.glass,emissive:0xffffff,emissiveMap:TX.glass,emissiveIntensity:0.85,roughness:0.25,metalness:0}),
  floor:std({map:TX.floor,bumpMap:TX.floor,bumpScale:0.015,roughness:0.42,metalness:0.5}),
  metal:std({map:TX.metal,roughness:0.5,metalness:0.7}),
  soil:std({color:0x3a2c1e,roughness:1}),amber:std({color:0xffb238,emissive:0xffb238,emissiveIntensity:0.45,roughness:0.4}),
  leaf:std({color:0x4fb85a,roughness:0.8,flatShading:true}),leafD:std({color:0x2f7d3e,roughness:0.8,flatShading:true}),
  bloom:std({color:0xff4fa3,emissive:0xff4fa3,emissiveIntensity:0.5,roughness:0.5}),dark:std({color:0x2a1c08,roughness:0.5,metalness:0.3}),
  eye:bas({color:0xff5a5a}),bulb:std({color:0xb02472,roughness:0.45}),core:bas({color:0xb6ff96}),
  violet:std({color:0x6a42b8,roughness:0.35,metalness:0.5}),violetD:std({color:0x3b2466,roughness:0.4,metalness:0.5}),eyeA:bas({color:0xffc04d}),white:bas({color:0xffffff}),
  wing:std({color:0xbfeeff,transparent:true,opacity:0.6,side:T.DoubleSide,roughness:0.2,depthWrite:false}),
  spore:bas({color:0xff8fc8}),charge:bas({color:0xb6ff96}),gel:std({color:0x7be36b,emissive:0x2c8a2c,roughness:0.4}),cell:std({color:0xc9a6ff,emissive:0x5a3aa0,roughness:0.4}),cap:std({color:0xdcebe4,roughness:0.4,metalness:0.5}),
  gun:std({color:0x5d8b93,roughness:0.3,metalness:0.75}),gunD:std({color:0x1c3034,roughness:0.5,metalness:0.6}),lance:std({color:0x6a42b8,roughness:0.3,metalness:0.7}),
};
MAT.drone=std({color:0xffb238,roughness:0.35,metalness:0.35});
const GEO={oct:new T.OctahedronGeometry(1),ico:new T.IcosahedronGeometry(1,1),box:new T.BoxGeometry(1,1,1),sph:new T.SphereGeometry(1,24,16),cone:new T.ConeGeometry(1,1,12),plane:new T.PlaneGeometry(1,1)};
const mesh=(g,m,sx,sy,sz,x=0,y=0,z=0)=>{const o=new T.Mesh(g,m);o.scale.set(sx,sy,sz);o.position.set(x,y,z);return o};

""")
rep("const m=new T.Mesh(g,mat);m.position.set(x,y+h/2,z);scene.add(m);","const m=new T.Mesh(g,mat);m.castShadow=m.receiveShadow=true;m.position.set(x,y+h/2,z);scene.add(m);")
between("    const c=mesh(GEO.cone,i%2?MAT.leaf:MAT.leafD","// sky: dome ribs","""    const c=mesh(GEO.ico,i%2?MAT.leaf:MAT.leafD,0.52,0.35+h*0.5,0.52,fx,1.05+h*0.4,fz);c.rotation.y=i*1.7;c.castShadow=true;scene.add(c);
    const c2=mesh(GEO.ico,i%2?MAT.leafD:MAT.leaf,0.32,0.32,0.32,fx+0.25,1.25+h*0.7,fz-0.15);c2.rotation.y=i;c2.castShadow=true;scene.add(c2);
    if(i%2===1)scene.add(mesh(GEO.sph,MAT.bloom,0.12,0.12,0.12,fx+0.2,1.3+h*0.9,fz+0.2))}}
""")
between("// sky: dome ribs","/* ---------- collision helpers ---------- */","""// light strips, rails, lamps
{const strip=bas({color:0x8fe6ff});
 box(0,5.3,-29.95,60,0.14,0.1,strip,false);box(0,5.3,29.95,60,0.14,0.1,strip,false);box(-29.95,5.3,0,0.1,0.14,60,strip,false);box(29.95,5.3,0,0.1,0.14,60,strip,false);
 box(0,3.95,-22.05,36,0.07,0.07,MAT.metal,false);for(let x=-18;x<=18;x+=4)box(x,3,-22.05,0.07,0.95,0.07,MAT.metal,false);
 const lamps=[[0,5.1,0,0xffb238,1.7,22],[-23,3.7,-8,0xffb238,1.3,17],[24,3.7,-2,0xffb238,1.3,17],[-4,3.7,25,0xffb238,1.3,17],[24,5.1,24,0xffb238,1.3,17],[0,2.2,-24,0x6fd8ff,1.1,18]];
 for(const[x,y,z,c,i,d]of lowFx?lamps.slice(0,3):lamps){const L=new T.PointLight(c,i,d,2);L.position.set(x,y,z);scene.add(L);const gl=glow(c,9,0.3);gl.position.set(x,y-0.6,z);scene.add(gl)}}
// sky
{const sk=paint(512,(g,S)=>{const gr=g.createLinearGradient(0,0,0,S);gr.addColorStop(0,'#03060f');gr.addColorStop(.34,'#081a2c');gr.addColorStop(.5,'#16505a');gr.addColorStop(.56,'#0c2030');gr.addColorStop(1,'#050a10');g.fillStyle=gr;g.fillRect(0,0,S,S);
   for(const[x,y,r,c]of[[110,120,105,'rgba(255,79,163,.22)'],[300,90,140,'rgba(106,66,184,.28)'],[400,175,90,'rgba(111,216,255,.14)'],[200,60,80,'rgba(255,178,56,.12)']]){
     const n=g.createRadialGradient(x,y,0,x,y,r);n.addColorStop(0,c);n.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=n;g.fillRect(0,0,S,S)}});
 scene.add(mesh(GEO.sph,bas({map:sk,side:T.BackSide,fog:false,depthWrite:false}),420,420,420));
 scene.add(mesh(new T.IcosahedronGeometry(1,2),bas({color:0x2a6470,wireframe:true,fog:false}),80,80,80,0,-12,0));
 const p=[];for(let i=0;i<900;i++){const a=Math.random()*6.283,e=Math.acos(Math.random()),r=330;p.push(Math.sin(e)*Math.cos(a)*r,Math.cos(e)*r,Math.sin(e)*Math.sin(a)*r)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));
 scene.add(new T.Points(g,new T.PointsMaterial({color:0xffffff,size:1.7,sizeAttenuation:false,fog:false})));
 const pt=paint(256,(g,S)=>{const cols=['#f2c08a','#e07a5f','#8a4fd0','#f4a3c0','#5b3fa8','#ffd9a0','#c75a8a'];
   for(let y=0;y<S;y+=4){g.fillStyle=cols[Math.floor(hash(y>>4,5)*cols.length)];g.fillRect(0,y,S,4)}
   for(let i=0;i<40;i++){g.fillStyle=`rgba(255,255,255,${0.04+hash(i,8)*0.08})`;g.beginPath();g.ellipse(hash(i,1)*S,hash(i,2)*S,30+hash(i,3)*50,4+hash(i,4)*6,0,0,7);g.fill()}});
 const P=[-170,115,-240];
 scene.add(mesh(GEO.sph,new T.MeshLambertMaterial({map:pt,fog:false}),55,55,55,...P));
 const ring=mesh(new T.RingGeometry(70,108,72),bas({color:0xffc98a,transparent:true,opacity:0.3,side:T.DoubleSide,fog:false,depthWrite:false}),1,1,1,...P);ring.rotation.set(1.3,0.35,0);scene.add(ring);
 const halo=glow(0xff8fb0,300,0.3);halo.position.set(...P);scene.add(halo)}
// sparks
const sparks=[];for(let i=0;i<(lowFx?40:90);i++){const m=new T.SpriteMaterial({map:glowTex,blending:T.AdditiveBlending,depthWrite:false,transparent:true,fog:false}),sp=new T.Sprite(m);sp.visible=false;scene.add(sp);sparks.push({s:sp,m,v:new T.Vector3(),t:0,l:1})}
let sparkI=0;
function sparkle(p,color,n,spd){for(let i=0;i<n;i++){const k=sparks[sparkI=(sparkI+1)%sparks.length];k.s.visible=true;k.s.position.copy(p);k.m.color.set(color);
  k.v.set(Math.random()-.5,Math.random()-.25,Math.random()-.5).normalize().multiplyScalar(spd*(0.4+Math.random()));k.t=k.l=0.45+Math.random()*0.35}}

""")
# models
rep("g.add(mesh(GEO.sph,MAT.amber,0.4,0.34,0.5));","g.add(mesh(GEO.sph,MAT.drone,0.4,0.34,0.5));")
rep("const parts=[];g.traverse(o=>{if(o.isMesh&&o.material!==MAT.wing)parts.push([o,o.material])});",
"""const parts=[];g.traverse(o=>{if(o.isMesh){if(o.material!==MAT.wing){o.castShadow=true;parts.push([o,o.material])}}});
  const gl=type===0?glow(0xff3b3b,1.1,0.9):type===1?glow(0x9dff7a,1.5,0.8):glow(0xffb238,2.4,0.8);gl.position.set(0,type===2?0.12:0.02,type===2?1.02:0.5);g.add(gl);""")
rep("bas({color:ELC[e.sel],transparent:true,opacity:0.3,depthWrite:false})","bas({color:ELC[e.sel],transparent:true,opacity:0.4,depthWrite:false,blending:T.AdditiveBlending})")
rep("const g=mesh(GEO.sph,MAT.spore,0.2,0.2,0.2,p.x,p.y,p.z);scene.add(g);","const g=mesh(GEO.sph,MAT.spore,0.2,0.2,0.2,p.x,p.y,p.z);g.add(glow(0xff6fb8,7));scene.add(g);")
rep("const g=mesh(GEO.sph,MAT.charge,0.13,0.13,0.13);g.position","const g=mesh(GEO.sph,MAT.charge,0.13,0.13,0.13);g.add(glow(0x9dff7a,9));g.position")
rep("0.26,0.4,0.26,x,y+0.7,z);scene.add(g);","0.26,0.4,0.26,x,y+0.7,z);g.add(glow(RAR[rar].c,7,0.7));scene.add(g);")
rep("g.position.set(x,y+0.45,z);scene.add(g);pickups.push","g.add(glow(k?0xc9a6ff:0x7be36b,1.8,0.5));g.position.set(x,y+0.45,z);scene.add(g);pickups.push")
rep("e.dying=0.001;score+=","e.dying=0.001;sparkle(e.pos,[0xffb238,0xff4fa3,0xc9a6ff][e.type],e.type===2?30:14,7);score+=")
rep("e.shell=null;sfx('boom');","e.shell=null;sfx('boom');sparkle(e.pos,ELC[e.sel],16,8);")
rep("blasts.push({g,m,t:0});if(!burst)","blasts.push({g,m,t:0});sparkle(p,burst?0xffffff:0xffb238,16,9);if(!burst)")
rep("beamMat.color.set(lance?0xe3d2ff:0xc9fbff);","beamMat.color.set(lance?0xe3d2ff:0xc9fbff);sparkle(tmp,lance?0xc9a6ff:0x9fefff,4,3);mfl.color.set(lance?0xc9a6ff:0x9fefff);")
rep("const muzzle=new T.Object3D();muzzle.position.set(0,0,-0.6);vm.add(muzzle);",
"const muzzle=new T.Object3D();muzzle.position.set(0,0,-0.6);vm.add(muzzle);\nconst mfl=new T.PointLight(0x9fefff,0,12,2);cam.add(mfl);const mglow=glow(0xdffcff,1.6,0.9);mglow.position.set(0,0,-0.62);mglow.visible=false;vm.add(mglow);")
rep("const beamMat=bas({color:0xc9fbff,fog:false})","const beamMat=bas({color:0xc9fbff,fog:false,blending:T.AdditiveBlending,transparent:true,depthWrite:false})")
rep("  flash-=dt;beam.visible=flash>0&&state==='playing';","""  flash-=dt;beam.visible=flash>0&&state==='playing';mfl.intensity=beam.visible?2.4:0;mglow.visible=beam.visible;
  for(const k of sparks)if(k.t>0){k.t-=dt;k.v.y-=9*dt;k.s.position.addScaledVector(k.v,dt);const a=Math.max(0,k.t/k.l);k.m.opacity=a;k.s.scale.setScalar(0.1+a*0.3);if(k.t<=0)k.s.visible=false}""")
# overlay copy
between('<p class="keys" id="ovKeys">','<div class="classes"','<p class="keys" id="ovKeys">WASD move · Shift sprint · Space jump, and again in the air for your class move · mouse aims · click fires<br>Q swap weapon · G or right-click grenade · F melee · X surge · P pause<br>Shelled enemies break fastest to the matching colour: cyan welder, violet lance, amber grenade<br>Phone: drag left to move, right to aim, buttons to fight</p>\n    ')
rep("have turned on the crew. Your shield recharges, your welder never runs dry, and every kill charges the surge. Pick a class","have turned on the crew. Pick a class")
rep(".overlay .keys{color:var(--dim);font-size:12px}",".overlay .keys{color:var(--dim);font-size:11px;max-width:84ch}")
rep("function pause(){setState('paused');","function pause(){setState('paused');$('ovKeys').hidden=true;")
rep("  setState('dead');$('classes').hidden=false;","  setState('dead');$('classes').hidden=false;$('ovKeys').hidden=true;")
open(p,'w').write(s)
