const {chromium}=require('playwright');const fs=require('fs');const page=process.argv[2],pre=process.argv[3];
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1000,height:640}});q.setDefaultTimeout(180000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+page,{timeout:180000});await q.waitForTimeout(9000);await q.evaluate(()=>document.getElementById('go').click());await q.waitForTimeout(1500);await q.evaluate(()=>window.__fx('setup'));
let L=[];try{L=JSON.parse(await q.evaluate(()=>window.__doorList?window.__doorList():'[]'))}catch(e){}
if(!L.length)L=JSON.parse(fs.readFileSync('doorlist.json','utf8'));else fs.writeFileSync('doorlist.json',JSON.stringify(L));console.log('doors',JSON.stringify(L));
const hide=()=>q.evaluate(()=>{for(const id of['hud','comms','cross','radar','overlay','cine','msg'])document.getElementById(id).hidden=true});
let i=0;for(const [c,dc] of L.slice(0,2)){const s=Math.sign(c);await q.evaluate(v=>{window.__camOv=v},[dc+3,1.7,c-s*9,dc,1.2,c+s*4]);await hide();await q.waitForTimeout(2500);await q.screenshot({path:pre+'_door'+(i++)+'.png',clip:{x:76,y:58,width:848,height:532}})}
console.log('errs',errs);await b.close()})();
