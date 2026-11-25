s=open('gtest/n.html').read();a="function hurt(n){window.__hurtN++;return;";assert s.count(a)==1
open('gtest/real.html','w').write(s.replace(a,"function hurt(n){window.__hurtN++;"))
