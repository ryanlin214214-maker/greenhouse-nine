const {chromium}=require('playwright');const fs=require('fs');const P=Math.PI;
const Q=[['commons_zebra',0,20,0,[[0,-.12],[-.3,-.15],[.25,-.13],[0,-.2]]],['eng_disc',28,70,-P/2,[[-.12,.55],[-.12,.45],[-.2,.5]]],['gun_block',0,20,0,[[.28,-.62],[.3,-.7],[.24,-.66]]]];
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:1250,height:780}});q.setDefaultTimeout(240000);q.on('pageerror',e=>console.log('ERR',e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t101x.html',{timeout:240000});await q.waitForTimeout(5000);
await q.evaluate(()=>window.__rowLook&&window.__rowLook());await q.waitForTimeout(500);
await q.evaluate(()=>window.__x(`INTRO.on=false;setState('playing');window.__freeze=true;enemies.length=0;for(let i=0;i<5;i++)update(1/30)`));
for(const[n,x,z,yw,pts]of Q){
 const r=await q.evaluate(([x,z,yw,pts])=>window.__x(`pos.set(${x},0,${z});vy=0;yaw=${yw};pitch=-.03;for(let i=0;i<8;i++)update(1/30);eye.set(pos.x,pos.y+EYE,pos.z);cam.position.copy(eye);cam.rotation.set(pitch,yaw,0,'YXZ');cam.updateMatrixWorld();vm.updateMatrixWorld(true);
  const rc=new T.Raycaster();rc.camera=cam;const out=[];const vis=o=>{for(let u=o;u;u=u.parent)if(!u.visible)return false;return true};for(const p of ${JSON.stringify(pts)}){rc.setFromCamera(new T.Vector2(p[0],p[1]),cam);const h=rc.intersectObjects([scene,vm],true).filter(i=>vis(i.object)&&!(i.object.isSprite&&i.distance<.5)).slice(0,4);
   out.push(p.join(',')+': '+h.map(i=>{const o=i.object,m=o.material||{};return o.type+'/'+(m.type||'').replace('Material','')+'/c'+(m.color?m.color.getHexString():'')+'/d'+i.distance.toFixed(2)+'/p'+i.point.toArray().map(v=>v.toFixed(2)).join(':')+(m.transparent?'/tr'+m.opacity:'')+(m.polygonOffset?'/po'+m.polygonOffsetFactor:'')+(m.map?'/map':'')}).join(' | '))}
  out.join('\\n')`),[x,z,yw,pts]);console.log('== '+n+'\n'+r)}
await b.close()})();
