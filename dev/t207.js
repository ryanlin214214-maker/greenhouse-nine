const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:900,height:560}});q.setDefaultTimeout(240000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/n95.html',{timeout:240000});await q.waitForTimeout(9000);await q.evaluate(()=>document.getElementById('go').click());await q.waitForTimeout(2000);await q.evaluate(()=>window.__rowLook());
const rc=async()=>{await q.evaluate(()=>{const st=document.getElementById('stage');st.dispatchEvent(new MouseEvent('mousedown',{button:2,bubbles:true}));window.dispatchEvent(new MouseEvent('mouseup',{button:2,bubbles:true}))});await q.waitForTimeout(300);return q.evaluate(()=>window.__ads())};
console.log('start',await q.evaluate(()=>window.__ads()));console.log('click 1',await rc());console.log('click 2',await rc());console.log('click 3',await rc());
console.log('errs',errs);await b.close()})();
