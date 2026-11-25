// ---- Meridian on foot: the real station model (the one flown to in stage 2-3) placed at HC, so it is the same place from space and on foot.
// Model-local metres: +z is radial (out toward landing platform 0), x lateral, deck top y=0. Local z 1100 sits at world HC.z.
// Hangar 0 (shipwright) r 1078..1200 opens onto platform 0; the Grand Concourse (armoury and outfitter) is behind the hangar's back wall; a deck plaza beyond it.
// merge a list of unattached objects (their local transforms are in `par` space) into one mesh per material
function bakeInto(par,objs){const by=new Map();for(const o0 of objs){o0.updateMatrixWorld(true);o0.traverse(o=>{if(!o.isMesh||!o.geometry)return;for(let v=o;v;v=v.parent)if(!v.visible)return;const m=o.material;if(Array.isArray(m))return;
    let ge=o.geometry.clone();ge.applyMatrix4(o.matrixWorld);if(ge.index)ge=ge.toNonIndexed();if(!ge.attributes.normal)ge.computeVertexNormals();if(!ge.attributes.uv)ge.setAttribute('uv',new T.BufferAttribute(new Float32Array(ge.attributes.position.count*2),2));
    if(!by.has(m))by.set(m,[]);by.get(m).push(ge)})}for(const[m,l]of by){const me=new T.Mesh(mergeGeos(l),m);me.castShadow=false;par.add(me)}}
function holoSign(l1,l2,col,w,h){return bas({map:paint(512,(g,S)=>{g.clearRect(0,0,S,S);g.fillStyle='rgba(10,24,40,.55)';g.fillRect(0,S*.28,S,S*.44);g.strokeStyle=col;g.lineWidth=4;g.strokeRect(6,S*.28,S-12,S*.44);
  g.font='700 58px "Chakra Petch",sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#f4ead2';g.fillText(l1,S/2,S*.43);g.font='600 34px "IBM Plex Mono",monospace';g.fillStyle=col;g.fillText(l2,S/2,S*.6)}),transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending})}
