const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:640,height:400}});p.on('pageerror',e=>errs.push(e.message));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/n.html',{timeout:90000});await p.waitForTimeout(8000);await p.click('#go');await p.waitForTimeout(1000);
// player stands in a cabin; enemies start in the far lounge, the hangar side and the spine
console.log(await p.evaluate(()=>window.__conn()));console.log(await p.evaluate(()=>window.__habTest()));for(let i=0;i<4;i++)console.log(await p.evaluate(()=>{window.__sim(10);window.__sim(10);return window.__ut.map(e=>e.type+':'+(e.dying?'dead':[e.pos.x,e.pos.y,e.pos.z].map(v=>v.toFixed(0))+' '+(e.st||e.state||''))).join(' | ')}));
console.log('errs',errs);await b.close()})();
