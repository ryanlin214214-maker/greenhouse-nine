# Writes a small test map GLB (a room, a corridor, a second room) using the Greenhouse Nine import conventions, without
# Blender, so the import path can be tested here. A Blender export following MAPS.md gives the same structure.
# Usage: python3 mkglb.py out.glb
import json, struct, sys, zlib, numpy as np
out = sys.argv[1] if len(sys.argv) > 1 else 'test_room.glb'
bin_parts = []; views = []; accessors = []
def add_view(data, target=None):
    off = sum(len(b) for b in bin_parts); pad = (-len(data)) % 4; bin_parts.append(data + b'\0' * pad)
    v = {"buffer": 0, "byteOffset": off, "byteLength": len(data)}
    if target: v["target"] = target
    views.append(v); return len(views) - 1
def add_acc(arr, typ, comp, target):
    vi = add_view(arr.tobytes(), target); a = {"bufferView": vi, "componentType": comp, "count": len(arr), "type": typ}
    if typ == "VEC3": a["min"] = arr.min(0).tolist(); a["max"] = arr.max(0).tolist()
    accessors.append(a); return len(accessors) - 1
def box(lo, hi, uvs=2.0):
    # 24 vertices, outward normals, UVs in metres / uvs so textures keep one scale on every face
    lo = np.array(lo, float); hi = np.array(hi, float); P = []; N = []; U = []; I = []
    for ax in range(3):
        for s in (0, 1):
            n = np.zeros(3); n[ax] = 1 if s else -1; a1, a2 = [k for k in range(3) if k != ax]
            c = []
            for (i, j) in ((0, 0), (1, 0), (1, 1), (0, 1)):
                p = np.zeros(3); p[ax] = hi[ax] if s else lo[ax]; p[a1] = hi[a1] if i else lo[a1]; p[a2] = hi[a2] if j else lo[a2]; c.append(p)
            b = len(P); P += c; N += [n] * 4; U += [[p[a1] / uvs, p[a2] / uvs] for p in c]
            tri = [(0, 1, 2), (0, 2, 3)]
            # wind counter-clockwise seen from outside
            if np.dot(np.cross(c[1] - c[0], c[2] - c[0]), n) < 0: tri = [(0, 2, 1), (0, 3, 2)]
            for t in tri: I += [b + t[0], b + t[1], b + t[2]]
    return P, N, U, I
meshes = []; nodes = []
def mesh_node(name, boxes, mat, extras=None):
    # collision groups: one object per box under an empty that carries the prefix (touching boxes must stay separate)
    if len(boxes) > 1 and name.split('_')[0] in ('SOLID', 'FLOOR', 'COL'):
        kids = []
        for i, b in enumerate(boxes):
            mesh_node(name.split('_', 1)[1] + '_%d' % i, [b], mat); kids.append(len(nodes) - 1)
        nodes.append({"name": name, "children": kids}); return
    P = []; N = []; U = []; I = []
    for lo, hi in boxes:
        p, n, u, i = box(lo, hi); b = len(P); P += p; N += n; U += u; I += [b + k for k in i]
    pa = add_acc(np.array(P, np.float32), "VEC3", 5126, 34962); na = add_acc(np.array(N, np.float32), "VEC3", 5126, 34962)
    ua = add_acc(np.array(U, np.float32), "VEC2", 5126, 34962); ia = add_acc(np.array(I, np.uint16), "SCALAR", 5123, 34963)
    meshes.append({"name": name, "primitives": [{"attributes": {"POSITION": pa, "NORMAL": na, "TEXCOORD_0": ua}, "indices": ia, "material": mat}]})
    nd = {"name": name, "mesh": len(meshes) - 1}
    if extras: nd["extras"] = extras
    nodes.append(nd)
def empty(name, pos, extras=None, rot=None):
    nd = {"name": name, "translation": list(pos)}
    if rot: nd["rotation"] = rot
    if extras: nd["extras"] = extras
    nodes.append(nd)
