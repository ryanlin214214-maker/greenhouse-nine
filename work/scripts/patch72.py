p='/home/user/greenhouse-nine/index.html'
s=open(p).read()
def rep(a,b,cnt=1):
  global s
  assert s.count(a)==cnt,(s.count(a),a[:80]); s=s.replace(a,b)
# ---- drones
i=s.index("function droneRig(g,v)");j=s.index("  return{wings:[],anim(e,t,dt){for(const r of rotors)")
NEW=r"""function droneRig(g,v){const b=new T.Group();b.scale.setScalar(v===2?2:1);g.add(b);const CM=charMats(),n='dr'+v,A1=CM.plate[0],A2=CM.joint,AM=MAT.amber,EY=v===2?MAT.eyeA:MAT.eye;
  const rotors=[];let ring=null,muz=null,cannon=null;GEO.frus=GEO.frus||new T.CylinderGeometry(.8,1,1,20);
  const rotor=(x,y,z,r)=>{const j=J(b,x,y,z);put(j,'rot'+r,a=>{a(GEO.box,A2,r*2,.012,.035);a(GEO.box,A2,.035,.012,r*2);a(GEO.cyl,A2,.03,.04,.03)});j.add(mesh(GEO.cyl,MAT.blur,r,.005,r));rotors.push(j)};
  if(v!==1){
    put(b,n+'H',a=>{const R=rb(a);R(A1,.26,.16,.5,0,0,0,0,0,0,.04);R(A1,.2,.05,.34,0,.1,-.02);R(A2,.3,.04,.2,0,.06,-.12);for(let i=0;i<3;i++)R(A2,.16,.012,.03,0,.128,-.1+i*.06,0,0,0,.004);
      a(GEO.cyl,A2,.1,.07,.1,0,0,.25,1.571,0,0);a(GEO.cyl,A1,.115,.03,.115,0,0,.225,1.571,0,0);R(A2,.16,.07,.22,0,-.1,-.04);for(const s of[-1,1]){a(GEO.cone,AM,.02,.14,.02,s*.06,-.16,.14,2.6,0,0);a(GEO.box,AM,.012,.02,.26,s*.131,.0,.02)}
      a(GEO.cyl,A2,.008,.22,.008,-.08,.19,-.15);a(GEO.sph,AM,.018,.018,.018,-.08,.3,-.15);
      for(const sx of[-1,1])for(const sz of[-1,1]){const x=sx*.36,z=sz*.3,L=Math.hypot(x,z);R(A2,.05,.04,L-.1,x/2,.02,z/2,0,Math.atan2(x,z),0,.01);a(GEO.tor,A1,.15,.15,.15,x,.06,z,1.571,0,0);a(GEO.cyl,A2,.05,.08,.05,x,.03,z);a(GEO.sph,AM,.016,.016,.016,x+sx*.16,.06,z)}
      if(v===2){R(A1,.42,.06,.3,0,.15,-.05);R(A2,.3,.03,.2,0,.19,-.05);for(const s of[-1,1]){R(A2,.07,.07,.16,s*.14,-.1,.1);a(GEO.cyl,A2,.035,.4,.035,s*.14,-.1,.24,1.571,0,0);for(const z of[.24,.32])a(GEO.cyl,A1,.045,.03,.045,s*.14,-.1,z,1.571,0,0);a(GEO.box,AM,.04,.04,.04,s*.14,-.1,.43)}}},true);
    put(b,n+'E',a=>a(GEO.sph,EY,.075,.075,.05,0,0,.29));
    for(const sx of[-1,1])for(const sz of[-1,1])rotor(sx*.36,.09,sz*.3,.14)}
  else{
    put(b,n+'H',a=>{const R=rb(a);a(GEO.frus,A1,.32,.12,.32,0,.01,0);a(GEO.cyl,A2,.34,.04,.34,0,-.06,0);a(GEO.sph,A2,.2,.12,.2,0,.07,0);a(GEO.box,AM,.05,.02,.2,0,.12,.1);a(GEO.cyl,A2,.12,.05,.12,0,-.1,0);
      for(let i=0;i<8;i++){const an=i*Math.PI/4;R(A2,.025,.02,.12,Math.sin(an)*.25,.07,Math.cos(an)*.25,0,an,0,.006)}
      for(const s of[-1,1]){R(A2,.2,.05,.08,s*.32,0,0);a(GEO.tor,A1,.16,.16,.16,s*.48,0,0,1.571,0,0);a(GEO.cyl,A2,.04,.06,.04,s*.48,0,0);a(GEO.sph,AM,.016,.016,.016,s*.66,0,0)}},true);
    ring=J(b,0,.02,0);put(ring,'sdRing',a=>{a(GEO.tor,A2,.36,.36,.36,0,0,0,1.571,0,0);for(let i=0;i<4;i++){const r=i*1.571;a(GEO.box,MAT.strip,.04,.03,.04,Math.cos(r)*.36,0,Math.sin(r)*.36)}});
    cannon=J(b,0,-.13,.08);put(cannon,'sdGun',a=>{const R=rb(a);R(A2,.12,.1,.18);R(A1,.13,.04,.14,0,.06,0);a(GEO.cyl,A2,.035,.36,.035,0,0,.24,1.571,0,0);a(GEO.cyl,A1,.05,.06,.05,0,0,.42,1.571,0,0)});
    muz=mesh(GEO.sph,MAT.eye,.05,.05,.05,0,0,.46);cannon.add(muz);
    for(const s of[-1,1])rotor(s*.48,.01,0,.13)}
"""
s=s[:i]+NEW+s[j:]
# ---- crawler
i=s.index("function crawlerRig(g){");j=s.index("  return{anim(e,t,dt){const m=e.mv||0,w=t*7+e.ph;")
NEW=r"""function crawlerRig(g){const CM=charMats(),A1=CM.plate[0],A2=CM.joint,AM=MAT.amber;
  const body=J(g,0,0,0);put(body,'crB',a=>{const R=rb(a);R(A1,1.2,.3,1.4,0,0,-.05,0,0,0,.07);R(A1,1.0,.16,.36,0,.06,.66,-.45,0,0,.05);R(A2,.95,.1,1.15,0,-.2,0);
    R(A2,.42,.14,.1,0,.0,.84);for(const x of[-.12,0,.12])a(GEO.sph,MAT.eye,.05,.05,.04,x,.02,.89);a(GEO.box,AM,.8,.03,.04,0,.165,.45);
    for(let i=0;i<3;i++)R(A2,.5,.035,.06,0,.165,-.25-i*.15,0,0,0,.01);for(const s of[-1,1]){R(A1,.08,.22,1.1,s*.64,-.05,0,0,0,s*.15);a(GEO.cyl,A2,.05,.25,.05,s*.38,.25,-.6);a(GEO.cyl,AM,.055,.03,.055,s*.38,.38,-.6);R(A2,.2,.08,.12,s*.4,.17,.3)}},true);
  {const q=glow(0xff3b3b,1.2,.7);q.position.set(0,.02,.9);body.add(q)}
  const tur=J(body,0,.22,-.1);put(tur,'crTu',a=>{const R=rb(a);a(GEO.cyl,A2,.35,.18,.35);R(A1,.34,.2,.32,0,.18,0);for(const s of[-1,1])R(A1,.06,.18,.3,s*.2,.18,0,0,0,s*.12);a(GEO.cyl,A2,.08,.03,.08,0,.29,-.06)});
  const tube=J(tur,0,.2,0);tube.rotation.x=-.9;put(tube,'crTb',a=>{const R=rb(a);a(GEO.cyl,A2,.13,.9,.13,0,0,.4,1.571,0,0);for(const z of[.12,.3,.6])a(GEO.cyl,A1,.15,.05,.15,0,0,z,1.571,0,0);a(GEO.cyl,AM,.15,.08,.15,0,0,.84,1.571,0,0);R(A2,.36,.08,.1,0,0,.93)});
  const legs=[];for(const sx of[-1,1])for(const sz of[-1,1]){const hip=J(body,sx*.55,-.05,sz*.55);hip.scale.x=sx;hip.userData.d=sx*sz;
    put(hip,'crU',a=>{const R=rb(a),an=Math.atan2(.35,.45);a(GEO.sph,A2,.1,.1,.1);R(A1,.57,.12,.14,.225,.175,0,0,0,an,.03);a(GEO.cyl,A2,.025,.4,.025,.2,.1,.09,0,0,an-1.571)});const kn=J(hip,.45,.35,0);
    put(kn,'crL',a=>{const R=rb(a),an=Math.atan2(-1.3,.15);a(GEO.sph,A2,.09,.09,.09);R(A1,1.31,.12,.14,.075,-.65,0,0,0,an,.03);R(A1,.5,.16,.17,.03,-.3,0,0,0,an,.035);a(GEO.cyl,A2,.12,.06,.12,.15,-1.3,0);a(GEO.box,AM,.02,.2,.02,.07,-.4,.085,0,0,an+1.571)});legs.push([hip,kn])}
"""
s=s[:i]+NEW+s[j:]
# ---- boss helpers
rep("function bossModel(){const g=new T.Group(),A1=MAT.armor,A2=MAT.armorD,AM=MAT.amber;\n  g.add(mesh(GEO.hex,A2,3.2,1.4,3.2),mesh(GEO.hex,A1,3.45,.3,3.45,0,.55,0),mesh(GEO.sph,A2,2.3,1.2,2.3,0,-.75,0),mesh(GEO.hex,AM,3.48,.08,3.48,0,.32,0));\n  g.add(mesh(GEO.box,A1,1.6,1.4,2.2,0,1.3,-.6),mesh(GEO.box,MAT.strip,1.62,.12,1.4,0,1.55,-.3),mesh(GEO.box,A2,2.8,.3,.6,0,.9,1.6));",
"""const CHX={};function chex(r,h,b){const k=[r,h,b].join();if(CHX[k])return CHX[k];const sh=new T.Shape(),q=r-b;for(let i=0;i<6;i++){const t=i*Math.PI/3;sh[i?'lineTo':'moveTo'](Math.sin(t)*q,-Math.cos(t)*q)}
  const g=new T.ExtrudeGeometry(sh,{depth:Math.max(.01,h-2*b),bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:1,steps:1});g.rotateX(-Math.PI/2);g.translate(0,-Math.max(.01,h-2*b)/2,0);return CHX[k]=g}
const CBm=(m,w,h,d,x=0,y=0,z=0,b)=>mesh(cbox(w,h,d,b||Math.min(.14,Math.min(w,h,d)*.2)),m,1,1,1,x,y,z);
// boss detail: static greebles baked into one mesh per material and added to a group
function greeble(par,name,fn){const o=inst(kit(name,a=>fn(a,rb(a))),true);par.add(o);return o}
function bossModel(){const CM=charMats(),g=new T.Group(),A1=CM.plate[0],A2=CM.joint,AM=MAT.amber;
  g.add(mesh(chex(3.2,1.4,.12),A2,1,1,1),mesh(chex(3.45,.3,.08),A1,1,1,1,0,.55,0),mesh(GEO.sph,A2,2.3,1.2,2.3,0,-.75,0),mesh(GEO.hex,AM,3.48,.08,3.48,0,.32,0));
  g.add(CBm(A1,1.6,1.4,2.2,0,1.3,-.6),mesh(GEO.box,MAT.strip,1.62,.12,1.4,0,1.55,-.3),CBm(A2,2.8,.3,.6,0,.9,1.6));
  greeble(g,'bgM',(a,R)=>{for(let i=0;i<6;i++){const t=i*Math.PI/3+Math.PI/6,c=Math.cos(t),sn=Math.sin(t);R(A1,.9,.14,1.5,sn*2.1,.78,c*2.1,0,t,0,.05);for(let k=0;k<3;k++)R(A2,.7,.04,.08,sn*(1.6+k*.4),.87,c*(1.6+k*.4),0,t,0,.015);
      R(A2,.5,.5,.4,sn*3.05,0,c*3.05,0,t,0,.06);a(GEO.cyl,A2,.14,.3,.14,sn*3.3,0,c*3.3,1.571,t,0);a(GEO.cyl,AM,.15,.05,.15,sn*3.45,0,c*3.45,1.571,t,0)}
    for(const s of[-1,1]){R(A2,.25,1.2,1.8,s*.92,1.3,-.6,0,0,0,.05);for(let k=0;k<4;k++)R(A1,.06,.9,.06,s*1.06,1.3,-1.3+k*.45,0,0,0,.015);a(GEO.cyl,A2,.12,1.6,.12,s*.6,.9,1.0,1.571,0,0)}
    for(let k=0;k<5;k++)a(GEO.cyl,A2,.03,.9+k*.2,.03,-.5+k*.25,2.4+k*.1,-1.4);R(A2,1.2,.15,.9,0,2.05,-1.3);for(let i=0;i<12;i++){const t=i/12*6.283;a(GEO.box,A2,.3,.12,.08,Math.sin(t)*2.15,-1.2,Math.cos(t)*2.15,0,t,0)}});""")
