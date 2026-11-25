import re
p='index.html';s=open(p).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:60]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:60]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]

# ---- css
rep("--bloom:#ff4fa3;","--bloom:#ff4fa3; --shield:#6fd8ff; --lance:#c9a6ff;")
n=len(s); s=re.sub(r"\.fire\{.*?\}", lambda m:""".pad{position:absolute;right:max(12px,env(safe-area-inset-right,0px));bottom:14px;display:grid;grid-template-columns:repeat(3,50px);gap:8px;align-items:center;justify-items:center}
.pad button{width:50px;height:50px;border-radius:50%;padding:0;font-size:10px;background:rgba(19,37,40,.7);border:2px solid var(--dim)}
.pad .fire{grid-column:span 2;width:78px;height:78px;background:rgba(255,79,163,.28);border-color:var(--bloom);font-size:13px;font-weight:700}
.abil{display:flex;gap:8px}
.chip{font-size:9px;letter-spacing:.1em;color:var(--dim);display:flex;flex-direction:column;gap:2px}
.chip .meter{width:clamp(44px,9vw,62px);height:5px}
.chip .meter i{background:var(--dim);width:0}
.chip.ready{color:var(--fg)}
.chip.ready .meter i{background:var(--bloom)}
#sh i{background:var(--shield)}
#heat.lance i{background:var(--lance)}""", s, count=1, flags=re.S); assert len(s)!=n

# ---- html
rep('<div class="row"><span class="lab">HULL</span>','<div class="row"><span class="lab">SHLD</span><div class="meter" id="sh"><i></i></div></div>\n    <div class="row"><span class="lab">HULL</span>')
rep('<div class="row"><span class="lab">HEAT</span><div class="meter" id="heat"><i></i></div></div>',
 '<div class="row"><span class="lab" id="wname">ARC</span><div class="meter" id="heat"><i></i></div><span id="ammo"></span></div>\n    <div class="abil"><div class="chip" id="cG">GREN<div class="meter"><i></i></div></div><div class="chip" id="cM">MELEE<div class="meter"><i></i></div></div><div class="chip" id="cS">SURGE<div class="meter"><i></i></div></div></div>')
rep('<button class="fire" id="fire" type="button" hidden>Fire</button>',
 '<div class="pad" id="pad" hidden><button type="button" data-act="swap">Swap</button><button type="button" data-act="gren">Gren</button><button type="button" data-act="melee">Hit</button><button type="button" data-act="surge">Surge</button><button class="fire" type="button" data-act="fire">Fire</button></div>')
between('<p class="keys" id="ovKeys">','<button class="go"','<p class="keys" id="ovKeys">WASD move · mouse or arrows turn · click fires · Q swaps weapon<br>G or right-click grenade · F melee · X surge when charged · P pauses<br>On a phone: drag left to move, right to turn, buttons to fight</p>\n    ')
rep('Take the arc welder and clear the deck, wave by wave.','Your shield recharges, your welder never runs dry, and every kill charges the surge. Clear the deck, wave by wave.')

# ---- sprites
rep("g.fillRect(19,33,26,8)})\n};","""g.fillRect(19,33,26,8)}),
  warden:sprite(g=>{ell(g,12,22,14,6,-0.5,'#d9c9ff');ell(g,52,22,14,6,0.5,'#d9c9ff');
    g.fillStyle='#ffb238';for(let i=0;i<5;i++){g.beginPath();g.moveTo(15+i*7,18);g.lineTo(18.5+i*7,4);g.lineTo(22+i*7,18);g.fill()}
    ell(g,32,36,20,19,0,'#3b2466');ell(g,32,39,20,10,0,'#57349a');
    g.fillStyle='#1a0f30';g.fillRect(12,27,40,3);g.fillRect(14,47,36,4);
    ell(g,24,37,5,5,0,'#ffb238');ell(g,40,37,5,5,0,'#ffb238');ell(g,24,37,2,2,0,'#fff');ell(g,40,37,2,2,0,'#fff');
    g.fillStyle='#1a0f30';g.fillRect(22,54,3,9);g.fillRect(31,55,3,9);g.fillRect(40,54,3,9)}),
  cell:sprite(g=>{g.fillStyle='#dcebe4';g.fillRect(24,12,16,8);g.fillStyle='#57349a';g.fillRect(12,20,40,40);
    g.fillStyle='#c9a6ff';g.fillRect(18,26,8,28);g.fillRect(29,26,8,28);g.fillRect(40,26,6,28)}),
  charge:sprite(g=>{ell(g,32,32,24,24,0,'#7be36b');g.fillStyle='#0b1618';g.fillRect(8,28,48,8);ell(g,32,32,6,6,0,'#fff')}),
  blast:sprite(g=>{ell(g,32,32,31,31,0,'#ff4fa3');ell(g,32,32,25,25,0,'#ffb238');ell(g,32,32,15,15,0,'#fff5d0')})
};""")

