window.__tp=(x,y,z,a,b)=>{pos.set(x,y,z);yaw=a;pitch=b;vy=0};
window.__show=()=>{let i=0;for(const t of[0,1,2,5]){const e=mk(t,pos.x-4.5+i*3,pos.y+(t>=5?1:2),pos.z-6);e.spd=0;e.cd=999;enemies.push(e);i++}};
window.__boss=()=>{const b=enemies.find(e=>e.type===3);if(b){b.pos.set(0,9,118);pos.set(0,0,140);yaw=0;pitch=0.32;vy=0;return 1}return 0};
window.__gl=()=>{let i=0;for(const t of[5,6,7,8,9]){const e=mk(t,pos.x-6+i*3,pos.y+1.4,pos.z-7);e.spd=0;e.cd=999;e.bt=999;enemies.push(e);i++}};
window.__live=()=>{let i=0;for(const t of[5,6,7,8,9]){const a=i*1.256,e=mk(t,pos.x+Math.cos(a)*25,pos.y+2,pos.z+Math.sin(a)*25);e.x0=e.pos.x;e.z0=e.pos.z;enemies.push(e);i++}};
window.__hurtN=0;
window.__rep=()=>enemies.filter(e=>e.type>=5).map(e=>[e.type,isFinite(e.pos.x+e.pos.y+e.pos.z),Math.round(Math.hypot(e.pos.x-e.x0,e.pos.z-e.z0)),e.atkN,Math.round(Math.hypot(e.pos.x-pos.x,e.pos.z-pos.z))].join(':')).join(' ')+' hurt='+window.__hurtN;
window.__calls=()=>renderer.info.render.calls;window.__n=()=>enemies.length;window.__fire=v=>{firing=v};window.__w=w=>{weapon=w};
window.__kill=()=>{for(const e of enemies)e.dying=0.001;queue.length=0};
window.__gridCheck=()=>{const L=(o,d,max)=>{let best=max;for(const b of boxes){let t0=0,t1=best,ok=true;for(let a=0;a<3;a++){if(Math.abs(d[a])<1e-9){if(o[a]<b.lo[a]||o[a]>b.hi[a]){ok=false;break}}else{let n=(b.lo[a]-o[a])/d[a],f=(b.hi[a]-o[a])/d[a];if(n>f){const s=n;n=f;f=s}if(n>t0)t0=n;if(f<t1)t1=f;if(t0>t1){ok=false;break}}}if(ok)best=t0}if(d[1]<0){const t=-o[1]/d[1];if(t>=0&&t<best)best=t}return best};
 const IB=(x,y,z)=>{for(const b of boxes)if(x>b.lo[0]&&x<b.hi[0]&&y>b.lo[1]&&y<b.hi[1]&&z>b.lo[2]&&z<b.hi[2])return true;return false};let bad=0,badIn=0,hits=0,ins=0,t1=0,t2=0;
 for(let i=0;i<4000;i++){const o=[(Math.random()-.5)*2*A,Math.random()*25,(Math.random()-.5)*2*A];if(i%3===0){o[0]*=.15;o[2]*=.15}const d=[Math.random()-.5,Math.random()-.6,Math.random()-.5],l=Math.hypot(...d);d[0]/=l;d[1]/=l;d[2]/=l;const m=20+Math.random()*150;
  let q=performance.now();const a=rayBoxes(o,d,m);t1+=performance.now()-q;q=performance.now();const b=L(o,d,m);t2+=performance.now()-q;if(Math.abs(a-b)>1e-9)bad++;if(b<m)hits++;
  const x=o[0],y=Math.random()*6,z=o[2];const ia=inBox(x,y,z),ib=IB(x,y,z);if(ia!==ib)badIn++;if(ib)ins++}
 return 'boxes '+boxes.length+' ray mismatches '+bad+'/4000 (hits '+hits+') inBox mismatches '+badIn+' (inside '+ins+') grid ms '+t1.toFixed(1)+' linear ms '+t2.toFixed(1)};
window.__overlap=()=>{const bad=[];const chk=(n,x,y,z)=>{if(inBox(x,y+0.3,z)||inBox(x,y+1.2,z))bad.push(n+'@'+[x,y,z].map(v=>Math.round(v)).join(','))};
 chk('start',0,0,15);for(const s of SITES)chk(s.n,s.x,s.y,s.z);for(const c of CORE_SPOTS)chk('core',c[0],c[1],c[2]);for(const q of PADS)chk('pad',q.x,q.y,q.z);for(const v of vehs)chk('veh-'+v.kind,v.home[0],0,v.home[1]);
 return 'A='+A+' boxes='+boxes.length+' bad: '+(bad.join(' | ')||'none')};
window.__tact=()=>{for(const e of enemies)e.dying=0.001;queue.length=0;pos.set(0,0,95);yaw=Math.PI;pitch=0;vy=0;window.__tr=[];
 for(let i=0;i<4;i++){const e=mk(i%2?8:5,-20+i*13,2,55);enemies.push(e);window.__tr.push(e)}
 const j=mk(5,72,2,72);enemies.push(j);window.__jt=j;window.__seen=0;window.__hid=0};
window.__tactRep=()=>{let s='';for(const e of window.__tr){const v=los(e.pos,eye);if(v)window.__seen++;else window.__hid++;s+=[e.type,e.st||'adv',e.atkN,e.pos.y.toFixed(1),v?'V':'H'].join(':')+' '}return s+' seen/hidden '+window.__seen+'/'+window.__hid+' covers '+(COVER?COVER.length:0)+' | jet trooper y='+window.__jt.pos.y.toFixed(1)+' hd='+Math.hypot(window.__jt.pos.x-60,window.__jt.pos.z-60).toFixed(1)};
window.__onRoof=()=>{pos.set(60,8.8,60);vy=0;yaw=0;pitch=0};
window.__killAll=()=>{for(const e of enemies)if(e.type!==3)damage(e,1e9);queue.length=0};
window.__killBoss=()=>{const b=enemies.find(e=>e.type===3&&!e.dying);if(b){b.vuln=1;damage(b,1e9);return 1}return 0};
window.__st2=()=>document.getElementById('wave').textContent+' | '+document.getElementById('objT').textContent+' | n='+enemies.filter(e=>!e.dying).length+' | comm='+document.getElementById('commText').textContent.slice(0,50);
window.__conn=()=>{if(!NAV)navBuild();const seen=new Uint8Array(NX*NZ),q=[navCell(0,24)];seen[q[0]]=1;for(let h=0;h<q.length;h++){const k=q[h],i=k%NX;for(const n of[i>0?k-1:-1,i<NX-1?k+1:-1,k-NX,k+NX])if(n>=0&&n<NX*NZ&&NAV[n]&&!seen[n]){seen[n]=1;q.push(n)}}
 const out=[];for(const r of ROOMS){let tot=0,ok=0;for(const s of spawnPts())if(s.r===r){tot++;if(seen[navCell(s.x,s.z)])ok++}out.push(r.n+' '+ok+'/'+tot)}
 for(const v of vehs)out.push('veh '+v.kind+(seen[navCell(v.home[0],v.home[1])]?' ok':' BLOCKED'));return 'walkable '+q.length+' | '+out.join(', ')};
window.__navTest=()=>{for(const e of enemies)e.dying=0.001;queue.length=0;pos.set(0,0,24);yaw=0;vy=0;window.__nt=[];for(const[t,x,z,y]of[[5,0,-230,1.5],[6,-20,-235,1.5],[7,60,120,1.5],[0,-60,130,5]]){const e=mk(t,x,y,z);enemies.push(e);window.__nt.push(e)}};
window.__navRep=()=>window.__nt.map(e=>e.type+':'+(isFinite(e.pos.x+e.pos.z)?Math.round(Math.hypot(e.pos.x-pos.x,e.pos.z-pos.z)):'NaN')+(e.dying?'(dead)':'')).join(' ');
window.__contain=()=>{let bad=0;for(const e of enemies){if(e.dying||e.type===3||e.type===4)continue;if(!roomAt(e.pos.x,e.pos.z)&&inHull(e.pos.x,e.pos.z))bad++;if(!inHull(e.pos.x,e.pos.z))bad+=100}return bad};
window.__pin=()=>{pos.set(0,0,24);vy=0};
window.__ragBase=()=>{for(const e of enemies)e.dying=0.001;queue.length=0;pos.set(0,0,24);yaw=0;vy=0;return{scene:scene.children.length,bodies:PW?PW.bodies.length:0,cons:PW?PW.constraints.length:0}};
window.__rag=()=>{window.__dp=[];const T0=[5,6,7,8,9,0,1,2,5,6,7,8];T0.forEach((t,i)=>{const x=-25+i*4.5,z=10,e=mk(t,x,t<5?4:1.2,z);enemies.push(e)});
  setTimeout(()=>{},0);return 'spawned'};
window.__ragKill=()=>{let n=0;for(const e of enemies)if(!e.dying&&e.type!==3&&e.type!==4){window.__dp.push([e.pos.x,e.pos.z]);damage(e,1e9);n++}return n};
window.__ragRep=()=>{let fin=true,maxY=-99,maxD=0;for(const C of CORPSES)for(const q of C.parts){const p=q.obj.position;if(!isFinite(p.x+p.y+p.z))fin=false;maxY=Math.max(maxY,p.y);
   let md=1e9;for(const d of window.__dp)md=Math.min(md,Math.hypot(p.x-d[0],p.z-d[1]));maxD=Math.max(maxD,md)}
  return 'corpses='+CORPSES.length+' bodies='+(PW?PW.bodies.length:-1)+' cons='+(PW?PW.constraints.length:-1)+' scene='+scene.children.length+' finite='+fin+' maxY='+maxY.toFixed(2)+' maxDistFromDeath='+maxD.toFixed(1)+' CANNON='+!!window.CANNON};
