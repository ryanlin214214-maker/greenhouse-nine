// renders every roster model on its own (studio light, grid floor) from three angles; prints sizes and gear checks
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:400,height:300}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+process.argv[2],{timeout:240000});await q.waitForTimeout(3000);
const ids=process.argv[3]?process.argv[3].split(','):['kestrel','swiftwing','lancer','wisp','halberd','arclight','bastion'];
for(const id of ids){const r=await q.evaluate(c=>window.__x(c),`(()=>{const W=900,H=560,cv=document.createElement('canvas');cv.width=W;cv.height=H;const R=new T.WebGLRenderer({canvas:cv,antialias:true,preserveDrawingBuffer:true});R.outputColorSpace=T.SRGBColorSpace;R.toneMapping=T.ACESFilmicToneMapping;R.toneMappingExposure=1.1;
 const sc=new T.Scene();sc.background=new T.Color(0x1a1f24);sc.environment=scene.environment;sc.environmentIntensity=.6;sc.add(new T.HemisphereLight(0xdfe8f0,0x30343a,2.2));const dl=new T.DirectionalLight(0xffffff,3.2);dl.position.set(-20,30,-15);sc.add(dl);
 const g=shipModel('${id}');try{shuttleAnim(g,60,0,0,99,1,true,10);shuttleAnim(g,60,0,0,99,1,true,10)}catch(e){}sc.add(g);g.updateMatrixWorld(true);
 const B=new T.Box3();g.traverse(m=>{if(m.isMesh&&m.visible){if(!m.geometry.boundingBox)m.geometry.computeBoundingBox();B.union(m.geometry.boundingBox.clone().applyMatrix4(m.matrixWorld))}});const sz=B.getSize(new T.Vector3()),c=B.getCenter(new T.Vector3());
 const grid=new T.GridHelper(60,30,0x445058,0x2a3238);grid.position.y=-(g.userData.gy||2.05);sc.add(grid);
 const cam=new T.PerspectiveCamera(30,W/H,.1,500);const out=[];const L=Math.max(sz.x,sz.z)*1.25+6;
 for(const[ax,ay,az]of[[1,.45,-1.1],[1,.08,0],[-.7,.6,.9]]){cam.position.set(c.x+ax*L*1.2,c.y+ay*L*1.2,c.z+az*L*1.2);cam.lookAt(c);R.render(sc,cam);out.push(cv.toDataURL('image/jpeg',.85))}
 let tris=0,meshes=0;g.traverse(m=>{if(m.isMesh){meshes++;tris+=(m.geometry.index?m.geometry.index.count:m.geometry.attributes.position.count)/3}});R.dispose();
 const wb=(()=>{const U=g.userData;if(!U.gear)return 'no gear';const b2=new T.Box3().setFromObject(U.gear);return 'wheels bottom '+b2.min.y.toFixed(2)+' vs ground '+(-(U.gy||2.05)).toFixed(2)})();
 return JSON.stringify({id:'${id}',len:sz.z.toFixed(1),span:sz.x.toFixed(1),h:sz.y.toFixed(1),meshes,tris:Math.round(tris),mz:(g.userData.mz||[]).length,gear:wb,img:out})})()`);
 const o=JSON.parse(r);o.img.forEach((d,i)=>fs.writeFileSync('ships/'+id+'_'+i+'.jpg',Buffer.from(d.split(',')[1],'base64')));delete o.img;console.log(JSON.stringify(o))}
console.log('errs',errs.length,errs.slice(0,3));await b.close()})();
