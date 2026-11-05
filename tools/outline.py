"""Turn several shapes into one outline polygon for pages.js (one clean border instead of overlapping shapes).

    python tools/outline.py '<json>'

<json> is {"add": [shapes], "cut": [shapes], "margin": 8} using the pages.js shape forms (c / e / r / p);
"cut" shapes are removed after the margin is added (e.g. a neighbor's button sitting on top).
Prints {"p": [[x, y], ...]} ready to paste. Needs numpy, opencv-python and Pillow.
"""
import json, sys
import cv2, numpy as np
from PIL import Image, ImageDraw

W, H = 1440, 2825

def draw(d, sh):
    if 'c' in sh:
        x, y, r = sh['c']; d.ellipse((x - r, y - r, x + r, y + r), fill=255)
    elif 'e' in sh:
        d.ellipse(tuple(sh['e']), fill=255)
    elif 'r' in sh:
        x0, y0, x1, y1, *rad = sh['r']; d.rounded_rectangle((x0, y0, x1, y1), radius=rad[0] if rad else 0, fill=255)
    else:
        d.polygon([tuple(p) for p in sh['p']], fill=255)

def mask(shapes):
    im = Image.new('L', (W, H), 0); d = ImageDraw.Draw(im)
    for sh in shapes: draw(d, sh)
    return np.asarray(im).copy()

def main():
    spec = json.loads(sys.argv[1])
    m = spec.get('margin', 8)
    a = mask(spec['add'])
    if m: a = cv2.dilate(a, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * m + 1, 2 * m + 1)))
    if spec.get('cut'): a[mask(spec['cut']) > 0] = 0
    cs, _ = cv2.findContours(a, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = max(cs, key=cv2.contourArea)
    poly = cv2.approxPolyDP(c, 1.5, True)[:, 0, :]
    print(json.dumps({'p': poly.tolist()}, separators=(',', ':')))

if __name__ == '__main__':
    main()
