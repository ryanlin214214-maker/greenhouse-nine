import sys
s=open('gtest/mn.html').read()
a2="if(state==='menu'){const a=reduced?0.3:time*0.12;"
assert s.count(a2)==1
s=s.replace(a2,"if(window.__camOv){const c=window.__camOv;cam.position.set(c[0],c[1],c[2]);cam.lookAt(c[3],c[4],c[5])}else if(state==='menu'){const a=reduced?0.3:time*0.12;")
import re
m=re.search(r"vm\.visible=state!==[^;]*;",s);print(m.group(0))
s=s.replace(m.group(0),m.group(0)[:-1]+"&&!window.__camOv;",1)
open('gtest/mx.html','w').write(s)
