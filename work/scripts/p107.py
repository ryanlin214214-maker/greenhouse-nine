# v93 G2: stage 3-1 as a fleet battle (lvl3e.js): allies, capital ships, Vesper, bomber runs, Grief's turrets and break-up,
# the command ship's batteries; then the existing Nova, reinforcements and landing. Enemies target allies too.
import sys
s=open(sys.argv[1]).read()
def R(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:100]);s=s.replace(a,b)
s=s.replace("function l3Clear(S){",open('lvl3e.js').read()+"\nfunction l3Clear(S){try{btlClear(S)}catch(e){}",1)
R("const WHO={","const WHO={V:['VESPER · WING CDR NADIA SOREL','cmd'],")
# the battle replaces the straight run to the warhead
R("S.pos.set(9800,250,600);S.h=Math.PI/2;S.p=0;S.roll=0;yaw=S.h;pitch=-.02;S.spd=120;S.thr=.6;S.ph='approach';S.ft=0;",
  "S.pos.set(9800,250,600);S.h=Math.PI/2;S.p=0;S.roll=0;yaw=S.h;pitch=-.02;S.spd=120;S.thr=.6;S.ph='battle';S.ft=0;")
R("fcStart('in',S,'STAGE 3-1','FIRST STRIKE');comm('C',\"That's her. The Wellmonger's command ship. Ten kilometres of hull.\");comm('C',\"Close to seven kilometres and launch the Nova warhead.\")}",
  "fcStart('in',S,'STAGE 3-1','FIRST STRIKE');comm('C',\"That's her. The Wellmonger's command ship. Ten kilometres of hull.\");comm('C',\"And the fight's already started. Every squadron we have is out there.\");btlStart(S)}")
R("function l3Tick31(S,dt){const D=S.dr;","function l3Tick31(S,dt){const D=S.dr;if(S.btl)btlTick(S,dt);")
# shots: allied bolts kill without player credit; enemy bolts can hit allies
R("if(q.mine){for(const e of S.en){if(segDist(q.prev,q.p,e.p)<e.r){flyHit(e,q.dmg);","if(q.mine){for(const e of S.en){if(segDist(q.prev,q.p,e.p)<e.r){ALLYHIT=!!q.ally;flyHit(e,q.dmg);ALLYHIT=false;")
R("else if(segDist(q.prev,q.p,S.pos)<3.6){hurt(q.dmg,HSRC.copy(q.p).addScaledVector(q.v,-.3));","else if(S.btl&&btlAllyHit(S,q)){gone=true}else if(segDist(q.prev,q.p,S.pos)<3.6){hurt(q.dmg,HSRC.copy(q.p).addScaledVector(q.v,-.3));")
R("FLY.shots.push({g,p:g.position,v:dir.clone().multiplyScalar(speed),t:mine?1.4:3.2,dmg,mine,prev:p.clone()})}","const q={g,p:g.position,v:dir.clone().multiplyScalar(speed),t:mine?1.4:3.2,dmg,mine,prev:p.clone()};FLY.shots.push(q);return q}")
# enemies aim at their chosen target (an ally, a capital ship, or you); turrets and batteries are driven by the battle
R("const to=fv1.subVectors(S.pos,e.p),d=to.length()||1;e.cd-=dt;e.bt-=dt;","if(e.kind==='tur'||e.kind==='bat')continue;const TP=e.tgtA&&e.tgtA.hp>0?e.tgtA.p:e.tgtC&&e.tgtC.hp>0?e.tgtC.p:S.pos,to=fv1.subVectors(TP,e.p),d=to.length()||1;e.cd-=dt;e.bt-=dt;")
R("e.tp={g,p:g.position,v:e.dir.clone().multiplyScalar(140),t:12,hp:6};","e.tp={g,p:g.position,v:e.dir.clone().multiplyScalar(140),t:12,hp:6,tc:e.tgtC&&e.tgtC.hp>0?e.tgtC:null};")
R("const tgt=m.dec&&m.dec.t>0?m.dec.p:S.pos;","const tgt=m.tc?m.tc.p:m.dec&&m.dec.t>0?m.dec.p:S.pos;if(m.tc&&m.p.distanceTo(m.tc.p)<m.tc.r*1.5){bigBoom(m.p,80);m.tc.hp=Math.max(60,m.tc.hp-70);m.t=-1;scene.remove(m.g);S.etp.splice(i,1);continue}")
# kills: allied kills give no credit but count for the screen; turrets and batteries leave a fire on their hull
R("flyBoom(e.p,e.kind==='gun'?2.6","if(FLY.btl&&e.kind==='int')FLY.btl.kill+=ALLYHIT?1:2;flyBoom(e.p,e.kind==='gun'?2.6")
R("scene.remove(e.g);FLY.en.splice(FLY.en.indexOf(e),1);FLY.kills++;score+=","if(e.g.parent&&e.g.parent!==scene){const hp0=e.g.parent,lp=e.g.position.clone();hp0.remove(e.g);PFX.emit(()=>hp0.localToWorld(lp.clone()),{rate:8,dur:90,fire:true,ss:[6,22],slife:2.4,far:9000,c0:.15,c1:.4,alpha:.6})}else scene.remove(e.g);FLY.en.splice(FLY.en.indexOf(e),1);if(ALLYHIT){if(FLY.lockE===e){FLY.lockE=null;FLY.lockP=0}return}FLY.kills++;score+=")
# markers for Vesper and the bombers
R("for(let i=k;i<FTG.length;i++)FTG[i].hidden=true;","for(let i=k;i<FTG.length;i++)FTG[i].hidden=true;try{if(S.btl)btlMarks(S,box,W,H)}catch(e){}")
css='''.fhud .tg.ally{border-color:#7dffb0;border-width:1px;border-radius:2px;width:16px;height:16px;margin:-8px 0 0 -8px;transform:rotate(45deg);box-shadow:none;opacity:calc(var(--mko,1)*.85)}
.fhud .tg.ally i{transform:rotate(-45deg) translate(6px,8px);color:#7dffb0;font-size:8px}
'''
i=s.find("</style>");s=s[:i]+css+s[i:]
open(sys.argv[2],'w').write(s);print('p107 ok')
