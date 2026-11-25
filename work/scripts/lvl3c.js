// ---------- stage 3-2: on foot inside the command ship. The interior is built inside Thalassa's footprint (x +-110, z +-260)
// so the existing pathfinding, spawning, cover and lighting work unchanged; Thalassa's boxes, rooms, lamps and nav walls are
// swapped out while you are aboard and restored by cmdLeave (called from reset).
const CMD={on:false,g:null,boxes:[],rooms:[],fix:[],navw:[],sv:null,ph:'',t:0,hold:0,timer:0,gen:null,ship:null,el:null};
MOODS.K={hi:.85,sky:0xa898c0,gr:0x2a2234,lc:0xff6a86,li:2.4};MOODS.K.skyC=new T.Color(MOODS.K.sky);MOODS.K.grC=new T.Color(MOODS.K.gr);
MOODS.V={hi:.85,sky:0xb0a0d8,gr:0x2a2238,lc:0xc088ff,li:2.2};MOODS.V.skyC=new T.Color(MOODS.V.sky);MOODS.V.grC=new T.Color(MOODS.V.gr);
const CMDR=[{n:'CMD BAY',x0:-60,x1:60,z0:150,z1:250,h:34,m:'K'},{n:'CMD SPINE',x0:-6,x1:6,z0:60,z1:150,h:9,m:'K'},{n:'CMD BARRACKS',x0:-50,x1:50,z0:15,z1:60,h:14,m:'K'},
  {n:'CMD PORT RUN',x0:-36,x1:-24,z0:-60,z1:15,h:9,m:'V'},{n:'CMD STARBOARD RUN',x0:24,x1:36,z0:-60,z1:15,h:9,m:'V'},{n:'CMD CONDUITS',x0:-70,x1:70,z0:-140,z1:-60,h:18,m:'V'},
  {n:'CMD THROAT',x0:-7,x1:7,z0:-175,z1:-140,h:10,m:'K'},{n:'CMD HEART',x0:-60,x1:60,z0:-250,z1:-175,h:36,m:'V'}];
