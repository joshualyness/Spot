import { useState } from 'react'
import { View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AuroraGlow } from '../components/AuroraGlow'
import { BottomPills } from '../components/BottomPills'
import { FitnessScoreGlyph } from '../components/FitnessScoreGlyph'
import { INSIGHTS, InsightTabs, type InsightTab } from '../components/InsightTabs'
import { InsightPager } from '../components/home/InsightPager'
import { TabTitlePane } from '../components/home/TabTitlePane'

export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  const [activeTab, setActiveTab] = useState<InsightTab>('Overview')
  const progress = useSharedValue(INSIGHTS.indexOf('Overview'))
  const panes = INSIGHTS.map(tab =>
    tab === 'Overview' ? (
      <View key={tab} style={styles.overview}>
        <FitnessScoreGlyph score={82} label="Fitness score" />
      </View>
    ) : (
      <TabTitlePane key={tab} title={tab} />
    )
  )

  return (
    <View style={styles.screen}>
      <AuroraGlow progress={progress} />

      <View style={[styles.top, { paddingTop: insets.top + 18 }]}>
        <InsightTabs active={activeTab} onChange={setActiveTab} progress={progress} />
      </View>

      <InsightPager progress={progress}>{panes}</InsightPager>

      <BottomPills />
    </View>
  )
}

const styles = StyleSheet.create(theme => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.black
  },
  top: {
    zIndex: 2
  },
  overview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 88
  }
}))