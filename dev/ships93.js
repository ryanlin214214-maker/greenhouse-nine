// ---- v93: the ship roster. Original designs in the Kestrel's family (ivory hull, dark panels, orange Thalassa trim),
// each with its own silhouette for its role. Forward is -z, up +y. Every model carries the same hooks the Kestrel has
// (flames, flame cones, gear that folds, missiles that disappear as fired, nav lights, strobes, flaps) plus mz (gun
// muzzles), gy (height of the origin above the wheels), and role parts (bomb bay, ion core, radome).
function shipKitMats(){const M=shuttleMats();if(M.k93)return M.k93;const c=(h,r,m,e,ei)=>std({color:h,roughness:r,metalness:m,emissive:e||0,emissiveIntensity:ei||0});
  return M.k93={armor:c(0x59605a,.5,.55),armorD:c(0x2b3034,.55,.6),blue:c(0x3a78c8,.4,.45),red:c(0xa83a2a,.42,.35),olive:c(0x6b6a4a,.55,.4),violet:c(0x5a4590,.38,.5),teal:c(0x2f9a9a,.4,.45),
    cap:c(0x3a3050,.3,.6,0x8a6cff,.9),capC:c(0x1f3a48,.3,.6,0x46d0ff,1.1),bay:c(0x1a1d20,.7,.5),warn:c(0xd8a420,.45,.3),radome:c(0xdfe6ea,.35,.2),lens:c(0x0a1820,.08,.9,0x2a6a8a,.6),
    ionA:bas({color:0x9fe8ff,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,fog:false}),ionB:bas({color:0xffffff,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,fog:false})}}
