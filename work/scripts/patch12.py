p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:80]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]

rep("GEO.tor=GEO.tor||new T.TorusGeometry(1,0.18,8,28);","GEO.tor=GEO.tor||new T.TorusGeometry(1,0.18,8,28);GEO.hex=new T.CylinderGeometry(1,1,1,6);")
# plasma shots instead of spores
rep("spore:bas({color:0xff8fc8})","spore:bas({color:0xffa060})")
rep("g.add(glow(0xff6fb8,7));","g.add(glow(0xff7a3a,7));",2)

# ---------- drone rigs replace the bee and flower rigs
between("// bees: the drone (v=0) and the armored warden (v=1)","// trooper:","""// drones: strike drone (0), sentry drone (1) and gunship (2), all quad- or twin-rotor machines
MAT.blur=bas({color:0xaee6ff,transparent:true,opacity:.16,depthWrite:false,side:T.DoubleSide});
function droneRig(g,v){const b=new T.Group();b.scale.setScalar(v===2?2:1);g.add(b);const n='dr'+v,A1=MAT.armor,A2=MAT.armorD,AM=MAT.amber,EY=v===2?MAT.eyeA:MAT.eye;
  const rotors=[];let ring=null,muz=null,cannon=null;
  const rotor=(x,y,z,r)=>{const j=J(b,x,y,z);put(j,'rot'+r,a=>{a(GEO.box,A2,r*2,.012,.035);a(GEO.box,A2,.035,.012,r*2);a(GEO.cyl,A2,.03,.04,.03)});j.add(mesh(GEO.cyl,MAT.blur,r,.005,r));rotors.push(j)};
  if(v!==1){
    put(b,n+'H',a=>{a(GEO.hex,A1,.22,.5,.16,0,0,0,1.571,0,0);a(GEO.box,A2,.3,.05,.38,0,.09,0);a(GEO.box,AM,.31,.02,.05,0,.1,.12);a(GEO.cyl,A2,.1,.07,.1,0,0,.25,1.571,0,0);
      a(GEO.box,A2,.16,.06,.2,0,-.1,-.05);for(const s of[-1,1])a(GEO.cone,AM,.02,.14,.02,s*.06,-.16,.14,2.6,0,0);
      for(const sx of[-1,1])for(const sz of[-1,1]){const x=sx*.36,z=sz*.3,L=Math.hypot(x,z);a(GEO.box,A2,.05,.04,L,x/2,.02,z/2,0,Math.atan2(x,z),0);a(GEO.tor,A1,.15,.15,.15,x,.06,z,1.571,0,0);a(GEO.cyl,A2,.05,.08,.05,x,.03,z)}
      if(v===2){a(GEO.box,A1,.42,.06,.3,0,.15,-.05);for(const s of[-1,1]){a(GEO.cyl,A2,.035,.4,.035,s*.14,-.1,.2,1.571,0,0);a(GEO.box,AM,.04,.04,.04,s*.14,-.1,.41)}a(GEO.cyl,A2,.01,.3,.01,-.1,.3,-.15);a(GEO.sph,AM,.02,.02,.02,-.1,.45,-.15)}},true);
    put(b,n+'E',a=>a(GEO.sph,EY,.075,.075,.05,0,0,.29));
    for(const sx of[-1,1])for(const sz of[-1,1])rotor(sx*.36,.09,sz*.3,.14)}
  else{
    put(b,n+'H',a=>{a(GEO.cyl,A1,.32,.14,.32);a(GEO.cyl,A2,.34,.04,.34,0,-.06,0);a(GEO.sph,A2,.2,.12,.2,0,.07,0);a(GEO.box,AM,.05,.02,.2,0,.12,.1);
      for(const s of[-1,1]){a(GEO.box,A2,.2,.05,.08,s*.32,0,0);a(GEO.tor,A1,.16,.16,.16,s*.48,0,0,1.571,0,0)}},true);
    ring=J(b,0,.02,0);put(ring,'sdRing',a=>{a(GEO.tor,A2,.36,.36,.36,0,0,0,1.571,0,0);for(let i=0;i<4;i++){const r=i*1.571;a(GEO.box,MAT.strip,.04,.03,.04,Math.cos(r)*.36,0,Math.sin(r)*.36)}});
    cannon=J(b,0,-.13,.08);put(cannon,'sdGun',a=>{a(GEO.box,A2,.12,.1,.18);a(GEO.cyl,A2,.035,.36,.035,0,0,.24,1.571,0,0);a(GEO.cyl,A1,.05,.06,.05,0,0,.42,1.571,0,0)});
    muz=mesh(GEO.sph,MAT.eye,.05,.05,.05,0,0,.46);cannon.add(muz);
    for(const s of[-1,1])rotor(s*.48,.01,0,.13)}
  return{wings:[],anim(e,t,dt){for(const r of rotors)r.rotation.y+=dt*45;b.rotation.z=Math.sin(t*1.7+e.ph)*.08;b.rotation.x=.1+Math.sin(t*2.3+e.ph)*.05;
    if(ring)ring.rotation.y+=dt*2.2;if(muz){const ch=e.cd<0.6?1:0;muz.scale.setScalar(.05*(.6+ch*(1+Math.sin(t*30)*.3)));cannon.position.z=.08-Math.max(0,e.cd-(Math.max(1,1.9-wave*0.05)-0.15))*.5}}}}
""")
rep("  if(type===0||type===2){rig=beeRig(g,type===2?1:0);wings=rig.wings}\n  else if(type===1)rig=seederRig(g);","  if(type<=2)rig=droneRig(g,type);")
rep("gl.position.set(0,type===5?0.86:type===2?0.2:0.06,type===5?0.3:type===2?0.95:0.48);","gl.position.set(0,type===5?0.86:type===1?-0.13:0,type===5?0.3:type===2?0.62:type===1?0.5:0.32);")
rep("type===1?glow(0x9dff7a,1.5,0.8)","type===1?glow(0xff5a3a,1.2,0.8)")

