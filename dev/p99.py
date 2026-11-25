import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)
# ---- v91: Mission 3 (Level 3: First Strike, The Heart, Shot Down) and Mission 4 (Level 4: Europa crash landing)
L3 = open('lvl3a.js').read()+'\n'+open('lvl3b.js').read()+'\n'+open('lvl3c.js').read()+'\n'+open('lvl3d.js').read()+'\n'+open('dark2.js').read()+'\n'
a = "function hubUse(){"
i = s.index(a); s = s[:i] + L3 + s[i:]
rep("if(st===4){meriSortie(S);return}", "if(st>30){l3Start(S,st);return}if(st===4){meriSortie(S);return}")
rep("function meriScript(S,dt){if(S.stage!==4||", "function meriScript(S,dt){if((S.stage!==4&&!S.l3to)||")
rep("if(meriScript(S,dt))return;", "if(meriScript(S,dt)||l3Script(S,dt))return;")
rep("else if(S.stage===4){stage4Tick(S,dt)}else{", "else if(S.stage===4){stage4Tick(S,dt)}else if(S.stage>30){if(l3Tick(S,dt))return}else{")
rep("LIM=S.stage===3?30000:15000", "LIM=S.stage===3||S.stage>30?40000:15000")
rep("if(k==='out'||k==='land'){flyStageDone();return true}", "if(k==='out'||k==='land'){if(S.stage>30){l3FcDone(S,k);return true}flyStageDone();return true}")
rep("function flyExit(){fcReset();if(!FLY)return;const S=FLY;", "function flyExit(){fcReset();if(!FLY)return;const S=FLY;if(S.l3)try{l3Clear(S)}catch(e){console.error(e)}")
rep("function flyMissile(){const S=FLY;", "function flyMissile(){const S=FLY;if(S&&S.nukeArm&&l3Nuke(S))return;")
rep("if(hp<=0){hp=0;die()}", "if(FLY&&FLY.noDie&&hp<FLY.noDie){hp=FLY.noDie;FLY.floorHit=1}if(hp<=0){hp=0;die()}")
rep("LAST={m:2,s:FLY.stage}}else LAST={m:1,s:Math.max(1,wave)};$('retry').hidden=false;$('retry').textContent='Retry stage '+LAST.m+'-'+LAST.s}",
    "LAST={m:2,s:FLY.stage}}else LAST={m:1,s:Math.max(1,wave)};if(FLY&&FLY.l3)LAST={m:FLY.stage===41?5:4,s:FLY.stage===41?1:FLY.stage===31?1:3};else if(typeof CMD!=='undefined'&&CMD.on){LAST={m:4,s:2};$('ovTitle').textContent='Down on the command ship'}$('retry').hidden=false;$('retry').textContent='Retry stage '+(LAST.m===4?'3-'+LAST.s:LAST.m===5?'4-1':LAST.m+'-'+LAST.s)}")
rep("function startAt(m,s,skip){LAST={m,s};NOSAVE=false;HUBNEXT=false;", "function startAt(m,s,skip){LAST={m,s};NOSAVE=false;HUBNEXT=false;L3NEXT=null;if(m===4||m===5){l3StartAt(m,s);return}")
rep("$('go').addEventListener('click',()=>{if(HUBNEXT){", "$('go').addEventListener('click',()=>{if(L3NEXT){l3Go();return}if(HUBNEXT){")
rep("{n:'Meridian Station',st:[{m:3,s:1,t:'The Concourse',d:'Hub · weapon, armour and ship shops · spend credits',ready:true}]}];",
    "{n:'Meridian Station',st:[{m:3,s:1,t:'The Concourse',d:'Hub · weapon, armour and ship shops · spend credits',ready:true}]},"
    "{n:'Mission 3 · The Wellmonger\\'s Fleet',st:[{m:4,s:1,l:'3-1',t:'First Strike',d:'Leave Meridian · the Nova warhead · the fleet jumps in · land on the command ship',ready:true},"
    "{m:4,s:2,l:'3-2',t:'The Heart',d:'On foot inside the command ship · plant the charge · run',ready:true},{m:4,s:3,l:'3-3',t:'Shot Down',d:'Escape the blast · nine on your tail · the second ace',ready:true}]},"
    "{n:'Mission 4 · Europa',st:[{m:5,s:1,l:'4-1',t:'Crash Landing',d:'Dead engines · retro thrusters · the ice',ready:true}]}];")
