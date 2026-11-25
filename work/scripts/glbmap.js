// ---- v93: imported maps (GLB). The conventions are in dev/glb/MAPS.md: metres, +Y up; FLOOR_* walkable floor, SOLID_*
// visible and solid, COL_* invisible collision, SPAWN_player / SPAWN_enemy_N empties, LIGHT_* empties (extras: color,
// range, intensity). Collision meshes are split into their separate pieces (welded vertices, connected triangles), and
// each piece becomes an axis-aligned box. The map lives inside Thalassa's navigation field (220 x 520 m), like the
// command ship interior, so enemies, cover, lights and the waypoint all work unchanged; it is moved to the centre if
// it was authored elsewhere. Loading: a file published next to the page (maps/NAME) first, then an inlined copy.
const GLBM={on:false,g:null,name:'',boxes:[],rooms:[],fix:[],navw:[],sp:null,sv:null};
function glbSrc(name){const inl=()=>{const el=document.getElementById('glb-'+name.replace(/\W/g,'_'));if(!el)throw new Error('map not found: '+name);const b=atob(el.textContent.trim()),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u.buffer};
  // 1) maps/NAME.glb beside the page; 2) maps/NAME.glb.txt, the same file as base64 text (for hosts that do not serve .glb,
// such as claude.ai artifacts); 3) the copy inlined in the page
  const b64=t=>{const b=atob(t.replace(/\s+/g,'')),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u.buffer};
  return fetch('maps/'+name).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()})
    .catch(()=>fetch('maps/'+name+'.txt').then(r=>{if(!r.ok)throw 0;return r.text()}).then(b64)).catch(inl)}
function glbParse(buf){return new Promise((ok,no)=>new (T.GLTFLoader||window.GLTFLoader)().parse(buf,'',ok,no))}
// the separate pieces of a mesh, as world-space boxes
function glbBoxes(o){const G=o.geometry,P=G.attributes.position,n=P.count,M=o.matrixWorld,key=new Map(),id=new Int32Array(n),par=[],V=new T.Vector3();
  const f=a=>{while(par[a]!==a){par[a]=par[par[a]];a=par[a]}return a};
  for(let i=0;i<n;i++){V.fromBufferAttribute(P,i);const k=Math.round(V.x*1e3)+','+Math.round(V.y*1e3)+','+Math.round(V.z*1e3);let w=key.get(k);if(w===undefined){w=par.length;par.push(w);key.set(k,w)}id[i]=w}
  const I=G.index?G.index.array:null,nt=I?I.length:n;for(let t=0;t<nt;t+=3){const a=f(id[I?I[t]:t]),b=f(id[I?I[t+1]:t+1]),c=f(id[I?I[t+2]:t+2]);par[b]=a;par[f(c)]=a}
  const B=new Map();for(let i=0;i<n;i++){const r=f(id[i]);let b=B.get(r);if(!b){b=new T.Box3();B.set(r,b)}b.expandByPoint(V.fromBufferAttribute(P,i).applyMatrix4(M))}
  return[...B.values()].filter(b=>!b.isEmpty())}
