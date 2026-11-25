import re,json,subprocess,os,base64,sys
import sys
P=sys.argv[1] if len(sys.argv)>1 else 'c107.html'
s=open(P).read()
def unesc(t):
    out=[];i=0
    while i<len(t):
        c=t[i]
        if c=='\\' and i+1<len(t):n=t[i+1];out.append({'n':'\n','t':'\t'}.get(n,n));i+=2
        else:out.append(c);i+=1
    return ''.join(out)
main=s[s.rindex('<script>'):]
lines=[];seen=set()
def add(sp,t):
    t=unesc(t)
    if len(t)<8 or t in seen:return
    seen.add(t);lines.append((sp,t))
Q=r"""(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")"""
for m in re.finditer(r"\{d:[^{}]*?text:"+Q,main):
    blk=m.group(0);k=re.search(r"k:'(\w)'",blk);add(k.group(1) if k else 'N',m.group(1) if m.group(1) is not None else m.group(2))
for m in re.finditer(r"\['([RLGCH])',\s*"+Q+r"\]",main):add(m.group(1),m.group(2) if m.group(2) is not None else m.group(3))
for m in re.finditer(r"comm\('([RLGCH])',\s*"+Q,main):add(m.group(1),m.group(2) if m.group(2) is not None else m.group(3))
for m in re.finditer(r"comm\('([RLGCH])',\[((?:'(?:[^'\\]|\\.)*',?)+)\]",main):
    for q in re.finditer(r"'((?:[^'\\]|\\.)*)'",m.group(2)):add(m.group(1),q.group(1))
for m in re.finditer(r"intro:\"((?:[^\"\\]|\\.)*)\"",main):add('R',m.group(1))
for m in re.finditer(r"\"(LOG \d{4} · [^\"]*)\"",main):add('G',m.group(1))
m=re.search(r"const BARKS=\[(.*?)\];",main)
for q in re.finditer(r"'((?:[^'\\]|\\.)*)'",m.group(1)):add('R',q.group(1))
def lid(t):
    h=5381
    for ch in t:h=(h*33+ord(ch))&0xFFFFFFFF
    return '%08x'%h
names={'N':'NARRATOR','R':'ROWAN','L':'LATTICE (the AI)','C':'FLEET COMMAND (radio)','G':'RECOVERED LOGS','H':'CAPTAIN VARGA, HALCYON (radio)'}
v=['GREENHOUSE NINE - VOICE SCRIPT','','How this works: record or generate a voice clip for any line below, save it as an audio file (mp3, wav, m4a or ogg) and name the file with the 8-character ID shown in front of that line, for example 3b6b90e4.mp3.',
'Then open the game, go to Settings, and use "Import voice recordings" to pick the files. A recording you import replaces the built-in one for that line.',
'Recordings are stored in your own browser on that computer. If you clear the browser data or use another computer, import them again.','The ending screen paragraph includes your score, so it always uses the computer voice.','']
for sp in ['N','R','L','C','G','H']:
    v.append('=== '+names[sp]+' ===')
    for k,t in lines:
        if k==sp:v.append(lid(t)+'  '+t)
    v.append('')
open('/home/user/greenhouse-nine/voice-script.txt','w').write('\n'.join(v))
need=[(lid(t),k,t) for k,t in lines if not os.path.exists(f'vo/out/{lid(t)}.mp3')]
print(len(lines),'lines in game,',len(need),'need recording:',sum(len(t) for _,_,t in need),'characters')
for x in need:print(' ',x[0],x[1],x[2][:70])
json.dump([[a,b,c] for a,b,c in need],open('vo/need.json','w'))
