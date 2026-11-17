import { LinearGradient } from 'expo-linear-gradient'
import { View } from 'react-native'
import Animated, { type SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg'
import { colors } from '../theme/colors'

type Props = {
  progress?: SharedValue<number>
}

const BLUR_LAYERS = [
  { dx: 0, dy: 0, scale: 1, opacity: 0.92 },
  { dx: -28, dy: 18, scale: 1.08, opacity: 0.62 },
  { dx: 34, dy: -12, scale: 1.05, opacity: 0.52 },
  { dx: -16, dy: -22, scale: 0.97, opacity: 0.4 }
] as const

/** Soft radial “blur” washes, stacked for depth (reference-style). */
export function AuroraGlow({ progress }: Props) {
  const shellParallax = useAnimatedStyle(() => {
    if (!progress) return {}
    const delta = progress.value - 2
    return {
      transform: [{ translateX: delta * 12 }]
    }
  })

  return (
    <View pointerEvents="none" style={styles.root}>
      <Animated.View style={[styles.shell, shellParallax]}>
        <LinearGradient
          colors={['#0A1628', '#040608', colors.black]}
          locations={[0, 0.4, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        {BLUR_LAYERS.map((layer, index) => (
          <BlurWash key={index} index={index} layer={layer} progress={progress} />
        ))}

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.12)', 'rgba(0,0,0,0.5)', colors.black]}
          locations={[0, 0.38, 0.72, 1]}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
    </View>
  )
}

function BlurWash({
  index,
  layer,
  progress
}: {
  index: number
  layer: (typeof BLUR_LAYERS)[number]
  progress?: SharedValue<number>
}) {
  const washStyle = useAnimatedStyle(() => {
    const slide = progress ? (progress.value - 2) * (10 + index * 3) : 0
    return {
      opacity: layer.opacity,
      transform: [
        { translateX: layer.dx + slide },
        { translateY: layer.dy },
        { scale: layer.scale }
      ]
    }
  })

  const coreId = `auroraCore${index}`
  const topId = `auroraTop${index}`

  return (
    <Animated.View style={[styles.wash, washStyle]}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <RadialGradient id={coreId} cx="50%" cy="70%" rx="74%" ry="50%">
            <Stop offset="0%" stopColor={colors.glowLime} stopOpacity="0.95" />
            <Stop offset="24%" stopColor={colors.glowCyan} stopOpacity="0.62" />
            <Stop offset="50%" stopColor={colors.glowTeal} stopOpacity="0.34" />
            <Stop offset="100%" stopColor={colors.glowDeep} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id={topId} cx="50%" cy="16%" rx="88%" ry="58%">
            <Stop offset="0%" stopColor="#1E5C78" stopOpacity="0.26" />
            <Stop offset="100%" stopColor={colors.black} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${topId})`} />
        <Rect width="100%" height="100%" fill={`url(#${coreId})`} />
      </Svg>
    </Animated.View>
  )
}

const PANEL_RADIUS = 52

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0
  },
  shell: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderBottomLeftRadius: PANEL_RADIUS,
    borderBottomRightRadius: PANEL_RADIUS,
    overflow: 'hidden'
  },
  wash: {
    ...StyleSheet.absoluteFillObject
  }
})