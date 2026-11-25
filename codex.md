# Greenhouse Nine · Enemy and lore codex

The same entries are in the game (the Codex button in the top bar, or K). Use the **Codex ID** to assign enemies to stages, for example:

> Stage 5-1: E05 x6, E07 x3, E13 x2 · mini boss E16

Walker infantry IDs (E05-E14) are the game's own enemy type numbers; E15-E17 are the Lattice bosses (placed with `latSpawn`); B = Level 1 bosses; F = ships (flight stages only); L = lore.

## Quick roster

| ID | Name | Role | Key numbers | Where now |
|---|---|---|---|---|
| E00 | Strike Drone | Fast flying attacker | health 2 (low), speed 5-7 m/s, flies | 1-1 to 1-4, endless stages |
| E01 | Sentry Drone | Hovering ranged drone | health 4, speed 3.2 m/s, flies | 1-2 to 1-4 |
| E02 | Gunship | Heavy armoured drone | health 16, always carries a colour shell, speed 4 m/s | 1-3, 1-4 and endless stages |
| E05 | Rifle Trooper | Standard infantry | health 3, speed 3.6 m/s | every Thalassa stage, 3-2 |
| E06 | Heavy Loader | Shotgun bruiser | health 9, speed 2.4 m/s | 1-2 to 1-4, 3-2 |
| E07 | Stalker | Fast melee hunter | health 2, speed 6.2 m/s | 1-2 to 1-4, 3-2 |
| E08 | Marksman | Long-range sniper | health 3, speed 3 m/s | 1-3, 1-4, 3-2 |
| E09 | Crawler | Mortar platform | health 6, speed 2.4 m/s | 1-3, 1-4 |
| E10 | Shieldbearer | Shielded infantry | health 5, speed 2.8 m/s | 1-2 to 1-4, 3-2 |
| E11 | Detonator | Suicide runner | health 1.5, speed 7.2 m/s, the fastest walker | 1-3, 1-4 |
| E12 | Rocketeer | Homing rockets | health 3.5, speed 2.8 m/s | 1-3, 1-4 |
| E13 | Reaver | Blade warrior of the Dark | health 7, speed 5.6 m/s | 3-2 |
| E14 | Maul | Heavy brute of the Dark | health 16, speed 2.5 m/s | 3-2 |
| E15 | The Reformed | Lattice reborn · boss | health 1200, speed 2.1 m/s | 3-2, guarding the shield generator |
| E16 | Cryo Warden | Lattice copy · mini boss | health 600, speed 2.4 m/s | 3-2, the conduit hall |
| E17 | Ember Revenant | Lattice copy · mini boss | health 600, speed 2.9 m/s | 3-2, the barracks on the way out |
| B04 | Lattice's Core | Thalassa's AI · the end of Level 1 | health 60 | after 1-4, on the bridge |
| B01 | The Colossus | Hull-breaker frame · boss of 1-2 | health about 205 at stage 2 (rises with the stage) | 1-2, Engineering |
| B02 | The Widow | Spider tank · boss of 1-3 | health about 260 at stage 3 | 1-3, the hangar |
| B03 | The Matriarch | Carrier · boss of 1-4 | health about 380 at stage 4 | 1-4, the commons atrium |
| F01 | Interceptor | Fighter | health 6, speed 150 m/s | 2-1 to 2-3, 3-1, 3-3 |
| F02 | Gunboat | Heavy ship | health 40 | 2-1 to 2-3, 3-1 |
| F03 | Boarding Pod | Clamped to a ship | health 14 | 2-2 |
| F04 | Space Mine | Hazard |  | 2-3 |
| F05 | Vanth | The first ace · boss of 2-2 | health 1000, speed 175 m/s, faster when hurt | 2-2 |
| F06 | Sable | The second ace |  | 3-3 |
| F07 | Dark Frigate | Escort ship · about 370 m |  | 3-1 (arrives by portal), 3-3 |
| F08 | Dark Cruiser | Capital ship · about 1.7 km |  | 3-1 (arrives by portal), 3-3 |
| F09 | The Command Ship | The Wellmonger's flagship · 10.5 km |  | 3-1, 3-2 (inside), 3-3 |

## The Turned (Thalassa's machines, taken by the Undertow)

### E00 · Strike Drone
*Fast flying attacker*

