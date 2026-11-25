const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:400,height:300}});q.setDefaultTimeout(600000);
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t106x.html',{timeout:240000});await q.waitForTimeout(4000);
await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(1500);
console.log(await q.evaluate(()=>window.__x(`const MS=[];const bb=new T.Box3(),sec=new T.Box3(new T.Vector3(HC.x+600,100,HC.z-1100-185),new T.Vector3(HC.x+870,420,HC.z-1100+185));
 HUB.mer.g.updateMatrixWorld(true);HUB.mer.g.traverse(o=>{if(o.isMesh){if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();bb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld);if(bb.intersectsBox(sec))MS.push(o)}});
 const rc=new T.Raycaster(),hit=(o,d,far)=>{rc.set(o,d);rc.far=far;return rc.intersectObjects(MS,false)[0]};const P=(t,r,y)=>new T.Vector3(HC.x+Math.sin(t)*r,y,HC.z-1100+Math.cos(t)*r);const out=[];
 // columns: radial rays at eye height from r 640 outward; a first hit well inside r 846 is a column (both ways: inward from 838 too)
 {let iv=[],cur=null;for(let a=-.24;a<=.24;a+=.002){const t=Math.PI/2+a,d=new T.Vector3(Math.sin(t),0,Math.cos(t)),h=hit(P(t,640,113.5),d,205);const r=h?Math.hypot(h.point.x-HC.x,h.point.z-HC.z+1100):999;const h2=hit(P(t,838,113.5),d.clone().negate(),200);const r2=h2?Math.hypot(h2.point.x-HC.x,h2.point.z-HC.z+1100):0;
   if(r<838){if(!cur)cur={a0:a,rn:r,rf:r2};cur.a1=a;cur.rn=Math.min(cur.rn,r);cur.rf=Math.max(cur.rf,r2)}else if(cur){iv.push('a '+cur.a0.toFixed(3)+'..'+cur.a1.toFixed(3)+' r '+cur.rn.toFixed(1)+'..'+cur.rf.toFixed(1));cur=null}}if(cur)iv.push('a '+cur.a0.toFixed(3)+'.. r '+cur.rn.toFixed(1));out.push('columns '+iv.join(' | '))}
 // inner side: radial rays inward from 700 to find the inner terrace wall
 {const L=[];for(const a of[-.2,-.1,0,.1,.2]){const t=Math.PI/2+a,h=hit(P(t,700,113.5),new T.Vector3(-Math.sin(t),0,-Math.cos(t)),200);L.push(a+':'+(h?Math.hypot(h.point.x-HC.x,h.point.z-HC.z+1100).toFixed(1):'none'))}out.push('inner wall '+L.join(' '))}
 // parapet profile: radial from 830 outward at several heights, and its top: down rays at r 840..864
 for(const y of[112.3,112.8,113.5,114.5,116,120]){const h=hit(P(Math.PI/2+.06,830,y),new T.Vector3(Math.sin(Math.PI/2+.06),0,Math.cos(Math.PI/2+.06)),60);out.push('y '+y+' first hit r '+(h?Math.hypot(h.point.x-HC.x,h.point.z-HC.z+1100).toFixed(1):'none'))}
 const dn=[];for(let r=838;r<=866;r+=1){const h=hit(P(Math.PI/2+.06,r,140),new T.Vector3(0,-1,0),60);dn.push(r+':'+(h?h.point.y.toFixed(1):'-'))}out.push('down '+dn.join(' '));
 out.join('\\n')`)));await b.close()})();