function hubBuild(){if(HUB.g)return;const G=HUB.g=new T.Group();scene.add(G);const B=HUB.boxes,OX=HC.x,OZ=HC.z-1100;
  const Mi=HUB.mer=meridianModel();Mi.g.position.set(OX,0,OZ);G.add(Mi.g);
  const D=new T.Group();D.position.set(OX,0,OZ);G.add(D);
  // collision in model-local coordinates; walls are 4 m or taller so nobody hops over into space
  const SB=(x0,y0,z0,x1,y1,z1,fl)=>{const b={lo:[OX+Math.min(x0,x1),y0,OZ+Math.min(z0,z1)],hi:[OX+Math.max(x0,x1),y1,OZ+Math.max(z0,z1)]};if(fl)b.floor=1;B.push(b)};
  const P=(o,m)=>{const q=PBR.use(std(o),...m);return q};
  const iv=P({color:0xd8d0bf,roughness:.5,metalness:.1},['plates',{rep:1,ns:.4}]),iv2=P({color:0xa89f8c,roughness:.6,metalness:.1},['plates',{rep:1,ns:.6}]),
    gd=P({color:0xc9a24a,roughness:.28,metalness:.9},['plates',{rep:1,ns:.3}]),st=P({color:0xd2cab8,roughness:.32,metalness:.05},['hfloor',{rep:1,ns:.8}]),st2=P({color:0xe8e5dd,roughness:.22,metalness:.05},['hfloor',{rep:1,ns:.5}]),
    dk=P({color:0x2a3036,roughness:.5,metalness:.65},['plates',{rep:1,ns:.8}]),dk2=P({color:0x181c20,roughness:.55,metalness:.5},['plates',{rep:1,ns:.8}]),gm=P({color:0x3c4248,roughness:.35,metalness:.85},['plates',{rep:1.5,ns:.7}]),
    dfl=P({color:0x3a4146,roughness:.45,metalness:.7},['diamond',{rep:1.2,ns:1}]),hfM=P({color:0x5d666c,roughness:.78,metalness:.15},['hfloor',{rep:1,ns:1.1}]),ofl=P({color:0x9a958b,roughness:.3,metalness:.08},['hfloor',{rep:1,ns:.6}]),hz=std({color:0xd8a422,roughness:.5,metalness:.2}),nv=std({color:0x1f3a68,roughness:.75}),rd=std({color:0x8a2a22,roughness:.6}),
    lt=bas({color:0xffe2b0}),lw=bas({color:0xf2f6ff}),cy=bas({color:0x6fe0ff}),am=bas({color:0xff8a3a}),rn=bas({color:0xff4a2a}),
    gl=std({color:0xa8dcff,transparent:true,opacity:.1,roughness:.04,metalness:.2,depthWrite:false,side:T.DoubleSide});gl.userData.noShadow=true;
  const UVM=new Set([iv,iv2,gd,st,st2,dk,dk2,gm,dfl,hfM,ofl]);const bk=bas({color:0x8a7660}),bk2=bas({color:0x3a4a5c});
  greeble(D,'hub82',(a,R)=>{const A=(m,w,h,d,x,y,z,ry=0)=>a(UVM.has(m)?uvBox(w,h,d,3):GEO.box,m,w,h,d,x,y,z,0,ry,0),C=(m,r,h,x,y,z,rx=0,rz=0)=>a(GEO.cyl,m,r,h,r,x,y,z,rx,0,rz);
    // ===== HANGAR 0 (x ±81, z 1082..1200, 64 m high) =====
    A(hfM,162,.04,118,0,.02,1141);for(const x of[-40,0,40])A(hz,.35,.012,112,x,.045,1141);for(let z=1090;z<1200;z+=22)A(hz,160,.012,.25,0,.045,z);
    for(let k=0;k<40;k++)A(k%2?hz:dk2,1.2,.013,.6,-80+k*4.1,.05,1198.6);
    // wall ribs, light columns, lower wall panels, pipes and the fuel manifold
    for(const s of[-1,1]){for(let z=1088;z<1200;z+=12){A(gm,2.6,64,3,s*79.6,32,z);A(lw,.15,40,.5,s*78.2,30,z);A(gd,3,.6,3.4,s*79.6,10,z)}
      A(dk,1.2,10,116,s*80.4,5,1141);for(let y=1.6;y<9;y+=1.6)A(gm,.5,.12,116,s*79.7,y,1141);
      for(const[y,r]of[[3.2,.35],[4.1,.25],[11.5,.45]])C(gm,r,116,s*79,y,1141,1.571);for(let z=1094;z<1200;z+=12){C(hz,.42,.5,s*79,3.2,z,1.571);C(rd,.3,.4,s*79,4.1,z,1.571)}}
    // catwalks on both walls at 14 m and 28 m with railings, and stairs up from the floor by the back wall
    for(const s of[-1,1])for(const y of[14,28]){A(dfl,4.5,.3,116,s*76.5,y,1141);A(gm,.3,.8,116,s*74.4,y-.5,1141);A(gd,.12,.12,116,s*74.3,y+1.1,1141);for(let z=1084;z<1200;z+=3)if(y>14||z<1111||z>1117)A(gm,.1,1.1,.1,s*74.3,y+.55,z);
      for(let z=1090;z<1200;z+=16){A(gm,.4,y,.4,s*74.6,y/2,z)}}
    // stairs up to the 14 m catwalks: solid steps, gold nosing, a stringer and handrail on the open side, and a landing that meets the catwalk
    for(const s of[-1,1]){for(let k=0;k<28;k++){const t=.5*(k+1);A(iv2,4,t,1,s*71.5,t/2,1084.5+k);A(gd,4,.05,.08,s*71.5,t+.02,1084.04+k);A(cy,3.6,.03,.03,s*71.5,t-.04,1084.0+k)}A(gm,.12,1.6,.12,s*69.45,.8,1084.2);A(gm,.12,1.4,.12,s*69.45,14.7,1112.2);a(GEO.box,gd,.14,.35,31.3,s*69.45,7.05,1098,-.4636,0,0);a(GEO.box,gd,.08,.08,31.3,s*69.45,8.05,1098,-.4636,0,0);for(let k=0;k<28;k+=3)A(gm,.08,1,.08,s*69.45,.5*(k+1)+.5,1084.5+k);A(dfl,9.3,.3,4.2,s*74.1,13.85,1114.1);A(gm,9.3,.5,4.2,s*74.1,13.45,1114.1);A(gd,.08,.08,4.2,s*69.45,15,1114.1);A(gm,.1,1.1,.1,s*69.45,14.5,1112.1);A(gm,.1,1.1,.1,s*69.45,14.5,1116.1)}
    // two bridge cranes on rails at 48 m, with trolleys, cables and hooks
    for(const s of[-1,1])A(gm,3,2.4,118,s*78,47,1141);
    for(const[z,hx]of[[1112,-26],[1164,37]]){A(gm,164,2.6,3.2,0,48.6,z);A(dk,164,.6,3.6,0,47,z);for(const s of[-1,1]){A(hz,6,3.4,4.2,s*76,48.4,z);for(let k=0;k<6;k++)A(k%2?dk:hz,1,3.42,.2,s*(73.5+k),48.4,z+2.11)}
      A(dk,6,4,6,hx,46,z);for(const o of[-1.2,1.2])C(gm,.08,16,hx+o,37,z);A(hz,3,1.6,1.4,hx,28.4,z);a(GEO.tor,gm,1,1,1,hx,27,z,0,0,0)}
    // ceiling light panels
    for(let x=-60;x<=60;x+=30)for(let z=1095;z<1200;z+=26){A(gm,12,.5,4,x,63.4,z);A(lw,11,.1,3,x,63.1,z)}
    // the back wall: lining, the concourse door frame and a big gold header
    for(const s of[-1,1])A(gm,71.5,26,.6,s*45.25,13,1082.3);A(gm,19,14,.6,0,19,1082.3);for(let x=-76;x<=76;x+=8)if(Math.abs(x)>12){A(lw,.25,10,.1,x+4,14,1082.65);A(cy,1.2,.1,.4,x+4,.06,1083)}A(lw,150,.15,.1,0,26.2,1082.65);A(am,150,.1,.1,0,.6,1082.65);for(let x=-76;x<=76;x+=8)if(Math.abs(x)>12)A(gm,.6,26,.8,x,13,1082.6);A(gd,24,1.2,1.2,0,12.6,1082.6);for(const s of[-1,1])A(gd,1.2,12.6,1.2,s*9.6,6.3,1082.6);A(cy,18,.15,.2,0,12,1083.1);A(gd,24,1.2,1.2,0,12.6,1073.4);for(const s of[-1,1])A(gd,1.2,12.6,1.2,s*9.6,6.3,1073.4);
    // crates, barrels, carts and consoles along the walls
    for(let k=0;k<26;k++){const s=k%2?1:-1,z=1092+(k>>1)*8.4,h=hash(k,5);if(Math.abs(z-1102)<6&&s<0||z>1160||z<1118)continue;const x=s*(68-h*4);
      if(k%3===0){A(k%2?hz:gm,3,2.4,2.4,x,1.2,z);A(dk,3.1,.2,2.5,x,2.45,z);A(gm,2.4,1.8,2.2,x+s*.2,3.4,z+.3)}else if(k%3===1){for(let q=0;q<4;q++){C(q%2?rd:hz,.48,1.3,x+(q&1)*1.2,.65,z+(q>>1)*1.2);C(dk,.42,.04,x+(q&1)*1.2,1.32,z+(q>>1)*1.2)}}
      else{A(dk,2.2,1.1,1.2,x,.55,z);A(gm,2,.08,1,x,1.14,z);A(cy,1.4,.5,.05,x,1.6,z-.55);A(dk,.15,.8,.15,x,1.5,z-.5)}}
    // the atmosphere field frame at the mouth
    for(const s of[-1,1])A(cy,.3,62,.3,s*80.6,31,1199.6);A(cy,161,.3,.3,0,62,1199.6);A(hz,161,.2,.2,0,.12,1199.4);
    for(const s of[-1,1]){A(gd,46,.12,.12,s*58.5,1.15,1200.6);a(GEO.box,gl,46,1.1,.05,s*58.5,.6,1200.6,0,0,0);for(let x=36;x<=81;x+=4.5)A(gm,.1,1.2,.1,s*x,.6,1200.6)}
    // ship pads (the sale row and your ship), each with a cyan ring and light bars
    for(const[x,z]of[[-55,1152],[-18,1158],[18,1158],[55,1152],[-50,1103]]){C(dk,10,.06,x,.035,z);a(GEO.tor,cy,10.4,10.4,.25,x,.07,z,1.571,0,0);for(let k=0;k<12;k++){const u=k*Math.PI/6;A(am,1.2,.08,.35,x+Math.cos(u)*11.6,.06,z+Math.sin(u)*11.6,-u)}}
    // Teo's kiosk
    R(gm,9,1.15,2.4,22,.58,1098,0,0,0,.08);A(gd,9.2,.08,2.6,22,1.17,1098);A(cy,8.6,.06,.08,22,1.06,1099.25);C(dk,1.6,.2,22,.1,1098);C(gm,.2,3.4,22,1.8,1096);
    // ===== GRAND CONCOURSE hall (x ±12, z 986..1074) =====
    A(st,24,.04,88,0,.02,1030);A(nv,6,.05,86,0,.03,1030);for(const s of[-1,1])A(gd,.15,.055,86,s*3.4,.035,1030);for(let z=990;z<1074;z+=8)A(gd,23,.05,.12,0,.04,z);
    for(const s of[-1,1])for(let z=991;z<1074;z+=11){R(iv,1.6,32,1.6,s*11.2,16,z,0,0,0,.2);A(gd,2.2,.8,2.2,s*11.2,.4,z);A(gd,2.2,1,2.2,s*11.2,30.5,z);A(lt,.12,26,.3,s*10.35,16,z)}
    for(let z=992;z<1074;z+=8)A(gd,24,.8,.6,0,31.4,z);
    // storefront walls: openings z 1010..1052, gold frames
    for(const s of[-1,1]){A(iv,1,32,24,s*12,16,998);A(iv,1,32,22,s*12,16,1063);A(iv,1,16,42,s*12,24,1031);A(gd,1.2,1.2,42.4,s*12,15.4,1031);for(const z of[1010,1052])A(gd,1.2,16,1.2,s*12,8,z)}
    // planters, benches and lamp posts down the hall
    for(const z of[996,1018,1042,1064]){R(iv2,3.4,1,3.4,0,.5,z,0,0,0,.15);A(gd,3.6,.12,3.6,0,1.02,z);for(const s of[-1,1]){A(gd,.4,.45,3.2,s*6.5,.22,z);A(nv,.9,.12,3,s*6.5,.5,z);A(gd,.12,.9,3,s*6.95,.9,z)}}
    for(const s of[-1,1])for(let z=1004;z<1074;z+=22){C(gd,.12,5,s*8.5,2.5,z);a(GEO.sph,lt,.35,.35,.35,s*8.5,5.2,z)}
    // rear doors onto the plaza
    A(gd,17,1.2,1.4,0,10.4,985.2);for(const s of[-1,1])A(gd,1.2,10.4,1.4,s*8.2,5.2,985.2);
    // ===== ARMOURY (x -62..-13) =====
    A(dfl,49,.04,86,-37.5,.02,1029);A(dk,.6,32,86,-62.3,16,1029);A(dk,49,32,.6,-37.5,16,986.8);A(dk,49,32,.6,-37.5,16,1072.8);
    for(let z=992;z<1072;z+=10){A(rn,.12,.12,6,-61.9,26,z);A(rn,.12,16,.12,-61.9,8,z)}for(let x=-58;x<-14;x+=8)for(let z=994;z<1072;z+=14){A(gm,6,.4,2,x,29.6,z);A(lw,5.6,.1,1.6,x,29.35,z)}
    // the wall of guns: a 44 m lit rack, 8 columns by 4 rows of bays, each with a back light and a tag
    A(dk2,46,14,.6,-38,8,1072.2);for(let c=0;c<=16;c++)A(gm,.18,13.6,.5,-60.6+c*2.8,8,1071.95);for(let r=0;r<=6;r++)A(gm,45.2,.18,.5,-38,1.4+r*2.15,1071.95);
    for(let c=0;c<16;c++)for(let r=0;r<6;r++){A(bk,2.55,1.9,.05,-59.2+c*2.8,2.47+r*2.15,1071.75);A((c+r)%4?lw:am,2.4,.04,.05,-59.2+c*2.8,1.56+r*2.15,1071.6);A(gd,.36,.12,.05,-59.2+c*2.8,1.72+r*2.15,1071.6);for(const o of[-.5,.5])A(gm,.06,.06,.18,-59.2+c*2.8+o,2.4+r*2.15,1071.55)}
    A(rn,46,.2,.2,-38,16.3,1071.7);
    // glass display cases
    for(const z of[1040,1050,1060]){R(dk,3.2,1,6.2,-29,.5,z,0,0,0,.08);A(gd,3.3,.06,6.3,-29,1.02,z);A(am,3,.04,6,-29,1.05,z)}
    // counter (L-shaped) with a lit edge
    R(gm,2.4,1.15,12,-22,.58,1024,0,0,0,.08);R(gm,6,1.15,2.4,-25,.58,1031,0,0,0,.08);A(gd,2.6,.08,12.2,-22,1.17,1024);A(am,.06,.06,11.6,-20.75,1.05,1024);
    // the Sunbreaker rail cannon, 40 m, on a cradle behind glass: breech, twin rails, coil rings, capacitor banks, muzzle brake
    {const x=-49,y=9;A(gm,10,9,12,x,y,1036);A(dk,11,1.5,13,x,y-4.8,1036);for(const s of[-1,1]){A(gm,1.8,2.6,36,x+s*1.7,y,1012);A(gd,.3,.3,36,x+s*1.7,y+1.4,1012)}A(cy,.5,.5,36,x,y,1012);
      for(let z=998;z<1030;z+=3.2){a(GEO.tor,gd,3.2,3.2,2.2,x,y,z,0,0,0);a(GEO.tor,dk,3.4,3.4,1.2,x,y,z+1.2,0,0,0)}A(gm,6,6,4,x,y,993);A(dk,7,1,4.2,x,y+3.2,993);A(dk,7,1,4.2,x,y-3.2,993);for(const s of[-1,1])A(cy,.2,4,.2,x+s*3.1,y,991.2);
      for(const s of[-1,1]){for(let k=0;k<4;k++){C(dk,1,7,x+s*7,y-.5,1028+k*3.4,0);C(cy,1.05,.3,x+s*7,y+1.6,1028+k*3.4);C(cy,1.05,.3,x+s*7,y-2.6,1028+k*3.4)}for(let k=0;k<6;k++)A(gm,.25,6,8,x+s*5.2,y,1031+k*1.6)}
      for(const z of[1002,1022]){for(const s of[-1,1])A(dk,1.6,y-2,1.6,x+s*4,(y-2)/2,z);A(gm,10,1.2,3,x,y-2.2,z)}C(gm,7,1.2,x,.6,1036);a(GEO.tor,am,7.2,7.2,.4,x,1.25,1036,1.571,0,0);
      for(let k=0;k<12;k++)C(k%2?hz:dk,.25,1.2,x-5.5+(k%6)*2.2,y+5.2,1032+(k>>1)*.01)}
    for(let z=988;z<=1044;z+=8)A(gd,.4,20,.4,-36,10,z);A(gd,.4,.4,56,-36,20,1015.5);A(gd,.4,.4,56,-36,.2,1015.5);A(gd,26,.4,.4,-49,20,1043.3);
    // workbench and ammo crates
    A(gm,2.2,1,8,-59,.5,1056);A(dk,2.4,.1,8.2,-59,1.05,1056);for(let k=0;k<5;k++)A(k%2?hz:dk,.4,.3,.6,-59,1.25,1053+k*1.4);A(lw,.1,2,6,-61.6,2.4,1056);
    for(let k=0;k<6;k++)A(k%2?gm:hz,2,1.4,1.4,-58+(k%3)*2.2,.7+(k>2?1.4:0),1046);
    // ===== OUTFITTER (x 13..62) =====
    A(ofl,49,.04,86,37.5,.02,1029);for(let z=990;z<1072;z+=6)A(cy,48,.02,.06,37.5,.045,z);A(iv,.6,32,86,62.3,16,1029);A(iv,49,32,.6,37.5,16,986.8);A(iv,49,32,.6,37.5,16,1072.8);
    for(let x=18;x<60;x+=8)A(lw,5,.1,1.2,x,31.5,1030);
    // the armour gallery: glass-fronted lit alcoves on the front wall (9) and the far wall (8)
    const alc=(x,z,ry,yo=0)=>{const c=Math.cos(ry),s2=Math.sin(ry),L=(dx,dz)=>[x+dx*c+dz*s2,z-dx*s2+dz*c];
      for(const o of[-2.4,2.4]){const[p,q]=L(o,0);a(GEO.box,iv2,.5,7.6,2.2,p,3.8+yo,q,0,ry,0);a(GEO.box,gd,.55,.2,2.25,p,7.5+yo,q,0,ry,0)}
      {const[p,q]=L(0,-1);a(GEO.box,bk2,4.3,6.6,.1,p,3.9+yo,q,0,ry,0);const[p2,q2]=L(0,-.6);a(GEO.box,cy,4.3,.12,.1,p2,.5+yo,q2,0,ry,0);a(GEO.box,cy,4.3,.12,.1,p2,7.2+yo,q2,0,ry,0);for(const o of[-2,2]){const[p3,q3]=L(o,-.5);a(GEO.box,lw,.1,6.2,.1,p3,3.9+yo,q3,0,ry,0)}}
      {const[p,q]=L(0,0);a(GEO.box,iv2,5.3,.6,2.4,p,7.9+yo,q,0,ry,0);a(GEO.cyl,gm,1.2,.35,1.2,p,.18+yo,q);a(GEO.tor,cy,1.25,1.25,.4,p,.37+yo,q,1.571,0,0);for(const o of[-1.2,1.2]){const[pa,qa]=L(o,.2);a(GEO.box,gm,.18,1.3,.18,pa,6.9+yo,qa,0,ry,0);a(GEO.box,gm,.14,.14,.9,pa,6.3+yo,qa+.3*c,0,ry,0)}}
      {const[p,q]=L(0,1.15);a(GEO.box,gl,4.5,7.2,.06,p,3.8+yo,q,0,ry,0)}};
    for(const yo of[0,8.4]){for(let k=0;k<9;k++)alc(17.5+k*5.1,1070.6,Math.PI,yo);for(let k=0;k<8;k++)alc(60.4,993+k*5.1,-Math.PI/2,yo)}A(iv2,46,.4,2.6,37.5,8.2,1067.9);A(gd,46,.1,.1,37.5,9.4,1066.7);A(iv2,2.6,.4,42,57.7,8.2,1010.9);A(gd,.1,.1,42,56.4,9.4,1010.9);for(const[x,z]of[[30,1050],[46,1050],[30,1010],[46,1010]]){a(GEO.tor,lw,5,5,.6,x,15,z,1.571,0,0);C(gm,.05,15,x,22.5,z)}C(gm,3.4,.8,26,.4,1046);a(GEO.tor,cy,3.5,3.5,.5,26,.82,1046,1.571,0,0);C(gd,3.6,.1,26,.85,1046);for(const[x,z]of[[34,1000],[40,1000],[46,1000],[52,1000]]){C(gm,1,.3,x,.15,z);a(GEO.tor,cy,1.05,1.05,.4,x,.32,z,1.571,0,0)}

    // ===== life pass: more props everywhere =====
    // hangar: colourful container stacks by the mouth, two fuel trucks, hoses on the floor, cargo hanging from the cranes
    {const CC=[rd,nv,hz,gm,rd,hz];for(const s of[-1,1])for(let k=0;k<6;k++){const x=s*(64+(k%2)*6.4),z=1182+(k>>2)*0+((k>>1)%2)*0,y=1.3+(k>>1)*2.6*(k<4?1:0);A(CC[(k+(s>0?2:0))%6],6.2,2.6,12,x,(k<4?1.3+((k>>1))*2.6:1.3),k<4?1184:1170)}}
    for(const[x,z,ry]of[[0,1130,0]]){A(hz,3,2.4,6,x,1.7,z,ry);A(gm,3,3,2.6,x,2,z+(ry?3.6:-3.6),ry);A(cy,2,.5,.1,x,2.8,z+(ry?4.95:-4.95),ry);for(const o of[-2,0,2])for(const s2 of[-1,1])C(dk2,.55,.4,x+s2*1.5,.55,z+o,0,1.571);C(gm,.85,4.4,x,3.75,z+(ry?.6:-.6),1.571);A(dk,2.4,.3,4.6,x,2.95,z+(ry?.6:-.6),ry)}
    for(const[x0,z0,x1,z1]of[[-79,1140,-62,1146],[79,1120,62,1126],[0,1124,-14,1112]]){const dx=x1-x0,dz=z1-z0,L=Math.hypot(dx,dz);a(GEO.cyl,dk2,.12,L,.12,(x0+x1)/2,.12,(z0+z1)/2,1.571,Math.atan2(dx,dz),0)}
    A(hz,12,5,5,-26,22,1112);A(dk,12.2,.3,5.2,-26,24.6,1112);for(const o of[-5,5])C(gm,.05,2,-26+o,25.8,1112);A(gm,8,4,6,37,22.5,1164);C(dk,1.6,3,37,19.5,1164,1.571);C(cy,1.2,.2,37,19.5,1162.4,1.571);
    // hangar walls: tool racks and lockers under the catwalks
    for(const s of[-1,1])for(let z=1118;z<1196;z+=12){A(gm,.8,3.2,3.6,s*77.8,1.6,z+6);for(const o of[-.9,.9]){A(dk,.05,2.8,1.7,s*77.38,1.6,z+6+o);A(lw,.04,.08,.5,s*77.35,2.4,z+6+o)}A(gd,.85,.1,3.65,s*77.8,3.25,z+6)}
    // armoury: freestanding A-frame gun rack, a test range with a booth and target stands, hanging banners, ammo shelving
    A(gm,.8,3.2,16,-20,1.6,1052);A(dk,1.6,.2,16.4,-20,.1,1052);A(am,.1,.1,15.6,-20,3.25,1052);
    A(dk,20,.1,22,-24,.07,998.5);for(const x of[-30,-24,-18]){A(gm,.2,2.2,.2,x,1.1,989.5);A(cy,1,2,.05,x,2.6,989.4);A(lw,4.6,.05,18,x,.12,999)}A(gm,20,1.1,.6,-24,.55,1009.6);A(gd,20.2,.08,.8,-24,1.12,1009.6);for(const x of[-30,-24,-18])A(gm,.15,2.4,.15,x+2.9,1.2,1009.6);
    // outfitter: helmet pedestals, a lounge with sofas and plants, a holo stats table, a circular rug
    for(let k=0;k<5;k++){C(iv2,.6,1.2,30+k*5,.6,1014);C(gd,.65,.06,30+k*5,1.22,1014);a(GEO.tor,cy,.7,.7,.4,30+k*5,1.24,1014,1.571,0,0)}
    a(GEO.cyl,nv,7,.03,7,40,.04,1048);a(GEO.tor,gd,7,7,.5,40,.06,1048,1.571,0,0);for(const[x,z,ry]of[[46,1044,0],[46,1053,Math.PI],[51,1048.5,Math.PI/2]]){A(nv,6,.6,1.6,x,.4,z,ry);A(nv,6,1,.4,x,1,z+(ry===0?-.6:ry===Math.PI?.6:0),ry)}
    C(gm,1.4,1,40,.5,1048);a(GEO.cyl,cy,1.3,.04,1.3,40,1.04,1048);
    for(const[x,z]of[[15,990],[60,990],[15,1066],[34,990],[-15,1066],[-33,1068]]){C(iv2,.9,1,x,.5,z);a(GEO.ico,MAT.leaf,1.2,1.6,1.2,x,2,z)}
    // hall: hanging banners from the skylight ribs, more planters along the storefronts, a holo directory pillar
    for(let z=996;z<1070;z+=16)for(const s of[-1,1]){A(s>0?nv:rd,3,10,.08,s*7,24,z);A(gd,3.2,.25,.25,s*7,29,z)}
    C(gm,.6,1.3,-6,.65,1071);a(GEO.cyl,cy,.5,.04,.5,-6,1.32,1071);
    // observation deck: benches facing out, coin telescopes, lamp posts, a mission board pillar in the hall
    for(let k=0;k<10;k++){const an=-Math.PI*.42+k*Math.PI*.093,x=Math.sin(an)*32,z=1590+Math.cos(an)*32;A(gd,4,.45,1,x,.22,z,an);A(nv,4,.1,.9,x,.5,z,an);A(gd,4,.8,.1,x,.9,z+Math.cos(an)*.45,an)}
    for(const an of[-.9,-.3,.3,.9]){const x=Math.sin(an)*37,z=1590+Math.cos(an)*37;C(gm,.08,1.1,x,.55,z);a(GEO.box,gm,.18,.18,.5,x,1.25,z,.25,an,0);C(gm,.25,.05,x,.02,z)}
    A(gm,1.4,2.4,.6,-6.5,1.2,1070.8);A(cy,1.2,1.6,.05,-6.5,1.5,1070.48);A(gd,1.5,.1,.7,-6.5,2.45,1070.8);
    // arches: over the concourse door (both faces), across the hall under the skylight
    for(const z of[1082.9,1073.3])a(new T.TorusGeometry(9.6,.35,8,32,Math.PI),gd,1,1,1,0,12.6,z);for(let z=992;z<1074;z+=16)a(new T.TorusGeometry(11.4,.28,8,40,Math.PI),gd,1,1,1,0,20,z);
    // plaza: a tiered fountain, curved benches and trees
    C(iv2,7,.8,0,.4,955);a(GEO.cyl,MAT.water,6.4,.05,6.4,0,.78,955);C(iv2,3.4,1.6,0,.8,955);a(GEO.cyl,MAT.water,3,.05,3,0,1.58,955);C(gd,.5,3.2,0,1.6,955);a(GEO.sph,gd,.9,.9,.9,0,3.6,955);a(GEO.tor,gd,7,7,.6,0,.82,955,1.571,0,0);
    for(const s of[-1,1])for(let k=0;k<3;k++){const x=s*(18+k*7),z=946+(k%2)*14;C(iv2,1.4,.8,x,.4,z);C(MAT.bark,.25,4,x,2.6,z);a(GEO.ico,MAT.leaf,2.4,2,2.4,x,5.2,z);a(GEO.ico,MAT.leafD,1.6,1.4,1.6,x+.6,6.3,z-.4)}
    for(const s of[-1,1])a(new T.TorusGeometry(10,.5,6,28,Math.PI*.5),gd,1,1,.6,0,.45,955,1.571,0,s>0?Math.PI*.25:Math.PI*1.25);
    // helmet wall on the rear wall: two lit shelves
    for(const y of[2.1,4.1])A(gm,13,.15,1.1,25,y,987.6);A(lw,13,4.6,.05,25,3.3,987.1);
    // Ines's counter
    R(iv2,2.4,1.15,12,22,.58,1024,0,0,0,.08);R(iv2,6,1.15,2.4,25,.58,1031,0,0,0,.08);A(gd,2.6,.08,12.2,22,1.17,1024);A(cy,.06,.06,11.6,20.75,1.05,1024);
    // the cannon enclosure glass
    a(GEO.box,gl,.08,20,56,-36,10,1015.5);a(GEO.box,gl,26,20,.08,-49,10,1043.3)},true);
  // ===== baked display objects: guns on the rack and in cases, armour in the alcoves, helmets on shelves, ships for sale =====
  const objs=[];
  for(let c=0;c<16;c++)for(let r=0;r<6;r++){const k=(c+r*3)%VMG.length,w=new T.Group();w.add(gunClone(k));w.scale.setScalar(k===5?.62:k===3?.95:.72);w.position.set(-59.2+c*2.8,2.42+r*2.15,1071.35);w.rotation.set(0,Math.PI/2,0);objs.push(w)}
  [[0,1040],[5,1050],[7,1060]].forEach(([k,z])=>{const w=new T.Group();w.add(gunClone(k));w.scale.setScalar(1.1);w.position.set(-29,1.2,z);w.rotation.set(0,0,0);objs.push(w)});
  const PAN=[0x2c63c8,0x3f9a58,0xc4702a,0x8a7448,0x8a2a22,0x5a666c,0x6a4ab0,0xd2d6d8].map(c=>std({color:c,roughness:.45,metalness:.25})),VZ=[0xd9a441,0x5fc8e8,0x46d6a0,0xe08a2a,0xb89ae0,0xff5a4a];
  const suit=(x,z,ry,i,yo=0)=>{const g=new T.Group();const big=z!==1000;g.position.set(x,(big?1.86:1.32)+yo,z);g.scale.setScalar(big?1.5:1);g.rotation.y=ry;const r=humanize(walkerRig(g,7),{key:'g'+i%8+'_'+i%4+'_'+i%6+'_'+(i%5===2?1:0),panel:PAN[i%8],helm:i%4,visor:VZ[i%6],cy:i%5===2?[3,3]:i%7===3?[0,2]:[0,0],x:i%6===4?['cape']:[]});
    if(r.segs.gun)r.segs.gun.visible=false;r.segs.arms.forEach(([a,b],j)=>{a.rotation.set(0,0,(j?-1:1)*.14);b.rotation.set(-.12,0,0)});g.traverse(o=>{if(o.isSprite)o.visible=false});objs.push(g)};
  for(const[t,yo]of[[0,0],[1,8.4]]){for(let k=0;k<9;k++)suit(17.5+k*5.1,1070.2,Math.PI,k+t*17,yo);for(let k=0;k<8;k++)suit(60,993+k*5.1,-Math.PI/2,k+9+t*17,yo)}for(let k=0;k<4;k++)suit(34+k*6,1000,0,k+40,0);
  for(let k=0;k<12;k++){const h=new T.Group();h.position.set(20+(k%6)*2,(k<6?2.2:4.2)-.02,987.8);h.rotation.y=0;h.scale.setScalar(1.4);humanHead(h,{key:'s'+k%4,panel:PAN[k%8],helm:k%4,visor:VZ[k%6]});h.traverse(o=>{if(o.isSprite)o.visible=false});objs.push(h)}

  // static people baked into the merged meshes: shoppers at the displays, people on the benches, pairs talking, onlookers on the plaza and platform
  const CIV=[0x1fb5a8,0xd23c8c,0xf08a24,0x8ccf3a,0x8a4ad8,0xe0443a,0x37b6e8,0xe2b23a,0xf2f2ea,0x5a6aa8].map(c=>std({color:c,roughness:.45,metalness:.2}));
  const person=(x,z,ry,i,mode)=>{const g=new T.Group();g.rotation.y=ry;const sit=mode==='sit';g.position.set(x,sit?.72:.95,z);
    const r=humanize(walkerRig(g,7),{key:'c'+i%10+'_'+i%4+'_'+(i%6)+(i%5===1?'x':''),panel:CIV[i%10],helm:i%4,visor:VZ[i%6],x:i%5===1?['scarf']:i%7===2?['cape']:[],cy:i%9===4?[0,2]:[0,0]});if(r.segs.gun)r.segs.gun.visible=false;
    const S=r.segs,A2=S.arms;g.traverse(o=>{if(o.isSprite)o.visible=false});
    if(sit){for(const[h,k]of S.legs){h.rotation.x=-1.45;k.rotation.x=1.45}A2.forEach(([a,b],j)=>{a.rotation.set(-.45,0,(j?-1:1)*.12);b.rotation.set(-.9,0,0)});S.tor.rotation.x=-.08}
    else if(mode==='talk'){armTo(A2[1],[.3,-.75,.4],[.1,.2,1]);A2[0][0].rotation.set(0,0,.12);A2[0][1].rotation.set(-.2,0,0);S.head.rotation.x=.05}
    else if(mode==='look'){S.head.rotation.x=-.5;S.tor.rotation.x=-.08;A2.forEach(([a,b],j)=>{a.rotation.set(.05,0,(j?-1:1)*.16)})}
    else{armTo(A2[0],[-.15,-.8,.35],[.3,.3,.95]);A2[1][0].rotation.set(0,0,-.1);S.head.rotation.x=.18;if(i%3===0){S.legs[0][0].rotation.x=-.12;S.legs[1][0].rotation.x=.08}}
    objs.push(g)};
  let pi=0;const PP=(x,z,ry,m)=>person(x,z,ry,pi++,m);
  for(const[s,z]of[[-1,995.2],[-1,1018.8],[1,1041.2],[1,1064.6],[-1,1064.2],[1,1018]])PP(s*6.4,z,s<0?Math.PI/2:-Math.PI/2,'sit');
  for(const x of[-52,-41,-31])PP(x,1066,0,'browse');PP(-26.4,1043,-Math.PI/2,'browse');PP(-26.4,1057,-Math.PI/2,'browse');PP(-24,1006,Math.PI,'browse');
  for(const x of[24,38,51])PP(x,1064,0,'browse');PP(55.6,1001,Math.PI/2,'browse');PP(55.6,1017,Math.PI/2,'browse');PP(26,1053.5,Math.PI,'look');PP(30,1012,0,'browse');PP(48.5,1044.6,0,'sit');
  PP(14,1108,Math.PI*.75,'talk');PP(15.6,1106.4,-Math.PI*.25,'talk');PP(-14,1150,Math.PI/2,'browse');PP(14,1146,-Math.PI/2,'browse');
  PP(-12,966,Math.PI*.5,'talk');PP(-10.2,966,-Math.PI*.5,'talk');PP(12,940,Math.PI,'look');PP(-26,936,Math.PI,'look');PP(-8,1612,0,'look');PP(14,1606,.3,'look');PP(-20,1590,-.6,'talk');PP(-18.4,1591.2,2.5,'talk');PP(10,1262,Math.PI,'look');PP(-6,1420,0,'browse');
  // second gun rack's guns: both faces
  for(let k=0;k<6;k++)for(const s of[-1,1]){const w=new T.Group();w.add(gunClone((k+(s>0?3:0))%VMG.length));w.scale.setScalar(.72);w.position.set(-20+s*.5,1.1+(k%2)*1.1,1046+(k>>1)*5.5);w.rotation.set(0,s>0?Math.PI:0,Math.PI/2*.0);objs.push(w)}
  const PADS=[[-55,1152],[-18,1158],[18,1158],[55,1152]];SHIPK.forEach((id,i)=>{if(i>=4)return;const sh=shuttleModel();shipLook(sh,SHIPS[id]);sh.position.set(PADS[i][0],2.2,PADS[i][1]);sh.rotation.y=Math.PI;try{shuttleAnim(sh,0,0,0,8,1,true,10)}catch(_){}objs.push(sh)});
  {const sh=shuttleModel();shipLook(sh,curShip());sh.position.set(-50,2.2,1103);sh.rotation.y=Math.PI*.82;try{shuttleAnim(sh,0,0,0,8,1,true,10)}catch(_){}D.add(sh);HUB.myShip=sh}
  bakeInto(D,objs);
  // signs
  const sign=(mat,w,h,x,y,z,ry)=>{if(mat.side===T.DoubleSide){mat.side=T.FrontSide;mat.needsUpdate=true}const m=new T.Mesh(new T.PlaneGeometry(w,h),mat);m.position.set(x,y,z);m.rotation.y=ry;D.add(m);const b=m.clone();b.rotation.y=ry+Math.PI;D.add(b);return m};
  sign(hubSign('SHIPWRIGHT','HANGAR 0 · TEO BRASK','#c9a6ff'),30,30,0,29,1083.2,0);sign(hubSign('GRAND CONCOURSE','ARMOURY · OUTFITTER · PLAZA','#ffb238'),14,14,0,15.5,1083.2,0);
  sign(hubSign('HOLLIS VANE','ARMOURY · WEAPONS','#ffb238'),26,26,-11.35,22,1031,Math.PI/2);sign(hubSign('MARLOW','OUTFITTERS · ARMOUR','#8fe6ff'),26,26,11.35,22,1031,-Math.PI/2);
  sign(hubSign('SUNBREAKER','40 M RAIL CANNON · NOT FOR SALE','#ff8a3a'),16,16,-35.7,14,1013,Math.PI/2);sign(hubSign('DECK PLAZA','TOWER VIEW','#8fe6ff'),10,10,0,13.5,986.3,0);
  SHIPK.forEach((id,i)=>{if(i>=4)return;const S2=SHIPS[id];sign(holoSign(S2.n.split(' ')[0].toUpperCase(),S2.price?S2.price.toLocaleString()+' CR':'STANDARD',i%2?'#8fe6ff':'#c9a6ff'),12,12,PADS[i][0],11,PADS[i][1]-9,Math.PI)});
  sign(holoSign('YOUR SHIP','E · TAKE OFF','#ffb238'),9,9,-50,9.5,1094,Math.PI);

  // scrolling holo-ads: stacked panels on a tall canvas, scrolled in hubTick
  HUB.ads=[];const AD=[['KESTREL YARDS','REFITS IN A DAY','#8fe6ff'],['VISIT EUROPA','ICE, SKY, SILENCE','#c9a6ff'],['HOLLIS VANE','LANCE & LOAD','#ffb238'],['MERIDIAN BANK','YOUR CREDITS, SAFE','#e2b23a'],
    ['MARLOW','WEAR THE STARS','#5fe0c8'],['DECK 9 NOODLES','HOT · FAST · CHEAP','#ff6a8a'],['SKYWAY TRANSIT','EVERY 6 MINUTES','#8ccf3a'],['SEED VAULT','GREENHOUSE NINE','#7dffb0']];
  const adMat=(off)=>{const t=paint(512,(g,S)=>{g.clearRect(0,0,S,S);for(let k=0;k<4;k++){const q=AD[(k+off)%AD.length],y=k*S/4;g.fillStyle='rgba(8,16,30,.7)';g.fillRect(8,y+8,S-16,S/4-16);g.strokeStyle=q[2];g.lineWidth=5;g.strokeRect(8,y+8,S-16,S/4-16);
      g.fillStyle=q[2];g.font='700 52px "Chakra Petch",sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(q[0],S/2,y+S/8-14);g.fillStyle='#f4ead2';g.font='600 28px "IBM Plex Mono",monospace';g.fillText(q[1],S/2,y+S/8+30)}});
    t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(1,.25);HUB.ads.push({t,y:off*.25,ph:Math.random()*4});return bas({map:t,transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide})};
  for(const[w,h,x,y,z,ry,o]of[[8,4,-11.3,9,996.5,Math.PI/2,0],[8,4,11.3,9,1062.5,-Math.PI/2,2],[8,4,-11.3,9,1062.5,Math.PI/2,4],[8,4,11.3,9,996.5,-Math.PI/2,6],
    [8.4,4.2,-77.9,38,1118,Math.PI/2,1],[8.4,4.2,77.9,38,1166,-Math.PI/2,3],[8.4,4.2,-77.9,38,1154,Math.PI/2,5],[18,9,30,22,987.4,0,7],[30,15,0,40,870,0,3]]){const m=new T.Mesh(new T.PlaneGeometry(w,h),adMat(o));m.position.set(x,y,z);m.rotation.y=ry;D.add(m)}
  {const f=new T.Mesh(new T.PlaneGeometry(161,62),bas({color:0x6fe0ff,transparent:true,opacity:.05,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending}));f.position.set(0,31,1199.7);D.add(f);HUB.field=f}
  // moving pieces: the hall armillary, the outfitter's scanner arch, Teo's turning ship hologram
  {const r=new T.Group();r.position.set(0,20,1030);D.add(r);for(let i=0;i<3;i++){const t=mesh(new T.TorusGeometry(4-i*.7,.12,8,64),gd,1,1,1,0,0,0);t.rotation.x=i*1.05;r.add(t)}r.add(mesh(GEO.sph,lt,.6,.6,.6,0,0,0));r.add(glow(0xffd27a,6,.6));HUB.ring=r}
  {const s=new T.Group();s.position.set(40,0,1030);D.add(s);s.add(mesh(GEO.cyl,gm,3,.3,3,0,.15,0));for(let i=0;i<3;i++){const t=mesh(new T.TorusGeometry(3.2,.08,6,48),cy,1,1,1,0,1+i*1.4,0);t.rotation.x=Math.PI/2;s.add(t)}
    for(const o of[-3.4,3.4])s.add(mesh(GEO.box,gd,.5,5.6,.5,o,2.8,0));s.add(mesh(GEO.box,gd,7.3,.5,.6,0,5.6,0));HUB.scan=s}
  {const t=new T.Group();t.position.set(22,4.6,1096);D.add(t);const sm=shuttleModel();sm.scale.setScalar(.16);t.add(sm);sm.traverse(o=>{if(o.isMesh)o.material=cy.clone()});sm.traverse(o=>{if(o.isMesh){o.material.transparent=true;o.material.opacity=.35;o.material.blending=T.AdditiveBlending;o.material.depthWrite=false}});HUB.turn=t}
  {const g=new T.Group();g.position.set(26,2.12,1046);g.scale.setScalar(1.25);D.add(g);const r=humanize(walkerRig(g,7),{key:'hero',panel:std({color:0xb8862a,roughness:.3,metalness:.8}),helm:3,visor:0xff5a4a,cy:[3,3],x:['cape']});if(r.segs.gun)r.segs.gun.visible=false;r.segs.arms.forEach(([a,b],j)=>{a.rotation.set(0,0,(j?-1:1)*.2);b.rotation.set(-.2,0,0)});HUB.hero=g}
  // vendors
  // ---- ambient people and machines: Meridian security, deck workers, and the station's service bots the Dark never reached
  HUB.npcs=[];HUB.drones=[];
  const npc=(kind,path,o)=>{const g=new T.Group();g.position.set(path[0][0],.95,path[0][1]);D.add(g);let rig;
    if(kind==='bot'){rig=walkerRig(g,7);const PL=charMats().plate[7],wm=HUB.botM||(HUB.botM=std({color:0xeae6da,roughness:.35,metalness:.35})),gm2=HUB.botG||(HUB.botG=std({color:0xd9a441,roughness:.25,metalness:.9}));
      let n=0;g.traverse(q=>{if(q.isMesh&&q.material===PL){q.material=(n++%5===0)?gm2:wm}});const h=rig.segs.head,hl=mesh(new T.TorusGeometry(.2,.025,6,32),gm2,1,1,1,0,.52,0);hl.rotation.x=Math.PI/2;h.add(hl);
      const gq=glow(0x4dff88,.32,.9);gq.position.set(0,.52,0);h.add(gq);if(rig.segs.gun)rig.segs.gun.visible=false}
    else{rig=humanize(walkerRig(g,7),o);if(!o.gun&&rig.segs.gun)rig.segs.gun.visible=false}
    HUB.npcs.push({g,rig,kind,path,i:1,wait:o&&o.stand?1e9:Math.random()*2,spd:(o&&o.spd)||1.5,pose:o&&o.pose,face:o&&o.face,E:{mv:0,ph:Math.random()*6,vy:0,kick:0,crouch:0,jet:0,burst:0,cd:1,ch:0,ft:0}});
    if(kind==='bot'&&o&&o.crate){rig.segs.tor.add(mesh(GEO.box,HUB.crM||(HUB.crM=std({color:0xd8a422,roughness:.5,metalness:.2})),.62,.46,.5,0,.36,.48))}
    if(o&&o.face!==undefined)g.rotation.y=o.face;HUB.npcs[HUB.npcs.length-1].weld=o&&o.weld};
  const CIV2=[0xd23c8c,0x1fb5a8,0xf08a24,0x8a4ad8].map(c=>std({color:c,roughness:.45,metalness:.2})),SEC=std({color:0x34507a,roughness:.45,metalness:.3}),HIV=std({color:0xd8a422,roughness:.55,metalness:.15});
  const WORK=(A,t)=>{armTo(A[0],[-.1,-.8,.6],[.2,-.3,1]);armTo(A[1],[.1,-.8,.6],[-.2,-.2,1])};
  npc('sol',[[-30,1192]],{key:'n1',panel:SEC,helm:3,visor:0xe08a2a,gun:1,stand:1,face:0});
  npc('sol',[[30,1192]],{key:'n2',panel:SEC,helm:1,visor:0xd9a441,gun:1,stand:1,face:0,cy:[0,3]});
  npc('sol',[[0,1215],[0,1395]],{key:'n3',panel:SEC,helm:3,visor:0xe08a2a,gun:1,spd:1.4});
  npc('sol',[[4,1068],[4,992],[-4,992],[-4,1068]],{key:'n4',panel:SEC,helm:0,visor:0x5fc8e8,gun:1,spd:1.3});
  npc('wrk',[[-60,1120],[-36,1140],[-20,1128]],{key:'n5',panel:HIV,helm:1,visor:0x5fc8e8,x:['tools'],spd:1.6,pose:WORK});
  npc('wrk',[[60,1128],[47.5,1140.5]],{key:'n6',panel:HIV,helm:0,visor:0x46d6a0,x:['tools'],cy:[2,0],spd:1.2,pose:WORK,weld:[49,1.5,1143]});
  npc('wrk',[[-12,1268],[-12,1302]],{key:'n7',panel:HIV,helm:2,visor:0xe07a2a,x:['tools'],spd:1.1,pose:WORK});
  npc('wrk',[[-20,950],[20,950]],{key:'n8',panel:std({color:0x6a4ab0,roughness:.45,metalness:.2}),helm:2,visor:0xb89ae0,x:['scarf'],spd:1});
  npc('bot',[[36,1100],[36,1185],[-36,1185],[-36,1125]],{spd:1.8,crate:1});npc('bot',[[-56,1194],[-40,1194],[-40,1128],[-40,1194]],{spd:1.5,crate:1});  npc('civ',[[-15,1040],[-15,1062],[-33,1066],[-33,1044]],{key:'n9',panel:CIV2[0],helm:2,visor:0xff6a8a,spd:1.1});npc('civ',[[16,1040],[34,1060],[54,1060],[54,1036],[30,1036]],{key:'n10',panel:CIV2[1],helm:0,visor:0x8ccf3a,x:['cape'],spd:1});  npc('civ',[[9.4,1070],[9.4,992]],{key:'n11',panel:CIV2[2],helm:3,visor:0xe2b23a,spd:1.2});npc('civ',[[-9.4,992],[-9.4,1070]],{key:'n12',panel:CIV2[3],helm:1,visor:0x37b6e8,x:['scarf'],spd:1.25});
  npc('bot',[[-4,1060],[-4,1000]],{spd:1.1});
  // hover drones: white shell, gold ring, cyan eye, twin rotors
  const dW=HUB.botM,dG=HUB.botG;for(const[cx,cy0,cz,r,w]of[[0,12,1140,40,.12],[0,9,1150,25,-.18],[0,14,1030,14,.22]]){const d=new T.Group();d.add(mesh(GEO.sph,dW,.42,.3,.42,0,0,0));const ring=mesh(new T.TorusGeometry(.48,.05,6,32),dG,1,1,1,0,0,0);ring.rotation.x=Math.PI/2;d.add(ring);
    d.add(mesh(GEO.sph,MAT.strip,.13,.13,.08,0,0,.38));for(const s of[-1,1]){d.add(mesh(GEO.box,dG,.06,.06,.5,s*.62,.12,0));d.add(mesh(GEO.cyl,MAT.blur,.32,.01,.32,s*.62,.2,0))}const q=glow(0x4dff88,.3,.9);q.position.y=.36;d.add(q);D.add(d);HUB.drones.push({d,cx,cy:cy0,cz,r,w,a:Math.random()*6})}
  const vend=(k,x,z,ry,col)=>{const v=new T.Group();v.position.set(x,.95,z);v.rotation.y=ry;D.add(v);const VO=VEND[k],rig=humanize(walkerRig(v,7),Object.assign({key:'v'+k,panel:std({color:lin(col),roughness:.45,metalness:.2})},VO));
    rig.segs.pel.parent.scale.multiplyScalar(VO.sc);v.position.y=.95*VO.sc;if(rig.segs.gun)rig.segs.gun.visible=false;rig.pose=VO.pose;HUB.vend.push({rig,E:{mv:0,ph:x,vy:0,kick:0,crouch:0,jet:0,burst:0,cd:1,ch:0,ft:0}})};
  vend('w',-25.8,1024,Math.PI/2,'#ffb238');vend('a',25.8,1024,-Math.PI/2,'#8fe6ff');vend('s',22,1094.6,0,'#c9a6ff');
  HUB.pts.push({k:'w',x:OX-19.2,z:OZ+1024,r:3.6,label:'E · BROWSE WEAPONS · HOLLIS VANE'},{k:'a',x:OX+19.2,z:OZ+1024,r:3.6,label:'E · BROWSE ARMOUR · INES MARLOW'},
    {k:'s',x:OX+22,z:OZ+1101.5,r:3.6,label:'E · BROWSE SHIPS · TEO BRASK'},{k:'x',x:OX-40,z:OZ+1100,r:4.5,label:'E · BOARD YOUR SHIP · TAKE OFF'},{k:'mb',x:OX-6.5,z:OZ+1068.6,r:2.6,label:'E · MISSION BOARD'});
  // lights: a few warm and cool points; the rest of the glow is emissive and bloom
  for(const[x,y,z,c,i,r]of[[0,40,1120,0xfff0d8,4,110],[-50,30,1160,0xdfe8ff,3,80],[50,30,1160,0xdfe8ff,3,80],[0,24,1030,0xffe6c0,3.4,60],[-38,22,1050,0xffd0a0,4,55],[-24,14,1062,0xffe0c0,3,40],[-49,18,1012,0x8fe6ff,2.4,40],[38,22,1030,0xf2f6ff,3.4,55]]){const pl=new T.PointLight(c,i*LP,r,2);pl.position.set(x,y,z);D.add(pl)}
  // ===== collision (local) =====
  // hangar: back wall either side of the door, side walls, the mouth corners and the platform
  SB(-85,0,1074,-9.5,64,1082);SB(9.5,0,1074,85,64,1082);for(const s of[-1,1]){SB(s*81,0,1074,s*89,64,1202)}
  for(const s of[-1,1])SB(s*35.4,0,1200.5,s*82,4,1203);for(const s of[-1,1])SB(s*35.2,0,1203,s*36.5,4,1561);for(let k=0;k<72;k++){const an=k*Math.PI/36,x=Math.sin(an)*40.4,z=1590+Math.cos(an)*40.4;if(z<1566&&Math.abs(x)<35.5)continue;SB(x-1.9,0,z-1.9,x+1.9,4,z+1.9)}for(const s of[-1,1])SB(s*27,0,1559.5,s*36.5,4,1562);
  SB(17.5,0,1096.8,26.5,1.15,1099.2);for(const s of[-1,1])SB(s*79,0,1084,s*82,1,1198);
  for(const[x,z]of[[-55,1152],[-18,1158],[18,1158],[55,1152],[-50,1103]])SB(x-6,0,z-7.5,x+6,4.2,z+7.5);
  for(const s of[-1,1]){for(let k=0;k<28;k++)SB(s*69.5,0,1084+k,s*73.5,.5*(k+1),1085+k,1);SB(s*69.5,13.7,1112,s*78.75,14,1116.2,1);SB(s*74.25,13.7,1083,s*78.75,14,1199,1);SB(s*74.15,14,1083,s*74.45,15.2,1111.8);SB(s*74.15,14,1116.4,s*74.45,15.2,1199);SB(s*69.3,.5,1084,s*69.5,15,1112)}
  for(let k=0;k<26;k++){const s=k%2?1:-1,z=1092+(k>>1)*8.4,h=hash(k,5);if(Math.abs(z-1102)<6&&s<0||z>1160||z<1118)continue;const x=s*(68-h*4);SB(x-1.7,0,z-1.4,x+1.7,k%3===0?4.3:1.4,z+1.4+(k%3===1?1.1:0))}
  // platform: control tower, containers, crane post, pads (step-up floors) and the parked ship on pad 1
  SB(16,0,1232,32,36,1248);for(let k=0;k<8;k++){const z=1264+(k>>1)*12,x=-24+(k%2)*7;SB(x-3,0,z-5.5,x+3,k%5===0?7.5:5,z+5.5)}SB(-31,0,1349,-29,32,1351);
  for(const r of[1430,1510])SB(-24,0,r-24,24,.35,r+24,1);
  // concourse: side walls, rear wall either side of the plaza door, storefronts, counters, cases, the cannon glass, alcove fronts, planters
  for(const s of[-1,1]){SB(s*61.9,0,984,s*64,32,1074);SB(s*8,0,984,s*64,32,987);SB(s*11.5,0,986,s*12.5,32,1010);SB(s*11.5,0,1052,s*12.5,32,1074)}
  SB(-23.2,0,1018,-20.8,1.15,1030);SB(-28,0,1029.8,-20.8,1.15,1032.2);SB(23.2,0,1018,20.8,1.15,1030);SB(28,0,1029.8,20.8,1.15,1032.2);
  for(const z of[1040,1050,1060])SB(-30.6,0,z-3.1,-27.4,1.5,z+3.1);SB(-36.3,0,987,-35.7,20,1043.6);SB(-62,0,1043,-35.7,20,1043.6);SB(18,0,987,32,5,988.4);
  SB(-60.3,0,1051.8,-57.8,1.2,1060.2);SB(-60.2,0,1045.2,-52.5,2.8,1046.8);
  SB(15,0,1068.4,62,8,1074);SB(58.2,0,987,62,8,1033.5);SB(37,0,1027,43,5.6,1033);SB(22.4,0,1042.4,29.6,2,1049.6);for(const x of[34,40,46,52])SB(x-1,0,999,x+1,2,1001);
  for(const z of[996,1018,1042,1064])SB(-1.7,0,z-1.7,1.7,1,z+1.7);for(const z of[996,1018,1042,1064])for(const s of[-1,1])SB(s*6.5-.5,0,z-1.6,s*6.5+.5,.5,z+1.6);
  for(const s of[-1,1])for(let z=991;z<1074;z+=11)SB(s*11.2-.9,0,z-.9,s*11.2+.9,32,z+.9);
  for(const s of[-1,1]){SB(s*60.8,0,1178,s*73.6,5.4,1190);SB(s*60.8,0,1164,s*73.6,2.6,1176)}SB(-1.6,0,1124.5,1.6,3.6,1137.2);for(const s of[-1,1])for(let z=1118;z<1196;z+=12)SB(s*77.3,0,z+4.2,s*78.3,3.2,z+7.8);
  SB(-20.8,0,1044,-19.2,3.2,1060);SB(-34,0,1009.2,-14,1.1,1010);for(const x of[-30,-24,-18])SB(x-.2,0,989,x+.2,2.2,990);
  for(let k=0;k<5;k++)SB(29.4+k*5,0,1013.4,30.6+k*5,1.2,1014.6);for(const[x,z,w,d]of[[46,1044,6,1.8],[46,1053,6,1.8],[51,1048.5,1.8,6]])SB(x-w/2,0,z-d/2,x+w/2,1.2,z+d/2);SB(38.6,0,1046.6,41.4,1,1049.4);
  for(const[x,z]of[[15,990],[60,990],[15,1066],[34,990],[-15,1066],[-33,1068]])SB(x-.9,0,z-.9,x+.9,1,z+.9);SB(-6.6,0,1070.4,-5.4,1.3,1071.6);
  SB(-7.2,0,947.8,7.2,1.6,962.2);for(const s of[-1,1])for(let k=0;k<3;k++){const x=s*(18+k*7),z=946+(k%2)*14;SB(x-1.4,0,z-1.4,x+1.4,1,z+1.4)}SB(-7.3,0,1070.4,-5.7,2.4,1071.2);
  // plaza: railings round a 80 x 54 m patch of deck outside the rear doors
  SB(-40.5,0,929,40.5,4,930);for(const s of[-1,1])SB(s*40,0,929,s*40.5,4,984);

  // ===== light and space: dust in the light at the mouth, god-ray sheets, heavy traffic outside, a capital ship drifting past =====
  {const N=500,P2=new Float32Array(N*3);for(let i=0;i<N;i++){P2[i*3]=(Math.random()-.5)*150;P2[i*3+1]=Math.random()*40;P2[i*3+2]=1090+Math.random()*112}const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(P2,3));
    const dt2=paint(32,(g,S)=>{const gr=g.createRadialGradient(S/2,S/2,0,S/2,S/2,S/2);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.4,'rgba(255,255,255,.35)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,S,S)});const dm=new T.PointsMaterial({color:0xffe6c0,map:dt2,size:.05,transparent:true,opacity:.5,depthWrite:false,blending:T.AdditiveBlending});const pts=new T.Points(g,dm);D.add(pts);HUB.dust=pts}
  {const rt=paint(128,(g,S)=>{const gr=g.createLinearGradient(0,0,0,S);gr.addColorStop(0,'rgba(255,230,190,0)');gr.addColorStop(.25,'rgba(255,230,190,.5)');gr.addColorStop(1,'rgba(255,230,190,0)');g.fillStyle=gr;g.fillRect(0,0,S,S)});
    const rm=bas({map:rt,transparent:true,opacity:.09,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide});rm.userData.noShadow=true;HUB.rays=rm;
    for(let k=0;k<7;k++){const m=new T.Mesh(new T.PlaneGeometry(10+hash(k,3)*14,90),rm);m.position.set(-60+k*20,24,1170);m.rotation.set(-1.08,0,0);D.add(m)}}
  HUB.traf=[];const lane=(x0,y0,z0,x1,y1,z1,spd,sc,ph,tint)=>{const sh=shuttleLite();sh.scale.setScalar(sc);if(tint){sh.traverse(o=>{if(o.isMesh&&o.material&&o.material.color&&!o.material.transparent){o.material=o.material.clone();o.material.color.multiply(new T.Color(tint))}})}D.add(sh);
    const a=new T.Vector3(x0,y0,z0),b=new T.Vector3(x1,y1,z1),L=a.distanceTo(b);HUB.traf.push({g:sh,a,b,L,spd,u:ph})};
  lane(-3000,120,2400,3000,160,2600,140,1,0);lane(2500,280,3400,-2500,300,3200,110,1.4,.6);lane(1200,-150,1900,-1400,-90,2100,150,1,.3);
  // shadows: everything here receives them; glass, light sheets and glows do not block the sun
  G.traverse(o=>{if(!o.isMesh&&!o.isPoints)return;const m=o.material;const tr=Array.isArray(m)?false:(m.transparent||m.blending===T.AdditiveBlending);o.receiveShadow=!tr;o.castShadow=!tr&&!(m&&m.userData&&m.userData.noShadow)});
  G.visible=false}
