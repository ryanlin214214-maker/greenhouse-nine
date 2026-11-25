const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:700,height:440}});q.on('pageerror',e=>console.log('ERR',e.message));
await q.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await q.goto('file://'+process.cwd()+'/gtest/x3.html',{timeout:90000});await q.waitForTimeout(8000);
await q.evaluate(()=>{document.getElementById('overlay').hidden=true;window.__camOv=[0,1.7,-48,0,1.9,-110]});
for(let i=0;i<4;i++){await q.waitForTimeout(2500);console.log(JSON.stringify(await q.evaluate(()=>window.__lp())))}
await b.close()})();
