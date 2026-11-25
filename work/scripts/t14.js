const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:720}});
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/ReadPixels/.test(m.text()))errs.push(m.text())});
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
const t0=Date.now();await p.goto('file://'+process.cwd()+'/gtest/v.html#god');await p.waitForTimeout(6000);console.log('loaded',Date.now()-t0,'errs so far',errs);
await p.click('#cfg');await p.selectOption('#setQ','med');await p.click('#setClose');
await p.click('#go');await p.waitForTimeout(6000);
console.log('start',JSON.stringify(await p.evaluate(()=>window.__st())));await p.screenshot({path:'c_start.png'});
// car
await p.evaluate(()=>window.__tp(3,0,19.5,Math.PI,0));await p.waitForTimeout(800);
console.log('hint',await p.evaluate(()=>document.getElementById('veh').textContent));
await p.keyboard.press('KeyE');await p.waitForTimeout(800);await p.keyboard.down('KeyW');await p.waitForTimeout(5000);
console.log('car',JSON.stringify(await p.evaluate(()=>window.__st())),await p.evaluate(()=>document.getElementById('veh').textContent));await p.screenshot({path:'c_car.png'});
await p.keyboard.up('KeyW');await p.keyboard.press('KeyE');await p.waitForTimeout(800);console.log('exit',JSON.stringify(await p.evaluate(()=>window.__st())));
// troopers view
await p.waitForTimeout(3000);await p.screenshot({path:'c_troop.png'});
// plane
await p.evaluate(()=>window.__tp(152,0,-66,-Math.PI/2,0));await p.waitForTimeout(800);await p.screenshot({path:'c_air.png'});
await p.keyboard.press('KeyE');await p.waitForTimeout(500);await p.keyboard.down('KeyW');await p.waitForTimeout(7000);
console.log('roll',JSON.stringify(await p.evaluate(()=>window.__st())));
await p.keyboard.down('ArrowUp');await p.waitForTimeout(700);await p.keyboard.up('ArrowUp');await p.waitForTimeout(5000);
console.log('fly',JSON.stringify(await p.evaluate(()=>window.__st())),await p.evaluate(()=>document.getElementById('veh').textContent));await p.screenshot({path:'c_plane.png'});
await p.keyboard.down('KeyA');await p.waitForTimeout(3000);await p.keyboard.up('KeyA');await p.screenshot({path:'c_plane2.png'});
console.log('fly2',JSON.stringify(await p.evaluate(()=>window.__st())));
console.log('errs',[...new Set(errs)]);await b.close()})();