# a 256 px floor tile texture (PNG written by hand: dark tiles, light seams)
S = 256; img = np.zeros((S, S, 3), np.uint8); img[:] = (88, 92, 96)
for k in range(0, S, 64): img[k:k + 3, :] = (140, 136, 120); img[:, k:k + 3] = (140, 136, 120)
rng = np.random.default_rng(3); img = np.clip(img.astype(int) + rng.integers(-6, 7, (S, S, 1)), 0, 255).astype(np.uint8)
raw = b''.join(b'\0' + img[y].tobytes() for y in range(S))
def chunk(t, d): return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', S, S, 8, 2, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b'')
img_view = add_view(png)
materials = [
    {"name": "floor_tiles", "pbrMetallicRoughness": {"baseColorTexture": {"index": 0}, "metallicFactor": 0.1, "roughnessFactor": 0.75}},
    {"name": "wall_ivory", "pbrMetallicRoughness": {"baseColorFactor": [0.62, 0.6, 0.55, 1], "metallicFactor": 0.1, "roughnessFactor": 0.6}},
    {"name": "trim_gold", "pbrMetallicRoughness": {"baseColorFactor": [0.75, 0.55, 0.2, 1], "metallicFactor": 0.9, "roughnessFactor": 0.3}},
    {"name": "lamp_panel", "pbrMetallicRoughness": {"baseColorFactor": [1, 0.9, 0.75, 1], "metallicFactor": 0, "roughnessFactor": 0.5},
     "emissiveFactor": [1, 0.85, 0.6], "extensions": {"KHR_materials_emissive_strength": {"emissiveStrength": 3}}},
    {"name": "dark_metal", "pbrMetallicRoughness": {"baseColorFactor": [0.12, 0.13, 0.15, 1], "metallicFactor": 0.7, "roughnessFactor": 0.45}},
    {"name": "crate_orange", "pbrMetallicRoughness": {"baseColorFactor": [0.8, 0.38, 0.08, 1], "metallicFactor": 0.2, "roughnessFactor": 0.55}},
]
H = 5; T = 0.4
# floors (walkable collision)
mesh_node("FLOOR_roomA", [((-10, -0.3, -10), (10, 0, 10))], 0)
mesh_node("FLOOR_corridor", [((-2, -0.3, -34), (2, 0, -10))], 0)
mesh_node("FLOOR_roomB", [((-6, -0.3, -46), (6, 0, -34))], 0)
# walls: visible and solid. Room A with a 4 x 3.2 m door to the corridor; corridor walls; room B
mesh_node("SOLID_wallA", [((-10 - T, 0, 10), (10 + T, H, 10 + T)), ((-10 - T, 0, -10 - T), (-10, H, 10)), ((10, 0, -10 - T), (10 + T, H, 10)),
                          ((-10, 0, -10 - T), (-2, H, -10)), ((2, 0, -10 - T), (10, H, -10)), ((-2, 3.2, -10 - T), (2, H, -10))], 1)
mesh_node("SOLID_wallC", [((-2 - 0.3, 0, -34), (-2, 3.5, -10 - T)), ((2, 0, -34), (2 + 0.3, 3.5, -10 - T))], 1)
mesh_node("SOLID_wallB", [((-6 - T, 0, -46 - T), (6 + T, 4, -46)), ((-6 - T, 0, -46), (-6, 4, -34)), ((6, 0, -46), (6 + T, 4, -34)),
                          ((-6, 0, -34), (-2, 4, -34 + T)), ((2, 0, -34), (6, 4, -34 + T)), ((-2, 3.2, -34), (2, 4, -34 + T))], 1)
