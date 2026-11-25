const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:720}});p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/f.html');await p.waitForTimeout(7000);await p.click('#go');await p.waitForTimeout(1500);
await p.evaluate(()=>{window.__hold=()=>window.__pin()});const base=await p.evaluate(()=>window.__ragBase());await p.waitForTimeout(800);console.log('baseline',JSON.stringify(await p.evaluate(()=>window.__ragBase())));
await p.evaluate(()=>window.__rag());await p.waitForTimeout(800);console.log('killed',await p.evaluate(()=>window.__ragKill()));
const t0=await p.evaluate(()=>window.__time());
for(let i=0;i<10;i++){await p.waitForTimeout(1200);const t=(await p.evaluate(()=>window.__time())-t0).toFixed(1);console.log('t+'+t,await p.evaluate(()=>window.__ragW()));if(i===1)await p.screenshot({path:'rag2.png'});if(+t>12)break}
console.log('end',await p.evaluate(()=>window.__ragRep()));console.log('errs',errs);await b.close()})();
