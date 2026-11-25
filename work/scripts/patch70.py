p='/home/user/greenhouse-nine/index.html'
s=open(p).read()
i=s.index("function walkerRig(g,v){");j=s.index("  const jets=new T.Group();jets.position.set(0,.18,-.42);")
NEW=r"""// character kit: chamfered plates built at real size (so bevels and panel lines keep the same size on every part) and their own materials, separate from the map's
const CBX={};function cbox(w,h,d,b){b=Math.min(b||.025,w*.3,h*.3,d*.3);const k=[w,h,d,b].map(x=>x.toFixed(3)).join();if(CBX[k])return CBX[k];
  const x=w/2-b,y=h/2-b,sh=new T.Shape();sh.moveTo(-x,-y);sh.lineTo(x,-y);sh.lineTo(x,y);sh.lineTo(-x,y);
  const g=new T.ExtrudeGeometry(sh,{depth:Math.max(.002,d-2*b),bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelOffset:0,bevelSegments:1,steps:1});g.translate(0,0,-Math.max(.002,d-2*b)/2);return CBX[k]=g}
const rb=a=>(m,w,h,d,x=0,y=0,z=0,rx=0,ry=0,rz=0,b)=>a(cbox(w,h,d,b),m,1,1,1,x,y,z,rx,ry,rz);
let CHM=null;
function charMats(){if(CHM)return CHM;
  const pt=paint(256,(g,S)=>{g.fillStyle='#e6e8ea';g.fillRect(0,0,S,S);grime(g,S,1600,.03);
    for(let k=0;k<6;k++){g.fillStyle='rgba(0,0,0,'+(.02+hash(k,13)*.04)+')';g.fillRect(hash(k,11)*S*.8,hash(k,12)*S*.8,S*(.1+hash(k,14)*.22),S*(.08+hash(k,15)*.16))}
    const seam=(x0,y0,x1,y1)=>{g.strokeStyle='rgba(18,22,26,.55)';g.lineWidth=2.2;g.beginPath();g.moveTo(x0*S,y0*S);g.lineTo(x1*S,y1*S);g.stroke();
      g.strokeStyle='rgba(255,255,255,.22)';g.lineWidth=1;g.beginPath();g.moveTo(x0*S+1.5,y0*S+1.5);g.lineTo(x1*S+1.5,y1*S+1.5);g.stroke()};
    seam(0,.02,1,.02);seam(0,.52,1,.52);seam(.3,.02,.3,.52);seam(.78,.02,.78,.52);seam(.12,.52,.12,1);seam(.6,.52,.6,1);
    g.fillStyle='rgba(18,22,26,.45)';for(const y of[.06,.56])for(let k=0;k<12;k++){g.beginPath();g.arc((k+.5)*S/12,y*S,1.4,0,7);g.fill()}
    g.fillStyle='rgba(18,22,26,.35)';for(let k=0;k<5;k++)g.fillRect(S*.66,S*(.64+k*.045),S*.24,S*.018);
    g.strokeStyle='rgba(18,22,26,.4)';g.lineWidth=1.2;g.strokeRect(S*.36,S*.16,S*.32,S*.2);g.fillStyle='rgba(18,22,26,.3)';g.fillRect(S*.2,S*.72,S*.08,S*.05);g.fillRect(S*.3,S*.72,S*.03,S*.05)});
  pt.repeat.set(2.2,2.2);const pn=normalMap(pt,3.5);pn.wrapS=pn.wrapT=T.RepeatWrapping;pn.repeat.copy(pt.repeat);
  const jt=paint(128,(g,S)=>{g.fillStyle='#4a5056';g.fillRect(0,0,S,S);grime(g,S,900,.06);g.fillStyle='rgba(0,0,0,.28)';for(let y=0;y<S;y+=8)g.fillRect(0,y,S,2);g.fillStyle='rgba(255,255,255,.07)';for(let y=3;y<S;y+=8)g.fillRect(0,y,S,1)});
  jt.repeat.set(5,5);const jn=normalMap(jt,2.5);jn.wrapS=jn.wrapT=T.RepeatWrapping;jn.repeat.copy(jt.repeat);
  const C=[[0x3a6a76,.42,.55],[0x84483a,.45,.55],[0x34424a,.4,.6],[0x66704a,.55,.4],[0x46699a,.4,.6],[0xc4702a,.45,.4],[0x5a666c,.45,.55],[0xd2d6d8,.38,.5],[0x5a9a64,.5,.25]];
  CHM={plate:C.map(([c,r,m])=>{const o=std({color:c,map:pt,normalMap:pn,roughness:r,metalness:m});o.envMapIntensity=.32;return o}),
    joint:std({map:jt,normalMap:jn,color:0xffffff,roughness:.45,metalness:.75})};CHM.joint.envMapIntensity=.32;return CHM}
function walkerRig(g,v){const root=new T.Group();root.scale.setScalar([1,1.45,.78,1,1.1,.85,1,1.05,.98][v]);g.add(root);
  const CM=charMats(),A1=CM.plate[v],A2=CM.joint,AM=MAT.amber,EY=v>=7?MAT.strip:v>=2?MAT.eye:MAT.eyeA,n='w'+v;
  const pel=J(root,0,-.1,0);put(pel,n+'P',a=>{const R=rb(a);R(A2,.36,.18,.26);R(A1,.24,.15,.08,0,-.04,.15,.18,0,0);R(A1,.3,.12,.07,0,0,-.15,-.15,0,0);a(GEO.box,AM,.26,.02,.02,0,.075,.135);
    for(const s of[-1,1]){R(A1,.07,.24,.27,s*.235,-.08,0,0,0,s*.14);a(GEO.cyl,A2,.06,.05,.06,s*.2,0,0,0,0,1.571)}
    if(v===8){R(A2,.1,.13,.07,.21,-.12,.12,0,0,.1);R(A1,.11,.04,.08,.21,-.04,.12,0,0,.1)}});
  const tor=J(root,0,-.02,0);put(tor,n+'T',a=>{const R=rb(a),bp=v===1?1.3:1;
    a(GEO.cyl,A2,.17,.18,.15,0,.08,0);for(let i=0;i<3;i++)a(GEO.cyl,A2,.2,.025,.17,0,.02+i*.06,0);
    R(A1,.58,.34,.36,0,.4,0,0,0,0,.05);for(const s of[-1,1])R(A1,.25,.24,.07,s*.135,.43,.2,-.12,s*.14,0);R(A2,.06,.22,.06,0,.43,.2,-.12,0,0);
    R(A1,.38,.1,.06,0,.23,.18,.25,0,0);for(const s of[-1,1])a(GEO.box,AM,.07,.02,.015,s*.15,.52,.232,-.12,s*.14,0);
    R(A2,.32,.08,.28,0,.6,0);a(GEO.cyl,A2,.075,.12,.075,0,.64,.02);
    for(const s of[-1,1]){R(A1,.25*bp,.08*bp,.32*bp,s*.42,.66,0,0,0,-s*.32);R(A1,.2*bp,.07*bp,.28*bp,s*(.42+.05*bp),.6,0,0,0,-s*.55);a(GEO.sph,A2,.1,.1,.1,s*.38,.52,0)}
    R(A1,.46,.4,.18,0,.38,-.27);for(let i=0;i<4;i++)R(A2,.38,.02,.05,0,.24+i*.06,-.37,0,0,0,.008);
    for(const s of[-1,1]){a(GEO.cyl,A2,.055,.32,.055,s*.17,.4,-.39);a(GEO.cyl,AM,.06,.025,.06,s*.17,.57,-.39)}
    a(GEO.cyl,A2,.012,v===3?.8:.45,.012,.15,v===3?.9:.75,-.34);a(GEO.sph,AM,.025,.025,.025,.15,v===3?1.3:.98,-.34);
    if(v===1)for(const s of[-1,1]){a(GEO.cyl,A2,.06,.4,.06,s*.14,.75,-.4);a(GEO.cyl,AM,.065,.05,.065,s*.14,.95,-.4);R(A1,.1,.06,.1,s*.14,.62,-.4)}
    if(v===2)for(let i=0;i<4;i++)a(GEO.cone,A2,.05,.2,.05,0,.6-i*.15,-.44,-.6,0,0);
    if(v===3)a(GEO.box,MAT.cloak,.58,.75,.04,0,.2,-.45,.12,0,0);
    if(v===5){for(let i=0;i<5;i++)R(i%2?A2:AM,.5,.045,.02,0,.13+i*.065,.25,0,0,0,.006);for(const s of[-1,1])a(GEO.box,A2,.04,.42,.03,s*.2,.3,.25)}
    if(v===6){R(A2,.2,.46,.2,.2,.62,-.3);a(GEO.cyl,A1,.13,.9,.13,.2,.95,-.2,1.2,0,0);a(GEO.cyl,A2,.14,.05,.14,.2,.73,-.62,1.2,0,0);a(GEO.cyl,AM,.14,.04,.14,.2,1.13,.13,1.2,0,0)}
    if(v===8){for(const y of[.24,.5])a(GEO.cyl,A2,.085,.025,.085,-.14,y,-.44);a(GEO.sph,MAT.leaf,.07,.11,.07,-.14,.37,-.44);for(const k of[0,2.1,4.2])a(GEO.cyl,A2,.008,.26,.008,-.14+Math.cos(k)*.08,.37,-.44+Math.sin(k)*.08)}},true);
  const head=J(tor,0,.62,.02);put(head,n+'H',a=>{const R=rb(a);
    if(v===2){R(A2,.22,.18,.4,0,.15,.04,0,0,0,.04);R(A1,.26,.08,.42,0,.25,.02);R(A1,.05,.06,.36,0,.31,0);for(const x of[-.07,0,.07])a(GEO.sph,EY,.04,.04,.03,x,.16,.24);
      for(const s of[-1,1])a(GEO.cone,A2,.03,.16,.03,s*.07,.04,.24,2.6,0,0)}
    else if(v===3){R(A2,.28,.26,.3,0,.15,0,0,0,0,.05);a(GEO.cyl,A2,.09,.08,.09,0,.18,.17,1.571,0,0);a(GEO.cyl,A1,.11,.03,.11,0,.18,.13,1.571,0,0);a(GEO.sph,EY,.07,.07,.03,0,.18,.215);
      a(GEO.cyl,A2,.035,.14,.035,.15,.25,.08,1.571,0,0);a(GEO.cone,MAT.cloak,.3,.5,.3,0,.32,-.06)}
    else{const pl=v>=7;R(A2,.3,.26,.32,0,.15,-.02,0,0,0,.05);R(A1,.36,.12,.38,0,.28,0,0,0,0,.04);for(const s of[-1,1])R(A1,.06,.2,.3,s*.17,.16,-.02);
      R(A2,pl?.3:.28,pl?.13:.1,.05,0,.17,.16);a(GEO.box,EY,pl?.26:.24,pl?.07:.04,.02,0,.17,.185);
      if(v===1)R(A1,.4,.18,.14,0,.07,.18,.15,0,0);else R(A1,.24,.1,.1,0,.05,.15,.25,0,0);
      if(v===8)a(GEO.cyl,AM,.03,.04,.03,.2,.22,.1,1.571,0,0);else if(!pl)R(A1,.05,.07,.28,0,.36,-.02)}
    for(const s of[-1,1])a(GEO.cyl,A2,.05,.05,.05,s*.205,.15,0,0,0,1.571)});
  {const q=glow(v>=7?0x6fe3ff:v>=2?0xff3b3b:0xffb238,.8,.7);q.position.set(0,.18,.24);head.add(q)}
  const arms=[];for(const s of[-1,1]){const sh=J(tor,s*.4,.5,0);put(sh,n+'UA',a=>{const R=rb(a);a(GEO.cyl,A2,.065,.3,.065,0,-.2,0);R(A1,.17,.22,.19,0,-.13,0,0,0,0,.035);R(A2,.15,.05,.17,0,-.27,0);a(GEO.sph,A2,.085,.085,.085,0,-.02,0)});
    const el=J(sh,0,-.384,0);put(el,n+'FA'+(s>0?'r':'l'),a=>{const R=rb(a);a(GEO.sph,A2,.075,.075,.075);R(A1,.155,.24,.17,0,-.17,.01,0,0,0,.035);R(A1,.12,.08,.06,0,0,-.08);a(GEO.box,AM,.012,.07,.035,s*.079,-.17,.03);
      R(A2,.12,.06,.14,0,-.32,0);R(A2,.11,.1,.12,0,-.40,.02,0,0,0,.025);R(A2,.1,.05,.06,0,-.45,.06,.5,0,0,.015);
      if((v===1||v===4)&&s<0){R(A1,.08,.66,.52,-.12,-.2,.06);a(GEO.box,AM,.02,.5,.02,-.165,-.2,.31)}if(v===2){R(A2,.06,.14,.1,0,-.36,.05);a(GEO.cone,AM,.035,.55,.035,0,-.7,.05,Math.PI,0,0)}});arms.push([sh,el])}
  let gun=null;if(v!==2&&v!==5){gun=J(tor,GX,GY,(GH[v]||GH.d).gz);put(gun,n+'G',a=>{const R=rb(a);
    if(v===1){R(A2,.18,.2,.56,0,0,.05);for(const x of[-.045,.045])a(GEO.cyl,A2,.04,.42,.04,x,.03,.48,1.571,0,0);R(A1,.2,.1,.36,0,.12,.1);a(GEO.cyl,A1,.12,.12,.12,0,-.14,.04,0,0,1.571);a(GEO.box,AM,.02,.03,.24,.101,.12,.1);
      for(let i=0;i<3;i++)R(A2,.21,.02,.04,0,.05,.32+i*.06,0,0,0,.006)}
    else if(v===6){R(A2,.12,.16,.5,0,0,0);a(GEO.cyl,A1,.11,.7,.11,0,.12,.25,1.571,0,0);a(GEO.cyl,A2,.125,.04,.125,0,.12,-.05,1.571,0,0);a(GEO.cyl,AM,.12,.05,.12,0,.12,.6,1.571,0,0);a(GEO.box,EY,.03,.03,.03,0,.25,.1);R(A2,.06,.15,.08,0,-.13,.06,-.2,0,0)}
    else if(v===3){R(A2,.09,.13,.9,0,0,.05);R(A1,.1,.08,.4,0,.02,.35);a(GEO.cyl,A2,.022,.9,.022,0,.01,.9,1.571,0,0);R(A2,.06,.05,.1,0,.01,1.33);a(GEO.cyl,A2,.045,.36,.045,0,.13,.02,1.571,0,0);a(GEO.sph,EY,.03,.03,.02,0,.13,.21);R(A1,.1,.06,.3,0,-.05,-.3);R(A2,.06,.15,.08,0,-.13,-.02,-.2,0,0)}
    else if(v===8){R(A2,.1,.14,.5,0,0,.02);R(A1,.12,.1,.36,0,.07,0);a(GEO.cyl,MAT.strip,.05,.3,.05,0,.01,.44,1.571,0,0);a(GEO.sph,MAT.strip,.06,.06,.06,0,.01,.62);for(const z of[.34,.44,.54])a(GEO.cyl,A2,.065,.02,.065,0,.01,z,1.571,0,0);a(GEO.box,AM,.05,.05,.05,0,.1,.2);R(A2,.07,.16,.1,0,-.14,.06,-.2,0,0)}
    else{R(A2,.1,.14,.5,0,0,-.06);R(A1,.11,.1,.36,0,.02,.3);a(GEO.cyl,A2,.025,.24,.025,0,.01,.58,1.571,0,0);a(GEO.cyl,A2,.038,.07,.038,0,.01,.7,1.571,0,0);a(GEO.box,AM,.012,.02,.12,.056,.03,.3);
      R(A2,.06,.15,.08,0,-.13,.06,-.2,0,0);R(A2,.06,.14,.1,0,-.12,.22,.15,0,0);R(A1,.08,.1,.22,0,-.02,-.4);a(GEO.cyl,A2,.03,.16,.03,0,.12,-.04,1.571,0,0);a(GEO.box,EY,.02,.03,.02,0,.12,-.13)}})}
  let HR=null,HL=null,GZ=.56;if(gun){const G=GH[v]||GH.d;GZ=G.gz;let c=IKC[v];if(!c){c={HR:ikArm([.4,.5,0],[GX+G.r[0],GY+G.r[1],G.gz+G.r[2]]),HL:G.l?ikArm([-.4,.5,0],[GX+G.l[0],GY+G.l[1],G.gz+G.l[2]]):null};IKC[v]=c}HR=c.HR.a;HL=c.HL?c.HL.a:null}
  const legs=[];for(const s of[-1,1]){const hip=J(root,s*.15,-.16,0);put(hip,n+'Th',a=>{const R=rb(a);a(GEO.sph,A2,.08,.08,.08);a(GEO.cyl,A2,.06,.3,.06,0,-.17,0);R(A1,.2,.24,.23,0,-.14,.015,0,0,0,.04);R(A2,.17,.05,.2,0,-.29,0)},true);
    const kn=J(hip,0,-.34,0);put(kn,n+'Sh',a=>{const R=rb(a);a(GEO.sph,A2,.08,.08,.08);R(A1,.15,.13,.08,0,-.01,.11,-.25,0,0,.025);R(A1,.17,.22,.19,0,-.17,.02,0,0,0,.035);a(GEO.cyl,A2,.022,.22,.022,0,-.17,-.1);
      R(A2,.13,.06,.15,0,-.31,0);R(A1,.19,.07,.26,0,-.37,.05,0,0,0,.025);R(A2,.17,.05,.09,0,-.38,.21);R(A2,.15,.06,.07,0,-.375,-.1)});legs.push([hip,kn])}
"""
s=s[:i]+NEW+s[j:]
old="put(tor,n+'J',a=>{for(const s of[-1,1]){a(GEO.cyl,A2,.07,.22,.07,s*.15,.08,-.44);a(GEO.cyl,AM,.075,.04,.075,s*.15,-.03,-.44)}});"
assert s.count(old)==1
open(p,'w').write(s)
print('ok')
