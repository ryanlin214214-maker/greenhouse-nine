// ---------- v93: Mission 3 as a fleet battle. Stage 3-1 now drops you into a fight that is already going on: the allied
// fleet (two cruisers, a carrier, fighter squadrons, bomber flights, and the ace VESPER) against the Wellmonger's screen.
// Phases: rally on Vesper, break the interceptor screen, escort the bombers against the cruiser Grief while you knock out
// its turrets, silence the command ship's batteries, then the Nova (it hits the shield and does nothing, as before), the
// reinforcements jump in, and you land in the bay. Allied fighters and bombers are drawn as instanced meshes (a handful
// of draw calls for the whole fleet); their bolts and torpedoes really hit, and enemies really pick them as targets.
let ALLYHIT=false;const ALLYB=bas({color:0x8fffc8,transparent:true,opacity:.95,blending:T.AdditiveBlending,depthWrite:false,fog:false}),FLAKB=bas({color:0xffe6a0,transparent:true,opacity:.9,blending:T.AdditiveBlending,depthWrite:false,fog:false});
// a model merged per material, then drawn as one InstancedMesh per material
const FIP={};function fiPool(key,mk,cap){if(FIP[key])return FIP[key];const m=mk();m.rotation.set(0,0,0);m.position.set(0,0,0);m.updateMatrixWorld(true);const by=new Map();
  m.traverse(o=>{if(!o.isMesh||!o.visible||!o.geometry.attributes.position)return;let v=true;o.traverseAncestors(a=>{if(!a.visible)v=false});if(!v)return;const g=(o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone());g.applyMatrix4(o.matrixWorld);
    if(!g.attributes.normal)g.computeVertexNormals();const L=by.get(o.material)||[];L.push(g);by.set(o.material,L)});
  const ims=[];for(const[mat,L]of by){let n=0;for(const g of L)n+=g.attributes.position.count;const P=new Float32Array(n*3),N=new Float32Array(n*3);let o=0;for(const g of L){P.set(g.attributes.position.array,o*3);N.set(g.attributes.normal.array,o*3);o+=g.attributes.position.count}
    const G=new T.BufferGeometry();G.setAttribute('position',new T.BufferAttribute(P,3));G.setAttribute('normal',new T.BufferAttribute(N,3));G.computeBoundingSphere();const im=new T.InstancedMesh(G,mat,cap);im.count=0;im.frustumCulled=false;im.castShadow=false;ims.push(im)}
  return FIP[key]={ims,cap,on:false}}
function fiShow(P,on){if(P.on===on)return;P.on=on;for(const im of P.ims){if(on)scene.add(im);else scene.remove(im)}}
const FIO=new T.Object3D();
// an allied cruiser (original: a long ivory hull with gold bands, a bridge tower, broadside turrets, four drive bells)
let ACM=null;function allyCruiser(name){const M=shuttleMats(),K=shipKitMats();const W=M.hull.clone();W.color.setHex(0xcfc8b8);const Gd=std({color:0xd9a441,roughness:.3,metalness:.9}),Dk=M.dark,Wn=bas({color:0xffe0a8});
  const g=new T.Group(),k=kit('acr93',a=>{a(lathGeo([[0,-460],[40,-400],[70,-250],[85,0],[85,260],[70,380],[60,420]],24),W,1.6,1,.9,0,0,0,Math.PI/2,0,0);
    a(GEO.box,W,150,40,520,0,-30,40);a(GEO.box,Dk,152,6,500,0,-52,40);for(const z of[-300,-150,0,150,300])a(GEO.box,Gd,170,4,6,0,8,z);
    a(GEO.box,W,40,70,90,0,75,180);a(GEO.box,Dk,42,10,60,0,98,170);for(let i=0;i<10;i++)a(GEO.box,Wn,34,2,1,0,70+i*0?0:60+(i%5)*5,140+Math.floor(i/5)*2);
    for(const s of[-1,1]){for(let z=-320;z<=320;z+=12)a(GEO.box,Wn,1,2.4,6,s*86,10+(z%24?0:8),z);for(const z of[-220,-60,100,260]){a(GEO.cyl,Dk,9,6,9,s*70,52,z);a(GEO.box,Dk,6,6,30,s*70,57,z-14)}}
    for(const[x,y]of[[-45,-25],[45,-25],[-45,25],[45,25]]){a(GEO.cyl,Dk,26,40,26,x,y,440,Math.PI/2,0,0)}a(GEO.cone,W,60,140,60,0,0,-560,-Math.PI/2,0,0)});
  const o=inst(k,true);g.add(o);for(const[x,y]of[[-45,-25],[45,-25],[-45,25],[45,25]]){const q=glow(0x8fd8ff,70,.9);q.position.set(x,y,465);g.add(q)}g.userData.name=name;return g}
