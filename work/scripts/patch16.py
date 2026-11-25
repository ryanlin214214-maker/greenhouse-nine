p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:80]); s=s.replace(a,b)
rep("const A=520,boxes=[]","const A=640,boxes=[]")
rep("\nflush();\n// ground cover","""
// ---- the ship: armored bulwarks with viewing bays, gun battery, hangar bay, trench, reactor; bow, engines and bridge beyond the walls
{const deco=(geo,mat,sx,sy,sz,x,y,z,rx=0,ry=0,rz=0)=>{const g=geo.clone();g.applyMatrix4(M4.compose(new T.Vector3(x,y,z),new T.Quaternion().setFromEuler(new T.Euler(rx,ry,rz)),new T.Vector3(sx,sy,sz)));addGeo(mat,g)};
 const W=A-1.5,H=12,gaps=[-480,-160,160,480],GW=36;
 for(const sg of[-1,1])for(const ax of[0,1]){let st=-A;const segs=[];for(const g of gaps){segs.push([st,g-GW/2]);st=g+GW/2}segs.push([st,A]);
   for(const[a0,a1]of segs){const L=a1-a0,m=(a0+a1)/2;
     if(ax===0){box(m,0,sg*W,L,H,3,MAT.hull);box(m,H,sg*W,L,.3,3.4,MAT.metal,false);box(m,H-1.2,sg*(W-1.56),L,.15,.1,MAT.strip,false);box(m,4,sg*(W-1.56),L,.5,.1,MAT.win,false)}
     else{box(sg*W,0,m,3,H,L,MAT.hull);box(sg*W,H,m,3.4,.3,L,MAT.metal,false);box(sg*(W-1.56),H-1.2,m,.1,.15,L,MAT.strip,false);box(sg*(W-1.56),4,m,.1,.5,L,MAT.win,false)}}
   for(const g of gaps){const[x,z]=ax===0?[g,sg*W]:[sg*W,g];for(const o of[-1,1]){const[px,pz]=ax===0?[x+o*(GW/2+1),z]:[x,z+o*(GW/2+1)];box(px,0,pz,ax===0?2:4,H+3,ax===0?4:2,MAT.armorD);GLOWS.push([px,H+3.5,pz,0xffb238,4,.8])}}
   for(let t=-A+20;t<A-10;t+=40){if(gaps.some(g=>Math.abs(t-g)<GW/2+4))continue;const[x,z]=ax===0?[t,sg*(W-2.6)]:[sg*(W-2.6),t];box(x,0,z,ax===0?2:2.4,9,ax===0?2.4:2,MAT.hull);
     if(Math.round((t+A)/40)%3===0){const[tx,tz]=ax===0?[t,sg*W]:[sg*W,t],ox=ax===0?0:sg,oz=ax===0?sg:0;deco(GEO.cyl,MAT.armorD,3,2,3,tx,H+1,tz);deco(GEO.box,MAT.armor,4.4,1.8,4.4,tx,H+2.6,tz);
       for(const o of[-.8,.8])deco(GEO.cyl,MAT.gunD,.32,9,.32,tx+ox*5.5+(ax===0?o:0),H+2.8,tz+oz*5.5+(ax===0?0:o),ax===0?1.571:0,0,ax===0?0:1.571)}}}
 // north band: gun battery
 for(const x of[-220,0,220]){box(x,0,-585,22,7,22,MAT.hull);box(x,6.88,-585,22.1,.12,22.1,MAT.amber,false);deco(GEO.cyl,MAT.armorD,8,4,8,x,9,-585);deco(GEO.box,MAT.armor,12,5,14,x,12.5,-588);
   for(const o of[-3,0,3])deco(GEO.cyl,MAT.gunD,.9,46,.9,x+o,12.5,-618,1.571,0,0);for(let i=0;i<4;i++)box(x-10+i*1.2,7,-575,.6,1.2,.6,MAT.metal,false);pad(x+15,0,-570,15);box(x,0,-560,8,1.5,2,MAT.crateA)}
 // south band: hangar bay with parked fighters
 box(0,0,603,200,18,3,MAT.hull);for(const s of[-1,1]){box(s*100,0,573,3,18,60,MAT.hull);box(s*98.4,14,573,.1,.3,60,MAT.strip,false)}box(0,15,601.4,200,.3,.1,MAT.strip,false);
 for(let i=-4;i<=4;i++)box(i*22,0.03,560,14,.05,.4,MAT.mark,false);
 for(const[fx,fz,fr]of[[-55,575,0],[0,580,0],[55,575,0],[-25,548,.4]]){deco(GEO.box,MAT.gun,3,2,12,fx,1.6,fz,0,fr,0);deco(GEO.box,MAT.gun,14,.3,4,fx,1.4,fz+1,0,fr,0);
   deco(GEO.cone,MAT.amber,1.4,3,1.4,fx-Math.sin(fr)*7.5,1.6,fz-Math.cos(fr)*7.5,-1.571,fr,0);deco(GEO.sph,MAT.canopy,1,.7,2,fx-Math.sin(fr)*3,2.6,fz-Math.cos(fr)*3,0,fr,0);
   for(const o of[-1.5,1.5])deco(GEO.cyl,MAT.gunD,.6,2,.6,fx+Math.cos(fr)*o+Math.sin(fr)*6,1.6,fz-Math.sin(fr)*o+Math.cos(fr)*6,1.571,fr,0);
   box(fx,0,fz,3.2,2.6,10);GLOWS.push([fx+Math.sin(fr)*7.2,1.6,fz+Math.cos(fr)*7.2,0x8fe6ff,3,.7])}
 for(let i=0;i<10;i++)box(-80+hash(i,141)*160,0,535+hash(i,142)*20,2+hash(i,143)*2,1+Math.floor(hash(i,144)*2),2,i%2?MAT.crateA:MAT.crateB);
 // east band: the trench, long walls with crossings and overhead beams
 for(const x of[552,582,612])for(let z=-420;z<420;z+=100){box(x,0,z+40,2,7,80,MAT.hull);box(x,7,z+40,2.3,.2,80,MAT.metal,false);box(x-1.06,5.5,z+40,.1,.2,80,MAT.strip,false)}
 for(let z=-400;z<=400;z+=50){box(582,11,z,64,1,1.2,MAT.metal,false);for(const x of[548,616])box(x,0,z,1,11,1,MAT.metal,false)}
 // west band: the reactor, with coolant tanks, conduits and a catwalk ring
 box(-580,0,0,20,26,20,MAT.hull);for(const y of[6,12,18,24])deco(GEO.tor,MAT.strip,15,15,15,-580,y,0,1.571,0,0);GLOWS.push([-580,27,0,0x8fe6ff,40,.6]);
 for(const[x,z]of[[-555,-28],[-605,-28],[-555,28],[-605,28]]){box(x,0,z,7,9,7,MAT.glass);box(x,9,z,7.6,.4,7.6,MAT.metal)}
 for(let i=0;i<8;i++){const a=i/8*6.283;box(-580+Math.cos(a)*40,0.03,Math.sin(a)*40,i%2?50:.6,.05,i%2?.6:50,MAT.strip,false)}
 deco(GEO.tor,MAT.metal,22,22,22,-580,8,0,1.571,0,0);for(let i=0;i<6;i++){const a=i/6*6.283;box(-580+Math.cos(a)*22,0,Math.sin(a)*22,.5,8,.5,MAT.metal,false)}
 // corners: antenna arrays
 for(const sx of[-1,1])for(const sz of[-1,1]){const x=585*sx,z=585*sz;box(x,0,z,10,3,10,MAT.hull);for(let i=0;i<5;i++)deco(GEO.cyl,MAT.metal,.3,18+i*4,.3,x-4+i*2,3+(18+i*4)/2,z+(i%2?2:-2));
   deco(new T.SphereGeometry(1,16,8,0,6.283,0,1.1),MAT.metal,6,3,6,x,26,z,-.8,0,0);GLOWS.push([x,40,z,0xff4a3a,5,.8])}
 // beyond the walls: the side hull dropping away, the bow, the engine block and the bridge tower
 for(const sg of[-1,1]){box(sg*(A+30),-70,0,60,68,2*A+140,MAT.hull,false);box(0,-70,sg*(A+30)*(sg<0?1:0),0,0,0,MAT.hull,false)}
 for(let i=0;i<7;i++){const w=2*A*(1-i*.13),z=A+70+i*120,y=-64-i*4;box(0,y,z,w,60,120,MAT.hull,false);box(0,y+60,z,w*.15,2,120,MAT.metal,false);box(0,y+61.2,z,.6,.2,120,MAT.strip,false)}
 box(0,-60,-(A+90),2*A+40,120,180,MAT.hull,false);box(0,60,-(A+90),2*A,1,170,MAT.metal,false);
 for(let i=0;i<6;i++){const x=-500+i*200;deco(GEO.cyl,MAT.armorD,38,50,38,x,10,-(A+200),1.571,0,0);deco(GEO.tor,MAT.strip,30,30,30,x,10,-(A+226),0,0,0);GLOWS.push([x,10,-(A+232),0x8fe6ff,150,.55])}
 box(A+70,-60,200,70,160,90,MAT.hull,false);for(let i=0;i<14;i++)box(A+34.9,8+i*6,200,.1,1.2,70,MAT.win,false);box(A+70,100,200,30,10,40,MAT.armorD,false);
 deco(GEO.cyl,MAT.metal,.6,50,.6,A+70,130,200);GLOWS.push([A+70,156,200,0xff4a3a,10,.9])}
flush();
// ground cover""")
rep("const SITES=[","const SITES=[{n:'THE HANGAR BAY',x:0,y:0,z:565},{n:'THE REACTOR',x:-580,y:0,z:45},{n:'THE GUN BATTERY',x:-110,y:0,z:-575},{n:'THE TRENCH',x:597,y:0,z:10},")
rep("const CORE_SPOTS=[","const CORE_SPOTS=[[0,7,-585],[-555,9.4,28],[597,0,-160],[70,0,560],[585,3,585],")
rep("You're up. Good. This is Rowan Adeyemi, deck botanist. I'm sealed in the seed vault under the hub.","You're up. Good. This is Rowan Adeyemi, deck botanist on the Long Harvest. I'm sealed in the seed vault under the hub.")
rep("Deck Nine grows food for a whole planet.","Deck Nine is the farm deck of the ark-ship Long Harvest, and it grows food for a whole planet.")
open(p,'w').write(s);print('ok')
