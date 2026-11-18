import {
  BlurMask,
  Canvas,
  Group,
  LinearGradient,
  Rect,
  vec
} from '@shopify/react-native-skia'
import { useEffect, useMemo, useState } from 'react'
import {
  AURORA_COLS,
  columnGradientStops
} from '../../lib/aurora/curtainField'

type Props = {
  width: number
  height: number
  drift?: number
  animate?: boolean
}

export function SkiaAuroraField({
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
    <Canvas style={{ width, height }}>
      <Group layer opacity={0.95}>
        <BlurMask blur={28} style="normal" />
        {columns.map((col, i) => (
          <Rect key={`c-${i}`} x={col.x} y={0} width={col.w} height={height}>
            <LinearGradient
              start={vec(0, height)}
              end={vec(0, 0)}
              colors={col.curtain.colors}
              positions={col.curtain.positions}
            />
          </Rect>
        ))}
      </Group>

      <Group layer blendMode="plus" opacity={0.58}>
        <BlurMask blur={18} style="normal" />
        {columns.map((col, i) => (
          <Rect key={`g-${i}`} x={col.x} y={0} width={col.w} height={height}>
            <LinearGradient
              start={vec(0, height)}
              end={vec(0, 0)}
              colors={col.screen.colors}
              positions={col.screen.positions}
            />
          </Rect>
        ))}
      </Group>
    </Canvas>
  )
}