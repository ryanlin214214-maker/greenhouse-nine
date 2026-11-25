p='index.html';s=open(p).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:70]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:70]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]

# ---------- css / html
rep(".msg{position:absolute;left:0;right:0;top:22%;",".msg{position:absolute;left:0;right:0;top:30%;")
rep(".hurt,.nova{",""".obj{position:absolute;left:50%;top:10px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:4px;pointer-events:none;
  font-family:var(--display);font-weight:700;font-size:13px;letter-spacing:.14em;text-shadow:0 1px 0 #000;white-space:nowrap}
.obj .meter{width:clamp(150px,30vw,300px);height:7px}
.obj .meter i{background:var(--bloom)}
@media (max-width:620px){.obj{top:122px;font-size:11px}}
.panel{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:5;width:min(92%,340px);box-sizing:border-box;display:flex;flex-direction:column;gap:12px;
  padding:16px;background:var(--panel);border:1px solid var(--amber);font-size:12px}
.panel h3{margin:0;font-family:var(--display);font-size:16px;letter-spacing:.14em;text-transform:uppercase}
.panel label{display:flex;justify-content:space-between;align-items:center;gap:12px}
.panel input[type=range]{flex:0 1 150px;min-width:0;accent-color:var(--amber)}
.panel select{font:inherit;color:var(--fg);background:var(--hull);border:1px solid var(--line);padding:4px 6px}
.panel input[type=checkbox]{accent-color:var(--amber);width:16px;height:16px}
.hurt,.nova{""")
rep('<button id="full" type="button">Fullscreen</button>','<button id="cfg" type="button">Settings</button>\n  <button id="full" type="button">Fullscreen</button>')
rep('<span>WAVE <span id="wave">1</span></span>','<span>STAGE <span id="wave">1</span></span>')
rep('<div class="msg" id="msg"></div>','''<div class="obj" id="obj" hidden><span id="objT"></span><div class="meter" id="objBar"><i></i></div></div>
  <div class="msg" id="msg"></div>''')
rep('  <div class="overlay" id="overlay">','''  <div class="panel" id="settings" hidden>
    <h3>Settings</h3>
    <label for="setQ">Graphics quality <select id="setQ"><option value="low">Low</option><option value="med">Medium</option><option value="high">High</option></select></label>
    <label for="setSens">Aim sensitivity <input id="setSens" type="range" min="0.3" max="2.5" step="0.1"></label>
    <label for="setFov">Field of view <input id="setFov" type="range" min="60" max="100" step="1"></label>
    <label for="setVol">Volume <input id="setVol" type="range" min="0" max="1" step="0.05"></label>
    <label for="setInv">Invert vertical aim <input id="setInv" type="checkbox"></label>
    <button type="button" id="setClose">Done</button>
  </div>
  <div class="overlay" id="overlay">''')
rep("Pick a class, collect better weapons and clear the deck.","Pick a class, collect better weapons, and fight through each stage to the Hive Mother.")
rep("You held out to wave ${wave}","You reached stage ${wave}")

