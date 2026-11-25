const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:720}});p.on('pageerror',e=>errs.push(e.message));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/x.html');await p.waitForTimeout(9000);
await p.evaluate(()=>{document.getElementById('overlay').hidden=true});
const views={side:[620,120,-150,0,0,-40],stern:[260,90,820,0,10,200],bow:[-420,60,-980,0,-10,-300],top:[300,420,300,0,0,0]};
for(const k in views){await p.evaluate(v=>{window.__camOv=v},views[k]);await p.waitForTimeout(3000);await p.screenshot({path:'ext_'+k+'.png'});console.log(k)}
console.log('errs',errs);await b.close()})();
