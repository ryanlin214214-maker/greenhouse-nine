p='index.html';s=open(p).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]

rep("['Thorn Lance','Briar Pike','Root Spike','Bramble Rail']","['Briar Lance','Bramble Pike','Root Spike','Seedrail']")

# ---------- shared baking helpers, wing texture, rigs
between("/* ---------- enemy models (front faces +z) ---------- */","const ER=","""/* ---------- enemy models (front faces +z) ---------- */
GEO.tor=new T.TorusGeometry(1,0.18,8,28);
const _q=new T.Quaternion(),_e=new T.Euler(),_v=new T.Vector3(),_s=new T.Vector3();
function mergeGeos(list){let n=0;for(const g of list)n+=g.attributes.position.count;const P=new Float32Array(n*3),N=new Float32Array(n*3),U=new Float32Array(n*2);let o=0;
  for(const g of list){const c=g.attributes.position.count;P.set(g.attributes.position.array,o*3);N.set(g.attributes.normal.array,o*3);if(g.attributes.uv)U.set(g.attributes.uv.array,o*2);o+=c;g.dispose()}
  const G=new T.BufferGeometry();G.setAttribute('position',new T.BufferAttribute(P,3));G.setAttribute('normal',new T.BufferAttribute(N,3));G.setAttribute('uv',new T.BufferAttribute(U,2));G.computeBoundingSphere();return G}
function bake(fn){const by=new Map();
  fn((geo,mat,sx,sy,sz,x=0,y=0,z=0,rx=0,ry=0,rz=0)=>{let g=geo.clone();if(rx&&rx.isQuaternion)_q.copy(rx);else _q.setFromEuler(_e.set(rx,ry,rz));
    g.applyMatrix4(M4.compose(_v.set(x,y,z),_q,_s.set(sx,sy,sz)));if(g.index){const n=g.toNonIndexed();g.dispose();g=n}if(!by.has(mat))by.set(mat,[]);by.get(mat).push(g)});
  return[...by].map(([m,l])=>[m,mergeGeos(l)])}
function inst(b,sh){const g=new T.Group();for(const[m,geo]of b){const o=new T.Mesh(geo,m);o.castShadow=!!sh;g.add(o)}return g}
const KIT={};const kit=(name,fn)=>KIT[name]||(KIT[name]=bake(fn));
function J(par,x,y,z){const j=new T.Group();j.position.set(x,y,z);par.add(j);return j}
function put(j,name,fn,sh){const m=inst(kit(name,fn),sh);j.add(m);return m}
{const wt=paint(256,(g,S)=>{g.clearRect(0,0,S,S);g.save();g.beginPath();g.ellipse(S/2,S/2,S*0.48,S*0.42,0,0,7);g.clip();
   const gr=g.createLinearGradient(0,0,S,0);gr.addColorStop(0,'rgba(200,240,255,0.55)');gr.addColorStop(1,'rgba(170,220,255,0.25)');g.fillStyle=gr;g.fillRect(0,0,S,S);
   g.strokeStyle='rgba(30,50,60,0.85)';g.lineWidth=3;for(let i=0;i<6;i++){g.beginPath();g.moveTo(S*0.04,S/2);g.quadraticCurveTo(S*0.45,S*(0.15+i*0.14),S*0.98,S*(0.1+i*0.16));g.stroke()}
   g.lineWidth=1.5;for(let i=0;i<14;i++){const x=S*(0.2+hash(i,3)*0.7),y=S*(0.15+hash(i,4)*0.7);g.beginPath();g.moveTo(x,y);g.lineTo(x+S*0.08,y+S*(hash(i,5)-0.5)*0.12);g.stroke()}
   g.restore();g.strokeStyle='rgba(30,50,60,0.9)';g.lineWidth=4;g.beginPath();g.ellipse(S/2,S/2,S*0.48,S*0.42,0,0,7);g.stroke()});
 MAT.wing.map=wt;MAT.wing.color.set(0xffffff);MAT.wing.opacity=1;MAT.wing.alphaTest=0.04;MAT.wing.needsUpdate=true}
function wingPair(g,span,y,z=0,k=1){const out=[];for(const s of[-1,1]){const p=new T.Group();p.position.set(s*0.22*span,y,z);p.userData.s=s;
    const w=mesh(GEO.plane,MAT.wing,0.75*span*k,0.34*span*k,1,s*0.4*span*k,0,0);w.rotation.x=-Math.PI/2;p.add(w);g.add(p);out.push(p)}return out}
// bees: the drone (v=0) and the armored warden (v=1)
function beeRig(g,v){const b=new T.Group();b.scale.setScalar(v?2:1);g.add(b);
  const BO=v?MAT.violet:MAT.drone,PL=v?MAT.violetD:MAT.dark,EY=v?MAT.eyeA:MAT.eye,AC=MAT.amber,n='bee'+v;
  put(b,n+'T',a=>{a(GEO.sph,BO,.3,.27,.32,0,0,.04);a(GEO.sph,PL,.31,.11,.27,0,.15,.03);a(GEO.sph,PL,.25,.21,.07,0,0,.3);
    if(v){a(GEO.box,PL,.46,.05,.3,0,.27,.03);for(const s of[-1,1])a(GEO.cone,AC,.05,.22,.05,s*.3,.16,.08,0,0,-s*1.1)}},true);
  const head=J(b,0,.04,.37);put(head,n+'H',a=>{a(GEO.sph,PL,.19,.17,.17);for(const s of[-1,1]){a(GEO.sph,EY,.09,.12,.08,s*.11,.03,.08,0,s*.4,0);
      a(GEO.cyl,PL,.012,.3,.012,s*.07,.2,.08,-.5,0,-s*.3);a(GEO.sph,AC,.028,.028,.028,s*.115,.33,.16)}
    if(v)for(let i=0;i<5;i++)a(GEO.cone,AC,.035,.2,.035,(i-2)*.06,.2,.02-Math.abs(i-2)*.03,-.3,0,-(i-2)*.25)});
  const mand=[];for(const s of[-1,1]){const m=J(head,s*.06,-.1,.12);m.userData.s=s;put(m,n+'M',a=>a(GEO.cone,PL,.028,.15,.028,0,-.045,.06,2.21,0,0));mand.push(m)}
  const abd=J(b,0,-.02,-.24);put(abd,n+'A',a=>{a(GEO.sph,BO,.27,.24,.36,0,-.04,-.26);
    for(const z of[-.12,-.28,-.44]){const k=Math.sqrt(Math.max(0,1-((z+.26)/.36)**2))*1.03;a(GEO.sph,PL,.27*k,.24*k,.045,0,-.04,z)}
    a(GEO.cone,PL,.05,.22,.05,0,-.06,-.68,-1.571,0,0);a(GEO.sph,AC,.022,.022,.022,0,-.06,-.8);if(v)a(GEO.box,PL,.3,.05,.4,0,.18,-.24)},true);
  const legs=[];for(const s of[-1,1]){const L=J(b,s*.17,-.14,.05);L.scale.x=s;L.userData.s=s;
    put(L,n+'L',a=>{for(const[z,ry]of[[.12,-.4],[0,0],[-.12,.4]]){const c=Math.cos(ry),sn=Math.sin(ry),P=(x,y)=>[x*c,y,-x*sn+z];
      a(GEO.cyl,PL,.022,.28,.022,...P(.126,-.062),0,ry,-2.02);a(GEO.cyl,PL,.018,.3,.018,...P(.297,-.266),0,ry,-2.83);a(GEO.sph,PL,.03,.03,.03,...P(.342,-.408))}});legs.push(L)}
  const wings=wingPair(b,1,.26,.02).concat(wingPair(b,1,.24,-.14,.65));
  return{wings,anim(e,t,dt){head.rotation.y=Math.sin(t*2.7+e.ph)*.3;head.rotation.x=Math.sin(t*1.9+e.ph)*.15;
    abd.rotation.x=.12+Math.sin(t*3.5+e.ph)*.14;abd.rotation.y=Math.sin(t*2.2+e.ph)*.1;
    for(const L of legs){const k=L.userData.s;L.rotation.x=Math.sin(t*6+e.ph+k)*.25;L.rotation.z=k*(.15+Math.sin(t*4.3+e.ph+k*2)*.15)}
    const o=.15+Math.abs(Math.sin(t*7+e.ph))*.35;for(const m of mand)m.rotation.y=m.userData.s*o}}}
// seeder: a flying flower turret with opening petals, a spinning iris and a swaying stem
function seederRig(g){
  put(g,'sdB',a=>{a(GEO.sph,MAT.bulb,.36,.36,.3);for(let i=0;i<5;i++){const r=i/5*6.283+.3;a(GEO.cone,MAT.leafD,.09,.3,.05,Math.cos(r)*.3,Math.sin(r)*.3,-.16,0,0,r-1.571)}},true);
  put(g,'sdC',a=>a(GEO.sph,MAT.core,.2,.2,.12,0,0,.27));
  const iris=J(g,0,0,.3);put(iris,'sdI',a=>{a(GEO.tor,MAT.dark,.2,.2,.2);for(let i=0;i<8;i++){const r=i/8*6.283;
    a(GEO.cyl,MAT.amber,.008,.16,.008,Math.cos(r)*.12,Math.sin(r)*.12,.08,1.571,0,0);a(GEO.sph,MAT.amber,.022,.022,.022,Math.cos(r)*.12,Math.sin(r)*.12,.17)}});
  const pet=[];for(let i=0;i<6;i++){const r=i/6*6.283,p=J(g,Math.cos(r)*.26,Math.sin(r)*.26,.06);p.rotation.order='ZYX';p.rotation.z=r-1.571;
    put(p,'sdP',a=>{a(GEO.sph,MAT.bloom,.15,.32,.035,0,.28,0);a(GEO.sph,MAT.bloom,.09,.2,.05,0,.2,.03)});pet.push(p)}
  const stem=[];let par=g;for(let i=0;i<3;i++){const sg=J(par,0,i?-.42:-.3,i?0:-.05);sg.rotation.y=i*2.1;
    put(sg,'sdS',a=>{a(GEO.cyl,MAT.leafD,.045,.42,.045,0,-.21,0);a(GEO.sph,MAT.leaf,.17,.025,.08,.13,-.2,0,0,0,-.5)});stem.push(sg);par=sg}
  put(J(par,0,-.42,0),'sdR',a=>{for(let i=0;i<4;i++){const r=i*1.571;a(GEO.cone,MAT.leafD,.02,.25,.02,Math.cos(r)*.05,-.1,Math.sin(r)*.05,Math.PI+Math.sin(r)*.5,0,Math.cos(r)*.5)}});
  return{anim(e,t,dt){const open=e.cd<0.6?0:.35+.3*Math.sin(t*1.6+e.ph);for(let i=0;i<6;i++){const p=pet[i];p.rotation.x+=(open+Math.sin(t*3+i)*.05-p.rotation.x)*Math.min(1,dt*8)}
    iris.rotation.z+=dt*(e.cd<0.6?7:1);for(let i=0;i<3;i++){stem[i].rotation.x=Math.sin(t*1.7+e.ph+i*.8)*.2;stem[i].rotation.z=Math.cos(t*1.3+e.ph+i*.9)*.15}}}}
// trooper: an armored walker with hips, knees, shoulders, elbows, a turning head and a held rifle
function trooperRig(g){const A1=MAT.armor,A2=MAT.armorD,AM=MAT.amber,EY=MAT.eyeA;
  put(J(g,0,-.1,0),'tPel',a=>{a(GEO.box,A2,.42,.2,.28);a(GEO.box,AM,.44,.04,.3,0,.06,0);for(const s of[-1,1])a(GEO.box,A1,.08,.22,.24,s*.24,-.06,0)});
  const tor=J(g,0,-.02,0);put(tor,'tTor',a=>{a(GEO.box,A1,.6,.46,.38,0,.36,0);a(GEO.box,A2,.44,.26,.32,0,.06,0);a(GEO.box,A1,.5,.2,.06,0,.36,.21);
    a(GEO.box,AM,.36,.03,.02,0,.42,.245);a(GEO.box,A2,.22,.12,.08,0,.62,.08);a(GEO.box,A2,.44,.5,.24,0,.3,-.3);
    a(GEO.cyl,A2,.015,.5,.015,.15,.75,-.34);a(GEO.sph,AM,.03,.03,.03,.15,1.0,-.34);for(let i=0;i<3;i++)a(GEO.box,A1,.4,.025,.02,0,.16+i*.1,-.425);
    for(const s of[-1,1]){a(GEO.sph,A1,.17,.13,.19,s*.36,.57,0);a(GEO.box,A2,.06,.18,.18,s*.24,.3,-.43)}},true);
  const head=J(tor,0,.62,.02);put(head,'tHead',a=>{a(GEO.box,A2,.36,.34,.38,0,.17,0);a(GEO.box,A1,.4,.1,.42,0,.31,0);a(GEO.box,A1,.06,.12,.3,0,.4,-.02);
    a(GEO.box,EY,.3,.08,.04,0,.18,.2);a(GEO.box,A1,.26,.12,.08,0,.05,.18);for(const s of[-1,1])a(GEO.cyl,A1,.05,.1,.05,s*.2,.15,0,0,0,1.571)});
  const arms=[];for(const s of[-1,1]){const sh=J(tor,s*.4,.5,0);put(sh,'tUA',a=>{a(GEO.box,A1,.17,.34,.19,0,-.15,0);a(GEO.box,A2,.19,.06,.21,0,-.3,0)});
    const el=J(sh,0,-.32,0);put(el,'tFA',a=>{a(GEO.box,A2,.15,.3,.17,0,-.14,0);a(GEO.box,A2,.13,.12,.15,0,-.33,.02)});arms.push([sh,el])}
  const gun=J(tor,.14,.22,.22);put(gun,'tGun',a=>{a(GEO.box,A2,.1,.14,.72,0,0,0);a(GEO.box,A1,.11,.06,.5,0,.09,.04);a(GEO.cyl,A2,.025,.36,.025,0,.01,.52,1.571,0,0);
    a(GEO.box,AM,.04,.04,.04,0,.01,.7);a(GEO.box,A2,.07,.16,.1,0,-.14,.06,-.2,0,0);a(GEO.cyl,A2,.035,.16,.035,0,.13,-.04,1.571,0,0);a(GEO.box,EY,.02,.03,.02,0,.13,-.13)});
  const legs=[];for(const s of[-1,1]){const hip=J(g,s*.15,-.16,0);put(hip,'tTh',a=>a(GEO.box,A1,.21,.36,.25,0,-.17,0),true);
    const kn=J(hip,0,-.34,0);put(kn,'tSh',a=>{a(GEO.box,A2,.17,.34,.2,0,-.16,0);a(GEO.box,A1,.19,.12,.08,0,-.02,.12);a(GEO.box,A2,.2,.09,.32,0,-.36,.05)});legs.push([hip,kn])}
  return{anim(e,t,dt){const m=e.mv,w=t*9+e.ph,air=!m&&Math.abs(e.vy||0)>0.5;
    for(let i=0;i<2;i++){const[hip,kn]=legs[i],q=w+(i?Math.PI:0);hip.rotation.x=air?-.5:-Math.sin(q)*.55*m;kn.rotation.x=air?.9:Math.max(0,Math.sin(q+1.2))*.9*m}
    tor.position.y=-.02+Math.abs(Math.sin(w))*.03*m;tor.rotation.y=Math.sin(w)*.08*m+Math.sin(t*.7+e.ph)*.06;
    e.kick=Math.max(0,(e.kick||0)-dt*6);const k=e.kick;head.rotation.y=Math.sin(t*1.3+e.ph)*.35;head.rotation.x=Math.sin(t*.9+e.ph)*.08;
    arms[1][0].rotation.set(-.55-k*.3,0,-.45);arms[1][1].rotation.x=-.9+k*.2;arms[0][0].rotation.set(-1.15-k*.2,0,.7);arms[0][1].rotation.x=-.55;
    gun.position.z=.22-k*.08;gun.rotation.x=-k*.15}}}
function model(type){const g=new T.Group();let wings=[],rig=null;
  if(type===0||type===2){rig=beeRig(g,type===2?1:0);wings=rig.wings}
  else if(type===1)rig=seederRig(g);
  else if(type===5)rig=trooperRig(g);
  const parts=[];g.traverse(o=>{if(o.isMesh&&o.material!==MAT.wing)parts.push([o,o.material])});
  const gl=type===0?glow(0xff3b3b,1.1,0.9):type===1?glow(0x9dff7a,1.5,0.8):type===5?glow(0xffb238,0.9,0.7):glow(0xffb238,2.4,0.8);
  gl.position.set(0,type===5?0.86:type===2?0.2:0.06,type===5?0.3:type===2?0.95:0.48);g.add(gl);
  return{g,wings,parts,rig}}
""")
rep("wings:m.wings,parts:m.parts,white:false,flash:0,dying:0,r:ER[type]","wings:m.wings,parts:m.parts,rig:m.rig,white:false,flash:0,dying:0,r:ER[type]")
rep("shots.push({g,v:v.multiplyScalar(30),t:3,dmg:5});sfx('bolt')","shots.push({g,v:v.multiplyScalar(30),t:3,dmg:5});sfx('bolt');e.kick=1")

