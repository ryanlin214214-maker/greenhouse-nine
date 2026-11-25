const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[],warns=[];const p=await b.newPage({viewport:{width:900,height:600}});p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));p.on('console',m=>{if(m.type()==='warning')warns.push(m.text())});
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/n.html',{timeout:90000});await p.waitForTimeout(9000);
console.log(await p.evaluate(()=>window.__stairList()));console.log(await p.evaluate(()=>window.__conn()));
await p.click('#go');await p.waitForTimeout(1500);
const n=await p.evaluate(()=>window.__nStairs());for(let i=0;i<n;i++){console.log(await p.evaluate(i=>window.__walkStair(i,false),i));console.log(await p.evaluate(i=>window.__walkStair(i,true),i))}
console.log('warnings',warns.filter(w=>/stair/.test(w)));console.log('errs',errs);await b.close()})();
