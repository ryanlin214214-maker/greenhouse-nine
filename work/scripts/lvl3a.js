// ===================== Mission 3 (Level 3) and Mission 4 (Level 4), v91 =====================
// Stages: 3-1 First Strike (flight: leave Meridian, the Nova warhead, the fleet jumps in, land on the command ship),
// 3-2 The Heart (on foot inside the command ship: plant the charge on the shield generator, run back),
// 3-3 Shot Down (flight: escape, the command ship blows, nine on your tail, the second ace),
// 4-1 Europa (crash landing on the ice). Flight stage numbers inside FLY: 31, 33, 41. Progress: M3 (1..4), key gh9-m3.
let M3=0,L3NEXT=null;try{M3=+localStorage.getItem('gh9-m3')||0}catch(e){}
function saveM3(n){if(n<=M3)return;M3=n;try{localStorage.setItem('gh9-m3',String(M3))}catch(e){}try{syncCont()}catch(e){}}
function contM3(){return M3>0&&M3<4}
const L3N={31:'3-1',32:'3-2',33:'3-3',41:'4-1'};
// start a Mission 3 / 4 stage from the Missions list, Continue or Retry
function l3StartAt(m,s){LAST={m,s};begin(true);NOSAVE=true;
  if(SAVE){cls=SAVE.cls;syncCls();guns=SAVE.guns.map(q=>mkGun(q.k,q.rar,q.pow,q.mods));{const q=JSON.parse(JSON.stringify({i:SAVE.inv||{g:[],a:[]},a:SAVE.arm||[0,1,2,3].map(p=>({t:4,rar:0,pow:1,p}))}));INV=q.i;ARMP=q.a}}
  else{guns=[0,1,2,3,4,5].map(k=>mkGun(k,3,6));{const t=Math.random()*4|0;ARMP=[0,1,2,3].map(p=>({t,rar:3,pow:6,p}))}}
  applyArmour();shield=shMax;try{attSync()}catch(e){}mission=null;gap=1e9;
  if(m===5){flyStart(41);return}if(s===2){cmdStart();return}flyStart(s===3?33:31)}
// the end-of-stage card for Missions 3 and 4
function l3Done(st){if(document.pointerLockElement)document.exitPointerLock();const k={31:1,32:2,33:3,41:4}[st];saveM3(k);cr(st===41?500:300);
  setState('paused');for(const id of['ovKeys','classes','loadout','superpick'])$(id).hidden=true;
  const TX={31:['Stage 3-1 complete',"The Nova warhead hit the command ship's shield at full yield and did nothing. Half the Wellmonger's fleet jumped in on top of you, and you put the Kestrel down inside the command ship anyway. Next: stage 3-2, find what feeds that shield."],
    32:['Stage 3-2 complete',"The charge is set on the shield generator and you made it back to the Kestrel with Rowan. Next: stage 3-3, get clear before it blows."],
    33:['Stage 3-3 complete',"The command ship is gone. So is the Kestrel's engine: the second ace, Sable, caught you over Europa. Next: Level 4, Europa."],
    41:['Level 4 · Europa',"The Kestrel is down on the ice of Europa, broken but in one piece, and Rowan is alive. Somewhere under this ice is Imani, and the Dark is coming down after you. To be continued."]}[st];
  $('ovTitle').textContent=TX[0];$('ovText').textContent=TX[1];
  L3NEXT=st===31?[4,2]:st===32?[4,3]:st===33?[5,1]:'menu';$('go').textContent=st===31?'Continue to stage 3-2':st===32?'Continue to stage 3-3':st===33?'Continue to Level 4':'Back to the title';
  $('retry').hidden=false;$('retry').textContent='Retry stage '+L3N[st];LAST={m:st===41?5:4,s:st===41?1:k};if(FLY)FLY.ph='done';CMD.ph=CMD.on?'done':CMD.ph;setObj('STAND BY')}
