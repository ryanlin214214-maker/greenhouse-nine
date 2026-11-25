p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:90]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]

# ---------- replace the old stair helper with an arrival-defined builder, rails and a build-time check
between("function stairs(x,z,dx,dz,width,top,base=0){","function planter(","""// Stairs are defined by where they ARRIVE: (ax,az) is the centre of the upper floor's edge, (ux,uz) the direction you walk going up.
// Real proportions: ~18 cm risers, 28 cm treads, at most 15 risers per flight, landings as deep as the stair is wide.
// Collision is one thin slab per tread (and per landing), so you can walk, see and shoot underneath.
MAT.stairT=std({color:0x8a9497,roughness:.45,metalness:.6});
const STAIRS=[],STAIRLOG=[];
function beam(mat,ax,ay,az,bx,by,bz,hgt,thick){const X=new T.Vector3(bx-ax,by-ay,bz-az),len=X.length();if(len<.01)return;X.normalize();
  const Y=new T.Vector3(0,1,0).addScaledVector(X,-X.y).normalize(),Z=new T.Vector3().crossVectors(X,Y),m=new T.Matrix4().makeBasis(X,Y,Z);
  m.scale(new T.Vector3(len,hgt,thick));m.setPosition((ax+bx)/2,(ay+by)/2,(az+bz)/2);const g=GEO.box.clone();g.applyMatrix4(m);addGeo(mat,g)}
function railLine(ax,ay,az,bx,by,bz){beam(MAT.metal,ax,ay+1,az,bx,by+1,bz,.07,.07);beam(MAT.armorD,ax,ay+.5,az,bx,by+.5,bz,.04,.04);
  const n=Math.max(1,Math.ceil(Math.hypot(bx-ax,bz-az)/1.4));for(let i=0;i<=n;i++){const t=i/n;box(ax+(bx-ax)*t,ay+(by-ay)*t,az+(bz-az)*t,.06,1,.06,MAT.metal,false)}}
function railEdge(ax,az,bx,bz,y,gaps=[]){const alongX=Math.abs(bx-ax)>=Math.abs(bz-az),a0=alongX?Math.min(ax,bx):Math.min(az,bz),a1=alongX?Math.max(ax,bx):Math.max(az,bz),c=alongX?az:ax;
  const seg=(u,v)=>{if(v-u<.05)return;alongX?railLine(u,y,c,v,y,c):railLine(c,y,u,c,y,v)};let s0=a0;
  for(const[g0,g1]of gaps.slice().sort((p,q)=>p[0]-q[0])){seg(s0,Math.min(g0,a1));s0=Math.max(s0,g1)}seg(s0,a1)}
function stairTo(name,ax,az,ux,uz,width,yTop,yBase=0){
  const G=.28,nR=Math.max(1,Math.ceil((yTop-yBase)/.18-1e-6)),r=(yTop-yBase)/nR,nF=Math.ceil(nR/15),L=Math.max(1.6,width),per=[];
  for(let f=0;f<nF;f++)per.push(Math.floor(nR/nF)+(f<nR%nF?1:0));
  const run=per.reduce((a,k)=>a+(k-1)*G,0)+(nF-1)*L,fx=ax-ux*run,fz=az-uz*run,P=(sv,o)=>[fx+ux*sv-uz*o,fz+uz*sv+ux*o];
  const pieces=[],flights=[];let sv=0,h=yBase;
  for(let f=0;f<nF;f++){const k=per[f],fs=sv,fh=h;for(let i=1;i<k;i++){h+=r;pieces.push({s0:sv,s1:sv+G,h,t:1});sv+=G}h+=r;flights.push({s0:fs,h0:fh,s1:sv,h1:h});
    if(f<nF-1){pieces.push({s0:sv,s1:sv+L,h,t:0});sv+=L}}
  const ST={name,fx,fz,ux,uz,width,yTop,yBase,run,pieces};
  for(const p of pieces){const[cx,cz]=P((p.s0+p.s1)/2,0),len=p.s1-p.s0,w=ux?len:width,d=ux?width:len;
    boxes.push({lo:[cx-w/2,p.h-.3,cz-d/2],hi:[cx+w/2,p.h,cz+d/2],floor:true,stair:name});
    if(p.t){box(cx,p.h-.06,cz,w,.06,d,MAT.stairT,false);const[nx,nz]=P(p.s0+.03,0);box(nx,p.h-.055,nz,ux?.06:width,.06,ux?width:.06,MAT.amber,false);
      const[rx,rz]=P(p.s0,0);box(rx,p.h-r,rz,ux?.04:width*.96,r-.06,ux?width*.96:.04,MAT.armorD,false)}
    else{box(cx,p.h-.3,cz,w,.3,d,MAT.armorD,false);box(cx,p.h-.05,cz,w*.98,.05,d*.98,MAT.stairT,false);
      for(const a of[.15,len-.15])for(const o of[-width/2+.15,width/2-.15]){const[qx,qz]=P(p.s0+a,o);boxes.push({lo:[qx-.1,yBase,qz-.1],hi:[qx+.1,p.h-.3,qz+.1],stair:name});box(qx,yBase,qz,.2,p.h-.3-yBase,.2,MAT.armorD,false)}
      for(const o of[-width/2-.05,width/2+.05]){const[a0,b0]=P(p.s0,o),[a1,b1]=P(p.s1,o);railLine(a0,p.h,b0,a1,p.h,b1)}}}
  for(const F of flights)for(const o of[-width/2-.06,width/2+.06]){const[a0,b0]=P(F.s0,o),[a1,b1]=P(F.s1,o);beam(MAT.armorD,a0,F.h0-.22,b0,a1,F.h1-.22,b1,.42,.1);
    const[c0,d0]=P(F.s0,o+(o<0?-.02:.02)),[c1,d1]=P(F.s1,o+(o<0?-.02:.02));railLine(c0,F.h0+r,d0,c1,F.h1,d1)}
  STAIRS.push(ST);return ST}
function solidAt(x,y,z,skip){for(const b of cell(Math.floor(x/GC),Math.floor(z/GC)))if(b.stair!==skip&&x>b.lo[0]&&x<b.hi[0]&&y>b.lo[1]&&y<b.hi[1]&&z>b.lo[2]&&z<b.hi[2])return true;return false}
function verifyStairs(){for(const S of STAIRS){const P=(sv,o)=>[S.fx+S.ux*sv-S.uz*o,S.fz+S.uz*sv+S.ux*o],os=[-S.width*.4,0,S.width*.4],bad=[];
    for(const p of S.pieces)for(const o of os){const[x,z]=P((p.s0+p.s1)/2,o);for(let y=p.h+.15;y<=p.h+2.1;y+=.3)if(solidAt(x,y,z,S.name)){bad.push('no headroom over the '+(p.t?'step':'landing')+' at '+p.h.toFixed(1)+' m');break}}
    for(let sv=-2;sv<0;sv+=.5)for(const o of os){const[x,z]=P(sv,o);for(let y=S.yBase+.2;y<=S.yBase+2;y+=.3)if(solidAt(x,y,z,S.name)){bad.push('foot blocked');break}}
    for(let sv=S.run+.3;sv<=S.run+2;sv+=.5)for(const o of os){const[x,z]=P(sv,o);if(!solidAt(x,S.yTop-.1,z,S.name))bad.push('no floor at the top');for(let y=S.yTop+.2;y<=S.yTop+2;y+=.3)if(solidAt(x,y,z,S.name)){bad.push('top blocked');break}}
    S.bad=[...new Set(bad)];if(S.bad.length){STAIRLOG.push(S.name+': '+S.bad.join(', '));console.warn('stair problem',S.name,S.bad.join(', '))}}}
""")
# ---------- commons: two stairs per gallery, parallel to its edge, arriving on a landing bridged to the gallery
rep("for(let x=-100;x<=100;x+=4)box(x,7.5,sz*29.1,.1,1.1,.1,MAT.metal,false);box(0,8.6,sz*29.1,214,.1,.1,MAT.metal,false);",
    "railEdge(-107,sz*29.1,107,sz*29.1,7.5,[[-77,-74],[74,77]]);")
