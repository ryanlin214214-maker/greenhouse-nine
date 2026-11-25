p='index.html';s=open(p).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:70]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:70]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]

# html/css
rep('<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>',
'<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n'+''.join('<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/%s.js"></script>\n'%n for n in
 ['shaders/CopyShader','shaders/LuminosityHighPassShader','postprocessing/EffectComposer','postprocessing/RenderPass','postprocessing/ShaderPass','postprocessing/UnrealBloomPass']).rstrip('\n'))
rep('<canvas id="cv"></canvas>','<canvas id="cv"></canvas>\n  <div class="vig"></div>')
rep(".hurt,.nova{",".vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,transparent 58%,rgba(0,0,0,.42) 100%)}\n.hurt,.nova{")

# renderer / resize / composer
rep("let renderer=null;","let renderer=null,composer=null;")
rep("renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}","renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();\n  if(composer){const z=renderer.getDrawingBufferSize(new T.Vector2());composer.setSize(z.x,z.y)}}")
rep("scene.fog=new T.Fog(lin(0x0e2a36),32,125);","scene.fog=new T.Fog(lin(0x0e2a36),45,200);")
rep("{const c=sun.shadow.camera;c.left=-42;c.right=42;c.top=42;c.bottom=-42;c.near=5;c.far=130}","{const c=sun.shadow.camera;c.left=-50;c.right=50;c.top=50;c.bottom=-50;c.near=5;c.far=140}")
rep("sun.shadow.normalBias=0.04;scene.add(sun);","sun.shadow.normalBias=0.04;scene.add(sun,sun.target);")
rep("  renderer.render(scene,cam);\n","  if(composer){try{composer.render()}catch(e){composer=null}}else renderer.render(scene,cam);\n")
rep("demo();requestAnimationFrame(frame);","""if(!lowFx&&T.EffectComposer&&T.UnrealBloomPass&&T.ShaderPass&&T.CopyShader){try{
  const z=renderer.getDrawingBufferSize(new T.Vector2()),RT=renderer.capabilities.isWebGL2&&T.WebGLMultisampleRenderTarget?T.WebGLMultisampleRenderTarget:T.WebGLRenderTarget;
  const rt=new RT(z.x,z.y,{minFilter:T.LinearFilter,magFilter:T.LinearFilter,format:T.RGBAFormat,encoding:T.sRGBEncoding});
  const c=new T.EffectComposer(renderer,rt);c.addPass(new T.RenderPass(scene,cam));
  c.addPass(new T.UnrealBloomPass(new T.Vector2(z.x,z.y),0.5,0.55,0.8));c.addPass(new T.ShaderPass(T.CopyShader));composer=c}catch(e){composer=null}}
demo();requestAnimationFrame(frame);""")

# materials: normal maps, new mats
rep("const glowTex=paint(64,","""function normalMap(src,k){const S=src.image.width,d=src.image.getContext('2d').getImageData(0,0,S,S).data,c=document.createElement('canvas');c.width=c.height=S;
  const g=c.getContext('2d'),o=g.createImageData(S,S),H=(x,y)=>{const i=(((y+S)%S)*S+((x+S)%S))*4;return(d[i]+d[i+1]+d[i+2])/765};
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const dx=(H(x+1,y)-H(x-1,y))*k,dy=(H(x,y+1)-H(x,y-1))*k,l=Math.hypot(dx,dy,1),i=(y*S+x)*4;
    o.data[i]=(-dx/l*.5+.5)*255;o.data[i+1]=(dy/l*.5+.5)*255;o.data[i+2]=(1/l*.5+.5)*255;o.data[i+3]=255}
  g.putImageData(o,0,0);const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=ANISO;return t}
function crateTex(base){return paint(128,(g,S)=>{g.fillStyle=base;g.fillRect(0,0,S,S);grime(g,S,900,0.08);
  for(let x=0;x<S;x+=16){g.fillStyle='rgba(0,0,0,.28)';g.fillRect(x,0,5,S);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(x+5,0,3,S)}
  g.fillStyle='rgba(0,0,0,.5)';g.fillRect(0,0,S,5);g.fillRect(0,S-5,S,5);g.fillStyle='rgba(255,255,255,.75)';g.fillRect(20,52,44,8);g.fillRect(20,66,28,5)})}
const glowTex=paint(64,""")
rep("hull:std({map:TX.hull,bumpMap:TX.hull,bumpScale:0.02,","hull:std({map:TX.hull,normalMap:normalMap(TX.hull,6),")
rep("vine:std({map:TX.vine,bumpMap:TX.vine,bumpScale:0.03,","vine:std({map:TX.vine,normalMap:normalMap(TX.vine,5),")
rep("floor:std({map:TX.floor,bumpMap:TX.floor,bumpScale:0.015,roughness:0.42,metalness:0.5})","floor:std({map:TX.floor,normalMap:normalMap(TX.floor,6),roughness:0.36,metalness:0.6})")
rep("MAT.drone=std(","""MAT.bark=std({color:0x5a4030,roughness:0.9});
{const a=crateTex('#b5651d'),b=crateTex('#2f6f7a');MAT.crateA=std({map:a,normalMap:normalMap(a,5),roughness:0.55,metalness:0.5});MAT.crateB=std({map:b,normalMap:normalMap(b,5),roughness:0.55,metalness:0.5})}
MAT.water=std({color:0x0d3a44,roughness:0.04,metalness:1});MAT.water.userData.noShadow=true;
MAT.strip=bas({color:0x8fe6ff});MAT.strip.userData.noShadow=true;
MAT.drone=std(""")
rep("GEO={oct:","GEO={ico0:new T.IcosahedronGeometry(1,0),cyl:new T.CylinderGeometry(1,1,1,16),oct:")

