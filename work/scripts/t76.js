const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:680}});p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/n.html',{timeout:90000});await p.waitForTimeout(8000);await p.click('#go');await p.waitForTimeout(3000);
console.log('music in intro:',await p.evaluate(()=>window.__mus()));
const T={march1:33.5+1.2,march2:33.5+5.8,march3:33.5+6.6};
for(const k in T){console.log(k,await p.evaluate(a=>window.__introAt(a),T[k]),await p.evaluate(()=>window.__acts()));await p.waitForTimeout(3500);await p.screenshot({path:'j_'+k+'.png'})}
await p.keyboard.press('Space');await p.waitForTimeout(2500);console.log('after skip:',await p.evaluate(()=>window.__ist()),'|',await p.evaluate(()=>window.__acts()),'|',await p.evaluate(()=>window.__mus()));
console.log(await p.evaluate(()=>{window.__step(12);return 'stage 1 running: '+window.__ist()}));await p.waitForTimeout(2500);console.log('music in combat:',await p.evaluate(()=>window.__mus()));
await p.click('#mus').catch(()=>{});console.log('errs',errs);await b.close()})();
