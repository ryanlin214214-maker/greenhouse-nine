p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1 and s.count(b)==1,(s.count(a),s.count(b),a[:60]);i=s.index(a);j=s.index(b);assert i<j;s=s[:i]+new+s[j:]
# ---------- lighting: a mood per room and a small pool of real lamps that follows the player
rep("scene.add(new T.HemisphereLight(0xdce8f0,0x8a9498,1.15));","""const hemi=new T.HemisphereLight(0xdce8f0,0x8a9498,1.15);scene.add(hemi);
const POOL=[];{const n=lowFx?3:5;for(let i=0;i<n;i++){const L=new T.PointLight(0xffffff,0,26,1.5);scene.add(L);POOL.push({L,f:null,k:0})}}
let fixT=0;
function lightTick(dt){const p=cam.position,r=inHull(p.x,p.z)&&p.y<32?roomAt(p.x,p.z):null,m=MOODS[r?MOODK[r.n]:'X'],a=Math.min(1,dt*2.5);
  hemi.intensity+=(m.hi-hemi.intensity)*a;hemi.color.lerp(m.skyC,a);hemi.groundColor.lerp(m.grC,a);
  fixT-=dt;if(fixT<=0){fixT=.2;for(const f of FIX)f.d=(f.x-p.x)**2+4*(f.y-p.y)**2+(f.z-p.z)**2;FIX.sort((u,v)=>u.d-v.d);for(let i=0;i<FIX.length;i++)FIX[i].top=i<POOL.length}
  for(const q of POOL){if(q.f&&q.f.top)q.k=Math.min(1,q.k+dt*3);else{q.k=Math.max(0,q.k-dt*3);if(q.k<=0){const f=FIX.find(f=>f.top&&!f.used);if(q.f)q.f.used=false;q.f=f||null;if(f){f.used=true;q.L.position.set(f.x,f.y,f.z);q.L.color.setHex(f.c);q.L.distance=f.r}}}
    q.L.intensity=q.f?q.f.i*q.k:0}}""")
rep("  padTick(dt);\n  if(state==='playing'){update(","  padTick(dt);lightTick(dt);\n  if(state==='playing'){update(")
rep("for(const[x,y,z,c,i,d]of lowFx?lamps.slice(0,3):lamps)","for(const[x,y,z,c,i,d]of lowFx?lamps.slice(0,1):lamps.slice(0,3))")
rep("{n:'FORE SPINE',x0:-9,x1:9,z0:-159,z1:-41,h:10}","{n:'FORE SPINE',x0:-9,x1:9,z0:-159,z1:-41,h:5.6}")
rep("{n:'AFT SPINE',x0:-9,x1:9,z0:41,z1:149,h:10}","{n:'AFT SPINE',x0:-9,x1:9,z0:41,z1:149,h:5.6}")
# ---------- moods, fixtures, and the materials of the new look
rep("function inHull(x,z){return Math.abs(x)<AX&&z>-AZ&&z<AZ}","""function inHull(x,z){return Math.abs(x)<AX&&z>-AZ&&z<AZ}
// A = bright and clean, B = dark with orange light, F = the farms under glass, X = outside the hull
const FIX=[],MOODS={A:{hi:.6,sky:0xdce8f0,gr:0x4a5256,lc:0xe6f2ff,li:1},B:{hi:.3,sky:0xcbd6dc,gr:0x1c2226,lc:0xff9548,li:1.6},F:{hi:.8,sky:0xdcf0e4,gr:0x56625a,lc:0xf0ffe8,li:.8},X:{hi:1.15,sky:0xdce8f0,gr:0x8a9498}},
  MOODK={'BRIDGE':'A','COMMONS':'A','HABITAT':'A','PORT FARMS':'F','STARBOARD FARMS':'F','FORE SPINE':'B','AFT SPINE':'B','ENGINEERING':'B','HANGAR':'B'};
for(const k in MOODS){const m=MOODS[k];m.skyC=new T.Color(m.sky);m.grC=new T.Color(m.gr)}
const fix=(x,y,z,mk,r=26)=>FIX.push({x,y,z,c:MOODS[mk].lc,i:MOODS[mk].li,r,top:false,used:false});
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
const mkLin=(mo,tag,sub,rx,ry)=>{const t=linerTex(mo,tag,sub);t.repeat.set(rx,ry);return std({map:t,roughness:.5,metalness:.25})};
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
MAT.laneA=std({color:0x59646a,roughness:.5,metalness:.3});MAT.laneB=std({color:0x353d41,roughness:.45,metalness:.35});MAT.laneF=std({color:0x4c574f,roughness:.6,metalness:.25});
for(const m of[MAT.laneA,MAT.laneB,MAT.laneF]){m.polygonOffset=true;m.polygonOffsetFactor=-4;m.polygonOffsetUnits=-4;m.userData.noShadow=true}
MAT.stripA=bas({color:0xf2fbff});MAT.stripB=bas({color:0xffb070});MAT.barO=bas({color:0xe0702a});MAT.barC=bas({color:0x46c8e0});for(const m of[MAT.stripA,MAT.stripB,MAT.barO,MAT.barC])m.userData.noShadow=true;
function hullPanels(g,S,base){g.fillStyle=base;g.fillRect(0,0,S,S);grime(g,S,S*5,.04);const seam='rgba(18,26,30,.55)',lw=Math.max(1.5,S/220);
  g.strokeStyle=seam;g.lineWidth=lw;g.strokeRect(lw/2,lw/2,S-lw,S-lw);g.beginPath();g.moveTo(0,S*.34);g.lineTo(S,S*.34);g.moveTo(S*.62,S*.34);g.lineTo(S*.62,S);g.stroke();
  g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=1;g.beginPath();g.moveTo(lw*2,S*.34+lw);g.lineTo(S-lw*2,S*.34+lw);g.stroke();
  g.fillStyle='rgba(0,0,0,.12)';g.fillRect(S*.68,S*.42,S*.22,S*.12);g.strokeStyle=seam;for(let k=0;k<4;k++){g.beginPath();g.moveTo(S*.7,S*(.445+k*.025));g.lineTo(S*.88,S*(.445+k*.025));g.stroke()}
  g.fillStyle='rgba(208,112,46,.85)';g.fillRect(S*.05,S*.29,S*.08,S*.02);
  g.fillStyle='rgba(18,26,30,.5)';for(const[x,y]of[[.03,.03],[.97,.03],[.03,.31],[.97,.31],[.03,.37],[.59,.37],[.65,.37],[.97,.37],[.03,.97],[.59,.97],[.65,.97],[.97,.97]]){g.beginPath();g.arc(S*x,S*y,S*.007,0,7);g.fill()}}""")