window.__ct=()=>CORPSES.map(c=>c.t.toFixed(1)).join(',')+' state='+state+' time='+time.toFixed(1);
window.__live2=()=>{for(const e of enemies)e.dying=0.001;queue.length=0;pos.set(0,0,24);yaw=0;vy=0;window.__l2=[];[10,11,12,10,12].forEach((t,i)=>{const e=mk(t,-20+i*10,1.5,-5);e.x0=e.pos.x;e.z0=e.pos.z;enemies.push(e);window.__l2.push(e)});window.__hurtN=0};
window.__rep2=()=>window.__l2.map(e=>[e.type,isFinite(e.pos.x+e.pos.y+e.pos.z),Math.round(Math.hypot(e.pos.x-e.x0,e.pos.z-e.z0)),e.atkN,e.dying?'dead':'live',e.rig?'rig':'NORIG'].join(':')).join(' ')+' hurt='+window.__hurtN+' shots='+shots.length+' corpses='+CORPSES.length;
window.__shieldTest=()=>{const e=window.__l2.find(q=>q.type===10&&!q.dying);if(!e)return'none';const h0=e.hp;e.burst=0;damage(e,1,0);const h1=e.hp;damage(e,1,2);return 'shield gun dmg '+(h0-h1).toFixed(2)+' grenade dmg '+(h1-e.hp).toFixed(2)};
window.__bossK=k=>{mission=null;gap=999;for(const e of enemies)e.dying=0.001;queue.length=0;pos.set(0,0,24);yaw=Math.PI;pitch=0.25;vy=0;wave=3;const b=mkBoss(k);b.pos.set(0,b.baseY||10,-6);window.__B=b;window.__sl=0;return k};
window.__bossRep=()=>{const b=window.__B,H=b.hall;return [b.kind,isFinite(b.pos.x+b.pos.y+b.pos.z),'y='+b.pos.y.toFixed(1),'inHall='+(b.pos.x>=H.x0&&b.pos.x<=H.x1&&b.pos.z>=H.z0&&b.pos.z<=H.z1),'pods='+b.pods.length,'vuln='+b.vuln.toFixed(1),'hp='+Math.round(b.hp),'slams='+slams.length,'shots='+shots.length,'rig='+!!b.rig,'hurt='+window.__hurtN,'dead='+!!b.dying].join(' ')};
window.__bossBreak=()=>{const b=window.__B;for(const q of b.pods.slice())damage(q,1e9);return 'vuln '+b.vuln.toFixed(1)};
window.__bossKill=()=>{const b=window.__B;b.vuln=1;damage(b,1e9);return !!b.dying};
window.__dw=()=>{const out=[];for(const e of enemies){if(e.type>2||e.dying)continue;const p=e.pos,r=roomAt(p.x,p.z);let vis=true;e.g.traverseAncestors(a=>{if(!a.visible)vis=false});
  const inS=e.g.parent===scene;const ins=inBox(p.x,p.y,p.z);const flags=[];if(!isFinite(p.x+p.y+p.z))flags.push('NaN');if(!inS)flags.push('NOTINSCENE');if(!vis)flags.push('HIDDEN');if(ins)flags.push('INSIDEBOX');if(!r)flags.push('NOROOM');if(r&&p.y>r.h)flags.push('ABOVECEIL');if(p.y<0)flags.push('BELOWFLOOR');if(e.g.scale.x<0.5)flags.push('SHRUNK');
  if(flags.length)out.push(e.type+'@'+[p.x,p.y,p.z].map(v=>v.toFixed(1)).join(',')+' '+(r?r.n:'-')+' '+flags.join('|'))}return out.join(' ; ')||'ok'};
window.__stage=n=>{wave=n-1;mission=null;gap=0.01};
window.__wallPush=()=>{const res=[];for(const[t,x,y,z]of[[0,-30,5,-40.3],[0,60,5,40.2],[1,-10.2,5,-100],[5,30,1.2,-40.4],[2,-60,6,150.5]]){const e=mk(t,x,y,z);e.spd=0;e.cd=999;enemies.push(e);pushOut(e.pos,e.r);const r=roomAt(e.pos.x,e.pos.z);res.push(t+'->'+[e.pos.x,e.pos.y,e.pos.z].map(v=>v.toFixed(1)).join(',')+' '+(r?r.n+' h'+r.h:'NOROOM')+(r&&e.pos.y>r.h?' ABOVECEIL':''))}return res.join(' ; ')};
window.__wp=k=>{const sl=WPN[k].slot;guns[sl]=mkGun(k);weapon=sl;reloadT=0;grenCd=0;meleeCd=0;fireCd=0;return WPN[k].name};
window.__ring=()=>{for(const e of enemies)e.dying=0.001;queue.length=0;pos.set(0,0,24);yaw=0;pitch=0;vy=0;for(let i=0;i<6;i++){const t=[5,6,0,7,10,1][i],e=mk(t,-8+i*3.2,t<5?4:1.4,15);e.spd=0;e.cd=999;e.bt=999;enemies.push(e)}};
window.__wst=()=>{const G=guns[weapon],W=WPN[G.k];return W.short+' mag='+G.mag+' res='+G.res+' reload='+reloadT.toFixed(2)+' heat='+heat.toFixed(0)+' gren='+grenades.length+' fires='+fires.length+' wells='+wells.length+' rings='+rings.length+' camFx='+camFx.length+' alive='+enemies.filter(e=>!e.dying).length+' score='+score+' swordT='+swordT.toFixed(2)+' dashT='+dashT.toFixed(2)+' hud='+document.getElementById('ammo').textContent+'|'+document.getElementById('cG').firstChild.nodeValue+'|'+document.getElementById('cM').firstChild.nodeValue};
window.__gb=K=>{try{const p=new T.Vector3(0,.2,15);grenBoom(K,p,1);return K+': fires='+fires.length+' wells='+wells.length+' gren='+grenades.length+' fxq='+fxq.length+' slowed='+enemies.filter(e=>e.slowT>0).length}catch(err){return K+' ERR '+err.message}};
window.__sup=K=>{SUPK=K;superQ=100;superT=0;cineT=0;surge();return 'cine='+cineT.toFixed(2)};
window.__supSt=()=>'cineT='+cineT.toFixed(2)+' superT='+superT.toFixed(1)+' kind='+superKind+' waves='+waves.length+' bolts='+bolts.length+' alive='+enemies.filter(e=>!e.dying).length+' slowed='+enemies.filter(e=>e.slowT>0&&!e.dying).length+' hp='+Math.round(hp)+' chipS='+document.getElementById('cS').firstChild.nodeValue;
window.__clearStage=()=>{for(const e of enemies)if(!e.dying)damage(e,1e9);queue.length=0;if(mission){mission.bossDue=false}};
window.__saveSt=()=>JSON.stringify(SAVE)+' | cont hidden='+document.getElementById('cont').hidden+' text='+document.getElementById('cont').textContent+' note='+document.getElementById('saveNote').textContent;
window.__dbg=()=>{try{SUPK=0;superQ=100;const st=state,v=!!veh,c=cineT,sT=superT;surge();return 'state='+st+' veh='+v+' cineBefore='+c+' superTBefore='+sT+' -> cineT='+cineT+' superQ='+superQ}catch(e){return 'THROW '+e.message+' '+e.stack.split('\n')[1]}};
window.__gs=()=>document.getElementById('wave').textContent+' '+document.getElementById('objT').textContent+' guns='+guns.map(g=>g.name).join(',')+' score='+score+' cls='+cls+' super='+SUPK;
window.__chain=()=>'t='+time.toFixed(1)+' weapon='+WPN[weapon].short+' grenCD='+grenCdK.filter(v=>v>0).length+' meleeCD='+meleeCdK.filter(v=>v>0).length+' supCD='+supCd.filter(v=>v>0).length+' supActive='+supT.filter(v=>v>0).length+' cine='+cineT.toFixed(2)+' gren='+grenades.length+' fires='+fires.length+' wells='+wells.length+' rings='+rings.length+' camFx='+camFx.length+' waves='+waves.length+' bolts='+bolts.length+' scene='+scene.children.length+' alive='+enemies.filter(e=>!e.dying).length+' score='+score;
window.__ringBig=()=>{for(const e of enemies)e.dying=0.001;queue.length=0;pos.set(0,0,24);yaw=0;pitch=0;vy=0;for(let i=0;i<14;i++){const a=i/14*6.283,t=[5,6,7,0,1,10,12][i%7],e=mk(t,Math.cos(a)*9,t<5?4:1.4,24+Math.sin(a)*9);e.spd=0;e.cd=999;e.bt=999;e.hp*=40;enemies.push(e)}};
window.__time=()=>time;
window.__empty=()=>{const G=guns[2];G.mag=0;G.res=0;weapon=2;const s0=G.mag;fireCd=0;fire();return 'rifle empty: mag='+G.mag+' res='+G.res+' still carried='+(guns.length===6)+' selected='+WPN[weapon].short};
window.__wheel=()=>{openWheel();const o1=wheelOpen;wheelAim(0,-120);const s1=wheelSel;wheelAim(0,120);wheelAim(110,-60);const s2=wheelSel;wx=wy=0;wheelAim(0,-50);const s3=wheelSel;closeWheel(true);return 'open='+o1+' up-outer sel='+s1+' right-upper sel='+s2+' inner-top sel='+s3+' -> weapon now '+WPN[weapon].short+' supActiveOrCine='+(cineT>0||supT.some(v=>v>0))};
window.__v1=()=>{const v=validSave({v:1,t:1,wave:3,cls:1,score:900,sup:1,guns:[{k:0,rar:2,pow:4},{k:4,rar:1,pow:3}]});return JSON.stringify(v)};
window.__wopen=v=>{if(v)openWheel();else closeWheel(false)};
window.__ragW=()=>{let sl=0,n=0,maxV=0,rise=0;for(const C of CORPSES){for(const q of C.parts){n++;if(q.b.sleepState===2)sl++;maxV=Math.max(maxV,q.b.velocity.length());rise=Math.max(rise,q.b.position.y-(C.h0+1.5))}}return 'parts='+n+' sleeping='+sl+' maxSpeed='+maxV.toFixed(2)+' maxRiseAboveDeath='+rise.toFixed(2)+' cons='+(PW?PW.constraints.length:0)};
window.__stairWalk=()=>{pos.set(-103,0,-95);yaw=Math.PI;pitch=0;vy=0;return 'start y='+pos.y.toFixed(2)};
window.__py=()=>'pos='+[pos.x,pos.y,pos.z].map(v=>v.toFixed(1)).join(',');
window.__skiffOut=()=>{const v=vehs.find(q=>q.kind==='plane');pos.set(v.pos.x,0,v.pos.z-3);toggleVeh();return 'in='+!!veh};
window.__vst=()=>veh?('veh '+veh.kind+' pos='+[veh.pos.x,veh.pos.y,veh.pos.z].map(q=>q.toFixed(0)).join(',')+' v='+veh.v.toFixed(1)):'no veh';
window.__skiffMid=()=>{const v=vehs.find(q=>q.kind==='plane');v.pos.set(0,1.5,225);v.h=Math.PI;pos.set(0,0,222);toggleVeh();return 'in='+!!veh};
window.__stairList=()=>STAIRS.map((S,i)=>i+' '+S.name+' | rise '+(S.yTop-S.yBase).toFixed(1)+' m, run '+S.run.toFixed(1)+' m, '+S.pieces.filter(p=>p.t).length+' treads, '+S.pieces.filter(p=>!p.t).length+' landings'+(S.bad&&S.bad.length?' | CHECK: '+S.bad.join('; '):' | check ok')).join('\n')+'\nLOG:'+STAIRLOG.length;
window.__walkStair=(i,down)=>{const S=STAIRS[i];for(const e of enemies)e.dying=0.001;queue.length=0;mission=null;gap=1e9;
  const ux=down?-S.ux:S.ux,uz=down?-S.uz:S.uz,sv0=down?S.run+2.5:-2;pos.set(S.fx+S.ux*sv0,down?S.yTop:S.yBase,S.fz+S.uz*sv0);vy=0;yaw=Math.atan2(-ux,-uz);pitch=0;
  keys.KeyW=true;let prev=pos.y,maxJump=0,ok=false,minY=1e9,maxY=-1e9;
  for(let k=0;k<2000;k++){update(1/60);const sv=(pos.x-S.fx)*S.ux+(pos.z-S.fz)*S.uz,lat=-(pos.x-S.fx)*S.uz+(pos.z-S.fz)*S.ux;maxJump=Math.max(maxJump,Math.abs(pos.y-prev));prev=pos.y;minY=Math.min(minY,pos.y);maxY=Math.max(maxY,pos.y);
    if(down?sv<=-2:sv>=S.run+2){ok=true;break}}
  keys.KeyW=false;const want=down?S.yBase:S.yTop,pass=ok&&Math.abs(pos.y-want)<.12&&maxJump<.4;
  return (pass?'PASS ':'FAIL ')+S.name+(down?' (down)':' (up)')+': ended at y '+pos.y.toFixed(2)+' (want '+want.toFixed(2)+'), biggest single-frame change '+maxJump.toFixed(2)+' m'+(ok?'':' DID NOT REACH THE END')};