function shipBuilder(){const M=shuttleMats(),K=shipKitMats(),g=new T.Group(),U={flames:[],cones:[],coils:[],msls:[],nav:[],strobe:[],flaps:[],mz:[]};
  const add=(geo,mat,x=0,y=0,z=0,rx=0,ry=0,rz=0,sx=1,sy=1,sz=1,par)=>{const o=new T.Mesh(geo,mat);o.position.set(x,y,z);o.rotation.set(rx,ry,rz);o.scale.set(sx,sy,sz);o.castShadow=true;(par||g).add(o);return o};
  const lat=(pr,seg)=>new T.LatheGeometry(pr.map(([r,y])=>new T.Vector2(r,y)),seg||24);
  // a fuselage from a side profile [radius, z]: lathed, then flattened / widened by sy / sx
  const fus=(pr,mat,x,y,z,sx,sy)=>add(lat(pr.map(([r,zz])=>[r,zz]),28),mat,x,y,z,Math.PI/2,0,0,sx,1,sy);
  // an engine: nacelle, intake ring, petal nozzle, inner glow, two flame cones and a glow sprite; returns the nozzle z
  const engine=(x,y,z0,z1,r,col)=>{const L=z1-z0,pr=[[0,-L/2],[r*.8,-L/2],[r*.97,-L/2+L*.12],[r,0],[r*.95,L/2-L*.1],[r*.82,L/2]];add(lat(pr,20),M.hull,x,y,(z0+z1)/2,-Math.PI/2,0,0);
    add(GEO.tor,M.dark,x,y,z0+.05,0,0,0,r*.85,r*.85,r*.85);add(GEO.cyl,M.burnt,x,y,z1+.18,Math.PI/2,0,0,r*.78,.45,r*.78);
    for(let k=0;k<8;k++){const a=k/8*6.283;add(GEO.box,M.dark,x+Math.cos(a)*r*.86,y+Math.sin(a)*r*.86,z1+.3,0,0,a,.06,r*.3,.5)}
    const ig=add(GEO.cyl,M.glowC,x,y,z1+.4,Math.PI/2,0,0,r*.6,.04,r*.6);ig.castShadow=false;
    const c1=new T.Mesh(GEO.cone,M.flameA),c2=new T.Mesh(GEO.cone,M.flameB);for(const c of[c1,c2]){c.rotation.x=-Math.PI/2;c.position.set(x,y,z1+.42);g.add(c)}c1.scale.set(r*.5,2,r*.5);c2.scale.set(r*.78,3,r*.78);U.cones.push([c1,c2,r]);
    const q=glow(col||0x7fd8ff,r*4,.85);q.position.set(x,y,z1+.9);g.add(q);U.flames.push(q);return z1};
  const navL=(x,y,z,side)=>{const nl=add(GEO.sph,side<0?M.red:M.green,x,y,z,0,0,0,.14,.14,.14);nl.castShadow=false;const ng=glow(side<0?0xff3030:0x30ff70,1.4,.9);ng.position.copy(nl.position);g.add(ng);U.nav.push(ng)};
  const strobe=(x,y,z)=>{const s=add(GEO.sph,M.white,x,y,z,0,0,0,.08,.08,.08);s.castShadow=false;U.strobe.push(s)};
  const gunB=(x,y,z,len,rad,mat)=>{add(GEO.cyl,mat||M.metal,x,y,z-len/2,Math.PI/2,0,0,rad,len,rad);add(GEO.cyl,M.dark,x,y,z-len+.05,Math.PI/2,0,0,rad*1.5,.22,rad*1.5);U.mz.push([x,y,z-len-.1])};
  const missile=(x,y,z,s,par)=>{const m=new T.Group();m.position.set(x,y,z);(par||g).add(m);const b=new T.Mesh(GEO.cyl,M.msl);b.rotation.x=Math.PI/2;b.scale.set(.12*s,1.9*s,.12*s);m.add(b);
    const t=new T.Mesh(GEO.cone,M.mslTip);t.rotation.x=-Math.PI/2;t.scale.set(.12*s,.35*s,.12*s);t.position.z=-1.12*s;m.add(t);for(const a of[0,1,2,3]){const fn=new T.Mesh(GEO.box,M.dark);fn.scale.set(.02,.22*s,.25*s);fn.position.set(Math.cos(a*1.571)*.12*s,Math.sin(a*1.571)*.12*s,.8*s);fn.rotation.z=a*1.571;m.add(fn)}U.msls.push(m);return m};
  // landing gear: legs from the belly (y0) to wheels whose bottom is at yb; the group folds up to y 0
  const gear=new T.Group();g.add(gear);U.gear=gear;
  const leg=(x,z,y0,yb,w)=>{const L=y0-yb-w*2;const l=new T.Mesh(GEO.cyl,M.metal);l.scale.set(.09,L,.09);l.position.set(x,yb+w*2+L/2,z);gear.add(l);
    const st=new T.Mesh(GEO.box,M.dark);st.scale.set(.06,L*.7,.3);st.position.set(x,yb+w*2+L*.45,z+.18);gear.add(st);
    const wh=new T.Mesh(GEO.cyl,M.burnt);wh.rotation.z=Math.PI/2;wh.scale.set(w,.22,w);wh.position.set(x,yb+w,z);gear.add(wh);const hb=new T.Mesh(GEO.cyl,M.metal);hb.rotation.z=Math.PI/2;hb.scale.set(w*.45,.24,w*.45);hb.position.copy(wh.position);gear.add(hb)};
  const fin=(pts,th,mat,x,y,z,rz)=>{const f=add(planform(pts,th,th*.4),mat||M.hull,x,y,z);f.rotation.set(0,0,rz);return f};
  const flap=(x,y,z,w,d,side)=>{const f=add(GEO.box,M.dark,x,y,z,0,0,0,w,.08,d);f.userData.flap=side;U.flaps.push(f);return f};
  const done=(sc,gy)=>{U.gy=gy;g.userData=U;g.rotation.order='YXZ';g.scale.setScalar(sc);g.userData.sc=sc;return g};
  return{M,K,g,U,add,lat,fus,engine,navL,strobe,gunB,missile,leg,fin,flap,done,wing:(pts,th,mat,x,y,z,rz)=>add(planform(pts,th,th*.3),mat||M.hull,x,y,z,0,0,rz||0)}}

