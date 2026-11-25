    // ---- v93 (inside the Sky Garden block): grounding fixes, fuller trees, the garden continued round the whole terrace,
    // and soft contact shadows.
    {const IMc=(geo,mat,list,tint)=>{const im=IM(geo,mat,list);if(tint){const c=new T.Color();list.forEach((q,i)=>{const h=hash(i,91);c.setRGB(.82+.3*h,.9+.18*hash(i,92),.8+.2*hash(i,93));im.setColorAt(i,c)});im.instanceColor.needsUpdate=true}im.castShadow=true;return im};
     const sh=[];IMc(HUB.crown(2.4),MAT.leaf,tc,1);IMc(HUB.crown(1.6),MAT.leafD||MAT.leaf,tc2,1);
     // the cafe: a pole from the floor through each table to the umbrella, a weighted foot, two chairs per table, and the
     // two people who sat in the air now have chairs under them
     {const ft=[],pl=[],seat=[],back=[],legs=[];const chair=(x,z,ry)=>{seat.push([x,Y+.44,z,ry]);const bx=x-Math.sin(ry)*.24,bz=z-Math.cos(ry)*.24;back.push([bx,Y+.72,bz,ry]);
         for(const[a1,b1]of[[-.2,-.2],[.2,-.2],[-.2,.2],[.2,.2]]){legs.push([x+Math.cos(ry)*a1+Math.sin(ry)*b1,Y+.2,z-Math.sin(ry)*a1+Math.cos(ry)*b1,ry])}sh.push([x,Y,z,.9,.9])};
      for(const[a,r]of[[-.1,786],[-.085,794],[-.07,786],[.09,786],[.105,794]]){const p=PT(a,r);ft.push([p.x,Y+.04,p.z,0]);pl.push([p.x,Y+1.6,p.z,0]);sh.push([p.x,Y,p.z,3.4,3.4]);
        for(const s of[-1,1]){const t=TC+a+(s>0?0:Math.PI);chair(p.x+Math.sin(t)*.95,p.z+Math.cos(t)*.95,t+Math.PI)}}
      for(const[a,ry]of[[-.1,TC-.1],[.09,TC+.09]]){const p=PT(a,784.6);chair(p.x-Math.sin(ry)*.08,p.z-Math.cos(ry)*.08,ry)}
      IM(new T.CylinderGeometry(.42,.5,.08,16),gm,ft);IM(new T.CylinderGeometry(.05,.05,3.2,6),gm,pl);IM(new T.BoxGeometry(.5,.07,.48),iv2,seat);IM(new T.BoxGeometry(.5,.55,.06),iv2,back);IM(new T.BoxGeometry(.05,.4,.05),gm,legs)}
     // shadows under the garden's trees, benches, lamps, flower beds, fountain and baked people
     for(let a=-.18;a<=.181;a+=.03){for(const[aa,r]of[[a,712],[a+.015,742]]){const p=PT(aa,r);sh.push([p.x,Y,p.z,5.2,5.2])}}
     for(let a=-.17;a<=.171;a+=.034)if(!CA.some(c=>Math.abs(a-c)<.03)&&Math.abs(a-LA)>.03){const p=PT(a,806);sh.push([p.x,Y,p.z,5.2,5.2])}
     for(let a=-.18;a<=.181;a+=.03){for(const o of[.007,-.008]){const p=PT(a+o,770);sh.push([p.x,Y,p.z,3.6,1.5,TC+a])}const l1=PT(a+.015,750),l2=PT(a,768);sh.push([l1.x,Y,l1.z,.9,.9],[l2.x,Y,l2.z,.9,.9])}
     {const p=PT(0,756);sh.push([p.x,Y,p.z,15,15])}
     for(const[a,r]of[[.007,770.3],[-.053,770.3],[.097,770.3],[.02,760],[.0215,761.4],[-.015,748],[.12,752],[-.14,765]]){const p=PT(a,r);sh.push([p.x,Y,p.z,1.1,1.1])}
     // the fountain: a visible water column, a falling water bell and ripples, instead of a glow floating over a thin jet
     {const p=PT(0,756),wm=new T.MeshBasicMaterial({color:0xcfefff,transparent:true,opacity:.32,depthWrite:false,side:T.DoubleSide});
      const col=new T.Mesh(new T.CylinderGeometry(.12,.28,3.3,12,1,true),wm);col.position.set(p.x,Y+4.35,p.z);D.add(col);
      const bell=new T.Mesh(new T.CylinderGeometry(.3,3.2,4.9,24,1,true),wm.clone());bell.material.opacity=.16;bell.position.set(p.x,Y+3.45,p.z);D.add(bell);
      for(const[r,o]of[[3.4,.3],[4.6,.18]]){const rp=new T.Mesh(new T.RingGeometry(r-.15,r,40),wm.clone());rp.material.opacity=o;rp.rotation.x=-Math.PI/2;rp.position.set(p.x,Y+.83,p.z);D.add(rp)}
      HUB.fount={col,bell}}
     // the garden continues round the whole terrace (not walkable beyond the rails; seen from the garden and from flight):
     // paving, lawns, a path, tree rows, lamps, benches and flower beds, clear of the five spires and the glass atrium
     {const OUT=(t,r)=>{const q=Math.atan2(Math.sin(t-TC),Math.cos(t-TC));if(Math.abs(q)<HA+.004)return true;
        if(Math.abs(Math.atan2(Math.sin(t),Math.cos(t)))*r<175&&r<850)return true;
        for(const s of[Math.PI/3,-Math.PI/3,2*Math.PI/3,-2*Math.PI/3,Math.PI]){const sx=Math.sin(s)*688,sz=Math.cos(s)*688;if(Math.hypot(Math.sin(t)*r-sx,Math.cos(t)*r-sz)<106)return true}return false};
      const rng=(r0,r1,mat,y)=>{const m=new T.Mesh(new T.RingGeometry(r0,r1,720,2,TC+HA-Math.PI/2,2*Math.PI-2*HA),mat);m.rotation.x=-Math.PI/2;m.position.y=y;m.receiveShadow=true;D.add(m)};
      rng(R0-1.5,R1+.6,std({map:pv2,roughness:.7,metalness:.04,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),Y+.02);
      rng(752,766,std({color:0x5d564c,roughness:.6,metalness:.05,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3}),Y+.03);
      {const lw=paint(256,(g,S)=>{g.fillStyle='#3d5a2c';g.fillRect(0,0,S,S);for(let i=0;i<2600;i++){const v=Math.random();g.fillStyle=v<.5?'rgba(84,120,58,.5)':'rgba(40,62,30,.5)';g.fillRect(Math.random()*S,Math.random()*S,1+Math.random()*2,2+Math.random()*4)}});lw.wrapS=lw.wrapT=T.RepeatWrapping;lw.repeat.set(500,500);
       const lm=std({map:lw,roughness:.95,metalness:0,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3});rng(704,749,lm,Y+.04);rng(776,800,lm,Y+.04)}
      const tp=[],tt=[],tc=[],tc2=[],lp=[],lh=[],pls=[],bn=[],fb=[],sk=[],skc=[],hg=[];
      const ang=(r,st,f)=>{for(let t=0;t<2*Math.PI-1e-6;t+=st){if(!OUT(t,r))f(t)}};
      for(const[r,o]of[[712,0],[742,.015]])ang(r,.03,t=>{const p=P2(t+o,r);if(OUT(t+o,r))return;tp.push([p.x,Y+.45,p.z,0]);tt.push([p.x,Y+2.6,p.z,0]);const k=hash(Math.round(t*1000),r);tc.push([p.x,Y+5.6,p.z,t*7,1+k*.3,1+k*.25,1+k*.3]);sh.push([p.x,Y,p.z,5.2,5.2])});
      for(const[r,o]of[[750,.015],[768,0]])ang(r,.03,t=>{const p=P2(t+o,r);if(OUT(t+o,r))return;lp.push([p.x,Y+2.6,p.z,t]);lh.push([p.x,Y+5.25,p.z,t]);pls.push([p.x,Y+.06,p.z,10,0xffd6a0,.28])});
      ang(770,.06,t=>{const p=P2(t+.007,770);bn.push([p.x,Y+.24,p.z,t]);sh.push([p.x,Y,p.z,3.6,1.5,t])});
      ang(727,.03,t=>{const p=P2(t,727);fb.push([p.x,Y+.25,p.z,t])});
      for(let k=0;k<48;k++){const t=k*Math.PI/24;if(Math.abs(Math.atan2(Math.sin(t-TC),Math.cos(t-TC)))<HA)continue;if(Math.abs(Math.atan2(Math.sin(t),Math.cos(t)))<.12)continue;const p=P2(t,824);sk.push([p.x,Y+.4,p.z,t]);skc.push([p.x,Y+.86,p.z,t]);hg.push([p.x,Y+1.2,p.z,t])}
      IM(new T.CylinderGeometry(1.5,1.7,.9,14),iv2,tp);IM(new T.CylinderGeometry(.22,.32,4.4,8),MAT.bark||gm,tt);IMc(HUB.crown(2.4,0),MAT.leaf,tc,1).castShadow=false;
      IM(new T.BoxGeometry(.22,5.2,.22),gm,lp);IM(new T.BoxGeometry(.9,.22,.5),lt,lh);IM(new T.BoxGeometry(3,.45,.9),iv2,bn);IM(new T.BoxGeometry(8,.5,3),MAT.leafD||MAT.leaf,fb);
      IM(new T.BoxGeometry(15.4,.8,15.4),iv2,sk);IM(new T.BoxGeometry(15.6,.12,15.6),gd,skc);IM(new T.BoxGeometry(14.6,.7,14.6),MAT.leafD||MAT.leaf,hg);
      {const pm4=poolMesh(pls);pm4.userData.noShadow=true;D.add(pm4)}}
     HUB.blobs(sh)}
