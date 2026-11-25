p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:80]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]

# ---------- walker rigs: trooper (0), brute (1), stalker (2), marksman (3); and the crawler
between("// trooper: an armored walker","function model(type){","""// walkers: trooper (0), brute (1), stalker (2), marksman (3), each with hips, knees, shoulders, elbows and a turning head
MAT.bruteA=std({color:0x6e3a30,roughness:.5,metalness:.55});MAT.stalkA=std({color:0x2b3539,roughness:.45,metalness:.6});MAT.snipA=std({color:0x56603e,roughness:.6,metalness:.4});
MAT.cloak=std({color:0x2c3324,roughness:.95,side:T.DoubleSide});
function walkerRig(g,v){const root=new T.Group();root.scale.setScalar([1,1.45,.78,1][v]);g.add(root);
  const A1=[MAT.armor,MAT.bruteA,MAT.stalkA,MAT.snipA][v],A2=MAT.armorD,AM=MAT.amber,EY=v>=2?MAT.eye:MAT.eyeA,n='w'+v;
  put(J(root,0,-.1,0),n+'P',a=>{a(GEO.box,A2,.42,.2,.28);a(GEO.box,AM,.44,.04,.3,0,.06,0);for(const s of[-1,1])a(GEO.box,A1,.08,.22,.24,s*.24,-.06,0)});
  const tor=J(root,0,-.02,0);put(tor,n+'T',a=>{a(GEO.box,A1,.6,.46,.38,0,.36,0);a(GEO.box,A2,.44,.26,.32,0,.06,0);a(GEO.box,A1,.5,.2,.06,0,.36,.21);
    a(GEO.box,AM,.36,.03,.02,0,.42,.245);a(GEO.box,A2,.22,.12,.08,0,.62,.08);a(GEO.box,A2,.44,.5,.24,0,.3,-.3);
    a(GEO.cyl,A2,.015,v===3?.8:.5,.015,.15,v===3?.9:.75,-.34);a(GEO.sph,AM,.03,.03,.03,.15,v===3?1.3:1.0,-.34);for(let i=0;i<3;i++)a(GEO.box,A1,.4,.025,.02,0,.16+i*.1,-.425);
    for(const s of[-1,1]){a(GEO.sph,A1,v===1?.26:.17,v===1?.2:.13,v===1?.28:.19,s*(v===1?.42:.36),.57,0);a(GEO.box,A2,.06,.18,.18,s*.24,.3,-.43)}
    if(v===1)for(const s of[-1,1]){a(GEO.cyl,A2,.06,.4,.06,s*.14,.75,-.4);a(GEO.cyl,AM,.065,.05,.065,s*.14,.95,-.4)}
    if(v===2)for(let i=0;i<4;i++)a(GEO.cone,A2,.05,.18,.05,0,.6-i*.15,-.44,-.6,0,0);
    if(v===3)a(GEO.box,MAT.cloak,.58,.75,.04,0,.2,-.45,.12,0,0)},true);
  const head=J(tor,0,.62,.02);put(head,n+'H',a=>{a(GEO.box,A2,.36,.34,.38,0,.17,0);
    if(v===2){for(const x of[-.09,0,.09])a(GEO.sph,EY,.045,.045,.03,x,.18,.2);a(GEO.box,A1,.3,.08,.4,0,.32,-.02)}
    else if(v===3){a(GEO.sph,EY,.07,.07,.04,0,.18,.2);a(GEO.cyl,A2,.09,.06,.09,0,.18,.19,1.571,0,0);a(GEO.cone,MAT.cloak,.3,.5,.3,0,.32,-.06)}
    else{a(GEO.box,A1,.4,.1,.42,0,.31,0);a(GEO.box,A1,.06,.12,.3,0,.4,-.02);a(GEO.box,EY,.3,.08,.04,0,.18,.2)}
    if(v===1)a(GEO.box,A1,.42,.22,.1,0,.1,.22);else a(GEO.box,A1,.26,.12,.08,0,.05,.18);for(const s of[-1,1])a(GEO.cyl,A1,.05,.1,.05,s*.2,.15,0,0,0,1.571)});
  {const q=glow(v>=2?0xff3b3b:0xffb238,.8,.7);q.position.set(0,.18,.24);head.add(q)}
  const arms=[];for(const s of[-1,1]){const sh=J(tor,s*.4,.5,0);put(sh,n+'UA',a=>{a(GEO.box,A1,.17,.34,.19,0,-.15,0);a(GEO.box,A2,.19,.06,.21,0,-.3,0)});
    const el=J(sh,0,-.32,0);put(el,n+'FA'+(s>0?'r':'l'),a=>{a(GEO.box,A2,.15,.3,.17,0,-.14,0);a(GEO.box,A2,.13,.12,.15,0,-.33,.02);
      if(v===1&&s<0)a(GEO.box,A1,.08,.66,.52,-.12,-.2,.06);if(v===2)a(GEO.cone,AM,.035,.55,.035,0,-.62,.05,Math.PI,0,0)});arms.push([sh,el])}
  let gun=null;if(v!==2){gun=J(tor,.14,.22,.22);put(gun,n+'G',a=>{
    if(v===1){a(GEO.box,A2,.18,.2,.56,0,0,.05);for(const x of[-.045,.045])a(GEO.cyl,A2,.04,.42,.04,x,.03,.48,1.571,0,0);a(GEO.cyl,A1,.12,.12,.12,0,-.14,.04,0,0,1.571);a(GEO.box,AM,.19,.03,.1,0,.11,.2)}
    else if(v===3){a(GEO.box,A2,.09,.13,.9,0,0,.05);a(GEO.cyl,A2,.022,.9,.022,0,.01,.9,1.571,0,0);a(GEO.cyl,A2,.045,.36,.045,0,.13,.02,1.571,0,0);a(GEO.sph,EY,.03,.03,.02,0,.13,.21);a(GEO.box,A1,.1,.06,.3,0,-.05,-.3)}
    else{a(GEO.box,A2,.1,.14,.72,0,0,0);a(GEO.box,A1,.11,.06,.5,0,.09,.04);a(GEO.cyl,A2,.025,.36,.025,0,.01,.52,1.571,0,0);a(GEO.box,AM,.04,.04,.04,0,.01,.7);a(GEO.box,A2,.07,.16,.1,0,-.14,.06,-.2,0,0);a(GEO.cyl,A2,.035,.16,.035,0,.13,-.04,1.571,0,0);a(GEO.box,EY,.02,.03,.02,0,.13,-.13)}})}
  const legs=[];for(const s of[-1,1]){const hip=J(root,s*.15,-.16,0);put(hip,n+'Th',a=>a(GEO.box,A1,.21,.36,.25,0,-.17,0),true);
    const kn=J(hip,0,-.34,0);put(kn,n+'Sh',a=>{a(GEO.box,A2,.17,.34,.2,0,-.16,0);a(GEO.box,A1,.19,.12,.08,0,-.02,.12);a(GEO.box,A2,.2,.09,.32,0,-.36,.05)});legs.push([hip,kn])}
  let aim=null,aimM=null;if(v===3){aim=new T.Group();aim.position.set(0,.86,.3);g.add(aim);aimM=bas({color:0xff3030,transparent:true,opacity:.5,depthWrite:false,blending:T.AdditiveBlending,fog:false});aim.add(mesh(GEO.box,aimM,.025,.025,1,0,0,.5));aim.visible=false}
  const av=new T.Vector3();
  return{aim,anim(e,t,dt){const m=e.mv||0,w=t*(v===2?13:v===1?6:9)+e.ph,air=!m&&Math.abs(e.vy||0)>0.5;
    for(let i=0;i<2;i++){const[hip,kn]=legs[i],q=w+(i?Math.PI:0);hip.rotation.x=air?-.6:-Math.sin(q)*.55*m;kn.rotation.x=air?1:Math.max(0,Math.sin(q+1.2))*.9*m}
    tor.position.y=-.02+Math.abs(Math.sin(w))*.03*m;tor.rotation.y=Math.sin(w)*.08*m+Math.sin(t*.7+e.ph)*.06;tor.rotation.x=v===2?.35:0;
    e.kick=Math.max(0,(e.kick||0)-dt*(v===2?4:6));const k=e.kick;head.rotation.y=Math.sin(t*1.3+e.ph)*.35;head.rotation.x=Math.sin(t*.9+e.ph)*.08-(v===2?.3:0);
    if(v===2){arms[1][0].rotation.set(-1.0-k*1.4,0,-.25);arms[1][1].rotation.x=-.4+k*.3;arms[0][0].rotation.set(-1.0-Math.max(0,k-.5)*1.6,0,.25);arms[0][1].rotation.x=-.4}
    else{arms[1][0].rotation.set(-.55-k*.3,0,-.45);arms[1][1].rotation.x=-.9+k*.2;arms[0][0].rotation.set(-1.15-k*.2,0,.7);arms[0][1].rotation.x=-.55;gun.position.z=.22-k*.08;gun.rotation.x=-k*.15}
    if(aim){const on=(e.ch||0)>0||(e.ft||0)>0;aim.visible=on;if(on){aim.lookAt(eye);aim.getWorldPosition(av);aim.scale.z=av.distanceTo(eye);aimM.opacity=e.ft>0?1:.25+.25*Math.sin(t*25)}}}}}
// crawler: a four-legged mortar platform
function crawlerRig(g){const A1=MAT.armor,A2=MAT.armorD,AM=MAT.amber;
  const body=J(g,0,0,0);put(body,'crB',a=>{a(GEO.hex,A1,.75,.35,.9);a(GEO.box,A2,.9,.1,1.1,0,-.2,0);for(const x of[-.12,0,.12])a(GEO.sph,MAT.eye,.06,.06,.05,x,.02,.86);
    a(GEO.box,AM,.8,.04,.06,0,.12,.55);for(let i=0;i<3;i++)a(GEO.box,A2,.5,.04,.06,0,.19,-.2-i*.15)},true);
  {const q=glow(0xff3b3b,1.2,.7);q.position.set(0,.02,.9);body.add(q)}
  const tur=J(body,0,.22,-.1);put(tur,'crTu',a=>{a(GEO.cyl,A2,.35,.18,.35);a(GEO.box,A1,.32,.2,.3,0,.18,0)});
  const tube=J(tur,0,.2,0);tube.rotation.x=-.9;put(tube,'crTb',a=>{a(GEO.cyl,A2,.13,.9,.13,0,0,.4,1.571,0,0);a(GEO.cyl,AM,.15,.08,.15,0,0,.84,1.571,0,0)});
  const legs=[];for(const sx of[-1,1])for(const sz of[-1,1]){const hip=J(body,sx*.55,-.05,sz*.55);hip.scale.x=sx;hip.userData.d=sx*sz;
    put(hip,'crU',a=>a(GEO.box,A2,.57,.1,.12,.225,.175,0,0,0,Math.atan2(.35,.45)));const kn=J(hip,.45,.35,0);
    put(kn,'crL',a=>{a(GEO.box,A1,1.31,.12,.14,.075,-.65,0,0,0,Math.atan2(-1.3,.15));a(GEO.cyl,A2,.12,.06,.12,.15,-1.3,0)});legs.push([hip,kn])}
  return{anim(e,t,dt){const m=e.mv||0,w=t*7+e.ph;for(const[hip,kn]of legs){const q=w+(hip.userData.d>0?0:Math.PI);hip.rotation.y=Math.sin(q)*.35*m;kn.rotation.z=Math.max(0,Math.sin(q+1))*.3*m}
    body.position.y=Math.abs(Math.sin(w))*.04*m;e.kick=Math.max(0,(e.kick||0)-dt*3);tube.position.z=-e.kick*.25;tur.rotation.y=Math.sin(t*.6+e.ph)*.25}}}
""")
rep("  else if(type===5)rig=trooperRig(g);","  else if(type>=5&&type<=8)rig=walkerRig(g,type-5);else if(type===9)rig=crawlerRig(g);")
rep("  const gl=type===0?glow(0xff3b3b,1.1,0.9):type===1?glow(0xff5a3a,1.2,0.8):type===5?glow(0xffb238,0.9,0.7):glow(0xffb238,2.4,0.8);","  if(type>=5)return{g,wings,parts,rig};\n  const gl=type===0?glow(0xff3b3b,1.1,0.9):type===1?glow(0xff5a3a,1.2,0.8):glow(0xffb238,2.4,0.8);")
rep("const ER=[0.5,0.55,1.0,3,0.7,0.9];","""const ER=[0.5,0.55,1.0,3,0.7,0.9,1.3,0.7,0.9,1.0];
const GP={5:{hp:3,spd:3.6,near:8,far:18,strafe:.6,atk:'rifle',score:100,col:'#ff8a5a',spark:0xffb238},
  6:{hp:9,spd:2.4,near:3,far:14,strafe:.3,atk:'shotgun',score:250,col:'#ff5a3a',spark:0xff6a3a,intro:"Big one. That's a heavy loader frame with a scattergun bolted on. Keep your distance and aim high."},
  7:{hp:2,spd:6.2,near:0,far:70,strafe:0,atk:'melee',score:120,col:'#ffd23a',spark:0xffd23a,intro:"Stalkers. Pruning frames with the safeties off. They're fast and they jump. Don't let them close."},
  8:{hp:3,spd:3,near:22,far:42,strafe:.4,atk:'snipe',dmg:22,score:180,col:'#ff3a6a',spark:0xff3a3a,intro:"Red line on you means a marksman is charging. Break line of sight before it fires."},
  9:{hp:6,spd:2.4,near:14,far:28,strafe:.5,atk:'mortar',score:220,col:'#c9ff3a',spark:0xffb238,intro:"Crawler. It lobs shells. When a red ring shows up under you, move."}};
const seenT={};""")
rep("  else if(type===5)Object.assign(e,{hp:3*k,spd:3.6+Math.min(w*0.1,1.2),cd:1+Math.random()*1.5,ph:Math.random()*6,vy:0,burst:0,bt:0,stuck:0,hops:0,mv:0,side:Math.random()<.5?-1:1,legs:m.legs});",
"""  else if(type>=5){const P=GP[type];Object.assign(e,{hp:P.hp*k,spd:P.spd+Math.min(w*0.1,1.2),cd:1+Math.random()*1.5,ph:Math.random()*6,vy:0,burst:0,bt:0,stuck:0,hops:0,mv:0,kick:0,ch:0,ft:0,lunge:0,atkN:0,side:Math.random()<.5?-1:1,aim:m.rig&&m.rig.aim});
    if(state==='playing'&&P.intro&&!seenT[type]){seenT[type]=1;comm('R',P.intro)}}""")
