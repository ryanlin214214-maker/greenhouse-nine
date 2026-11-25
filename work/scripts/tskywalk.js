const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:900,height:560}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(5000);
await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(3000);
const X=c=>q.evaluate(c=>window.__x(c),c);
const at=(r,t)=>`HC.x+Math.sin(${t})*${r},HC.z-1100+Math.cos(${t})*${r}`;
// stand on the terrace at r 800 on the same bearing, then walk inward toward r 760 (the tour spot) and on
for(const [r0,t0,r1,t1,lab] of [[800,Math.PI/2+.02,700,Math.PI/2+.02,'inward along the tour bearing'],[760,Math.PI/2-.08,760,Math.PI/2+.10,'sideways through the tour spot']]){
 const res=JSON.parse(await X(`const [x0,z0]=[${at(r0,t0)}],[x1,z1]=[${at(r1,t1)}];pos.set(x0,112,z0);vy=0;for(let i=0;i<10;i++){update(1/30);hubTick(1/30)}
  const yw=Math.atan2(-(x1-x0),-(z1-z0));let minD=1e9,pts=[];keys.KeyW=true;for(let i=0;i<300;i++){yaw=yw;pitch=0;update(1/30);hubTick(1/30);const lx=pos.x-HC.x,lz=pos.z-(HC.z-1100);const r=Math.hypot(lx,lz),a=Math.atan2(lx,lz);
   const tx=HC.x+Math.sin(Math.PI/2+.02)*760-pos.x,tz=HC.z-1100+Math.cos(Math.PI/2+.02)*760-pos.z;minD=Math.min(minD,Math.hypot(tx,tz));if(i%60==0)pts.push([r.toFixed(1),a.toFixed(3),pos.y.toFixed(2)])}keys.KeyW=false;
  JSON.stringify({minDistToTourSpot:+minD.toFixed(2),path:pts,end:[Math.hypot(pos.x-HC.x,pos.z-(HC.z-1100)).toFixed(1),pos.y.toFixed(2)]})`));
 console.log(lab,JSON.stringify(res));
}
// look at the spot from 4 m away, like a player standing near it
await X(`const t=Math.PI/2+.02,x=HC.x+Math.sin(t)*764,z=HC.z-1100+Math.cos(t)*764,tx=HC.x+Math.sin(t)*756,tz=HC.z-1100+Math.cos(t)*756;pos.set(x,112,z);vy=0;yaw=Math.atan2(-(tx-x),-(tz-z));pitch=-.15;for(let i=0;i<6;i++){update(1/30);hubTick(1/30)}eye.set(pos.x,pos.y+EYE,pos.z);0`);
await q.waitForTimeout(4000);await q.screenshot({path:'mer/sky_props_near.png'});
console.log('errs',errs);await b.close()})();
