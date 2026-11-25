const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:1250,height:780}});
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(4000);
await q.evaluate(()=>document.getElementById('cfg').click());
console.log(await q.evaluate(()=>{const o=document.getElementById('settings');const f=e=>{const c=getComputedStyle(e);return [e.tagName,e.className,c.position,c.top,c.display,c.flexShrink,c.width,c.gap,c.justifyContent].join(' ')};return [f(o),...[...o.children].filter(c=>c.tagName==='H3').map(f)].join('\n')}));
await b.close()})();
