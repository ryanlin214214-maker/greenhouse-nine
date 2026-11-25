// Sky Garden: model geometry poking up inside the walk sector, lift up/down with E, walk to every edge, pictures
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1100,height:690}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+(process.argv[2]||'t106x.html'),{timeout:240000});await q.waitForTimeout(5000);
const X=c=>q.evaluate(c=>window.__x(c),c);
await X("INTRO.on=false;setState('playing');window.__freeze=true;enemies.length=0");await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(2500);
await q.addStyleTag({content:'#msg,#comm{display:none!important}'});
const out=[];const R=(id,ok,t)=>out.push((ok?'PASS ':'FAIL ')+id+' '+t);
// model geometry in the sector: only meshes whose world box touches the sector, then rays: down from 400 (floor height and
// anything tall), horizontal at 113.5 m along radial and tangential lines, and up from 112.5 (headroom)
out.push('INFO terrace scan: '+await X(`const MS=[];const bb=new T.Box3(),sec=new T.Box3(new T.Vector3(HC.x+600,100,HC.z-1100-185),new T.Vector3(HC.x+870,420,HC.z-1100+185));
 HUB.mer.g.updateMatrixWorld(true);HUB.mer.g.traverse(o=>{if(o.isMesh&&o.visible!==false){if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();bb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld);if(bb.intersectsBox(sec))MS.push(o)}});
 const rc=new T.Raycaster(),hit=(o,d,far)=>{rc.set(o,d);rc.far=far;const h=rc.intersectObjects(MS,false)[0];return h};const dn=new T.Vector3(0,-1,0),up=new T.Vector3(0,1,0);
 let fmin=1e9,fmax=-1e9,tall=[],odd=[],head=[],side=[];
 for(let r=622;r<=854;r+=12)for(let a=-.2;a<=.2001;a+=.02){const t=Math.PI/2+a,x=HC.x+Math.sin(t)*r,z=HC.z-1100+Math.cos(t)*r;
  const h=hit(new T.Vector3(x,400,z),dn,300);const y=h?h.point.y:-1;if(y>=111&&y<=112.6){fmin=Math.min(fmin,y);fmax=Math.max(fmax,y)}else if(y>112.6)tall.push(r+'/'+a.toFixed(2)+'@'+y.toFixed(0));else odd.push(r+'/'+a.toFixed(2)+'~'+y.toFixed(0));
  const u=hit(new T.Vector3(x,112.5,z),up,8);if(u)head.push(r+'/'+a.toFixed(2)+'^'+u.point.y.toFixed(1))}
 for(let a=-.2;a<=.2001;a+=.04){const t=Math.PI/2+a;const o=new T.Vector3(HC.x+Math.sin(t)*622,113.5,HC.z-1100+Math.cos(t)*622),d=new T.Vector3(Math.sin(t),0,Math.cos(t));const h=hit(o,d,232);if(h)side.push('radial '+a.toFixed(2)+' hits at r '+Math.hypot(h.point.x-HC.x,h.point.z-HC.z+1100).toFixed(0))}
 for(let r=640;r<=850;r+=30){const t0=Math.PI/2-.2;const o=new T.Vector3(HC.x+Math.sin(t0)*r,113.5,HC.z-1100+Math.cos(t0)*r);for(let k=0;k<20;k++){const t=t0+k*.02,p=new T.Vector3(HC.x+Math.sin(t+.02)*r,113.5,HC.z-1100+Math.cos(t+.02)*r),q=new T.Vector3(HC.x+Math.sin(t)*r,113.5,HC.z-1100+Math.cos(t)*r),d=p.clone().sub(q);const L=d.length();const h=hit(q,d.normalize(),L);if(h){side.push('arc r '+r+' hits near '+t.toFixed(2));break}}}
 MS.length+' meshes; floor y '+fmin.toFixed(2)+'..'+fmax.toFixed(2)+'; tall '+tall.length+' '+tall.slice(0,12).join(' ')+'; odd '+odd.length+' '+odd.slice(0,12).join(' ')+'; headroom hits '+head.length+' '+head.slice(0,12).join(' ')+'; side '+side.join(' | ')`));
await X(`window.__L=(lx,lz,yw)=>{pos.set(HC.x+lx,0,HC.z-1100+lz);vy=0;yaw=yw||0;pitch=0;for(let i=0;i<4;i++){update(1/30);hubTick(1/30)}};
 window.__w=(n,yw)=>{keys.KeyW=true;for(let i=0;i<n;i++){if(yw!=null)yaw=yw;update(1/30);hubTick(1/30)}keys.KeyW=false;for(let i=0;i<4;i++){update(1/30);hubTick(1/30)}};
 window.__c=()=>{const lx=pos.x-HC.x,lz=pos.z-(HC.z-1100);return[Math.hypot(lx,lz).toFixed(1),(Math.atan2(lx,lz)-Math.PI/2).toFixed(4),pos.y.toFixed(2),hubZone()]}`);
