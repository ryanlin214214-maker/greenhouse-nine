# Owner's request after v92 (2026-11-20), split into workstreams

Order of work: F → C/E/B → D → E(GLB) → A → G. One patch per workstream (p101, p102, ...). Before/after poses scripted.

## A. Ship roster (Ace Combat-style roles, original designs)
- Interceptor: light, fast acceleration, tight turns, light armour, rapid guns, short-range missiles; chases fighters.
- Multirole fighter: balanced handling, armour, guns, missiles.
- Bomber: heavy armour, slow turning, limited boost, torpedoes/guided bombs vs capital ships, stations, groups.
  Visible arming sequence, big explosions.
- Ion cannon ship: big spinal cannon; hold fire to charge through visible stages; full charge = heavy shield damage +
  brief disruption; charging costs energy, builds heat, reduces manoeuvrability; enemies get a readable warning.
- Gunship: durable, moderate speed, multiple cannons, sustained fire; area defence; weak vs fast flankers.
- Recon / EW: agile, light arms, target marking, decoys, temporary missile-lock disruption; clear effects.
- Different accel, turn, brake, boost, durability, weapons, cockpit/chase camera. Strengths and weaknesses.
- Silhouettes: compact swept interceptors, broad payload bombers, reinforced central cannon and capacitor banks for ion
  ships, heavier weapon mounts on gunships. Ships, weapons, gear, engine fx aligned.
- Enemy behaviour: interceptors pursue/flank, bombers commit to attack runs, ion ships line up telegraphed shots,
  escorts protect heavy ships. Mixed formations introduced gradually.
- Integrate with shipwright, purchase, selection, launch, docking, save. Comparisons (handling, protection, weapons,
  specials). Hangar displays fit each ship; clear walking routes; reachable interaction points.
- Weapon sound + visual identities. Ion: contained glow → bright discharge with short electrical trail. Brief effects.
- Stages: bomber + ion first, verify full loops, then the rest. Test player + enemy versions: controls, switching,
  purchase, save/load, combat, landing, relaunch. Check every affected hangar for intersections/clearance.
- Deliver: build, concise comparison, screenshots of each ship, verified tests, what is unfinished.

## B. Meridian detail everywhere (no cutoff)
- Detailed section = baseline (layered facades, lit windows, gold trim, towers, depth) across the whole station.
- Investigate WHY detail stops: scene generation, sector boundaries, placement ranges, distance culling, LOD. Fix cause.
- Inspect full circumference, every hangar, outer deck, transit stop, concourse, passages, accessible upper levels.
  Variation by purpose; blended transitions.
- Consistent materials, texture scale, lighting, proportions, density. Panel divisions, supports, recesses, windows,
  entrances, service features. Clearance: no intersections, no blocked routes.
- Shared materials, instancing, gradual distance simplification without popping/bands.
- Verify at player height walking and riding transit round the ring; matching views both sides of every old cutoff;
  from space. Deliver: build, cause, sector checklist, screenshots.

## C. Grounding and spatial coherence (Sky Garden Terrace One first, then whole station)
- NPC feet, trees, lamps, benches, umbrellas, planters, ships, props meet their surface. Several angles; distinguish
  floating from missing contact shadow.
- Placement vs actual floor height (terraces, curved decks, ramps, elevated gardens). Origins, parent transforms,
  bounds, collision offsets.
- Buildings/platforms connect to supports; paths reach doors; stairs reach landings; lifts align; railings follow
  exposed edges leaving entrances clear.
- Garden: trees from soil/planters, furniture on usable surfaces, paths connect destinations, no vegetation in
  structures, no props blocking routes.
- NPC navigation on the right deck elevation (moving, turning, spawning, transit arrival).
- Fix shared placement logic and check every instance.
- Restrained contact shadows. Intentional hovering objects must read as such.
- Walk every terrace, garden, hangar, route afterwards. Log issue, cause, retest result. Before/after from matching
  positions. Say which areas could not be verified.

## D. Cutscenes
- Stutter; enemy legs sinking into ground. Check timing, placement, foot contact, terrain collision per sequence.
- Preloaded cinematic sequences: investigate in-engine authored vs pre-rendered video (and video-generation tools,
  consistency with real characters/locations).
