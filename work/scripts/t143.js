const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:1100,height:680}});p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/x.html',{timeout:120000});await p.waitForTimeout(8000);await p.evaluate(()=>window.__vset({on:false}));
await p.evaluate(()=>window.__jump(1,3));await p.evaluate(()=>{for(const id of['hud','comms','cross','radar','msg','obj'])document.getElementById(id).hidden=true;window.__vset&&0;document.getElementById('msg').style.display='none'});
console.log(await p.evaluate(()=>window.__showShip()));console.log(await p.evaluate(()=>window.__showEnemies()));
const V={rear:[0,5.5,197,0,2.6,185],rearL:[-7,4.2,195,0,2.6,185],int1:[-14,8,212,-22,6,205],int2:[-30,9,198,-22,6,205],gun1:[12,14,228,28,11,215],gun2:[40,16,200,28,11,215]};
for(const k in V){await p.evaluate(c=>{window.__camOv=c},V[k]);await p.waitForTimeout(2200);await p.screenshot({path:'s_'+k+'.png'})}

console.log('errs',errs);await b.close()})();
