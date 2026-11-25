// ---------- v91b: the Lattice family as bosses aboard the command ship, and the Dark's own troops.
// The Lattice models are the owner's GLBs, packed by `lat/pack2.py`: the body the three share is stored once, each variant
// adds its own shoulder and chest parts; geometry is grouped by limb (torso, thighs, shins, upper arms, forearms) and merged
// per material, positions quantized to 16 bits, normals rebuilt on load. In play each boss is a heavy walker underneath
// (an invisible proxy that runs the normal enemy AI, takes damage from every weapon and drives the leg and torso pose);
// the Lattice limbs copy that pose at their own joints.
let LATD=null;
function latData(){if(LATD)return LATD;const H=JSON.parse(document.getElementById('latjson').textContent),b=atob(document.getElementById('latbin').textContent.trim()),u8=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u8[i]=b.charCodeAt(i);
  const geo=g=>{if(g.geo)return g.geo;const q=new Uint16Array(u8.buffer,g.o,g.v*3),p=new Float32Array(g.v*3),pv=H.piv[g.s]||[0,0,0];for(let i=0;i<g.v;i++)for(let k=0;k<3;k++)p[i*3+k]=H.mn[k]+q[i*3+k]*H.sc[k]-pv[k];
    const ix=g.w===4?new Uint32Array(u8.buffer,g.oi,g.i):new Uint16Array(u8.buffer,g.oi,g.i);const G=new T.BufferGeometry();G.setAttribute('position',new T.BufferAttribute(p,3));G.setIndex(new T.BufferAttribute(ix.slice(),1));G.computeVertexNormals();G.computeBoundingSphere();return g.geo=G};
  LATD={H,geo,mats:{}};return LATD}
function latMats(kind){const D=latData();if(D.mats[kind])return D.mats[kind];const M={};for(const m of D.H.mats[kind]){const e=m.e,el=Math.max(e[0],e[1],e[2]);
    const mt=new T.MeshStandardMaterial({color:new T.Color().setRGB(m.c[0],m.c[1],m.c[2]),metalness:Math.min(1,m.m),roughness:Math.max(.18,m.r)});if(el>0){mt.emissive=new T.Color().setRGB(e[0]/el,e[1]/el,e[2]/el);mt.emissiveIntensity=Math.min(3.2,el*.6)}M[m.n]=mt}
  return D.mats[kind]=M}
// one Lattice body: root (feet at y 0, facing +z) > pelvis group (torso and head) + thighs > shins, and upper arms > forearms
function latModel(kind){const D=latData(),H=D.H,M=latMats(kind),root=new T.Group(),seg={};
  const mk=(n,par,pv)=>{const q=new T.Group();q.position.set(pv[0],pv[1],pv[2]);par.add(q);seg[n]=q;return q};
  const tor=new T.Group();root.add(tor);seg.tor=tor;
  for(const s of['L','R']){const th=mk('th'+s,root,H.piv['th'+s]),kp=H.piv['sh'+s],hp=H.piv['th'+s];mk('sh'+s,th,[kp[0]-hp[0],kp[1]-hp[1],kp[2]-hp[2]]);
    const ua=mk('ua'+s,tor,H.piv['ua'+s]),ep=H.piv['fa'+s],sp=H.piv['ua'+s];mk('fa'+s,ua,[ep[0]-sp[0],ep[1]-sp[1],ep[2]-sp[2]])}
  for(const g of H.common.concat(H.own[kind]||[])){const m=new T.Mesh(D.geo(g),M[g.m]);m.castShadow=true;(seg[g.s]||tor).add(m)}
  root.userData.seg=seg;return root}
const LATK={15:{kind:'reformed',name:'THE REFORMED · LATTICE',hp:1200,sc:1,col:0xff7a2a},16:{kind:'warden',name:'CRYO WARDEN',hp:600,sc:.86,col:0x6fe3ff},17:{kind:'revenant',name:'EMBER REVENANT',hp:600,sc:.86,col:0xff3a2a}};
// the proxy walkers' profiles: slow, no jetpack, never takes cover
GP[15]={hp:1,spd:2.1,near:5,far:30,strafe:.15,atk:'rocket',score:2000,col:'#ff7a2a',spark:0xff8a3a};
GP[16]={hp:1,spd:2.4,near:8,far:28,strafe:.3,atk:'rifle',score:1200,col:'#6fe3ff',spark:0x6fd8ff};
GP[17]={hp:1,spd:2.9,near:2,far:16,strafe:.2,atk:'shotgun',score:1200,col:'#ff3a2a',spark:0xff6a3a};
// the Dark's troops: original designs. Reaver: tall, lean, obsidian carapace, a blade along each forearm, fast. Maul: a
// hunched, heavy brute with a bony spine and a two-handed rift cannon.
GP[13]={hp:7,spd:5.6,near:0,far:60,strafe:.2,atk:'melee',score:260,col:'#b050ff',spark:0xb050ff,intro:"Those aren't machines. That's the Dark itself, in armour. Watch the blades, they close fast."};
GP[14]={jet:0,hp:16,spd:2.5,near:4,far:16,strafe:.25,atk:'shotgun',score:420,col:'#ff3a5c',spark:0xff5a7a,intro:"Big one. That's flesh under the plate, with a cannon to match. Keep moving and hit it from the side."};
ER[13]=.85;ER[14]=1.35;ER[15]=2.3;ER[16]=2;ER[17]=2;
// ---- the bosses in play
function latSpawn(type,x,z){const L=LATK[type];const e=mk(type,x,1.5,z);enemies.push(e);e.hp=e.hp0=L.hp;e.r=ER[type];e.hy=1.8*L.sc;e.sh=0;if(e.shell){e.g.remove(e.shell);e.shell=null}e.unf=1;
  e.g.children[0].visible=false;const m=latModel(L.kind);m.scale.setScalar(L.sc);e.g.add(m);e.lat={m,seg:m.userData.seg,t:0,sp:4,sum:0,type,dead:0};m.traverse(o=>{if(o.isMesh)e.parts.push([o,o.material])});
  const q=glow(L.col,6,.35);q.position.set(0,3.6*L.sc,0);m.add(q);return e}