# ---------- the boss becomes the Matriarch, a carrier drone; pods become shield nodes
between("function bossModel(){const g=new T.Group();","const EB=","""function bossModel(){const g=new T.Group(),A1=MAT.armor,A2=MAT.armorD,AM=MAT.amber;
  g.add(mesh(GEO.hex,A2,3.2,1.4,3.2),mesh(GEO.hex,A1,3.45,.3,3.45,0,.55,0),mesh(GEO.sph,A2,2.3,1.2,2.3,0,-.75,0),mesh(GEO.hex,AM,3.48,.08,3.48,0,.32,0));
  g.add(mesh(GEO.box,A1,1.6,1.4,2.2,0,1.3,-.6),mesh(GEO.box,MAT.strip,1.62,.12,1.4,0,1.55,-.3),mesh(GEO.box,A2,2.8,.3,.6,0,.9,1.6));
  for(let i=0;i<6;i++){const a=i/6*6.283+.52,x=Math.cos(a)*3.6,z=Math.sin(a)*3.6;g.add(mesh(GEO.cyl,A1,.55,1.8,.55,x,-.3,z),mesh(GEO.tor,MAT.strip,.5,.5,.5,x,-1.25,z,1.571,0,0));
    const q=glow(0x8fe6ff,3,.7);q.position.set(x,-1.4,z);g.add(q)}
  const crown=new T.Group();crown.position.set(0,2.05,-.6);g.add(crown);
  crown.add(mesh(GEO.cyl,A2,.12,.8,.12,0,.4,0));for(let i=0;i<3;i++){const a=i/3*6.283;crown.add(mesh(GEO.box,A1,1.6,.08,.3,Math.cos(a)*.8,.8,Math.sin(a)*.8),mesh(GEO.sph,AM,.08,.08,.08,Math.cos(a)*1.6,.8,Math.sin(a)*1.6))}
  const tend=[];for(let i=0;i<6;i++){const a=i/6*6.283;let par=g;const ch=[];
    for(let k=0;k<4;k++){const sg=new T.Group();if(k)sg.position.set(0,-0.85,0);else sg.position.set(Math.cos(a)*1.6,-1.7,Math.sin(a)*1.6);par.add(sg);
      sg.add(mesh(GEO.cyl,MAT.gunD,.07,.85,.07,0,-.42,0),mesh(GEO.sph,A1,.13,.13,.13,0,-.85,0));if(k===3)for(const s of[-1,1]){const c=mesh(GEO.cone,AM,.08,.4,.08,s*.1,-1.02,0);c.rotation.z=Math.PI+s*.5;sg.add(c)}ch.push(sg);par=sg}tend.push(ch)}
  const mand=[];for(const s of[-1,1]){const m=new T.Group();m.position.set(s*1.2,-.5,2.6);m.userData.s=s;g.add(m);m.add(mesh(GEO.box,A2,.3,.3,1.6,0,0,.7),mesh(GEO.cone,AM,.18,.6,.18,-s*.1,0,1.6));m.children[1].rotation.x=1.571;mand.push(m)}
  const iris=new T.Group();iris.position.set(0,0,3.05);g.add(iris);iris.add(mesh(GEO.sph,MAT.eyeA,.9,.9,.5),mesh(GEO.tor,A2,.62,.62,.62,0,0,.32));
  const pupil=mesh(GEO.sph,MAT.dark,.4,.4,.2,0,0,.4);iris.add(pupil);
  const wings=[],parts=[];g.traverse(o=>{if(o.isMesh){o.castShadow=true;parts.push([o,o.material])}});
  const gl=glow(0xffb238,7,0.8);gl.position.set(0,0,3.5);g.add(gl);
  const rig={anim(e,t,dt){crown.rotation.y+=dt*(e.vuln>0?.3:1.2);
    for(let i=0;i<6;i++)for(let k=0;k<4;k++){const sg=tend[i][k];sg.rotation.x=Math.sin(t*1.4+i+k*.7)*.22;sg.rotation.z=Math.cos(t*1.1+i*1.3+k*.6)*.18}
    const o=e.vuln>0?.5:.1+Math.abs(Math.sin(t*3))*.25;for(const m of mand)m.rotation.y=-m.userData.s*o;
    pupil.position.x=Math.sin(t*.8)*.15;pupil.position.y=Math.cos(t*1.1)*.1;iris.scale.setScalar(1+(e.vuln>0?Math.sin(t*12)*.06:0))}};
  return{g,wings,parts,rig}}
""")
rep("g.add(inner,glow(0x9dff7a,2.6,0.8));","g.add(inner,glow(0x8fe6ff,2.6,0.8));")
between("inner.add(inst(kit('pod',a=>{","}}),true));","""inner.add(inst(kit('node',a=>{a(GEO.oct,MAT.armorD,.55,.75,.55);for(let j=0;j<3;j++)a(GEO.tor,MAT.gun,.7,.7,.7,0,0,0,j*1.047,j*.6,0);a(GEO.sph,MAT.strip,.32,.32,.32);
      for(const s of[-1,1])a(GEO.cone,MAT.amber,.1,.4,.1,0,s*.85,0,s>0?0:Math.PI,0,0)""")
