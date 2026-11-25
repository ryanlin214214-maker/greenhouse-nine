import sys
s=open(sys.argv[1]).read();a="function flyCam(dt){const S=FLY,"
assert s.count(a)==1
s=s.replace(a,"function flyCam(dt){if(window.__camOvF){const c=window.__camOvF;cam.position.copy(c[0]);cam.position.y+=40;cam.position.addScaledVector(c[0].clone().sub(c[1]).setY(0).normalize(),70);cam.lookAt(c[1].clone().lerp(c[0],.5));cam.updateMatrixWorld();return}const S=FLY,")
open(sys.argv[2],'w').write(s)
