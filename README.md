# Greenhouse Nine

A sci-fi first-person shooter and space-flight game that runs in the browser from a single HTML file.
Year 2687: a farm station above Europa has lost its AI to a hostile signal that takes over machines.
You fight through the station, fly a shuttle out, reach the orbital city Meridian, join a fleet battle
over Europa, and land on the ice.

**Play:** open `index.html` in a desktop browser (Chrome or Edge recommended). Imported maps need a local
web server (`python3 -m http.server`), not a double-click.

## What's in it

- **On foot:** a multilevel station (commons, farms, engineering, hangar, bridge, habitat, spines) with
  19 walkable staircases, enemy pathfinding on a flow field, cover use, flanking, and four boss fights.
- **Combat:** eight guns with attachments (sights, barrels, magazines, underbarrel), aim-down-sights,
  grenades, melee, supers, ragdoll deaths (cannon.js), damage-direction feedback.
- **Flight:** seven ships with distinct handling, weapons and specials: an interceptor with a dash,
  a multirole fighter, a recon ship with an EW pulse and decoys, a bomber with armed torpedoes, an ion
  cannon ship with a staged charge, heat and disruption, and a gunship with flak.
- **Mission 3:** a fleet battle with about 50 allied ships (instanced), capital ships that break up,
  escort runs and subsystem targets, then an on-foot sabotage stage and an escape.
- **Europa:** a guided approach and landing, then a ground map with a courtyard fight and a relay to restore.
- **Meridian:** a 2.4 km orbital city you can walk, drive and fly around, with shops, a ship hangar,
  transit stops, a terrace garden reached by lift, and the same model seen from space.
- **Cutscenes** played in-engine with preloaded actors and foot-planting IK.
- **Saves, credits and inventory**, a Codex of enemies and lore, recorded voice lines, a generated music
  sequencer, and a GLB map importer for levels built in Blender (`dev/glb/MAPS.md`).

## Tech

JavaScript, three.js 0.187 (inlined), cannon.js 0.6.2, Web Audio. Everything ships in one HTML file.
No build step for players. `dev/` holds the sources and the patch chain (`build.sh`) that produces `index.html`.

## Testing

Playwright scripts in `dev/` drive the game headless: route walks with pass/fail per leg, a bot pilot
that plays the fleet battle, ship take-off and landing checks for every ship, cutscene timing and foot
contact, a grounding checker for floating objects, and screenshot tours. The last release passed
174 automated checks.

## Credits

- three.js and cannon.js (MIT).
- Textures: Poly Haven and ambientCG (CC0).
- Voices: ElevenLabs (free plan, non-commercial use).

All ships, characters, places and story are original designs.