function lathGeo(pr,seg){return new T.LatheGeometry(pr.map(([r,y])=>new T.Vector2(r,y)),seg||24)}
// ---- the battle state
function btlStart(S){const B=S.btl={t:0,ph:'rally',pt:0,allies:[],caps:[],kill:0,need:40,tur:[],bat:[],grief:null,flights:0,said:{},rein:0,lost:0};
  for(const k of['int','mrf','bmr'])fiShow(fiPool(k,k==='int'?interceptorShip:k==='mrf'?multiroleShip:bomberShip,40),true);
  // capital ships: Resolute and Constance (cruisers) and the carrier Harbour, with the enemy cruiser Grief between the fleets
  for(const[n,x,y,z,h]of[['RESOLUTE',12600,260,-2200,0],['CONSTANCE',13200,-380,2600,0],['HARBOUR',15200,120,300,0]]){const g=allyCruiser(n);g.position.set(x,y,z);g.rotation.y=-Math.PI/2;if(n==='HARBOUR')g.scale.set(1.25,1.5,1.1);scene.add(g);B.caps.push({g,p:g.position,name:n,hp:600,max:600,r:180,cd:0,ally:true})}
  {const g=fleetShip(.12);g.position.set(7600,-120,2600);g.rotation.y=0;scene.add(g);B.grief={g,p:g.position,hp:520,max:520,r:400,dead:0,fires:[]};
    // four point-defence turrets along Grief's flanks: targetable enemies riding on the hull
    for(const[x,y,z]of[[-120,70,-300],[120,70,-120],[-120,70,140],[120,70,360]]){const e=btlTurret(S,g,new T.Vector3(x,y,z));B.tur.push(e)}}
  // squadrons: four of four fighters (Swiftwings and Lancers), Vesper, and two bomber flights waiting by the carrier
  for(let s=0;s<4;s++)for(let i=0;i<4;i++)btlAlly(S,s%2?'mrf':'int',new T.Vector3(11500+Math.random()*1200,(Math.random()-.5)*600,-1800+s*1100+Math.random()*300),{sq:s});
  B.ves=btlAlly(S,'mrf',S.pos.clone().add(new T.Vector3(-1400,120,-900)),{ace:true,hp:1e9});
  // the fight already going on: enemy interceptors mixing it with the squadrons
  for(let i=0;i<8;i++){const e=flyEnemy('int',9000+Math.random()*2000,(Math.random()-.5)*700,-2000+Math.random()*4000);btlPick(S,e)}
  comm('V',"Kestrel, this is Vesper. Glad you made the party. Form up on me, I'll take you through the screen.");comm('C',"All ships, Kestrel is on station. The Nova goes when the lane is open.")}
function btlTurret(S,host,local){const e=flyEnemy('int',0,0,0);scene.remove(e.g);const g=new T.Group(),D=darkMats();g.add(mesh(GEO.cyl,D.hull||EDK&&EDK.hull||MAT.gunD,9,6,9),mesh(GEO.box,D.hull||MAT.gunD,5,5,22,0,3,-12));const gl=glow(0xff3020,18,.9);gl.position.y=6;g.add(gl);
  host.add(g);g.position.copy(local);e.g=g;e.p=new T.Vector3();e.kind='tur';e.hp=e.max=30;e.r=14;e.sp=0;e.host=host;e.local=local.clone();if(e.bc)g.add(e.bc);return e}
