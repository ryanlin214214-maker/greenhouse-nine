s=open('hub82.js').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:80]);s=s.replace(a,b)
rep("bk2=bas({color:0x3a4a5c})","bk2=bas({color:0x141a20})")
rep("a(GEO.box,cy,4.3,.12,.1,p2,.5+yo,q2,0,ry,0);a(GEO.box,cy,4.3,.12,.1,p2,7.2+yo,q2,0,ry,0);","a(GEO.box,cyD,4.3,.06,.1,p2,.5+yo,q2,0,ry,0);a(GEO.box,cyD,4.3,.06,.1,p2,7.2+yo,q2,0,ry,0);")
rep("a(GEO.box,lw,.1,6.2,.1,p3,3.9+yo,q3,0,ry,0)","a(GEO.box,amD,.05,6.2,.05,p3,3.9+yo,q3,0,ry,0)")
# real spotlights on the displays (no shadows); the shop walls were lit only by the dim fill, so the guns read as black shapes
rep("  G.visible=false}","""  HUB.spots=[];for(const[x,y,z,tx,ty,tz,an,I,c]of[[-38,15,1050,-38,7,1072,.95,3.2,0xffe4c0],[-26,12,1030,-49,6,1036,.8,1.6,0xffe4c0],[25,8,997,25,3,987,.75,2.6,0xffe8c8],[37,17,1046,37,6,1071,1.05,2.6,0xf2f0ff],[48,17,1018,61,6,1018,1.05,2.6,0xf2f0ff]]){
    const L=new T.SpotLight(c,I,0,an,.65,0);L.position.set(x,y,z);L.target.position.set(tx,ty,tz);L.castShadow=false;D.add(L);D.add(L.target);HUB.spots.push(L)}
  G.visible=false}""")
open('hub82.js','w').write(s);print('ok')