// Interceptor: a needle fuselage, a single big engine, cropped delta wings swept hard, canards, one tall fin and two
// ventral strakes, a bubble canopy far forward, nose guns, two short-range missiles on each wingtip.
function interceptorShip(){const B=shipBuilder(),{M,K,add}=B;
  B.fus([[0,-6.4],[.22,-6],[.45,-5.1],[.62,-3.8],[.74,-2],[.8,0],[.8,2.6],[.72,3.9],[.7,4.4]],M.hull,0,.15,0,1.15,.9);
  add(planform([[-.18,5.6],[-.7,3.6],[-.95,1.2],[-1,-2.8],[-.75,-4.4],[.75,-4.4],[1,-2.8],[.95,1.2],[.7,3.6],[.18,5.6]],.18,.07),M.hull,0,-.38,0);
  add(planform([[-.5,1.2],[-.7,-2.6],[.7,-2.6],[.5,1.2]],.3,.1),K.blue,0,.86,0);add(GEO.box,M.trim,0,1.02,-.6,0,0,0,.1,.04,3.6);
  add(GEO.sph,M.glass,0,.82,-3.3,0,0,0,.5,.42,1.25);for(const z of[-2.6,-3.4])add(GEO.box,M.dark,0,1.0,z,0,0,0,.7,.05,.06);
  for(const sx of[-1,1]){B.wing([[0,1.4],[sx*3.6,-2.0],[sx*3.9,-2.9],[sx*3.7,-3.3],[0,-3.3]],.16,M.hull,sx*.7,-.15,.8);
    add(GEO.box,K.blue,sx*2.2,-.06,1.2,0,sx*.75,0,.1,.06,2.6);B.flap(sx*2.3,-.2,4.0,2.0,.4,sx);
    B.wing([[0,.6],[sx*1.3,-.2],[sx*1.3,-.5],[0,-.6]],.08,M.hull,sx*.55,.1,-3.6);
    add(GEO.box,M.dark,sx*4.55,-.15,3.1,0,0,0,.1,.12,2.4);for(const k of[0,1])B.missile(sx*(4.62+(k?.0:0)),-.15+(k?.26:-.26),3.0,.8);
    B.navL(sx*4.65,-.15,1.7,sx);
    const st=add(planform([[0,0],[.9,-.6],[1.0,-1.6],[.2,-1.7]],.08,.03),M.hull,sx*.45,-.6,3.2);st.rotation.set(0,0,sx>0?-Math.PI/2-.5:-Math.PI/2+.5);
    B.gunB(sx*.62,.05,-3.8,1.5,.06)}
  const fn=add(planform([[0,0],[2.2,-1.4],[2.5,-2.5],[.4,-2.7]],.12,.05),M.hull,0,.85,2.0);fn.rotation.set(0,0,Math.PI/2);add(GEO.box,K.blue,0,2.3,4.0,0,0,0,.06,.4,1.1);B.strobe(0,3.2,4.6);
  B.engine(0,.15,2.6,5.4,.78,0x8fd8ff);for(const sx of[-1,1])add(GEO.box,M.dark,sx*.9,.0,-1.2,0,sx*.08,0,.3,.42,1.6);
  B.leg(0,-3.6,-.3,-1.65,.2);B.leg(-1.3,1.6,-.35,-1.65,.26);B.leg(1.3,1.6,-.35,-1.65,.26);
  return B.done(1,1.65)}