# ---- state
rep("let enemies=[],shots=[],pickups=[],queue=[];","let enemies=[],shots=[],pickups=[],queue=[],grenades=[],blasts=[];\nlet shield=100,shDelay=0,weapon=0,ammo=12,grenCd=0,meleeCd=0,meleeA=0,superQ=0,novaA=0,swapT=-1;\nconst ESC=[0.6,0.8,1.05];")
between("function mk(","function reset()","""function mk(type,x,y){const w=Math.max(wave,1),b={type,x,y,flash:0,dying:0};
  if(type===0)return{...b,hp:2+(w/4|0),spd:2+Math.min(w*0.09,0.9),cd:0.5,ph:Math.random()*6};
  if(type===1)return{...b,hp:4+(w/3|0),spd:1.3,cd:1+Math.random(),ph:Math.random()<.5?-1:1};
  return{...b,hp:14+w*2,spd:1.5,cd:0.8,ph:Math.random()*6}}
""")
between("function reset()","function say(","""function reset(){px=2.5;py=2.5;pa=0.35;hp=100;shield=100;shDelay=0;heat=0;over=false;score=0;wave=0;waveTimer=0.01;
  weapon=0;ammo=12;grenCd=0;meleeCd=0;meleeA=0;superQ=0;novaA=0;enemies=[];shots=[];pickups=[];queue=[];grenades=[];blasts=[];hurtA=0}
""")
rep("for(let i=0;i<n;i++){const[x,y]=far[Math.random()*far.length|0];queue.push({t:i*0.45,type:i<seed?1:0,x:x+.5,y:y+.5})}}",
"const boss=wave%3===0?1+(wave/9|0):0;if(boss)say('Wave '+wave+' · Warden inbound',2.5);\n  for(let i=0;i<n+boss;i++){const[x,y]=far[Math.random()*far.length|0];queue.push({t:i*0.45,type:i>=n?2:i<seed?1:0,x:x+.5,y:y+.5})}}")
rep("  else if(k==='spit')","""  else if(k==='lance'){tone('sawtooth',300,60,.3,.1);tone('square',1400,300,.12,.05)}
  else if(k==='boom'){tone('triangle',140,30,.45,.2);tone('sawtooth',90,40,.3,.1)}
  else if(k==='melee')tone('square',180,90,.1,.08);
  else if(k==='nova'){tone('sine',200,1200,.5,.12);tone('triangle',100,30,.7,.15)}
  else if(k==='swap')tone('sine',520,700,.06,.05);
  else if(k==='spit')""")

# ---- input
rep("  if(e.code==='KeyP'){","""  if(state==='playing'&&!e.repeat){const c=e.code;if(c==='Digit1')swap(0);else if(c==='Digit2')swap(1);else if(c==='KeyQ')swap();
    else if(c==='KeyG')grenade();else if(c==='KeyF')melee();else if(c==='KeyX')surge()}
  if(e.code==='KeyP'){""")
