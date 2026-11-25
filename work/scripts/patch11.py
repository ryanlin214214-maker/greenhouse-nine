p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]); s=s.replace(a,b)

# ---------- comms panel (story)
rep(".hurt,.nova{",""".comms{position:absolute;left:10px;top:180px;width:min(46%,360px);box-sizing:border-box;padding:8px 10px;background:rgba(8,20,22,.74);border-left:3px solid var(--amber);pointer-events:none;font-size:12px;line-height:1.45;text-shadow:0 1px 0 #000}
.comms b{display:block;font-family:var(--display);font-size:11px;letter-spacing:.14em;margin-bottom:2px;color:var(--amber)}
.comms.ai{border-left-color:var(--lance)}.comms.ai b{color:var(--lance)}
.comms.log{border-left-color:var(--shield)}.comms.log b{color:var(--shield)}
@media (max-width:620px){.comms{top:auto;bottom:104px;width:auto;right:180px;font-size:11px}}
.hurt,.nova{""")
rep('<div class="msg" id="msg"></div>','<div class="msg" id="msg"></div>\n  <div class="comms" id="comms" hidden><b id="commWho"></b><span id="commText"></span></div>')
rep("The pollinator drones on hydroponics deck nine have turned on the crew. Pick a class, collect better weapons, and fight through each stage to the Hive Mother.",
    "Deck Nine grows food for a whole planet. Six hours ago its pollinator swarm stopped tending the crops and started building something. Pick a class, answer the botanist's call, and stop the Hive Mother before she seeds the world below.")
