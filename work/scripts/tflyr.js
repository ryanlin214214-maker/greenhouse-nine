// Ship roster: every ship takes off from Hangar 0, handling numbers, guns, its special, landing and relaunch; enemy bomber
// and ion ship (hit when you sit still, miss when you break); buying, switching and the save; Hangar 0 clearance; pictures.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:900,height:560}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
const PG='file://'+process.cwd()+'/gtest/'+process.argv[2];await q.goto(PG,{timeout:240000});await q.waitForTimeout(4000);
const X=c=>q.evaluate(c=>window.__x(c),c);const R=(id,ok,t)=>console.log((ok?'PASS ':'FAIL ')+id+' '+t);const D='ships/';
const shot=async(n,w)=>{await q.waitForTimeout(w||2200);await q.screenshot({path:D+n+'.png'})};
await q.addStyleTag({content:'#comm{display:none!important}'});
await X(`INTRO.on=false;setState('playing');enemies.length=0;window.__st=(n,fn)=>{for(let i=0;i<n;i++){if(state!=='playing')break;update(1/30);if(FLY)flyCam(1/30);time+=1/30;if(fn&&fn())break}};0`);
await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(1500);
if(!process.env.SKIP){
// Hangar 0: display ships clear of each other, the walls, the launch lane and Teo's kiosk; you can walk to every sign and to the board point
let r=JSON.parse(await X(`const P=HUB.padBox,bad=[];for(let i=0;i<P.length;i++){const a=P[i];if(a[0]<-80||a[2]>80||a[1]<1087||a[3]>1199)bad.push(a[4]+' wall');if(a[2]>-13&&a[0]<13)bad.push(a[4]+' lane');if(a[2]>17&&a[0]<27&&a[3]>1094&&a[1]<1102)bad.push(a[4]+' kiosk');for(let j=i+1;j<P.length;j++){const c=P[j];if(a[0]<c[2]&&a[2]>c[0]&&a[1]<c[3]&&a[3]>c[1])bad.push(a[4]+'/'+c[4])}}JSON.stringify({n:P.length,bad,boxes:P.map(p=>p[4]+':'+p.slice(0,4).map(v=>v.toFixed(0)).join(','))})`));
R('Hangar 0 display ships clear of walls, lane, kiosk and each other',r.n===6&&!r.bad.length,JSON.stringify(r));
r=JSON.parse(await X(`const res=[];const go=(tx,tz)=>{let n=0;keys.KeyW=true;for(;n<420;n++){const dx=HC.x+tx-pos.x,dz=HC.z-1100+tz-pos.z;if(Math.hypot(dx,dz)<2.5)break;yaw=Math.atan2(-dx,-dz);update(1/30);hubTick(1/30)}keys.KeyW=false;return Math.hypot(HC.x+tx-pos.x,HC.z-1100+tz-pos.z)};
 pos.set(HC.x,0,HC.z-1100+1088);for(const id in PAD93){const bx=HUB.padBox.find(q=>q[4]===id),tx=(bx[0]+bx[2])/2,tz=bx[1]-3;res.push(id+':'+go(tx,tz).toFixed(1));pos.set(HC.x,0,HC.z-1100+1088)}
 const d=go(-34.5,1100);hubTick(1/30);res.push('board:'+d.toFixed(1)+':'+(HUB.near&&HUB.near.k));JSON.stringify(res)`));
R('walk from the concourse door to the front of every display ship and to the board point',r.every(s=>+s.split(':')[1]<3)&&/:x$/.test(r[r.length-1]),JSON.stringify(r));
await X(`pos.set(HC.x+4,0,HC.z-1100+1090);yaw=Math.PI*.98;pitch=-.02;for(let i=0;i<3;i++){update(1/30);hubTick(1/30)}eye.set(pos.x,pos.y+EYE,pos.z);0`);await shot('h0_display');
await X(`pos.set(HC.x+40,0,HC.z-1100+1120);yaw=Math.PI*.7;pitch=-.04;for(let i=0;i<3;i++){update(1/30);hubTick(1/30)}eye.set(pos.x,pos.y+EYE,pos.z);0`);await shot('h0_display2');
// purchase and switch, and the save survives a reload
r=JSON.parse(await X(`WAL.cr=40000;WAL.ships=['kestrel'];WAL.ship='kestrel';walSave();HUB.shop='s';shopRender();const n0=document.querySelectorAll('#shopBody .card').length;const i=SHIPK.indexOf('halberd');shopBuy(i);const a=[WAL.ship,WAL.cr,HUB.myShip&&HUB.myShip.userData.id];shopBuy(SHIPK.indexOf('kestrel'));const b2=[WAL.ship,HUB.myShip.userData.id];shopBuy(i);JSON.stringify({cards:n0,a,b:b2,c:[WAL.ship,WAL.ships.join(',')],ls:localStorage.getItem('gh9-wallet')})`));
R('buy the Halberd, switch back to the Kestrel and again (your pad shows the ship you chose)',r.cards===7&&r.a[0]==='halberd'&&r.a[1]===34000&&r.a[2]==='halberd'&&r.b[1]==='kestrel',JSON.stringify(r).slice(0,300));
await X(`$('shop').hidden=false;0`);await q.waitForTimeout(800);await q.screenshot({path:D+'shipwright.png'});await X(`$('shop').hidden=true;0`);
await q.reload({timeout:240000});await q.waitForTimeout(4000);await q.addStyleTag({content:'#comm{display:none!important}'});
await X(`INTRO.on=false;setState('playing');enemies.length=0;window.__st=(n,fn)=>{for(let i=0;i<n;i++){if(state!=='playing')break;update(1/30);if(FLY)flyCam(1/30);time+=1/30;if(fn&&fn())break}};0`);
r=JSON.parse(await X(`JSON.stringify([WAL.ship,WAL.ships.join(',')])`));R('after a reload the wallet keeps the Halberd as your ship',r[0]==='halberd',JSON.stringify(r));
}
await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(1500);
// per ship: take-off, handling, guns, special, landing, relaunch
const ids=process.env.ONLY?process.env.ONLY.split(','):['kestrel','swiftwing','lancer','wisp','halberd','arclight','bastion'];const table=[];
for(const id of ids){
 r=JSON.parse(await X(`WAL.ships=['kestrel','swiftwing','lancer','wisp','halberd','arclight','bastion'];WAL.ship='${id}';if(!HUB.on)hubEnter();hubMyShip();const g0=HUB.myShip.position.y-(HUB.myShip.userData.gy||2.05);hubLaunch();const y0=FLY.pos.y-(FLY.g.userData.gy||2.05);__st(400,()=>FLY.ph==='free');JSON.stringify({ph:FLY.ph,model:FLY.g.userData.id,padGap:+g0.toFixed(3),startGap:+y0.toFixed(3)})`));
 R(id+': take-off from Hangar 0 (wheels on the pad, model '+r.model+')',r.ph==='free'&&r.model===id&&Math.abs(r.padGap-.065)<.01&&Math.abs(r.startGap-.07)<.02,JSON.stringify(r));
 // handling, away from the station
 r=JSON.parse(await X(`const S=FLY,O=S.org;const put=()=>{S.pos.set(O.x,700,O.z+5200);S.h=0;S.p=0;S.roll=0;yaw=0;pitch=0;S.vel.set(0,0,0)};put();S.spd=0;S.thr=1;keys.ShiftLeft=false;CFG.auto=false;let t=0;while(S.spd<.9*S.ship.cruise&&t<20){__st(1);t+=1/30}const acc=t;
  keys.ShiftLeft=true;S.boost=1;t=0;while(S.spd<.9*S.ship.boost&&t<20){__st(1);t+=1/30}const bacc=t;t=0;while(S.boost>.05&&t<20){__st(1);t+=1/30}const bdur=t+bacc;keys.ShiftLeft=false;
  put();S.spd=S.ship.cruise;S.thr=1;keys.Space=true;t=0;while(S.spd>.1*S.ship.cruise&&t<20){__st(1);t+=1/30}const brk=t;keys.Space=false;
  put();S.spd=S.ship.cruise;S.thr=1;yaw=1.5;t=0;while(Math.abs(ad(yaw,S.h))>.05&&t<20){__st(1);t+=1/30;yaw=1.5}const turn=t;CFG.auto=true;
  JSON.stringify({acc:+acc.toFixed(2),boostAcc:+bacc.toFixed(2),boostLasts:+bdur.toFixed(1),brake:+brk.toFixed(2),turn90:+turn.toFixed(2),cruise:Math.round(S.ship.cruise*MPH),boost:Math.round(S.ship.boost*MPH)})`));
 table.push(id+' '+JSON.stringify(r));console.log('INFO handling '+id+' '+JSON.stringify(r));
 // guns into a gunboat 500 m ahead for 2 s
 r=JSON.parse(await X(`const S=FLY,O=S.org;S.pos.set(O.x,700,O.z+5200);S.h=Math.PI;yaw=Math.PI;pitch=0;S.p=0;S.spd=0;S.thr=0;for(const e of S.en.slice()){scene.remove(e.g)}S.en.length=0;const e=flyEnemy('gun',S.pos.x,S.pos.y,S.pos.z+500);e.sp=0;e.cd=99;
  firing=true;let shots=0;const n0=S.shots.length;for(let i=0;i<60;i++){const c=S.shots.length;__st(1);shots+=Math.max(0,S.shots.length-c);e.cd=99;yaw=Math.atan2(-(e.p.x-cam.position.x),-(e.p.z-cam.position.z));pitch=Math.atan2(e.p.y-cam.position.y,Math.hypot(e.p.x-cam.position.x,e.p.z-cam.position.z))}firing=false;__st(20);JSON.stringify({prim:S.ship.prim||'guns',shots,dmg:+(40-Math.max(0,e.hp)).toFixed(1),heat:Math.round(S.heat)})`));
 R(id+': primary weapon fires and hits (2 s at a gunboat)',r.dmg>5,JSON.stringify(r));
 await shot('fly_'+id,1500);
 // the special
 const sp=await X(`FLY.ship.spec`);let rs='';
 if(sp==='torp'){rs=await X(`const S=FLY;for(const e of S.en.slice())scene.remove(e.g);S.en.length=0;const e=flyEnemy('gun',S.pos.x,S.pos.y,S.pos.z+1500);e.sp=0;e.cd=99;e.hp=e.max=400;yaw=Math.PI;pitch=0;__st(25);melee();__st(10);const arming=S.arm>0,bay=S.g.userData.bay.open;0;JSON.stringify({arming,bay:+bay.toFixed(2)})`);
   await shot('sp_halberd_arming',900);
   rs+=' '+await X(`const S=FLY,e=S.en[0];__st(40);const t=!!(S.torps&&S.torps.length),tg=t&&S.torps[0].tgt===e;let n=0;while(S.torps.length&&n<600){__st(1);e.cd=99;n++}JSON.stringify({launched:t,tracking:tg,hp:Math.round(e.hp),secs:+(n/30).toFixed(1),torpLeft:S.torp})`);
   await shot('sp_halberd_boom',300)}
 else if(sp==='vent'){rs=await X(`const S=FLY;for(const e of S.en.slice())scene.remove(e.g);S.en.length=0;const e=flyEnemyR('eion',S.pos.x,S.pos.y,S.pos.z+800);e.sp=0;e.cd=99;e.hp=e.max=400;yaw=Math.PI;pitch=0;__st(5);firing=true;const st=[];for(let i=0;i<80;i++){__st(1);e.cd=99;if(i%26===25)st.push(+(S.ionC||0).toFixed(2))}JSON.stringify({stages:st,energy:Math.round(S.enr),heat:Math.round(S.heat)})`);
   await shot('sp_arclight_charge',100);rs+=' '+await X(`const S=FLY,e=S.en[0];firing=false;__st(2);JSON.stringify({hp:Math.round(e.hp),shield:Math.round(e.shp),disrupted:+(e.dis||0).toFixed(1)})`);await shot('sp_arclight_fire',50)}
 else if(sp==='ew'){rs=await X(`const S=FLY;for(const e of S.en.slice())scene.remove(e.g);S.en.length=0;for(let k=0;k<3;k++){const e=flyEnemy('int',S.pos.x+(k-1)*120,S.pos.y,S.pos.z+900);e.sp=0;e.cd=99}yaw=Math.PI;pitch=0;__st(3);melee();__st(2);const mk=S.en.filter(e=>e.mark>0).length;
   const a=flyEnemy('ace',S.pos.x,S.pos.y+50,S.pos.z-1500);a.sp=0;S.emsl=S.emsl||[];aceMissile(S,a);const m=S.emsl[S.emsl.length-1];flyDecoy();const dec=!!m.dec;const hp0=hp;window.__realHurt=true;let gone=0;for(let i=0;i<300&&S.emsl.includes(m);i++){__st(1);a.cd=99}window.__realHurt=false;JSON.stringify({marked:mk,jammed:S.en.filter(e=>e.jam>0).length,decoyed:dec,missileGone:!S.emsl.includes(m),hpLoss:Math.round(hp0-hp)})`);await shot('sp_wisp',300)}
 else if(sp==='flak'){rs=await X(`const S=FLY;for(const e of S.en.slice())scene.remove(e.g);S.en.length=0;for(let k=0;k<4;k++){const e=flyEnemy('int',S.pos.x+Math.cos(k)*300,S.pos.y+80,S.pos.z+Math.sin(k)*300);e.sp=0;e.cd=99}const n0=S.en.length;melee();__st(15);JSON.stringify({before:n0,after:S.en.length,hp:S.en.map(e=>Math.round(e.hp))})`);await shot('sp_bastion_flak',100)}
 else if(sp==='dash'){rs=await X(`const S=FLY;S.spd=S.ship.cruise;S.thr=1;melee();__st(25);JSON.stringify({dash:+S.dash.toFixed(2),spd:Math.round(S.spd*MPH),boostMax:Math.round(S.ship.boost*MPH)})`)}
 else rs=await X(`const S=FLY;S.mac=0;melee();JSON.stringify({heavyCannon:S.mac>0})`);
 const o=JSON.parse(rs.split(' ').pop()),o0=rs.includes(' ')?JSON.parse(rs.split(' ')[0]):{};
 const ok=sp==='torp'?o0.arming&&o0.bay>.5&&o.launched&&o.tracking&&o.hp<400-150:sp==='vent'?o.disrupted>0&&o.shield<60&&o0.stages&&o0.stages[2]===1:sp==='ew'?o.marked===3&&o.decoyed&&o.missileGone&&o.hpLoss===0:sp==='flak'?o.after<o.before||o.hp.some(h=>h<6):sp==='dash'?o.dash>0&&o.spd>o.boostMax:o.heavyCannon;
 R(id+': special ('+sp+')',ok,rs);
 // landing back in Hangar 0, then relaunch
 r=JSON.parse(await X(`const S=FLY,O=S.org;for(const e of S.en.slice())scene.remove(e.g);S.en.length=0;S.pos.set(O.x,20,O.z+1170);S.h=0;yaw=0;pitch=0;S.p=0;S.spd=40;S.thr=.2;__st(400,()=>!FLY);const sh=HUB.myShip;JSON.stringify({onFoot:!FLY&&HUB.on,model:sh&&sh.userData.id,padGap:sh?+(sh.position.y-(sh.userData.gy||2.05)).toFixed(3):null})`));
 R(id+': lands in Hangar 0 and you are back on foot by your ship',r.onFoot&&r.model===id&&Math.abs(r.padGap-.065)<.01,JSON.stringify(r));
 if(id==='halberd'||id==='arclight'){r=JSON.parse(await X(`hubLaunch();__st(400,()=>FLY.ph==='free');JSON.stringify({ph:FLY.ph,model:FLY.g.userData.id})`));R(id+': relaunch after landing',r.ph==='free'&&r.model===id,JSON.stringify(r));
   await X(`const S=FLY,O=S.org;S.pos.set(O.x,20,O.z+1170);S.h=0;yaw=0;S.spd=40;__st(400,()=>!FLY);0`)}}
