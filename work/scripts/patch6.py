p='index.html';s=open(p).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:70]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:70]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]

# camera / fog / light
rep("scene.fog=new T.Fog(lin(0x0e2a36),45,200);","scene.fog=new T.Fog(lin(0x0e2a36),90,430);")
rep("new T.PerspectiveCamera(portrait?88:74,1.6,0.05,500)","new T.PerspectiveCamera(portrait?88:74,1.6,0.08,9000)")
rep("new T.HemisphereLight(0x9fcfff,0x1c3a2a,0.5)","new T.HemisphereLight(0x9fcfff,0x2a5a6a,0.55)")
rep("c.near=5;c.far=140}","c.near=5;c.far=160}")

# materials
rep("MAT.water=std({color:0x0d3a44,roughness:0.04,metalness:1});MAT.water.userData.noShadow=true;",
"""const rip=normalMap(paint(256,(g,S)=>{g.fillStyle='#808080';g.fillRect(0,0,S,S);
  for(let i=0;i<240;i++){const x=Math.random()*S,y=Math.random()*S,r=8+Math.random()*26,v=Math.random()>0.5?255:0,gr=g.createRadialGradient(x,y,0,x,y,r);
    gr.addColorStop(0,`rgba(${v},${v},${v},.4)`);gr.addColorStop(1,`rgba(${v},${v},${v},0)`);g.fillStyle=gr;
    for(const ox of[-S,0,S])for(const oy of[-S,0,S]){g.save();g.translate(ox,oy);g.beginPath();g.arc(x,y,r,0,7);g.fill();g.restore()}}},false),4);
rip.repeat.set(0.25,0.25);
MAT.water=std({color:0x0d3a44,roughness:0.04,metalness:1,normalMap:rip,normalScale:new T.Vector2(0.4,0.4)});MAT.water.userData.noShadow=true;
MAT.pane=std({color:0x9fe6ff,transparent:true,opacity:0.2,roughness:0.05,metalness:0.7,depthWrite:false});MAT.pane.userData.noShadow=true;
MAT.leafP=std({color:0xff9fd0,emissive:0xff4fa3,emissiveIntensity:0.3,roughness:0.7,flatShading:true});""")

