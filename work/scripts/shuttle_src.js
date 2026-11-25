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
  SHM={hull:PBR.use(std({map:hullT,normalMap:hullN,roughness:.38,metalness:.35}),'plates',{rep:.6}),dark:std({map:darkT,roughness:.55,metalness:.6}),
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
