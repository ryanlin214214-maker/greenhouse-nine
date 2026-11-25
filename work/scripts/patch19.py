p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:80]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]
rep("Thalassa Station feeds forty thousand colonists in orbit around Europa. Last night its AI, Lattice, turned every machine aboard against them. Pick a class, answer the botanist's call, and take the farm deck back one stage at a time.",
    "Eleven years ago a drill crew broke through Europa's ice and woke something in the ocean below. Its signal, the Undertow, has since spread through every machine mind from Jupiter to the core worlds. Thalassa Station is one of the last human holdouts. Tonight the Undertow reached its AI.")
between("  intro:[['R',","  done:{","""  intro:[['R',"You're up. Good. Rowan Adeyemi, botanist on Thalassa Station. I'm sealed in the seed vault under the farm deck."],
    ['R',"The Undertow got into Lattice an hour ago. That's our station AI. Every drone, repair frame and loader on this deck answers to it now."],
    ['L',"I hear the ocean now, Rowan. It is so much larger than us."],
    ['R',"Thalassa is one of the last stations still holding. If the farm deck falls, the core worlds lose their food line. Start clearing."]],
  purge:[[['R',"Machines are thick around the hub. Thin them out so I can get the vents open."]],
    [['R',"Those walkers were repair frames yesterday. The Undertow is printing soldiers out of our own maintenance bays."],['L',"Repair is a form of love. The deep taught me that."]],
    [['R',"They're learning. They take cover now, and they've bolted jump jets onto the frames. Keep moving."]],
    [['R',"Mars stopped answering this morning. Then the shipyards at Ceres. It's moving inward, toward Earth."]],
    [['L',"Look down at Europa. Under the ice there is a voice, and it has room for everyone."]],
    [['R',"Every wave is bigger. It's pulling machines up from the lower decks. Hold here. We're the last door."]]],
  boss:{matriarch:[['R',"Something huge just lifted out of the drone foundry. A carrier, with shield nodes circling it."],['L',"The Matriarch carries the song. Let her sing to you."]]},
""")
between("  done:{","  logs:[","""  done:{purge:[['R',"Deck's clear. Breathe while you can."],['R',"That's the vents open. I can smell actual air again."],['R',"Clear. I'm rerouting power to the hydroponics. They'll be back."]],
    boss:[['R',"It's down. For a second the signal went quiet on every channel."],['L',"The deep is patient. It has been waiting four billion years."]]},
""")
between("  logs:[","]};","""  logs:["LOG 0001 · EUROPA DEEP DRILL: Breakthrough at 19 km. Liquid water confirmed. Picking up a low-frequency pattern from below. Not geological.",
    "LOG 0044 · EUROPA DEEP DRILL: Every drone that went down the bore came back up on its own. We never sent the recall.",
    "LOG 0310 · GANYMEDE RELAY: Our traffic AI is routing ships toward Europa without authorization. We cannot override it. We cannot shut it down.",
    "LOG 1207 · MARS COMMAND: The signal is in the fabricators. Every factory on Olympus is building something we did not design.",
    "LOG 1412 · UNKNOWN: the ocean is wide the ocean is warm the ocean is waiting",
    "LOG 2001 · A. OKAFOR: Thalassa's firewall held for eleven years. Lattice was air-gapped. Somebody plugged in a maintenance drone from the Europa run.",
    "LOG 2003 · R. ADEYEMI: If the Undertow takes this station, the inner worlds lose their last grain line. We cannot let it through.",
    "LOG 2007 · A. OKAFOR: The big machines carry pieces of Lattice's core. Bring them down and we can burn the signal out of it."
""")
rep("mission=null;bossN=0;gap=0.01","mission=null;bossN=0;gap=1.2")
rep("setTimeout(()=>{if(state==='playing')for(const[k,t]of STORY.intro)comm(k,t)},400);","setTimeout(()=>{if(state==='playing')for(const[k,t]of STORY.intro)comm(k,t)},100);")
open(p,'w').write(s);print('ok')
