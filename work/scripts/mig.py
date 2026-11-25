import sys,re
src,dst=sys.argv[1],sys.argv[2]
s=open(src).read()
def rep(a,b,c=1):
  global s
  assert s.count(a)==c,(s.count(a),a[:100]); s=s.replace(a,b)
b=open('eng/three-bundle.js').read()
tags=['<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"']+['<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/'+x+'"' for x in ['shaders/CopyShader.js','shaders/LuminosityHighPassShader.js','postprocessing/EffectComposer.js','postprocessing/RenderPass.js','postprocessing/ShaderPass.js','postprocessing/UnrealBloomPass.js']]
first=True
for t in tags:
  i=s.index(t);j=s.index('</script>',i)+len('</script>')
  s=s[:i]+('<script>/* three.js 0.187.0 with its post-processing and loader add-ons, bundled. MIT License, Copyright 2010-2025 three.js authors */\n'+b+'\n</script>' if first else '')+s[j:];first=False
rep("const T=window.THREE;","const T=window.THREE;T.ColorManagement.enabled=false;const LI=Math.PI; // colour values are linearised by hand (lin); light intensities are scaled to the physical units of current three.js")
rep("renderer.outputEncoding=T.sRGBEncoding;","renderer.outputColorSpace=T.SRGBColorSpace;")
rep("if(srgb)t.encoding=T.sRGBEncoding;","if(srgb)t.colorSpace=T.SRGBColorSpace;")
rep("const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;","const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;")
rep("const hemi=new T.HemisphereLight(0xdce8f0,0x8a9498,1.15);","const hemi=new T.HemisphereLight(0xdce8f0,0x8a9498,1.15*LH);")
rep("hemi.intensity+=(m.hi-hemi.intensity)*a;","hemi.intensity+=(m.hi*LH-hemi.intensity)*a;")
rep("q.L.intensity=q.f?q.f.i*q.k:0}}","q.L.intensity=q.f?q.f.i*q.k*LP:0}}")
rep("const sun=new T.DirectionalLight(0xffd9a8,1.1);","const sun=new T.DirectionalLight(0xffd9a8,1.1*LI);")
rep("const L=new T.PointLight(c,i,d,2);","const L=new T.PointLight(c,i*LP,d,2);")
rep("mfl.intensity=beam.visible?0.8:0;","mfl.intensity=beam.visible?0.8*LI:0;")
i=s.index("if(!lowFx&&T.EffectComposer&&T.UnrealBloomPass&&T.ShaderPass&&T.CopyShader){try{");j=s.index("composer=c}catch(e){composer=null}}",i)+len("composer=c}catch(e){composer=null}}")
s=s[:i]+"if(!lowFx&&T.EffectComposer&&T.UnrealBloomPass&&T.OutputPass){try{\n  const z=renderer.getDrawingBufferSize(new T.Vector2()),rt=new T.WebGLRenderTarget(z.x,z.y,{type:T.HalfFloatType,samples:4});\n  const c=new T.EffectComposer(renderer,rt);c.addPass(new T.RenderPass(scene,cam));c.addPass(new T.UnrealBloomPass(new T.Vector2(z.x,z.y),BLOOM[0],BLOOM[1],BLOOM[2]));c.addPass(new T.OutputPass());composer=c}catch(e){composer=null}}"+s[j:]
rep("const T=window.THREE;","const BLOOM=[0.32,0.5,0.88];const T=window.THREE;")
rep("if(composer){const z=renderer.getDrawingBufferSize(new T.Vector2());composer.setSize(z.x,z.y)}","if(composer){const z=renderer.getSize(new T.Vector2());composer.setSize(z.x,z.y)}")
rep('renderer.shadowMap.type=T.PCFSoftShadowMap;','renderer.shadowMap.type=T.PCFShadowMap;')
EXPO=sys.argv[3] if len(sys.argv)>3 else '1.12'
LPV=sys.argv[4] if len(sys.argv)>4 else '3.1416'
TMV=sys.argv[5] if len(sys.argv)>5 else 'ACESFilmicToneMapping'
HV=sys.argv[6] if len(sys.argv)>6 else '3.1416'
rep('renderer.toneMapping=T.ACESFilmicToneMapping;','renderer.toneMapping=T.'+TMV+';')
rep('const LI=Math.PI;','const LI=Math.PI,LP='+LPV+';')
rep('const LI=Math.PI,LP=','const LH='+HV+',LI=Math.PI,LP=')
rep('renderer.toneMappingExposure=1.12;','renderer.toneMappingExposure='+EXPO+';')
ENV=sys.argv[7] if len(sys.argv)>7 else '1'
rep('scene.environment=pm.fromScene(es,0,1,10000).texture;','scene.environment=pm.fromScene(es,0,1,10000).texture;scene.environmentIntensity='+ENV+';')
GUNENV=sys.argv[8] if len(sys.argv)>8 else '.2'
rep('m.roughness=Math.min(.75,m.roughness+.15);m.envMapIntensity=.2;','m.roughness=Math.min(.75,m.roughness+.15);m.envMapIntensity='+GUNENV+';')
rep('m.roughness=.55;m.envMapIntensity=.18;return m})()','m.roughness=.55;m.envMapIntensity='+GUNENV+';return m})()')
rep("vec4 t=texture2D(map,p);gl_FragColor=vec4(vCol.rgb*t.rgb,vCol.a*t.a);}","vec4 t=texture2D(map,p);gl_FragColor=vec4(pow(vCol.rgb*t.rgb,vec3(2.2)),vCol.a*t.a);}")
rep("gl_FragColor=vec4(vec3(0.7,0.75,0.8)*f*0.35,1.0);","gl_FragColor=vec4(pow(vec3(0.7,0.75,0.8)*f*0.35,vec3(2.2)),1.0);")
open(dst,'w').write(s);print('ok',len(s))
