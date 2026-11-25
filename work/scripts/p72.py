# v70: inventory (switch armour and guns) and damage feedback on the HUD
import sys,re
src,dst=sys.argv[1],sys.argv[2]
s=open(src).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]);s=s.replace(a,b)

# ---------- styles ----------
rep(".hurt{background:radial-gradient(ellipse at center,transparent 45%,var(--hurt) 130%)}",
    ".hurt{background:radial-gradient(ellipse at center,transparent 45%,var(--hurt) 130%)}\n"
    ".meter{position:relative}.meter i{position:relative;z-index:1}.meter b.gh{position:absolute;left:0;top:0;bottom:0;width:0;background:rgba(255,255,255,.6);z-index:0}\n"
    ".meter.hit i{background:#fff!important}.row,.frow{position:relative}\n"
    ".dmgn{position:absolute;right:-42px;top:-7px;font:700 12px 'Chakra Petch',sans-serif;pointer-events:none;text-shadow:0 0 4px #000;animation:dmgUp .9s ease-out forwards}\n"
    "@keyframes dmgUp{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-16px)}}\n"
    "#dmgi{position:absolute;left:50%;top:50%;width:0;height:0;pointer-events:none}#dmgi i{position:absolute;border-radius:50%;border:6px solid transparent;box-sizing:border-box;clip-path:polygon(50% 50%,27% -6%,73% -6%)}\n"
    ".shbrk{position:absolute;inset:0;pointer-events:none;opacity:0;background:radial-gradient(ellipse at center,transparent 38%,rgba(111,216,255,.6) 125%)}\n"
    ".inv{width:min(94%,620px);max-height:86%;overflow:auto;text-align:left}.inv h3{margin:0}.inv .sub{margin:0;font-size:11px;color:var(--dim)}\n"
    ".inv .tabs{display:flex;gap:8px}.inv .tabs button[aria-pressed=\"true\"]{border-color:var(--amber);color:var(--amber)}\n"
    ".inv .gk{margin:10px 0 4px;font-size:10px;letter-spacing:.16em;color:var(--dim)}.inv .cards{display:flex;flex-wrap:wrap;gap:6px}\n"
    ".inv .card{border:1px solid var(--line);border-left:4px solid var(--rc);background:rgba(0,0,0,.35);padding:6px 8px;min-width:0;flex:1 1 160px;font-size:11px;line-height:1.4;cursor:pointer}\n"
    ".inv .card:hover,.inv .card:focus-visible{border-color:var(--rc);outline:none}.inv .card.eq{background:rgba(255,178,56,.1);border-color:var(--amber);border-left-color:var(--rc);cursor:default}\n"
    ".inv .card b{display:block;color:var(--rc);font-size:12px}.inv .card .x{float:right;color:var(--dim);font-size:9px;letter-spacing:.1em;padding:1px 5px;border:1px solid var(--line);margin-left:6px}\n"
    ".inv .card .x:hover{color:var(--hurt);border-color:var(--hurt)}.inv .tot{margin:10px 0 0;font-size:11px;color:var(--dim)}")

# ---------- markup ----------
rep('<button id="cfg" type="button">Settings</button>','<button id="invBtn" type="button">Inventory</button>\n  <button id="cfg" type="button">Settings</button>')
rep('<div class="hurt" id="hurt"></div>','<div class="hurt" id="hurt"></div>\n  <div class="shbrk" id="shbrk"></div>\n  <div id="dmgi"></div>')
rep('<div class="panel" id="settings" hidden>',
    '<div class="panel inv" id="inv" hidden><h3>Inventory</h3><p class="sub">Click a gun or a piece of armour to use it. Swapping keeps your ammo.</p>'
    '<div class="tabs"><button type="button" id="invTG" aria-pressed="true">Guns</button><button type="button" id="invTA" aria-pressed="false">Armour</button></div>'
    '<div id="invBody"></div><p class="tot" id="invTot"></p><button type="button" id="invClose">Close · I</button></div>\n  <div class="panel" id="settings" hidden>')
