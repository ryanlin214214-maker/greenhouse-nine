const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const h=process.argv[2];const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1100,height:680}});q.on('pageerror',e=>errs.push(e.message));
await q.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await q.goto('file://'+process.cwd()+'/gtest/ex.html#'+h,{timeout:90000});await q.waitForTimeout(9000);
await q.evaluate(()=>{document.getElementById('overlay').hidden=true});
const v={a:[640,230,-470,0,10,-40],b:[560,-30,430,0,20,60]};
for(const k in v){await q.evaluate(c=>{window.__camOv=c},v[k]);await q.waitForTimeout(2500);await q.evaluate(()=>window.__lt());await q.waitForTimeout(3000);await q.screenshot({path:'x_'+h+k+'.png'})}
console.log(h,'errs',errs);await b.close()})();
