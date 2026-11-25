import json,base64,os
p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
# embedded recordings, read only when a line is spoken
clips={f[:-4]:base64.b64encode(open('vo/out/'+f,'rb').read()).decode() for f in sorted(os.listdir('vo/out')) if f.endswith('.mp3')}
i=s.rindex('<script>')
s=s[:i]+'<script type="application/json" id="vclips">'+json.dumps(clips,separators=(',',':'))+'</script>\n'+s[i:]
i=s.index("function playClip(");j=s.index("function speak(text,k){")
s=s[:i]+"""/* recorded voice lines (ElevenLabs, built in) and imported recordings play through the game's audio context, which a click has already unlocked */
let VC=null;const VBUF={},VDEC={},VORD=[];
function vclip(id){if(!VC){try{VC=JSON.parse(document.getElementById('vclips').textContent)}catch(e){VC={}}}return VC[id]}
function b64buf(b){const s=atob(b),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u.buffer}
function vdecode(lid){if(VBUF[lid])return Promise.resolve(VBUF[lid]);if(VDEC[lid])return VDEC[lid];if(!ac)return Promise.reject(0);const url=VDB.clips[lid],b64=!url&&vclip(lid);if(!url&&!b64)return Promise.reject(0);
  const p=(url?fetch(url).then(r=>r.arrayBuffer()):Promise.resolve(b64buf(b64))).then(ab=>new Promise((res,rej)=>ac.decodeAudioData(ab,res,rej))).then(b=>{VBUF[lid]=b;VORD.push(lid);while(VORD.length>16)delete VBUF[VORD.shift()];delete VDEC[lid];return b});
  VDEC[lid]=p;p.catch(()=>{delete VDEC[lid]});return p}
function hasClip(text){const id=lineId(text);return !!(VDB.clips[id]||vclip(id))}
function vwarm(text){if(ac&&text&&hasClip(text))vdecode(lineId(text)).catch(()=>{})}
function playLine(text,k){if(VOICE.src){try{VOICE.src.onended=null;VOICE.src.stop()}catch(e){}VOICE.src=null}if(VOICE.ok&&typeof speechSynthesis!=='undefined'&&(speechSynthesis.speaking||speechSynthesis.pending)){speechSynthesis.cancel();VOICE.lastCancel=performance.now()}
  const lid=lineId(text),id=++VOICE.id;VOICE.busy=true;VOICE.cur={text,k};
  const go=buf=>{if(VOICE.id!==id)return;try{if(ac.state==='suspended')ac.resume();const src=ac.createBufferSource(),g=ac.createGain();g.gain.value=Math.min(1.6,(CFG.vol||1)*1.35);src.buffer=buf;src.connect(g);g.connect(ac.destination);
      src.onended=()=>{if(VOICE.id===id){VOICE.busy=false;VOICE.cur=null;VOICE.src=null}};VOICE.src=src;src.start();setTimeout(()=>{if(VOICE.id===id&&VOICE.busy){VOICE.busy=false;VOICE.cur=null}},buf.duration*1000+3000)}catch(e){VOICE.busy=false}};
  vdecode(lid).then(go,()=>{if(VOICE.id===id){VOICE.id--;speakTTS(text,k)}});
  setTimeout(()=>{if(VOICE.id===id&&VOICE.busy&&!VOICE.src){VOICE.busy=false}},6000)}
"""+s[j:]
rep("function speak(text,k){if(VOICE.on&&!muted&&text&&VDB.clips[lineId(text)]){playClip(VDB.clips[lineId(text)],text,k);return}\n  if(!VOICE.ok||!VOICE.on||muted||!text){VOICE.busy=false;return}",
    "function speak(text,k){if(VOICE.on&&!muted&&text&&ac&&hasClip(text)){playLine(text,k);return}speakTTS(text,k)}\nfunction speakTTS(text,k){\n  if(!VOICE.ok||!VOICE.on||muted||!text){VOICE.busy=false;return}")
rep("function voiceStop(keep){VOICE.id++;VOICE.busy=false;if(!keep)VOICE.cur=null;","function voiceStop(keep){VOICE.id++;VOICE.busy=false;if(!keep)VOICE.cur=null;if(VOICE.src){try{VOICE.src.onended=null;VOICE.src.stop()}catch(e){}VOICE.src=null}")
rep("function comm(k,text,hold){if(state==='menu')return;","function comm(k,text,hold){if(state==='menu')return;vwarm(text);")
rep("function introStart(){INTRO.on=true;","function introStart(){for(const q of INTRO.shots)vwarm(q.text);INTRO.on=true;")
# music ducks under speech
rep("MUS.g.gain.setTargetAtTime(muted||!musOn?0:CFG.vol*(state==='paused'?.2:.55),now,.3);","MUS.g.gain.setTargetAtTime(muted||!musOn?0:CFG.vol*(state==='paused'?.2:.55)*(VOICE.busy?.4:1),now,.3);")
open(p,'w').write(s);print('ok',round(len(s)/1e6,2),'MB')
