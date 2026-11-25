p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:80]); s=s.replace(a,b)
# ---------- walker variants 4 shieldbearer, 5 detonator, 6 rocketeer (types 10-12)
rep("root.scale.setScalar([1,1.45,.78,1][v])","root.scale.setScalar([1,1.45,.78,1,1.1,.85,1][v])")
rep("const A1=[MAT.armor,MAT.bruteA,MAT.stalkA,MAT.snipA][v]","const A1=[MAT.armor,MAT.bruteA,MAT.stalkA,MAT.snipA,MAT.shieldA,MAT.detA,MAT.rocketA][v]")
rep("MAT.cloak=std({color:0x2c3324,roughness:.95,side:T.DoubleSide});","""MAT.cloak=std({color:0x2c3324,roughness:.95,side:T.DoubleSide});
MAT.shieldA=std({color:0x3a5a80,roughness:.4,metalness:.6});MAT.detA=std({color:0xb8641e,roughness:.5,metalness:.4});MAT.rocketA=std({color:0x4a5458,roughness:.5,metalness:.55});""")
rep("    if(v===3)a(GEO.box,MAT.cloak,.58,.75,.04,0,.2,-.45,.12,0,0)},true);","""    if(v===3)a(GEO.box,MAT.cloak,.58,.75,.04,0,.2,-.45,.12,0,0);
    if(v===5){for(let i=0;i<5;i++)a(GEO.box,i%2?MAT.dark:AM,.62,.05,.02,0,.12+i*.07,.235)}
    if(v===6){a(GEO.box,A2,.2,.5,.2,.2,.62,-.3);a(GEO.cyl,A2,.13,.9,.13,.2,.95,-.2,1.2,0,0)}},true);""")
rep("if(v===1&&s<0)a(GEO.box,A1,.08,.66,.52,-.12,-.2,.06);","if((v===1||v===4)&&s<0)a(GEO.box,A1,.08,.66,.52,-.12,-.2,.06);")
rep("let gun=null;if(v!==2){","let gun=null;if(v!==2&&v!==5){")
rep("    else if(v===3){a(GEO.box,A2,.09,.13,.9,0,0,.05);",
    "    else if(v===6){a(GEO.box,A2,.12,.16,.5,0,0,0);a(GEO.cyl,A1,.11,.7,.11,0,.12,.25,1.571,0,0);a(GEO.cyl,AM,.12,.05,.12,0,.12,.6,1.571,0,0);a(GEO.box,EY,.03,.03,.03,0,.25,.1)}\n    else if(v===3){a(GEO.box,A2,.09,.13,.9,0,0,.05);")
rep("  let aim=null,aimM=null;if(v===3){","""  let shieldM=null,shield=null,bomb=null;
  if(v===4){shieldM=bas({color:0x6fd8ff,transparent:true,opacity:.32,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending});shield=new T.Mesh(new T.CircleGeometry(.8,6),shieldM);shield.position.set(-.05,.3,.62);tor.add(shield);
    const fr=mesh(GEO.tor,MAT.cell,.8,.8,.8,0,0,0);fr.scale.z=.3;shield.add(fr)}
  if(v===5){bomb=mesh(GEO.sph,MAT.eye,.17,.17,.17,0,.36,.26);tor.add(bomb);const q=glow(0xff3b3b,1.1,.8);bomb.add(q)}
  let aim=null,aimM=null;if(v===3){""")
rep("return{aim,segs:{pel,tor,head,arms,legs,gun},anim(e,t,dt){const m=e.mv||0,w=t*(v===2?13:v===1?6:9)+e.ph,",
    "return{aim,segs:{pel,tor,head,arms,legs,gun},anim(e,t,dt){const m=e.mv||0,w=t*(v===2||v===5?13:v===1?6:9)+e.ph,")
