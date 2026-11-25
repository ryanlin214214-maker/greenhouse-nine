const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:640,height:400}});p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/n.html',{timeout:90000});await p.waitForTimeout(8000);await p.click('#go');await p.waitForTimeout(1000);
const n=await p.evaluate(()=>window.__nStairs());let pass=0;for(let i=0;i<n;i++)for(const d of[false,true]){const r=await p.evaluate(a=>window.__walkStair(a[0],a[1]),[i,d]);if(/^PASS/.test(r))pass++;else console.log(r)}
console.log('stairs walked',pass,'/',n*2);
for(const pz of[-100,95]){await p.evaluate(z=>window.__spineTest(z),pz);let last='';for(let i=0;i<4;i++){last=await p.evaluate(()=>window.__sim(10));}console.log('spine',pz,'after 40 s:',await p.evaluate(()=>window.__spRep()))}
await p.evaluate(()=>window.__stage2());for(let i=0;i<4;i++)console.log('stage2 t='+(i+1)*10,await p.evaluate(()=>window.__s2(10)));
console.log('errs',errs);await b.close()})();
