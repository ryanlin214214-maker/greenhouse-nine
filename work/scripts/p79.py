import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()

def rep(old, new, n=1):
    global s
    c = s.count(old)
    assert c == n, (c, old[:90])
    s = s.replace(old, new)

# 1) tag every kit instance so a rig's robot parts can be told apart from its joints
rep("function put(j,name,fn,sh){const m=inst(kit(name,fn),sh);j.add(m);return m}",
    "function put(j,name,fn,sh){const m=inst(kit(name,fn),sh);m.userData.kit=1;j.add(m);return m}")

# 2) the human suit, built on the walker joints so every pose, the combat layer, death and gun hands still work
HUMAN = r"""
// friendly humans: a soft white suit, a helmet with a face behind a clear visor, a life-support pack and a green friend light.
// Built on the walker joints, so walking, the combat layer, the death reaction and the gun hands all still work. Robots keep the plates.
let HSM=null;
function humanMats(){if(HSM)return HSM;
  const ft=paint(128,(g,S)=>{g.fillStyle='#eeede8';g.fillRect(0,0,S,S);grime(g,S,900,.025);g.strokeStyle='rgba(40,40,40,.18)';g.lineWidth=1.6;
    for(let i=0;i<5;i++){const y=(i+.5)*S/5;g.beginPath();g.moveTo(0,y);g.lineTo(S,y);g.stroke()}g.strokeStyle='rgba(40,40,40,.08)';g.lineWidth=1;for(let i=0;i<3;i++){const x=(i+.5)*S/3;g.beginPath();g.moveTo(x,0);g.lineTo(x,S);g.stroke()}});
  ft.wrapS=ft.wrapT=T.RepeatWrapping;ft.repeat.set(2,2);const fn=normalMap(ft,2);fn.wrapS=fn.wrapT=T.RepeatWrapping;fn.repeat.copy(ft.repeat);
  // shoulder patch: a white ring and a green sprout on blue, the Greenhouse Nine crew mark
  const pt=paint(64,(g,S)=>{g.fillStyle='#1f4f9a';g.fillRect(0,0,S,S);g.strokeStyle='#f2f2ee';g.lineWidth=5;g.beginPath();g.arc(S/2,S/2,S*.32,0,7);g.stroke();
    g.fillStyle='#55e08a';g.beginPath();g.ellipse(S*.42,S*.46,S*.1,S*.18,-.6,0,7);g.fill();g.beginPath();g.ellipse(S*.58,S*.46,S*.1,S*.18,.6,0,7);g.fill();g.fillRect(S*.48,S*.5,S*.04,S*.2)});
  HSM={cloth:std({color:0xd9d9d3,map:ft,normalMap:fn,roughness:.9,metalness:0}),shell:std({color:0xe2e2dc,roughness:.38,metalness:.05}),
    dark:std({color:0x2c3136,roughness:.75,metalness:.15}),metal:std({color:0x9aa3a8,roughness:.35,metalness:.8}),rub:std({color:0x3a4249,roughness:.85,metalness:.1}),chrome:std({color:0xc4cbd0,roughness:.2,metalness:1}),carbon:std({color:0x1e2226,roughness:.5,metalness:.5}),cglow:bas({color:0x5fe8ff}),trim:std({color:0x596168,roughness:.45,metalness:.6}),
    skin:[std({color:0xc8956d,roughness:.65}),std({color:0x7e5236,roughness:.65}),std({color:0xe8c09c,roughness:.65}),std({color:0xa8714c,roughness:.65})],
    hair:[std({color:0x2a2018,roughness:.9}),std({color:0x101010,roughness:.9}),std({color:0x8a5a2a,roughness:.9}),std({color:0x5a4a3a,roughness:.9})],
    eye:bas({color:0x16110e}),glass:std({color:0xa8dcff,transparent:true,opacity:.22,roughness:.04,metalness:.7,depthWrite:false}),
    gold:std({color:0xd9a441,roughness:.18,metalness:1}),iff:bas({color:0x4dff88}),lamp:bas({color:0xfff2d0}),screen:bas({color:0x6fd8ff}),
    patch:std({map:pt,roughness:.8}),blue:std({color:0x2c63c8,roughness:.45,metalness:.2})};
  HSM.glass.userData.noShadow=true;
  GEO.helm=GEO.helm||new T.SphereGeometry(1,24,16,Math.PI/2+1.05,Math.PI*2-2.1,0,Math.PI*.8);
  GEO.ifff=GEO.ifff||(()=>{const tx=paint(64,(g,S)=>{g.clearRect(0,0,S,S);g.fillStyle='#4dff88';g.strokeStyle='#0b2a16';g.lineWidth=4;g.beginPath();g.moveTo(S*.18,S*.3);g.lineTo(S*.5,S*.62);g.lineTo(S*.82,S*.3);g.lineTo(S*.82,S*.46);g.lineTo(S*.5,S*.8);g.lineTo(S*.18,S*.46);g.closePath();g.stroke();g.fill()});
    return new T.SpriteMaterial({map:tx,transparent:true,depthTest:false,depthWrite:false,fog:false})})();
  return HSM}
// closed armoured helmets with mirrored visors, four original styles: 0 Pathfinder (round, wraparound visor, crest), 1 Breacher (angular, flat brow, jaw plate),
// 2 Scout (long, tall teardrop visor, side antenna), 3 Bulwark (heavy, split visor with a nose bar and a breather grille). No faces: the visor is opaque.
const VZC={};const vizor=c=>VZC[c]||(VZC[c]=std({color:c,roughness:.12,metalness:.85,emissive:c,emissiveIntensity:.32}));
function vzGeo(k,w,t0,t1){return GEO[k]||(GEO[k]=new T.SphereGeometry(1,28,12,Math.PI/2-w,w*2,t0,t1-t0))}
function humanHead(head,o){const H=humanMats(),P=o.panel||H.blue,st=(o.helm|0)%4,vc=o.visor||0xd9a441,V=vizor(vc),n='hu'+(o.key||'')+'H'+st+'_'+vc.toString(16);
  for(const c of[...head.children])if(c.userData.kit||c.isSprite)head.remove(c);
  put(head,n,a=>{const R=rb(a);a(GEO.cyl,H.rub,.075,.1,.075,0,.03,0);for(let i=0;i<2;i++)a(GEO.tor,H.rub,.078,.078,.1,0,.02+i*.03,0,1.571,0,0);a(GEO.tor,H.metal,.135,.135,.135,0,0,0,1.571,0,0);
    if(st===0){a(GEO.sph,H.shell,.185,.2,.2,0,.17,0);a(vzGeo('vz0',1.05,1.2,1.85),V,.193,.207,.207,0,.17,0);
      R(P,.04,.035,.3,0,.37,-.02,0,0,0,.012);for(const s of[-1,1]){R(H.shell,.05,.13,.15,s*.155,.08,.07,0,s*.25,0,.02);R(P,.02,.08,.1,s*.183,.2,-.03,0,0,0,.006)}
      R(H.shell,.13,.07,.08,0,.035,.16,.3,0,0,.02);for(const s of[-1,1])a(GEO.box,H.dark,.012,.04,.01,s*.03,.035,.2)}
    else if(st===1){R(H.shell,.33,.3,.36,0,.17,-.01,0,0,0,.07);a(GEO.box,V,.27,.075,.03,0,.19,.185);for(const s of[-1,1])a(GEO.box,V,.03,.06,.1,s*.162,.19,.125,0,s*.5,0);
      R(P,.32,.045,.09,0,.245,.16,-.15,0,0,.012);R(P,.25,.1,.1,0,.07,.15,.25,0,0,.025);for(let i=0;i<3;i++)a(GEO.box,H.dark,.18,.01,.01,0,.05+i*.025,.205);
      for(const s of[-1,1]){R(H.dark,.04,.1,.14,s*.17,.15,-.02,0,0,0,.012);a(GEO.box,H.metal,.035,.035,.06,s*.15,.3,.08);a(GEO.box,H.lamp,.025,.025,.01,s*.15,.3,.111)}}
    else if(st===2){a(GEO.sph,H.shell,.17,.2,.22,0,.18,-.02);a(vzGeo('vz2',.62,1.0,1.95),V,.176,.207,.227,0,.18,-.02);R(P,.03,.03,.32,0,.38,-.04,0,0,0,.01);
      for(const s of[-1,1]){a(GEO.cyl,P,.06,.035,.06,s*.17,.17,-.02,0,0,1.571);R(H.shell,.04,.09,.13,s*.13,.06,.1,0,s*.3,0,.015)}a(GEO.cyl,H.dark,.008,.32,.008,.19,.33,-.1);a(GEO.sph,H.iff,.016,.016,.016,.19,.49,-.1)}
    else{a(GEO.sph,H.shell,.2,.19,.2,0,.17,0);a(vzGeo('vz3',.95,1.25,1.75),V,.207,.197,.207,0,.17,0);R(P,.04,.12,.05,0,.18,.2,0,0,0,.012);R(P,.26,.05,.27,0,.34,-.01,0,0,0,.015);
      R(H.dark,.17,.09,.08,0,.05,.16,.2,0,0,.02);for(let i=0;i<4;i++)a(GEO.box,H.metal,.012,.07,.01,-.045+i*.03,.05,.205,.2,0,0);for(const s of[-1,1])R(P,.05,.16,.16,s*.19,.15,0,0,0,0,.02)}
    a(GEO.cyl,H.dark,.006,.14,.006,-.1,.39,-.1);a(GEO.sph,H.iff,.02,.02,.02,-.1,.46,-.1)},true);
  const q=glow(0x4dff88,.32,.9);q.position.set(-.1,.46,-.1);head.add(q)}
// o: key (kit cache name), panel (armour/faction colour material), helm (style 0..3), visor (colour), leaf for Rowan's sprig
function humanize(R,o={}){const H=humanMats(),S=R.segs,P=o.panel||H.blue,n='hu'+(o.key||'');
  const strip=j=>{for(const c of[...j.children])if(c.userData.kit||c.isSprite)j.remove(c)};
  strip(S.pel);strip(S.tor);for(const[a,b]of S.arms){strip(a);strip(b)}for(const[a,b]of S.legs){strip(a);strip(b)}
  // ribbed rubber rings at the joints: radius x, radius z, y, count, spacing
  const bel=(a,m,rx,rz,y,k,st)=>{for(let i=0;i<k;i++)a(GEO.tor,m,rx,rz,.12,0,y-i*st,0,1.571,0,0)};
  put(S.pel,n+'P',a=>{const R=rb(a);a(GEO.cyl,H.rub,.17,.2,.14,0,-.03,0);a(GEO.cyl,H.trim,.205,.055,.17,0,.07,0);R(H.metal,.08,.05,.03,0,.07,.175,0,0,0,.01);
    R(H.shell,.14,.13,.06,0,-.06,.15,-.12,0,0,.02);R(P,.05,.09,.065,0,-.055,.155,-.12,0,0,.01);R(H.shell,.25,.12,.05,0,-.04,-.16,.15,0,0,.02);R(H.trim,.14,.07,.06,0,.06,-.19,0,0,0,.015);
    for(const s of[-1,1]){R(H.shell,.06,.17,.2,s*.2,-.06,0,0,0,s*.12,.02);R(P,.066,.03,.205,s*.203,.02,0,0,0,s*.12,.008);for(let i=0;i<2;i++)a(GEO.cyl,H.metal,.008,.01,.008,s*.233,-.02-i*.07,.06*(i?-1:1),0,0,1.571);
      R(H.trim,.07,.08,.06,s*.14,.035,.15,0,0,0,.015);R(H.dark,.072,.015,.062,s*.14,.07,.15)}
    R(H.rub,.06,.15,.08,.25,-.1,.05,0,0,0,.015);R(H.trim,.04,.05,.09,.25,-.02,.05)},true);
  put(S.tor,n+'T',a=>{const R=rb(a);a(GEO.cyl,H.rub,.17,.3,.14,0,.16,0);bel(a,H.rub,.178,.148,.13,3,.035);
    for(let i=0;i<3;i++)R(i===1?P:H.shell,.28-i*.02,.055,.06,0,.27-i*.062,.13,-.05,0,0,.015);for(const s of[-1,1])R(H.shell,.07,.18,.2,s*.17,.17,0,0,0,s*.1,.02);
    R(H.rub,.5,.34,.3,0,.42,0,0,0,0,.08);R(H.shell,.52,.25,.13,0,.45,.12,-.08,0,0,.04);for(const s of[-1,1])R(H.shell,.21,.15,.05,s*.115,.47,.18,-.08,s*.14,0,.018);
    R(P,.44,.08,.13,0,.555,.13,-.15,0,0,.02);R(H.trim,.012,.2,.012,0,.45,.2,-.08,0,0,.004);
    for(let i=0;i<3;i++){R(H.trim,.07,.1,.05,-.1+i*.1,.33,.2,0,0,0,.012);R(H.dark,.072,.018,.052,-.1+i*.1,.37,.2)}
    R(H.dark,.12,.06,.02,.14,.45,.21,-.08,0,0,.008);for(let i=0;i<3;i++)a(GEO.box,i?H.screen:H.iff,.018,.012,.01,.11+i*.026,.46,.222,-.08,0,0);
    a(GEO.cyl,H.trim,.16,.06,.15,0,.6,0);a(GEO.tor,H.metal,.15,.14,.1,0,.63,0,1.571,0,0);for(const s of[-1,1])R(H.shell,.14,.06,.11,s*.13,.6,.06,.3,0,-s*.2,.02);
    for(const s of[-1,1]){R(H.shell,.06,.24,.24,s*.265,.42,0,0,0,0,.02);for(let i=0;i<3;i++)R(H.trim,.064,.012,.2,s*.266,.34+i*.07,0)}
    R(H.shell,.45,.3,.06,0,.44,-.17,0,0,0,.02);
    // life-support pack: shell, vents, side canisters, hoses to the collar, carry handle, thrusters and status lights
    R(H.shell,.44,.46,.18,0,.42,-.29,0,0,0,.05);R(P,.45,.05,.19,0,.55,-.29,0,0,0,.015);R(H.trim,.3,.14,.02,0,.33,-.383,0,0,0,.01);for(let i=0;i<4;i++)R(H.dark,.26,.012,.012,0,.28+i*.032,-.395);
    R(H.trim,.2,.03,.04,0,.67,-.3,0,0,0,.01);for(const s of[-1,1]){a(GEO.cyl,H.trim,.012,.06,.012,s*.09,.645,-.3)}
    for(const s of[-1,1]){a(GEO.cyl,H.metal,.055,.34,.055,s*.25,.4,-.29);a(GEO.cyl,P,.06,.04,.06,s*.25,.58,-.29);a(GEO.cyl,H.trim,.058,.02,.058,s*.25,.3,-.29);a(GEO.cyl,H.trim,.058,.02,.058,s*.25,.48,-.29);
      a(GEO.cyl,H.rub,.018,.28,.018,s*.17,.66,-.17,-.95,0,0);a(GEO.cyl,H.dark,.065,.09,.065,s*.15,.13,-.36);a(GEO.cyl,H.screen,.045,.01,.045,s*.15,.085,-.36);a(GEO.box,H.iff,.035,.022,.01,s*.1,.62,-.382)}
    a(GEO.cyl,H.dark,.012,.16,.012,.16,.74,-.3);
    if(o.leaf){for(const k of[0,2.1,4.2])a(GEO.sph,MAT.leaf,.035,.08,.035,-.12+Math.cos(k)*.03,.72,-.3+Math.sin(k)*.03,Math.cos(k)*.4,0,Math.sin(k)*.4)}},true);
  humanHead(S.head,o);
  // arms; o.cy=[left,right] cybernetics: 0 none, 1 bionic hand, 2 bionic forearm and hand, 3 whole bionic arm (chrome bones, carbon cores, pistons, cyan light seams)
  const cy=o.cy||[0,0];
  for(let i=0;i<2;i++){const sd=i?1:-1,[sh,el]=S.arms[i],c=cy[i]|0;
    put(sh,n+'UA'+i+'c'+(c>=3?1:0),a=>{const R=rb(a);
      if(c>=3){a(GEO.sphL,H.chrome,.09,.09,.09,0,-.02,0);R(H.carbon,.15,.06,.17,0,.04,0,0,0,-sd*.2,.02);R(P,.16,.04,.18,sd*.02,.075,0,0,0,-sd*.25,.015);
        for(const x of[-.032,.032])a(GEO.cyl,H.chrome,.02,.3,.02,x,-.19,-.015);a(GEO.cyl,H.carbon,.042,.26,.042,0,-.19,.015);a(GEO.cyl,H.metal,.013,.22,.013,0,-.18,.06);a(GEO.cyl,H.trim,.02,.06,.02,0,-.09,.06);
        for(const y of[-.1,-.22])a(GEO.cyl,H.cglow,.05,.01,.05,0,y,.015);for(const x of[-.05,.05])a(GEO.cyl,H.rub,.009,.28,.009,x,-.19,-.045);a(GEO.cyl,H.chrome,.05,.13,.05,0,-.384,0,0,0,1.571);
        for(const x of[-.066,.066])a(GEO.cyl,H.cglow,.03,.006,.03,x,-.384,0,0,0,1.571)}
      else{a(GEO.sphL,H.rub,.095,.095,.095,0,-.02,0);a(GEO.cyl,H.rub,.075,.32,.078,0,-.18,0);
        R(H.shell,.21,.08,.23,sd*.02,.07,0,0,0,-sd*.25,.035);R(P,.19,.05,.21,sd*.05,.015,0,0,0,-sd*.38,.025);R(H.shell,.16,.04,.19,sd*.075,-.035,0,0,0,-sd*.55,.018);R(H.trim,.022,.02,.24,sd*.11,.1,0,0,0,-sd*.25);
        R(H.shell,.12,.16,.13,0,-.19,0,0,0,0,.03);a(GEO.plane,H.patch,.07,.07,1,sd*.0615,-.18,0,0,sd*1.571,0);a(GEO.cyl,H.trim,.08,.02,.082,0,-.28,0);bel(a,H.rub,.072,.075,-.32,2,.025)}},true);
    put(el,n+'FA'+i+'c'+c,a=>{const R=rb(a);
      if(c>=2){a(GEO.sphL,H.chrome,.06,.06,.06);for(const x of[-.03,.03])a(GEO.cyl,H.chrome,.018,.28,.018,x,-.17,-.01);a(GEO.cyl,H.carbon,.04,.22,.04,0,-.17,.02);R(H.carbon,.1,.1,.11,0,-.1,0,0,0,0,.02);
        R(P,.105,.025,.115,0,-.06,0,0,0,0,.006);a(GEO.box,H.cglow,.008,.2,.008,0,-.18,.062);a(GEO.cyl,H.metal,.011,.2,.011,sd*.05,-.17,-.045);for(const y of[-.14,-.24])a(GEO.cyl,H.cglow,.045,.008,.045,0,y,.02);
        a(GEO.cyl,H.chrome,.05,.045,.05,0,-.325,0)}
      else{a(GEO.sphL,H.trim,.07,.07,.07);R(H.shell,.1,.1,.06,0,-.01,-.065,.2,0,0,.02);a(GEO.cyl,H.rub,.066,.28,.068,0,-.16,0);
        R(H.shell,.135,.18,.145,0,-.18,.005,0,0,0,.03);R(P,.14,.03,.15,0,-.11,.005,0,0,0,.008);R(H.trim,.125,.03,.135,0,-.285,.005,0,0,0,.008);a(GEO.cyl,H.metal,.01,.2,.01,sd*.075,-.17,-.045);
        a(GEO.cyl,H.metal,.064,.04,.066,0,-.32,0);if(sd<0){R(H.trim,.03,.07,.09,-.075,-.2,.01,0,0,0,.01);a(GEO.box,H.screen,.006,.05,.07,-.091,-.2,.01)}else{R(H.trim,.03,.04,.06,.075,-.22,.02,0,0,0,.01);a(GEO.box,H.iff,.006,.015,.015,.091,-.22,.04)}}
      if(c>=1){R(H.chrome,.09,.085,.05,0,-.385,.03,0,0,0,.012);R(H.carbon,.07,.05,.055,0,-.36,.02,0,0,0,.01);a(GEO.box,H.cglow,.03,.03,.006,0,-.385,.057);
        for(let f=0;f<4;f++){const x=-.033+f*.022;a(GEO.sph,H.chrome,.012,.012,.012,x,-.43,.045);a(GEO.box,H.carbon,.016,.05,.018,x,-.46,.06,.45,0,0);a(GEO.sph,H.chrome,.009,.009,.009,x,-.485,.075)}
        a(GEO.sph,H.chrome,.014,.014,.014,-sd*.05,-.38,.05);a(GEO.box,H.carbon,.018,.05,.018,-sd*.06,-.41,.07,0,0,sd*.4)}
      else{R(H.rub,.1,.1,.11,0,-.39,.02,0,0,0,.03);R(H.shell,.09,.035,.04,0,-.405,.075,0,0,0,.01);
        for(let f=0;f<2;f++)R(H.rub,.09,.03,.05,0,-.44-f*.025,.06+f*.01,.5,0,0,.01);R(H.rub,.035,.06,.035,-sd*.05,-.4,.06,0,0,sd*.3,.01)}},true)}
  // extras: band (bandolier of shells), cape (one-shoulder cloth), tools (tool belt), scarf
  const X=o.x||[];if(X.length)put(S.tor,n+'X'+X.join(''),a=>{const R=rb(a);
    if(X.includes('band')){R(H.carbon,.06,.62,.03,0,.38,.205,-.08,0,.72,.01);for(let k=0;k<7;k++){const t=(k-3)*.075;a(GEO.cyl,H.gold,.014,.05,.014,t*.66,.38+t*.75,.225,1.571-.08,0,.72)}}
    if(X.includes('cape')){R(P,.3,.62,.025,-.17,.26,-.22,.12,0,.08,.01);R(H.gold,.06,.06,.02,-.25,.56,.12,0,0,0,.01)}
    if(X.includes('scarf')){a(GEO.tor,P,.17,.16,.35,0,.64,.0,1.571,0,0);R(P,.07,.24,.025,.08,.5,.2,-.1,0,.1,.008)}},true);
  if(X.includes('tools'))put(S.pel,n+'XT',a=>{const R=rb(a);a(GEO.cyl,H.carbon,.215,.035,.18,0,.03,0);for(const s of[-1,1]){R(H.trim,.05,.1,.05,s*.2,-.04,.1,0,0,0,.01);a(GEO.cyl,H.metal,.01,.14,.01,s*.2,.04,.1)}
    R(H.dark,.04,.12,.04,-.21,-.05,-.05,0,0,0,.01);a(GEO.cyl,H.gold,.012,.1,.012,-.21,.05,-.05);a(GEO.box,H.screen,.035,.05,.01,.21,-.04,.128)},true);
  for(let i=0;i<2;i++){const sd=i?1:-1,[hip,kn]=S.legs[i];
    put(hip,n+'Th'+i,a=>{const R=rb(a);a(GEO.sphL,H.rub,.09,.09,.09);a(GEO.cyl,H.rub,.098,.32,.102,0,-.17,0);
      R(H.shell,.17,.2,.08,0,-.14,.09,0,0,0,.03);R(P,.12,.04,.085,0,-.07,.095,0,0,0,.01);R(H.trim,.012,.14,.012,0,-.15,.135);R(H.shell,.05,.2,.16,sd*.1,-.13,0,0,0,0,.02);
      R(H.shell,.14,.16,.06,0,-.15,-.085,0,0,0,.02);a(GEO.cyl,H.trim,.108,.025,.108,0,-.25,0);R(H.metal,.03,.03,.02,sd*.06,-.25,.1);R(H.dark,.05,.1,.12,-sd*.1,-.12,.0,0,0,0,.015);bel(a,H.rub,.09,.092,-.3,2,.022)},true);
    put(kn,n+'Sh'+i,a=>{const R=rb(a);a(GEO.sphL,H.trim,.08,.08,.08);R(H.shell,.14,.14,.08,0,-.01,.09,-.2,0,0,.03);R(P,.08,.07,.085,0,-.01,.095,-.2,0,0,.012);for(const s of[-1,1])a(GEO.cyl,H.metal,.012,.012,.012,s*.055,-.01,.13,1.571,0,0);
      a(GEO.cyl,H.rub,.085,.24,.088,0,-.15,0);R(H.shell,.145,.2,.07,0,-.16,.075,0,0,0,.03);R(H.trim,.02,.18,.02,0,-.16,.113,0,0,0,.006);R(H.shell,.13,.16,.07,0,-.15,-.07,0,0,0,.025);
      for(const s of[-1,1])a(GEO.cyl,H.metal,.01,.18,.01,s*.085,-.15,-.02);a(GEO.cyl,H.trim,.085,.04,.088,0,-.27,0);
      R(H.shell,.165,.12,.19,0,-.31,.01,0,0,0,.04);R(H.rub,.175,.04,.31,0,-.39,.05,0,0,0,.012);for(let k=0;k<4;k++)R(H.dark,.17,.012,.025,0,-.41,-.07+k*.08);
      R(H.shell,.155,.07,.12,0,-.35,.145,0,0,0,.03);R(H.trim,.145,.05,.06,0,-.37,-.1,0,0,0,.012);R(P,.17,.02,.195,0,-.27,.01,0,0,0,.006);R(H.trim,.17,.02,.04,0,-.33,.08,.4,0,0,.006)},true)}
  return R}
"""
anchor = "// crawler: a four-legged mortar platform"
assert s.count(anchor) == 1
s = s.replace(anchor, HUMAN.lstrip('\n') + anchor)

