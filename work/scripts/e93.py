s=open('hub82.js').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:80]);s=s.replace(a,b)
# the plaza was boxed in by invisible walls; it now opens onto the outer deck
rep("  SB(-40.5,0,929,40.5,4,930);for(const s of[-1,1])SB(s*40,0,929,s*40.5,4,984);\n","")
RING = r"""
  // ===== the outer deck ring (v86): paving, the rim rail, lamps, the terrace wall base, benches and planters, hangar doors,
  // platform signs and transit pylons. Everything repeated is instanced, so the whole ring is a handful of draws.
  {const PL=[0,.8,-.8,2.25,-2.25],HG=[.4,-.4,1.55,-1.55,2.85,-2.85],P2=(t,r,y=0,la=0)=>new T.Vector3(Math.sin(t)*r+Math.cos(t)*la,y,Math.cos(t)*r-Math.sin(t)*la);
   const near=(t,list,half,r)=>list.some(u=>Math.abs(Math.atan2(Math.sin(t-u),Math.cos(t-u)))*r<half);
   const IM=(geo,mat,list)=>{const im=new T.InstancedMesh(geo,mat,list.length),d=new T.Object3D();list.forEach((q,i)=>{d.position.set(q[0],q[1],q[2]);d.rotation.set(0,q[3]||0,0);d.scale.set(q[4]||1,q[5]||1,q[6]||1);d.updateMatrix();im.setMatrixAt(i,d.matrix)});im.instanceMatrix.needsUpdate=true;im.frustumCulled=false;im.receiveShadow=true;D.add(im);return im};
   // paving: slabs about 6 m, seams and a little wear, on a ring the size of the deck
   const pv=paint(512,(g,S)=>{g.fillStyle='#8f8a7f';g.fillRect(0,0,S,S);for(let i=0;i<4;i++)for(let j=0;j<4;j++){const v=(Math.sin(i*7.1+j*3.3)*.5+.5)*14-7;g.fillStyle='rgb('+(146+v)+','+(141+v)+','+(130+v)+')';g.fillRect(i*S/4+3,j*S/4+3,S/4-6,S/4-6)}
     g.strokeStyle='rgba(50,46,40,.55)';g.lineWidth=3;for(let i=0;i<=4;i++){g.beginPath();g.moveTo(i*S/4,0);g.lineTo(i*S/4,S);g.stroke();g.beginPath();g.moveTo(0,i*S/4);g.lineTo(S,i*S/4);g.stroke()}grime(g,S,1800,.07)});
   pv.wrapS=pv.wrapT=T.RepeatWrapping;pv.repeat.set(100,100);const pm=std({map:pv,roughness:.72,metalness:.04,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});
   const rg=new T.Mesh(new T.RingGeometry(866,1198,720,4),pm);rg.rotation.x=-Math.PI/2;rg.position.y=.012;rg.receiveShadow=true;D.add(rg);
   // rim rail: posts every 4 m, a gold top rail and a dark mid rail; open where the platforms join and across hangar mouths
   const posts=[],tops=[],mids=[];const RR=1199.2,n=Math.round(2*Math.PI*RR/4);for(let i=0;i<n;i++){const t=i/n*2*Math.PI,t2=(i+.5)/n*2*Math.PI;if(near(t,PL,38,RR)||near(t,HG,88,RR))continue;const p=P2(t,RR);posts.push([p.x,.55,p.z,t]);const m=P2(t2,RR);tops.push([m.x,1.1,m.z,t2]);mids.push([m.x,.6,m.z,t2])}
   IM(new T.BoxGeometry(.1,1.1,.1),gd,posts);IM(new T.BoxGeometry(4.05,.09,.09),gd,tops);IM(new T.BoxGeometry(4.05,.05,.05),gm,mids);
   // lamp posts with a warm head and a pool of light, every 36 m just inside the rim
   const lp=[],lh=[],pl=[],nl=Math.round(2*Math.PI*1186/36);for(let i=0;i<nl;i++){const t=i/nl*2*Math.PI;if(near(t,PL,40,1186)||near(t,HG,95,1186)||Math.abs(Math.atan2(Math.sin(t),Math.cos(t)))<.12)continue;const p=P2(t,1186);lp.push([p.x,2.6,p.z,t]);lh.push([p.x,5.25,p.z,t]);pl.push([p.x,.06,p.z,12,0xffd6a0,.26])}
   IM(new T.BoxGeometry(.22,5.2,.22),gm,lp);IM(new T.BoxGeometry(.9,.22,.5),lt,lh);if(pl.length){const pm2=poolMesh(pl);pm2.userData.noShadow=true;D.add(pm2)}
   // terrace wall base: a plinth, pilasters every 10 m and a row of warm windows, so the 112 m wall has detail at eye level
   {const pc=new T.Mesh(new T.CylinderGeometry(865.4,865.4,3,720,1,true),iv2);pc.position.y=1.5;D.add(pc);const cap=new T.Mesh(new T.CylinderGeometry(865.7,865.7,.4,720,1,true),gd);cap.position.y=3.1;D.add(cap)}
   {const pi=[],pw=[],pw2=[],nw=Math.round(2*Math.PI*866/10);for(let i=0;i<nw;i++){const t=i/nw*2*Math.PI,t2=(i+.5)/nw*2*Math.PI;if(Math.abs(Math.atan2(Math.sin(t),Math.cos(t)))<.08)continue;const p=P2(t,866.2);pi.push([p.x,12,p.z,t]);const w=P2(t2,865.9);pw.push([w.x,9,w.z,t2]);pw2.push([w.x,16,w.z,t2])}
    IM(new T.BoxGeometry(1.3,24,1.2),iv2,pi);const wm=bas({color:0x6f6248});IM(new T.BoxGeometry(5.2,2.6,.2),wm,pw);IM(new T.BoxGeometry(5.2,2.6,.2),wm,pw2)}
   // benches and planters along the promenade
   {const bn=[],pt=[],lf=[],nb=Math.round(2*Math.PI*1120/48);for(let i=0;i<nb;i++){const t=i/nb*2*Math.PI;if(near(t,HG,95,1120)||Math.abs(Math.atan2(Math.sin(t),Math.cos(t)))<.11)continue;const a=P2(t,1120,0,-3),b2=P2(t,1120,0,3);bn.push([a.x,.24,a.z,t]);pt.push([b2.x,.5,b2.z,t]);lf.push([b2.x,1.9,b2.z,t])}
    IM(new T.BoxGeometry(3,.45,.9),iv2,bn);IM(new T.CylinderGeometry(.9,1,1,12),iv2,pt);IM(new T.IcosahedronGeometry(1.25,0),MAT.leaf,lf)}
   // a door in the back wall of each hangar, both faces, with its number above
   HG.forEach((t,k)=>{for(const[r,f]of[[1073.6,1],[1082.4,-1]]){const p=P2(t,r,4);const dm=new T.Mesh(new T.BoxGeometry(9,8,.2),dk2);dm.position.copy(p);dm.rotation.y=t;D.add(dm);
       for(const la of[-4.8,4.8]){const q=P2(t,r+f*.15,4.2,la);const fr=new T.Mesh(new T.BoxGeometry(.6,8.6,.4),gd);fr.position.copy(q);fr.rotation.y=t;D.add(fr)}const tp=P2(t,r+f*.15,8.7);const tb=new T.Mesh(new T.BoxGeometry(10.2,.6,.4),gd);tb.position.copy(tp);tb.rotation.y=t;D.add(tb)}
     const sp=P2(t,1072.8,11.5);sign(holoSign('HANGAR H'+(k+1),'SHIPYARD · CREW ONLY BEYOND THE FIELD','#e0b050'),9,9,sp.x,sp.y,sp.z-0,t+Math.PI)});
   PL.forEach((t,k)=>{if(!k)return;const sp=P2(t,1192,7);sign(holoSign('PLATFORM '+k,'LANDING · MIND THE EDGE','#8fe6ff'),9,9,sp.x,sp.y,sp.z,t+Math.PI)});
   // transit pylons round the ring, in ring order
   const ST=[[0,950,'THE PLAZA',22],[.4,1060,'HANGAR H1'],[.8,1172,'PLATFORM 1'],[1.55,1060,'HANGAR H3'],[2.25,1172,'PLATFORM 3'],[2.85,1060,'HANGAR H5'],[-2.85,1060,'HANGAR H6'],[-2.25,1172,'PLATFORM 4'],[-1.55,1060,'HANGAR H4'],[-.8,1172,'PLATFORM 2'],[-.4,1060,'HANGAR H2']];
   const cm=bas({color:0x8fe6ff});ST.forEach(([t,r,name,la])=>{const p=P2(t,r,0,la||12);const c=new T.Mesh(new T.CylinderGeometry(.5,.7,4.4,10),gd);c.position.set(p.x,2.2,p.z);D.add(c);const ring=new T.Mesh(new T.TorusGeometry(.75,.1,6,20),cm);ring.position.set(p.x,3.6,p.z);ring.rotation.x=Math.PI/2;D.add(ring);
     const tg=glow(0x8fe6ff,3,.6);tg.position.set(p.x,4.6,p.z);D.add(tg);HUB.pts.push({k:'tr',x:OX+p.x,z:OZ+p.z,r:3.2,label:'E · TRANSIT · RIDE TO THE NEXT STOP',name,ry:t+Math.PI,zone:'ring'})})}
"""
a="  // soft pools of light on the floors under the lamps (one instanced draw)"
rep(a,RING.lstrip('\n')+a)
open('hub82.js','w').write(s);print('ok')
