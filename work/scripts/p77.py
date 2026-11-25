# v73: the gear screen. Slots hold any gun type (grenade and melee follow the gun), two new guns, attachments
# (sight, barrel, magazine) with aim-down-sights and scopes, four-piece armour, a 3D character preview, save v4.
import sys,re
src,dst=sys.argv[1],sys.argv[2]
s=open(src).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:90]);s=s.replace(a,b)

# ---------- two new guns ----------
rep("gren:{n:'WELL',cd:9,kind:'well'},mel:{n:'CHARGE',cd:5,kind:'charge'}}];",
    "gren:{n:'WELL',cd:9,kind:'well'},mel:{n:'CHARGE',cd:5,kind:'charge'}},\n"
    "  {name:'Thresher Scattergun',short:'SCATTER',slot:1,el:2,mode:'mag',mag:6,res:36,reload:2.2,cd:.75,dmg:.95,pel:9,spread:.075,col:0xffa060,snd:'shotgun',rec:2.6,mz:-.86,\n"
    "    gren:{n:'BLAST',cd:7,kind:'cluster'},mel:{n:'SLAM',cd:4.5,kind:'stomp'}},\n"
    "  {name:'Heron Longshot',short:'LONGSHOT',slot:0,el:0,mode:'mag',mag:4,res:24,reload:2.4,cd:.9,dmg:7.5,spread:.0015,col:0x8fe6ff,snd:'snipe',rec:3,mz:-1.18,sight:3,\n"
    "    gren:{n:'STUN',cd:7,kind:'stun'},mel:{n:'DASH',cd:4,kind:'dash'}}];\n"
    "// attachments. Sights zoom while aiming (right mouse button); barrels and magazines trade stats\n"
    "const MODS={s:[{n:'Iron sights',z:1},{n:'Holo sight',z:1.35,sp:.85},{n:'Scope 2.5x',z:2.5,sp:.6},{n:'Long scope 4x',z:4,sp:.45}],\n"
    "  b:[{n:'Standard barrel',len:0},{n:'Long barrel',dmg:1.08,sp:.8,rec:1.1,len:.16},{n:'Compensator',rec:.55,sp:.9,len:.08},{n:'Suppressor',dmg:.95,rec:.8,len:.22,quiet:1}],\n"
    "  m:[{n:'Standard magazine'},{n:'Extended magazine',mag:1.4,reload:1.15,heat:.8},{n:'Quickdraw magazine',mag:.8,reload:.7,heat:1.2}]};\n"
    "const defMods=k=>({s:WPN[k].sight||0,b:0,m:0});\n"
    "// the stats a gun really has with its attachments (cached until they change)\n"
    "function gW(G){const md=G.mods||(G.mods=defMods(G.k)),key=md.s+'.'+md.b+'.'+md.m;if(G._w&&G._wk===key)return G._w;const W=Object.assign({},WPN[G.k]),S=MODS.s[md.s],B=MODS.b[md.b],M=MODS.m[md.m];\n"
    "  if(W.spread)W.spread*=(S.sp||1)*(B.sp||1);W.dmg*=B.dmg||1;W.rec*=B.rec||1;W.mz-=B.len||0;W.zoom=S.z;W.quiet=!!B.quiet;\n"
    "  if(W.mode==='mag'){W.mag=Math.max(1,Math.round(W.mag*(M.mag||1)));W.reload*=M.reload||1}else W.heat*=M.heat||1;G._w=W;G._wk=key;return W}")
rep("function mkGun(k,rar=0,pow=1){const W=WPN[k];return{k,name:W.name,rar,pow,mag:W.mode==='mag'?W.mag:0,res:W.res||0}}",
    "function mkGun(k,rar=0,pow=1,mods){const W=WPN[k],G={k,name:W.name,rar,pow,mods:mods?{s:mods.s|0,b:mods.b|0,m:mods.m|0}:defMods(k),mag:0,res:W.res||0};G.mag=W.mode==='mag'?gW(G).mag:0;return G}")

