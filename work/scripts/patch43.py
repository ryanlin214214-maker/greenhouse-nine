p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def between(a,b,new):
    global s
    assert s.count(a)==1 and s.count(b)==1,(s.count(a),s.count(b),a[:60]);i=s.index(a);j=s.index(b);assert i<j;s=s[:i]+new+s[j:]
between("// HABITAT: a grid of crew cabins along narrow corridors","// ENGINEERING: the reactor column","""// HABITAT: a main corridor from the commons to the hangar and a cross corridor to the aft spine. Each cabin has one door, onto the
 // main corridor; behind each row of cabins is a crew lounge that opens onto the cross corridor. No room leads into another room.
 {const r=R['HABITAT'],h=r.h,D=(z)=>[z,5,6,'v'];
   for(const x of[-65.5,-53.5])wall('x',x,r.z0,r.z1,h,[D(49),D(65),D(81),[95,8,6,'v'],D(109),D(125),D(141)]);
   for(const z of[90,100]){wall('z',z,r.x0,-66.5,h,[[-97,6,6,'v']]);wall('z',z,-52.5,r.x1,h,[[-21,6,6,'v']])}
   for(const[z0,z1]of[[r.z0,89],[101,r.z1]]){wall('x',-87,z0,z1,h);wall('x',-32,z0,z1,h)}
   for(const z of[57,73,117,133]){wall('z',z,-86,-66.5,h);wall('z',z,-52.5,-33,h)}
   // cabins: a bunk against the back wall and a locker; lounges: a long table with benches
   for(const zc of[49,65,81,109,125,141])for(const sx of[-1,1]){const xb=sx<0?-84.2:-34.8,xl=sx<0?-70:-49;
     box(xb,0,zc,2.4,.8,5,MAT.armorD);box(xb,1.6,zc,2.4,.15,5,MAT.metal,false);box(xl,0,zc+(zc<95?5.5:-5.5),2,2.2,.8,MAT.metal);box(xl,2.3,zc+(zc<95?5.1:-5.1),1.6,.05,.05,TRIM.v,false)}
   for(const zc of[65,125])for(const xc of[-97.5,-21]){box(xc,0,zc,3,1,14,MAT.armorD);box(xc,1,zc,3.4,.1,14.4,MAT.metal,false);for(const o of[-1,1])box(xc+o*3,0,zc,1,.6,12,MAT.metal)}}
 """)
between("// HABITAT: lockers along the corridors, ceiling ducts, door number plates","// BRIDGE: a holo-table of the station","""// HABITAT: ceiling ducts along both corridors
  {const r=R['HABITAT'];for(const o of[-1,1]){deco(GEO.cyl,MAT.armorD,.4,r.z1-r.z0,.4,-59.5+o*3.6,r.h-1,(r.z0+r.z1)/2,1.571,0,0);deco(GEO.cyl,MAT.armorD,.4,r.x1-r.x0,.4,(r.x0+r.x1)/2,r.h-1,95+o*2.8,0,0,1.571)}}
  """)
open(p,'w').write(s);print('ok')