rep("hull:paint(lowFx?256:512,(g,S)=>plating(g,S,'#b4bcbe','#d0702e','D9-04')),","hull:paint(lowFx?256:512,(g,S)=>hullPanels(g,S,'#aeb6b9')),")
rep("TX.hull.repeat.set(.5,.5);MAT.hull.normalMap.repeat.set(.5,.5);","TX.hull.repeat.set(.25,.25);MAT.hull.normalMap.repeat.set(.25,.25);")
rep("MAT.frame=std({color:0xd3d9da,roughness:.42,metalness:.35});","MAT.frame=std({color:0x39464c,roughness:.5,metalness:.3});")
# ---------- spines become low corridors: lower doors, dark ceilings
rep("wall('z',-160,-AX,AX,22,[[0,14,9,'c']]);","wall('z',-160,-AX,AX,22,[[0,10,4.6,'c']]);")
rep("wall('z',-40,-AX,AX,26,[[0,14,9,'a'],","wall('z',-40,-AX,AX,26,[[0,10,4.6,'a'],")
rep("wall('z',40,-AX,AX,26,[[0,14,9,'a'],","wall('z',40,-AX,AX,26,[[0,10,4.6,'a'],")
rep("wall('z',150,-AX,AX,30,[[0,16,9,'r'],","wall('z',150,-AX,AX,30,[[0,10,4.6,'r'],")
rep("wall('x',-10,-160,-40,22,[[-100,10,8,'g']]);wall('x',10,-160,-40,22,[[-100,10,8,'g']]);","wall('x',-10,-160,-40,22,[[-100,6,4.6,'g']]);wall('x',10,-160,-40,22,[[-100,6,4.6,'g']]);")
rep("wall('x',-10,40,150,24,[[95,8,7,'v']]);wall('x',10,40,150,24,[[95,10,8,'o']]);","wall('x',-10,40,150,24,[[95,6,4.6,'v']]);wall('x',10,40,150,24,[[95,6,4.6,'o']]);")
rep("for(const r of ROOMS)if(r.n!=='COMMONS'&&!/FARMS/.test(r.n))roof(r);","for(const r of ROOMS)if(r.n!=='COMMONS'&&!/FARMS/.test(r.n))roof(r,MOODK[r.n]==='B'?MAT.roofB:MAT.roof);")
rep("ribs(R['FORE SPINE'],8,'z',TRIM.c);ribs(R['AFT SPINE'],8,'z',TRIM.a);","")
rep("for(const r of ROOMS)lightRow(r,","for(const r of ROOMS)if(!/SPINE/.test(r.n))lightRow(r,")
between("// spine: cover crates and wall panels","// ---- the exterior: an original long-hull colony ship.","""// spines: low service corridors. A bulkhead ring every 8 m with solid legs for cover, panelled liners, a dark deck with a lit walkway,
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
   for(let z=r.z0+12;z<r.z1-6;z+=22){box(-3.6,0,z,2.4,1.4,3,MAT.crateB);box(3.6,0,z+11,2.4,1.4,3,MAT.crateA)}}
 """)
