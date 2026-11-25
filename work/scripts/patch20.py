p='/home/user/greenhouse-nine/index.html';s=open(p).read()
ship=open('./ship.js').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:80]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]
rep("const A=640,boxes=[]","const AX=110,AZ=260,A=AZ,boxes=[]")
between("// floor with a glass window over the planet","// sky\n// sky, the planet below",ship+"// sky\n")
rep("new T.HemisphereLight(0x9fcfff,0x2a5a6a,0.55)","new T.HemisphereLight(0xb8dcff,0x3a5a64,0.85)")
# bounds
rep("if(free)return;if(o.y<r)o.y=r;const L=A-0.1-r;o.x=Math.max(-L,Math.min(L,o.x));o.z=Math.max(-L,Math.min(L,o.z))}","if(free)return;if(o.y<r)o.y=r;o.x=Math.max(-AX+.1+r,Math.min(AX-.1-r,o.x));o.z=Math.max(-AZ+.1+r,Math.min(AZ-.1-r,o.z))}")
rep("  const L=A-0.1-PR;pos.x=Math.max(-L,Math.min(L,pos.x));pos.z=Math.max(-L,Math.min(L,pos.z))}","  pos.x=Math.max(-AX+.1+PR,Math.min(AX-.1-PR,pos.x));pos.z=Math.max(-AZ+.1+PR,Math.min(AZ-.1-PR,pos.z))}")
rep("Math.abs(p.x)<A+1&&Math.abs(p.z)<A+1","inHull(p.x,p.z)",3)
rep("Math.abs(cam.position.x)<A+2&&Math.abs(cam.position.z)<A+2","inHull(cam.position.x,cam.position.z)")
rep("groundAt(x,z,y){let g=0;for(const b of cell(Math.floor(x/GC),Math.floor(z/GC)))if(x>b.lo[0]&&x<b.hi[0]&&z>b.lo[2]&&z<b.hi[2]&&b.hi[1]<=y+0.5&&(b.hi[1]<=3.1||",
    "groundAt(x,z,y){let g=0;for(const b of cell(Math.floor(x/GC),Math.floor(z/GC)))if(x>b.lo[0]&&x<b.hi[0]&&z>b.lo[2]&&z<b.hi[2]&&b.hi[1]<=y+0.5&&(b.hi[1]<=3.1||b.floor||")
# spawns at floor level inside rooms, out of sight; navigation flow field
rep("function spawnPos(){let x=0,z=0;for(let k=0;k<8;k++){const a=Math.random()*6.283,r=(veh?38:24)+Math.random()*(veh?26:10);x=clampA(pos.x+Math.cos(a)*r);z=clampA(pos.z+Math.sin(a)*r);if(Math.hypot(x-pos.x,z-pos.z)>16)break}return[x,z]}",
"""let SPN=null;const hv2=new T.Vector3();
function spawnPts(){if(SPN)return SPN;SPN=[];for(const r of ROOMS){let n=0;for(let k=0;k<80&&n<10;k++){const x=r.x0+3+Math.random()*(r.x1-r.x0-6),z=r.z0+3+Math.random()*(r.z1-r.z0-6);
  if(inBox(x,.5,z)||inBox(x,1.8,z)||inBox(x,3,z))continue;SPN.push({x,z,r});n++}}return SPN}
function spawnPos(){const S=spawnPts();let fb=null;for(let k=0;k<50;k++){const q=S[Math.random()*S.length|0],d=Math.hypot(q.x-pos.x,q.z-pos.z);if(d<22||d>150)continue;fb=fb||q;hv2.set(q.x,1.5,q.z);if(!los(hv2,eye))return[q.x,q.z,q.r]}
  const q=fb||S[Math.random()*S.length|0];return[q.x,q.z,q.r]}
const NC=2.5,NX=Math.ceil(2*AX/NC),NZ=Math.ceil(2*AZ/NC);let NAV=null,ND=null,NQ=null,navT=0;
function navBuild(){NAV=new Uint8Array(NX*NZ);ND=new Int32Array(NX*NZ);NQ=new Int32Array(NX*NZ);
  for(let i=0;i<NX;i++)for(let j=0;j<NZ;j++){const x=-AX+(i+.5)*NC,z=-AZ+(j+.5)*NC;NAV[j*NX+i]=(!inBox(x,.4,z)&&!inBox(x,1.4,z)&&!inBox(x,2.4,z))?1:0}}
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
  if(!bx&&!bz)return null;const tx=-AX+(i+bx+.5)*NC-x,tz=-AZ+(j+bz+.5)*NC-z,l=Math.hypot(tx,tz)||1;return[tx/l,tz/l]}""")