# world helpers
rep("const A=72,boxes=[]","const A=110,boxes=[]")
between("function stairs(x,z,dx,dz,width,top){","function planter(","""function stairs(x,z,dx,dz,width,top,base=0){for(let i=0;;i++){const h=top-0.25*(i+1);if(h<=base+0.01)break;const o=(i+0.5)*0.6;
  box(x+dx*o,base,z+dz*o,dx?0.6:width,h-base,dz?0.6:width,MAT.metal)}}
""")
between("function tree(x,z,k){","box(0,-1,0,2*A+4,1,2*A+4,MAT.floor,false);","""function tree(x,z,k,y0=0){const h=3+hash(k,1)*1.4;box(x,y0,z,0.6,h,0.6,MAT.bark);
  for(let i=0;i<4;i++){const a=i*1.6+k,r=i?1.15:0,sc=1.5+hash(k,i+2)*0.9;
    blob(GEO.ico,(i+k)%2?MAT.leaf:MAT.leafD,sc,sc*0.8,sc,x+Math.cos(a)*r,y0+h+0.6+hash(k,i+7)*0.9,z+Math.sin(a)*r,a);
    blob(GEO.ico0,MAT.bloom,0.17,0.17,0.17,x+Math.cos(a+1)*sc*0.85,y0+h+0.8+i*0.25,z+Math.sin(a+1)*sc*0.85)}}
const PADS=[];
function pad(x,y,z,v){PADS.push({x,y,z,v});blob(GEO.cyl,MAT.metal,1.6,0.06,1.6,x,y+0.03,z);blob(GEO.cyl,MAT.strip,1.25,0.08,1.25,x,y+0.06,z)}
""")
between("box(0,-1,0,2*A+4,1,2*A+4,MAT.floor,false);","// core: hub, catwalk","""// floor with a glass window over the planet, open edges with a glass rail
{const F=A+2;box(0,-1,(80-F)/2,2*F,1,80+F,MAT.floor,false);box(0,-1,(104+F)/2,2*F,1,F-104,MAT.floor,false);
 box(-(F+20)/2,-1,92,F-20,1,24,MAT.floor,false);box((F+20)/2,-1,92,F-20,1,24,MAT.floor,false);
 box(0,-0.3,92,40,0.3,24,MAT.pane,false);
 for(const x of[-20,-10,0,10,20])box(x,-0.45,92,0.5,0.46,24,MAT.metal,false);for(const z of[80,88,96,104])box(0,-0.45,z,40,0.46,0.5,MAT.metal,false);
 box(-12,-3,92,0.7,0.7,24,MAT.hull,false);box(12,-3,92,0.7,0.7,24,MAT.hull,false);box(0,-2.6,92,0.15,0.1,24,MAT.strip,false);
 for(const[x,z,w,d]of[[0,-A-0.5,2*A+2,1],[0,A+0.5,2*A+2,1],[-A-0.5,0,1,2*A+2],[A+0.5,0,1,2*A+2]]){box(x,-1,z,w,2,d,MAT.hull,false);box(x*(A+0.25)/(A+0.5),1,z*(A+0.25)/(A+0.5),w>1?w:0.1,2.2,d>1?d:0.1,MAT.pane,false)}
 for(let i=-10;i<=10;i++)for(const sg of[-1,1]){box(i*11,1,sg*(A+0.25),0.25,2.3,0.25,MAT.metal,false);box(sg*(A+0.25),1,i*11,0.25,2.3,0.25,MAT.metal,false)}
 for(const[x,z,w,d]of[[0,-A+0.05,2*A,0.1],[0,A-0.05,2*A,0.1],[-A+0.05,0,0.1,2*A],[A-0.05,0,0.1,2*A]])box(x,1.02,z,w,0.1,d,MAT.strip,false)}
""")
rep("stairs(10*sgn,-50,0,1,4,3);","stairs(10*sgn,-50,0,1,4,3,1.5);")
rep("stairs(0,-58,0,1,4,4.5);","stairs(0,-58,0,1,4,4.5,3);")
rep("box(x,8.5,z,7,0.3,7,MAT.metal)}\nflush();","""box(x,8.5,z,7,0.3,7,MAT.metal);pad(54*sx,0,54*sz,20)}
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
  blob(GEO.cyl,i%2?MAT.leaf:MAT.leafD,r,0.03,r,x,0.1,z);if(i%3===0)blob(GEO.ico0,MAT.bloom,0.2,0.2,0.2,x,0.3,z)}
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
flush();
for(const q of PADS){const gl=glow(0x8fe6ff,4.5,0.5);gl.position.set(q.x,q.y+0.7,q.z);scene.add(gl)}
for(const[x,y,z]of[[98,12,0],[95,10.5,3],[101,11,-3],[98,9,4],[-92,25.6,0]]){const gl=glow(x>0?0xff7fbf:0x8fe6ff,x>0?9:7,x>0?0.22:0.8);gl.position.set(x,y,z);scene.add(gl)}""")
between("{const lamps=[[0,5.1,0,0xffb238,1.7,24],","// sky\n// sky","""{const lamps=[[0,5.1,0,0xffb238,1.7,24],[98,8,0,0xff7fbf,2.2,46],[-92,24,0,0x6fd8ff,2,42],[0,6,92,0x6fd8ff,1.4,38],[0,13.4,-100,0xffb238,1.6,32],
   [24,3.7,-2,0xffb238,1.3,18],[0,2.2,-24,0x6fd8ff,1.1,18],[54,5,0,0xff7fbf,1.6,30],[-54,6,0,0xffb238,1.6,30],[0,8,50,0x6fd8ff,1.6,30],[0,7,-58,0xffb238,1.6,30]];
 for(const[x,y,z,c,i,d]of lowFx?lamps.slice(0,4):lamps){const L=new T.PointLight(c,i,d,2);L.position.set(x,y,z);scene.add(L);const gl=glow(c,9,0.3);gl.position.set(x,y-0.6,z);scene.add(gl)}}
""")
between("// sky\n{const sk=paint(512","// sparks","""// sky, the planet below and far scenery
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
   return[4+col[0]*neb*0.55+10*hz,7+col[1]*neb*0.55+38*hz,16+col[2]*neb*0.6+48*hz]});
 const skyM=mesh(GEO.sph,bas({map:sk,side:T.BackSide,fog:false,depthWrite:false}),5000,5000,5000);scene.add(skyM);
 // planet below the deck
 const R=3000,PY=-(R+260),PS=lowFx?512:1024,pg=new T.Group();pg.position.y=PY;scene.add(pg);
 const land=pix(PS,PS,(x,y)=>{const h=fbm(x/PS*7+3,y/PS*7+7,6),f=fbm(x/PS*30+1,y/PS*30+5,3);
   if(h>0.54){const t=cl((h-0.54)/0.26);return t<0.25?mix([200,170,110],[78,140,84],t*4):t<0.65?mix([78,140,84],[112,92,140],(t-0.25)*2.5):mix([112,92,140],[232,232,238],(t-0.65)*2.86)}
   const t=h/0.54,c=t<0.75?mix([6,30,62],[12,82,116],t/0.75):mix([12,82,116],[62,178,176],(t-0.75)*4);return[c[0]+f*10,c[1]+f*14,c[2]+f*14]},[6,3]);
 const planet=mesh(new T.SphereGeometry(1,96,64),bas({map:land,fog:false}),R,R,R);planet.rotation.x=Math.PI/2;pg.add(planet);
 const CS=lowFx?256:512,cf=(x,y)=>fbm(x/CS*6+50,y/CS*6+20,5),cloud=pix(CS,CS,(x,y)=>{const a=(cf(x,y)*(CS-x)*(CS-y)+cf(x-CS,y)*x*(CS-y)+cf(x,y-CS)*(CS-x)*y+cf(x-CS,y-CS)*x*y)/(CS*CS);
   return[245,248,250,cl((a-0.5)/0.16)*235]},[12,6]);
 const cg=new T.Group(),cm=mesh(new T.SphereGeometry(1,96,64),bas({map:cloud,transparent:true,depthWrite:false,fog:false}),R+14,R+14,R+14);cm.rotation.x=Math.PI/2;cg.add(cm);pg.add(cg);
 farAnim.push(dt=>{cg.rotation.y+=dt*0.0035});
 pg.add(mesh(new T.SphereGeometry(1,96,64),new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,
   vertexShader:'varying vec3 vN;varying vec3 vV;void main(){vec4 m=modelViewMatrix*vec4(position,1.0);vN=normalize(normalMatrix*normal);vV=normalize(-m.xyz);gl_Position=projectionMatrix*m;}',
   fragmentShader:'varying vec3 vN;varying vec3 vV;void main(){float f=pow(1.0-max(dot(normalize(vN),normalize(vV)),0.0),3.0);gl_FragColor=vec4(vec3(0.28,0.68,1.0)*f*1.25,1.0);}'}),R+42,R+42,R+42));
 try{const es=new T.Scene();es.add(skyM.clone());es.add(mesh(GEO.sph,bas({color:0xfff0d8}),700,700,700,2000,3320,1000));const pc=mesh(GEO.sph,bas({color:0x3f8fb0}),R,R,R,0,PY,0);es.add(pc);
  const pm=new T.PMREMGenerator(renderer);scene.environment=pm.fromScene(es,0,1,10000).texture;pm.dispose()}catch(e){}
 scene.add(mesh(new T.IcosahedronGeometry(1,3),bas({color:lin(0x1f4a54),wireframe:true,fog:false}),240,240,240,0,-70,0));
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
""")

