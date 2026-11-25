const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:640,height:400}});q.setDefaultTimeout(240000);q.on('pageerror',e=>console.log('ERR',e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t103x.html',{timeout:240000});await q.waitForTimeout(5000);
await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(2000);
console.log(await q.evaluate(()=>window.__x(`const L=[];const P=new T.Vector3();HUB.g.traverse(o=>{if(o.isMesh&&o.geometry.type==='PlaneGeometry'){o.getWorldPosition(P);const lx=P.x-HC.x,lz=P.z-(HC.z-1100);if(Math.abs(lx-Math.sin(.4)*1072.8)<15&&Math.abs(lz-Math.cos(.4)*1072.8)<15)L.push([lx.toFixed(1),P.y.toFixed(1),lz.toFixed(1),'ry',o.rotation.y.toFixed(2),'side',o.material.side,'w',o.geometry.parameters.width,'parent',o.parent===HUB.g?'G':o.parent.type,o.parent.rotation.y.toFixed(2)].join(' '))}});L.join('\\n')`)));
await b.close()})();
