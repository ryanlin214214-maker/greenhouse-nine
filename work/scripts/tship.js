const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:480,height:300}});q.setDefaultTimeout(600000);
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+(process.argv[2]||'t104x.html'),{timeout:240000});await q.waitForTimeout(5000);
await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(2000);
console.log(await q.evaluate(()=>window.__x(`const out=[];for(const t of[.4,-.4,1.55,-1.55,2.85,-2.85]){const d=new T.Vector3(Math.sin(t),0,Math.cos(t));const hits=[];for(const y of[1.5,2.6]){const o=new T.Vector3(HC.x+Math.sin(t)*1088,y,HC.z-1100+Math.cos(t)*1088);const rc=new T.Raycaster(o,d,0,130);rc.camera=cam;const h=rc.intersectObjects([HUB.g],true).filter(i=>i.object.isMesh&&!i.object.material.transparent&&!i.object.isInstancedMesh)[0];hits.push(h?(1088+h.distance).toFixed(1)+'('+(h.object.material.color?h.object.material.color.getHexString():'')+')':'none')}out.push('t '+t+': first solid along the centre line at r '+hits.join(' / '))}out.join('\\n')`)));
await b.close()})();