# 3) Rowan: green faction panels, a sprout in the pack, and a green friend marker over the head that shows through walls
rep("const rwR=walkerRig(rwG,8),rwMuz=new T.Vector3(),",
    "const rwR=humanize(walkerRig(rwG,8),{key:'r',panel:std({color:0x3f9a58,roughness:.5,metalness:.15}),helm:2,visor:0x46d6a0,leaf:true,cy:[2,0]}),rwMuz=new T.Vector3(),")
rep("var ROW=null;const rwG=new T.Group();scene.add(rwG);rwG.visible=false;",
    "var ROW=null;const rwG=new T.Group();scene.add(rwG);rwG.visible=false;{humanMats();const q=new T.Sprite(GEO.ifff);q.scale.set(.32,.32,1);q.position.y=1.55;q.renderOrder=9;rwG.add(q)}")

# 4) the loadout: the player is a human in the same suit, armour pieces coloured as before through the plate material
rep("GR.rig=walkerRig(g,7);g.position.y=1.0;",
    "GR.rig=humanize(walkerRig(g,7),{key:'p',panel:charMats().plate[7],helm:0,visor:0xd9a441});g.position.y=1.0;")

# 5) hub: vendors are people, armour stands are empty suits with gold visors
rep("const rig=walkerRig(v,7);HUB.vend.push(",
    "const VO=VEND[k],rig=humanize(walkerRig(v,7),Object.assign({key:'v'+k,panel:std({color:lin(col),roughness:.45,metalness:.2})},VO));rig.segs.pel.parent.scale.multiplyScalar(VO.sc);v.position.y=.95*VO.sc;if(rig.segs.gun)rig.segs.gun.visible=false;rig.pose=VO.pose;HUB.vend.push(")
