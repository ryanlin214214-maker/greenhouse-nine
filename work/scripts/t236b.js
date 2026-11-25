// Mission 3 and 4 through the cards: 3-1 card -> 3-2 on foot (walk, charge, death, retry, back to the ship) -> 3-3 -> 4-2 final card -> title,
// world swaps restored, deaths and retries in flight, the missions list. (The 3-1 battle, 3-3 and 4-1/4-2 play are in tbtl.js and teur.js.)
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:960,height:600}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+(process.argv[2]||'t108x.html'),{timeout:240000});await q.waitForTimeout(5000);
const X=c=>q.evaluate(c=>window.__x(c),c);const out=[];const R=(id,ok,t)=>{out.push((ok?'PASS ':'FAIL ')+id+' '+t);console.log((ok?'PASS ':'FAIL ')+id+' '+t)};
const shot=async n=>{await q.waitForTimeout(2500);await q.screenshot({path:'l3_'+n+'.png'})};
await q.addStyleTag({content:'#comm,#comms{display:none!important}'});
await X(`window.__st=(n,fn)=>{for(let i=0;i<n;i++){if(state!=='playing')break;update(1/30);if(CMD.on)cmdTick(1/30);time+=1/30;if(fn&&fn())break}};window.__ph=()=>JSON.stringify({st:FLY&&FLY.stage,ph:FLY?FLY.ph:CMD.ph,state,fc:FC.on,hp:Math.round(hp),obj:$('obj').textContent.slice(0,90)})`);
const base=JSON.parse(await X(`INTRO.on=false;JSON.stringify({b:boxes.length,r:ROOMS.map(r=>r.n).join(','),f:FIX.length,w:NAVW.length,m2:M2})`));out.push('INFO baseline '+JSON.stringify(base));
// ---- 3-1
await X(`startAt(4,1)`);let r=JSON.parse(await X(`__st(30);__ph()`));R('3-1 starts with the take-off from Meridian',r.st===31&&r.ph==='takeoff',JSON.stringify(r));
await shot('31_takeoff');
await X(`l3Done(31)`);r=JSON.parse(await X(`__st(60,()=>state!=='playing');JSON.stringify([state,$('ovTitle').textContent,$('go').textContent,M3])`));
R('3-1 ends with its card and Continue to 3-2',r[1]==='Stage 3-1 complete'&&r[2]==='Continue to stage 3-2'&&r[3]>=1,JSON.stringify(r));
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
r=JSON.parse(await X(`pos.set(0,0,-160);__st(5);pos.set(0,0,-199.5);enemies.length=0;queue.length=0;keys.KeyE=true;__st(110);keys.KeyE=false;pos.set(0,0,195);enemies.length=0;queue.length=0;__st(10,()=>state!=='playing');JSON.stringify([state,$('ovTitle').textContent,M3])`));
R('3-2 back to the Kestrel ends the stage',r[0]==='paused'&&r[1]==='Stage 3-2 complete'&&r[2]>=2,JSON.stringify(r));
// ---- 3-3
await X(`$('go').click()`);await q.waitForTimeout(1000);r=JSON.parse(await X(`__st(20);JSON.stringify([CMD.on,boxes.length===${base.b},__ph()])`));R('Continue starts 3-3 and restores Thalassa\'s boxes',!r[0]&&r[1]&&JSON.parse(r[2]).st===33,JSON.stringify(r));
r=JSON.parse(await X(`startAt(5,2);__st(10);l3Done(42);__st(60,()=>state!=='playing');JSON.stringify([state,$('ovTitle').textContent,$('go').textContent,M3])`));
R('4-2 ends with the Level 4 card and Back to the title',r[1]==='Level 4 · The Thule Relay'&&r[2]==='Back to the title'&&r[3]===5,JSON.stringify(r));
r=JSON.parse(await X(`$('go').click();JSON.stringify({state,b:boxes.length,r:ROOMS.map(r=>r.n).join(','),f:FIX.length,w:NAVW.length,fly:!!FLY,cmd:CMD.on})`));
R('Back to the title: Thalassa restored',r.state==='menu'&&r.b===base.b&&r.r===base.r&&r.f===base.f&&r.w===base.w&&!r.fly&&!r.cmd,JSON.stringify(r).slice(0,200));
r=JSON.parse(await X(`startAt(4,1);__st(60);window.__realHurt=true;hurt(9999,FLY.pos);window.__realHurt=false;JSON.stringify([state,LAST.m,LAST.s,$('retry').textContent])`));R('3-1 death offers Retry stage 3-1',r[0]==='dead'&&r[3]==='Retry stage 3-1',JSON.stringify(r));
r=JSON.parse(await X(`$('retry').click();__st(5);__ph()`));R('3-1 Retry restarts 3-1',r.st===31,JSON.stringify(r));
r=JSON.parse(await X(`startAt(5,1);__st(30);window.__realHurt=true;hurt(9999,FLY.pos);window.__realHurt=false;JSON.stringify([state,hp])`));R('4-1 has no death screen',r[0]==='playing'&&r[1]>=5,JSON.stringify(r));
await X(`missionsBuild()`);r=await X(`[...$('missions').querySelectorAll('button')].slice(-6).map(b=>b.textContent.slice(0,30)).join(' | ')`);R('Missions list shows 3-1..4-2',r.includes('3-1')&&r.includes('4-2'),r);
out.push('l3err '+await X(`window.__l3err||'none'`));
fs.writeFileSync('t236b.out',out.join('\n')+'\nerrs '+JSON.stringify(errs.slice(0,8)));console.log('errs',errs.slice(0,8));await b.close()})();
