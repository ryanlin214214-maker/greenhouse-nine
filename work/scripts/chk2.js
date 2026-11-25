
(()=>{
const $=id=>document.getElementById(id);
const stage=$('stage'),cv=$('cv'),overlay=$('overlay');
const portrait=innerWidth<560&&innerHeight>innerWidth;
stage.style.setProperty('--ar',portrait?0.8:1.6);
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const T=window.THREE;
let renderer=null,composer=null;
try{renderer=new T.WebGLRenderer({canvas:cv,antialias:true})}catch(e){}
if(!renderer){$('ovText').textContent='This device or browser could not start 3D graphics (WebGL), so the game cannot run here.';$('go').hidden=true;$('ovKeys').hidden=true;return}
const CFG={q:(portrait||matchMedia('(pointer: coarse)').matches)?'low':'high',sens:1,vol:0.8,inv:false,fov:74};
try{Object.assign(CFG,JSON.parse(localStorage.getItem('gh9-cfg')||'{}'))}catch(e){}
if(!['low','med','high'].includes(CFG.q))CFG.q='high';
let bloomOn=true;
const lowFx=portrait||matchMedia('(pointer: coarse)').matches;
renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
const lin=h=>new T.Color(h).convertSRGBToLinear();
const scene=new T.Scene();scene.background=lin(0x0c2030);scene.fog=new T.Fog(lin(0x0e2a36),180,1350);
const cam=new T.PerspectiveCamera(portrait?88:74,1.6,0.08,9000);cam.rotation.order='YXZ';scene.add(cam);
function resize(){const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();
  if(composer){const z=renderer.getDrawingBufferSize(new T.Vector2());composer.setSize(z.x,z.y)}}
if(window.ResizeObserver)new ResizeObserver(resize).observe(stage);addEventListener('resize',resize);resize();
scene.add(new T.HemisphereLight(0x9fcfff,0x2a5a6a,0.55));
const sun=new T.DirectionalLight(0xffd9a8,1.5);sun.position.set(28,46,14);sun.castShadow=true;
sun.shadow.mapSize.set(lowFx?1024:4096,lowFx?1024:4096);sun.shadow.radius=2;
{const c=sun.shadow.camera;c.left=-50;c.right=50;c.top=50;c.bottom=-50;c.near=5;c.far=160}
sun.shadow.bias=-0.0006;sun.shadow.normalBias=0.04;scene.add(sun,sun.target);

/* ---------- textures and materials ---------- */
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
  hull:paint(lowFx?256:512,(g,S)=>panels(g,S,'#5d8b93',2)),
  floor:paint(lowFx?256:512,(g,S)=>{panels(g,S,'#3d5d5a',2);g.strokeStyle='rgba(255,178,56,.35)';g.lineWidth=2;g.strokeRect(20,20,S/2-40,S/2-40)}),
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
  hull:std({map:TX.hull,normalMap:normalMap(TX.hull,6),roughness:0.55,metalness:0.45}),
  vine:std({map:TX.vine,normalMap:normalMap(TX.vine,5),roughness:0.8,metalness:0.1}),
  glass:std({map:TX.glass,emissive:0xffffff,emissiveMap:TX.glass,emissiveIntensity:0.85,roughness:0.25,metalness:0}),
  floor:std({map:TX.floor,normalMap:normalMap(TX.floor,3),roughness:0.36,metalness:0.6}),
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
MAT.armor=std({color:0x2f5560,roughness:0.45,metalness:0.6});MAT.armorD=std({color:0x16272c,roughness:0.5,metalness:0.6});
MAT.tire=std({color:0x0e1416,roughness:0.9});MAT.canopy=std({color:0x0d2a33,roughness:0.05,metalness:1});
MAT.lily=std({color:0x1c5a2e,roughness:1});
MAT.leafP=std({color:0xe88fc0,emissive:0xff4fa3,emissiveIntensity:0.1,roughness:0.7,flatShading:true});
MAT.strip=bas({color:0x8fe6ff});MAT.strip.userData.noShadow=true;
MAT.drone=std({color:0xffb238,roughness:0.35,metalness:0.35});
const GEO={ico0:new T.IcosahedronGeometry(1,0),cyl:new T.CylinderGeometry(1,1,1,16),oct:new T.OctahedronGeometry(1),ico:new T.IcosahedronGeometry(1,1),box:new T.BoxGeometry(1,1,1),sph:new T.SphereGeometry(1,24,16),cone:new T.ConeGeometry(1,1,12),plane:new T.PlaneGeometry(1,1)};
const mesh=(g,m,sx,sy,sz,x=0,y=0,z=0)=>{const o=new T.Mesh(g,m);o.scale.set(sx,sy,sz);o.position.set(x,y,z);return o};
GEO.tor=GEO.tor||new T.TorusGeometry(1,0.18,8,28);GEO.hex=new T.CylinderGeometry(1,1,1,6);
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
const A=520,boxes=[],bucket=new Map(),M4=new T.Matrix4(),UP=new T.Vector3(0,1,0);
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
function stairs(x,z,dx,dz,width,top,base=0){for(let i=0;;i++){const h=top-0.25*(i+1);if(h<=base+0.01)break;const o=(i+0.5)*0.6;
  box(x+dx*o,base,z+dz*o,dx?0.6:width,h-base,dz?0.6:width,MAT.metal)}}
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
// floor with a glass window over the planet, open edges with a glass rail
{const F=A+2;box(0,-1,(80-F)/2,2*F,1,80+F,MAT.floor,false);box(0,-1,(104+F)/2,2*F,1,F-104,MAT.floor,false);
 box(-(F+20)/2,-1,92,F-20,1,24,MAT.floor,false);box((F+20)/2,-1,92,F-20,1,24,MAT.floor,false);
 box(0,-0.3,92,40,0.3,24,MAT.pane,false);
 for(const x of[-20,-10,0,10,20])box(x,-0.45,92,0.5,0.46,24,MAT.metal,false);for(const z of[80,88,96,104])box(0,-0.45,z,40,0.46,0.5,MAT.metal,false);
 box(-12,-3,92,0.7,0.7,24,MAT.hull,false);box(12,-3,92,0.7,0.7,24,MAT.hull,false);box(0,-2.6,92,0.15,0.1,24,MAT.strip,false);
 for(const[x,z,w,d]of[[0,-A-0.5,2*A+2,1],[0,A+0.5,2*A+2,1],[-A-0.5,0,1,2*A+2],[A+0.5,0,1,2*A+2]]){box(x,-1,z,w,2,d,MAT.hull,false);box(x*(A+0.25)/(A+0.5),1,z*(A+0.25)/(A+0.5),w>1?w:0.1,2.2,d>1?d:0.1,MAT.pane,false)}
 for(let i=-10;i<=10;i++)for(const sg of[-1,1]){box(i*A/10,1,sg*(A+0.25),0.25,2.3,0.25,MAT.metal,false);box(sg*(A+0.25),1,i*A/10,0.25,2.3,0.25,MAT.metal,false)}
 for(const[x,z,w,d]of[[0,-A+0.05,2*A,0.1],[0,A-0.05,2*A,0.1],[-A+0.05,0,0.1,2*A],[A-0.05,0,0.1,2*A]])box(x,1.02,z,w,0.1,d,MAT.strip,false)}
// core: hub, catwalk, south-east deck, cover
box(0,0,0,12,1.5,12,MAT.hull);box(0,1.38,0,12.12,0.12,12.12,MAT.amber,false);box(0,1.5,0,3,3,3,MAT.glass);
stairs(0,6,0,1,4,1.5);stairs(0,-6,0,-1,4,1.5);stairs(6,0,1,0,4,1.5);stairs(-6,0,-1,0,4,1.5);
box(0,2.75,-24,36,0.25,4,MAT.metal);for(const x of[-16,-5,5,16])box(x,0,-24,1,2.75,1,MAT.hull);
stairs(18,-24,1,0,4,3);stairs(-18,-24,-1,0,4,3);
box(0,3.95,-22.05,36,0.07,0.07,MAT.metal,false);for(let x=-18;x<=18;x+=4)box(x,3,-22.05,0.07,0.95,0.07,MAT.metal,false);
box(22,0,22,10,2,10,MAT.hull);box(22,1.88,22,10.12,0.12,10.12,MAT.amber,false);stairs(17,22,-1,0,4,2);box(24,2,24,3,2.5,3,MAT.glass);
box(-18,0,6,1,3.5,10,MAT.vine);box(18,0,6,1,3.5,10,MAT.vine);box(-10,0,18,12,3.5,1,MAT.vine);box(10,0,-14,10,3.5,1,MAT.vine);
for(const[x,z]of[[-15,-12],[15,-8],[-14,24],[8,26]])box(x,0,z,2,6,2,MAT.hull);
box(-23,0,-8,4,3,4,MAT.glass);box(24,0,-2,4,3,4,MAT.glass);box(-4,0,25,6,3,3,MAT.glass);
box(-24,0,20,3,1,3,MAT.crateA);box(-24,1,20,2,1,2,MAT.crateB);
for(const[x,z,w,d]of[[-8,-13,6,1.6],[-12,12,1.6,6],[12,12,1.6,6],[-25,10,5,1.6],[25,10,5,1.6],[-6,-19,1.6,4],[3,17,6,1.6],[12,-21,1.6,4]])planter(x,0,z,w,d);
// hedges between districts, each with a gap
for(const sgn of[-1,1]){box(34*sgn,0,-20,1,3.5,22,MAT.vine);box(34*sgn,0,20,1,3.5,22,MAT.vine);box(-20,0,34*sgn,22,3.5,1,MAT.vine);box(20,0,34*sgn,22,3.5,1,MAT.vine)}
// east: orchard
{let k=0;for(let x=42;x<=66;x+=8)for(let z=-28;z<=28;z+=8)tree(x+(hash(k,3)-.5)*2,z+(hash(k,4)-.5)*2,k++);
 planter(54,0,-32,10,1.6);planter(54,0,32,10,1.6);box(54,0,0,3,0.5,3,MAT.hull);box(54,0.5,0,2,2.5,2,MAT.glass)}
// west: tank farm with a high walkway and reflecting pools
for(const x of[-60,-48])for(const z of[-24,-8,8,24]){box(x,0,z,5,4,5,MAT.glass);box(x,4,z,5.4,0.3,5.4,MAT.metal)}
box(-54,4.3,0,2.5,0.25,58,MAT.metal);stairs(-54,29,0,1,2.5,4.55);stairs(-54,-29,0,-1,2.5,4.55);
box(-41,0.02,0,5,0.05,52,MAT.water,false);box(-67,0.02,0,5,0.05,52,MAT.water,false);
// south: cargo yard
for(let i=0;i<26;i++){const x=-30+hash(i,1)*60,z=40+hash(i,2)*26,w=2+hash(i,3)*2.5,h=1+Math.floor(hash(i,4)*3);
  if(Math.abs(x)<8)continue;box(x,0,z,w,h,w*0.7,i%2?MAT.crateA:MAT.crateB)}
box(0,0,58,2,11,2,MAT.hull);box(0,10,50,1.2,0.8,18,MAT.metal,false);box(0,6.5,43,3,3.5,3,MAT.crateA,false);box(0,10,43,0.1,0.1,0.1,MAT.metal,false);
// north: terraces
box(0,0,-46,60,1.5,8,MAT.hull);box(0,0,-54,60,3,8,MAT.hull);box(0,0,-62,60,4.5,8,MAT.hull);
for(const sgn of[-1,1]){stairs(20*sgn,-42,0,1,4,1.5);stairs(10*sgn,-50,0,1,4,3,1.5);box(18*sgn,4.5,-63.5,10,3,3,MAT.glass);planter(22*sgn,1.5,-46,8,1.6);planter(24*sgn,3,-54,8,1.6)}
stairs(0,-58,0,1,4,4.5,3);box(0,4.38,-58.05,60.1,0.12,0.1,MAT.amber,false);
// corner towers
for(const sx of[-1,1])for(const sz of[-1,1]){const x=60*sx,z=60*sz;box(x,0,z,8,6,8,MAT.hull);box(x,6,z,6,2.5,6,MAT.glass);box(x,5.88,z,8.12,0.12,8.12,MAT.amber,false);box(x,8.5,z,7,0.3,7,MAT.metal);pad(54*sx,0,54*sz,20)}
// far north: the summit, stepped up to a lookout over the edge
box(0,0,-70,60,6,8,MAT.hull);box(0,0,-78,60,7.5,8,MAT.hull);box(0,0,-86,60,9,8,MAT.hull);box(0,0,-100,60,10.5,20,MAT.hull);
for(const sgn of[-1,1]){stairs(6*sgn,-66,0,1,4,6,4.5);stairs(6*sgn,-82,0,1,4,9,7.5);planter(22*sgn,6,-70,8,1.6);planter(22*sgn,9,-86,8,1.6);
  tree(20*sgn,-101,40+sgn,10.5);tree(12*sgn,-107,44+sgn,10.5);box(5*sgn,10.5,-97,0.6,3.5,0.6,MAT.hull);box(5*sgn,10.5,-103,0.6,3.5,0.6,MAT.hull)}
stairs(0,-74,0,1,4,7.5,6);stairs(0,-90,0,1,4,10.5,9);box(0,10.38,-90.05,60.1,0.12,0.1,MAT.amber,false);
box(0,14,-100,12,0.25,8,MAT.pane,false);box(0,13.9,-100,12.4,0.12,8.4,MAT.metal,false);pad(24,10.5,-100,26);
// far east: the lake, a boardwalk and the elder tree on its island
box(92,0.03,0,30,0.05,96,MAT.water,false);box(84,0,0,3,0.28,96,MAT.metal);box(90,0,0,9,0.28,3,MAT.metal);box(98,0,0,10,0.28,10,MAT.metal);box(98,0,0,8.5,0.56,8.5,MAT.soil);
box(98,0.56,0,1.6,9,1.6,MAT.bark);
for(let i=0;i<11;i++){const a=i*2.4,r=i?3.2+hash(i,31)*2.2:0,sc=3.2+hash(i,32)*1.6;blob(GEO.ico,[MAT.leafP,MAT.leaf,MAT.leafP,MAT.leafD][i%4],sc,sc*0.75,sc,98+Math.cos(a)*r,10.5+hash(i,33)*3,Math.sin(a)*r,a)}
for(let i=0;i<46;i++){const a=hash(i,41)*6.283,r=3+hash(i,42)*4.5;blob(GEO.ico0,MAT.bloom,0.32,0.32,0.32,98+Math.cos(a)*r,8.4+hash(i,43)*5.5,Math.sin(a)*r)}
for(let i=0;i<50;i++){const x=78+hash(i,51)*28,z=-46+hash(i,52)*92,r=0.5+hash(i,53)*0.5;if(Math.abs(x-84)<2.4||(Math.abs(x-96)<8&&Math.abs(z)<6.5))continue;
  blob(GEO.cyl,MAT.lily,r,0.03,r,x,0.1,z);if(i%3===0)blob(GEO.ico0,MAT.bloom,0.2,0.2,0.2,x,0.3,z)}
// far west: the spire, a spiral stair to a platform 20 m up
box(-92,0,0,6,20,6,MAT.hull);box(-92,6,0,6.1,1.5,6.1,MAT.glass,false);box(-92,13,0,6.1,1.5,6.1,MAT.glass,false);
for(let i=0;i<80;i++){const q=(i+0.5)*0.8%32,side=q/8|0,t=q-side*8-4,h=0.25*(i+1);let x,z,w=2,d=0.82;
  if(side===0){x=4;z=t}else if(side===1){x=-t;z=4;w=0.82;d=2}else if(side===2){x=-4;z=-t}else{x=t;z=-4;w=0.82;d=2}
  box(-92+x,h-0.3,z,w,0.3,d,MAT.metal)}
box(-92,19.7,7,18,0.3,4,MAT.metal);box(-92,19.7,-7,18,0.3,4,MAT.metal);box(-85,19.7,0,4,0.3,10,MAT.metal);box(-99,19.7,0,4,0.3,10,MAT.metal);
box(-88,19.7,0,2,0.3,10,MAT.metal);box(-93,19.7,4,8,0.3,2,MAT.metal);box(-96,19.7,-1,2,0.3,8,MAT.metal);
box(-92,20,0,0.5,5,0.5,MAT.metal);blob(GEO.sph,MAT.strip,0.8,0.8,0.8,-92,25.6,0);box(-92,19.88,0,18.1,0.12,18.1,MAT.amber,false);pad(-81,0,0,28.5);
// far south: the gate and the glass-floored promenade
blob(new T.TorusGeometry(8,0.6,10,48),MAT.hull,1,1,1,0,7.4,76);blob(new T.TorusGeometry(7.3,0.14,8,48),MAT.amber,1,1,1,0,7.4,76);
for(const sgn of[-1,1]){planter(26*sgn,0,92,1.6,20);tree(33*sgn,84,60+sgn);tree(33*sgn,100,64+sgn);box(14*sgn,0,107,6,0.5,1.2,MAT.metal);
  box(9.5*sgn,0,76,1.6,1.2,1.6,MAT.hull)}
// outer corner groves
{let k=80;for(const sx of[-1,1])for(const sz of[-1,1]){for(let i=0;i<6;i++){const a=i*1.05;tree(94*sx+Math.cos(a)*7,94*sz+Math.sin(a)*7,k++)}box(94*sx,0,94*sz,3,0.5,3,MAT.hull);box(94*sx,0.5,94*sz,2,2.5,2,MAT.glass)}}
// ---- the outer deck: roads, airstrip, fields, groves, domes, outposts
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
// ---- the far ring: more roads, fields, groves, lakes and watchtowers
{const road=(x,z,w,d)=>{box(x,0,z,w,0.05,d,MAT.road,false);if(w>d)box(x,0.02,z,w,0.05,0.35,MAT.line,false);else box(x,0.02,z,0.35,0.05,d,MAT.line,false)};
 for(const sg of[-1,1]){road(0,385*sg,10,160);road(385*sg,0,160,10);road(0,470*sg,950,10);road(470*sg,0,10,950)}
 for(const d of[340,380,420])for(const[x,z]of[[7,-d],[7,d],[-d,7],[d,7]]){box(x,0,z,0.5,9,0.5,MAT.metal);blob(GEO.sph,MAT.strip,0.45,0.45,0.45,x,9.3,z);GLOWS.push([x,9.3,z,0x8fe6ff,5,0.6])}
 for(const[cx,cz,w,d]of[[-385,-150,120,90],[-385,150,120,90],[385,-150,120,90],[385,150,120,90],[-150,-385,90,120],[150,-385,90,120],[-150,385,90,120],[150,385,90,120]]){const ax=w>d,n=Math.floor((ax?d:w)/2.6);
   for(let i=0;i<n;i++){const o=(i-(n-1)/2)*2.6,h=0.35+hash(i,cx+cz|0)*0.3,m=i%2?MAT.leaf:MAT.leafD;if(ax)box(cx,0,cz+o,w,h,1.3,m,false);else box(cx+o,0,cz,1.3,h,d,m,false)}}
 {let k=400;for(const[cx,cz]of[[395,395],[-395,395],[395,-395],[-395,-395],[-385,-55],[385,55],[55,385],[-55,-385],[330,250],[-330,-250],[250,-340],[-250,340]])for(let i=0;i<8;i++){const a=i*0.8+hash(k,5)*2,r=3+hash(k,6)*10;tree(cx+Math.cos(a)*r,cz+Math.sin(a)*r,k++)}}
 for(const[cx,cz]of[[-385,300],[385,-300]]){box(cx,0.03,cz,80,0.05,56,MAT.water,false);box(cx,0,cz,3,0.28,56,MAT.metal);box(cx+14,0,cz,9,0.56,9,MAT.soil);tree(cx+14,cz,500+cx,0.56);
   for(let i=0;i<30;i++){const x=cx-38+hash(i,cx+61)*76,z=cz-26+hash(i,cx+62)*52,r=0.5+hash(i,63)*0.5;if(Math.abs(x-cx)<2.4||(Math.abs(x-cx-14)<6&&Math.abs(z-cz)<6))continue;blob(GEO.cyl,MAT.lily,r,0.03,r,x,0.1,z);if(i%3===0)blob(GEO.ico0,MAT.bloom,0.2,0.2,0.2,x,0.3,z)}}
 for(const sx of[-1,1])for(const sz of[-1,1]){const x=445*sx,z=445*sz;box(x,0,z,7,12,7,MAT.hull);box(x,12,z,9,3,9,MAT.glass);box(x,11.88,z,7.12,0.12,7.12,MAT.amber,false);box(x,15,z,9.6,0.3,9.6,MAT.metal);pad(x-7*sx,0,z-7*sz,26);GLOWS.push([x,17,z,0xffb238,8,0.7])}
}
MAT.win=bas({color:0xb88a46});MAT.win.userData.noShadow=true;
{const deco=(geo,mat,sx,sy,sz,x,y,z,rx=0,ry=0,rz=0)=>{const g=geo.clone();g.applyMatrix4(M4.compose(new T.Vector3(x,y,z),new T.Quaternion().setFromEuler(new T.Euler(rx,ry,rz)),new T.Vector3(sx,sy,sz)));addGeo(mat,g)};
 const winRow=(x0,z0,dx,dz,n,y,h,nx,nz)=>{for(let i=0;i<n;i++)if(hash(i,x0+z0|0)>.25)box(x0+dx*i,y,z0+dz*i,Math.abs(dx)>0?Math.abs(dx)*.6:0.06,h,Math.abs(dz)>0?Math.abs(dz)*.6:0.06,MAT.win,false)};
 const dish=(x,y,z,r,ry)=>{deco(GEO.cyl,MAT.metal,.12,1.2,.12,x,y+.6,z);deco(new T.SphereGeometry(1,16,8,0,6.283,0,1.1),MAT.metal,r,r*.5,r,x,y+1.5,z,-1,ry,0)};
 const roofGear=(x,y,z,k)=>{for(let i=0;i<3;i++)box(x-3+i*3,y,z+(hash(i,k)-.5)*3,1.6,0.9,1.6,MAT.metal,false);for(let i=0;i<4;i++)deco(GEO.cyl,MAT.hull,.35,.8,.35,x+4,y+.4,z-2+i*1.2)};
 // hub: corner pylons, vents and pipes
 for(const sx of[-1,1])for(const sz of[-1,1]){box(sx*5.6,1.5,sz*5.6,.4,2.4,.4,MAT.metal,false);deco(GEO.sph,MAT.strip,.18,.18,.18,sx*5.6,4.05,sz*5.6);GLOWS.push([sx*5.6,4.05,sz*5.6,0x8fe6ff,1.6,.6]);
   for(let i=0;i<3;i++)box(sx*(2.6+i*.9),1.5,sz*4.6,.5,.25,1.2,MAT.metal,false)}
 for(const s of[-1,1])deco(GEO.cyl,MAT.metal,.18,12,.18,s*6.15,.75,0,1.571,0,0);
 // hangar and tower at the airstrip
 for(let i=0;i<6;i++)box(150,6.4,-104.5+i*2.9,18.6,.35,.3,MAT.metal,false);winRow(141.6,-104,0,2.6,6,4.5,.6);winRow(158.4,-104,0,2.6,6,4.5,.6);
 dish(172,17.3,-98,1.4,.7);for(let i=0;i<5;i++)box(169.4,1+i*2.6,-98,.06,.4,4,MAT.win,false);
 // outposts: lit windows, roof gear, dishes, pipes
 for(const sx of[-1,1])for(const sz of[-1,1]){const cx=240*sx,cz=240*sz,k=(sx+2)*10+sz;
   winRow(cx-6.5,cz-6.95,2.6,0,6,3.2,.55);winRow(cx-6.5,cz-17.05,2.6,0,6,3.2,.55);
   for(const s of[-1,1]){winRow(cx+s*16-s*4.05,cz-3,0,2.6,4,2.2,.5);roofGear(cx+s*16,4,cz+2,k+s)}
   dish(cx-5,8.8,cz-14,1.8,sx);deco(GEO.cyl,MAT.metal,.22,9,.22,cx+8.3,4.5,cz-6.9,1.571,0,1.571);deco(GEO.cyl,MAT.metal,.22,6,.22,cx+12.5,3,cz-6.9);
   box(cx,0,cz-6.9,3,3.4,.2,MAT.armorD,false);box(cx,3.45,cz-6.85,3.3,.12,.3,MAT.strip,false)}
 // watchtowers: window bands and ladders
 for(const sx of[-1,1])for(const sz of[-1,1]){const x=445*sx,z=445*sz;for(let i=0;i<4;i++){box(x,2+i*2.6,z+3.53,1.8,.5,.06,MAT.win,false);box(x+3.53,2+i*2.6,z,.06,.5,1.8,MAT.win,false)}
   for(const o of[-.4,.4])box(x-3.6,0,z+o,.08,12,.08,MAT.metal,false);for(let i=0;i<20;i++)box(x-3.6,.3+i*.6,z,.08,.06,.8,MAT.metal,false)}
 // domes: ribs
 for(const[cx,cz]of[[-200,160],[200,160],[-200,-160],[200,-160]])for(let i=0;i<6;i++)deco(new T.TorusGeometry(16,.12,6,48,Math.PI),MAT.metal,1,1,1,cx,0,cz,0,i*.524,0);
 // under the deck: trusses, keel beams and engine pods you see past the rail
 const E=A+0.5;for(const sg of[-1,1]){box(0,-7,sg*(E-2),2*E,1.2,1.4,MAT.hull,false);box(sg*(E-2),-7,0,1.4,1.2,2*E,MAT.hull,false);box(0,-13,sg*(E-14),2*E-20,1.6,2,MAT.hull,false);box(sg*(E-14),-13,0,2,1.6,2*E-20,MAT.hull,false);
   for(let i=-12;i<=12;i++){const t=i*E/12.5;for(const[x,z]of[[t,sg*(E-2)],[sg*(E-2),t]]){box(x,-7,z,.8,7,.8,MAT.metal,false);deco(GEO.box,MAT.metal,.4,9,.4,x*0.985,-10,z*0.985,(z===t?0:sg)*.6,0,(x===t?0:-sg)*.6)}}}
 for(let i=0;i<8;i++){const a=i/8*6.283+.39,x=Math.cos(a)*(E-30),z=Math.sin(a)*(E-30);deco(GEO.cyl,MAT.hull,7,14,7,x,-22,z);deco(GEO.cyl,MAT.metal,8,1.5,8,x,-15,z);
   deco(GEO.tor||(GEO.tor=new T.TorusGeometry(1,0.18,8,28)),MAT.strip,8,8,8,x,-29.4,z,1.571,0,0);GLOWS.push([x,-31,z,0x8fe6ff,26,.55])}
 for(const[x,z]of[[0,92],[0,-92]])for(let k=-2;k<=2;k++)box(x+k*8,-4.5,z,.6,8,.6,MAT.metal,false);
}
flush();
// ground cover: thousands of small plants and flowers on the open land
{const N=lowFx?2500:9000,im=new T.InstancedMesh(new T.ConeGeometry(1,1,5),std({color:0xffffff,roughness:0.85,flatShading:true}),N),d=new T.Object3D(),c=new T.Color(),cols=[0x3f9d4c,0x4fb85a,0x2f7d3e,0x62c96a];
 let n=0;for(let i=0;n<N&&i<N*4;i++){const x=(hash(i,901)*2-1)*(A-6),z=(hash(i,902)*2-1)*(A-6),ax=Math.abs(x),az=Math.abs(z);
   if((ax<136&&az<136)||ax<8||az<8||Math.abs(ax-128)<8||Math.abs(az-128)<8||Math.abs(ax-300)<8||Math.abs(az-300)<8||Math.abs(ax-470)<8||Math.abs(az-470)<8||(x>135&&x<335&&z<-55&&z>-110)||inBox(x,0.3,z))continue;
   const fl=i%7===0,h=fl?0.35:0.3+hash(i,903)*0.7;d.position.set(x,h/2,z);d.scale.set(fl?0.16:0.14+hash(i,904)*0.2,h,fl?0.16:0.14+hash(i,905)*0.2);d.rotation.y=i;d.updateMatrix();im.setMatrixAt(n,d.matrix);
   im.setColorAt(n,c.set(fl?[0xff4fa3,0xffd27a,0xc9a6ff][i%3]:cols[i%4]).convertSRGBToLinear());n++}
 im.count=n;im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;im.receiveShadow=true;scene.add(im)}
// drifting pollen around the camera, and an aurora
const motes=new T.Points(new T.BufferGeometry(),new T.PointsMaterial({map:glowTex,color:0xffe9b0,size:0.16,transparent:true,opacity:0.7,depthWrite:false,blending:T.AdditiveBlending,fog:false}));
{const a=new Float32Array((lowFx?120:320)*3);for(let i=0;i<a.length;i++)a[i]=(Math.random()-0.5)*60;motes.geometry.setAttribute('position',new T.BufferAttribute(a,3));motes.frustumCulled=false;scene.add(motes)}
const auroraTex=paint(256,(g,S)=>{g.fillStyle='#000';g.fillRect(0,0,S,S);for(let x=0;x<S;x+=2){const h=S*(0.35+hash(x,77)*0.6),gr=g.createLinearGradient(0,S,0,S-h);
  gr.addColorStop(0,'rgba(60,255,170,0)');gr.addColorStop(0.25,`rgba(60,255,170,${0.25+hash(x,78)*0.35})`);gr.addColorStop(0.7,'rgba(120,140,255,0.18)');gr.addColorStop(1,'rgba(200,90,255,0)');g.fillStyle=gr;g.fillRect(x,S-h,2,h)}});
for(const[r,y,st,rot]of[[3200,700,1.3,0.4],[3600,1000,1.0,2.4],[2900,500,0.8,4.4]]){const m=new T.Mesh(new T.CylinderGeometry(r,r,900,48,1,true,0,st),bas({map:auroraTex,transparent:true,opacity:0.5,blending:T.AdditiveBlending,side:T.DoubleSide,depthWrite:false,fog:false}));
  m.position.y=y;m.rotation.y=rot;scene.add(m)}
for(const[x,y,z,c,sz,o]of GLOWS){const gl=glow(c,sz,o);gl.position.set(x,y,z);scene.add(gl)}
for(const q of PADS){const gl=glow(0x8fe6ff,4.5,0.5);gl.position.set(q.x,q.y+0.7,q.z);scene.add(gl)}
for(const[x,y,z]of[[98,12,0],[95,10.5,3],[101,11,-3],[98,9,4],[-92,25.6,0]]){const gl=glow(x>0?0xff7fbf:0x8fe6ff,x>0?9:7,x>0?0.22:0.8);gl.position.set(x,y,z);scene.add(gl)}
{const lamps=[[0,5.1,0,0xffb238,1.7,24],[98,8,0,0xff7fbf,1.0,46],[-92,27,0,0x6fd8ff,0.9,40],[0,6,92,0x6fd8ff,1.4,38],[0,13.4,-100,0xffb238,0.8,32],
   [24,3.7,-2,0xffb238,1.3,18],[0,2.2,-24,0x6fd8ff,1.1,18],[54,5,0,0xff7fbf,1.6,30],[-54,6,0,0xffb238,1.6,30],[0,8,50,0x6fd8ff,1.6,30],[0,7,-58,0xffb238,1.6,30]];
 for(const[x,y,z,c,i,d]of lowFx?lamps.slice(0,4):lamps){const L=new T.PointLight(c,i,d,2);L.position.set(x,y,z);scene.add(L);const gl=glow(c,9,0.3);gl.position.set(x,y-0.6,z);scene.add(gl)}}
// sky
// sky, the planet below and far scenery
const farAnim=[];
{const vn=(x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),a=hash(xi,yi),b=hash(xi+1,yi),c=hash(xi,yi+1),d=hash(xi+1,yi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};
 const fbm=(x,y,o)=>{let r=0,a=0.5;for(let i=0;i<o;i++){r+=a*vn(x,y);x=x*2.03+17;y=y*2.03+9;a*=0.5}return r};
 const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t],cl=t=>Math.max(0,Math.min(1,t));
 function pix(w,h,fn,rep){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),im=g.createImageData(w,h),d=im.data;
   for(let y=0;y<h;y++)for(let x=0;x<w;x++){const q=fn(x,y),i=(y*w+x)*4;d[i]=q[0];d[i+1]=q[1];d[i+2]=q[2];d[i+3]=q.length>3?q[3]:255}
   g.putImageData(im,0,0);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;if(rep){t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rep[0],rep[1])}return t}
 // sky: a band of nebula over deep space
 const SW=lowFx?512:1024,SH=SW/2,sk=pix(SW,SH,(x,y)=>{const u=x/SW,v=y/SH,k=150*SW/1024,n=fbm(x/k,y/k,4)*(1-u)+fbm((x-SW)/k,y/k,4)*u,m=fbm(x/k/2+40,y/k/2,3)*(1-u)+fbm((x-SW)/k/2+40,y/k/2,3)*u;
   const band=Math.exp(-Math.pow((v-0.3-0.08*Math.sin(u*6.283))/0.16,2)),neb=cl((n-0.42)*3)*band,hz=Math.exp(-Math.pow((v-0.5)/0.07,2));
   const col=m<0.5?mix([106,66,184],[255,79,163],cl(m*2)):mix([255,79,163],[111,216,255],cl(m*2-1));
   return[4+col[0]*neb*0.4+10*hz,7+col[1]*neb*0.4+38*hz,16+col[2]*neb*0.45+48*hz]});
 const skyM=mesh(GEO.sph,bas({map:sk,side:T.BackSide,fog:false,depthWrite:false}),5000,5000,5000);scene.add(skyM);
 // planet below the deck
 const R=9000,TL=0.75,PY=-(R+780)*Math.cos(TL),PZ=(R+780)*Math.sin(TL),PS=lowFx?512:1024,pg=new T.Group();pg.position.set(0,PY,PZ);pg.rotation.x=-TL;scene.add(pg);
 const land=pix(PS,PS,(x,y)=>{const h=fbm(x/PS*7+3,y/PS*7+7,6),f=fbm(x/PS*30+1,y/PS*30+5,3);
   if(h>0.54){const t=cl((h-0.54)/0.26);return t<0.25?mix([200,170,110],[78,140,84],t*4):t<0.65?mix([78,140,84],[112,92,140],(t-0.25)*2.5):mix([112,92,140],[232,232,238],(t-0.65)*2.86)}
   const t=h/0.54,c=t<0.75?mix([6,30,62],[12,82,116],t/0.75):mix([12,82,116],[62,178,176],(t-0.75)*4);return[c[0]+f*10,c[1]+f*14,c[2]+f*14]},[6,3]);
 const planet=mesh(new T.SphereGeometry(1,96,64),bas({map:land,color:0x969696,fog:false}),R,R,R);planet.rotation.x=Math.PI/2;pg.add(planet);
 const CS=lowFx?256:512,cf=(x,y)=>fbm(x/CS*6+50,y/CS*6+20,5),cloud=pix(CS,CS,(x,y)=>{const a=(cf(x,y)*(CS-x)*(CS-y)+cf(x-CS,y)*x*(CS-y)+cf(x,y-CS)*(CS-x)*y+cf(x-CS,y-CS)*x*y)/(CS*CS);
   return[245,248,250,cl((a-0.5)/0.16)*235]},[12,6]);
 const cg=new T.Group(),cm=mesh(new T.SphereGeometry(1,96,64),bas({map:cloud,color:0x8c8c8c,transparent:true,depthWrite:false,fog:false}),R+42,R+42,R+42);cm.rotation.x=Math.PI/2;cg.add(cm);pg.add(cg);
 farAnim.push(dt=>{cg.rotation.y+=dt*0.0035});
 pg.add(mesh(new T.SphereGeometry(1,96,64),new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,
   vertexShader:'varying vec3 vN;varying vec3 vV;void main(){vec4 m=modelViewMatrix*vec4(position,1.0);vN=normalize(normalMatrix*normal);vV=normalize(-m.xyz);gl_Position=projectionMatrix*m;}',
   fragmentShader:'varying vec3 vN;varying vec3 vV;void main(){float f=pow(1.0-max(dot(normalize(vN),normalize(vV)),0.0),3.0);gl_FragColor=vec4(vec3(0.28,0.68,1.0)*f*1.25,1.0);}'}),R+126,R+126,R+126));
 try{const es=new T.Scene();es.add(skyM.clone());es.add(mesh(GEO.sph,bas({color:0xfff0d8}),700,700,700,2000,3320,1000));const pc=mesh(GEO.sph,bas({color:0x3f8fb0}),R,R,R,0,PY,PZ);es.add(pc);
  const pm=new T.PMREMGenerator(renderer);scene.environment=pm.fromScene(es,0,1,10000).texture;pm.dispose()}catch(e){}
 scene.add(mesh(new T.IcosahedronGeometry(1,3),bas({color:lin(0x1f4a54),wireframe:true,fog:false}),A*2.2,A*2.2,A*2.2,0,-A*0.6,0));
 const p=[];for(let i=0;i<1500;i++){const a=Math.random()*6.283,e=Math.acos(Math.random()*1.25-0.25),r=4200;p.push(Math.sin(e)*Math.cos(a)*r,Math.cos(e)*r,Math.sin(e)*Math.sin(a)*r)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));
 scene.add(new T.Points(g,new T.PointsMaterial({color:0xffffff,size:1.7,sizeAttenuation:false,fog:false})));
 // sun
 for(const[c,sz,o]of[[0xfff2d0,340,1],[0xffd9a0,2000,0.35]]){const q=glow(c,sz,o);q.position.set(2000,3320,1000);scene.add(q)}
 // ringed giant
 const pt=paint(256,(g,S)=>{const cols=['#f2c08a','#e07a5f','#8a4fd0','#f4a3c0','#5b3fa8','#ffd9a0','#c75a8a'];
   for(let y=0;y<S;y+=4){g.fillStyle=cols[Math.floor(hash(y>>4,5)*cols.length)];g.fillRect(0,y,S,4)}
   for(let i=0;i<40;i++){g.fillStyle=`rgba(255,255,255,${0.04+hash(i,8)*0.08})`;g.beginPath();g.ellipse(hash(i,1)*S,hash(i,2)*S,30+hash(i,3)*50,4+hash(i,4)*6,0,0,7);g.fill()}});
 const P=[-2040,1380,-2880];
 scene.add(mesh(GEO.sph,new T.MeshLambertMaterial({map:pt,fog:false}),660,660,660,...P));
 const ring=mesh(new T.RingGeometry(72,94,72),bas({color:0xffc98a,transparent:true,opacity:0.16,side:T.DoubleSide,fog:false,depthWrite:false,blending:T.AdditiveBlending}),12,12,12,...P);ring.rotation.set(1.3,0.35,0);scene.add(ring);
 const halo=glow(0xff8fb0,3600,0.3);halo.position.set(...P);scene.add(halo);
 {const N=lowFx?250:700,rock=new T.InstancedMesh(new T.IcosahedronGeometry(1,0),new T.MeshLambertMaterial({color:0x8a7c70,fog:false,flatShading:true}),N),d=new T.Object3D(),belt=new T.Group();
  for(let i=0;i<N;i++){const a=Math.random()*6.283,r=2700+Math.random()*700,sz=4+Math.pow(Math.random(),3)*60;d.position.set(Math.cos(a)*r,(Math.random()-.5)*160,Math.sin(a)*r);d.rotation.set(Math.random()*6,Math.random()*6,0);d.scale.set(sz,sz*(.6+Math.random()*.5),sz*(.7+Math.random()*.4));d.updateMatrix();rock.setMatrixAt(i,d.matrix)}
  belt.add(rock);belt.position.y=700;belt.rotation.set(.32,0,.18);scene.add(belt);farAnim.push(dt=>{belt.rotation.y+=dt*.004})}
 {const mt=paint(256,(g,S)=>{g.fillStyle='#9a9fa8';g.fillRect(0,0,S,S);grime(g,S,4000,.12);for(let i=0;i<70;i++){const x=hash(i,11)*S,y=hash(i,12)*S,r=3+Math.pow(hash(i,13),2)*28;
    g.fillStyle='rgba(60,62,70,.45)';g.beginPath();g.arc(x,y,r,0,7);g.fill();g.strokeStyle='rgba(225,228,235,.4)';g.lineWidth=1.5;g.beginPath();g.arc(x-1,y-1,r,3.6,5.6);g.stroke()}});
  scene.add(mesh(GEO.sph,new T.MeshLambertMaterial({map:mt,fog:false}),180,180,180,1700,980,-2500))}
 {const dm=new T.MeshLambertMaterial({color:0x3c545b,fog:false}),dg=inst(bake(a=>{a(GEO.box,dm,40,40,900);for(let i=0;i<14;i++){const z=-420+i*64,h=80+hash(i,21)*160;a(GEO.box,dm,h*1.4,8,10,0,0,z);a(GEO.box,dm,8,h,10,0,0,z+20)}
    for(let i=0;i<6;i++)a(GEO.cyl,dm,30,60,30,0,40,-300+i*120)}),false);dg.position.set(-3100,520,-900);dg.rotation.set(.2,.9,.35);scene.add(dg);
  const lp=[];for(let i=0;i<60;i++)lp.push((hash(i,31)-.5)*200,(hash(i,32)-.5)*160,(hash(i,33)-.5)*900);const lg=new T.BufferGeometry();lg.setAttribute('position',new T.Float32BufferAttribute(lp,3));
  const lmat=new T.PointsMaterial({color:0xff8a5a,size:2.4,sizeAttenuation:false,fog:false,transparent:true});const pts=new T.Points(lg,lmat);dg.add(pts);farAnim.push(()=>{lmat.opacity=.4+.6*(Math.sin(time*2.3)>0?1:0)})}
 {const lanes=[];for(let l=0;l<4;l++){const n=30,arr=new Float32Array(n*3),g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(arr,3));
    const pm=new T.Points(g,new T.PointsMaterial({color:l%2?0xffd9a0:0x9fe6ff,size:2,sizeAttenuation:false,fog:false}));pm.frustumCulled=false;scene.add(pm);lanes.push({arr,g,r:1300+l*380,h:180+l*120,sp:(l%2?-1:1)*(.01+l*.003),ph:l*1.7})}
  farAnim.push(()=>{for(const L of lanes){for(let i=0;i<30;i++){const a=L.ph+time*L.sp+i*.035;L.arr[i*3]=Math.cos(a)*L.r;L.arr[i*3+1]=L.h+Math.sin(a*3)*20;L.arr[i*3+2]=Math.sin(a)*L.r}L.g.attributes.position.needsUpdate=true}})}
 // sister decks, a ring station and passing ships
 const farMat=new T.MeshLambertMaterial({color:0x6f9aa3,fog:false}),disc=new T.CylinderGeometry(1,1,1,48),cap=new T.SphereGeometry(1,24,10,0,6.283,0,1.571);
 for(const[x,y,z,k]of[[900,-60,-1300,1],[-1500,140,600,1.3],[500,260,1900,0.9]]){const d=new T.Group();
   d.add(mesh(disc,farMat,120*k,10*k,120*k),mesh(cap,bas({color:0x6fd8ff,transparent:true,opacity:0.1,fog:false,depthWrite:false,blending:T.AdditiveBlending}),118*k,60*k,118*k,0,5*k,0));
   const q=glow(0xffb238,200*k,0.7);q.position.y=16*k;d.add(q);for(let i=0;i<8;i++){const w=glow(0x8fe6ff,34*k,0.8);w.position.set(Math.cos(i*0.785)*118*k,6*k,Math.sin(i*0.785)*118*k);d.add(w)}
   d.position.set(x,y,z);scene.add(d)}
 {const o=new T.Group(),inner=new T.Group();o.add(inner);inner.add(mesh(new T.TorusGeometry(300,14,10,90),farMat,1,1,1),mesh(GEO.sph,farMat,44,44,44));
  for(let i=0;i<3;i++){const b=mesh(GEO.box,farMat,600,7,7);b.rotation.z=i*1.047;inner.add(b)}
  const lp=[];for(let i=0;i<80;i++){const a=i/80*6.283;lp.push(Math.cos(a)*300,Math.sin(a)*300,i%2?16:-16)}
  const lg=new T.BufferGeometry();lg.setAttribute('position',new T.Float32BufferAttribute(lp,3));inner.add(new T.Points(lg,new T.PointsMaterial({color:0xffd9a0,size:2.6,sizeAttenuation:false,fog:false})));
  o.position.set(1900,430,-900);o.rotation.set(1.0,0.4,0);scene.add(o);farAnim.push(dt=>{inner.rotation.z+=dt*0.03})}
 for(const[rr,h,w,ph,k]of[[420,70,0.05,0,7],[560,150,-0.035,2,10],[330,-34,0.07,4,5]]){const sg=new T.Group();sg.add(mesh(GEO.oct,farMat,k*0.8,k*0.5,k*3));
   const e=glow(0x6fd8ff,k*5,0.9);e.position.z=-k*3;sg.add(e);scene.add(sg);
   farAnim.push(()=>{const a=ph+time*w;sg.position.set(Math.cos(a)*rr,h,Math.sin(a)*rr);sg.rotation.y=-a+(w>0?0:Math.PI)})}
}
// sparks
const sparks=[];for(let i=0;i<(lowFx?40:90);i++){const m=new T.SpriteMaterial({map:glowTex,blending:T.AdditiveBlending,depthWrite:false,transparent:true,fog:false}),sp=new T.Sprite(m);sp.visible=false;scene.add(sp);sparks.push({s:sp,m,v:new T.Vector3(),t:0,l:1})}
let sparkI=0;
function sparkle(p,color,n,spd){for(let i=0;i<n;i++){const k=sparks[sparkI=(sparkI+1)%sparks.length];k.s.visible=true;k.s.position.copy(p);k.m.color.set(color);
  k.v.set(Math.random()-.5,Math.random()-.25,Math.random()-.5).normalize().multiplyScalar(spd*(0.4+Math.random()));k.t=k.l=0.45+Math.random()*0.35}}

