const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:720}});p.on('pageerror',e=>errs.push(e.message));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/f.html');await p.waitForTimeout(7000);await p.click('#go');await p.waitForTimeout(1500);await p.evaluate(()=>{window.__hold=()=>window.__pin()});
for(const K of['fire','stun','cluster','well','thorn','frag']){await p.evaluate(()=>window.__ring());console.log(await p.evaluate(K=>window.__gb(K),K));
  if(K==='fire'){await p.evaluate(()=>window.__tp(0,0,24,0,-0.25));await p.waitForTimeout(700);await p.screenshot({path:'w_firepatch.png'})}
  await p.waitForTimeout(1500);console.log('   later',await p.evaluate(()=>window.__wst()))}
console.log('errs',errs);await b.close()})();