# ---------- first-person models for the new guns ----------
rep("const VMG=[arcG,lanG,arG,piG,glG,caG]",
"""// Thresher Scattergun: pump shotgun with a tube magazine under the barrel
const shG=new T.Group();vm.add(shG);shG.add(VK(a=>{const L=MAT.gunL,D=MAT.gunD,O=MAT.gunO;a(GEO.box,L,.15,.16,.5,0,0,.05);a(GEO.box,O,.152,.03,.3,0,.06,.06);a(GEO.cyl,D,.036,.72,.036,0,.03,-.48,1.571,0,0);
  a(GEO.cyl,D,.03,.56,.03,0,-.05,-.4,1.571,0,0);a(GEO.box,O,.12,.085,.22,0,-.06,-.38);for(let i=0;i<5;i++)a(GEO.box,D,.125,.012,.012,0,-.06,-.3-i*.035);a(GEO.box,D,.1,.15,.3,0,-.05,.42);
  a(GEO.box,D,.08,.19,.1,0,-.2,.2,-.3,0,0);a(GEO.box,D,.06,.03,.3,0,.1,-.02);armsKit(a,-.36)}));
// Heron Longshot: long rifle with a muzzle brake and a box magazine
const snG=new T.Group();vm.add(snG);snG.add(VK(a=>{const L=MAT.gunL,D=MAT.gunD,O=MAT.gunO;a(GEO.box,L,.14,.15,.5,0,0,.08);a(GEO.box,O,.142,.03,.36,0,.05,.06);a(GEO.cyl,D,.026,1.0,.026,0,.02,-.65,1.571,0,0);
  a(GEO.box,D,.07,.06,.11,0,.02,-1.13);for(const sx of[-1,1])a(GEO.box,D,.075,.012,.03,0,.02+sx*.02,-1.13);a(GEO.box,L,.1,.16,.34,0,-.04,.46);a(GEO.box,D,.11,.05,.18,0,.08,.42);
  a(GEO.box,D,.08,.13,.12,0,-.14,.05);a(GEO.box,D,.08,.19,.1,0,-.2,.24,-.3,0,0);a(GEO.box,D,.05,.03,.4,0,.09,-.05);armsKit(a,-.3)}));
const VMG=[arcG,lanG,arG,piG,glG,caG,shG,snG]""")
# attachment meshes, rebuilt on the gun's own group whenever its attachments change
ATT=r'''// where attachments sit on each gun (gun-local): sight top [y,z], magazine [y,z]
const ATT=[[.13,-.05,0],[.13,-.1,0],[.21,-.03,1],[.11,0,1],[.17,-.05,1],[.17,0,1],[.12,-.04,1],[.11,-.08,1]],ATTG=[],AMAT={d:null,o:null,lens:null,dot:null};
function attBuild(k,md){const g0=ATTG[k];if(g0){VMG[k].remove(g0);g0.traverse(o=>{if(o.geometry&&o.geometry!==GEO.cyl&&o.geometry!==GEO.box)o.geometry.dispose()})}
  if(!AMAT.d){AMAT.d=MAT.gunD;AMAT.o=MAT.gunO;AMAT.lens=bas({color:0x6fd8ff,transparent:true,opacity:.35,depthWrite:false});AMAT.dot=bas({color:0xff3a2a})}
  const g=new T.Group(),[ty,tz,hasMag]=ATT[k],W=WPN[k],C=(r,l,x,y,z,m)=>{const o=mesh(GEO.cyl,m||AMAT.d,r,l,r,x,y,z);o.rotation.x=Math.PI/2;g.add(o);return o},Bx=(w,h,d,x,y,z,m)=>g.add(mesh(GEO.box,m||AMAT.d,w,h,d,x,y,z));
  if(md.s===1){for(const sx of[-1,1])Bx(.01,.06,.03,sx*.032,ty+.03,tz);Bx(.075,.01,.03,0,ty+.065,tz);Bx(.075,.02,.06,0,ty+.005,tz);Bx(.06,.05,.004,0,ty+.035,tz,AMAT.lens);Bx(.006,.006,.004,0,ty+.035,tz-.002,AMAT.dot)}
  else if(md.s>=2){const r=md.s===2?.026:.032,l=md.s===2?.22:.32;C(r,l,0,ty+.055,tz);C(r*1.35,.06,0,ty+.055,tz-l/2-.02);C(r*1.1,.04,0,ty+.055,tz+l/2);for(const o of[-.06,.06])Bx(.03,.05,.02,0,ty+.025,tz+o);
    const L1=mesh(GEO.cyl,AMAT.lens,r*1.3,.004,r*1.3,0,ty+.055,tz-l/2-.052);L1.rotation.x=Math.PI/2;g.add(L1)}
  const B=MODS.b[md.b],mz=W.mz;if(md.b===1)C(.022,B.len,0,.0,mz-B.len/2);else if(md.b===2)Bx(.055,.055,B.len,0,0,mz-B.len/2,AMAT.o);else if(md.b===3)C(.04,B.len,0,0,mz-B.len/2);
  if(hasMag&&md.m===1)Bx(.07,.09,.09,0,-.27,.04,AMAT.o);
  if(k===2)g.position.y=0;ATTG[k]=g;VMG[k].add(g)}
const attKey=[];function attSync(){for(let k=0;k<VMG.length;k++){const G=guns.find(q=>q.k===k)||{mods:defMods(k)},md=G.mods||defMods(k),key=md.s+'.'+md.b+'.'+md.m;if(attKey[k]!==key){attKey[k]=key;attBuild(k,md)}}}
'''
rep("// Harrow Cannon: six-barrel rotary cannon with a carry handle and side ammo box","// Harrow Cannon: six-barrel rotary cannon with a carry handle and side ammo box")
rep("const caSpin=J(caG,0,0,-.2);","const caSpin=J(caG,0,0,-.2);")
# put ATT after VMG is defined
rep("MAGP={2:arMag,3:piMag,4:glDrum,5:caBox},MAGY={2:-.17,3:-.27,4:-.02,5:-.06};","MAGP={2:arMag,3:piMag,4:glDrum,5:caBox},MAGY={2:-.17,3:-.27,4:-.02,5:-.06};\n"+ATT)

# ---------- slots hold any gun type: grenade, melee, wheel and stats read the gun in the slot ----------
rep("const W=WPN[wk],K=W.gren.kind;","const W=WPN[guns[wk].k],K=W.gren.kind;")
rep("const W=WPN[wk],M=W.mel;","const W=WPN[guns[wk].k],M=W.mel;")
rep("function syncWheel(){ORDER.forEach((k,i)=>{const G=guns[k],W=WPN[k],","function syncWheel(){ORDER.forEach((k,i)=>{const G=guns[k],W=gW(G),")
rep("const G=guns[weapon],W=WPN[G.k],od=overT>0;","const G=guns[weapon],W=gW(G),od=overT>0;")
rep("function startReload(){if(FLY)return;if(veh)return;const G=guns[weapon],W=WPN[G.k];","function startReload(){if(FLY)return;if(veh)return;const G=guns[weapon],W=gW(G);")
rep("function finishReload(){const G=guns[weapon],W=WPN[G.k];","function finishReload(){const G=guns[weapon],W=gW(G);")
rep("W=WPN[G.k],hb=$('heat'),isH=W.mode==='he","W=gW(G),hb=$('heat'),isH=W.mode==='he")
rep("const K=guns[weapon].k,Wc=WPN[K],","const K=guns[weapon].k,Wc=gW(guns[weapon]),")
# shotgun pellets: the hitscan runs once per pellet; aiming tightens the spread; a suppressor is quiet
rep("sfx(W.snd);sinceFire=0;","if(W.quiet)tone('sawtooth',260,110,.07,.05);else sfx(W.snd);sinceFire=0;")
rep("  if(W.spread){tmp.x+=(Math.random()-.5)*W.spread*2;","  const D0=tmp.clone(),PEL=W.pel||1,SPR=(W.spread||0)*(1-.6*FP.ads);for(let pi=0;pi<PEL;pi++){if(pi)tmp.copy(D0);\n  if(SPR){tmp.x+=(Math.random()-.5)*SPR*2;tmp.y+=(Math.random()-.5)*SPR*2;tmp.z+=(Math.random()-.5)*SPR*2;tmp.normalize()}\n  if(false){tmp.x+=(Math.random()-.5)*W.spread*2;")
rep("  if(W.pierce)for(const e of all)damage(e,dm,W.el,e.c,true);else if(hit)damage(hit,dm,W.el,hit.c,true);\n  if(W.mode==='mag'&&G.mag<=0)startReload();\n}",
    "  if(W.pierce)for(const e of all)damage(e,dm,W.el,e.c,true);else if(hit)damage(hit,dm,W.el,hit.c,true);}\n  if(W.mode==='mag'&&G.mag<=0)startReload();\n}")
