// in-place pictures: the bosses where the stage puts them, and the Dark's troops
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:960,height:600}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t107x.html',{timeout:240000});await q.waitForTimeout(4000);const X=c=>q.evaluate(c=>window.__x(c),c);
await q.addStyleTag({content:'#comm,#comms,#msg{display:none!important}'});
await X(`INTRO.on=false;startAt(4,2);for(let i=0;i<5;i++){update(1/30);cmdTick(1/30)}enemies.length=0;queue.length=0;CMD.w.b=1;CMD.w.c=1;ROW.on=false;rwG.visible=false;window.__freeze=true;
 window.__one=(fn)=>{for(const e of enemies)scene.remove(e.g);enemies.length=0;const e=fn();e.sh=0;if(e.shell){e.g.remove(e.shell);e.shell=null}e.unf=1;for(let i=0;i<30;i++){update(1/30);cmdTick(1/30)}e.spd=0;e.cd=99;return e};
 window.__look=(e,dx,dz,h)=>{pos.set(e.pos.x+dx,0,e.pos.z+dz);const bb=new T.Box3().setFromObject(e.g);const c=new T.Vector3(e.pos.x,bb.min.y+h,e.pos.z);yaw=Math.atan2(-(c.x-pos.x),-(c.z-pos.z));pitch=Math.atan2(c.y-EYE,Math.hypot(dx,dz));eye.set(pos.x,EYE,pos.z);e.g.rotation.y=Math.atan2(-dx*-1,dz)}`);
const S=[[`latSpawn(15,0,-238)`,4,24,3.6,'p_reformed'],[`latSpawn(16,0,-118)`,6,18,3,'p_warden'],[`latSpawn(17,0,40)`,-5,17,3,'p_revenant'],[`(()=>{const e=mk(13,0,1.5,38);enemies.push(e);return e})()`,1.5,4.2,1.3,'p_reaver'],[`(()=>{const e=mk(14,0,1.5,38);enemies.push(e);return e})()`,2,5.5,1.6,'p_maul']];
for(const[sp,dx,dz,h,n]of S){await X(`const e=__one(()=>${sp});__look(e,${dx},${dz},${h});e.g.rotation.y=Math.atan2(pos.x-e.pos.x,pos.z-e.pos.z)`);await q.waitForTimeout(3500);await q.screenshot({path:n+'.png'})}
console.log('errs',errs);await b.close()})();