function l3Go(){const n=L3NEXT;L3NEXT=null;if(n==='menu'){reset();setState('menu');$('ovTitle').textContent='Greenhouse Nine';$('ovText').textContent='Level 4 is as far as the story goes for now.';$('go').textContent='New game';$('retry').hidden=true;try{syncCont()}catch(e){}return}l3StartAt(n[0],n[1])}

// ---------- shared materials and the Dark's ship kit (original design: a black blade-hull with a split prow, scale armour,
// a crown of swept fins, red-violet seams and a stern of six drive bells)
let DKM=null;function darkMats(){if(DKM)return DKM;
  const pt=paint(512,(g,S)=>{g.fillStyle='#575164';g.fillRect(0,0,S,S);for(let i=0;i<14;i++){const y=Math.random()*S,h=8+Math.random()*60;g.fillStyle='rgba('+(30+Math.random()*16|0)+','+(26+Math.random()*12|0)+','+(36+Math.random()*16|0)+',.9)';g.fillRect(0,y,S,h)}
    g.strokeStyle='rgba(8,6,12,.9)';g.lineWidth=3;for(let i=0;i<=8;i++){g.beginPath();g.moveTo(0,i*S/8);g.lineTo(S,i*S/8);g.stroke()}for(let i=0;i<=8;i++){const x=i*S/8+(i%2)*20;g.beginPath();g.moveTo(x,0);g.lineTo(x,S);g.stroke()}
    for(let i=0;i<40;i++){g.fillStyle='rgba(0,0,0,.35)';g.fillRect(Math.random()*S,Math.random()*S,6+Math.random()*30,3+Math.random()*10)}grime(g,S,900,.08)});
  pt.wrapS=pt.wrapT=T.RepeatWrapping;
  DKM={hull:std({map:pt,color:0xb8b0c4,roughness:.62,metalness:.2,emissive:0x4a3e64,emissiveMap:pt,emissiveIntensity:1.6}),hullD:std({map:pt,color:0x8c8498,roughness:.65,metalness:.2,emissive:0x2a2238,emissiveMap:pt,emissiveIntensity:1.6}),plate:std({color:0x5a5468,roughness:.55,metalness:.3,emissive:0x16101e}),
    seam:bas({color:0xff3a5c,fog:false}),vein:bas({color:0xa050ff,fog:false}),win:bas({color:0xff6a7a,fog:false}),bell:std({color:0x1a1720,roughness:.35,metalness:.9}),core:bas({color:0xffb0d0,fog:false})};
  return DKM}
