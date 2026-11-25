import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)

# ---- v89: drivable cars at Meridian. An original two-seat "runabout": a shaped body extruded from a side profile, a tinted
# glass canopy, four wheels (tyre, rim, hub) that spin with speed and steer at the front, headlight and tail-light strips,
# gold trim, mirrors, a small spoiler and a cockpit (seats, wheel, dashboard screen). They use the game's existing car
# driving (E in and out, W/S, A/D, Shift, Space brake, chase camera) and Meridian's walls and edges.
CAR = r"""
function meriCarModel(col){const g=new T.Group(),paint=std({color:col,roughness:.28,metalness:.6}),trim=std({color:0xc9a24a,roughness:.3,metalness:.9}),dark=std({color:0x15191d,roughness:.6,metalness:.4}),
  tyre=std({color:0x121314,roughness:.9,metalness:0}),rim=std({color:0xb8bec4,roughness:.25,metalness:.95}),glass=std({color:0x0b1a24,roughness:.05,metalness:.85,transparent:true,opacity:.82}),
  seat=std({color:0x3a2a22,roughness:.7,metalness:.05}),head=bas({color:0xeaf6ff}),tail=bas({color:0xff2a22}),scr=bas({color:0x46c8e0}),Y=-1.3;
  const add=(geo,m,x,y,z,rx,ry,rz,sx,sy,sz)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.rotation.set(rx||0,ry||0,rz||0);if(sx)o.scale.set(sx,sy,sz);o.castShadow=true;g.add(o);return o};
  // body: side profile (z forward is -z, y up), wheel arches cut as gentle bumps in the sill line
  const body=PF('runBody',[[-2.3,.25],[-2.34,.5],[-2.2,.72],[-1.3,.86],[-.65,1.36],[.55,1.44],[1.45,1.02],[2.2,.92],[2.33,.62],[2.28,.25],[1.85,.25],[1.75,.55],[1.05,.55],[.95,.25],[-.95,.25],[-1.05,.55],[-1.75,.55],[-1.85,.25]],1.92,.09);
  add(body,paint,0,Y,0);
  add(PF('runGlass',[[-1.22,.9],[-.62,1.34],[.52,1.42],[1.36,1.04],[1.2,.98],[-.98,.95]],1.74,.03),glass,0,Y+.02,0);
  add(PF('runSill',[[-2.0,.28],[2.0,.28],[2.0,.4],[-2.0,.4]],2.0,.03),dark,0,Y,0);
  for(const s2 of[-1,1]){add(new T.BoxGeometry(.03,.05,3.2),trim,s2*.97,Y+.78,-.05);add(new T.BoxGeometry(.18,.1,.22),paint,s2*1.02,Y+1.0,-.75);add(new T.BoxGeometry(.04,.08,.18),glass,s2*1.1,Y+1.0,-.75)}
  add(new T.BoxGeometry(1.5,.06,.06),head,0,Y+.66,-2.33);for(const s2 of[-1,1])add(new T.BoxGeometry(.32,.12,.05),head,s2*.68,Y+.6,-2.31);
  add(new T.BoxGeometry(1.7,.07,.05),tail,0,Y+.78,2.32);add(new T.BoxGeometry(1.5,.05,.4),paint,0,Y+1.05,2.05);for(const s2 of[-1,1])add(new T.BoxGeometry(.06,.14,.1),dark,s2*.6,Y+.97,2.05);
  add(new T.BoxGeometry(1.2,.12,.5),dark,0,Y+.36,-2.2);add(new T.BoxGeometry(1.4,.14,.3),dark,0,Y+.34,2.2);
  // cockpit
  for(const s2 of[-1,1]){add(new T.BoxGeometry(.6,.12,.62),seat,s2*.42,Y+.8,.25);add(new T.BoxGeometry(.6,.6,.12),seat,s2*.42,Y+1.08,.58)}
  add(new T.BoxGeometry(1.6,.2,.5),dark,0,Y+1.0,-.62);add(new T.BoxGeometry(.5,.18,.02),scr,0,Y+1.07,-.37);add(new T.TorusGeometry(.17,.025,6,16),dark,-.42,Y+1.06,-.4,.4,0,0);
  // wheels: a group per wheel so the front pair can steer and all four spin
  const W=[];for(const[x,z]of[[-.98,-1.4],[.98,-1.4],[-.98,1.4],[.98,1.4]]){const wg=new T.Group();wg.position.set(x,Y+.42,z);g.add(wg);const sp=new T.Group();wg.add(sp);
    const t2=new T.Mesh(new T.CylinderGeometry(.42,.42,.3,22),tyre);t2.rotation.z=Math.PI/2;sp.add(t2);const r2=new T.Mesh(new T.CylinderGeometry(.27,.27,.32,10),rim);r2.rotation.z=Math.PI/2;sp.add(r2);
    for(let k=0;k<5;k++){const sk=new T.Mesh(new T.BoxGeometry(.33,.05,.4),rim);sk.rotation.x=k*Math.PI/5;sp.add(sk)}const hb=new T.Mesh(new T.CylinderGeometry(.08,.08,.34,8),trim);hb.rotation.z=Math.PI/2;sp.add(hb);
    W.push({wg,sp,front:z<0})}
  g.userData.wheels=W;g.traverse(o=>{if(o.isMesh)o.castShadow=true});return g}
const MCARS=[];
function meriCarsBuild(){if(MCARS.length||!HUB.g)return;const OZ=HC.z-1100,P2=(t,r,la=0)=>[Math.sin(t)*r+Math.cos(t)*la,Math.cos(t)*r-Math.sin(t)*la];
  const spots=[[-30,952,Math.PI/2,0xe9e2d0],[30,952,-Math.PI/2,0x1f4f9a],[...P2(.62,1010),.62+Math.PI/2,0xa8262a],[...P2(-.62,1010),-.62-Math.PI/2,0x2f3438]];
  for(const[x,z,h,c]of spots){const g=meriCarModel(c);g.rotation.order='YXZ';scene.add(g);const v={kind:'car',meri:true,g,pos:g.position,r:1.3,home:[HC.x+x,OZ+z,h]};vehs.push(v);homeVeh(v);MCARS.push(v);
    HUB.pts.push({k:'car',x:v.pos.x,z:v.pos.z,r:4,label:'E · DRIVE THE RUNABOUT',car:v})}}
"""
a = "function hubUse(){"
i = s.index(a); s = s[:i] + CAR.lstrip('\n') + s[i:]
# build the cars with the hub, show them only while Meridian is shown
rep("function hubTick(dt){if(!HUB.on){hubTagsOff();return}", "function hubTick(dt){for(const v of MCARS)v.g.visible=!!(HUB.g&&HUB.g.visible);if(!HUB.on){hubTagsOff();return}if(!MCARS.length)meriCarsBuild();for(const q of HUB.pts)if(q.car){q.x=q.car.pos.x;q.z=q.car.pos.z}")
rep("function hubUse(){const q=HUB.near;if(!q)return;", "function hubUse(){const q=HUB.near;if(!q)return;if(q.k==='car'){toggleVeh();return}")
# E at Meridian: get out of a car first
rep("else if(c==='KeyE'){if(HUB.on)hubUse();else toggleVeh()}", "else if(c==='KeyE'){if(HUB.on&&!veh)hubUse();else toggleVeh()}")
# the prompt while driving
rep("HUB.near=nr;try{hubTags()}catch(e){}const el=$('veh');", "HUB.near=veh?null:nr;try{hubTags()}catch(e){}const el=$('veh');if(veh&&state==='playing'){el.hidden=false;el.textContent='E · GET OUT · '+Math.round(Math.abs(veh.v)*3.6)+' KM/H';return}")
# no Rowan line about the agri crew's rover at Meridian
rep("if(b){if(!seenVeh[b.kind]){", "if(b){if(!b.meri&&!seenVeh[b.kind]){")
rep("say(b.kind==='car'?'Rover':'Skiff',1)}}", "say(b.meri?'Runabout · W/S drive · A/D steer · Space brake · E out':b.kind==='car'?'Rover':'Skiff',b.meri?3:1)}}")
# cars at Meridian: stay on the deck, keep to the walls and edges, wheels spin and steer
rep("    const py=p.y;pushOut(p,v.r);if(p.y>py+1e-5)v.vy=0;",
    "    const py=p.y;pushOut(p,v.r,!!v.meri);if(p.y>py+1e-5)v.vy=0;if(v.meri){if(p.y<v.r){p.y=v.r;v.vy=0}try{meriPush(p,1.7)}catch(e){}const W=v.g.userData.wheels;if(W)for(const w of W){w.sp.rotation.x-=v.v*dt/.42;if(w.front)w.wg.rotation.y=-s*.45}}")
open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))
