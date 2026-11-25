p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
rep("function voicePrime(){if(!VOICE.ok||!VOICE.on)return;try{const u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u)}catch(e){}}","function voicePrime(){}")
rep("  try{if(speechSynthesis.speaking||speechSynthesis.pending)speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text),id=++VOICE.id,","  try{const hadQ=speechSynthesis.speaking||speechSynthesis.pending;if(hadQ)speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text),id=++VOICE.id,")
rep("setTimeout(()=>{if(VOICE.id===id&&VOICE.busy&&!VOICE.started&&!speechSynthesis.speaking){VOICE.busy=false;if(++VOICE.miss>=2){VOICE.ok=false;$('vox').textContent='No voice here'}}},2200);","setTimeout(()=>{if(VOICE.id===id&&VOICE.busy&&!VOICE.started&&!speechSynthesis.speaking&&!speechSynthesis.pending){VOICE.busy=false;if(++VOICE.miss>=4){VOICE.ok=false;$('vox').textContent='Voice stuck · click to retry'}}},4500);")
rep("setTimeout(()=>{if(VOICE.id===id)VOICE.busy=false},text.length*115+3000);speechSynthesis.speak(u)}catch(e){VOICE.busy=false}}","setTimeout(()=>{if(VOICE.id===id)VOICE.busy=false},text.length*115+3000);\n    // some browsers drop a line spoken in the same instant as a cancel, so wait a moment after cancelling\n    if(hadQ)setTimeout(()=>{if(VOICE.id===id)speechSynthesis.speak(u)},90);else speechSynthesis.speak(u)}catch(e){VOICE.busy=false}}")
rep("$('vox').addEventListener('click',()=>{if(!VOICE.ok)return;VOICE.on=!VOICE.on;","$('vox').addEventListener('click',()=>{if(!VOICE.ok){if(typeof speechSynthesis==='undefined')return;VOICE.ok=true;VOICE.miss=0;VOICE.on=true;$('vox').textContent='Voice on';return}VOICE.on=!VOICE.on;")
open(p,'w').write(s);print('ok')
