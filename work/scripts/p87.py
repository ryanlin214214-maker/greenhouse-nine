import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)
# space clean-up (owner: "space looks messy", "what is that blob"): the derelict and its speckle of orange lights,
# the three glowing saucer decks, the ring station's light dots go; the asteroid belt is thinner
rep("FAR.add(dg);FARX.dg=dg;", "FARX.dg=dg;")
rep("d.position.set(x,y,z);FAR.add(d)}", "d.position.set(x,y,z)}")
rep("inner.add(new T.Points(lg,new T.PointsMaterial({color:0xffd9a0,size:2.6,sizeAttenuation:false,fog:false})));", "")
rep("{const N=lowFx?250:700,rock=", "{const N=lowFx?110:280,rock=")
open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))
