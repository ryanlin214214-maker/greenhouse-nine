p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
rep("var VOICE={on:true,busy:false,id:0,","var VOICE={on:true,busy:false,id:0,lastCancel:0,")
rep("if(VOICE.ok){try{if(speechSynthesis.speaking||speechSynthesis.pending)speechSynthesis.cancel()}catch(e){}}}","if(VOICE.ok){try{if(speechSynthesis.speaking||speechSynthesis.pending){speechSynthesis.cancel();VOICE.lastCancel=performance.now()}}catch(e){}}}")
rep("try{const hadQ=speechSynthesis.speaking||speechSynthesis.pending;if(hadQ)speechSynthesis.cancel();const u=","try{if(speechSynthesis.speaking||speechSynthesis.pending){speechSynthesis.cancel();VOICE.lastCancel=performance.now()}const wait=Math.max(0,90-(performance.now()-VOICE.lastCancel)),u=")
rep("if(hadQ)setTimeout(()=>{if(VOICE.id===id)speechSynthesis.speak(u)},90);else speechSynthesis.speak(u)}catch(e){VOICE.busy=false}}","if(wait>0)setTimeout(()=>{if(VOICE.id===id)speechSynthesis.speak(u)},wait);else speechSynthesis.speak(u)}catch(e){VOICE.busy=false}}")
rep("if(speechSynthesis.speaking||speechSynthesis.pending)speechSynthesis.cancel();\n  const a=new Audio(url)","if(speechSynthesis.speaking||speechSynthesis.pending){speechSynthesis.cancel();VOICE.lastCancel=performance.now()}\n  const a=new Audio(url)") if "if(speechSynthesis.speaking||speechSynthesis.pending)speechSynthesis.cancel();\n  const a=new Audio(url)" in s else None
open(p,'w').write(s);print('ok')