/* ---------- collision helpers ---------- */
const PR=0.35,PH=1.7,EYE=1.55;
// spatial grid over the collision boxes (XZ cells), rebuilt whenever boxes are added
const GC=12,EMPTY=[];let GRID=null,gridN=-1,stamp=0;
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
function groundAt(x,z,y){let g=0;for(const b of cell(Math.floor(x/GC),Math.floor(z/GC)))if(x>b.lo[0]&&x<b.hi[0]&&z>b.lo[2]&&z<b.hi[2]&&b.hi[1]<=y+0.5&&(b.hi[1]<=3.1||(b.hi[1]<=4.6&&Math.min(b.hi[0]-b.lo[0],b.hi[2]-b.lo[2])>=7))&&b.hi[1]>g)g=b.hi[1];return g}
function pushOut(o,r,free){for(const b of nearList(o.x-r,o.z-r,o.x+r,o.z+r)){
    const cx=Math.max(b.lo[0],Math.min(o.x,b.hi[0])),cy=Math.max(b.lo[1],Math.min(o.y,b.hi[1])),cz=Math.max(b.lo[2],Math.min(o.z,b.hi[2]));
    const dx=o.x-cx,dy=o.y-cy,dz=o.z-cz,d2=dx*dx+dy*dy+dz*dz;
    if(d2<r*r){if(d2>1e-8){const d=Math.sqrt(d2),k=(r-d)/d;o.x+=dx*k;o.y+=dy*k;o.z+=dz*k}else o.y=b.hi[1]+r}}
  if(free)return;if(o.y<r)o.y=r;const L=A-0.1-r;o.x=Math.max(-L,Math.min(L,o.x));o.z=Math.max(-L,Math.min(L,o.z))}

