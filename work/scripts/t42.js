const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:720}});p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/n.html');await p.waitForTimeout(9000);console.log(await p.evaluate(()=>window.__conn()));
await p.click('#go');await p.waitForTimeout(2000);await p.evaluate(()=>{window.__hold=()=>window.__pin();window.__kill()});
const P=Math.PI,v={farm:[-60,0,-60,0.4,0.05],sfarm:[30,0,-60,-0.6,0.05],hab:[-28,0,60,0.3,0],eng:[30,0,60,-0.8,0.05],hangar:[0,0,165,P,0.05],bridge:[0,3.6,-170,0,-0.05],spine:[0,0,-50,0,0.02]};
for(const k in v){await p.evaluate(a=>{window.__hold=()=>{};window.__tp(...a)},v[k]);await p.waitForTimeout(2600);await p.screenshot({path:'r_'+k+'.png'});console.log(k)}
console.log('calls',await p.evaluate(()=>window.__calls()));console.log('errs',errs);await b.close()})();