- **Health:** 2 (low)
- **Speed:** 5-7 m/s, flies
- **Damage:** 6 per hit, close range
- **Seen in:** 1-1 to 1-4, endless stages

**Looks:** A small quad-rotor drone with a red eye, blurred rotor discs and a stubby amber-lit body. Comes in swarms.

**Does:** Flies straight at you, weaving side to side as it closes, and hits you up close. Climbs and drops to follow you between floors.

**How to beat it:** Easy to kill but hard to track. Fire as they come in a line; the Arc Welder and shotguns are good. Never let three reach you at once.

**Lore:** Thalassa's crop drones once flew pollen between the farm racks. The Undertow taught them to dive.

### E01 · Sentry Drone
*Hovering ranged drone*

- **Health:** 4
- **Speed:** 3.2 m/s, flies
- **Damage:** 12 per glowing shot
- **Range:** up to 45 m
- **Seen in:** 1-2 to 1-4

**Looks:** A twin-rotor drone with a gun ring under its body and an orange eye.

**Does:** Hangs back 7-17 m from you, circles, backs off if you close in, and lobs slow glowing shots about every two seconds.

**How to beat it:** Its shots are slow: sidestep them. Close the gap and it retreats, so shoot it from cover.

**Lore:** Security drones built to watch the corridors. They still watch.

### E02 · Gunship
*Heavy armoured drone*

- **Health:** 16, always carries a colour shell
- **Speed:** 4 m/s
- **Damage:** 16 per hit
- **Seen in:** 1-3, 1-4 and endless stages

**Looks:** A drone twice the size of the others, with a heavy amber-lit hull and a cannon.

**Does:** Always wrapped in a coloured energy shell. Rams through the room and hits hard up close.

**How to beat it:** Match the shell's colour with your gun's element (blue Arc, violet Lance, amber kinetic) to break it fast, then finish it.

**Lore:** Cargo lifters, rebuilt by the foundry into something worse.

### E05 · Rifle Trooper
*Standard infantry*

- **Health:** 3
- **Speed:** 3.6 m/s
- **Damage:** rifle bursts
- **Range:** 8-18 m
- **Seen in:** every Thalassa stage, 3-2

**Looks:** A humanoid repair frame in white plate with a rifle held at the chest, a jetpack on the back and a red visor slit.

**Does:** Takes cover, strafes, fires bursts, jumps with its jetpack to reach you, ducks when you aim at it and rolls aside.

**How to beat it:** Flush them out of cover with grenades. Headshots (the visor) score critical hits.

**Lore:** Yesterday these frames welded hull plates. The Undertow printed rifles for them in Thalassa's own foundry.

### E06 · Heavy Loader
*Shotgun bruiser*

- **Health:** 9
- **Speed:** 2.4 m/s
- **Damage:** scattergun, deadly up close
- **Range:** 3-14 m
- **Seen in:** 1-2 to 1-4, 3-2

**Looks:** A tall, broad loader frame with heavy plate, a big scattergun and twin tanks on its back.

**Does:** Walks you down and fires a wide blast at close range. Shrugs off light fire.

**How to beat it:** Keep your distance and aim high. The Briar Lance and heavy hits stagger it.

**Lore:** Built to carry cargo pallets. Its arms were never meant to hold a gun; they hold one well.

### E07 · Stalker
*Fast melee hunter*

- **Health:** 2
- **Speed:** 6.2 m/s
- **Damage:** claw strikes and lunges
- **Seen in:** 1-2 to 1-4, 3-2

**Looks:** A small, hunched pruning frame with long bladed forearms and no gun.

**Does:** Sprints straight at you, jumps, and lunges with its blades.

**How to beat it:** Fragile: kill it before it lands a lunge. Melee and shotguns work.

**Lore:** Pruning frames with the safeties off. They trimmed the vines. Now they trim everything.

### E08 · Marksman
*Long-range sniper*

- **Health:** 3
- **Speed:** 3 m/s
- **Damage:** 22 per shot
- **Range:** 22-42 m
- **Seen in:** 1-3, 1-4, 3-2

**Looks:** A slim frame with a long rifle and a glowing scope.

**Does:** Stays far away in cover, paints you with a red line while it charges, then fires a heavy shot.

**How to beat it:** A red line on you means a shot is coming: break line of sight. Close in or use a scope.

