p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
rep('<div class="gorow"><button class="go" id="cont" type="button" hidden>Continue</button><button class="go" id="go" type="button">Start shift</button></div>','<div class="gorow"><button class="go" id="cont" type="button" hidden>Continue</button><button class="go" id="go" type="button">Start shift</button><button class="go" id="retry" type="button" hidden>Retry stage</button><button id="stagesBtn" type="button">Missions</button></div>\n    <div class="missions" id="missions" hidden></div>')
rep(".msg.on{opacity:1}",""".msg.on{opacity:1}
.missions{display:flex;flex-direction:column;gap:5px;width:100%;max-width:540px;max-height:36vh;overflow:auto;text-align:left;padding:2px}
.missions h4{margin:8px 0 2px;font-family:var(--display);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--amber)}
.missions button{display:flex;gap:10px;align-items:baseline;text-align:left;padding:6px 10px;font-size:11px;letter-spacing:.04em}
.missions button b{min-width:34px;color:var(--amber)}.missions button span{opacity:.7;margin-left:auto;font-size:10px}.missions button:disabled{opacity:.4;cursor:not-allowed}
.missions p{margin:0 0 4px;font-size:10px;line-height:1.4;opacity:.75}""")
rep("let SAVE=null,saveRef=null,saveBusy=false;","""let SAVE=null,saveRef=null,saveBusy=false,NOSAVE=false,LAST={m:1,s:1};
/* ---------- mission list: every stage can be started from the title screen. A stage jump starts a fresh run with a power-appropriate loadout and does not touch saved progress ---------- */
const MISSIONS=[{n:'Mission 1 · Thalassa Station',st:[
  {m:1,s:1,t:'Wake',d:'Commons · Rowan joins after a few kills',ready:true},{m:1,s:2,t:'Engine Deck',d:'Engineering · Colossus',ready:true},
  {m:1,s:3,t:'Hangar Two',d:'Hangar · Widow',ready:true},{m:1,s:4,t:'The Song',d:'Farms and bridge · Matriarch',ready:true}]},
 {n:'Mission 2 · Flight to Meridian Station',st:[
  {m:2,s:1,t:'Launch',d:'Shuttle · interceptors',ready:false},{m:2,s:2,t:'Rescue',d:'Halcyon under attack · pick up allies',ready:false},{m:2,s:3,t:'Run to Meridian',d:'500 mph · blockade',ready:false}]}];
function missionsBuild(){const el=$('missions');el.innerHTML='';const n=document.createElement('p');n.textContent='Pick any stage to start it now. A stage jump does not change your saved progress.';el.appendChild(n);
  for(const M of MISSIONS){const h=document.createElement('h4');h.textContent=M.n;el.appendChild(h);
    for(const S of M.st){const b=document.createElement('button');b.type='button';const done=SAVE&&S.m===1&&SAVE.wave>=S.s;b.innerHTML='<b>'+S.m+'-'+S.s+'</b>'+S.t+(done?' ✓':'')+'<span>'+(S.ready?S.d:'coming next')+'</span>';b.disabled=!S.ready;b.addEventListener('click',()=>startAt(S.m,S.s));el.appendChild(b)}}}
function startAt(m,s){LAST={m,s};NOSAVE=false;
  if(m===1){begin(s>1);if(s>1){NOSAVE=true;wave=s-1;guns=WPN.map((_,k)=>mkGun(k,Math.min(4,s-1),s));mission=null;gap=1.2;rowanJoin(true);say('Stage '+s+' · jump (not saved)',2)}}}""")
rep("function writeSave(){","function writeSave(){if(NOSAVE)return;")
rep("function syncCont(){const b=$('cont');b.hidden=!SAVE||state==='paused';","function syncCont(){missionsBuild();$('stagesBtn').hidden=state==='paused';if(state==='paused')$('missions').hidden=true;const b=$('cont');b.hidden=!SAVE||state==='paused';")
rep("$('go').addEventListener('click',()=>{state==='paused'?resume():begin()});","$('go').addEventListener('click',()=>{state==='paused'?resume():begin()});\n$('stagesBtn').addEventListener('click',()=>{$('missions').hidden=!$('missions').hidden});\n$('retry').addEventListener('click',()=>startAt(LAST.m,LAST.s));")
rep("function begin(noIntro){voicePrime();","function begin(noIntro){voicePrime();$('retry').hidden=true;$('missions').hidden=true;")
# die: retry button for the stage you were on
rep("$('go').textContent='New game';syncCont()}","$('go').textContent='New game';syncCont();LAST={m:1,s:Math.max(1,wave)};$('retry').hidden=false;$('retry').textContent='Retry stage 1-'+LAST.s}")
open(p,'w').write(s);print('ok')
