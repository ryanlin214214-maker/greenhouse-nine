const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:720}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/user/greenhouse-nine/index.html');await p.waitForTimeout(500);
await p.click('#go');await p.keyboard.down('Space');
for(let i=0;i<50;i++){await p.keyboard.down('ArrowRight');await p.waitForTimeout(250);await p.keyboard.up('ArrowRight');
 await p.keyboard.press(['KeyG','KeyF','KeyX','KeyQ'][i%4]);await p.waitForTimeout(300);
 if(i==9)await p.screenshot({path:'play.png'});}
console.log(await p.evaluate(()=>[document.getElementById('wave').textContent,document.getElementById('score').textContent,document.getElementById('ovTitle').textContent,document.getElementById('overlay').hidden,document.getElementById('wname').textContent,document.getElementById('ammo').textContent].join('|')));
const m=await b.newPage({viewport:{width:390,height:780},hasTouch:true,isMobile:true});await m.goto('file:///home/user/greenhouse-nine/index.html');await m.waitForTimeout(400);
await m.tap('#go');await m.waitForTimeout(300);await m.tap('#stage');await m.waitForTimeout(3500);await m.tap('[data-act=gren]');await m.waitForTimeout(500);await m.screenshot({path:'phone.png'});
console.log('errs',errs);await b.close()})();
