# v93 E2: imported maps (GLB). glbmap.js (loader, collision from named meshes, spawns, lamps, world swap), a Missions
# entry "Test maps · Imported room", and the test room inlined (it is also published as maps/test_room.glb).
import sys,base64
s=open(sys.argv[1]).read()
def R(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:90]);s=s.replace(a,b)
K="function cmdSpawn(list){for(const[type,x,z,t]of list)queue.push({t:t||0,type,x,z,y:type>=5?1.5:6})}"
R(K,K+"\n"+open('glbmap.js').read())
R("function reset(){try{cmdLeave()}catch(e){}","function reset(){try{cmdLeave()}catch(e){}try{glbLeave()}catch(e){}")
R("function hubEnter(){try{cmdLeave()}catch(e){}","function hubEnter(){try{cmdLeave()}catch(e){}try{glbLeave()}catch(e){}")
R("if(m===4||m===5){l3StartAt(m,s);return}","if(m===4||m===5){l3StartAt(m,s);return}if(m===9){glbStart('test_room.glb').catch(()=>{});return}")
R("$('wave').textContent=typeof CMD!=='undefined'&&CMD.on?'3-2':Math.max(wave,1);","$('wave').textContent=typeof CMD!=='undefined'&&CMD.on?'3-2':typeof GLBM!=='undefined'&&GLBM.on?'MAP':Math.max(wave,1);")
R("ready:true}]},{n:'Mission 4 · Europa',st:[{m:5,s:1,l:'4-1',t:'Crash Landing',d:'Dead engines · retro thrusters · the ice',ready:true}]}];",
  "ready:true}]},{n:'Mission 4 · Europa',st:[{m:5,s:1,l:'4-1',t:'Crash Landing',d:'Dead engines · retro thrusters · the ice',ready:true}]},{n:'Test maps',st:[{m:9,s:1,l:'T-1',t:'Imported room',d:'A GLB room and corridor built to the Blender conventions · three robots',ready:true}]}];")
b64=base64.b64encode(open('test_room.glb','rb').read()).decode()
R('<script type="text/plain" id="latbin">','<script type="text/plain" id="glb-test_room_glb">'+b64+'</script>\n<script type="text/plain" id="latbin">')
open(sys.argv[2],'w').write(s);print('p104 ok')
