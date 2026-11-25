"""Generate Lattice, The Reformed. Run with Blender 4.5+ in background mode.

blender -b -t 8 --python build_lattice.py -- --output ./lattice --render
"""
import argparse
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

parser = argparse.ArgumentParser()
parser.add_argument('--output', type=Path, default=Path(__file__).resolve().parent)
parser.add_argument('--render', action='store_true')
parser.add_argument('--variant', choices=('Warden','Revenant'))
args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])
out = args.output.resolve()
out.mkdir(parents=True, exist_ok=True)
stem = f"Lattice_{args.variant}" if args.variant else "Lattice"
title = "Lattice, The Reformed"
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'


def collection(name):
    group = bpy.data.collections.new(name)
    scene.collection.children.link(group)
    return group


def material(name, color, metal, rough, emission=0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.diffuse_color = (*color, 1)
    shader = mat.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*color, 1)
    shader.inputs['Metallic'].default_value = metal
    shader.inputs['Roughness'].default_value = rough
    shader.inputs['Emission Color'].default_value = (*color, 1)
    shader.inputs['Emission Strength'].default_value = emission
    return mat


steel = material('01 • Forged gunmetal', (.048,.059,.071), .87,.35)
dark = material('02 • Blackened armor', (.018,.024,.034), .84,.37)
edge = material('03 • Exposed machined edges', (.135,.15,.175), .86,.32)
frame = material('04 • Carbon actuator housings', (.015,.021,.028), .43,.44)
copper = material('05 • Oxidized copper inserts', (.22,.075,.032), .8,.36)
heat = material('06 • Ember conduits', (1,.065,.009), .22,.29, 3.4)
hot = material('07 • Furnace optics', (1,.235,.025), .14,.26, 6.0)
horn = material('08 • Sintered horn alloy', (.075,.060,.056), .74,.31)
floor = material('Studio • Platform', (.034,.046,.060), .48,.43)
ground = material('Studio • Stage', (.015,.025,.039), .24,.53)

body_groups = []
group = None


def section(name):
    global group
    group = collection(name)
    body_groups.append(group)


def finish(obj, name, mat, bevel=0, smooth=False):
    obj.name = name
    for old in list(obj.users_collection):
        old.objects.unlink(obj)
    group.objects.link(obj)
    obj.data.materials.append(mat)
    if smooth:
        for face in obj.data.polygons:
            face.use_smooth = True
    if bevel:
        modifier = obj.modifiers.new('Machined bevel', 'BEVEL')
        modifier.width = bevel
        modifier.segments = 2
        modifier = obj.modifiers.new('Face-weighted normals', 'WEIGHTED_NORMAL')
        modifier.keep_sharp = True
    return obj


def mesh(name, verts, faces, mat, bevel=0, smooth=False):
    data = bpy.data.meshes.new(name)
    data.from_pydata(verts, [], faces)
    data.update()
    return finish(bpy.data.objects.new(name, data), name, mat, bevel, smooth)


def block(name, center, dims, mat, bevel=.025, angle=0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=center)
    obj = bpy.context.object
    for vert in obj.data.vertices:
        for i in range(3):
            vert.co[i] *= dims[i]
    obj.rotation_euler.y = angle
    return finish(obj, name, mat, bevel)


def rod(name, a, b, r1, r2, mat, sides=16, bevel=.006):
    delta = Vector(b)-Vector(a)
    bpy.ops.mesh.primitive_cone_add(vertices=sides, radius1=r1, radius2=r2,
                                   depth=delta.length, location=(Vector(a)+Vector(b))/2)
    obj = bpy.context.object
    obj.rotation_euler = delta.to_track_quat('Z','Y').to_euler()
    return finish(obj, name, mat, bevel)


def piston(name, a, b, r):
    a, b = Vector(a), Vector(b)
    rod(name+' barrel', a, a.lerp(b,.65), r, r, frame)
    rod(name+' chrome shaft', a.lerp(b,.60), b, r*.60, r*.60, edge)
    for t in (.09,.51,.63):
        rod(name+' ferrule', a.lerp(b,t), a.lerp(b,t+.055), r*1.17, r*1.17, steel)


def sweep(name, points, radii, mat, sides=10, aspect=1):
    points = list(map(Vector, points))
    verts = []
    for i, (pt, radius) in enumerate(zip(points, radii)):
        tangent = (points[min(i+1,len(points)-1)]-points[max(0,i-1)]).normalized()
        axis = Vector((0,1,0)) if abs(tangent.y)<.95 else Vector((1,0,0))
        across = tangent.cross(axis).normalized()
        up = tangent.cross(across).normalized()
        for j in range(sides):
            angle = math.tau*j/sides
            verts.append(pt + radius*(across*math.cos(angle)+up*math.sin(angle)*aspect))
    faces = [tuple(reversed(range(sides)))]
    for i in range(len(points)-1):
        for j in range(sides):
            k = (j+1)%sides
            faces.append((i*sides+j,i*sides+k,(i+1)*sides+k,(i+1)*sides+j))
    faces.append(tuple(range(len(verts)-sides,len(verts))))
    return mesh(name, verts, faces, mat, smooth=True)


