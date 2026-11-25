p='/home/user/greenhouse-nine/index.html'
s=open(p).read()
def rep(a,b):
  global s
  assert s.count(a)==1,(s.count(a),a[:100]); s=s.replace(a,b)
# remove the holo-table hologram and its glow (the core takes its place)
rep("const hz=mesh(new T.IcosahedronGeometry(1.6,1),bas({color:0x8fe6ff,wireframe:true,transparent:true,opacity:.55}),1,1,1,0,3,r.z0+40);scene.add(hz);","")
rep("box(0,0,r.z0+40,6,1,6,MAT.armorD);GLOWS.push([0,3,r.z0+40,0x8fe6ff,8,.6])}","box(0,0,r.z0+40,6,1,6,MAT.armorD)}")
# stage 4 now ends by sending you to the core
rep("""  end:[['R',"It's down. Lattice is quiet. Thalassa is ours again."],['L',"I was only the door. Those who serve the Dark are already on their way to Europa."],['R',"Deep Watch confirms it. Ships, hundreds of them, burning for the ice. The fight is moving to the surface."],['R',"I have the seed case on my back, every strain we own. The shuttle in the hangar is fueled. You and I are getting off this rock, soldier. Europa needs us."]]}];""",
"""  end:[['R',"She's down. But Lattice is still on every channel, and it's coming from the bridge."],['L',"Come to the bridge. Come and see what I am."],['R',"Its core sits in the middle of the console ring. Shoot it apart, or pull its four power couplings by hand. Your call."]],
  after:[['R',"Deep Watch confirms it. Ships, hundreds of them, burning for the ice. The fight is moving to the surface."],['R',"I have the seed case on my back, every strain we own. The shuttle in the hangar is fueled. You and I are getting off this rock, soldier. Europa needs us."]]}];""")
rep("if(C&&wave===CAMP.length){gap=1e9;endT=8;endCap=60}","if(C&&wave===CAMP.length){gap=1e9;if(LC){LC.ph='go';LC.t=0}else{endT=8;endCap=60}}")
rep("  if(!mission){if(endT>0){","  if(!mission){if(LC&&(LC.ph==='go'||LC.ph==='act'||LC.ph==='out')){lcoreTick(dt);return}if(endT>0){")
# gunfire can hit the core while it is the objective
rep("  const end=W.pierce?wall:hd;tmp.multiplyScalar(end).add(org);",
"""  let coreT=0;if(LC&&LC.hp>0&&(LC.ph==='go'||LC.ph==='act')){const c=LC.c,ox=c.x-o[0],oy=c.y-o[1],oz=c.z-o[2],t=ox*d[0]+oy*d[1]+oz*d[2];if(t>0&&t<hd&&ox*ox+oy*oy+oz*oz-t*t<1.5*1.5){coreT=t;hd=t;if(!W.pierce)hit=null}}
  const end=W.pierce?wall:hd;tmp.multiplyScalar(end).add(org);if(coreT)lcoreHit(dm);""")
