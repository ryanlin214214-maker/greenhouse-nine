const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1000,height:640}});q.setDefaultTimeout(240000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/n91.html',{timeout:240000});await q.waitForTimeout(9000);await q.evaluate(()=>document.getElementById('go').click());await q.waitForTimeout(1500);
await q.evaluate(()=>window.__rowLook());await q.addStyleTag({content:'#msg,#comm,.comm{display:none!important}'});
const C=[[1,{}],[1,{s:3}],[2,{s:3,b:3,m:3,u:1}],[6,{}]];
let i=0;for(const[k,m]of C){const r=await q.evaluate(([k,m])=>window.__gun(k,m),[k,m]);await q.waitForTimeout(1600);await q.screenshot({path:'H_fp'+(i++)+'.png',timeout:240000});console.log(k,JSON.stringify(m),'->',r)}
for(const[k,m]of[[2,{s:3,b:3,m:3,u:1}],[1,{}]]){await q.evaluate(([k,m])=>window.__gun(k,m),[k,m]);console.log('bench',await q.evaluate(()=>window.__bench()));await q.waitForTimeout(2500);await q.screenshot({path:'H_b'+k+'.png',timeout:240000})}
console.log('errs',errs.slice(0,5));await b.close()})();
