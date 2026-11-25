const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:720}});
p.on('pageerror',e=>errs.push(e.message));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/f.html');await p.waitForTimeout(6000);await p.click('#go');await p.waitForTimeout(2000);
await p.evaluate(()=>{window.__tact();window.__hold=()=>{}});
for(let i=0;i<8;i++){await p.waitForTimeout(4000);console.log('t',i,await p.evaluate(()=>window.__tactRep()));if(i===3)await p.evaluate(()=>{window.__onRoof();window.__hold=()=>{window.__onRoof()}})}
await p.screenshot({path:'c_tact.png'});
console.log('errs',errs);await b.close()})();
