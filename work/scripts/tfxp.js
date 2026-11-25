const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:1280,height:800}});q.setDefaultTimeout(900000);
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t108x.html',{timeout:240000});await q.waitForTimeout(5000);
const X=c=>q.evaluate(c=>window.__x(c),c);
await X(`window.__st=(n,fn)=>{for(let i=0;i<n;i++){if(state!=='playing')break;update(1/30);time+=1/30;if(fn&&fn())break}}`);
await X(`INTRO.on=false;startAt(4,1);__st(1500,()=>FLY.ph==='approach'&&!FC.on);const p=FLY.dr.g.position;FLY.h=Math.atan2(p.x-FLY.pos.x,p.z-FLY.pos.z)+.35;yaw=FLY.h;pitch=-.05;FLY.p=0;FLY.spd=0;FLY.thr=0;__st(20);0`);
await q.waitForTimeout(1500);
console.log(await X(`cam.updateMatrixWorld();const out=[];const v=new T.Vector3();
 scene.traverse(o=>{if(!(o.isSprite||o.isPoints)||!o.visible)return;let vis=true;o.traverseAncestors(a=>{if(!a.visible)vis=false});if(!vis)return;
  o.getWorldPosition(v);const d=v.distanceTo(cam.position);v.project(cam);const on=Math.abs(v.x)<1&&Math.abs(v.y)<1&&v.z<1;
  const path=[];let a=o;while(a&&a!==scene){path.push(a.parent===FAR?'FAR['+FAR.children.indexOf(a)+']':(a.name||a.type));a=a.parent}
  out.push((o.isSprite?'S ':'P ')+(on?'ON ':'off ')+'d'+d.toFixed(0)+' sc'+o.scale.x.toFixed(0)+' col'+(o.material.color?o.material.color.getHexString():'shader')+' op'+(+o.material.opacity).toFixed(2)+' '+path.reverse().join('/')+(o.isPoints?' n'+o.geometry.attributes.position.count+' size'+o.material.size:''))});
 out.join('\\n')`));
console.log(await X(`FAR.children.map((g,i)=>i+':'+g.children.map(c=>c.type+(c.geometry&&c.geometry.type?'/'+c.geometry.type:'')+(c.scale?'*'+c.scale.x.toFixed(0):'')).join(',')).join('\\n')`));
await b.close()})();
