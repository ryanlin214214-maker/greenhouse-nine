const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:680}});p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/x.html',{timeout:120000});await p.waitForTimeout(8000);await p.evaluate(()=>window.__vset({on:false}));
await p.evaluate(()=>window.__jump(1,3));await p.evaluate(()=>{for(const id of['hud','comms','cross','radar','msg','obj'])document.getElementById(id).hidden=true;window.__vset&&0;document.getElementById('msg').style.display='none'});
console.log(await p.evaluate(()=>window.__showShip()));
const V={front34:[-7.5,4.2,176.5,0,2.3,184],side:[-14,2.8,185,0,2.4,185],rear34:[7,4.6,194,0,2.4,185],top:[0.1,16,185.1,0,2,185],below:[-5.5,1.0,179,0,2.4,184.5]};
for(const k in V){await p.evaluate(c=>{window.__camOv=c},V[k]);await p.waitForTimeout(2200);await p.screenshot({path:'s_'+k+'.png'})}
await p.evaluate(()=>window.__shipFly(1));await p.evaluate(()=>{window.__camOv=[5.5,3.4,195.5,0,2.4,185]});await p.waitForTimeout(2000);await p.screenshot({path:'s_boost.png'});
console.log('errs',errs);await b.close()})();