rep("if(!locked)lock();firing=true});","if(!locked)lock();if(e.button===2)grenade();else firing=true});\nstage.addEventListener('wheel',e=>{if(state==='playing'){e.preventDefault();swap()}},{passive:false});")
rep("if(t.target===$('fire')){fireId=t.identifier;firing=true;continue}",
"const act=t.target.dataset&&t.target.dataset.act;\n    if(act){if(act==='fire'){fireId=t.identifier;firing=true}else if(act==='gren')grenade();else if(act==='melee')melee();else if(act==='swap')swap();else surge();continue}")
rep("$('fire').hidden=state!=='playing'","$('pad').hidden=state!=='playing'")
rep("$('fire').hidden=!(play&&touchUI)","$('pad').hidden=!(play&&touchUI)")
rep("if(keys.ArrowLeft||keys.KeyQ)pa-=2.6*dt;if(keys.ArrowRight||keys.KeyE)pa+=2.6*dt;","if(keys.ArrowLeft)pa-=2.6*dt;if(keys.ArrowRight)pa+=2.6*dt;")

# ---- combat
between("function fire(){","function update(dt){","""function damage(e,n){if(e.dying)return;e.hp-=n;e.flash=0.1;
  if(e.hp>0){sfx('hit');return}
  e.dying=0.001;score+=e.type===2?500:e.type?150:100;sfx('kill');superQ=Math.min(100,superQ+(e.type===2?30:7));
  const r=Math.random();if(e.type===2||r<0.2)pickups.push({x:e.x,y:e.y,k:0});else if(r<0.4)pickups.push({x:e.x,y:e.y,k:1})}
function fire(){
  const lance=weapon===1;
  if(lance&&ammo<=0){weapon=0;fireCd=0.3;say('Lance empty',0.9);sfx('swap');return}
  if(lance){ammo--;fireCd=0.75;flash=0.12;recoil=2;sfx('lance')}
  else{fireCd=0.14;flash=0.06;recoil=1;heat+=9;sfx('shoot');if(heat>=100){heat=100;over=true;say('Overheated',1.2);sfx('over')}}
  sinceFire=0;
  const dx=Math.cos(pa),dy=Math.sin(pa),plx=-dy*PLANE,ply=dx*PLANE,inv=1/(plx*dy-dx*ply);
  let hit=null,hd=1e9;const all=[];
  for(const e of enemies){if(e.dying)continue;const sx=e.x-px,sy=e.y-py,tx=inv*(dy*sx-dx*sy),ty=inv*(-ply*sx+plx*sy);
    if(ty<0.15||ty>zbuf[W>>1]+0.3)continue;
    const scr=W/2*(1+tx/ty),half=PROJ/ty*ESC[e.type]*0.42+3;
    if(Math.abs(scr-W/2)<half){all.push(e);if(ty<hd){hit=e;hd=ty}}}
  if(lance)for(const e of all)damage(e,6);else if(hit)damage(hit,1);
}
function grenade(){if(state!=='playing'||grenCd>0)return;grenCd=7;const c=Math.cos(pa),s=Math.sin(pa);
  grenades.push({x:px+c*0.3,y:py+s*0.3,vx:c*9,vy:s*9,t:0.75});sfx('swap')}
function explode(x,y){blasts.push({x,y,t:0});sfx('boom');if(!reduced)shake=Math.max(shake,0.12);
  for(const e of enemies){const d=Math.hypot(e.x-x,e.y-y);if(d<2.5&&los(x,y,e.x,e.y))damage(e,d<1.3?6:3)}}
function melee(){if(state!=='playing'||meleeCd>0)return;meleeCd=1.1;meleeA=0.2;sfx('melee');const c=Math.cos(pa),s=Math.sin(pa);
  for(const e of enemies){const ex=e.x-px,ey=e.y-py,d=Math.hypot(ex,ey)||1;
    if(d<1.5&&(ex*c+ey*s)/d>0.5){damage(e,4);moveBody(e,ex/d*0.6,ey/d*0.6,0.25)}}}
function surge(){if(state!=='playing'||superQ<100)return;superQ=0;novaA=1;shield=100;shots=[];say('Bloom surge',1.5);sfx('nova');
  for(const e of enemies)if(Math.hypot(e.x-px,e.y-py)<9&&los(px,py,e.x,e.y))damage(e,12)}
function swap(w){if(state!=='playing'||time-swapT<0.25)return;swapT=time;weapon=w===undefined?1-weapon:w;
  fireCd=Math.max(fireCd,0.3);sfx('swap');say(weapon?'Thorn lance':'Arc welder',0.7)}
function hurt(n){shDelay=3.5;if(shield>0){shield-=n;if(shield<0){hp+=shield;shield=0}}else hp-=n;
  hurtA=1;shake=reduced?0:0.2;sfx('hurt');if(hp<=0){hp=0;die()}}

""")
rep("if((firing||keys.Space)&&fireCd<=0&&!over)fire();","if((firing||keys.Space)&&fireCd<=0&&(weapon===1||!over))fire();")
rep("  if(over&&heat<30)over=false;","""  if(over&&heat<30)over=false;
  shDelay-=dt;if(shDelay<=0&&shield<100)shield=Math.min(100,shield+40*dt);
  grenCd=Math.max(0,grenCd-dt);meleeCd=Math.max(0,meleeCd-dt);meleeA=Math.max(0,meleeA-dt);novaA=Math.max(0,novaA-dt*1.6);
  for(let i=grenades.length-1;i>=0;i--){const g=grenades[i];g.t-=dt;const nx=g.x+g.vx*dt,ny=g.y+g.vy*dt;
    let boom=g.t<=0||solid(nx,ny);
    if(!boom){g.x=nx;g.y=ny;for(const e of enemies)if(!e.dying&&Math.hypot(e.x-nx,e.y-ny)<0.5){boom=true;break}}
    if(boom){grenades.splice(i,1);explode(g.x,g.y)}}
  for(let i=blasts.length-1;i>=0;i--){blasts[i].t+=dt;if(blasts[i].t>0.28)blasts.splice(i,1)}""")