rep("function spawnAt(type,t=0){const[x,z]=spawnPos();queue.push({t,type,x,y:type>=5?24+Math.random()*6:7+Math.random()*3,z})}",
    "function spawnAt(type,t=0){const[x,z,r]=spawnPos();queue.push({t,type,x,y:type>=5?1.5:Math.min(r.h-3,6+Math.random()*2),z})}")
rep("if(hd>170){const[x,z]=spawnPos();p.set(x,26,z);e.vy=0;e.ch=0;return}","if(hd>170){const[x,z]=spawnPos();p.set(x,1.5,z);e.vy=0;e.ch=0;return}")
rep("if(hd>170){const[x,z]=spawnPos();p.set(x,8,z);continue}","if(hd>170){const[x,z,r]=spawnPos();p.set(x,Math.min(r.h-3,7),z);continue}")
rep("  else if(P.atk==='melee'||!see||hd>P.far){mx=dx/hd;mz=dz/hd}","  else if(P.atk==='melee'||!see||hd>P.far){const f=(!see||hd>14)&&flowDir(p.x,p.z);if(f){mx=f[0];mz=f[1]}else{mx=dx/hd;mz=dz/hd}}")
rep("if(!see&&hd>2){mx=dx/hd;mz=dz/hd;my=Math.max(-1,Math.min(1,(13.5-p.y)*0.8))}",
    "if(!see&&hd>2){const f=flowDir(p.x,p.z);if(f){mx=f[0];mz=f[1]}else{mx=dx/hd;mz=dz/hd}const rr=roomAt(p.x,p.z),ch=rr?rr.h:10;my=Math.max(-1,Math.min(1,(Math.min(ch-3,eye.y+2.5)-p.y)*0.8))}")
rep("  // missions\n","  navT-=dt;if(navT<=0){navT=.35;navFlow()}\n  // missions\n")
# cover needs line of sight from the enemy to the spot
rep("covV.set(c.x,pos.y+0.6,c.z);if(!los(covV,eye))return c}return null}","covV.set(c.x,pos.y+0.6,c.z);if(!los(covV,eye)){covV.set(c.x,p.y,c.z);if(los(p,covV))return c}}return null}")
# the boss stays in a tall hall
rep("m.g.position.set(clampA(pos.x+Math.cos(a)*24),16,clampA(pos.z+Math.sin(a)*24));",
    "const pr=roomAt(pos.x,pos.z),H=pr&&pr.h>=24?pr:ROOMS.find(r=>r.n==='COMMONS');m.g.position.set((H.x0+H.x1)/2+Math.cos(a)*14,12,(H.z0+H.z1)/2+Math.sin(a)*14);")
rep("const e={...EB(),type:3,pos:m.g.position,","const e={...EB(),hall:H,type:3,pos:m.g.position,")
rep("p.x=clampA(p.x+(ux*want-uz*0.4)*sp*dt);p.z=clampA(p.z+(uz*want+ux*0.4)*sp*dt);",
    "p.x=clampA(p.x+(ux*want-uz*0.4)*sp*dt);p.z=clampA(p.z+(uz*want+ux*0.4)*sp*dt);if(e.hall){const H=e.hall;p.x=Math.max(H.x0+7,Math.min(H.x1-7,p.x));p.z=Math.max(H.z0+7,Math.min(H.z1-7,p.z))}")
# vehicles: rover in the spine and hangar, skiffs in the hangar
rep("addVeh('car',3,22,Math.PI);addVeh('car',146,-50,-1.571);addVeh('plane',152,-70,-1.571);addVeh('plane',-200,215,-1.571);\nfor(const sx of[-1,1])for(const sz of[-1,1]){addVeh('car',240*sx+5,240*sz+29,Math.PI);addVeh('car',445*sx-12*sx,445*sz,Math.PI)}\naddVeh('plane',300,-200,0);",
    "addVeh('car',0,-130,0);addVeh('car',80,185,Math.PI);addVeh('plane',-85,232,Math.PI);addVeh('plane',85,238,Math.PI);")
