import re,subprocess,os,json
sec=None;rows=[]
for l in open('/home/user/greenhouse-nine/voice-script.txt'):
    m=re.match(r"=== (.*) ===",l)
    if m:sec=m.group(1);continue
    m=re.match(r"([0-9a-f]{8})  (.*)",l.rstrip('\n'))
    if m:rows.append((m.group(1),sec,m.group(2)))
TRIM="silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse"
F={'NARRATOR':TRIM+",highpass=f=60",
   'ROWAN':TRIM+",highpass=f=70",
   'LATTICE (the AI)':TRIM+",asetrate=44100*0.84,aresample=44100,atempo=1.19,chorus=0.6:0.85:45:0.25:0.25:2,aecho=0.8:0.55:35|70:0.22|0.12",
   'FLEET COMMAND (radio)':TRIM+",highpass=f=320,lowpass=f=3300,acompressor=threshold=-20dB:ratio=5:attack=5:release=60",
   'RECOVERED LOGS':TRIM+",highpass=f=110,lowpass=f=7000,aecho=0.85:0.4:25:0.12"}
os.makedirs('vo/out',exist_ok=True);tot=0;meta={}
for lid,sec,text in rows:
    src=f'vo/raw/{lid}.mp3';dst=f'vo/out/{lid}.mp3'
    af=F[sec]+",loudnorm=I=-16:LRA=7:TP=-1.5,apad=pad_dur=0.15"
    r=subprocess.run(['ffmpeg','-loglevel','error','-y','-i',src,'-af',af,'-ac','1','-ar','44100','-b:a','48k',dst],capture_output=True,text=True)
    if r.returncode:print('ERR',lid,r.stderr[:200]);continue
    d=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',dst],capture_output=True,text=True).stdout.strip())
    meta[lid]=round(d,2);tot+=os.path.getsize(dst)
print(len(meta),'clips', round(sum(meta.values())/60,1),'minutes', round(tot/1e6,2),'MB')
json.dump(meta,open('vo/durations.json','w'))
