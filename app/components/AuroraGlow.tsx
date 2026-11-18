import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useState } from 'react'
import { AccessibilityInfo, Platform, View, type LayoutChangeEvent } from 'react-native'
import { runOnJS, type SharedValue, useAnimatedReaction } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg'
import { SkiaAuroraField } from './home/SkiaAuroraField'
import { TAB_PARALLAX_ORIGIN } from './InsightTabs'
import { AURORA_GAP_ABOVE_DOCK, auroraBottomInset } from './BottomPills'
import { colors } from '../theme/colors'

type Props = {
  progress?: SharedValue<number>
  safeBottom?: number
}

const PANEL_RADIUS = 40

function LegacyRadialGlow({
  width,
  height,
  drift
}: {
  width: number
  height: number
  drift: number
}) {
  return (
    <View style={[styles.glow, { transform: [{ translateX: drift * 10 }] }]}>
      <Svg width={width} height={height}>
        <Defs>
          <RadialGradient id="auroraCore" cx="50%" cy="100%" rx="78%" ry="56%">
            <Stop offset="0%" stopColor={colors.glowLime} stopOpacity="0.92" />
            <Stop offset="24%" stopColor={colors.glowCyan} stopOpacity="0.58" />
            <Stop offset="48%" stopColor={colors.glowTeal} stopOpacity="0.32" />
            <Stop offset="100%" stopColor={colors.glowDeep} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="auroraTop" cx="50%" cy="16%" rx="88%" ry="58%">
            <Stop offset="0%" stopColor="#1E5C78" stopOpacity="0.22" />
            <Stop offset="100%" stopColor={colors.black} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width={width} height={height} fill="url(#auroraTop)" />
        <Rect width={width} height={height} fill="url(#auroraCore)" />
      </Svg>
    </View>
  )
}

/** Five-layer curtain field (Skia) + additive glow pass; SVG radial on web. */
export function AuroraGlow({ progress, safeBottom = 0 }: Props) {
  const bottom = auroraBottomInset(safeBottom)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [drift, setDrift] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion)
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion)
    return () => sub.remove()
  }, [])

  useAnimatedReaction(
    () => (progress ? progress.value - TAB_PARALLAX_ORIGIN : 0),
    value => runOnJS(setDrift)(value),
    [progress]
  )

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout
    if (width > 0 && height > 0) setSize({ width, height })
  }

  const useSkia = Platform.OS !== 'web'

  return (
    <View pointerEvents="none" style={[styles.root, { bottom }]}>
      <View style={styles.shell} onLayout={onLayout}>
        <LinearGradient
          colors={['#0A1628', colors.black, colors.black]}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        {size.width > 0 &&
          (useSkia ? (
            <View style={[styles.glow, { transform: [{ translateX: drift * 8 }] }]}>
              <SkiaAuroraField
                width={size.width}
                height={size.height}
                drift={drift}
                animate={!reduceMotion}
              />
            </View>
          ) : (
            <LegacyRadialGlow width={size.width} height={size.height} drift={drift} />
          ))}

        <LinearGradient
          pointerEvents="none"
          colors={['transparent', 'rgba(0,0,0,0.18)', 'rgba(0,0,0,0.55)', colors.black]}
          locations={[0, 0.42, 0.78, 1]}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    </View>
  )
}

export { AURORA_GAP_ABOVE_DOCK }

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 0
  },
  shell: {
    flex: 1,
    borderBottomLeftRadius: PANEL_RADIUS,
    borderBottomRightRadius: PANEL_RADIUS,
    overflow: 'hidden',
    backgroundColor: colors.black
  },
  glow: {
    ...StyleSheet.absoluteFillObject
  }
})