const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:900,height:560}});q.setDefaultTimeout(240000);q.on('pageerror',e=>console.log('ERR',e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t99x.html',{timeout:240000});await q.waitForTimeout(5000);
await q.evaluate(()=>window.__rowLook&&window.__rowLook());await q.waitForTimeout(500);
await q.evaluate(()=>window.__x(`INTRO.on=false;setState('playing');window.__freeze=true;enemies.length=0;pos.set(0,0,100);yaw=Math.PI;pitch=-.25;for(let i=0;i<10;i++)update(1/30)`));
await q.addStyleTag({content:'#hud,#obj{display:none!important}'});
await q.waitForTimeout(2500);await q.screenshot({path:'FL0.png'});
// what is the floor? list materials of meshes whose bbox top is near y=0 under us
console.log(await q.evaluate(()=>window.__x(`const L=[];scene.traverse(o=>{if(!o.isMesh||!o.visible)return;if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();const bb=o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);if(bb.min.x<0&&bb.max.x>0&&bb.min.z<104&&bb.max.z>104&&bb.max.y>-.2&&bb.max.y<.3)L.push([o.name||o.type,o.material.type,o.material.color&&o.material.color.getHexString(),+(o.material.metalness||0).toFixed(2),+(o.material.roughness||0).toFixed(2),bb.max.y.toFixed(2),(bb.max.x-bb.min.x).toFixed(0),o.material.map?o.material.map.image&&o.material.map.image.width:0,o.renderOrder,o.material.transparent,o.material.opacity])});JSON.stringify(L)`)));
await q.evaluate(()=>window.__x(`scene.traverse(o=>{if(!o.isMesh||!o.visible)return;const bb=o.geometry.boundingBox?o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld):null;if(bb&&bb.max.y>-.2&&bb.max.y<.3&&(bb.max.x-bb.min.x)>8&&o.material.isMeshStandardMaterial){o.material.metalness=0;o.material.metalnessMap=null;o.material.needsUpdate=true}})`));
await q.waitForTimeout(2500);await q.screenshot({path:'FL1.png'});
await b.close()})();
