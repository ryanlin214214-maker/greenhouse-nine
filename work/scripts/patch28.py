p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
rep("""window.HABRING=g}\n}\nflush();\n// drifting dust""","""window.HABRING=g}
 // ---- interiors in the commons style: per-room tiled floors, dark paneled walls with insets, skirting, ribs and a trim band,
 // skipping doorways and hull windows (found by probing the collision boxes), plus room-specific props
 {const tileMat=(a,b,line,motif)=>{const m=std({map:paint(512,(g,S)=>{g.fillStyle=a;g.fillRect(0,0,S,S);grime(g,S,2500,.06);const n=motif==='grate'?16:8;
      for(let i=0;i<n;i++)for(let j=0;j<n;j++){g.fillStyle=(i+j)%2?b:a;g.fillRect(i*S/n+1,j*S/n+1,S/n-2,S/n-2);if(motif==='grate'){g.fillStyle='rgba(0,0,0,.35)';g.fillRect(i*S/n+3,j*S/n+S/n/2-1,S/n-6,2)}}
      g.strokeStyle=line;g.lineWidth=4;if(motif==='hazard'){for(let k=-S;k<S*2;k+=48){g.beginPath();g.moveTo(k,0);g.lineTo(k+S,S);g.stroke()}}else if(motif==='ring'){g.beginPath();g.arc(S/2,S/2,S*.4,0,7);g.stroke()}else g.strokeRect(8,8,S-16,S-16)}),roughness:.6,metalness:.35});
    m.map.repeat.set(1/6,1/6);m.polygonOffset=true;m.polygonOffsetFactor=-2;m.polygonOffsetUnits=-2;m.userData.noShadow=true;return m};
  const FL={'BRIDGE':tileMat('#1a2428','#202c30','rgba(70,200,224,.35)','ring'),'PORT FARMS':tileMat('#1d2620','#222c24','rgba(92,207,106,.3)','grate'),'STARBOARD FARMS':tileMat('#1d2620','#222c24','rgba(92,207,106,.3)','grate'),
    'FORE SPINE':tileMat('#1b2326','#212b2e','rgba(70,200,224,.4)',''),'AFT SPINE':tileMat('#1b2326','#212b2e','rgba(216,150,42,.4)',''),'HABITAT':tileMat('#211d26','#28232e','rgba(154,106,224,.3)',''),
    'ENGINEERING':tileMat('#241e1a','#2b241f','rgba(224,112,42,.35)','grate'),'HANGAR':tileMat('#1c2022','#22272a','rgba(216,72,72,.35)','hazard')};
  const TR={'BRIDGE':TRIM.c,'PORT FARMS':TRIM.g,'STARBOARD FARMS':TRIM.g,'FORE SPINE':TRIM.c,'AFT SPINE':TRIM.a,'HABITAT':TRIM.v,'ENGINEERING':TRIM.o,'HANGAR':TRIM.r};
  const solidAt=(x,y,z)=>inBox(x,y,z);
  // find the wall face just outside a room edge, or null when there is an opening there
  const face=(x,z,nx,nz,y)=>{for(let d=0;d<=3;d+=.25){if(solidAt(x+nx*d,y,z+nz*d))return d}return null};
  for(const r of ROOMS){if(r.n==='COMMONS')continue;const fm=FL[r.n],tr=TR[r.n];if(fm)box((r.x0+r.x1)/2,.01,(r.z0+r.z1)/2,r.x1-r.x0,.03,r.z1-r.z0,fm,false);
    const sides=[['z',r.z0,0,-1,r.x0,r.x1],['z',r.z1,0,1,r.x0,r.x1],['x',r.x0,-1,0,r.z0,r.z1],['x',r.x1,1,0,r.z0,r.z1]];
    for(const[ax,c,nx,nz,a0,a1]of sides){const L=a1-a0,step=L>40?6:4;
      for(let a=a0+step/2;a<a1;a+=step){const x=ax==='z'?a:c,z=ax==='z'?c:a,d=face(x,z,nx,nz,1.5);if(d===null)continue;const fx=x+nx*(d-.12),fz=z+nz*(d-.12);
        const W=step-.5,bx=(w,h,y)=>ax==='z'?box(fx,y,fz,w,h,.22,null,false):box(fx,y,fz,.22,h,w,null,false);
        const B=(m,w,h,y,o=0)=>{if(ax==='z')box(fx,y,fz-nz*o,w,h,.2,m,false);else box(fx-nx*o,y,fz,.2,h,w,m,false)};
        B(MAT.skirt,W+.5,.8,0);B(MAT.wallD,W,1.9,.8);B(MAT.inset,W-.8,1.4,1.05,.1);B(tr,W+.5,.12,2.75);
        if(face(x,z,nx,nz,6)!==null&&r.h>9){const top=Math.min(r.h-2.5,16);B(MAT.wallD,W,top-3.2,3.1);B(MAT.inset,W-1,top-4.4,3.7,.1)}
        if(ax==='z')box(fx+step/2,0,fz,.5,Math.min(r.h-1,10),.45,MAT.armorD,false);else box(fx,0,fz+step/2,.45,Math.min(r.h-1,10),.5,MAT.armorD,false)}}}
  // HANGAR: landing pads, fuel lines, tool carts, crew lockers, overhead light bars
  {const r=R['HANGAR'];for(const[x,z]of[[-55,215],[55,215],[0,222]]){deco(new T.RingGeometry(6,6.6,40),TRIM.r,1,1,1,x,.05,z,-1.571,0,0);deco(new T.RingGeometry(8,8.3,40),MAT.mark,1,1,1,x,.05,z,-1.571,0,0)}
    for(let i=0;i<6;i++){const x=-90+i*36;deco(GEO.cyl,MAT.armorD,.25,30,.25,x,.25,230,1.571,0,0);box(x,0,203,2.4,1.1,1.4,MAT.armorD);box(x,1.1,203,2.2,.08,1.2,TRIM.r,false);box(x,0,210,.6,1.8,.6,MAT.metal)}
    for(let z=170;z<255;z+=17)box(0,r.h-2,z,160,.25,.6,MAT.strip,false)}
  // ENGINEERING: hazard floor around the reactor, consoles, cable trays, a gantry
  {const r=R['ENGINEERING'],cx=(r.x0+r.x1)/2,cz=(r.z0+r.z1)/2;box(cx,.03,cz,20,.04,20,FL['HANGAR'],false);
    for(let i=0;i<8;i++){const a=i/8*6.283;box(cx+Math.cos(a)*25,0,cz+Math.sin(a)*25,2.2,1.2,1,MAT.armorD);box(cx+Math.cos(a)*25,1.2,cz+Math.sin(a)*25,2,.5,.06,TRIM.o,false)}
    for(const z of[r.z0+4,r.z1-4])box(cx,12,z,r.x1-r.x0-8,.3,1.4,MAT.metal,false)}
  // HABITAT: lockers along the corridors, ceiling ducts, door number plates
  {const r=R['HABITAT'];for(let x=r.x0+8;x<r.x1;x+=16)for(let z=r.z0+4;z<r.z1;z+=27){box(x,0,z+12,.6,2.2,3,MAT.metal);box(x+.31,1.9,z+12,.02,.2,2.6,TRIM.v,false)}
    for(let z=r.z0+13;z<r.z1;z+=27)deco(GEO.cyl,MAT.armorD,.5,r.x1-r.x0,.5,(r.x0+r.x1)/2,r.h-1.2,z,0,0,1.571)}
  // BRIDGE: a holo-table of the station, rails on the tiers, a command chair
  {const r=R['BRIDGE'];deco(GEO.cyl,MAT.armorD,3,1,3,0,.5,r.z0+40);const hz=mesh(new T.IcosahedronGeometry(1.6,1),bas({color:0x8fe6ff,wireframe:true,transparent:true,opacity:.55}),1,1,1,0,3,r.z0+40);scene.add(hz);
    for(let i=0;i<3;i++)box(0,1.2*(i+1),r.z1-14-i*8+3.6,96-i*16,.08,.08,MAT.metal,false);box(0,3.6,r.z1-26,2,1.2,2,MAT.armorD);box(0,4.8,r.z1-25.2,2,1.6,.4,MAT.armorD)}
  // FARMS: irrigation pipes on the floor, misting nozzles on the ribs
  for(const n of['PORT FARMS','STARBOARD FARMS']){const r=R[n];for(let x=r.x0+6;x<r.x1;x+=12.5)deco(GEO.cyl,MAT.metal,.12,r.z1-r.z0-4,.12,x,.15,(r.z0+r.z1)/2,1.571,0,0)}
  // SPINES: hex wall plates and floor guide lines
  for(const n of['FORE SPINE','AFT SPINE']){const r=R[n];for(let z=r.z0+2;z<r.z1;z+=6){box(-.9,.03,z,.15,.04,3,TRIM[n==='FORE SPINE'?'c':'a'],false);box(.9,.03,z,.15,.04,3,TRIM[n==='FORE SPINE'?'c':'a'],false)}}
 }
}
flush();
// drifting dust""")
open(p,'w').write(s);print('ok')