def plate(name, outline, mat=steel, depth=.12, crown=.055, bevel=.016, back=False):
    # Each outline consists of explicit (x, y, z) coordinates. The inset crown
    # creates a broad face surrounded by sloped shoulders.
    direction = 1 if back else -1
    verts = list(map(Vector, outline))
    normal = (verts[1]-verts[0]).cross(verts[2]-verts[1])
    if normal.y*direction < 0:
        verts.reverse()
    n = len(verts)
    center = sum(verts, Vector())/n
    rings = ([v-Vector((0,direction*depth,0)) for v in verts] + verts +
             [v.lerp(center,.16)+Vector((0,direction*crown,0)) for v in verts])
    faces = [tuple(reversed(range(n))), tuple(range(2*n,3*n))]
    for row in (0,1):
        for i in range(n):
            j = (i+1)%n
            faces.append((row*n+i,row*n+j,(row+1)*n+j,(row+1)*n+i))
    return mesh(name, rings, faces, mat, bevel)


def panel(name, y, outline, mat=steel, depth=.12, crown=.055, back=False):
    points = [(p[0],y+(p[2] if len(p)>2 else 0),p[1]) for p in outline]
    return plate(name, points, mat, depth, crown, back=back)


def fastener(name,x,y,z,back=False):
    d = 1 if back else -1
    rod(name, (x,y,z), (x,y+d*.034,z), .033,.030, edge, 8, .003)
    block(name+' slot', (x,y+d*.036,z), (.037,.009,.008), frame, .002, .42)


def vent(name,x,y,z,sign=1,count=4,back=False):
    d = 1 if back else -1
    panel(name+' recess',y,[(x-sign*.14,z+.15),(x+sign*.16,z+.21),
                            (x+sign*.14,z-.10),(x-sign*.12,z-.17)],
          frame, .04,.012,back)
    for i in range(count):
        h = z+.115-i*.063
        a = (x-sign*.105,y+d*.021,h)
        b = (x+sign*.105,y+d*.021,h+.048)
        sweep(name+' emitter', [a,b], [.010,.010], heat,6)
        sweep(name+' louver', [(a[0],a[1]+d*.012,a[2]+.019),
                              (b[0],b[1]+d*.012,b[2]+.019)], [.018,.018], dark,6)


def mirrored_outline(sign, points):
    return [(sign*p[0], *p[1:]) for p in points]


section('01 | Torso and reactor')
panel('Thoracic structural cast',-.25,[(-.50,3.30),(-.93,3.96),(-1.14,4.55),
      (-.72,4.94),(.72,4.94),(1.14,4.55),(.93,3.96),(.50,3.30)], frame,.85,.12)
rod('Reactor casing',(0,-.32,4.42),(0,-.65,4.42),.29,.25,edge,10)
rod('Reactor seal',(0,-.65,4.42),(0,-.69,4.42),.208,.208,frame,10)
rod('Reactor light',(0,-.69,4.42),(0,-.708,4.42),.155,.155,hot,10)
panel('Reactor iris',-.724,[(-.10,4.46),(0,4.56),(.10,4.46),(.063,4.35),(-.063,4.35)],dark,.025,.029)
panel('Sternum blade',-.59,[(-.18,4.17),(0,4.24),(.18,4.17),(.135,3.82),(0,3.57),(-.135,3.82)],steel,.095,.10)
panel('Collar keystone',-.51,[(-.27,4.94),(.27,4.94),(.17,4.69),(0,4.61),(-.17,4.69)],dark,.13,.07)
for s, label in ((-1,'L'),(1,'R')):
    def chest(name,y,shape,mat=steel,depth=.12,crown=.055):
        return panel(label+' '+name,y,mirrored_outline(s,shape),mat,depth,crown)

    chest('Pectoral carrier',-.50,[(.16,4.67),(.43,4.88),(.95,4.78),(1.15,4.55),
          (.94,4.28),(.34,4.16),(.24,4.34)],dark,.23,.105)
    chest('Pectoral face',-.62,[(.24,4.64),(.48,4.82),(.92,4.72),(1.04,4.57),
          (.86,4.38),(.40,4.27),(.32,4.43)],steel,.12,.07)
    chest('Collar cutting edge',-.68,[(.31,4.69),(.49,4.85),(.96,4.76),
          (1.06,4.64),(.56,4.74)],edge,.035,.022)
    sweep(label+' pectoral seam', [(s*.31,-.653,4.31),(s*.42,-.69,4.23),
          (s*.89,-.69,4.33),(s*1.03,-.65,4.44)],[.017,.017,.017,.011],heat)
    fastener(label+' chest anchor',s*.76,-.692,4.60)
    for i in range(4):
        z=4.10-i*.181
        scale=1-i*.095
        chest('Overlapping rib %02d'%i,-.49+i*.023,
              [(x*scale,z+dz) for x,dz in [(.17,.03),(.42,.14),(.89,.24),
               (.92,.10),(.60,-.03),(.21,-.08)]],steel if i%2==0 else dark,.18,.07)
        sweep(label+' intercostal light',[(s*.24*scale,-.52+i*.023,z-.063),
              (s*.62*scale,-.53+i*.023,z-.02),(s*.83*scale,-.52+i*.023,z+.07)],
              [.012,.015,.008],heat)
    piston(label+' lateral waist strut',(s*.56,.04,3.18),(s*.86,.08,4.10),.09)

section('02 | Dorsal assembly')
panel('Dorsal carapace',.54,[(-.99,4.62),(-.63,4.91),(.63,4.91),(.99,4.62),
      (.65,3.82),(.39,3.56),(-.39,3.56),(-.65,3.82)],dark,.20,.16,True)
for i in range(8):
    z=3.36+i*.185
    w=.19+i*.014
    panel('Spinal vertebra %02d'%i,.68,[(-w,z+.08),(0,z+.13),(w,z+.08),
          (w*.84,z-.07),(0,z-.11),(-w*.84,z-.07)],steel,.20,.065,True)
    block('Vertebral status strip',(0,.754,z),(.058,.028,.041),heat,.008)
