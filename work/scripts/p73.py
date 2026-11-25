import sys
src,dst=sys.argv[1],sys.argv[2]
s=open(src).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]);s=s.replace(a,b)
# the left gantry tower at z 200 stood on the hangar control-booth stairs (x -100..-98, z 185..206)
rep("for(const z of sx<0?[200,226,250]:[172,200,226,250])","for(const z of sx<0?[226,250]:[172,200,226,250])")
# stuck hops: about 7 m before, now under 2 m; jetpack climbs to upper floors are kept but lower
rep("if(P.jet){e.vy=4;e.jet=.45+e.hops*.25;sfx('jet')}else e.vy=7+e.hops*2.4;","if(P.jet){e.vy=3.2;e.jet=.15+e.hops*.05;sfx('jet')}else e.vy=5+e.hops*.8;")
rep("e.jcd=7;e.jet=.8+Math.min(1.3,dy*.09);","e.jcd=7;e.jet=.5+Math.min(.9,dy*.07);")
# a jump pose: knees tuck going up, legs reach down and arms spread coming down; a small knee bend on short landings
rep("root.position.y=py;root.rotation.set(0,ry,rz)}",
    "if(e.gr0===false&&!e.roll&&!((e.landT||0)>0)){const vy=e.vy||0,u=Math.max(0,Math.min(1,vy/6)),f=Math.max(0,Math.min(1,-vy/8));\n"
    "      for(let i=0;i<2;i++){BL(legs[i][0],'x',-1.25+(i?.25:0),u*.9);BL(legs[i][1],'x',1.9-(i?.3:0),u*.9);BL(legs[i][0],'x',-.4+(i?.3:0),f*.7);BL(legs[i][1],'x',.45,f*.7);arms[i][0].rotation.z+=(i?-1:1)*(.3*u+.55*f)}\n"
    "      tor.rotation.x+=.22*u-.12*f;head.rotation.x-=.15*u}\n"
    "    if((e.landS||0)>0){const k=Math.sin(Math.min(1,e.landS/.3)*Math.PI);for(let i=0;i<2;i++){legs[i][0].rotation.x-=.45*k;legs[i][1].rotation.x+=.8*k}py-=.12*k;tor.rotation.x+=.15*k}\n"
    "    root.position.y=py;root.rotation.set(0,ry,rz)}")
rep("}}e.gr0=gr;if(gr&&e.vy<0)e.vy=0;","}}else if(gr&&!e.gr0&&vy0<-1.5&&!e.roll)e.landS=.3;e.gr0=gr;if(gr&&e.vy<0)e.vy=0;")
rep("e.landT=Math.max(0,(e.landT||0)-dt);","e.landT=Math.max(0,(e.landT||0)-dt);e.landS=Math.max(0,(e.landS||0)-dt);")
open(dst,'w').write(s);print('ok',len(s))
