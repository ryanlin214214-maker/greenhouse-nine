p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
# ---------- a pale plating texture: seams, rounded inset panels, louvres, bolts, accent blocks and stencils
rep("const TX={","""function plating(g,S,base,acc,tag){g.fillStyle=base;g.fillRect(0,0,S,S);grime(g,S,S*6,.045);
  const rr=(x,y,w,h,r)=>{g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()};
  const seam='rgba(18,26,30,.6)',lw=Math.max(1.5,S/220);
  {const gr=g.createLinearGradient(0,0,0,S);gr.addColorStop(0,'rgba(255,255,255,.07)');gr.addColorStop(1,'rgba(0,0,0,.09)');g.fillStyle=gr;g.fillRect(0,0,S,S)}
  g.strokeStyle=seam;g.lineWidth=lw;g.strokeRect(lw/2,lw/2,S-lw,S-lw);g.beginPath();g.moveTo(S*.5,0);g.lineTo(S*.5,S*.6);g.moveTo(0,S*.6);g.lineTo(S,S*.6);g.moveTo(S*.27,S*.6);g.lineTo(S*.27,S);g.moveTo(S*.73,S*.6);g.lineTo(S*.73,S);g.stroke();
  g.strokeStyle='rgba(255,255,255,.28)';g.lineWidth=1;g.beginPath();g.moveTo(S*.5+lw,lw*2);g.lineTo(S*.5+lw,S*.6-lw);g.moveTo(lw*2,S*.6+lw);g.lineTo(S-lw*2,S*.6+lw);g.stroke();
  g.fillStyle='rgba(0,0,0,.07)';rr(S*.06,S*.07,S*.38,S*.42,S*.05);g.fill();g.strokeStyle=seam;g.lineWidth=lw*.8;g.stroke();
  g.strokeStyle='rgba(255,255,255,.2)';rr(S*.06+lw,S*.07+lw,S*.38,S*.42,S*.05);g.stroke();
  g.fillStyle='rgba(0,0,0,.16)';rr(S*.57,S*.1,S*.35,S*.3,S*.04);g.fill();g.strokeStyle=seam;g.stroke();
  g.strokeStyle='rgba(18,26,30,.5)';g.lineWidth=lw;for(let i=0;i<7;i++){g.beginPath();g.moveTo(S*.61,S*(.145+i*.035));g.lineTo(S*.88,S*(.145+i*.035));g.stroke()}
  g.fillStyle=acc;g.fillRect(S*.06,S*.525,S*.17,S*.035);g.fillRect(S*.8,S*.68,S*.035,S*.22);g.beginPath();g.moveTo(S*.34,S*.94);g.lineTo(S*.4,S*.94);g.lineTo(S*.46,S*.86);g.lineTo(S*.4,S*.86);g.fill();
  g.fillStyle='rgba(50,165,185,.8)';g.fillRect(S*.3,S*.68,S*.11,S*.028);g.fillRect(S*.12,S*.3,S*.02,S*.1);
  g.fillStyle='rgba(18,26,30,.62)';g.font='700 '+Math.round(S*.075)+'px "Chakra Petch",monospace';g.fillText(tag||'D9-04',S*.31,S*.82);g.font='600 '+Math.round(S*.035)+'px monospace';g.fillText('▲ ACCESS',S*.1,S*.17);
  g.fillStyle='rgba(18,26,30,.55)';for(const[x,y]of[[.03,.03],[.47,.03],[.53,.03],[.97,.03],[.03,.57],[.47,.57],[.53,.57],[.97,.57],[.03,.63],[.24,.63],[.3,.63],[.7,.63],[.76,.63],[.97,.63],[.03,.97],[.97,.97]]){g.beginPath();g.arc(S*x,S*y,S*.008,0,7);g.fill()}}
const TX={""")
rep("hull:paint(lowFx?256:512,(g,S)=>panels(g,S,'#3b5056',2)),","hull:paint(lowFx?256:512,(g,S)=>plating(g,S,'#b4bcbe','#d0702e','D9-04')),")
rep("hull:std({map:TX.hull,normalMap:normalMap(TX.hull,6),roughness:0.55,metalness:0.45}),","hull:std({map:TX.hull,normalMap:normalMap(TX.hull,3),roughness:0.5,metalness:0.3}),")
rep("MAT.wallD=std({map:paint(512,(g,S)=>panels(g,S,'#26363a',2)),roughness:.6,metalness:.5});","MAT.wallD=std({map:paint(512,(g,S)=>plating(g,S,'#8d989b','#d0702e','C-12')),roughness:.55,metalness:.35});MAT.wallD.map.repeat.set(.5,.5);")
rep("MAT.inset=std({color:0x10181a,roughness:.9});","MAT.inset=std({color:0x56636a,roughness:.7,metalness:.3});")
rep("MAT.roof=std({color:0x161f22,roughness:.8,metalness:.5});","MAT.roof=std({color:0x3a4448,roughness:.8,metalness:.4});MAT.frame=std({color:0xd3d9da,roughness:.42,metalness:.35});TX.hull.repeat.set(.5,.5);MAT.hull.normalMap.repeat.set(.5,.5);")
rep("MAT.fascia=std({map:paint(256,(g,S)=>panels(g,S,'#a7b1b4',2)),roughness:.5,metalness:.4});","MAT.fascia=std({map:paint(256,(g,S)=>plating(g,S,'#cfd5d6','#d0702e','L')),roughness:.45,metalness:.35});MAT.fascia.map.repeat.set(.5,.5);")
rep("MAT.plate=std({map:paint(512,(g,S)=>panels(g,S,'#8f9a9e',4)),roughness:.55,metalness:.45});MAT.plateD=std({map:paint(256,(g,S)=>panels(g,S,'#5b666a',2)),roughness:.6,metalness:.5});",
    "MAT.plate=std({map:paint(512,(g,S)=>plating(g,S,'#c6cdcf','#d0702e','TH-09')),roughness:.5,metalness:.35});MAT.plate.map.repeat.set(.07,.07);MAT.plateD=std({map:paint(512,(g,S)=>plating(g,S,'#848f93','#d0702e','TH-09')),roughness:.55,metalness:.4});MAT.plateD.map.repeat.set(.07,.07);")
