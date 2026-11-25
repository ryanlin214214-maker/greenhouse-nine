#!/bin/bash
# full rebuild: c89 + hub82.js + guns83.js -> c97.html (current). Add new patches at the end.
set -e
cd "$(dirname "$0")"
python3 p82.py c89.html c90.html | tail -1
python3 p83.py c90.html c91.html | tail -1
python3 p84.py c91.html c92.html | tail -1
python3 p85.py c92.html c95.html | tail -1
python3 p86.py c95.html c96.html | tail -1
python3 p87.py c96.html c97a.html | tail -1
python3 p88.py c97a.html c97b.html | tail -1
python3 p89.py c97b.html c97.html | tail -1
python3 p90.py c97.html c98.html | tail -1
python3 p91.py c98.html c99.html | tail -1
python3 p92.py c99.html c100.html | tail -1
python3 p93.py c100.html c101.html | tail -1
python3 p94.py c101.html c102.html | tail -1
python3 p95.py c102.html c103.html | tail -1
python3 p96.py c103.html c104.html | tail -1
python3 p97.py c104.html c105.html | tail -1
python3 p98.py c105.html c106.html | tail -1
python3 p99.py c106.html c107.html | tail -1
python3 p100.py c107.html c108.html | tail -1
python3 mk_test.py c108.html x.html ${1:-1} >/dev/null
python3 - <<'P'
s=open('x.html').read();a="try{best=+localStorage.getItem('gh9-best')||0}catch(e){}"
s=s.replace(a,"window.__x=c=>eval(c);"+a,1).replace("window.__hurtN++;return;","window.__hurtN++;if(!window.__realHurt)return;");open('x2.html','w').write(s)
P
python3 mk70.py x2.html gtest/t108x.html
echo built c108 gtest/t108x.html
