const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:640,height:400}});q.setDefaultTimeout(600000);
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(5000);
await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(3000);
const X=c=>q.evaluate(c=>window.__x(c),c);
console.log(await X(`const H=Math.PI/2,x=HC.x+Math.sin(H+.02)*760,z=HC.z-1100+Math.cos(H+.02)*760;const p=new T.Vector3(x,112+EYE,z);const out=[];const bb=new T.Box3();
 scene.traverse(o=>{if(!(o.isMesh||o.isInstancedMesh)||!o.visible)return;if(o.isInstancedMesh)return;bb.setFromObject(o);if(bb.distanceToPoint(p)<6){let n=[],a=o;for(let i=0;i<5&&a;i++){n.push(a.name||a.type);a=a.parent}
 out.push([n.join('<'),o.geometry.type,bb.min.toArray().map(v=>+v.toFixed(1)).join('/'),bb.max.toArray().map(v=>+v.toFixed(1)).join('/'),o.material&&o.material.color?o.material.color.getHexString():''])}});
 JSON.stringify({p:p.toArray().map(v=>+v.toFixed(1)),n:out.length,list:out.slice(0,25)})`));
await b.close()})();
