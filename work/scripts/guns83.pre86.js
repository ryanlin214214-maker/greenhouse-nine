// ---- first-person guns, rebuilt from side profiles: each part is an outline in the gun's (z, y) plane extruded across x with a
// bevel, so receivers, grips, stocks and magazines have real silhouettes instead of boxes. Gun space: -z is forward, the bore
// sits near y=0, the right hand holds the grip near (0,-.2,.24), the left hand holds the handguard at z = fgz.
const PRF={};function PF(key,pts,w,b,holes){const k=key+'|'+w;if(PRF[k])return PRF[k];const mk=(p,S)=>{S.moveTo(-p[0][0],p[0][1]);for(let i=1;i<p.length;i++)S.lineTo(-p[i][0],p[i][1]);S.closePath();return S};
  const sh=mk(pts,new T.Shape());if(holes)for(const h of holes)sh.holes.push(mk(h,new T.Path()));b=Math.min(b||.006,w*.3);
  const g=new T.ExtrudeGeometry(sh,{depth:Math.max(.001,w-2*b),bevelEnabled:true,bevelThickness:b,bevelSize:b*.8,bevelSegments:2,steps:1,curveSegments:4});g.translate(0,0,-(w-2*b)/2);g.rotateY(Math.PI/2);g.computeVertexNormals();return PRF[k]=g}
MAT.gunL=std({color:0xaab4b8,roughness:.38,metalness:.55});
MAT.gunO=std({color:0xd0702e,roughness:.45,metalness:.3});
MAT.gunP=std({color:0x22262a,roughness:.72,metalness:.12});
MAT.gunB=std({color:0xb08a4a,roughness:.35,metalness:.85});
MAT.lens=std({color:0x0c1820,roughness:.05,metalness:.9,emissive:0x0a2a3a,emissiveIntensity:.4});
// worn metal: fine scratches and grime on every gun material (first person and props)
{const wt=paint(256,(g,S)=>{g.fillStyle='#f0f0f0';g.fillRect(0,0,S,S);grime(g,S,1800,.05);for(let k=0;k<70;k++){const x=hash(k,31)*S,y=hash(k,32)*S,an=hash(k,33)*6.28,l=4+hash(k,34)*22;g.strokeStyle=k%3?'rgba(255,255,255,.18)':'rgba(0,0,0,.14)';g.lineWidth=.7;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(an)*l,y+Math.sin(an)*l);g.stroke()}
    for(let k=0;k<8;k++){g.fillStyle='rgba(0,0,0,'+(.02+hash(k,35)*.04)+')';g.beginPath();g.arc(hash(k,36)*S,hash(k,37)*S,8+hash(k,38)*30,0,7);g.fill()}});
  wt.repeat.set(3,3);const wn=normalMap(wt,2);wn.wrapS=wn.wrapT=T.RepeatWrapping;wn.repeat.copy(wt.repeat);
  for(const m of[MAT.gun,MAT.gunD,MAT.gunL,MAT.gunO,MAT.lance,MAT.gunP]){m.map=wt;m.normalMap=wn;m.normalScale=new T.Vector2(.6,.6);m.roughness=Math.min(.78,m.roughness+.12);m.envMapIntensity=.2;m.needsUpdate=true}}
// shared part builders (all take the bake callback `a`)
const GPT={
  tube:(a,m,r,len,y,zc,x=0)=>a(GEO.cyl,m,r,len,r,x,y,zc,1.571,0,0),
  rail:(a,m,y,z0,z1,w=.05)=>{const L=Math.abs(z1-z0),zc=(z0+z1)/2;a(GEO.box,m,w,.014,L,0,y,zc);for(let z=Math.min(z0,z1)+.008;z<Math.max(z0,z1);z+=.02)a(GEO.box,m,w+.012,.01,.009,0,y+.011,z)},
  guard:(a,m,z,y)=>{a(new T.TorusGeometry(1,.16,6,14,Math.PI),m,.05,.05,.05,0,y,z,0,Math.PI/2,Math.PI);},
  trig:(a,m,z,y)=>a(GEO.box,m,.012,.05,.014,0,y-.03,z,.25,0,0),
  vents:(a,m,x,y,z0,n,step,h)=>{for(let i=0;i<n;i++)a(GEO.box,m,.006,h,.012,x,y,z0-i*step)},
  irons:(a,m,yr,zr,yf,zf)=>{a(GEO.box,m,.04,.02,.03,0,yr,zr);for(const s of[-1,1])a(GEO.box,m,.008,.035,.02,s*.014,yr+.025,zr);a(GEO.box,m,.03,.012,.02,0,yf,zf);a(GEO.box,m,.008,.04,.008,0,yf+.025,zf);for(const s of[-1,1])a(GEO.box,m,.006,.035,.014,s*.016,yf+.02,zf)}};