rep('<button type="button" data-act="swap">Swap</button>','<button type="button" data-act="swap">Swap</button><button type="button" data-act="inv">Bag</button>')
rep("V slide while sprinting · I inspect your gun","V slide while sprinting · I inventory · H inspect your gun")

# ---------- armour and inventory ----------
INV=r'''function newGuns(){guns=WPN.map((_,k)=>mkGun(k))}newGuns();
// ---- armour and the inventory. Found guns are kept (up to 4 spares per gun, best first); armour sets change shield,
// damage taken, speed and shield recharge. The Deck Vest (index 4) is the starting armour and never drops.
const ARM=[{n:'Bulwark Plate',sh:30,red:.08,spd:-.04,rch:0,c:0x6f7c80},{n:'Strider Weave',sh:8,red:.02,spd:.06,rch:.12,c:0x3f6f8a},
  {n:'Grafter Shell',sh:15,red:.03,spd:0,rch:.25,c:0x4f7a52},{n:'Seedwarden Mantle',sh:15,red:.05,spd:.02,rch:.06,c:0x8a7448},
  {n:'Deck Vest',sh:0,red:0,spd:0,rch:0,c:0x7d8488}];
let INV={g:[[],[],[],[],[],[]],a:[]},ARMEQ={t:4,rar:0,pow:1},ARMS={sh:0,red:0,spd:0,rch:0},INVOPEN=false,invTab='g';
const gMult=(rar,pow)=>(1+(pow-1)*0.12)*RAR[rar].m,byG=(a,b)=>gMult(b.rar,b.pow)-gMult(a.rar,a.pow);
function armStats(a){const T=ARM[a.t],m=RAR[a.rar].m*(1+(a.pow-1)*.04);return{sh:Math.round(T.sh*m),red:Math.min(.35,T.red*m),spd:T.spd<0?T.spd:Math.min(.2,T.spd*m),rch:Math.min(.6,T.rch*m)}}
const armRate=a=>{const q=armStats(a);return q.sh+q.red*400+q.spd*250+q.rch*80},byA=(a,b)=>armRate(b)-armRate(a);
function armLine(a){const q=armStats(a),p=[];if(q.sh)p.push('+'+q.sh+' shield');if(q.red)p.push(Math.round(q.red*100)+'% less damage');if(q.spd)p.push((q.spd>0?'+':'')+Math.round(q.spd*100)+'% speed');if(q.rch)p.push(Math.round(q.rch*100)+'% faster recharge');return p.join(' · ')||'no bonuses'}
function applyArmour(){ARMS=armStats(ARMEQ);if(!FLY){const was=shMax;shMax=CLS[cls].sh+ARMS.sh;shield=Math.min(shMax,shield+Math.max(0,shMax-was))}try{if(VMS)VMS.color.setHex(ARM[ARMEQ.t].c).convertSRGBToLinear()}catch(e){}}
function invReset(){INV={g:[[],[],[],[],[],[]],a:[]};ARMEQ={t:4,rar:0,pow:1};applyArmour()}
function invAddGun(k,rar,pow){const W=WPN[k],nm=gMult(rar,pow),L=INV.g[k];
  if(nm>gunMult(k)){const o=guns[k],g=mkGun(k,rar,pow);if(W.mode==='mag')g.res=Math.max(g.res,o.res);L.push({rar:o.rar,pow:o.pow});guns[k]=g;if(weapon===k)reloadT=0;say(RAR[rar].n+' '+W.name+' · Power '+pow+' equipped · the old one is in your inventory (I)',2.8,RAR[rar].c)}
  else if(!(guns[k].rar===rar&&guns[k].pow===pow)&&!L.some(r=>r.rar===rar&&r.pow===pow)&&(L.length<4||gMult(L[L.length-1].rar,L[L.length-1].pow)<nm)){L.push({rar,pow});say(RAR[rar].n+' '+W.name+' · Power '+pow+' · in your inventory (I)',2.2,RAR[rar].c)}
  else{score+=100;say('Salvage +100',1)}
  if(W.mode==='mag'&&!W.inf){const G=guns[k];G.res=Math.min(W.res*1.5,G.res+W.mag)}L.sort(byG);if(L.length>4)L.length=4}
function invAddArm(a){const A=ARM[a.t],R=RAR[a.rar];
  if(armRate(a)>armRate(ARMEQ)){if(ARMEQ.t!==4)INV.a.push(ARMEQ);ARMEQ=a;applyArmour();say(R.n+' '+A.n+' equipped · '+armLine(a),3,R.c)}
  else if(!INV.a.some(r=>r.t===a.t&&r.rar===a.rar&&r.pow===a.pow)&&(INV.a.length<8||armRate(INV.a[INV.a.length-1])<armRate(a))){INV.a.push(a);say(R.n+' '+A.n+' · in your inventory (I)',2.2,R.c)}
  else{score+=150;say('Salvage +150',1)}
  INV.a.sort(byA);if(INV.a.length>8)INV.a.length=8}
function invEquipGun(k,i){const L=INV.g[k],r=L[i],o=guns[k],W=WPN[k];if(!r)return;L[i]={rar:o.rar,pow:o.pow};const g=mkGun(k,r.rar,r.pow);if(W.mode==='mag'){g.res=o.res;g.mag=Math.min(o.mag,W.mag)}guns[k]=g;if(weapon===k)reloadT=0;L.sort(byG);sfx('swap');invRender();writeSave()}
function invEquipArm(i){const a=INV.a[i];if(!a)return;if(ARMEQ.t!==4)INV.a[i]=ARMEQ;else INV.a.splice(i,1);ARMEQ=a;applyArmour();INV.a.sort(byA);sfx('swap');invRender();writeSave()}
function invScrap(kind,k,i){if(kind==='g'){if(!INV.g[k][i])return;INV.g[k].splice(i,1);score+=100}else{if(!INV.a[i])return;INV.a.splice(i,1);score+=150}sfx('pick');invRender();writeSave()}
function invRender(){$('invTG').setAttribute('aria-pressed',invTab==='g');$('invTA').setAttribute('aria-pressed',invTab==='a');let h='';
  const card=(rc,title,line,eq,act,scrap)=>'<div class="card'+(eq?' eq':'')+'" style="--rc:'+rc+'"'+(act?' data-a="'+act+'" role="button" tabindex="0"':'')+'>'+(scrap?'<span class="x" data-a="'+scrap+'" role="button" tabindex="0" aria-label="Scrap">SCRAP</span>':'')+'<b>'+title+'</b>'+line+(eq?' · IN USE':'')+'</div>';
  if(invTab==='g'){for(const k of ORDER){const W=WPN[k],G=guns[k];h+='<div class="gk">'+W.name.toUpperCase()+'</div><div class="cards">'+card(RAR[G.rar].c,RAR[G.rar].n+' · Power '+G.pow,'x'+gunMult(k).toFixed(2)+' damage',true);
      INV.g[k].forEach((r,i)=>{h+=card(RAR[r.rar].c,RAR[r.rar].n+' · Power '+r.pow,'x'+gMult(r.rar,r.pow).toFixed(2)+' damage',false,'eg:'+k+':'+i,'sg:'+k+':'+i)});h+='</div>'}}
  else{h+='<div class="gk">WORN</div><div class="cards">'+card(RAR[ARMEQ.rar].c,RAR[ARMEQ.rar].n+' '+ARM[ARMEQ.t].n,armLine(ARMEQ),true)+'</div><div class="gk">SPARE · '+INV.a.length+' / 8</div><div class="cards">';
    INV.a.forEach((a,i)=>{h+=card(RAR[a.rar].c,RAR[a.rar].n+' '+ARM[a.t].n,armLine(a),false,'ea:'+i,'sa:'+i)});if(!INV.a.length)h+='<p class="tot">Robots and bosses drop armour. Walk over it to pick it up.</p>';h+='</div>'}
  $('invBody').innerHTML=h;$('invTot').textContent='Shield '+Math.round(shMax)+' · damage taken '+Math.round((1-ARMS.red)*100)+'% · speed '+Math.round((1+ARMS.spd)*100)+'% · recharge +'+Math.round(ARMS.rch*100)+'%'}
function invOpen(){if(state!=='playing'||INTRO.on||cineT>0)return;if(FLY){say('The inventory opens on foot',1.5);return}INVOPEN=true;closeWheel(false);setState('paused');overlay.hidden=true;$('inv').hidden=false;if(document.pointerLockElement)document.exitPointerLock();invRender()}
function invClose(){if(!INVOPEN)return;INVOPEN=false;$('inv').hidden=true;resume()}
function invToggle(){INVOPEN?invClose():invOpen()}
function invParse(o){const R=x=>Math.max(0,Math.min(4,Math.floor(+x)||0)),P=x=>Math.max(1,Math.min(999,Math.floor(+x)||1)),inv={g:[[],[],[],[],[],[]],a:[]};let arm={t:4,rar:0,pow:1};
  try{const I=o&&o.inv;if(I&&Array.isArray(I.g))I.g.slice(0,6).forEach((l,k)=>{if(Array.isArray(l))inv.g[k]=l.slice(0,4).map(r=>({rar:R(r&&r.rar),pow:P(r&&r.pow)}))});
    if(I&&Array.isArray(I.a))inv.a=I.a.slice(0,8).map(r=>({t:Math.max(0,Math.min(3,Math.floor(+(r&&r.t))||0)),rar:R(r&&r.rar),pow:P(r&&r.pow)}));
    if(o&&o.arm){const t=Math.floor(+o.arm.t);arm={t:t>=0&&t<=4?t:4,rar:R(o.arm.rar),pow:P(o.arm.pow)}}}catch(e){}return{inv,arm}}
'''
rep("function newGuns(){guns=WPN.map((_,k)=>mkGun(k))}newGuns();",INV)
rep("boostT=0;gliding=false;airUsed=false;overT=0;newGuns();","boostT=0;gliding=false;airUsed=false;overT=0;newGuns();invReset();shield=shMax;")
# armour effects: less damage taken, speed, recharge
rep("if(veh)n*=0.5;","if(veh)n*=0.5;if(!FLY)n*=1-ARMS.red;const s0=shield,h0=hp;")
rep("shDelay=cls===2?2.2:3.5;","shDelay=(cls===2?2.2:3.5)*(FLY?1:1-ARMS.rch*.5);")
rep("shield=Math.min(shMax,shield+(cls===2?70:40)*dt);","shield=Math.min(shMax,shield+(cls===2?70:40)*(1+ARMS.rch)*dt);")
rep("const sp=(sprintT>0.35?9:6.2)*CLS[cls].spd*dt,","const sp=(sprintT>0.35?9:6.2)*CLS[cls].spd*(1+ARMS.spd)*dt,")
# drops: about 3 in 10 loot drops are armour (bosses about 2 in 3); pickups go through the inventory
rep("rar=r<0.03?4:r<0.12?3:r<0.35?2:r<0.65?1:0;",
    "rar=r<0.03?4:r<0.12?3:r<0.35?2:r<0.65?1:0;\n"
    "  if(Math.random()<(e.type===3?.65:.3)){const[x,y,z]=place(e,0.7),t=Math.random()*4|0,m=bas({color:RAR[rar].c}),g=new T.Group();g.add(mesh(GEO.box,m,.42,.46,.14),mesh(GEO.box,m,.64,.13,.17,0,.2,0),mesh(GEO.box,m,.16,.2,.15,-.2,-.24,0),mesh(GEO.box,m,.16,.2,.15,.2,-.24,0));\n"
    "    g.position.set(x,y+.7,z);g.add(glow(RAR[rar].c,7,.7));scene.add(g);loots.push({g,m,y:y+.7,arm:1,t,rar,pow:Math.max(wave,1)+rar,name:ARM[t].n});return}")
