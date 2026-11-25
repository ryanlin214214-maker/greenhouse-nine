  // ---- v93: the facade kit all the way round. Before this, the terrace walls had ribs and window rows only in the plaza
  // sector (|t| < 0.36 rad); everywhere else they were the plain 1/8-scale cylinders of the station model. Real size,
  // merged per material, so it shows from space and on foot alike.
  // built as eight 45-degree sectors so the parts behind you are culled; the small parts cast no shadows
  for(let SEC=0;SEC<8;SEC++){const fo=greeble(G,'meriF'+SEC,(a0,R)=>{const a=(...q)=>{const x=q[5],z=q[7],an=(Math.atan2(x,z)+Math.PI*2)%(Math.PI*2);if(Math.min(7,Math.floor(an/(Math.PI/4)))===SEC)a0(...q)};
    const W2=W.clone();W2.color.setHex(0x8f8b80).convertSRGBToLinear();const Wd=std({color:0x1a2329,roughness:.1,metalness:.7}),Wa=bas({color:0xb88a4a});
    const QE=(lean,t)=>new T.Quaternion().setFromEuler(new T.Euler(-lean,t,0,'YXZ'));
    const PO=(t,r,la)=>[Math.sin(t)*r+Math.cos(t)*la,Math.cos(t)*r-Math.sin(t)*la];
    // a sloped circular wall: gold ribs, a cladding panel per bay (a step proud of the wall), rows of windows (lit, dim or
    // dark glass) with gold sills, cornices above and below the panels; skip(u) leaves a sector alone
    const wall=(rb,rt,y0,y1,step,skip,p0,p1,rowStep,nWin,seed)=>{const lean=Math.atan((rb-rt)/(y1-y0)),rr=y=>rb+(rt-rb)*(y-y0)/(y1-y0),H=(y1-y0)/Math.cos(lean);
      for(let k=0,n=Math.round(2*Math.PI/step);k<n;k++){const u=k*step;if(skip(u))continue;const v=u+step/2,ym=(y0+y1)/2;
        a(GEO.box,Gd,1.4,H+1,1.4,Math.sin(u)*(rr(ym)+.5),ym,Math.cos(u)*(rr(ym)+.5),QE(lean,u));
        const pm=(p0+p1)/2,bw=step*rr(pm)-3,q=QE(lean,v);
        a(GEO.box,W2,bw,(p1-p0)/Math.cos(lean),.6,Math.sin(v)*(rr(pm)+.3),pm,Math.cos(v)*(rr(pm)+.3),q);
        for(const y of[p0-.6,p1+.6]){const[x,z]=PO(v,rr(y)+.55,0);a(GEO.box,Gd,bw+2.8,1.1,1.1,x,y,z,q)}
        for(let y=p0+3,j=0;y<p1-2;y+=rowStep,j++){const r=rr(y)+.75;for(let i=0;i<nWin;i++){const la=(i-(nWin-1)/2)*(bw/nWin),[x,z]=PO(v,r,la),h=hash(k*7+i+seed,j*3+seed);
            a(GEO.box,h>.6?Wn:h>.42?Wa:Wd,bw/nWin-1.8,2.2,.4,x,y,z,q)}
          const[x,z]=PO(v,rr(y-1.4)+.85,0);a(GEO.box,Gd,bw-.4,.22,.5,x,y-1.4,z,q)}}};
    // smooth skins over the station model's faceted walls (64 and 48 sides: up to 1 m between a facet and the circle the
    // detail is laid on), so every panel, rib and window sits on the surface instead of hovering off a flat facet
    a(new T.CylinderGeometry(840.06,864.06,112,720,1,true),W,1,1,1,0,56,0);a(new T.CylinderGeometry(496.06,520.06,128,540,1,true),W,1,1,1,0,176,0);
    const off=(u,c,h)=>Math.abs(Math.atan2(Math.sin(u-c),Math.cos(u-c)))<h;
    // terrace one (r 864 -> 840, 0..112 m): the plaza sector keeps its own ribs and portal
    wall(864,840,0,112,.036,u=>off(u+.018,0,.37),27,106,6,2,11);
    // terrace two (r 520 -> 496, 112..240 m): seen from the Sky Garden; the glass atrium sits against it at the front
    wall(520,496,112,240,.06,u=>off(u+.03,0,.3),117,235,6,2,29);
    // the colonnade on terrace one (48 columns 12.8 m across, 112..192 m): a base drum with a gold ring, sixteen dark
    // flutes, two gold bands, a flared gold capital and an ivory abacus under the existing gold block
    for(let k=0;k<48;k++){const t=k*Math.PI/24,x=Math.cos(t)*824,z=Math.sin(t)*824;
      a(GEO.cyl,W2,7.2,4,7.2,x,114,z);a(new T.TorusGeometry(7.2,.3,6,32),Gd,1,1,1,x,116,z,Math.PI/2,0,0);
      for(let j=0;j<16;j++){const f=(j+.5)*Math.PI/8;a(GEO.box,Dk,.9,66,.3,x+Math.sin(f)*6.33,151,z+Math.cos(f)*6.33,0,f,0)}
      for(const y of[140,166])a(new T.TorusGeometry(6.5,.32,6,32),Gd,1,1,1,x,y,z,Math.PI/2,0,0);
      a(new T.CylinderGeometry(7.6,6.4,3,16),Gd,1,1,1,x,188.5,z);a(GEO.box,W2,14.6,1.6,14.6,x,190.8,z)}
    // the five secondary spires (lathe profile r 96 -> 56 over the first 440 m): gold ribs up the facets and window bands
    const SP=[[0,96],[200,80],[440,56]];const spR=y=>y<200?96-16*y/200:80-24*(y-200)/240;
    for(let k=0;k<6;k++){const t=k*Math.PI/3+Math.PI/6,cx=Math.cos(t)*688,cz=Math.sin(t)*688;if(cz>480&&Math.abs(cx)<240)continue;
      for(let s=0;s<2;s++){const[y0,r0]=SP[s],[y1,r1]=SP[s+1],lean=Math.atan((r0-r1)/(y1-y0)),L=(y1-y0)/Math.cos(lean),ym=(y0+y1)/2;
        const N=20,cf=Math.cos(Math.PI/N);
        for(let j=0;j<N;j++){const f=j*2*Math.PI/N,r=spR(ym)-.25;a(GEO.box,Gd,1.2,L,1.2,cx+Math.sin(f)*r,112+ym,cz+Math.cos(f)*r,QE(lean,f))}
        for(let y=y0+14;y<y1-8;y+=12)for(let j=0;j<N;j++){const f=(j+.5)*2*Math.PI/N,r=spR(y)*cf+.12,w=2*spR(y)*Math.sin(Math.PI/N)-5,h=hash(k*31+j,Math.round(y));
          a(GEO.box,h>.58?Wn:h>.4?Wa:Wd,w,2,.35,cx+Math.sin(f)*r,112+y,cz+Math.cos(f)*r,QE(lean,f))}}}
  },true);fo.traverse(o=>{if(o.isMesh)o.castShadow=false})}
