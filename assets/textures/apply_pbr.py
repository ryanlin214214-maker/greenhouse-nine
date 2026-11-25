# photo PBR detail (CC0 Poly Haven / ambientCG): surface detail under the existing paint, never replacing painted markings
import sys, base64, json
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
import os
O = os.path.dirname(os.path.abspath(__file__)) + '/'
s = open(src, encoding='utf-8').read()

def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)

D = {}; M = {}
for k in ['hfloor', 'plates', 'diamond']:
    for t in ['c', 'n', 'orm']:
        D[k + '_' + t] = 'data:image/jpeg;base64,' + base64.b64encode(open(O + k + '_' + t + '.jpg', 'rb').read()).decode()
    c = Image.open(O + k + '_c.jpg').convert('RGB').resize((1, 1), Image.BOX).getpixel((0, 0))
    o = Image.open(O + k + '_orm.jpg').convert('RGB').resize((1, 1), Image.BOX).getpixel((0, 0))
    M[k] = [c[0] / 255, c[1] / 255, c[2] / 255, o[1] / 255, o[2] / 255]

MOD = r'''
// PBR: CC0 photo surface maps (Poly Haven hangar concrete, ambientCG metal plates and diamond plate), loaded in the background.
// They add surface detail under the existing paint: a roughness/metalness map always, a normal map only where the material has
// none of its own (painted panel seams stay), and the photo colour only when asked (o.photo) with the average kept the same.
const PBR=(()=>{const D=%s,MN=%s,L=new T.TextureLoader(),C={},R={want:0,got:0,mats:0};
  const tex=(k,rep,srgb)=>{const key=k+'|'+rep;if(C[key])return C[key];const t=L.load(D[k],()=>{R.got++});R.want++;t.wrapS=t.wrapT=T.RepeatWrapping;
    t.repeat.set(rep,rep);t.anisotropy=ANISO;if(srgb)t.colorSpace=T.SRGBColorSpace;return C[key]=t};
  const l=v=>Math.pow(Math.max(.03,v),2.2);
  // o: rep (photo repeats per UV unit), ns (normal strength), photo (use the photo colour, mean-matched), forceN (replace an existing normal map)
  function use(m,k,o){if(lowFx||!m||!m.isMeshStandardMaterial)return m;o=o||{};const mn=MN[k];
    if(o.photo&&!m.map){const f=[0,1,2].map(i=>Math.min(4,1/l(mn[i])));m.color.setRGB(m.color.r*f[0],m.color.g*f[1],m.color.b*f[2]);m.map=tex(k+'_c',o.rep,true)}
    if(!m.normalMap||o.forceN){m.normalMap=tex(k+'_n',o.rep,false);m.normalScale.set(o.ns||1,o.ns||1)}
    const orm=tex(k+'_orm',o.rep,false);m.roughnessMap=orm;m.roughness=Math.min(1,m.roughness/Math.max(.1,mn[3]));
    if(mn[4]>.1){m.metalnessMap=orm;m.metalness=Math.min(1,m.metalness/mn[4])}
    m.needsUpdate=true;R.mats++;return m}
  return{use,ready:()=>R.want>0&&R.got>=R.want,count:()=>[R.got,R.want,R.mats]}})();
// a unit box whose UVs are scaled to real size (k metres per repeat), for meshes scaled from GEO.box that carry photo maps
const UVB={};function uvBox(w,h,d,k){const key=[w,h,d,k].map(v=>(+v).toFixed(2)).join();if(UVB[key])return UVB[key];const g=new T.BoxGeometry(1,1,1),uv=g.attributes.uv,s=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]];
  for(let f=0;f<6;f++)for(let i=0;i<4;i++){const q=f*4+i;uv.setXY(q,uv.getX(q)*s[f][0]/k,uv.getY(q)*s[f][1]/k)}return UVB[key]=g}
''' % (json.dumps(D), json.dumps(M))
rep("const ANISO=renderer.capabilities.getMaxAnisotropy();", "const ANISO=renderer.capabilities.getMaxAnisotropy();" + MOD)

# rooms: every floor gets the concrete surface under its paint; walls and decks get the metal-plate surface (box UVs are 2 m per unit)
rep("'HANGAR':tileMat('#191c1e','#24292c','rgba(200,70,60,.55)','')};",
    "'HANGAR':tileMat('#191c1e','#24292c','rgba(200,70,60,.55)','')};for(const k in FL)PBR.use(FL[k],k.includes('SPINE')?'diamond':'hfloor',{rep:k.includes('SPINE')?1.4:.9,ns:1.1});"
    "for(const m of[MAT.wallD,MAT.deck,MAT.plate,MAT.plateD])PBR.use(m,'plates',{rep:1,ns:.55});")

# robots (and suit armour panels): their own painted normals stay, the photo adds roughness and metal breakup; joints too
rep("const o=std({color:c,map:pt,normalMap:pn,roughness:r,metalness:m});o.envMapIntensity=.32;return o}),",
    "const o=std({color:c,map:pt,normalMap:pn,roughness:r,metalness:m});o.envMapIntensity=.32;return PBR.use(o,'plates',{rep:1.3})}),")
rep("CHM.joint.envMapIntensity=.32;return CHM}", "CHM.joint.envMapIntensity=.32;PBR.use(CHM.joint,'plates',{rep:2.2});return CHM}")

# the Kestrel and every ship built from the same kit (Meridian's exterior clones this hull material)
rep("SHM={hull:std({map:hullT,normalMap:hullN,roughness:.38,metalness:.35}),",
    "SHM={hull:PBR.use(std({map:hullT,normalMap:hullN,roughness:.38,metalness:.35}),'plates',{rep:.6}),")

# Meridian hub: walls, floor and trim get photo surfaces at real scale
rep("iv=std({color:0xb9b1a0,roughness:.6,metalness:.1}),iv2=std({color:0x9c9483,roughness:.65,metalness:.1}),gd=std({color:0xc9a24a,roughness:.3,metalness:.85}),st=std({color:0xa8a192,roughness:.55,metalness:.05}),",
    "iv=PBR.use(std({color:0xb9b1a0,roughness:.6,metalness:.1}),'plates',{rep:1,ns:.45}),iv2=PBR.use(std({color:0x9c9483,roughness:.65,metalness:.1}),'plates',{rep:1,ns:.6}),"
    "gd=PBR.use(std({color:0xc9a24a,roughness:.3,metalness:.85}),'plates',{rep:1,ns:.3}),st=PBR.use(std({color:0xa8a192,roughness:.55,metalness:.05}),'hfloor',{rep:1,ns:1.1}),")
rep("M=(geo,m,sx,sy,sz,x,y,z,ry=0)=>{const o=mesh(geo,m,sx,sy,sz,X+x,y,Z+z);",
    "M=(geo,m,sx,sy,sz,x,y,z,ry=0)=>{if(geo===GEO.box&&(m===iv||m===iv2||m===st||m===gd))geo=uvBox(sx,sy,sz,3);const o=mesh(geo,m,sx,sy,sz,X+x,y,Z+z);")

open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))
