# v93 G3: 3-3's real Nova strike, blast wave and regroup; 4-1 a guided approach and landing at the Thule Relay; 4-2 the
# first Europa ground map (lvl3f.js). Missions list and saves follow.
import sys
s=open(sys.argv[1]).read()
def R(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:100]);s=s.replace(a,b)
s=s.replace("function l3Clear(S){",open('lvl3f.js').read()+"\nfunction l3Clear(S){",1)
R("function l3Tick33(S,dt){const D=S.dr;","function l3Tick33(S,dt){const D=S.dr;l33Tick(S,dt);")
R("if(S.ct<=0){S.ph='boom';S.bt=0;S.bq=0}","if(S.ct<=0){S.ph='shield';S.st2=0}")
R("if(S.bt>7){S.ph='tail';","if(S.bt>7&&S.ph==='boom'){S.ph='blast';S.bw={c:D.g.position.clone(),r:500,g:(()=>{const m=new T.Mesh(new T.SphereGeometry(1,40,20),new T.MeshBasicMaterial({color:0xffc890,transparent:true,opacity:.35,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,fog:false}));m.position.copy(D.g.position);scene.add(m);return m})()};comm('C',\"Blast wave! All ships, burn away from the core!\")}if(0){S.ph='tail';")
R("if(S&&S.nukeArm&&l3Nuke(S))return;","if(S&&S.n2Ready&&!(S.n2Arm>0)&&S.ph==='nova2'){S.n2Arm=3;say('NOVA ARMING',1.5);tone('sawtooth',200,600,.5,.06);return}if(S&&S.nukeArm&&l3Nuke(S))return;")
# 4-1: the approach replaces the fall
a=s.find("if(st===41){eurBuild();");b=s.find("return}}",a)+7
assert a>0 and b>a; s=s[:a]+"if(st===41){eurApproachStart(S);return}}"+s[b+1:]
R("if(S.stage===41)return l3Fall(S,dt);","if(S.stage===41)return eurApproach(S,dt);")
# cards, next stages, the Missions list
R("const k={31:1,32:2,33:3,41:4}[st];saveM3(k);cr(st===41?500:300);","const k={31:1,32:2,33:3,41:4,42:5}[st];saveM3(k);cr(st===41||st===42?500:300);if(st===42)try{eurMapLeave()}catch(e){}")
R("33:['Stage 3-3 complete',\"The command ship is gone. So is the Kestrel's engine: the second ace, Sable, caught you over Europa. Next: Level 4, Europa.\"],",
  "33:['Stage 3-3 complete',\"The second Nova went into the command ship's open heart and the Wellmonger's flagship is gone. Vesper went down covering you, and Sable's missile took an engine. Next: Level 4, the approach to Europa.\"],")
R("41:['Level 4 · Europa',\"The Kestrel is down on the ice of Europa, broken but in one piece, and Rowan is alive. Somewhere under this ice is Imani, and the Dark is coming down after you. To be continued.\"]}[st];",
  "41:['Stage 4-1 complete',\"Down on Pad 1 at the Thule Relay, on one engine and a prayer. Next: stage 4-2, reach the relay and light its beacon.\"],42:['Level 4 · The Thule Relay',\"The beacon is lit and Fleet Command has your position. Somewhere under this ice is Imani, and the Dark is coming down after you. To be continued.\"]}[st];")
R("L3NEXT=st===31?[4,2]:st===32?[4,3]:st===33?[5,1]:'menu';$('go').textContent=st===31?'Continue to stage 3-2':st===32?'Continue to stage 3-3':st===33?'Continue to Level 4':'Back to the title';",
  "L3NEXT=st===31?[4,2]:st===32?[4,3]:st===33?[5,1]:st===41?[5,2]:'menu';$('go').textContent=st===31?'Continue to stage 3-2':st===32?'Continue to stage 3-3':st===33?'Continue to Level 4':st===41?'Continue to stage 4-2':'Back to the title';")
R("$('retry').hidden=false;$('retry').textContent='Retry stage '+L3N[st];LAST={m:st===41?5:4,s:st===41?1:k};","$('retry').hidden=false;$('retry').textContent='Retry stage '+(L3N[st]||'4-2');LAST={m:st>=41?5:4,s:st===41?1:st===42?2:k};")
R("if(m===5){flyStart(41);return}","if(m===5){if(s===2){eurStart();return}flyStart(41);return}")
R("{m:5,s:1,l:'4-1',t:'Crash Landing',d:'Dead engines · retro thrusters · the ice',ready:true}","{m:5,s:1,l:'4-1',t:'Approach and Landing',d:'One engine · the corridor rings · Pad 1 at the Thule Relay',ready:true},{m:5,s:2,l:'4-2',t:'The Thule Relay',d:'On foot on Europa · the courtyard fight · light the beacon',ready:true}")
R("{m:4,s:1,l:'3-1',t:'First Strike',","{m:4,s:1,l:'3-1',t:'The Battle of Europa Orbit',")
# per frame, and leaving the Europa map
R("try{cdxTick(dt)}catch(e){}try{cmdTick(dt)}catch(e){","try{cdxTick(dt)}catch(e){}try{eurTick(dt)}catch(e){console.error(e)}try{cmdTick(dt)}catch(e){")
R("function reset(){try{cmdLeave()}catch(e){}","function reset(){try{cmdLeave()}catch(e){}try{eurMapLeave()}catch(e){}")
R("function hubEnter(){try{cmdLeave()}catch(e){}","function hubEnter(){try{cmdLeave()}catch(e){}try{eurMapLeave()}catch(e){}")
# missions list: the Meridian hub is labelled HUB (it read 3-1, like the battle), and 4-2 ticks only once its beacon is lit (save step 5)
R("{m:3,s:1,t:'The Concourse',","{m:3,s:1,l:'HUB',t:'The Concourse',")
R("S.m>=4?M3>=(S.m===5?4:S.s):","S.m>=4?M3>=(S.m===5?(S.s===2?5:4):S.s):")
# the stage label reads 4-2 on Europa
R("typeof GLBM!=='undefined'&&GLBM.on?'MAP':Math.max(wave,1);","typeof GLBM!=='undefined'&&GLBM.on?'MAP':typeof EUW!=='undefined'&&EUW.on?'4-2':Math.max(wave,1);")
# M3 saves now run to 5 (4-2); Continue offers the next stage
R("function contM3(){return M3>0&&M3<4}","function contM3(){return M3>0&&M3<5}")
open(sys.argv[2],'w').write(s);print('p108 ok')
