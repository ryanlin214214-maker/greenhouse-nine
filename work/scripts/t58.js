const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1100,height:680}});q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));q.on('console',m=>{if(/stair|FAIL/i.test(m.text()))console.log('LOG',m.text().slice(0,200))});
await q.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await q.goto('file://'+process.cwd()+'/gtest/x.html',{timeout:90000});await q.waitForTimeout(10000);console.log(await q.evaluate(()=>window.__conn()));
await q.evaluate(()=>{document.getElementById('overlay').hidden=true});
const v=JSON.parse(process.argv[2]);
for(const k in v){await q.evaluate(c=>{window.__camOv=c},v[k]);await q.waitForTimeout(2500);await q.evaluate(()=>window.__lt());await q.waitForTimeout(3000);await q.screenshot({path:'e_'+k+'.png'})}
console.log('errs',errs);await b.close()})();
