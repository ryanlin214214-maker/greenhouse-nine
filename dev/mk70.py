import sys,re
s=open(sys.argv[1]).read()
a2="if(state==='menu'){const a=reduced?0.3:time*0.12;"
assert s.count(a2)==1
s=s.replace(a2,"if(window.__camOv){const c=window.__camOv;cam.position.set(c[0],c[1],c[2]);cam.lookAt(c[3],c[4],c[5])}else if(state==='menu'){const a=reduced?0.3:time*0.12;")
m=re.search(r"vm\.visible=state!==[^;]*;",s);s=s.replace(m.group(0),m.group(0)[:-1]+"&&!window.__camOv;",1)
a="function groundTick(e,dt){";assert s.count(a)==1;s=s.replace(a,a+"if(window.__freeze)return;")
a="  if(FP.insp>=0){FP.insp+=dt;";assert s.count(a)==1;s=s.replace(a,"  if(window.__fpo)Object.assign(FP,window.__fpo);"+a)
open(sys.argv[2],'w').write(s)