function btlAlly(S,kind,p,o){const B=S.btl,a=Object.assign({kind,p:p.clone(),dir:new T.Vector3(-1,0,0),sp:kind==='bmr'?115:kind==='int'?175:160,hp:kind==='bmr'?60:kind==='int'?22:30,r:kind==='bmr'?12:6,cd:Math.random()*2,bt:0,burst:0,st:'fly',t:0},o||{});a.max=a.hp;B.allies.push(a);B.made=(B.made||0)+1;return a}
// enemies choose targets: most interceptors go for the allied fighters and bombers, some for you
function btlPick(S,e){const B=S.btl;if(!B)return;const L=B.allies.filter(a=>a.hp>0&&!a.ace);if(e.kind==='int'&&L.length&&Math.random()<(B.ph==='escort'?.7:.55)){const bm=L.filter(a=>a.kind==='bmr');const pool=bm.length&&Math.random()<.6?bm:L;e.tgtA=pool[Math.random()*pool.length|0]}else e.tgtA=null;e.pickT=5+Math.random()*4}
function btlTick(S,dt){const B=S.btl;if(!B)return;B.t+=dt;B.pt+=dt;const D=S.dr;
  // allies: fly, hunt, escort, fire; bombers fly their run and release torpedoes
  for(let i=B.allies.length-1;i>=0;i--){const a=B.allies[i];a.cd-=dt;a.bt-=dt;
    if(a.hp<=0){flyBoom(a.p,a.kind==='bmr'?2.4:1.4);B.allies.splice(i,1);B.lost++;continue}
    let want=null,tg=null;
    if(a.kind==='bmr'){const G=B.grief;if(a.st==='run'&&G&&!G.dead){want=L3B.subVectors(G.p,a.p);const d=want.length();want.normalize();if(d<1700&&!a.rel){a.rel=1;btlTorp(S,a,G)}if(d<900||a.rel&&a.t>4){a.st='out'}}
      else if(a.st==='out'){a.t+=dt;want=L3B.set(1,.25,a.side||.4).normalize();if(a.t>12)a.st='home'}else{want=L3B.set(14000,0,500).sub(a.p).normalize();if(a.p.distanceTo(L3A.set(14000,0,500))<600){want.set(0,0,1).cross(a.dir).normalize();a.t2=(a.t2||0)+dt;if(a.t2>10&&B.ph==='escort'){a.t2=0;a.rel=0;a.t=0;a.st='run'}}}
      if(a.rel&&a.st==='run')a.t+=dt}
    else{const ward=a.ace?S.pos:a.ward&&a.ward.hp>0?a.ward.p:null;let best=null,bd=a.ace?1300:2600;for(const e of S.en){if(e.kind==='tur'||e.kind==='bat')continue;const d=e.p.distanceTo(ward||a.p);if(d<bd){bd=d;best=e}}
      if(best){tg=best;want=L3B.subVectors(best.p,a.p);const d=want.length();want.addScaledVector(best.dir,d/600*best.sp).normalize();if(d<120){a.st='brk';a.t=1.2;a.bd=(a.bd||new T.Vector3()).set(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize()}}
      else if(ward){want=L3B.subVectors(ward,a.p);const d=want.length();if(a.ace){want.addScaledVector(S.vel,.8).add(L3A.set(-60,25,-40));}want.normalize();if(d<160&&!a.ace)want.add(a.dir).normalize()}
      else want=L3B.set(9500,0,0).sub(a.p).normalize();
      if(a.st==='brk'){a.t-=dt;want=a.bd;if(a.t<=0)a.st='fly'}
      if(tg&&a.cd<=0&&a.p.distanceTo(tg.p)<(a.ace?900:700)&&a.dir.dot(L3A.subVectors(tg.p,a.p).normalize())>.975){a.cd=a.ace?1.4:2.6+Math.random()*1.4;a.burst=a.ace?4:3}
      if(a.burst>0&&a.bt<=0&&tg){a.bt=.1;a.burst--;const ld=L3A.subVectors(tg.p,a.p).addScaledVector(tg.dir,tg.p.distanceTo(a.p)/700*tg.sp).normalize();const q=flyShot(a.p.clone().addScaledVector(a.dir,8),ld,720,ALLYB,5,.2,a.ace?1.4:.7,true);if(q)q.ally=1;else{const s2=S.shots[S.shots.length-1];if(s2)s2.ally=1}}}
    if(want){a.dir.lerp(want,Math.min(1,dt*(a.kind==='bmr'?.5:a.ace?2.2:1.4))).normalize()}a.p.addScaledVector(a.dir,(a.ace?Math.max(120,S.spd*1.02):a.sp)*dt)}
  // allied capital ships: flak at anything inside 2.5 km, now and then a hit
  for(const c of B.caps){c.cd-=dt;if(c.cd<=0){c.cd=.12;let best=null,bd=2500;for(const e of S.en){const d=e.p.distanceTo(c.p);if(d<bd&&e.kind!=='tur'&&e.kind!=='bat'){bd=d;best=e}}
      if(best){const o=c.p.clone().add(L3A.set((Math.random()-.5)*160,40,(Math.random()-.5)*700).applyQuaternion(c.g.quaternion));const ld=L3B.subVectors(best.p,o).normalize();ld.x+=(Math.random()-.5)*.03;ld.y+=(Math.random()-.5)*.03;ld.normalize();flyShot(o,ld,900,FLAKB,6,.4,0,true);
        if(Math.random()<.035){ALLYHIT=true;flyHit(best,3);ALLYHIT=false;sparkle(best.p,0xffe0a0,3,10)}}}}
  // turrets ride on Grief and shoot at bombers and at you
  for(const e of[...B.tur,...B.bat]){if(e.hp<=0)continue;e.host.updateMatrixWorld(true);e.p.copy(e.local).applyMatrix4(e.host.matrixWorld);e.dir.set(0,0,1);e.cd-=dt;
    if(e.cd<=0){const tl=[S.pos,...B.allies.filter(a=>a.kind==='bmr'&&a.p.distanceTo(e.p)<2200).map(a=>a.p)].filter(p=>p.distanceTo(e.p)<2200);if(tl.length){e.cd=.9+Math.random()*.5;const tp=tl[Math.random()*tl.length|0],ld=L3B.subVectors(tp,e.p).normalize();ld.x+=(Math.random()-.5)*.02;ld.normalize();flyShot(e.p.clone(),ld,600,FBOLT,5,.4,4,false)}}}
  btlFx(S,dt);
  if(B.ph==='screen'&&!B.pass&&!B.passDone&&B.pt>20){const g=allyCruiser('VALIANT');g.position.copy(S.pos).add(new T.Vector3(1800,420,-2600));g.rotation.y=Math.PI;scene.add(g);B.pass={g,t:0};comm('C',"Valiant passing over you, Kestrel. Stay clear of her guns.")}
  if(B.pass){const P=B.pass;P.t+=dt;P.g.position.z+=70*dt;P.g.position.x-=20*dt;if(P.t>80){scene.remove(P.g);B.pass=null;B.passDone=1}else if(P.t>1&&P.g.position.distanceTo(S.pos)<500)S.pos.addScaledVector(L3A.subVectors(S.pos,P.g.position).normalize(),40*dt)}
  // the director
  const ph=B.ph,ves=B.ves;S.navP=S.navP||new T.Vector3();
  if(ph==='rally'){const d=ves.p.distanceTo(S.pos);S.navP.copy(ves.p);S.navL='VESPER';setObj('STAGE 3-1 · FORM UP ON VESPER · '+Math.round(d)+' M');
    if(d<450)B.near=(B.near||0)+dt;if(B.near>3||B.pt>60){B.ph='screen';B.pt=0;B.kill=0;comm('V',"On my wing. See that wall of red? That's the screen. We cut a hole in it.");comm('C',"All squadrons, engage the screen. Open a lane for the bombers.")}}
  else if(ph==='screen'){const left=Math.max(0,B.need-B.kill);setObj('STAGE 3-1 · BREAK THE INTERCEPTOR SCREEN · '+Math.round((1-left/B.need)*100)+'%');const near=S.en.filter(e=>e.kind==='int').sort((a,b)=>a.p.distanceTo(S.pos)-b.p.distanceTo(S.pos))[0];if(near){S.navP.copy(near.p);S.navL='SCREEN'}
    if(S.en.filter(e=>e.kind==='int').length<7&&B.kill<B.need&&B.t-(B.wT||0)>6){B.wT=B.t;btlWave(S,3+(Math.random()*2|0))}
    if(B.pt>45&&!B.said.bmb){B.said.bmb=1;for(let k=0;k<2;k++){const e=flyEnemyR('ebm',8200+k*300,200,-3200-k*300);e.tgtC=B.caps[0];const es=flyEnemy('int',e.p.x+60,e.p.y+40,e.p.z);es.esc=e}comm('C',"Enemy bombers on the Resolute! Kestrel, intercept!");say('ENEMY BOMBERS · PROTECT THE RESOLUTE',2.5)}
    if(B.kill>=B.need&&!S.en.some(e=>e.kind==='ebm')){B.ph='escort';B.pt=0;btlFlight(S);comm('V',"The screen's broken! Harbour, launch the bombers.");comm('C',"Halberd flights launching. Kestrel, Vesper: get them to Grief.")}}
  else if(ph==='escort'){const bm=B.allies.filter(a=>a.kind==='bmr'),tl=B.tur.filter(e=>e.hp>0).length,G=B.grief;setObj('STAGE 3-1 · ESCORT THE BOMBERS · '+bm.length+' FLYING · GRIEF TURRETS '+tl+' LEFT');
    S.navP.copy(G.p);S.navL='GRIEF';if(S.en.filter(e=>e.kind==='int').length<4&&B.pt<150)btlWave(S,3,true);
    if(bm.length===0&&!G.dead){if(B.flights<3){btlFlight(S);comm('C',"Flight down! Next flight launching, cover them this time!")}else{G.hp=Math.min(G.hp,300)}}
    if(tl===0&&!B.said.tur){B.said.tur=1;comm('V',"Turrets are down. Grief is naked. Bombers, she's all yours.")}
    if(G.dead&&G.dt>6){B.ph='batteries';B.pt=0;btlBatteries(S);comm('C',"Grief is breaking up! Outstanding!");comm('V',"Three batteries on the command ship's flank cover the Nova's lane. Silence them.")}}
  else if(ph==='batteries'){const bl=B.bat.filter(e=>e.hp>0);setObj('STAGE 3-1 · SILENCE THE COMMAND SHIP\'S BATTERIES · '+bl.length+' LEFT');if(bl[0]){S.navP.copy(bl.sort((a,b)=>a.p.distanceTo(S.pos)-b.p.distanceTo(S.pos))[0].p);S.navL='BATTERY'}
    if(B.pt>8&&!B.said.ion){B.said.ion=1;const e=flyEnemyR('eion',8800,400,-1500);comm('V',"Ion ship, high left! When it lights up, break the line. Don't fly straight at it.")}
    if(!bl.length){B.ph='done';S.ph='approach';comm('C',"Batteries silent. The lane is open. Kestrel, close to seven kilometres and send the Nova.");comm('V',"I've got your tail. Go.")}}
  // reinforcements now and then so the fleet keeps its size (about fifty allied ships over the battle)
  if(B.made<50&&B.allies.filter(a=>a.kind!=='bmr').length<14&&B.t-(B.rT||0)>20){B.rT=B.t;for(let i=0;i<4;i++)btlAlly(S,i%2?'int':'mrf',new T.Vector3(14500,(Math.random()-.5)*400,(Math.random()-.5)*2400),{sq:9});if(B.ph!=='rally')comm('C',"Fresh squadron off the Harbour, joining the fight.")}
  const RW={screen:[6,'Valiant\'s squadron, joining the screen fight.'],batteries:[6,'Two more squadrons up from the Harbour.'],fleet:[8,'Everything we have left is launching. Cover the Kestrel!']};const ph2=B.ph==='done'?S.ph:B.ph;  if(RW[ph2]&&!B.said['rw'+ph2]){B.said['rw'+ph2]=1;for(let i=0;i<RW[ph2][0];i++)btlAlly(S,i%2?'int':'mrf',new T.Vector3(14500,(Math.random()-.5)*500,(Math.random()-.5)*2600),{sq:8});comm('C',RW[ph2][1])}  if(B.ph==='escort'&&B.pt>55&&!B.said.f2){B.said.f2=1;btlFlight(S)}
  for(const e of S.en)if((e.kind==='int')&&(e.pickT=(e.pickT||0)-dt)<=0)btlPick(S,e);
  btlDraw(S)}
function btlWave(S,n,bomberHunt){const B=S.btl;for(let i=0;i<n;i++){const p=new T.Vector3(7000+Math.random()*1500,(Math.random()-.5)*800,(Math.random()-.5)*5000);const e=flyEnemy('int',p.x,p.y,p.z);btlPick(S,e);if(bomberHunt){const bm=B.allies.filter(a=>a.kind==='bmr');if(bm.length)e.tgtA=bm[i%bm.length]}}}
function btlFlight(S){const B=S.btl;B.flights++;for(let i=0;i<3;i++){const a=btlAlly(S,'bmr',new T.Vector3(14600+i*60,-150+i*40,600+i*90),{st:'run',side:i-1,sp:95});const f=btlAlly(S,'int',a.p.clone().add(new T.Vector3(-80,60,0)),{ward:a})}}
function btlTorp(S,a,G){const g=new T.Group();g.add(mesh(GEO.cyl,shuttleMats().msl,.5,4,.5),glow(0xffc070,14,1));g.children[0].rotation.x=Math.PI/2;g.position.copy(a.p);scene.add(g);
  S.btl.torps=S.btl.torps||[];S.btl.torps.push({g,p:g.position,dir:a.dir.clone(),spd:60,tgt:G,t:20});sfx('mortar');if(!S.btl.said.rel){S.btl.said.rel=1;comm('V',"Torpedoes away! Watch Grief's midships!")}}
function btlBatteries(S){const B=S.btl,DM=darkMats();B.plat=[];for(const z of[-2600,0,2600]){const h=new T.Group();h.position.set(2350,40,z);scene.add(h);B.plat.push(h);h.add(mesh(new T.CylinderGeometry(34,40,8,6),DM.hull||MAT.gunD,1,1,1,0,0,0),mesh(new T.CylinderGeometry(14,18,14,6),DM.hull||MAT.gunD,1,1,1,0,10,0));for(let k=0;k<6;k++){const q=glow(0xff3020,14,.9);q.position.set(Math.cos(k*1.047)*38,4,Math.sin(k*1.047)*38);h.add(q)}const e=btlTurret(S,h,new T.Vector3(0,20,0));e.kind='bat';e.hp=e.max=45;e.r=26;e.g.scale.setScalar(2.4);B.bat.push(e)}}
function btlFx(S,dt){const B=S.btl,G=B.grief;
  if(B.torps)for(let i=B.torps.length-1;i>=0;i--){const m=B.torps[i];m.t-=dt;m.spd=Math.min(260,m.spd+70*dt);const d=L3B.subVectors(m.tgt.p,m.p);const dd=d.length();m.dir.lerp(d.normalize(),Math.min(1,dt*.8)).normalize();m.p.addScaledVector(m.dir,m.spd*dt);m.g.lookAt(m.p.clone().add(m.dir));
    if(Math.random()<dt*20)PFX.smoke(m.p.clone(),{n:1,spd:.3,size:[3,9],life:2,up:0,c0:.6,c1:.85,alpha:.45});
    if(dd<m.tgt.r*.6||m.t<=0){scene.remove(m.g);B.torps.splice(i,1);if(m.t>0){bigBoom(m.p,140);G.hp-=110;btlScar(S,m.p)}}}
  if(S.torps)for(const m of S.torps){if(G&&!G.dead&&m.p.distanceTo(G.p)<G.r*.7)m.t=0}
  if(G&&!G.dead){const tl=B.tur.filter(e=>e.hp>0).length;if(G.hp<=0||G.hp<200&&tl===0){G.dead=1;G.dt=0;for(const e of B.tur)if(e.hp>0){e.hp=0;const i=S.en.indexOf(e);if(i>=0)S.en.splice(i,1)}}}
  if(G&&G.dead){G.dt+=dt;if(G.dt<5&&Math.random()<dt*7){const p=G.g.localToWorld(new T.Vector3((Math.random()-.5)*240,(Math.random()-.5)*120,(Math.random()-.5)*1200));bigFire(p,180+Math.random()*260,2,Math.random()<.5?0xffa040:0xff6a30,.9);if(Math.random()<.3)sfx('boom')}
    if(G.dt>2.2&&!G.split){G.split=1;btlSplit(S,G)}if(G.deb)for(const d of G.deb){d.m.position.addScaledVector(d.v,dt);d.m.rotation.x+=d.w.x*dt;d.m.rotation.y+=d.w.y*dt}if(G.halves)for(const h of G.halves){h.g.position.addScaledVector(h.v,dt);h.g.rotation.x+=h.w.x*dt;h.g.rotation.z+=h.w.z*dt}}}
// a torpedo hit leaves a fire burning on the hull
function btlScar(S,p){const G=S.btl.grief;const lp=G.g.worldToLocal(p.clone());lp.multiplyScalar(.9);const f=PFX.emit(()=>{const v=G.g.localToWorld(lp.clone());return v},{rate:10,dur:60,fire:true,ss:[8,30],slife:2.6,far:9000,c0:.15,c1:.4,alpha:.6});G.fires.push(f)}
// break-up: two halves, each clipped from the hull, drift and tumble apart, still burning
function btlSplit(S,G){renderer.localClippingEnabled=true;const n=new T.Vector3(0,0,1).applyQuaternion(G.g.quaternion),c=G.p.clone();G.halves=[];
  for(const s of[1,-1]){const pl=new T.Plane(n.clone().multiplyScalar(s),-s*n.dot(c));const h=G.g.clone(true);h.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.clippingPlanes=[pl];o.material.clipShadows=true}});scene.add(h);
    G.halves.push({g:h,v:n.clone().multiplyScalar(s*9).add(new T.Vector3(0,-3*s,4)),w:new T.Vector3(s*.012,0,s*.02)})}
  G.g.visible=false;bigBoom(c,420);G.deb=[];const DM=darkMats();for(let k=0;k<26;k++){const m=new T.Mesh(GEO.box,DM.hull||MAT.gunD);m.scale.set(8+Math.random()*30,4+Math.random()*12,8+Math.random()*40);m.position.copy(c).add(new T.Vector3((Math.random()-.5)*200,(Math.random()-.5)*80,(Math.random()-.5)*500));scene.add(m);G.deb.push({m,v:new T.Vector3((Math.random()-.5)*40,(Math.random()-.5)*30,(Math.random()-.5)*40),w:new T.Vector3(Math.random(),Math.random(),Math.random())})}bigFire(c,1600,3,0xfff0d0,1);if(!reduced)shake=Math.max(shake,.6)}
