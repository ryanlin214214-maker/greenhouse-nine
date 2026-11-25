# v72: credits, spectator mode, darker high-contrast space
import sys
src,dst=sys.argv[1],sys.argv[2]
s=open(src).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:90]);s=s.replace(a,b)

# ---------- credits: a wallet kept apart from runs (a new game keeps it), saved in the browser and the account ----------
rep('<span id="score">0</span>','<span id="score">0</span><span class="cr" id="cred">0 CR</span>')
rep('<div class="fhud" id="fhud" hidden><div id="ftg"></div>','<div class="fhud" id="fhud" hidden><div id="ftg"></div><div class="fcr" id="fcred"></div>')
rep(".hurt{background:radial-gradient(ellipse at center,transparent 45%,var(--hurt) 130%)}",
    ".hurt{background:radial-gradient(ellipse at center,transparent 45%,var(--hurt) 130%)}\n.cr{color:#ffd27a;font-weight:700}.cr.up{color:#fff;text-shadow:0 0 8px #ffd27a}\n"
    ".fcr{position:absolute;right:14px;top:178px;font:700 12px 'Chakra Petch',sans-serif;letter-spacing:.08em;color:#ffd27a;text-shadow:0 0 4px #000}\n"
    ".spec{position:absolute;left:50%;top:12px;transform:translateX(-50%);font:700 11px 'Chakra Petch',sans-serif;letter-spacing:.14em;color:#8fe6ff;background:rgba(0,0,0,.55);padding:4px 10px;pointer-events:none}")
WAL=r'''// ---- credits (CR): earned for kills, bosses, salvage and stage clears, in flight too; spent at Meridian later
let WAL={cr:0,ships:['kestrel'],ship:'kestrel'},walRef=null,walT=0,crShown=-1;
try{const o=JSON.parse(localStorage.getItem('gh9-wallet')||'null');if(o&&isFinite(o.cr))WAL={cr:Math.max(0,Math.floor(o.cr)),ships:Array.isArray(o.ships)?o.ships.filter(x=>typeof x==='string').slice(0,12):['kestrel'],ship:typeof o.ship==='string'?o.ship:'kestrel'}}catch(e){}
if(!WAL.ships.includes('kestrel'))WAL.ships.unshift('kestrel');
function walSave(){clearTimeout(walT);walT=setTimeout(()=>{try{localStorage.setItem('gh9-wallet',JSON.stringify(WAL))}catch(e){}if(walRef)walRef.set(WAL).catch(()=>{})},800)}
function cr(n){if(!(n>0))return;WAL.cr+=Math.round(n);walSave();const a=$('cred'),b=$('fcred');for(const el of[a,b])if(el){el.classList.add('up');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('up'),300)}}
function crTick(){if(WAL.cr===crShown)return;crShown=WAL.cr;const t=WAL.cr.toLocaleString()+' CR';$('cred').textContent=t;$('fcred').textContent=t}
'''
rep("function newGuns(){guns=WPN.map((_,k)=>mkGun(k))}newGuns();",WAL+"function newGuns(){guns=WPN.map((_,k)=>mkGun(k))}newGuns();")
# the account copy: loaded with the save, the newer amount wins
rep("m2Ref=db.doc('data/users/'+id+'/m2');","m2Ref=db.doc('data/users/'+id+'/m2');walRef=db.doc('data/users/'+id+'/wallet');try{const w=await walRef.get();if(w.exists){const v=Math.floor(+w.data().cr)||0;if(v>WAL.cr){WAL.cr=v;if(Array.isArray(w.data().ships))WAL.ships=w.data().ships.filter(x=>typeof x==='string').slice(0,12);if(typeof w.data().ship==='string')WAL.ship=w.data().ship}}}catch(e){}")
# payouts
rep("if(e.type===4){score+=50;","if(e.type===4){score+=50;cr(5);")
rep("if(e.type===3){score+=5000;","if(e.type===3){score+=5000;cr(250);")
rep("score+=e.type>=5?GP[e.type].score:e.type===2?500:e.type?150:100;","score+=e.type>=5?GP[e.type].score:e.type===2?500:e.type?150:100;cr(e.type>=5?GP[e.type].score/10:e.type===2?50:e.type?15:10);")
rep("FLY.kills++;score+=e.kind==='gun'?600:e.kind==='pod'?300:e.kind==='ace'?3000:150;","FLY.kills++;score+=e.kind==='gun'?600:e.kind==='pod'?300:e.kind==='ace'?3000:150;cr(e.kind==='gun'?60:e.kind==='pod'?30:e.kind==='ace'?400:e.kind==='mine'?2:15);")
rep("function complete(){const boss=!!mission.boss,C=mission.C;","function complete(){const boss=!!mission.boss,C=mission.C;cr(boss?150:100);")
rep("else{score+=100;say('Salvage +100',1)}","else{score+=100;cr(15);say('Salvage +15 CR',1)}")
rep("else{score+=150;say('Salvage +150',1)}","else{score+=150;cr(25);say('Salvage +25 CR',1)}")
rep("INV.g[k].splice(i,1);score+=100}else{if(!INV.a[i])return;INV.a.splice(i,1);score+=150}","INV.g[k].splice(i,1);score+=100;cr(15)}else{if(!INV.a[i])return;INV.a.splice(i,1);score+=150;cr(25)}")
rep("function flyStageDone(){const S=FLY,st=S.stage||1;","function flyStageDone(){const S=FLY,st=S.stage||1;cr(st===3?500:200);")