window.__nStairs=()=>STAIRS.length;
window.__stairCams=()=>STAIRS.map(S=>{const mid=S.run/2,cx=S.fx+S.ux*mid,cz=S.fz+S.uz*mid,cy=(S.yBase+S.yTop)/2,lx=-S.uz,lz=S.ux,d=Math.max(9,S.run*.75);return{name:S.name,side:[cx+lx*d,cy+2,cz+lz*d,cx,cy,cz],foot:[S.fx-S.ux*5+lx*1.5,S.yBase+1.6,S.fz-S.uz*5+lz*1.5,S.fx+S.ux*S.run,S.yTop+.5,S.fz+S.uz*S.run]}});
window.__upTest=()=>{for(const e of enemies)e.dying=0.001;queue.length=0;mission=null;gap=1e9;window.__ut=[];window.__pinAt=[-20,15,30];
  for(const[t,x,z,y]of[[5,80,0,1.5],[7,75,10,1.5],[6,70,-10,1.6],[0,85,5,5],[1,-80,0,5],[10,-70,8,1.5]]){const e=mk(t,x,y,z);e.hp*=50;enemies.push(e);window.__ut.push(e)}};
window.__pinL=()=>{const q=window.__pinAt;pos.set(q[0],q[1],q[2]);vy=0};
window.__upRep=()=>window.__ut.map(e=>e.type+':'+(isFinite(e.pos.x+e.pos.y+e.pos.z)?'y'+e.pos.y.toFixed(1)+' d'+Math.round(Math.hypot(e.pos.x-pos.x,e.pos.z-pos.z))+(e.rise?' RISING':''):'NaN')).join(' | ')+' hurt='+window.__hurtN;
window.__padTest=(x,y,z)=>{for(const e of enemies)e.dying=0.001;queue.length=0;mission=null;gap=1e9;pos.set(x,y,z);vy=0;let top=y;for(let k=0;k<200;k++){update(1/60);top=Math.max(top,pos.y)}return 'pad at '+[x,y,z]+' -> apex '+top.toFixed(1)+' m'};
window.__sim=(sec)=>{const n=Math.round(sec*30);for(let k=0;k<n;k++){window.__pinL();update(1/30);time+=1/30}return window.__upRep()};
window.__setPin=(x,y,z)=>{window.__pinAt=[x,y,z]};
window.__stage2=()=>{for(const e of enemies)e.dying=0.001;queue.length=0;wave=1;mission=null;gap=.01;bossN=0;pos.set(0,0,24);vy=0;window.__pinAt=[0,0,24];return 1};
window.__s2=(sec)=>{const n=Math.round(sec*30);let out=0,ceil=0;for(let k=0;k<n;k++){window.__pinL();update(1/30);time+=1/30;for(const e of enemies){if(e.dying||e.type===3||e.type===4)continue;const r=roomAt(e.pos.x,e.pos.z);if(!r)out++;}}
  const b=enemies.find(e=>e.type===3&&!e.dying);return document.getElementById('wave').textContent+' | '+document.getElementById('objT').textContent+' | alive '+enemies.filter(e=>!e.dying).length+' | boss '+(b?b.kind+' at '+[b.pos.x,b.pos.y,b.pos.z].map(v=>v.toFixed(0)).join(','):'-')+' | outside-room samples '+out+' | hurt '+window.__hurtN};

window.__spineTest=(pz)=>{for(const e of enemies)e.dying=0.001;queue.length=0;mission=null;gap=1e9;window.__ut=[];window.__pinAt=[0,0,pz];window.__hurtN=0;const s=pz<0?-1:1;for(const[t,x,y,z]of[[0,0,2,pz-50*s],[5,2,1.5,pz-52*s],[6,-2,1.5,pz-50*s],[1,0,2,pz+40*s],[8,3,1.5,pz+42*s],[5,-60*s,1.5,pz],[9,0,1.5,pz+45*s],[10,60,1.5,pz]]){const e=mk(t,x,y,z);enemies.push(e);window.__ut.push(e)}return 1};
window.__spRep=()=>window.__upRep()+' | maxY in spine='+Math.max(...window.__ut.filter(e=>Math.abs(e.pos.x)<9).map(e=>e.pos.y),0).toFixed(1);
window.__nStairs=window.__nStairs||(()=>STAIRS.length);

window.__spineTest2=(pz)=>{for(const e of enemies)e.dying=0.001;queue.length=0;mission=null;gap=1e9;window.__ut=[];window.__pinAt=[0,0,pz];window.__hurtN=0;const s=pz<0?-1:1;for(const[t,x,y,z]of[[2,0,2,pz-45*s],[7,2,1.5,pz-48*s],[11,-2,1.5,pz-46*s],[12,0,1.5,pz+40*s],[2,0,2,pz+30*s],[7,-3,1.5,pz+44*s]]){const e=mk(t,x,y,z);enemies.push(e);window.__ut.push(e)}return 1};
window.__jumpSim=(sec)=>{const n=Math.round(sec*30);let jumps=0,maxY=0;for(let k=0;k<n;k++){window.__pinL();const pv=window.__ut.map(e=>[e.pos.x,e.pos.y,e.pos.z]);update(1/30);time+=1/30;window.__ut.forEach((e,i)=>{if(e.dying)return;if(Math.hypot(e.pos.x-pv[i][0],e.pos.y-pv[i][1],e.pos.z-pv[i][2])>4)jumps++;if(Math.abs(e.pos.x)<9)maxY=Math.max(maxY,e.pos.y)})}return window.__upRep()+' | jumps='+jumps+' maxY='+maxY.toFixed(1)};

window.__jumpLog=(sec)=>{const n=Math.round(sec*30),out=[];for(let k=0;k<n;k++){window.__pinL();const pv=window.__ut.map(e=>[e.pos.x,e.pos.y,e.pos.z]);update(1/30);time+=1/30;window.__ut.forEach((e,i)=>{if(e.dying)return;if(Math.hypot(e.pos.x-pv[i][0],e.pos.y-pv[i][1],e.pos.z-pv[i][2])>4)out.push('t'+e.type+' step'+k+' '+pv[i].map(v=>v.toFixed(1))+' -> '+[e.pos.x,e.pos.y,e.pos.z].map(v=>v.toFixed(1)))})}return out.join(' ; ')};

window.__habTest=()=>{for(const e of enemies)e.dying=0.001;queue.length=0;mission=null;gap=1e9;window.__ut=[];window.__pinAt=[-78,0,65];window.__hurtN=0;for(const[t,x,y,z]of[[5,-21,1.5,108],[6,-97,1.5,108],[9,-40,1.5,141],[0,-59.5,2,140],[10,0,1.5,95],[8,-97,1.5,82],[5,-40,1.5,49],[7,-97,1.5,45]]){const e=mk(t,x,y,z);enemies.push(e);window.__ut.push(e)}let o='';for(let i=0;i<4;i++)o=window.__sim(10);return o};

window.__navRow=(x,z0,z1)=>{if(!NAV)navBuild();let o='';for(let z=z0;z<=z1;z+=2.5){const c=navCell(x,z);o+=(-AZ+(((c/NX)|0)+.5)*NC).toFixed(2)+':'+NAV[c]+' '}return o};window.__navCol=(z,x0,x1)=>{if(!NAV)navBuild();let o='';for(let x=x0;x<=x1;x+=2.5){const c=navCell(x,z);o+=(-AX+((c%NX)+.5)*NC).toFixed(2)+':'+NAV[c]+' '}return o};

window.__lt=()=>{for(let i=0;i<90;i++)lightTick(.05)};
window.__introAt=t=>{INTRO.t=t;introTick(0);window.__lt();return INTRO.i+' '+document.getElementById('cineText').textContent.slice(0,40)};
window.__ist=()=>'intro='+INTRO.on+' state='+state+' cine.hidden='+document.getElementById('cine').hidden+' hud.hidden='+document.getElementById('hud').hidden+' comms='+COMMS.length+' wave='+wave+' mission='+(mission?mission.C?mission.C.name:'endless':'none');
window.__skip=()=>{introEnd();return window.__ist()};
window.__step=(sec)=>{const n=Math.round(sec*30);for(let k=0;k<n&&state==='playing';k++){update(1/30);time+=1/30}};
window.__camp=()=>{const out=[];introEnd();pos.set(0,0,24);for(let st=1;st<=5;st++){let g=0;while(!mission&&state==='playing'&&g++<600){update(1/30);time+=1/30;commsTick(1/30)}if(!mission){out.push('no mission, state='+state);break}
  const m=mission,rooms=m.rooms,bad=queue.filter(q=>{const r=roomAt(q.x,q.z);return rooms&&!(r&&rooms.includes(r.n))}).length,types=[...new Set(queue.map(q=>q.type))].sort((a,b)=>a-b).join(',');
  let line='stage '+wave+' '+(m.C?m.C.name:'endless')+' | queued '+queue.length+' types '+types+' | spawns outside stage rooms '+bad+' | obj "'+document.getElementById('objT').textContent+'"';
  window.__step(3);line+=' -> "'+document.getElementById('objT').textContent+'" beacon='+beacon.visible;
  if(m.bossDue){for(const e of enemies)if(!e.dying&&e.type!==3&&e.type!==4)damage(e,1e9);queue.length=Math.min(queue.length,1);let k=0;while(!m.boss&&k++<3000){update(1/30);time+=1/30;commsTick(1/30)}
    const b=m.boss;line+=' | boss '+(b?b.kind+' in '+((roomAt(b.pos.x,b.pos.z)||{}).n):'NONE');let q=0;while(mission===m&&q++<6000){for(const e of enemies)if(!e.dying){if(e.type===3)e.vuln=1;damage(e,1e9)}queue.length=0;update(1/30);time+=1/30;commsTick(1/30)}}
  else{let q=0;while(mission===m&&q++<6000){for(const e of enemies)if(!e.dying)damage(e,1e9);queue.length=0;update(1/30);time+=1/30;commsTick(1/30)}}
  line+=' | cleared='+(mission!==m)+' endT='+endT.toFixed(0)+' gap='+(gap>1e6?'held':gap.toFixed(1));out.push(line);
  if(LC&&LC.ph==='go'){const o0=document.getElementById('objT').textContent;lcoreHit(999);let w=0;while(endT<=0&&w++<900){update(1/30);time+=1/30;commsTick(1/30)}out[out.length-1]+=' | core objective "'+o0+'" -> destroyed, endT='+endT.toFixed(0)}
  if(endT>0){let w=0;while(state==='playing'&&w++<2400){update(1/30);time+=1/30;commsTick(1/30);commsTick(1/30)}out.push('ending after '+(w/30).toFixed(0)+' s of dialogue and holds: ');out.push('after 17 s: state='+state+' title="'+document.getElementById('ovTitle').textContent+'" button="'+document.getElementById('go').textContent+'" save='+JSON.stringify(SAVE).slice(0,60));resume()}}
  return out.join('\n')};

