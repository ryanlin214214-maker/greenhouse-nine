import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)

# ---- graphics and atmosphere pass (v83) ----
# 1) Thalassa floors: less metal (they mirrored a dark room and read as black voids), a touch smoother
rep("g.strokeRect(8,8,S-16,S-16)}),roughness:.6,metalness:.35});", "g.strokeRect(8,8,S-16,S-16)}),roughness:.55,metalness:.12});")

# 2) presentation: announcements smaller and below the crosshair; explosion smoke thinner and shorter
rep(".msg{position:absolute;left:0;right:0;top:30%;", ".msg{position:absolute;left:0;right:0;top:63%;")
rep("  font-size:clamp(18px,4vw,34px);letter-spacing:.2em;", "  font-size:clamp(12px,1.9vw,19px);letter-spacing:.16em;")
rep("api.smoke(p,{n:Math.round(7+4*k),spd:3.2*k,size:[2*k,8*k],life:space?4.5:3.6,up:space?0:1.6,drag:1.6,spread:k,c0:.09,c1:.32,alpha:.8});",
    "api.smoke(p,{n:Math.round(5+3*k),spd:3.2*k,size:[2*k,7*k],life:space?3.2:2.8,up:space?0:1.6,drag:1.6,spread:k,c0:.09,c1:.32,alpha:.5});")
rep("api.smoke(p,{n:Math.round(4+3*k),spd:1.2*k,size:[3*k,10*k],life:space?5:4.5,up:space?0:2.2,drag:1,spread:1.5*k,c0:.14,c1:.42,alpha:.6})",
    "api.smoke(p,{n:Math.round(3+2*k),spd:1.2*k,size:[3*k,9*k],life:space?3.6:3.2,up:space?0:2.2,drag:1,spread:1.5*k,c0:.14,c1:.42,alpha:.34})")

