# usage: python3 tex.py <src.html> <dst.html> <targets comma list: hangar,spine,robots,kestrel>
import sys,base64,json
from PIL import Image
src,dst=sys.argv[1],sys.argv[2];TG=set(sys.argv[3].split(',')) if len(sys.argv)>3 else {'hangar','spine','robots','kestrel'}
import os
O=os.path.dirname(os.path.abspath(__file__))+'/'  # the texture files sit next to this script
s=open(src).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]);s=s.replace(a,b)
D={};M={}
for k in['hfloor','plates','diamond']:
    for t in['c','n','orm']:
        D[k+'_'+t]='data:image/jpeg;base64,'+base64.b64encode(open(O+k+'_'+t+'.jpg','rb').read()).decode()
    c=Image.open(O+k+'_c.jpg').convert('RGB').resize((1,1),Image.BOX).getpixel((0,0))
    o=Image.open(O+k+'_orm.jpg').convert('RGB').resize((1,1),Image.BOX).getpixel((0,0))
    M[k]=[c[0]/255,c[1]/255,c[2]/255,o[1]/255,o[2]/255]
# PBR: photo materials (CC0, Poly Haven and ambientCG). Loads asynchronously and swaps maps into existing materials,
# keeping each material's brightness: the colour factor matches the mean of the painted texture it replaces.
mod=r'''const PBR=(()=>{const D=%s,MN=%s,L=new T.TextureLoader(),C={},R={want:0,got:0};
  const tex=(k,rep,srgb)=>{const key=k+'|'+rep;if(C[key])return C[key];const t=L.load(D[k],()=>{R.got++});R.want++;t.wrapS=t.wrapT=T.RepeatWrapping;
    t.repeat.set(rep,rep);t.anisotropy=ANISO;if(srgb)t.colorSpace=T.SRGBColorSpace;return C[key]=t};
  const mean=(img)=>{try{const c=document.createElement('canvas');c.width=c.height=1;const g=c.getContext('2d');g.drawImage(img,0,0,1,1);const d=g.getImageData(0,0,1,1).data;return[d[0]/255,d[1]/255,d[2]/255]}catch(e){return null}};
  // o: rep (photo repeats per UV unit), keepMap (true: keep the painted colour map, add only surface detail), ns (normal strength), dim (extra colour factor)
  function use(m,k,o){if(lowFx||!m)return m;o=o||{};const mn=MN[k];
    if(!o.keepMap){const old=m.map&&m.map.image?mean(m.map.image):null,f=old?[0,1,2].map(i=>Math.pow(Math.max(.02,old[i])/Math.max(.02,mn[i]),2.2)):[1,1,1];
      const d=o.dim||1;m.color.setRGB(m.color.r*f[0]*d,m.color.g*f[1]*d,m.color.b*f[2]*d);m.map=tex(k+'_c',o.rep,true)}
    m.normalMap=tex(k+'_n',o.rep,false);m.normalScale.set(o.ns||1,o.ns||1);
    const orm=tex(k+'_orm',o.rep,false);m.roughnessMap=orm;m.roughness=Math.min(1,m.roughness/Math.max(.08,mn[3]));
    if(mn[4]>.1){m.metalnessMap=orm;m.metalness=Math.min(1,m.metalness/mn[4])}
    m.needsUpdate=true;return m}
  return{use,ready:()=>R.want>0&&R.got>=R.want,count:()=>[R.got,R.want]}})();
'''%(json.dumps(D),json.dumps(M))
rep("const ANISO=renderer.capabilities.getMaxAnisotropy();","const ANISO=renderer.capabilities.getMaxAnisotropy();\n"+mod)
if 'hangar' in TG or 'spine' in TG:
    a="'ENGINEERING':tileMat('#1b1d1f','#272a2c','rgba(208,112,46,.7)','grate'),'HANGAR':tileMat('#191c1e','#24292c','rgba(200,70,60,.55)','')};"
    b=a
    if 'hangar' in TG:b+="PBR.use(FL['HANGAR'],'hfloor',{rep:.45,ns:1.2});"
    if 'spine' in TG:b+="PBR.use(FL['FORE SPINE'],'diamond',{rep:1.1});PBR.use(FL['AFT SPINE'],'diamond',{rep:1.1});"
    rep(a,b)
if 'robots' in TG:
    rep("const o=std({color:c,map:pt,normalMap:pn,roughness:r,metalness:m});o.envMapIntensity=.32;return o}),",
        "const o=std({color:c,map:pt,normalMap:pn,roughness:r,metalness:m});o.envMapIntensity=.32;return PBR.use(o,'plates',{rep:1.2,keepMap:true,ns:.8})}),")
if 'kestrel' in TG:
    rep("SHM={hull:std({map:hullT,normalMap:hullN,roughness:.38,metalness:.35}),",
        "SHM={hull:PBR.use(std({map:hullT,normalMap:hullN,roughness:.38,metalness:.35}),'plates',{rep:.5,keepMap:true,ns:.7}),")
open(dst,'w').write(s);print('ok',len(s))
