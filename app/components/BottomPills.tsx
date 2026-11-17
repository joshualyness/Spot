import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Pressable, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const DOCK_PILL_HEIGHT = 56
export const DOCK_VERTICAL_PADDING = 8
export const AURORA_GAP_ABOVE_DOCK = 20

const PILL_W = 132

export function auroraBottomInset(safeBottom: number) {
  return DOCK_PILL_HEIGHT + DOCK_VERTICAL_PADDING + Math.max(safeBottom, 12) + AURORA_GAP_ABOVE_DOCK
}

/** Wide capsule dock actions — very dark fill, white centered icons. */
export function BottomPills() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const bottomPad = Math.max(insets.bottom, 12)

  return (
    <View style={[styles.dock, { paddingBottom: bottomPad }]}>
      <Pressable
        android_ripple={{ color: 'rgba(255,255,255,0.08)' }}
        style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
        onPress={() => router.push('/workout')}
        accessibilityRole="button"
        accessibilityLabel="Workout"
      >
        <MaterialCommunityIcons name="dumbbell" size={24} color="#FFFFFF" style={styles.icon} />
      </Pressable>

      <View style={styles.spacer} />

      <Pressable
        android_ripple={{ color: 'rgba(255,255,255,0.08)' }}
        style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
        onPress={() => router.push('/log')}
        accessibilityRole="button"
        accessibilityLabel="Log"
      >
        <Ionicons name="book-outline" size={24} color="#FFFFFF" style={styles.icon} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create(theme => ({
  dock: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: DOCK_VERTICAL_PADDING,
    zIndex: 3
  },
  spacer: {
    flex: 1
  },
  tile: {
    width: PILL_W,
    height: DOCK_PILL_HEIGHT,
    borderRadius: 999,
    backgroundColor: theme.colors.dockTile,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.dockTileBorder,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    textAlign: 'center'
  },
  tilePressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }]
  }
}))