for s,label in ((-1,'L'),(1,'R')):
    panel(label+' exhaust shell',.70,mirrored_outline(s,[(.32,4.70),(.62,4.92),(.93,4.76),
          (.97,4.31),(.67,4.06),(.38,4.28)]),steel,.23,.10,True)
    vent(label+' upper exhaust',s*.64,.812,4.53,s,5,True)
    vent(label+' lower exhaust',s*.54,.665,4.10,s,3,True)
    for i in range(3):
        x=s*(.33+i*.098)
        sweep(label+' exposed return line',[(x,.52,3.45),(x+s*.09,.65,3.66),
              (x+s*.21,.70,3.96),(x+s*.21,.68,4.22)],[.036]*4,copper if i==1 else frame)

section('03 | Helmet and horns')
rod('Neck gimbal',(0,0,4.73),(0,0,5.15),.26,.22,frame,12)
for i in range(5):
    z=4.81+i*.055
    rod('Neck retaining ring',(0,0,z),(0,0,z+.025),.265,.265,edge if i%2 else dark)
panel('Helmet casting',-.29,[(-.38,5.20),(-.43,5.47),(-.27,5.66),
      (.27,5.66),(.43,5.47),(.38,5.20),(.20,4.96),(-.20,4.96)],dark,.65,.095)
panel('Face mask',-.385,[(-.32,5.37),(-.23,5.49),(0,5.44),(.23,5.49),(.32,5.37),
      (.22,5.12),(.11,5.01),(-.11,5.01),(-.22,5.12)],frame,.12,.07)
panel('Central helmet crest',-.42,[(-.18,5.56),(0,5.72),(.18,5.56),(.10,5.37),
      (0,5.26),(-.10,5.37)],steel,.23,.095)
panel('Respirator chin',-.455,[(-.12,5.17),(0,5.22),(.12,5.17),(.14,5.05),
      (.07,4.97),(-.07,4.97),(-.14,5.05)],steel,.10,.056)
panel('Occipital armor crown',.385,[(-.35,5.44),(-.24,5.59),(.24,5.59),
      (.35,5.44),(.23,5.24),(-.23,5.24)],steel,.12,.084,True)
panel('Occipital access hatch',.468,[(-.20,5.46),(0,5.55),(.20,5.46),
      (.15,5.29),(-.15,5.29)],dark,.074,.035,True)
for side in (-1,1):
    for i in range(3):
        z=5.455-i*.044
        sweep('Occipital diagnostic slot',[(side*.041,.507,z-.021),
              (side*.143,.505,z)],[.008,.007],heat,6)
    fastener('Occipital captive fastener',side*.20,.46,5.49,True)
    sweep('Neck return conduit',[(side*.17,.355,5.29),(side*.24,.40,5.15),
          (side*.19,.30,4.98),(side*.14,.20,4.86)],[.038,.047,.041,.035],copper)
for i in range(3):
    block('Respirator port',(0,-.519,5.125-i*.033),(.139-i*.027,.018,.014),
          heat if i==0 else frame,.004)
for s,label in ((-1,'L'),(1,'R')):
    def face(name,y,shape,mat=steel,depth=.12,crown=.055):
        panel(label+' '+name,y,mirrored_outline(s,shape),mat,depth,crown)
    face('Optic',-.493,[(.074,5.324),(.31,5.405),(.281,5.345),(.104,5.286)],hot,.03,.008)
    face('Brow',-.512,[(.055,5.365),(.27,5.515),(.38,5.477),(.32,5.408),
         (.096,5.332)],dark,.13,.035)
    face('Cheek blade',-.466,[(.145,5.277),(.36,5.394),(.389,5.255),
         (.246,5.06),(.151,5.075),(.225,5.188)],steel,.17,.041)
    face('Mandible edge',-.500,[(.179,5.119),(.297,5.267),(.333,5.256),
         (.23,5.083),(.155,5.034)],edge,.055,.021)
    rod(label+' auditory hub',(s*.32,.035,5.38),(s*.444,.035,5.38),.15,.125,copper,12)
    rod(label+' hub cap',(s*.444,.035,5.38),(s*.482,.035,5.38),.097,.081,dark,10)

    def horn_path(t):
        theta = 2.07*t
        return Vector((s*(.31+.60*math.sin(theta)+.15*t),
                       .04+.16*math.sin(math.pi*t)-.23*t*t,
                       5.46+.20*t+.85*(1-math.cos(theta))))
    ts=[i/48 for i in range(49)]
    radii=[.185*(1-t)**.76+.004 for t in ts]
    sweep(label+' continuous swept horn',[horn_path(t) for t in ts],radii,horn,16,.83)
    for i in range(11):
        t=i*.080
        r=.185*(1-t)**.76+.004
        a,b=horn_path(t),horn_path(t+.036)
        rod(label+' horn scute %02d'%i,a,b,r*1.07,r*.99,steel if i%3==0 else dark,12,.007)
        if i in (1,4,7):
            rod(label+' horn filament',a,a.lerp(b,.19),r*1.079,r*1.071,heat,12,.002)

section('04 | Pelvis')
panel('Hip transmission',-.30,[(-.57,3.33),(.57,3.33),(.71,3.05),(.46,2.79),
      (-.46,2.79),(-.71,3.05)],frame,.68,.08)
