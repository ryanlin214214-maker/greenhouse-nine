// ---------- v92: the Dark's Host, detailed. Original designs: the Reaver (a tall blade warrior in violet obsidian
// carapace) and the Maul (a hunched siege brute in bronze and bone with a rift cannon). Built on a walker rig's joints
// (so animation, the combat layer and ragdolls keep working), from textured layered plates, tapered bone chains, claws,
// cloth strips and glowing veins, merged per material per joint by `put`.
let DKF=null;function darkFlesh(){if(DKF)return DKF;const tx=(fn,rep)=>{const t=paint(256,fn);t.wrapS=t.wrapT=T.RepeatWrapping;if(rep)t.repeat.set(rep,rep);return t};
  const scales=(base,lite,dark)=>(g,S)=>{g.fillStyle=base;g.fillRect(0,0,S,S);for(let y=-1;y<9;y++)for(let x=-1;x<9;x++){const cx=(x+(y%2)*.5)*S/8,cy=y*S/8;const gr=g.createLinearGradient(cx,cy-S/16,cx,cy+S/10);gr.addColorStop(0,lite);gr.addColorStop(1,base);g.fillStyle=gr;g.beginPath();g.ellipse(cx,cy,S/15,S/11,0,0,Math.PI);g.fill();g.strokeStyle=dark;g.lineWidth=2;g.stroke()}
    for(let i=0;i<40;i++){g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=1;g.beginPath();let x=Math.random()*S,y=Math.random()*S;g.moveTo(x,y);for(let k=0;k<4;k++){x+=(Math.random()-.5)*30;y+=(Math.random()-.5)*30;g.lineTo(x,y)}g.stroke()}grime(g,S,500,.05)};
  const leather=(base)=>(g,S)=>{g.fillStyle=base;g.fillRect(0,0,S,S);for(let i=0;i<2600;i++){const v=Math.random();g.fillStyle=v<.5?'rgba(255,255,255,.035)':'rgba(0,0,0,.08)';g.fillRect(Math.random()*S,Math.random()*S,2+Math.random()*5,1+Math.random()*3)}
    for(let i=0;i<30;i++){g.strokeStyle='rgba(0,0,0,.25)';g.beginPath();g.moveTo(Math.random()*S,Math.random()*S);g.quadraticCurveTo(Math.random()*S,Math.random()*S,Math.random()*S,Math.random()*S);g.stroke()}};
  const hammered=(base)=>(g,S)=>{g.fillStyle=base;g.fillRect(0,0,S,S);for(let i=0;i<120;i++){const x=Math.random()*S,y=Math.random()*S,r=6+Math.random()*14,gr=g.createRadialGradient(x-r*.3,y-r*.3,0,x,y,r);gr.addColorStop(0,'rgba(255,220,160,.1)');gr.addColorStop(1,'rgba(0,0,0,.06)');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill()}grime(g,S,500,.05)};
  const boneT=(g,S)=>{g.fillStyle='#c7b99c';g.fillRect(0,0,S,S);for(let i=0;i<1500;i++){g.fillStyle='rgba(80,60,40,'+(.05+Math.random()*.12)+')';g.fillRect(Math.random()*S,Math.random()*S,1.5,1.5)}for(let i=0;i<14;i++){g.strokeStyle='rgba(70,50,30,.45)';g.lineWidth=1;g.beginPath();let x=Math.random()*S,y=Math.random()*S;g.moveTo(x,y);for(let k=0;k<6;k++){x+=(Math.random()-.5)*24;y+=Math.random()*20;g.lineTo(x,y)}g.stroke()}};
  const sc=tx(scales('#43355a','#5c4a7c','#2a1f38'),9),scD=tx(scales('#2a2138','#3a2e50','#17101f'),9);
  DKF={cara:std({map:sc,color:0xd8ccf0,roughness:.26,metalness:.45,emissive:0x12081e}),caraD:std({map:scD,color:0xcabfe0,roughness:.3,metalness:.45}),
    hide:std({map:tx(leather('#3a2c46'),6),color:0xc0b0d0,roughness:.85,metalness:0}),cloth:std({map:tx(leather('#1e1624'),2),color:0xa898b8,roughness:.95,metalness:0,side:T.DoubleSide}),
    vio:bas({color:0xb860ff}),vioC:bas({color:0xf0c8ff}),blade:bas({color:0xc890ff,transparent:true,opacity:.92}),edge:bas({color:0xfff0ff}),
    bronze:std({map:tx(hammered('#8a5a30'),5),color:0xf0d0a8,roughness:.48,metalness:.6,emissive:0x140804}),bronzeD:std({map:tx(hammered('#5a3a22'),5),color:0xd8b898,roughness:.4,metalness:.65}),
    bhide:std({map:tx(leather('#4c2e22'),6),color:0xc8a890,roughness:.88,metalness:0}),bone:std({map:tx(boneT,1),color:0xffffff,roughness:.55,metalness:.03}),
    iron:std({color:0x2c2826,roughness:.45,metalness:.8}),red:bas({color:0xff4a22}),ember:bas({color:0xffb070})};for(const k of['cara','caraD','bronze','bronzeD','bone','hide','bhide'])DKF[k].side=T.DoubleSide;return DKF}
