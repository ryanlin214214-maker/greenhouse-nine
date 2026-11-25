const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage({viewport:{width:640,height:400}});p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{const sp={log:[],active:[],lastCancel:0,silent:false,dropped:0};window.__sp=sp;
 window.SpeechSynthesisUtterance=function(t){this.text=t};
 Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[{name:'A',lang:'en-US'}],get speaking(){return sp.active.length>0},get pending(){return false},cancel(){sp.lastCancel=Date.now();sp.active.length=0},
  speak(u){if(sp.silent||Date.now()-sp.lastCancel<60){sp.dropped++;return}sp.log.push(u.text);sp.active.push(u);u.onstart&&u.onstart();setTimeout(()=>{const i=sp.active.indexOf(u);if(i>=0){sp.active.splice(i,1);u.onend&&u.onend()}},400)},onvoiceschanged:null}})});
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/examples/js/**',r=>{const f='node_modules/three/examples/js/'+r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'})});
await p.goto('file://'+process.cwd()+'/gtest/n.html',{timeout:90000});await p.waitForTimeout(7000);
await p.evaluate(()=>{window.__sp2('First line, still being read.','R')});console.log('t0',await p.evaluate(()=>window.__vdbg()),await p.evaluate(()=>window.__sp.active.length));await p.waitForTimeout(100);
await p.evaluate(()=>{window.__sp2('Second line interrupts the first.','R')});console.log('t100',await p.evaluate(()=>window.__vdbg()),await p.evaluate(()=>window.__sp.active.length));
for(let k=0;k<4;k++){await p.waitForTimeout(150);console.log('t+',(k+1)*150,await p.evaluate(()=>window.__vdbg()),JSON.stringify(await p.evaluate(()=>window.__sp.log)))}
await p.evaluate(()=>{window.__sp.silent=true});
for(let i=0;i<2;i++){await p.evaluate(i=>window.__sp2('Silent miss number '+i,'R'),i);console.log('sent',await p.evaluate(()=>window.__vdbg()));await p.waitForTimeout(4800);console.log('after',await p.evaluate(()=>window.__vdbg()))}
console.log('errs',errs);await b.close()})();
