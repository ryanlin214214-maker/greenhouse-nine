const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1100,height:700}});q.setDefaultTimeout(240000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/n93.html',{timeout:240000});await q.waitForTimeout(9000);await q.evaluate(()=>document.getElementById('go').click());await q.waitForTimeout(1500);
await q.evaluate(()=>window.__rowLook());
const C=[[0,{s:2,b:1,m:1,u:1}],[1,{s:3}],[2,{s:3,b:3,m:3,u:1}],[2,{s:4,b:4,m:1,u:3}],[3,{s:4,b:3,m:1,u:3}],[3,{s:0,b:2,m:2}],[4,{s:1}],[5,{s:1,m:1}],[6,{s:1,b:1,m:1,u:1}],[7,{s:5,b:3,m:1,u:3}],[7,{s:3,b:4}],[0,{}]];
let i=0;for(const[k,m]of C){await q.evaluate(([k,m])=>window.__gun(k,m),[k,m]);await q.evaluate(()=>window.__bench());await q.evaluate(()=>window.__benchSide(0));await q.waitForTimeout(1800);
  const el=await q.$('#gCv');await el.screenshot({path:'B_'+(i++)+'.png',timeout:240000});console.log(i-1,k,JSON.stringify(m))}
console.log('errs',errs.slice(0,4));await b.close()})();
