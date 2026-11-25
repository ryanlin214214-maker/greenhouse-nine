// Hangar-by-hangar eye-level pictures (and Hangar 0's ship displays). Each hangar: the door seen from the deck, standing in the
// doorway, inside looking out to the mouth, inside looking back at the door, looking up at the roof, and a top-down overview.
const {chromium}=require('playwright');const fs=require('fs');const P=Math.PI;
const HG=[.4,-.4,1.55,-1.55,2.85,-2.85];
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1100,height:690}});q.setDefaultTimeout(600000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+(process.argv[2]||'t103x.html'),{timeout:240000});await q.waitForTimeout(5000);
await q.evaluate(()=>window.__rowLook&&window.__rowLook());await q.waitForTimeout(500);
const X=c=>q.evaluate(c=>window.__x(c),c);
await X("INTRO.on=false;setState('playing');window.__freeze=true;enemies.length=0");await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(2500);
await q.addStyleTag({content:'#msg,#comm{display:none!important}'});
const TD=process.env.TD||'hq';const only=process.argv[3];
const shot=async(n,lx,lz,yw,pt,w)=>{await X(`window.__camOv=null;pos.set(HC.x+${lx},0,HC.z-1100+${lz});vy=0;yaw=${yw};pitch=${pt||0};for(let i=0;i<6;i++){update(1/30);hubTick(1/30)}eye.set(pos.x,pos.y+EYE,pos.z)`);await q.waitForTimeout(w||2200);await q.screenshot({path:TD+'/'+n+'.png'})};
const R=(t,r,la=0)=>[Math.sin(t)*r+Math.cos(t)*la,Math.cos(t)*r-Math.sin(t)*la];
for(let k=0;k<6;k++){if(only&&only!=='h'+(k+1)&&only!=='h')continue;const t=HG[k],out=t+P,inn=t;let p;
  p=R(t,1045);await shot('h'+(k+1)+'_a_door_from_deck',p[0],p[1],out,.05);
  p=R(t,1080);await shot('h'+(k+1)+'_b_in_doorway',p[0],p[1],out,0);
  p=R(t,1095);await shot('h'+(k+1)+'_c_inside_to_mouth',p[0],p[1],out,0);
  p=R(t,1190,-20);await shot('h'+(k+1)+'_d_inside_to_door',p[0],p[1],inn,.05);
  p=R(t,1150,25);await shot('h'+(k+1)+'_e_look_up',p[0],p[1],inn+.6,.75);
  const c=R(t,1140);await X(`window.__camOv=[HC.x+${c[0]},190,HC.z-1100+${c[1]},HC.x+${c[0]},0,HC.z-1100+${c[1]}+.01]`);await q.waitForTimeout(2500);await q.screenshot({path:TD+'/h'+(k+1)+'_f_overview.png'});await X("window.__camOv=null")}
if(!only||only==='h0'){for(const[n,x,z,yw,pt]of[['h0_a_sale1_close',-50,1136,P,-.1],['h0_b_sale2_close',-18,1142,P,-.1],['h0_c_own_ship',-50,1120,P*0,-.1],['h0_d_sale_row',0,1110,P,0],['h0_e_back_wall',0,1180,0,.1],['h0_f_look_up',0,1140,0,.8],['h0_g_mouth_out',0,1196,P,0]])await shot(n,x,z,yw,pt);
  await X(`window.__camOv=[HC.x,230,HC.z-1100+1140,HC.x,0,HC.z-1100+1140.01]`);await q.waitForTimeout(2500);await q.screenshot({path:TD+'/h0_h_overview.png'});await X("window.__camOv=null")}
console.log('errs',errs.slice(0,4));await b.close()})();