- In-engine: preload models, textures, clips, effects, shaders; loading transition if needed; deliberate movement,
  grounded feet, framing that holds.
- Video: buffer enough, match look, fallback.
- Verify audio sync, skip, replay, return to gameplay (position, camera, controls, mission state). Empty cache and
  repeat playback. Start with the most visibly broken cutscene, finish and verify it.

## E. Sky Garden unfinished + GLB pipeline
- Why plain walls/columns and sparse surroundings were missed; explain briefly; finish all affected sectors (walls,
  supports, terrace edges, paths, lighting, materials, features). Grounding, intersections, collision, clearance.
- Area checklist of the whole station from player height with screenshots, including the plain areas shown.
- Future maps: Codex makes Blender environments + GLB; confirm import workflow, hosting, scale, materials, collision,
  performance limits. Build a small working room-and-corridor import.

## F. Space-flight atmosphere (3-1 screenshot)
- Far fewer dust particles and stars; most stars small, faint; few brighter. Fewer big blurry glowing specks and long
  speed streaks; subtle in cruise, gently more with afterburner.
- Two diagonal rows of evenly spaced white dots: identify the source, remove; if needed replace with HUD waypoint.
- Background depth: subtle colour, sparse stars, planetary lighting; planet curvature, shading, thin atmospheric rim.
  Faint, localized nebula.
- Ships readable against planet and space. Keep weapon/target/mission indicators; less clutter.
- All flight missions. Verify stationary, cruising, turning, afterburner. Before/after matching views; performance.

## G. Mission 3 rebuild (~15 min space battle, Europa landing, Europa map)
- Spectacle (original, "震撼"); keep developing nuke detonation and jump-in animations.
- ~50 allied ships across the encounter: fighter squadrons, bombers, escorts, support ships; formations, roles.
  Fighters intercept and protect bombers; bombers do coordinated runs with visible payloads damaging systems, then
  regroup/withdraw. Enemies respond with interceptors, defensive fire, counterattacks.
- Phases: jump into ongoing battle and rally; fight through interceptor screen; escort bombers, suppress defences;
  attack engines/shield generators/batteries; nuclear strike (launch sequence, travel, detonation, fleet reaction);
  escape blast and regroup for Europa. Adapt to the story. Tune duration by playtesting.
- Capital ships detailed for close runs: damage states, local fires, disabled weapons, debris, break-up. Targets stay
  visible through effects.
- Radio exchanges, huge ships overhead, reinforcements. An original allied ace/commander who fights.
- HUD: cleaner; shields, hull, speed, heat/ammo, objective readable; grouped; no overlaps; centre clear; compact
  waypoint symbols with short labels; expanded details for selected target; subtle edge indicators; fade near the
  crosshair; offset labels; limit markers; active vs optional distinct; brief instructions then compact objective;
  readable radio subtitles; brief announcements; HUD scale and waypoint-opacity settings if practical.
- Europa approach and landing: establish destination, route, deceleration, landing gear, settle on a proper pad,
  engine fx, blowing snow, touchdown weight, smooth transition to walking. Camera, collision, skip, replay, controls.
- Europa map: substantial, connected; ice formations, frozen industrial facilities, buried structures, exterior
  routes, sheltered interiors, landmarks. Purposeful route from landing to mission: combat spaces, branches, cover,
  elevation, discoveries. Cold light, distant silhouettes, wind snow, warm facility lights. Grounded, connected,
  no intersections.
- Formations, instancing, scalable fx, LOD simulation. Measure perf in busiest phase.
- Normal-control playthrough from 3 start through battle, nuke, landing, first ground objective; record duration,
  progression, perf, issues; HUD readability.

## Story default chosen (to tell the owner)
- 3-1: jump into a battle already under way beside the allied fleet; the first Nova hits the shield and does nothing
  (kept); enemy fleet jumps in; strip defences; landing order. 3-2 (inside, plant the charge) kept. 3-3: the charge drops
  the shield, the player delivers the second Nova into the exposed core (the real nuclear strike), escapes the blast,
  the nine chasers and Sable cripple the Kestrel, and 4-1 becomes a controlled emergency approach and gear-down landing
  on a pad at a frozen facility, then the Europa map and its first ground objective.
