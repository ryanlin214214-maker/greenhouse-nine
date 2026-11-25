// floating-part detector: rebuild every enemy model with each kit part's box recorded, then list parts that touch no other part
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const q=await b.newPage({viewport:{width:400,height:300}});q.setDefaultTimeout(900000);q.on('pageerror',e=>errs.push(e.message));
await q.route('**/cannon.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/cannon/build/cannon.min.js','utf8'),contentType:'text/javascript'}));
await q.goto('file://'+process.cwd()+'/gtest/'+(process.argv[2]||'t108x.html'),{timeout:240000});await q.waitForTimeout(4000);const X=c=>q.evaluate(c=>window.__x(c),c);
console.log(await X(`window.__PR=null;const ob=bake;bake=function(fn){return ob((a,...r)=>fn((geo,mat,sx,sy,sz,x=0,y=0,z=0,rx=0,ry=0,rz=0)=>{if(window.__PR){if(!geo.boundingBox)geo.computeBoundingBox();const qq=(rx&&rx.isQuaternion)?rx.clone():new T.Quaternion().setFromEuler(new T.Euler(rx,ry,rz));
   const M=new T.Matrix4().compose(new T.Vector3(x,y,z),qq,new T.Vector3(sx,sy,sz));window.__PR.push({b:geo.boundingBox.clone().applyMatrix4(M),c:mat&&mat.color?mat.color.getHexString():'?'})}return a(geo,mat,sx,sy,sz,x,y,z,rx,ry,rz)},...r))};
 const op=put;put=function(j,name,fn,sh){window.__PR=[];const m=op(j,name,fn,sh);m.userData.parts=window.__PR;m.userData.kn=name;window.__PR=null;return m};
 const og=greeble;greeble=function(par,name,fn){window.__PR=[];const o=og(par,name,fn);o.userData.parts=window.__PR;o.userData.kn=name;window.__PR=null;return o};
 for(const k in KIT)delete KIT[k];
 const out=[];const check=(label,root)=>{root.updateMatrixWorld(true);const all=[];root.traverse(o=>{if(o.userData.parts)o.userData.parts.forEach((p,i)=>all.push({b:p.b.clone().applyMatrix4(o.matrixWorld),kn:o.userData.kn,i,c:p.c}))});root.traverse(o=>{if(o.isMesh&&!(o.parent&&o.parent.userData.parts)){if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();all.push({b:o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld),kn:'mesh:'+(o.parent&&o.parent.userData.kn||o.parent&&o.parent.type),i:0,c:o.material&&o.material.color?o.material.color.getHexString():'?'})}});
   const rb=new T.Box3().setFromObject(root),sz=rb.getSize(new T.Vector3()).length(),tol=sz*.004;let bad=[];
   for(const p of all){const e=p.b.clone().expandByScalar(tol);if(!all.some(o=>o!==p&&e.intersectsBox(o.b)))bad.push(p)}
   out.push(label+': '+all.length+' parts, floating '+bad.length+(bad.length?' -> '+bad.slice(0,8).map(p=>p.kn+'#'+p.i+'(#'+p.c+') at '+p.b.getCenter(new T.Vector3()).toArray().map(v=>v.toFixed(2)).join(',')+' size '+p.b.getSize(new T.Vector3()).toArray().map(v=>v.toFixed(2)).join('x')).join(' | '):''))};
 const names={0:'Strike Drone',1:'Sentry Drone',2:'Gunship',5:'Rifle Trooper',6:'Heavy Loader',7:'Stalker',8:'Marksman',9:'Crawler',10:'Shieldbearer',11:'Detonator',12:'Rocketeer',13:'Reaver',14:'Maul'};
 for(const t of[0,1,2,5,6,7,8,9,10,11,12,13,14]){try{const m=model(t);check(t+' '+names[t],m.g)}catch(e){out.push(t+' error '+e)}}
 for(const[n,f]of[['Colossus',colossusModel],['Widow',widowModel],['Matriarch',bossModel]]){try{check(n,f().g)}catch(e){out.push(n+' error '+e)}}
 out.join('\\n')`));
console.log('errs',errs);await b.close()})();
