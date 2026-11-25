# v93 B/C/E: Meridian. The facade kit round the whole station (mer93a.js, in meridianModel), grounding fixes, the Sky
# Garden continued round terrace one, fuller trees, contact shadows (mer93s.js shared helpers, mer93b.js in the garden),
# terrace-base pilasters and windows laid on the sloping wall, an inclined glass lift that reaches the terrace.
import sys
s=open(sys.argv[1]).read()
def R(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:90]);s=s.replace(a,b)
A=open('mer93a.js').read();B=open('mer93b.js').read();S=open('mer93s.js').read()
R("R(Gd,30,1,1,0,40,864.5,0,0,0,.2)},true);","R(Gd,30,1,1,0,40,864.5,0,0,0,.2)},true);\n"+A)
R("const D=new T.Group();D.position.set(OX,0,OZ);G.add(D);","const D=new T.Group();D.position.set(OX,0,OZ);G.add(D);\n"+S)
# moving NPCs carry a contact shadow (their group sits at pelvis height .95)
R("g.position.set(path[0][0],.95,path[0][1]);D.add(g);","g.position.set(path[0][0],.95,path[0][1]);D.add(g);{const sb=new T.Mesh(HUB.shg,HUB.shm);sb.scale.set(1.1,1,1.1);sb.position.y=-.91;sb.userData.noShadow=true;g.add(sb)}")
# garden crowns are built in mer93b with the fuller crown; ring planters too
R("IM(new T.IcosahedronGeometry(2.6,0),MAT.leaf,tc);IM(new T.IcosahedronGeometry(1.8,0),MAT.leafD||MAT.leaf,tc2);","")
R("IM(new T.IcosahedronGeometry(1.25,0),MAT.leaf,lf)}","IM(HUB.crown(1.15),MAT.leaf,lf);HUB.blobs(bn.map(q=>[q[0],0,q[2],3.6,1.5,q[3]]).concat(pt.map(q=>[q[0],0,q[2],3,3])))}")
# the cafe poles are rebuilt from the floor up (mer93b); the fountain glow shrinks to the jet tip
R("IM(new T.CylinderGeometry(.05,.05,2.4,6),gm,ps)","0")
R("const jg=glow(0xbfe8ff,4,.35);jg.position.set(p.x,Y+5.8,p.z);D.add(jg);","const jg=glow(0xbfe8ff,1.3,.28);jg.position.set(p.x,Y+5.95,p.z);D.add(jg);")
R("SB(600,Y-.25,-180,862,Y,180,1)}",B+"\n    SB(600,Y-.25,-180,862,Y,180,1)}")
# terrace base: the wall leans 24 m in over its 112 m height, so pilasters and windows are laid on it (they used to stand
# upright 1.6-7 m off the wall); pilasters next to a gold rib are left out; the plaza sector keeps its own windows.
R("{const pi=[],pw=[],pw2=[],nw=Math.round(2*Math.PI*866/10);for(let i=0;i<nw;i++){const t=i/nw*2*Math.PI,t2=(i+.5)/nw*2*Math.PI;if(Math.abs(Math.atan2(Math.sin(t),Math.cos(t)))<.08)continue;const p=P2(t,866.2);pi.push([p.x,12,p.z,t]);const w=P2(t2,865.9);pw.push([w.x,9,w.z,t2]);pw2.push([w.x,16,w.z,t2])}",
  "{const pi=[],pw=[],pw2=[],nw=Math.round(2*Math.PI*866/10),rw=y=>864.06-24*y/112,rib=t=>{const k=Math.round(t/.036);return Math.abs(t-k*.036)*866},wc=t=>Math.abs(Math.atan2(Math.sin(t),Math.cos(t)));"
  "for(let i=0;i<nw;i++){const t=i/nw*2*Math.PI,t2=(i+.5)/nw*2*Math.PI;if(wc(t)<.08)continue;if(rib(t)>1.6){const p=P2(t,rw(12)+.5);pi.push([p.x,12,p.z,t])}if(wc(t2)<.375||rib(t2)<3.5)continue;for(const[y,L]of[[9,pw],[16,pw2]]){const w=P2(t2,rw(y)+.08);L.push([w.x,y,w.z,t2])}}"
  "const LE=.2111,IML=(geo,mat,list)=>{const im=new T.InstancedMesh(geo,mat,list.length),d=new T.Object3D();list.forEach((q,i)=>{d.position.set(q[0],q[1],q[2]);d.rotation.set(-LE,q[3],0,'YXZ');d.updateMatrix();im.setMatrixAt(i,d.matrix)});im.frustumCulled=false;im.receiveShadow=true;D.add(im);return im};")
R("IM(new T.BoxGeometry(1.3,24,1.2),iv2,pi);const wm=std({color:0x1a2329,roughness:.08,metalness:.7});IM(new T.BoxGeometry(5.2,2.6,.2),wm,pw);IM(new T.BoxGeometry(5.2,2.6,.2),wm,pw2);const sl=bas({color:0xb88a4a});IM(new T.BoxGeometry(5.2,.12,.3),sl,pw.map(q=>[q[0],q[1]-1.36,q[2],q[3]]));IM(new T.BoxGeometry(5.2,.12,.3),sl,pw2.map(q=>[q[0],q[1]-1.36,q[2],q[3]]))}",
  "IML(new T.BoxGeometry(1.3,24.6,1.2),iv2,pi);const wm=std({color:0x1a2329,roughness:.08,metalness:.7});IML(new T.BoxGeometry(5.2,2.6,.2),wm,pw);IML(new T.BoxGeometry(5.2,2.6,.2),wm,pw2);const sl=bas({color:0xb88a4a});"
  "const sll=L=>L.map(q=>{const t=q[3],r=Math.hypot(q[0],q[2])-1.36*Math.tan(LE)*0+.07;return[Math.sin(t)*(r+1.36*24/112),q[1]-1.36,Math.cos(t)*(r+1.36*24/112),t]});IML(new T.BoxGeometry(5.4,.14,.34),sl,sll(pw));IML(new T.BoxGeometry(5.4,.14,.34),sl,sll(pw2))}")
