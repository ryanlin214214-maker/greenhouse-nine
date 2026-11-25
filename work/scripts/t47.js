const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const R=async pg=>{pg.on('pageerror',e=>errs.push(e.message));await pg.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await pg.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await pg.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})})};
const p=await b.newPage({viewport:{width:1100,height:720}});await R(p);await p.goto('file://'+process.cwd()+'/gtest/x.html');await p.waitForTimeout(10000);
console.log(await p.evaluate(()=>window.__conn()));await p.evaluate(()=>{document.getElementById('overlay').hidden=true});
const views={side:[640,90,-120,0,0,-40],stern:[330,80,760,0,10,200],quarter:[-520,160,520,0,0,0],bow:[-380,40,-900,0,-10,-300]};
for(const k in views){await p.evaluate(v=>{window.__camOv=v},views[k]);await p.waitForTimeout(3000);await p.screenshot({path:'ext2_'+k+'.png'});console.log(k)}
// skiff: fly out of the hangar mouth
const q=await b.newPage({viewport:{width:900,height:600}});await R(q);await q.goto('file://'+process.cwd()+'/gtest/f.html');await q.waitForTimeout(8000);await q.click('#go');await q.waitForTimeout(1500);
await q.evaluate(()=>window.__kill());console.log(await q.evaluate(()=>window.__skiffOut()));await q.keyboard.down('KeyW');await q.keyboard.down('ArrowUp');await q.waitForTimeout(600);await q.keyboard.up('ArrowUp');
for(let i=0;i<6;i++){await q.waitForTimeout(3000);console.log(await q.evaluate(()=>window.__vst()))}
console.log('errs',errs);await b.close()})();
