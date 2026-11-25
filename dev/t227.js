// Meridian interaction and placement audit.
// Part 1, interactions: for every interaction point, walk the last few metres to it with game controls, check that the prompt
// appears, press E (hubUse), check that the right thing opens, close it the way a player would, and check control returns.
// Part 2, placements: collision boxes on reserved spots (doors, pads, transit arrivals), NPCs off the floor or inside
// collision, transit arrivals that are blocked, and collision tops a player can jump onto.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:900,height:560}});q.setDefaultTimeout(600000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+(process.argv[2]||'t103x.html'),{timeout:240000});await q.waitForTimeout(5000);
await q.evaluate(()=>window.__rowLook&&window.__rowLook());await q.waitForTimeout(500);
const X=c=>q.evaluate(c=>window.__x(c),c);
await X("INTRO.on=false;setState('playing');window.__freeze=true;enemies.length=0");await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(2500);
const out=[];const R=(id,ok,txt)=>out.push((ok?'PASS ':'FAIL ')+id+' '+txt);
out.push('INFO eye height '+await X("EYE")+' m; walk speed '+await X("(()=>{pos.set(HC.x,0,HC.z+40);yaw=Math.PI;keys.KeyW=true;const z0=pos.z;for(let i=0;i<60;i++)update(1/30);keys.KeyW=false;return (Math.abs(pos.z-z0)/2).toFixed(2)})()")+' m/s (auto sprint)');
// Part 1
const pts=JSON.parse(await X("JSON.stringify(HUB.pts.map((p,i)=>({i,k:p.k,x:p.x-HC.x,z:p.z-(HC.z-1100),r:p.r,name:p.name||''})))"));
for(const p of pts){
  // start 6 m back along the line from the deck centre so the last steps are real walking
  const v=JSON.parse(await X(`(()=>{const P=HUB.pts[${p.i}];let best=null;for(const ang of[0,Math.PI/2,Math.PI,-Math.PI/2,Math.atan2(P.x-HC.x,P.z-(HC.z-1100))]){const bx=-Math.sin(ang)*6,bz=-Math.cos(ang)*6;
    pos.set(P.x+bx,P.y||0,P.z+bz);vy=0;state='playing';for(let i=0;i<3;i++){update(1/30);hubTick(1/30)}
    keys.KeyW=true;let n=0;for(;n<300;n++){yaw=Math.atan2(-(P.x-pos.x),-(P.z-pos.z));update(1/30);hubTick(1/30);if(HUB.near===P)break}keys.KeyW=false;for(let i=0;i<3;i++){update(1/30);hubTick(1/30)}
    const prompt=!$('veh').hidden?$('veh').textContent:'';const d=Math.hypot(pos.x-P.x,pos.z-P.z);const res=[HUB.near===P,prompt,n,d.toFixed(1)];if(res[0])return JSON.stringify(res);best=res}return JSON.stringify(best)})()`));
  R('reach '+p.k+(p.name?' '+p.name:'')+' #'+p.i,v[0]&&v[1].length>0,'prompt "'+v[1]+'" after '+v[2]+' steps, '+v[3]+' m from the point');
  if(!v[0])continue;
  let r;
  if(p.k==='w'||p.k==='a'||p.k==='s'){r=JSON.parse(await X("hubUse();const o=[state,!$('shop').hidden,SHOPOPEN];shopClose();for(let i=0;i<3;i++){update(1/30);hubTick(1/30)}JSON.stringify([...o,state,$('shop').hidden])"));
    R('  shop '+p.k+' opens and closes',r[0]==='paused'&&r[1]&&r[3]==='playing'&&r[4],'open: state '+r[0]+' panel '+r[1]+'; after close: state '+r[3]+' panel hidden '+r[4])}
  else if(p.k==='mb'){r=JSON.parse(await X("hubUse();const o=[state,!$('missions').hidden,!overlay.hidden];resume();for(let i=0;i<3;i++){update(1/30);hubTick(1/30)}JSON.stringify([...o,state,overlay.hidden,HUB.on])"));
    R('  mission board opens and Stay returns',r[0]==='paused'&&r[1]&&r[3]==='playing'&&r[4]&&r[5],JSON.stringify(r))}
  else if(p.k==='x'){r=JSON.parse(await X("hubUse();for(let i=0;i<60;i++)update(1/30);const o=[!!FLY&&FLY.stage,$('veh').hidden,HUB.on];meriLanded();for(let i=0;i<5;i++){update(1/30);hubTick(1/30)}const lx=pos.x-HC.x,lz=pos.z-(HC.z-1100);JSON.stringify([...o,HUB.on,!!FLY,state,lx.toFixed(1),lz.toFixed(1),hubZone()])"));
    R('  your ship: take off, land, back on foot',r[0]===4&&r[1]&&r[3]&&!r[4]&&r[5]==='playing'&&r[8]==='hangar','flight stage '+r[0]+', prompt hidden '+r[1]+'; landed: hub '+r[3]+' flying '+r[4]+' state '+r[5]+' at '+r[6]+','+r[7]+' zone '+r[8])}
  else if(p.k==='lift'){r=JSON.parse(await X("const y0=pos.y;hubUse();for(let i=0;i<4;i++){update(1/30);hubTick(1/30)}const y1=pos.y,z1=hubZone();keys.KeyW=true;const b0=[pos.x,pos.z];for(let i=0;i<20;i++){update(1/30);hubTick(1/30)}keys.KeyW=false;JSON.stringify([y0.toFixed(1),y1.toFixed(2),z1,Math.hypot(pos.x-b0[0],pos.z-b0[1]).toFixed(1),pos.y.toFixed(2)])"));
    R('  lift ride',Math.abs(+r[1]-+r[0])>100&&+r[3]>3&&Math.abs(+r[4]-+r[1])<.1,'from y '+r[0]+' to y '+r[1]+' zone '+r[2]+'; walked '+r[3]+' m, y '+r[4])}
  else if(p.k==='tr'){r=JSON.parse(await X("const a=[pos.x,pos.z];hubUse();for(let i=0;i<4;i++){update(1/30);hubTick(1/30)}const lx=pos.x-HC.x,lz=pos.z-(HC.z-1100);const moved=Math.hypot(pos.x-a[0],pos.z-a[1]);keys.KeyW=true;const b0=[pos.x,pos.z];for(let i=0;i<30;i++){update(1/30);hubTick(1/30)}keys.KeyW=false;JSON.stringify([moved.toFixed(0),lx.toFixed(0),lz.toFixed(0),pos.y.toFixed(2),hubZone(),Math.hypot(pos.x-b0[0],pos.z-b0[1]).toFixed(1)])"));
    R('  transit ride from '+p.name,+r[0]>50&&+r[3]<.2&&+r[5]>4,'moved '+r[0]+' m to '+r[1]+','+r[2]+' y '+r[3]+' zone '+r[4]+'; can walk on '+r[5]+' m in 1 s')}
}
// pause and resume while at Meridian
r=JSON.parse(await X("state='playing';pause();const a=[state,!overlay.hidden];resume();JSON.stringify([...a,state,overlay.hidden])"));R('pause/resume at Meridian',r[0]==='paused'&&r[2]==='playing'&&r[3],JSON.stringify(r));
// Part 2: placements
r=JSON.parse(await X(`(()=>{const OZ=HC.z-1100,L=[];const box=b=>({x0:b.lo[0]-HC.x,x1:b.hi[0]-HC.x,z0:b.lo[2]-OZ,z1:b.hi[2]-OZ,y1:b.hi[1],fl:!!b.floor});
  const BX=HUB.boxes.map(box);const hit=(x,z,rr)=>BX.filter(b=>!b.fl&&x+rr>b.x0&&x-rr<b.x1&&z+rr>b.z0&&z-rr<b.z1);
  // reserved: the concourse plaza door, the hangar 0 back-wall door, the hangar mouth lane, every transit arrival, the NPC spots
  for(const[n,x,z,rr]of[['plaza door',0,986,1.2],['hangar back door',0,1078,1.2],['hangar mouth lane',-25,1195,2],['hangar centre lane',0,1130,1.5]]){const h=hit(x,z,rr);if(h.length)L.push('reserved '+n+' blocked by '+h.map(b=>[b.x0,b.z0,b.x1,b.z1].map(v=>v.toFixed(1)).join(',')).join(' | '))}
  const T2=HUB.pts.filter(p=>p.k==='tr');for(const n of T2){const ax=n.x-HC.x+Math.sin(n.ry||0)*3,az=n.z-OZ+Math.cos(n.ry||0)*3;const h=hit(ax,az,.5);let ob=false;if(MRING.obs)for(const o of MRING.obs){const[cx,cy,cz,hx,hy,hz,an]=o,c2=Math.cos(an),s2=Math.sin(an),dx=ax-cx,dz=az-cz,a1=dx*c2-dz*s2,a2=dx*s2+dz*c2;if(Math.abs(a1)<hx+.5&&Math.abs(a2)<hz+.5)ob=true}if(h.length||ob)L.push('transit arrival '+n.name+' blocked')}
  const npc=[];const W=new T.Vector3();for(const c of(HUB.npcs||[])){c.g.updateMatrixWorld(true);c.g.getWorldPosition(W);const p=W;const bb=new T.Box3().setFromObject(c.g);const x=p.x-(HC.x),z=p.z-OZ;if(Math.abs(bb.min.y)>.25)npc.push('NPC '+c.kind+' feet at y '+bb.min.y.toFixed(2)+' at '+x.toFixed(0)+','+z.toFixed(0));if(hit(x,z,.25).length)npc.push('NPC '+c.kind+' inside collision at '+x.toFixed(1)+','+z.toFixed(1))}
  const climb=BX.filter(b=>!b.fl&&b.y1<9&&b.y1>.6).length;
  return JSON.stringify({L,npc,nNpc:(HUB.npcs||[]).length,climb,boxes:BX.length})})()`));
R('reserved spots and transit arrivals clear',!r.L.length,r.L.join(' ; ')||'none blocked');R('NPCs on the floor and outside collision',!r.npc.length,r.nNpc+' NPCs; '+(r.npc.join(' ; ')||'all fine'));
out.push('INFO '+r.climb+' of '+r.boxes+' hub collision boxes have tops between 0.6 and 9 m (props a jumping player can stand on)');
console.log(out.join('\n'));console.log('errs',errs.slice(0,6));await b.close()})();