window.__pz=()=>{pause();return window.__ist()};window.__rs=()=>{resume();return window.__ist()};window.__cont=()=>{pause();continueGame();return window.__ist()+' | '+document.getElementById('cont').textContent};window.__vs=()=>JSON.stringify(validSave({v:2,t:1,wave:9,cls:1,score:5,guns:[0,1,2,3,4,5].map(k=>({k,rar:0,pow:1}))})).slice(0,70);window.__dieNew=()=>{die();begin();return window.__ist()};

window.__idle=(stage)=>{introEnd();if(stage>1){wave=stage-1;mission=null;gap=.01}pos.set(0,0,24);const log=[];let t=0;while(state==='playing'&&t<240){update(1/30);time+=1/30;t+=1/30;if(Math.abs(t%20)<1/30)log.push(Math.round(t)+'s hp'+Math.round(hp)+' sh'+Math.round(shield)+' left'+alive())}return 'stage '+stage+': '+(state==='dead'?'died at '+t.toFixed(0)+' s':'alive after '+t.toFixed(0)+' s')+' | '+log.join(' ')};

window.__mus=()=>'ac='+(ac&&ac.state)+' mood='+MUS.mood+' bar='+MUS.bar+' step='+MUS.step+' gain='+(MUS.g?MUS.g.gain.value.toFixed(2):'-')+' layers='+Object.keys(MUS.L).map(k=>k+':'+MUS.L[k].gain.value.toFixed(2)).join(',');window.__acts=()=>INTRO.actors.length+' actors, rigs alive '+INTRO.actors.filter(a=>a.rig).length;

window.__vrun=()=>{const S=INTRO.shots,total=S.reduce((a,q)=>a+q.d,0);let el=0,holdSteps=0,k=0;INTRO.grace=0;while(INTRO.on&&k++<6000){const before=INTRO.t;introTick(1/30);window.__sp.adv(1/30);el+=1/30;if(INTRO.t===before)holdSteps++}
  return 'intro over='+!INTRO.on+' planned '+total.toFixed(1)+' s, took '+el.toFixed(1)+' s, held '+(holdSteps/30).toFixed(1)+' s | spoken: '+window.__sp.log.map(x=>x.k+':'+x.text.slice(0,18)).join(' / ')+' | voices used: '+[...new Set(window.__sp.log.map(x=>x.voice))].join(',')+' | pitches '+[...new Set(window.__sp.log.map(x=>x.pitch))].join(',')};
window.__crun=()=>{window.__sp.log.length=0;comm('R','Rowan line one is here.');comm('L','Lattice says something very long and slow, so it takes a while to finish saying it.');comm('G','LOG 0001 · test log.');let k=0,order=[],maxConc=0;while((COMMS.length||commCur)&&k++<6000){commsTick(1/30);window.__sp.adv(1/30);maxConc=Math.max(maxConc,window.__sp.active.length)}
  return 'comms done after '+(k/30).toFixed(1)+' s | spoken '+window.__sp.log.map(x=>x.k+':'+x.text.slice(0,12)).join(' / ')+' | max overlapping '+maxConc};
window.__vstop=()=>{window.__sp.log.length=0;speak('A long line that will be cut off by a skip.','R');const a=window.__sp.active.length;voiceStop();return 'active before stop '+a+', after '+window.__sp.active.length+', busy '+VOICE.busy};
window.__vtoggle=()=>{VOICE.on=false;window.__sp.log.length=0;comm('R','Silent test line.');let k=0;while((COMMS.length||commCur)&&k++<600){commsTick(1/30)}const r='voice off: spoken '+window.__sp.log.length+' lines, comm finished in '+(k/30).toFixed(1)+' s';VOICE.on=true;return r};

window.__skipTest=()=>{reset();introStart();INTRO.grace=0;window.__sp.log.length=0;for(let i=0;i<150;i++){introTick(1/30);window.__sp.adv(1/30)}const a=window.__sp.active.length;introEnd();return 'speaking '+a+' during cutscene -> '+window.__sp.active.length+' queued after skip (the opening radio line) | intro on='+INTRO.on};

window.__vdead=()=>{reset();introStart();INTRO.grace=0;let k=0,el=0;const t0=performance.now();while(INTRO.on&&k++<9000){introTick(1/30);window.__sp.adv(1/30);window.__sp.tick(1/30);el+=1/30}return 'silent engine: intro took '+el.toFixed(1)+' s of intro time, voice ok='+VOICE.ok+' button="'+document.getElementById('vox').textContent+'"'};
window.__vpause=()=>{reset();introStart();INTRO.grace=0;window.__sp.log.length=0;for(let i=0;i<200;i++){introTick(1/30);window.__sp.adv(1/30)}const a=window.__sp.log.length;pause();const stopped=window.__sp.active.length;resume();return 'before pause lines spoken '+a+', after pause active '+stopped+', after resume lines spoken '+window.__sp.log.length+' (same caption again: '+(window.__sp.log.length>1&&window.__sp.log[0].text===window.__sp.log[window.__sp.log.length-1].text)+')'};
window.__vend=()=>{window.__sp.log.length=0;reset();gap=1e9;showEnding();const a=window.__sp.log.length?window.__sp.log[0].text.slice(0,40):'none';const act=window.__sp.active.length;resume();return 'ending screen spoken: "'+a+'" active '+act+' -> after Keep fighting active '+window.__sp.active.length};
window.__vmute=()=>{window.__sp.log.length=0;speak('A line that will be muted.','R');const a=window.__sp.active.length;document.getElementById('mute').click();const r='active '+a+' -> '+window.__sp.active.length+' after Sound off';document.getElementById('mute').click();return r};

window.__vset=o=>{Object.assign(VOICE,o);return JSON.stringify({on:VOICE.on,ok:VOICE.ok,miss:VOICE.miss})};window.__vinfo=()=>VOICE.ok+' / "'+document.getElementById('vox').textContent+'"';window.__ion=()=>INTRO.on;

window.__vdeadStart=()=>{reset();introStart();INTRO.grace=0;window.__sp.log.length=0;window.__t=0};window.__vdeadStep=()=>{for(let i=0;i<30;i++){introTick(1/30);window.__t+=1/30}};

window.__rowTest=(x,y,z,sec,withEnemies)=>{introEnd();for(const e of enemies)e.dying=0.001;queue.length=0;mission=null;gap=1e9;window.__hurtN=0;pos.set(x,y,z);vy=0;window.__pinAt=[x,y,z];rowanJoin(true);ROW.pos.set(x+8,y+ROW.r,z+8);
  if(withEnemies){for(const[t,dx,dz]of[[5,12,0],[5,-12,4],[0,0,-14],[7,8,12],[10,-10,-8],[6,14,-6]]){const e=mk(t,x+dx,y+(t<5?4:1.5),z+dz);enemies.push(e)}}
  let jumps=0,maxD=0,sameFloor=0,inside=0,n=Math.round(sec*30),prev=ROW.pos.clone(),k0=ROW.kills,tail=0;
  for(let k=0;k<n;k++){window.__pinL();update(1/30);time+=1/30;const d=Math.hypot(ROW.pos.x-pos.x,ROW.pos.z-pos.z),dy=Math.abs(ROW.pos.y-ROW.r-pos.y);if(ROW.pos.distanceTo(prev)>4)jumps++;prev.copy(ROW.pos);maxD=Math.max(maxD,d);
    if(k>=n-90){tail++;if(dy<1.5)sameFloor++;if(inBox(ROW.pos.x,ROW.pos.y-.3,ROW.pos.z)||inBox(ROW.pos.x,ROW.pos.y+.5,ROW.pos.z))inside++}}
  const alive=enemies.filter(e=>!e.dying).length;
  return 'player ('+[x,y,z]+') -> Rowan at '+ROW.pos.toArray().map(v=>v.toFixed(1))+' dist '+Math.hypot(ROW.pos.x-pos.x,ROW.pos.z-pos.z).toFixed(1)+' m, last 3 s: same floor '+sameFloor+'/'+tail+', inside solid '+inside+'/'+tail+', teleports '+jumps+', max dist '+maxD.toFixed(0)+(withEnemies?' | enemies left '+alive+', Rowan kills '+(ROW.kills-k0)+', player hurt events '+window.__hurtN:'')};
window.__rowLook=()=>{introEnd();for(const e of enemies)e.dying=0.001;queue.length=0;mission=null;gap=1e9;pos.set(0,0,12);yaw=0;window.__pinAt=[0,0,12];ROW.on=true;rwG.visible=true;ROW.pos.set(3,ROW.r,10);const e=mk(5,-2,1.5,-6);enemies.push(e);for(let k=0;k<30;k++){window.__pinL();update(1/30);time+=1/30}return 'rowan '+ROW.pos.toArray().map(v=>v.toFixed(2))};

window.__idle2=(stage)=>{introEnd();if(stage>1){wave=stage-1;mission=null;gap=.01}pos.set(0,0,24);rowanJoin(true);const log=[];let t=0;while(state==='playing'&&t<240){update(1/30);time+=1/30;t+=1/30;if(Math.abs(t%20)<1/30)log.push(Math.round(t)+'s hp'+Math.round(hp)+' sh'+Math.round(shield)+' left'+alive())}return 'stage '+stage+' with Rowan: '+(state==='dead'?'died at '+t.toFixed(0)+' s':'alive after '+t.toFixed(0)+' s')+' | '+log.join(' ')};

window.__lid=t=>lineId(t);window.__vst=()=>JSON.stringify({busy:VOICE.busy,cur:VOICE.cur&&VOICE.cur.text.slice(0,20),clips:Object.keys(VDB.clips).length,audio:!!VOICE.audio,pick:VOICE.pick});window.__sp2=(t,k)=>{speak(t,k);return window.__vst()};window.__vstop2=()=>{voiceStop();return window.__vst()};window.__noSpeech=()=>{VOICE.ok=false;return 1};

window.__aud=()=>{const a=VOICE.audio;return a?JSON.stringify({rs:a.readyState,paused:a.paused,t:a.currentTime,d:a.duration,ended:a.ended,err:a.error&&a.error.code}):'no audio'};window.__vclr=()=>{try{const tx=VDB.db.transaction('clips','readwrite');tx.objectStore('clips').clear();tx.oncomplete=()=>{window.__cleared='done'};tx.onerror=e=>{window.__cleared='err '+tx.error};return 'started, db='+!!VDB.db}catch(e){return 'threw '+e}};

window.__vcount=()=>new Promise(r=>{try{const q=VDB.db.transaction('clips').objectStore('clips').count();q.onsuccess=()=>r('stored '+q.result+', in memory '+Object.keys(VDB.clips).length);q.onerror=()=>r('count err')}catch(e){r('threw '+e)}});

window.__vdbg=()=>JSON.stringify({id:VOICE.id,busy:VOICE.busy,started:VOICE.started,miss:VOICE.miss,ok:VOICE.ok,on:VOICE.on,cur:VOICE.cur&&VOICE.cur.text.slice(0,16)});

window.__gunRow=()=>{introEnd();for(const e of enemies)e.dying=0.001;queue.length=0;mission=null;gap=1e9;pos.set(0,0,205);yaw=0;window.__pinAt=[0,0,205];ROW.on=true;rwG.visible=true;ROW.pos.set(0,ROW.r,180);const L=[[5,-8,.9],[6,-5,1.3],[8,-2.4,.9],[10,2.4,1.0],[12,5,.9],[7,8,.7]];for(const[t,x,y]of L)enemies.push(mk(t,x,y,180));for(let k=0;k<20;k++){window.__pinL();update(1/30);time+=1/30}ROW.cd=99;return enemies.length};