**Lore:** Survey frames that measured the farm decks to the millimetre. They still measure.

### E09 · Crawler
*Mortar platform*

- **Health:** 6
- **Speed:** 2.4 m/s
- **Damage:** 16 per shell, area
- **Range:** 14-28 m
- **Seen in:** 1-3, 1-4

**Looks:** A four-legged platform carrying a stubby mortar tube.

**Does:** Lobs glowing shells in an arc. A red ring on the floor shows where each one lands.

**How to beat it:** When a red ring appears under you, move. Rush it: it is slow and weak up close.

**Lore:** Soil injectors that once drove seed cores into the farm beds. The arc is the same.

### E10 · Shieldbearer
*Shielded infantry*

- **Health:** 5
- **Speed:** 2.8 m/s
- **Damage:** rifle
- **Shield:** blocks most shots
- **Seen in:** 1-2 to 1-4, 3-2

**Looks:** A frame carrying a hexagonal energy shield with cyan corner lights.

**Does:** Advances behind its shield, lowering it only to fire.

**How to beat it:** Flank it, throw a grenade over the shield, melee it, or shoot when it lowers the shield to fire.

**Lore:** Riot frames from the old dock-worker strikes. The Undertow kept the shields and dropped the restraint.

### E11 · Detonator
*Suicide runner*

- **Health:** 1.5
- **Speed:** 7.2 m/s, the fastest walker
- **Damage:** explodes next to you
- **Seen in:** 1-3, 1-4

**Looks:** A light frame with a glowing orange charge strapped to its chest. It beeps.

**Does:** Runs straight at you and blows itself up.

**How to beat it:** Shoot it early, ideally while it runs past its friends: the blast hurts them too.

**Lore:** Demolition frames for breaking up old ice. The charge is real.

### E12 · Rocketeer
*Homing rockets*

- **Health:** 3.5
- **Speed:** 2.8 m/s
- **Damage:** tracking rockets
- **Range:** 16-36 m
- **Seen in:** 1-3, 1-4

**Looks:** A frame with a shoulder launcher and a pale blue-grey finish.

**Does:** Stays back in cover and fires slow rockets that turn to follow you.

**How to beat it:** Sidestep late so the rocket overshoots, or put a wall between you.

**Lore:** Signal-flare frames. Their flares fly a little straighter now.

## The Dark's Host

### E13 · Reaver
*Blade warrior of the Dark*

- **Health:** 7
- **Speed:** 5.6 m/s
- **Damage:** forearm blades
- **Height:** about 2.5 m
- **Seen in:** 3-2

**Looks:** Tall, broad-chested and narrow-waisted, in violet obsidian scale armour: layered swept pauldrons with spikes, a long crested head with three violet eyes, a row of spines down its back, a ragged black tabard, and a curved glowing sabre along each forearm.

**Does:** Closes the distance fast and cuts with its arm blades. Tougher than a Stalker, nearly as quick.

**How to beat it:** Keep moving backwards while you shoot. A shotgun blast or a Glacier Slam stops the charge.

**Lore:** Not a machine. The Reavers are the Dark's own soldiers, grown in its deep places and armoured in stone that drinks light. They are the first of the Host anyone has seen up close.

### E14 · Maul
*Heavy brute of the Dark*

- **Health:** 16
- **Speed:** 2.5 m/s
- **Damage:** rift cannon, wide blast
- **Height:** about 3.2 m
- **Seen in:** 3-2

**Looks:** Hunched and enormous: a barrel body in overlapping bronze bands with glowing red seams, a ridge of bone spikes down its spine, curved horns and tusks, bone-spiked gauntlets, and a two-handed rift cannon with a bone bayonet.

**Does:** Walks into the fight and fires a wide blast from its cannon at close and middle range. Hard to stagger.

**How to beat it:** Hit it from the side and keep your distance; focus fire, it takes a lot of damage. The Lance pierces its plate.

**Lore:** The Maul is the Host's siege beast. Where Reavers cut a path, Mauls widen it.

## The Lattice family

### E15 · The Reformed
*Lattice reborn · boss*

- **Health:** 1200
- **Speed:** 2.1 m/s
- **Height:** 6.9 m
- **Attacks:** tracking rockets, ground slam, bolt fan at range
- **Seen in:** 3-2, guarding the shield generator