# six slots always (not one per gun type)
rep("newGuns(){guns=WPN.map((_,k)=>mkGun(k))}","newGuns(){guns=[0,1,2,3,4,5].map(k=>mkGun(k))}")
rep("guns=WPN.map((_,k)=>mkGun(k,Math.min(4,s-1),s));ARMEQ={t:Math.random()*4|0,rar:Math.min(4,s-1),pow:s};applyArmour();shield=shMax;",
    "guns=[0,1,2,3,4,5].map(k=>mkGun(k,Math.min(4,s-1),s));{const t=Math.random()*4|0;ARMP=[0,1,2,3].map(p=>({t,rar:Math.min(4,s-1),pow:s,p}))}applyArmour();shield=shMax;")
# loot can be any of the eight guns
rep("const[x,y,z]=place(e,0.7),lk=Math.random()*6|0,","const[x,y,z]=place(e,0.7),lk=Math.random()*WPN.length|0,")
rep("if(Math.random()<(e.type===3?.65:.3)){const[x,y,z]=place(e,0.7),t=Math.random()*4|0,","if(Math.random()<(e.type===3?.65:.3)){const[x,y,z]=place(e,0.7),t=Math.random()*4|0,p=Math.random()*4|0,")
rep("loots.push({g,m,y:y+.7,arm:1,t,rar,pow:Math.max(wave,1)+rar,name:ARM[t].n});return}","loots.push({g,m,y:y+.7,arm:1,t,p,rar,pow:Math.max(wave,1)+rar,name:ARM[t].n});return}")
rep("if(L.arm)invAddArm({t:L.t,rar:L.rar,pow:L.pow});","if(L.arm)invAddArm({t:L.t,rar:L.rar,pow:L.pow,p:L.p|0});")

# ---------- aim down sights (right mouse) ----------
rep("addEventListener('mousedown',e=>{if(state!=='playing'||e.target.closest('button'))return;if(!locked)lock();if(e.button===2)grenade();else firing=true});",
    "addEventListener('mousedown',e=>{if(state!=='playing'||e.target.closest('button'))return;if(!locked)lock();if(e.button===2)ADS=true;else firing=true});")
rep("addEventListener('mouseup',()=>{if(fireId===null)firing=false});","addEventListener('mouseup',e=>{if(e.button===2){ADS=false;return}if(fireId===null)firing=false});")
rep("const look=(dx,dy,s)=>{s*=CFG.sens;","const look=(dx,dy,s)=>{s*=CFG.sens/(1+(adsZ()-1)*FP.ads);")
rep("if(FP.insp>=0){FP.insp+=dt;",
    "FP.ads+=((ADS&&!veh&&reloadT<=0&&state==='playing'?1:0)-FP.ads)*Math.min(1,dt*11);{const f0=CFG.fov+(portrait?14:0),f=f0/(1+(adsZ()-1)*FP.ads);if(Math.abs(cam.fov-f)>.01){cam.fov=f;cam.updateProjectionMatrix()}}\n"
    "  {const sc=adsZ()>=2.5&&FP.ads>.85;const d=$('scopeL');if(d&&d.hidden===sc)d.hidden=!sc;$('cross').style.visibility=FP.ads>.5?'hidden':''}\n"
    "  if(FP.insp>=0){FP.insp+=dt;")
rep("function fpVM(){","let ADS=false;const adsZ=()=>{const G=guns[weapon];return G?gW(G).zoom||1:1};\nfunction fpVM(){const ad=FP.ads;vm.position.x-=.075*ad;vm.position.y+=.025*ad;vm.position.z+=.03*ad;if(adsZ()>=2.5&&ad>.85)vm.visible=false;")
rep("function flyStart(st){fcReset();","function flyStart(st){fcReset();ADS=false;FP.ads=0;cam.fov=CFG.fov+(portrait?14:0);cam.updateProjectionMatrix();")
rep('<div class="shbrk" id="shbrk"></div>','<div class="shbrk" id="shbrk"></div>\n  <div class="scope" id="scopeL" hidden><i></i><b></b></div>')