rep("tor.rotation.x=v===2?.35:0;","tor.rotation.x=v===2?.35:v===5?.25:0;\n    if(shield){const up=!((e.burst||0)>0);shield.visible=up;shieldM.opacity=.25+.1*Math.sin(t*6)}if(bomb){const hd=Math.hypot(eye.x-e.pos.x,eye.z-e.pos.z);bomb.visible=Math.sin(t*(hd<12?30:10))>-.2}")
rep("    if(v===2){arms[1][0].rotation.set(","    if(v===2||v===5){arms[1][0].rotation.set(")
rep("e.kick=Math.max(0,(e.kick||0)-dt*(v===2?4:6));","e.kick=Math.max(0,(e.kick||0)-dt*(v===2||v===5?4:6));")
rep("  else if(type>=5&&type<=8)rig=walkerRig(g,type-5);else if(type===9)rig=crawlerRig(g);","  else if(type>=5&&type<=8||type>=10)rig=walkerRig(g,type-5);else if(type===9)rig=crawlerRig(g);")
rep("const ER=[0.5,0.55,1.0,3,0.7,0.9,1.3,0.7,0.9,1.0];","const ER=[0.5,0.55,1.0,3,0.7,0.9,1.3,0.7,0.9,1.0,1.0,0.75,0.9];")
rep("  9:{hp:6,","""  10:{jet:1,hp:5,spd:2.8,near:6,far:20,strafe:.3,atk:'rifle',score:200,col:'#6fb8ff',spark:0x6fd8ff,intro:"Shieldbearers. That energy wall stops almost every shot. Flank them, use grenades or melee, or hit them when they lower it to fire."},
  11:{jet:1,hp:1.5,spd:7.2,near:0,far:80,strafe:0,atk:'bomb',score:120,col:'#ff9a2a',spark:0xff8a3a,intro:"Hear that beeping? Detonator frames. They run at you and blow. Shoot them early, ideally next to their friends."},
  12:{cover:1,jet:1,hp:3.5,spd:2.8,near:16,far:36,strafe:.5,atk:'rocket',score:200,col:'#c0c8ff',spark:0xffb238,intro:"Rocketeer. Its rockets are slow but they track you. Sidestep late, or put a wall between you."},
  9:{hp:6,""")
rep("const pool=[[5,4],[7,2.5],[6,wave>=2?2:0],[8,wave>=2?1.5:0],[9,wave>=3?1.5:0]];","const pool=[[5,4],[7,2.5],[6,wave>=2?2:0],[8,wave>=2?1.5:0],[9,wave>=3?1.5:0],[10,wave>=2?1.5:0],[11,wave>=2?1.5:0],[12,wave>=3?1.5:0]];")
# ---------- attacks: detonation and homing rockets
rep("  else if(P.atk==='melee'){","""  else if(P.atk==='bomb'){if(hd<15&&e.bt<=0){e.bt=hd<6?.18:.5;sfx('beep')}if(d<e.r+1.7){damage(e,1e9);return}}
  else if(P.atk==='rocket'){if(see&&d<70&&e.cd<=0){e.cd=4.5+Math.random();e.kick=1;e.atkN++;const g=new T.Group(),c=mesh(GEO.cone,MAT.gunD,.12,.5,.12,0,0,0);c.rotation.x=Math.PI/2;g.add(c,glow(0xff8a3a,1.6,.9));
      g.position.set(p.x+.2,p.y+1.1,p.z);scene.add(g);shots.push({g,v:new T.Vector3(dx/d*13,(dy-1.1)/d*13,dz/d*13),t:6,dmg:15,home:1});sfx('rocket')}}
  else if(P.atk==='melee'){""")
rep("for(let i=shots.length-1;i>=0;i--){const s2=shots[i],p=s2.g.position;if(s2.grav)s2.v.y-=s2.grav*dt;",
    "for(let i=shots.length-1;i>=0;i--){const s2=shots[i],p=s2.g.position;if(s2.grav)s2.v.y-=s2.grav*dt;\n    if(s2.home){tmp2.set(eye.x-p.x,eye.y-.3-p.y,eye.z-p.z).setLength(13);s2.v.lerp(tmp2,Math.min(1,dt*1.1)).setLength(13);s2.g.lookAt(p.x+s2.v.x,p.y+s2.v.y,p.z+s2.v.z)}")
# shieldbearer: front shield blocks gun shots unless it is firing; detonators explode when destroyed
rep("  if(e.sh>0){const m=el===e.sel","  if(e.type===10&&(el===0||el===1)&&!((e.burst||0)>0)){n*=0.15;sparkle(e.pos,0x6fd8ff,3,4)}\n  if(e.sh>0){const m=el===e.sel")
rep("e.dying=0.001;if(e.type!==3&&e.type!==4)ragdoll(e);","e.dying=0.001;if(e.type===11)detonate(e.pos.clone());if(e.type!==3&&e.type!==4)ragdoll(e);")
rep("/* ---------- combat ---------- */","""function detonate(p){explode(p);if(Math.hypot(pos.x-p.x,pos.z-p.z)<3.8&&Math.abs(pos.y+1-p.y)<3&&los(p,eye))hurt(20)}

/* ---------- combat ---------- */""")
rep("  else if(k==='jet')tone(","  else if(k==='beep')tone('square',1600,1600,.05,.03);\n  else if(k==='rocket'){tone('sawtooth',200,90,.5,.06);tone('triangle',600,200,.3,.04)}\n  else if(k==='jet')tone(")
open(p,'w').write(s);print('ok')