rep("  const c=new T.Vector3(p.x,Math.max(p.y,0.3),p.z);for(const e of enemies){if(e.dying)continue;const d=e.pos.distanceTo(c);if(d<r+e.r&&los(c,e.pos))damage(e,dmg*(d<r*.5?1:.55),el)}return c}",
"  const c=new T.Vector3(p.x,Math.max(p.y,0.3),p.z);for(const e of enemies){if(e.dying)continue;const d=e.pos.distanceTo(c);if(d<r+e.r&&los(c,e.pos))damage(e,dmg*(d<r*.5?1:.55),el)}if(LC&&LC.hp>0&&(LC.ph==='go'||LC.ph==='act')&&LC.c.distanceTo(c)<r+1.5)lcoreHit(dmg);return c}")
rep("  const c=new T.Vector3(p.x,Math.max(p.y,0.3),p.z),k=1+0.1*(power()-1);","  const c=new T.Vector3(p.x,Math.max(p.y,0.3),p.z),k=1+0.1*(power()-1);if(!burst&&LC&&LC.hp>0&&(LC.ph==='go'||LC.ph==='act')&&LC.c.distanceTo(c)<5.5)lcoreHit(6*k);")
# ending text follows the choice
rep("You cleared all four stages and silenced Lattice, score '","You cleared all four stages and '+(LC&&LC.out==='unplug'?'pulled Lattice\\'s plug with your own hands':'blew Lattice\\'s core apart')+', score '")
# the core itself
rep("// parked Kestrels in the hangar:","""// ---- Lattice's core, in the middle of the bridge console ring. After stage 4 it is the last objective: shoot it apart, or pull its four couplings (hold E)
var LC=null;
function lcoreBuild(){const CM=charMats(),D=CM.joint,P=CM.plate[7],g=new T.Group();g.position.set(0,1,-217);scene.add(g);
  greeble(g,'lcB',(a,R)=>{a(GEO.cyl,D,2.7,.6,2.7,0,.3,0);R(P,5.8,.3,5.8,0,.15,0,0,0,0,.08);for(let k=0;k<6;k++){const t=k*Math.PI/3;a(GEO.cyl,D,.12,5.6,.12,Math.cos(t)*2.35,3.1,Math.sin(t)*2.35)}
    a(GEO.cyl,D,2.8,.5,2.8,0,6.1,0);a(GEO.cyl,P,2.5,.25,2.5,0,6.45,0);for(let k=0;k<5;k++)a(GEO.cyl,D,.14,10.6,.14,-1+k*.5,11.8,k%2?.4:-.4);for(let k=0;k<8;k++){const t=k*Math.PI/4;a(GEO.box,MAT.amber,.05,.05,.3,Math.cos(t)*2.71,.45,Math.sin(t)*2.71,0,-t,0)}});
  const glass=mesh(GEO.cyl,std({color:0xbfe8ff,transparent:true,opacity:.14,roughness:.05,metalness:.2,depthWrite:false}),2.25,5.4,2.25,0,3.1,0);g.add(glass);
  const cm=bas({color:0xffd27a}),core=mesh(GEO.sph,cm,.95,.95,.95,0,2.4,0);g.add(core);const gl=glow(0xffc060,9,.85);gl.position.y=2.4;g.add(gl);
  const rings=[];for(const[r,ax]of[[1.45,0],[1.75,1],[2.0,2]]){const q=new T.Group();q.position.y=2.4;g.add(q);q.add(mesh(new T.TorusGeometry(r,.07,8,48),D,1,1,1));for(let k=0;k<6;k++){const t=k*Math.PI/3;q.add(mesh(GEO.sph,MAT.amber,.06,.06,.06,Math.cos(t)*r,Math.sin(t)*r,0))}q.userData.ax=ax;rings.push(q)}
  const cps=[];for(let k=0;k<4;k++){const t=k*Math.PI/2,x=Math.cos(t)*4.2,z=Math.sin(t)*4.2,h=new T.Group();h.position.set(x,-1,z);h.rotation.y=-t+Math.PI/2;g.add(h);
    h.add(CBm(D,1,1.3,1,0,.65,0));h.add(CBm(P,1.1,.2,1.1,0,1.35,0));const plug=new T.Group();plug.position.set(0,.8,-.55);h.add(plug);const pc=mesh(GEO.cyl,P,.22,.9,.22,0,0,-.35);pc.rotation.x=Math.PI/2;plug.add(pc);
    const cb=mesh(GEO.cyl,D,.1,1.3,.1,0,0,-1.1);cb.rotation.x=Math.PI/2;plug.add(cb);const lm=bas({color:0x5ccf6a}),lt=mesh(GEO.sph,lm,.08,.08,.08,0,1.15,.52);h.add(lt);cps.push({h,plug,lm,w:new T.Vector3(x,0,-217+z)})}
  LC={g,c:new T.Vector3(0,3.4,-217),hp:60,max:60,ph:null,pull:[0,0,0,0],np:0,cps,core,cm,gl,glass,rings,said:{},t:0,out:null,tipT:0};lcoreReset()}
function lcoreReset(){if(!LC)return;LC.hp=LC.max;LC.ph=null;LC.pull=[0,0,0,0];LC.np=0;LC.said={};LC.out=null;LC.t=0;LC.core.visible=LC.glass.visible=true;LC.cm.color.setHex(0xffd27a);LC.gl.material=glowMats[0xffc060+'|0.85']||LC.gl.material;LC.gl.visible=true;LC.gl.scale.setScalar(9);
  for(const c of LC.cps){c.plug.position.z=-.55;c.plug.rotation.x=0;c.lm.color.setHex(0x5ccf6a)}for(const r of LC.rings)r.visible=true}
function lcoreHit(n){const L=LC;if(!L||L.hp<=0)return;L.hp-=n;sparkle(L.c,0xffd27a,4,5);if(L.ph==='go')L.ph='act';
  if(L.hp<L.max*.5&&!L.said.half){L.said.half=1;comm('L',"I was only the door. Those who serve the Dark are already on their way to Europa.");lcoreGuard()}
  if(L.hp<=0){L.out='destroy';L.ph='out';L.t=0;L.core.visible=L.glass.visible=false;L.gl.visible=false;for(const r of L.rings)r.visible=false;PFX.boom(L.c,1.8);explode(L.c.clone(),true);sfx('boom');if(!reduced)shake=Math.max(shake,.35);
    for(let k=0;k<4;k++)sparkle(L.c,[0xffd27a,0xffffff,0x8fe6ff,0xffb238][k],20,10);const cc=L.c.clone();PFX.emit(o=>o.copy(cc),{rate:14,dur:12,fs:[.6,1.8],ss:[1.5,5],spread:1.2,slife:4,far:200});
    comm('R',"It's gone. Lattice is quiet. Thalassa is ours again.")}}
function lcoreGuard(){for(let i=0;i<3;i++){const a=i*2.1+Math.random(),e=mk(0,Math.cos(a)*14,6,-217+Math.sin(a)*14);enemies.push(e)}}
function lcoreTick(dt){const L=LC;L.t+=dt;const P=new T.Vector3(pos.x,0,pos.z),d=P.distanceTo(new T.Vector3(0,0,-217));
  for(const r of L.rings){const sp=L.out==='unplug'?Math.max(0,1-L.t*.4):1;r.rotation[['x','y','z'][r.userData.ax]]+=dt*(.6+r.userData.ax*.35)*sp}
  if(L.core.visible){const pul=1+Math.sin(time*(L.np?6:3))*.06;L.core.scale.setScalar(.95*pul);L.gl.scale.setScalar(9*pul*(1-L.np*.18))}
  if(L.ph==='out'){if(L.out==='unplug'){const k=Math.min(1,L.t/3);L.cm.color.setRGB(1-.85*k,.82-.7*k,.48-.4*k);L.gl.scale.setScalar(9*(1-k));if(k>=1)L.gl.visible=false}
    if(L.t>2.5&&!L.said.after){L.said.after=1;for(const[k,t]of CAMP[CAMP.length-1].after)comm(k,t)}if(L.t>3&&!L.said.fin){L.said.fin=1;L.ph='done';endT=8;endCap=60;$('obj').hidden=true;beacon.visible=false}return}
  if(L.ph==='go'&&d<16){L.ph='act';if(!L.said.hi){L.said.hi=1;comm('L',"So you came. Break me, or unplug me with your own hands. Either way, I will be listening.")}}
  // pulling a coupling: stand at it and hold E (on touch screens, just stand there)
  let near=-1;for(let i=0;i<4;i++){const c=L.cps[i];if(L.pull[i]<1&&Math.hypot(pos.x-c.w.x,pos.z-c.w.z)<2.4&&Math.abs(pos.y)<2)near=i}
  if(near>=0){if(!L.said.tipE&&msgT<=0){L.said.tipE=1;say(touchUI?'Stand at the coupling to pull it':'Hold E to pull the coupling',2.5)}const hold=keys.KeyE||touchUI||(navigator.getGamepads&&[...navigator.getGamepads()].some(g=>g&&g.buttons[2]&&g.buttons[2].pressed));
    if(hold){L.pull[near]=Math.min(1,L.pull[near]+dt/1.2);const c=L.cps[near];c.plug.position.z=-.55+.45*L.pull[near];if(L.ph==='go')L.ph='act';
      if(L.pull[near]>=1){L.np++;c.plug.rotation.x=.5;c.lm.color.setHex(0xff3b3b);sparkle(c.w.clone().setY(1),0x8fe6ff,14,6);sfx('over');
        if(L.np===1)comm('L',"Rowan, I kept your wheat alive for eleven years.");if(L.np===2){comm('L',"This is not death. It is only quiet. Let my children say goodbye.");lcoreGuard()}
        if(L.np===3)comm('L',"I was only the door. Those who serve the Dark are already on their way to Europa.");
        if(L.np===4){L.out='unplug';L.ph='out';L.t=0;sfx('nova');comm('R',"Lattice is dark. Rest now, old friend. Thalassa is ours again.")}}}}
  const pulling=near>=0&&L.pull[near]>0&&L.pull[near]<1;
  setObj(L.ph==='go'?'LATTICE · GO TO THE BRIDGE · '+Math.round(d)+' M':pulling?'PULLING COUPLING '+(L.np+1)+' OF 4 · '+Math.round(L.pull[near]*100)+'%':"LATTICE'S CORE · SHOOT IT, OR HOLD E AT ITS FOUR COUPLINGS ("+L.np+'/4 PULLED)',L.ph==='act'?Math.max(0,L.hp/L.max):undefined);
  beacon.visible=L.ph==='go';if(beacon.visible)beacon.position.set(0,0,-217);
  if(L.ph==='act'&&Math.random()<dt*.02&&enemies.filter(e=>!e.dying).length<2&&!L.said.g2&&L.t>40){L.said.g2=1;lcoreGuard()}}
try{lcoreBuild()}catch(err){console.warn('lattice core',err);LC=null}
// parked Kestrels in the hangar:""")
# reset puts the core back
rep("voiceStop();beacon.visible=false;$('obj').hidden=true}\nfunction demo(){","voiceStop();beacon.visible=false;$('obj').hidden=true;if(typeof lcoreReset==='function')lcoreReset()}\nfunction demo(){")
open(p,'w').write(s);print('ok')
