p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
i=s.index("function shuttleModel(){");j=s.index("function interceptorModel(){")
s=s[:i]+r"""// the shuttle Kestrel (original design): sculpted hull with panel lines and markings, glass canopy, swept wings with flaps and
// navigation lights, twin canted fins, two engines with intakes and live flames, wing gun pods, missile rails, a belly cannon
let SHM=null;
function shuttleMats(){if(SHM)return SHM;
  const hullT=paint(512,(g,S)=>{g.fillStyle='#d9dde0';g.fillRect(0,0,S,S);grime(g,S,4000,.035);g.strokeStyle='rgba(30,38,44,.55)';g.lineWidth=2;
    for(let k=0;k<=8;k++){g.beginPath();g.moveTo(0,k*S/8);g.lineTo(S,k*S/8);g.stroke()}for(let r=0;r<8;r++)for(let k=0;k<=4;k++){const x=(k+(r%2)*.5)*S/4;g.beginPath();g.moveTo(x,r*S/8);g.lineTo(x,(r+1)*S/8);g.stroke()}
    g.fillStyle='rgba(30,38,44,.45)';for(let r=0;r<8;r++)for(let k=0;k<16;k++){g.beginPath();g.arc(k*S/16+4,r*S/8+5,1.6,0,7);g.fill()}
    g.fillStyle='rgba(0,0,0,.12)';for(let k=0;k<10;k++){const x=hash(k,5)*S,y=hash(k,6)*S;g.fillRect(x,y,30+hash(k,7)*50,10+hash(k,8)*24)}});
  hullT.repeat.set(.6,.6);
  const darkT=paint(256,(g,S)=>{g.fillStyle='#3b4247';g.fillRect(0,0,S,S);grime(g,S,2500,.06);g.strokeStyle='rgba(0,0,0,.5)';g.lineWidth=2;for(let k=0;k<=4;k++){g.beginPath();g.moveTo(0,k*S/4);g.lineTo(S,k*S/4);g.stroke();g.beginPath();g.moveTo(k*S/4,0);g.lineTo(k*S/4,S);g.stroke()}
    g.strokeStyle='rgba(0,0,0,.35)';for(let k=0;k<24;k++){g.beginPath();g.moveTo(0,k*S/24+3);g.lineTo(S*.4,k*S/24+3);g.stroke()}});
  const decal=paint(512,(g,S)=>{g.clearRect(0,0,S,S);g.fillStyle='#e0702a';g.fillRect(0,S*.62,S,S*.07);g.fillRect(0,S*.72,S*.55,S*.025);g.fillStyle='rgba(24,30,36,.9)';g.font='700 '+Math.round(S*.15)+'px "Chakra Petch",sans-serif';g.fillText('KESTREL',S*.04,S*.5);
    g.font='600 '+Math.round(S*.06)+'px monospace';g.fillText('TH-09 · S2 · THALASSA FLEET',S*.05,S*.86);g.fillStyle='#e0702a';for(let k=0;k<5;k++){g.beginPath();g.moveTo(S*(.62+k*.07),S*.36);g.lineTo(S*(.66+k*.07),S*.36);g.lineTo(S*(.63+k*.07),S*.44);g.lineTo(S*(.59+k*.07),S*.44);g.fill()}},true);
  SHM={hull:std({map:hullT,normalMap:normalMap(hullT,2.2),roughness:.42,metalness:.35}),dark:std({map:darkT,roughness:.55,metalness:.6}),
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
  add(planform([[-.25,6.6],[-.9,5],[-1.45,2.4],[-1.6,-1],[-1.75,-4],[-1.3,-5.2],[1.3,-5.2],[1.75,-4],[1.6,-1],[1.45,2.4],[.9,5],[.25,6.6]],.95,.32),M.hull,0,0,0);
  add(planform([[-.18,4.6],[-.75,2.8],[-1.05,0],[-1.1,-3.6],[-.8,-4.8],[.8,-4.8],[1.1,-3.6],[1.05,0],[.75,2.8],[.18,4.6]],.5,.22),M.hull,0,.68,0);
  add(planform([[-1.2,1.5],[-1.4,-3],[-1.1,-4.9],[1.1,-4.9],[1.4,-3],[1.2,1.5]],.35,.12),M.dark,0,-.72,0);
  for(const sx of[-1,1]){const d=add(GEO.plane,M.decal,sx*1.78,.05,.2,0,sx*Math.PI/2,0,5.2,1.6,1);d.castShadow=false}
  add(GEO.box,M.trim,0,.98,-.4,0,0,0,.14,.04,6.8);
  // canopy with a frame
  add(GEO.sph,M.glass,0,.95,3.0,0,0,0,.72,.42,1.55);for(const z of[2.2,3.0,3.8])add(GEO.box,M.dark,0,1.12,z,0,0,0,1.0,.06,.07);add(GEO.box,M.dark,0,1.22,3.0,0,0,0,.07,.06,1.7);
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
    add(planform([[0,.6],[sx*.0,-.1],[0,-2.1],[0,-2.6]].map(([x,z],k)=>[x,z]),.12,.04),M.hull,sx*1.15,.9,4.6,0,0,0);
    const fin=add(planform([[0,0],[1.7,-.9],[1.9,-1.9],[.3,-2.2]],.12,.05),M.hull,sx*1.1,.75,3.2,0,0,0);fin.rotation.set(0,0,sx*(Math.PI/2-.35));fin.scale.set(1,1,sx);
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
  for(const q of U.flames)q.scale.setScalar((1.6+k*2.4)*(boost?1.7:1)*(.9+Math.random()*.2));
  if(U.msls)U.msls.forEach((m,i)=>m.visible=i<Math.ceil(msl/2));
  const ready=mac<=0;for(const c of U.coils)c.material.emissiveIntensity=ready?.9+Math.sin(time*6)*.3:.15;
  for(const f of U.flaps)f.rotation.x=-roll*.5*f.userData.flap;
  const bl=(time%1.2)<.08;for(const s of U.strobe||[])s.visible=bl;for(const n of U.nav||[])n.material.opacity=.6+.3*Math.sin(time*3);
  U.gear.scale.y+=((gearDown?1:0.01)-U.gear.scale.y)*Math.min(1,dt*3);U.gear.visible=U.gear.scale.y>.05}
"""+s[j:]
rep("for(const q of S.g.userData.flames)q.scale.setScalar((1.2+S.spd/60)*(bk?1.8:1)*(.9+Math.random()*.2));","shuttleAnim(S.g,S.spd,bk,S.roll,S.msl,S.mac,S.ph==='hangar'&&S.spd<10,dt);")
open(p,'w').write(s);print('ok')
