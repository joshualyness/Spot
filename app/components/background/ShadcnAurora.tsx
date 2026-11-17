import { GLView, type ExpoWebGLRenderingContext } from 'expo-gl'
import { useEffect, useRef } from 'react'
import { type LayoutChangeEvent, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { AuroraEngine, type AuroraSettings } from '../../lib/aurora/engine'

/** Params from shadcn.io/background/aurora (Spot defaults). */
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

const DEFAULT_COLORS = ['#22e584', '#19d3c5', '#4f7dff', '#a05cff']

export function ShadcnAurora({
  intensity = 2,
  amplitude = 0.15,
  scale = 0.55,
  speed = 0.25,
  colors = DEFAULT_COLORS,
  layers = 2,
  height = 0.42,
  rays = 0.7,
  blend = 0.5,
  drift = 0,
  quality = 0.85
}: ShadcnAuroraProps) {
  const engineRef = useRef<AuroraEngine | null>(null)
  const layoutRef = useRef({ width: 0, height: 0 })

  const settings: AuroraSettings = {
    colors,
    intensity,
    amplitude,
    scale,
    speed,
    layers,
    height,
    rays,
    blend
  }

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height: h } = e.nativeEvent.layout
    layoutRef.current = { width, height: h }
    if (width > 0 && h > 0) engineRef.current?.resize(width, h)
  }

  const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
    try {
      const engine = new AuroraEngine(gl, settings, quality)
      engineRef.current = engine
      engine.setDrift(drift)
      const { width, height: h } = layoutRef.current
      if (width > 0 && h > 0) engine.resize(width, h)
      engine.start()
    } catch {
      // Shader unavailable on this device — parent shows a flat fallback tint.
    }
  }

  useEffect(() => {
    engineRef.current?.setSettings(settings)
  }, [colors, intensity, amplitude, scale, speed, layers, height, rays, blend])

  useEffect(() => {
    engineRef.current?.setDrift(drift)
  }, [drift])

  useEffect(() => () => engineRef.current?.stop(), [])

  return (
    <View style={styles.fill} onLayout={onLayout}>
      <GLView style={styles.fill} msaaSamples={0} onContextCreate={onContextCreate} />
    </View>
  )
}

const styles = StyleSheet.create({
  fill: {
    flex: 1
  }
})