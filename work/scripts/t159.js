const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1000,height:640}});q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await q.goto('file://'+process.cwd()+'/gtest/n.html',{timeout:120000});await q.waitForTimeout(8000);
console.log(await q.evaluate(()=>window.__fly(1)));
console.log(await q.evaluate(()=>{const S=window.__fstep(.5);return S}));
console.log(await q.evaluate(()=>{window.__s2&&0;return 'x'}));
// jump stage 2-1 to its end
console.log(await q.evaluate(()=>{const r=window.__fstep(0);return r}));
await q.evaluate(()=>window.__end1());await q.evaluate(()=>window.__fstep(6));
console.log('after stage 2-1:',await q.evaluate(()=>window.__fst()+' | '+document.getElementById('ovTitle').textContent+' | '+document.getElementById('go').textContent));
await q.click('#go');await q.waitForTimeout(500);await q.evaluate(()=>window.__fstep(1));console.log('after Continue:',await q.evaluate(()=>window.__s2('info')));
console.log('menu:',await q.evaluate(()=>window.__menu()));
console.log('errs',errs);await b.close()})();
