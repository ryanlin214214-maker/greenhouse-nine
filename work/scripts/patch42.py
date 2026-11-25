p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
rep(" // the habitat ring: a rotating ring",r""" // the hull silhouette: a stepped command citadel over the aft decks, a wide low hammerhead bow (kept below the bridge windows), angled flank
 // armour and a deep keel fin, and four radiator wings in an X at the stern. Coarse collision so the skiff cannot fly through them.
 {const PL=MAT.plate,PD=MAT.plateD,AC=MAT.accent,top=31.2,sol=(x0,y0,z0,x1,y1,z1)=>boxes.push({lo:[x0,y0,z0],hi:[x1,y1,z1]});
  let y=top+1.5;[[164,26,200,150],[126,24,160,156],[86,22,116,166],[52,18,62,184]].forEach(([w,h,d,z],i)=>{deco(GEO.box,i%2?PD:PL,w,h,d,0,y+h/2,z);deco(GEO.box,AC,w+.6,1.2,d+.6,0,y+h-2,z);
    for(const sx of[-1,1]){deco(GEO.box,PD,10,h*1.25,d*.9,sx*(w/2+3),y+h/2-1,z,0,0,sx*.45);for(let k=0;k<3;k++)deco(GEO.box,MAT.win,.3,1.2,d*.7,sx*(w/2+.2),y+h*.3+k*4,z)}
    deco(GEO.box,PD,w*.9,h*1.25,12,0,y+h/2-1,z-d/2-3,.5,0,0);deco(GEO.box,PD,w*.9,h*1.1,10,0,y+h/2-1,z+d/2+2,-.35,0,0);sol(-w/2-6,y,z-d/2-6,w/2+6,y+h,z+d/2+4);y+=h});
  deco(GEO.box,PL,124,5,22,0,y-7,166);deco(GEO.box,MAT.win,125,1.4,22.4,0,y-6,166);sol(-62,y-9.5,155,62,y-4.5,177);
  for(const x of[-18,0,18])deco(GEO.cyl,PD,1,60,1,x,y+30,196);deco(GEO.box,PD,60,1.5,1.5,0,y+44,196);GLOWS.push([0,y+62,196,0xff4a3a,10,.9]);
  deco(GEO.box,PL,300,44,80,0,-24,-300);deco(GEO.box,AC,301,2,81,0,-8,-300);for(const sx of[-1,1]){deco(GEO.box,PD,70,48,90,sx*150,-24,-300,0,sx*.5,0);deco(GEO.box,MAT.win,60,2,.4,sx*100,-14,-340.3)}
  sol(-190,-46,-345,190,-2,-258);
  deco(GEO.box,PD,14,70,330,0,-82,20);deco(GEO.box,PL,44,24,260,0,-58,20);deco(GEO.box,AC,14.4,2,330,0,-114,20);deco(GEO.box,PD,14,44,60,0,-78,-170,.5,0,0);sol(-7,-117,-145,7,-48,185);
  for(const sx of[-1,1])for(const z of[-190,-70]){deco(GEO.box,PL,16,44,104,sx*(AX+17),-24,z,0,0,sx*.3);deco(GEO.box,AC,1,44,6,sx*(AX+24.5),-24,z-40,0,0,sx*.3);deco(GEO.box,PD,6,26,60,sx*(AX+24),-24,z+14,0,0,sx*.3)}
  for(const sx of[-1,1])for(const sy of[-1,1]){const a=.6,ca=Math.cos(a),sa=Math.sin(a),cx=sx*(126+112*ca),cy=-6+sy*112*sa,rz=sx*sy*a;
    deco(GEO.box,MAT.roofB,224,3,240,cx,cy,120,0,0,rz);deco(GEO.box,AC,226,3.6,5,cx,cy,-1,0,0,rz);deco(GEO.box,AC,226,3.6,5,cx,cy,241,0,0,rz);
    for(let k=-2;k<=2;k++)deco(GEO.box,PL,3,5,242,cx+sx*k*50*ca,cy+sy*k*50*sa,120,0,0,rz);
    for(let k=0;k<4;k++){const u=-84+56*k,px=cx+sx*u*ca,py=cy+sy*u*sa;sol(px-25,py-19,0,px+25,py+19,240)}}}
 // the habitat ring: a rotating ring""")
rep("window.HABRING=g}","window.HABRING=g;g.visible=false}")
rep("mark('TH-09',-70,top+1.2,120,-Math.PI/2,0,70,70);","mark('TH-09',-70,top+1.2,-212,-Math.PI/2,0,56,56);")
rep("['HABITAT RING',-60,8,38.9,0,'#9a6ae0']","['HABITAT',-60,8,38.9,0,'#9a6ae0']")
open(p,'w').write(s);print('ok')
