const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:680}});p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/x.html',{timeout:120000});await p.waitForTimeout(8000);await p.evaluate(()=>window.__vset({on:false}));
await p.evaluate(()=>{window.__camOv=[420,140,820,0,-600,-800]});
for(const m of['none','sky','atm','dw']){if(m!=='none')console.log(m,await p.evaluate(m=>{window.__farExp('reset');return window.__farExp(m)},m));await p.waitForTimeout(2000);await p.screenshot({path:'e_'+m+'.png'})}
console.log('errs',errs);await b.close()})();
