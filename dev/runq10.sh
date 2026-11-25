#!/bin/bash
cd "$(dirname "$0")";P=t118x.html;L=q118c.log;: > $L
run(){ echo "== $1 $2" >> $L; timeout ${3:-2400} node $1.js $P $2 >> $L 2>&1; echo "== exit $? $1" >> $L; }
run tflyr "" 7200
run tships "" 3600
run t236b "" 2400
echo "== tpub" >> $L; timeout 900 node tpub.js >> $L 2>&1; echo "== exit $? tpub" >> $L
echo "== ALL DONE" >> $L
