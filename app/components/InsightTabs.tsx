import { useCallback, useEffect, useRef } from 'react'
import { LayoutChangeEvent, Pressable, ScrollView, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  type SharedValue
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

export const INSIGHTS = ['Data', 'Sales', 'Overview', 'Support', 'Operations'] as const
export type InsightTab = (typeof INSIGHTS)[number]

type TabLayout = { x: number; width: number }

type Props = {
  active: InsightTab
  onChange: (tab: InsightTab) => void
  progress: SharedValue<number>
}

const PARALLAX_DELAY_MS = 70

export function InsightTabs({ active, onChange, progress }: Props) {
  const layouts = useRef<Partial<Record<InsightTab, TabLayout>>>({})
  const underlineX = useSharedValue(0)
  const underlineW = useSharedValue(52)
  const drift = useSharedValue(INSIGHTS.indexOf(active))

  const syncUnderline = useCallback(
    (tab: InsightTab) => {
      const layout = layouts.current[tab]
      const index = INSIGHTS.indexOf(tab)
      progress.value = withTiming(index, {
        duration: 480,
        easing: Easing.out(Easing.cubic)
      })
      drift.value = withDelay(
        PARALLAX_DELAY_MS / 2,
        withTiming(index, { duration: 480, easing: Easing.out(Easing.cubic) })
      )
      if (!layout) return
      underlineW.value = withDelay(
        PARALLAX_DELAY_MS,
        withSpring(layout.width * 0.72, { damping: 19, stiffness: 210 })
      )
      underlineX.value = withDelay(
        PARALLAX_DELAY_MS,
        withSpring(layout.x + layout.width * 0.14, { damping: 19, stiffness: 210 })
      )
    },
    [drift, progress, underlineW, underlineX]
  )

  useEffect(() => {
    syncUnderline(active)
  }, [active, syncUnderline])

  const select = (tab: InsightTab) => {
    if (tab === active) return
    onChange(tab)
    syncUnderline(tab)
  }

  const onTabLayout = (tab: InsightTab) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout
    layouts.current[tab] = { x, width }
    if (tab === active) {
      underlineX.value = x + width * 0.14
      underlineW.value = width * 0.72
      drift.value = INSIGHTS.indexOf(tab)
    }
  }

  const underlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: underlineX.value }],
    width: underlineW.value
  }))

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        style={styles.scroll}
      >
        {INSIGHTS.map((tab, index) => {
          const isActive = tab === active
          return (
            <TabLabel
              key={tab}
              tab={tab}
              index={index}
              isActive={isActive}
              drift={drift}
              onPress={() => select(tab)}
              onLayout={onTabLayout(tab)}
            />
          )
        })}
      </ScrollView>
      <Animated.View style={[styles.underline, underlineStyle]} />
    </View>
  )
}

function TabLabel({
  tab,
  index,
  isActive,
  drift,
  onPress,
  onLayout
}: {
  tab: InsightTab
  index: number
  isActive: boolean
  drift: SharedValue<number>
  onPress: () => void
  onLayout: (e: LayoutChangeEvent) => void
}) {
  const labelStyle = useAnimatedStyle(() => {
    const delta = index - drift.value
    const parallax = delta * 14
    const opacity = 0.38 + Math.max(0, 1 - Math.abs(delta) * 0.55) * 0.62
    return {
      opacity,
      transform: [{ translateX: parallax }]
    }
  })

  return (
    <Pressable
      onPress={onPress}
      onLayout={onLayout}
      style={styles.item}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
    >
      <Animated.Text style={[styles.label, isActive && styles.labelActive, labelStyle]}>
        {tab}
      </Animated.Text>
    </Pressable>
  )
}

const styles = StyleSheet.create(theme => ({
  wrap: {
    paddingBottom: 10
  },
  scroll: {
    flexGrow: 0
  },
  row: {
    paddingHorizontal: 22,
    gap: 24,
    alignItems: 'flex-end',
    paddingBottom: 6
  },
  item: {
    alignItems: 'center',
    paddingBottom: 2
  },
  label: {
    fontFamily: theme.fonts.sans,
    fontSize: 15,
    letterSpacing: 0.2,
    color: theme.colors.muted
  },
  labelActive: {
    color: theme.colors.white,
    fontFamily: theme.fonts.sansMedium
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 1.5,
    borderRadius: 2,
    backgroundColor: theme.colors.white
  }
}))