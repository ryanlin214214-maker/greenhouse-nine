p='/home/user/greenhouse-nine/index.html'
s=open(p).read()
def rep(a,b):
  global s
  assert s.count(a)==1,(s.count(a),a[:90]); s=s.replace(a,b)
rep("box(cx,0,cz,12,r.h,12,MAT.hull);for(const y of[4,9,14,19])deco(GEO.tor,MAT.strip,9,9,9,cx,y,cz,1.571,0,0);","box(cx,0,cz,12,r.h,12,MAT.hull);")
anchor="    for(const z of[r.z0+4,r.z1-4])box(cx,12,z,r.x1-r.x0-8,.3,1.4,MAT.metal,false)}\n"
rep(anchor,anchor+r"""  // ENGINEERING set pieces: the reactor dressed as a machine (plinth, buttresses, containment bands, coolant pipes, slit windows),
  // generator and tank detail, heat exchangers on cradles, pipe banks on the walls, cable trays with lamps
  {const r=R['ENGINEERING'],cx=(r.x0+r.x1)/2,cz=(r.z0+r.z1)/2,SB=(x,y,z,w,h,d)=>boxes.push({lo:[x-w/2,y,z-d/2],hi:[x+w/2,y+h,z+d/2]});
    box(cx,0,cz,16,1.2,16,MAT.armorD);for(const o of[-1,1]){box(cx,1.2,cz+o*7.98,16,.08,.06,TRIM.a,false);box(cx+o*7.98,1.2,cz,.06,.08,16,TRIM.a,false)}
    for(const sx of[-1,1])for(const sz of[-1,1]){box(cx+sx*6.4,1.2,cz+sz*6.4,1.6,r.h-1.2,1.6,MAT.metal);for(const y of[2,8,14,20])box(cx+sx*6.4,y,cz+sz*6.4,1.9,.4,1.9,MAT.armorD,false)}
    for(const y of[3,7.5,12,16.5,21])for(const o of[-1,1]){box(cx,y,cz+o*6.25,12.4,.9,.5,MAT.armorD,false);box(cx+o*6.25,y,cz,.5,.9,12.4,MAT.armorD,false);box(cx,y+.38,cz+o*6.52,11,.1,.04,TRIM.o,false);box(cx+o*6.52,y+.38,cz,.04,.1,11,TRIM.o,false)}
    for(let f=0;f<4;f++){const nx=[0,1,0,-1][f],nz=[1,0,-1,0][f],tx=-nz,tz=nx;
      for(const t of[-3.6,3.6]){deco(GEO.cyl,MAT.gun,.36,r.h-1.2,.36,cx+nx*6.9+tx*t,1.2+(r.h-1.2)/2,cz+nz*6.9+tz*t);for(const y of[4.5,10,15,19.5])deco(GEO.cyl,MAT.gunD,.44,.3,.44,cx+nx*6.9+tx*t,y,cz+nz*6.9+tz*t)}
      for(const t of[-1.6,0,1.6]){box(cx+nx*6.03+tx*t,4,cz+nz*6.03+tz*t,Math.abs(tx)*.16+Math.abs(nx)*.04,3,Math.abs(tz)*.16+Math.abs(nz)*.04,TRIM.c,false);box(cx+nx*6.03+tx*t,8.6,cz+nz*6.03+tz*t,Math.abs(tx)*.16+Math.abs(nx)*.04,3,Math.abs(tz)*.16+Math.abs(nz)*.04,TRIM.c,false);box(cx+nx*6.03+tx*t,13.1,cz+nz*6.03+tz*t,Math.abs(tx)*.16+Math.abs(nx)*.04,3,Math.abs(tz)*.16+Math.abs(nz)*.04,TRIM.c,false)}}
    box(cx,r.h-2.4,cz,14.4,2.4,14.4,MAT.armorD,false);
    // generators: ribbed housings, a flywheel drum on top, exhaust stacks and a side panel
    for(let i=0;i<6;i++){const x=r.x0+16+i*13,z=i%2?r.z0+26:r.z1-26;for(let k=-3;k<=3;k++)box(x,0,z+k*1.1,5.25,3.3,.14,MAT.metal,false);
      deco(GEO.cyl,MAT.gun,1.3,3.6,1.3,x,4.8,z+1.2,0,0,1.571);for(const e of[-1.85,1.85])deco(GEO.cyl,MAT.gunD,1.4,.2,1.4,x+e,4.8,z+1.2,0,0,1.571);box(x,3.6,z+1.2,3,.4,2.2,MAT.armorD,false);
      for(const o of[-1.4,1.4]){deco(GEO.cyl,MAT.gunD,.28,3.2,.28,x+o,5.2,z-2.8);deco(GEO.cyl,MAT.metal,.32,.2,.32,x+o,6.8,z-2.8)}
      box(x+2.62,1,z-1.5,.06,1.2,2,TRIM.c,false);box(x+2.62,.6,z+1.5,.06,.2,2.5,TRIM.a,false);deco(GEO.cyl,MAT.gunD,.2,3,.2,x-1.6,.2,z+5.3,1.571,0,0)}
    // coolant tanks: frame columns, bands, a valve wheel and a pipe to the wall
    for(const[x,z]of[[r.x0+8,r.z0+8],[r.x1-8,r.z0+8],[r.x0+8,r.z1-8],[r.x1-8,r.z1-8]]){SB(x,0,z,8,11.4,8);for(const ox of[-3.7,3.7])for(const oz of[-3.7,3.7])box(x+ox,0,z+oz,.5,11,.5,MAT.metal,false);
      for(const y of[.2,3.7,7.4])for(const o of[-1,1]){box(x,y,z+o*3.65,7.6,.35,.15,MAT.armorD,false);box(x+o*3.65,y,z,.15,.35,7.6,MAT.armorD,false)}
      deco(GEO.tor,MAT.gunD,.7,.7,.7,x,11.9,z,1.571,0,0);deco(GEO.cyl,MAT.gun,.4,8,.4,x,15.5,z);box(x,11.4,z,2,.5,2,MAT.armorD,false)}
    // heat exchangers on cradles
    for(const[x,z]of[[31,51],[87,51],[33,139],[85,139]]){SB(x,0,z,10.4,3.6,3.4);deco(GEO.cyl,MAT.gun,1.5,10,1.5,x,1.9,z,0,0,1.571);for(const e of[-5.05,5.05])deco(GEO.cyl,MAT.gunD,1.62,.3,1.62,x+e,1.9,z,0,0,1.571);
      for(let k=-3;k<=3;k++)deco(GEO.cyl,MAT.gunD,1.56,.14,1.56,x+k*1.35,1.9,z,0,0,1.571);for(const e of[-3.5,3.5])box(x+e,0,z,.8,1.1,3.2,MAT.armorD,false);
      for(const e of[-3,3]){deco(GEO.cyl,MAT.metal,.3,r.h-6,.3,x+e,3.4+(r.h-6)/2,z);deco(GEO.cyl,MAT.gunD,.38,.4,.38,x+e,3.5,z)}box(x,3.3,z,1.2,.4,.6,TRIM.a,false)}
    // pipe banks on the long walls, clear of the doors
    for(const[wx,o]of[[r.x1-.6,-1],[r.x0+.8,1]])for(const[z0,z1]of(o<0?[[45,145]]:[[45,90],[100,145]])){const L=z1-z0,zc=(z0+z1)/2;
      for(const[y,m,rr]of[[2.6,MAT.gun,.22],[3.2,MAT.gunD,.16],[3.8,MAT.metal,.28],[4.6,MAT.gunD,.12]])deco(GEO.cyl,m,rr,L,rr,wx+o*(rr-.1),y,zc,1.571,0,0);
      for(let z=z0+2;z<z1;z+=5)box(wx+o*.1,2.2,z,.5,2.8,.15,MAT.armorD,false);for(let z=z0+8;z<z1;z+=16){deco(GEO.tor,TRIM.r,.25,.25,.25,wx+o*.55,3.8,z,0,1.571,0);deco(GEO.cyl,MAT.gunD,.06,.5,.06,wx+o*.4,3.8,z,0,0,1.571)}}
    // cable trays across the room with hanging lamps (outside the catwalk ring)
    for(const z of[60,130]){deco(GEO.box,MAT.armorD,r.x1-r.x0-4,.25,1.2,cx,13,z);for(const o of[-.55,.55])deco(GEO.box,MAT.metal,r.x1-r.x0-4,.4,.08,cx,13.15,z+o);
      for(let x=r.x0+8;x<r.x1-4;x+=12){deco(GEO.cyl,MAT.metal,.03,r.h-13.2,.03,x,13+(r.h-13)/2,z);box(x,11.9,z,.5,.35,.9,MAT.armorD,false);box(x,11.86,z,.3,.05,.7,MAT.amber,false)}}}
""")
open(p,'w').write(s);print('ok')
