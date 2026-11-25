// 3-1 with live interceptors; 3-2 with live enemies: spawns in rooms and out of boxes, walkers close in, Rowan placed inside,
// timer death; leftover Thalassa objects in the footprint; HUD text; Continue offers Mission 3
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:960,height:600}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t107x.html',{timeout:240000});await q.waitForTimeout(5000);const X=c=>q.evaluate(c=>window.__x(c),c);
const R=(id,ok,t)=>console.log((ok?'PASS ':'FAIL ')+id+' '+t);
await X(`INTRO.on=false;window.__st=(n,fn)=>{for(let i=0;i<n;i++){if(state!=='playing')break;update(1/30);if(CMD.on)cmdTick(1/30);time+=1/30;if(fn&&fn())break}}`);
// 3-1 enemies
let r=JSON.parse(await X(`startAt(4,1);__st(1600,()=>FLY.ph==='approach'&&!FC.on);FLY.pos.set(6900,200,300);__st(5);grenade();FLY.spd=0;FLY.thr=0;__st(700,()=>FLY.ph==='det');__st(330);const a=FLY.en.map(e=>e.kind).join(',');__st(300);const b=FLY.en.map(e=>e.kind).join(',');__st(240);JSON.stringify([a,b,FLY.en.map(e=>e.kind).join(','),FLY.ft.toFixed(1)])`));
R('3-1 interceptors arrive through portals',r[0].includes('int')&&r[2].includes('gun'),'after wave 1: '+r[0]+' | later: '+r[1]+' | after wave 3: '+r[2]+' (fleet time '+r[3]+')');
// an ordinary pilot: fly toward the bay at cruise with real damage, steering at it, braking near the shield
r=JSON.parse(await X(`window.__realHurt=true;hp=100;shield=shMax;let mn=100,t=0;const D=FLY.dr;for(;t<2400&&state==='playing'&&FLY.ph!=='landing';t++){const bay=D.g.localToWorld(new T.Vector3(1500,10,0)),v=bay.clone().sub(FLY.pos);yaw=Math.atan2(-v.x,-v.z);pitch=Math.atan2(v.y,Math.hypot(v.x,v.z));const d=v.length();keys.KeyW=d>1200;keys.Space=d<900&&FLY.spd>60;if(d<300){const in2=new T.Vector3(1300,0,0);D.g.localToWorld(in2);const w=in2.sub(FLY.pos);yaw=Math.atan2(-w.x,-w.z);pitch=Math.atan2(w.y,Math.hypot(w.x,w.z))}update(1/30);time+=1/30;mn=Math.min(mn,hp)}keys.KeyW=keys.Space=false;window.__realHurt=false;JSON.stringify([FLY?FLY.ph:'none',state,Math.round(mn),(t/30).toFixed(0),FLY?FLY.en.length:0])`));
R('3-1 a straight run to the bay with real damage',r[1]!=='dead','phase '+r[0]+' state '+r[1]+' lowest hull '+r[2]+' after '+r[3]+' s, enemies alive '+r[4]);
// 3-2 live
r=JSON.parse(await X(`startAt(4,2);__st(200);const E=enemies.filter(e=>!e.dying);const bad=E.filter(e=>!roomAt(e.pos.x,e.pos.z)||inBox(e.pos.x,1,e.pos.z));JSON.stringify([E.length,bad.length,E.map(e=>roomAt(e.pos.x,e.pos.z)&&roomAt(e.pos.x,e.pos.z).n).join('|'),!!roomAt(ROW.pos.x,ROW.pos.z)&&roomAt(ROW.pos.x,ROW.pos.z).n,ROW.pos.x.toFixed(0)+','+ROW.pos.z.toFixed(0),$('wave').textContent,wave])`));
R('3-2 first wave spawns inside rooms, outside boxes; Rowan aboard',r[0]>=4&&r[1]===0&&r[3]&&r[3].startsWith('CMD'),'alive '+r[0]+' bad '+r[1]+' rooms '+r[2]+' Rowan in '+r[3]+' at '+r[4]+' HUD stage '+r[5]+' wave '+r[6]);
r=JSON.parse(await X(`pos.set(0,0,120);yaw=0;const d0=Math.min(...enemies.filter(e=>!e.dying).map(e=>e.pos.distanceTo(pos)));__st(450);const L=enemies.filter(e=>!e.dying);const d1=L.length?Math.min(...L.map(e=>e.pos.distanceTo(pos))):-1;const zs=L.map(e=>e.pos.z.toFixed(0)).join(',');JSON.stringify([d0.toFixed(0),d1.toFixed(0),zs,hp,state,window.__hurtN||0])`));
R('3-2 enemies come at you through the doorway',+r[1]<+r[0]&&+r[1]>=0,'nearest '+r[0]+' m -> '+r[1]+' m (z: '+r[2]+') hits taken '+r[5]);
r=JSON.parse(await X(`const out=[];const fb=new T.Box3(new T.Vector3(-110,-2,-260),new T.Vector3(110,40,260)),bb=new T.Box3();const skip=new Set([CMD.g,FAR,cam,rwG]);for(const e of enemies)skip.add(e.g);
  for(const o of scene.children){if(skip.has(o)||!o.visible||o.isLight)continue;let vis=false;o.traverse(c=>{if((c.isMesh||c.isSprite||c.isPoints)&&c.visible){let p=c;let v=true;while(p){if(!p.visible){v=false;break}p=p.parent}if(v)vis=true}});if(!vis)continue;bb.setFromObject(o);if(bb.isEmpty()||!bb.intersectsBox(fb))continue;const sz=bb.getSize(new T.Vector3());out.push((o.name||o.type)+' '+sz.x.toFixed(0)+'x'+sz.y.toFixed(0)+'x'+sz.z.toFixed(0)+' at '+bb.getCenter(new T.Vector3()).toArray().map(v=>v.toFixed(0)).join(','))}JSON.stringify(out.slice(0,30))`));