rep("const done=S.m===1?SAVE&&SAVE.wave>=S.s:M2>=S.s;b.innerHTML='<b>'+S.m+'-'+S.s+'</b>'", "const done=S.m===1?SAVE&&SAVE.wave>=S.s:S.m>=4?M3>=(S.m===5?4:S.s):M2>=S.s;b.innerHTML='<b>'+(S.l||S.m+'-'+S.s)+'</b>'")
rep("function reset(){pos.set(0,0,24);", "function reset(){try{cmdLeave()}catch(e){}pos.set(0,0,24);")
rep("function hubEnter(){hubBuild();", "function hubEnter(){try{cmdLeave()}catch(e){}hubBuild();")
rep("hubTick(dt);const R=Math.min(150", "hubTick(dt);try{cmdTick(dt)}catch(e){window.__l3err=String(e.stack||e);console.error(e)}const R=Math.min(150")
rep("function toggleVeh(){if(FLY)return;", "function toggleVeh(){if(FLY||CMD.on)return;")
rep("function atmoTick(dt){", "function atmoTick(dt){if(typeof CMD!=='undefined'&&CMD.on)return;")
rep("FAR.add(pg);", "FAR.add(pg);FARX.eur=pg;")
rep("if(HUB.myShip)HUB.myShip.visible=false;\n  FAR.rotation.set(-2.529", "if(HUB.myShip)HUB.myShip.visible=false;if(HUB.ysign)for(const o of HUB.ysign)o.visible=false;\n  FAR.rotation.set(-2.529")
rep("function hubEnter(){try{cmdLeave()}catch(e){}hubBuild();", "function hubEnter(){try{cmdLeave()}catch(e){}hubBuild();if(HUB.ysign)for(const o of HUB.ysign)o.visible=true;")
rep("$('wave').textContent=Math.max(wave,1);", "$('wave').textContent=typeof CMD!=='undefined'&&CMD.on?'3-2':Math.max(wave,1);")
rep("else if(typeof CMD!=='undefined'&&CMD.on){LAST={m:4,s:2};$('ovTitle').textContent='Down on the command ship'}", "else if(typeof CMD!=='undefined'&&CMD.on){LAST={m:4,s:2};$('ovTitle').textContent='Down on the command ship';$('ovText').textContent='You fell aboard the Wellmonger\\'s command ship. Retry puts you and Rowan back in the bay.'}")
rep("function continueGame(){if(contM2()){startAt(2,M2+1);return}", "function continueGame(){if(contM3()){startAt(M3===3?5:4,M3===3?1:M3+1);return}if(contM2()){startAt(2,M2+1);return}")
rep("b.hidden=!(SAVE||contM2())||state==='paused';if(contM2())", "b.hidden=!(SAVE||contM2()||contM3())||state==='paused';if(contM3())b.textContent='Continue · '+(M3===3?'Level 4, Europa':'Mission 3, stage 3-'+(M3+1));else if(contM2())")
rep("else if(type>=5&&type<=8||type>=10)rig=walkerRig(g,type-5);", "else if(type>=13){rig=walkerRig(g,type===13?2:1);if(type<15)darkify(rig,type)}else if(type>=5&&type<=8||type>=10)rig=walkerRig(g,type-5);")
rep("for(const e of enemies){if(e.dying)continue;const ox=e.pos.x-o[0],oy=e.pos.y-o[1],oz=e.pos.z-o[2]", "for(const e of enemies){if(e.dying)continue;const ox=e.pos.x-o[0],oy=e.pos.y+(e.hy||0)-o[1],oz=e.pos.z-o[2]")
import base64 as _b
_bin=_b.b64encode(open('lat/lat.bin','rb').read()).decode();_js=open('lat/lat.json').read()
rep('<script type="application/json" id="vclips">', '<script type="text/plain" id="latbin">'+_bin+'</script>\n<script type="application/json" id="latjson">'+_js+'</script>\n<script type="application/json" id="vclips">')
open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))
