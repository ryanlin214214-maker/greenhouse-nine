const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:640,height:400}});p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{const sp={log:[],active:[],lastCancel:0,dropped:0,adv(dt){for(const a of sp.active.slice())if((a.rem-=dt)<=0){sp.active.splice(sp.active.indexOf(a),1);a.u.onend&&a.u.onend()}}};window.__sp=sp;window.SpeechSynthesisUtterance=function(t){this.text=t};
 Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[{name:'A',lang:'en-US'}],get speaking(){return sp.active.length>0},get pending(){return false},cancel(){sp.lastCancel=performance.now();sp.active.length=0},
  speak(u){if(performance.now()-sp.lastCancel<60){sp.dropped++;sp.log.push('DROPPED: '+u.text);return}sp.log.push(u.text);sp.active.push({u,rem:u.text.length*.06});u.onstart&&u.onstart()},onvoiceschanged:null}})});
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/n.html',{timeout:90000});await p.waitForTimeout(7000);await p.click('#go');await p.waitForTimeout(1000);
console.log(await p.evaluate(()=>window.__lore1()));console.log('errs',errs);await b.close()})();
