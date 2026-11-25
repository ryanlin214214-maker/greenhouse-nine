const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:900,height:560}});q.on('pageerror',e=>console.log('ERR',e.message));
await q.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await q.goto('file://'+process.cwd()+'/gtest/x2.html',{timeout:90000});await q.waitForTimeout(8000);
console.log(JSON.stringify(await q.evaluate(()=>{const T=window.__T,rc=new T.Raycaster(),out=[];
 for(const p of[[0,1.7,-60],[0,1.7,165],[0,1.7,-225],[3,1.7,60]]){rc.set(new T.Vector3(...p),new T.Vector3(0,-1,0));const ms=[];window.__scene.traverse(o=>{if(o.isMesh&&!o.isInstancedMesh&&!o.isSkinnedMesh)ms.push(o)});const h=rc.intersectObjects(ms,false).slice(0,3);
  out.push(h.map(x=>{const m=x.object.material,c=m.map&&m.map.image&&m.map.image.getContext?Array.from(m.map.image.getContext('2d').getImageData(40,40,1,1).data):null;return{d:+x.distance.toFixed(2),col:m.color&&m.color.getHexString(),px:c,rep:m.map&&m.map.repeat.toArray(),met:m.metalness,type:m.type,op:m.opacity,recv:x.object.receiveShadow}}))}
 return out})));await b.close()})();
