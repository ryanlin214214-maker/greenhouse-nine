// Lattice bosses and the Dark's troops aboard the command ship: they load, stand on the floor, walk, attack, can be killed
// (time to kill with the rifle), break apart; the charge is blocked while the Reformed stands; pictures
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:960,height:600}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t107x.html',{timeout:240000});await q.waitForTimeout(5000);const X=c=>q.evaluate(c=>window.__x(c),c);
const R=(id,ok,t)=>console.log((ok?'PASS ':'FAIL ')+id+' '+t);await q.addStyleTag({content:'#comm,#comms,#msg{display:none!important}'});
await X(`INTRO.on=false;window.__st=(n,fn)=>{for(let i=0;i<n;i++){if(state!=='playing')break;update(1/30);if(CMD.on)cmdTick(1/30);time+=1/30;if(fn&&fn())break}};startAt(4,2);__st(5);enemies.length=0;queue.length=0;CMD.w.b=1;CMD.w.c=1`);
let r=JSON.parse(await X(`const t0=performance.now();const A=latSpawn(15,0,-240),B=latSpawn(16,-25,-100),C=latSpawn(17,25,-100);const ms=performance.now()-t0;__st(3);
  const ft=e=>{const bb=new T.Box3().setFromObject(e.lat.m);return[bb.min.y.toFixed(2),(bb.max.y-bb.min.y).toFixed(2)]};JSON.stringify([ms.toFixed(0),ft(A),ft(B),ft(C),enemies.length,renderer.info.memory.geometries])`));
R('three Lattice bosses build',r[4]>=3,'build '+r[0]+' ms; feet/height reformed '+r[1]+' warden '+r[2]+' revenant '+r[3]);
R('feet on the floor',[r[1],r[2],r[3]].every(v=>Math.abs(+v[0])<.35),JSON.stringify([r[1][0],r[2][0],r[3][0]]));
await X(`const e=enemies.find(e=>e.type===15);pos.set(0,0,-188);yaw=0;pitch=.18;__st(2);eye.set(pos.x,pos.y+EYE,pos.z)`);await q.waitForTimeout(3500);await q.screenshot({path:'lat_reformed.png'});
await X(`const e=enemies.find(e=>e.type===16);pos.set(e.pos.x+2,0,e.pos.z+13);yaw=Math.atan2(-(e.pos.x-pos.x),-(e.pos.z-pos.z));pitch=.15;__st(2);eye.set(pos.x,pos.y+EYE,pos.z)`);await q.waitForTimeout(3500);await q.screenshot({path:'lat_warden.png'});
await X(`const e=enemies.find(e=>e.type===17);pos.set(e.pos.x-3,0,e.pos.z+13);yaw=Math.atan2(-(e.pos.x-pos.x),-(e.pos.z-pos.z));pitch=.15;__st(2);eye.set(pos.x,pos.y+EYE,pos.z)`);await q.waitForTimeout(3500);await q.screenshot({path:'lat_revenant.png'});
// walking: the Reformed comes for you
r=JSON.parse(await X(`const e=enemies.find(e=>e.type===15);e.pos.set(0,e.pos.y,-215);pos.set(0,0,-188);const d0=e.pos.distanceTo(pos);const th=[];__st(300);for(let i=0;i<20;i++){__st(1);th.push(e.lat.seg.thL.rotation.x)}JSON.stringify([d0.toFixed(1),e.pos.distanceTo(pos).toFixed(1),(Math.max(...th)-Math.min(...th)).toFixed(2),(window.__hurtN||0)])`));
R('the Reformed walks at you and its legs move',+r[1]<+r[0]&&+r[2]>.02,'distance '+r[0]+' -> '+r[1]+' m, thigh swing '+r[2]+' rad, attacks landed '+r[3]);
// the charge is blocked while it stands
r=JSON.parse(await X(`CMD.b15=enemies.find(e=>e.type===15);pos.set(0,0,-199.5);keys.KeyE=true;__st(100);keys.KeyE=false;JSON.stringify([CMD.ph,CMD.el.textContent])`));R('charge blocked while the Reformed stands',r[0]==='in'&&r[1].includes('STILL STANDS'),JSON.stringify(r));
// time to kill with the player's own guns: aim at its chest and hold fire
for(const ty of[16,15]){r=JSON.parse(await X(`const e=enemies.find(e=>e.type===${ty}&&!e.dying);e.spd=0;e.pos.set(${ty===16?-25:30},e.pos.y,${ty===16?-100:-200});const P=e.pos;pos.set(P.x,0,P.z+14);for(const o of enemies)if(o!==e&&!o.lat)o.hp=0;let t=0;firing=true;for(;t<30*120&&!e.dying;t++){const c=new T.Vector3(P.x,P.y+e.hy,P.z),dx=c.x-pos.x,dz=c.z-pos.z;yaw=Math.atan2(-dx,-dz);pitch=Math.atan2(c.y-(pos.y+EYE),Math.hypot(dx,dz));eye.set(pos.x,pos.y+EYE,pos.z);cam.position.copy(eye);cam.rotation.set(pitch,yaw,0,'YXZ');cam.updateMatrixWorld();if(guns[weapon].mag<=0)guns[weapon].mag=99;update(1/30);cmdTick(1/30);time+=1/30}firing=false;JSON.stringify([!!e.dying,(t/30).toFixed(1),WPN[guns[weapon].k].name||guns[weapon].k,e.lat.dead])`));
  R('kill type '+ty+' with the rifle',r[0],'dead '+r[0]+' after '+r[1]+' s of fire with '+r[2]+', broke apart '+r[3])}
