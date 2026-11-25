// Stage 3-1 battle, played by a stepped bot that aims and fires like a player (yaw/pitch toward the target's lead, fire when
// lined up, missiles when locked). Records simulated time per phase, allies alive and made, kills, draw calls and triangles
// in the busiest moment, and pictures. Damage to the player is off (the bot is not a good pilot); deaths are tested elsewhere.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:960,height:600}});q.setDefaultTimeout(1800000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(4000);
const X=c=>q.evaluate(c=>window.__x(c),c);const R=(id,ok,t)=>console.log((ok?'PASS ':'FAIL ')+id+' '+t);
const shot=async n=>{await q.waitForTimeout(2600);await q.screenshot({path:'btl/'+n+'.png'})};fs.mkdirSync('btl',{recursive:true});
await q.addStyleTag({content:'#comm{display:none!important}'});
await X(`window.__st=(n,fn)=>{for(let i=0;i<n;i++){if(state!=='playing')break;update(1/30);if(FLY)flyCam(1/30);time+=1/30;if(fn&&fn())break}};
 window.__bot=(n,pick)=>{const S=FLY;let k=0;for(;k<n;k++){if(state!=='playing'||!FLY)break;const tg=pick();if(tg){const lead=tg.p.clone().addScaledVector(tg.dir||new T.Vector3(),tg.p.distanceTo(S.pos)/900*(tg.sp||0));const d=lead.sub(cam.position);
   const dist=tg.p.distanceTo(S.pos);yaw=Math.atan2(-d.x,-d.z);pitch=Math.max(-1.2,Math.min(1.2,Math.atan2(d.y,Math.hypot(d.x,d.z))));S.thr=dist>900?1:dist<250?.3:.6;firing=dist<900&&Math.abs(ad(yaw,S.h))<.08;if(S.lockE&&S.lockP>=.6&&S.msl>0&&S.mcd<=0&&Math.random()<.05)grenade();
   if(dist<140){yaw+=1.2}}else{firing=false}update(1/30);if(FLY)flyCam(1/30);time+=1/30;hp=Math.max(hp,60);shield=Math.max(shield,30)}firing=false;return k};0`);
await X(`INTRO.on=false;WAL.ship='kestrel';startAt(4,1);__st(1600,()=>FLY&&FLY.btl);0`);
let r=JSON.parse(await X(`const B=FLY.btl;JSON.stringify({ph:B&&B.ph,allies:B&&B.allies.length,caps:B&&B.caps.length,en:FLY.en.length,tur:B&&B.tur.length})`));
R('3-1 arrives in a battle already under way',r.ph==='rally'&&r.allies>=16&&r.caps===3&&r.en>=8,JSON.stringify(r));
await X(`const v=FLY.btl.ves.p,d=v.clone().sub(cam.position);yaw=Math.atan2(-d.x,-d.z)+.25;pitch=-.05;0`);await shot('1_arrival');
const T0=Date.now();const ph={};let last='rally',tp=0;
const stepPhase=async(name,pick,maxS)=>{let t=0;while(t<maxS){const k=await X(`__bot(150,${pick});FLY&&FLY.btl?FLY.btl.ph:'?'`);t+=5;const p=await X(`FLY&&FLY.btl?FLY.btl.ph:(FLY?FLY.ph:'none')`);if(p!==name)break}return t};
// rally: fly to Vesper
ph.rally=await stepPhase('rally',`()=>({p:FLY.btl.ves.p,dir:FLY.btl.ves.dir,sp:120})`,90);
r=JSON.parse(await X(`JSON.stringify({ph:FLY.btl.ph})`));R('rally on Vesper, then the screen',r.ph==='screen','after '+ph.rally+' s simulated');
await X(`const e=FLY.en.filter(e=>e.kind==='int').sort((a,b)=>a.p.distanceTo(FLY.pos)-b.p.distanceTo(FLY.pos))[0];if(e){const d=e.p.clone().sub(cam.position);yaw=Math.atan2(-d.x,-d.z);pitch=Math.atan2(d.y,Math.hypot(d.x,d.z))}0`);await shot('2_screen');
// busiest moment: draw calls and triangles
r=JSON.parse(await X(`renderer.info.autoReset=false;renderer.info.reset();const t0=performance.now();composer.render();const ms=performance.now()-t0;const R2=renderer.info.render;let sim=performance.now();for(let i=0;i<30;i++){update(1/30);time+=1/30}sim=(performance.now()-sim)/30;
  JSON.stringify({calls:R2.calls,tris:R2.triangles,renderMs:Math.round(ms),simMsPerFrame:+sim.toFixed(1),allies:FLY.btl.allies.length,enemies:FLY.en.length,shots:FLY.shots.length})`));console.log('INFO busiest '+JSON.stringify(r));