# ---------- the inventory model: stored guns of any type, four armour pieces ----------
m=re.search(r"// ---- armour and the inventory\..*?return\{inv,arm\}\}\n",s,re.S);assert m and s.count(m.group(0))==1
INV=r'''// ---- armour and the inventory. Six gun slots each hold any gun; found guns are stored (up to 16); armour comes in four
// pieces (helmet, arms, chest, legs), each a quarter of its family's full-set stats. The Deck family (index 4) is the starting
// gear and never drops.
const ARM=[{n:'Bulwark',sh:30,red:.08,spd:-.04,rch:0,c:0x6f7c80},{n:'Strider',sh:8,red:.02,spd:.06,rch:.12,c:0x3f6f8a},
  {n:'Grafter',sh:15,red:.03,spd:0,rch:.25,c:0x4f7a52},{n:'Seedwarden',sh:15,red:.05,spd:.02,rch:.06,c:0x8a7448},{n:'Deck',sh:0,red:0,spd:0,rch:0,c:0x9aa3a6}],
  PIECE=['Helm','Gauntlets','Plate','Greaves'],PSLOT=['HELMET','ARMS','CHEST','LEGS'];
let INV={g:[],a:[]},ARMP=[0,1,2,3].map(p=>({t:4,rar:0,pow:1,p})),ARMS={sh:0,red:0,spd:0,rch:0},INVOPEN=false,GSEL={kind:'w',i:0};
const gMult=(rar,pow)=>(1+(pow-1)*0.12)*RAR[rar].m,byG=(a,b)=>gMult(b.rar,b.pow)-gMult(a.rar,a.pow);
function armStats(a){const T=ARM[a.t],m=RAR[a.rar].m*(1+(a.pow-1)*.04)/4;return{sh:T.sh*m,red:T.red*m,spd:T.spd<0?T.spd/4:T.spd*m,rch:T.rch*m}}
const armRate=a=>{const q=armStats(a);return q.sh+q.red*400+q.spd*250+q.rch*80},byA=(a,b)=>a.p-b.p||armRate(b)-armRate(a),pName=a=>ARM[a.t].n+' '+PIECE[a.p];
function armLine(a){const q=armStats(a),p=[];if(q.sh)p.push('+'+Math.round(q.sh)+' shield');if(q.red)p.push((q.red*100).toFixed(1)+'% less damage');if(q.spd)p.push((q.spd>0?'+':'')+(q.spd*100).toFixed(1)+'% speed');if(q.rch)p.push(Math.round(q.rch*100)+'% faster recharge');return p.join(' · ')||'no bonuses'}
function applyArmour(){const t={sh:0,red:0,spd:0,rch:0};for(const a of ARMP){const q=armStats(a);t.sh+=q.sh;t.red+=q.red;t.spd+=q.spd;t.rch+=q.rch}t.sh=Math.round(t.sh);t.red=Math.min(.35,t.red);t.spd=Math.max(-.1,Math.min(.2,t.spd));t.rch=Math.min(.6,t.rch);ARMS=t;
  if(!FLY){const was=shMax;shMax=CLS[cls].sh+ARMS.sh;shield=Math.min(shMax,shield+Math.max(0,shMax-was))}try{if(VMS)VMS.color.setHex(ARM[ARMP[1].t].c).convertSRGBToLinear()}catch(e){}if(typeof gearDress==='function')gearDress()}
function invReset(){INV={g:[],a:[]};ARMP=[0,1,2,3].map(p=>({t:4,rar:0,pow:1,p}));applyArmour();try{attSync()}catch(e){}}
function storeGun(r){if(INV.g.some(q=>q.k===r.k&&q.rar===r.rar&&q.pow===r.pow))return false;INV.g.push({k:r.k,rar:r.rar,pow:r.pow,mods:r.mods?{...r.mods}:defMods(r.k)});INV.g.sort((a,b)=>a.k-b.k||byG(a,b));if(INV.g.length>16){INV.g.sort(byG);INV.g.length=16;INV.g.sort((a,b)=>a.k-b.k||byG(a,b))}return true}
function invAddGun(k,rar,pow){const W=WPN[k],si=guns.findIndex(G=>G.k===k),R=RAR[rar];
  if(si>=0&&gMult(rar,pow)>gunMult(si)){const o=guns[si],g=mkGun(k,rar,pow,o.mods);if(W.mode==='mag')g.res=Math.max(g.res,o.res);storeGun(o);guns[si]=g;if(weapon===si)reloadT=0;say(R.n+' '+W.name+' · Power '+pow+' equipped · the old one is in your loadout (I)',2.8,R.c)}
  else if(!(si>=0&&guns[si].rar===rar&&guns[si].pow===pow)&&storeGun({k,rar,pow})){say((si<0?'New gun: ':'')+R.n+' '+W.name+' · Power '+pow+(si<0?' · put it in a slot from the loadout (I)':' · stored (I)'),2.8,R.c)}
  else{score+=100;cr(15);say('Salvage +15 CR',1)}
  if(W.mode==='mag'&&!W.inf&&si>=0){const G=guns[si];G.res=Math.min(W.res*1.5,G.res+W.mag)}}
function invAddArm(a){const R=RAR[a.rar],cur=ARMP[a.p];
  if(armRate(a)>armRate(cur)){if(cur.t!==4)INV.a.push(cur);ARMP[a.p]=a;applyArmour();say(R.n+' '+pName(a)+' equipped · '+armLine(a),3,R.c)}
  else if(!INV.a.some(r=>r.t===a.t&&r.p===a.p&&r.rar===a.rar&&r.pow===a.pow)&&INV.a.length<16){INV.a.push(a);say(R.n+' '+pName(a)+' · stored (I)',2.2,R.c)}
  else{score+=150;cr(25);say('Salvage +25 CR',1)}INV.a.sort(byA)}
function gearEquipGun(slot,i){const r=INV.g[i];if(!r)return;const o=guns[slot];INV.g.splice(i,1);storeGun(o);const g=mkGun(r.k,r.rar,r.pow,r.mods);guns[slot]=g;if(weapon===slot){reloadT=0;swapT=time}attSync();sfx('swap');gearRender();writeSave()}
function gearEquipArm(i){const a=INV.a[i];if(!a)return;const cur=ARMP[a.p];INV.a.splice(i,1);if(cur.t!==4)INV.a.push(cur);ARMP[a.p]=a;INV.a.sort(byA);applyArmour();sfx('swap');gearRender();writeSave()}
function gearScrap(kind,i){if(kind==='g'){if(!INV.g[i])return;INV.g.splice(i,1);score+=100;cr(15)}else{if(!INV.a[i])return;INV.a.splice(i,1);score+=150;cr(25)}sfx('pick');gearRender();writeSave()}
function gearMod(slot,kind,v){const G=guns[slot];G.mods=Object.assign({},G.mods||defMods(G.k),{[kind]:v});G._w=null;const W=gW(G);if(W.mode==='mag')G.mag=Math.min(G.mag,W.mag);sfx('swap');attSync();gearRender();writeSave()}
// ---- the loadout screen: weapons on the left, the character in the middle, armour on the right, details below
const GR={r:null,scene:null,cam:null,g:null,rig:null,mats:null,yaw:.4,drag:null,t:0,E:{mv:0,ph:1.3,vy:0,kick:0,crouch:0,jet:0,burst:0,cd:1,ch:0,ft:0}};
function gearInit(){if(GR.r)return;const c=$('gCv');try{GR.r=new T.WebGLRenderer({canvas:c,antialias:true,alpha:true})}catch(e){GR.r=null;return}GR.r.outputColorSpace=T.SRGBColorSpace;GR.r.toneMapping=T.ACESFilmicToneMapping;GR.r.toneMappingExposure=1.05;
  const S=GR.scene=new T.Scene();S.add(new T.HemisphereLight(0xdfeaf0,0x30383c,1.2*LH));const k=new T.DirectionalLight(0xffe2c0,2.2*LI);k.position.set(2,4,3);S.add(k);const rim=new T.DirectionalLight(0x8fd8ff,1.6*LI);rim.position.set(-3,2,-3);S.add(rim);
  const fl=mesh(new T.CylinderGeometry(1.1,1.2,.06,48),std({color:0x1c2428,roughness:.6,metalness:.4}),1,1,1,0,-.03,0);S.add(fl);const ring=mesh(new T.TorusGeometry(1.12,.012,6,64),bas({color:0xffb238}),1,1,1,0,.005,0);ring.rotation.x=Math.PI/2;S.add(ring);
  GR.cam=new T.PerspectiveCamera(30,1,.1,30);GR.cam.position.set(0,1.25,4.6);GR.cam.lookAt(0,1.0,0);
  const g=GR.g=new T.Group();S.add(g);GR.rig=walkerRig(g,7);g.position.y=1.0;
  // own copies of the plate material per body part, so armour colours do not touch the enemies
  GR.mats={};const segs=GR.rig.segs,PL=charMats().plate[7],part=(o,key)=>o.traverse(q=>{if(q.isMesh&&q.material===PL){q.material=GR.mats[key]||(GR.mats[key]=q.material.clone())}});
  part(segs.head,'h');segs.arms.forEach(a=>{part(a[0],'a')});part(segs.tor,'c');part(segs.pel,'l');segs.legs.forEach(l=>part(l[0],'l'));gearDress();
  c.addEventListener('pointerdown',e=>{GR.drag=e.clientX;c.setPointerCapture(e.pointerId)});c.addEventListener('pointermove',e=>{if(GR.drag!==null){GR.yaw+=(e.clientX-GR.drag)*.012;GR.drag=e.clientX}});c.addEventListener('pointerup',()=>{GR.drag=null})}
function gearDress(){if(!GR.mats)return;const set=(key,a)=>{const m=GR.mats[key];if(!m)return;m.color.setHex(ARM[a.t].c).convertSRGBToLinear();m.emissive=m.emissive||new T.Color();m.emissive.setHex(a.rar>=2?new T.Color(RAR[a.rar].c).getHex():0);m.emissiveIntensity=a.rar>=2?.08+.04*a.rar:0};
  set('h',ARMP[0]);set('a',ARMP[1]);set('c',ARMP[2]);set('l',ARMP[3])}
function gearTick(dt){if(!INVOPEN||!GR.r)return;const c=$('gCv'),w=c.clientWidth|0,h=c.clientHeight|0;if(w<2||h<2)return;if(c.width!==w*Math.min(2,devicePixelRatio)|0){GR.r.setPixelRatio(Math.min(2,devicePixelRatio));GR.r.setSize(w,h,false);GR.cam.aspect=w/h;GR.cam.updateProjectionMatrix()}
  GR.t+=dt;if(GR.drag===null&&!reduced)GR.yaw+=dt*.25;GR.g.rotation.y=GR.yaw;try{GR.rig.anim(GR.E,GR.t,dt)}catch(e){}GR.r.render(GR.scene,GR.cam)}
const bar=(lab,v,max,txt)=>'<div class="gsb"><span>'+lab+'</span><i><b style="width:'+Math.max(2,Math.min(100,v/max*100))+'%"></b></i><em>'+txt+'</em></div>';
function gearRender(){const G2=guns,WL=$('gW'),AL=$('gA'),D=$('gDet');$('gCr').textContent=WAL.cr.toLocaleString()+' CR';
  WL.innerHTML='<h4>WEAPONS</h4>'+ORDER.map((sl,i)=>{const G=G2[sl],W=WPN[G.k],md=G.mods||defMods(G.k),R=RAR[G.rar];return '<button type="button" class="gt'+(GSEL.kind==='w'&&GSEL.i===sl?' on':'')+'" data-w="'+sl+'" style="--rc:'+R.c+'"><span class="gk">'+(i+1)+'</span><b>'+W.name+'</b><i>'+R.n+' · Power '+G.pow+' · x'+gunMult(sl).toFixed(2)+'</i><em>'+MODS.s[md.s].n+' · '+MODS.b[md.b].n+' · '+MODS.m[md.m].n+'</em></button>'}).join('');
  AL.innerHTML='<h4>ARMOUR</h4>'+ARMP.map((a,p)=>'<button type="button" class="gt'+(GSEL.kind==='a'&&GSEL.i===p?' on':'')+'" data-a="'+p+'" style="--rc:'+RAR[a.rar].c+'"><span class="gk">'+PSLOT[p][0]+'</span><b>'+pName(a)+'</b><i>'+RAR[a.rar].n+' · '+PSLOT[p]+'</i><em>'+armLine(a)+'</em></button>').join('')+
    '<p class="gtot">Shield '+Math.round(shMax)+' · damage taken '+Math.round((1-ARMS.red)*100)+'% · speed '+Math.round((1+ARMS.spd)*100)+'% · recharge +'+Math.round(ARMS.rch*100)+'%</p>';
  let h='';if(GSEL.kind==='w'){const sl=GSEL.i,G=G2[sl],W=gW(G),B=WPN[G.k],md=G.mods||defMods(G.k);
    h+='<div class="gdh"><b style="color:'+RAR[G.rar].c+'">'+B.name+'</b><span>slot '+(ORDER.indexOf(sl)+1)+' · '+RAR[G.rar].n+' · Power '+G.pow+' · grenade '+B.gren.n+' · melee '+B.mel.n+'</span></div><div class="gdc"><div>';
    const rps=1/W.cd,dps=W.dmg*(W.pel||1)*gunMult(sl);h+=bar('DAMAGE',W.dmg*(W.pel||1)*gunMult(sl),12,(W.dmg*(W.pel||1)*gunMult(sl)).toFixed(1))+bar('FIRE RATE',rps,18,rps.toFixed(1)+'/s')+bar('ACCURACY',1-Math.min(1,(W.spread||0)*9),1,W.spread?Math.round((1-Math.min(1,W.spread*9))*100)+'%':'100%')+
      bar(W.mode==='mag'?'MAGAZINE':'HEAT/SHOT',W.mode==='mag'?W.mag:W.heat,W.mode==='mag'?90:20,W.mode==='mag'?String(W.mag):W.heat.toFixed(1))+(W.mode==='mag'?bar('RELOAD',3-W.reload,3,W.reload.toFixed(2)+' s'):'')+bar('ZOOM',W.zoom||1,4,(W.zoom||1)+'x')+bar('DPS',dps*rps,40,Math.round(dps*rps)+'');
    h+='</div><div>'+[['s','SIGHT'],['b','BARREL'],['m','MAGAZINE']].map(([kk,lab])=>'<div class="gmod"><span>'+lab+'</span>'+MODS[kk].map((o,v)=>'<button type="button" data-m="'+kk+':'+v+'"'+(md[kk]===v?' aria-pressed="true"':'')+'>'+o.n+'</button>').join('')+'</div>').join('')+'</div></div>';
    h+='<div class="gk2">STORED GUNS · '+INV.g.length+' / 16 · click one to put it in this slot</div><div class="gcards">'+(INV.g.length?INV.g.map((r,i)=>'<div class="gcard" role="button" tabindex="0" data-e="g:'+i+'" style="--rc:'+RAR[r.rar].c+'"><span class="x" data-x="g:'+i+'">SCRAP</span><b>'+WPN[r.k].name+'</b>'+RAR[r.rar].n+' · Power '+r.pow+' · x'+gMult(r.rar,r.pow).toFixed(2)+'<br>grenade '+WPN[r.k].gren.n+' · melee '+WPN[r.k].mel.n+'</div>').join(''):'<p class="gtot">No stored guns yet. Robots drop guns; new kinds include the Thresher Scattergun and the Heron Longshot.</p>')+'</div>'}
  else{const p=GSEL.i,a=ARMP[p],L=INV.a.map((r,i)=>[r,i]).filter(([r])=>r.p===p);h+='<div class="gdh"><b style="color:'+RAR[a.rar].c+'">'+pName(a)+'</b><span>'+PSLOT[p]+' · '+RAR[a.rar].n+' · Power '+a.pow+' · '+armLine(a)+'</span></div>';
    h+='<div class="gk2">STORED '+PSLOT[p]+' PIECES · click one to wear it</div><div class="gcards">'+(L.length?L.map(([r,i])=>'<div class="gcard" role="button" tabindex="0" data-e="a:'+i+'" style="--rc:'+RAR[r.rar].c+'"><span class="x" data-x="a:'+i+'">SCRAP</span><b>'+pName(r)+'</b>'+RAR[r.rar].n+' · Power '+r.pow+'<br>'+armLine(r)+'</div>').join(''):'<p class="gtot">No spare '+PSLOT[p].toLowerCase()+' pieces yet. Robots and bosses drop armour.</p>')+'</div>'}
  D.innerHTML=h}
function invOpen(){if(state!=='playing'||INTRO.on||cineT>0)return;if(FLY){say('The loadout opens on foot',1.5);return}INVOPEN=true;ADS=false;closeWheel(false);setState('paused');overlay.hidden=true;$('gear').hidden=false;if(document.pointerLockElement)document.exitPointerLock();gearInit();gearRender()}
function invClose(){if(!INVOPEN)return;INVOPEN=false;$('gear').hidden=true;resume()}
function invToggle(){INVOPEN?invClose():invOpen()}
// save parsing for inventory and armour (versions 3 and 4)
function invParse(o){const R=x=>Math.max(0,Math.min(4,Math.floor(+x)||0)),P=x=>Math.max(1,Math.min(999,Math.floor(+x)||1)),K=x=>{const k=Math.floor(+x);return k>=0&&k<WPN.length?k:0},
  M=m=>({s:Math.max(0,Math.min(3,(m&&m.s)|0)),b:Math.max(0,Math.min(3,(m&&m.b)|0)),m:Math.max(0,Math.min(2,(m&&m.m)|0))}),inv={g:[],a:[]};let arm=[0,1,2,3].map(p=>({t:4,rar:0,pow:1,p}));
  try{const I=o&&o.inv;if(I&&Array.isArray(I.g)){if(o.v>=4)inv.g=I.g.slice(0,16).map(r=>({k:K(r&&r.k),rar:R(r&&r.rar),pow:P(r&&r.pow),mods:M(r&&r.mods)}));else I.g.slice(0,6).forEach((l,k)=>{if(Array.isArray(l))for(const r of l.slice(0,4))inv.g.push({k,rar:R(r&&r.rar),pow:P(r&&r.pow),mods:defMods(k)})})}
    if(I&&Array.isArray(I.a))inv.a=I.a.slice(0,16).map(r=>({t:Math.max(0,Math.min(3,Math.floor(+(r&&r.t))||0)),rar:R(r&&r.rar),pow:P(r&&r.pow),p:o.v>=4?Math.max(0,Math.min(3,(r&&r.p)|0)):2}));
    if(o&&Array.isArray(o.arm))arm=[0,1,2,3].map(p=>{const r=o.arm[p];if(!r)return{t:4,rar:0,pow:1,p};const t=Math.floor(+r.t);return{t:t>=0&&t<=4?t:4,rar:R(r.rar),pow:P(r.pow),p}});
    else if(o&&o.arm){const t=Math.floor(+o.arm.t);arm=[0,1,2,3].map(p=>({t:t>=0&&t<=4?t:4,rar:R(o.arm.rar),pow:P(o.arm.pow),p}))}}catch(e){}return{inv,arm}}
'''
s=s.replace(m.group(0),INV)
# references to the single-armour variable elsewhere
rep("inv:JSON.parse(JSON.stringify(INV)),arm:{t:ARMEQ.t,rar:ARMEQ.rar,pow:ARMEQ.pow}};","inv:JSON.parse(JSON.stringify(INV)),arm:ARMP.map(a=>({t:a.t,rar:a.rar,pow:a.pow,p:a.p}))};")
rep("SAVE={v:3,t:Date.now(),wave,cls,score,done:wave>=CAMP.length,guns:guns.map(g=>({k:g.k,rar:g.rar,pow:g.pow})),","SAVE={v:4,t:Date.now(),wave,cls,score,done:wave>=CAMP.length,guns:guns.map(g=>({k:g.k,rar:g.rar,pow:g.pow,mods:g.mods})),")
rep("{const q=JSON.parse(JSON.stringify({i:SAVE.inv||{g:[[],[],[],[],[],[]],a:[]},a:SAVE.arm||{t:4,rar:0,pow:1}}));INV=q.i;ARMEQ=q.a;applyArmour();shield=shMax}",
    "{const q=JSON.parse(JSON.stringify({i:SAVE.inv||{g:[],a:[]},a:SAVE.arm||[0,1,2,3].map(p=>({t:4,rar:0,pow:1,p}))}));INV=q.i;ARMP=q.a;applyArmour();shield=shMax}")