panel('Pelvis keel',-.52,[(-.24,3.30),(.24,3.30),(.33,3.01),(0,2.75),(-.33,3.01)],
      steel,.23,.101)
panel('Keel inlay',-.629,[(-.13,3.16),(0,3.23),(.13,3.16),(0,2.90)],dark,.035,.025)
sweep('Keel diagnostic light',[(0,-.657,3.14),(0,-.657,3.01)],[.014,.011],heat,8)
for s,label in ((-1,'L'),(1,'R')):
    panel(label+' hip skirt',-.37,mirrored_outline(s,[(.26,3.28),(.64,3.38),
          (.82,3.21),(.80,2.91),(.51,2.87),(.34,3.01)]),dark,.29,.084)
    panel(label+' hip skirt facing',-.48,mirrored_outline(s,[(.32,3.24),(.62,3.31),
          (.73,3.17),(.66,2.99),(.52,2.96),(.40,3.04)]),steel,.14,.048)
    fastener(label+' hip lock',s*.60,-.534,3.16)

for s,label in ((-1,'L'),(1,'R')):
    def p(x,y,z):
        return (s*x,y,z)

    def armor(name,y,shape,mat=steel,depth=.12,crown=.055,back=False):
        return panel(label+' '+name,y,mirrored_outline(s,shape),mat,depth,crown,back)

    def pipe(name,points,radii,mat,sides=10):
        return sweep(label+' '+name,[p(*v) for v in points],radii,mat,sides)

    section('05 | '+label+' Shoulder and arm')
    rod(label+' shoulder axle',p(.83,.04,4.58),p(1.56,.04,4.58),.317,.273,frame,16)
    rod(label+' shoulder hub',p(1.41,.03,4.57),p(1.78,.03,4.57),.29,.25,copper,12)
    armor('Pauldron envelope',-.40,[(.99,4.80),(1.26,5.10),(1.69,5.07),
          (2.01,4.82),(1.97,4.57),(1.59,4.33),(1.23,4.49)],dark,.80,.125)
    armor('Pauldron shield',-.52,[(1.08,4.79),(1.32,5.04),(1.71,4.99),
          (1.91,4.79),(1.81,4.62),(1.46,4.50),(1.22,4.57)],steel,.18,.086)
    armor('Pauldron crown',-.571,[(1.16,4.83),(1.34,5.07),(1.71,5.04),
          (1.91,4.84),(1.61,4.91),(1.33,4.86)],edge,.13,.043)
    armor('Pauldron rear shell',.46,[(1.10,4.78),(1.29,5.06),(1.67,5.02),
          (1.95,4.80),(1.91,4.54),(1.52,4.40),(1.20,4.48)],steel,.27,.08,True)
    for i in range(3):
        armor('Overlapping shoulder lame %02d'%i,-.43+i*.018,
              [(x+i*.047,z-i*.126) for x,z in [(1.35,4.70),(1.71,4.75),
               (1.98,4.65),(1.90,4.47),(1.62,4.38),(1.39,4.47)]],
              dark if i%2==0 else steel,.38,.05)
    pipe('Pauldron ember seam',[(1.18,-.60,4.76),(1.35,-.63,4.96),
         (1.66,-.63,4.94),(1.86,-.61,4.77)],[.011,.019,.019,.012],heat)
    for i,(x,y,z) in enumerate([(1.36,.05,4.98),(1.65,.10,4.98),
                                (1.87,.13,4.79),(1.75,.40,4.77)]):
        pipe('Pauldron spike %02d'%i,[(x,y,z),(x+.12,y+.055,z+.20),
             (x+.26,y+.09,z+.39),(x+.35,y+.13,z+.54-i*.061)],
             [.176,.137,.068,.004],steel,7)
        rod(label+' spike seat',p(x,y,z-.06),p(x+.064,y+.028,z+.11),.20,.16,dark,8)
    fastener(label+' pauldron latch',s*1.48,-.614,4.72)

    rod(label+' humeral shaft',p(1.48,0,4.57),p(1.76,.015,3.68),.23,.195,frame,12)
    armor('Upper-arm face',-.33,[(1.29,4.37),(1.47,4.55),(1.73,4.43),
          (1.84,4.06),(1.73,3.80),(1.48,3.88)],steel,.29,.068)
    armor('Upper-arm rear cover',.31,[(1.33,4.39),(1.52,4.49),(1.73,4.33),
          (1.83,3.93),(1.72,3.82),(1.52,3.90)],dark,.24,.052,True)
    piston(label+' upper arm return ram',p(1.30,.29,4.40),p(1.53,.24,3.71),.073)
    rod(label+' elbow swivel',p(1.50,.015,3.71),p(1.99,.015,3.71),.215,.195,dark,16)
    rod(label+' elbow locking ring',p(1.95,.015,3.71),p(2.02,.015,3.71),.143,.128,edge,12)
    rod(label+' elbow light',p(2.02,.015,3.71),p(2.046,.015,3.71),.081,.071,heat,12)
    rod(label+' forearm spine',p(1.77,0,3.67),p(1.96,-.16,2.89),.25,.16,frame)
    armor('Vambrace base',-.37,[(1.55,3.60),(1.78,3.89),(2.05,3.73),(2.20,3.38),
          (2.12,2.98),(1.93,2.86),(1.71,3.12)],dark,.61,.125)
    armor('Vambrace face',-.51,[(1.65,3.57),(1.81,3.78),(2.02,3.63),(2.14,3.39),
          (2.03,3.00),(1.90,3.01),(1.78,3.20)],steel,.22,.08)
    armor('Vambrace outer rail',-.545,[(2.04,3.62),(2.20,3.66),(2.25,3.49),
          (2.14,3.11),(2.04,3.01),(2.10,3.40)],edge,.16,.043)
    armor('Vambrace back plate',.27,[(1.60,3.57),(1.79,3.75),(2.05,3.58),
          (2.13,3.26),(2.01,3.00),(1.78,3.06)],steel,.29,.11,True)
    vent(label+' forearm vent',s*1.945,-.594,3.39,s,4)
    pipe('Forearm return hose',[(1.59,.16,3.78),(1.57,.26,3.55),(1.69,.30,3.22),
         (1.85,.17,3.00)],[.040,.047,.047,.031],copper)
    for i in range(2):
        pipe('Vambrace spur',[(2.05,.06,3.65-i*.23),(2.21,.10,3.81-i*.24),
             (2.31,.15,4.02-i*.25)],[.10,.066,.004],dark,7)

    section('06 | '+label+' Clawed hand')
    rod(label+' wrist coupling',p(1.97,-.16,3.02),p(2.00,-.20,2.77),.143,.137,edge)
    armor('Palm exoskeleton',-.374,[(1.78,2.84),(1.90,2.94),(2.09,2.90),
          (2.22,2.73),(2.15,2.59),(1.84,2.59)],dark,.33,.065)
    armor('Dorsal hand guard',-.449,[(1.83,2.83),(1.95,2.89),(2.11,2.83),
          (2.16,2.73),(2.08,2.62),(1.90,2.64)],steel,.12,.046)
    for i in range(4):
        x=1.87+i*.104
        z=2.61+abs(i-1.45)*.046
        a=p(x,-.24,z)
        b=p(x+.032,-.27,z-.171)
        c=p(x+.014,-.341,z-.302)
        rod(label+' finger knuckle',p(x,-.38,z),p(x,-.17,z),.061,.060,copper,10)
        rod(label+' digital proximal',a,b,.064,.053,steel,8)
        rod(label+' digital intermediate',b,c,.058,.045,dark,8)
        pipe('Finger talon',[(x+.014,-.341,z-.302),(x-.005,-.435,z-.419),
             (x-.033,-.535,z-.455)],[.049,.035,.004],edge,7)
        fastener(label+' digital pin',x*s,-.398,z)
    for name,a,b,r,rr,mat in [
        ('opposable mount',(1.84,-.18,2.78),(1.68,-.22,2.62),.080,.068,steel),
        ('opposable phalanx',(1.68,-.22,2.62),(1.69,-.34,2.46),.071,.054,dark)]:
        rod(label+' '+name,p(*a),p(*b),r,rr,mat,9)
    pipe('Opposable claw',[(1.69,-.34,2.46),(1.74,-.48,2.40),(1.81,-.55,2.43)],
         [.061,.041,.004],edge,8)

    section('07 | '+label+' Thigh and knee')
    rod(label+' hip axle',p(.27,0,3.12),p(.71,0,3.12),.246,.216,edge,12)
    rod(label+' femoral chassis',p(.47,0,3.14),p(.68,.06,1.93),.284,.21,frame)
    armor('Cuisses base',-.34,[(.25,2.93),(.49,3.10),(.77,3.02),(.94,2.72),
          (.96,2.31),(.73,1.99),(.49,2.09),(.37,2.45)],dark,.66,.10)
    armor('Cuisses face',-.47,[(.33,2.89),(.50,3.00),(.72,2.91),(.85,2.69),
          (.84,2.37),(.68,2.10),(.52,2.23),(.46,2.60)],steel,.19,.082)
    armor('Femoral blade',-.462,[(.70,2.94),(.85,2.97),(.98,2.72),(.99,2.37),
          (.84,2.17),(.86,2.59)],dark,.30,.066)
    armor('Rear thigh plating',.39,[(.30,2.96),(.68,3.04),(.88,2.78),(.96,2.36),
          (.79,2.18),(.50,2.23),(.40,2.56)],steel,.26,.086,True)
    pipe('Femoral light seam',[(.47,-.522,2.83),(.57,-.556,2.68),(.61,-.557,2.43),
         (.68,-.541,2.26)],[.009,.016,.016,.009],heat)
    for i in range(3):
        z=2.76-i*.16
        armor('Femoral scale',-.45,[(.74,z+.07),(.95,z+.16),(.98,z+.08),
              (.91,z-.05),(.79,z-.063)],steel,.10,.026)
    piston(label+' exposed hamstring ram',p(.40,.40,2.88),p(.54,.29,1.87),.084)
    piston(label+' outer quadriceps ram',p(.77,.20,2.87),p(.88,.16,1.92),.082)
    rod(label+' knee bearing',p(.39,.04,1.93),p(.99,.04,1.93),.259,.232,frame,16)
    rod(label+' knee rotor',p(.98,.04,1.93),p(1.035,.04,1.93),.162,.144,edge,12)
    rod(label+' rotor indicator',p(1.035,.04,1.93),p(1.056,.04,1.93),.083,.075,heat,10)
    armor('Patellar shield',-.42,[(.40,1.93),(.58,2.19),(.79,2.22),(.99,2.03),
          (.93,1.83),(.71,1.65),(.52,1.73)],steel,.28,.114)
    armor('Knee crest',-.55,[(.57,1.97),(.71,2.13),(.88,2.01),(.75,1.82)],dark,.080,.04)
    pipe('Knee crest light',[(.59,-.59,1.955),(.72,-.603,1.87),(.84,-.592,1.966)],
         [.011,.014,.011],heat)

    section('08 | '+label+' Lower leg and foot')
    rod(label+' tibial chassis',p(.69,.035,1.93),p(.85,.11,.40),.239,.173,frame)
    armor('Greave carrier',-.36,[(.46,1.69),(.67,1.87),(.99,1.72),(1.10,1.34),
          (1.05,.78),(.95,.45),(.67,.44),(.59,.88)],dark,.67,.112)
    armor('Greave face',-.49,[(.55,1.65),(.68,1.78),(.89,1.64),(1.00,1.35),
          (.96,.89),(.87,.55),(.73,.60),(.65,1.08)],steel,.19,.09)
    armor('Greave cutter',-.505,[(.87,1.65),(1.02,1.74),(1.14,1.39),
          (1.09,.88),(.93,.53),(.98,1.19)],edge,.19,.047)
    armor('Calf carapace',.45,[(.45,1.64),(.73,1.78),(.97,1.58),(1.10,1.27),
          (1.00,.85),(.85,.75),(.60,1.05)],steel,.28,.107,True)
    vent(label+' calf exhaust',s*.79,.563,1.31,s,4,True)
    pipe('Tibial light seam',[(.65,-.548,1.58),(.76,-.586,1.39),(.82,-.586,1.00),
         (.79,-.546,.73)],[.008,.017,.017,.009],heat)
    for i in range(4):
        z=1.40-i*.165
        armor('Interlocking greave scale',-.45,[(.56,z+.08),(.70,z+.13),
              (.73,z+.02),(.65,z-.036),(.58,z-.025)],dark,.13,.045)
        fastener(label+' greave pin',s*.935,-.559,z)
    piston(label+' Achilles ram',p(.75,.52,1.34),p(.84,.31,.36),.095)
    rod(label+' ankle bearing',p(.60,.10,.46),p(1.10,.10,.46),.176,.165,edge,12)
    block(label+' heel tread',p(.85,.22,.12),(.46,.63,.24),frame,.065)
    block(label+' foot sole',p(.86,-.23,.105),(.60,.89,.21),dark,.076)
    armor('Ankle boot shield',-.45,[(.57,.27),(.64,.57),(.82,.62),(1.04,.55),
          (1.18,.31),(1.08,.19),(.69,.16)],steel,.78,.071)
    for i in range(3):
        x=.66+i*.19
        pipe('Segmented toe',[(x,-.35,.255),(x+.02,-.62,.225),
             (x+.045,-.78+abs(i-1)*.053,.135)],
             [.143,.12,.064],edge if i==1 else steel,8)
        block(label+' toe tread',p(x+.025,-.59,.072),(.149,.29,.13),frame,.025)
        block(label+' toe light',p(x+.026,-.704+abs(i-1)*.048,.196),
              (.069,.072,.024),heat,.006)
    for i in range(4):
        block(label+' heel grip',p(.68+i*.109,.41,.065),(.078,.39,.12),dark,.012)


