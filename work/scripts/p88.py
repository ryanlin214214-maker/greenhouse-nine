import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)

# one distance on screen: the objective shows the walking distance the waypoint uses
rep("go=C&&!inA&&!b?'GO TO '+C.area+' · '+Math.round(Math.hypot(pos.x-C.at[0],pos.z-C.at[1]))+' M · ':'';",
    "go=C&&!inA&&!b?'GO TO '+C.area+' · '+Math.round(WPR.tk===C.at[0]+','+C.at[1]&&WPR.d?WPR.d:Math.hypot(pos.x-C.at[0],pos.z-C.at[1]))+' M · ':'';")
rep("function wpRoute(tx,tz,lab){if(!NAV)navBuild();", "function wpRoute(tx,tz,lab){if(!NAV)navBuild();WPR.tk=tx+','+tz;")
# Lattice: the walk to the bridge gets the waypoint too
rep("  setObj(L.ph==='go'?'LATTICE · GO TO THE BRIDGE · '+Math.round(d)+' M'",
    "  if(L.ph==='go')try{wpRoute(0,-217,'BRIDGE');WPR.live=true}catch(e){}\n  setObj(L.ph==='go'?'LATTICE · GO TO THE BRIDGE · '+Math.round(WPR.tk==='0,-217'&&WPR.d?WPR.d:d)+' M'")
# Meridian: name tags over the counters, your ship and the mission board, with distance, when on screen
rep("HUB.near=nr;const el=$('veh');", "HUB.near=nr;try{hubTags()}catch(e){}const el=$('veh');")
HT = r"""const HTN={w:'WEAPONS · HOLLIS',a:'ARMOUR · INES',s:'SHIPS · TEO',x:'YOUR SHIP',mb:'MISSION BOARD'},_htv=new T.Vector3();let HTAG=null;
function hubTags(){if(!HTAG){HTAG=HUB.pts.map(q=>{const d=document.createElement('div');d.className='htag';d.hidden=true;stage.appendChild(d);return d})}
  const W=stage.clientWidth,H=stage.clientHeight,on=HUB.on&&state==='playing';HUB.pts.forEach((q,i)=>{const el=HTAG[i];const d=Math.hypot(pos.x-q.x,pos.z-q.z);
    if(!on||d<q.r||d>140){el.hidden=true;return}_htv.set(q.x,q.k==='x'?6:3.4,q.z).project(cam);const vis=_htv.z<1&&Math.abs(_htv.x)<.95&&Math.abs(_htv.y)<.9;el.hidden=!vis;
    if(vis){el.style.left=((_htv.x*.5+.5)*W)+'px';el.style.top=((-_htv.y*.5+.5)*H)+'px';el.textContent=HTN[q.k]+' · '+Math.round(d)+' M'}})}
function hubTagsOff(){if(HTAG)for(const e of HTAG)e.hidden=true}
"""
a = "const _hv=new T.Vector3();function hubTick(dt){"
i = s.index(a); s = s[:i] + HT + s[i:]
rep("#wp{position:absolute;", ".htag{position:absolute;transform:translate(-50%,-100%);pointer-events:none;z-index:5;font:700 10px var(--display);letter-spacing:.12em;color:#f4ead2;background:rgba(6,14,18,.6);border:1px solid rgba(201,162,74,.7);padding:2px 7px;border-radius:2px;white-space:nowrap}\n#wp{position:absolute;")
rep("function hubTick(dt){if(!HUB.on)return;", "function hubTick(dt){if(!HUB.on){hubTagsOff();return}")
# the stage-complete card was hidden under the black fade (fade z-index 4 over the overlay): the fade now sits in the page
# right under the overlay with no z-index, so it still covers the view and HUD but never the card or the menus
rep("function fadeSet(v){const d=fcEl('fadeL',FADECSS);", "function fadeUnder(d){if(d.style.zIndex)d.style.zIndex='';if(d.nextSibling!==overlay&&overlay.parentElement===d.parentElement)d.parentElement.insertBefore(d,overlay);return d}\nfunction fadeSet(v){const d=fadeUnder(fcEl('fadeL',FADECSS));")
rep("function fade(v,sec){const d=fcEl('fadeL',FADECSS);", "function fade(v,sec){const d=fadeUnder(fcEl('fadeL',FADECSS));")
rep(".htag{position:absolute;", ".stage:has(> #overlay:not([hidden])) :is(#fhud,#hud,#obj,#wp,.htag){visibility:hidden}\n.htag{position:absolute;")
open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))
