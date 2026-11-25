const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:1250,height:780}});q.setDefaultTimeout(240000);
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t100x.html',{timeout:240000});await q.waitForTimeout(5000);
await q.evaluate(()=>window.__rowLook&&window.__rowLook());await q.waitForTimeout(500);
const X=c=>q.evaluate(c=>window.__x(c),c);
await X("INTRO.on=false;setState('playing');window.__freeze=true;enemies.length=0;pos.set(0,0,158);yaw=Math.PI;pitch=-.12;for(let i=0;i<8;i++)update(1/30);eye.set(pos.x,pos.y+EYE,pos.z)");
await q.waitForTimeout(2500);await q.screenshot({path:'fx/hangar_guides.png'});await b.close()})();