// draw the allied fleet: write each instance matrix (models face -z, so they look away from where they go)
function btlDraw(S){const B=S.btl,cnt={int:0,mrf:0,bmr:0};for(const a of B.allies){const P=FIP[a.kind];if(!P)continue;const i=cnt[a.kind]++;if(i>=P.cap)continue;FIO.position.copy(a.p);FIO.lookAt(L3A.copy(a.p).sub(a.dir));FIO.scale.setScalar(1);FIO.updateMatrix();for(const im of P.ims)im.setMatrixAt(i,FIO.matrix)}
  for(const k in cnt){const P=FIP[k];if(!P)continue;for(const im of P.ims){im.count=Math.min(cnt[k],P.cap);im.instanceMatrix.needsUpdate=true}}}
// allies take hits from enemy fire (the shots loop asks here) and bomber torpedoes hit capital ships
function btlAllyHit(S,q){const B=S.btl;if(!B)return false;for(const a of B.allies){if(segDist(q.prev,q.p,a.p)<a.r){if(!a.ace)a.hp-=q.dmg;sparkle(a.p,0xffd27a,2,6);return true}}
  for(const c of B.caps){if(q.p.distanceTo(c.p)<c.r*2.5&&segDist(q.prev,q.p,c.p)<c.r){c.hp=Math.max(80,c.hp-q.dmg*.2);sparkle(q.p,0xffd27a,3,14);return true}}return false}
