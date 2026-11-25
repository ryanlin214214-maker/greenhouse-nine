const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const R=async pg=>{pg.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));await pg.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await pg.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await pg.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})})};
const p=await b.newPage({viewport:{width:800,height:500}});await R(p);await p.goto('file://'+process.cwd()+'/gtest/n.html',{timeout:90000});await p.waitForTimeout(8000);await p.click('#go');await p.waitForTimeout(1000);
for(const[name,x,y,z]of[['level 4 bay',-20,15,30],['skybridge platform',0,20,0],['level 2',30,5,-25]]){await p.evaluate(()=>window.__upTest());await p.evaluate(a=>window.__setPin(...a),[x,y,z]);
  let last='';for(let i=0;i<5;i++)last=await p.evaluate(()=>window.__sim(12));console.log(name,'after 60 s:',last)}
await p.evaluate(()=>window.__stage2());for(let i=0;i<5;i++)console.log('stage2 t='+(i+1)*10,await p.evaluate(()=>window.__s2(10)));
await p.close();
const q=await b.newPage({viewport:{width:1100,height:680}});await R(q);await q.goto('file://'+process.cwd()+'/gtest/x.html',{timeout:90000});await q.waitForTimeout(9000);await q.screenshot({path:'b_menu.png'});
await q.evaluate(()=>{document.getElementById('overlay').hidden=true});
const v={floorup:[0,1.7,6,3,26,-9],l5sky:[0,21.7,5,250,1400,-760]};
for(const k in v){await q.evaluate(c=>{window.__camOv=c},v[k]);await q.waitForTimeout(2500);await q.screenshot({path:'b_'+k+'.png'})}
console.log('errs',errs);await b.close()})();