const TAPG=new T.CylinderGeometry(.62,1,1,10),SHF=new T.SphereGeometry(1,20,10,0,Math.PI*2,0,Math.PI/2),CYS=new T.CylinderGeometry(1,1,1,16,1,true,-Math.PI/2,Math.PI),CYB=new T.CylinderGeometry(.75,1,1,16,1,true,-Math.PI/2,Math.PI);
let BLG=null;function bladeGeo(){if(BLG)return BLG;const mk=(w,inset)=>{const s=new T.Shape();s.moveTo(0,0);s.quadraticCurveTo(w*1.3,-.35,w*.25+inset,-.86);s.lineTo(inset*.5,-.8);s.quadraticCurveTo(w*.45,-.38,-w*.15,-.02);s.closePath();
  const g=new T.ExtrudeGeometry(s,{depth:.012,bevelEnabled:true,bevelThickness:.006,bevelSize:.006,bevelSegments:1,curveSegments:10});g.rotateY(Math.PI/2);return g};BLG={body:mk(.09,0),edge:mk(.13,.03)};return BLG}
// a chain of tapered segments through points (horns, tusks, spines, claws, blades), with a cone tip
function bone(a,m,P,r0,r1,tipM){const n=P.length-1,q=new T.Quaternion(),E=new T.Euler(),up=new T.Vector3(0,1,0),d=new T.Vector3();
  for(let i=0;i<n;i++){const A=P[i],B=P[i+1];d.set(B[0]-A[0],B[1]-A[1],B[2]-A[2]);const L=d.length();d.normalize();q.setFromUnitVectors(up,d);E.setFromQuaternion(q);const r=r0+(r1-r0)*i/n;
    if(i<n-1)a(TAPG,m,r,L*1.04,r,(A[0]+B[0])/2,(A[1]+B[1])/2,(A[2]+B[2])/2,E.x,E.y,E.z);else a(GEO.cone,tipM||m,r,L,r,(A[0]+B[0])/2,(A[1]+B[1])/2,(A[2]+B[2])/2,E.x,E.y,E.z)}}