// half-width of the hull's top view at z (prow at -5250, stern at +5250); the prow is split into two prongs
const DRW=[[-5250,330],[-4000,700],[-1500,1050],[1500,1150],[3800,900],[5250,700]];
function drW(z){for(let i=1;i<DRW.length;i++)if(z<=DRW[i][0]){const[a0,w0]=DRW[i-1],[a1,w1]=DRW[i],u=(z-a0)/(a1-a0);return w0+(w1-w0)*u}return 700}
let DRB=null;   // the dreadnought body (three sections: prow, middle, stern), built once and cloned for the smaller ships
const DSEC=[[-5250,-1800],[-1800,2000],[2000,5700]];
function dreadBody(){if(DRB)return DRB;const M=darkMats(),g=new T.Group(),SG=DSEC.map(()=>{const q=new T.Group();g.add(q);return q}),sec=z=>z<-1800?SG[0]:z<2000?SG[1]:SG[2];
  const outline=(k,zA,zB)=>{const s=new T.Shape(),R=[];R.push([drW(zB),zB]);for(let i=DRW.length-1;i>=0;i--){const[z,w]=DRW[i];if(z<zB&&z>zA)R.push([w,z])}
    if(zA<=-5250)R.push([330,-5250],[170,-5120],[0,-3600]);else R.push([drW(zA),zA]);const P=R.map(([x,z])=>[x*k,z]);const L=zA<=-5250?P.slice(0,-1).reverse():P.slice().reverse();
    s.moveTo(P[0][0],-P[0][1]);for(const[x,z]of P.slice(1))s.lineTo(x,-z);for(const[x,z]of L)s.lineTo(-x,-z);s.closePath();return s};
  const layer=(k,y0,h,mat,bev)=>{DSEC.forEach(([zA,zB],si)=>{const geo=new T.ExtrudeGeometry(outline(k,zA,Math.min(zB,5250)),{depth:h,bevelEnabled:true,bevelThickness:bev,bevelSize:bev,bevelSegments:2,curveSegments:1});geo.rotateX(-Math.PI/2);geo.translate(0,y0,0);
    const uv=geo.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/260,uv.getY(i)/260);SG[si].add(new T.Mesh(geo,mat))})};
  layer(.72,-230,110,M.hullD,30);layer(1,-110,200,M.hull,40);layer(.62,100,80,M.hull,30);layer(.3,190,90,M.hullD,24);
  const put=(geo,mat,list,fn)=>{SG.forEach((G,si)=>{const sub=list.filter(q=>sec(q[2])===G);if(!sub.length)return;const im=new T.InstancedMesh(geo,mat,sub.length),d=new T.Object3D();sub.forEach((q,i)=>{d.position.set(q[0],q[1],q[2]);d.rotation.set(0,0,0);d.scale.set(1,1,1);if(fn)fn(d,q);d.updateMatrix();im.setMatrixAt(i,d.matrix)});G.add(im)})};
  // scale armour along both flanks: two staggered rows of angled plates
  {const L=[];for(let z=-3900;z<5100;z+=300)for(const row of[0,1]){const zz=z+row*150,w=drW(zz),w2=drW(zz+40);const ang=Math.atan2(w2-w,40);if(Math.abs(zz)<300)continue;for(const s of[-1,1])L.push([s*(w+18),row?-40:45,zz,s*ang,s])}
   put(new T.BoxGeometry(30,70,290),M.plate,L,(d,q)=>d.rotation.set(0,-q[3],q[4]*.25))}
  // the crown: swept fins along the spine, and keel blades under it
  {const fin=(z,H,L,up)=>{const s=new T.Shape();s.moveTo(0,0);s.lineTo(L,0);s.lineTo(L*.92,H*.25);s.lineTo(L*.35,H);s.lineTo(L*.18,H*.95);s.closePath();const geo=new T.ExtrudeGeometry(s,{depth:26,bevelEnabled:true,bevelThickness:6,bevelSize:6,bevelSegments:1});
     geo.translate(-L/2,0,-13);geo.rotateY(-Math.PI/2);const m=new T.Mesh(geo,M.hullD);m.position.set(0,up?270:-230,z);if(!up)m.rotation.z=Math.PI;sec(z).add(m);
     const sm=new T.Mesh(new T.BoxGeometry(6,6,L*.7),M.seam);sm.position.set(0,up?270+H*.35:-230-H*.35,z-L*.05);sec(z).add(sm)};
   DFIN.forEach(([z,H,L])=>fin(z,H,L,true));[[-1000,380,1300],[1400,320,1100]].forEach(([z,H,L])=>fin(z,H,L,false))}
  // the stern: six drive bells with glowing throats
  {const bg=new T.CylinderGeometry(150,190,380,24,1,true);bg.rotateX(Math.PI/2);const th=new T.CircleGeometry(150,24);
   for(const[x,y]of[[-420,40],[0,40],[420,40],[-260,-150],[260,-150],[0,190]]){const b=new T.Mesh(bg,M.bell);b.position.set(x,y,5420);SG[2].add(b);const c=new T.Mesh(th,M.core);c.position.set(x,y,5300);SG[2].add(c);const gl2=glow(0xff4a8a,900,.55);gl2.position.set(x,y,5650);SG[2].add(gl2)}}
  // seams along the deck edges and violet veins on the spine; rows of dim red windows on the flanks
  {const L=[],V=[],W=[];for(let z=-3900;z<5100;z+=120){const w=drW(z);for(const s of[-1,1]){L.push([s*(w*1.0+2),112,z]);if(z%360===0&&Math.abs(z)>260)for(const y of[-60,10,70])W.push([s*(w+4),y,z+(y>0?120:0)])}if(z%240===0)V.push([0,290,z])}
   put(new T.BoxGeometry(10,6,110),M.seam,L);put(new T.BoxGeometry(14,8,180),M.vein,V);put(new T.BoxGeometry(14,26,220),M.win,W)}
  // superstructure blocks on the upper deck
  {const L=[];let sd=7;const rnd=()=>(sd=(sd*9301+49297)%233280)/233280;for(let i=0;i<46;i++){const z=-3200+rnd()*7600,w=drW(z)*.5,x=(rnd()-.5)*2*w;if(Math.abs(x)<80)continue;L.push([x,190+20,z,30+rnd()*120,40+rnd()*160,60+rnd()*220])}
   put(new T.BoxGeometry(1,1,1),M.plate,L,(d,q)=>{d.position.y=q[1]+q[4]/2;d.scale.set(q[3],q[4],q[5])})}
  g.traverse(o=>{if(o.isMesh)o.userData.noShadow=true});DRB=g;return g}