# world
between("/* ---------- world ---------- */","// sky\n","""/* ---------- world ---------- */
const A=72,boxes=[],bucket=new Map(),M4=new T.Matrix4(),UP=new T.Vector3(0,1,0);
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
function stairs(x,z,dx,dz,width,top){for(let i=0;;i++){const h=top-0.25*(i+1);if(h<=0.01)break;const o=(i+0.5)*0.6;
  box(x+dx*o,0,z+dz*o,dx?0.6:width,h,dz?0.6:width,MAT.metal)}}
function planter(x,y,z,w,d){box(x,y,z,w,1,d,MAT.soil);box(x,y+0.9,z,w+0.1,0.12,d+0.1,MAT.metal,false);
  const n=Math.round(Math.max(w,d)/0.8);
  for(let i=0;i<n;i++){const t=(i+0.5)/n-0.5,fx=x+(w>d?t*w:0),fz=z+(w>d?0:t*d),h=0.7+hash(i,x*7+z|0)*0.7;
    blob(GEO.ico,i%2?MAT.leaf:MAT.leafD,0.52,0.35+h*0.5,0.52,fx,y+1.05+h*0.4,fz,i*1.7);
    blob(GEO.ico,i%2?MAT.leafD:MAT.leaf,0.32,0.32,0.32,fx+0.25,y+1.25+h*0.7,fz-0.15,i);
    if(i%2===1)blob(GEO.ico0,MAT.bloom,0.13,0.13,0.13,fx+0.2,y+1.3+h*0.9,fz+0.2)}}
function tree(x,z,k){const h=3+hash(k,1)*1.4;box(x,0,z,0.6,h,0.6,MAT.bark);
  for(let i=0;i<4;i++){const a=i*1.6+k,r=i?1.15:0,sc=1.5+hash(k,i+2)*0.9;
    blob(GEO.ico,(i+k)%2?MAT.leaf:MAT.leafD,sc,sc*0.8,sc,x+Math.cos(a)*r,h+0.6+hash(k,i+7)*0.9,z+Math.sin(a)*r,a);
    blob(GEO.ico0,MAT.bloom,0.17,0.17,0.17,x+Math.cos(a+1)*sc*0.85,h+0.8+i*0.25,z+Math.sin(a+1)*sc*0.85)}}
box(0,-1,0,2*A+4,1,2*A+4,MAT.floor,false);
box(0,0,-A-0.5,2*A+2,8,1,MAT.hull);box(0,0,A+0.5,2*A+2,8,1,MAT.hull);box(-A-0.5,0,0,1,8,2*A+2,MAT.hull);box(A+0.5,0,0,1,8,2*A+2,MAT.hull);
for(const[x,z,w,d]of[[0,-A+0.05,2*A,0.1],[0,A-0.05,2*A,0.1],[-A+0.05,0,0.1,2*A],[A-0.05,0,0.1,2*A]])box(x,7.2,z,w,0.14,d,MAT.strip,false);
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
  if(Math.abs(x)<4&&z<46)continue;box(x,0,z,w,h,w*0.7,i%2?MAT.crateA:MAT.crateB)}
box(0,0,58,2,11,2,MAT.hull);box(0,10,50,1.2,0.8,18,MAT.metal,false);box(0,6.5,43,3,3.5,3,MAT.crateA,false);box(0,10,43,0.1,0.1,0.1,MAT.metal,false);
// north: terraces
box(0,0,-46,60,1.5,8,MAT.hull);box(0,0,-54,60,3,8,MAT.hull);box(0,0,-62,60,4.5,8,MAT.hull);
for(const sgn of[-1,1]){stairs(20*sgn,-42,0,1,4,1.5);stairs(10*sgn,-50,0,1,4,3);box(18*sgn,4.5,-63.5,10,3,3,MAT.glass);planter(22*sgn,1.5,-46,8,1.6);planter(24*sgn,3,-54,8,1.6)}
stairs(0,-58,0,1,4,4.5);box(0,4.38,-58.05,60.1,0.12,0.1,MAT.amber,false);
// corner towers
for(const sx of[-1,1])for(const sz of[-1,1]){const x=60*sx,z=60*sz;box(x,0,z,8,6,8,MAT.hull);box(x,6,z,6,2.5,6,MAT.glass);box(x,5.88,z,8.12,0.12,8.12,MAT.amber,false);box(x,8.5,z,7,0.3,7,MAT.metal)}
flush();
{const lamps=[[0,5.1,0,0xffb238,1.7,24],[-23,3.7,-8,0xffb238,1.3,18],[24,3.7,-2,0xffb238,1.3,18],[-4,3.7,25,0xffb238,1.3,18],[24,5.1,24,0xffb238,1.3,18],[0,2.2,-24,0x6fd8ff,1.1,18],
   [54,5,0,0xff7fbf,1.6,30],[-54,6,0,0xffb238,1.6,30],[0,8,50,0x6fd8ff,1.6,30],[0,7,-58,0xffb238,1.6,30]];
 for(const[x,y,z,c,i,d]of lowFx?[lamps[0],lamps[6],lamps[7],lamps[8]]:lamps){const L=new T.PointLight(c,i,d,2);L.position.set(x,y,z);scene.add(L);const gl=glow(c,9,0.3);gl.position.set(x,y-0.6,z);scene.add(gl)}}
// sky
""")
rep("scene.add(mesh(GEO.sph,bas({map:sk,side:T.BackSide,fog:false,depthWrite:false}),420,420,420));",
"""const skyM=mesh(GEO.sph,bas({map:sk,side:T.BackSide,fog:false,depthWrite:false}),420,420,420);scene.add(skyM);
 try{const es=new T.Scene();es.add(skyM.clone());es.add(mesh(GEO.sph,bas({color:0xfff0d8}),70,70,70,190,300,95));es.add(mesh(GEO.sph,bas({color:0x7fd8ee}),40,40,40,-300,60,120));
  const pm=new T.PMREMGenerator(renderer);scene.environment=pm.fromScene(es,0,1,1000).texture;pm.dispose()}catch(e){}""")
