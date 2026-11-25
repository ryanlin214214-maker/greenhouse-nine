const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:900,height:600}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t107x.html',{timeout:240000});await q.waitForTimeout(4000);const X=c=>q.evaluate(c=>window.__x(c),c);
await q.addStyleTag({content:'#comm,#comms,#msg,#hud,#obj,#wp,#radar{display:none!important}'});
await X(`INTRO.on=false;startAt(4,2);for(let i=0;i<5;i++){update(1/30);cmdTick(1/30)}enemies.length=0;queue.length=0;CMD.w.b=1;CMD.w.c=1;window.__freeze=true;
  window.__show=(type,x,z)=>{enemies.length=0;let e;if(type>=15)e=latSpawn(type,x,z);else{e=mk(type,x,1.5,z);enemies.push(e)}e.sh=0;if(e.shell){e.g.remove(e.shell);e.shell=null}e.unf=1;for(let i=0;i<40;i++){update(1/30);cmdTick(1/30)}e.spd=0;e.cd=99;return e}`);
const shots=[[13,0,30,4.5,0,1.3,'reaver'],[14,0,30,6,0,1.6,'maul'],[13,0,30,4,.8,1.2,'reaver34'],[14,0,30,5,.8,1.5,'maul34'],[15,0,30,13,0,3.3,'reformed'],[16,0,30,11,.6,2.9,'warden'],[17,0,30,11,-.6,2.9,'revenant']];
for(const[t,x,z,d,ang,h,n]of shots){await X(`const e=__show(${t},${x},${z});const a=${ang};pos.set(e.pos.x+Math.sin(a)*${d},0,e.pos.z+Math.cos(a)*${d});const bb=new T.Box3().setFromObject(e.g);const c=new T.Vector3(e.pos.x,bb.min.y+${h},e.pos.z);yaw=Math.atan2(-(c.x-pos.x),-(c.z-pos.z));e.g.rotation.y=Math.atan2(pos.x-e.pos.x,pos.z-e.pos.z);pitch=Math.atan2(c.y-EYE,${d});eye.set(pos.x,EYE,pos.z);for(let i=0;i<2;i++){update(1/30);cmdTick(1/30)}e.g.rotation.y=Math.atan2(pos.x-e.pos.x,pos.z-e.pos.z)`);await q.waitForTimeout(3500);await q.screenshot({path:'cr_'+n+'.png'})}
console.log('errs',errs);await b.close()})();
