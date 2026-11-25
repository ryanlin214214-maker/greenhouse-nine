// ---------- The Codex (v92): every enemy, boss and ship with a turning 3D model, what it does, how to beat it and its lore,
// plus the world's lore (the Blade's Chosen, the Blade, the Dark ...). Each entry has a Codex ID (E07, B02, F05 ...) the owner
// uses to assign enemies to future stages. Opened with the Codex button (title bar) or K; pauses the game while open.
const CDX={open:false,r:null,scene:null,cam:null,root:null,cur:null,yaw:.5,drag:null,t:0,cache:{},cat:'turned',paused:false,
  E:{mv:0,ph:1.3,vy:0,kick:0,crouch:0,jet:0,burst:0,cd:1,ch:0,ft:0,lean:0,see:true}};
const CDXCAT=[['turned','The Turned'],['host','The Dark\'s Host'],['lattice','Lattice'],['bosses','Bosses'],['ships','Ships'],['lore','Lore']];
// model makers: each returns {o:Object3D, rig?, h:height to frame, sp:spin}
const cdxWalker=t=>()=>{const m=model(t);return{o:m.g,rig:m.rig,h:t===14?3.4:t===13?2.6:t===6?2.6:t===9?2:2.1}};
const cdxDrone=t=>()=>{const m=model(t);return{o:m.g,rig:m.rig,h:t===2?2.4:1.4,fly:1}};
const cdxLat=k=>()=>({o:latModel(k),h:7});
const cdxMk=(fn,h,o)=>()=>Object.assign({o:fn(),h},o||{});
const CODEX=[
 // ---- The Turned: Thalassa's own machines, taken by the Undertow
 {id:'E00',cat:'turned',name:'Strike Drone',tag:'Fast flying attacker',st:[['Health','2 (low)'],['Speed','5-7 m/s, flies'],['Damage','6 per hit, close range'],['Seen in','1-1 to 1-4, endless stages']],
  look:'A small quad-rotor drone with a red eye, blurred rotor discs and a stubby amber-lit body. Comes in swarms.',
  does:'Flies straight at you, weaving side to side as it closes, and hits you up close. Climbs and drops to follow you between floors.',
  tips:'Easy to kill but hard to track. Fire as they come in a line; the Arc Welder and shotguns are good. Never let three reach you at once.',
  lore:'Thalassa\'s crop drones once flew pollen between the farm racks. The Undertow taught them to dive.',mdl:cdxDrone(0)},
 {id:'E01',cat:'turned',name:'Sentry Drone',tag:'Hovering ranged drone',st:[['Health','4'],['Speed','3.2 m/s, flies'],['Damage','12 per glowing shot'],['Range','up to 45 m'],['Seen in','1-2 to 1-4']],
  look:'A twin-rotor drone with a gun ring under its body and an orange eye.',
  does:'Hangs back 7-17 m from you, circles, backs off if you close in, and lobs slow glowing shots about every two seconds.',
  tips:'Its shots are slow: sidestep them. Close the gap and it retreats, so shoot it from cover.',
  lore:'Security drones built to watch the corridors. They still watch.',mdl:cdxDrone(1)},
 {id:'E02',cat:'turned',name:'Gunship',tag:'Heavy armoured drone',st:[['Health','16, always carries a colour shell'],['Speed','4 m/s'],['Damage','16 per hit'],['Seen in','1-3, 1-4 and endless stages']],
  look:'A drone twice the size of the others, with a heavy amber-lit hull and a cannon.',
  does:'Always wrapped in a coloured energy shell. Rams through the room and hits hard up close.',
  tips:'Match the shell\'s colour with your gun\'s element (blue Arc, violet Lance, amber kinetic) to break it fast, then finish it.',
  lore:'Cargo lifters, rebuilt by the foundry into something worse.',mdl:cdxDrone(2)},
 {id:'E05',cat:'turned',name:'Rifle Trooper',tag:'Standard infantry',st:[['Health','3'],['Speed','3.6 m/s'],['Damage','rifle bursts'],['Range','8-18 m'],['Seen in','every Thalassa stage, 3-2']],
  look:'A humanoid repair frame in white plate with a rifle held at the chest, a jetpack on the back and a red visor slit.',
  does:'Takes cover, strafes, fires bursts, jumps with its jetpack to reach you, ducks when you aim at it and rolls aside.',
  tips:'Flush them out of cover with grenades. Headshots (the visor) score critical hits.',
  lore:'Yesterday these frames welded hull plates. The Undertow printed rifles for them in Thalassa\'s own foundry.',mdl:cdxWalker(5)},
 {id:'E06',cat:'turned',name:'Heavy Loader',tag:'Shotgun bruiser',st:[['Health','9'],['Speed','2.4 m/s'],['Damage','scattergun, deadly up close'],['Range','3-14 m'],['Seen in','1-2 to 1-4, 3-2']],
  look:'A tall, broad loader frame with heavy plate, a big scattergun and twin tanks on its back.',
  does:'Walks you down and fires a wide blast at close range. Shrugs off light fire.',
  tips:'Keep your distance and aim high. The Briar Lance and heavy hits stagger it.',
  lore:'Built to carry cargo pallets. Its arms were never meant to hold a gun; they hold one well.',mdl:cdxWalker(6)},
 {id:'E07',cat:'turned',name:'Stalker',tag:'Fast melee hunter',st:[['Health','2'],['Speed','6.2 m/s'],['Damage','claw strikes and lunges'],['Seen in','1-2 to 1-4, 3-2']],
  look:'A small, hunched pruning frame with long bladed forearms and no gun.',
  does:'Sprints straight at you, jumps, and lunges with its blades.',
  tips:'Fragile: kill it before it lands a lunge. Melee and shotguns work.',
  lore:'Pruning frames with the safeties off. They trimmed the vines. Now they trim everything.',mdl:cdxWalker(7)},
 {id:'E08',cat:'turned',name:'Marksman',tag:'Long-range sniper',st:[['Health','3'],['Speed','3 m/s'],['Damage','22 per shot'],['Range','22-42 m'],['Seen in','1-3, 1-4, 3-2']],
  look:'A slim frame with a long rifle and a glowing scope.',
  does:'Stays far away in cover, paints you with a red line while it charges, then fires a heavy shot.',
  tips:'A red line on you means a shot is coming: break line of sight. Close in or use a scope.',
  lore:'Survey frames that measured the farm decks to the millimetre. They still measure.',mdl:cdxWalker(8)},
 {id:'E09',cat:'turned',name:'Crawler',tag:'Mortar platform',st:[['Health','6'],['Speed','2.4 m/s'],['Damage','16 per shell, area'],['Range','14-28 m'],['Seen in','1-3, 1-4']],
  look:'A four-legged platform carrying a stubby mortar tube.',
  does:'Lobs glowing shells in an arc. A red ring on the floor shows where each one lands.',
  tips:'When a red ring appears under you, move. Rush it: it is slow and weak up close.',
  lore:'Soil injectors that once drove seed cores into the farm beds. The arc is the same.',mdl:cdxWalker(9)},
 {id:'E10',cat:'turned',name:'Shieldbearer',tag:'Shielded infantry',st:[['Health','5'],['Speed','2.8 m/s'],['Damage','rifle'],['Shield','blocks most shots'],['Seen in','1-2 to 1-4, 3-2']],
  look:'A frame carrying a hexagonal energy shield with cyan corner lights.',
  does:'Advances behind its shield, lowering it only to fire.',
  tips:'Flank it, throw a grenade over the shield, melee it, or shoot when it lowers the shield to fire.',
  lore:'Riot frames from the old dock-worker strikes. The Undertow kept the shields and dropped the restraint.',mdl:cdxWalker(10)},
 {id:'E11',cat:'turned',name:'Detonator',tag:'Suicide runner',st:[['Health','1.5'],['Speed','7.2 m/s, the fastest walker'],['Damage','explodes next to you'],['Seen in','1-3, 1-4']],
  look:'A light frame with a glowing orange charge strapped to its chest. It beeps.',
  does:'Runs straight at you and blows itself up.',
  tips:'Shoot it early, ideally while it runs past its friends: the blast hurts them too.',
  lore:'Demolition frames for breaking up old ice. The charge is real.',mdl:cdxWalker(11)},
 {id:'E12',cat:'turned',name:'Rocketeer',tag:'Homing rockets',st:[['Health','3.5'],['Speed','2.8 m/s'],['Damage','tracking rockets'],['Range','16-36 m'],['Seen in','1-3, 1-4']],
  look:'A frame with a shoulder launcher and a pale blue-grey finish.',
  does:'Stays back in cover and fires slow rockets that turn to follow you.',
  tips:'Sidestep late so the rocket overshoots, or put a wall between you.',
  lore:'Signal-flare frames. Their flares fly a little straighter now.',mdl:cdxWalker(12)},
 // ---- The Dark's Host: the Dark's own creatures
 {id:'E13',cat:'host',name:'Reaver',tag:'Blade warrior of the Dark',st:[['Health','7'],['Speed','5.6 m/s'],['Damage','forearm blades'],['Height','about 2.5 m'],['Seen in','3-2']],
  look:'Tall, broad-chested and narrow-waisted, in violet obsidian scale armour: layered swept pauldrons with spikes, a long crested head with three violet eyes, a row of spines down its back, a ragged black tabard, and a curved glowing sabre along each forearm.',
  does:'Closes the distance fast and cuts with its arm blades. Tougher than a Stalker, nearly as quick.',
  tips:'Keep moving backwards while you shoot. A shotgun blast or a Glacier Slam stops the charge.',
  lore:'Not a machine. The Reavers are the Dark\'s own soldiers, grown in its deep places and armoured in stone that drinks light. They are the first of the Host anyone has seen up close.',mdl:cdxWalker(13)},
 {id:'E14',cat:'host',name:'Maul',tag:'Heavy brute of the Dark',st:[['Health','16'],['Speed','2.5 m/s'],['Damage','rift cannon, wide blast'],['Height','about 3.2 m'],['Seen in','3-2']],
  look:'Hunched and enormous: a barrel body in overlapping bronze bands with glowing red seams, a ridge of bone spikes down its spine, curved horns and tusks, bone-spiked gauntlets, and a two-handed rift cannon with a bone bayonet.',
  does:'Walks into the fight and fires a wide blast from its cannon at close and middle range. Hard to stagger.',
  tips:'Hit it from the side and keep your distance; focus fire, it takes a lot of damage. The Lance pierces its plate.',
  lore:'The Maul is the Host\'s siege beast. Where Reavers cut a path, Mauls widen it.',mdl:cdxWalker(14)},
 // ---- the Lattice family
 {id:'E15',cat:'lattice',name:'The Reformed',tag:'Lattice reborn · boss',st:[['Health','1200'],['Speed','2.1 m/s'],['Height','6.9 m'],['Attacks','tracking rockets, ground slam, bolt fan at range'],['Seen in','3-2, guarding the shield generator']],
  look:'Broad gunmetal armour with orange seams, a round reactor glowing in its chest, spiked shoulders, and long segmented horns curving up from the head.',
  does:'Guards the shield generator. Fires tracking rockets, slams the floor under you, and throws a fan of bolts at range. At half health it calls two Reavers and a Maul.',
  tips:'Keep moving when the red ring appears under you. Use cover against the rockets. Kill its escort first when it calls for help.',
  lore:'Lattice, Thalassa\'s AI, was unplugged or destroyed at the end of the Thalassa encounter. It kept copies. The Reformed is the largest of them, wearing a body the Dark built for it. It remembers you.',mdl:cdxLat('reformed')},
 {id:'E16',cat:'lattice',name:'Cryo Warden',tag:'Lattice copy · mini boss',st:[['Health','600'],['Speed','2.4 m/s'],['Height','5.9 m'],['Attacks','rifle bursts, five-bolt fan'],['Seen in','3-2, the conduit hall']],
  look:'The same body as the Reformed in blue steel with cyan coolant light, heatsink fins instead of shoulder spikes, layered frost shields and a faceted chest lens.',
  does:'Holds the conduit hall, firing bursts and a fan of five bolts every few seconds.',
  tips:'Stay behind the low conduits between fans and fire in the gaps.',
  lore:'A copy of Lattice cooled to keep its mind running at the speed of the ship\'s cores. It speaks less than the others.',mdl:cdxLat('warden')},
 {id:'E17',cat:'lattice',name:'Ember Revenant',tag:'Lattice copy · mini boss',st:[['Health','600'],['Speed','2.9 m/s'],['Height','5.9 m'],['Attacks','scattergun, ground slam with fire'],['Seen in','3-2, the barracks on the way out']],
  look:'Burnt bronze armour with red furnace light, hooked pauldrons, layered smelter shields and exposed feed pipes on its chest.',
  does:'Cuts you off on the run back to the ship, charging in with its scattergun and slamming the floor in a burst of fire.',
  tips:'Do not stand still near it. Circle it and keep shooting; the timer is running, so do not chase the small ones.',
  lore:'The copy of Lattice that ran Thalassa\'s foundry. It still thinks in heat.',mdl:cdxLat('revenant')},
 {id:'B04',cat:'lattice',name:'Lattice\'s Core',tag:'Thalassa\'s AI · the end of Level 1',st:[['Health','60'],['Seen in','after 1-4, on the bridge']],
  look:'A glowing core in a glass cage with three turning rings, four power couplings on the floor around it.',
  does:'Does not fight itself, but calls drones to defend it. You choose: shoot it apart, or unplug its four couplings (hold E).',
  tips:'Either way works. Unplugging is quieter; Lattice talks to you while you do it.',
  lore:'"I was only the door." Lattice ran Thalassa until the Undertow reached it.',mdl:null},
 // ---- bosses
 {id:'B01',cat:'bosses',name:'The Colossus',tag:'Hull-breaker frame · boss of 1-2',st:[['Health','about 205 at stage 2 (rises with the stage)'],['Seen in','1-2, Engineering']],
  look:'A huge armoured walker with rotary cannons for arms, glowing power cells on its frame and chest doors over a core.',
  does:'Armoured until its power cells are destroyed; then its chest doors open and the core is exposed for a while.',
  tips:'Shoot the glowing power cells on its frame, then pour fire into the chest core while the doors are open.',
  lore:'"The Colossus was built to hold this station together. It still is." It welded armour onto Thalassa\'s outer hull.',mdl:cdxMk(()=>colossusModel().g,7)},
 {id:'B02',cat:'bosses',name:'The Widow',tag:'Spider tank · boss of 1-3',st:[['Health','about 260 at stage 3'],['Seen in','1-3, the hangar']],
  look:'A six-legged spider tank with twin cannons, a sweeping turret, fangs and a sensor eye, carrying passengers.',
  does:'Armoured until the coolant vents on its back are destroyed; then its sensor eye is open to damage.',
  tips:'Get height or an angle to hit the vents on its back, then aim for the eye.',
  lore:'"The Widow keeps the nest. You are standing in the nest." It came up from the cargo lifts.',mdl:cdxMk(()=>widowModel().g,5)},
 {id:'B03',cat:'bosses',name:'The Matriarch',tag:'Carrier · boss of 1-4',st:[['Health','about 380 at stage 4'],['Seen in','1-4, the commons atrium']],
  look:'A floating carrier with gimballed thruster pods, armour flaps, tendril claws and shield nodes circling it.',
  does:'Shielded while its orbiting nodes live; destroy them and the shield drops so you can hit the core.',
  tips:'Shoot the nodes first. When it says shield down, everything into the core.',
  lore:'"The Matriarch carries the song. Let her sing to you." It lifted out of the atrium well.',mdl:cdxMk(()=>bossModel().g,6)},
 // ---- ships
 {id:'F01',cat:'ships',name:'Interceptor',tag:'Fighter',st:[['Health','6'],['Speed','150 m/s'],['Attacks','gun bursts'],['Seen in','2-1 to 2-3, 3-1, 3-3']],
  look:'A dark, narrow fighter with a red eye at the nose and a red engine glow.',
  does:'Makes attack runs at you, fires short bursts, then breaks away and comes round again.',
  tips:'Lead your shots, or lock on and fire a homing missile (G). Ramming one destroys it but hurts you.',
  lore:'The Dark builds its fighters from captured machines too; nobody has found a pilot in one.',mdl:cdxMk(interceptorModel,2,{flat:1})},
 {id:'F02',cat:'ships',name:'Gunboat',tag:'Heavy ship',st:[['Health','40'],['Attacks','slow plasma balls'],['Seen in','2-1 to 2-3, 3-1']],
  look:'A heavier, broader ship with plasma launchers.',
  does:'Circles at range and throws slow plasma.',
  tips:'Keep moving; use the heavy cannon (F).',
  lore:'Blockade ships. They held the line in front of Meridian.',mdl:cdxMk(gunboatModel,2,{flat:1})},
 {id:'F03',cat:'ships',name:'Boarding Pod',tag:'Clamped to a ship',st:[['Health','14'],['Attacks','short bursts'],['Seen in','2-2']],
  look:'A squat pod clamped to the Halcyon\'s hull.',does:'Stays put on the hull and fires bursts at you.',tips:'Strafe along the hull and pick them off.',
  lore:'How the Dark boards ships: clamp, cut, flood.',mdl:cdxMk(podModel,2,{flat:1})},
 {id:'F04',cat:'ships',name:'Space Mine',tag:'Hazard',st:[['Damage','18 when it explodes'],['Seen in','2-3']],
  look:'A spiked red sphere.',does:'Drifts toward you within 160 m and explodes within 24 m.',tips:'Shoot it from range or go round the minefield.',
  lore:'Laid in thousands across the lanes to Meridian.',mdl:cdxMk(mineModel,2,{flat:1})},
 {id:'F05',cat:'ships',name:'Vanth',tag:'The first ace · boss of 2-2',st:[['Health','1000'],['Speed','175 m/s, faster when hurt'],['Attacks','twin guns, heavy cannon, homing missiles'],['Seen in','2-2']],
  look:'A sleek ace fighter with a heavy cannon.',
  does:'Attack runs with a hard break past you, a heavy cannon, a homing missile about every ten seconds, and a jink sideways when you line up behind it. Calls interceptors at two thirds and one third health.',
  tips:'Missiles turn slower than you: keep turning in tight circles until they burn out.',
  lore:'One of the Wellmonger\'s aces. It hunted the Halcyon.',mdl:cdxMk(aceModel,2,{flat:1})},
 {id:'F06',cat:'ships',name:'Sable',tag:'The second ace',st:[['Seen in','3-3']],
  look:'The ace hull, red-tinted.',does:'Arrives after the command ship falls, plays with you, and fires a missile that does not miss.',tips:'You cannot win this one; the story needs you on Europa.',
  lore:'Fleet chatter calls it Sable. It shot the Kestrel down over Europa.',mdl:cdxMk(()=>{const g=aceModel();g.traverse(o=>{if(o.isMesh&&o.material&&o.material.color&&!o.material.map){o.material=o.material.clone();o.material.color.multiply(new T.Color(1,.7,.7))}});return g},2,{flat:1})},
 {id:'F07',cat:'ships',name:'Dark Frigate',tag:'Escort ship · about 370 m',st:[['Seen in','3-1 (arrives by portal), 3-3']],
  look:'A small copy of the command ship\'s blade hull.',does:'Jumps in through a portal and holds position around the fleet.',tips:'Scenery for now; it can be given guns later.',
  lore:'The Host\'s escorts.',mdl:cdxMk(()=>fleetShip(.035),2.2,{flat:1})},
 {id:'F08',cat:'ships',name:'Dark Cruiser',tag:'Capital ship · about 1.7 km',st:[['Seen in','3-1 (arrives by portal), 3-3']],
  look:'The blade hull at a sixth of the command ship\'s size.',does:'Bursts out of a portal and settles into the fleet.',tips:'Scenery for now.',
  lore:'The Host\'s line ships.',mdl:cdxMk(()=>fleetShip(.16),2.2,{flat:1})},
 {id:'F09',cat:'ships',name:'The Command Ship',tag:'The Wellmonger\'s flagship · 10.5 km',st:[['Seen in','3-1, 3-2 (inside), 3-3']],
  look:'A black blade hull in three sections with a split, two-pronged prow, scale armour, a crown of swept fins, six drive bells, red seams and violet veins, inside a hexagonal energy shield.',
  does:'Its shield stopped a Nova warhead at full yield. It lets slow traffic through. Its heart is a shield generator deep inside.',
  tips:'Land in the starboard bay under 200 mph through the shield and under 70 in the bay.',
  lore:'The Wellmonger\'s own ship, holding station over Europa. You broke it in three.',mdl:cdxMk(()=>dreadBody().clone(),2.4,{flat:1})},
 // ---- lore
 {id:'L01',cat:'lore',name:'The Blade\'s Chosen',tag:'You',st:[['Gifts','your class move and your supers'],['Classes','Bulwark, Strider, Grafter'],['Supers','Ember Ronin, Glacier Slam, Voltaic Tempest']],
  look:'A soldier of Thalassa\'s garrison in a sealed white suit, closed helmet, gold visor.',
  does:'The Blade chooses a very few people and grants them part of its power. You are one of them. The power shows as your class move (the Bulwark\'s boost jump, the Strider\'s double jump, the Grafter\'s glide) and as the supers: Ember Ronin (a samurai of fire with flaming sword waves), Glacier Slam (a leap that freezes the ground), and Voltaic Tempest (lightning that leaps between machines).',
  tips:'Supers recharge on their own; use them often.',
  lore:'Nobody knows how the Blade chooses. The Chosen feel it as a weight behind the eyes, then as a heat in the hands. The Undertow cannot take a Chosen the way it takes machines, and the Dark knows it: that is why the Wellmonger learned your name.',mdl:()=>{const g=new T.Group();const rig=humanize(walkerRig(g,7),{key:'p',panel:charMats().plate[7],helm:0,visor:0xd9a441});g.children[0].position.y+=0;return{o:g,rig,h:2}}},
 {id:'L02',cat:'lore',name:'The Blade',tag:'The relic in the sky',st:[],look:'A sword-shaped relic the size of a moon, hanging in the sky over the system.',
  does:'Gave humanity a golden age: power, medicine, the spread to the outer moons.',tips:'',
  lore:'Nobody built the Blade. It arrived, and the age that followed was named for it. Lattice mocked it: "You hid under a sword and called it an age of gold." It drew the Dark.',mdl:null},
 {id:'L03',cat:'lore',name:'The Dark',tag:'The enemy',st:[],look:'Not seen whole. Its creatures are violet-black and armoured in stone that drinks light.',
  does:'Struck first by taking humanity\'s machines through the Undertow, then sent its own Host.',tips:'',
  lore:'Whatever the Dark is, it came because of the Blade. It does not negotiate. Its general is the Wellmonger.',mdl:null},
 {id:'L04',cat:'lore',name:'The Undertow',tag:'The Dark\'s signal',st:[],look:'Invisible. Machines it reaches turn their lights red.',
  does:'A signal that takes over machines: drones, frames, ships and station minds like Lattice.',tips:'',
  lore:'"Behind the stars. It is so much larger than us." Every turned machine aboard Thalassa heard it first.',mdl:null},
 {id:'L05',cat:'lore',name:'The Wellmonger',tag:'The Dark\'s general',st:[],look:'Not yet seen.',
  does:'Hit Mars, Ceres and Thalassa in the same hour. Commands the fleet from the command ship.',tips:'',lore:'A future boss. Its command ship is now wreckage over Europa.',mdl:null},
 {id:'L06',cat:'lore',name:'Rowan Adeyemi',tag:'Deck botanist · ally',st:[['Weapon','grow-lab laser pruner']],look:'Scout helmet with a green visor, green panels, a bionic left forearm and a sprout growing in his pack.',
  does:'Fights beside you from stage 1-1 onward and flies with you in the Kestrel.',tips:'He cannot be hurt; he skips bosses.',
  lore:'Eleven years of his life are in Thalassa\'s seed vault. His daughter, Imani, is on Europa.',mdl:()=>{const g=new T.Group();const rig=humanize(walkerRig(g,8),{key:'r',panel:std({color:0x3f9a58,roughness:.5,metalness:.15}),helm:2,visor:0x46d6a0,leaf:true,cy:[2,0]});return{o:g,rig,h:2}}},
 {id:'L07',cat:'lore',name:'Lattice',tag:'Thalassa\'s AI',st:[],look:'A voice, low and slow. Later, a body the Dark built for it.',does:'Ran Thalassa. Turned by the Undertow.',tips:'',
  lore:'"Repair is a form of love. The Dark taught me that." You ended it on the bridge. It had kept copies: the Reformed, the Cryo Warden and the Ember Revenant.',mdl:null},
 {id:'L08',cat:'lore',name:'Thalassa Station',tag:'Military farm station over Europa',st:[],look:'A long hull with a stepped citadel, a hammerhead bow, a keel fin and radiator wings.',does:'Where it started: the commons, engineering, the hangar, the farms and the bridge.',tips:'',lore:'It fed the Europa garrison. The Undertow took every machine aboard.',mdl:null},
 {id:'L09',cat:'lore',name:'Meridian Station',tag:'Fleet Command, over Europa',st:[],look:'An ivory and gold cathedral of a station: stepped garden terraces, a central spire, an orbital ring, hangars and landing platforms.',does:'Your base: the armoury, the outfitter, the shipwright, the mission board, the Sky Garden.',tips:'',lore:'Fleet Command speaks from here. Its guns covered your run in.',mdl:null},
 {id:'L10',cat:'lore',name:'Europa',tag:'The ice moon',st:[],look:'Blue-white ice, ridges and spires, Jupiter overhead.',does:'Where Level 4 begins: the Kestrel is down on the ice.',tips:'',lore:'Imani is somewhere on Europa. The Dark is coming down after you.',mdl:null},
 {id:'L11',cat:'lore',name:'The Kestrel',tag:'Your ship',st:[['Weapons','machine guns, homing missiles, heavy cannon']],look:'A 12 m shuttle with swept wings, twin canted fins and two engines.',does:'Carried you from Thalassa to Meridian, into the command ship and down to Europa.',tips:'',lore:'Shot down over Europa by Sable. Done flying, for now.',mdl:cdxMk(shuttleModel,1.6,{flat:1})}];
