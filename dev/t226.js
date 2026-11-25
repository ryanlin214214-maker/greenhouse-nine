// Meridian reproduction checks (run on the live build and on fixes). Each check prints PASS/FAIL with what it saw.
// Movement uses the game's own controls (keys.KeyW, jumpQ) and update(); hubTick runs every step so prompts and zones are live.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:800,height:500}});q.setDefaultTimeout(600000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+(process.argv[2]||'v86x.html'),{timeout:240000});await q.waitForTimeout(5000);
await q.evaluate(()=>window.__rowLook&&window.__rowLook());await q.waitForTimeout(500);
const X=c=>q.evaluate(c=>window.__x(c),c);
await X("INTRO.on=false;setState('playing');window.__freeze=true;enemies.length=0");await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(2500);
await X(`window.__L=(lx,lz,yw)=>{pos.set(HC.x+lx,0,HC.z-1100+lz);vy=0;yaw=yw||0;pitch=0;for(let i=0;i<5;i++){update(1/30);hubTick(1/30)}};
 window.__run=(n,jump)=>{let ymax=0;keys.KeyW=true;for(let i=0;i<n;i++){if(jump&&i%9===0)jumpQ=true;update(1/30);hubTick(1/30);time+=1/30;ymax=Math.max(ymax,pos.y)}keys.KeyW=false;for(let i=0;i<20;i++){update(1/30);hubTick(1/30)}return ymax};
 window.__loc=()=>[(pos.x-HC.x).toFixed(1),pos.y.toFixed(2),(pos.z-(HC.z-1100)).toFixed(1)].join(',');`);
const out=[];const R=(id,ok,txt)=>{out.push((ok?'PASS ':'FAIL ')+id+' '+txt)};
// J: jump height on flat floor (single press, then a second press in the air)
let r=JSON.parse(await X("__L(0,1120,Math.PI);let y1=0;jumpQ=true;for(let i=0;i<40;i++){update(1/30);y1=Math.max(y1,pos.y)}for(let i=0;i<30;i++)update(1/30);let y2=0;jumpQ=true;for(let i=0;i<8;i++){update(1/30);y2=Math.max(y2,pos.y)}jumpQ=true;for(let i=0;i<50;i++){update(1/30);y2=Math.max(y2,pos.y)}JSON.stringify([y1,y2,cls])"));
out.push('INFO jump apex single '+r[0].toFixed(2)+' m, with air jump '+r[1].toFixed(2)+' m, class '+r[2]);const apex=Math.max(r[0],r[1]);
// R1: run and jump into Hangar 0's right side wall from inside
await X("__L(74,1140,-Math.PI/2)");let ym=await X("__run(160,true)");let l=(await X("__loc()")).split(',').map(Number);R('R1 hangar 0 side wall (jumping)',Math.abs(l[0])<=80.7,'ended at '+l+' (wall at x=79..82)');
await X("__L(-74,1140,Math.PI/2)");await X("__run(160,true)");l=(await X("__loc()")).split(',').map(Number);R('R1b hangar 0 left wall (jumping)',Math.abs(l[0])<=80.7,'ended at '+l);
// R2: run and jump at each sale ship and at your own ship
for(const[n,x,z]of[['sale1',-50,1152],['sale2',-18,1158],['sale3',18,1158],['sale4',50,1152],['own',-50,1103]]){for(const[ox,oz,yw]of[[0,17,0],[12,0,Math.PI/2],[-12,0,-Math.PI/2]]){await X(`__L(${x+ox},${z+oz},${yw})`);
  const v=JSON.parse(await X(`(()=>{let on=0,yo=0;keys.KeyW=true;for(let i=0;i<150;i++){if(i%9===0)jumpQ=true;update(1/30);hubTick(1/30);const dx=pos.x-HC.x-(${x}),dz=pos.z-(HC.z-1100)-(${z});if(Math.abs(dx)<7&&Math.abs(dz)<7.5){on++;yo=Math.max(yo,pos.y)}}keys.KeyW=false;for(let i=0;i<20;i++)update(1/30);return JSON.stringify([on,yo,__loc()])})()`));
  R('R2 ship '+n+' from '+(ox?ox>0?'right':'left':'front'),v[0]===0,'frames over the ship footprint '+v[0]+' (max y there '+(+v[1]).toFixed(2)+'), ended '+v[2])}}
