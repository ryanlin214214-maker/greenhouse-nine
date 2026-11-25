p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
rep("for(const f of FIX)f.d=(f.x-p.x)**2+4*(f.y-p.y)**2+(f.z-p.z)**2;","for(const f of FIX)f.d=(f.x-p.x)**2+4*(f.y-p.y)**2+(f.z-p.z)**2+(f.rm===r?0:1600);")
rep("const fix=(x,y,z,mk,r=26)=>FIX.push({x,y,z,c:MOODS[mk].lc,i:MOODS[mk].li,r,top:false,used:false});","const fix=(x,y,z,mk,r=26)=>FIX.push({x,y,z,c:MOODS[mk].lc,i:MOODS[mk].li,r,rm:roomAt(x,z),top:false,used:false});")
rep("MAT.laneA=std({color:0x59646a,roughness:.5,metalness:.3});MAT.laneB=std({color:0x353d41,roughness:.45,metalness:.35});MAT.laneF=std({color:0x4c574f,roughness:.6,metalness:.25});","MAT.laneA=std({color:0x59646a,roughness:.85,metalness:.05});MAT.laneB=std({color:0x353d41,roughness:.85,metalness:.05});MAT.laneF=std({color:0x4c574f,roughness:.85,metalness:.05});")
rep("tileMat('#191c1e','#24292c','rgba(200,70,60,.4)','hazard')","tileMat('#191c1e','#24292c','rgba(200,70,60,.55)','')")
rep("MAT.wallD=std({map:paint(512,(g,S)=>plating(g,S,'#8d989b','#d0702e','C-12')),roughness:.55,metalness:.35});MAT.wallD.map.repeat.set(.5,.5);","MAT.wallD=std({map:paint(512,(g,S)=>hullPanels(g,S,'#98a2a5')),roughness:.55,metalness:.3});MAT.wallD.map.repeat.set(.25,.25);")
open(p,'w').write(s);print('ok')
