const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1000,height:640}});q.setDefaultTimeout(240000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(6000);
const st=()=>q.evaluate(()=>{const g=id=>document.getElementById(id);const ov=g('overlay'),f=document.querySelector('.fade')||g('fade');const cs=e=>e?getComputedStyle(e):{};
  return JSON.stringify({state:window.__x('state'),ovHidden:ov.hidden,ovDisp:cs(ov).display,ovZ:cs(ov).zIndex,ovOp:cs(ov).opacity,title:(g('ovTitle')||{}).textContent,go:(g('go')||{}).textContent,goHidden:(g('go')||{}).hidden,fade:f&&[f.id,f.className,cs(f).opacity,cs(f).zIndex,cs(f).display],fc:window.__x('FC.on+" "+FC.k+" "+FC.ending')})});
console.log(await q.evaluate(()=>window.__fly(1)));await q.evaluate(()=>window.__fstep(.5));
await q.evaluate(()=>window.__end1());
for(let k=0;k<8;k++){await q.evaluate(()=>window.__fstep(1));console.log(k,await st())}
await q.waitForTimeout(1500);await q.screenshot({path:'K_end21.png'});console.log(await q.evaluate(()=>{const el=document.elementFromPoint(500,330);const L=[];for(let e=el;e;e=e.parentElement)L.push(e.tagName+'#'+e.id+'.'+e.className+' z'+getComputedStyle(e).zIndex+' op'+getComputedStyle(e).opacity);const f=document.getElementById('fadeL');return L.join(' < ')+' | fadeL '+(f?f.style.cssText:'none')+' | stack '+[...document.querySelectorAll('#stage > *')].filter(e=>!e.hidden&&getComputedStyle(e).display!=='none').map(e=>e.id+'/'+e.className+'/z'+getComputedStyle(e).zIndex).join(' ')}));
console.log('errs',errs.slice(0,6));await b.close()})();
