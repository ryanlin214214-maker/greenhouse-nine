const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:640,height:400}});q.setDefaultTimeout(240000);
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t99x.html',{timeout:240000});await q.waitForTimeout(5000);
await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(2000);
console.log(await q.evaluate(()=>window.__x(`const OZ=HC.z-1100;JSON.stringify(boxes.filter(b=>b.lo[2]-OZ<1408&&b.hi[2]-OZ>1403&&b.lo[0]-HC.x<1&&b.hi[0]-HC.x>-1).map(b=>[b.lo.map((v,i)=>+(v-(i==0?HC.x:i==2?OZ:0)).toFixed(1)),b.hi.map((v,i)=>+(v-(i==0?HC.x:i==2?OZ:0)).toFixed(1)),b.floor||0]))`)));
await b.close()})();
