const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1000,height:640}});q.setDefaultTimeout(180000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+(process.argv[2]||'x70.html'),{timeout:180000});await q.waitForTimeout(9000);await q.click('#go',{force:true});await q.waitForTimeout(1500);
const hide=()=>q.evaluate(()=>{for(const id of['hud','comms','cross','radar','overlay','cine','msg'])document.getElementById(id).hidden=true});
const shot=async(n,c)=>{await q.evaluate(c=>{window.__camOv=c},c);await hide();await q.waitForTimeout(2500);await q.screenshot({path:'A_'+n+'.png',clip:{x:76,y:58,width:848,height:532}})};
const row=(z,list)=>list.map((o,i)=>Object.assign({x:24+i*3,y:.9,z,fx:30,fz:16},o));
console.log(await q.evaluate(c=>window.__poseT(c),row(8,[{set:{unf:.08}},{set:{unf:.35}},{set:{unf:.6}},{set:{unf:.85}},{set:{unf:1}}])));
await shot('unfold',[30,1.6,15,30,1,6]);
console.log(await q.evaluate(c=>window.__poseT(c),row(8,[{roll:.12},{roll:.22},{roll:.3},{roll:.4},{roll:.5}])));
await shot('roll',[30,1.6,15,30,1,6]);
console.log(await q.evaluate(c=>window.__poseT(c),row(8,[{set:{landT:.62}},{set:{landT:.3}},{set:{stag:.27,stagS:1}},{set:{cd:.1,see:true}},{type:7,set:{lunge:.2}}])));
await shot('moves',[30,1.6,15,30,1,6]);
console.log(await q.evaluate(c=>window.__poseT(c),row(8,[{set:{mv:1}},{set:{mv:1,ph:1.5}},{set:{mv:1,ph:3}},{type:7,set:{mv:1}},{type:6,set:{mv:1}}])));
await shot('run',[30,1.6,15,30,1,6]);
await q.evaluate(()=>{window.__camOv=null;window.__freeze=0;for(const e of enemies)e.dying=.001});
for(const [n,o] of [['fp_idle',{}],['fp_sprint',{spr:1}],['fp_draw',{draw:.3}],['fp_inspect',{insp:.9}],['fp_inspect2',{insp:1.35}],['fp_slide',{sl:1}]]){await q.evaluate(o=>{window.__fpo=o},o);await q.evaluate(()=>{for(const id of['hud','comms','radar','overlay','cine','msg'])document.getElementById(id).hidden=true});await q.waitForTimeout(1800);await q.screenshot({path:'A_'+n+'.png',clip:{x:76,y:58,width:848,height:532}})}
console.log('errs',errs);await b.close()})();
