const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
for(const [w,h] of [[1250,780],[420,800]]){const q=await b.newPage({viewport:{width:w,height:h}});q.on('pageerror',e=>console.log('ERR',e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(5000);
await q.evaluate(()=>document.getElementById('cfg').click());await q.waitForTimeout(500);
const r=await q.evaluate(()=>{const o=document.getElementById('settings'),cs=getComputedStyle(o);const ks=[...o.children].map(c=>{const r=c.getBoundingClientRect();return [c.tagName,Math.round(r.top),Math.round(r.height),c.scrollHeight]});return {disp:cs.display,fd:cs.flexDirection,h:o.clientHeight,sh:o.scrollHeight,ks:ks.slice(9,20)}});console.log(w,JSON.stringify(r));
await q.evaluate(()=>{const o=document.getElementById('settings');o.scrollTop=380});await q.waitForTimeout(300);
await q.screenshot({path:'set_'+w+'.png'});await q.close()}
await b.close()})();
