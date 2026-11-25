# Photo textures (CC0)

All CC0 (public domain), from Poly Haven (polyhaven.com) and ambientCG (ambientcg.com). No attribution required;
credited here anyway.

| Files | Source | Use tried |
|---|---|---|
| `hfloor_c/n/orm.jpg` | Poly Haven "hangar_concrete_floor" | hangar floor |
| `plates_c/n/orm.jpg` | ambientCG "MetalPlates004" | detail on robot armour and the Kestrel hull |
| `diamond_c/n/orm.jpg` | ambientCG "DiamondPlate001" | spine floors |

Each set: colour (1K, sRGB), normal (1K, OpenGL convention), and a packed ORM map (512: R = 1 / unused, G = roughness,
B = metalness).

`tex.py <src.html> <dst.html> [targets]` inlines them as data URIs and swaps them into existing materials on load
(`PBR.use`), keeping each material's brightness by matching the mean colour of the painted texture it replaces.

Result of the first try (v69 candidate, not shipped): at play distance the robots and the Kestrel looked the same,
the spine floors were not the material targeted (spines skip the room floor loop), and the hangar floor lost its
painted guide lines and tile pattern, which looked worse. Next attempt: use the normal and roughness maps as surface
detail only (`keepMap:true`) so painted markings stay, target surfaces seen up close, and judge from close-up
pictures.

Shipped in v77 as surface detail only (roughness/metalness everywhere, normals only where a material has none, no photo colour).
