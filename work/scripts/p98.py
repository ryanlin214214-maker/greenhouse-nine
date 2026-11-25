import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)
# ---- v90: the Sky Garden on terrace one. A lift (E) between the outer deck by Hangar H3 and the terrace top (y 112);
# up there the walker is kept inside the railed sector (r 622-854, 0.2 rad either side of t = pi/2).
SKY = r"""
const MSKY={TC:Math.PI/2,HA:.19,R0:700,R1:836.5,Y:112,LA:.065,circ:[],cols:[-.131,0,.131]};
function meriSky(Q,R){const OX=HC.x,OZ=HC.z-1100,K=MSKY;let lx=Q.x-OX,lz=Q.z-OZ,r=Math.hypot(lx,lz),a=Math.atan2(lx,lz)-K.TC;a=Math.atan2(Math.sin(a),Math.cos(a));
  r=Math.max(K.R0+R,Math.min(K.R1-R,r));const am=K.HA-R/r;a=Math.max(-am,Math.min(am,a));
  for(const c of K.cols){const dr=r-824,dt=(a-c)*r,h=7.7+R;if(Math.abs(dr)<h&&Math.abs(dt)<h){if(h-Math.abs(dr)<h-Math.abs(dt))r=824+Math.sign(dr||1)*h;else a=c+Math.sign(dt||1)*h/r}}
  let x=Math.sin(K.TC+a)*r,z=Math.cos(K.TC+a)*r;for(const[cx,cz,cr]of K.circ){let dx=x-cx,dz=z-cz,d=Math.hypot(dx,dz);const m=cr+R;if(d<1e-6){dx=1;d=1}if(d<m){x=cx+dx/d*m;z=cz+dz/d*m}}
  Q.x=OX+x;Q.z=OZ+z;if(Q.y<K.Y-.5){Q.y=K.Y;if(Q===pos)vy=0}}
function meriLift(q){const K=MSKY,t=K.TC+K.LA;if(q.up){const r=822;pos.set(HC.x+Math.sin(t)*r,K.Y,HC.z-1100+Math.cos(t)*r);yaw=t-.25}else{const r=882;pos.set(HC.x+Math.sin(t)*r,0,HC.z-1100+Math.cos(t)*r);yaw=t+Math.PI}
  vy=0;pitch=0;eye.set(pos.x,pos.y+EYE,pos.z);hubPromptOff();if(typeof fadeSet==='function'){fadeSet(1);fade(0,.7)}say(q.up?'Sky Garden · terrace one':'Outer deck',2);sfx&&sfx('warp')}
"""
a = "function hubUse(){"
i = s.index(a); s = s[:i] + SKY.lstrip('\n') + s[i:]
rep("function hubUse(){const q=HUB.near;if(!q)return;", "function hubUse(){const q=HUB.near;if(!q)return;if(q.k==='lift'){meriLift(q);return}")
rep("function meriPush(Q,R){if(!HUB.mer)return;", "function meriPush(Q,R){if(!HUB.mer)return;if(Q.y>100){meriSky(Q,R);return}")
rep("let nr=null,bd=1e9;for(const q of HUB.pts){const d=Math.hypot(pos.x-q.x,pos.z-q.z);",
    "let nr=null,bd=1e9;for(const q of HUB.pts){if(q.y!=null&&Math.abs(pos.y-q.y)>6)continue;const d=Math.hypot(pos.x-q.x,pos.z-q.z);")
rep("function hubZone(){const lx=pos.x-HC.x,lz=pos.z-(HC.z-1100);", "function hubZone(){const lx=pos.x-HC.x,lz=pos.z-(HC.z-1100);if(pos.y>100)return'sky';")
rep("const HZOBJ={", "const HZOBJ={sky:'MERIDIAN · SKY GARDEN · TERRACE ONE · THE LIFT (E) GOES BACK DOWN',")
rep("ring:'MERIDIAN · OUTER DECK · TRANSIT PYLONS (E) RIDE THE RING',", "ring:'MERIDIAN · OUTER DECK · TRANSIT PYLONS (E) RIDE THE RING · THE SKY GARDEN LIFT IS BY HANGAR H3',")
open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))
