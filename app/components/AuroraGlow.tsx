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
import {
  auroraTextureHeight,
  AURORA_TEX_COLUMNS,
  StaticAuroraBackdrop
} from './home/StaticAuroraBackdrop'
import { TAB_PARALLAX_ORIGIN } from './InsightTabs'
import { AURORA_GAP_ABOVE_DOCK, auroraBottomInset } from './BottomPills'
import { colors } from '../theme/colors'

type Props = {
  progress?: SharedValue<number>
  safeBottom?: number
}

const PANEL_RADIUS = 40
/** Extra draw width so blur/glow is not clipped at the side edges. */
const AURORA_H_BLEED = 32

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
          colors={['rgba(8,14,26,0.85)', colors.black, colors.black]}
          locations={[0, 0.32, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        {size.width > 0 && (() => {
          const drawW = size.width + AURORA_H_BLEED * 2
          const texH = auroraTextureHeight(drawW, size.height)
          const scaleX = drawW / AURORA_TEX_COLUMNS
          const scaleY = size.height / texH
          return (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.glowClip,
                { width: drawW, height: size.height, left: -AURORA_H_BLEED }
              ]}
            >
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: AURORA_TEX_COLUMNS,
                  height: texH,
                  transformOrigin: 'top left',
                  transform: [{ scaleX }, { scaleY }]
                }}
              >
                <Animated.View style={[{ width: AURORA_TEX_COLUMNS, height: texH }, glowMotion]}>
                  <StaticAuroraBackdrop
                    width={AURORA_TEX_COLUMNS}
                    height={texH}
                  />
                </Animated.View>
              </View>
            </Animated.View>
          )
        })()}

        <LinearGradient
          pointerEvents="none"
          colors={['rgba(0,0,0,0.48)', 'transparent', 'transparent', 'rgba(0,0,0,0.06)']}
          locations={[0, 0.26, 0.68, 1]}
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
  glowClip: {
    position: 'absolute',
    top: 0,
    overflow: 'hidden'
  }
})