ph.screen=await stepPhase('screen',`()=>{const L=FLY.en.filter(e=>e.kind==='ebm'||e.kind==='int');return L.sort((a,b)=>(a.kind==='ebm'?-1e4:0)+a.p.distanceTo(FLY.pos)-((b.kind==='ebm'?-1e4:0)+b.p.distanceTo(FLY.pos)))[0]}`,420);
r=JSON.parse(await X(`const B=FLY.btl;JSON.stringify({ph:B.ph,kill:B.kill,playerKills:FLY.kills,allies:B.allies.length,made:B.made,lost:B.lost})`));R('break the interceptor screen (allies and you), the bombers launch',r.ph==='escort','after '+ph.screen+' s · '+JSON.stringify(r));
await shot('3_escort_launch');
ph.escort=await stepPhase('escort',`()=>{const B=FLY.btl,t=B.tur.filter(e=>e.hp>0).sort((a,b)=>a.p.distanceTo(FLY.pos)-b.p.distanceTo(FLY.pos))[0];if(t&&t.p.distanceTo(FLY.pos)<2500)return t;const bm=B.allies.find(a=>a.kind==='bmr');const th=bm&&FLY.en.filter(e=>e.kind==='int'&&e.tgtA===bm)[0];return th||t||(bm?{p:bm.p,dir:bm.dir,sp:115}:null)}`,420);
r=JSON.parse(await X(`const B=FLY.btl;JSON.stringify({ph:B.ph,grief:B.grief.dead?'broken up':Math.round(B.grief.hp),tur:B.tur.filter(e=>e.hp>0).length,flights:B.flights,allies:B.allies.length,made:B.made})`));R('escort the bombers, Grief\'s turrets down, Grief breaks up',r.ph==='batteries'&&r.grief==='broken up','after '+ph.escort+' s · '+JSON.stringify(r));
await X(`const G=FLY.btl.grief,d=G.p.clone().sub(cam.position);yaw=Math.atan2(-d.x,-d.z);pitch=Math.atan2(d.y,Math.hypot(d.x,d.z));0`);await shot('4_grief_breakup');
ph.batteries=await stepPhase('batteries',`()=>{const B=FLY.btl,io=FLY.en.find(e=>e.kind==='eion');if(io&&io.p.distanceTo(FLY.pos)<2500)return io;return B.bat.filter(e=>e.hp>0).sort((a,b)=>a.p.distanceTo(FLY.pos)-b.p.distanceTo(FLY.pos))[0]}`,300);
r=JSON.parse(await X(`JSON.stringify({bph:FLY.btl.ph,ph:FLY.ph})`));R('silence the command ship\'s batteries; the Nova lane opens',r.ph==='approach'||r.ph==='armed','after '+ph.batteries+' s · '+JSON.stringify(r));
// the Nova: close to 7 km and launch, watch it travel and hit the shield
let t=0;while(t<120){await X(`__bot(150,()=>({p:new T.Vector3(0,0,0),dir:new T.Vector3(),sp:0}))`);t+=5;if(await X(`FLY.ph`)==='armed')break}ph.nova=t;
r=JSON.parse(await X(`grenade();__st(5);JSON.stringify({ph:FLY.ph})`));R('launch the Nova when armed',r.ph==='warhead',JSON.stringify(r));
r=JSON.parse(await X(`__st(900,()=>FLY.ph==='det');const N=FLY.dr.g.position;yaw=Math.atan2(FLY.pos.x-N.x,FLY.pos.z-N.z);pitch=0;JSON.stringify({ph:FLY.ph})`));await shot('5_nova');ph.nova+=30;
R('the Nova hits the shield (and nothing happens)',r.ph==='det',JSON.stringify(r));
r=JSON.parse(await X(`__st(600,()=>FLY.landOK);JSON.stringify({ph:FLY.ph,landOK:FLY.landOK,allies:FLY.btl?FLY.btl.allies.length:0,made:FLY.btl?FLY.btl.made:0})`));ph.reinforce=20;
R('reinforcements jump in, the landing order comes',r.landOK,JSON.stringify(r));await shot('6_reinforcements');
const sim=Object.values(ph).reduce((a,b)=>a+b,0);console.log('INFO phases (simulated seconds) '+JSON.stringify(ph)+' total '+sim+' s ('+(sim/60).toFixed(1)+' min) · wall clock '+Math.round((Date.now()-T0)/1000)+' s');
r=JSON.parse(await X(`JSON.stringify({made:FLY.btl?FLY.btl.made:0})`));R('about fifty allied ships take part over the battle',r.made>=40,JSON.stringify(r));
// the shield lets a slow ship through and bounces a fast one; land in the bay; the 3-1 card
r=JSON.parse(await X(`FLY.pos.set(2150,20,0);FLY.lastOut.copy(FLY.pos);FLY.inSh=false;FLY.h=Math.PI/2;yaw=FLY.h;pitch=0;FLY.thr=1;FLY.spd=150;__st(40);const fast=[FLY.pos.x.toFixed(0),FLY.inSh];
  FLY.pos.set(2150,20,0);FLY.lastOut.copy(FLY.pos);FLY.inSh=false;FLY.h=Math.PI/2;yaw=FLY.h;FLY.repT=0;FLY.thr=.3;FLY.spd=60;keys.Space=false;__st(200);const slow=[FLY.pos.x.toFixed(0),FLY.inSh];JSON.stringify([fast,slow])`));