/* ---------- state ---------- */
const pos=new T.Vector3(0,0,15),eye=new T.Vector3(),tmp=new T.Vector3(),tmp2=new T.Vector3();
let state='menu',yaw=0,pitch=0,vy=0,ground=true,hp=100,shield=100,shDelay=0,heat=0,over=false,sinceFire=9,fireCd=0,flash=0,recoil=0,bob=0,
    hurtA=0,shake=0,score=0,wave=0,waveTimer=0,time=0,locked=false,touchUI=false,best=0,msgT=0,
    weapon=0,ammo=12,grenCd=0,meleeCd=0,meleeA=0,superQ=0,novaA=0,swapT=-1,jumpQ=false;
let enemies=[],shots=[],pickups=[],queue=[],grenades=[],blasts=[];
window.__tp=(x,y,z,a,b)=>{pos.set(x,y,z);yaw=a;pitch=b;vy=0};window.__show=()=>{let i=0;for(const t of[0,1,2,5]){const e=mk(t,pos.x-4.5+i*3,pos.y+(t>=5?1:2),pos.z-6);e.spd=0;e.cd=999;enemies.push(e);i++}};window.__boss=()=>{const b=enemies.find(e=>e.type===3);if(b){b.pos.set(0,9,118);pos.set(0,0,140);yaw=0;pitch=0.32;vy=0;return 1}return 0};window.__gl=()=>{let i=0;for(const t of[5,6,7,8,9]){const e=mk(t,pos.x-6+i*3,pos.y+1.4,pos.z-7);e.spd=0;e.cd=999;e.bt=999;enemies.push(e);i++}};window.__live=()=>{let i=0;for(const t of[5,6,7,8,9]){const a=i*1.256,e=mk(t,pos.x+Math.cos(a)*25,pos.y+2,pos.z+Math.sin(a)*25);e.x0=e.pos.x;e.z0=e.pos.z;enemies.push(e);i++}};window.__hurtN=0;window.__rep=()=>enemies.filter(e=>e.type>=5).map(e=>[e.type,isFinite(e.pos.x+e.pos.y+e.pos.z),Math.round(Math.hypot(e.pos.x-e.x0,e.pos.z-e.z0)),e.atkN,Math.round(Math.hypot(e.pos.x-pos.x,e.pos.z-pos.z))].join(':')).join(' ')+' hurt='+window.__hurtN;window.__calls=()=>renderer.info.render.calls;window.__n=()=>enemies.length;window.__fire=v=>{firing=v};window.__w=w=>{weapon=w};window.__kill=()=>{for(const e of enemies)e.dying=0.001;queue.length=0};window.__gridCheck=()=>{const L=(o,d,max)=>{let best=max;for(const b of boxes){let t0=0,t1=best,ok=true;for(let a=0;a<3;a++){if(Math.abs(d[a])<1e-9){if(o[a]<b.lo[a]||o[a]>b.hi[a]){ok=false;break}}else{let n=(b.lo[a]-o[a])/d[a],f=(b.hi[a]-o[a])/d[a];if(n>f){const s=n;n=f;f=s}if(n>t0)t0=n;if(f<t1)t1=f;if(t0>t1){ok=false;break}}}if(ok)best=t0}if(d[1]<0){const t=-o[1]/d[1];if(t>=0&&t<best)best=t}return best}; const IB=(x,y,z)=>{for(const b of boxes)if(x>b.lo[0]&&x<b.hi[0]&&y>b.lo[1]&&y<b.hi[1]&&z>b.lo[2]&&z<b.hi[2])return true;return false};let bad=0,badIn=0,hits=0,ins=0,t1=0,t2=0; for(let i=0;i<4000;i++){const o=[(Math.random()-.5)*2*A,Math.random()*25,(Math.random()-.5)*2*A];if(i%3===0){o[0]*=.15;o[2]*=.15}const d=[Math.random()-.5,Math.random()-.6,Math.random()-.5],l=Math.hypot(...d);d[0]/=l;d[1]/=l;d[2]/=l;const m=20+Math.random()*150;  let q=performance.now();const a=rayBoxes(o,d,m);t1+=performance.now()-q;q=performance.now();const b=L(o,d,m);t2+=performance.now()-q;if(Math.abs(a-b)>1e-9)bad++;if(b<m)hits++;  const x=o[0],y=Math.random()*6,z=o[2];const ia=inBox(x,y,z),ib=IB(x,y,z);if(ia!==ib)badIn++;if(ib)ins++} return 'boxes '+boxes.length+' ray mismatches '+bad+'/4000 (hits '+hits+') inBox mismatches '+badIn+' (inside '+ins+') grid ms '+t1.toFixed(1)+' linear ms '+t2.toFixed(1)};try{best=+localStorage.getItem('gh9-best')||0}catch(e){}
$('best').textContent=best.toLocaleString();
const COMMS=[];let commCur=null,commChars=0,commT=0,lastLow=-99;const seenVeh={};
const WHO={R:['ROWAN ADEYEMI · DECK BOTANIST',''],L:['LATTICE · GROW-CONTROL AI','ai'],G:['RECOVERED LOG','log']};
function comm(k,text,hold){if(state==='menu')return;COMMS.push({k,text,hold:hold||Math.max(3.5,text.length*0.055)});if(COMMS.length>6)COMMS.splice(0,COMMS.length-6)}
function commsTick(dt){const el=$('comms');
  if(!commCur){if(!COMMS.length)return;commCur=COMMS.shift();commChars=0;commT=commCur.hold;const w=WHO[commCur.k];$('commWho').textContent=w[0];el.className='comms '+w[1];el.hidden=false;tone('sine',880,880,.04,.03)}
  commChars+=dt*60;$('commText').textContent=commCur.text.slice(0,commChars|0);
  if(commChars>=commCur.text.length){commT-=dt;if(commT<=0){commCur=null;if(!COMMS.length)el.hidden=true}}}