// enemy bomber: commits to a run, opens its bay and drops a torpedo that hits a pilot who sits still; enemy ion ship: telegraph, hit, miss
r=JSON.parse(await X(`WAL.ship='kestrel';hubLaunch();__st(400,()=>FLY.ph==='free');const S=FLY,O=S.org;S.pos.set(O.x,700,O.z+5200);S.h=Math.PI;yaw=Math.PI;pitch=0;S.spd=0;S.thr=0;for(const e of S.en.slice())scene.remove(e.g);S.en.length=0;
 const e=flyEnemyR('ebm',S.pos.x+200,S.pos.y,S.pos.z+3000);e.dir.set(0,0,-1);const seen={};let tp=0;window.__realHurt=true;const hp0=hp+shield;for(let i=0;i<1500;i++){__st(1);S.pos.set(O.x,700,O.z+5200);S.spd=0;seen[e.st]=1;if(S.etp&&S.etp.length)tp=1;if(S.etp&&!S.etp.length&&tp&&i>300)break}window.__realHurt=false;
 JSON.stringify({phases:Object.keys(seen),torpedo:tp,loss:Math.round(hp0-hp-shield)})`));
R('enemy bomber: approach, attack run with its torpedo, break away; the torpedo hits a ship that sits still',r.phases.includes('run')&&r.torpedo&&r.loss>0,JSON.stringify(r));
await X(`const S=FLY;for(const e of S.en.slice())scene.remove(e.g);S.en.length=0;S.etp&&S.etp.forEach(m=>scene.remove(m.g));S.etp=[];hp=100;shield=shMax;0`);
for(const evade of[0,1]){r=JSON.parse(await X(`const S=FLY,O=S.org;S.pos.set(O.x,700,O.z+5200);S.spd=0;for(const e of S.en.slice())scene.remove(e.g);S.en.length=0;const e=flyEnemyR('eion',S.pos.x,S.pos.y,S.pos.z+2000);e.dir.set(0,0,-1);e.cd=0;hp=100;shield=shMax;
  window.__realHurt=true;let warned=0,line=0,t=0,fired=0;const hp0=hp+shield;for(let i=0;i<500;i++){__st(1);if(${evade}&&e.ch>0&&e.ch<1.8){S.pos.x+=160/30}else if(!${evade})S.pos.set(O.x,700,O.z+5200);S.spd=0;if(e.ch>0){warned=1;if(e.ln)line=1}if(warned&&!(e.ch>0)){fired=1;break}}__st(5);window.__realHurt=false;
  JSON.stringify({warned,line,fired,loss:Math.round(hp0-hp-shield),dis:+(S.dis||0).toFixed(1)})`));
 R('enemy ion ship: charge warning and aim line, then '+(evade?'a pilot who breaks the line is missed':'a pilot who sits still is hit and disrupted'),r.warned&&r.line&&r.fired&&(evade?r.loss===0:r.loss>0),JSON.stringify(r));
 if(!evade){await X(`const S=FLY,O=S.org;S.pos.set(O.x,700,O.z+5200);for(const e of S.en.slice())scene.remove(e.g);S.en.length=0;const e=flyEnemyR('eion',S.pos.x+300,S.pos.y+40,S.pos.z+1500);e.dir.set(0,0,-1);e.cd=0;for(let i=0;i<55;i++){__st(1);S.pos.set(O.x,700,O.z+5200);S.spd=0}yaw=Math.PI+.15;pitch=0;0`);await shot('enemy_ion_telegraph',600)}}
console.log('INFO table\n'+table.join('\n'));console.log('errs',errs.length,errs.slice(0,5));await b.close()})();