rep("     for(const sx of[-1,1])stairs(sx*30,sz*22,0,sz,5,7.5)}",
"""     for(const sx of[-1,1]){floorBox(sx*75.5,7,sz*27.3,3,.5,3.4);railEdge(sx*74,sz*25.6,sx*77,sz*25.6,7.5);railEdge(sx*77,sz*25.6,sx*77,sz*29,7.5);
       for(const zz of[25.85,28.75])box(sx*76.75,0,sz*zz,.2,7,.2,MAT.armorD);
       stairTo('commons '+(sz>0?'south':'north')+' gallery, '+(sx>0?'east':'west'),sx*74,sz*27.3,sx,0,2.8,7.5,0)}}""")
# ---------- port farm: the catwalk starts where its stair arrives; a second stair reaches the balcony
between("   floorBox((r.x0+r.x1)/2,8,(r.z0+r.z1)/2,r.x1-r.x0,.4,4);stairs(r.x0+4,","   for(const z of[r.z0+6,r.z1-6]){box(r.x0+5,0,z,6,10,6,MAT.glass);","""   {const zc=(r.z0+r.z1)/2;floorBox(-52.5,8,zc,63,.4,4);floorBox(r.x1-5,8,zc,10,.4,12);box(r.x1-2,8.4,zc,1.4,1.1,3,MAT.armorD);box(r.x1-2.75,9.5,zc,.05,.7,2.6,TRIM.g,false);
    railEdge(-84,zc-2,-21,zc-2,8.4);railEdge(-84,zc+2,-21,zc+2,8.4);railEdge(-21,zc-6,-11,zc-6,8.4,[[-17.4,-14.6]]);railEdge(-21,zc+6,-11,zc+6,8.4);railEdge(-21,zc-6,-21,zc-2,8.4);railEdge(-21,zc+2,-21,zc+6,8.4);
    for(let x=-80;x<-21;x+=15)for(const o of[-1.8,1.8])box(x,0,zc+o,.25,8,.25,MAT.armorD);
    stairTo('port farm catwalk',-84,zc,1,0,2.8,8.4,0);stairTo('port farm balcony',-16,zc-6,0,1,2.8,8.4,0)}
""")
# ---------- starboard farm: the walkway ends in its own stair by the door; a second stair reaches the far balcony
rep("for(let x=r.x0+12;x<r.x1-6;x+=14)for(let z=r.z0+12;z<r.z1-6;z+=16){if(Math.abs(z-(r.z0+r.z1)/2)<8&&x<r.x0+50)continue;",
    "for(let x=r.x0+12;x<r.x1-6;x+=14)for(let z=r.z0+12;z<r.z1-6;z+=16){if(Math.abs(z-(r.z0+r.z1)/2)<8&&x<r.x0+50)continue;if(z<-140&&x>45&&x<70)continue;")
