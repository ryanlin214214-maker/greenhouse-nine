p='/home/user/greenhouse-nine/index.html'
s=open(p).read()
def rep(a,b):
  global s
  assert s.count(a)==1,(s.count(a),a[:100]); s=s.replace(a,b)
i=s.index("function meridianModel(");j=s.index("function mineModel(")
NEW=r"""// Meridian Station, after the owner's concept art: white and gold cathedral spires over stepped garden terraces, a mirrored spire
// hanging below, blue banners, a glass atrium with a gold armillary sphere, an orbital ring, and landing piers (pad 3 is the arrival)
function meridianModel(){const M=shuttleMats(),g=new T.Group(),W=M.hull,Gd=std({color:0xd9a441,roughness:.3,metalness:.9}),Dk=M.dark,Gl=M.glass,Sm=bas({color:0x8fe6ff}),Wn=bas({color:0xffd27a}),U=new T.Vector3(0,1,0);
  const lathe=(pts,seg)=>new T.LatheGeometry(pts.map(([r,y])=>new T.Vector2(r,y)),seg||32);
  const emb=paint(256,(c,S)=>{c.fillStyle='#1d3570';c.fillRect(0,0,S,S);c.strokeStyle='#d9a441';c.fillStyle='#d9a441';c.lineWidth=6;c.strokeRect(10,10,S-20,S-20);
    c.beginPath();c.moveTo(S/2,S*.14);c.lineTo(S*.56,S*.52);c.lineTo(S/2,S*.62);c.lineTo(S*.44,S*.52);c.closePath();c.fill();c.fillRect(S*.36,S*.5,S*.28,S*.03);
    c.beginPath();c.arc(S/2,S*.66,S*.2,Math.PI*.1,Math.PI*.9);c.stroke();c.beginPath();c.arc(S/2,S*.72,S*.13,Math.PI*.15,Math.PI*.85);c.stroke();c.font='700 26px "Chakra Petch",sans-serif';c.textAlign='center';c.fillText('MERIDIAN',S/2,S*.93)});
  const BN=std({map:emb,roughness:.8,side:T.DoubleSide});
  greeble(g,'meri2',(a,R)=>{
    // stepped terraces, gold rims, the underside cone and the mirrored spire below
    a(new T.CylinderGeometry(150,146,6,64),W,1,1,1,0,-3,0);a(new T.CylinderGeometry(146,40,54,64,1,true),W,1,1,1,0,-33,0);a(lathe([[40,-60],[30,-110],[18,-170],[8,-215],[0,-240]]),W,1,1,1,0,0,0);
    a(new T.CylinderGeometry(105,108,14,64),W,1,1,1,0,7,0);a(new T.CylinderGeometry(62,65,16,48),W,1,1,1,0,22,0);
    for(const[r,y]of[[150,0],[106.5,14],[63.5,30],[148,-6]])a(new T.TorusGeometry(r,.7,6,96),Gd,1,1,1,0,y,0,Math.PI/2,0,0);
    // the central tower: a tall tapered spire with gold bands, cyan light seams and warm window rows
    a(lathe([[34,30],[30,70],[24,120],[17,170],[10,215],[5,250],[1.5,285],[0,300]]),W,1,1,1,0,0,0);for(const y of[70,120,170,215,250])a(new T.CylinderGeometry(y===70?30.6:y===120?24.6:y===170?17.6:y===215?10.6:5.6,y===70?30.6:y===120?24.6:y===170?17.6:y===215?10.6:5.6,2,32),Gd,1,1,1,0,y,0);
    for(let k=0;k<8;k++){const t=k*Math.PI/4,c=Math.cos(t),sn=Math.sin(t);for(const[r0,y0,r1,y1]of[[34,30,24,120],[24,120,10,215]]){const d=new T.Vector3((r1-r0)*c,y1-y0,(r1-r0)*sn),L=d.length();a(GEO.box,Sm,.5,L,.5,(r0+r1)/2*c*1.01,(y0+y1)/2,(r0+r1)/2*sn*1.01,new T.Quaternion().setFromUnitVectors(U,d.normalize()))}}
    for(let y=36;y<200;y+=9){const r=y<120?34-(y-30)*10/90:24-(y-120)*14/95;for(let k=0;k<16;k++){const t=(k+.5)*Math.PI/8;if(k%4===0)continue;a(GEO.box,Wn,.25,1.4,1.2,Math.cos(t)*(r+.1),y,Math.sin(t)*(r+.1),0,-t,0)}}
    // secondary spires on the middle terrace, each with a mirrored spire under the main deck
    for(let k=0;k<6;k++){const t=k*Math.PI/3+Math.PI/6,x=Math.cos(t)*86,z=Math.sin(t)*86;if(z>60&&Math.abs(x)<30)continue;a(lathe([[12,0],[10,25],[7,55],[4,85],[1,108],[0,118]],20),W,1,1,1,x,14,z);a(new T.CylinderGeometry(10.5,10.5,1.5,20),Gd,1,1,1,x,40,z);a(GEO.cone,Gd,1.2,10,1.2,x,137,z);
      for(let y=20;y<60;y+=8)for(let q=0;q<6;q++){const u=q*Math.PI/3;a(GEO.box,Wn,.2,1.2,1,x+Math.cos(u)*(11.5-(y-14)*.08),14+y,z+Math.sin(u)*(11.5-(y-14)*.08),0,-u,0)}
      const x2=Math.cos(t)*120,z2=Math.sin(t)*120;a(lathe([[10,0],[7,-30],[3,-70],[0,-95]],16),W,1,1,1,x2,-6,z2);a(new T.CylinderGeometry(8,8,1.5,16),Gd,1,1,1,x2,-14,z2)}
    // bridges from the tower terrace to the spires
    for(let k=0;k<6;k++){const t=k*Math.PI/3+Math.PI/6;if(Math.sin(t)>.6)continue;a(GEO.box,W,6,2,26,Math.cos(t)*73,31,Math.sin(t)*73,0,-t+Math.PI/2,0);a(GEO.box,Gd,6.4,.4,26,Math.cos(t)*73,32.2,Math.sin(t)*73,0,-t+Math.PI/2,0)}
    // the glass atrium at the front of the tower with a gold armillary sphere inside
    a(new T.SphereGeometry(20,24,12,0,Math.PI*2,0,Math.PI/2),Gl,1,1,1,0,14,84);for(let k=0;k<8;k++)a(new T.TorusGeometry(20,.35,4,24,Math.PI),Gd,1,1,1,0,14,84,0,k*Math.PI/8,0);a(GEO.cyl,Gd,1,10,1,0,19,84);
    // gardens, canopies and lamps on the deck
    for(let k=0;k<40;k++){const t=hash(k,71)*6.283,r=112+hash(k,72)*32;if(Math.sin(t)>.85&&Math.abs(Math.cos(t))<.3)continue;const x=Math.cos(t)*r,z=Math.sin(t)*r,h=4+hash(k,73)*5;a(GEO.cyl,Dk,.5,h,.5,x,h/2,z);a(GEO.ico,k%3?MAT.leaf:MAT.leafD,3+hash(k,74)*2,2.5+hash(k,75)*2,3+hash(k,74)*2,x,h+1.5,z)}
    for(let k=0;k<12;k++){const t=k*Math.PI/6+.2,x=Math.cos(t)*128,z=Math.sin(t)*128;if(z>110)continue;a(GEO.box,M.white,10,.2,7,x,4.5,z,.15,-t,0);for(const o of[-4.5,4.5])a(GEO.cyl,Gd,.15,4.5,.15,x+Math.cos(-t)*o,2.25,z-Math.sin(-t)*o)}
    // landing piers: pier 3 points at the approach and carries the arrival pad
    for(const t of[0,2.1,-2.1]){const c=Math.sin(t),cz=Math.cos(t);a(GEO.box,W,36,4,190,c*240,-2,cz*240,0,t,0);for(const o of[-18.3,18.3])a(GEO.box,Gd,.6,1.4,190,c*240+cz*o,.7,cz*240-c*o,0,t,0);a(GEO.box,Dk,30,10,20,c*160,-11,cz*160,0,t,0)}
    a(GEO.cyl,Dk,16,.3,16,0,.2,290);a(new T.TorusGeometry(16,.4,6,48),Sm,1,1,1,0,.5,290,Math.PI/2,0,0);for(let k=0;k<12;k++){const t=k*Math.PI/6;a(GEO.box,Sm,.8,.4,.8,Math.cos(t)*18,.4,290+Math.sin(t)*18)}
    for(let z=160;z<330;z+=12)for(const o of[-17,17])a(GEO.box,Wn,.6,.3,.6,o,.3,z)});
  // blue banners hanging from the deck rim
  for(let k=0;k<16;k++){const t=k*Math.PI/8+.1,b=mesh(GEO.box,BN,7,26,.2,Math.cos(t)*151,-17,Math.sin(t)*151);b.rotation.y=-t+Math.PI/2;g.add(b);g.add(mesh(GEO.box,Gd,8,.6,.6,Math.cos(t)*151,-3.6,Math.sin(t)*151))}
  // the pad number
  {const tx=paint(256,(c,S)=>{c.clearRect(0,0,S,S);c.fillStyle='#ffd27a';c.font='700 170px "Chakra Petch",sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('3',S/2,S/2)});const pl=new T.Mesh(new T.PlaneGeometry(16,16),bas({map:tx,transparent:true,depthWrite:false}));pl.rotation.x=-Math.PI/2;pl.position.set(0,.45,290);g.add(pl)}
  // parked ships on the other two piers
  for(const t of[2.1,-2.1]){const sh=shuttleModel();sh.position.set(Math.sin(t)*270,4.2,Math.cos(t)*270);sh.rotation.y=t+Math.PI;try{shuttleAnim(sh,0,0,0,8,1,true,10)}catch(_){}g.add(sh)}
  // the orbital ring with spokes (turns), and the armillary sphere (turns)
  const rings=[];{const r=new T.Group();r.position.y=165;g.add(r);const tor=new T.Mesh(new T.TorusGeometry(300,6,10,120),W);tor.rotation.x=Math.PI/2;r.add(tor);const tg=new T.Mesh(new T.TorusGeometry(300,6.6,4,120,Math.PI*.2),Gd);tg.rotation.x=Math.PI/2;r.add(tg);
    for(let k=0;k<4;k++){const sp=mesh(GEO.cyl,Gd,1.5,600,1.5,0,0,0);sp.rotation.z=Math.PI/2;sp.rotation.y=k*Math.PI/4;r.add(sp)}for(let k=0;k<24;k++){const t=k*Math.PI/12;r.add(mesh(GEO.box,Wn,3,1.2,3,Math.cos(t)*300,6.4,Math.sin(t)*300))}rings.push(r)}
  {const ar=new T.Group();ar.position.set(0,22,84);g.add(ar);for(let k=0;k<3;k++){const q=mesh(new T.TorusGeometry(8-k*1.6,.35,6,40),Gd,1,1,1);q.rotation.set(k*1.1,k*.7,0);ar.add(q)}ar.add(mesh(GEO.sph,Wn,2,2,2));const q=glow(0xffd27a,16,.7);ar.add(q);rings.push(ar)}
  const beacons=[];for(const[x,y,z]of[[0,302,0],[0,-242,0]]){const b=glow(0xff3030,40,.9);b.position.set(x,y,z);g.add(b);beacons.push(b)}{const q=glow(0x8fe6ff,60,.35);q.position.set(0,6,290);g.add(q)}
  const cyls=[[0,0,150,-6,0],[0,0,100,-40,-6],[0,0,45,-62,-40],[0,0,28,-150,-62],[0,0,12,-230,-150],[0,0,108,0,14],[0,0,65,14,30],[0,0,34,30,120],[0,0,24,120,170],[0,0,14,170,250],[0,0,6,250,300],[0,84,21,14,34]];
  for(let k=0;k<6;k++){const t=k*Math.PI/3+Math.PI/6,x=Math.cos(t)*86,z=Math.sin(t)*86;if(!(z>60&&Math.abs(x)<30))cyls.push([x,z,12,14,150]);cyls.push([Math.cos(t)*120,Math.sin(t)*120,10,-100,-6])}
  return{g,rings,beacons,tori:[[165,300,7]],cyls,boxes:[[-18,-4,145,18,0,335],[-15,-16,150,15,-6,170]],bay:new T.Vector3(0,26,300),land:new T.Vector3(0,4.4,290)}}
"""
s=s[:i]+NEW+s[j:]
# cylinders in ship collision
rep("  if(!hit&&H.tori)for(const[ty,R0,tb]of H.tori){","  if(!hit&&H.cyls)for(const[cx,cz,cr,y0,y1]of H.cyls){const dx2=q.x-cx,dz2=q.z-cz,rr=Math.hypot(dx2,dz2);if(rr<cr+r&&q.y>y0-r&&q.y<y1+r){const pr=cr+r-rr,pu=y1+r-q.y,pd=q.y-(y0-r);if(pr<=pu&&pr<=pd){const k=(cr+r)/(rr||1e-6);q.x=cx+dx2*k;q.z=cz+dz2*k}else if(pu<pd)q.y=y1+r;else q.y=y0-r;hit=true;break}}\n  if(!hit&&H.tori)for(const[ty,R0,tb]of H.tori){")
# arrival: glide to the approach point, then settle onto pad 3
rep("const inside=M.bay.clone().setZ(70).applyMatrix4(M.g.matrixWorld),","const inside=(M.land||M.bay.clone().setZ(70)).clone().applyMatrix4(M.g.matrixWorld),")
rep("S.pos.lerp(tg,Math.min(1,dt*(tg===inside?.35:.8)));","S.pos.lerp(tg,Math.min(1,dt*(tg===inside?.5:.8)));")
open(p,'w').write(s);print('ok')
