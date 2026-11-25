const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:720}});
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/ReadPixels/.test(m.text()))errs.push(m.text())});
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/f.html');await p.waitForTimeout(7000);await p.screenshot({path:'k_menu.png'});
await p.click('#go');await p.waitForTimeout(2500);
await p.evaluate(()=>{window.__tp(0,0,100,0,0.08);window.__gl()});await p.waitForTimeout(2500);await p.screenshot({path:'k_line.png'});
await p.evaluate(()=>window.__kill());await p.waitForTimeout(1000);
await p.evaluate(()=>{window.__tp(0,0,140,0,0);window.__live()});
for(let i=0;i<5;i++){await p.waitForTimeout(5000);console.log('t',(i+1)*5,await p.evaluate(()=>window.__gtime()),await p.evaluate(()=>window.__rep()))}
await p.screenshot({path:'k_live.png'});
console.log('calls',await p.evaluate(()=>window.__calls()));
console.log('errs',[...new Set(errs)]);await b.close()})();
