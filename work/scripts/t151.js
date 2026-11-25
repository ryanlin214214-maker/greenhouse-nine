const {chromium}=require('playwright');const fs=require('fs');const pre=process.argv[2]||'L';const page=process.argv[3]||'x';
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1000,height:640}});q.on('pageerror',e=>errs.push(e.message));
await q.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await q.goto('file://'+process.cwd()+'/gtest/'+page+'.html',{timeout:90000});await q.waitForTimeout(8000);await q.click('#go');await q.waitForTimeout(800);
console.log(await q.evaluate(()=>window.__line(.45)));
await q.evaluate(()=>{for(const id of['hud','comms','cross','radar','overlay','cine'])document.getElementById(id).hidden=true});
const shot=async(name,c)=>{await q.evaluate(a=>{window.__camOv=a;window.__lt()},c);await q.waitForTimeout(1200);await q.screenshot({path:pre+'_'+name+'.png',clip:{x:76,y:58,width:848,height:532}})};
const vs=(process.argv[4]||'0,1,2,3,4,5,6,7,8').split(',').map(Number);
for(const v of vs){const x=-8+v*2,sc=[1,1.45,.78,1,1.1,.85,1,1.05,.98][v];await shot('v'+v,[x+.8*sc,.95+.45*sc,190+1.75*sc,x,.95+.1*sc,190])}
if(!process.argv[4]){await q.evaluate(()=>window.__lnSpin(2.7));for(const v of[0,1,7,8]){const x=-8+v*2,sc=[1,1.45,.78,1,1.1,.85,1,1.05,.98][v];await shot('r'+v,[x+.8*sc,.95+.45*sc,190+1.75*sc,x,.95+.1*sc,190])}}
console.log('errs',errs);await b.close()})();
