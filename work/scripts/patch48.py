p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
# ---- rig variant 8: Rowan
rep("root.scale.setScalar([1,1.45,.78,1,1.1,.85,1,1.05][v])","root.scale.setScalar([1,1.45,.78,1,1.1,.85,1,1.05,.98][v])")
rep("MAT.rocketA,MAT.playerA][v]","MAT.rocketA,MAT.playerA,MAT.rowanA][v]")
rep("EY=v===7?MAT.strip:v>=2?MAT.eye:MAT.eyeA","EY=v>=7?MAT.strip:v>=2?MAT.eye:MAT.eyeA")
rep("glow(v>=2?0xff3b3b:0xffb238,.8,.7)","glow(v>=7?0x6fe3ff:v>=2?0xff3b3b:0xffb238,.8,.7)")
rep("    else{a(GEO.box,A2,.1,.14,.72,0,0,0);","    else if(v===8){a(GEO.box,A2,.1,.14,.5,0,0,.02);a(GEO.box,A1,.12,.1,.36,0,.07,0);a(GEO.cyl,MAT.strip,.05,.3,.05,0,.01,.44,1.571,0,0);a(GEO.sph,MAT.strip,.06,.06,.06,0,.01,.62);a(GEO.box,AM,.05,.05,.05,0,.1,.2);a(GEO.box,A2,.07,.16,.1,0,-.14,.06,-.2,0,0)}\n    else{a(GEO.box,A2,.1,.14,.72,0,0,0);")
rep("MAT.playerA=std({color:0xc8ccce,roughness:.4,metalness:.5});","MAT.playerA=std({color:0xc8ccce,roughness:.4,metalness:.5});MAT.rowanA=std({color:0x4f8a58,roughness:.55,metalness:.2});")
# ---- the ally
rep("const pb=new T.Group();scene.add(pb);pb.visible=false;","""/* ---------- Rowan, the deck botanist: a computer-controlled ally. Not in `enemies` (so he is not counted, targeted or hit). Enemies ignore him ---------- */
var ROW=null;const rwG=new T.Group();scene.add(rwG);rwG.visible=false;
ROW={on:false,arrive:0,hide:false,pos:rwG.position,r:.95,vy:0,mv:0,kick:0,ph:Math.random()*6,crouch:0,jet:0,burst:0,ch:0,ft:0,cd:1,stuckT:0,farT:0,tgtT:0,tx:0,tz:0,barkT:-99,kills:0,beams:[]};
const rwR=walkerRig(rwG,8),rwMuz=new T.Vector3(),rwDir=new T.Vector3(),rwEnd=new T.Vector3();
{const bm=bas({color:0x7dffb0,transparent:true,opacity:.9,blending:T.AdditiveBlending,depthWrite:false,fog:false});for(let i=0;i<3;i++){const b=mesh(GEO.box,bm,.045,.045,1);b.visible=false;scene.add(b);ROW.beams.push({b,t:0})}}
const BARKS=['Got him.','Pruned.','Clear on my side.','Nothing grows back from that.','That one is mulch.','Still with you, soldier.','Keep moving. I have your flank.','Another one for the compost.'];
function rowanSpot(cx,cz,cy,rad){for(let k=0;k<16;k++){const a=k*.39+Math.random()*.3,r=rad+(k%2)*1.5,x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r,g=groundAt(x,z,cy+.5);if(Math.abs(g-cy)>1.2)continue;let ok=true;for(let y=g+.3;y<=g+2.2;y+=.3)if(inBox(x,y,z)){ok=false;break}if(ok&&NAV&&!NAV[navCell(x,z)])ok=false;if(ok)return[x,g,z]}return null}
function rowanPlace(){const q=rowanSpot(pos.x,pos.z,pos.y,3)||[pos.x,pos.y,pos.z];ROW.pos.set(q[0],q[1]+ROW.r,q[2]);ROW.vy=0;ROW.farT=ROW.stuckT=0;sparkle(ROW.pos,0x8fe6ff,12,5)}
function rowanJoin(quiet){ROW.on=true;ROW.hide=false;ROW.kills=0;const inC=Math.abs(pos.x)<107&&Math.abs(pos.z)<39&&pos.y<3;
  if(quiet||!inC)rowanPlace();else{ROW.pos.set(-60,ROW.r,-44.5);ROW.vy=0}rwG.visible=true;
  if(!quiet){comm('R',"Vault door's open. Don't shoot, it's me, Rowan. I grabbed the grow-lab pruner off the bench. It's a laser meant for trimming vines.");comm('R',"It cuts a drone just as clean. I'm coming with you.")}}
function allyTick(dt){
  if(ROW.arrive>0){ROW.arrive-=dt;if(ROW.arrive<=0)rowanJoin(false)}
  if(!ROW.on)return;if(veh){rwG.visible=false;ROW.hide=true;return}if(ROW.hide){ROW.hide=false;rowanPlace()}
  rwG.visible=true;const p=ROW.pos,dx=pos.x-p.x,dz=pos.z-p.z,hd=Math.hypot(dx,dz)||.01;
  if(Math.abs(p.y-ROW.r-pos.y)>3||hd>45)ROW.farT+=dt;else ROW.farT=0;if(ROW.farT>2.5)rowanPlace();
  let mx=0,mz=0,sp=0;if(hd>5.5){const f=flowDir(p.x,p.z);if(f){mx=f[0];mz=f[1]}else{mx=dx/hd;mz=dz/hd}sp=hd>16?7:4.6}else if(hd<2){mx=-dx/hd;mz=-dz/hd;sp=2}
  const ox=p.x,oz=p.z,st=sp*dt;p.x+=mx*st;p.z+=mz*st;ROW.vy-=19*dt;p.y+=ROW.vy*dt;const py=p.y;pushOut(p,ROW.r);const gr=p.y>py+1e-5;if(gr&&ROW.vy<0)ROW.vy=0;
  const moved=Math.hypot(p.x-ox,p.z-oz);ROW.mv=gr&&sp>0?Math.min(1,sp/3):0;if(sp>0&&moved<st*.3)ROW.stuckT+=dt;else ROW.stuckT=0;if(ROW.stuckT>2.5){rowanPlace();ROW.stuckT=0}
  // shooting: nearest enemy in sight, skipping bosses (the player's job), shielded shieldbearers and detonators that would blast the player
  ROW.cd-=dt;ROW.tgtT-=dt;if(ROW.cd<=0){let best=null,bd=1e9;const o={x:p.x,y:p.y+.5,z:p.z};
    for(const e of enemies){if(e.dying||e.type===3||e.type===4)continue;if(e.type===10&&!((e.burst||0)>0))continue;const d=Math.hypot(e.pos.x-p.x,e.pos.y-p.y,e.pos.z-p.z);if(d>30||d>=bd)continue;
      if(e.type===11&&Math.hypot(e.pos.x-pos.x,e.pos.z-pos.z)<9)continue;if(!los(o,e.pos))continue;best=e;bd=d}
    if(!best)ROW.cd=.2;else{ROW.cd=.5;ROW.tgtT=.6;ROW.tx=best.pos.x;ROW.tz=best.pos.z;ROW.kick=1;rwR.segs.gun.getWorldPosition(rwMuz);rwEnd.copy(best.pos);rwDir.subVectors(rwEnd,rwMuz).normalize();rwMuz.addScaledVector(rwDir,.7);
      const bm=ROW.beams.find(q=>q.t<=0)||ROW.beams[0];bm.t=.09;bm.b.visible=true;bm.b.position.addVectors(rwMuz,rwEnd).multiplyScalar(.5);bm.b.scale.z=rwMuz.distanceTo(rwEnd);bm.b.lookAt(rwEnd);
      tone('sawtooth',1500,400,.05,.02);sparkle(rwEnd,0x7dffb0,3,4);damage(best,.8*(1+.07*(Math.max(wave,1)-1)),-1,false,false);
      if(best.dying){ROW.kills++;if(Math.random()<.4&&time-ROW.barkT>22&&!commCur&&!COMMS.length&&!VOICE.busy){ROW.barkT=time;comm('R',BARKS[Math.random()*BARKS.length|0])}}}}
  for(const q of ROW.beams){q.t-=dt;if(q.t<=0)q.b.visible=false}
  const want=ROW.tgtT>0?Math.atan2(ROW.tx-p.x,ROW.tz-p.z):sp>0?Math.atan2(mx,mz):Math.atan2(dx,dz),da=((want-rwG.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI;rwG.rotation.y+=da*Math.min(1,dt*8);
  try{rwR.anim(ROW,time,dt)}catch(e){}}
const pb=new T.Group();scene.add(pb);pb.visible=false;""")
rep("function update(dt){\n","function update(dt){allyTick(dt);\n")
# reset / continue
rep("mission=null;bossN=0;gap=1.2;endT=0;","mission=null;bossN=0;gap=1.2;endT=0;if(ROW){ROW.on=false;ROW.arrive=0;ROW.hide=false;rwG.visible=false;for(const q of ROW.beams){q.t=0;q.b.visible=false}}")
rep("mission=null;gap=1.5;say('Resuming at stage '+(wave+1),2)}","mission=null;gap=1.5;if(wave>=1)rowanJoin(true);say('Resuming at stage '+(wave+1),2)}")
# join trigger inside stage 1
rep("  // first stage only: one control prompt at a time","  if(wave===1&&C&&!ROW.on&&ROW.arrive<=0&&m.n0-n>=3)ROW.arrive=1.5;\n  // first stage only: one control prompt at a time")
# ---- lore
rep("""  end:[['R',"Commons is clear. They're building those frames aft, in engineering. Follow the marker."]]},""","""  end:[['R',"Commons is clear. They're printing those frames in the foundry, aft, in engineering. Follow the marker."],['R',"Stay close. I'll watch your back."]]},""")
rep("""  end:[['R',"The foundry's dark. For a second the signal went quiet on every channel."],['R',"Now the hangar. If they hold the launch bay, nothing leaves this station."]]},""","""  log:"LOG 2010 · R. ADEYEMI: Seed vault inventory, sealed. 4,112 strains of wheat, rice and barley, and the last of the Europa spring cultivars. Eleven years of my life are in that room.",
  end:[['R',"The foundry's dark. For a second the signal went quiet on every channel."],['R',"Now the hangar. If they hold the launch bay, nothing leaves this station."]]},""")