// Multirole: side intakes, trapezoid wings, twin canted tails, two engines, wing-root guns, two pylons a side, the belly
// mass-accelerator cannon (the Kestrel's heavy weapon) under the centreline.
function multiroleShip(){const B=shipBuilder(),{M,K,add}=B;
  B.fus([[0,-7.2],[.3,-6.7],[.62,-5.6],[.86,-4.2],[1.0,-2.2],[1.05,0],[1.0,3.0],[.9,5.0],[.84,5.6]],M.hull,0,.2,0,1.25,.82);
  add(planform([[-.3,6.4],[-1.1,4.4],[-1.7,2.0],[-1.9,-1.6],[-1.95,-4.6],[-1.6,-5.4],[1.6,-5.4],[1.95,-4.6],[1.9,-1.6],[1.7,2.0],[1.1,4.4],[.3,6.4]],.24,.1),M.hull,0,-.25,0);
  add(planform([[-.55,2.6],[-.75,-3.8],[.75,-3.8],[.55,2.6]],.36,.14),K.red,0,.92,-.2);add(GEO.box,M.trim,0,1.12,-.5,0,0,0,.1,.04,5.2);
  add(GEO.sph,M.glass,0,1.02,-3.9,0,0,0,.62,.45,1.5);for(const z of[-3.1,-3.9,-4.7])add(GEO.box,M.dark,0,1.22,z,0,0,0,.85,.06,.07);
  for(const sx of[-1,1]){add(GEO.box,M.dark,sx*1.5,-.05,-1.8,0,0,0,.7,.8,2.4);add(GEO.box,M.burnt,sx*1.5,-.05,-3.0,0,0,0,.6,.7,.08);
    B.wing([[0,2.2],[sx*5.0,-.8],[sx*5.2,-2.2],[0,-3.4]],.2,M.hull,sx*1.6,-.2,.6);add(GEO.box,M.trim,sx*3.7,-.11,.3,0,sx*.52,0,.1,.08,3.2);
    B.flap(sx*3.7,-.24,3.75,2.6,.5,sx);B.navL(sx*6.75,-.18,2.6,sx);
    for(const px of[3.2,4.6]){add(GEO.box,M.dark,sx*px,-.5,.9,0,0,0,.12,.3,1.6);B.missile(sx*px,-.78,.9,1)}
    B.gunB(sx*1.95,.25,-2.4,1.4,.06);
    const tf=add(planform([[0,0],[1.9,-1.0],[2.1,-2.2],[.3,-2.5]],.12,.05),M.hull,sx*1.2,.85,3.6);tf.rotation.set(0,0,sx>0?Math.PI/2-.42:Math.PI/2+.42);
    add(GEO.box,K.red,sx*1.62,2.05,5.35,0,0,sx*-.42,.06,.45,1.2);B.strobe(sx*2.05,2.55,5.7);
    B.engine(sx*.78,.15,3.4,6.4,.6,0x8fd8ff)}
  add(GEO.box,M.dark,0,-.85,.4,0,0,0,.8,.4,3.8);add(GEO.cyl,M.metal,0,-.88,-3.0,Math.PI/2,0,0,.16,3.8,.16);for(let k=0;k<4;k++){const c=add(GEO.tor,M.coil,0,-.88,-1.5-k*.7,0,0,0,.27,.27,.27);c.castShadow=false;B.U.coils.push(c)}
  B.leg(0,-4.2,-.4,-1.9,.24);B.leg(-1.6,1.8,-.45,-1.9,.3);B.leg(1.6,1.8,-.45,-1.9,.3);
  return B.done(1,1.9)}