# colossus: bevelled boxes + plate materials + detail
rep("function colossusModel(){const g=new T.Group(),A1=MAT.armor,A2=MAT.armorD,AM=MAT.amber;const B=(m,sx,sy,sz,x,y,z,par=g)=>{const o=mesh(GEO.box,m,sx,sy,sz,x,y,z);par.add(o);return o};",
"function colossusModel(){const CM=charMats(),g=new T.Group(),A1=CM.plate[6],A2=CM.joint,AM=MAT.amber;const B=(m,sx,sy,sz,x,y,z,par=g)=>{const o=m===A1||m===A2?CBm(m,sx,sy,sz,x,y,z):mesh(GEO.box,m,sx,sy,sz,x,y,z);par.add(o);return o};")
rep("  const iris=new T.Group();iris.position.set(0,.8,1.65);g.add(iris);iris.add(mesh(GEO.sph,MAT.eyeA,.75,.75,.4),mesh(GEO.tor,A2,.55,.55,.55,0,0,.25));const pupil=mesh(GEO.sph,MAT.dark,.32,.32,.15,0,0,.33);iris.add(pupil);\n  const parts=[];g.traverse(o=>{if(o.isMesh){o.castShadow=true;parts.push([o,o.material])}});const gl=glow(0xffb238,4,.7);",
"""  greeble(g.children[0],'bgC',(a,R)=>{for(const s of[-1,1]){for(let k=0;k<4;k++)R(A2,.08,2.4,.1,s*(.5+k*.42),0,1.42,0,0,0,.02);R(A1,.9,.6,.2,s*1.6,1.1,1.45,-.25,0,0,.06);a(GEO.cyl,A2,.18,1.6,.18,s*2.15,0,-.6);a(GEO.cyl,A1,.22,.1,.22,s*2.15,.5,-.6);a(GEO.cyl,A1,.22,.1,.22,s*2.15,-.5,-.6)}
    for(let k=0;k<6;k++)R(A2,2.2,.06,.12,0,.2+k*.28,-2.52,0,0,0,.02);R(A1,4.3,.3,2.9,0,2.2,0,0,0,0,.1);for(const x of[-1.4,0,1.4])R(A2,.6,.12,.6,x,2.42,-.3,0,0,0,.04)},-.8);
  for(const[sh,el]of arms){greeble(sh,'bgCa',(a,R)=>{R(A1,1.3,.8,1.3,0,-.2,0,0,0,0,.1);a(GEO.cyl,A2,.12,1.6,.12,.48,-1.1,.3);a(GEO.sph,A2,.55,.55,.55,0,-2.2,0)});
    greeble(el,'bgCe',(a,R)=>{for(const z of[.5,1.0,1.5])a(GEO.cyl,A1,.5,.12,.5,0,-.2,z,1.571,0,0);R(A2,.6,.5,.9,0,.25,.6,0,0,0,.06);a(GEO.box,AM,.04,.04,1.6,.32,-.2,1.2)})}
  for(const[hip,kn]of legs){greeble(hip,'bgCh',(a,R)=>{a(GEO.sph,A2,.6,.6,.6,0,0,0);R(A2,.3,1.8,.3,0,-1.2,-.75,0,0,0,.05);R(A1,1.25,.7,.25,0,-.6,.72,.15,0,0,.06)});
    greeble(kn,'bgCk',(a,R)=>{a(GEO.sph,A2,.55,.55,.55,0,0,0);a(GEO.cyl,A2,.1,1.6,.1,0,-1.1,-.6);for(const s of[-1,1])R(A2,.3,.3,.6,s*.5,-2.3,1.3,0,0,0,.05);a(GEO.box,AM,.9,.06,.06,0,-2.1,1.42)})}
  const iris=new T.Group();iris.position.set(0,.8,1.65);g.add(iris);iris.add(mesh(GEO.sph,MAT.eyeA,.75,.75,.4),mesh(GEO.tor,A2,.55,.55,.55,0,0,.25));const pupil=mesh(GEO.sph,MAT.dark,.32,.32,.15,0,0,.33);iris.add(pupil);
  const parts=[];g.traverse(o=>{if(o.isMesh){o.castShadow=true;parts.push([o,o.material])}});const gl=glow(0xffb238,4,.7);""")
