export interface PeroColorScheme {
  light: string;
  main: string;
  shade: string;
  accent: string;
  seam: string;
  highlight: string;
}

export interface PeroOutfitPreset {
  id: string;
  name: string;
  capColor: string;
  jacketColor: string;
}

export const PERO_DEFAULT_CAP_COLOR = '#69BCFC';
export const PERO_DEFAULT_JACKET_COLOR = '#69BCFC';

export const PERO_OUTFIT_PRESETS: readonly PeroOutfitPreset[] = [
  { id: 'opero-classic', name: 'OPERO Classic', capColor: '#69BCFC', jacketColor: '#69BCFC' },
  { id: 'opero-cobalt', name: 'OPERO Cobalt', capColor: '#247BFA', jacketColor: '#247BFA' },
  { id: 'midnight-ops', name: 'Midnight Ops', capColor: '#202E54', jacketColor: '#334155' },
  { id: 'emerald-verified', name: 'Emerald Verified', capColor: '#16865B', jacketColor: '#10B981' },
  { id: 'amber-studio', name: 'Amber Studio', capColor: '#F59E0B', jacketColor: '#D97706' },
  { id: 'coral-alert', name: 'Coral Pop', capColor: '#EF4444', jacketColor: '#F43F5E' },
  { id: 'violet-ai', name: 'Violet AI', capColor: '#7C3AED', jacketColor: '#8B5CF6' },
  { id: 'slate-pro', name: 'Slate Pro', capColor: '#475569', jacketColor: '#64748B' },
] as const;

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function parseHex(hex: string): [number, number, number] | null {
  const clean = hex.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)) return null;
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return [h / 6, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  const hue2rgb = (p: number, q: number, t: number): number => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  let r: number;
  let g: number;
  let b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (x: number) => clamp(Math.round(x * 255), 0, 255).toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function derivePeroColorScheme(hex: string, defaultHex = PERO_DEFAULT_CAP_COLOR): PeroColorScheme {
  const rgb = parseHex(hex) ?? parseHex(defaultHex)!;
  const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
  const main = hslToHex(h, s, l);
  return {
    highlight: hslToHex(h, clamp(s * 0.9, 0, 1), clamp(l + 0.17, 0.2, 0.95)),
    light: hslToHex(h, clamp(s * 0.95, 0, 1), clamp(l + 0.08, 0.14, 0.92)),
    main,
    shade: hslToHex(h, clamp(s + 0.04, 0, 1), clamp(l - 0.11, 0.08, 0.85)),
    seam: hslToHex(h, clamp(s + 0.06, 0, 1), clamp(l - 0.19, 0.06, 0.78)),
    accent: hslToHex(h, clamp(s + 0.08, 0, 1), clamp(l - 0.17, 0.08, 0.75)),
  };
}

export function buildPeroColorVars(capColor?: string, jacketColor?: string): Record<string, string> {
  const cap = derivePeroColorScheme(capColor ?? PERO_DEFAULT_CAP_COLOR, PERO_DEFAULT_CAP_COLOR);
  const jacket = derivePeroColorScheme(jacketColor ?? PERO_DEFAULT_JACKET_COLOR, PERO_DEFAULT_JACKET_COLOR);
  return {
    '--pero-cap-highlight': cap.highlight,
    '--pero-cap-light': cap.light,
    '--pero-cap-main': cap.main,
    '--pero-cap-shade': cap.shade,
    '--pero-cap-seam': cap.seam,
    '--pero-cap-button': cap.accent,
    '--pero-jacket-highlight': jacket.highlight,
    '--pero-jacket-light': jacket.light,
    '--pero-jacket-main': jacket.main,
    '--pero-jacket-shade': jacket.shade,
    '--pero-jacket-accent': jacket.accent,
  };
}
