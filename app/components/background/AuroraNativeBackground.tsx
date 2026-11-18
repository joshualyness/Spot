import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useState } from 'react'
import { View, type LayoutChangeEvent } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg'
import { colors } from '../../theme/colors'

type Props = {
  drift?: number
  speed?: number
}

const LAYERS = [
  { dx: 0, dy: 0, scale: 1, opacity: 1, phase: 0 },
  { dx: -22, dy: 4, scale: 1.06, opacity: 0.72, phase: 0.9 },
  { dx: 26, dy: 2, scale: 1.04, opacity: 0.58, phase: 1.8 },
  { dx: -12, dy: -6, scale: 0.98, opacity: 0.46, phase: 2.6 }
] as const

const DURATION_MS = 14_000

/**
 * Cross-platform aurora (Reanimated + SVG). No WebGL — works without native rebuilds.
 */
export function AuroraNativeBackground({ drift = 0, speed = 0.25 }: Props) {
  const [layout, setLayout] = useState({ width: 0, height: 0 })
  const phase = useSharedValue(0)

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
        colors={['#0A1628', '#040608', colors.black]}
        locations={[0, 0.42, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      {layout.width > 0 &&
        LAYERS.map((layer, index) => (
          <AuroraWash
            key={index}
            layer={layer}
            layout={layout}
            phase={phase}
            drift={drift}
            index={index}
          />
        ))}
    </View>
  )
}

function AuroraWash({
  layer,
  layout,
  phase,
  drift,
  index
}: {
  layer: (typeof LAYERS)[number]
  layout: { width: number; height: number }
  phase: SharedValue<number>
  drift: number
  index: number
}) {
  const washStyle = useAnimatedStyle(() => {
    const t = phase.value * Math.PI * 2 + layer.phase
    return {
      opacity: layer.opacity,
      transform: [
        { translateX: layer.dx + drift * 14 + Math.sin(t) * 16 },
        { translateY: layer.dy + Math.cos(t * 0.85) * 10 },
        { scale: layer.scale + Math.sin(t * 0.6) * 0.025 }
      ]
    }
  })

  const coreId = `auroraCore${index}`
  const topId = `auroraTop${index}`

  return (
    <Animated.View style={[styles.wash, washStyle]}>
      <Svg width={layout.width} height={layout.height}>
        <Defs>
          <RadialGradient id={coreId} cx="50%" cy="100%" rx="82%" ry="58%" fy="100%">
            <Stop offset="0%" stopColor="#22e584" stopOpacity="0.95" />
            <Stop offset="26%" stopColor={colors.glowCyan} stopOpacity="0.64" />
            <Stop offset="52%" stopColor={colors.glowTeal} stopOpacity="0.36" />
            <Stop offset="100%" stopColor={colors.glowDeep} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id={topId} cx="50%" cy="14%" rx="90%" ry="60%">
            <Stop offset="0%" stopColor="#1E5C78" stopOpacity="0.28" />
            <Stop offset="100%" stopColor={colors.black} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width={layout.width} height={layout.height} fill={`url(#${topId})`} />
        <Rect width={layout.width} height={layout.height} fill={`url(#${coreId})`} />
      </Svg>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject
  },
  wash: {
    ...StyleSheet.absoluteFillObject
  }
})