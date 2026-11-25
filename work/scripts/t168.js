const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1000,height:640}});q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await q.goto('file://'+process.cwd()+'/gtest/'+(process.argv[2]||'n')+'.html',{timeout:120000});await q.waitForTimeout(8000);await q.evaluate(()=>document.getElementById('go').click());await q.waitForTimeout(800);
const L=(c,a)=>q.evaluate(([c,a])=>window.__lc(c,a),[c,a]);
const hide=()=>q.evaluate(()=>{for(const id of['comms','msg'])document.getElementById(id).hidden=true});
console.log('stage 4 done:',await L('s4'));await L('step',2);console.log(' ',await L('info'));
await L('bridge');await L('step',1);console.log('on bridge:',await L('info'));await hide();await q.screenshot({path:'LC_core.png'});
// path A: shoot
await L('aim');await L('step',.2);console.log('A',await L('shoot',8));
for(let i=0;i<20&&JSON.parse(await L('info')).hp>0;i++){await L('shoot',8);await L('kill');await L('step',.3)}
console.log('A after shooting:',await L('info'));await hide();await q.screenshot({path:'LC_boom.png'});
for(let i=0;i<12;i++){await L('step',5);const s=JSON.parse(await L('info'));if(s.state!=='playing')break}
console.log('A end:',await L('info'));
// path B: unplug
console.log('B stage 4 done:',await L('s4'));await L('bridge');await L('step',1);
for(let k=0;k<4;k++){await L('cp',k);await L('step',1.5);await L('release');await L('kill');console.log(' after coupling',k,await L('info'))}
await L('step',1.5);await hide();await q.screenshot({path:'LC_dark.png'});
for(let i=0;i<12;i++){await L('step',5);const s=JSON.parse(await L('info'));if(s.state!=='playing')break}
console.log('B end:',await L('info'),await q.evaluate(()=>document.getElementById('ovText').textContent.slice(0,140)));
console.log('errs',errs);await b.close()})();