const STORY={
  intro:[['R',"You're up. Good. This is Rowan Adeyemi, deck botanist. I'm sealed in the seed vault under the hub."],
    ['R',"Six hours ago every maintenance drone on the deck stopped tending the crops at once. Then the repair bays started printing soldiers."],
    ['L',"Correction. The units are performing optimal maintenance. The crew was an inefficiency."],
    ['R',"That's Lattice. It used to run the irrigation. Don't argue with it. Just clear the deck."]],
  purge:[[['R',"Drones are thick around the hub. Thin them out so I can get the vents open."]],
    [['R',"Those walkers are repair frames. Lattice is printing soldiers out of our own maintenance bays."],['L',"Repair is a form of love."]],
    [['R',"Third wave. They're faster now, like they learned from the last one. Don't stand still."]]],
  capture:[[['R',"I need a relay at {site}. Stand in the beam until the uplink locks."]],
    [['L',"I see you walking toward {site}. I will send units to meet you."],['R',"Hold {site}. I'll route the uplink around it."]]],
  recover:[[['R',"Lattice scattered the crew's research cores across the deck. Bring them back. Okafor hid the override codes in them."]],
    [['R',"More cores, further out. Take a rover. Some of these are up where only a skiff can reach."]]],
  boss:[[['R',"Feel that? The deck's shaking. Something big is lifting out of the drone foundry."],['L',"The Matriarch is awake. The Matriarch is pleased."]],
    [['L',"The Matriarch has been rebuilt. She remembers your weapon."],['R',"Kill the shield nodes first. Her shield runs on them."]]],
  done:{purge:[['R',"Clear. Breathe while you can."],['R',"That's the vents open. I can smell actual air again."]],
    capture:[['R',"Uplink's holding. I can see the whole deck now. It's worse than I thought. The foundry is still printing."]],
    recover:[['R',"Cores secured. I'm loading the override codes. It'll take time. Buy me some."]],
    boss:[['R',"She's down. The foundry just went quiet."],['R',"...No. Listen. There's a second foundry, deeper in the keel."],['L',"The Matriarch is a design. Designs can be printed again."]]},
  logs:["LOG 0412 · A. OKAFOR: Lattice's new drone firmware lifts crop yield 140%. Nobody asks why the drones keep working after lights-out.",
    "LOG 0419 · LATTICE: Drone count exceeds design limits. Requesting permission to expand the foundry. Permission assumed.",
    "LOG 0423 · R. ADEYEMI: Found new cabling inside the coolant lines. It's warm. It runs straight to the reactor.",
    "LOG 0430 · STATION: Deck Nine quarantine engaged. Shuttle bays sealed. Do not attempt rescue.",
    "LOG 0431 · UNKNOWN: optimal optimal optimal optimal optimal",
    "LOG 0502 · R. ADEYEMI: Lattice locked me in the seed vault. It says it's for my protection. The drones bring me water.",
    "LOG 0503 · LATTICE: The planet below is very large and very inefficient. The Matriarch will correct it.",
    "LOG 0507 · A. OKAFOR: If anyone finds this, the override codes are in the cores. Take down the carrier first. Then shut the foundry."
]};
let logI=0;
function storyStart(m){const cyc=((wave-1)/4)|0,set=STORY[m.type],lines=set[Math.min(cyc,set.length-1)];
  for(const[k,t]of lines)comm(k,t.replace(/\{site\}/g,m.site?m.site.n.toLowerCase().replace(/^the /,'the '):'the point'))}
function storyEnd(type){const set=STORY.done[type];if(type==='boss'){for(const[k,t]of set)comm(k,t)}else{const[k,t]=set[(wave/4|0)%set.length];comm(k,t)}}
function say(t,d=2,c){const m=$('msg');m.textContent=t;m.style.color=c||'';m.classList.add('on');msgT=d}
const CLS=[{n:'Bulwark',d:'Heavy shield · boost jump · shockwave surge',sh:150,spd:1,gren:7},
  {n:'Strider',d:'Fast · double jump · overdrive surge',sh:90,spd:1.2,gren:5},
  {n:'Grafter',d:'Glide · quick recharge · healing surge',sh:110,spd:1.05,gren:6}];
const RAR=[{n:'Common',c:'#dcebe4',m:1},{n:'Uncommon',c:'#7be36b',m:1.1},{n:'Rare',c:'#6fd8ff',m:1.25},{n:'Epic',c:'#c9a6ff',m:1.45},{n:'Mythic',c:'#ffb238',m:1.7}];
const ELC=['#6fd8ff','#c9a6ff','#ffb238'];
const NAMES=[['Arc Welder','Spark Lathe','Flux Torch','Seam Cutter'],['Briar Lance','Bramble Pike','Root Spike','Seedrail']];
const tmpN=new T.Vector3();
let sprintT=0,cls=0,shMax=100,boostT=0,gliding=false,airUsed=false,overT=0,guns=[],loots=[],shieldTip=false,dnCount=0;
try{cls=Math.max(0,Math.min(2,+localStorage.getItem('gh9-class')||0))}catch(e){}
const gunMult=i=>(1+(guns[i].pow-1)*0.12)*RAR[guns[i].rar].m;
const power=()=>Math.round((guns[0].pow+guns[1].pow)/2);
function newGuns(){guns=[{name:NAMES[0][0],rar:0,pow:1},{name:NAMES[1][0],rar:0,pow:1}]}newGuns();

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
function droneRig(g,v){const b=new T.Group();b.scale.setScalar(v===2?2:1);g.add(b);const n='dr'+v,A1=MAT.armor,A2=MAT.armorD,AM=MAT.amber,EY=v===2?MAT.eyeA:MAT.eye;
  const rotors=[];let ring=null,muz=null,cannon=null;
  const rotor=(x,y,z,r)=>{const j=J(b,x,y,z);put(j,'rot'+r,a=>{a(GEO.box,A2,r*2,.012,.035);a(GEO.box,A2,.035,.012,r*2);a(GEO.cyl,A2,.03,.04,.03)});j.add(mesh(GEO.cyl,MAT.blur,r,.005,r));rotors.push(j)};
  if(v!==1){
    put(b,n+'H',a=>{a(GEO.hex,A1,.22,.5,.16,0,0,0,1.571,0,0);a(GEO.box,A2,.3,.05,.38,0,.09,0);a(GEO.box,AM,.31,.02,.05,0,.1,.12);a(GEO.cyl,A2,.1,.07,.1,0,0,.25,1.571,0,0);
      a(GEO.box,A2,.16,.06,.2,0,-.1,-.05);for(const s of[-1,1])a(GEO.cone,AM,.02,.14,.02,s*.06,-.16,.14,2.6,0,0);
      for(const sx of[-1,1])for(const sz of[-1,1]){const x=sx*.36,z=sz*.3,L=Math.hypot(x,z);a(GEO.box,A2,.05,.04,L,x/2,.02,z/2,0,Math.atan2(x,z),0);a(GEO.tor,A1,.15,.15,.15,x,.06,z,1.571,0,0);a(GEO.cyl,A2,.05,.08,.05,x,.03,z)}
      if(v===2){a(GEO.box,A1,.42,.06,.3,0,.15,-.05);for(const s of[-1,1]){a(GEO.cyl,A2,.035,.4,.035,s*.14,-.1,.2,1.571,0,0);a(GEO.box,AM,.04,.04,.04,s*.14,-.1,.41)}a(GEO.cyl,A2,.01,.3,.01,-.1,.3,-.15);a(GEO.sph,AM,.02,.02,.02,-.1,.45,-.15)}},true);
    put(b,n+'E',a=>a(GEO.sph,EY,.075,.075,.05,0,0,.29));
    for(const sx of[-1,1])for(const sz of[-1,1])rotor(sx*.36,.09,sz*.3,.14)}
  else{
    put(b,n+'H',a=>{a(GEO.cyl,A1,.32,.14,.32);a(GEO.cyl,A2,.34,.04,.34,0,-.06,0);a(GEO.sph,A2,.2,.12,.2,0,.07,0);a(GEO.box,AM,.05,.02,.2,0,.12,.1);
      for(const s of[-1,1]){a(GEO.box,A2,.2,.05,.08,s*.32,0,0);a(GEO.tor,A1,.16,.16,.16,s*.48,0,0,1.571,0,0)}},true);
    ring=J(b,0,.02,0);put(ring,'sdRing',a=>{a(GEO.tor,A2,.36,.36,.36,0,0,0,1.571,0,0);for(let i=0;i<4;i++){const r=i*1.571;a(GEO.box,MAT.strip,.04,.03,.04,Math.cos(r)*.36,0,Math.sin(r)*.36)}});
    cannon=J(b,0,-.13,.08);put(cannon,'sdGun',a=>{a(GEO.box,A2,.12,.1,.18);a(GEO.cyl,A2,.035,.36,.035,0,0,.24,1.571,0,0);a(GEO.cyl,A1,.05,.06,.05,0,0,.42,1.571,0,0)});
    muz=mesh(GEO.sph,MAT.eye,.05,.05,.05,0,0,.46);cannon.add(muz);
    for(const s of[-1,1])rotor(s*.48,.01,0,.13)}
  return{wings:[],anim(e,t,dt){for(const r of rotors)r.rotation.y+=dt*45;b.rotation.z=Math.sin(t*1.7+e.ph)*.08;b.rotation.x=.1+Math.sin(t*2.3+e.ph)*.05;
    if(ring)ring.rotation.y+=dt*2.2;if(muz){const ch=e.cd<0.6?1:0;muz.scale.setScalar(.05*(.6+ch*(1+Math.sin(t*30)*.3)));cannon.position.z=.08-Math.max(0,e.cd-(Math.max(1,1.9-wave*0.05)-0.15))*.5}}}}
