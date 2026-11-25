const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:600,height:400}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t107x.html',{timeout:240000});await q.waitForTimeout(4000);const X=c=>q.evaluate(c=>window.__x(c),c);
console.log(await X(`INTRO.on=false;startAt(4,2);for(let i=0;i<5;i++){update(1/30);cmdTick(1/30)}enemies.length=0;queue.length=0;CMD.w.b=1;CMD.w.c=1;const e=latSpawn(16,0,40);const f=mk(5,6,1.5,40);enemies.push(f);pos.set(0,0,10);
 const p0=e.pos.clone(),q0=f.pos.clone();for(let i=0;i<60;i++){update(1/30);cmdTick(1/30)}
 JSON.stringify({lat:[p0.toArray().map(v=>v.toFixed(1)),e.pos.toArray().map(v=>v.toFixed(1)),e.unf,e.dying,e.hp,e.st,e.mv,e.stag,e.roll,e.duckT,e.cd],rob:[q0.toArray().map(v=>v.toFixed(1)),f.pos.toArray().map(v=>v.toFixed(1)),f.unf],keys:Object.keys(e).join(',')})`));
console.log(await X(`const e=enemies[0];const h0=e.hp;damage(e,5,-1,false,true);const h1=e.hp;JSON.stringify([h0,h1,typeof firing,typeof fireCd,locked])`));
console.log(await X(`const e=enemies[0];pos.set(e.pos.x,0,e.pos.z+12);const c=new T.Vector3(e.pos.x,e.pos.y+e.hy,e.pos.z);yaw=Math.atan2(-(c.x-pos.x),-(c.z-pos.z));pitch=Math.atan2(c.y-(pos.y+EYE),12);eye.set(pos.x,pos.y+EYE,pos.z);cam.position.copy(eye);cam.rotation.set(pitch,yaw,0,'YXZ');cam.updateMatrixWorld();const h0=e.hp;fire();const h1=e.hp;firing=true;for(let i=0;i<30;i++){update(1/30)}firing=false;JSON.stringify([h0,h1,e.hp,fireCd,state])`));
console.log('errs',errs);await b.close()})();
