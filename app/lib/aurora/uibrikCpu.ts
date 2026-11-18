/**
 * CPU aurora renderer ported from uibrik/shadcn `first-frame.ts`
 * Registry: https://uibrik.com/r/aurora.json
 *
 * Not published on GitHub — distributed via shadcn CLI only.
 */

import { hexToRgb } from './colors'

export type Lab = [number, number, number]

export type UibrikAuroraOptions = {
  colors: string[]
  base: string
  dark: boolean
  intensity: number
  height: number
  spread: number
  layers: number
  waviness: number
  stretch: number
  seed: number
  time: number
  width: number
  pixelHeight: number
}

const MAX_LAYERS = 5
const CLOCK_START = 12

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)

export function hexToOklab(hex: string): Lab {
  const [r, g, b] = hexToRgb(hex)
  const lr = toLinear(r)
  const lg = toLinear(g)
  const lb = toLinear(b)
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  ]
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function paletteLoop(palette: Lab[], x: number): Lab {
  const n = palette.length
  const f = (x - Math.floor(x)) * n
  const i = Math.floor(f)
  const j = i + 1 >= n ? 0 : i + 1
  const u = f - i
  const s = u * u * (3 - 2 * u)
  return palette[i].map((v, k) => v + (palette[j][k] - v) * s) as Lab
}

function oklabToLinear([L, A, B]: readonly number[]): Lab {
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

function linearToSrgb(c: number) {
  c = clamp(c, 0, 1)
  return c < 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055
}

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

/** Renders one aurora frame (RGB, top-down rows). */
export function renderUibrikAuroraFrame(o: UibrikAuroraOptions): Uint8Array {
  const W = Math.max(48, Math.round(o.width))
  const H = Math.max(48, Math.round(o.pixelHeight))
  const palette = (o.colors.length > 1 ? o.colors : [o.colors[0] ?? '#808080', o.colors[0] ?? '#808080']).map(
    hexToOklab
  )
  const bg = oklabToLinear(hexToOklab(o.base))
  const t = (CLOCK_START + o.time + o.seed * 37.1) * 0.09
  const aspect = W / H
  const layers = Math.min(o.layers, MAX_LAYERS)
  const px = new Uint8Array(W * H * 3)

  for (let cx = 0; cx < W; cx++) {
    const x = ((cx + 0.5) / W) * aspect
    const xs = x / o.stretch
    const curtains: { y0: number; strength: number; light: Lab; reach: number }[] = []
    for (let i = 0; i < MAX_LAYERS; i++) {
      if (i >= layers) break
      const y0 =
        o.height -
        0.07 * i +
        o.waviness * 0.11 * snoise(xs * 0.8 + i * 3.1, t, i) +
        o.waviness * 0.04 * snoise(xs * 2.2, t * 1.6, i + 4)
      const fold = 0.55 + 0.45 * snoise(xs * 1.1 + i * 5, t * 0.8, i + 2)
      const hue = xs * 0.16 + t * 0.35 + i * 0.33 + 0.08 * snoise(xs * 0.7, t, i + 9)
      curtains.push({
        y0,
        strength: fold * Math.max(1 - 0.18 * i, 0.25),
        light: oklabToLinear(paletteLoop(palette, hue)),
        reach: o.spread * (0.75 + 0.3 * i)
      })
    }

    for (let cy = 0; cy < H; cy++) {
      const y = 1 - (cy + 0.5) / H
      const glow = [0, 0, 0]
      const ink = [...bg]
      for (const c of curtains) {
        const d = y - c.y0
        const a = (d > 0 ? Math.exp(-d / c.reach) : Math.exp(-d * d * 90)) * c.strength
        const mixAmt = clamp(a * o.intensity * 0.9, 0, 1)
        for (let k = 0; k < 3; k++) {
          glow[k] += c.light[k] * a
          ink[k] += (c.light[k] - ink[k]) * mixAmt
        }
      }
      const out = o.dark ? bg.map((v, k) => v + glow[k] * o.intensity * 0.7) : ink
      const at = (cy * W + cx) * 3
      for (let k = 0; k < 3; k++) px[at + k] = Math.round(linearToSrgb(out[k]) * 255)
    }
  }
  return px
}

export function rgbToBmpBase64(px: Uint8Array, width: number, height: number): string {
  const row = Math.ceil((width * 3) / 4) * 4
  const size = 54 + row * height
  const buf = new Uint8Array(size)
  const view = new DataView(buf.buffer)
  buf.set([0x42, 0x4d])
  view.setUint32(2, size, true)
  view.setUint32(10, 54, true)
  view.setUint32(14, 40, true)
  view.setInt32(18, width, true)
  view.setInt32(22, height, true)
  view.setUint16(26, 1, true)
  view.setUint16(28, 24, true)
  view.setUint32(34, row * height, true)
  for (let y = 0; y < height; y++) {
    const srcY = height - 1 - y
    for (let x = 0; x < width; x++) {
      const from = (srcY * width + x) * 3
      const to = 54 + y * row + x * 3
      buf[to] = px[from + 2]
      buf[to + 1] = px[from + 1]
      buf[to + 2] = px[from]
    }
  }
  let bin = ''
  for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]!)
  return btoa(bin)
}

/** Map shadcn.io/background/aurora query params to uibrik uniforms. */
export function shadcnDemoParams(input: {
  intensity?: number
  amplitude?: number
  scale?: number
  speed?: number
}) {
  const scale = input.scale ?? 0.55
  return {
    intensity: input.intensity ?? 2,
    waviness: (input.amplitude ?? 0.15) * 6,
    stretch: 1 / Math.max(0.25, scale),
    speed: input.speed ?? 0.25,
    height: 0.38,
    spread: 0.28,
    layers: 3
  }
}