#!/bin/bash
cd "$(dirname "$0")";P=t117x.html;L=q117.log;: > $L
run(){ echo "== $1 $2" >> $L; timeout ${3:-2400} node $1.js $P $2 >> $L 2>&1; echo "== exit $? $1" >> $L; }
until grep -q "ALL DONE" q116b.log; do sleep 15; done
run tbtl "" 5400
ONLY=halberd SKIP=1 run tflyr "" 5400
run t236b "" 2400
run teur42shots "" 1800
echo "== ALL DONE" >> $L
