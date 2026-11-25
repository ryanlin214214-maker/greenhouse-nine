const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1000,height:640}});q.setDefaultTimeout(240000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/n91.html',{timeout:240000});await q.waitForTimeout(9000);await q.evaluate(()=>document.getElementById('go').click());await q.waitForTimeout(1500);
await q.evaluate(()=>window.__rowLook());await q.addStyleTag({content:'#msg,#comm,.comm{display:none!important}'});
const C=[[0,{}],[1,{}],[2,{}],[3,{}],[4,{}],[5,{}],[6,{}],[7,{}],[2,{s:3,b:3,m:3,u:1}],[2,{s:4,b:2,m:1,u:3}],[7,{s:5,b:4,m:1}],[3,{s:4,b:3,m:1,u:3}],[6,{s:1,b:1,m:1,u:1}],[4,{s:1,b:3,m:3}],[0,{s:2,b:1,m:1,u:1}],[1,{s:3}]];
let i=0;for(const[k,m]of C){const r=await q.evaluate(([k,m])=>window.__gun(k,m),[k,m]);await q.waitForTimeout(1600);await q.screenshot({path:'G_fp'+(i++)+'.png',timeout:240000});console.log(k,JSON.stringify(m),'->',r)}
for(const[k,m]of[[2,{s:3,b:3,m:3,u:1}],[7,{s:5,b:4,m:1}],[0,{}],[6,{s:1,b:1,m:1}]]){await q.evaluate(([k,m])=>window.__gun(k,m),[k,m]);console.log('bench',await q.evaluate(()=>window.__bench()));await q.waitForTimeout(2500);await q.screenshot({path:'G_b'+k+'.png',timeout:240000})}
console.log('errs',errs.slice(0,5));await b.close()})();