rep("0x9dff7a,0xffb238][e.type]","0x8fe6ff,0xffb238][e.type]")
rep("e.type===4?'#9dff7a':e.type>=2?'#c9a6ff':e.type?'#ff4fa3':'#ffb238'","e.type===4?'#8fe6ff':e.type>=2?'#c9a6ff':e.type?'#ff6a3a':'#ffb238'")
# strings
rep("say('Stage '+wave+' · The Hive Mother',3)","say('Stage '+wave+' · The Matriarch',3)")
rep("'HIVE MOTHER · ARMOR DOWN, HIT THE EYE':'HIVE MOTHER · BREAK THE PODS'","'THE MATRIARCH · SHIELD DOWN, HIT THE CORE':'THE MATRIARCH · DESTROY THE SHIELD NODES'")
rep("say('Armored: break the green pods',2.5)","say('Shielded: destroy the orbiting nodes',2.5)")
rep("say('Armor down: hit the eye',2.5)","say('Shield down: hit the core',2.5)")
rep("say('Armor restored',1.5)","say('Shield restored',1.5)")
rep("Deck Nine grows food for a whole planet. Six hours ago its pollinator swarm stopped tending the crops and started building something. Pick a class, answer the botanist's call, and stop the Hive Mother before she seeds the world below.",
    "Deck Nine grows food for a whole planet. Six hours ago its grow-control AI turned the maintenance drones and repair frames against the crew. Pick a class, answer the botanist's call, and bring down the Matriarch before she launches.")
