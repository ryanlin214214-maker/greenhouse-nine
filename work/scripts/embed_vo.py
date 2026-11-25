import re,json,base64,os
P='/home/user/greenhouse-nine/index.html';s=open(P).read()
ids=[l[:8] for l in open('/home/user/greenhouse-nine/voice-script.txt').read().split('\n') if re.match(r'^[0-9a-f]{8}  ',l)]
clips={i:base64.b64encode(open(f'vo/out/{i}.mp3','rb').read()).decode() for i in ids if os.path.exists(f'vo/out/{i}.mp3')}
m=re.search(r'(<script type="application/json" id="vclips">)(.*?)(</script>)',s,re.S);assert m
old=json.loads(m.group(2));print('old clips',len(old),'new',len(clips),'missing',[i for i in ids if i not in clips])
s=s[:m.start(2)]+json.dumps(clips,separators=(',',':'))+s[m.end(2):]
open(P,'w').write(s);print('size',len(s))