console.log('INFO visible objects in the footprint besides the ship interior:',r.length,'\n  '+r.join('\n  '));
r=JSON.parse(await X(`enemies.length=0;queue.length=0;CMD.ph='run';CMD.timer=.3;CMD.w={b:1,c:1,d:1};window.__realHurt=true;__st(30);window.__realHurt=false;JSON.stringify([state,$('ovTitle').textContent,$('ovText').textContent.slice(0,60),$('retry').textContent])`));
R('3-2 the timer running out kills you',r[0]==='dead'&&r[1]==='Too late',JSON.stringify(r));
r=JSON.parse(await X(`startAt(4,2);__st(10);window.__realHurt=true;hurt(9999,pos);window.__realHurt=false;JSON.stringify([$('ovTitle').textContent,$('ovText').textContent.slice(0,70)])`));R('3-2 death card text',r[1].startsWith('You fell aboard'),JSON.stringify(r));
r=JSON.parse(await X(`M3=2;syncCont();JSON.stringify([$('cont').hidden,$('cont').textContent])`));R('title Continue offers the next Mission 3 stage',r[1].includes('3-3'),JSON.stringify(r));
await X(`M3=0`);
// pictures: doorway above the lintel in the bay and the heart
await X(`startAt(4,2);__st(5);enemies.length=0;queue.length=0;pos.set(0,0,190);yaw=0;pitch=.45;__st(3);eye.set(pos.x,pos.y+EYE,pos.z)`);await q.waitForTimeout(3000);await q.screenshot({path:'l3c_baydoor.png'});
await X(`enemies.length=0;queue.length=0;pos.set(0,0,-195);yaw=Math.PI;pitch=.45;__st(3);eye.set(pos.x,pos.y+EYE,pos.z)`);await q.waitForTimeout(3000);await q.screenshot({path:'l3c_heartdoor.png'});
console.log('errs',errs.slice(0,6));await b.close()})();