# Side-facing inserts break up the long exposed armor walls in three-quarter views.
for sign, label in ((-1, 'L'), (1, 'R')):
    def side_insert(name, x, y, z, width, height, louvers):
        x *= sign
        obj = block(label+' '+name+' surround', (x, y, z), (.068,width,height), dark,.027)
        obj.rotation_euler.x = -.15
        for i in range(louvers):
            zz=z+(i-(louvers-1)/2)*height/(louvers+1)
            yy=y+.15*(zz-z)
            obj=block(label+' '+name+' channel',
                      (x+sign*.037,yy,zz),(.016,width*.73,.030),frame,.007)
            obj.rotation_euler.x=-.15
            block(label+' '+name+' inset', (x+sign*.047,yy,zz-.009),
                  (.011,width*.52,.008), copper if i%3 else heat,.003)
        for end in (-1,1):
            zz=z+end*height*.43
            a=(x+sign*.034,y+.15*(zz-z),zz)
            b=(x+sign*.054,a[1],zz)
            rod(label+' '+name+' captive screw',a,b,.024,.022,edge,8,.003)

    group = next(g for g in body_groups if g.name.endswith(label+' Shoulder and arm'))
    side_insert('Gauntlet side intake',2.118,-.12,3.33,.32,.28,4)
    group = next(g for g in body_groups if g.name.endswith(label+' Thigh and knee'))
    side_insert('Femoral access grille',.94,-.10,2.61,.31,.31,4)
    group = next(g for g in body_groups if g.name.endswith(label+' Lower leg and foot'))
    side_insert('Tibial side intake',1.096,-.11,1.30,.33,.36,5)

