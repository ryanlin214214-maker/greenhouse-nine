p='/home/user/greenhouse-nine/index.html'
s=open(p).read()
def rep(a,b):
  global s
  assert s.count(a)==1,(s.count(a),a[:90]); s=s.replace(a,b)
old=s[s.index("   for(const[fx,fz,fr]of[[-55,215,0],[55,215,0],[-30,190,.4],[34,188,-.3]]){deco(GEO.box,MAT.gun,3,2,12,fx,1.6,fz,0,fr,0);"):s.index("   for(const x of[-80,80])box(x,0,205,2,22,2,MAT.hull);")]
rep(old,"   // parked Kestrel shuttles are drawn at the end of start-up (parkShuttles); their coarse collision is here so pathfinding sees it\n   for(const[fx,fz,fr]of PARKED)for(const k of[-4,0,4]){const cx=fx-Math.sin(fr)*k,cz=fz-Math.cos(fr)*k;boxes.push({lo:[cx-1.6,0,cz-2.1],hi:[cx+1.6,3.4,cz+2.1]})}\n")
rep("const NAVW=[];","const PARKED=[[-55,215,0],[55,215,0],[-30,190,.4],[34,188,-.3]];const NAVW=[];")
anchor="    for(let z=170;z<255;z+=17)box(0,r.h-2,z,160,.25,.6,MAT.strip,false)}\n"
rep(anchor,anchor+r"""  // HANGAR set pieces at eye level: storage racks on the back wall, gantry towers on the side walls, fuel bowsers and ordnance carts by the pads.
  // The launch lane (x within 40 of the centre line from z 195 to the mouth), the skiff routes and the middle of the floor stay clear.
  {const r=R['HANGAR'],SB=(x,y,z,w,h,d)=>boxes.push({lo:[x-w/2,y,z-d/2],hi:[x+w/2,y+h,z+d/2]});
    for(const sx of[-1,1])for(let k=0;k<6;k++){const x=sx*(20+k*12),z=r.z0+2.6,w=10;SB(x,0,z,w,6.4,4);
      for(const ux of[-w/2+.2,-w/6,w/6,w/2-.2])for(const uz of[-1.8,1.8])box(x+ux,0,z+uz,.22,6.4,.22,MAT.metal,false);
      for(const y of[.15,2.25,4.35])box(x,y,z,w,.14,4,MAT.armorD,false);box(x,6.3,z,w+.2,.15,4.2,TRIM.a,false);box(x,0,z+2.12,w,.25,.06,TRIM.a,false);
      for(const ex of[-w/2+.2,w/2-.2])deco(GEO.box,MAT.metal,.1,5.4,.1,x+ex,3.2,z,.6,0,0);
      for(let L=0;L<3;L++){let cx=x-w/2+.4,j=0;while(j<8){const cw=1.1+hash(k*7+L*3+j,sx+5)*1.5,ch=.7+hash(k*5+L+j,sx+9)*1.1;if(cx+cw>x+w/2-.3)break;
        box(cx+cw/2,[.29,2.39,4.49][L],z+(hash(j,L+k)-.5)*.5,cw,ch,2.2+hash(j+3,L)*.9,(j+L+k)%2?MAT.crateA:MAT.crateB,false);cx+=cw+.25;j++}}}
    for(const sx of[-1,1])for(const z of sx<0?[200,226,250]:[172,200,226,250]){const x=sx*101;box(x,0,z,6,1,5,MAT.armorD);box(x-sx*3.02,0,z,.04,1,5,TRIM.a,false);
      for(const ox of[-2.8,2.8])for(const oz of[-2.3,2.3])box(x+ox,1,z+oz,.35,9,.35,MAT.metal,false);
      for(const y of[4,7.5]){box(x,y,z,6,.2,5,MAT.armorD,false);for(const oz of[-2.4,2.4])box(x,y+1,z+oz,6,.06,.06,MAT.metal,false);box(x-sx*2.95,y+1,z,.06,.06,5,MAT.metal,false);for(const oz of[-2.4,0,2.4])box(x-sx*2.95,y,z+oz,.06,1,.06,MAT.metal,false)}
      for(const oz of[-2.3,2.3])for(const[y0,h]of[[1,3],[4,3.5],[7.5,2.5]])deco(GEO.box,MAT.metal,.12,Math.hypot(h,5.6),.12,x,y0+h/2,z+oz,0,0,Math.atan2(5.6,h)*(oz>0?1:-1));
      for(let y=1.3;y<7.5;y+=.35)box(x-sx*3.05,y,z,.05,.05,.6,MAT.metal,false);for(const oz of[-.32,.32])box(x-sx*3.05,1,z+oz,.06,7.6,.06,MAT.metal,false);
      box(x,4.2,z-.9,2,1.3,1.1,MAT.armorD,false);box(x-sx*1.01,4.7,z-.9,.04,.6,.9,TRIM.c,false);box(x+sx*1.2,7.7,z+1,1.4,1.2,1.4,MAT.crateA,false);box(x-sx*.6,7.7,z+1.2,1.1,.8,1.1,MAT.crateB,false);
      box(x,10,z,.6,.3,.6,MAT.armorD,false);deco(GEO.sph,MAT.amber,.25,.25,.25,x,10.45,z);GLOWS.push([x,10.45,z,0xffb238,2.5,.6])}
    for(const sx of[-1,1]){const x=sx*68,z=206;SB(x,0,z,2.6,2.7,5.2);box(x,.5,z,2.4,1.1,5,MAT.armorD,false);deco(GEO.cyl,MAT.gunL,1.0,3.4,1.0,x,2.1,z+.6,1.571,0,0);
      for(const e of[-1.15,2.35])deco(GEO.cyl,MAT.gunD,1.05,.14,1.05,x,2.1,z+e,1.571,0,0);box(x,1.6,z-1.95,2.2,1.4,1.1,MAT.armorD,false);box(x,2.1,z-2.52,1.9,.6,.04,MAT.pane,false);
      for(const ox of[-1.25,1.25])for(const oz of[-1.6,1.6])deco(GEO.cyl,MAT.gunD,.45,.3,.45,x+ox,.45,z+oz,0,0,1.571);for(const ox of[-1.21,1.21])box(x+ox,.9,z,.04,.18,5,TRIM.a,false);
      deco(GEO.tor,MAT.gunD,.35,.35,.35,x-sx*1.35,1.5,z+1.6,0,1.571,0);deco(GEO.cyl,MAT.gunD,.07,9,.07,x-sx*5.8,.07,z+1.6,0,0,1.571);
      box(x-sx*3.2,0,z-3.2,1.4,1.1,.8,MAT.armorD);box(x-sx*3.2,1.1,z-3.2,1.2,.06,.6,TRIM.r,false)}
    for(const[x,z]of[[-44,184],[48,182]]){SB(x,0,z,2,1.7,3.4);box(x,.35,z,1.8,.45,3.2,MAT.armorD,false);for(const ox of[-.85,.85])for(const oz of[-1.2,1.2])deco(GEO.cyl,MAT.gunD,.3,.2,.3,x+ox,.3,z+oz,0,0,1.571);
      for(const ox of[-.5,0,.5]){deco(GEO.cyl,MAT.gunL,.17,2.4,.17,x+ox,1.05+(ox?0:.3),z,1.571,0,0);const c=new T.ConeGeometry(1,1,12);deco(c,MAT.gunO,.17,.5,.17,x+ox,1.05+(ox?0:.3),z-1.45,-1.571,0,0);
        for(const a of[0,1.571])deco(GEO.box,MAT.gunD,.02,.3,.35,x+ox,1.05+(ox?0:.3),z+1.05,0,0,a)}box(x,.8,z+1.6,1.8,.9,.06,MAT.armorD,false)}
    for(const[fx,fz,fr]of PARKED){const c=Math.cos(fr),sn=Math.sin(fr);for(const[ux,uz,L,ang]of[[-6.5,0,18,0],[6.5,0,18,0],[0,-9,13,1.571],[0,9,13,1.571]]){
        const x=fx+ux*c+uz*sn,z=fz-ux*sn+uz*c;deco(GEO.box,TRIM.a,.25,.02,L,x,.04,z,0,fr+ang,0)}
      for(const ux of[-3.5,3.5])for(const uz of[-5,5])deco(GEO.cyl,MAT.gunD,.18,.08,.18,fx+ux*c+uz*sn,.04,fz-ux*sn+uz*c)}
    for(const sx of[-1,1])deco(GEO.cyl,MAT.gunD,.09,40,.09,sx*42,.09,175,1.571,0,0)}
""")
rep("requestAnimationFrame(frame);\n})();","""// parked Kestrels in the hangar: real shuttle models with the gear down, merged into one mesh per material so four of them cost a handful of draw calls
try{const by=new Map();for(const[fx,fz,fr]of PARKED){const g=shuttleModel();g.position.set(fx,2.2,fz);g.rotation.y=fr;try{shuttleAnim(g,0,0,0,8,1,true,10)}catch(_){}g.updateMatrixWorld(true);
    g.traverse(o=>{if(!o.isMesh||!o.geometry)return;for(let v=o;v;v=v.parent)if(!v.visible)return;const m=o.material;if(Array.isArray(m)||m.transparent||m.blending===T.AdditiveBlending)return;
      let geo=o.geometry.clone();geo.applyMatrix4(o.matrixWorld);if(geo.index)geo=geo.toNonIndexed();if(!geo.attributes.normal)geo.computeVertexNormals();if(!geo.attributes.uv)geo.setAttribute('uv',new T.BufferAttribute(new Float32Array(geo.attributes.position.count*2),2));
      if(!by.has(m))by.set(m,[]);by.get(m).push(geo)})}
  for(const[m,l]of by){const me=new T.Mesh(mergeGeos(l),m);me.receiveShadow=true;scene.add(me)}}catch(err){console.warn('parked shuttles',err)}
requestAnimationFrame(frame);
})();""")
open(p,'w').write(s);print('ok')
