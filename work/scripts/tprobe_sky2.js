const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:640,height:400}});q.setDefaultTimeout(600000);
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(5000);
await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(3000);
const X=c=>q.evaluate(c=>window.__x(c),c);
console.log(await X(`const H=Math.PI/2,t=H+.02,x=HC.x+Math.sin(t)*760,z=HC.z-1100+Math.cos(t)*760,tx=HC.x+Math.sin(t)*505,tz=HC.z-1100+Math.cos(t)*505;
 const p=new T.Vector3(x,112+EYE,z),d=new T.Vector3(tx-x,175-(112+EYE),tz-z).normalize();const rc=new T.Raycaster(p,d,0,60);rc.camera=cam;const hits=rc.intersectObjects(scene.children,true).filter(h=>h.object.visible).slice(0,6);
 JSON.stringify(hits.map(h=>{let n=[],a=h.object;for(let i=0;i<7&&a;i++){n.push((a.name||a.type)+(a.userData&&Object.keys(a.userData).length?'{'+Object.keys(a.userData).slice(0,4).join(',')+'}':''));a=a.parent}
   const w=new T.Vector3();h.object.getWorldPosition(w);return {dist:+h.distance.toFixed(1),chain:n.join(' < '),geo:h.object.geometry.type,col:h.object.material&&h.object.material.color?h.object.material.color.getHexString():'',objPos:w.toArray().map(v=>+v.toFixed(1)),inst:h.instanceId}}))`));
await b.close()})();