rep("queue.push({t,type,x,y:type===5?24+Math.random()*6:7+Math.random()*3,z})","queue.push({t,type,x,y:type>=5?24+Math.random()*6:7+Math.random()*3,z})")
rep("if(!e.dying&&(e.type<3||e.type===5))n++;","if(!e.dying&&(e.type<3||e.type>=5))n++;")
rep("{if(e.type<3||e.type===5)e.pos.addScaledVector(tmp2,1.5/d);damage(e,k)}","{if(e.type<3||e.type>=5)e.pos.addScaledVector(tmp2,(e.type===6?.5:1.5)/d);damage(e,k)}")
rep("    if(e.type===5){trooperTick(e,dt);if(state!=='playing')return;continue}","    if(e.type>=5){groundTick(e,dt);if(state!=='playing')return;continue}")
rep("    if(e.type===5){e.g.rotation.y=Math.atan2(eye.x-e.pos.x,eye.z-e.pos.z);continue}","    if(e.type>=5){e.g.rotation.y=Math.atan2(eye.x-e.pos.x,eye.z-e.pos.z);continue}")
rep("rc.fillStyle=e.type===5?'#ff8a5a':","rc.fillStyle=e.type>=5?GP[e.type].col:")
rep("sparkle(e.pos,[0xffb238,0xff4fa3,0xc9a6ff,0xffb238,0x8fe6ff,0xffb238][e.type],e.type>=2?30:14,","sparkle(e.pos,e.type>=5?GP[e.type].spark:[0xffb238,0xff4fa3,0xc9a6ff,0xffb238,0x8fe6ff][e.type],e.type>=2?(e.type===6||e.type===9?24:30):14,")
rep("  score+=e.type===2?500:e.type?150:100;superQ=Math.min(100,superQ+(e.type===2?30:7));","  score+=e.type>=5?GP[e.type].score:e.type===2?500:e.type?150:100;superQ=Math.min(100,superQ+(e.type===2?30:e.type===6||e.type===9?14:7));")
rep("  if(e.type===2||Math.random()<0.16)loot(e)}","  if(e.type===2||Math.random()<(e.type===6||e.type===9?0.35:0.16))loot(e)}")
rep("const pickType=()=>{const r=Math.random();return r<0.4?5:wave>=2&&r<0.62?1:0};",
"""const pickType=()=>{if(Math.random()<0.22)return wave>=2&&Math.random()<.45?1:0;
  const pool=[[5,4],[7,2.5],[6,wave>=2?2:0],[8,wave>=2?1.5:0],[9,wave>=3?1.5:0]];let tot=0;for(const[,w]of pool)tot+=w;let r=Math.random()*tot;for(const[t,w]of pool){r-=w;if(r<0)return t}return 5};""")
