import { type LayoutChangeEvent, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { AuroraNativeBackground } from './AuroraNativeBackground'

export type ShadcnAuroraProps = {
  intensity?: number
  amplitude?: number
  scale?: number
  speed?: number
  colors?: string[]
  layers?: number
  height?: number
  rays?: number
  blend?: number
  drift?: number
  quality?: number
}

/**
 * Aurora backdrop. Uses Reanimated + SVG (always-on). WebGL (`expo-gl`) is not used by default
 * because it requires a native rebuild and often fails silently when the GLES 3.0 shader cannot link.
 */
export function ShadcnAurora({ drift = 0, speed = 0.25 }: ShadcnAuroraProps) {
  return (
    <View style={styles.host} onLayout={onLayoutNoop}>
      <AuroraNativeBackground drift={drift} speed={speed} />
    </View>
  )
}

function onLayoutNoop(_e: LayoutChangeEvent) {
  // Host only needs flex sizing; layers measure themselves.
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    minHeight: 120
  }
})