rep("""  end:[['R',"Hangar's ours. The skiffs still fly."],['L',"Come forward, soldier. Come and hear the song properly."],['R',"That's Lattice, up by the bridge. Go forward, through the farms."]]},""","""  log:"LOG 2011 · R. ADEYEMI: My daughter Imani is down on Europa, in Cryo-farm Four. The colonies eat what this deck grows. I won't let the Dark have the harvest, or the people who eat it.",
  end:[['R',"Hangar's ours. The skiffs still fly."],['L',"Come forward, soldier. Come and hear the song properly."],['R',"That's Lattice, calling from the bridge. We go forward, through the farms."]]},""")
rep("""  end:[['R',"It's down. Lattice is quiet. Thalassa is ours again."],['L',"I was only the door. Those who serve the Dark are already on their way to Europa."],['R',"Deep Watch confirms it. Ships, hundreds of them, burning for the ice. The fight is moving to the surface, soldier."]]}];""","""  log:"LOG 2012 · R. ADEYEMI: The pruner is a grow-lab laser meant for trimming vines under the lamps. It cuts a drone just as clean. Turns out a gardener makes a decent soldier.",
  end:[['R',"It's down. Lattice is quiet. Thalassa is ours again."],['L',"I was only the door. Those who serve the Dark are already on their way to Europa."],['R',"Deep Watch confirms it. Ships, hundreds of them, burning for the ice. The fight is moving to the surface."],['R',"I have the seed case on my back, every strain we own. The skiff in the hangar still flies. You and I are getting off this rock, soldier. Europa needs us."]]}];""")
rep("if(boss)comm('G',STORY.logs[logI++%STORY.logs.length])}else storyEnd(boss)","if(boss)comm('G',C.log||STORY.logs[logI++%STORY.logs.length])}else storyEnd(boss)")
rep("if(C&&wave===CAMP.length){gap=1e9;endT=16}","if(C&&wave===CAMP.length){gap=1e9;endT=8;endCap=60}")
rep("let endT=0;","let endT=0,endCap=0;")
rep("if(endT>0){endT-=dt;if(endT<=0){showEnding();return}}","if(endT>0){endT-=dt;endCap-=dt;if(endT<=0){if(endCap>0&&(commCur||COMMS.length||VOICE.busy))endT=.5;else{showEnding();return}}}")
rep("The Dark\\'s own forces are on their way to Europa. Level 2, the ground invasion, is not built yet. You can keep fighting endless stages aboard the station.","Rowan has the seed case and a skiff is waiting in the hangar. The Dark\\'s own forces are on their way to Europa. Level 2, the ground invasion, is not built yet. You can keep fighting endless stages aboard the station.")
open(p,'w').write(s);print('ok')
