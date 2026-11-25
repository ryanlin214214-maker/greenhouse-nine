// eye-level playtest tour: stand where a player stands, HUD on, at a normal window size; one picture per pose
const {chromium}=require('playwright');const fs=require('fs');
const P=Math.PI;
const TH=[['bridge_windows',0,-172,0],['bridge_back',0,-200,P],['port_farms',-60,-100,P/2],['stbd_farms',60,-100,-P/2],['fore_spine',0,-100,0],['commons',0,20,0],
 ['commons_west',-70,0,-P/2],['habitat',-60,95,P/2],['engineering',28,70,-P/2],['aft_spine',0,100,P],['hangar_mouth',0,180,P],['hangar_side',60,230,P/2]];
const ME=[['m_arrival',-30,1112,0],['m_hangar_mouth',0,1120,P],['m_hall',0,1060,0],['m_gunwall',-38,1050,P],['m_cannon',-25,1020,P/2],['m_armoury_back',-40,1060,0],
 ['m_gallery',38,1040,P],['m_gallery_far',40,1010,-P/2],['m_helmets',25,995,0],['m_plaza',0,975,0],['m_platform_out',0,1350,P],['m_platform_back',0,1300,0],['r_promenade',247.4,968.9,-1.32],['r_terrace_base',496.9,726.3,.6],['r_rim',1099.8,427.6,4.34],['r_platform1',932.5,905.7,3.94],['r_h1_door',405,958,3.54],['r_h1_inside',428.4,1013.2,3.54]];
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1250,height:780}});q.setDefaultTimeout(240000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+(process.argv[2]||'t97x.html'),{timeout:240000});await q.waitForTimeout(6000);
await q.evaluate(()=>window.__rowLook&&window.__rowLook());await q.waitForTimeout(800);
await q.evaluate(()=>window.__x("INTRO.on=false;setState('playing');for(let i=0;i<10;i++)update(1/30);window.__freeze=true;enemies.length=0"));
await q.addStyleTag({content:'#msg,#comm{display:none!important}'});
const only=process.argv[3]||'all';const log=[];
const shoot=async(n,x,z,yw,oz)=>{const r=await q.evaluate(([x,z,yw])=>window.__x(`pos.set(${x},0,${z});vy=0;yaw=${yw};pitch=-.03;for(let i=0;i<12;i++)update(1/30);eye.set(pos.x,pos.y+EYE,pos.z);JSON.stringify([+pos.x.toFixed(1),+pos.y.toFixed(1),+pos.z.toFixed(1)])`),[x,z+(oz||0),yw]);
  await q.waitForTimeout(2600);await q.screenshot({path:(process.env.TD||'tour')+'/'+n+'.png'});log.push(n+' asked '+x+','+z+' got '+r)};
if(only!=='meri')for(const[n,x,z,yw]of TH)await shoot(n,x,z,yw);
if(only!=='thal'){await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(4000);for(const[n,x,z,yw]of ME)await shoot(n,x,z,yw,-3500)}
console.log(log.join('\n'));console.log('errs',errs.slice(0,4));await b.close()})();
