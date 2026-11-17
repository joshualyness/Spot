import { LinearGradient } from 'expo-linear-gradient'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg'
import { colors } from '../../theme/colors'

const LAYERS = [
  { dx: 0, dy: 0, scale: 1, opacity: 1 },
  { dx: -22, dy: 14, scale: 1.06, opacity: 0.72 },
  { dx: 26, dy: -10, scale: 1.04, opacity: 0.58 },
  { dx: -12, dy: -18, scale: 0.98, opacity: 0.46 }
] as const

/** Visible radial-stack fallback when WebGL aurora is unavailable or still booting. */
export function AuroraSvgFallback() {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#0A1628', '#040608', colors.black]}
        locations={[0, 0.42, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      {LAYERS.map((layer, index) => (
        <View
          key={index}
          style={[
            styles.wash,
            {
              opacity: layer.opacity,
              transform: [
                { translateX: layer.dx },
                { translateY: layer.dy },
                { scale: layer.scale }
              ]
            }
          ]}
        >
          <Svg width="100%" height="100%" style={StyleSheet.absoluteFillObject}>
            <Defs>
              <RadialGradient id={`core${index}`} cx="50%" cy="68%" rx="76%" ry="52%">
                <Stop offset="0%" stopColor={colors.glowLime} stopOpacity="0.95" />
                <Stop offset="26%" stopColor={colors.glowCyan} stopOpacity="0.62" />
                <Stop offset="52%" stopColor={colors.glowTeal} stopOpacity="0.34" />
                <Stop offset="100%" stopColor={colors.glowDeep} stopOpacity="0" />
              </RadialGradient>
              <RadialGradient id={`top${index}`} cx="50%" cy="14%" rx="90%" ry="60%">
                <Stop offset="0%" stopColor="#1E5C78" stopOpacity="0.28" />
                <Stop offset="100%" stopColor={colors.black} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Rect width="100%" height="100%" fill={`url(#top${index})`} />
            <Rect width="100%" height="100%" fill={`url(#core${index})`} />
          </Svg>
        </View>
      ))}
    </View>
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