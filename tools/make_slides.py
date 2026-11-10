"""Capture every page of the site and build MonstUI_Slides.pptx (one 16:9 slide per page in menu order, plus one per overlay).

    python tools/make_slides.py

Needs Python Playwright (with Chromium) and python-pptx.
"""
import datetime, functools, http.server, os, tempfile, threading
from playwright.sync_api import sync_playwright
from pptx import Presentation
from pptx.util import Inches

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1920, 1080

def main():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    handler = functools.partial(Quiet, directory=ROOT)
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}/index.html?slide'
    prs = Presentation(); prs.slide_width, prs.slide_height = Inches(13.333), Inches(7.5)
    with tempfile.TemporaryDirectory() as tmp, sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={'width': W, 'height': H})
        page.goto(base); page.wait_for_function('window.SITE')
        site = page.evaluate('({title: SITE.title, menu: SITE.menu, titles: Object.fromEntries(SITE.menu.map(p => [p, SITE.pages[p].title])), '
                             'overlays: Object.fromEntries(SITE.menu.map(p => [p, SITE.pages[p].items.filter(i => i.overlay).map(i => [i.n, i.overlay.title])]))})')
        def add(png, title):
            slide = prs.slides.add_slide(prs.slide_layouts[6])
            pic = slide.shapes.add_picture(png, 0, 0, prs.slide_width, prs.slide_height)
            pic.name = title
            pic._element.nvPicPr.cNvPr.set('descr', title)
        shown = set()   # an overlay used on several pages gets one slide
        for pid in site['menu']:
            page.goto(f'{base}#{pid}'); page.wait_for_load_state('networkidle'); page.wait_for_timeout(300)
            png = os.path.join(tmp, pid + '.png'); page.screenshot(path=png)
            add(png, site['titles'][pid])
            for n, name in site['overlays'][pid]:   # each overlay gets its own slide, shown over its page
                if name in shown: continue
                shown.add(name)
                page.click(f'#i-{n} .open'); page.wait_for_timeout(200)
                png = os.path.join(tmp, f'{pid}-{n}.png'); page.screenshot(path=png)
                add(png, f"{site['titles'][pid]} - {name}")
                page.keyboard.press('Escape')
        browser.close()
        now = datetime.datetime.now().replace(microsecond=0)
        cp = prs.core_properties
        cp.title = site['title']; cp.created = now; cp.modified = now; cp.author = ''; cp.last_modified_by = ''
        out = os.path.join(ROOT, 'MonstUI_Slides.pptx'); prs.save(out)
    server.shutdown()
    print('wrote', out, len(prs.slides), 'slides')

if __name__ == '__main__':
    main()
