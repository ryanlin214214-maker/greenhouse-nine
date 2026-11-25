const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[],logs=[];const q=await b.newPage({viewport:{width:800,height:500}});q.setDefaultTimeout(600000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));q.on('console',m=>{if(m.type()==='error')logs.push(m.text().slice(0,300))});
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(4000);
const X=c=>q.evaluate(c=>window.__x(c),c);
await X(`window.__fc=0;(function c(){window.__fc++;requestAnimationFrame(c)})();0`);
await X(`INTRO.on=false;startAt(5,2);0`);
for(let i=0;i<4;i++){const a=await X(`__fc`);const t0=Date.now();await q.waitForTimeout(5000);const r=JSON.parse(await X(`JSON.stringify({fc:__fc,state,FLY:!!FLY,eur:EUW.on,last:typeof last!=='undefined'?Math.round(last):null,time:+time.toFixed(2)})`));console.log('rAF/s',((r.fc-a)/((Date.now()-t0)/1000)).toFixed(1),JSON.stringify(r));await q.screenshot({path:'eur/diag_'+i+'.png'})}
console.log('errs',errs,'console',logs.slice(0,8));await b.close()})();