# ---------- boss and pods
between("function bossModel(){const g=new T.Group();","const EB=","""function bossModel(){const g=new T.Group();
  g.add(mesh(GEO.sph,MAT.violetD,3,2.3,3.1),mesh(GEO.sph,MAT.violet,3.06,0.5,3.16,0,0.5,0),mesh(GEO.sph,MAT.bulb,2.2,1.6,2.2,0,-1.4,0));
  for(const z of[-1.6,-0.5,0.6]){const k=Math.sqrt(1-(z/3.1)**2)*1.02;g.add(mesh(GEO.sph,MAT.violet,3*k,2.3*k,0.16,0,0,z))}
  for(const s of[-1,1])g.add(mesh(GEO.box,MAT.violetD,0.5,1.6,3.4,s*2.7,0.2,-0.2),mesh(GEO.cone,MAT.amber,0.25,1.2,0.25,s*3.1,0.9,0.4));
  const crown=new T.Group();crown.position.y=2;g.add(crown);
  for(let i=0;i<7;i++){const a=i/7*6.283;crown.add(mesh(GEO.cone,MAT.amber,0.35,1.8,0.35,Math.cos(a)*1.9,0.4,Math.sin(a)*1.9),mesh(GEO.cone,MAT.violetD,0.18,0.8,0.18,Math.cos(a+.45)*1.6,0.1,Math.sin(a+.45)*1.6))}
  const tend=[];for(let i=0;i<6;i++){const a=i/6*6.283;let par=g;const ch=[];
    for(let k=0;k<4;k++){const sg=new T.Group();if(k)sg.position.set(0,-0.85,0);else sg.position.set(Math.cos(a)*1.3,-2.6,Math.sin(a)*1.3);par.add(sg);
      sg.add(mesh(GEO.cyl,k%2?MAT.leafD:MAT.bulb,.22-k*.04,.9,.22-k*.04,0,-.42,0));if(k===3)sg.add(mesh(GEO.sph,MAT.core,.16,.16,.16,0,-.9,0));ch.push(sg);par=sg}tend.push(ch)}
  const mand=[];for(const s of[-1,1]){const m=new T.Group();m.position.set(s*.9,-.9,2.4);m.userData.s=s;g.add(m);const c=mesh(GEO.cone,MAT.dark,.22,1.4,.22,0,-.45,.5);c.rotation.x=2.21;m.add(c);mand.push(m)}
  const iris=new T.Group();iris.position.set(0,.2,2.85);g.add(iris);iris.add(mesh(GEO.sph,MAT.eyeA,.9,.9,.5),mesh(GEO.tor,MAT.dark,.62,.62,.62,0,0,.32));
  const pupil=mesh(GEO.sph,MAT.dark,.4,.4,.2,0,0,.4);iris.add(pupil);
  const wings=wingPair(g,6,1.2).concat(wingPair(g,6,1,-.9,.65)),parts=[];g.traverse(o=>{if(o.isMesh&&o.material!==MAT.wing){o.castShadow=true;parts.push([o,o.material])}});
  const gl=glow(0xffb238,7,0.8);gl.position.set(0,0.2,3.3);g.add(gl);
  const rig={anim(e,t,dt){crown.rotation.y+=dt*(e.vuln>0?.2:.7);
    for(let i=0;i<6;i++)for(let k=0;k<4;k++){const sg=tend[i][k];sg.rotation.x=Math.sin(t*1.4+i+k*.7)*.25;sg.rotation.z=Math.cos(t*1.1+i*1.3+k*.6)*.2}
    const o=e.vuln>0?.6:.15+Math.abs(Math.sin(t*3))*.3;for(const m of mand)m.rotation.y=m.userData.s*o;
    pupil.position.x=Math.sin(t*.8)*.15;pupil.position.y=Math.cos(t*1.1)*.1;iris.scale.setScalar(1+(e.vuln>0?Math.sin(t*12)*.06:0))}};
  return{g,wings,parts,rig}}
""")
rep("const e={...EB(),type:3,pos:m.g.position,g:m.g,wings:m.wings,parts:m.parts,","const e={...EB(),type:3,pos:m.g.position,g:m.g,wings:m.wings,parts:m.parts,rig:m.rig,")
rep("for(let i=0;i<n;i++){const g=new T.Group();g.add(mesh(GEO.sph,MAT.bulb,0.7,0.7,0.7),mesh(GEO.sph,MAT.core,0.42,0.42,0.42,0,0,0.42),glow(0x9dff7a,2.6,0.8));",
"""for(let i=0;i<n;i++){const g=new T.Group(),inner=new T.Group();g.add(inner,glow(0x9dff7a,2.6,0.8));
    inner.add(inst(kit('pod',a=>{a(GEO.sph,MAT.bulb,.7,.7,.7);for(let j=0;j<4;j++)a(GEO.tor,MAT.leafD,.72,.72,.72,0,0,0,0,j*.785,0);a(GEO.sph,MAT.core,.42,.42,.42,0,0,.42);
      for(let j=0;j<12;j++){const y=1-(j+.5)/12*2,r=Math.sqrt(1-y*y),th=j*2.4,d=new T.Vector3(Math.cos(th)*r,y,Math.sin(th)*r);if(d.z>.6)continue;
        a(GEO.cone,MAT.leafD,.06,.32,.06,d.x*.8,d.y*.8,d.z*.8,new T.Quaternion().setFromUnitVectors(UP,d))}}),true));""")