R('the shield bounces a fast ship and lets a slow one through',!r[0][1]&&r[1][1],JSON.stringify(r));
r=JSON.parse(await X(`FLY.pos.set(1500,20,0);FLY.h=Math.PI/2;yaw=FLY.h;FLY.spd=40;FLY.thr=.2;__st(600,()=>state!=='playing');JSON.stringify([state,$('ovTitle').textContent,$('go').textContent,M3,FIP?Object.values(FIP).reduce((n,P)=>n+P.ims.reduce((m,im)=>m+im.count,0),0):-1])`));
R('land in the bay: the 3-1 card, Continue to 3-2',r[1]==='Stage 3-1 complete'&&r[2]==='Continue to stage 3-2',JSON.stringify(r));
// a death in the middle of the battle, then Retry: a fresh battle, nothing left over
r=JSON.parse(await X(`startAt(4,1);__st(1600,()=>FLY&&FLY.btl&&FLY.btl.ph==='screen'||FLY&&FLY.btl&&FLY.btl.t>20);const a=FLY.btl.allies.length;window.__realHurt=true;hurt(99999,FLY.pos);window.__realHurt=false;JSON.stringify([state,$('retry').textContent,a])`));
R('dying in the battle offers Retry stage 3-1',r[0]==='dead'&&r[1]==='Retry stage 3-1',JSON.stringify(r));
r=JSON.parse(await X(`$('retry').click();__st(1600,()=>FLY&&FLY.btl);const B=FLY&&FLY.btl;JSON.stringify({st:FLY&&FLY.stage,ph:B&&B.ph,allies:B&&B.allies.length,made:B&&B.made,caps:B&&B.caps.length,en:FLY&&FLY.en.length,state})`));
R('Retry starts a fresh battle (allies and capital ships reset)',r.st===31&&r.ph==='rally'&&r.allies>=16&&r.allies<=20&&r.caps===3&&r.state==='playing',JSON.stringify(r));
console.log('errs',errs.length,errs.slice(0,6));await b.close()})();
