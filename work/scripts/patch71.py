p='/home/user/greenhouse-nine/index.html'
s=open(p).read()
R=[
("for(const s of[-1,1]){R(A1,.25*bp,.08*bp,.32*bp,s*.42,.66,0,0,0,-s*.32);R(A1,.2*bp,.07*bp,.28*bp,s*(.42+.05*bp),.6,0,0,0,-s*.55);a(GEO.sph,A2,.1,.1,.1,s*.38,.52,0)}",
 "for(const s of[-1,1]){R(A1,.24*bp,.07*bp,.31*bp,s*.42,.64,0,0,0,-s*.18);R(A1,.07*bp,.17*bp,.27*bp,s*(.5+.04*bp),.56,0,0,0,-s*.08);a(GEO.box,AM,.012,.02,.16,s*(.54+.04*bp),.6,0);a(GEO.sph,A2,.1,.1,.1,s*.38,.52,0)}"),
("const jt=paint(128,(g,S)=>{g.fillStyle='#4a5056';g.fillRect(0,0,S,S);grime(g,S,900,.06);g.fillStyle='rgba(0,0,0,.28)';for(let y=0;y<S;y+=8)g.fillRect(0,y,S,2);g.fillStyle='rgba(255,255,255,.07)';for(let y=3;y<S;y+=8)g.fillRect(0,y,S,1)});",
 "const jt=paint(128,(g,S)=>{g.fillStyle='#4a5056';g.fillRect(0,0,S,S);grime(g,S,1400,.05);for(let k=0;k<40;k++){g.fillStyle='rgba(255,255,255,'+(.02+hash(k,21)*.03)+')';g.fillRect(0,hash(k,22)*S,S,1)}g.fillStyle='rgba(0,0,0,.18)';g.fillRect(0,S*.5,S,1.5)});"),
("jt.repeat.set(5,5);const jn=normalMap(jt,2.5);","jt.repeat.set(3,3);const jn=normalMap(jt,1.5);"),
("const fr=mesh(GEO.tor,MAT.cell,.8,.8,.8,0,0,0);fr.scale.z=.3;shield.add(fr)}",
 "for(let k=0;k<6;k++){const an=(k+.5)*Math.PI/3,b=mesh(GEO.box,CM.joint,.8,.04,.035,Math.cos(an)*.69,Math.sin(an)*.69,0);b.rotation.z=an+Math.PI/2;shield.add(b);shield.add(mesh(GEO.sph,MAT.strip,.035,.035,.035,Math.cos(k*Math.PI/3)*.8,Math.sin(k*Math.PI/3)*.8,0))}}"),
("shieldM=bas({color:0x6fd8ff,transparent:true,opacity:.32,","shieldM=bas({color:0x6fd8ff,transparent:true,opacity:.16,"),
("shieldM.opacity=.25+.1*Math.sin(t*6)","shieldM.opacity=.13+.05*Math.sin(t*6)"),
]
for a,b in R:
  assert s.count(a)==1,a[:60]; s=s.replace(a,b)
open(p,'w').write(s);print('ok')
