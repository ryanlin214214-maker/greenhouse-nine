# Lattice character family (Level 3 bosses)

Owner's notes (in the owner's words, tidied): Lattice, the ship AI we supposedly killed at the end of Level 1,
has copies. The Reformed is Lattice reborn and is the main boss. Cryo Warden and Ember Revenant are enemy mini
bosses built from Lattice. All three appear in Level 3, the ground invasion.

The files arrived on 2026-11-18 (Lattice_Character_Family.zip) and are unpacked in `files/`:

| File | What it is |
|---|---|
| `Lattice.glb`, `Lattice_Warden.glb`, `Lattice_Revenant.glb` | engine models: The Reformed, Cryo Warden, Ember Revenant |
| `Lattice.blend`, `Lattice_Warden.blend`, `Lattice_Revenant.blend` | Blender sources with named parts, bevels, lighting and cameras |
| `Lattice_Hero.png`, `Lattice_Front.png`, `Lattice_Rear.png`, `Lattice_Detail.png` | The Reformed reference renders |
| `Lattice_Warden_Hero.png`, `Lattice_Revenant_Hero.png` | variant reference renders |
| `build_lattice_variants.py` | the owner's Blender generator for all three (runs inside Blender; not run here) |
| `Lattice_Claude_Handoff.md` | the owner's handoff note (same text as below) |

Inspection of the GLBs: about 83,600 / 83,600 / 84,800 triangles; 563 / 563 / 575 separate meshes, one node per
named part ("L Achilles ram barrel", "L calf exhaust louver", "Cryogenic reactor lens", "L Armored furnace feed" ...);
8 materials each ("Forged gunmetal", "Blackened armor", "Exposed machined edges", "Carbon actuator housings",
"Oxidized copper inserts", "Ember conduits" (emissive), "Furnace optics" (emissive), "Sintered horn alloy"); no
textures; uses KHR_materials_emissive_strength (GLTFLoader in the v68 bundle supports it).

## Blender handoff brief (from the owner)

Lattice is a fictional robotic boss with layered gunmetal armor, a broad masculine silhouette, large swept
segmented horns, spiked shoulders, articulated claw geometry, and exposed mechanical joints. The original close-up
reference informed the armor and hot-metal palette. The full-body design was built in Blender from a Python generator.

### Versions

- **The Reformed (original).** Dark gunmetal with orange seams, a circular chest reactor, and pointed shoulder armor.
- **Cryo Warden.** Blue steel and cyan coolant lights, swept heatsink fins in place of the shoulder spikes, layered
  frost shields, and a faceted chest lens.
- **Ember Revenant.** Burnt bronze and red furnace lighting, additional hooked pauldrons, layered smelter shields,
  and exposed chest feed pipes.

### Files and constraints

- Use the relevant PNG as the visual reference. The original has hero, front, rear, and detail views. Each variant
  has its own hero view.
- Use the matching `.blend` for edits. It preserves separate named parts, editable bevels, procedural metal grain,
  studio lighting, and cameras.
- Use the matching `.glb` for an engine import. This is a character-only export with metallic and emissive materials.
- `build_lattice_variants.py` is a self-contained source generator for all three versions. They are static and
  unrigged. The feet sit at ground level, the character faces Blender -Y, and the horns reach approximately 6.92 m
  at the chosen boss scale.

### Prompt to paste with the attachments

Continue this Lattice character in Blender. Use the attached render and the version notes above as the design
reference. Use the provided build script or matching native Blender file as the edit source when available. Keep
the silhouette recognizable and the armor parts independently editable. If you generate an updated asset, provide
separate Blender and GLB files plus a render, and verify the files by opening and reimporting them.

## Notes for using them in the game

- Static and unrigged: to animate them (walk, swing, stomp), group the named parts by limb (the L/R prefixes and
  names like thigh, calf, ankle, forearm, digital, horn, helmet make this possible), put each limb under a pivot
  group at its joint, and drive the pivots from code the way the existing bosses are driven. Rigging in Blender
  first is the alternative.
- 563 meshes would be 563 draw calls per boss: after grouping, merge each limb's parts per material
  (about 15 limbs x up to 8 materials), which brings it down to roughly 40-60 draw calls.
- Blender -Y forward becomes three.js +Z after the glTF export's axis conversion; check the facing on import.
- About 6.9 m tall at boss scale: bigger than the Colossus. Level 3 arenas need the headroom.

## What the owner's renders show (four images seen in chat on 2026-11-18; not saved as files)

The three versions share one body; only materials, light colour and the shoulder/chest dressing change.

- **Build.** Very broad, top-heavy humanoid. A small angular head sits low between huge shoulders. A barrel chest of
  faceted plates: two big pec plates, then about five horizontal rib slats on each side, with a glowing seam between
  each slat, and a central chest emblem. A narrow hexagonal waist belt with a triangular codpiece plate and a glowing
  slit.
- **Head and horns.** Faceted helmet with a raised crest, V-shaped glowing eyes and a small mouth grille. Two long
  segmented horns grow from the sides of the head and curve up and inward like a bull's, about head-to-waist in
  length. Their ringed segments carry glowing rings on the hot versions.
- **Shoulders.** Massive blocky pauldrons with an angled visor-like glowing line, layered plates hanging below, and
  three or four spikes on top. The Cryo Warden has heatsink fins instead; the Ember Revenant has hooked spikes.
- **Arms.** Layered upper-arm plates. Forearm guards with a three-slat vent grille and spike fins at the elbow.
  Clawed hands with long talon fingers.
- **Legs and feet.** Thick armoured thighs with a long glowing slit. Round exposed knee and hip joints with a hex knee
  plate and a glowing diamond inset. Separate shin greaves with a vertical glowing slit and rivets, and a piston at
  the calf. Blocky feet with three rounded claw toes and a heel block.
- **Surface.** Rough cast-metal grain on the plates, sharp bevels, exposed darker joint metal between the plates.

| Version | Metal | Glow | Chest | Shoulders |
|---|---|---|---|---|
| The Reformed (main boss) | dark gunmetal, a little rust on the edges | orange-red, eyes and horn rings orange | octagonal reactor ring with a pentagon core, orange | dark steel spikes |
| Cryo Warden (mini boss) | pale blue steel and silver, frost-white edges | cyan-white | faceted hexagonal lens, cyan | flat swept heatsink fins |
| Ember Revenant (mini boss) | burnt bronze and copper over dark grey | red furnace | octagonal ring, red | hooked, curved spikes |
