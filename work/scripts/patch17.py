p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:80]); s=s.replace(a,b)
# profiles: who uses cover and jetpacks
rep("5:{hp:3,spd:3.6,","5:{cover:1,jet:1,hp:3,spd:3.6,")
rep("6:{hp:9,","6:{jet:1,hp:9,")
rep("7:{hp:2,","7:{jet:1,hp:2,")
rep("8:{hp:3,","8:{cover:1,jet:1,hp:3,")
# cover spots, built once from the collision boxes
rep("const hv=new T.Vector3();","""const hv=new T.Vector3(),cv=new T.Vector3();let COVER=null,COVERMAP=null;
function coverSpots(){if(COVER)return COVER;COVER=[];COVERMAP=new Map();
  for(const b of boxes){const w=b.hi[0]-b.lo[0],d=b.hi[2]-b.lo[2],h=b.hi[1]-b.lo[1];if(b.lo[1]>0.1||h<1.2||h>14||Math.max(w,d)>40||Math.min(w,d)<0.4)continue;
    const add=(x,z,nx,nz)=>{if(Math.abs(x)>A-4||Math.abs(z)>A-4||inBox(x,0.5,z))return;const c={x,z,bx:(b.lo[0]+b.hi[0])/2,bz:(b.lo[2]+b.hi[2])/2,claim:null};COVER.push(c);
      const k=(Math.floor(x/GC)+4096)*8192+Math.floor(z/GC)+4096;let a=COVERMAP.get(k);if(!a)COVERMAP.set(k,a=[]);a.push(c)};
    const nx=Math.max(1,Math.round(w/4)),nz=Math.max(1,Math.round(d/4));
    for(let i=0;i<nx;i++){const x=b.lo[0]+(i+.5)*w/nx;add(x,b.lo[2]-1.1,0,-1);add(x,b.hi[2]+1.1,0,1)}
    for(let i=0;i<nz;i++){const z=b.lo[2]+(i+.5)*d/nz;add(b.lo[0]-1.1,z,-1,0);add(b.hi[0]+1.1,z,1,0)}}
  return COVER}
function findCover(e){coverSpots();const p=e.pos,cands=[];const ix=Math.floor(p.x/GC),iz=Math.floor(p.z/GC);
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const l=COVERMAP.get((ix+a+4096)*8192+iz+b+4096);if(!l)continue;
    for(const c of l){if(c.claim&&c.claim!==e&&!c.claim.dying)continue;const dd=Math.hypot(c.x-p.x,c.z-p.z);if(dd>15)continue;const px=pos.x-c.x,pz=pos.z-c.z,pd=Math.hypot(px,pz);
      if(pd<8||pd>45||(c.bx-c.x)*px+(c.bz-c.z)*pz<=0)continue;cands.push([dd,c])}}
  cands.sort((a,b)=>a[0]-b[0]);for(let i=0;i<Math.min(6,cands.length);i++){const c=cands[i][1];cv.set(c.x,pos.y+0.6,c.z);if(!los(cv,eye))return c}return null}
function release(e){if(e.spot&&e.spot.claim===e)e.spot.claim=null;e.spot=null;e.st='adv';e.side=-e.side}""")
rep("e.cd-=dt;e.bt-=dt;e.vy-=19*dt;e.lunge=Math.max(0,e.lunge-dt);e.ft=Math.max(0,e.ft-dt);",
    "e.cd-=dt;e.bt-=dt;e.vy-=19*dt;e.lunge=Math.max(0,e.lunge-dt);e.ft=Math.max(0,e.ft-dt);e.jet=Math.max(0,(e.jet||0)-dt);e.jcd=(e.jcd||0)-dt;e.cdc=(e.cdc||0)-dt;if(e.jet>0)e.vy=Math.min(e.vy+34*dt,7.5);")
rep("if(P.atk==='melee'||!see||hd>P.far){mx=dx/hd;mz=dz/hd}","""let tgt=null;e.crouch=0;
  if(P.cover){if(e.st==='move'||e.st==='cover'||e.st==='peek'){const c=e.spot;e.ctot=(e.ctot||0)+dt;e.ct-=dt;
      if(!c||hd<6||e.ctot>12)release(e);
      else if(e.st==='move'){tgt=c;if(Math.hypot(c.x-p.x,c.z-p.z)<0.8){e.st='cover';e.ct=1.4+Math.random()*1.4}else if(e.ctot>6)release(e)}
      else if(e.st==='cover'){tgt=c;e.crouch=1;if(e.ct<=0){e.st='peek';e.ct=1.3+Math.random();e.peek={x:c.x-dz/hd*e.side*1.8,z:c.z+dx/hd*e.side*1.8}}}
      else{tgt=e.peek;if(e.ct<=0){e.st='cover';e.ct=1.4+Math.random()*1.4;e.side=-e.side}}}
    else if(see&&hd<45&&e.cdc<=0&&e.jet<=0){e.cdc=2.5;const c=findCover(e);if(c){c.claim=e;e.spot=c;e.st='move';e.ctot=0}}}
  if(tgt){const tx=tgt.x-p.x,tz=tgt.z-p.z,tl=Math.hypot(tx,tz);if(tl>0.15){mx=tx/tl;mz=tz/tl}else{mx=0;mz=0}if(e.st==='move')sp*=1.35}
  else if(e.jt>0){mx=dx/hd;mz=dz/hd;sp*=1.6}
  else if(P.atk==='melee'||!see||hd>P.far){mx=dx/hd;mz=dz/hd}""")
