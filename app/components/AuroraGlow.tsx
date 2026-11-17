import { LinearGradient } from 'expo-linear-gradient'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg'
import { colors } from '../theme/colors'

/** Reference-aligned aurora: cool top wash, teal mid, lime bloom under the score. */
export function AuroraGlow() {
  return (
    <View pointerEvents="none" style={styles.root}>
      <LinearGradient
        colors={['#0A1628', colors.black, colors.black]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <Svg width="100%" height="100%" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <RadialGradient id="auroraCore" cx="50%" cy="72%" rx="70%" ry="48%">
            <Stop offset="0%" stopColor={colors.glowLime} stopOpacity="0.92" />
            <Stop offset="22%" stopColor={colors.glowCyan} stopOpacity="0.58" />
            <Stop offset="48%" stopColor={colors.glowTeal} stopOpacity="0.32" />
            <Stop offset="100%" stopColor={colors.glowDeep} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="auroraTop" cx="50%" cy="18%" rx="85%" ry="55%">
            <Stop offset="0%" stopColor="#1E5C78" stopOpacity="0.22" />
            <Stop offset="100%" stopColor={colors.black} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#auroraTop)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#auroraCore)" />
      </Svg>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.18)', 'rgba(0,0,0,0.55)', colors.black]}
        locations={[0, 0.42, 0.78, 1]}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject
  }
})