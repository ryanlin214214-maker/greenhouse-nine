const {chromium}=require('playwright');const fs=require('fs');const w=+process.argv[2];
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:720}});
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/ReadPixels/.test(m.text()))errs.push(m.text())});
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/w'+w+'.html#god');await p.waitForTimeout(2000);
await p.selectOption('#setQ','low').catch(()=>{});
await p.click('#go');await p.mouse.down();const seen=new Set();
const obj=()=>p.evaluate(()=>document.getElementById('objT').textContent+' | '+document.getElementById('msg').textContent+' | stage '+document.getElementById('wave').textContent);
const n=w===3?30:10;
for(let i=0;i<n;i++){await p.keyboard.down('KeyW');await p.keyboard.down(i%3?'ArrowLeft':'ArrowRight');await p.waitForTimeout(600);await p.keyboard.up('ArrowLeft');await p.keyboard.up('ArrowRight');await p.keyboard.press('KeyG');await p.keyboard.press('KeyX');await p.waitForTimeout(250);
 seen.add(await obj());if(i===Math.floor(n/3))await p.screenshot({path:'m'+w+'.png'});}
console.log('w'+w,[...seen].slice(-6).join('\n   '));console.log('errs',[...new Set(errs)]);await b.close()})();
