// imported GLB map: loads (sibling file over HTTP, or the inlined copy on file://), collision, walking through the door and
// corridor, walls hold, robots path to you, lamps, Thalassa restored on leaving. argv: page, [http]
const {chromium}=require('playwright');const fs=require('fs'),http=require('http'),path=require('path');
(async()=>{let url='file://'+process.cwd()+'/gtest/'+process.argv[2],srv=null;
if(process.argv[3]==='http'||process.argv[3]==='httptxt'){fs.mkdirSync('gtest/maps',{recursive:true});try{fs.unlinkSync('gtest/maps/test_room.glb')}catch(e){}try{fs.unlinkSync('gtest/maps/test_room.glb.txt')}catch(e){}
  if(process.argv[3]==='http')fs.copyFileSync('test_room.glb','gtest/maps/test_room.glb');else fs.writeFileSync('gtest/maps/test_room.glb.txt',fs.readFileSync('test_room.glb').toString('base64').replace(/(.{76})/g,'$1\n'));
  srv=http.createServer((rq,rs)=>{const f=path.join(process.cwd(),'gtest',decodeURIComponent(rq.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){rs.writeHead(404);rs.end();return}rs.writeHead(200,{'Content-Type':f.endsWith('.html')?'text/html; charset=utf-8':f.endsWith('.txt')?'text/plain':'application/octet-stream'});rs.end(d)})}).listen(8731);url='http://localhost:8731/'+process.argv[2]}
const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1000,height:620}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message));
const reqs=[];q.on('request',r=>{if(/maps\//.test(r.url()))reqs.push(r.url())});q.on('response',r=>{if(/maps\//.test(r.url()))reqs.push(r.status()+' '+r.url())});
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto(url,{timeout:240000});await q.waitForTimeout(4000);
const X=c=>q.evaluate(c=>window.__x(c),c);const R=(id,ok,t)=>console.log((ok?'PASS ':'FAIL ')+id+' '+t);const P=process.argv[3]==='http'?'glb_h_':process.argv[3]==='httptxt'?'glb_t_':'glb_';
await q.addStyleTag({content:'#comm,#msg{display:none!important}'});
const base=JSON.parse(await X(`INTRO.on=false;JSON.stringify({b:boxes.length,r:ROOMS.length,f:FIX.length,w:NAVW.length})`));
let r=JSON.parse(await q.evaluate(()=>window.__x(`new Promise(ok=>{startAt(9,1);const t0=performance.now();const w=()=>{if(GLBM.on)ok(JSON.stringify({ms:Math.round(performance.now()-t0),stat:GLBM.stat,boxes:boxes.length,rooms:ROOMS.map(r=>r.n),fix:FIX.length,navw:NAVW.length,pos:[pos.x,pos.y,pos.z].map(v=>+v.toFixed(2)),yaw:+yaw.toFixed(2)}));else if(performance.now()-t0>90000)ok(JSON.stringify({fail:1}));else setTimeout(w,50)};w()})`)));
R('map loads ('+(process.argv[3]==='http'?'sibling file over HTTP':process.argv[3]==='httptxt'?'base64 .glb.txt over HTTP (no .glb served)':'inlined copy on file://')+')',r.boxes>10&&!r.fail,JSON.stringify(r)+' requests '+reqs.join(' | '));
await X(`window.__st=(n,fn)=>{for(let i=0;i<n;i++){if(state!=='playing')break;update(1/30);time+=1/30;if(fn&&fn())break}};0`);
r=JSON.parse(await X(`enemies.length=0;queue.length=0;__st(10);JSON.stringify([pos.y.toFixed(2),ground])`));R('player stands on the imported floor',Math.abs(+r[0])<.05,JSON.stringify(r));
await q.waitForTimeout(2500);await q.screenshot({path:P+'1_roomA.png'});
// walk north through the door, down the corridor, into room B
r=JSON.parse(await X(`keys.KeyW=true;let n=0;for(;n<400;n++){enemies.length=0;queue.length=0;yaw=0;update(1/30);time+=1/30;if(pos.z<-40)break}keys.KeyW=false;JSON.stringify([pos.x.toFixed(2),pos.z.toFixed(2),n])`));
R('walk from room A through the door and corridor into room B',+r[1]<-40,JSON.stringify(r));
await X(`yaw=Math.PI;pitch=0;__st(3);eye.set(pos.x,pos.y+EYE,pos.z);0`);await q.waitForTimeout(2500);await q.screenshot({path:P+'2_roomB_back.png'});
// walls hold: from room A centre walk east into the wall, and push against the corridor wall
r=JSON.parse(await X(`pos.set(0,0,0);vy=0;keys.KeyW=true;for(let i=0;i<200;i++){yaw=-Math.PI/2;enemies.length=0;update(1/30)}const a=pos.x;pos.set(0,0,-22);for(let i=0;i<150;i++){yaw=Math.PI/2;enemies.length=0;update(1/30)}const c=pos.x;keys.KeyW=false;JSON.stringify([a.toFixed(2),c.toFixed(2)])`));
R('walls hold (room A east wall at x 10, corridor wall at x -2)',+r[0]<9.8&&+r[0]>9&&+r[1]>-2&&+r[1]<-1.3,JSON.stringify(r));
await X(`pos.set(0,0,-12);yaw=0;pitch=.02;__st(3);eye.set(pos.x,pos.y+EYE,pos.z);0`);await q.waitForTimeout(2500);await q.screenshot({path:P+'3_corridor.png'});
// robots: spawn at the markers and come for you through the corridor
r=JSON.parse(await X(`pos.set(0,0,6);yaw=0;enemies.length=0;queue.length=0;cmdSpawn(GLBM.sp.e.map((p,i)=>[[5,7,6][i],p.x,p.z,0]));__st(30);const s0=enemies.map(e=>e.pos.z.toFixed(1));
 window.__realHurt=false;let inside=0;for(let i=0;i<450;i++){update(1/30);time+=1/30;for(const e of enemies)for(const b of boxes)if(!b.floor&&e.pos.x>b.lo[0]+.05&&e.pos.x<b.hi[0]-.05&&e.pos.z>b.lo[2]+.05&&e.pos.z<b.hi[2]-.05&&e.pos.y-e.r<b.hi[1]-.3&&e.pos.y>b.lo[1])inside++}
 JSON.stringify({n:enemies.length,start:s0,now:enemies.map(e=>[e.pos.x.toFixed(1),e.pos.z.toFixed(1)].join('/')),insideWallFrames:inside})`));
R('robots spawn at the markers and path toward you without entering walls',r.n>=3&&r.insideWallFrames===0&&r.now.some(s=>+s.split('/')[1]>-20),JSON.stringify(r));
await X(`yaw=0;pitch=0;eye.set(pos.x,pos.y+EYE,pos.z);0`);await q.waitForTimeout(2500);await q.screenshot({path:P+'4_robots.png'});
r=JSON.parse(await X(`setState('menu');reset();JSON.stringify({on:GLBM.on,b:boxes.length,r:ROOMS.length,f:FIX.length,w:NAVW.length})`));
R('leaving restores Thalassa (boxes, rooms, lamps, nav walls)',!r.on&&r.b===base.b&&r.r===base.r&&r.f===base.f&&r.w===base.w,JSON.stringify(r)+' base '+JSON.stringify(base));
console.log('errs',errs.length,errs.slice(0,3));await b.close();if(srv)srv.close()})();
