p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
rep("function plating(g,S,base,acc,tag){","""function decking(g,S,base){g.fillStyle=base;g.fillRect(0,0,S,S);grime(g,S,S*8,.06);const p=S/2,lw=Math.max(1.5,S/200);
  for(let i=0;i<2;i++)for(let j=0;j<2;j++){const x=i*p,y=j*p;g.strokeStyle='rgba(14,20,24,.6)';g.lineWidth=lw;g.strokeRect(x+lw/2,y+lw/2,p-lw,p-lw);g.strokeStyle='rgba(255,255,255,.16)';g.lineWidth=1;g.strokeRect(x+lw*1.5,y+lw*1.5,p-lw*3,p-lw*3);
    if((i+j)%2){g.fillStyle='rgba(0,0,0,.1)';g.fillRect(x+p*.12,y+p*.12,p*.76,p*.76);g.strokeStyle='rgba(14,20,24,.3)';g.lineWidth=lw;for(let k=0;k<9;k++){g.beginPath();g.moveTo(x+p*.16,y+p*(.18+k*.08));g.lineTo(x+p*.84,y+p*(.18+k*.08));g.stroke()}}
    g.fillStyle='rgba(14,20,24,.55)';for(const[a,b]of[[.06,.06],[.94,.06],[.06,.94],[.94,.94]]){g.beginPath();g.arc(x+p*a,y+p*b,S*.008,0,7);g.fill()}}
  g.fillStyle='rgba(208,112,46,.8)';g.fillRect(S*.03,S*.47,S*.1,S*.015);g.fillRect(S*.53,S*.97,S*.1,S*.015)}
function ceilTex(em){return paint(256,(g,S)=>{g.fillStyle=em?'#000':'#a9b2b5';g.fillRect(0,0,S,S);if(!em){grime(g,S,1200,.04);g.strokeStyle='rgba(14,20,24,.55)';g.lineWidth=2;g.strokeRect(1,1,S-2,S-2);g.beginPath();g.moveTo(S/2,0);g.lineTo(S/2,S);g.moveTo(0,S/2);g.lineTo(S,S/2);g.stroke();
    g.fillStyle='rgba(0,0,0,.28)';g.fillRect(S*.08,S*.2,S*.34,S*.1);g.fillRect(S*.58,S*.7,S*.34,S*.1);g.fillStyle='rgba(0,0,0,.14)';g.fillRect(S*.6,S*.1,S*.3,S*.3);g.strokeStyle='rgba(14,20,24,.35)';for(let k=0;k<6;k++){g.beginPath();g.moveTo(S*.63,S*(.14+k*.045));g.lineTo(S*.87,S*(.14+k*.045));g.stroke()}}
  g.fillStyle=em?'#fff':'#eef6f8';g.fillRect(S*.1,S*.225,S*.3,S*.05);g.fillRect(S*.6,S*.725,S*.3,S*.05)})}
function plating(g,S,base,acc,tag){""")
rep("floor:paint(lowFx?256:512,(g,S)=>{panels(g,S,'#2b3a3a',2);g.strokeStyle='rgba(255,178,56,.35)';g.lineWidth=2;g.strokeRect(20,20,S/2-40,S/2-40)}),","floor:paint(lowFx?256:512,(g,S)=>decking(g,S,'#778388')),")
rep("metal:paint(128,(g,S)=>{g.fillStyle='#34454a';g.fillRect(0,0,S,S);grime(g,S,900,0.08);g.strokeStyle='rgba(0,0,0,.45)';","metal:paint(128,(g,S)=>{g.fillStyle='#6c797d';g.fillRect(0,0,S,S);grime(g,S,900,0.06);g.strokeStyle='rgba(0,0,0,.28)';")
rep("MAT.deck=std({map:paint(256,(g,S)=>{g.fillStyle='#2a3436';g.fillRect(0,0,S,S);grime(g,S,1500,.06);for(let i=0;i<4;i++)for(let j=0;j<4;j++){g.fillStyle=(i+j)%2?'#303b3d':'#283133';","MAT.deck=std({map:paint(256,(g,S)=>{g.fillStyle='#737f83';g.fillRect(0,0,S,S);grime(g,S,1500,.05);for(let i=0;i<4;i++)for(let j=0;j<4;j++){g.fillStyle=(i+j)%2?'#869195':'#7a868a';")
rep("MAT.roof=std({color:0x3a4448,roughness:.8,metalness:.4});","MAT.roof=std({map:ceilTex(0),emissive:0xffffff,emissiveMap:ceilTex(1),emissiveIntensity:.6,roughness:.7,metalness:.2});MAT.roof.map.repeat.set(.25,.25);MAT.roof.emissiveMap.repeat.set(.25,.25);")
rep("MAT.armorD=std({color:0x16272c,roughness:0.5,metalness:0.6});","MAT.armorD=std({color:0x2b3b41,roughness:0.5,metalness:0.5});")
rep("MAT.skirt=std({color:0x0c1214,roughness:.8,metalness:.4});","MAT.skirt=std({color:0x2a3338,roughness:.8,metalness:.4});")
rep("new T.HemisphereLight(0xc8e0ff,0x3a4448,1.05)","new T.HemisphereLight(0xdce8f0,0x8a9498,1.15)")
open(p,'w').write(s);print('ok')
