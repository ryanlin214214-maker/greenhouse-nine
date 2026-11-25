p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
rep(" // the habitat ring:",""" // ---- exterior silhouette and ordered detail (original design): sloped side armor in segments with panel gaps, stepped dorsal shoulders,
 // twin engine nacelles on swept pylons, rows of lit cabin windows, roof panel lines; plus coarse collision so the skiff cannot pass through the hull
 {const PL=MAT.plate,PD=MAT.plateD,AC=MAT.accent,top=31.2,EB=[];const solid=(x0,y0,z0,x1,y1,z1)=>EB.push({lo:[x0,y0,z0],hi:[x1,y1,z1]});
  for(const sx of[-1,1]){
    for(let z=-252;z<=244;z+=31){deco(GEO.box,(z/31|0)%2?PL:PD,9,26,30,sx*(AX+7),-20,z+15,0,0,sx*.42);deco(GEO.box,AC,.5,24,30.2,sx*(AX+11.2),-19.5,z+15,0,0,sx*.42)}
    for(let z=-250;z<=250;z+=12)for(const y of[6,11.5])deco(GEO.box,MAT.win,.15,1,6,sx*(AX+2.6),y+16,z);
    deco(GEO.box,PL,14,5,500,sx*(AX-8),top+3.3,0);deco(GEO.box,PD,9,4,480,sx*(AX-9),top+7.6,0);deco(GEO.box,AC,14.2,.6,500,sx*(AX-8),top+5.6,0);
    for(let z=-240;z<=240;z+=20)deco(GEO.box,PD,15,1.2,1,sx*(AX-8),top+5.9,z);
    // nacelle and swept pylon
    const nx=sx*(AX+62),ny=6;deco(GEO.cyl,PL,16,150,16,nx,ny,180,1.571,0,0);deco(GEO.cyl,PD,17,10,17,nx,ny,110,1.571,0,0);deco(GEO.cyl,AC,17.2,2,17.2,nx,ny,140,1.571,0,0);
    for(let i=0;i<6;i++)deco(GEO.box,PD,2,34,6,nx+Math.cos(i*1.047)*16.5,ny+Math.sin(i*1.047)*16.5,180,0,0,i*1.047);
    deco(new T.CylinderGeometry(1,.75,1,28,1,true),MAT.nozzle,13,20,13,nx,ny,264,-1.571,0,0);deco(GEO.tor,MAT.strip,10,10,10,nx,ny,272,0,0,0);GLOWS.push([nx,ny,278,0x7fd8ff,70,.55],[nx,ny,300,0x5fb8ff,40,.3]);
    deco(GEO.tor,PD,15,15,15,nx,ny,106,0,0,0);deco(new T.CircleGeometry(1,24),MAT.nozzle,14,14,1,nx,ny,104.5,0,Math.PI,0);
    for(const z of[150,215]){deco(GEO.box,PD,64,7,22,sx*(AX+31),ny+3,z,0,sx*-.18,sx*-.12);deco(GEO.box,AC,64,.6,22.2,sx*(AX+31),ny+6.8,z,0,sx*-.18,sx*-.12)}
    solid(Math.min(nx-17,nx+17),ny-17,104,Math.max(nx-17,nx+17),ny+17,276);solid(sx>0?AX:-(AX+62),ny-1,140,sx>0?AX+62:-AX,ny+7,226);
    solid(sx>0?AX:-(AX+16),-40,-262,sx>0?AX+16:-AX,top+2,262)}
  // roof panel lines and lit hatches
  for(let z=-256;z<=256;z+=16)deco(GEO.box,PD,224,.2,.5,0,top+.85,z);for(let i=0;i<24;i++){const x=-90+hash(i,401)*180,z=-250+hash(i,402)*500;if(Math.abs(x)<38&&Math.abs(z)<24)continue;deco(GEO.box,MAT.strip,3,.1,3,x,top+.9,z)}
  // coarse collision for the hull shell, keel, prow, tower and engine block (the hangar mouth stays open)
  solid(-AX,-48,-AZ,AX,-1,AZ);solid(-AX,top-.8,-AZ,AX,top+8,-160);solid(-AX,top-.8,40,AX,top+8,AZ);solid(-AX,top-.8,-160,-36,top+8,40);solid(36,top-.8,-160,AX,top+8,40);
  for(let i=0;i<8;i++){const t=i/7,w=228*(1-t*.82),z=-268-i*44,y0=-40+t*16,h=36-t*26;solid(-w/2-4,y0-6,z-23,w/2+4,y0+h-6,z+23)}
  solid(-17,top+3,-225,17,top+43,-185);solid(-112,30,262,112,38,302);solid(-112,-16,262,112,-8,302);solid(-112,-12,262,-48,34,302);solid(48,-12,262,112,34,302);
  solid(-160,-70,302,160,90,370);
  for(const b of EB)boxes.push(b)}
 // the habitat ring:""")
# the skiff cannot pop up through the deck from below
rep("if(inHull(p.x,p.z)&&p.y<v.r){if(oy>=v.r-0.3||deck){p.y=v.r;if(v.p<0)v.p*=0.5}else{p.x=ox;p.z=oz;v.v*=0.5}}",
    "if(inHull(p.x,p.z)&&p.y<v.r){if(oy>=v.r-0.3){p.y=v.r;if(v.p<0)v.p*=0.5}else{p.x=ox;p.y=oy;p.z=oz;v.v*=0.5}}")
open(p,'w').write(s);print('ok')
