const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage();q.on('pageerror',e=>console.log('ERR',e.message,(e.stack||'').split('\n').slice(0,3).join(' | ')));q.on('console',m=>{if(m.type()!=='log')console.log(m.type(),m.text().slice(0,300))});
await q.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await q.goto('file://'+process.cwd()+'/gtest/'+(process.argv[2]||'n')+'.html',{timeout:90000});await q.waitForTimeout(9000);await b.close()})();
