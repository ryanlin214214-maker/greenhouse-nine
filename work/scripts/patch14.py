p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:80]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]
between("function rayBoxes(o,d,max){let best=max;","\n\n","""// spatial grid over the collision boxes (XZ cells), rebuilt whenever boxes are added
const GC=12,EMPTY=[];let GRID=null,gridN=-1,stamp=0;
function grid(){if(gridN===boxes.length)return GRID;GRID=new Map();for(const b of boxes){b.s=0;
    for(let ix=Math.floor(b.lo[0]/GC);ix<=Math.floor(b.hi[0]/GC);ix++)for(let iz=Math.floor(b.lo[2]/GC);iz<=Math.floor(b.hi[2]/GC);iz++){const k=(ix+4096)*8192+iz+4096;let c=GRID.get(k);if(!c)GRID.set(k,c=[]);c.push(b)}}
  gridN=boxes.length;return GRID}
function cell(ix,iz){return grid().get((ix+4096)*8192+iz+4096)||EMPTY}
function nearList(x0,z0,x1,z1){grid();const st=++stamp,out=[];for(let ix=Math.floor(x0/GC);ix<=Math.floor(x1/GC);ix++)for(let iz=Math.floor(z0/GC);iz<=Math.floor(z1/GC);iz++)for(const b of cell(ix,iz))if(b.s!==st){b.s=st;out.push(b)}return out}
function rayBoxes(o,d,max){let best=max;grid();const st=++stamp;
  let ix=Math.floor(o[0]/GC),iz=Math.floor(o[2]/GC);const sx=d[0]>0?1:-1,sz=d[2]>0?1:-1,ax=Math.abs(d[0]),az=Math.abs(d[2]);
  const tdx=ax<1e-9?Infinity:GC/ax,tdz=az<1e-9?Infinity:GC/az;
  let tx=ax<1e-9?Infinity:(sx>0?(ix+1)*GC-o[0]:o[0]-ix*GC)/ax,tz=az<1e-9?Infinity:(sz>0?(iz+1)*GC-o[2]:o[2]-iz*GC)/az;
  for(let n=0;n<5000;n++){
    for(const b of cell(ix,iz)){if(b.s===st)continue;b.s=st;let t0=0,t1=best,ok=true;
      for(let a=0;a<3;a++){if(Math.abs(d[a])<1e-9){if(o[a]<b.lo[a]||o[a]>b.hi[a]){ok=false;break}}
        else{let nn=(b.lo[a]-o[a])/d[a],f=(b.hi[a]-o[a])/d[a];if(nn>f){const q=nn;nn=f;f=q}if(nn>t0)t0=nn;if(f<t1)t1=f;if(t0>t1){ok=false;break}}}
      if(ok)best=t0}
    const tn=Math.min(tx,tz);if(tn>=best)break;if(tx<tz){ix+=sx;tx+=tdx}else{iz+=sz;tz+=tdz}}
  if(d[1]<0){const t=-o[1]/d[1];if(t>=0&&t<best)best=t}
  return best}
function los(a,b){const d=[b.x-a.x,b.y-a.y,b.z-a.z],l=Math.hypot(d[0],d[1],d[2]);if(l<0.01)return true;
  d[0]/=l;d[1]/=l;d[2]/=l;return rayBoxes([a.x,a.y,a.z],d,l)>=l-0.01}
function inBox(x,y,z){for(const b of cell(Math.floor(x/GC),Math.floor(z/GC)))if(x>b.lo[0]&&x<b.hi[0]&&y>b.lo[1]&&y<b.hi[1]&&z>b.lo[2]&&z<b.hi[2])return true;return false}
function groundAt(x,z,y){let g=0;for(const b of cell(Math.floor(x/GC),Math.floor(z/GC)))if(x>b.lo[0]&&x<b.hi[0]&&z>b.lo[2]&&z<b.hi[2]&&b.hi[1]<=y+0.5&&(b.hi[1]<=3.1||(b.hi[1]<=4.6&&Math.min(b.hi[0]-b.lo[0],b.hi[2]-b.lo[2])>=7))&&b.hi[1]>g)g=b.hi[1];return g}
function pushOut(o,r,free){for(const b of nearList(o.x-r,o.z-r,o.x+r,o.z+r)){
    const cx=Math.max(b.lo[0],Math.min(o.x,b.hi[0])),cy=Math.max(b.lo[1],Math.min(o.y,b.hi[1])),cz=Math.max(b.lo[2],Math.min(o.z,b.hi[2]));
    const dx=o.x-cx,dy=o.y-cy,dz=o.z-cz,d2=dx*dx+dy*dy+dz*dz;
    if(d2<r*r){if(d2>1e-8){const d=Math.sqrt(d2),k=(r-d)/d;o.x+=dx*k;o.y+=dy*k;o.z+=dz*k}else o.y=b.hi[1]+r}}
  if(free)return;if(o.y<r)o.y=r;const L=A-0.1-r;o.x=Math.max(-L,Math.min(L,o.x));o.z=Math.max(-L,Math.min(L,o.z))}""")
rep("  if(dx){pos.x+=dx;for(const b of boxes)if(overlaps(b))","  const nb=nearList(pos.x-Math.abs(dx)-1,pos.z-Math.abs(dz)-1,pos.x+Math.abs(dx)+1,pos.z+Math.abs(dz)+1);\n  if(dx){pos.x+=dx;for(const b of nb)if(overlaps(b))")
rep("  if(dz){pos.z+=dz;for(const b of boxes)if(overlaps(b))","  if(dz){pos.z+=dz;for(const b of nb)if(overlaps(b))")
rep("  for(const b of boxes)if(overlaps(b)){if(dy<=0)","  for(const b of nb)if(overlaps(b)){if(dy<=0)")
# automatic sprint: holding forward for a moment sprints, unless firing
rep("  const sp=(keys.ShiftLeft||keys.ShiftRight?9:6.2)*CLS[cls].spd*dt,","  sprintT=f>0.5&&!firing?sprintT+dt:0;const sp=(sprintT>0.35?9:6.2)*CLS[cls].spd*dt,")
rep("let cls=0,","let sprintT=0,cls=0,")
rep("WASD move · Shift sprint · Space jump","WASD move (you sprint automatically) · Space jump")
open(p,'w').write(s);print('ok')