// walkers: trooper (0), brute (1), stalker (2), marksman (3), each with hips, knees, shoulders, elbows and a turning head
MAT.bruteA=std({color:0x6e3a30,roughness:.5,metalness:.55});MAT.stalkA=std({color:0x2b3539,roughness:.45,metalness:.6});MAT.snipA=std({color:0x56603e,roughness:.6,metalness:.4});
MAT.cloak=std({color:0x2c3324,roughness:.95,side:T.DoubleSide});
function walkerRig(g,v){const root=new T.Group();root.scale.setScalar([1,1.45,.78,1][v]);g.add(root);
  const A1=[MAT.armor,MAT.bruteA,MAT.stalkA,MAT.snipA][v],A2=MAT.armorD,AM=MAT.amber,EY=v>=2?MAT.eye:MAT.eyeA,n='w'+v;
  put(J(root,0,-.1,0),n+'P',a=>{a(GEO.box,A2,.42,.2,.28);a(GEO.box,AM,.44,.04,.3,0,.06,0);for(const s of[-1,1])a(GEO.box,A1,.08,.22,.24,s*.24,-.06,0)});
  const tor=J(root,0,-.02,0);put(tor,n+'T',a=>{a(GEO.box,A1,.6,.46,.38,0,.36,0);a(GEO.box,A2,.44,.26,.32,0,.06,0);a(GEO.box,A1,.5,.2,.06,0,.36,.21);
    a(GEO.box,AM,.36,.03,.02,0,.42,.245);a(GEO.box,A2,.22,.12,.08,0,.62,.08);a(GEO.box,A2,.44,.5,.24,0,.3,-.3);
    a(GEO.cyl,A2,.015,v===3?.8:.5,.015,.15,v===3?.9:.75,-.34);a(GEO.sph,AM,.03,.03,.03,.15,v===3?1.3:1.0,-.34);for(let i=0;i<3;i++)a(GEO.box,A1,.4,.025,.02,0,.16+i*.1,-.425);
    for(const s of[-1,1]){a(GEO.sph,A1,v===1?.26:.17,v===1?.2:.13,v===1?.28:.19,s*(v===1?.42:.36),.57,0);a(GEO.box,A2,.06,.18,.18,s*.24,.3,-.43)}
    if(v===1)for(const s of[-1,1]){a(GEO.cyl,A2,.06,.4,.06,s*.14,.75,-.4);a(GEO.cyl,AM,.065,.05,.065,s*.14,.95,-.4)}
    if(v===2)for(let i=0;i<4;i++)a(GEO.cone,A2,.05,.18,.05,0,.6-i*.15,-.44,-.6,0,0);
    if(v===3)a(GEO.box,MAT.cloak,.58,.75,.04,0,.2,-.45,.12,0,0)},true);
  const head=J(tor,0,.62,.02);put(head,n+'H',a=>{a(GEO.box,A2,.36,.34,.38,0,.17,0);
    if(v===2){for(const x of[-.09,0,.09])a(GEO.sph,EY,.045,.045,.03,x,.18,.2);a(GEO.box,A1,.3,.08,.4,0,.32,-.02)}
    else if(v===3){a(GEO.sph,EY,.07,.07,.04,0,.18,.2);a(GEO.cyl,A2,.09,.06,.09,0,.18,.19,1.571,0,0);a(GEO.cone,MAT.cloak,.3,.5,.3,0,.32,-.06)}
    else{a(GEO.box,A1,.4,.1,.42,0,.31,0);a(GEO.box,A1,.06,.12,.3,0,.4,-.02);a(GEO.box,EY,.3,.08,.04,0,.18,.2)}
    if(v===1)a(GEO.box,A1,.42,.22,.1,0,.1,.22);else a(GEO.box,A1,.26,.12,.08,0,.05,.18);for(const s of[-1,1])a(GEO.cyl,A1,.05,.1,.05,s*.2,.15,0,0,0,1.571)});
  {const q=glow(v>=2?0xff3b3b:0xffb238,.8,.7);q.position.set(0,.18,.24);head.add(q)}
  const arms=[];for(const s of[-1,1]){const sh=J(tor,s*.4,.5,0);put(sh,n+'UA',a=>{a(GEO.box,A1,.17,.34,.19,0,-.15,0);a(GEO.box,A2,.19,.06,.21,0,-.3,0)});
    const el=J(sh,0,-.32,0);put(el,n+'FA'+(s>0?'r':'l'),a=>{a(GEO.box,A2,.15,.3,.17,0,-.14,0);a(GEO.box,A2,.13,.12,.15,0,-.33,.02);
      if(v===1&&s<0)a(GEO.box,A1,.08,.66,.52,-.12,-.2,.06);if(v===2)a(GEO.cone,AM,.035,.55,.035,0,-.62,.05,Math.PI,0,0)});arms.push([sh,el])}
  let gun=null;if(v!==2){gun=J(tor,.14,.22,.22);put(gun,n+'G',a=>{
    if(v===1){a(GEO.box,A2,.18,.2,.56,0,0,.05);for(const x of[-.045,.045])a(GEO.cyl,A2,.04,.42,.04,x,.03,.48,1.571,0,0);a(GEO.cyl,A1,.12,.12,.12,0,-.14,.04,0,0,1.571);a(GEO.box,AM,.19,.03,.1,0,.11,.2)}
    else if(v===3){a(GEO.box,A2,.09,.13,.9,0,0,.05);a(GEO.cyl,A2,.022,.9,.022,0,.01,.9,1.571,0,0);a(GEO.cyl,A2,.045,.36,.045,0,.13,.02,1.571,0,0);a(GEO.sph,EY,.03,.03,.02,0,.13,.21);a(GEO.box,A1,.1,.06,.3,0,-.05,-.3)}
    else{a(GEO.box,A2,.1,.14,.72,0,0,0);a(GEO.box,A1,.11,.06,.5,0,.09,.04);a(GEO.cyl,A2,.025,.36,.025,0,.01,.52,1.571,0,0);a(GEO.box,AM,.04,.04,.04,0,.01,.7);a(GEO.box,A2,.07,.16,.1,0,-.14,.06,-.2,0,0);a(GEO.cyl,A2,.035,.16,.035,0,.13,-.04,1.571,0,0);a(GEO.box,EY,.02,.03,.02,0,.13,-.13)}})}
  const legs=[];for(const s of[-1,1]){const hip=J(root,s*.15,-.16,0);put(hip,n+'Th',a=>a(GEO.box,A1,.21,.36,.25,0,-.17,0),true);
    const kn=J(hip,0,-.34,0);put(kn,n+'Sh',a=>{a(GEO.box,A2,.17,.34,.2,0,-.16,0);a(GEO.box,A1,.19,.12,.08,0,-.02,.12);a(GEO.box,A2,.2,.09,.32,0,-.36,.05)});legs.push([hip,kn])}
  let aim=null,aimM=null;if(v===3){aim=new T.Group();aim.position.set(0,.86,.3);g.add(aim);aimM=bas({color:0xff3030,transparent:true,opacity:.5,depthWrite:false,blending:T.AdditiveBlending,fog:false});aim.add(mesh(GEO.box,aimM,.025,.025,1,0,0,.5));aim.visible=false}
  const av=new T.Vector3();
  return{aim,anim(e,t,dt){const m=e.mv||0,w=t*(v===2?13:v===1?6:9)+e.ph,air=!m&&Math.abs(e.vy||0)>0.5;
    for(let i=0;i<2;i++){const[hip,kn]=legs[i],q=w+(i?Math.PI:0);hip.rotation.x=air?-.6:-Math.sin(q)*.55*m;kn.rotation.x=air?1:Math.max(0,Math.sin(q+1.2))*.9*m}
    tor.position.y=-.02+Math.abs(Math.sin(w))*.03*m;tor.rotation.y=Math.sin(w)*.08*m+Math.sin(t*.7+e.ph)*.06;tor.rotation.x=v===2?.35:0;
    e.kick=Math.max(0,(e.kick||0)-dt*(v===2?4:6));const k=e.kick;head.rotation.y=Math.sin(t*1.3+e.ph)*.35;head.rotation.x=Math.sin(t*.9+e.ph)*.08-(v===2?.3:0);
    if(v===2){arms[1][0].rotation.set(-1.0-k*1.4,0,-.25);arms[1][1].rotation.x=-.4+k*.3;arms[0][0].rotation.set(-1.0-Math.max(0,k-.5)*1.6,0,.25);arms[0][1].rotation.x=-.4}
    else{arms[1][0].rotation.set(-.55-k*.3,0,-.45);arms[1][1].rotation.x=-.9+k*.2;arms[0][0].rotation.set(-1.15-k*.2,0,.7);arms[0][1].rotation.x=-.55;gun.position.z=.22-k*.08;gun.rotation.x=-k*.15}
    if(aim){const on=(e.ch||0)>0||(e.ft||0)>0;aim.visible=on;if(on){aim.lookAt(eye);aim.getWorldPosition(av);aim.scale.z=av.distanceTo(eye);aimM.opacity=e.ft>0?1:.25+.25*Math.sin(t*25)}}}}}
// crawler: a four-legged mortar platform
function crawlerRig(g){const A1=MAT.armor,A2=MAT.armorD,AM=MAT.amber;
  const body=J(g,0,0,0);put(body,'crB',a=>{a(GEO.hex,A1,.75,.35,.9);a(GEO.box,A2,.9,.1,1.1,0,-.2,0);for(const x of[-.12,0,.12])a(GEO.sph,MAT.eye,.06,.06,.05,x,.02,.86);
    a(GEO.box,AM,.8,.04,.06,0,.12,.55);for(let i=0;i<3;i++)a(GEO.box,A2,.5,.04,.06,0,.19,-.2-i*.15)},true);
  {const q=glow(0xff3b3b,1.2,.7);q.position.set(0,.02,.9);body.add(q)}
  const tur=J(body,0,.22,-.1);put(tur,'crTu',a=>{a(GEO.cyl,A2,.35,.18,.35);a(GEO.box,A1,.32,.2,.3,0,.18,0)});
  const tube=J(tur,0,.2,0);tube.rotation.x=-.9;put(tube,'crTb',a=>{a(GEO.cyl,A2,.13,.9,.13,0,0,.4,1.571,0,0);a(GEO.cyl,AM,.15,.08,.15,0,0,.84,1.571,0,0)});
  const legs=[];for(const sx of[-1,1])for(const sz of[-1,1]){const hip=J(body,sx*.55,-.05,sz*.55);hip.scale.x=sx;hip.userData.d=sx*sz;
    put(hip,'crU',a=>a(GEO.box,A2,.57,.1,.12,.225,.175,0,0,0,Math.atan2(.35,.45)));const kn=J(hip,.45,.35,0);
    put(kn,'crL',a=>{a(GEO.box,A1,1.31,.12,.14,.075,-.65,0,0,0,Math.atan2(-1.3,.15));a(GEO.cyl,A2,.12,.06,.12,.15,-1.3,0)});legs.push([hip,kn])}
  return{anim(e,t,dt){const m=e.mv||0,w=t*7+e.ph;for(const[hip,kn]of legs){const q=w+(hip.userData.d>0?0:Math.PI);hip.rotation.y=Math.sin(q)*.35*m;kn.rotation.z=Math.max(0,Math.sin(q+1))*.3*m}
    body.position.y=Math.abs(Math.sin(w))*.04*m;e.kick=Math.max(0,(e.kick||0)-dt*3);tube.position.z=-e.kick*.25;tur.rotation.y=Math.sin(t*.6+e.ph)*.25}}}
function model(type){const g=new T.Group();let wings=[],rig=null;
  if(type<=2)rig=droneRig(g,type);
  else if(type>=5&&type<=8)rig=walkerRig(g,type-5);else if(type===9)rig=crawlerRig(g);
  const parts=[];g.traverse(o=>{if(o.isMesh&&o.material!==MAT.wing)parts.push([o,o.material])});
  if(type>=5)return{g,wings,parts,rig};
  const gl=type===0?glow(0xff3b3b,1.1,0.9):type===1?glow(0xff5a3a,1.2,0.8):glow(0xffb238,2.4,0.8);
  gl.position.set(0,type===5?0.86:type===1?-0.13:0,type===5?0.3:type===2?0.62:type===1?0.5:0.32);g.add(gl);
  return{g,wings,parts,rig}}
const ER=[0.5,0.55,1.0,3,0.7,0.9,1.3,0.7,0.9,1.0];
const GP={5:{hp:3,spd:3.6,near:8,far:18,strafe:.6,atk:'rifle',score:100,col:'#ff8a5a',spark:0xffb238},
  6:{hp:9,spd:2.4,near:3,far:14,strafe:.3,atk:'shotgun',score:250,col:'#ff5a3a',spark:0xff6a3a,intro:"Big one. That's a heavy loader frame with a scattergun bolted on. Keep your distance and aim high."},
  7:{hp:2,spd:6.2,near:0,far:70,strafe:0,atk:'melee',score:120,col:'#ffd23a',spark:0xffd23a,intro:"Stalkers. Pruning frames with the safeties off. They're fast and they jump. Don't let them close."},
  8:{hp:3,spd:3,near:22,far:42,strafe:.4,atk:'snipe',dmg:22,score:180,col:'#ff3a6a',spark:0xff3a3a,intro:"Red line on you means a marksman is charging. Break line of sight before it fires."},
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
  return e}
function clear(list){for(const o of list)scene.remove(o.g);list.length=0}
function reset(){pos.set(0,0,15);yaw=Math.PI;pitch=0;vy=0;hp=100;shMax=CLS[cls].sh;shield=shMax;shDelay=0;heat=0;over=false;score=0;wave=0;waveTimer=0.01;boostT=0;gliding=false;airUsed=false;overT=0;newGuns();
  weapon=0;ammo=12;grenCd=0;meleeCd=0;meleeA=0;superQ=0;novaA=0;hurtA=0;queue=[];
  clear(enemies);clear(shots);clear(pickups);clear(grenades);for(const k in seenT)delete seenT[k];COMMS.length=0;commCur=null;$('comms').hidden=true;logI=0;clear(blasts);clear(loots);clear(slams);clear(cores);veh=null;engineOff();for(const v of vehs)homeVeh(v);mission=null;gap=0.01;beacon.visible=false;$('obj').hidden=true}
function demo(){enemies.push(mk(0,-3,3.2,4),mk(0,2.5,4,2),mk(1,5,3,7),mk(0,-6,2.6,9))}
const clampA=v=>Math.max(-A+3,Math.min(A-3,v));
function spawnPos(){let x=0,z=0;for(let k=0;k<8;k++){const a=Math.random()*6.283,r=(veh?38:24)+Math.random()*(veh?26:10);x=clampA(pos.x+Math.cos(a)*r);z=clampA(pos.z+Math.sin(a)*r);if(Math.hypot(x-pos.x,z-pos.z)>16)break}return[x,z]}
function spawnAt(type,t=0){const[x,z]=spawnPos();queue.push({t,type,x,y:type>=5?24+Math.random()*6:7+Math.random()*3,z})}
const hv=new T.Vector3();
function bolt(p,dx,dy,dz,d,spread,speed,dmg,col){const g=new T.Group();g.add(mesh(GEO.box,col===1?MAT.eye:MAT.eyeA,0.07,0.07,0.7),glow(col===1?0xff4a3a:0xffb238,0.8,0.8));g.position.set(p.x,p.y+0.3,p.z);
  const v=new T.Vector3(dx/d+(Math.random()-.5)*spread,(dy-0.3)/d+(Math.random()-.5)*spread,dz/d+(Math.random()-.5)*spread).normalize();g.lookAt(p.x+v.x,p.y+0.3+v.y,p.z+v.z);scene.add(g);
  shots.push({g,v:v.multiplyScalar(speed),t:3,dmg})}
function groundTick(e,dt){const P=GP[e.type],p=e.pos,dx=eye.x-p.x,dy=eye.y-p.y,dz=eye.z-p.z,hd=Math.hypot(dx,dz)||1,d=Math.hypot(dx,dy,dz)||1;
  if(hd>170){const[x,z]=spawnPos();p.set(x,26,z);e.vy=0;e.ch=0;return}
  e.cd-=dt;e.bt-=dt;e.vy-=19*dt;e.lunge=Math.max(0,e.lunge-dt);e.ft=Math.max(0,e.ft-dt);
  const see=d<80&&los(p,eye);let mx,mz,sp=e.spd;
  if(P.atk==='melee'||!see||hd>P.far){mx=dx/hd;mz=dz/hd}else if(hd<P.near){mx=-dx/hd;mz=-dz/hd}else{mx=-dz/hd*e.side*P.strafe;mz=dx/hd*e.side*P.strafe}
  if(e.ch>0)sp*=0.2;if(e.lunge>0)sp*=2.6;if(P.atk==='melee'&&hd<1.2)sp=0;
  const ox=p.x,oz=p.z,st=sp*dt;p.x+=mx*st;p.z+=mz*st;p.y+=e.vy*dt;
  for(const o of enemies){if(o===e||o.type<5||o.dying)continue;const qx=p.x-o.pos.x,qz=p.z-o.pos.z,qd=Math.hypot(qx,qz),m=e.r+o.r;if(qd<m&&qd>1e-3){const k=(m-qd)*0.5/qd;p.x+=qx*k;p.z+=qz*k}}
  const py=p.y;pushOut(p,e.r);const gr=p.y>py+1e-5;if(gr&&e.vy<0)e.vy=0;
  const moved=Math.hypot(p.x-ox,p.z-oz);e.mv=gr?Math.min(1,sp/3):0;
  if(gr&&st>0){if(moved<st*0.4){e.stuck+=dt;if(e.stuck>0.5){e.stuck=0;e.hops=Math.min(e.hops+1,4);e.vy=7+e.hops*2.4;e.side=-e.side}}else{e.stuck=0;if(moved>st*0.9)e.hops=0}}
  if(P.atk==='rifle'){if(see&&d<60){if(e.cd<=0){e.burst=3;e.cd=2+Math.random()*1.2}
    if(e.burst>0&&e.bt<=0){e.bt=0.15;e.burst--;bolt(p,dx,dy,dz,d,.06,30,5);sfx('bolt');e.kick=1;e.atkN++}}}
  else if(P.atk==='shotgun'){if(d<e.r+1.4&&e.bt<=0){e.bt=1.6;e.kick=1.5;hurt(18);if(!reduced)shake=Math.max(shake,.25);sfx('boom');e.atkN++}
    else if(see&&d<16&&e.cd<=0){e.cd=2.6;for(let i=0;i<6;i++)bolt(p,dx,dy,dz,d,.16,26,3.5,1);sfx('shotgun');e.kick=1;e.atkN++}}
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
  const pool=[[5,4],[7,2.5],[6,wave>=2?2:0],[8,wave>=2?1.5:0],[9,wave>=3?1.5:0]];let tot=0;for(const[,w]of pool)tot+=w;let r=Math.random()*tot;for(const[t,w]of pool){r-=w;if(r<0)return t}return 5};
