#!/bin/bash
cd "$(dirname "$0")";P=t118x.html;L=q118b.log;: > $L
run(){ echo "== $1 $2" >> $L; timeout ${3:-2400} node $1.js $P $2 >> $L 2>&1; echo "== exit $? $1" >> $L; }
until grep -q "ALL DONE" q118.log 2>/dev/null; do sleep 15; done
run tglb "" 900
run tcut "" 900
run tcut2 "" 900
run tfoot "" 900
echo "== ALL DONE" >> $L