// per-gun sockets: s = top mount [y,z], b = bore y, u = underbarrel [y,z]; IRN = iron-sight groups (hidden under an optic), OPT = built-in optics (hidden when a sight is fitted)
const SOCK=[],IRN=[],OPT=[],MAGV=[],MZG=[];
const irn=(G,k,fn)=>{const g=VK(fn);G.add(g);IRN[k]=g};
// ---- Arc Welder: compact energy auto-rifle, coil barrel spins
arcG.add(VK(a=>{const G=MAT.gun,D=MAT.gunD,P=MAT.gunP,C=MAT.cell;
  a(PF('arcBody',[[.44,-.02],[.44,.09],[.38,.125],[-.12,.125],[-.26,.095],[-.38,.05],[-.38,-.05],[-.22,-.075],[.02,-.09],[.3,-.09],[.44,-.06]],.15,.012),G,1,1,1,0,0,0);
  a(PF('arcBelly',[[.3,-.085],[-.2,-.07],[-.4,-.05],[-.43,-.12],[-.36,-.135],[-.2,-.12],[.1,-.12],[.3,-.11]],.12,.01),P,1,1,1,0,0,0);
  a(PF('arcGrip',[[.17,-.09],[.27,-.09],[.31,-.29],[.29,-.345],[.22,-.35],[.2,-.31],[.215,-.27],[.198,-.225],[.212,-.18],[.19,-.13]],.085,.012),P,1,1,1,0,0,0);
  GPT.guard(a,D,.15,-.1);GPT.trig(a,D,.15,-.08);
  a(PF('arcPad',[[.44,.09],[.47,.08],[.47,-.07],[.44,-.06]],.13,.006),P,1,1,1,0,0,0);
  GPT.rail(a,D,.13,.3,-.1);a(GEO.box,D,.16,.03,.42,0,.1,.08);
  for(const s of[-1,1]){for(let i=0;i<5;i++)a(GEO.box,D,.006,.07,.022,s*.078,.03,.32-i*.05,.3,0,0);a(GEO.box,C,.004,.018,.36,s*.076,-.035,.08);GPT.tube(a,C,.022,.16,-.02,.28,s*.06)}
  a(GEO.box,D,.03,.03,.05,.085,.06,.05);GPT.tube(a,D,.012,.04,.06,.1,.1);
  GPT.tube(a,D,.034,.3,.01,-.5);for(const z of[-.38,-.66])GPT.tube(a,G,.05,.03,.01,z);GPT.tube(a,D,.05,.1,.01,-.86);for(const s of[-1,1])a(GEO.box,D,.02,.06,.07,s*.05,.01,-.86);GPT.tube(a,C,.03,.01,.01,-.915);
  armsKit(a,-.3)}));
irn(arcG,0,a=>GPT.irons(a,MAT.gunD,.15,.26,.15,-.08));SOCK[0]={s:[.14,.08],b:.01,u:[-.13,-.3]};
const arcSpin=new T.Group();arcSpin.position.set(0,.01,-.62);arcG.add(arcSpin);
arcSpin.add(VK(a=>{for(let i=0;i<4;i++)a(GEO.tor,emitMat,.065,.065,.065,0,0,-.12+i*.07);for(let i=0;i<6;i++){const r=i/6*6.283;a(GEO.box,MAT.gunD,.012,.05,.26,Math.cos(r)*.07,Math.sin(r)*.07,0,0,0,r)}}));
arcG.add(VK(a=>a(GEO.box,emitMat,.006,.1,.18,-.078,-.03,.08)));
// ---- Briar Lance: precision rail gun; machined alloy frame, heat-sink fins, capacitor cells in clamps, cooling coils, twin rail prongs
MAT.lance.color.setHex(0x4c4560).convertSRGBToLinear();MAT.lance.metalness=.7;MAT.lance.roughness=.42;MAT.lance.needsUpdate=true;
lanG.add(VK(a=>{const G=MAT.lance,D=MAT.gunD,P=MAT.gunP,L=MAT.gunL,O=MAT.gunO;
  a(PF('lanBody',[[.46,-.04],[.46,.06],[.4,.1],[.1,.115],[-.14,.1],[-.3,.06],[-.32,-.06],[-.12,-.09],[.3,-.09],[.42,-.07]],.15,.014),G,1,1,1,0,0,0);
  a(PF('lanGrip',[[.19,-.08],[.29,-.08],[.33,-.29],[.31,-.345],[.24,-.35],[.215,-.31],[.23,-.27],[.212,-.225],[.226,-.18],[.204,-.13]],.085,.012),P,1,1,1,0,0,0);
  GPT.guard(a,D,.16,-.1);GPT.trig(a,D,.16,-.08);GPT.rail(a,D,.115,.3,-.12);
  for(const s of[-1,1]){a(GEO.box,D,.004,.006,.6,s*.077,.06,.08);a(GEO.box,D,.004,.006,.5,s*.077,-.05,.06);for(let i=0;i<3;i++)a(GEO.box,D,.004,.1,.006,s*.077,.005,.3-i*.16);
    for(let i=0;i<6;i++)a(GEO.box,L,.03,.075,.008,s*.09,.03,-.04-i*.035);a(GEO.box,D,.008,.09,.24,s*.082,.03,-.13)}
  for(let i=0;i<3;i++){const z=.24-i*.1;a(GEO.box,D,.05,.06,.035,.1,-.02,z);GPT.tube(a,MAT.cell,.022,.08,-.02,z-.0,.125);a(GEO.box,L,.056,.012,.04,.1,.015,z);a(GEO.box,L,.056,.012,.04,.1,-.055,z)}
  for(let i=0;i<8;i++)a(new T.TorusGeometry(1,.2,6,14),L,.035,.035,.035,0,-.07,-.18-i*.022,0,0,0);GPT.tube(a,D,.025,.2,-.07,-.25);
  a(PF('lanStock',[[.42,.06],[.62,.04],[.66,.0],[.66,-.15],[.6,-.17],[.42,-.08]],.1,.012,[[[.47,.02],[.6,.01],[.6,-.1],[.47,-.05]]]),G,1,1,1,0,0,0);
  a(GEO.box,O,.152,.012,.08,0,.09,.36);a(GEO.box,D,.03,.02,.06,.08,.07,.1);
  armsKit(a,-.12)}));
{const g=VK(a=>{const D=MAT.gunD,L=MAT.gunL;GPT.tube(a,D,.03,.28,.17,.02);a(new T.CylinderGeometry(.042,.03,.06,18),D,1,1,1,0,.17,-.15,-1.571,0,0);GPT.tube(a,D,.036,.04,.17,.18);a(GEO.cyl,MAT.lens,.038,.004,.038,0,.17,-.181,1.571,0,0);
  for(const z of[-.06,.1]){a(GEO.box,D,.03,.04,.03,0,.135,z);a(new T.TorusGeometry(1,.25,6,16),L,.036,.036,.036,0,.17,z)}GPT.tube(a,D,.01,.025,.205,.02)});lanG.add(g);OPT[1]=g}