if args.variant:
    def recolor(mat, rgb):
        shader = mat.node_tree.nodes.get('Principled BSDF')
        mat.diffuse_color = (*rgb, 1)
        for channel in ('Base Color', 'Emission Color'):
            shader.inputs[channel].default_value = (*rgb, 1)

    if args.variant == 'Warden':
        title = 'Lattice, the Cryo Warden'
        recolor(steel, (.19,.25,.32))
        recolor(dark, (.035,.069,.11))
        recolor(edge, (.48,.59,.65))
        recolor(copper, (.14,.27,.38))
        recolor(heat, (.011,.35,1))
        recolor(hot, (.035,.76,1))
        recolor(horn, (.085,.14,.20))
    else:
        title = 'Lattice, the Ember Revenant'
        recolor(steel, (.12,.049,.025))
        recolor(dark, (.039,.019,.019))
        recolor(edge, (.33,.13,.051))
        recolor(copper, (.19,.10,.065))
        recolor(heat, (1,.014,.006))
        recolor(hot, (1,.102,.009))
        recolor(horn, (.14,.052,.024))

    for sign, side in ((-1,'L'),(1,'R')):
        group = next(g for g in body_groups if g.name.endswith(side+' Shoulder and arm'))
        if args.variant == 'Warden':
            for obj in list(group.objects):
                if 'Pauldron spike' in obj.name or 'spike seat' in obj.name:
                    bpy.data.objects.remove(obj, do_unlink=True)
            for i in range(3):
                profile = [(1.19+i*.19,4.96),(1.36+i*.19,5.22+i*.09),
                           (1.49+i*.19,5.32+i*.09),(1.46+i*.19,5.05),
                           (1.38+i*.19,4.91)]
                panel(side+' Cryogenic heatsink fin',-.05+i*.15,
                      mirrored_outline(sign,profile),edge,.17,.038)
            panel(side+' Shoulder frost shield',-.67,mirrored_outline(sign,[
                  (1.11,4.77),(1.33,4.98),(1.66,4.95),(1.79,4.72),
                  (1.53,4.55),(1.26,4.55)]),steel,.14,.063)
            for i in range(3):
                sweep(side+' Coolant rail',[(sign*(1.24+i*.11),-.742,4.73),
                      (sign*(1.39+i*.11),-.742,4.85)],[.010,.014],heat,8)
        else:
            for i in range(2):
                shift=i*.25
                sweep(side+' Pauldron crown hook',[(sign*(1.23+shift),.28,4.93),
                      (sign*(1.36+shift),.34,5.24),(sign*(1.60+shift),.32,5.52),
                      (sign*(1.83+shift),.21,5.60),(sign*(1.93+shift),.10,5.49)],
                      [.139,.123,.092,.047,.004],horn,9)
            panel(side+' Smelter shield',-.62,mirrored_outline(sign,[
                  (1.13,4.78),(1.33,4.94),(1.69,4.91),(1.91,4.72),
                  (1.66,4.56),(1.40,4.32),(1.35,4.57)]),dark,.15,.074)
            sweep(side+' Smelter shield seam',[(sign*1.31,-.69,4.69),
                  (sign*1.55,-.70,4.67),(sign*1.77,-.67,4.80)],
                  [.011,.017,.008],heat,8)

    group = body_groups[0]
    if args.variant == 'Warden':
        panel('Cryogenic reactor frame',-.72,[(-.27,4.50),(0,4.70),(.27,4.50),
              (.20,4.27),(0,4.13),(-.20,4.27)],dark,.10,.047)
        panel('Cryogenic reactor lens',-.779,[(-.12,4.48),(0,4.59),(.12,4.48),
              (.09,4.34),(0,4.26),(-.09,4.34)],hot,.033,.021)
    else:
        for sign,side in ((-1,'L'),(1,'R')):
            sweep(side+' Armored furnace feed',[(sign*.17,-.64,4.47),
                  (sign*.39,-.71,4.58),(sign*.68,-.73,4.54),
                  (sign*.84,-.72,4.41)], [.052,.061,.047,.035],copper,10)
            sweep(side+' Furnace feed tracer',[(sign*.21,-.698,4.49),
                  (sign*.39,-.772,4.58),(sign*.67,-.783,4.54)],
                  [.010,.013,.009],heat,8)

