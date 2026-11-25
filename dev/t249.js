const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1500,height:950}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t108x.html',{timeout:240000});await q.waitForTimeout(5000);const X=c=>q.evaluate(c=>window.__x(c),c);
await X(`cdxOpen()`);
for(const id of(process.env.IDS||'E13,E14').split(','))for(const[n,y]of[['front',0],['q34',.75],['back',2.6]]){await X(`cdxShow('${id}');CDX.yaw=${y};CDX.drag=1`);await q.waitForTimeout(2200);const el=await q.$('#cdxView');await el.screenshot({path:'dk_'+id+'_'+n+'.png'})}
console.log('errs',errs);await b.close()})();