# ---------- floors without checks
rep("for(let i=0;i<n;i++)for(let j=0;j<n;j++){g.fillStyle=(i+j)%2?b:a;g.fillRect(i*S/n+1,j*S/n+1,S/n-2,S/n-2);","for(let i=0;i<n;i++)for(let j=0;j<n;j++){g.fillStyle=b;g.fillRect(i*S/n+1,j*S/n+1,S/n-2,S/n-2);")
rep("tileMat('#6f7c82','#7a878d','rgba(40,150,175,.7)','ring')","tileMat('#2c3438','#3c454a','rgba(40,150,175,.7)','ring')")
rep("tileMat('#6d7a70','#78857a','rgba(50,140,70,.6)','grate')","tileMat('#2a322c','#3a443c','rgba(50,140,70,.6)','grate')",2)
rep("tileMat('#77727f','#827d8a','rgba(120,80,190,.6)','')","tileMat('#2f2d35','#403e48','rgba(120,80,190,.6)','')")
rep("tileMat('#7c746e','#877f79','rgba(208,112,46,.7)','grate')","tileMat('#1b1d1f','#272a2c','rgba(208,112,46,.7)','grate')")
rep("tileMat('#6c7275','#777d80','rgba(200,70,60,.55)','hazard')","tileMat('#191c1e','#24292c','rgba(200,70,60,.4)','hazard')")
rep("MAT.tile=std({map:paint(512,(g,S)=>{g.fillStyle='#727e82';g.fillRect(0,0,S,S);grime(g,S,2500,.05);for(let i=0;i<8;i++)for(let j=0;j<8;j++){g.fillStyle=(i+j)%2?'#7e8a8e':'#727e82';","MAT.tile=std({map:paint(512,(g,S)=>{g.fillStyle='#2c3438';g.fillRect(0,0,S,S);grime(g,S,2500,.05);for(let i=0;i<8;i++)for(let j=0;j<8;j++){g.fillStyle='#3c454a';")
rep("MAT.deck=std({map:paint(256,(g,S)=>{g.fillStyle='#737f83';g.fillRect(0,0,S,S);grime(g,S,1500,.05);for(let i=0;i<4;i++)for(let j=0;j<4;j++){g.fillStyle=(i+j)%2?'#869195':'#7a868a';","MAT.deck=std({map:paint(256,(g,S)=>{g.fillStyle='#454f53';g.fillRect(0,0,S,S);grime(g,S,1500,.05);for(let i=0;i<4;i++)for(let j=0;j<4;j++){g.fillStyle='#5b666b';")
# ---------- room dressing: one panelled bay every 6 m, darker cladding above, pilasters, walkways and hanging lamps
between("for(const r of ROOMS){if(r.n==='COMMONS')continue;const fm=FL[r.n],tr=TR[r.n];if(fm)box(","// HANGAR: landing pads","""for(const r of ROOMS){if(r.n==='COMMONS'||/SPINE/.test(r.n))continue;const fm=FL[r.n],tr=TR[r.n],mk=MOODK[r.n],dk=mk==='B',lm=dk?MAT.linB:MAT.linA,up=dk?MAT.upB:MAT.upA,pil=dk?MAT.ringP:MAT.ringD;
    if(fm)box((r.x0+r.x1)/2,.01,(r.z0+r.z1)/2,r.x1-r.x0,.03,r.z1-r.z0,fm,false);
    {const cx=(r.x0+r.x1)/2,cz=(r.z0+r.z1)/2,lx=r.x1-r.x0-6,lz=r.z1-r.z0-6,ln=MAT['lane'+mk];box(cx,.035,cz,lx,.02,4,ln,false);box(cx,.035,cz,4,.02,lz,ln,false);
      for(const o of[-1,1]){box(cx,.04,cz+o*2,lx,.02,.12,tr,false);box(cx+o*2,.04,cz,.12,.02,lz,tr,false)}}
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
  """)
between("// SPINES: hex wall plates and floor guide lines","verifyStairs();","}\n}\n")
open(p,'w').write(s);print('ok',len(s))
