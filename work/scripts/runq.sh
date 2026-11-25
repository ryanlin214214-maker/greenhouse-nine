#!/bin/bash
# sequential verification queue for build $1 (one browser at a time)
cd "$(dirname "$0")";P=t$1x.html;L=q$1.log;: > $L
run(){ echo "== $1" >> $L; timeout ${3:-2400} node $1.js $P $2 >> $L 2>&1; echo "== exit $? $1" >> $L; }
run tmer mer/a_ 4000
run tgnd "" 900
run tglb "" 900
run tglb http 900
run tcut "" 900
run tfoot "" 900
for t in t236 t247 t230 t248 t251 t224 t234 t199b; do run $t "" 2400; done
echo "== ALL DONE" >> $L
