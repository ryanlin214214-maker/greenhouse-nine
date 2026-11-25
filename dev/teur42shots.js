// Stage 4-2 pictures with the live frame loop (no stepping between pose and picture)
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:960,height:600}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(4000);
const X=c=>q.evaluate(c=>window.__x(c),c);await q.addStyleTag({content:'#comm,#comms{display:none!important}'});
await X(`INTRO.on=false;startAt(5,2);0`);await q.waitForTimeout(5000);
const P=[['42_pad',-8,196,Math.PI,.02],['42_path',-4,140,Math.PI,0],['42_courtyard',0,60,Math.PI,0],['42_ice_arch',-41,-170,0,.25],['42_ridge',66,90,Math.PI*.85,-.15],['42_dome',-62,-60,-Math.PI/2,0],['42_control_room',0,-14,Math.PI,-.1],['42_beacon',30,30,Math.atan2(48,12),.5]];
for(const [n,x,z,y,p] of P){await X(`EUW.ph='shots';setObj('STAGE 4-2 · REACH THE THULE RELAY');pos.set(${x},0,${z});vy=0;yaw=${y};pitch=${p};eye.set(pos.x,pos.y+EYE,pos.z);0`);await q.waitForTimeout(6000);await X(`yaw=${y};pitch=${p};0`);await q.waitForTimeout(2500);await q.screenshot({path:'eur/'+n+'.png'});console.log('shot',n,await X(`JSON.stringify([pos.x,pos.y,pos.z].map(v=>+v.toFixed(1)))`))}
console.log('errs',errs);await b.close()})();