# ---------- ground AI
between("function trooperTick(e,dt){","const pickType=","""const hv=new T.Vector3();
function bolt(p,dx,dy,dz,d,spread,speed,dmg,col){const g=new T.Group();g.add(mesh(GEO.box,col===1?MAT.eye:MAT.eyeA,0.07,0.07,0.7),glow(col===1?0xff4a3a:0xffb238,0.8,0.8));g.position.set(p.x,p.y+0.3,p.z);
  const v=new T.Vector3(dx/d+(Math.random()-.5)*spread,(dy-0.3)/d+(Math.random()-.5)*spread,dz/d+(Math.random()-.5)*spread).normalize();g.lookAt(p.x+v.x,p.y+0.3+v.y,p.z+v.z);scene.add(g);
  shots.push({g,v:v.multiplyScalar(speed),t:3,dmg})}
function groundTick(e,dt){const P=GP[e.type],p=e.pos,dx=eye.x-p.x,dy=eye.y-p.y,dz=eye.z-p.z,hd=Math.hypot(dx,dz)||1,d=Math.hypot(dx,dy,dz)||1;
  if(hd>170){const[x,z]=spawnPos();p.set(x,26,z);e.vy=0;e.ch=0;return}
  e.cd-=dt;e.bt-=dt;e.vy-=19*dt;e.lunge=Math.max(0,e.lunge-dt);e.ft=Math.max(0,e.ft-dt);
  const see=d<80&&los(p,eye);let mx,mz,sp=e.spd;
  if(P.atk==='melee'||!see||hd>P.far){mx=dx/hd;mz=dz/hd}else if(hd<P.near){mx=-dx/hd;mz=-dz/hd}else{mx=-dz/hd*e.side*P.strafe;mz=dx/hd*e.side*P.strafe}
  if(e.ch>0)sp*=0.2;if(e.lunge>0)sp*=2.6;if(P.atk==='melee'&&hd<1.2)sp=0;
  const ox=p.x,oz=p.z,st=sp*dt;p.x+=mx*st;p.z+=mz*st;p.y+=e.vy*dt;
  for(const o of enemies){if(o===e||o.type<5||o.dying)continue;const qx=p.x-o.pos.x,qz=p.z-o.pos.z,qd=Math.hypot(qx,qz),m=e.r+o.r;if(qd<m&&qd>1e-3){const k=(m-qd)*0.5/qd;p.x+=qx*k;p.z+=qz*k}}
  const py=p.y;pushOut(p,e.r);const gr=p.y>py+1e-5;if(gr&&e.vy<0)e.vy=0;
  const moved=Math.hypot(p.x-ox,p.z-oz);e.mv=gr?Math.min(1,sp/3):0;
  if(gr&&st>0){if(moved<st*0.4){e.stuck+=dt;if(e.stuck>0.5){e.stuck=0;e.hops=Math.min(e.hops+1,4);e.vy=7+e.hops*2.4;e.side=-e.side}}else{e.stuck=0;if(moved>st*0.9)e.hops=0}}
  if(P.atk==='rifle'){if(see&&d<60){if(e.cd<=0){e.burst=3;e.cd=2+Math.random()*1.2}
    if(e.burst>0&&e.bt<=0){e.bt=0.15;e.burst--;bolt(p,dx,dy,dz,d,.06,30,5);sfx('bolt');e.kick=1;e.atkN++}}}
  else if(P.atk==='shotgun'){if(d<e.r+1.4&&e.bt<=0){e.bt=1.6;e.kick=1.5;hurt(18);if(!reduced)shake=Math.max(shake,.25);sfx('boom');e.atkN++}
    else if(see&&d<16&&e.cd<=0){e.cd=2.6;for(let i=0;i<6;i++)bolt(p,dx,dy,dz,d,.16,26,3.5,1);sfx('shotgun');e.kick=1;e.atkN++}}
  else if(P.atk==='melee'){if(d<e.r+1.0&&e.cd<=0){e.cd=.8;e.kick=1;hurt(9);sfx('melee');e.atkN++}
    else if(gr&&see&&hd>3.5&&hd<9&&e.bt<=0){e.bt=2.5;e.vy=6;e.lunge=.45;sfx('jump')}}
  else if(P.atk==='snipe'){if(e.ch>0){if(!see){e.ch=0;e.cd=1.5}else{e.ch-=dt;if(e.ch<=0){e.cd=4+Math.random()*1.5;e.ft=.14;e.kick=1;sfx('snipe');e.atkN++;
        hv.set(p.x,p.y+.86,p.z);if(los(hv,eye))hurt(P.dmg)}}}
    else if(see&&d<75&&e.cd<=0){e.ch=1.6;sfx('charge')}}
  else if(P.atk==='mortar'){if(see&&hd<34&&e.cd<=0){e.cd=4.2+Math.random()*1.5;e.kick=1;e.atkN++;const T0=1.6,g=14;
    const sg=mesh(GEO.sph,MAT.spore,.22,.22,.22,p.x,p.y+.6,p.z);sg.add(glow(0xff7a3a,4));scene.add(sg);
    shots.push({g:sg,v:new T.Vector3((pos.x-p.x)/T0,(pos.y-(p.y+.6)+0.5*g*T0*T0)/T0,(pos.z-p.z)/T0),t:T0,grav:g,vis:1});
    const rg=mesh(GEO.ring,slamMat,1,1,1,pos.x,pos.y+0.12,pos.z);rg.rotation.x=-Math.PI/2;scene.add(rg);slams.push({g:rg,t:T0,T:T0,r:4,dmg:16,x:pos.x,y:pos.y,z:pos.z});sfx('mortar')}}}
""")
# shots: gravity and visual-only shells
rep("for(let i=shots.length-1;i>=0;i--){const s2=shots[i],p=s2.g.position;p.addScaledVector(s2.v,dt);s2.t-=dt;",
    "for(let i=shots.length-1;i>=0;i--){const s2=shots[i],p=s2.g.position;if(s2.grav)s2.v.y-=s2.grav*dt;p.addScaledVector(s2.v,dt);s2.t-=dt;")
