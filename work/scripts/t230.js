// Meridian cars: get in with E, drive with W/A/D/Space, hit walls and edges, drive through a hangar door, get out; pictures
const {chromium}=require('playwright');const fs=require('fs');
const P=(t,r,la=0)=>[Math.sin(t)*r+Math.cos(t)*la,Math.cos(t)*r-Math.sin(t)*la];
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1100,height:690}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+(process.argv[2]||'t108x.html'),{timeout:240000});await q.waitForTimeout(5000);
await q.evaluate(()=>window.__rowLook&&window.__rowLook());await q.waitForTimeout(500);
const X=c=>q.evaluate(c=>window.__x(c),c);
await X("INTRO.on=false;setState('playing');window.__freeze=true;enemies.length=0");await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(2500);
await q.addStyleTag({content:'#msg,#comm{display:none!important}'});
const out=[];const R=(id,ok,t)=>out.push((ok?'PASS ':'FAIL ')+id+' '+t);
await X(`window.__L=(lx,lz,yw)=>{pos.set(HC.x+lx,0,HC.z-1100+lz);vy=0;yaw=yw||0;pitch=0;for(let i=0;i<4;i++){update(1/30);hubTick(1/30)}};
 window.__drive=(n,f,s,brk)=>{keys.KeyW=f>0;keys.KeyS=f<0;keys.KeyD=s>0;keys.KeyA=s<0;keys.Space=!!brk;let vmax=0;for(let i=0;i<n;i++){update(1/30);hubTick(1/30);time+=1/30;vmax=Math.max(vmax,Math.abs(veh?veh.v:0))}keys.KeyW=keys.KeyS=keys.KeyD=keys.KeyA=keys.Space=false;return vmax};
 window.__cl=()=>{const p=veh?veh.pos:pos;return[(p.x-HC.x).toFixed(1),p.y.toFixed(2),(p.z-(HC.z-1100)).toFixed(1),(Math.hypot(p.x-HC.x,p.z-(HC.z-1100))).toFixed(1)].join(',')}`);
out.push('INFO cars '+await X("MCARS.length+' at '+MCARS.map(v=>[(v.pos.x-HC.x).toFixed(0),(v.pos.z-(HC.z-1100)).toFixed(0)].join(',')).join(' | ')"));
// walk up to the plaza car and press E
let r=JSON.parse(await X("__L(-30,958,0);keys.KeyW=true;for(let i=0;i<30;i++){update(1/30);hubTick(1/30);if(HUB.near&&HUB.near.k==='car')break}keys.KeyW=false;const pr=$('veh').textContent;hubUse();for(let i=0;i<3;i++){update(1/30);hubTick(1/30)}JSON.stringify([pr,!!veh,veh&&veh.meri,$('veh').textContent])"));
R("get in with E",r[1]&&r[2],'prompt before "'+r[0]+'", in car '+r[1]+', prompt now "'+r[3]+'"');
if(!r[1]){console.log(out.join('\n'));await b.close();return}
await q.waitForTimeout(2500);await q.screenshot({path:'car_1_in.png'});
// drive: accelerate, steer
r=JSON.parse(await X("const a=__cl();veh.h=Math.PI/2;yaw=veh.h;const vmax=__drive(90,1,0);const b=__cl();__drive(30,1,1);const c=__cl();JSON.stringify([a,vmax.toFixed(1),b,c])"));
R('drive and steer',+r[1]>15,'from '+r[0]+' top speed '+r[1]+' m/s to '+r[2]+', after steering '+r[3]);
await q.waitForTimeout(2500);await q.screenshot({path:'car_2_driving.png'});
// the rim: drive straight out at speed
r=JSON.parse(await X("const p=veh.pos;const t=1.2;p.set(HC.x+Math.sin(t)*1120,1.3,HC.z-1100+Math.cos(t)*1120);veh.h=Math.atan2(-Math.sin(t),-Math.cos(t));yaw=veh.h;veh.v=0;__drive(150,1,0);JSON.stringify(__cl().split(','))"));
R('stops at the rim',+r[3]<=1199.5,'ended r '+r[3]);
// the tower wall
r=JSON.parse(await X("const p=veh.pos;const t=1.2;p.set(HC.x+Math.sin(t)*920,1.3,HC.z-1100+Math.cos(t)*920);veh.h=Math.atan2(Math.sin(t),Math.cos(t));yaw=veh.h;veh.v=0;__drive(150,1,0);JSON.stringify(__cl().split(','))"));
R('stops at the tower wall',+r[3]>=864,'ended r '+r[3]);
// hangar 0 from outside (east side)
r=JSON.parse(await X("const p=veh.pos;p.set(HC.x+120,1.3,HC.z-1100+1140);veh.h=Math.PI/2;yaw=veh.h;veh.v=0;__drive(150,1,0);JSON.stringify(__cl().split(','))"));
R('hangar 0 wall solid from outside',+r[0]>=85,'ended x '+r[0]);
// through hangar H1's door and back
r=JSON.parse(await X("const p=veh.pos;const t=.4,s=P=>[Math.sin(t)*P,Math.cos(t)*P];const a=s(1030);p.set(HC.x+a[0],1.3,HC.z-1100+a[1]);veh.h=t+Math.PI;yaw=veh.h;veh.v=0;__drive(70,1,0);const c=__cl().split(',');JSON.stringify([c,hubZone()])"));
R('drive through the H1 door',r[1]==='hang1','ended '+r[0]+' zone '+r[1]);
await q.waitForTimeout(2500);await q.screenshot({path:'car_3_hangar.png'});
// out and back on foot
r=JSON.parse(await X("__drive(40,0,0,true);hubUse();const a=!!veh;const e=new KeyboardEvent('keydown',{code:'KeyE'});dispatchEvent(e);for(let i=0;i<4;i++){update(1/30);hubTick(1/30)}JSON.stringify([a,!!veh,pos.y.toFixed(2),$('veh').textContent])"));
R('get out with E',!r[1]&&Math.abs(+r[2])<.3,'still in car after hubUse '+r[0]+', in car after E '+r[1]+', feet y '+r[2]+', prompt "'+r[3]+'"');
// eye-level look at a parked car
await X("const v=MCARS[1];pos.set(v.pos.x+4,0,v.pos.z+5);yaw=Math.atan2(-(v.pos.x-pos.x),-(v.pos.z-pos.z));pitch=-.12;for(let i=0;i<4;i++){update(1/30);hubTick(1/30)}eye.set(pos.x,pos.y+EYE,pos.z)");await q.waitForTimeout(2500);await q.screenshot({path:'car_4_parked.png'});
await X("const v=MCARS[2];pos.set(v.pos.x-5,0,v.pos.z+3);yaw=Math.atan2(-(v.pos.x-pos.x),-(v.pos.z-pos.z));pitch=-.15;for(let i=0;i<4;i++){update(1/30);hubTick(1/30)}eye.set(pos.x,pos.y+EYE,pos.z)");await q.waitForTimeout(2500);await q.screenshot({path:'car_5_parked2.png'});
console.log(out.join('\n'));console.log('errs',errs.slice(0,5));await b.close()})();
