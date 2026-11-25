import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)

# ---- v86: all of Meridian's outer deck on foot. The walkable ring runs between the tower's terrace wall (864 m from the
# axis) and the rim (1,200 m), out onto all five landing platforms and into the six hangars through a door in each back wall.
# Collision out here is polar and rotated (the station's own boxes, `oboxes`), so the axis-aligned hub boxes only cover the
# concourse, Hangar 0 and platform 0 as before.
MW = r"""
const MRING={IN:864.6,OUT:1199.4,RIM:1200,PLAT:[.8,-.8,2.25,-2.25],HANG:[.4,-.4,1.55,-1.55,2.85,-2.85],obs:null,ships:null};
function meriWalkInit(){const M=HUB.mer;MRING.obs=(M&&M.oboxes||[]).filter(o=>o[1]+o[4]>.6&&o[1]-o[4]<1.9);for(const sx of[-1,1])MRING.obs.push([sx*74.5,16,1077.5,10.6,16,2.6,0]);for(const t of MRING.HANG){const Pq=(r,la)=>[Math.sin(t)*r+Math.cos(t)*la,Math.cos(t)*r-Math.sin(t)*la];for(const s of[-1,1]){const g=Pq(1084,s*40.5);MRING.obs.push([g[0],11,g[1],34.5,11,2,t])}for(const la of[-60,-30,30,60]){const c=Pq(1100,la);MRING.obs.push([c[0],3,c[1],5,3,7,t])}for(const s of[-1,1])for(let i=0;i<6;i++){const c=Pq(1106+i*13,s*71);MRING.obs.push([c[0],2.6,c[1],3.1,2.6,6.1,t])}}
  MRING.ships=[];for(const t of MRING.PLAT)for(const r of[1430,1510])MRING.ships.push([Math.sin(t)*r,Math.cos(t)*r,7.5]);for(const t of MRING.HANG)MRING.ships.push([Math.sin(t)*1130,Math.cos(t)*1130,7.5])}
// where you are on the ring: 'hub' (the concourse block, Hangar 0, platform 0), 'plat<k>', 'hang<k>' or 'ring'
function meriWhere(lx,lz){if(Math.abs(lx)<100&&lz>900)return'hub';for(let k=0;k<MRING.PLAT.length;k++){const t=MRING.PLAT[k],rp=lx*Math.sin(t)+lz*Math.cos(t),la=lx*Math.cos(t)-lz*Math.sin(t);if(rp>1196&&Math.abs(la)<37)return'plat'+(k+1)}
  for(let k=0;k<MRING.HANG.length;k++){const t=MRING.HANG[k],rp=lx*Math.sin(t)+lz*Math.cos(t),la=lx*Math.cos(t)-lz*Math.sin(t);if(rp>1074&&rp<1201&&Math.abs(la)<85)return'hang'+(k+1)}return'ring'}
function meriWalk(){if(!HUB.on||FLY||!HUB.mer||veh)return;meriPush(pos,.45)}
function meriPush(Q,R){if(!HUB.mer)return;if(!MRING.obs)meriWalkInit();const OX=HC.x,OZ=HC.z-1100;let lx=Q.x-OX,lz=Q.z-OZ;
  if((Math.abs(lx)<63.6&&lz>983.4&&lz<1076)||(Math.abs(lx)<80.6&&lz>=1076&&lz<1203)||(Math.abs(lx)<36&&lz>=1203))return;   // inside the concourse, Hangar 0 or on platform 0: their own boxes
  let r=Math.hypot(lx,lz);if(r<MRING.IN){const k=MRING.IN/(r||1);lx*=k;lz*=k;r=MRING.IN}
  let on=Math.abs(lx)<36&&lz>1195;                                    // platform 0 (its rails are hub boxes)
  for(const t of MRING.PLAT){const sn=Math.sin(t),cs=Math.cos(t);let rp=lx*sn+lz*cs,la=lx*cs-lz*sn;if(rp>1198&&Math.abs(la)<37){on=true;la=Math.max(-34.6,Math.min(34.6,la));rp=Math.min(1200+356,rp);lx=rp*sn+la*cs;lz=rp*cs-la*sn}}
  if(!on&&r>MRING.OUT){const k=MRING.OUT/r;lx*=k;lz*=k}
  for(const o of MRING.obs){const[cx,cy,cz,hx,hy,hz,an]=o,c2=Math.cos(an),s2=Math.sin(an),dx=lx-cx,dz=lz-cz,ax=dx*c2-dz*s2,az=dx*s2+dz*c2;
    if(Math.abs(ax)>=hx+R||Math.abs(az)>=hz+R)continue;if(hx>80&&hz<5&&Math.abs(ax)<5.6)continue;if(hx>60&&hx<70&&Math.abs(lx)<8.6&&lz<990)continue;   // the door in each hangar's back wall; the concourse's plaza door
    const m=[hx+R-Math.abs(ax),hz+R-Math.abs(az)];let nx=ax,nz=az;if(m[0]<m[1])nx=Math.sign(ax||1)*(hx+R);else nz=Math.sign(az||1)*(hz+R);lx=cx+nx*c2+nz*s2;lz=cz-nx*s2+nz*c2}
  for(const[sx,sz,sr]of MRING.ships){const dx=lx-sx,dz=lz-sz,d=Math.hypot(dx,dz);if(d<sr){const k=sr/(d||1);lx=sx+dx*k;lz=sz+dz*k}}
  Q.x=OX+lx;Q.z=OZ+lz}
// transit pylons: E rides to the next stop round the ring (walking the whole ring is about 6.5 km)
function hubPromptOff(){HUB.near=null;const el=$('veh');if(el){el.hidden=true;el.textContent=''}}
function meriTransit(q){const L=HUB.pts.filter(p=>p.k==='tr'),i=L.indexOf(q),n=L[(i+1)%L.length];if(!n)return;pos.set(n.x+Math.sin(n.ry||0)*3,0,n.z+Math.cos(n.ry||0)*3);vy=0;yaw=(n.ry||0);pitch=0;eye.set(pos.x,pos.y+EYE,pos.z);
  if(typeof fadeSet==='function'){fadeSet(1);fade(0,.6)}say('Transit · '+n.name,2);sfx&&sfx('warp')}
"""
a = "function hubUse(){"
i = s.index(a); s = s[:i] + MW.lstrip('\n') + s[i:]
rep("function hubUse(){const q=HUB.near;if(!q)return;", "function hubUse(){const q=HUB.near;if(!q)return;if(q.k==='tr'){meriTransit(q);return}")
# run the ring collision right after the player moves
rep("function hubTick(dt){if(!HUB.on){hubTagsOff();return}", "function hubTick(dt){if(!HUB.on){hubTagsOff();return}try{meriWalk()}catch(e){}")
# zones, objectives and tags for the ring, the platforms and the hangars
rep("function hubZone(){const lx=pos.x-HC.x,lz=pos.z-(HC.z-1100);return lz>1200?'deck':",
    "function hubZone(){const lx=pos.x-HC.x,lz=pos.z-(HC.z-1100);if(MRING.obs){const w=meriWhere(lx,lz);if(w!=='hub')return w;const inC=Math.abs(lx)<63.6&&lz>983.4&&lz<1076,inH=Math.abs(lx)<80.6&&lz>=1076&&lz<1203,onP=Math.abs(lx)<36&&lz>=1203;if(!inC&&!inH&&!onP)return lz<990&&Math.abs(lx)<45?'plaza':'ring'}return lz>1200?'deck':")
