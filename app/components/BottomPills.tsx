import { Link } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '../theme/colors'

export function BottomPills() {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.row, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <Link href="/workout" asChild>
        <Pressable
          style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
          accessibilityRole="button"
          accessibilityLabel="Workout"
        >
          <MaterialCommunityIcons name="dumbbell" size={22} color={colors.white} />
        </Pressable>
      </Link>

      <Link href="/log" asChild>
        <Pressable
          style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
          accessibilityRole="button"
          accessibilityLabel="Log"
        >
          <Ionicons name="book-outline" size={21} color={colors.white} />
        </Pressable>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 24
  },
  pill: {
    width: 92,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.pillBorder,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 }
  },
  pillPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.97 }]
  }
})