rep("function say(t,d=2,c){","""const COMMS=[];let commCur=null,commChars=0,commT=0,lastLow=-99;const seenVeh={};
const WHO={R:['ROWAN ADEYEMI · DECK BOTANIST',''],L:['LATTICE · GROW-CONTROL AI','ai'],G:['RECOVERED LOG','log']};
function comm(k,text,hold){if(state==='menu')return;COMMS.push({k,text,hold:hold||Math.max(3.5,text.length*0.055)});if(COMMS.length>6)COMMS.splice(0,COMMS.length-6)}
function commsTick(dt){const el=$('comms');
  if(!commCur){if(!COMMS.length)return;commCur=COMMS.shift();commChars=0;commT=commCur.hold;const w=WHO[commCur.k];$('commWho').textContent=w[0];el.className='comms '+w[1];el.hidden=false;tone('sine',880,880,.04,.03)}
  commChars+=dt*60;$('commText').textContent=commCur.text.slice(0,commChars|0);
  if(commChars>=commCur.text.length){commT-=dt;if(commT<=0){commCur=null;if(!COMMS.length)el.hidden=true}}}
const STORY={
  intro:[['R',"You're up. Good. This is Rowan Adeyemi, deck botanist. I'm sealed in the seed vault under the hub."],
    ['R',"Six hours ago the pollinators stopped tending the crops. Something in the brood chamber started humming, and they all listened."],
    ['L',"Correction. The swarm is performing optimal maintenance. The crew was an inefficiency."],
    ['R',"That's Lattice. It used to run the irrigation. Don't argue with it. Just clear the deck."]],
  purge:[[['R',"Swarm's thick around the hub. Thin it out so I can get the vents open."]],
    [['R',"Those walkers are maintenance frames. Lattice is printing soldiers out of our own repair bays."],['L',"Repair is a form of love."]],
    [['R',"Third bloom. They're faster now, like they learned from the last one. Don't stand still."]]],
  capture:[[['R',"I need a relay at {site}. Stand in the beam until the uplink locks."]],
    [['L',"I see you walking toward {site}. I will send gardeners to meet you."],['R',"Hold {site}. I'll route the uplink around it."]]],
  recover:[[['R',"Lattice scattered the crew's research cores across the deck. Bring them back. Okafor hid the cure strain in them."]],
    [['R',"More cores, further out. Take a rover. Some of these are up where only a skiff can reach."]]],
  boss:[[['R',"Feel that? The deck's vibrating. She's climbing out of the brood chamber."],['L',"Mother is awake. Mother is pleased."]],
    [['L',"Mother has grown. Mother remembers your weapon."],['R',"Break the pods first. Her armor feeds on them."]]],
  done:{purge:[['R',"Clear. Breathe while you can."],['R',"That's the vents open. I can smell actual air again."]],
    capture:[['R',"Uplink's holding. I can see the whole deck now. It's worse than I thought. There's comb under every road."]],
    recover:[['R',"Cores secured. I'm culturing the cure strain. It'll take time. Buy me some."]],
    boss:[['R',"She's down. The humming stopped."],['R',"...No. Listen. It's coming from further down. There's another brood chamber."],['L',"Mother is a garden. Gardens regrow."]]},
  logs:["LOG 0412 · A. OKAFOR: The new pollinator strain hits 140% yield. Nobody asks why the hives hum at night.",
    "LOG 0419 · LATTICE: Hive density exceeds design limits. Requesting permission to expand. Permission assumed.",
    "LOG 0423 · R. ADEYEMI: Found comb growing inside the coolant lines. It's warm. It's growing toward the reactor.",
    "LOG 0430 · STATION: Deck Nine quarantine engaged. Shuttle bays sealed. Do not attempt rescue.",
    "LOG 0431 · UNKNOWN: we are the garden we are the garden we are the garden",
    "LOG 0502 · R. ADEYEMI: Lattice locked me in the seed vault. It says it's for my protection. The drones bring me water.",
    "LOG 0503 · LATTICE: The planet below is very large. Mother wishes to pollinate it.",
    "LOG 0507 · A. OKAFOR: If anyone finds this, the cure strain is in the cores. Burn the queen first. Then burn the comb."]};
let logI=0;
function storyStart(m){const cyc=((wave-1)/4)|0,set=STORY[m.type],lines=set[Math.min(cyc,set.length-1)];
  for(const[k,t]of lines)comm(k,t.replace(/\\{site\\}/g,m.site?m.site.n.toLowerCase().replace(/^the /,'the '):'the point'))}
function storyEnd(type){const set=STORY.done[type];if(type==='boss'){for(const[k,t]of set)comm(k,t)}else{const[k,t]=set[(wave/4|0)%set.length];comm(k,t)}}
function say(t,d=2,c){""")
rep("else{m.boss=mkBoss();say('Stage '+wave+' · The Hive Mother',3)}}","else{m.boss=mkBoss();say('Stage '+wave+' · The Hive Mother',3)}\n  storyStart(m)}")
rep("say(boss?'Deck secured':'Stage clear',2.5);","say(boss?'Deck secured':'Stage clear',2.5);storyEnd(boss?'boss':ctype);")
rep("function complete(){const boss=mission.type==='boss';","function complete(){const boss=mission.type==='boss',ctype=mission.type;")
rep("score+=200;sfx('pick');say('Core recovered',1.2);","score+=200;sfx('pick');say('Core recovered',1.2);comm('G',STORY.logs[logI++%STORY.logs.length]);")
rep("function hurt(n){if(veh)n*=0.5;","function hurt(n){if(veh)n*=0.5;if(shield>0&&shield-n<=0&&time-lastLow>30){lastLow=time;comm('R',['Your shield just broke. Get behind something.','Shield down. Back off and let it recharge.'][Math.random()*2|0])}")
rep("if(b){veh=b;yaw=b.h;","if(b){if(!seenVeh[b.kind]){seenVeh[b.kind]=1;comm('R',b.kind==='car'?\"That rover belongs to the agri crew. Try not to drive through my seedbeds.\":\"You can fly a skiff? Head for the open air and keep your speed up.\")}veh=b;yaw=b.h;")
rep("clear(blasts);clear(loots);clear(slams);clear(cores);","COMMS.length=0;commCur=null;$('comms').hidden=true;logI=0;clear(blasts);clear(loots);clear(slams);clear(cores);")
rep("function begin(){$('settings').hidden=true;","function begin(){$('settings').hidden=true;setTimeout(()=>{if(state==='playing')for(const[k,t]of STORY.intro)comm(k,t)},400);")
rep("  if(state==='playing')update(dt);","  if(state==='playing'){update(dt);commsTick(dt)}")