# Use a shared origin for the assembled character while keeping every component editable.
root_group = collection('00 | '+title)
root = bpy.data.objects.new(title, None)
root_group.objects.link(root)
root.empty_display_size = .35
root['Asset type'] = 'Editable hard-surface character'
model = [obj for part in body_groups for obj in part.objects]
for obj in model:
    obj.parent = root

group = collection('09 | Studio (excluded from GLB)')
rod('Turntable', (0,0,-.20),(0,0,-.004),2.81,2.77,floor,96,.035)
rod('Turntable lower rim',(0,0,-.207),(0,0,-.173),2.81,2.81,edge,96,.006)
block('Cyclorama', (0,0,-.288),(200,200,.15),ground,0)
for i in range(12):
    angle=math.tau*i/12
    r=2.60
    obj=block('Turntable index', (r*math.sin(angle),r*math.cos(angle),.002),
              (.022,.11,.008),heat if i%3==0 else edge,.003)
    obj.rotation_euler.z=-angle

scene.world=bpy.data.worlds.new('Blue-gray studio ambient')
scene.world.use_nodes=True
scene.world.node_tree.nodes.get('Background').inputs[0].default_value=(.22,.30,.43,1)
scene.world.node_tree.nodes.get('Background').inputs[1].default_value=.24


def aim(obj, point):
    obj.rotation_euler=(Vector(point)-obj.location).to_track_quat('-Z','Y').to_euler()


def light(name, pos, target, power, color, size, size_y=None):
    data=bpy.data.lights.new(name,'AREA')
    data.energy=power
    data.color=color
    data.shape='RECTANGLE' if size_y else 'DISK'
    data.size=size
    if size_y:
        data.size_y=size_y
    obj=bpy.data.objects.new(name,data)
    group.objects.link(obj)
    obj.location=pos
    aim(obj,target)


light('Main softbox',(-4,-6,8),(0,0,3.8),1950,(.81,.89,1),4.2,5.8)
light('Front bounce',(2,-7,3.5),(0,0,3),950,(.70,.81,1),3.6)
light('Accent edge',(4,2.8,6.9),(0,0,3.8),2100,
      (.15,.52,1) if args.variant == 'Warden' else (1,.26,.084),3,5)
