p='/home/user/greenhouse-nine/index.html'
s=open(p).read()
def rep(a,b,c=1):
  global s
  assert s.count(a)==c,(s.count(a),a[:100]); s=s.replace(a,b)
# ---- the station can be switched off for the space-only stage (new map)
rep("const FAR=new T.Group();scene.add(FAR);","const WORLDOBJ=scene.children.filter(o=>o.isMesh||o.isSprite||o.isGroup);\nfunction worldShow(v){for(const o of WORLDOBJ){if(!v){if(o.userData.wv===undefined)o.userData.wv=o.visible;o.visible=false}else if(o.userData.wv!==undefined){o.visible=o.userData.wv;delete o.userData.wv}}}\nconst FAR=new T.Group();scene.add(FAR);")
rep("  for(const[m,l]of by){const me=new T.Mesh(mergeGeos(l),m);me.receiveShadow=true;scene.add(me)}}catch(err){console.warn('parked shuttles',err)}",
"  for(const[m,l]of by){const me=new T.Mesh(mergeGeos(l),m);me.receiveShadow=true;scene.add(me);WORLDOBJ.push(me)}}catch(err){console.warn('parked shuttles',err)}")
rep("try{lcoreBuild()}catch(err){console.warn('lattice core',err);LC=null}","try{lcoreBuild();WORLDOBJ.push(LC.g)}catch(err){console.warn('lattice core',err);LC=null}")
rep("scene.add(hz);const hg=glow(0x8fe6ff,8,.45);hg.position.set(0,9.6,-217);scene.add(hg);window.BHOLO=hz}","scene.add(hz);const hg=glow(0x8fe6ff,8,.45);hg.position.set(0,9.6,-217);scene.add(hg);window.BHOLO=hz;WORLDOBJ.push(hz,hg)}")
rep("  const near=nearHull(S.pos),bk=","  const near=!S.noHull&&nearHull(S.pos),bk=")
rep("  if(hullZone(S.pos)||hullZone(fv1.copy(S.pos).addScaledVector(S.vel,dt))){","  if(!S.noHull&&(hullZone(S.pos)||hullZone(fv1.copy(S.pos).addScaledVector(S.vel,dt)))){")
rep("    if(hullZone(e.p))pushOut(e.p,e.r,true);","    if(!S.noHull&&hullZone(e.p))pushOut(e.p,e.r,true);")
rep("  const back=nearHull(S.pos)?11:14+S.spd*.02;","  const back=!S.noHull&&nearHull(S.pos)?11:14+S.spd*.02;")
rep("function flyExit(){if(!FLY)return;const S=FLY;PFX.clear();","function flyExit(){if(!FLY)return;const S=FLY;PFX.clear();worldShow(true);if(S.emsl)for(const m of S.emsl)scene.remove(m.g);")
# 2-3 starts in a new space: the station is hidden, the Halcyon left behind, a transit card covers the jump
rep("function stage3Setup(S){S.stage=3;","function jumpFx(t,sub){let d=document.getElementById('jumpfx');if(!d){d=document.createElement('div');d.id='jumpfx';d.style.cssText='position:absolute;inset:0;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:#dcebe4;font:700 26px \"Chakra Petch\",sans-serif;letter-spacing:.3em;pointer-events:none;z-index:5;opacity:0';cv.parentElement.appendChild(d)}\n  d.innerHTML='<div>'+t+'</div><div style=\"font:12px monospace;letter-spacing:.2em;color:#86a39e\">'+sub+'</div>';d.style.transition='none';d.style.opacity='1';setTimeout(()=>{d.style.transition='opacity 1.8s';d.style.opacity='0'},1500)}\nfunction stage3Setup(S){worldShow(false);S.noHull=true;if(S.halc){scene.remove(S.halc.g);S.halc=null}for(const e of S.en)scene.remove(e.g);S.en.length=0;for(const q of S.shots)scene.remove(q.g);S.shots.length=0;PFX.clear();jumpFx('TRANSIT','MERIDIAN APPROACH · STAGE 2-3');sfx('nova');\n  if(S.wing)S.wing.forEach((w,i)=>{w.p.copy(S.pos).add(new T.Vector3((i?1:-1)*22,-3,20).applyAxisAngle(new T.Vector3(0,1,0),S.h));w.dir.set(-Math.sin(S.h),0,-Math.cos(S.h));w.spd=S.spd});S.stage=3;")
# ---- the ace
rep("const g=kind==='gun'?gunboatModel():kind==='pod'?podModel():kind==='mine'?mineModel():interceptorModel();","const g=kind==='gun'?gunboatModel():kind==='pod'?podModel():kind==='mine'?mineModel():kind==='ace'?aceModel():interceptorModel();")
rep("K={gun:[40,11,55],pod:[14,5,0],mine:[2,3,0],int:[6,4.5,150]}[kind];","K={gun:[40,11,55],pod:[14,5,0],mine:[2,3,0],ace:[140,8,175],int:[6,4.5,150]}[kind];")
rep("FLY.kills++;score+=e.kind==='gun'?600:e.kind==='pod'?300:150;","FLY.kills++;score+=e.kind==='gun'?600:e.kind==='pod'?300:e.kind==='ace'?3000:150;")
rep("if(e.hp>0)return;flyBoom(e.p,e.kind==='gun'?2.6:1.3);","if(e.hp>0)return;flyBoom(e.p,e.kind==='gun'?2.6:e.kind==='ace'?3.4:1.3);")
rep("    else if(e.kind==='mine'){",
"""    else if(e.kind==='ace'){const A=e.ace||(e.ace={mt:5});A.mt-=dt;
      // attack runs, a hard break past you, then round again
      if(e.st==='break'){e.t-=dt;fv2.copy(e.bdir);if(e.t<=0)e.st='attack'}else{fv2.copy(to).addScaledVector(S.vel,d/600).normalize();if(d<230){e.st='break';e.t=2+Math.random()*1.4;e.bdir.set(Math.random()-.5,(Math.random()-.5)*.6,Math.random()-.5).normalize().addScaledVector(e.dir,.8).normalize()}}
      e.dir.lerp(fv2,Math.min(1,dt*1.8)).normalize();e.p.addScaledVector(e.dir,e.sp*dt);
      // heavy cannon: two big, slow rounds on each lined-up pass
      if(e.st==='attack'&&d<1000&&e.dir.dot(fv2.copy(to).divideScalar(d))>.96&&e.cd<=0){e.cd=2.4;e.burst=2}
      if(e.burst>0&&e.bt<=0){e.bt=.28;e.burst--;const ld=fv2.copy(to).addScaledVector(S.vel,d/420).normalize(),g=new T.Group();g.add(mesh(GEO.sph,FPLAS,.9,.9,.9),glow(0xff7a2a,7,.9));g.position.copy(e.p).addScaledVector(e.dir,8);scene.add(g);
        S.shots.push({g,p:g.position,v:ld.clone().multiplyScalar(420),t:4,dmg:14,mine:false,prev:g.position.clone()});sfx('spit')}
      // a homing missile about every ten seconds
      if(A.mt<=0&&d<1800){A.mt=9+Math.random()*3;aceMissile(S,e)}}
    else if(e.kind==='mine'){""")