rep("guns=SAVE.guns.map(q=>mkGun(q.k,q.rar,q.pow));","guns=SAVE.guns.map(q=>mkGun(q.k,q.rar,q.pow,q.mods));attSync();")
# save validation: six slots; version 4 keeps the slot order and any gun type
rep("if(!o||(o.v!==1&&o.v!==2&&o.v!==3))return null;","if(!o||(o.v!==1&&o.v!==2&&o.v!==3&&o.v!==4))return null;")
rep("const g=WPN.map((_,k)=>({k,rar:0,pow:1}));\n  for(const q of o.guns){const k=Math.floor(+q.k);if(!(k>=0&&k<6))return null;g[k]={k,rar:Math.max(0,Math.min(4,Math.floor(+q.rar)||0)),pow:Math.max(1,Math.min(999,Math.floor(+q.pow)||1))}}",
    "const g=[0,1,2,3,4,5].map(k=>({k,rar:0,pow:1}));\n  o.guns.forEach((q,i)=>{const k=Math.floor(+q.k);if(!(k>=0&&k<(o.v>=4?WPN.length:6)))throw 0;const sl=o.v>=4?i:k;g[sl]={k,rar:Math.max(0,Math.min(4,Math.floor(+q.rar)||0)),pow:Math.max(1,Math.min(999,Math.floor(+q.pow)||1)),mods:o.v>=4&&q.mods?{s:Math.max(0,Math.min(3,q.mods.s|0)),b:Math.max(0,Math.min(3,q.mods.b|0)),m:Math.max(0,Math.min(2,q.mods.m|0))}:undefined}});")
