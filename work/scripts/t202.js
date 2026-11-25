const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:900,height:560}});q.setDefaultTimeout(240000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/n92.html',{timeout:240000});await q.waitForTimeout(9000);
await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(5000);await q.addStyleTag({content:'#msg{display:none!important}'});
const Z=-3500;const S=async(n,c,w)=>{await q.evaluate(c=>{window.__camOv=c},[c[0],c[1],c[2]+Z,c[3],c[4],c[5]+Z]);await q.waitForTimeout(w||2500);await q.screenshot({path:'K_'+n+'.png',timeout:240000})};
await q.evaluate(()=>0);await S('backwall',[-20,3,1150,0,12,1082]);await S('stairs',[-55,3,1100,-71,6,1096]);await S('mouth',[-50,1.7,1195,-60,1.2,1215]);
await S('deck',[0,3,1548,0,1,1600]);await S('blade',[0,1.7,1600,-30,30,1640]);await S('plaza',[0,1.7,985,0,4,940]);await S('arches',[0,2,1074,0,18,1000]);
await q.evaluate(()=>{window.__camOv=null});
console.log('launch',await q.evaluate(()=>window.__launch()));
for(const n of[30,30,45,45,60]){console.log('step',await q.evaluate(n=>window.__mstep(n),n))}
await q.screenshot({path:'K_takeoff2.png',timeout:240000});
for(let i=0;i<4;i++){const s=JSON.parse(await q.evaluate(()=>window.__mstep(30)));console.log('step',JSON.stringify(s));if(s.ph==='free')break}
await q.screenshot({path:'K_free.png',timeout:240000});
await q.evaluate(()=>window.__fset(0,0,20,-2400+80,40));
for(let i=0;i<12;i++){const s=JSON.parse(await q.evaluate(()=>window.__mstep(30)));console.log('land',JSON.stringify(s));if(i===1)await q.screenshot({path:'K_landing.png',timeout:240000});if(s.hub)break}
await q.waitForTimeout(2500);await q.screenshot({path:'K_back.png',timeout:240000});
console.log('errs',errs.slice(0,5));await b.close()})();