const LATDEB=[];
function latTick(dt){const SG=['th','sh'],R0=e=>e.rig&&e.rig.segs;let boss=null;
  for(const e of enemies){if((e.type===13||e.type===14)&&e.unf<1)e.unf=1;const L=e.lat;if(!L)continue;const S=R0(e);
    if(!L.y0){e.g.updateMatrixWorld(true);const bb=new T.Box3().setFromObject(e.g.children[0]);L.y0=1;L.dy=bb.min.y-e.g.position.y;L.m.position.y=L.dy}
    if(e.dying>0){if(!L.dead){L.dead=1;latBreak(e)}continue}
    if(!boss||e.type===15)boss=e;
    // legs, pelvis tilt and torso follow the proxy walker's pose; arms swing with the walk and rise to attack
    if(S){S.legs.forEach(([h,k],i)=>{const s=i?'R':'L';L.seg['th'+s].rotation.copy(h.rotation);L.seg['sh'+s].rotation.copy(k.rotation)});L.seg.tor.rotation.set(S.tor.rotation.x*.6,S.tor.rotation.y*.6,S.tor.rotation.z*.6)}
    L.t+=dt;const mv=Math.min(1,Math.hypot(e.svx||0,e.svz||0)/2),sw=Math.sin(L.t*3.4)*.45*mv,atk=Math.max(0,L.atk||0);L.atk=(L.atk||0)-dt;
    L.seg.uaL.rotation.set(sw-atk*1.6,0,-.12);L.seg.uaR.rotation.set(-sw-atk*1.6,0,.12);L.seg.faL.rotation.set(-.35-atk*.6,0,0);L.seg.faR.rotation.set(-.35-atk*.6,0,0);
    // specials
    L.sp-=dt;const d=Math.hypot(pos.x-e.pos.x,pos.z-e.pos.z);
    if(L.sp<=0&&d<34){L.atk=.9;
      if(e.type===15||e.type===17){if(d<16){L.sp=e.type===15?6:5;const rg=mesh(GEO.ring,slamMat,1,1,1,pos.x,.12,pos.z);rg.rotation.x=-Math.PI/2;scene.add(rg);slams.push({g:rg,t:1.2,T:1.2,r:e.type===15?6:4.5,dmg:e.type===15?22:16,x:pos.x,y:0,z:pos.z});sfx('mortar');if(e.type===17)PFX.fire(e.pos.clone(),{n:14})}else L.sp=2}
      if(e.type===16||e.type===15&&d>=16){L.sp=e.type===16?4.5:7;const P0=e.pos.clone();P0.y+=3*LATK[e.type].sc;const dx=eye.x-P0.x,dy=eye.y-P0.y,dz=eye.z-P0.z,dd=Math.hypot(dx,dy,dz)||1;
        for(let k=-2;k<=2;k++){const a=k*.12,c=Math.cos(a),s2=Math.sin(a);bolt(P0,(dx*c-dz*s2)/dd,dy/dd,(dx*s2+dz*c)/dd,dd,.02,30,e.type===16?7:9,1)}sfx('spit')}}
    if(e.type===15&&!L.sum&&e.hp<e.hp0*.5){L.sum=1;comm('L',"Did you think there was only one of me?");cmdSpawn([[13,-40,-200],[13,40,-200,.6],[14,0,-240,1.2]])}}
  for(let i=LATDEB.length-1;i>=0;i--){const q=LATDEB[i];q.t+=dt;q.v.y-=9.8*dt;q.o.position.addScaledVector(q.v,dt);q.o.rotation.x+=q.w.x*dt;q.o.rotation.z+=q.w.z*dt;if(q.o.position.y<q.r){q.o.position.y=q.r;q.v.y=-q.v.y*.25;q.v.x*=.6;q.v.z*=.6;q.w.multiplyScalar(.6)}
    if(q.t>14){scene.remove(q.o);LATDEB.splice(i,1)}}
  return boss}
function latBreak(e){const L=e.lat;L.m.updateMatrixWorld(true);const c=e.pos.clone();c.y+=2;PFX.boom(c,3.2);sparkle(c,0xffb238,30,14);sfx('boom');setTimeout(()=>sfx('boom'),220);if(!reduced)shake=Math.max(shake,.5);cr(250);
  for(const k in L.seg){const o=L.seg[k];scene.attach(o);const dir=o.getWorldPosition(new T.Vector3()).sub(c).normalize();LATDEB.push({o,v:dir.multiplyScalar(4+Math.random()*5).add(new T.Vector3(0,4+Math.random()*4,0)),w:new T.Vector3((Math.random()-.5)*3,0,(Math.random()-.5)*3),t:0,r:.6})}
  PFX.emit(v=>{v.copy(c);return true},{rate:16,dur:6,fire:true,ss:[1.5,5],slife:2.4,far:300,c0:.15,c1:.4,alpha:.6})}
function latClear(){for(const q of LATDEB)scene.remove(q.o);LATDEB.length=0}
