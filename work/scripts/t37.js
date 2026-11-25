const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:720}});p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/n.html');await p.waitForTimeout(7000);await p.screenshot({path:'w_menu.png'});
await p.click('#go');await p.waitForTimeout(1500);await p.evaluate(()=>{window.__hold=()=>window.__pin()});
for(const k of[0,2,3,1,4,5]){await p.evaluate(()=>window.__ring());console.log(await p.evaluate(k=>window.__wp(k),k));
  await p.evaluate(()=>window.__fire(true));await p.waitForTimeout(1800);await p.screenshot({path:'w_gun'+k+'.png'});await p.evaluate(()=>window.__fire(false));
  console.log(' after fire  ',await p.evaluate(()=>window.__wst()));
  await p.keyboard.press('KeyR');await p.waitForTimeout(400);console.log(' reloading   ',await p.evaluate(()=>window.__wst()));if(k===2)await p.screenshot({path:'w_reload.png'});
  await p.keyboard.press('KeyG');await p.waitForTimeout(1500);console.log(' grenade     ',await p.evaluate(()=>window.__wst()));if(k===0)await p.screenshot({path:'w_fire.png'});
  await p.keyboard.press('KeyF');await p.waitForTimeout(250);if(k===0)await p.screenshot({path:'w_sword.png'});await p.waitForTimeout(900);console.log(' melee       ',await p.evaluate(()=>window.__wst()))}
console.log('errs',errs);await b.close()})();
