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
      <AuroraGlow progress={progress} safeBottom={insets.bottom} />

      <InsightPager progress={progress}>{panes}</InsightPager>

      <View pointerEvents="box-none" style={[styles.tabsOverlay, { paddingTop: insets.top + 8 }]}>
        <InsightTabs active={activeTab} onChange={setActiveTab} progress={progress} />
      </View>

      <BottomPills />
    </View>
  )
}

const styles = StyleSheet.create(theme => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.black
  },
  tabsOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 2
  },
  overview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 88,
    paddingTop: 72
  }
}))