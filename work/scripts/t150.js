const {chromium}=require('playwright');const fs=require('fs');const pre=process.argv[2]||'L';
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1000,height:640}});q.on('pageerror',e=>errs.push(e.message));
await q.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await q.goto('file://'+process.cwd()+'/gtest/x.html',{timeout:90000});await q.waitForTimeout(8000);await q.click('#go');await q.waitForTimeout(800);
console.log(await q.evaluate(()=>window.__line(.5)));
await q.evaluate(()=>{for(const id of['hud','comms','cross','radar','overlay','cine'])document.getElementById(id).hidden=true});
const shot=async(name,c)=>{await q.evaluate(a=>{window.__camOv=a;window.__lt()},c);await q.waitForTimeout(1500);await q.screenshot({path:pre+'_'+name+'.png'})};
await shot('wide',[0,1.6,201,0,.9,190]);
for(let k=0;k<3;k++){const x=-6+k*6;await shot('c'+k,[x+.6,1.4,194.6,x,.85,190])}
await q.evaluate(()=>window.__lnSpin(2.6));
for(let k=0;k<3;k++){const x=-6+k*6;await shot('b'+k,[x+.6,1.4,194.6,x,.85,190])}
console.log('errs',errs);await b.close()})();