function btlClear(S){const B=S&&S.btl;for(const k in FIP)fiShow(FIP[k],false);if(!B)return;for(const c of B.caps)scene.remove(c.g);if(B.grief){scene.remove(B.grief.g);for(const h of B.grief.halves||[])scene.remove(h.g);for(const d of B.grief.deb||[])scene.remove(d.m)}if(B.pass)scene.remove(B.pass.g);for(const h of B.plat||[])scene.remove(h);for(const m of B.torps||[])scene.remove(m.g);S.btl=null}
// markers for allies worth watching: Vesper and the bombers (green), at most six
function btlMarks(S,box,W,H){const B=S.btl;let L=B?[B.ves,...B.allies.filter(a=>a.kind==='bmr')].filter(a=>a&&a.hp>0).slice(0,6):[];B&&(B.mk=B.mk||[]);if(!B)return;
  for(let i=0;i<Math.max(L.length,B.mk.length);i++){let d=B.mk[i];const a=L[i];if(!d){d=document.createElement('div');d.className='tg ally';d.appendChild(document.createElement('i'));box.appendChild(d);B.mk[i]=d}
    if(!a){d.hidden=true;continue}fv1.copy(a.p).project(cam);if(fv1.z>1||Math.abs(fv1.x)>1||Math.abs(fv1.y)>1){d.hidden=true;continue}d.hidden=false;d.style.left=((fv1.x*.5+.5)*W)+'px';d.style.top=((-fv1.y*.5+.5)*H)+'px';
    d.firstChild.textContent=a.ace?'VESPER':'HALBERD '+Math.max(0,Math.round(a.hp/a.max*100))+'%'}}
