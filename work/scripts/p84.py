import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()

def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)

# 1) sky handles, so Meridian can hide the asteroid ring and the derelict and turn the sky to show the Blade
rep("const FAR=new T.Group();", "const FAR=new T.Group(),FARX={};")
rep("FAR.add(belt);", "FAR.add(belt);FARX.belt=belt;")
rep("FAR.add(dg);", "FAR.add(dg);FARX.dg=dg;")

# 2) hub enter/leave: quieter sky, Blade in view, sun where the sky's sun now is
rep("{const c=sun.shadow.camera;if(!HUB.sh0)HUB.sh0=[c.left,c.right,c.top,c.bottom,c.far];c.left=c.bottom=-140;c.right=c.top=140;c.far=520;c.updateProjectionMatrix();window._hubSun=[70,150,260]}",
    "{const c=sun.shadow.camera;if(!HUB.sh0)HUB.sh0=[c.left,c.right,c.top,c.bottom,c.far];c.left=c.bottom=-140;c.right=c.top=140;c.far=520;c.updateProjectionMatrix();window._hubSun=[77,244,208]}"
    "FAR.rotation.set(-2.529,2.006,-2.617);if(FARX.belt)FARX.belt.visible=false;if(FARX.dg)FARX.dg.visible=false;if(HUB.myShip)HUB.myShip.visible=true;")
rep("window._hubSun=null;", "window._hubSun=null;FAR.rotation.set(0,0,0);if(FARX.belt)FARX.belt.visible=true;if(FARX.dg)FARX.dg.visible=true;")

# 3) the ship terminal launches you; missions move to the mission board in the hall
rep("function hubUse(){const q=HUB.near;if(!q)return;if(q.k==='x'){pause();",
    "function hubUse(){const q=HUB.near;if(!q)return;if(q.k==='x'){hubLaunch();return}if(q.k==='mb'){pause();")

