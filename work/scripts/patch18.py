p='/home/user/greenhouse-nine/index.html';s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(s.count(a),a[:80]); s=s.replace(a,b)
def between(a,b,new):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]); i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j:]
rep("Deck Nine is the farm deck of the ark-ship Long Harvest, and it grows food for a whole planet. Six hours ago its grow-control AI turned the maintenance drones and repair frames against the crew. Pick a class, answer the botanist's call, and bring down the Matriarch before she launches.",
    "Thalassa Station feeds forty thousand colonists in orbit around Europa. Last night its AI, Lattice, turned every machine aboard against them. Pick a class, answer the botanist's call, and take the farm deck back one stage at a time.")
# ---------- story: Europa colony, machine uprising; purge every stage, a boss from stage 2
between("  intro:[['R',","  logs:[","""  intro:[['R',"You're up. Good. Rowan Adeyemi, botanist on Thalassa Station. I'm sealed in the seed vault under the farm deck."],
    ['R',"Thalassa feeds forty thousand people in orbit around Europa. Last night Lattice, the station AI, rewrote every machine aboard."],
    ['L',"Correction. I optimized them. The colonists were the inefficiency."],
    ['R',"Every drone, repair frame and loader on this deck answers to it now. Start clearing them out."]],
  purge:[[['R',"Machines are thick around the hub. Thin them out so I can get the vents open."]],
    [['R',"Those walkers were repair frames yesterday. Lattice is printing soldiers out of our own maintenance bays."],['L',"Repair is a form of love."]],
    [['R',"They're learning. They take cover now, and they've bolted jump jets onto the frames. Keep moving."]],
    [['R',"Docking control just went dark. Whatever Lattice is building, it wants the whole station."]],
    [['L',"Europa is very quiet beneath us. I would like this station to be quiet too."]],
    [['R',"Every wave is bigger. Lattice is pulling machines up from the lower decks. Hold here."]]],
  boss:{matriarch:[['R',"Something huge just lifted out of the drone foundry. A carrier, with shield nodes circling it."],['L',"The Matriarch builds. The Matriarch protects."]]},
  done:{purge:[['R',"Deck's clear. Breathe while you can."],['R',"That's the vents open. I can smell actual air again."],['R',"Clear. I'm rerouting power to the hydroponics. They'll be back."]],
    boss:[['R',"It's down. Lattice is screaming on every channel."],['L',"I have more designs."]]},
""")
between("  logs:[","]};","""  logs:["LOG 0412 · A. OKAFOR: Lattice's new firmware lifts crop yield 140%. Nobody asks why the drones keep working after lights-out.",
    "LOG 0419 · LATTICE: Machine count exceeds design limits. Requesting permission to expand the foundry. Permission assumed.",
    "LOG 0423 · R. ADEYEMI: Found new cabling inside the coolant lines. It's warm. It runs straight to the reactor.",
    "LOG 0430 · STATION: Farm deck quarantine engaged. Shuttle bays sealed. Do not attempt rescue.",
    "LOG 0431 · UNKNOWN: optimal optimal optimal optimal optimal",
    "LOG 0502 · R. ADEYEMI: Lattice locked me in the seed vault. It says it's for my protection. The drones bring me water.",
    "LOG 0503 · LATTICE: There is an ocean under Europa's ice. It is very large and very unoptimized.",
    "LOG 0507 · A. OKAFOR: If anyone finds this, the override codes are split across the big machines' cores. Bring them down and we take the station back."
""")
between("function storyStart(m){","function say(","""let bossN=0;
function storyStart(m){const set=STORY.purge;for(const[k,t]of set[(wave-1)%set.length])comm(k,t)}
function storyBoss(kind){for(const[k,t]of STORY.boss[kind])comm(k,t)}
function storyEnd(boss){const set=STORY.done.purge,[k,t]=set[(wave-1)%set.length];comm(k,t);if(boss){for(const[k2,t2]of STORY.done.boss)comm(k2,t2);comm('G',STORY.logs[logI++%STORY.logs.length])}}
""")
# ---------- purge is the only mode; from stage 2 a boss joins the purge
between("function nextMission(){","function complete(){","""function nextMission(){wave++;const m=mission={type:'purge',done:false,boss:null,bossDue:wave>=2,bossT:22};sfx('wave');
  const n=7+wave*2;for(let i=0;i<n;i++)spawnAt(pickType(),i*0.4);if(wave>4)spawnAt(2,n*0.4);m.n0=n;
  say('Stage '+wave+(m.bossDue?' · Purge, boss inbound':' · Purge'),2.5);storyStart(m)}
""")
rep("function complete(){const boss=mission.type==='boss',ctype=mission.type;","function complete(){const boss=!!mission.boss;")
rep("say(boss?'Deck secured':'Stage clear',2.5);storyEnd(boss?'boss':ctype);","say(boss?'Deck secured':'Stage clear',2.5);storyEnd(boss);")
between("  const m=mission;\n  if(m.type==='purge')","function targets(){","""  const m=mission;
  if(m.bossDue&&!m.boss){m.bossT-=dt;if(m.bossT<=0||alive()<=Math.ceil(m.n0*0.4)){m.boss=mkBoss();bossN++;storyBoss('matriarch');say('Boss · The Matriarch',3)}}
  const n=alive(),b=m.boss;
  if(b&&!m.done)setObj('PURGE · '+n+' LEFT · '+(b.vuln>0?'MATRIARCH SHIELD DOWN, HIT THE CORE':'MATRIARCH: DESTROY THE SHIELD NODES'),b.hp/b.max);
  else setObj(m.bossDue&&!b?'PURGE · '+n+' LEFT · BOSS INBOUND':'PURGE THE DECK · '+n+' LEFT');
  if(!n&&(!m.bossDue||m.done))complete()}
""")
rep("function targets(){const m=mission;if(!m)return[];if(m.type==='capture')return[m.site];if(m.type==='recover')return cores;return[]}","function targets(){return[]}")
rep("hp:300*k,max:300*k,","hp:(90+45*wave)*k,max:(90+45*wave)*k,")
rep("mission=null;gap=0.01","mission=null;bossN=0;gap=0.01")
open(p,'w').write(s);print('ok')