rep("return{v:3,t:+o.t||0,done:!!o.done||w>=4,wave:w,cls:c,","return{v:4,t:+o.t||0,done:!!o.done||w>=4,wave:w,cls:c,")

# ---------- markup and styles for the loadout screen; replaces the v70 inventory panel ----------
m=re.search(r'<div class="panel inv" id="inv" hidden>.*?<button type="button" id="invClose">Close · I</button></div>',s,re.S);assert m
s=s.replace(m.group(0),'<div class="gear" id="gear" hidden><div class="gtop"><b>LOADOUT</b><span id="gCr"></span><button type="button" id="gClose">Close · I</button></div>'
  '<div class="gcol" id="gW"></div><div class="gmid"><canvas id="gCv" aria-label="Your character wearing the selected armour"></canvas><p class="ghint">Drag to turn</p></div><div class="gcol" id="gA"></div><div class="gdet" id="gDet"></div></div>')
m=re.search(r"\$\('invBtn'\)\.addEventListener\('click',\(\)=>invToggle\(\)\);.*?\$\('invBody'\)\.addEventListener\('keydown'[^\n]*\n",s,re.S);assert m
s=s.replace(m.group(0),"$('invBtn').addEventListener('click',()=>invToggle());$('gClose').addEventListener('click',()=>invClose());\n"
  "$('gear').addEventListener('click',e=>{const t=e.target.closest('[data-w],[data-a],[data-m],[data-e],[data-x]');if(!t)return;const d=t.dataset;\n"
  "  if(d.x){e.stopPropagation();const[k,i]=d.x.split(':');gearScrap(k,+i);return}if(d.w!==undefined){GSEL={kind:'w',i:+d.w};gearRender();return}if(d.a!==undefined){GSEL={kind:'a',i:+d.a};gearRender();return}\n"
  "  if(d.m){const[k,v]=d.m.split(':');if(GSEL.kind==='w')gearMod(GSEL.i,k,+v);return}if(d.e){const[k,i]=d.e.split(':');if(k==='g')gearEquipGun(GSEL.i,+i);else gearEquipArm(+i)}});\n"
  "$('gear').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.dataset&&(e.target.dataset.e||e.target.dataset.x)){e.preventDefault();e.target.click()}});\n")