light('Cool edge',(-4,3.3,6.6),(0,0,3.3),1900,(.27,.60,1),3,5)
light('Ceiling',(.5,0,9),(0,0,3),1300,(1,.86,.73),4.0)
light('Low rear fill',(2,6,3),(0,0,3),960,(.68,.81,1),5.0)


def camera(name, pos, target, scale):
    data=bpy.data.cameras.new(name)
    data.type='ORTHO'
    data.ortho_scale=scale
    obj=bpy.data.objects.new(name,data)
    group.objects.link(obj)
    obj.location=pos
    aim(obj,target)
    return obj


hero=camera('Camera • Hero',(6.3,-14,7.2),(0,0,3.31),7.72)
front=camera('Camera • Front',(0,-17,3.34),(0,0,3.34),7.64)
rear=camera('Camera • Rear',(-7,14,6.9),(0,0,3.33),7.78)
detail=camera('Camera • Head and chest',(3.1,-11,6.6),(0,-.12,5.11),4.65)
scene.camera=hero
scene.render.engine='CYCLES'
scene.cycles.samples=28 if args.variant else 40
scene.cycles.use_denoising=True
scene.render.resolution_x=1100
scene.render.resolution_y=1360
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.view_settings.view_transform='AgX'
scene.use_nodes=True
tree=scene.node_tree
tree.nodes.clear()
layers=tree.nodes.new('CompositorNodeRLayers')
glare=tree.nodes.new('CompositorNodeGlare')
glare.glare_type='FOG_GLOW'
glare.inputs['Threshold'].default_value=1.6
comp=tree.nodes.new('CompositorNodeComposite')
tree.links.new(layers.outputs['Image'],glare.inputs['Image'])
tree.links.new(glare.outputs['Image'],comp.inputs['Image'])

# Save a practical modeling viewport and a portable render path.
for screen in bpy.data.screens:
    for area in screen.areas:
        if area.type == 'VIEW_3D':
            space=area.spaces.active
            space.region_3d.view_rotation=hero.rotation_euler.to_quaternion()
            space.region_3d.view_distance=10.8
            space.region_3d.view_location=(0,0,3.28)
            space.overlay.show_floor=False
            space.overlay.show_axis_x=False
            space.overlay.show_axis_y=False
            space.overlay.show_extras=False
            space.shading.color_type='MATERIAL'
scene.render.filepath=f'//{stem}_Hero.png'
bpy.context.preferences.filepaths.save_version=0

bpy.ops.object.select_all(action='DESELECT')
for obj in model+[root]:
    obj.select_set(True)
bpy.context.view_layer.objects.active=root
bpy.ops.export_scene.gltf(filepath=str(out/f'{stem}.glb'), export_format='GLB',
                         use_selection=True, export_apply=True)
print('CHARACTER_MESHES',len(model),flush=True)

# Keep the GLB's PBR materials portable. Add render-scale metal grain to the
# native project after export, with no image files or other dependencies.
def metal_grain(mat, scale, strength, rough_low, rough_high):
    tree = mat.node_tree
    shader = tree.nodes.get('Principled BSDF')
    noise = tree.nodes.new('ShaderNodeTexNoise')
    noise.label = 'Fine casting grain'
    noise.location = (-620, 30)
    noise.inputs['Scale'].default_value = scale
    noise.inputs['Detail'].default_value = 2.4
    noise.inputs['Roughness'].default_value = .67
    geom = tree.nodes.new('ShaderNodeNewGeometry')
    geom.location = (-840, 30)
    bump = tree.nodes.new('ShaderNodeBump')
    bump.location = (-325,-140)
    bump.inputs['Strength'].default_value = strength
    bump.inputs['Distance'].default_value = .026
    grain_roughness = tree.nodes.new('ShaderNodeMapRange')
    grain_roughness.location = (-325,110)
    grain_roughness.inputs['To Min'].default_value = rough_low
    grain_roughness.inputs['To Max'].default_value = rough_high
    tree.links.new(geom.outputs['Position'], noise.inputs['Vector'])
    tree.links.new(noise.outputs['Fac'], bump.inputs['Height'])
    tree.links.new(noise.outputs['Fac'], grain_roughness.inputs['Value'])
    tree.links.new(bump.outputs['Normal'], shader.inputs['Normal'])
    tree.links.new(grain_roughness.outputs['Result'], shader.inputs['Roughness'])


for mat, scale, strength, low, high in (
    (steel,73,.31,.24,.43), (dark,87,.27,.28,.48),
    (edge,115,.17,.22,.39), (horn,62,.37,.23,.47),
    (copper,95,.24,.29,.46), (frame,117,.22,.37,.59)):
    metal_grain(mat,scale,strength,low,high)

bpy.ops.object.select_all(action='DESELECT')
bpy.context.view_layer.objects.active=None
bpy.ops.wm.save_as_mainfile(filepath=str(out/f'{stem}.blend'))


if args.render:
    views = (
        (hero,'Hero',(1100,1360)),(front,'Front',(900,1120)),
        (rear,'Rear',(900,1120)),(detail,'Detail',(1220,900)))
    if args.variant:
        views = ((hero,'Hero',(960,1180)),)
    for cam, filename, resolution in views:
        scene.camera=cam
        scene.render.resolution_x,scene.render.resolution_y=resolution
        scene.render.filepath=str(out/f'{stem}_{filename}.png')
        bpy.ops.render.render(write_still=True)
