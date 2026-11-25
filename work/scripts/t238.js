// pictures only: 3-2 interior and 3-1 hull after the lighting fixes, 4-1 touchdown
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:960,height:600}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t107x.html',{timeout:240000});await q.waitForTimeout(5000);const X=c=>q.evaluate(c=>window.__x(c),c);
await q.addStyleTag({content:'#comm,#comms{display:none!important}'});const shot=async n=>{await q.waitForTimeout(3000);await q.screenshot({path:'l3b_'+n+'.png'})};
await X(`INTRO.on=false;window.__freeze=true;startAt(4,2);for(let i=0;i<10;i++){update(1/30);cmdTick(1/30)}enemies.length=0;queue.length=0`);
for(const[n,x,z,yw,p]of[['bay',0,240,0,.1],['bay2',-30,175,Math.PI*.75,.05],['barracks',-10,40,-.4,0],['run',-30,0,0,0],['conduits',20,-70,.3,0],['heart',-20,-185,.4,.15]]){await X(`pos.set(${x},0,${z});yaw=${yw};pitch=${p};enemies.length=0;queue.length=0;for(let i=0;i<4;i++){update(1/30);cmdTick(1/30)}eye.set(pos.x,pos.y+EYE,pos.z)`);await shot(n)}
await X(`startAt(4,3);for(let i=0;i<600&&FLY.ph!=='clear';i++)update(1/30);FLY.pos.set(4500,600,2500);FLY.spd=0;FLY.thr=0;const p=new T.Vector3();yaw=Math.atan2(FLY.pos.x,FLY.pos.z);pitch=-.1`);await shot('hull');
await X(`FLY.pos.set(2600,150,-200);yaw=Math.atan2(FLY.pos.x-1260,FLY.pos.z);pitch=-.05`);await shot('bay_ext');
await X(`startAt(5,1);for(let i=0;i<30;i++)update(1/30);FLY.pos.y=eurH(FLY.pos.x,FLY.pos.z)+30;FLY.V.set(0,-30,-120);for(let i=0;i<90&&FLY.ph==='fall';i++)update(1/30);for(let i=0;i<20;i++)update(1/30)`);await shot('touch');
console.log('errs',errs);await b.close()})();