ATMO = r"""
// ---- atmosphere (v83): soft pools of light on the floor under lamps (one instanced draw), warning beacons and steam in
// engineering, guide lights down the hangars. Pools are additive decals, so they cost no real lights.
let POOLTEX=null;const poolTex=()=>POOLTEX||(POOLTEX=paint(128,(g,S)=>{const r=g.createRadialGradient(S/2,S/2,0,S/2,S/2,S/2);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.35,'rgba(255,255,255,.55)');r.addColorStop(.7,'rgba(255,255,255,.15)');r.addColorStop(1,'rgba(255,255,255,0)');g.clearRect(0,0,S,S);g.fillStyle=r;g.fillRect(0,0,S,S)},false));
function poolMesh(list){const geo=new T.PlaneGeometry(1,1);geo.rotateX(-Math.PI/2);const m=new T.MeshBasicMaterial({map:poolTex(),transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4});
  const im=new T.InstancedMesh(geo,m,list.length),d=new T.Object3D(),c=new T.Color();list.forEach((p,i)=>{d.position.set(p[0],p[1],p[2]);d.scale.set(p[3],1,p[3]);d.updateMatrix();im.setMatrixAt(i,d.matrix);c.setHex(p[4]).multiplyScalar(p[5]);im.setColorAt(i,c)});
  im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;im.frustumCulled=false;im.renderOrder=2;im.userData.noShadow=true;return im}
const ATMO={on:false,pools:null,beac:[],steam:[],chase:[],st:0};
function atmoBuild(){ATMO.on=true;const L=[];let n=0;const hid=HUB.on||!!(FLY&&FLY.noHull),add=o=>{scene.add(o);WORLDOBJ.push(o);if(hid){o.userData.wv=true;o.visible=false}};
  for(const f of FIX){const rn=f.rm&&f.rm.n;let y=0;try{y=groundAt(f.x,f.z,f.y-.4)}catch(e){}if(f.y-y>16)continue;
    let col=0xe6f2ff,k=.3,sz=Math.max(6,Math.min(14,f.r*.5));
    if(rn==='COMMONS'){n++;if(n%2){col=0xffb46a;k=.42}else{col=0xcfe6ff;k=.28}}       // cool station light mixed with warm grow lamps
    else if(rn==='ENGINEERING'){col=0xff7a2e;k=.5;sz*=1.15}else if(rn==='HANGAR'||rn==='AFT SPINE'||rn==='FORE SPINE'){col=0xffa060;k=.4}
    else if(rn==='PORT FARMS'||rn==='STARBOARD FARMS'){col=0xd8ffd0;k=.28}else if(rn==='HABITAT'){col=0xf0e6ff;k=.28}
    L.push([f.x,y+.035,f.z,sz,col,k])}
  if(L.length){ATMO.pools=poolMesh(L);add(ATMO.pools)}
  // engineering: rotating amber warning beacons on the walls, and steam venting low along them
  const bm=bas({color:0xff8a2a});for(const[x,z]of[[12.6,58],[12.6,96],[12.6,134],[105.4,58],[105.4,96],[105.4,134],[-104.5,165],[104.5,165],[-104.5,248],[104.5,248]]){
    const g=new T.Group();g.position.set(x,7,z);const b=new T.Mesh(GEO.box,bm);b.scale.set(.5,.5,.5);g.add(b);const q=glow(0xff8a2a,5,.0);q.material=q.material.clone();g.add(q);add(g);ATMO.beac.push({q,ph:x*.3+z*.1})}
  if(!lowFx)for(const[x,z]of[[16,62],[16,118],[102,78],[102,140],[60,146],[40,46],[84,46]])ATMO.steam.push(new T.Vector3(x,.4,z));
  // Thalassa hangar: guide lights down the launch lane that chase toward the mouth
  {const gm=bas({color:0x8a7448});for(const sx of[-1,1])for(let z=166;z<=254;z+=6){let gy=0;try{gy=groundAt(sx*8,z,6)}catch(e){}const m=new T.Mesh(GEO.box,gm);m.scale.set(.45,.06,.8);m.position.set(sx*8,gy+.05,z);add(m);const q=glow(0xffc070,3.2,0);q.material=q.material.clone();q.position.set(sx*8,gy+.45,z);add(q);ATMO.chase.push({q,z})}}}
function atmoTick(dt){if(!ATMO.on){if(state!=='playing')return;try{atmoBuild()}catch(e){ATMO.on=true;console.warn(e)}}
  const t=time;for(const b of ATMO.beac){const c=Math.cos(t*3.2+b.ph);b.q.material.opacity=Math.pow(Math.max(0,c),6)*.9}
  for(const c of ATMO.chase){const u=((c.z-166)/6-t*6)%15;c.q.material.opacity=u>-1.2&&u<=0?1:.3}
  if(HUB.guide&&HUB.g&&HUB.g.visible)for(const c of HUB.guide){const u=((c.z-1088)/6-t*5)%18;c.q.material.opacity=u>-1.4&&u<=0?1:.32}
  ATMO.st-=dt;if(ATMO.st<=0&&ATMO.steam.length&&!FLY&&!HUB.on){ATMO.st=.16;const p=cam.position;for(const v of ATMO.steam){if(v.distanceToSquared(p)>3600)continue;
    PFX.smoke(v,{n:1,spd:.5,size:[.8,3.6],life:2.4,up:2.4,drag:1,spread:.35,c0:.86,c1:.96,alpha:.18})}}}
"""
a = "function lightTick(dt){"
i = s.index(a); s = s[:i] + ATMO.lstrip('\n') + s[i:]
rep("function lightTick(dt){const p=cam.position,", "function lightTick(dt){try{atmoTick(dt)}catch(e){}const p=cam.position,")

