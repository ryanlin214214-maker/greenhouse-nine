import json,subprocess,os,time
V={'N':('JBFqnCBsd6RMkjVDRZzb',{'stability':.5,'similarity_boost':.8,'style':.25,'speed':.95}),'R':('iP95p4xoKVk53GoZ742B',{'stability':.45,'similarity_boost':.8,'style':.3,'speed':1.0}),
   'L':('nPczCjzI2devNBz1zQrb',{'stability':.6,'similarity_boost':.8,'style':.2,'speed':.85}),'C':('onwK4e9ZLuTAKqWW03F9',{'stability':.55,'similarity_boost':.8,'style':.15,'speed':1.02}),
   'G':('Xb7hH8MSUJpSbSDYk0k2',{'stability':.55,'similarity_boost':.8,'style':.15,'speed':.97}),'H':('XrExE9yKIg1WjnnlVkGX',{'stability':.45,'similarity_boost':.8,'style':.35,'speed':1.05})}
F={'N':"highpass=f=60",'R':"highpass=f=70",'L':"asetrate=44100*0.84,aresample=44100,atempo=1.19,chorus=0.6:0.85:45:0.25:0.25:2,aecho=0.8:0.55:35|70:0.22|0.12",
   'C':"highpass=f=320,lowpass=f=3300,acompressor=threshold=-20dB:ratio=5:attack=5:release=60",'G':"highpass=f=110,lowpass=f=7000,aecho=0.85:0.4:25:0.12",'H':"highpass=f=280,lowpass=f=3600,acompressor=threshold=-20dB:ratio=4:attack=5:release=60"}
TRIM="silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse"
for lid,k,text in json.load(open('vo/need.json')):
    raw=f'vo/raw/{lid}.mp3';vid,vs=V[k]
    if not (os.path.exists(raw) and os.path.getsize(raw)>2000):
        r=subprocess.run(['curl','-sS','--max-time','90','-X','POST',f'https://api.elevenlabs.io/v1/text-to-speech/{vid}?output_format=mp3_44100_96','-H','Content-Type: application/json','-d',json.dumps({'text':text,'model_id':'eleven_v4','voice_settings':vs}),'-o',raw,'-w','%{http_code}'],capture_output=True,text=True)
        print(lid,k,r.stdout.strip(),flush=True)
        if r.stdout.strip()!='200':print(open(raw,errors='ignore').read()[:200]);os.remove(raw);continue
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',raw,'-af',TRIM+','+F[k]+",loudnorm=I=-16:LRA=7:TP=-1.5,apad=pad_dur=0.15",'-ac','1','-ar','44100','-b:a','48k',f'vo/out/{lid}.mp3'],check=True)