// Bomber: a broad lifting body and thick blended wings (26 m span), four engines buried in the trailing edge, a raised
// cockpit, armour panels, a nose gun turret, and a belly bay with two doors and four torpedoes on racks.
function bomberShip(){const B=shipBuilder(),{M,K,add}=B,U=B.U;
  add(planform([[-.6,11],[-2.6,8.6],[-4.2,5],[-5.0,0],[-5.0,-6.8],[-3.8,-8.6],[3.8,-8.6],[5.0,-6.8],[5.0,0],[4.2,5],[2.6,8.6],[.6,11]],1.7,.5),M.hull,0,0,0);
  add(planform([[-.4,9.6],[-2.0,7.4],[-3.0,3.5],[-3.2,-6.4],[3.2,-6.4],[3.0,3.5],[2.0,7.4],[.4,9.6]],.6,.25),K.olive,0,1.05,0);
  for(const sx of[-1,1]){B.wing([[0,4.6],[sx*8.2,-3.4],[sx*8.6,-5.4],[sx*7.6,-6.4],[0,-7.4]],.7,M.hull,sx*4.6,-.05,.2);
    B.wing([[0,2.6],[sx*6.6,-3.6],[sx*6.8,-4.4],[0,-5.6]],.12,K.olive,sx*4.8,.33,.4);add(GEO.box,M.trim,sx*8.6,.22,2.2,0,sx*.78,0,.14,.12,7.4);
    B.flap(sx*8.4,-.12,7.0,4.6,.7,sx);B.navL(sx*13.0,0,5.8,sx);B.strobe(sx*12.6,.4,6.4);
    for(const ex of[2.6,5.0]){const x=sx*ex;B.engine(x,.1,4.4,8.6,.82,0xffc890)}
    for(const pz of[-5,-1,3])add(GEO.box,K.armorD,sx*4.9,.55,pz,0,0,sx*.25,.12,.6,3.4);
    const tf=add(planform([[0,0],[2.4,-1.3],[2.6,-2.8],[.4,-3.1]],.18,.07),M.hull,sx*3.4,.75,6.6);tf.rotation.set(0,0,sx>0?Math.PI/2-.2:Math.PI/2+.2)}
  // raised cockpit and canopy, dorsal sensor ridge, nose turret with twin guns
  add(planform([[-1.1,9],[-1.4,6],[-1.3,3.4],[1.3,3.4],[1.4,6],[1.1,9]],.9,.3),M.hull,0,1.55,0);
  add(GEO.sph,M.glass,0,2.05,-6.6,0,0,0,1.0,.55,1.7);for(const z of[-5.6,-6.6,-7.6])add(GEO.box,M.dark,0,2.32,z,0,0,0,1.5,.07,.08);
  add(GEO.box,M.dark,0,1.6,1.5,0,0,0,.5,.3,6);add(GEO.cyl,M.metal,.5,2.1,3,0,0,0,.03,1.2,.03);
  {const t=add(GEO.sph,M.dark,0,-.95,-9.0,0,0,0,.7,.5,.7);t.castShadow=true;for(const sx of[-.22,.22])B.gunB(sx,-1.0,-9.4,1.8,.08)}
  add(GEO.box,M.trim,0,1.4,-3,0,0,0,.14,.05,8);
  // the bomb bay: a recess, two doors hinged at the sides (they swing down to open), four torpedoes on a rack
  add(GEO.box,K.bay,0,-.86,-.4,0,0,0,3.2,.1,9.4);const bay={doors:[],torps:[],open:0};
  for(const sx of[-1,1]){const h=new T.Group();h.position.set(sx*1.6,-.9,-.4);B.g.add(h);const d=new T.Mesh(GEO.box,K.olive);d.scale.set(1.6,.12,9.2);d.position.set(-sx*.8,0,0);d.castShadow=true;h.add(d);
    const w=new T.Mesh(GEO.box,K.warn);w.scale.set(.3,.13,8.6);w.position.set(-sx*1.45,0,0);h.add(w);h.userData.sx=sx;bay.doors.push(h)}
  for(const[x,z]of[[-.7,-2.6],[.7,-2.6],[-.7,2.0],[.7,2.0]]){const t=B.missile(x,-.55,z,1.9);U.msls.pop();t.userData.home=t.position.clone();bay.torps.push(t);const r=add(GEO.box,M.dark,x,-.32,z,0,0,0,.18,.18,3.4)}
  {const lt=[];for(const z of[-4.4,3.6])for(const sx of[-1,1]){const l=add(GEO.sph,M.red,sx*1.4,-.84,z,0,0,0,.12,.12,.12);l.castShadow=false;lt.push(l)}bay.lights=lt}
  U.bay=bay;
  B.leg(0,-7.2,-.8,-2.6,.34);B.leg(-3.4,1.2,-.8,-2.6,.4);B.leg(3.4,1.2,-.8,-2.6,.4);B.leg(-3.4,3.0,-.8,-2.6,.4);B.leg(3.4,3.0,-.8,-2.6,.4);
  return B.done(1,2.6)}
