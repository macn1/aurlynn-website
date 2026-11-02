import bpy, math, sys, os
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
out, W, H, samples, with_bars = argv[0], int(argv[1]), int(argv[2]), int(argv[3]), argv[4] == "1"

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = "CYCLES"
prefs = bpy.context.preferences.addons["cycles"].preferences
try:
    prefs.compute_device_type = "METAL"; prefs.get_devices()
    for d in prefs.devices: d.use = True
    sc.cycles.device = "GPU"
except Exception as e:
    print("GPU unavailable", e)
sc.cycles.samples = samples
sc.cycles.use_denoising = True
sc.cycles.max_bounces = 12
sc.cycles.transmission_bounces = 12
sc.cycles.glossy_bounces = 6
sc.cycles.caustics_reflective = False
sc.cycles.caustics_refractive = False
sc.render.resolution_x, sc.render.resolution_y = W, H
sc.render.film_transparent = False
sc.view_settings.view_transform = "Standard"
sc.view_settings.look = "None"
sc.view_settings.exposure = 0.0

def hexc(h, a=1.0):
    h = h.lstrip("#"); r, g, b = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    f = lambda c: c ** 2.2
    return (f(r), f(g), f(b), a)

# --- world: warm ivory studio
w = bpy.data.worlds.new("W"); sc.world = w; w.use_nodes = True
nt = w.node_tree; bg = nt.nodes["Background"]
bg.inputs["Color"].default_value = hexc("#fcf5ef"); bg.inputs["Strength"].default_value = 0.95

def mat(name):
    m = bpy.data.materials.new(name); m.use_nodes = True
    return m, m.node_tree.nodes["Principled BSDF"]

def glass(name, tint, rough=0.03, ior=1.45, absorb=None):
    m, b = mat(name)
    b.inputs["Base Color"].default_value = hexc(tint)
    b.inputs["Metallic"].default_value = 0
    b.inputs["Roughness"].default_value = rough
    b.inputs["IOR"].default_value = ior
    b.inputs["Transmission Weight"].default_value = 1
    b.inputs["Coat Weight"].default_value = 0.3
    return m

def smooth(o):
    for p in o.data.polygons: p.use_smooth = True

# --- floor (glossy, soft reflections)
bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, -1.02))
floor = bpy.context.active_object
fm, fb = mat("Floor")
fb.inputs["Base Color"].default_value = hexc("#f4eae0")
fb.inputs["Roughness"].default_value = 0.12
fb.inputs["Specular IOR Level"].default_value = 0.6
floor.data.materials.append(fm)

# --- sphere
bpy.ops.mesh.primitive_uv_sphere_add(radius=1, segments=128, ring_count=64, location=(0, 0, 0))
sph = bpy.context.active_object; smooth(sph)
sph.data.materials.append(glass("SphereGlass", "#fffaf4", rough=0.01, ior=1.3))

TILT = 20
# --- discs: flat glass cylinders + copper rims, angled outward
specs = [(1.3, 0.68), (1.68, 0.57), (2.05, 0.47), (2.4, 0.36)]
rim_m, rb = mat("Rim")
rb.inputs["Base Color"].default_value = hexc("#efcfa6")
rb.inputs["Metallic"].default_value = 1
rb.inputs["Roughness"].default_value = 0.3
dm = glass("DiscGlass", "#ffffff", rough=0.2, ior=1.25)
_b = dm.node_tree.nodes["Principled BSDF"]
_b.inputs["Transmission Weight"].default_value = 0.8
_b.inputs["Emission Color"].default_value = hexc("#ffffff")
_b.inputs["Emission Strength"].default_value = 0.12
_b.inputs["Coat Weight"].default_value = 0.6
for side in (1, -1):
    for i, (x, r) in enumerate(specs):
        loc = (side * x, 0.35 + i * 0.12, 0)
        rot = (0, math.radians(90), math.radians(side * -38))  # axis ~x, turned toward camera
        bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=0.06, vertices=128, location=loc, rotation=(0, math.radians(90), 0))
        d = bpy.context.active_object
        from mathutils import Matrix
        d.rotation_euler = (Matrix.Rotation(math.radians(side * TILT), 3, "Z") @ Matrix.Rotation(math.radians(90), 3, "Y")).to_euler()
        smooth(d); d.data.materials.append(dm)
        bv = d.modifiers.new("b", "BEVEL"); bv.width = 0.012; bv.segments = 3
        bpy.ops.mesh.primitive_torus_add(major_radius=r, minor_radius=0.008, major_segments=128, minor_segments=12, location=loc)
        t = bpy.context.active_object
        t.rotation_euler = d.rotation_euler.copy()
        smooth(t); t.data.materials.append(rim_m)

