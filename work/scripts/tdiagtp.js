const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:640,height:400}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(4000);
const X=c=>q.evaluate(c=>window.__x(c),c);
await X(`INTRO.on=false;setState('playing');enemies.length=0;window.__st=(n,fn)=>{for(let i=0;i<n;i++){if(state!=='playing')break;update(1/30);if(FLY)flyCam(1/30);time+=1/30;if(fn&&fn())break}};0`);
await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(1500);
console.log(await X(`WAL.ship='kestrel';hubLaunch();__st(400,()=>FLY.ph==='free');const S=FLY,O=S.org;S.pos.set(O.x,700,O.z+5200);S.h=Math.PI;yaw=Math.PI;pitch=0;S.spd=0;S.thr=0;for(const e of S.en.slice())scene.remove(e.g);S.en.length=0;
 const e=flyEnemyR('ebm',S.pos.x+200,S.pos.y,S.pos.z+3000);e.dir.set(0,0,-1);const log=[];let m=null;window.__realHurt=true;const h0=[hp,shield];
 for(let i=0;i<900;i++){__st(1);S.pos.set(O.x,700,O.z+5200);S.spd=0;if(!m&&S.etp&&S.etp.length)m=S.etp[0];if(i%15==0)log.push([i,e.st,Math.round(e.p.distanceTo(S.pos)),m?Math.round(m.p.distanceTo(S.pos)):null,m?+m.t.toFixed(1):null,m?m.hp:null,Math.round(hp),Math.round(shield),state]);if(m&&m.t<=0&&i%15)break}
 log.push(['end',h0,hp,shield,S.ph,!!FLY]);JSON.stringify(log)`));
console.log('errs',errs);await b.close()})();
