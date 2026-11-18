export const AURORA_LAYERS = 5
export const AURORA_COLS = 64

/** uibrik-inspired defaults (tuned for Spot panel). */
export const AURORA_PARAMS = {
  intensity: 1.55,
  height: 0.46,
  spread: 0.48,
  wave: 0.15,
  stretch: 1.18,
  speed: 0.09
} as const

/** Borealis stops (mirrors theme/colors glow tokens). */
const PALETTE = ['#D6FF4B', '#2DE2C5', '#0B6B7A', '#3D6DFF', '#021018'] as const

function clamp01(v: number) {
  'worklet'
  return Math.min(1, Math.max(0, v))
}

function hashNoise(x: number, t: number, seed: number) {
  'worklet'
  return (
    Math.sin(x * 1.73 + t * 0.91 + seed * 2.17) * 0.52 +
    Math.sin(x * 3.07 - t * 0.58 + seed * 4.3) * 0.28 +
    Math.sin(x * 0.61 + t * 1.35 + seed) * 0.14
  )
}

function paletteRgb(hue: number) {
  'worklet'
  const h = ((hue % 1) + 1) % 1
  const scaled = h * (PALETTE.length - 1)
  const i = Math.floor(scaled)
  const f = scaled - i
  const a = hexToRgb(PALETTE[Math.min(i, PALETTE.length - 1)])
  const b = hexToRgb(PALETTE[Math.min(i + 1, PALETTE.length - 1)])
  return {
    r: a.r + (b.r - a.r) * f,
    g: a.g + (b.g - a.g) * f,
    b: a.b + (b.b - a.b) * f
  }
}

function hexToRgb(hex: string) {
  'worklet'
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, '$1$1') : h, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function curtainAt(xNorm: number, layer: number, t: number, aspect: number) {
  'worklet'
  const { height, wave, stretch } = AURORA_PARAMS
  const x = xNorm * aspect
  const xs = x / stretch
  const fi = layer
  const y0 =
    height -
    0.07 * fi +
    wave * 0.11 * hashNoise(xs * 0.8 + fi * 3.1, t, fi) +
    wave * 0.04 * hashNoise(xs * 2.2, t * 1.6, fi + 4)
  const fold = 0.55 + 0.45 * hashNoise(xs * 1.1 + fi * 5, t * 0.8, fi + 2)
  const strength = fold * Math.max(1 - 0.18 * fi, 0.25)
  const hue =
    xs * 0.16 + t * 0.35 + fi * 0.33 + 0.08 * hashNoise(xs * 0.7, t, fi + 9)
  return { edge: y0, strength, hue }
}

/** Additive glow at a point (yNorm: 0 top, 1 bottom). */
export function sampleGlow(
  xNorm: number,
  yNorm: number,
  t: number,
  aspect: number
) {
  'worklet'
  const { intensity, spread } = AURORA_PARAMS
  let gr = 0
  let gg = 0
  let gb = 0
  let ga = 0

  for (let i = 0; i < AURORA_LAYERS; i++) {
    const c = curtainAt(xNorm, i, t, aspect)
    const d = yNorm - c.edge
    const reach = spread * (0.75 + 0.3 * i)
    const a =
      (d > 0 ? Math.exp((-d * d) * 90) : Math.exp(-Math.max(0, -d) / reach)) * c.strength

    const light = paletteRgb(c.hue)
    gr += light.r * a
    gg += light.g * a
    gb += light.b * a
    ga += a
  }

  const gain = intensity * 0.55
  return {
    r: Math.min(255, gr * gain),
    g: Math.min(255, gg * gain),
    b: Math.min(255, gb * gain),
    a: clamp01(ga * gain * 0.35)
  }
}

/** Brighter screen pass for the “foreground” glow. */
export function sampleGlowScreen(
  xNorm: number,
  yNorm: number,
  t: number,
  aspect: number
) {
  'worklet'
  const base = sampleGlow(xNorm, yNorm, t, aspect)
  const upperBias = clamp01((0.65 - yNorm) * 1.4)
  return {
    r: Math.min(255, base.r * (1.1 + upperBias * 0.25)),
    g: Math.min(255, base.g * (1.05 + upperBias * 0.08)),
    b: Math.min(255, base.b * (1.15 + upperBias * 0.35)),
    a: clamp01(base.a * (0.85 + upperBias * 0.4))
  }
}

export function columnGradientStops(
  xNorm: number,
  t: number,
  aspect: number,
  pass: 'curtain' | 'screen'
) {
  'worklet'
  const steps = 11
  const outColors: string[] = []
  const outPos: number[] = []

  for (let s = 0; s <= steps; s++) {
    const yNorm = s / steps
    const g =
      pass === 'curtain'
        ? sampleGlow(xNorm, yNorm, t, aspect)
        : sampleGlowScreen(xNorm, yNorm, t, aspect)
    outPos.push(1 - yNorm)
    outColors.push(`rgba(${g.r | 0},${g.g | 0},${g.b | 0},${g.a.toFixed(3)})`)
  }
  return { colors: outColors, positions: outPos }
}