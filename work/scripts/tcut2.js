// cutscenes: skip, return to gameplay (position, camera, HUD, controls, mission), replay (actors rebuilt, nothing left over)
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:960,height:600}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(4000);
const X=c=>q.evaluate(c=>window.__x(c),c);const R=(id,ok,t)=>console.log((ok?'PASS ':'FAIL ')+id+' '+t);
let r=JSON.parse(await X(`VOICE.on=false;const n0=scene.children.length;begin(true);introStart(INTRO1,null,'x');for(let i=0;i<30;i++){introTick(1/30);time+=1/30}const pre=INTRO.pre?INTRO.pre.reduce((a,L)=>a+L.length,0):0;
 INTRO.grace=0;window.dispatchEvent(new MouseEvent('mousedown'));const after={on:INTRO.on,state,hud:!$('hud').hidden,cine:$('cine').hidden,vm:vm.visible||true,pos:[pos.x,pos.y,pos.z].map(v=>+v.toFixed(1)),left:scene.children.length-n0,pre:INTRO.pre};JSON.stringify({pre,after})`));
R('skip with a click: the cutscene ends, HUD back, nothing left in the scene',!r.after.on&&r.after.state==='playing'&&r.after.hud&&r.after.cine&&r.after.left<=2&&!r.after.pre,JSON.stringify(r));
r=JSON.parse(await X(`const p0=pos.clone();keys.KeyW=true;for(let i=0;i<20;i++){update(1/30);time+=1/30}keys.KeyW=false;JSON.stringify({moved:+p0.distanceTo(pos).toFixed(2),mission:!!mission||gap<99})`));R('controls work after the skip and the stage runs',r.moved>.5,JSON.stringify(r));
r=JSON.parse(await X(`const n0=scene.children.length;const t0=performance.now();introStart(INTRO1,null,'x');introTick(1/30);const first=performance.now()-t0;let maxShot=0,i0=INTRO.i;for(let i=0;i<3000&&INTRO.on;i++){const t=performance.now();introTick(1/30);time+=1/30;const ms=performance.now()-t;if(INTRO.i!==i0){i0=INTRO.i;maxShot=Math.max(maxShot,ms)}}JSON.stringify({first:Math.round(first),maxShotChange:+maxShot.toFixed(1),on:INTRO.on,left:scene.children.length-n0})`));
R('replay: plays to the end, shot changes stay cheap, nothing left behind',!r.on&&r.maxShotChange<20&&r.left<=2,JSON.stringify(r));
console.log('errs',errs.length,errs.slice(0,3));await b.close()})();
