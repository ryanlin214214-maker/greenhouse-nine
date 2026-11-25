// Meridian tour: matching poses round the ring, on the Sky Garden, from space. argv: page, prefix, [only names comma list]
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:900,height:560}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(5000);
const X=c=>q.evaluate(c=>window.__x(c),c);const P=process.argv[3]||'mer/b_';const only=process.argv[4]?process.argv[4].split(','):null;
await X("INTRO.on=false;setState('playing');window.__freeze=true;enemies.length=0");await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(2500);
await q.addStyleTag({content:'#msg,#comm,#hint,.htag{display:none!important}'});
// pose: [name, r, t, y, lookR, lookT, lookY]; local x=sin(t)*r, z=cos(t)*r
const H=Math.PI/2,poses=[
 ['sky_shot',792,H-.05,112,520,H+.28,150],['sky_wall',760,H+.02,112,505,H+.02,175],['sky_edge',800,H+.15,112,800,H+.45,118],['sky_out',790,H-.1,112,1150,H-.1,60],
 ['ring_t000',1000,0,0,864,0,60],['ring_t030',1000,.30,0,864,.30,60],['ring_t042',1000,.42,0,864,.42,60],['ring_tm042',1000,-.42,0,864,-.42,60],
 ['ring_t090',1000,H,0,864,H,60],['ring_t180',1000,Math.PI,0,864,Math.PI,60],['ring_tm090',1000,-H,0,864,-H,60],['ring_t240',1000,2.4,0,864,2.4,60],
 ['ring_along',900,1.0,0,900,1.25,8],['ring_up',940,2.0,0,850,2.0,260],
 ['h1',1100,.4,0,1180,.4,10],['h3',1100,1.55,0,1180,1.55,10],['h5',1100,2.85,0,1180,2.85,10],['h6',1100,-2.85,0,1180,-2.85,10],['h4',1100,-1.55,0,1180,-1.55,10],['h2',1100,-.4,0,1180,-.4,10],
 ['plat1',1210,.8,0,1450,.8,4],['plat3',1210,2.25,0,1450,2.25,4],['plat4',1210,-2.25,0,1450,-2.25,4],['plat2',1210,-.8,0,1450,-.8,4],
 ['hangar0',1095,0,0,1200,0,12],['concourse',1068,0,0,990,0,6],['obsdeck',1560,0,0,1640,0,2],['lift_base',892,H+.065,0,860,H+.065,60]];
for(const [n,r,t,y,lr,lt,ly] of poses){if(only&&!only.includes(n))continue;
 await X(`const x=HC.x+Math.sin(${t})*${r},z=HC.z-1100+Math.cos(${t})*${r},tx=HC.x+Math.sin(${lt})*${lr},tz=HC.z-1100+Math.cos(${lt})*${lr};pos.set(x,${y},z);vy=0;
  const dx=tx-x,dz=tz-z;yaw=Math.atan2(-dx,-dz);pitch=Math.atan2(${ly}-(${y}+EYE),Math.hypot(dx,dz));for(let i=0;i<4;i++){update(1/30);hubTick(1/30)}eye.set(pos.x,pos.y+EYE,pos.z);0`);
 await q.waitForTimeout(3200);await q.screenshot({path:P+n+'.png'});console.log('shot',n)}
if(!only||only.includes('transit')){const n=await X(`HUB.pts.filter(p=>p.k==='tr').length`);
 for(let k=0;k<n;k++){const r=await X(`const L=HUB.pts.filter(p=>p.k==='tr');meriTransit(L[(${k}+L.length-1)%L.length]);const a=pos.clone();for(let i=0;i<6;i++){update(1/30);hubTick(1/30)}const b=pos.clone();const q=pos.clone();meriPush(q,.45);
   const lx=pos.x-HC.x,lz=pos.z-HC.z+1100;JSON.stringify({stop:L[${k}].name,r:Math.hypot(lx,lz).toFixed(1),y:pos.y.toFixed(2),drift:a.distanceTo(b).toFixed(2),push:q.distanceTo(pos).toFixed(2)})`);
  console.log('transit',r);await q.waitForTimeout(2600);await q.screenshot({path:P+'tr'+k+'.png'})}}
if(!only||only.includes('space')){for(const[n,x,y,z]of[['space1',3200,900,2600],['space2',-2600,-500,1800],['space3',300,2600,300]]){
  await X(`SPEC.on=true;SPEC.pos.set(HC.x+${x},${y},HC.z-1100+${z});const d=new T.Vector3(HC.x,250,HC.z-1100).sub(SPEC.pos);yaw=Math.atan2(-d.x,-d.z);pitch=Math.atan2(d.y,Math.hypot(d.x,d.z));0`);
  await q.waitForTimeout(3500);await q.screenshot({path:P+n+'.png'});console.log('shot',n)}await X(`SPEC.on=false;0`)}
console.log('errs',errs.length,errs.slice(0,3));await b.close()})();
