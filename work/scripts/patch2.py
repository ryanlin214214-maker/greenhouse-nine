p='index.html';s=open(p).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:70]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:70]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]

# css
rep(".pad{position:absolute",""".classes{display:flex;gap:8px;justify-content:center;width:100%;max-width:480px}
.classes button{flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:3px;align-items:center;padding:8px 6px;text-transform:none;letter-spacing:0;font-family:var(--mono);font-size:10px;color:var(--dim);line-height:1.35}
.classes button b{font-family:var(--display);font-size:14px;letter-spacing:.1em;text-transform:uppercase;color:var(--fg)}
.classes button[aria-pressed="true"]{border-color:var(--bloom);background:#22171f}
.classes button[aria-pressed="true"] b{color:var(--bloom)}
.hud .pw{color:var(--amber);font-size:11px}
.dn{position:absolute;font-family:var(--display);font-weight:700;font-size:15px;color:var(--fg);pointer-events:none;text-shadow:0 1px 0 #000;transform:translate(-50%,-50%);animation:dn .65s ease-out forwards}
.dn.crit{font-size:21px;color:var(--amber)}
@keyframes dn{from{opacity:1;margin-top:0}to{opacity:0;margin-top:-34px}}
@media (prefers-reduced-motion:reduce){.dn{animation-name:dnf}}
@keyframes dnf{from{opacity:1}to{opacity:0}}
.pad{position:absolute""")
# html
rep('<span id="score">0</span></div>','<span id="score">0</span><span class="pw">PWR <span id="pwr">1</span></span></div>')
rep('<button class="go" id="go"','<div class="classes" id="classes"></div>\n    <button class="go" id="go"')
rep("every kill charges the surge. Clear the deck, wave by wave.","every kill charges the surge. Pick a class, collect better weapons and clear the deck.")
rep("On a phone: drag left to move, right to aim, buttons to fight","Jump again in the air for your class move · shelled enemies break fastest to the matching colour:<br>cyan to the welder, violet to the lance, amber to grenades<br>On a phone: drag left to move, right to aim, buttons to fight")