// Ion cannon ship: built round a reinforced spinal cannon that runs the full length and out past the nose (barrel
// segments, clamp rings, a ring emitter at the muzzle), three capacitor banks a side with glowing coils, stub wings
// with radiator fins, cockpit high and aft, two engines. The charge glow lives at the muzzle (U.ion).
function ionShip(){const B=shipBuilder(),{M,K,add}=B,U=B.U;
  B.fus([[0,-3.4],[.6,-3.0],[1.0,-1.8],[1.2,0],[1.2,4.0],[1.05,5.6],[.95,6.2]],M.hull,0,.1,0,1.4,.95);
  add(planform([[-.8,5.6],[-1.6,3.4],[-1.9,0],[-1.9,-4.4],[-1.5,-6.0],[1.5,-6.0],[1.9,-4.4],[1.9,0],[1.6,3.4],[.8,5.6]],.3,.12),M.hull,0,-.62,0);
  // the cannon: housing along the spine, barrel segments with clamp rings forward to the muzzle
  add(GEO.box,K.armorD,0,1.05,0,0,0,0,1.5,.9,9.5);add(GEO.box,K.violet,0,1.52,0,0,0,0,1.1,.08,8.6);
  add(GEO.cyl,M.metal,0,1.05,-8.4,Math.PI/2,0,0,.42,8.0,.42);add(GEO.cyl,M.dark,0,1.05,-4.8,Math.PI/2,0,0,.62,1.2,.62);
  for(let k=0;k<5;k++){add(GEO.tor,M.dark,0,1.05,-5.8-k*1.25,0,0,0,.58,.58,.58);const c=add(GEO.tor,K.cap,0,1.05,-6.4-k*1.25,0,0,0,.48,.48,.48);c.castShadow=false;U.coils.push(c)}
  for(let k=0;k<4;k++){const a=k*Math.PI/2+Math.PI/4;add(GEO.box,K.armorD,Math.cos(a)*.5,1.05+Math.sin(a)*.5,-8.6,0,0,a,.14,.14,7.4)}
  add(GEO.cyl,M.dark,0,1.05,-12.55,Math.PI/2,0,0,.72,.5,.72);const em=add(GEO.tor,K.capC,0,1.05,-12.85,0,0,0,.62,.62,.62);em.castShadow=false;U.coils.push(em);
  const core=new T.Mesh(GEO.sph,K.ionA);core.position.set(0,1.05,-13.25);core.scale.setScalar(.01);B.g.add(core);const core2=new T.Mesh(GEO.sph,K.ionB);core2.position.copy(core.position);core2.scale.setScalar(.01);B.g.add(core2);
  U.ion={core,core2,mz:[0,1.05,-13.3],arcs:[]};U.mz.push([0,1.05,-13.3]);
  // capacitor banks: three cylinders a side on cradles, coils glow with the charge
  for(const sx of[-1,1]){for(let k=0;k<3;k++){const z=-1.8+k*2.2;add(GEO.cyl,K.armorD,sx*1.95,.75,z,Math.PI/2,0,0,.42,1.8,.42);for(const dz of[-.5,0,.5]){const c=add(GEO.tor,K.capC,sx*1.95,.75,z+dz,0,0,0,.44,.44,.44);c.castShadow=false;U.coils.push(c)}add(GEO.box,M.dark,sx*1.55,.6,z,0,0,0,.5,.12,1.4)}
    B.wing([[0,1.6],[sx*3.4,-.6],[sx*3.6,-1.6],[0,-2.6]],.18,M.hull,sx*2.2,-.3,2.6);for(let k=0;k<4;k++)add(GEO.box,M.dark,sx*(3.0+k*.62),-.08,3.0,0,0,0,.07,.42,1.8);
    B.navL(sx*5.75,-.3,3.6,sx);B.flap(sx*4.0,-.4,4.9,2.2,.4,sx);
    B.engine(sx*1.0,.1,5.4,8.4,.72,0xb8a8ff);B.missile(sx*2.0,-.62,-.4,.9)}
  {const f=add(planform([[0,0],[1.8,-1.2],[2.0,-2.4],[.4,-2.6]],.12,.05),M.hull,0,1.2,5.4);f.rotation.set(0,0,Math.PI/2);B.strobe(0,3.25,7.4)}
  add(GEO.sph,M.glass,0,1.85,2.4,0,0,0,.62,.4,1.2);add(GEO.box,M.dark,0,2.05,2.4,0,0,0,.07,.05,1.3);
  B.leg(0,-3.6,-.5,-2.0,.26);B.leg(-1.8,3.4,-.5,-2.0,.3);B.leg(1.8,3.4,-.5,-2.0,.3);
  return B.done(1,2.0)}
