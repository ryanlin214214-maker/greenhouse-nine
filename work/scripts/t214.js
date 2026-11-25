const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];
for(const [W,H] of (process.argv[3]?[[+process.argv[3],+process.argv[4]]]:[[1000,640],[800,560],[420,800]])){
const q=await b.newPage({viewport:{width:W,height:H}});q.setDefaultTimeout(240000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(6000);
await q.evaluate(()=>window.__rowLook&&window.__rowLook());await q.waitForTimeout(800);
await q.evaluate(()=>window.__x("INTRO.on=false;setState('playing');for(let i=0;i<10;i++)update(1/30);const o=wpDraw;wpDraw=function(){if(window.__wpc)window.__x(window.__wpc);o()}"));
// route to the hangar; face the first lit door on the route from 9 m away
const r=await q.evaluate(()=>window.__x("WPR.key=-2;wpRoute(0,200,'HANGAR');const D=WPR.doors[0];if(D){const dx=D.ax==='x'?D.c:D.dc,dz=D.ax==='x'?D.dc:D.c;let px=dx,pz=dz;if(D.ax==='x')px-=9*Math.sign(dx-pos.x||1);else pz-=9*Math.sign(dz-pos.z||1);pos.set(px,pos.y,pz);eye.set(px,pos.y+EYE,pz);yaw=Math.atan2(-(dx-px),-(dz-pz));pitch=0;WPR.key=-2}JSON.stringify(D)"));
await q.evaluate(()=>{window.__wpc="wpRoute(0,200,'HANGAR');WPR.live=true;setObj('BOSS · COLOSSUS · ENGINE DECK · PURGE · 12 LEFT · DESTROY THE COOLANT NODES TO OPEN ITS CHEST',.62)"});
await q.waitForTimeout(3500);await q.screenshot({path:'D_'+W+'.png'});
console.log(W,r,await q.evaluate(()=>{const R=id=>{const e=document.getElementById(id);if(!e||e.hidden)return null;const r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top),Math.round(r.right),Math.round(r.bottom)]};return JSON.stringify({hud:R('hud'),obj:R('obj'),radar:R('radar'),wp:R('wp')})}));
await q.close()}
console.log('errs',errs.slice(0,4));await b.close()})();
