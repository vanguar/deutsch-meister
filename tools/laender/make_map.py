#!/usr/bin/env python3
"""
make_map.py — карта 16 земель для laender.html → data/laender/map.json.

Контуры — Natural Earth, Admin 1 States/Provinces 1:10m (public domain,
https://www.naturalearthdata.com/), из них выбраны земли Германии
(tools/laender/deu_states.geojson). Проекция — равнопромежуточная со
сжатием долготы на cos(51°), упрощение Дугласа — Пекера до ~0,4 px.

Запуск: python tools/laender/make_map.py
"""

import json
import math
import os

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(os.path.dirname(HERE))
SRC = os.path.join(HERE, 'deu_states.geojson')
OUT = os.path.join(BASE, 'data', 'laender', 'map.json')

ISO = {
    'DE-BW': 'baden-wuerttemberg', 'DE-BY': 'bayern', 'DE-BE': 'berlin', 'DE-BB': 'brandenburg',
    'DE-HB': 'bremen', 'DE-HH': 'hamburg', 'DE-HE': 'hessen', 'DE-MV': 'mecklenburg-vorpommern',
    'DE-NI': 'niedersachsen', 'DE-NW': 'nordrhein-westfalen', 'DE-RP': 'rheinland-pfalz',
    'DE-SL': 'saarland', 'DE-SN': 'sachsen', 'DE-ST': 'sachsen-anhalt', 'DE-SH': 'schleswig-holstein',
    'DE-TH': 'thueringen',
}
WIDTH = 400          # ширина viewBox; высота — по пропорциям
PAD = 6
TOL = 0.4            # px
MIN_RING = 2.5       # px: мелкие острова короче — выбрасываем


def dp(points, tol):
    """Дуглас — Пекер для открытой ломаной."""
    if len(points) < 3:
        return points
    (x1, y1), (x2, y2) = points[0], points[-1]
    dx, dy = x2 - x1, y2 - y1
    norm = math.hypot(dx, dy) or 1e-9
    far, idx = -1, 0
    for i in range(1, len(points) - 1):
        x, y = points[i]
        d = abs(dy * x - dx * y + x2 * y1 - y2 * x1) / norm
        if d > far:
            far, idx = d, i
    if far <= tol:
        return [points[0], points[-1]]
    return dp(points[:idx + 1], tol)[:-1] + dp(points[idx:], tol)


def main():
    feats = json.load(open(SRC, encoding='utf-8'))['features']
    k = math.cos(math.radians(51))
    rings = {}
    xs, ys = [], []
    for f in feats:
        lid = ISO[f['properties']['iso_3166_2']]
        g = f['geometry']
        polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
        rings[lid] = [[[(lon * k, -lat) for lon, lat in ring] for ring in poly] for poly in polys]
        for poly in rings[lid]:
            for ring in poly:
                for x, y in ring:
                    xs.append(x)
                    ys.append(y)
    x0, y0 = min(xs), min(ys)
    s = (WIDTH - 2 * PAD) / (max(xs) - x0)
    height = round((max(ys) - y0) * s + 2 * PAD)

    out = {}
    for lid, polys in sorted(rings.items()):
        parts = []
        cx = cy = area_sum = 0.0
        for poly in polys:
            for ri, ring in enumerate(poly):
                pts = [((x - x0) * s + PAD, (y - y0) * s + PAD) for x, y in ring]
                per = sum(math.dist(pts[i], pts[i + 1]) for i in range(len(pts) - 1))
                if per < MIN_RING and len(rings[lid]) > 1:
                    continue
                simp = dp(pts, TOL)
                if len(simp) < 4:
                    simp = pts
                parts.append('M' + 'L'.join('%.1f %.1f' % p for p in simp[:-1]) + 'Z')
                if ri == 0:
                    # центр подписи — центр масс внешнего контура
                    a = 0.0
                    px = py = 0.0
                    for i in range(len(pts) - 1):
                        (xa, ya), (xb, yb) = pts[i], pts[i + 1]
                        c = xa * yb - xb * ya
                        a += c
                        px += (xa + xb) * c
                        py += (ya + yb) * c
                    if abs(a) > 1e-6:
                        a *= 0.5
                        cx += px / (6 * a) * abs(a)
                        cy += py / (6 * a) * abs(a)
                        area_sum += abs(a)
        out[lid] = {'d': ''.join(parts), 'c': [round(cx / area_sum, 1), round(cy / area_sum, 1)],
                    'area': round(area_sum)}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8', newline='\n') as f:
        json.dump({'viewBox': [0, 0, WIDTH, height],
                   'source': 'Natural Earth, Admin 1 – States, Provinces 1:10m (public domain)',
                   'lands': out}, f, ensure_ascii=False, separators=(',', ':'))
        f.write('\n')
    print('map.json: %d земель, viewBox 0 0 %d %d, %d КБ' % (len(out), WIDTH, height, os.path.getsize(OUT) // 1024))


if __name__ == '__main__':
    main()