rep("hp=Math.min(100,hp+10)}}","hp=Math.min(100,hp+10);ammo=Math.min(24,ammo+3)}}")
between("    let tx=dx,ty=dy,go=true;","    if(go){const tl=","""    let tx=dx,ty=dy,go=true;
    if(!see||d>8){const c=(e.y|0)*MW+(e.x|0);let bd=flow[c]<0?999:flow[c],bn=-1;
      for(const n of[c-1,c+1,c-MW,c+MW])if(flow[n]>=0&&flow[n]<bd){bd=flow[n];bn=n}
      if(bn>=0){tx=(bn%MW)+.5-e.x;ty=((bn/MW)|0)+.5-e.y}}
    else if(e.type!==1&&d>2){const w=Math.sin(time*2.2+e.ph)*0.8;tx=dx/d-dy/d*w;ty=dy/d+dx/d*w}
    e.cd-=dt;
    if(e.type===1){if(see&&d<9){
        if(d<3){tx=-dx;ty=-dy}else if(d<6){tx=-dy*e.ph;ty=dx*e.ph}
        if(e.cd<=0){e.cd=Math.max(1,1.9-wave*0.05);shots.push({x:e.x,y:e.y,vx:dx/d*5,vy:dy/d*5});sfx('spit')}}}
    else{const big=e.type===2;if(d<(big?1:0.75)){go=false;if(e.cd<=0){e.cd=big?1.2:1;hurt(big?16:6)}}}
""")
between("  for(let i=pickups.length-1","/* ---------- render ---------- */","""  for(let i=pickups.length-1;i>=0;i--){const p=pickups[i];if(Math.hypot(p.x-px,p.y-py)>0.5)continue;
    if(p.k===0&&hp<100){hp=Math.min(100,hp+25);say('Hull patched',1)}
    else if(p.k===1&&ammo<24){ammo=Math.min(24,ammo+4);say('Lance cells',1)}else continue;
    pickups.splice(i,1);sfx('pick')}
}

""")