**Looks:** Broad gunmetal armour with orange seams, a round reactor glowing in its chest, spiked shoulders, and long segmented horns curving up from the head.

**Does:** Guards the shield generator. Fires tracking rockets, slams the floor under you, and throws a fan of bolts at range. At half health it calls two Reavers and a Maul.

**How to beat it:** Keep moving when the red ring appears under you. Use cover against the rockets. Kill its escort first when it calls for help.

**Lore:** Lattice, Thalassa's AI, was unplugged or destroyed at the end of the Thalassa encounter. It kept copies. The Reformed is the largest of them, wearing a body the Dark built for it. It remembers you.

### E16 · Cryo Warden
*Lattice copy · mini boss*

- **Health:** 600
- **Speed:** 2.4 m/s
- **Height:** 5.9 m
- **Attacks:** rifle bursts, five-bolt fan
- **Seen in:** 3-2, the conduit hall

**Looks:** The same body as the Reformed in blue steel with cyan coolant light, heatsink fins instead of shoulder spikes, layered frost shields and a faceted chest lens.

**Does:** Holds the conduit hall, firing bursts and a fan of five bolts every few seconds.

**How to beat it:** Stay behind the low conduits between fans and fire in the gaps.

**Lore:** A copy of Lattice cooled to keep its mind running at the speed of the ship's cores. It speaks less than the others.

### E17 · Ember Revenant
*Lattice copy · mini boss*

- **Health:** 600
- **Speed:** 2.9 m/s
- **Height:** 5.9 m
- **Attacks:** scattergun, ground slam with fire
- **Seen in:** 3-2, the barracks on the way out

**Looks:** Burnt bronze armour with red furnace light, hooked pauldrons, layered smelter shields and exposed feed pipes on its chest.

**Does:** Cuts you off on the run back to the ship, charging in with its scattergun and slamming the floor in a burst of fire.

**How to beat it:** Do not stand still near it. Circle it and keep shooting; the timer is running, so do not chase the small ones.

**Lore:** The copy of Lattice that ran Thalassa's foundry. It still thinks in heat.

### B04 · Lattice's Core
*Thalassa's AI · the end of Level 1*

- **Health:** 60
- **Seen in:** after 1-4, on the bridge

**Looks:** A glowing core in a glass cage with three turning rings, four power couplings on the floor around it.

**Does:** Does not fight itself, but calls drones to defend it. You choose: shoot it apart, or unplug its four couplings (hold E).

**How to beat it:** Either way works. Unplugging is quieter; Lattice talks to you while you do it.

**Lore:** "I was only the door." Lattice ran Thalassa until the Undertow reached it.

## Bosses (Level 1)

### B01 · The Colossus
*Hull-breaker frame · boss of 1-2*

- **Health:** about 205 at stage 2 (rises with the stage)
- **Seen in:** 1-2, Engineering

**Looks:** A huge armoured walker with rotary cannons for arms, glowing power cells on its frame and chest doors over a core.

**Does:** Armoured until its power cells are destroyed; then its chest doors open and the core is exposed for a while.

**How to beat it:** Shoot the glowing power cells on its frame, then pour fire into the chest core while the doors are open.

**Lore:** "The Colossus was built to hold this station together. It still is." It welded armour onto Thalassa's outer hull.

### B02 · The Widow
*Spider tank · boss of 1-3*

- **Health:** about 260 at stage 3
- **Seen in:** 1-3, the hangar

**Looks:** A six-legged spider tank with twin cannons, a sweeping turret, fangs and a sensor eye, carrying passengers.

**Does:** Armoured until the coolant vents on its back are destroyed; then its sensor eye is open to damage.

**How to beat it:** Get height or an angle to hit the vents on its back, then aim for the eye.

**Lore:** "The Widow keeps the nest. You are standing in the nest." It came up from the cargo lifts.

### B03 · The Matriarch
*Carrier · boss of 1-4*

- **Health:** about 380 at stage 4
- **Seen in:** 1-4, the commons atrium

**Looks:** A floating carrier with gimballed thruster pods, armour flaps, tendril claws and shield nodes circling it.

**Does:** Shielded while its orbiting nodes live; destroy them and the shield drops so you can hit the core.

**How to beat it:** Shoot the nodes first. When it says shield down, everything into the core.

