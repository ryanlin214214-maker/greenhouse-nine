// Meridian cars stay where you park them: drive, get out, coast to a stop, leave and come back, reload the page
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:800,height:500}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
const load=async()=>{await q.goto('file://'+process.cwd()+'/gtest/t108x.html',{timeout:240000});await q.waitForTimeout(4000)};await load();
const X=c=>q.evaluate(c=>window.__x(c),c);const R=(id,ok,t)=>console.log((ok?'PASS ':'FAIL ')+id+' '+t);
const where=`JSON.stringify(MCARS.map(v=>[(v.pos.x-HC.x).toFixed(1),(v.pos.z-(HC.z-1100)).toFixed(1),v.g.visible]))`;
await X(`localStorage.removeItem('gh9-cars');INTRO.on=false;setState('playing');window.__freeze=true;enemies.length=0`);await q.evaluate(()=>window.__hub('enter'));
let r=JSON.parse(await X(`for(let i=0;i<3;i++){update(1/30);hubTick(1/30)}const v=MCARS[0];pos.set(v.pos.x,0,v.pos.z+3);for(let i=0;i<3;i++){update(1/30);hubTick(1/30)}HUB.near={k:'car',car:v};toggleVeh();const inCar=veh===v;veh.h=Math.PI/2;keys.KeyW=true;for(let i=0;i<60;i++){update(1/30);hubTick(1/30)}keys.KeyW=false;const sp=Math.abs(v.v).toFixed(1);toggleVeh();const out=[(v.pos.x-HC.x).toFixed(1),(v.pos.z-(HC.z-1100)).toFixed(1)];for(let i=0;i<150;i++){update(1/30);hubTick(1/30)}JSON.stringify([inCar,sp,out,(v.pos.x-HC.x).toFixed(1),(v.pos.z-(HC.z-1100)).toFixed(1),v.v,v.g.visible,localStorage.getItem('gh9-cars')])`));
R('get out at speed: the car coasts and stops on Meridian',r[0]&&Math.abs(+r[3]-+r[2][0])<40&&Math.abs(+r[4]-+r[2][1])<40&&r[5]===0&&r[6],'speed '+r[1]+' m/s; got out at '+r[2]+' stopped at '+r[3]+','+r[4]+' visible '+r[6]+' saved '+r[7]);
const parked=[r[3],r[4]];
r=JSON.parse(await X(`startAt(1,2);for(let i=0;i<5;i++)update(1/30);hubEnter();for(let i=0;i<5;i++){update(1/30);hubTick(1/30)}${where}`));R('still there after leaving Meridian and coming back',r[0][0]===parked[0]&&r[0][1]===parked[1],JSON.stringify(r[0])+' vs '+parked);
await load();await X(`INTRO.on=false;setState('playing');window.__freeze=true`);await q.evaluate(()=>window.__hub('enter'));
r=JSON.parse(await X(`for(let i=0;i<4;i++){update(1/30);hubTick(1/30)}${where}`));R('still there after reloading the page',Math.abs(+r[0][0]-+parked[0])<.2&&Math.abs(+r[0][1]-+parked[1])<.2,JSON.stringify(r[0])+' vs '+parked);
console.log('errs',errs);await b.close()})();
