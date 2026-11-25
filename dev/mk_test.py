import sys
src,dst,wave=sys.argv[1],sys.argv[2],sys.argv[3]
s=open(src).read();inj=open('inj.js').read().replace('\n','')
a="try{best=+localStorage.getItem('gh9-best')||0}catch(e){}"
H="function hurt(n,src){" if "function hurt(n,src){" in s else "function hurt(n){"
for k in [a,H,"function frame(now){","score=0;wave=0;"]: assert s.count(k)==1,k
s=s.replace(a,inj+a).replace(H,H+"window.__hurtN++;return;").replace("function frame(now){","function frame(now){renderer.info.autoReset=false;renderer.info.reset();").replace("score=0;wave=0;","score=0;wave=%s;"%wave)
open(dst,'w').write(s)
