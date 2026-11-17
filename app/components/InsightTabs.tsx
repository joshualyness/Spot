import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { colors } from '../theme/colors'

const INSIGHTS = ['Overview', 'Strength', 'Recovery', 'Sleep', 'Nutrition', 'Mobility'] as const

type Props = {
  onChange?: (tab: (typeof INSIGHTS)[number]) => void
}

export function InsightTabs({ onChange }: Props) {
  const [active, setActive] = useState<(typeof INSIGHTS)[number]>('Overview')

  const select = (tab: (typeof INSIGHTS)[number]) => {
    setActive(tab)
    onChange?.(tab)
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {INSIGHTS.map(tab => {
        const isActive = tab === active
        return (
          <Pressable
            key={tab}
            onPress={() => select(tab)}
            style={styles.item}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab}</Text>
            <View style={styles.underlineTrack}>
              {isActive ? <View style={styles.underline} /> : null}
            </View>
          </Pressable>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0
  },
  row: {
    paddingHorizontal: 22,
    gap: 22,
    alignItems: 'flex-end'
  },
  item: {
    alignItems: 'center',
    paddingBottom: 2
  },
  label: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    letterSpacing: 0.2,
    color: colors.muted
  },
  labelActive: {
    color: colors.white,
    fontFamily: 'DMSans_500Medium'
  },
  underlineTrack: {
    marginTop: 8,
    height: 2,
    width: '100%',
    alignItems: 'center'
  },
  underline: {
    height: 1.5,
    width: '72%',
    borderRadius: 2,
    backgroundColor: colors.white
  }
})
