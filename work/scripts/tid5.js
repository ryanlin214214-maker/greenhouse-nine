const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:640,height:400}});q.setDefaultTimeout(300000);
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t104x.html',{timeout:240000});await q.waitForTimeout(5000);
console.log(await q.evaluate(()=>window.__x(`const rc=new T.Raycaster(new T.Vector3(0,4.5,-172),new T.Vector3(0,0,-1),0,30);rc.camera=cam;const h=rc.intersectObjects(scene.children,true).filter(i=>i.object.isMesh).slice(0,2);
 const L=[];for(const i of h){const o=i.object;const g=o.geometry;const pa=g.attributes.position;const fi=i.face;const vs=[fi.a,fi.b,fi.c].map(k=>new T.Vector3().fromBufferAttribute(pa,k).applyMatrix4(o.matrixWorld));
  // grow the hit face to its connected flat patch extent: report the triangle bbox and neighbours sharing the plane
  const bb=new T.Box3();for(let k=0;k<pa.count;k++){const v=new T.Vector3().fromBufferAttribute(pa,k).applyMatrix4(o.matrixWorld);if(Math.abs(v.z-i.point.z)<.05&&Math.abs(v.x)<12&&v.y>0&&v.y<14)bb.expandByPoint(v)}
  L.push(o.material.color.getHexString()+' hit '+i.point.toArray().map(v=>v.toFixed(2))+' plane-patch '+bb.min.toArray().map(v=>v.toFixed(1))+' / '+bb.max.toArray().map(v=>v.toFixed(1)))}
 L.join('\\n')+'\\nboxes at the hit: '+JSON.stringify(boxes.filter(b=>b.lo[2]<-185&&b.hi[2]>-187.5&&b.lo[0]<1&&b.hi[0]>-1).map(b=>[b.lo,b.hi]))`)));
await b.close()})();
