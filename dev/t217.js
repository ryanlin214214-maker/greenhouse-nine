const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1000,height:640}});q.setDefaultTimeout(240000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(6000);
await q.evaluate(()=>window.__rowLook&&window.__rowLook());await q.waitForTimeout(800);
await q.evaluate(()=>window.__x("INTRO.on=false;setState('playing');showEnding()"));await q.waitForTimeout(1500);await q.screenshot({path:'K_l1.png'});
console.log('L1 card',await q.evaluate(()=>[document.getElementById('ovTitle').textContent,document.getElementById('retry').textContent,document.elementFromPoint(500,320).closest('#overlay')?'card on top':'covered by '+document.elementFromPoint(500,320).id]));
await q.evaluate(()=>document.getElementById('retry').click());
for(let k=0;k<6;k++){await q.waitForTimeout(2500);console.log(k,await q.evaluate(()=>window.__x("JSON.stringify({state,fly:!!FLY,stage:FLY&&FLY.stage,ph:FLY&&FLY.ph,fade:(document.getElementById('fadeL')||{style:{}}).style.opacity,cine:!document.getElementById('cine')||document.getElementById('cine').hidden,ov:overlay.hidden})")))}
await q.screenshot({path:'K_l2.png'});
console.log('errs',errs.slice(0,6));await b.close()})();