irn(lanG,1,a=>{});SOCK[1]={s:[.12,.04],b:0,u:[-.12,-.12]};
const lanTop=J(lanG,0,.055,0),lanBot=J(lanG,0,-.055,0);
for(const[j,s]of[[lanTop,1],[lanBot,-1]])j.add(VK(a=>{a(PF('lanProng',[[-.25,.025],[-.85,.016],[-.98,.004],[-.98,-.004],[-.85,-.016],[-.25,-.025]],.045,.006),MAT.lance,1,1,1,0,0,0);
  for(let i=0;i<5;i++)a(GEO.box,MAT.gunL,.05,.008,.012,0,s*.02,-.34-i*.12);a(GEO.box,MAT.cell,.006,.006,.6,0,-s*.026,-.62);a(GEO.box,MAT.gunD,.06,.02,.12,0,s*.03,-.38)}));
const lanCore=mesh(GEO.box,MAT.cell,.02,.04,.66,0,0,-.58);lanG.add(lanCore);
// ---- Rook Rifle: assault rifle; upper and lower receiver, pistol grip, skeleton stock, octagonal handguard, flash hider, curved magazine
const arG=new T.Group();vm.add(arG);
arG.add(VK(a=>{const L=MAT.gunL,D=MAT.gunD,O=MAT.gunO,P=MAT.gunP;
  a(PF('arUp',[[.34,-.02],[.34,.075],[.31,.095],[-.24,.095],[-.26,.07],[-.26,-.02]],.12,.01),L,1,1,1,0,0,0);
  a(PF('arLow',[[.3,-.02],[.3,-.09],[.12,-.11],[-.02,-.125],[-.15,-.115],[-.2,-.06],[-.2,-.02]],.11,.01),D,1,1,1,0,0,0);
  a(PF('arGrip',[[.16,-.1],[.26,-.1],[.305,-.29],[.285,-.345],[.215,-.35],[.195,-.31],[.21,-.27],[.192,-.225],[.205,-.18],[.183,-.14]],.08,.012),P,1,1,1,0,0,0);
  GPT.guard(a,D,.12,-.12);GPT.trig(a,D,.12,-.1);
  GPT.tube(a,D,.028,.24,.03,.44);a(PF('arStock',[[0.33,.07],[0.479,.055],[0.501,.03],[0.501,-.17],[0.479,-.19],[0.434,-.17],[0.347,-.07],[.33,-.04]],.075,.012,[[[0.369,.03],[0.468,.02],[0.468,-.12],[0.423,-.12],[0.369,-.05]]]),P,1,1,1,0,0,0);
  a(GEO.box,P,.08,.22,.03,0,-.07,.515);
  a(new T.CylinderGeometry(1,1,1,8),L,.068,.46,.068,0,.02,-.47,1.571,0,0);GPT.rail(a,D,.098,.33,-.7);
  for(const s of[-1,1])for(let i=0;i<4;i++)a(GEO.box,D,.008,.024,.06,s*.066,.02,-.33-i*.1);for(let i=0;i<4;i++)a(GEO.box,D,.03,.008,.06,0,-.05,-.33-i*.1);
  a(GEO.box,D,.05,.05,.05,0,.06,-.72);GPT.tube(a,D,.016,.2,.01,-.8);
  a(GEO.box,D,.004,.035,.11,.061,.03,.06);a(GEO.box,O,.004,.01,.11,.062,.055,.06);GPT.tube(a,D,.012,.03,.05,.12,.07);a(GEO.box,D,.02,.02,.05,0,.085,.3);a(GEO.box,O,.03,.012,.02,-.06,-.03,.2);
  armsKit(a,-.42)}));