# ---- render
between("  for(const e of enemies){const k=e.dying?","  for(const s of list)s.d=","""  for(const e of enemies){const k=e.dying?1-e.dying/0.25:1,f=e.flash>0||e.dying>0;
    if(e.type===1)list.push({x:e.x,y:e.y,t:SPR.seeder,s:0.8*k,v:0.1,f});
    else if(e.type===2)list.push({x:e.x,y:e.y,t:SPR.warden,s:1.05*k,v:Math.sin(time*3+e.ph)*0.03,f});
    else list.push({x:e.x,y:e.y,t:SPR.drone[(time*14+e.ph|0)&1],s:0.6*k,v:Math.sin(time*5+e.ph)*0.04,f})}
  for(const s of shots)list.push({x:s.x,y:s.y,t:SPR.spore,s:0.22,v:0.02,f:false,glow:true});
  for(const p of pickups)list.push({x:p.x,y:p.y,t:p.k?SPR.cell:SPR.gel,s:0.36,v:0.32+Math.sin(time*3)*0.02,f:false});
  for(const g of grenades)list.push({x:g.x,y:g.y,t:SPR.charge,s:0.18,v:0.05,f:false,glow:true});
  for(const b of blasts)list.push({x:b.x,y:b.y,t:SPR.blast,s:0.5+b.t*6,v:0,f:false,glow:true});
""")
rep("ctx.fillStyle=e.type?'#ff4fa3':'#ffb238';","ctx.fillStyle=e.type===2?'#c9a6ff':e.type?'#ff4fa3':'#ffb238';")
between("  // welder","function hud(){","""  // weapon
  const bo=reduced?0:1,lance=weapon===1,sw=meleeA>0?Math.sin(meleeA/0.2*Math.PI):0;
  const bx=Math.round(W*0.62+Math.sin(bob)*3*bo-sw*W*0.2),by=Math.round(H-44+Math.abs(Math.cos(bob))*3*bo+recoil*5-sw*14);
  if(flash>0){ctx.strokeStyle=lance?'#e3d2ff':'#c9fbff';ctx.lineWidth=lance?4:2;ctx.beginPath();ctx.moveTo(bx+15,by-6);ctx.lineTo(cx,cy);ctx.stroke();
    ctx.fillStyle='#ffffff';ctx.fillRect(bx+8,by-13,14,10)}
  ctx.fillStyle='#16272a';ctx.fillRect(bx,by+14,34,60);
  if(lance){ctx.fillStyle='#3b2466';ctx.fillRect(bx+6,by-10,18,44);ctx.fillStyle='#57349a';ctx.fillRect(bx+6,by-10,4,44);
    ctx.fillStyle='#c9a6ff';for(let i=0;i<Math.min(ammo,6);i++)ctx.fillRect(bx+13,by+24-i*5,8,3);
    ctx.fillStyle='#ffb238';ctx.fillRect(bx+10,by-14,10,5)}
  else{ctx.fillStyle='#3d5b60';ctx.fillRect(bx+4,by,22,34);
    ctx.fillStyle='#5a7f85';ctx.fillRect(bx+4,by,4,34);
    ctx.fillStyle='#ffb238';ctx.fillRect(bx+4,by+24,22,3);
    ctx.fillStyle=`rgb(${80+heat*1.75|0},${205-heat|0},${195-heat*1.5|0})`;ctx.fillRect(bx+9,by-7,12,10)}
  if(sw>0){ctx.strokeStyle=`rgba(220,235,228,${sw})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy+H*0.5,H*0.55,-2.2,-0.9);ctx.stroke()}
  if(novaA>0){ctx.fillStyle=`rgba(255,170,215,${novaA*0.75})`;ctx.fillRect(0,0,W,H)}
}

""")
between("function hud(){","let last=performance.now();","""function chip(id,v){const c=$(id);c.classList.toggle('ready',v>=1);c.querySelector('i').style.width=Math.max(0,Math.min(1,v))*100+'%'}
function hud(){
  $('wave').textContent=Math.max(wave,1);$('score').textContent=score.toLocaleString();
  $('sh').firstElementChild.style.width=shield+'%';
  $('hp').firstElementChild.style.width=hp+'%';
  $('hp').firstElementChild.style.background=hp<30?'var(--hurt)':'var(--leaf)';
  const lance=weapon===1,hb=$('heat');$('wname').textContent=lance?'LANCE':'ARC';
  hb.firstElementChild.style.width=(lance?ammo/24*100:heat)+'%';hb.classList.toggle('over',!lance&&over);hb.classList.toggle('lance',lance);
  $('ammo').textContent=lance?ammo:'';
  chip('cG',1-grenCd/7);chip('cM',1-meleeCd/1.1);chip('cS',superQ/100);
  $('hurt').style.opacity=Math.max(hurtA,hp<30&&state==='playing'?0.25:0);
}

""")
open(p,'w').write(s)