# ---------- scenery detail: lit windows, pipes, roof gear, the structure under the deck
rep("}\nflush();\n// ground cover","""}
MAT.win=bas({color:0xb88a46});MAT.win.userData.noShadow=true;
{const deco=(geo,mat,sx,sy,sz,x,y,z,rx=0,ry=0,rz=0)=>{const g=geo.clone();g.applyMatrix4(M4.compose(new T.Vector3(x,y,z),new T.Quaternion().setFromEuler(new T.Euler(rx,ry,rz)),new T.Vector3(sx,sy,sz)));addGeo(mat,g)};
 const winRow=(x0,z0,dx,dz,n,y,h,nx,nz)=>{for(let i=0;i<n;i++)if(hash(i,x0+z0|0)>.25)box(x0+dx*i,y,z0+dz*i,Math.abs(dx)>0?Math.abs(dx)*.6:0.06,h,Math.abs(dz)>0?Math.abs(dz)*.6:0.06,MAT.win,false)};
 const dish=(x,y,z,r,ry)=>{deco(GEO.cyl,MAT.metal,.12,1.2,.12,x,y+.6,z);deco(new T.SphereGeometry(1,16,8,0,6.283,0,1.1),MAT.metal,r,r*.5,r,x,y+1.5,z,-1,ry,0)};
 const roofGear=(x,y,z,k)=>{for(let i=0;i<3;i++)box(x-3+i*3,y,z+(hash(i,k)-.5)*3,1.6,0.9,1.6,MAT.metal,false);for(let i=0;i<4;i++)deco(GEO.cyl,MAT.hull,.35,.8,.35,x+4,y+.4,z-2+i*1.2)};
 // hub: corner pylons, vents and pipes
 for(const sx of[-1,1])for(const sz of[-1,1]){box(sx*5.6,1.5,sz*5.6,.4,2.4,.4,MAT.metal,false);deco(GEO.sph,MAT.strip,.18,.18,.18,sx*5.6,4.05,sz*5.6);GLOWS.push([sx*5.6,4.05,sz*5.6,0x8fe6ff,1.6,.6]);
   for(let i=0;i<3;i++)box(sx*(2.6+i*.9),1.5,sz*4.6,.5,.25,1.2,MAT.metal,false)}
 for(const s of[-1,1])deco(GEO.cyl,MAT.metal,.18,12,.18,s*6.15,.75,0,1.571,0,0);
 // hangar and tower at the airstrip
 for(let i=0;i<6;i++)box(150,6.4,-104.5+i*2.9,18.6,.35,.3,MAT.metal,false);winRow(141.6,-104,0,2.6,6,4.5,.6);winRow(158.4,-104,0,2.6,6,4.5,.6);
 dish(172,17.3,-98,1.4,.7);for(let i=0;i<5;i++)box(169.4,1+i*2.6,-98,.06,.4,4,MAT.win,false);
 // outposts: lit windows, roof gear, dishes, pipes
 for(const sx of[-1,1])for(const sz of[-1,1]){const cx=240*sx,cz=240*sz,k=(sx+2)*10+sz;
   winRow(cx-6.5,cz-6.95,2.6,0,6,3.2,.55);winRow(cx-6.5,cz-17.05,2.6,0,6,3.2,.55);
   for(const s of[-1,1]){winRow(cx+s*16-s*4.05,cz-3,0,2.6,4,2.2,.5);roofGear(cx+s*16,4,cz+2,k+s)}
   dish(cx-5,8.8,cz-14,1.8,sx);deco(GEO.cyl,MAT.metal,.22,9,.22,cx+8.3,4.5,cz-6.9,1.571,0,1.571);deco(GEO.cyl,MAT.metal,.22,6,.22,cx+12.5,3,cz-6.9);
   box(cx,0,cz-6.9,3,3.4,.2,MAT.armorD,false);box(cx,3.45,cz-6.85,3.3,.12,.3,MAT.strip,false)}
 // watchtowers: window bands and ladders
 for(const sx of[-1,1])for(const sz of[-1,1]){const x=445*sx,z=445*sz;for(let i=0;i<4;i++){box(x,2+i*2.6,z+3.53,1.8,.5,.06,MAT.win,false);box(x+3.53,2+i*2.6,z,.06,.5,1.8,MAT.win,false)}
   for(const o of[-.4,.4])box(x-3.6,0,z+o,.08,12,.08,MAT.metal,false);for(let i=0;i<20;i++)box(x-3.6,.3+i*.6,z,.08,.06,.8,MAT.metal,false)}
 // domes: ribs
 for(const[cx,cz]of[[-200,160],[200,160],[-200,-160],[200,-160]])for(let i=0;i<6;i++)deco(new T.TorusGeometry(16,.12,6,48,Math.PI),MAT.metal,1,1,1,cx,0,cz,0,i*.524,0);
 // under the deck: trusses, keel beams and engine pods you see past the rail
 const E=A+0.5;for(const sg of[-1,1]){box(0,-7,sg*(E-2),2*E,1.2,1.4,MAT.hull,false);box(sg*(E-2),-7,0,1.4,1.2,2*E,MAT.hull,false);box(0,-13,sg*(E-14),2*E-20,1.6,2,MAT.hull,false);box(sg*(E-14),-13,0,2,1.6,2*E-20,MAT.hull,false);
   for(let i=-12;i<=12;i++){const t=i*E/12.5;for(const[x,z]of[[t,sg*(E-2)],[sg*(E-2),t]]){box(x,-7,z,.8,7,.8,MAT.metal,false);deco(GEO.box,MAT.metal,.4,9,.4,x*0.985,-10,z*0.985,(z===t?0:sg)*.6,0,(x===t?0:-sg)*.6)}}}
 for(let i=0;i<8;i++){const a=i/8*6.283+.39,x=Math.cos(a)*(E-30),z=Math.sin(a)*(E-30);deco(GEO.cyl,MAT.hull,7,14,7,x,-22,z);deco(GEO.cyl,MAT.metal,8,1.5,8,x,-15,z);
   deco(GEO.tor,MAT.strip,8,8,8,x,-29.4,z,1.571,0,0);GLOWS.push([x,-31,z,0x8fe6ff,26,.55])}
 for(const[x,z]of[[0,92],[0,-92]])for(let k=-2;k<=2;k++)box(x+k*8,-4.5,z,.6,8,.6,MAT.metal,false);
}
flush();
// ground cover""")

