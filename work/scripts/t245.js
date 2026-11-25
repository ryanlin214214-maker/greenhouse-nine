const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:400,height:300}});q.setDefaultTimeout(900000);
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t107x.html',{timeout:240000});await q.waitForTimeout(4000);const X=c=>q.evaluate(c=>window.__x(c),c);
console.log(await X(`INTRO.on=false;startAt(4,2);for(let i=0;i<5;i++){update(1/30);cmdTick(1/30)}enemies.length=0;queue.length=0;const e=latSpawn(16,0,40);const f=mk(5,6,1.5,40);enemies.push(f);pos.set(0,0,15);for(let i=0;i<20;i++){update(1/30);time+=1/30}
 let err='';try{e.rig.anim(e,time,1/30)}catch(x){err=String(x)}const a=[e.mv,e.rig.segs.legs[0][0].rotation.x,f.mv,f.rig.segs.legs[0][0].rotation.x,err,e.g.children.length,e.g.children[0].type,e.g.children[0].children.length];JSON.stringify(a)`));
for(let i=0;i<4;i++){await q.waitForTimeout(700);console.log(await X(`const e=enemies.find(o=>o.lat);JSON.stringify([e.pos.z.toFixed(2),e.lat.seg.thL.rotation.x.toFixed(2),e.lat.seg.shR.rotation.x.toFixed(2),e.lat.seg.uaL.rotation.x.toFixed(2)])`))}
await b.close()})();
