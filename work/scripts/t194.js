const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1100,height:700}});q.setDefaultTimeout(180000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/n87.html',{timeout:180000});await q.waitForTimeout(9000);
await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(6000);
for(const [k,z] of [['w',-2425],['a',-2400],['s',-2375]]){await q.evaluate(c=>{window.__camOv=c},[24.4,2.05,z+1.2,26.6,1.55,z]);await q.waitForTimeout(2500);await q.screenshot({path:'V_'+k+'.png',timeout:120000})}
console.log('errs',errs);await b.close()})();
