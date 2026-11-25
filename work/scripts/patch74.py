p='/home/user/greenhouse-nine/index.html'
s=open(p).read()
def cut(a,b):
  global s
  i=s.index(a);j=s.index(b,i);return i,j
# ---- matriarch
i,j=cut("function bossModel(){","const EB=()=>")
s=s[:i]+r"""function bossModel(){const CM=charMats(),g=new T.Group(),A1=CM.plate[0],A2=CM.joint,AM=MAT.amber,GD=MAT.gunD,rag=[];
  g.add(mesh(chex(3.2,1.4,.12),A2,1,1,1),mesh(chex(3.45,.3,.08),A1,1,1,1,0,.55,0),mesh(GEO.sph,A2,2.3,1.2,2.3,0,-.75,0),mesh(GEO.hex,AM,3.48,.08,3.48,0,.32,0));
  g.add(CBm(A1,1.6,1.4,2.2,0,1.3,-.6),mesh(GEO.box,MAT.strip,1.62,.12,1.4,0,1.55,-.3),CBm(A2,2.8,.3,.6,0,.9,1.6));
  greeble(g,'bgM2',(a,R)=>{for(const s of[-1,1]){R(A2,.25,1.2,1.8,s*.92,1.3,-.6,0,0,0,.05);for(let k=0;k<4;k++)R(A1,.06,.9,.06,s*1.06,1.3,-1.3+k*.45,0,0,0,.015);a(GEO.cyl,A2,.12,1.6,.12,s*.6,.9,1.0,1.571,0,0)}
    for(let k=0;k<5;k++)a(GEO.cyl,A2,.03,.9+k*.2,.03,-.5+k*.25,2.4+k*.1,-1.4);R(A2,1.2,.15,.9,0,2.05,-1.3);for(let i=0;i<12;i++){const t=i/12*6.283;a(GEO.box,A2,.3,.12,.08,Math.sin(t)*2.15,-1.2,Math.cos(t)*2.15,0,t,0)}
    for(let i=0;i<6;i++){const t=i*Math.PI/3+Math.PI/6,sn=Math.sin(t),c=Math.cos(t);R(A2,.5,.5,.4,sn*2.95,0,c*2.95,0,t,0,.06);a(GEO.box,MAT.strip,.5,.04,1.1,sn*2.1,.72,c*2.1,0,t,0);
      a(GEO.cyl,A2,.3,.12,.3,Math.sin(t+.5)*1.2,-1.35,Math.cos(t+.5)*1.2);a(GEO.cyl,AM,.22,.03,.22,Math.sin(t+.5)*1.2,-1.42,Math.cos(t+.5)*1.2)}});
  // armour flaps on the top deck: hinged at the inner edge, they lift to show the glowing core when the shield is down
  const flaps=[];for(let i=0;i<6;i++){const t=i*Math.PI/3+Math.PI/6,f=new T.Group();f.position.set(Math.sin(t)*1.35,.72,Math.cos(t)*1.35);f.rotation.y=t;g.add(f);
    greeble(f,'bgMf',(a,R)=>{R(A1,.9,.14,1.5,0,.07,.75,0,0,0,.05);for(let k=0;k<3;k++)R(A2,.7,.04,.08,0,.16,.3+k*.4,0,0,0,.015);a(GEO.box,AM,.6,.02,.04,0,.15,1.46);a(GEO.cyl,A2,.06,.8,.06,0,0,0,0,0,1.571)});flaps.push(f);rag.push(f)}
  // gimballed thruster pods
  const pods=[];for(let i=0;i<6;i++){const a=i/6*6.283+.52,pd=new T.Group();pd.position.set(Math.cos(a)*3.6,0,Math.sin(a)*3.6);pd.rotation.y=-a;g.add(pd);
    pd.add(mesh(GEO.cyl,A1,.55,1.8,.55,0,-.3,0),mesh(GEO.tor,MAT.strip,.5,.5,.5,0,-1.25,0,1.571,0,0));greeble(pd,'bgMp',(a,R)=>{a(GEO.sph,A2,.45,.45,.45,0,.5,0);for(const y of[.2,-.4,-.9])a(GEO.cyl,A2,.6,.08,.6,0,y,0);R(A1,.25,1.2,.3,.55,-.3,0,0,0,0,.05);R(A1,.25,1.2,.3,-.55,-.3,0,0,0,0,.05);a(GEO.cyl,A2,.42,.15,.42,0,-1.15,0)});
    const q=glow(0x8fe6ff,3,.7);q.position.set(0,-1.4,0);pd.add(q);pods.push(pd);rag.push(pd)}
  const crown=new T.Group();crown.position.set(0,2.05,-.6);g.add(crown);rag.push(crown);
  crown.add(mesh(GEO.cyl,A2,.12,.8,.12,0,.4,0));for(let i=0;i<3;i++){const a=i/3*6.283;crown.add(CBm(A1,1.6,.08,.3,Math.cos(a)*.8,.8,Math.sin(a)*.8),mesh(GEO.sph,AM,.08,.08,.08,Math.cos(a)*1.6,.8,Math.sin(a)*1.6));crown.children[crown.children.length-2].rotation.y=-a}
  greeble(crown,'bgMc',(a,R)=>{a(GEO.cyl,A2,.3,.12,.3,0,.8,0);a(GEO.cyl,AM,.1,.3,.1,0,1.0,0);for(let i=0;i<3;i++){const t=i/3*6.283+1.05;a(GEO.cyl,A2,.02,.6,.02,Math.cos(t)*.25,1.1,Math.sin(t)*.25)}});
  // six tendrils, four armoured segments each, with grabbing claws at the tip
  const tend=[],claws=[];for(let i=0;i<6;i++){const a=i/6*6.283;let par=g;const ch=[];
    for(let k=0;k<4;k++){const sg=new T.Group();if(k)sg.position.set(0,-0.85,0);else sg.position.set(Math.cos(a)*1.6,-1.7,Math.sin(a)*1.6);par.add(sg);
      sg.add(mesh(GEO.cyl,GD,.07,.85,.07,0,-.42,0),CBm(A1,.2-k*.025,.36,.2-k*.025,0,-.45,0),mesh(GEO.sph,A2,.13,.13,.13,0,-.85,0));
      if(k===3)for(const s of[-1,1]){const cg=new T.Group();cg.position.set(s*.1,-.9,0);sg.add(cg);const c=mesh(GEO.cone,AM,.08,.4,.08,0,-.15,0);c.rotation.z=Math.PI;cg.add(c,CBm(A2,.06,.14,.1,0,0,0));cg.userData.s=s;claws.push(cg)}
      ch.push(sg);rag.push(sg);par=sg}tend.push(ch)}
  // mandibles with a second hinged jaw
  const mand=[];for(const s of[-1,1]){const m=new T.Group();m.position.set(s*1.2,-.5,2.6);m.userData.s=s;g.add(m);m.add(CBm(A2,.3,.3,1.6,0,0,.7));
    greeble(m,'bgMm'+s,(a,R)=>{R(A1,.42,.38,.8,0,.04,.35,0,0,0,.06);a(GEO.cyl,A2,.05,1.0,.05,s*.2,.18,.6,1.571,0,0);for(let k=0;k<3;k++)a(GEO.box,AM,.02,.05,.1,s*.22,0,.1+k*.25)});
    const jw=new T.Group();jw.position.set(0,0,1.45);m.add(jw);jw.add(mesh(GEO.sph,A2,.2,.2,.2),CBm(A1,.26,.22,.6,0,0,.3));const c=mesh(GEO.cone,AM,.16,.6,.16,-s*.06,0,.75);c.rotation.x=1.571;jw.add(c);m.userData.j=jw;mand.push(m);rag.push(m)}
  const iris=new T.Group();iris.position.set(0,0,3.05);g.add(iris);rag.push(iris);iris.add(mesh(GEO.sph,MAT.eyeA,.9,.9,.5),mesh(GEO.tor,A2,.62,.62,.62,0,0,.32));
  const pupil=mesh(GEO.sph,MAT.dark,.4,.4,.2,0,0,.4);iris.add(pupil);const lids=[];for(const s of[-1,1]){const l=CBm(A2,2.0,.35,.5,0,s*.95,.15);iris.add(l);lids.push([l,s])}
  const wings=[],parts=[];g.traverse(o=>{if(o.isMesh){o.castShadow=true;parts.push([o,o.material])}});
  const gl=glow(0xffb238,7,0.8);gl.position.set(0,0,3.5);g.add(gl);
  const rig={rag,anim(e,t,dt){const V=e.vuln>0;crown.rotation.y+=dt*(V?.3:1.2);
    for(let i=0;i<6;i++)for(let k=0;k<4;k++){const sg=tend[i][k];sg.rotation.x=Math.sin(t*1.4+i+k*.7)*(.22+k*.04);sg.rotation.z=Math.cos(t*1.1+i*1.3+k*.6)*(.18+k*.04)}
    for(const c of claws)c.rotation.z=c.userData.s*(.35+.35*Math.sin(t*3+c.id));
    const o=V?.5:.1+Math.abs(Math.sin(t*3))*.25;for(const m of mand){m.rotation.y=-m.userData.s*o;m.userData.j.rotation.y=-m.userData.s*o*.9}
    for(let i=0;i<6;i++){pods[i].rotation.x=Math.sin(t*.8+i)*.2;pods[i].rotation.z=Math.cos(t*.7+i*1.7)*.2;const f=flaps[i],tg=V?-.75:-.04*(1+Math.sin(t*2+i));f.rotation.x+=(tg-f.rotation.x)*Math.min(1,dt*4)}
    for(const[l,s]of lids){const tg=s*(V?1.25:.62);l.position.y+=(tg-l.position.y)*Math.min(1,dt*5)}
    pupil.position.x=Math.sin(t*.8)*.15;pupil.position.y=Math.cos(t*1.1)*.1;iris.scale.setScalar(1+(V?Math.sin(t*12)*.06:0))}};
  return{g,wings,parts,rig}}
"""+s[j:]
# ---- colossus
i,j=cut("function colossusModel(){","function widowModel(){")
s=s[:i]+r"""function colossusModel(){const CM=charMats(),g=new T.Group(),A1=CM.plate[6],A2=CM.joint,AM=MAT.amber,rag=[];const B=(m,sx,sy,sz,x,y,z,par=g)=>{const o=m===A1||m===A2?CBm(m,sx,sy,sz,x,y,z):mesh(GEO.box,m,sx,sy,sz,x,y,z);par.add(o);return o};
  B(A1,4.2,3,2.8,0,.8,0);B(A2,3.4,1.2,2.4,0,-.9,0);B(AM,3.7,.15,.32,0,1.7,1.5);B(AM,3.7,.15,.32,0,.1,1.5);B(A2,2.6,2.4,1.2,0,1,-1.9);B(MAT.strip,3.0,1.2,.1,0,.9,1.33);
  for(const x of[-.8,.8]){g.add(mesh(GEO.cyl,A2,.35,2.2,.35,x,3,-2.1));const q=glow(0xff8a3a,2.2,.8);q.position.set(x,4.2,-2.1);g.add(q)}
  // chest doors: hinged at the outer edges, they swing open when the armour is down
  const doors=[];for(const s of[-1,1]){const d=new T.Group();d.position.set(s*1.8,.9,1.45);g.add(d);B(A2,1.8,1.8,.3,-s*.9,0,0,d);greeble(d,'bgCd'+s,(a,R)=>{for(let k=0;k<3;k++)R(A1,1.5,.12,.1,-s*.95,-.55+k*.55,.18,0,0,0,.03);a(GEO.cyl,A2,.1,1.8,.1,0,0,0)});doors.push([d,s]);rag.push(d)}
  const head=new T.Group();head.position.set(0,2.6,.4);g.add(head);rag.push(head);B(A2,1.4,1,1.4,0,.4,0,head);B(MAT.eye,1.1,.18,.1,0,.45,.72,head);B(A1,1.6,.25,1.6,0,.95,0,head);
  greeble(head,'bgCH',(a,R)=>{for(const s of[-1,1]){R(A1,.2,.7,1.2,s*.78,.4,0,0,0,0,.05);a(GEO.cyl,A2,.05,.6,.05,s*.5,1.3,-.4)}R(A2,1.0,.12,.3,0,.18,.68,0,0,0,.04);a(GEO.sph,A2,.35,.35,.35,0,-.05,0)});
  for(const s of[-1,1])B(A1,1.6,1,1.8,s*2.7,2,0);
  const arms=[];for(const s of[-1,1]){const sh=new T.Group();sh.position.set(s*2.7,1.3,0);g.add(sh);B(A2,.9,2.2,.9,0,-1.1,0,sh);const el=new T.Group();el.position.set(0,-2.2,0);sh.add(el);
    const c=mesh(GEO.cyl,A2,.42,2.6,.42,0,-.2,1.1);c.rotation.x=Math.PI/2;el.add(c);const r=mesh(GEO.cyl,AM,.48,.3,.48,0,-.2,2.4);r.rotation.x=Math.PI/2;el.add(r);
    const brl=new T.Group();brl.position.set(0,-.2,2.45);el.add(brl);greeble(brl,'bgCb',(a,R)=>{for(let k=0;k<6;k++){const an=k*Math.PI/3;a(GEO.cyl,A2,.08,1.0,.08,Math.cos(an)*.24,Math.sin(an)*.24,.4,1.571,0,0)}a(GEO.cyl,A1,.36,.12,.36,0,0,.15,1.571,0,0);a(GEO.cyl,A1,.34,.1,.34,0,0,.82,1.571,0,0)});
    arms.push([sh,el,brl,s]);rag.push(sh,el)}
  const legs=[];for(const s of[-1,1]){const hip=new T.Group();hip.position.set(s*1.4,-1.4,0);g.add(hip);B(A1,1.1,2.6,1.3,0,-1.2,0,hip);const kn=new T.Group();kn.position.set(0,-2.4,0);hip.add(kn);
    B(A2,.9,2.4,1,0,-1.1,0,kn);B(A1,1.2,.5,.4,0,-.2,.6,kn);const an=new T.Group();an.position.set(0,-2.15,0);kn.add(an);B(A2,1.4,.4,2.2,0,-.15,.3,an);B(A1,1.2,.25,.8,0,.12,1.0,an);legs.push([hip,kn,an]);rag.push(hip,kn,an)}
  greeble(g.children[0],'bgC',(a,R)=>{for(const s of[-1,1]){for(let k=0;k<4;k++)R(A2,.08,2.4,.1,s*(.5+k*.42),0,1.42,0,0,0,.02);R(A1,.9,.6,.2,s*1.6,1.1,1.45,-.25,0,0,.06);a(GEO.cyl,A2,.18,1.6,.18,s*2.15,0,-.6);a(GEO.cyl,A1,.22,.1,.22,s*2.15,.5,-.6);a(GEO.cyl,A1,.22,.1,.22,s*2.15,-.5,-.6)}
    for(let k=0;k<6;k++)R(A2,2.2,.06,.12,0,.2+k*.28,-2.52,0,0,0,.02);R(A1,4.3,.3,2.9,0,1.6,0,0,0,0,.1);for(const x of[-1.4,1.4])R(A2,.6,.12,.6,x,1.82,-.3,0,0,0,.04)});
  for(const[sh,el]of arms){greeble(sh,'bgCa',(a,R)=>{R(A1,1.3,.8,1.3,0,-.2,0,0,0,0,.1);a(GEO.cyl,A2,.12,1.6,.12,.48,-1.1,.3);a(GEO.sph,A2,.55,.55,.55,0,-2.2,0)});
    greeble(el,'bgCe',(a,R)=>{for(const z of[.5,1.0,1.5])a(GEO.cyl,A1,.5,.12,.5,0,-.2,z,1.571,0,0);R(A2,.6,.5,.9,0,.25,.6,0,0,0,.06);a(GEO.box,AM,.04,.04,1.6,.32,-.2,1.2)})}
  for(const[hip,kn,an]of legs){greeble(hip,'bgCh',(a,R)=>{a(GEO.sph,A2,.6,.6,.6,0,0,0);R(A2,.3,1.8,.3,0,-1.2,-.75,0,0,0,.05);R(A1,1.25,.7,.25,0,-.6,.72,.15,0,0,.06)});
    greeble(kn,'bgCk',(a,R)=>{a(GEO.sph,A2,.55,.55,.55,0,0,0);a(GEO.cyl,A2,.1,1.6,.1,0,-1.1,-.6)});
    greeble(an,'bgCf',(a,R)=>{a(GEO.sph,A2,.42,.42,.42,0,0,0);for(const s of[-1,1])R(A2,.3,.3,.6,s*.5,-.15,1.3,0,0,0,.05);a(GEO.box,AM,.9,.06,.06,0,.05,1.42);R(A2,1.0,.3,.4,0,-.2,-.9,0,0,0,.05)})}
  const iris=new T.Group();iris.position.set(0,.8,1.65);g.add(iris);rag.push(iris);iris.add(mesh(GEO.sph,MAT.eyeA,.75,.75,.4),mesh(GEO.tor,A2,.55,.55,.55,0,0,.25));const pupil=mesh(GEO.sph,MAT.dark,.32,.32,.15,0,0,.33);iris.add(pupil);
  const parts=[];g.traverse(o=>{if(o.isMesh){o.castShadow=true;parts.push([o,o.material])}});const gl=glow(0xffb238,4,.7);gl.position.set(0,.8,2.1);g.add(gl);
  const body=g.children[0];
  return{g,wings:[],parts,rig:{rag,anim(e,t,dt){const m=e.mv||0,w=t*3.2,V=e.vuln>0;for(let i=0;i<2;i++){const[h,k,an]=legs[i],q=w+(i?Math.PI:0);h.rotation.x=-Math.sin(q)*.35*m+Math.sin(t*.9)*.03;k.rotation.x=Math.max(0,Math.sin(q+1.2))*.5*m+.04;an.rotation.x=-(h.rotation.x+k.rotation.x)}
    body.position.y=.8+Math.abs(Math.sin(w))*.15*m;body.rotation.y=Math.sin(t*.45)*.1;e.kick=Math.max(0,(e.kick||0)-dt*3);
    for(const[sh,el,brl,s]of arms){sh.rotation.x=-1.2-e.kick*.3+Math.sin(t*.6+s)*.08;sh.rotation.z=s*.06*Math.sin(t*.5);el.rotation.x=-.3+e.kick*.2+Math.sin(t*.8+s)*.05;brl.rotation.z+=dt*(e.kick>.05?22:2.5)*s}
    for(const[d,s]of doors){const tg=V?s*1.1:0;d.rotation.y+=(tg-d.rotation.y)*Math.min(1,dt*3)}
    head.rotation.y=Math.sin(t*.7)*.3;head.rotation.x=Math.sin(t*.55)*.06;pupil.position.x=Math.sin(t*.9)*.1;iris.scale.setScalar(1+(V?Math.sin(t*12)*.06:0))}}}}
"""+s[j:]
# ---- widow
i,j=cut("function widowModel(){","function mkBoss(")
s=s[:i]+r"""function widowModel(){const CM=charMats(),g=new T.Group(),A1=CM.plate[1],A2=CM.joint,AM=MAT.amber,rag=[];
  {const h=mesh(chex(3.2,1.4,.12),A1,1,1,1);h.scale.z=3.8/3.2;g.add(h,mesh(GEO.hex,A2,3.3,.4,3.9,0,-.7,0),mesh(GEO.sph,A2,2.4,1,2.6,0,.6,-.4),mesh(GEO.hex,AM,3.32,.1,3.92,0,.25,0))}
  const vents=[];for(let i=0;i<4;i++){const v=new T.Group();v.position.set(0,1.2,-1.6+i*.9);g.add(v);v.add(CBm(A2,2.2,.12,.3,0,0,0));vents.push(v)}
  greeble(g,'bgW',(a,R)=>{for(const s of[-1,1]){R(A1,.9,.2,2.6,s*1.6,.78,-.2,0,0,s*.22,.06);for(let k=0;k<5;k++)R(A2,.5,.05,.1,s*1.6,.9,-1.2+k*.5,0,0,s*.22,.02);a(GEO.cyl,A2,.1,2.4,.1,s*2.45,.3,-.2,1.571,0,0)}
    R(A2,1.4,.5,.6,0,.2,-3.2,0,0,0,.08);for(const s of[-1,1]){a(GEO.cyl,A2,.25,.5,.25,s*.45,.2,-3.55,1.571,0,0);a(GEO.cyl,AM,.27,.06,.27,s*.45,.2,-3.8,1.571,0,0)}
    R(A1,1.6,.3,.5,0,-.1,2.9,.3,0,0,.06);for(let i=0;i<10;i++){const t=i/10*6.283;a(GEO.box,A2,.25,.1,.08,Math.sin(t)*2.0,-.95,Math.cos(t)*2.2,0,t,0)}a(GEO.box,MAT.strip,1.9,.04,3.2,0,1.12,-.25)});
  const tur=new T.Group();tur.position.set(0,1.4,.4);g.add(tur);rag.push(tur);tur.add(mesh(GEO.cyl,A2,1.1,.6,1.1),CBm(A1,1.6,.7,1.8,0,.5,.2));
  const brl=[];for(const s of[-1,1]){const b=new T.Group();b.position.set(s*.45,.5,.3);tur.add(b);const c=mesh(GEO.cyl,A2,.2,2.6,.2,0,0,1.3);c.rotation.x=Math.PI/2;b.add(c,mesh(GEO.box,AM,.26,.26,.2,0,0,2.6));brl.push(b)}
  greeble(tur,'bgWt',(a,R)=>{for(const s of[-1,1]){for(const z of[1.0,1.6,2.2])a(GEO.cyl,A1,.27,.12,.27,s*.45,.5,z,1.571,0,0);R(A1,.2,.5,1.4,s*.95,.5,.3,0,0,0,.05)}R(A2,1.2,.18,1.2,0,.94,.0,0,0,0,.05);a(GEO.cyl,A2,.15,.3,.15,.5,1.1,-.4);a(GEO.sph,MAT.eye,.08,.08,.08,.5,1.28,-.4)});
  const iris=new T.Group();iris.position.set(0,.1,3.05);g.add(iris);rag.push(iris);iris.add(mesh(GEO.sph,MAT.eyeA,.7,.7,.4),mesh(GEO.tor,A2,.5,.5,.5,0,0,.22));const pupil=mesh(GEO.sph,MAT.dark,.3,.3,.15,0,0,.3);iris.add(pupil);
  for(const x of[-1.1,1.1])g.add(mesh(GEO.sph,MAT.eye,.22,.22,.15,x,.3,2.95));
  // fangs under the eye
  const fangs=[];for(const s of[-1,1]){const f=new T.Group();f.position.set(s*.75,-.55,2.85);g.add(f);f.add(mesh(GEO.sph,A2,.18,.18,.18),CBm(A1,.18,.5,.2,0,-.25,.05));const c=mesh(GEO.cone,AM,.1,.45,.1,0,-.65,.15);c.rotation.x=Math.PI-.3;f.add(c);fangs.push([f,s]);rag.push(f)}
  const legs=[];const ang=[-.55,0,.55,Math.PI-.55,Math.PI,Math.PI+.55];ang.forEach((a,i)=>{const hip=new T.Group();hip.position.set(Math.cos(a)*2.6,-.2,-Math.sin(a)*2.6);hip.rotation.y=a;g.add(hip);
    const u=CBm(A2,2.8,.4,.5,1.1,.8,0);u.rotation.z=Math.atan2(1.6,2.2);hip.add(u,mesh(GEO.sph,A2,.4,.4,.4));const kn=new T.Group();kn.position.set(2.2,1.6,0);hip.add(kn);
    const pi=mesh(GEO.cyl,A2,.08,2.2,.08,1.1,.6,.3);pi.rotation.z=u.rotation.z+1.571;hip.add(pi);
    const l=CBm(A1,4.4,.45,.55,.55,-2.1,0);l.rotation.z=Math.atan2(-4.4,1.1);const lp=CBm(A1,1.6,.7,.7,.15,-.6,0);lp.rotation.z=l.rotation.z;kn.add(l,lp,mesh(GEO.sph,A2,.42,.42,.42));
    greeble(kn,'bgWk',(a,R)=>{const an=Math.atan2(-4.4,1.1);for(const d of[1.4,2.4,3.4])a(GEO.box,AM,.04,.12,.6,Math.cos(an)*d+.1,Math.sin(an)*d,0,0,0,0);a(GEO.cyl,A2,.06,3,.06,.75,-2,.32,0,0,an+1.571)});
    const ft=new T.Group();ft.position.set(1.15,-4.3,0);kn.add(ft);const cn=mesh(GEO.cone,AM,.25,.6,.25,0,-.25,0);cn.rotation.z=Math.PI;ft.add(cn);
    greeble(ft,'bgWf',(a,R)=>{a(GEO.sph,A2,.3,.3,.3);for(const s of[-1,1])R(A1,.55,.16,.2,.05,-.1,s*.2,0,0,-.5,.04)});legs.push([hip,kn,a,i,ft]);rag.push(hip,kn,ft)});
  const parts=[];g.traverse(o=>{if(o.isMesh){o.castShadow=true;parts.push([o,o.material])}});const gl=glow(0xffb238,3.4,.7);gl.position.set(0,.1,3.4);g.add(gl);
  const sac=g.children[2];
  return{g,wings:[],parts,rig:{rag,anim(e,t,dt){const m=e.mv||0,w=t*6,V=e.vuln>0;for(const[h,k,a,i,ft]of legs){const q=w+(i%2?Math.PI:0);h.rotation.set(0,a+Math.sin(q)*.25*m,Math.max(0,Math.sin(q+1))*.25*m+Math.sin(t*1.5+i)*.03);
      k.rotation.z=-Math.max(0,Math.sin(q+1.5))*.22*m+Math.sin(t*1.2+i*2)*.04;ft.rotation.z=-(h.rotation.z+k.rotation.z)}
    g.children[0].position.y=Math.abs(Math.sin(w))*.08*m;sac.scale.set(2.4,1+Math.sin(t*2.2)*.05,2.6);e.kick=Math.max(0,(e.kick||0)-dt*8);tur.position.z=.4-e.kick*.15;tur.rotation.y=Math.sin(t*.5)*.35;
    for(const b of brl)b.position.z=.3-e.kick*.3;for(let i=0;i<4;i++)vents[i].rotation.x+=((V?-.9:-.05-Math.sin(t*3+i)*.05)-vents[i].rotation.x)*Math.min(1,dt*4);
    for(const[f,s]of fangs){f.rotation.x=.15+Math.sin(t*2.6)*.15;f.rotation.z=s*(.1+Math.abs(Math.sin(t*1.7))*.25)}
    pupil.position.x=Math.sin(t*1.3)*.12;iris.scale.setScalar(1+(V?Math.sin(t*12)*.06:0))}}}}

"""+s[j:]
# ---- ragdoll for bosses
a="const C={parts:[],cons:[],t:10,objs:[],stat:addStatics(e.pos.x,e.pos.z),thud:0,h0:e.pos.y},S=e.rig&&e.rig.segs,heavy=e.type===6?1.6:e.type===7?.8:1;\n  if(S){"
assert s.count(a)==1
s=s.replace(a,"""const C={parts:[],cons:[],t:e.type===3?14:10,objs:[],stat:addStatics(e.pos.x,e.pos.z),thud:0,h0:e.pos.y},S=e.rig&&e.rig.segs,RG=e.rig&&e.rig.rag,heavy=e.type===6?1.6:e.type===7?.8:1;
  if(RG){// bosses: every jointed part becomes a body pinned to its parent part at the joint; the hull and anything bolted to it is one heavy core
    e.g.updateMatrixWorld(true);const set=new Set(RG),par=new Map(),jw=new Map(),up=new Map();
    for(const o of RG){let p=o.parent;while(p&&p!==e.g&&!set.has(p))p=p.parent;par.set(o,set.has(p)?p:null);jw.set(o,o.getWorldPosition(new T.Vector3()));up.set(o,new T.Vector3(0,1,0).applyQuaternion(o.getWorldQuaternion(new T.Quaternion())))}
    const core=new T.Group();e.g.getWorldPosition(core.position);e.g.getWorldQuaternion(core.quaternion);scene.add(core);
    for(const o of RG)scene.attach(o);for(const c of[...e.g.children])core.attach(c);scene.remove(e.g);
    const B=new Map(),cq=partBody(core,1.2,vel);B.set(null,cq);C.parts.push(cq);C.objs.push(core);
    for(const o of RG){const q=partBody(o,.7,vel);B.set(o,q);C.parts.push(q);C.objs.push(o)}
    for(const o of RG){const P=B.get(par.get(o)),Q=B.get(o),w=jw.get(o),v=new CN.Vec3(w.x,w.y,w.z),u=up.get(o),U=new CN.Vec3(u.x,u.y,u.z);
      const c=CN.ConeTwistConstraint?new CN.ConeTwistConstraint(P.b,Q.b,{pivotA:P.b.pointToLocalFrame(v),pivotB:Q.b.pointToLocalFrame(v),axisA:P.b.quaternion.inverse().vmult(U),axisB:Q.b.quaternion.inverse().vmult(U),angle:.9,twistAngle:.4,maxForce:1e7})
        :new CN.PointToPointConstraint(P.b,P.b.pointToLocalFrame(v),Q.b,Q.b.pointToLocalFrame(v));PW.addConstraint(c);C.cons.push(c)}
    const K=cq.b;K.applyImpulse(new CN.Vec3(dir.x*3*K.mass,2*K.mass,dir.z*3*K.mass),new CN.Vec3(K.position.x,K.position.y+1.5,K.position.z));K.angularVelocity.set(dir.z*1.2,(Math.random()-.5)*.6,-dir.x*1.2);
    for(const q of C.parts){q.b.allowSleep=false;q.b.angularDamping=.2;q.b.linearDamping=.03;if(q!==cq)q.b.applyImpulse(new CN.Vec3((Math.random()-.5)*4*q.b.mass,2*q.b.mass,(Math.random()-.5)*4*q.b.mass),q.b.position)}
    sfx('boom');shake=Math.max(shake,reduced?0:.4);for(let k=0;k<3;k++)sparkle(new T.Vector3(e.pos.x+(Math.random()-.5)*4,e.pos.y+(Math.random()-.5)*2,e.pos.z+(Math.random()-.5)*4),[0xffb238,0xff8a3a,0xffffff][k],24,9)}
  else if(S){""")
a="e.dying=0.001;if(e.type===11)detonate(e.pos.clone());if(e.type!==3&&e.type!==4)ragdoll(e);"
assert s.count(a)==1
s=s.replace(a,"e.dying=0.001;if(e.type===11)detonate(e.pos.clone());if(e.type!==4)ragdoll(e);")
open(p,'w').write(s);print('ok')
