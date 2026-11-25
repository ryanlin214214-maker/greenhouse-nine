p='/home/user/greenhouse-nine/index.html'
s=open(p).read()
def rep(a,b):
  global s
  assert s.count(a)==1,(s.count(a),a[:80]); s=s.replace(a,b)
rep("const VK=fn=>inst(bake(fn),false);",
"""// first-person pieces: every box becomes a bevelled one at its real size, so edges catch the light
const VK=fn=>inst(bake(a=>fn((geo,mat,sx,sy,sz,...r)=>geo===GEO.box&&Math.min(sx,sy,sz)>.012?a(cbox(sx,sy,sz,Math.min(.022,Math.min(sx,sy,sz)*.22)),mat,1,1,1,...r):a(geo,mat,sx,sy,sz,...r))),false);""")
old_arms=s[s.index("function armsKit(a,fgz){"):s.index("// Arc Welder:")]
rep(old_arms,"""function armsKit(a,fgz){const CM=charMats(),P=CM.plate[7],J2=CM.joint,G=MAT.glove,AM=MAT.amber;
  // right hand around the grip: palm, three finger rows, thumb, knuckle plate, wrist cuff, armoured sleeve
  a(GEO.box,G,.11,.12,.12,.02,-.21,.25);for(let i=0;i<3;i++)a(GEO.box,G,.1,.032,.045,.0,-.165-i*.036,.185);a(GEO.box,G,.04,.09,.1,-.06,-.17,.2,0,0,.15);
  a(GEO.box,P,.035,.1,.1,.08,-.2,.24);a(GEO.box,J2,.12,.06,.12,.04,-.27,.29,.5,0,0);a(GEO.box,P,.145,.12,.16,.045,-.33,.34,.5,0,0);a(GEO.box,J2,.11,.1,.2,.05,-.38,.45,.5,0,0);a(GEO.box,AM,.006,.02,.07,.119,-.33,.34,.5,0,0);
  // left hand under the front grip
  a(GEO.box,G,.13,.08,.15,-.02,-.15,fgz);for(let i=0;i<3;i++)a(GEO.box,G,.035,.075,.04,.07,-.1,fgz-.045+i*.045);a(GEO.box,P,.03,.07,.12,-.09,-.15,fgz);
  a(GEO.box,P,.13,.12,.15,-.06,-.21,fgz+.12,.2,.4,0);a(GEO.box,J2,.1,.09,.2,-.1,-.24,fgz+.22,.2,.4,0)}
""")
rep("MAT.gunL=std({color:0xaab4b8,roughness:.38,metalness:.55});",
"""MAT.gunL=std({color:0xaab4b8,roughness:.38,metalness:.55});
// worn metal: fine scratches and grime on every gun material (first person and props)
{const wt=paint(256,(g,S)=>{g.fillStyle='#f0f0f0';g.fillRect(0,0,S,S);grime(g,S,1800,.05);for(let k=0;k<70;k++){const x=hash(k,31)*S,y=hash(k,32)*S,an=hash(k,33)*6.28,l=4+hash(k,34)*22;g.strokeStyle=k%3?'rgba(255,255,255,.18)':'rgba(0,0,0,.14)';g.lineWidth=.7;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(an)*l,y+Math.sin(an)*l);g.stroke()}
    for(let k=0;k<8;k++){g.fillStyle='rgba(0,0,0,'+(.02+hash(k,35)*.04)+')';g.beginPath();g.arc(hash(k,36)*S,hash(k,37)*S,8+hash(k,38)*30,0,7);g.fill()}});
  wt.repeat.set(3,3);const wn=normalMap(wt,2);wn.wrapS=wn.wrapT=T.RepeatWrapping;wn.repeat.copy(wt.repeat);
  for(const m of[MAT.gun,MAT.gunD,MAT.gunL,MAT.gunO,MAT.lance]){m.map=wt;m.normalMap=wn;m.normalScale=new T.Vector2(.6,.6);m.needsUpdate=true}}""")
open(p,'w').write(s);print('ok')
