p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
# ---- settings markup
rep('    <button type="button" id="setClose">Done</button>','''    <h3 class="vh">Voices</h3>
    <label for="vpN">Narrator <select id="vpN"></select></label>
    <label for="vpR">Rowan <select id="vpR"></select></label>
    <label for="vpL">Lattice (the AI) <select id="vpL"></select></label>
    <label for="vpG">Recovered logs <select id="vpG"></select></label>
    <label for="vimp">Import voice recordings <input id="vimp" type="file" accept="audio/*" multiple></label>
    <p class="vnote" id="vnote">No recordings imported. A recording replaces the computer voice for the line it is named after.</p>
    <button type="button" id="vclr" hidden>Remove imported recordings</button>
    <button type="button" id="setClose">Done</button>''')
rep(".msg.on{opacity:1}",".msg.on{opacity:1}\n#settings{max-height:92%;overflow:auto}\n#settings .vh{margin:12px 0 4px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--amber)}\n#settings .vnote{margin:4px 0 8px;font-size:11px;line-height:1.4;opacity:.8}\n#settings select{max-width:58%}")
# ---- voice engine: picks, imported clips
rep("var VOICE={on:true,busy:false,id:0,miss:0,started:false,cur:null,voices:[],ok:","var VOICE={on:true,busy:false,id:0,miss:0,started:false,cur:null,audio:null,pick:{},voices:[],ok:")
rep("try{VOICE.on=localStorage.getItem('gh9-vox')!=='0'}catch(e){}","try{VOICE.on=localStorage.getItem('gh9-vox')!=='0'}catch(e){}\ntry{VOICE.pick=JSON.parse(localStorage.getItem('gh9-voicepick')||'{}')||{}}catch(e){VOICE.pick={}}\nfunction lineId(t){let h=5381;for(let i=0;i<t.length;i++)h=((h<<5)+h+t.charCodeAt(i))>>>0;return h.toString(16).padStart(8,'0')}\nvar VDB={db:null,clips:{},n:0};")
rep("function voiceLoad(){if(!VOICE.ok)return;try{VOICE.voices=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang)).sort((a,b)=>(/natural|neural|google|premium|enhanced/i.test(b.name)?1:0)-(/natural|neural|google|premium|enhanced/i.test(a.name)?1:0))}catch(e){}}","function voiceLoad(){if(!VOICE.ok)return;try{VOICE.voices=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang)).sort((a,b)=>(/natural|neural|google|premium|enhanced/i.test(b.name)?1:0)-(/natural|neural|google|premium|enhanced/i.test(a.name)?1:0))}catch(e){}try{voicePickBuild()}catch(e){}}")
rep("function voiceStop(keep){VOICE.id++;VOICE.busy=false;if(!keep)VOICE.cur=null;","function voiceStop(keep){VOICE.id++;VOICE.busy=false;if(!keep)VOICE.cur=null;if(VOICE.audio){try{VOICE.audio.pause()}catch(e){}VOICE.audio=null}")
rep("function speak(text,k){if(!VOICE.ok||!VOICE.on||muted||!text){VOICE.busy=false;return}","""function playClip(url,text,k){try{if(VOICE.audio){VOICE.audio.pause();VOICE.audio=null}if(VOICE.ok&&(speechSynthesis.speaking||speechSynthesis.pending))speechSynthesis.cancel();
  const a=new Audio(url),id=++VOICE.id;a.volume=Math.min(1,(CFG.vol||1)*1.2);VOICE.audio=a;VOICE.busy=true;VOICE.cur={text,k};
  a.onended=a.onerror=()=>{if(VOICE.id===id){VOICE.busy=false;VOICE.cur=null}};setTimeout(()=>{if(VOICE.id===id)VOICE.busy=false},90000);
  const pr=a.play();if(pr&&pr.catch)pr.catch(()=>{if(VOICE.id===id)VOICE.busy=false})}catch(e){VOICE.busy=false}}
function speak(text,k){if(VOICE.on&&!muted&&text&&VDB.clips[lineId(text)]){playClip(VDB.clips[lineId(text)],text,k);return}
  if(!VOICE.ok||!VOICE.on||muted||!text){VOICE.busy=false;return}""")
