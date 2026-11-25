# Lattice character family — Blender handoff

I'm developing Lattice, a fictional robotic boss with layered gunmetal armor, a broad masculine silhouette, large swept segmented horns, spiked shoulders, articulated claw geometry, and exposed mechanical joints. The original close-up reference informed the armor and hot-metal palette. The full-body design was built in Blender from a Python generator.

## Versions

- **The Reformed (original).** Dark gunmetal with orange seams, a circular chest reactor, and pointed shoulder armor.
- **Cryo Warden.** Blue steel and cyan coolant lights, swept heatsink fins in place of the shoulder spikes, layered frost shields, and a faceted chest lens.
- **Ember Revenant.** Burnt bronze and red furnace lighting, additional hooked pauldrons, layered smelter shields, and exposed chest feed pipes.

## Files and constraints

- Use the relevant PNG as the visual reference. The original has hero, front, rear, and detail views. Each variant has its own hero view.
- Use the matching `.blend` for edits. It preserves separate named parts, editable bevels, procedural metal grain, studio lighting, and cameras.
- Use the matching `.glb` for an engine import. This is a character-only export with metallic and emissive materials.
- `build_lattice_variants.py` is a self-contained source generator for all three versions. They are static and unrigged. The feet sit at ground level, the character faces Blender -Y, and the horns reach approximately 6.92 m at the chosen boss scale.

## Prompt to paste with the attachments

Continue this Lattice character in Blender. Use the attached render and the version notes above as the design reference. Use the provided build script or matching native Blender file as the edit source when available. Keep the silhouette recognizable and the armor parts independently editable. If you generate an updated asset, provide separate Blender and GLB files plus a render, and verify the files by opening and reimporting them.
