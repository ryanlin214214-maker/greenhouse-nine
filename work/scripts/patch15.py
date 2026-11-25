p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:80]); s=s.replace(a,b)
rep("addEventListener('keyup',e=>{keys[e.code]=false});","""addEventListener('keyup',e=>{keys[e.code]=false});
// game controller (PS5 DualSense, Xbox and other standard-layout pads)
let padFire=false,padOn=false;const padPrev=[];
addEventListener('gamepadconnected',()=>{padOn=true;if(state!=='menu')say('Controller connected',1.5)});
function padTick(dt){let gp=null;try{const l=navigator.getGamepads?navigator.getGamepads():[];for(const g of l)if(g&&g.connected){gp=g;break}}catch(e){}
  if(!gp){if(padOn){padOn=false;padFire=false;if(moveId===null)mvX=mvY=0}return}padOn=true;
  const dz=v=>Math.abs(v)<0.15?0:(v-Math.sign(v)*0.15)/0.85,ax=i=>dz(gp.axes[i]||0),btn=i=>!!(gp.buttons[i]&&(gp.buttons[i].pressed||gp.buttons[i].value>0.4));
  const now=[];for(let i=0;i<17;i++)now[i]=btn(i);const hit=i=>now[i]&&!padPrev[i];
  if(hit(9)){if(state==='playing')pause();else if(state==='paused')resume()}
  if(state!=='playing'){if(hit(0)&&!overlay.hidden){state==='paused'?resume():begin()}padFire=false;for(let i=0;i<17;i++)padPrev[i]=now[i];return}
  if(moveId===null){mvX=ax(0);mvY=ax(1)}
  const k=CFG.sens*dt;yaw-=ax(2)*3.2*k;pitch=Math.max(-1.45,Math.min(1.45,pitch-ax(3)*2.4*k*(CFG.inv?-1:1)));if(ax(2)||ax(3))camIdle=0;
  padFire=now[7];
  if(hit(0))jumpQ=true;if(hit(1))melee();if(hit(2))toggleVeh();if(hit(3))swap();if(hit(5)||hit(6))grenade();if(hit(11))melee();
  if((now[4]&&hit(5))||(now[5]&&hit(4))||hit(10)&&now[11])surge();
  for(let i=0;i<17;i++)padPrev[i]=now[i]}""")
rep("  if(firing&&fireCd<=0&&(weapon===1||!over))fire();","  if((firing||padFire)&&fireCd<=0&&(weapon===1||!over))fire();")
rep("sprintT=f>0.5&&!firing?sprintT+dt:0;","sprintT=f>0.5&&!firing&&!padFire?sprintT+dt:0;")
rep("  if(state==='playing'){update(dt);commsTick(dt)}","  padTick(dt);\n  if(state==='playing'){update(dt);commsTick(dt)}")
rep("arcSpin.rotation.z+=dt*(firing&&weapon===0","arcSpin.rotation.z+=dt*((firing||padFire)&&weapon===0")
rep("Phone: drag left to move, right to aim, buttons to fight","Controller: left stick move, right stick aim, R2 fire, ✕ jump, ○ melee, □ vehicle, △ swap, R1 or L2 grenade, L1+R1 surge, OPTIONS pause<br>Phone: drag left to move, right to aim, buttons to fight")
open(p,'w').write(s);print('ok')
