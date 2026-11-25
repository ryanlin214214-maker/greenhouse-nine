import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)
# darker sky, like real space (owner): 600 stars instead of 1,500, most of them faint, a few bright
rep(" const p=[];for(let i=0;i<1500;i++){const a=Math.random()*6.283,e=Math.acos(Math.random()*1.25-0.25),r=4200;p.push(Math.sin(e)*Math.cos(a)*r,Math.cos(e)*r,Math.sin(e)*Math.sin(a)*r)}\n const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));\n FAR.add(new T.Points(g,new T.PointsMaterial({color:0xffffff,size:1.7,sizeAttenuation:false,fog:false})));",
    " const p=[],pc=[];for(let i=0;i<600;i++){const a=Math.random()*6.283,e=Math.acos(Math.random()*1.25-0.25),r=4200;p.push(Math.sin(e)*Math.cos(a)*r,Math.cos(e)*r,Math.sin(e)*Math.sin(a)*r);const b=.12+.88*Math.pow(Math.random(),4),t=Math.random();pc.push(b*(t<.15?.8:1),b*(t<.15?.88:1),b*(t>.85?.8:1))}\n const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('color',new T.Float32BufferAttribute(pc,3));\n FAR.add(new T.Points(g,new T.PointsMaterial({color:0xffffff,vertexColors:true,size:1.5,sizeAttenuation:false,fog:false})));")
# fewer, fainter speed streaks in flight
rep("const FDUST=(()=>{const N=260,", "const FDUST=(()=>{const N=110,")
rep("new T.LineBasicMaterial({color:0xcfe6ff,transparent:true,opacity:.35,fog:false,depthWrite:false})", "new T.LineBasicMaterial({color:0xcfe6ff,transparent:true,opacity:.22,fog:false,depthWrite:false})")
# door frames: solid green, so they read green on bright walls (additive turned them white)
rep("const m=bas({color:0x7dffb0,transparent:true,opacity:.8,blending:T.AdditiveBlending,depthWrite:false,fog:false});", "const m=bas({color:0x22d468,transparent:true,opacity:.9,depthWrite:false,fog:false});")
open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))