m=re.search(r"const nm=\(1\+\(L\.pow-1\)\*0\.12\)\*RAR\[L\.rar\]\.m,cur=gunMult\(L\.k\);.*?scene\.remove\(L\.g\);L\.g\.material\.dispose\(\);loots\.splice\(i,1\);sfx\('pick'\)\}",s,re.S)
assert m and s.count(m.group(0))==1
s=s.replace(m.group(0),"if(L.arm)invAddArm({t:L.t,rar:L.rar,pow:L.pow});else invAddGun(L.k,L.rar,L.pow);\n    scene.remove(L.g);if(L.m)L.m.dispose();else if(L.g.material)L.g.material.dispose();loots.splice(i,1);sfx('pick')}")
# save version 3 keeps the inventory and the armour (older saves load with an empty inventory)
rep("SAVE={v:2,t:Date.now(),wave,cls,score,done:wave>=CAMP.length,guns:guns.map(g=>({k:g.k,rar:g.rar,pow:g.pow}))};",
    "SAVE={v:3,t:Date.now(),wave,cls,score,done:wave>=CAMP.length,guns:guns.map(g=>({k:g.k,rar:g.rar,pow:g.pow})),inv:JSON.parse(JSON.stringify(INV)),arm:{t:ARMEQ.t,rar:ARMEQ.rar,pow:ARMEQ.pow}};")
