import json,subprocess,re
exec(re.search(r"(TRIM=.*?\n)F=",open('fx_vo.py').read(),re.S).group(1))
src=open('fx_vo.py').read();F={}
for k,expr in [('R',"TRIM+\",highpass=f=70\""),('L',"TRIM+\",asetrate=44100*0.84,aresample=44100,atempo=1.19,chorus=0.6:0.85:45:0.25:0.25:2,aecho=0.8:0.55:35|70:0.22|0.12\""),('C',"TRIM+\",highpass=f=320,lowpass=f=3300,acompressor=threshold=-20dB:ratio=5:attack=5:release=60\"")]:F[k]=eval(expr)
need=json.load(open('vo/need.json'));ok=0
for lid,k,t in need:
    af=F[k]+",loudnorm=I=-16:LRA=7:TP=-1.5,apad=pad_dur=0.15"
    r=subprocess.run(['ffmpeg','-loglevel','error','-y','-i',f'vo/raw/{lid}.mp3','-af',af,'-ac','1','-ar','44100','-b:a','48k',f'vo/out/{lid}.mp3'],capture_output=True,text=True)
    if r.returncode:print('ERR',lid,r.stderr[:200])
    else:ok+=1
print('done',ok,'of',len(need))