rep("walkerRig(v,7);M(GEO.cyl,gd,.7,.1,.7,W+6,.05,sz*4.2)",
    "{const r=humanize(walkerRig(v,7),{key:'m',panel:std({color:0x2c63c8,roughness:.45,metalness:.2}),helm:sz>0?1:3,visor:sz>0?0xd9a441:0x5fc8e8});if(r.segs.gun)r.segs.gun.visible=false;for(const[a,b]of r.segs.arms){a.rotation.set(0,0,0);b.rotation.set(0,0,0)}}M(GEO.cyl,gd,.7,.1,.7,W+6,.05,sz*4.2)")

# 6) first-person sleeves: suit cloth instead of grey robot plate
rep("const m=CM.plate[7].clone();m.color.setHex(0x7d8488).convertSRGBToLinear();m.roughness=.55;m.envMapIntensity=.2;return m",
    "const m=CM.plate[7].clone();m.color.setHex(0xb8bab4).convertSRGBToLinear();m.roughness=.82;m.metalness=.05;m.envMapIntensity=.2;return m")

open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))

# 7) the loadout helmet follows the equipped helmet's armour type: each type has its own shape and visor colour
s = open(dst, encoding='utf-8').read()
old = "set('h',ARMP[0]);set('a',ARMP[1]);set('c',ARMP[2]);set('l',ARMP[3])}"
assert s.count(old) == 1
s = s.replace(old, "{const ht=ARMP[0].t;if(GR.hk!==ht){GR.hk=ht;const PL=charMats().plate[7],hd=GR.rig.segs.head;humanHead(hd,{key:'p',panel:PL,helm:[3,2,1,0,0][ht],visor:[0xe08a2a,0x5fc8e8,0x46d6a0,0xc9a64a,0xd9a441][ht]});"
  "hd.traverse(q=>{if(q.isMesh&&q.material===PL)q.material=GR.mats.h||(GR.mats.h=PL.clone())})}}" + old)