between("   floorBox((r.x0+r.x1)/2,8,(r.z0+r.z1)/2,4,.4,r.z1-r.z0);stairs((r.x0+r.x1)/2,r.z1-4,0,-1,3.5,8.4);"," // HABITAT: a grid of crew cabins","""   {const xc=(r.x0+r.x1)/2;floorBox(xc,8,-106,4,.4,84);floorBox(xc,8,r.z0+6,14,.4,10);box(xc,8.4,r.z0+2,4,1.1,1.2,MAT.armorD);box(xc,9.5,r.z0+2.65,3.4,.7,.05,TRIM.g,false);
    railEdge(xc-2,-148,xc-2,-64,8.4);railEdge(xc+2,-148,xc+2,-64,8.4);railEdge(xc-7,-148,xc-2,-148,8.4);railEdge(xc+2,-148,xc+7,-148,8.4);railEdge(xc-7,-158,xc-7,-148,8.4);railEdge(xc+7,-158,xc+7,-148,8.4,[[-154.4,-151.6]]);
    for(let z=-140;z<-64;z+=16)for(const o of[-1.8,1.8])box(xc+o,0,z,.25,8,.25,MAT.armorD);
    stairTo('starboard farm walkway',xc,-64,0,-1,2.8,8.4,0);stairTo('starboard farm balcony',xc+7,-153,-1,0,2.8,8.4,0)}}
""")
# ---------- engineering: railed catwalk ring around the reactor with a straight stair up to its north and south sides
rep("floorBox(cx-18,9,cz,4,.4,32);floorBox(cx+18,9,cz,4,.4,32);stairs(cx-18,cz-24,0,1,3.5,9.4);",
"""floorBox(cx-18,9,cz,4,.4,32);floorBox(cx+18,9,cz,4,.4,32);
   railEdge(cx-20,cz-16,cx+20,cz-16,9.4,[[cx-1.4,cx+1.4]]);railEdge(cx-20,cz+16,cx+20,cz+16,9.4,[[cx-1.4,cx+1.4]]);railEdge(cx-20,cz-16,cx-20,cz+16,9.4);railEdge(cx+20,cz-16,cx+20,cz+16,9.4);
   railEdge(cx-16,cz-12,cx+16,cz-12,9.4);railEdge(cx-16,cz+12,cx+16,cz+12,9.4);railEdge(cx-16,cz-12,cx-16,cz+12,9.4);railEdge(cx+16,cz-12,cx+16,cz+12,9.4);
   for(const sx of[-1,1])for(const sz of[-1,1])box(cx+sx*18,0,cz+sz*14,.3,9,.3,MAT.armorD);
   stairTo('engineering ring, north',cx,cz-16,0,1,2.8,9.4,0);stairTo('engineering ring, south',cx,cz+16,0,-1,2.8,9.4,0);""")
