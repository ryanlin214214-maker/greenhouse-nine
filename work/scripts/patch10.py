p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]); s=s.replace(a,b)
rep("a(GEO.box,MAT.sleeve,.16,.16,.22,.06,-.33,.3,.5,0,0);","a(GEO.box,MAT.sleeve,.13,.12,.14,.04,-.31,.31,.5,0,0);")
rep("a(GEO.box,MAT.sleeve,.15,.15,.6,-.28,-.34,fgz+.32,.3,.75,0)}","a(GEO.box,MAT.sleeve,.12,.11,.16,-.06,-.21,fgz+.12,.2,.4,0)}")
open(p,'w').write(s);print('ok')
