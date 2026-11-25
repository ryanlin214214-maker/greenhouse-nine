# v93 G1: a calmer flight HUD. Centre kept clear (announcements sit high and small in flight, the radio box moves up
# under the shield bars so it never meets the speed block), new objectives show large for a few seconds then settle,
# target brackets: at most 8 full brackets (nearest), the rest small, faded when near the crosshair, details only on the
# locked target (name, distance, hull, shield); marked targets gold. Settings: HUD size and marker opacity.
import sys
s=open(sys.argv[1]).read()
def R(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:100]);s=s.replace(a,b)
css='''
.stage.flying .comms{top:64px;bottom:auto;left:10px;width:min(34%,360px)}
.stage.flying .msg{top:18%;font-size:clamp(11px,1.3vw,14px);letter-spacing:.14em}
.obj #objT{transition:font-size .5s,background .5s,box-shadow .5s}
.obj.fresh #objT{font-size:15px;background:rgba(6,14,18,.82);box-shadow:0 0 0 1px rgba(255,210,122,.45)}
.stage.flying .obj:not(.fresh){opacity:.8}
.fhud .tg{opacity:var(--mko,1);transition:opacity .2s}
.fhud .tg.near{opacity:calc(var(--mko,1)*.35)}
.fhud .tg.far{width:12px;height:12px;margin:-6px 0 0 -6px;border-width:1px;box-shadow:none}
.fhud .tg.far i{display:none}
.fhud .tg.mk{border-color:#ffd27a}
.fhud .tg.mk i{color:#ffd27a}
.fhud .tg.lk i{line-height:1.3;text-align:center}
.fhud .tg.lk i u{display:block;text-decoration:none;font-size:8px;color:#ffe2b0;opacity:.9}
.fhud .tg.lk i s{display:block;width:44px;height:3px;margin:2px auto 0;background:rgba(0,0,0,.6);text-decoration:none}
.fhud .tg.lk i s b{display:block;height:100%;background:#ff7a5a}
.fhud .tg.lk i s b.sh{background:#6fd8ff}
.fhud #fnav,#wp{opacity:var(--mko,1)}
.fhud .fbar{scale:var(--hudk,1);transform-origin:bottom center}
.fhud .fshl{scale:var(--hudk,1);transform-origin:top left}
#hud{scale:var(--hudk,1);transform-origin:top left}
'''
R("</style>",css+"</style>",1) if s.count("</style>")==1 else None
if s.count(css)==0:
    i=s.find("</style>");s=s[:i]+css+s[i:]
# objectives: large for 3.5 s when they change, then compact
R("function setObj(t,frac){$('obj').hidden=false;$('objT').textContent=t;",
  "function setObj(t,frac){$('obj').hidden=false;if($('objT').textContent!==t){const o=$('obj');o.classList.add('fresh');clearTimeout(o._ft);o._ft=setTimeout(()=>o.classList.remove('fresh'),3500)}$('objT').textContent=t;")
# brackets
R("for(const e of S.en){if(e.kind==='mine'&&e.p.distanceTo(S.pos)>500)continue;fv1.copy(e.p).project(cam);",
  "const NEAR=S.en.filter(e=>e.kind!=='mine').map(e=>[e,e.p.distanceToSquared(S.pos)]).sort((a,b)=>a[1]-b[1]).slice(0,8).map(q=>q[0]);for(const e of S.en){if(e.kind==='mine'&&e.p.distanceTo(S.pos)>500)continue;fv1.copy(e.p).project(cam);")
R("d.classList.toggle('lk',lk);d.firstChild.textContent=(lk?(S.lockP>=.6?'LOCK ':'... '):'')+Math.round(e.p.distanceTo(S.pos))+' M';k++}",
  "d.classList.toggle('lk',lk);const sx=(fv1.x*.5+.5)*W,sy=(-fv1.y*.5+.5)*H,cd=Math.hypot(sx-W/2,sy-H/2);d.classList.toggle('near',!lk&&cd<90);d.classList.toggle('far',!lk&&!NEAR.includes(e));d.classList.toggle('mk',e.mark>0);"
  "if(lk){const nm={int:'INTERCEPTOR',gun:'GUNBOAT',ace:'ACE',pod:'BOARDING POD',ebm:'BOMBER',eion:'ION SHIP',mine:'MINE'}[e.kind]||String(e.kind).toUpperCase();d.firstChild.innerHTML=(S.lockP>=(S.ship.lockT||.6)?'LOCK ':'... ')+Math.round(e.p.distanceTo(S.pos))+' M<u>'+nm+(e.mark>0?' · MARKED':'')+'</u><s><b style=\"width:'+Math.max(0,Math.round(e.hp/e.max*100))+'%\"></b></s>'+(e.shp>0?'<s><b class=\"sh\" style=\"width:'+Math.round(e.shp/(e.kind==='eion'?60:40)*100)+'%\"></b></s>':'')}"
  "else d.firstChild.textContent=Math.round(e.p.distanceTo(S.pos))+' M';k++}")
# flying class on the stage (radio box and announcements move out of the centre)
R("let nv=$('fnav');","stage.classList.add('flying');let nv=$('fnav');")
# settings: HUD size and marker opacity
R('<label for="setAdsT">','<label for="setHud">HUD size <input id="setHud" type="range" min="0.75" max="1.3" step="0.05"></label>\n    <label for="setMko">Marker opacity <input id="setMko" type="range" min="0.3" max="1" step="0.05"></label>\n    <label for="setAdsT">')
R("$('setSens').value=CFG.sens;","$('setSens').value=CFG.sens;$('setHud').value=CFG.hudk||1;$('setMko').value=CFG.mko||1;stage.style.setProperty('--hudk',CFG.hudk||1);stage.style.setProperty('--mko',CFG.mko||1);")
R("$('setSens').addEventListener('input',e=>{CFG.sens=+e.target.value;applyCfg()});",
  "$('setSens').addEventListener('input',e=>{CFG.sens=+e.target.value;applyCfg()});$('setHud').addEventListener('input',e=>{CFG.hudk=+e.target.value;stage.style.setProperty('--hudk',CFG.hudk);applyCfg()});$('setMko').addEventListener('input',e=>{CFG.mko=+e.target.value;stage.style.setProperty('--mko',CFG.mko);applyCfg()});")
R('function flyExit(){fcReset();','function flyExit(){fcReset();stage.classList.remove(\'flying\');')
open(sys.argv[2],'w').write(s);print('p106 ok')
