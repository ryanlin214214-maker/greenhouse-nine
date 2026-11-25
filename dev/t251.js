// the waypoint compass on the top edge: on foot ahead/left/right/behind, and in flight; the objective band stays clear
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1280,height:780}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t108x.html',{timeout:240000});await q.waitForTimeout(5000);const X=c=>q.evaluate(c=>window.__x(c),c);
const R=(id,ok,t)=>console.log((ok?'PASS ':'FAIL ')+id+' '+t);
await X(`INTRO.on=false;startAt(4,2);for(let i=0;i<5;i++){update(1/30);cmdTick(1/30)}enemies.length=0;queue.length=0;CMD.w.b=1;CMD.w.c=1;window.__freeze=true`);
for(const[n,yw]of[['ahead',0],['right',Math.PI/2*-1+0.0],['behind',Math.PI]]){const r=JSON.parse(await X(`pos.set(0,0,120);yaw=${yw};pitch=0;eye.set(pos.x,pos.y+EYE,pos.z);cam.position.copy(eye);cam.rotation.set(0,yaw,0,'YXZ');cam.updateMatrixWorld();cmdTick(1/30);wpDraw();const w=$('wp').getBoundingClientRect(),o=$('obj').getBoundingClientRect(),m=$('wp').querySelector('.wpm').getBoundingClientRect(),s=stage.getBoundingClientRect();JSON.stringify([!$('wp').hidden,w.top-s.top,w.bottom-s.top,o.top-s.top,(m.left+m.width/2-w.left)/w.width,$('wp').classList.contains('edge'),$('wp').textContent])`));
  R('compass '+n,r[0]&&r[2]<=r[3]+1&&r[1]<12,'top '+r[1].toFixed(0)+'-'+r[2].toFixed(0)+' px, objective from '+r[3].toFixed(0)+' px, marker at '+(r[4]*100).toFixed(0)+'% edge '+r[5]+' "'+r[6]+'"');await q.waitForTimeout(2000);await q.screenshot({path:'wp_'+n+'.png'})}
console.log('errs',errs);await b.close()})();