# widow
rep("function widowModel(){const g=new T.Group(),A1=MAT.armor,A2=MAT.armorD,AM=MAT.amber;\n  g.add(mesh(GEO.hex,A1,3.2,1.4,3.8),mesh(GEO.hex,A2,3.3,.4,3.9,0,-.7,0),mesh(GEO.sph,A2,2.4,1,2.6,0,.6,-.4),mesh(GEO.hex,AM,3.32,.1,3.92,0,.25,0));\n  for(let i=0;i<4;i++)g.add(mesh(GEO.box,A2,2.2,.12,.3,0,1.2,-1.6+i*.9));\n  const tur=new T.Group();tur.position.set(0,1.4,.4);g.add(tur);tur.add(mesh(GEO.cyl,A2,1.1,.6,1.1),mesh(GEO.box,A1,1.6,.7,1.8,0,.5,.2));",
"""function widowModel(){const CM=charMats(),g=new T.Group(),A1=CM.plate[2],A2=CM.joint,AM=MAT.amber;
  {const h=mesh(chex(3.2,1.4,.12),A1,1,1,1);h.scale.z=3.8/3.2;g.add(h,mesh(GEO.hex,A2,3.3,.4,3.9,0,-.7,0),mesh(GEO.sph,A2,2.4,1,2.6,0,.6,-.4),mesh(GEO.hex,AM,3.32,.1,3.92,0,.25,0))}
  for(let i=0;i<4;i++)g.add(CBm(A2,2.2,.12,.3,0,1.2,-1.6+i*.9));
  greeble(g,'bgW',(a,R)=>{for(const s of[-1,1]){R(A1,.9,.2,2.6,s*1.6,.78,-.2,0,0,s*.22,.06);for(let k=0;k<5;k++)R(A2,.5,.05,.1,s*1.6,.9,-1.2+k*.5,0,0,s*.22,.02);a(GEO.cyl,A2,.1,2.4,.1,s*2.45,.3,-.2,1.571,0,0)}
    R(A2,1.4,.5,.6,0,.2,-3.2,0,0,0,.08);for(const s of[-1,1]){a(GEO.cyl,A2,.25,.5,.25,s*.45,.2,-3.55,1.571,0,0);a(GEO.cyl,AM,.27,.06,.27,s*.45,.2,-3.8,1.571,0,0)}
    R(A1,1.6,.3,.5,0,-.1,2.9,.3,0,0,.06);for(let i=0;i<10;i++){const t=i/10*6.283;a(GEO.box,A2,.25,.1,.08,Math.sin(t)*2.0,-.95,Math.cos(t)*2.2,0,t,0)}});
  const tur=new T.Group();tur.position.set(0,1.4,.4);g.add(tur);tur.add(mesh(GEO.cyl,A2,1.1,.6,1.1),CBm(A1,1.6,.7,1.8,0,.5,.2));""")
