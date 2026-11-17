import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View } from 'react-native'
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg'
import { colors } from '../theme/colors'

/** Soft upward aurora bloom sitting behind the score glyph / bottom pills. */
export function AuroraGlow() {
  return (
    <View pointerEvents="none" style={styles.wrap}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="aurora" cx="50%" cy="78%" rx="58%" ry="42%">
            <Stop offset="0%" stopColor={colors.glowLime} stopOpacity="0.95" />
            <Stop offset="28%" stopColor={colors.glowCyan} stopOpacity="0.55" />
            <Stop offset="58%" stopColor={colors.glowTeal} stopOpacity="0.28" />
            <Stop offset="100%" stopColor={colors.glowDeep} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#aurora)" />
      </Svg>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.35)', colors.black]}
        locations={[0, 0.55, 1]}
        style={styles.fade}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    top: '28%'
  },
  fade: {
    ...StyleSheet.absoluteFill
  }
})
