const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1000,height:640}});q.setDefaultTimeout(180000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+(process.argv[2]||'n71.html'),{timeout:180000});await q.waitForTimeout(9000);await q.evaluate(()=>document.getElementById('go').click());await q.waitForTimeout(1500);
await q.evaluate(()=>window.__fx('setup'));
for(const [n,o] of [['fp_idle',{}],['fp_sprint',{spr:1}],['fp_draw',{draw:.3}],['fp_inspect',{insp:.9}],['fp_inspect2',{insp:1.35}],['fp_slide',{sl:1}]]){await q.evaluate(o=>{window.__fpo=o},o);await q.evaluate(()=>{for(const id of['hud','comms','radar','overlay','cine','msg'])document.getElementById(id).hidden=true});await q.waitForTimeout(1800);await q.screenshot({path:'A_'+n+'.png',clip:{x:76,y:58,width:848,height:532}})}
console.log('errs',errs);await b.close()})();
