const {chromium}=require('playwright');const fs=require('fs');const P=Math.PI;
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1250,height:780}});q.setDefaultTimeout(240000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(5000);
await q.evaluate(()=>window.__rowLook&&window.__rowLook());await q.waitForTimeout(500);
const X=c=>q.evaluate(c=>window.__x(c),c);const shot=async(n,w)=>{await q.waitForTimeout(w||2500);await q.screenshot({path:'fx/'+n+'.png'})};
// light pools when the first thing you do is visit Meridian
await X("INTRO.on=false;setState('playing');window.__freeze=true;enemies.length=0");await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(2500);
console.log('in hub, pools built?',await X("String(ATMO.on)"));await q.evaluate(()=>window.__hub('leave'));await q.waitForTimeout(1500);
console.log('after leaving:',await X("ATMO.on+' pools '+(ATMO.pools?ATMO.pools.count:0)+' upper '+(()=>{if(!ATMO.pools)return 0;const m=new T.Matrix4();let n=0;for(let i=0;i<ATMO.pools.count;i++){ATMO.pools.getMatrixAt(i,m);if(m.elements[13]>2)n++}return n})()"));
await q.addStyleTag({content:'#comm{display:none!important}'});
const pose=(x,z,yw,pt)=>X(`pos.set(${x},0,${z});vy=0;yaw=${yw};pitch=${pt||-.03};for(let i=0;i<8;i++)update(1/30);eye.set(pos.x,pos.y+EYE,pos.z)`);
await pose(92,96,-P/2,.12);await X("ATMO.beac.forEach(b=>b.ph=-time*3.2)");await shot('eng_beacons',400);
await pose(26,66,P/2);await shot('eng_steam',4000);
await pose(0,168,P,-.12);await shot('hangar_guides',1500);
await pose(30,200,-P/2);await X("for(let i=0;i<3;i++){fireCd=0;fire()}flash=1;beam.visible=true");await shot('muzzle_impact',300);
await X("say('Ember Ronin · click or melee to slash',6,'#ff8a3a');setObj('STAGE 2/4 · GO TO ENGINEERING · 85 M · PURGE · 12 LEFT · BOSS INBOUND')");await shot('announce_desktop',600);
await q.setViewportSize({width:420,height:800});await X("say('Ember Ronin · click or melee to slash',6,'#ff8a3a')");await shot('announce_phone',1500);await q.setViewportSize({width:1250,height:780});
await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(2500);await X(`pos.set(0,0,1120-3500);yaw=Math.PI;pitch=-.1;for(let i=0;i<6;i++)update(1/30);eye.set(pos.x,pos.y+EYE,pos.z)`);await shot('m_guides',2000);
await X(`pos.set(-38,0,1012-3500);yaw=Math.PI/2;pitch=.05;for(let i=0;i<6;i++)update(1/30);eye.set(pos.x+0,pos.y+EYE,pos.z)`);await X(`pos.x=-24;eye.x=-24`);await shot('m_cannon',2500);
await X(`pos.set(25,0,996-3500);yaw=0;pitch=0;for(let i=0;i<6;i++)update(1/30);eye.set(pos.x,pos.y+EYE,pos.z)`);await shot('m_helmets',2500);
// fly back toward Hangar 0: guide lights and the waypoint on the approach
console.log('launch',await X("hubLaunch();for(let i=0;i<240;i++)update(1/30);const S=FLY;const O=S.org;S.ph='free';S.pos.set(O.x,26,O.z+1420);S.h=0;S.p=0;S.spd=40;S.thr=.2;yaw=0;pitch=-.02;S.camR=0;S.roll=0;for(let i=0;i<6;i++)update(1/30);S.ph+' '+S.stage"));await shot('m_flyin',3000);
// a stationary enemy bolt in front of the ship
await X("const S=FLY;const d=new T.Vector3(-Math.sin(S.h),0,-Math.cos(S.h));const p=S.pos.clone().addScaledVector(d,40);p.y+=3;flyShot(p,d.clone().negate(),0,FBOLT,4,.3,0,false);flyShot(p.clone().add(new T.Vector3(6,1,0)),d.clone().negate(),0,FTRC,7,.13,0,true)");await shot('space_bolts',800);
console.log('errs',errs.slice(0,5));await b.close()})();
