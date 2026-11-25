// QA sweep: photographs the walkable Meridian from many spots in several directions for a visual review
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:720,height:450}});q.setDefaultTimeout(240000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/n92.html',{timeout:240000});await q.waitForTimeout(9000);
await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(5000);await q.addStyleTag({content:'#msg{display:none!important}'});
const Z=-3500,E=1.7;const SP=[
 ['hangar-spawn',-30,1112],['hangar-mid',0,1140],['hangar-left',-55,1130],['hangar-right',55,1130],['hangar-back-left',-60,1090],['hangar-back-right',60,1092],['hangar-mouth-left',-45,1192],['hangar-mouth-right',45,1192],
 ['stairs-left-foot',-66,1088],['catwalk-left',-76.5,1150,14],['catwalk-right',76.5,1110,14],['concourse-door',0,1077],['hall-mid',4,1030],['hall-rear',4,992],
 ['armoury-entry',-15,1031],['armoury-mid',-28,1050],['armoury-range',-24,1000],['armoury-gunwall',-40,1062],
 ['outfit-entry',15,1031],['outfit-mid',38,1040],['outfit-gallery',40,1062],['outfit-far',54,1000],
 ['plaza',0,955],['platform-near',0,1230],['platform-mid',10,1380],['platform-tip',0,1550],['deck-center',0,1590],['deck-edge',20,1615]];
const DIRS=[['n',0],['e',-Math.PI/2],['s',Math.PI],['w',Math.PI/2]];const list=[];
for(const[n,x,z,y0]of SP){for(const[dn,yaw]of DIRS){const y=(y0||0)+E,c=[x,y,z+Z,x-Math.sin(yaw)*10,y-.6,z+Z-Math.cos(yaw)*10];
  await q.evaluate(c=>{window.__camOv=c},c);await q.waitForTimeout(1200);const f='qa/'+n+'_'+dn+'.png';await q.screenshot({path:f,timeout:240000});list.push(f)}
  console.log('done',n)}
fs.writeFileSync('qa/list.json',JSON.stringify(list));console.log('errs',errs.slice(0,5));await b.close()})();