for(const r of CMDR)MOODK[r.n]=r.m;
function cmdBuild(){if(CMD.g)return;const g=CMD.g=new T.Group();scene.add(g);g.visible=false;const M=darkMats();
  const pl=paint(512,(c,S)=>{c.fillStyle='#4a4554';c.fillRect(0,0,S,S);for(let i=0;i<4;i++)for(let j=0;j<4;j++){const v=(i*3+j*5)%7*3;c.fillStyle='rgb('+(78+v)+','+(72+v)+','+(90+v)+')';c.fillRect(i*S/4+4,j*S/4+4,S/4-8,S/4-8)}
    c.strokeStyle='rgba(10,8,14,.9)';c.lineWidth=4;for(let i=0;i<=4;i++){c.beginPath();c.moveTo(i*S/4,0);c.lineTo(i*S/4,S);c.stroke();c.beginPath();c.moveTo(0,i*S/4);c.lineTo(S,i*S/4);c.stroke()}grime(c,S,800,.08)});pl.wrapS=pl.wrapT=T.RepeatWrapping;
  const fl=paint(512,(c,S)=>{c.fillStyle='#3a3542';c.fillRect(0,0,S,S);c.strokeStyle='rgba(70,62,84,.6)';c.lineWidth=2;for(let i=0;i<=16;i++){c.beginPath();c.moveTo(i*S/16,0);c.lineTo(i*S/16,S);c.stroke()}for(let i=0;i<=4;i++){c.fillStyle='rgba(8,6,10,.9)';c.fillRect(0,i*S/4-3,S,6)}grime(c,S,600,.1)});fl.wrapS=fl.wrapT=T.RepeatWrapping;
  const sD=bas({color:0x6a2232}),vD=bas({color:0x3e2a66});const wallM=std({map:pl,color:0xc4bad4,roughness:.55,metalness:.35}),floorM=std({map:fl,color:0xb0a8c0,roughness:.6,metalness:.3}),ribM=std({color:0x4a4456,roughness:.45,metalness:.5}),roofM=std({color:0x16131a,roughness:.7,metalness:.5});
  const B=(x0,y0,z0,x1,y1,z1,mat,solid=true)=>{const w=x1-x0,h=y1-y0,d=z1-z0;if(mat){const geo=new T.BoxGeometry(w,h,d);if(mat.map){const uv=geo.attributes.uv,n=geo.attributes.normal;for(let i=0;i<uv.count;i++){const ax=Math.abs(n.getX(i)),ay=Math.abs(n.getY(i));const su=ax>.5?d:w,sv=ay>.5?d:h;uv.setXY(i,uv.getX(i)*su/6,uv.getY(i)*sv/6)}}
      const m=new T.Mesh(geo,mat);m.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);m.castShadow=m.receiveShadow=true;g.add(m)}if(solid)CMD.boxes.push({lo:[x0,y0,z0],hi:[x1,y1,z1]})};
  // walls along x at constant z (with door gaps), walls along z at constant x; each wall is also a pathfinding line
  const wz=(z,x0,x1,h,gaps)=>{let a=x0;const G=(gaps||[]).map(([c,w])=>[c-w/2,c+w/2]).sort((p,q)=>p[0]-q[0]);for(const[g0,g1]of G.concat([[x1,x1]])){if(g0>a){B(a,0,z-.6,g0,h,z+.6,wallM);CMD.navw.push(['z',z,a,g0])}a=Math.max(a,g1)}
    for(const[g0,g1]of G){B(g0-.5,0,z-.9,g0,h,z+.9,ribM);B(g1,0,z-.9,g1+.5,h,z+.9,ribM);B(g0,Math.min(h-1,7),z-.9,g1,Math.min(h-1,7)+.6,z+.9,ribM,false);if(h>Math.min(h-1,7)+.6)B(g0,Math.min(h-1,7)+.6,z-.6,g1,h,z+.6,wallM);B(g0+.1,0,z-.95,g0+.25,Math.min(h-1,7),z+.95,M.seam,false);B(g1-.25,0,z-.95,g1-.1,Math.min(h-1,7),z+.95,M.seam,false)}};
  const wx=(x,z0,z1,h)=>{B(x-.6,0,z0,x+.6,h,z1,wallM);CMD.navw.push(['x',x,z0,z1])};
  const roof=(r)=>B(r.x0-1,r.h,r.z0-1,r.x1+1,r.h+1.2,r.z1+1,roofM);
  const floor=(r)=>{const m=new T.Mesh(new T.PlaneGeometry(r.x1-r.x0,r.z1-r.z0),floorM);m.rotation.x=-Math.PI/2;m.position.set((r.x0+r.x1)/2,.01,(r.z0+r.z1)/2);m.receiveShadow=true;
    const k=m.geometry.attributes.uv;for(let i=0;i<k.count;i++)k.setXY(i,k.getX(i)*(r.x1-r.x0)/8,k.getY(i)*(r.z1-r.z0)/8);g.add(m)};
  // ribs on the walls: solid half-columns every 6 m (you can't walk into them), a red seam up each one
  const ribsZ=(z,x0,x1,h,s,gaps)=>{for(let x=x0+3;x<x1-2;x+=6){if((gaps||[]).some(([c,w])=>Math.abs(x-c)<w/2+1.5))continue;B(x-.5,0,z,x+.5,h,z+s*1.1,ribM);if(((x-x0)/6|0)%2)B(x-.1,1,z+s*1.12,x+.1,h-1,z+s*1.16,sD,false)}};
  const ribsX=(x,z0,z1,h,s,gaps)=>{for(let z=z0+3;z<z1-2;z+=6){if((gaps||[]).some(([c,w])=>Math.abs(z-c)<w/2+1.5))continue;B(x,0,z-.5,x+s*1.1,h,z+.5,ribM);if(((z-z0)/6|0)%2)B(x+s*1.12,1,z-.1,x+s*1.16,h-1,z+.1,vD,false)}};
  const R={};for(const r of CMDR){R[r.n]=r;CMD.rooms.push({n:r.n,x0:r.x0,x1:r.x1,z0:r.z0,z1:r.z1,h:r.h});floor(r);roof(r)}
  // the bay (the Kestrel sits here), mouth open to space behind a violet field
  {const r=R['CMD BAY'];wz(150,-60,60,34,[[0,12]]);wx(-60,150,250,34);wx(60,150,250,34);ribsX(-60,150,250,34,1);ribsX(60,150,250,34,-1);ribsZ(150,-60,60,34,1,[[0,12]]);
   CMD.boxes.push({lo:[-60,0,249],hi:[60,34,251]});const ff=new T.Mesh(new T.PlaneGeometry(120,34),bas({color:0xa060ff,transparent:true,opacity:.09,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}));ff.position.set(0,17,250);g.add(ff);
   B(-60,33,248,60,34.5,251,ribM,false);B(-60,0,248,60,.4,251,ribM,false);
   for(const s of[-1,1])for(let z=160;z<=240;z+=20)B(s*44-2,0,z-4,s*44+2,5.5,z+4,M.plate);   // cargo pods along the walls
   for(let z=170;z<=240;z+=12)for(const s of[-1,1])B(s*14-.4,.02,z-1.5,s*14+.4,.06,z+1.5,M.seam,false);
   for(const x of[-30,0,30])B(x-1,26,152,x+1,27.5,248,ribM,false);
   const sh=shuttleModel();sh.position.set(0,2.2,205);sh.rotation.y=Math.PI;try{shuttleAnim(sh,0,0,0,8,1,true,10)}catch(e){}g.add(sh);CMD.ship=sh;CMD.boxes.push({lo:[-7.5,0,198],hi:[7.5,5,212]})}
  // the spine corridor
  {wx(-6.5,60,150,9);wx(6.5,60,150,9);for(let z=66;z<150;z+=8){B(-6.5,0,z-.4,-5.4,9,z+.4,ribM);B(5.4,0,z-.4,6.5,9,z+.4,ribM);B(-5.4,8.2,z-.4,5.4,9,z+.4,ribM,false)}for(const x of[-4.6,4.6])B(x-.08,.02,60,x+.08,.04,150,sD,false)}
  // barracks: pillars, drone cradles on the walls, crates for cover
  {wz(60,-50,50,14,[[0,12]]);wz(15,-50,50,14,[[-30,12],[30,12]]);wx(-50,15,60,14);wx(50,15,60,14);ribsX(-50,15,60,14,1);ribsX(50,15,60,14,-1);
   for(const x of[-20,20])for(const z of[28,47]){B(x-1.4,0,z-1.4,x+1.4,14,z+1.4,ribM);B(x-1.5,4,z-1.5,x+1.5,4.3,z+1.5,M.seam,false)}
   for(const[x,z,w,d,h]of[[-36,40,4,2.4,1.6],[-8,36,2.4,2.4,1.4],[8,24,3.2,2.4,1.5],[34,42,2.4,4,1.6],[-34,24,2.4,2.4,1.3],[36,25,3,2.4,1.4]])B(x-w/2,0,z-d/2,x+w/2,h,z+d/2,M.plate)}
  // the two runs to the conduit hall
  for(const x of[-30,30]){wx(x-6,-60,15,9);wx(x+6,-60,15,9);for(let z=-55;z<12;z+=7){B(x-6,0,z-.4,x-5,9,z+.4,ribM);B(x+5,0,z-.4,x+6,9,z+.4,ribM)}for(const dx of[-4.2,4.2])B(x+dx-.08,.02,-60,x+dx+.08,.04,15,vD,false)}
  // conduit hall: low conduit runs for cover, big vertical pipes, a violet light in the floor
  {wz(-60,-70,70,18,[[-30,12],[30,12]]);wz(-140,-70,70,18,[[0,14]]);wx(-70,-140,-60,18);wx(70,-140,-60,18);ribsX(-70,-140,-60,18,1);ribsX(70,-140,-60,18,-1);
   for(const[x,z0,z1]of[[-48,-128,-104],[-48,-96,-72],[-16,-120,-80],[16,-120,-80],[48,-128,-104],[48,-96,-72]]){B(x-1.1,0,z0,x+1.1,1.5,z1,M.plate);B(x-.08,1.5,z0,x+.08,1.56,z1,vD,false)}
   for(const[x,z]of[[-62,-68],[62,-68],[-62,-132],[62,-132],[0,-100]]){const c=new T.Mesh(new T.CylinderGeometry(2.4,2.4,18,16),ribM);c.position.set(x,9,z);g.add(c);CMD.boxes.push({lo:[x-2.4,0,z-2.4],hi:[x+2.4,18,z+2.4]});for(let y=3;y<18;y+=5){const r2=new T.Mesh(new T.TorusGeometry(2.5,.12,6,20),M.seam);r2.rotation.x=Math.PI/2;r2.position.set(x,y,z);g.add(r2)}}
   for(const x of[-60,-32,32,60])B(x-.1,.02,-138,x+.1,.04,-62,vD,false)}
  // the throat and the heart: the shield generator, a core of light in a cage of rings, four power pylons
  {wx(-7.5,-175,-140,10);wx(7.5,-175,-140,10);for(let z=-170;z<-142;z+=6){B(-7.5,0,z-.4,-6.4,10,z+.4,ribM);B(6.4,0,z-.4,7.5,10,z+.4,ribM)}
   wz(-175,-60,60,36,[[0,14]]);wz(-250,-60,60,36);wx(-60,-250,-175,36);wx(60,-250,-175,36);ribsX(-60,-250,-175,36,1);ribsX(60,-250,-175,36,-1);ribsZ(-250,-60,60,36,1);ribsZ(-175,-60,60,36,-1,[[0,14]]);
   const G=new T.Group();G.position.set(0,0,-215);g.add(G);const base=new T.Mesh(new T.CylinderGeometry(10,11,3,32),ribM);base.position.y=1.5;G.add(base);CMD.boxes.push({lo:[-9,0,-224],hi:[9,3,-206]});
   const core=new T.Mesh(new T.CylinderGeometry(3.5,3.5,28,24),M.core);core.position.y=17;G.add(core);const cg=glow(0xff70c0,26,.55);cg.position.y=16;G.add(cg);
   const rings=[];for(let i=0;i<6;i++){const r2=new T.Mesh(new T.TorusGeometry(6.5-i*.3,.35,8,40),i%2?M.seam:M.vein);r2.position.y=6+i*4.4;G.add(r2);rings.push(r2)}
   for(let i=0;i<8;i++){const a=i/8*6.283,c=new T.Mesh(new T.BoxGeometry(.8,30,.8),ribM);c.position.set(Math.cos(a)*7.8,18,Math.sin(a)*7.8);G.add(c)}
   const con=new T.Group();con.position.set(0,0,-202.6);g.add(con);B(-2,0,-203.4,2,1.1,-202,M.plate);const scr=new T.Mesh(new T.PlaneGeometry(3.4,1.1),bas({color:0xff4a6a}));scr.position.set(0,1.45,-201.95);scr.rotation.x=-.5;con.add(scr);
   for(const[x,z]of[[-40,-195],[40,-195],[-40,-235],[40,-235]]){const c=new T.Mesh(new T.CylinderGeometry(1.8,2.2,22,12),ribM);c.position.set(x,11,z);g.add(c);CMD.boxes.push({lo:[x-2,0,z-2],hi:[x+2,22,z+2]});const q=glow(0xb070ff,10,.6);q.position.set(x,22,z);g.add(q);B(x-.2,0,z-.2,x+.2,22,z+.2,M.vein,false)}
   for(let k=0;k<6;k++){const a=k/6*6.283;B(Math.cos(a)*12-.3,.02,-215+Math.sin(a)*12-6,Math.cos(a)*12+.3,.06,-215+Math.sin(a)*12+6,M.vein,false)}
   CMD.gen={G,core,cg,rings,scr}}
  // lamps for the light pool (red in the bay, spine and heart, violet in the conduit hall and runs) and their floor pools
  const pools=[];const lamp=(x,y,z,mk,r)=>{const m=MOODS[mk];CMD.fix.push({x,y,z,c:m.lc,i:m.li,r:r||28,rm:null,top:false,used:false});pools.push([x,.05,z,Math.min(16,(r||28)*.5),m.lc,.28]);const q=glow(m.lc,2.2,.7);q.position.set(x,y,z);g.add(q)};
  for(const z of[170,200,230])for(const x of[-40,0,40])lamp(x,14,z,'K',44);for(let z=75;z<150;z+=25)lamp(0,8,z,'K',20);for(const x of[-35,0,35])for(const z of[25,50])lamp(x,12.5,z,'K',26);
  for(const x of[-30,30])for(const z of[-45,-15])lamp(x,8,z,'V',18);for(const x of[-50,-15,15,50])for(const z of[-120,-80])lamp(x,16,z,'V',30);lamp(0,9,-158,'K',18);for(const[x,z]of[[-35,-190],[35,-190],[-35,-240],[35,-240],[0,-185]])lamp(x,16,z,'V',46);
  // ceiling light strips: soft pale panels running the length of every room, so walls and floors read
  {const lsM=bas({color:0x8a7aa8});for(const r of CMDR){const n=Math.max(1,Math.round((r.x1-r.x0)/24));for(let i=0;i<n;i++){const x=r.x0+(i+.5)*(r.x1-r.x0)/n;B(x-.5,r.h-.25,r.z0+2,x+.5,r.h-.05,r.z1-2,lsM,false)}}}
  {const pm=poolMesh(pools);pm.userData.noShadow=true;g.add(pm)}
  for(const f of CMD.fix)f.rm=CMD.rooms.find(r=>f.x>=r.x0-1&&f.x<=r.x1+1&&f.z>=r.z0-1&&f.z<=r.z1+1)||null}
