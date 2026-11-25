p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
# shuttle: build the fuselage geometry and material once
rep("""  {const pr=[[0,-7.0],[.28,-6.6],[.6,-5.8],[.86,-4.6],[1.04,-3.0],[1.14,-1.0],[1.16,1.2],[1.08,3.2],[.95,4.6],[.8,5.5],[.0,5.6]].map(([r,y])=>new T.Vector2(r,y)),fg=new T.LatheGeometry(pr,28);
    const ht=M.hull.map.clone();ht.needsUpdate=true;ht.repeat.set(3,2.2);const hn=M.hull.normalMap.clone();hn.needsUpdate=true;hn.repeat.set(3,2.2);const lm=std({map:ht,normalMap:hn,roughness:.38,metalness:.35});
    add(fg,lm,0,.12,0,Math.PI/2,0,0,1.5,1,.66)}""","""  {if(!M.fus){const pr=[[0,-7.0],[.28,-6.6],[.6,-5.8],[.86,-4.6],[1.04,-3.0],[1.14,-1.0],[1.16,1.2],[1.08,3.2],[.95,4.6],[.8,5.5],[.0,5.6]].map(([r,y])=>new T.Vector2(r,y));M.fus=new T.LatheGeometry(pr,28);
    const ht=M.hull.map.clone();ht.needsUpdate=true;ht.repeat.set(3,2.2);const hn=M.hull.normalMap.clone();hn.needsUpdate=true;hn.repeat.set(3,2.2);M.fusM=std({map:ht,normalMap:hn,roughness:.38,metalness:.35})}
    add(M.fus,M.fusM,0,.12,0,Math.PI/2,0,0,1.5,1,.66)}""")
