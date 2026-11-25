const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:1000,height:640}});await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));const errs=[];q.on('pageerror',e=>errs.push(e.message));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:120000});await q.waitForTimeout(9000);
await q.evaluate(()=>window.__fly(2));await q.evaluate(()=>window.__fstep(.5));await q.evaluate(()=>window.__halcView());await q.evaluate(()=>window.__fstep(2));
console.log(await q.evaluate(()=>window.__tgDbg()));
console.log(errs);await b.close()})();
