p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
# ---------- open staircase: thin treads, stringers and handrails drawn; the step collision stays exactly where the treads are
rep("""function stairs(x,z,dx,dz,width,top,base=0){for(let i=0;;i++){const h=top-0.25*(i+1);if(h<=base+0.01)break;const o=(i+0.5)*0.6;
  box(x+dx*o,base,z+dz*o,dx?0.6:width,h-base,dz?0.6:width,MAT.metal)}}""",
"""function stairs(x,z,dx,dz,width,top,base=0){let n=0;for(let i=0;;i++){const h=top-0.25*(i+1);if(h<=base+0.01)break;const o=(i+0.5)*0.6,cx=x+dx*o,cz=z+dz*o,w=dx?0.6:width,d=dz?0.6:width;
    boxes.push({lo:[cx-w/2,base,cz-d/2],hi:[cx+w/2,h,cz+d/2]});box(cx,h-.08,cz,w*.98,.08,d*.98,MAT.metal,false);box(cx+(dx?-dx*.25:0),h-.16,cz+(dz?-dz*.25:0),dx?.05:width*.98,.08,dz?.05:width*.98,MAT.amber,false);n++}
  if(!n)return;const L=n*.6,rise=top-base,ang=Math.atan2(rise,L),len=Math.hypot(rise,L),mx=x+dx*L/2,mz=z+dz*L/2,my=base+rise/2;
  for(const s of[-1,1]){const ox=dz?s*(width/2+.05):0,oz=dx?s*(width/2+.05):0;
    blob(GEO.box,MAT.armorD,dx?len:.12,.32,dz?len:.12,mx+ox,my-.25,mz+oz,0);
    {const g=GEO.box.clone();g.applyMatrix4(M4.compose(new T.Vector3(mx+ox,my-.25,mz+oz),new T.Quaternion().setFromEuler(new T.Euler(dz?-dz*ang:0,0,dx?dx*ang:0)),new T.Vector3(dx?len:.12,.32,dz?len:.12)));addGeo(MAT.armorD,g);bucket.get(MAT.armorD).splice(-2,1)}
    {const g=GEO.box.clone();g.applyMatrix4(M4.compose(new T.Vector3(mx+ox,my+.85,mz+oz),new T.Quaternion().setFromEuler(new T.Euler(dz?-dz*ang:0,0,dx?dx*ang:0)),new T.Vector3(dx?len:.06,.06,dz?len:.06)));addGeo(MAT.metal,g)}
    for(let i=0;i<n;i+=4){const o=(i+.5)*.6,h=top-.25*(i+1);box(x+dx*o+ox,h,z+dz*o+oz,.05,.95,.05,MAT.metal,false)}}}""")
# ---------- farm catwalks become railed bridges between balconies; the hangar booth becomes a real room
rep("floorBox((r.x0+r.x1)/2,8,(r.z0+r.z1)/2,r.x1-r.x0,.4,4);stairs(r.x0+4,(r.z0+r.z1)/2+5,0,1,3.5,8.4);",
    """floorBox((r.x0+r.x1)/2,8,(r.z0+r.z1)/2,r.x1-r.x0,.4,4);stairs(r.x0+4,(r.z0+r.z1)/2+5,0,1,3.5,8.4);
   for(const sz of[-1,1]){box((r.x0+r.x1)/2,8.4,(r.z0+r.z1)/2+sz*2,r.x1-r.x0,.06,.06,MAT.metal,false);box((r.x0+r.x1)/2,9.3,(r.z0+r.z1)/2+sz*2,r.x1-r.x0,.06,.06,TRIM.g,false);
     for(let x=r.x0+2;x<r.x1;x+=4)box(x,8.4,(r.z0+r.z1)/2+sz*2,.05,.95,.05,MAT.metal,false)}
   floorBox(r.x1-5,8,(r.z0+r.z1)/2,10,.4,12);box(r.x1-2,8.4,(r.z0+r.z1)/2,1.4,1.1,3,MAT.armorD);box(r.x1-2.75,9.5,(r.z0+r.z1)/2,.05,.7,2.6,TRIM.g,false);""")
rep("floorBox((r.x0+r.x1)/2,8,(r.z0+r.z1)/2,4,.4,r.z1-r.z0);stairs((r.x0+r.x1)/2,r.z1-4,0,-1,3.5,8.4)}",
    """floorBox((r.x0+r.x1)/2,8,(r.z0+r.z1)/2,4,.4,r.z1-r.z0);stairs((r.x0+r.x1)/2,r.z1-4,0,-1,3.5,8.4);
   for(const sx of[-1,1]){box((r.x0+r.x1)/2+sx*2,8.4,(r.z0+r.z1)/2,.06,.06,r.z1-r.z0,MAT.metal,false);box((r.x0+r.x1)/2+sx*2,9.3,(r.z0+r.z1)/2,.06,.06,r.z1-r.z0,TRIM.g,false);
     for(let z=r.z0+2;z<r.z1;z+=4)box((r.x0+r.x1)/2+sx*2,8.4,z,.05,.95,.05,MAT.metal,false)}
   floorBox((r.x0+r.x1)/2,8,r.z0+6,14,.4,10);box((r.x0+r.x1)/2,8.4,r.z0+2,4,1.1,1.2,MAT.armorD);box((r.x0+r.x1)/2,9.5,r.z0+2.65,3.4,.7,.05,TRIM.g,false)}""")
rep("floorBox(r.x0+10,8,170,18,.5,30);box(r.x0+10,8.5,170,18,4,30,MAT.glass);stairs(r.x0+21,186,0,-1,4,8.5);",
    """floorBox(r.x0+10,8,170,18,.5,30);stairs(r.x0+21,186,0,-1,4,8.5);
   {const bx=r.x0+10;box(bx,8.5,155.2,18,3.6,.2,MAT.pane);box(bx+8.9,8.5,165,.2,3.6,19,MAT.pane);box(bx+8.9,8.5,181.5,.2,3.6,6,MAT.pane);box(bx,12.1,170,18.4,.3,30.4,MAT.armorD,false);
    box(bx-8.9,8.5,170,.2,3.6,30,MAT.armorD);for(let i=0;i<4;i++){box(bx-4+i*.1,8.5,158+i*6,3,1,1.2,MAT.armorD);box(bx-4,9.6,158.6+i*6,2.6,.7,.05,TRIM.r,false)}
    box(bx,12,170,16,.1,.6,MAT.strip,false);GLOWS.push([bx,11,170,0xffc0b0,8,.2])}""")
# ---------- interiors: cut the sky's reflection on indoor materials so roofed rooms stop glowing pale
rep("flush();\n// drifting dust","flush();\nscene.traverse(o=>{if(o.isMesh&&o.material&&o.material.isMeshStandardMaterial&&o.material!==MAT.water)o.material.envMapIntensity=.28});\n// drifting dust")
open(p,'w').write(s);print('ok')
