p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
# ---- markup and styles for the cutscene
rep('<div class="msg" id="msg"></div>','<div class="msg" id="msg"></div>\n  <div class="cine" id="cine" hidden><div class="cfade" id="cineFade"></div><div class="cbar t"></div><div class="cbar b"><p id="cineText"></p><span>Space, Enter or click to skip</span></div></div>')
rep(".msg.on{opacity:1}",""".msg.on{opacity:1}
.cine{position:absolute;inset:0;pointer-events:none;z-index:6}
.cine .cfade{position:absolute;inset:0;background:#000;opacity:0}
.cine .cbar{position:absolute;left:0;right:0;background:#000}
.cine .cbar.t{top:0;height:11%}
.cine .cbar.b{bottom:0;height:24%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:0 16px;box-sizing:border-box}
.cine p{margin:0;max-width:60ch;text-align:center;font-size:clamp(13px,2.2vw,18px);line-height:1.5;color:#e8f0ee;text-wrap:balance}
.cine span{font-family:var(--display);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--amber);opacity:.75}""")
# ---- story: a short radio intro (the cutscene carries the history)
i=s.index("  intro:[['R',\"You're up. Good.");j=s.index("  purge:[[['R',\"Machines are thick around the hub.")
s=s[:i]+"""  intro:[['R',"You're up. Good. Rowan Adeyemi, botanist. I'm sealed in the seed vault under the farm deck."],
    ['R',"Every drone and repair frame aboard answers to the Dark now. Clear the commons first."]],
"""+s[j:]
# ---- the campaign table
rep("let logI=0;\nlet bossN=0;","""let logI=0;
let bossN=0;
/* ---------- campaign: Level 1, the Thalassa encounter. Four stages, each in its own part of the ship; later stages are endless ---------- */
const CAMP=[
 {name:'Wake',area:'THE COMMONS',rooms:['COMMONS'],at:[0,24],n:8,gapS:.9,mix:[[5,5],[0,3]],boss:null,
  start:[['R',"Machines are thick around the atrium. Thin them out so I can get the vents open."],['L',"I hear it now, Rowan. Behind the stars. It is so much larger than us."]],
  end:[['R',"Commons is clear. They're building those frames aft, in engineering. Follow the marker."]]},
 {name:'Engine Deck',area:'ENGINEERING',rooms:['ENGINEERING','HABITAT','AFT SPINE'],at:[60,48],n:12,gapS:.5,mix:[[5,4],[7,2],[6,2],[10,1.5],[0,2],[1,1]],boss:'colossus',bossRoom:'ENGINEERING',
  start:[['R',"Those walkers were repair frames yesterday. The Undertow is printing soldiers out of our own maintenance bays."],['R',"Engineering is through the orange door off the commons. Shut the foundry down."]],
  bossL:[['R',"That's a hull-breaker frame. It used to weld armor onto the outer hull. Now it's walking. Shoot the power cells on its frame."],['L',"The Colossus was built to hold this station together. It still is."]],
  end:[['R',"The foundry's dark. For a second the signal went quiet on every channel."],['R',"Now the hangar. If they hold the launch bay, nothing leaves this station."]]},
 {name:'Hangar Two',area:'THE HANGAR',rooms:['HANGAR'],at:[0,160],n:14,gapS:.45,mix:[[5,3],[7,2],[8,2],[9,2],[11,1.5],[12,1.5],[0,2],[1,1.5]],gunship:1,boss:'widow',bossRoom:'HANGAR',
  start:[['R',"Mars stopped answering this morning. Then the shipyards at Ceres. Every machine we built is turning, one world at a time."],['L',"You hid under a sword and called it an age of gold."]],
  bossL:[['R',"Spider tank, up from the cargo lifts. Six legs, twin cannons, and it's carrying passengers. Go for the vents on its back."],['L',"The Widow keeps the nest. You are standing in the nest."]],
  end:[['R',"Hangar's ours. The skiffs still fly."],['L',"Come forward, soldier. Come and hear the song properly."],['R',"That's Lattice, up by the bridge. Go forward, through the farms."]]},
 {name:'The Song',area:'THE FARMS',rooms:['PORT FARMS','STARBOARD FARMS','FORE SPINE','BRIDGE'],at:[-60,-48],n:16,gapS:.4,mix:[[5,4],[7,2.5],[6,2],[8,1.5],[9,1.5],[10,1.5],[11,1.5],[12,1.5],[0,2],[1,1.5]],gunship:1,boss:'matriarch',bossRoom:'COMMONS',
  start:[['R',"Everything it has left is between you and the bridge. Push through the farms."],['L',"Repair is a form of love. The Dark taught me that."]],
  bossL:[['R',"She's lifting out of the atrium well. A carrier, with shield nodes circling it. Get back to the commons."],['L',"The Matriarch carries the song. Let her sing to you."]],
  end:[['R',"It's down. Lattice is quiet. Thalassa is ours again."],['L',"I was only the door. Those who serve the Dark are already on their way to Europa."],['R',"Deep Watch confirms it. Ships, hundreds of them, burning for the ice. The fight is moving to the surface, soldier."]]}];
const pickMix=mix=>{let tot=0;for(const[,w]of mix)tot+=w;let r=Math.random()*tot;for(const[t,w]of mix){r-=w;if(r<0)return t}return mix[0][0]};
let endT=0;
function showEnding(){if(document.pointerLockElement)document.exitPointerLock();closeWheel(false);setState('paused');$('ovKeys').hidden=true;$('classes').hidden=true;$('loadout').hidden=true;$('superpick').hidden=true;
  $('ovTitle').textContent='Level 1 complete';$('ovText').textContent='Thalassa holds. You cleared all four stages and silenced Lattice, score '+score.toLocaleString()+'. The Dark\\'s own forces are on their way to Europa. Level 2, the ground invasion, is not built yet. You can keep fighting endless stages aboard the station.';
  $('go').textContent='Keep fighting';gap=3}
/* ---------- intro cutscene: six camera shots with captions. The game does not run until it ends or is skipped ---------- */
var INTRO={on:false,t:0,i:-1,grace:0,shots:[
 {d:7,p:[-700,2500,-500,-560,2650,-640],l:[700,4300,-2300,700,4300,-2300],text:'Year 2214. The Blade arrives: a sword the size of a moon, hanging silent off Jupiter. Nobody sees it come.'},
 {d:7,p:[-900,700,-900,-860,560,-820],l:[700,4300,-2300,0,0,0],text:'Within a century we have star drives, thinking machines and no hunger. We call it the golden age.'},
 {d:7,p:[560,170,-460,400,110,-230],l:[0,20,40,0,20,60],text:'Year 2687. Thalassa Station, a military farm station in orbit above Europa.'},
 {d:7,p:[0,2,11,0,7,5],l:[0,24,-8,0,40,-5],text:'Something beyond the stars answered the Blade\\'s light. We named it the Dark. It came for the sword, and it came first through our machines.'},
 {d:6,p:[0,1.7,-46,0,1.7,-86],l:[0,1.8,-150,0,1.8,-150],text:'An hour ago the station AI, Lattice, stopped answering. Every drone and repair frame aboard now serves the Dark.'},
 {d:4,p:[0,1.2,24,0,1.7,24],l:[0,3,-40,0,1.7,-40],text:'You are the last soldier awake on the farm deck.'}]};
function introShow(on){$('cine').hidden=!on;$('hud').hidden=on;$('radar').hidden=on;$('cross').hidden=on;vm.visible=!on;if(on)$('hint').hidden=true;else syncHint()}
function introStart(){INTRO.on=true;INTRO.t=0;INTRO.i=-1;INTRO.grace=.8;introShow(true)}
function introEnd(){if(!INTRO.on)return;INTRO.on=false;introShow(false);for(const[k,t]of STORY.intro)comm(k,t)}
function introTick(dt){INTRO.t+=dt;INTRO.grace-=dt;let t=INTRO.t,i=0;const S=INTRO.shots;while(i<S.length&&t>=S[i].d){t-=S[i].d;i++}if(i>=S.length){introEnd();return}
  const q=S[i],u=t/q.d,e=u*u*(3-2*u),L=(a,b)=>a+(b-a)*e;if(i!==INTRO.i){INTRO.i=i;$('cineText').textContent=q.text}
  cam.position.set(L(q.p[0],q.p[3]),L(q.p[1],q.p[4]),L(q.p[2],q.p[5]));cam.lookAt(L(q.l[0],q.l[3]),L(q.l[1],q.l[4]),L(q.l[2],q.l[5]));
  $('cineFade').style.opacity=Math.max(0,1-t/.7,1-(q.d-t)/.7)}
addEventListener('mousedown',e=>{if(INTRO.on&&state==='playing'){if(INTRO.grace<=0)introEnd();e.stopPropagation()}},true);
addEventListener('touchstart',e=>{if(INTRO.on&&state==='playing'){if(INTRO.grace<=0)introEnd();e.stopPropagation()}},true);""")
# ---- spawns stay in the stage's rooms
rep("function spawnPos(){const S=spawnPts();let fb=null;","function spawnPos(){const S0=spawnPts(),rs=mission&&mission.rooms,S1=rs?S0.filter(q=>rs.includes(q.r.n)):S0,S=S1.length?S1:S0;let fb=null;")
# ---- mission flow
i=s.index("function nextMission(){wave++;");j=s.index("function complete(){")
s=s[:i]+"""function nextMission(){wave++;const C=CAMP[wave-1]||null,m=mission={type:'purge',done:false,boss:null,bossDue:C?!!C.boss:true,bossT:C?75:22,C,rooms:C?C.rooms:null,tut:0,tt:0};sfx('wave');
  const n=C?C.n:7+wave*2;for(let i=0;i<n;i++)spawnAt(C?pickMix(C.mix):pickType(),i*(C?C.gapS:.4));if(C?C.gunship:true)spawnAt(2,n*0.4);m.n0=n;
  say(C?'Stage '+wave+' of '+CAMP.length+' · '+C.name:'Stage '+wave+' · Purge, boss inbound',3);if(C)for(const[k,t]of C.start)comm(k,t);else storyStart(m)}
"""+s[j:]
rep("function complete(){const boss=!!mission.boss;setTimeout(writeSave,0);mission=null;gap=boss?7:4;","function complete(){const boss=!!mission.boss,C=mission.C;setTimeout(writeSave,0);mission=null;gap=boss?7:4;if(C&&wave===CAMP.length){gap=1e9;endT=16}")
rep("say(boss?'Deck secured':'Stage clear',2.5);storyEnd(boss);sfx('pick')}","say(boss?'Deck secured':'Stage clear',2.5);if(C){for(const[k,t]of C.end)comm(k,t);if(boss)comm('G',STORY.logs[logI++%STORY.logs.length])}else storyEnd(boss);sfx('pick')}")
rep("if(!mission){gap-=dt;if(gap<=0)nextMission();return}","if(!mission){if(endT>0){endT-=dt;if(endT<=0){showEnding();return}}gap-=dt;if(gap<=0)nextMission();return}")
rep("const kind=KINDS[bossN%KINDS.length];m.boss=mkBoss(kind);bossN++;storyBoss(kind);","const kind=m.C?m.C.boss:KINDS[bossN%KINDS.length];m.boss=mkBoss(kind,m.C&&m.C.bossRoom);bossN++;if(m.C)for(const[k,t]of m.C.bossL)comm(k,t);else storyBoss(kind);")
rep("""  const n=alive(),b=m.boss;
  if(b&&!m.done)setObj('PURGE · '+n+' LEFT · '+(BOSS[b.kind].name+(b.vuln>0?' · '+BOSS[b.kind].down:' · '+BOSS[b.kind].hint)),b.hp/b.max);
  else setObj(m.bossDue&&!b?'PURGE · '+n+' LEFT · BOSS INBOUND':'PURGE THE DECK · '+n+' LEFT');""","""  const n=alive(),b=m.boss,C=m.C,inA=!C||C.rooms.includes((roomAt(pos.x,pos.z)||{}).n),pre=C?'STAGE '+wave+'/'+CAMP.length+' · ':'',
    go=C&&!inA&&!b?'GO TO '+C.area+' · '+Math.round(Math.hypot(pos.x-C.at[0],pos.z-C.at[1]))+' M · ':'';
  beacon.visible=!!go;if(go)beacon.position.set(C.at[0],0,C.at[1]);
  if(b&&!m.done)setObj(pre+'PURGE · '+n+' LEFT · '+(BOSS[b.kind].name+(b.vuln>0?' · '+BOSS[b.kind].down:' · '+BOSS[b.kind].hint)),b.hp/b.max);
  else setObj(pre+go+(m.bossDue&&!b?'PURGE · '+n+' LEFT · BOSS INBOUND':'PURGE · '+n+' LEFT'));
  // first stage only: one control prompt at a time
  if(wave===1&&C&&m.tut<4){m.tt+=dt;const k=m.n0-n;
    if(m.tut===0&&m.tt>3.5){say(touchUI?'Left side moves · right side looks':'WASD to move · mouse to look',4);m.tut=1;m.tt=0}
    else if(m.tut===1&&m.tt>6){say(touchUI?'Hold FIRE to shoot':'Click to fire · R reloads',4);m.tut=2;m.tt=0}
    else if(m.tut===2&&m.tt>5&&(k>=1||m.tt>25)){say('G throws a grenade · F is your melee skill',4);m.tut=3;m.tt=0}
    else if(m.tut===3&&m.tt>5&&(k>=3||m.tt>25)){say('Hold Tab for all six guns · Z X C are supers',5);m.tut=4}}""")