# missiles: fly faster than the afterburner but turn much wider than the shuttle, so a tight circle beats them
rep("  // enemies\n  for(const e of S.en.slice()){","""  // enemy homing missiles
  S.warn=false;S.warnD=1e9;if(S.emsl)for(let i=S.emsl.length-1;i>=0;i--){const m=S.emsl[i];m.t-=dt;m.spd=Math.min(235,m.spd+70*dt);fv1.subVectors(S.pos,m.p);const dd=fv1.length();fv1.divideScalar(dd||1);
    const ang=Math.acos(Math.max(-1,Math.min(1,m.dir.dot(fv1)))),mx=m.turn*dt;if(ang>1e-4)m.dir.lerp(fv1,Math.min(1,mx/ang)).normalize();m.p.addScaledVector(m.dir,m.spd*dt);m.g.lookAt(m.p.x+m.dir.x,m.p.y+m.dir.y,m.p.z+m.dir.z);
    m.tr-=dt;if(m.tr<=0){m.tr=.03;PFX.smoke(m.p,{n:1,spd:.2,size:[.8,3],life:1.4,up:0,c0:.55,c1:.8,alpha:.5})}
    if(dd<2500&&m.t>0){S.warn=true;S.warnD=Math.min(S.warnD,dd)}
    if(dd<9){flyBoom(m.p,1.2);scene.remove(m.g);S.emsl.splice(i,1);hurt(30);if(msgT<=0)say('Missile hit',1);if(state!=='playing')return;continue}
    if(m.t<=0){flyBoom(m.p,.8);scene.remove(m.g);S.emsl.splice(i,1)}}
  if(S.warn){S.beep=(S.beep||0)-dt;if(S.beep<=0){S.beep=.12+Math.min(.5,S.warnD/2500*.5);tone('square',1500,1500,.05,.035)}}
  // enemies
  for(const e of S.en.slice()){""")
