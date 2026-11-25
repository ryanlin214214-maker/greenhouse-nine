const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:720}});
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/ReadPixels/.test(m.text()))errs.push(m.text())});
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
const t0=Date.now();await p.goto('file://'+process.cwd()+'/gtest/v.html');await p.waitForTimeout(5000);console.log('loaded',Date.now()-t0);
await p.screenshot({path:'v_menu.png'});
await p.click('#go');await p.waitForTimeout(1500);
const H=Math.PI/2;
const views={start:null,prom:[0,0,84,Math.PI,-0.38],summit:[0,10.5,-92,Math.PI,-0.08],spire:[-85,20,-6,-2.2,-0.15],lake:[86,0.3,-10,-2.266,0.2]};
for(const k in views){if(views[k])await p.evaluate(v=>window.__tp(...v),views[k]);await p.waitForTimeout(2500);await p.screenshot({path:'v_'+k+'.png'});console.log(k,'ok')}
// walk + pad test: tower pad
await p.evaluate(()=>window.__tp(54,0,54,0,0));await p.waitForTimeout(2500);
console.log('obj',await p.evaluate(()=>document.getElementById('objT').textContent));
console.log('errs',[...new Set(errs)]);await b.close()})();
