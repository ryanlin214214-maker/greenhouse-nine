p='/home/user/greenhouse-nine/index.html'
s=open(p).read()
def rep(a,b,c=1):
  global s
  assert s.count(a)==c,(s.count(a),a[:100]); s=s.replace(a,b)
i=s.index("function sparkle(");j=s.index("\n",s.index("k.t=k.l=0.45+Math.random()*0.35}}",i))
PFX=r"""
// ---- smoke and fire: two particle pools drawn as soft, rotating billboards with noise textures.
// Flames are additive and run white-hot to orange to red; smoke is alpha-blended, swells, rises, and is sorted back to front.
const PFX=(()=>{const NF=lowFx?120:380,NS=lowFx?160:560;
  const nz=(x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),a=hash(xi,yi),b=hash(xi+1,yi),c=hash(xi,yi+1),d=hash(xi+1,yi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};
  const tex=(hot)=>{const S=128,c=document.createElement('canvas');c.width=c.height=S;const g=c.getContext('2d'),im=g.createImageData(S,S);
    for(let y=0;y<S;y++)for(let x=0;x<S;x++){const dx=(x-S/2)/(S/2),dy=(y-S/2)/(S/2),r=Math.hypot(dx,dy);let n=0,a=.5,f=4;for(let o=0;o<4;o++){n+=a*nz(x*f/S+o*13.1+(hot?50:0),y*f/S+o*7.7);a*=.5;f*=2}
      const edge=Math.max(0,1-r*(1.05+.5*(n-.45)));let al=hot?Math.pow(edge,1.6)*(.55+.6*n):Math.pow(edge,1.3)*(.35+.9*n);al=Math.max(0,Math.min(1,al));const sh=hot?1:(.72+.4*n-.25*Math.max(0,dy));
      const k=(y*S+x)*4;im.data[k]=im.data[k+1]=im.data[k+2]=Math.max(0,Math.min(255,255*sh));im.data[k+3]=255*al}
    g.putImageData(im,0,0);const t=new T.CanvasTexture(c);return t};
  const VS='attribute float aSize;attribute vec4 aCol;attribute float aRot;varying vec4 vCol;varying float vRot;uniform float uScale;void main(){vCol=aCol;vRot=aRot;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=min(900.,aSize*uScale/max(.1,-mv.z));gl_Position=projectionMatrix*mv;}';
  const FS='uniform sampler2D map;varying vec4 vCol;varying float vRot;void main(){vec2 p=gl_PointCoord-.5;float c=cos(vRot),s=sin(vRot);p=vec2(c*p.x-s*p.y,s*p.x+c*p.y)+.5;vec4 t=texture2D(map,p);gl_FragColor=vec4(vCol.rgb*t.rgb,vCol.a*t.a);}';
  const U={uScale:{value:600}};
  const pool=(n,hot)=>{const g=new T.BufferGeometry(),P=new Float32Array(n*3),Z=new Float32Array(n),C=new Float32Array(n*4),R=new Float32Array(n);
    g.setAttribute('position',new T.BufferAttribute(P,3));g.setAttribute('aSize',new T.BufferAttribute(Z,1));g.setAttribute('aCol',new T.BufferAttribute(C,4));g.setAttribute('aRot',new T.BufferAttribute(R,1));g.setDrawRange(0,0);
    const m=new T.ShaderMaterial({uniforms:{uScale:U.uScale,map:{value:tex(hot)}},vertexShader:VS,fragmentShader:FS,transparent:true,depthWrite:false,blending:hot?T.AdditiveBlending:T.NormalBlending});
    const o=new T.Points(g,m);o.frustumCulled=false;o.renderOrder=hot?6:5;scene.add(o);
    return{g,P,Z,C,R,n,hot,list:[],free:[]}};
  const F=pool(NF,true),Sm=pool(NS,false);const EM=[];const _v=new T.Vector3(),_w=new T.Vector3();
  function add(L,p,o){if(L.list.length>=L.n)L.list.shift();const a=Math.random()*6.283,sp=o.spd||0,v=new T.Vector3(Math.cos(a),(Math.random()-.5)*(o.flat?.4:1.6),Math.sin(a)).normalize().multiplyScalar(sp*(.3+Math.random()*.7));
    if(o.vel)v.add(o.vel);const sp2=o.spread||0;L.list.push({x:p.x+(Math.random()-.5)*sp2,y:p.y+(Math.random()-.5)*sp2*.6,z:p.z+(Math.random()-.5)*sp2,vx:v.x,vy:v.y,vz:v.z,age:0,life:o.life*(.7+Math.random()*.6),
      s0:o.size[0]*(.8+Math.random()*.4),s1:o.size[1]*(.8+Math.random()*.4),rot:Math.random()*6.283,rv:(Math.random()-.5)*(o.spin||1),up:o.up||0,drag:o.drag||1.2,c0:o.c0||.16,c1:o.c1||.42,a:o.alpha||.85,tint:o.tint||null})}
  const api={
    fire(p,o){o=Object.assign({n:6,spd:1,size:[1,2.5],life:.7,up:2.5,drag:1.5},o);for(let i=0;i<o.n;i++)add(F,p,o)},
    smoke(p,o){o=Object.assign({n:4,spd:.6,size:[1.5,5],life:3,up:1.2,drag:1},o);for(let i=0;i<o.n;i++)add(Sm,p,o)},
    // a fireball: a hot core, flames thrown outward, then a rolling column of smoke. k scales it (1 is a grenade); space=true has no rising smoke
    boom(p,k,space){k=k||1;api.fire(p,{n:Math.round(10+6*k),spd:7*k,size:[1.4*k,4.5*k],life:.55,up:space?0:3,drag:3,spread:.6*k});api.fire(p,{n:4,spd:1,size:[3*k,6*k],life:.35,up:0,drag:2});
      api.smoke(p,{n:Math.round(7+4*k),spd:3.2*k,size:[2*k,8*k],life:space?4.5:3.6,up:space?0:1.6,drag:1.6,spread:k,c0:.09,c1:.32,alpha:.8});
      fxq.push({t:.25,fn:()=>api.smoke(p,{n:Math.round(4+3*k),spd:1.2*k,size:[3*k,10*k],life:space?5:4.5,up:space?0:2.2,drag:1,spread:1.5*k,c0:.14,c1:.42,alpha:.6})})},
    // continuous source: get(out) gives the position each frame; fire and/or smoke at a rate per second for dur seconds (Infinity while alive() is true)
    emit(get,o){const e=Object.assign({rate:8,dur:3,acc:0,fire:true,smoke:true,fs:[.8,2],ss:[1.5,5],alive:null,kill:false},o);EM.push(e);return e},
    tick(dt){U.uScale.value=renderer.domElement.height/(2*Math.tan(cam.fov*Math.PI/360));
      for(let i=EM.length-1;i>=0;i--){const e=EM[i];e.dur-=dt;if(e.kill||e.dur<=0||(e.alive&&!e.alive())){EM.splice(i,1);continue}if(!e.get(_w))continue;if(cam.position.distanceTo(_w)>(e.far||400))continue;
        e.acc+=e.rate*dt;while(e.acc>=1){e.acc--;if(e.fire)api.fire(_w,{n:1,spd:e.fspd||.6,size:e.fs,life:e.flife||.6,up:e.fup||3,spread:e.spread||.3});if(e.smoke&&Math.random()<(e.sp||.6))api.smoke(_w,{n:1,spd:.3,size:e.ss,life:e.slife||3.2,up:e.sup||1.6,spread:e.spread||.3,c0:e.c0||.12,c1:e.c1||.38,alpha:e.alpha||.7,vel:e.vel})}}
      const cp=cam.position;
      for(const L of[F,Sm]){const A=L.list;for(let i=A.length-1;i>=0;i--){const q=A[i];q.age+=dt;if(q.age>=q.life){A.splice(i,1);continue}const dr=Math.exp(-q.drag*dt);q.vx*=dr;q.vz*=dr;q.vy=q.vy*dr+q.up*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.z+=q.vz*dt;q.rot+=q.rv*dt}
        if(!L.hot)A.sort((a,b)=>((b.x-cp.x)**2+(b.y-cp.y)**2+(b.z-cp.z)**2)-((a.x-cp.x)**2+(a.y-cp.y)**2+(a.z-cp.z)**2));
        for(let i=0;i<A.length;i++){const q=A[i],t=q.age/q.life;L.P[i*3]=q.x;L.P[i*3+1]=q.y;L.P[i*3+2]=q.z;L.Z[i]=q.s0+(q.s1-q.s0)*Math.sqrt(t);L.R[i]=q.rot;let r,g,b,a;
          if(L.hot){if(t<.18){const u=t/.18;r=1.5;g=1.35-.45*u;b=1-.7*u}else if(t<.55){const u=(t-.18)/.37;r=1.5-.4*u;g=.9-.55*u;b=.3-.2*u}else{const u=(t-.55)/.45;r=1.1-.6*u;g=.35-.25*u;b=.1}a=Math.min(1,t/.06)*Math.pow(1-t,1.1)}
          else{const c=q.c0+(q.c1-q.c0)*t;r=c;g=c*.97;b=c*.94;a=q.a*Math.min(1,t/.1)*Math.pow(1-t,1.5)}
          L.C[i*4]=r;L.C[i*4+1]=g;L.C[i*4+2]=b;L.C[i*4+3]=a}
        L.g.setDrawRange(0,A.length);for(const k of['position','aSize','aCol','aRot'])L.g.attributes[k].needsUpdate=true}},
    clear(){F.list.length=0;Sm.list.length=0;EM.length=0},count:()=>F.list.length+Sm.list.length};
  return api})();"""
s=s[:j]+PFX+s[j:]
# tick
rep("  for(const k of sparks)if(k.t>0){","  PFX.tick(dt);\n  for(const k of sparks)if(k.t>0){")
# hooks: ground explosions and grenade blasts
rep("blasts.push({g,m,t:0});sparkle(p,burst?0xffffff:0xffb238,16,9);if(!burst)sfx('boom');","blasts.push({g,m,t:0});sparkle(p,burst?0xffffff:0xffb238,16,9);if(!burst){sfx('boom');PFX.boom(p,1)}")
rep("  blasts.push({g,m,t:0,r});sparkle(p,col,14,9);if(!quiet)sfx('boom');","  blasts.push({g,m,t:0,r});sparkle(p,col,14,9);if(!quiet)sfx('boom');if(col===0xffb238||col===0xff7a2a)PFX.boom(p,Math.max(.6,r/4.5));")
# space explosions
rep("const g2=glow(0xffa040,s*26,.9);g2.position.copy(p);scene.add(g2);","const g2=glow(0xffa040,s*26,.9);g2.position.copy(p);scene.add(g2);PFX.boom(p,s*2.6,true);")
open(p,'w').write(s);print('ok')
