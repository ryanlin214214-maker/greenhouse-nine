const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:960,height:600}});p.on('pageerror',e=>errs.push(e.message));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/x.html',{timeout:90000});await p.waitForTimeout(9000);await p.evaluate(()=>{document.getElementById('overlay').hidden=true;document.getElementById('comms').hidden=true});
const cams=await p.evaluate(()=>window.__stairCams());
for(let i=0;i<cams.length;i++){for(const k of['side','foot']){await p.evaluate(v=>{window.__camOv=v},cams[i][k]);await p.waitForTimeout(1600);await p.screenshot({path:'st/'+i+'_'+k+'.png'})}console.log(i,cams[i].name)}
console.log('errs',errs);await b.close()})();