// Gunship: a heavy armoured hull, thick short wings, two twin-cannon turrets on each wing and a chin turret (heavier
// mounts than any other ship), armour plates, four engines in two pods, a squared cockpit block.
function gunshipShip(){const B=shipBuilder(),{M,K,add}=B;
  add(planform([[-.9,8.4],[-2.2,6.8],[-2.6,3],[-2.6,-5.6],[-2.0,-7.2],[2.0,-7.2],[2.6,-5.6],[2.6,3],[2.2,6.8],[.9,8.4]],2.0,.4),M.hull,0,.1,0);
  add(planform([[-.8,7.2],[-1.9,5.8],[-2.1,2],[-2.1,-5],[2.1,-5],[2.1,2],[1.9,5.8],[.8,7.2]],.5,.2),K.armor,0,1.35,0);
  for(const z of[-3.6,-1,1.6])for(const sx of[-1,1])add(GEO.box,K.armorD,sx*2.62,.2,z,0,0,0,.14,1.4,2.2);
  add(GEO.box,M.hull,0,1.8,-4.6,0,0,0,2.6,1.0,2.8);add(GEO.box,M.glass,0,1.85,-6.05,-.3,0,0,2.2,.65,.12);for(const x of[-.55,.55])add(GEO.box,M.dark,x,1.85,-6.07,-.3,0,0,.07,.7,.14);
  {const t=add(GEO.sph,K.armorD,0,-1.05,-6.4,0,0,0,.8,.55,.8);for(const sx of[-.25,.25])B.gunB(sx,-1.1,-6.9,2.0,.1)}
  for(const sx of[-1,1]){B.wing([[0,3.2],[sx*5.6,.4],[sx*5.8,-1.6],[0,-3.8]],.5,M.hull,sx*2.5,-.1,.6);B.flap(sx*4.8,-.3,4.1,3.2,.6,sx);B.navL(sx*8.35,-.1,1.6,sx);
    for(const wx of[4.0,6.4]){const x=sx*wx;add(GEO.cyl,K.armorD,x,.42,-.4,0,0,0,.6,.5,.6);add(GEO.box,K.armor,x,.75,-.6,0,0,0,.9,.45,1.4);for(const o of[-.2,.2])B.gunB(x+o,.8,-1.3,2.4,.09)}
    add(GEO.box,M.trim,sx*5.2,.18,-.3,0,0,0,3.4,.06,.12);
    const pod=sx*3.0;B.engine(pod-.6,.3,4.2,8.2,.66,0xffb070);B.engine(pod+.6,.3,4.2,8.2,.66,0xffb070);add(GEO.box,K.armor,pod,.95,6.2,0,0,0,2.2,.3,3.6);
    const tf=add(planform([[0,0],[2.0,-1.1],[2.2,-2.4],[.4,-2.6]],.16,.06),M.hull,sx*1.6,1.4,6.0);tf.rotation.set(0,0,sx>0?Math.PI/2-.12:Math.PI/2+.12);B.strobe(sx*1.9,3.6,8.2)}
  B.U.msls.length=0;for(const sx of[-1,1])for(const k of[0,1,2])B.missile(sx*(1.4+k*.4),-.92,1.6,.85);
  B.leg(-1.6,-4.8,-.85,-2.4,.32);B.leg(1.6,-4.8,-.85,-2.4,.32);B.leg(-2.0,3.6,-.85,-2.4,.38);B.leg(2.0,3.6,-.85,-2.4,.38);
  return B.done(1,2.4)}
