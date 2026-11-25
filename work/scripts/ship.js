// ---- the ship: a roofed hull of rooms joined by doors and a central spine corridor
const GLOWS=[],ROOMS=[
  {n:'BRIDGE',x0:-59,x1:59,z0:-257,z1:-161,h:18},{n:'PORT FARMS',x0:-107,x1:-11,z0:-159,z1:-41,h:22},{n:'STARBOARD FARMS',x0:11,x1:107,z0:-159,z1:-41,h:22},
  {n:'FORE SPINE',x0:-9,x1:9,z0:-159,z1:-41,h:10},{n:'COMMONS',x0:-107,x1:107,z0:-39,z1:39,h:26},{n:'HABITAT',x0:-107,x1:-11,z0:41,z1:149,h:9},
  {n:'ENGINEERING',x0:11,x1:107,z0:41,z1:149,h:24},{n:'AFT SPINE',x0:-9,x1:9,z0:41,z1:149,h:10},{n:'HANGAR',x0:-107,x1:107,z0:151,z1:257,h:30}];
function roomAt(x,z){for(const r of ROOMS)if(x>=r.x0-1&&x<=r.x1+1&&z>=r.z0-1&&z<=r.z1+1)return r;return null}
function inHull(x,z){return Math.abs(x)<AX&&z>-AZ&&z<AZ}
MAT.roof=std({color:0x1b2a2e,roughness:.7,metalness:.6});MAT.roof.userData.noShadow=true;
MAT.win=bas({color:0xb88a46});MAT.win.userData.noShadow=true;
const TRIM={c:bas({color:0x46c8e0}),a:bas({color:0xd8962a}),g:bas({color:0x5ccf6a}),v:bas({color:0x9a6ae0}),o:bas({color:0xe0702a}),r:bas({color:0xd84848})};for(const k in TRIM)TRIM[k].userData.noShadow=true;
{const deco=(geo,mat,sx,sy,sz,x,y,z,rx=0,ry=0,rz=0)=>{const g=geo.clone();g.applyMatrix4(M4.compose(new T.Vector3(x,y,z),new T.Quaternion().setFromEuler(new T.Euler(rx,ry,rz)),new T.Vector3(sx,sy,sz)));addGeo(mat,g)};
 const floorBox=(x,y,z,w,h,d,m=MAT.metal)=>{box(x,y,z,w,h,d,m);boxes[boxes.length-1].floor=true};
 const seg=(ax,c,a0,a1,y0,h,m=MAT.hull)=>{const L=a1-a0;if(L<=0.01||h<=0.01)return;const mm=(a0+a1)/2;if(ax==='x')box(c,y0,mm,2,h,L,m);else box(mm,y0,c,L,h,2,m)};
 const along=(ax,c,a,y,len,th,m)=>ax==='x'?box(c,y,a,th,.25,len,m,false):box(a,y,c,len,.25,th,m,false);
 // a wall at x=c (ax 'x') or z=c (ax 'z') from a0 to a1, with doorways [center,width,height,trim]
 function wall(ax,c,a0,a1,h,doors=[]){let s=a0;for(const[dc,dw,dh,tr]of doors.slice().sort((p,q)=>p[0]-q[0])){seg(ax,c,s,dc-dw/2,0,h);seg(ax,c,dc-dw/2,dc+dw/2,dh,h-dh);
     // chevron door frame and a lit strip over the door
     const t=TRIM[tr||'c'];for(const o of[-1,1]){const fx=ax==='x'?c:dc+o*(dw/2+.4),fz=ax==='x'?dc+o*(dw/2+.4):c;box(fx,0,fz,ax==='x'?2.6:.8,dh,ax==='x'?.8:2.6,MAT.armorD,false);
       deco(GEO.box,t,ax==='x'?2.7:.12,dh*.9,ax==='x'?.12:2.7,fx,dh*.45,fz);deco(GEO.box,MAT.armorD,ax==='x'?2.6:2.2,.8,ax==='x'?2.2:2.6,ax==='x'?c:dc+o*(dw/2-.6),dh+.2,ax==='x'?dc+o*(dw/2-.6):c,ax==='x'?o*.6:0,0,ax==='x'?0:-o*.6)}
     ax==='x'?box(c,dh,dc,2.4,.3,dw+1.6,t,false):box(dc,dh,c,dw+1.6,.3,2.4,t,false);s=dc+dw/2}
   seg(ax,c,s,a1,0,h);along(ax,c,(a0+a1)/2,1.1,a1-a0,2.06,MAT.armorD);along(ax,c,(a0+a1)/2,h-1.2,a1-a0,2.08,MAT.armorD)}
 // hull wall with a band of windows looking into space
 function hullWall(ax,c,a0,a1,h,step,ww,skip=[]){let s=a0;for(let w=a0+step/2;w<a1;w+=step){if(skip.some(k=>Math.abs(w-k)<step/2))continue;seg(ax,c,s,w-ww/2,0,h);seg(ax,c,w-ww/2,w+ww/2,0,3);seg(ax,c,w-ww/2,w+ww/2,15,h-15);
     ax==='x'?box(c,3,w,1,12,ww,MAT.pane):box(w,3,c,ww,12,1,MAT.pane);for(const o of[-1,1])ax==='x'?box(c-Math.sign(c)*1.2,3,w+o*(ww/2+.3),.6,12,.6,MAT.armorD,false):box(w+o*(ww/2+.3),3,c-Math.sign(c)*1.2,.6,12,.6,MAT.armorD,false);s=w+ww/2}
   seg(ax,c,s,a1,0,h)}
 const roof=(r,m=MAT.roof)=>box((r.x0+r.x1)/2,r.h,(r.z0+r.z1)/2,r.x1-r.x0+2,1,r.z1-r.z0+2,m);
 const ribs=(r,step,ax,t)=>{for(let a=(ax==='z'?r.z0:r.x0)+step/2;a<(ax==='z'?r.z1:r.x1);a+=step){const w=ax==='z'?r.x1-r.x0:r.z1-r.z0,cx=ax==='z'?(r.x0+r.x1)/2:a,cz=ax==='z'?a:(r.z0+r.z1)/2;
     box(cx,r.h-1.2,cz,ax==='z'?w:1.2,1.2,ax==='z'?1.2:w,MAT.armorD,false);box(cx,r.h-1.35,cz,ax==='z'?w:.25,.12,ax==='z'?.25:w,t,false);
     for(const o of[-1,1]){const px=ax==='z'?cx+o*(w/2-1.5):cx,pz=ax==='z'?cz:cz+o*(w/2-1.5);deco(GEO.box,MAT.armorD,ax==='z'?3.5:1.2,1.2,ax==='z'?1.2:3.5,px,r.h-2.6,pz,ax==='z'?0:o*.7,0,ax==='z'?-o*.7:0)}}};
 const lightRow=(r,ax,y)=>{const n=Math.max(1,Math.round((ax==='z'?r.z1-r.z0:r.x1-r.x0)/14));for(let i=0;i<n;i++){const t=(i+.5)/n,x=ax==='z'?(r.x0+r.x1)/2:r.x0+t*(r.x1-r.x0),z=ax==='z'?r.z0+t*(r.z1-r.z0):(r.z0+r.z1)/2;
     box(x,y,z,ax==='z'?3:.8,.15,ax==='z'?.8:3,MAT.strip,false)}};
 const R={};for(const r of ROOMS)R[r.n]=r;
 box(0,-1,0,2*AX+4,1,2*AZ+4,MAT.floor,false);
 // outer hull
 hullWall('x',-AX+1,-159,AZ,30,24,14,[150]);hullWall('x',AX-1,-159,AZ,30,24,14,[150]);
 wall('z',AZ-1,-AX,AX,30,[[0,80,22,'r']]);seg('x',-AX+1,-AZ,-159,0,22);seg('x',AX-1,-AZ,-159,0,22);
 hullWall('z',-AZ+1,-60,60,18,20,16);wall('x',-60,-AZ,-160,18);wall('x',60,-AZ,-160,18);
 // inner bulkheads
 wall('z',-160,-AX,AX,22,[[0,14,9,'c']]);
 wall('z',-40,-AX,AX,26,[[0,14,9,'a'],[-60,10,8,'g'],[60,10,8,'g']]);
 wall('z',40,-AX,AX,26,[[0,14,9,'a'],[-60,10,7,'v'],[60,10,8,'o']]);
 wall('z',150,-AX,AX,30,[[0,16,9,'r'],[-60,10,7,'v'],[60,10,8,'o']]);
 wall('x',-10,-160,-40,22,[[-100,10,8,'g']]);wall('x',10,-160,-40,22,[[-100,10,8,'g']]);
 wall('x',-10,40,150,24,[[95,8,7,'v']]);wall('x',10,40,150,24,[[95,10,8,'o']]);
 // the hangar mouth: open to space behind a shimmering force field
 {const ff=new T.Mesh(new T.PlaneGeometry(80,22),bas({color:0x6fd8ff,transparent:true,opacity:.12,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}));ff.position.set(0,11,AZ-1);scene.add(ff)}
 // roofs: solid plating, glass over the farms and the commons atrium
 for(const r of ROOMS)if(r.n!=='COMMONS'&&!/FARMS/.test(r.n))roof(r);
 {const c=R['COMMONS'];box(-71,c.h,0,74,1,82,MAT.roof);box(71,c.h,0,74,1,82,MAT.roof);box(0,c.h,-31,68,1,20,MAT.roof);box(0,c.h,31,68,1,20,MAT.roof);box(0,c.h,0,68,1,42,MAT.pane);
   for(let i=-3;i<=3;i++){box(i*10,c.h-.6,0,.8,1.2,42,MAT.armorD,false);box(0,c.h-.6,i*6,68,1.2,.8,MAT.armorD,false)}}
 for(const n of['PORT FARMS','STARBOARD FARMS']){const r=R[n];roof(r,MAT.pane);ribs(r,12,'z',TRIM.g)}
 // per-room trim and ceiling lights
 ribs(R['FORE SPINE'],8,'z',TRIM.c);ribs(R['AFT SPINE'],8,'z',TRIM.a);ribs(R['HANGAR'],18,'x',TRIM.r);ribs(R['ENGINEERING'],16,'z',TRIM.o);ribs(R['BRIDGE'],16,'x',TRIM.c);
 for(const r of ROOMS)lightRow(r,r.x1-r.x0>r.z1-r.z0?'x':'z',r.h-(r.h>12?2.2:.7));
 // signs
 const SIGNS=[['COMMONS',0,7,-38.9,0,'#d8962a'],['HYDROPONICS · PORT',-60,9.5,-41.1,Math.PI,'#5ccf6a'],['HYDROPONICS · STARBOARD',60,9.5,-41.1,Math.PI,'#5ccf6a'],['HABITAT RING',-60,8,38.9,0,'#9a6ae0'],
   ['ENGINEERING',60,9.5,38.9,0,'#e0702a'],['HANGAR 2',0,11,148.9,0,'#d84848'],['BRIDGE',0,10.5,-158.9,0,'#46c8e0'],['THALASSA STATION · FARM DECK',0,18,-38.9,0,'#dcebe4'],['MACHINES ARE NOT PERMITTED PAST THIS POINT',0,6,-161.1,Math.PI,'#d84848']];
 for(const[t,x,y,z,ry,col]of SIGNS){const tx=paint(512,(g,S)=>{g.clearRect(0,0,S,S);g.fillStyle='rgba(6,16,20,.85)';g.fillRect(0,S*.36,S,S*.28);g.strokeStyle=col;g.lineWidth=6;g.strokeRect(4,S*.36+4,S-8,S*.28-8);
     g.fillStyle=col;g.font='700 '+(t.length>18?30:52)+'px "Chakra Petch",sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(t,S/2,S/2)});
   const m=new T.Mesh(new T.PlaneGeometry(t.length>18?20:12,t.length>18?20:12),bas({map:tx,transparent:true,depthWrite:false}));m.position.set(x,y,z);m.rotation.y=ry;scene.add(m)}
 // COMMONS: an atrium tree, mezzanine galleries, columns, stalls and benches
 {box(0,0,0,14,1.2,14,MAT.soil);box(0,1.1,0,14.4,.2,14.4,MAT.metal,false);tree(0,0,900,1.2);tree(-3.5,3,901,1.2);tree(3.5,-3,902,1.2);box(0,0,0,18,.3,18,MAT.water,false);
   for(const sz of[-1,1]){floorBox(0,7,sz*34,214,.5,10);box(0,7.5,sz*29,214,.1,.1,TRIM.a,false);for(let x=-100;x<=100;x+=5)box(x,7.5,sz*29.1,.12,1.1,.12,MAT.metal,false);box(0,8.6,sz*29.1,214,.1,.1,MAT.metal,false);
     for(const sx of[-1,1])stairs(sx*84,sz*24,0,sz,4,7.5);for(let x=-90;x<=90;x+=30){if(Math.abs(x)<10)continue;box(x,0,sz*35,8,3.2,5,MAT.armorD);box(x,3.2,sz*32.5,9,.25,3,TRIM.a,false);box(x,1.6,sz*32.4,6,.8,.1,MAT.win,false)}}
   for(const sx of[-1,1])for(const sz of[-1,1]){const x=sx*40,z=sz*15;box(x,0,z,2.4,26,2.4,MAT.hull);deco(GEO.hex,TRIM.a,1.5,.3,1.5,x,4,z);deco(GEO.hex,TRIM.a,1.5,.3,1.5,x,20,z);for(const o of[-1,1])deco(GEO.box,MAT.armorD,.6,8,.6,x+o*1.4,22,z,0,0,o*.5)}
   for(let i=0;i<10;i++){const x=-95+i*21,z=(i%2?-1:1)*(8+hash(i,61)*12);if(Math.abs(x)<12)continue;box(x,0,z,5,.9,1.4,MAT.metal);box(x,.9,z-.55,5,.8,.3,MAT.metal)}
   for(let i=0;i<6;i++)box(-95+hash(i,71)*190,0,-18+hash(i,72)*36,2.4,1.4,2.4,i%2?MAT.crateA:MAT.crateB);GLOWS.push([0,22,0,0xffd9a0,30,.25])}
 // FARMS: hydroponic rack rows, a catwalk, water towers; the starboard side is an orchard with pools
 {const r=R['PORT FARMS'];for(let i=0;i<7;i++){const x=r.x0+12+i*12.5;for(const[z0,z1]of[[r.z0+8,r.z0+52],[r.z0+64,r.z1-8]]){const L=z1-z0,zc=(z0+z1)/2;
       box(x,0,zc,1.4,4.2,L,MAT.metal);for(const y of[1.2,2.6,4])box(x,y,zc,1.8,.12,L,MAT.armorD,false);for(let k=0;k<Math.floor(L/1.4);k++)for(const y of[1.4,2.8])blob(GEO.ico,(k+i)%3?MAT.leaf:MAT.leafD,.5,.32,.4,x+(k%2?.5:-.5),y,z0+.7+k*1.4,k);
       for(const y of[2.4,3.8])box(x,y,zc,.3,.06,L,MAT.bloom,false)}}
   floorBox((r.x0+r.x1)/2,8,(r.z0+r.z1)/2,r.x1-r.x0,.4,4);stairs(r.x0+4,(r.z0+r.z1)/2+5,0,1,3.5,8.4);
   for(const z of[r.z0+6,r.z1-6]){box(r.x0+5,0,z,6,10,6,MAT.glass);box(r.x0+5,10,z,6.6,.4,6.6,MAT.metal,false)}
   for(let z=r.z0+10;z<r.z1;z+=20)deco(GEO.cyl,MAT.metal,.3,r.x1-r.x0,.3,(r.x0+r.x1)/2,r.h-3,z,0,0,1.571)}
 {const r=R['STARBOARD FARMS'];let k=950;for(let x=r.x0+12;x<r.x1-6;x+=14)for(let z=r.z0+12;z<r.z1-6;z+=16){if(Math.abs(z-(r.z0+r.z1)/2)<8&&x<r.x0+50)continue;box(x,0,z,4,.9,4,MAT.soil);tree(x,z,k++,.9)}
   box(r.x0+26,0.03,(r.z0+r.z1)/2,40,.05,12,MAT.water,false);for(let i=0;i<14;i++)blob(GEO.cyl,MAT.lily,.6,.03,.6,r.x0+8+hash(i,5)*36,.1,(r.z0+r.z1)/2-5+hash(i,6)*10);
   floorBox((r.x0+r.x1)/2,8,(r.z0+r.z1)/2,4,.4,r.z1-r.z0);stairs((r.x0+r.x1)/2,r.z1-4,0,-1,3.5,8.4)}
 // HABITAT: a grid of crew cabins along narrow corridors
 {const r=R['HABITAT'];for(let x=r.x0+16;x<r.x1-4;x+=16)wall('x',x,r.z0,r.z1,r.h,[[r.z0+14,5,6,'v'],[(r.z0+r.z1)/2,5,6,'v'],[r.z1-14,5,6,'v']]);
   for(let z=r.z0+27;z<r.z1-4;z+=27)wall('z',z,r.x0,r.x1,r.h,[[r.x0+8,5,6,'v'],[r.x0+40,5,6,'v'],[r.x0+72,5,6,'v'],[r.x1-8,5,6,'v']]);
   for(let x=r.x0+3;x<r.x1;x+=16)for(let z=r.z0+5;z<r.z1;z+=27){box(x+1,0,z,2.4,.8,4.4,MAT.armorD);box(x+1,1.6,z,2.4,.15,4.4,MAT.metal,false);box(x+10,0,z+18,2,2.2,.8,MAT.metal);box(x+10,2.3,z+18.5,1.6,.05,.05,TRIM.v,false)}}
 // ENGINEERING: the reactor column, a catwalk ring, pipes, generators and coolant tanks
 {const r=R['ENGINEERING'],cx=(r.x0+r.x1)/2,cz=(r.z0+r.z1)/2;box(cx,0,cz,12,r.h,12,MAT.hull);for(const y of[4,9,14,19])deco(GEO.tor,MAT.strip,9,9,9,cx,y,cz,1.571,0,0);GLOWS.push([cx,12,cz,0x8fe6ff,26,.35]);
   floorBox(cx,9,cz-14,40,.4,4);floorBox(cx,9,cz+14,40,.4,4);floorBox(cx-18,9,cz,4,.4,32);floorBox(cx+18,9,cz,4,.4,32);stairs(cx-18,cz-24,0,1,3.5,9.4);
   for(const[x,z]of[[r.x0+8,r.z0+8],[r.x1-8,r.z0+8],[r.x0+8,r.z1-8],[r.x1-8,r.z1-8]]){box(x,0,z,7,11,7,MAT.glass);box(x,11,z,7.6,.4,7.6,MAT.metal)}
   for(let i=0;i<6;i++){const x=r.x0+16+i*13,z=i%2?r.z0+26:r.z1-26;box(x,0,z,5,3.5,8,MAT.armorD);box(x,3.5,z,5.2,.15,8.2,TRIM.o,false)}
   for(const y of[14,17,20])for(const z of[r.z0+3,r.z1-3])deco(GEO.cyl,MAT.metal,.45,r.x1-r.x0,.45,cx,y,z,0,0,1.571)}
 // HANGAR: parked fighters, a gantry crane, a control booth and cargo
 {const r=R['HANGAR'];for(let i=-4;i<=4;i++)box(i*22,0.03,180,14,.05,.4,MAT.mark,false);
   for(const[fx,fz,fr]of[[-55,215,0],[0,222,0],[55,215,0],[-30,190,.4],[34,188,-.3]]){deco(GEO.box,MAT.gun,3,2,12,fx,1.6,fz,0,fr,0);deco(GEO.box,MAT.gun,14,.3,4,fx,1.4,fz+1,0,fr,0);
     deco(GEO.cone,MAT.amber,1.4,3,1.4,fx-Math.sin(fr)*7.5,1.6,fz-Math.cos(fr)*7.5,-1.571,fr,0);deco(GEO.sph,MAT.canopy,1,.7,2,fx-Math.sin(fr)*3,2.6,fz-Math.cos(fr)*3,0,fr,0);
     for(const o of[-1.5,1.5])deco(GEO.cyl,MAT.gunD,.6,2,.6,fx+Math.cos(fr)*o+Math.sin(fr)*6,1.6,fz-Math.sin(fr)*o+Math.cos(fr)*6,1.571,fr,0);
     boxes.push({lo:[fx-2,0,fz-5.5],hi:[fx+2,2.6,fz+5.5]});GLOWS.push([fx+Math.sin(fr)*7.2,1.6,fz+Math.cos(fr)*7.2,0x8fe6ff,3,.7])}
   for(const x of[-80,80])box(x,0,205,2,22,2,MAT.hull);box(0,22,205,162,2,2.4,MAT.armorD,false);box(20,18,205,6,4,4,MAT.armorD,false);box(20,10,205,.3,8,.3,MAT.metal,false);
   floorBox(r.x0+10,8,170,18,.5,30);box(r.x0+10,8.5,170,18,4,30,MAT.glass);stairs(r.x0+21,186,0,-1,4,8.5);
   for(let i=0;i<14;i++)box(-95+hash(i,141)*190,0,160+hash(i,142)*12,2+hash(i,143)*2,1+Math.floor(hash(i,144)*3),2,i%2?MAT.crateA:MAT.crateB)}
 // BRIDGE: stepped command tiers facing a wide window, consoles and a holo-table of Europa
 {const r=R['BRIDGE'];for(let i=0;i<3;i++){floorBox(0,0,r.z1-10-i*8,96-i*16,1.2*(i+1),8);stairs(0,r.z1-14-i*8-2.5,0,-1,6,1.2*(i+1),1.2*i)}
   for(let i=-4;i<=4;i++){box(i*10,0,r.z0+14,4,1.1,1.6,MAT.armorD);box(i*10,1.1,r.z0+13.6,3.6,1,.12,TRIM.c,false)}
   box(0,0,r.z0+40,6,1,6,MAT.armorD);GLOWS.push([0,3,r.z0+40,0x8fe6ff,8,.6])}
 // spine: cover crates and wall panels
 for(const n of['FORE SPINE','AFT SPINE']){const r=R[n];for(let z=r.z0+12;z<r.z1-6;z+=22){box(r.x0+2.5,0,z,2.4,1.4,3,MAT.crateB);box(r.x1-2.5,0,z+11,2.4,1.4,3,MAT.crateA)}
   for(let z=r.z0+4;z<r.z1;z+=8)for(const x of[r.x0+.1,r.x1-.1])box(x,4,z,.15,2.5,5,MAT.armorD,false)}
 // outside the hull: engines, sensor masts and plating seen through the windows and from the skiff
 for(const sx of[-1,1]){for(let i=0;i<3;i++){const z=-200+i*60;deco(GEO.box,MAT.armorD,6,18,40,sx*(AX+3),12,z,0,0,0)}deco(GEO.cyl,MAT.armorD,10,40,10,sx*(AX+12),12,230,1.571,0,0);deco(GEO.tor,MAT.strip,8,8,8,sx*(AX+12),12,251,0,0,0);GLOWS.push([sx*(AX+12),12,254,0x8fe6ff,50,.5])}
 for(let i=0;i<5;i++)deco(GEO.cyl,MAT.metal,.5,20+i*6,.5,-40+i*20,32+(20+i*6)/2,100);GLOWS.push([0,60,100,0xff4a3a,6,.8]);
 deco(GEO.box,MAT.hull,120,10,40,0,-5,-AZ-20,.3,0,0);
}
flush();
// drifting dust in the air
const motes=new T.Points(new T.BufferGeometry(),new T.PointsMaterial({map:glowTex,color:0xffe9b0,size:0.16,transparent:true,opacity:0.6,depthWrite:false,blending:T.AdditiveBlending,fog:false}));
{const a=new Float32Array((lowFx?120:320)*3);for(let i=0;i<a.length;i++)a[i]=(Math.random()-0.5)*60;motes.geometry.setAttribute('position',new T.BufferAttribute(a,3));motes.frustumCulled=false;scene.add(motes)}
for(const[x,y,z,c,sz,o]of GLOWS){const gl=glow(c,sz,o);gl.position.set(x,y,z);scene.add(gl)}
for(const q of PADS){const gl=glow(0x8fe6ff,4.5,0.5);gl.position.set(q.x,q.y+0.7,q.z);scene.add(gl)}
{const lamps=[[0,18,0,0xffd9a0,1.4,70],[0,22,205,0xffb0a0,1.2,80],[60,16,95,0xffb070,1,60],[-60,14,-100,0xc8ffd0,1,60],[0,12,-210,0x9fe6ff,1,60]];
 for(const[x,y,z,c,i,d]of lowFx?lamps.slice(0,3):lamps){const L=new T.PointLight(c,i,d,2);L.position.set(x,y,z);scene.add(L)}}