# state
rep("function say(t,d=2){const m=$('msg');m.textContent=t;m.classList.add('on');msgT=d}",
"""function say(t,d=2,c){const m=$('msg');m.textContent=t;m.style.color=c||'';m.classList.add('on');msgT=d}
const CLS=[{n:'Bulwark',d:'Heavy shield · boost jump · shockwave surge',sh:150,spd:1,gren:7},
  {n:'Strider',d:'Fast · double jump · overdrive surge',sh:90,spd:1.2,gren:5},
  {n:'Grafter',d:'Glide · quick recharge · healing surge',sh:110,spd:1.05,gren:6}];
const RAR=[{n:'Common',c:'#dcebe4',m:1},{n:'Uncommon',c:'#7be36b',m:1.1},{n:'Rare',c:'#6fd8ff',m:1.25},{n:'Epic',c:'#c9a6ff',m:1.45},{n:'Mythic',c:'#ffb238',m:1.7}];
const ELC=['#6fd8ff','#c9a6ff','#ffb238'];
const NAMES=[['Arc Welder','Spark Lathe','Flux Torch','Seam Cutter'],['Thorn Lance','Briar Pike','Root Spike','Bramble Rail']];
const tmpN=new T.Vector3();
let cls=0,shMax=100,boostT=0,gliding=false,airUsed=false,overT=0,guns=[],loots=[],shieldTip=false,dnCount=0;
try{cls=Math.max(0,Math.min(2,+localStorage.getItem('gh9-class')||0))}catch(e){}
const gunMult=i=>(1+(guns[i].pow-1)*0.12)*RAR[guns[i].rar].m;
const power=()=>Math.round((guns[0].pow+guns[1].pow)/2);
function newGuns(){guns=[{name:NAMES[0][0],rar:0,pow:1},{name:NAMES[1][0],rar:0,pow:1}]}newGuns();""")
between("function mk(","function clear(","""function mk(type,x,y,z){const w=Math.max(wave,1),m=model(type),k=1+0.14*(w-1);m.g.position.set(x,y,z);scene.add(m.g);
  const e={type,pos:m.g.position,g:m.g,wings:m.wings,parts:m.parts,white:false,flash:0,dying:0,r:ER[type],sh:0,sel:0,shell:null};
  if(type===0)Object.assign(e,{hp:2*k,spd:5+Math.min(w*0.2,2),cd:0.5,ph:Math.random()*6});
  else if(type===1)Object.assign(e,{hp:4*k,spd:3.2,cd:1+Math.random(),ph:Math.random()<.5?-1:1});
  else Object.assign(e,{hp:16*k,spd:4,cd:0.8,ph:Math.random()*6});
  if(state==='playing'&&(type===2||(w>=2&&Math.random()<0.22))){e.sel=Math.random()*3|0;e.sh=(type===2?12:4)*k;
    e.shell=mesh(GEO.sph,bas({color:ELC[e.sel],transparent:true,opacity:0.3,depthWrite:false}),e.r*1.4,e.r*1.4,e.r*1.4);m.g.add(e.shell);
    if(!shieldTip){shieldTip=true;setTimeout(()=>{if(state==='playing')say('Shelled enemy: match its colour',2.5)},1200)}}
  return e}
""")
rep("hp=100;shield=100;shDelay=0;heat=0;over=false;score=0;wave=0;waveTimer=0.01;","hp=100;shMax=CLS[cls].sh;shield=shMax;shDelay=0;heat=0;over=false;score=0;wave=0;waveTimer=0.01;boostT=0;gliding=false;airUsed=false;overT=0;newGuns();")
rep("clear(enemies);clear(shots);clear(pickups);clear(grenades);clear(blasts)}","clear(enemies);clear(shots);clear(pickups);clear(grenades);clear(blasts);clear(loots)}")
rep("function pause(){setState('paused');","function pause(){setState('paused');$('classes').hidden=true;")
rep("  setState('dead');$('ovTitle')","  setState('dead');$('classes').hidden=false;$('ovTitle')")
rep("$('go').addEventListener('click',","""CLS.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.innerHTML='<b>'+c.n+'</b>'+c.d;
  b.addEventListener('click',()=>{cls=i;try{localStorage.setItem('gh9-class',i)}catch(e){}syncCls()});$('classes').appendChild(b)});
function syncCls(){[...$('classes').children].forEach((b,i)=>b.setAttribute('aria-pressed',i===cls))}syncCls();
$('go').addEventListener('click',""")
rep("GEO={box:","GEO={oct:new T.OctahedronGeometry(1),box:")

