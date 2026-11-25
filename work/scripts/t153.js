const {chromium}=require('playwright');const fs=require('fs');const pre=process.argv[2],page=process.argv[3];
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:720}});p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/'+page+'.html');await p.waitForTimeout(15000);
await p.click('#go',{force:true,timeout:60000});await p.waitForTimeout(1500);await p.evaluate(()=>window.__ie());await p.waitForTimeout(800);await p.evaluate(()=>{window.__hold=()=>window.__pin()});
for(const k of[0,2,3,1,4,5]){await p.evaluate(()=>window.__ring());console.log(await p.evaluate(k=>window.__wp(k),k));await p.waitForTimeout(1600);
  await p.evaluate(()=>{for(const id of['hud','comms','cross','radar'])document.getElementById(id).hidden=true});await p.screenshot({path:pre+'_g'+k+'.png',clip:{x:550,y:300,width:520,height:380},timeout:120000})}
console.log('errs',errs);await b.close()})();
