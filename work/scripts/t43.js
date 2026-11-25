const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:720}});p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/f.html');await p.waitForTimeout(7000);
console.log('v1 save upgrade',await p.evaluate(()=>window.__v1()));
await p.click('#go');await p.waitForTimeout(1500);await p.evaluate(()=>{window.__hold=()=>window.__pin()});
await p.evaluate(()=>window.__ringBig());await p.waitForTimeout(500);const base=await p.evaluate(()=>window.__chain());console.log('base ',base);const t0=await p.evaluate(()=>window.__time());
for(let i=1;i<=6;i++){await p.keyboard.press('Digit'+i);await p.waitForTimeout(60);await p.keyboard.press('KeyG');await p.waitForTimeout(60);await p.keyboard.press('KeyF');await p.waitForTimeout(150)}
console.log('after 6 gren+6 melee',await p.evaluate(()=>window.__chain()));
for(const k of['KeyZ','KeyX','KeyC']){await p.keyboard.press(k);await p.waitForTimeout(120)}
console.log('after 3 supers   ',await p.evaluate(()=>window.__chain()));await p.screenshot({path:'chain.png'});
console.log('game seconds used',(await p.evaluate(()=>window.__time())-t0).toFixed(1));
await p.waitForTimeout(9000);console.log('later            ',await p.evaluate(()=>window.__chain()));
await p.waitForTimeout(9000);console.log('later2           ',await p.evaluate(()=>window.__chain()));
console.log(await p.evaluate(()=>window.__empty()));
await p.evaluate(()=>{openWheel()});await p.waitForTimeout(300);await p.screenshot({path:'wheel.png'});await p.evaluate(()=>closeWheel(false));
console.log(await p.evaluate(()=>window.__wheel()));
console.log('errs',errs);await b.close()})();