rep("    for(let i=0;i<8;i++){const a=i/8*6.283;box(cx+Math.cos(a)*25,0,cz+Math.sin(a)*25,2.2,1.2,1,MAT.armorD);",
    "    for(let i=0;i<8;i++){if(i%4===2)continue;const a=i/8*6.283;box(cx+Math.cos(a)*25,0,cz+Math.sin(a)*25,2.2,1.2,1,MAT.armorD);")
# ---------- hangar: the booth gets a front wall with a doorway, and the stair arrives straight into it
rep("floorBox(r.x0+10,8,170,18,.5,30);stairs(r.x0+21,186,0,-1,4,8.5);","floorBox(r.x0+10,8,170,18,.5,30);")
rep("box(bx+8.9,8.5,165,.2,3.6,19,MAT.pane);box(bx+8.9,8.5,181.5,.2,3.6,6,MAT.pane);",
    "box(bx+8.9,8.5,170,.2,3.6,30,MAT.pane);box(bx-6.25,8.5,184.8,5.5,3.6,.2,MAT.pane);box(bx+4.25,8.5,184.8,9.5,3.6,.2,MAT.pane);box(bx-1.5,11.6,184.8,3.2,.5,.3,TRIM.r,false);")
rep("    box(bx,12,170,16,.1,.6,MAT.strip,false);GLOWS.push([bx,11,170,0xffc0b0,8,.2])}",
    "    box(bx,12,170,16,.1,.6,MAT.strip,false);GLOWS.push([bx,11,170,0xffc0b0,8,.2]);stairTo('hangar control booth',bx-2,185,0,-1,2.8,8.5,0)}")
# ---------- bridge: steps up each tier at the centre, railed edges, and a stair down from the command dais into the crew pit
rep("{const r=R['BRIDGE'];for(let i=0;i<3;i++){floorBox(0,0,r.z1-10-i*8,96-i*16,1.2*(i+1),8);stairs(0,r.z1-14-i*8-2.5,0,-1,6,1.2*(i+1),1.2*i)}",
"""{const r=R['BRIDGE'];for(let i=0;i<3;i++)floorBox(0,0,r.z1-10-i*8,96-i*16,1.2*(i+1),8);
   for(let i=0;i<3;i++){const hw=48-i*8,z0=r.z1-14-i*8,z1=r.z1-6-i*8,y=1.2*(i+1);railEdge(-hw,z0,-hw,z1,y);railEdge(hw,z0,hw,z1,y);railEdge(-hw,z1,hw,z1,y,[[-2.2,2.2]]);
     stairTo('bridge, up to tier '+(i+1),0,z1,0,-1,4,y,1.2*i)}
   railEdge(-32,r.z1-30,32,r.z1-30,3.6,[[-2.2,2.2]]);stairTo('bridge, crew pit',0,r.z1-30,0,1,4,3.6,0);""")
# ---------- run the check once the whole interior exists
rep("flush();\nscene.traverse(o=>{if(o.isMesh&&o.material&&o.material.isMeshStandardMaterial&&o.material!==MAT.water)o.material.envMapIntensity=.28});",
    "verifyStairs();\nflush();\nscene.traverse(o=>{if(o.isMesh&&o.material&&o.material.isMeshStandardMaterial&&o.material!==MAT.water)o.material.envMapIntensity=.28});")
# ---------- navigation and spawns see thin slabs at any height
rep("NAV[j*NX+i]=(!inBox(x,.4,z)&&!inBox(x,1.4,z)&&!inBox(x,2.4,z))?1:0}}","let ok=1;for(let y=.25;y<=2.5;y+=.25)if(inBox(x,y,z)){ok=0;break}NAV[j*NX+i]=ok}}")
rep("if(inBox(x,.5,z)||inBox(x,1.8,z)||inBox(x,3,z)||!reach[navCell(x,z)])continue;","let bl=false;for(let y=.25;y<=3;y+=.25)if(inBox(x,y,z)){bl=true;break}if(bl||!reach[navCell(x,z)])continue;")
open(p,'w').write(s);print('ok',s.count('stairs('),s.count('stairTo('))