irn(arG,2,a=>GPT.irons(a,MAT.gunD,.115,.28,.11,-.66));SOCK[2]={s:[.115,.02],b:.01,mz:-.9,u:[-.06,-.42]};
MZG[2]=VK(a=>{const D=MAT.gunD;GPT.tube(a,D,.024,.08,.01,-.94);for(let i=0;i<4;i++)a(GEO.box,D,.006,.03,.05,Math.cos(i*1.571)*.024,.01+Math.sin(i*1.571)*.024,-.94,0,0,i*1.571)});arG.add(MZG[2]);
const arMag=J(arG,0,-.17,-.06);
// ---- Wren Sidearm: pistol with a serrated slide, accessory rail, and two-handed grip (its own hands)
const piG=new T.Group();vm.add(piG);
piG.add(VK(a=>{const L=MAT.gunL,D=MAT.gunD,O=MAT.gunO,P=MAT.gunP;
  a(PF('piSlide',[[.2,.02],[.2,.1],[.17,.115],[-.28,.115],[-.3,.1],[-.3,.02]],.1,.01),L,1,1,1,0,0,0);for(let i=0;i<7;i++)for(const s of[-1,1])a(GEO.box,D,.004,.06,.008,s*.051,.065,.15-i*.018);
  a(GEO.box,D,.004,.03,.09,.051,.08,-.04);
  a(PF('piFrame',[[.18,.02],[.18,-.03],[.05,-.04],[-.27,-.03],[-.29,.0],[-.29,.02]],.09,.008),P,1,1,1,0,0,0);GPT.rail(a,D,-.045,-.06,-.24,.04);
  a(PF('piGrip',[[.06,-.03],[.18,-.03],[.22,-.26],[.2,-.31],[.1,-.31],[.08,-.27],[.095,-.22],[.075,-.17],[.088,-.12],[.065,-.07]],.09,.012),P,1,1,1,0,0,0);
  GPT.guard(a,P,.0,-.05);GPT.trig(a,D,.0,-.03);GPT.tube(a,D,.02,.04,.06,-.31);a(GEO.box,D,.03,.03,.03,0,.11,.19);a(GEO.box,O,.012,.012,.012,0,.13,.17);
  a(GEO.box,MAT.glove,.11,.12,.13,.02,-.21,.18);a(GEO.box,MAT.glove,.11,.1,.12,-.07,-.19,.15);a(GEO.box,MAT.sleeve,.13,.12,.14,.04,-.31,.26,.5,0,0);a(GEO.box,MAT.sleeve,.12,.11,.14,-.1,-.3,.25,.4,.3,0)}));
irn(piG,3,a=>{const D=MAT.gunD,O=MAT.gunO;a(GEO.box,D,.03,.02,.025,0,.125,.15);for(const s of[-1,1])a(GEO.box,D,.008,.02,.02,s*.011,.14,.15);a(GEO.box,D,.008,.03,.015,0,.13,-.25);a(GEO.box,O,.01,.008,.008,0,.146,-.25)});
SOCK[3]={s:[.115,-.04],b:.06,mz:-.33,u:[-.05,-.15]};
const piMag=J(piG,0,-.27,.15);
// ---- Mule Launcher: revolving six-round grenade launcher, fat tube, ladder sight, folding stock
const glG=new T.Group();vm.add(glG);
glG.add(VK(a=>{const L=MAT.gunL,D=MAT.gunD,O=MAT.gunO,P=MAT.gunP;
  a(PF('glFrame',[[.32,-.04],[.32,.1],[.2,.13],[.08,.13],[.06,.06],[-.22,.06],[-.24,-.09],[.08,-.1],[.32,-.09]],.15,.012),D,1,1,1,0,0,0);
  a(PF('glGrip',[[.15,-.09],[.25,-.09],[.29,-.29],[.27,-.345],[.2,-.35],[.18,-.31],[.195,-.27],[.177,-.225],[.19,-.18],[.168,-.13]],.085,.012),P,1,1,1,0,0,0);
  GPT.guard(a,D,.12,-.11);GPT.trig(a,D,.12,-.09);
  GPT.tube(a,L,.075,.46,.05,-.5);GPT.tube(a,D,.084,.05,.05,-.29);GPT.tube(a,D,.088,.06,.05,-.72);GPT.tube(a,O,.08,.02,.05,-.62);for(let i=0;i<6;i++)a(GEO.box,D,.168,.006,.03,0,.05,-.36-i*.055,0,0,i*.52);
  a(GEO.box,D,.03,.03,.5,0,.15,-.3);for(const z of[-.08,-.5])a(GEO.box,D,.03,.06,.03,0,.12,z);
  a(PF('glFore',[[-.34,-.03],[-.5,-.03],[-.5,-.16],[-.46,-.2],[-.38,-.2],[-.34,-.15]],.08,.012),P,1,1,1,0,0,0);
  GPT.tube(a,D,.018,.18,.02,.41,.05);GPT.tube(a,D,.018,.18,-.06,.41,.05);a(GEO.box,P,.11,.2,.035,0,-.03,.5);for(const s of[-1,1])a(GEO.box,O,.006,.05,.3,s*.076,0,.15);
  armsKit(a,-.42)}));
