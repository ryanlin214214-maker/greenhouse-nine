s=open('/home/user/greenhouse-nine/index.html').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
rep("scene.add(new T.HemisphereLight(0xdce8f0,0x8a9498,1.15));","const __hemi=new T.HemisphereLight(0xdce8f0,0x8a9498,1.15);scene.add(__hemi);window.__hemi=__hemi;")
rep(" // the habitat ring:",r""" {const MO=location.hash==='#B'?1:0,Z0=-110,Z1=-47,L=Z1-Z0,zc=(Z0+Z1)/2,H=5,ACC=MO?'#ff8a3c':'#d0702e';
  const rr=(g,x,y,w,h,r)=>{g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()};
  const wallT=paint(512,(g,S)=>{g.fillStyle=MO?'#848e93':'#c3cacc';g.fillRect(0,0,S,S);grime(g,S,2500,.04);
    g.fillStyle='rgba(0,0,0,.22)';g.fillRect(0,0,S,S*.17);g.strokeStyle='rgba(12,18,22,.7)';g.lineWidth=3;g.beginPath();g.moveTo(0,S*.17);g.lineTo(S,S*.17);g.stroke();
    for(let k=0;k<5;k++){g.fillStyle='rgba(0,0,0,.4)';rr(g,S*(.12+k*.16),S*.05,S*.11,S*.07,6);g.fill()}
    g.fillStyle='rgba(0,0,0,.1)';rr(g,S*.1,S*.23,S*.8,S*.5,S*.05);g.fill();g.strokeStyle='rgba(12,18,22,.65)';g.lineWidth=3;g.stroke();g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=1.5;rr(g,S*.1+3,S*.23+3,S*.8,S*.5,S*.05);g.stroke();
    g.strokeStyle='rgba(12,18,22,.5)';g.lineWidth=2;g.beginPath();g.moveTo(S*.38,S*.23);g.lineTo(S*.38,S*.73);g.moveTo(S*.66,S*.23);g.lineTo(S*.66,S*.73);g.moveTo(S*.38,S*.5);g.lineTo(S*.66,S*.5);g.stroke();
    g.fillStyle='rgba(0,0,0,.3)';rr(g,S*.7,S*.3,S*.16,S*.16,8);g.fill();g.strokeStyle='rgba(12,18,22,.6)';for(let k=0;k<6;k++){g.beginPath();g.moveTo(S*.72,S*(.325+k*.022));g.lineTo(S*.84,S*(.325+k*.022));g.stroke()}
    g.fillStyle=ACC;g.fillRect(S*.14,S*.29,S*.035,S*.14);g.fillRect(S*.72,S*.62,S*.12,S*.03);g.fillStyle='rgba(40,165,185,.85)';g.fillRect(S*.42,S*.44,S*.1,S*.02);
    g.fillStyle='rgba(12,18,22,.7)';g.font='700 '+Math.round(S*.09)+'px "Chakra Petch",monospace';g.fillText('S-07',S*.42,S*.37);g.font='600 '+Math.round(S*.03)+'px monospace';g.fillText('FORE SPINE / BAY',S*.42,S*.6);
    g.fillStyle=ACC;g.fillRect(0,S*.765,S,S*.014);g.fillStyle='rgba(8,12,14,.8)';g.fillRect(0,S*.86,S,S*.14);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(0,S*.86,S,2);
    const gr=g.createLinearGradient(0,0,0,S);gr.addColorStop(0,'rgba(0,0,0,.4)');gr.addColorStop(.22,'rgba(0,0,0,0)');gr.addColorStop(.68,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.45)');g.fillStyle=gr;g.fillRect(0,0,S,S)});
  wallT.repeat.set(2/7,2/H);const mW=std({map:wallT,roughness:.5,metalness:.25});
  const floorT=paint(512,(g,S)=>{g.fillStyle=MO?'#22282b':'#353e42';g.fillRect(0,0,S,S);grime(g,S,5000,.05);
    g.fillStyle=MO?'#343c40':'#56626a';g.fillRect(S*.36,0,S*.28,S);g.fillStyle=ACC;g.fillRect(S*.355,0,S*.008,S);g.fillRect(S*.637,0,S*.008,S);
    g.strokeStyle='rgba(0,0,0,.5)';g.lineWidth=2;g.beginPath();g.moveTo(0,1);g.lineTo(S,1);g.moveTo(0,S/2);g.lineTo(S*.36,S/2);g.moveTo(S*.64,S/2);g.lineTo(S,S/2);g.moveTo(S*.18,0);g.lineTo(S*.18,S);g.moveTo(S*.82,0);g.lineTo(S*.82,S);g.stroke();
    g.strokeStyle='rgba(255,255,255,.16)';g.lineWidth=5;g.beginPath();g.moveTo(S*.46,S*.56);g.lineTo(S*.5,S*.44);g.lineTo(S*.54,S*.56);g.stroke();
    g.fillStyle='rgba(255,255,255,.1)';for(let k=0;k<8;k++){g.fillRect(S*.03,S*(.06+k*.125),S*.05,S*.012);g.fillRect(S*.92,S*(.06+k*.125),S*.05,S*.012)}});
  floorT.repeat.set(2/14,2/7);const mF=std({map:floorT,roughness:.45,metalness:.35});
  const mC=std({color:MO?0x2b3236:0x8a9498,roughness:.7,metalness:.3}),mR=std({color:MO?0xb4bbbd:0x39464c,roughness:.5,metalness:.3}),
    strip=bas({color:MO?0xffb070:0xf2fbff}),bar=bas({color:MO?0x46c8e0:0xe0702a}),mDoor=std({color:MO?0x3a4246:0x59646a,roughness:.5,metalness:.5});
  box(0,0,zc,14,.13,L,mF,false);box(0,H,zc,15.2,.5,L,mC,false);
  for(const o of[-1,1]){box(o*7.3,0,zc,.6,H,L,mW,false);deco(GEO.box,mC,2.4,.3,L,o*6.25,H-.8,zc,0,0,o*.785);deco(GEO.box,strip,.3,.05,L,o*6.1,H-.96,zc,0,0,o*.785)}
  const sh=new T.Shape(),W=7.4,Hh=5.3,iw=5,ih=4.2,r=1.5;sh.moveTo(-W,0);sh.lineTo(-W,Hh);sh.lineTo(W,Hh);sh.lineTo(W,0);sh.lineTo(iw,0);sh.lineTo(iw,ih-r);sh.quadraticCurveTo(iw,ih,iw-r,ih);sh.lineTo(-iw+r,ih);sh.quadraticCurveTo(-iw,ih,-iw,ih-r);sh.lineTo(-iw,0);sh.lineTo(-W,0);
  for(let z=Z0+7;z<Z1-1;z+=7){const g=new T.ExtrudeGeometry(sh,{depth:1.1,bevelEnabled:false,curveSegments:8});g.translate(0,0,z-.55);addGeo(mR,g);
    for(const o of[-1,1]){box(o*4.96,.7,z,.06,2.4,.4,bar,false);box(o*6,0,z,2,.5,1.5,mC,false)}
    box(0,H-.08,z+3.5,.8,.08,4,strip,false);const pl=new T.PointLight(MO?0xff9548:0xe6f2ff,MO?1.5:.85,14,1.5);pl.position.set(0,H-.9,z+3.5);scene.add(pl)}
  box(0,0,Z0-.3,14,H,.6,mW,false);box(0,0,Z0+.06,5.6,4.1,.16,mR,false);box(0,0,Z0+.14,4.4,3.5,.14,mDoor,false);box(0,1.7,Z0+.22,4.4,.22,.04,bar,false);box(0,3.7,Z0+.16,2.4,.16,.05,strip,false);
  window.__hemi.intensity=MO?.2:.5;window.__hemi.groundColor.set(MO?0x1c2226:0x4a5256)}
 // the habitat ring:""")
open('sample.html','w').write(s);print('ok')
