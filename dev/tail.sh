#!/bin/bash
# rebuild only the test copy from the newest cN.html: ./tail.sh 109
set -e;cd "$(dirname "$0")";N=$1
python3 mk_test.py c$N.html x.html 1 >/dev/null
python3 - <<'P'
s=open('x.html').read();a="try{best=+localStorage.getItem('gh9-best')||0}catch(e){}"
s=s.replace(a,"window.__x=c=>eval(c);"+a,1).replace("window.__hurtN++;return;","window.__hurtN++;if(!window.__realHurt)return;");open('x2.html','w').write(s)
P
python3 mk70.py x2.html gtest/t${N}x.html
sed -i "1i <meta charset=\"utf-8\">" gtest/t${N}x.html
python3 - "$N" <<'P'
import sys,subprocess
s=open('c%s.html'%sys.argv[1]).read();a=s.rfind('<script>');a=s.find('>',a)+1;e=s.find('</script>',a);open('/tmp/chk.js','w').write(s[a:e])
P
node --check /tmp/chk.js && echo syntax ok
