const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1100,height:680}});q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await q.goto('file://'+process.cwd()+'/gtest/x.html',{timeout:90000});await q.waitForTimeout(8000);await q.click('#go');await q.waitForTimeout(800);
console.log(await q.evaluate(()=>window.__gunRow()));
await q.evaluate(()=>{document.getElementById('hud').hidden=true;document.getElementById('comms').hidden=true;document.getElementById('cross').hidden=true;document.getElementById('radar').hidden=true});
const v={all:[0,1.5,190,0,1.1,180],rowan:[1.8,1.3,183,0,1.1,180],rowanSide:[3.6,1.3,180,0,1.1,180],trooper:[-6.4,1.3,183.5,-8,1.1,180],brute:[-3.4,1.4,184,-5,1.1,180],marks:[-.6,1.4,183,-2.4,1.1,180],rocket:[4.4,1.4,183.5,5,1.1,180]};
for(const k in v){await q.evaluate(c=>{window.__camOv=c;window.__lt()},v[k]);await q.waitForTimeout(1800);await q.screenshot({path:'g_'+k+'.png'})}
console.log('errs',errs);await b.close()})();
