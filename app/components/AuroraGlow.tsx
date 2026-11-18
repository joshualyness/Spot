import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useState } from 'react'
import { AccessibilityInfo, View, type LayoutChangeEvent } from 'react-native'
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
  type SharedValue
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { StaticAuroraBackdrop } from './home/StaticAuroraBackdrop'
import { TAB_PARALLAX_ORIGIN } from './InsightTabs'
import { AURORA_GAP_ABOVE_DOCK, auroraBottomInset } from './BottomPills'
import { colors } from '../theme/colors'

type Props = {
  progress?: SharedValue<number>
  safeBottom?: number
}

const PANEL_RADIUS = 40

/** Multi-peak aurora with slow transform drift (gradients stay static). */
export function AuroraGlow({ progress, safeBottom = 0 }: Props) {
  const bottom = auroraBottomInset(safeBottom)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [animate, setAnimate] = useState(true)

  const swayX = useSharedValue(0)
  const swayY = useSharedValue(0)
  const tabDrift = useSharedValue(0)

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(reduced =>
      setAnimate(!reduced)
    )
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', reduced =>
      setAnimate(!reduced)
    )
    return () => sub.remove()
  }, [])

  useFrameCallback(
    info => {
      'worklet'
      if (!animate) return
      const t = info.timeSinceFirstFrame
      swayX.value = Math.sin(t / 5200) * 9 + Math.sin(t / 8700) * 3
      swayY.value = Math.sin(t / 6800) * 4
    },
    animate
  )

  useAnimatedReaction(
    () => (progress ? progress.value - TAB_PARALLAX_ORIGIN : 0),
    value => {
      tabDrift.value = value * 8
    },
    [progress]
  )

  const glowMotion = useAnimatedStyle(() => ({
    transform: [
      { translateX: swayX.value + tabDrift.value },
      { translateY: swayY.value },
      { scale: 1 + Math.sin(swayX.value * 0.06) * 0.008 }
    ]
  }))

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout
    if (width > 0 && height > 0) setSize({ width, height })
  }

  return (
    <View pointerEvents="none" style={[styles.root, { bottom }]}>
      <View style={styles.shell} onLayout={onLayout}>
        <LinearGradient
          colors={['#05080E', 'transparent', 'transparent']}
          locations={[0, 0.22, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        {size.width > 0 && (
          <Animated.View style={[styles.glow, glowMotion]}>
            <StaticAuroraBackdrop width={size.width} height={size.height} />
          </Animated.View>
        )}

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