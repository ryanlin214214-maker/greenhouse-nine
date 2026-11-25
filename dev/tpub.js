const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required']});
const errs=[],cons=[];const q=await b.newPage({viewport:{width:960,height:600}});q.setDefaultTimeout(600000);q.on('pageerror',e=>errs.push(e.message));q.on('console',m=>{if(m.type()==='error')cons.push(m.text().slice(0,200))});
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file:///home/user/greenhouse-nine/index.html',{timeout:240000});await q.waitForTimeout(6000);
const T=id=>q.evaluate(id=>{const e=document.getElementById(id);return e?e.textContent.trim().slice(0,60):null},id);
console.log('title screen',JSON.stringify({title:await q.title(),ov:await T('ovTitle'),go:await T('go')}));await q.screenshot({path:'pub_title.png'});
const r2=await q.evaluate(async()=>{const c=JSON.parse(document.getElementById('vclips').textContent);const ids=Object.keys(c);const out=[ids.length];for(const id of [ids[0],ids[Math.floor(ids.length/2)],ids[ids.length-1]]){const bin=Uint8Array.from(atob(c[id]),ch=>ch.charCodeAt(0));const ac=new OfflineAudioContext(1,44100,44100);try{const buf=await ac.decodeAudioData(bin.buffer);out.push([id,+buf.duration.toFixed(2)])}catch(e){out.push([id,'fail '+e])}}return out});
console.log('voice decode',JSON.stringify(r2));
// open Missions and start 3-1, like a player
const btns=await q.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent).map(b=>b.id+':'+b.textContent.trim().slice(0,24)));console.log('buttons',JSON.stringify(btns.slice(0,20)));
const mb=await q.$('#missBtn')||await q.$('text=Missions');if(mb){await mb.click();await q.waitForTimeout(1500)}
const items=await q.evaluate(()=>[...document.querySelectorAll('#missions button')].map(b=>b.textContent.trim().slice(0,30)));console.log('missions',items.length,JSON.stringify(items.slice(-7)));
const ok31=await q.evaluate(()=>{const b=[...document.querySelectorAll('#missions button')].find(b=>b.textContent.trim().startsWith('3-1'));if(b){b.click();return true}return false});
await q.waitForTimeout(12000);console.log('3-1 started',ok31,JSON.stringify({wave:await T('wave'),obj:await T('obj')}));await q.screenshot({path:'pub_31.png'});
console.log('errs',JSON.stringify(errs),'console errors',JSON.stringify(cons.slice(0,5)));await b.close()})();
