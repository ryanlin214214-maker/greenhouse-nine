const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1100,height:680}});q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await q.goto('file://'+process.cwd()+'/gtest/x.html',{timeout:90000});await q.waitForTimeout(10000);console.log(await q.evaluate(()=>window.__conn()).then(s=>s.slice(0,60)));
await q.evaluate(()=>{document.getElementById('overlay').hidden=true});
const v={atrium:[0,1.7,13,0,13,-10],door:[7,1.7,-28,-2,3,-41],spine:[0,1.7,-60,0,3,-120],hangar:[0,1.7,165,0,6,230],hab:[0,1.7,60,10,3,90],atr2:[30,11.7,10,-20,8,-10],farm:[-60,1.7,-140,-90,5,-190],bridge:[0,1.7,-225,0,4,-255]};
for(const k in v){await q.evaluate(c=>{window.__camOv=c},v[k]);await q.waitForTimeout(2500);await q.screenshot({path:'c_'+k+'.png'})}
console.log('errs',errs);await b.close()})();
