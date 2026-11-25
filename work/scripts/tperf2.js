// Meridian render cost at fixed poses: draw calls, triangles, shadow-map casters, ms per frame (software renderer).
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:800,height:500}});q.setDefaultTimeout(900000);
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(4000);
const X=c=>q.evaluate(c=>window.__x(c),c);
await X("INTRO.on=false;setState('playing');window.__freeze=true;enemies.length=0");await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(1500);
for(const[n,r,t,y,lr,lt,ly]of[['sky',792,Math.PI/2-.05,112,520,Math.PI/2+.28,150],['ring',1000,1.2,0,864,1.2,30],['hangar0',1095,0,0,1200,0,12]]){
 const o=await X(`const x=HC.x+Math.sin(${t})*${r},z=HC.z-1100+Math.cos(${t})*${r},tx=HC.x+Math.sin(${lt})*${lr},tz=HC.z-1100+Math.cos(${lt})*${lr};pos.set(x,${y},z);const dx=tx-x,dz=tz-z;yaw=Math.atan2(-dx,-dz);pitch=Math.atan2(${ly}-(${y}+EYE),Math.hypot(dx,dz));for(let i=0;i<3;i++){update(1/30);hubTick(1/30)}
  let sc=0,st=0;scene.traverse(m=>{if(m.isMesh&&m.castShadow&&m.visible){sc++;const g=m.geometry;st+=(g.index?g.index.count:g.attributes.position.count)/3*(m.isInstancedMesh?m.count:1)}});
  renderer.info.autoReset=false;renderer.info.reset();const t0=performance.now();composer?composer.render():renderer.render(scene,cam);const ms=performance.now()-t0;const R=renderer.info.render;
  JSON.stringify({calls:R.calls,tris:R.triangles,ms:Math.round(ms),shadowCasters:sc,shadowTris:Math.round(st),sm:renderer.shadowMap.enabled})`);console.log(n,o)}
await b.close()})();
