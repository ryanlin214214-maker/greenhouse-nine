import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)
# fixes from the v85 tester review
# commons: the water was a near-perfect mirror (metal 1, roughness .04) and striped the atrium black and white; calmer now.
rep("MAT.water=std({color:0x0d3a44,roughness:0.04,metalness:1,normalMap:rip,normalScale:new T.Vector2(0.4,0.4)});",
    "MAT.water=std({color:0x1d5560,roughness:0.3,metalness:0.5,normalMap:rip,normalScale:new T.Vector2(0.22,0.22)});")
# the room floor sat exactly level with a hull face and flickered against it
rep("{const po=(m,f)=>{m.polygonOffset=true;m.polygonOffsetFactor=f;m.polygonOffsetUnits=f;m.userData.noShadow=true;return m};po(MAT.water,-2);",
    "{const po=(m,f)=>{m.polygonOffset=true;m.polygonOffsetFactor=f;m.polygonOffsetUnits=f;m.userData.noShadow=true;return m};po(MAT.water,-2);MAT.floor.polygonOffset=true;MAT.floor.polygonOffsetFactor=MAT.floor.polygonOffsetUnits=-1;")
# engineering: the generator flywheel caps were flat black discs; orange warning rings and a hub on each end
rep("deco(GEO.cyl,MAT.gun,1.3,3.6,1.3,x,4.8,z+1.2,0,0,1.571);",
    "deco(GEO.cyl,MAT.gun,1.3,3.6,1.3,x,4.8,z+1.2,0,0,1.571);for(const e of[-1,1]){deco(GEO.tor,MAT.barO,1.05,1.05,1.6,x+e*1.84,4.8,z+1.2,0,1.571,0);deco(GEO.cyl,MAT.metal,.45,.16,.45,x+e*1.86,4.8,z+1.2,0,0,1.571)}")
# softer shadow edges (the habitat walls showed stair-stepped shadow edges)
rep("sun.shadow.radius=2", "sun.shadow.radius=5")
# HUD: the score has a label (it read as "STAGE 1 0 0 CR"); the dark plate hugs the stats
rep(".hud .pw{", "#score::before{content:'SCORE ';color:var(--dim);font-size:10px;letter-spacing:.12em}#hud{width:max-content}\n.hud .pw{")
# glare in the sky: smaller sun halo and Blade glow
rep("for(const[c,sz,o]of[[0xfff2d0,340,1],[0xffd9a0,2000,0.35]])", "for(const[c,sz,o]of[[0xfff2d0,260,1],[0xffd9a0,1500,0.2]])")
rep("for(const[y,sz,o]of[[1500,900,.5],[700,2600,.22],[-90,1100,.3]])", "for(const[y,sz,o]of[[1500,900,.42],[700,2600,.12],[-90,1100,.22]])")
# Meridian: you arrive facing the ships for sale and Hangar 0's mouth, not a dark wall
rep("pos.set(HC.x-30,0,HC.z+12);vy=0;yaw=-.72;", "pos.set(HC.x-30,0,HC.z+12);vy=0;yaw=2.75;")
open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))