await X(`__st(20)`);await q.waitForTimeout(2500);await q.screenshot({path:'lat_break.png'});
r=JSON.parse(await X(`CMD.b15=enemies.find(e=>e.type===15);const ok=!CMD.b15||CMD.b15.dying;pos.set(0,0,-199.5);enemies.length=0;keys.KeyE=true;__st(100);keys.KeyE=false;JSON.stringify([ok,CMD.ph])`));R('charge can be set once it is down',r[1]==='run',JSON.stringify(r));
// the Dark's troops
await X(`enemies.length=0;queue.length=0;CMD.ph='in';pos.set(0,0,30);yaw=Math.PI;pitch=0;cmdSpawn([[13,-4,40],[14,4,44]]);__st(4);for(const e of enemies){e.spd=0;e.cd=99}`);
r=JSON.parse(await X(`__st(20);JSON.stringify(enemies.map(e=>{const bb=new T.Box3().setFromObject(e.g);return[e.type,bb.min.y.toFixed(2),(bb.max.y-bb.min.y).toFixed(2)]}))`));R('Reaver and Maul spawn standing',r.length===2&&r.every(v=>Math.abs(+v[1])<.4),JSON.stringify(r));
await X(`pos.set(0,0,33);yaw=Math.PI;pitch=.1;eye.set(pos.x,pos.y+EYE,pos.z)`);await q.waitForTimeout(3500);await q.screenshot({path:'dark_pair.png'});
await X(`pos.set(-1.5,0,37);yaw=Math.PI*.9;pitch=.25;eye.set(pos.x,pos.y+EYE,pos.z)`);await q.waitForTimeout(3500);await q.screenshot({path:'dark_close.png'});
r=JSON.parse(await X(`for(const e of enemies){e.spd=GP[e.type].spd;e.cd=1}pos.set(0,0,10);const d0=enemies.map(e=>e.pos.distanceTo(pos).toFixed(0));__st(240);JSON.stringify([d0,enemies.filter(e=>!e.dying).map(e=>e.pos.distanceTo(pos).toFixed(0)),window.__hurtN])`));R('they come at you',true,JSON.stringify(r));
console.log('errs',errs.slice(0,6));await b.close()})();
