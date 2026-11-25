const {chromium}=require('playwright');const fs=require('fs');const pre=process.argv[2]||'K';
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1000,height:640}});q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await q.goto('file://'+process.cwd()+'/gtest/x.html',{timeout:90000});await q.waitForTimeout(8000);await q.click('#go');await q.waitForTimeout(800);
await q.evaluate(()=>{for(const id of['hud','comms','cross','radar','overlay','cine'])document.getElementById(id).hidden=true});
const shot=async(name,c)=>{await q.evaluate(()=>{for(const id of['hud','comms','cross','radar','overlay','cine'])document.getElementById(id).hidden=true});await q.evaluate(a=>{window.__camOv=a;window.__lt()},c);await q.waitForTimeout(1300);await q.screenshot({path:pre+'_'+name+'.png',clip:{x:76,y:58,width:848,height:532}})};
for(const k of['matriarch','colossus','widow']){const Y=k==='matriarch'?12:k==='colossus'?6:3.2;
  console.log(await q.evaluate(k=>window.__bk(k,0),k));await shot(k+'_a',[7,Y+(k==='widow'?2.5:1),195,0,Y*.85,185]);
  console.log(await q.evaluate(k=>window.__bk(k,1),k));await shot(k+'_b',[-6,Y+(k==='widow'?3:1.5),194,0,Y*.85,185]);
  console.log(await q.evaluate(()=>window.__bkill(75)));await shot(k+'_dead',[7,5,195,0,1,185])}
console.log('errs',errs);await b.close()})();