# --- waveform bars inside the sphere (optional layer)
em_m = bpy.data.materials.new("Glow"); em_m.use_nodes = True
nodes = em_m.node_tree.nodes; nodes.clear()
e = nodes.new("ShaderNodeEmission"); e.inputs["Color"].default_value = hexc("#ffc48a"); e.inputs["Strength"].default_value = 7
o = nodes.new("ShaderNodeOutputMaterial"); em_m.node_tree.links.new(e.outputs[0], o.inputs[0])
heights = [0.06,0.10,0.18,0.30,0.44,0.60,0.78,0.92,0.80,0.62,0.46,0.30,0.18,0.10,0.06]
if with_bars:
    n = 27
    import random; random.seed(4)
    for i in range(n):
        u = i / (n - 1) - 0.5
        h = 0.05 + math.exp(-(u * u) / 0.04) * (0.7 + 0.3 * abs(math.sin(i * 1.3))) * 1.15
        bpy.ops.mesh.primitive_cube_add(size=1, location=(u * 1.35, 0, 0))
        bar = bpy.context.active_object
        bar.scale = (0.016, 0.016, h); bar.data.materials.append(em_m)

# --- sound waves: thin emissive curves across the frame
def wave(amp, freq, phase, z, col, strength, rad=0.006):
    cu = bpy.data.curves.new("w", "CURVE"); cu.dimensions = "3D"
    cu.bevel_depth = rad; cu.bevel_resolution = 3
    sp = cu.splines.new("POLY"); N = 240; sp.points.add(N - 1)
    HALF = 11.0
    for i in range(N):
        u = i / (N - 1); x = (u - 0.5) * 2 * HALF
        taper = (1 - abs(x) / HALF) ** 1.4
        y = math.sin(x * freq + phase) * amp * taper
        sp.points[i].co = (x, -0.2 + z, y * 1.25 - 0.02, 1)
    ob = bpy.data.objects.new("wave", cu); bpy.context.collection.objects.link(ob)
    m = bpy.data.materials.new("wm"); m.use_nodes = True; nn = m.node_tree.nodes; nn.clear()
    em = nn.new("ShaderNodeEmission"); em.inputs["Color"].default_value = hexc(col); em.inputs["Strength"].default_value = strength
    oo = nn.new("ShaderNodeOutputMaterial"); m.node_tree.links.new(em.outputs[0], oo.inputs[0])
    ob.data.materials.append(m)
wave(0.5, 0.62, 0.0, 0.1, "#e6b07a", 4, 0.012)
wave(0.38, 0.8, 1.6, -0.1, "#fff3e4", 5, 0.01)
wave(0.26, 1.05, 3.2, 0.2, "#ffffff", 6, 0.007)

# --- lights
def area(loc, size, energy, col, target=(0, 0, 0)):
    bpy.ops.object.light_add(type="AREA", location=loc)
    l = bpy.context.active_object; l.data.energy = energy; l.data.size = size; l.data.shape = "DISK"
    l.data.color = hexc(col)[:3]
    d = Vector(target) - Vector(loc); l.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
area((-4, -5, 4), 5, 350, "#fff1e0")
area((5, -4, 2.5), 3, 200, "#ffd2a6")
area((0, -9, 1.5), 12, 220, "#fff6ea")
area((4.5, -5, -1.2), 4, 260, "#ffc48c")
area((0, 3, 4), 6, 150, "#fff8ee")
bpy.ops.object.light_add(type="POINT", location=(0, -0.1, 0.0))
pl = bpy.context.active_object; pl.data.energy = 0; pl.data.color = (1, 0.7, 0.42); pl.data.shadow_soft_size = 0.4

SHIFT = float(argv[5]) if len(argv) > 5 else 0.0
# --- camera
bpy.ops.object.camera_add(location=(0, -22.3, 0.0))
cam = bpy.context.active_object; cam.data.lens = 85; cam.data.sensor_width = 36
cam.rotation_euler = (math.radians(90), 0, 0)
cam.data.dof.use_dof = True; cam.data.dof.focus_distance = 22.3; cam.data.dof.aperture_fstop = 16
cam.data.shift_y = SHIFT
sc.camera = cam

sc.use_nodes = True
cn = sc.node_tree.nodes; cl = sc.node_tree.links; cn.clear()
rl = cn.new("CompositorNodeRLayers"); gl = cn.new("CompositorNodeGlare"); co = cn.new("CompositorNodeComposite")
gl.glare_type = "FOG_GLOW"; gl.quality = "HIGH"; gl.threshold = 2.5; gl.size = 6; gl.mix = -0.7
cl.new(rl.outputs["Image"], gl.inputs["Image"]); cl.new(gl.outputs["Image"], co.inputs["Image"])
sc.render.image_settings.file_format = "PNG"; sc.render.image_settings.color_depth = "16" if False else "8"
sc.render.filepath = out
bpy.ops.render.render(write_still=True)
print("DONE", out)
