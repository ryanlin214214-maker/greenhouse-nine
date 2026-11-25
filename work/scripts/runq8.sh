#!/bin/bash
cd "$(dirname "$0")";P=t118x.html;L=q118.log;: > $L
run(){ echo "== $1 $2" >> $L; timeout ${3:-2400} node $1.js $P $2 >> $L 2>&1; echo "== exit $? $1" >> $L; }
until grep -q "ALL DONE" q117.log; do sleep 15; done
run t234 "" 2400
run t199b "" 2400
echo "== ALL DONE" >> $L