const DFIN=[[-2600,480,900],[-1500,700,1100],[-300,820,1200],[900,760,1150],[2100,600,1000],[3200,420,850]];
// collision boxes for the full-size dreadnought (local, meters): the hull layers in 750 m slices, the fins
function dreadBoxes(){const B=[];for(let z=-5250;z<5250;z+=750){const w=Math.min(drW(z),drW(z+750))*.96;B.push([-w,-150,z,w,95,z+750]);B.push([-w*.62,95,z,w*.62,185,z+750]);B.push([-w*.3,185,z,w*.3,285,z+750])}
  for(const[z,H,L]of DFIN)B.push([-20,270,z-L*.5,20,270+H*.7,z+L*.4]);
  for(let z=-5250;z<5250;z+=750){const w=Math.min(drW(z),drW(z+750))*.7;B.push([-w,-260,z,w,-150,z+750])}
  // the starboard bay: floor, roof, walls (the bay itself stays open)
  B.push([1150,-75,-215,1405,-40,215],[1150,85,-215,1405,115,215],[1150,-40,-215,1405,85,-195],[1150,-40,195,1405,85,215],[1120,-40,-195,1150,85,195]);return B}
// the landing bay on the starboard flank: a lit hangar blister open to +x
function dreadBay(){const M=darkMats(),g=new T.Group();const B=(x0,y0,z0,x1,y1,z1,m)=>{const o=new T.Mesh(new T.BoxGeometry(x1-x0,y1-y0,z1-z0),m);o.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);g.add(o);return o};
  B(1130,-75,-215,1405,-40,215,M.hullD);B(1130,85,-215,1405,115,215,M.hullD);B(1130,-40,-215,1405,85,-195,M.hull);B(1130,-40,195,1405,85,215,M.hull);B(1120,-40,-195,1150,85,195,M.plate);
  for(let z=-180;z<=180;z+=30){B(1154,-40,z-1.5,1405,-39.4,z+1.5,M.vein)}for(const s of[-1,1]){B(1150,-38,s*192,1405,-36,s*194,M.seam);B(1150,82,s*192,1405,84,s*194,M.seam)}
  for(let x=1170;x<1405;x+=24)for(const s of[-1,1]){const q=B(x,-39.6,s*150-3,x+10,-39.2,s*150+3,M.seam)}
  {const pd=new T.Mesh(new T.CylinderGeometry(22,22,.6,40),M.plate);pd.position.set(1260,-39.6,0);g.add(pd);const rg=new T.Mesh(new T.TorusGeometry(22,.5,6,48),M.vein);rg.rotation.x=Math.PI/2;rg.position.set(1260,-39.2,0);g.add(rg)}
  for(const[x,y,z]of[[1220,70,-120],[1220,70,120],[1330,70,-120],[1330,70,120],[1170,0,0]]){const q=glow(0xff4a7a,22,.22);q.position.set(x,y,z);g.add(q)}
  {const ff=new T.Mesh(new T.PlaneGeometry(430,125),bas({color:0xa060ff,transparent:true,opacity:.06,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending,fog:false}));ff.rotation.y=Math.PI/2;ff.position.set(1404,22,0);g.add(ff)}
  const L=new T.PointLight(0xff5a8a,0,600,1.2);L.position.set(1270,40,0);g.add(L);g.userData.L=L;return g}
