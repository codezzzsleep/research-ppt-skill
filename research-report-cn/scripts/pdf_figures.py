#!/usr/bin/env python3
"""Cut paper figures out of a PDF for slides.

Three sub-commands, used in this order:

  render  PDF OUT_DIR [--pages 1-9] [--dpi 300]
          Render pages to OUT_DIR/p-01.png ... (300 dpi keeps figures sharp).

  bands   PAGE_PNG [--x 0.05 0.95] [--y 0.0 1.0]
          Print the vertical "ink bands" inside a horizontal strip of the page,
          as page fractions. A figure is usually one tall band; its caption is
          the short band right below it; the running header is the short band
          at the very top. Use --x to restrict to one column of a 2-column paper.

  crop    PAGE_PNG OUT_PNG --box X0 Y0 X1 Y1
          Crop a box given in page fractions, then auto-trim white margins
          (12 px padding kept). Always look at OUT_PNG afterwards: no running
          header, no caption text, no cut-off axis labels.

Typical session:
  python3 pdf_figures.py render paper.pdf figs/raw --pages 1-6
  python3 pdf_figures.py bands figs/raw/p-04.png --x 0.06 0.95 --y 0.03 0.45
      0.060-0.073  h=42px     <- running header
      0.085-0.291  h=681px    <- the figure
      0.301-0.336  h=116px    <- caption
  python3 pdf_figures.py crop figs/raw/p-04.png figs/framework.png --box 0.06 0.080 0.95 0.295
"""
import argparse
import glob
import os
import subprocess
import sys


def cmd_render(a):
    os.makedirs(a.out_dir, exist_ok=True)
    first, last = (a.pages.split("-") + [None])[:2] if a.pages else (None, None)
    cmd = ["pdftoppm", "-r", str(a.dpi), "-png"]
    if first:
        cmd += ["-f", first, "-l", last or first]
    cmd += [a.pdf, os.path.join(a.out_dir, "p")]
    subprocess.run(cmd, check=True, stderr=subprocess.DEVNULL)
    for p in sorted(glob.glob(os.path.join(a.out_dir, "p-*.png"))):
        print(p)


def cmd_bands(a):
    from PIL import Image
    im = Image.open(a.page).convert("L")
    w, h = im.size
    x0, x1 = int(w * a.x[0]), int(w * a.x[1])
    y0, y1 = int(h * a.y[0]), int(h * a.y[1])
    px = im.load()
    bands, start, gap, end = [], None, 0, None
    for y in range(y0, y1):
        ink = any(px[x, y] < 200 for x in range(x0, x1, 3))
        if ink:
            if start is None:
                start = y
            gap, end = 0, y
        elif start is not None:
            gap += 1
            if gap >= a.min_gap:
                bands.append((start, end))
                start = None
    if start is not None:
        bands.append((start, end))
    for s, e in bands:
        print(f"{s / h:.3f}-{e / h:.3f}  h={e - s}px")


def cmd_crop(a):
    from PIL import Image, ImageChops
    im = Image.open(a.page).convert("RGB")
    w, h = im.size
    bx = a.box
    c = im.crop((int(w * bx[0]), int(h * bx[1]), int(w * bx[2]), int(h * bx[3])))
    bg = Image.new("RGB", c.size, (255, 255, 255))
    mask = ImageChops.difference(c, bg).convert("L").point(lambda p: 255 if p > 18 else 0)
    bb = mask.getbbox()
    if bb:
        pad = 12
        c = c.crop((max(0, bb[0] - pad), max(0, bb[1] - pad), min(c.size[0], bb[2] + pad), min(c.size[1], bb[3] + pad)))
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    c.save(a.out)
    print(f"{a.out}  {c.size[0]}x{c.size[1]}px  aspect {c.size[0] / c.size[1]:.2f}")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = p.add_subparsers(dest="cmd", required=True)
    r = sp.add_parser("render")
    r.add_argument("pdf"); r.add_argument("out_dir")
    r.add_argument("--pages"); r.add_argument("--dpi", type=int, default=300)
    b = sp.add_parser("bands")
    b.add_argument("page")
    b.add_argument("--x", type=float, nargs=2, default=[0.05, 0.95])
    b.add_argument("--y", type=float, nargs=2, default=[0.0, 1.0])
    b.add_argument("--min-gap", type=int, default=15)
    c = sp.add_parser("crop")
    c.add_argument("page"); c.add_argument("out")
    c.add_argument("--box", type=float, nargs=4, required=True, metavar=("X0", "Y0", "X1", "Y1"))
    a = p.parse_args()
    {"render": cmd_render, "bands": cmd_bands, "crop": cmd_crop}[a.cmd](a)


if __name__ == "__main__":
    sys.exit(main())