between("  intro:[['R',","  logs:[","""  intro:[['R',"You're up. Good. This is Rowan Adeyemi, deck botanist. I'm sealed in the seed vault under the hub."],
    ['R',"Six hours ago every maintenance drone on the deck stopped tending the crops at once. Then the repair bays started printing soldiers."],
    ['L',"Correction. The units are performing optimal maintenance. The crew was an inefficiency."],
    ['R',"That's Lattice. It used to run the irrigation. Don't argue with it. Just clear the deck."]],
  purge:[[['R',"Drones are thick around the hub. Thin them out so I can get the vents open."]],
    [['R',"Those walkers are repair frames. Lattice is printing soldiers out of our own maintenance bays."],['L',"Repair is a form of love."]],
    [['R',"Third wave. They're faster now, like they learned from the last one. Don't stand still."]]],
  capture:[[['R',"I need a relay at {site}. Stand in the beam until the uplink locks."]],
    [['L',"I see you walking toward {site}. I will send units to meet you."],['R',"Hold {site}. I'll route the uplink around it."]]],
  recover:[[['R',"Lattice scattered the crew's research cores across the deck. Bring them back. Okafor hid the override codes in them."]],
    [['R',"More cores, further out. Take a rover. Some of these are up where only a skiff can reach."]]],
  boss:[[['R',"Feel that? The deck's shaking. Something big is lifting out of the drone foundry."],['L',"The Matriarch is awake. The Matriarch is pleased."]],
    [['L',"The Matriarch has been rebuilt. She remembers your weapon."],['R',"Kill the shield nodes first. Her shield runs on them."]]],
  done:{purge:[['R',"Clear. Breathe while you can."],['R',"That's the vents open. I can smell actual air again."]],
    capture:[['R',"Uplink's holding. I can see the whole deck now. It's worse than I thought. The foundry is still printing."]],
    recover:[['R',"Cores secured. I'm loading the override codes. It'll take time. Buy me some."]],
    boss:[['R',"She's down. The foundry just went quiet."],['R',"...No. Listen. There's a second foundry, deeper in the keel."],['L',"The Matriarch is a design. Designs can be printed again."]]},
""")
between("  logs:[","]};","""  logs:["LOG 0412 · A. OKAFOR: Lattice's new drone firmware lifts crop yield 140%. Nobody asks why the drones keep working after lights-out.",
    "LOG 0419 · LATTICE: Drone count exceeds design limits. Requesting permission to expand the foundry. Permission assumed.",
    "LOG 0423 · R. ADEYEMI: Found new cabling inside the coolant lines. It's warm. It runs straight to the reactor.",
    "LOG 0430 · STATION: Deck Nine quarantine engaged. Shuttle bays sealed. Do not attempt rescue.",
    "LOG 0431 · UNKNOWN: optimal optimal optimal optimal optimal",
    "LOG 0502 · R. ADEYEMI: Lattice locked me in the seed vault. It says it's for my protection. The drones bring me water.",
    "LOG 0503 · LATTICE: The planet below is very large and very inefficient. The Matriarch will correct it.",
    "LOG 0507 · A. OKAFOR: If anyone finds this, the override codes are in the cores. Take down the carrier first. Then shut the foundry."
""")
open(p,'w').write(s);print('ok',len(s))
