"""Export the supplied Blender scene into the standalone web game. Never saves the source .blend."""
import bpy
import json
import sys
from pathlib import Path

args = sys.argv[sys.argv.index('--') + 1:]
source, destination = Path(args[0]), Path(args[1])
destination.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(source), load_ui=False, use_scripts=False)

environment_materials = {m for o in bpy.context.scene.objects
    if o.type in {'MESH', 'CURVE'} and not o.name.startswith(('DUEL_', 'ASSET_'))
    for m in o.data.materials if m}

# Keep the actual supplied materials, but omit expensive procedural/shader layers
# which do not map directly to glTF. Albedo maps retain the F1 livery.
for material in bpy.data.materials:
    if not material.use_nodes:
        continue
    for node in material.node_tree.nodes:
        if node.type == 'BSDF_PRINCIPLED':
            if material in environment_materials:
                for link in list(node.inputs['Base Color'].links):
                    material.node_tree.links.remove(link)
                node.inputs['Base Color'].default_value = material.diffuse_color
            for key in ['Transmission Weight', 'Coat Weight', 'Anisotropic IOR Level']:
                if key in node.inputs:
                    for link in list(node.inputs[key].links):
                        material.node_tree.links.remove(link)
                    node.inputs[key].default_value = 0
            for key in ['Normal', 'Coat Normal']:
                if key in node.inputs:
                    for link in list(node.inputs[key].links):
                        material.node_tree.links.remove(link)
for image in bpy.data.images:
    if image.source == 'FILE' and image.size[0] > 0:
        largest = max(image.size)
        if largest > 1024:
            ratio = 1024 / largest
            image.scale(max(1, int(image.size[0] * ratio)), max(1, int(image.size[1] * ratio)))
        image.pack()

report = {}
def export(name, objects):
    bpy.ops.object.select_all(action='DESELECT')
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    path = destination / (name + '.glb')
    bpy.ops.export_scene.gltf(filepath=str(path), export_format='GLB',
        use_selection=True, export_apply=True, export_animations=False,
        export_cameras=False, export_lights=False, export_extras=False,
        export_image_format='JPEG', export_image_quality=80,
        export_materials='EXPORT', export_yup=True)
    report[name] = {'bytes': path.stat().st_size,
        'triangles': sum(len(o.data.loop_triangles) for o in objects)}
    print('WEB_ASSET', name, report[name], flush=True)

environment = [o for o in bpy.context.scene.objects if o.type in {'MESH', 'CURVE'} and not o.name.startswith(('DUEL_', 'ASSET_'))]
# Joining the static scene reduces scene graph work without changing its geometry.
bpy.ops.object.select_all(action='DESELECT')
for obj in environment:
    obj.select_set(True)
bpy.context.view_layer.objects.active = environment[0]
bpy.ops.object.convert(target='MESH')
bpy.ops.object.join()
environment = [bpy.context.object]
environment[0].name = 'Circuito_Blender'
environment[0].data.calc_loop_triangles()
export('circuit', environment)

for key in ['fusca', 'mclaren', 'porsche', 'gaz']:
    asset = bpy.data.objects['ASSET_' + key]
    obj = asset.copy()
    obj.data = asset.data.copy()
    bpy.context.scene.collection.objects.link(obj)
    obj.name = 'web_' + key
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    obj.data.calc_loop_triangles()
    original = len(obj.data.loop_triangles)
    if original > 45000:
        modifier = obj.modifiers.new('Web LOD', 'DECIMATE')
        modifier.ratio = 45000 / original
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    obj.data.calc_loop_triangles()
    obj.data.validate(verbose=False)
    obj.data.calc_loop_triangles()
    export(key, [obj])
    report[key]['originalTriangles'] = original
    bpy.data.objects.remove(obj, do_unlink=True)

(destination / 'export-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print('EXPORT_FINISHED', flush=True)
