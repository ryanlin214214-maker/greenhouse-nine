const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:800,height:500}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(4000);
const X=c=>q.evaluate(c=>window.__x(c),c);
const prof=`(()=>{const gl=renderer.getContext(),px=new Uint8Array(4);const fin=()=>gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px);
 const tm=(f,n=3)=>{let t=performance.now();for(let i=0;i<n;i++)f();return +((performance.now()-t)/n).toFixed(1)};
 const r={update:tm(()=>update(1/30)),animate:tm(()=>animate(1/30)),dmgTick:tm(()=>dmgTick(1/30)),hud:tm(()=>{radar();hud()}),eurTick:tm(()=>eurTick(1/30)),light:tm(()=>lightTick(1/30)),
  wp:tm(()=>{try{wpDraw()}catch(e){}}),render:tm(()=>{renderer.render(scene,cam);fin()},2),composer:composer?tm(()=>{composer.render();fin()},2):null};
 return JSON.stringify(r)})()`;
await X(`INTRO.on=false;startAt(1,1);0`);await q.waitForTimeout(3000);console.log('thalassa',await X(prof));
await X(`startAt(5,2);0`);await q.waitForTimeout(3000);console.log('europa42',await X(prof));
console.log('errs',errs);await b.close()})();