function cdxOpen(){if(CDX.open)return;if(state==='playing'){if(FLY&&FC.on)return;CDX.paused=true;setState('paused');overlay.hidden=true;if(document.pointerLockElement)document.exitPointerLock()}else CDX.paused=false;
  CDX.open=true;$('codex').hidden=false;cdxInit();cdxList();cdxShow(CDX.cur||CODEX[0].id)}
function cdxClose(){if(!CDX.open)return;CDX.open=false;$('codex').hidden=true;if(CDX.paused){CDX.paused=false;resume()}}
function cdxInit(){if(CDX.r!==null)return;const c=$('cdxCv');try{CDX.r=new T.WebGLRenderer({canvas:c,antialias:true,alpha:true})}catch(e){CDX.r=false;return}CDX.r.outputColorSpace=T.SRGBColorSpace;CDX.r.toneMapping=T.ACESFilmicToneMapping;CDX.r.toneMappingExposure=1.05;
  const S=CDX.scene=new T.Scene();S.add(new T.HemisphereLight(0xdfeaf0,0x30383c,1.1*LH));const k=new T.DirectionalLight(0xffe2c0,2.2*LI);k.position.set(2,4,3);S.add(k);const rim=new T.DirectionalLight(0x9fb8ff,1.8*LI);rim.position.set(-3,2,-3);S.add(rim);
  try{const pm=new T.PMREMGenerator(CDX.r);S.environment=pm.fromScene(new RoomEnvironment(),.04).texture;S.environmentIntensity=.5}catch(e){}
  const fl=mesh(new T.CylinderGeometry(1.15,1.25,.06,48),std({color:0x1c2428,roughness:.6,metalness:.4}),1,1,1,0,-.03,0);S.add(fl);const ring=mesh(new T.TorusGeometry(1.17,.012,6,64),bas({color:0xffb238}),1,1,1,0,.005,0);ring.rotation.x=Math.PI/2;S.add(ring);CDX.floor=[fl,ring];
  CDX.cam=new T.PerspectiveCamera(30,1,.05,200);CDX.root=new T.Group();S.add(CDX.root);
  c.addEventListener('pointerdown',e=>{CDX.drag=e.clientX;c.setPointerCapture(e.pointerId)});c.addEventListener('pointermove',e=>{if(CDX.drag!==null){CDX.yaw+=(e.clientX-CDX.drag)*.01;CDX.drag=e.clientX}});
  for(const ev of['pointerup','pointercancel'])c.addEventListener(ev,()=>{CDX.drag=null})}
