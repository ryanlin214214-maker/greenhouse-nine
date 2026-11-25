const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1000,height:640}});q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await q.goto('file://'+process.cwd()+'/gtest/n.html',{timeout:120000});await q.waitForTimeout(8000);
const E=f=>q.evaluate(f);const hide=()=>q.evaluate(()=>{for(const id of['msg','comms','fhud','obj'])document.getElementById(id).hidden=true});
await E(()=>window.__fly(2));await E(()=>window.__fstep(.5));
for(const k of['h1','h2','h3','ace']){await q.evaluate(k=>window.__closeView(k),k);await hide();await q.waitForTimeout(400);await q.screenshot({path:'W_'+k+'.png',clip:{x:76,y:58,width:848,height:532}})}
console.log('back to station:',await E(()=>{window.__jump(1,1);return 'ok'}),await E(()=>JSON.stringify({w:typeof WORLDOBJ})));
console.log('errs',errs);await b.close()})();