rep("const e={...EB(),type:4,pos:g.position,g,parts,r:0.7,hp:5*k,boss:b,ang:i/n*6.283};",
    "const e={...EB(),type:4,pos:g.position,g,parts,r:0.7,hp:5*k,boss:b,ang:i/n*6.283,rig:{anim(e,t){inner.scale.setScalar(1+Math.sin(t*5+e.ang*3)*.07)}}};")

# ---------- animation hook
rep("""    if(e.type===5){const sw=Math.sin(time*9+e.ph)*0.7*e.mv;e.legs[0].rotation.x=sw;e.legs[1].rotation.x=-sw;e.g.rotation.y=Math.atan2(eye.x-e.pos.x,eye.z-e.pos.z);continue}
    if(state!=='paused'){e.g.position.y+=Math.sin(time*4+e.ph)*0.004;
      for(let k=0;k<e.wings.length;k++)e.wings[k].rotation.z=(k?-1:1)*(0.25+Math.sin(time*45+e.ph)*0.55)}""",
"""    if(e.rig&&state!=='paused'){try{e.rig.anim(e,time,dt)}catch(err){e.rig=null}}
    if(e.type===5){e.g.rotation.y=Math.atan2(eye.x-e.pos.x,eye.z-e.pos.z);continue}
    if(state!=='paused'){e.g.position.y+=Math.sin(time*4+e.ph)*0.004;
      for(const w of e.wings)w.rotation.z=-w.userData.s*(0.25+Math.sin(time*45+e.ph)*0.55)}""")

