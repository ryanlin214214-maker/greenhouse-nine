// render cost at fixed views: draw calls, triangles, and ms per frame (software renderer, so only the ratio between builds means anything)
const {chromium}=require('playwright');const fs=require('fs');const P=Math.PI;
const V=[['commons',0,20,0,0],['engineering',28,70,-P/2,0],['hangar',0,180,P,0],['m_hangar',-30,1112,0,1],['m_armoury',-38,1050,P,1],['m_outfitter',38,1040,P,1]];
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:960,height:600}});q.setDefaultTimeout(240000);
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(6000);
await q.evaluate(()=>window.__rowLook&&window.__rowLook());await q.waitForTimeout(800);
await q.evaluate(()=>window.__x("INTRO.on=false;setState('playing');for(let i=0;i<10;i++)update(1/30);window.__freeze=true;enemies.length=0"));
let hub=false;const out=[];
for(const[n,x,z,yw,h]of V){if(h&&!hub){await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(3000);hub=true}
  const r=await q.evaluate(([x,z,yw])=>window.__x(`pos.set(${x},0,${z});vy=0;yaw=${yw};pitch=-.03;for(let i=0;i<12;i++)update(1/30);eye.set(pos.x,pos.y+EYE,pos.z);
    const R=()=>{renderer.info.reset();if(composer&&bloomOn)composer.render();else renderer.render(scene,cam)};R();R();renderer.info.autoReset=false;const t0=performance.now();for(let i=0;i<4;i++)R();const ms=(performance.now()-t0)/4;renderer.info.reset();R();
    JSON.stringify({ms:Math.round(ms),calls:renderer.info.render.calls,tris:renderer.info.render.triangles})`),[x,z+(h?-3500:0),yw]);out.push(n+' '+r)}
console.log(out.join('\n'));await b.close()})();
