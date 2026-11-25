// cutscenes: foot contact and timing. For each shot with walkers: lowest foot point vs the floor under it, per frame;
// foot slide while planted; shot-change cost (ms spent in introTick on the first frame of each shot). argv: page
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:960,height:600}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(4000);
const X=c=>q.evaluate(c=>window.__x(c),c);
const r=await X(`(()=>{VOICE.on=false;const out=[];const run=(shots,label)=>{introStart(shots,()=>{},label);setState&&0;let i=-1;const stats={};const bb=new T.Box3();
  for(let f=0;f<3000&&INTRO.on;f++){const t0=performance.now();introTick(1/30);const ms=performance.now()-t0;time+=1/30;if(!INTRO.on)break;
   if(INTRO.i!==i){i=INTRO.i;stats[i]={first:+ms.toFixed(1),act:INTRO.shots[i].act||'',minGap:1e9,maxGap:-1e9,slide:0,frames:0}}
   const S=stats[i];for(const a of INTRO.actors){if(!a.rig||!a.rig.feet)continue;const F=a.rig.feet();if(!F.length)continue;const fl=groundAt(a.pos.x,a.pos.z,a.pos.y);
     F.forEach((p,li)=>{const gap=p.y-fl;S.minGap=Math.min(S.minGap,gap);S.maxGap=Math.max(S.maxGap,gap);const key='p'+li;if(a[key]&&gap<.04&&a[key].g<.04){S.sl=(S.sl||0)+Math.hypot(p.mid.x-a[key].x,p.mid.z-a[key].z);S.sn=(S.sn||0)+1/30;S.slide=S.sl/S.sn}a[key]={x:p.mid.x,z:p.mid.z,g:gap}})}S.frames++}
  for(const k in stats){const s=stats[k];out.push(label+' shot '+k+' '+s.act+' firstFrame '+s.first+'ms'+(s.minGap<1e8?' footGap '+s.minGap.toFixed(2)+'..'+s.maxGap.toFixed(2)+' m, planted-foot average slide '+s.slide.toFixed(2)+' m/s':''))}
  introEnd()};
 run(INTRO1,'intro');run(L2SHOTS,'L2');return out.join('\\n')})()`);
console.log(r);console.log('errs',errs.length,errs.slice(0,3));await b.close()})();
