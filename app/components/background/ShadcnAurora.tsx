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

/** shadcn.io/background/aurora — uibrik curtain renderer (CPU port of first-frame.ts). */
export function ShadcnAurora({
  drift = 0,
  speed = 0.25,
  amplitude = 0.15,
  intensity = 2,
  scale = 0.55
}: ShadcnAuroraProps) {
  return (
    <View style={styles.host} onLayout={onLayoutNoop}>
      <AuroraNativeBackground
        drift={drift}
        speed={speed}
        amplitude={amplitude}
        intensity={intensity}
        scale={scale}
      />
    </View>
  )
}

function onLayoutNoop(_e: LayoutChangeEvent) {}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    minHeight: 120
  }
})