rep("function resume(){if(INVOPEN){INVOPEN=false}$('inv').hidden=true;","function resume(){if(INVOPEN){INVOPEN=false}$('gear').hidden=true;")
rep(".inv{width:min(94%,620px);",
    ".scope{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at center,transparent 0,transparent 31vmin,rgba(0,0,0,.94) 31.4vmin)}\n"
    ".scope i{position:absolute;left:50%;top:0;bottom:0;width:1px;background:rgba(0,0,0,.8)}.scope b{position:absolute;top:50%;left:0;right:0;height:1px;background:rgba(0,0,0,.8)}\n"
    ".gear{position:absolute;inset:0;z-index:5;background:linear-gradient(180deg,rgba(6,13,15,.97),rgba(10,18,20,.95));display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr) minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) minmax(0,auto);gap:10px;padding:12px 14px;box-sizing:border-box;overflow:auto;font-size:11px}\n"
    ".gtop{grid-column:1/-1;display:flex;align-items:center;gap:14px;border-bottom:1px solid var(--line);padding-bottom:6px}.gtop b{font:700 15px 'Chakra Petch',sans-serif;letter-spacing:.3em;color:var(--amber)}.gtop span{color:#ffd27a;font-weight:700;margin-left:auto}\n"
    ".gcol{display:flex;flex-direction:column;gap:5px;min-width:0}.gcol h4{margin:0 0 2px;font-size:10px;letter-spacing:.2em;color:var(--dim);font-weight:600}\n"
    ".gt{all:unset;box-sizing:border-box;display:block;cursor:pointer;border:1px solid var(--line);border-left:4px solid var(--rc);background:rgba(0,0,0,.35);padding:5px 8px;position:relative;line-height:1.35}\n"
    ".gt:hover,.gt:focus-visible{border-color:var(--rc);border-left-color:var(--rc)}.gt.on{background:rgba(255,178,56,.12);border-color:var(--amber);border-left-color:var(--rc)}\n"
    ".gt b{display:block;font-size:12px;color:var(--rc)}.gt i{display:block;font-style:normal}.gt em{display:block;font-style:normal;color:var(--dim);font-size:10px}.gt .gk{position:absolute;right:7px;top:5px;color:var(--dim);font-weight:700}\n"
    ".gmid{position:relative;min-height:220px;border:1px solid var(--line);background:radial-gradient(ellipse at 50% 70%,rgba(255,178,56,.08),transparent 60%)}.gmid canvas{position:absolute;inset:0;width:100%;height:100%;cursor:grab;touch-action:none}\n"
    ".ghint{position:absolute;left:0;right:0;bottom:4px;margin:0;text-align:center;color:var(--dim);font-size:10px;letter-spacing:.14em;pointer-events:none}.gtot{margin:4px 0 0;color:var(--dim);font-size:10px}\n"
    ".gdet{grid-column:1/-1;border-top:1px solid var(--line);padding-top:6px;min-width:0}.gdh b{font:700 14px 'Chakra Petch',sans-serif;margin-right:10px}.gdh span{color:var(--dim)}\n"
    ".gdc{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:14px;margin-top:6px}.gsb{display:grid;grid-template-columns:78px 1fr 56px;align-items:center;gap:6px;margin:2px 0}.gsb span{color:var(--dim);font-size:9px;letter-spacing:.14em}\n"
    ".gsb i{height:6px;background:rgba(255,255,255,.08)}.gsb i b{display:block;height:100%;background:var(--amber)}.gsb em{font-style:normal;text-align:right}\n"
    ".gmod{display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin:3px 0}.gmod span{width:70px;color:var(--dim);font-size:9px;letter-spacing:.14em}.gmod button{font-size:10px;padding:3px 7px}.gmod button[aria-pressed=\"true\"]{border-color:var(--amber);color:var(--amber)}\n"
    ".gk2{margin:8px 0 4px;color:var(--dim);font-size:9px;letter-spacing:.16em}.gcards{display:flex;flex-wrap:wrap;gap:5px}.gcard{border:1px solid var(--line);border-left:4px solid var(--rc);background:rgba(0,0,0,.35);padding:4px 7px;flex:0 1 190px;cursor:pointer;line-height:1.35}\n"
    ".gcard:hover,.gcard:focus-visible{border-color:var(--rc);outline:none}.gcard b{display:block;color:var(--rc)}.gcard .x{float:right;font-size:9px;color:var(--dim);border:1px solid var(--line);padding:0 4px;margin-left:6px}.gcard .x:hover{color:var(--hurt);border-color:var(--hurt)}\n"
    "@media (max-width:760px){.gear{grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-rows:auto 200px auto auto}.gmid{grid-column:1/-1;grid-row:2}.gdc{grid-template-columns:1fr}}\n"
    ".inv{width:min(94%,620px);")
