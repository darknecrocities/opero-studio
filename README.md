# OPERO Mascot Package — Pero (Penguin)

Self-contained multi-part 2D vector rig, 20 animated SVG motions, 20 transparent `1024×1024` PNG pictures, React/TypeScript drop-in components with independent Cap & Jacket coloring, and interactive preview studio derived from [Pero_mascot.png](../Pero_mascot.png).

## Folder Contents

- `index.html` — Minimal 4-Tab Interactive OPERO Motion & Design Studio with kinetic SVG icons (`studio/icons.js`):
  1. **Library**: Play/pause, speed, independent Cap & Jacket color customizer, OPERO UX-state simulator, background switcher, and one-click JSX copy.
  2. **Animate**: Custom 2D bone rig keyframe timeline editor with GIF, Animated SVG, Lottie/Rive JSON, Sprite Sheet, and WebM exporters.
  3. **Design System**: Minimal OPERO Primary Theme showcase (`#FFFFFF` canvas, `#69BCFC` light blue, `#0F172A` black accents, Liquid Glass HUD lab, click-to-copy tokens, EN/JA/FIL typography, and 3-Pane Studio 7-Annotation preview).
  4. **Docs & Blueprint**: Searchable 10-chapter product & technical documentation portal synthesized from `AI_Operation_Manual_Creation_Tool.pdf`, `Opero_Architecture.pdf`, and `Opero_Research.pdf` (Concept & Features, Design System, 9-Stage Pipeline, Compatibility, Local AI/OCR, Tech Stack & I18n, STT/TTS Speech, Security & Governance, and **1 to 1.5 Week Delivery Plan** covering Planning, Design, Development, Integration, and Testing).
- `manifest.json` — Machine-readable index of all 20 motions, file paths, dimensions, palette tokens, and OPERO UX states.
- `svg/` — 20 standalone animated vector files (`01-idle-breathe.svg` – `20-error-recover.svg`) with `512×512` normalized `viewBox`, `--pero-cap-*` / `--pero-jacket-*` CSS variables, and `prefers-reduced-motion` support.
- `png/` — 20 high-resolution `1024×1024` transparent RGBA PNG pictures rendered directly from the vector SVGs.
- `app-code/` — Zero-dependency React + TypeScript + CSS module ready to drop into OPERO (`apps/desktop/src/components/mascot/`).

## Quick Integration in OPERO (React + TypeScript)

1. Copy `app-code/` into your app (e.g. `src/components/mascot/pero/`).
2. Use `<PeroMascot />` for explicit motions or `<PeroStateMascot />` to auto-map OPERO UX states, with optional `capColor` and `jacketColor` props:

```tsx
import { PeroMascot, PeroStateMascot } from './components/mascot/pero';

// Explicit motion (classic OPERO colorway)
<PeroMascot motion="thumbs-up" size={140} />

// Custom Cap & Jacket colors (auto-computes cel-shaded highlights & shadows)
<PeroMascot motion="wave-hello" capColor="#247BFA" jacketColor="#202E54" size={140} />

// Auto-mapped from OPERO session/app state
<PeroStateMascot state="recording" size={120} />
<PeroStateMascot state="processing" speed={1.2} size={120} />
<PeroStateMascot state="verified-draft" capColor="#16865B" jacketColor="#10B981" size={120} />
```

## Static / Non-React Usage

Use any file in `svg/` or `png/` directly:

```html
<img src="svg/04-recording-active.svg" alt="OPERO Recording" width="128" height="128" />
<img src="png/03-thumbs-up.png" alt="OPERO Hero Mascot" width="256" height="256" />
```