// walk from the transit stop by H3 to the lift, press E
let r=JSON.parse(await X(`const t=Math.PI/2+.065;__L(Math.sin(t)*900,Math.cos(t)*900,t);__w(150,t);const pr=$('veh').hidden?'':$('veh').textContent;const n=HUB.near&&HUB.near.k;hubUse();for(let i=0;i<4;i++){update(1/30);hubTick(1/30)}JSON.stringify([pr,n,__c()])`));
R('walk to the lift and ride up',r[1]==='lift'&&+r[2][2]>111.9&&r[2][3]==='sky','prompt "'+r[0]+'" then at r '+r[2][0]+' y '+r[2][2]+' zone '+r[2][3]);
await q.waitForTimeout(3000);await q.screenshot({path:'sky_1_arrive.png'});
// stand still 3 s: still on the floor
r=JSON.parse(await X(`for(let i=0;i<90;i++){update(1/30);hubTick(1/30)}JSON.stringify(__c())`));R('stands on the terrace floor',Math.abs(+r[2]-112)<.1,'y '+r[2]);
// edges: walk 30 s toward each edge (trees and benches may stop you early: only the bounds are checked), then push from outside
for(const[n,yw]of[['inner edge',Math.PI/2],['left edge',0],['right edge',Math.PI],['outer edge',-Math.PI/2]]){
 r=JSON.parse(await X(`pos.set(HC.x+790,112,HC.z-1100+(${yw}===0?-30:30));vy=0;__w(900,${yw});JSON.stringify(__c())`));
 const rr=+r[0],a=Math.abs(+r[1]);R('walk toward the '+n,rr>=699.9&&rr<=836.6&&a<=.19&&Math.abs(+r[2]-112)<.1,'ended r '+r[0]+' angle '+r[1]+' y '+r[2])}
r=JSON.parse(await X(`const L=[];for(const[r,a]of[[900,0],[600,0],[780,.4],[780,-.4],[824,0],[824,.131],[756,0]]){const t=Math.PI/2+a;pos.set(HC.x+Math.sin(t)*r,112,HC.z-1100+Math.cos(t)*r);meriPush(pos,.45);L.push(__c().slice(0,2).join('/'))}JSON.stringify(L)`));
R('pushed back inside from outside, out of columns and the fountain',r.every((s,i)=>{const[rr,a]=s.split('/').map(Number);return rr>=700.4&&rr<=836.1&&Math.abs(a)<=.19&&(i<4||i===6||Math.abs(rr-824)>=8.1||Math.abs(a)*rr>=8.1)}),r.join(' '));
// jump about at the outer edge: never fall off
r=JSON.parse(await X(`pos.set(HC.x+834,112,HC.z-1100+60);vy=0;let mn=999;keys.KeyW=true;for(let i=0;i<300;i++){yaw=-Math.PI/2+(i%60<30?.6:-.6);if(i%20==0)jumpQ=true;update(1/30);hubTick(1/30);mn=Math.min(mn,pos.y)}keys.KeyW=false;JSON.stringify([mn.toFixed(2),...__c()])`));
R('jumping at the edge never drops you',+r[0]>111.8&&+r[3]>111.8,'lowest y '+r[0]+', end r '+r[1]+' y '+r[3]);
// pictures
for(const[n,x,z,yw,p]of[['sky_2_garden',790,60,Math.PI/2+.35,-.05],['sky_3_cafe',800,-40,Math.PI/2-.6,-.06],['sky_4_cols',780,-20,-Math.PI/2+.25,0.02],['sky_5_inner',704,20,-Math.PI/2+.3,0]]){
 await X(`pos.set(HC.x+${x},112,HC.z-1100+${z});vy=0;yaw=${yw};pitch=${p};for(let i=0;i<4;i++){update(1/30);hubTick(1/30)}eye.set(pos.x,pos.y+EYE,pos.z)`);await q.waitForTimeout(3000);await q.screenshot({path:n+'.png'})}
// back to the lift, down
r=JSON.parse(await X(`const t=Math.PI/2+.065;pos.set(HC.x+Math.sin(t)*820,112,HC.z-1100+Math.cos(t)*820);vy=0;__w(60,-(Math.PI-t));const n=HUB.near&&HUB.near.k;const pr=$('veh').hidden?'':$('veh').textContent;hubUse();for(let i=0;i<4;i++){update(1/30);hubTick(1/30)}const c=__c();__w(30);JSON.stringify([n,pr,c,__c()])`));
R('lift back down and walk on',r[0]==='lift'&&Math.abs(+r[2][2])<.1&&r[2][3]!=='sky'&&+r[3][0]>+r[2][0]+3,'prompt "'+r[1]+'", arrived r '+r[2][0]+' y '+r[2][2]+' zone '+r[2][3]+', walked to r '+r[3][0]);
await q.waitForTimeout(2500);await q.screenshot({path:'sky_6_bottom.png'});
// from the deck, look at the lift shaft
await X(`pos.set(HC.x+905,0,HC.z-1100+25);vy=0;yaw=Math.atan2(-(Math.sin(Math.PI/2+.065)*872-905),-(Math.cos(Math.PI/2+.065)*872-25));pitch=.35;for(let i=0;i<4;i++){update(1/30);hubTick(1/30)}eye.set(pos.x,pos.y+EYE,pos.z)`);await q.waitForTimeout(3000);await q.screenshot({path:'sky_7_shaft.png'});
// lift prompt must not show from the deck under the top point, nor the top one from below
r=await X(`pos.set(HC.x+Math.sin(Math.PI/2+.065)*828,0,HC.z-1100+Math.cos(Math.PI/2+.065)*828);for(let i=0;i<3;i++){update(1/30);hubTick(1/30)}String(HUB.near&&HUB.near.label)`);R('top lift point not reachable from below',r!=='E · LIFT DOWN TO THE OUTER DECK','near '+r);
console.log(out.join('\n'));console.log('errs',errs.slice(0,5));await b.close()})();
