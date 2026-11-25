const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:720}});
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/ReadPixels/.test(m.text()))errs.push(m.text())});
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/n.html');await p.waitForTimeout(8000);
console.log(await p.evaluate(()=>window.__overlap()));await p.screenshot({path:'s_menu.png'});
await p.click('#go');await p.waitForTimeout(3000);
const v={hangar:[0,0,520,Math.PI,0.12],battery:[0,0,-540,0,0.25],trench:[597,0,120,0,0.05],reactor:[-520,0,0,Math.PI/2,0.2],wall:[300,0,560,Math.PI*0.75,0.15]};
for(const k in v){await p.evaluate(a=>window.__tp(...a),v[k]);await p.waitForTimeout(3000);await p.screenshot({path:'s_'+k+'.png'});console.log(k)}
console.log('calls',await p.evaluate(()=>window.__calls()));console.log('errs',[...new Set(errs)]);await b.close()})();