# ---------- settings core
rep("renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));","""const CFG={q:(portrait||matchMedia('(pointer: coarse)').matches)?'low':'high',sens:1,vol:0.8,inv:false,fov:74};
try{Object.assign(CFG,JSON.parse(localStorage.getItem('gh9-cfg')||'{}'))}catch(e){}
if(!['low','med','high'].includes(CFG.q))CFG.q='high';
let bloomOn=true;""")
rep("  if(composer){try{composer.render()}catch(e){composer=null}}else renderer.render(scene,cam);","  if(composer&&bloomOn){try{composer.render()}catch(e){composer=null}}else renderer.render(scene,cam);")
rep("demo();requestAnimationFrame(frame);","""function applyCfg(){const d=window.devicePixelRatio||1,q=CFG.q;
  renderer.setPixelRatio(q==='high'?Math.min(d,2):q==='med'?Math.min(d,1.25):1);sun.castShadow=q!=='low';bloomOn=q!=='low';
  cam.fov=CFG.fov+(portrait?14:0);resize();try{localStorage.setItem('gh9-cfg',JSON.stringify(CFG))}catch(e){}}
$('setQ').value=CFG.q;$('setSens').value=CFG.sens;$('setFov').value=CFG.fov;$('setVol').value=CFG.vol;$('setInv').checked=!!CFG.inv;
$('setQ').addEventListener('change',e=>{CFG.q=e.target.value;applyCfg()});
$('setSens').addEventListener('input',e=>{CFG.sens=+e.target.value;applyCfg()});
$('setFov').addEventListener('input',e=>{CFG.fov=+e.target.value;applyCfg()});
$('setVol').addEventListener('input',e=>{CFG.vol=+e.target.value;applyCfg()});
$('setInv').addEventListener('change',e=>{CFG.inv=e.target.checked;applyCfg()});
$('cfg').addEventListener('click',()=>{const o=$('settings');if(o.hidden&&state==='playing')pause();o.hidden=!o.hidden});
$('setClose').addEventListener('click',()=>{$('settings').hidden=true});
applyCfg();
demo();requestAnimationFrame(frame);""")
rep("g.gain.setValueAtTime(vol,t);","g.gain.setValueAtTime(Math.max(0.0001,vol*CFG.vol),t);")
rep("const look=(dx,dy,s)=>{yaw-=dx*s;pitch=Math.max(-1.45,Math.min(1.45,pitch-dy*s))};","const look=(dx,dy,s)=>{s*=CFG.sens;yaw-=dx*s;pitch=Math.max(-1.45,Math.min(1.45,pitch-dy*s*(CFG.inv?-1:1)))};")
rep("function begin(){","function begin(){$('settings').hidden=true;")
rep("function resume(){","function resume(){$('settings').hidden=true;")

