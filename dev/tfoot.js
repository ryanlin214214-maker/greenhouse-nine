// gameplay foot contact: spawn every walker type, let them move and fight, measure the lowest visible sole vs the floor
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:320,height:200}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(3000);
console.log(await q.evaluate(c=>window.__x(c),`(()=>{INTRO.on=false;setState('playing');enemies.length=0;const o=[];const B=new T.Box3(),b=new T.Box3();
 const vb=(root)=>{B.makeEmpty();root.updateMatrixWorld(true);root.traverse(m=>{if(!m.isMesh)return;let v=true;m.traverseAncestors(a=>{if(!a.visible)v=false});if(!v||!m.visible)return;if(!m.geometry.boundingBox)m.geometry.computeBoundingBox();b.copy(m.geometry.boundingBox).applyMatrix4(m.matrixWorld);B.union(b)});return B.min.y};
 pos.set(0,0,30);const T0=[5,6,7,8,9,10,11,12,13,14];const st={};
 T0.forEach((ty,i)=>{const x=-14+i*3,z=-10;const e=mk(ty,x,groundAt(x,z,3)+ER[ty],z);enemies.push(e);e.unf=1;st[ty]={lo:1e9,hi:-1e9}});
 for(let f=0;f<240;f++){update(1/30);time+=1/30;for(const e of enemies){if(e.dying||!e.rig||!e.rig.anim)continue;e.rig.anim(e,time,1/30);if(f<20)continue;const fl=groundAt(e.pos.x,e.pos.z,e.pos.y);if(e.rig.feet&&e.rig.feet().length){const F=e.rig.feet();const air0=Math.abs(e.vy||0)>.6||e.jet>0||e.roll>0;if(air0)continue;const gp=Math.min(...F.map(p=>p.y))-fl;const s=st[e.type];if(!s)continue;s.lo=Math.min(s.lo,gp);s.hi=Math.max(s.hi,gp);continue}const air=Math.abs(e.vy||0)>.6||e.jet>0||e.roll>0;if(air)continue;const gp=vb(e.g)-fl;const s=st[e.type];if(!s)continue;s.lo=Math.min(s.lo,gp);s.hi=Math.max(s.hi,gp)}}
 return T0.map(t=>t+': sole gap '+st[t].lo.toFixed(2)+'..'+st[t].hi.toFixed(2)).join('\\n')})()`));
console.log('errs',errs.length,errs.slice(0,3));await b.close()})();
