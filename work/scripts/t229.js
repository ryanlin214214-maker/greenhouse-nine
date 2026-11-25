// every hangar and every platform, walked with game controls: in through the door, against the side wall, back out;
// out onto each platform and against its side edge
const {chromium}=require('playwright');const fs=require('fs');
const P=(t,r,la=0)=>[Math.sin(t)*r+Math.cos(t)*la,Math.cos(t)*r-Math.sin(t)*la].map(v=>+v.toFixed(1));
const HG=[.4,-.4,1.55,-1.55,2.85,-2.85],PL=[.8,-.8,2.25,-2.25];
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:480,height:300}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+(process.argv[2]||'t103x.html'),{timeout:240000});await q.waitForTimeout(5000);
await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(2500);
let fail=0;const go=async(lab,[x,z],block,m)=>{const r=await q.evaluate(([x,z,m])=>window.__hubWalk(x,z,m),[x,z,m||1500]);const mm=/at (-?[\d.]+),(-?[\d.]+)/.exec(r);const d=mm?Math.hypot(+mm[1]-x,+mm[2]-z):99;
  const ok=block?d>1.5:d<=1.5;if(!ok)fail++;console.log((ok?'PASS ':'FAIL ')+lab+(block?' (should block)':'')+' miss '+d.toFixed(1)+' zone '+await q.evaluate(()=>window.__x('hubZone()')))};
const tp=([x,z])=>q.evaluate(([x,z])=>window.__tp(x,0,z-3500,0,0),[x,z]);
for(let k=0;k<6;k++){const t=HG[k];await tp(P(t,1040));await go('H'+(k+1)+' in through the door',P(t,1104));await go('H'+(k+1)+' side wall',P(t,1150,100),true,500);
  await tp(P(t,1150,-40));await go('H'+(k+1)+' to the mouth edge',P(t,1240,-40),true,500);await tp(P(t,1104));await go('H'+(k+1)+' back out the door',P(t,1040))}
for(let k=0;k<4;k++){const t=PL[k];await tp(P(t,1150));await go('platform '+(k+1)+' out to the middle',P(t,1380));await go('platform '+(k+1)+' side edge',P(t,1380,60),true,500);await tp(P(t,1380));await go('platform '+(k+1)+' to the tip',P(t,1555));await go('platform '+(k+1)+' past the tip',P(t,1600),true,500)}
console.log(fail?'FAILED '+fail:'ALL PASS');console.log('errs',errs.slice(0,4));await b.close()})();