rep("function stage2Setup(S){","""function aceModel(){const K=enemyShipKit(),g=new T.Group(),b=interceptorModel();b.scale.setScalar(1.7);g.add(b);
  g.add(inst(kit('ace',a=>{a(GEO.cyl,K.dark,.32,6,.32,0,-1.3,4.2,1.571,0,0);a(GEO.cyl,K.plate,.45,1.2,.45,0,-1.3,1.4,1.571,0,0);a(GEO.cyl,K.eye,.2,.2,.2,0,-1.3,7.25,1.571,0,0);
    for(const s of[-1,1]){a(GEO.cyl,K.plate,.42,3.2,.42,s*3.4,-.6,.6,1.571,0,0);a(GEO.cone,K.eye,.42,.8,.42,s*3.4,-.6,2.6,1.571,0,0);a(GEO.box,K.hull,.12,1.6,2.6,s*5.6,.5,-2.2,0,0,s*.3);a(GEO.box,K.dark,2.4,.14,1.2,s*2.4,-.3,-4.2)}}),true));
  for(const s of[-1,1]){const q=glow(0xff3a2a,6,.9);q.position.set(s*1.2,0,-6);g.add(q)}return g}
function aceMissile(S,e){const g=new T.Group();g.add(mesh(GEO.cyl,MAT.white,.3,2.2,.3,0,0,0),glow(0xff5030,4,.95));g.children[0].rotation.x=Math.PI/2;g.position.copy(e.p).addScaledVector(e.dir,6);scene.add(g);
  (S.emsl||(S.emsl=[])).push({g,p:g.position,dir:e.dir.clone(),spd:150,t:10,turn:1.0,tr:0});sfx('launch');
  if(!S.mslTip){S.mslTip=1;comm('R',"It's launched a missile! Break hard and keep turning in tight circles!")}}
function stage2Setup(S){""")
# rescue ends with the ace
rep("  else if(S.ph==='w3'){if(!S.en.length){S.ph='end2';S.endT=0;comm('C',\"Halcyon is clear. Good work, Kestrel. Meridian is waiting.\")}}",
"""  else if(S.ph==='w3'){if(!S.en.length){S.ph='ace';comm('C',"Heavy contact inbound, fast. That's no interceptor. It's one of the Wellmonger's aces.");const f=new T.Vector3(-Math.sin(S.h),0,-Math.cos(S.h));const a=flyEnemy('ace',S.pos.x+f.x*2200,S.pos.y+120,S.pos.z+f.z*2200);a.cd=3;S.ace=a}}
  else if(S.ph==='ace'){if(!S.en.includes(S.ace)){S.ph='end2';S.endT=0;comm('C',"Ace down! Halcyon is clear. Good work, Kestrel. Meridian is waiting.");comm('H',"That flier gutted three of our escorts. Thank you, Kestrel.")}}""")
rep("S.ph==='w3'?'STAGE 2-2 · PROTECT THE HALCYON · '+n+' LEFT':","S.ph==='w3'?'STAGE 2-2 · PROTECT THE HALCYON · '+n+' LEFT':S.ph==='ace'?'STAGE 2-2 · ACE · VANTH'+(n>1?' · '+(n-1)+' MORE':''):")
rep("const n=S.en.length;setObj(S.ph==='approach'?'STAGE 2-2 · RESCUE","const n=S.en.length;if(S.ph==='ace'&&S.ace){setObj('STAGE 2-2 · ACE · VANTH · BEAT THE MISSILES BY TURNING HARD',Math.max(0,S.ace.hp/S.ace.max));return false}setObj(S.ph==='approach'?'STAGE 2-2 · RESCUE")
rep("'The Halcyon is safe and fourteen of her crew are aboard. Moth and Ferro fly your wing. Next: stage 2-3, the run to Meridian Station.'","'The Halcyon is safe, fourteen of her crew are aboard and the Wellmonger\\'s ace is scrap. Moth and Ferro fly your wing. Next: stage 2-3, the run to Meridian Station.'")
# missile warning on the HUD
rep("  let nv=$('fnav');if(!nv){","  let wn=$('fwarn');if(!wn){wn=document.createElement('div');wn.id='fwarn';wn.style.cssText='position:absolute;left:50%;top:20%;transform:translateX(-50%);color:#ff4a3a;font:700 17px \"Chakra Petch\",sans-serif;letter-spacing:.18em;text-shadow:0 0 8px #f00;pointer-events:none;white-space:nowrap';$('fhud').appendChild(wn)}\n  wn.hidden=!S.warn;if(S.warn)wn.textContent=(Math.sin(S.t*14)>0?'MISSILE · ':'')+'BREAK TURN · KEEP CIRCLING · '+Math.round(S.warnD)+' M';\n  let nv=$('fnav');if(!nv){")
open(p,'w').write(s);print('ok')
