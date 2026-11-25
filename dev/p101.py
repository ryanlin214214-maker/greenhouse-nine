# v93 F: space-flight atmosphere. Removes the backdrop "traffic lane" dot strings, hides the indoor dust motes in flight
# and outdoors at Meridian, sparser fainter stars, smaller sun/Jupiter halos, subtler speed streaks that grow with the
# afterburner, Europa lit by the sun (terminator, limb darkening, thin bright rim on the lit limb), fainter nebula.
import sys
s=open(sys.argv[1]).read()
def R(a,b,n=1):
    global s
    c=s.count(a)
    assert c==n,(c,a[:80])
    s=s.replace(a,b)
# 1. the two (four) dotted rows: distant traffic drawn as 30 evenly spaced points per lane. Not added any more.
R("pm.frustumCulled=false;FAR.add(pm);","pm.frustumCulled=false;pm.visible=false;")
# 2. stars: 380 instead of 600, most very faint and small; a few brighter ones in their own layer; slight colour variety
R("const p=[],pc=[];for(let i=0;i<600;i++){const a=Math.random()*6.283,e=Math.acos(Math.random()*1.25-0.25),r=4200;p.push(Math.sin(e)*Math.cos(a)*r,Math.cos(e)*r,Math.sin(e)*Math.sin(a)*r);const b=.12+.88*Math.pow(Math.random(),4),t=Math.random();pc.push(b*(t<.15?.8:1),b*(t<.15?.88:1),b*(t>.85?.8:1))}",
  "const p=[],pc=[],p2=[],pc2=[];for(let i=0;i<380;i++){const a=Math.random()*6.283,e=Math.acos(Math.random()*1.25-0.25),r=4200,br=i<22,P=br?p2:p,C=br?pc2:pc;P.push(Math.sin(e)*Math.cos(a)*r,Math.cos(e)*r,Math.sin(e)*Math.sin(a)*r);const b=br?.55+.45*Math.random():.05+.42*Math.pow(Math.random(),3),t=Math.random();C.push(b*(t<.18?.78:t>.82?1:.95),b*(t<.18?.86:.97),b*(t>.82?.78:1))}"
  "{const g2=new T.BufferGeometry();g2.setAttribute('position',new T.Float32BufferAttribute(p2,3));g2.setAttribute('color',new T.Float32BufferAttribute(pc2,3));FAR.add(new T.Points(g2,new T.PointsMaterial({color:0xffffff,vertexColors:true,size:2,sizeAttenuation:false,fog:false})))}")
R("FAR.add(new T.Points(g,new T.PointsMaterial({color:0xffffff,vertexColors:true,size:1.5,","FAR.add(new T.Points(g,new T.PointsMaterial({color:0xffffff,vertexColors:true,size:1.15,")
# 3. a crisp small sun with a faint halo, and a fainter, tighter halo round Jupiter
R("[[0xfff2d0,260,1],[0xffd9a0,1500,0.2]]","[[0xfff2d0,150,1],[0xffd9a0,900,0.07]]")
R("q.position.set(2000,3320,1000);FAR.add(q)}","q.position.set(2000,3320,1000);FAR.add(q);if(sz===150)FARX.sun=q}")
R("const halo=glow(0xffd8a8,4200,0.18)","const halo=glow(0xffd8a8,3000,0.07)")
# 4. fainter, narrower nebula band and horizon tint
R("return[4+col[0]*neb*0.4+10*hz,7+col[1]*neb*0.4+38*hz,16+col[2]*neb*0.45+48*hz]","return[3+col[0]*neb*0.22+6*hz+3*m,5+col[1]*neb*0.2+16*hz+2*m,12+col[2]*neb*0.26+24*hz+5*m]")
# 5. Europa: lit by the sun (day side, soft terminator, faint Jupiter-shine on the night side), limb darkening;
#    its colour multiplier is still m.color so spaceDim keeps working. A thin rim only where sunlight grazes the limb.
R("const planet=mesh(new T.SphereGeometry(1,96,64),bas({map:land,color:0x66717e,fog:false}),R,R,R);",
  "const EUC=new T.Color(0x8a96a4),EUS={value:new T.Vector3(.4,.8,.2)},EUM=new T.ShaderMaterial({uniforms:{map:{value:land},uCol:{value:EUC},uSun:EUS},fog:false,"
  "vertexShader:'varying vec2 vUv;varying vec3 vW;varying vec3 vV;void main(){vUv=uv*vec2(3.0,2.0);vec4 w=modelMatrix*vec4(position,1.0);vW=normalize(mat3(modelMatrix)*normal);vV=normalize(cameraPosition-w.xyz);gl_Position=projectionMatrix*viewMatrix*w;}',"
  "fragmentShader:'uniform sampler2D map;uniform vec3 uCol;uniform vec3 uSun;varying vec2 vUv;varying vec3 vW;varying vec3 vV;void main(){vec3 n=normalize(vW);float l=dot(n,normalize(uSun));float day=smoothstep(-0.12,0.35,l)*(0.35+0.65*max(l,0.0));float mu=max(dot(n,normalize(vV)),0.0);float limb=0.55+0.45*pow(mu,0.35);vec3 c=texture2D(map,vUv).rgb*uCol;vec3 o=c*(day*1.35+0.035)*limb;gl_FragColor=vec4(o,1.0);}'});"
  "EUM.color=EUC;const planet=mesh(new T.SphereGeometry(1,160,112),EUM,R,R,R);FARX.eus=EUS;")
