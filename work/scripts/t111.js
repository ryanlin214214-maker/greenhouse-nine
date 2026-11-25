const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1000,height:640}});q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));q.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text().slice(0,160))});
await q.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await q.goto('file://'+process.cwd()+'/gtest/x.html',{timeout:90000});await q.waitForTimeout(8000);await q.evaluate(()=>window.__vset({on:false}));await q.click('#go');await q.waitForTimeout(800);
console.log(await q.evaluate(()=>window.__walkInto(true)));console.log(await q.evaluate(()=>window.__killWatch()));
await q.evaluate(()=>{window.__camOv=[0,2.2,203,0,1,196];for(const id of['hud','comms','cross','radar'])document.getElementById(id).hidden=true});
for(const t of[0.3,0.7,1,2,4]){console.log(await q.evaluate(s=>window.__kwSim(s),t));if(t===0.7){await q.waitForTimeout(1200);await q.screenshot({path:'k_mid.png'})}}
await q.waitForTimeout(1500);await q.screenshot({path:'k_after.png'});
console.log('errs',errs);await b.close()})();
