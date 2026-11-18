import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { runOnJS, type SharedValue, useAnimatedReaction } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { TAB_PARALLAX_ORIGIN } from './InsightTabs'
import { ShadcnAurora } from './background/ShadcnAurora'
import { AURORA_GAP_ABOVE_DOCK, auroraBottomInset } from './BottomPills'
import { colors } from '../theme/colors'

type Props = {
  progress?: SharedValue<number>
  safeBottom?: number
}

const PANEL_RADIUS = 40

/** Edge-to-edge aurora panel with rounded bottom above the dock. */
export function AuroraGlow({ progress, safeBottom = 0 }: Props) {
  const [drift, setDrift] = useState(0)
  const bottom = auroraBottomInset(safeBottom)

  useAnimatedReaction(
    () => (progress ? progress.value - TAB_PARALLAX_ORIGIN : 0),
    value => {
      runOnJS(setDrift)(value)
    },
    [progress]
  )

  useEffect(() => {
    if (!progress) setDrift(0)
  }, [progress])

  return (
    <View pointerEvents="none" style={[styles.root, { bottom }]}>
      <View style={styles.shell}>
        <ShadcnAurora
          intensity={2}
          amplitude={0.15}
          scale={0.55}
          speed={0.25}
          drift={drift}
        />
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.45)']}
          locations={[0, 0.78, 1]}
          style={styles.fadeBottom}
        />
      </View>
      <View pointerEvents="none" style={styles.edgeFade} />
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
  fadeBottom: {
    ...StyleSheet.absoluteFillObject
  },
  edgeFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: PANEL_RADIUS,
    borderBottomLeftRadius: PANEL_RADIUS,
    borderBottomRightRadius: PANEL_RADIUS
  }
})