# combat block
between("function drop(e,k){","function overlaps(b){","""function place(e,off){let x=e.pos.x+off,z=e.pos.z,y=groundAt(x,z,e.pos.y);
  for(let i=0;i<10&&inBox(x,y+0.3,z);i++){const d=Math.hypot(pos.x-x,pos.z-z)||1;x+=(pos.x-x)/d;z+=(pos.z-z)/d;y=groundAt(x,z,e.pos.y)}
  return[x,y,z]}
function drop(e,k){const[x,y,z]=place(e,0);
  const g=new T.Group();g.add(mesh(GEO.box,k?MAT.cell:MAT.gel,0.34,0.44,0.34),mesh(GEO.box,MAT.cap,0.2,0.1,0.2,0,0.27,0));g.position.set(x,y+0.45,z);scene.add(g);pickups.push({g,k,y:y+0.45})}
function loot(e){const w=Math.max(wave,1),r=Math.random()-w*0.015-(e.type===2?0.25:0),rar=r<0.03?4:r<0.12?3:r<0.35?2:r<0.65?1:0;
  const[x,y,z]=place(e,0.7),slot=Math.random()*2|0,g=mesh(GEO.oct,bas({color:RAR[rar].c}),0.26,0.4,0.26,x,y+0.7,z);scene.add(g);
  loots.push({g,y:y+0.7,slot,rar,pow:w+rar,name:NAMES[slot][Math.random()*4|0]})}
function num(p,n,c,crit){const v=tmpN.copy(p).project(cam);if(v.z>1||dnCount>28)return;
  const d=document.createElement('div');d.className='dn'+(crit?' crit':'');d.textContent=Math.max(1,Math.round(n*10));if(!crit&&c)d.style.color=c;
  d.style.left=((v.x*.5+.5)*stage.clientWidth+(Math.random()-.5)*26)+'px';d.style.top=((-v.y*.5+.5)*stage.clientHeight-12)+'px';
  dnCount++;d.addEventListener('animationend',()=>{d.remove();dnCount--});stage.insertBefore(d,overlay)}
function damage(e,n,el=-1,crit=false){if(e.dying)return;e.flash=0.1;
  if(e.sh>0){const m=el===e.sel?2.5:el<0?1:0.4;e.sh-=n*m;num(e.pos,n*m,ELC[e.sel]);
    if(e.sh<=0){e.sh=0;e.g.remove(e.shell);e.shell=null;sfx('boom');if(el===e.sel)explode(e.pos,true)}else sfx('hit');return}
  if(crit)n*=2;e.hp-=n;num(e.pos,n,null,crit);
  if(e.hp>0){sfx('hit');return}
  e.dying=0.001;score+=e.type===2?500:e.type?150:100;sfx('kill');superQ=Math.min(100,superQ+(e.type===2?30:7));
  const r=Math.random();if(e.type===2||r<0.2)drop(e,0);else if(r<0.4)drop(e,1);
  if(e.type===2||Math.random()<0.16)loot(e)}
function fire(){
  const lance=weapon===1,od=overT>0;
  if(lance&&ammo<=0){weapon=0;fireCd=0.3;say('Lance empty',0.9);sfx('swap');return}
  if(lance){ammo--;fireCd=od?0.45:0.75;flash=0.12;recoil=2;sfx('lance')}
  else{fireCd=od?0.085:0.14;flash=0.06;recoil=1;if(!od)heat+=9;sfx('shoot');if(heat>=100){heat=100;over=true;say('Overheated',1.2);sfx('over')}}
  sinceFire=0;
  cam.getWorldDirection(tmp);const o=[eye.x,eye.y,eye.z],d=[tmp.x,tmp.y,tmp.z],wall=rayBoxes(o,d,90);
  let hit=null,hd=wall;const all=[];
  for(const e of enemies){if(e.dying)continue;const ox=e.pos.x-o[0],oy=e.pos.y-o[1],oz=e.pos.z-o[2],t=ox*d[0]+oy*d[1]+oz*d[2];
    if(t<0||t>wall)continue;const R=e.r*1.2+t*0.012,q=ox*ox+oy*oy+oz*oz-t*t;
    if(q<R*R){e.c=q<(e.r*0.45)**2;all.push(e);if(t<hd){hit=e;hd=t}}}
  const end=lance?wall:hd;muzzle.getWorldPosition(tmp2);tmp.multiplyScalar(end).add(eye);
  beam.position.copy(tmp2).add(tmp).multiplyScalar(0.5);beam.lookAt(tmp);const th=lance?0.03:0.012;beam.scale.set(th,th,tmp2.distanceTo(tmp));
  beamMat.color.set(lance?0xe3d2ff:0xc9fbff);
  const dm=gunMult(weapon)*(od?2:1);
  if(lance)for(const e of all)damage(e,6*dm,1,e.c);else if(hit)damage(hit,dm,0,hit.c);
}
function grenade(){if(state!=='playing'||grenCd>0)return;grenCd=CLS[cls].gren;cam.getWorldDirection(tmp);
  const g=mesh(GEO.sph,MAT.charge,0.13,0.13,0.13);g.position.copy(eye).addScaledVector(tmp,0.5);scene.add(g);
  grenades.push({g,v:tmp.clone().multiplyScalar(17).add(new T.Vector3(0,2.5,0)),t:2});sfx('swap')}
function explode(p,burst){const m=bas({color:burst?0xffffff:0xffb238,transparent:true,opacity:0.85,fog:false}),g=mesh(GEO.sph,m,0.5,0.5,0.5,p.x,p.y,p.z);scene.add(g);
  blasts.push({g,m,t:0});if(!burst)sfx('boom');if(!reduced)shake=Math.max(shake,0.12);
  const c=new T.Vector3(p.x,Math.max(p.y,0.3),p.z),k=1+0.1*(power()-1);
  for(const e of enemies){const d=e.pos.distanceTo(c);if(d<(burst?3:4)+e.r&&los(c,e.pos))damage(e,(burst?3:d<2.2?6:3)*k,burst?-1:2)}}
function melee(){if(state!=='playing'||meleeCd>0)return;meleeCd=1.1;meleeA=0.2;sfx('melee');cam.getWorldDirection(tmp);const k=(cls===0?8:4)*(1+0.1*(power()-1));
  for(const e of enemies){tmp2.copy(e.pos).sub(eye);const d=tmp2.length()||1;
    if(d<2.2+e.r&&tmp2.dot(tmp)/d>0.45){e.pos.addScaledVector(tmp2,1.5/d);damage(e,k)}}}
function surge(){if(state!=='playing'||superQ<100)return;superQ=0;novaA=1;shield=shMax;clear(shots);sfx('nova');const k=1+0.1*(power()-1);
  if(cls===1){overT=8;say('Overdrive',1.5);return}
  if(cls===2){hp=Math.min(100,hp+50);say('Regrowth',1.5)}else say('Shockwave',1.5);
  for(const e of enemies)if(e.pos.distanceTo(eye)<22&&los(eye,e.pos))damage(e,(cls===2?8:14)*k)}
function swap(w){if(state!=='playing'||time-swapT<0.25)return;swapT=time;weapon=w===undefined?1-weapon:w;
  fireCd=Math.max(fireCd,0.3);sfx('swap');say(guns[weapon].name,0.8,RAR[guns[weapon].rar].c)}
function hurt(n){shDelay=cls===2?2.2:3.5;if(shield>0){shield-=n;if(shield<0){hp+=shield;shield=0}}else hp-=n;
  hurtA=1;shake=reduced?0:0.2;sfx('hurt');if(hp<=0){hp=0;die()}}

""")
# movement
between("  const sp=(keys.ShiftLeft||keys.ShiftRight?9:6.2)*dt","movePlayer((-sn*f","""  const sp=(keys.ShiftLeft||keys.ShiftRight?9:6.2)*CLS[cls].spd*dt,sn=Math.sin(yaw),cs=Math.cos(yaw);
  if(ground){airUsed=false;gliding=false;boostT=0;if(jumpQ||keys.Space){vy=6.9;sfx('jump')}}
  else if(jumpQ){
    if(cls===2){gliding=!gliding;if(gliding&&!airUsed){airUsed=true;vy=Math.max(vy,3);sfx('jump')}}
    else if(!airUsed){airUsed=true;sfx('jump');if(cls===1)vy=7.2;else boostT=0.45}}
  jumpQ=false;vy-=19*dt;
  if(boostT>0){boostT-=dt;vy=Math.min(vy+50*dt,6)}
  if(gliding&&vy<-1.4)vy=-1.4;
  """)
