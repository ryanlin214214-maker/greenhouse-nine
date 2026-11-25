// a staged hyperspace arrival, frame by frame
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:960,height:600}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t107x.html',{timeout:240000});await q.waitForTimeout(5000);const X=c=>q.evaluate(c=>window.__x(c),c);
await q.addStyleTag({content:'#comm,#comms,#msg,#fhud,#obj,#wp{display:none!important}'});
await X(`INTRO.on=false;startAt(4,1);for(let i=0;i<1600&&!(FLY.ph==='approach'&&!FC.on);i++)update(1/30);window.__freeze=true;FLY.spd=0;FLY.thr=0;
  const S=FLY,fw=new T.Vector3(-Math.sin(S.h),0,-Math.cos(S.h)),rt=new T.Vector3(Math.cos(S.h),0,-Math.sin(S.h));const p=S.pos.clone().addScaledVector(fw,2700).addScaledVector(rt,-1900).add(new T.Vector3(0,950,0)),n=rt.clone().addScaledVector(fw,-.2).normalize();
  const g=fleetShip(.16);scene.add(g);S.fleet.push({g,k:.16,n,sp:92});window.__pf=portalOpen(S,p,n,1100,g,{sp:92,v0:.16*52000});yaw=S.h;pitch=.02`);
for(let i=0;i<8;i++){await X(`for(let k=0;k<${i<3?6:9};k++){update(1/30);time+=1/30}`);await q.waitForTimeout(1600);await q.screenshot({path:'pf_'+i+'.png'})}
console.log('errs',errs);await b.close()})();
