const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:680}});p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/x.html',{timeout:120000});await p.waitForTimeout(8000);await p.evaluate(()=>window.__vset({on:false}));
await p.click('#go');await p.waitForTimeout(500);await p.evaluate(()=>{window.__camOv=[0,1.7,24,0,1.7,-40]});await p.waitForTimeout(1500);await p.screenshot({path:'f_commons_before.png'});await p.evaluate(()=>{window.__camOv=null});
console.log(await p.evaluate(()=>window.__l2cine()));
for(const [n,t] of[['board',4.5+8+4.5]]){await p.evaluate(t=>window.__introAt(t),t);await p.waitForTimeout(2500);await p.screenshot({path:'f_'+n+'.png'})}
await p.keyboard.press('Space');await p.waitForTimeout(1500);await p.screenshot({path:'h2_start.png'});
await p.evaluate(()=>{window.__camOv=[0,14,190,0,4,250]});await p.waitForTimeout(2000);await p.screenshot({path:'h2_lane.png'});
console.log('vehicles:',await p.evaluate(()=>window.__conn().split('|').slice(-1)[0]));
console.log('errs',errs);await b.close()})();