window.__vpaths=()=>{window.__sp.log.length=0;speak('Line A is being read now.','R');return 'ok'};
window.__vpath2=(n)=>{if(n===1)speak('Line B interrupts line A.','R');if(n===2){pause();resume()}if(n===3){reset();introStart();INTRO.grace=0;for(let i=0;i<150;i++)introTick(1/30);introEnd();comm('R','Opening radio line after skip.');commsTick(1/30)}if(n===4){const el=document.getElementById('vpL');el.value='';el.dispatchEvent(new Event('change'))}return 'ok'};

window.__pz3=()=>{const a=JSON.stringify({cur:VOICE.cur&&VOICE.cur.text.slice(0,12),busy:VOICE.busy,id:VOICE.id,intro:INTRO.on,state});pause();const b=JSON.stringify({cur:VOICE.cur&&VOICE.cur.text.slice(0,12),busy:VOICE.busy,id:VOICE.id,state});resume();const c=JSON.stringify({cur:VOICE.cur&&VOICE.cur.text.slice(0,12),busy:VOICE.busy,id:VOICE.id,state});return a+' -> '+b+' -> '+c};

window.__gunFreeze=()=>{window.__gunRow();pause();const o=[];for(const e of enemies)if(!e.dying)o.push(e.type+':'+e.pos.toArray().map(v=>v.toFixed(1)).join(','));return 'rowan '+ROW.pos.toArray().map(v=>v.toFixed(1))+' | '+o.join(' ; ')};

window.__menu=()=>{const bs=[...document.querySelectorAll('#missions button')];return bs.length+' buttons, '+bs.filter(b=>b.disabled).length+' disabled: '+bs.map(b=>b.querySelector('b').textContent+(b.disabled?'(off)':'')).join(' ')};
window.__jump=(m,s)=>{startAt(m,s);return window.__ms()};
window.__ms=()=>JSON.stringify({wave,rowan:ROW.on,nosave:NOSAVE,gunRar:guns[0].rar,gunPow:guns[0].pow,intro:INTRO.on,state,save:SAVE&&SAVE.wave});
window.__clearNow=()=>{introEnd();let k=0;while(!mission&&k++<400){update(1/30);time+=1/30}const m=mission;let q=0;while(mission===m&&q++<600){for(const e of enemies)if(!e.dying){if(e.type===3)e.vuln=1;damage(e,1e9)}queue.length=0;update(1/30);time+=1/30}return window.__ms()};
window.__dieNow=()=>{die();return JSON.stringify({retryHidden:document.getElementById('retry').hidden,retryText:document.getElementById('retry').textContent,state})};
window.__retryNow=()=>{document.getElementById('retry').click();return window.__ms()};

window.__cm=[];window.__cs=[];{const _c=comm;comm=function(k,t,h){window.__cm.push([+time.toFixed(1),k,t]);return _c(k,t,h)}}
window.__lore1=()=>{window.__cm.length=0;window.__cs.length=0;window.__sp.log.length=0;startAt(1,1);introEnd();let t=0,last=null,killT=0,spokenAt=[];
  while(state==='playing'&&t<400){update(1/30);time+=1/30;t+=1/30;commsTick(1/30);window.__sp.adv(1/30);if(commCur!==last){last=commCur;if(commCur)spokenAt.push([+t.toFixed(0),commCur.k,commCur.text.slice(0,34)])}
    killT+=1/30;if(killT>4){killT=0;const e=enemies.find(q=>!q.dying&&q.type!==3);if(e)damage(e,1e9)}if(!mission&&wave>=1&&!commCur&&!COMMS.length&&t>20)break}
  const said=new Set(spokenAt.map(x=>x[2]));const dropped=window.__cm.filter(x=>!said.has(x[2].slice(0,34)));
  return 'ran '+t.toFixed(0)+' s, rowan joined='+ROW.on+' | pushed '+window.__cm.length+' lines, spoken '+spokenAt.length+', never spoken '+dropped.length+(dropped.length?': '+dropped.map(x=>x[1]+':'+x[2].slice(0,30)).join(' / '):'')+'\n'+spokenAt.map(x=>x.join(' ')).join('\n')};

window.__campJson=()=>JSON.stringify({camp:CAMP,shots:INTRO.shots.map(q=>q.text).filter(Boolean),story:{intro:STORY.intro,purge:STORY.purge,boss:STORY.boss,done:STORY.done,logs:STORY.logs},who:WHO,barks:BARKS,gp:Object.fromEntries(Object.entries(GP).filter(([k,v])=>v.intro).map(([k,v])=>[k,v.intro]))});

window.__walkInto=(withRowan)=>{introEnd();for(const e of enemies)e.dying=0.001;queue.length=0;mission=null;gap=1e9;pos.set(0,0,200);vy=0;ROW.on=!!withRowan;rwG.visible=!!withRowan;if(withRowan)ROW.pos.set(4,ROW.r,204);
  const L=[[5,0,188],[6,3,186],[10,-3,186],[7,6,188],[8,-6,188]];const es=L.map(([t,x,z])=>{const e=mk(t,x,1.2,z);enemies.push(e);return e});const hp0=es.map(e=>e.hp);
  let log=[];for(let k=0;k<240;k++){
    pos.z=Math.max(186,200-k*0.08);pos.x=0;update(1/30);time+=1/30}
  return (withRowan?'with Rowan':'no Rowan')+': '+es.map((e,i)=>e.type+' hp '+hp0[i].toFixed(1)+'->'+(e.dying?'DEAD':e.hp.toFixed(1))).join(' | ')+' | rowan kills '+ROW.kills};
window.__killWatch=()=>{introEnd();for(const e of enemies)e.dying=0.001;queue.length=0;mission=null;gap=1e9;pos.set(0,0,205);vy=0;yaw=0;ROW.on=false;rwG.visible=false;
  window.__kw=[[5,-6],[6,-3],[10,0],[7,3],[8,6],[12,9],[11,-9]].map(([t,x])=>{const e=mk(t,x,1.2,196);enemies.push(e);return e});for(let k=0;k<20;k++){update(1/30);time+=1/30}
  for(const e of window.__kw)damage(e,1e9);return 'killed '+window.__kw.length+', corpses '+CORPSES.length+', physics '+!!physWorld()};
window.__kwRep=()=>'enemies still in list: '+enemies.filter(e=>window.__kw.includes(e)).map(e=>e.type+(e.dying?' dying '+e.dying.toFixed(2):'')+(e.corpse?' corpse':'')).join(', ')+' | corpses '+CORPSES.length+' | corpse part heights '+CORPSES.map(c=>Math.max(...c.parts.map(q=>q.b.position.y)).toFixed(1)).join(',');

window.__kwSim=(sec)=>{for(let k=0;k<sec*30;k++){update(1/30);time+=1/30}return 't+'+sec+' s: corpses '+CORPSES.length+' | top of each body '+CORPSES.map(c=>Math.max(...c.parts.map(q=>q.b.position.y)).toFixed(1)).join(',')+' | speeds '+CORPSES.map(c=>Math.max(...c.parts.map(q=>q.b.velocity.length())).toFixed(1)).join(',')+' | asleep '+CORPSES.map(c=>c.parts.filter(q=>q.b.sleepState===2).length+'/'+c.parts.length).join(',')};

window.__ragDump=()=>{introEnd();for(const e of enemies)e.dying=0.001;queue.length=0;mission=null;gap=1e9;pos.set(0,0,205);ROW.on=false;clearCorpses();const e=mk(5,0,1.2,196);enemies.push(e);for(let k=0;k<20;k++){update(1/30);time+=1/30}damage(e,1e9);for(let k=0;k<11&&!e.corpse;k++){animate(1/30);time+=1/30}const C=CORPSES[CORPSES.length-1];const N=['head','lFore','rFore','lShin','rShin','gun','lUpper','rUpper','lThigh','rThigh','torso','pelvis'];const out=[];for(const t of[0,.5,1.5,3]){const n=Math.round((t-(out.length?[0,.5,1.5,3][out.length-1]:0))*30);for(let k=0;k<n;k++){update(1/30);time+=1/30}out.push('t='+t+': '+C.parts.map((q,i)=>N[i]+' y'+q.b.position.y.toFixed(2)+' m'+q.b.mass.toFixed(0)+' h'+q.b.shapes[0].halfExtents.y.toFixed(2)).join(', '))}return out.join('\n')+'\ncons '+C.cons.length+' statics '+C.stat.length};

window.__vclipAll=async()=>{const ids=Object.keys(JSON.parse(document.getElementById('vclips').textContent));let ok=0,bad=[],dur=0;for(const id of ids){try{const b=await vdecode(id);ok++;dur+=b.duration}catch(e){bad.push(id)}}return ids.length+' clips, decoded '+ok+', failed '+bad.length+', total '+(dur/60).toFixed(1)+' min, ac '+(ac&&ac.state)};
window.__vplay=(t,k)=>{speak(t,k);return JSON.stringify({src:!!VOICE.src,busy:VOICE.busy,cur:VOICE.cur&&VOICE.cur.text.slice(0,20),tts:window.__sp?window.__sp.log.length:-1})};
window.__vstate=()=>JSON.stringify({src:!!VOICE.src,busy:VOICE.busy,cur:VOICE.cur&&VOICE.cur.text.slice(0,20),tts:window.__sp?window.__sp.log.length:-1,intro:INTRO.on,ac:ac&&ac.state,t:ac&&+ac.currentTime.toFixed(2)});
window.__vpz=()=>{pause();const a=window.__vstate();resume();return a+' -> resume -> '+window.__vstate()};
window.__ijump=t=>{INTRO.t=t;return 1};

window.__fogN=()=>scene.fog.near+'/'+scene.fog.far+' cam '+cam.near+'/'+cam.far;
window.__fly=(s)=>{startAt(2,s,true);return JSON.stringify({state,fly:!!FLY,ph:FLY&&FLY.ph,hud:document.getElementById('hud').hidden,fhud:document.getElementById('fhud').hidden,fog:window.__fogN()})};
window.__fst=()=>{const S=FLY;return S?JSON.stringify({ph:S.ph,pos:S.pos.toArray().map(v=>+v.toFixed(0)),mph:Math.round(S.spd*MPH),en:S.en.length,kills:S.kills,hp:+hp.toFixed(0),sh:+shield.toFixed(0),state,msl:S.msl,lock:+S.lockP.toFixed(2)}):'no flight, state '+state};
window.__fstep=(sec)=>{const n=Math.round(sec*30);for(let k=0;k<n&&state==='playing'&&FLY;k++){update(1/30);if(FLY)flyCam(1/30);time+=1/30;commsTick(1/30)}return window.__fst()};
window.__flyExitTest=()=>{const S=FLY;S.thr=1;yaw=Math.PI;pitch=0;let t=0;while(FLY&&FLY.ph==='hangar'&&t<40){update(1/30);flyCam(1/30);time+=1/30;t+=1/30}return 'left the hangar after '+t.toFixed(1)+' s: '+window.__fst()};
window.__topSpeed=()=>{const S=FLY;for(const e of S.en)scene.remove(e.g);S.en.length=0;S.ph='free';S.pos.set(0,200,1500);keys.ShiftLeft=true;S.thr=1;let mx=0;for(let k=0;k<300;k++){update(1/30);flyCam(1/30);time+=1/30;mx=Math.max(mx,S.spd)}keys.ShiftLeft=false;
  let cr=0;for(let k=0;k<400;k++){update(1/30);flyCam(1/30);time+=1/30;cr=S.spd}return 'afterburner top '+Math.round(mx*MPH)+' mph, cruise '+Math.round(cr*MPH)+' mph, boost left '+S.boost.toFixed(2)};
