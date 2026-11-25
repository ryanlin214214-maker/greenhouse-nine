const {chromium}=require('playwright');const fs=require('fs');const w=process.argv[2];
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
b.on('disconnected',()=>console.log('BROWSER DISCONNECTED'));
const p=await b.newPage({viewport:{width:1100,height:720}});p.on('crash',()=>console.log('PAGE CRASH'));p.on('close',()=>console.log('PAGE CLOSE'));
p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{if(m.type()==='error'&&!/ReadPixels/.test(m.text()))console.log('CERR',m.text())});
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto(w==='real'?'file:///home/user/greenhouse-nine/index.html':'file://'+process.cwd()+'/gtest/w'+w+'.html#god');await p.waitForTimeout(2000);
await p.click('#go');const t0=Date.now();
for(let i=0;i<14;i++){await p.waitForTimeout(1000);
 console.log(((Date.now()-t0)/1000).toFixed(1),await p.evaluate(()=>document.getElementById('objT').textContent+' | '+document.getElementById('msg').textContent+' | heap '+Math.round(performance.memory.usedJSHeapSize/1e6)+'MB | nodes '+document.querySelectorAll('*').length).catch(e=>'evalfail '+e.message.slice(0,60)))}
await b.close()})();