const arcP=(x0,y0,z0,dx,dy,dz,bx,by,bz,n)=>{const P=[];for(let i=0;i<=n;i++){const t=i/n;P.push([x0+dx*t+bx*t*t,y0+dy*t+by*t*t,z0+dz*t+bz*t*t])}return P};
function darkify(R,type){const F=darkFlesh(),S=R.segs,big=type===14,n='dk2_'+type;S.pel.parent.scale.setScalar(big?1.55:1.25);
  const strip=j=>{if(!j)return;for(const c of[...j.children])if(c.userData.kit||c.isSprite)j.remove(c)};
  strip(S.pel);strip(S.tor);strip(S.head);for(const[a,b]of S.arms){strip(a);strip(b)}for(const[a,b]of S.legs){strip(a);strip(b)}if(S.gun)strip(S.gun);
  if(!big){
   // ===== REAVER =====
   put(S.pel,n+'P',a=>{const R=rb(a);a(GEO.cyl,F.hide,.17,.2,.14,0,-.02,0);
     for(let i=0;i<8;i++){const an=i/8*6.283;R(F.cara,.11,.1,.05,Math.sin(an)*.19,.04,Math.cos(an)*.15,-.15,an,0,.015)}
     a(GEO.oct,F.vio,.035,.05,.02,0,.04,.19);a(GEO.oct,F.vioC,.018,.03,.012,0,.04,.205);
     for(const s of[-1,1]){R(F.caraD,.08,.2,.22,s*.21,-.1,0,0,0,s*.18,.02);for(let k=0;k<3;k++)R(F.cara,.085,.05,.2,s*(.215+k*.012),-.03-k*.07,0,0,0,s*(.2+k*.05),.01)}
     // tabard: front strips of different lengths, back cape strips, a violet trim on each
     [[-.09,.5,.04],[0,.62,0],[.09,.46,-.04]].forEach(([x,L,r])=>{a(GEO.box,F.cloth,.085,L,.012,x,-.07-L/2,.17,.08,0,r);a(GEO.box,F.vio,.006,L*.85,.014,x+.04,-.07-L*.45,.172,.08,0,r)});
     [[-.13,.6],[-.045,.7],[.045,.66],[.13,.55]].forEach(([x,L])=>a(GEO.box,F.cloth,.085,L,.012,x,-.06-L/2,-.16,-.1,0,x*.6))},true);
   put(S.tor,n+'T',a=>{const R=rb(a);a(TAPG,F.hide,.15,.3,.11,0,.15,0,Math.PI,0,0);a(GEO.sph,F.hide,.25,.21,.17,0,.43,0);
     for(let i=0;i<5;i++){a(CYB,i%2?F.caraD:F.cara,.13+i*.012,.05,.1+i*.008,0,.07+i*.05,.0);a(GEO.box,F.vio,.004,.03,.004,0,.07+i*.05,.11+i*.008)}
     for(const s of[-1,1]){a(SHF,F.cara,.15,.09,.15,s*.105,.45,.1,Math.PI/2,0,-s*.25);a(SHF,F.caraD,.1,.05,.06,s*.1,.33,.12,Math.PI/2+.5,0,-s*.25);
       for(let k=0;k<3;k++)a(GEO.box,F.vio,.004,.004,.08,s*(.05+k*.05),.5-k*.04,.16,0,s*.6,0);a(SHF,F.cara,.09,.08,.2,s*.23,.42,0,0,0,-s*1.35)}
     R(F.caraD,.05,.32,.05,0,.42,.17,-.1,0,0,.015);for(let k=0;k<3;k++){a(GEO.box,F.vio,.05,.012,.012,0,.33+k*.08,.198,-.1,0,0);a(GEO.box,F.vioC,.03,.006,.014,0,.33+k*.08,.2,-.1,0,0)}
     a(SHF,F.cara,.24,.12,.26,0,.42,-.06,-Math.PI/2,0,0);for(let k=0;k<4;k++)a(GEO.box,F.vio,.004,.12,.004,(k-1.5)*.08,.42,-.18,0,0,(k-1.5)*.15);
     for(let k=0;k<7;k++){const y=.66-k*.075;bone(a,F.caraD,[[0,y,-.16],[0,y+.05,-.27+k*.008],[0,y+.02,-.36+k*.012]],.022-k*.0015,.012)}
     for(const s of[-1,1])bone(a,F.cara,arcP(s*.14,.55,-.18,s*.16,.24,-.26,0,-.06,-.16,4),.03,.012,F.caraD);
     for(let i=0;i<8;i++){const an=(i/8-.5)*2.4;R(F.caraD,.07,.05,.04,Math.sin(an)*.13,.62,Math.cos(an)*.1,.2,an,0,.012)}
     for(const s of[-1,1]){for(let k=0;k<3;k++){a(SHF,k%2?F.caraD:F.cara,.16-k*.02,.1-k*.015,.18-k*.02,s*(.42+k*.025),.56+k*.035,-.02-k*.02,0,0,-s*(.35+k*.2));a(GEO.box,F.vio,.004,.004,.2-k*.03,s*(.53+k*.03),.53+k*.04,-.02-k*.02,0,0,-s*(.35+k*.2))}
       bone(a,F.cara,arcP(s*.5,.64,-.1,s*.12,.12,-.14,s*.02,0,-.1,3),.032,.012,F.caraD);bone(a,F.caraD,arcP(s*.44,.6,-.18,s*.08,.08,-.16,0,0,-.06,3),.022,.01)}},true);
   put(S.head,n+'H',a=>{const R=rb(a);a(GEO.cyl,F.hide,.06,.12,.06,0,.0,0);for(let k=0;k<3;k++)a(GEO.tor,F.caraD,.075,.075,.25,0,-.02+k*.035,0,1.571,0,0);
     R(F.cara,.18,.17,.24,0,.13,.02,.1,0,0,.045);R(F.caraD,.12,.06,.18,0,.05,.12,.35,0,0,.02);
     for(const s of[-1,1]){R(F.cara,.05,.14,.2,s*.09,.12,.06,-.05,s*.35,0,.015);R(F.caraD,.03,.06,.12,s*.1,.05,.14,.5,s*.4,0,.01)}
     R(F.caraD,.16,.045,.04,0,.15,.13,0,0,0,.01);for(const x of[-.045,0,.045]){a(GEO.sph,F.vio,.018,.014,.01,x,.155+(x?0:.012),.152);a(GEO.sph,F.vioC,.008,.007,.006,x,.155+(x?0:.012),.16)}
     bone(a,F.cara,arcP(0,.2,.06,0,.16,-.34,0,-.02,-.12,5),.05,.012,F.caraD);bone(a,F.caraD,arcP(0,.24,.0,0,.08,-.22,0,0,-.05,3),.02,.008,F.vio);
     for(const s of[-1,1]){bone(a,F.cara,arcP(s*.08,.19,-.02,s*.1,.06,-.3,s*.04,.04,-.08,5),.025,.007,F.caraD);bone(a,F.caraD,arcP(s*.09,.1,-.06,s*.08,-.02,-.2,0,0,-.04,3),.015,.005)}},true);
   {const q=glow(0xb050ff,.16,.6);q.position.set(0,.16,.17);S.head.add(q)}
   S.arms.forEach(([sh,el],i)=>{const sd=i?1:-1;
     put(sh,n+'UA'+i,a=>{const R=rb(a);a(GEO.sphL,F.hide,.085,.085,.085);a(GEO.sph,F.hide,.07,.18,.07,0,-.18,0);a(CYS,F.cara,.082,.22,.082,0,-.15,.0);a(CYS,F.caraD,.08,.14,.08,0,-.17,0,0,Math.PI,0);a(SHF,F.cara,.09,.06,.09,0,-.02,0,0,0,sd*.3);
       for(let k=0;k<2;k++)a(GEO.tor,F.caraD,.072,.072,.3,0,-.06-k*.2,0,1.571,0,0);R(F.caraD,.06,.16,.04,sd*.06,-.17,.07,0,0,0,.012);a(GEO.box,F.vio,.006,.12,.01,sd*.06,-.17,.092)},true);
     put(el,n+'FA'+i,a=>{const R=rb(a);a(GEO.sphL,F.caraD,.075,.075,.075);bone(a,F.cara,arcP(0,0,-.06,0,.04,-.14,0,.02,-.02,2),.03,.01);
       a(TAPG,F.hide,.06,.36,.06,0,-.2,0,Math.PI,0,0);for(let k=0;k<3;k++)a(CYB,k%2?F.caraD:F.cara,.08-k*.006,.1,.08-k*.006,0,-.08-k*.09,.01,Math.PI,0,0);a(GEO.box,F.vio,.006,.26,.006,0,-.17,.082);
       R(F.caraD,.04,.3,.1,sd*.085,-.2,-.01,0,0,0,.012);
       // the arm blade: a dark spine with a glowing cutting edge, curving forward past the hand
       {const BG=bladeGeo();a(BG.edge,F.blade,1,1,1,sd*.1,-.06,.02,.12,0,0);a(BG.body,F.caraD,1,1,1,sd*.1,-.06,.0,.12,0,0);bone(a,F.cara,arcP(sd*.1,-.04,-.02,0,-.2,.03,0,0,0,2),.025,.012)}
       // a hand of three long claws and a thumb
       R(F.hide,.09,.08,.08,0,-.42,.02,0,0,0,.02);for(const x of[-.03,0,.03])bone(a,F.caraD,arcP(x,-.45,.04,0,-.12,.04,0,0,.04,3),.012,.005,F.cara);bone(a,F.caraD,arcP(-sd*.05,-.42,.05,-sd*.03,-.06,.05,0,0,0,2),.01,.004)},true)});
   S.legs.forEach(([hip,kn],i)=>{const sd=i?1:-1;
     put(hip,n+'Th'+i,a=>{const R=rb(a);a(GEO.sphL,F.hide,.085,.085,.085);a(GEO.sph,F.hide,.08,.19,.085,0,-.16,0);a(CYB,F.cara,.09,.24,.095,0,-.14,.01,Math.PI,0,0);R(F.caraD,.06,.24,.16,sd*.08,-.15,0,0,0,sd*.1,.02);
       a(GEO.box,F.vio,.006,.16,.008,0,-.14,.135);for(let k=0;k<2;k++)a(GEO.tor,F.caraD,.08,.08,.28,0,-.04-k*.24,0,1.571,0,0)},true);
     put(kn,n+'Sh'+i,a=>{const R=rb(a);a(GEO.sphL,F.caraD,.075,.075,.075);R(F.cara,.13,.13,.08,0,-.0,.1,-.3,0,0,.03);bone(a,F.cara,arcP(0,.02,.12,0,.08,.08,0,0,.04,2),.03,.01,F.caraD);
       a(TAPG,F.hide,.06,.28,.065,0,-.15,0,Math.PI,0,0);a(CYB,F.cara,.075,.24,.08,0,-.17,.01,Math.PI,0,0);R(F.caraD,.04,.22,.04,0,-.17,.115,0,0,0,.01);a(GEO.box,F.vio,.006,.18,.006,0,-.17,.137);
       R(F.caraD,.1,.18,.08,0,-.15,-.06,0,0,0,.025);bone(a,F.caraD,arcP(0,-.2,-.09,0,.05,-.1,0,0,-.03,2),.02,.006);
       R(F.cara,.15,.07,.2,0,-.36,.05,0,0,0,.025);for(const x of[-.05,0,.05])bone(a,F.caraD,arcP(x,-.38,.14,0,-.02,.08,0,-.01,.03,2),.018,.006,F.cara);bone(a,F.caraD,arcP(0,-.37,-.06,0,-.02,-.07,0,0,-.01,2),.016,.005)},true)})}
  else{
   // ===== MAUL =====
   put(S.pel,n+'P',a=>{const R=rb(a);R(F.bhide,.42,.2,.3,0,-.02,0,0,0,0,.06);R(F.iron,.46,.07,.33,0,.05,0,0,0,0,.02);
     for(const x of[-.14,0,.14]){a(GEO.cyl,F.bone,.05,.03,.05,x,.05,.17,1.571,0,0);a(GEO.sph,F.red,.012,.012,.012,x,.05,.2)}
     for(let k=0;k<6;k++){const an=(k/6-.5)*2.6;a(GEO.tor,F.iron,.03,.03,.5,Math.sin(an)*.2,-.03-Math.abs(an)*.03,.15+Math.cos(an)*.02,0,an,0)}
     a(GEO.box,F.bhide,.2,.4,.02,0,-.28,.16,.06,0,0);for(const s of[-1,1]){R(F.bronze,.13,.24,.3,s*.26,-.08,0,0,0,s*.22,.03);R(F.bronzeD,.14,.05,.31,s*.27,.02,0,0,0,s*.22,.015);a(GEO.box,F.bhide,.18,.36,.02,s*.1,-.26,-.17,-.08,0,0)}},true);
   put(S.tor,n+'T',a=>{const R=rb(a);a(GEO.sph,F.bhide,.36,.3,.28,0,.42,-.02);a(GEO.sph,F.bhide,.27,.2,.24,0,.16,.02);for(const s of[-1,1])a(GEO.sph,F.bhide,.16,.14,.16,s*.3,.6,-.02);
     for(let r=0;r<5;r++){const y=.12+r*.105,k=Math.sin(.6+r*.5);a(CYS,r%2?F.bronzeD:F.bronze,.27+k*.11,.1,.22+k*.08,0,y,0,-.08,0,0);a(GEO.box,F.red,.2,.008,.012,0,y-.03,.22+k*.08-.008)}
     for(let k=0;k<4;k++){a(GEO.box,F.red,.004,.07,.004,(k-1.5)*.08,.3+((k*7)%3)*.05,.265,-.2,0,(k-1.5)*.4);a(GEO.box,F.ember,.002,.04,.005,(k-1.5)*.08,.3+((k*7)%3)*.05,.268,-.2,0,(k-1.5)*.4)}
     for(let r=0;r<5;r++){const y=.16+r*.11,k=Math.sin(.7+r*.45);a(CYS,r%2?F.bronzeD:F.bronze,.28+k*.1,.11,.26+k*.08,0,y,-.02,.1,Math.PI,0)}for(const s of[-1,1])a(CYS,F.bronze,.17,.16,.17,s*.31,.62,-.02,0,s*Math.PI/2,0);for(let k=0;k<5;k++){a(GEO.box,F.red,.006,.08,.006,-.16+k*.08,.44,-.38,.2,0,(k-2)*.3);a(GEO.box,F.ember,.003,.05,.008,-.16+k*.08,.44,-.381,.2,0,(k-2)*.3)}
     for(let k=0;k<7;k++)bone(a,F.bone,arcP(0,.7-k*.08,-.3+k*.03,0,.1+(6-k)*.025,-.12,0,0,-.06,3),.05-k*.004,.016);
     for(const s of[-1,1]){R(F.bone,.24,.09,.32,s*.3,.66,-.02,0,0,-s*.25,.03);for(let k=0;k<3;k++)bone(a,F.bone,arcP(s*(.18+k*.1),.74,-.04,s*.03,.14-k*.02,-.05,0,0,-.04,3),.03,.01)}
     for(const s of[-1,1]){for(let k=0;k<3;k++){R(k%2?F.bronzeD:F.bronze,.34-k*.05,.11,.42-k*.06,s*(.56+k*.02),.64+k*.06,0,0,0,-s*(.3+k*.08),.04)}a(GEO.box,F.red,.24,.008,.01,s*.56,.61,.22,0,0,-s*.3);
       bone(a,F.bone,arcP(s*.64,.76,.02,s*.14,.18,-.04,s*.06,0,0,4),.045,.016);bone(a,F.bone,arcP(s*.56,.76,-.14,s*.06,.14,-.1,0,0,-.04,3),.032,.012)}},true);
   put(S.head,n+'H',a=>{const R=rb(a);a(GEO.cyl,F.bhide,.1,.14,.1,0,.0,.02);R(F.bhide,.26,.22,.26,0,.1,.04,0,0,0,.07);R(F.bronze,.3,.08,.22,0,.2,.06,.15,0,0,.03);R(F.bone,.32,.06,.12,0,.17,.14,.2,0,0,.025);
     for(const s of[-1,1]){a(GEO.sph,F.red,.022,.016,.012,s*.055,.13,.18);a(GEO.sph,F.ember,.01,.008,.006,s*.055,.13,.19);a(GEO.sph,F.red,.014,.01,.01,s*.1,.15,.165);
       bone(a,F.bone,arcP(s*.13,.2,0,s*.22,.12,-.04,s*.02,.12,.1,6),.045,.012);bone(a,F.bone,arcP(s*.08,.03,.17,s*.05,.11,.06,0,.02,.02,4),.025,.008)}
     R(F.iron,.22,.07,.1,0,.02,.15,0,0,0,.02);for(let k=0;k<5;k++)a(GEO.cone,F.bone,.012,.04,.012,-.08+k*.04,-.02,.19,Math.PI,0,0)},true);
   {const q=glow(0xff3a2a,.18,.6);q.position.set(0,.13,.19);S.head.add(q)}
   S.arms.forEach(([sh,el],i)=>{const sd=i?1:-1;
     put(sh,n+'UA'+i,a=>{const R=rb(a);a(GEO.sphL,F.bhide,.11,.11,.11);a(GEO.sph,F.bhide,.11,.2,.11,0,-.18,0);a(CYS,F.bronze,.12,.22,.12,0,-.16,0);a(CYS,F.bronzeD,.115,.18,.115,0,-.18,0,0,Math.PI,0);for(let k=0;k<2;k++)a(GEO.tor,F.iron,.1,.1,.3,0,-.05-k*.22,0,1.571,0,0)},true);
     put(el,n+'FA'+i,a=>{const R=rb(a);a(GEO.sphL,F.bhide,.1,.1,.1);a(TAPG,F.bhide,.11,.36,.11,0,-.2,0);a(CYB,F.bronze,.12,.3,.125,0,-.18,.01);a(CYB,F.bronzeD,.115,.26,.12,0,-.19,0,0,Math.PI,0);R(F.bone,.21,.06,.22,0,-.06,.01,0,0,0,.02);
       for(let k=0;k<4;k++)bone(a,F.bone,arcP(sd*.1,-.08-k*.07,-.04,sd*.1,.03,-.04,sd*.02,0,0,2),.025,.008);a(GEO.box,F.red,.006,.2,.006,sd*.105,-.2,.08);
       R(F.bhide,.16,.12,.15,0,-.4,.03,0,0,0,.035);R(F.bone,.17,.04,.06,0,-.38,.11,0,0,0,.015);for(const x of[-.05,-.017,.017,.05])bone(a,F.bone,arcP(x,-.44,.08,0,-.08,.03,0,0,.02,2),.016,.006)},true)});
   S.legs.forEach(([hip,kn],i)=>{const sd=i?1:-1;
     put(hip,n+'Th'+i,a=>{const R=rb(a);a(GEO.sphL,F.bhide,.1,.1,.1);a(GEO.sph,F.bhide,.11,.2,.11,0,-.16,0);a(CYB,F.bronze,.12,.24,.125,0,-.14,.01,Math.PI,0,0);R(F.bronzeD,.08,.26,.2,sd*.1,-.15,0,0,0,sd*.1,.03);a(GEO.tor,F.iron,.1,.1,.3,0,-.28,0,1.571,0,0)},true);
     put(kn,n+'Sh'+i,a=>{const R=rb(a);a(GEO.sph,F.bone,.085,.075,.08,0,0,.05);bone(a,F.bone,arcP(0,.02,.1,0,.06,.1,0,0,.03,2),.035,.012);a(TAPG,F.bhide,.085,.28,.09,0,-.16,0,Math.PI,0,0);a(CYB,F.bronze,.1,.24,.105,0,-.18,.01,Math.PI,0,0);
       a(GEO.box,F.red,.008,.16,.012,0,-.18,.092);R(F.bronzeD,.14,.2,.1,0,-.16,-.06,0,0,0,.03);R(F.bhide,.22,.08,.3,0,-.36,.05,0,0,0,.035);for(const x of[-.07,0,.07])bone(a,F.bone,arcP(x,-.38,.19,0,-.02,.07,0,-.01,.02,2),.025,.008);bone(a,F.bone,arcP(0,-.36,-.1,0,-.02,-.08,0,0,0,2),.02,.006)},true)});
   if(S.gun)put(S.gun,n+'G',a=>{const R=rb(a);R(F.iron,.22,.24,.6,0,0,.08,0,0,0,.04);R(F.bronze,.24,.12,.46,0,.12,.1,0,0,0,.03);
     for(const x of[-.06,.06])a(GEO.cyl,F.iron,.05,.6,.05,x,.02,.62,1.571,0,0);a(GEO.cyl,F.bronzeD,.1,.12,.1,0,.02,.9,1.571,0,0);
     for(let k=0;k<4;k++){a(GEO.tor,F.bronze,.09,.09,.3,0,.02,.42+k*.12,0,0,0)}for(let k=0;k<3;k++){a(GEO.box,F.red,.008,.08,.06,.111,.0,.0+k*.1);a(GEO.box,F.ember,.004,.05,.04,.113,.0,.0+k*.1)}
     a(GEO.cyl,F.red,.035,.02,.035,-.06,.02,.93,1.571,0,0);a(GEO.cyl,F.red,.035,.02,.035,.06,.02,.93,1.571,0,0);a(GEO.cyl,F.iron,.12,.14,.12,0,-.12,.1,0,0,1.571);
     bone(a,F.bone,arcP(0,-.1,.5,0,-.1,.5,0,.04,.1,4),.04,.01);a(GEO.tor,F.iron,.08,.08,.3,.12,.08,-.12,0,1.571,0);R(F.bone,.06,.18,.08,0,-.14,-.02,-.2,0,0,.02)})}
  return R}
