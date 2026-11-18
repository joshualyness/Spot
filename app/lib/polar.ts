/** Polar layout helpers for ring UI (score dots, gauges). */

export type Point = { x: number; y: number }

export function pointOnCircle(
  center: Point,
  radius: number,
  index: number,
  count: number,
  startAngle = -Math.PI / 2
): Point {
  const angle = startAngle + (index / count) * Math.PI * 2
  return {
    x: center.x + radius * Math.cos(angle),
    y: center.y + radius * Math.sin(angle)
  }
}

/** Stable pseudo-random in [0, 1) from index (no extra deps). */
export function seededUnit(index: number, salt = 0): number {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}