open(dst, 'w', encoding='utf-8').write(s)
print('ok7')

# 8) unique vendors: build, helmet, cybernetics, extras and a stance each; the stance is applied after the walk cycle
s = open(dst, encoding='utf-8').read()
VEND = r"""
// Meridian's three shopkeepers: Hollis Vane the gunsmith (heavy, two bionic arms, bandolier, arms crossed),
// Ines Marlow the outfitter (slight, bionic right hand, half cape and scarf, hands on hips), Teo Brask the shipwright (pilot helmet, bionic left forearm, tool belt, waves now and then)
// stance helper: points the upper arm along d and the forearm along f (torso space), the elbow bends in that plane
const _am=new T.Matrix4(),_ax=new T.Vector3(),_ay=new T.Vector3(),_az=new T.Vector3();
function armTo(arm,d,f){const[sh,el]=arm;_ay.set(-d[0],-d[1],-d[2]).normalize();_az.set(f[0],f[1],f[2]).normalize();const ang=Math.acos(Math.max(-1,Math.min(1,-_ay.dot(_az))));
  _az.addScaledVector(_ay,-_ay.dot(_az));if(_az.lengthSq()<1e-6)_az.set(0,0,1);_az.normalize();_ax.crossVectors(_ay,_az);_am.makeBasis(_ax,_ay,_az);sh.quaternion.setFromRotationMatrix(_am);el.rotation.set(-ang,0,0)}
const HIPL=[[-.49,-.82,-.27],[.87,-.42,.2]],HIPR=[[.49,-.82,-.27],[-.87,-.42,.2]],lerp3=(a,b,k)=>a.map((v,i)=>v+(b[i]-v)*k);
const VEND={w:{helm:1,visor:0xe07a2a,cy:[3,3],x:['band','tools'],sc:1.1,pose:(A,t)=>{armTo(A[0],[.1,-.7,.7],[1,.12,0]);armTo(A[1],[-.1,-.66,.74],[-1,.22,.06])}},
  a:{helm:2,visor:0x5fc8e8,cy:[0,1],x:['cape','scarf'],sc:.95,pose:(A,t)=>{armTo(A[0],...HIPL);armTo(A[1],...HIPR)}},
  s:{helm:0,visor:0xb89ae0,cy:[2,0],x:['scarf','tools'],sc:1.02,pose:(A,t)=>{armTo(A[0],...HIPL);const w=Math.min(1,Math.max(0,Math.sin(t*.9))**6*1.4);
    armTo(A[1],lerp3(HIPR[0],[.4,.72,.15],w),lerp3(HIPR[1],[.3*Math.sin(t*9),1,.12],w))}}};
"""
anchor = "function hubBuild(){"
assert s.count(anchor) == 1
s = s.replace(anchor, VEND.lstrip('\n') + anchor)
old = "for(const v of HUB.vend){try{v.rig.anim(v.E,time,dt)}catch(e){}}"
assert s.count(old) == 1
s = s.replace(old, "for(const v of HUB.vend){try{v.rig.anim(v.E,time,dt);if(v.rig.pose)v.rig.pose(v.rig.segs.arms,time+v.E.ph)}catch(e){}}")
open(dst, 'w', encoding='utf-8').write(s)
print('ok8')
