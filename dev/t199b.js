// Meridian walk test with pass/fail: every leg must end within 1.5 m of its target unless it is marked as one that should be blocked
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:640,height:400}});q.setDefaultTimeout(240000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+(process.argv[2]||'n93.html'),{timeout:240000});await q.waitForTimeout(8000);
await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(3000);
let fail=0;const go=async(x,z,block,m)=>{const r=await q.evaluate(([x,z,m])=>window.__hubWalk(x,z,m),[x,z,m||1800]);const mm=/at (-?[\d.]+),(-?[\d.]+)/.exec(r);const d=mm?Math.hypot(+mm[1]-x,+mm[2]-z):99;
  const ok=block?d>1.5:d<=1.5;if(!ok)fail++;console.log((ok?'PASS ':'FAIL ')+(block?'(should block) ':'')+r+' miss '+d.toFixed(1))};
const tp=(x,z)=>q.evaluate(([x,z])=>window.__tp(x,0,z-3500,0,0),[x,z]);
for(const w of[[-15,1095],[0,1084],[0,1070],[4,1060],[4,1030],[-13,1028],[-19,1024]])await go(...w);
for(const w of[[4,1030],[13,1028],[19,1024]])await go(...w);
for(const w of[[4,1040],[4,1070],[0,1086],[22,1102]])await go(...w);
await go(-34.5,1103); // the board point beside your parked ship (the ship itself is solid since v93)
for(const w of[[0,1084],[0,1070],[4,1060],[4,990],[14,965]])await go(...w);await go(14,840,true,700);
await tp(0,1150);await go(0,1300);await go(0,1500);await go(0,1650,true,600);
console.log(fail?'FAILED '+fail:'ALL PASS');console.log('errs',errs);await b.close()})();
