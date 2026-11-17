import { LinearGradient } from 'expo-linear-gradient'
import { View } from 'react-native'
import Animated, { type SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import Svg, { Defs, Ellipse, RadialGradient, Rect, Stop } from 'react-native-svg'
import { colors } from '../theme/colors'

type Props = {
  /** Animated tab index (0…n) for slow aura parallax. */
  progress?: SharedValue<number>
}

/** Rounded-bottom aurora shell with layered, color-rich blooms. */
export function AuroraGlow({ progress }: Props) {
  const parallaxStyle = useAnimatedStyle(() => {
    if (!progress) return {}
    const delta = progress.value - 2
    return {
      transform: [{ translateX: delta * 14 }, { translateY: Math.abs(delta) * 4 }]
    }
  })

  const skewStyle = useAnimatedStyle(() => {
    if (!progress) return {}
    const delta = progress.value - 2
    return {
      transform: [{ translateX: delta * -8 }, { scale: 1.02 + Math.abs(delta) * 0.015 }]
    }
  })

  return (
    <View pointerEvents="none" style={styles.root}>
      <LinearGradient
        colors={['#05060A', colors.black, colors.black]}
        locations={[0, 0.28, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <Animated.View style={[styles.bloomBack, skewStyle]}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFillObject}>
          <Defs>
            <RadialGradient id="deepBlue" cx="68%" cy="22%" rx="70%" ry="55%">
              <Stop offset="0%" stopColor="#3D7BFF" stopOpacity="0.7" />
              <Stop offset="55%" stopColor="#1A3F8F" stopOpacity="0.35" />
              <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="violet" cx="92%" cy="48%" rx="55%" ry="42%">
              <Stop offset="0%" stopColor="#A855FF" stopOpacity="0.42" />
              <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#deepBlue)" />
          <Rect width="100%" height="100%" fill="url(#violet)" />
        </Svg>
      </Animated.View>

      <Animated.View style={[styles.panel, parallaxStyle]}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFillObject}>
          <Defs>
            <RadialGradient id="bloomLime" cx="52%" cy="90%" rx="68%" ry="48%">
              <Stop offset="0%" stopColor="#F0FF6E" stopOpacity="0.98" />
              <Stop offset="32%" stopColor={colors.glowLime} stopOpacity="0.82" />
              <Stop offset="70%" stopColor="#6BCB2A" stopOpacity="0.28" />
              <Stop offset="100%" stopColor={colors.glowDeep} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="bloomCyan" cx="38%" cy="58%" rx="58%" ry="42%">
              <Stop offset="0%" stopColor="#72FFF0" stopOpacity="0.9" />
              <Stop offset="40%" stopColor={colors.glowCyan} stopOpacity="0.55" />
              <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="bloomTeal" cx="14%" cy="42%" rx="46%" ry="36%">
              <Stop offset="0%" stopColor="#22E4C8" stopOpacity="0.55" />
              <Stop offset="100%" stopColor={colors.glowTeal} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="bloomMint" cx="78%" cy="72%" rx="52%" ry="40%">
              <Stop offset="0%" stopColor="#B8FF4A" stopOpacity="0.5" />
              <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="bloomBlue" cx="74%" cy="36%" rx="50%" ry="38%">
              <Stop offset="0%" stopColor="#4D9BFF" stopOpacity="0.62" />
              <Stop offset="60%" stopColor="#144FA0" stopOpacity="0.24" />
              <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#bloomBlue)" />
          <Rect width="100%" height="100%" fill="url(#bloomTeal)" />
          <Rect width="100%" height="100%" fill="url(#bloomMint)" />
          <Rect width="100%" height="100%" fill="url(#bloomCyan)" />
          <Rect width="100%" height="100%" fill="url(#bloomLime)" />
          <Ellipse cx="80%" cy="68%" rx="138" ry="96" fill="rgba(120,255,130,0.22)" />
          <Ellipse cx="24%" cy="76%" rx="108" ry="78" fill="rgba(0,220,195,0.2)" />
          <Ellipse cx="56%" cy="48%" rx="88" ry="64" fill="rgba(45,226,197,0.14)" />
          <Ellipse cx="88%" cy="40%" rx="72" ry="52" fill="rgba(80,140,255,0.18)" />
        </Svg>

        <LinearGradient
          colors={[
            'rgba(0,0,0,0)',
            'rgba(0,0,0,0.06)',
            'rgba(0,0,0,0.38)',
            'rgba(0,0,0,0.72)',
            colors.black
          ]}
          locations={[0, 0.25, 0.52, 0.78, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        <LinearGradient
          colors={['rgba(5,8,14,0.15)', 'transparent', 'rgba(0,0,0,0.35)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

    </View>
  )
}

const PANEL_RADIUS = 56

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  bloomBack: {
    position: 'absolute',
    left: -8,
    right: -8,
    top: 0,
    height: '52%',
    overflow: 'hidden'
  },
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '14%',
    bottom: 96,
    borderBottomLeftRadius: PANEL_RADIUS,
    borderBottomRightRadius: PANEL_RADIUS,
    overflow: 'hidden',
    backgroundColor: '#080A10'
  }
})