// the energy shield: an ellipsoid with a fresnel rim, a hex cell pattern and ripples where something hits it
const SHR=new T.Vector3(2000,1300,6400);let SHM0=null;
function shieldMesh(){if(!SHM0)SHM0=new T.ShaderMaterial({uniforms:{uT:{value:0},uA:{value:.06},uH:{value:new T.Vector3(0,0,1e9)},uHT:{value:99},uHS:{value:1}},transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,fog:false,
  vertexShader:'varying vec3 vN;varying vec3 vV;varying vec3 vP;varying vec2 vU;void main(){vU=uv;vP=position;vec4 w=modelViewMatrix*vec4(position,1.);vV=-w.xyz;vN=normalMatrix*normal;gl_Position=projectionMatrix*w;}',
  fragmentShader:'uniform float uT;uniform float uA;uniform vec3 uH;uniform float uHT;uniform float uHS;varying vec3 vN;varying vec3 vV;varying vec3 vP;varying vec2 vU;'+
   'float hexd(vec2 p){p*=vec2(1.,1.1547);vec2 q=vec2(p.x+p.y*.5,p.y);vec2 i=floor(q),f=fract(q);float v=mod(i.x+i.y,3.);vec2 c=v<1.?vec2(0.):v<2.?vec2(1.):vec2(1.,0.);return length(f-c);}'+
   'void main(){float fr=pow(1.-abs(dot(normalize(vN),normalize(vV))),2.5);vec2 g=vU*vec2(260.,90.);float h=hexd(g);float edge=smoothstep(.42,.5,fract(h*1.7));'+
   'float d=length((vP-uH)/vec3(2000.,1300.,6400.))*6400.;float r=uHT*2600.*uHS;float ring=exp(-pow((d-r)/(260.*uHS),2.))*exp(-uHT*.9);float core=exp(-d/(900.*uHS))*exp(-uHT*1.6)*1.4;'+
   'float a=uA*(.1+fr*1.5)+(ring+core)*(.6+edge)+uA*edge*.6*fr;vec3 c=mix(vec3(.55,.15,1.),vec3(1.,.35,.6),fr);c=mix(c,vec3(1.,.85,1.),clamp(core,0.,1.));gl_FragColor=vec4(pow(c,vec3(2.2))*a,a);}'});
  const m=new T.Mesh(new T.SphereGeometry(1,96,48),SHM0.clone());m.scale.copy(SHR);m.renderOrder=6;return m}
function shieldHit(S,wp,k){const D=S.dr;if(!D||!D.sh)return;const u=D.sh.material.uniforms;D.g.worldToLocal(u.uH.value.copy(wp));u.uHT.value=0;u.uHS.value=k||1}
function inShield(S,p){const D=S.dr;if(!D||D.shOff)return false;L3A.copy(p);D.g.worldToLocal(L3A);return(L3A.x/SHR.x)**2+(L3A.y/SHR.y)**2+(L3A.z/SHR.z)**2<1}
const L3A=new T.Vector3(),L3B=new T.Vector3();
// the full dreadnought: body, bay, shield, collision; split into prow, middle and stern groups for when it breaks up
function dreadModel(){const g=new T.Group(),body=dreadBody().clone();g.add(body);const parts={prow:body.children[0],mid:body.children[1],stern:body.children[2]};
  const bay=dreadBay();parts.mid.add(bay);const sh=shieldMesh();g.add(sh);return{g,parts,bay,sh,boxes:dreadBoxes(),bayP:new T.Vector3(1260,-36,0)}}