# gameplay hooks
rep("movePlayer((-sn*f+cs*s)*sp,vy*dt,(-cs*f-sn*s)*sp);","movePlayer((-sn*f+cs*s)*sp,vy*dt,(-cs*f-sn*s)*sp);\n  if(ground)for(const q of PADS)if(Math.abs(pos.y-q.y)<0.3&&Math.hypot(pos.x-q.x,pos.z-q.z)<1.3){vy=q.v;airUsed=false;gliding=false;sfx('nova');break}")
rep("(10.5-p.y)*0.8","(13.5-p.y)*0.8")
rep("const SITES=[","const SITES=[{n:'THE LAKE ISLAND',x:98,y:0.56,z:4.5},{n:'THE SPIRE',x:-92,y:0,z:-13},{n:'THE PROMENADE',x:0,y:0,z:92},{n:'THE SUMMIT',x:0,y:10.5,z:-100},")
rep("const CORE_SPOTS=[","const CORE_SPOTS=[[-85,20,0],[0,10.5,-106],[60,8.8,60],[-60,8.8,-60],[98,0.56,-3.5],[0,0,100],[94,0,-90],")
rep("sun.position.set(pos.x+28,46,pos.z+14);sun.target.position.set(pos.x,0,pos.z);","sun.position.set(pos.x+28,pos.y+46,pos.z+14);sun.target.position.set(pos.x,pos.y,pos.z);\n  rip.offset.set(time*0.012,time*0.02);for(const f of farAnim)f(dt);")
rep("cam.position.set(Math.sin(a)*31,10,Math.cos(a)*31);cam.lookAt(0,2.2,0)}","cam.position.set(Math.sin(a)*86,30,Math.cos(a)*86);cam.lookAt(0,2,0)}")
rep("const a=reduced?0.6:0.6+time*0.07;","const a=reduced?0.6:0.6+time*0.04;")
open(p,'w').write(s)