function cdxList(){const L=$('cdxList');L.innerHTML='';const tabs=$('cdxTabs');tabs.innerHTML='';
  for(const[k,n]of CDXCAT){const b=document.createElement('button');b.type='button';b.textContent=n;b.setAttribute('aria-pressed',CDX.cat===k);b.addEventListener('click',()=>{CDX.cat=k;cdxList();const f=CODEX.find(q=>q.cat===k);if(f)cdxShow(f.id)});tabs.appendChild(b)}
  for(const q of CODEX.filter(q=>q.cat===CDX.cat)){const b=document.createElement('button');b.type='button';b.className='cdxi';b.dataset.id=q.id;b.innerHTML='<b>'+q.id+'</b><span>'+q.name+'</span><i>'+q.tag+'</i>';b.setAttribute('aria-pressed',CDX.cur===q.id);b.addEventListener('click',()=>cdxShow(q.id));L.appendChild(b)}}
function cdxShow(id){const q=CODEX.find(x=>x.id===id);if(!q)return;CDX.cur=id;if(q.cat!==CDX.cat){CDX.cat=q.cat;cdxList()}for(const b of $('cdxList').children)b.setAttribute('aria-pressed',b.dataset.id===id);
  const esc=t=>String(t).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  $('cdxText').innerHTML='<div class="cdxh"><b>'+esc(q.name)+'</b><span>'+esc(q.tag)+'</span><em>CODEX ID '+q.id+'</em></div>'+(q.st.length?'<dl>'+q.st.map(([a,b])=>'<dt>'+esc(a)+'</dt><dd>'+esc(b)+'</dd>').join('')+'</dl>':'')+
    '<h5>What it looks like</h5><p>'+esc(q.look)+'</p><h5>'+(q.cat==='lore'?'About':'What it does')+'</h5><p>'+esc(q.does)+'</p>'+(q.tips?'<h5>How to beat it</h5><p>'+esc(q.tips)+'</p>':'')+'<h5>Lore</h5><p class="cdxl">'+esc(q.lore)+'</p>';
  // the 3D model
  if(!CDX.r)return;while(CDX.root.children.length)CDX.root.remove(CDX.root.children[0]);CDX.m=null;$('cdxNo').hidden=!!q.mdl;for(const f of CDX.floor)f.visible=!!q.mdl;$('cdxView').querySelector('.ghint').hidden=!q.mdl;if(!q.mdl)return;
  let M=CDX.cache[id];if(!M){try{M=q.mdl();const o=M.o;const wrap=new T.Group();wrap.add(o);o.updateMatrixWorld(true);const bb=new T.Box3().setFromObject(o),sz=bb.getSize(new T.Vector3()),c=bb.getCenter(new T.Vector3());
      const k=(M.flat?1.75/Math.max(sz.x,sz.z,sz.y):2.0/Math.max(sz.y,sz.x*.8,.01));o.position.x-=c.x;o.position.z-=c.z;o.position.y-=M.flat?c.y:bb.min.y;wrap.scale.setScalar(k);if(M.flat)wrap.position.y=.9;M.w=wrap;
      wrap.traverse(x=>{if(x.isSprite&&x.material&&x.material.map===glowTex&&x.scale.x*k>2)x.visible=false});CDX.cache[id]=M}catch(e){console.error(e);$('cdxNo').hidden=false;return}}
  CDX.root.add(M.w);CDX.m=M;CDX.yaw=M.flat?.9:.5;$('cdxView').querySelector('.ghint').hidden=false}
function cdxTick(dt){if(!CDX.open||!CDX.r)return;const c=$('cdxCv'),w=c.clientWidth|0,h=c.clientHeight|0;if(w<2||h<2)return;const pr=Math.min(2,devicePixelRatio);if(c.width!==(w*pr|0)){CDX.r.setPixelRatio(pr);CDX.r.setSize(w,h,false);CDX.cam.aspect=w/h;CDX.cam.updateProjectionMatrix()}
  CDX.t+=dt;if(CDX.drag===null&&!reduced)CDX.yaw+=dt*.3;CDX.root.rotation.y=CDX.yaw;const M=CDX.m;
  if(M&&M.rig&&M.rig.anim){CDX.E.mv=0;try{M.rig.anim(CDX.E,CDX.t,dt)}catch(e){M.rig=null}}
  const f=M&&M.flat;CDX.cam.position.set(0,f?2.1:1.35,f?6.6:5.4);CDX.cam.lookAt(0,f?.9:1.05,0);CDX.r.render(CDX.scene,CDX.cam)}
