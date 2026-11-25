const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:720}});
p.on('pageerror',e=>errs.push(e.message));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/n.html');await p.waitForTimeout(7000);await p.click('#go');await p.waitForTimeout(1500);
for(const k of['colossus','widow']){await p.evaluate(k=>{window.__bossK(k);window.__B.pos.z=-4;window.__B.cv=99;window.__B.cs=99;window.__B.cm=99},k);await p.evaluate(()=>window.__tp(0,0,22,0,0.3));await p.waitForTimeout(3000);await p.screenshot({path:'boss2_'+k+'.png'})}
console.log('errs',errs);await b.close()})();
