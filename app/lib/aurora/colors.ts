const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function hexToRgb(hex: string): [number, number, number] {
  const raw = hex.trim().replace('#', '')
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map(c => c + c)
          .join('')
      : raw
  const n = Number.parseInt(full.slice(0, 6), 16)
  if (Number.isNaN(n)) return [1, 1, 1]
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

export function toOklch(rgb: [number, number, number]): [number, number, number] {
  const [r, g, b] = rgb.map(c => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)))
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const lab = [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  ]
  return [lab[0], Math.hypot(lab[1], lab[2]), Math.atan2(lab[2], lab[1])]
}

export function unwrapHues(stops: [number, number, number][]) {
  const known = stops.findIndex(stop => stop[1] > 0.02)
  const anchor = known === -1 ? 0 : stops[known][2]
  let previous = anchor
  return stops.map(stop => {
    let hue = stop[1] > 0.02 ? stop[2] : previous
    while (hue - previous > Math.PI) hue -= Math.PI * 2
    while (hue - previous < -Math.PI) hue += Math.PI * 2
    previous = hue
    return [stop[0], stop[1], hue] as [number, number, number]
  })
}

export function buildPalette(stops: string[], maxStops: number): Float32Array {
  const palette = new Float32Array(maxStops * 3)
  const parsed = stops.slice(0, maxStops).map(value => toOklch(hexToRgb(value)))
  unwrapHues(parsed).forEach((stop, index) => palette.set(stop, index * 3))
  return palette
}

export { clamp }