rep("}else if(hd<P.near){mx=-dx/hd;mz=-dz/hd}else{mx=-dz/hd*e.side*P.strafe;mz=dx/hd*e.side*P.strafe}","}else if(hd<P.near){mx=-dx/hd;mz=-dz/hd}else{mx=-dz/hd*e.side*P.strafe;mz=dx/hd*e.side*P.strafe}\n  e.jt=Math.max(0,(e.jt||0)-dt);")
rep("if(gr&&st>0){if(moved<st*0.4){e.stuck+=dt;if(e.stuck>0.5){e.stuck=0;e.hops=Math.min(e.hops+1,4);e.vy=7+e.hops*2.4;e.side=-e.side}}else{e.stuck=0;if(moved>st*0.9)e.hops=0}}",
"""if(gr&&st>0.01&&e.st!=='cover'){if(moved<st*0.4){e.stuck+=dt;if(e.stuck>0.5){e.stuck=0;e.hops=Math.min(e.hops+1,4);if(P.jet){e.vy=4;e.jet=.45+e.hops*.25;sfx('jet')}else e.vy=7+e.hops*2.4;e.side=-e.side;if(e.spot)release(e)}}else{e.stuck=0;if(moved>st*0.9)e.hops=0}}
  if(P.jet&&gr&&e.jcd<=0&&dy>3.5&&hd<26&&hd>2.5){e.jcd=7;e.jet=.8+Math.min(1.3,dy*.09);e.jt=e.jet+.4;e.vy=4;if(e.spot)release(e);sfx('jet')}""")
rep("const moved=Math.hypot(p.x-ox,p.z-oz);e.mv=gr?Math.min(1,sp/3):0;","const moved=Math.hypot(p.x-ox,p.z-oz);e.mv=gr&&(mx||mz)?Math.min(1,sp/3):0;")
# jetpack flames on the walker rigs, and a crouch pose
rep("  let aim=null,aimM=null;if(v===3){","""  const jets=new T.Group();jets.position.set(0,.18,-.42);tor.add(jets);jets.visible=false;const jm=bas({color:0xffa060,transparent:true,opacity:.9,blending:T.AdditiveBlending,depthWrite:false});
  put(tor,n+'J',a=>{for(const s of[-1,1]){a(GEO.cyl,A2,.07,.22,.07,s*.15,.08,-.44);a(GEO.cyl,AM,.075,.04,.075,s*.15,-.03,-.44)}});
  for(const s of[-1,1]){const f=mesh(GEO.cone,jm,.08,.5,.08,s*.15,-.4,0);f.rotation.x=Math.PI;jets.add(f)}{const q=glow(0xff8a3a,1.6,.8);q.position.y=-.45;jets.add(q)}
  let aim=null,aimM=null;if(v===3){""")
rep("    for(let i=0;i<2;i++){const[hip,kn]=legs[i],q=w+(i?Math.PI:0);hip.rotation.x=air?-.6:-Math.sin(q)*.55*m;kn.rotation.x=air?1:Math.max(0,Math.sin(q+1.2))*.9*m}",
    "    const cr=e.crouch&&!m;for(let i=0;i<2;i++){const[hip,kn]=legs[i],q=w+(i?Math.PI:0);hip.rotation.x=cr?-1.1:air?-.6:-Math.sin(q)*.55*m;kn.rotation.x=cr?1.9:air?1:Math.max(0,Math.sin(q+1.2))*.9*m}\n    jets.visible=(e.jet||0)>0;if(jets.visible)jets.scale.y=.8+Math.random()*.5;")
rep("tor.position.y=-.02+Math.abs(Math.sin(w))*.03*m;","tor.position.y=-.02+Math.abs(Math.sin(w))*.03*m-(cr?.3:0);")
# sounds, and claims cleared on a fresh run
rep("  else if(k==='mortar')tone('triangle',120,60,.25,.1);","  else if(k==='mortar')tone('triangle',120,60,.25,.1);\n  else if(k==='jet')tone('sawtooth',90,160,.4,.04);")
rep("for(const k in seenT)delete seenT[k];","for(const k in seenT)delete seenT[k];if(COVER)for(const c of COVER)c.claim=null;")
open(p,'w').write(s);print('ok')