irn(glG,4,a=>{const D=MAT.gunD;a(GEO.box,D,.06,.012,.02,0,.17,.0);for(const s of[-1,1])a(GEO.box,D,.008,.09,.012,s*.026,.215,-.0);for(let i=0;i<4;i++)a(GEO.box,D,.05,.004,.006,0,.185+i*.02,-.0);a(GEO.box,D,.01,.06,.01,0,.16,-.7)});
SOCK[4]={s:[.165,-.25],b:.05,u:[-.12,-.42]};
const glDrum=J(glG,0,-.02,-.08);glDrum.add(VK(a=>{a(new T.CylinderGeometry(1,1,1,6),MAT.gunD,.16,.24,.16,0,0,0,1.571,0,0);for(let i=0;i<6;i++){const r=i/6*6.283;GPT.tube(a,MAT.gunL,.042,.245,Math.sin(r)*.1,0,Math.cos(r)*.1);GPT.tube(a,MAT.gunO,.03,.25,Math.sin(r)*.1,0,Math.cos(r)*.1)}GPT.tube(a,MAT.gunL,.03,.26,0,0)}));
// ---- Harrow Cannon: six-barrel rotary cannon, motor housing, carry handle, feed chute from a side ammo box
const caG=new T.Group();vm.add(caG);caG.scale.setScalar(.8);caG.position.set(.01,.01,-.08);
caG.add(VK(a=>{const L=MAT.gunL,D=MAT.gunD,O=MAT.gunO,P=MAT.gunP;
  a(PF('caBody',[[.44,-.06],[.44,.08],[.36,.13],[-.08,.13],[-.12,.08],[-.12,-.1],[.1,-.13],[.44,-.11]],.22,.016),L,1,1,1,0,0,0);
  GPT.tube(a,D,.12,.14,0,-.16);GPT.tube(a,O,.125,.02,0,-.1);for(let i=0;i<8;i++){const r=i/8*6.283;a(GEO.box,D,.02,.03,.12,Math.cos(r)*.11,Math.sin(r)*.11,-.16,0,0,r)}
  a(PF('caHandle',[[.3,.13],[.3,.22],[.26,.24],[-.04,.24],[-.08,.22],[-.08,.13],[-.03,.13],[-.03,.19],[.25,.19],[.25,.13]],.04,.008),D,1,1,1,0,0,0);
  a(PF('caGrip',[[.2,-.11],[.3,-.11],[.34,-.31],[.32,-.36],[.25,-.37],[.23,-.33],[.245,-.29],[.227,-.245],[.24,-.2],[.218,-.15]],.09,.012),P,1,1,1,0,0,0);
  GPT.guard(a,D,.17,-.14);GPT.trig(a,D,.17,-.12);for(let i=0;i<4;i++)a(GEO.box,D,.225,.008,.05,0,-.06+i*.04,.32);
  for(let i=0;i<5;i++)a(GEO.box,D,.04,.05,.035,-.13,-.02,.06+i*.04,0,0,.3);
  armsKit(a,-.18)}));
irn(caG,5,a=>{const D=MAT.gunD;a(GEO.box,D,.03,.02,.02,0,.255,.2);a(GEO.box,D,.008,.03,.008,0,.26,-.05)});SOCK[5]={s:[.24,.1],b:0,u:[-.13,-.18]};
const caSpin=J(caG,0,0,-.2);caSpin.add(VK(a=>{for(let i=0;i<6;i++){const r=i/6*6.283;GPT.tube(a,MAT.gunD,.022,.62,Math.sin(r)*.06,-.3,Math.cos(r)*.06)}
  for(const z of[-.42,-.58])a(new T.CylinderGeometry(1,1,1,6),MAT.gunD,.1,.03,.1,0,0,z,1.571,0,0);GPT.tube(a,MAT.gunO,.1,.015,0,-.5);GPT.tube(a,MAT.gunL,.03,.64,0,-.3)}));
