const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const jobs=[['gtest/sx.html#A','sA',{1:[0,1.7,-50,0,1.9,-110],2:[-2.5,1.7,-58,6.5,2,-67]}],['gtest/sx.html#B','sB',{1:[0,1.7,-50,0,1.9,-110],2:[-2.5,1.7,-58,6.5,2,-67]}],['gtest/ox.html','old',{1:[0,1.7,-60,0,3,-120]}]];
for(const[u,tag,v]of jobs){const errs=[];const cx=await b.newContext({viewport:{width:1100,height:680}});const q=await cx.newPage();q.on('pageerror',e=>errs.push(e.message));
await q.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await q.goto('file://'+process.cwd()+'/'+u,{timeout:90000});await q.waitForTimeout(9000);
await q.evaluate(()=>{document.getElementById('overlay').hidden=true});
for(const k in v){await q.evaluate(c=>{window.__camOv=c},v[k]);await q.waitForTimeout(3000);await q.screenshot({path:'d_'+tag+k+'.png'})}
console.log(tag,'errs',errs);await cx.close()}
await b.close()})();
