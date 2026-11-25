// 3-3 (second Nova, blast wave, regroup, chasers, Sable) and Level 4 (approach and landing; the relay on foot to the beacon)
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:960,height:600}});q.setDefaultTimeout(1800000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(4000);
const X=c=>q.evaluate(c=>window.__x(c),c);const R=(id,ok,t)=>console.log((ok?'PASS ':'FAIL ')+id+' '+t);fs.mkdirSync('eur',{recursive:true});
const shot=async(n,w)=>{await q.waitForTimeout(w||2600);await q.screenshot({path:'eur/'+n+'.png'})};
await q.addStyleTag({content:'#comm{display:none!important}'});
await X(`window.__st=(n,fn)=>{for(let i=0;i<n;i++){if(state!=='playing')break;update(1/30);if(FLY)flyCam(1/30);if(typeof CMD!=='undefined'&&CMD.on)cmdTick(1/30);if(EUW.on)eurTick(1/30);time+=1/30;if(fn&&fn())break}};0`);
// ---- 3-3
await X(`INTRO.on=false;startAt(4,3);__st(400,()=>FLY.ph==='clear');0`);
let r=JSON.parse(await X(`keys.KeyW=true;__st(1200,()=>FLY.ph==='nova2');keys.KeyW=false;JSON.stringify({ph:FLY.ph,shOff:FLY.dr.shOff,core:Math.round(FLY.pos.distanceTo(FLY.dr.g.position))})`));
R('3-3: the charge drops the shield and the ship holds; the second Nova is ready',r.ph==='nova2'&&r.shOff,JSON.stringify(r));
r=JSON.parse(await X(`const S=FLY,c=S.dr.g.position,d=c.clone().sub(S.pos);S.h=Math.atan2(-d.x,-d.z);yaw=S.h;pitch=0;grenade();__st(5);const arming=S.n2Arm>0;__st(120,()=>S.ph==='n2fly');const fl=S.ph;__st(10);JSON.stringify({arming,ph:fl})`));
R('G arms the Nova (3 s countdown), then it launches',r.arming&&r.ph==='n2fly',JSON.stringify(r));await shot('33_nova_flight',800);
r=JSON.parse(await X(`const t0=FLY.t;__st(900,()=>FLY.ph==='boom');JSON.stringify({ph:FLY.ph,travel:+(FLY.t-t0).toFixed(1)})`));R('the Nova travels to the core and detonates',r.ph==='boom',JSON.stringify(r));
await X(`const p=FLY.dr.g.position,d=p.clone().sub(FLY.pos);yaw=Math.atan2(-d.x,-d.z);pitch=Math.atan2(d.y,Math.hypot(d.x,d.z));__st(40);0`);await shot('33_detonation',600);
r=JSON.parse(await X(`__st(400,()=>FLY.ph==='blast');const S=FLY,c=S.dr.g.position,d=S.pos.clone().sub(c);yaw=Math.atan2(-d.x,-d.z);pitch=0;keys.KeyW=true;__st(60);JSON.stringify({ph:S.ph,r:Math.round(S.bw?S.bw.r:0)})`));R('the blast wave expands toward you',r.ph==='blast'&&r.r>0,JSON.stringify(r));
await X(`const c=FLY.bw.c,d=c.clone().sub(cam.position);yaw=Math.atan2(-d.x,-d.z);pitch=0;0`);await shot('33_blast_wave',400);
r=JSON.parse(await X(`const S=FLY,c=S.bw.c,d=S.pos.clone().sub(c);yaw=Math.atan2(-d.x,-d.z);__st(900,()=>S.ph==='regroup');keys.KeyW=false;const v=S.ves;JSON.stringify({ph:S.ph,ves:!!v})`));R('outrun the wave, then regroup with Vesper',r.ph==='regroup'&&r.ves,JSON.stringify(r));
r=JSON.parse(await X(`const S=FLY;__st(1500,()=>{const v=S.ves;if(v){const d=v.position.clone().sub(S.pos);yaw=Math.atan2(-d.x,-d.z);pitch=Math.atan2(d.y,Math.hypot(d.x,d.z));keys.KeyW=true}return S.ph==='tail'});keys.KeyW=false;JSON.stringify({ph:S.ph,ints:S.en.filter(e=>e.kind==='int').length})`));
R('regroup, then nine on your tail',r.ph==='tail'&&r.ints===9,JSON.stringify(r));
r=JSON.parse(await X(`__st(2400,()=>FLY.ph==='down');JSON.stringify({ph:FLY.ph})`));R('Sable cripples you',r.ph==='down',JSON.stringify(r));
r=JSON.parse(await X(`__st(400,()=>state!=='playing');JSON.stringify({t:$('ovTitle').textContent,go:$('go').textContent})`));R('3-3 card leads to Level 4',r.go==='Continue to Level 4',JSON.stringify(r));
// ---- 4-1: fly the corridor (steer at the next ring, then the pad), retro when fast, lift when sinking
await X(`$('go').click();0`);await q.waitForTimeout(1500);
r=JSON.parse(await X(`__st(20);JSON.stringify({st:FLY.stage,ph:FLY.ph,rings:FLY.rings.length})`));R('4-1 starts the approach with the corridor rings',r.st===41&&r.ph==='approach'&&r.rings===9,JSON.stringify(r));
await X(`const S=FLY,P=EUP.pad,d=P.clone().sub(S.pos);yaw=Math.atan2(-d.x,-d.z);pitch=Math.atan2(d.y,Math.hypot(d.x,d.z));__st(3);0`);await shot('41_approach',800);
r=JSON.parse(await X(`const S=FLY,P=EUP.pad;let n=0,rings=0;for(;n<6000;n++){if(state!=='playing'||!FLY||S.ph!=='approach')break;const nx=S.rings.find(r=>!r.userData.ok&&r.position.z<S.pos.z+50);const tg=nx?nx.position:new T.Vector3(P.x,P.y+40,P.z);const d=tg.clone().sub(S.pos);
  yaw=Math.atan2(-d.x,-d.z);pitch=Math.max(-.6,Math.min(.3,Math.atan2(d.y,Math.hypot(d.x,d.z))));const sp=S.V.length(),hd=Math.hypot(S.pos.x-P.x,S.pos.z-P.z);keys.KeyW=sp>Math.max(45,hd/18);keys.Space=S.V.y<-Math.max(6,(S.pos.y-P.y)/9);__st(1)}keys.KeyW=false;keys.Space=false;
  JSON.stringify({ph:FLY&&FLY.ph,secs:+(n/30).toFixed(1),ringsHit:S.rings.filter(r=>r.userData.ok).length,gear:S.gear})`));
R('fly the corridor to Pad 1: autoland takes over',r.ph==='autoland'||r.ph==='touch',JSON.stringify(r));
await X(`__st(400,()=>FLY.ph==='touch');0`);await shot('41_touchdown',300);
r=JSON.parse(await X(`const S=FLY,P=EUP.pad;const gy=S.g.userData.gy||2.05;const pad=Math.hypot(S.pos.x-P.x,S.pos.z-P.z);__st(300,()=>state!=='playing');JSON.stringify({padDist:Math.round(pad),t:$('ovTitle').textContent,go:$('go').textContent,M3})`));
R('touchdown on the pad, the 4-1 card offers 4-2',r.padDist<20&&r.go==='Continue to stage 4-2',JSON.stringify(r));
// ---- 4-2
await X(`$('go').click();0`);await q.waitForTimeout(2000);
r=JSON.parse(await X(`__st(10);JSON.stringify({on:EUW.on,boxes:boxes.length,pos:[pos.x,pos.y,pos.z].map(v=>+v.toFixed(1)),ground,obj:$('objT').textContent,rowan:ROW.on})`));
R('4-2 starts on foot by the landed ship',r.on&&r.ground&&r.pos[1]>.5&&/RELAY/.test(r.obj),JSON.stringify(r));
await X(`yaw=Math.PI;pitch=.02;eye.set(pos.x,pos.y+EYE,pos.z);0`);await shot('42_pad');
// walk up the path with the game's keys
r=JSON.parse(await X(`keys.KeyW=true;let n=0;for(;n<900;n++){yaw=Math.atan2(-(0-pos.x),-(98-pos.z));update(1/30);eurTick(1/30);time+=1/30;if(pos.z<99)break}keys.KeyW=false;__st(5);JSON.stringify({z:+pos.z.toFixed(1),secs:+(n/30).toFixed(1),ph:EUW.ph,queued:queue.length,enemies:enemies.length})`));
R('walk the lit path to the courtyard: the fight starts',r.ph==='fight'&&r.queued+r.enemies>=5,JSON.stringify(r));
await X(`__st(150);yaw=Math.PI;pitch=0;eye.set(pos.x,pos.y+EYE,pos.z);0`);await shot('42_courtyard');
r=JSON.parse(await X(`let onFloor=0,n=0;for(const e of enemies){if(e.dying)continue;n++;const g=groundAt(e.pos.x,e.pos.z,e.pos.y);if(Math.abs(e.pos.y-e.r-g)<.3)onFloor++}JSON.stringify({n,onFloor})`));R('robots and Reavers spawn on the snow and stand on it',r.n>=4&&r.onFloor>=r.n-1,JSON.stringify(r));
r=JSON.parse(await X(`for(let k=0;k<30;k++){for(const e of enemies.slice())if(!e.dying&&e.hp>0)damage(e,9999);__st(30)}__st(160);JSON.stringify({ph:EUW.ph,left:enemies.filter(e=>!e.dying).length})`));R('courtyard cleared: the beacon objective',r.ph==='beacon',JSON.stringify(r));
// side trip: the buried dome cache, then into the relay to the console
r=JSON.parse(await X(`const go=(tx,tz,lim)=>{keys.KeyW=true;let n=0;for(;n<(lim||900);n++){const dx=tx-pos.x,dz=tz-pos.z;if(Math.hypot(dx,dz)<1.5)break;yaw=Math.atan2(-dx,-dz);update(1/30);eurTick(1/30);time+=1/30}keys.KeyW=false;return Math.hypot(tx-pos.x,tz-pos.z)};
  const a=go(-50,-60),b2=go(-74,-60);const found=EUW.found;go(-50,-60);const c=go(0,10),d=go(0,-8),e=go(0,-20.8);JSON.stringify({dome:+b2.toFixed(1),found,door:+c.toFixed(1),corridor:+d.toFixed(1),console:+e.toFixed(1)})`));
R('walk to the buried dome (cache found) and through the relay door and corridor to the console',r.found&&r.console<2,JSON.stringify(r));
await X(`yaw=0;pitch=-.1;eye.set(pos.x,pos.y+EYE,pos.z);0`);await shot('42_control_room');
r=JSON.parse(await X(`keys.KeyE=true;__st(120);keys.KeyE=false;JSON.stringify({ph:EUW.ph})`));R('hold E at the console: the beacon lights',r.ph==='done',JSON.stringify(r));
await X(`pos.set(30,0,30);yaw=Math.atan2(-(18-30),-(-20-30));pitch=.5;eye.set(pos.x,pos.y+EYE,pos.z);0`);await shot('42_beacon');
await X(`pos.set(-41,0,-170);yaw=0;pitch=.25;eye.set(pos.x,pos.y+EYE,pos.z);0`);await shot('42_ice_arch');
await X(`pos.set(66,4,90);yaw=Math.PI*.85;pitch=-.15;vy=0;eye.set(pos.x,pos.y+EYE,pos.z);0`);await shot('42_ridge');
await X(`pos.set(-62,0,-60);yaw=-Math.PI/2;pitch=0;eye.set(pos.x,pos.y+EYE,pos.z);0`);await shot('42_dome');
r=JSON.parse(await X(`__st(300,()=>state!=='playing');JSON.stringify({t:$('ovTitle').textContent,M3})`));R('4-2 card: the beacon is lit',/Thule Relay/.test(r.t),JSON.stringify(r));
r=JSON.parse(await X(`setState('menu');reset();JSON.stringify({eur:EUW.on,boxes:boxes.length})`));R('leaving restores Thalassa',!r.eur&&r.boxes>1000,JSON.stringify(r));
console.log('errs',errs.length,errs.slice(0,6));await b.close()})();