const caBox=J(caG,-.17,-.06,.12);
// energy blade summoned by the Arc Welder's melee
const swordG=new T.Group();vm.add(swordG);swordG.visible=false;
swordG.add(VK(a=>{a(GEO.box,MAT.gunD,.05,.05,.24,0,0,.14);a(GEO.box,MAT.gunO,.16,.04,.04,0,0,.02);a(GEO.box,MAT.glove,.11,.12,.13,0,-.04,.18);a(GEO.box,MAT.sleeve,.13,.12,.16,.02,-.12,.3,.5,0,0)}));
{const bm=bas({color:0xff8a3a,transparent:true,opacity:.95,blending:T.AdditiveBlending,depthWrite:false});swordG.add(mesh(GEO.box,bm,.035,.1,1.5,0,0,-.75),mesh(GEO.box,bas({color:0xfff0d0}),.014,.03,1.48,0,0,-.75),glow(0xff8a3a,1.4,.6))}
WPN[5].mz=-.84*.8-.08;
// ---- Thresher Scattergun: pump shotgun; receiver, barrel over a tube magazine, ribbed pump, shell carrier, stock with cheek rest
const shG=new T.Group();vm.add(shG);shG.add(VK(a=>{const L=MAT.gunL,D=MAT.gunD,O=MAT.gunO,P=MAT.gunP;
  a(PF('shRec',[[.3,-.08],[.3,.07],[.27,.09],[-.16,.09],[-.18,.06],[-.18,-.08]],.13,.01),L,1,1,1,0,0,0);a(GEO.box,D,.004,.04,.12,.066,.02,.05);
  a(PF('shGrip',[[.18,-.08],[.28,-.08],[.32,-.28],[.3,-.335],[.23,-.34],[.21,-.3],[.225,-.26],[.207,-.215],[.22,-.17],[.198,-.12]],.085,.012),P,1,1,1,0,0,0);GPT.guard(a,D,.12,-.1);GPT.trig(a,D,.12,-.08);
  a(PF('shStock',[[0.3,.07],[0.369,.06],[0.49,.03],[0.512,.03],[0.512,-.17],[0.479,-.19],[0.423,-.14],[.32,-.07]],.09,.014),P,1,1,1,0,0,0);a(GEO.box,D,.1,.24,.03,0,-.07,.52);
  GPT.tube(a,D,.034,.7,.03,-.5);GPT.tube(a,D,.03,.54,-.05,-.42);GPT.tube(a,D,.034,.03,-.05,-.7);a(GEO.box,D,.012,.01,.6,0,.068,-.48);a(GEO.sph,MAT.gunB,.008,.008,.008,0,.078,-.82);
  a(PF('shPump',[[-.26,-.01],[-.5,-.01],[-.52,-.04],[-.52,-.1],[-.5,-.12],[-.26,-.12],[-.24,-.1],[-.24,-.04]],.11,.012),O,1,1,1,0,0,0);for(let i=0;i<7;i++)a(GEO.box,D,.112,.01,.01,0,-.065,-.28-i*.032);
  for(let i=0;i<4;i++){GPT.tube(a,O,.014,.05,.0,.18-i*.032,-.075);GPT.tube(a,MAT.gunB,.015,.012,.0,.205-i*.032,-.075)}a(GEO.box,D,.006,.05,.14,-.069,.0,.13);
  armsKit(a,-.36)}));
irn(shG,6,a=>a(GEO.box,MAT.gunD,.02,.012,.03,0,.098,.22));SOCK[6]={s:[.09,.04],b:.03,u:[-.13,-.36]};
// ---- Heron Longshot: bolt-action sniper; chassis, fluted barrel, muzzle brake, bolt, folded bipod, adjustable stock, box magazine
const snG=new T.Group();vm.add(snG);snG.add(VK(a=>{const L=MAT.gunL,D=MAT.gunD,O=MAT.gunO,P=MAT.gunP;
  a(PF('snChas',[[.34,-.06],[.34,.07],[.3,.09],[-.34,.08],[-.36,.03],[-.36,-.07],[.1,-.09],[.3,-.08]],.12,.012),L,1,1,1,0,0,0);
  a(PF('snGrip',[[.18,-.08],[.28,-.08],[.32,-.29],[.3,-.345],[.23,-.35],[.21,-.31],[.225,-.27],[.207,-.225],[.22,-.18],[.198,-.13]],.08,.012),P,1,1,1,0,0,0);GPT.guard(a,D,.13,-.1);GPT.trig(a,D,.13,-.08);
  a(PF('snStock',[[0.33,.06],[0.38,.06],[0.391,.1],[0.49,.1],[0.501,.06],[0.501,-.2],[0.468,-.22],[0.423,-.2],[0.402,-.1],[.33,-.07]],.085,.014,[[[0.402,.03],[0.468,.03],[0.468,-.12],[0.423,-.12]]]),P,1,1,1,0,0,0);a(GEO.box,D,.09,.3,.03,0,-.05,.51);
  GPT.tube(a,D,.026,.82,.02,-.77);for(let i=0;i<6;i++)a(GEO.box,L,.004,.008,.6,Math.cos(i*1.05)*.026,.02+Math.sin(i*1.05)*.026,-.75,0,0,i*1.05);
  
  GPT.tube(a,D,.018,.06,.06,.05,.075);a(GEO.sph,D,.02,.02,.02,.105,.06,.05);
  for(const s of[-1,1])a(GEO.box,D,.012,.012,.3,s*.03,-.08,-.5);a(GEO.box,D,.05,.03,.04,0,-.08,-.34);
  GPT.rail(a,D,.09,.3,-.32);
  armsKit(a,-.3)}));