rep("for(const s of[-1,1]){const c=mesh(GEO.cyl,A2,.2,2.6,.2,s*.45,.5,1.6);c.rotation.x=Math.PI/2;tur.add(c);tur.add(mesh(GEO.box,AM,.26,.26,.2,s*.45,.5,2.9))}",
"for(const s of[-1,1]){const c=mesh(GEO.cyl,A2,.2,2.6,.2,s*.45,.5,1.6);c.rotation.x=Math.PI/2;tur.add(c);tur.add(mesh(GEO.box,AM,.26,.26,.2,s*.45,.5,2.9))}\n  greeble(tur,'bgWt',(a,R)=>{for(const s of[-1,1]){for(const z of[1.0,1.6,2.2])a(GEO.cyl,A1,.27,.12,.27,s*.45,.5,z,1.571,0,0);R(A1,.2,.5,1.4,s*.95,.5,.3,0,0,0,.05)}R(A2,1.2,.18,1.2,0,.94,.0,0,0,0,.05);a(GEO.cyl,A2,.15,.3,.15,.5,1.1,-.4);a(GEO.sph,MAT.eye,.08,.08,.08,.5,1.28,-.4)});")
rep("const u=mesh(GEO.box,A2,2.8,.4,.5,1.1,.8,0);","const u=CBm(A2,2.8,.4,.5,1.1,.8,0);")
rep("const l=mesh(GEO.box,A1,4.8,.45,.55,.6,-2.3,0);l.rotation.z=Math.atan2(-4.6,1.2);kn.add(l);",
"const l=CBm(A1,4.8,.45,.55,.6,-2.3,0);l.rotation.z=Math.atan2(-4.6,1.2);kn.add(l);const lp=CBm(A1,1.6,.7,.7,.15,-.6,0);lp.rotation.z=l.rotation.z;kn.add(lp,mesh(GEO.sph,A2,.42,.42,.42));const pi=mesh(GEO.cyl,A2,.08,2.2,.08,1.1,.6,.3);pi.rotation.z=u.rotation.z+1.571;hip.add(pi);")
open(p,'w').write(s);print('ok')
