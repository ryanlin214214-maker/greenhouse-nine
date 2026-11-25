const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:900,height:560}});q.setDefaultTimeout(240000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/n93.html',{timeout:240000});await q.waitForTimeout(9000);
await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(4000);await q.addStyleTag({content:'#msg{display:none!important}'});
const go=(x,z,m)=>q.evaluate(([x,z,m])=>window.__hubWalk(x,z,m),[x,z,m]);
for(const w of[[-60,1100],[-72,1090],[-72,1112],[-60,1095],[72,1090],[72,1112],[0,1084]])console.log(await go(...w));
const Z=-3500;for(const[n,c]of[['left',[-50,1.7,1110,-72,4,1095]],['right',[50,1.7,1110,72,4,1095]]]){await q.evaluate(c=>{window.__camOv=c},[c[0],c[1],c[2]+Z,c[3],c[4],c[5]+Z]);await q.waitForTimeout(2500);await q.screenshot({path:'N_'+n+'.png',timeout:240000})}
console.log('errs',errs);await b.close()})();
