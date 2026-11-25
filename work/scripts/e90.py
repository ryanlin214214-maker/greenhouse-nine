s=open('hub82.js').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:80]);s=s.replace(a,b)
# hangar: the fuel truck parks by the side wall, not in the walkway; its hose follows
rep("for(const[x,z,ry]of[[0,1130,0]])","for(const[x,z,ry]of[[-60,1150,0]])")
rep("[0,1124,-14,1112]","[-60,1144,-72,1138]")
# no tall white bars: wall light columns, the back-wall strips and the long header line use the dim light colour
s=s.replace("A(lw,.15,40,.5,s*78.2,30,z)","A(lwD,.15,40,.5,s*78.2,30,z)").replace("A(lw,.25,10,.1,x+4,14,1082.65)","A(lwD,.25,10,.1,x+4,14,1082.65)").replace("A(lw,150,.15,.1,0,26.2,1082.65)","A(lwD,150,.15,.1,0,26.2,1082.65)")
# cannon: half as many coil rings, so it reads as one machine
rep("for(let z=998;z<1030;z+=3.2)","for(let z=999;z<1030;z+=6.4)")
# glowing pedestal rings: dim
for a in ["a(GEO.tor,cy,1.25,1.25,.4,p,.37+yo,q,1.571,0,0)","a(GEO.tor,cy,3.5,3.5,.5,26,.82,1046,1.571,0,0)","a(GEO.tor,cy,1.05,1.05,.4,x,.32,z,1.571,0,0)","a(GEO.tor,cy,.7,.7,.4,30+k*5,1.24,1014,1.571,0,0)"]:
    rep(a,a.replace("GEO.tor,cy,","GEO.tor,cyD,"))
# gun wall: three rows at eye level (was six up to 14 m), the guns at full size; the upper wall gets trim and a sign
rep("for(let c=0;c<16;c++)for(let r=0;r<6;r++){A(dk,2.55","for(let c=0;c<16;c++)for(let r=0;r<3;r++){A(dk,2.55")
rep("for(let c=0;c<16;c++)for(let r=0;r<6;r++){const k=(c+r*3)%VMG.length,w=new T.Group();w.add(gunClone(k));w.scale.setScalar(k===5?.62:k===3?.95:.72);",
    "for(let c=0;c<16;c++)for(let r=0;r<3;r++){const k=(c+r*3)%VMG.length,w=new T.Group();w.add(gunClone(k));w.scale.setScalar(k===5?.8:k===3?1.15:.95);")
rep("for(let r=0;r<=6;r++)A(gm,45.2,.18,.5,-38,1.4+r*2.15,1071.95);","for(let r=0;r<=3;r++)A(gm,45.2,.18,.5,-38,1.4+r*2.15,1071.95);for(const y of[9.2,13.8])A(gd,45.6,.16,.3,-38,y,1071.9);")
rep("for(let c=0;c<=16;c++)A(gm,.18,13.6,.5,-60.6+c*2.8,8,1071.95);","for(let c=0;c<=16;c++)A(gm,.18,6.6,.5,-60.6+c*2.8,4.6,1071.95);")
open('hub82.js','w').write(s);print('ok')
