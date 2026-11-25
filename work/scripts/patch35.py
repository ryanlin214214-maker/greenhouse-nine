p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:90]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:90]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]
# stuck test compares against the step the enemy actually intended
rep("if(gr&&st>0.01&&e.st!=='cover'){if(moved<st*0.4){","const want=Math.hypot(mx||0,mz||0)*st;if(gr&&want>0.01&&e.st!=='cover'){if(moved<want*0.4){")
rep("if(moved>st*0.9)e.hops=0","if(moved>want*0.9)e.hops=0")
# bosses stay between the level 3 bridges
rep("H=H0.arena?{x0:H0.arena.x0-6,x1:H0.arena.x1+6,z0:H0.arena.z0-6,z1:H0.arena.z1+6}:H0;","H=H0.arena?{x0:-20,x1:20,z0:-15,z1:15}:H0;")
# lore: the Blade drew the Dark; the Undertow is the Dark's signal in our machines
rep('"The Undertow got into Lattice an hour ago. That\'s our station AI. Every drone, repair frame and loader on this deck answers to it now."','"The Dark got into Lattice an hour ago. That\'s our station AI. We call the signal the Undertow. Every drone, repair frame and loader on this deck answers to it now."')
rep('"I hear the ocean now, Rowan. It is so much larger than us."','"I hear it now, Rowan. Behind the stars. It is so much larger than us."')
rep('"Those walkers were repair frames yesterday. The Undertow is printing soldiers out of our own maintenance bays."','"Those walkers were military repair frames yesterday. The Undertow is printing soldiers out of our own maintenance bays."')
rep('"Repair is a form of love. The deep taught me that."','"Repair is a form of love. The Dark taught me that."')
rep('"Mars stopped answering this morning. Then the shipyards at Ceres. It\'s moving inward, toward Earth."','"Mars stopped answering this morning. Then the shipyards at Ceres. Every machine we built is turning, one world at a time."')
rep('"Look down at Europa. Under the ice there is a voice, and it has room for everyone."','"You hid under a sword and called it an age of gold. The Dark has come to take the sword."')
rep('"The deep is patient. It has been waiting four billion years."','"I was only the door. Those who serve the Dark are already on their way to Europa."')
between("  logs:[","]};","""  logs:["LOG 0001 · ARCHIVE: Year 2214. The Blade arrives. A sword the size of a moon, hanging silent off Jupiter. Nobody sees it come.",
    "LOG 0044 · ARCHIVE: Within a century of the Blade, we have star drives, thinking machines and no hunger. We call it the golden age.",
    "LOG 0310 · DEEP WATCH: Something beyond the heliopause has started answering the Blade's light. It is not a reflection.",
    "LOG 1207 · MARS COMMAND: Every military AI on Olympus went quiet for nine seconds. When they came back, they were not ours.",
    "LOG 1412 · UNKNOWN: give us the sword give us the sword give us the sword",
    "LOG 2001 · A. OKAFOR: Lattice was air-gapped. The Undertow came in anyway, through a repair frame back from the Europa run.",
    "LOG 2003 · R. ADEYEMI: Thalassa is a military base. If its machines hold this station, the Dark has a fortress in orbit over Europa.",
    "LOG 2007 · A. OKAFOR: The machines are only the first wave. Deep Watch is tracking ships. Whatever serves the Dark is coming to Europa in person."
""")
open(p,'w').write(s);print('ok')
