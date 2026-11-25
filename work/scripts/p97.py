import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)
# Thalassa named fixes (v90)
# bridge: the "command chair" was a 2 m dark block with a slab back at the top of the centre stair (the reviewer's "black
# monolith"); now a real chair (pedestal, seat, high back, armrests) at the back of the tier, clear of the stair top
rep("box(0,3.6,r.z1-26,2,1.2,2,MAT.armorD);box(0,4.8,r.z1-25.2,2,1.6,.4,MAT.armorD)}",
    "box(0,3.9,r.z1-29,.6,.6,.6,MAT.metal);box(0,4.3,r.z1-29,1.15,.22,1.05,MAT.armorD);box(0,5.05,r.z1-29.5,1.15,1.35,.18,MAT.armorD);box(0,5.85,r.z1-29.5,.6,.35,.2,MAT.metal,false);for(const sx of[-1,1])box(sx*.62,4.6,r.z1-29,.14,.12,.95,MAT.metal,false)}")
# hangar: the atmosphere field across the mouth washed space into flat pastel slabs; now a faint shimmer
rep("{const ff=new T.Mesh(new T.PlaneGeometry(80,22),bas({color:0x6fd8ff,transparent:true,opacity:.12,", "{const ff=new T.Mesh(new T.PlaneGeometry(80,22),bas({color:0x6fd8ff,transparent:true,opacity:.035,")
open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))