# ---------- first-person weapons
between("const arcG=new T.Group(),lanG=new T.Group();vm.add(arcG,lanG);","const mfl=new T.PointLight(","""const arcG=new T.Group(),lanG=new T.Group();vm.add(arcG,lanG);
const emitMat=bas({color:0x50cdc3});
MAT.glove=std({color:0x1b2428,roughness:.85});MAT.sleeve=std({color:0x2f5560,roughness:.6,metalness:.3});
const reticleMat=bas({color:0x8fe6ff,transparent:true,opacity:.9,depthWrite:false,blending:T.AdditiveBlending});
const VK=fn=>inst(bake(fn),false);
function armsKit(a,fgz){a(GEO.box,MAT.glove,.11,.12,.13,.02,-.21,.25);a(GEO.box,MAT.glove,.05,.1,.12,-.06,-.17,.2);a(GEO.box,MAT.sleeve,.16,.16,.22,.06,-.33,.3,.5,0,0);
  a(GEO.box,MAT.glove,.13,.09,.16,-.02,-.15,fgz);a(GEO.box,MAT.glove,.04,.08,.13,.07,-.1,fgz);a(GEO.box,MAT.sleeve,.15,.15,.6,-.28,-.34,fgz+.32,.3,.75,0)}
// Arc Welder: a compact energy auto-rifle with a spinning coil barrel
arcG.add(VK(a=>{const G=MAT.gun,D=MAT.gunD,AM=MAT.amber;
  a(GEO.box,G,.17,.19,.5,0,0,.08);a(GEO.box,D,.19,.06,.46,0,.12,.06);for(let i=0;i<7;i++)a(GEO.box,D,.05,.02,.035,0,.16,-.12+i*.055);
  a(GEO.box,G,.16,.1,.18,0,.06,-.22,-.35,0,0);a(GEO.box,G,.12,.13,.3,0,0,-.33);
  for(const s of[-1,1]){a(GEO.box,AM,.006,.03,.34,s*.087,-.02,.1);for(let i=0;i<4;i++)a(GEO.box,D,.006,.09,.02,s*.087,.03,.14+i*.04);for(let i=0;i<3;i++)a(GEO.box,D,.005,.07,.05,s*.062,0,-.28-i*.07)}
  a(GEO.box,D,.13,.04,.3,0,-.09,-.33);a(GEO.cyl,D,.032,.5,.032,0,.01,-.62,1.571,0,0);a(GEO.cyl,D,.05,.09,.05,0,.01,-.86,1.571,0,0);for(const s of[-1,1])a(GEO.box,D,.02,.05,.06,s*.05,.01,-.86);
  a(GEO.box,D,.1,.2,.12,0,-.19,-.04,.25,0,0);a(GEO.box,D,.08,.24,.11,0,-.2,.24,-.3,0,0);a(GEO.box,D,.02,.02,.14,0,-.11,.13);a(GEO.box,D,.02,.07,.02,0,-.145,.07);
  a(GEO.box,G,.1,.12,.16,0,-.02,.37);a(GEO.box,D,.11,.04,.14,0,-.1,.38);
  a(GEO.box,D,.07,.05,.13,0,.18,0);for(const s of[-1,1])a(GEO.box,D,.012,.08,.012,s*.045,.24,-.04);a(GEO.box,D,.1,.012,.012,0,.28,-.04);a(GEO.box,AM,.03,.015,.04,0,.2,.06);
  armsKit(a,-.3)}));
const arcSpin=new T.Group();arcSpin.position.set(0,.01,-.62);arcG.add(arcSpin);
arcSpin.add(VK(a=>{for(let i=0;i<4;i++)a(GEO.tor,emitMat,.065,.065,.065,0,0,-.12+i*.07);for(let i=0;i<6;i++){const r=i/6*6.283;a(GEO.box,MAT.gunD,.012,.05,.26,Math.cos(r)*.07,Math.sin(r)*.07,0,0,0,r)}}));
arcG.add(VK(a=>a(GEO.box,emitMat,.104,.14,.02,0,-.19,.02,.25,0,0)),mesh(GEO.ring,reticleMat,.03,.03,.03,0,.24,-.04));
// Briar Lance: a living precision rail with twin prongs, capacitor vials and a vine grown through the frame
lanG.add(VK(a=>{const G=MAT.lance,D=MAT.gunD;
  a(GEO.box,G,.15,.18,.46,0,0,.12);a(GEO.box,D,.17,.05,.6,0,.11,.02);a(GEO.box,D,.08,.2,.1,0,-.18,-.02,.15,0,0);a(GEO.box,D,.08,.24,.11,0,-.2,.26,-.3,0,0);a(GEO.box,D,.02,.02,.14,0,-.11,.15);
  a(GEO.box,G,.1,.13,.16,0,-.02,.37);a(GEO.box,D,.11,.05,.12,0,.04,.38);a(GEO.box,G,.13,.1,.2,0,0,-.18);
  a(GEO.cyl,D,.045,.34,.045,0,.2,.04,1.571,0,0);a(GEO.cyl,D,.058,.07,.058,0,.2,-.15,1.571,0,0);a(GEO.cyl,D,.052,.06,.052,0,.2,.21,1.571,0,0);for(const z of[-.06,.12])a(GEO.box,D,.04,.07,.04,0,.15,z);
  for(let i=0;i<9;i++){const t=i/8,an=t*9;a(GEO.ico,i%2?MAT.leaf:MAT.leafD,.035,.03,.05,Math.cos(an)*.1,Math.sin(an)*.11,.32-t*.62,0,an,0)}
  for(let i=0;i<5;i++){const an=i*1.9;a(GEO.cone,MAT.leafD,.012,.06,.012,Math.cos(an)*.12,Math.sin(an)*.12,.25-i*.12,0,0,an-1.571)}
  for(let i=0;i<3;i++){a(GEO.cyl,MAT.cell,.028,.1,.028,.09,-.02,.2-i*.1);a(GEO.cyl,D,.032,.02,.032,.09,.04,.2-i*.1);a(GEO.cyl,D,.032,.02,.032,.09,-.08,.2-i*.1)}
  armsKit(a,-.12)}));
const lanTop=J(lanG,0,.055,0),lanBot=J(lanG,0,-.055,0);
for(const[j,s]of[[lanTop,1],[lanBot,-1]])j.add(VK(a=>{a(GEO.box,MAT.lance,.05,.05,.7,0,0,-.6);a(GEO.cone,MAT.amber,.03,.12,.03,0,0,-1.0,-1.571,0,0);a(GEO.box,MAT.gunD,.07,.02,.12,0,s*.03,-.38)}));
const lanCore=mesh(GEO.box,MAT.cell,.02,.04,.66,0,0,-.58);lanG.add(lanCore,mesh(GEO.ring,reticleMat,.045,.045,.045,0,.2,-.19));
const muzzle=new T.Object3D();muzzle.position.set(0,.01,-.92);vm.add(muzzle);
""")
rep("const mglow=glow(0xdffcff,0.9,0.6);mglow.position.set(0,0,-0.62);","const mglow=glow(0xdffcff,0.9,0.6);mglow.position.set(0,0.01,-0.94);")
rep("    arcG.visible=weapon===0;lanG.visible=weapon===1;","""    arcG.visible=weapon===0;lanG.visible=weapon===1;
    arcSpin.rotation.z+=dt*(firing&&weapon===0&&!over?22:1.2);const pr=weapon===1?Math.min(1,recoil*.6)*.03:0;lanTop.position.y=.055+pr;lanBot.position.y=-.055-pr;
    lanCore.scale.set(1+(flash>0&&weapon===1?Math.random()*1.5:0),1,1);muzzle.position.z=weapon?-1.02:-.92;mglow.position.z=muzzle.position.z-.02;""")
open(p,'w').write(s)
print('ok',len(s))
