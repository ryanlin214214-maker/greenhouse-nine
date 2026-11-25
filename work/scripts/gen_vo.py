import re,json,subprocess,os,sys,time
CAST={'NARRATOR':('N','JBFqnCBsd6RMkjVDRZzb',{'stability':.5,'similarity_boost':.8,'style':.25,'speed':.95}),
      'ROWAN':('R','iP95p4xoKVk53GoZ742B',{'stability':.45,'similarity_boost':.8,'style':.3,'speed':1.0}),
      'LATTICE (the AI)':('L','nPczCjzI2devNBz1zQrb',{'stability':.6,'similarity_boost':.8,'style':.2,'speed':.85}),
      'FLEET COMMAND (radio)':('C','onwK4e9ZLuTAKqWW03F9',{'stability':.55,'similarity_boost':.8,'style':.15,'speed':1.02}),
      'RECOVERED LOGS':('G','Xb7hH8MSUJpSbSDYk0k2',{'stability':.55,'similarity_boost':.8,'style':.15,'speed':.97})}
sec=None;rows=[]
for l in open('/home/user/greenhouse-nine/voice-script.txt'):
    m=re.match(r"=== (.*) ===",l)
    if m:sec=m.group(1);continue
    m=re.match(r"([0-9a-f]{8})  (.*)",l.rstrip('\n'))
    if m:rows.append((m.group(1),sec,m.group(2)))
os.makedirs('vo/raw',exist_ok=True)
done=0;fail=[]
for i,(lid,sec,text) in enumerate(rows):
    out=f'vo/raw/{lid}.mp3'
    if os.path.exists(out) and os.path.getsize(out)>2000:done+=1;continue
    k,vid,vs=CAST[sec]
    body=json.dumps({'text':text,'model_id':'eleven_v4','voice_settings':vs})
    for attempt in range(3):
        r=subprocess.run(['curl','-sS','--max-time','90','-X','POST',f'https://api.elevenlabs.io/v1/text-to-speech/{vid}?output_format=mp3_44100_96','-H','Content-Type: application/json','-d',body,'-o',out,'-w','%{http_code}'],capture_output=True,text=True)
        code=r.stdout.strip()
        if code=='200' and os.path.getsize(out)>2000:break
        err=open(out,errors='ignore').read()[:300] if os.path.exists(out) else r.stderr
        print('retry',lid,code,err,flush=True);time.sleep(3)
    if code=='200':done+=1
    else:fail.append((lid,code));os.path.exists(out) and os.remove(out)
    print(i+1,'/',len(rows),lid,k,code,flush=True)
print('done',done,'failed',fail)
