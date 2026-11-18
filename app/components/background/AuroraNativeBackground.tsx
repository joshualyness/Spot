import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useState } from 'react'
import { Platform, View, type LayoutChangeEvent } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import Svg, {
  Defs,
  FeGaussianBlur,
  Filter,
  G,
  LinearGradient as SvgLinearGradient,
  Rect,
  Stop
} from 'react-native-svg'
import { colors } from '../../theme/colors'

type Props = {
  drift?: number
  speed?: number
  amplitude?: number
  intensity?: number
}

/** Borealis palette — matches shadcn aurora defaults. */
const BEAM_COLORS = ['#22e584', '#19d3c5', '#4f7dff', '#a05cff'] as const

const BEAMS = [
  { cx: 0.1, w: 0.17, c0: '#4f7dff', c1: '#a05cff', layer: 0, phase: 0.2 },
  { cx: 0.28, w: 0.22, c0: '#22e584', c1: '#19d3c5', layer: 0, phase: 1.1 },
  { cx: 0.5, w: 0.26, c0: '#22e584', c1: '#22d3ee', layer: 0, phase: 2.4 },
  { cx: 0.7, w: 0.2, c0: '#19d3c5', c1: '#4f7dff', layer: 1, phase: 0.7 },
  { cx: 0.86, w: 0.15, c0: '#a05cff', c1: '#6366f1', layer: 1, phase: 1.9 }
] as const

const DURATION_MS = 16_000
const BLUR_SIGMA = Platform.OS === 'ios' ? 42 : 28

/**
 * shadcn-style **curtain** aurora (vertical beams + heavy blur), no WebGL.
 * Mirrors intensity / amplitude / speed / scale tuning from the reference demo.
 */
export function AuroraNativeBackground({
  drift = 0,
  speed = 0.25,
  amplitude = 0.15,
  intensity = 2
}: Props) {
  const [layout, setLayout] = useState({ width: 0, height: 0 })
  const phase = useSharedValue(0)
  const brightness = Math.min(2, Math.max(0.6, intensity))

  useEffect(() => {
    const duration = DURATION_MS / Math.max(0.05, speed)
    phase.value = withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }), -1, true)
  }, [phase, speed])

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout
    if (width > 0 && height > 0) setLayout({ width, height })
  }

  return (
    <View style={styles.root} onLayout={onLayout}>
      <LinearGradient
        colors={['#020617', '#0b1224', colors.black]}
        locations={[0, 0.32, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      <LinearGradient
        colors={['rgba(30,58,95,0.35)', 'transparent']}
        locations={[0, 0.55]}
        style={styles.topWash}
      />
      {layout.width > 0 && (
        <CurtainField
          layout={layout}
          phase={phase}
          drift={drift}
          amplitude={amplitude}
          brightness={brightness}
        />
      )}
    </View>
  )
}

function CurtainField({
  layout,
  phase,
  drift,
  amplitude,
  brightness
}: {
  layout: { width: number; height: number }
  phase: SharedValue<number>
  drift: number
  amplitude: number
  brightness: number
}) {
  const { width, height } = layout
  const wave = width * amplitude * 0.55

  const layer0Style = useAnimatedStyle(() => {
    const t = phase.value * Math.PI * 2
    return {
      transform: [
        { translateX: drift * 18 + Math.sin(t) * wave * 0.35 },
        { translateY: Math.cos(t * 0.9) * wave * 0.08 }
      ]
    }
  })

  const layer1Style = useAnimatedStyle(() => {
    const t = phase.value * Math.PI * 2 + 0.8
    return {
      transform: [
        { translateX: drift * 12 + Math.sin(t * 1.1) * wave * 0.5 },
        { translateY: Math.cos(t * 0.7) * wave * 0.1 }
      ]
    }
  })

  const renderBeams = (layer: 0 | 1, opacity: number) =>
    BEAMS.filter(b => b.layer === layer).map((beam, index) => {
      const beamW = width * beam.w
      const x = width * beam.cx - beamW / 2
      const gradId = `beam-${layer}-${index}`
      const edgeId = `edge-${layer}-${index}`
      const h = height * 0.94
      const y = height - h

      return (
        <G key={gradId}>
          <Defs>
            <SvgLinearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
              <Stop offset="0%" stopColor={beam.c0} stopOpacity={0.98 * brightness * opacity} />
              <Stop offset="12%" stopColor={beam.c1} stopOpacity={0.85 * brightness * opacity} />
              <Stop offset="38%" stopColor={beam.c1} stopOpacity={0.42 * brightness * opacity} />
              <Stop offset="72%" stopColor={BEAM_COLORS[2]} stopOpacity={0.12 * brightness * opacity} />
              <Stop offset="100%" stopColor={colors.black} stopOpacity="0" />
            </SvgLinearGradient>
            <SvgLinearGradient id={edgeId} x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor={colors.black} stopOpacity="0" />
              <Stop offset="18%" stopColor={beam.c1} stopOpacity={0.55 * brightness * opacity} />
              <Stop offset="50%" stopColor={beam.c0} stopOpacity={0.95 * brightness * opacity} />
              <Stop offset="82%" stopColor={beam.c1} stopOpacity={0.55 * brightness * opacity} />
              <Stop offset="100%" stopColor={colors.black} stopOpacity="0" />
            </SvgLinearGradient>
          </Defs>
          <Rect x={x} y={y} width={beamW} height={h} fill={`url(#${gradId})`} />
          <Rect
            x={x}
            y={y}
            width={beamW}
            height={h}
            fill={`url(#${edgeId})`}
            opacity={0.72}
          />
        </G>
      )
    })

  return (
    <>
      <Animated.View style={[styles.svgLayer, layer0Style]}>
        <Svg width={width} height={height}>
          <Defs>
            <Filter id="blur0" x="-40%" y="-20%" width="180%" height="140%">
              <FeGaussianBlur stdDeviation={BLUR_SIGMA} />
            </Filter>
          </Defs>
          <G filter="url(#blur0)">{renderBeams(0, 1)}</G>
        </Svg>
      </Animated.View>
      <Animated.View style={[styles.svgLayer, layer1Style]}>
        <Svg width={width} height={height}>
          <Defs>
            <Filter id="blur1" x="-40%" y="-20%" width="180%" height="140%">
              <FeGaussianBlur stdDeviation={BLUR_SIGMA * 0.85} />
            </Filter>
          </Defs>
          <G filter="url(#blur1)">{renderBeams(1, 0.42)}</G>
        </Svg>
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject
  },
  topWash: {
    ...StyleSheet.absoluteFillObject
  },
  svgLayer: {
    ...StyleSheet.absoluteFillObject
  }
})