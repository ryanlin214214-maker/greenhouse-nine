import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()

def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)

# 1) station model: platform 0 starts at the new hangar's mouth instead of running into it
rep("for(const t of PLAT){RB(W,70,8,380,t,RIM+170,-4,0,1.5);RB(Dk,72,3,380,t,RIM+170,-9.5,0,.5);RB(Gd,72,1,4,t,RIM+361,-1,0,.3);\n      for(const o of[-35.4,35.4]){RB(Gd,1,.6,380,t,RIM+170,2.6,o,.15);",
    "for(const t of PLAT){const pl=t===0?[327,RIM+166.5]:[380,RIM+170];RB(W,70,8,pl[0],t,pl[1],-4,0,1.5);RB(Dk,72,3,pl[0],t,pl[1],-9.5,0,.5);RB(Gd,72,1,4,t,RIM+361,-1,0,.3);\n      for(const o of[-35.4,35.4]){RB(Gd,1,.6,pl[0],t,pl[1],2.6,o,.15);")

# 2) station model: hangar 0 and the Grand Concourse, the buildings the player walks through, so they show from space too
H0 = r"""  // hangar 0 (the shipwright's, opening onto platform 0) and the Grand Concourse behind it: the buildings walked through at Meridian
  {const SKY=std({color:0x9fd8ff,transparent:true,opacity:.35,roughness:.05,metalness:.6,depthWrite:false}),SKD=std({color:0x0a1a2a,transparent:true,opacity:.22,roughness:.08,metalness:.05,depthWrite:false});SKY.userData.blockSun=true;
  greeble(G,'meriH0',(a,R)=>{
    R(W,76,64,8,-47,32,1078,0,0,0,1);R(W,76,64,8,47,32,1078,0,0,0,1);R(W,18,52,8,0,38,1078,0,0,0,1);
    for(const s of[-1,1]){R(W,8,64,124,s*85,32,1140,0,0,0,1);R(Gd,5,64,5,s*86,32,1203,0,0,0,.5)}R(W,178,8,128,0,68,1138,0,0,0,1);R(Gd,178,5,5,0,63,1203,0,0,0,.5);
    R(Dk,162,.4,120,0,-.18,1141,0,0,0,.05);for(let z=1090;z<1200;z+=14)R(Gd,170,1.2,1.2,0,63.4,z,0,0,0,.1);
    for(const s of[-1,1])for(let k=0;k<8;k++)R(Wn,.4,2,10,s*89.2,50,1086+k*14,0,0,0,.05);
    for(const s of[-1,1]){R(W,2,32,90,s*63,16,1029,0,0,0,.4);R(W,56,32,2,s*36,16,985,0,0,0,.4);R(W,52,2,90,s*38,33,1029,0,0,0,.4)}R(W,16,22,2,0,21,985,0,0,0,.4);
    R(SKY,24,.5,90,0,33,1029,0,0,0,.1);for(let z=988;z<1074;z+=8)R(Gd,24.4,.9,.7,0,33.5,z,0,0,0,.1);
    for(const s of[-1,1]){R(Gd,1.4,1.4,92,s*64,32.6,1029,0,0,0,.2);for(let z=990;z<1074;z+=12){R(Gd,1,30,1,s*64.4,15,z,0,0,0,.1);R(Wn,.3,1.6,7,s*64.2,22,z+6,0,0,0,.05)}}R(Gd,130,1.4,1.4,0,32.6,984,0,0,0,.2);
    for(let x=-58;x<=58;x+=8)if(Math.abs(x)>10)R(Wn,4,1.6,.3,x,22,983.8,0,0,0,.05);
    // the tower terrace wall facing the plaza: gold ribs leaning with the taper, window rows, and a grand portal
    for(let u=-.36;u<=.361;u+=.036){const q=new T.Quaternion().setFromEuler(new T.Euler(-.21,u,0,'YXZ'));a(GEO.box,Gd,1.4,114,1.4,Math.sin(u)*852.8,56,Math.cos(u)*852.8,q);
      for(let y=10;y<104;y+=6){const r=864.3-24*y/112,v=u+.018;a(GEO.box,Wn,9,1.4,.4,Math.sin(v)*r,y,Math.cos(v)*r,new T.Quaternion().setFromEuler(new T.Euler(-.21,v,0,'YXZ')))}}
    R(SKD,70,.3,30,0,-.15,1545,0,0,0,.05);for(let z=1536;z<1560;z+=6)R(Gd,70,.4,.4,0,-.2,z,0,0,0,.05);for(const x of[-17.5,0,17.5])R(Gd,.4,.4,30,x,-.2,1545,0,0,0,.05);R(Gd,72,1.2,1.2,0,-.6,1530,0,0,0,.2);
    R(Gd,40,3,4,0,46,862,0,0,0,.5);for(const s of[-1,1])R(Gd,4,46,4,s*19,23,863,0,0,0,.5);R(AT,34,40,.4,0,20,863.6,0,0,0,.05);R(Gd,30,1,1,0,40,864.5,0,0,0,.2)},true);
  // observation deck at the tip of platform 0: a round deck 80 m across with a glass centre, gold rail and lamp posts
  greeble(G,'meriObs',(a,R)=>{a(new T.RingGeometry(26,40,64,1),W,1,1,1,0,0,1590,-Math.PI/2,0,0);a(new T.CylinderGeometry(40,40,4,64,1,true),W,1,1,1,0,-2,1590);a(new T.RingGeometry(10,40,64,1),Dk,1,1,1,0,-4,1590,Math.PI/2,0,0);
    a(new T.CylinderGeometry(26,26,.3,64),SKD,1,1,1,0,-.15,1590);a(new T.TorusGeometry(26,.25,6,64),Gd,1,1,1,0,.05,1590,Math.PI/2,0,0);a(new T.TorusGeometry(39.6,.12,6,96),Gd,1,1,1,0,1.15,1590,Math.PI/2,0,0);a(new T.TorusGeometry(40,.4,6,96),Gd,1,1,1,0,-.1,1590,Math.PI/2,0,0);
    for(let k=0;k<72;k++){const an=k*Math.PI/36,x=Math.sin(an)*39.6,z=1590+Math.cos(an)*39.6;if(z<1566&&Math.abs(x)<35.5)continue;a(GEO.box,Gd,.12,1.15,.12,x,.58,z)}
    for(let k=0;k<8;k++){const an=k*Math.PI/4+.39,x=Math.sin(an)*36.5,z=1590+Math.cos(an)*36.5;if(z<1566)continue;a(GEO.cyl,Dk,.12,4,.12,x,2,z);a(GEO.sph,Wn,.35,.35,.35,x,4.1,z)}
    for(let k=0;k<6;k++){const an=k*Math.PI/3,x=Math.sin(an)*33,z=1590+Math.cos(an)*33;a(GEO.box,Gd,.4,.06,9,x,-.03,z,0,an,0)}
    a(new T.CylinderGeometry(4,10,30,24),W,1,1,1,0,-19,1590);a(GEO.cone,Gd,1.2,14,1.2,0,-40,1590,Math.PI,0,0)},true);
  ob.push([0,-2,1590,40,2,40,0]);
  ob.push([0,32,1078,85,32,4,0],[85,32,1140,4,32,62,0],[-85,32,1140,4,32,62,0],[0,68,1138,89,4,64,0],[0,17,1029,64,17,46,0])}
"""
rep("  // pad and hangar numbers\n", H0 + "  // pad and hangar numbers\n")

