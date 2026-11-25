const {chromium}=require('playwright');const fs=require('fs');const P=Math.PI;
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1250,height:780}});q.setDefaultTimeout(600000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+(process.argv[2]||'t105x.html'),{timeout:240000});await q.waitForTimeout(5000);
await q.evaluate(()=>window.__rowLook&&window.__rowLook());await q.waitForTimeout(500);
const X=c=>q.evaluate(c=>window.__x(c),c);
await X("INTRO.on=false;setState('playing');window.__freeze=true;enemies.length=0;for(let i=0;i<4;i++)update(1/30)");await q.addStyleTag({content:'#msg,#comm{display:none!important}'});
const shot=async(n,x,z,yw,pt,h)=>{await X(`window.__camOv=null;pos.set(${x},0,${z+(h?-3500:0)});vy=0;yaw=${yw};pitch=${pt||-.03};for(let i=0;i<8;i++){update(1/30);if(HUB.on)hubTick(1/30)}eye.set(pos.x,pos.y+EYE,pos.z)`);await q.waitForTimeout(2600);await q.screenshot({path:'t90/'+n+'.png'})};
await shot('bridge_windows',0,-172,0);await shot('hangar_mouth',0,180,P);
await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(2500);
for(const[n,x,z,yw]of[['m_gunwall',-38,1050,P],['m_gallery',38,1040,P],['m_gallery_far',40,1010,-P/2],['m_helmets',25,995,0]])await shot(n,x,z,yw,-.03,1);
// first terrace top (y 112, r 520..864): eye-level views, looking out to the rim and in toward the tower
for(const[n,r,t,look,pt]of[['terrace_out',700,.15,'out',-.05],['terrace_in',760,.15,'in',.05],['terrace_along',700,.9,'along',0]]){const x=Math.sin(t)*r,z=Math.cos(t)*r;const yw=look==='out'?t+P:look==='in'?t:t+P/2;
  await X(`window.__camOv=null;const e=new T.Vector3(HC.x+${x},113.6,HC.z-1100+${z});window.__camOv=[e.x,e.y,e.z,e.x-Math.sin(${yw})*10,e.y+${pt}*10,e.z-Math.cos(${yw})*10]`);await q.waitForTimeout(2600);await q.screenshot({path:'t90/'+n+'.png'})}
console.log('errs',errs.slice(0,4));await b.close()})();
