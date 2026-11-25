s=open('/home/user/greenhouse-nine/index.html').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
rep(" // the habitat ring: a rotating ring",r""" {const EX=location.hash==='#1'?1:location.hash==='#2'?2:0,PL=MAT.plate,PD=MAT.plateD,AC=MAT.accent,top=31.2;
  if(EX)setTimeout(()=>{if(window.HABRING)window.HABRING.visible=false},0);
  if(EX===1){ // "citadel": a stepped command citadel amidships, a hammerhead bow, angled flank armour and a deep keel fin
    let y=top+1.5;[[164,26,250,40],[126,24,196,48],[86,22,140,60],[52,18,70,84]].forEach(([w,h,d,z],i)=>{deco(GEO.box,i%2?PD:PL,w,h,d,0,y+h/2,z);deco(GEO.box,AC,w+.6,1.2,d+.6,0,y+h-2,z);
      for(const sx of[-1,1]){deco(GEO.box,PD,10,h*1.25,d*.9,sx*(w/2+3),y+h/2-1,z,0,0,sx*.45);for(let k=0;k<3;k++)deco(GEO.box,MAT.win,.3,1.2,d*.7,sx*(w/2+.2),y+h*.3+k*4,z)}
      deco(GEO.box,PD,w*.9,h*1.25,12,0,y+h/2-1,z-d/2-3,.5,0,0);deco(GEO.box,PD,w*.9,h*1.1,10,0,y+h/2-1,z+d/2+2,-.35,0,0);y+=h});
    deco(GEO.box,PL,124,5,22,0,y-7,62);deco(GEO.box,MAT.win,125,1.4,22.4,0,y-6,62);
    for(const x of[-18,0,18])deco(GEO.cyl,PD,1,60,1,x,y+30,100);deco(GEO.box,PD,60,1.5,1.5,0,y+44,100);GLOWS.push([0,y+62,100,0xff4a3a,10,.9]);
    deco(GEO.box,PL,300,54,80,0,-4,-300);deco(GEO.box,AC,301,2,81,0,14,-300);deco(GEO.box,PD,240,20,60,0,30,-300);
    for(const sx of[-1,1]){deco(GEO.box,PD,70,60,90,sx*150,-4,-300,0,sx*.5,0);deco(GEO.box,MAT.win,60,2,.4,sx*100,6,-340.3)}
    deco(GEO.box,PD,14,70,330,0,-82,20);deco(GEO.box,PL,44,24,260,0,-58,20);deco(GEO.box,AC,14.4,2,330,0,-114,20);deco(GEO.box,PD,14,44,60,0,-78,-170,.5,0,0);
    for(const sx of[-1,1])for(const z of[-190,-70,50]){deco(GEO.box,PL,16,54,104,sx*(AX+17),0,z,0,0,sx*.3);deco(GEO.box,AC,1,54,6,sx*(AX+25.6),0,z-40,0,0,sx*.3);deco(GEO.box,PD,6,30,60,sx*(AX+25),0,z+14,0,0,sx*.3)}}
  if(EX===2){ // "hauler": four radiator wings in an X at the stern, tank clusters along the forward hull, a big dorsal dish
    for(const sx of[-1,1])for(const sy of[-1,1]){const a=.6,cx=sx*(120+112*Math.cos(a)),cy=-6+sy*112*Math.sin(a),rz=sx*sy*a;
      deco(GEO.box,MAT.roofB,224,3,240,cx,cy,120,0,0,rz);deco(GEO.box,AC,226,3.6,5,cx,cy,-1,0,0,rz);deco(GEO.box,AC,226,3.6,5,cx,cy,241,0,0,rz);
      for(let k=-2;k<=2;k++)deco(GEO.box,PL,3,5,242,cx+sx*k*50*Math.cos(a),cy+sy*k*50*Math.sin(a),120,0,0,rz);deco(GEO.box,PD,20,12,250,sx*124,-6+sy*6,120,0,0,rz)}
    for(const sx of[-1,1])for(const z of[-225,-140,-55]){deco(GEO.sph,PL,36,36,36,sx*(AX+46),-6,z);deco(GEO.cyl,AC,36.5,5,36.5,sx*(AX+46),-6,z);deco(GEO.box,PD,30,8,10,sx*(AX+8),-6,z);deco(GEO.cyl,PD,37,3,37,sx*(AX+46),-6,z,1.571,0,0)}
    for(const sx of[-1,1])deco(GEO.box,PD,6,6,260,sx*(AX+46),34,-140);for(const sx of[-1,1])for(const z of[-225,-140,-55])deco(GEO.box,PD,3,10,3,sx*(AX+46),29,z);
    deco(GEO.cyl,PD,4,40,4,0,top+22,-60);deco(new T.SphereGeometry(1,28,10,0,6.283,0,1.1),PL,60,26,60,0,top+52,-60,-.5,0,0);deco(GEO.cyl,PD,.8,50,.8,0,top+70,-45,-.5,0,0);GLOWS.push([0,top+96,-33,0xff4a3a,10,.9]);
    deco(GEO.box,PD,8,8,420,0,-52,-320);for(let z=-520;z<=-140;z+=40)deco(GEO.box,PL,30,3,3,0,-52,z)}}
 // the habitat ring: a rotating ring""")
open('ext.html','w').write(s);print('ok')
