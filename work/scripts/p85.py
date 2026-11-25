import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()

def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)

# 1) a controls list in Settings, so people can see what every key does
CTRL = '''<h3 class="vh">Controls</h3>
    <div class="ctl">
      <h4>On foot</h4>
      <dl><dt>W A S D</dt><dd>Move (sprint is automatic; hold Shift if you turned that off)</dd><dt>Mouse</dt><dd>Look and aim</dd><dt>Left click</dt><dd>Fire</dd><dt>Right click</dt><dd>Aim down sights</dd>
      <dt>Space</dt><dd>Jump; again in the air for your class move</dd><dt>V</dt><dd>Slide while sprinting</dd><dt>R</dt><dd>Reload</dd><dt>1 to 6, scroll</dt><dd>Switch gun</dd><dt>Q</dt><dd>Swap to the last gun</dd>
      <dt>Hold Tab</dt><dd>Weapon and super wheel</dd><dt>G</dt><dd>Grenade (each gun has its own)</dd><dt>F</dt><dd>Melee (each gun has its own)</dd><dt>Z X C</dt><dd>Supers</dd><dt>H</dt><dd>Inspect your gun</dd><dt>E</dt><dd>Use: vehicles, shop counters, your ship, the mission board</dd></dl>
      <h4>Flying</h4>
      <dl><dt>Mouse</dt><dd>Steer (the ship turns toward where you aim)</dd><dt>W / S</dt><dd>Throttle up / down</dd><dt>A / D</dt><dd>Turn</dd><dt>Shift</dt><dd>Afterburner (automatic at full throttle if that is on)</dd><dt>Space</dt><dd>Brake</dd>
      <dt>Left click</dt><dd>Machine guns</dd><dt>G</dt><dd>Homing missile (lock a target first)</dd><dt>F</dt><dd>Heavy cannon</dd></dl>
      <h4>Menus</h4>
      <dl><dt>I</dt><dd>Loadout: guns, mods, armour, the weapon bench</dd><dt>P or Esc</dt><dd>Pause</dd><dt>O</dt><dd>Spectator mode (when enabled above)</dd></dl>
      <h4>At Meridian</h4>
      <dl><dt>E at a counter</dt><dd>Weapons (Hollis), Armour (Ines), Ships (Teo, in Hangar 0)</dd><dt>E at your ship</dt><dd>Take off. Fly back into Hangar 0 under 70 to land.</dd><dt>E at the board</dt><dd>Mission board, in the concourse hall</dd></dl>
      <p class="vnote">Controllers and phones are supported too.</p>
    </div>
    <h3 class="vh">Voices</h3>'''
rep('<h3 class="vh">Voices</h3>', CTRL)
rep("#settings .vnote{", "#settings .ctl h4{margin:10px 0 4px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;opacity:.75}#settings .ctl dl{display:grid;grid-template-columns:minmax(90px,auto) 1fr;gap:3px 12px;margin:0;font-size:12px}#settings .ctl dt{font-family:'IBM Plex Mono',monospace;color:var(--amber);white-space:nowrap}#settings .ctl dd{margin:0;opacity:.9}#settings .vnote{")

# 2) the weapon bench: one real-world scale for every gun (no stretching a pistol to rifle length), and no leftover sleeve
rep("k=3.1/Math.max(.3,sz.z);", "k=Math.min(1.6,2.5/Math.max(.3,sz.z));")
rep("drop=new Set([VMS,CM.joint,MAT.glove,MAT.amber])", "drop=new Set([VMS,CM.joint,MAT.glove,MAT.amber,MAT.sleeve])", 2)

# 3) sound came back dead after a pause: Safari leaves the audio engine 'interrupted' or 'suspended' after the pointer
#    unlocks or the page loses focus, and nothing resumed it. Wake it on resume, on any input, and when the tab is visible again.
rep("function resume(){if(INVOPEN){INVOPEN=false}", "function audioWake(){try{if(ac&&ac.state!=='running'&&ac.state!=='closed')ac.resume()}catch(e){}}\nfor(const ev of['pointerdown','keydown','touchstart'])addEventListener(ev,audioWake,{passive:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden)audioWake()});\nfunction resume(){audioWake();if(INVOPEN){INVOPEN=false}")
rep("function setState(s){state=s;", "function setState(s){state=s;if(s==='playing')try{audioWake()}catch(e){}")
# 4) bench and display copies drop hidden parts (other magazine variants, folded irons) so they neither show nor skew the framing;
#    shop displays use each gun's default parts, not the player's
rep("const rm=[];c.visible=true;c.traverse(o=>{if(o.isMesh&&drop.has(o.material))rm.push(o)});","const rm=[];c.visible=true;c.traverse(o=>{if(o!==c&&!o.visible||o.isMesh&&drop.has(o.material))rm.push(o)});",2)
rep("function gunClone(k){","function gunClone(k){attBuild(k,defMods(k));attKey[k]='';const _c=gunClone0(k);attSync();return _c}\nfunction gunClone0(k){")
# 5) aiming toggles: right click once to aim, again to stop (shooting works while aimed); a setting switches back to hold
rep("if(e.button===2)ADS=true;else firing=true});","if(e.button===2){ADS=CFG.adsT===false?true:!ADS}else firing=true});")
rep("addEventListener('mouseup',e=>{if(e.button===2){ADS=false;return}","addEventListener('mouseup',e=>{if(e.button===2){if(CFG.adsT===false)ADS=false;return}")
rep('<label for="setAuto">Automatic sprint and afterburner <input id="setAuto" type="checkbox"></label>','<label for="setAuto">Automatic sprint and afterburner <input id="setAuto" type="checkbox"></label>\n    <label for="setAdsT">Aim with one click (off: hold right mouse) <input id="setAdsT" type="checkbox"></label>')
rep("$('setAuto').checked=CFG.auto!==false;","$('setAuto').checked=CFG.auto!==false;$('setAdsT').checked=CFG.adsT!==false;")
rep("$('setAuto').addEventListener('change',e=>{CFG.auto=e.target.checked;applyCfg()})","$('setAuto').addEventListener('change',e=>{CFG.auto=e.target.checked;applyCfg()});$('setAdsT').addEventListener('change',e=>{CFG.adsT=e.target.checked;ADS=false;applyCfg()})")
rep("<dt>Right click</dt><dd>Aim down sights</dd>","<dt>Right click</dt><dd>Aim down sights: click to aim, click again to stop (or hold, in Settings)</dd>")
open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))
