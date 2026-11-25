import sys
src,dst=sys.argv[1],sys.argv[2]
s=open(src).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]);s=s.replace(a,b)
# nothing decorative may sit in a doorway: every doorway is recorded when its wall is built; a non-solid box that
# runs through an opening below head height is cut into the parts either side of it, any other decoration there is skipped
rep("function box(x,y,z,w,h,d,mat,solid=true){",
"""const DOORV=[],DOORLOG=[];let WALLB=0;
function doorAt(x0,y0,z0,x1,y1,z1){if(y1<=.12)return null;for(const D of DOORV){const u0=D.ax==='x'?z0:x0,u1=D.ax==='x'?z1:x1,w0=D.ax==='x'?x0:z0,w1=D.ax==='x'?x1:z1;
  if(u1>D.dc-D.dw/2+.15&&u0<D.dc+D.dw/2-.15&&w1>D.c-1.7&&w0<D.c+1.7&&y1<=D.dh+.05&&y0<D.dh-.3)return D}return null}
function box(x,y,z,w,h,d,mat,solid=true){
  if(!solid&&!WALLB&&DOORV.length){const D=doorAt(x-w/2,y,z-d/2,x+w/2,y+h,z+d/2);if(D){DOORLOG.push([x,y,z,w,h,d,mat&&mat.name||'']);const lo=D.dc-D.dw/2,hi=D.dc+D.dw/2;
    if(D.ax==='x'){const a=z-d/2,b=z+d/2;if(lo-a>.05)box(x,y,(a+lo)/2,w,h,lo-a,mat,false);if(b-hi>.05)box(x,y,(hi+b)/2,w,h,b-hi,mat,false)}
    else{const a=x-w/2,b=x+w/2;if(lo-a>.05)box((a+lo)/2,y,z,lo-a,h,d,mat,false);if(b-hi>.05)box((hi+b)/2,y,z,b-hi,h,d,mat,false)}return}}""")
rep("{const deco=(geo,mat,sx,sy,sz,x,y,z,rx=0,ry=0,rz=0)=>{const g=geo.clone();g.applyMatrix4(M4.compose(new T.Vector3(x,y,z),new T.Quaternion().setFromEuler(new T.Euler(rx,ry,rz)),new T.Vector3(sx,sy,sz)));addGeo(mat,g)};",
    "{const deco=(geo,mat,sx,sy,sz,x,y,z,rx=0,ry=0,rz=0)=>{const g=geo.clone();g.applyMatrix4(M4.compose(new T.Vector3(x,y,z),new T.Quaternion().setFromEuler(new T.Euler(rx,ry,rz)),new T.Vector3(sx,sy,sz)));"
    "if(!WALLB&&DOORV.length){g.computeBoundingBox();const b=g.boundingBox;if(doorAt(b.min.x,b.min.y,b.min.z,b.max.x,b.max.y,b.max.z)){DOORLOG.push(['deco',x,y,z]);g.dispose();return}}addGeo(mat,g)};")
rep("function wall(ax,c,a0,a1,h,doors=[]){let s=a0;","function wall(ax,c,a0,a1,h,doors=[]){let s=a0;WALLB=1;for(const[dc,dw,dh]of doors)DOORV.push({ax,c,dc,dw,dh});")
rep("   seg(ax,c,s,a1,0,h);band(s===a0?a0:s+1.6,a1)}","   seg(ax,c,s,a1,0,h);band(s===a0?a0:s+1.6,a1);WALLB=0}")
open(dst,'w').write(s);print('ok',len(s))
s=open(dst).read()
# hangar back-wall storage racks: skip any rack that would stand in front of a doorway (it was solid and blocked the door)
rep("for(const sx of[-1,1])for(let k=0;k<6;k++){const x=sx*(20+k*12),z=r.z0+2.6,w=10;SB(x,0,z,w,6.4,4);",
    "for(const sx of[-1,1])for(let k=0;k<6;k++){const x=sx*(20+k*12),z=r.z0+2.6,w=10;if(doorAt(x-w/2,0,z-2,x+w/2,6.4,z+2))continue;SB(x,0,z,w,6.4,4);")
open(dst,'w').write(s);print('ok-racks')
