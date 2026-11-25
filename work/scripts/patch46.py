p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
rep('<button id="mus" type="button">Music on</button>','<button id="mus" type="button">Music on</button>\n  <button id="vox" type="button">Voice on</button>')
rep("function comm(k,text,hold){","""/* ---------- voice: the browser's own speech synthesis reads every radio line and cutscene caption. Voices differ per device ---------- */
var VOICE={on:true,busy:false,id:0,voices:[],ok:typeof speechSynthesis!=='undefined'&&typeof SpeechSynthesisUtterance!=='undefined'};
try{VOICE.on=localStorage.getItem('gh9-vox')!=='0'}catch(e){}
function voiceLoad(){if(!VOICE.ok)return;try{VOICE.voices=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang)).sort((a,b)=>(/natural|neural|google|premium|enhanced/i.test(b.name)?1:0)-(/natural|neural|google|premium|enhanced/i.test(a.name)?1:0))}catch(e){}}
if(VOICE.ok){voiceLoad();try{speechSynthesis.onvoiceschanged=voiceLoad}catch(e){}}
function voiceStop(){VOICE.id++;VOICE.busy=false;if(VOICE.ok){try{speechSynthesis.cancel()}catch(e){}}}
// speakers: N narrator, R Rowan, L Lattice (the AI: low and slow), G recovered logs
function speak(text,k){if(!VOICE.ok||!VOICE.on||muted||!text){VOICE.busy=false;return}
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text),id=++VOICE.id,P={N:[0,.95,.92],R:[1,1.08,1.03],L:[2,.55,.85],G:[0,.7,.95]}[k]||[0,1,1],vs=VOICE.voices;
    if(vs.length)u.voice=vs[P[0]%vs.length];u.lang='en-US';u.pitch=P[1];u.rate=P[2];u.volume=Math.min(1,(CFG.vol||1)*1.2);VOICE.busy=true;
    u.onend=u.onerror=()=>{if(VOICE.id===id)VOICE.busy=false};setTimeout(()=>{if(VOICE.id===id)VOICE.busy=false},text.length*115+3000);speechSynthesis.speak(u)}catch(e){VOICE.busy=false}}
function comm(k,text,hold){""")
rep("commChars=0;commT=commCur.hold;const w=WHO[commCur.k];","commChars=0;commT=VOICE.ok&&VOICE.on&&!muted?.7:commCur.hold;speak(commCur.text,commCur.k);const w=WHO[commCur.k];")
rep("if(commChars>=commCur.text.length){commT-=dt;","if(commChars>=commCur.text.length){if(VOICE.busy&&VOICE.on)return;commT-=dt;")
rep("$('mus').addEventListener('click',()=>{musOn=!musOn;$('mus').textContent=musOn?'Music on':'Music off'});","""$('mus').addEventListener('click',()=>{musOn=!musOn;$('mus').textContent=musOn?'Music on':'Music off'});
$('vox').textContent=VOICE.ok?(VOICE.on?'Voice on':'Voice off'):'No voice here';
$('vox').addEventListener('click',()=>{if(!VOICE.ok)return;VOICE.on=!VOICE.on;try{localStorage.setItem('gh9-vox',VOICE.on?'1':'0')}catch(e){}$('vox').textContent=VOICE.on?'Voice on':'Voice off';if(!VOICE.on)voiceStop()});""")
# cutscene: speak each caption; hold a shot while its line is still being read
rep("function introTick(dt){INTRO.t+=dt;INTRO.grace-=dt;let t=INTRO.t,i=0;const S=INTRO.shots;","""function introTick(dt){const S=INTRO.shots;INTRO.grace-=dt;
  {let t0=INTRO.t,i0=0;while(i0<S.length&&t0>=S[i0].d){t0-=S[i0].d;i0++}if(!(i0<S.length&&S[i0].text&&VOICE.on&&VOICE.busy&&i0===INTRO.i&&S[i0].d-t0<.72))INTRO.t+=dt}
  let t=INTRO.t,i=0;""")
rep("if(i!==INTRO.i){INTRO.i=i;$('cineText').textContent=q.text;introClear();","if(i!==INTRO.i){INTRO.i=i;$('cineText').textContent=q.text;introClear();if(q.text)speak(q.text,'N');else voiceStop();")
rep("function introEnd(){if(!INTRO.on)return;INTRO.on=false;introClear();","function introEnd(){if(!INTRO.on)return;INTRO.on=false;voiceStop();introClear();")
rep("function setState(s){state=s;","function setState(s){state=s;if(s!=='playing')voiceStop();")
rep("if(INTRO.on){INTRO.on=false;introClear();introShow(false)}beacon.visible=false;","if(INTRO.on){INTRO.on=false;introClear();introShow(false)}voiceStop();beacon.visible=false;")
open(p,'w').write(s);print('ok')
