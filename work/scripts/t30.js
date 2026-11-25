const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:720}});
p.on('pageerror',e=>errs.push(e.message));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/f.html');await p.waitForTimeout(7000);await p.click('#go');await p.waitForTimeout(1500);
await p.evaluate(()=>{window.__live2();window.__hold=()=>window.__pin()});await p.waitForTimeout(1500);await p.screenshot({path:'n2_line.png'});
console.log(await p.evaluate(()=>window.__shieldTest()));
for(let i=0;i<3;i++){await p.waitForTimeout(5000);console.log('t',i,await p.evaluate(()=>window.__rep2()))}
console.log('errs',errs);await b.close()})();