# start, demo and menu camera in the commons
rep("function reset(){pos.set(0,0,15);yaw=Math.PI;","function reset(){pos.set(0,0,24);yaw=0;")
rep("function demo(){enemies.push(mk(0,-3,3.2,4),mk(0,2.5,4,2),mk(1,5,3,7),mk(0,-6,2.6,9))}","function demo(){enemies.push(mk(0,-6,5,14),mk(0,4,6,12),mk(1,9,5,16),mk(5,-10,1,18),mk(6,8,1.3,20))}")
rep("cam.position.set(Math.sin(a)*30,24,-86);cam.lookAt(0,5,70)}","cam.position.set(Math.sin(a)*14,9,30);cam.lookAt(0,7,-10)}")
rep("auroraTex.offset.x=time*0.004;","")
# sky: Europa below the bow, Jupiter off the stern, no dome
rep(" const R=9000,TL=0.75,PY=-(R+780)*Math.cos(TL),PZ=(R+780)*Math.sin(TL),PS=lowFx?512:1024,pg=new T.Group();pg.position.set(0,PY,PZ);pg.rotation.x=-TL;scene.add(pg);",
    " const R=9000,TL=0.55,PY=-(R+780)*Math.cos(TL),PZ=-(R+780)*Math.sin(TL),PS=lowFx?512:1024,pg=new T.Group();pg.position.set(0,PY,PZ);pg.rotation.x=TL;scene.add(pg);")
between(" const land=pix(PS,PS,(x,y)=>{"," const planet=",""" const land=pix(PS,PS,(x,y)=>{const u=x/PS,v=y/PS,h=fbm(u*6+3,v*6+7,5),f=fbm(u*28+1,v*28+5,3);let c=mix([232,228,218],[196,180,156],cl(h*1.4-.35));
   for(const[a,b,k]of[[3.1,1.7,9],[1.3,-2.4,13],[-2.2,0.9,7],[0.4,3.3,11]]){const l=Math.abs(Math.sin((u*a+v*b)*k*6.283/6.283*3+fbm(u*3+a,v*3+b,3)*5));if(l<0.05)c=mix(c,[150,82,58],(0.05-l)/0.05*0.85)}
   return[c[0]+f*14-7,c[1]+f*14-7,c[2]+f*14-7]},[3,2]);
""")
between(" const CS=lowFx?256:512,cf=(x,y)=>"," pg.add(mesh(new T.SphereGeometry(1,96,64),new T.ShaderMaterial(","")
rep("gl_FragColor=vec4(vec3(0.28,0.68,1.0)*f*1.25,1.0);","gl_FragColor=vec4(vec3(0.7,0.75,0.8)*f*0.35,1.0);")
rep("const pc=mesh(GEO.sph,bas({color:0x3f8fb0}),R,R,R,0,PY,PZ);","const pc=mesh(GEO.sph,bas({color:0xbdb6aa}),R,R,R,0,PY,PZ);")
rep(" scene.add(mesh(new T.IcosahedronGeometry(1,3),bas({color:lin(0x1f4a54),wireframe:true,fog:false}),A*2.2,A*2.2,A*2.2,0,-A*0.6,0));\n","")
between(" // ringed giant"," {const N=lowFx?250:700,rock=",""" // Jupiter off the stern
 const pt=paint(512,(g,S)=>{const cols=['#efe2c8','#d9b88e','#b9784c','#e8d4b0','#a8643e','#f2e6d0','#c99a6a','#8e5236'];
   let y=0;while(y<S){const h=6+hash(y,5)*26;g.fillStyle=cols[Math.floor(hash(y,9)*cols.length)];g.fillRect(0,y,S,h);y+=h}
   for(let i=0;i<120;i++){g.fillStyle=`rgba(255,248,235,${0.04+hash(i,8)*0.08})`;g.beginPath();g.ellipse(hash(i,1)*S,hash(i,2)*S,20+hash(i,3)*70,2+hash(i,4)*5,0,0,7);g.fill()}
   g.fillStyle='#b8573a';g.beginPath();g.ellipse(S*.62,S*.64,S*.07,S*.035,0,0,7);g.fill();g.fillStyle='#d27a52';g.beginPath();g.ellipse(S*.62,S*.64,S*.045,S*.02,0,0,7);g.fill()});
 const P=[700,900,3400];
 scene.add(mesh(GEO.sph,new T.MeshLambertMaterial({map:pt,fog:false}),1300,1300,1300,...P));
 const halo=glow(0xffd8a8,4200,0.18);halo.position.set(...P);scene.add(halo);
""")
open(p,'w').write(s);print('ok')
