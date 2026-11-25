const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:640,height:400}});q.setDefaultTimeout(240000);q.on('pageerror',e=>console.log('ERR',e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t102x.html',{timeout:240000});await q.waitForTimeout(5000);
await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(2000);
console.log(await q.evaluate(()=>window.__x(`const L=[];HUB.g.traverse(o=>{if(o.isInstancedMesh)L.push(o.geometry.type+':'+o.count+':'+(o.geometry.parameters?JSON.stringify(o.geometry.parameters).slice(0,40):'')+':vis'+o.visible+':'+(()=>{const m=new T.Matrix4();o.getMatrixAt(0,m);return m.elements.slice(12,15).map(v=>v.toFixed(0)).join(',')})())});L.join('\\n')`)));
await b.close()})();