irn(snG,7,a=>{});SOCK[7]={s:[.09,.02],b:.02,mz:-1.18,u:[-.1,-.3]};
MZG[7]=VK(a=>{a(PF('snBrake',[[-1.17,.05],[-1.29,.05],[-1.29,-.01],[-1.17,-.01]],.075,.008),MAT.gunD,1,1,1,0,0,0);for(const z of[-1.2,-1.23,-1.26])a(GEO.box,MAT.gunP,.08,.03,.012,0,.02,z)});snG.add(MZG[7]);
const snMag=J(snG,0,-.11,.04);
// magazine variants live inside the magazine joints so the reload animation still moves them: [standard, extended, quickdraw, drum]
{const mk=(fn)=>VK(fn),D=MAT.gunD,O=MAT.gunO,P=MAT.gunP,L=MAT.gunL;
  const curved=(n,len)=>PF(n,[[.05,.06],[-.05,.06],[-.07,-len*.5],[-.1,-len],[-.01,-len-.02],[.02,-len*.5]],.068,.01);
  MAGV[2]=[mk(a=>{a(curved('arM0',.22),P,1,1,1,0,0,0);a(GEO.box,O,.072,.02,.1,0,-.225,-.055,.18,0,0)}),mk(a=>{a(curved('arM1',.32),P,1,1,1,0,0,0);a(GEO.box,O,.072,.02,.1,0,-.325,-.075,.18,0,0)}),
    mk(a=>{a(curved('arM0',.22),P,1,1,1,0,0,0);a(GEO.box,O,.074,.04,.03,0,-.23,-.06);GPT.tube(a,O,.012,.07,-.26,-.06)}),mk(a=>{a(GEO.box,P,.06,.1,.1,0,.0,0);GPT.tube(a,P,.11,.1,-.16,.0,0);a(new T.CylinderGeometry(1,1,1,24),D,.115,.07,.115,0,-.16,0,0,0,1.571);GPT.tube(a,O,.03,.11,-.16,0)})];
  MAGV[3]=[mk(a=>a(GEO.box,P,.085,.04,.09,0,-.02,0,-.25,0,0)),mk(a=>{a(GEO.box,P,.085,.04,.09,0,-.02,0,-.25,0,0);a(GEO.box,P,.08,.08,.085,0,-.08,.015,-.25,0,0);a(GEO.box,O,.086,.02,.09,0,-.12,.03,-.25,0,0)}),
    mk(a=>{a(GEO.box,P,.085,.04,.09,0,-.02,0,-.25,0,0);a(GEO.box,O,.09,.025,.04,0,-.05,.0,-.25,0,0)})];
  MAGV[4]=null;
  MAGV[5]=[mk(a=>{a(GEO.box,D,.12,.18,.22);a(GEO.box,O,.122,.03,.222,0,.06,0)}),mk(a=>{a(GEO.box,D,.13,.26,.26,0,-.04,0);a(GEO.box,O,.132,.03,.262,0,.06,0)})];
  MAGV[7]=[mk(a=>{a(PF('snM0',[[.05,.03],[-.05,.03],[-.05,-.1],[.05,-.1]],.06,.008),P,1,1,1,0,0,0)}),mk(a=>{a(PF('snM1',[[.05,.03],[-.05,.03],[-.05,-.17],[.05,-.17]],.06,.008),P,1,1,1,0,0,0);a(GEO.box,O,.062,.015,.1,0,-.17,0)}),
    mk(a=>{a(PF('snM0',[[.05,.03],[-.05,.03],[-.05,-.1],[.05,-.1]],.06,.008),P,1,1,1,0,0,0);a(GEO.box,O,.064,.02,.05,0,-.1,0)})];
  for(const[k,j]of[[2,arMag],[3,piMag],[5,caBox],[7,snMag]])for(const g of MAGV[k])j.add(g)}