window.__aimAt=(e)=>{const d=new T.Vector3().subVectors(e.p,FLY.pos);yaw=Math.atan2(-d.x,-d.z);pitch=Math.atan2(d.y,Math.hypot(d.x,d.z))};
window.__weapon=(w)=>{const S=FLY;for(const e of S.en)scene.remove(e.g);S.en.length=0;S.ph='free';S.pos.set(0,200,3000);S.spd=0;S.thr=0;S.mac=0;S.msl=8;S.heat=0;S.over=0;yaw=Math.PI;pitch=0;S.h=Math.PI;S.p=0;
  const e=flyEnemy(w==='mac'?'gun':'int',0,200,3000+(w==='mac'?900:350));e.sp=0;e.dir.set(0,0,-1);let t=0;
  for(let k=0;k<900&&S.en.includes(e);k++){window.__aimAt(e);if(w==='mg')firing=true;if(w==='msl'&&S.lockP>=.6&&S.mcd<=0)flyMissile();if(w==='mac'&&S.mac<=0)flyMAC();update(1/30);flyCam(1/30);time+=1/30;t+=1/30;e.cd=99}firing=false;
  return w+': '+(S.en.includes(e)?'target survived, hp '+e.hp:'killed in '+t.toFixed(1)+' s')+(w==='msl'?', missiles left '+S.msl:'')};
window.__idleFly=()=>{const S=FLY;S.ph='hangar';S.pos.set(0,10,400);for(const e of S.en)scene.remove(e.g);S.en.length=0;S.spd=0;S.thr=0;hp=100;shield=shMax;let t=0;S.ph='hangar';S.pos.z=331;
  while(state==='playing'&&FLY&&t<240){update(1/30);if(FLY)flyCam(1/30);time+=1/30;t+=1/30;if(FLY){FLY.thr=0;FLY.spd=0}}return 'idle in space: '+(state==='dead'?'shuttle lost after '+t.toFixed(0)+' s':'alive after '+t.toFixed(0)+' s')};

window.__l2cine=()=>{startAt(2,1);return 'intro '+INTRO.on+' shots '+INTRO.shots.length};window.__dogfight=()=>{const S=FLY;S.ph='w1';S.pos.set(0,60,900);S.spd=120;S.thr=.8;for(let i=0;i<4;i++){const e=flyEnemy('int',(i-1.5)*40,60+(i%2)*25,1150+i*30);e.cd=99}const g=flyEnemy('gun',60,90,1500);g.cd=99;yaw=Math.PI;pitch=.05;S.h=Math.PI;firing=true;for(let k=0;k<20;k++){update(1/30);flyCam(1/30);time+=1/30}firing=false;return window.__fst()};
window.__flyDie=()=>{window.__fly(1);FLY.ph='w1';hp=1;shield=0;hurt(50);return JSON.stringify({state,title:document.getElementById('ovTitle').textContent,retry:document.getElementById('retry').textContent,retryHidden:document.getElementById('retry').hidden,fly:!!FLY})};
window.__flyRetry=()=>{document.getElementById('retry').click();return JSON.stringify({state,fly:!!FLY,ph:FLY&&FLY.ph,intro:INTRO.on,hp,shield:Math.round(shield),fog:window.__fogN()})};
window.__flyPause=()=>{pause();const a=state+' fhud hidden '+document.getElementById('fhud').hidden;resume();return a+' -> '+state+' fly '+!!FLY+' fhud hidden '+document.getElementById('fhud').hidden};
window.__farTest=()=>{window.__fly(1);const S=FLY;S.ph='free';const ds=()=>{FAR.position.copy(cam.position);FAR.updateMatrixWorld(true);return FAR.children.map(c=>Math.round(c.getWorldPosition(new T.Vector3()).distanceTo(cam.position)))};
  S.pos.set(0,200,1500);for(let k=0;k<10;k++){update(1/30);flyCam(1/30)}const a=ds();S.pos.set(9000,3000,8000);for(let k=0;k<10;k++){update(1/30);flyCam(1/30)}const b=ds();let same=0;for(let i=0;i<a.length;i++)if(Math.abs(a[i]-b[i])<60)same++;
  return 'backdrop objects '+a.length+', same distance after flying 12 km: '+same+' | sample before '+a.slice(0,6).join(',')+' after '+b.slice(0,6).join(',')};
window.__crash=(x,y,z,h,label)=>{window.__fly(1);const S=FLY;S.ph='free';hp=100;shield=150;S.pos.set(x,y,z);S.h=h;yaw=h;S.p=0;pitch=0;S.spd=224;S.thr=1;keys.ShiftLeft=true;let minX=1e9,t=0;
  for(let k=0;k<150&&state==='playing';k++){update(1/30);flyCam(1/30);time+=1/30;t+=1/30;minX=Math.min(minX,Math.abs(S.pos.x))}keys.ShiftLeft=false;
  return label+': closest |x| '+minX.toFixed(1)+', ended at '+S.pos.toArray().map(v=>v.toFixed(0))+', '+Math.round(S.spd*MPH)+' mph, shield '+Math.round(shield)+' hull '+Math.round(hp)+' state '+state};
window.__ram=()=>{window.__fly(1);const S=FLY;S.ph='free';hp=100;shield=150;S.pos.set(0,200,2000);S.h=Math.PI;yaw=Math.PI;S.p=0;pitch=0;S.spd=150;S.thr=1;const e=flyEnemy('int',0,200,2200);e.sp=0;e.cd=99;let k=0;
  for(;k<90&&S.en.includes(e);k++){update(1/30);flyCam(1/30);time+=1/30}return 'ram an interceptor: destroyed '+!S.en.includes(e)+' after '+(k/30).toFixed(1)+' s, kills '+S.kills+', shield '+Math.round(shield)+' hull '+Math.round(hp)+', speed now '+Math.round(S.spd*MPH)+' mph'};
window.__farView=(x,y,z,h,p)=>{window.__fly(1);const S=FLY;S.ph='free';S.pos.set(x,y,z);S.h=h;yaw=h;S.p=p;pitch=p;S.spd=0;S.thr=0;for(let k=0;k<5;k++){update(1/30);flyCam(1/30)}return window.__fst()};
window.__farOrd=()=>FAR.children.map((c,i)=>i+':'+(c.type)+(c.material?'/'+c.material.type+'/side'+c.material.side+'/tr'+c.material.transparent:'')+'/ro'+c.renderOrder+'/n'+c.children.length+(c.geometry&&c.geometry.boundingSphere?'/r'+Math.round(c.geometry.boundingSphere.radius*c.scale.x):'')).join('\n');
window.__farExp=(m)=>{const pg=FAR.children[1],pl=pg.children[0],at=pg.children[1];if(m==='sky')FAR.children[0].visible=false;if(m==='atm')at.visible=false;if(m==='dw'){pl.material.depthWrite=true}if(m==='reset'){FAR.children[0].visible=true;at.visible=true;pl.material.depthWrite=false}return pl.material.type+' map '+!!pl.material.map+' color '+pl.material.color.getHexString()+' visible '+pl.visible+' frustum '+pl.frustumCulled};
window.__padCells=()=>{if(!NAV)navBuild();const o=[];for(const[x,z]of[[-55,215],[55,215],[-22,232],[22,238]]){const c=navCell(x,z);let blk=[];for(let y=.25;y<=2.5;y+=.25)if(inBox(x,y,z))blk.push(y);o.push(x+','+z+' nav '+NAV[c]+' solid at '+blk.join('/'))}return o.join(' | ')};
window.__freeSpots=()=>{const ok=(x,z)=>{for(let dx=-5;dx<=5;dx+=1)for(let dz=-5;dz<=5;dz+=1)for(let y=.3;y<=3;y+=.45)if(inBox(x+dx,y,z+dz))return false;return true};const o=[];for(let x=-100;x<=100;x+=5)for(let z=160;z<=250;z+=5){if(Math.abs(x)<30)continue;if(ok(x,z))o.push(x+','+z)}return o.join(' ')};

window.__showShip=()=>{const g=shuttleModel();g.position.set(0,2.6,185);g.rotation.set(0,0,0);scene.add(g);window.__ship=g;g.userData.gear.scale.y=1;return g.children.length+' parts'};window.__shipFly=(t)=>{const g=window.__ship;g.userData.gear.scale.y=.01;g.userData.gear.visible=false;shuttleAnim(g,t?224:120,!!t,0,8,0,false,1/30);return 1};
window.__showEnemies=()=>{const a=interceptorModel();a.position.set(-22,6,205);a.rotation.set(0,Math.PI*.8,0);scene.add(a);const b=gunboatModel();b.position.set(28,11,215);b.rotation.set(0,-Math.PI*.75,0);scene.add(b);return a.children.length+' / '+b.children.length+' parts'};
window.__dogfight2=()=>{const S=FLY;S.ph='w1';S.pos.set(0,60,900);S.spd=60;S.thr=.4;const a=flyEnemy('int',-14,64,960);a.cd=99;a.sp=0;a.dir.set(.5,0,-1).normalize();const b=flyEnemy('int',22,70,1010);b.cd=99;b.sp=0;b.dir.set(-.3,.1,-1).normalize();const g=flyEnemy('gun',10,80,1090);g.cd=99;g.sp=0;g.dir.set(-1,0,-.4).normalize();yaw=Math.PI;pitch=.04;S.h=Math.PI;for(let k=0;k<6;k++){update(1/30);flyCam(1/30);time+=1/30}return window.__fst()};

window.__line=(spin)=>{introEnd();for(const e of enemies)e.dying=.001;queue.length=0;mission=null;gap=1e9;ROW.on=false;rwG.visible=false;pos.set(0,0,215);window.__LN=[];for(let v=0;v<9;v++){const g=new T.Group(),rg=walkerRig(g,v);g.position.set(-8+v*2,.95,190);g.rotation.y=spin||0;scene.add(g);window.__LN.push({g,rg,e:{pos:g.position,mv:0,vy:0,kick:0,ph:v,crouch:0,jet:0,burst:0,ch:0,ft:0}})}for(let k=0;k<10;k++){update(1/30);time+=1/30}for(const o of window.__LN)o.rg.anim(o.e,1,1/30);pause();return 'ok'};
window.__lnSpin=(a)=>{for(const o of window.__LN)o.g.rotation.y=a;return 'ok'};