function glbBuild(gltf,name){const root=gltf.scene;root.updateMatrixWorld(true);
  const BB=new T.Box3().setFromObject(root);if(BB.min.x<-AX+3||BB.max.x>AX-3||BB.min.z<-AZ+3||BB.max.z>AZ-3){const c=BB.getCenter(new T.Vector3());root.position.x-=c.x;root.position.z-=c.z;root.updateMatrixWorld(true);BB.setFromObject(root)}
  const bx=[],fx=[],nw=[],sp={p:null,yaw:0,e:[]},stat={meshes:0,tris:0,mats:new Set(),pieces:0};
  root.traverse(o=>{const n=o.name||'',pn=(o.parent&&o.parent.name)||'',tag=/^(COL|FLOOR|SOLID)_/.exec(n)||/^(COL|FLOOR|SOLID)_/.exec(pn);
    if(o.isMesh){stat.meshes++;stat.tris+=(o.geometry.index?o.geometry.index.count:o.geometry.attributes.position.count)/3;o.castShadow=o.receiveShadow=true;
      for(const m of(Array.isArray(o.material)?o.material:[o.material])){if(!m)continue;stat.mats.add(m.name||m.uuid);if(m.isMeshStandardMaterial){m.envMapIntensity=.45;if(m.map)m.map.anisotropy=ANISO}}
      if(tag){for(const b of glbBoxes(o)){stat.pieces++;const q={lo:[b.min.x,b.min.y,b.min.z],hi:[b.max.x,b.max.y,b.max.z]};if(tag[1]==='FLOOR')q.floor=true;bx.push(q);
          // a thin wall that reaches the floor also goes on the pathfinding wall list, so it blocks even between grid cells
          const dx=b.max.x-b.min.x,dz=b.max.z-b.min.z;if(b.min.y<.6&&b.max.y-b.min.y>1.6&&tag[1]!=='FLOOR'){if(dx<1.6&&dz>dx)nw.push(['x',(b.min.x+b.max.x)/2,b.min.z,b.max.z]);else if(dz<1.6)nw.push(['z',(b.min.z+b.max.z)/2,b.min.x,b.max.x])}}
        if(tag[1]==='COL')o.visible=false}}
    else if(/^SPAWN_player/.test(n)){sp.p=o.getWorldPosition(new T.Vector3());const d=new T.Vector3(0,0,-1).applyQuaternion(o.getWorldQuaternion(new T.Quaternion()));sp.yaw=Math.atan2(-d.x,-d.z)}
    else if(/^SPAWN_enemy/.test(n))sp.e.push(o.getWorldPosition(new T.Vector3()))
    else if(/^LIGHT_/.test(n)){const p=o.getWorldPosition(new T.Vector3()),u=o.userData||{};fx.push({x:p.x,y:p.y,z:p.z,c:new T.Color(u.color||'#ffe2c0').getHex(),i:+u.intensity||1.3,r:+u.range||24,rm:null,top:false,used:false})}});
  const rm={n:'MAP '+name.toUpperCase(),x0:Math.floor(BB.min.x),x1:Math.ceil(BB.max.x),z0:Math.floor(BB.min.z),z1:Math.ceil(BB.max.z),h:Math.max(3,BB.max.y)};MOODK[rm.n]='A';
  for(const q of fx)q.rm=rm;if(!sp.p){const c=BB.getCenter(new T.Vector3());sp.p=new T.Vector3(c.x,BB.min.y,c.z)}
  stat.mats=stat.mats.size;stat.tris=Math.round(stat.tris);
  Object.assign(GLBM,{g:root,name,boxes:bx,rooms:[rm],fix:fx,navw:nw,sp,stat});return GLBM}
function glbEnter(gltf,name){glbLeave();try{cmdLeave()}catch(e){}glbBuild(gltf,name);const M=GLBM;
  M.sv={boxes:boxes.slice(),rooms:ROOMS.slice(),fix:FIX.slice(),navw:NAVW.slice(),doorv:DOORV.slice()};
  boxes.length=0;for(const b of M.boxes)boxes.push(b);ROOMS.length=0;for(const r of M.rooms)ROOMS.push(r);FIX.length=0;for(const f of M.fix)FIX.push(f);
  NAVW.length=0;for(const w of M.navw)NAVW.push(w);DOORV.length=0;
  gridN=-1;NAV=null;SPN=null;COVER=null;COVERMAP=null;WPR.key=null;for(const q of LPOOL){if(q.f)q.f.used=false;q.f=null;q.k=0}
  worldShow(false);scene.add(M.g);M.on=true;
  pos.set(M.sp.p.x,M.sp.p.y+.02,M.sp.p.z);yaw=M.sp.yaw;pitch=0;vy=0;eye.set(pos.x,pos.y+EYE,pos.z);
  if(M.sp.e.length)cmdSpawn(M.sp.e.map((p,i)=>[[5,7,6][i%3],p.x,p.z,1+i*1.5]))}
function glbLeave(){const M=GLBM;if(!M.on)return;const v=M.sv;
  boxes.length=0;for(const b of v.boxes)boxes.push(b);ROOMS.length=0;for(const r of v.rooms)ROOMS.push(r);FIX.length=0;for(const f of v.fix){f.used=false;f.top=false;FIX.push(f)}
  NAVW.length=0;for(const w of v.navw)NAVW.push(w);DOORV.length=0;for(const d of v.doorv)DOORV.push(d);
  gridN=-1;NAV=null;SPN=null;COVER=null;COVERMAP=null;WPR.key=null;for(const q of LPOOL){q.f=null;q.k=0}
  if(M.g)scene.remove(M.g);M.on=false;worldShow(true)}
// the test map from the Missions list: a fresh run with good gear, no waves; three robots come down the corridor
function glbStart(name){LAST={m:9,s:1};begin(true);NOSAVE=true;mission=null;gap=1e9;
  guns=[0,1,2,3,4,5].map(k=>mkGun(k,3,6));try{applyArmour();shield=shMax;attSync()}catch(e){}
  if(typeof fadeSet==='function')fadeSet(1);say('Loading map · '+name,30);
  return glbSrc(name).then(glbParse).then(g=>{glbEnter(g,name);$('wave').textContent='MAP';say('Imported map · '+name,2.5);if(typeof fade==='function')fade(0,.8);return GLBM.stat})
    .catch(e=>{say('Map failed to load: '+(e&&e.message||e),6);if(typeof fade==='function')fade(0,.4);throw e})}
