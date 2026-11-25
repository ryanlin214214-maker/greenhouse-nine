p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
# ---- voice hardening
rep("var VOICE={on:true,busy:false,id:0,voices:[],ok:","var VOICE={on:true,busy:false,id:0,miss:0,started:false,cur:null,voices:[],ok:")
rep("function voiceStop(){VOICE.id++;VOICE.busy=false;if(VOICE.ok){try{speechSynthesis.cancel()}catch(e){}}}","function voiceStop(keep){VOICE.id++;VOICE.busy=false;if(!keep)VOICE.cur=null;if(VOICE.ok){try{if(speechSynthesis.speaking||speechSynthesis.pending)speechSynthesis.cancel()}catch(e){}}}")
rep("  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text),id=++VOICE.id,","  try{if(speechSynthesis.speaking||speechSynthesis.pending)speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text),id=++VOICE.id,")
rep("VOICE.busy=true;\n    u.onend=u.onerror=()=>{if(VOICE.id===id)VOICE.busy=false};setTimeout(()=>{if(VOICE.id===id)VOICE.busy=false},text.length*115+3000);speechSynthesis.speak(u)}catch(e){VOICE.busy=false}}","""VOICE.busy=true;VOICE.started=false;VOICE.cur={text,k};
    u.onstart=()=>{if(VOICE.id===id){VOICE.started=true;VOICE.miss=0}};u.onend=u.onerror=()=>{if(VOICE.id===id){VOICE.busy=false;VOICE.cur=null}};
    setTimeout(()=>{if(VOICE.id===id&&VOICE.busy&&!VOICE.started&&!speechSynthesis.speaking){VOICE.busy=false;if(++VOICE.miss>=2){VOICE.ok=false;$('vox').textContent='No voice here'}}},2200);
    setTimeout(()=>{if(VOICE.id===id)VOICE.busy=false},text.length*115+3000);speechSynthesis.speak(u)}catch(e){VOICE.busy=false}}
function voicePrime(){if(!VOICE.ok||!VOICE.on)return;try{const u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u)}catch(e){}}""")
rep("if(s!=='playing')voiceStop();","if(s!=='playing')voiceStop(s==='paused');")
rep("function resume(){$('settings').hidden=true;setState('playing');lock()}","function resume(){const c=VOICE.cur;voiceStop();$('settings').hidden=true;setState('playing');lock();if(c&&VOICE.on)speak(c.text,c.k)}")
rep("function begin(noIntro){","function begin(noIntro){voicePrime();")
rep("$('mute').addEventListener('click',()=>{muted=!muted;$('mute').textContent=muted?'Sound off':'Sound on'});","$('mute').addEventListener('click',()=>{muted=!muted;$('mute').textContent=muted?'Sound off':'Sound on';if(muted)voiceStop()});")
# ---- ending screen is read aloud
rep("$('ovText').textContent='Thalassa holds.","const txt='Thalassa holds.")
rep("aboard the station.';\n  $('go').textContent='Keep fighting';gap=3}","aboard the station.';$('ovText').textContent=txt;\n  $('go').textContent='Keep fighting';speak(txt,'N');VOICE.cur=null;gap=3}")
# ---- cutscene framing: machines are the subject
rep("[[0,16,12.5,2],[0,12,11,-1],[0,18,13.6,-3],[1,10,10.2,3],[0,8,14,-2],[1,14,9.6,5],[0,5,12,1],[0,20,11.4,5.5],[0,2,10,-5],[1,-3,13,2]]","[[0,26.7,13.1,6.3],[0,22.9,11.1,10.1],[1,22.2,12.4,6.6],[0,21.7,13.8,2.6],[1,17.3,10.3,8.3],[0,16.9,12.5,3.7],[0,26.9,11.6,3.1],[0,14.1,11.9,5.2],[0,27,12.6,12]]")
rep("{d:8,act:'drones',p:[34,11.7,12,24,12.6,6],l:[-20,8,-10,-24,10,-12],","{d:8,act:'drones',p:[34,11.7,12,30,12,9.5],l:[-20,8,-10,-22,9,-11],")
rep("[[5,-1.4,-92],[5,1.4,-94.5],[6,0,-97.5],[7,-2.6,-100],[10,2.6,-102],[5,-1.2,-104.5],[5,1.6,-107]]","[[5,-1.1,-78],[5,1.2,-80.5],[6,0,-84],[7,-2.4,-87],[10,2.4,-89],[5,-1.1,-92],[5,1.4,-95]]")
rep("{d:7,act:'march',p:[0,1.3,-75,0,1.5,-62],l:[0,1.8,-150,0,1.8,-150],","{d:7,act:'march',p:[0,1,-56,0,1.1,-58],l:[0,1.7,-76,0,1.7,-76],")
rep("a.pos.z=a.z0+t*3.2;","a.pos.z=a.z0+t*2.4;")
open(p,'w').write(s);print('ok')