# render the 3D preview each frame while the loadout is open, and keep the gun attachments in sync
rep("function dmgTick(dt){crTick();","function dmgTick(dt){crTick();gearTick(dt);")
rep("function swap(w,dir=1){","attSync();\nfunction swap(w,dir=1){")
rep("Space jump, again in the air for your class move · V slide while sprinting · I inventory · H inspect your gun",
    "Space jump, again in the air for your class move · V slide while sprinting · right mouse aim · I loadout · H inspect your gun")
open(dst,'w').write(s);print('ok',len(s))
s=open(dst).read()
# the aim value must start at 0 (undefined turned every frame into NaN)
rep("const FP={spr:0,draw:1,","const FP={ads:0,spr:0,draw:1,")
# loadout layout: columns and details scroll inside their own areas instead of overlapping
rep("grid-template-rows:auto minmax(0,1fr) minmax(0,auto);gap:10px;","grid-template-rows:auto minmax(0,1fr) minmax(0,40%);gap:10px;")
rep(".gcol{display:flex;flex-direction:column;gap:5px;min-width:0}",".gcol{display:flex;flex-direction:column;gap:5px;min-width:0;min-height:0;overflow:auto;padding-right:2px}")
rep(".gdet{grid-column:1/-1;border-top:1px solid var(--line);padding-top:6px;min-width:0}",".gdet{grid-column:1/-1;border-top:1px solid var(--line);padding-top:6px;min-width:0;min-height:0;overflow:auto}")
rep(".gt em{display:block;font-style:normal;color:var(--dim);font-size:10px}",".gt em{display:block;font-style:normal;color:var(--dim);font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}")
open(dst,'w').write(s);print('ok-fix')
s=open(dst).read()
# ---------- weapon bench: the loadout's middle view can show the selected gun on its own, big, with its attachments ----------
rep('<div class="gmid"><canvas id="gCv" aria-label="Your character wearing the selected armour"></canvas><p class="ghint">Drag to turn</p></div>',
    '<div class="gmid"><canvas id="gCv" aria-label="Your character, or the selected gun on the weapon bench"></canvas><div class="gview"><button type="button" id="gvC" aria-pressed="true">Character</button><button type="button" id="gvW" aria-pressed="false">Weapon bench</button></div><p class="ghint" id="gHint">Drag to turn</p></div>')
rep(".ghint{",".gview{position:absolute;left:6px;top:6px;display:flex;gap:4px}.gview button{font-size:10px;padding:3px 8px}.gview button[aria-pressed=\"true\"]{border-color:var(--amber);color:var(--amber)}\n.ghint{")
rep("const GR={r:null,","const GR={mode:'c',bench:null,benchKey:'',r:null,")
rep("function gearDress(){",
r"""// the bench copy of a first-person gun: the hands are baked into the same model, so their materials are left out
function benchSync(){if(!GR.scene)return;const on=GR.mode==='w'&&GSEL.kind==='w';$('gvC').setAttribute('aria-pressed',!on);$('gvW').setAttribute('aria-pressed',on);$('gHint').textContent=on?'Weapon bench · drag to turn':'Drag to turn';
  GR.g.visible=!on;if(!on){if(GR.bench)GR.bench.visible=false;return}const G=guns[GSEL.i],md=G.mods||defMods(G.k),key=G.k+':'+md.s+md.b+md.m;if(GR.bench&&GR.benchKey===key){GR.bench.visible=true;return}
  if(GR.bench)GR.scene.remove(GR.bench);attSync();const CM=charMats(),drop=new Set([VMS,CM.joint,MAT.glove,MAT.amber]),c=VMG[G.k].clone(true);c.position.set(0,0,0);c.rotation.set(0,0,0);c.scale.setScalar(1);
  const rm=[];c.traverse(o=>{o.visible=true;if(o.isMesh&&drop.has(o.material))rm.push(o)});for(const o of rm)o.parent.remove(o);
  const bb=new T.Box3().setFromObject(c),sz=bb.getSize(new T.Vector3()),ctr=bb.getCenter(new T.Vector3()),k=3.1/Math.max(.3,sz.z);c.position.copy(ctr).multiplyScalar(-1);
  const w=new T.Group(),inner=new T.Group();inner.add(c);inner.scale.setScalar(k);w.add(inner);w.position.y=1.0;GR.scene.add(w);GR.bench=w;GR.benchKey=key}
function gearDress(){""")
rep("GR.t+=dt;if(GR.drag===null&&!reduced)GR.yaw+=dt*.25;GR.g.rotation.y=GR.yaw;",
    "GR.t+=dt;if(GR.drag===null&&!reduced)GR.yaw+=dt*.25;GR.g.rotation.y=GR.yaw;if(GR.bench&&GR.bench.visible){GR.bench.rotation.set(.18,GR.yaw+Math.PI/2,0)}")
rep("  D.innerHTML=h}","  D.innerHTML=h;benchSync()}")
rep("$('invBtn').addEventListener('click',()=>invToggle());$('gClose').addEventListener('click',()=>invClose());",
    "$('invBtn').addEventListener('click',()=>invToggle());$('gClose').addEventListener('click',()=>invClose());\n"
    "$('gvC').addEventListener('click',()=>{GR.mode='c';benchSync()});$('gvW').addEventListener('click',()=>{GR.mode='w';if(GSEL.kind!=='w')GSEL={kind:'w',i:ORDER[0]};gearRender()});")
open(dst,'w').write(s);print('ok-bench')