R("R+126,R+126,R+126));","R+126,R+126,R+126));pg.children[pg.children.length-1].visible=false;"
  "{const rm=new T.ShaderMaterial({uniforms:{uSun:EUS},transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,"
  "vertexShader:'varying vec3 vW;varying vec3 vV;void main(){vec4 w=modelMatrix*vec4(position,1.0);vW=normalize(mat3(modelMatrix)*normal);vV=normalize(cameraPosition-w.xyz);gl_Position=projectionMatrix*viewMatrix*w;}',"
  "fragmentShader:'uniform vec3 uSun;varying vec3 vW;varying vec3 vV;void main(){vec3 n=normalize(vW);float f=1.0-max(dot(n,normalize(vV)),0.0);float edge=pow(f,7.0)*smoothstep(1.0,0.75,f);float lit=smoothstep(-0.2,0.4,dot(n,normalize(uSun)));gl_FragColor=vec4(pow(vec3(0.62,0.78,1.0)*edge*lit*0.55,vec3(2.2)),1.0);}'});"
  "pg.add(mesh(new T.SphereGeometry(1,160,112),rm,R+45,R+45,R+45))}"
  # keep the sun direction (world space, from the planet to the sun sprite) current every frame
  "farAnim.push(()=>{const sn=FARX.sun;if(!sn)return;const a=new T.Vector3(),b=new T.Vector3();sn.getWorldPosition(a);pg.getWorldPosition(b);EUS.value.copy(a.sub(b)).normalize()});")
# 6. motes are indoor dust: hidden in flight and outdoors at Meridian (they read as blurry specks against space)
R("{const a=motes.geometry.attributes.position.array,c=cam.position;","motes.visible=!FLY&&!(typeof HUB!=='undefined'&&HUB.on);{const a=motes.geometry.attributes.position.array,c=cam.position;")
# 7. speed streaks: 40 instead of 110, faint in cruise, a little stronger and longer on the afterburner
R("const FDUST=(()=>{const N=110","const FDUST=(()=>{const N=40")
R("opacity:.22,fog:false,depthWrite:false","opacity:.06,fog:false,depthWrite:false")
R("function dustTick(){const D=FDUST,c=cam.position,v=FLY.vel,k=Math.max(.4,FLY.spd*.045);",
  "function dustTick(){const D=FDUST,c=cam.position,v=FLY.vel;D.bk=(D.bk||0)+(((FLY.bk?1:0))-(D.bk||0))*.05;const k=Math.max(.3,FLY.spd*(.022+.03*D.bk));D.l.material.opacity=.05+.11*D.bk;")
R("if(bk)S.boost=Math.max(0,S.boost-dt/6);","S.bk=bk;if(bk)S.boost=Math.max(0,S.boost-dt/6);")
# 8. Jupiter: softer, more numerous bands (blurred, muted), a smooth sphere (was 24x16 segments: faceted edge) lit by the
#    sun with a terminator and limb darkening, and a thin warm haze rim on the lit limb
R("g.fillStyle='#b8573a';g.beginPath();g.ellipse(S*.62,S*.64,S*.07,S*.035,0,0,7);g.fill();g.fillStyle='#d27a52';g.beginPath();g.ellipse(S*.62,S*.64,S*.045,S*.02,0,0,7);g.fill()});",
  "g.fillStyle='#b8573a';g.beginPath();g.ellipse(S*.62,S*.64,S*.07,S*.035,0,0,7);g.fill();g.fillStyle='#d27a52';g.beginPath();g.ellipse(S*.62,S*.64,S*.045,S*.02,0,0,7);g.fill();"
  "g.filter='blur(3px)';g.drawImage(g.canvas,0,0);g.filter='none';g.fillStyle='rgba(214,196,168,.28)';g.fillRect(0,0,S,S);for(let y2=0;y2<S;y2+=3){g.fillStyle='rgba(120,80,50,'+(hash(y2,77)*.06)+')';g.fillRect(0,y2,S,2)}});")
R("FAR.add(mesh(GEO.sph,new T.MeshLambertMaterial({map:pt,fog:false}),1300,1300,1300,...P));",
  "{const JC=new T.Color(0xc8c0b4),JS={value:new T.Vector3(.5,.8,-.3)},jm=new T.ShaderMaterial({uniforms:{map:{value:pt},uCol:{value:JC},uSun:JS},fog:false,"
  "vertexShader:'varying vec2 vUv;varying vec3 vW;varying vec3 vV;void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.0);vW=normalize(mat3(modelMatrix)*normal);vV=normalize(cameraPosition-w.xyz);gl_Position=projectionMatrix*viewMatrix*w;}',"
  "fragmentShader:'uniform sampler2D map;uniform vec3 uCol;uniform vec3 uSun;varying vec2 vUv;varying vec3 vW;varying vec3 vV;void main(){vec3 n=normalize(vW);float l=dot(n,normalize(uSun));float day=smoothstep(-0.08,0.4,l)*(0.3+0.7*max(l,0.0));float mu=max(dot(n,normalize(vV)),0.0);float limb=0.45+0.55*pow(mu,0.45);vec3 c=texture2D(map,vUv).rgb*uCol;float rim=pow(1.0-mu,6.0)*smoothstep(-0.1,0.5,l);vec3 o=c*(day*1.25+0.02)*limb+vec3(0.9,0.7,0.45)*rim*0.25;gl_FragColor=vec4(o,1.0);}'});"
  "jm.color=JC;const jp=mesh(new T.SphereGeometry(1,96,64),jm,1300,1300,1300,...P);FAR.add(jp);"
  "farAnim.push(()=>{const sn=FARX.sun;if(!sn)return;const a=new T.Vector3(),b=new T.Vector3();sn.getWorldPosition(a);jp.getWorldPosition(b);JS.value.copy(a.sub(b)).normalize()})}")
open(sys.argv[2],'w').write(s);print('p101 ok')
