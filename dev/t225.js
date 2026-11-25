// "chaos walker": plays like a bored player. Runs, turns at random, jumps a lot, rides transit, and keeps walking into things.
// Every few steps it checks (1) is the eye inside a closed object (a short ray from the eye hits the BACK of a face),
// (2) has the player left the allowed area (off the deck, inside a building's walls, on a roof).
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:480,height:300}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+(process.argv[2]||'t103x.html'),{timeout:240000});await q.waitForTimeout(5000);
await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(2000);
await q.evaluate(()=>window.__x(`window.__chaos=(seed,steps,x0,z0)=>{let s=seed;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;const OZ=HC.z-1100;pos.set(HC.x+x0,0,OZ+z0);vy=0;yaw=rnd()*6.28;
  const inside=[],escapes=[],dirs=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1],[.7,0,.7],[-.7,0,-.7]].map(d=>new T.Vector3(...d).normalize());const rc=new T.Raycaster();rc.far=.35;
  const all=[];HUB.g.traverse(o=>{if(o.isMesh&&!o.isInstancedMesh&&o.visible&&!(o.material&&(o.material.transparent||o.material.blending===T.AdditiveBlending))&&o.geometry.attributes.position.count<60000){if(!o.geometry.boundingSphere)o.geometry.computeBoundingSphere();all.push(o)}});const _c=new T.Vector3();let targets=[];const near=()=>{targets=all.filter(o=>{_c.copy(o.geometry.boundingSphere.center).applyMatrix4(o.matrixWorld);return _c.distanceTo(pos)<o.geometry.boundingSphere.radius*Math.max(o.scale.x,o.scale.y,o.scale.z,1)+3})};
  keys.KeyW=true;for(let n=0;n<steps;n++){if(rnd()<.04)yaw+=(rnd()-.5)*3;if(rnd()<.06)jumpQ=true;update(1/30);time+=1/30;
    if(n%6===0){if(n%60===0)near();const e=new T.Vector3(pos.x,pos.y+EYE,pos.z);for(const d of dirs){rc.set(e,d);const h=rc.intersectObjects(targets,false)[0];if(h&&h.face){const nW=h.face.normal.clone().transformDirection(h.object.matrixWorld);if(nW.dot(d)>.2){inside.push([(pos.x-HC.x).toFixed(1),pos.y.toFixed(1),(pos.z-OZ).toFixed(1),h.object.geometry.type,h.object.material.color?h.object.material.color.getHexString():''].join(' '));break}}}
      const lx=pos.x-HC.x,lz=pos.z-OZ,r=Math.hypot(lx,lz);const w=meriWhere(lx,lz);const bad=pos.y>4.6?'high y '+pos.y.toFixed(1):(r<864||(r>1201&&!w.startsWith('plat')&&!(Math.abs(lx)<37&&lz>1195)))?'off the walkable deck r '+r.toFixed(0):'';if(bad)escapes.push(bad+' at '+lx.toFixed(0)+','+lz.toFixed(0))}}
  keys.KeyW=false;const u=a=>[...new Set(a)];return JSON.stringify({inside:u(inside).slice(0,12),nInside:inside.length,escapes:u(escapes).slice(0,8),nEsc:escapes.length,end:[(pos.x-HC.x).toFixed(0),(pos.z-OZ).toFixed(0)]})}`));
const starts=[[0,1120],[-40,1030],[40,1030],[0,960],[60,1000],[300,960],[840,820],[430,1015],[-430,1015],[0,1300],[-60,1150],[60,1160]];
let bad=0;for(let i=0;i<starts.length;i++){const r=JSON.parse(await q.evaluate(([i,x,z])=>window.__chaos(1234+i*97,900,x,z),[i,...starts[i]]));if(r.nInside||r.nEsc)bad++;console.log('start',starts[i].join(','),JSON.stringify(r))}
console.log(bad?'PROBLEMS in '+bad+' runs':'CLEAN');console.log('errs',errs.slice(0,4));await b.close()})();