i=s.index("function interceptorModel(){");j=s.index("const FTRC=")
s=s[:i]+r"""// enemy craft (original designs): built from shared geometry and materials, so spawning many costs little
let ESH=null;
function enemyShipKit(){if(ESH)return ESH;
  const panel=paint(256,(g,S)=>{g.fillStyle='#2b3036';g.fillRect(0,0,S,S);grime(g,S,1800,.05);g.strokeStyle='rgba(0,0,0,.55)';g.lineWidth=1.5;for(const y of[0,.34,.7])g.strokeRect(0,y*S,S,S*.34);for(const[x,y]of[[.3,0],[.75,.34],[.5,.7]]){g.beginPath();g.moveTo(x*S,y*S);g.lineTo(x*S,y*S+S*.34);g.stroke()}
    g.fillStyle='rgba(255,255,255,.05)';g.fillRect(S*.05,S*.05,S*.4,S*.24)}),seam=paint(256,(g,S)=>{g.fillStyle='#000';g.fillRect(0,0,S,S);g.fillStyle='#ff2a1e';g.fillRect(0,S*.33,S,S*.02);g.fillRect(S*.74,S*.34,S*.015,S*.36);g.fillRect(S*.1,S*.69,S*.5,S*.015)});
  panel.repeat.set(2,1.5);seam.repeat.set(2,1.5);const pN=normalMap(panel,1.4);pN.repeat.set(2,1.5);
  const mk=(r,y)=>new T.LatheGeometry(r.map(([a,b])=>new T.Vector2(a,b)),18);
  ESH={hull:std({map:panel,normalMap:pN,emissive:0xff2a1e,emissiveMap:seam,emissiveIntensity:1.1,roughness:.38,metalness:.7}),dark:std({color:0x1a1d21,roughness:.5,metalness:.75}),
    plate:std({color:0x4a2a2a,roughness:.45,metalness:.6}),eye:bas({color:0xff3a2a}),flame:bas({color:0xff5a2a,transparent:true,opacity:.75,blending:T.AdditiveBlending,depthWrite:false,fog:false}),
    win:bas({color:0xff6040}),
    ifus:mk([[0,5.2],[.22,4.7],[.5,3.6],[.72,1.8],[.8,0],[.74,-1.8],[.62,-3.0],[.0,-3.2]]),
    iwing:planform([[0,-1.0],[3.9,-2.4],[4.4,-1.8],[3.8,-.6],[0,1.4]],.16,.05),icanard:planform([[0,-.2],[1.4,-.9],[1.5,-.5],[0,.6]],.1,.03),
    gfus:mk([[0,9.5],[.5,8.6],[1.2,6.8],[1.6,3.0],[1.7,-2],[1.6,-6],[1.3,-8.6],[0,-8.8]]),
    nozzle:new T.CylinderGeometry(1,.8,1,14,1,true)};return ESH}
function emesh(g,geo,mat,x=0,y=0,z=0,rx=0,ry=0,rz=0,sx=1,sy=1,sz=1){const o=new T.Mesh(geo,mat);o.position.set(x,y,z);o.rotation.set(rx,ry,rz);o.scale.set(sx,sy,sz);g.add(o);return o}
function interceptorModel(){const K=enemyShipKit(),g=new T.Group();
  emesh(g,K.ifus,K.hull,0,0,0,Math.PI/2,0,0,1.25,1,.62);
  for(const sx of[-1,1]){const w=emesh(g,K.iwing,K.hull,sx*.55,-.1,-.4,0,0,sx*-.12);w.scale.x=sx;emesh(g,K.icanard,K.dark,sx*.5,.05,3.0,0,0,sx*.1).scale.x=sx;
    emesh(g,GEO.box,K.plate,sx*3.9,-.08,.2,0,0,0,.18,.5,1.6);emesh(g,GEO.cyl,K.dark,sx*1.0,-.05,-2.6,Math.PI/2,0,0,.42,1.6,.42);
    const n=emesh(g,K.nozzle,K.dark,sx*1.0,-.05,-3.5,Math.PI/2,0,0,.42,.4,.42);const f=emesh(g,GEO.cone,K.flame,sx*1.0,-.05,-4.6,Math.PI/2,0,0,.34,1.8,.34);f.userData.flame=1;
    emesh(g,GEO.cyl,K.dark,sx*1.5,-.35,2.2,Math.PI/2,0,0,.07,1.6,.07)}
  emesh(g,GEO.box,K.dark,0,.62,-.6,0,0,0,.18,.5,2.2);emesh(g,GEO.sph,K.eye,0,.32,3.3,0,0,0,.26,.16,.34);
  const e=glow(0xff3030,3.2,.95);e.position.set(0,.35,3.5);g.add(e);const t=glow(0xff6a3a,4.5,.8);t.position.set(0,0,-4.4);g.add(t);return g}
function gunboatModel(){const K=enemyShipKit(),g=new T.Group();
  emesh(g,K.gfus,K.hull,0,0,0,Math.PI/2,0,0,1.55,1,.85);emesh(g,GEO.box,K.dark,0,1.45,-.5,0,0,0,1.6,.8,10);emesh(g,GEO.box,K.plate,0,-1.35,0,0,0,0,2.2,.5,12);
  for(const sx of[-1,1]){emesh(g,GEO.box,K.plate,sx*2.7,-.2,-1,0,0,sx*.25,1,1.6,9);emesh(g,GEO.box,K.dark,sx*3.2,.2,-4,0,0,0,.6,.6,3);
    for(let k=0;k<5;k++)emesh(g,GEO.box,K.win,sx*2.55,.35,4-k*1.8,0,0,0,.05,.18,.9);
    const tb=emesh(g,GEO.cyl,K.dark,sx*1.6,1.9,2.5,0,0,0,.9,.5,.9),th=emesh(g,GEO.box,K.plate,sx*1.6,2.35,2.6,0,0,0,1.1,.55,1.4);for(const o of[-.22,.22])emesh(g,GEO.cyl,K.dark,sx*1.6+o,2.35,4.2,Math.PI/2,0,0,.11,2.6,.11)}
  for(const[x,y]of[[0,.2],[-1.1,-.4],[1.1,-.4]]){emesh(g,K.nozzle,K.dark,x,y,-9.2,Math.PI/2,0,0,.62,.9,.62);emesh(g,GEO.cone,K.flame,x,y,-11.2,Math.PI/2,0,0,.5,3,.5)}
  emesh(g,GEO.cyl,K.dark,.6,2.4,-4,0,0,0,.05,2.4,.05);emesh(g,GEO.sph,K.eye,0,.6,9.3,0,0,0,.6,.3,.4);
  for(const z of[-5,0,5]){const q=glow(0xff3030,2.6,.9);q.position.set(0,1.95,z);g.add(q)}{const q=glow(0xff7a40,10,.8);q.position.set(0,0,-11);g.add(q)}{const q=glow(0xff3030,5,.95);q.position.set(0,.6,9.6);g.add(q)}return g}
"""+s[j:]
open(p,'w').write(s);print('ok')
