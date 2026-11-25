const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:1100,height:700}});q.setDefaultTimeout(180000);
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/n86.html',{timeout:180000});await q.waitForTimeout(9000);
await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(1500);console.log(await q.evaluate(()=>window.__hubDbg()));
await q.evaluate(()=>window.__hub('walk',[22.6,-2425,0]));console.log('right after',await q.evaluate(()=>window.__hubDbg()));await q.waitForTimeout(1500);console.log('1.5 s later',await q.evaluate(()=>window.__hubDbg()));
await b.close()})();
