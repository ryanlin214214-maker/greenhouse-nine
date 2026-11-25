const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:720}});p.on('pageerror',e=>errs.push(e.message));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/n.html');await p.waitForTimeout(8000);console.log(await p.evaluate(()=>window.__conn()));
await p.click('#go');await p.waitForTimeout(2500);console.log(await p.evaluate(()=>window.__wallPush()));
await p.evaluate(()=>window.__kill());
const P=Math.PI,v={n:[0,0,24,0,0.05],s:[0,0,24,P,0.05],gal:[-40,7.5,-33,-0.4,-0.15],bridge:[0,3.6,-180,0,-0.05]};
for(const k in v){await p.evaluate(a=>window.__tp(...a),v[k]);await p.waitForTimeout(2600);await p.screenshot({path:'v3_'+k+'.png'});console.log(k)}
console.log('errs',errs);await b.close()})();
