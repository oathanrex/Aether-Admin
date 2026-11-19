# ✦ LukyVj Distortion Wave — Authentic UI Kit (Zero WCAG Restrictions)

> **Directly from Lucas Bonomi's ([@LukyVj](https://codepen.io/LukyVj)) [CodePen Showcase (`jEBJpLp`)](https://codepen.io/LukyVj/pen/jEBJpLp)**

---

## 🚀 Quick Access Files

1. **[index.html](file:///c:/Users/DEV/Downloads/top1-html-ui-kit/index.html)**:
   - **Exact 100% Authentic CodePen Version** — Pure design, zero WCAG contrast overrides or accessibility clutter.
   - Self-contained with inlined WebGL2 library (`var DistortionWave = ...`), zero external dependencies, works completely offline.
   - 40+ interactive components across 5 categories + Live React 19 section + floating Options Panel.

2. **[extended-kit.html](file:///c:/Users/DEV/Downloads/top1-html-ui-kit/extended-kit.html)**:
   - Same authentic LukyVj aesthetic, but **extended with all other HTML5 elements** (`<table>`, `<dialog>`, `<select>`, `<input type="range">`, `<progress>`, `<blockquote>`, `<mark>`, `<kbd>`).
   - Every added element uses LukyVj's exact CSS variables (`--bg: #09090b; --panel: #131316; --panel2: #1b1b20; --line: #26262d; --accent: #8b7bff;`) and features live distortion wave transitions.

3. **[original-codepen.html](file:///c:/Users/DEV/Downloads/top1-html-ui-kit/original-codepen.html)**:
   - Untouched backup copy of the original CodePen source code.

---

## 🎨 Authentic Design Tokens (LukyVj's Original System)

```css
#app {
  --bg: #09090b;
  --panel: #131316;
  --panel2: #1b1b20;
  --line: #26262d;
  --text: #ededf2;
  --muted: #8b8b96;
  --accent: #8b7bff;
  --accent-ink: #fff;
  --ok: #30d158;
  --like: #ff4f7b;
  --warn: #ffb23c;
  --danger: #ff5a5a;
  font: 14px/1.45 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

#app[data-theme="light"] {
  --bg: #f4f3f0;
  --panel: #ffffff;
  --panel2: #f1f0ec;
  --line: #e3e1dc;
  --text: #16161a;
  --muted: #6d6c75;
  --accent: #5b45ff;
}
```

---

## 🕹️ Live Tweaks Panel (Bottom Right)
- **Duration**: Control wave length in milliseconds.
- **Easing**: CSS cubic-bezier transition curves.
- **Intensity**: Displacement strength and chromatic aberration.
- **Palette**: `aurora`, `ocean`, `mint`, `ember`, or custom OKLab arrays.
- **Theme**: Toggle between Dark (`#09090b`) and Light (`#f4f3f0`) using the switch in the header.
