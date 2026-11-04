"""Build the site data and the slide deck from the sheet PNGs.

    python tools/build.py           -> data.js
    python tools/build.py --slides  -> data.js and MonstUI_Slides.pptx

tools/sheets.json is the hand-written source: sheet order, titles, entry names, breadcrumbs and tap areas.
The numbered callouts are found on each PNG automatically and must match the entry names one for one.
Needs Pillow, numpy and scipy (plus python-pptx for --slides) and the Bahnschrift font (to read callout numbers).
"""
import collections, datetime, json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = [os.environ.get('MONST_FONT', ''), 'C:/Windows/Fonts/bahnschrift.ttf',
         '/mnt/skills/plugins/monst-card-image-translator/assets/fonts/bahnschrift.ttf']
INK = (12, 16, 22)

# title_badges() in monst_ui_markers.py: badges 140px square from (60, 30), 70px gap for the '›'
def crumb_rect(i): x = 60 + i * 210; return [x, 30, x + 140, 170]

def font(size):
    path = next(p for p in FONTS if p and os.path.exists(p))
    f = ImageFont.truetype(path, size)
    try: f.set_variation_by_name('SemiBold')
    except Exception: pass
    return f

def glyph(mask):
    """Crop a boolean mask to its ink."""
    ys, xs = np.nonzero(mask)
    return mask[ys.min():ys.max() + 1, xs.min():xs.max() + 1]

def read_number(crop, r):
    """Read the number inside a marker: its ink shape against the number drawn in the marker font, 1-40."""
    a = np.asarray(crop.convert('L'))
    yy, xx = np.mgrid[:a.shape[0], :a.shape[1]]
    inside = (xx - a.shape[1] / 2) ** 2 + (yy - a.shape[0] / 2) ** 2 < (0.8 * r) ** 2
    ink = glyph((a < 110) & inside)
    best = None
    for n in range(1, 41):
        t = str(n); size = round((40 if len(t) == 1 else 34) * (r + 4) / 30)   # num_marker's font size for its radius
        tmp = Image.new('L', (4 * size, 2 * size), 255)
        ImageDraw.Draw(tmp).text((2 * size, size), t, font=font(size), fill=0, anchor='mm')
        ref = glyph(np.asarray(tmp) < 110)
        ref_im = Image.fromarray(ref.astype(np.uint8) * 255).resize((ink.shape[1], ink.shape[0]))
        iou = ((np.asarray(ref_im) > 127) & ink).sum() / ((np.asarray(ref_im) > 127) | ink).sum()
        aspect = abs(ref.shape[1] / ref.shape[0] - ink.shape[1] / ink.shape[0])
        score = iou - aspect
        if best is None or score > best[0]: best = (score, n)
    return best[1]

def find_markers(im):
    """White numbered circles (num_marker) on the sheet: [(n, x, y, r)]. Keeps only the most common size."""
    a = np.asarray(im.convert('RGB')).astype(int)
    lab, _ = ndimage.label(a.min(axis=2) > 235)
    found = []
    for i, sl in enumerate(ndimage.find_objects(lab)):
        h, w = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        if not (24 <= w <= 110 and abs(w - h) <= 3): continue
        if abs(ndimage.binary_fill_holes(lab[sl] == i + 1).mean() - np.pi / 4) > 0.04: continue
        found.append(((sl[1].start + sl[1].stop) / 2, (sl[0].start + sl[0].stop) / 2, w / 2 + 2))
    if not found: return []
    r_main = collections.Counter(round(r) for *_, r in found).most_common(1)[0][0]
    out = []
    for x, y, r in found:
        if abs(r - r_main) > 1: continue
        crop = im.crop((int(x - r), int(y - r), int(x + r), int(y + r)))
        out.append((read_number(crop, r), round(x), round(y), round(r)))
    return out

