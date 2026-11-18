import { useEffect, useMemo, useState } from 'react'
import Svg, {
  Defs,
  FeGaussianBlur,
  Filter,
  G,
  LinearGradient,
  Rect,
  Stop
} from 'react-native-svg'
import {
  AURORA_COLS,
  columnGradientStops,
  type AuroraGradientStop
} from '../../lib/aurora/curtainField'

type Props = {
  width: number
  height: number
  drift?: number
  animate?: boolean
}

function gradientId(pass: string, index: number) {
  return `aurora-${pass}-${index}`
}

/** CPU curtain field — blurred column stacks (works without Skia native). */
export function SvgAuroraField({
  width,
  height,
  drift = 0,
  animate = true
}: Props) {
  const aspect = height > 0 ? width / height : 1
  const [time, setTime] = useState(0)

  useEffect(() => {
    if (!animate) {
      setTime(0)
      return
    }
    let raf = 0
    const loop = (ts: number) => {
      setTime(ts / 1000)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [animate])

  const columns = useMemo(() => {
    const t = time + drift * 0.22
    const colW = width / AURORA_COLS
    return Array.from({ length: AURORA_COLS }, (_, index) => {
      const xNorm = (index + 0.5) / AURORA_COLS + drift * 0.035
      return {
        x: index * colW,
        w: colW + 1.5,
        curtain: columnGradientStops(xNorm, t, aspect, 'curtain'),
        screen: columnGradientStops(xNorm, t, aspect, 'screen')
      }
    })
  }, [time, drift, aspect, width])

  if (width <= 0 || height <= 0) return null

  return (
    <Svg width={width} height={height}>
      <Defs>
        <Filter id="auroraBlur" x="-30%" y="-30%" width="160%" height="160%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation="14" />
        </Filter>
        <Filter id="auroraGlowBlur" x="-30%" y="-30%" width="160%" height="160%">
          <FeGaussianBlur in="SourceGraphic" stdDeviation="9" />
        </Filter>
        {columns.map((col, index) => (
          <LinearGradient
            key={`def-c-${index}`}
            id={gradientId('c', index)}
            x1="0"
            y1={height}
            x2="0"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            {col.curtain.map((stop, i) => (
              <Stop
                key={i}
                offset={`${(stop.offset * 100).toFixed(2)}%`}
                stopColor={stop.color}
                stopOpacity={stop.opacity}
              />
            ))}
          </LinearGradient>
        ))}
        {columns.map((col, index) => (
          <LinearGradient
            key={`def-g-${index}`}
            id={gradientId('g', index)}
            x1="0"
            y1={height}
            x2="0"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            {col.screen.map((stop, i) => (
              <Stop
                key={i}
                offset={`${(stop.offset * 100).toFixed(2)}%`}
                stopColor={stop.color}
                stopOpacity={stop.opacity}
              />
            ))}
          </LinearGradient>
        ))}
      </Defs>

      <G filter="url(#auroraBlur)" opacity={0.95}>
        {columns.map((col, index) => (
          <Rect
            key={`r-c-${index}`}
            x={col.x}
            y={0}
            width={col.w}
            height={height}
            fill={`url(#${gradientId('c', index)})`}
          />
        ))}
      </G>

      <G filter="url(#auroraGlowBlur)" opacity={0.72}>
        {columns.map((col, index) => (
          <Rect
            key={`r-g-${index}`}
            x={col.x}
            y={0}
            width={col.w}
            height={height}
            fill={`url(#${gradientId('g', index)})`}
          />
        ))}
      </G>
    </Svg>
  )
}