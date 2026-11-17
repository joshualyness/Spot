import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Pressable, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const TILE = 64

/** Left / right dock tiles — dark grey, white centered icons. */
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
    paddingTop: 8,
    zIndex: 3
  },
  spacer: {
    flex: 1
  },
  tile: {
    width: TILE,
    height: TILE,
    borderRadius: 20,
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