# 3) the hub: replace the old concourse box with the walkable station
a = s.index("function hubBuild(){"); b = s.index("function hubOffers(){")
s = s[:a] + open('hub82.js', encoding='utf-8').read() + "\n" + s[b:]

a = s.index("function hubEnter(){"); b = s.index("function hubUse(){")
ENTER = r"""function hubEnter(){hubBuild();if(!HUB.THB){HUB.THB=boxes.slice()}boxes.length=0;for(const b of HUB.boxes)boxes.push(b);gridN=-1;worldShow(false);HUB.g.visible=true;HUB.on=true;HUB.offers=hubOffers();
  if(HUB.sun0===undefined){HUB.sun0=sun.intensity;HUB.ex0=renderer.toneMappingExposure}sun.intensity=HUB.sun0*.4;renderer.toneMappingExposure=HUB.ex0*.78;if(HUB.hm0===undefined)HUB.hm0=hemi.intensity;hemi.intensity=HUB.hm0*.4;
  if(scene.fog){if(!HUB.fog0)HUB.fog0=[scene.fog.near,scene.fog.far];scene.fog.near=3000;scene.fog.far=16000}{const c=sun.shadow.camera;if(!HUB.sh0)HUB.sh0=[c.left,c.right,c.top,c.bottom,c.far];c.left=c.bottom=-140;c.right=c.top=140;c.far=520;c.updateProjectionMatrix();window._hubSun=[70,150,260]}
  pos.set(HC.x-30,0,HC.z+12);vy=0;yaw=-.72;pitch=0;eye.set(pos.x,pos.y+EYE,pos.z);mission=null;gap=1e9;queue.length=0;ROW.on=false;rwG.visible=false;COMMS.length=0;commCur=null;
  setObj('MERIDIAN · HANGAR 0 · SHIPS HERE, ARMOURY AND OUTFITTER THROUGH THE CONCOURSE DOOR');say('Meridian Station. Spend your credits here.',3)}
function hubLeave(){if(!HUB.on)return;HUB.on=false;if(HUB.sun0!==undefined){sun.intensity=HUB.sun0;renderer.toneMappingExposure=HUB.ex0}if(HUB.hm0!==undefined)hemi.intensity=HUB.hm0;if(HUB.fog0&&scene.fog){scene.fog.near=HUB.fog0[0];scene.fog.far=HUB.fog0[1];HUB.fog0=null}
  if(HUB.sh0){const c=sun.shadow.camera;[c.left,c.right,c.top,c.bottom,c.far]=HUB.sh0;c.updateProjectionMatrix();HUB.sh0=null}window._hubSun=null;if(HUB.g)HUB.g.visible=false;if(HUB.THB){boxes.length=0;for(const b of HUB.THB)boxes.push(b);HUB.THB=null}gridN=-1;worldShow(true)}
const _hv=new T.Vector3();function hubTick(dt){if(!HUB.on)return;if(HUB.mer)try{meriTick({meri:HUB.mer,t:time},dt)}catch(e){}
  if(HUB.ring){HUB.ring.rotation.y+=dt*.3;HUB.ring.children.forEach((c,i)=>{if(c.geometry&&c.geometry.type==='TorusGeometry')c.rotation.z+=dt*(.2+i*.15)})}if(HUB.turn)HUB.turn.rotation.y+=dt*.5;if(HUB.hero)HUB.hero.rotation.y+=dt*.35;
  if(HUB.scan)HUB.scan.children.forEach((c,i)=>{if(c.geometry&&c.geometry.type==='TorusGeometry')c.position.y=.5+((time*.5+i/3)%1)*4.8});if(HUB.field)HUB.field.material.opacity=.04+.015*Math.sin(time*2);
  for(const v of HUB.vend){if(!v.rig.segs.pel.parent.parent.visible)continue;try{v.rig.anim(v.E,time,dt);if(v.rig.pose)v.rig.pose(v.rig.segs.arms,time+v.E.ph)}catch(e){}}
  // walk each NPC along its path, pausing at each point; workers busy their hands while they stand
  const far=o=>{const w=o.getWorldPosition(_hv);return Math.hypot(w.x-pos.x,w.z-pos.z)>80};
  for(const v of HUB.vend){const g=v.rig.segs.pel.parent.parent;g.visible=!far(g)}
  if(HUB.npcs)for(const n of HUB.npcs){const g=n.g,E=n.E;g.visible=!far(g);if(!g.visible&&n.path.length<2)continue;let mv=0;if(n.path.length>1){if(n.wait>0)n.wait-=dt;else{const t=n.path[n.i],dx=t[0]-g.position.x,dz=t[1]-g.position.z,d=Math.hypot(dx,dz);
        if(d<.3){n.i=(n.i+1)%n.path.length;n.wait=1.5+Math.random()*3}else{const st=Math.min(d,n.spd*dt);g.position.x+=dx/d*st;g.position.z+=dz/d*st;mv=n.spd/3;const ty=Math.atan2(dx,dz);g.rotation.y+=Math.atan2(Math.sin(ty-g.rotation.y),Math.cos(ty-g.rotation.y))*Math.min(1,dt*6)}}}
      E.mv+=(mv-E.mv)*Math.min(1,dt*6);if(!g.visible)continue;try{n.rig.anim(E,time,dt);if(n.pose&&E.mv<.05)n.pose(n.rig.segs.arms,time)}catch(e){}}
  if(HUB.npcs)for(const n of HUB.npcs)if(n.weld&&n.g.visible&&n.E.mv<.05&&n.wait>0&&Math.random()<dt*9){_hv.set(n.weld[0],n.weld[1],n.weld[2]);HUB.g.children[1].localToWorld(_hv);sparkle(_hv,Math.random()<.5?0xffc060:0x9fe6ff,4,3.5)}
  if(HUB.ads)for(const q of HUB.ads){q.y+=dt*.03;q.t.offset.y=Math.floor(q.y*4)/4+Math.min(1,(q.y*4%1)*6)*.25-.25+.25*(Math.sin(time*7+q.ph)>.97?.02:0)}
  if(HUB.traf)for(const q of HUB.traf){q.u=(q.u+q.spd*dt/q.L)%1;q.g.position.lerpVectors(q.a,q.b,q.u);_hv.copy(q.b).sub(q.a);q.g.rotation.y=Math.atan2(-_hv.x,-_hv.z)}
  if(HUB.cap){HUB.cap.u=(HUB.cap.u+dt*.004)%1;HUB.cap.g.position.set(-5000+HUB.cap.u*10000,700,5200);HUB.cap.g.rotation.y=-Math.PI/2}
  if(HUB.dust){HUB.dust.rotation.y=Math.sin(time*.05)*.01;HUB.dust.position.y=Math.sin(time*.3)*.4}if(HUB.rays)HUB.rays.opacity=.07+.025*Math.sin(time*.4)
  if(HUB.drones)for(const q of HUB.drones){q.a+=q.w*dt;q.d.position.set(q.cx+Math.sin(q.a)*q.r,q.cy+Math.sin(time*1.3+q.a)*.6,q.cz+Math.cos(q.a)*q.r);q.d.rotation.y=q.a+(q.w>0?Math.PI/2:-Math.PI/2);q.d.rotation.z=Math.sin(time*2+q.a)*.08}
  let nr=null,bd=1e9;for(const q of HUB.pts){const d=Math.hypot(pos.x-q.x,pos.z-q.z);if(d<q.r&&d<bd){bd=d;nr=q}}HUB.near=nr;const el=$('veh');if(state==='playing'){el.hidden=!nr;if(nr)el.textContent=nr.label}}
"""
s = s[:a] + ENTER + s[b:]

a="sun.position.set(pos.x+28,pos.y+46,pos.z+14);sun.target.position.set(pos.x,pos.y,pos.z);"
assert s.count(a)==1
s=s.replace(a,"if(window._hubSun){const h=window._hubSun;sun.position.set(pos.x+h[0],pos.y+h[1],pos.z+h[2])}else sun.position.set(pos.x+28,pos.y+46,pos.z+14);sun.target.position.set(pos.x,pos.y,pos.z);")
a="for(let r=RIM+20;r<RIM+360;r+=40)RB(Wn,.6,.2,24,t,r,.12,0,.05);"
assert s.count(a)==1
s=s.replace(a,"for(let r=RIM+20;r<RIM+360;r+=40)if(t!==0||r<RIM+320)RB(Wn,.6,.2,24,t,r,.12,0,.05);")
a="for(const t of PLAT){spots.push([P(t,RIM+230,2.2),t]);if(t!==0)spots.push([P(t,RIM+310,2.2),t])}"
assert s.count(a)==1
s=s.replace(a,"for(const t of PLAT){if(t!==0){spots.push([P(t,RIM+230,2.2),t]);spots.push([P(t,RIM+310,2.2),t])}}")
open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))
