const {chromium}=require('playwright');const fs=require('fs');const pre=process.argv[2],page=process.argv[3]||'x',room=process.argv[4]||'hangar';
const SP={hangar:[['door',[0,1.7,156,0,2.5,175]],['pad',[-40,1.7,198,-80,3,215]],['booth',[-90,1.7,190,-40,3,215]],['mouth',[10,1.7,248,-20,3,190]]],
  commons:[['c1',[0,1.7,34,0,3,0]],['c2',[-95,1.7,0,-40,3,0]],['c3',[60,1.7,-30,90,3,10]]],
  bridge:[['b1',[0,1.7,-166,0,3,-220]],['b2',[-50,1.7,-200,0,3,-200]]],
  habitat:[['h1',[-59.5,1.7,145,-59.5,2,60]],['h2',[-100,1.7,95,-20,2,95]],['h3',[-80,1.7,70,-95,1.5,60]]],
  farms:[['f1',[-60,1.7,-46,-60,3,-150]],['f2',[60,1.7,-154,60,3,-50]],['f3',[-100,1.7,-100,-20,3,-100]]],
  spines:[['s1',[0,1.7,-48,0,2,-150]],['s2',[0,1.7,46,0,2,150]]],
  show:[['stalls',[-85,1.7,-16,-90,1.6,-26]],['tram',[88,1.7,-14,100,1.8,0]],['vend',[69,1.7,-20,69,1.3,-27]],['bridge',[0,5,-160,0,2.5,-185]],['ring',[14,1.7,-202,0,1.2,-217]],['cabin',[-68,1.7,49,-80,1,47]],['shed',[88,1.7,-66,100,1.5,-56]],['spine',[-4,1.7,-70,6.6,2.6,-55]],['bench',[-30,1.7,22,-42,.8,28.6]],['farm',[-82,1.7,-140,-88,1,-154]]],
  fix:[['ring',[14,1.7,-202,0,1.2,-217]],['ring2',[-6,1.7,-232,0,1.5,-217]],['tier',[20,3,-178,20,2.4,-190]],['door',[0,1.7,-30,0,4,-45]],['door2',[0,1.7,-140,0,5,-160]]],
  eng:[['ring',[40,1.7,60,59,6,95]],['gen',[100,1.7,118,60,4,95]],['cat',[45,10.6,82,65,9,110]],['tank',[30,1.7,128,19,5,141]]]}[room];
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1000,height:640}});q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));q.on('console',m=>{if(m.type()==='warning'&&/parked/.test(m.text()))errs.push(m.text())});
await q.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await q.goto('file://'+process.cwd()+'/gtest/'+page+'.html',{timeout:90000});await q.waitForTimeout(8000);await q.click('#go');await q.waitForTimeout(800);
await q.evaluate(()=>window.__ie());await q.evaluate(()=>{for(const e of []);});
for(const[n,c]of SP){await q.evaluate(c=>{window.__camOv=c;window.__pinAt=[c[0],0,c[2]];for(const id of['hud','comms','cross','radar','overlay','cine'])document.getElementById(id).hidden=true;window.__lt()},c);await q.waitForTimeout(1600);
  await q.evaluate(()=>{for(const id of['hud','comms','cross','radar','overlay','cine'])document.getElementById(id).hidden=true});await q.screenshot({path:pre+'_'+n+'.png',clip:{x:76,y:58,width:848,height:532},timeout:120000})}
console.log('errs',errs);await b.close()})();