# ---------- spectator mode (testing): fly a free camera; you cannot be hurt; optionally freeze the world ----------
rep('<label for="setAuto">Automatic sprint and afterburner <input id="setAuto" type="checkbox"></label>',
    '<label for="setAuto">Automatic sprint and afterburner <input id="setAuto" type="checkbox"></label>\n'
    '    <label for="setSpec">Spectator mode, for testing (O) <input id="setSpec" type="checkbox"></label>\n'
    '    <label for="setFrz">Freeze the world in spectator mode <input id="setFrz" type="checkbox"></label>')
SPEC=r'''const SPEC={on:false,frz:false,pos:new T.Vector3(),v:new T.Vector3()};
function specToggle(on){on=on===undefined?!SPEC.on:on;if(on===SPEC.on)return;SPEC.on=on;$('setSpec').checked=on;
  let d=$('specL');if(!d){d=document.createElement('div');d.id='specL';d.className='spec';cv.parentElement.appendChild(d)}
  d.textContent='SPECTATOR · WASD fly · Space up · Shift down · hold R fast · O to leave'+(SPEC.frz||FLY?' · world frozen':'');d.hidden=!on;
  if(on){SPEC.pos.copy(cam.position);firing=false;if(FLY){yaw=cam.rotation.y;pitch=cam.rotation.x}}else if(FLY){yaw=FLY.h;pitch=FLY.p}}
function specMove(dt){const f=(keys.KeyW?1:0)-(keys.KeyS?1:0)-mvY,st=(keys.KeyD?1:0)-(keys.KeyA?1:0)+mvX,up=(keys.Space?1:0)-(keys.ShiftLeft||keys.ShiftRight?1:0),sp=(keys.KeyR?60:14)*(FLY?6:1);
  const cp=Math.cos(pitch),fw=new T.Vector3(-Math.sin(yaw)*cp,Math.sin(pitch),-Math.cos(yaw)*cp),rt=new T.Vector3(Math.cos(yaw),0,-Math.sin(yaw));
  SPEC.v.copy(fw).multiplyScalar(f).addScaledVector(rt,st);SPEC.v.y+=up;if(SPEC.v.lengthSq()>1)SPEC.v.normalize();SPEC.pos.addScaledVector(SPEC.v,sp*dt)}
function update(dt){if(SPEC.on&&(SPEC.frz||FLY)){specMove(dt);return}'''
rep("function update(dt){",SPEC)
rep("if(veh)vehTick(dt);else if(cineT>0){","if(SPEC.on)specMove(dt);else if(veh)vehTick(dt);else if(cineT>0){")
rep("if(cineT<=0&&(firing||padFire)&&fireCd<=0)","if(cineT<=0&&!SPEC.on&&(firing||padFire)&&fireCd<=0)")
rep("if(INTRO.on){}","if(SPEC.on&&state!=='menu'){cam.position.copy(SPEC.pos);cam.rotation.set(pitch,yaw,0)}\n  else if(INTRO.on){}")
rep("vm.visible=state!=='menu'&&!veh&&cineT<=0&&!INTRO.on&&!FLY;","vm.visible=state!=='menu'&&!veh&&cineT<=0&&!INTRO.on&&!FLY&&!SPEC.on;")
rep("function hurt(n,src){if(cineT>0||FC.on)return;","function hurt(n,src){if(cineT>0||FC.on||SPEC.on)return;")
rep("if(INVOPEN&&(e.code==='KeyI'||e.code==='Escape')&&!e.repeat){invClose();e.preventDefault();return}",
    "if(INVOPEN&&(e.code==='KeyI'||e.code==='Escape')&&!e.repeat){invClose();e.preventDefault();return}\n"
    "  if(e.code==='KeyO'&&!e.repeat&&state==='playing'){specToggle();e.preventDefault();return}\n"
    "  if(SPEC.on&&state==='playing'&&e.code!=='KeyP'){if(e.code==='Space'||e.code.startsWith('Arrow'))e.preventDefault();return}")
