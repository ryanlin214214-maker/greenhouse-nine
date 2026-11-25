const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:800,height:500}});q.on('pageerror',e=>errs.push(e.message));
await q.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await q.goto('file://'+process.cwd()+'/gtest/f.html',{timeout:90000});await q.waitForTimeout(8000);await q.click('#go');await q.waitForTimeout(1500);
await q.evaluate(()=>window.__kill());console.log(await q.evaluate(()=>window.__skiffMid()));await q.keyboard.down('KeyW');await q.keyboard.down('ShiftLeft');await q.keyboard.down('ArrowUp');await q.waitForTimeout(500);await q.keyboard.up('ArrowUp');
for(let i=0;i<8;i++){await q.waitForTimeout(2500);console.log(await q.evaluate(()=>window.__vst()))}
console.log('errs',errs);await b.close()})();
