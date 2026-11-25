import json,subprocess,os,time
V={'V':('pFZP5JQG7iQjIQuC4Bku',{'stability':.5,'similarity_boost':.8,'style':.3,'speed':1.03}),'C':('onwK4e9ZLuTAKqWW03F9',{'stability':.55,'similarity_boost':.8,'style':.15,'speed':1.02}),
   'R':('iP95p4xoKVk53GoZ742B',{'stability':.45,'similarity_boost':.8,'style':.3,'speed':1.0})}
sel=json.load(open('vo/sel116.json'));ok=0
for lid,k,t in sel:
    out=f'vo/raw/{lid}.mp3'
    if os.path.exists(out) and os.path.getsize(out)>2000:ok+=1;continue
    vid,vs=V[k];body=json.dumps({'text':t,'model_id':'eleven_v4','voice_settings':vs})
    r=subprocess.run(['curl','-s','-m','60','-o',out,'-w','%{http_code}','-X','POST',f'https://api.elevenlabs.io/v1/text-to-speech/{vid}?output_format=mp3_44100_128','-H','xi-api-key: dummy','-H','Content-Type: application/json','-d',body],capture_output=True,text=True)
    if r.stdout.strip()=='200' and os.path.getsize(out)>2000:ok+=1
    else:print('FAIL',lid,r.stdout,open(out,'rb').read()[:200]);os.remove(out) if os.path.exists(out) else None
    time.sleep(.4)
print('recorded',ok,'of',len(sel))