# ---------- rounded bulkhead frames on every doorway
rep(" function wall(ax,c,a0,a1,h,doors=[]){let s=a0;for(const[dc,dw,dh,tr]of doors.slice().sort((p,q)=>p[0]-q[0])){seg(ax,c,s,dc-dw/2,0,h);seg(ax,c,dc-dw/2,dc+dw/2,dh,h-dh);",
""" const frameGeo=(dw,dh)=>{const W=dw+3.2,Hh=dh+1.7,R=1.6,r=1,sh=new T.Shape();sh.moveTo(-W/2,0);sh.lineTo(-W/2,Hh-R);sh.quadraticCurveTo(-W/2,Hh,-W/2+R,Hh);sh.lineTo(W/2-R,Hh);sh.quadraticCurveTo(W/2,Hh,W/2,Hh-R);sh.lineTo(W/2,0);
   sh.lineTo(dw/2,0);sh.lineTo(dw/2,dh-r);sh.quadraticCurveTo(dw/2,dh,dw/2-r,dh);sh.lineTo(-dw/2+r,dh);sh.quadraticCurveTo(-dw/2,dh,-dw/2,dh-r);sh.lineTo(-dw/2,0);sh.lineTo(-W/2,0);
   const g=new T.ExtrudeGeometry(sh,{depth:3.2,bevelEnabled:false,curveSegments:6});g.translate(0,0,-1.6);return g};
 function wall(ax,c,a0,a1,h,doors=[]){let s=a0;for(const[dc,dw,dh,tr]of doors.slice().sort((p,q)=>p[0]-q[0])){seg(ax,c,s,dc-dw/2,0,h);seg(ax,c,dc-dw/2,dc+dw/2,dh,h-dh);
     {const fg=frameGeo(dw,dh);if(ax==='x'){fg.rotateY(Math.PI/2);fg.translate(c,0,dc)}else fg.translate(dc,0,c);addGeo(MAT.frame,fg);
      for(const o of[-1,1])for(const sd of[-1,1]){const a=dc+o*(dw/2+.8),d=sd*1.63;ax==='x'?box(c+d,1.2,a,.06,dh-2,.5,TRIM[tr||'c'],false):box(a,1.2,c+d,.5,dh-2,.06,TRIM[tr||'c'],false)}}""")
# ---------- exterior: bold markings and armour blisters on the pale hull
rep(" // the habitat ring:",""" {const PL=MAT.plate,PD=MAT.plateD,AC=MAT.accent,top=31.2;
  for(const z of[-215,-190,150,175])deco(GEO.box,AC,150,.25,7,0,top+.95,z,0,.42,0);
  for(const sx of[-1,1])for(const z of[-205,-125,95,205]){deco(GEO.box,PL,9,15,44,sx*(AX+5.5),9,z);deco(GEO.box,PD,5,9,30,sx*(AX+10),9,z);deco(GEO.box,AC,.4,9.2,4,sx*(AX+12.6),9,z+10);deco(GEO.box,MAT.win,.2,1,20,sx*(AX+12.6),12,z-3)}
  const mark=(t,x,y,z,rx,ry,w,hgt)=>{const tx=paint(512,(g,S)=>{g.clearRect(0,0,S,S);g.fillStyle='rgba(24,32,36,.85)';g.font='700 150px "Chakra Petch",sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(t,S/2,S/2)});
    const m=new T.Mesh(new T.PlaneGeometry(w,hgt),bas({map:tx,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4}));m.position.set(x,y,z);m.rotation.set(rx,ry,0);scene.add(m)};
  mark('TH-09',-70,top+1.2,120,-Math.PI/2,0,70,70);mark('TH-09',70,top+1.2,-110,-Math.PI/2,0,70,70)}
 // the habitat ring:""")
open(p,'w').write(s);print('ok')
