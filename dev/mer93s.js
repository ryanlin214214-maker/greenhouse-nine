  // ---- v93 shared helpers: soft contact shadows (HUB.blobs) and a fuller tree crown (HUB.crown)
  {const SHT=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.55,'rgba(0,0,0,.55)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);return new T.CanvasTexture(c)})();
     const SHM=HUB.shm=new T.MeshBasicMaterial({map:SHT,color:0x000000,transparent:true,opacity:.38,depthWrite:false,fog:false,polygonOffset:true,polygonOffsetFactor:-5,polygonOffsetUnits:-5});
     const SHG=HUB.shg=new T.PlaneGeometry(1,1).rotateX(-Math.PI/2);
     // contact shadows: [x,y,z,sizeX,sizeZ,rotY]
     HUB.blobs=(list,op)=>{if(!list.length)return null;const m=op?SHM.clone():SHM;if(op)m.opacity=op;const im=new T.InstancedMesh(SHG,m,list.length),d=new T.Object3D();list.forEach((q,i)=>{d.position.set(q[0],q[1]+.035,q[2]);d.rotation.set(0,q[5]||0,0);d.scale.set(q[3],1,q[4]||q[3]);d.updateMatrix();im.setMatrixAt(i,d.matrix)});im.frustumCulled=false;im.userData.noShadow=true;im.renderOrder=2;D.add(im);return im};

     // a fuller tree crown: five lumpy blobs merged into one geometry (instanced like the old single icosahedron)
     HUB.crown=HUB.crown||((sz,det=1)=>{const P=[],N=[];const parts=[[0,0,0,1],[.62,.22,.2,.7],[-.58,.15,-.3,.72],[.1,.55,-.5,.62],[-.2,.62,.48,.58],[.3,-.25,.55,.6]];
       parts.forEach(([x,y,z,r],k)=>{const g=new T.IcosahedronGeometry(r,det),p=g.attributes.position;for(let i=0;i<p.count;i++){const j=1+.12*(hash(Math.round(p.getX(i)*97)+k*13,Math.round(p.getY(i)*89)+Math.round(p.getZ(i)*83)*7)-.5);p.setXYZ(i,p.getX(i)*j+x,p.getY(i)*j*.85+y,p.getZ(i)*j+z)}
         const g2=g.index?g.toNonIndexed():g;g2.computeVertexNormals();P.push(...g2.attributes.position.array);N.push(...g2.attributes.normal.array)});
       const G2=new T.BufferGeometry();G2.setAttribute('position',new T.Float32BufferAttribute(P.map(v=>v*sz),3));G2.setAttribute('normal',new T.Float32BufferAttribute(N,3));return G2});
  }
