import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)
# space combat: enemy bolts carry a red halo, so incoming fire reads apart from your own warm tracers and from the backdrop
rep("function flyShot(p,dir,speed,mat,len,w,dmg,mine){const g=mesh(GEO.box,mat,w,w,len,p.x,p.y,p.z);g.lookAt(p.x+dir.x,p.y+dir.y,p.z+dir.z);",
    "function flyShot(p,dir,speed,mat,len,w,dmg,mine){const g=mesh(GEO.box,mat,w,w,len,p.x,p.y,p.z);g.lookAt(p.x+dir.x,p.y+dir.y,p.z+dir.z);if(!mine){const h=glow(0xff3a2a,1,.55);h.scale.set(3/w,3/w,1);g.add(h)}")
open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))
