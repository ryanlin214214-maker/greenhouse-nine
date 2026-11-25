const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];
async function open(url){const p=await b.newPage({viewport:{width:1100,height:720}});
 p.on('pageerror',e=>errs.push(url.slice(-12)+': '+e.message));p.on('console',m=>{if(m.type()==='error'&&!/ReadPixels/.test(m.text()))errs.push(url.slice(-12)+': '+m.text())});
 await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
 await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
 await p.goto(url);await p.waitForTimeout(2500);return p}
const obj=p=>p.evaluate(()=>document.getElementById('objT').textContent+' | '+document.getElementById('msg').textContent+' | stage '+document.getElementById('wave').textContent+' | '+document.getElementById('ovTitle').textContent);
// real file: settings + stage 1
let p=await open('file:///home/user/greenhouse-nine/index.html');
await p.click('#cfg');await p.selectOption('#setQ','med');await p.screenshot({path:'settings.png'});await p.click('#setClose');
await p.click('#go');await p.waitForTimeout(6000);console.log('real:',await obj(p));await p.close();
for(const w of [1,2,3]){p=await open('file://'+process.cwd()+'/gtest/w'+w+'.html#god');await p.click('#go');await p.mouse.down();
 const dur=w===3?26:9;for(let i=0;i<dur;i++){await p.keyboard.down('KeyW');await p.keyboard.down(i%3?'ArrowLeft':'ArrowRight');await p.waitForTimeout(700);await p.keyboard.up('ArrowLeft');await p.keyboard.up('ArrowRight');await p.keyboard.press('KeyG');await p.keyboard.press('KeyX');await p.waitForTimeout(300);
  if(w===3&&i===8)await p.screenshot({path:'boss.png'});}
 console.log('w'+w+':',await obj(p));await p.screenshot({path:'m'+w+'.png'});await p.close()}
console.log('errs',[...new Set(errs)]);await b.close()})();