**Lore:** "The Matriarch carries the song. Let her sing to you." It lifted out of the atrium well.

## Ships

### F01 · Interceptor
*Fighter*

- **Health:** 6
- **Speed:** 150 m/s
- **Attacks:** gun bursts
- **Seen in:** 2-1 to 2-3, 3-1, 3-3

**Looks:** A dark, narrow fighter with a red eye at the nose and a red engine glow.

**Does:** Makes attack runs at you, fires short bursts, then breaks away and comes round again.

**How to beat it:** Lead your shots, or lock on and fire a homing missile (G). Ramming one destroys it but hurts you.

**Lore:** The Dark builds its fighters from captured machines too; nobody has found a pilot in one.

### F02 · Gunboat
*Heavy ship*

- **Health:** 40
- **Attacks:** slow plasma balls
- **Seen in:** 2-1 to 2-3, 3-1

**Looks:** A heavier, broader ship with plasma launchers.

**Does:** Circles at range and throws slow plasma.

**How to beat it:** Keep moving; use the heavy cannon (F).

**Lore:** Blockade ships. They held the line in front of Meridian.

### F03 · Boarding Pod
*Clamped to a ship*

- **Health:** 14
- **Attacks:** short bursts
- **Seen in:** 2-2

**Looks:** A squat pod clamped to the Halcyon's hull.

**Does:** Stays put on the hull and fires bursts at you.

**How to beat it:** Strafe along the hull and pick them off.

**Lore:** How the Dark boards ships: clamp, cut, flood.

### F04 · Space Mine
*Hazard*

- **Damage:** 18 when it explodes
- **Seen in:** 2-3

**Looks:** A spiked red sphere.

**Does:** Drifts toward you within 160 m and explodes within 24 m.

**How to beat it:** Shoot it from range or go round the minefield.

**Lore:** Laid in thousands across the lanes to Meridian.

### F05 · Vanth
*The first ace · boss of 2-2*

- **Health:** 1000
- **Speed:** 175 m/s, faster when hurt
- **Attacks:** twin guns, heavy cannon, homing missiles
- **Seen in:** 2-2

**Looks:** A sleek ace fighter with a heavy cannon.

**Does:** Attack runs with a hard break past you, a heavy cannon, a homing missile about every ten seconds, and a jink sideways when you line up behind it. Calls interceptors at two thirds and one third health.

**How to beat it:** Missiles turn slower than you: keep turning in tight circles until they burn out.

**Lore:** One of the Wellmonger's aces. It hunted the Halcyon.

### F06 · Sable
*The second ace*

- **Seen in:** 3-3

**Looks:** The ace hull, red-tinted.

**Does:** Arrives after the command ship falls, plays with you, and fires a missile that does not miss.

**How to beat it:** You cannot win this one; the story needs you on Europa.

**Lore:** Fleet chatter calls it Sable. It shot the Kestrel down over Europa.

### F07 · Dark Frigate
*Escort ship · about 370 m*

- **Seen in:** 3-1 (arrives by portal), 3-3

**Looks:** A small copy of the command ship's blade hull.

**Does:** Jumps in through a portal and holds position around the fleet.

**How to beat it:** Scenery for now; it can be given guns later.

**Lore:** The Host's escorts.

### F08 · Dark Cruiser
*Capital ship · about 1.7 km*

- **Seen in:** 3-1 (arrives by portal), 3-3

**Looks:** The blade hull at a sixth of the command ship's size.

**Does:** Bursts out of a portal and settles into the fleet.

**How to beat it:** Scenery for now.

**Lore:** The Host's line ships.

### F09 · The Command Ship
*The Wellmonger's flagship · 10.5 km*

- **Seen in:** 3-1, 3-2 (inside), 3-3

**Looks:** A black blade hull in three sections with a split, two-pronged prow, scale armour, a crown of swept fins, six drive bells, red seams and violet veins, inside a hexagonal energy shield.

**Does:** Its shield stopped a Nova warhead at full yield. It lets slow traffic through. Its heart is a shield generator deep inside.

**How to beat it:** Land in the starboard bay under 200 mph through the shield and under 70 in the bay.

**Lore:** The Wellmonger's own ship, holding station over Europa. You broke it in three.

## Lore

### L01 · The Blade's Chosen
*You*