// R3: collision boxes inside the ship display pads (10 m radius) other than the ship's own box
r=JSON.parse(await X("const OZ=HC.z-1100,P=[[-50,1152],[-18,1158],[18,1158],[50,1152],[-50,1103]],bad=[];for(const b of HUB.boxes){if(b.floor)continue;const lo=[b.lo[0]-HC.x,b.lo[2]-OZ],hi=[b.hi[0]-HC.x,b.hi[2]-OZ];for(const[x,z]of P){const cx=Math.max(lo[0],Math.min(x,hi[0])),cz=Math.max(lo[1],Math.min(z,hi[1]));const own=Math.abs((lo[0]+hi[0])/2-x)<.5&&Math.abs((lo[1]+hi[1])/2-z)<.5;if(!own&&Math.hypot(cx-x,cz-z)<10.5)bad.push([x,z,lo.map(v=>v.toFixed(1)),hi.map(v=>v.toFixed(1)),b.hi[1].toFixed(1)])}}JSON.stringify(bad)"));
R('R3 nothing else on the ship pads',!r.length,JSON.stringify(r).slice(0,300));
// R4: the "board your ship" prompt after take-off
r=JSON.parse(await X("__L(-40,1100,0);const shown=!$('veh').hidden&&$('veh').textContent;hubUse();for(let i=0;i<90;i++)update(1/30);JSON.stringify([shown,FLY&&FLY.stage,$('veh').hidden,$('veh').textContent])"));
R('R4 hub prompt hidden in flight',r[2]===true,'before take-off "'+r[0]+'", in flight stage '+r[1]+' hidden='+r[2]+' text "'+r[3]+'"');
await X("try{meriLanded()}catch(e){};for(let i=0;i<10;i++){update(1/30);hubTick(1/30)}");
// R5: two-sided signs: the back copy must be the exact mirror (no x/z tilt)
r=JSON.parse(await X("const bad=[];HUB.g.traverse(o=>{if(o.isMesh&&o.geometry.type==='PlaneGeometry'&&(Math.abs(o.rotation.x)>.01||Math.abs(o.rotation.z)>.01)&&o.material.map&&o.material.blending===T.AdditiveBlending)bad.push([(o.position.x).toFixed(0),(o.position.z).toFixed(0),o.rotation.x.toFixed(2),o.rotation.z.toFixed(2)])});JSON.stringify(bad)"));
R('R5 sign back faces are true mirrors',!r.length,r.length+' tilted copies '+JSON.stringify(r.slice(0,6)));
// R6: zone names outside the buildings
r=JSON.parse(await X("const z=[];for(const[x,y]of[[90,1000],[-90,1000],[100,1060],[95,1140],[0,960]]){__L(x,y,0);z.push(x+','+y+'='+hubZone())}JSON.stringify(z)"));
R('R6 zone outside buildings is ring/plaza',r.slice(0,4).every(s=>/=(ring|plaza)$/.test(s)),r.join(' '));
// R7: transit from the plaza pylon
r=JSON.parse(await X("const L=HUB.pts.filter(p=>p.k==='tr');pos.set(L[0].x,0,L[0].z);for(let i=0;i<4;i++){update(1/30);hubTick(1/30)}const near=HUB.near&&HUB.near.k;if(HUB.near)hubUse();for(let i=0;i<10;i++){update(1/30);hubTick(1/30)}const lx=pos.x-HC.x,lz=pos.z-(HC.z-1100);const f=[-Math.sin(yaw),-Math.cos(yaw)],rad=[lx/Math.hypot(lx,lz),lz/Math.hypot(lx,lz)];JSON.stringify([near,lx.toFixed(1),lz.toFixed(1),pos.y.toFixed(2),hubZone(),(f[0]*rad[0]+f[1]*rad[1]).toFixed(2)])"));
R('R7 transit rides and faces somewhere useful',r[0]==='tr'&&Math.hypot(+r[1]-405,+r[2]-958)<30&&+r[5]>.5,'near='+r[0]+' arrived '+r.slice(1,4)+' zone '+r[4]+' facing·outward '+r[5]);
// R8: hangar H1 floor: the drawn floor top should be where the player stands
r=JSON.parse(await X("const t=.4,rr=1110,x=HC.x+Math.sin(t)*rr,z=HC.z-1100+Math.cos(t)*rr;const rc=new T.Raycaster(new T.Vector3(x,6,z),new T.Vector3(0,-1,0),0,8);rc.camera=cam;const h=rc.intersectObjects(HUB.g.children,true).filter(i=>i.object.isMesh&&!i.object.material.transparent)[0];JSON.stringify([h?h.point.y.toFixed(2):'none'])"));
R('R8 H1 floor height matches the walker (0 ± 0.1)',r[0]!=='none'&&Math.abs(+r[0])<=.1,'drawn floor top '+r[0]);
// R9: the H1 door is a real opening (a ray at eye height through the door centre should not hit the wall within 10 m)
r=JSON.parse(await X("const t=.4,a=1066,x=HC.x+Math.sin(t)*a,z=HC.z-1100+Math.cos(t)*a;const d=new T.Vector3(Math.sin(t),0,Math.cos(t));const rc=new T.Raycaster(new T.Vector3(x,1.6,z),d,0,24);rc.camera=cam;const h=rc.intersectObjects(HUB.g.children,true).filter(i=>i.object.isMesh&&!i.object.material.transparent)[0];JSON.stringify([h?h.distance.toFixed(1):'none',h?h.object.material.color&&h.object.material.color.getHexString():''])"));
R('R9 H1 door is open',r[0]==='none'||+r[0]>20,'first hit through the door at '+r[0]+' m '+r[1]);
console.log(out.join('\n'));console.log('errs',errs.slice(0,5));await b.close()})();
