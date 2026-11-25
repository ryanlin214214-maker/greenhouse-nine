p='/home/user/greenhouse-nine/index.html'
s=open(p).read()
def rep(a,b):
  global s
  assert s.count(a)==1,(s.count(a),a[:90]); s=s.replace(a,b)
rep("for(const z of[r.z0+6,r.z1-6]){box(r.x0+5,0,z,6,10,6,MAT.glass);box(r.x0+5,10,z,6.6,.4,6.6,MAT.metal,false)}",
"for(const z of[r.z0+6,r.z1-6]){const x=r.x0+5;boxes.push({lo:[x-3,0,z-3],hi:[x+3,10,z+3]});deco(GEO.cyl,MAT.gun,2.8,9.6,2.8,x,4.8,z);deco(GEO.sph,MAT.gun,2.8,1,2.8,x,9.6,z);for(const y of[1.5,4.5,7.5])deco(GEO.cyl,MAT.gunD,2.9,.3,2.9,x,y,z);box(x,10,z,6.6,.4,6.6,MAT.metal,false)}")
anchor="  // ENGINEERING set pieces:"
NEW=r"""  // ---- set pieces for the commons, bridge, habitat, farms and spines (v61). Big pieces get one coarse solid box; nothing crosses a doorway
  {const SB=(x,y,z,w,h,d)=>boxes.push({lo:[x-w/2,y,z-d/2],hi:[x+w/2,y+h,z+d/2]});
    const fab=[0xd0702e,0x2f7d8a,0x8a3a4a,0xc9a23a].map(c=>std({color:c,roughness:.85,side:T.DoubleSide}));
    const scr=(t1,t2,col)=>bas({map:paint(256,(g,S)=>{g.fillStyle='#08161a';g.fillRect(0,0,S,S);g.strokeStyle=col;g.lineWidth=2;g.globalAlpha=.45;for(let i=0;i<7;i++){g.beginPath();g.moveTo(0,S*.5+i*14);for(let x=0;x<=S;x+=16)g.lineTo(x,S*.5+i*14+Math.sin(x*.05+i*1.3)*8);g.stroke()}
      g.globalAlpha=1;g.fillStyle=col;g.font='700 30px "Chakra Petch",sans-serif';g.fillText(t1,16,44);g.font='16px monospace';g.fillText(t2,16,74);g.strokeRect(5,5,S-10,S-10)})});
    const banner=(c,t)=>std({map:paint(256,(g,S)=>{g.fillStyle=c;g.fillRect(0,0,S,S);grime(g,S,800,.05);g.fillStyle='rgba(255,255,255,.85)';g.fillRect(S*.1,S*.06,S*.8,S*.02);g.fillRect(S*.1,S*.92,S*.8,S*.02);
      g.save();g.translate(S/2,S/2);g.rotate(-Math.PI/2);g.font='700 34px "Chakra Petch",sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(t,0,0);g.restore()}),roughness:.85,side:T.DoubleSide});
    const SCN=scr('EUROPA ORBITAL','SHIFT 3 · ALL DECKS','#6fe3ff'),SCA=scr('TACTICAL','THALASSA · MERIDIAN','#ffb238'),SCV=scr('VEND','HOT MEALS · 4 CR','#5ccf6a');
    // COMMONS west wing: a row of market stalls with canopies, goods and lamps
    for(let i=0;i<4;i++){const x=-100+i*10,z=-26,m=fab[i];SB(x,0,z,4.2,2.6,2.4);box(x,0,z,4,1.1,2,MAT.wallD,false);box(x,1.1,z,4.3,.08,2.3,MAT.metal,false);box(x,0,z+1.01,4,.25,.04,TRIM.a,false);
      for(const ox of[-2,2])for(const oz of[-1.1,1.1])box(x+ox,0,z+oz,.08,oz>0?2.7:3.1,.08,MAT.metal,false);deco(GEO.box,m,4.7,.05,2.9,x,2.95,z,-.14,0,0);for(const ox of[-2.35,2.35])deco(GEO.box,m,.05,.5,2.9,x+ox,2.7,z,-.14,0,0);
      for(let k=0;k<5;k++)deco(k%2?GEO.cyl:GEO.box,k%3?MAT.crateA:fab[(i+k)%4],.25+hash(k,i)*.15,.3+hash(i,k)*.25,.25,x-1.6+k*.8,1.3+hash(k,i+3)*.1,z+.2);
      deco(GEO.sph,MAT.amber,.12,.12,.12,x,2.55,z+.4);GLOWS.push([x,2.55,z+.4,0xffc070,2.4,.4])}
    // commons east wing: vending machines and a parked maintenance tram on its floor rail
    for(let i=0;i<4;i++){const x=60+i*6,z=-27;SB(x,0,z,2.1,2.6,1.2);box(x,0,z,2,2.5,1.1,MAT.armorD,false);box(x,.9,z+.56,1.5,1.4,.02,SCV,false);box(x,.3,z+.57,1.2,.3,.03,MAT.metal,false);box(x,2.5,z,2.1,.12,1.2,TRIM.c,false)}
    {const x=100;for(const o of[-.8,.8])box(x+o,0,0,.15,.08,60,MAT.metal,false);SB(x,0,0,3.4,3.6,15);box(x,.45,0,3.2,2.6,13,MAT.cap,false);box(x,3.05,0,2.4,.5,9,MAT.armorD,false);
      for(const o of[-1.61,1.61])box(x+o,1.6,0,.04,.8,11,MAT.pane,false);for(const o of[-1.62,1.62])box(x+o,1.1,0,.04,.12,13,TRIM.o,false);for(const e of[-1,1])deco(GEO.sph,MAT.cap,1.6,1.3,1.4,x,1.75,e*6.6);
      for(const z of[-5,-1.5,2,5.5])for(const o of[-1,1])deco(GEO.cyl,MAT.gunD,.4,.3,.4,x+o*1.2,.4,z,0,0,1.571);deco(GEO.box,MAT.metal,.08,2.6,.08,x,4.5,0)}
    // tall banners hanging in both wings
    {const B1=banner('#1f4a52','THALASSA'),B2=banner('#6a3426','NINE');for(const x of[-95,-80,-65,65,80,95])for(const z of[-10,10]){box(x,12.5,z,.05,10,3,(x+z)%3?B1:B2,false);box(x,22.6,z,.2,.2,3.4,MAT.metal,false);box(x,22.8,z,.05,3.2,.05,MAT.metal,false)}}
    // benches and recycler bins in the arcades under the tower
    for(const sz of[-1,1])for(const x of[-42,-18,18,42]){box(x,0,sz*28.6,3,.45,.8,MAT.armorD);box(x,.45,sz*29,3,.55,.12,MAT.armorD,false);deco(GEO.cyl,MAT.gun,.35,.9,.35,x+2.2,.45,sz*28.6);deco(GEO.cyl,TRIM.g,.36,.05,.36,x+2.2,.92,sz*28.6)}
    // BRIDGE: a ring of crew consoles round the holo-table, locker banks, two tactical screens, hanging monitors
    {const r=R['BRIDGE'],hz=r.z0+40;for(let k=0;k<8;k++){const a=(k+.5)*Math.PI/4,x=Math.sin(a)*11,z=hz+Math.cos(a)*11;SB(x,0,z,2.4,1,2.4);deco(GEO.box,MAT.armorD,2.6,1,1.3,x,.5,z,0,a,0);
        deco(GEO.box,MAT.metal,2.7,.08,1.4,x,1.04,z,0,a,0);deco(GEO.box,SCN,2.2,1.1,.05,x+Math.sin(a)*.5,1.75,z+Math.cos(a)*.5,-.35,a,0);deco(GEO.box,MAT.wallD,.8,.5,.8,x-Math.sin(a)*1.4,.25,z-Math.cos(a)*1.4,0,a,0);
        deco(GEO.box,TRIM.c,.06,.02,8,Math.sin(a)*6,.03,hz+Math.cos(a)*6,0,a,0)}
      for(const sx of[-1,1]){box(sx*56.2,0,-225,1.2,2.4,50,MAT.armorD);for(let z=-249;z<=-201;z+=1.2)box(sx*55.58,.2,z,.03,2,.04,MAT.metal,false);box(sx*55.58,2.3,-225,.04,.06,50,TRIM.c,false);
        SB(sx*45,0,-225,1.2,1.2,7);box(sx*45,0,-225,1,1.1,6.4,MAT.armorD,false);box(sx*45,1.1,-225,.3,5,.3,MAT.metal,false);deco(GEO.box,MAT.wallD,.3,4.4,7.4,sx*45,4.2,-225);deco(GEO.box,SCA,.05,4,7,sx*(45-.18),4.2,-225)}
      for(let x=-40;x<=40;x+=20){deco(GEO.box,MAT.armorD,4,1.6,.3,x,7,r.z0+14);deco(GEO.box,SCN,3.6,1.3,.05,x,7,r.z0+14.18);deco(GEO.cyl,MAT.metal,.04,r.h-7.8,.04,x,7.8+(r.h-7.8)/2,r.z0+14)}}
    // HABITAT: cabins get a desk with a screen, a chair, a rug, a shelf and a plant; lounges get sofas, vending and plants; corridors get benches and fire cabinets
    for(const zc of[49,65,81,109,125,141])for(const sx of[-1,1]){const dx=sx<0?-78:-41,dz=zc+(zc<95?-6.2:6.2),bz=Math.sign(dz-zc);
      box(dx,0,dz,3,.85,1.2,MAT.armorD);box(dx,.85,dz,3.1,.06,1.3,MAT.metal,false);box(dx,1.2,dz+bz*.55,1.6,.9,.05,SCN,false);box(dx,0,dz-bz*1.1,.7,.5,.7,MAT.wallD,false);box(dx,.5,dz-bz*1.4,.7,.6,.1,MAT.wallD,false);
      box(sx<0?-77:-42,.02,zc,5,.02,3.4,fab[(zc/16|0)%4],false);box(sx<0?-86.1:-32.9,2.2,zc-3,.3,.06,2.4,MAT.metal,false);for(let k=0;k<3;k++)box(sx<0?-86.1:-32.9,2.4,zc-3.8+k*.7,.25,.35+k*.08,.4,k%2?MAT.crateA:fab[k],false);
      planter(sx<0?-85.4:-33.6,0,zc+(zc<95?6.5:-6.5),1,1)}
    for(const zc of[65,125])for(const xc of[-104.5,-13.5]){box(xc,0,zc+9,1.6,.55,6,fab[1]);box(xc+(xc<-50?-.7:.7),.55,zc+9,.25,.7,6,fab[1],false);box(xc,0,zc-10,1.2,2.4,2,MAT.armorD);box(xc+(xc<-50?.61:-.61),.9,zc-10,.02,1.2,1.5,SCV,false);planter(xc,0,zc-6,1.2,1.2)}
    for(const z of[57,73,117,133])for(const x of[-64.6,-54.4]){box(x,0,z,.8,.45,3,MAT.armorD);box(x,1.6,z+2.2,.15,.6,.4,TRIM.r,false)}
    // FARMS: nutrient pumps at the rack ends, harvest carts, crates; a tool shed, benches, crates and sprinklers in the orchard
    {const r=R['PORT FARMS'];for(let i=0;i<7;i++){const x=r.x0+12+i*12.5;for(const z of[r.z0+4.2,r.z1-4.2]){SB(x,0,z,1.8,1.4,2.2);box(x,0,z,1.6,1.3,2,MAT.armorD,false);deco(GEO.cyl,MAT.gun,.45,1.2,.45,x,1.9,z);
        deco(GEO.cyl,MAT.metal,.1,2.4,.1,x,1.4,z+(z<-100?1.6:-1.6),1.571,0,0);box(x,1.31,z,.6,.05,.6,TRIM.g,false)}}
      for(const[x,z]of[[-88.75,-112],[-63.75,-88],[-38.75,-112]]){SB(x,0,z,2,1.3,3.2);box(x,.45,z,1.8,.7,3,MAT.armorD,false);for(const o of[-.75,.75])for(const e of[-1.1,1.1])deco(GEO.cyl,MAT.gunD,.3,.2,.3,x+o,.3,z+e,0,0,1.571);
        for(let k=0;k<4;k++)blob(GEO.ico,k%2?MAT.leaf:MAT.leafD,.35,.25,.35,x+(k%2?.4:-.4),1.3,z-.8+(k>>1)*1.4,k)}
      for(const[x,z]of[[-101,-128],[-101,-72]])for(let k=0;k<3;k++)box(x,k*.9,z,1.6,.9,1.6,k%2?MAT.crateA:MAT.crateB,k===0)}
    {const r=R['STARBOARD FARMS'];SB(100,0,-56,6.4,3.4,5.4);box(100,0,-56,6,3,5,MAT.wallD,false);deco(GEO.box,fab[0],6.8,.1,5.8,100,3.2,-56,0,0,.12);box(97,0,-56+2.52,1.4,2.2,.04,TRIM.g,false);box(102,1.4,-53.47,1.6,.8,.04,MAT.pane,false);
      for(const x of[27,47]){box(x,0,-91,3,.45,.8,MAT.armorD);box(x,.45,-90.6,3,.5,.12,MAT.armorD,false)}
      for(const[x,z]of[[30,-140],[86,-140],[30,-60]])for(let k=0;k<2;k++)box(x,k*.8,z,1.4,.8,1.4,k%2?MAT.crateA:MAT.crateB,k===0);
      for(let x=r.x0+12;x<r.x1-6;x+=14)for(let z=r.z0+12;z<r.z1-6;z+=16){if(Math.abs(z-(r.z0+r.z1)/2)<8&&x<r.x0+50)continue;if(z<-140&&x>45&&x<70)continue;deco(GEO.cyl,MAT.metal,.04,1.2,.04,x+2.4,1.5,z+2.4);deco(GEO.cyl,TRIM.c,.12,.05,.12,x+2.4,2.1,z+2.4)}}
    // SPINES: pipe bundles along both walls, junction boxes and fire cabinets, broken at the side doors
    for(const n of['FORE SPINE','AFT SPINE']){const r=R[n],dz=n==='FORE SPINE'?-100:95;for(const[a,b]of[[r.z0+1,dz-4.5],[dz+4.5,r.z1-1]]){const L=b-a,zc=(a+b)/2;
      for(const o of[-1,1]){deco(GEO.cyl,MAT.gun,.14,L,.14,o*6.6,3.7,zc,1.571,0,0);deco(GEO.cyl,MAT.gunD,.1,L,.1,o*6.65,4.05,zc,1.571,0,0);deco(GEO.cyl,MAT.metal,.08,L,.08,o*6.7,3.4,zc,1.571,0,0);
        for(let z=a+3;z<b-2;z+=16){box(o*6.8,1.5,z,.3,.9,.7,MAT.armorD,false);box(o*6.64,1.8,z,.02,.15,.4,TRIM.c,false)}for(let z=a+11;z<b-2;z+=24){box(o*6.82,.9,z,.25,.8,.5,TRIM.r,false);box(o*6.68,1.1,z,.02,.4,.3,MAT.pane,false)}}}}}
"""
rep(anchor,NEW+anchor)
open(p,'w').write(s);print('ok')
