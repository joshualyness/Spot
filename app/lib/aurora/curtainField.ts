/**
 * CPU port of uibrik aurora `first-frame.ts` — same curtain geometry, palette, and additive glow.
 * @see https://uibrik.com/r/aurora.json
 */

export type Lab = readonly [number, number, number]

export type CurtainFieldOptions = {
  colors: string[]
  base: string
  dark: boolean
  intensity: number
  /** 0 bottom … 1 top */
  height: number
  spread: number
  layers: number
  waviness: number
  stretch: number
  seed: number
  /** Shader clock (static frame ≈ 12). */
  time?: number
}

export const DEFAULT_CURTAIN_OPTIONS: CurtainFieldOptions = {
  colors: ['#E4FF4A', '#2DE2C5', '#22B8E8', '#4A7AFF', '#5C6BF0'],
  base: '#000000',
  dark: true,
  intensity: 1.22,
  /** uibrik: 0 at bottom, 1 at top — lowest curtain edge sits ~32% above the bottom. */
  height: 0.32,
  spread: 0.3,
  layers: 5,
  waviness: 1,
  stretch: 1.05,
  seed: 0,
  time: 12
}

const MAX_LAYERS = 5

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

const f32 = Math.fround
const INV289 = f32(1 / 289)
const mod289 = (x: number) => x - Math.floor(f32(x * INV289)) * 289
const permute = (x: number) => mod289((x * 34 + 1) * x)

function snoise(vx: number, vy: number, vz: number) {
  const C1 = 1 / 6
  const C2 = 1 / 3
  const s = (vx + vy + vz) * C2
  let ix = Math.floor(vx + s)
  let iy = Math.floor(vy + s)
  let iz = Math.floor(vz + s)
  const t = (ix + iy + iz) * C1
  const x0 = [vx - ix + t, vy - iy + t, vz - iz + t]
  const g = [x0[0] >= x0[1] ? 1 : 0, x0[1] >= x0[2] ? 1 : 0, x0[2] >= x0[0] ? 1 : 0]
  const l = [1 - g[0], 1 - g[1], 1 - g[2]]
  const i1 = [Math.min(g[0], l[2]), Math.min(g[1], l[0]), Math.min(g[2], l[1])]
  const i2 = [Math.max(g[0], l[2]), Math.max(g[1], l[0]), Math.max(g[2], l[1])]
  const x1 = [x0[0] - i1[0] + C1, x0[1] - i1[1] + C1, x0[2] - i1[2] + C1]
  const x2 = [x0[0] - i2[0] + C2, x0[1] - i2[1] + C2, x0[2] - i2[2] + C2]
  const x3 = [x0[0] - 0.5, x0[1] - 0.5, x0[2] - 0.5]
  ix = mod289(ix)
  iy = mod289(iy)
  iz = mod289(iz)
  const corner = [
    [0, 0, 0],
    [i1[0], i1[1], i1[2]],
    [i2[0], i2[1], i2[2]],
    [1, 1, 1]
  ]
  const p = corner.map(([cx, cy, cz]) => permute(permute(permute(iz + cz) + iy + cy) + ix + cx))
  const n = f32(0.142857142857)
  const ns = [f32(n * 2), f32(n * 0.5 - 1), n]
  const xs = [x0, x1, x2, x3]
  let sum = 0
  for (let k = 0; k < 4; k++) {
    const j = p[k] - 49 * Math.floor(f32(f32(p[k] * ns[2]) * ns[2]))
    const xq = Math.floor(f32(j * ns[2]))
    const yq = Math.floor(j - 7 * xq)
    const gx = xq * ns[0] + ns[1]
    const gy = yq * ns[0] + ns[1]
    const h = 1 - Math.abs(gx) - Math.abs(gy)
    const sh = h <= 0 ? -1 : 0
    let ax = gx + (Math.floor(gx) * 2 + 1) * sh
    let ay = gy + (Math.floor(gy) * 2 + 1) * sh
    let az = h
    const norm = 1.79284291400159 - 0.85373472095314 * (ax * ax + ay * ay + az * az)
    ax *= norm
    ay *= norm
    az *= norm
    const x = xs[k]
    const m = Math.max(0.6 - (x[0] * x[0] + x[1] * x[1] + x[2] * x[2]), 0)
    sum += m * m * m * m * (ax * x[0] + ay * x[1] + az * x[2])
  }
  return 42 * sum
}