const VMG=[arcG,lanG,arG,piG,glG,caG,shG,snG],MAGP={2:arMag,3:piMag,4:glDrum,5:caBox,7:snMag},MAGY={2:-.17,3:-.27,4:-.02,5:-.06,7:-.11};
// shotgun tube extension (extended magazine)
const shTube=VK(a=>{GPT.tube(a,MAT.gunD,.03,.14,-.05,-.76);GPT.tube(a,MAT.gunD,.034,.03,-.05,-.84)});shG.add(shTube);shTube.visible=false;
// ---- attachments: built at each gun's sockets, only the ones that gun accepts
const ATTG=[],AMAT={lens:null,dot:null};
function attBuild(k,md){const g0=ATTG[k];if(g0){VMG[k].remove(g0)}
  if(!AMAT.lens){AMAT.lens=bas({color:0x6fd8ff,transparent:true,opacity:.28,depthWrite:false});AMAT.dot=bas({color:0xff3a2a})}
  const S=SOCK[k],[sy,sz]=S.s,D=MAT.gunD,P=MAT.gunP,O=MAT.gunO,L=MAT.gunL,W=WPN[k],sc=k===5?1/.8:1;
  const g=VK(a=>{const tube=(m,r,len,y,z)=>GPT.tube(a,m,r,len,y,z);
    // sights
    if(md.s===1){a(GEO.box,D,.066,.02,.1,0,sy+.01,sz);a(GEO.box,D,.058,.03,.06,0,sy+.034,sz+.02);for(const s of[-1,1])a(GEO.box,D,.012,.07,.05,s*.03,sy+.054,sz-.02);a(GEO.box,D,.072,.014,.055,0,sy+.092,sz-.02);a(GEO.box,P,.07,.008,.09,0,sy+.002,sz)}
    else if(md.s===4){a(GEO.box,D,.054,.02,.07,0,sy+.01,sz);a(GEO.box,D,.046,.034,.06,0,sy+.035,sz);tube(D,.024,.07,sy+.06,sz);tube(D,.028,.012,sy+.06,sz-.035);GPT.tube(a,D,.008,.014,sy+.086,sz,0);a(GEO.box,P,.056,.008,.07,0,sy+.002,sz)}
    else if(md.s===2||md.s===3||md.s===5){const len=md.s===2?.2:md.s===3?.27:.34,r=md.s===5?.022:.018,ob=md.s===2?.028:md.s===3?.034:.042,cy=sy+.05;
      for(const o of[-len*.28,len*.22]){a(GEO.box,D,.05,.02,.04,0,sy+.01,sz+o);a(GEO.box,D,.03,cy-r-sy-.01,.03,0,(sy+.02+cy-r)/2,sz+o);a(new T.TorusGeometry(1,.3,6,16),D,r+.007,r+.007,r+.007,0,cy,sz+o)}
      tube(D,r,len*.6,cy,sz);a(new T.CylinderGeometry(ob,r,len*.25,20),D,1,1,1,0,cy,sz-len*.42,-1.571,0,0);a(new T.CylinderGeometry(r*1.35,r,len*.15,16),D,1,1,1,0,cy,sz+len*.36,1.571,0,0);
      GPT.tube(a,D,.012,.03,cy+r+.012,sz,0);a(GEO.cyl,D,.012,.03,.012,r+.012,cy,sz,0,0,1.571);a(GEO.box,O,.004,.006,len*.3,r*.7,cy+r*.7,sz);
      a(GEO.cyl,MAT.lens,ob*.92,.004,ob*.92,0,cy,sz-len*.545,1.571,0,0);a(GEO.cyl,MAT.lens,r*1.25,.004,r*1.25,0,cy,sz+len*.44,1.571,0,0)}
    // muzzle devices sit on the bore at the gun's own muzzle
    const by=S.b,mz=S.mz!==undefined?S.mz:W.mz/sc,kr=k===3?.75:1;
    if(md.b===1){tube(D,.017*kr,.16,by,mz-.08);tube(D,.024*kr,.05,by,mz-.17)}
    else if(md.b===2){tube(D,.028*kr,.08,by,mz-.04);for(let i=0;i<3;i++)a(GEO.box,P,.03*kr,.01,.012,0,by+.026*kr,mz-.02-i*.022)}
    else if(md.b===3){tube(D,.038*kr,.22,by,mz-.11);for(const z of[mz-.005,mz-.215])tube(L,.04*kr,.012,by,z);for(let i=0;i<4;i++)tube(P,.0395*kr,.01,by,mz-.05-i*.04)}
    else if(md.b===4){a(GEO.box,D,.075*kr,.04*kr,.075,0,by,mz-.04);for(const s of[-1,1])for(let i=0;i<2;i++)a(GEO.box,P,.008,.03*kr,.016,s*.038*kr,by,mz-.025-i*.03)}
    // underbarrel
    const[uy,uz]=S.u;if(md.u===1){a(GEO.box,P,.04,.04,.06,0,uy,uz);a(PF('vgrip',[[.025,0],[-.025,0],[-.03,-.13],[.03,-.13]],.04,.008),P,1,1,1,0,uy-.02,uz)}
    else if(md.u===2){a(PF('agrip',[[.06,0],[-.06,0],[-.09,-.06],[.02,-.06]],.045,.008),P,1,1,1,0,uy,uz)}
    else if(md.u===3){a(GEO.box,P,.035,.035,.08,.075,uy+.07,uz-.12);GPT.tube(a,AMAT.dot,.008,.006,uy+.07,uz-.163,.075)}});
  if(md.s===1||md.s===4){const r=mesh(GEO.ring,reticleMat,.02,.02,.02,0,sy+(md.s===1?.04:.05),sz-(md.s===1?.015:.04));g.add(r)}
  if(MZG[k])MZG[k].visible=md.b===0;if(IRN[k])IRN[k].visible=md.s===0;if(OPT[k])OPT[k].visible=md.s===0;
  if(MAGV[k])MAGV[k].forEach((v,i)=>v.visible=i===Math.min(md.m,MAGV[k].length-1));if(k===6)shTube.visible=md.m===1;
  ATTG[k]=g;VMG[k].add(g)}
const attKey=[];function attSync(){for(let k=0;k<VMG.length;k++){const G=guns.find(q=>q.k===k)||{mods:defMods(k)},md=modsFix(k,G.mods),key=md.s+'.'+md.b+'.'+md.m+'.'+md.u;if(attKey[k]!==key){attKey[k]=key;attBuild(k,md)}}}
