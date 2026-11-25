const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:720}});
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/ReadPixels/.test(m.text()))errs.push(m.text())});
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
const t0=Date.now();await p.goto('file://'+process.cwd()+'/gtest/v.html');await p.waitForTimeout(8000);console.log('loaded',Date.now()-t0);
await p.click('#go');await p.waitForTimeout(3000);
const views={grass:[150,0,200,2.4,0.05],far:[400,0,360,0.7,0.1],tower:[430,0,425,-2.3,0.3],north:[0,10.5,-104,0,0.2]};
for(const k in views){await p.evaluate(v=>window.__tp(...v),views[k]);await p.waitForTimeout(3000);await p.screenshot({path:'e_'+k+'.png'});console.log(k,'ok')}
console.log('errs',[...new Set(errs)]);await b.close()})();