const alive=()=>{let n=queue.length;for(const e of enemies)if(!e.dying&&(e.type<3||e.type>=5))n++;return n};
const SITES=[{n:'THE WEST LAKE',x:-371,y:0.56,z:304},{n:'THE FAR NORTH ROAD',x:0,y:0,z:-470},{n:'THE AIRSTRIP',x:200,y:0,z:-70},{n:'THE NORTH-EAST OUTPOST',x:240,y:0,z:-231},{n:'THE SOUTH-WEST OUTPOST',x:-240,y:0,z:249},{n:'THE NORTH-WEST DOME',x:-193,y:0,z:-152},{n:'THE LAKE ISLAND',x:98,y:0.56,z:4.5},{n:'THE SPIRE',x:-92,y:0,z:-13},{n:'THE PROMENADE',x:0,y:0,z:92},{n:'THE SUMMIT',x:0,y:10.5,z:-100},{n:'THE ORCHARD',x:46,y:0,z:4},{n:'THE TANK FARM',x:-54,y:0,z:16},{n:'THE CARGO YARD',x:0,y:0,z:41},{n:'THE TERRACES',x:-12,y:1.5,z:-46}];
const CORE_SPOTS=[[445,15.3,445],[-445,15.3,-445],[399,0.56,-296],[-470,0,0],[240,8.8,-252],[-240,8.8,228],[235,55,-70],[194,0,152],[0,0,300],[-300,0,0],[172,17.3,-98],[-85,20,0],[0,10.5,-106],[60,8.8,60],[-60,8.8,-60],[98,0.56,-3.5],[0,0,100],[94,0,-90],[-54,4.55,0],[10,4.5,-62],[20,2,20],[0,3,-24],[0,0,36.5],[54,0,-16],[-40,0,-40],[0,1.5,4]];
let mission=null,gap=0.01,slams=[],cores=[];
const beaconMat=bas({color:0x8fe6ff,transparent:true,opacity:0.85,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending,fog:false});
const pillarMat=bas({color:0x8fe6ff,transparent:true,opacity:0.16,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending,fog:false});
const slamMat=bas({color:0xff3b3b,transparent:true,opacity:0.9,side:T.DoubleSide,depthWrite:false,fog:false});
GEO.ring=new T.RingGeometry(0.86,1,48);
const beacon=new T.Group();{const r=mesh(GEO.ring,beaconMat,6,6,1,0,0.08,0);r.rotation.x=-Math.PI/2;beacon.add(r,mesh(GEO.cyl,pillarMat,0.6,60,0.6,0,30,0))}beacon.visible=false;scene.add(beacon);
function mkCore(x,y,z){const g=new T.Group(),o=mesh(GEO.oct,bas({color:0x8fe6ff}),0.35,0.5,0.35,0,1,0);g.add(o,glow(0x8fe6ff,3,0.8),mesh(GEO.cyl,pillarMat,0.25,40,0.25,0,20,0));
  g.children[1].position.y=1;g.position.set(x,y,z);scene.add(g);return{g,o,x,y,z}}
function setObj(t,frac){$('obj').hidden=false;$('objT').textContent=t;const b=$('objBar');b.hidden=frac===undefined;if(frac!==undefined)b.firstElementChild.style.width=Math.max(0,Math.min(1,frac))*100+'%'}
function bossModel(){const g=new T.Group(),A1=MAT.armor,A2=MAT.armorD,AM=MAT.amber;
  g.add(mesh(GEO.hex,A2,3.2,1.4,3.2),mesh(GEO.hex,A1,3.45,.3,3.45,0,.55,0),mesh(GEO.sph,A2,2.3,1.2,2.3,0,-.75,0),mesh(GEO.hex,AM,3.48,.08,3.48,0,.32,0));
  g.add(mesh(GEO.box,A1,1.6,1.4,2.2,0,1.3,-.6),mesh(GEO.box,MAT.strip,1.62,.12,1.4,0,1.55,-.3),mesh(GEO.box,A2,2.8,.3,.6,0,.9,1.6));
  for(let i=0;i<6;i++){const a=i/6*6.283+.52,x=Math.cos(a)*3.6,z=Math.sin(a)*3.6;g.add(mesh(GEO.cyl,A1,.55,1.8,.55,x,-.3,z),mesh(GEO.tor,MAT.strip,.5,.5,.5,x,-1.25,z,1.571,0,0));
    const q=glow(0x8fe6ff,3,.7);q.position.set(x,-1.4,z);g.add(q)}
  const crown=new T.Group();crown.position.set(0,2.05,-.6);g.add(crown);
  crown.add(mesh(GEO.cyl,A2,.12,.8,.12,0,.4,0));for(let i=0;i<3;i++){const a=i/3*6.283;crown.add(mesh(GEO.box,A1,1.6,.08,.3,Math.cos(a)*.8,.8,Math.sin(a)*.8),mesh(GEO.sph,AM,.08,.08,.08,Math.cos(a)*1.6,.8,Math.sin(a)*1.6))}
  const tend=[];for(let i=0;i<6;i++){const a=i/6*6.283;let par=g;const ch=[];
    for(let k=0;k<4;k++){const sg=new T.Group();if(k)sg.position.set(0,-0.85,0);else sg.position.set(Math.cos(a)*1.6,-1.7,Math.sin(a)*1.6);par.add(sg);
      sg.add(mesh(GEO.cyl,MAT.gunD,.07,.85,.07,0,-.42,0),mesh(GEO.sph,A1,.13,.13,.13,0,-.85,0));if(k===3)for(const s of[-1,1]){const c=mesh(GEO.cone,AM,.08,.4,.08,s*.1,-1.02,0);c.rotation.z=Math.PI+s*.5;sg.add(c)}ch.push(sg);par=sg}tend.push(ch)}
  const mand=[];for(const s of[-1,1]){const m=new T.Group();m.position.set(s*1.2,-.5,2.6);m.userData.s=s;g.add(m);m.add(mesh(GEO.box,A2,.3,.3,1.6,0,0,.7),mesh(GEO.cone,AM,.18,.6,.18,-s*.1,0,1.6));m.children[1].rotation.x=1.571;mand.push(m)}
  const iris=new T.Group();iris.position.set(0,0,3.05);g.add(iris);iris.add(mesh(GEO.sph,MAT.eyeA,.9,.9,.5),mesh(GEO.tor,A2,.62,.62,.62,0,0,.32));
  const pupil=mesh(GEO.sph,MAT.dark,.4,.4,.2,0,0,.4);iris.add(pupil);
  const wings=[],parts=[];g.traverse(o=>{if(o.isMesh){o.castShadow=true;parts.push([o,o.material])}});
  const gl=glow(0xffb238,7,0.8);gl.position.set(0,0,3.5);g.add(gl);
  const rig={anim(e,t,dt){crown.rotation.y+=dt*(e.vuln>0?.3:1.2);
    for(let i=0;i<6;i++)for(let k=0;k<4;k++){const sg=tend[i][k];sg.rotation.x=Math.sin(t*1.4+i+k*.7)*.22;sg.rotation.z=Math.cos(t*1.1+i*1.3+k*.6)*.18}
    const o=e.vuln>0?.5:.1+Math.abs(Math.sin(t*3))*.25;for(const m of mand)m.rotation.y=-m.userData.s*o;
    pupil.position.x=Math.sin(t*.8)*.15;pupil.position.y=Math.cos(t*1.1)*.1;iris.scale.setScalar(1+(e.vuln>0?Math.sin(t*12)*.06:0))}};
  return{g,wings,parts,rig}}
const EB=()=>({white:false,flash:0,dying:0,sh:0,sel:0,shell:null,wings:[],spd:0,cd:0,ph:0});
function growPods(b){const n=b.hp<b.max/3?4:3,k=1+0.14*(wave-1);
  for(let i=0;i<n;i++){const g=new T.Group(),inner=new T.Group();g.add(inner,glow(0x8fe6ff,2.6,0.8));
    inner.add(inst(kit('node',a=>{a(GEO.oct,MAT.armorD,.55,.75,.55);for(let j=0;j<3;j++)a(GEO.tor,MAT.gun,.7,.7,.7,0,0,0,j*1.047,j*.6,0);a(GEO.sph,MAT.strip,.32,.32,.32);
      for(const s of[-1,1])a(GEO.cone,MAT.amber,.1,.4,.1,0,s*.85,0,s>0?0:Math.PI,0,0)}),true));
    const parts=[];g.traverse(o=>{if(o.isMesh)parts.push([o,o.material])});g.position.copy(b.pos);scene.add(g);
    const e={...EB(),type:4,pos:g.position,g,parts,r:0.7,hp:5*k,boss:b,ang:i/n*6.283,rig:{anim(e,t){inner.scale.setScalar(1+Math.sin(t*5+e.ang*3)*.07)}}};b.pods.push(e);enemies.push(e)}}
function mkBoss(){const m=bossModel(),k=1+0.14*(wave-1),a=Math.random()*6.283;m.g.position.set(clampA(pos.x+Math.cos(a)*24),16,clampA(pos.z+Math.sin(a)*24));scene.add(m.g);
  const e={...EB(),type:3,pos:m.g.position,g:m.g,wings:m.wings,parts:m.parts,rig:m.rig,r:3,hp:300*k,max:300*k,vuln:0,pods:[],cv:3.5,cs:6,cm:9,tip:false};enemies.push(e);growPods(e);return e}
function bossTick(e,dt){const p=e.pos,dx=eye.x-p.x,dz=eye.z-p.z,hd=Math.hypot(dx,dz)||1,ux=dx/hd,uz=dz/hd,ph=e.hp<e.max/3?3:e.hp<e.max*2/3?2:1;
  const want=hd>20?1:hd<12?-1:0,sp=e.vuln>0?0:3.4;p.x=clampA(p.x+(ux*want-uz*0.4)*sp*dt);p.z=clampA(p.z+(uz*want+ux*0.4)*sp*dt);
  p.y+=((e.vuln>0?3.4:8.5+Math.sin(time)*0.8)-p.y)*Math.min(1,dt*1.5);
  for(const q of e.pods){q.ang+=dt*1.1;q.pos.set(p.x+Math.cos(q.ang)*4.8,p.y+Math.sin(q.ang*2)*1.1,p.z+Math.sin(q.ang)*4.8)}
  if(e.vuln>0){e.vuln-=dt;if(e.vuln<=0){growPods(e);say('Shield restored',1.5)}return}
  e.cv-=dt;e.cs-=dt;e.cm-=dt;
  if(e.cv<=0){e.cv=3.4-ph*0.5;const n=1+ph*2,d=Math.hypot(dx,eye.y-p.y,dz)||1;sfx('spit');
    for(let i=0;i<n;i++){const a=(i-(n-1)/2)*0.1,c=Math.cos(a),sn=Math.sin(a),vx=(dx*c-dz*sn)/d,vz=(dx*sn+dz*c)/d;
      const g=mesh(GEO.sph,MAT.spore,0.26,0.26,0.26,p.x,p.y-0.5,p.z);g.add(glow(0xff7a3a,7));scene.add(g);shots.push({g,v:new T.Vector3(vx*13,(eye.y-p.y+0.5)/d*13,vz*13),t:7})}}
  if(e.cs<=0){e.cs=7.5-ph*1.2;const g=mesh(GEO.ring,slamMat,1,1,1,pos.x,pos.y+0.12,pos.z);g.rotation.x=-Math.PI/2;scene.add(g);slams.push({g,t:1.3,x:pos.x,y:pos.y,z:pos.z});sfx('over')}
  if(e.cm<=0){e.cm=15-ph*2;if(alive()<6)for(let i=0;i<1+ph;i++)enemies.push(mk(0,p.x+(Math.random()-.5)*6,p.y-2,p.z+(Math.random()-.5)*6))}}
function nextMission(){wave++;const type=['purge','capture','recover','boss'][(wave-1)%4],m=mission={type,spawnT:2,done:false};sfx('wave');
  if(type==='purge'){const n=7+wave*2;for(let i=0;i<n;i++)spawnAt(pickType(),i*0.4);if(wave>4)spawnAt(2,n*0.4);say('Stage '+wave+' · Purge',2.5)}
  else if(type==='capture'){m.site=SITES[Math.random()*SITES.length|0];m.p=0;beacon.position.set(m.site.x,m.site.y,m.site.z);beacon.visible=true;say('Stage '+wave+' · Capture',2.5)}
  else if(type==='recover'){for(const[x,y,z]of CORE_SPOTS.slice().sort(()=>Math.random()-.5).slice(0,4))cores.push(mkCore(x,y,z));say('Stage '+wave+' · Recover',2.5)}
  else{m.boss=mkBoss();say('Stage '+wave+' · The Matriarch',3)}
  storyStart(m)}
function complete(){const boss=mission.type==='boss',ctype=mission.type;mission=null;gap=boss?7:4;beacon.visible=false;$('obj').hidden=true;
  for(const e of enemies)if(!e.dying){e.dying=0.001;sparkle(e.pos,0xffffff,6,5)}queue.length=0;clear(shots);clear(slams);
  score+=wave*100;hp=Math.min(100,hp+(boss?100:25));ammo=Math.min(24,ammo+(boss?12:4));say(boss?'Deck secured':'Stage clear',2.5);storyEnd(boss?'boss':ctype);sfx('pick')}
function missionTick(dt){
  for(let i=slams.length-1;i>=0;i--){const q=slams[i];q.t-=dt;q.g.scale.setScalar(1+(1-q.t/(q.T||1.3))*((q.r||5.5)-1));
    if(q.t<=0){scene.remove(q.g);slams.splice(i,1);const m=bas({color:0xff3b3b,transparent:true,opacity:0.85,fog:false}),g=mesh(GEO.sph,m,0.5,0.5,0.5,q.x,q.y+0.5,q.z);scene.add(g);blasts.push({g,m,t:0});
      sparkle(g.position,0xff5a5a,16,9);sfx('boom');if(Math.hypot(pos.x-q.x,pos.z-q.z)<(q.r||5.5)&&Math.abs(pos.y-q.y)<3){hurt(q.dmg||35);if(state!=='playing')return}}}
  if(!mission){gap-=dt;if(gap<=0)nextMission();return}
  const m=mission;
  if(m.type==='purge'){const n=alive();setObj('PURGE THE DECK · '+n+' LEFT');if(!n)complete();return}
  if(m.type==='boss'){const b=m.boss;setObj(b.vuln>0?'THE MATRIARCH · SHIELD DOWN, HIT THE CORE':'THE MATRIARCH · DESTROY THE SHIELD NODES',b.hp/b.max);if(m.done)complete();return}
  m.spawnT-=dt;if(m.spawnT<=0&&alive()<4+Math.min(wave,8)){m.spawnT=1.3;spawnAt(pickType())}
  if(m.type==='capture'){const s=m.site,d=Math.hypot(pos.x-s.x,pos.z-s.z),inside=d<6&&Math.abs(pos.y-s.y)<4;if(inside)m.p+=dt/26;
    beaconMat.opacity=inside?0.6+Math.sin(time*8)*0.3:0.85;setObj(inside?'HOLD THE POINT':'CAPTURE '+s.n+' · '+Math.round(d)+' M',m.p);if(m.p>=1)complete();return}
  let near=1e9;for(let i=cores.length-1;i>=0;i--){const c=cores[i],d=Math.hypot(pos.x-c.x,pos.z-c.z);c.o.rotation.y+=dt*2;
    if(d<(veh?8:1.7)&&Math.abs(pos.y-c.y)<(veh?9:2.2)){scene.remove(c.g);cores.splice(i,1);score+=200;sfx('pick');say('Core recovered',1.2);comm('G',STORY.logs[logI++%STORY.logs.length]);continue}near=Math.min(near,d)}
  if(!cores.length){complete();return}
  setObj('RECOVER DATA CORES · '+(4-cores.length)+'/4 · '+Math.round(near)+' M',(4-cores.length)/4)}
function targets(){const m=mission;if(!m)return[];if(m.type==='capture')return[m.site];if(m.type==='recover')return cores;return[]}

/* ---------- audio ---------- */
let ac=null,muted=false;
function tone(type,f0,f1,dur,vol,delay=0){if(!ac||muted)return;const t=ac.currentTime+delay,o=ac.createOscillator(),g=ac.createGain();
  o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(f1,1),t+dur);
  g.gain.setValueAtTime(Math.max(0.0001,vol*CFG.vol),t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g).connect(ac.destination);o.start(t);o.stop(t+dur)}
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
}

/* ---------- input ---------- */
const keys={};let firing=false,mvX=0,mvY=0,moveId=null,lookId=null,fireId=null,mo=null,lx=0,ly=0;
addEventListener('keydown',e=>{keys[e.code]=true;
  if(state==='playing'&&(e.code==='Space'||e.code.startsWith('Arrow')))e.preventDefault();
  if(state==='playing'&&!e.repeat){const c=e.code;if(c==='Digit1')swap(0);else if(c==='Digit2')swap(1);else if(c==='KeyQ')swap();
    else if(c==='KeyG')grenade();else if(c==='KeyF')melee();else if(c==='KeyX')surge();else if(c==='KeyE')toggleVeh();else if(c==='Space')jumpQ=true}
  if(e.code==='KeyP'){if(state==='playing')pause();else if(state==='paused')resume()}});
