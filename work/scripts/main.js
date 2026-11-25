
(()=>{
const $=id=>document.getElementById(id);
const stage=$('stage'),cv=$('cv'),overlay=$('overlay');
const portrait=innerWidth<560&&innerHeight>innerWidth;
stage.style.setProperty('--ar',portrait?0.8:1.6);
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const BLOOM=[0.32,0.5,0.88];const T=window.THREE;T.ColorManagement.enabled=false;const LH=3.1416,LI=Math.PI,LP=3.1416; // colour values are linearised by hand (lin); light intensities are scaled to the physical units of current three.js
let renderer=null,composer=null;
try{renderer=new T.WebGLRenderer({canvas:cv,antialias:true})}catch(e){}
if(!renderer){$('ovText').textContent='This device or browser could not start 3D graphics (WebGL), so the game cannot run here.';$('go').hidden=true;$('ovKeys').hidden=true;return}
const CFG={q:(portrait||matchMedia('(pointer: coarse)').matches)?'low':'high',sens:1,vol:0.8,inv:false,fov:74};
try{Object.assign(CFG,JSON.parse(localStorage.getItem('gh9-cfg')||'{}'))}catch(e){}
if(!['low','med','high'].includes(CFG.q))CFG.q='high';
let bloomOn=true;
const lowFx=portrait||matchMedia('(pointer: coarse)').matches;
renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=0.9;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
const lin=h=>new T.Color(h).convertSRGBToLinear();
const scene=new T.Scene();scene.background=lin(0x0c2030);scene.fog=new T.Fog(lin(0x0e2a36),180,1350);
const cam=new T.PerspectiveCamera(portrait?88:74,1.6,0.08,9000);cam.rotation.order='YXZ';scene.add(cam);
function resize(){const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();
  if(composer){const z=renderer.getSize(new T.Vector2());composer.setSize(z.x,z.y)}}
if(window.ResizeObserver)new ResizeObserver(resize).observe(stage);addEventListener('resize',resize);resize();
const hemi=new T.HemisphereLight(0xdce8f0,0x8a9498,1.15*LH);scene.add(hemi);
const LPOOL=[];{const n=lowFx?3:5;for(let i=0;i<n;i++){const L=new T.PointLight(0xffffff,0,26,1.5);scene.add(L);LPOOL.push({L,f:null,k:0})}}
let fixT=0;
function lightTick(dt){const p=cam.position,r=inHull(p.x,p.z)&&p.y<32?roomAt(p.x,p.z):null,m=MOODS[r?MOODK[r.n]:'X'],a=Math.min(1,dt*2.5);
  hemi.intensity+=(m.hi*LH-hemi.intensity)*a;hemi.color.lerp(m.skyC,a);hemi.groundColor.lerp(m.grC,a);
  fixT-=dt;if(fixT<=0){fixT=.2;for(const f of FIX)f.d=(f.x-p.x)**2+4*(f.y-p.y)**2+(f.z-p.z)**2+(f.rm===r?0:1600);FIX.sort((u,v)=>u.d-v.d);for(let i=0;i<FIX.length;i++)FIX[i].top=i<LPOOL.length}
  for(const q of LPOOL){if(q.f&&q.f.top)q.k=Math.min(1,q.k+dt*3);else{q.k=Math.max(0,q.k-dt*3);if(q.k<=0){const f=FIX.find(f=>f.top&&!f.used);if(q.f)q.f.used=false;q.f=f||null;if(f){f.used=true;q.L.position.set(f.x,f.y,f.z);q.L.color.setHex(f.c);q.L.distance=f.r}}}
    q.L.intensity=q.f?q.f.i*q.k*LP:0}}
const sun=new T.DirectionalLight(0xffd9a8,1.1*LI);sun.position.set(28,46,14);sun.castShadow=true;
sun.shadow.mapSize.set(lowFx?1024:4096,lowFx?1024:4096);sun.shadow.radius=2;
{const c=sun.shadow.camera;c.left=-50;c.right=50;c.top=50;c.bottom=-50;c.near=5;c.far=160}
sun.shadow.bias=-0.0006;sun.shadow.normalBias=0.04;scene.add(sun,sun.target);

/* ---------- textures and materials ---------- */
function hash(x,y){let n=(x*374761393+y*668265263)|0;n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296}
const ANISO=renderer.capabilities.getMaxAnisotropy();
function paint(size,fn,srgb=true){const c=document.createElement('canvas');c.width=c.height=size;fn(c.getContext('2d'),size);
  const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;if(srgb)t.colorSpace=T.SRGBColorSpace;t.anisotropy=ANISO;return t}
function grime(g,S,n,a){for(let i=0;i<n;i++){const v=Math.random()>0.5?255:0;g.fillStyle=`rgba(${v},${v},${v},${Math.random()*a})`;
  g.fillRect(Math.random()*S,Math.random()*S,1+Math.random()*4,1+Math.random()*4)}}
function panels(g,S,base,n){g.fillStyle=base;g.fillRect(0,0,S,S);grime(g,S,3000,0.07);const p=S/n;
  for(let i=0;i<n;i++)for(let j=0;j<n;j++){const x=i*p,y=j*p;
    const gr=g.createLinearGradient(x,y,x,y+p);gr.addColorStop(0,'rgba(255,255,255,.10)');gr.addColorStop(1,'rgba(0,0,0,.16)');g.fillStyle=gr;g.fillRect(x+3,y+3,p-6,p-6);
    g.strokeStyle='rgba(0,0,0,.6)';g.lineWidth=3;g.strokeRect(x+1.5,y+1.5,p-3,p-3);
    g.strokeStyle='rgba(255,255,255,.18)';g.lineWidth=1;g.strokeRect(x+4.5,y+4.5,p-9,p-9);
    g.fillStyle='rgba(0,0,0,.55)';for(const[rx,ry]of[[11,11],[p-11,11],[11,p-11],[p-11,p-11]]){g.beginPath();g.arc(x+rx,y+ry,2.4,0,7);g.fill()}}}
function decking(g,S,base){g.fillStyle=base;g.fillRect(0,0,S,S);grime(g,S,S*8,.06);const p=S/2,lw=Math.max(1.5,S/200);
  for(let i=0;i<2;i++)for(let j=0;j<2;j++){const x=i*p,y=j*p;g.strokeStyle='rgba(14,20,24,.6)';g.lineWidth=lw;g.strokeRect(x+lw/2,y+lw/2,p-lw,p-lw);g.strokeStyle='rgba(255,255,255,.16)';g.lineWidth=1;g.strokeRect(x+lw*1.5,y+lw*1.5,p-lw*3,p-lw*3);
    if((i+j)%2){g.fillStyle='rgba(0,0,0,.1)';g.fillRect(x+p*.12,y+p*.12,p*.76,p*.76);g.strokeStyle='rgba(14,20,24,.3)';g.lineWidth=lw;for(let k=0;k<9;k++){g.beginPath();g.moveTo(x+p*.16,y+p*(.18+k*.08));g.lineTo(x+p*.84,y+p*(.18+k*.08));g.stroke()}}
    g.fillStyle='rgba(14,20,24,.55)';for(const[a,b]of[[.06,.06],[.94,.06],[.06,.94],[.94,.94]]){g.beginPath();g.arc(x+p*a,y+p*b,S*.008,0,7);g.fill()}}
  g.fillStyle='rgba(208,112,46,.8)';g.fillRect(S*.03,S*.47,S*.1,S*.015);g.fillRect(S*.53,S*.97,S*.1,S*.015)}
function ceilTex(em){return paint(256,(g,S)=>{g.fillStyle=em?'#000':'#a9b2b5';g.fillRect(0,0,S,S);if(!em){grime(g,S,1200,.04);g.strokeStyle='rgba(14,20,24,.55)';g.lineWidth=2;g.strokeRect(1,1,S-2,S-2);g.beginPath();g.moveTo(S/2,0);g.lineTo(S/2,S);g.moveTo(0,S/2);g.lineTo(S,S/2);g.stroke();
    g.fillStyle='rgba(0,0,0,.28)';g.fillRect(S*.08,S*.2,S*.34,S*.1);g.fillRect(S*.58,S*.7,S*.34,S*.1);g.fillStyle='rgba(0,0,0,.14)';g.fillRect(S*.6,S*.1,S*.3,S*.3);g.strokeStyle='rgba(14,20,24,.35)';for(let k=0;k<6;k++){g.beginPath();g.moveTo(S*.63,S*(.14+k*.045));g.lineTo(S*.87,S*(.14+k*.045));g.stroke()}}
  g.fillStyle=em?'#fff':'#eef6f8';g.fillRect(S*.1,S*.225,S*.3,S*.05);g.fillRect(S*.6,S*.725,S*.3,S*.05)})}
function plating(g,S,base,acc,tag){g.fillStyle=base;g.fillRect(0,0,S,S);grime(g,S,S*6,.045);
  const rr=(x,y,w,h,r)=>{g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()};
  const seam='rgba(18,26,30,.6)',lw=Math.max(1.5,S/220);
  {const gr=g.createLinearGradient(0,0,0,S);gr.addColorStop(0,'rgba(255,255,255,.07)');gr.addColorStop(1,'rgba(0,0,0,.09)');g.fillStyle=gr;g.fillRect(0,0,S,S)}
  g.strokeStyle=seam;g.lineWidth=lw;g.strokeRect(lw/2,lw/2,S-lw,S-lw);g.beginPath();g.moveTo(S*.5,0);g.lineTo(S*.5,S*.6);g.moveTo(0,S*.6);g.lineTo(S,S*.6);g.moveTo(S*.27,S*.6);g.lineTo(S*.27,S);g.moveTo(S*.73,S*.6);g.lineTo(S*.73,S);g.stroke();
  g.strokeStyle='rgba(255,255,255,.28)';g.lineWidth=1;g.beginPath();g.moveTo(S*.5+lw,lw*2);g.lineTo(S*.5+lw,S*.6-lw);g.moveTo(lw*2,S*.6+lw);g.lineTo(S-lw*2,S*.6+lw);g.stroke();
  g.fillStyle='rgba(0,0,0,.07)';rr(S*.06,S*.07,S*.38,S*.42,S*.05);g.fill();g.strokeStyle=seam;g.lineWidth=lw*.8;g.stroke();
  g.strokeStyle='rgba(255,255,255,.2)';rr(S*.06+lw,S*.07+lw,S*.38,S*.42,S*.05);g.stroke();
  g.fillStyle='rgba(0,0,0,.16)';rr(S*.57,S*.1,S*.35,S*.3,S*.04);g.fill();g.strokeStyle=seam;g.stroke();
  g.strokeStyle='rgba(18,26,30,.5)';g.lineWidth=lw;for(let i=0;i<7;i++){g.beginPath();g.moveTo(S*.61,S*(.145+i*.035));g.lineTo(S*.88,S*(.145+i*.035));g.stroke()}
  g.fillStyle=acc;g.fillRect(S*.06,S*.525,S*.17,S*.035);g.fillRect(S*.8,S*.68,S*.035,S*.22);g.beginPath();g.moveTo(S*.34,S*.94);g.lineTo(S*.4,S*.94);g.lineTo(S*.46,S*.86);g.lineTo(S*.4,S*.86);g.fill();
  g.fillStyle='rgba(50,165,185,.8)';g.fillRect(S*.3,S*.68,S*.11,S*.028);g.fillRect(S*.12,S*.3,S*.02,S*.1);
  g.fillStyle='rgba(18,26,30,.62)';g.font='700 '+Math.round(S*.075)+'px "Chakra Petch",monospace';g.fillText(tag||'D9-04',S*.31,S*.82);g.font='600 '+Math.round(S*.035)+'px monospace';g.fillText('▲ ACCESS',S*.1,S*.17);
  g.fillStyle='rgba(18,26,30,.55)';for(const[x,y]of[[.03,.03],[.47,.03],[.53,.03],[.97,.03],[.03,.57],[.47,.57],[.53,.57],[.97,.57],[.03,.63],[.24,.63],[.3,.63],[.7,.63],[.76,.63],[.97,.63],[.03,.97],[.97,.97]]){g.beginPath();g.arc(S*x,S*y,S*.008,0,7);g.fill()}}
const TX={
  hull:paint(lowFx?256:512,(g,S)=>hullPanels(g,S,'#aeb6b9')),
  floor:paint(lowFx?256:512,(g,S)=>decking(g,S,'#778388')),
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
  metal:paint(128,(g,S)=>{g.fillStyle='#6c797d';g.fillRect(0,0,S,S);grime(g,S,900,0.06);g.strokeStyle='rgba(0,0,0,.28)';g.lineWidth=2;
    for(let i=-S;i<S*2;i+=16){g.beginPath();g.moveTo(i,0);g.lineTo(i+S,S);g.stroke();g.beginPath();g.moveTo(i+S,0);g.lineTo(i,S);g.stroke()}}),
};
function normalMap(src,k){const S=src.image.width,d=src.image.getContext('2d').getImageData(0,0,S,S).data,c=document.createElement('canvas');c.width=c.height=S;
  const g=c.getContext('2d'),o=g.createImageData(S,S),H=(x,y)=>{const i=(((y+S)%S)*S+((x+S)%S))*4;return(d[i]+d[i+1]+d[i+2])/765};
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const dx=(H(x+1,y)-H(x-1,y))*k,dy=(H(x,y+1)-H(x,y-1))*k,l=Math.hypot(dx,dy,1),i=(y*S+x)*4;
    o.data[i]=(-dx/l*.5+.5)*255;o.data[i+1]=(dy/l*.5+.5)*255;o.data[i+2]=(1/l*.5+.5)*255;o.data[i+3]=255}
  g.putImageData(o,0,0);const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=ANISO;return t}
function crateTex(base){return paint(128,(g,S)=>{g.fillStyle=base;g.fillRect(0,0,S,S);grime(g,S,900,0.08);
  for(let x=0;x<S;x+=16){g.fillStyle='rgba(0,0,0,.28)';g.fillRect(x,0,5,S);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(x+5,0,3,S)}
  g.fillStyle='rgba(0,0,0,.5)';g.fillRect(0,0,S,5);g.fillRect(0,S-5,S,5);g.fillStyle='rgba(255,255,255,.75)';g.fillRect(20,52,44,8);g.fillRect(20,66,28,5)})}
const glowTex=paint(64,(g,S)=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.22,'rgba(255,255,255,.55)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,S,S)});
const glowMats={};
function glow(color,size,op=0.8){const k=color+'|'+op,m=glowMats[k]||(glowMats[k]=new T.SpriteMaterial({map:glowTex,color,blending:T.AdditiveBlending,depthWrite:false,transparent:true,opacity:op,fog:false}));
  const sp=new T.Sprite(m);sp.scale.set(size,size,1);return sp}
const std=(o)=>{if(typeof o.color==='number')o.color=lin(o.color);if(typeof o.emissive==='number')o.emissive=lin(o.emissive);return new T.MeshStandardMaterial(o)},bas=(o)=>new T.MeshBasicMaterial(o);
const MAT={
  hull:std({map:TX.hull,normalMap:normalMap(TX.hull,3),roughness:0.5,metalness:0.3}),
  vine:std({map:TX.vine,normalMap:normalMap(TX.vine,5),roughness:0.8,metalness:0.1}),
  glass:std({map:TX.glass,emissive:0xffffff,emissiveMap:TX.glass,emissiveIntensity:0.85,roughness:0.25,metalness:0}),
  floor:std({map:TX.floor,normalMap:normalMap(TX.floor,3),roughness:0.62,metalness:0.4}),
  metal:std({map:TX.metal,roughness:0.5,metalness:0.7}),
  soil:std({color:0x3a2c1e,roughness:1}),amber:std({color:0xffb238,emissive:0xffb238,emissiveIntensity:0.45,roughness:0.4}),
  leaf:std({color:0x4fb85a,roughness:0.8,flatShading:true}),leafD:std({color:0x2f7d3e,roughness:0.8,flatShading:true}),
  bloom:std({color:0xff4fa3,emissive:0xff4fa3,emissiveIntensity:0.5,roughness:0.5}),dark:std({color:0x2a1c08,roughness:0.5,metalness:0.3}),
  eye:bas({color:0xff5a5a}),bulb:std({color:0xb02472,roughness:0.45}),core:bas({color:0xb6ff96}),
  violet:std({color:0x6a42b8,roughness:0.35,metalness:0.5}),violetD:std({color:0x3b2466,roughness:0.4,metalness:0.5}),eyeA:bas({color:0xffc04d}),white:bas({color:0xffffff}),
  wing:std({color:0xbfeeff,transparent:true,opacity:0.6,side:T.DoubleSide,roughness:0.2,depthWrite:false}),
  spore:bas({color:0xffa060}),charge:bas({color:0xb6ff96}),gel:std({color:0x7be36b,emissive:0x2c8a2c,roughness:0.4}),cell:std({color:0xc9a6ff,emissive:0x5a3aa0,roughness:0.4}),cap:std({color:0xdcebe4,roughness:0.4,metalness:0.5}),
  gun:std({color:0x5d8b93,roughness:0.3,metalness:0.75}),gunD:std({color:0x1c3034,roughness:0.5,metalness:0.6}),lance:std({color:0x6a42b8,roughness:0.3,metalness:0.7}),
};
MAT.bark=std({color:0x5a4030,roughness:0.9});
{const a=crateTex('#b5651d'),b=crateTex('#2f6f7a');MAT.crateA=std({map:a,normalMap:normalMap(a,5),roughness:0.55,metalness:0.5});MAT.crateB=std({map:b,normalMap:normalMap(b,5),roughness:0.55,metalness:0.5})}
const rip=normalMap(paint(256,(g,S)=>{g.fillStyle='#808080';g.fillRect(0,0,S,S);
  for(let i=0;i<240;i++){const x=Math.random()*S,y=Math.random()*S,r=8+Math.random()*26,v=Math.random()>0.5?255:0,gr=g.createRadialGradient(x,y,0,x,y,r);
    gr.addColorStop(0,`rgba(${v},${v},${v},.4)`);gr.addColorStop(1,`rgba(${v},${v},${v},0)`);g.fillStyle=gr;
    for(const ox of[-S,0,S])for(const oy of[-S,0,S]){g.save();g.translate(ox,oy);g.beginPath();g.arc(x,y,r,0,7);g.fill();g.restore()}}},false),4);
rip.repeat.set(0.25,0.25);
MAT.water=std({color:0x0d3a44,roughness:0.04,metalness:1,normalMap:rip,normalScale:new T.Vector2(0.4,0.4)});MAT.water.userData.noShadow=true;
MAT.pane=std({color:0x9fe6ff,transparent:true,opacity:0.2,roughness:0.05,metalness:0.7,depthWrite:false});MAT.pane.userData.noShadow=true;
{const po=(m,f)=>{m.polygonOffset=true;m.polygonOffsetFactor=f;m.polygonOffsetUnits=f;m.userData.noShadow=true;return m};po(MAT.water,-2);
 MAT.road=po(std({color:0x1b2326,roughness:0.85,metalness:0.2}),-2);MAT.line=po(bas({color:0x7a5216}),-4);MAT.mark=po(bas({color:0xaab8b4}),-4)}
MAT.pane.side=T.DoubleSide;
MAT.armor=std({color:0x2f5560,roughness:0.45,metalness:0.6});MAT.armorD=std({color:0x44545a,roughness:0.55,metalness:0.3});
MAT.tire=std({color:0x0e1416,roughness:0.9});MAT.canopy=std({color:0x0d2a33,roughness:0.05,metalness:1});
MAT.lily=std({color:0x1c5a2e,roughness:1});
MAT.leafP=std({color:0xe88fc0,emissive:0xff4fa3,emissiveIntensity:0.1,roughness:0.7,flatShading:true});
MAT.strip=bas({color:0x5fb4c8});MAT.strip.userData.noShadow=true;
MAT.drone=std({color:0xffb238,roughness:0.35,metalness:0.35});
const GEO={ico0:new T.IcosahedronGeometry(1,0),cyl:new T.CylinderGeometry(1,1,1,16),oct:new T.OctahedronGeometry(1),ico:new T.IcosahedronGeometry(1,1),box:new T.BoxGeometry(1,1,1),sph:new T.SphereGeometry(1,24,16),cone:new T.ConeGeometry(1,1,12),plane:new T.PlaneGeometry(1,1)};
const mesh=(g,m,sx,sy,sz,x=0,y=0,z=0)=>{const o=new T.Mesh(g,m);o.scale.set(sx,sy,sz);o.position.set(x,y,z);return o};
GEO.tor=GEO.tor||new T.TorusGeometry(1,0.18,8,28);GEO.sphL=new T.SphereGeometry(1,10,8);GEO.hex=new T.CylinderGeometry(1,1,1,6);
const _q=new T.Quaternion(),_e=new T.Euler(),_v=new T.Vector3(),_s=new T.Vector3();
function mergeGeos(list){let n=0;for(const g of list)n+=g.attributes.position.count;const P=new Float32Array(n*3),N=new Float32Array(n*3),U=new Float32Array(n*2);let o=0;
  for(const g of list){const c=g.attributes.position.count;P.set(g.attributes.position.array,o*3);N.set(g.attributes.normal.array,o*3);if(g.attributes.uv)U.set(g.attributes.uv.array,o*2);o+=c;g.dispose()}
  const G=new T.BufferGeometry();G.setAttribute('position',new T.BufferAttribute(P,3));G.setAttribute('normal',new T.BufferAttribute(N,3));G.setAttribute('uv',new T.BufferAttribute(U,2));G.computeBoundingSphere();return G}
function bake(fn){const by=new Map();
  fn((geo,mat,sx,sy,sz,x=0,y=0,z=0,rx=0,ry=0,rz=0)=>{let g=geo.clone();if(rx&&rx.isQuaternion)_q.copy(rx);else _q.setFromEuler(_e.set(rx,ry,rz));
    g.applyMatrix4(M4.compose(_v.set(x,y,z),_q,_s.set(sx,sy,sz)));if(g.index){const n=g.toNonIndexed();g.dispose();g=n}if(!by.has(mat))by.set(mat,[]);by.get(mat).push(g)});
  return[...by].map(([m,l])=>[m,mergeGeos(l)])}
function inst(b,sh){const g=new T.Group();for(const[m,geo]of b){const o=new T.Mesh(geo,m);o.castShadow=!!sh;g.add(o)}return g}
const KIT={};const kit=(name,fn)=>KIT[name]||(KIT[name]=bake(fn));
function J(par,x,y,z){const j=new T.Group();j.position.set(x,y,z);par.add(j);return j}
function put(j,name,fn,sh){const m=inst(kit(name,fn),sh);j.add(m);return m}

/* ---------- world ---------- */
const GC=12,EMPTY=[];let GRID=null,gridN=-1,stamp=0;
const AX=110,AZ=260,A=AZ,boxes=[],bucket=new Map(),M4=new T.Matrix4(),UP=new T.Vector3(0,1,0);
function addGeo(mat,g){if(g.index){const n=g.toNonIndexed();g.dispose();g=n}if(!bucket.has(mat))bucket.set(mat,[]);bucket.get(mat).push(g)}
function box(x,y,z,w,h,d,mat,solid=true){
  const g=new T.BoxGeometry(w,h,d),uv=g.attributes.uv,s=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]];
  for(let f=0;f<6;f++)for(let i=0;i<4;i++){const k=f*4+i;uv.setXY(k,uv.getX(k)*s[f][0]/2,uv.getY(k)*s[f][1]/2)}
  g.translate(x,y+h/2,z);addGeo(mat,g);
  if(solid)boxes.push({lo:[x-w/2,y,z-d/2],hi:[x+w/2,y+h,z+d/2]})}
function blob(geo,mat,sx,sy,sz,x,y,z,ry=0){const g=geo.clone();
  g.applyMatrix4(M4.compose(new T.Vector3(x,y,z),new T.Quaternion().setFromAxisAngle(UP,ry),new T.Vector3(sx,sy,sz)));addGeo(mat,g)}
function flush(){for(const[mat,list]of bucket){let n=0;for(const g of list)n+=g.attributes.position.count;
    const P=new Float32Array(n*3),N=new Float32Array(n*3),U=new Float32Array(n*2);let o=0;
    for(const g of list){const c=g.attributes.position.count;P.set(g.attributes.position.array,o*3);N.set(g.attributes.normal.array,o*3);if(g.attributes.uv)U.set(g.attributes.uv.array,o*2);o+=c;g.dispose()}
    const G=new T.BufferGeometry();G.setAttribute('position',new T.BufferAttribute(P,3));G.setAttribute('normal',new T.BufferAttribute(N,3));G.setAttribute('uv',new T.BufferAttribute(U,2));
    const m=new T.Mesh(G,mat);m.castShadow=!mat.userData.noShadow;m.receiveShadow=true;scene.add(m)}bucket.clear()}
// Stairs are defined by where they ARRIVE: (ax,az) is the centre of the upper floor's edge, (ux,uz) the direction you walk going up.
// Real proportions: ~18 cm risers, 28 cm treads, at most 15 risers per flight, landings as deep as the stair is wide.
// Collision is one thin slab per tread (and per landing), so you can walk, see and shoot underneath.
MAT.stairT=std({color:0x8a9497,roughness:.45,metalness:.6});
const STAIRS=[],STAIRLOG=[];
function sbeam(mat,ax,ay,az,bx,by,bz,hgt,thick){const X=new T.Vector3(bx-ax,by-ay,bz-az),len=X.length();if(len<.01)return;X.normalize();
  const Y=new T.Vector3(0,1,0).addScaledVector(X,-X.y).normalize(),Z=new T.Vector3().crossVectors(X,Y),m=new T.Matrix4().makeBasis(X,Y,Z);
  m.scale(new T.Vector3(len,hgt,thick));m.setPosition((ax+bx)/2,(ay+by)/2,(az+bz)/2);const g=GEO.box.clone();g.applyMatrix4(m);addGeo(mat,g)}
function railLine(ax,ay,az,bx,by,bz){sbeam(MAT.metal,ax,ay+1,az,bx,by+1,bz,.07,.07);sbeam(MAT.armorD,ax,ay+.5,az,bx,by+.5,bz,.04,.04);
  const n=Math.max(1,Math.ceil(Math.hypot(bx-ax,bz-az)/1.4));for(let i=0;i<=n;i++){const t=i/n;box(ax+(bx-ax)*t,ay+(by-ay)*t,az+(bz-az)*t,.06,1,.06,MAT.metal,false)}}
function railEdge(ax,az,bx,bz,y,gaps=[]){const alongX=Math.abs(bx-ax)>=Math.abs(bz-az),a0=alongX?Math.min(ax,bx):Math.min(az,bz),a1=alongX?Math.max(ax,bx):Math.max(az,bz),c=alongX?az:ax;
  const seg=(u,v)=>{if(v-u<.05)return;alongX?railLine(u,y,c,v,y,c):railLine(c,y,u,c,y,v)};let s0=a0;
  for(const[g0,g1]of gaps.slice().sort((p,q)=>p[0]-q[0])){seg(s0,Math.min(g0,a1));s0=Math.max(s0,g1)}seg(s0,a1)}
function stairTo(name,ax,az,ux,uz,width,yTop,yBase=0){
  const G=.28,nR=Math.max(1,Math.ceil((yTop-yBase)/.18-1e-6)),r=(yTop-yBase)/nR,nF=Math.ceil(nR/15),L=Math.max(1.6,width),per=[];
  for(let f=0;f<nF;f++)per.push(Math.floor(nR/nF)+(f<nR%nF?1:0));
  const run=per.reduce((a,k)=>a+(k-1)*G,0)+(nF-1)*L,fx=ax-ux*run,fz=az-uz*run,P=(sv,o)=>[fx+ux*sv-uz*o,fz+uz*sv+ux*o];
  const pieces=[],flights=[];let sv=0,h=yBase;
  for(let f=0;f<nF;f++){const k=per[f],fs=sv,fh=h;for(let i=1;i<k;i++){h+=r;pieces.push({s0:sv,s1:sv+G,h,t:1});sv+=G}h+=r;flights.push({s0:fs,h0:fh,s1:sv,h1:h});
    if(f<nF-1){pieces.push({s0:sv,s1:sv+L,h,t:0});sv+=L}}
  const ST={name,fx,fz,ux,uz,width,yTop,yBase,run,pieces};
  for(const p of pieces){const[cx,cz]=P((p.s0+p.s1)/2,0),len=p.s1-p.s0,w=ux?len:width,d=ux?width:len;
    boxes.push({lo:[cx-w/2,p.h-.3,cz-d/2],hi:[cx+w/2,p.h,cz+d/2],floor:true,stair:name});
    if(p.t){box(cx,p.h-.06,cz,w,.06,d,MAT.stairT,false);const[nx,nz]=P(p.s0+.03,0);box(nx,p.h-.055,nz,ux?.06:width,.06,ux?width:.06,MAT.amber,false);
      const[rx,rz]=P(p.s0,0);box(rx,p.h-r,rz,ux?.04:width*.96,r-.06,ux?width*.96:.04,MAT.armorD,false)}
    else{box(cx,p.h-.3,cz,w,.3,d,MAT.armorD,false);box(cx,p.h-.05,cz,w*.98,.05,d*.98,MAT.stairT,false);
      for(const a of[.15,len-.15])for(const o of[-width/2+.15,width/2-.15]){const[qx,qz]=P(p.s0+a,o);boxes.push({lo:[qx-.1,yBase,qz-.1],hi:[qx+.1,p.h-.3,qz+.1],stair:name});box(qx,yBase,qz,.2,p.h-.3-yBase,.2,MAT.armorD,false)}
      for(const o of[-width/2-.05,width/2+.05]){const[a0,b0]=P(p.s0,o),[a1,b1]=P(p.s1,o);railLine(a0,p.h,b0,a1,p.h,b1)}}}
  for(const F of flights)for(const o of[-width/2-.06,width/2+.06]){const[a0,b0]=P(F.s0,o),[a1,b1]=P(F.s1,o);sbeam(MAT.armorD,a0,F.h0-.22,b0,a1,F.h1-.22,b1,.42,.1);
    const[c0,d0]=P(F.s0,o+(o<0?-.02:.02)),[c1,d1]=P(F.s1,o+(o<0?-.02:.02));railLine(c0,F.h0+r,d0,c1,F.h1,d1)}
  STAIRS.push(ST);return ST}
function solidAt(x,y,z,skip){for(const b of cell(Math.floor(x/GC),Math.floor(z/GC)))if(b.stair!==skip&&x>b.lo[0]&&x<b.hi[0]&&y>b.lo[1]&&y<b.hi[1]&&z>b.lo[2]&&z<b.hi[2])return true;return false}
function verifyStairs(){for(const S of STAIRS){const P=(sv,o)=>[S.fx+S.ux*sv-S.uz*o,S.fz+S.uz*sv+S.ux*o],os=[-S.width*.4,0,S.width*.4],bad=[];
    for(const p of S.pieces)for(const o of os){const[x,z]=P((p.s0+p.s1)/2,o);for(let y=p.h+.15;y<=p.h+2.1;y+=.3)if(solidAt(x,y,z,S.name)){bad.push('no headroom over the '+(p.t?'step':'landing')+' at '+p.h.toFixed(1)+' m');break}}
    for(let sv=-2;sv<0;sv+=.5)for(const o of os){const[x,z]=P(sv,o);for(let y=S.yBase+.2;y<=S.yBase+2;y+=.3)if(solidAt(x,y,z,S.name)){bad.push('foot blocked');break}}
    for(let sv=S.run+.3;sv<=S.run+2;sv+=.5)for(const o of os){const[x,z]=P(sv,o);if(!solidAt(x,S.yTop-.1,z,S.name))bad.push('no floor at the top');for(let y=S.yTop+.2;y<=S.yTop+2;y+=.3)if(solidAt(x,y,z,S.name)){bad.push('top blocked');break}}
    S.bad=[...new Set(bad)];if(S.bad.length){STAIRLOG.push(S.name+': '+S.bad.join(', '));console.warn('stair problem',S.name,S.bad.join(', '))}}}
function planter(x,y,z,w,d){box(x,y,z,w,1,d,MAT.soil);box(x,y+0.9,z,w+0.1,0.12,d+0.1,MAT.metal,false);
  const n=Math.round(Math.max(w,d)/0.8);
  for(let i=0;i<n;i++){const t=(i+0.5)/n-0.5,fx=x+(w>d?t*w:0),fz=z+(w>d?0:t*d),h=0.7+hash(i,x*7+z|0)*0.7;
    blob(GEO.ico,i%2?MAT.leaf:MAT.leafD,0.52,0.35+h*0.5,0.52,fx,y+1.05+h*0.4,fz,i*1.7);
    blob(GEO.ico,i%2?MAT.leafD:MAT.leaf,0.32,0.32,0.32,fx+0.25,y+1.25+h*0.7,fz-0.15,i);
    if(i%2===1)blob(GEO.ico0,MAT.bloom,0.13,0.13,0.13,fx+0.2,y+1.3+h*0.9,fz+0.2)}}
function tree(x,z,k,y0=0){const h=3+hash(k,1)*1.4;box(x,y0,z,0.6,h,0.6,MAT.bark);
  for(let i=0;i<4;i++){const a=i*1.6+k,r=i?1.15:0,sc=1.5+hash(k,i+2)*0.9;
    blob(GEO.ico,(i+k)%2?MAT.leaf:MAT.leafD,sc,sc*0.8,sc,x+Math.cos(a)*r,y0+h+0.6+hash(k,i+7)*0.9,z+Math.sin(a)*r,a);
    blob(GEO.ico0,MAT.bloom,0.17,0.17,0.17,x+Math.cos(a+1)*sc*0.85,y0+h+0.8+i*0.25,z+Math.sin(a+1)*sc*0.85)}}
const PADS=[];
function pad(x,y,z,v){PADS.push({x,y,z,v});blob(GEO.cyl,MAT.metal,1.6,0.06,1.6,x,y+0.03,z);blob(GEO.cyl,MAT.strip,1.25,0.08,1.25,x,y+0.06,z)}
// ---- the ship: a roofed hull of rooms joined by doors and a central spine corridor
const GLOWS=[],ROOMS=[
  {n:'BRIDGE',x0:-59,x1:59,z0:-257,z1:-161,h:18},{n:'PORT FARMS',x0:-107,x1:-11,z0:-159,z1:-41,h:22},{n:'STARBOARD FARMS',x0:11,x1:107,z0:-159,z1:-41,h:22},
  {n:'FORE SPINE',x0:-9,x1:9,z0:-159,z1:-41,h:5.6},{n:'COMMONS',x0:-107,x1:107,z0:-39,z1:39,h:26},{n:'HABITAT',x0:-107,x1:-11,z0:41,z1:149,h:9},
  {n:'ENGINEERING',x0:11,x1:107,z0:41,z1:149,h:24},{n:'AFT SPINE',x0:-9,x1:9,z0:41,z1:149,h:5.6},{n:'HANGAR',x0:-107,x1:107,z0:151,z1:257,h:30}];
function roomAt(x,z){for(const r of ROOMS)if(x>=r.x0-1&&x<=r.x1+1&&z>=r.z0-1&&z<=r.z1+1)return r;return null}
const PARKED=[[-55,215,0],[55,215,0],[-30,190,.4],[34,188,-.3]];const NAVW=[]; // wall centrelines, so pathfinding always sees a wall even when it falls between two grid cells
function inHull(x,z){return Math.abs(x)<AX&&z>-AZ&&z<AZ}
// A = bright and clean, B = dark with orange light, F = the farms under glass, X = outside the hull
const FIX=[],MOODS={A:{hi:.6,sky:0xdce8f0,gr:0x4a5256,lc:0xe6f2ff,li:1},B:{hi:.3,sky:0xcbd6dc,gr:0x1c2226,lc:0xff9548,li:1.6},F:{hi:.8,sky:0xdcf0e4,gr:0x56625a,lc:0xf0ffe8,li:.8},X:{hi:1.15,sky:0xdce8f0,gr:0x8a9498}},
  MOODK={'BRIDGE':'A','COMMONS':'A','HABITAT':'A','PORT FARMS':'F','STARBOARD FARMS':'F','FORE SPINE':'B','AFT SPINE':'B','ENGINEERING':'B','HANGAR':'B'};
for(const k in MOODS){const m=MOODS[k];m.skyC=new T.Color(m.sky);m.grC=new T.Color(m.gr)}
const fix=(x,y,z,mk,r=26)=>FIX.push({x,y,z,c:MOODS[mk].lc,i:MOODS[mk].li,r,rm:roomAt(x,z),top:false,used:false});
const rrect=(g,x,y,w,h,r)=>{g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()};
// one wall bay: a recessed rounded panel, vents above, a trim line and a dark skirting, shaded darker at the floor and the ceiling
function linerTex(mo,tag,sub){const ACC=mo?'#ff8a3c':'#d0702e';return paint(512,(g,S)=>{g.fillStyle=mo?'#848e93':'#c3cacc';g.fillRect(0,0,S,S);grime(g,S,2500,.04);
  g.fillStyle='rgba(0,0,0,.22)';g.fillRect(0,0,S,S*.17);g.strokeStyle='rgba(12,18,22,.7)';g.lineWidth=3;g.beginPath();g.moveTo(0,S*.17);g.lineTo(S,S*.17);g.stroke();
  for(let k=0;k<5;k++){g.fillStyle='rgba(0,0,0,.4)';rrect(g,S*(.12+k*.16),S*.05,S*.11,S*.07,6);g.fill()}
  g.fillStyle='rgba(0,0,0,.1)';rrect(g,S*.1,S*.23,S*.8,S*.5,S*.05);g.fill();g.strokeStyle='rgba(12,18,22,.65)';g.lineWidth=3;g.stroke();g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=1.5;rrect(g,S*.1+3,S*.23+3,S*.8,S*.5,S*.05);g.stroke();
  g.strokeStyle='rgba(12,18,22,.5)';g.lineWidth=2;g.beginPath();g.moveTo(S*.38,S*.23);g.lineTo(S*.38,S*.73);g.moveTo(S*.66,S*.23);g.lineTo(S*.66,S*.73);g.moveTo(S*.38,S*.5);g.lineTo(S*.66,S*.5);g.stroke();
  g.fillStyle='rgba(0,0,0,.3)';rrect(g,S*.7,S*.3,S*.16,S*.16,8);g.fill();g.strokeStyle='rgba(12,18,22,.6)';for(let k=0;k<6;k++){g.beginPath();g.moveTo(S*.72,S*(.325+k*.022));g.lineTo(S*.84,S*(.325+k*.022));g.stroke()}
  g.fillStyle=ACC;g.fillRect(S*.14,S*.29,S*.035,S*.14);g.fillRect(S*.72,S*.62,S*.12,S*.03);g.fillStyle='rgba(40,165,185,.85)';g.fillRect(S*.42,S*.44,S*.1,S*.02);
  g.fillStyle='rgba(12,18,22,.7)';g.font='700 '+Math.round(S*.09)+'px "Chakra Petch",monospace';g.fillText(tag,S*.42,S*.37);g.font='600 '+Math.round(S*.03)+'px monospace';g.fillText(sub,S*.42,S*.6);
  g.fillStyle=ACC;g.fillRect(0,S*.765,S,S*.014);g.fillStyle='rgba(8,12,14,.8)';g.fillRect(0,S*.86,S,S*.14);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(0,S*.86,S,2);
  const gr=g.createLinearGradient(0,0,0,S);gr.addColorStop(0,'rgba(0,0,0,.4)');gr.addColorStop(.22,'rgba(0,0,0,0)');gr.addColorStop(.68,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.45)');g.fillStyle=gr;g.fillRect(0,0,S,S)})}
const mkLin=(mo,tag,sub,rx,ry)=>{const t=linerTex(mo,tag,sub);t.repeat.set(rx,ry);return std({map:t,roughness:mo?.6:.75,metalness:.15})};
MAT.linS=mkLin(1,'S-07','SPINE / SERVICE',2/8,2/5.6);MAT.linA=mkLin(0,'A-12','CREW DECK',2/5.7,2/5);MAT.linB=mkLin(1,'E-31','MACHINE DECK',2/5.7,2/5);
// the corridor deck: dark plates with a paler walkway between two accent lines
MAT.corrF=std({map:paint(512,(g,S)=>{g.fillStyle='#22282b';g.fillRect(0,0,S,S);grime(g,S,5000,.05);
  g.fillStyle='#343c40';g.fillRect(S*.36,0,S*.28,S);g.fillStyle='#ff8a3c';g.fillRect(S*.355,0,S*.008,S);g.fillRect(S*.637,0,S*.008,S);
  g.strokeStyle='rgba(0,0,0,.5)';g.lineWidth=2;g.beginPath();g.moveTo(0,1);g.lineTo(S,1);g.moveTo(0,S/2);g.lineTo(S*.36,S/2);g.moveTo(S*.64,S/2);g.lineTo(S,S/2);g.moveTo(S*.18,0);g.lineTo(S*.18,S);g.moveTo(S*.82,0);g.lineTo(S*.82,S);g.stroke();
  g.strokeStyle='rgba(255,255,255,.16)';g.lineWidth=5;g.beginPath();g.moveTo(S*.46,S*.56);g.lineTo(S*.5,S*.44);g.lineTo(S*.54,S*.56);g.stroke();
  g.fillStyle='rgba(255,255,255,.1)';for(let k=0;k<8;k++){g.fillRect(S*.03,S*(.06+k*.125),S*.05,S*.012);g.fillRect(S*.92,S*(.06+k*.125),S*.05,S*.012)}}),roughness:.45,metalness:.35});
MAT.corrF.map.repeat.set(2/14,2/8);MAT.corrF.polygonOffset=true;MAT.corrF.polygonOffsetFactor=-3;MAT.corrF.polygonOffsetUnits=-3;
MAT.roofB=std({color:0x2b3236,roughness:.7,metalness:.3});MAT.ringD=std({color:0x39464c,roughness:.5,metalness:.3});MAT.ringP=std({color:0xb4bbbd,roughness:.5,metalness:.3});
MAT.upA=std({color:0x7c878b,roughness:.7,metalness:.3});MAT.upB=std({color:0x2e363a,roughness:.7,metalness:.3});
MAT.laneA=std({color:0x475157,roughness:.85,metalness:.05});MAT.laneB=std({color:0x353d41,roughness:.85,metalness:.05});MAT.laneF=std({color:0x4c574f,roughness:.85,metalness:.05});
for(const m of[MAT.laneA,MAT.laneB,MAT.laneF]){m.polygonOffset=true;m.polygonOffsetFactor=-4;m.polygonOffsetUnits=-4;m.userData.noShadow=true}
MAT.stripA=bas({color:0xf2fbff});MAT.stripB=bas({color:0xffb070});MAT.barO=bas({color:0xe0702a});MAT.barC=bas({color:0x46c8e0});for(const m of[MAT.stripA,MAT.stripB,MAT.barO,MAT.barC])m.userData.noShadow=true;
function hullPanels(g,S,base){g.fillStyle=base;g.fillRect(0,0,S,S);grime(g,S,S*5,.04);const seam='rgba(18,26,30,.55)',lw=Math.max(1.5,S/220);
  g.strokeStyle=seam;g.lineWidth=lw;g.strokeRect(lw/2,lw/2,S-lw,S-lw);g.beginPath();g.moveTo(0,S*.34);g.lineTo(S,S*.34);g.moveTo(S*.62,S*.34);g.lineTo(S*.62,S);g.stroke();
  g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=1;g.beginPath();g.moveTo(lw*2,S*.34+lw);g.lineTo(S-lw*2,S*.34+lw);g.stroke();
  g.fillStyle='rgba(0,0,0,.12)';g.fillRect(S*.68,S*.42,S*.22,S*.12);g.strokeStyle=seam;for(let k=0;k<4;k++){g.beginPath();g.moveTo(S*.7,S*(.445+k*.025));g.lineTo(S*.88,S*(.445+k*.025));g.stroke()}
  g.fillStyle='rgba(208,112,46,.85)';g.fillRect(S*.05,S*.29,S*.08,S*.02);
  g.fillStyle='rgba(18,26,30,.5)';for(const[x,y]of[[.03,.03],[.97,.03],[.03,.31],[.97,.31],[.03,.37],[.59,.37],[.65,.37],[.97,.37],[.03,.97],[.59,.97],[.65,.97],[.97,.97]]){g.beginPath();g.arc(S*x,S*y,S*.007,0,7);g.fill()}}
MAT.roof=std({map:ceilTex(0),emissive:0xffffff,emissiveMap:ceilTex(1),emissiveIntensity:.6,roughness:.7,metalness:.2});MAT.roof.map.repeat.set(.25,.25);MAT.roof.emissiveMap.repeat.set(.25,.25);MAT.frame=std({color:0x39464c,roughness:.5,metalness:.3});TX.hull.repeat.set(.25,.25);MAT.hull.normalMap.repeat.set(.25,.25);
MAT.win=bas({color:0xb88a46});MAT.win.userData.noShadow=true;
const TRIM={c:bas({color:0x46c8e0}),a:bas({color:0xd8962a}),g:bas({color:0x5ccf6a}),v:bas({color:0x9a6ae0}),o:bas({color:0xe0702a}),r:bas({color:0xd84848})};for(const k in TRIM)TRIM[k].userData.noShadow=true;
{const deco=(geo,mat,sx,sy,sz,x,y,z,rx=0,ry=0,rz=0)=>{const g=geo.clone();g.applyMatrix4(M4.compose(new T.Vector3(x,y,z),new T.Quaternion().setFromEuler(new T.Euler(rx,ry,rz)),new T.Vector3(sx,sy,sz)));addGeo(mat,g)};
 const floorBox=(x,y,z,w,h,d,m=MAT.metal)=>{box(x,y,z,w,h,d,m);boxes[boxes.length-1].floor=true};
 const seg=(ax,c,a0,a1,y0,h,m=MAT.hull)=>{const L=a1-a0;if(L<=0.01||h<=0.01)return;if(y0<2.5)NAVW.push([ax,c,a0,a1]);const mm=(a0+a1)/2;if(ax==='x')box(c,y0,mm,2,h,L,m);else box(mm,y0,c,L,h,2,m)};
 const along=(ax,c,a,y,len,th,m)=>ax==='x'?box(c,y,a,th,.25,len,m,false):box(a,y,c,len,.25,th,m,false);
 // a wall at x=c (ax 'x') or z=c (ax 'z') from a0 to a1, with doorways [center,width,height,trim]
 const frameGeo=(dw,dh)=>{const W=dw+3.2,Hh=dh+1.7,R=1.6,r=1,sh=new T.Shape();sh.moveTo(-W/2,0);sh.lineTo(-W/2,Hh-R);sh.quadraticCurveTo(-W/2,Hh,-W/2+R,Hh);sh.lineTo(W/2-R,Hh);sh.quadraticCurveTo(W/2,Hh,W/2,Hh-R);sh.lineTo(W/2,0);
   sh.lineTo(dw/2,0);sh.lineTo(dw/2,dh-r);sh.quadraticCurveTo(dw/2,dh,dw/2-r,dh);sh.lineTo(-dw/2+r,dh);sh.quadraticCurveTo(-dw/2,dh,-dw/2,dh-r);sh.lineTo(-dw/2,0);sh.lineTo(-W/2,0);
   const g=new T.ExtrudeGeometry(sh,{depth:3.2,bevelEnabled:false,curveSegments:6});g.translate(0,0,-1.6);return g};
 function wall(ax,c,a0,a1,h,doors=[]){let s=a0;const band=(u,v)=>{if(v-u>.3){along(ax,c,(u+v)/2,1.1,v-u,2.06,MAT.armorD);along(ax,c,(u+v)/2,h-1.2,v-u,2.08,MAT.armorD)}};for(const[dc,dw,dh,tr]of doors.slice().sort((p,q)=>p[0]-q[0])){seg(ax,c,s,dc-dw/2,0,h);band(s,dc-dw/2-1.6);seg(ax,c,dc-dw/2,dc+dw/2,dh,h-dh);
     {const fg=frameGeo(dw,dh);if(ax==='x'){fg.rotateY(Math.PI/2);fg.translate(c,0,dc)}else fg.translate(dc,0,c);addGeo(MAT.frame,fg);
      for(const o of[-1,1])for(const sd of[-1,1]){const a=dc+o*(dw/2+.8),d=sd*1.63;ax==='x'?box(c+d,1.2,a,.06,dh-2,.5,TRIM[tr||'c'],false):box(a,1.2,c+d,.5,dh-2,.06,TRIM[tr||'c'],false)}}
     // chevron door frame and a lit strip over the door
     const t=TRIM[tr||'c'];for(const o of[-1,1]){const fx=ax==='x'?c:dc+o*(dw/2+.4),fz=ax==='x'?dc+o*(dw/2+.4):c;box(fx,0,fz,ax==='x'?2.6:.8,dh,ax==='x'?.8:2.6,MAT.armorD,false);
       deco(GEO.box,t,ax==='x'?2.7:.12,dh*.9,ax==='x'?.12:2.7,fx,dh*.45,fz);deco(GEO.box,MAT.armorD,ax==='x'?2.6:2.2,.8,ax==='x'?2.2:2.6,ax==='x'?c:dc+o*(dw/2-.6),dh+.2,ax==='x'?dc+o*(dw/2-.6):c,ax==='x'?o*.6:0,0,ax==='x'?0:-o*.6)}
     ax==='x'?box(c,dh,dc,2.4,.3,dw+1.6,t,false):box(dc,dh,c,dw+1.6,.3,2.4,t,false);s=dc+dw/2}
   seg(ax,c,s,a1,0,h);band(s===a0?a0:s+1.6,a1)}
 // hull wall with a band of windows looking into space
 function hullWall(ax,c,a0,a1,h,step,ww,skip=[]){let s=a0;for(let w=a0+step/2;w<a1;w+=step){if(skip.some(k=>Math.abs(w-k)<step/2))continue;seg(ax,c,s,w-ww/2,0,h);seg(ax,c,w-ww/2,w+ww/2,0,3);seg(ax,c,w-ww/2,w+ww/2,15,h-15);
     ax==='x'?box(c,3,w,1,12,ww,MAT.pane):box(w,3,c,ww,12,1,MAT.pane);for(const o of[-1,1])ax==='x'?box(c-Math.sign(c)*1.2,3,w+o*(ww/2+.3),.6,12,.6,MAT.armorD,false):box(w+o*(ww/2+.3),3,c-Math.sign(c)*1.2,.6,12,.6,MAT.armorD,false);s=w+ww/2}
   seg(ax,c,s,a1,0,h)}
 const roof=(r,m=MAT.roof)=>box((r.x0+r.x1)/2,r.h,(r.z0+r.z1)/2,r.x1-r.x0+2,1,r.z1-r.z0+2,m);
 const ribs=(r,step,ax,t)=>{for(let a=(ax==='z'?r.z0:r.x0)+step/2;a<(ax==='z'?r.z1:r.x1);a+=step){const w=ax==='z'?r.x1-r.x0:r.z1-r.z0,cx=ax==='z'?(r.x0+r.x1)/2:a,cz=ax==='z'?a:(r.z0+r.z1)/2;
     box(cx,r.h-1.2,cz,ax==='z'?w:1.2,1.2,ax==='z'?1.2:w,MAT.armorD,false);box(cx,r.h-1.35,cz,ax==='z'?w:.25,.12,ax==='z'?.25:w,t,false);
     for(const o of[-1,1]){const px=ax==='z'?cx+o*(w/2-1.5):cx,pz=ax==='z'?cz:cz+o*(w/2-1.5);deco(GEO.box,MAT.armorD,ax==='z'?3.5:1.2,1.2,ax==='z'?1.2:3.5,px,r.h-2.6,pz,ax==='z'?0:o*.7,0,ax==='z'?-o*.7:0)}}};
 const lightRow=(r,ax,y)=>{const n=Math.max(1,Math.round((ax==='z'?r.z1-r.z0:r.x1-r.x0)/14));for(let i=0;i<n;i++){const t=(i+.5)/n,x=ax==='z'?(r.x0+r.x1)/2:r.x0+t*(r.x1-r.x0),z=ax==='z'?r.z0+t*(r.z1-r.z0):(r.z0+r.z1)/2;
     box(x,y,z,ax==='z'?3:.8,.15,ax==='z'?.8:3,MAT.strip,false)}};
 const R={};for(const r of ROOMS)R[r.n]=r;
 box(0,-1,0,2*AX+4,1,2*AZ+4,MAT.floor,false);
 // outer hull
 hullWall('x',-AX+1,-159,AZ,30,24,14,[150]);hullWall('x',AX-1,-159,AZ,30,24,14,[150]);
 wall('z',AZ-1,-AX,AX,30,[[0,80,22,'r']]);seg('x',-AX+1,-AZ,-159,0,22);seg('x',AX-1,-AZ,-159,0,22);
 hullWall('z',-AZ+1,-60,60,18,20,16);wall('x',-60,-AZ,-160,18);wall('x',60,-AZ,-160,18);
 // inner bulkheads
 wall('z',-160,-AX,AX,22,[[0,10,4.6,'c']]);
 wall('z',-40,-AX,AX,26,[[0,10,4.6,'a'],[-60,10,8,'g'],[60,10,8,'g']]);
 wall('z',40,-AX,AX,26,[[0,10,4.6,'a'],[-60,10,7,'v'],[60,10,8,'o']]);
 wall('z',150,-AX,AX,30,[[0,10,4.6,'r'],[-60,10,7,'v'],[60,10,8,'o']]);
 wall('x',-10,-160,-40,22,[[-100,6,4.6,'g']]);wall('x',10,-160,-40,22,[[-100,6,4.6,'g']]);
 wall('x',-10,40,150,24,[[95,6,4.6,'v']]);wall('x',10,40,150,24,[[95,6,4.6,'o']]);
 // the hangar mouth: open to space behind a shimmering force field
 {const ff=new T.Mesh(new T.PlaneGeometry(80,22),bas({color:0x6fd8ff,transparent:true,opacity:.12,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}));ff.position.set(0,11,AZ-1);scene.add(ff)}
 // roofs: solid plating, glass over the farms and the commons atrium
 for(const r of ROOMS)if(r.n!=='COMMONS'&&!/FARMS/.test(r.n))roof(r,MOODK[r.n]==='B'?MAT.roofB:MAT.roof);
 {const c=R['COMMONS'];box(-71,c.h,0,74,1,82,MAT.roof);box(71,c.h,0,74,1,82,MAT.roof);box(0,c.h,-31,68,1,20,MAT.roof);box(0,c.h,31,68,1,20,MAT.roof);box(0,c.h,0,68,1,42,MAT.pane);
   for(let i=-3;i<=3;i++){box(i*10,c.h-.6,0,.8,1.2,42,MAT.armorD,false);box(0,c.h-.6,i*6,68,1.2,.8,MAT.armorD,false)}}
 for(const n of['PORT FARMS','STARBOARD FARMS']){const r=R[n];roof(r,MAT.pane);ribs(r,12,'z',TRIM.g)}
 // per-room trim and ceiling lights
 ribs(R['HANGAR'],18,'x',TRIM.r);ribs(R['ENGINEERING'],16,'z',TRIM.o);ribs(R['BRIDGE'],16,'x',TRIM.c);
 for(const r of ROOMS)if(!/SPINE/.test(r.n))lightRow(r,r.x1-r.x0>r.z1-r.z0?'x':'z',r.h-(r.h>12?2.2:.7));
 // signs
 // room-name signs over the spine doorways were removed: the lowered spine ceilings hid most of them
 // COMMONS: two-storey shopfronts under the galleries, a food court, a lounge, info kiosks and a ring arch over the atrium tree
 {const c=R['COMMONS'];
   MAT.tile=std({map:paint(512,(g,S)=>{g.fillStyle='#2c3438';g.fillRect(0,0,S,S);grime(g,S,2500,.05);for(let i=0;i<8;i++)for(let j=0;j<8;j++){g.fillStyle='#3c454a';g.fillRect(i*S/8+1,j*S/8+1,S/8-2,S/8-2)}
     g.strokeStyle='rgba(208,112,46,.7)';g.lineWidth=3;g.beginPath();g.arc(S/2,S/2,S*.42,0,7);g.stroke()}),roughness:.55,metalness:.3});MAT.tile.polygonOffset=true;MAT.tile.polygonOffsetFactor=-2;MAT.tile.polygonOffsetUnits=-2;MAT.tile.userData.noShadow=true;
   MAT.tile.map.repeat.set(1/6,1/6);box(0,0.01,0,212,.03,76,MAT.tile,false);
   MAT.wallD=std({map:paint(512,(g,S)=>hullPanels(g,S,'#98a2a5')),roughness:.55,metalness:.3});MAT.wallD.map.repeat.set(.25,.25);MAT.inset=std({color:0x56636a,roughness:.7,metalness:.3});MAT.skirt=std({color:0x2a3338,roughness:.8,metalness:.4});
   // wall dressing: dark upper paneling with inset frames and vertical ribs, a skirting band
   for(const sz of[-1,1]){const z=sz*38.9;box(0,0,z,214,.9,.3,MAT.skirt,false);for(let x=-100;x<=100;x+=12){box(x,9,z,10,15,.25,MAT.wallD,false);box(x,10,z-sz*.14,8,12,.05,MAT.inset,false);box(x+6,8,z,.6,18,.5,MAT.armorD,false)}}
   for(const sx of[-1,1]){const x=sx*106.9;box(x,0,0,.3,.9,78,MAT.skirt,false);for(let z=-30;z<=30;z+=12){box(x,3,z,.25,20,10,MAT.wallD,false);box(x-sx*.14,4,z,.05,17,8,MAT.inset,false);box(x,2,z+6,.5,22,.6,MAT.armorD,false)}}
   // ---- the atrium tower: five storeys of ring floors around an open well, under the glass roof.
   // Stair wells alternate sides each level (west/east, then north/south), two bridges cross the well at level 3, a skybridge at level 5,
   // lift pads launch you up the well, and the wings either side stay full-height halls.
   {const X0=-52,X1=52,VX=36,VZ=15,LV=[5,10,15,20],LN=['MARKET','GARDENS','WORKSHOPS','SKYDECK'];c.arena={x0:-VX,x1:VX,z0:-VZ,z1:VZ};
    MAT.fascia=std({map:paint(256,(g,S)=>plating(g,S,'#cfd5d6','#d0702e','L')),roughness:.45,metalness:.35});MAT.fascia.map.repeat.set(.5,.5);
    MAT.deck=std({map:paint(256,(g,S)=>{g.fillStyle='#454f53';g.fillRect(0,0,S,S);grime(g,S,1500,.05);for(let i=0;i<4;i++)for(let j=0;j<4;j++){g.fillStyle='#5b666b';g.fillRect(i*64+1,j*64+1,62,62)}
      g.strokeStyle='rgba(216,150,42,.3)';g.lineWidth=3;g.strokeRect(6,6,S-12,S-12)}),roughness:.6,metalness:.4});
    const sign=(t,x,y,z,ry,col,w=7)=>{const tx=paint(512,(g,S)=>{g.clearRect(0,0,S,S);g.fillStyle='rgba(6,16,20,.9)';g.fillRect(0,S*.42,S,S*.16);g.fillStyle=col;g.font='700 46px "Chakra Petch",sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(t,S/2,S/2)});
      const m=new T.Mesh(new T.PlaneGeometry(w,w),bas({map:tx,transparent:true,depthWrite:false}));m.position.set(x,y,z);m.rotation.y=ry;scene.add(m)};
    const slab=(y,x0,z0,x1,z1,hole)=>{const put=(a,b,c2,d)=>{if(c2-a>.05&&d-b>.05)floorBox((a+c2)/2,y-.4,(b+d)/2,c2-a,.4,d-b,MAT.deck)};
      if(!hole){put(x0,z0,x1,z1);return}const[hx0,hz0,hx1,hz1]=hole;put(x0,z0,hx0,z1);put(hx1,z0,x1,z1);put(hx0,z0,hx1,hz0);put(hx0,hz1,hx1,z1)};
    const shopFront=(x0,x1,sz,H)=>{const xm=(x0+x1)/2,w=x1-x0;box(xm,0,sz*35,w,H,8,MAT.wallD);
      for(let x=x0+4;x<x1-3;x+=9){box(x+1,0,sz*30.95,7,.15,.2,MAT.skirt,false);box(x+1,.8,sz*30.94,6,2.4,.06,MAT.pane,false);box(x+1,.8,sz*31.1,6,2.4,.05,MAT.win,false);box(x+1,3.5,sz*30.7,7.4,.25,1,TRIM.a,false);box(x-3.4,0,sz*30.9,.4,H,.4,MAT.armorD,false)}};
    for(const sz of[-1,1]){shopFront(-50,-8,sz,4.6);shopFront(8,50,sz,4.6);shopFront(-105,-66,sz,7);shopFront(66,105,sz,7)}
    LV.forEach((y,k)=>{const WE=k%2===0,base=k?LV[k-1]:0,lvl='level '+(k+1)+' to '+(k+2);
      slab(y,X0,-39,X1,-VZ,WE?null:[-5.4,-26,5.04,-22]);slab(y,X0,VZ,X1,39,WE?null:[-5.04,22,5.4,26]);
      slab(y,X0,-VZ,-VX,VZ,WE?[-46,-5.4,-42,5.04]:null);slab(y,VX,-VZ,X1,VZ,WE?[42,-5.04,46,5.4]:null);
      if(WE){stairTo('atrium west stair, '+lvl,-44,5.04,0,1,2.8,y,base);stairTo('atrium east stair, '+lvl,44,-5.04,0,-1,2.8,y,base);
        railEdge(-46,-5.4,-46,5.04,y);railEdge(-42,-5.4,-42,5.04,y);railEdge(-46,-5.4,-42,-5.4,y);railEdge(42,-5.04,42,5.4,y);railEdge(46,-5.04,46,5.4,y);railEdge(42,5.4,46,5.4,y)}
      else{stairTo('atrium north stair, '+lvl,5.04,-24,1,0,2.8,y,base);stairTo('atrium south stair, '+lvl,-5.04,24,-1,0,2.8,y,base);
        railEdge(-5.4,-26,5.04,-26,y);railEdge(-5.4,-22,5.04,-22,y);railEdge(-5.4,-26,-5.4,-22,y);railEdge(-5.04,22,5.4,22,y);railEdge(-5.04,26,5.4,26,y);railEdge(5.4,22,5.4,26,y)}
      // rails round the well and along the tower's open sides; a pale fascia band with an amber line and a light strip marks every floor
      const gz=k===1?[[-22,-18],[18,22]]:[],gx=k===3?[[-2.5,2.5]]:[];
      railEdge(-VX,-VZ,VX,-VZ,y,gz);railEdge(-VX,VZ,VX,VZ,y,gz);railEdge(-VX,-VZ,-VX,VZ,y,gx);railEdge(VX,-VZ,VX,VZ,y,gx);railEdge(X0,-39,X0,39,y);railEdge(X1,-39,X1,39,y);
      for(const sg of[-1,1]){box(0,y-1.1,sg*(VZ-.16),2*VX,1.1,.3,MAT.fascia,false);box(0,y-.38,sg*(VZ-.34),2*VX,.12,.06,TRIM.a,false);box(0,y-1.16,sg*(VZ-.16),2*VX,.06,.24,MAT.strip,false);
        box(sg*(VX-.16),y-1.1,0,.3,1.1,2*VZ,MAT.fascia,false);box(sg*(VX-.34),y-.38,0,.06,.12,2*VZ,TRIM.a,false);box(sg*(VX-.16),y-1.16,0,.24,.06,2*VZ,MAT.strip,false);
        box(sg*(X1+.16),y-1.1,0,.3,1.1,78,MAT.fascia,false);box(sg*(X1+.34),y-.38,0,.06,.12,78,TRIM.a,false);
        for(let x=-44;x<=44;x+=22)box(x,y-.46,sg*27,8,.05,.5,MAT.strip,false);box(sg*44,y-.46,10,.5,.05,6,MAT.strip,false);box(sg*44,y-.46,-10,.5,.05,6,MAT.strip,false)}
      sign('L'+(k+2)+' · '+LN[k],0,y-.55,-VZ+.2,0,'#d8962a');sign('L'+(k+2)+' · '+LN[k],0,y-.55,VZ-.2,Math.PI,'#d8962a');
      // what is on each floor
      for(const sz of[-1,1]){
        if(k===0)for(const x of[-44,-30,-16,16,30,44]){box(x,y,sz*36.5,7,1.1,1.8,MAT.wallD);box(x,y+2.7,sz*35.6,7.6,.12,3.4,MAT.fascia,false);box(x,y+1.9,sz*37.6,6,.6,.06,MAT.win,false);for(const o of[-3.6,3.6])box(x+o,y,sz*34.1,.12,2.7,.12,MAT.metal,false);
          if(x%4===0)box(x+5,y,sz*33,1.6,1.2,1.6,sz>0?MAT.crateA:MAT.crateB)}
        if(k===1){for(const x of[-30,-9,9,30])planter(x,y,sz*19.5,10,1.6);for(const x of[-40,-20,20,40]){box(x,y,sz*37.2,6,.5,1.2,MAT.armorD);planter(x+7,y,sz*36.5,3,3)}}
        if(k===2)for(const x of[-40,-24,24,40]){box(x,y,sz*33,.2,3,10,MAT.pane);box(x,y+3,sz*33,.4,.2,10,MAT.armorD,false);box(x+8,y,sz*36.5,5,1,1.4,MAT.armorD);box(x+8,y+1,sz*36,4.4,.7,.06,TRIM.c,false);box(x+8,y,sz*31,2.2,1.3,2.2,MAT.crateB)}
        if(k===3){for(const x of[-28,-12,12,28]){box(x,y,sz*19,5,.6,1.6,MAT.wallD);box(x,y+.6,sz*19.7,5,.7,.3,MAT.armorD,false)}box(sz*30,y,sz*33,12,1.1,1.6,MAT.wallD);box(sz*30,y+1.1,sz*33,12.3,.1,1.9,MAT.fascia,false);
          for(const x of[-20,20]){deco(GEO.cyl,MAT.metal,.08,1.4,.08,x,y+.7,sz*16.5);deco(GEO.cyl,MAT.armorD,.16,1.1,.16,x,y+1.5,sz*16.2,.9*sz,0,0)}}}});
    // structure: pylons up the well's long sides and columns under the tower's open edges
    for(const sz of[-1,1])for(const x of[-30,-12,12,30]){box(x,0,sz*15.6,.8,26,.8,MAT.armorD);box(x,0,sz*15.15,.1,26,.12,MAT.strip,false)}
    for(const sx of[-1,1])for(const z of[-26,-13,0,13,26])box(sx*52,0,z,.8,20,.8,MAT.armorD);
    // level 3 bridges across the well, each with a lift pad from the plaza and an express pad up to the skybridge
    for(const sx of[-1,1]){floorBox(sx*20,9.6,0,4,.4,30,MAT.deck);railEdge(sx*20-2,-15,sx*20-2,15,10);railEdge(sx*20+2,-15,sx*20+2,15,10);for(const o of[-2.1,2.1])box(sx*20+o,9.1,0,.16,.9,30,MAT.fascia,false);
      pad(sx*24.5,0,0,21);pad(sx*20,10,sx*7,22)}
    // level 5 skybridge with a viewing platform under the glass, hung on cables
    floorBox(0,19.6,0,72,.4,5,MAT.deck);floorBox(0,19.6,0,12,.4,12,MAT.deck);for(const sz of[-1,1]){railEdge(-36,sz*2.5,-6,sz*2.5,20);railEdge(6,sz*2.5,36,sz*2.5,20);railEdge(-6,sz*6,6,sz*6,20);
      for(const sx of[-1,1]){railEdge(sx*6,sz*2.5,sx*6,sz*6,20);box(sx*6,20,sz*6,.06,6,.06,MAT.metal,false);for(const x of[12,24])box(sx*x,20,sz*2.45,.06,6,.06,MAT.metal,false)}
      box(0,19.1,sz*2.6,72,.9,.16,MAT.fascia,false)}
    box(0,20,0,1.6,1,1.6,MAT.armorD);{const hz=mesh(new T.IcosahedronGeometry(1.5,1),bas({color:0x8fe6ff,wireframe:true,transparent:true,opacity:.6}),1,1,1,0,22.8,0);scene.add(hz);window.AHOLO=hz;GLOWS.push([0,22.8,0,0x9fe6ff,6,.3])}}
   // the atrium: planter with trees, a ring bench, a shallow pool and a steel ring arch
   box(0,0,0,14,1.2,14,MAT.soil);box(0,1.1,0,14.4,.2,14.4,MAT.metal,false);tree(0,0,900,1.2);tree(-3.5,3,901,1.2);tree(3.5,-3,902,1.2);
   for(let i=0;i<12;i++){const a=i/12*6.283;box(Math.cos(a)*10.5,0,Math.sin(a)*10.5,2.4,.5,.9,MAT.armorD)}box(0,0.02,0,26,.05,26,MAT.water,false);
   deco(new T.TorusGeometry(13,.5,8,48,Math.PI),MAT.armorD,1,1,1,0,0,0,0,0,0);deco(new T.TorusGeometry(13,.12,6,48,Math.PI),TRIM.a,1,1,1,0,0,.6,0,0,0);
   // columns: dark, with trim bands and splayed capitals
   for(const sx of[-1,1])for(const sz of[-1,1]){const x=sx*36,z=sz*15;box(x,0,z,2,26,2,MAT.wallD);box(x,0,z,2.6,1,2.6,MAT.skirt);deco(GEO.hex,TRIM.a,1.3,.15,1.3,x,4,z);deco(GEO.hex,TRIM.a,1.3,.15,1.3,x,20,z);for(const o of[-1,1])deco(GEO.box,MAT.armorD,.5,8,.5,x+o*1.3,22,z,0,0,o*.5)}
   // food court (west): counters and tables with stools
   box(-80,0,-14,22,1.1,3,MAT.armorD);box(-80,1.1,-14,22.4,.12,3.4,MAT.metal,false);box(-80,2.6,-15.4,22,.08,.08,TRIM.o,false);
   for(let i=0;i<9;i++){const x=-96+(i%3)*14,z=-2+Math.floor(i/3)*10;box(x,0,z,2.6,.9,2.6,MAT.metal);for(let k=0;k<4;k++){const a=k*1.571+.785;box(x+Math.cos(a)*2,0,z+Math.sin(a)*2,.6,.5,.6,MAT.armorD,false)}GLOWS.push([x,8,z,0xffc070,3,.18])}
   // lounge (east): low sofas, planters and a holo-model of Europa
   for(let i=0;i<6;i++){const x=58+(i%3)*14,z=-6+Math.floor(i/3)*14;box(x,0,z,5,.6,1.6,MAT.shieldA||MAT.armorD);box(x,.6,z-.7,5,.7,.3,MAT.armorD,false);planter(x+5,0,z+3,1.6,1.6)}
   {const hz=mesh(GEO.sph,bas({color:0xd8d0c0,transparent:true,opacity:.5}),1.6,1.6,1.6,80,3.5,22);scene.add(hz);box(80,0,22,2,1.4,2,MAT.armorD);GLOWS.push([80,3.5,22,0x9fe6ff,4,.25])}
   // info kiosks around the plaza
   for(const[x,z]of[[-24,-20],[24,-20],[-24,20],[24,20]]){box(x,0,z,1,2.2,.5,MAT.armorD);box(x,1.3,z+.27,.8,.7,.03,TRIM.c,false)}
   for(let i=0;i<4;i++)box(-30+i*20,0,-24+(i%2)*48,2.4,1.4,2.4,i%2?MAT.crateA:MAT.crateB);GLOWS.push([0,22,0,0xffd9a0,18,.15])}
 // FARMS: hydroponic rack rows, a catwalk, water towers; the starboard side is an orchard with pools
 {const r=R['PORT FARMS'];for(let i=0;i<7;i++){const x=r.x0+12+i*12.5;for(const[z0,z1]of[[r.z0+8,r.z0+52],[r.z0+64,r.z1-8]]){const L=z1-z0,zc=(z0+z1)/2;
       box(x,0,zc,1.4,4.2,L,MAT.metal);for(const y of[1.2,2.6,4])box(x,y,zc,1.8,.12,L,MAT.armorD,false);for(let k=0;k<Math.floor(L/1.4);k++)for(const y of[1.4,2.8])blob(GEO.ico,(k+i)%3?MAT.leaf:MAT.leafD,.5,.32,.4,x+(k%2?.5:-.5),y,z0+.7+k*1.4,k);
       for(const y of[2.4,3.8])box(x,y,zc,.3,.06,L,MAT.bloom,false)}}
   {const zc=(r.z0+r.z1)/2;floorBox(-52.5,8,zc,63,.4,4);floorBox(r.x1-5,8,zc,10,.4,12);box(r.x1-2,8.4,zc,1.4,1.1,3,MAT.armorD);box(r.x1-2.75,9.5,zc,.05,.7,2.6,TRIM.g,false);
    railEdge(-84,zc-2,-21,zc-2,8.4);railEdge(-84,zc+2,-21,zc+2,8.4);railEdge(-21,zc-6,-11,zc-6,8.4,[[-17.4,-14.6]]);railEdge(-21,zc+6,-11,zc+6,8.4);railEdge(-21,zc-6,-21,zc-2,8.4);railEdge(-21,zc+2,-21,zc+6,8.4);
    for(let x=-80;x<-21;x+=15)for(const o of[-1.8,1.8])box(x,0,zc+o,.25,8,.25,MAT.armorD);
    stairTo('port farm catwalk',-84,zc,1,0,2.8,8.4,0);stairTo('port farm balcony',-16,zc-6,0,1,2.8,8.4,0)}
   for(const z of[r.z0+6,r.z1-6]){const x=r.x0+5;boxes.push({lo:[x-3,0,z-3],hi:[x+3,10,z+3]});deco(GEO.cyl,MAT.gun,2.8,9.6,2.8,x,4.8,z);deco(GEO.sph,MAT.gun,2.8,1,2.8,x,9.6,z);for(const y of[1.5,4.5,7.5])deco(GEO.cyl,MAT.gunD,2.9,.3,2.9,x,y,z);box(x,10,z,6.6,.4,6.6,MAT.metal,false)}
   for(let z=r.z0+10;z<r.z1;z+=20)deco(GEO.cyl,MAT.metal,.3,r.x1-r.x0,.3,(r.x0+r.x1)/2,r.h-3,z,0,0,1.571)}
 {const r=R['STARBOARD FARMS'];let k=950;for(let x=r.x0+12;x<r.x1-6;x+=14)for(let z=r.z0+12;z<r.z1-6;z+=16){if(Math.abs(z-(r.z0+r.z1)/2)<8&&x<r.x0+50)continue;if(z<-140&&x>45&&x<70)continue;box(x,0,z,4,.9,4,MAT.soil);tree(x,z,k++,.9)}
   box(r.x0+26,0.03,(r.z0+r.z1)/2,40,.05,12,MAT.water,false);for(let i=0;i<14;i++)blob(GEO.cyl,MAT.lily,.6,.03,.6,r.x0+8+hash(i,5)*36,.1,(r.z0+r.z1)/2-5+hash(i,6)*10);
   {const xc=(r.x0+r.x1)/2;floorBox(xc,8,-106,4,.4,84);floorBox(xc,8,r.z0+6,14,.4,10);box(xc,8.4,r.z0+2,4,1.1,1.2,MAT.armorD);box(xc,9.5,r.z0+2.65,3.4,.7,.05,TRIM.g,false);
    railEdge(xc-2,-148,xc-2,-64,8.4);railEdge(xc+2,-148,xc+2,-64,8.4);railEdge(xc-7,-148,xc-2,-148,8.4);railEdge(xc+2,-148,xc+7,-148,8.4);railEdge(xc-7,-158,xc-7,-148,8.4);railEdge(xc+7,-158,xc+7,-148,8.4,[[-154.4,-151.6]]);
    for(let z=-140;z<-64;z+=16)for(const o of[-1.8,1.8])box(xc+o,0,z,.25,8,.25,MAT.armorD);
    stairTo('starboard farm walkway',xc,-64,0,-1,2.8,8.4,0);stairTo('starboard farm balcony',xc+7,-153,-1,0,2.8,8.4,0)}}
 // HABITAT: a main corridor from the commons to the hangar and a cross corridor to the aft spine. Each cabin has one door, onto the
 // main corridor; behind each row of cabins is a crew lounge that opens onto the cross corridor. No room leads into another room.
 {const r=R['HABITAT'],h=r.h,D=(z)=>[z,5,6,'v'];
   for(const x of[-65.5,-53.5])wall('x',x,r.z0,r.z1,h,[D(49),D(65),D(81),[95,10,6,'v'],D(109),D(125),D(141)]);
   for(const z of[88.75,101.25]){wall('z',z,r.x0,-66.5,h,[[-97,6,6,'v']]);wall('z',z,-52.5,r.x1,h,[[-21,6,6,'v']])}
   for(const[z0,z1]of[[r.z0,87.75],[102.25,r.z1]]){wall('x',-87,z0,z1,h);wall('x',-32,z0,z1,h)}
   for(const z of[57,73,117,133]){wall('z',z,-86,-66.5,h);wall('z',z,-52.5,-33,h)}
   // cabins: a bunk against the back wall and a locker; lounges: a long table with benches
   for(const zc of[49,65,81,109,125,141])for(const sx of[-1,1]){const xb=sx<0?-84.2:-34.8,xl=sx<0?-70:-49;
     box(xb,0,zc,2.4,.8,5,MAT.armorD);box(xb,1.6,zc,2.4,.15,5,MAT.metal,false);box(xl,0,zc+(zc<95?5.5:-5.5),2,2.2,.8,MAT.metal);box(xl,2.3,zc+(zc<95?5.1:-5.1),1.6,.05,.05,TRIM.v,false)}
   for(const zc of[65,125])for(const xc of[-97.5,-21]){box(xc,0,zc,3,1,14,MAT.armorD);box(xc,1,zc,3.4,.1,14.4,MAT.metal,false);for(const o of[-1,1])box(xc+o*3,0,zc,1,.6,12,MAT.metal)}}
 // ENGINEERING: the reactor column, a catwalk ring, pipes, generators and coolant tanks
 {const r=R['ENGINEERING'],cx=(r.x0+r.x1)/2,cz=(r.z0+r.z1)/2;box(cx,0,cz,12,r.h,12,MAT.hull);GLOWS.push([cx,12,cz,0x8fe6ff,26,.35]);
   floorBox(cx,9,cz-14,40,.4,4);floorBox(cx,9,cz+14,40,.4,4);floorBox(cx-18,9,cz,4,.4,32);floorBox(cx+18,9,cz,4,.4,32);
   railEdge(cx-20,cz-16,cx+20,cz-16,9.4,[[cx-1.4,cx+1.4]]);railEdge(cx-20,cz+16,cx+20,cz+16,9.4,[[cx-1.4,cx+1.4]]);railEdge(cx-20,cz-16,cx-20,cz+16,9.4);railEdge(cx+20,cz-16,cx+20,cz+16,9.4);
   railEdge(cx-16,cz-12,cx+16,cz-12,9.4);railEdge(cx-16,cz+12,cx+16,cz+12,9.4);railEdge(cx-16,cz-12,cx-16,cz+12,9.4);railEdge(cx+16,cz-12,cx+16,cz+12,9.4);
   for(const sx of[-1,1])for(const sz of[-1,1])box(cx+sx*18,0,cz+sz*14,.3,9,.3,MAT.armorD);
   stairTo('engineering ring, north',cx,cz-16,0,1,2.8,9.4,0);stairTo('engineering ring, south',cx,cz+16,0,-1,2.8,9.4,0);
   for(const[x,z]of[[r.x0+8,r.z0+8],[r.x1-8,r.z0+8],[r.x0+8,r.z1-8],[r.x1-8,r.z1-8]]){boxes.push({lo:[x-3.5,0,z-3.5],hi:[x+3.5,11,z+3.5]});deco(GEO.cyl,MAT.gun,3.2,10.6,3.2,x,5.3,z);deco(GEO.sph,MAT.gun,3.2,1.2,3.2,x,10.6,z);for(const y of[1.5,4.5,7.5])deco(GEO.cyl,MAT.gunD,3.3,.3,3.3,x,y,z);deco(GEO.box,TRIM.a,.1,.4,2,x+3.22,2.6,z);box(x,11,z,7.6,.4,7.6,MAT.metal)}
   for(let i=0;i<6;i++){const x=r.x0+16+i*13,z=i%2?r.z0+26:r.z1-26;box(x,0,z,5,3.5,8,MAT.armorD);box(x,3.5,z,5.2,.15,8.2,TRIM.o,false)}
   for(const y of[14,17,20])for(const z of[r.z0+3,r.z1-3])deco(GEO.cyl,MAT.metal,.45,r.x1-r.x0,.45,cx,y,z,0,0,1.571)}
 // HANGAR: parked fighters, a gantry crane, a control booth and cargo
 {const r=R['HANGAR'];for(let i=-4;i<=4;i++)box(i*22,0.03,180,14,.05,.4,MAT.mark,false);
   // parked Kestrel shuttles are drawn at the end of start-up (parkShuttles); their coarse collision is here so pathfinding sees it
   for(const[fx,fz,fr]of PARKED)for(const k of[-4,0,4]){const cx=fx-Math.sin(fr)*k,cz=fz-Math.cos(fr)*k;boxes.push({lo:[cx-1.6,0,cz-2.1],hi:[cx+1.6,3.4,cz+2.1]})}
   for(const x of[-80,80])box(x,0,205,2,22,2,MAT.hull);box(0,22,205,162,2,2.4,MAT.armorD,false);box(20,18,205,6,4,4,MAT.armorD,false);box(20,10,205,.3,8,.3,MAT.metal,false);
   floorBox(r.x0+10,8,170,18,.5,30);
   {const bx=r.x0+10;box(bx,8.5,155.2,18,3.6,.2,MAT.pane);box(bx+8.9,8.5,170,.2,3.6,30,MAT.pane);box(bx-6.25,8.5,184.8,5.5,3.6,.2,MAT.pane);box(bx+4.25,8.5,184.8,9.5,3.6,.2,MAT.pane);box(bx-1.5,11.6,184.8,3.2,.5,.3,TRIM.r,false);box(bx,12.1,170,18.4,.3,30.4,MAT.armorD,false);
    box(bx-8.9,8.5,170,.2,3.6,30,MAT.armorD);for(let i=0;i<4;i++){box(bx-4+i*.1,8.5,158+i*6,3,1,1.2,MAT.armorD);box(bx-4,9.6,158.6+i*6,2.6,.7,.05,TRIM.r,false)}
    box(bx,12,170,16,.1,.6,MAT.strip,false);GLOWS.push([bx,11,170,0xffc0b0,8,.2]);stairTo('hangar control booth',bx-2,185,0,-1,2.8,8.5,0)}
   for(let i=0;i<14;i++)box(-95+hash(i,141)*190,0,160+hash(i,142)*12,2+hash(i,143)*2,1+Math.floor(hash(i,144)*3),2,i%2?MAT.crateA:MAT.crateB)}
 // BRIDGE: stepped command tiers facing a wide window, consoles and a holo-table of Europa
 {const r=R['BRIDGE'];for(let i=0;i<3;i++)floorBox(0,0,r.z1-10-i*8,96-i*16,1.2*(i+1),8);
   for(let i=0;i<3;i++){const hw=48-i*8,z0=r.z1-14-i*8,z1=r.z1-6-i*8,y=1.2*(i+1);railEdge(-hw,z0,-hw,z1,y);railEdge(hw,z0,hw,z1,y);railEdge(-hw,z1,hw,z1,y,[[-2.2,2.2]]);
     stairTo('bridge, up to tier '+(i+1),0,z1,0,-1,4,y,1.2*i)}
   railEdge(-32,r.z1-30,32,r.z1-30,3.6,[[-2.2,2.2]]);stairTo('bridge, crew pit',0,r.z1-30,0,1,4,3.6,0);
   for(let i=-4;i<=4;i++){box(i*10,0,r.z0+14,4,1.1,1.6,MAT.armorD);box(i*10,1.1,r.z0+13.6,3.6,1,.12,TRIM.c,false)}
   box(0,0,r.z0+40,6,1,6,MAT.armorD)}
 // spines: low service corridors. A bulkhead ring every 8 m with solid legs for cover, panelled liners, a dark deck with a lit walkway,
 // angled ducts with light strips along the ceiling, and a lamp every other bay
 for(const n of['FORE SPINE','AFT SPINE']){const r=R[n],H=r.h,dz=n==='FORE SPINE'?-100:95,bs=[r.z0],len=r.z1-r.z0,zm=(r.z0+r.z1)/2;
   for(let k=-30;k<=30;k++){const b=dz-4+8*k;if(b>r.z0+3&&b<r.z1-3)bs.push(b)}bs.push(r.z1);
   const sh=new T.Shape(),W=7,iw=5,ih=4.4,rd=1.5;sh.moveTo(-W,0);sh.lineTo(-W,H);sh.lineTo(W,H);sh.lineTo(W,0);sh.lineTo(iw,0);sh.lineTo(iw,ih-rd);sh.quadraticCurveTo(iw,ih,iw-rd,ih);sh.lineTo(-iw+rd,ih);sh.quadraticCurveTo(-iw,ih,-iw,ih-rd);sh.lineTo(-iw,0);sh.lineTo(-W,0);
   for(let i=0;i<bs.length-1;i++){const z0=bs[i],z1=bs[i+1],L=z1-z0,zc=(z0+z1)/2,door=Math.abs(zc-dz)<.1;
     box(0,0,zc,14,.05,L,MAT.corrF,false);box(0,H-.08,zc,.8,.08,Math.min(4,L-2),MAT.stripB,false);if(i%2===0)fix(0,H-.9,zc,'B',22);
     for(const o of[-1,1]){if(door){box(o*8,0,dz-3.5,2,H,1,MAT.ringD);box(o*8,0,dz+3.5,2,H,1,MAT.ringD);box(o*8,4.6,dz,2,H-4.6,6,MAT.ringD);box(o*6.98,4.7,dz,.05,.2,5,MAT.barC,false)}
       else box(o*8,0,zc,2,H,L,MAT.linS)}
     if(i>0){const g=new T.ExtrudeGeometry(sh,{depth:1.1,bevelEnabled:false,curveSegments:8});g.translate(0,0,z0-.55);addGeo(MAT.ringP,g);
       for(const o of[-1,1]){boxes.push({lo:[o>0?5:-7,0,z0-.55],hi:[o>0?7:-5,H,z0+.55]});box(o*4.96,.7,z0,.06,2.4,.4,MAT.barC,false);box(o*6,0,z0,2,.5,1.5,MAT.roofB,false)}}}
   for(const o of[-1,1]){deco(GEO.box,MAT.roofB,2.4,.3,len,o*6.25,H-.8,zm,0,0,o*.785);deco(GEO.box,MAT.stripB,.3,.05,len,o*6.1,H-.96,zm,0,0,o*.785)}
   for(let z=r.z0+12;z<r.z1-6;z+=22){box(-3.6,0,z,2.4,1.4,3,MAT.crateB);if(z+11<r.z1-6)box(3.6,0,z+11,2.4,1.4,3,MAT.crateA)}}
 // ---- the exterior: an original long-hull colony ship. Light plating with orange accents, a tapered prow, a dorsal spine with a command
 // tower and turrets, a keel, a rotating habitat ring around the midsection, and an engine cluster framing the hangar launch bay
 {MAT.plate=std({map:paint(512,(g,S)=>plating(g,S,'#c6cdcf','#d0702e','TH-09')),roughness:.5,metalness:.35});MAT.plate.map.repeat.set(.07,.07);MAT.plateD=std({map:paint(512,(g,S)=>plating(g,S,'#848f93','#d0702e','TH-09')),roughness:.55,metalness:.4});MAT.plateD.map.repeat.set(.07,.07);
  MAT.accent=std({color:0xc8642a,roughness:.5,metalness:.3});MAT.nozzle=std({color:0x2a3034,roughness:.35,metalness:.8,side:T.DoubleSide});
  const PL=MAT.plate,PD=MAT.plateD,AC=MAT.accent,top=31.2,N=lowFx?0.5:1;
  // outer shell: roof plating (open over the commons atrium and the glass farms), side armor bands, the keel below
  for(const[x0,x1,z0,z1]of[[-112,112,-262,-160],[-12,12,-160,-40],[-112,112,40,262],[-112,-36,-40,40],[36,112,-40,40],[-36,36,-40,-22],[-36,36,22,40]])deco(GEO.box,PL,x1-x0,1.6,z1-z0,(x0+x1)/2,top,(z0+z1)/2);
  for(const sx of[-1,1]){deco(GEO.box,PD,2,6,524,sx*(AX+1.4),18,0);deco(GEO.box,PL,2.4,4,524,sx*(AX+1.6),27,0);deco(GEO.box,AC,2.5,.8,524,sx*(AX+1.7),24.6,0);deco(GEO.box,PL,3,12,524,sx*(AX+1.2),-6,0);
    for(let z=-250;z<=250;z+=24){deco(GEO.box,PD,2.8,30,1.2,sx*(AX+1.6),14,z+12)}}
  for(const[w,y,h]of[[226,-6,12],[190,-18,12],[140,-29,10],[70,-38,8]])deco(GEO.box,y===-6?PD:PL,w,h,528,0,y,0);deco(GEO.box,AC,4,6,528,0,-44,0);
  // greebles: vents, boxes and conduits scattered over the roof and the keel
  for(let i=0;i<Math.round(420*N);i++){const x=-108+hash(i,301)*216,z=-258+hash(i,302)*516;if(Math.abs(x)<38&&Math.abs(z)<24)continue;if(z>-160&&z<-40&&Math.abs(x)>12)continue;
    const w=1+hash(i,303)*5,d=1+hash(i,304)*7,h=.4+hash(i,305)*2.2;deco(GEO.box,i%5?PD:PL,w,h,d,x,top+.8+h/2,z,0,i%3?0:1.571,0)}
  for(let i=0;i<Math.round(160*N);i++){const x=-60+hash(i,311)*120,z=-258+hash(i,312)*516,w=1+hash(i,313)*4;deco(GEO.box,i%4?PD:AC,w,1+hash(i,314)*2,1+hash(i,315)*6,x,-33-hash(i,316)*6,z)}
  for(let z=-240;z<=240;z+=40)for(const sx of[-1,1])deco(GEO.cyl,PD,.8,40,.8,sx*(AX+3.2),20,z,1.571,0,0);
  // the prow: tapered armored sections stepping down and out ahead of the bridge window, with a sensor keel and accent chevrons
  for(let i=0;i<8;i++){const t=i/7,w=228*(1-t*.82),z=-268-i*44,y0=-40+t*16,h=36-t*26;deco(GEO.box,i%2?PL:PD,w,h,46,0,y0+h/2-6,z);deco(GEO.box,AC,w*.5,.8,47,0,y0+h-6.2,z);
    for(const sx of[-1,1])deco(GEO.box,PL,6,h*.8,40,sx*(w/2+2),y0+h/2-6,z,0,sx*.25,0)}
  deco(GEO.cone,PL,22,90,14,0,-16,-650,-1.571,0,0);deco(GEO.box,PD,2,3,330,0,-2,-420);GLOWS.push([0,-12,-700,0xff4a3a,14,.9]);
  // dorsal spine, command tower and turrets
  deco(GEO.box,PD,12,3,200,0,top+2.3,-150);deco(GEO.box,PD,12,3,190,0,top+2.3,150);deco(GEO.box,AC,12.4,.5,200,0,top+3.6,-150);
  for(let i=0;i<5;i++){const w=34-i*6,h=8,z=-205;deco(GEO.box,i%2?PL:PD,w,h,40-i*5,0,top+3+i*h+h/2,z);for(const sx of[-1,1])deco(GEO.box,MAT.win,.2,1.2,30-i*5,sx*(w/2+.1),top+3+i*h+h/2+1,z)}
  deco(GEO.cyl,PD,.8,40,.8,0,top+63,-205);deco(GEO.cyl,PD,.5,24,.5,6,top+55,-198);deco(new T.SphereGeometry(1,16,8,0,6.283,0,1.1),PL,7,3.5,7,-10,top+46,-212,-.6,0,0);GLOWS.push([0,top+84,-205,0xff4a3a,8,.9]);
  for(const z of[-120,-80,80,120,190]){deco(GEO.cyl,PD,5,3,5,0,top+5,z);deco(GEO.box,PL,7,3.2,8,0,top+8,z);for(const o of[-1.4,1.4])deco(GEO.cyl,PD,.6,16,.6,o,top+8.5,z-10,1.571,0,0)}
  // engine cluster around the hangar launch bay (the bay mouth stays clear for the skiffs)
  deco(GEO.box,PD,224,8,40,0,34,282);deco(GEO.box,PD,224,8,40,0,-12,282);for(const sx of[-1,1])deco(GEO.box,PD,64,46,40,sx*80,11,282);
  for(const sx of[-1,1])deco(GEO.box,AC,1.2,26,41,sx*48,12,282);deco(GEO.box,AC,96,1.2,41,0,25.6,282);
  for(const[x,y,r]of[[-82,56,20],[0,62,22],[82,56,20],[-92,-34,22],[0,-40,24],[92,-34,22],[-140,12,18],[140,12,18]]){deco(GEO.cyl,PL,r*1.15,30,r*1.15,x,y,318,1.571,0,0);
    deco(new T.CylinderGeometry(1,.7,1,24,1,true),MAT.nozzle,r,26,r,x,y,345,-1.571,0,0);deco(GEO.tor,MAT.strip,r*.62,r*.62,r*.62,x,y,357,0,0,0);deco(GEO.box,AC,r*2.3,1.2,30,x,y+r*1.15,318);
    GLOWS.push([x,y,362,0x7fd8ff,r*4.2,.6],[x,y,380,0x5fb8ff,r*2.6,.35])}
  for(const[x,y,z,c]of[[-114,30,-250,0xff3b3b],[114,30,-250,0x3bff6a],[-114,30,250,0xff3b3b],[114,30,250,0x3bff6a],[0,-46,0,0xffffff],[0,top+3,0,0xffffff]])GLOWS.push([x,y,z,c,4,.9]);
 }
 // ---- exterior silhouette and ordered detail (original design): sloped side armor in segments with panel gaps, stepped dorsal shoulders,
 // twin engine nacelles on swept pylons, rows of lit cabin windows, roof panel lines; plus coarse collision so the skiff cannot pass through the hull
 {const PL=MAT.plate,PD=MAT.plateD,AC=MAT.accent,top=31.2,EB=[];const solid=(x0,y0,z0,x1,y1,z1)=>EB.push({lo:[x0,y0,z0],hi:[x1,y1,z1]});
  for(const sx of[-1,1]){
    for(let z=-252;z<=244;z+=31){deco(GEO.box,(z/31|0)%2?PL:PD,9,26,30,sx*(AX+7),-20,z+15,0,0,sx*.42);deco(GEO.box,AC,.5,24,30.2,sx*(AX+11.2),-19.5,z+15,0,0,sx*.42)}
    for(let z=-250;z<=250;z+=12)for(const y of[6,11.5])deco(GEO.box,MAT.win,.15,1,6,sx*(AX+2.6),y+16,z);
    deco(GEO.box,PL,14,5,500,sx*(AX-8),top+3.3,0);deco(GEO.box,PD,9,4,480,sx*(AX-9),top+7.6,0);deco(GEO.box,AC,14.2,.6,500,sx*(AX-8),top+5.6,0);
    for(let z=-240;z<=240;z+=20)deco(GEO.box,PD,15,1.2,1,sx*(AX-8),top+5.9,z);
    // nacelle and swept pylon
    const nx=sx*(AX+62),ny=6;deco(GEO.cyl,PL,16,150,16,nx,ny,180,1.571,0,0);deco(GEO.cyl,PD,17,10,17,nx,ny,110,1.571,0,0);deco(GEO.cyl,AC,17.2,2,17.2,nx,ny,140,1.571,0,0);
    for(let i=0;i<6;i++)deco(GEO.box,PD,2,34,6,nx+Math.cos(i*1.047)*16.5,ny+Math.sin(i*1.047)*16.5,180,0,0,i*1.047);
    deco(new T.CylinderGeometry(1,.75,1,28,1,true),MAT.nozzle,13,20,13,nx,ny,264,-1.571,0,0);deco(GEO.tor,MAT.strip,10,10,10,nx,ny,272,0,0,0);GLOWS.push([nx,ny,278,0x7fd8ff,70,.55],[nx,ny,300,0x5fb8ff,40,.3]);
    deco(GEO.tor,PD,15,15,15,nx,ny,106,0,0,0);deco(new T.CircleGeometry(1,24),MAT.nozzle,14,14,1,nx,ny,104.5,0,Math.PI,0);
    for(const z of[150,215]){deco(GEO.box,PD,64,7,22,sx*(AX+31),ny+3,z,0,sx*-.18,sx*-.12);deco(GEO.box,AC,64,.6,22.2,sx*(AX+31),ny+6.8,z,0,sx*-.18,sx*-.12)}
    solid(Math.min(nx-17,nx+17),ny-17,104,Math.max(nx-17,nx+17),ny+17,276);solid(sx>0?AX:-(AX+62),ny-1,140,sx>0?AX+62:-AX,ny+7,226);
    solid(sx>0?AX:-(AX+16),-40,-262,sx>0?AX+16:-AX,top+2,262)}
  // roof panel lines and lit hatches
  for(let z=-256;z<=256;z+=16)deco(GEO.box,PD,224,.2,.5,0,top+.85,z);for(let i=0;i<24;i++){const x=-90+hash(i,401)*180,z=-250+hash(i,402)*500;if(Math.abs(x)<38&&Math.abs(z)<24)continue;deco(GEO.box,MAT.strip,3,.1,3,x,top+.9,z)}
  // coarse collision for the hull shell, keel, prow, tower and engine block (the hangar mouth stays open)
  solid(-AX,-48,-AZ,AX,-1,AZ);solid(-AX,top-.8,-AZ,AX,top+8,-160);solid(-AX,top-.8,40,AX,top+8,AZ);solid(-AX,top-.8,-160,-36,top+8,40);solid(36,top-.8,-160,AX,top+8,40);
  for(let i=0;i<8;i++){const t=i/7,w=228*(1-t*.82),z=-268-i*44,y0=-40+t*16,h=36-t*26;solid(-w/2-4,y0-6,z-23,w/2+4,y0+h-6,z+23)}
  solid(-17,top+3,-225,17,top+43,-185);solid(-112,30,262,112,38,302);solid(-112,-16,262,112,-8,302);solid(-112,-12,262,-48,34,302);solid(48,-12,262,112,34,302);
  for(const[x,y,r]of[[-82,56,20],[0,62,22],[82,56,20],[-92,-34,22],[0,-40,24],[92,-34,22],[-140,12,18],[140,12,18]])solid(x-r*1.15,y-r*1.15,302,x+r*1.15,y+r*1.15,358);
  for(const b of EB)boxes.push(b)}
 {const PL=MAT.plate,PD=MAT.plateD,AC=MAT.accent,top=31.2;
  for(const z of[-215,-190,150,175])deco(GEO.box,AC,150,.25,7,0,top+.95,z,0,.42,0);
  for(const sx of[-1,1])for(const z of[-205,-125,95,205]){deco(GEO.box,PL,9,15,44,sx*(AX+5.5),9,z);deco(GEO.box,PD,5,9,30,sx*(AX+10),9,z);deco(GEO.box,AC,.4,9.2,4,sx*(AX+12.6),9,z+10);deco(GEO.box,MAT.win,.2,1,20,sx*(AX+12.6),12,z-3)}
  const mark=(t,x,y,z,rx,ry,w,hgt)=>{const tx=paint(512,(g,S)=>{g.clearRect(0,0,S,S);g.fillStyle='rgba(24,32,36,.85)';g.font='700 150px "Chakra Petch",sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(t,S/2,S/2)});
    const m=new T.Mesh(new T.PlaneGeometry(w,hgt),bas({map:tx,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4}));m.position.set(x,y,z);m.rotation.set(rx,ry,0);scene.add(m)};
  mark('TH-09',-70,top+1.2,-212,-Math.PI/2,0,56,56);mark('TH-09',70,top+1.2,-110,-Math.PI/2,0,70,70)}
 // the hull silhouette: a stepped command citadel over the aft decks, a wide low hammerhead bow (kept below the bridge windows), angled flank
 // armour and a deep keel fin, and four radiator wings in an X at the stern. Coarse collision so the skiff cannot fly through them.
 {const PL=MAT.plate,PD=MAT.plateD,AC=MAT.accent,top=31.2,sol=(x0,y0,z0,x1,y1,z1)=>boxes.push({lo:[x0,y0,z0],hi:[x1,y1,z1]});
  let y=top+1.5;[[164,26,200,150],[126,24,160,156],[86,22,116,166],[52,18,62,184]].forEach(([w,h,d,z],i)=>{deco(GEO.box,i%2?PD:PL,w,h,d,0,y+h/2,z);deco(GEO.box,AC,w+.6,1.2,d+.6,0,y+h-2,z);
    for(const sx of[-1,1]){deco(GEO.box,PD,10,h*1.25,d*.9,sx*(w/2+3),y+h/2-1,z,0,0,sx*.45);for(let k=0;k<3;k++)deco(GEO.box,MAT.win,.3,1.2,d*.7,sx*(w/2+.2),y+h*.3+k*4,z)}
    deco(GEO.box,PD,w*.9,h*1.25,12,0,y+h/2-1,z-d/2-3,.5,0,0);deco(GEO.box,PD,w*.9,h*1.1,10,0,y+h/2-1,z+d/2+2,-.35,0,0);sol(-w/2-6,y,z-d/2-6,w/2+6,y+h,z+d/2+4);y+=h});
  deco(GEO.box,PL,124,5,22,0,y-7,166);deco(GEO.box,MAT.win,125,1.4,22.4,0,y-6,166);sol(-62,y-9.5,155,62,y-4.5,177);
  for(const x of[-18,0,18])deco(GEO.cyl,PD,1,60,1,x,y+30,196);deco(GEO.box,PD,60,1.5,1.5,0,y+44,196);GLOWS.push([0,y+62,196,0xff4a3a,10,.9]);
  deco(GEO.box,PL,300,44,80,0,-24,-300);deco(GEO.box,AC,301,2,81,0,-8,-300);for(const sx of[-1,1]){deco(GEO.box,PD,70,48,90,sx*150,-24,-300,0,sx*.5,0);deco(GEO.box,MAT.win,60,2,.4,sx*100,-14,-340.3)}
  sol(-190,-46,-345,190,-2,-258);
  deco(GEO.box,PD,14,70,330,0,-82,20);deco(GEO.box,PL,44,24,260,0,-58,20);deco(GEO.box,AC,14.4,2,330,0,-114,20);deco(GEO.box,PD,14,44,60,0,-78,-170,.5,0,0);sol(-7,-117,-145,7,-48,185);
  for(const sx of[-1,1])for(const z of[-190,-70]){deco(GEO.box,PL,16,44,104,sx*(AX+17),-24,z,0,0,sx*.3);deco(GEO.box,AC,1,44,6,sx*(AX+24.5),-24,z-40,0,0,sx*.3);deco(GEO.box,PD,6,26,60,sx*(AX+24),-24,z+14,0,0,sx*.3)}
  for(const sx of[-1,1])for(const sy of[-1,1]){const a=.6,ca=Math.cos(a),sa=Math.sin(a),cx=sx*(126+112*ca),cy=-6+sy*112*sa,rz=sx*sy*a;
    deco(GEO.box,MAT.roofB,224,3,240,cx,cy,120,0,0,rz);deco(GEO.box,AC,226,3.6,5,cx,cy,-1,0,0,rz);deco(GEO.box,AC,226,3.6,5,cx,cy,241,0,0,rz);
    for(let k=-2;k<=2;k++)deco(GEO.box,PL,3,5,242,cx+sx*k*50*ca,cy+sy*k*50*sa,120,0,0,rz);
    for(let k=0;k<4;k++){const u=-84+56*k,px=cx+sx*u*ca,py=cy+sy*u*sa;sol(px-25,py-19,0,px+25,py+19,240)}}}
 // the habitat ring: a rotating ring around the midsection on four spokes (scenery; the skiff flies through it)
 {const g=new T.Group(),rg=inst(bake(a=>{a(new T.TorusGeometry(1,.06,10,96),MAT.plate,250,250,250);a(new T.TorusGeometry(1,.012,6,96),MAT.accent,250,250,250,0,0,15.5);a(new T.TorusGeometry(1,.012,6,96),MAT.accent,250,250,250,0,0,-15.5);
     for(let i=0;i<4;i++){const an=i*1.571+.785;a(GEO.cyl,MAT.plateD,4,130,4,Math.cos(an)*185,Math.sin(an)*185,0,0,0,an-1.571)}
     for(let i=0;i<24;i++){const an=i/24*6.283;a(GEO.box,MAT.plateD,30,18,34,Math.cos(an)*250,Math.sin(an)*250,0,0,0,an)}}),false);g.add(rg);
   const lp=[];for(let i=0;i<240;i++){const an=i/240*6.283;lp.push(Math.cos(an)*236,Math.sin(an)*236,(i%2?1:-1)*9)}const lg=new T.BufferGeometry();lg.setAttribute('position',new T.Float32BufferAttribute(lp,3));
   g.add(new T.Points(lg,new T.PointsMaterial({color:0xffd9a0,size:2.2,sizeAttenuation:false})));g.position.set(0,0,0);scene.add(g);window.HABRING=g;g.visible=false}
 // ---- interiors in the commons style: per-room tiled floors, dark paneled walls with insets, skirting, ribs and a trim band,
 // skipping doorways and hull windows (found by probing the collision boxes), plus room-specific props
 {const tileMat=(a,b,line,motif)=>{const m=std({map:paint(512,(g,S)=>{g.fillStyle=a;g.fillRect(0,0,S,S);grime(g,S,2500,.06);const n=motif==='grate'?16:8;
      for(let i=0;i<n;i++)for(let j=0;j<n;j++){g.fillStyle=b;g.fillRect(i*S/n+1,j*S/n+1,S/n-2,S/n-2);if(motif==='grate'){g.fillStyle='rgba(0,0,0,.35)';g.fillRect(i*S/n+3,j*S/n+S/n/2-1,S/n-6,2)}}
      g.strokeStyle=line;g.lineWidth=4;if(motif==='hazard'){for(let k=-S;k<S*2;k+=48){g.beginPath();g.moveTo(k,0);g.lineTo(k+S,S);g.stroke()}}else if(motif==='ring'){g.beginPath();g.arc(S/2,S/2,S*.4,0,7);g.stroke()}else g.strokeRect(8,8,S-16,S-16)}),roughness:.6,metalness:.35});
    m.map.repeat.set(1/6,1/6);m.polygonOffset=true;m.polygonOffsetFactor=-2;m.polygonOffsetUnits=-2;m.userData.noShadow=true;return m};
  const FL={'BRIDGE':tileMat('#2c3438','#3c454a','rgba(40,150,175,.7)','ring'),'PORT FARMS':tileMat('#2a322c','#3a443c','rgba(50,140,70,.6)','grate'),'STARBOARD FARMS':tileMat('#2a322c','#3a443c','rgba(50,140,70,.6)','grate'),
    'FORE SPINE':tileMat('#717c80','#7c878b','rgba(40,150,175,.7)',''),'AFT SPINE':tileMat('#717c80','#7c878b','rgba(208,112,46,.75)',''),'HABITAT':tileMat('#2f2d35','#403e48','rgba(120,80,190,.6)',''),
    'ENGINEERING':tileMat('#1b1d1f','#272a2c','rgba(208,112,46,.7)','grate'),'HANGAR':tileMat('#191c1e','#24292c','rgba(200,70,60,.55)','')};
  const TR={'BRIDGE':TRIM.c,'PORT FARMS':TRIM.g,'STARBOARD FARMS':TRIM.g,'FORE SPINE':TRIM.c,'AFT SPINE':TRIM.a,'HABITAT':TRIM.v,'ENGINEERING':TRIM.o,'HANGAR':TRIM.r};
  const solidAt=(x,y,z)=>inBox(x,y,z);
  // find the wall face just outside a room edge, or null when there is an opening there
  const face=(x,z,nx,nz,y)=>{for(let d=0;d<=3;d+=.25){if(solidAt(x+nx*d,y,z+nz*d))return d}return null};
  for(const r of ROOMS){if(r.n==='COMMONS'||/SPINE/.test(r.n))continue;const fm=FL[r.n],tr=TR[r.n],mk=MOODK[r.n],dk=mk==='B',lm=dk?MAT.linB:MAT.linA,up=dk?MAT.upB:MAT.upA,pil=dk?MAT.ringP:MAT.ringD;
    if(fm)box((r.x0+r.x1)/2,.01,(r.z0+r.z1)/2,r.x1-r.x0,.03,r.z1-r.z0,fm,false);
    {const cx=(r.x0+r.x1)/2,cz=(r.z0+r.z1)/2,lx=r.x1-r.x0-6,lz=r.z1-r.z0-6,ln=MAT['lane'+mk];box(cx,.035,cz,lx,.02,3,ln,false);box(cx,.035,cz,3,.02,lz,ln,false);
      for(const o of[-1,1]){box(cx,.04,cz+o*1.5,lx,.02,.1,tr,false);box(cx+o*1.5,.04,cz,.1,.02,lz,tr,false)}}
    const sides=[['z',r.z0,0,-1,r.x0,r.x1],['z',r.z1,0,1,r.x0,r.x1],['x',r.x0,-1,0,r.z0,r.z1],['x',r.x1,1,0,r.z0,r.z1]];
    for(const[ax,c,nx,nz,a0,a1]of sides){const step=6;
      for(let a=a0+step/2;a<a1;a+=step){const P=(o,y)=>face(ax==='z'?a+o:c,ax==='z'?c:a+o,nx,nz,y),d=P(0,1.5);if(d===null||P(-2.7,1.5)!==d||P(2.7,1.5)!==d)continue;
        const x=ax==='z'?a:c,z=ax==='z'?c:a,fx=x+nx*(d-.12),fz=z+nz*(d-.12),full=P(0,4)===d,tall=P(0,6)===d;
        const B=(m,w,h,y,o=0)=>{if(ax==='z')box(fx,y,fz-nz*o,w,h,.2,m,false);else box(fx-nx*o,y,fz,.2,h,w,m,false)};
        if(full){B(lm,5.7,5,0);B(tr,6,.1,5.02)}else B(up,5.7,2.9,0);
        if(full&&tall&&r.h>9){const top=Math.min(r.h-2.5,16);B(up,6,top-5.2,5.2,-.02)}
        if(ax==='z')box(fx+step/2,0,fz,.7,full?5.4:3,.6,pil,false);else box(fx,0,fz+step/2,.6,full?5.4:3,.7,pil,false)}}}
  // hanging lamps: each one is a place a real light can sit while you are near it
  for(const r of ROOMS){if(/SPINE/.test(r.n))continue;const mk=MOODK[r.n],hl=Math.min(r.h-1.2,6.5),st=mk==='B'?MAT.stripB:MAT.stripA,
      nx=Math.max(1,Math.round((r.x1-r.x0)/26)),nz=Math.max(1,Math.round((r.z1-r.z0)/26));
    for(let i=0;i<nx;i++)for(let j=0;j<nz;j++){const x=r.x0+(i+.5)*(r.x1-r.x0)/nx,z=r.z0+(j+.5)*(r.z1-r.z0)/nz;if(r.n==='COMMONS'&&Math.abs(x)<54)continue;
      let ok=true;for(let y=hl-1;y<=hl+.6;y+=.4)if(inBox(x,y,z))ok=false;if(!ok)continue;
      fix(x,hl-.3,z,mk);box(x,hl,z,3,.12,.8,st,false);box(x,hl+.12,z,3.3,.25,1.1,MAT.roofB,false);if(r.h-hl>1.5)box(x,hl+.37,z,.12,r.h-hl-.37,.12,MAT.armorD,false)}}
  // the atrium tower: a strip light under each gallery floor
  for(const L of[0,5,10,15,20])for(const[x,z]of[[-44,0],[44,0],[-44,-27],[-44,27],[44,-27],[44,27],[0,-27],[0,27],[-22,-27],[-22,27],[22,-27],[22,27]]){
    const y=L<20?L+4.35:24.3;if(L<20&&!inBox(x,L+4.8,z))continue;if(inBox(x,y-.3,z))continue;fix(x,y-.3,z,'A',20);box(x,y,z,2.4,.08,.6,MAT.stripA,false);if(L===20)box(x,y+.08,z,.1,26-y-.08,.1,MAT.armorD,false)}
  // COMMONS: an arcade of rounded bulkhead arches along both edges of the atrium well, walkways under the galleries
  {const sh=new T.Shape(),W=5,Hh=4.6,iw=4,ih=3.9,rd=1.2;sh.moveTo(-W,0);sh.lineTo(-W,Hh);sh.lineTo(W,Hh);sh.lineTo(W,0);sh.lineTo(iw,0);sh.lineTo(iw,ih-rd);sh.quadraticCurveTo(iw,ih,iw-rd,ih);sh.lineTo(-iw+rd,ih);sh.quadraticCurveTo(-iw,ih,-iw,ih-rd);sh.lineTo(-iw,0);sh.lineTo(-W,0);
    for(const sz of[-1,1]){const z=sz*15.7;
      for(let x=-40;x<=40;x+=10){const g=new T.ExtrudeGeometry(sh,{depth:.9,bevelEnabled:false,curveSegments:8});g.translate(x,0,z-.45);addGeo(MAT.ringD,g);box(x,3.82,z,5,.06,.5,MAT.stripA,false)}
      for(let x=-45;x<=45;x+=10){boxes.push({lo:[x-1,0,z-.45],hi:[x+1,4.6,z+.45]});for(const o of[-1,1])box(x+o*1.03,.7,z,.06,2.2,.4,MAT.barO,false);box(x,0,z,2.3,.45,1.3,MAT.roofB,false)}
      box(0,.035,sz*27,96,.02,3,MAT.laneA,false);for(const o of[-1,1])box(0,.04,sz*27+o*1.5,96,.02,.1,TRIM.a,false);
      box(0,.035,sz*28,3,.02,20,MAT.laneA,false);for(const o of[-1,1])box(o*1.5,.04,sz*28,.1,.02,20,TRIM.a,false)}}
  // HANGAR: landing pads, fuel lines, tool carts, crew lockers, overhead light bars
  {const r=R['HANGAR'];for(const[x,z]of[[-55,215],[55,215],[0,222]]){deco(new T.RingGeometry(6,6.6,40),TRIM.r,1,1,1,x,.05,z,-1.571,0,0);deco(new T.RingGeometry(8,8.3,40),MAT.mark,1,1,1,x,.05,z,-1.571,0,0)}
    for(let i=0;i<6;i++){const x=-90+i*36;deco(GEO.cyl,MAT.armorD,.25,30,.25,x,.25,230,1.571,0,0);box(x,0,203,2.4,1.1,1.4,MAT.armorD);box(x,1.1,203,2.2,.08,1.2,TRIM.r,false);box(x,0,210,.6,1.8,.6,MAT.metal)}
    for(let z=170;z<255;z+=17)box(0,r.h-2,z,160,.25,.6,MAT.strip,false)}
  // HANGAR set pieces at eye level: storage racks on the back wall, gantry towers on the side walls, fuel bowsers and ordnance carts by the pads.
  // The launch lane (x within 40 of the centre line from z 195 to the mouth), the skiff routes and the middle of the floor stay clear.
  {const r=R['HANGAR'],SB=(x,y,z,w,h,d)=>boxes.push({lo:[x-w/2,y,z-d/2],hi:[x+w/2,y+h,z+d/2]});
    for(const sx of[-1,1])for(let k=0;k<6;k++){const x=sx*(20+k*12),z=r.z0+2.6,w=10;SB(x,0,z,w,6.4,4);
      for(const ux of[-w/2+.2,-w/6,w/6,w/2-.2])for(const uz of[-1.8,1.8])box(x+ux,0,z+uz,.22,6.4,.22,MAT.metal,false);
      for(const y of[.15,2.25,4.35])box(x,y,z,w,.14,4,MAT.armorD,false);box(x,6.3,z,w+.2,.15,4.2,TRIM.a,false);box(x,0,z+2.12,w,.25,.06,TRIM.a,false);
      for(const ex of[-w/2+.2,w/2-.2])deco(GEO.box,MAT.metal,.1,5.4,.1,x+ex,3.2,z,.6,0,0);
      for(let L=0;L<3;L++){let cx=x-w/2+.4,j=0;while(j<8){const cw=1.1+hash(k*7+L*3+j,sx+5)*1.5,ch=.7+hash(k*5+L+j,sx+9)*1.1;if(cx+cw>x+w/2-.3)break;
        box(cx+cw/2,[.29,2.39,4.49][L],z+(hash(j,L+k)-.5)*.5,cw,ch,2.2+hash(j+3,L)*.9,(j+L+k)%2?MAT.crateA:MAT.crateB,false);cx+=cw+.25;j++}}}
    for(const sx of[-1,1])for(const z of sx<0?[200,226,250]:[172,200,226,250]){const x=sx*101;box(x,0,z,6,1,5,MAT.armorD);box(x-sx*3.02,0,z,.04,1,5,TRIM.a,false);
      for(const ox of[-2.8,2.8])for(const oz of[-2.3,2.3])box(x+ox,1,z+oz,.35,9,.35,MAT.metal,false);
      for(const y of[4,7.5]){box(x,y,z,6,.2,5,MAT.armorD,false);for(const oz of[-2.4,2.4])box(x,y+1,z+oz,6,.06,.06,MAT.metal,false);box(x-sx*2.95,y+1,z,.06,.06,5,MAT.metal,false);for(const oz of[-2.4,0,2.4])box(x-sx*2.95,y,z+oz,.06,1,.06,MAT.metal,false)}
      for(const oz of[-2.3,2.3])for(const[y0,h]of[[1,3],[4,3.5],[7.5,2.5]])deco(GEO.box,MAT.metal,.12,Math.hypot(h,5.6),.12,x,y0+h/2,z+oz,0,0,Math.atan2(5.6,h)*(oz>0?1:-1));
      for(let y=1.3;y<7.5;y+=.35)box(x-sx*3.05,y,z,.05,.05,.6,MAT.metal,false);for(const oz of[-.32,.32])box(x-sx*3.05,1,z+oz,.06,7.6,.06,MAT.metal,false);
      box(x,4.2,z-.9,2,1.3,1.1,MAT.armorD,false);box(x-sx*1.01,4.7,z-.9,.04,.6,.9,TRIM.c,false);box(x+sx*1.2,7.7,z+1,1.4,1.2,1.4,MAT.crateA,false);box(x-sx*.6,7.7,z+1.2,1.1,.8,1.1,MAT.crateB,false);
      box(x,10,z,.6,.3,.6,MAT.armorD,false);deco(GEO.sph,MAT.amber,.25,.25,.25,x,10.45,z);GLOWS.push([x,10.45,z,0xffb238,2.5,.6])}
    for(const sx of[-1,1]){const x=sx*68,z=206;SB(x,0,z,2.6,2.7,5.2);box(x,.5,z,2.4,1.1,5,MAT.armorD,false);deco(GEO.cyl,MAT.cap,1.0,3.4,1.0,x,2.1,z+.6,1.571,0,0);
      for(const e of[-1.15,2.35])deco(GEO.cyl,MAT.gunD,1.05,.14,1.05,x,2.1,z+e,1.571,0,0);box(x,1.6,z-1.95,2.2,1.4,1.1,MAT.armorD,false);box(x,2.1,z-2.52,1.9,.6,.04,MAT.pane,false);
      for(const ox of[-1.25,1.25])for(const oz of[-1.6,1.6])deco(GEO.cyl,MAT.gunD,.45,.3,.45,x+ox,.45,z+oz,0,0,1.571);for(const ox of[-1.21,1.21])box(x+ox,.9,z,.04,.18,5,TRIM.a,false);
      deco(GEO.tor,MAT.gunD,.35,.35,.35,x-sx*1.35,1.5,z+1.6,0,1.571,0);deco(GEO.cyl,MAT.gunD,.07,9,.07,x-sx*5.8,.07,z+1.6,0,0,1.571);
      box(x-sx*3.2,0,z-3.2,1.4,1.1,.8,MAT.armorD);box(x-sx*3.2,1.1,z-3.2,1.2,.06,.6,TRIM.r,false)}
    for(const[x,z]of[[-44,184],[48,182]]){SB(x,0,z,2,1.7,3.4);box(x,.35,z,1.8,.45,3.2,MAT.armorD,false);for(const ox of[-.85,.85])for(const oz of[-1.2,1.2])deco(GEO.cyl,MAT.gunD,.3,.2,.3,x+ox,.3,z+oz,0,0,1.571);
      for(const ox of[-.5,0,.5]){deco(GEO.cyl,MAT.cap,.17,2.4,.17,x+ox,1.05+(ox?0:.3),z,1.571,0,0);const c=new T.ConeGeometry(1,1,12);deco(c,TRIM.o,.17,.5,.17,x+ox,1.05+(ox?0:.3),z-1.45,-1.571,0,0);
        for(const a of[0,1.571])deco(GEO.box,MAT.gunD,.02,.3,.35,x+ox,1.05+(ox?0:.3),z+1.05,0,0,a)}box(x,.8,z+1.6,1.8,.9,.06,MAT.armorD,false)}
    for(const[fx,fz,fr]of PARKED){const c=Math.cos(fr),sn=Math.sin(fr);for(const[ux,uz,L,ang]of[[-6.5,0,18,0],[6.5,0,18,0],[0,-9,13,1.571],[0,9,13,1.571]]){
        const x=fx+ux*c+uz*sn,z=fz-ux*sn+uz*c;deco(GEO.box,TRIM.a,.25,.02,L,x,.04,z,0,fr+ang,0)}
      for(const ux of[-3.5,3.5])for(const uz of[-5,5])deco(GEO.cyl,MAT.gunD,.18,.08,.18,fx+ux*c+uz*sn,.04,fz-ux*sn+uz*c)}
    for(const sx of[-1,1])deco(GEO.cyl,MAT.gunD,.09,40,.09,sx*42,.09,175,1.571,0,0)
    // shipping containers stacked two high, ribbed sides, door ends with bars
    const cont=(x,y,z,ry,m)=>{const c=Math.cos(ry),sn=Math.sin(ry);deco(GEO.box,m,2.6,2.6,12,x,y+1.3,z,0,ry,0);for(let k=-5;k<=5;k++)for(const o of[-1.32,1.32])deco(GEO.box,MAT.gunD,.06,2.5,.12,x+o*c+k*1.05*sn,y+1.3,z-o*sn+k*1.05*c,0,ry,0);
      for(const e of[-6.02,6.02]){deco(GEO.box,MAT.gunD,2.7,.15,.1,x+e*sn,y+2.55,z+e*c,0,ry,0);for(const o of[-.6,.6])deco(GEO.box,MAT.metal,.06,2.4,.06,x+o*c+e*sn,y+1.3,z-o*sn+e*c,0,ry,0)}};
    for(const sx of[-1,1])for(const[dx,dz,h]of[[52,170,2],[56,180,1],[60,170,1]]){const x=sx*dx;for(let l=0;l<h;l++)cont(x,l*2.6,dz,0,(l+dx)%2?MAT.crateA:MAT.crateB);SB(x,0,dz,2.7,h*2.6,12.1)}
    // engine test stands with a spare engine on a cradle
    for(const sx of[-1,1]){const x=sx*82,z=180;SB(x,0,z,6,4.6,10);box(x,0,z,6,.6,10,MAT.armorD,false);for(const oz of[-3,0,3]){box(x,.6,z+oz,4.4,1.2,.6,MAT.metal,false)}
      deco(GEO.cyl,MAT.gun,1.6,7,1.6,x,3,z,1.571,0,0);deco(GEO.cyl,MAT.gunD,1.75,.3,1.75,x,3,z-2.6,1.571,0,0);deco(GEO.cyl,MAT.gunD,1.75,.3,1.75,x,3,z+1.2,1.571,0,0);
      deco(new T.CylinderGeometry(.8,1,1,20,1,true),MAT.gunD,1.4,2.2,1.4,x,3,z+4.6,1.571,0,0);deco(GEO.cyl,MAT.amber,1.2,.05,1.2,x,3,z-3.52,1.571,0,0);
      for(let i=0;i<10;i++){const a=i/10*6.283;deco(GEO.box,MAT.metal,.1,.4,3.6,x+Math.cos(a)*1.62,3+Math.sin(a)*1.62,z-.6,0,0,a)}
      box(x-sx*3.6,0,z-3,1.2,1.4,1,MAT.armorD,false);box(x-sx*3.6,1.4,z-3,1,.5,.06,TRIM.c,false);deco(GEO.cyl,MAT.gunD,.08,5,.08,x-sx*2,1.4,z-1,0,0,1.2)}
    // cable trays under the roof with hanging lamps, outside the launch lane
    for(const x of[-80,-55,55,80]){deco(GEO.box,MAT.armorD,1.2,.25,92,x,10,205);for(const o of[-.55,.55])deco(GEO.box,MAT.metal,.08,.4,92,x+o,10.15,205);
      for(let z=165;z<=245;z+=16){deco(GEO.cyl,MAT.metal,.03,r.h-10.2,.03,x,10+(r.h-10)/2,z);box(x,8.9,z,.9,.35,.5,MAT.armorD,false);box(x,8.86,z,.7,.05,.3,MAT.amber,false)}}
  }
  // ENGINEERING: hazard floor around the reactor, consoles, cable trays, a gantry
  {const r=R['ENGINEERING'],cx=(r.x0+r.x1)/2,cz=(r.z0+r.z1)/2;box(cx,.03,cz,20,.04,20,FL['HANGAR'],false);
    for(let i=0;i<8;i++){if(i%4===2)continue;const a=i/8*6.283;box(cx+Math.cos(a)*25,0,cz+Math.sin(a)*25,2.2,1.2,1,MAT.armorD);box(cx+Math.cos(a)*25,1.2,cz+Math.sin(a)*25,2,.5,.06,TRIM.o,false)}
    for(const z of[r.z0+4,r.z1-4])box(cx,12,z,r.x1-r.x0-8,.3,1.4,MAT.metal,false)}
  // ---- set pieces for the commons, bridge, habitat, farms and spines (v61). Big pieces get one coarse solid box; nothing crosses a doorway
  {const SB=(x,y,z,w,h,d)=>boxes.push({lo:[x-w/2,y,z-d/2],hi:[x+w/2,y+h,z+d/2]});
    const fab=[0xd0702e,0x2f7d8a,0x8a3a4a,0xc9a23a].map(c=>std({color:c,roughness:.85,side:T.DoubleSide}));
    const scr=(t1,t2,col)=>bas({map:paint(256,(g,S)=>{g.fillStyle='#08161a';g.fillRect(0,0,S,S);g.strokeStyle=col;g.lineWidth=2;g.globalAlpha=.45;for(let i=0;i<7;i++){g.beginPath();g.moveTo(0,S*.5+i*14);for(let x=0;x<=S;x+=16)g.lineTo(x,S*.5+i*14+Math.sin(x*.05+i*1.3)*8);g.stroke()}
      g.globalAlpha=1;g.fillStyle=col;g.font='700 30px "Chakra Petch",sans-serif';g.fillText(t1,16,44);g.font='16px monospace';g.fillText(t2,16,74);g.strokeRect(5,5,S-10,S-10)})});
    const banner=(c,t)=>std({map:paint(256,(g,S)=>{g.fillStyle=c;g.fillRect(0,0,S,S);grime(g,S,800,.05);g.fillStyle='rgba(255,255,255,.85)';g.fillRect(S*.1,S*.06,S*.8,S*.02);g.fillRect(S*.1,S*.92,S*.8,S*.02);
      g.save();g.translate(S/2,S/2);g.rotate(-Math.PI/2);g.font='700 34px "Chakra Petch",sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(t,0,0);g.restore()}),roughness:.85,side:T.DoubleSide});
    const SCN=scr('EUROPA ORBITAL','SHIFT 3 · ALL DECKS','#6fe3ff'),SCA=scr('TACTICAL','THALASSA · MERIDIAN','#ffb238'),SCV=scr('VEND','HOT MEALS · 4 CR','#5ccf6a');
    // COMMONS west wing: a row of market stalls with canopies, goods and lamps
    for(let i=0;i<4;i++){const x=-100+i*10,z=-26,m=fab[i];SB(x,0,z,4.2,2.6,2.4);box(x,0,z,4,1.1,2,MAT.wallD,false);box(x,1.1,z,4.3,.08,2.3,MAT.metal,false);box(x,0,z+1.01,4,.25,.04,TRIM.a,false);
      for(const ox of[-2,2])for(const oz of[-1.1,1.1])box(x+ox,0,z+oz,.08,oz>0?2.7:3.1,.08,MAT.metal,false);deco(GEO.box,m,4.7,.05,2.9,x,2.95,z,-.14,0,0);for(const ox of[-2.35,2.35])deco(GEO.box,m,.05,.5,2.9,x+ox,2.7,z,-.14,0,0);
      for(let k=0;k<5;k++)deco(k%2?GEO.cyl:GEO.box,k%3?MAT.crateA:fab[(i+k)%4],.25+hash(k,i)*.15,.3+hash(i,k)*.25,.25,x-1.6+k*.8,1.3+hash(k,i+3)*.1,z+.2);
      deco(GEO.sph,MAT.amber,.12,.12,.12,x,2.55,z+.4);GLOWS.push([x,2.55,z+.4,0xffc070,2.4,.4])}
    // commons east wing: vending machines and a parked maintenance tram on its floor rail
    for(let i=0;i<4;i++){const x=60+i*6,z=-27;SB(x,0,z,2.1,2.6,1.2);box(x,0,z,2,2.5,1.1,MAT.armorD,false);box(x,.9,z+.56,1.5,1.4,.02,SCV,false);box(x,.3,z+.57,1.2,.3,.03,MAT.metal,false);box(x,2.5,z,2.1,.12,1.2,TRIM.c,false)}
    {const x=100;for(const o of[-.8,.8])box(x+o,0,0,.15,.08,60,MAT.metal,false);SB(x,0,0,3.4,3.6,15);box(x,.45,0,3.2,2.6,13,MAT.cap,false);box(x,3.05,0,2.4,.5,9,MAT.armorD,false);
      for(const o of[-1.61,1.61])box(x+o,1.6,0,.04,.8,11,MAT.pane,false);for(const o of[-1.62,1.62])box(x+o,1.1,0,.04,.12,13,TRIM.o,false);for(const e of[-1,1])deco(GEO.sph,MAT.cap,1.6,1.3,1.4,x,1.75,e*6.6);
      for(const z of[-5,-1.5,2,5.5])for(const o of[-1,1])deco(GEO.cyl,MAT.gunD,.4,.3,.4,x+o*1.2,.4,z,0,0,1.571);deco(GEO.box,MAT.metal,.08,2.6,.08,x,4.5,0)}
    // tall banners hanging in both wings
    {const B1=banner('#1f4a52','THALASSA'),B2=banner('#6a3426','NINE');for(const x of[-95,-80,-65,65,80,95])for(const z of[-10,10]){box(x,12.5,z,.05,10,3,(x+z)%3?B1:B2,false);box(x,22.6,z,.2,.2,3.4,MAT.metal,false);box(x,22.8,z,.05,3.2,.05,MAT.metal,false)}}
    // benches and recycler bins in the arcades under the tower
    for(const sz of[-1,1])for(const x of[-42,-18,18,42]){box(x,0,sz*28.6,3,.45,.8,MAT.armorD);box(x,.45,sz*29,3,.55,.12,MAT.armorD,false);deco(GEO.cyl,MAT.gun,.35,.9,.35,x+2.2,.45,sz*28.6);deco(GEO.cyl,TRIM.g,.36,.05,.36,x+2.2,.92,sz*28.6)}
    // BRIDGE: a ring of crew consoles round the holo-table, locker banks, two tactical screens, hanging monitors
    {const r=R['BRIDGE'],hz=r.z0+40;for(let k=0;k<8;k++){const a=(k+.5)*Math.PI/4,x=Math.sin(a)*11,z=hz+Math.cos(a)*11;SB(x,0,z,2.4,1,2.4);deco(GEO.box,MAT.armorD,2.6,1,1.3,x,.5,z,0,a,0);
        deco(GEO.box,MAT.metal,2.7,.08,1.4,x,1.04,z,0,a,0);deco(GEO.box,MAT.wallD,2.3,1.2,.08,x+Math.sin(a)*.52,1.72,z+Math.cos(a)*.52,0,a,0);deco(GEO.box,SCN,2.2,1.1,.05,x+Math.sin(a)*.47,1.72,z+Math.cos(a)*.47,0,a,0);deco(GEO.box,MAT.wallD,.8,.5,.8,x-Math.sin(a)*1.4,.25,z-Math.cos(a)*1.4,0,a,0);
        deco(GEO.box,TRIM.c,.06,.02,8,Math.sin(a)*6,.03,hz+Math.cos(a)*6,0,a,0)}
      for(const sx of[-1,1]){box(sx*56.2,0,-225,1.2,2.4,50,MAT.armorD);for(let z=-249;z<=-201;z+=1.2)box(sx*55.58,.2,z,.03,2,.04,MAT.metal,false);box(sx*55.58,2.3,-225,.04,.06,50,TRIM.c,false);
        SB(sx*45,0,-225,1.2,1.2,7);box(sx*45,0,-225,1,1.1,6.4,MAT.armorD,false);box(sx*45,1.1,-225,.3,5,.3,MAT.metal,false);deco(GEO.box,MAT.wallD,.3,4.4,7.4,sx*45,4.2,-225);deco(GEO.box,SCA,.05,4,7,sx*(45-.18),4.2,-225)}
      for(let x=-40;x<=40;x+=20){deco(GEO.box,MAT.armorD,4,1.6,.3,x,7,r.z0+14);deco(GEO.box,SCN,3.6,1.3,.05,x,7,r.z0+14.18);deco(GEO.cyl,MAT.metal,.04,r.h-7.8,.04,x,7.8+(r.h-7.8)/2,r.z0+14)}}
    // bridge tiers: a row of crew workstations along the front edge of each tier, facing the window (the centre stair stays clear)
    {const r=R['BRIDGE'];for(let i=0;i<3;i++){const y=1.2*(i+1),z=r.z1-10-i*8-2.6,hw=48-i*8;for(let x=-hw+4;x<=hw-4;x+=5){if(Math.abs(x)<4.5)continue;SB(x,y,z,2.2,1,1.2);box(x,y,z,2.2,.9,1,MAT.armorD,false);box(x,y+.9,z,2.3,.06,1.1,MAT.metal,false);
      deco(GEO.box,(x/5|0)%2?SCN:SCA,1.8,.9,.05,x,y+1.5,z-.45,.3,0,0);box(x,y,z+1.2,.6,.45,.6,MAT.wallD,false);box(x,y+.45,z+1.45,.6,.55,.1,MAT.wallD,false)}}}
    // HABITAT: cabins get a desk with a screen, a chair, a rug, a shelf and a plant; lounges get sofas, vending and plants; corridors get benches and fire cabinets
    for(const zc of[49,65,81,109,125,141])for(const sx of[-1,1]){const dx=sx<0?-78:-41,dz=zc+(zc<95?-6.2:6.2),bz=Math.sign(dz-zc);
      box(dx,0,dz,3,.85,1.2,MAT.armorD);box(dx,.85,dz,3.1,.06,1.3,MAT.metal,false);box(dx,1.2,dz+bz*.55,1.6,.9,.05,SCN,false);box(dx,0,dz-bz*1.1,.7,.5,.7,MAT.wallD,false);box(dx,.5,dz-bz*1.4,.7,.6,.1,MAT.wallD,false);
      box(sx<0?-77:-42,.02,zc,5,.02,3.4,fab[(zc/16|0)%4],false);box(sx<0?-86.1:-32.9,2.2,zc-3,.3,.06,2.4,MAT.metal,false);for(let k=0;k<3;k++)box(sx<0?-86.1:-32.9,2.4,zc-3.8+k*.7,.25,.35+k*.08,.4,k%2?MAT.crateA:fab[k],false);
      planter(sx<0?-85.4:-33.6,0,zc+(zc<95?6.5:-6.5),1,1)}
    for(const zc of[65,125])for(const xc of[-104.5,-13.5]){box(xc,0,zc+9,1.6,.55,6,fab[1]);box(xc+(xc<-50?-.7:.7),.55,zc+9,.25,.7,6,fab[1],false);box(xc,0,zc-10,1.2,2.4,2,MAT.armorD);box(xc+(xc<-50?.61:-.61),.9,zc-10,.02,1.2,1.5,SCV,false);planter(xc,0,zc-6,1.2,1.2)}
    for(const z of[57,73,117,133])for(const x of[-64.6,-54.4]){box(x,0,z,.8,.45,3,MAT.armorD);box(x,1.6,z+2.2,.15,.6,.4,TRIM.r,false)}
    // FARMS: nutrient pumps at the rack ends, harvest carts, crates; a tool shed, benches, crates and sprinklers in the orchard
    {const r=R['PORT FARMS'];for(let i=0;i<7;i++){const x=r.x0+12+i*12.5;for(const z of[r.z0+4.2,r.z1-4.2]){SB(x,0,z,1.8,1.4,2.2);box(x,0,z,1.6,1.3,2,MAT.armorD,false);deco(GEO.cyl,MAT.gun,.45,1.2,.45,x,1.9,z);
        deco(GEO.cyl,MAT.metal,.1,2.4,.1,x,1.4,z+(z<-100?1.6:-1.6),1.571,0,0);box(x,1.31,z,.6,.05,.6,TRIM.g,false)}}
      for(const[x,z]of[[-88.75,-112],[-63.75,-88],[-38.75,-112]]){SB(x,0,z,2,1.3,3.2);box(x,.45,z,1.8,.7,3,MAT.armorD,false);for(const o of[-.75,.75])for(const e of[-1.1,1.1])deco(GEO.cyl,MAT.gunD,.3,.2,.3,x+o,.3,z+e,0,0,1.571);
        for(let k=0;k<4;k++)blob(GEO.ico,k%2?MAT.leaf:MAT.leafD,.35,.25,.35,x+(k%2?.4:-.4),1.3,z-.8+(k>>1)*1.4,k)}
      for(const[x,z]of[[-101,-128],[-101,-72]])for(let k=0;k<3;k++)box(x,k*.9,z,1.6,.9,1.6,k%2?MAT.crateA:MAT.crateB,k===0)}
    {const r=R['STARBOARD FARMS'];SB(100,0,-56,6.4,3.4,5.4);box(100,0,-56,6,3,5,MAT.wallD,false);deco(GEO.box,fab[0],6.8,.1,5.8,100,3.2,-56,0,0,.12);box(97,0,-56+2.52,1.4,2.2,.04,TRIM.g,false);box(102,1.4,-53.47,1.6,.8,.04,MAT.pane,false);
      for(const x of[27,47]){box(x,0,-91,3,.45,.8,MAT.armorD);box(x,.45,-90.6,3,.5,.12,MAT.armorD,false)}
      for(const[x,z]of[[30,-140],[86,-140],[30,-60]])for(let k=0;k<2;k++)box(x,k*.8,z,1.4,.8,1.4,k%2?MAT.crateA:MAT.crateB,k===0);
      for(let x=r.x0+12;x<r.x1-6;x+=14)for(let z=r.z0+12;z<r.z1-6;z+=16){if(Math.abs(z-(r.z0+r.z1)/2)<8&&x<r.x0+50)continue;if(z<-140&&x>45&&x<70)continue;deco(GEO.cyl,MAT.metal,.04,1.2,.04,x+2.4,1.5,z+2.4);deco(GEO.cyl,TRIM.c,.12,.05,.12,x+2.4,2.1,z+2.4)}}
    // SPINES: pipe bundles along both walls, junction boxes and fire cabinets, broken at the side doors
    for(const n of['FORE SPINE','AFT SPINE']){const r=R[n],dz=n==='FORE SPINE'?-100:95;for(const[a,b]of[[r.z0+1,dz-4.5],[dz+4.5,r.z1-1]]){const L=b-a,zc=(a+b)/2;
      for(const o of[-1,1]){deco(GEO.cyl,MAT.gun,.14,L,.14,o*6.6,3.7,zc,1.571,0,0);deco(GEO.cyl,MAT.gunD,.1,L,.1,o*6.65,4.05,zc,1.571,0,0);deco(GEO.cyl,MAT.metal,.08,L,.08,o*6.7,3.4,zc,1.571,0,0);
        for(let z=a+3;z<b-2;z+=16){box(o*6.8,1.5,z,.3,.9,.7,MAT.armorD,false);box(o*6.64,1.8,z,.02,.15,.4,TRIM.c,false)}for(let z=a+11;z<b-2;z+=24){box(o*6.82,.9,z,.25,.8,.5,TRIM.r,false);box(o*6.68,1.1,z,.02,.4,.3,MAT.pane,false)}}}}}
  // ENGINEERING set pieces: the reactor dressed as a machine (plinth, buttresses, containment bands, coolant pipes, slit windows),
  // generator and tank detail, heat exchangers on cradles, pipe banks on the walls, cable trays with lamps
  {const r=R['ENGINEERING'],cx=(r.x0+r.x1)/2,cz=(r.z0+r.z1)/2,SB=(x,y,z,w,h,d)=>boxes.push({lo:[x-w/2,y,z-d/2],hi:[x+w/2,y+h,z+d/2]});
    box(cx,0,cz,16,1.2,16,MAT.armorD);for(const o of[-1,1]){box(cx,1.2,cz+o*7.98,16,.08,.06,TRIM.a,false);box(cx+o*7.98,1.2,cz,.06,.08,16,TRIM.a,false)}
    for(const sx of[-1,1])for(const sz of[-1,1]){box(cx+sx*6.4,1.2,cz+sz*6.4,1.6,r.h-1.2,1.6,MAT.metal);for(const y of[2,8,14,20])box(cx+sx*6.4,y,cz+sz*6.4,1.9,.4,1.9,MAT.armorD,false)}
    for(const y of[3,7.5,12,16.5,21])for(const o of[-1,1]){box(cx,y,cz+o*6.25,12.4,.9,.5,MAT.armorD,false);box(cx+o*6.25,y,cz,.5,.9,12.4,MAT.armorD,false);box(cx,y+.38,cz+o*6.52,11,.1,.04,TRIM.o,false);box(cx+o*6.52,y+.38,cz,.04,.1,11,TRIM.o,false)}
    for(let f=0;f<4;f++){const nx=[0,1,0,-1][f],nz=[1,0,-1,0][f],tx=-nz,tz=nx;
      for(const t of[-3.6,3.6]){deco(GEO.cyl,MAT.gun,.36,r.h-1.2,.36,cx+nx*6.9+tx*t,1.2+(r.h-1.2)/2,cz+nz*6.9+tz*t);for(const y of[4.5,10,15,19.5])deco(GEO.cyl,MAT.gunD,.44,.3,.44,cx+nx*6.9+tx*t,y,cz+nz*6.9+tz*t)}
      for(const t of[-1.6,0,1.6]){box(cx+nx*6.03+tx*t,4,cz+nz*6.03+tz*t,Math.abs(tx)*.16+Math.abs(nx)*.04,3,Math.abs(tz)*.16+Math.abs(nz)*.04,TRIM.c,false);box(cx+nx*6.03+tx*t,8.6,cz+nz*6.03+tz*t,Math.abs(tx)*.16+Math.abs(nx)*.04,3,Math.abs(tz)*.16+Math.abs(nz)*.04,TRIM.c,false);box(cx+nx*6.03+tx*t,13.1,cz+nz*6.03+tz*t,Math.abs(tx)*.16+Math.abs(nx)*.04,3,Math.abs(tz)*.16+Math.abs(nz)*.04,TRIM.c,false)}}
    box(cx,r.h-2.4,cz,14.4,2.4,14.4,MAT.armorD,false);
    // generators: ribbed housings, a flywheel drum on top, exhaust stacks and a side panel
    for(let i=0;i<6;i++){const x=r.x0+16+i*13,z=i%2?r.z0+26:r.z1-26;for(let k=-3;k<=3;k++)box(x,0,z+k*1.1,5.25,3.3,.14,MAT.metal,false);
      deco(GEO.cyl,MAT.gun,1.3,3.6,1.3,x,4.8,z+1.2,0,0,1.571);for(const e of[-1.85,1.85])deco(GEO.cyl,MAT.gunD,1.4,.2,1.4,x+e,4.8,z+1.2,0,0,1.571);box(x,3.6,z+1.2,3,.4,2.2,MAT.armorD,false);
      for(const o of[-1.4,1.4]){deco(GEO.cyl,MAT.gunD,.28,3.2,.28,x+o,5.2,z-2.8);deco(GEO.cyl,MAT.metal,.32,.2,.32,x+o,6.8,z-2.8)}
      box(x+2.62,1,z-1.5,.06,1.2,2,TRIM.c,false);box(x+2.62,.6,z+1.5,.06,.2,2.5,TRIM.a,false);deco(GEO.cyl,MAT.gunD,.2,3,.2,x-1.6,.2,z+5.3,1.571,0,0)}
    // coolant tanks: frame columns, bands, a valve wheel and a pipe to the wall
    for(const[x,z]of[[r.x0+8,r.z0+8],[r.x1-8,r.z0+8],[r.x0+8,r.z1-8],[r.x1-8,r.z1-8]]){SB(x,0,z,8,11.4,8);for(const ox of[-3.7,3.7])for(const oz of[-3.7,3.7])box(x+ox,0,z+oz,.5,11,.5,MAT.metal,false);
      for(const y of[.2,3.7,7.4])for(const o of[-1,1]){box(x,y,z+o*3.65,7.6,.35,.15,MAT.armorD,false);box(x+o*3.65,y,z,.15,.35,7.6,MAT.armorD,false)}
      deco(GEO.tor,MAT.gunD,.7,.7,.7,x,11.9,z,1.571,0,0);deco(GEO.cyl,MAT.gun,.4,8,.4,x,15.5,z);box(x,11.4,z,2,.5,2,MAT.armorD,false)}
    // heat exchangers on cradles
    for(const[x,z]of[[31,51],[87,51],[33,139],[85,139]]){SB(x,0,z,10.4,3.6,3.4);deco(GEO.cyl,MAT.gun,1.5,10,1.5,x,1.9,z,0,0,1.571);for(const e of[-5.05,5.05]){deco(GEO.cyl,MAT.gunD,1.62,.3,1.62,x+e,1.9,z,0,0,1.571);deco(GEO.sph,MAT.metal,.7,1.5,1.5,x+e*1.03,1.9,z);deco(GEO.cyl,MAT.gunD,.3,.6,.3,x+e*1.17,1.9,z,0,0,1.571)}
      for(let k=-3;k<=3;k++)deco(GEO.cyl,MAT.gunD,1.56,.14,1.56,x+k*1.35,1.9,z,0,0,1.571);for(const e of[-3.5,3.5])box(x+e,0,z,.8,1.1,3.2,MAT.armorD,false);
      for(const e of[-3,3]){deco(GEO.cyl,MAT.metal,.3,r.h-6,.3,x+e,3.4+(r.h-6)/2,z);deco(GEO.cyl,MAT.gunD,.38,.4,.38,x+e,3.5,z)}box(x,3.3,z,1.2,.4,.6,TRIM.a,false)}
    // pipe banks on the long walls, clear of the doors
    for(const[wx,o]of[[r.x1-.6,-1],[r.x0+.8,1]])for(const[z0,z1]of(o<0?[[45,145]]:[[45,90],[100,145]])){const L=z1-z0,zc=(z0+z1)/2;
      for(const[y,m,rr]of[[2.6,MAT.gun,.22],[3.2,MAT.gunD,.16],[3.8,MAT.metal,.28],[4.6,MAT.gunD,.12]])deco(GEO.cyl,m,rr,L,rr,wx+o*(rr-.1),y,zc,1.571,0,0);
      for(let z=z0+2;z<z1;z+=5)box(wx+o*.1,2.2,z,.5,2.8,.15,MAT.armorD,false);for(let z=z0+8;z<z1;z+=16){deco(GEO.tor,TRIM.r,.25,.25,.25,wx+o*.55,3.8,z,0,1.571,0);deco(GEO.cyl,MAT.gunD,.06,.5,.06,wx+o*.4,3.8,z,0,0,1.571)}}
    // cable trays across the room with hanging lamps (outside the catwalk ring)
    for(const z of[60,130]){deco(GEO.box,MAT.armorD,r.x1-r.x0-4,.25,1.2,cx,13,z);for(const o of[-.55,.55])deco(GEO.box,MAT.metal,r.x1-r.x0-4,.4,.08,cx,13.15,z+o);
      for(let x=r.x0+8;x<r.x1-4;x+=12){deco(GEO.cyl,MAT.metal,.03,r.h-13.2,.03,x,13+(r.h-13)/2,z);box(x,11.9,z,.5,.35,.9,MAT.armorD,false);box(x,11.86,z,.3,.05,.7,MAT.amber,false)}}}
  // HABITAT: ceiling ducts along both corridors
  {const r=R['HABITAT'];for(const o of[-1,1]){deco(GEO.cyl,MAT.armorD,.4,r.z1-r.z0,.4,-59.5+o*3.6,r.h-1,(r.z0+r.z1)/2,1.571,0,0);deco(GEO.cyl,MAT.armorD,.4,r.x1-r.x0,.4,(r.x0+r.x1)/2,r.h-1,95+o*3.8,0,0,1.571)}}
  // BRIDGE: a holo-table of the station, rails on the tiers, a command chair
  {const r=R['BRIDGE'];deco(GEO.cyl,MAT.armorD,3,1,3,0,.5,r.z0+40);
    for(let i=0;i<3;i++)box(0,1.2*(i+1),r.z1-14-i*8+3.6,96-i*16,.08,.08,MAT.metal,false);box(0,3.6,r.z1-26,2,1.2,2,MAT.armorD);box(0,4.8,r.z1-25.2,2,1.6,.4,MAT.armorD)}
  // FARMS: irrigation pipes on the floor, misting nozzles on the ribs
  for(const n of['PORT FARMS','STARBOARD FARMS']){const r=R[n];for(let x=r.x0+6;x<r.x1;x+=12.5)deco(GEO.cyl,MAT.metal,.12,r.z1-r.z0-4,.12,x,.15,(r.z0+r.z1)/2,1.571,0,0)}
  }
}
verifyStairs();
flush();
scene.traverse(o=>{if(o.isMesh&&o.material&&o.material.isMeshStandardMaterial&&o.material!==MAT.water)o.material.envMapIntensity=.28});
// drifting dust in the air
const motes=new T.Points(new T.BufferGeometry(),new T.PointsMaterial({map:glowTex,color:0xffe9b0,size:0.16,transparent:true,opacity:0.6,depthWrite:false,blending:T.AdditiveBlending,fog:false}));
{const a=new Float32Array((lowFx?120:320)*3);for(let i=0;i<a.length;i++)a[i]=(Math.random()-0.5)*60;motes.geometry.setAttribute('position',new T.BufferAttribute(a,3));motes.frustumCulled=false;scene.add(motes)}
for(const[x,y,z,c,sz,o]of GLOWS){const gl=glow(c,sz,o);gl.position.set(x,y,z);scene.add(gl)}
for(const q of PADS){const gl=glow(0x8fe6ff,4.5,0.5);gl.position.set(q.x,q.y+0.7,q.z);scene.add(gl)}
{const lamps=[[0,18,0,0xffd9a0,1.4,70],[0,22,205,0xffb0a0,1.2,80],[60,16,95,0xffb070,1,60],[-60,14,-100,0xc8ffd0,1,60],[0,12,-210,0x9fe6ff,1,60]];
 for(const[x,y,z,c,i,d]of lowFx?lamps.slice(0,1):lamps.slice(0,3)){const L=new T.PointLight(c,i*LP,d,2);L.position.set(x,y,z);scene.add(L)}}
// sky
// sky
// far scenery lives in FAR, which follows the camera every frame: planets, the Blade, stations and traffic stay out of reach
const WORLDOBJ=scene.children.filter(o=>o.isMesh||o.isSprite||o.isGroup);
function worldShow(v){for(const o of WORLDOBJ){if(!v){if(o.userData.wv===undefined)o.userData.wv=o.visible;o.visible=false}else if(o.userData.wv!==undefined){o.visible=o.userData.wv;delete o.userData.wv}}}
const FAR=new T.Group();scene.add(FAR);
// sky, the planet below and far scenery
const farAnim=[];
{const vn=(x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),a=hash(xi,yi),b=hash(xi+1,yi),c=hash(xi,yi+1),d=hash(xi+1,yi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};
 const fbm=(x,y,o)=>{let r=0,a=0.5;for(let i=0;i<o;i++){r+=a*vn(x,y);x=x*2.03+17;y=y*2.03+9;a*=0.5}return r};
 const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t],cl=t=>Math.max(0,Math.min(1,t));
 function pix(w,h,fn,rep){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),im=g.createImageData(w,h),d=im.data;
   for(let y=0;y<h;y++)for(let x=0;x<w;x++){const q=fn(x,y),i=(y*w+x)*4;d[i]=q[0];d[i+1]=q[1];d[i+2]=q[2];d[i+3]=q.length>3?q[3]:255}
   g.putImageData(im,0,0);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;if(rep){t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rep[0],rep[1])}return t}
 // sky: a band of nebula over deep space
 const SW=lowFx?512:1024,SH=SW/2,sk=pix(SW,SH,(x,y)=>{const u=x/SW,v=y/SH,k=150*SW/1024,n=fbm(x/k,y/k,4)*(1-u)+fbm((x-SW)/k,y/k,4)*u,m=fbm(x/k/2+40,y/k/2,3)*(1-u)+fbm((x-SW)/k/2+40,y/k/2,3)*u;
   const band=Math.exp(-Math.pow((v-0.3-0.08*Math.sin(u*6.283))/0.16,2)),neb=cl((n-0.42)*3)*band,hz=Math.exp(-Math.pow((v-0.5)/0.07,2));
   const col=m<0.5?mix([106,66,184],[255,79,163],cl(m*2)):mix([255,79,163],[111,216,255],cl(m*2-1));
   return[4+col[0]*neb*0.4+10*hz,7+col[1]*neb*0.4+38*hz,16+col[2]*neb*0.45+48*hz]});
 const skyM=mesh(GEO.sph,bas({map:sk,side:T.BackSide,fog:false,depthWrite:false}),5000,5000,5000);FAR.add(skyM);
 // planet below the deck
 const R=9000,TL=0.55,PY=-(R+780)*Math.cos(TL),PZ=-(R+780)*Math.sin(TL),PS=lowFx?512:1024,pg=new T.Group();pg.position.set(0,PY,PZ);pg.rotation.x=TL;FAR.add(pg);
 const land=pix(PS,PS,(x,y)=>{const u=x/PS,v=y/PS,h=fbm(u*6+3,v*6+7,5),f=fbm(u*28+1,v*28+5,3);let c=mix([232,228,218],[196,180,156],cl(h*1.4-.35));
   for(const[a,b,k]of[[3.1,1.7,9],[1.3,-2.4,13],[-2.2,0.9,7],[0.4,3.3,11]]){const l=Math.abs(Math.sin((u*a+v*b)*k*6.283/6.283*3+fbm(u*3+a,v*3+b,3)*5));if(l<0.05)c=mix(c,[150,82,58],(0.05-l)/0.05*0.85)}
   return[c[0]+f*14-7,c[1]+f*14-7,c[2]+f*14-7]},[3,2]);
 const planet=mesh(new T.SphereGeometry(1,96,64),bas({map:land,color:0x969696,fog:false}),R,R,R);planet.rotation.x=Math.PI/2;pg.add(planet);
 pg.add(mesh(new T.SphereGeometry(1,96,64),new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,
   vertexShader:'varying vec3 vN;varying vec3 vV;void main(){vec4 m=modelViewMatrix*vec4(position,1.0);vN=normalize(normalMatrix*normal);vV=normalize(-m.xyz);gl_Position=projectionMatrix*m;}',
   fragmentShader:'varying vec3 vN;varying vec3 vV;void main(){float f=pow(1.0-max(dot(normalize(vN),normalize(vV)),0.0),3.0);gl_FragColor=vec4(vec3(0.7,0.75,0.8)*f*0.35,1.0);}'}),R+126,R+126,R+126));
 try{const es=new T.Scene();es.add(skyM.clone());es.add(mesh(GEO.sph,bas({color:0xfff0d8}),700,700,700,2000,3320,1000));const pc=mesh(GEO.sph,bas({color:0xbdb6aa}),R,R,R,0,PY,PZ);es.add(pc);
  const pm=new T.PMREMGenerator(renderer);scene.environment=pm.fromScene(es,0,1,10000).texture;scene.environmentIntensity=0.68;pm.dispose()}catch(e){}
 const p=[];for(let i=0;i<1500;i++){const a=Math.random()*6.283,e=Math.acos(Math.random()*1.25-0.25),r=4200;p.push(Math.sin(e)*Math.cos(a)*r,Math.cos(e)*r,Math.sin(e)*Math.sin(a)*r)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));
 FAR.add(new T.Points(g,new T.PointsMaterial({color:0xffffff,size:1.7,sizeAttenuation:false,fog:false})));
 // sun
 for(const[c,sz,o]of[[0xfff2d0,340,1],[0xffd9a0,2000,0.35]]){const q=glow(c,sz,o);q.position.set(2000,3320,1000);FAR.add(q)}
 // Jupiter off the stern
 const pt=paint(512,(g,S)=>{const cols=['#efe2c8','#d9b88e','#b9784c','#e8d4b0','#a8643e','#f2e6d0','#c99a6a','#8e5236'];
   let y=0;while(y<S){const h=6+hash(y,5)*26;g.fillStyle=cols[Math.floor(hash(y,9)*cols.length)];g.fillRect(0,y,S,h);y+=h}
   for(let i=0;i<120;i++){g.fillStyle=`rgba(255,248,235,${0.04+hash(i,8)*0.08})`;g.beginPath();g.ellipse(hash(i,1)*S,hash(i,2)*S,20+hash(i,3)*70,2+hash(i,4)*5,0,0,7);g.fill()}
   g.fillStyle='#b8573a';g.beginPath();g.ellipse(S*.62,S*.64,S*.07,S*.035,0,0,7);g.fill();g.fillStyle='#d27a52';g.beginPath();g.ellipse(S*.62,S*.64,S*.045,S*.02,0,0,7);g.fill()});
 const P=[700,900,3400];
 FAR.add(mesh(GEO.sph,new T.MeshLambertMaterial({map:pt,fog:false}),1300,1300,1300,...P));
 const halo=glow(0xffd8a8,4200,0.18);halo.position.set(...P);FAR.add(halo);
 {const B=new T.Group(),bm=new T.MeshLambertMaterial({color:0xe9edf2,emissive:0x8fa6c8,emissiveIntensity:.55,fog:false,flatShading:true}),gm=new T.MeshLambertMaterial({color:0xcaa25a,emissive:0x8a5a1a,emissiveIntensity:.5,fog:false,flatShading:true});
  const blade=new T.Mesh(new T.CylinderGeometry(0,1,1,4,1),bm);blade.scale.set(95,1500,26);blade.position.y=830;B.add(blade);
  const root=new T.Mesh(new T.BoxGeometry(1,1,1),bm);root.scale.set(134,180,36);root.position.y=20;root.rotation.y=0;B.add(root);
  const guard=new T.Mesh(new T.BoxGeometry(1,1,1),gm);guard.scale.set(560,60,80);guard.position.y=-90;B.add(guard);for(const sx of[-1,1]){const t=new T.Mesh(new T.CylinderGeometry(0,1,1,4,1),gm);t.scale.set(45,150,45);t.position.set(sx*300,-30,0);B.add(t)}
  const grip=new T.Mesh(new T.CylinderGeometry(1,1,1,8),gm);grip.scale.set(34,380,34);grip.position.y=-300;B.add(grip);const pom=new T.Mesh(new T.OctahedronGeometry(1),gm);pom.scale.set(80,90,80);pom.position.y=-520;B.add(pom);
  const line=new T.Mesh(new T.BoxGeometry(1,1,1),bas({color:0xbfe9ff,fog:false}));line.scale.set(8,1380,30);line.position.y=770;B.add(line);
  for(const[y,sz,o]of[[1500,900,.5],[700,2600,.22],[-90,1100,.3]]){const q=glow(0xcfe6ff,sz,o);q.position.y=y;B.add(q)}
  B.position.set(700,4300,-2300);B.rotation.set(1.05,.5,.35);B.scale.setScalar(2.2);FAR.add(B);farAnim.push(dt=>{B.rotation.y+=dt*.004})}
 {const N=lowFx?250:700,rock=new T.InstancedMesh(new T.IcosahedronGeometry(1,0),new T.MeshLambertMaterial({color:0x8a7c70,fog:false,flatShading:true}),N),d=new T.Object3D(),belt=new T.Group();
  for(let i=0;i<N;i++){const a=Math.random()*6.283,r=2700+Math.random()*700,sz=4+Math.pow(Math.random(),3)*60;d.position.set(Math.cos(a)*r,(Math.random()-.5)*160,Math.sin(a)*r);d.rotation.set(Math.random()*6,Math.random()*6,0);d.scale.set(sz,sz*(.6+Math.random()*.5),sz*(.7+Math.random()*.4));d.updateMatrix();rock.setMatrixAt(i,d.matrix)}
  belt.add(rock);belt.position.y=700;belt.rotation.set(.32,0,.18);FAR.add(belt);farAnim.push(dt=>{belt.rotation.y+=dt*.004})}
 {const mt=paint(256,(g,S)=>{g.fillStyle='#9a9fa8';g.fillRect(0,0,S,S);grime(g,S,4000,.12);for(let i=0;i<70;i++){const x=hash(i,11)*S,y=hash(i,12)*S,r=3+Math.pow(hash(i,13),2)*28;
    g.fillStyle='rgba(60,62,70,.45)';g.beginPath();g.arc(x,y,r,0,7);g.fill();g.strokeStyle='rgba(225,228,235,.4)';g.lineWidth=1.5;g.beginPath();g.arc(x-1,y-1,r,3.6,5.6);g.stroke()}});
  FAR.add(mesh(GEO.sph,new T.MeshLambertMaterial({map:mt,fog:false}),180,180,180,1700,980,-2500))}
 {const dm=new T.MeshLambertMaterial({color:0x3c545b,fog:false}),dg=inst(bake(a=>{a(GEO.box,dm,40,40,900);for(let i=0;i<14;i++){const z=-420+i*64,h=80+hash(i,21)*160;a(GEO.box,dm,h*1.4,8,10,0,0,z);a(GEO.box,dm,8,h,10,0,0,z+20)}
    for(let i=0;i<6;i++)a(GEO.cyl,dm,30,60,30,0,40,-300+i*120)}),false);dg.position.set(-3100,520,-900);dg.rotation.set(.2,.9,.35);FAR.add(dg);
  const lp=[];for(let i=0;i<60;i++)lp.push((hash(i,31)-.5)*200,(hash(i,32)-.5)*160,(hash(i,33)-.5)*900);const lg=new T.BufferGeometry();lg.setAttribute('position',new T.Float32BufferAttribute(lp,3));
  const lmat=new T.PointsMaterial({color:0xff8a5a,size:2.4,sizeAttenuation:false,fog:false,transparent:true});const pts=new T.Points(lg,lmat);dg.add(pts);farAnim.push(()=>{lmat.opacity=.4+.6*(Math.sin(time*2.3)>0?1:0)})}
 {const lanes=[];for(let l=0;l<4;l++){const n=30,arr=new Float32Array(n*3),g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(arr,3));
    const pm=new T.Points(g,new T.PointsMaterial({color:l%2?0xffd9a0:0x9fe6ff,size:2,sizeAttenuation:false,fog:false}));pm.frustumCulled=false;FAR.add(pm);lanes.push({arr,g,r:1300+l*380,h:180+l*120,sp:(l%2?-1:1)*(.01+l*.003),ph:l*1.7})}
  farAnim.push(()=>{for(const L of lanes){for(let i=0;i<30;i++){const a=L.ph+time*L.sp+i*.035;L.arr[i*3]=Math.cos(a)*L.r;L.arr[i*3+1]=L.h+Math.sin(a*3)*20;L.arr[i*3+2]=Math.sin(a)*L.r}L.g.attributes.position.needsUpdate=true}})}
 // sister decks, a ring station and passing ships
 const farMat=new T.MeshLambertMaterial({color:0x6f9aa3,fog:false}),disc=new T.CylinderGeometry(1,1,1,48),cap=new T.SphereGeometry(1,24,10,0,6.283,0,1.571);
 for(const[x,y,z,k]of[[900,-60,-1300,1],[-1500,140,600,1.3],[500,260,1900,0.9]]){const d=new T.Group();
   d.add(mesh(disc,farMat,120*k,10*k,120*k),mesh(cap,bas({color:0x6fd8ff,transparent:true,opacity:0.1,fog:false,depthWrite:false,blending:T.AdditiveBlending}),118*k,60*k,118*k,0,5*k,0));
   const q=glow(0xffb238,200*k,0.7);q.position.y=16*k;d.add(q);for(let i=0;i<8;i++){const w=glow(0x8fe6ff,34*k,0.8);w.position.set(Math.cos(i*0.785)*118*k,6*k,Math.sin(i*0.785)*118*k);d.add(w)}
   d.position.set(x,y,z);FAR.add(d)}
 {const o=new T.Group(),inner=new T.Group();o.add(inner);inner.add(mesh(new T.TorusGeometry(300,14,10,90),farMat,1,1,1),mesh(GEO.sph,farMat,44,44,44));
  for(let i=0;i<3;i++){const b=mesh(GEO.box,farMat,600,7,7);b.rotation.z=i*1.047;inner.add(b)}
  const lp=[];for(let i=0;i<80;i++){const a=i/80*6.283;lp.push(Math.cos(a)*300,Math.sin(a)*300,i%2?16:-16)}
  const lg=new T.BufferGeometry();lg.setAttribute('position',new T.Float32BufferAttribute(lp,3));inner.add(new T.Points(lg,new T.PointsMaterial({color:0xffd9a0,size:2.6,sizeAttenuation:false,fog:false})));
  o.position.set(1900,430,-900);o.rotation.set(1.0,0.4,0);FAR.add(o);farAnim.push(dt=>{inner.rotation.z+=dt*0.03})}
 for(const[rr,h,w,ph,k]of[[420,70,0.05,0,7],[560,150,-0.035,2,10],[330,-34,0.07,4,5]]){const sg=new T.Group();sg.add(mesh(GEO.oct,farMat,k*0.8,k*0.5,k*3));
   const e=glow(0x6fd8ff,k*5,0.9);e.position.z=-k*3;sg.add(e);FAR.add(sg);
   farAnim.push(()=>{const a=ph+time*w;sg.position.set(Math.cos(a)*rr,h,Math.sin(a)*rr);sg.rotation.y=-a+(w>0?0:Math.PI)})}
}
{// paint the backdrop farthest-first, behind everything real: nothing in it writes depth. Each object sits in its own group, because three.js sorts by group order first
  for(const c of FAR.children.slice())if(!c.isGroup){const w=new T.Group();FAR.remove(c);w.add(c);FAR.add(w)}
  const ord=[];for(const c of FAR.children){const b=new T.Box3().setFromObject(c),sp=b.getBoundingSphere(new T.Sphere());const c0=c.children.length===1?c.children[0]:c,sky=c0.isPoints||c0.material&&c0.material.side===T.BackSide;ord.push([c,sky?1e12-(c0.isPoints?1:0):isFinite(sp.radius)?sp.center.length()-sp.radius*.5:1e9])}
  ord.sort((a,b)=>b[1]-a[1]);ord.forEach(([c],k)=>{c.traverse(o=>{o.renderOrder=-1000+k;if(o.material){for(const m of[].concat(o.material)){m.depthWrite=false}}o.castShadow=false;o.receiveShadow=false})})}
// sparks
const sparks=[];for(let i=0;i<(lowFx?40:90);i++){const m=new T.SpriteMaterial({map:glowTex,blending:T.AdditiveBlending,depthWrite:false,transparent:true,fog:false}),sp=new T.Sprite(m);sp.visible=false;scene.add(sp);sparks.push({s:sp,m,v:new T.Vector3(),t:0,l:1})}
let sparkI=0;
function sparkle(p,color,n,spd){for(let i=0;i<n;i++){const k=sparks[sparkI=(sparkI+1)%sparks.length];k.s.visible=true;k.s.position.copy(p);k.m.color.set(color);
  k.v.set(Math.random()-.5,Math.random()-.25,Math.random()-.5).normalize().multiplyScalar(spd*(0.4+Math.random()));k.t=k.l=0.45+Math.random()*0.35}}
// ---- smoke and fire: two particle pools drawn as soft, rotating billboards with noise textures.
// Flames are additive and run white-hot to orange to red; smoke is alpha-blended, swells, rises, and is sorted back to front.
const PFX=(()=>{const NF=lowFx?120:380,NS=lowFx?160:560;
  const nz=(x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),a=hash(xi,yi),b=hash(xi+1,yi),c=hash(xi,yi+1),d=hash(xi+1,yi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};
  const tex=(hot)=>{const S=128,c=document.createElement('canvas');c.width=c.height=S;const g=c.getContext('2d'),im=g.createImageData(S,S);
    const sm=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
    for(let y=0;y<S;y++)for(let x=0;x<S;x++){const dx=(x-S/2)/(S/2),dy=(y-S/2)/(S/2),r=Math.hypot(dx,dy);let n=0,a=.5,f=hot?5:3;for(let o=0;o<5;o++){n+=a*nz(x*f/S+o*13.1+(hot?50:0),y*f/S*(hot?.7:1)+o*7.7);a*=.5;f*=2}
      const d=hot?(1-r)*1.35+(n-.5)*1.5-.3+Math.max(0,-dy)*.15:(1-r)*1.2+(n-.5)*1.25-.22;let al=hot?sm(0,.45,d):sm(0,.5,d)*.95;const sh=hot?Math.min(1,.55+d*.9):(.62+.55*n-.28*dy);
      const k=(y*S+x)*4;im.data[k]=im.data[k+1]=im.data[k+2]=Math.max(0,Math.min(255,255*sh));im.data[k+3]=255*al}
    g.putImageData(im,0,0);const t=new T.CanvasTexture(c);return t};
  const VS='attribute float aSize;attribute vec4 aCol;attribute float aRot;varying vec4 vCol;varying float vRot;uniform float uScale;void main(){vCol=aCol;vRot=aRot;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=min(900.,aSize*uScale/max(.1,-mv.z));gl_Position=projectionMatrix*mv;}';
  const FS='uniform sampler2D map;varying vec4 vCol;varying float vRot;void main(){vec2 p=gl_PointCoord-.5;float c=cos(vRot),s=sin(vRot);p=vec2(c*p.x-s*p.y,s*p.x+c*p.y)+.5;vec4 t=texture2D(map,p);gl_FragColor=vec4(vCol.rgb*t.rgb,vCol.a*t.a);}';
  const U={uScale:{value:600}};
  const pool=(n,hot)=>{const g=new T.BufferGeometry(),P=new Float32Array(n*3),Z=new Float32Array(n),C=new Float32Array(n*4),R=new Float32Array(n);
    g.setAttribute('position',new T.BufferAttribute(P,3));g.setAttribute('aSize',new T.BufferAttribute(Z,1));g.setAttribute('aCol',new T.BufferAttribute(C,4));g.setAttribute('aRot',new T.BufferAttribute(R,1));g.setDrawRange(0,0);
    const m=new T.ShaderMaterial({uniforms:{uScale:U.uScale,map:{value:tex(hot)}},vertexShader:VS,fragmentShader:FS,transparent:true,depthWrite:false,blending:hot?T.AdditiveBlending:T.NormalBlending});
    const o=new T.Points(g,m);o.frustumCulled=false;o.renderOrder=hot?6:5;scene.add(o);
    return{g,P,Z,C,R,n,hot,list:[],free:[]}};
  const F=pool(NF,true),Sm=pool(NS,false);const EM=[];const _v=new T.Vector3(),_w=new T.Vector3();
  function add(L,p,o){if(L.list.length>=L.n)L.list.shift();const a=Math.random()*6.283,sp=o.spd||0,v=new T.Vector3(Math.cos(a),(Math.random()-.5)*(o.flat?.4:1.6),Math.sin(a)).normalize().multiplyScalar(sp*(.3+Math.random()*.7));
    if(o.vel)v.add(o.vel);const sp2=o.spread||0;L.list.push({x:p.x+(Math.random()-.5)*sp2,y:p.y+(Math.random()-.5)*sp2*.6,z:p.z+(Math.random()-.5)*sp2,vx:v.x,vy:v.y,vz:v.z,age:0,life:o.life*(.7+Math.random()*.6),
      s0:o.size[0]*(.8+Math.random()*.4),s1:o.size[1]*(.8+Math.random()*.4),rot:Math.random()*6.283,rv:(Math.random()-.5)*(o.spin||1),up:o.up||0,drag:o.drag||1.2,c0:o.c0||.16,c1:o.c1||.42,a:o.alpha||.85,tint:o.tint||null})}
  const api={
    fire(p,o){o=Object.assign({n:6,spd:1,size:[1,2.5],life:.7,up:2.5,drag:1.5},o);for(let i=0;i<o.n;i++)add(F,p,o)},
    smoke(p,o){o=Object.assign({n:4,spd:.6,size:[1.5,5],life:3,up:1.2,drag:1},o);for(let i=0;i<o.n;i++)add(Sm,p,o)},
    // a fireball: a hot core, flames thrown outward, then a rolling column of smoke. k scales it (1 is a grenade); space=true has no rising smoke
    boom(p,k,space){k=k||1;api.fire(p,{n:Math.round(16+8*k),spd:8*k,size:[.9*k,3.2*k],life:.6,up:space?0:3.5,drag:3.2,spread:.8*k,spin:2});api.fire(p,{n:5,spd:1.5,size:[2.4*k,5*k],life:.3,up:0,drag:2});
      api.smoke(p,{n:Math.round(7+4*k),spd:3.2*k,size:[2*k,8*k],life:space?4.5:3.6,up:space?0:1.6,drag:1.6,spread:k,c0:.09,c1:.32,alpha:.8});
      fxq.push({t:.25,fn:()=>api.smoke(p,{n:Math.round(4+3*k),spd:1.2*k,size:[3*k,10*k],life:space?5:4.5,up:space?0:2.2,drag:1,spread:1.5*k,c0:.14,c1:.42,alpha:.6})})},
    // continuous source: get(out) gives the position each frame; fire and/or smoke at a rate per second for dur seconds (Infinity while alive() is true)
    emit(get,o){const e=Object.assign({get,rate:8,dur:3,acc:0,fire:true,smoke:true,fs:[.8,2],ss:[1.5,5],alive:null,kill:false},o);EM.push(e);return e},
    tick(dt){U.uScale.value=renderer.domElement.height/(2*Math.tan(cam.fov*Math.PI/360));
      for(let i=EM.length-1;i>=0;i--){const e=EM[i];e.dur-=dt;if(e.kill||e.dur<=0||(e.alive&&!e.alive())){EM.splice(i,1);continue}if(!e.get(_w))continue;if(cam.position.distanceTo(_w)>(e.far||400))continue;
        e.acc+=e.rate*dt;while(e.acc>=1){e.acc--;if(e.fire)api.fire(_w,{n:1,spd:e.fspd||.6,size:e.fs,life:e.flife||.6,up:e.fup||3,spread:e.spread||.3});if(e.smoke&&Math.random()<(e.sp||.6))api.smoke(_w,{n:1,spd:.3,size:e.ss,life:e.slife||3.2,up:e.sup||1.6,spread:e.spread||.3,c0:e.c0||.12,c1:e.c1||.38,alpha:e.alpha||.7,vel:e.vel})}}
      const cp=cam.position;
      for(const L of[F,Sm]){const A=L.list;for(let i=A.length-1;i>=0;i--){const q=A[i];q.age+=dt;if(q.age>=q.life){A.splice(i,1);continue}const dr=Math.exp(-q.drag*dt);q.vx*=dr;q.vz*=dr;q.vy=q.vy*dr+q.up*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.z+=q.vz*dt;q.rot+=q.rv*dt}
        if(!L.hot)A.sort((a,b)=>((b.x-cp.x)**2+(b.y-cp.y)**2+(b.z-cp.z)**2)-((a.x-cp.x)**2+(a.y-cp.y)**2+(a.z-cp.z)**2));
        for(let i=0;i<A.length;i++){const q=A[i],t=q.age/q.life;L.P[i*3]=q.x;L.P[i*3+1]=q.y;L.P[i*3+2]=q.z;L.Z[i]=q.s0+(q.s1-q.s0)*Math.sqrt(t);L.R[i]=q.rot;let r,g,b,a;
          if(L.hot){if(t<.2){const u=t/.2;r=1.6;g=1.5-.5*u;b=1.05-.75*u}else if(t<.55){const u=(t-.2)/.35;r=1.6-.4*u;g=1-.6*u;b=.3-.22*u}else{const u=(t-.55)/.45;r=1.2-.7*u;g=.4-.3*u;b=.08}a=.8*Math.min(1,t/.05)*Math.pow(1-t,1.2)}
          else{const c=q.c0+(q.c1-q.c0)*t;r=c;g=c*.97;b=c*.94;a=q.a*Math.min(1,t/.1)*Math.pow(1-t,1.5)}
          L.C[i*4]=r;L.C[i*4+1]=g;L.C[i*4+2]=b;L.C[i*4+3]=a}
        L.g.setDrawRange(0,A.length);for(const k of['position','aSize','aCol','aRot'])L.g.attributes[k].needsUpdate=true}},
    clear(){F.list.length=0;Sm.list.length=0;EM.length=0},count:()=>F.list.length+Sm.list.length,pools:()=>[F,Sm],dbg:()=>({f:F.list.length,s:Sm.list.length,fr:F.g.drawRange.count,fc:Array.from(F.C.slice(0,8)),fz:Array.from(F.Z.slice(0,2)),fp:Array.from(F.P.slice(0,3)),vis:F.g.attributes.position.count})};
  return api})();

/* ---------- collision helpers ---------- */
const PR=0.35,PH=1.7,EYE=1.55;
// spatial grid over the collision boxes (XZ cells), rebuilt whenever boxes are added
function grid(){if(gridN===boxes.length)return GRID;GRID=new Map();for(const b of boxes){b.s=0;
    for(let ix=Math.floor(b.lo[0]/GC);ix<=Math.floor(b.hi[0]/GC);ix++)for(let iz=Math.floor(b.lo[2]/GC);iz<=Math.floor(b.hi[2]/GC);iz++){const k=(ix+4096)*8192+iz+4096;let c=GRID.get(k);if(!c)GRID.set(k,c=[]);c.push(b)}}
  gridN=boxes.length;return GRID}
function cell(ix,iz){return grid().get((ix+4096)*8192+iz+4096)||EMPTY}
function nearList(x0,z0,x1,z1){grid();const st=++stamp,out=[];for(let ix=Math.floor(x0/GC);ix<=Math.floor(x1/GC);ix++)for(let iz=Math.floor(z0/GC);iz<=Math.floor(z1/GC);iz++)for(const b of cell(ix,iz))if(b.s!==st){b.s=st;out.push(b)}return out}
function rayBoxes(o,d,max){let best=max;grid();const st=++stamp;
  let ix=Math.floor(o[0]/GC),iz=Math.floor(o[2]/GC);const sx=d[0]>0?1:-1,sz=d[2]>0?1:-1,ax=Math.abs(d[0]),az=Math.abs(d[2]);
  const tdx=ax<1e-9?Infinity:GC/ax,tdz=az<1e-9?Infinity:GC/az;
  let tx=ax<1e-9?Infinity:(sx>0?(ix+1)*GC-o[0]:o[0]-ix*GC)/ax,tz=az<1e-9?Infinity:(sz>0?(iz+1)*GC-o[2]:o[2]-iz*GC)/az;
  for(let n=0;n<5000;n++){
    for(const b of cell(ix,iz)){if(b.s===st)continue;b.s=st;let t0=0,t1=best,ok=true;
      for(let a=0;a<3;a++){if(Math.abs(d[a])<1e-9){if(o[a]<b.lo[a]||o[a]>b.hi[a]){ok=false;break}}
        else{let nn=(b.lo[a]-o[a])/d[a],f=(b.hi[a]-o[a])/d[a];if(nn>f){const q=nn;nn=f;f=q}if(nn>t0)t0=nn;if(f<t1)t1=f;if(t0>t1){ok=false;break}}}
      if(ok)best=t0}
    const tn=Math.min(tx,tz);if(tn>=best)break;if(tx<tz){ix+=sx;tx+=tdx}else{iz+=sz;tz+=tdz}}
  if(d[1]<0){const t=-o[1]/d[1];if(t>=0&&t<best)best=t}
  return best}
function los(a,b){const d=[b.x-a.x,b.y-a.y,b.z-a.z],l=Math.hypot(d[0],d[1],d[2]);if(l<0.01)return true;
  d[0]/=l;d[1]/=l;d[2]/=l;return rayBoxes([a.x,a.y,a.z],d,l)>=l-0.01}
function inBox(x,y,z){for(const b of cell(Math.floor(x/GC),Math.floor(z/GC)))if(x>b.lo[0]&&x<b.hi[0]&&y>b.lo[1]&&y<b.hi[1]&&z>b.lo[2]&&z<b.hi[2])return true;return false}
function groundAt(x,z,y){let g=0;for(const b of cell(Math.floor(x/GC),Math.floor(z/GC)))if(x>b.lo[0]&&x<b.hi[0]&&z>b.lo[2]&&z<b.hi[2]&&b.hi[1]<=y+0.5&&(b.hi[1]<=3.1||b.floor||(b.hi[1]<=4.6&&Math.min(b.hi[0]-b.lo[0],b.hi[2]-b.lo[2])>=7))&&b.hi[1]>g)g=b.hi[1];return g}
function pushOut(o,r,free){for(const b of nearList(o.x-r,o.z-r,o.x+r,o.z+r)){
    const cx=Math.max(b.lo[0],Math.min(o.x,b.hi[0])),cy=Math.max(b.lo[1],Math.min(o.y,b.hi[1])),cz=Math.max(b.lo[2],Math.min(o.z,b.hi[2]));
    const dx=o.x-cx,dy=o.y-cy,dz=o.z-cz,d2=dx*dx+dy*dy+dz*dz;
    if(d2<r*r){if(d2>1e-8){const d=Math.sqrt(d2),k=(r-d)/d;o.x+=dx*k;o.y+=dy*k;o.z+=dz*k}else{let best=o.x-b.lo[0],ax=0;const c=[[b.hi[0]-o.x,1],[o.z-b.lo[2],2],[b.hi[2]-o.z,3]];if(b.hi[1]-o.y<1.2)c.push([b.hi[1]-o.y,4]);
      for(const[v,k]of c)if(v<best){best=v;ax=k}if(ax===0)o.x=b.lo[0]-r;else if(ax===1)o.x=b.hi[0]+r;else if(ax===2)o.z=b.lo[2]-r;else if(ax===3)o.z=b.hi[2]+r;else o.y=b.hi[1]+r}}}
  if(free)return;if(o.y<r)o.y=r;o.x=Math.max(-AX+.1+r,Math.min(AX-.1-r,o.x));o.z=Math.max(-AZ+.1+r,Math.min(AZ-.1-r,o.z))}

/* ---------- state ---------- */
const pos=new T.Vector3(0,0,15),eye=new T.Vector3(),tmp=new T.Vector3(),tmp2=new T.Vector3();
let state='menu',yaw=0,pitch=0,vy=0,ground=true,hp=100,shield=100,shDelay=0,heat=0,over=false,sinceFire=9,fireCd=0,flash=0,recoil=0,bob=0,
    hurtA=0,shake=0,score=0,wave=0,waveTimer=0,time=0,locked=false,touchUI=false,best=0,msgT=0,
    weapon=0,grenCd=0,meleeCd=0,meleeA=0,superQ=0,novaA=0,swapT=-1,jumpQ=false;
let enemies=[],shots=[],pickups=[],queue=[],grenades=[],blasts=[];
try{best=+localStorage.getItem('gh9-best')||0}catch(e){}
$('best').textContent=best.toLocaleString();
const COMMS=[];let commCur=null,commChars=0,commT=0,lastLow=-99;const seenVeh={};
const WHO={H:['CAPT. INES VARGA · HALCYON','cmd'],C:['FLEET COMMAND · EUROPA ORBITAL','cmd'],R:['ROWAN ADEYEMI · DECK BOTANIST',''],L:['LATTICE · GROW-CONTROL AI','ai'],G:['RECOVERED LOG','log']};
/* ---------- voice: the browser's own speech synthesis reads every radio line and cutscene caption. Voices differ per device ---------- */
var VOICE={on:true,busy:false,id:0,lastCancel:0,miss:0,started:false,cur:null,audio:null,pick:{},voices:[],ok:typeof speechSynthesis!=='undefined'&&typeof SpeechSynthesisUtterance!=='undefined'};
try{VOICE.on=localStorage.getItem('gh9-vox')!=='0'}catch(e){}
try{VOICE.pick=JSON.parse(localStorage.getItem('gh9-voicepick')||'{}')||{}}catch(e){VOICE.pick={}}
function lineId(t){let h=5381;for(let i=0;i<t.length;i++)h=((h<<5)+h+t.charCodeAt(i))>>>0;return h.toString(16).padStart(8,'0')}
var VDB={db:null,clips:{},n:0};
function voiceLoad(){if(!VOICE.ok)return;try{VOICE.voices=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang)).sort((a,b)=>(/natural|neural|google|premium|enhanced/i.test(b.name)?1:0)-(/natural|neural|google|premium|enhanced/i.test(a.name)?1:0))}catch(e){}try{voicePickBuild()}catch(e){}}
if(VOICE.ok){voiceLoad();try{speechSynthesis.onvoiceschanged=voiceLoad}catch(e){}}
function voiceStop(keep){VOICE.id++;VOICE.busy=false;if(!keep)VOICE.cur=null;if(VOICE.src){try{VOICE.src.onended=null;VOICE.src.stop()}catch(e){}VOICE.src=null}if(VOICE.audio){try{VOICE.audio.pause()}catch(e){}VOICE.audio=null}if(VOICE.ok){try{if(speechSynthesis.speaking||speechSynthesis.pending){speechSynthesis.cancel();VOICE.lastCancel=performance.now()}}catch(e){}}}
// speakers: N narrator, R Rowan, L Lattice (the AI: low and slow), G recovered logs
/* recorded voice lines (ElevenLabs, built in) and imported recordings play through the game's audio context, which a click has already unlocked */
let VC=null;const VBUF={},VDEC={},VORD=[];
function vclip(id){if(!VC){try{VC=JSON.parse(document.getElementById('vclips').textContent)}catch(e){VC={}}}return VC[id]}
function b64buf(b){const s=atob(b),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u.buffer}
function vdecode(lid){if(VBUF[lid])return Promise.resolve(VBUF[lid]);if(VDEC[lid])return VDEC[lid];if(!ac)return Promise.reject(0);const url=VDB.clips[lid],b64=!url&&vclip(lid);if(!url&&!b64)return Promise.reject(0);
  const p=(url?fetch(url).then(r=>r.arrayBuffer()):Promise.resolve(b64buf(b64))).then(ab=>new Promise((res,rej)=>ac.decodeAudioData(ab,res,rej))).then(b=>{VBUF[lid]=b;VORD.push(lid);while(VORD.length>16)delete VBUF[VORD.shift()];delete VDEC[lid];return b});
  VDEC[lid]=p;p.catch(()=>{delete VDEC[lid]});return p}
function hasClip(text){const id=lineId(text);return !!(VDB.clips[id]||vclip(id))}
function vwarm(text){if(ac&&text&&hasClip(text))vdecode(lineId(text)).catch(()=>{})}
function playLine(text,k){if(VOICE.src){try{VOICE.src.onended=null;VOICE.src.stop()}catch(e){}VOICE.src=null}if(VOICE.ok&&typeof speechSynthesis!=='undefined'&&(speechSynthesis.speaking||speechSynthesis.pending)){speechSynthesis.cancel();VOICE.lastCancel=performance.now()}
  const lid=lineId(text),id=++VOICE.id;VOICE.busy=true;VOICE.cur={text,k};
  const go=buf=>{if(VOICE.id!==id)return;try{if(ac.state==='suspended')ac.resume();const src=ac.createBufferSource(),g=ac.createGain();g.gain.value=Math.min(1.6,(CFG.vol||1)*1.35);src.buffer=buf;src.connect(g);g.connect(ac.destination);
      src.onended=()=>{if(VOICE.id===id){VOICE.busy=false;VOICE.cur=null;VOICE.src=null}};VOICE.src=src;src.start();setTimeout(()=>{if(VOICE.id===id&&VOICE.busy){VOICE.busy=false;VOICE.cur=null}},buf.duration*1000+3000)}catch(e){VOICE.busy=false}};
  vdecode(lid).then(go,()=>{if(VOICE.id===id){VOICE.id--;speakTTS(text,k)}});
  setTimeout(()=>{if(VOICE.id===id&&VOICE.busy&&!VOICE.src){VOICE.busy=false}},6000)}
function speak(text,k){if(VOICE.on&&!muted&&text&&ac&&hasClip(text)){playLine(text,k);return}speakTTS(text,k)}
function speakTTS(text,k){if(VOICE.src){try{VOICE.src.onended=null;VOICE.src.stop()}catch(e){}VOICE.src=null}
  if(!VOICE.ok||!VOICE.on||muted||!text){VOICE.busy=false;return}
  try{if(speechSynthesis.speaking||speechSynthesis.pending){speechSynthesis.cancel();VOICE.lastCancel=performance.now()}const wait=Math.max(0,90-(performance.now()-VOICE.lastCancel)),u=new SpeechSynthesisUtterance(text),id=++VOICE.id,P={N:[0,.95,.92],R:[1,1.08,1.03],L:[2,.55,.85],G:[0,.7,.95],C:[3,.8,1.04],H:[4,1.05,1.0]}[k]||[0,1,1],vs=VOICE.voices;
    {const pv=VOICE.pick[k]&&speechSynthesis.getVoices().find(x=>x.name===VOICE.pick[k]),dv=vs.length?vs[P[0]%vs.length]:null;if(pv||dv)u.voice=pv||dv}u.lang='en-US';u.pitch=P[1];u.rate=P[2];u.volume=Math.min(1,(CFG.vol||1)*1.2);VOICE.busy=true;VOICE.started=false;VOICE.cur={text,k};
    u.onstart=()=>{if(VOICE.id===id){VOICE.started=true;VOICE.miss=0}};u.onend=u.onerror=()=>{if(VOICE.id===id){VOICE.busy=false;VOICE.cur=null}};
    setTimeout(()=>{if(VOICE.id===id&&VOICE.busy&&!VOICE.started&&!speechSynthesis.speaking&&!speechSynthesis.pending){VOICE.busy=false;if(++VOICE.miss>=4){VOICE.ok=false;$('vox').textContent='Voice stuck · click to retry'}}},4500);
    setTimeout(()=>{if(VOICE.id===id)VOICE.busy=false},text.length*115+3000);
    // some browsers drop a line spoken in the same instant as a cancel, so wait a moment after cancelling
    if(wait>0)setTimeout(()=>{if(VOICE.id===id)speechSynthesis.speak(u)},wait);else speechSynthesis.speak(u)}catch(e){VOICE.busy=false}}
const VSAMPLE={N:'Year 2687. Thalassa Station, in orbit above Europa.',R:'Stay close. I will watch your back.',L:'Come forward, soldier. Come and hear the song properly.',G:'Log 2010. Seed vault inventory, sealed.',C:'Thalassa, this is Fleet Command. Glad to hear you are alive.'};
function voicePickBuild(){for(const k of['N','R','L','G','C']){const el=$('vp'+k);if(!el)continue;el.innerHTML='';const a=document.createElement('option');a.value='';a.textContent='Automatic';el.appendChild(a);
    for(const v of VOICE.voices){const o=document.createElement('option');o.value=v.name;o.textContent=v.name+' ('+v.lang+')';el.appendChild(o)}el.value=VOICE.pick[k]||'';if(el.value!==(VOICE.pick[k]||''))el.value='';
    el.onchange=()=>{if(el.value)VOICE.pick[k]=el.value;else delete VOICE.pick[k];try{localStorage.setItem('gh9-voicepick',JSON.stringify(VOICE.pick))}catch(e){}voiceStop();VOICE.ok=VOICE.ok||typeof speechSynthesis!=='undefined';speak(VSAMPLE[k],k)}}}
/* imported recordings live in this browser (IndexedDB). A file named after a line's id replaces the computer voice for that line */
function vdbShow(){const n=Object.keys(VDB.clips).length;if($('vnote'))$('vnote').textContent=n?n+' recording'+(n>1?'s':'')+' imported. They play instead of the computer voice for the lines they are named after.':'No recordings imported. A recording replaces the computer voice for the line it is named after.';if($('vclr'))$('vclr').hidden=!n}
function vdbOpen(){return new Promise(r=>{try{const q=indexedDB.open('gh9-voice',1);q.onupgradeneeded=()=>q.result.createObjectStore('clips');q.onsuccess=()=>{VDB.db=q.result;r(true)};q.onerror=()=>r(false)}catch(e){r(false)}})}
async function vdbLoad(){if(!(await vdbOpen()))return;try{const tx=VDB.db.transaction('clips'),st=tx.objectStore('clips'),ks=st.getAllKeys(),vs=st.getAll();tx.oncomplete=()=>{ks.result.forEach((k,i)=>{VDB.clips[k]=URL.createObjectURL(vs.result[i])});vdbShow()}}catch(e){}}
async function vdbImport(files){if(!VDB.db&&!(await vdbOpen())){if($('vnote'))$('vnote').textContent='This browser would not let me store recordings.';return}let n=0,bad=0;
  for(const f of files){const id=f.name.replace(/\.[^.]+$/,'').toLowerCase();if(!/^[0-9a-f]{8}$/.test(id)){bad++;continue}try{await new Promise((res,rej)=>{const tx=VDB.db.transaction('clips','readwrite');tx.objectStore('clips').put(f,id);tx.oncomplete=res;tx.onerror=rej});if(VDB.clips[id])URL.revokeObjectURL(VDB.clips[id]);VDB.clips[id]=URL.createObjectURL(f);n++}catch(e){bad++}}
  vdbShow();if(bad&&$('vnote'))$('vnote').textContent+=' '+bad+' file'+(bad>1?'s were':' was')+' skipped because the name is not an 8-character line id.'}
function vdbClear(){voiceStop();for(const k in VDB.clips){URL.revokeObjectURL(VDB.clips[k]);delete VDB.clips[k]}vdbShow();try{const tx=VDB.db.transaction('clips','readwrite');tx.objectStore('clips').clear();tx.oncomplete=vdbShow}catch(e){}}
function voicePrime(){}
function comm(k,text,hold){if(state==='menu')return;vwarm(text);COMMS.push({k,text,hold:hold||Math.max(3.5,text.length*0.055)});if(COMMS.length>14)COMMS.splice(0,COMMS.length-14)}
function commsTick(dt){const el=$('comms');
  if(!commCur){if(!COMMS.length)return;commCur=COMMS.shift();commChars=0;commT=commCur.hold;speak(commCur.text,commCur.k);if(VOICE.busy)commT=.7;const w=WHO[commCur.k];$('commWho').textContent=w[0];el.className='comms '+w[1];el.hidden=false;tone('sine',880,880,.04,.03)}
  commChars+=dt*60;$('commText').textContent=commCur.text.slice(0,commChars|0);
  if(commChars>=commCur.text.length){if(VOICE.busy&&VOICE.on)return;commT-=dt;if(commT<=0){commCur=null;if(!COMMS.length)el.hidden=true}}}
const STORY={
  intro:[['R',"You're up. Good. Rowan Adeyemi, botanist. I'm sealed in the seed vault under the farm deck."],
    ['R',"Every drone and repair frame aboard answers to the Dark now. Clear the commons first."]],
  purge:[[['R',"Machines are thick around the hub. Thin them out so I can get the vents open."]],
    [['R',"Those walkers were military repair frames yesterday. The Undertow is printing soldiers out of our own maintenance bays."],['L',"Repair is a form of love. The Dark taught me that."]],
    [['R',"They're learning. They take cover now, and they've bolted jump jets onto the frames. Keep moving."]],
    [['R',"Mars stopped answering this morning. Then the shipyards at Ceres. Every machine we built is turning, one world at a time."]],
    [['L',"You hid under a sword and called it an age of gold. The Dark has come to take the sword."]],
    [['R',"Every wave is bigger. It's pulling machines up from the lower decks. Hold here. We're the last door."]]],
  boss:{matriarch:[['R',"Something huge just lifted out of the drone foundry. A carrier, with shield nodes circling it."],['L',"The Matriarch carries the song. Let her sing to you."]],
    colossus:[['R',"That's a hull-breaker frame. It used to weld armor onto the outer hull. Now it's walking. Shoot the power cells on its frame."],['L',"The Colossus was built to hold this station together. It still is."]],
    widow:[['R',"Spider tank, up from the cargo lifts. Six legs, twin cannons, and it's carrying passengers. Go for the vents on its back."],['L',"The Widow keeps the nest. You are standing in the nest."]]},
  done:{purge:[['R',"Deck's clear. Breathe while you can."],['R',"That's the vents open. I can smell actual air again."],['R',"Clear. I'm rerouting power to the hydroponics. They'll be back."]],
    boss:[['R',"It's down. For a second the signal went quiet on every channel."],['L',"I was only the door. Those who serve the Dark are already on their way to Europa."]]},
  logs:["LOG 0001 · ARCHIVE: Year 2214. The Blade arrives. A sword the size of a moon, hanging silent off Jupiter. Nobody sees it come.",
    "LOG 0044 · ARCHIVE: Within a century of the Blade, we have star drives, thinking machines and no hunger. We call it the golden age.",
    "LOG 0310 · DEEP WATCH: Something beyond the heliopause has started answering the Blade's light. It is not a reflection.",
    "LOG 1207 · MARS COMMAND: Every military AI on Olympus went quiet for nine seconds. When they came back, they were not ours.",
    "LOG 1412 · UNKNOWN: give us the sword give us the sword give us the sword",
    "LOG 2001 · A. OKAFOR: Lattice was air-gapped. The Undertow came in anyway, through a repair frame back from the Europa run.",
    "LOG 2003 · R. ADEYEMI: Thalassa is a military base. If its machines hold this station, the Dark has a fortress in orbit over Europa.",
    "LOG 2007 · A. OKAFOR: The machines are only the first wave. Deep Watch is tracking ships. Whatever serves the Dark is coming to Europa in person."
]};
let logI=0;
let bossN=0;
/* ---------- campaign: Level 1, the Thalassa encounter. Four stages, each in its own part of the ship; later stages are endless ---------- */
const CAMP=[
 {name:'Wake',area:'THE COMMONS',rooms:['COMMONS'],at:[0,24],n:8,gapS:2.4,delay:7,dmgK:.4,mix:[[5,5],[0,3]],boss:null,
  start:[['R',"Machines are thick around the atrium. Thin them out so I can get the vents open."],['L',"I hear it now, Rowan. Behind the stars. It is so much larger than us."]],
  radio:[{k:5,lines:[['C',"Thalassa, this is Fleet Command, Europa Orbital. We have your beacon. We are glad to hear anyone survived the Wellmonger's invasion."],
    ['C',"Our read: the Wellmonger, the Dark's general, hit Mars, Ceres and Thalassa in the same hour. Every machine aboard your station is turned."],
    ['C',"Regroup at Meridian Station, in orbit over Europa. Take the shuttle from Hangar Two. Clear your decks first, then launch."]]}],
  end:[['R',"Commons is clear. They're printing those frames in the foundry, aft, in engineering. Follow the marker."],['R',"Stay close. I'll watch your back."]]},
 {name:'Engine Deck',area:'ENGINEERING',rooms:['ENGINEERING','HABITAT','AFT SPINE'],at:[60,48],n:12,gapS:.8,dmgK:.8,mix:[[5,4],[7,2],[6,2],[10,1.5],[0,2],[1,1]],boss:'colossus',bossRoom:'ENGINEERING',
  start:[['R',"Those walkers were repair frames yesterday. The Undertow is printing soldiers out of our own maintenance bays."],['R',"Engineering is through the orange door off the commons. Shut the foundry down."]],
  bossL:[['R',"That's a hull-breaker frame. It used to weld armor onto the outer hull. Now it's walking. Shoot the power cells on its frame."],['L',"The Colossus was built to hold this station together. It still is."]],
  log:"LOG 2010 · R. ADEYEMI: Seed vault inventory, sealed. 4,112 strains of wheat, rice and barley, and the last of the Europa spring cultivars. Eleven years of my life are in that room.",
  end:[['R',"The foundry's dark. For a second the signal went quiet on every channel."],['R',"Now the hangar. If they hold the launch bay, nothing leaves this station."]]},
 {name:'Hangar Two',area:'THE HANGAR',rooms:['HANGAR'],at:[0,160],n:14,gapS:.45,mix:[[5,3],[7,2],[8,2],[9,2],[11,1.5],[12,1.5],[0,2],[1,1.5]],gunship:1,boss:'widow',bossRoom:'HANGAR',
  start:[['R',"Mars stopped answering this morning. Then the shipyards at Ceres. Every machine we built is turning, one world at a time."],['L',"You hid under a sword and called it an age of gold."]],
  bossL:[['R',"Spider tank, up from the cargo lifts. Six legs, twin cannons, and it's carrying passengers. Go for the vents on its back."],['L',"The Widow keeps the nest. You are standing in the nest."]],
  log:"LOG 2011 · R. ADEYEMI: My daughter Imani is down on Europa, in Cryo-farm Four. The colonies eat what this deck grows. I won't let the Dark have the harvest, or the people who eat it.",
  end:[['R',"Hangar's ours. There's the shuttle, fueled and intact."],['C',"Good. But the Wellmonger's signal still runs through Lattice on your bridge. Cut it before you launch."],['L',"Come forward, soldier. Come and hear the song properly."]]},
 {name:'The Song',area:'THE FARMS',rooms:['PORT FARMS','STARBOARD FARMS','FORE SPINE','BRIDGE'],at:[-60,-48],n:16,gapS:.4,mix:[[5,4],[7,2.5],[6,2],[8,1.5],[9,1.5],[10,1.5],[11,1.5],[12,1.5],[0,2],[1,1.5]],gunship:1,boss:'matriarch',bossRoom:'COMMONS',
  start:[['R',"Everything it has left is between you and the bridge. Push through the farms."],['L',"Repair is a form of love. The Dark taught me that."]],
  bossL:[['R',"She's lifting out of the atrium well. A carrier, with shield nodes circling it. Get back to the commons."],['L',"The Matriarch carries the song. Let her sing to you."]],
  log:"LOG 2012 · R. ADEYEMI: The pruner is a grow-lab laser meant for trimming vines under the lamps. It cuts a drone just as clean. Turns out a gardener makes a decent soldier.",
  end:[['R',"She's down. But Lattice is still on every channel, and it's coming from the bridge."],['L',"Come to the bridge. Come and see what I am."],['R',"Its core sits in the middle of the console ring. Shoot it apart, or pull its four power couplings by hand. Your call."]],
  after:[['R',"Deep Watch confirms it. Ships, hundreds of them, burning for the ice. The fight is moving to the surface."],['R',"I have the seed case on my back, every strain we own. The shuttle in the hangar is fueled. You and I are getting off this rock, soldier. Europa needs us."]]}];
const pickMix=mix=>{let tot=0;for(const[,w]of mix)tot+=w;let r=Math.random()*tot;for(const[t,w]of mix){r-=w;if(r<0)return t}return mix[0][0]};
let endT=0,endCap=0;
function showEnding(){if(document.pointerLockElement)document.exitPointerLock();closeWheel(false);setState('paused');$('ovKeys').hidden=true;$('classes').hidden=true;$('loadout').hidden=true;$('superpick').hidden=true;
  $('ovTitle').textContent='Level 1 complete';const txt='Thalassa holds. You cleared all four stages and '+(LC&&LC.out==='unplug'?'pulled Lattice\'s plug with your own hands':'blew Lattice\'s core apart')+', score '+score.toLocaleString()+'. Rowan has the seed case and the shuttle is waiting in the hangar for the flight to Meridian Station. The Dark\'s own forces are on their way to Europa. Start Level 2 to take the shuttle out, or keep fighting endless stages aboard the station.';$('ovText').textContent=txt;
  $('go').textContent='Keep fighting';$('retry').hidden=false;$('retry').textContent='Start Level 2';LAST={m:2,s:1};speak(txt,'N');VOICE.cur=null;gap=3}
/* ---------- intro cutscene: six camera shots with captions. The game does not run until it ends or is skipped ---------- */
var INTRO1,INTRO={on:false,t:0,i:-1,grace:0,actors:[],after:null,shots:[
 {d:4.5,title:1,p:[-700,2500,-500,-700,2500,-500],l:[700,4300,-2300,700,4300,-2300],text:''},
 {d:7,p:[-700,2500,-500,-560,2650,-640],l:[700,4300,-2300,700,4300,-2300],text:'Year 2214. The Blade arrives: a sword the size of a moon, hanging silent off Jupiter. Nobody sees it come.'},
 {d:7,p:[-900,700,-900,-860,560,-820],l:[700,4300,-2300,0,0,0],text:'Within a century we have star drives, thinking machines and no hunger. We call it the golden age.'},
 {d:7,p:[560,170,-460,400,110,-230],l:[0,20,40,0,20,60],text:'Year 2687. Thalassa Station, a military farm station in orbit above Europa.'},
 {d:8,act:'drones',p:[34,11.7,12,30,12,9.5],l:[-20,8,-10,-22,9,-11],text:'Something beyond the stars answered the Blade\'s light. We named it the Dark. It came for the sword, and it came first through our machines.'},
 {d:7,act:'march',p:[0,1,-54,0,1.05,-55.5],l:[0,1.7,-76,0,1.7,-76],text:'An hour ago the station AI, Lattice, stopped answering. Every drone and repair frame aboard now serves the Dark.'},
 {d:4,p:[0,1.2,24,0,1.7,24],l:[0,3,-40,0,1.7,-40],text:'You are the last soldier awake on the farm deck.'}]};
INTRO1=INTRO.shots;
const L2SHOTS=[{d:4.5,title:1,p:[380,120,780,380,120,780],l:[0,10,150,0,10,150],text:''},
 {d:8,k:'C',p:[420,140,820,330,100,660],l:[0,10,150,0,10,180],text:'Thalassa, this is Fleet Command. Your shuttle, Kestrel, is fueled in Hangar Two. Meridian Station is waiting for you.'},
 {d:8,act:'board',k:'R',p:[-8.5,2.1,189,-6.8,1.9,192.5],l:[-2,1.4,200,-1,1.6,203],text:"Seed case is strapped in. I'm riding in the back, and I've still got the pruner if anything gets close."},
 {d:7,act:'launch',p:[26,40,440,18,34,446],l:[0,10,250,0,10,250],text:'Two survivors and one shuttle. Every machine between Thalassa and Meridian Station has turned against them.'},
 {d:7,k:'C',p:[260,220,980,200,180,900],l:[0,-1400,-1200,0,-1500,-1300],text:"Kestrel, be advised. The Wellmonger's interceptors are hunting the lanes. Guns hot the moment you clear the hull."}];
function introShow(on){$('cine').hidden=!on;$('hud').hidden=on;$('radar').hidden=on;$('cross').hidden=on;vm.visible=!on;if(on)$('hint').hidden=true;else syncHint()}
function introStart(shots,after,sub){INTRO.shots=shots||INTRO1;INTRO.after=after||null;$('cineTitle').lastChild.textContent=sub||'Level 1 · The Thalassa encounter';for(const q of INTRO.shots)vwarm(q.text);INTRO.on=true;INTRO.t=0;INTRO.i=-1;INTRO.grace=.8;introShow(true)}
function introActor(type,x,y,z){const m=model(type);m.g.position.set(x,y,z);scene.add(m.g);const gl=glow(0xff3030,type>=5?1.3:1.8,.01);gl.position.y=type>=5?1.55:0;m.g.add(gl);
  m.g.scale.setScalar(type>=5?1.15:2.2);INTRO.actors.push({type,pos:m.g.position,g:m.g,rig:m.rig,parts:m.parts,wings:m.wings,gl,ph:Math.random()*6,mv:1,kick:0,ch:0,lunge:0,vy:0,dying:0,flash:0,burst:0,bt:0,ft:0,cd:1,spd:3,side:1,hp:1,aim:m.rig&&m.rig.aim,x0:x,y0:y,z0:z})}
function introClear(){for(const a of INTRO.actors)scene.remove(a.g);INTRO.actors.length=0}
function introEnd(){if(!INTRO.on)return;INTRO.on=false;voiceStop();introClear();introShow(false);if(INTRO.after){const f=INTRO.after;INTRO.after=null;f()}else for(const[k,t]of STORY.intro)comm(k,t)}
function introTick(dt){const S=INTRO.shots;INTRO.grace-=dt;
  {let t0=INTRO.t,i0=0;while(i0<S.length&&t0>=S[i0].d){t0-=S[i0].d;i0++}if(!(i0<S.length&&S[i0].text&&VOICE.on&&VOICE.busy&&i0===INTRO.i&&S[i0].d-t0<.72))INTRO.t+=dt}
  let t=INTRO.t,i=0;while(i<S.length&&t>=S[i].d){t-=S[i].d;i++}if(i>=S.length){introEnd();return}
  const q=S[i],u=t/q.d,e=u*u*(3-2*u),L=(a,b)=>a+(b-a)*e;if(i!==INTRO.i){INTRO.i=i;$('cineText').textContent=q.text;introClear();if(q.text)speak(q.text,q.k||'N');else voiceStop();
    if(q.act==='board'||q.act==='launch'){const g=shuttleModel();g.position.set(0,2.2,205);g.rotation.set(0,Math.PI,0);scene.add(g);INTRO.actors.push({g,pos:g.position,shuttle:true})}
    if(q.act==='board'){const g=new T.Group(),rg=walkerRig(g,8);g.position.set(-5.5,.95,193);scene.add(g);INTRO.actors.push({g,pos:g.position,rig:rg,mv:1,vy:0,kick:0,ph:0,crouch:0,jet:0,burst:0,ch:0,ft:0,rowan:true})}
    if(q.act==='drones')for(const[ty,x,y,z]of[[0,26.7,13.1,6.3],[0,22.9,11.1,10.1],[1,22.2,12.4,6.6],[0,21.7,13.8,2.6],[1,17.3,10.3,8.3],[0,16.9,12.5,3.7],[0,26.9,11.6,3.1],[0,14.1,11.9,5.2],[0,27,12.6,12]])introActor(ty,x,y,z);
    if(q.act==='march')for(const[ty,x,z]of[[5,-1.1,-68.9],[5,1.2,-71.4],[6,0,-75],[7,-2.4,-78],[10,2.4,-80],[5,-1.1,-83],[5,1.4,-86]])introActor(ty,x,ER[ty]*1.15,z)}
  // machines: drones hang in the well and their lights go red part-way through; troopers march up the spine
  for(const a of INTRO.actors){if(a.shuttle){if(q.act==='launch'){const k=Math.max(0,(t-1)/(q.d-1));a.pos.set(0,2.2+k*18,205+k*k*330);for(const f of a.g.userData.flames)f.scale.setScalar(1.5+k*4)}if(q.act==='launch')cam.lookAt(a.pos);continue}
    if(a.rowan){a.pos.x=-5.5+Math.min(1,t/5.5)*4.1;a.pos.z=193+Math.min(1,t/5.5)*8.5;a.mv=t<5.5?1:0;a.g.rotation.y=Math.atan2(4.1,8.5);try{a.rig.anim(a,time,dt)}catch(err){}continue}
    if(q.act==='drones'){const k=Math.max(0,Math.min(1,(u-.4)/.25));a.pos.y=a.y0+Math.sin(time*1.3+a.ph)*.35;a.g.rotation.y=Math.atan2(cam.position.x-a.pos.x,cam.position.z-a.pos.z)*k+a.ph*(1-k);a.gl.material.opacity=k*.4;if(a.rig){try{a.rig.anim(a,time,dt)}catch(err){a.rig=null}}}
    else{a.pos.z=a.z0+t*1.7;a.gl.material.opacity=.8;if(a.rig){try{a.rig.anim(a,time,dt)}catch(err){a.rig=null}}}}
  $('cineTitle').style.opacity=q.title?Math.max(0,Math.min(1,t/1.2,(q.d-t)/1)):0;
  cam.position.set(L(q.p[0],q.p[3]),L(q.p[1],q.p[4]),L(q.p[2],q.p[5]));if(q.act!=='launch')cam.lookAt(L(q.l[0],q.l[3]),L(q.l[1],q.l[4]),L(q.l[2],q.l[5]));else{const a=INTRO.actors.find(x=>x.shuttle);if(a)cam.lookAt(a.pos)}
  const fd=q.title?1:Math.max(0,1-t/.7,1-(q.d-t)/.7);$('cineFade').style.opacity=fd;$('cineText').style.opacity=1-fd}
addEventListener('mousedown',e=>{if(INTRO.on&&state==='playing'){if(INTRO.grace<=0)introEnd();e.stopPropagation()}},true);
addEventListener('touchstart',e=>{if(INTRO.on&&state==='playing'){if(INTRO.grace<=0)introEnd();e.stopPropagation()}},true);
function storyStart(m){const set=STORY.purge;for(const[k,t]of set[(wave-1)%set.length])comm(k,t)}
function storyBoss(kind){for(const[k,t]of STORY.boss[kind])comm(k,t)}
function storyEnd(boss){const set=STORY.done.purge,[k,t]=set[(wave-1)%set.length];comm(k,t);if(boss){for(const[k2,t2]of STORY.done.boss)comm(k2,t2);comm('G',STORY.logs[logI++%STORY.logs.length])}}
function say(t,d=2,c){const m=$('msg');m.textContent=t;m.style.color=c||'';m.classList.add('on');msgT=d}
const CLS=[{n:'Bulwark',d:'Heavy shield · boost jump · harder melee',sh:150,spd:1,gren:7},
  {n:'Strider',d:'Fast · double jump · quick reloads',sh:90,spd:1.2,gren:5},
  {n:'Grafter',d:'Glide · fast shield recharge',sh:110,spd:1.05,gren:6}];
const RAR=[{n:'Common',c:'#dcebe4',m:1},{n:'Uncommon',c:'#7be36b',m:1.1},{n:'Rare',c:'#6fd8ff',m:1.25},{n:'Epic',c:'#c9a6ff',m:1.45},{n:'Mythic',c:'#ffb238',m:1.7}];
const ELC=['#6fd8ff','#c9a6ff','#ffb238'];
const WPN=[
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
let grenCdK=[0,0,0,0,0,0],meleeCdK=[0,0,0,0,0,0],grenMaxK=[6,6,6,6,6,6],meleeMaxK=[4,4,4,4,4,4],supCd=[0,0,0],supT=[0,0,0],wheelOpen=false,wheelSel=-1,wx=0,wy=0,dryT=0;
let reloadT=0,reloadDur=1,spinV=0,swordT=0,dashT=0,grenMax=6,meleeMax=4,drumAng=0,dashDmg=0,fires=[],wells=[],rings=[],fxq=[],camFx=[];const dashV=new T.Vector3(),dashHit=new Set();
const SUP_CD=[45,40,40];
const SUPERS=[{n:'Ember Ronin',short:'RONIN',d:'20 s fire samurai · flaming sword waves · half damage taken',dur:20},
  {n:'Glacier Slam',short:'GLACIER',d:'Leap and slam · freezes the area · frost aura 10 s',dur:10},
  {n:'Voltaic Tempest',short:'TEMPEST',d:'10 s of chain lightning that leaps between machines',dur:10}];
let SUPK=0;try{SUPK=Math.max(0,Math.min(2,+localStorage.getItem('gh9-super')||0))}catch(e){}
let superT=0,superKind=-1,cineT=0,cineD=1.6,cineK=0,cineFx=0,frostTick=0,voltTick=0,waves=[],bolts=[];
const tmpN=new T.Vector3();
let sprintT=0,cls=0,shMax=100,boostT=0,gliding=false,airUsed=false,overT=0,guns=[],loots=[],shieldTip=false,dnCount=0;
try{cls=Math.max(0,Math.min(2,+localStorage.getItem('gh9-class')||0))}catch(e){}
const gunMult=i=>(1+(guns[i].pow-1)*0.12)*RAR[guns[i].rar].m;
const power=()=>Math.round(guns.reduce((a,g)=>a+g.pow,0)/guns.length);
const ORDER=[2,3,0,1,4,5];
function mkGun(k,rar=0,pow=1){const W=WPN[k];return{k,name:W.name,rar,pow,mag:W.mode==='mag'?W.mag:0,res:W.res||0}}
function newGuns(){guns=WPN.map((_,k)=>mkGun(k))}newGuns();
function refill(f){for(const G of guns){const W=WPN[G.k];if(W.mode==='mag'&&!W.inf)G.res=Math.min(W.res*1.5,G.res+Math.ceil(W.res*f))}}
function needAmmo(){return guns.some(G=>{const W=WPN[G.k];return W.mode==='mag'&&!W.inf&&G.res<W.res})}

/* ---------- enemy models (front faces +z) ---------- */
{const wt=paint(256,(g,S)=>{g.clearRect(0,0,S,S);g.save();g.beginPath();g.ellipse(S/2,S/2,S*0.48,S*0.42,0,0,7);g.clip();
   const gr=g.createLinearGradient(0,0,S,0);gr.addColorStop(0,'rgba(200,240,255,0.55)');gr.addColorStop(1,'rgba(170,220,255,0.25)');g.fillStyle=gr;g.fillRect(0,0,S,S);
   g.strokeStyle='rgba(30,50,60,0.85)';g.lineWidth=3;for(let i=0;i<6;i++){g.beginPath();g.moveTo(S*0.04,S/2);g.quadraticCurveTo(S*0.45,S*(0.15+i*0.14),S*0.98,S*(0.1+i*0.16));g.stroke()}
   g.lineWidth=1.5;for(let i=0;i<14;i++){const x=S*(0.2+hash(i,3)*0.7),y=S*(0.15+hash(i,4)*0.7);g.beginPath();g.moveTo(x,y);g.lineTo(x+S*0.08,y+S*(hash(i,5)-0.5)*0.12);g.stroke()}
   g.restore();g.strokeStyle='rgba(30,50,60,0.9)';g.lineWidth=4;g.beginPath();g.ellipse(S/2,S/2,S*0.48,S*0.42,0,0,7);g.stroke()});
 MAT.wing.map=wt;MAT.wing.color.set(0xffffff);MAT.wing.opacity=1;MAT.wing.alphaTest=0.04;MAT.wing.needsUpdate=true}
function wingPair(g,span,y,z=0,k=1){const out=[];for(const s of[-1,1]){const p=new T.Group();p.position.set(s*0.22*span,y,z);p.userData.s=s;
    const w=mesh(GEO.plane,MAT.wing,0.75*span*k,0.34*span*k,1,s*0.4*span*k,0,0);w.rotation.x=-Math.PI/2;p.add(w);g.add(p);out.push(p)}return out}
// drones: strike drone (0), sentry drone (1) and gunship (2), all quad- or twin-rotor machines
MAT.blur=bas({color:0xaee6ff,transparent:true,opacity:.16,depthWrite:false,side:T.DoubleSide});
function droneRig(g,v){const b=new T.Group();b.scale.setScalar(v===2?2:1);g.add(b);const CM=charMats(),n='dr'+v,A1=CM.plate[0],A2=CM.joint,AM=MAT.amber,EY=v===2?MAT.eyeA:MAT.eye;
  const rotors=[];let ring=null,muz=null,cannon=null;GEO.frus=GEO.frus||new T.CylinderGeometry(.8,1,1,20);
  const rotor=(x,y,z,r)=>{const j=J(b,x,y,z);put(j,'rot'+r,a=>{a(GEO.box,A2,r*2,.012,.035);a(GEO.box,A2,.035,.012,r*2);a(GEO.cyl,A2,.03,.04,.03)});j.add(mesh(GEO.cyl,MAT.blur,r,.005,r));rotors.push(j)};
  if(v!==1){
    put(b,n+'H',a=>{const R=rb(a);R(A1,.26,.16,.5,0,0,0,0,0,0,.04);R(A1,.2,.05,.34,0,.1,-.02);R(A2,.3,.04,.2,0,.06,-.12);for(let i=0;i<3;i++)R(A2,.16,.012,.03,0,.128,-.1+i*.06,0,0,0,.004);
      a(GEO.cyl,A2,.1,.07,.1,0,0,.25,1.571,0,0);a(GEO.cyl,A1,.115,.03,.115,0,0,.225,1.571,0,0);R(A2,.16,.07,.22,0,-.1,-.04);for(const s of[-1,1]){a(GEO.cone,AM,.02,.14,.02,s*.06,-.16,.14,2.6,0,0);a(GEO.box,AM,.012,.02,.26,s*.131,.0,.02)}
      a(GEO.cyl,A2,.008,.22,.008,-.08,.19,-.15);a(GEO.sph,AM,.018,.018,.018,-.08,.3,-.15);
      for(const sx of[-1,1])for(const sz of[-1,1]){const x=sx*.36,z=sz*.3,L=Math.hypot(x,z);R(A2,.05,.04,L-.1,x/2,.02,z/2,0,Math.atan2(x,z),0,.01);a(GEO.tor,A1,.15,.15,.15,x,.06,z,1.571,0,0);a(GEO.cyl,A2,.05,.08,.05,x,.03,z);a(GEO.sph,AM,.016,.016,.016,x+sx*.16,.06,z)}
      if(v===2){R(A1,.42,.06,.3,0,.15,-.05);R(A2,.3,.03,.2,0,.19,-.05);for(const s of[-1,1]){R(A2,.07,.07,.16,s*.14,-.1,.1);a(GEO.cyl,A2,.035,.4,.035,s*.14,-.1,.24,1.571,0,0);for(const z of[.24,.32])a(GEO.cyl,A1,.045,.03,.045,s*.14,-.1,z,1.571,0,0);a(GEO.box,AM,.04,.04,.04,s*.14,-.1,.43)}}},true);
    put(b,n+'E',a=>a(GEO.sph,EY,.075,.075,.05,0,0,.29));
    for(const sx of[-1,1])for(const sz of[-1,1])rotor(sx*.36,.09,sz*.3,.14)}
  else{
    put(b,n+'H',a=>{const R=rb(a);a(GEO.frus,A1,.32,.12,.32,0,.01,0);a(GEO.cyl,A2,.34,.04,.34,0,-.06,0);a(GEO.sphL,A2,.2,.12,.2,0,.07,0);a(GEO.box,AM,.05,.02,.2,0,.12,.1);a(GEO.cyl,A2,.12,.05,.12,0,-.1,0);
      for(let i=0;i<8;i++){const an=i*Math.PI/4;R(A2,.025,.02,.12,Math.sin(an)*.25,.07,Math.cos(an)*.25,0,an,0,.006)}
      for(const s of[-1,1]){R(A2,.2,.05,.08,s*.32,0,0);a(GEO.tor,A1,.16,.16,.16,s*.48,0,0,1.571,0,0);a(GEO.cyl,A2,.04,.06,.04,s*.48,0,0);a(GEO.sph,AM,.016,.016,.016,s*.66,0,0)}},true);
    ring=J(b,0,.02,0);put(ring,'sdRing',a=>{a(GEO.tor,A2,.36,.36,.36,0,0,0,1.571,0,0);for(let i=0;i<4;i++){const r=i*1.571;a(GEO.box,MAT.strip,.04,.03,.04,Math.cos(r)*.36,0,Math.sin(r)*.36)}});
    cannon=J(b,0,-.13,.08);put(cannon,'sdGun',a=>{const R=rb(a);R(A2,.12,.1,.18);R(A1,.13,.04,.14,0,.06,0);a(GEO.cyl,A2,.035,.36,.035,0,0,.24,1.571,0,0);a(GEO.cyl,A1,.05,.06,.05,0,0,.42,1.571,0,0)});
    muz=mesh(GEO.sph,MAT.eye,.05,.05,.05,0,0,.46);cannon.add(muz);
    for(const s of[-1,1])rotor(s*.48,.01,0,.13)}
  return{wings:[],anim(e,t,dt){for(const r of rotors)r.rotation.y+=dt*45;b.rotation.z=Math.sin(t*1.7+e.ph)*.08;b.rotation.x=.1+Math.sin(t*2.3+e.ph)*.05;
    if(ring)ring.rotation.y+=dt*2.2;if(muz){const ch=e.cd<0.6?1:0;muz.scale.setScalar(.05*(.6+ch*(1+Math.sin(t*30)*.3)));cannon.position.z=.08-Math.max(0,e.cd-(Math.max(1,1.9-wave*0.05)-0.15))*.5}}}}
// walkers: trooper (0), brute (1), stalker (2), marksman (3), each with hips, knees, shoulders, elbows and a turning head
MAT.bruteA=std({color:0x6e3a30,roughness:.5,metalness:.55});MAT.stalkA=std({color:0x2b3539,roughness:.45,metalness:.6});MAT.snipA=std({color:0x56603e,roughness:.6,metalness:.4});
MAT.cloak=std({color:0x2c3324,roughness:.95,side:T.DoubleSide});
MAT.playerA=std({color:0xc8ccce,roughness:.4,metalness:.5});MAT.rowanA=std({color:0x4f8a58,roughness:.55,metalness:.2});MAT.shieldA=std({color:0x3a5a80,roughness:.4,metalness:.6});MAT.detA=std({color:0xb8641e,roughness:.5,metalness:.4});MAT.rocketA=std({color:0x4a5458,roughness:.5,metalness:.55});
// two-bone arm solver: finds shoulder (x, z) and elbow (x) angles that put the hand on a target point, in the torso's space
const IKC={},GX=.17,GY=.30,UL=.384,FL=.40;
// where each gun sits (z = how far in front of the chest) and where the hands grip it: r = right hand, l = left hand (null = left arm keeps its other job)
const GH={d:{gz:.56,r:[0,-.14,.06],l:[0,-.07,-.06]},1:{gz:.43,r:[0,-.15,.04],l:null},3:{gz:.65,r:[0,-.07,-.05],l:[0,-.07,-.12]},4:{gz:.56,r:[0,-.14,.06],l:null},6:{gz:.45,r:[0,-.08,-.1],l:[0,-.1,.1]},8:{gz:.43,r:[0,-.14,.06],l:[0,-.08,.08]}};
function ikArm(S,T){const fk=a=>{const[ax,az,ex]=a,cz=Math.cos(az),sz=Math.sin(az),cx=Math.cos(ax),sx=Math.sin(ax),py=-UL-FL*Math.cos(ex),pz=-FL*Math.sin(ex),x1=-py*sz,y1=py*cz;return[S[0]+x1,S[1]+y1*cx-pz*sx,S[2]+y1*sx+pz*cx]};
  const clampA=a=>{a[2]=Math.min(-.05,Math.max(-2.6,a[2]));a[1]=Math.min(1.1,Math.max(-1.1,a[1]));return a},err=a=>{const q=fk(a);return(q[0]-T[0])**2+(q[1]-T[1])**2+(q[2]-T[2])**2};
  let best=null,be=1e9;for(const st0 of[[-1.2,-.4,-.6],[-.8,.2,-1],[-1.4,.4,-1.2],[-.5,-.3,-.4],[-1.6,0,-.2],[-1,.6,-1.6]]){let a=clampA(st0.slice()),e=err(a),st=.5;for(let it=0;it<220;it++){let imp=false;for(let i=0;i<3;i++)for(const d of[st,-st]){const b=a.slice();b[i]+=d;clampA(b);const eb=err(b);if(eb<e){a=b;e=eb;imp=true}}if(!imp)st*=.6;if(st<1e-4)break}if(e<be){be=e;best=a}}
  return{a:best,e:Math.sqrt(be)}}
// character kit: chamfered plates built at real size (so bevels and panel lines keep the same size on every part) and their own materials, separate from the map's
const CBX={};function cbox(w,h,d,b){b=Math.min(b||.025,w*.3,h*.3,d*.3);const k=[w,h,d,b].map(x=>x.toFixed(3)).join();if(CBX[k])return CBX[k];
  const x=w/2-b,y=h/2-b,sh=new T.Shape();sh.moveTo(-x,-y);sh.lineTo(x,-y);sh.lineTo(x,y);sh.lineTo(-x,y);
  const g=new T.ExtrudeGeometry(sh,{depth:Math.max(.002,d-2*b),bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelOffset:0,bevelSegments:1,steps:1});g.translate(0,0,-Math.max(.002,d-2*b)/2);return CBX[k]=g}
const rb=a=>(m,w,h,d,x=0,y=0,z=0,rx=0,ry=0,rz=0,b)=>a(cbox(w,h,d,b),m,1,1,1,x,y,z,rx,ry,rz);
let CHM=null;
function charMats(){if(CHM)return CHM;
  const pt=paint(256,(g,S)=>{g.fillStyle='#e6e8ea';g.fillRect(0,0,S,S);grime(g,S,1600,.03);
    for(let k=0;k<6;k++){g.fillStyle='rgba(0,0,0,'+(.02+hash(k,13)*.04)+')';g.fillRect(hash(k,11)*S*.8,hash(k,12)*S*.8,S*(.1+hash(k,14)*.22),S*(.08+hash(k,15)*.16))}
    const seam=(x0,y0,x1,y1)=>{g.strokeStyle='rgba(18,22,26,.55)';g.lineWidth=2.2;g.beginPath();g.moveTo(x0*S,y0*S);g.lineTo(x1*S,y1*S);g.stroke();
      g.strokeStyle='rgba(255,255,255,.22)';g.lineWidth=1;g.beginPath();g.moveTo(x0*S+1.5,y0*S+1.5);g.lineTo(x1*S+1.5,y1*S+1.5);g.stroke()};
    seam(0,.02,1,.02);seam(0,.52,1,.52);seam(.3,.02,.3,.52);seam(.78,.02,.78,.52);seam(.12,.52,.12,1);seam(.6,.52,.6,1);
    g.fillStyle='rgba(18,22,26,.45)';for(const y of[.06,.56])for(let k=0;k<12;k++){g.beginPath();g.arc((k+.5)*S/12,y*S,1.4,0,7);g.fill()}
    g.fillStyle='rgba(18,22,26,.35)';for(let k=0;k<5;k++)g.fillRect(S*.66,S*(.64+k*.045),S*.24,S*.018);
    g.strokeStyle='rgba(18,22,26,.4)';g.lineWidth=1.2;g.strokeRect(S*.36,S*.16,S*.32,S*.2);g.fillStyle='rgba(18,22,26,.3)';g.fillRect(S*.2,S*.72,S*.08,S*.05);g.fillRect(S*.3,S*.72,S*.03,S*.05)});
  pt.repeat.set(1.4,1.4);const pn=normalMap(pt,3.5);pn.wrapS=pn.wrapT=T.RepeatWrapping;pn.repeat.copy(pt.repeat);
  const jt=paint(128,(g,S)=>{g.fillStyle='#4a5056';g.fillRect(0,0,S,S);grime(g,S,1400,.05);for(let k=0;k<40;k++){g.fillStyle='rgba(255,255,255,'+(.02+hash(k,21)*.03)+')';g.fillRect(0,hash(k,22)*S,S,1)}g.fillStyle='rgba(0,0,0,.18)';g.fillRect(0,S*.5,S,1.5)});
  jt.repeat.set(3,3);const jn=normalMap(jt,1.5);jn.wrapS=jn.wrapT=T.RepeatWrapping;jn.repeat.copy(jt.repeat);
  const C=[[0x3a6a76,.42,.55],[0x84483a,.45,.55],[0x34424a,.4,.6],[0x66704a,.55,.4],[0x46699a,.4,.6],[0xc4702a,.45,.4],[0x5a666c,.45,.55],[0xd2d6d8,.38,.5],[0x5a9a64,.5,.25]];
  CHM={plate:C.map(([c,r,m])=>{const o=std({color:c,map:pt,normalMap:pn,roughness:r,metalness:m});o.envMapIntensity=.32;return o}),
    joint:std({map:jt,normalMap:jn,color:0xffffff,roughness:.45,metalness:.75})};CHM.joint.envMapIntensity=.32;return CHM}
function walkerRig(g,v){const root=new T.Group();root.scale.setScalar([1,1.45,.78,1,1.1,.85,1,1.05,.98][v]);g.add(root);
  const CM=charMats(),A1=CM.plate[v],A2=CM.joint,AM=MAT.amber,EY=v>=7?MAT.strip:v>=2?MAT.eye:MAT.eyeA,n='w'+v;
  const pel=J(root,0,-.1,0);put(pel,n+'P',a=>{const R=rb(a);R(A2,.36,.18,.26);R(A1,.24,.15,.08,0,-.04,.15,.18,0,0);R(A1,.3,.12,.07,0,0,-.15,-.15,0,0);a(GEO.box,AM,.26,.02,.02,0,.075,.135);
    for(const s of[-1,1]){R(A1,.07,.24,.27,s*.235,-.08,0,0,0,s*.14);a(GEO.cyl,A2,.06,.05,.06,s*.2,0,0,0,0,1.571)}
    if(v===8){R(A2,.1,.13,.07,.21,-.12,.12,0,0,.1);R(A1,.11,.04,.08,.21,-.04,.12,0,0,.1)}});
  const tor=J(root,0,-.02,0);put(tor,n+'T',a=>{const R=rb(a),bp=v===1?1.3:1;
    a(GEO.cyl,A2,.17,.18,.15,0,.08,0);for(let i=0;i<3;i++)a(GEO.cyl,A2,.2,.025,.17,0,.02+i*.06,0);
    R(A1,.58,.34,.36,0,.4,0,0,0,0,.05);for(const s of[-1,1])R(A1,.25,.24,.07,s*.135,.43,.2,-.12,s*.14,0);R(A2,.06,.22,.06,0,.43,.2,-.12,0,0);
    R(A1,.38,.1,.06,0,.23,.18,.25,0,0);for(const s of[-1,1])a(GEO.box,AM,.07,.02,.015,s*.15,.52,.232,-.12,s*.14,0);
    R(A2,.32,.08,.28,0,.6,0);a(GEO.cyl,A2,.075,.12,.075,0,.64,.02);
    for(const s of[-1,1]){R(A1,.24*bp,.07*bp,.31*bp,s*.42,.64,0,0,0,-s*.18);R(A1,.07*bp,.17*bp,.27*bp,s*(.5+.04*bp),.56,0,0,0,-s*.08);a(GEO.box,AM,.012,.02,.16,s*(.54+.04*bp),.6,0);a(GEO.sphL,A2,.1,.1,.1,s*.38,.52,0)}
    R(A1,.46,.4,.18,0,.38,-.27);for(let i=0;i<4;i++)R(A2,.38,.02,.05,0,.24+i*.06,-.37,0,0,0,.008);
    for(const s of[-1,1]){a(GEO.cyl,A2,.055,.32,.055,s*.17,.4,-.39);a(GEO.cyl,AM,.06,.025,.06,s*.17,.57,-.39)}
    a(GEO.cyl,A2,.012,v===3?.8:.45,.012,.15,v===3?.9:.75,-.34);a(GEO.sph,AM,.025,.025,.025,.15,v===3?1.3:.98,-.34);
    if(v===1)for(const s of[-1,1]){a(GEO.cyl,A2,.06,.4,.06,s*.14,.75,-.4);a(GEO.cyl,AM,.065,.05,.065,s*.14,.95,-.4);R(A1,.1,.06,.1,s*.14,.62,-.4)}
    if(v===2)for(let i=0;i<4;i++)a(GEO.cone,A2,.05,.2,.05,0,.6-i*.15,-.44,-.6,0,0);
    if(v===3)a(GEO.box,MAT.cloak,.58,.75,.04,0,.2,-.45,.12,0,0);
    if(v===5){for(let i=0;i<5;i++)R(i%2?A2:AM,.5,.045,.02,0,.13+i*.065,.25,0,0,0,.006);for(const s of[-1,1])a(GEO.box,A2,.04,.42,.03,s*.2,.3,.25)}
    if(v===6){R(A2,.2,.46,.2,.2,.62,-.3);a(GEO.cyl,A1,.13,.9,.13,.2,.95,-.2,1.2,0,0);a(GEO.cyl,A2,.14,.05,.14,.2,.73,-.62,1.2,0,0);a(GEO.cyl,AM,.14,.04,.14,.2,1.13,.13,1.2,0,0)}
    if(v===8){for(const y of[.24,.5])a(GEO.cyl,A2,.085,.025,.085,-.14,y,-.44);a(GEO.sph,MAT.leaf,.07,.11,.07,-.14,.37,-.44);for(const k of[0,2.1,4.2])a(GEO.cyl,A2,.008,.26,.008,-.14+Math.cos(k)*.08,.37,-.44+Math.sin(k)*.08)}},true);
  const head=J(tor,0,.62,.02);put(head,n+'H',a=>{const R=rb(a);
    if(v===2){R(A2,.22,.18,.4,0,.15,.04,0,0,0,.04);R(A1,.26,.08,.42,0,.25,.02);R(A1,.05,.06,.36,0,.31,0);for(const x of[-.07,0,.07])a(GEO.sph,EY,.04,.04,.03,x,.16,.24);
      for(const s of[-1,1])a(GEO.cone,A2,.03,.16,.03,s*.07,.04,.24,2.6,0,0)}
    else if(v===3){R(A2,.28,.26,.3,0,.15,0,0,0,0,.05);a(GEO.cyl,A2,.09,.08,.09,0,.18,.17,1.571,0,0);a(GEO.cyl,A1,.11,.03,.11,0,.18,.13,1.571,0,0);a(GEO.sph,EY,.07,.07,.03,0,.18,.215);
      a(GEO.cyl,A2,.035,.14,.035,.15,.25,.08,1.571,0,0);a(GEO.cone,MAT.cloak,.3,.5,.3,0,.32,-.06)}
    else{const pl=v>=7;R(A2,.3,.26,.32,0,.15,-.02,0,0,0,.05);R(A1,.36,.12,.38,0,.28,0,0,0,0,.04);for(const s of[-1,1])R(A1,.06,.2,.3,s*.17,.16,-.02);
      R(A2,pl?.3:.28,pl?.13:.1,.05,0,.17,.16);a(GEO.box,EY,pl?.26:.24,pl?.07:.04,.02,0,.17,.185);
      if(v===1)R(A1,.4,.18,.14,0,.07,.18,.15,0,0);else R(A1,.24,.1,.1,0,.05,.15,.25,0,0);
      if(v===8)a(GEO.cyl,AM,.03,.04,.03,.2,.22,.1,1.571,0,0);else if(!pl)R(A1,.05,.07,.28,0,.36,-.02)}
    for(const s of[-1,1])a(GEO.cyl,A2,.05,.05,.05,s*.205,.15,0,0,0,1.571)});
  {const q=glow(v>=7?0x6fe3ff:v>=2?0xff3b3b:0xffb238,.8,.7);q.position.set(0,.18,.24);head.add(q)}
  const arms=[];for(const s of[-1,1]){const sh=J(tor,s*.4,.5,0);put(sh,n+'UA',a=>{const R=rb(a);a(GEO.cyl,A2,.065,.3,.065,0,-.2,0);R(A1,.17,.22,.19,0,-.13,0,0,0,0,.035);R(A2,.15,.05,.17,0,-.27,0);a(GEO.sphL,A2,.085,.085,.085,0,-.02,0)});
    const el=J(sh,0,-.384,0);put(el,n+'FA'+(s>0?'r':'l'),a=>{const R=rb(a);a(GEO.sphL,A2,.075,.075,.075);R(A1,.155,.24,.17,0,-.17,.01,0,0,0,.035);R(A1,.12,.08,.06,0,0,-.08);a(GEO.box,AM,.012,.07,.035,s*.079,-.17,.03);
      R(A2,.12,.06,.14,0,-.32,0);R(A2,.11,.1,.12,0,-.40,.02,0,0,0,.025);R(A2,.1,.05,.06,0,-.45,.06,.5,0,0,.015);
      if((v===1||v===4)&&s<0){R(A1,.08,.66,.52,-.12,-.2,.06);a(GEO.box,AM,.02,.5,.02,-.165,-.2,.31)}if(v===2){R(A2,.06,.14,.1,0,-.36,.05);a(GEO.cone,AM,.035,.55,.035,0,-.7,.05,Math.PI,0,0)}});arms.push([sh,el])}
  let gun=null;if(v!==2&&v!==5){gun=J(tor,GX,GY,(GH[v]||GH.d).gz);put(gun,n+'G',a=>{const R=rb(a);
    if(v===1){R(A2,.18,.2,.56,0,0,.05);for(const x of[-.045,.045])a(GEO.cyl,A2,.04,.42,.04,x,.03,.48,1.571,0,0);R(A1,.2,.1,.36,0,.12,.1);a(GEO.cyl,A1,.12,.12,.12,0,-.14,.04,0,0,1.571);a(GEO.box,AM,.02,.03,.24,.101,.12,.1);
      for(let i=0;i<3;i++)R(A2,.21,.02,.04,0,.05,.32+i*.06,0,0,0,.006)}
    else if(v===6){R(A2,.12,.16,.5,0,0,0);a(GEO.cyl,A1,.11,.7,.11,0,.12,.25,1.571,0,0);a(GEO.cyl,A2,.125,.04,.125,0,.12,-.05,1.571,0,0);a(GEO.cyl,AM,.12,.05,.12,0,.12,.6,1.571,0,0);a(GEO.box,EY,.03,.03,.03,0,.25,.1);R(A2,.06,.15,.08,0,-.13,.06,-.2,0,0)}
    else if(v===3){R(A2,.09,.13,.9,0,0,.05);R(A1,.1,.08,.4,0,.02,.35);a(GEO.cyl,A2,.022,.9,.022,0,.01,.9,1.571,0,0);R(A2,.06,.05,.1,0,.01,1.33);a(GEO.cyl,A2,.045,.36,.045,0,.13,.02,1.571,0,0);a(GEO.sph,EY,.03,.03,.02,0,.13,.21);R(A1,.1,.06,.3,0,-.05,-.3);R(A2,.06,.15,.08,0,-.13,-.02,-.2,0,0)}
    else if(v===8){R(A2,.1,.14,.5,0,0,.02);R(A1,.12,.1,.36,0,.07,0);a(GEO.cyl,MAT.strip,.05,.3,.05,0,.01,.44,1.571,0,0);a(GEO.sph,MAT.strip,.06,.06,.06,0,.01,.62);for(const z of[.34,.44,.54])a(GEO.cyl,A2,.065,.02,.065,0,.01,z,1.571,0,0);a(GEO.box,AM,.05,.05,.05,0,.1,.2);R(A2,.07,.16,.1,0,-.14,.06,-.2,0,0)}
    else{R(A2,.1,.14,.5,0,0,-.06);R(A1,.11,.1,.36,0,.02,.3);a(GEO.cyl,A2,.025,.24,.025,0,.01,.58,1.571,0,0);a(GEO.cyl,A2,.038,.07,.038,0,.01,.7,1.571,0,0);a(GEO.box,AM,.012,.02,.12,.056,.03,.3);
      R(A2,.06,.15,.08,0,-.13,.06,-.2,0,0);R(A2,.06,.14,.1,0,-.12,.22,.15,0,0);R(A1,.08,.1,.22,0,-.02,-.4);a(GEO.cyl,A2,.03,.16,.03,0,.12,-.04,1.571,0,0);a(GEO.box,EY,.02,.03,.02,0,.12,-.13)}})}
  let HR=null,HL=null,GZ=.56;if(gun){const G=GH[v]||GH.d;GZ=G.gz;let c=IKC[v];if(!c){c={HR:ikArm([.4,.5,0],[GX+G.r[0],GY+G.r[1],G.gz+G.r[2]]),HL:G.l?ikArm([-.4,.5,0],[GX+G.l[0],GY+G.l[1],G.gz+G.l[2]]):null};IKC[v]=c}HR=c.HR.a;HL=c.HL?c.HL.a:null}
  const legs=[];for(const s of[-1,1]){const hip=J(root,s*.15,-.16,0);put(hip,n+'Th',a=>{const R=rb(a);a(GEO.sphL,A2,.08,.08,.08);a(GEO.cyl,A2,.06,.3,.06,0,-.17,0);R(A1,.2,.24,.23,0,-.14,.015,0,0,0,.04);R(A2,.17,.05,.2,0,-.29,0)},true);
    const kn=J(hip,0,-.34,0);put(kn,n+'Sh',a=>{const R=rb(a);a(GEO.sphL,A2,.08,.08,.08);R(A1,.15,.13,.08,0,-.01,.11,-.25,0,0,.025);R(A1,.17,.22,.19,0,-.17,.02,0,0,0,.035);a(GEO.cyl,A2,.022,.22,.022,0,-.17,-.1);
      R(A2,.13,.06,.15,0,-.31,0);R(A1,.19,.07,.26,0,-.37,.05,0,0,0,.025);R(A2,.17,.05,.09,0,-.38,.21);R(A2,.15,.06,.07,0,-.375,-.1)});legs.push([hip,kn])}
  const jets=new T.Group();jets.position.set(0,.18,-.42);tor.add(jets);jets.visible=false;const jm=bas({color:0xffa060,transparent:true,opacity:.9,blending:T.AdditiveBlending,depthWrite:false});
  put(tor,n+'J',a=>{for(const s of[-1,1]){a(GEO.cyl,A2,.07,.22,.07,s*.15,.08,-.44);a(GEO.cyl,AM,.075,.04,.075,s*.15,-.03,-.44)}});
  for(const s of[-1,1]){const f=mesh(GEO.cone,jm,.08,.5,.08,s*.15,-.4,0);f.rotation.x=Math.PI;jets.add(f)}{const q=glow(0xff8a3a,1.6,.8);q.position.y=-.45;jets.add(q)}
  let shieldM=null,shield=null,bomb=null;
  if(v===4){shieldM=bas({color:0x6fd8ff,transparent:true,opacity:.16,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending});shield=new T.Mesh(new T.CircleGeometry(.8,6),shieldM);shield.position.set(-.05,.3,.62);tor.add(shield);
    for(let k=0;k<6;k++){const an=(k+.5)*Math.PI/3,b=mesh(GEO.box,CM.joint,.8,.04,.035,Math.cos(an)*.69,Math.sin(an)*.69,0);b.rotation.z=an+Math.PI/2;shield.add(b);shield.add(mesh(GEO.sph,MAT.strip,.035,.035,.035,Math.cos(k*Math.PI/3)*.8,Math.sin(k*Math.PI/3)*.8,0))}}
  if(v===5){bomb=mesh(GEO.sph,MAT.eye,.17,.17,.17,0,.36,.26);tor.add(bomb);const q=glow(0xff3b3b,1.1,.8);bomb.add(q)}
  let aim=null,aimM=null;if(v===3){aim=new T.Group();aim.position.set(0,.86,.3);g.add(aim);aimM=bas({color:0xff3030,transparent:true,opacity:.5,depthWrite:false,blending:T.AdditiveBlending,fog:false});aim.add(mesh(GEO.box,aimM,.025,.025,1,0,0,.5));aim.visible=false}
  const av=new T.Vector3();
  return{aim,segs:{pel,tor,head,arms,legs,gun},
  // death reaction before the ragdoll takes over: knees give, the torso snaps back from the hit and twists, head drops back, arms and gun fall
  death(e,k){if(!e.d0){e.d0={leg:legs.map(([h,n])=>[h.rotation.x,n.rotation.x]),arm:arms.map(([a,b])=>[a.rotation.x,a.rotation.z,b.rotation.x]),tx:tor.rotation.x,gy:gun?gun.position.y:0}}const D=e.d0,s=e.hitS||1,L=(a,b)=>a+(b-a)*k;
    for(let i=0;i<2;i++){legs[i][0].rotation.x=L(D.leg[i][0],-.75-(i?.2:0));legs[i][1].rotation.x=L(D.leg[i][1],1.45+(i?.2:0))}root.position.y=-.32*k;
    tor.rotation.x=L(D.tx,-.55);tor.rotation.z=s*.3*k;head.rotation.x=-.75*k;
    for(let i=0;i<2;i++){arms[i][0].rotation.x=L(D.arm[i][0],-.25);arms[i][0].rotation.z=L(D.arm[i][1],(i?-1:1)*.35);arms[i][1].rotation.x=L(D.arm[i][2],-.3)}
    if(gun){gun.position.y=D.gy-.3*k;gun.rotation.x=.7*k}jets.visible=false},
  anim(e,t,dt){const m=e.mv||0,w=t*(v===2||v===5?13:v===1?6:9)+e.ph,air=!m&&Math.abs(e.vy||0)>0.5;
    const cr=e.crouch&&!m;for(let i=0;i<2;i++){const[hip,kn]=legs[i],q=w+(i?Math.PI:0);hip.rotation.x=cr?-1.1:air?-.6:-Math.sin(q)*.55*m;kn.rotation.x=cr?1.9:air?1:Math.max(0,Math.sin(q+1.2))*.9*m}
    jets.visible=(e.jet||0)>0;if(jets.visible)jets.scale.y=.8+Math.random()*.5;
    const idle=1-Math.min(1,m),yr=e.g?ad(e.g.rotation.y,e.yawP===undefined?e.g.rotation.y:e.yawP)/Math.max(dt,1e-3):0;if(e.g)e.yawP=e.g.rotation.y;e.lean=(e.lean||0)+(Math.max(-1,Math.min(1,yr*.6))-(e.lean||0))*Math.min(1,dt*5);
    tor.position.y=-.02+Math.abs(Math.sin(w))*.03*m-(cr?.3:0)+Math.sin(t*1.8+e.ph)*.008;tor.rotation.y=Math.sin(w)*.08*m+Math.sin(t*.7+e.ph)*.06;tor.rotation.x=(v===2?.35:v===5?.25:0)+.1*m+Math.sin(t*1.8+e.ph)*.015;
    pel.position.x=Math.sin(t*.6+e.ph)*.04*idle;tor.rotation.z=-Math.sin(t*.6+e.ph)*.035*idle-e.lean*.12;for(let i=0;i<2;i++)legs[i][0].rotation.z=(i?-1:1)*.04*idle*Math.sin(t*.6+e.ph);
    if((e.hitT||0)>0){e.hitT-=dt;const h=Math.max(0,e.hitT/.22);tor.rotation.x-=.32*h;tor.rotation.z+=(e.hitS||1)*.14*h}
    if(shield){const up=!((e.burst||0)>0);shield.visible=up;shieldM.opacity=.13+.05*Math.sin(t*6)}if(bomb){const hd=Math.hypot(eye.x-e.pos.x,eye.z-e.pos.z);bomb.visible=Math.sin(t*(hd<12?30:10))>-.2}
    e.kick=Math.max(0,(e.kick||0)-dt*(v===2||v===5?4:6));const k=e.kick;head.rotation.y=Math.sin(t*1.3+e.ph)*.35;head.rotation.x=Math.sin(t*.9+e.ph)*.08-(v===2?.3:0)-((e.hitT||0)>0?.35*e.hitT/.22:0);
    if(v===2||v===5){arms[1][0].rotation.set(-1.0-k*1.4,0,-.25);arms[1][1].rotation.x=-.4+k*.3;arms[0][0].rotation.set(-1.0-Math.max(0,k-.5)*1.6,0,.25);arms[0][1].rotation.x=-.4}
    else{arms[1][0].rotation.set(HR[0]-k*.1,0,HR[1]);arms[1][1].rotation.x=HR[2]+k*.1;
      if(HL){arms[0][0].rotation.set(HL[0]-k*.1,0,HL[1]);arms[0][1].rotation.x=HL[2]+k*.1}else{arms[0][0].rotation.set(-1.15-k*.2,0,.7);arms[0][1].rotation.x=-.55}
      gun.position.z=GZ-k*.05;gun.rotation.x=-k*.1;gun.position.y=GY+Math.sin(w*2)*.015*m}
    if(aim){const on=(e.ch||0)>0||(e.ft||0)>0;aim.visible=on;if(on){aim.lookAt(eye);aim.getWorldPosition(av);aim.scale.z=av.distanceTo(eye);aimM.opacity=e.ft>0?1:.25+.25*Math.sin(t*25)}}}}}
// crawler: a four-legged mortar platform
function crawlerRig(g){const CM=charMats(),A1=CM.plate[0],A2=CM.joint,AM=MAT.amber;
  const body=J(g,0,0,0);put(body,'crB',a=>{const R=rb(a);R(A1,1.2,.3,1.4,0,0,-.05,0,0,0,.07);R(A1,1.0,.16,.36,0,.06,.66,-.45,0,0,.05);R(A2,.95,.1,1.15,0,-.2,0);
    R(A2,.42,.14,.1,0,.0,.84);for(const x of[-.12,0,.12])a(GEO.sph,MAT.eye,.05,.05,.04,x,.02,.89);a(GEO.box,AM,.8,.03,.04,0,.165,.45);
    for(let i=0;i<3;i++)R(A2,.5,.035,.06,0,.165,-.25-i*.15,0,0,0,.01);for(const s of[-1,1]){R(A1,.08,.22,1.1,s*.64,-.05,0,0,0,s*.15);a(GEO.cyl,A2,.05,.25,.05,s*.38,.25,-.6);a(GEO.cyl,AM,.055,.03,.055,s*.38,.38,-.6);R(A2,.2,.08,.12,s*.4,.17,.3)}},true);
  {const q=glow(0xff3b3b,1.2,.7);q.position.set(0,.02,.9);body.add(q)}
  const tur=J(body,0,.22,-.1);put(tur,'crTu',a=>{const R=rb(a);a(GEO.cyl,A2,.35,.18,.35);R(A1,.34,.2,.32,0,.18,0);for(const s of[-1,1])R(A1,.06,.18,.3,s*.2,.18,0,0,0,s*.12);a(GEO.cyl,A2,.08,.03,.08,0,.29,-.06)});
  const tube=J(tur,0,.2,0);tube.rotation.x=-.9;put(tube,'crTb',a=>{const R=rb(a);a(GEO.cyl,A2,.13,.9,.13,0,0,.4,1.571,0,0);for(const z of[.12,.3,.6])a(GEO.cyl,A1,.15,.05,.15,0,0,z,1.571,0,0);a(GEO.cyl,AM,.15,.08,.15,0,0,.84,1.571,0,0);R(A2,.36,.08,.1,0,0,.93)});
  const legs=[];for(const sx of[-1,1])for(const sz of[-1,1]){const hip=J(body,sx*.55,-.05,sz*.55);hip.scale.x=sx;hip.userData.d=sx*sz;
    put(hip,'crU',a=>{const R=rb(a),an=Math.atan2(.35,.45);a(GEO.sphL,A2,.1,.1,.1);R(A1,.57,.12,.14,.225,.175,0,0,0,an,.03);a(GEO.cyl,A2,.025,.4,.025,.2,.1,.09,0,0,an-1.571)});const kn=J(hip,.45,.35,0);
    put(kn,'crL',a=>{const R=rb(a),an=Math.atan2(-1.3,.15);a(GEO.sphL,A2,.09,.09,.09);R(A1,1.31,.12,.14,.075,-.65,0,0,0,an,.03);R(A1,.5,.16,.17,.03,-.3,0,0,0,an,.035);a(GEO.cyl,A2,.12,.06,.12,.15,-1.3,0);a(GEO.box,AM,.02,.2,.02,.07,-.4,.085,0,0,an+1.571)});legs.push([hip,kn])}
  return{anim(e,t,dt){const m=e.mv||0,w=t*7+e.ph;for(const[hip,kn]of legs){const q=w+(hip.userData.d>0?0:Math.PI);hip.rotation.y=Math.sin(q)*.35*m;kn.rotation.z=Math.max(0,Math.sin(q+1))*.3*m}
    body.position.y=Math.abs(Math.sin(w))*.04*m;e.kick=Math.max(0,(e.kick||0)-dt*3);tube.position.z=-e.kick*.25;tur.rotation.y=Math.sin(t*.6+e.ph)*.25}}}
function model(type){const g=new T.Group();let wings=[],rig=null;
  if(type<=2)rig=droneRig(g,type);
  else if(type>=5&&type<=8||type>=10)rig=walkerRig(g,type-5);else if(type===9)rig=crawlerRig(g);
  const parts=[];g.traverse(o=>{if(o.isMesh&&o.material!==MAT.wing)parts.push([o,o.material])});
  if(type>=5)return{g,wings,parts,rig};
  const gl=type===0?glow(0xff3b3b,1.1,0.9):type===1?glow(0xff5a3a,1.2,0.8):glow(0xffb238,2.4,0.8);
  gl.position.set(0,type===5?0.86:type===1?-0.13:0,type===5?0.3:type===2?0.62:type===1?0.5:0.32);g.add(gl);
  return{g,wings,parts,rig}}
const ER=[0.5,0.55,1.0,3,0.7,0.9,1.3,0.7,0.9,1.0,1.0,0.75,0.9];
const GP={5:{cover:1,jet:1,hp:3,spd:3.6,near:8,far:18,strafe:.6,atk:'rifle',score:100,col:'#ff8a5a',spark:0xffb238},
  6:{jet:1,hp:9,spd:2.4,near:3,far:14,strafe:.3,atk:'shotgun',score:250,col:'#ff5a3a',spark:0xff6a3a,intro:"Big one. That's a heavy loader frame with a scattergun bolted on. Keep your distance and aim high."},
  7:{jet:1,hp:2,spd:6.2,near:0,far:70,strafe:0,atk:'melee',score:120,col:'#ffd23a',spark:0xffd23a,intro:"Stalkers. Pruning frames with the safeties off. They're fast and they jump. Don't let them close."},
  8:{cover:1,jet:1,hp:3,spd:3,near:22,far:42,strafe:.4,atk:'snipe',dmg:22,score:180,col:'#ff3a6a',spark:0xff3a3a,intro:"Red line on you means a marksman is charging. Break line of sight before it fires."},
  10:{jet:1,hp:5,spd:2.8,near:6,far:20,strafe:.3,atk:'rifle',score:200,col:'#6fb8ff',spark:0x6fd8ff,intro:"Shieldbearers. That energy wall stops almost every shot. Flank them, use grenades or melee, or hit them when they lower it to fire."},
  11:{jet:1,hp:1.5,spd:7.2,near:0,far:80,strafe:0,atk:'bomb',score:120,col:'#ff9a2a',spark:0xff8a3a,intro:"Hear that beeping? Detonator frames. They run at you and blow. Shoot them early, ideally next to their friends."},
  12:{cover:1,jet:1,hp:3.5,spd:2.8,near:16,far:36,strafe:.5,atk:'rocket',score:200,col:'#c0c8ff',spark:0xffb238,intro:"Rocketeer. Its rockets are slow but they track you. Sidestep late, or put a wall between you."},
  9:{hp:6,spd:2.4,near:14,far:28,strafe:.5,atk:'mortar',score:220,col:'#c9ff3a',spark:0xffb238,intro:"Crawler. It lobs shells. When a red ring shows up under you, move."}};
const seenT={};
function mk(type,x,y,z){const w=Math.max(wave,1),m=model(type),k=1+0.14*(w-1);m.g.position.set(x,y,z);scene.add(m.g);
  const e={type,pos:m.g.position,g:m.g,wings:m.wings,parts:m.parts,rig:m.rig,white:false,flash:0,dying:0,r:ER[type],sh:0,sel:0,shell:null};
  if(type===0)Object.assign(e,{hp:2*k,spd:5+Math.min(w*0.2,2),cd:0.5,ph:Math.random()*6});
  else if(type===1)Object.assign(e,{hp:4*k,spd:3.2,cd:1+Math.random(),ph:Math.random()<.5?-1:1});
  else if(type>=5){const P=GP[type];Object.assign(e,{hp:P.hp*k,spd:P.spd+Math.min(w*0.1,1.2),cd:1+Math.random()*1.5,ph:Math.random()*6,vy:0,burst:0,bt:0,stuck:0,hops:0,mv:0,kick:0,ch:0,ft:0,lunge:0,atkN:0,side:Math.random()<.5?-1:1,aim:m.rig&&m.rig.aim});
    if(state==='playing'&&P.intro&&!seenT[type]){seenT[type]=1;comm('R',P.intro)}}
  else Object.assign(e,{hp:16*k,spd:4,cd:0.8,ph:Math.random()*6});
  if(state==='playing'&&(type===2||(w>=2&&Math.random()<0.22))){e.sel=Math.random()*3|0;e.sh=(type===2?12:4)*k;
    e.shell=mesh(GEO.sph,bas({color:ELC[e.sel],transparent:true,opacity:0.4,depthWrite:false,blending:T.AdditiveBlending}),e.r*1.4,e.r*1.4,e.r*1.4);m.g.add(e.shell);
    if(!shieldTip){shieldTip=true;setTimeout(()=>{if(state==='playing')say('Shelled enemy: match its colour',2.5)},1200)}}
  e.hp0=e.hp;return e}
function clear(list){for(const o of list)scene.remove(o.g);list.length=0}
function reset(){pos.set(0,0,24);yaw=0;pitch=0;vy=0;hp=100;shMax=CLS[cls].sh;shield=shMax;shDelay=0;heat=0;over=false;score=0;wave=0;waveTimer=0.01;boostT=0;gliding=false;airUsed=false;overT=0;newGuns();
  weapon=2;grenCdK.fill(0);meleeCdK.fill(0);supCd.fill(0);supT.fill(0);wheelOpen=false;meleeA=0;superQ=0;novaA=0;hurtA=0;queue=[];reloadT=0;spinV=0;swordT=0;dashT=0;cineT=0;pb.visible=false;clear(waves);for(const b of bolts)scene.remove(b.g);bolts.length=0;clear(fires);clear(wells);clear(rings);fxq.length=0;for(const c of camFx)cam.remove(c.g);camFx.length=0;
  clearCorpses();clear(enemies);clear(shots);clear(pickups);clear(grenades);for(const k in seenT)delete seenT[k];if(COVER)for(const c of COVER)c.claim=null;COMMS.length=0;commCur=null;$('comms').hidden=true;logI=0;clear(blasts);clear(loots);clear(slams);clear(cores);veh=null;engineOff();for(const v of vehs)homeVeh(v);flyExit();mission=null;bossN=0;gap=1.2;endT=0;if(ROW){ROW.on=false;ROW.arrive=0;ROW.hide=false;rwG.visible=false;for(const q of ROW.beams){q.t=0;q.b.visible=false}}if(INTRO.on){INTRO.on=false;introClear();introShow(false)}voiceStop();beacon.visible=false;$('obj').hidden=true;if(typeof lcoreReset==='function')lcoreReset()}
function demo(){enemies.push(mk(0,-6,7,-2),mk(0,5,12,-6),mk(1,10,16,-8),mk(5,-12,1,-9),mk(6,13,1.3,-10))}
const clampA=v=>Math.max(-A+3,Math.min(A-3,v));
let SPN=null;const hv2=new T.Vector3();
function spawnPts(){if(SPN)return SPN;SPN=[];if(!NAV)navBuild();const reach=new Uint8Array(NX*NZ),q=[navCell(0,24)];reach[q[0]]=1;
  for(let h=0;h<q.length;h++){const k=q[h],i=k%NX;for(const n of[i>0?k-1:-1,i<NX-1?k+1:-1,k-NX,k+NX])if(n>=0&&n<NX*NZ&&NAV[n]&&!reach[n]){reach[n]=1;q.push(n)}}
  for(const r of ROOMS){let n=0;for(let k=0;k<120&&n<10;k++){const x=r.x0+3+Math.random()*(r.x1-r.x0-6),z=r.z0+3+Math.random()*(r.z1-r.z0-6);
  let bl=false;for(let y=.25;y<=3;y+=.25)if(inBox(x,y,z)){bl=true;break}if(bl||!reach[navCell(x,z)])continue;SPN.push({x,z,r});n++}}return SPN}
function spawnPos(){const S0=spawnPts(),rs=mission&&mission.rooms,S1=rs?S0.filter(q=>rs.includes(q.r.n)):S0,S=S1.length?S1:S0;let fb=null;for(let k=0;k<50;k++){const q=S[Math.random()*S.length|0],d=Math.hypot(q.x-pos.x,q.z-pos.z);if(d<22||d>150)continue;fb=fb||q;hv2.set(q.x,1.5,q.z);if(!los(hv2,eye))return[q.x,q.z,q.r]}
  const q=fb||S[Math.random()*S.length|0];return[q.x,q.z,q.r]}
const NC=2.5,NX=Math.ceil(2*AX/NC),NZ=Math.ceil(2*AZ/NC);let NAV=null,ND=null,NQ=null,navT=0;
function navBuild(){NAV=new Uint8Array(NX*NZ);ND=new Int32Array(NX*NZ);NQ=new Int32Array(NX*NZ);
  for(let i=0;i<NX;i++)for(let j=0;j<NZ;j++){const x=-AX+(i+.5)*NC,z=-AZ+(j+.5)*NC;let ok=1;for(let y=.25;y<=2.5;y+=.25)if(inBox(x,y,z)){ok=0;break}
    if(ok)for(const[ax,c,a0,a1]of NAVW){if(ax==='x'?Math.abs(x-c)<=1.26&&z>=a0&&z<=a1:Math.abs(z-c)<=1.26&&x>=a0&&x<=a1){ok=0;break}}NAV[j*NX+i]=ok}}
function navCell(x,z){const i=Math.floor((x+AX)/NC),j=Math.floor((z+AZ)/NC);return i<0||j<0||i>=NX||j>=NZ?-1:j*NX+i}
function navFlow(){if(!NAV)navBuild();ND.fill(-1);let c=navCell(pos.x,pos.z);if(c<0)return;
  if(!NAV[c]){const i0=c%NX,j0=(c/NX)|0;let f=-1;for(let r=1;r<4&&f<0;r++)for(let a=-r;a<=r&&f<0;a++)for(let b=-r;b<=r;b++){const i=i0+a,j=j0+b;if(i>=0&&j>=0&&i<NX&&j<NZ&&NAV[j*NX+i]){f=j*NX+i;break}}if(f<0)return;c=f}
  let h=0,t=0;NQ[t++]=c;ND[c]=0;
  while(h<t){const k=NQ[h++],i=k%NX,d=ND[k]+1;
    if(i>0&&NAV[k-1]&&ND[k-1]<0){ND[k-1]=d;NQ[t++]=k-1}if(i<NX-1&&NAV[k+1]&&ND[k+1]<0){ND[k+1]=d;NQ[t++]=k+1}
    if(k>=NX&&NAV[k-NX]&&ND[k-NX]<0){ND[k-NX]=d;NQ[t++]=k-NX}if(k<NX*(NZ-1)&&NAV[k+NX]&&ND[k+NX]<0){ND[k+NX]=d;NQ[t++]=k+NX}}}
function flowDir(x,z){if(!ND)return null;const c=navCell(x,z);if(c<0)return null;const i=c%NX,j=(c/NX)|0;let best=ND[c]<0?1e9:ND[c],bx=0,bz=0;
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){if(!a&&!b)continue;const ii=i+a,jj=j+b;if(ii<0||jj<0||ii>=NX||jj>=NZ)continue;const k=jj*NX+ii;if(ND[k]<0)continue;
    if(a&&b&&(!NAV[j*NX+ii]||!NAV[jj*NX+i]))continue;const d=ND[k]+(a&&b?.4:0);if(d<best){best=d;bx=a;bz=b}}
  if(!bx&&!bz)return null;const tx=-AX+(i+bx+.5)*NC-x,tz=-AZ+(j+bz+.5)*NC-z,l=Math.hypot(tx,tz)||1;return[tx/l,tz/l]}
function spawnAt(type,t=0){const[x,z,r]=spawnPos();queue.push({t,type,x,y:type>=5?1.5:Math.min(r.h-3,6+Math.random()*2),z})}
const hv=new T.Vector3(),covV=new T.Vector3();let COVER=null,COVERMAP=null;
function coverSpots(){if(COVER)return COVER;COVER=[];COVERMAP=new Map();
  for(const b of boxes){const w=b.hi[0]-b.lo[0],d=b.hi[2]-b.lo[2],h=b.hi[1]-b.lo[1];if(b.lo[1]>0.1||h<1.2||h>14||Math.max(w,d)>40||Math.min(w,d)<0.4)continue;
    const add=(x,z,nx,nz)=>{if(Math.abs(x)>A-4||Math.abs(z)>A-4||inBox(x,0.5,z))return;const c={x,z,bx:(b.lo[0]+b.hi[0])/2,bz:(b.lo[2]+b.hi[2])/2,claim:null};COVER.push(c);
      const k=(Math.floor(x/GC)+4096)*8192+Math.floor(z/GC)+4096;let a=COVERMAP.get(k);if(!a)COVERMAP.set(k,a=[]);a.push(c)};
    const nx=Math.max(1,Math.round(w/4)),nz=Math.max(1,Math.round(d/4));
    for(let i=0;i<nx;i++){const x=b.lo[0]+(i+.5)*w/nx;add(x,b.lo[2]-1.1,0,-1);add(x,b.hi[2]+1.1,0,1)}
    for(let i=0;i<nz;i++){const z=b.lo[2]+(i+.5)*d/nz;add(b.lo[0]-1.1,z,-1,0);add(b.hi[0]+1.1,z,1,0)}}
  return COVER}
function findCover(e){coverSpots();const p=e.pos,cands=[];const ix=Math.floor(p.x/GC),iz=Math.floor(p.z/GC);
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const l=COVERMAP.get((ix+a+4096)*8192+iz+b+4096);if(!l)continue;
    for(const c of l){if(c.claim&&c.claim!==e&&!c.claim.dying)continue;const dd=Math.hypot(c.x-p.x,c.z-p.z);if(dd>15)continue;const px=pos.x-c.x,pz=pos.z-c.z,pd=Math.hypot(px,pz);
      if(pd<8||pd>45||(c.bx-c.x)*px+(c.bz-c.z)*pz<=0)continue;cands.push([dd,c])}}
  cands.sort((a,b)=>a[0]-b[0]);for(let i=0;i<Math.min(6,cands.length);i++){const c=cands[i][1];covV.set(c.x,pos.y+0.6,c.z);if(!los(covV,eye)){covV.set(c.x,p.y,c.z);if(los(p,covV))return c}}return null}
function release(e){if(e.spot&&e.spot.claim===e)e.spot.claim=null;e.spot=null;e.st='adv';e.side=-e.side}
function bolt(p,dx,dy,dz,d,spread,speed,dmg,col){const g=new T.Group();g.add(mesh(GEO.box,col===1?MAT.eye:MAT.eyeA,0.07,0.07,0.7),glow(col===1?0xff4a3a:0xffb238,0.8,0.8));g.position.set(p.x,p.y+0.3,p.z);
  const v=new T.Vector3(dx/d+(Math.random()-.5)*spread,(dy-0.3)/d+(Math.random()-.5)*spread,dz/d+(Math.random()-.5)*spread).normalize();g.lookAt(p.x+v.x,p.y+0.3+v.y,p.z+v.z);scene.add(g);
  shots.push({g,v:v.multiplyScalar(speed),t:3,dmg})}
const SHAFTS=[];for(const x of[-29,-8,8,29])for(const z of[-9,9])SHAFTS.push([x,z]);
function shaftFor(p){let b=SHAFTS[0],bd=1e9;for(const q of SHAFTS){const d=(q[0]-p.x)**2+(q[1]-p.z)**2;if(d<bd){bd=d;b=q}}return b}
const inCommons=p=>Math.abs(p.x)<107&&Math.abs(p.z)<39,inTower=p=>Math.abs(p.x)<54&&Math.abs(p.z)<39;
function groundTick(e,dt){const P=GP[e.type],p=e.pos,dx=eye.x-p.x,dy=eye.y-p.y,dz=eye.z-p.z,hd=Math.hypot(dx,dz)||1,d=Math.hypot(dx,dy,dz)||1;
  if(hd>170){const[x,z]=spawnPos();p.set(x,1.5,z);e.vy=0;e.ch=0;return}
  e.cd-=dt;e.bt-=dt;e.vy-=19*dt;e.lunge=Math.max(0,e.lunge-dt);e.ft=Math.max(0,e.ft-dt);e.jet=Math.max(0,(e.jet||0)-dt);e.jcd=(e.jcd||0)-dt;e.cdc=(e.cdc||0)-dt;if(e.jet>0)e.vy=Math.min(e.vy+34*dt,7.5);
  const see=d<80&&los(p,eye);let mx,mz,sp=e.spd*((e.slowT=(e.slowT||0)-dt)>0?.35:1);
  let tgt=null;e.crouch=0;
  if(P.cover){if(e.st==='move'||e.st==='cover'||e.st==='peek'){const c=e.spot;e.ctot=(e.ctot||0)+dt;e.ct-=dt;
      if(!c||hd<6||e.ctot>12)release(e);
      else if(e.st==='move'){tgt=c;if(Math.hypot(c.x-p.x,c.z-p.z)<0.8){e.st='cover';e.ct=1.4+Math.random()*1.4}else if(e.ctot>6)release(e)}
      else if(e.st==='cover'){tgt=c;e.crouch=1;if(e.ct<=0){e.st='peek';e.ct=1.3+Math.random();e.peek={x:c.x-dz/hd*e.side*1.8,z:c.z+dx/hd*e.side*1.8}}}
      else{tgt=e.peek;if(e.ct<=0){e.st='cover';e.ct=1.4+Math.random()*1.4;e.side=-e.side}}}
    else if(see&&hd<45&&e.cdc<=0&&e.jet<=0){e.cdc=2.5;const c=findCover(e);if(c){c.claim=e;e.spot=c;e.st='move';e.ctot=0}}}
  const upT=P.jet&&pos.y>3.5&&inTower(pos)&&inCommons(p)&&pos.y-(p.y-e.r)>3;
  if(e.rise&&(pos.y-(p.y-e.r)<-4||(e.riseT-=dt)<=0||!inTower(pos)))e.rise=false;
  if(upT||e.rise){if(e.spot)release(e);tgt=null}
  if(tgt){const tx=tgt.x-p.x,tz=tgt.z-p.z,tl=Math.hypot(tx,tz);if(tl>0.15){mx=tx/tl;mz=tz/tl}else{mx=0;mz=0}if(e.st==='move')sp*=1.35}
  else if(e.rise){const ty=pos.y+e.r+.9;if(p.y<ty){e.jet=.25;mx=0;mz=0}else{e.jet=0;e.vy=Math.max(Math.min(e.vy,1),0);mx=dx/hd;mz=dz/hd;sp=Math.max(sp,5.5);
      if(hd<2.5||Math.abs(p.x)>37.5||Math.abs(p.z)>16.5)e.rise=false}}
  else if(upT){const q=shaftFor(pos),qx=q[0]-p.x,qz=q[1]-p.z,qd=Math.hypot(qx,qz);if(qd<1.3){e.rise=true;e.riseT=9;e.vy=5;e.jet=.25;mx=0;mz=0;sfx('jet')}else{mx=qx/qd;mz=qz/qd;sp*=1.25}}
  else if(e.jt>0){mx=dx/hd;mz=dz/hd;sp*=1.6}
  else if(P.atk==='melee'||P.atk==='bomb'||!see||hd>P.far){const f=(!see||hd>14)&&flowDir(p.x,p.z);if(f){mx=f[0];mz=f[1]}else{mx=dx/hd;mz=dz/hd}}else if(hd<P.near){mx=-dx/hd;mz=-dz/hd}else{mx=-dz/hd*e.side*P.strafe;mz=dx/hd*e.side*P.strafe}
  e.jt=Math.max(0,(e.jt||0)-dt);
  if(e.ch>0)sp*=0.2;if(e.lunge>0)sp*=2.6;if(P.atk==='melee'&&hd<1.2)sp=0;
  const ox=p.x,oz=p.z,st=sp*dt;p.x+=mx*st;p.z+=mz*st;p.y+=e.vy*dt;
  for(const o of enemies){if(o===e||o.type<5||o.dying)continue;const qx=p.x-o.pos.x,qz=p.z-o.pos.z,qd=Math.hypot(qx,qz),m=e.r+o.r;if(qd<m&&qd>1e-3){const k=(m-qd)*0.5/qd;p.x+=qx*k;p.z+=qz*k}}
  const py=p.y;pushOut(p,e.r);const gr=p.y>py+1e-5;if(gr&&e.vy<0)e.vy=0;
  const moved=Math.hypot(p.x-ox,p.z-oz);e.mv=gr&&(mx||mz)?Math.min(1,sp/3):0;
  const want=Math.hypot(mx||0,mz||0)*st;if(gr&&want>0.01&&e.st!=='cover'){if(moved<want*0.4){e.stuck+=dt;if(e.stuck>0.5){e.stuck=0;e.hops=Math.min(e.hops+1,4);if(P.jet){e.vy=4;e.jet=.45+e.hops*.25;sfx('jet')}else e.vy=7+e.hops*2.4;e.side=-e.side;if(e.spot)release(e)}}else{e.stuck=0;if(moved>want*0.9)e.hops=0}}
  if(P.jet&&gr&&!upT&&!e.rise&&e.jcd<=0&&dy>3.5&&hd<26&&hd>2.5){e.jcd=7;e.jet=.8+Math.min(1.3,dy*.09);e.jt=e.jet+.4;e.vy=4;if(e.spot)release(e);sfx('jet')}
  if(P.atk==='rifle'){if(see&&d<60){if(e.cd<=0){e.burst=3;e.cd=2+Math.random()*1.2}
    if(e.burst>0&&e.bt<=0){e.bt=0.15;e.burst--;bolt(p,dx,dy,dz,d,.06,30,5);sfx('bolt');e.kick=1;e.atkN++}}}
  else if(P.atk==='shotgun'){if(d<e.r+1.4&&e.bt<=0){e.bt=1.6;e.kick=1.5;hurt(18);if(!reduced)shake=Math.max(shake,.25);sfx('boom');e.atkN++}
    else if(see&&d<16&&e.cd<=0){e.cd=2.6;for(let i=0;i<6;i++)bolt(p,dx,dy,dz,d,.16,26,3.5,1);sfx('shotgun');e.kick=1;e.atkN++}}
  else if(P.atk==='bomb'){if(hd<15&&e.bt<=0){e.bt=hd<6?.18:.5;sfx('beep')}if(d<e.r+1.7){damage(e,1e9);return}}
  else if(P.atk==='rocket'){if(see&&d<70&&e.cd<=0){e.cd=4.5+Math.random();e.kick=1;e.atkN++;const g=new T.Group(),c=mesh(GEO.cone,MAT.gunD,.12,.5,.12,0,0,0);c.rotation.x=Math.PI/2;g.add(c,glow(0xff8a3a,1.6,.9));
      g.position.set(p.x+.2,p.y+1.1,p.z);scene.add(g);shots.push({g,v:new T.Vector3(dx/d*13,(dy-1.1)/d*13,dz/d*13),t:6,dmg:15,home:1});sfx('rocket')}}
  else if(P.atk==='melee'){if(d<e.r+1.0&&e.cd<=0){e.cd=.8;e.kick=1;hurt(9);sfx('melee');e.atkN++}
    else if(gr&&see&&hd>3.5&&hd<9&&e.bt<=0){e.bt=2.5;e.vy=6;e.lunge=.45;sfx('jump')}}
  else if(P.atk==='snipe'){if(e.ch>0){if(!see){e.ch=0;e.cd=1.5}else{e.ch-=dt;if(e.ch<=0){e.cd=4+Math.random()*1.5;e.ft=.14;e.kick=1;sfx('snipe');e.atkN++;
        hv.set(p.x,p.y+.86,p.z);if(los(hv,eye))hurt(P.dmg)}}}
    else if(see&&d<75&&e.cd<=0){e.ch=1.6;sfx('charge')}}
  else if(P.atk==='mortar'){if(see&&hd<34&&e.cd<=0){e.cd=4.2+Math.random()*1.5;e.kick=1;e.atkN++;const T0=1.6,g=14;
    const sg=mesh(GEO.sph,MAT.spore,.22,.22,.22,p.x,p.y+.6,p.z);sg.add(glow(0xff7a3a,4));scene.add(sg);
    shots.push({g:sg,v:new T.Vector3((pos.x-p.x)/T0,(pos.y-(p.y+.6)+0.5*g*T0*T0)/T0,(pos.z-p.z)/T0),t:T0,grav:g,vis:1});
    const rg=mesh(GEO.ring,slamMat,1,1,1,pos.x,pos.y+0.12,pos.z);rg.rotation.x=-Math.PI/2;scene.add(rg);slams.push({g:rg,t:T0,T:T0,r:4,dmg:16,x:pos.x,y:pos.y,z:pos.z});sfx('mortar')}}}
const pickType=()=>{if(Math.random()<0.22)return wave>=2&&Math.random()<.45?1:0;
  const pool=[[5,4],[7,2.5],[6,wave>=2?2:0],[8,wave>=2?1.5:0],[9,wave>=3?1.5:0],[10,wave>=2?1.5:0],[11,wave>=2?1.5:0],[12,wave>=3?1.5:0]];let tot=0;for(const[,w]of pool)tot+=w;let r=Math.random()*tot;for(const[t,w]of pool){r-=w;if(r<0)return t}return 5};
const alive=()=>{let n=queue.length;for(const e of enemies)if(!e.dying&&(e.type<3||e.type>=5))n++;return n};
const SITES=[{n:'THE HANGAR BAY',x:0,y:0,z:565},{n:'THE REACTOR',x:-580,y:0,z:45},{n:'THE GUN BATTERY',x:-110,y:0,z:-575},{n:'THE TRENCH',x:597,y:0,z:10},{n:'THE WEST LAKE',x:-371,y:0.56,z:304},{n:'THE FAR NORTH ROAD',x:0,y:0,z:-470},{n:'THE AIRSTRIP',x:200,y:0,z:-70},{n:'THE NORTH-EAST OUTPOST',x:240,y:0,z:-231},{n:'THE SOUTH-WEST OUTPOST',x:-240,y:0,z:270},{n:'THE NORTH-WEST DOME',x:-193,y:0,z:-152},{n:'THE LAKE ISLAND',x:98,y:0.56,z:4.5},{n:'THE SPIRE',x:-92,y:0,z:-13},{n:'THE PROMENADE',x:0,y:0,z:92},{n:'THE SUMMIT',x:0,y:10.5,z:-100},{n:'THE ORCHARD',x:46,y:0,z:4},{n:'THE TANK FARM',x:-54,y:0,z:16},{n:'THE CARGO YARD',x:0,y:0,z:41},{n:'THE TERRACES',x:-12,y:1.5,z:-46}];
const CORE_SPOTS=[[0,7,-585],[-555,9.4,28],[597,0,-160],[70,0,560],[585,3,585],[445,15.3,445],[-445,15.3,-445],[399,0.56,-296],[-470,0,0],[240,8.8,-252],[-240,8.8,228],[235,55,-70],[194,0,152],[0,0,300],[-300,0,0],[172,17.3,-98],[-85,20,0],[0,10.5,-106],[60,8.8,60],[-60,8.8,-60],[98,0.56,-3.5],[0,0,100],[94,0,-90],[-54,4.55,0],[10,4.5,-62],[20,2,20],[0,3,-24],[0,0,36.5],[54,0,-16],[-40,0,-40],[0,1.5,4]];
let mission=null,gap=0.01,slams=[],cores=[];
const beaconMat=bas({color:0x8fe6ff,transparent:true,opacity:0.85,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending,fog:false});
const pillarMat=bas({color:0x8fe6ff,transparent:true,opacity:0.16,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending,fog:false});
const slamMat=bas({color:0xff3b3b,transparent:true,opacity:0.9,side:T.DoubleSide,depthWrite:false,fog:false});
GEO.ring=new T.RingGeometry(0.86,1,48);
const beacon=new T.Group();{const r=mesh(GEO.ring,beaconMat,6,6,1,0,0.08,0);r.rotation.x=-Math.PI/2;beacon.add(r,mesh(GEO.cyl,pillarMat,0.6,60,0.6,0,30,0))}beacon.visible=false;scene.add(beacon);
function mkCore(x,y,z){const g=new T.Group(),o=mesh(GEO.oct,bas({color:0x8fe6ff}),0.35,0.5,0.35,0,1,0);g.add(o,glow(0x8fe6ff,3,0.8),mesh(GEO.cyl,pillarMat,0.25,40,0.25,0,20,0));
  g.children[1].position.y=1;g.position.set(x,y,z);scene.add(g);return{g,o,x,y,z}}
function setObj(t,frac){$('obj').hidden=false;$('objT').textContent=t;const b=$('objBar');b.hidden=frac===undefined;if(frac!==undefined)b.firstElementChild.style.width=Math.max(0,Math.min(1,frac))*100+'%'}
const CHX={};function chex(r,h,b){const k=[r,h,b].join();if(CHX[k])return CHX[k];const sh=new T.Shape(),q=r-b;for(let i=0;i<6;i++){const t=i*Math.PI/3;sh[i?'lineTo':'moveTo'](Math.sin(t)*q,-Math.cos(t)*q)}
  const g=new T.ExtrudeGeometry(sh,{depth:Math.max(.01,h-2*b),bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:1,steps:1});g.rotateX(-Math.PI/2);g.translate(0,-Math.max(.01,h-2*b)/2,0);return CHX[k]=g}
const CBm=(m,w,h,d,x=0,y=0,z=0,b)=>mesh(cbox(w,h,d,b||Math.min(.14,Math.min(w,h,d)*.2)),m,1,1,1,x,y,z);
// boss detail: static greebles baked into one mesh per material and added to a group
function greeble(par,name,fn){const o=inst(kit(name,a=>fn(a,rb(a))),true);par.add(o);return o}
function bossModel(){const CM=charMats(),g=new T.Group(),A1=CM.plate[0],A2=CM.joint,AM=MAT.amber,GD=MAT.gunD,rag=[];
  g.add(mesh(chex(3.2,1.4,.12),A2,1,1,1),mesh(chex(3.45,.3,.08),A1,1,1,1,0,.55,0),mesh(GEO.sph,A2,2.3,1.2,2.3,0,-.75,0),mesh(GEO.hex,AM,3.48,.08,3.48,0,.32,0));
  g.add(CBm(A1,1.6,1.4,2.2,0,1.3,-.6),mesh(GEO.box,MAT.strip,1.62,.12,1.4,0,1.55,-.3),CBm(A2,2.8,.3,.6,0,.9,1.6));
  greeble(g,'bgM2',(a,R)=>{for(const s of[-1,1]){R(A2,.25,1.2,1.8,s*.92,1.3,-.6,0,0,0,.05);for(let k=0;k<4;k++)R(A1,.06,.9,.06,s*1.06,1.3,-1.3+k*.45,0,0,0,.015);a(GEO.cyl,A2,.12,1.6,.12,s*.6,.9,1.0,1.571,0,0)}
    for(let k=0;k<5;k++)a(GEO.cyl,A2,.03,.9+k*.2,.03,-.5+k*.25,2.4+k*.1,-1.4);R(A2,1.2,.15,.9,0,2.05,-1.3);for(let i=0;i<12;i++){const t=i/12*6.283;a(GEO.box,A2,.3,.12,.08,Math.sin(t)*2.15,-1.2,Math.cos(t)*2.15,0,t,0)}
    for(let i=0;i<6;i++){const t=i*Math.PI/3+Math.PI/6,sn=Math.sin(t),c=Math.cos(t);R(A2,.5,.5,.4,sn*2.95,0,c*2.95,0,t,0,.06);a(GEO.box,MAT.strip,.5,.04,1.1,sn*2.1,.72,c*2.1,0,t,0);
      a(GEO.cyl,A2,.3,.12,.3,Math.sin(t+.5)*1.2,-1.35,Math.cos(t+.5)*1.2);a(GEO.cyl,AM,.22,.03,.22,Math.sin(t+.5)*1.2,-1.42,Math.cos(t+.5)*1.2)}});
  // armour flaps on the top deck: hinged at the inner edge, they lift to show the glowing core when the shield is down
  const flaps=[];for(let i=0;i<6;i++){const t=i*Math.PI/3+Math.PI/6,f=new T.Group();f.position.set(Math.sin(t)*1.35,.72,Math.cos(t)*1.35);f.rotation.y=t;g.add(f);
    greeble(f,'bgMf',(a,R)=>{R(A1,.9,.14,1.5,0,.07,.75,0,0,0,.05);for(let k=0;k<3;k++)R(A2,.7,.04,.08,0,.16,.3+k*.4,0,0,0,.015);a(GEO.box,AM,.6,.02,.04,0,.15,1.46);a(GEO.cyl,A2,.06,.8,.06,0,0,0,0,0,1.571)});flaps.push(f);rag.push(f)}
  // gimballed thruster pods
  const pods=[];for(let i=0;i<6;i++){const a=i/6*6.283+.52,pd=new T.Group();pd.position.set(Math.cos(a)*3.6,0,Math.sin(a)*3.6);pd.rotation.y=-a;g.add(pd);
    pd.add(mesh(GEO.cyl,A1,.55,1.8,.55,0,-.3,0),mesh(GEO.tor,MAT.strip,.5,.5,.5,0,-1.25,0,1.571,0,0));greeble(pd,'bgMp',(a,R)=>{a(GEO.sph,A2,.45,.45,.45,0,.5,0);for(const y of[.2,-.4,-.9])a(GEO.cyl,A2,.6,.08,.6,0,y,0);R(A1,.25,1.2,.3,.55,-.3,0,0,0,0,.05);R(A1,.25,1.2,.3,-.55,-.3,0,0,0,0,.05);a(GEO.cyl,A2,.42,.15,.42,0,-1.15,0)});
    const q=glow(0x8fe6ff,3,.7);q.position.set(0,-1.4,0);pd.add(q);pods.push(pd);rag.push(pd)}
  const crown=new T.Group();crown.position.set(0,2.05,-.6);g.add(crown);rag.push(crown);
  crown.add(mesh(GEO.cyl,A2,.12,.8,.12,0,.4,0));for(let i=0;i<3;i++){const a=i/3*6.283;crown.add(CBm(A1,1.6,.08,.3,Math.cos(a)*.8,.8,Math.sin(a)*.8),mesh(GEO.sph,AM,.08,.08,.08,Math.cos(a)*1.6,.8,Math.sin(a)*1.6));crown.children[crown.children.length-2].rotation.y=-a}
  greeble(crown,'bgMc',(a,R)=>{a(GEO.cyl,A2,.3,.12,.3,0,.8,0);a(GEO.cyl,AM,.1,.3,.1,0,1.0,0);for(let i=0;i<3;i++){const t=i/3*6.283+1.05;a(GEO.cyl,A2,.02,.6,.02,Math.cos(t)*.25,1.1,Math.sin(t)*.25)}});
  // six tendrils, four armoured segments each, with grabbing claws at the tip
  const tend=[],claws=[];for(let i=0;i<6;i++){const a=i/6*6.283;let par=g;const ch=[];
    for(let k=0;k<4;k++){const sg=new T.Group();if(k)sg.position.set(0,-0.85,0);else sg.position.set(Math.cos(a)*1.6,-1.7,Math.sin(a)*1.6);par.add(sg);
      sg.add(mesh(GEO.cyl,GD,.07,.85,.07,0,-.42,0),CBm(A1,.2-k*.025,.36,.2-k*.025,0,-.45,0),mesh(GEO.sph,A2,.13,.13,.13,0,-.85,0));
      if(k===3)for(const s of[-1,1]){const cg=new T.Group();cg.position.set(s*.1,-.9,0);sg.add(cg);const c=mesh(GEO.cone,AM,.08,.4,.08,0,-.15,0);c.rotation.z=Math.PI;cg.add(c,CBm(A2,.06,.14,.1,0,0,0));cg.userData.s=s;claws.push(cg)}
      ch.push(sg);rag.push(sg);par=sg}tend.push(ch)}
  // mandibles with a second hinged jaw
  const mand=[];for(const s of[-1,1]){const m=new T.Group();m.position.set(s*1.2,-.5,2.6);m.userData.s=s;g.add(m);m.add(CBm(A2,.3,.3,1.6,0,0,.7));
    greeble(m,'bgMm'+s,(a,R)=>{R(A1,.42,.38,.8,0,.04,.35,0,0,0,.06);a(GEO.cyl,A2,.05,1.0,.05,s*.2,.18,.6,1.571,0,0);for(let k=0;k<3;k++)a(GEO.box,AM,.02,.05,.1,s*.22,0,.1+k*.25)});
    const jw=new T.Group();jw.position.set(0,0,1.45);m.add(jw);jw.add(mesh(GEO.sph,A2,.2,.2,.2),CBm(A1,.26,.22,.6,0,0,.3));const c=mesh(GEO.cone,AM,.16,.6,.16,-s*.06,0,.75);c.rotation.x=1.571;jw.add(c);m.userData.j=jw;mand.push(m);rag.push(m)}
  const iris=new T.Group();iris.position.set(0,0,3.05);g.add(iris);rag.push(iris);iris.add(mesh(GEO.sph,MAT.eyeA,.9,.9,.5),mesh(GEO.tor,A2,.62,.62,.62,0,0,.32));
  const pupil=mesh(GEO.sph,MAT.dark,.4,.4,.2,0,0,.4);iris.add(pupil);const lids=[];for(const s of[-1,1]){const l=CBm(A2,2.0,.35,.5,0,s*.95,.15);iris.add(l);lids.push([l,s])}
  const wings=[],parts=[];g.traverse(o=>{if(o.isMesh){o.castShadow=true;parts.push([o,o.material])}});
  const gl=glow(0xffb238,7,0.8);gl.position.set(0,0,3.5);g.add(gl);
  const rig={rag,anim(e,t,dt){const V=e.vuln>0;crown.rotation.y+=dt*(V?.3:1.2);
    for(let i=0;i<6;i++)for(let k=0;k<4;k++){const sg=tend[i][k];sg.rotation.x=Math.sin(t*1.4+i+k*.7)*(.22+k*.04);sg.rotation.z=Math.cos(t*1.1+i*1.3+k*.6)*(.18+k*.04)}
    for(const c of claws)c.rotation.z=c.userData.s*(.35+.35*Math.sin(t*3+c.id));
    const o=V?.5:.1+Math.abs(Math.sin(t*3))*.25;for(const m of mand){m.rotation.y=-m.userData.s*o;m.userData.j.rotation.y=-m.userData.s*o*.9}
    for(let i=0;i<6;i++){pods[i].rotation.x=Math.sin(t*.8+i)*.2;pods[i].rotation.z=Math.cos(t*.7+i*1.7)*.2;const f=flaps[i],tg=V?-.75:-.04*(1+Math.sin(t*2+i));f.rotation.x+=(tg-f.rotation.x)*Math.min(1,dt*4)}
    for(const[l,s]of lids){const tg=s*(V?1.25:.62);l.position.y+=(tg-l.position.y)*Math.min(1,dt*5)}
    pupil.position.x=Math.sin(t*.8)*.15;pupil.position.y=Math.cos(t*1.1)*.1;iris.scale.setScalar(1+(V?Math.sin(t*12)*.06:0))}};
  return{g,wings,parts,rig}}
const EB=()=>({white:false,flash:0,dying:0,sh:0,sel:0,shell:null,wings:[],spd:0,cd:0,ph:0});
function growPods(b){const n=b.hp<b.max/3?4:3,k=1+0.14*(wave-1);
  for(let i=0;i<n;i++){const g=new T.Group(),inner=new T.Group();g.add(inner,glow(0x8fe6ff,2.6,0.8));
    inner.add(inst(kit('node',a=>{a(GEO.oct,MAT.armorD,.55,.75,.55);for(let j=0;j<3;j++)a(GEO.tor,MAT.gun,.7,.7,.7,0,0,0,j*1.047,j*.6,0);a(GEO.sph,MAT.strip,.32,.32,.32);
      for(const s of[-1,1])a(GEO.cone,MAT.amber,.1,.4,.1,0,s*.85,0,s>0?0:Math.PI,0,0)}),true));
    const parts=[];g.traverse(o=>{if(o.isMesh)parts.push([o,o.material])});g.position.copy(b.pos);scene.add(g);
    const e={...EB(),type:4,pos:g.position,g,parts,r:0.7,hp:5*k,boss:b,ang:i/n*6.283,rig:{anim(e,t){inner.scale.setScalar(1+Math.sin(t*5+e.ang*3)*.07)}}};b.pods.push(e);enemies.push(e)}}
const BOSS={matriarch:{title:'The Matriarch',name:'MATRIARCH',hint:'DESTROY THE SHIELD NODES',down:'SHIELD DOWN, HIT THE CORE',tip:'Shielded: destroy the orbiting nodes',open:'Shield down: hit the core',close:'Shield restored'},
  colossus:{title:'The Colossus',name:'COLOSSUS',hint:'DESTROY THE POWER CELLS',down:'ARMOR OPEN, HIT THE CHEST CORE',tip:'Armored: shoot the glowing power cells on its frame',open:'Armor open: hit the chest core',close:'Armor sealed',baseY:6,r:3,
    slots:[[-3.1,2.6,0],[3.1,2.6,0],[0,1.4,-2.4],[0,-1.2,1.9]]},
  widow:{title:'The Widow',name:'WIDOW',hint:'DESTROY THE COOLANT VENTS',down:'ARMOR OPEN, HIT THE SENSOR EYE',tip:'Armored: shoot the coolant vents on its back',open:'Armor open: hit the sensor eye',close:'Armor sealed',baseY:3.2,r:3.5,
    slots:[[-1.7,2,-1.2],[1.7,2,-1.2],[0,2.2,-2.6],[0,1.7,1.5]]}};
const KINDS=['matriarch','colossus','widow'];
function colossusModel(){const CM=charMats(),g=new T.Group(),A1=CM.plate[6],A2=CM.joint,AM=MAT.amber,rag=[];const B=(m,sx,sy,sz,x,y,z,par=g)=>{const o=m===A1||m===A2?CBm(m,sx,sy,sz,x,y,z):mesh(GEO.box,m,sx,sy,sz,x,y,z);par.add(o);return o};
  B(A1,4.2,3,2.8,0,.8,0);B(A2,3.4,1.2,2.4,0,-.9,0);B(AM,3.7,.15,.32,0,1.7,1.5);B(AM,3.7,.15,.32,0,.1,1.5);B(A2,2.6,2.4,1.2,0,1,-1.9);B(MAT.strip,3.0,1.2,.1,0,.9,1.33);
  for(const x of[-.8,.8]){g.add(mesh(GEO.cyl,A2,.35,2.2,.35,x,3,-2.1));const q=glow(0xff8a3a,2.2,.8);q.position.set(x,4.2,-2.1);g.add(q)}
  // chest doors: hinged at the outer edges, they swing open when the armour is down
  const doors=[];for(const s of[-1,1]){const d=new T.Group();d.position.set(s*1.8,.9,1.45);g.add(d);B(A2,1.8,1.8,.3,-s*.9,0,0,d);greeble(d,'bgCd'+s,(a,R)=>{for(let k=0;k<3;k++)R(A1,1.5,.12,.1,-s*.95,-.55+k*.55,.18,0,0,0,.03);a(GEO.cyl,A2,.1,1.8,.1,0,0,0)});doors.push([d,s]);rag.push(d)}
  const head=new T.Group();head.position.set(0,2.6,.4);g.add(head);rag.push(head);B(A2,1.4,1,1.4,0,.4,0,head);B(MAT.eye,1.1,.18,.1,0,.45,.72,head);B(A1,1.6,.25,1.6,0,.95,0,head);
  greeble(head,'bgCH',(a,R)=>{for(const s of[-1,1]){R(A1,.2,.7,1.2,s*.78,.4,0,0,0,0,.05);a(GEO.cyl,A2,.05,.6,.05,s*.5,1.3,-.4)}R(A2,1.0,.12,.3,0,.18,.68,0,0,0,.04);a(GEO.sph,A2,.35,.35,.35,0,-.05,0)});
  for(const s of[-1,1])B(A1,1.6,1,1.8,s*2.7,2,0);
  const arms=[];for(const s of[-1,1]){const sh=new T.Group();sh.position.set(s*2.7,1.3,0);g.add(sh);B(A2,.9,2.2,.9,0,-1.1,0,sh);const el=new T.Group();el.position.set(0,-2.2,0);sh.add(el);
    const c=mesh(GEO.cyl,A2,.42,2.6,.42,0,-.2,1.1);c.rotation.x=Math.PI/2;el.add(c);const r=mesh(GEO.cyl,AM,.48,.3,.48,0,-.2,2.4);r.rotation.x=Math.PI/2;el.add(r);
    const brl=new T.Group();brl.position.set(0,-.2,2.45);el.add(brl);greeble(brl,'bgCb',(a,R)=>{for(let k=0;k<6;k++){const an=k*Math.PI/3;a(GEO.cyl,A2,.08,1.0,.08,Math.cos(an)*.24,Math.sin(an)*.24,.4,1.571,0,0)}a(GEO.cyl,A1,.36,.12,.36,0,0,.15,1.571,0,0);a(GEO.cyl,A1,.34,.1,.34,0,0,.82,1.571,0,0)});
    arms.push([sh,el,brl,s]);rag.push(sh,el)}
  const legs=[];for(const s of[-1,1]){const hip=new T.Group();hip.position.set(s*1.4,-1.4,0);g.add(hip);B(A1,1.1,2.6,1.3,0,-1.2,0,hip);const kn=new T.Group();kn.position.set(0,-2.4,0);hip.add(kn);
    B(A2,.9,2.4,1,0,-1.1,0,kn);B(A1,1.2,.5,.4,0,-.2,.6,kn);const an=new T.Group();an.position.set(0,-2.15,0);kn.add(an);B(A2,1.4,.4,2.2,0,-.15,.3,an);B(A1,1.2,.25,.8,0,.12,1.0,an);legs.push([hip,kn,an]);rag.push(hip,kn,an)}
  greeble(g.children[0],'bgC',(a,R)=>{for(const s of[-1,1]){for(let k=0;k<4;k++)R(A2,.08,2.4,.1,s*(.5+k*.42),0,1.42,0,0,0,.02);R(A1,.9,.6,.2,s*1.6,1.1,1.45,-.25,0,0,.06);a(GEO.cyl,A2,.18,1.6,.18,s*2.15,0,-.6);a(GEO.cyl,A1,.22,.1,.22,s*2.15,.5,-.6);a(GEO.cyl,A1,.22,.1,.22,s*2.15,-.5,-.6)}
    for(let k=0;k<6;k++)R(A2,2.2,.06,.12,0,.2+k*.28,-2.52,0,0,0,.02);R(A1,4.3,.3,2.9,0,1.6,0,0,0,0,.1);for(const x of[-1.4,1.4])R(A2,.6,.12,.6,x,1.82,-.3,0,0,0,.04)});
  for(const[sh,el]of arms){greeble(sh,'bgCa',(a,R)=>{R(A1,1.3,.8,1.3,0,-.2,0,0,0,0,.1);a(GEO.cyl,A2,.12,1.6,.12,.48,-1.1,.3);a(GEO.sph,A2,.55,.55,.55,0,-2.2,0)});
    greeble(el,'bgCe',(a,R)=>{for(const z of[.5,1.0,1.5])a(GEO.cyl,A1,.5,.12,.5,0,-.2,z,1.571,0,0);R(A2,.6,.5,.9,0,.25,.6,0,0,0,.06);a(GEO.box,AM,.04,.04,1.6,.32,-.2,1.2)})}
  for(const[hip,kn,an]of legs){greeble(hip,'bgCh',(a,R)=>{a(GEO.sph,A2,.6,.6,.6,0,0,0);R(A2,.3,1.8,.3,0,-1.2,-.75,0,0,0,.05);R(A1,1.25,.7,.25,0,-.6,.72,.15,0,0,.06)});
    greeble(kn,'bgCk',(a,R)=>{a(GEO.sph,A2,.55,.55,.55,0,0,0);a(GEO.cyl,A2,.1,1.6,.1,0,-1.1,-.6)});
    greeble(an,'bgCf',(a,R)=>{a(GEO.sph,A2,.42,.42,.42,0,0,0);for(const s of[-1,1])R(A2,.3,.3,.6,s*.5,-.15,1.3,0,0,0,.05);a(GEO.box,AM,.9,.06,.06,0,.05,1.42);R(A2,1.0,.3,.4,0,-.2,-.9,0,0,0,.05)})}
  const iris=new T.Group();iris.position.set(0,.8,1.65);g.add(iris);rag.push(iris);iris.add(mesh(GEO.sph,MAT.eyeA,.75,.75,.4),mesh(GEO.tor,A2,.55,.55,.55,0,0,.25));const pupil=mesh(GEO.sph,MAT.dark,.32,.32,.15,0,0,.33);iris.add(pupil);
  const parts=[];g.traverse(o=>{if(o.isMesh){o.castShadow=true;parts.push([o,o.material])}});const gl=glow(0xffb238,4,.7);gl.position.set(0,.8,2.1);g.add(gl);
  const body=g.children[0];
  return{g,wings:[],parts,rig:{rag,anim(e,t,dt){const m=e.mv||0,w=t*3.2,V=e.vuln>0;for(let i=0;i<2;i++){const[h,k,an]=legs[i],q=w+(i?Math.PI:0);h.rotation.x=-Math.sin(q)*.35*m+Math.sin(t*.9)*.03;k.rotation.x=Math.max(0,Math.sin(q+1.2))*.5*m+.04;an.rotation.x=-(h.rotation.x+k.rotation.x)}
    body.position.y=.8+Math.abs(Math.sin(w))*.15*m;body.rotation.y=Math.sin(t*.45)*.1;e.kick=Math.max(0,(e.kick||0)-dt*3);
    for(const[sh,el,brl,s]of arms){sh.rotation.x=-1.2-e.kick*.3+Math.sin(t*.6+s)*.08;sh.rotation.z=s*.06*Math.sin(t*.5);el.rotation.x=-.3+e.kick*.2+Math.sin(t*.8+s)*.05;brl.rotation.z+=dt*(e.kick>.05?22:2.5)*s}
    for(const[d,s]of doors){const tg=V?s*1.1:0;d.rotation.y+=(tg-d.rotation.y)*Math.min(1,dt*3)}
    head.rotation.y=Math.sin(t*.7)*.3;head.rotation.x=Math.sin(t*.55)*.06;pupil.position.x=Math.sin(t*.9)*.1;iris.scale.setScalar(1+(V?Math.sin(t*12)*.06:0))}}}}
function widowModel(){const CM=charMats(),g=new T.Group(),A1=CM.plate[1],A2=CM.joint,AM=MAT.amber,rag=[];
  {const h=mesh(chex(3.2,1.4,.12),A1,1,1,1);h.scale.z=3.8/3.2;g.add(h,mesh(GEO.hex,A2,3.3,.4,3.9,0,-.7,0),mesh(GEO.sph,A2,2.4,1,2.6,0,.6,-.4),mesh(GEO.hex,AM,3.32,.1,3.92,0,.25,0))}
  const vents=[];for(let i=0;i<4;i++){const v=new T.Group();v.position.set(0,1.2,-1.6+i*.9);g.add(v);v.add(CBm(A2,2.2,.12,.3,0,0,0));vents.push(v)}
  greeble(g,'bgW',(a,R)=>{for(const s of[-1,1]){R(A1,.9,.2,2.6,s*1.6,.78,-.2,0,0,s*.22,.06);for(let k=0;k<5;k++)R(A2,.5,.05,.1,s*1.6,.9,-1.2+k*.5,0,0,s*.22,.02);a(GEO.cyl,A2,.1,2.4,.1,s*2.45,.3,-.2,1.571,0,0)}
    R(A2,1.4,.5,.6,0,.2,-3.2,0,0,0,.08);for(const s of[-1,1]){a(GEO.cyl,A2,.25,.5,.25,s*.45,.2,-3.55,1.571,0,0);a(GEO.cyl,AM,.27,.06,.27,s*.45,.2,-3.8,1.571,0,0)}
    R(A1,1.6,.3,.5,0,-.1,2.9,.3,0,0,.06);for(let i=0;i<10;i++){const t=i/10*6.283;a(GEO.box,A2,.25,.1,.08,Math.sin(t)*2.0,-.95,Math.cos(t)*2.2,0,t,0)}a(GEO.box,MAT.strip,1.9,.04,3.2,0,1.12,-.25)});
  const tur=new T.Group();tur.position.set(0,1.4,.4);g.add(tur);rag.push(tur);tur.add(mesh(GEO.cyl,A2,1.1,.6,1.1),CBm(A1,1.6,.7,1.8,0,.5,.2));
  const brl=[];for(const s of[-1,1]){const b=new T.Group();b.position.set(s*.45,.5,.3);tur.add(b);const c=mesh(GEO.cyl,A2,.2,2.6,.2,0,0,1.3);c.rotation.x=Math.PI/2;b.add(c,mesh(GEO.box,AM,.26,.26,.2,0,0,2.6));brl.push(b)}
  greeble(tur,'bgWt',(a,R)=>{for(const s of[-1,1]){for(const z of[1.0,1.6,2.2])a(GEO.cyl,A1,.27,.12,.27,s*.45,.5,z,1.571,0,0);R(A1,.2,.5,1.4,s*.95,.5,.3,0,0,0,.05)}R(A2,1.2,.18,1.2,0,.94,.0,0,0,0,.05);a(GEO.cyl,A2,.15,.3,.15,.5,1.1,-.4);a(GEO.sph,MAT.eye,.08,.08,.08,.5,1.28,-.4)});
  const iris=new T.Group();iris.position.set(0,.1,3.05);g.add(iris);rag.push(iris);iris.add(mesh(GEO.sph,MAT.eyeA,.7,.7,.4),mesh(GEO.tor,A2,.5,.5,.5,0,0,.22));const pupil=mesh(GEO.sph,MAT.dark,.3,.3,.15,0,0,.3);iris.add(pupil);
  for(const x of[-1.1,1.1])g.add(mesh(GEO.sph,MAT.eye,.22,.22,.15,x,.3,2.95));
  // fangs under the eye
  const fangs=[];for(const s of[-1,1]){const f=new T.Group();f.position.set(s*.75,-.55,2.85);g.add(f);f.add(mesh(GEO.sph,A2,.18,.18,.18),CBm(A1,.18,.5,.2,0,-.25,.05));const c=mesh(GEO.cone,AM,.1,.45,.1,0,-.65,.15);c.rotation.x=Math.PI-.3;f.add(c);fangs.push([f,s]);rag.push(f)}
  const legs=[];const ang=[-.55,0,.55,Math.PI-.55,Math.PI,Math.PI+.55];ang.forEach((a,i)=>{const hip=new T.Group();hip.position.set(Math.cos(a)*2.6,-.2,-Math.sin(a)*2.6);hip.rotation.y=a;g.add(hip);
    const u=CBm(A2,2.8,.4,.5,1.1,.8,0);u.rotation.z=Math.atan2(1.6,2.2);hip.add(u,mesh(GEO.sph,A2,.4,.4,.4));const kn=new T.Group();kn.position.set(2.2,1.6,0);hip.add(kn);
    const pi=mesh(GEO.cyl,A2,.08,2.2,.08,1.1,.6,.3);pi.rotation.z=u.rotation.z+1.571;hip.add(pi);
    const l=CBm(A1,4.4,.45,.55,.55,-2.1,0);l.rotation.z=Math.atan2(-4.4,1.1);const lp=CBm(A1,1.6,.7,.7,.15,-.6,0);lp.rotation.z=l.rotation.z;kn.add(l,lp,mesh(GEO.sph,A2,.42,.42,.42));
    greeble(kn,'bgWk',(a,R)=>{const an=Math.atan2(-4.4,1.1);for(const d of[1.4,2.4,3.4])a(GEO.box,AM,.04,.12,.6,Math.cos(an)*d+.1,Math.sin(an)*d,0,0,0,0);a(GEO.cyl,A2,.06,3,.06,.75,-2,.32,0,0,an+1.571)});
    const ft=new T.Group();ft.position.set(1.15,-4.3,0);kn.add(ft);const cn=mesh(GEO.cone,AM,.25,.6,.25,0,-.25,0);cn.rotation.z=Math.PI;ft.add(cn);
    greeble(ft,'bgWf',(a,R)=>{a(GEO.sph,A2,.3,.3,.3);for(const s of[-1,1])R(A1,.55,.16,.2,.05,-.1,s*.2,0,0,-.5,.04)});legs.push([hip,kn,a,i,ft]);rag.push(hip,kn,ft)});
  const parts=[];g.traverse(o=>{if(o.isMesh){o.castShadow=true;parts.push([o,o.material])}});const gl=glow(0xffb238,3.4,.7);gl.position.set(0,.1,3.4);g.add(gl);
  const sac=g.children[2];
  return{g,wings:[],parts,rig:{rag,anim(e,t,dt){const m=e.mv||0,w=t*6,V=e.vuln>0;for(const[h,k,a,i,ft]of legs){const q=w+(i%2?Math.PI:0);h.rotation.set(0,a+Math.sin(q)*.25*m,Math.max(0,Math.sin(q+1))*.25*m+Math.sin(t*1.5+i)*.03);
      k.rotation.z=-Math.max(0,Math.sin(q+1.5))*.22*m+Math.sin(t*1.2+i*2)*.04;ft.rotation.z=-(h.rotation.z+k.rotation.z)}
    g.children[0].position.y=Math.abs(Math.sin(w))*.08*m;sac.scale.set(2.4,1+Math.sin(t*2.2)*.05,2.6);e.kick=Math.max(0,(e.kick||0)-dt*8);tur.position.z=.4-e.kick*.15;tur.rotation.y=Math.sin(t*.5)*.35;
    for(const b of brl)b.position.z=.3-e.kick*.3;for(let i=0;i<4;i++)vents[i].rotation.x+=((V?-.9:-.05-Math.sin(t*3+i)*.05)-vents[i].rotation.x)*Math.min(1,dt*4);
    for(const[f,s]of fangs){f.rotation.x=.15+Math.sin(t*2.6)*.15;f.rotation.z=s*(.1+Math.abs(Math.sin(t*1.7))*.25)}
    pupil.position.x=Math.sin(t*1.3)*.12;iris.scale.setScalar(1+(V?Math.sin(t*12)*.06:0))}}}}

function mkBoss(kind='matriarch',rn){const B=BOSS[kind],m=kind==='colossus'?colossusModel():kind==='widow'?widowModel():bossModel(),k=1+0.14*(wave-1),a=Math.random()*6.283;
  const pr=rn?ROOMS.find(r=>r.n===rn):roomAt(pos.x,pos.z),H0=pr&&pr.h>=24?pr:ROOMS.find(r=>r.n==='COMMONS'),H=H0.arena?{x0:-20,x1:20,z0:-15,z1:15}:H0;m.g.position.set((H.x0+H.x1)/2+Math.cos(a)*14,B.baseY||12,(H.z0+H.z1)/2+Math.sin(a)*14);scene.add(m.g);
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

function nextMission(){wave++;const C=CAMP[wave-1]||null,m=mission={type:'purge',done:false,boss:null,bossDue:C?!!C.boss:true,bossT:C?75:22,C,rooms:C?C.rooms:null,tut:0,tt:0,rd:0};sfx('wave');
  const n=C?C.n:7+wave*2;for(let i=0;i<n;i++)spawnAt(C?pickMix(C.mix):pickType(),(C&&C.delay||0)+i*(C?C.gapS:.4));if(C?C.gunship:true)spawnAt(2,n*0.4);m.n0=n;
  say(C?'Stage '+wave+' of '+CAMP.length+' · '+C.name:'Stage '+wave+' · Purge, boss inbound',3);if(C)for(const[k,t]of C.start)comm(k,t);else storyStart(m)}
function complete(){const boss=!!mission.boss,C=mission.C;setTimeout(writeSave,0);mission=null;gap=boss?7:4;if(C&&wave===CAMP.length){gap=1e9;if(LC){LC.ph='go';LC.t=0}else{endT=8;endCap=60}}beacon.visible=false;$('obj').hidden=true;
  for(const e of enemies)if(!e.dying){e.dying=0.001;sparkle(e.pos,0xffffff,6,5)}queue.length=0;clear(shots);clear(slams);
  score+=wave*100;hp=Math.min(100,hp+(boss?100:25));refill(boss?1:.4);clear(fires);clear(wells);say(boss?'Deck secured':'Stage clear',2.5);if(C){for(const[k,t]of C.end)comm(k,t);if(boss)comm('G',C.log||STORY.logs[logI++%STORY.logs.length])}else storyEnd(boss);sfx('pick')}
function missionTick(dt){
  for(let i=slams.length-1;i>=0;i--){const q=slams[i];q.t-=dt;q.g.scale.setScalar(1+(1-q.t/(q.T||1.3))*((q.r||5.5)-1));
    if(q.t<=0){scene.remove(q.g);slams.splice(i,1);const m=bas({color:0xff3b3b,transparent:true,opacity:0.85,fog:false}),g=mesh(GEO.sph,m,0.5,0.5,0.5,q.x,q.y+0.5,q.z);scene.add(g);blasts.push({g,m,t:0});
      sparkle(g.position,0xff5a5a,16,9);sfx('boom');if(Math.hypot(pos.x-q.x,pos.z-q.z)<(q.r||5.5)&&Math.abs(pos.y-q.y)<3){hurt(q.dmg||35);if(state!=='playing')return}}}
  if(!mission){if(LC&&(LC.ph==='go'||LC.ph==='act'||LC.ph==='out')){lcoreTick(dt);return}if(endT>0){endT-=dt;endCap-=dt;if(endT<=0){if(endCap>0&&(commCur||COMMS.length||VOICE.busy))endT=.5;else{showEnding();return}}}gap-=dt;if(gap<=0)nextMission();return}
  const m=mission;
  if(m.bossDue&&!m.boss){m.bossT-=dt;if(m.bossT<=0||alive()<=Math.ceil(m.n0*0.4)){const kind=m.C?m.C.boss:KINDS[bossN%KINDS.length];m.boss=mkBoss(kind,m.C&&m.C.bossRoom);bossN++;if(m.C)for(const[k,t]of m.C.bossL)comm(k,t);else storyBoss(kind);say('Boss · '+BOSS[kind].title,3)}}
  const n=alive(),b=m.boss,C=m.C,inA=!C||C.rooms.includes((roomAt(pos.x,pos.z)||{}).n),pre=C?'STAGE '+wave+'/'+CAMP.length+' · ':'',
    go=C&&!inA&&!b?'GO TO '+C.area+' · '+Math.round(Math.hypot(pos.x-C.at[0],pos.z-C.at[1]))+' M · ':'';
  beacon.visible=!!go;if(go)beacon.position.set(C.at[0],0,C.at[1]);
  if(b&&!m.done)setObj(pre+'PURGE · '+n+' LEFT · '+(BOSS[b.kind].name+(b.vuln>0?' · '+BOSS[b.kind].down:' · '+BOSS[b.kind].hint)),b.hp/b.max);
  else setObj(pre+go+(m.bossDue&&!b?'PURGE · '+n+' LEFT · BOSS INBOUND':'PURGE · '+n+' LEFT'));
  if(wave===1&&C&&!ROW.on&&ROW.arrive<=0&&m.n0-n>=3)ROW.arrive=1.5;
  if(C&&C.radio&&m.rd<C.radio.length&&m.n0-n>=C.radio[m.rd].k){for(const[k,t]of C.radio[m.rd].lines)comm(k,t);m.rd++}
  // first stage only: one control prompt at a time
  if(wave===1&&C&&m.tut<4){m.tt+=dt;const k=m.n0-n;
    if(m.tut===0&&m.tt>3.5){say(touchUI?'Left side moves · right side looks':'WASD to move · mouse to look',4);m.tut=1;m.tt=0}
    else if(m.tut===1&&m.tt>6){say(touchUI?'Hold FIRE to shoot':'Click to fire · R reloads',4);m.tut=2;m.tt=0}
    else if(m.tut===2&&m.tt>5&&(k>=1||m.tt>25)){say('G throws a grenade · F is your melee skill',4);m.tut=3;m.tt=0}
    else if(m.tut===3&&m.tt>5&&(k>=3||m.tt>25)){say('Hold Tab for all six guns · Z X C are supers',5);m.tut=4}}
  if(!n&&(!m.bossDue||m.done)){if(C&&C.radio&&(m.rd<C.radio.length||commCur||COMMS.length)){setObj(pre+'STAND BY · FLEET COMMAND');return}complete()}}
function targets(){return[]}

/* ---------- audio ---------- */
let ac=null,muted=false;
function tone(type,f0,f1,dur,vol,delay=0){if(!ac||muted)return;const t=ac.currentTime+delay,o=ac.createOscillator(),g=ac.createGain();
  o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(f1,1),t+dur);
  g.gain.setValueAtTime(Math.max(0.0001,vol*CFG.vol),t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g).connect(ac.destination);o.start(t);o.stop(t+dur)}
/* ---------- music: a step sequencer with four layers (pad, bass, drums, lead) that fade with what is happening ---------- */
let musOn=true;const MUS={g:null,t:0,step:0,bar:0,L:{},noise:null,mood:''};
const MOODM={intro:{bpm:76,pad:1,bass:0,drum:0,arp:.9},calm:{bpm:88,pad:.8,bass:0,drum:0,arp:.35},combat:{bpm:116,pad:.6,bass:1,drum:1,arp:.3},boss:{bpm:132,pad:.8,bass:1,drum:1,arp:1}};
const PROG=[[146.83,[0,3,7]],[116.54,[0,4,7]],[174.61,[0,4,7]],[130.81,[0,4,7]]],PROGB=[[146.83,[0,3,7]],[116.54,[0,4,7]],[98,[0,3,7]],[110,[0,4,7]]];
function musInit(){if(MUS.g)return;const g=MUS.g=ac.createGain();g.gain.value=0;g.connect(ac.destination);
  for(const k of['pad','bass','drum','arp']){const n=ac.createGain();n.gain.value=0;n.connect(g);MUS.L[k]=n}
  const b=ac.createBuffer(1,Math.floor(ac.sampleRate*.3),ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;MUS.noise=b;MUS.t=ac.currentTime+.1}
function mNote(dst,type,f,t,dur,vol,att,cut){const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(vol,t+(att||.01));g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  if(cut){const fl=ac.createBiquadFilter();fl.type='lowpass';fl.frequency.value=cut;o.connect(fl);fl.connect(g)}else o.connect(g);g.connect(dst);o.start(t);o.stop(t+dur+.05)}
function mNoise(dst,t,dur,vol,hp){const q=ac.createBufferSource(),g=ac.createGain(),f=ac.createBiquadFilter();q.buffer=MUS.noise;f.type='highpass';f.frequency.value=hp;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);q.connect(f);f.connect(g);g.connect(dst);q.start(t);q.stop(t+dur+.02)}
function mKick(dst,t,vol){const o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(42,t+.14);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+.22);o.connect(g);g.connect(dst);o.start(t);o.stop(t+.25)}
function musicTick(){if(!ac)return;try{musInit();const mood=INTRO.on?'intro':state!=='playing'&&state!=='paused'?'calm':FLY?(FLY.en.length?'combat':'calm'):mission&&mission.boss&&!mission.done?'boss':mission&&alive()>0?'combat':'calm',M=MOODM[mood],now=ac.currentTime;MUS.mood=mood;
  MUS.g.gain.setTargetAtTime(muted||!musOn?0:CFG.vol*(state==='paused'?.2:.55)*(VOICE.busy?.4:1),now,.3);for(const k in MUS.L)MUS.L[k].gain.setTargetAtTime(M[k],now,.8);
  if(MUS.t<now-.3)MUS.t=now+.05;let guard=0;
  while(MUS.t<now+.18&&guard++<8){const t=MUS.t,sp=60/M.bpm/4,st=MUS.step,P=(mood==='boss'?PROGB:PROG)[MUS.bar%4],root=P[0],ch=P[1],fr=n=>root*Math.pow(2,n/12);
    if(st===0)for(const n of ch){mNote(MUS.L.pad,'sawtooth',fr(n),t,sp*16,.05,sp*3,650);mNote(MUS.L.pad,'sine',fr(n+12),t,sp*16,.03,sp*4)}
    if(st%2===0)mNote(MUS.L.bass,'sawtooth',root/2*(st%8===6?2:1),t,sp*1.7,.16,.005,380);
    if(st%4===0)mKick(MUS.L.drum,t,.5);if(st%8===4)mNoise(MUS.L.drum,t,.12,.16,1800);if(st%4===2)mNoise(MUS.L.drum,t,.04,.07,7000);if(mood==='boss'&&(st===10||st===14))mKick(MUS.L.drum,t,.35);
    if(mood==='boss'||mood==='combat')mNote(MUS.L.arp,'triangle',fr(ch[st%3]+12+(st%8>=4?12:0)),t,sp*.9,.07,.005);
    else if(st===0||st===6||st===12)mNote(MUS.L.arp,'sine',fr(ch[(st/6+MUS.bar)%3|0]+24),t,sp*10,.07,.01);
    MUS.step=(st+1)%16;if(MUS.step===0)MUS.bar++;MUS.t+=sp}}catch(e){}}
function sfx(k){
  if(k==='shoot')tone('sawtooth',900,200,.08,.05);
  else if(k==='hit')tone('square',320,120,.07,.05);
  else if(k==='kill')tone('triangle',260,40,.28,.12);
  else if(k==='hurt')tone('sawtooth',130,55,.22,.12);
  else if(k==='pick'){tone('sine',660,660,.08,.08);tone('sine',990,990,.12,.08,.08)}
  else if(k==='over')tone('square',95,70,.35,.07);
  else if(k==='wave'){tone('sine',440,440,.12,.07);tone('sine',660,660,.2,.07,.13)}
  else if(k==='lance'){tone('sawtooth',300,60,.3,.1);tone('square',1400,300,.12,.05)}
  else if(k==='boom'){tone('triangle',140,30,.45,.2);tone('sawtooth',90,40,.3,.1)}
  else if(k==='melee')tone('square',180,90,.1,.08);
  else if(k==='nova'){tone('sine',200,1200,.5,.12);tone('triangle',100,30,.7,.15)}
  else if(k==='swap')tone('sine',520,700,.06,.05);
  else if(k==='jump')tone('sine',240,380,.08,.03);
  else if(k==='spit')tone('sine',500,180,.15,.04);
  else if(k==='bolt')tone('square',720,300,.05,.03);
  else if(k==='shotgun'){tone('sawtooth',300,60,.18,.08);tone('square',150,40,.12,.05)}
  else if(k==='charge')tone('sine',300,1400,1.5,.03);
  else if(k==='snipe'){tone('sawtooth',1800,200,.2,.08);tone('square',400,80,.15,.05)}
  else if(k==='mortar')tone('triangle',120,60,.25,.1);
  else if(k==='ar'){tone('square',520,180,.05,.035);tone('sawtooth',220,90,.04,.02)}
  else if(k==='pistol'){tone('square',700,160,.08,.05);tone('triangle',300,80,.08,.04)}
  else if(k==='gl')tone('triangle',180,70,.22,.08);
  else if(k==='cannon')tone('sawtooth',360,200,.03,.025);
  else if(k==='reload'){tone('square',300,280,.05,.04);tone('square',500,480,.05,.04,.25)}
  else if(k==='sword'){tone('sawtooth',900,300,.25,.06);tone('sine',1600,600,.2,.04)}
  else if(k==='dry')tone('square',160,140,.03,.03);
  else if(k==='whip')tone('sawtooth',1200,200,.18,.05);
  else if(k==='beep')tone('square',1600,1600,.05,.03);
  else if(k==='rocket'){tone('sawtooth',200,90,.5,.06);tone('triangle',600,200,.3,.04)}
  else if(k==='jet')tone('sawtooth',90,160,.4,.04);
}

/* ---------- input ---------- */
const keys={};let firing=false,mvX=0,mvY=0,moveId=null,lookId=null,fireId=null,mo=null,lx=0,ly=0;
addEventListener('keydown',e=>{if(INTRO.on&&state==='playing'&&e.code!=='KeyP'){if((e.code==='Space'||e.code==='Enter')&&!e.repeat)introEnd();e.preventDefault();return}keys[e.code]=true;
  if(state==='playing'&&(e.code==='Space'||e.code==='Tab'||e.code.startsWith('Arrow')))e.preventDefault();
  if(state==='playing'&&!e.repeat){const c=e.code;if(/^Digit[1-6]$/.test(c))swap(ORDER[+c[5]-1]);else if(c==='KeyQ')swap();else if(c==='Tab')openWheel();else if(c==='KeyZ')surge(0);else if(c==='KeyC')surge(2);
    else if(c==='KeyG')grenade();else if(c==='KeyF')melee();else if(c==='KeyX')surge(1);else if(c==='KeyE')toggleVeh();else if(c==='KeyR')startReload();else if(c==='Space')jumpQ=true}
  if(e.code==='KeyP'){if(state==='playing')pause();else if(state==='paused')resume()}});
addEventListener('keyup',e=>{keys[e.code]=false;if(e.code==='Tab')closeWheel(true)});
// game controller (PS5 DualSense, Xbox and other standard-layout pads)
let padFire=false,padOn=false;const padPrev=[];
addEventListener('gamepadconnected',()=>{padOn=true;if(state!=='menu')say('Controller connected',1.5)});
function padTick(dt){let gp=null;try{const l=navigator.getGamepads?navigator.getGamepads():[];for(const g of l)if(g&&g.connected){gp=g;break}}catch(e){}
  if(!gp){if(padOn){padOn=false;padFire=false;if(moveId===null)mvX=mvY=0}return}padOn=true;
  const dz=v=>Math.abs(v)<0.15?0:(v-Math.sign(v)*0.15)/0.85,ax=i=>dz(gp.axes[i]||0),btn=i=>!!(gp.buttons[i]&&(gp.buttons[i].pressed||gp.buttons[i].value>0.4));
  const now=[];for(let i=0;i<17;i++)now[i]=btn(i);const hit=i=>now[i]&&!padPrev[i];
  if(hit(9)){if(state==='playing')pause();else if(state==='paused')resume()}
  if(INTRO.on&&state==='playing'){if(hit(0)||hit(1))introEnd();padFire=false;for(let i=0;i<17;i++)padPrev[i]=now[i];return}
  if(state!=='playing'){if(hit(0)&&!overlay.hidden){state==='paused'?resume():begin()}padFire=false;for(let i=0;i<17;i++)padPrev[i]=now[i];return}
  if(moveId===null){mvX=ax(0);mvY=ax(1)}
  if(now[4]&&!wheelOpen)openWheel();if(!now[4]&&padPrev[4]&&wheelOpen)closeWheel(true);if(wheelOpen){wx=ax(2)*140;wy=ax(3)*140;wheelAim(0,0)}
  const k=wheelOpen?0:CFG.sens*dt;yaw-=ax(2)*3.2*k;pitch=Math.max(-1.45,Math.min(1.45,pitch-ax(3)*2.4*k*(CFG.inv?-1:1)));if(ax(2)||ax(3))camIdle=0;
  padFire=now[7];
  if(hit(0))jumpQ=true;if(hit(1))melee();if(hit(2)){if(veh||vehs.some(v=>Math.hypot(v.pos.x-pos.x,v.pos.z-pos.z)<5))toggleVeh();else startReload()}if(hit(3))swap();if(hit(5)||hit(6))grenade();if(hit(11))melee();
  if(hit(14))surge(0);if(hit(12))surge(1);if(hit(15))surge(2);if(hit(13))swap();
  for(let i=0;i<17;i++)padPrev[i]=now[i]}
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;firing=false});
function lock(){if(touchUI)return;try{const p=cv.requestPointerLock();if(p&&p.catch)p.catch(()=>{})}catch(e){}}
document.addEventListener('pointerlockchange',()=>{const was=locked;locked=document.pointerLockElement===cv;if(locked)skipMove=2;
  if(was&&!locked&&state==='playing')pause();syncHint()});
const look=(dx,dy,s)=>{s*=CFG.sens;yaw-=dx*s;pitch=Math.max(-1.45,Math.min(1.45,pitch-dy*s*(CFG.inv?-1:1)))};
let skipMove=0;
document.addEventListener('mousemove',e=>{if(!locked||state!=='playing')return;if(wheelOpen){wheelAim(e.movementX,e.movementY);return}camIdle=0;if(skipMove>0){skipMove--;return}
  if(Math.abs(e.movementX)>250||Math.abs(e.movementY)>250)return;look(e.movementX,e.movementY,0.0022)});
stage.addEventListener('mousedown',e=>{if(state!=='playing'||e.target.closest('button'))return;if(!locked)lock();if(e.button===2)grenade();else firing=true});
stage.addEventListener('wheel',e=>{if(state==='playing'){e.preventDefault();swap(undefined,e.deltaY>0?1:-1)}},{passive:false});
addEventListener('mouseup',()=>{if(fireId===null)firing=false});
stage.addEventListener('contextmenu',e=>e.preventDefault());
function showTouch(){if(touchUI)return;touchUI=true;$('pad').hidden=state!=='playing';syncHint()}
stage.addEventListener('touchstart',e=>{showTouch();if(state!=='playing')return;e.preventDefault();
  const r=stage.getBoundingClientRect();
  for(const t of e.changedTouches){
    const act=t.target.dataset&&t.target.dataset.act;
    if(act){if(act==='fire'){fireId=t.identifier;firing=true}else if(act==='gren')grenade();else if(act==='melee')melee();else if(act==='swap')swap();else if(act==='jump')jumpQ=true;else if(act==='ride')toggleVeh();else if(act==='surge'){wheelOpen?closeWheel(false):openWheel();continue}else if(act==='reload')startReload();else surge();continue}
    if(t.clientX-r.left<r.width*0.45&&moveId===null){moveId=t.identifier;mo={x:t.clientX,y:t.clientY};
      const s=$('stick');s.hidden=false;s.style.left=(t.clientX-r.left)+'px';s.style.top=(t.clientY-r.top)+'px';s.firstElementChild.style.transform=''}
    else if(lookId===null){lookId=t.identifier;lx=t.clientX;ly=t.clientY}}},{passive:false});
stage.addEventListener('touchmove',e=>{if(state!=='playing')return;e.preventDefault();
  for(const t of e.changedTouches){
    if(t.identifier===moveId){let dx=(t.clientX-mo.x)/40,dy=(t.clientY-mo.y)/40;const l=Math.hypot(dx,dy);if(l>1){dx/=l;dy/=l}
      mvX=dx;mvY=dy;$('stick').firstElementChild.style.transform=`translate(${dx*26}px,${dy*26}px)`}
    else if(t.identifier===lookId){camIdle=0;look(t.clientX-lx,t.clientY-ly,0.006);lx=t.clientX;ly=t.clientY}}},{passive:false});
function tEnd(e){for(const t of e.changedTouches){
  if(t.identifier===moveId){moveId=null;mvX=mvY=0;$('stick').hidden=true}
  if(t.identifier===lookId)lookId=null;
  if(t.identifier===fireId){fireId=null;firing=false}}}
stage.addEventListener('touchend',tEnd);stage.addEventListener('touchcancel',tEnd);
function syncHint(){$('hint').hidden=!(state==='playing'&&!locked&&!touchUI)}

/* ---------- flow of play ---------- */
function setState(s){state=s;if(s!=='playing')voiceStop(s==='paused');const play=s==='playing',game=s!=='menu';overlay.hidden=play;$('hud').hidden=!game;$('radar').hidden=!game;$('cross').hidden=!game;vm.visible=game;
  if(INTRO&&INTRO.on){$('hud').hidden=true;$('radar').hidden=true;$('cross').hidden=true;vm.visible=false;$('cine').hidden=!play}
  if(FLY){$('hud').hidden=true;$('radar').hidden=true;$('fhud').hidden=!game}
  $('pad').hidden=!(play&&touchUI&&!(INTRO&&INTRO.on));if(!play){engineOff();firing=false;$('stick').hidden=true;moveId=lookId=fireId=null;mvX=mvY=0}syncHint()}
let SAVE=null,saveRef=null,saveBusy=false,NOSAVE=false,LAST={m:1,s:1},M2=0,m2Ref=null;
try{M2=Math.max(0,Math.min(3,Math.floor(+localStorage.getItem('gh9-m2'))||0))}catch(e){}
function saveM2(st){if(st<=M2)return;M2=st;try{localStorage.setItem('gh9-m2',String(M2))}catch(e){}if(m2Ref)m2Ref.set({st:M2,t:Date.now()}).catch(()=>{});syncCont()}
/* ---------- mission list: every stage can be started from the title screen. A stage jump starts a fresh run with a power-appropriate loadout and does not touch saved progress ---------- */
const MISSIONS=[{n:'Mission 1 · Thalassa Station',st:[
  {m:1,s:1,t:'Wake',d:'Commons · Rowan joins after a few kills',ready:true},{m:1,s:2,t:'Engine Deck',d:'Engineering · Colossus',ready:true},
  {m:1,s:3,t:'Hangar Two',d:'Hangar · Widow',ready:true},{m:1,s:4,t:'The Song',d:'Farms and bridge · Matriarch',ready:true}]},
 {n:'Mission 2 · Flight to Meridian Station',st:[
  {m:2,s:1,t:'Launch',d:'Shuttle · interceptors and a gunboat',ready:true},{m:2,s:2,t:'Rescue',d:'Halcyon under attack · boarding pods · dock · wingmen',ready:true},{m:2,s:3,t:'Run to Meridian',d:'500 mph · minefield · blockade · Meridian Station',ready:true}]}];
function missionsBuild(){const el=$('missions');el.innerHTML='';const n=document.createElement('p');n.textContent='Pick any stage to start it now. A stage jump does not change your saved progress.';el.appendChild(n);
  for(const M of MISSIONS){const h=document.createElement('h4');h.textContent=M.n;el.appendChild(h);
    for(const S of M.st){const b=document.createElement('button');b.type='button';const done=S.m===1?SAVE&&SAVE.wave>=S.s:M2>=S.s;b.innerHTML='<b>'+S.m+'-'+S.s+'</b>'+S.t+(done?' ✓':'')+'<span>'+(S.ready?S.d:'coming next')+'</span>';b.disabled=!S.ready;b.addEventListener('click',()=>startAt(S.m,S.s));el.appendChild(b)}}}
function startAt(m,s,skip){LAST={m,s};NOSAVE=false;
  if(m===2){begin(true);NOSAVE=true;if(skip||s>1)flyStart(s);else introStart(L2SHOTS,()=>flyStart(s),'Level 2 · Flight to Meridian Station');return}
  if(m===1){begin(s>1);if(s>1){NOSAVE=true;wave=s-1;guns=WPN.map((_,k)=>mkGun(k,Math.min(4,s-1),s));mission=null;gap=1.2;rowanJoin(true);say('Stage '+s+' · jump (not saved)',2)}}}
function validSave(o){try{if(!o||(o.v!==1&&o.v!==2))return null;const w=Math.floor(+o.wave);if(!(w>=1&&w<=999))return null;const c=Math.floor(+o.cls);if(!(c>=0&&c<=2))return null;
  if(!Array.isArray(o.guns)||(o.guns.length!==2&&o.guns.length!==6))return null;const g=WPN.map((_,k)=>({k,rar:0,pow:1}));
  for(const q of o.guns){const k=Math.floor(+q.k);if(!(k>=0&&k<6))return null;g[k]={k,rar:Math.max(0,Math.min(4,Math.floor(+q.rar)||0)),pow:Math.max(1,Math.min(999,Math.floor(+q.pow)||1))}}
  if(o.v===1){const top=Math.max(...g.map(q=>q.pow));for(const q of g)if(q.pow===1)q.pow=Math.max(1,top-1)}
  return{v:2,t:+o.t||0,done:!!o.done||w>=4,wave:w,cls:c,score:Math.max(0,Math.floor(+o.score)||0),guns:g}}catch(e){return null}}
function contM2(){return M2>0&&M2<3&&(!SAVE||SAVE.done)}
function syncCont(){missionsBuild();$('stagesBtn').hidden=state==='paused';if(state==='paused')$('missions').hidden=true;const b=$('cont');b.hidden=!(SAVE||contM2())||state==='paused';if(contM2())b.textContent='Continue · Mission 2, stage 2-'+(M2+1);else if(SAVE)b.textContent=SAVE.wave>=CAMP.length?'Continue · endless stage '+(SAVE.wave+1):'Continue · stage '+(SAVE.wave+1)+' of '+CAMP.length;
  $('saveNote').textContent=SAVE?(saveRef?'Progress is saved to your claude.ai account.':'Progress is saved in this browser.'):''}
async function saveInit(){try{const L=localStorage.getItem('gh9-save');if(L)SAVE=validSave(JSON.parse(L))}catch(e){}syncCont();
  try{if(!window.claude||!claude.use)return;const db=await claude.use('db'),u=await claude.use('user');if(!db||!u)return;const id=await u.id();if(!id)return;
    saveRef=db.doc('data/users/'+id+'/save');m2Ref=db.doc('data/users/'+id+'/m2');try{const m=await m2Ref.get();if(m.exists){const v=Math.max(0,Math.min(3,Math.floor(+m.data().st)||0));if(v>M2){M2=v;try{localStorage.setItem('gh9-m2',String(M2))}catch(e){}}}}catch(e){}const sn=await saveRef.get();if(sn.exists){const v=validSave(sn.data());if(v&&(!SAVE||v.t>=SAVE.t))SAVE=v}}catch(e){}syncCont()}
function writeSave(){if(NOSAVE)return;SAVE={v:2,t:Date.now(),wave,cls,score,done:wave>=CAMP.length,guns:guns.map(g=>({k:g.k,rar:g.rar,pow:g.pow}))};try{localStorage.setItem('gh9-save',JSON.stringify(SAVE))}catch(e){}
  if(saveRef&&!saveBusy){saveBusy=true;saveRef.set(SAVE).catch(()=>{}).finally(()=>{saveBusy=false})}}
function continueGame(){if(contM2()){startAt(2,M2+1);return}if(!SAVE)return;cls=SAVE.cls;syncCls();begin(true);wave=SAVE.wave;score=SAVE.score;bossN=Math.max(0,SAVE.wave-1);
  guns=SAVE.guns.map(q=>mkGun(q.k,q.rar,q.pow));mission=null;gap=1.5;if(wave>=1)rowanJoin(true);say('Resuming at stage '+(wave+1),2)}
$('cont').addEventListener('click',continueGame);
function begin(noIntro){NOSAVE=false;voicePrime();$('retry').hidden=true;$('missions').hidden=true;$('overlay').classList.remove('mm');const fresh=state==='menu'&&noIntro!==true;$('settings').hidden=true;$('cont').hidden=true;if(!ac){try{ac=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}
  if(ac&&ac.state==='suspended')ac.resume();reset();setState('playing');lock();if(fresh)introStart();else if(noIntro!==true)for(const[k,t]of STORY.intro)comm(k,t)}
function pause(){closeWheel(false);setState('paused');$('ovKeys').hidden=true;$('classes').hidden=true;$('loadout').hidden=true;$('superpick').hidden=true;$('ovTitle').textContent='Paused';$('ovText').textContent='The drones are holding still. For now.';$('go').textContent='Resume'}
function resume(){const c=VOICE.cur;voiceStop();$('settings').hidden=true;setState('playing');lock();if(c&&VOICE.on)speak(c.text,c.k)}
function die(){if(document.pointerLockElement)document.exitPointerLock();
  const rec=score>best;if(rec){best=score;try{localStorage.setItem('gh9-best',best)}catch(e){}$('best').textContent=best.toLocaleString()}
  setState('dead');$('classes').hidden=false;$('ovKeys').hidden=true;$('ovTitle').textContent='Deck lost';
  $('ovText').textContent=`You reached stage ${wave} and scored ${score.toLocaleString()}.`+(rec?' That is a new best.':'');
  $('go').textContent='New game';syncCont();if(FLY){$('ovTitle').textContent='Kestrel lost';$('ovText').textContent='The shuttle broke up with '+FLY.kills+' kills.';LAST={m:2,s:FLY.stage}}else LAST={m:1,s:Math.max(1,wave)};$('retry').hidden=false;$('retry').textContent='Retry stage '+LAST.m+'-'+LAST.s}
CLS.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.innerHTML='<b>'+c.n+'</b>'+c.d;
  b.addEventListener('click',()=>{cls=i;try{localStorage.setItem('gh9-class',i)}catch(e){}syncCls()});$('classes').appendChild(b)});
{const h=document.createElement('span');h.className='hd';h.textContent='PRIMARY · HEAVY';$('loadout').appendChild(h)}
for(let sl=0;sl<2;sl++)for(const k of POOL[sl]){const b=document.createElement('button');b.type='button';b.textContent=WPN[k].name;b.dataset.k=k;b.dataset.sl=sl;
  b.addEventListener('click',()=>{LOAD[sl]=k;try{localStorage.setItem('gh9-load',JSON.stringify(LOAD))}catch(e){}syncLoad()});$('loadout').appendChild(b)}
{const h=document.createElement('span');h.className='hd';h.textContent='SUPER';$('superpick').appendChild(h)}
SUPERS.forEach((q,i)=>{const b=document.createElement('button');b.type='button';b.textContent=q.n;b.title=q.d;b.dataset.i=i;
  b.addEventListener('click',()=>{SUPK=i;try{localStorage.setItem('gh9-super',i)}catch(e){}syncSup()});$('superpick').appendChild(b)});
function syncSup(){for(const b of $('superpick').querySelectorAll('button'))b.setAttribute('aria-pressed',+b.dataset.i===SUPK)}syncSup();
function syncLoad(){for(const b of $('loadout').querySelectorAll('button'))b.setAttribute('aria-pressed',LOAD[+b.dataset.sl]===+b.dataset.k)}syncLoad();
function syncCls(){[...$('classes').children].forEach((b,i)=>b.setAttribute('aria-pressed',i===cls))}syncCls();
$('go').addEventListener('click',()=>{state==='paused'?resume():begin()});
$('stagesBtn').addEventListener('click',()=>{$('missions').hidden=!$('missions').hidden;$('overlay').classList.toggle('mm',!$('missions').hidden)});
$('retry').addEventListener('click',()=>startAt(LAST.m,LAST.s,$('retry').textContent.startsWith('Retry')));
$('mute').addEventListener('click',()=>{muted=!muted;$('mute').textContent=muted?'Sound off':'Sound on';if(muted)voiceStop()});
$('mus').addEventListener('click',()=>{musOn=!musOn;$('mus').textContent=musOn?'Music on':'Music off'});
$('vox').textContent=VOICE.ok?(VOICE.on?'Voice on':'Voice off'):'No voice here';
$('vimp').addEventListener('change',e=>{vdbImport([...e.target.files]);e.target.value=''});$('vclr').addEventListener('click',vdbClear);
$('vox').addEventListener('click',()=>{if(!VOICE.ok){if(typeof speechSynthesis==='undefined')return;VOICE.ok=true;VOICE.miss=0;VOICE.on=true;$('vox').textContent='Voice on';return}VOICE.on=!VOICE.on;try{localStorage.setItem('gh9-vox',VOICE.on?'1':'0')}catch(e){}$('vox').textContent=VOICE.on?'Voice on':'Voice off';if(!VOICE.on)voiceStop()});
$('full').addEventListener('click',()=>{try{if(document.fullscreenElement)document.exitFullscreen();else{const p=stage.requestFullscreen();if(p&&p.catch)p.catch(()=>{})}}catch(e){}});

/* ---------- vehicles ---------- */
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
addVeh('car',0,-130,0);addVeh('car',80,185,Math.PI);addVeh('plane',-72,225,Math.PI);addVeh('plane',72,225,Math.PI);
function engineOff(){if(eng){try{eng.o.stop()}catch(e){}eng=null}}
function engineOn(){if(!ac||eng)return;try{const o=ac.createOscillator(),g=ac.createGain();o.type='sawtooth';o.frequency.value=50;g.gain.value=0;o.connect(g).connect(ac.destination);o.start();eng={o,g}}catch(e){}}
function toggleVeh(){if(FLY)return;if(state!=='playing'||cineT>0)return;
  if(veh){const v=veh;veh=null;engineOff();pos.set(v.pos.x+Math.cos(v.h)*2.4,Math.max(0,v.pos.y-v.r),v.pos.z-Math.sin(v.h)*2.4);vy=0;pitch=0;if(v.kind==='car')v.v*=0.3;sfx('swap');return}
  let b=null,bd=5;for(const v of vehs){const d=Math.hypot(v.pos.x-pos.x,v.pos.y-v.r-pos.y,v.pos.z-pos.z);if(d<bd){bd=d;b=v}}
  if(b){if(!seenVeh[b.kind]){seenVeh[b.kind]=1;comm('R',b.kind==='car'?"That rover belongs to the agri crew. Try not to drive through my seedbeds.":"You can fly a skiff? Head for the open air and keep your speed up.")}veh=b;yaw=b.h;pitch=b.kind==='car'?-0.12:0;camIdle=9;sfx('swap');say(b.kind==='car'?'Rover':'Skiff',1)}}
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
    const deck=inHull(p.x,p.z),onG=deck&&p.y<=v.r+0.02;
    v.thr=Math.max(0,Math.min(1,v.thr+f*0.7*dt));if(keys.Space)v.thr=Math.max(0,v.thr-1.5*dt);
    const tgt=v.thr*(boost?85:62);v.v+=(tgt-v.v)*Math.min(1,dt*(tgt>v.v?0.9:0.6));if(onG&&v.thr<0.05)v.v=Math.max(0,v.v-9*dt);
    yaw-=s*1.1*dt;let tp=pitch;if(onG)tp=v.v>21?Math.max(0,tp):0;
    const dh=ad(yaw,v.h),hr=(onG?Math.min(1,v.v/12):1)*1.7*dt;v.h+=Math.max(-hr,Math.min(hr,dh));
    v.p+=Math.max(-1.5*dt,Math.min(1.5*dt,tp-v.p));v.roll+=((onG?0:c1(dh*1.6)*0.9)-v.roll)*Math.min(1,dt*4);
    const cp=Math.cos(v.p),ox=p.x,oy=p.y,oz=p.z;p.x+=-Math.sin(v.h)*cp*v.v*dt;p.y+=Math.sin(v.p)*v.v*dt;p.z+=-Math.cos(v.h)*cp*v.v*dt;
    if(!onG&&v.v<17)p.y-=(17-v.v)*0.9*dt;
    const bx=p.x,by=p.y,bz=p.z;pushOut(p,v.r,true);if(Math.abs(p.x-bx)+Math.abs(p.y-by)+Math.abs(p.z-bz)>1e-4){v.v*=0.75;if(!reduced)shake=Math.max(shake,0.12)}
    if(inHull(p.x,p.z)&&p.y<v.r){if(oy>=v.r-0.3){p.y=v.r;if(v.p<0)v.p*=0.5}else{p.x=ox;p.y=oy;p.z=oz;v.v*=0.5}}
    const LIM=A+700;if(Math.abs(p.x)>LIM||Math.abs(p.z)>LIM||p.y>450||p.y<-120){p.x=Math.max(-LIM,Math.min(LIM,p.x));p.z=Math.max(-LIM,Math.min(LIM,p.z));p.y=Math.max(-120,Math.min(450,p.y));if(msgT<=0)say('Edge of the airspace',1.2)}
    for(const e of enemies)if(!e.dying&&e.type!==3&&e.pos.distanceTo(p)<e.r+2.4)damage(e,12);
    v.g.rotation.set(v.p,v.h,v.roll)}
  jumpQ=false;pos.set(p.x,p.y-v.r,p.z);eye.set(p.x,p.y+0.4,p.z);vy=0;ground=true;
  if(!eng)engineOn();if(eng){eng.o.frequency.value=45+Math.abs(v.v)*(car?3:2.4);eng.g.gain.value=muted?0:0.03*CFG.vol}}
function idleVehs(dt){for(const v of vehs){if(v===veh)continue;const p=v.pos;
  if(v.kind==='car'){if(v.v){v.v*=Math.max(0,1-3*dt);if(Math.abs(v.v)<0.3)v.v=0;p.x+=-Math.sin(v.h)*v.v*dt;p.z+=-Math.cos(v.h)*v.v*dt;pushOut(p,v.r)}}
  else{const deck=inHull(p.x,p.z);
    if(!deck||p.y<v.r-0.5){v.lost+=dt;p.y-=20*dt;if(v.lost>3)homeVeh(v)}
    else if(p.y>v.r+0.01||v.v>0.1){v.vy-=19*dt;v.v*=Math.max(0,1-0.8*dt);p.x+=-Math.sin(v.h)*v.v*dt;p.z+=-Math.cos(v.h)*v.v*dt;p.y+=v.vy*dt;pushOut(p,v.r);
      if(p.y<=v.r+1e-3){v.vy=0;v.p*=0.8;v.roll*=0.8;v.v*=Math.max(0,1-4*dt)}v.g.rotation.set(v.p,v.h,v.roll)}}}}

/* ---------- view model ---------- */
const vm=new T.Group();vm.scale.setScalar(0.19);cam.add(vm);vm.visible=false;
const arcG=new T.Group(),lanG=new T.Group();vm.add(arcG,lanG);
const emitMat=bas({color:0x50cdc3});
MAT.glove=std({color:0x1b2428,roughness:.85});MAT.sleeve=std({color:0x2f5560,roughness:.6,metalness:.3});
const reticleMat=bas({color:0x8fe6ff,transparent:true,opacity:.9,depthWrite:false,blending:T.AdditiveBlending});
// first-person pieces: every box becomes a bevelled one at its real size, so edges catch the light
const VK=fn=>inst(bake(a=>fn((geo,mat,sx,sy,sz,...r)=>geo===GEO.box&&Math.min(sx,sy,sz)>.012?a(cbox(sx,sy,sz,Math.min(.022,Math.min(sx,sy,sz)*.22)),mat,1,1,1,...r):a(geo,mat,sx,sy,sz,...r))),false);
let VMS=null;function armsKit(a,fgz){const CM=charMats(),P=VMS||(VMS=(()=>{const m=CM.plate[7].clone();m.color.setHex(0x7d8488).convertSRGBToLinear();m.roughness=.55;m.envMapIntensity=.2;return m})()),J2=CM.joint,G=MAT.glove,AM=MAT.amber;
  // right hand around the grip: palm, three finger rows, thumb, knuckle plate, wrist cuff, armoured sleeve
  a(GEO.box,G,.11,.12,.12,.02,-.21,.25);for(let i=0;i<3;i++)a(GEO.box,G,.1,.032,.045,.0,-.165-i*.036,.185);a(GEO.box,G,.04,.09,.1,-.06,-.17,.2,0,0,.15);
  a(GEO.box,P,.035,.1,.1,.08,-.2,.24);a(GEO.box,J2,.12,.06,.12,.04,-.27,.29,.5,0,0);a(GEO.box,P,.145,.12,.16,.045,-.33,.34,.5,0,0);a(GEO.box,J2,.11,.1,.2,.05,-.38,.45,.5,0,0);a(GEO.box,AM,.006,.02,.07,.119,-.33,.34,.5,0,0);
  // left hand under the front grip
  a(GEO.box,G,.13,.08,.15,-.02,-.15,fgz);for(let i=0;i<3;i++)a(GEO.box,G,.035,.075,.04,.07,-.1,fgz-.045+i*.045);a(GEO.box,P,.03,.07,.12,-.09,-.15,fgz);
  a(GEO.box,P,.13,.12,.15,-.06,-.21,fgz+.12,.2,.4,0);a(GEO.box,J2,.1,.09,.2,-.1,-.24,fgz+.22,.2,.4,0)}
// Arc Welder: a compact energy auto-rifle with a spinning coil barrel
arcG.add(VK(a=>{const G=MAT.gun,D=MAT.gunD,AM=MAT.amber;
  a(GEO.box,G,.17,.19,.5,0,0,.08);a(GEO.box,D,.19,.06,.46,0,.12,.06);for(let i=0;i<7;i++)a(GEO.box,D,.05,.02,.035,0,.16,-.12+i*.055);
  a(GEO.box,G,.16,.1,.18,0,.06,-.22,-.35,0,0);a(GEO.box,G,.12,.13,.3,0,0,-.33);
  for(const s of[-1,1]){a(GEO.box,AM,.006,.03,.34,s*.087,-.02,.1);for(let i=0;i<4;i++)a(GEO.box,D,.006,.09,.02,s*.087,.03,.14+i*.04);for(let i=0;i<3;i++)a(GEO.box,D,.005,.07,.05,s*.062,0,-.28-i*.07)}
  a(GEO.box,D,.13,.04,.3,0,-.09,-.33);a(GEO.cyl,D,.032,.5,.032,0,.01,-.62,1.571,0,0);a(GEO.cyl,D,.05,.09,.05,0,.01,-.86,1.571,0,0);for(const s of[-1,1])a(GEO.box,D,.02,.05,.06,s*.05,.01,-.86);
  a(GEO.box,D,.1,.2,.12,0,-.19,-.04,.25,0,0);a(GEO.box,D,.08,.24,.11,0,-.2,.24,-.3,0,0);a(GEO.box,D,.02,.02,.14,0,-.11,.13);a(GEO.box,D,.02,.07,.02,0,-.145,.07);
  a(GEO.box,G,.1,.12,.16,0,-.02,.37);a(GEO.box,D,.11,.04,.14,0,-.1,.38);
  a(GEO.box,D,.07,.05,.13,0,.18,0);for(const s of[-1,1])a(GEO.box,D,.012,.08,.012,s*.045,.24,-.04);a(GEO.box,D,.1,.012,.012,0,.28,-.04);a(GEO.box,AM,.03,.015,.04,0,.2,.06);
  armsKit(a,-.3)}));
const arcSpin=new T.Group();arcSpin.position.set(0,.01,-.62);arcG.add(arcSpin);
arcSpin.add(VK(a=>{for(let i=0;i<4;i++)a(GEO.tor,emitMat,.065,.065,.065,0,0,-.12+i*.07);for(let i=0;i<6;i++){const r=i/6*6.283;a(GEO.box,MAT.gunD,.012,.05,.26,Math.cos(r)*.07,Math.sin(r)*.07,0,0,0,r)}}));
arcG.add(VK(a=>a(GEO.box,emitMat,.104,.14,.02,0,-.19,.02,.25,0,0)),mesh(GEO.ring,reticleMat,.03,.03,.03,0,.24,-.04));
// Briar Lance: a living precision rail with twin prongs, capacitor vials and a vine grown through the frame
lanG.add(VK(a=>{const G=MAT.lance,D=MAT.gunD;
  a(GEO.box,G,.15,.18,.46,0,0,.12);a(GEO.box,D,.17,.05,.6,0,.11,.02);a(GEO.box,D,.08,.2,.1,0,-.18,-.02,.15,0,0);a(GEO.box,D,.08,.24,.11,0,-.2,.26,-.3,0,0);a(GEO.box,D,.02,.02,.14,0,-.11,.15);
  a(GEO.box,G,.1,.13,.16,0,-.02,.37);a(GEO.box,D,.11,.05,.12,0,.04,.38);a(GEO.box,G,.13,.1,.2,0,0,-.18);
  a(GEO.cyl,D,.045,.34,.045,0,.2,.04,1.571,0,0);a(GEO.cyl,D,.058,.07,.058,0,.2,-.15,1.571,0,0);a(GEO.cyl,D,.052,.06,.052,0,.2,.21,1.571,0,0);for(const z of[-.06,.12])a(GEO.box,D,.04,.07,.04,0,.15,z);
  for(let i=0;i<9;i++){const t=i/8,an=t*9;a(GEO.ico,i%2?MAT.leaf:MAT.leafD,.035,.03,.05,Math.cos(an)*.1,Math.sin(an)*.11,.32-t*.62,0,an,0)}
  for(let i=0;i<5;i++){const an=i*1.9;a(GEO.cone,MAT.leafD,.012,.06,.012,Math.cos(an)*.12,Math.sin(an)*.12,.25-i*.12,0,0,an-1.571)}
  for(let i=0;i<3;i++){a(GEO.cyl,MAT.cell,.028,.1,.028,.09,-.02,.2-i*.1);a(GEO.cyl,D,.032,.02,.032,.09,.04,.2-i*.1);a(GEO.cyl,D,.032,.02,.032,.09,-.08,.2-i*.1)}
  armsKit(a,-.12)}));
const lanTop=J(lanG,0,.055,0),lanBot=J(lanG,0,-.055,0);
for(const[j,s]of[[lanTop,1],[lanBot,-1]])j.add(VK(a=>{a(GEO.box,MAT.lance,.05,.05,.7,0,0,-.6);a(GEO.cone,MAT.amber,.03,.12,.03,0,0,-1.0,-1.571,0,0);a(GEO.box,MAT.gunD,.07,.02,.12,0,s*.03,-.38)}));
const lanCore=mesh(GEO.box,MAT.cell,.02,.04,.66,0,0,-.58);lanG.add(lanCore,mesh(GEO.ring,reticleMat,.045,.045,.045,0,.2,-.19));
MAT.gunL=std({color:0xaab4b8,roughness:.38,metalness:.55});
MAT.gunO=std({color:0xd0702e,roughness:.45,metalness:.3});
// worn metal: fine scratches and grime on every gun material (first person and props)
{const wt=paint(256,(g,S)=>{g.fillStyle='#f0f0f0';g.fillRect(0,0,S,S);grime(g,S,1800,.05);for(let k=0;k<70;k++){const x=hash(k,31)*S,y=hash(k,32)*S,an=hash(k,33)*6.28,l=4+hash(k,34)*22;g.strokeStyle=k%3?'rgba(255,255,255,.18)':'rgba(0,0,0,.14)';g.lineWidth=.7;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(an)*l,y+Math.sin(an)*l);g.stroke()}
    for(let k=0;k<8;k++){g.fillStyle='rgba(0,0,0,'+(.02+hash(k,35)*.04)+')';g.beginPath();g.arc(hash(k,36)*S,hash(k,37)*S,8+hash(k,38)*30,0,7);g.fill()}});
  wt.repeat.set(3,3);const wn=normalMap(wt,2);wn.wrapS=wn.wrapT=T.RepeatWrapping;wn.repeat.copy(wt.repeat);
  for(const m of[MAT.gun,MAT.gunD,MAT.gunL,MAT.gunO,MAT.lance]){m.map=wt;m.normalMap=wn;m.normalScale=new T.Vector2(.6,.6);m.roughness=Math.min(.75,m.roughness+.15);m.envMapIntensity=.2;m.needsUpdate=true}}
// Rook Rifle: light plated assault rifle, rail, holo sight, vented handguard, separate magazine
const arG=new T.Group();vm.add(arG);
arG.add(VK(a=>{const L=MAT.gunL,D=MAT.gunD,O=MAT.gunO;a(GEO.box,L,.15,.17,.56,0,0,.06);a(GEO.box,D,.13,.08,.5,0,-.11,.08);a(GEO.box,D,.16,.035,.7,0,.105,-.04);
  for(let i=0;i<12;i++)a(GEO.box,D,.17,.02,.025,0,.13,-.36+i*.06);a(GEO.box,L,.13,.13,.42,0,-.01,-.42);for(let i=0;i<5;i++)for(const s of[-1,1])a(GEO.box,D,.006,.05,.05,s*.066,-.01,-.28-i*.075);
  a(GEO.box,O,.135,.03,.4,0,.055,-.42);a(GEO.cyl,D,.028,.3,.028,0,0,-.74,1.571,0,0);a(GEO.box,D,.07,.07,.11,0,0,-.9);for(const s of[-1,1])a(GEO.box,D,.075,.02,.06,0,s*.025,-.9);
  a(GEO.box,D,.09,.2,.11,0,-.22,.2,-.3,0,0);a(GEO.box,D,.11,.11,.24,0,-.03,.45);a(GEO.box,L,.1,.17,.08,0,-.04,.56);a(GEO.box,D,.05,.06,.1,0,.16,-.02);
  a(GEO.box,D,.09,.08,.012,0,.21,-.06);a(GEO.box,D,.09,.08,.012,0,.21,.02);a(GEO.box,D,.01,.08,.09,-.045,.21,-.02);a(GEO.box,D,.01,.08,.09,.045,.21,-.02);
  a(GEO.box,D,.03,.03,.05,.08,.03,.1);a(GEO.box,D,.06,.1,.04,0,-.14,-.5);armsKit(a,-.42)}));
const arMag=J(arG,0,-.17,-.06);arMag.add(VK(a=>{a(GEO.box,MAT.gunD,.07,.26,.12,0,-.1,0,.18,0,0);a(GEO.box,MAT.gunO,.072,.03,.122,0,-.21,-.02,.18,0,0)}));
arG.add(mesh(GEO.ring,reticleMat,.025,.025,.025,0,.21,-.02));
// Wren Sidearm: compact plated pistol with a serrated slide, held two-handed
const piG=new T.Group();vm.add(piG);
piG.add(VK(a=>{const L=MAT.gunL,D=MAT.gunD,O=MAT.gunO;a(GEO.box,L,.12,.09,.48,0,.06,-.06);for(let i=0;i<6;i++)for(const s of[-1,1])a(GEO.box,D,.004,.06,.012,s*.061,.06,.12-i*.025);
  a(GEO.box,O,.124,.015,.3,0,.105,-.12);a(GEO.box,D,.11,.07,.4,0,-.02,-.04);a(GEO.box,D,.1,.24,.12,0,-.17,.12,-.25,0,0);a(GEO.box,D,.03,.06,.07,0,-.09,0);
  a(GEO.cyl,D,.022,.06,.022,0,.06,-.33,1.571,0,0);a(GEO.box,D,.02,.03,.02,0,.12,-.26);a(GEO.box,D,.05,.03,.02,0,.12,.14);a(GEO.box,O,.02,.02,.015,0,.14,.14);
  a(GEO.box,MAT.glove,.11,.12,.13,.02,-.21,.18);a(GEO.box,MAT.glove,.11,.1,.12,-.07,-.19,.15);a(GEO.box,MAT.sleeve,.13,.12,.14,.04,-.31,.26,.5,0,0);a(GEO.box,MAT.sleeve,.12,.11,.14,-.1,-.3,.25,.4,.3,0)}));
const piMag=J(piG,0,-.27,.15);piMag.add(VK(a=>a(GEO.box,MAT.gunD,.085,.06,.1,0,-.02,0,-.25,0,0)));
// Mule Launcher: drum-fed grenade launcher with a fat tube and foregrip
const glG=new T.Group();vm.add(glG);
glG.add(VK(a=>{const L=MAT.gunL,D=MAT.gunD,O=MAT.gunO;a(GEO.box,D,.14,.15,.5,0,0,.15);a(GEO.cyl,L,.075,.62,.075,0,.05,-.4,1.571,0,0);a(GEO.cyl,D,.085,.08,.085,0,.05,-.72,1.571,0,0);
  a(GEO.cyl,O,.08,.03,.08,0,.05,-.62,1.571,0,0);a(GEO.box,D,.03,.1,.5,0,.15,-.3);a(GEO.box,D,.1,.22,.12,0,-.2,.25,-.3,0,0);a(GEO.box,D,.08,.16,.08,0,-.14,-.42);
  a(GEO.box,L,.12,.13,.2,0,0,.48);a(GEO.box,D,.06,.06,.12,0,.21,-.05);for(const s of[-1,1])a(GEO.box,O,.006,.05,.3,s*.072,0,.15);armsKit(a,-.42)}));
const glDrum=J(glG,0,-.02,-.08);glDrum.add(VK(a=>{a(GEO.cyl,MAT.gunD,.17,.26,.17,0,0,0,1.571,0,0);for(let i=0;i<6;i++){const r=i/6*6.283;a(GEO.cyl,MAT.gunO,.04,.27,.04,Math.cos(r)*.11,Math.sin(r)*.11,0,1.571,0,0)}}));
// Harrow Cannon: six-barrel rotary cannon with a carry handle and side ammo box
const caG=new T.Group();vm.add(caG);caG.scale.setScalar(.8);caG.position.set(.01,.01,-.08);
caG.add(VK(a=>{const L=MAT.gunL,D=MAT.gunD,O=MAT.gunO;a(GEO.box,L,.22,.22,.46,0,0,.12);a(GEO.box,O,.225,.04,.3,0,.08,.12);a(GEO.cyl,D,.12,.12,.12,0,0,-.16,1.571,0,0);
  a(GEO.box,D,.06,.03,.3,0,.2,.05);a(GEO.box,D,.04,.1,.04,0,.14,-.08);a(GEO.box,D,.04,.1,.04,0,.14,.18);a(GEO.box,D,.1,.22,.12,0,-.22,.28,-.3,0,0);
  for(let i=0;i<4;i++)a(GEO.box,D,.23,.01,.06,0,-.06+i*.04,.3);armsKit(a,-.18)}));
const caSpin=J(caG,0,0,-.2);caSpin.add(VK(a=>{for(let i=0;i<6;i++){const r=i/6*6.283;a(GEO.cyl,MAT.gunD,.022,.62,.022,Math.cos(r)*.06,Math.sin(r)*.06,-.3,1.571,0,0)}
  a(GEO.cyl,MAT.gunD,.1,.03,.1,0,0,-.42,1.571,0,0);a(GEO.cyl,MAT.gunD,.1,.03,.1,0,0,-.58,1.571,0,0);a(GEO.cyl,MAT.gunO,.1,.015,.1,0,0,-.5,1.571,0,0)}));
const caBox=J(caG,-.17,-.06,.12);caBox.add(VK(a=>{a(GEO.box,MAT.gunD,.12,.18,.22);a(GEO.box,MAT.gunO,.122,.03,.222,0,.06,0)}));
// energy blade summoned by the Arc Welder's melee
const swordG=new T.Group();vm.add(swordG);swordG.visible=false;
swordG.add(VK(a=>{a(GEO.box,MAT.gunD,.05,.05,.24,0,0,.14);a(GEO.box,MAT.gunO,.16,.04,.04,0,0,.02);a(GEO.box,MAT.glove,.11,.12,.13,0,-.04,.18);a(GEO.box,MAT.sleeve,.13,.12,.16,.02,-.12,.3,.5,0,0)}));
{const bm=bas({color:0xff8a3a,transparent:true,opacity:.95,blending:T.AdditiveBlending,depthWrite:false});swordG.add(mesh(GEO.box,bm,.035,.1,1.5,0,0,-.75),mesh(GEO.box,bas({color:0xfff0d0}),.014,.03,1.48,0,0,-.75),glow(0xff8a3a,1.4,.6))}
WPN[5].mz=-.84*.8-.08;const VMG=[arcG,lanG,arG,piG,glG,caG],MAGP={2:arMag,3:piMag,4:glDrum,5:caBox},MAGY={2:-.17,3:-.27,4:-.02,5:-.06};
const muzzle=new T.Object3D();muzzle.position.set(0,.01,-.92);vm.add(muzzle);
const mfl=new T.PointLight(0x9fefff,0,7,2);cam.add(mfl);const mglow=glow(0xdffcff,0.9,0.6);mglow.position.set(0,0.01,-0.94);mglow.visible=false;vm.add(mglow);
const beamMat=bas({color:0xc9fbff,fog:false,blending:T.AdditiveBlending,transparent:true,depthWrite:false}),beam=mesh(GEO.box,beamMat,1,1,1);beam.visible=false;scene.add(beam);

/* ---------- ragdolls: limbs on cannon.js bodies, colliding only with the floor and nearby walls ---------- */
const CN=window.CANNON||null;let PW=null;const CORPSES=[],STAT=new Map(),_bx=new T.Box3(),_bv=new T.Vector3(),_bq=new T.Quaternion();
let MAT_ST=null,MAT_BODY=null;
function physWorld(){if(PW||!CN)return PW;PW=new CN.World();PW.gravity.set(0,-26,0);PW.broadphase=new CN.NaiveBroadphase();PW.solver.iterations=12;PW.allowSleep=true;
  MAT_ST=new CN.Material('static');MAT_BODY=new CN.Material('body');PW.addContactMaterial(new CN.ContactMaterial(MAT_ST,MAT_BODY,{friction:.75,restitution:.02}));
  PW.defaultContactMaterial.friction=.6;PW.defaultContactMaterial.restitution=.02;
  const g=new CN.Body({mass:0,material:MAT_ST,collisionFilterGroup:1,collisionFilterMask:2});g.addShape(new CN.Plane());g.quaternion.setFromAxisAngle(new CN.Vec3(1,0,0),-Math.PI/2);PW.addBody(g);return PW}
function addStatics(x,z){const out=[];for(const b of nearList(x-7,z-7,x+7,z+7)){let st=STAT.get(b);
    if(!st){const body=new CN.Body({mass:0,material:MAT_ST,collisionFilterGroup:1,collisionFilterMask:2});body.addShape(new CN.Box(new CN.Vec3((b.hi[0]-b.lo[0])/2,(b.hi[1]-b.lo[1])/2,(b.hi[2]-b.lo[2])/2)));
      body.position.set((b.lo[0]+b.hi[0])/2,(b.lo[1]+b.hi[1])/2,(b.lo[2]+b.hi[2])/2);PW.addBody(body);st={body,n:0};STAT.set(b,st)}st.n++;out.push(b)}return out}
function dropStatics(list){for(const b of list){const st=STAT.get(b);if(st&&--st.n<=0){PW.removeBody(st.body);STAT.delete(b)}}}
// the box of a body part: visible solid meshes only (glow sprites and hidden jet flames used to make the torso two metres tall, so corpses stood up like pillars)
const _bx2=new T.Box3();function meshBox(o,box){if(!o.visible)return;if(o.isMesh&&o.geometry){if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();_bx2.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld);box.union(_bx2)}for(const c of o.children)meshBox(c,box)}
// measured in the part's own rotated frame, so a part that is tilted when it dies does not get an oversized box
const _pbI=new T.Matrix4(),_pbM=new T.Matrix4(),_pbS=new T.Vector3();function meshBoxL(o,box){if(!o.visible)return;if(o.isMesh&&o.geometry){if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();_pbM.multiplyMatrices(_pbI,o.matrixWorld);_bx2.copy(o.geometry.boundingBox).applyMatrix4(_pbM);box.union(_bx2)}for(const c of o.children)meshBoxL(c,box)}
function partBody(obj,dens,vel){obj.updateMatrixWorld(true);_bx.makeEmpty();_pbI.copy(obj.matrixWorld).invert();meshBoxL(obj,_bx);let c,sz;
  if(_bx.isEmpty()){_bx.setFromObject(obj);c=_bx.getCenter(new T.Vector3());sz=_bx.getSize(new T.Vector3())}
  else{c=_bx.getCenter(new T.Vector3()).applyMatrix4(obj.matrixWorld);obj.getWorldScale(_pbS);sz=_bx.getSize(new T.Vector3()).multiply(_pbS);sz.set(Math.abs(sz.x),Math.abs(sz.y),Math.abs(sz.z))}obj.getWorldQuaternion(_bq);obj.getWorldPosition(_bv);
  const hx=Math.max(.08,sz.x*.45),hy=Math.max(.08,sz.y*.45),hz=Math.max(.08,sz.z*.45),mass=Math.max(1.2,Math.min(60,8*hx*hy*hz*dens*1000));
  const body=new CN.Body({mass,material:MAT_BODY,collisionFilterGroup:2,collisionFilterMask:1,linearDamping:.04,angularDamping:.6});body.addShape(new CN.Box(new CN.Vec3(hx,hy,hz)));
  body.allowSleep=true;body.sleepSpeedLimit=.35;body.sleepTimeLimit=.35;
  body.position.set(c.x,c.y,c.z);body.quaternion.set(_bq.x,_bq.y,_bq.z,_bq.w);body.velocity.set(vel.x,vel.y,vel.z);
  body.angularVelocity.set((Math.random()-.5)*.6,(Math.random()-.5)*.6,(Math.random()-.5)*.6);const off=_bv.clone().sub(c).applyQuaternion(_bq.clone().invert());PW.addBody(body);return{b:body,obj,off}}
function freeCorpse(C){for(const p of C.parts)PW.removeBody(p.b);for(const c of C.cons)PW.removeConstraint(c);for(const o of C.objs)scene.remove(o);dropStatics(C.stat)}
function ragdoll(e){if(!physWorld())return;try{const dir=new T.Vector3(e.pos.x-eye.x,0,e.pos.z-eye.z).normalize(),boom=e.lastEl===2,vel=new T.Vector3(dir.x*1.2,0,dir.z*1.2);
  for(const[o,m]of e.parts)o.material=m;if(e.shell){e.g.remove(e.shell);e.shell=null}if(e.aim)e.aim.visible=false;
  const C={parts:[],cons:[],t:e.type===3?14:10,objs:[],stat:addStatics(e.pos.x,e.pos.z),thud:0,h0:e.pos.y},S=e.rig&&e.rig.segs,RG=e.rig&&e.rig.rag,heavy=e.type===6?1.6:e.type===7?.8:1;
  if(RG){// bosses: every jointed part becomes a body pinned to its parent part at the joint; the hull and anything bolted to it is one heavy core
    e.g.updateMatrixWorld(true);const set=new Set(RG),par=new Map(),jw=new Map(),up=new Map();
    for(const o of RG){let p=o.parent;while(p&&p!==e.g&&!set.has(p))p=p.parent;par.set(o,set.has(p)?p:null);jw.set(o,o.getWorldPosition(new T.Vector3()));up.set(o,new T.Vector3(0,1,0).applyQuaternion(o.getWorldQuaternion(new T.Quaternion())))}
    const core=new T.Group();e.g.getWorldPosition(core.position);e.g.getWorldQuaternion(core.quaternion);scene.add(core);
    for(const o of RG)scene.attach(o);for(const c of[...e.g.children])core.attach(c);scene.remove(e.g);
    const B=new Map(),cq=partBody(core,1.2,vel);B.set(null,cq);C.parts.push(cq);C.objs.push(core);
    for(const o of RG){const q=partBody(o,.7,vel);B.set(o,q);C.parts.push(q);C.objs.push(o)}
    for(const o of RG){const P=B.get(par.get(o)),Q=B.get(o),w=jw.get(o),v=new CN.Vec3(w.x,w.y,w.z),u=up.get(o),U=new CN.Vec3(u.x,u.y,u.z);
      const c=CN.ConeTwistConstraint?new CN.ConeTwistConstraint(P.b,Q.b,{pivotA:P.b.pointToLocalFrame(v),pivotB:Q.b.pointToLocalFrame(v),axisA:P.b.quaternion.inverse().vmult(U),axisB:Q.b.quaternion.inverse().vmult(U),angle:.9,twistAngle:.4,maxForce:1e7})
        :new CN.PointToPointConstraint(P.b,P.b.pointToLocalFrame(v),Q.b,Q.b.pointToLocalFrame(v));PW.addConstraint(c);C.cons.push(c)}
    const K=cq.b;K.applyImpulse(new CN.Vec3(dir.x*3*K.mass,2*K.mass,dir.z*3*K.mass),new CN.Vec3(K.position.x,K.position.y+1.5,K.position.z));K.angularVelocity.set(dir.z*1.2,(Math.random()-.5)*.6,-dir.x*1.2);
    for(const q of C.parts){q.b.allowSleep=false;q.b.angularDamping=.2;q.b.linearDamping=.03;if(q!==cq)q.b.applyImpulse(new CN.Vec3((Math.random()-.5)*4*q.b.mass,2*q.b.mass,(Math.random()-.5)*4*q.b.mass),q.b.position)}
    PFX.boom(e.pos,3.2);PFX.emit(o=>{core.getWorldPosition(o);o.y+=1;return true},{rate:18,dur:13,fs:[1.6,4.5],ss:[3,11],spread:3,fup:3,sup:2,slife:4.5,far:320});
    for(const o2 of RG.slice(0,3))PFX.emit(o=>{o2.getWorldPosition(o);return true},{rate:6,dur:8,fire:false,ss:[1.5,6],far:250,c0:.1,c1:.35});
    sfx('boom');shake=Math.max(shake,reduced?0:.4);for(let k=0;k<3;k++)sparkle(new T.Vector3(e.pos.x+(Math.random()-.5)*4,e.pos.y+(Math.random()-.5)*2,e.pos.z+(Math.random()-.5)*4),[0xffb238,0xff8a3a,0xffffff][k],24,9)}
  else if(S){const list=[S.head,S.arms[0][1],S.arms[1][1],S.legs[0][1],S.legs[1][1],S.gun,S.arms[0][0],S.arms[1][0],S.legs[0][0],S.legs[1][0],S.tor,S.pel].filter(Boolean);
    e.g.updateMatrixWorld(true);const jw=new Map(),up=new Map();for(const o of list){jw.set(o,o.getWorldPosition(new T.Vector3()));up.set(o,new T.Vector3(0,1,0).applyQuaternion(o.getWorldQuaternion(new T.Quaternion())))}
    for(const o of list)scene.attach(o);
    const B=new Map();for(const o of list){const q=partBody(o,(o===S.gun?.35:o===S.tor?1.1:.9)*heavy,vel);B.set(o,q);C.parts.push(q);C.objs.push(o)}
    const link=(a,b,ang,tw)=>{const P=B.get(a),Q=B.get(b);if(!P||!Q)return;const w=jw.get(b),v=new CN.Vec3(w.x,w.y,w.z),u=up.get(b),U=new CN.Vec3(u.x,u.y,u.z);
      const qa=P.b.quaternion.inverse(),qb=Q.b.quaternion.inverse();
      const c=CN.ConeTwistConstraint?new CN.ConeTwistConstraint(P.b,Q.b,{pivotA:P.b.pointToLocalFrame(v),pivotB:Q.b.pointToLocalFrame(v),axisA:qa.vmult(U),axisB:qb.vmult(U),angle:ang,twistAngle:tw,maxForce:1e6})
        :new CN.PointToPointConstraint(P.b,P.b.pointToLocalFrame(v),Q.b,Q.b.pointToLocalFrame(v));PW.addConstraint(c);C.cons.push(c)};
    link(S.tor,S.head,.5,.3);for(const[sh,el]of S.arms){link(S.tor,sh,1.3,.5);link(sh,el,1.2,.2)}link(S.tor,S.pel,.7,.3);for(const[h,k]of S.legs){link(S.pel,h,1.3,.3);link(h,k,1.4,.1)}
    // one shove at the torso from the hit direction; explosions throw harder
    const T0=B.get(S.tor).b,imp=(boom?9:2.4)*T0.mass;T0.applyImpulse(new CN.Vec3(dir.x*imp,(boom?4:.1)*T0.mass,dir.z*imp),new CN.Vec3(T0.position.x,T0.position.y+.4,T0.position.z));
    T0.angularVelocity.set(dir.z*(boom?4:1.8),(Math.random()-.5)*(boom?2:.8),-dir.x*(boom?4:1.8));
    for(const[h,k]of S.legs){const K=B.get(k).b,H=B.get(h).b,sd=(Math.random()-.5)*1.5,kk=boom?3:1;K.applyImpulse(new CN.Vec3((-dir.x*kk+dir.z*sd*.5)*K.mass,0,(-dir.z*kk-dir.x*sd*.5)*K.mass),K.position);H.applyImpulse(new CN.Vec3(-dir.x*1.2*H.mass,0,-dir.z*1.2*H.mass),H.position)}
    for(const q of C.parts){q.b.allowSleep=false;q.b.angularDamping=.12;q.b.linearDamping=.02}
    {const tor=S.tor;PFX.emit(o=>{tor.getWorldPosition(o);return true},{rate:boom||e.lastEl===2?10:5,dur:boom||e.lastEl===2?4:2.4,fire:boom||e.lastEl===2,fs:[.35,1],ss:[.5,2.4],slife:2.2,sup:1.1,flife:.5,c0:.18,c1:.45,alpha:.5,far:120})}
    if(S.gun){const G=B.get(S.gun);if(G)G.b.applyImpulse(new CN.Vec3(dir.x*2,1.5,dir.z*2),G.b.position)}
    scene.remove(e.g)}
  else{{const g0=e.g;PFX.emit(o=>{g0.getWorldPosition(o);return true},{rate:9,dur:2.8,fs:[.3,.9],ss:[.5,2.4],slife:2.2,sup:1,flife:.45,c0:.14,c1:.4,alpha:.55,far:140})}const q=partBody(e.g,e.type===9?2.2:.8,vel);q.b.applyImpulse(new CN.Vec3(dir.x*(boom?8:3)*q.b.mass,(boom?3:0)*q.b.mass,dir.z*(boom?8:3)*q.b.mass),q.b.position);
    q.b.angularVelocity.set((Math.random()-.5)*3,(Math.random()-.5)*3,(Math.random()-.5)*3);C.parts.push(q);C.objs.push(e.g)}
  // a thud and dust when the heaviest part hits something hard
  const main=C.parts.reduce((a,b)=>b.b.mass>a.b.mass?b:a,C.parts[0]);
  main.b.addEventListener('collide',ev=>{let v=0;try{v=Math.abs(ev.contact.getImpactVelocityAlongNormal())}catch(_){}if(v>2.5&&time-C.thud>.3){C.thud=time;const p=main.b.position,q=new T.Vector3(p.x,p.y-.3,p.z);
      sparkle(q,0x9a968a,Math.min(14,4+v*1.2|0),1.5+v*.25);tone('triangle',90+Math.random()*30,40,.18,Math.min(.12,.025*v*Math.sqrt(main.b.mass)/4));if(!reduced&&main.b.mass>25&&eye.distanceTo(q)<12)shake=Math.max(shake,.06)}});
  for(const o of C.objs)o.traverse(q=>{if(q.isMesh)q.castShadow=false});e.corpse=true;CORPSES.push(C);while(CORPSES.length>(lowFx?5:10))freeCorpse(CORPSES.shift())}catch(err){e.corpse=false}}
function corpseTick(dt){if(!PW||!CORPSES.length)return;PW.step(1/90,dt,4);
  for(let i=CORPSES.length-1;i>=0;i--){const C=CORPSES[i];C.t-=dt;if(C.t<7.2&&!C.damp){C.damp=1;for(const q of C.parts){q.b.linearDamping=.3;q.b.angularDamping=.85;q.b.allowSleep=true}}
    for(const q of C.parts){const b=q.b;_bq.set(b.quaternion.x,b.quaternion.y,b.quaternion.z,b.quaternion.w);q.obj.quaternion.copy(_bq);_bv.copy(q.off).applyQuaternion(_bq);
      q.obj.position.set(b.position.x+_bv.x,b.position.y+_bv.y-(C.t<1?(1-C.t)*1.2:0),b.position.z+_bv.z)}
    if(C.t<=0){freeCorpse(C);CORPSES.splice(i,1)}}}
function clearCorpses(){if(PW)while(CORPSES.length)freeCorpse(CORPSES.pop())}

function detonate(p){explode(p);if(Math.hypot(pos.x-p.x,pos.z-p.z)<3.8&&Math.abs(pos.y+1-p.y)<3&&los(p,eye))hurt(20)}

/* ---------- supers ---------- */
/* ---------- Rowan, the deck botanist: a computer-controlled ally. Not in `enemies` (so he is not counted, targeted or hit). Enemies ignore him ---------- */
var ROW=null;const rwG=new T.Group();scene.add(rwG);rwG.visible=false;
ROW={on:false,arrive:0,hide:false,pos:rwG.position,r:.95,vy:0,mv:0,kick:0,ph:Math.random()*6,crouch:0,jet:0,burst:0,ch:0,ft:0,cd:1,stuckT:0,farT:0,tgtT:0,tx:0,tz:0,barkT:-99,kills:0,beams:[]};
const rwR=walkerRig(rwG,8),rwMuz=new T.Vector3(),rwDir=new T.Vector3(),rwEnd=new T.Vector3();
{const bm=bas({color:0x7dffb0,transparent:true,opacity:.9,blending:T.AdditiveBlending,depthWrite:false,fog:false});for(let i=0;i<3;i++){const b=mesh(GEO.box,bm,.045,.045,1);b.visible=false;scene.add(b);ROW.beams.push({b,t:0})}}
const BARKS=['Softened him up for you.','He is yours. Finish it.','That one is wounded.','Clear on my side.','Weakened. Take the shot.','Still with you, soldier.','Keep moving. I have your flank.','Trimmed it down for you.'];
function rowanSpot(cx,cz,cy,rad){for(let k=0;k<16;k++){const a=k*.39+Math.random()*.3,r=rad+(k%2)*1.5,x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r,g=groundAt(x,z,cy+.5);if(Math.abs(g-cy)>1.2)continue;let ok=true;for(let y=g+.3;y<=g+2.2;y+=.3)if(inBox(x,y,z)){ok=false;break}if(ok&&NAV&&!NAV[navCell(x,z)])ok=false;if(ok)return[x,g,z]}return null}
function rowanPlace(){const q=rowanSpot(pos.x,pos.z,pos.y,3)||[pos.x,pos.y,pos.z];ROW.pos.set(q[0],q[1]+ROW.r,q[2]);ROW.vy=0;ROW.farT=ROW.stuckT=0;sparkle(ROW.pos,0x8fe6ff,12,5)}
function rowanJoin(quiet){ROW.on=true;ROW.hide=false;ROW.kills=0;const inC=Math.abs(pos.x)<107&&Math.abs(pos.z)<39&&pos.y<3;
  if(quiet||!inC)rowanPlace();else{ROW.pos.set(-60,ROW.r,-44.5);ROW.vy=0}rwG.visible=true;
  if(!quiet){comm('R',"Vault door's open. Don't shoot, it's me, Rowan. I grabbed the grow-lab pruner off the bench. It's a laser meant for trimming vines.");comm('R',"It cuts a drone just as clean. I'm coming with you.")}}
function allyTick(dt){
  if(ROW.arrive>0){ROW.arrive-=dt;if(ROW.arrive<=0)rowanJoin(false)}
  if(!ROW.on)return;if(veh){rwG.visible=false;ROW.hide=true;return}if(ROW.hide){ROW.hide=false;rowanPlace()}
  rwG.visible=true;const p=ROW.pos,dx=pos.x-p.x,dz=pos.z-p.z,hd=Math.hypot(dx,dz)||.01;
  if(Math.abs(p.y-ROW.r-pos.y)>3||hd>45)ROW.farT+=dt;else ROW.farT=0;if(ROW.farT>2.5)rowanPlace();
  let mx=0,mz=0,sp=0;if(hd>5.5){const f=flowDir(p.x,p.z);if(f){mx=f[0];mz=f[1]}else{mx=dx/hd;mz=dz/hd}sp=hd>16?7:4.6}else if(hd<2){mx=-dx/hd;mz=-dz/hd;sp=2}
  const ox=p.x,oz=p.z,st=sp*dt;p.x+=mx*st;p.z+=mz*st;ROW.vy-=19*dt;p.y+=ROW.vy*dt;const py=p.y;pushOut(p,ROW.r);const gr=p.y>py+1e-5;if(gr&&ROW.vy<0)ROW.vy=0;
  const moved=Math.hypot(p.x-ox,p.z-oz);ROW.mv=gr&&sp>0?Math.min(1,sp/3):0;if(sp>0&&moved<st*.3)ROW.stuckT+=dt;else ROW.stuckT=0;if(ROW.stuckT>2.5){rowanPlace();ROW.stuckT=0}
  // shooting: nearest enemy in sight, skipping bosses (the player's job), shielded shieldbearers and detonators that would blast the player
  ROW.cd-=dt;ROW.tgtT-=dt;if(ROW.cd<=0){let best=null,bd=1e9;const o={x:p.x,y:p.y+.5,z:p.z};
    for(const e of enemies){if(e.dying||e.type===3||e.type===4)continue;if(e.type===10&&!((e.burst||0)>0))continue;const d=Math.hypot(e.pos.x-p.x,e.pos.y-p.y,e.pos.z-p.z);if(d>30||d>=bd)continue;
      if(e.type===11&&Math.hypot(e.pos.x-pos.x,e.pos.z-pos.z)<9)continue;if(e.hp<=(e.hp0||e.hp)*.35)continue;if(!los(o,e.pos))continue;best=e;bd=d}
    if(!best)ROW.cd=.2;else{ROW.cd=.7;if(!best.hp0)best.hp0=best.hp;ROW.tgtT=.6;ROW.tx=best.pos.x;ROW.tz=best.pos.z;ROW.kick=1;rwR.segs.gun.getWorldPosition(rwMuz);rwEnd.copy(best.pos);rwDir.subVectors(rwEnd,rwMuz).normalize();rwMuz.addScaledVector(rwDir,.7);
      const bm=ROW.beams.find(q=>q.t<=0)||ROW.beams[0];bm.t=.09;bm.b.visible=true;bm.b.position.addVectors(rwMuz,rwEnd).multiplyScalar(.5);bm.b.scale.z=rwMuz.distanceTo(rwEnd);bm.b.lookAt(rwEnd);
      tone('sawtooth',1500,400,.05,.02);sparkle(rwEnd,0x7dffb0,3,4);damage(best,Math.min(.5*(1+.07*(Math.max(wave,1)-1)),Math.max(.05,best.hp-(best.hp0||best.hp)*.3)),-1,false,false);
      if(best.hp<=(best.hp0||1)*.36){ROW.kills++;if(Math.random()<.4&&time-ROW.barkT>22&&!commCur&&!COMMS.length&&!VOICE.busy){ROW.barkT=time;comm('R',BARKS[Math.random()*BARKS.length|0])}}}}
  for(const q of ROW.beams){q.t-=dt;if(q.t<=0)q.b.visible=false}
  const want=ROW.tgtT>0?Math.atan2(ROW.tx-p.x,ROW.tz-p.z):sp>0?Math.atan2(mx,mz):Math.atan2(dx,dz),da=((want-rwG.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI;rwG.rotation.y+=da*Math.min(1,dt*8);
  try{rwR.anim(ROW,time,dt)}catch(e){}}
/* ---------- Mission 2: the shuttle Kestrel. Arcade flight: machine guns, homing missiles and a heavy mass-accelerator cannon ---------- */
var FLY=null;const FLV={},MPH=2.23694,fv1=new T.Vector3(),fv2=new T.Vector3(),fv3=new T.Vector3(),fUp=new T.Vector3();
// the shuttle Kestrel (original design): sculpted hull with panel lines and markings, glass canopy, swept wings with flaps and
// navigation lights, twin canted fins, two engines with intakes and live flames, wing gun pods, missile rails, a belly cannon
let SHM=null;
function shuttleMats(){if(SHM)return SHM;
  const hullT=paint(512,(g,S)=>{g.fillStyle='#dfe3e6';g.fillRect(0,0,S,S);grime(g,S,2600,.025);
    for(let k=0;k<6;k++){g.fillStyle='rgba(0,0,0,'+(.025+hash(k,9)*.04)+')';g.fillRect(hash(k,5)*S*.7,hash(k,6)*S*.7,S*(.18+hash(k,7)*.25),S*(.12+hash(k,8)*.2))}
    g.strokeStyle='rgba(30,38,44,.38)';g.lineWidth=1.6;for(const y of[.0,.31,.58,.83]){g.beginPath();g.moveTo(0,y*S);g.lineTo(S,y*S);g.stroke()}for(const[x,y0,y1]of[[.22,0,.31],[.64,0,.31],[.4,.31,.58],[.86,.31,.58],[.15,.58,.83],[.55,.58,.83],[.33,.83,1],[.78,.83,1]]){g.beginPath();g.moveTo(x*S,y0*S);g.lineTo(x*S,y1*S);g.stroke()}
    g.fillStyle='rgba(30,38,44,.3)';for(const y of[.0,.31,.58,.83])for(let k=0;k<20;k++){g.beginPath();g.arc(k*S/20+6,y*S+5,1.3,0,7);g.fill()}
    g.strokeStyle='rgba(30,38,44,.3)';g.strokeRect(S*.7,S*.66,S*.12,S*.1);g.strokeRect(S*.08,S*.38,S*.16,S*.08)});
  hullT.repeat.set(.13,.13);
  const darkT=paint(256,(g,S)=>{g.fillStyle='#3b4247';g.fillRect(0,0,S,S);grime(g,S,2500,.06);g.strokeStyle='rgba(0,0,0,.5)';g.lineWidth=2;for(let k=0;k<=4;k++){g.beginPath();g.moveTo(0,k*S/4);g.lineTo(S,k*S/4);g.stroke();g.beginPath();g.moveTo(k*S/4,0);g.lineTo(k*S/4,S);g.stroke()}
    g.strokeStyle='rgba(0,0,0,.35)';for(let k=0;k<24;k++){g.beginPath();g.moveTo(0,k*S/24+3);g.lineTo(S*.4,k*S/24+3);g.stroke()}});
  const decal=paint(512,(g,S)=>{g.clearRect(0,0,S,S);g.fillStyle='#e0702a';g.fillRect(0,S*.62,S,S*.07);g.fillRect(0,S*.72,S*.55,S*.025);g.fillStyle='rgba(24,30,36,.9)';g.font='700 '+Math.round(S*.15)+'px "Chakra Petch",sans-serif';g.fillText('KESTREL',S*.04,S*.5);
    g.font='600 '+Math.round(S*.06)+'px monospace';g.fillText('TH-09 · S2 · THALASSA FLEET',S*.05,S*.86);g.fillStyle='#e0702a';for(let k=0;k<5;k++){g.beginPath();g.moveTo(S*(.62+k*.07),S*.36);g.lineTo(S*(.66+k*.07),S*.36);g.lineTo(S*(.63+k*.07),S*.44);g.lineTo(S*(.59+k*.07),S*.44);g.fill()}},true);
  const hullN=normalMap(hullT,1.1);hullN.repeat.set(.13,.13);
  SHM={hull:std({map:hullT,normalMap:hullN,roughness:.38,metalness:.35}),dark:std({map:darkT,roughness:.55,metalness:.6}),
    trim:std({color:0xe0702a,roughness:.45,metalness:.25}),metal:std({color:0x7d8790,roughness:.3,metalness:.85}),burnt:std({color:0x2a2622,roughness:.5,metalness:.8}),
    glass:std({color:0x0d1c26,roughness:.06,metalness:.9,emissive:0x0a2a3a,emissiveIntensity:.35}),
    decal:bas({map:decal,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4}),
    glowC:bas({color:0x9fe8ff}),coil:std({color:0x5a3d8a,emissive:0xb48cff,emissiveIntensity:1,roughness:.3,metalness:.5}),
    red:bas({color:0xff3030}),green:bas({color:0x30ff70}),white:bas({color:0xffffff}),
    flameA:bas({color:0x9fe8ff,transparent:true,opacity:.9,blending:T.AdditiveBlending,depthWrite:false,fog:false}),flameB:bas({color:0x3f8cff,transparent:true,opacity:.55,blending:T.AdditiveBlending,depthWrite:false,fog:false}),
    msl:std({color:0xe8eaec,roughness:.4,metalness:.3}),mslTip:std({color:0xd8402a,roughness:.4,metalness:.3})};return SHM}
function planform(pts,depth,bev){const sh=new T.Shape();sh.moveTo(pts[0][0],pts[0][1]);for(let k=1;k<pts.length;k++)sh.lineTo(pts[k][0],pts[k][1]);sh.closePath();
  const g=new T.ExtrudeGeometry(sh,{depth,bevelEnabled:bev>0,bevelThickness:bev,bevelSize:bev,bevelSegments:3,curveSegments:4});g.rotateX(-Math.PI/2);g.translate(0,-depth/2,0);g.computeVertexNormals();return g}
function shuttleModel(){const M=shuttleMats(),g=new T.Group(),add=(geo,mat,x=0,y=0,z=0,rx=0,ry=0,rz=0,sx=1,sy=1,sz=1)=>{const o=new T.Mesh(geo,mat);o.position.set(x,y,z);o.rotation.set(rx,ry,rz);o.scale.set(sx,sy,sz);o.castShadow=true;g.add(o);return o};
  // hull: a wide flat lower body, a raised spine, a pointed nose (shape y is forward)
  // fuselage: a lathed body, flattened and widened, that tapers to a point at the nose and narrows at the tail
  {if(!M.fus){const pr=[[0,-7.0],[.28,-6.6],[.6,-5.8],[.86,-4.6],[1.04,-3.0],[1.14,-1.0],[1.16,1.2],[1.08,3.2],[.95,4.6],[.8,5.5],[.0,5.6]].map(([r,y])=>new T.Vector2(r,y));M.fus=new T.LatheGeometry(pr,28);
    const ht=M.hull.map.clone();ht.needsUpdate=true;ht.repeat.set(3,2.2);const hn=M.hull.normalMap.clone();hn.needsUpdate=true;hn.repeat.set(3,2.2);M.fusM=std({map:ht,normalMap:hn,roughness:.38,metalness:.35})}
    add(M.fus,M.fusM,0,.12,0,Math.PI/2,0,0,1.5,1,.66)}
  // flat chines: the wide lower edge that blends the body into the wings
  add(planform([[-.25,6.2],[-.9,4.6],[-1.45,2.4],[-1.62,-1],[-1.72,-3.6],[-1.3,-5.0],[1.3,-5.0],[1.72,-3.6],[1.62,-1],[1.45,2.4],[.9,4.6],[.25,6.2]],.22,.1),M.hull,0,-.28,0);
  add(planform([[-.12,3.2],[-.5,1.8],[-.7,0],[-.72,-3.6],[-.5,-4.8],[.5,-4.8],[.72,-3.6],[.7,0],[.5,1.8],[.12,3.2]],.4,.18),M.hull,0,.78,0);
  add(planform([[-1.2,1.5],[-1.4,-3],[-1.1,-4.9],[1.1,-4.9],[1.4,-3],[1.2,1.5]],.35,.12),M.dark,0,-.72,0);
  for(const sx of[-1,1]){const d=add(GEO.plane,M.decal,sx*1.78,.05,.2,0,sx*Math.PI/2,0,5.2,1.6,1);d.castShadow=false}
  add(GEO.box,M.trim,0,1.02,-.6,0,0,0,.12,.04,6.0);
  // canopy with a frame
  add(GEO.sph,M.glass,0,.98,-3.1,0,0,0,.74,.44,1.6);for(const z of[-2.3,-3.1,-3.9])add(GEO.box,M.dark,0,1.16,z,0,0,0,1.0,.06,.07);add(GEO.box,M.dark,0,1.27,-3.1,0,0,0,.07,.06,1.7);
  // swept wings with flaps, leading-edge trim and wingtip lights
  for(const sx of[-1,1]){const w=add(planform([[0,1.6],[sx*4.7,-1.6],[sx*5.1,-2.6],[sx*4.6,-3.1],[0,-3.4]],.2,.06),M.hull,sx*1.3,-.2,0,0,0,sx*.07);
    add(GEO.box,M.trim,sx*3.6,-.12,-.05,0,sx*.6,0,.12,.1,2.9);const f=add(GEO.box,M.dark,sx*3.4,-.24,2.85,0,0,0,2.4,.08,.5);f.userData.flap=sx;
    const nl=add(GEO.sph,sx<0?M.red:M.green,sx*6.35,-.08,2.45,0,0,0,.14,.14,.14);nl.castShadow=false;const ng=glow(sx<0?0xff3030:0x30ff70,1.4,.9);ng.position.copy(nl.position);g.add(ng);(g.userData.nav=g.userData.nav||[]).push(ng);
    // gun pod with twin barrels under the wing root
    add(GEO.cyl,M.dark,sx*2.5,-.55,-.6,Math.PI/2,0,0,.28,2.6,.28);for(const o of[-.1,.1]){add(GEO.cyl,M.metal,sx*2.5+o,-.55,-2.4,Math.PI/2,0,0,.05,1.4,.05)}add(GEO.box,M.trim,sx*2.5,-.3,-.6,0,0,0,.3,.05,1.2);
    // missile rail with two missiles
    add(GEO.box,M.dark,sx*3.8,-.42,.4,0,0,0,.14,.14,2.4);for(const k of[0,1]){const mx=sx*(3.55+k*.5),m=new T.Group();m.position.set(mx,-.62,.3);g.add(m);
      const b=new T.Mesh(GEO.cyl,M.msl);b.rotation.x=Math.PI/2;b.scale.set(.12,1.9,.12);m.add(b);const t=new T.Mesh(GEO.cone,M.mslTip);t.rotation.x=-Math.PI/2;t.scale.set(.12,.35,.12);t.position.z=-1.12;m.add(t);
      for(const a of[0,1,2,3]){const fn=new T.Mesh(GEO.box,M.dark);fn.scale.set(.02,.22,.25);fn.position.set(Math.cos(a*1.571)*.12,Math.sin(a*1.571)*.12,.8);fn.rotation.z=a*1.571;m.add(fn)}(g.userData.msls=g.userData.msls||[]).push(m)}
    // canted twin tail fins
    const fin=add(planform([[0,0],[1.7,-.9],[1.9,-1.9],[.3,-2.2]],.12,.05),M.hull,sx*1.1,.75,3.2,0,0,0);fin.rotation.set(0,0,sx>0?Math.PI/2-.35:Math.PI/2+.35);
    add(GEO.box,M.trim,sx*1.55,1.9,4.65,0,0,sx*-.35,.06,.5,1.2);
    const st=add(GEO.sph,M.white,sx*1.9,2.35,5.0,0,0,0,.08,.08,.08);st.castShadow=false;(g.userData.strobe=g.userData.strobe||[]).push(st)}
  // engines: nacelle, intake ring, nozzle, inner glow and a two-layer flame
  const prof=[[.0,-1.6],[.5,-1.6],[.62,-1.4],[.66,-.6],[.64,.6],[.58,1.2],[.52,1.6]].map(([r,y])=>new T.Vector2(r,y)),nac=new T.LatheGeometry(prof,20);
  const cones=[],glows=[];
  for(const sx of[-1,1]){const x=sx*1.05;add(nac,M.hull,x,.05,4.0,-Math.PI/2,0,0);add(GEO.tor,M.dark,x,.05,2.45,0,0,0,.55,.55,.55);add(GEO.cyl,M.burnt,x,.05,5.85,Math.PI/2,0,0,.5,.6,.5);
    const in_=add(GEO.cyl,M.glowC,x,.05,6.1,Math.PI/2,0,0,.38,.05,.38);in_.castShadow=false;
    const c1=new T.Mesh(GEO.cone,M.flameA),c2=new T.Mesh(GEO.cone,M.flameB);for(const c of[c1,c2]){c.rotation.x=-Math.PI/2;c.position.set(x,.05,6.1);g.add(c)}c1.scale.set(.32,2,.32);c2.scale.set(.5,3,.5);cones.push([c1,c2]);
    const q=glow(0x7fd8ff,2.6,.85);q.position.set(x,.05,6.6);g.add(q);glows.push(q);
    for(let k=0;k<6;k++){const a=k/6*6.283;add(GEO.box,M.dark,x+Math.cos(a)*.62,.05+Math.sin(a)*.62,4.5,0,0,a,.08,.12,1.4)}}
  // belly heavy cannon: housing, barrel, accelerator coils, muzzle brake
  add(GEO.box,M.dark,0,-1.0,.6,0,0,0,.9,.45,4.2);add(GEO.cyl,M.metal,0,-1.02,-3.2,Math.PI/2,0,0,.18,4.2,.18);const coils=[];for(let k=0;k<5;k++){const c=add(GEO.tor,M.coil,0,-1.02,-1.6-k*.7,0,0,0,.3,.3,.3);c.castShadow=false;coils.push(c)}
  add(GEO.box,M.dark,0,-1.02,-5.35,0,0,0,.42,.32,.3);add(GEO.box,M.trim,0,-.76,.6,0,0,0,.92,.05,3.6);
  // details: RCS blocks, antenna, dorsal sensor, intakes
  for(const sx of[-1,1])for(const z of[-3.8,3.6]){add(GEO.box,M.dark,sx*1.72,.15,z,0,0,0,.14,.28,.42)}add(GEO.cyl,M.metal,.4,1.4,1.0,0,0,0,.02,.9,.02);add(GEO.sph,M.dark,-.3,1.06,.4,0,0,0,.28,.16,.28);
  for(const sx of[-1,1])add(GEO.box,M.dark,sx*1.3,.35,1.6,0,sx*.12,0,.4,.36,1.1);
  // landing gear (folds away after launch)
  const gear=new T.Group();g.add(gear);for(const[x,z]of[[0,-3.6],[-1.4,2.2],[1.4,2.2]]){const l=new T.Mesh(GEO.cyl,M.metal);l.scale.set(.08,1.5,.08);l.position.set(x,-1.25,z);gear.add(l);const w=new T.Mesh(GEO.cyl,M.burnt);w.rotation.z=Math.PI/2;w.scale.set(.28,.2,.28);w.position.set(x,-1.95,z);gear.add(w)}
  g.userData={flames:glows,cones,coils,gear,msls:g.userData.msls,nav:g.userData.nav,strobe:g.userData.strobe,flaps:g.children.filter(o=>o.userData&&o.userData.flap)};g.rotation.order='YXZ';g.scale.setScalar(.92);return g}
function shuttleAnim(g,spd,boost,roll,msl,mac,gearDown,dt){const U=g.userData,k=Math.min(1,spd/140);
  U.cones.forEach(([a,b])=>{const f=.4+k*1.2+(boost?1.4:0),fl=.9+Math.random()*.2;a.scale.set(.3,1.2*f*fl,.3);b.scale.set(.48,2*f*fl,.48);b.material.opacity=.35+.25*k+(boost?.25:0)});
  for(const q of U.flames)q.scale.setScalar((1.1+k*1.2)*(boost?1.4:1)*(.9+Math.random()*.2));
  if(U.msls)U.msls.forEach((m,i)=>m.visible=i<Math.ceil(msl/2));
  const ready=mac<=0;for(const c of U.coils)c.material.emissiveIntensity=ready?.9+Math.sin(time*6)*.3:.15;
  for(const f of U.flaps)f.rotation.x=-roll*.5*f.userData.flap;
  const bl=(time%1.2)<.08;for(const s of U.strobe||[])s.visible=bl;
  U.gear.scale.y+=((gearDown?1:0.01)-U.gear.scale.y)*Math.min(1,dt*3);U.gear.visible=U.gear.scale.y>.05}
// enemy craft (original designs): built from shared geometry and materials, so spawning many costs little
let ESH=null;
function enemyShipKit(){if(ESH)return ESH;
  const panel=paint(256,(g,S)=>{g.fillStyle='#2b3036';g.fillRect(0,0,S,S);grime(g,S,1800,.05);g.strokeStyle='rgba(0,0,0,.55)';g.lineWidth=1.5;for(const y of[0,.34,.7])g.strokeRect(0,y*S,S,S*.34);for(const[x,y]of[[.3,0],[.75,.34],[.5,.7]]){g.beginPath();g.moveTo(x*S,y*S);g.lineTo(x*S,y*S+S*.34);g.stroke()}
    g.fillStyle='rgba(255,255,255,.05)';g.fillRect(S*.05,S*.05,S*.4,S*.24)}),seam=paint(256,(g,S)=>{g.fillStyle='#000';g.fillRect(0,0,S,S);g.fillStyle='#ff2a1e';g.fillRect(0,S*.33,S,S*.02);g.fillRect(S*.74,S*.34,S*.015,S*.36);g.fillRect(S*.1,S*.69,S*.5,S*.015)});
  panel.repeat.set(2,1.5);seam.repeat.set(2,1.5);const pN=normalMap(panel,1.4);pN.repeat.set(2,1.5);
  const mk=(r,y)=>new T.LatheGeometry(r.map(([a,b])=>new T.Vector2(a,b)),18);
  ESH={hull:std({map:panel,normalMap:pN,emissive:0xff2a1e,emissiveMap:seam,emissiveIntensity:1.1,roughness:.38,metalness:.7}),dark:std({color:0x1a1d21,roughness:.5,metalness:.75}),
    plate:std({color:0x4a2a2a,roughness:.45,metalness:.6}),eye:bas({color:0xff3a2a}),flame:bas({color:0xff5a2a,transparent:true,opacity:.75,blending:T.AdditiveBlending,depthWrite:false,fog:false}),
    win:bas({color:0xff6040}),
    ifus:mk([[0,5.2],[.22,4.7],[.5,3.6],[.72,1.8],[.8,0],[.74,-1.8],[.62,-3.0],[.0,-3.2]]),
    iwing:planform([[0,-1.0],[3.9,-2.4],[4.4,-1.8],[3.8,-.6],[0,1.4]],.16,.05),iwingL:planform([[0,-1.0],[-3.9,-2.4],[-4.4,-1.8],[-3.8,-.6],[0,1.4]],.16,.05),icanard:planform([[0,-.2],[1.4,-.9],[1.5,-.5],[0,.6]],.1,.03),icanardL:planform([[0,-.2],[-1.4,-.9],[-1.5,-.5],[0,.6]],.1,.03),
    gfus:mk([[0,9.5],[.5,8.6],[1.2,6.8],[1.6,3.0],[1.7,-2],[1.6,-6],[1.3,-8.6],[0,-8.8]]),
    nozzle:new T.CylinderGeometry(1,.8,1,14,1,true)};return ESH}
function emesh(g,geo,mat,x=0,y=0,z=0,rx=0,ry=0,rz=0,sx=1,sy=1,sz=1){const o=new T.Mesh(geo,mat);o.position.set(x,y,z);o.rotation.set(rx,ry,rz);o.scale.set(sx,sy,sz);g.add(o);return o}
function interceptorModel(){const K=enemyShipKit(),g=new T.Group();
  emesh(g,K.ifus,K.hull,0,0,0,Math.PI/2,0,0,1.25,1,.62);
  for(const sx of[-1,1]){emesh(g,sx>0?K.iwing:K.iwingL,K.hull,sx*.55,-.1,-.4,0,0,sx*-.12);emesh(g,sx>0?K.icanard:K.icanardL,K.dark,sx*.5,.05,3.0,0,0,sx*.1);
    emesh(g,GEO.box,K.plate,sx*3.9,-.08,.2,0,0,0,.18,.5,1.6);emesh(g,GEO.cyl,K.dark,sx*1.0,-.05,-2.6,Math.PI/2,0,0,.42,1.6,.42);
    const n=emesh(g,K.nozzle,K.dark,sx*1.0,-.05,-3.5,Math.PI/2,0,0,.42,.4,.42);const f=emesh(g,GEO.cone,K.flame,sx*1.0,-.05,-4.6,Math.PI/2,0,0,.34,1.8,.34);f.userData.flame=1;
    emesh(g,GEO.cyl,K.dark,sx*1.5,-.35,2.2,Math.PI/2,0,0,.07,1.6,.07)}
  emesh(g,GEO.box,K.dark,0,.62,-.6,0,0,0,.18,.5,2.2);emesh(g,GEO.sph,K.eye,0,.32,3.3,0,0,0,.26,.16,.34);
  const e=glow(0xff3030,3.2,.95);e.position.set(0,.35,3.5);g.add(e);const t=glow(0xff6a3a,4.5,.8);t.position.set(0,0,-4.4);g.add(t);return g}
function gunboatModel(){const K=enemyShipKit(),g=new T.Group();
  emesh(g,K.gfus,K.hull,0,0,0,Math.PI/2,0,0,1.55,1,.85);emesh(g,GEO.box,K.dark,0,1.45,-.5,0,0,0,1.6,.8,10);emesh(g,GEO.box,K.plate,0,-1.35,0,0,0,0,2.2,.5,12);
  for(const sx of[-1,1]){emesh(g,GEO.box,K.plate,sx*2.7,-.2,-1,0,0,sx*.25,1,1.6,9);emesh(g,GEO.box,K.dark,sx*3.2,.2,-4,0,0,0,.6,.6,3);
    for(let k=0;k<5;k++)emesh(g,GEO.box,K.win,sx*2.55,.35,4-k*1.8,0,0,0,.05,.18,.9);
    const tb=emesh(g,GEO.cyl,K.dark,sx*1.6,1.9,2.5,0,0,0,.9,.5,.9),th=emesh(g,GEO.box,K.plate,sx*1.6,2.35,2.6,0,0,0,1.1,.55,1.4);for(const o of[-.22,.22])emesh(g,GEO.cyl,K.dark,sx*1.6+o,2.35,4.2,Math.PI/2,0,0,.11,2.6,.11)}
  for(const[x,y]of[[0,.2],[-1.1,-.4],[1.1,-.4]]){emesh(g,K.nozzle,K.dark,x,y,-9.2,Math.PI/2,0,0,.62,.9,.62);emesh(g,GEO.cone,K.flame,x,y,-11.2,Math.PI/2,0,0,.5,3,.5)}
  emesh(g,GEO.cyl,K.dark,.6,2.4,-4,0,0,0,.05,2.4,.05);emesh(g,GEO.sph,K.eye,0,.6,9.3,0,0,0,.6,.3,.4);
  for(const z of[-5,0,5]){const q=glow(0xff3030,2.6,.9);q.position.set(0,1.95,z);g.add(q)}{const q=glow(0xff7a40,10,.8);q.position.set(0,0,-11);g.add(q)}{const q=glow(0xff3030,5,.95);q.position.set(0,.6,9.6);g.add(q)}return g}
const FTRC=bas({color:0xffe6a0,transparent:true,opacity:.95,blending:T.AdditiveBlending,depthWrite:false,fog:false}),FBOLT=bas({color:0xff4a3a,transparent:true,opacity:.95,blending:T.AdditiveBlending,depthWrite:false,fog:false}),
  FPLAS=bas({color:0xff6a2a,transparent:true,opacity:.9,blending:T.AdditiveBlending,depthWrite:false,fog:false}),FMACM=bas({color:0xd8c4ff,transparent:true,opacity:1,blending:T.AdditiveBlending,depthWrite:false,fog:false});
// near-field dust: short streaks around the camera that stretch with speed, so 500 mph reads as fast
const FDUST=(()=>{const N=260,a=new Float32Array(N*6),g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(a,3));const l=new T.LineSegments(g,new T.LineBasicMaterial({color:0xcfe6ff,transparent:true,opacity:.35,fog:false,depthWrite:false}));l.frustumCulled=false;l.visible=false;scene.add(l);
  const P=[];for(let i=0;i<N;i++)P.push(new T.Vector3((Math.random()-.5)*160,(Math.random()-.5)*160,(Math.random()-.5)*160));return{l,a,P,N}})();
function dustTick(){const D=FDUST,c=cam.position,v=FLY.vel,k=Math.max(.4,FLY.spd*.045);for(let i=0;i<D.N;i++){const q=D.P[i];for(const ax of['x','y','z']){if(q[ax]-c[ax]>80)q[ax]-=160;else if(q[ax]-c[ax]<-80)q[ax]+=160}
  const o=i*6;D.a[o]=q.x;D.a[o+1]=q.y;D.a[o+2]=q.z;const L=k/Math.max(1,FLY.spd);D.a[o+3]=q.x-v.x*L;D.a[o+4]=q.y-v.y*L;D.a[o+5]=q.z-v.z*L}D.l.geometry.attributes.position.needsUpdate=true}
function nearHull(p){return inHull(p.x,p.z)&&p.y<34&&p.y>-2||Math.abs(p.x)<62&&p.z>AZ-12&&p.z<AZ+105&&p.y>-24&&p.y<44}
function hullZone(p){return Math.abs(p.x)<390&&p.z>-660&&p.z<430&&p.y>-150&&p.y<170}
function segDist(a,b,c){fv1.subVectors(b,a);const L2=fv1.lengthSq()||1e-6;let t=fv2.subVectors(c,a).dot(fv1)/L2;t=Math.max(0,Math.min(1,t));fv3.copy(a).addScaledVector(fv1,t);return fv3.distanceTo(c)}
function flyBoom(p,s){const m=bas({color:0xffc070,transparent:true,opacity:.95,fog:false,blending:T.AdditiveBlending,depthWrite:false}),g=mesh(GEO.sph,m,.5,.5,.5,p.x,p.y,p.z);scene.add(g);blasts.push({g,m,t:0,r:s*9});
  const g2=glow(0xffa040,s*26,.9);g2.position.copy(p);scene.add(g2);PFX.boom(p,s*2.6,true);fxq.push({t:.35,fn:()=>scene.remove(g2)});sparkle(p,0xffb238,Math.round(14+s*8),18*s);sparkle(p,0xffffff,8,26*s);
  if(cam.position.distanceTo(p)<900)sfx('boom');if(!reduced&&cam.position.distanceTo(p)<120)shake=Math.max(shake,.15)}
function flyEnemy(kind,x,y,z){const g=kind==='gun'?gunboatModel():kind==='pod'?podModel():kind==='mine'?mineModel():kind==='ace'?aceModel():interceptorModel();g.position.set(x,y,z);scene.add(g);const dir=new T.Vector3(FLY.pos.x-x,FLY.pos.y-y,FLY.pos.z-z).normalize(),K={gun:[40,11,55],pod:[14,5,0],mine:[2,3,0],ace:[140,8,175],int:[6,4.5,150]}[kind];
  const e={kind,g,p:g.position,dir,hp:K[0],max:K[0],r:K[1],sp:K[2],st:'attack',t:0,cd:1+Math.random()*2,burst:0,bt:0,bdir:new T.Vector3(),flash:0};FLY.en.push(e);return e}
function flyShot(p,dir,speed,mat,len,w,dmg,mine){const g=mesh(GEO.box,mat,w,w,len,p.x,p.y,p.z);g.lookAt(p.x+dir.x,p.y+dir.y,p.z+dir.z);scene.add(g);FLY.shots.push({g,p:g.position,v:dir.clone().multiplyScalar(speed),t:mine?1.4:3.2,dmg,mine,prev:p.clone()})}
function flyHit(e,n){if(e.hp<=0)return;e.hp-=n;e.flash=.08;sparkle(e.p,0xffd27a,3,8);if(e.hp>0)return;flyBoom(e.p,e.kind==='gun'?2.6:e.kind==='ace'?3.4:1.3);scene.remove(e.g);FLY.en.splice(FLY.en.indexOf(e),1);FLY.kills++;score+=e.kind==='gun'?600:e.kind==='pod'?300:e.kind==='ace'?3000:150;sfx('kill');if(FLY.lockE===e){FLY.lockE=null;FLY.lockP=0}}
function flyAim(out){cam.getWorldDirection(out);return out}
function flyMissile(){const S=FLY;if(!S||state!=='playing'||S.msl<=0||S.mcd>0)return;S.msl--;S.mcd=.45;const tgt=S.lockP>=.6?S.lockE:null;const side=S.mside=-(S.mside||1);
  const g=new T.Group();g.add(mesh(GEO.box,MAT.white,.25,.25,1.6));const fl=glow(0xffa060,2.2,.9);fl.position.z=-.9;g.add(fl);fUp.set(side*3.5,-.6,-.6).applyEuler(S.g.rotation);g.position.copy(S.pos).add(fUp);scene.add(g);
  const dir=flyAim(new T.Vector3());S.msls.push({g,p:g.position,dir,spd:Math.max(S.spd+40,140),t:7,tgt,trail:0});sfx('mortar');if(!tgt&&!S.tipNoLock){S.tipNoLock=1;say('No lock · hold a target in the ring first',2)}}
function flyMAC(){const S=FLY;if(!S||state!=='playing'||S.mac>0)return;S.mac=5;const a=flyAim(new T.Vector3()),o=fUp.set(0,-.94,-5.0).applyEuler(S.g.rotation).add(S.pos).clone(),end=o.clone().addScaledVector(a,3200);
  let best=null,bd=1e9;for(const e of S.en){const t=fv2.subVectors(e.p,o).dot(a);if(t<0||t>3200)continue;if(segDist(o,end,e.p)<e.r+2.5&&t<bd){bd=t;best=e}}const hitP=best?o.clone().addScaledVector(a,bd):end;
  const L=o.distanceTo(hitP),b=mesh(GEO.box,FMACM,.5,.5,L);b.position.copy(o).lerp(hitP,.5);b.lookAt(hitP);scene.add(b);const fl=glow(0xd8c4ff,14,.95);fl.position.copy(o);scene.add(fl);
  S.beams.push({g:b,t:.28,fl});if(best){flyHit(best,45);flyBoom(hitP,1)}S.spd=Math.max(0,S.spd-18);if(!reduced)shake=Math.max(shake,.35);tone('sawtooth',90,30,.5,.25);tone('square',1600,200,.18,.08);if(!S.tipMac){S.tipMac=1}}
function flyStart(st){const S=FLY={stage:st,pos:new T.Vector3(0,3,205),vel:new T.Vector3(),h:Math.PI,p:0,roll:0,spd:0,thr:0,boost:1,heat:0,over:0,gcd:0,gside:1,mcd:0,msl:8,mslT:0,mac:0,lockE:null,lockP:0,
    en:[],shots:[],msls:[],beams:[],ph:'hangar',kills:0,t:0,tut:0,endT:0,spawned:0};
  S.g=shuttleModel();S.g.position.copy(S.pos);scene.add(S.g);yaw=Math.PI;pitch=0;veh=null;ROW.on=false;rwG.visible=false;LAST={m:2,s:st};
  FLV.fn=scene.fog.near;FLV.ff=scene.fog.far;FLV.cn=cam.near;FLV.cf=cam.far;scene.fog.near=40000;scene.fog.far=90000;cam.near=.3;cam.far=60000;cam.updateProjectionMatrix();FDUST.l.visible=true;
  hp=100;shMax=150;shield=150;shDelay=0;$('hud').hidden=true;$('radar').hidden=true;$('fhud').hidden=false;$('wave').textContent='2-'+st;
  if(st===3){S.pos.set(0,40,1500);S.spd=90;S.thr=.65;S.ph='to3';stage3Setup(S);wingSpawn(S,S.pos);say(touchUI?'Left stick throttle · right side steers':'W throttle · mouse steers · Shift afterburner · Space brakes',5);return}
  if(st===2){S.pos.set(0,40,1500);S.spd=90;S.thr=.65;S.ph='to2';stage2Setup(S);say(touchUI?'Left stick throttle · right side steers':'W throttle · mouse steers · Shift afterburner · Space brakes',5);return}
  setObj('STAGE 2-1 · LAUNCH · LEAVE THE HANGAR');comm('R',"Easy on the throttle in here. Hangar walls don't move.");say(touchUI?'Left stick throttle · right side steers':'W throttle · mouse steers · Shift afterburner · Space brakes',5)}
function flyExit(){if(!FLY)return;const S=FLY;PFX.clear();worldShow(true);if(S.emsl)for(const m of S.emsl)scene.remove(m.g);scene.remove(S.g);if(S.halc)scene.remove(S.halc.g);if(S.meri)scene.remove(S.meri.g);if(S.wing)for(const w of S.wing)scene.remove(w.g);for(const e of S.en)scene.remove(e.g);for(const q of S.shots)scene.remove(q.g);for(const m of S.msls)scene.remove(m.g);for(const b of S.beams){scene.remove(b.g);scene.remove(b.fl)}
  FLY=null;scene.fog.near=FLV.fn;scene.fog.far=FLV.ff;cam.near=FLV.cn;cam.far=FLV.cf;cam.updateProjectionMatrix();FDUST.l.visible=false;$('fhud').hidden=true;$('ftg').innerHTML='';engineOff()}
// ---- stage 2-2: the Halcyon, a civilian transport being boarded. Original design, about 175 m long, lying along x
function halcyonModel(){const M=shuttleMats(),g=new T.Group();
  greeble(g,'halc',(a,R)=>{const H=M.hull,D=M.dark,Tr=M.trim,Me=M.metal,Bu=M.burnt,Gl=M.glass;
    R(H,110,18,24,0,0,0,0,0,0,1.2);R(D,112,1.6,24.6,0,-4,0,0,0,0,.3);R(H,28,14,20,68,-1,0,0,0,0,1);R(H,14,9,15,86,-2.5,0,0,0,-.18,.9);R(D,6,4,13,93,-4.5,0,0,0,-.3,.5);
    R(H,90,3,7,5,10.5,0,0,0,0,.5);R(H,15,7,13,-30,14,0,0,0,0,.8);R(Gl,.5,1.6,11,-22.4,14.6,0,0,0,0,.1);for(const s of[-1,1])R(Gl,13,1.2,.4,-30,14.6,s*6.55,0,0,0,.1);
    R(H,22,24,30,-64,0,0,0,0,0,1.2);for(const y of[-6,6])for(const z of[-8,8]){a(new T.CylinderGeometry(3.4,4.2,7,18,1,true),Me,1,1,1,-78.5,y,z,0,0,1.571);a(GEO.cyl,D,3.5,.6,3.5,-75.2,y,z,0,0,1.571)}
    for(const s of[-1,1])for(let k=0;k<6;k++){const x=-42+k*15;if(s>0&&Math.abs(x-12)<9)continue;R(k%3?D:Tr,12,11,5,x,0,s*14.6,0,0,0,.5);for(const e of[-6,6])R(Me,.4,11.4,5.4,x+e,0,s*14.6,0,0,0,.1)}
    a(GEO.cyl,D,5,5,5,12,0,14.5,1.571,0,0);a(GEO.tor,Tr,4.6,4.6,4.6,12,0,17.2);for(const y of[-6.5,6.5])R(Me,14,1,6,12,y,14.5,0,0,0,.2);
    for(const s of[-1,1])R(Me,34,.5,12,-38,-9,s*21,s*-.3,0,0,.15);for(let k=0;k<4;k++)a(GEO.cyl,Me,.15,6+k*1.5,.15,-26+k*2.5,20+k*.7,-4+k*1.5);a(GEO.sph,Me,2.5,.8,2.5,-36,18.3,0);
    for(const s of[-1,1]){R(Tr,100,.5,.2,0,7.5,s*12.05,0,0,0,.05);for(let x=56;x<=80;x+=3)R(Gl,1.2,.8,.2,x,2,s*10.05,0,0,0,.05)}
    for(const[x,y,z,w,d]of[[-12,9.1,4,9,6],[38,9.1,-5,7,5],[-55,12.1,-6,8,7],[60,6.1,4,6,5]])R(Bu,w,.2,d,x,y,z,0,0,0,.05);
    // raised hull plating on the top deck, window rows above the cargo, a keel, thruster clusters, cranes, a comm mast and dish
    for(let x=-50;x<=50;x+=10)for(const s of[-1,1])if(!(s>0&&Math.abs(x-12)<6))R(H,8.6,.3,6.4,x,9.15,s*8.4,0,0,0,.12);
    for(const s of[-1,1]){for(let x=-56;x<=54;x+=2.6)R(Gl,1.5,.7,.15,x,6.4,s*12.08,0,0,0,.04);for(let x=-60;x<=60;x+=12)R(D,.5,17,.3,x,0,s*12.15,0,0,0,.08);R(D,112,.4,.4,0,-8.6,s*12.1,0,0,0,.1)}
    R(D,70,5,1.4,-5,-11.4,0,0,0,0,.3);R(D,30,2.5,1,40,-10.5,0,0,0,0,.2);
    for(const[x,y,z]of[[54,8,12],[54,8,-12],[54,-8,12],[54,-8,-12],[-74,10,14],[-74,10,-14],[-74,-10,14],[-74,-10,-14]]){R(D,2.2,1.6,1.6,x,y,z,0,0,0,.2);for(const k of[-1,1])a(GEO.cone,Me,.35,.9,.35,x+k*.6,y+Math.sign(y)*1.1,z,y>0?0:Math.PI,0,0)}
    for(const x of[-20,25]){R(Me,1,6,1,x,13.4,0,0,0,0,.15);R(Me,14,.8,.8,x+6,16.2,0,0,0,0,.1);a(GEO.cyl,D,.06,4,.06,x+12.5,14,0);R(D,1.4,1.2,1.4,x+12.5,11.6,0,0,0,0,.1)}
    a(GEO.cyl,Me,.35,14,.35,-36,24,5);for(const y of[22,26,29])R(Me,5,.2,.2,-36,y,5,0,0,0,.05);a(GEO.sph,Me,3.2,1,3.2,-36,31.5,5,.5,0,0);a(GEO.cyl,D,.15,2.2,.15,-36,32.6,5.4,.5,0,0);
    for(const y of[-6,6])for(const z of[-8,8])if(!(y>0&&z>0))a(GEO.cyl,M.flameA,3.3,.2,3.3,-81.8,y,z,0,0,1.571);
    R(Bu,10,6,.3,-10,6,12.2,0,0,0,.05);R(Bu,8,5,.3,35,-6,-12.2,0,0,0,.05);for(let k=0;k<5;k++)R(H,2.5,.2,1.5,-10+(k-2)*2.2,9.6+k*.2,12.4,.6+k*.2,0,.3,.05)},true);
  // the ship's name on both bows, and blinking running lights
  {const tx=paint(512,(g,S)=>{g.clearRect(0,0,S,S);g.fillStyle='#d8dde0';g.font='700 92px "Chakra Petch",sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('HALCYON',S/2,S*.45);g.font='600 36px monospace';g.fillStyle='#e0702a';g.fillText('TX-221 · EUROPA LINES',S/2,S*.62)});
    const dm=bas({map:tx,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-4,side:T.DoubleSide});for(const s of[-1,1]){const pl=new T.Mesh(new T.PlaneGeometry(20,20),dm);pl.position.set(68,1,s*10.08);pl.rotation.y=s>0?0:Math.PI;g.add(pl)}}
  const blink=[];for(const[x,y,z,c]of[[93,0,7.5,0x30ff70],[93,0,-7.5,0xff3030],[-76,13,0,0xffffff],[0,10.6,-13,0xff3030],[0,10.6,13,0x30ff70]]){const q=glow(c,5,.9);q.position.set(x,y,z);g.add(q);blink.push(q)}
  const fires=[];for(const[x,y,z]of[[-10,9.5,12.6],[35,-9.5,8],[-55,12.5,-8],[60,2,-10.6],[20,9.5,-12.6]]){const f=glow(0xff7a2a,9,.9);f.position.set(x,y,z);f.userData.s=9;g.add(f);fires.push(f)}
  const ring=new T.Mesh(new T.TorusGeometry(10,.25,6,40),bas({color:0x5ccf6a,transparent:true,opacity:.7,fog:false}));ring.position.set(12,0,34);ring.visible=false;g.add(ring);
  for(let i=0;i<4;i++){const t=i*Math.PI/2,b=mesh(GEO.sph,SHM.green,.5,.5,.5,12+Math.cos(t)*5.6,Math.sin(t)*5.6,17.4);g.add(b)}
  const boxes=[[-75,-12,-15,55,12,15],[-48,-6,12,45,6,17.5],[-48,-6,-17.5,45,6,-12],[54,-8,-10,94,6,10],[-38,9,-7,-22,18,7],[-40,17,1,-32,33,9],[-36,-14,-1,31,-9,1]];
  return{g,fires,ring,blink,boxes,collar:new T.Vector3(12,0,34),pods:[[[-50,12.2,0],[0,1,0]],[[30,12.2,0],[0,1,0]],[[62,0,-10.2],[0,0,-1]],[[-15,-12.2,0],[0,-1,0]]]}}
function podModel(){const E=enemyShipKit(),g=new T.Group(),U=new T.Vector3(0,1,0);g.add(inst(kit('pod',a=>{a(GEO.cone,E.hull,2.2,5,2.2,0,4.1,0);a(GEO.cyl,E.hull,2.4,3.2,2.4,0,1.6,0);a(GEO.cyl,E.dark,2.8,.6,2.8,0,.3,0);
    for(let i=0;i<4;i++){const t=i*Math.PI/2+.4,d=new T.Vector3(Math.cos(t)*.7,-1,Math.sin(t)*.7).normalize();a(GEO.cone,E.dark,.35,2.6,.35,Math.cos(t)*2.4,-.4,Math.sin(t)*2.4,new T.Quaternion().setFromUnitVectors(U,d))}
    for(let i=0;i<3;i++){const t=i*2.094;a(GEO.sph,E.eye,.35,.35,.35,Math.cos(t)*2.2,2.6,Math.sin(t)*2.2);a(GEO.cyl,E.dark,.18,1.6,.18,Math.cos(t)*2.6,2.6,Math.sin(t)*2.6,0,-t,1.571)}a(GEO.tor,E.plate,2.5,2.5,2.5,0,3.3,0,1.571,0,0)}),false));
  const q=glow(0xff3a2a,6,.8);q.position.y=3;g.add(q);return g}
function shipPush(H,p,r){const o=H.g.position,a=H.g.rotation.y,c=Math.cos(a),sn=Math.sin(a),dx=p.x-o.x,dz=p.z-o.z,q={x:dx*c-dz*sn,y:p.y-o.y,z:dx*sn+dz*c};let hit=false;
  for(const b of H.boxes){const lx=b[0]-r,ly=b[1]-r,lz=b[2]-r,hx=b[3]+r,hy=b[4]+r,hz=b[5]+r;
    if(q.x>lx&&q.x<hx&&q.y>ly&&q.y<hy&&q.z>lz&&q.z<hz){const m=[q.x-lx,hx-q.x,q.y-ly,hy-q.y,q.z-lz,hz-q.z],k=m.indexOf(Math.min(...m));if(k===0)q.x=lx;else if(k===1)q.x=hx;else if(k===2)q.y=ly;else if(k===3)q.y=hy;else if(k===4)q.z=lz;else q.z=hz;hit=true;break}}
  if(!hit&&H.oboxes)for(const[cx,cy,cz,hx,hy,hz,an]of H.oboxes){const c2=Math.cos(an),s2=Math.sin(an),dx3=q.x-cx,dz3=q.z-cz,lx=dx3*c2-dz3*s2,lz=dx3*s2+dz3*c2,ly=q.y-cy;
    if(Math.abs(lx)<hx+r&&Math.abs(ly)<hy+r&&Math.abs(lz)<hz+r){const m=[hx+r-Math.abs(lx),hy+r-Math.abs(ly),hz+r-Math.abs(lz)],k=m.indexOf(Math.min(...m));let nx=lx,ny=ly,nz=lz;if(k===0)nx=Math.sign(lx||1)*(hx+r);else if(k===1)ny=Math.sign(ly||1)*(hy+r);else nz=Math.sign(lz||1)*(hz+r);
      q.x=cx+nx*c2+nz*s2;q.y=cy+ny;q.z=cz-nx*s2+nz*c2;hit=true;break}}
  if(!hit&&H.cyls)for(const[cx,cz,cr,y0,y1]of H.cyls){const dx2=q.x-cx,dz2=q.z-cz,rr=Math.hypot(dx2,dz2);if(rr<cr+r&&q.y>y0-r&&q.y<y1+r){const pr=cr+r-rr,pu=y1+r-q.y,pd=q.y-(y0-r);if(pr<=pu&&pr<=pd){const k=(cr+r)/(rr||1e-6);q.x=cx+dx2*k;q.z=cz+dz2*k}else if(pu<pd)q.y=y1+r;else q.y=y0-r;hit=true;break}}
  if(!hit&&H.tori)for(const[ty,R0,tb]of H.tori){const rr=Math.hypot(q.x,q.z)||1e-6,dy=q.y-ty,dr=rr-R0,dd=Math.hypot(dr,dy),lim=tb+r;if(dd<lim){const k=lim/(dd||1e-6);const nr=R0+dr*k;q.x*=nr/rr;q.z*=nr/rr;q.y=ty+dy*k;hit=true;break}}
  if(hit){p.x=o.x+q.x*c+q.z*sn;p.y=o.y+q.y;p.z=o.z-q.x*sn+q.z*c}return hit}
function flyCrash(S){const imp=S.spd;S.spd*=imp>45?.3:.6;if(!reduced)shake=Math.max(shake,imp>45?.4:.12);if(imp>45&&S.t-(S.crashT||-9)>.6){S.crashT=S.t;hurt(Math.min(60,imp*.14));sfx('boom');sparkle(S.pos,0xffd27a,16,10);if(msgT<=0)say('Hull impact',1)}}
// the next objective goes ahead of the shuttle, but never back toward Thalassa: if the nose points at the station, use the bearing away from it
function safeFw(S){const fw=new T.Vector3(-Math.sin(S.h),0,-Math.cos(S.h)),aw=new T.Vector3(S.pos.x,0,S.pos.z);if(aw.lengthSq()<1)aw.set(0,0,1);aw.normalize();if(fw.dot(aw)<.35)fw.copy(aw);return fw}
function aceModel(){const K=enemyShipKit(),g=new T.Group(),b=interceptorModel();b.scale.setScalar(1.7);g.add(b);
  g.add(inst(kit('ace',a=>{a(GEO.cyl,K.dark,.32,6,.32,0,-1.3,4.2,1.571,0,0);a(GEO.cyl,K.plate,.45,1.2,.45,0,-1.3,1.4,1.571,0,0);a(GEO.cyl,K.eye,.2,.2,.2,0,-1.3,7.25,1.571,0,0);
    for(const s of[-1,1]){a(GEO.cyl,K.plate,.42,3.2,.42,s*3.4,-.6,.6,1.571,0,0);a(GEO.cone,K.eye,.42,.8,.42,s*3.4,-.6,2.6,1.571,0,0);a(GEO.box,K.hull,.12,1.6,2.6,s*5.6,.5,-2.2,0,0,s*.3);a(GEO.box,K.dark,2.4,.14,1.2,s*2.4,-.3,-4.2)}}),true));
  for(const s of[-1,1]){const q=glow(0xff3a2a,6,.9);q.position.set(s*1.2,0,-6);g.add(q)}return g}
function aceMissile(S,e){const g=new T.Group();g.add(mesh(GEO.cyl,MAT.white,.3,2.2,.3,0,0,0),glow(0xff5030,4,.95));g.children[0].rotation.x=Math.PI/2;g.position.copy(e.p).addScaledVector(e.dir,6);scene.add(g);
  (S.emsl||(S.emsl=[])).push({g,p:g.position,dir:e.dir.clone(),spd:e.sp,t:12,turn:1.0,tr:0});tone('sawtooth',180,900,.35,.06);
  if(!S.mslTip){S.mslTip=1;comm('R',"It's launched a missile! Break hard and keep turning in tight circles!")}}
function stage2Setup(S){S.stage=2;$('wave').textContent='2-2';LAST={m:2,s:2};const fw=safeFw(S),c=S.pos.clone().addScaledVector(fw,2600);c.y=Math.max(-200,Math.min(300,S.pos.y));if(c.length()>11000)c.setLength(11000);
  const H=halcyonModel();H.g.position.copy(c);scene.add(H.g);H.g.updateMatrixWorld(true);S.halc=H;H.collarW=H.collar.clone().add(c);S.ph='approach';S.dock=0;S.dockWave=0;S.fireT=0;
  for(const[lp,n]of H.pods){const N=new T.Vector3(...n),e=flyEnemy('pod',c.x+lp[0]+N.x*1.2,c.y+lp[1]+N.y*1.2,c.z+lp[2]+N.z*1.2);e.g.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),N);e.cd=2}
  comm('C',"Kestrel, the Halcyon is two kilometres ahead. Boarding pods are clamped to her hull. Knock them off without hitting the ship.")}
function halcTick(S,dt){const H=S.halc;if(!H)return;if(H.blink)H.blink.forEach((q,i)=>q.visible=Math.sin(S.t*(i===2?9:3)+i)>.2);for(const f of H.fires)f.scale.setScalar(f.userData.s*(.75+Math.random()*.5));H.ring.visible=S.ph==='dock';if(H.ring.visible)H.ring.material.opacity=.45+.3*Math.sin(S.t*5);
  if(!H.fx){H.fx=1;for(const f of H.fires)PFX.emit(o=>{f.getWorldPosition(o);return true},{rate:9,dur:Infinity,alive:()=>FLY===S&&S.halc===H,far:2600,fs:[3,9],ss:[7,24],spread:2.5,fup:5,sup:1.5,fspd:3,flife:.9,slife:6,sp:.7,c0:.08,c1:.3,alpha:.75})}}
const WV1=new T.Vector3(),WV2=new T.Vector3(),WV3=new T.Vector3();
function wingSpawn(S,from){S.wing=[];for(const s of[-1,1]){const g=shuttleModel();g.scale.setScalar(.8);g.position.copy(from).add(WV1.set(s*14,4,10));scene.add(g);S.wing.push({g,p:g.position,dir:new T.Vector3(0,0,1),spd:40,cd:1,bt:0,burst:0,s})}}
function wingTick(S,dt){if(!S.wing)return;const fw=WV1.set(-Math.sin(S.h),0,-Math.cos(S.h)),rt=WV2.set(Math.cos(S.h),0,-Math.sin(S.h));
  for(const w of S.wing){let tgt=null,bd=1600;for(const e of S.en){if(e.kind==='mine')continue;const d=e.p.distanceTo(w.p);if(d<bd){bd=d;tgt=e}}let spd;const want=WV3;
    if(tgt){want.subVectors(tgt.p,w.p).normalize();spd=150;if(bd<110)want.addScaledVector(rt,w.s).normalize();if(bd<800&&w.dir.dot(want)>.97&&w.cd<=0){w.cd=1.3+Math.random();w.burst=6}}
    else{want.copy(S.pos).addScaledVector(rt,w.s*22).addScaledVector(fw,16);want.y-=3;want.sub(w.p);const d=want.length();if(d<5)want.copy(fw);else want.divideScalar(d);spd=Math.min(260,S.spd+d*1.2)}
    w.dir.lerp(want,Math.min(1,dt*2)).normalize();w.spd+=(spd-w.spd)*Math.min(1,dt*1.5);w.p.addScaledVector(w.dir,w.spd*dt);w.cd-=dt;w.bt-=dt;
    if(w.burst>0&&w.bt<=0&&tgt){w.bt=.09;w.burst--;const m=w.p.clone().addScaledVector(w.dir,6),ld=tgt.p.clone().sub(m).normalize();flyShot(m,ld,900,FTRC,7,.13,.6,true)}
    if(S.halc)shipPush(S.halc,w.p,3);if(S.meri)shipPush(S.meri,w.p,3);w.g.lookAt(w.p.x-w.dir.x,w.p.y-w.dir.y,w.p.z-w.dir.z);shuttleAnim(w.g,w.spd,false,0,8,1,false,dt)}}
function stage2Tick(S,dt){const H=S.halc;if(!H){setObj('STAGE 2-2 · STAND BY');return false}const hc=H.g.position,d=S.pos.distanceTo(hc),pods=S.en.filter(e=>e.kind==='pod').length;
  if(S.ph==='approach'){S.navP=hc;S.navL='HALCYON';if(d<1300){S.ph='pods';S.navP=null;comm('H',"Kestrel, this is Captain Varga of the Halcyon. They're cutting into our cargo deck. Please hurry.");comm('C',"Four pods, Kestrel, and interceptors flying cover. Watch your fire near the hull.");
      for(let i=0;i<4;i++)flyEnemy('int',hc.x+(Math.random()-.5)*900,hc.y+(Math.random()-.5)*300,hc.z+(Math.random()-.5)*900)}}
  else if(S.ph==='pods'){if(!S.en.length){S.ph='dock';S.dock=0;comm('H',"Pods are off! Our docking collar is on the starboard side, lights on. Bring her in slow.");say('Fly into the green ring slowly (under 45 mph) and hold still',4)}}
  else if(S.ph==='dock'){const P=H.collarW;S.navP=P;S.navL='DOCK';const dd=S.pos.distanceTo(P);if(dd<30&&S.spd<20)S.dock=Math.min(1,S.dock+dt/5);else S.dock=Math.max(0,S.dock-dt/6);
    if(S.dock>.15&&!S.dockWave){S.dockWave=1;comm('C',"More company inbound. Hold that dock, Kestrel.");for(let i=0;i<3;i++)flyEnemy('int',hc.x+(Math.random()-.5)*1400,hc.y+200,hc.z+1700+Math.random()*400)}
    if(S.dock>=1){S.ph='docked';S.endT=0;S.navP=null;sfx('pick');comm('H',"Hatch sealed. Fourteen crew coming across, and my two escort pilots are launching.");comm('R',"Welcome aboard, everyone. Mind the seed trays.");comm('H',"Moth and Ferro are yours, Kestrel. They will fly your wing to Meridian.");wingSpawn(S,P)}}
  else if(S.ph==='docked'){S.endT+=dt;if(S.endT>6&&!S.en.length){S.ph='w3';comm('C',"Last wave on the scope, with a gunboat. Clear it and the Halcyon can run.");
      for(let i=0;i<4;i++)flyEnemy('int',S.pos.x+(Math.random()-.5)*1200,S.pos.y+(Math.random()-.5)*400,S.pos.z+1600+Math.random()*500);flyEnemy('gun',hc.x,hc.y+120,hc.z-1600)}}
  else if(S.ph==='w3'){if(!S.en.length){S.ph='ace';comm('C',"Heavy contact inbound, fast. That's no interceptor. It's one of the Wellmonger's aces.");const f=new T.Vector3(-Math.sin(S.h),0,-Math.cos(S.h));const a=flyEnemy('ace',S.pos.x+f.x*2200,S.pos.y+120,S.pos.z+f.z*2200);a.cd=3;S.ace=a}}
  else if(S.ph==='ace'){if(!S.en.includes(S.ace)){S.ph='end2';S.endT=0;comm('C',"Ace down! Halcyon is clear. Good work, Kestrel. Meridian is waiting.");comm('H',"That flier gutted three of our escorts. Thank you, Kestrel.")}}
  else if(S.ph==='end2'){S.endT+=dt;if(S.endT>4&&!commCur&&!COMMS.length&&!VOICE.busy||S.endT>40){flyStageDone();return true}}
  const n=S.en.length;if(S.ph==='ace'&&S.ace){setObj('STAGE 2-2 · ACE · VANTH · BEAT THE MISSILES BY TURNING HARD',Math.max(0,S.ace.hp/S.ace.max));return false}setObj(S.ph==='approach'?'STAGE 2-2 · RESCUE · REACH THE HALCYON · '+Math.round(d)+' M':S.ph==='pods'?'STAGE 2-2 · DESTROY THE BOARDING PODS · '+pods+' LEFT'+(n>pods?' · '+(n-pods)+' FIGHTERS':''):
    S.ph==='dock'?'STAGE 2-2 · DOCK AT THE COLLAR · '+(S.dock>0?Math.round(S.dock*100)+'%':Math.round(S.pos.distanceTo(H.collarW))+' M · UNDER 45 MPH'):S.ph==='docked'?'STAGE 2-2 · SURVIVORS BOARDING':S.ph==='w3'?'STAGE 2-2 · PROTECT THE HALCYON · '+n+' LEFT':S.ph==='ace'?'STAGE 2-2 · ACE · VANTH'+(n>1?' · '+(n-1)+' MORE':''):S.ph==='free'?'FREE FLIGHT':'STAGE 2-2 · STAND BY · FLEET COMMAND');return false}
function flyStageDone(){const S=FLY,st=S.stage||1;if(document.pointerLockElement)document.exitPointerLock();setState('paused');for(const id of['ovKeys','classes','loadout','superpick'])$(id).hidden=true;saveM2(st);
  $('ovTitle').textContent=st===3?'Mission 2 complete':'Stage 2-'+st+' complete';
  const txt=st===1?'Kestrel is clear of Thalassa with '+S.kills+' kills. Next: stage 2-2, the rescue of the Halcyon.':st===2?'The Halcyon is safe, fourteen of her crew are aboard and the Wellmonger\'s ace is scrap. Moth and Ferro fly your wing. Next: stage 2-3, the run to Meridian Station.':
    'Kestrel is down in Meridian\'s bay three with Rowan, the Halcyon\'s crew and '+S.kills+' kills behind her. The Wellmonger knows your name now. Mission 3, the war on Europa, comes later.';$('ovText').textContent=txt;
  $('go').textContent=st===3?'Fly on (free flight)':'Continue to stage 2-'+(st+1);$('retry').hidden=false;$('retry').textContent='Retry stage 2-'+st;LAST={m:2,s:st};S.ph=st===1?'to2':st===2?'to3':'free';setObj(st===3?'FREE FLIGHT':'STAGE 2-'+(st+1)+' · STAND BY')}
// ---- stage 2-3: the run to Meridian Station. Original station: a spire, two counter-rotating rings, a docking bay and solar wings
// Meridian Station, after the owner's concept art: white and gold cathedral spires over stepped garden terraces, a mirrored spire
// hanging below, blue banners, a glass atrium with a gold armillary sphere, an orbital ring, and landing piers (pad 3 is the arrival)
// a cheap shuttle for background traffic: the real model merged into one mesh per material (shared), plus engine glows
let SLITE=null;function shuttleLite(){if(!SLITE){const sh=shuttleModel();try{shuttleAnim(sh,0,0,0,8,1,false,10)}catch(_){}sh.updateMatrixWorld(true);const by=new Map();
    sh.traverse(o=>{if(!o.isMesh||!o.geometry)return;for(let v=o;v;v=v.parent)if(!v.visible)return;const m=o.material;if(Array.isArray(m)||m.transparent||m.blending===T.AdditiveBlending)return;let ge=o.geometry.clone();ge.applyMatrix4(o.matrixWorld);if(ge.index)ge=ge.toNonIndexed();if(!ge.attributes.uv)ge.setAttribute('uv',new T.BufferAttribute(new Float32Array(ge.attributes.position.count*2),2));if(!by.has(m))by.set(m,[]);by.get(m).push(ge)});
    SLITE=[...by].map(([m,l])=>[m,mergeGeos(l)])}
  const g=new T.Group();for(const[m,ge]of SLITE)g.add(new T.Mesh(ge,m));for(const s of[-1,1]){const q=glow(0x9fe8ff,5,.9);q.position.set(s*1.4,0,6.2);g.add(q)}return g}
function meridianModel(){const SC=8,PLAT=[0,.8,-.8,2.25,-2.25],HANG=[.4,-.4,1.55,-1.55,2.85,-2.85],busy=t=>{const ta=Math.PI/2-t;return[...PLAT,...HANG].some(u=>Math.abs(Math.atan2(Math.sin(ta-u),Math.cos(ta-u)))<.14)};
  const M=shuttleMats(),G=new T.Group(),g=new T.Group(),W=(()=>{const m=M.hull.clone();m.color.setHex(0x9e9a90).convertSRGBToLinear();m.roughness=.62;m.metalness=.15;m.envMapIntensity=.25;return m})(),Gd=std({color:0xd9a441,roughness:.3,metalness:.9}),Dk=M.dark,Gl=M.glass,Sm=bas({color:0x8fe6ff}),Wn=bas({color:0xffd27a}),U=new T.Vector3(0,1,0);
  g.scale.setScalar(SC);G.add(g);
  const lathe=(pts,seg)=>new T.LatheGeometry(pts.map(([r,y])=>new T.Vector2(r,y)),seg||32);
  const emb=paint(256,(c,S)=>{c.fillStyle='#1d3570';c.fillRect(0,0,S,S);c.strokeStyle='#d9a441';c.fillStyle='#d9a441';c.lineWidth=6;c.strokeRect(10,10,S-20,S-20);
    c.beginPath();c.moveTo(S/2,S*.14);c.lineTo(S*.56,S*.52);c.lineTo(S/2,S*.62);c.lineTo(S*.44,S*.52);c.closePath();c.fill();c.fillRect(S*.36,S*.5,S*.28,S*.03);
    c.beginPath();c.arc(S/2,S*.66,S*.2,Math.PI*.1,Math.PI*.9);c.stroke();c.beginPath();c.arc(S/2,S*.72,S*.13,Math.PI*.15,Math.PI*.85);c.stroke();c.font='700 26px "Chakra Petch",sans-serif';c.textAlign='center';c.fillText('MERIDIAN',S/2,S*.93)});
  const BN=std({map:emb,roughness:.8,side:T.DoubleSide});const AT=std({color:0x6a5030,emissive:0xffa040,emissiveIntensity:.35,roughness:.15,metalness:.3,transparent:true,opacity:.8});
  greeble(g,'meri2',(a,R)=>{
    // stepped terraces, gold rims, the underside cone and the mirrored spire below
    a(new T.CylinderGeometry(150,146,6,64),W,1,1,1,0,-3,0);a(new T.CylinderGeometry(146,40,54,64,1,true),W,1,1,1,0,-33,0);a(lathe([[40,-60],[30,-110],[18,-170],[8,-215],[0,-240]]),W,1,1,1,0,0,0);
    a(new T.CylinderGeometry(105,108,14,64),W,1,1,1,0,7,0);a(new T.CylinderGeometry(62,65,16,48),W,1,1,1,0,22,0);
    for(const[r,y]of[[150,0],[106.5,14],[63.5,30],[148,-6]])a(new T.TorusGeometry(r,.7,6,96),Gd,1,1,1,0,y,0,Math.PI/2,0,0);
    // the central tower: a tall tapered spire with gold bands, cyan light seams and warm window rows
    a(lathe([[34,30],[30,70],[24,120],[17,170],[10,215],[5,250],[1.5,285],[0,300]]),W,1,1,1,0,0,0);for(const y of[70,120,170,215,250])a(new T.CylinderGeometry(y===70?30.6:y===120?24.6:y===170?17.6:y===215?10.6:5.6,y===70?30.6:y===120?24.6:y===170?17.6:y===215?10.6:5.6,2,32),Gd,1,1,1,0,y,0);
    for(let k=0;k<8;k++){const t=k*Math.PI/4,c=Math.cos(t),sn=Math.sin(t);for(const[r0,y0,r1,y1]of[[34,30,24,120],[24,120,10,215]]){const d=new T.Vector3((r1-r0)*c,y1-y0,(r1-r0)*sn),L=d.length();a(GEO.box,Sm,.5,L,.5,(r0+r1)/2*c*1.01,(y0+y1)/2,(r0+r1)/2*sn*1.01,new T.Quaternion().setFromUnitVectors(U,d.normalize()))}}
    for(let y=34;y<205;y+=3.2){const r=y<120?34-(y-30)*10/90:24-(y-120)*14/95;const n=y<120?28:18;for(let k=0;k<n;k++){const t=(k+.5)*Math.PI*2/n;if(k%7===0)continue;a(GEO.box,Wn,.25,.8,.7,Math.cos(t)*(r+.08),y,Math.sin(t)*(r+.08),0,-t,0)}}
    for(let k=0;k<8;k++){const t=k*Math.PI/4+Math.PI/8;a(GEO.box,W,5,90,1.2,Math.cos(t)*31,75,Math.sin(t)*31,0,-t+Math.PI/2,0);a(GEO.box,Gd,5.2,90,.4,Math.cos(t)*31,75,Math.sin(t)*31,0,-t+Math.PI/2,0)}
    for(const[y,r]of[[95,29],[145,21],[190,13.5]]){a(new T.CylinderGeometry(r+4,r+4,.8,40),W,1,1,1,0,y,0);a(new T.TorusGeometry(r+4,.25,4,48),Gd,1,1,1,0,y+.5,0,Math.PI/2,0,0)}
    for(let k=0;k<48;k++){const t=k*Math.PI/24;a(GEO.cyl,W,.8,10,.8,Math.cos(t)*103,19,Math.sin(t)*103);a(GEO.box,Gd,1.6,.6,1.6,Math.cos(t)*103,24.3,Math.sin(t)*103)}a(new T.TorusGeometry(103,.7,4,96),W,1,1,1,0,24.8,0,Math.PI/2,0,0);
    for(let k=0;k<6;k++){const t=k*Math.PI/3;a(new T.SphereGeometry(7,16,8,0,Math.PI*2,0,Math.PI/2),W,1,1,1,Math.cos(t)*48,30,Math.sin(t)*48);a(GEO.cone,Gd,.6,4,.6,Math.cos(t)*48,39,Math.sin(t)*48)}
    for(const[r,y,n]of[[149.5,.3,180],[106,14.3,120],[63,30.3,72]])for(let k=0;k<n;k++){const t=k*Math.PI*2/n;a(GEO.box,Wn,.5,.3,.5,Math.cos(t)*r,y,Math.sin(t)*r)}
    // secondary spires on the middle terrace, each with a mirrored spire under the main deck
    for(let k=0;k<6;k++){const t=k*Math.PI/3+Math.PI/6,x=Math.cos(t)*86,z=Math.sin(t)*86;if(z>60&&Math.abs(x)<30)continue;a(lathe([[12,0],[10,25],[7,55],[4,85],[1,108],[0,118]],20),W,1,1,1,x,14,z);a(new T.CylinderGeometry(10.5,10.5,1.5,20),Gd,1,1,1,x,40,z);a(GEO.cone,Gd,1.2,10,1.2,x,137,z);
      for(let y=20;y<60;y+=8)for(let q=0;q<6;q++){const u=q*Math.PI/3;a(GEO.box,Wn,.2,1.2,1,x+Math.cos(u)*(11.5-(y-14)*.08),14+y,z+Math.sin(u)*(11.5-(y-14)*.08),0,-u,0)}
      const x2=Math.cos(t)*120,z2=Math.sin(t)*120;a(lathe([[10,0],[7,-30],[3,-70],[0,-95]],16),W,1,1,1,x2,-6,z2);a(new T.CylinderGeometry(8,8,1.5,16),Gd,1,1,1,x2,-14,z2)}
    // bridges from the tower terrace to the spires
    for(let k=0;k<6;k++){const t=k*Math.PI/3+Math.PI/6;if(Math.sin(t)>.6)continue;a(GEO.box,W,6,2,26,Math.cos(t)*73,31,Math.sin(t)*73,0,-t+Math.PI/2,0);a(GEO.box,Gd,6.4,.4,26,Math.cos(t)*73,32.2,Math.sin(t)*73,0,-t+Math.PI/2,0)}
    // the glass atrium at the front of the tower with a gold armillary sphere inside
    a(new T.SphereGeometry(20,24,12,0,Math.PI*2,0,Math.PI/2),AT,1,1,1,0,14,84);for(let k=0;k<8;k++)a(new T.TorusGeometry(20,.35,4,24,Math.PI),Gd,1,1,1,0,14,84,0,k*Math.PI/8,0);a(GEO.cyl,Gd,1,10,1,0,19,84);
    // gardens, canopies and lamps on the deck
    for(let k=0;k<170;k++){const t=hash(k,71)*6.283,r=112+hash(k,72)*34;if(busy(t))continue;const x=Math.cos(t)*r,z=Math.sin(t)*r,h=1.6+hash(k,73)*1.8;a(GEO.cyl,Dk,.18,h,.18,x,h/2,z);a(GEO.ico,k%3?MAT.leaf:MAT.leafD,1.1+hash(k,74)*.8,1+hash(k,75)*.7,1.1+hash(k,74)*.8,x,h+.6,z)}
    for(let k=0;k<30;k++){const t=k*Math.PI/15+.05,x=Math.cos(t)*120,z=Math.sin(t)*120;if(busy(t))continue;a(GEO.box,M.white,4,.08,3,x,2,z,.15,-t,0);for(const o of[-1.8,1.8])a(GEO.cyl,Gd,.06,2,.06,x+Math.cos(-t)*o,1,z-Math.sin(-t)*o)}
  },true);
  // blue banners hanging from the deck rim
  for(let k=0;k<16;k++){const t=k*Math.PI/8+.1;if(busy(t))continue;const b=mesh(GEO.box,BN,7,26,.2,Math.cos(t)*151,-17,Math.sin(t)*151);b.rotation.y=-t+Math.PI/2;g.add(b);g.add(mesh(GEO.box,Gd,8,.6,.6,Math.cos(t)*151,-3.6,Math.sin(t)*151))}
  // the orbital ring with spokes (turns), and the armillary sphere (turns)
  const rings=[];{const r=new T.Group();r.position.y=165;g.add(r);const tor=new T.Mesh(new T.TorusGeometry(300,6,10,120),W);tor.rotation.x=Math.PI/2;r.add(tor);const tg=new T.Mesh(new T.TorusGeometry(300,6.6,4,120,Math.PI*.2),Gd);tg.rotation.x=Math.PI/2;r.add(tg);
    for(let k=0;k<4;k++){const sp=mesh(GEO.cyl,Gd,1.5,600,1.5,0,0,0);sp.rotation.z=Math.PI/2;sp.rotation.y=k*Math.PI/4;r.add(sp)}for(let k=0;k<24;k++){const t=k*Math.PI/12;r.add(mesh(GEO.box,Wn,3,1.2,3,Math.cos(t)*300,6.4,Math.sin(t)*300))}rings.push(r)}
  {const ar=new T.Group();ar.position.set(0,22,84);g.add(ar);for(let k=0;k<3;k++){const q=mesh(new T.TorusGeometry(8-k*1.6,.35,6,40),Gd,1,1,1);q.rotation.set(k*1.1,k*.7,0);ar.add(q)}ar.add(mesh(GEO.sph,Wn,2,2,2));const q=glow(0xffd27a,16,.7);ar.add(q);rings.push(ar)}
  const beacons=[];for(const[x,y,z]of[[0,302,0],[0,-242,0]]){const b=glow(0xff3030,40,.9);b.position.set(x,y,z);g.add(b);beacons.push(b)}
  const cyls=[[0,0,150,-6,0],[0,0,100,-40,-6],[0,0,45,-62,-40],[0,0,28,-150,-62],[0,0,12,-230,-150],[0,0,108,0,14],[0,0,65,14,30],[0,0,34,30,120],[0,0,24,120,170],[0,0,14,170,250],[0,0,6,250,300],[0,84,21,14,34]];
  for(let k=0;k<6;k++){const t=k*Math.PI/3+Math.PI/6,x=Math.cos(t)*86,z=Math.sin(t)*86;if(!(z>60&&Math.abs(x)<30))cyls.push([x,z,12,14,150]);cyls.push([Math.cos(t)*120,Math.sin(t)*120,10,-100,-6])}
  // ---- real-size detail round the deck rim (1,200 m out): landing platforms like the art, hangars, towers, parked and flying ships
  const RIM=150*SC,ob=[],P=(t,r,y,lat=0)=>new T.Vector3(Math.sin(t)*r+Math.cos(t)*lat,y,Math.cos(t)*r-Math.sin(t)*lat),U2=new T.Vector3(0,1,0);
  greeble(G,'meriX',(a,R)=>{const RB=(m,w,h,d,t,r,y,lat=0,b)=>{const p=P(t,r,y,lat);R(m,w,h,d,p.x,p.y,p.z,0,t,0,b)};
    for(const t of PLAT){RB(W,70,8,380,t,RIM+170,-4,0,1.5);RB(Dk,72,3,380,t,RIM+170,-9.5,0,.5);RB(Gd,72,1,4,t,RIM+361,-1,0,.3);
      for(const o of[-35.4,35.4]){RB(Gd,1,.6,380,t,RIM+170,2.6,o,.15);for(let r=RIM+12;r<RIM+358;r+=8)RB(Gd,.35,2.4,.35,t,r,1.2,o,.05)}
      for(let r=RIM+20;r<RIM+360;r+=16)for(const o of[-32,32])RB(Wn,1.2,.35,1.2,t,r,.18,o,.1);for(let r=RIM+20;r<RIM+360;r+=40)RB(Wn,.6,.2,24,t,r,.12,0,.05);
      for(let k=0;k<5;k++){const r=RIM+30+k*75;for(const o of[-26,26]){const p0=P(t,r,-10,o),p1=P(t,RIM-40,-80,o*.4),d=p1.clone().sub(p0),L=d.length();a(GEO.cyl,Dk,1.4,L,1.4,(p0.x+p1.x)/2,(p0.y+p1.y)/2,(p0.z+p1.z)/2,new T.Quaternion().setFromUnitVectors(U2,d.normalize()))}}
      for(const r of[RIM+230,RIM+310]){const p=P(t,r,0);a(GEO.cyl,Dk,24,.5,24,p.x,.1,p.z);a(new T.TorusGeometry(24,.6,6,48),Sm,1,1,1,p.x,.5,p.z,Math.PI/2,0,0);a(new T.TorusGeometry(15,.3,4,40),M.trim,1,1,1,p.x,.45,p.z,Math.PI/2,0,0);for(let k=0;k<12;k++){const u=k*Math.PI/6;a(GEO.box,Sm,1.2,.5,1.2,p.x+Math.cos(u)*26.5,.45,p.z+Math.sin(u)*26.5)}}
      {const p=P(t,RIM+40,0,24);R(W,16,36,16,p.x,18,p.z,0,t,0,1);R(Gl,17,4,17,p.x,31,p.z,0,t,0,.5);R(Gd,18.4,1,18.4,p.x,36.5,p.z,0,t,0,.3);R(W,10,6,10,p.x,40,p.z,0,t,0,.5);a(GEO.cyl,Dk,.35,16,.35,p.x,51,p.z);a(GEO.sph,M.white,2.4,1,2.4,p.x,44,p.z+3);
        for(let y=4;y<28;y+=4)for(const s2 of[-1,1])R(Wn,.3,1.4,1.2,p.x+Math.cos(t)*8.1*s2,y,p.z-Math.sin(t)*8.1*s2,0,t,0,.05);ob.push([p.x,18,p.z,8,18.5,8,t])}
      for(let k=0;k<8;k++){const p=P(t,RIM+64+(k>>1)*12,0,-24+(k%2)*7);R(k%3?Dk:M.trim,6,5,11,p.x,2.5+(k%5===0?5:0),p.z,0,t,0,.4)}
      {const p=P(t,RIM+150,0,-30);R(Gd,2,32,2,p.x,16,p.z,0,t,0,.3);const q=P(t,RIM+150,32,-16);R(Gd,30,2,2,q.x,32,q.z,0,t,0,.3);a(GEO.cyl,Dk,.12,14,.12,q.x+Math.cos(t)*12,25,q.z-Math.sin(t)*12);R(Dk,3,2,3,q.x+Math.cos(t)*12,18,q.z-Math.sin(t)*12,0,t,0,.2)}
      ob.push([...P(t,RIM+170,-5).toArray(),35,5.5,190,t])}
    for(const t of HANG){RB(W,170,64,8,t,RIM-122,32,0,1);for(const o of[-85,85])RB(W,8,64,124,t,RIM-60,32,o,1);RB(W,178,8,128,t,RIM-60,68,0,1);RB(Dk,160,.4,116,t,RIM-60,.25,0,.1);
      for(let k=-3;k<=3;k++)RB(Wn,1.6,.3,108,t,RIM-60,.5,k*20,.05);RB(Gd,178,5,5,t,RIM+3,63,0,.5);for(const o of[-86,86])RB(Gd,5,64,5,t,RIM+3,32,o,.5);for(let k=0;k<8;k++)RB(Wn,12,2,1,t,RIM-117,52,-70+k*20,.1);
      RB(Dk,150,22,4,t,RIM-116,11,0,.4);for(let k=0;k<5;k++)RB(M.trim,10,6,14,t,RIM-100,3,-60+k*30,.3);for(let r=RIM-110;r<RIM-5;r+=14)RB(Gd,170,1.2,1.2,t,r,64,0,.1);
      ob.push([...P(t,RIM-122,32).toArray(),85,32,4,t]);for(const o of[-85,85])ob.push([...P(t,RIM-60,32,o).toArray(),4,32,62,t]);ob.push([...P(t,RIM-60,68).toArray(),89,4,64,t])}},true);
  // pad and hangar numbers
  const num=(txt,col)=>bas({map:paint(256,(c,S)=>{c.clearRect(0,0,S,S);c.fillStyle=col;c.font='700 150px "Chakra Petch",sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(txt,S/2,S/2)}),transparent:true,depthWrite:false,side:T.DoubleSide});
  let pn=1;for(const t of PLAT)for(const r of[RIM+230,RIM+310]){const id=t===0&&r===RIM+310?3:(pn===3?++pn:pn);if(id!==3)pn++;const pl=new T.Mesh(new T.PlaneGeometry(16,16),num(String(id),id===3?'#ffd27a':'#cfd6da'));pl.rotation.set(-Math.PI/2,0,t+Math.PI);pl.position.copy(P(t,r,.55));G.add(pl)}
  HANG.forEach((t,k)=>{const pl=new T.Mesh(new T.PlaneGeometry(30,30),num('H'+(k+1),'#d9a441'));pl.position.copy(P(t,RIM+6,56));pl.rotation.y=t;G.add(pl);const q=glow(0xffd27a,90,.25);q.position.copy(P(t,RIM-60,30));G.add(q)});
  // parked ships on the platforms and in the hangars, merged into one mesh per material
  {const by=new Map(),spots=[];for(const t of PLAT){spots.push([P(t,RIM+230,2.2),t]);if(t!==0)spots.push([P(t,RIM+310,2.2),t])}for(const t of HANG.slice(0,4))spots.push([P(t,RIM-70,2.2),t+Math.PI]);
    for(const[p,t]of spots){const sh=shuttleModel();sh.position.copy(p);sh.rotation.y=t+Math.PI;try{shuttleAnim(sh,0,0,0,8,1,true,10)}catch(_){}sh.updateMatrixWorld(true);
      sh.traverse(o=>{if(!o.isMesh||!o.geometry)return;for(let v=o;v;v=v.parent)if(!v.visible)return;const m=o.material;if(Array.isArray(m)||m.transparent||m.blending===T.AdditiveBlending)return;let ge=o.geometry.clone();ge.applyMatrix4(o.matrixWorld);if(ge.index)ge=ge.toNonIndexed();if(!ge.attributes.uv)ge.setAttribute('uv',new T.BufferAttribute(new Float32Array(ge.attributes.position.count*2),2));if(!by.has(m))by.set(m,[]);by.get(m).push(ge)})}
    for(const[m,l]of by)G.add(new T.Mesh(mergeGeos(l),m))}
  // platform-tip beacons and traffic flying slow loops round the station
  for(const t of PLAT){const q=glow(0xffb238,30,.9);q.position.copy(P(t,RIM+362,6));G.add(q);beacons.push(q)}
  const traffic=[];for(let k=0;k<6;k++){const sh=shuttleLite();G.add(sh);traffic.push({g:sh,a:k*1.05,r:1500+k*260,y:120+k*90,w:(k%2?1:-1)*(55+k*6)/(1500+k*260)})}
  return{g:G,rings,beacons,traffic,tori:[[165*SC,300*SC,7*SC]],cyls:cyls.map(c=>c.map(v=>v*SC)),oboxes:ob,boxes:[],bay:P(0,RIM+330,34),land:P(0,RIM+310,2.6)}}

function mineModel(){const E=enemyShipKit(),g=new T.Group();g.add(inst(kit('mine',a=>{a(GEO.ico,E.hull,2.2,2.2,2.2);for(let i=0;i<8;i++){const d=new T.Vector3(Math.sin(i*2.4)*Math.cos(i),Math.cos(i*1.3),Math.sin(i)*.9).normalize();a(GEO.cone,E.dark,.3,1.6,.3,d.x*2.4,d.y*2.4,d.z*2.4,new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),d))}}),false));
  const q=glow(0xff3030,7,.8);g.add(q);return g}
function jumpFx(t,sub){let d=document.getElementById('jumpfx');if(!d){d=document.createElement('div');d.id='jumpfx';d.style.cssText='position:absolute;inset:0;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:#dcebe4;font:700 26px "Chakra Petch",sans-serif;letter-spacing:.3em;pointer-events:none;z-index:5;opacity:0';cv.parentElement.appendChild(d)}
  d.innerHTML='<div>'+t+'</div><div style="font:12px monospace;letter-spacing:.2em;color:#86a39e">'+sub+'</div>';d.style.transition='none';d.style.opacity='1';setTimeout(()=>{d.style.transition='opacity 1.8s';d.style.opacity='0'},1500)}
function stage3Setup(S){worldShow(false);S.noHull=true;if(S.halc){scene.remove(S.halc.g);S.halc=null}for(const e of S.en)scene.remove(e.g);S.en.length=0;for(const q of S.shots)scene.remove(q.g);S.shots.length=0;PFX.clear();jumpFx('TRANSIT','MERIDIAN APPROACH · STAGE 2-3');sfx('nova');
  if(S.wing)S.wing.forEach((w,i)=>{w.p.copy(S.pos).add(new T.Vector3((i?1:-1)*22,-3,20).applyAxisAngle(new T.Vector3(0,1,0),S.h));w.dir.set(-Math.sin(S.h),0,-Math.cos(S.h));w.spd=S.spd});S.stage=3;$('wave').textContent='2-3';LAST={m:2,s:3};S.navP=null;const fw=safeFw(S),A=S.pos.clone();A.y=Math.max(-200,Math.min(300,A.y));
  const M=meridianModel(),mp=A.clone().addScaledVector(fw,10000);M.g.position.copy(mp);M.g.rotation.y=Math.atan2(-fw.x,-fw.z);scene.add(M.g);M.g.updateMatrixWorld(true);S.meri=M;M.bayW=M.bay.clone().applyMatrix4(M.g.matrixWorld);
  S.r3={A,fw,rt:new T.Vector3(-fw.z,0,fw.x),blk:0,gun:0,chase:0};S.ph='run';S.endT=0;S.turT=0;
  const P=(along,lat,up)=>A.clone().addScaledVector(fw,along).addScaledVector(S.r3.rt,lat).add(new T.Vector3(0,up,0));
  for(let i=0;i<48;i++){const p=P(2500+hash(i,61)*3000,(hash(i,62)-.5)*(i%3?520:140),(hash(i,63)-.5)*(i%3?220:70));flyEnemy('mine',p.x,p.y,p.z)}
  for(const lat of[-500,0,500]){const p=P(5600,lat,40);const e=flyEnemy('gun',p.x,p.y,p.z);e.sp=8;e.cd=3}
  comm('C',"Kestrel, Meridian is eight kilometres out. The Wellmonger's blockade sits across the lane, with a minefield in front of it. Burn hard and don't stop.")}
function meriTick(S,dt){const M=S.meri;if(!M)return;if(M.traffic)for(const q of M.traffic){q.a+=q.w*dt;const x=Math.sin(q.a)*q.r,z=Math.cos(q.a)*q.r,dx=Math.cos(q.a)*q.w,dz=-Math.sin(q.a)*q.w;q.g.position.set(x,q.y+Math.sin(q.a*3)*30,z);q.g.rotation.y=Math.atan2(-dx,-dz);}M.rings[0].rotation.y+=dt*.05;M.rings[1].rotation.y-=dt*.05;for(const b of M.beacons)b.visible=Math.sin(S.t*3)>0;
  // Meridian's guns cover the last two kilometres
  if(S.ph==='cover'||S.ph==='arrive'){S.turT-=dt;if(S.turT<=0){S.turT=.35;const mp=M.g.position;let best=null,bd=2600;for(const e of S.en){if(e.kind==='mine')continue;const d=e.p.distanceTo(mp);if(d<bd){bd=d;best=e}}
      if(best){const from=mp.clone().add(new T.Vector3((Math.random()-.5)*1600,Math.random()*500,(Math.random()-.5)*1600)),dir=best.p.clone().sub(from).normalize();flyShot(from,dir,1600,FTRC,14,.5,4,true)}}}}
function stage3Tick(S,dt){const M=S.meri,R3=S.r3;if(!M){setObj('STAGE 2-3 · STAND BY');return false}const along=fv1.subVectors(S.pos,R3.A).dot(R3.fw),left=Math.max(0,Math.round(S.pos.distanceTo(M.bayW)));S.navP=M.bayW;S.navL='MERIDIAN';
  const P=(al,lat,up)=>R3.A.clone().addScaledVector(R3.fw,al).addScaledVector(R3.rt,lat).add(new T.Vector3(0,up,0));
  if(S.ph==='run'){if(along>1800&&!R3.blk){R3.blk=1;comm('R',"Mines. Lovely. Don't touch the red ones.");comm('C',"Blockade guns are tracking you. Gunboats on the line, interceptors launching.");for(let i=0;i<6;i++){const p=P(4200+Math.random()*600,(Math.random()-.5)*900,(Math.random()-.5)*300);flyEnemy('int',p.x,p.y,p.z)}}
    if(along>5800){S.ph='cover';comm('C',"You're through! Meridian's guns are covering you now. Get inside, bay three.");for(let i=0;i<4;i++){const p=P(along-1400,(Math.random()-.5)*600,(Math.random()-.5)*200);flyEnemy('int',p.x,p.y,p.z)}}}
  else if(S.ph==='cover'){if(S.pos.distanceTo(M.bayW)<90){S.ph='arrive';S.endT=0;S.thr=0;for(const e of S.en.slice())if(e.kind==='mine'){scene.remove(e.g);S.en.splice(S.en.indexOf(e),1)}
      comm('C',"Kestrel, welcome to Meridian. Bay three is yours. Take her in.");comm('R',"We made it. Imani, if you can hear this, we made it.");comm('C',"Good flying, Kestrel. The Wellmonger knows your name now. Get some rest.")}}
  else if(S.ph==='arrive'){S.endT+=dt;S.thr=0;S.spd=Math.min(S.spd,12);for(const e of S.en.slice())if(e.p.distanceTo(S.pos)<2500)flyHit(e,99);
    const inside=(M.land||M.bay.clone().setZ(70)).clone().applyMatrix4(M.g.matrixWorld),tg=S.lined||S.pos.distanceTo(M.bayW)<10?inside:M.bayW;if(tg===inside)S.lined=1;S.pos.lerp(tg,Math.min(1,dt*(tg===inside?.5:.8)));S.h+=ad(M.g.rotation.y,S.h)*Math.min(1,dt*2);yaw=S.h;S.p*=.9;pitch=S.p;
    if(S.endT>4&&!commCur&&!COMMS.length&&!VOICE.busy||S.endT>30){flyStageDone();return true}}
  const n=S.en.filter(e=>e.kind!=='mine').length;setObj(S.ph==='run'?'STAGE 2-3 · RUN TO MERIDIAN · '+left.toLocaleString()+' M'+(along<5800?' · BLOCKADE AT '+Math.max(0,Math.round(5600-along)).toLocaleString()+' M':''):S.ph==='cover'?'STAGE 2-3 · REACH BAY THREE · '+left.toLocaleString()+' M'+(n?' · '+n+' CHASING':''):S.ph==='arrive'?'STAGE 2-3 · DOCKING AT MERIDIAN':S.ph==='free'?'FREE FLIGHT':'STAGE 2-3');return false}
function flyTick(dt){const S=FLY;S.t+=dt;
  // controls: the shuttle turns toward where the camera aims
  if(keys.KeyW||keys.ArrowUp&&false||mvY<-.35)S.thr=Math.min(1,S.thr+.55*dt);if(keys.KeyS||mvY>.35)S.thr=Math.max(0,S.thr-.8*dt);
  if(keys.KeyA)yaw+=1.3*dt;if(keys.KeyD)yaw-=1.3*dt;if(keys.ArrowLeft)yaw+=1.3*dt;if(keys.ArrowRight)yaw-=1.3*dt;if(keys.ArrowUp)pitch=Math.min(1.45,pitch+dt);if(keys.ArrowDown)pitch=Math.max(-1.45,pitch-dt);
  const near=!S.noHull&&nearHull(S.pos),bk=(keys.ShiftLeft||keys.ShiftRight)&&S.boost>0.02&&!near;if(bk)S.boost=Math.max(0,S.boost-dt/6);else S.boost=Math.min(1,S.boost+dt/9);
  let tgt=bk?224:S.thr*140;if(keys.Space)tgt=0;if(near)tgt=Math.min(tgt,40);S.spd+=(tgt-S.spd)*Math.min(1,dt*(tgt>S.spd?(bk?1.3:.75):(keys.Space?2.2:.8)));
  const dh=ad(yaw,S.h),dp=pitch-S.p,rt=1.75*dt;S.h+=Math.max(-rt,Math.min(rt,dh));S.p+=Math.max(-rt,Math.min(rt,dp));S.roll+=(c1(dh*1.6)*.95-S.roll)*Math.min(1,dt*4);
  const cp=Math.cos(S.p);S.vel.set(-Math.sin(S.h)*cp,Math.sin(S.p),-Math.cos(S.h)*cp).multiplyScalar(S.spd);
  // around Thalassa, move in short steps and push out of the hull so nothing can be flown through, even at 500 mph
  if(!S.noHull&&(hullZone(S.pos)||hullZone(fv1.copy(S.pos).addScaledVector(S.vel,dt)))){const L=S.spd*dt,nst=Math.max(1,Math.ceil(L/1.5));let hit=false;
    for(let k=0;k<nst;k++){S.pos.addScaledVector(S.vel,dt/nst);const bx=S.pos.x,by=S.pos.y,bz=S.pos.z;pushOut(S.pos,2.4,true);if(inHull(S.pos.x,S.pos.z)&&S.pos.y<2.6&&S.pos.y>-4)S.pos.y=2.6;if(Math.abs(S.pos.x-bx)+Math.abs(S.pos.y-by)+Math.abs(S.pos.z-bz)>1e-3){hit=true;break}}
    if(hit){const imp=S.spd;S.spd*=imp>45?.3:.6;if(!reduced)shake=Math.max(shake,imp>45?.4:.12);if(imp>45&&S.t-(S.crashT||-9)>.6){S.crashT=S.t;hurt(Math.min(60,imp*.14));sfx('boom');sparkle(S.pos,0xffd27a,16,10);if(msgT<=0)say('Hull impact',1)}}}
  else S.pos.addScaledVector(S.vel,dt);
  if(S.halc&&shipPush(S.halc,S.pos,2.4))flyCrash(S);if(S.meri&&shipPush(S.meri,S.pos,2.4))flyCrash(S);
  // no wall at the edge of the operation area: Fleet Command calls you back, and far out the autopilot turns you round
  {const R=S.pos.length(),LIM=S.stage===3?30000:15000;if(R>LIM&&S.t-(S.farT||-99)>12){S.farT=S.t;comm('C',"Kestrel, you are leaving the operation area. Come about.")}if(R>LIM+4000){const tw=Math.atan2(S.pos.x,S.pos.z);yaw+=ad(tw,yaw)*Math.min(1,dt*.8);pitch+=(-Math.atan2(S.pos.y,Math.hypot(S.pos.x,S.pos.z))-pitch)*Math.min(1,dt*.8)}}
  S.g.position.copy(S.pos);S.g.rotation.set(S.p,S.h,S.roll);shuttleAnim(S.g,S.spd,bk,S.roll,S.msl,S.mac,S.ph==='hangar'&&S.spd<10,dt);
  pos.copy(S.pos);eye.copy(S.pos);vy=0;
  if(hp<50&&!S.smk){S.smk=PFX.emit(o=>{o.set(0,.2,3.4).applyEuler(S.g.rotation).add(S.pos);return true},{rate:22,dur:Infinity,alive:()=>{const ok=FLY===S&&hp<50;if(!ok)S.smk=null;return ok},fire:false,ss:[1,4.5],sup:0,slife:2.4,far:800,c0:.12,c1:.38,alpha:.65})}
  if(S.smk)S.smk.fire=hp<25;
  if(shDelay>0)shDelay-=dt;else shield=Math.min(shMax,shield+15*dt);
  if(!eng)engineOn();if(eng){eng.o.frequency.value=38+S.spd*.55;eng.g.gain.value=muted?0:0.035*CFG.vol}
  // weapons
  S.gcd-=dt;S.mcd-=dt;S.mac=Math.max(0,S.mac-dt);S.over=Math.max(0,S.over-dt);S.heat=Math.max(0,S.heat-28*dt);if(S.msl<8){S.mslT+=dt;if(S.mslT>4){S.mslT=0;S.msl++}}
  const aim=flyAim(fv3.clone()),conv=cam.position.clone().addScaledVector(aim,700);
  if((firing||padFire)&&S.gcd<=0&&S.over<=0&&S.ph!=='hangar'){S.gcd=.07;S.gside=-S.gside;const m=fUp.set(S.gside*2.3,-.5,-3.2).applyEuler(S.g.rotation).add(S.pos).clone(),d=conv.clone().sub(m).normalize();
    d.x+=(Math.random()-.5)*.006;d.y+=(Math.random()-.5)*.006;d.normalize();flyShot(m,d,900+S.spd,FTRC,7,.13,1,true);S.heat+=4.2;if(S.heat>=100){S.over=1.6;S.heat=100;say('Guns overheated',1)}tone('square',220,90,.05,.025)}
  // lock: the enemy nearest the centre of the screen, inside a 12 degree cone
  {let best=null,bd=.978;for(const e of S.en){if(e.kind==='mine')continue;fv1.subVectors(e.p,cam.position);const d=fv1.length();if(d>1900)continue;const c=fv1.dot(aim)/d;if(c>bd){bd=c;best=e}}
    if(best&&best===S.lockE)S.lockP+=dt;else{S.lockE=best;S.lockP=0}if(S.lockE&&S.lockP>=.6&&!S.tipLock){S.tipLock=1;say('Locked · G fires a homing missile · F fires the heavy cannon',3.5)}}
  // shots
  for(let i=S.shots.length-1;i>=0;i--){const q=S.shots[i];q.prev.copy(q.p);q.p.addScaledVector(q.v,dt);q.t-=dt;let gone=q.t<=0;
    if(q.mine){for(const e of S.en){if(segDist(q.prev,q.p,e.p)<e.r){flyHit(e,q.dmg);gone=true;break}}}
    else if(segDist(q.prev,q.p,S.pos)<3.6){hurt(q.dmg);gone=true;if(state!=='playing')return}
    if(gone){scene.remove(q.g);S.shots.splice(i,1)}}
  for(let i=S.msls.length-1;i>=0;i--){const m=S.msls[i];m.t-=dt;m.spd=Math.min(320,m.spd+160*dt);if(m.tgt&&S.en.includes(m.tgt)){fv1.subVectors(m.tgt.p,m.p).normalize();m.dir.lerp(fv1,Math.min(1,dt*3.2)).normalize()}
    m.p.addScaledVector(m.dir,m.spd*dt);m.g.lookAt(m.p.x+m.dir.x,m.p.y+m.dir.y,m.p.z+m.dir.z);m.trail-=dt;if(m.trail<=0){m.trail=.04;sparkle(m.p,0xc8c8c8,1,1.5)}
    let boom=m.t<=0;for(const e of S.en)if(e.p.distanceTo(m.p)<e.r+6){boom=true;break}
    if(boom){flyBoom(m.p,1.1);for(const e of S.en.slice()){const d=e.p.distanceTo(m.p);if(d<e.r+26)flyHit(e,d<e.r+8?14:7)}scene.remove(m.g);S.msls.splice(i,1)}}
  for(let i=S.beams.length-1;i>=0;i--){const b=S.beams[i];b.t-=dt;b.g.material.opacity=Math.max(0,b.t/.28);if(b.t<=0){scene.remove(b.g);scene.remove(b.fl);S.beams.splice(i,1)}}
  // enemy homing missiles
  S.warn=false;S.warnD=1e9;if(S.emsl)for(let i=S.emsl.length-1;i>=0;i--){const m=S.emsl[i];m.t-=dt;m.spd=Math.min(270,m.spd+90*dt);fv1.subVectors(S.pos,m.p);const dd=fv1.length();fv1.divideScalar(dd||1);
    const ang=Math.acos(Math.max(-1,Math.min(1,m.dir.dot(fv1)))),mx=m.turn*dt;if(ang>1e-4)m.dir.lerp(fv1,Math.min(1,mx/ang)).normalize();m.p.addScaledVector(m.dir,m.spd*dt);m.g.lookAt(m.p.x+m.dir.x,m.p.y+m.dir.y,m.p.z+m.dir.z);
    m.tr-=dt;if(m.tr<=0){m.tr=.03;PFX.smoke(m.p,{n:1,spd:.2,size:[.8,3],life:1.4,up:0,c0:.55,c1:.8,alpha:.5})}
    if(dd<2500&&m.t>0){S.warn=true;S.warnD=Math.min(S.warnD,dd)}
    if(dd<9){flyBoom(m.p,1.2);scene.remove(m.g);S.emsl.splice(i,1);hurt(30);if(msgT<=0)say('Missile hit',1);if(state!=='playing')return;continue}
    if(m.t<=0){flyBoom(m.p,.8);scene.remove(m.g);S.emsl.splice(i,1)}}
  if(S.warn){S.beep=(S.beep||0)-dt;if(S.beep<=0){S.beep=.12+Math.min(.5,S.warnD/2500*.5);tone('square',1500,1500,.05,.035)}}
  // enemies
  for(const e of S.en.slice()){const to=fv1.subVectors(S.pos,e.p),d=to.length()||1;e.cd-=dt;e.bt-=dt;
    if(e.kind==='int'){if(e.st==='break'){e.t-=dt;fv2.copy(e.bdir);if(e.t<=0)e.st='attack'}else{fv2.copy(to).addScaledVector(S.vel,d/450).normalize();if(d<170){e.st='break';e.t=1.6+Math.random()*1.6;e.bdir.set(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize().addScaledVector(e.dir,.6).normalize()}}
      e.dir.lerp(fv2,Math.min(1,dt*1.5)).normalize();e.p.addScaledVector(e.dir,e.sp*dt);
      if(e.st==='attack'&&d<850&&e.dir.dot(fv2.copy(to).divideScalar(d))>.975&&e.cd<=0){e.cd=2.2+Math.random()*1.2;e.burst=3}
      if(e.burst>0&&e.bt<=0){e.bt=.12;e.burst--;const ld=fv2.copy(to).addScaledVector(S.vel,d/520).normalize();ld.x+=(Math.random()-.5)*.03;ld.y+=(Math.random()-.5)*.03;ld.normalize();flyShot(e.p.clone().addScaledVector(e.dir,4),ld,520,FBOLT,4,.3,5,false)}}
    else if(e.kind==='ace'){const A=e.ace||(e.ace={mt:5});A.mt-=dt;
      // attack runs, a hard break past you, then round again
      if(e.st==='break'){e.t-=dt;fv2.copy(e.bdir);if(e.t<=0)e.st='attack'}else{fv2.copy(to).addScaledVector(S.vel,d/600).normalize();if(d<230){e.st='break';e.t=2+Math.random()*1.4;e.bdir.set(Math.random()-.5,(Math.random()-.5)*.6,Math.random()-.5).normalize().addScaledVector(e.dir,.8).normalize()}}
      e.dir.lerp(fv2,Math.min(1,dt*1.8)).normalize();e.p.addScaledVector(e.dir,e.sp*dt);
      // heavy cannon: two big, slow rounds on each lined-up pass
      if(e.st==='attack'&&d<1000&&e.dir.dot(fv2.copy(to).divideScalar(d))>.96&&e.cd<=0){e.cd=2.4;e.burst=2}
      if(e.burst>0&&e.bt<=0){e.bt=.28;e.burst--;const ld=fv2.copy(to).addScaledVector(S.vel,d/420).normalize(),g=new T.Group();g.add(mesh(GEO.sph,FPLAS,.9,.9,.9),glow(0xff7a2a,7,.9));g.position.copy(e.p).addScaledVector(e.dir,8);scene.add(g);
        S.shots.push({g,p:g.position,v:ld.clone().multiplyScalar(420),t:4,dmg:14,mine:false,prev:g.position.clone()});sfx('spit')}
      // a homing missile about every ten seconds
      if(A.mt<=0&&d<1800){A.mt=9+Math.random()*3;aceMissile(S,e)}}
    else if(e.kind==='mine'){e.g.rotation.y+=dt*.6;if(d<160)e.p.addScaledVector(to,Math.min(d,40*dt)/d);if(d<24){flyBoom(e.p,1.6);scene.remove(e.g);S.en.splice(S.en.indexOf(e),1);hurt(18);if(state!=='playing')return;continue}}
    else if(e.kind==='pod'){if(d<900&&e.cd<=0){e.cd=1.8+Math.random();e.burst=4}if(e.burst>0&&e.bt<=0){e.bt=.15;e.burst--;const ld=fv2.copy(to).addScaledVector(S.vel,d/480).normalize();ld.x+=(Math.random()-.5)*.04;ld.y+=(Math.random()-.5)*.04;ld.normalize();flyShot(e.p.clone().addScaledVector(ld,4),ld,480,FBOLT,4,.3,4,false)}}
    else{const want=fv2.copy(to);if(d<650)want.cross(fUp.set(0,1,0));want.normalize();e.dir.lerp(want,Math.min(1,dt*.6)).normalize();e.p.addScaledVector(e.dir,e.sp*dt);
      if(d<1300&&e.cd<=0){e.cd=1.7;const ld=fv2.copy(to).addScaledVector(S.vel,d/300).normalize();const g=new T.Group();g.add(mesh(GEO.sph,FPLAS,1.2,1.2,1.2),glow(0xff6a2a,9,.9));g.position.copy(e.p);g.lookAt(e.p.x+ld.x,e.p.y+ld.y,e.p.z+ld.z);scene.add(g);
        S.shots.push({g,p:g.position,v:ld.clone().multiplyScalar(300),t:6,dmg:9,mine:false,prev:e.p.clone()});sfx('spit')}}
    if(!S.noHull&&hullZone(e.p))pushOut(e.p,e.r,true);
    {const dd=e.p.distanceTo(S.pos);if(dd<e.r+2.6&&S.t-(e.ramT||-9)>.5){e.ramT=S.t;fv2.subVectors(S.pos,e.p).normalize();S.pos.addScaledVector(fv2,e.r+2.8-dd);hurt(e.kind==='gun'?30:24);S.spd*=e.kind==='gun'?.3:.55;if(!reduced)shake=Math.max(shake,.45);sfx('boom');if(msgT<=0)say('Collision',1);flyHit(e,e.kind==='gun'?8:99);if(state!=='playing')return;continue}}
    if(e.kind!=='pod'&&e.kind!=='mine')e.g.lookAt(e.p.x+e.dir.x,e.p.y+e.dir.y,e.p.z+e.dir.z)}
  if(S.ph==='to2')stage2Setup(S);if(S.ph==='to3')stage3Setup(S);
  wingTick(S,dt);halcTick(S,dt);meriTick(S,dt);
  // the stage
  if(S.stage===3){if(stage3Tick(S,dt))return}else if(S.stage===2){if(stage2Tick(S,dt))return}else{
  if(S.ph==='hangar'&&S.pos.z>330){S.ph='w1';comm('C',"Contacts ahead, Kestrel. Four interceptors. Weapons free.");say(touchUI?'Fire to shoot':'Click to fire the machine guns',3);
    for(let i=0;i<4;i++)flyEnemy('int',(Math.random()-.5)*700,(Math.random()-.5)*300+40,1600+Math.random()*500)}
  else if(S.ph==='w1'&&!S.en.length){S.ph='w2';comm('C',"Second flight inbound, with a gunboat. It throws plasma. Keep moving.");
    for(let i=0;i<5;i++)flyEnemy('int',(Math.random()-.5)*900,(Math.random()-.5)*400,S.pos.z+1500+Math.random()*600);flyEnemy('gun',0,60,S.pos.z+1800)}
  else if(S.ph==='w2'&&!S.en.length){S.ph='end';S.endT=0;comm('C',"Lanes are clear. Kestrel, new orders. The transport Halcyon is being boarded off your bow, with survivors aboard. Go get them.");comm('R',"Then we go get them.")}
  else if(S.ph==='end'){S.endT+=dt;if(S.endT>4&&!commCur&&!COMMS.length&&!VOICE.busy||S.endT>40){flyStageDone();return}}
  const n=S.en.length;setObj(S.ph==='hangar'?'STAGE 2-1 · LAUNCH · LEAVE THE HANGAR':S.ph==='end'?'STAGE 2-1 · STAND BY · FLEET COMMAND':S.ph==='free'?'FREE FLIGHT':'STAGE 2-1 · DESTROY THE INTERCEPTORS · '+n+' LEFT')}}
function flyCam(dt){const S=FLY,sh=shake>0?shake*.35:0;cam.rotation.set(pitch+(Math.random()-.5)*sh*.05,yaw+(Math.random()-.5)*sh*.05,S.roll*.2);cam.updateMatrixWorld();cam.getWorldDirection(fv2);fUp.set(0,1,0).applyQuaternion(cam.quaternion);
  const back=!S.noHull&&nearHull(S.pos)?11:14+S.spd*.02;cam.position.copy(S.pos).addScaledVector(fv2,-back).addScaledVector(fUp,3.6);cam.updateMatrixWorld();dustTick()}
const FTG=[];function flyHud(){const S=FLY;$('fspd').textContent=Math.round(S.spd*MPH);$('fthr').firstElementChild.style.width=S.thr*100+'%';$('fbst').firstElementChild.style.width=S.boost*100+'%';
  const gb=$('fgun');gb.firstElementChild.style.width=S.heat+'%';gb.classList.toggle('over',S.over>0);$('fmslT').textContent='MISSILES '+S.msl+(S.lockE?(S.lockP>=.6?' · LOCKED':' · LOCKING'):'');$('fmsl').firstElementChild.style.width=S.msl/8*100+'%';
  $('fmacT').textContent=S.mac>0?'HEAVY CANNON '+S.mac.toFixed(1)+' S':'HEAVY CANNON READY';$('fmac').firstElementChild.style.width=(1-S.mac/5)*100+'%';
  $('fsh').firstElementChild.style.width=shield/shMax*100+'%';$('fhp').firstElementChild.style.width=hp+'%';$('score').textContent=score.toLocaleString();
  const box=$('ftg'),W=cv.clientWidth,H=cv.clientHeight;let k=0;for(const e of S.en){if(e.kind==='mine'&&e.p.distanceTo(S.pos)>500)continue;fv1.copy(e.p).project(cam);if(fv1.z>1||Math.abs(fv1.x)>1.1||Math.abs(fv1.y)>1.1)continue;let d=FTG[k];if(!d){d=document.createElement('div');d.className='tg';d.appendChild(document.createElement('i'));box.appendChild(d);FTG[k]=d}
    d.hidden=false;d.style.left=((fv1.x*.5+.5)*W)+'px';d.style.top=((-fv1.y*.5+.5)*H)+'px';const lk=e===S.lockE;d.classList.toggle('lk',lk);d.firstChild.textContent=(lk?(S.lockP>=.6?'LOCK ':'... '):'')+Math.round(e.p.distanceTo(S.pos))+' M';k++}
  for(let i=k;i<FTG.length;i++)FTG[i].hidden=true;
  let wn=$('fwarn');if(!wn){wn=document.createElement('div');wn.id='fwarn';wn.style.cssText='position:absolute;left:50%;top:20%;transform:translateX(-50%);color:#ff4a3a;font:700 17px "Chakra Petch",sans-serif;letter-spacing:.18em;text-shadow:0 0 8px #f00;pointer-events:none;white-space:nowrap';$('fhud').appendChild(wn)}
  wn.hidden=!S.warn;if(S.warn)wn.textContent=(Math.sin(S.t*14)>0?'MISSILE · ':'')+'BREAK TURN · KEEP CIRCLING · '+Math.round(S.warnD)+' M';
  let nv=$('fnav');if(!nv){nv=document.createElement('div');nv.id='fnav';nv.className='tg';nv.appendChild(document.createElement('i'));box.appendChild(nv)}
  if(S.navP){fv1.copy(S.navP).project(cam);const on=fv1.z<1&&Math.abs(fv1.x)<1.1&&Math.abs(fv1.y)<1.1;nv.hidden=!on;if(on){nv.style.left=((fv1.x*.5+.5)*W)+'px';nv.style.top=((-fv1.y*.5+.5)*H)+'px';nv.firstChild.textContent=S.navL+' '+Math.round(S.navP.distanceTo(S.pos))+' M'}}else nv.hidden=true}
const pb=new T.Group();scene.add(pb);pb.visible=false;const pbR=walkerRig(pb,7),pE={mv:0,vy:0,kick:0,ph:0,crouch:0,jet:0,burst:0,ch:0,ft:0,pos:new T.Vector3()};
const pbSword=new T.Group();pbR.segs.arms[1][1].add(pbSword);pbSword.position.set(0,-.44,.02);
{const bm=bas({color:0xff8a3a,transparent:true,opacity:.95,blending:T.AdditiveBlending,depthWrite:false});pbSword.add(mesh(GEO.box,MAT.gunD,.05,.05,.24,0,0,.05),mesh(GEO.box,bm,.05,.1,1.5,0,0,.9),glow(0xff8a3a,2.4,.7))}
const pbAura=new T.Group();pb.add(pbAura);
for(let i=0;i<10;i++){const a=i/10*6.283,c=mesh(GEO.cone,bas({color:i%2?0xff7a2a:0xffc040,transparent:true,opacity:.7,blending:T.AdditiveBlending,depthWrite:false}),.18,1.4,.18,Math.cos(a)*.55,-.2,Math.sin(a)*.55);pbAura.add(c)}
pbAura.add(glow(0xff8a3a,5,.6));
const pbFrost=glow(0x8fe6ff,6,.7),pbVolt=glow(0xc9a6ff,6,.8);pb.add(pbFrost,pbVolt);
const voltMat=new T.LineBasicMaterial({color:0xd8c0ff,transparent:true,blending:T.AdditiveBlending,depthWrite:false});
function zap(a,b){const pts=[];const n=7;for(let i=0;i<=n;i++){const t=i/n;pts.push(new T.Vector3(a.x+(b.x-a.x)*t+(i&&i<n?(Math.random()-.5)*.9:0),a.y+(b.y-a.y)*t+(i&&i<n?(Math.random()-.5)*.9:0),a.z+(b.z-a.z)*t+(i&&i<n?(Math.random()-.5)*.9:0)))}
  const g=new T.Line(new T.BufferGeometry().setFromPoints(pts),voltMat);scene.add(g);bolts.push({g,t:.14})}
function surge(K){if(FLY)return;if(K===undefined)K=SUPK;if(state!=='playing'||veh||supCd[K]>0||supT[K]>0)return;supCd[K]=SUP_CD[K];SUPK=K;
  const col=['#ff8a3a','#8fe6ff','#c9a6ff'][K];
  if(cineT>0||supT.some(t=>t>0)){startSuper(K);say(SUPERS[K].n,1.4,col);sfx('nova');return}
  cineK=K;cineT=cineD=1.4;cineFx=0;firing=false;reloadT=0;
  say(SUPERS[K].n,1.8,col);sfx('nova');pb.visible=true;pbSword.visible=K===0;pbAura.visible=K===0;pbFrost.visible=K===1;pbVolt.visible=K===2;if(pbR.segs.gun)pbR.segs.gun.visible=K!==0}
function startSuper(K){const k=1+0.1*(power()-1);supT[K]=SUPERS[K].dur;shield=shMax;novaA=.8;
  if(K===0){hp=Math.max(hp,100);say('Ember Ronin · click or melee to slash',2,'#ff8a3a')}
  if(K===1){const f=new T.Vector3(pos.x,pos.y+.3,pos.z);blast(f,12,14*k,0,0x8fe6ff);ringFx(f,16,0x8fe6ff);if(!reduced)shake=.35;
    for(const e of enemies)if(!e.dying&&e.pos.distanceTo(f)<16&&e.type!==3){e.slowT=6;sparkle(e.pos,0xdff8ff,6,4)}}
  if(K===2)voltTick=0}
function roninSlash(){const k=1+0.1*(power()-1);swordT=.45;sfx('sword');
  {const m=bas({color:0xff8a3a,transparent:true,opacity:.85,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}),g=new T.Mesh(SLASH_G,m);g.position.set(0,-.05,-2.2);cam.add(g);camFx.push({g,m,t:0,d:.3,r0:.4,dr:-2.6})}
  cam.getWorldDirection(tmp);tmp.y=0;tmp.normalize();
  for(const e of enemies){if(e.dying)continue;tmp2.copy(e.pos).sub(eye);const d=tmp2.length()||1;tmp2.y=0;const hd=tmp2.length()||1;if(d<7+e.r&&tmp2.dot(tmp)/hd>.1&&los(eye,e.pos)){damage(e,9*k,2);sparkle(e.pos,0xff8a3a,6,5)}}
  const m=bas({color:0xff7a2a,transparent:true,opacity:.9,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}),g=new T.Group(),c=new T.Mesh(WAVE_G,m);c.rotation.x=-Math.PI/2;g.add(c,glow(0xff8a3a,4,.6));
  g.position.set(eye.x,eye.y-.4,eye.z);g.rotation.y=Math.atan2(tmp.x,tmp.z)+Math.PI/2;scene.add(g);waves.push({g,m,v:tmp.clone().multiplyScalar(30),t:.9,hit:new Set(),dm:7*k})}
function superTick(dt){
  for(let i=bolts.length-1;i>=0;i--){bolts[i].t-=dt;if(bolts[i].t<=0){scene.remove(bolts[i].g);bolts[i].g.geometry.dispose();bolts.splice(i,1)}}
  for(let i=waves.length-1;i>=0;i--){const w=waves[i],p=w.g.position;w.t-=dt;p.addScaledVector(w.v,dt);w.m.opacity=.9*Math.min(1,w.t*2);
    for(const e of enemies){if(e.dying||w.hit.has(e))continue;if(e.pos.distanceTo(p)<e.r+2.4){w.hit.add(e);damage(e,w.dm,2);sparkle(e.pos,0xff8a3a,6,5)}}
    if(w.t<=0||inBox(p.x,p.y,p.z)){scene.remove(w.g);w.m.dispose();waves.splice(i,1)}}
  if(cineT>0){cineT-=dt;if(cineT<=0){pb.visible=false;startSuper(cineK)}}
  const k=1+0.1*(power()-1);for(let i=0;i<3;i++)if(supT[i]>0)supT[i]=Math.max(0,supT[i]-dt);
  if(supT[1]>0){frostTick-=dt;if(frostTick<=0){frostTick=.5;const f=new T.Vector3(pos.x,pos.y+.3,pos.z);ringFx(f,8,0x8fe6ff);
      for(const e of enemies)if(!e.dying&&e.pos.distanceTo(eye)<8+e.r){damage(e,1.5*k,0);if(e.type!==3)e.slowT=1}}}
  if(supT[2]>0){voltTick-=dt;if(voltTick<=0){voltTick=.3;let from=eye,hitS=new Set();
      for(let j=0;j<4;j++){let best=null,bd=j?10:30;for(const e of enemies){if(e.dying||hitS.has(e))continue;const d=e.pos.distanceTo(from);if(d<bd&&los(from,e.pos)){bd=d;best=e}}
        if(!best)break;hitS.add(best);zap(j?from:new T.Vector3(eye.x,eye.y-.3,eye.z),best.pos);damage(best,3*k,1);from=best.pos.clone()}if(hitS.size)sfx('bolt')}}}
const _cv=new T.Vector3();
function cineCam(dt){const ph=1-cineT/cineD,ry=yaw+Math.PI;pb.position.set(pos.x,pos.y+1.02,pos.z);pb.rotation.set(0,ry,0);pbR.anim(pE,time,dt);
  const S=pbR.segs,K=cineK;
  if(K===0){const r=Math.min(1,ph*2.2);S.arms[1][0].rotation.set(-2.7*r,0,-.25);S.arms[1][1].rotation.x=-.3*r;S.arms[0][0].rotation.set(-1.2*r,0,.6);pbAura.scale.setScalar(.4+ph*1.1);
    for(const c of pbAura.children)c.scale.y=1.1+Math.random()*.8;if(Math.random()<.5)sparkle(pb.position,0xff8a3a,2,3)}
  if(K===1){const up=ph<.6?Math.sin(ph/.6*Math.PI)*2.2:0;pb.position.y+=up;const ar=ph<.6?-2.8:-.4;for(const[sh]of S.arms)sh.rotation.set(ar,0,0);
    if(ph>.62&&!cineFx){cineFx=1;ringFx(new T.Vector3(pos.x,pos.y,pos.z),10,0x8fe6ff);sparkle(new T.Vector3(pos.x,pos.y+.5,pos.z),0xdff8ff,24,10);sfx('boom');if(!reduced)shake=.3}}
  if(K===2){pb.position.y+=ph*1.1;S.arms[0][0].rotation.set(-1.5,0,1.3);S.arms[1][0].rotation.set(-1.5,0,-1.3);if(Math.random()<.6){const a=pb.position.clone();zap(a,a.clone().add(new T.Vector3((Math.random()-.5)*5,Math.random()*3,(Math.random()-.5)*5)))}}
  const off=.95-ph*1.9,d0=4.6,ch=new T.Vector3(pb.position.x,pb.position.y+.4,pb.position.z);
  _cv.set(Math.sin(ry+off),.28,Math.cos(ry+off)).normalize();let d=d0;const hitD=rayBoxes([ch.x,ch.y,ch.z],[_cv.x,_cv.y,_cv.z],d0);if(hitD<d0)d=Math.max(1.2,hitD-.4);
  cam.position.copy(ch).addScaledVector(_cv,d);cam.lookAt(ch)}

/* ---------- weapon and super wheel ---------- */
const WB=[];
ORDER.forEach((k,i)=>{const a=-Math.PI/2+i*Math.PI/3,b=document.createElement('button');b.type='button';b.style.left=(50+Math.cos(a)*36)+'%';b.style.top=(50+Math.sin(a)*36)+'%';
  b.addEventListener('click',()=>{wheelSel=i;closeWheel(true)});b.addEventListener('pointerenter',()=>{wheelSel=i});$('wheel').appendChild(b);WB.push(b)});
[0,1,2].forEach(K=>{const a=-Math.PI/2+K*2*Math.PI/3,b=document.createElement('button');b.type='button';b.className='sup';b.style.left=(50+Math.cos(a)*16)+'%';b.style.top=(50+Math.sin(a)*16)+'%';
  b.addEventListener('click',()=>{wheelSel=6+K;closeWheel(true)});b.addEventListener('pointerenter',()=>{wheelSel=6+K});$('wheel').appendChild(b);WB.push(b)});
function openWheel(){if(FLY)return;if(state!=='playing'||veh||wheelOpen)return;wheelOpen=true;wx=wy=0;wheelSel=-1;firing=false;$('wheel').hidden=false;syncWheel()}
function closeWheel(apply){if(!wheelOpen)return;wheelOpen=false;$('wheel').hidden=true;if(!apply||wheelSel<0)return;if(wheelSel<6)swap(ORDER[wheelSel]);else surge(wheelSel-6)}
function wheelAim(dx,dy){wx+=dx;wy+=dy;const r=Math.hypot(wx,wy);if(r>140){wx*=140/r;wy*=140/r}const rr=Math.min(r,140),a=Math.atan2(wy,wx);
  if(rr<25)wheelSel=-1;else if(rr<75){wheelSel=6+((Math.round((a+Math.PI/2)/(2*Math.PI/3))%3)+3)%3}else wheelSel=((Math.round((a+Math.PI/2)/(Math.PI/3))%6)+6)%6}
function syncWheel(){ORDER.forEach((k,i)=>{const G=guns[k],W=WPN[k],b=WB[i],emp=W.mode==='mag'&&!W.inf&&G.mag<=0&&G.res<=0;
    b.className=(wheelSel===i?'sel ':'')+(weapon===k?'cur ':'')+(emp?'empty':'');
    b.innerHTML='<b>'+(i+1)+' '+W.short+'</b><i>'+(W.mode==='heat'?'heat':emp?'EMPTY':G.mag+' / '+(W.inf?'∞':G.res))+'</i><i>'+W.gren.n+(grenCdK[k]>0?' '+Math.ceil(grenCdK[k])+'s':' ✓')+' · '+W.mel.n+(meleeCdK[k]>0?' '+Math.ceil(meleeCdK[k])+'s':' ✓')+'</i>'});
  [0,1,2].forEach(K=>{const b=WB[6+K];b.className='sup'+(wheelSel===6+K?' sel':'');b.innerHTML='<b>'+'ZXC'[K]+' '+SUPERS[K].short+'</b><i>'+(supT[K]>0?'ACTIVE':supCd[K]>0?Math.ceil(supCd[K])+'s':'READY')+'</i>'})}

/* ---------- combat ---------- */
function place(e,off){let x=e.pos.x+off,z=e.pos.z,y=groundAt(x,z,e.pos.y);
  for(let i=0;i<10&&inBox(x,y+0.3,z);i++){const d=Math.hypot(pos.x-x,pos.z-z)||1;x+=(pos.x-x)/d;z+=(pos.z-z)/d;y=groundAt(x,z,e.pos.y)}
  return[x,y,z]}
function drop(e,k){const[x,y,z]=place(e,0);
  const g=new T.Group();g.add(mesh(GEO.box,k?MAT.cell:MAT.gel,0.34,0.44,0.34),mesh(GEO.box,MAT.cap,0.2,0.1,0.2,0,0.27,0));g.add(glow(k?0xc9a6ff:0x7be36b,1.8,0.5));g.position.set(x,y+0.45,z);scene.add(g);pickups.push({g,k,y:y+0.45})}
function loot(e){const w=Math.max(wave,1),r=Math.random()-w*0.015-(e.type===3?0.5:e.type===2?0.25:0),rar=r<0.03?4:r<0.12?3:r<0.35?2:r<0.65?1:0;
  const[x,y,z]=place(e,0.7),lk=Math.random()*6|0,g=mesh(GEO.oct,bas({color:RAR[rar].c}),0.26,0.4,0.26,x,y+0.7,z);g.add(glow(RAR[rar].c,7,0.7));scene.add(g);
  loots.push({g,y:y+0.7,k:lk,rar,pow:w+rar,name:WPN[lk].name})}
function num(p,n,c,crit){const v=tmpN.copy(p).project(cam);if(v.z>1||dnCount>28)return;
  const d=document.createElement('div');d.className='dn'+(crit?' crit':'');d.textContent=Math.max(1,Math.round(n*10));if(!crit&&c)d.style.color=c;
  d.style.left=((v.x*.5+.5)*stage.clientWidth+(Math.random()-.5)*26)+'px';d.style.top=((-v.y*.5+.5)*stage.clientHeight-12)+'px';
  dnCount++;d.addEventListener('animationend',()=>{d.remove();dnCount--});stage.insertBefore(d,overlay)}
function damage(e,n,el=-1,crit=false,shot=false){e.lastEl=el;if(e.dying)return;e.flash=0.1;
  if(e.type===3&&e.vuln<=0){n*=0.12;crit=false;if(!e.tip){e.tip=true;say(BOSS[e.kind||'matriarch'].tip,2.5)}}
  if(e.type===10&&shot&&!((e.burst||0)>0)){n*=0.15;sparkle(e.pos,0x6fd8ff,3,4)}
  if(e.sh>0){const m=el===e.sel?2.5:el<0?1:0.4;e.sh-=n*m;num(e.pos,n*m,ELC[e.sel]);
    if(e.sh<=0){e.sh=0;e.g.remove(e.shell);e.shell=null;sfx('boom');sparkle(e.pos,ELC[e.sel],16,8);if(el===e.sel)explode(e.pos,true)}else sfx('hit');return}
  if(crit)n*=2;e.hp-=n;num(e.pos,n,null,crit);
  if(e.hp>0){sfx('hit');e.hitT=.22;e.hitS=Math.random()<.5?-1:1;return}
  e.dying=0.001;if(e.type===11)detonate(e.pos.clone());if(e.type!==4){if(e.rig&&e.rig.death&&e.lastEl!==2&&e.type!==11){e.dth=0;e.hitS=Math.random()<.5?-1:1;e.dthV=new T.Vector3(e.pos.x-eye.x,0,e.pos.z-eye.z).normalize().multiplyScalar(1.6)}else ragdoll(e)}sparkle(e.pos,e.type>=5?GP[e.type].spark:[0xffb238,0xff4fa3,0xc9a6ff,0xffb238,0x8fe6ff][e.type],e.type>=2?(e.type===6||e.type===9?24:30):14,e.type===3?16:7);sfx('kill');
  if(e.type===4){score+=50;const b=e.boss;b.pods=b.pods.filter(q=>q!==e);if(!b.pods.length&&!b.dying){b.vuln=9;say(BOSS[b.kind||'matriarch'].open,2.5);sfx('nova')}return}
  if(e.type===3){score+=5000;supCd.fill(0);for(const q of e.pods)q.dying=0.001;e.pods=[];for(let i=0;i<3;i++){loot(e);e.pos.x+=1.3}drop(e,0);if(mission)mission.done=true;return}
  score+=e.type>=5?GP[e.type].score:e.type===2?500:e.type?150:100;{const s2=e.type===2?6:e.type===6||e.type===9?2.5:1;for(let i=0;i<3;i++)supCd[i]=Math.max(0,supCd[i]-s2)}
  const r=Math.random();if(e.type===2||r<0.2)drop(e,0);else if(r<0.4)drop(e,1);
  if(e.type===2||Math.random()<(e.type===6||e.type===9?0.35:0.16))loot(e)}
function fire(){
  const G=guns[weapon],W=WPN[G.k],od=overT>0;
  if(reloadT>0)return;
  if(W.mode==='mag'&&G.mag<=0){if(!W.inf&&G.res<=0){fireCd=.3;sfx('dry');if(dryT<=0){dryT=1.5;say(W.name+' is empty',1)}return}startReload();fireCd=.2;return}
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
  let coreT=0;if(LC&&LC.hp>0&&(LC.ph==='go'||LC.ph==='act')){const c=LC.c,ox=c.x-o[0],oy=c.y-o[1],oz=c.z-o[2],t=ox*d[0]+oy*d[1]+oz*d[2];if(t>0&&t<hd&&ox*ox+oy*oy+oz*oz-t*t<1.5*1.5){coreT=t;hd=t;if(!W.pierce)hit=null}}
  const end=W.pierce?wall:hd;tmp.multiplyScalar(end).add(org);if(coreT)lcoreHit(dm);
  beam.position.copy(tmp2).add(tmp).multiplyScalar(0.5);beam.lookAt(tmp);const th=(W.pierce?0.03:W.spin?.009:0.012)*(veh?5:1);beam.scale.set(th,th,tmp2.distanceTo(tmp));
  beamMat.color.set(W.col);sparkle(tmp,W.col,W.pierce?4:2,3);mfl.color.set(W.col);
  if(W.pierce)for(const e of all)damage(e,dm,W.el,e.c,true);else if(hit)damage(hit,dm,W.el,hit.c,true);
  if(W.mode==='mag'&&G.mag<=0)startReload();
}
function startReload(){if(FLY)return;if(veh)return;const G=guns[weapon],W=WPN[G.k];if(W.mode!=='mag'||reloadT>0||G.mag>=W.mag)return;
  if(!W.inf&&G.res<=0)return;reloadDur=reloadT=W.reload*(cls===1?.85:1);sfx('reload')}
function finishReload(){const G=guns[weapon],W=WPN[G.k];const n=W.inf?W.mag-G.mag:Math.min(W.mag-G.mag,G.res);G.mag+=n;if(!W.inf)G.res-=n;sfx('swap')}
// ---------- weapon grenades
const GRCOL={fire:0xff7a2a,thorn:0xc9a6ff,frag:0xffb238,stun:0x6fd8ff,cluster:0xffb238,well:0x9a6ae0,bomblet:0xffb238};
function grenade(){if(FLY){flyMissile();return}const wk=weapon;if(state!=='playing'||grenCdK[wk]>0||veh||cineT>0)return;const W=WPN[wk],K=W.gren.kind;grenMaxK[wk]=grenCdK[wk]=W.gren.cd*CLS[cls].gren/6;cam.getWorldDirection(tmp);
  const g=new T.Group(),c=GRCOL[K];g.add(mesh(GEO.sph,bas({color:c}),.14,.14,.14),glow(c,4,.9));g.position.copy(eye).addScaledVector(tmp,0.5);scene.add(g);
  grenades.push({g,v:tmp.clone().multiplyScalar(17).add(new T.Vector3(0,2.5,0)),t:K==='fire'?1.6:2,kind:K,dm:1});sfx('swap')}
const SLASH_G=new T.RingGeometry(.85,1.08,32,1,0,Math.PI*.9),WAVE_G=new T.RingGeometry(1.4,2,24,1,0,Math.PI),FIRE_G=new T.CircleGeometry(1,24);
function ringFx(p,r,col,y=.12){const m=bas({color:col,transparent:true,opacity:.85,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}),g=mesh(GEO.ring,m,1,1,1,p.x,p.y+y,p.z);g.rotation.x=-Math.PI/2;scene.add(g);rings.push({g,m,t:0,r})}
function blast(p,r,dmg,el,col,quiet){const m=bas({color:col,transparent:true,opacity:0.85,fog:false}),g=mesh(GEO.sph,m,0.5,0.5,0.5,p.x,p.y,p.z);scene.add(g);
  blasts.push({g,m,t:0,r});sparkle(p,col,14,9);if(!quiet)sfx('boom');if(col===0xffb238||col===0xff7a2a)PFX.boom(p,Math.max(.6,r/4.5));if(!reduced)shake=Math.max(shake,0.1);
  const c=new T.Vector3(p.x,Math.max(p.y,0.3),p.z);for(const e of enemies){if(e.dying)continue;const d=e.pos.distanceTo(c);if(d<r+e.r&&los(c,e.pos))damage(e,dmg*(d<r*.5?1:.55),el)}if(LC&&LC.hp>0&&(LC.ph==='go'||LC.ph==='act')&&LC.c.distanceTo(c)<r+1.5)lcoreHit(dmg);return c}
function grenBoom(K,p,dm){const k=1+0.1*(power()-1);
  if(K==='gl'){blast(p,4.5,dm,2,0xffb238);return}
  if(K==='bomblet'){blast(p,2.8,3*k,2,0xffb238,true);return}
  if(K==='fire'){blast(p,4,5*k,2,0xff7a2a);const fm=bas({color:0xff6a1a,transparent:true,opacity:.55,depthWrite:false,blending:T.AdditiveBlending}),fg=new T.Group(),fy=groundAt(p.x,p.z,p.y+.5);
    const disc=mesh(FIRE_G,fm,5.5,5.5,1,0,.06,0);disc.rotation.x=-Math.PI/2;fg.add(disc);const fl=[];for(let i=0;i<9;i++){const a=i/9*6.283,q=glow(i%2?0xff7a2a:0xffc040,1.6,.8);q.position.set(Math.cos(a)*(1+hash(i,7)*3.5),.6,Math.sin(a)*(1+hash(i,8)*3.5));fg.add(q);fl.push(q)}
    fg.position.set(p.x,fy,p.z);scene.add(fg);fires.push({g:fg,fm,fl,t:6,tick:0,r:5.5,dm:1.1*k});
    PFX.emit(o=>o.set(fg.position.x+(Math.random()-.5)*7,fg.position.y+.2,fg.position.z+(Math.random()-.5)*7),{rate:16,dur:5.6,fs:[.9,2.6],ss:[1.6,5.5],fup:2.6,sup:1.3,flife:.75,slife:3,sp:.45,far:150});return}
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
    if(f.t<=0){scene.remove(f.g);f.fm.dispose();fires.splice(i,1)}}
  for(let i=wells.length-1;i>=0;i--){const w=wells[i],c=w.g.position;w.t-=dt;w.g.rotation.y+=dt*4;w.g.children[1].rotation.x+=dt*3;
    for(const e of enemies){if(e.dying||e.type===3||e.type===4)continue;tmp2.copy(c).sub(e.pos);const d=tmp2.length();if(d<w.r&&d>.6)e.pos.addScaledVector(tmp2,Math.min(1,dt*9/d))}
    if(w.t<=0){scene.remove(w.g);w.m.dispose();wells.splice(i,1);blast(c,5.5,w.dm,1,0x9a6ae0);ringFx(c,8,0x9a6ae0)}}
  for(let i=rings.length-1;i>=0;i--){const r=rings[i];r.t+=dt;const k=r.t/.35;r.g.scale.setScalar(.5+k*r.r);r.m.opacity=.85*(1-k);if(k>=1){scene.remove(r.g);r.m.dispose();rings.splice(i,1)}}
  for(let i=camFx.length-1;i>=0;i--){const c=camFx[i];c.t+=dt;const k=c.t/c.d;c.m.opacity=.9*(1-k);c.g.rotation.z=c.r0+k*c.dr;if(k>=1){cam.remove(c.g);c.m.dispose();camFx.splice(i,1)}}
  if(dashT>0){dashT-=dt;movePlayer(dashV.x*dt,0,dashV.z*dt);eye.set(pos.x,pos.y+EYE,pos.z);
    for(const e of enemies){if(e.dying||dashHit.has(e))continue;if(e.pos.distanceTo(eye)<e.r+2.2){dashHit.add(e);damage(e,dashDmg);sparkle(e.pos,0xffe6b0,8,6);if(e.type<3||e.type>=5){tmp2.copy(e.pos).sub(eye).setY(0).normalize();e.pos.addScaledVector(tmp2,dashV.length()>25?4:2)}}}}}
function explode(p,burst){const m=bas({color:burst?0xffffff:0xffb238,transparent:true,opacity:0.85,fog:false}),g=mesh(GEO.sph,m,0.5,0.5,0.5,p.x,p.y,p.z);scene.add(g);
  blasts.push({g,m,t:0});sparkle(p,burst?0xffffff:0xffb238,16,9);if(!burst){sfx('boom');PFX.boom(p,1)}if(!reduced)shake=Math.max(shake,0.12);
  const c=new T.Vector3(p.x,Math.max(p.y,0.3),p.z),k=1+0.1*(power()-1);if(!burst&&LC&&LC.hp>0&&(LC.ph==='go'||LC.ph==='act')&&LC.c.distanceTo(c)<5.5)lcoreHit(6*k);
  for(const e of enemies){const d=e.pos.distanceTo(c);if(d<(burst?3:4)+e.r&&los(c,e.pos))damage(e,(burst?3:d<2.2?6:3)*k,burst?-1:2)}}
function melee(){if(FLY){flyMAC();return}const wk=weapon;if(state!=='playing'||meleeCdK[wk]>0||veh||cineT>0)return;const W=WPN[wk],M=W.mel;meleeMaxK[wk]=meleeCdK[wk]=M.cd*(cls===0?.85:1);meleeA=0.2;
  cam.getWorldDirection(tmp);tmp.y=0;tmp.normalize();const k=(cls===0?1.4:1)*(1+0.1*(power()-1));
  const arc=(range,cos,dmg,kb,up=0,el=-1)=>{for(const e of enemies){if(e.dying)continue;tmp2.copy(e.pos).sub(eye);const d=tmp2.length()||1;tmp2.y=0;const hd=tmp2.length()||1;
      if(d<range+e.r&&tmp2.dot(tmp)/hd>cos&&los(eye,e.pos)){if(kb&&(e.type<3||e.type>=5)){e.pos.addScaledVector(tmp2,kb*(e.type===6?.35:1)/hd);if(up&&e.type>=5)e.vy=up}damage(e,dmg,el);sparkle(e.pos,0xffffff,4,4)}}};
  const slash=(col,r0,dr,dur=.35)=>{const m=bas({color:col,transparent:true,opacity:.9,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}),g=new T.Mesh(SLASH_G,m);g.position.set(0,-.05,-2.2);m.opacity=.7;cam.add(g);camFx.push({g,m,t:0,d:dur,r0,dr})};
  const feet=new T.Vector3(pos.x,pos.y,pos.z);
  switch(M.kind){
    case'sword':swordT=.45;sfx('sword');slash(0xff8a3a,.4,-2.6);fxq.push({t:.12,fn:()=>{arc(5.5,-.1,13*k,2.5,0,2)}});break;
    case'whip':sfx('whip');ringFx(feet,5.5,0xc9a6ff);arc(5.5,-1.1,5*k,3,0,1);break;
    case'punch':sfx('melee');ringFx(new T.Vector3(eye.x+tmp.x*2.5,pos.y,eye.z+tmp.z*2.5),4.5,0xffd27a);arc(6.5,.45,7*k,5);break;
    case'dash':sfx('jet');dashT=.24;dashV.copy(tmp).multiplyScalar(34);dashDmg=6*k;dashHit.clear();slash(0xffe6b0,1.57,0,.25);break;
    case'stomp':sfx('boom');ringFx(feet,7,0xffb238);if(!reduced)shake=Math.max(shake,.2);arc(7,-1.1,6*k,2,8,2);break;
    case'charge':sfx('jet');dashT=.34;dashV.copy(tmp).multiplyScalar(26);dashDmg=9*k;dashHit.clear();slash(0xc9a6ff,1.57,0,.34);break}}
function swap(w,dir=1){if(FLY)return;if(state!=='playing'||time-swapT<0.15)return;if(w===undefined){const i=ORDER.indexOf(weapon);w=ORDER[(i+dir+6)%6]}if(w===weapon)return;swapT=time;weapon=w;reloadT=0;spinV=0;
  fireCd=Math.max(fireCd,0.3);sfx('swap');say(guns[weapon].name,0.8,RAR[guns[weapon].rar].c)}
function hurt(n){if(cineT>0)return;if(mission&&mission.C&&mission.C.dmgK)n*=mission.C.dmgK;if(supT[0]>0)n*=.5;if(veh)n*=0.5;if(shield>0&&shield-n<=0&&time-lastLow>30){lastLow=time;comm('R',['Your shield just broke. Get behind something.','Shield down. Back off and let it recharge.'][Math.random()*2|0])}shDelay=cls===2?2.2:3.5;if(shield>0){shield-=n;if(shield<0){hp+=shield;shield=0}}else hp-=n;
  hurtA=1;shake=reduced?0:0.2;sfx('hurt');if(hp<=0){hp=0;die()}}

function overlaps(b){return pos.x+PR>b.lo[0]&&pos.x-PR<b.hi[0]&&pos.z+PR>b.lo[2]&&pos.z-PR<b.hi[2]&&pos.y+PH>b.lo[1]&&pos.y<b.hi[1]}
function movePlayer(dx,dy,dz){
  const nb=nearList(pos.x-Math.abs(dx)-1,pos.z-Math.abs(dz)-1,pos.x+Math.abs(dx)+1,pos.z+Math.abs(dz)+1);
  if(dx){pos.x+=dx;for(const b of nb)if(overlaps(b)){if(b.hi[1]-pos.y<=0.3){pos.y=b.hi[1];if(vy<0)vy=0}else pos.x=dx>0?b.lo[0]-PR-1e-4:b.hi[0]+PR+1e-4}}
  if(dz){pos.z+=dz;for(const b of nb)if(overlaps(b)){if(b.hi[1]-pos.y<=0.3){pos.y=b.hi[1];if(vy<0)vy=0}else pos.z=dz>0?b.lo[2]-PR-1e-4:b.hi[2]+PR+1e-4}}
  pos.y+=dy;ground=false;
  for(const b of nb)if(overlaps(b)){if(dy<=0){pos.y=b.hi[1];vy=0;ground=true}else{pos.y=b.lo[1]-PH-1e-4;vy=0}}
  if(pos.y<=0){pos.y=0;vy=0;ground=true}
  pos.x=Math.max(-AX+.1+PR,Math.min(AX-.1-PR,pos.x));pos.z=Math.max(-AZ+.1+PR,Math.min(AZ-.1-PR,pos.z))}

function update(dt){if(FLY){flyTick(dt);weaponFxTick(dt);return}allyTick(dt);
  // player
  if(veh)vehTick(dt);else if(cineT>0){vy=0;eye.set(pos.x,pos.y+EYE,pos.z)}else{
  let f=0,s=0;
  if(keys.KeyW||keys.ArrowUp)f+=1;if(keys.KeyS||keys.ArrowDown)f-=1;if(keys.KeyD)s+=1;if(keys.KeyA)s-=1;
  f-=mvY;s+=mvX;
  if(keys.ArrowLeft)yaw+=2.6*dt;if(keys.ArrowRight)yaw-=2.6*dt;
  const l=Math.hypot(f,s);if(l>1){f/=l;s/=l}
  sprintT=f>0.5&&!firing&&!padFire?sprintT+dt:0;const sp=(sprintT>0.35?9:6.2)*CLS[cls].spd*dt,sn=Math.sin(yaw),cs=Math.cos(yaw);
  if(ground){airUsed=false;gliding=false;boostT=0;if(jumpQ||keys.Space){vy=6.9;sfx('jump')}}
  else if(jumpQ){
    if(cls===2){gliding=!gliding;if(gliding&&!airUsed){airUsed=true;vy=Math.max(vy,3);sfx('jump')}}
    else if(!airUsed){airUsed=true;sfx('jump');if(cls===1)vy=7.2;else boostT=0.45}}
  jumpQ=false;vy-=19*dt;
  if(boostT>0){boostT-=dt;vy=Math.min(vy+50*dt,6)}
  if(gliding&&vy<-1.4)vy=-1.4;
  movePlayer((-sn*f+cs*s)*sp,vy*dt,(-cs*f-sn*s)*sp);
  if(ground)for(const q of PADS)if(Math.abs(pos.y-q.y)<0.3&&Math.hypot(pos.x-q.x,pos.z-q.z)<1.3){vy=q.v;airUsed=false;gliding=false;sfx('nova');break}
  if(l>0.05&&ground)bob+=dt*10;
  eye.set(pos.x,pos.y+EYE,pos.z)}
  idleVehs(dt);
  // weapon
  fireCd-=dt;sinceFire+=dt;recoil=Math.max(0,recoil-dt*8);
  {const Wf=WPN[guns[weapon].k],tr=(firing||padFire)&&!veh;if(Wf.spin)spinV=tr&&reloadT<=0?Math.min(1,spinV+dt*1.4):Math.max(0,spinV-dt*1.2);
   if(reloadT>0){reloadT-=dt;if(reloadT<=0)finishReload()}swordT=Math.max(0,swordT-dt);
   if(cineT<=0&&(firing||padFire)&&fireCd<=0){if(supT[0]>0){fireCd=.38;roninSlash()}else if(reloadT<=0&&(Wf.mode!=='heat'||!over))fire()}}
  superTick(dt);if(state!=='playing')return;
  if(sinceFire>0.25||over)heat=Math.max(0,heat-(over?45:38)*dt);
  if(over&&heat<30)over=false;
  shDelay-=dt;if(shDelay<=0&&shield<shMax)shield=Math.min(shMax,shield+(cls===2?70:40)*dt);overT=Math.max(0,overT-dt);
  for(let i=0;i<6;i++){grenCdK[i]=Math.max(0,grenCdK[i]-dt);meleeCdK[i]=Math.max(0,meleeCdK[i]-dt)}for(let i=0;i<3;i++)supCd[i]=Math.max(0,supCd[i]-dt);dryT-=dt;meleeA=Math.max(0,meleeA-dt);
  for(let i=grenades.length-1;i>=0;i--){const g=grenades[i],p=g.g.position;g.t-=dt;
    if(g.stuck){let trig=g.t<=0;if(!trig)for(const e of enemies)if(!e.dying&&e.type!==4&&e.pos.distanceTo(p)<e.r+3.2){trig=true;break}
      g.g.scale.setScalar(1+Math.abs(Math.sin(time*(g.t<1.5?24:8)))*.4);if(trig){scene.remove(g.g);grenades.splice(i,1);grenBoom(g.kind,p.clone(),g.dm)}continue}
    g.v.y-=(g.grav||14)*dt;p.addScaledVector(g.v,dt);
    let boom=g.t<=0||p.y<0.12||inBox(p.x,p.y,p.z),hitE=false;
    if(!boom)for(const e of enemies)if(!e.dying&&e.pos.distanceTo(p)<e.r+0.3){boom=true;hitE=true;break}
    if(boom){p.addScaledVector(g.v,-dt);if(g.kind==='fire'&&!hitE&&g.t>0){g.stuck=true;g.t=5;if(p.y<0.15)p.y=0.15;continue}
      scene.remove(g.g);grenades.splice(i,1);grenBoom(g.kind,p.clone(),g.dm)}}
  weaponFxTick(dt);
  navT-=dt;if(navT<=0){navT=.35;navFlow()}
  corpseTick(dt);
  // missions
  for(let i=queue.length-1;i>=0;i--){const q=queue[i];q.t-=dt;if(q.t<=0){enemies.push(mk(q.type,q.x,q.y,q.z));queue.splice(i,1)}}
  missionTick(dt);if(state!=='playing')return;
  // enemies
  for(let i=enemies.length-1;i>=0;i--){const e=enemies[i];
    if(e.dying)continue;
    if(e.type!==3&&e.type!==4){const rr=roomAt(e.pos.x,e.pos.z);if(!rr||e.pos.y>rr.h-0.4||!isFinite(e.pos.x+e.pos.y+e.pos.z)){const[x,z,r2]=spawnPos();e.pos.set(x,e.type>=5?1.5:Math.min(r2.h-3,7),z);e.vy=0}}
    if(e.type>=5){groundTick(e,dt);if(state!=='playing')return;continue}
    if(e.type>=3){if(e.type===3)bossTick(e,dt);continue}
    const p=e.pos,dx=eye.x-p.x,dy=eye.y-p.y,dz=eye.z-p.z,d=Math.hypot(dx,dy,dz)||1,hd=Math.hypot(dx,dz)||1,see=d<70&&los(p,eye);
    if(hd>170){const[x,z,r]=spawnPos();p.set(x,Math.min(r.h-3,7),z);continue}
    let mx=dx/d,my=dy/d,mz=dz/d,go=true;e.cd-=dt;
    if(!see&&hd>2){const f=flowDir(p.x,p.z);if(f){mx=f[0];mz=f[1]}else{mx=dx/hd;mz=dz/hd}const rr=roomAt(p.x,p.z),ch=rr?rr.h:10;my=Math.max(-1,Math.min(1,(Math.min(ch-3,eye.y+2.5)-p.y)*0.8))}
    else if(e.type===1){
      if(see){if(hd<7){mx=-dx/hd;mz=-dz/hd}else if(hd<17){mx=-dz/hd*e.ph;mz=dx/hd*e.ph}
        my=Math.max(-1,Math.min(1,(eye.y+1.6-p.y)*0.8));
        if(e.cd<=0&&d<45){e.cd=Math.max(1,1.9-wave*0.05);const g=mesh(GEO.sph,MAT.spore,0.2,0.2,0.2,p.x,p.y,p.z);g.add(glow(0xff7a3a,7));scene.add(g);
          shots.push({g,v:new T.Vector3(dx/d*11,dy/d*11,dz/d*11),t:6});sfx('spit')}}}
    else{const big=e.type===2;
      if(d<e.r+(big?1.1:0.8)){go=false;if(e.cd<=0){e.cd=big?1.2:1;hurt(big?16:6)}}
      else if(d>3){const w=Math.sin(time*2.2+e.ph)*0.6;mx+=-dz/hd*w;mz+=dx/hd*w}}
    if(!see&&inTower(pos)&&inCommons(p)&&Math.abs(p.y-(pos.y+1.6))>2.5&&(pos.y>3.5||p.y>5)){const q=shaftFor(pos),qx=q[0]-p.x,qz=q[1]-p.z,qd=Math.hypot(qx,qz);go=true;
      if(qd>1.5){mx=qx/qd;mz=qz/qd;my=inTower(p)&&(Math.abs(p.x)>37||Math.abs(p.z)>16)?0:Math.max(-1,Math.min(1,(3-p.y)*.8));if(Math.abs(p.x)>50&&Math.abs(p.x)<58)my=Math.max(-1,Math.min(1,(3-p.y)*.8))}else{mx=0;mz=0;my=Math.sign(pos.y+1.6-p.y)}}
    if(go){const sl=(e.slowT=(e.slowT||0)-dt)>0?.35:1;p.x+=mx*e.spd*sl*dt;p.y+=my*e.spd*sl*dt;p.z+=mz*e.spd*sl*dt}
    for(let j=0;j<i;j++){const o=enemies[j];if(o.type>=3)continue;const ox=p.x-o.pos.x,oy=p.y-o.pos.y,oz=p.z-o.pos.z,od=Math.hypot(ox,oy,oz),m=e.r+o.r;
      if(od<m&&od>0.001){const k=(m-od)*0.5/od;p.x+=ox*k;p.y+=oy*k;p.z+=oz*k;o.pos.x-=ox*k;o.pos.y-=oy*k;o.pos.z-=oz*k}}
    pushOut(p,e.r);
    if(state!=='playing')return;
  }
  for(let i=shots.length-1;i>=0;i--){const s2=shots[i],p=s2.g.position;if(s2.grav)s2.v.y-=s2.grav*dt;
    if(s2.home){tmp2.set(eye.x-p.x,eye.y-.3-p.y,eye.z-p.z).setLength(13);s2.v.lerp(tmp2,Math.min(1,dt*1.1)).setLength(13);s2.g.lookAt(p.x+s2.v.x,p.y+s2.v.y,p.z+s2.v.z)}p.addScaledVector(s2.v,dt);s2.t-=dt;
    const hitP=!s2.vis&&Math.hypot(p.x-pos.x,p.z-pos.z)<(veh?1.8:0.5)&&p.y>pos.y-0.1&&p.y<pos.y+PH+(veh?1:0.1);
    if(hitP||s2.t<=0||p.y<0||inBox(p.x,p.y,p.z)){scene.remove(s2.g);shots.splice(i,1);if(hitP){hurt(s2.dmg||12);if(state!=='playing')return}}}
  for(let i=loots.length-1;i>=0;i--){const L=loots[i],q=L.g.position;
    if(Math.hypot(q.x-pos.x,q.z-pos.z)>1.1||Math.abs(q.y-pos.y-0.7)>1.7)continue;
    const nm=(1+(L.pow-1)*0.12)*RAR[L.rar].m,cur=gunMult(L.k);if(nm>cur){guns[L.k]=mkGun(L.k,L.rar,L.pow);if(weapon===L.k)reloadT=0;say(RAR[L.rar].n+' '+L.name+' · Power '+L.pow,2.4,RAR[L.rar].c)}
    else{const G=guns[L.k],W=WPN[L.k];score+=100;if(W.mode==='mag'&&!W.inf){G.res=Math.min(W.res*1.5,G.res+W.mag*2);say(W.short+' ammo +'+W.mag*2,1)}else say('Salvage +100',1)}
    scene.remove(L.g);L.g.material.dispose();loots.splice(i,1);sfx('pick')}
  for(let i=pickups.length-1;i>=0;i--){const p=pickups[i],q=p.g.position;
    if(Math.hypot(q.x-pos.x,q.z-pos.z)>1||Math.abs(q.y-pos.y-0.6)>1.6)continue;
    if(p.k===0&&hp<100){hp=Math.min(100,hp+25);say('Hull patched',1)}
    else if(p.k===1&&needAmmo()){refill(.35);say('Ammo',1)}else continue;
    scene.remove(p.g);pickups.splice(i,1);sfx('pick')}
}

/* ---------- per-frame visuals ---------- */
function animate(dt){
  for(let i=enemies.length-1;i>=0;i--){const e=enemies[i];
    if(e.corpse){enemies.splice(i,1);continue}
    e.flash-=dt;const wt=e.flash>0||(e.dying>0&&e.dth===undefined);
    if(wt!==e.white){e.white=wt;for(const[o,m]of e.parts)o.material=wt?MAT.white:m}
    if(e.dying&&e.dth!==undefined){e.dth+=dt;const k=Math.min(1,e.dth/.3),kk=1-(1-k)*(1-k);try{e.rig.death(e,kk)}catch(_){}if(e.dthV)e.pos.addScaledVector(e.dthV,dt*(1-k));if(e.dth>=.3){e.dth=undefined;ragdoll(e);e.dying=.001}continue}
    if(e.dying){e.dying+=dt;e.g.scale.setScalar(Math.max(0.01,1-e.dying/0.25));if(e.dying>0.25){scene.remove(e.g);enemies.splice(i,1)}continue}
    if(e.rig&&state!=='paused'){try{e.rig.anim(e,time,dt)}catch(err){e.rig=null}}
    if(e.type>=5){e.g.rotation.y=Math.atan2(eye.x-e.pos.x,eye.z-e.pos.z);continue}
    if(e.type===3&&e.kind&&e.kind!=='matriarch'){e.g.rotation.y=Math.atan2(eye.x-e.pos.x,eye.z-e.pos.z);continue}
    if(state!=='paused'){e.g.position.y+=Math.sin(time*4+e.ph)*0.004;
      for(const w of e.wings)w.rotation.z=-w.userData.s*(0.25+Math.sin(time*45+e.ph)*0.55)}
    e.g.lookAt(state==='menu'?cam.position:eye)}
  for(const L of loots){L.g.rotation.y+=dt*3;L.g.position.y=L.y+Math.sin(time*4)*0.1}
  for(const p of pickups){p.g.rotation.y+=dt*2;p.g.position.y=p.y+Math.sin(time*3)*0.08}
  for(let i=blasts.length-1;i>=0;i--){const b=blasts[i];b.t+=dt;const k=b.t/0.3;b.g.scale.setScalar(0.5+k*(b.r||4));b.m.opacity=0.85*(1-k);
    if(k>=1){scene.remove(b.g);b.m.dispose();blasts.splice(i,1)}}
  flash-=dt;beam.visible=flash>0&&state==='playing';mfl.intensity=beam.visible?0.8*LI:0;mglow.visible=beam.visible;
  PFX.tick(dt);
  for(const k of sparks)if(k.t>0){k.t-=dt;k.v.y-=9*dt;k.s.position.addScaledVector(k.v,dt);const a=Math.max(0,k.t/k.l);k.m.opacity=a;k.s.scale.setScalar(0.1+a*0.3);if(k.t<=0)k.s.visible=false}
  novaA=Math.max(0,novaA-dt*1.6);$('nova').style.opacity=novaA*0.75;
  sun.position.set(pos.x+28,pos.y+46,pos.z+14);sun.target.position.set(pos.x,pos.y,pos.z);
  rip.offset.set(time*0.012,time*0.02);if(window.HABRING)HABRING.rotation.z+=dt*.012;if(window.AHOLO)AHOLO.rotation.y+=dt*.25;if(window.BHOLO)window.BHOLO.rotation.y+=dt*.3;
  {const a=motes.geometry.attributes.position.array,c=cam.position;for(let i=0;i<a.length;i+=3){a[i]+=dt*0.5;a[i+1]+=Math.sin(time+i)*dt*0.2;
     if(a[i]-c.x>30)a[i]-=60;else if(a[i]-c.x<-30)a[i]+=60;if(a[i+1]-c.y>30)a[i+1]-=60;else if(a[i+1]-c.y<-30)a[i+1]+=60;if(a[i+2]-c.z>30)a[i+2]-=60;else if(a[i+2]-c.z<-30)a[i+2]+=60}
   motes.geometry.attributes.position.needsUpdate=true}for(const f of farAnim)f(dt);
  vm.visible=state!=='menu'&&!veh&&cineT<=0&&!INTRO.on&&!FLY;
  // camera
  if(INTRO.on){}
  else if(FLY&&state!=='menu'){flyCam(dt)}
  else if(state==='menu'){const a=reduced?0.3:time*0.12;cam.position.set(Math.sin(a)*24,2.2,11);cam.lookAt(0,15,-9)}
  else if(cineT>0&&state!=='menu'){cineCam(dt)}
  else if(veh){const car=veh.kind==='car',sh=shake>0?shake*0.08:0;cam.rotation.set(pitch+(Math.random()-.5)*sh,yaw+(Math.random()-.5)*sh,0);cam.getWorldDirection(tmp);
    cam.position.copy(veh.pos).addScaledVector(tmp,car?-7.5:-13);cam.position.y+=car?2.6:3.6;
    if(veh.pos.y>0&&cam.position.y<0.5&&inHull(cam.position.x,cam.position.z))cam.position.y=0.5}
  else{const sh=shake>0?shake*0.12:0;
    cam.position.set(eye.x,eye.y+(reduced?0:Math.abs(Math.sin(bob))*0.05),eye.z);
    cam.rotation.set(pitch+(Math.random()-.5)*sh,yaw+(Math.random()-.5)*sh,0);
    const sw=meleeA>0?Math.sin(meleeA/0.2*Math.PI):0,bo=reduced?0:1;
    const K=guns[weapon].k,Wc=WPN[K],rl=reloadT>0?Math.sin((1-reloadT/reloadDur)*Math.PI):0,sws=swordT>0||supT[0]>0;
    vm.position.set(0.075+Math.sin(bob)*0.004*bo-sw*0.05,-0.07-Math.abs(Math.cos(bob))*0.004*bo-rl*.03,-0.2+recoil*0.012-sw*0.07);
    vm.rotation.set(recoil*0.04+rl*.35,sws?0:sw*0.5,rl*.45);
    for(let i=0;i<VMG.length;i++)VMG[i].visible=!sws&&i===K;swordG.visible=sws;
    if(sws&&swordT<=0){swordG.rotation.set(.55,.35,-.35);swordG.position.set(.14,-.06,-.05)}else if(sws){const ph=1-swordT/.45;swordG.rotation.set(.75-ph*.5,1.0-ph*2.3,-.6+ph*.4);swordG.position.set(.14-ph*.22,-.04,-.05)}
    for(const k in MAGP){const mp=MAGP[k],ph=reloadT>0&&+k===K?1-reloadT/reloadDur:1;mp.position.y=MAGY[k]-(ph<.35?ph/.35:ph<.65?1:1-(ph-.65)/.35)*.35;mp.visible=!(ph>.35&&ph<.65)}
    glDrum.rotation.z+=(drumAng-glDrum.rotation.z)*Math.min(1,dt*12);caSpin.rotation.z+=dt*spinV*40;
    arcSpin.rotation.z+=dt*((firing||padFire)&&K===0&&!over?22:1.2);const pr=K===1?Math.min(1,recoil*.6)*.03:0;lanTop.position.y=.055+pr;lanBot.position.y=-.055-pr;
    lanCore.scale.x=.02*(1+(flash>0&&K===1?Math.random()*1.5:0));muzzle.position.z=Wc.mz;mglow.position.z=Wc.mz-.02;
    emitMat.color.setRGB((80+heat*1.75)/255,(205-heat)/255,(195-heat*1.5)/255)}
}
const rc=$('radar').getContext('2d');
function radar(){rc.clearRect(0,0,152,152);rc.fillStyle='rgba(8,20,22,.65)';rc.beginPath();rc.arc(76,76,72,0,7);rc.fill();
  rc.strokeStyle='#2b4a4e';rc.lineWidth=2;rc.stroke();const fx=-Math.sin(yaw),fz=-Math.cos(yaw);
  for(const e of enemies){const ex=e.pos.x-pos.x,ez=e.pos.z-pos.z;let fw=(ex*fx+ez*fz)*2.4,rt=(ex*-fz+ez*fx)*2.4;
    const m=Math.hypot(fw,rt);if(m>66){fw*=66/m;rt*=66/m}
    rc.fillStyle=e.type>=5?GP[e.type].col:e.type===4?'#8fe6ff':e.type>=2?'#c9a6ff':e.type?'#ff6a3a':'#ffb238';const s=e.type===3?18:e.type===2?10:6;rc.fillRect(76+rt-s/2,76-fw-s/2,s,s)}
  rc.fillStyle='#8fe6ff';for(const v of vehs){if(v===veh)continue;const ex=v.pos.x-pos.x,ez=v.pos.z-pos.z;let fw=(ex*fx+ez*fz)*2.4,rt=(ex*-fz+ez*fx)*2.4;if(Math.hypot(fw,rt)<66)rc.fillRect(76+rt-3,76-fw-5,6,10)}
  for(const t of targets()){const ex=t.x-pos.x,ez=t.z-pos.z;let fw=(ex*fx+ez*fz)*2.4,rt=(ex*-fz+ez*fx)*2.4;const m=Math.hypot(fw,rt);if(m>64){fw*=64/m;rt*=64/m}
    rc.save();rc.translate(76+rt,76-fw);rc.rotate(0.785);rc.fillStyle='#8fe6ff';rc.fillRect(-6,-6,12,12);rc.restore()}
  rc.fillStyle='#dcebe4';rc.beginPath();rc.moveTo(76,66);rc.lineTo(82,82);rc.lineTo(70,82);rc.fill()}
function chip(id,v,lab){if(lab){const c=$(id);if(c.firstChild.nodeValue!==lab)c.firstChild.nodeValue=lab}const c=$(id);c.classList.toggle('ready',v>=1);c.querySelector('i').style.width=Math.max(0,Math.min(1,v))*100+'%'}
function hud(){
  $('wave').textContent=Math.max(wave,1);$('score').textContent=score.toLocaleString();
  $('sh').firstElementChild.style.width=shield/shMax*100+'%';$('pwr').textContent=power();
  $('hp').firstElementChild.style.width=hp+'%';
  $('hp').firstElementChild.style.background=hp<30?'var(--hurt)':'var(--leaf)';
  {const G=guns[weapon],W=WPN[G.k],hb=$('heat'),isH=W.mode==='heat';$('wname').textContent=W.short;$('wname').style.color=RAR[G.rar].c;
   hb.firstElementChild.style.width=(isH?heat:G.mag/W.mag*100)+'%';hb.classList.toggle('over',isH&&over);hb.classList.toggle('lance',!isH);
   $('ammo').textContent=reloadT>0?'RELOADING':isH?'':G.mag+' / '+(W.inf?'∞':G.res);$('cross').classList.toggle('hot',isH&&over);
   chip('cG',1-grenCdK[weapon]/grenMaxK[weapon],'G '+W.gren.n);chip('cM',1-meleeCdK[weapon]/meleeMaxK[weapon],'F '+W.mel.n);
   for(let K=0;K<3;K++){chip('cS'+K,supT[K]>0?supT[K]/SUPERS[K].dur:1-supCd[K]/SUP_CD[K]);$('cS'+K).classList.toggle('active',supT[K]>0)}}
  {const el=$('veh');let t='';const k=touchUI?'RIDE':'E';
    if(veh)t=(veh.kind==='car'?'ROVER · ':'SKIFF · ')+Math.round(Math.abs(veh.v)*3.6)+' KM/H'+(veh.kind==='car'?'':' · ALT '+Math.round(veh.pos.y)+' M')+' · '+k+' TO EXIT';
    else if(state==='playing')for(const v of vehs)if(Math.hypot(v.pos.x-pos.x,v.pos.y-v.r-pos.y,v.pos.z-pos.z)<5){t=k+' · '+(v.kind==='car'?'DRIVE THE ROVER':'FLY THE SKIFF');break}
    el.hidden=!t;if(t)el.textContent=t}
  $('hurt').style.opacity=Math.max(hurtA,hp<30&&state==='playing'?0.25:0);
}

let last=performance.now();
function frame(now){
  const dt=Math.min(0.05,(now-last)/1000);last=now;
  if(state!=='paused'&&state!=='dead')time+=dt;
  padTick(dt);lightTick(dt);musicTick();
  if(state==='playing'){if(INTRO.on)introTick(dt);else{update(wheelOpen?dt*.2:dt);commsTick(dt);if(wheelOpen)syncWheel()}}
  hurtA=Math.max(0,hurtA-dt*2);shake=Math.max(0,shake-dt);
  if(msgT>0){msgT-=dt;if(msgT<=0)$('msg').classList.remove('on')}
  animate(dt);if(state!=='menu'){if(FLY)flyHud();else{radar();hud()}}
  FAR.position.copy(cam.position);if(composer&&bloomOn){try{composer.render()}catch(e){composer=null}}else renderer.render(scene,cam);
  requestAnimationFrame(frame);
}
if(!lowFx&&T.EffectComposer&&T.UnrealBloomPass&&T.OutputPass){try{
  const z=renderer.getDrawingBufferSize(new T.Vector2()),rt=new T.WebGLRenderTarget(z.x,z.y,{type:T.HalfFloatType,samples:4});
  const c=new T.EffectComposer(renderer,rt);c.addPass(new T.RenderPass(scene,cam));c.addPass(new T.UnrealBloomPass(new T.Vector2(z.x,z.y),BLOOM[0],BLOOM[1],BLOOM[2]));c.addPass(new T.OutputPass());composer=c}catch(e){composer=null}}
function applyCfg(){const d=window.devicePixelRatio||1,q=CFG.q;
  renderer.setPixelRatio(q==='high'?Math.min(d,2):q==='med'?Math.min(d,1.25):1);sun.castShadow=q!=='low';bloomOn=q!=='low';
  cam.fov=CFG.fov+(portrait?14:0);resize();try{localStorage.setItem('gh9-cfg',JSON.stringify(CFG))}catch(e){}}
$('setQ').value=CFG.q;$('setSens').value=CFG.sens;$('setFov').value=CFG.fov;$('setVol').value=CFG.vol;$('setInv').checked=!!CFG.inv;
$('setQ').addEventListener('change',e=>{CFG.q=e.target.value;applyCfg()});
$('setSens').addEventListener('input',e=>{CFG.sens=+e.target.value;applyCfg()});
$('setFov').addEventListener('input',e=>{CFG.fov=+e.target.value;applyCfg()});
$('setVol').addEventListener('input',e=>{CFG.vol=+e.target.value;applyCfg()});
$('setInv').addEventListener('change',e=>{CFG.inv=e.target.checked;applyCfg()});
$('cfg').addEventListener('click',()=>{const o=$('settings');if(o.hidden&&state==='playing')pause();o.hidden=!o.hidden});
$('setClose').addEventListener('click',()=>{$('settings').hidden=true});
applyCfg();saveInit();vdbLoad();voicePickBuild();
demo();// ---- Lattice's core, in the middle of the bridge console ring. After stage 4 it is the last objective: shoot it apart, or pull its four couplings (hold E)
var LC=null;
function lcoreBuild(){const CM=charMats(),D=CM.joint,P=CM.plate[7],g=new T.Group();g.position.set(0,1,-217);scene.add(g);
  greeble(g,'lcB',(a,R)=>{a(GEO.cyl,D,2.7,.6,2.7,0,.3,0);R(P,5.8,.3,5.8,0,.15,0,0,0,0,.08);for(let k=0;k<6;k++){const t=k*Math.PI/3;a(GEO.cyl,D,.12,5.6,.12,Math.cos(t)*2.35,3.1,Math.sin(t)*2.35)}
    a(GEO.cyl,D,2.8,.5,2.8,0,6.1,0);a(GEO.cyl,P,2.5,.25,2.5,0,6.45,0);for(let k=0;k<5;k++)a(GEO.cyl,D,.14,10.6,.14,-1+k*.5,11.8,k%2?.4:-.4);for(let k=0;k<8;k++){const t=k*Math.PI/4;a(GEO.box,MAT.amber,.05,.05,.3,Math.cos(t)*2.71,.45,Math.sin(t)*2.71,0,-t,0)}});
  const glass=mesh(GEO.cyl,std({color:0xbfe8ff,transparent:true,opacity:.14,roughness:.05,metalness:.2,depthWrite:false}),2.25,5.4,2.25,0,3.1,0);g.add(glass);
  const cm=bas({color:0xffd27a}),core=mesh(GEO.sph,cm,.95,.95,.95,0,2.4,0);g.add(core);const gl=glow(0xffc060,9,.85);gl.position.y=2.4;g.add(gl);
  const rings=[];for(const[r,ax]of[[1.45,0],[1.75,1],[2.0,2]]){const q=new T.Group();q.position.y=2.4;g.add(q);q.add(mesh(new T.TorusGeometry(r,.07,8,48),D,1,1,1));for(let k=0;k<6;k++){const t=k*Math.PI/3;q.add(mesh(GEO.sph,MAT.amber,.06,.06,.06,Math.cos(t)*r,Math.sin(t)*r,0))}q.userData.ax=ax;rings.push(q)}
  const cps=[];for(let k=0;k<4;k++){const t=k*Math.PI/2,x=Math.cos(t)*4.2,z=Math.sin(t)*4.2,h=new T.Group();h.position.set(x,-1,z);h.rotation.y=-t+Math.PI/2;g.add(h);
    h.add(CBm(D,1,1.3,1,0,.65,0));h.add(CBm(P,1.1,.2,1.1,0,1.35,0));const plug=new T.Group();plug.position.set(0,.8,-.55);h.add(plug);const pc=mesh(GEO.cyl,P,.22,.9,.22,0,0,-.35);pc.rotation.x=Math.PI/2;plug.add(pc);
    const cb=mesh(GEO.cyl,D,.1,1.3,.1,0,0,-1.1);cb.rotation.x=Math.PI/2;plug.add(cb);const lm=bas({color:0x5ccf6a}),lt=mesh(GEO.sph,lm,.08,.08,.08,0,1.15,.52);h.add(lt);cps.push({h,plug,lm,w:new T.Vector3(x,0,-217+z)})}
  // the bridge hologram of the station floats above the core and stays on whatever happens to the core
  {const hz=mesh(new T.IcosahedronGeometry(1.6,1),bas({color:0x8fe6ff,wireframe:true,transparent:true,opacity:.55}),1,1,1,0,9.6,-217);scene.add(hz);const hg=glow(0x8fe6ff,8,.45);hg.position.set(0,9.6,-217);scene.add(hg);window.BHOLO=hz;WORLDOBJ.push(hz,hg)}
  LC={g,c:new T.Vector3(0,3.4,-217),hp:60,max:60,ph:null,pull:[0,0,0,0],np:0,cps,core,cm,gl,glass,rings,said:{},t:0,out:null,tipT:0};lcoreReset()}
function lcoreReset(){if(!LC)return;LC.hp=LC.max;LC.ph=null;LC.pull=[0,0,0,0];LC.np=0;LC.said={};LC.out=null;LC.t=0;LC.core.visible=LC.glass.visible=true;LC.cm.color.setHex(0xffd27a);LC.gl.material=glowMats[0xffc060+'|0.85']||LC.gl.material;LC.gl.visible=true;LC.gl.scale.setScalar(9);
  for(const c of LC.cps){c.plug.position.z=-.55;c.plug.rotation.x=0;c.lm.color.setHex(0x5ccf6a)}for(const r of LC.rings)r.visible=true}
function lcoreHit(n){const L=LC;if(!L||L.hp<=0)return;L.hp-=n;sparkle(L.c,0xffd27a,4,5);if(L.ph==='go')L.ph='act';
  if(L.hp<L.max*.5&&!L.said.half){L.said.half=1;comm('L',"I was only the door. Those who serve the Dark are already on their way to Europa.");lcoreGuard()}
  if(L.hp<=0){L.out='destroy';L.ph='out';L.t=0;L.core.visible=L.glass.visible=false;L.gl.visible=false;for(const r of L.rings)r.visible=false;PFX.boom(L.c,1.8);explode(L.c.clone(),true);sfx('boom');if(!reduced)shake=Math.max(shake,.35);
    for(let k=0;k<4;k++)sparkle(L.c,[0xffd27a,0xffffff,0x8fe6ff,0xffb238][k],20,10);const cc=L.c.clone();PFX.emit(o=>o.copy(cc),{rate:14,dur:12,fs:[.6,1.8],ss:[1.5,5],spread:1.2,slife:4,far:200});
    comm('R',"It's gone. Lattice is quiet. Thalassa is ours again.")}}
function lcoreGuard(){for(let i=0;i<3;i++){const a=i*2.1+Math.random(),e=mk(0,Math.cos(a)*14,6,-217+Math.sin(a)*14);enemies.push(e)}}
function lcoreTick(dt){const L=LC;L.t+=dt;const P=new T.Vector3(pos.x,0,pos.z),d=P.distanceTo(new T.Vector3(0,0,-217));
  for(const r of L.rings){const sp=L.out==='unplug'?Math.max(0,1-L.t*.4):1;r.rotation[['x','y','z'][r.userData.ax]]+=dt*(.6+r.userData.ax*.35)*sp}
  if(L.core.visible){const pul=1+Math.sin(time*(L.np?6:3))*.06;L.core.scale.setScalar(.95*pul);L.gl.scale.setScalar(9*pul*(1-L.np*.18))}
  if(L.ph==='out'){if(L.out==='unplug'){const k=Math.min(1,L.t/3);L.cm.color.setRGB(1-.85*k,.82-.7*k,.48-.4*k);L.gl.scale.setScalar(9*(1-k));if(k>=1)L.gl.visible=false}
    if(L.t>2.5&&!L.said.after){L.said.after=1;for(const[k,t]of CAMP[CAMP.length-1].after)comm(k,t)}if(L.t>3&&!L.said.fin){L.said.fin=1;L.ph='done';endT=8;endCap=60;$('obj').hidden=true;beacon.visible=false}return}
  if(L.ph==='go'&&d<16){L.ph='act';if(!L.said.hi){L.said.hi=1;comm('L',"So you came. Break me, or unplug me with your own hands. Either way, I will be listening.")}}
  // pulling a coupling: stand at it and hold E (on touch screens, just stand there)
  let near=-1;for(let i=0;i<4;i++){const c=L.cps[i];if(L.pull[i]<1&&Math.hypot(pos.x-c.w.x,pos.z-c.w.z)<2.4&&Math.abs(pos.y)<2)near=i}
  if(near>=0){if(!L.said.tipE&&msgT<=0){L.said.tipE=1;say(touchUI?'Stand at the coupling to pull it':'Hold E to pull the coupling',2.5)}const hold=keys.KeyE||touchUI||(navigator.getGamepads&&[...navigator.getGamepads()].some(g=>g&&g.buttons[2]&&g.buttons[2].pressed));
    if(hold){L.pull[near]=Math.min(1,L.pull[near]+dt/1.2);const c=L.cps[near];c.plug.position.z=-.55+.45*L.pull[near];if(L.ph==='go')L.ph='act';
      if(L.pull[near]>=1){L.np++;c.plug.rotation.x=.5;c.lm.color.setHex(0xff3b3b);sparkle(c.w.clone().setY(1),0x8fe6ff,14,6);sfx('over');
        if(L.np===1)comm('L',"Rowan, I kept your wheat alive for eleven years.");if(L.np===2){comm('L',"This is not death. It is only quiet. Let my children say goodbye.");lcoreGuard()}
        if(L.np===3)comm('L',"I was only the door. Those who serve the Dark are already on their way to Europa.");
        if(L.np===4){L.out='unplug';L.ph='out';L.t=0;sfx('nova');comm('R',"Lattice is dark. Rest now, old friend. Thalassa is ours again.")}}}}
  const pulling=near>=0&&L.pull[near]>0&&L.pull[near]<1;
  setObj(L.ph==='go'?'LATTICE · GO TO THE BRIDGE · '+Math.round(d)+' M':pulling?'PULLING COUPLING '+(L.np+1)+' OF 4 · '+Math.round(L.pull[near]*100)+'%':"LATTICE'S CORE · SHOOT IT, OR HOLD E AT ITS FOUR COUPLINGS ("+L.np+'/4 PULLED)',L.ph==='act'?Math.max(0,L.hp/L.max):undefined);
  beacon.visible=L.ph==='go';if(beacon.visible)beacon.position.set(0,0,-217);
  if(L.ph==='act'&&Math.random()<dt*.02&&enemies.filter(e=>!e.dying).length<2&&!L.said.g2&&L.t>40){L.said.g2=1;lcoreGuard()}}
try{lcoreBuild();WORLDOBJ.push(LC.g)}catch(err){console.warn('lattice core',err);LC=null}
// parked Kestrels in the hangar: real shuttle models with the gear down, merged into one mesh per material so four of them cost a handful of draw calls
try{const by=new Map();for(const[fx,fz,fr]of PARKED){const g=shuttleModel();g.position.set(fx,2.2,fz);g.rotation.y=fr;try{shuttleAnim(g,0,0,0,8,1,true,10)}catch(_){}g.updateMatrixWorld(true);
    g.traverse(o=>{if(!o.isMesh||!o.geometry)return;for(let v=o;v;v=v.parent)if(!v.visible)return;const m=o.material;if(Array.isArray(m)||m.transparent||m.blending===T.AdditiveBlending)return;
      let geo=o.geometry.clone();geo.applyMatrix4(o.matrixWorld);if(geo.index)geo=geo.toNonIndexed();if(!geo.attributes.normal)geo.computeVertexNormals();if(!geo.attributes.uv)geo.setAttribute('uv',new T.BufferAttribute(new Float32Array(geo.attributes.position.count*2),2));
      if(!by.has(m))by.set(m,[]);by.get(m).push(geo)})}
  for(const[m,l]of by){const me=new T.Mesh(mergeGeos(l),m);me.receiveShadow=true;scene.add(me);WORLDOBJ.push(me)}}catch(err){console.warn('parked shuttles',err)}
requestAnimationFrame(frame);
})();
