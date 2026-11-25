const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:900,height:560}});q.setDefaultTimeout(240000);
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t97x.html',{timeout:240000});await q.waitForTimeout(5000);
console.log(await q.evaluate(()=>window.__x("JSON.stringify(ROOMS.map(r=>Object.fromEntries(Object.entries(r).filter(([k,v])=>typeof v!=='object'))))")));
await b.close()})();
