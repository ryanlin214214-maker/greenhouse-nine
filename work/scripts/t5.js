const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const p=await b.newPage({viewport:{width:1100,height:720}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.goto('file:///home/user/greenhouse-nine/index.html');await p.waitForTimeout(1500);
await p.screenshot({path:'menu.png'});
await p.click('#go');await p.waitForTimeout(300);
await p.mouse.down();
for(let i=0;i<40;i++){await p.keyboard.down(i%2?'ArrowRight':'ArrowLeft');await p.keyboard.down('KeyW');await p.waitForTimeout(350);await p.keyboard.up('ArrowRight');await p.keyboard.up('ArrowLeft');
 await p.keyboard.press(['KeyG','KeyF','KeyX','Space'][i%4]);await p.waitForTimeout(250);
 if(i==1)await p.screenshot({path:'play.png'});if(i==6)await p.screenshot({path:'play2.png'});}
console.log(await p.evaluate(()=>[document.getElementById('wave').textContent,document.getElementById('score').textContent,document.getElementById('ovTitle').textContent,document.getElementById('overlay').hidden].join('|')));
console.log('errs',errs);await b.close()})();
