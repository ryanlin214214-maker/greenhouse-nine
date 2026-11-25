import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)
# Meridian's other hangars, now that you can walk in: no glowing white floor strips (dim gold), and the H1..H6 numbers only
# show their right way round (from outside), so they do not read mirrored from inside
rep("for(let k=-3;k<=3;k++)RB(Wn,1.6,.3,108,t,RIM-60,.5,k*20,.05);", "for(let k=-3;k<=3;k++)RB(Gd,1.6,.3,108,t,RIM-60,.5,k*20,.05);")
rep("const pl=new T.Mesh(new T.PlaneGeometry(30,30),num('H'+(k+1),'#d9a441'));", "const pl=new T.Mesh(new T.PlaneGeometry(30,30),num('H'+(k+1),'#d9a441'));pl.material.side=T.FrontSide;")
# landing platforms: the 2.4 m gold posts every 8 m along each edge read as two lines of glowing dots; a real railing instead
rep("for(const o of[-35.4,35.4]){RB(Gd,1,.6,pl[0],t,pl[1],2.6,o,.15);for(let r=RIM+12;r<RIM+358;r+=8)RB(Gd,.35,2.4,.35,t,r,1.2,o,.05)}",
    "for(const o of[-35.4,35.4]){RB(Dk,.6,.3,pl[0],t,pl[1],.15,o,.1);RB(Gd,.12,.12,pl[0]-4,t,pl[1],1.15,o,.02);for(let r=RIM+12;r<RIM+358;r+=4)RB(Dk,.1,1.1,.1,t,r,.6,o,.02)}")
# H1-H6 (v87): a real door through the back wall and the gantry behind it (both were solid behind a painted panel); the floor
# and its strips sit where you stand (they were 0.45-0.65 m up); the cargo block that stood in front of the door is gone;
# the interior glow is a soft wash, not a white globe
rep("for(const t of HANG){RB(W,170,64,8,t,RIM-122,32,0,1);", "for(const t of HANG){RB(W,79,64,8,t,RIM-122,32,-45.5,1);RB(W,79,64,8,t,RIM-122,32,45.5,1);RB(W,12,54.5,8,t,RIM-122,36.75,0,1);")
rep("RB(Dk,160,.4,116,t,RIM-60,.25,0,.1);", "RB(Dk,160,.1,116,t,RIM-60,0,0,.02);")
rep("for(let k=-3;k<=3;k++)RB(Gd,1.6,.3,108,t,RIM-60,.5,k*20,.05);", "for(let k=-3;k<=3;k++)RB(Gd,1.6,.04,108,t,RIM-60,.07,k*20,.01);")
rep("RB(Dk,150,22,4,t,RIM-116,11,0,.4);for(let k=0;k<5;k++)RB(M.trim,10,6,14,t,RIM-100,3,-60+k*30,.3);",
    "RB(Dk,69,22,4,t,RIM-116,11,-40.5,.4);RB(Dk,69,22,4,t,RIM-116,11,40.5,.4);RB(Dk,12,12.5,4,t,RIM-116,15.75,0,.4);for(const la of[-60,-30,30,60])RB(M.trim,10,6,14,t,RIM-100,3,la,.3);")
rep("const q=glow(0xffd27a,90,.25);q.position.copy(P(t,RIM-60,30));G.add(q)", "const q=glow(0xffd27a,60,.1);q.position.copy(P(t,RIM-60,30));G.add(q)")
# every hangar has a ship parked on its pad (H5 and H6 were empty)
rep("for(const t of HANG.slice(0,4))spots.push(", "for(const t of HANG)spots.push(")
open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))
