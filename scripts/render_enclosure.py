"""Render the supplied V8 OBJ as transparent website illustrations.

Requires NumPy and Pillow. Run from the repository root. Colors are a neutral
display finish; all geometry comes from the original, unmodified OBJ export.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'static/models/2026-11-23-v8/PrecisionShot_V8_Enclosure_Assembled.obj'
OUTPUT = ROOT / 'static/images/showcase'


def read_obj():
    vertices, faces, part_ids, names = [], [], [], []
    part = -1
    with SOURCE.open() as source:
        for line in source:
            if line.startswith('o '):
                names.append(line.strip()[2:])
                part += 1
            elif line.startswith('v '):
                vertices.append([float(value) for value in line.split()[1:4]])
            elif line.startswith('f '):
                indices = [int(value.split('/')[0]) - 1 for value in line.split()[1:]]
                for index in range(1, len(indices) - 1):
                    faces.append([indices[0], indices[index], indices[index + 1]])
                    part_ids.append(part)
    return np.array(vertices), np.array(faces), np.array(part_ids), names


def render(vertices, faces, part_ids, names, *, exploded=False, filename=None, dimensions=None):
    triangles = vertices[faces].copy()
    if exploded:
        offsets = {
            'T01': (0, 0, -62), 'T02': (0, 0, -113),
            'T06': (0, 0, 94), 'T07': (0, 0, 94), 'T10': (0, 0, 94),
            'T11': (-65, 0, 48), 'T12': (0, 0, -72)
        }
        for part, name in enumerate(names):
            triangles[part_ids == part] += offsets.get(name[:3], (0, 0, 0))

    camera = np.array([0.72, 0.40, -1.0] if exploded else [0.20, 0.12, -1.0])
    camera /= np.linalg.norm(camera)
    right = np.cross([0, 1, 0], camera)
    right /= np.linalg.norm(right)
    up = np.cross(camera, right)
    projected = np.stack([triangles @ right, -(triangles @ up)], axis=-1)
    depth = (triangles @ camera).mean(axis=1)
    normals = np.cross(triangles[:, 1] - triangles[:, 0], triangles[:, 2] - triangles[:, 0])
    normals /= np.maximum(np.linalg.norm(normals, axis=1, keepdims=True), 1e-12)
    light = np.array([-0.45, 0.8, -1.0])
    light /= np.linalg.norm(light)
    # Closed CAD solids occasionally have reversed face winding in OBJ exports.
    # Use double-sided lighting, matching the interactive viewer.
    lighting = 0.52 + 0.48 * np.abs(normals @ light)
    palette = np.array([
        [100, 116, 139], [51, 65, 85], [148, 163, 184], [148, 163, 184],
        [126, 143, 164], [126, 143, 164], [137, 153, 174], [126, 143, 164],
        [100, 116, 139], [71, 85, 105]
    ])
    colors = np.clip(palette[part_ids] * lighting[:, None], 0, 255).astype(np.uint8)

    width, height = dimensions or ((1400, 1000) if exploded else (800, 1340))
    supersample = 2
    minimum = projected.min(axis=(0, 1))
    extent = projected.max(axis=(0, 1)) - minimum
    scale = min(width * 0.94 / extent[0], height * 0.96 / extent[1])
    padding = (np.array([width, height]) - extent * scale) / 2
    projected = ((projected - minimum) * scale + padding) * supersample
    image = Image.new('RGBA', (width * supersample, height * supersample))
    painter = ImageDraw.Draw(image)
    for index in np.argsort(depth):
        painter.polygon([tuple(point) for point in projected[index]], fill=tuple(colors[index]) + (255,))
    image = image.resize((width, height), Image.Resampling.LANCZOS)
    filename = filename or ('enclosure-v8-exploded.webp' if exploded else 'enclosure-v8-assembled.webp')
    image.save(OUTPUT / filename, 'WEBP', lossless=True, exact=True, method=4)
    print(f'Rendered {filename}: {width} x {height}')


if __name__ == '__main__':
    mesh = read_obj()
    render(*mesh)
    render(*mesh, exploded=True)

    vertices, faces, part_ids, names = mesh
    for part, name in enumerate(names):
        mask = part_ids == part
        render(vertices, faces[mask], part_ids[mask], names,
               filename=f'enclosure-v8-{name[:3].lower()}.webp', dimensions=(800, 640))