function cmdEnter(){cmdBuild();if(CMD.on)return;CMD.sv={boxes:boxes.slice(),rooms:ROOMS.slice(),fix:FIX.slice(),navw:NAVW.slice(),doorv:DOORV.slice()};
  boxes.length=0;for(const b of CMD.boxes)boxes.push(b);ROOMS.length=0;for(const r of CMD.rooms)ROOMS.push(r);FIX.length=0;for(const f of CMD.fix)FIX.push(f);NAVW.length=0;for(const w of CMD.navw)NAVW.push(w);DOORV.length=0;
  gridN=-1;NAV=null;SPN=null;COVER=null;COVERMAP=null;WPR.key=null;for(const q of LPOOL){if(q.f)q.f.used=false;q.f=null;q.k=0}worldShow(false);CMD.g.visible=true;CMD.on=true;
  if(CMD.sun0===undefined)CMD.sun0=sun.intensity;sun.intensity=CMD.sun0*.25;CMD.ex0=renderer.toneMappingExposure;renderer.toneMappingExposure=CMD.ex0*1.3}
function cmdLeave(){if(!CMD.on)return;const v=CMD.sv;boxes.length=0;for(const b of v.boxes)boxes.push(b);ROOMS.length=0;for(const r of v.rooms)ROOMS.push(r);FIX.length=0;for(const f of v.fix){f.used=false;f.top=false;FIX.push(f)}NAVW.length=0;for(const w of v.navw)NAVW.push(w);DOORV.length=0;for(const d of v.doorv)DOORV.push(d);
  gridN=-1;NAV=null;SPN=null;COVER=null;COVERMAP=null;WPR.key=null;for(const q of LPOOL){q.f=null;q.k=0}CMD.g.visible=false;CMD.on=false;CMD.ph='';try{latClear()}catch(e){}CMD.b15=CMD.b16=CMD.b17=null;worldShow(true);if(CMD.sun0!==undefined)sun.intensity=CMD.sun0;if(CMD.ex0!==undefined){renderer.toneMappingExposure=CMD.ex0;CMD.ex0=undefined}if(CMD.el)CMD.el.hidden=true}
