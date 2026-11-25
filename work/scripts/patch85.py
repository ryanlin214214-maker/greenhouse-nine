p='/home/user/greenhouse-nine/index.html'
s=open(p).read()
def rep(a,b):
  global s
  assert s.count(a)==1,(s.count(a),a[:110]); s=s.replace(a,b)
i=s.index("function meridianModel(");j=s.index("function mineModel(");F=s[i:j]
def fr(a,b):
  global F
  assert F.count(a)==1,(F.count(a),a[:110]); F=F.replace(a,b)
fr("function meridianModel(){const M=shuttleMats(),g=new T.Group(),","function meridianModel(){const SC=8,PLAT=[0,.8,-.8,2.25,-2.25],HANG=[.4,-.4,1.55,-1.55,2.85,-2.85],busy=t=>{const ta=Math.PI/2-t;return[...PLAT,...HANG].some(u=>Math.abs(Math.atan2(Math.sin(ta-u),Math.cos(ta-u)))<.14)};\n  const M=shuttleMats(),G=new T.Group(),g=new T.Group(),")
fr("  const lathe=(pts,seg)=>","  g.scale.setScalar(SC);G.add(g);\n  const lathe=(pts,seg)=>")
# denser windows on the tower
fr("for(let y=36;y<200;y+=9){const r=y<120?34-(y-30)*10/90:24-(y-120)*14/95;for(let k=0;k<16;k++){const t=(k+.5)*Math.PI/8;if(k%4===0)continue;a(GEO.box,Wn,.25,1.4,1.2,Math.cos(t)*(r+.1),y,Math.sin(t)*(r+.1),0,-t,0)}}",
"for(let y=34;y<205;y+=3.2){const r=y<120?34-(y-30)*10/90:24-(y-120)*14/95;const n=y<120?28:18;for(let k=0;k<n;k++){const t=(k+.5)*Math.PI*2/n;if(k%7===0)continue;a(GEO.box,Wn,.25,.8,.7,Math.cos(t)*(r+.08),y,Math.sin(t)*(r+.08),0,-t,0)}}\n    for(let k=0;k<8;k++){const t=k*Math.PI/4+Math.PI/8;a(GEO.box,W,1.2,90,6,Math.cos(t)*30,75,Math.sin(t)*30,0,-t,.06*0);a(GEO.box,Gd,1.4,90,.6,Math.cos(t)*30,75,Math.sin(t)*33,0,-t,0)}\n    for(const[y,r]of[[95,29],[145,21],[190,13.5]]){a(new T.CylinderGeometry(r+4,r+4,.8,40),W,1,1,1,0,y,0);a(new T.TorusGeometry(r+4,.25,4,48),Gd,1,1,1,0,y+.5,0,Math.PI/2,0,0)}\n    for(let k=0;k<48;k++){const t=k*Math.PI/24;a(GEO.cyl,W,.8,10,.8,Math.cos(t)*103,19,Math.sin(t)*103);a(GEO.box,Gd,1.6,.6,1.6,Math.cos(t)*103,24.3,Math.sin(t)*103)}a(new T.TorusGeometry(103,.7,4,96),W,1,1,1,0,24.8,0,Math.PI/2,0,0);\n    for(let k=0;k<6;k++){const t=k*Math.PI/3;a(new T.SphereGeometry(7,16,8,0,Math.PI*2,0,Math.PI/2),W,1,1,1,Math.cos(t)*48,30,Math.sin(t)*48);a(GEO.cone,Gd,.6,4,.6,Math.cos(t)*48,39,Math.sin(t)*48)}\n    for(const[r,y,n]of[[149.5,.3,180],[106,14.3,120],[63,30.3,72]])for(let k=0;k<n;k++){const t=k*Math.PI*2/n;a(GEO.box,Wn,.5,.3,.5,Math.cos(t)*r,y,Math.sin(t)*r)}")
# trees and canopies: smaller, more of them, kept off the hangars and platforms
i2=F.index("    for(let k=0;k<40;k++){const t=hash(k,71)*6.283");j2=F.index("    // landing piers")
F=F[:i2]+"""    for(let k=0;k<170;k++){const t=hash(k,71)*6.283,r=112+hash(k,72)*34;if(busy(t))continue;const x=Math.cos(t)*r,z=Math.sin(t)*r,h=1.6+hash(k,73)*1.8;a(GEO.cyl,Dk,.18,h,.18,x,h/2,z);a(GEO.ico,k%3?MAT.leaf:MAT.leafD,1.1+hash(k,74)*.8,1+hash(k,75)*.7,1.1+hash(k,74)*.8,x,h+.6,z)}
    for(let k=0;k<30;k++){const t=k*Math.PI/15+.05,x=Math.cos(t)*120,z=Math.sin(t)*120;if(busy(t))continue;a(GEO.box,M.white,4,.08,3,x,2,z,.15,-t,0);for(const o of[-1.8,1.8])a(GEO.cyl,Gd,.06,2,.06,x+Math.cos(-t)*o,1,z-Math.sin(-t)*o)}
"""+F[j2:]
i3=F.index("    // landing piers");j3=F.index("for(let z=160;z<330;z+=12)for(const o of[-17,17])a(GEO.box,Wn,.6,.3,.6,o,.3,z)});")+len("for(let z=160;z<330;z+=12)for(const o of[-17,17])a(GEO.box,Wn,.6,.3,.6,o,.3,z)});")
F=F[:i3]+"  },true);"+F[j3:]
fr("  for(let k=0;k<16;k++){const t=k*Math.PI/8+.1,b=","  for(let k=0;k<16;k++){const t=k*Math.PI/8+.1;if(busy(t))continue;const b=")
i4=F.index("  // the pad number");j4=F.index("  // the orbital ring")
F=F[:i4]+F[j4:]
fr("{const q=glow(0x8fe6ff,60,.35);q.position.set(0,6,290);g.add(q)}","")
i5=F.index("  return{g,rings,beacons,tori:[[165,300,7]],cyls,");j5=F.index("}}",i5)+2
F=F[:i5]+r"""  // ---- real-size detail round the deck rim (1,200 m out): landing platforms like the art, hangars, towers, parked and flying ships
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
  const traffic=[];for(let k=0;k<6;k++){const sh=shuttleModel();G.add(sh);traffic.push({g:sh,a:k*1.05,r:1500+k*260,y:120+k*90,w:(k%2?1:-1)*(55+k*6)/(1500+k*260)})}
  return{g:G,rings,beacons,traffic,tori:[[165*SC,300*SC,7*SC]],cyls:cyls.map(c=>c.map(v=>v*SC)),oboxes:ob,boxes:[],bay:P(0,RIM+330,34),land:P(0,RIM+310,2.6)}}
"""+F[j5:]
s=s[:i]+F+s[j:]
# oriented boxes in ship collision
rep("  if(!hit&&H.cyls)for(const[cx,cz,cr,y0,y1]of H.cyls){",
"""  if(!hit&&H.oboxes)for(const[cx,cy,cz,hx,hy,hz,an]of H.oboxes){const c2=Math.cos(an),s2=Math.sin(an),dx3=q.x-cx,dz3=q.z-cz,lx=dx3*c2-dz3*s2,lz=dx3*s2+dz3*c2,ly=q.y-cy;
    if(Math.abs(lx)<hx+r&&Math.abs(ly)<hy+r&&Math.abs(lz)<hz+r){const m=[hx+r-Math.abs(lx),hy+r-Math.abs(ly),hz+r-Math.abs(lz)],k=m.indexOf(Math.min(...m));let nx=lx,ny=ly,nz=lz;if(k===0)nx=Math.sign(lx||1)*(hx+r);else if(k===1)ny=Math.sign(ly||1)*(hy+r);else nz=Math.sign(lz||1)*(hz+r);
      q.x=cx+nx*c2+nz*s2;q.y=cy+ny;q.z=cz-nx*s2+nz*c2;hit=true;break}}
  if(!hit&&H.cyls)for(const[cx,cz,cr,y0,y1]of H.cyls){""")
# farther away, traffic flies, Meridian's guns fire from round the whole station
rep("const M=meridianModel(),mp=A.clone().addScaledVector(fw,8000);","const M=meridianModel(),mp=A.clone().addScaledVector(fw,10000);")
rep("function meriTick(S,dt){const M=S.meri;if(!M)return;","function meriTick(S,dt){const M=S.meri;if(!M)return;if(M.traffic)for(const q of M.traffic){q.a+=q.w*dt;const x=Math.sin(q.a)*q.r,z=Math.cos(q.a)*q.r,dx=Math.cos(q.a)*q.w,dz=-Math.sin(q.a)*q.w;q.g.position.set(x,q.y+Math.sin(q.a*3)*30,z);q.g.rotation.y=Math.atan2(-dx,-dz);shuttleAnim(q.g,70,false,0,8,1,false,dt)}")
rep("const from=mp.clone().add(new T.Vector3((Math.random()-.5)*120,(Math.random()-.5)*200,(Math.random()-.5)*120))","const from=mp.clone().add(new T.Vector3((Math.random()-.5)*1600,Math.random()*500,(Math.random()-.5)*1600))")
open(p,'w').write(s);print('ok')
