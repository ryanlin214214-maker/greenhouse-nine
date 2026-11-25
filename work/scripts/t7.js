const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:720}});
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(m.text())});
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.goto('file:///home/user/greenhouse-nine/index.html');await p.waitForTimeout(2500);
await p.screenshot({path:'menu.png'});
await p.click('#go');await p.waitForTimeout(600);await p.screenshot({path:'play0.png'});await p.mouse.down();
for(let i=0;i<6;i++){await p.keyboard.down(i%2?'ArrowRight':'ArrowLeft');await p.waitForTimeout(300);await p.keyboard.up('ArrowRight');await p.keyboard.up('ArrowLeft');
 await p.keyboard.press(['KeyG','Space','KeyX','KeyF'][i%4]);await p.waitForTimeout(200);
 if(i==4)await p.screenshot({path:'play1.png'});}
console.log(await p.evaluate(()=>['wave','score','pwr','ovTitle'].map(i=>document.getElementById(i).textContent).join('|')));
console.log('errs',[...new Set(errs)]);await b.close()})();