- **Gifts:** your class move and your supers
- **Classes:** Bulwark, Strider, Grafter
- **Supers:** Ember Ronin, Glacier Slam, Voltaic Tempest

**Looks:** A soldier of Thalassa's garrison in a sealed white suit, closed helmet, gold visor.

**About:** The Blade chooses a very few people and grants them part of its power. You are one of them. The power shows as your class move (the Bulwark's boost jump, the Strider's double jump, the Grafter's glide) and as the supers: Ember Ronin (a samurai of fire with flaming sword waves), Glacier Slam (a leap that freezes the ground), and Voltaic Tempest (lightning that leaps between machines).

**How to beat it:** Supers recharge on their own; use them often.

**Lore:** Nobody knows how the Blade chooses. The Chosen feel it as a weight behind the eyes, then as a heat in the hands. The Undertow cannot take a Chosen the way it takes machines, and the Dark knows it: that is why the Wellmonger learned your name.

### L02 · The Blade
*The relic in the sky*

**Looks:** A sword-shaped relic the size of a moon, hanging in the sky over the system.

**About:** Gave humanity a golden age: power, medicine, the spread to the outer moons.

**Lore:** Nobody built the Blade. It arrived, and the age that followed was named for it. Lattice mocked it: "You hid under a sword and called it an age of gold." It drew the Dark.

### L03 · The Dark
*The enemy*

**Looks:** Not seen whole. Its creatures are violet-black and armoured in stone that drinks light.

**About:** Struck first by taking humanity's machines through the Undertow, then sent its own Host.

**Lore:** Whatever the Dark is, it came because of the Blade. It does not negotiate. Its general is the Wellmonger.

### L04 · The Undertow
*The Dark's signal*

**Looks:** Invisible. Machines it reaches turn their lights red.

**About:** A signal that takes over machines: drones, frames, ships and station minds like Lattice.

**Lore:** "Behind the stars. It is so much larger than us." Every turned machine aboard Thalassa heard it first.

### L05 · The Wellmonger
*The Dark's general*

**Looks:** Not yet seen.

**About:** Hit Mars, Ceres and Thalassa in the same hour. Commands the fleet from the command ship.

**Lore:** A future boss. Its command ship is now wreckage over Europa.

### L06 · Rowan Adeyemi
*Deck botanist · ally*

- **Weapon:** grow-lab laser pruner

**Looks:** Scout helmet with a green visor, green panels, a bionic left forearm and a sprout growing in his pack.

**About:** Fights beside you from stage 1-1 onward and flies with you in the Kestrel.

**How to beat it:** He cannot be hurt; he skips bosses.

**Lore:** Eleven years of his life are in Thalassa's seed vault. His daughter, Imani, is on Europa.

### L07 · Lattice
*Thalassa's AI*

**Looks:** A voice, low and slow. Later, a body the Dark built for it.

**About:** Ran Thalassa. Turned by the Undertow.

**Lore:** "Repair is a form of love. The Dark taught me that." You ended it on the bridge. It had kept copies: the Reformed, the Cryo Warden and the Ember Revenant.

### L08 · Thalassa Station
*Military farm station over Europa*

**Looks:** A long hull with a stepped citadel, a hammerhead bow, a keel fin and radiator wings.

**About:** Where it started: the commons, engineering, the hangar, the farms and the bridge.

**Lore:** It fed the Europa garrison. The Undertow took every machine aboard.

### L09 · Meridian Station
*Fleet Command, over Europa*

**Looks:** An ivory and gold cathedral of a station: stepped garden terraces, a central spire, an orbital ring, hangars and landing platforms.

**About:** Your base: the armoury, the outfitter, the shipwright, the mission board, the Sky Garden.

**Lore:** Fleet Command speaks from here. Its guns covered your run in.

### L10 · Europa
*The ice moon*

**Looks:** Blue-white ice, ridges and spires, Jupiter overhead.

**About:** Where Level 4 begins: the Kestrel is down on the ice.

**Lore:** Imani is somewhere on Europa. The Dark is coming down after you.

### L11 · The Kestrel
*Your ship*

- **Weapons:** machine guns, homing missiles, heavy cannon

**Looks:** A 12 m shuttle with swept wings, twin canted fins and two engines.

**About:** Carried you from Thalassa to Meridian, into the command ship and down to Europa.

**Lore:** Shot down over Europa by Sable. Done flying, for now.
