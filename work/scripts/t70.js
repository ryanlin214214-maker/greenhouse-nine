const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:680}});p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/n.html',{timeout:90000});await p.waitForTimeout(8000);await p.evaluate(()=>window.__vset({on:false}));await p.evaluate(()=>document.getElementById('go').click());await p.waitForTimeout(1500);
console.log('after start:',await p.evaluate(()=>window.__ist()));
let t=0;const ds=[7,7,7,7,6,4];for(let i=0;i<6;i++){console.log(await p.evaluate(a=>window.__introAt(a),t+ds[i]*.55));await p.waitForTimeout(3500);await p.screenshot({path:'i_'+i+'.png'});t+=ds[i]}
console.log('paused mid-intro:',await p.evaluate(()=>window.__pz()));console.log('resumed:',await p.evaluate(()=>window.__rs()));
await p.keyboard.press('Space');await p.waitForTimeout(1500);console.log('after Space:',await p.evaluate(()=>window.__ist()));
console.log(await p.evaluate(()=>window.__camp()));
console.log('after ending resume:',await p.evaluate(()=>{window.__step(6);return window.__ist()}));
console.log('continue:',await p.evaluate(()=>window.__cont()));console.log('die then new game:',await p.evaluate(()=>window.__dieNew()));
console.log('old save:',await p.evaluate(()=>window.__vs()));
console.log('errs',errs);await b.close()})();
