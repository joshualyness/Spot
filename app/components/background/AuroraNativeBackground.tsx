import { Image } from 'expo-image'
import { useEffect, useRef, useState } from 'react'
import { View, type LayoutChangeEvent } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import {
  rgbToBmpBase64,
  renderUibrikAuroraFrame,
  shadcnDemoParams,
  type UibrikAuroraOptions
} from '../../lib/aurora/uibrikCpu'

const BOREALIS = ['#22e584', '#19d3c5', '#4f7dff', '#a05cff']

type Props = {
  drift?: number
  speed?: number
  amplitude?: number
  intensity?: number
  scale?: number
}

/**
 * Faithful shadcn/uibrik aurora via the same CPU path as `first-frame.ts`
 * (identical curtain + noise math to the WebGL shader).
 */
export function AuroraNativeBackground({
  drift = 0,
  speed = 0.25,
  amplitude = 0.15,
  intensity = 2,
  scale = 0.55
}: Props) {
  const [layout, setLayout] = useState({ width: 0, height: 0 })
  const [uri, setUri] = useState<string | null>(null)
  const clock = useRef(0)
  const raf = useRef(0)
  const params = shadcnDemoParams({ intensity, amplitude, scale, speed })

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout
    if (width > 0 && height > 0) setLayout({ width, height })
  }

  useEffect(() => {
    if (layout.width === 0) return

    const renderW = Math.min(420, Math.max(120, Math.round(layout.width)))
    const renderH = Math.max(80, Math.round((layout.height / layout.width) * renderW))

    let alive = true
    let last = 0
    const frame = (now: number) => {
      if (!alive) return
      if (now - last >= 50) {
        last = now
        clock.current += 0.05
        const options: UibrikAuroraOptions = {
          colors: BOREALIS,
          base: '#000000',
          dark: true,
          intensity: params.intensity,
          height: params.height - drift * 0.015,
          spread: params.spread,
          layers: params.layers,
          waviness: params.waviness,
          stretch: params.stretch,
          seed: drift * 0.3,
          time: clock.current,
          width: renderW,
          pixelHeight: renderH
        }
        const rgb = renderUibrikAuroraFrame(options)
        const base64 = rgbToBmpBase64(rgb, renderW, renderH)
        setUri(`data:image/bmp;base64,${base64}`)
      }
      raf.current = requestAnimationFrame(frame)
    }
    raf.current = requestAnimationFrame(frame)
    return () => {
      alive = false
      cancelAnimationFrame(raf.current)
    }
  }, [layout, drift, params, speed, amplitude, intensity, scale])

  return (
    <View style={styles.root} onLayout={onLayout}>
      {uri ? <Image source={{ uri }} style={styles.image} contentFit="fill" transition={0} /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000'
  },
  image: {
    ...StyleSheet.absoluteFillObject
  }
})