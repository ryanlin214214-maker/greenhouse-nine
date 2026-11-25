const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:640,height:400}});p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/n.html',{timeout:90000});await p.waitForTimeout(8000);await p.click('#go');await p.waitForTimeout(1000);
for(let r=0;r<6;r++){console.log('run',r,await p.evaluate(z=>{window.__spineTest2(z);return window.__ut.map(e=>e.type+':'+[e.pos.x,e.pos.y,e.pos.z].map(v=>v.toFixed(0))).join(' ')+' || '+window.__jumpLog(20)+' || '+window.__upRep()},r%2?95:-100))}
console.log('errs',errs);await b.close()})();