function cmdSpawn(list){for(const[type,x,z,t]of list)queue.push({t:t||0,type,x,z,y:type>=5?1.5:6})}
function cmdStart(){cmdEnter();pos.set(0,0,186);yaw=Math.PI*0;pitch=0;vy=0;eye.set(pos.x,pos.y+EYE,pos.z);$('wave').textContent='3-2';LAST={m:4,s:2};
  msgT=0;$('msg').classList.remove('on');wave=6;CMD.b15=CMD.b16=CMD.b17=null;CMD.ph='in';CMD.t=0;CMD.hold=0;CMD.timer=0;CMD.w={};rowanJoin(true);fadeSet(1);fade(0,1.4);
  comm('R',"Generator readings, deep in the ship. Straight up the spine and through the conduit hall.");comm('R',"I've got the charge. You clear the way.");
  cmdSpawn([[5,-20,40],[5,20,45],[7,0,30,1],[8,-38,50,2],[6,30,25,3]])}
function cmdTick(dt){if(!CMD.on||state!=='playing')return;CMD.t+=dt;const BOSS=latTick(dt);const G=CMD.gen;if(G){G.core.rotation.y+=dt;G.rings.forEach((r,i)=>{r.rotation.z+=dt*(i%2?.4:-.3);r.position.y=6+i*4.4+Math.sin(CMD.t*1.3+i)*.4});G.cg.material.opacity=.45+Math.sin(CMD.t*(CMD.ph==='run'?9:2))*.15}
  let el=CMD.el;if(!el){el=CMD.el=document.createElement('div');el.style.cssText='position:absolute;left:50%;top:64%;transform:translateX(-50%);color:#ffd2e0;font:700 15px "Chakra Petch",sans-serif;letter-spacing:.14em;text-shadow:0 0 8px #000;pointer-events:none;white-space:nowrap;background:rgba(10,6,14,.55);padding:6px 12px;border:1px solid rgba(255,90,140,.5)';stage.appendChild(el)}
  el.hidden=true;const P=new T.Vector3();
  const bossObj=()=>{if(BOSS&&Math.hypot(BOSS.pos.x-pos.x,BOSS.pos.z-pos.z)<70){setObj('STAGE 3-2 · '+LATK[BOSS.type].name,BOSS.hp/BOSS.hp0);return true}return false};
  if(CMD.ph==='in'){P.set(0,1,-201);wpRoute(0,-201,'SHIELD GENERATOR');WPR.live=true;if(!bossObj())setObj('STAGE 3-2 · FIND THE SHIELD GENERATOR');
    if(pos.z<12&&!CMD.w.b){CMD.w.b=1;cmdSpawn([[5,-50,-85],[13,50,-90],[10,0,-110,1],[8,-55,-125,1.5],[13,-20,-75,2],[7,20,-78,2.5],[14,40,-120,3]]);CMD.b16=latSpawn(16,0,-118);comm('R',"Movement ahead. Lots of it.");comm('R',"Wait. That big one wears Lattice's face. Frost coming off it. Careful.")}
    if(pos.z<-136&&!CMD.w.c){CMD.w.c=1;cmdSpawn([[5,-40,-200],[13,40,-205],[14,-30,-240,1],[10,30,-238,1.5],[8,-45,-185,2.5]]);CMD.b15=latSpawn(15,0,-238);comm('R',"That's it. That's the heart of the shield. Clear the room and I'll set the charge.");comm('L',"You pulled my plugs, gardener. I kept copies.");comm('R',"That's Lattice. Bigger. Wrong.")}
    const d=Math.hypot(pos.x,pos.z+201.2),bossUp=CMD.b15&&enemies.includes(CMD.b15)&&!CMD.b15.dying&&CMD.b15.hp>0;if(CMD.b15&&!bossUp&&!CMD.w.k15){CMD.w.k15=1;comm('L',"There are... more of me.");comm('R',"Not on this ship. Stay down this time.")}if(d<3.6&&bossUp){el.hidden=false;el.textContent='THE REFORMED STILL STANDS · TAKE IT DOWN FIRST'}else if(d<3.6){const pad=(()=>{try{const gp=navigator.getGamepads&&navigator.getGamepads()[0];return gp&&gp.buttons[2]&&gp.buttons[2].pressed}catch(e){return false}})();
      const act=keys.KeyE||pad||touchUI;CMD.hold=act?CMD.hold+dt:Math.max(0,CMD.hold-dt*2);el.hidden=false;el.textContent=(touchUI?'STAND HERE':'HOLD E')+' · SET THE CHARGE · '+Math.round(Math.min(1,CMD.hold/3)*100)+'%';
      if(CMD.hold>=3){CMD.ph='run';CMD.timer=150;CMD.w={};comm('R',"Charge set. Two and a half minutes. Run!");say('CHARGE SET · GET BACK TO THE KESTREL',3);sfx('wave');G.scr.material.color.setHex(0xffd040)}}else CMD.hold=0}
  else if(CMD.ph==='run'){CMD.timer-=dt;const s=Math.max(0,Math.ceil(CMD.timer));P.set(0,1,192);wpRoute(0,192,'THE KESTREL');WPR.live=true;if(!bossObj())setObj('STAGE 3-2 · BACK TO THE KESTREL · '+Math.floor(s/60)+':'+String(s%60).padStart(2,'0'));
    CMD.al=(CMD.al||0)-dt;if(CMD.al<=0){CMD.al=1.1;tone('square',880,660,.18,.025)}
    if(pos.z>-140&&!CMD.w.b){CMD.w.b=1;cmdSpawn([[7,-55,-70],[7,55,-70,.5],[5,-20,-130,1],[5,20,-130,1.5]]);comm('R',"They know. Everything on this ship is coming for us.")}
    if(pos.z>-60&&!CMD.w.c){CMD.w.c=1;cmdSpawn([[14,0,55],[13,-40,50,.5],[5,40,50,1],[8,-30,20,1.5],[13,30,20,2]]);CMD.b17=latSpawn(17,0,40);comm('R',"Fire up ahead! A third one, it's cutting us off!")}
    if(pos.z>60&&!CMD.w.d){CMD.w.d=1;cmdSpawn([[5,-40,230],[5,40,230,.5],[7,0,240,1]]);comm('R',"Bay's ahead. Almost there.")}
    if(Math.hypot(pos.x,pos.z-205)<11){CMD.ph='done';el.hidden=true;comm('R',"Go, go, go!");l3Done(32);return}
    if(CMD.timer<=0){CMD.ph='lost';flashW();hp=0;die();$('ovTitle').textContent='Too late';$('ovText').textContent='The charge went off with you still aboard. Two and a half minutes is enough: go straight back up the spine.';LAST={m:4,s:2};$('retry').textContent='Retry stage 3-2'}}}