rep("bas({color:lin(0x1f4a54),wireframe:true,fog:false}),80,80,80,0,-12,0)","bas({color:lin(0x1f4a54),wireframe:true,fog:false}),150,150,150,0,-25,0)")
rep("mesh(new T.IcosahedronGeometry(1,2),bas({color:lin(0x1f4a54)","mesh(new T.IcosahedronGeometry(1,3),bas({color:lin(0x1f4a54)")

# gameplay constants
rep("if(o.y<r)o.y=r;const L=29.9-r;","if(o.y<r)o.y=r;const L=A-0.1-r;")
rep("const L=29.9-PR;","const L=A-0.1-PR;")
rep("&&b.hi[1]<=y+0.5&&b.hi[1]<=3.1&&b.hi[1]>g)","&&b.hi[1]<=y+0.5&&(b.hi[1]<=3.1||(b.hi[1]<=4.6&&Math.min(b.hi[0]-b.lo[0],b.hi[2]-b.lo[2])>=7))&&b.hi[1]>g)")
rep("const a=Math.random()*6.283,r=22+Math.random()*5;x=Math.cos(a)*r;z=Math.sin(a)*r;if(Math.hypot(x-pos.x,z-pos.z)>14)break}",
    "const a=Math.random()*6.283,r=24+Math.random()*10;x=Math.max(-A+3,Math.min(A-3,pos.x+Math.cos(a)*r));z=Math.max(-A+3,Math.min(A-3,pos.z+Math.sin(a)*r));if(Math.hypot(x-pos.x,z-pos.z)>16)break}")
rep("queue.push({t:i*0.4,type:i>=n?2:i<seed?1:0,x,y:5+Math.random()*2,z})","queue.push({t:i*0.4,type:i>=n?2:i<seed?1:0,x,y:7+Math.random()*3,z})")
rep("const n=4+wave*2,","const n=5+wave*2,")
rep("(7.5-p.y)*0.8","(10.5-p.y)*0.8")
rep("cam.position.set(Math.sin(a)*24,7,Math.cos(a)*24);cam.lookAt(0,2.2,0)}","cam.position.set(Math.sin(a)*31,10,Math.cos(a)*31);cam.lookAt(0,2.2,0)}")
rep("  // camera\n","  sun.position.set(pos.x+28,46,pos.z+14);sun.target.position.set(pos.x,0,pos.z);\n  // camera\n")
# weapon detail
rep("const muzzle=new T.Object3D();","""{const b=mesh(GEO.cyl,MAT.gunD,0.05,0.5,0.05,0,-0.07,-0.2);b.rotation.x=Math.PI/2;arcG.add(b,mesh(GEO.box,MAT.gunD,0.04,0.06,0.2,0,0.13,0.1),mesh(GEO.box,emitMat,0.165,0.03,0.3,0,-0.03,-0.05));
 const c=mesh(GEO.cyl,MAT.gunD,0.045,0.7,0.045,0,-0.09,-0.25);c.rotation.x=Math.PI/2;lanG.add(c,mesh(GEO.box,MAT.gunD,0.04,0.07,0.26,0,0.12,0.12),mesh(GEO.box,MAT.cell,0.135,0.03,0.5,0,-0.04,-0.15))}
const muzzle=new T.Object3D();""")
open(p,'w').write(s)
