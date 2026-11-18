import {
  BlurMask,
  Canvas,
  Group,
  LinearGradient,
  Rect,
  vec,
  useClock
} from '@shopify/react-native-skia'
import { useMemo } from 'react'
import { useDerivedValue, type SharedValue } from 'react-native-reanimated'
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

function AuroraColumn({
  index,
  width,
  height,
  aspect,
  clock,
  drift,
  animate,
  pass
}: {
  index: number
  width: number
  height: number
  aspect: number
  clock: SharedValue<number>
  drift: number
  animate: boolean
  pass: 'curtain' | 'screen'
}) {
  const colW = width / AURORA_COLS
  const x = index * colW

  const colors = useDerivedValue(() => {
    const t = (animate ? clock.value / 1000 : 0) + drift * 0.22
    const xNorm = (index + 0.5) / AURORA_COLS + drift * 0.035
    return columnGradientStops(xNorm, t, aspect, pass).colors
  })

  const positions = useDerivedValue(() => {
    const t = (animate ? clock.value / 1000 : 0) + drift * 0.22
    const xNorm = (index + 0.5) / AURORA_COLS + drift * 0.035
    return columnGradientStops(xNorm, t, aspect, pass).positions
  })

  return (
    <Rect x={x} y={0} width={colW + 1.5} height={height}>
      <LinearGradient
        start={vec(0, height)}
        end={vec(0, 0)}
        colors={colors}
        positions={positions}
      />
    </Rect>
  )
}

export function SkiaAuroraField({
  width,
  height,
  drift = 0,
  animate = true
}: Props) {
  const clock = useClock()
  const aspect = height > 0 ? width / height : 1
  const columns = useMemo(
    () => Array.from({ length: AURORA_COLS }, (_, i) => i),
    []
  )

  if (width <= 0 || height <= 0) return null

  return (
    <Canvas style={{ width, height }}>
      <Group
        layer
        opacity={0.92}
      >
        <BlurMask blur={32} style="normal" />
        {columns.map(i => (
          <AuroraColumn
            key={`c-${i}`}
            index={i}
            width={width}
            height={height}
            aspect={aspect}
            clock={clock}
            drift={drift}
            animate={animate}
            pass="curtain"
          />
        ))}
      </Group>

      <Group layer blendMode="plus" opacity={0.62}>
        <BlurMask blur={22} style="normal" />
        {columns.map(i => (
          <AuroraColumn
            key={`g-${i}`}
            index={i}
            width={width}
            height={height}
            aspect={aspect}
            clock={clock}
            drift={drift}
            animate={animate}
            pass="screen"
          />
        ))}
      </Group>
    </Canvas>
  )
}