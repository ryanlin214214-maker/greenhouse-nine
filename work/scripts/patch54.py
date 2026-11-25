p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
# new speaker: Fleet Command (the radio voice)
rep("const WHO={R:['ROWAN ADEYEMI · DECK BOTANIST',''],","const WHO={C:['FLEET COMMAND · EUROPA ORBITAL','cmd'],R:['ROWAN ADEYEMI · DECK BOTANIST',''],")
rep(".comms.ai{border-left-color:var(--lance)}",".comms.cmd{border-left-color:#6fd8ff}\n.comms.cmd b{color:#6fd8ff}\n.comms.ai{border-left-color:var(--lance)}")
rep("P={N:[0,.95,.92],R:[1,1.08,1.03],L:[2,.55,.85],G:[0,.7,.95]}[k]||[0,1,1]","P={N:[0,.95,.92],R:[1,1.08,1.03],L:[2,.55,.85],G:[0,.7,.95],C:[3,.8,1.04]}[k]||[0,1,1]")
rep('    <label for="vpG">Recovered logs <select id="vpG"></select></label>','    <label for="vpC">Fleet Command (radio) <select id="vpC"></select></label>\n    <label for="vpG">Recovered logs <select id="vpG"></select></label>')
rep("G:'Log 2010. Seed vault inventory, sealed.'};","G:'Log 2010. Seed vault inventory, sealed.',C:'Thalassa, this is Fleet Command. Glad to hear you are alive.'};")
rep("function voicePickBuild(){for(const k of['N','R','L','G']){","function voicePickBuild(){for(const k of['N','R','L','G','C']){")
# radio beat in stage 1 (after a few kills) and the shuttle thread through the stages
rep("""  end:[['R',"Commons is clear. They're printing those frames in the foundry, aft, in engineering. Follow the marker."],['R',"Stay close. I'll watch your back."]]},""","""  radio:[{k:5,lines:[['C',"Thalassa, this is Fleet Command, Europa Orbital. We have your beacon. We are glad to hear anyone survived the Wellmonger's invasion."],
    ['C',"Our read: the Wellmonger, the Dark's general, hit Mars, Ceres and Thalassa in the same hour. Every machine aboard your station is turned."],
    ['C',"Regroup at Meridian Station, in orbit over Europa. Take the shuttle from Hangar Two. Clear your decks first, then launch."]]}],
  end:[['R',"Commons is clear. They're printing those frames in the foundry, aft, in engineering. Follow the marker."],['R',"Stay close. I'll watch your back."]]},""")
rep("""  end:[['R',"Hangar's ours. The skiffs still fly."],['L',"Come forward, soldier. Come and hear the song properly."],['R',"That's Lattice, calling from the bridge. We go forward, through the farms."]]},""","""  end:[['R',"Hangar's ours. There's the shuttle, fueled and intact."],['C',"Good. But the Wellmonger's signal still runs through Lattice on your bridge. Cut it before you launch."],['L',"Come forward, soldier. Come and hear the song properly."]]},""")
rep("The skiff in the hangar still flies. You and I are getting off this rock, soldier. Europa needs us.","The shuttle in the hangar is fueled. You and I are getting off this rock, soldier. Europa needs us.")
rep("Rowan has the seed case and a skiff is waiting in the hangar.","Rowan has the seed case and the shuttle is waiting in the hangar for the flight to Meridian Station.")
rep("bossT:C?75:22,C,rooms:C?C.rooms:null,tut:0,tt:0};","bossT:C?75:22,C,rooms:C?C.rooms:null,tut:0,tt:0,rd:0};")
rep("  if(wave===1&&C&&!ROW.on&&ROW.arrive<=0&&m.n0-n>=3)ROW.arrive=1.5;","  if(wave===1&&C&&!ROW.on&&ROW.arrive<=0&&m.n0-n>=3)ROW.arrive=1.5;\n  if(C&&C.radio&&m.rd<C.radio.length&&m.n0-n>=C.radio[m.rd].k){for(const[k,t]of C.radio[m.rd].lines)comm(k,t);m.rd++}")
open(p,'w').write(s);print('ok')