def sheet_data(sid, spec):
    im = Image.open(os.path.join(ROOT, 'sheets', sid + '.png'))
    W, H = im.size
    entries = {int(k): v for k, v in spec['entries'].items()}
    marks = find_markers(im) if entries else []
    nums = {n for n, *_ in marks}
    if nums != set(entries):
        sys.exit(f'{sid}: callouts on the image {sorted(nums)} do not match the entry names {sorted(entries)}')
    # the explanation panel is the column holding most of the numbers (5+); everything else is on the screenshot
    cols = collections.Counter(x for _, x, _, _ in marks)
    out_entries = []
    for n in sorted(entries):
        spots = [dict(x=x, y=y, r=r, panel=cols[x] >= 5) for m, x, y, r in marks if m == n]
        spots.sort(key=lambda s: s['panel'])                 # screenshot callout first: that's where a jump scrolls to
        out_entries.append(dict(n=n, name=entries[n], spots=spots))
    links = [dict(l) for l in spec['links']]
    for i, (badge, to) in enumerate(spec['crumbs']):
        if to != sid: links.append(dict(to=to, rect=crumb_rect(i), what='breadcrumb ' + badge))
    tabs = spec.get('tabs')
    if tabs:                                                 # a tab bar on every column; each tab scrolls to its column
        y0, y1 = tabs['tab_y']
        for cx in tabs['columns_x']:
            for i, tx in enumerate(tabs['tab_x']):
                target = tabs['columns_x'][i]
                links.append(dict(at=[target, 0, target + tabs['column_w']], rect=[cx + tx, y0, cx + tx + tabs['tab_w'], y1],
                                  what=tabs['names'][i] + ' tab'))
    return dict(id=sid, title=spec['title'], file=f'sheets/{sid}.png', w=W, h=H,
                crumbs=spec['crumbs'], entries=out_entries, links=links)

def build_slides(cfg, data):
    from pptx import Presentation
    from pptx.util import Emu, Inches
    from pptx.dml.color import RGBColor
    prs = Presentation(); prs.slide_width, prs.slide_height = Inches(13.333), Inches(7.5)
    tmp = os.path.join(ROOT, 'tools', '_slides_tmp'); os.makedirs(tmp, exist_ok=True)
    margin = Inches(0.15); DPI = 220
    for g in cfg['groups']:
        for sid in g['sheets']:
            s = data[sid]
            im = Image.open(os.path.join(ROOT, s['file'])).convert('RGB')
            bw, bh = prs.slide_width - 2 * margin, prs.slide_height - 2 * margin
            k = min(bw / s['w'], bh / s['h'])                # EMU per sheet px
            w, h = int(s['w'] * k), int(s['h'] * k)
            px_w = min(s['w'], round(w / 914400 * DPI))      # downscale to ~220 dpi at slide size
            small = im.resize((px_w, round(s['h'] * px_w / s['w'])), Image.LANCZOS)
            p = os.path.join(tmp, sid + '.png'); small.save(p, optimize=True)
            slide = prs.slides.add_slide(prs.slide_layouts[6])
            slide.background.fill.solid(); slide.background.fill.fore_color.rgb = RGBColor(*im.getpixel((5, 5)))
            pic = slide.shapes.add_picture(p, Emu((prs.slide_width - w) // 2), Emu((prs.slide_height - h) // 2), Emu(w), Emu(h))
            pic.name = s['title']
            pic._element.nvPicPr.cNvPr.set('descr', s['title'] + ' reference sheet')
    now = datetime.datetime.now().replace(microsecond=0)
    prs.core_properties.title = cfg['site_title']; prs.core_properties.created = now; prs.core_properties.modified = now
    prs.core_properties.last_modified_by = ''; prs.core_properties.author = ''
    out = os.path.join(ROOT, 'MonstUI_Slides.pptx'); prs.save(out)
    for f in os.listdir(tmp): os.remove(os.path.join(tmp, f))
    os.rmdir(tmp)
    print('wrote', out)

def main():
    cfg = json.load(open(os.path.join(ROOT, 'tools', 'sheets.json'), encoding='utf-8'))
    listed = [sid for g in cfg['groups'] for sid in g['sheets']]
    assert sorted(listed) == sorted(cfg['sheets']), 'every sheet must be in exactly one group'
    data = {sid: sheet_data(sid, cfg['sheets'][sid]) for sid in listed}
    for s in data.values():
        for l in s['links']:
            assert 'at' in l or l['to'] in data, f"{s['id']}: link to unknown sheet {l.get('to')}"
        print(f"{s['id']}: {len(s['entries'])} entries, {len(s['links'])} tap areas")
    site = dict(title=cfg['site_title'], start=cfg['start'], groups=cfg['groups'], sheets=data)
    with open(os.path.join(ROOT, 'data.js'), 'w', encoding='utf-8') as f:
        f.write('// Generated by tools/build.py from tools/sheets.json -- do not edit by hand.\n')
        f.write('window.SITE = ' + json.dumps(site, ensure_ascii=False, separators=(',', ':')) + ';\n')
    if '--slides' in sys.argv: build_slides(cfg, data)

if __name__ == '__main__':
    main()