rep("if(!o||(o.v!==1&&o.v!==2))return null;","if(!o||(o.v!==1&&o.v!==2&&o.v!==3))return null;")
rep("return{v:2,t:+o.t||0,done:!!o.done||w>=4,wave:w,cls:c,score:Math.max(0,Math.floor(+o.score)||0),guns:g}}catch(e){return null}}",
    "return{v:3,t:+o.t||0,done:!!o.done||w>=4,wave:w,cls:c,score:Math.max(0,Math.floor(+o.score)||0),guns:g,...invParse(o)}}catch(e){return null}}")
rep("guns=SAVE.guns.map(q=>mkGun(q.k,q.rar,q.pow));","guns=SAVE.guns.map(q=>mkGun(q.k,q.rar,q.pow));{const q=JSON.parse(JSON.stringify({i:SAVE.inv||{g:[[],[],[],[],[],[]],a:[]},a:SAVE.arm||{t:4,rar:0,pow:1}}));INV=q.i;ARMEQ=q.a;applyArmour();shield=shMax}")
# a stage jump hands out armour that fits the stage
rep("guns=WPN.map((_,k)=>mkGun(k,Math.min(4,s-1),s));","guns=WPN.map((_,k)=>mkGun(k,Math.min(4,s-1),s));ARMEQ={t:Math.random()*4|0,rar:Math.min(4,s-1),pow:s};applyArmour();shield=shMax;")
# controls: I (or the Inventory button, or Bag on touch) opens it; I or Escape closes; H now inspects the gun
rep("else if(c==='KeyI'){if(FP.insp<0&&reloadT<=0)FP.insp=0}","else if(c==='KeyI')invOpen();else if(c==='KeyH'){if(FP.insp<0&&reloadT<=0)FP.insp=0}")
rep("keys[e.code]=true;","keys[e.code]=true;if(INVOPEN&&(e.code==='KeyI'||e.code==='Escape')&&!e.repeat){invClose();e.preventDefault();return}")
rep("function resume(){","function resume(){if(INVOPEN){INVOPEN=false}$('inv').hidden=true;")
rep("else if(act==='reload')startReload();else surge();continue}","else if(act==='reload')startReload();else if(act==='inv')invToggle();else surge();continue}")
rep("$('setClose').addEventListener('click',()=>{$('settings').hidden=true});",
    "$('setClose').addEventListener('click',()=>{$('settings').hidden=true});\n"
    "$('invBtn').addEventListener('click',()=>invToggle());$('invClose').addEventListener('click',()=>invClose());\n"
    "$('invTG').addEventListener('click',()=>{invTab='g';invRender()});$('invTA').addEventListener('click',()=>{invTab='a';invRender()});\n"
    "$('invBody').addEventListener('click',e=>{const t=e.target.closest('[data-a]');if(!t)return;e.stopPropagation();const[a,x,y]=t.dataset.a.split(':');if(a==='eg')invEquipGun(+x,+y);else if(a==='sg')invScrap('g',+x,+y);else if(a==='ea')invEquipArm(+x);else if(a==='sa')invScrap('a',0,+x)});\n"
    "$('invBody').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.dataset&&e.target.dataset.a){e.preventDefault();e.target.click()}});")