rep("shDelay-=dt;if(shDelay<=0&&shield<100)shield=Math.min(100,shield+40*dt);","shDelay-=dt;if(shDelay<=0&&shield<shMax)shield=Math.min(shMax,shield+(cls===2?70:40)*dt);overT=Math.max(0,overT-dt);")
rep("  for(let i=pickups.length-1;i>=0;i--){const p=pickups[i],q=p.g.position;","""  for(let i=loots.length-1;i>=0;i--){const L=loots[i],q=L.g.position;
    if(Math.hypot(q.x-pos.x,q.z-pos.z)>1.1||Math.abs(q.y-pos.y-0.7)>1.7)continue;
    if((1+(L.pow-1)*0.12)*RAR[L.rar].m>gunMult(L.slot)){guns[L.slot]={name:L.name,rar:L.rar,pow:L.pow};say(RAR[L.rar].n+' '+L.name+' · Power '+L.pow,2.4,RAR[L.rar].c)}
    else{score+=100;say('Salvage +100',1)}
    scene.remove(L.g);L.g.material.dispose();loots.splice(i,1);sfx('pick')}
  for(let i=pickups.length-1;i>=0;i--){const p=pickups[i],q=p.g.position;""")
rep("  for(const p of pickups){p.g.rotation.y+=dt*2;","  for(const L of loots){L.g.rotation.y+=dt*3;L.g.position.y=L.y+Math.sin(time*4)*0.1}\n  for(const p of pickups){p.g.rotation.y+=dt*2;")
# hud
rep("$('sh').firstElementChild.style.width=shield+'%';","$('sh').firstElementChild.style.width=shield/shMax*100+'%';$('pwr').textContent=power();")
rep("$('wname').textContent=lance?'LANCE':'ARC';","$('wname').textContent=lance?'LANCE':'ARC';$('wname').style.color=RAR[guns[weapon].rar].c;")
rep("chip('cG',1-grenCd/7);","chip('cG',1-grenCd/CLS[cls].gren);")
open(p,'w').write(s)
