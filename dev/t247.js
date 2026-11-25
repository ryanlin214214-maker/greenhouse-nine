const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1100,height:690}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));q.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text().slice(0,200))});
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/t108x.html',{timeout:240000});await q.waitForTimeout(5000);const X=c=>q.evaluate(c=>window.__x(c),c);
const R=(id,ok,t)=>console.log((ok?'PASS ':'FAIL ')+id+' '+t);
await q.click('#cdxBtn');await q.waitForTimeout(1500);
let r=JSON.parse(await X(`JSON.stringify([CDX.open,!$('codex').hidden,state,CODEX.length,!!CDX.r])`));R('Codex opens from the title bar',r[0]&&r[1],JSON.stringify(r));
const ids=JSON.parse(await X(`JSON.stringify(CODEX.map(q=>q.id).filter(i=>(process.env.ONLY?new RegExp(process.env.ONLY):/./).test(i)))`.replace('process.env.ONLY?new RegExp(process.env.ONLY):/./',process.env.ONLY?'/'+process.env.ONLY+'/':'/./')));const bad=[];
for(const id of ids){const v=JSON.parse(await X(`cdxShow('${id}');const q=CODEX.find(x=>x.id==='${id}');JSON.stringify([!!q.mdl,!!CDX.m,$('cdxNo').hidden,$('cdxText').textContent.length])`));if(v[0]&&!v[1])bad.push(id);await q.waitForTimeout(1300);await q.screenshot({path:'cdx/'+id+'.png'})}
R('every entry shows its model and text',!bad.length,ids.length+' entries; no model: '+(bad.join(',')||'none'));
await q.keyboard.press('KeyK');await q.waitForTimeout(500);r=JSON.parse(await X(`JSON.stringify([CDX.open,state])`));R('K closes it',!r[0],JSON.stringify(r));
r=JSON.parse(await X(`INTRO.on=false;startAt(1,2);for(let i=0;i<5;i++)update(1/30);const a=state;cdxOpen();const b=[state,CDX.open];cdxClose();JSON.stringify([a,...b,state])`));R('opening in play pauses, closing resumes',r[0]==='playing'&&r[1]==='paused'&&r[3]==='playing',JSON.stringify(r));
console.log('errs',errs.slice(0,8));await b.close()})();