# the plinth was an open ring 1.4-2 m off the wall: give it a top that reaches the wall
R("const cap=new T.Mesh(new T.CylinderGeometry(865.7,865.7,.4,720,1,true),gd);cap.position.y=3.1;D.add(cap)}",
  "const cap=new T.Mesh(new T.CylinderGeometry(865.7,865.7,.4,720,1,true),gd);cap.position.y=3.1;D.add(cap);const ct=new T.Mesh(new T.RingGeometry(863.3,865.75,720,1),gd);ct.rotation.x=-Math.PI/2;ct.position.y=3.3;D.add(ct)}")
# the Sky Garden lift: an inclined glass tube laid 3.2 m off the sloping wall, from a station on the deck to a glass
# landing on the terrace that joins the kiosk (it used to be a vertical shaft whose top stood 30 m out in the air, with
# brackets hanging 8-22 m short of the wall)
R("{const lb=PT(LA,872,0),kt=PT(LA,833,Y);const sh=new T.Mesh(new T.CylinderGeometry(2.6,2.6,Y-2,20,1,true),gl);sh.position.set(lb.x,(Y-2)/2,lb.z);D.add(sh);\n     for(let y=0;y<=Y-2;y+=8){const rg3=new T.Mesh(new T.TorusGeometry(2.65,.12,6,24),gd);rg3.position.set(lb.x,y,lb.z);rg3.rotation.x=Math.PI/2;D.add(rg3)}\n     {const cap=new T.Mesh(new T.CylinderGeometry(2.9,2.9,.6,20),gd);cap.position.set(lb.x,Y-2,lb.z);D.add(cap)}\n     for(const y of[24,56,88]){const br=PT(LA,867.4,y);const b=new T.Mesh(new T.BoxGeometry(5,.6,.8),gm);b.position.set(br.x,y,br.z);b.rotation.y=TC+LA+Math.PI/2;D.add(b)}\n     ",
  "{const lb=PT(LA,868,0),kt=PT(LA,833,Y),tA=TC+LA,rw=y=>864.06-24*y/112,y0=3.5,y1=Y+.4,c0=PT(LA,rw(y0)+3.2,y0),c1=PT(LA,rw(y1)+3.2,y1),dv=c1.clone().sub(c0),Ln=dv.length(),qd=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),dv.clone().normalize()),mid=c0.clone().add(c1).multiplyScalar(.5);\n"
  "     const sh=new T.Mesh(new T.CylinderGeometry(2,2,Ln,20,1,true),gl);sh.position.copy(mid);sh.quaternion.copy(qd);D.add(sh);\n"
  "     for(let k=0;k<=Ln;k+=8){const rg3=new T.Mesh(new T.TorusGeometry(2.05,.12,6,24),gd);rg3.position.copy(c0).addScaledVector(dv,k/Ln);rg3.quaternion.copy(qd).multiply(new T.Quaternion().setFromEuler(new T.Euler(Math.PI/2,0,0)));D.add(rg3)}\n"
  "     for(const s2 of[-1,1]){const rl=new T.Mesh(new T.BoxGeometry(.25,Ln,.25),gd);rl.position.copy(mid).add(new T.Vector3(Math.cos(tA)*s2*2.1,0,-Math.sin(tA)*s2*2.1));rl.quaternion.copy(qd);D.add(rl)}\n"
  "     for(const y of[24,56,88]){const r0=rw(y),br=PT(LA,r0+.65,y);const b=new T.Mesh(new T.BoxGeometry(2.8,.6,.8),gm);b.position.set(br.x,y,br.z);b.rotation.set(-.2111,tA+Math.PI/2,0,'YXZ');b.rotation.set(0,tA+Math.PI/2,0);D.add(b)}\n"
  "     {const cl=new T.Mesh(new T.CylinderGeometry(2.4,2.4,.5,20),gd);cl.position.set(c0.x,y0-.1,c0.z);D.add(cl)}\n"
  "     {const lc=PT(LA,840.3,Y),lg=new T.Group();lg.position.set(lc.x,Y,lc.z);lg.rotation.y=tA;D.add(lg);const fl=new T.Mesh(new T.BoxGeometry(5,.3,9.6),gd);fl.position.y=.15;lg.add(fl);const rf=new T.Mesh(new T.BoxGeometry(5.2,.35,9.8),gm);rf.position.y=3.6;lg.add(rf);for(const s2 of[-1,1]){const gw=new T.Mesh(new T.BoxGeometry(.08,3.3,9.6),gl);gw.position.set(s2*2.5,1.95,0);lg.add(gw);const fr=new T.Mesh(new T.BoxGeometry(.18,3.4,.18),gd);fr.position.set(s2*2.5,1.95,4.7);lg.add(fr)}}\n     ")
R("{const g2=glow(0x8fe6ff,3,.5);g2.position.set(lb.x,3.8,lb.z);D.add(g2)}","{const g2=glow(0x8fe6ff,1.6,.4);g2.position.set(lb.x,3.45,lb.z);D.add(g2)}")
# the lift call point sits just outside the glass base (solid to r 869.9), so walking up to the glass shows the prompt
R("const bd=PT(LA,875,0)","const bd=PT(LA,871.6,0)")
open(sys.argv[2],'w').write(s);print('p102 ok')
