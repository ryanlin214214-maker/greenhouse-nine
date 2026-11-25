# Imported maps: Blender → GLB → Greenhouse Nine

This is the hand-off sheet for building maps in Blender (for example with Codex) and bringing them into the game.
A working example is `test_room.glb` in this folder (made by `mkglb.py`, which follows the same rules a Blender export
does). In the game it is **Missions → Test maps → Imported room**.

## What the game supports

| Topic | Supported | Not supported |
| --- | --- | --- |
| File type | glTF 2.0 binary (`.glb`) | `.gltf` with separate `.bin` (allowed, but harder to publish) |
| Geometry | triangles, normals, one UV set, vertex colours, `KHR_mesh_quantization` | Draco compression, meshopt compression |
| Materials | Principled BSDF as glTF metal/rough: base colour, metallic, roughness, normal map, emissive, emission strength (`KHR_materials_emissive_strength`), alpha blend/clip, double-sided, `KHR_texture_transform` | KTX2/Basis textures, custom shader nodes (they are baked to nothing on export) |
| Textures | PNG, JPEG, WebP, embedded in the `.glb` | textures larger than 2048 px (allowed, but slow on phones) |
| Lights | Use `LIGHT_` empties (below); the game places its own lamps | Blender light objects (ignored) |
| Animation | not used by the loader yet | |

The engine is three.js 0.187 with its GLTFLoader built into the page. Draco, meshopt and KTX2 each need a decoder
downloaded at run time, which the artifact's security policy blocks, so **turn compression off** in the exporter.

## Blender export settings

File → Export → glTF 2.0:
- Format: **glTF Binary (.glb)**
- Include: Selected or Visible objects; **Custom Properties on** (lamp colours and ranges travel as extras)
- Transform: **+Y Up on** (Blender's default; Blender Z-up becomes game Y-up)
- Mesh: Apply Modifiers on, UVs on, Normals on, Vertex Colours as needed
- Compression: **off**
- Materials: Export; Images: Automatic (PNG/JPEG)

## Scale and orientation

- **1 Blender unit = 1 metre.** Player eye height is 1.55 m, a normal door is 2.4–3.2 m tall and 1.6–4 m wide, stairs
  are 0.18 m risers and 0.28 m treads, walls at least 0.2 m thick.
- The floor of the main area should be at Z = 0 in Blender (game Y = 0).
- Enemies use a navigation grid of 2.5 m cells over a 220 × 520 m area (x ±110, z ±260 in game metres). A map must fit
  inside that. If it is authored elsewhere the game moves its centre to the origin. Corridors narrower than about 3 m
  can confuse the robots; 4 m is safe.

## Object names (the important part)

| Name starts with | Meaning |
| --- | --- |
| `FLOOR_` | Visible, and a walkable floor (collision with "floor" status) |
| `SOLID_` | Visible and solid (walls, pillars, crates, ceilings) |
| `COL_` | Invisible collision only (simple blockers, smoothing an awkward shape) |
| anything else | Visible decoration, no collision (trim, lamps, signs, small props) |
| `SPAWN_player` | Empty: where the player starts. The empty's local +Y axis in Blender (glTF −Z) is the facing direction |
| `SPAWN_enemy_1`, `_2`, ... | Empties: robot spawn points |
| `LIGHT_name` | Empty: a lamp. Custom properties: `color` ("#ffd9a0"), `range` (metres, default 24), `intensity` (default 1.3) |

The prefix can also be on a parent object (an Empty named `SOLID_walls` with plain meshes under it).

**Collision is boxes.** Each `FLOOR_`/`SOLID_`/`COL_` object becomes one axis-aligned box per separate piece. Pieces are
found by connected geometry, so **pieces that touch merge into one box**: a door lintel touching the walls beside it would
fill the doorway. Make each collision box its own object, and group them under an Empty that carries the prefix
(`SOLID_walls` → `wall_left`, `lintel`, `wall_right`). So:
- keep collision pieces **axis-aligned** (a wall rotated 45° becomes a big square box). For angled walls, add a `COL_`
  staircase of thin boxes or an aligned simplified proxy.
- a solid piece that is not a simple box (an arch, a curved wall) gives its bounding box. Split arches into the two
  posts and the lintel, or add `COL_` proxies and leave the pretty mesh as plain decoration.
- ramps and stairs: make the steps as separate `FLOOR_` boxes (0.18 m risers); a smooth ramp is not walkable yet.
- leave doorways open in the collision. A wall piece that reaches the floor and is thinner than 1.6 m is also put on the
  robots' wall list, so they never cut through it.

## Performance limits (practical, for phones and laptops)

| Item | Comfortable | Upper limit |
| --- | --- | --- |
| Triangles in view | 300 k | 1 M |
| Materials (draw calls) | 30 | 150 |
| Texture size | 1024 px | 2048 px |
| Texture memory | 64 MB | 150 MB |
| `.glb` file size | 5 MB | 15 MB per file (artifact limit) |
| Collision boxes | 500 | 2,000 |

Join meshes that share a material (Ctrl+J) before export: draw calls, not triangles, are usually the limit. Bake
lighting into textures or vertex colours if you want soft shadows; the game adds 5 moving point lights (from `LIGHT_`
empties) and one sun.

## Hosting

The game looks for a map in three places, in this order:

1. `maps/NAME.glb` beside the page. Use this on an ordinary web server.
2. `maps/NAME.glb.txt`: the same file as base64 text. **Use this on hosts that refuse `.glb` files** but serve `.txt`. Make the text file with:
   `python3 -c "import base64,sys,textwrap;print('\n'.join(textwrap.wrap(base64.b64encode(open(sys.argv[1],'rb').read()).decode(),76)))" NAME.glb > NAME.glb.txt`
   and publish it with the Artifact tool's `files` option as `maps/NAME.glb.txt`. Base64 is a third larger than the
   `.glb`. Each supporting file may be up to 16 MB, so keep a map's `.glb` under about 12 MB.
3. The copy inlined in the page as base64 (`<script type="text/plain" id="glb-NAME_glb">`). This one works even from a
   downloaded file, where the page cannot fetch neighbours. It counts toward the page's own 16 MB limit, so inline only
   small maps. `test_room.glb` is inlined and published as `maps/test_room.glb.txt`.

Local testing needs a local web server (for example `python3 -m http.server` in the folder), not a double-click.
`tglb.js` tests all three: `node tglb.js PAGE` (inlined, file://), `node tglb.js PAGE http` (`.glb` over HTTP),
`node tglb.js PAGE httptxt` (only the `.glb.txt` is served).

## Bringing a new map in (steps)

1. Check the file: names, scale, triangle and material counts (`GLBM.stat` after loading prints them).
2. Publish it under `maps/`, add a Missions entry or a stage that calls `glbStart('NAME.glb')`.
3. Walk every route, check doors, stairs and floors with the walk tests, and run robots through it.

## Loader reference (in the game)

`glbSrc(name)` fetch or inline → `glbParse(buffer)` → `glbEnter(gltf, name)` swaps Thalassa's collision, rooms, lamps and
navigation for the map's (like the command-ship interior), `glbLeave()` restores them (also called by `reset` and
`hubEnter`). `GLBM` holds the loaded map: `boxes`, `rooms`, `fix`, `navw`, `sp` (spawns), `stat`.
