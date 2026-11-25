// flight look: matching poses (stationary, cruising, turning, afterburner) at the 3-1 arrival; argv: page, prefix, [probe]
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1280,height:800}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(5000);
const P=process.argv[3]||'fx/b_';const X=c=>q.evaluate(c=>window.__x(c),c);
await X(`window.__st=(n,fn)=>{for(let i=0;i<n;i++){if(state!=='playing')break;update(1/30);time+=1/30;if(fn&&fn())break}}`);
await X(`INTRO.on=false;startAt(4,1);__st(1500,()=>FLY.ph==='approach'&&!FC.on);0`);
const pose=async(n,js,w)=>{await X(js);await q.waitForTimeout(w||2500);await q.screenshot({path:P+n+'.png'});
  const ms=await q.evaluate(()=>new Promise(r=>{let n=0,t0=performance.now();const f=()=>{if(++n<20)requestAnimationFrame(f);else r((performance.now()-t0)/20)};requestAnimationFrame(f)}));console.log(n,'frame ms',ms.toFixed(1))};
// aim the ship and camera at the command ship with Europa behind
const aim=`const p=FLY.dr.g.position;FLY.h=Math.atan2(p.x-FLY.pos.x,p.z-FLY.pos.z)+.35;yaw=FLY.h;pitch=-.05;FLY.p=0;`;
await pose('1_stationary',aim+`FLY.spd=0;FLY.thr=0;__st(20);0`);
await pose('2_cruise',aim+`FLY.thr=.6;keys.KeyW=false;__st(60);0`);
await pose('3_turn',`keys.KeyD=true;__st(25);0`);
await X(`keys.KeyD=false;__st(15)`);
await pose('4_burner',aim+`keys.KeyW=true;FLY.thr=1;__st(40);0`,1200);
await X(`keys.KeyW=false`);
await pose('5_europa',`const e=FARX.eur.getWorldPosition(new T.Vector3()).sub(cam.position);FLY.h=Math.atan2(e.x,e.z)+.12;yaw=FLY.h;pitch=-.15;FLY.p=pitch;FLY.spd=0;FLY.thr=0;__st(30);0`);
await pose('6_jupiter',`const J=farJup();const e=J?J.getWorldPosition(new T.Vector3()).sub(cam.position):new T.Vector3(1,0,0);FLY.h=Math.atan2(e.x,e.z)+.2;yaw=FLY.h;pitch=Math.atan2(e.y,Math.hypot(e.x,e.z))*.6;FLY.p=pitch;__st(30);0`);
if(process.argv[4]){const r=await X(`JSON.stringify(FAR.children.map((o,i)=>i+':'+o.type+(o.material&&o.material.size?':s'+o.material.size:'')+(o.isGroup?':'+o.children.length:'')))`);console.log(r);
  await X(`for(const o of FAR.children)if(o.isPoints&&o.material.size===2)o.visible=false;motes.visible=false;0`);await pose('5_nolanes_nomotes',aim+`FLY.spd=0;FLY.thr=0;__st(5);0`);}
console.log('errs',errs.length,errs.slice(0,3));await b.close()})();
