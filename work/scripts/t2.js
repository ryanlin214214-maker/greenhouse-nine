const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:720}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/user/greenhouse-nine/index.html');await p.waitForTimeout(500);
await p.click('#go');await p.keyboard.down('Space');
for(let i=0;i<40;i++){await p.keyboard.down('ArrowRight');await p.waitForTimeout(250);await p.keyboard.up('ArrowRight');await p.waitForTimeout(350);
 if(i==12)await p.screenshot({path:'play.png'});}
console.log(await p.evaluate(()=>[document.getElementById('wave').textContent,document.getElementById('score').textContent,document.getElementById('ovTitle').textContent,document.getElementById('overlay').hidden].join('|')));
const m=await b.newPage({viewport:{width:390,height:780}});await m.goto('file:///home/user/greenhouse-nine/index.html');await m.waitForTimeout(500);await m.screenshot({path:'phone.png'});
console.log('errs',errs);await b.close()})();
