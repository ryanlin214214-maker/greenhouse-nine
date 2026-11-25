import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)
# ---- v92: the Codex: enemies, bosses, ships and lore with turning 3D models and Codex IDs for stage planning
C = open('codex.js').read()+'\n'
i = s.index("function hubUse(){"); s = s[:i] + C + s[i:]
rep('<button id="invBtn" type="button">Inventory</button>', '<button id="cdxBtn" type="button">Codex</button>\n  <button id="invBtn" type="button">Inventory</button>')
rep('<div class="panel inv" id="shop" hidden>', '<div class="codex" id="codex" hidden><div class="ctop"><b>CODEX</b><div class="ctabs" id="cdxTabs"></div><button type="button" id="cdxClose">Close · K</button></div><div class="clist" id="cdxList"></div><div class="cview" id="cdxView"><canvas id="cdxCv" aria-label="The selected entry, turning"></canvas><p class="cno" id="cdxNo" hidden>A story entry: no model</p><p class="ghint">Drag to turn</p></div><div class="ctext" id="cdxText"></div></div>\n  <div class="panel inv" id="shop" hidden>')
rep('.inv{width:min(94%,620px);', """.codex{position:absolute;inset:0;z-index:7;background:linear-gradient(180deg,rgba(8,10,16,.97),rgba(12,14,22,.96));display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr) minmax(0,1.25fr);grid-template-rows:auto minmax(0,1fr);gap:10px;padding:12px 14px;box-sizing:border-box;font-size:11px}
.ctop{grid-column:1/-1;display:flex;align-items:center;gap:12px;flex-wrap:wrap;border-bottom:1px solid var(--line);padding-bottom:6px}.ctop>b{font:700 15px 'Chakra Petch',sans-serif;letter-spacing:.3em;color:var(--amber)}.ctop>button{margin-left:auto}
.ctabs{display:flex;gap:4px;flex-wrap:wrap}.ctabs button{font-size:10px;padding:4px 8px}.ctabs button[aria-pressed="true"]{border-color:var(--amber);color:var(--amber)}
.clist{display:flex;flex-direction:column;gap:4px;overflow:auto;min-height:0;padding-right:2px}.cdxi{all:unset;box-sizing:border-box;cursor:pointer;display:grid;grid-template-columns:34px 1fr;gap:0 8px;border:1px solid var(--line);border-left:3px solid #6a4a9a;background:rgba(0,0,0,.35);padding:5px 8px}
.cdxi b{grid-row:span 2;color:var(--amber);font:700 11px 'IBM Plex Mono',monospace;align-self:center}.cdxi span{font:700 12px 'Chakra Petch',sans-serif;color:var(--fg)}.cdxi i{font-style:normal;color:var(--dim);font-size:10px}
.cdxi[aria-pressed="true"],.cdxi:hover,.cdxi:focus-visible{border-color:var(--amber);background:rgba(255,178,56,.08)}
.cview{position:relative;min-height:200px;border:1px solid var(--line);background:radial-gradient(ellipse at 50% 70%,rgba(160,90,255,.1),transparent 60%)}.cview canvas{position:absolute;inset:0;width:100%;height:100%;cursor:grab;touch-action:none}
.cno{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;margin:0;color:var(--dim);letter-spacing:.14em;font-size:10px;text-transform:uppercase}
.ctext{overflow:auto;min-height:0;line-height:1.45;padding-right:4px}.cdxh b{display:block;font:700 18px 'Chakra Petch',sans-serif;letter-spacing:.06em}.cdxh span{display:block;color:var(--dim)}.cdxh em{display:inline-block;margin-top:4px;font-style:normal;font:700 10px 'IBM Plex Mono',monospace;color:var(--amber);border:1px solid var(--amber);padding:1px 6px;letter-spacing:.12em}
.ctext dl{display:grid;grid-template-columns:max-content 1fr;gap:2px 10px;margin:8px 0}.ctext dt{color:var(--dim);font-size:10px;letter-spacing:.1em;text-transform:uppercase}.ctext dd{margin:0}
.ctext h5{margin:10px 0 2px;font:700 10px 'Chakra Petch',sans-serif;letter-spacing:.18em;text-transform:uppercase;color:var(--amber)}.ctext p{margin:0;max-width:62ch}.ctext .cdxl{color:#c9b8ea;font-style:italic}
@media (max-width:760px){.codex{grid-template-columns:minmax(0,1fr);grid-template-rows:auto 150px 200px auto;overflow:auto}.clist{max-height:150px}}
.inv{width:min(94%,620px);""")
rep("hubTick(dt);try{cmdTick(dt)}", "hubTick(dt);try{cdxTick(dt)}catch(e){}try{cmdTick(dt)}")
rep("$('invBtn').addEventListener('click',()=>invToggle());", "$('invBtn').addEventListener('click',()=>invToggle());$('cdxBtn').addEventListener('click',()=>{CDX.open?cdxClose():cdxOpen()});$('cdxClose').addEventListener('click',()=>cdxClose());")
rep("  if(e.code==='KeyP'){if(state==='playing')pause();else if(state==='paused')resume()}});", "  if(e.code==='KeyK'&&!INVOPEN&&!SHOPOPEN&&!(INTRO&&INTRO.on)){CDX.open?cdxClose():cdxOpen();return}if(e.code==='Escape'&&CDX.open){cdxClose();return}\n  if(e.code==='KeyP'){if(CDX.open)return;if(state==='playing')pause();else if(state==='paused')resume()}});")
# ---- v92: Meridian cars stay where you park them. Getting out let the car coast through the idle-vehicle code, whose
# pushOut used Thalassa's map clamp and threw the car 2 km away (it "disappeared"). Parked spots are kept across resets
# and reloads (localStorage gh9-cars).
CARS = r"""
function meriCarSave(){try{localStorage.setItem('gh9-cars',JSON.stringify(MCARS.map(v=>[+(v.pos.x-HC.x).toFixed(2),+(v.pos.z-(HC.z-1100)).toFixed(2),+v.h.toFixed(3)])))}catch(e){}}
function meriCarLoad(v,i){try{const L=JSON.parse(localStorage.getItem('gh9-cars')||'null');const q=L&&L[i];if(!q||!q.every(isFinite))return;const r=Math.hypot(q[0],q[1]);if(r<860||r>1560)return;v.pos.set(HC.x+q[0],v.r,HC.z-1100+q[1]);v.h=q[2];v.g.rotation.set(0,v.h,0)}catch(e){}}
"""
i = s.index("function hubUse(){"); s = s[:i] + CARS + s[i:]
rep("p.x+=-Math.sin(v.h)*v.v*dt;p.z+=-Math.cos(v.h)*v.v*dt;pushOut(p,v.r)}}", "p.x+=-Math.sin(v.h)*v.v*dt;p.z+=-Math.cos(v.h)*v.v*dt;pushOut(p,v.r,!!v.meri);if(v.meri){p.y=Math.max(p.y,v.r);try{meriPush(p,1.7)}catch(e){}if(!v.v)meriCarSave()}}}")
rep("for(const v of vehs)homeVeh(v)", "for(const v of vehs)if(!v.meri)homeVeh(v)")
rep("vehs.push(v);homeVeh(v);MCARS.push(v);", "vehs.push(v);homeVeh(v);MCARS.push(v);meriCarLoad(v,MCARS.length-1);")
rep("if(v.kind==='car')v.v*=0.3;sfx('swap');return}", "if(v.kind==='car')v.v*=0.3;if(v.meri)meriCarSave();sfx('swap');return}")
# ---- v92: floating parts found by the part checker (t250): the strike drone's and gunship's chin fangs hung in front of
# the chin plate; the stalker's head bolts sat outside its narrow head
rep("a(GEO.cone,AM,.02,.14,.02,s*.06,-.16,.14,2.6,0,0)", "a(GEO.cone,AM,.02,.14,.02,s*.06,-.17,.05,2.6,0,0)")
rep("for(const s of[-1,1])a(GEO.cyl,A2,.05,.05,.05,s*.205,.15,0,0,0,1.571)});", "for(const s of[-1,1])a(GEO.cyl,A2,.05,.05,.05,s*(v===2?.115:.205),.15,0,0,0,1.571)});")
# ---- v92: the waypoint moves out of the view: a compass strip along the top edge (bearing left/right of where you look,
# an arrow at the end when it is behind you, up/down marks when it is well above or below), with the name and distance
rep("@media (max-width:1000px){.obj{left:10px;right:96px;top:118px}}", "@media (max-width:1000px){.obj{left:10px;right:96px;top:118px}}\n#wp{left:366px!important;right:104px;top:4px!important;transform:none!important;height:34px;display:block}@media (max-width:1000px){#wp{left:10px!important;right:96px;top:84px!important}}#wp .wpt{position:absolute;left:0;right:0;top:9px;height:2px;background:linear-gradient(90deg,transparent,rgba(125,255,176,.45) 12%,rgba(125,255,176,.45) 88%,transparent)}#wp .wpc{position:absolute;left:50%;top:5px;width:2px;height:10px;margin-left:-1px;background:rgba(220,235,228,.6)}#wp .wpm{position:absolute;top:3px;width:12px;height:12px;margin-left:-6px;transform:rotate(45deg)}#wp.edge .wpm{margin-left:-8px;top:1px;border-left-width:8px;border-right-width:8px;border-bottom-width:14px}#wp .wpl{position:absolute;left:50%;top:17px;transform:translateX(-50%);font-size:10px;padding:0 6px}@media (min-width:1001px){.obj{top:42px}}")
WPD = r"""function wpDraw(){const el=WP.el||(WP.el=$('wp'));if(!el)return;const show=WP.on&&state==='playing'&&!(INTRO&&INTRO.on)&&!(FC&&FC.on);el.hidden=!show;WP.on=false;if(!show)return;
  if(!el.querySelector('.wpt')){const t=document.createElement('div');t.className='wpt';const c=document.createElement('div');c.className='wpc';el.insertBefore(c,el.firstChild);el.insertBefore(t,el.firstChild)}
  const m=el.querySelector('.wpm'),l=el.querySelector('.wpl');cam.getWorldDirection(_wv);const fx=_wv.x,fz=_wv.z,fl=Math.hypot(fx,fz)||1,dx=WP.P.x-cam.position.x,dy=WP.P.y-cam.position.y,dz=WP.P.z-cam.position.z,hd=Math.hypot(dx,dz)||1;
  const ang=Math.atan2((fx*dz-fz*dx)/fl,(fx*dx+fz*dz)/fl),lim=Math.PI*.5,edge=Math.abs(ang)>lim;el.classList.toggle('edge',edge);
  const u=Math.max(-1,Math.min(1,ang/lim));m.style.left=(50+u*46)+'%';m.style.transform=edge?'rotate('+(ang>0?90:-90)+'deg)':'rotate(45deg)';
  const el2=Math.atan2(dy,hd),vm=el2>.35?' ▲':el2<-.35?' ▼':'';l.textContent=WP.lab+' · '+Math.round(WP.d)+' M'+vm}
"""
i=s.index("function wpDraw(){");j=s.index("\nconst WPR=",i);s=s[:i]+WPD.strip()+s[j:]
open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))
