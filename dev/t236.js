// Mission 3 and 4 end to end: 3-1 -> 3-2 -> 3-3 -> 4-1 through the cards, deaths and retries, saves, and the world swap restored
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:960,height:600}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+(process.argv[2]||'t107x.html'),{timeout:240000});await q.waitForTimeout(5000);
const X=c=>q.evaluate(c=>window.__x(c),c);const out=[];const R=(id,ok,t)=>{out.push((ok?'PASS ':'FAIL ')+id+' '+t);console.log((ok?'PASS ':'FAIL ')+id+' '+t)};
const shot=async n=>{await q.waitForTimeout(2500);await q.screenshot({path:'l3_'+n+'.png'})};
await q.addStyleTag({content:'#comm,#comms{display:none!important}'});
await X(`window.__st=(n,fn)=>{for(let i=0;i<n;i++){if(state!=='playing')break;update(1/30);if(CMD.on)cmdTick(1/30);time+=1/30;if(fn&&fn())break}};window.__ph=()=>JSON.stringify({st:FLY&&FLY.stage,ph:FLY?FLY.ph:CMD.ph,state,fc:FC.on,hp:Math.round(hp),obj:$('obj').textContent.slice(0,90)})`);
const base=JSON.parse(await X(`INTRO.on=false;JSON.stringify({b:boxes.length,r:ROOMS.map(r=>r.n).join(','),f:FIX.length,w:NAVW.length,m2:M2})`));out.push('INFO baseline '+JSON.stringify(base));
// ---- 3-1
await X(`startAt(4,1)`);let r=JSON.parse(await X(`__st(30);__ph()`));R('3-1 starts with the take-off from Meridian',r.st===31&&r.ph==='takeoff',JSON.stringify(r));
await shot('31_takeoff');
r=JSON.parse(await X(`__st(1500,()=>FLY.ph==='approach'&&!FC.on);__ph()`));R('3-1 brief, jump and arrival',r.ph==='approach'&&!r.fc,JSON.stringify(r));
await X(`yaw=Math.atan2(FLY.pos.x,FLY.pos.z);pitch=0;`);await shot('31_arrive');
r=JSON.parse(await X(`FLY.pos.set(6900,200,300);__st(10);const a=FLY.nukeArm;grenade();__st(5);JSON.stringify([a,FLY.ph,!!FLY.nk])`));R('3-1 warhead arms in range and G launches it',r[0]&&r[1]==='warhead'&&r[2],JSON.stringify(r));
r=JSON.parse(await X(`FLY.spd=0;FLY.thr=0;__st(600,()=>FLY.ph==='det');const p=FLY.dr.g.position;yaw=Math.atan2(FLY.pos.x-p.x,FLY.pos.z-p.z);pitch=-.02;__ph()`));R('3-1 warhead hits the shield (and nothing happens)',r.ph==='det',JSON.stringify(r));
await shot('31_detonation');
r=JSON.parse(await X(`__st(330,()=>FLY.ph==='fleet'&&FLY.ft>4.2);JSON.stringify([FLY.ph,L3FX.filter(f=>f.kind==='portal').length,FLY.fleet.filter(f=>f.g.visible).length,FLY.en.length])`));R('3-1 portals open and the fleet arrives',r[1]>0||r[2]>0,'phase '+r[0]+' portals open '+r[1]+' fleet ships visible '+r[2]+' enemies '+r[3]);
await shot('31_portals');
r=JSON.parse(await X(`__st(300,()=>FLY.landOK);JSON.stringify([FLY.ph,FLY.landOK,FLY.fleet.filter(f=>f.g.visible).length,FLY.en.length])`));R('3-1 landing ordered',r[1],JSON.stringify(r));
await X(`yaw=Math.atan2(FLY.pos.x+4000,FLY.pos.z);pitch=.05`);await shot('31_fleet');
// the shield: fast is bounced, slow goes through
r=JSON.parse(await X(`const D=FLY.dr;FLY.pos.set(2150,20,0);FLY.lastOut.copy(FLY.pos);FLY.inSh=false;FLY.h=Math.PI/2;yaw=FLY.h;pitch=0;FLY.thr=1;FLY.spd=150;__st(40);const fast=[FLY.pos.x.toFixed(0),FLY.inSh];
  FLY.pos.set(2150,20,0);FLY.lastOut.copy(FLY.pos);FLY.inSh=false;FLY.h=Math.PI/2;yaw=FLY.h;FLY.repT=0;FLY.thr=.3;FLY.spd=60;keys.Space=false;__st(200);const slow=[FLY.pos.x.toFixed(0),FLY.inSh];JSON.stringify([fast,slow])`));