# ---------- missions + boss
rep("const ER=[0.5,0.55,1.0];","const ER=[0.5,0.55,1.0,3,0.7];")
between("function startWave(){","\n/* ---------- audio ---------- */","""const clampA=v=>Math.max(-A+3,Math.min(A-3,v));
function spawnAt(type,t=0){let x=0,z=0;for(let k=0;k<8;k++){const a=Math.random()*6.283,r=24+Math.random()*10;x=clampA(pos.x+Math.cos(a)*r);z=clampA(pos.z+Math.sin(a)*r);if(Math.hypot(x-pos.x,z-pos.z)>16)break}
  queue.push({t,type,x,y:7+Math.random()*3,z})}
const pickType=()=>wave>=2&&Math.random()<0.3?1:0;
const alive=()=>{let n=queue.length;for(const e of enemies)if(!e.dying&&e.type<3)n++;return n};
const SITES=[{n:'THE ORCHARD',x:46,y:0,z:4},{n:'THE TANK FARM',x:-54,y:0,z:16},{n:'THE CARGO YARD',x:0,y:0,z:41},{n:'THE TERRACES',x:-12,y:1.5,z:-46}];
const CORE_SPOTS=[[-54,4.55,0],[10,4.5,-62],[20,2,20],[0,3,-24],[0,0,36.5],[54,0,-16],[-40,0,-40],[0,1.5,4]];
let mission=null,gap=0.01,slams=[],cores=[];
const beaconMat=bas({color:0x8fe6ff,transparent:true,opacity:0.85,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending,fog:false});
const pillarMat=bas({color:0x8fe6ff,transparent:true,opacity:0.16,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending,fog:false});
const slamMat=bas({color:0xff3b3b,transparent:true,opacity:0.9,side:T.DoubleSide,depthWrite:false,fog:false});
GEO.ring=new T.RingGeometry(0.86,1,48);
const beacon=new T.Group();{const r=mesh(GEO.ring,beaconMat,6,6,1,0,0.08,0);r.rotation.x=-Math.PI/2;beacon.add(r,mesh(GEO.cyl,pillarMat,0.6,60,0.6,0,30,0))}beacon.visible=false;scene.add(beacon);
function mkCore(x,y,z){const g=new T.Group(),o=mesh(GEO.oct,bas({color:0x8fe6ff}),0.35,0.5,0.35,0,1,0);g.add(o,glow(0x8fe6ff,3,0.8),mesh(GEO.cyl,pillarMat,0.25,40,0.25,0,20,0));
  g.children[1].position.y=1;g.position.set(x,y,z);scene.add(g);return{g,o,x,y,z}}
function setObj(t,frac){$('obj').hidden=false;$('objT').textContent=t;const b=$('objBar');b.hidden=frac===undefined;if(frac!==undefined)b.firstElementChild.style.width=Math.max(0,Math.min(1,frac))*100+'%'}
function bossModel(){const g=new T.Group();
  g.add(mesh(GEO.sph,MAT.violetD,3,2.3,3.1),mesh(GEO.sph,MAT.violet,3.06,0.5,3.16,0,0.5,0),mesh(GEO.sph,MAT.bulb,2.2,1.6,2.2,0,-1.4,0));
  for(let i=0;i<7;i++){const a=i/7*6.283;g.add(mesh(GEO.cone,MAT.amber,0.35,1.8,0.35,Math.cos(a)*1.9,2.4,Math.sin(a)*1.9))}
  for(let i=0;i<5;i++){const a=i/5*6.283,t=mesh(GEO.cone,MAT.leafD,0.25,3,0.25,Math.cos(a)*1.2,-3.6,Math.sin(a)*1.2);t.rotation.x=Math.PI;g.add(t)}
  g.add(mesh(GEO.sph,MAT.eyeA,0.9,0.9,0.5,0,0.2,2.85),mesh(GEO.sph,MAT.dark,0.4,0.4,0.2,0,0.2,3.25));
  const wings=wingPair(g,6,1.2),parts=[];g.traverse(o=>{if(o.isMesh&&o.material!==MAT.wing){o.castShadow=true;parts.push([o,o.material])}});
  const gl=glow(0xffb238,7,0.8);gl.position.set(0,0.2,3.3);g.add(gl);return{g,wings,parts}}
const EB=()=>({white:false,flash:0,dying:0,sh:0,sel:0,shell:null,wings:[],spd:0,cd:0,ph:0});
function growPods(b){const n=b.hp<b.max/3?4:3,k=1+0.14*(wave-1);
  for(let i=0;i<n;i++){const g=new T.Group();g.add(mesh(GEO.sph,MAT.bulb,0.7,0.7,0.7),mesh(GEO.sph,MAT.core,0.42,0.42,0.42,0,0,0.42),glow(0x9dff7a,2.6,0.8));
    const parts=[];g.traverse(o=>{if(o.isMesh)parts.push([o,o.material])});g.position.copy(b.pos);scene.add(g);
    const e={...EB(),type:4,pos:g.position,g,parts,r:0.7,hp:5*k,boss:b,ang:i/n*6.283};b.pods.push(e);enemies.push(e)}}
function mkBoss(){const m=bossModel(),k=1+0.14*(wave-1),a=Math.random()*6.283;m.g.position.set(clampA(pos.x+Math.cos(a)*24),16,clampA(pos.z+Math.sin(a)*24));scene.add(m.g);
  const e={...EB(),type:3,pos:m.g.position,g:m.g,wings:m.wings,parts:m.parts,r:3,hp:300*k,max:300*k,vuln:0,pods:[],cv:3.5,cs:6,cm:9,tip:false};enemies.push(e);growPods(e);return e}
function bossTick(e,dt){const p=e.pos,dx=eye.x-p.x,dz=eye.z-p.z,hd=Math.hypot(dx,dz)||1,ux=dx/hd,uz=dz/hd,ph=e.hp<e.max/3?3:e.hp<e.max*2/3?2:1;
  const want=hd>20?1:hd<12?-1:0,sp=e.vuln>0?0:3.4;p.x=clampA(p.x+(ux*want-uz*0.4)*sp*dt);p.z=clampA(p.z+(uz*want+ux*0.4)*sp*dt);
  p.y+=((e.vuln>0?3.4:8.5+Math.sin(time)*0.8)-p.y)*Math.min(1,dt*1.5);
  for(const q of e.pods){q.ang+=dt*1.1;q.pos.set(p.x+Math.cos(q.ang)*4.8,p.y+Math.sin(q.ang*2)*1.1,p.z+Math.sin(q.ang)*4.8)}
  if(e.vuln>0){e.vuln-=dt;if(e.vuln<=0){growPods(e);say('Armor restored',1.5)}return}
  e.cv-=dt;e.cs-=dt;e.cm-=dt;
  if(e.cv<=0){e.cv=3.4-ph*0.5;const n=1+ph*2,d=Math.hypot(dx,eye.y-p.y,dz)||1;sfx('spit');
    for(let i=0;i<n;i++){const a=(i-(n-1)/2)*0.1,c=Math.cos(a),sn=Math.sin(a),vx=(dx*c-dz*sn)/d,vz=(dx*sn+dz*c)/d;
      const g=mesh(GEO.sph,MAT.spore,0.26,0.26,0.26,p.x,p.y-0.5,p.z);g.add(glow(0xff6fb8,7));scene.add(g);shots.push({g,v:new T.Vector3(vx*13,(eye.y-p.y+0.5)/d*13,vz*13),t:7})}}
  if(e.cs<=0){e.cs=7.5-ph*1.2;const g=mesh(GEO.ring,slamMat,1,1,1,pos.x,pos.y+0.12,pos.z);g.rotation.x=-Math.PI/2;scene.add(g);slams.push({g,t:1.3,x:pos.x,y:pos.y,z:pos.z});sfx('over')}
  if(e.cm<=0){e.cm=15-ph*2;if(alive()<6)for(let i=0;i<1+ph;i++)enemies.push(mk(0,p.x+(Math.random()-.5)*6,p.y-2,p.z+(Math.random()-.5)*6))}}
function nextMission(){wave++;const type=['purge','capture','recover','boss'][(wave-1)%4],m=mission={type,spawnT:2,done:false};sfx('wave');
  if(type==='purge'){const n=7+wave*2;for(let i=0;i<n;i++)spawnAt(pickType(),i*0.4);if(wave>4)spawnAt(2,n*0.4);say('Stage '+wave+' · Purge',2.5)}
  else if(type==='capture'){m.site=SITES[Math.random()*SITES.length|0];m.p=0;beacon.position.set(m.site.x,m.site.y,m.site.z);beacon.visible=true;say('Stage '+wave+' · Capture',2.5)}
  else if(type==='recover'){for(const[x,y,z]of CORE_SPOTS.slice().sort(()=>Math.random()-.5).slice(0,4))cores.push(mkCore(x,y,z));say('Stage '+wave+' · Recover',2.5)}
  else{m.boss=mkBoss();say('Stage '+wave+' · The Hive Mother',3)}}
function complete(){const boss=mission.type==='boss';mission=null;gap=boss?7:4;beacon.visible=false;$('obj').hidden=true;
  for(const e of enemies)if(!e.dying){e.dying=0.001;sparkle(e.pos,0xffffff,6,5)}queue.length=0;clear(shots);clear(slams);
  score+=wave*100;hp=Math.min(100,hp+(boss?100:25));ammo=Math.min(24,ammo+(boss?12:4));say(boss?'Deck secured':'Stage clear',2.5);sfx('pick')}
function missionTick(dt){
  for(let i=slams.length-1;i>=0;i--){const q=slams[i];q.t-=dt;q.g.scale.setScalar(1+(1-q.t/1.3)*4.5);
    if(q.t<=0){scene.remove(q.g);slams.splice(i,1);const m=bas({color:0xff3b3b,transparent:true,opacity:0.85,fog:false}),g=mesh(GEO.sph,m,0.5,0.5,0.5,q.x,q.y+0.5,q.z);scene.add(g);blasts.push({g,m,t:0});
      sparkle(g.position,0xff5a5a,16,9);sfx('boom');if(Math.hypot(pos.x-q.x,pos.z-q.z)<5.5&&Math.abs(pos.y-q.y)<3){hurt(35);if(state!=='playing')return}}}
  if(!mission){gap-=dt;if(gap<=0)nextMission();return}
  const m=mission;
  if(m.type==='purge'){const n=alive();setObj('PURGE THE DECK · '+n+' LEFT');if(!n)complete();return}
  if(m.type==='boss'){const b=m.boss;setObj(b.vuln>0?'HIVE MOTHER · ARMOR DOWN, HIT THE EYE':'HIVE MOTHER · BREAK THE PODS',b.hp/b.max);if(m.done)complete();return}
  m.spawnT-=dt;if(m.spawnT<=0&&alive()<4+Math.min(wave,8)){m.spawnT=1.3;spawnAt(pickType())}
  if(m.type==='capture'){const s=m.site,d=Math.hypot(pos.x-s.x,pos.z-s.z),inside=d<6&&Math.abs(pos.y-s.y)<4;if(inside)m.p+=dt/26;
    beaconMat.opacity=inside?0.6+Math.sin(time*8)*0.3:0.85;setObj(inside?'HOLD THE POINT':'CAPTURE '+s.n+' · '+Math.round(d)+' M',m.p);if(m.p>=1)complete();return}
  let near=1e9;for(let i=cores.length-1;i>=0;i--){const c=cores[i],d=Math.hypot(pos.x-c.x,pos.z-c.z);c.o.rotation.y+=dt*2;
    if(d<1.7&&Math.abs(pos.y-c.y)<2.2){scene.remove(c.g);cores.splice(i,1);score+=200;sfx('pick');say('Core recovered',1.2);continue}near=Math.min(near,d)}
  if(!cores.length){complete();return}
  setObj('RECOVER DATA CORES · '+(4-cores.length)+'/4 · '+Math.round(near)+' M',(4-cores.length)/4)}
function targets(){const m=mission;if(!m)return[];if(m.type==='capture')return[m.site];if(m.type==='recover')return cores;return[]}
""")
between("  // waves\n","  // enemies\n","""  // missions
  for(let i=queue.length-1;i>=0;i--){const q=queue[i];q.t-=dt;if(q.t<=0){enemies.push(mk(q.type,q.x,q.y,q.z));queue.splice(i,1)}}
  missionTick(dt);if(state!=='playing')return;
""")
rep("    if(e.dying)continue;\n    const p=e.pos,dx=eye.x-p.x","    if(e.dying)continue;\n    if(e.type>=3){if(e.type===3)bossTick(e,dt);continue}\n    const p=e.pos,dx=eye.x-p.x")
rep("const o=enemies[j],ox=p.x-o.pos.x","const o=enemies[j];if(o.type>=3)continue;const ox=p.x-o.pos.x")
rep("function damage(e,n,el=-1,crit=false){if(e.dying)return;e.flash=0.1;","function damage(e,n,el=-1,crit=false){if(e.dying)return;e.flash=0.1;\n  if(e.type===3&&e.vuln<=0){n*=0.12;crit=false;if(!e.tip){e.tip=true;say('Armored: break the green pods',2.5)}}")
between("  e.dying=0.001;sparkle(e.pos,","function fire(){","""  e.dying=0.001;sparkle(e.pos,[0xffb238,0xff4fa3,0xc9a6ff,0xffb238,0x9dff7a][e.type],e.type>=2?30:14,e.type===3?16:7);sfx('kill');
  if(e.type===4){score+=50;const b=e.boss;b.pods=b.pods.filter(q=>q!==e);if(!b.pods.length&&!b.dying){b.vuln=9;say('Armor down: hit the eye',2.5);sfx('nova')}return}
  if(e.type===3){score+=5000;superQ=100;for(const q of e.pods)q.dying=0.001;e.pods=[];for(let i=0;i<3;i++){loot(e);e.pos.x+=1.3}drop(e,0);if(mission)mission.done=true;return}
  score+=e.type===2?500:e.type?150:100;superQ=Math.min(100,superQ+(e.type===2?30:7));
  const r=Math.random();if(e.type===2||r<0.2)drop(e,0);else if(r<0.4)drop(e,1);
  if(e.type===2||Math.random()<0.16)loot(e)}
""")
rep("r=Math.random()-w*0.015-(e.type===2?0.25:0)","r=Math.random()-w*0.015-(e.type===3?0.5:e.type===2?0.25:0)")
rep("{e.pos.addScaledVector(tmp2,1.5/d);damage(e,k)}","{if(e.type<3)e.pos.addScaledVector(tmp2,1.5/d);damage(e,k)}")
rep("clear(blasts);clear(loots)}","clear(blasts);clear(loots);clear(slams);clear(cores);mission=null;gap=0.01;beacon.visible=false;$('obj').hidden=true}")
rep("    rc.fillStyle=e.type===2?'#c9a6ff':e.type?'#ff4fa3':'#ffb238';const s=e.type===2?10:6;","    rc.fillStyle=e.type===4?'#9dff7a':e.type>=2?'#c9a6ff':e.type?'#ff4fa3':'#ffb238';const s=e.type===3?18:e.type===2?10:6;")
rep("  rc.fillStyle='#dcebe4';rc.beginPath();rc.moveTo(76,66);","""  for(const t of targets()){const ex=t.x-pos.x,ez=t.z-pos.z;let fw=(ex*fx+ez*fz)*2.4,rt=(ex*-fz+ez*fx)*2.4;const m=Math.hypot(fw,rt);if(m>64){fw*=64/m;rt*=64/m}
    rc.save();rc.translate(76+rt,76-fw);rc.rotate(0.785);rc.fillStyle='#8fe6ff';rc.fillRect(-6,-6,12,12);rc.restore()}
  rc.fillStyle='#dcebe4';rc.beginPath();rc.moveTo(76,66);""")
open(p,'w').write(s)
