const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1000,height:640}});q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));q.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text().slice(0,160))});
await q.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await q.goto('file://'+process.cwd()+'/gtest/rag.html',{timeout:90000});await q.waitForTimeout(8000);await q.evaluate(()=>window.__vset({on:false}));await q.click('#go');await q.waitForTimeout(800);
for(const mode of['cone','p2p','nocon']){await q.evaluate(m=>{window.__p2p=m==='p2p';window.__nocon=m==='nocon'},mode);console.log(mode,await q.evaluate(()=>window.__killWatch()));console.log(mode,await q.evaluate(()=>window.__kwSim(2)));console.log(mode,await q.evaluate(()=>window.__kwSim(2)))}
console.log('errs',errs);await b.close()})();
