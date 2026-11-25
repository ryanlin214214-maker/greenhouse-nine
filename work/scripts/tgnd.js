// Meridian grounding check: every instance and small mesh in the hub dressing, every moving NPC, glows. Prints floating/sunk.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:640,height:400}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(4000);
const X=c=>q.evaluate(c=>window.__x(c),c);
await X("INTRO.on=false;setState('playing');window.__freeze=true;enemies.length=0");await q.evaluate(()=>window.__hub('enter'));await q.waitForTimeout(1500);
const r=await X(`(()=>{const G=HUB.g;G.updateMatrixWorld(true);const D=G.children[1];const OX=D.position.x,OZ=D.position.z;
 const items=[];const bb=new T.Box3(),m4=new T.Matrix4();let id=0;
 const nm=o=>{const g=o.geometry;const p=g&&g.parameters;return (o.isInstancedMesh?'I:':'M:')+(g?g.type.replace('Geometry',''):'')+(p?'('+Object.values(p).slice(0,3).map(v=>typeof v==='number'?+v.toFixed(2):'').join(',')+')':'')+'/'+(o.material&&o.material.color?o.material.color.getHexString():'')};
 D.traverse(o=>{if(!o.isMesh||!o.visible)return;let vis=true;o.traverseAncestors(a=>{if(!a.visible)vis=false});if(!vis)return;const g=o.geometry;if(!g.boundingBox)g.computeBoundingBox();
  if(o.isInstancedMesh){for(let i=0;i<o.count;i++){o.getMatrixAt(i,m4);m4.premultiply(o.matrixWorld);const b2=g.boundingBox.clone().applyMatrix4(m4);items.push({b:b2,o,n:nm(o),i,id:id++})}}
  else{const b2=g.boundingBox.clone().applyMatrix4(o.matrixWorld);const s=b2.getSize(new T.Vector3());if(Math.max(s.x,s.z)<60)items.push({b:b2,o,n:nm(o),i:-1,id:id++})}});
 // grid for speed
 const C=20,grid=new Map(),key=(x,z)=>Math.floor(x/C)+','+Math.floor(z/C);for(const it of items){for(let x=Math.floor(it.b.min.x/C);x<=Math.floor(it.b.max.x/C);x++)for(let z=Math.floor(it.b.min.z/C);z<=Math.floor(it.b.max.z/C);z++){const k=x+','+z;if(!grid.has(k))grid.set(k,[]);grid.get(k).push(it)}}
 const BX=boxes;const res=[];
 const flat=it=>{const s=it.b.getSize(new T.Vector3());return s.y<.02};
 const supAt=(x,z,y0,it)=>{let sup=-1e9;const lx=x-OX,lz=z-OZ,rr=Math.hypot(lx,lz);if(rr<1201||Math.abs(lx)<40&&lz>0)sup=0;
   if(y0>111.4&&rr>515&&rr<842)sup=Math.max(sup,112);
   for(const bx of BX){if(x>=bx.lo.x&&x<=bx.hi.x&&z>=bx.lo.z&&z<=bx.hi.z&&bx.hi.y<=y0+.1)sup=Math.max(sup,bx.hi.y)}
   for(const o2 of (grid.get(key(x,z))||[])){if(o2===it||o2.o===it.o&&it.i<0)continue;const B=o2.b;if(x>=B.min.x-.05&&x<=B.max.x+.05&&z>=B.min.z-.05&&z<=B.max.z+.05){if(B.max.y<=y0+.1)sup=Math.max(sup,B.max.y);else if(B.min.y<=y0+.05)return 0}}
   return y0-sup};
 // mounted on the terrace-one wall (r = 864 - 24y/112) or the terrace-two wall: inner face within 0.35 m of it
 const onWall=it=>{const B=it.b,c=B.getCenter(new T.Vector3()),lx=c.x-OX,lz=c.z-OZ,r=Math.hypot(lx,lz),half=Math.max(B.max.x-B.min.x,B.max.z-B.min.z)/2;
   for(const[rb,rt,y0,y1]of[[864.06,840.06,0,112],[520.06,496.06,112,240]]){if(c.y<y0-1||c.y>y1+1)continue;const rw=rb+(rt-rb)*(c.y-y0)/(y1-y0);if(r-half<rw+.35&&r+half>rw-.5)return true}return false};
 for(const it of items){if(flat(it))continue;const B=it.b,c=B.getCenter(new T.Vector3()),y0=B.min.y;if(y0<-.5)continue;if(it.n.startsWith('M:Buffer'))continue;
  const sx=(B.max.x-B.min.x)*.42,sz=(B.max.z-B.min.z)*.42;let gap=1e9;
  for(const[dx,dz]of[[0,0],[-sx,-sz],[sx,sz],[-sx,sz],[sx,-sz]])gap=Math.min(gap,supAt(c.x+dx,c.z+dz,y0,it));
  if(gap>.06&&onWall(it))gap=0;
  if(gap>.06||gap<-2)res.push([+gap.toFixed(2),it.n,+(c.x-OX).toFixed(1),+y0.toFixed(2),+(c.z-OZ).toFixed(1)])}
 // summarise by item kind
 const by={};for(const q of res){const k=q[1];(by[k]=by[k]||{n:0,ex:[],gmin:1e9,gmax:-1e9});by[k].n++;by[k].gmin=Math.min(by[k].gmin,q[0]);by[k].gmax=Math.max(by[k].gmax,q[0]);if(by[k].ex.length<3)by[k].ex.push(q.slice(2).join('/')+' gap '+q[0])}
 // glows: sprites whose nearest item or floor below is more than 1.2 m away
 const gl=[];D.traverse(o=>{if(!o.isSprite||!o.visible)return;const p=o.getWorldPosition(new T.Vector3());let near=1e9;const lx=p.x-OX,lz=p.z-OZ;if(Math.hypot(lx,lz)<1201)near=p.y;for(const bx of BX)if(p.x>=bx.lo.x&&p.x<=bx.hi.x&&p.z>=bx.lo.z&&p.z<=bx.hi.z&&bx.hi.y<=p.y)near=Math.min(near,p.y-bx.hi.y);
  for(const o2 of (grid.get(key(p.x,p.z))||[])){const B=o2.b;const dx=Math.max(B.min.x-p.x,0,p.x-B.max.x),dy=Math.max(B.min.y-p.y,0,p.y-B.max.y),dz=Math.max(B.min.z-p.z,0,p.z-B.max.z);near=Math.min(near,Math.hypot(dx,dy,dz))}
  if(near>1.2)gl.push((p.x-OX).toFixed(0)+'/'+p.y.toFixed(1)+'/'+(p.z-OZ).toFixed(0)+' d'+near.toFixed(1)+' sc'+o.scale.x.toFixed(1))});
 // moving NPCs: lowest point of the body vs the floor under it
 const vbb=(root,B)=>{B.makeEmpty();root.updateMatrixWorld(true);const b=new T.Box3();root.traverse(m=>{if(!m.isMesh)return;let v=true;m.traverseAncestors(a=>{if(!a.visible)v=false});if(!v||!m.visible||m.material===HUB.shm)return;if(!m.geometry.boundingBox)m.geometry.computeBoundingBox();b.copy(m.geometry.boundingBox).applyMatrix4(m.matrixWorld);B.union(b)});return B};
 const np=[];for(const n of HUB.npcs){const vis=n.g.visible;n.g.visible=true;n.rig.anim(n.E,time,1/30);vbb(n.g,bb);n.g.visible=vis;const c=bb.getCenter(new T.Vector3());let fl=Math.hypot(c.x-OX,c.z-OZ)<1201?0:-99;for(const bx of BX)if(c.x>=bx.lo.x&&c.x<=bx.hi.x&&c.z>=bx.lo.z&&c.z<=bx.hi.z&&bx.hi.y<=bb.min.y+.3)fl=Math.max(fl,bx.hi.y);np.push(+(bb.min.y-fl).toFixed(2))}
 // a baked person standing and sitting
 const tg=new T.Group();tg.position.y=.95;humanize(walkerRig(tg,7),{key:'t0',panel:MAT.leaf,helm:0,visor:0xffffff});tg.updateMatrixWorld(true);const pmin=vbb(tg,new T.Box3()).min.y;
 return JSON.stringify({items:items.length,flagged:res.length,kinds:Object.entries(by).sort((a,b)=>b[1].n-a[1].n).map(([k,v])=>k+' x'+v.n+' gap '+v.gmin+'..'+v.gmax+' e.g. '+v.ex.join(' ; ')),glows:gl,npcFeet:np,personMinY:pmin.toFixed(3)},null,1)})()`);
console.log(r);console.log('errs',errs.length,errs.slice(0,3));await b.close()})();