function hexToOklab(hex: string): Lab {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const sr = r <= 0.04045 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4
  const sg = g <= 0.04045 ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4
  const sb = b <= 0.04045 ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4
  const l = 0.4122214708 * sr + 0.5363325363 * sg + 0.0514459929 * sb
  const m = 0.2119034982 * sr + 0.6806995451 * sg + 0.1073969566 * sb
  const s = 0.0883024619 * sr + 0.2817188376 * sg + 0.6299787005 * sb
  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)
  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0258642378 * l_ + 0.7827717662 * m_ - 0.808675766 * s_
  ]
}

function oklabToLinear([L, A, B]: Lab): Lab {
  let l = L + 0.3963377774 * A + 0.2158037573 * B
  let m = L - 0.1055613458 * A - 0.0638541728 * B
  let s = L - 0.0894841775 * A - 1.291485548 * B
  l = l * l * l
  m = m * m * m
  s = s * s * s
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
  ]
}

function paletteLoop(palette: Lab[], x: number): Lab {
  const n = palette.length
  const f = (x - Math.floor(x)) * n
  const i = Math.floor(f)
  const j = i + 1 >= n ? 0 : i + 1
  const u = f - i
  const s = u * u * (3 - 2 * u)
  return palette[i].map((v, k) => v + (palette[j][k] - v) * s) as unknown as Lab
}

function linearToSrgb(c: number) {
  c = clamp(c, 0, 1)
  return c < 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055
}

function linearToHex(rgb: Lab) {
  const parts = rgb.map(c => Math.round(linearToSrgb(c) * 255))
  return `#${parts.map(n => n.toString(16).padStart(2, '0')).join('')}`
}

type CurtainSample = {
  y0: number
  strength: number
  light: Lab
  reach: number
}

function curtainsAtX(xs: number, o: CurtainFieldOptions, t: number, palette: Lab[]) {
  const layers = Math.min(o.layers, MAX_LAYERS)
  const out: CurtainSample[] = []
  for (let i = 0; i < layers; i++) {
    // Shader `u_height` is 0 at the bottom of the box … 1 at the top; CPU `y` is 0 top … 1 bottom.
    const edgeFromBottom =
      o.height -
      0.07 * i +
      o.waviness * 0.11 * snoise(xs * 0.8 + i * 3.1, t, i) +
      o.waviness * 0.04 * snoise(xs * 2.2, t * 1.6, i + 4)
    const y0 = 1 - edgeFromBottom
    const fold = 0.55 + 0.45 * snoise(xs * 1.1 + i * 5, t * 0.8, i + 2)
    const hue = xs * 0.16 + t * 0.35 + i * 0.33 + 0.08 * snoise(xs * 0.7, t, i + 9)
    out.push({
      y0,
      strength: fold * Math.max(1 - 0.18 * i, 0.25),
      light: oklabToLinear(paletteLoop(palette, hue)),
      reach: o.spread * (0.75 + 0.3 * i)
    })
  }
  return out
}

/** Linear RGB 0..1 after dark additive composite. */
export function sampleCurtainField(
  x: number,
  y: number,
  aspect: number,
  o: CurtainFieldOptions
): Lab {
  const palette = o.colors.map(hexToOklab)
  const bg = oklabToLinear(hexToOklab(o.base))
  const t = ((o.time ?? 12) + o.seed * 37.1) * 0.09
  const xs = x / o.stretch
  const curtains = curtainsAtX(xs, o, t, palette)
  const glow: Lab = [0, 0, 0]
  for (const c of curtains) {
    const d = y - c.y0
    const a =
      (d > 0 ? Math.exp(-d / c.reach) : Math.exp(-d * d * 90)) * c.strength
    for (let k = 0; k < 3; k++) {
      glow[k] += c.light[k] * a
    }
  }
  const foot = oklabToLinear(hexToOklab('#F2FF8E'))
  const bottomBand = Math.exp(-Math.pow((1 - y) / 0.11, 2))
  for (let k = 0; k < 3; k++) {
    glow[k] += foot[k] * bottomBand * 0.65
  }
  return bg.map((v, k) => v + glow[k] * o.intensity * 0.7) as unknown as Lab
}

export type ColumnStop = { offset: string; color: string }

/** Vertical gradient stops for one column (y: 0 top → 1 bottom). */
export function columnStops(
  colIndex: number,
  colCount: number,
  aspect: number,
  o: CurtainFieldOptions,
  sampleYs: number[] = [0, 0.08, 0.2, 0.35, 0.5, 0.65, 0.8, 0.92, 0.99, 1]
): ColumnStop[] {
  const x = ((colIndex + 0.5) / colCount) * aspect
  return sampleYs.map(y => {
    const rgb = sampleCurtainField(x, y, aspect, o)
    return {
      offset: `${(y * 100).toFixed(1)}%`,
      color: linearToHex(rgb)
    }
  })
}