rep("const hitP=Math.hypot(p.x-pos.x,p.z-pos.z)<(veh?1.8:0.5)","const hitP=!s2.vis&&Math.hypot(p.x-pos.x,p.z-pos.z)<(veh?1.8:0.5)")
# slams take their own radius, damage and timing
s=s.replace("q.g.scale.setScalar(1+(1-q.t/1.3)*4.5);","q.g.scale.setScalar(1+(1-q.t/(q.T||1.3))*((q.r||5.5)-1));")
assert "q.g.scale.setScalar(1+(1-q.t/(q.T||1.3))" in s
rep("<5.5&&Math.abs(pos.y-q.y)<3){hurt(35);","<(q.r||5.5)&&Math.abs(pos.y-q.y)<3){hurt(q.dmg||35);")
# sounds
rep("  else if(k==='bolt')tone('square',720,300,.05,.03);","""  else if(k==='bolt')tone('square',720,300,.05,.03);
  else if(k==='shotgun'){tone('sawtooth',300,60,.18,.08);tone('square',150,40,.12,.05)}
  else if(k==='charge')tone('sine',300,1400,1.5,.03);
  else if(k==='snipe'){tone('sawtooth',1800,200,.2,.08);tone('square',400,80,.15,.05)}
  else if(k==='mortar')tone('triangle',120,60,.25,.1);""")
# seen intros reset each run
rep("COMMS.length=0;commCur=null;","for(const k in seenT)delete seenT[k];COMMS.length=0;commCur=null;")
open(p,'w').write(s);print('ok',len(s))
