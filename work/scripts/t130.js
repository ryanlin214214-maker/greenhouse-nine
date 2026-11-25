const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:900,height:560}});p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/'+(process.argv[2]||'n.html'),{timeout:120000});await p.waitForTimeout(8000);await p.evaluate(()=>window.__vset({on:false}));
console.log('fog before:',await p.evaluate(()=>window.__fogN()));
console.log('start 2-1:',await p.evaluate(()=>window.__fly(1)));
console.log(await p.evaluate(()=>window.__flyExitTest()));
console.log('fight wave 1 for 10 s:',await p.evaluate(()=>window.__fstep(10)));
console.log(await p.evaluate(()=>window.__topSpeed()));
for(const w of['mg','msl','mac'])console.log(await p.evaluate(w=>window.__weapon(w),w));
if(process.argv[2]==='real.html'){console.log(await p.evaluate(()=>window.__idleFly()))}
console.log('errs',errs);await b.close()})();