# ---------- damage feedback ----------
DMG=r'''// ---- damage feedback: an arc around the crosshair pointing at whoever hit you (blue while the shield holds, red on the hull),
// a white flash on the bar with a ghost of the chunk lost, the number, a shield-break flash, and a heartbeat when the hull is low
const DMGI=[],HB={t:0,p:0},dmgQ=new T.Quaternion(),dmgV=new T.Vector3(),HSRC=new T.Vector3();
function dmgAng(p){dmgV.set(p.x-cam.position.x,p.y-cam.position.y,p.z-cam.position.z).applyQuaternion(dmgQ.copy(cam.quaternion).invert());return Math.atan2(dmgV.x,-dmgV.z)}
function dmgBar(m,a,b){if(!m)return;let g=m.querySelector('b.gh');if(!g){g=document.createElement('b');g.className='gh';m.appendChild(g)}
  g.style.transition='none';g.style.width=Math.max(0,Math.min(100,a*100))+'%';m.classList.add('hit');clearTimeout(m._ht);m._ht=setTimeout(()=>m.classList.remove('hit'),140);
  clearTimeout(m._gt);m._gt=setTimeout(()=>{g.style.transition='width .5s ease-in';g.style.width=Math.max(0,b*100)+'%'},380)}
function dmgNum(m,t,c){if(!m)return;const sp=document.createElement('span');sp.className='dmgn';sp.textContent=t;sp.style.color=c;m.parentElement.appendChild(sp);setTimeout(()=>sp.remove(),950)}
function dmgFx(n,src,s0,h0){if(!(n>0))return;const col=s0>0&&shield>0?'#6fd8ff':'#ff4a36';
  if(src&&isFinite(src.x)){const ang=dmgAng(src);let it=null;for(const q of DMGI)if(Math.abs(Math.atan2(Math.sin(q.a-ang),Math.cos(q.a-ang)))<.3){it=q;break}
    if(!it){if(DMGI.length>=6){const o=DMGI.shift();o.el.remove()}const el=document.createElement('i');$('dmgi').appendChild(el);it={el};DMGI.push(it)}
    it.x=src.x;it.y=src.y;it.z=src.z;it.t=1.3;it.a=ang;it.col=col;it.w=n>=20?10:6}
  const F=!!FLY,mS=$(F?'fsh':'sh'),mH=$(F?'fhp':'hp'),ms=shMax||1;if(s0>0)dmgBar(mS,s0/ms,Math.max(0,shield)/ms);if(hp<h0)dmgBar(mH,h0/100,Math.max(0,hp)/100);
  dmgNum(hp<h0?mH:mS,'-'+Math.max(1,Math.round(n)),hp<h0?'#ff6a55':'#8fe6ff');
  if(s0>0&&shield<=0){const b=$('shbrk');b.style.transition='none';b.style.opacity=1;void b.offsetWidth;b.style.transition='opacity .7s ease-out';b.style.opacity=0;sfx('shbreak')}}
function dmgTick(dt){const R=Math.min(150,Math.min(cv.clientWidth,cv.clientHeight)*.24);
  for(let i=DMGI.length-1;i>=0;i--){const q=DMGI[i];q.t-=dt;if(q.t<=0||state==='menu'){q.el.remove();DMGI.splice(i,1);continue}const a=dmgAng(q),k=Math.min(1,q.t/.9),pop=1+Math.max(0,q.t-1.1)*1.2;
    q.el.style.cssText='width:'+2*R+'px;height:'+2*R+'px;left:'+(-R)+'px;top:'+(-R)+'px;border-width:'+q.w+'px;border-top-color:'+q.col+';opacity:'+k.toFixed(2)+';transform:rotate('+a.toFixed(3)+'rad) scale('+pop.toFixed(3)+')'}
  const low=state==='playing'&&hp<30&&hp>0;let pulse=0;if(low){HB.t-=dt;if(HB.t<=0){HB.t=hp<15?.62:.9;HB.p=1;sfx('heart')}HB.p=Math.max(0,HB.p-dt*2.2);pulse=.16+.22*HB.p}else HB.t=0;
  $('hurt').style.opacity=Math.max(hurtA,pulse)}
function hurt(n,src){'''
rep("function hurt(n){",DMG)
rep("hurtA=1;shake=reduced?0:0.2;sfx('hurt');if(hp<=0){hp=0;die()}}","hurtA=1;shake=reduced?0:0.2;sfx('hurt');dmgFx(n,src,s0,h0);if(hp<=0){hp=0;die()}}")
rep("$('hurt').style.opacity=Math.max(hurtA,hp<30&&state==='playing'?0.25:0);","")
rep("animate(dt);if(state!=='menu'){if(FLY)flyHud();else{radar();hud()}}","animate(dt);if(state!=='menu'){if(FLY)flyHud();else{radar();hud()}}dmgTick(dt);")
# every hit now says where it came from
for a,b in [("if(hitP){hurt(s2.dmg||12);","if(hitP){hurt(s2.dmg||12,HSRC.copy(p).addScaledVector(s2.v,-.4));"),
            ("if(e.cd<=0){e.cd=big?1.2:1;hurt(big?16:6)}","if(e.cd<=0){e.cd=big?1.2:1;hurt(big?16:6,e.pos)}"),
            ("los(p,eye))hurt(20)}","los(p,eye))hurt(20,p)}"),
            ("{hurt(q.dmg||35);","{hurt(q.dmg||35,q);"),
            ("S.emsl.splice(i,1);hurt(30);","S.emsl.splice(i,1);hurt(30,m.p);"),
            ("else if(segDist(q.prev,q.p,S.pos)<3.6){hurt(q.dmg);","else if(segDist(q.prev,q.p,S.pos)<3.6){hurt(q.dmg,HSRC.copy(q.p).addScaledVector(q.v,-.3));"),
            ("hurt(e.kind==='gun'?30:24);","hurt(e.kind==='gun'?30:24,e.p);"),
            ("S.en.splice(S.en.indexOf(e),1);hurt(18);","S.en.splice(S.en.indexOf(e),1);hurt(18,e.p);"),
            ("e.bt=1.6;e.kick=1.5;hurt(18);","e.bt=1.6;e.kick=1.5;hurt(18,p);"),
            ("e.cd=.8;e.kick=1;hurt(9);","e.cd=.8;e.kick=1;hurt(9,p);"),
            ("if(los(hv,eye))hurt(P.dmg)","if(los(hv,eye))hurt(P.dmg,p)")]:
    rep(a,b)
rep("else if(k==='jet')tone('sawtooth',90,160,.4,.04);",
    "else if(k==='jet')tone('sawtooth',90,160,.4,.04);\n"
    "  else if(k==='heart'){tone('sine',70,45,.11,.22);tone('sine',62,40,.1,.16,.17)}\n"
    "  else if(k==='shbreak'){gun({vol:.32,len:.45,lp:5200,f0:900,f1:200,hp:2500,crack:.03,th:.3});tone('triangle',1800,300,.35,.05)}")
open(dst,'w').write(s);print('ok',len(s))