// a smaller ship of the same fleet: the body only, scaled (cruisers about 1.7 km, frigates about 370 m)
function fleetShip(k){const g=new T.Group(),b=dreadBody().clone();b.scale.setScalar(k);g.add(b);g.userData.k=k;return g}

// ---------- the hyperspace arrival: a portal tears open, a ship bursts through at enormous speed and brakes hard
let PORTM=null;function portalMat(){if(!PORTM)PORTM=new T.ShaderMaterial({uniforms:{uT:{value:0},uA:{value:1}},transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,fog:false,
  vertexShader:'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'uniform float uT;uniform float uA;varying vec2 vU;void main(){vec2 p=vU*2.-1.;float r=length(p),a=atan(p.y,p.x);float sw=sin(a*9.+r*22.-uT*9.)*.5+.5;float sw2=sin(a*5.-r*14.+uT*6.)*.5+.5;'+
   'float core=exp(-r*r*5.);float rim=exp(-pow((r-.92)*9.,2.));float m=(sw*.55+sw2*.45)*(1.-smoothstep(.75,1.,r))*.8+core*1.4+rim*1.6;vec3 c=mix(vec3(.5,.2,1.),vec3(1.,.4,.7),sw2);c=mix(c,vec3(1.,.95,1.),clamp(core,0.,1.));'+
   'float al=clamp(m,0.,2.)*uA*(1.-smoothstep(.98,1.,r));gl_FragColor=vec4(pow(c,vec3(2.2))*al,al);}'});return PORTM}
const L3FX=[];   // live portals and effects, ticked in l3FxTick
function portalOpen(S,p,n,R,ship,opts){opts=opts||{};const g=new T.Group();g.position.copy(p);g.lookAt(p.x+n.x,p.y+n.y,p.z+n.z);scene.add(g);
  const disk=new T.Mesh(new T.CircleGeometry(1,64),portalMat().clone());g.add(disk);const ring=new T.Mesh(new T.TorusGeometry(1,.03,8,96),bas({color:0xd8a0ff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,fog:false}));g.add(ring);
  const fl=glow(0xe0b0ff,1,.9);g.add(fl);g.scale.setScalar(.01);const f={kind:'portal',g,disk,ring,fl,t:0,R,n:n.clone(),p:p.clone(),ship,sp:opts.sp||60,hold:opts.hold||2.2,v0:opts.v0||Math.max(2500,R*12),done:false,onOut:opts.onOut||null,en:opts.en||null,streak:null};
  if(ship){ship.visible=false;ship.position.copy(p);ship.lookAt(p.x+n.x,p.y+n.y,p.z+n.z);if(!opts.fwdZ)ship.rotateY(Math.PI)}
  L3FX.push(f);if(cam.position.distanceTo(p)<9000){sfx('warp');tone('sawtooth',60,30,1.6,.05)}return f}
function l3FxTick(S,dt){for(let i=L3FX.length-1;i>=0;i--){const f=L3FX[i];f.t+=dt;
  if(f.kind==='portal'){const t=f.t,u=t<.5?1-Math.pow(1-t/.5,3):t>f.hold?Math.max(0,1-(t-f.hold)/.8):1;f.g.scale.setScalar(Math.max(.01,f.R*u));f.disk.material.uniforms.uT.value=t;f.disk.material.uniforms.uA.value=u;
    f.fl.material=f.fl.material;f.fl.scale.setScalar(t<.7?2.5+t*4:Math.max(.01,5*(1-(t-.7)/1.2)));
    if(t>=.55&&!f.out){f.out=1;if(f.onOut)try{f.onOut()}catch(e){console.error(e)}if(f.ship){f.ship.visible=true;f.st=0;f.flare=glow(0xf4dcff,f.R*1.6,1);f.flare.material=f.flare.material.clone();scene.add(f.flare)}const sh=new T.Mesh(new T.TorusGeometry(1,.06,8,64),bas({color:0xffd0ff,transparent:true,opacity:.8,blending:T.AdditiveBlending,depthWrite:false,fog:false}));sh.position.copy(f.p);sh.lookAt(f.p.x+f.n.x,f.p.y+f.n.y,f.p.z+f.n.z);scene.add(sh);L3FX.push({kind:'ring',g:sh,t:0,R:f.R*3,life:1.4});
      if(cam.position.distanceTo(f.p)<9000){sfx('boom');if(!reduced)shake=Math.max(shake,Math.min(.5,f.R*30/Math.max(400,cam.position.distanceTo(f.p))))}}
    if(f.out&&f.ship&&f.st!==undefined){f.st+=dt;const v=f.sp+f.v0*Math.exp(-f.st*4.5);f.ship.position.addScaledVector(f.n,v*dt);const k=f.ship.userData.k||1;
      if(!f.streak){f.streak=new T.Mesh(new T.CylinderGeometry(1,1,1,8,1,true),bas({color:0xf0c0ff,transparent:true,opacity:.6,blending:T.AdditiveBlending,depthWrite:false,fog:false}));scene.add(f.streak)}
      if(f.flare){f.flare.position.copy(f.ship.position).addScaledVector(f.n,f.R*.35*(f.ship.userData.k?1:0));f.flare.material.opacity=Math.max(0,1-f.st/1.6)}const L=f.ship.position.distanceTo(f.p),w=Math.max(4,f.R*.1);f.streak.position.copy(f.p).addScaledVector(f.n,L/2);f.streak.lookAt(f.ship.position);f.streak.rotateX(Math.PI/2);f.streak.scale.set(w,L,w);f.streak.material.opacity=.95*Math.exp(-f.st*1.8);
      if(f.st>1.6){scene.remove(f.streak);f.streak=null;if(f.flare){scene.remove(f.flare);f.flare=null}f.st=undefined;if(f.en){f.en.p.copy(f.ship.position)}}}
    if(t>f.hold+.8&&(!f.ship||f.st===undefined)){scene.remove(f.g);if(f.streak)scene.remove(f.streak);L3FX.splice(i,1)}}
  else if(f.kind==='ring'){const u=f.t/f.life;f.g.scale.setScalar(Math.max(.01,f.R*(.2+u)));f.g.material.opacity=.8*(1-u);if(u>=1){scene.remove(f.g);L3FX.splice(i,1)}}
  else if(f.kind==='fire'){const u=f.t/f.life;f.g.scale.setScalar(f.R*(f.grow?(.3+u*.9):(1-u*.3)));f.g.material.opacity=Math.max(0,f.op*(1-u)*(.85+Math.random()*.3));if(u>=1){scene.remove(f.g);L3FX.splice(i,1)}}
  else if(f.kind==='glide'){f.fn(dt,f);if(f.t>f.life){if(f.end)f.end(f);L3FX.splice(i,1)}}}}
function bigFire(p,R,life,col,op,grow){const g=new T.Sprite(new T.SpriteMaterial({map:glowTex,color:col||0xffa050,blending:T.AdditiveBlending,depthWrite:false,transparent:true,opacity:op||1,fog:false}));g.position.copy(p);g.scale.setScalar(R*.3);scene.add(g);L3FX.push({kind:'fire',g,t:0,R,life,op:op||1,grow:grow!==false})}
function l3FxClear(){for(const f of L3FX){if(f.g)scene.remove(f.g);if(f.streak)scene.remove(f.streak);if(f.flare)scene.remove(f.flare)}L3FX.length=0}
