import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()

def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)

# 1) the gun models and attachments
a = s.index("// Arc Welder: a compact energy auto-rifle")
b0 = s.index("const attKey=[];function attSync(){")
b = s.index("\n", b0) + 1
s = s[:a] + open('guns83.js', encoding='utf-8').read() + s[b:]
# the old built-in reticle rings and gun stubs are gone with the old models; keep nothing else that referenced them

# 2) mods: more sights, a muzzle brake, a drum magazine, underbarrel attachments, and which gun takes which
a = s.index("const MODS={s:[{n:'Iron sights'")
b = s.index("// the stats a gun really has with its attachments")
MODS = r"""const MODS={s:[{n:'Iron sights',z:1},{n:'Holo sight',z:1.35,sp:.85},{n:'Scope 2.5x',z:2.5,sp:.6},{n:'Long scope 4x',z:4,sp:.45},{n:'Red dot',z:1.2,sp:.9},{n:'Marksman 8x',z:8,sp:.35}],
  b:[{n:'Standard barrel',len:0},{n:'Long barrel',dmg:1.08,sp:.8,rec:1.1,len:.16},{n:'Compensator',rec:.55,sp:.9,len:.08},{n:'Suppressor',dmg:.95,rec:.8,len:.22,quiet:1},{n:'Muzzle brake',rec:.68,sp:.95,len:.07}],
  m:[{n:'Standard magazine'},{n:'Extended magazine',mag:1.4,reload:1.15,heat:.8},{n:'Quickdraw magazine',mag:.8,reload:.7,heat:1.2},{n:'Drum magazine',mag:2.1,reload:1.5}],
  u:[{n:'No underbarrel'},{n:'Vertical grip',rec:.85},{n:'Angled grip',rec:.92,sp:.92},{n:'Laser sight',sp:.8}]};
// what each gun accepts (by WPN index): no suppressor on a grenade launcher, no scope on a rotary cannon, no barrel parts on the lance's prongs
const ALLOW=[{s:[0,4,1,2],b:[0,1],m:[0,1,2],u:[0,1,3]},{s:[0,4,1,2,3],b:[0],m:[0,1,2],u:[0]},{s:[0,4,1,2,3],b:[0,1,2,3,4],m:[0,1,2,3],u:[0,1,2,3]},{s:[0,4],b:[0,2,3],m:[0,1,2],u:[0,3]},
  {s:[0,1],b:[0],m:[0],u:[0]},{s:[0,1,4],b:[0],m:[0,1],u:[0]},{s:[0,4,1],b:[0,1,2],m:[0,1],u:[0,1,3]},{s:[3,2,5,1,4],b:[0,1,3,4],m:[0,1,2],u:[0,3]}];
const MCELL=['Standard cell','Large cell','Fast-cycle cell'];
const defMods=k=>{const A=ALLOW[k]||ALLOW[2],s0=WPN[k].sight|0;return{s:A.s.includes(s0)?s0:A.s[0],b:0,m:0,u:0}};
function modsFix(k,m){const A=ALLOW[k]||ALLOW[2],d=defMods(k),o={};for(const kk of['s','b','m','u']){const v=m&&m[kk]!==undefined?m[kk]|0:d[kk];o[kk]=A[kk].includes(v)?v:d[kk]}return o}
const modName=(k,kk,v)=>kk==='m'&&WPN[k].mode==='heat'?(MCELL[v]||MODS.m[v].n):MODS[kk][v].n;
"""
s = s[:a] + MODS + s[b:]
rep("function gW(G){const md=G.mods||(G.mods=defMods(G.k)),key=md.s+'.'+md.b+'.'+md.m;",
    "function gW(G){const md=G.mods=modsFix(G.k,G.mods),key=md.s+'.'+md.b+'.'+md.m+'.'+md.u;")
rep("W.dmg*=B.dmg||1;W.rec*=B.rec||1;", "W.dmg*=B.dmg||1;W.rec*=B.rec||1;{const U=MODS.u[md.u]||{};if(W.spread)W.spread*=U.sp||1;W.rec*=U.rec||1}")
rep("mods:mods?{s:mods.s|0,b:mods.b|0,m:mods.m|0}:defMods(k)", "mods:modsFix(k,mods)")
rep("mods:M(r&&r.mods)", "mods:modsFix(K(r&&r.k),r&&r.mods)")
rep("mods:o.v>=4&&q.mods?{s:Math.max(0,Math.min(3,q.mods.s|0)),b:Math.max(0,Math.min(3,q.mods.b|0)),m:Math.max(0,Math.min(2,q.mods.m|0))}:undefined}",
    "mods:o.v>=4&&q.mods?{s:q.mods.s|0,b:q.mods.b|0,m:q.mods.m|0,u:q.mods.u|0}:undefined}")
# 3) the loadout screen: only the parts this gun takes; cell names for heat weapons; an underbarrel row
rep("MODS.s[md.s].n+' · '+MODS.b[md.b].n+' · '+MODS.m[md.m].n", "modName(G.k,'s',md.s)+' · '+modName(G.k,'b',md.b)+' · '+modName(G.k,'m',md.m)+(md.u?' · '+modName(G.k,'u',md.u):'')")
rep("[['s','SIGHT'],['b','BARREL'],['m','MAGAZINE']].map(([kk,lab])=>'<div class=\"gmod\"><span>'+lab+'</span>'+MODS[kk].map((o,v)=>'<button type=\"button\" data-m=\"'+kk+':'+v+'\"'+(md[kk]===v?' aria-pressed=\"true\"':'')+'>'+o.n+'</button>').join('')+'</div>').join('')",
    "[['s','SIGHT'],['b','BARREL'],['m',WPN[G.k].mode==='heat'?'CELL':'MAGAZINE'],['u','UNDERBARREL']].map(([kk,lab])=>{const A=ALLOW[G.k][kk];return '<div class=\"gmod\"><span>'+lab+'</span>'+(A.length<2?'<em class=\"gfix\">'+modName(G.k,kk,A[0])+' · fixed on this gun</em>':A.map(v=>'<button type=\"button\" data-m=\"'+kk+':'+v+'\"'+(md[kk]===v?' aria-pressed=\"true\"':'')+'>'+modName(G.k,kk,v)+'</button>').join(''))+'</div>'}).join('')")
rep("key=G.k+':'+md.s+md.b+md.m", "key=G.k+':'+md.s+md.b+md.m+md.u")
s = s.replace("G.mods||defMods(G.k)", "modsFix(G.k,G.mods)")
rep("function gearMod(slot,kind,v){const G=guns[slot];G.mods=Object.assign({},modsFix(G.k,G.mods),{[kind]:v});",
    "function gearMod(slot,kind,v){const G=guns[slot];if(!ALLOW[G.k][kind]||!ALLOW[G.k][kind].includes(v))return;G.mods=modsFix(G.k,Object.assign({},modsFix(G.k,G.mods),{[kind]:v}));")
rep(".gmod{", ".gmod .gfix{font-style:normal;opacity:.6;font-size:11px}.gmod{") if s.count(".gmod{") == 1 else None
rep("c.traverse(o=>{o.visible=true;if(o.isMesh&&drop.has(o.material))rm.push(o)});","c.visible=true;c.traverse(o=>{if(o.isMesh&&drop.has(o.material))rm.push(o)});",2)
open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))