window.__line2=()=>{introEnd();for(const e of enemies)e.dying=.001;queue.length=0;mission=null;gap=1e9;ROW.on=false;rwG.visible=false;pos.set(0,0,225);window.__LN=[];const add=(m,x,y,z,ry)=>{m.g.position.set(x,y,z);m.g.rotation.y=ry;scene.add(m.g);window.__LN.push({g:m.g,rg:m.rig,e:{pos:m.g.position,mv:0,vy:0,kick:0,ph:1,cd:2,vuln:0,crouch:0,jet:0,burst:0,ch:0,ft:0}})};for(const[t,x]of[[0,-3],[1,0],[2,3]])add(model(t),x,1.6,196,.5);add(model(9),6.5,.6,196,.5);add(bossModel(),-12,5,175,.6);add(colossusModel(),0,6,172,.4);add(widowModel(),12,3.2,175,.3);for(let k=0;k<10;k++){update(1/30);time+=1/30}for(const o of window.__LN)if(o.rg&&o.rg.anim)o.rg.anim(o.e,1,1/30);pause();return 'ok '+window.__LN.length};
window.__ie=()=>{introEnd();for(const e of enemies)e.dying=.001;queue.length=0;mission=null;gap=1e9;pos.set(0,0,200);yaw=Math.PI*.85;pitch=-.1;window.__pinAt=[0,0,200];return 'ok'};

window.__bk=(kind,vu)=>{introEnd();clearCorpses();for(const e of enemies){if(e.g)scene.remove(e.g)}enemies.length=0;queue.length=0;mission=null;gap=1e9;const e=mkBoss(kind,'HANGAR');for(const q of e.pods){scene.remove(q.g)}enemies.length=0;enemies.push(e);e.pods=[];e.vuln=vu?99:0;window.__B=e;e.pos.set(0,e.baseY||12,185);pos.set(0,0,215);window.__pinAt=[0,0,215];for(let k=0;k<20;k++){time+=1/30;e.rig.anim(e,time,1/30)}e.pos.set(0,e.baseY||12,185);pause();return kind+' at '+e.pos.toArray().map(v=>v.toFixed(1)).join()};
window.__bkill=(n)=>{const e=window.__B;e.vuln=99;damage(e,1e7);const C=CORPSES[CORPSES.length-1];for(let k=0;k<(n||60);k++){animate(1/30);corpseTick(1/30);time+=1/30}return 'corpses '+CORPSES.length+' parts '+(C?C.parts.length:0)+' cons '+(C?C.cons.length:0)+' ys '+(C?C.parts.map(q=>q.b.position.y.toFixed(1)).slice(0,12).join(','):'')};

window.__crowd=()=>{introEnd();for(const e of enemies)e.dying=.001;queue.length=0;mission=null;gap=1e9;pos.set(0,0,215);yaw=0;pitch=0;window.__pinAt=[0,0,215];const L=[5,6,7,8,9,10,11,5,6,7,8,10,11,0,1,2,0,1];L.forEach((t,i)=>enemies.push(mk(t,-14+(i%9)*3.5,t<=2?3:1,190-Math.floor(i/9)*6)));for(let k=0;k<6;k++){update(1/30);time+=1/30}for(const e of enemies)if(!e.dying)e.cd=99;return enemies.filter(e=>!e.dying).length};
window.__info=()=>JSON.stringify({calls:renderer.info.render.calls,tris:renderer.info.render.triangles,geos:renderer.info.memory.geometries});

window.__bkE=(kind,x,y,z)=>{introEnd();clearCorpses();for(const e of enemies){if(e.g)scene.remove(e.g)}enemies.length=0;queue.length=0;mission=null;gap=1e9;const e=mkBoss(kind,'ENGINEERING');for(const q of e.pods)scene.remove(q.g);enemies.length=0;enemies.push(e);e.pods=[];window.__B=e;e.pos.set(x,y,z);pos.set(x,0,z+20);for(let k=0;k<5;k++){time+=1/30;e.rig.anim(e,time,1/30)}const r=window.__bkill(150);const C=CORPSES[CORPSES.length-1];let lo=1e9,hi=-1e9;for(const q of C.parts){lo=Math.min(lo,q.b.position.y);hi=Math.max(hi,q.b.position.y)}return kind+' '+r.split(' ys')[0]+' | lowest part '+lo.toFixed(1)+' highest '+hi.toFixed(1)+' | any NaN '+C.parts.some(q=>isNaN(q.b.position.y))};

window.__s2=(c)=>{const S=FLY,H=S.halc,hc=H&&H.g.position;const face=(x,y,z)=>{const dx=x-S.pos.x,dz=z-S.pos.z;S.h=Math.atan2(-dx,-dz);yaw=S.h;S.p=0;pitch=0};
 if(c==='info')return JSON.stringify({stage:S.stage,ph:S.ph,en:S.en.length,pods:S.en.filter(e=>e.kind==='pod').length,dock:+(S.dock||0).toFixed(2),wing:S.wing?S.wing.length:0,kills:S.kills,hp:Math.round(hp),sh:Math.round(shield),d:hc?Math.round(S.pos.distanceTo(hc)):-1,obj:document.getElementById('objT').textContent});
 if(c==='near'){S.pos.set(hc.x,hc.y+60,hc.z+1250);face(hc.x,hc.y,hc.z);S.spd=60;S.thr=.4}
 if(c==='killall')for(const e of S.en.slice())flyHit(e,999);
 if(c==='collar'){S.pos.copy(H.collarW).add(new T.Vector3(0,0,10));face(H.collarW.x,H.collarW.y,H.collarW.z);S.spd=0;S.thr=0}
 if(c==='hold'){S.pos.copy(H.collarW);S.spd=0;S.thr=0}
 if(c==='ram'){S.pos.set(hc.x,hc.y,hc.z+70);face(hc.x,hc.y,hc.z);S.spd=120;S.thr=.86}
 if(c==='still'){S.spd=0;S.thr=0}
 if(c==='view'){S.pos.set(hc.x+60,hc.y+40,hc.z+260);face(hc.x,hc.y,hc.z);S.p=-.1;pitch=-.1;S.spd=0;S.thr=0}
 return window.__s2('info')};
window.__end1=()=>{const S=FLY;for(const e of S.en.slice())flyHit(e,999);S.ph='end';S.endT=41;return 'ok'};

window.__s3=(c)=>{const S=FLY,M=S.meri,R3=S.r3;const face=(x,y,z)=>{const dx=x-S.pos.x,dz=z-S.pos.z;S.h=Math.atan2(-dx,-dz);yaw=S.h;S.p=0;pitch=0};
 if(c==='info')return JSON.stringify({stage:S.stage,ph:S.ph,en:S.en.length,mines:S.en.filter(e=>e.kind==='mine').length,wing:S.wing?S.wing.length:0,kills:S.kills,hp:Math.round(hp),sh:Math.round(shield),along:R3?Math.round(S.pos.clone().sub(R3.A).dot(R3.fw)):-1,bay:M?Math.round(S.pos.distanceTo(M.bayW)):-1,obj:document.getElementById('objT').textContent,m2:M2});
 if(c==='boost'){keys.ShiftLeft=true;S.thr=1}
 if(c==='noboost'){keys.ShiftLeft=false}
 if(c==='at'){const p=R3.A.clone().addScaledVector(R3.fw,5900);S.pos.copy(p);face(M.bayW.x,M.bayW.y,M.bayW.z);S.spd=140}
 if(c==='bay'){S.pos.copy(M.bayW).addScaledVector(R3.fw,-150);face(M.bayW.x,M.bayW.y,M.bayW.z);S.spd=60;S.thr=.4}
 if(c==='ring'){const o=M.g.position;S.pos.set(o.x,o.y+90,o.z).addScaledVector(R3.fw,-260);const t=new T.Vector3(o.x,o.y+90,o.z).addScaledVector(R3.fw,-200);face(t.x,t.y,t.z);S.spd=150;S.thr=1}
 if(c==='view'){const o=M.g.position;S.pos.copy(o).addScaledVector(R3.fw,-900).add(new T.Vector3(250,120,0));face(o.x,o.y,o.z);S.p=-.08;pitch=-.08;S.spd=0;S.thr=0}
 if(c==='face'){face(M.bayW.x,M.bayW.y,M.bayW.z)}
 return window.__s3('info')};

window.__fx=(k,t)=>{if(k==='setup'){introEnd();for(const e of enemies)e.dying=.001;queue.length=0;mission=null;gap=1e9;pos.set(30,0,16);window.__pinAt=[30,0,16];pause();return 'ok'}
 const P=new T.Vector3(30,.8,0);
 if(k==='boom')explode(P);if(k==='gl')grenBoom('gl',P,5);if(k==='fire')grenBoom('fire',new T.Vector3(36,.5,2),5);
 if(k==='walker'){const e=mk(5,26,1,4);enemies.push(e);e.lastEl=2;damage(e,999)}
 if(k==='boss'){const e=mkBoss('colossus','COMMONS');for(const q of e.pods)scene.remove(q.g);e.pods=[];e.pos.set(18,6,-6);e.vuln=99;damage(e,1e7)}
 if(k==='step'){for(let i=0;i<Math.round(t*30);i++){PFX.tick(1/30);weaponFxTick(1/30);corpseTick(1/30);for(const b of blasts.slice()){b.t+=1/30;const kk=b.t/.3;b.g.scale.setScalar(.5+kk*(b.r||4));b.m.opacity=.85*(1-kk);if(kk>=1){scene.remove(b.g);blasts.splice(blasts.indexOf(b),1)}}const fq=fxq.slice();for(const q of fq){q.t-=1/30;if(q.t<=0){fxq.splice(fxq.indexOf(q),1);q.fn()}}time+=1/30}}
 return 'particles '+PFX.count()};
window.__pf=()=>JSON.stringify(PFX.dbg());
window.PFXp=()=>PFX.pools();window.__pfx=(k)=>{const [F,S]=PFX.pools();if(k==='normal'){F.g.userData.m=1;}return 1};
window.__pfxN=()=>{const [F]=PFX.pools();let n=0;scene.traverse(o=>{if(o.isPoints&&o.geometry===F.g){o.material.blending=T.NormalBlending;o.material.needsUpdate=true;n++}});return n};window.__pfxS=()=>{const [F,S]=PFX.pools();S.list.length=0;S.g.setDrawRange(0,0);return 1};
window.__hp=(v)=>{hp=v;return hp};window.__flyBoomNear=()=>{const S=FLY;const p=S.pos.clone().add(new T.Vector3(-Math.sin(S.h)*60,0,-Math.cos(S.h)*60));flyBoom(p,1.3);return 1};
window.__halcView=()=>{const S=FLY,H=S.halc,hc=H.g.position;S.pos.set(hc.x+40,hc.y+30,hc.z+150);const dx=hc.x-S.pos.x,dz=hc.z-S.pos.z;S.h=Math.atan2(-dx,-dz);yaw=S.h;S.p=-.15;pitch=-.15;S.spd=0;S.thr=0;return 1};window.__dmgView=()=>{const S=FLY;S.pos.set(0,40,1500);S.h=Math.PI;yaw=Math.PI;S.p=0;pitch=0;S.spd=100;S.thr=.7;hp=20;return 1};

window.__kill1=(t)=>{introEnd();for(const e of enemies)e.dying=.001;queue.length=0;mission=null;gap=1e9;pos.set(30,0,14);window.__pinAt=[30,0,14];const e=mk(t||5,30,1,6);enemies.push(e);for(let k=0;k<20;k++){animate(1/30);time+=1/30}e.cd=99;window.__K=e;pause();return 'ok'};
window.__hit1=()=>{const e=window.__K;e.lastEl=-1;damage(e,1);return 'hp '+e.hp.toFixed(1)+' hitT '+e.hitT};
window.__die1=()=>{const e=window.__K;e.lastEl=-1;damage(e,9999);return 'dth '+e.dth};
window.__anim=(t)=>{for(let i=0;i<Math.round(t*30);i++){animate(1/30);corpseTick(1/30);time+=1/30}const e=window.__K;return 'dth '+e.dth+' corpse '+!!e.corpse+' corpses '+CORPSES.length};

