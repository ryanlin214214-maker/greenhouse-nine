const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:720}});
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/ReadPixels/.test(m.text()))errs.push(m.text())});
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/v.html#god');await p.waitForTimeout(6000);
await p.click('#cfg');await p.selectOption('#setQ','med');await p.click('#setClose');
await p.click('#go');await p.waitForTimeout(2500);
const H=Math.PI/2;
await p.evaluate(()=>{window.__tp(0,0,140,Math.PI,0.02);window.__sp()});await p.waitForTimeout(6000);await p.screenshot({path:'d_troop.png'});console.log('troop ok',JSON.stringify(await p.evaluate(()=>window.__st())));
const views={spire:[-85,20,6,2.2,-0.2],outpost:[240,0,-196,0,0.12],dome:[-200,0,128,Math.PI,0.15],field:[130,0,60,-H-0.5,-0.05],summit:[0,10.5,-104,Math.PI,-0.1]};
for(const k in views){await p.evaluate(v=>window.__tp(...v),views[k]);await p.waitForTimeout(2500);await p.screenshot({path:'d_'+k+'.png'});console.log(k,'ok')}
console.log('errs',[...new Set(errs)]);await b.close()})();
