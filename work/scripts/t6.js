const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];
async function run(cls,shot){const p=await b.newPage({viewport:{width:1100,height:720}});
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.goto('file:///home/user/greenhouse-nine/index.html');await p.waitForTimeout(1200);
await p.click('#classes button:nth-child('+(cls+1)+')');if(cls==0)await p.screenshot({path:'menu.png'});
await p.click('#go');await p.waitForTimeout(300);await p.mouse.down();
let dn=0,msgs=new Set();
for(let i=0;i<70;i++){await p.keyboard.down(i%2?'ArrowRight':'ArrowLeft');await p.waitForTimeout(300);await p.keyboard.up('ArrowRight');await p.keyboard.up('ArrowLeft');
 await p.keyboard.press(['KeyG','Space','KeyX','Space','KeyQ','KeyF'][i%6]);await p.waitForTimeout(120);await p.keyboard.press('Space');await p.waitForTimeout(150);
 dn+=await p.evaluate(()=>document.querySelectorAll('.dn').length);msgs.add(await p.evaluate(()=>document.getElementById('msg').textContent));
 if(i==shot)await p.screenshot({path:'play'+cls+'.png'});}
console.log(cls,await p.evaluate(()=>['wave','score','pwr','ovTitle'].map(i=>document.getElementById(i).textContent).join('|')),'dn',dn,[...msgs].join(' / '));await p.close()}
await run(0,14);await run(1,30);await run(2,30);
console.log('errs',errs);await b.close()})();