window.__place=(st,z)=>{const S=FLY;for(const e of S.en)scene.remove(e.g);S.en.length=0;if(S.halc){scene.remove(S.halc.g);S.halc=null}if(S.meri){scene.remove(S.meri.g);S.meri=null}S.pos.set(0,40,z);S.h=0;yaw=0;S.ph=st===2?'to2':'to3';window.__fstep(.1);const H=st===2?S.halc:S.meri,o=H.g.position;let near=1e9;for(const e of S.en)near=Math.min(near,Math.hypot(e.p.x,e.p.z));return 'stage '+st+' from z '+z+' facing Thalassa: target at '+o.toArray().map(v=>Math.round(v))+' ('+Math.round(o.length())+' m from origin), nearest enemy/mine '+Math.round(near)+' m from origin, hullZone '+hullZone(o)};
window.__arriveAbove=()=>{const S=FLY,M=S.meri;S.pos.copy(M.bayW).add(new T.Vector3(0,70,0));S.spd=30;const h0=hp,s0=shield;window.__fstep(1);const ph1=S.ph;window.__fstep(14);const inside=M.bay.clone().setZ(70).applyMatrix4(M.g.matrixWorld);return 'arrive from above: phase '+ph1+' -> '+S.ph+', dist to bay inside '+S.pos.distanceTo(inside).toFixed(1)+' m, hull '+h0+'->'+Math.round(hp)+', shield '+Math.round(s0)+'->'+Math.round(shield)+', state '+state};

window.__lc=(c,a)=>{const L=LC;if(c==='info')return JSON.stringify({ph:L.ph,hp:Math.round(L.hp),np:L.np,pull:L.pull.map(v=>+v.toFixed(2)),out:L.out,obj:document.getElementById('objT').textContent,state,endT:+endT.toFixed(1),enemies:enemies.filter(e=>!e.dying).length,title:document.getElementById('ovTitle').textContent});
 if(c==='s4'){startAt(1,4);introEnd&&introEnd();for(const e of enemies)e.dying=.001;queue.length=0;mission={type:'purge',done:false,boss:null,bossDue:false,C:CAMP[3],rooms:CAMP[3].rooms,n0:1};wave=4;complete();return window.__lc('info')}
 if(c==='bridge'){pos.set(0,0,-200);window.__pinAt=[0,0,-200];yaw=0;pitch=0}
 if(c==='aim'){pos.set(0,0,-205);window.__pinAt=[0,0,-205];yaw=0;const dy=3.4-(0+1.55),dz=-12;pitch=Math.atan2(dy,-dz)*1;}
 if(c==='shoot'){let n=0;for(let i=0;i<(a||10);i++){fireCd=0;reloadT=0;const G=guns[weapon];if(G.mag!==undefined)G.mag=Math.max(G.mag,5);fire();n++}return 'shots '+n+' '+window.__lc('info')}
 if(c==='cp'){const cp=L.cps[a].w;pos.set(cp.x*1.35,0,-217+(cp.z+217)*1.35);window.__pinAt=[pos.x,0,pos.z];keys.KeyE=true}
 if(c==='release')keys.KeyE=false;
 if(c==='kill')for(const e of enemies)if(!e.dying)damage(e,1e9);
 if(c==='step'){for(let i=0;i<Math.round(a*30)&&state==='playing';i++){update(1/30);time+=1/30;commsTick(1/30)}}
 return window.__lc('info')};

window.__ace=(c)=>{const S=FLY;
 if(c==='spawn'){for(const e of S.en)scene.remove(e.g);S.en.length=0;S.ph='w3';window.__fstep(.2);return S.ph+' ace '+(S.ace?Math.round(S.ace.p.distanceTo(S.pos))+' m hp '+S.ace.hp:'none')}
 if(c==='info')return JSON.stringify({ph:S.ph,stage:S.stage,ace:S.ace?Math.round(S.ace.hp):-1,en:S.en.length,msl:(S.emsl||[]).length,warn:S.warn,hp:Math.round(hp),sh:Math.round(shield),noHull:!!S.noHull,halc:!!S.halc,worldVisible:WORLDOBJ.filter(o=>o.visible).length+'/'+WORLDOBJ.length,obj:document.getElementById('objT').textContent});
 if(c==='kill'){if(S.ace)flyHit(S.ace,9999);return window.__ace('info')}
 return 'x'};
window.__mslTest=(mode)=>{const S=FLY;for(const e of S.en)scene.remove(e.g);S.en.length=0;if(S.emsl){for(const m of S.emsl)scene.remove(m.g);S.emsl.length=0}hp=100;shield=150;shMax=150;
 S.pos.set(0,200,3000);S.h=Math.PI;yaw=Math.PI;S.p=0;pitch=0;S.spd=140;S.thr=1;
 const a=flyEnemy('ace',0,200,1500);a.cd=999;a.ace={mt:999};a.sp=0;a.dir.set(0,0,1);aceMissile(S,a);const m=S.emsl[0];m.p.set(0,200,2300);
 let t=0,hit=false,minD=1e9;const n0=S.emsl.length;while(t<15){if(mode==='circle'&&m.p.distanceTo(S.pos)<900)yaw+=2.4/30;update(1/30);flyCam(1/30);time+=1/30;t+=1/30;if(S.emsl.length&&S.emsl[0]===m)minD=Math.min(minD,m.p.distanceTo(S.pos));if(!S.emsl.includes(m))break}
 const res='mode '+mode+': missile gone after '+t.toFixed(1)+' s, closest '+Math.round(minD)+' m, hull '+Math.round(hp)+' shield '+Math.round(shield);a.hp=0;scene.remove(a.g);S.en.length=0;return res};

window.__closeView=(k)=>{const S=FLY,H=S.halc,hc=H?H.g.position:null;const face=(x,y,z)=>{const dx=x-S.pos.x,dz=z-S.pos.z;S.h=Math.atan2(-dx,-dz);yaw=S.h;S.p=Math.atan2(y-S.pos.y,Math.hypot(dx,dz));pitch=S.p};S.spd=0;S.thr=0;
 if(k==='h1'){S.pos.set(hc.x+70,hc.y+18,hc.z+75);face(hc.x+40,hc.y,hc.z)}
 if(k==='h2'){S.pos.set(hc.x-60,hc.y+30,hc.z+70);face(hc.x-40,hc.y+5,hc.z)}
 if(k==='h3'){S.pos.set(hc.x+120,hc.y+10,hc.z+40);face(hc.x+70,hc.y,hc.z)}
 if(k==='ace'){for(const e of S.en)scene.remove(e.g);S.en.length=0;const a=flyEnemy('ace',S.pos.x+12,S.pos.y+2,S.pos.z+45);a.cd=999;a.ace={mt:999};a.sp=0;a.dir.set(-.6,0,-1).normalize();a.g.lookAt(a.p.x+a.dir.x,a.p.y+a.dir.y,a.p.z+a.dir.z);face(a.p.x,a.p.y,a.p.z)}
 for(let i=0;i<4;i++){update(1/30);flyCam(1/30)}return 'ok'};
window.__wv=()=>WORLDOBJ.filter(o=>o.visible).length+'/'+WORLDOBJ.length;

window.__meri=(k)=>{const S=FLY,M=S.meri,o=M.g.position,a=M.g.rotation.y;const L=(x,y,z)=>new T.Vector3(x,y,z).applyAxisAngle(new T.Vector3(0,1,0),a).add(o);
 const face=(t)=>{const dx=t.x-S.pos.x,dz=t.z-S.pos.z;S.h=Math.atan2(-dx,-dz);yaw=S.h;S.p=Math.atan2(t.y-S.pos.y,Math.hypot(dx,dz));pitch=S.p};S.spd=0;S.thr=0;for(const e of S.en)scene.remove(e.g);S.en.length=0;
 const V={far:[[300,500,6500],[0,600,0]],front:[[0,150,3000],[0,500,0]],side:[[2600,500,1600],[0,400,0]],high:[[-2200,2600,2600],[0,0,0]],pad:[[60,30,1640],[0,10,1300]],hangar:[[-250,40,1500],[-500,30,1050]],plat:[[700,60,1700],[1000,0,1000]],atrium:[[60,200,950],[0,150,672]]}[k];
 if(V){S.pos.copy(L(...V[0]));face(L(...V[1]));for(let i=0;i<4;i++){update(1/30);flyCam(1/30)}return 'ok'}
 if(k==='crash'){S.pos.copy(L(400,30,1530));face(L(0,30,1510));S.spd=140;S.thr=1;const h0=hp+shield;for(let i=0;i<90;i++){update(1/30);time+=1/30}return 'control tower / platform crash: hp+shield '+Math.round(h0)+' -> '+Math.round(hp+shield)+', distance from tower axis '+Math.hypot(S.pos.x-o.x,S.pos.z-o.z).toFixed(1)}
 if(k==='ringcrash'){S.pos.copy(L(0,1320,2900));face(L(0,1320,0));S.spd=140;S.thr=1;const h0=hp+shield;for(let i=0;i<90;i++){update(1/30);time+=1/30}return 'ring crash: hp+shield '+Math.round(h0)+' -> '+Math.round(hp+shield)+', dist from axis '+Math.hypot(S.pos.x-o.x,S.pos.z-o.z).toFixed(0)}
 if(k==='land'){S.pos.copy(L(0,60,2000));face(L(0,34,1530));S.ph='cover';S.spd=60;S.thr=.4;let t=0;while(S.ph!=='arrive'&&t<20){update(1/30);time+=1/30;t+=1/30}const t1=t;for(let i=0;i<300&&state==='playing';i++){update(1/30);time+=1/30}const lp=L(0,2.6,1510);return 'reached pad zone after '+t1.toFixed(1)+' s; 10 s later '+S.pos.distanceTo(lp).toFixed(1)+' m from the pad, state '+state}
 return 'x'};
window.__mpush=()=>{const S=FLY,M=S.meri,o=M.g.position;const p=o.clone().add(new T.Vector3(5,100,5));const hit=shipPush(M,p,2.4);return 'hit '+hit+' moved to '+p.clone().sub(o).toArray().map(v=>v.toFixed(1))+' cyls '+(M.cyls?M.cyls.length:'none')};

window.__mp2=()=>{const S=FLY,M=S.meri,o=M.g.position,a=M.g.rotation.y;const L=(x,y,z)=>new T.Vector3(x,y,z).applyAxisAngle(new T.Vector3(0,1,0),a).add(o);const out=[];
 for(const[x,y,z]of[[0,1320,2410],[0,1320,2380],[0,20,1300],[0,500,250],[24*1,18,1240]]){const p=L(x,y,z),h=shipPush(M,p,2.4);const q=p.clone().sub(o).applyAxisAngle(new T.Vector3(0,1,0),-a);out.push([x,y,z]+' hit '+h+' -> '+q.toArray().map(v=>v.toFixed(0)))}
 out.push('tori '+JSON.stringify(M.tori)+' rot '+a.toFixed(2));return out.join(' | ')};
