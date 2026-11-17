import { View, type LayoutChangeEvent } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, type SharedValue } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

type Props = {
  progress: SharedValue<number>
  children: React.ReactNode[]
}

export function InsightPager({ progress, children }: Props) {
  const width = useSharedValue(0)

  const onLayout = (e: LayoutChangeEvent) => {
    width.value = e.nativeEvent.layout.width
  }

  const rowStyle = useAnimatedStyle(() => {
    const w = width.value
    if (w <= 0) return {}
    return {
      width: w * children.length,
      transform: [{ translateX: -progress.value * w }]
    }
  })

  return (
    <View style={styles.viewport} onLayout={onLayout}>
      <Animated.View style={[styles.row, rowStyle]}>
        {children.map((child, index) => (
          <PageSlot key={index} index={index} progress={progress} width={width}>
            {child}
          </PageSlot>
        ))}
      </Animated.View>
    </View>
  )
}

function PageSlot({
  index,
  progress,
  width,
  children
}: {
  index: number
  progress: SharedValue<number>
  width: SharedValue<number>
  children: React.ReactNode
}) {
  const slotStyle = useAnimatedStyle(() => {
    const w = width.value
    if (w <= 0) return { width: 0 }
    return { width: w }
  })

  const layerStyle = useAnimatedStyle(() => {
    const delta = index - progress.value
    return {
      opacity: 0.42 + Math.max(0, 1 - Math.abs(delta) * 0.68) * 0.58,
      transform: [{ translateX: delta * 26 }, { scale: 1 - Math.min(0.07, Math.abs(delta) * 0.035) }]
    }
  })

  return (
    <Animated.View style={[styles.page, slotStyle]}>
      <Animated.View style={[styles.layer, layerStyle]}>{children}</Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  viewport: {
    flex: 1,
    overflow: 'hidden',
    zIndex: 1
  },
  row: {
    flexDirection: 'row',
    flex: 1
  },
  page: {
    flex: 1
  },
  layer: {
    flex: 1
  }
})