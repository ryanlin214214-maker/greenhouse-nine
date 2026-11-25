const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const q=await b.newPage({viewport:{width:1000,height:1000}});q.setDefaultTimeout(600000);
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t105x.html',{timeout:240000});await q.waitForTimeout(5000);
await q.evaluate(()=>window.__rowLook&&window.__rowLook());await q.evaluate(()=>window.__x("INTRO.on=false;setState('playing');window.__freeze=true"));await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(2500);
await q.addStyleTag({content:'#hud,#obj,.htag,#msg{display:none!important}'});
// top-down over the terrace above the plaza: centre (0, 760), 480 m wide view
await q.evaluate(()=>window.__x("window.__camOv=[HC.x,620,HC.z-1100+760,HC.x,0,HC.z-1100+760.01];cam.fov=42;cam.updateProjectionMatrix()"));await q.waitForTimeout(3000);await q.screenshot({path:'t90/terrace_top.png'});
// list the 8x model's objects whose box touches the terrace top band (y 112..140) within r 600..870, |x|<240, z>500
console.log(await q.evaluate(()=>window.__x(`const L=[];const bb=new T.Box3();HUB.mer.g.updateMatrixWorld(true);HUB.mer.g.traverse(o=>{if(!o.isMesh)return;bb.setFromObject(o);const lo=bb.min,hi=bb.max;const lx0=lo.x-HC.x,lx1=hi.x-HC.x,lz0=lo.z-(HC.z-1100),lz1=hi.z-(HC.z-1100);if(hi.y>112.3&&lo.y<140&&lx1>-240&&lx0<240&&lz1>600&&lz0<870&&(hi.x-lo.x)<400)L.push([lx0.toFixed(0),lx1.toFixed(0),lz0.toFixed(0),lz1.toFixed(0),lo.y.toFixed(0),hi.y.toFixed(0),o.material&&o.material.color?o.material.color.getHexString():''].join(','))});L.length+' small objects in band:\\n'+L.slice(0,40).join('\\n')`)));
await b.close()})();