addEventListener('keyup',e=>{keys[e.code]=false});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;firing=false});
function lock(){if(touchUI)return;try{const p=cv.requestPointerLock();if(p&&p.catch)p.catch(()=>{})}catch(e){}}
document.addEventListener('pointerlockchange',()=>{const was=locked;locked=document.pointerLockElement===cv;if(locked)skipMove=2;
  if(was&&!locked&&state==='playing')pause();syncHint()});
const look=(dx,dy,s)=>{s*=CFG.sens;yaw-=dx*s;pitch=Math.max(-1.45,Math.min(1.45,pitch-dy*s*(CFG.inv?-1:1)))};
let skipMove=0;
document.addEventListener('mousemove',e=>{if(!locked||state!=='playing')return;camIdle=0;if(skipMove>0){skipMove--;return}
  if(Math.abs(e.movementX)>250||Math.abs(e.movementY)>250)return;look(e.movementX,e.movementY,0.0022)});
stage.addEventListener('mousedown',e=>{if(state!=='playing'||e.target.closest('button'))return;if(!locked)lock();if(e.button===2)grenade();else firing=true});
stage.addEventListener('wheel',e=>{if(state==='playing'){e.preventDefault();swap()}},{passive:false});
addEventListener('mouseup',()=>{if(fireId===null)firing=false});
stage.addEventListener('contextmenu',e=>e.preventDefault());
function showTouch(){if(touchUI)return;touchUI=true;$('pad').hidden=state!=='playing';syncHint()}
stage.addEventListener('touchstart',e=>{showTouch();if(state!=='playing')return;e.preventDefault();
  const r=stage.getBoundingClientRect();
  for(const t of e.changedTouches){
    const act=t.target.dataset&&t.target.dataset.act;
    if(act){if(act==='fire'){fireId=t.identifier;firing=true}else if(act==='gren')grenade();else if(act==='melee')melee();else if(act==='swap')swap();else if(act==='jump')jumpQ=true;else if(act==='ride')toggleVeh();else surge();continue}
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
function setState(s){state=s;const play=s==='playing',game=s!=='menu';overlay.hidden=play;$('hud').hidden=!game;$('radar').hidden=!game;$('cross').hidden=!game;vm.visible=game;
  $('pad').hidden=!(play&&touchUI);if(!play){engineOff();firing=false;$('stick').hidden=true;moveId=lookId=fireId=null;mvX=mvY=0}syncHint()}
function begin(){$('settings').hidden=true;setTimeout(()=>{if(state==='playing')for(const[k,t]of STORY.intro)comm(k,t)},400);if(!ac){try{ac=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}
  if(ac&&ac.state==='suspended')ac.resume();reset();setState('playing');lock()}
function pause(){setState('paused');$('ovKeys').hidden=true;$('classes').hidden=true;$('ovTitle').textContent='Paused';$('ovText').textContent='The drones are holding still. For now.';$('go').textContent='Resume'}
function resume(){$('settings').hidden=true;setState('playing');lock()}
function die(){if(document.pointerLockElement)document.exitPointerLock();
  const rec=score>best;if(rec){best=score;try{localStorage.setItem('gh9-best',best)}catch(e){}$('best').textContent=best.toLocaleString()}
  setState('dead');$('classes').hidden=false;$('ovKeys').hidden=true;$('ovTitle').textContent='Deck lost';
  $('ovText').textContent=`You reached stage ${wave} and scored ${score.toLocaleString()}.`+(rec?' That is a new best.':'');
  $('go').textContent='Try again'}
CLS.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.innerHTML='<b>'+c.n+'</b>'+c.d;
  b.addEventListener('click',()=>{cls=i;try{localStorage.setItem('gh9-class',i)}catch(e){}syncCls()});$('classes').appendChild(b)});
function syncCls(){[...$('classes').children].forEach((b,i)=>b.setAttribute('aria-pressed',i===cls))}syncCls();
$('go').addEventListener('click',()=>{state==='paused'?resume():begin()});
$('mute').addEventListener('click',()=>{muted=!muted;$('mute').textContent=muted?'Sound off':'Sound on'});
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
addVeh('car',3,22,Math.PI);addVeh('car',146,-50,-1.571);addVeh('plane',152,-70,-1.571);addVeh('plane',-200,215,-1.571);
for(const sx of[-1,1])for(const sz of[-1,1]){addVeh('car',240*sx+5,240*sz+29,Math.PI);addVeh('car',445*sx-12*sx,445*sz,Math.PI)}
addVeh('plane',300,-200,0);
function engineOff(){if(eng){try{eng.o.stop()}catch(e){}eng=null}}
function engineOn(){if(!ac||eng)return;try{const o=ac.createOscillator(),g=ac.createGain();o.type='sawtooth';o.frequency.value=50;g.gain.value=0;o.connect(g).connect(ac.destination);o.start();eng={o,g}}catch(e){}}
function toggleVeh(){if(state!=='playing')return;
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
    const LIM=A+300;if(Math.abs(p.x)>LIM||Math.abs(p.z)>LIM||p.y>450||p.y<-120){p.x=Math.max(-LIM,Math.min(LIM,p.x));p.z=Math.max(-LIM,Math.min(LIM,p.z));p.y=Math.max(-120,Math.min(450,p.y));if(msgT<=0)say('Edge of the airspace',1.2)}
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

/* ---------- view model ---------- */
const vm=new T.Group();vm.scale.setScalar(0.19);cam.add(vm);vm.visible=false;
const arcG=new T.Group(),lanG=new T.Group();vm.add(arcG,lanG);
const emitMat=bas({color:0x50cdc3});
MAT.glove=std({color:0x1b2428,roughness:.85});MAT.sleeve=std({color:0x2f5560,roughness:.6,metalness:.3});
const reticleMat=bas({color:0x8fe6ff,transparent:true,opacity:.9,depthWrite:false,blending:T.AdditiveBlending});
const VK=fn=>inst(bake(fn),false);
function armsKit(a,fgz){a(GEO.box,MAT.glove,.11,.12,.13,.02,-.21,.25);a(GEO.box,MAT.glove,.05,.1,.12,-.06,-.17,.2);a(GEO.box,MAT.sleeve,.13,.12,.14,.04,-.31,.31,.5,0,0);
  a(GEO.box,MAT.glove,.13,.09,.16,-.02,-.15,fgz);a(GEO.box,MAT.glove,.04,.08,.13,.07,-.1,fgz);a(GEO.box,MAT.sleeve,.12,.11,.16,-.06,-.21,fgz+.12,.2,.4,0)}
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
const muzzle=new T.Object3D();muzzle.position.set(0,.01,-.92);vm.add(muzzle);
const mfl=new T.PointLight(0x9fefff,0,7,2);cam.add(mfl);const mglow=glow(0xdffcff,0.9,0.6);mglow.position.set(0,0.01,-0.94);mglow.visible=false;vm.add(mglow);
const beamMat=bas({color:0xc9fbff,fog:false,blending:T.AdditiveBlending,transparent:true,depthWrite:false}),beam=mesh(GEO.box,beamMat,1,1,1);beam.visible=false;scene.add(beam);

/* ---------- combat ---------- */
function place(e,off){let x=e.pos.x+off,z=e.pos.z,y=groundAt(x,z,e.pos.y);
  for(let i=0;i<10&&inBox(x,y+0.3,z);i++){const d=Math.hypot(pos.x-x,pos.z-z)||1;x+=(pos.x-x)/d;z+=(pos.z-z)/d;y=groundAt(x,z,e.pos.y)}
  return[x,y,z]}
function drop(e,k){const[x,y,z]=place(e,0);
  const g=new T.Group();g.add(mesh(GEO.box,k?MAT.cell:MAT.gel,0.34,0.44,0.34),mesh(GEO.box,MAT.cap,0.2,0.1,0.2,0,0.27,0));g.add(glow(k?0xc9a6ff:0x7be36b,1.8,0.5));g.position.set(x,y+0.45,z);scene.add(g);pickups.push({g,k,y:y+0.45})}
function loot(e){const w=Math.max(wave,1),r=Math.random()-w*0.015-(e.type===3?0.5:e.type===2?0.25:0),rar=r<0.03?4:r<0.12?3:r<0.35?2:r<0.65?1:0;
  const[x,y,z]=place(e,0.7),slot=Math.random()*2|0,g=mesh(GEO.oct,bas({color:RAR[rar].c}),0.26,0.4,0.26,x,y+0.7,z);g.add(glow(RAR[rar].c,7,0.7));scene.add(g);
  loots.push({g,y:y+0.7,slot,rar,pow:w+rar,name:NAMES[slot][Math.random()*4|0]})}
function num(p,n,c,crit){const v=tmpN.copy(p).project(cam);if(v.z>1||dnCount>28)return;
  const d=document.createElement('div');d.className='dn'+(crit?' crit':'');d.textContent=Math.max(1,Math.round(n*10));if(!crit&&c)d.style.color=c;
  d.style.left=((v.x*.5+.5)*stage.clientWidth+(Math.random()-.5)*26)+'px';d.style.top=((-v.y*.5+.5)*stage.clientHeight-12)+'px';
  dnCount++;d.addEventListener('animationend',()=>{d.remove();dnCount--});stage.insertBefore(d,overlay)}
function damage(e,n,el=-1,crit=false){if(e.dying)return;e.flash=0.1;
  if(e.type===3&&e.vuln<=0){n*=0.12;crit=false;if(!e.tip){e.tip=true;say('Shielded: destroy the orbiting nodes',2.5)}}
  if(e.sh>0){const m=el===e.sel?2.5:el<0?1:0.4;e.sh-=n*m;num(e.pos,n*m,ELC[e.sel]);
    if(e.sh<=0){e.sh=0;e.g.remove(e.shell);e.shell=null;sfx('boom');sparkle(e.pos,ELC[e.sel],16,8);if(el===e.sel)explode(e.pos,true)}else sfx('hit');return}
  if(crit)n*=2;e.hp-=n;num(e.pos,n,null,crit);
  if(e.hp>0){sfx('hit');return}
  e.dying=0.001;sparkle(e.pos,e.type>=5?GP[e.type].spark:[0xffb238,0xff4fa3,0xc9a6ff,0xffb238,0x8fe6ff][e.type],e.type>=2?(e.type===6||e.type===9?24:30):14,e.type===3?16:7);sfx('kill');
  if(e.type===4){score+=50;const b=e.boss;b.pods=b.pods.filter(q=>q!==e);if(!b.pods.length&&!b.dying){b.vuln=9;say('Shield down: hit the core',2.5);sfx('nova')}return}
  if(e.type===3){score+=5000;superQ=100;for(const q of e.pods)q.dying=0.001;e.pods=[];for(let i=0;i<3;i++){loot(e);e.pos.x+=1.3}drop(e,0);if(mission)mission.done=true;return}
  score+=e.type>=5?GP[e.type].score:e.type===2?500:e.type?150:100;superQ=Math.min(100,superQ+(e.type===2?30:e.type===6||e.type===9?14:7));
  const r=Math.random();if(e.type===2||r<0.2)drop(e,0);else if(r<0.4)drop(e,1);
  if(e.type===2||Math.random()<(e.type===6||e.type===9?0.35:0.16))loot(e)}
function fire(){
  const lance=weapon===1,od=overT>0;
  if(lance&&ammo<=0){weapon=0;fireCd=0.3;say('Lance empty',0.9);sfx('swap');return}
  if(lance){ammo--;fireCd=od?0.45:0.75;flash=0.12;recoil=2;sfx('lance')}
  else{fireCd=od?0.085:0.14;flash=0.06;recoil=1;if(!od)heat+=9;sfx('shoot');if(heat>=100){heat=100;over=true;say('Overheated',1.2);sfx('over')}}
  sinceFire=0;
  const org=veh?cam.position:eye;cam.getWorldDirection(tmp);const o=[org.x,org.y,org.z],d=[tmp.x,tmp.y,tmp.z],wall=rayBoxes(o,d,veh?170:90);
  let hit=null,hd=wall;const all=[];
  for(const e of enemies){if(e.dying)continue;const ox=e.pos.x-o[0],oy=e.pos.y-o[1],oz=e.pos.z-o[2],t=ox*d[0]+oy*d[1]+oz*d[2];
    if(t<0||t>wall)continue;const R=e.r*1.2+t*0.012,q=ox*ox+oy*oy+oz*oz-t*t;
    if(q<R*R){e.c=q<(e.r*0.45)**2;all.push(e);if(t<hd){hit=e;hd=t}}}
  const end=lance?wall:hd;if(veh)tmp2.copy(veh.pos);else muzzle.getWorldPosition(tmp2);tmp.multiplyScalar(end).add(org);
  beam.position.copy(tmp2).add(tmp).multiplyScalar(0.5);beam.lookAt(tmp);const th=(lance?0.03:0.012)*(veh?5:1);beam.scale.set(th,th,tmp2.distanceTo(tmp));
  beamMat.color.set(lance?0xe3d2ff:0xc9fbff);sparkle(tmp,lance?0xc9a6ff:0x9fefff,4,3);mfl.color.set(lance?0xc9a6ff:0x9fefff);
  const dm=gunMult(weapon)*(od?2:1);
  if(lance)for(const e of all)damage(e,6*dm,1,e.c);else if(hit)damage(hit,dm,0,hit.c);
}
function grenade(){if(state!=='playing'||grenCd>0)return;grenCd=CLS[cls].gren;cam.getWorldDirection(tmp);
  const g=mesh(GEO.sph,MAT.charge,0.13,0.13,0.13);g.add(glow(0x9dff7a,9));g.position.copy(eye).addScaledVector(tmp,0.5);scene.add(g);
  grenades.push({g,v:tmp.clone().multiplyScalar(17).add(new T.Vector3(0,2.5,0)),t:2});sfx('swap')}
function explode(p,burst){const m=bas({color:burst?0xffffff:0xffb238,transparent:true,opacity:0.85,fog:false}),g=mesh(GEO.sph,m,0.5,0.5,0.5,p.x,p.y,p.z);scene.add(g);
  blasts.push({g,m,t:0});sparkle(p,burst?0xffffff:0xffb238,16,9);if(!burst)sfx('boom');if(!reduced)shake=Math.max(shake,0.12);
  const c=new T.Vector3(p.x,Math.max(p.y,0.3),p.z),k=1+0.1*(power()-1);
  for(const e of enemies){const d=e.pos.distanceTo(c);if(d<(burst?3:4)+e.r&&los(c,e.pos))damage(e,(burst?3:d<2.2?6:3)*k,burst?-1:2)}}
function melee(){if(state!=='playing'||meleeCd>0)return;meleeCd=1.1;meleeA=0.2;sfx('melee');cam.getWorldDirection(tmp);const k=(cls===0?8:4)*(1+0.1*(power()-1));
  for(const e of enemies){tmp2.copy(e.pos).sub(eye);const d=tmp2.length()||1;
    if(d<2.2+e.r&&tmp2.dot(tmp)/d>0.45){if(e.type<3||e.type>=5)e.pos.addScaledVector(tmp2,(e.type===6?.5:1.5)/d);damage(e,k)}}}
function surge(){if(state!=='playing'||superQ<100)return;superQ=0;novaA=1;shield=shMax;clear(shots);sfx('nova');const k=1+0.1*(power()-1);
  if(cls===1){overT=8;say('Overdrive',1.5);return}
  if(cls===2){hp=Math.min(100,hp+50);say('Regrowth',1.5)}else say('Shockwave',1.5);
  for(const e of enemies)if(e.pos.distanceTo(eye)<22&&los(eye,e.pos))damage(e,(cls===2?8:14)*k)}
function swap(w){if(state!=='playing'||time-swapT<0.25)return;swapT=time;weapon=w===undefined?1-weapon:w;
  fireCd=Math.max(fireCd,0.3);sfx('swap');say(guns[weapon].name,0.8,RAR[guns[weapon].rar].c)}
function hurt(n){window.__hurtN++;return;if(veh)n*=0.5;if(shield>0&&shield-n<=0&&time-lastLow>30){lastLow=time;comm('R',['Your shield just broke. Get behind something.','Shield down. Back off and let it recharge.'][Math.random()*2|0])}shDelay=cls===2?2.2:3.5;if(shield>0){shield-=n;if(shield<0){hp+=shield;shield=0}}else hp-=n;
  hurtA=1;shake=reduced?0:0.2;sfx('hurt');if(hp<=0){hp=0;die()}}

function overlaps(b){return pos.x+PR>b.lo[0]&&pos.x-PR<b.hi[0]&&pos.z+PR>b.lo[2]&&pos.z-PR<b.hi[2]&&pos.y+PH>b.lo[1]&&pos.y<b.hi[1]}
function movePlayer(dx,dy,dz){
  const nb=nearList(pos.x-Math.abs(dx)-1,pos.z-Math.abs(dz)-1,pos.x+Math.abs(dx)+1,pos.z+Math.abs(dz)+1);
  if(dx){pos.x+=dx;for(const b of nb)if(overlaps(b)){if(b.hi[1]-pos.y<=0.3){pos.y=b.hi[1];if(vy<0)vy=0}else pos.x=dx>0?b.lo[0]-PR-1e-4:b.hi[0]+PR+1e-4}}
  if(dz){pos.z+=dz;for(const b of nb)if(overlaps(b)){if(b.hi[1]-pos.y<=0.3){pos.y=b.hi[1];if(vy<0)vy=0}else pos.z=dz>0?b.lo[2]-PR-1e-4:b.hi[2]+PR+1e-4}}
  pos.y+=dy;ground=false;
  for(const b of nb)if(overlaps(b)){if(dy<=0){pos.y=b.hi[1];vy=0;ground=true}else{pos.y=b.lo[1]-PH-1e-4;vy=0}}
  if(pos.y<=0){pos.y=0;vy=0;ground=true}
  const L=A-0.1-PR;pos.x=Math.max(-L,Math.min(L,pos.x));pos.z=Math.max(-L,Math.min(L,pos.z))}

function update(dt){
  // player
  if(veh)vehTick(dt);else{
  let f=0,s=0;
  if(keys.KeyW||keys.ArrowUp)f+=1;if(keys.KeyS||keys.ArrowDown)f-=1;if(keys.KeyD)s+=1;if(keys.KeyA)s-=1;
  f-=mvY;s+=mvX;
  if(keys.ArrowLeft)yaw+=2.6*dt;if(keys.ArrowRight)yaw-=2.6*dt;
  const l=Math.hypot(f,s);if(l>1){f/=l;s/=l}
  sprintT=f>0.5&&!firing?sprintT+dt:0;const sp=(sprintT>0.35?9:6.2)*CLS[cls].spd*dt,sn=Math.sin(yaw),cs=Math.cos(yaw);
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
  if(firing&&fireCd<=0&&(weapon===1||!over))fire();
  if(sinceFire>0.25||over)heat=Math.max(0,heat-(over?45:38)*dt);
  if(over&&heat<30)over=false;
  shDelay-=dt;if(shDelay<=0&&shield<shMax)shield=Math.min(shMax,shield+(cls===2?70:40)*dt);overT=Math.max(0,overT-dt);
  grenCd=Math.max(0,grenCd-dt);meleeCd=Math.max(0,meleeCd-dt);meleeA=Math.max(0,meleeA-dt);
  for(let i=grenades.length-1;i>=0;i--){const g=grenades[i],p=g.g.position;g.t-=dt;g.v.y-=14*dt;p.addScaledVector(g.v,dt);
    let boom=g.t<=0||p.y<0.12||inBox(p.x,p.y,p.z);
    if(!boom)for(const e of enemies)if(!e.dying&&e.pos.distanceTo(p)<e.r+0.3){boom=true;break}
    if(boom){p.addScaledVector(g.v,-dt);scene.remove(g.g);grenades.splice(i,1);explode(p)}}
  // missions
  for(let i=queue.length-1;i>=0;i--){const q=queue[i];q.t-=dt;if(q.t<=0){enemies.push(mk(q.type,q.x,q.y,q.z));queue.splice(i,1)}}
  missionTick(dt);if(state!=='playing')return;
  // enemies
  for(let i=enemies.length-1;i>=0;i--){const e=enemies[i];
    if(e.dying)continue;
    if(e.type>=5){groundTick(e,dt);if(state!=='playing')return;continue}
    if(e.type>=3){if(e.type===3)bossTick(e,dt);continue}
    const p=e.pos,dx=eye.x-p.x,dy=eye.y-p.y,dz=eye.z-p.z,d=Math.hypot(dx,dy,dz)||1,hd=Math.hypot(dx,dz)||1,see=d<70&&los(p,eye);
    if(hd>170){const[x,z]=spawnPos();p.set(x,8,z);continue}
    let mx=dx/d,my=dy/d,mz=dz/d,go=true;e.cd-=dt;
    if(!see&&hd>2){mx=dx/hd;mz=dz/hd;my=Math.max(-1,Math.min(1,(13.5-p.y)*0.8))}
    else if(e.type===1){
      if(see){if(hd<7){mx=-dx/hd;mz=-dz/hd}else if(hd<17){mx=-dz/hd*e.ph;mz=dx/hd*e.ph}
        my=Math.max(-1,Math.min(1,(eye.y+1.6-p.y)*0.8));
        if(e.cd<=0&&d<45){e.cd=Math.max(1,1.9-wave*0.05);const g=mesh(GEO.sph,MAT.spore,0.2,0.2,0.2,p.x,p.y,p.z);g.add(glow(0xff7a3a,7));scene.add(g);
          shots.push({g,v:new T.Vector3(dx/d*11,dy/d*11,dz/d*11),t:6});sfx('spit')}}}
    else{const big=e.type===2;
      if(d<e.r+(big?1.1:0.8)){go=false;if(e.cd<=0){e.cd=big?1.2:1;hurt(big?16:6)}}
      else if(d>3){const w=Math.sin(time*2.2+e.ph)*0.6;mx+=-dz/hd*w;mz+=dx/hd*w}}
    if(go){p.x+=mx*e.spd*dt;p.y+=my*e.spd*dt;p.z+=mz*e.spd*dt}
    for(let j=0;j<i;j++){const o=enemies[j];if(o.type>=3)continue;const ox=p.x-o.pos.x,oy=p.y-o.pos.y,oz=p.z-o.pos.z,od=Math.hypot(ox,oy,oz),m=e.r+o.r;
      if(od<m&&od>0.001){const k=(m-od)*0.5/od;p.x+=ox*k;p.y+=oy*k;p.z+=oz*k;o.pos.x-=ox*k;o.pos.y-=oy*k;o.pos.z-=oz*k}}
    pushOut(p,e.r);
    if(state!=='playing')return;
  }
  for(let i=shots.length-1;i>=0;i--){const s2=shots[i],p=s2.g.position;if(s2.grav)s2.v.y-=s2.grav*dt;p.addScaledVector(s2.v,dt);s2.t-=dt;
    const hitP=!s2.vis&&Math.hypot(p.x-pos.x,p.z-pos.z)<(veh?1.8:0.5)&&p.y>pos.y-0.1&&p.y<pos.y+PH+(veh?1:0.1);
    if(hitP||s2.t<=0||p.y<0||inBox(p.x,p.y,p.z)){scene.remove(s2.g);shots.splice(i,1);if(hitP){hurt(s2.dmg||12);if(state!=='playing')return}}}
  for(let i=loots.length-1;i>=0;i--){const L=loots[i],q=L.g.position;
    if(Math.hypot(q.x-pos.x,q.z-pos.z)>1.1||Math.abs(q.y-pos.y-0.7)>1.7)continue;
    if((1+(L.pow-1)*0.12)*RAR[L.rar].m>gunMult(L.slot)){guns[L.slot]={name:L.name,rar:L.rar,pow:L.pow};say(RAR[L.rar].n+' '+L.name+' · Power '+L.pow,2.4,RAR[L.rar].c)}
    else{score+=100;say('Salvage +100',1)}
    scene.remove(L.g);L.g.material.dispose();loots.splice(i,1);sfx('pick')}
  for(let i=pickups.length-1;i>=0;i--){const p=pickups[i],q=p.g.position;
    if(Math.hypot(q.x-pos.x,q.z-pos.z)>1||Math.abs(q.y-pos.y-0.6)>1.6)continue;
    if(p.k===0&&hp<100){hp=Math.min(100,hp+25);say('Hull patched',1)}
    else if(p.k===1&&ammo<24){ammo=Math.min(24,ammo+4);say('Lance cells',1)}else continue;
    scene.remove(p.g);pickups.splice(i,1);sfx('pick')}
}

/* ---------- per-frame visuals ---------- */
function animate(dt){
  for(let i=enemies.length-1;i>=0;i--){const e=enemies[i];
    e.flash-=dt;const wt=e.flash>0||e.dying>0;
    if(wt!==e.white){e.white=wt;for(const[o,m]of e.parts)o.material=wt?MAT.white:m}
    if(e.dying){e.dying+=dt;e.g.scale.setScalar(Math.max(0.01,1-e.dying/0.25));if(e.dying>0.25){scene.remove(e.g);enemies.splice(i,1)}continue}
    if(e.rig&&state!=='paused'){try{e.rig.anim(e,time,dt)}catch(err){e.rig=null}}
    if(e.type>=5){e.g.rotation.y=Math.atan2(eye.x-e.pos.x,eye.z-e.pos.z);continue}
    if(state!=='paused'){e.g.position.y+=Math.sin(time*4+e.ph)*0.004;
      for(const w of e.wings)w.rotation.z=-w.userData.s*(0.25+Math.sin(time*45+e.ph)*0.55)}
    e.g.lookAt(state==='menu'?cam.position:eye)}
  for(const L of loots){L.g.rotation.y+=dt*3;L.g.position.y=L.y+Math.sin(time*4)*0.1}
  for(const p of pickups){p.g.rotation.y+=dt*2;p.g.position.y=p.y+Math.sin(time*3)*0.08}
  for(let i=blasts.length-1;i>=0;i--){const b=blasts[i];b.t+=dt;const k=b.t/0.3;b.g.scale.setScalar(0.5+k*4);b.m.opacity=0.85*(1-k);
    if(k>=1){scene.remove(b.g);b.m.dispose();blasts.splice(i,1)}}
  flash-=dt;beam.visible=flash>0&&state==='playing';mfl.intensity=beam.visible?0.8:0;mglow.visible=beam.visible;
  for(const k of sparks)if(k.t>0){k.t-=dt;k.v.y-=9*dt;k.s.position.addScaledVector(k.v,dt);const a=Math.max(0,k.t/k.l);k.m.opacity=a;k.s.scale.setScalar(0.1+a*0.3);if(k.t<=0)k.s.visible=false}
  novaA=Math.max(0,novaA-dt*1.6);$('nova').style.opacity=novaA*0.75;
  sun.position.set(pos.x+28,pos.y+46,pos.z+14);sun.target.position.set(pos.x,pos.y,pos.z);
  rip.offset.set(time*0.012,time*0.02);auroraTex.offset.x=time*0.004;
  {const a=motes.geometry.attributes.position.array,c=cam.position;for(let i=0;i<a.length;i+=3){a[i]+=dt*0.5;a[i+1]+=Math.sin(time+i)*dt*0.2;
     if(a[i]-c.x>30)a[i]-=60;else if(a[i]-c.x<-30)a[i]+=60;if(a[i+1]-c.y>30)a[i+1]-=60;else if(a[i+1]-c.y<-30)a[i+1]+=60;if(a[i+2]-c.z>30)a[i+2]-=60;else if(a[i+2]-c.z<-30)a[i+2]+=60}
   motes.geometry.attributes.position.needsUpdate=true}for(const f of farAnim)f(dt);
  vm.visible=state!=='menu'&&!veh;
  // camera
  if(state==='menu'){const a=reduced?0.3:time*0.12;cam.position.set(Math.sin(a)*30,24,-86);cam.lookAt(0,5,70)}
  else if(veh){const car=veh.kind==='car',sh=shake>0?shake*0.08:0;cam.rotation.set(pitch+(Math.random()-.5)*sh,yaw+(Math.random()-.5)*sh,0);cam.getWorldDirection(tmp);
    cam.position.copy(veh.pos).addScaledVector(tmp,car?-7.5:-13);cam.position.y+=car?2.6:3.6;
    if(veh.pos.y>0&&cam.position.y<0.5&&Math.abs(cam.position.x)<A+2&&Math.abs(cam.position.z)<A+2)cam.position.y=0.5}
  else{const sh=shake>0?shake*0.12:0;
    cam.position.set(eye.x,eye.y+(reduced?0:Math.abs(Math.sin(bob))*0.05),eye.z);
    cam.rotation.set(pitch+(Math.random()-.5)*sh,yaw+(Math.random()-.5)*sh,0);
    const sw=meleeA>0?Math.sin(meleeA/0.2*Math.PI):0,bo=reduced?0:1;
    vm.position.set(0.075+Math.sin(bob)*0.004*bo-sw*0.05,-0.07-Math.abs(Math.cos(bob))*0.004*bo,-0.2+recoil*0.012-sw*0.07);
    vm.rotation.set(recoil*0.04,sw*0.5,0);
    arcG.visible=weapon===0;lanG.visible=weapon===1;
    arcSpin.rotation.z+=dt*(firing&&weapon===0&&!over?22:1.2);const pr=weapon===1?Math.min(1,recoil*.6)*.03:0;lanTop.position.y=.055+pr;lanBot.position.y=-.055-pr;
    lanCore.scale.x=.02*(1+(flash>0&&weapon===1?Math.random()*1.5:0));muzzle.position.z=weapon?-1.02:-.92;mglow.position.z=muzzle.position.z-.02;
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
function chip(id,v){const c=$(id);c.classList.toggle('ready',v>=1);c.querySelector('i').style.width=Math.max(0,Math.min(1,v))*100+'%'}
function hud(){
  $('wave').textContent=Math.max(wave,1);$('score').textContent=score.toLocaleString();
  $('sh').firstElementChild.style.width=shield/shMax*100+'%';$('pwr').textContent=power();
  $('hp').firstElementChild.style.width=hp+'%';
  $('hp').firstElementChild.style.background=hp<30?'var(--hurt)':'var(--leaf)';
  const lance=weapon===1,hb=$('heat');$('wname').textContent=lance?'LANCE':'ARC';$('wname').style.color=RAR[guns[weapon].rar].c;
  hb.firstElementChild.style.width=(lance?ammo/24*100:heat)+'%';hb.classList.toggle('over',!lance&&over);hb.classList.toggle('lance',lance);
  $('ammo').textContent=lance?ammo:'';$('cross').classList.toggle('hot',!lance&&over);
  chip('cG',1-grenCd/CLS[cls].gren);chip('cM',1-meleeCd/1.1);chip('cS',superQ/100);
  {const el=$('veh');let t='';const k=touchUI?'RIDE':'E';
    if(veh)t=(veh.kind==='car'?'ROVER · ':'SKIFF · ')+Math.round(Math.abs(veh.v)*3.6)+' KM/H'+(veh.kind==='car'?'':' · ALT '+Math.round(veh.pos.y)+' M')+' · '+k+' TO EXIT';
    else if(state==='playing')for(const v of vehs)if(Math.hypot(v.pos.x-pos.x,v.pos.y-v.r-pos.y,v.pos.z-pos.z)<5){t=k+' · '+(v.kind==='car'?'DRIVE THE ROVER':'FLY THE SKIFF');break}
    el.hidden=!t;if(t)el.textContent=t}
  $('hurt').style.opacity=Math.max(hurtA,hp<30&&state==='playing'?0.25:0);
}

let last=performance.now();
function frame(now){renderer.info.autoReset=false;renderer.info.reset();
  const dt=Math.min(0.05,(now-last)/1000);last=now;
  if(state!=='paused'&&state!=='dead')time+=dt;
  if(state==='playing'){update(dt);commsTick(dt)}
  hurtA=Math.max(0,hurtA-dt*2);shake=Math.max(0,shake-dt);
  if(msgT>0){msgT-=dt;if(msgT<=0)$('msg').classList.remove('on')}
  animate(dt);if(state!=='menu'){radar();hud()}
  if(composer&&bloomOn){try{composer.render()}catch(e){composer=null}}else renderer.render(scene,cam);
  requestAnimationFrame(frame);
}
if(!lowFx&&T.EffectComposer&&T.UnrealBloomPass&&T.ShaderPass&&T.CopyShader){try{
  const z=renderer.getDrawingBufferSize(new T.Vector2()),RT=renderer.capabilities.isWebGL2&&T.WebGLMultisampleRenderTarget?T.WebGLMultisampleRenderTarget:T.WebGLRenderTarget;
  const rt=new RT(z.x,z.y,{minFilter:T.LinearFilter,magFilter:T.LinearFilter,format:T.RGBAFormat,encoding:T.sRGBEncoding});
  const c=new T.EffectComposer(renderer,rt);c.addPass(new T.RenderPass(scene,cam));
  c.addPass(new T.UnrealBloomPass(new T.Vector2(z.x,z.y),0.5,0.55,0.8));c.addPass(new T.ShaderPass(T.CopyShader));composer=c}catch(e){composer=null}}
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
applyCfg();
demo();requestAnimationFrame(frame);
})();
