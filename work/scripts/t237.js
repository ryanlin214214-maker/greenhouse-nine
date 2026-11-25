const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:600,height:400}});q.setDefaultTimeout(600000);const errs=[];q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t107x.html',{timeout:240000});await q.waitForTimeout(4000);const X=c=>q.evaluate(c=>window.__x(c),c);
console.log(await X(`INTRO.on=false;startAt(4,2);for(let i=0;i<10;i++){update(1/30);cmdTick(1/30)}JSON.stringify({cineT,fc:FC.on,spec:SPEC.on,hp,shield,state,mission:!!mission,dmgK:mission&&mission.C})`));
console.log(await X(`hurt(9999,pos);JSON.stringify({cineT,hp,shield,state})`));
console.log('errs',errs);await b.close()})();