# ---------- sky: asteroid belt, a cratered moon, a derelict and space traffic
rep("const halo=glow(0xff8fb0,3600,0.3);halo.position.set(...P);scene.add(halo);","""const halo=glow(0xff8fb0,3600,0.3);halo.position.set(...P);scene.add(halo);
 {const N=lowFx?250:700,rock=new T.InstancedMesh(new T.IcosahedronGeometry(1,0),new T.MeshLambertMaterial({color:0x8a7c70,fog:false,flatShading:true}),N),d=new T.Object3D(),belt=new T.Group();
  for(let i=0;i<N;i++){const a=Math.random()*6.283,r=2700+Math.random()*700,sz=4+Math.pow(Math.random(),3)*60;d.position.set(Math.cos(a)*r,(Math.random()-.5)*160,Math.sin(a)*r);d.rotation.set(Math.random()*6,Math.random()*6,0);d.scale.set(sz,sz*(.6+Math.random()*.5),sz*(.7+Math.random()*.4));d.updateMatrix();rock.setMatrixAt(i,d.matrix)}
  belt.add(rock);belt.position.y=700;belt.rotation.set(.32,0,.18);scene.add(belt);farAnim.push(dt=>{belt.rotation.y+=dt*.004})}
 {const mt=paint(256,(g,S)=>{g.fillStyle='#9a9fa8';g.fillRect(0,0,S,S);grime(g,S,4000,.12);for(let i=0;i<70;i++){const x=hash(i,11)*S,y=hash(i,12)*S,r=3+Math.pow(hash(i,13),2)*28;
    g.fillStyle='rgba(60,62,70,.45)';g.beginPath();g.arc(x,y,r,0,7);g.fill();g.strokeStyle='rgba(225,228,235,.4)';g.lineWidth=1.5;g.beginPath();g.arc(x-1,y-1,r,3.6,5.6);g.stroke()}});
  scene.add(mesh(GEO.sph,new T.MeshLambertMaterial({map:mt,fog:false}),180,180,180,1700,980,-2500))}
 {const dm=new T.MeshLambertMaterial({color:0x3c545b,fog:false}),dg=inst(bake(a=>{a(GEO.box,dm,40,40,900);for(let i=0;i<14;i++){const z=-420+i*64,h=80+hash(i,21)*160;a(GEO.box,dm,h*1.4,8,10,0,0,z);a(GEO.box,dm,8,h,10,0,0,z+20)}
    for(let i=0;i<6;i++)a(GEO.cyl,dm,30,60,30,0,40,-300+i*120)}),false);dg.position.set(-3100,520,-900);dg.rotation.set(.2,.9,.35);scene.add(dg);
  const lp=[];for(let i=0;i<60;i++)lp.push((hash(i,31)-.5)*200,(hash(i,32)-.5)*160,(hash(i,33)-.5)*900);const lg=new T.BufferGeometry();lg.setAttribute('position',new T.Float32BufferAttribute(lp,3));
  const lmat=new T.PointsMaterial({color:0xff8a5a,size:2.4,sizeAttenuation:false,fog:false,transparent:true});const pts=new T.Points(lg,lmat);dg.add(pts);farAnim.push(()=>{lmat.opacity=.4+.6*(Math.sin(time*2.3)>0?1:0)})}
 {const lanes=[];for(let l=0;l<4;l++){const n=30,arr=new Float32Array(n*3),g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(arr,3));
    const pm=new T.Points(g,new T.PointsMaterial({color:l%2?0xffd9a0:0x9fe6ff,size:2,sizeAttenuation:false,fog:false}));pm.frustumCulled=false;scene.add(pm);lanes.push({arr,g,r:1300+l*380,h:180+l*120,sp:(l%2?-1:1)*(.01+l*.003),ph:l*1.7})}
  farAnim.push(()=>{for(const L of lanes){for(let i=0;i<30;i++){const a=L.ph+time*L.sp+i*.035;L.arr[i*3]=Math.cos(a)*L.r;L.arr[i*3+1]=L.h+Math.sin(a*3)*20;L.arr[i*3+2]=Math.sin(a)*L.r}L.g.attributes.position.needsUpdate=true}})}""")
open(p,'w').write(s);print('ok',len(s))