rep("$('setAuto').addEventListener('change',e=>{CFG.auto=e.target.checked;applyCfg()});",
    "$('setAuto').addEventListener('change',e=>{CFG.auto=e.target.checked;applyCfg()});\n"
    "$('setSpec').addEventListener('change',e=>{if(state==='menu'){e.target.checked=false;return}specToggle(e.target.checked)});\n"
    "$('setFrz').addEventListener('change',e=>{SPEC.frz=e.target.checked;if(SPEC.on){SPEC.on=false;specToggle(true)}});")
# leaving to the menu ends spectating
rep("function setState(s){state=s;","function setState(s){state=s;if(s==='menu'&&SPEC.on)specToggle(false);")

# ---------- space: dimmer, more contrast, enemies still stand out ----------
rep("c.addPass(new T.UnrealBloomPass(new T.Vector2(z.x,z.y),BLOOM[0],BLOOM[1],BLOOM[2]));","c.addPass(BLP=new T.UnrealBloomPass(new T.Vector2(z.x,z.y),BLOOM[0],BLOOM[1],BLOOM[2]));")
rep("const FAR=new T.Group();","let BLP=null;const FAR=new T.Group();\n"
    "// in flight the backdrop (Blade, planets, belt, sky) is dimmed and bloom nearly off; restored on landing\n"
    "function spaceDim(on){FAR.traverse(o=>{const m=o.material;if(!m||!m.color)return;if(m.userData.c0===undefined)m.userData.c0=m.color.getHex();m.color.setHex(m.userData.c0);if(on)m.color.multiplyScalar(.5)});\n"
    "  if(BLP){if(BLP._s0===undefined){BLP._s0=BLP.strength;BLP._t0=BLP.threshold}BLP.strength=on?BLP._s0*.35:BLP._s0;BLP.threshold=on?.97:BLP._t0}}")
rep("scene.environmentIntensity=FLV.env*.5;renderer.toneMappingExposure=FLV.ex*.9;","scene.environmentIntensity=FLV.env*.3;renderer.toneMappingExposure=FLV.ex*.72;spaceDim(true);")
rep("if(FLV.env!==undefined){scene.environmentIntensity=FLV.env;renderer.toneMappingExposure=FLV.ex}","if(FLV.env!==undefined){scene.environmentIntensity=FLV.env;renderer.toneMappingExposure=FLV.ex}spaceDim(false);")
rep("hemi.intensity+=(m.hi*LH-hemi.intensity)*a;","hemi.intensity+=(m.hi*LH*(FLY?.4:1)-hemi.intensity)*a;")
# enemy markers ignore the darker exposure, and enemy hull seams glow brighter
rep("BEACM||(BEACM=new T.SpriteMaterial({map:glowTex,color:0xff2a1a,depthWrite:false,transparent:true,fog:false}))","BEACM||(BEACM=new T.SpriteMaterial({map:glowTex,color:0xff2a1a,depthWrite:false,transparent:true,fog:false,toneMapped:false}))")
rep("emissive:0xff2a1e,emissiveMap:seam,emissiveIntensity:1.1,","emissive:0xff2a1e,emissiveMap:seam,emissiveIntensity:1.8,")
# the credit readout updates with the damage feedback tick (both on foot and in flight)
rep("function dmgTick(dt){","function dmgTick(dt){crTick();")
open(dst,'w').write(s);print('ok',len(s))
