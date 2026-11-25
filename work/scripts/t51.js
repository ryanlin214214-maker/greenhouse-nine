const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const R=async pg=>{pg.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));await pg.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await pg.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await pg.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})})};
const p=await b.newPage({viewport:{width:900,height:560}});await R(p);await p.goto('file://'+process.cwd()+'/gtest/f.html',{timeout:90000});await p.waitForTimeout(9000);await p.click('#go');await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>window.__padTest(24.5,0,0)));console.log(await p.evaluate(()=>window.__padTest(20,10,7)));
await p.evaluate(()=>{window.__upTest();window.__hold=()=>window.__pinL()});
for(let i=0;i<9;i++){await p.waitForTimeout(4000);console.log('t'+i,await p.evaluate(()=>window.__time().toFixed(0)),await p.evaluate(()=>window.__upRep()))}
await p.close();
const q=await b.newPage({viewport:{width:1100,height:680}});await R(q);await q.goto('file://'+process.cwd()+'/gtest/x.html',{timeout:90000});await q.waitForTimeout(9000);await q.screenshot({path:'a_menu.png'});
await q.evaluate(()=>{document.getElementById('overlay').hidden=true});
const v={floor:[0,1.7,13,0,14,-10],up:[-10,1.7,4,6,26,-3],l3:[20,11.7,12,-10,8,-14],l5:[-30,21.7,0,30,12,6],wing:[85,6,20,30,10,-5],sky:[0,21.7,5,400,2300,-1250]};
for(const k in v){await q.evaluate(c=>{window.__camOv=c},v[k]);await q.waitForTimeout(2500);await q.screenshot({path:'a_'+k+'.png'});console.log(k)}
console.log('errs',errs);await b.close()})();