// Recon / electronic warfare: slender, long forward-swept wings, a radome on a pylon, twin tail booms with antenna
// masts trailing past the tail, EW pods on the wingtips, one pusher engine, light nose guns.
function reconShip(){const B=shipBuilder(),{M,K,add}=B,U=B.U;
  B.fus([[0,-6.0],[.25,-5.6],[.5,-4.6],[.66,-3],[.72,-.5],[.7,2.4],[.55,3.8],[.5,4.2]],M.hull,0,.2,0,1.05,.85);
  add(planform([[-.2,5.2],[-.6,3.6],[-.8,1],[-.82,-2.6],[-.6,-3.8],[.6,-3.8],[.82,-2.6],[.8,1],[.6,3.6],[.2,5.2]],.16,.06),M.hull,0,-.32,0);
  add(GEO.sph,M.glass,0,.82,-3.0,0,0,0,.48,.4,1.3);add(GEO.box,K.teal,0,.9,0,0,0,0,.6,.1,4.2);
  {const py=add(GEO.box,M.dark,0,1.2,.6,0,0,0,.3,.9,1.2);const rd=add(GEO.cyl,K.radome,0,1.85,.6,0,0,0,1.9,.32,1.9);const rb=add(GEO.cyl,K.teal,0,1.85,.6,0,0,0,1.95,.08,1.95);U.radome=rd;U.radomeB=rb}
  for(const sx of[-1,1]){B.wing([[0,.6],[sx*5.8,2.0],[sx*6.1,1.3],[sx*5.9,.6],[0,-2.4]],.14,M.hull,sx*.6,-.1,.6);add(GEO.box,K.teal,sx*3.4,-.04,-.5,0,sx*-.24,0,.1,.06,2.2);
    B.flap(sx*3.3,-.18,2.6,2.6,.36,sx);const pod=add(GEO.cyl,M.dark,sx*6.5,-.1,-.4,Math.PI/2,0,0,.22,2.6,.22);add(GEO.sph,K.lens,sx*6.5,-.1,-1.75,0,0,0,.22,.22,.22);B.navL(sx*6.5,.18,-.6,sx);
    // tail boom with an antenna mast trailing past the tail
    add(GEO.cyl,M.hull,sx*1.5,.0,4.0,Math.PI/2,0,0,.16,5.2,.16);const tf=add(planform([[0,0],[1.4,-.9],[1.6,-1.8],[.3,-2.0]],.1,.04),M.hull,sx*1.5,.15,5.2);tf.rotation.set(0,0,Math.PI/2);
    add(GEO.cyl,M.metal,sx*1.5,1.2,7.3,Math.PI/2+.35,0,0,.025,3.2,.025);B.strobe(sx*1.5,1.75,8.75);B.gunB(sx*.42,.0,-4.4,1.0,.05);
    B.missile(sx*2.6,-.42,.8,.8);B.missile(sx*3.2,-.42,.9,.8)}
  add(GEO.box,M.hull,0,.15,5.6,0,0,0,3.2,.12,.8);B.engine(0,.2,3.6,6.2,.62,0x8fffe0);
  B.leg(0,-3.4,-.3,-1.6,.2);B.leg(-1.2,1.8,-.35,-1.6,.24);B.leg(1.2,1.8,-.35,-1.6,.24);
  return B.done(1,1.6)}
const SHIPM={kestrel:()=>{const g=shuttleModel();g.userData.mz=[[-2.5,-.55,-3.1],[2.5,-.55,-3.1]];g.userData.gy=2.05;return g},int:interceptorShip,mrf:multiroleShip,bmr:bomberShip,ion:ionShip,gun:gunshipShip,rec:reconShip};
function shipModel(id){const SH=SHIPS[id]||SHIPS.kestrel,g=(SHIPM[SH.model]||SHIPM.kestrel)();g.userData.id=id in SHIPS?id:'kestrel';return g}