# ceilings (visible; solid so nothing pokes through)
mesh_node("SOLID_ceilA", [((-10.4, H, -10.4), (10.4, H + 0.3, 10.4))], 4)
mesh_node("SOLID_ceilC", [((-2.3, 3.5, -34), (2.3, 3.8, -10.4))], 4)
mesh_node("SOLID_ceilB", [((-6.4, 4, -46.4), (6.4, 4.3, -33.6))], 4)
# details: gold skirting and door frames (visual), a pillar and crates (solid), ceiling light panels (emissive)
mesh_node("trim", [((-9.95, 0, 9.85), (9.95, 0.25, 9.95)), ((-9.95, 0, -9.95), (-9.85, 0.25, 9.95)), ((9.85, 0, -9.95), (9.95, 0.25, 9.95)),
                   ((-2.25, 0, -10.5), (-2, 3.4, -9.9)), ((2, 0, -10.5), (2.25, 3.4, -9.9)), ((-2.25, 3.2, -10.5), (2.25, 3.45, -9.9)),
                   ((-2.25, 0, -34.1), (-2, 3.4, -33.5)), ((2, 0, -34.1), (2.25, 3.4, -33.5)), ((-2.25, 3.2, -34.1), (2.25, 3.45, -33.5))], 2)
mesh_node("SOLID_pillar", [((3.2, 0, 2.2), (4.8, H, 3.8))], 1)
mesh_node("SOLID_crates", [((-8, 0, 5), (-6.2, 1.6, 6.8)), ((-8, 1.6, 5.3), (-6.6, 2.8, 6.5)), ((7, 0, -7), (8.6, 1.2, -5.4)), ((3, 0, -44), (5, 1.4, -42))], 5)
mesh_node("lamps", [((-4, H - 0.08, -4), (4, H, -3.4)), ((-4, H - 0.08, 3.4), (4, H, 4)), ((-0.6, 3.42, -30), (0.6, 3.5, -14)), ((-3, 3.92, -41), (3, 4, -39))], 3)
# collision-only proxy: a low invisible block that stops walking into the gap behind the pillar (shows COL_ use)
mesh_node("COL_pillar_gap", [((4.8, 0, 2.6), (5.4, 2, 3.4))], 4)
# markers (empties): player start facing -z (glTF looks down -z by default), enemy spawns, lamps
empty("SPAWN_player", (0, 0, 6))
for i, p in enumerate([(-3, 0, -40), (3, 0, -40), (0, 0, -24)]): empty("SPAWN_enemy_%d" % (i + 1), p)
for name, p, c, r in [("LIGHT_roomA", (0, 4.4, 0), "#ffe2b8", 26), ("LIGHT_corridor", (0, 3.1, -22), "#cfe6ff", 18), ("LIGHT_roomB", (0, 3.6, -40), "#ffc890", 20)]:
    empty(name, p, {"color": c, "range": r})
binary = b''.join(bin_parts)
gltf = {"asset": {"version": "2.0", "generator": "greenhouse-nine mkglb.py"}, "extensionsUsed": ["KHR_materials_emissive_strength"],
        "scene": 0, "scenes": [{"name": "test_room", "nodes": [i for i in range(len(nodes)) if not any(i in n.get("children", []) for n in nodes)]}], "nodes": nodes, "meshes": meshes, "materials": materials,
        "textures": [{"source": 0, "sampler": 0}], "samplers": [{"magFilter": 9729, "minFilter": 9987, "wrapS": 10497, "wrapT": 10497}],
        "images": [{"bufferView": img_view, "mimeType": "image/png"}], "accessors": accessors, "bufferViews": views, "buffers": [{"byteLength": len(binary)}]}
js = json.dumps(gltf, separators=(',', ':')).encode(); js += b' ' * ((-len(js)) % 4)
glb = struct.pack('<III', 0x46546C67, 2, 12 + 8 + len(js) + 8 + len(binary)) + struct.pack('<II', len(js), 0x4E4F534A) + js + struct.pack('<II', len(binary), 0x004E4942) + binary
open(out, 'wb').write(glb); print(out, len(glb), 'bytes,', len(nodes), 'nodes')
