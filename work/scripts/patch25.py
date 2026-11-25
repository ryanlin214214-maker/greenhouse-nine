p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:80]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]
between(" // outside the hull: engines, sensor masts","\n}\nflush();",r""" // ---- the exterior: an original long-hull colony ship. Light plating with orange accents, a tapered prow, a dorsal spine with a command
 // tower and turrets, a keel, a rotating habitat ring around the midsection, and an engine cluster framing the hangar launch bay
 {MAT.plate=std({map:paint(512,(g,S)=>panels(g,S,'#8f9a9e',4)),roughness:.55,metalness:.45});MAT.plateD=std({map:paint(256,(g,S)=>panels(g,S,'#5b666a',2)),roughness:.6,metalness:.5});
  MAT.accent=std({color:0xc8642a,roughness:.5,metalness:.3});MAT.nozzle=std({color:0x2a3034,roughness:.35,metalness:.8,side:T.DoubleSide});
  const PL=MAT.plate,PD=MAT.plateD,AC=MAT.accent,top=31.2,N=lowFx?0.5:1;
  // outer shell: roof plating (open over the commons atrium and the glass farms), side armor bands, the keel below
  for(const[x0,x1,z0,z1]of[[-112,112,-262,-160],[-12,12,-160,-40],[-112,112,40,262],[-112,-36,-40,40],[36,112,-40,40],[-36,36,-40,-22],[-36,36,22,40]])deco(GEO.box,PL,x1-x0,1.6,z1-z0,(x0+x1)/2,top,(z0+z1)/2);
  for(const sx of[-1,1]){deco(GEO.box,PD,2,6,524,sx*(AX+1.4),18,0);deco(GEO.box,PL,2.4,4,524,sx*(AX+1.6),27,0);deco(GEO.box,AC,2.5,.8,524,sx*(AX+1.7),24.6,0);deco(GEO.box,PL,3,12,524,sx*(AX+1.2),-6,0);
    for(let z=-250;z<=250;z+=24){deco(GEO.box,PD,2.8,30,1.2,sx*(AX+1.6),14,z+12)}}
  for(const[w,y,h]of[[226,-6,12],[190,-18,12],[140,-29,10],[70,-38,8]])deco(GEO.box,y===-6?PD:PL,w,h,528,0,y,0);deco(GEO.box,AC,4,6,528,0,-44,0);
  // greebles: vents, boxes and conduits scattered over the roof and the keel
  for(let i=0;i<Math.round(420*N);i++){const x=-108+hash(i,301)*216,z=-258+hash(i,302)*516;if(Math.abs(x)<38&&Math.abs(z)<24)continue;if(z>-160&&z<-40&&Math.abs(x)>12)continue;
    const w=1+hash(i,303)*5,d=1+hash(i,304)*7,h=.4+hash(i,305)*2.2;deco(GEO.box,i%5?PD:PL,w,h,d,x,top+.8+h/2,z,0,i%3?0:1.571,0)}
  for(let i=0;i<Math.round(160*N);i++){const x=-60+hash(i,311)*120,z=-258+hash(i,312)*516,w=1+hash(i,313)*4;deco(GEO.box,i%4?PD:AC,w,1+hash(i,314)*2,1+hash(i,315)*6,x,-33-hash(i,316)*6,z)}
  for(let z=-240;z<=240;z+=40)for(const sx of[-1,1])deco(GEO.cyl,PD,.8,40,.8,sx*(AX+3.2),20,z,1.571,0,0);
  // the prow: tapered armored sections stepping down and out ahead of the bridge window, with a sensor keel and accent chevrons
  for(let i=0;i<8;i++){const t=i/7,w=228*(1-t*.82),z=-268-i*44,y0=-40+t*16,h=36-t*26;deco(GEO.box,i%2?PL:PD,w,h,46,0,y0+h/2-6,z);deco(GEO.box,AC,w*.5,.8,47,0,y0+h-6.2,z);
    for(const sx of[-1,1])deco(GEO.box,PL,6,h*.8,40,sx*(w/2+2),y0+h/2-6,z,0,sx*.25,0)}
  deco(GEO.cone,PL,22,90,14,0,-16,-650,-1.571,0,0);deco(GEO.box,PD,2,3,330,0,-2,-420);GLOWS.push([0,-12,-700,0xff4a3a,14,.9]);
  // dorsal spine, command tower and turrets
  deco(GEO.box,PD,12,3,200,0,top+2.3,-150);deco(GEO.box,PD,12,3,190,0,top+2.3,150);deco(GEO.box,AC,12.4,.5,200,0,top+3.6,-150);
  for(let i=0;i<5;i++){const w=34-i*6,h=8,z=-205;deco(GEO.box,i%2?PL:PD,w,h,40-i*5,0,top+3+i*h+h/2,z);for(const sx of[-1,1])deco(GEO.box,MAT.win,.2,1.2,30-i*5,sx*(w/2+.1),top+3+i*h+h/2+1,z)}
  deco(GEO.cyl,PD,.8,40,.8,0,top+63,-205);deco(GEO.cyl,PD,.5,24,.5,6,top+55,-198);deco(new T.SphereGeometry(1,16,8,0,6.283,0,1.1),PL,7,3.5,7,-10,top+46,-212,-.6,0,0);GLOWS.push([0,top+84,-205,0xff4a3a,8,.9]);
  for(const z of[-120,-80,80,120,190]){deco(GEO.cyl,PD,5,3,5,0,top+5,z);deco(GEO.box,PL,7,3.2,8,0,top+8,z);for(const o of[-1.4,1.4])deco(GEO.cyl,PD,.6,16,.6,o,top+8.5,z-10,1.571,0,0)}
  // engine cluster around the hangar launch bay (the bay mouth stays clear for the skiffs)
  deco(GEO.box,PD,224,8,40,0,34,282);deco(GEO.box,PD,224,8,40,0,-12,282);for(const sx of[-1,1])deco(GEO.box,PD,64,46,40,sx*80,11,282);
  for(const sx of[-1,1])deco(GEO.box,AC,1.2,26,41,sx*48,12,282);deco(GEO.box,AC,96,1.2,41,0,25.6,282);
  for(const[x,y,r]of[[-82,56,20],[0,62,22],[82,56,20],[-92,-34,22],[0,-40,24],[92,-34,22],[-140,12,18],[140,12,18]]){deco(GEO.cyl,PL,r*1.15,30,r*1.15,x,y,318,1.571,0,0);
    deco(new T.CylinderGeometry(1,.7,1,24,1,true),MAT.nozzle,r,26,r,x,y,345,-1.571,0,0);deco(GEO.tor,MAT.strip,r*.62,r*.62,r*.62,x,y,357,0,0,0);deco(GEO.box,AC,r*2.3,1.2,30,x,y+r*1.15,318);
    GLOWS.push([x,y,362,0x7fd8ff,r*4.2,.6],[x,y,380,0x5fb8ff,r*2.6,.35])}
  for(const[x,y,z,c]of[[-114,30,-250,0xff3b3b],[114,30,-250,0x3bff6a],[-114,30,250,0xff3b3b],[114,30,250,0x3bff6a],[0,-46,0,0xffffff],[0,top+3,0,0xffffff]])GLOWS.push([x,y,z,c,4,.9]);
 }
 // the habitat ring: a rotating ring around the midsection on four spokes (scenery; the skiff flies through it)
 {const g=new T.Group(),rg=inst(bake(a=>{a(new T.TorusGeometry(1,.06,10,96),MAT.plate,250,250,250);a(new T.TorusGeometry(1,.012,6,96),MAT.accent,250,250,250,0,0,15.5);a(new T.TorusGeometry(1,.012,6,96),MAT.accent,250,250,250,0,0,-15.5);
     for(let i=0;i<4;i++){const an=i*1.571+.785;a(GEO.cyl,MAT.plateD,4,130,4,Math.cos(an)*185,Math.sin(an)*185,0,0,0,an-1.571)}
     for(let i=0;i<24;i++){const an=i/24*6.283;a(GEO.box,MAT.plateD,30,18,34,Math.cos(an)*250,Math.sin(an)*250,0,0,0,an)}}),false);g.add(rg);
   const lp=[];for(let i=0;i<240;i++){const an=i/240*6.283;lp.push(Math.cos(an)*236,Math.sin(an)*236,(i%2?1:-1)*9)}const lg=new T.BufferGeometry();lg.setAttribute('position',new T.Float32BufferAttribute(lp,3));
   g.add(new T.Points(lg,new T.PointsMaterial({color:0xffd9a0,size:2.2,sizeAttenuation:false})));g.position.set(0,0,0);scene.add(g);window.HABRING=g}""")
rep("const LIM=A+300","const LIM=A+700")
rep("  rip.offset.set(time*0.012,time*0.02);","  rip.offset.set(time*0.012,time*0.02);if(window.HABRING)HABRING.rotation.z+=dt*.012;")
open(p,'w').write(s);print('ok')
