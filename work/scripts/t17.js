const {chromium}=require('playwright');const fs=require('fs');const which=process.argv[2];
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:720}});
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/ReadPixels/.test(m.text()))errs.push(m.text())});
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/'+which+'.html');await p.waitForTimeout(7000);
await p.click('#go');await p.waitForTimeout(2500);
if(which==='n'){
 await p.evaluate(()=>{window.__tp(0,0,100,0,0.05);window.__show()});await p.waitForTimeout(2000);await p.screenshot({path:'g_ene1.png'});await p.waitForTimeout(700);await p.screenshot({path:'g_ene2.png'});
 await p.evaluate(()=>window.__tp(0,0,100,0,-0.15));await p.evaluate(()=>window.__fire(true));await p.waitForTimeout(900);await p.screenshot({path:'g_arc.png'});
 await p.evaluate(()=>{window.__fire(false);window.__w(1)});await p.waitForTimeout(800);await p.evaluate(()=>window.__fire(true));await p.waitForTimeout(250);await p.screenshot({path:'g_lance.png'});await p.evaluate(()=>window.__fire(false));
 await p.evaluate(()=>window.__w(0));await p.waitForTimeout(500);await p.screenshot({path:'g_arc_idle.png'});
}
if(which==='o'){await p.evaluate(()=>{window.__tp(0,0,140,0,0.05);window.__wave()});await p.waitForTimeout(2500);console.log(which,'enemies',await p.evaluate(()=>window.__n()),'calls',await p.evaluate(()=>window.__calls()));}
if(which==='b'){for(let i=0;i<6;i++){await p.waitForTimeout(2500);const s=await p.evaluate(()=>document.getElementById('objT').textContent);console.log(s);if(/HIVE/.test(s))break}
 console.log('boss',await p.evaluate(()=>window.__boss()));await p.waitForTimeout(600);await p.screenshot({path:'g_boss.png'});
 await p.waitForTimeout(800);await p.screenshot({path:'g_boss2.png'});}
console.log(which,'errs',[...new Set(errs)]);await b.close()})();
