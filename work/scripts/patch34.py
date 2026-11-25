import re
p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:90]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]

between("   // two-storey shop blocks along both long walls, galleries on top","   // the atrium: planter with trees",r"""   // ---- the atrium tower: five storeys of ring floors around an open well, under the glass roof.
   // Stair wells alternate sides each level (west/east, then north/south), two bridges cross the well at level 3, a skybridge at level 5,
   // lift pads launch you up the well, and the wings either side stay full-height halls.
   {const X0=-52,X1=52,VX=36,VZ=15,LV=[5,10,15,20],LN=['MARKET','GARDENS','WORKSHOPS','SKYDECK'];c.arena={x0:-VX,x1:VX,z0:-VZ,z1:VZ};
    MAT.fascia=std({map:paint(256,(g,S)=>panels(g,S,'#a7b1b4',2)),roughness:.5,metalness:.4});
    MAT.deck=std({map:paint(256,(g,S)=>{g.fillStyle='#2a3436';g.fillRect(0,0,S,S);grime(g,S,1500,.06);for(let i=0;i<4;i++)for(let j=0;j<4;j++){g.fillStyle=(i+j)%2?'#303b3d':'#283133';g.fillRect(i*64+1,j*64+1,62,62)}
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
""")
rep("for(const sx of[-1,1])for(const sz of[-1,1]){const x=sx*40,z=sz*15;box(x,0,z,2,26,2,MAT.wallD);","for(const sx of[-1,1])for(const sz of[-1,1]){const x=sx*36,z=sz*15;box(x,0,z,2,26,2,MAT.wallD);")
rep("if(window.HABRING)HABRING.rotation.z+=dt*.012;","if(window.HABRING)HABRING.rotation.z+=dt*.012;if(window.AHOLO)AHOLO.rotation.y+=dt*.25;")
# boss stays in the well
rep("const pr=roomAt(pos.x,pos.z),H=pr&&pr.h>=24?pr:ROOMS.find(r=>r.n==='COMMONS');","const pr=roomAt(pos.x,pos.z),H0=pr&&pr.h>=24?pr:ROOMS.find(r=>r.n==='COMMONS'),H=H0.arena?{x0:H0.arena.x0-6,x1:H0.arena.x1+6,z0:H0.arena.z0-6,z1:H0.arena.z1+6}:H0;")
# menu shot and demo enemies inside the well
rep("cam.position.set(Math.sin(a)*14,9,30);cam.lookAt(0,7,-10)}","cam.position.set(Math.sin(a)*24,2.2,11);cam.lookAt(0,15,-9)}")
rep("function demo(){enemies.push(mk(0,-6,5,14),mk(0,4,6,12),mk(1,9,5,16),mk(5,-10,1,18),mk(6,8,1.3,20))}","function demo(){enemies.push(mk(0,-6,7,-2),mk(0,5,12,-6),mk(1,10,16,-8),mk(5,-12,1,-9),mk(6,13,1.3,-10))}")

# ---------- enemies follow you up the tower: ground troops walk to a clear shaft in the well and jet up; drones use the well too
rep("function groundTick(e,dt){","""const SHAFTS=[];for(const x of[-29,-8,8,29])for(const z of[-9,9])SHAFTS.push([x,z]);
function shaftFor(p){let b=SHAFTS[0],bd=1e9;for(const q of SHAFTS){const d=(q[0]-p.x)**2+(q[1]-p.z)**2;if(d<bd){bd=d;b=q}}return b}
const inCommons=p=>Math.abs(p.x)<107&&Math.abs(p.z)<39,inTower=p=>Math.abs(p.x)<54&&Math.abs(p.z)<39;
function groundTick(e,dt){""")
rep("  if(tgt){const tx=tgt.x-p.x,tz=tgt.z-p.z,tl=Math.hypot(tx,tz);if(tl>0.15){mx=tx/tl;mz=tz/tl}else{mx=0;mz=0}if(e.st==='move')sp*=1.35}\n  else if(e.jt>0){mx=dx/hd;mz=dz/hd;sp*=1.6}",
"""  const upT=P.jet&&pos.y>3.5&&inTower(pos)&&inCommons(p)&&pos.y-(p.y-e.r)>3;
  if(e.rise&&(pos.y-(p.y-e.r)<-1.5||(e.riseT-=dt)<=0||!inTower(pos)))e.rise=false;
  if(upT||e.rise){if(e.spot)release(e);tgt=null}
  if(tgt){const tx=tgt.x-p.x,tz=tgt.z-p.z,tl=Math.hypot(tx,tz);if(tl>0.15){mx=tx/tl;mz=tz/tl}else{mx=0;mz=0}if(e.st==='move')sp*=1.35}
  else if(e.rise){const ty=pos.y+e.r+.9;if(p.y<ty){e.jet=.25;mx=0;mz=0}else{e.jet=0;e.vy=Math.max(e.vy,0);mx=dx/hd;mz=dz/hd;sp=Math.max(sp,5.5);
      if(hd<2.5||Math.abs(p.x)>37.5||Math.abs(p.z)>16.5)e.rise=false}}
  else if(upT){const q=shaftFor(p),qx=q[0]-p.x,qz=q[1]-p.z,qd=Math.hypot(qx,qz);if(qd<1.3){e.rise=true;e.riseT=9;e.vy=5;e.jet=.25;mx=0;mz=0;sfx('jet')}else{mx=qx/qd;mz=qz/qd;sp*=1.25}}
  else if(e.jt>0){mx=dx/hd;mz=dz/hd;sp*=1.6}""")
