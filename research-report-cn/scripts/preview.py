#!/usr/bin/env python3
"""Render a .pptx to per-slide PNGs plus contact sheets for visual QA.

Usage: python3 preview.py deck.pptx [out_dir] [--dpi 80]

Needs LibreOffice (soffice) and Poppler (pdftoppm); Pillow for the contact
sheets. Fonts are aliased so the preview approximates the real look:
宋体/SimSun -> Noto Serif CJK SC (or any installed Song/Serif CJK font),
Times New Roman -> Liberation Serif, Consolas -> DejaVu Sans Mono.
The preview is an approximation: line breaks can differ slightly from
PowerPoint, so leave a little slack rather than filling boxes to the edge.
"""
import glob
import os
import subprocess
import sys
import tempfile

FONTS_CONF = """<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <include ignore_missing="yes">/etc/fonts/fonts.conf</include>
  <alias binding="same"><family>宋体</family>
    <prefer><family>Noto Serif CJK SC</family><family>Source Han Serif SC</family><family>AR PL UMing CN</family></prefer></alias>
  <alias binding="same"><family>SimSun</family>
    <prefer><family>Noto Serif CJK SC</family><family>Source Han Serif SC</family></prefer></alias>
  <alias binding="same"><family>Times New Roman</family>
    <prefer><family>Liberation Serif</family><family>DejaVu Serif</family></prefer></alias>
  <alias binding="same"><family>Consolas</family>
    <prefer><family>DejaVu Sans Mono</family><family>Liberation Mono</family></prefer></alias>
</fontconfig>
"""


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    dpi = 80
    if "--dpi" in sys.argv:
        dpi = int(sys.argv[sys.argv.index("--dpi") + 1])
        args = [a for a in args if a != str(dpi)]
    if not args:
        print(__doc__)
        sys.exit(1)
    pptx = os.path.abspath(args[0])
    out = os.path.abspath(args[1]) if len(args) > 1 else os.path.splitext(pptx)[0] + "_preview"
    os.makedirs(out, exist_ok=True)

    work = tempfile.mkdtemp(prefix="rrprev_")
    conf = os.path.join(work, "fonts.conf")
    with open(conf, "w", encoding="utf-8") as f:
        f.write(FONTS_CONF)
    env = dict(os.environ, FONTCONFIG_FILE=conf, HOME=work)
    subprocess.run(["soffice", "--headless", "--convert-to", "pdf", "--outdir", work, pptx],
                   check=True, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    pdf = os.path.join(work, os.path.splitext(os.path.basename(pptx))[0] + ".pdf")
    for old in glob.glob(os.path.join(out, "slide-*.png")):
        os.remove(old)
    subprocess.run(["pdftoppm", "-r", str(dpi), "-png", pdf, os.path.join(out, "slide")], check=True)
    pages = sorted(glob.glob(os.path.join(out, "slide-*.png")))
    print(f"{len(pages)} slides rendered to {out}")

    try:
        from PIL import Image, ImageDraw
    except ImportError:
        return
    cols, per_sheet = 3, 12
    for s in range(0, len(pages), per_sheet):
        ims = [Image.open(p) for p in pages[s:s + per_sheet]]
        w, h = ims[0].size
        rows = (len(ims) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * w + (cols + 1) * 10, rows * (h + 26) + 10), "#7a7a7a")
        d = ImageDraw.Draw(sheet)
        for i, im in enumerate(ims):
            x = 10 + (i % cols) * (w + 10)
            y = 10 + (i // cols) * (h + 26)
            sheet.paste(im, (x, y + 16))
            d.text((x, y), f"#{s + i + 1}", fill="white")
        name = os.path.join(out, f"sheet-{s // per_sheet + 1}.png")
        sheet.save(name)
        print("contact sheet:", name)


if __name__ == "__main__":
    main()