rep("plaza:'MERIDIAN · THE PLAZA',", "plaza:'MERIDIAN · THE PLAZA · THE OUTER DECK RUNS ROUND THE TOWER · TRANSIT PYLONS (E) RIDE THE RING',ring:'MERIDIAN · OUTER DECK · TRANSIT PYLONS (E) RIDE THE RING',"
    "plat1:'MERIDIAN · LANDING PLATFORM 1',plat2:'MERIDIAN · LANDING PLATFORM 2',plat3:'MERIDIAN · LANDING PLATFORM 3',plat4:'MERIDIAN · LANDING PLATFORM 4',"
    "hang1:'MERIDIAN · HANGAR H1',hang2:'MERIDIAN · HANGAR H2',hang3:'MERIDIAN · HANGAR H3',hang4:'MERIDIAN · HANGAR H4',hang5:'MERIDIAN · HANGAR H5',hang6:'MERIDIAN · HANGAR H6',")
rep("const HTN={w:'WEAPONS · HOLLIS',", "const HTN={tr:'TRANSIT',w:'WEAPONS · HOLLIS',")
rep("if(!on||d<q.r||d>140||!near.includes(HPZ[q.k])){el.hidden=true;return}", "if(!on||d<q.r||d>(q.k==='tr'?260:140)||!(q.k==='tr'?!['hall','armoury','outfitter','hangar'].includes(zn):near.includes(HPZ[q.k]))){el.hidden=true;return}")
rep("el.textContent=HTN[q.k]+' · '+Math.round(d)+' M'}})}", "el.textContent=(q.k==='tr'?'TRANSIT · '+q.name:HTN[q.k])+' · '+Math.round(d)+' M'}})}")
s2 = "  else movePlayer((-sn*f+cs*s)*sp,vy*dt,(-cs*f-sn*s)*sp);"
assert s.count(s2)==1
s = s.replace(s2, s2+"if(HUB.on)try{meriWalk()}catch(e){}")
rep("function hubLaunch(){if(!HUB.on)return;", "function hubLaunch(){if(!HUB.on)return;hubPromptOff();")
open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))