rep("if(P.jet&&gr&&e.jcd<=0&&dy>3.5&&hd<26&&hd>2.5){e.jcd=7;","if(P.jet&&gr&&!upT&&!e.rise&&e.jcd<=0&&dy>3.5&&hd<26&&hd>2.5){e.jcd=7;")
# drones: when they cannot see you and you are on another level of the tower, go through the well
rep("    if(go){const sl=(e.slowT=(e.slowT||0)-dt)>0?.35:1;","    if(!see&&inTower(pos)&&inCommons(p)&&Math.abs(p.y-(pos.y+1.6))>2.5&&(pos.y>3.5||p.y>5)){const q=shaftFor(p),qx=q[0]-p.x,qz=q[1]-p.z,qd=Math.hypot(qx,qz);go=true;\n      if(qd>1.5){mx=qx/qd;mz=qz/qd;my=0}else{mx=0;mz=0;my=Math.sign(pos.y+1.6-p.y)}}\n    if(go){const sl=(e.slowT=(e.slowT||0)-dt)>0?.35:1;")

# ---------- the Blade: a moon-sized sword relic hanging over the station, seen through the atrium glass
rep("const halo=glow(0xffd8a8,4200,0.18);halo.position.set(...P);scene.add(halo);","""const halo=glow(0xffd8a8,4200,0.18);halo.position.set(...P);scene.add(halo);
 {const B=new T.Group(),bm=new T.MeshLambertMaterial({color:0xe9edf2,emissive:0x8fa6c8,emissiveIntensity:.55,fog:false,flatShading:true}),gm=new T.MeshLambertMaterial({color:0xcaa25a,emissive:0x8a5a1a,emissiveIntensity:.5,fog:false,flatShading:true});
  const blade=new T.Mesh(new T.CylinderGeometry(0,1,1,4,1),bm);blade.scale.set(95,1500,26);blade.position.y=830;B.add(blade);
  const root=new T.Mesh(new T.BoxGeometry(1,1,1),bm);root.scale.set(134,180,36);root.position.y=20;root.rotation.y=0;B.add(root);
  const guard=new T.Mesh(new T.BoxGeometry(1,1,1),gm);guard.scale.set(560,60,80);guard.position.y=-90;B.add(guard);for(const sx of[-1,1]){const t=new T.Mesh(new T.CylinderGeometry(0,1,1,4,1),gm);t.scale.set(45,150,45);t.position.set(sx*300,-30,0);B.add(t)}
  const grip=new T.Mesh(new T.CylinderGeometry(1,1,1,8),gm);grip.scale.set(34,380,34);grip.position.y=-300;B.add(grip);const pom=new T.Mesh(new T.OctahedronGeometry(1),gm);pom.scale.set(80,90,80);pom.position.y=-520;B.add(pom);
  const line=new T.Mesh(new T.BoxGeometry(1,1,1),bas({color:0xbfe9ff,fog:false}));line.scale.set(8,1380,30);line.position.y=770;B.add(line);
  for(const[y,sz,o]of[[1500,900,.5],[700,2600,.22],[-90,1100,.3]]){const q=glow(0xcfe6ff,sz,o);q.position.y=y;B.add(q)}
  B.position.set(700,4300,-2300);B.rotation.set(1.05,.5,.35);scene.add(B);farAnim.push(dt=>{B.rotation.y+=dt*.004})}""")

# ---------- lore: the Blade and the Dark
s2=re.sub(r'<p id="ovText">.*?</p>','<p id="ovText">Year 2687. The Blade, a relic the size of a moon, hangs in our sky. It gave humanity a golden age, and it drew the Dark. The Dark struck first by taking our machines. Thalassa, a military farm station above Europa, just lost its AI.</p>',s,count=1,flags=re.S);assert s2!=s;s=s2
s2=re.sub(r"""\['R',"Thalassa is one of the last stations still holding\.[^"]*"\]""","""['R',"Look up through the atrium glass. That's the Blade. It gave us the golden age, and the Dark came for it. Taking our machines was only its first move."],
    ['R',"This station is five storeys of floors around an open well. The machines will come up it after you, so keep moving."]""",s,count=1);assert s2!=s;s=s2
open(p,'w').write(s);print('ok',len(s))
