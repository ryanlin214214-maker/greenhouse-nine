const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:900,height:620}});q.setDefaultTimeout(180000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/n88.html',{timeout:180000});await q.waitForTimeout(9000);await q.evaluate(()=>document.getElementById('go').click());await q.waitForTimeout(1500);
await q.evaluate(()=>window.__rowLook());
const I=await q.evaluate(()=>window.__rwSide(-2.5,-1));const P=await q.evaluate(()=>window.__mt({at:[-8,1.05,2],ry:0}));console.log(P);
const [x,y,z,ry]=P,fx=Math.sin(ry),fz=Math.cos(ry);
await q.evaluate(c=>{window.__camOv=c},[x-4.4,y+.45,z+.6,x,y+.1,z]);
const shots=[['idle',{mv:0,see:true,aF:0,aS:0,vF:0,vS:0,duckT:0}],['run',{mv:1,see:true,aF:0,vF:5,vS:0}],['accel',{mv:1,see:true,aF:35,vF:3}],['stop',{mv:0,see:true,aF:-35,vF:0}],['strafe',{mv:1,see:true,aF:0,vF:0,vS:5}],['duck',{mv:0,see:true,aF:0,vS:0,duckT:5}]];
for(const [n,o] of shots){await q.evaluate(o=>window.__mt(o),o);await q.waitForTimeout(n==='stop'||n==='accel'?350:1500);await q.screenshot({path:'M_'+n+'.png',timeout:120000})}
console.log('errs',errs);await b.close()})();