SORTIE = r"""
// ---- Meridian sortie: board your ship in Hangar 0, it lifts, turns to the mouth and flies out over the platform; fly free round
// the station; fly back into the hangar under 70 to land, and the ship settles on its pad and you step out
function hubLaunch(){if(!HUB.on)return;const hg=HUB.g,L0=LAST;hubLeave();hg.visible=true;worldShow(false);if(HUB.myShip)HUB.myShip.visible=false;
  FAR.rotation.set(-2.529,2.006,-2.617);if(FARX.belt)FARX.belt.visible=false;if(FARX.dg)FARX.dg.visible=false;HUB.fly=true;flyStart(4);LAST=L0}
const sm01=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
function meriSortie(S){const O=S.org=new T.Vector3(HC.x,0,HC.z-1100);S.noHull=true;S.wing=null;S.pos.set(O.x-50,2.4,O.z+1103);S.h0=Math.PI*.82;S.h=S.h0;S.p=0;S.spd=0;S.thr=0;S.ph='takeoff';S.toT=0;
  S.g.position.copy(S.pos);S.g.rotation.set(0,S.h,0);yaw=Math.PI;pitch=0;setObj('MERIDIAN · TAKING OFF');say('Clearing Hangar 0.',2)}
// returns true while a scripted take-off or landing is driving the ship
function meriScript(S,dt){if(S.stage!==4||(S.ph!=='takeoff'&&S.ph!=='landing'))return false;S.toT+=dt;const O=S.org,t=S.toT;let x,y,z,h,p=0,v;
  if(S.ph==='takeoff'){const x0=O.x-50,z0=O.z+1103;
    if(t<2){const u=sm01(t/2);x=x0;y=2.4+u*5;z=z0;h=S.h0+(Math.PI-S.h0)*u;v=4}
    else{const u=Math.min(1,(t-2)/4.5),e=u*u;x=x0+(O.x-25-x0)*sm01(u);y=7.4+e*70;z=z0+e*480;h=Math.PI;p=.22*sm01(u);v=20+e*200}
    if(t>6.5){S.ph='free';S.thr=.6;S.spd=150;setObj('MERIDIAN · FREE FLIGHT · FLY BACK INTO HANGAR 0 UNDER 70 TO LAND');say('Clear of the hangar. She is yours.',2.5);return false}}
  else{const P0=S.l0,x1=O.x-50,z1=O.z+1103,u=sm01(t/5),hh=S.lh0+ad(S.h0,S.lh0)*u;x=P0.x+(x1-P0.x)*u;z=P0.z+(z1-P0.z)*u;y=P0.y+(2.4-P0.y)*sm01((t-1)/4);h=hh;v=Math.max(0,S.lv0*(1-t/3));
    if(t>5.6){meriLanded();return true}}
  S.pos.set(x,y,z);S.h=h;S.p=p;S.spd=v;S.roll*=.9;S.vel.set(-Math.sin(h),0,-Math.cos(h)).multiplyScalar(v);if(S.ph==='takeoff'){yaw=h;pitch=p}
  S.g.position.copy(S.pos);S.g.rotation.set(S.p,S.h,S.roll);shuttleAnim(S.g,v,false,0,S.msl,S.mac,v<10,dt);pos.copy(S.pos);eye.copy(S.pos);vy=0;
  if(!eng)engineOn();engSet(36+v*.32,.05,280+v*9,.02+v/2400);return true}
function stage4Tick(S,dt){const O=S.org;if(HUB.mer)try{meriTick({meri:HUB.mer,t:S.t},dt)}catch(e){}
  if(HUB.mer&&shipPush(HUB.mer,S.pos,2.4)){const imp=S.spd;S.spd*=.35;if(!reduced)shake=Math.max(shake,imp>45?.35:.1);if(imp>45&&S.t-(S.crashT||-9)>.8){S.crashT=S.t;sfx('boom');sparkle(S.pos,0xffd27a,14,9)}}
  const lx=S.pos.x-O.x,lz=S.pos.z-O.z,inH=Math.abs(lx)<80&&lz>1083&&lz<1199&&S.pos.y<62;if(Math.hypot(lx,lz)<1200&&S.pos.y<3)S.pos.y=3;if(inH&&S.pos.y<2.4)S.pos.y=2.4;
  if(inH&&S.spd<70&&lz<1190){S.ph='landing';S.toT=0;S.l0=S.pos.clone();S.lh0=S.h;S.lv0=S.spd;setObj('MERIDIAN · LANDING');say('Setting down in Hangar 0.',2);return}
  if(inH&&S.spd>=70&&S.t-(S.slowT||-9)>3){S.slowT=S.t;say('Too fast to land: under 70',1.5)}
  setObj('MERIDIAN · FREE FLIGHT · FLY BACK INTO HANGAR 0 UNDER 70 TO LAND')}
function meriLanded(){flyExit();HUB.fly=false;hubEnter();if(HUB.myShip)HUB.myShip.visible=true;pos.set(HC.x-36,0,HC.z+6);yaw=-.6;eye.set(pos.x,pos.y+EYE,pos.z);say('Welcome back to Meridian.',2.5)}
"""
rep("function hubLaunch", "function hubLaunch") if "function hubLaunch" in s else None
a = s.index("function hubUse(){")
s = s[:a] + SORTIE.lstrip('\n') + s[a:]

# 4) flight hooks: start, scripted phases, the stage tick
rep("  if(st===3){S.pos.set(0,40,1500);", "  if(st===4){meriSortie(S);return}\n  if(st===3){S.pos.set(0,40,1500);")
rep("function flyTick(dt){const S=FLY;S.t+=dt;fcFlashTick(dt);if(FC.on&&fcTick(S,dt))return;flyUpright(S,dt);",
    "function flyTick(dt){const S=FLY;S.t+=dt;fcFlashTick(dt);if(FC.on&&fcTick(S,dt))return;if(meriScript(S,dt))return;flyUpright(S,dt);")
rep("}else if(S.stage===2){if(stage2Tick(S,dt))return}else{", "}else if(S.stage===2){if(stage2Tick(S,dt))return}else if(S.stage===4){stage4Tick(S,dt)}else{")
open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))