# 3) Meridian: the objective follows where you are; tags only for the area you are in, and they never sit on each other
HZ = r"""
function hubZone(){const lx=pos.x-HC.x,lz=pos.z-(HC.z-1100);return lz>1200?'deck':lz>1076?'hangar':lz<985?'plaza':lx<-13?'armoury':lx>13?'outfitter':'hall'}
const HZOBJ={hangar:'MERIDIAN · HANGAR 0 · SHIPS FOR SALE · YOUR SHIP: E TO TAKE OFF',hall:'MERIDIAN · GRAND CONCOURSE · ARMOURY LEFT · OUTFITTER RIGHT · MISSION BOARD',
  armoury:'MERIDIAN · ARMOURY · HOLLIS VANE · E AT THE COUNTER',outfitter:'MERIDIAN · OUTFITTER · INES MARLOW · E AT THE COUNTER',plaza:'MERIDIAN · THE PLAZA',deck:'MERIDIAN · LANDING PLATFORM 0 · OBSERVATION DECK AT THE TIP'};
const HPZ={w:'armoury',a:'outfitter',s:'hangar',x:'hangar',mb:'hall'};let _hzLast='';
"""
a = "const HTN={w:'WEAPONS · HOLLIS'"
i = s.index(a); s = s[:i] + HZ.lstrip('\n') + s[i:]
rep("  const W=stage.clientWidth,H=stage.clientHeight,on=HUB.on&&state==='playing';HUB.pts.forEach((q,i)=>{const el=HTAG[i];const d=Math.hypot(pos.x-q.x,pos.z-q.z);\n    if(!on||d<q.r||d>140){el.hidden=true;return}",
    "  const W=stage.clientWidth,H=stage.clientHeight,on=HUB.on&&state==='playing',zn=hubZone(),near=zn==='hall'?['hall','armoury','outfitter']:zn==='armoury'||zn==='outfitter'?[zn,'hall']:[zn];const R=[];\n  if(on&&zn!==_hzLast){_hzLast=zn;setObj(HZOBJ[zn])}\n  HUB.pts.forEach((q,i)=>{const el=HTAG[i];const d=Math.hypot(pos.x-q.x,pos.z-q.z);\n    if(!on||d<q.r||d>140||!near.includes(HPZ[q.k])){el.hidden=true;return}")
rep("    if(vis){el.style.left=((_htv.x*.5+.5)*W)+'px';el.style.top=((-_htv.y*.5+.5)*H)+'px';el.textContent=HTN[q.k]+' · '+Math.round(d)+' M'}})}",
    "    if(vis){let x=(_htv.x*.5+.5)*W,y=(-_htv.y*.5+.5)*H;for(const r of R)if(Math.abs(r[0]-x)<130&&Math.abs(r[1]-y)<20)y=r[1]-22;R.push([x,y]);el.style.left=x+'px';el.style.top=y+'px';el.textContent=HTN[q.k]+' · '+Math.round(d)+' M'}})}")
rep("function hubTagsOff(){if(HTAG)for(const e of HTAG)e.hidden=true}", "function hubTagsOff(){_hzLast='';if(HTAG)for(const e of HTAG)e.hidden=true}")
# the floor lanes that cover most of each room were near black: lift them to a dark grey that reads under the lamps
rep("MAT.laneA=std({color:0x475157,roughness:.85,metalness:.05});MAT.laneB=std({color:0x353d41,roughness:.85,metalness:.05});MAT.laneF=std({color:0x4c574f,roughness:.85,metalness:.05});",
    "MAT.laneA=std({color:0x6b767d,roughness:.7,metalness:.05});MAT.laneB=std({color:0x535c62,roughness:.7,metalness:.05});MAT.laneF=std({color:0x6c7a70,roughness:.75,metalness:.05});")
rep("MOODS={A:{hi:.6,sky:0xdce8f0,gr:0x4a5256,lc:0xe6f2ff,li:1},B:{hi:.3,sky:0xcbd6dc,gr:0x1c2226,lc:0xff9548,li:1.6},F:{hi:.8,",
    "MOODS={A:{hi:.75,sky:0xdce8f0,gr:0x4a5256,lc:0xe6f2ff,li:1},B:{hi:.45,sky:0xd6d2cc,gr:0x2a2622,lc:0xff9548,li:1.6},F:{hi:.9,")
open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))
