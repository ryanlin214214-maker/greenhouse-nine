const {chromium}=require('playwright');const fs=require('fs');const P=Math.PI;
const Q=[['hangar_mouth',0,180,P,[[0,.15],[-.4,.12],[.4,.12],[-.75,.1]]],['eng_oval',88,96,-P/2,[[-.1,.32],[0,.3]]],['bridge_mono',0,-172,0,[[0,.25],[0,.15]]]];
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:900,height:560}});q.setDefaultTimeout(240000);q.on('pageerror',e=>console.log('ERR',e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t104x.html',{timeout:240000});await q.waitForTimeout(5000);
await q.evaluate(()=>window.__rowLook&&window.__rowLook());await q.waitForTimeout(500);
await q.evaluate(()=>window.__x(`INTRO.on=false;setState('playing');window.__freeze=true;enemies.length=0;for(let i=0;i<5;i++)update(1/30)`));
for(const[n,x,z,yw,pts]of Q){if(n==='helmet'){await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(2000)}
 const r=await q.evaluate(([x,z,yw,pts,h])=>window.__x(`pos.set(${x},0,${z+(h?-3500:0)});vy=0;yaw=${yw};pitch=-.03;for(let i=0;i<8;i++)update(1/30);eye.set(pos.x,pos.y+EYE,pos.z);cam.position.copy(eye);cam.rotation.set(pitch,yaw,0,'YXZ');cam.updateMatrixWorld();
  const rc=new T.Raycaster();rc.camera=cam;const out=[];for(const p of ${JSON.stringify(pts)}){rc.setFromCamera(new T.Vector2(p[0],p[1]),cam);const h=rc.intersectObjects(scene.children,true).filter(i=>i.object.visible).slice(0,3);
   out.push(p.join(',')+': '+h.map(i=>{const o=i.object,m=o.material||{};let pth=[];for(let u=o;u&&pth.length<3;u=u.parent)pth.push(u.name||u.type);return o.type+'/'+(m.type||'')+'/c'+(m.color?m.color.getHexString():'')+'/em'+(m.emissive?m.emissive.getHexString():'')+'/d'+i.distance.toFixed(1)+'/p'+i.point.toArray().map(v=>v.toFixed(1)).join(':')+'/'+pth.join('<')+(m.map?'/map':'')+(m.transparent?'/tr'+m.opacity:'')}).join(' | '))}
  out.join('\\n')`),[x,z,yw,pts,n==='helmet']);console.log('== '+n+'\n'+r)}
await b.close()})();