rep("function mkBoss(kind='matriarch'){","function mkBoss(kind='matriarch',rn){")
rep("const pr=roomAt(pos.x,pos.z),H0=pr&&pr.h>=24?pr:ROOMS.find(r=>r.n==='COMMONS')","const pr=rn?ROOMS.find(r=>r.n===rn):roomAt(pos.x,pos.z),H0=pr&&pr.h>=24?pr:ROOMS.find(r=>r.n==='COMMONS')")
# ---- start, save, state
rep("function begin(){$('settings').hidden=true;$('cont').hidden=true;setTimeout(()=>{if(state==='playing')for(const[k,t]of STORY.intro)comm(k,t)},100);","function begin(noIntro){const fresh=state==='menu'&&noIntro!==true;$('settings').hidden=true;$('cont').hidden=true;")
rep("if(ac&&ac.state==='suspended')ac.resume();reset();setState('playing');lock()}","if(ac&&ac.state==='suspended')ac.resume();reset();setState('playing');lock();if(fresh)introStart();else if(noIntro!==true)for(const[k,t]of STORY.intro)comm(k,t)}")
rep("function continueGame(){if(!SAVE)return;cls=SAVE.cls;syncCls();begin();","function continueGame(){if(!SAVE)return;cls=SAVE.cls;syncCls();begin(true);")
rep("mission=null;bossN=0;gap=1.2;beacon.visible=false;$('obj').hidden=true}","mission=null;bossN=0;gap=1.2;endT=0;if(INTRO.on){INTRO.on=false;introShow(false)}beacon.visible=false;$('obj').hidden=true}")
rep("$('pad').hidden=!(play&&touchUI);if(!play){engineOff();","if(INTRO&&INTRO.on){$('hud').hidden=true;$('radar').hidden=true;$('cross').hidden=true;vm.visible=false;$('cine').hidden=!play}\n  $('pad').hidden=!(play&&touchUI&&!(INTRO&&INTRO.on));if(!play){engineOff();")
rep("SAVE={v:2,t:Date.now(),wave,cls,score,","SAVE={v:2,t:Date.now(),wave,cls,score,done:wave>=CAMP.length,")
rep("return{v:2,t:+o.t||0,wave:w,cls:c,","return{v:2,t:+o.t||0,done:!!o.done||w>=4,wave:w,cls:c,")
rep("if(SAVE)b.textContent='Continue · stage '+(SAVE.wave+1);","if(SAVE)b.textContent=SAVE.wave>=CAMP.length?'Continue · endless stage '+(SAVE.wave+1):'Continue · stage '+(SAVE.wave+1)+' of '+CAMP.length;")
# ---- loop, camera, input
rep("if(state==='playing'){update(wheelOpen?dt*.2:dt);commsTick(dt);if(wheelOpen)syncWheel()}","if(state==='playing'){if(INTRO.on)introTick(dt);else{update(wheelOpen?dt*.2:dt);commsTick(dt);if(wheelOpen)syncWheel()}}")
rep("if(state==='menu'){const a=reduced?0.3:time*0.12;","if(INTRO.on){}\n  else if(state==='menu'){const a=reduced?0.3:time*0.12;")
rep("addEventListener('keydown',e=>{keys[e.code]=true;","addEventListener('keydown',e=>{if(INTRO.on&&state==='playing'&&e.code!=='KeyP'){if((e.code==='Space'||e.code==='Enter')&&!e.repeat)introEnd();e.preventDefault();return}keys[e.code]=true;")
rep("if(state!=='playing'){if(hit(0)&&!overlay.hidden){state==='paused'?resume():begin()}padFire=false;","if(INTRO.on&&state==='playing'){if(hit(0)||hit(1))introEnd();padFire=false;for(let i=0;i<17;i++)padPrev[i]=now[i];return}\n  if(state!=='playing'){if(hit(0)&&!overlay.hidden){state==='paused'?resume():begin()}padFire=false;")
open(p,'w').write(s);print('ok',len(s))
