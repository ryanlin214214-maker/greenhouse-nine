p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:80]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]
# ---------- bug: a centre pushed inside a wall was lifted onto the wall top (above the roof); eject sideways instead
rep("if(d2<r*r){if(d2>1e-8){const d=Math.sqrt(d2),k=(r-d)/d;o.x+=dx*k;o.y+=dy*k;o.z+=dz*k}else o.y=b.hi[1]+r}}",
    "if(d2<r*r){if(d2>1e-8){const d=Math.sqrt(d2),k=(r-d)/d;o.x+=dx*k;o.y+=dy*k;o.z+=dz*k}else{let best=o.x-b.lo[0],ax=0;const c=[[b.hi[0]-o.x,1],[o.z-b.lo[2],2],[b.hi[2]-o.z,3]];if(b.hi[1]-o.y<1.2)c.push([b.hi[1]-o.y,4]);\n      for(const[v,k]of c)if(v<best){best=v;ax=k}if(ax===0)o.x=b.lo[0]-r;else if(ax===1)o.x=b.hi[0]+r;else if(ax===2)o.z=b.lo[2]-r;else if(ax===3)o.z=b.hi[2]+r;else o.y=b.hi[1]+r}}}")
# safety net: any machine outside a room, or above its room's ceiling, goes back to a valid spawn point
rep("    if(e.dying)continue;\n","    if(e.dying)continue;\n    if(e.type!==3&&e.type!==4){const rr=roomAt(e.pos.x,e.pos.z);if(!rr||e.pos.y>rr.h-0.4||!isFinite(e.pos.x+e.pos.y+e.pos.z)){const[x,z,r2]=spawnPos();e.pos.set(x,e.type>=5?1.5:Math.min(r2.h-3,7),z);e.vy=0}}\n")
# ---------- lighting: no more glare
rep("renderer.toneMappingExposure=1.3","renderer.toneMappingExposure=1.0")
rep("c.addPass(new T.UnrealBloomPass(new T.Vector2(z.x,z.y),0.5,0.55,0.8))","c.addPass(new T.UnrealBloomPass(new T.Vector2(z.x,z.y),0.32,0.5,0.88))")
rep("new T.HemisphereLight(0xb8dcff,0x3a5a64,0.85)","new T.HemisphereLight(0xb8dcff,0x2a3a40,0.6)")
rep("const sun=new T.DirectionalLight(0xffd9a8,1.5)","const sun=new T.DirectionalLight(0xffd9a8,1.1)")
rep("MAT.roof=std({color:0x1b2a2e,roughness:.7,metalness:.6});MAT.roof.userData.noShadow=true;","MAT.roof=std({color:0x161f22,roughness:.8,metalness:.5});")
rep("hull:paint(lowFx?256:512,(g,S)=>panels(g,S,'#5d8b93',2)),","hull:paint(lowFx?256:512,(g,S)=>panels(g,S,'#3b5056',2)),")
rep("floor:paint(lowFx?256:512,(g,S)=>{panels(g,S,'#3d5d5a',2);","floor:paint(lowFx?256:512,(g,S)=>{panels(g,S,'#2b3a3a',2);")
rep("MAT.strip=bas({color:0x8fe6ff});","MAT.strip=bas({color:0x5fb4c8});")
# ---------- the commons, rebuilt: shopfront blocks under the galleries, a food court, a lounge, kiosks and an arch over the atrium tree
between(" // COMMONS: an atrium tree"," // FARMS: hydroponic",""" // COMMONS: two-storey shopfronts under the galleries, a food court, a lounge, info kiosks and a ring arch over the atrium tree
 {const c=R['COMMONS'];
   MAT.tile=std({map:paint(512,(g,S)=>{g.fillStyle='#1f2a2c';g.fillRect(0,0,S,S);grime(g,S,2500,.06);for(let i=0;i<8;i++)for(let j=0;j<8;j++){g.fillStyle=(i+j)%2?'#253234':'#1b2527';g.fillRect(i*S/8+1,j*S/8+1,S/8-2,S/8-2)}
     g.strokeStyle='rgba(216,150,42,.35)';g.lineWidth=3;g.beginPath();g.arc(S/2,S/2,S*.42,0,7);g.stroke()}),roughness:.55,metalness:.35});MAT.tile.polygonOffset=true;MAT.tile.polygonOffsetFactor=-2;MAT.tile.polygonOffsetUnits=-2;MAT.tile.userData.noShadow=true;
   MAT.tile.map.repeat.set(1/6,1/6);box(0,0.01,0,212,.03,76,MAT.tile,false);
   MAT.wallD=std({map:paint(512,(g,S)=>panels(g,S,'#26363a',2)),roughness:.6,metalness:.5});MAT.inset=std({color:0x10181a,roughness:.9});MAT.skirt=std({color:0x0c1214,roughness:.8,metalness:.4});
   // wall dressing: dark upper paneling with inset frames and vertical ribs, a skirting band
   for(const sz of[-1,1]){const z=sz*38.9;box(0,0,z,214,.9,.3,MAT.skirt,false);for(let x=-100;x<=100;x+=12){box(x,9,z,10,15,.25,MAT.wallD,false);box(x,10,z-sz*.14,8,12,.05,MAT.inset,false);box(x+6,8,z,.6,18,.5,MAT.armorD,false)}}
   for(const sx of[-1,1]){const x=sx*106.9;box(x,0,0,.3,.9,78,MAT.skirt,false);for(let z=-30;z<=30;z+=12){box(x,3,z,.25,20,10,MAT.wallD,false);box(x-sx*.14,4,z,.05,17,8,MAT.inset,false);box(x,2,z+6,.5,22,.6,MAT.armorD,false)}}
   // two-storey shop blocks along both long walls, galleries on top
   for(const sz of[-1,1]){floorBox(0,7,sz*34,214,.5,10);box(0,7.5,sz*29,214,.12,.12,TRIM.a,false);for(let x=-100;x<=100;x+=4)box(x,7.5,sz*29.1,.1,1.1,.1,MAT.metal,false);box(0,8.6,sz*29.1,214,.1,.1,MAT.metal,false);
     for(const[x0,x1]of[[-105,-66],[-54,-8],[8,54],[66,105]]){const xm=(x0+x1)/2,w=x1-x0;box(xm,0,sz*35,w,7,8,MAT.wallD);
       for(let x=x0+4;x<x1-3;x+=9){box(x+1,0,sz*30.95,7,.15,.2,MAT.skirt,false);box(x+1,1,sz*30.94,6,3.6,.06,MAT.pane,false);box(x+1,1,sz*31.1,6,3.6,.05,MAT.win,false);box(x+1,5.2,sz*30.7,7.4,.25,1,TRIM.a,false);box(x+1,5.6,sz*30.9,5,.9,.1,MAT.inset,false);box(x-3.4,0,sz*30.9,.4,7,.4,MAT.armorD,false)}}
     for(const sx of[-1,1])stairs(sx*60,sz*22,0,sz,5,7.5)}
   // the atrium: planter with trees, a ring bench, a shallow pool and a steel ring arch
   box(0,0,0,14,1.2,14,MAT.soil);box(0,1.1,0,14.4,.2,14.4,MAT.metal,false);tree(0,0,900,1.2);tree(-3.5,3,901,1.2);tree(3.5,-3,902,1.2);
   for(let i=0;i<12;i++){const a=i/12*6.283;box(Math.cos(a)*10.5,0,Math.sin(a)*10.5,2.4,.5,.9,MAT.armorD)}box(0,0.02,0,26,.05,26,MAT.water,false);
   deco(new T.TorusGeometry(13,.5,8,48,Math.PI),MAT.armorD,1,1,1,0,0,0,0,0,0);deco(new T.TorusGeometry(13,.12,6,48,Math.PI),TRIM.a,1,1,1,0,0,.6,0,0,0);
   deco(new T.TorusGeometry(13,.5,8,48,Math.PI),MAT.armorD,1,1,1,0,0,0,0,1.571,0);
   // columns: dark, with trim bands and splayed capitals
   for(const sx of[-1,1])for(const sz of[-1,1]){const x=sx*40,z=sz*15;box(x,0,z,2,26,2,MAT.wallD);box(x,0,z,2.6,1,2.6,MAT.skirt);deco(GEO.hex,TRIM.a,1.3,.15,1.3,x,4,z);deco(GEO.hex,TRIM.a,1.3,.15,1.3,x,20,z);for(const o of[-1,1])deco(GEO.box,MAT.armorD,.5,8,.5,x+o*1.3,22,z,0,0,o*.5)}
   // food court (west): counters and tables with stools
   box(-80,0,-14,22,1.1,3,MAT.armorD);box(-80,1.1,-14,22.4,.12,3.4,MAT.metal,false);box(-80,2.6,-15.4,22,.08,.08,TRIM.o,false);
   for(let i=0;i<9;i++){const x=-96+(i%3)*14,z=-2+Math.floor(i/3)*10;box(x,0,z,2.6,.9,2.6,MAT.metal);for(let k=0;k<4;k++){const a=k*1.571+.785;box(x+Math.cos(a)*2,0,z+Math.sin(a)*2,.6,.5,.6,MAT.armorD,false)}GLOWS.push([x,8,z,0xffc070,3,.18])}
   // lounge (east): low sofas, planters and a holo-model of Europa
   for(let i=0;i<6;i++){const x=58+(i%3)*14,z=-6+Math.floor(i/3)*14;box(x,0,z,5,.6,1.6,MAT.shieldA||MAT.armorD);box(x,.6,z-.7,5,.7,.3,MAT.armorD,false);planter(x+5,0,z+3,1.6,1.6)}
   {const hz=mesh(GEO.sph,bas({color:0xd8d0c0,transparent:true,opacity:.5}),1.6,1.6,1.6,80,3.5,22);scene.add(hz);box(80,0,22,2,1.4,2,MAT.armorD);GLOWS.push([80,3.5,22,0x9fe6ff,4,.25])}
   // info kiosks around the plaza
   for(const[x,z]of[[-24,-20],[24,-20],[-24,20],[24,20]]){box(x,0,z,1,2.2,.5,MAT.armorD);box(x,1.3,z+.27,.8,.7,.03,TRIM.c,false)}
   for(let i=0;i<4;i++)box(-30+i*20,0,-24+(i%2)*48,2.4,1.4,2.4,i%2?MAT.crateA:MAT.crateB);GLOWS.push([0,22,0,0xffd9a0,18,.15])}
""")
open(p,'w').write(s);print('ok')
