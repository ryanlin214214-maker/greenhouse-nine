const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:720}});
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/ReadPixels/.test(m.text()))errs.push(m.text())});
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/n.html');await p.waitForTimeout(8000);
await p.click('#go');await p.waitForTimeout(5000);await p.screenshot({path:'h_story.png'});
console.log('comms',await p.evaluate(()=>document.getElementById('comms').hidden+' | '+document.getElementById('commWho').textContent+' | '+document.getElementById('commText').textContent));
const v={outpost:[240,0,-200,0,0.1],edge:[0,0,505,0,-0.35],sky:[0,0,0,-2.4,0.45],tower:[430,0,425,-2.3,0.2]};
for(const k in v){await p.evaluate(a=>window.__tp(...a),v[k]);await p.waitForTimeout(3000);await p.screenshot({path:'h_'+k+'.png'});console.log(k)}
console.log('calls',await p.evaluate(()=>window.__calls()));
console.log('errs',[...new Set(errs)]);await b.close()})();
