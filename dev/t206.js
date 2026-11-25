// gun verification matrix: every gun, default + each allowed option on its own + one full kit; left, right, top three-quarter
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:1100,height:700}});q.setDefaultTimeout(240000);q.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+(process.argv[2]||'n94.html'),{timeout:240000});await q.waitForTimeout(9000);await q.evaluate(()=>document.getElementById('go').click());await q.waitForTimeout(1500);
const A=await q.evaluate(()=>window.__allow());const {A:AL,D:DF}=JSON.parse(A);
fs.mkdirSync('gv',{recursive:true});const list=[];
for(let k=0;k<8;k++){const cfgs=[['default',{}]];for(const kk of['s','b','m','u'])for(const v of AL[k][kk])if(v!==DF[k][kk])cfgs.push([kk+v,{[kk]:v}]);
  const full={};for(const kk of['s','b','m','u']){const o=AL[k][kk].filter(v=>v!==DF[k][kk]);if(o.length)full[kk]=o[o.length-1]}if(Object.keys(full).length>1)cfgs.push(['full',full]);
  for(const[n,m]of cfgs)for(const[vn,yaw,pitch]of[['L',Math.PI/2,0],['R',-Math.PI/2,0],['T',Math.PI/2,.75]]){const d=await q.evaluate(([k,m,y,p])=>window.__benchShot(k,m,y,p),[k,m,yaw,pitch]);
    const f='gv/g'+k+'_'+n+'_'+vn+'.png';fs.writeFileSync(f,Buffer.from(d.split(',')[1],'base64'));list.push(f)}
  console.log('gun',k,cfgs.length,'configs')}
fs.writeFileSync('gv/list.json',JSON.stringify(list));console.log('errs',errs.slice(0,5));await b.close()})();
