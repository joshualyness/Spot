import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { View, type LayoutChangeEvent } from 'react-native'
import type { SharedValue } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { StaticAuroraBackdrop } from './home/StaticAuroraBackdrop'
import { AURORA_GAP_ABOVE_DOCK, auroraBottomInset } from './BottomPills'
import { colors } from '../theme/colors'

type Props = {
  progress?: SharedValue<number>
  safeBottom?: number
}

const PANEL_RADIUS = 40

/** Static multi-peak aurora (no animation). */
export function AuroraGlow({ safeBottom = 0 }: Props) {
  const bottom = auroraBottomInset(safeBottom)
  const [size, setSize] = useState({ width: 0, height: 0 })

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout
    if (width > 0 && height > 0) setSize({ width, height })
  }

  return (
    <View pointerEvents="none" style={[styles.root, { bottom }]}>
      <View style={styles.shell} onLayout={onLayout}>
        <LinearGradient
          colors={['#080E1A', colors.black, colors.black]}
          locations={[0, 0.4, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        {size.width > 0 && (
          <View style={styles.glow}>
            <StaticAuroraBackdrop width={size.width} height={size.height} />
          </View>
        )}

        <LinearGradient
          pointerEvents="none"
          colors={['rgba(0,0,0,0.55)', 'transparent', 'transparent', 'rgba(0,0,0,0.22)']}
          locations={[0, 0.28, 0.62, 1]}
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
  glow: {
    ...StyleSheet.absoluteFillObject
  }
})