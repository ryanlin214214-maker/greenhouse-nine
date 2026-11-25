const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const ctx=await b.newContext({viewport:{width:1100,height:720}});const errs=[];const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
const R=async pg=>{await pg.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await pg.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await pg.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})})};
await R(p);await p.goto('file://'+process.cwd()+'/gtest/f.html');await p.waitForTimeout(7000);await p.screenshot({path:'s_menu2.png'});
await p.click('#go');await p.waitForTimeout(1500);await p.evaluate(()=>{window.__hold=()=>window.__pin()});
for(const K of[0,1,2]){await p.evaluate(()=>window.__ring());console.log('super',K,await p.evaluate(K=>window.__sup(K),K));
  await p.waitForTimeout(250);await p.screenshot({path:'sup_cine'+K+'.png'});console.log('  mid ',await p.evaluate(()=>window.__supSt()));
  await p.waitForTimeout(4000);console.log('  after',await p.evaluate(()=>window.__supSt()));
  if(K===0){await p.evaluate(()=>window.__fire(true));await p.waitForTimeout(1500);await p.screenshot({path:'sup_ronin.png'});await p.evaluate(()=>window.__fire(false));console.log('  slash',await p.evaluate(()=>window.__supSt()))}
  if(K===2){await p.screenshot({path:'sup_volt.png'})}}
// save: clear stage 1 and 2
for(let i=0;i<3;i++){await p.evaluate(()=>window.__clearStage());await p.waitForTimeout(3000)}
console.log('save',await p.evaluate(()=>window.__saveSt()));
const p2=await ctx.newPage();p2.on('pageerror',e=>errs.push('p2 '+e.message));await R(p2);await p2.goto('file://'+process.cwd()+'/gtest/n.html');await p2.waitForTimeout(7000);
console.log('reloaded',await p2.evaluate(()=>window.__saveSt()));
await p2.evaluate(()=>document.getElementById('cont').click());await p2.waitForTimeout(3000);console.log('continued stage',await p2.evaluate(()=>document.getElementById('wave').textContent+' '+document.getElementById('objT').textContent+' '));console.log('continued',await p2.evaluate(()=>window.__gs()));
console.log('errs',errs);await b.close()})();