R('3-1 shield bounces a fast ship, lets a slow one through',!r[0][1]&&r[1][1],'fast: x '+r[0][0]+' inside '+r[0][1]+'; slow: x '+r[1][0]+' inside '+r[1][1]);
r=JSON.parse(await X(`FLY.pos.set(1500,20,0);FLY.h=Math.PI/2;yaw=FLY.h;FLY.spd=40;FLY.thr=.2;__st(400,()=>state!=='playing');JSON.stringify([state,$('ovTitle').textContent,$('go').textContent,M3])`));
R('3-1 lands in the bay and shows the card',r[0]==='paused'&&r[1]==='Stage 3-1 complete'&&r[3]>=1,JSON.stringify(r));
// ---- 3-2
await X(`$('go').click()`);await q.waitForTimeout(1500);r=JSON.parse(await X(`__st(10);JSON.stringify([CMD.on,boxes.length,ROOMS.map(r=>r.n).slice(0,2).join(','),FIX.length,!!NAV,state,$('wave').textContent,pos.z.toFixed(0)])`));
R('Continue starts 3-2 inside the command ship',r[0]&&r[2].startsWith('CMD')&&r[5]==='playing','on '+r[0]+' boxes '+r[1]+' rooms '+r[2]+' lamps '+r[3]+' stage '+r[6]+' z '+r[7]);
await X(`yaw=0;pitch=.05;eye.set(pos.x,pos.y+EYE,pos.z)`);await shot('32_bay');
// walk up the spine with game keys (enemies removed so the walk is about the level, not the fight)
r=JSON.parse(await X(`const z0=pos.z;keys.KeyW=true;let n=0;for(;n<900;n++){enemies.length=0;queue.length=0;yaw=0;update(1/30);cmdTick(1/30);time+=1/30;if(pos.z<120)break}keys.KeyW=false;JSON.stringify([z0.toFixed(0),pos.z.toFixed(1),n])`));
R('3-2 walk from the bay into the spine corridor',+r[1]<121,'from z '+r[0]+' to '+r[1]+' in '+r[2]+' steps');
await X(`pos.set(-10,0,40);yaw=-.4;pitch=0;enemies.length=0;queue.length=0;__st(3);eye.set(pos.x,pos.y+EYE,pos.z)`);await shot('32_barracks');
await X(`pos.set(0,0,-70);yaw=0;pitch=0;enemies.length=0;queue.length=0;__st(3);eye.set(pos.x,pos.y+EYE,pos.z)`);await shot('32_conduits');
r=JSON.parse(await X(`pos.set(0,0,-160);__st(5);const ph=CMD.ph;pos.set(0,0,-199.5);yaw=0;enemies.length=0;queue.length=0;keys.KeyE=true;__st(110);keys.KeyE=false;JSON.stringify([ph,CMD.ph,CMD.hold.toFixed(1),Math.round(CMD.timer),CMD.el&&CMD.el.textContent])`));
R('3-2 hold E at the generator sets the charge',r[1]==='run'&&r[3]>140,JSON.stringify(r));
await X(`pos.set(0,0,-190);yaw=0;pitch=.25;eye.set(pos.x,pos.y+EYE,pos.z);enemies.length=0;queue.length=0;__st(2)`);await shot('32_generator');
// die here: Retry returns to 3-2
r=JSON.parse(await X(`window.__realHurt=true;hurt(9999,pos);window.__realHurt=false;JSON.stringify([state,LAST.m,LAST.s,$('retry').textContent,$('ovTitle').textContent])`));R('3-2 death offers Retry stage 3-2',r[0]==='dead'&&r[1]===4&&r[2]===2&&r[3]==='Retry stage 3-2',JSON.stringify(r));
r=JSON.parse(await X(`$('retry').click();__st(5);JSON.stringify([CMD.on,CMD.ph,state])`));R('3-2 Retry restarts inside the command ship',r[0]&&r[1]==='in'&&r[2]==='playing',JSON.stringify(r));
r=JSON.parse(await X(`pos.set(0,0,-199.5);enemies.length=0;queue.length=0;keys.KeyE=true;__st(110);keys.KeyE=false;pos.set(0,0,195);enemies.length=0;queue.length=0;__st(10,()=>state!=='playing');JSON.stringify([state,$('ovTitle').textContent,M3])`));
R('3-2 back to the Kestrel ends the stage',r[0]==='paused'&&r[1]==='Stage 3-2 complete'&&r[2]>=2,JSON.stringify(r));
// ---- 3-3
await X(`$('go').click()`);await q.waitForTimeout(1000);r=JSON.parse(await X(`__st(20);JSON.stringify([CMD.on,boxes.length===${base.b},__ph()])`));R('Continue starts 3-3 and restores Thalassa\'s boxes',!r[0]&&r[1]&&JSON.parse(r[2]).st===33,JSON.stringify(r));
r=JSON.parse(await X(`__st(400,()=>FLY.ph==='clear');__st(30);__ph()`));R('3-3 launches out of the bay',r.ph==='clear',JSON.stringify(r));
await X(`yaw=FLY.h+Math.PI;pitch=0`);await shot('33_launch');
r=JSON.parse(await X(`keys.KeyW=true;__st(900,()=>FLY.ph==='boom'&&FLY.bt>3);keys.KeyW=false;__ph()`));R('3-3 the charge blows',r.ph==='boom',JSON.stringify(r));
await X(`const p=FLY.dr.g.position;yaw=Math.atan2(FLY.pos.x-p.x,FLY.pos.z-p.z);pitch=0`);await shot('33_boom');
r=JSON.parse(await X(`__st(240,()=>FLY.ph==='tail');__st(30);JSON.stringify([FLY.ph,FLY.en.filter(e=>e.kind==='int').length])`));R('3-3 nine on your tail',r[0]==='tail'&&r[1]===9,JSON.stringify(r));
r=JSON.parse(await X(`window.__realHurt=true;hurt(500,FLY.pos);window.__realHurt=false;const a=[hp,state];__st(60);JSON.stringify([...a,!!FLY.ace,FLY.floorHit])`));R('3-3 cannot die before the scripted shoot-down',r[0]>=15&&r[1]==='playing',JSON.stringify(r));
r=JSON.parse(await X(`__st(1200,()=>FLY.ph==='down');__ph()`));R('3-3 the ace shoots you down',r.ph==='down',JSON.stringify(r));
await shot('33_down');
r=JSON.parse(await X(`__st(400,()=>state!=='playing');JSON.stringify([state,$('ovTitle').textContent,$('go').textContent,M3])`));R('3-3 card',r[1]==='Stage 3-3 complete'&&r[2]==='Continue to Level 4',JSON.stringify(r));
// ---- 4-1
await X(`$('go').click()`);await q.waitForTimeout(1000);r=JSON.parse(await X(`__st(20);__ph()`));R('Continue starts Level 4',r.st===41&&r.ph==='fall',JSON.stringify(r));
await X(`yaw=FLY.h;pitch=-.2`);await shot('41_fall');
r=JSON.parse(await X(`let mn=1e9;for(let i=0;i<2400&&FLY.ph==='fall';i++){const alt=FLY.pos.y-eurH(FLY.pos.x,FLY.pos.z);keys.KeyW=alt<700&&FLY.V.y<-12;pitch=alt<700?.15:-.2;update(1/30);time+=1/30}keys.KeyW=false;JSON.stringify([FLY.ph,Math.round(FLY.imp||0),Math.round(FLY.fuel*100),FLY.pos.y.toFixed(0),eurH(FLY.pos.x,FLY.pos.z).toFixed(0)])`));
R('4-1 touchdown on the ice',r[0]==='skid'||r[0]==='rest','phase '+r[0]+' impact '+r[1]+' m/s fuel left '+r[2]+'% y '+r[3]+' ground '+r[4]);
await X(`__st(40)`);await shot('41_skid');
r=JSON.parse(await X(`__st(1500,()=>state!=='playing');JSON.stringify([state,$('ovTitle').textContent,$('go').textContent,M3,M2])`));R('4-1 ends with the Level 4 card',r[1]==='Level 4 · Europa'&&r[3]===4&&r[4]===base.m2,JSON.stringify(r));
r=JSON.parse(await X(`$('go').click();JSON.stringify({state,b:boxes.length,r:ROOMS.map(r=>r.n).join(','),f:FIX.length,w:NAVW.length,fly:!!FLY,cmd:CMD.on})`));
R('Back to the title: Thalassa restored',r.state==='menu'&&r.b===base.b&&r.r===base.r&&r.f===base.f&&r.w===base.w&&!r.fly&&!r.cmd,JSON.stringify(r).slice(0,200));
// deaths in flight
r=JSON.parse(await X(`startAt(4,1);__st(400,()=>FLY.ph==='brief');window.__realHurt=true;hurt(9999,FLY.pos);window.__realHurt=false;JSON.stringify([state,LAST.m,LAST.s,$('retry').textContent])`));R('3-1 death offers Retry stage 3-1',r[0]==='dead'&&r[3]==='Retry stage 3-1',JSON.stringify(r));
r=JSON.parse(await X(`$('retry').click();__st(5);__ph()`));R('3-1 Retry restarts 3-1',r.st===31,JSON.stringify(r));
r=JSON.parse(await X(`startAt(5,1);__st(30);window.__realHurt=true;hurt(9999,FLY.pos);window.__realHurt=false;JSON.stringify([state,hp])`));R('4-1 has no death screen',r[0]==='playing'&&r[1]>=5,JSON.stringify(r));
await X(`missionsBuild()`);r=await X(`[...$('missions').querySelectorAll('button')].slice(-4).map(b=>b.textContent.slice(0,30)).join(' | ')`);R('Missions list shows 3-1..4-1',r.includes('3-1')&&r.includes('4-1'),r);
out.push('l3err '+await X(`window.__l3err||'none'`));
fs.writeFileSync('t236.out',out.join('\n')+'\nerrs '+JSON.stringify(errs.slice(0,8)));console.log('errs',errs.slice(0,8));await b.close()})();
