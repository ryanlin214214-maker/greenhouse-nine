import sys
src,dst=sys.argv[1],sys.argv[2]
s=open(src).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]);s=s.replace(a,b)
# jetpack escape hops: 0.6-1.25 m (were 2-3.5 m in v70, 6-12 m before)
rep("if(P.jet){e.vy=3.2;e.jet=.15+e.hops*.05;sfx('jet')}","if(P.jet){e.vy=3;e.jet=.04+e.hops*.025;sfx('jet')}")
# jetpack climbs toward a player above are sized to the height needed: they peak about 0.4 m over the player's eye level, no overshoot into ceilings
rep("e.jcd=7;e.jet=.5+Math.min(.9,dy*.07);","e.jcd=7;e.jet=Math.max(.12,Math.min(1.5,(dy-.7)/7.5));")
open(dst,'w').write(s);print('ok',len(s))
