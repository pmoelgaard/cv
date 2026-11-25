import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, 'public');
const ICONS = path.join(PUBLIC, 'icons');
const OG = path.join(PUBLIC, 'og');

fs.mkdirSync(ICONS, { recursive: true });
fs.mkdirSync(OG, { recursive: true });

// 1. Adaptive SVG Favicon (PEMO 2x2 architectural monogram, light/dark)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
  <style>
    .bg { fill: #f2efe9; }
    .frame { stroke: rgba(17, 21, 18, 0.34); }
    .grid { stroke: rgba(17, 21, 18, 0.12); }
    .corner { stroke: #1a4d3e; }
    .glyph { stroke: #111512; }
    .node { fill: #c84b31; }
    @media (prefers-color-scheme: dark) {
      .bg { fill: #070a0d; }
      .frame { stroke: rgba(237, 234, 226, 0.34); }
      .grid { stroke: rgba(237, 234, 226, 0.12); }
      .corner { stroke: #2eb886; }
      .glyph { stroke: #edeae2; }
      .node { fill: #ea5b3c; }
    }
  </style>
  <rect class="bg" width="120" height="120"/>
  <rect class="frame" x="6" y="6" width="108" height="108" stroke-width="1.5"/>
  <line class="grid" x1="60" y1="6" x2="60" y2="114" stroke-width="1"/>
  <line class="grid" x1="6" y1="60" x2="114" y2="60" stroke-width="1"/>
  <path class="corner" d="M2 14V2H14 M106 2H118V14 M118 106V118H106 M14 118H2V106" stroke-width="1.8"/>
  <path class="glyph" d="M24 47V21H40L44 25V31L40 35H28" stroke-width="3.6" stroke-linecap="square" stroke-linejoin="miter"/>
  <path class="glyph" d="M74 21H94 M74 34H89 M74 47H94 M74 21V47" stroke-width="3.6" stroke-linecap="square"/>
  <path class="glyph" d="M21 98V72L33.5 87L46 72V98" stroke-width="3.6" stroke-linecap="square" stroke-linejoin="miter"/>
  <circle class="glyph" cx="84" cy="85" r="13" stroke-width="3.6"/>
  <circle class="node" cx="93.5" cy="75.5" r="3.2"/>
</svg>
`;
fs.writeFileSync(path.join(PUBLIC, 'favicon.svg'), faviconSvg, 'utf8');

// 2. Safari Pinned Tab monochrome SVG (PEMO)
const safariPinnedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <path fill="#000000" d="M6 6h108v108H6V6zm4 4v100h100V10H10zm12 9h20l4 4v8l-4 4H28v12h-6V19zm6 6v6h10l2-2v-2l-2-2H28zm44-6h22v6H78v5h12v6H78v5h16v6H72V19zM19 70h6l8.5 11L42 70h6v28h-6V80l-8.5 11L25 80v18h-6V70zm65 2a15 15 0 1 1 0 30 15 15 0 0 1 0-30zm0 6a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"/>
</svg>
`;
fs.writeFileSync(path.join(ICONS, 'safari-pinned-tab.svg'), safariPinnedSvg, 'utf8');

// 3. Render crisp raster icons & OG social cards via Python PIL
const pyScript = `
import os
from PIL import Image, ImageDraw, ImageFont

ICONS = ${JSON.stringify(ICONS)}
OG = ${JSON.stringify(OG)}
PUBLIC = ${JSON.stringify(PUBLIC)}

BG = (242, 239, 233)
SURFACE = (250, 248, 244)
INK = (17, 21, 18)
MUTED = (63, 71, 65)
JUNGLE = (26, 77, 62)
TERRACOTTA = (200, 75, 49)
GRID = (208, 203, 194)
GRID_STRONG = (155, 152, 144)

def lerp_color(c1, c2, t):
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))

def draw_pemo_monogram_on(d, ox, oy, span, stroke_scale=1.0, fill_bg=True):
    def px(v): return ox + (v / 120.0) * span
    def py(v): return oy + (v / 120.0) * span
    sw_frame = max(1, int(round((1.5 / 120.0) * span)))
    sw_grid = max(1, int(round((1.0 / 120.0) * span)))
    sw_glyph = max(2, int(round((3.8 / 120.0) * span * stroke_scale)))

    if fill_bg:
        d.rectangle([px(6), py(6), px(114), py(114)], fill=SURFACE, outline=GRID_STRONG, width=sw_frame)
    else:
        d.rectangle([px(6), py(6), px(114), py(114)], outline=GRID_STRONG, width=sw_frame)

    d.line([(px(60), py(6)), (px(60), py(114))], fill=GRID, width=sw_grid)
    d.line([(px(6), py(60)), (px(114), py(60))], fill=GRID, width=sw_grid)

    cb = max(1, int(round((2.0 / 120.0) * span)))
    for pts in [
        [(px(2), py(14)), (px(2), py(2)), (px(14), py(2))],
        [(px(106), py(2)), (px(118), py(2)), (px(118), py(14))],
        [(px(118), py(106)), (px(118), py(118)), (px(106), py(118))],
        [(px(14), py(118)), (px(2), py(118)), (px(2), py(106))],
    ]:
        d.line(pts, fill=JUNGLE, width=cb)

    d.line([(px(24), py(47)), (px(24), py(21)), (px(40), py(21)), (px(44), py(25)), (px(44), py(31)), (px(40), py(35)), (px(28), py(35))], fill=INK, width=sw_glyph, joint="curve")

    c_e = lerp_color(INK, JUNGLE, 0.35)
    d.line([(px(74), py(21)), (px(74), py(47))], fill=c_e, width=sw_glyph)
    d.line([(px(74), py(21)), (px(94), py(21))], fill=c_e, width=sw_glyph)
    d.line([(px(74), py(34)), (px(89), py(34))], fill=c_e, width=sw_glyph)
    d.line([(px(74), py(47)), (px(94), py(47))], fill=c_e, width=sw_glyph)

    c_m = lerp_color(INK, JUNGLE, 0.55)
    d.line([(px(21), py(98)), (px(21), py(72)), (px(33.5), py(87)), (px(46), py(72)), (px(46), py(98))], fill=c_m, width=sw_glyph, joint="curve")

    c_o = JUNGLE
    d.ellipse([px(71), py(72), px(97), py(98)], outline=c_o, width=sw_glyph)
    nr = max(2, int(round((3.4 / 120.0) * span)))
    d.ellipse([px(93.5) - nr, py(75.5) - nr, px(93.5) + nr, py(75.5) + nr], fill=TERRACOTTA)

def draw_emblem(size, pad_ratio=0.0):
    scale = 4
    S = size * scale
    img = Image.new("RGB", (S, S), BG)
    d = ImageDraw.Draw(img)
    pad = S * pad_ratio
    span = S - 2 * pad
    draw_pemo_monogram_on(d, pad, pad, span, stroke_scale=1.15 if size <= 32 else 1.0, fill_bg=True)
    return img.resize((size, size), Image.Resampling.LANCZOS)

for sz, name in [
    (16, "favicon-16x16.png"),
    (32, "favicon-32x32.png"),
    (150, "mstile-150x150.png"),
    (180, "apple-touch-icon.png"),
    (192, "icon-192.png"),
    (512, "icon-512.png"),
]:
    draw_emblem(sz, 0.0).save(os.path.join(ICONS, name), "PNG")

draw_emblem(512, 0.14).save(os.path.join(ICONS, "icon-512-maskable.png"), "PNG")
draw_emblem(256, 0.0).save(os.path.join(PUBLIC, "favicon.ico"), format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])

def load_font(paths, size):
    for p in paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

BOLD_FONTS = ["/System/Library/Fonts/Supplemental/Arial Bold.ttf", "/System/Library/Fonts/Helvetica.ttc"]
MONO_FONTS = ["/System/Library/Fonts/Menlo.ttc", "/System/Library/Fonts/Supplemental/Courier New Bold.ttf"]

def draw_orbital_blueprint(d, cx, cy, r_outer):
    d.ellipse([cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer], outline=GRID_STRONG, width=2)
    r_inner = int(r_outer * 0.74)
    d.ellipse([cx - r_inner, cy - r_inner, cx + r_inner, cy + r_inner], outline=GRID, width=1)
    d.line([(cx - r_outer - 20, cy), (cx + r_outer + 20, cy)], fill=GRID, width=1)
    d.line([(cx, cy - r_outer - 20), (cx, cy + r_outer + 20)], fill=GRID, width=1)
    mono_span = int(r_outer * 0.94)
    draw_pemo_monogram_on(d, cx - mono_span // 2, cy - mono_span // 2, mono_span, stroke_scale=1.0, fill_bg=True)
    nx = cx + int(r_outer * 0.71)
    ny = cy - int(r_outer * 0.71)
    d.ellipse([nx - 5, ny - 5, nx + 5, ny + 5], fill=TERRACOTTA)

# Wide OG 1200x630
og_w = Image.new("RGB", (1200, 630), BG)
dw = ImageDraw.Draw(og_w)
for x in (60, 740, 1140): dw.line([(x, 0), (x, 630)], fill=GRID, width=1)
for y in (64, 546): dw.line([(0, y), (1200, y)], fill=GRID, width=1)
dw.rectangle([88, 96, 100, 108], fill=TERRACOTTA)
dw.text((114, 92), "PEMO // DOSSIER 1997-2026 // COPENHAGEN & BANGKOK", fill=TERRACOTTA, font=load_font(MONO_FONTS, 17))
f_h1 = load_font(BOLD_FONTS, 74)
dw.text((88, 150), "CURRICULUM", fill=INK, font=f_h1)
dw.text((88, 232), "VITAE", fill=INK, font=f_h1)
dw.line([(88, 345), (680, 345)], fill=GRID, width=1)
dw.text((88, 365), "PETER ANDREAS MOELGAARD  //  ARCHITECT & CTO", fill=MUTED, font=load_font(MONO_FONTS, 19))
dw.line([(88, 405), (680, 405)], fill=GRID, width=1)
dw.rectangle([88, 460, 360, 512], fill=JUNGLE)
dw.text((112, 475), "CV.PEMO.ME", fill=SURFACE, font=load_font(MONO_FONTS, 22))
draw_orbital_blueprint(dw, 940, 305, 185)
og_w.save(os.path.join(OG, "og-default.png"), "PNG")

# Square OG 1200x1200
og_s = Image.new("RGB", (1200, 1200), BG)
ds = ImageDraw.Draw(og_s)
ds.rectangle([56, 56, 1144, 1144], outline=GRID, width=2)
draw_orbital_blueprint(ds, 600, 390, 260)
ds.text((108, 740), "CURRICULUM", fill=INK, font=load_font(BOLD_FONTS, 86))
ds.text((108, 836), "VITAE", fill=INK, font=load_font(BOLD_FONTS, 86))
ds.text((108, 962), "PETER A. MOELGAARD // 1997-2026", fill=MUTED, font=load_font(MONO_FONTS, 24))
ds.rectangle([108, 1028, 420, 1092], fill=JUNGLE)
ds.text((140, 1046), "CV.PEMO.ME", fill=SURFACE, font=load_font(MONO_FONTS, 26))
og_s.save(os.path.join(OG, "og-square.png"), "PNG")
print("PIL PEMO CV brand assets complete")
`;

execFileSync('python3', ['-c', pyScript], { stdio: 'inherit' });

// 4. Web App Manifest & Browserconfig
const manifest = {
  name: 'Peter A. Moelgaard — Curriculum Vitae',
  short_name: 'PEMO CV',
  description: 'Executive Curriculum Vitae of Peter Andreas Moelgaard — Principal Architect, CTO, and Board Advisor (1997–2026).',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: '#f2efe9',
  theme_color: '#1a4d3e',
  icons: [
    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
};
fs.writeFileSync(path.join(PUBLIC, 'site.webmanifest'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');

const browserconfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/icons/mstile-150x150.png"/>
      <TileColor>#1a4d3e</TileColor>
    </tile>
  </msapplication>
</browserconfig>
`;
fs.writeFileSync(path.join(PUBLIC, 'browserconfig.xml'), browserconfig, 'utf8');

console.log('Regenerated all PEMO CV favicons, manifests, and OG cards.');
