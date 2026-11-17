import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AuroraGlow } from '../components/AuroraGlow'
import { BottomPills } from '../components/BottomPills'
import { FitnessScoreGlyph } from '../components/FitnessScoreGlyph'
import { InsightTabs } from '../components/InsightTabs'
import { colors } from '../theme/colors'

export default function HomeScreen() {
  const insets = useSafeAreaInsets()

  return (
    <View style={styles.screen}>
      <AuroraGlow />

      <View style={[styles.top, { paddingTop: insets.top + 18 }]}>
        <InsightTabs />
      </View>

      <View style={styles.center}>
        <FitnessScoreGlyph score={82} label="Fitness score" />
      </View>

      <BottomPills />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.black
  },
  top: {
    zIndex: 2
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 72
  }
})