rep("if(vs.length)u.voice=vs[P[0]%vs.length];","{const pv=VOICE.pick[k]&&speechSynthesis.getVoices().find(x=>x.name===VOICE.pick[k]),dv=vs.length?vs[P[0]%vs.length]:null;if(pv||dv)u.voice=pv||dv}")
rep("function voicePrime(){","""const VSAMPLE={N:'Year 2687. Thalassa Station, in orbit above Europa.',R:'Stay close. I will watch your back.',L:'Come forward, soldier. Come and hear the song properly.',G:'Log 2010. Seed vault inventory, sealed.'};
function voicePickBuild(){for(const k of['N','R','L','G']){const el=$('vp'+k);if(!el)continue;el.innerHTML='';const a=document.createElement('option');a.value='';a.textContent='Automatic';el.appendChild(a);
    for(const v of VOICE.voices){const o=document.createElement('option');o.value=v.name;o.textContent=v.name+' ('+v.lang+')';el.appendChild(o)}el.value=VOICE.pick[k]||'';if(el.value!==(VOICE.pick[k]||''))el.value='';
    el.onchange=()=>{if(el.value)VOICE.pick[k]=el.value;else delete VOICE.pick[k];try{localStorage.setItem('gh9-voicepick',JSON.stringify(VOICE.pick))}catch(e){}voiceStop();VOICE.ok=VOICE.ok||typeof speechSynthesis!=='undefined';speak(VSAMPLE[k],k)}}}
/* imported recordings live in this browser (IndexedDB). A file named after a line's id replaces the computer voice for that line */
function vdbShow(){const n=Object.keys(VDB.clips).length;if($('vnote'))$('vnote').textContent=n?n+' recording'+(n>1?'s':'')+' imported. They play instead of the computer voice for the lines they are named after.':'No recordings imported. A recording replaces the computer voice for the line it is named after.';if($('vclr'))$('vclr').hidden=!n}
function vdbOpen(){return new Promise(r=>{try{const q=indexedDB.open('gh9-voice',1);q.onupgradeneeded=()=>q.result.createObjectStore('clips');q.onsuccess=()=>{VDB.db=q.result;r(true)};q.onerror=()=>r(false)}catch(e){r(false)}})}
async function vdbLoad(){if(!(await vdbOpen()))return;try{const tx=VDB.db.transaction('clips'),st=tx.objectStore('clips'),ks=st.getAllKeys(),vs=st.getAll();tx.oncomplete=()=>{ks.result.forEach((k,i)=>{VDB.clips[k]=URL.createObjectURL(vs.result[i])});vdbShow()}}catch(e){}}
async function vdbImport(files){if(!VDB.db&&!(await vdbOpen())){if($('vnote'))$('vnote').textContent='This browser would not let me store recordings.';return}let n=0,bad=0;
  for(const f of files){const id=f.name.replace(/\\.[^.]+$/,'').toLowerCase();if(!/^[0-9a-f]{8}$/.test(id)){bad++;continue}try{await new Promise((res,rej)=>{const tx=VDB.db.transaction('clips','readwrite');tx.objectStore('clips').put(f,id);tx.oncomplete=res;tx.onerror=rej});if(VDB.clips[id])URL.revokeObjectURL(VDB.clips[id]);VDB.clips[id]=URL.createObjectURL(f);n++}catch(e){bad++}}
  vdbShow();if(bad&&$('vnote'))$('vnote').textContent+=' '+bad+' file'+(bad>1?'s were':' was')+' skipped because the name is not an 8-character line id.'}
function vdbClear(){try{const tx=VDB.db.transaction('clips','readwrite');tx.objectStore('clips').clear();tx.oncomplete=()=>{for(const k in VDB.clips){URL.revokeObjectURL(VDB.clips[k]);delete VDB.clips[k]}vdbShow()}}catch(e){}}
function voicePrime(){""")
rep("$('vox').addEventListener('click',","""$('vimp').addEventListener('change',e=>{vdbImport([...e.target.files]);e.target.value=''});$('vclr').addEventListener('click',vdbClear);
$('vox').addEventListener('click',""")
rep("applyCfg();saveInit();\ndemo();","applyCfg();saveInit();vdbLoad();voicePickBuild();\ndemo();")
# ---- comm hold uses busy (works for recordings too)
rep("commChars=0;commT=VOICE.ok&&VOICE.on&&!muted?.7:commCur.hold;speak(commCur.text,commCur.k);","commChars=0;commT=commCur.hold;speak(commCur.text,commCur.k);if(VOICE.busy)commT=.7;")
open(p,'w').write(s);print('ok')
