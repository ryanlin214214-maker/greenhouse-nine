const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1100,height:660}});q.setDefaultTimeout(240000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(6000);
await q.evaluate(()=>window.__rowLook&&window.__rowLook());await q.waitForTimeout(800);
console.log(await q.evaluate(()=>window.__x("INTRO.on=false;setState('playing');flyStart(2);for(let i=0;i<60;i++)update(1/30);FC.on=false;const S=FLY,H=S.halc;S.ph='dock';enemies.length=0;const P=H.collarW;S.pos.copy(P).add(new T.Vector3(0,10,140).applyQuaternion(H.g.quaternion));S.h=Math.atan2(-(P.x-S.pos.x),-(P.z-S.pos.z));S.p=-.04;S.spd=20;S.thr=.1;yaw=S.h;pitch=-.04;S.camR=0;S.roll=0;for(let i=0;i<10;i++)update(1/30);JSON.stringify([S.ph,Math.round(S.pos.distanceTo(P)),H.ring.visible,H.ring.children.length])")));
await q.evaluate(()=>window.__x("document.getElementById('comm')&&0"));await q.waitForTimeout(6000);await q.screenshot({path:'F_dock.png'});
console.log(await q.evaluate(()=>{const e=document.getElementById('wp');return [e.hidden,e.className,e.lastChild.textContent]}));
// turn away: the waypoint should become an edge arrow
await q.evaluate(()=>window.__x("FLY.h+=2.2;for(let i=0;i<6;i++)update(1/30)"));await q.waitForTimeout(2000);await q.screenshot({path:'F_dockAway.png'});
console.log(await q.evaluate(()=>{const e=document.getElementById('wp');return [e.hidden,e.className,e.lastChild.textContent]}));
console.log('errs',errs.slice(0,5));await b.close()})();
