const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:+process.argv[3]||1250,height:+process.argv[4]||720}});q.setDefaultTimeout(240000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(6000);
await q.evaluate(()=>window.__rowLook&&window.__rowLook());await q.waitForTimeout(1500);
const W=process.argv[3]||1250;
// a long objective with a boss bar
console.log(await q.evaluate(()=>window.__x("INTRO.on=false;setState('playing');for(let i=0;i<20;i++)update(1/30);'ok'")));
await q.evaluate(()=>window.__x("setObj('BOSS · COLOSSUS · ENGINE DECK · PURGE · 12 LEFT · DESTROY THE COOLANT NODES TO OPEN ITS CHEST',.62)"));
await q.waitForTimeout(800);await q.screenshot({path:'H_boss_'+W+'.png'});
const r=await q.evaluate(()=>{const R=id=>{const e=document.getElementById(id);if(!e||e.hidden)return null;const r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top),Math.round(r.right),Math.round(r.bottom)]};return {hud:R('hud'),obj:R('obj'),objT:R('objT'),bar:R('objBar'),radar:R('radar')}});console.log(JSON.stringify(r));
// waypoint in front, then behind (edge arrow); doors
for(const [n,c] of [['wpF',"wpSet(new T.Vector3(pos.x-Math.sin(yaw)*30,1.5,pos.z-Math.cos(yaw)*30),'ENGINE DECK',30)"],['wpB',"wpSet(new T.Vector3(pos.x+Math.sin(yaw)*30+8,1.5,pos.z+Math.cos(yaw)*30),'ENGINE DECK',31)"]]){
  await q.evaluate(c=>{window.__wpc=c;if(!window.__wph){window.__wph=1;window.__x("const o=wpDraw;wpDraw=function(){if(window.__wpc)window.__x(window.__wpc);o()}")}},c);await q.waitForTimeout(1200);await q.screenshot({path:'H_'+n+'_'+W+'.png'});
  console.log(n,await q.evaluate(()=>{const e=document.getElementById('wp');return [e.hidden,e.className,e.style.left,e.style.top,e.lastChild.textContent]}))}

// on-foot route: send the campaign target somewhere far and step
console.log('route',await q.evaluate(()=>window.__x("const R=[];for(const tgt of [[0,200],[60,-150],[-80,40]]){WPR.key=-2;wpRoute(tgt[0],tgt[1],'T');R.push([Math.round(WPR.d),Math.round(Math.hypot(tgt[0]-pos.x,tgt[1]-pos.z)),WPR.doors.length,Math.round(WPR.P.x),Math.round(WPR.P.z)])};JSON.stringify([Math.round(pos.x),Math.round(pos.z),R])")));
await q.evaluate(()=>window.__x("WPR.key=-2;wpRoute(0,200,'HANGAR');WPR.live=true;"));await q.evaluate(()=>{window.__wpc="wpRoute(0,200,'HANGAR');WPR.live=true"});await q.waitForTimeout(1500);await q.screenshot({path:'H_route_'+W+'.png'});
console.log('errs',errs.slice(0,5));await b.close()})();
