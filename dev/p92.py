import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)

# v85 fixes from the review and playtest
# 1) Thalassa's light pools measure floor heights from Thalassa's collision, so only build them while Thalassa is the world
rep("function atmoTick(dt){if(!ATMO.on){if(state!=='playing')return;", "function atmoTick(dt){if(!ATMO.on){if(state!=='playing'||HUB.on||FLY)return;")
# 2) Meridian stays as dark as before the brighter indoor fill (mood A went .6 -> .75)
rep("hemi.intensity+=(m.hi*LH*(FLY?.4:HUB.on?.5:1)-hemi.intensity)*a;", "hemi.intensity+=(m.hi*LH*(FLY?.4:HUB.on?.4:1)-hemi.intensity)*a;")
# 3) glare: the white ceiling light strips in the bright rooms are a soft cool grey-white; lamp glow sprites are smaller and fainter
rep("MAT.stripA=bas({color:0xf2fbff});", "MAT.stripA=bas({color:0xb2c0ca});")
rep("for(const[x,y,z,c,sz,o]of GLOWS){const gl=glow(c,sz,o);", "for(const[x,y,z,c,sz,o]of GLOWS){const gl=glow(c,sz*.8,o*.5);")
# 4) HUD readable on bright backgrounds: a dark plate behind the stats block; the objective band starts a little further right
rep(".hud .row{display:flex;", "#hud{background:rgba(4,10,14,.45);padding:6px 9px 7px;border-radius:4px}\n.hud .row{display:flex;")
rep(".obj{position:absolute;left:350px;", ".obj{position:absolute;left:366px;")
# 5) muzzle flash: each shot's flash has its own size and angle; impacts throw a short spray of hot sparks and a wisp of dust
rep("const mglow=glow(0xdffcff,0.9,0.6);", "const mglow=glow(0xdffcff,0.9,0.6);mglow.material=mglow.material.clone();")
rep("beamMat.color.set(W.col);sparkle(tmp,W.col,W.pierce?4:2,3);mfl.color.set(W.col);",
    "beamMat.color.set(W.col);sparkle(tmp,W.col,W.pierce?4:2,3);mfl.color.set(W.col);mglow.material.rotation=Math.random()*6.283;mglow.scale.setScalar(.7+Math.random()*.55);"
    "if(!hit&&wall<90){sparkle(tmp,0xffe2a0,4,5.5);if(!lowFx&&Math.random()<.5)PFX.smoke(tmp,{n:1,spd:.6,size:[.25,1.1],life:.7,up:.6,drag:2,spread:.15,c0:.4,c1:.6,alpha:.25})}")
open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))
