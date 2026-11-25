const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1000,height:640}});q.on('pageerror',e=>errs.push(e.message));q.on('console',m=>{if(m.type()==='error'||/shader|WebGL/i.test(m.text()))errs.push(m.text().slice(0,300))});
await q.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await q.goto('file://'+process.cwd()+'/gtest/x.html',{timeout:120000});await q.waitForTimeout(8000);await q.click('#go');await q.waitForTimeout(800);
await q.evaluate(()=>window.__fx('setup'));await q.evaluate(()=>window.__fx('gl'));await q.evaluate(()=>window.__fx('step',.1));console.log(await q.evaluate(()=>window.__pf()));
console.log(errs.slice(0,5));await b.close()})();
