p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
rep("for(let z=r.z0+12;z<r.z1-6;z+=22){box(-3.6,0,z,2.4,1.4,3,MAT.crateB);box(3.6,0,z+11,2.4,1.4,3,MAT.crateA)}}","for(let z=r.z0+12;z<r.z1-6;z+=22){box(-3.6,0,z,2.4,1.4,3,MAT.crateB);if(z+11<r.z1-6)box(3.6,0,z+11,2.4,1.4,3,MAT.crateA)}}")
rep("const mkLin=(mo,tag,sub,rx,ry)=>{const t=linerTex(mo,tag,sub);t.repeat.set(rx,ry);return std({map:t,roughness:.5,metalness:.25})};","const mkLin=(mo,tag,sub,rx,ry)=>{const t=linerTex(mo,tag,sub);t.repeat.set(rx,ry);return std({map:t,roughness:mo?.6:.75,metalness:.15})};")
rep("  // HANGAR: landing pads, fuel lines, tool carts, crew lockers, overhead light bars","""  // COMMONS: an arcade of rounded bulkhead arches along both edges of the atrium well, walkways under the galleries
  {const sh=new T.Shape(),W=5,Hh=4.6,iw=4,ih=3.9,rd=1.2;sh.moveTo(-W,0);sh.lineTo(-W,Hh);sh.lineTo(W,Hh);sh.lineTo(W,0);sh.lineTo(iw,0);sh.lineTo(iw,ih-rd);sh.quadraticCurveTo(iw,ih,iw-rd,ih);sh.lineTo(-iw+rd,ih);sh.quadraticCurveTo(-iw,ih,-iw,ih-rd);sh.lineTo(-iw,0);sh.lineTo(-W,0);
    for(const sz of[-1,1]){const z=sz*15.7;
      for(let x=-40;x<=40;x+=10){const g=new T.ExtrudeGeometry(sh,{depth:.9,bevelEnabled:false,curveSegments:8});g.translate(x,0,z-.45);addGeo(MAT.ringD,g);box(x,3.82,z,5,.06,.5,MAT.stripA,false)}
      for(let x=-45;x<=45;x+=10){boxes.push({lo:[x-1,0,z-.45],hi:[x+1,4.6,z+.45]});for(const o of[-1,1])box(x+o*1.03,.7,z,.06,2.2,.4,MAT.barO,false);box(x,0,z,2.3,.45,1.3,MAT.roofB,false)}
      box(0,.035,sz*27,96,.02,3,MAT.laneA,false);for(const o of[-1,1])box(0,.04,sz*27+o*1.5,96,.02,.1,TRIM.a,false);
      box(0,.035,sz*28,3,.02,20,MAT.laneA,false);for(const o of[-1,1])box(o*1.5,.04,sz*28,.1,.02,20,TRIM.a,false)}}
  // HANGAR: landing pads, fuel lines, tool carts, crew lockers, overhead light bars""")
open(p,'w').write(s);print('ok')
