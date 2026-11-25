const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
for(const [w,h,n] of [[400,860,'phone'],[1200,900,'desk']]){const q=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});q.on('pageerror',e=>errs.push(e.message));
await q.setContent('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+require('fs').readFileSync('report/index.html','utf8').replace(/src="img\//g,'src="file://'+process.cwd()+'/report/img/'),{waitUntil:'load'});
await q.waitForTimeout(1500);const ov=await q.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,H:document.documentElement.scrollHeight}));console.log(n,JSON.stringify(ov));
await q.screenshot({path:'report_'+n+'.png',fullPage:false});
if(n==='phone'){await q.evaluate(()=>document.getElementById('ships').scrollIntoView());await q.waitForTimeout(500);await q.screenshot({path:'report_phone_ships.png'})}}
console.log('errs',errs);await b.close()})();
