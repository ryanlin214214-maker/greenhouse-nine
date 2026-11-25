const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:600,height:400}});q.setDefaultTimeout(600000);
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t105x.html',{timeout:240000});await q.waitForTimeout(5000);
await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(2000);
// a height map of the terrace top: rays straight down on a 6 m grid over r 560..868 for several sectors; anything above 112.6 is an obstacle
console.log(await q.evaluate(()=>window.__x(`const res=[];const rc=new T.Raycaster();rc.camera=cam;const tg=[HUB.mer.g];const dn=new T.Vector3(0,-1,0);
 for(const tc of[1.571,-1.571,0.785,-0.785,2.36,-2.36,3.14]){let free=0,blocked=0,minR=1e9,top=0;const B=[];
  for(let r=600;r<=860;r+=20)for(let a=-.25;a<=.25;a+=.025){const t=tc+a,x=HC.x+Math.sin(t)*r,z=HC.z-1100+Math.cos(t)*r;rc.set(new T.Vector3(x,400,z),dn);rc.far=400;const h=rc.intersectObjects(tg,true).filter(i=>i.object.isMesh)[0];const y=h?h.point.y:-1;
   if(y>112.6&&y<300){blocked++;B.push(r+'/'+a.toFixed(2)+'@'+y.toFixed(0))}else if(y>111&&y<=112.6)free++;else B.push(r+'/'+a.toFixed(2)+'~'+y.toFixed(0))}
  res.push('t '+tc+': free '+free+' blocked '+blocked+' sample '+B.slice(0,10).join(' '))}
 res.join('\\n')`)));
await b.close()})();
