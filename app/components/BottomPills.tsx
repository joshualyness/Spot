import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Host, Button, HStack, Spacer } from '@expo/ui/swift-ui'
import {
  buttonBorderShape,
  buttonStyle,
  controlSize,
  labelStyle
} from '@expo/ui/swift-ui/modifiers'
import { useRouter } from 'expo-router'
import { Platform, Pressable, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

/** Left / right dock buttons — tab-bar alignment, but explicit navigation actions. */
export function BottomPills() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const bottomPad = Math.max(insets.bottom, 14)

  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.dock, { paddingBottom: bottomPad }]}>
        <Host style={styles.host} colorScheme="dark">
          <HStack spacing={0}>
            <Button
              label="Workout"
              systemImage="dumbbell.fill"
              onPress={() => router.push('/workout')}
              modifiers={[
                buttonStyle('glass'),
                controlSize('extraLarge'),
                labelStyle('iconOnly'),
                buttonBorderShape('roundedRectangle')
              ]}
            />
            <Spacer />
            <Button
              label="Log"
              systemImage="book"
              onPress={() => router.push('/log')}
              modifiers={[
                buttonStyle('glass'),
                controlSize('extraLarge'),
                labelStyle('iconOnly'),
                buttonBorderShape('roundedRectangle')
              ]}
            />
          </HStack>
        </Host>
      </View>
    )
  }

  return (
    <View style={[styles.dock, { paddingBottom: bottomPad }]}>
      <Pressable
        style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
        onPress={() => router.push('/workout')}
        accessibilityRole="button"
        accessibilityLabel="Workout"
      >
        <MaterialCommunityIcons name="dumbbell" size={22} color="#FFFFFF" />
      </Pressable>
      <View style={styles.spacer} />
      <Pressable
        style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
        onPress={() => router.push('/log')}
        accessibilityRole="button"
        accessibilityLabel="Log"
      >
        <Ionicons name="book-outline" size={21} color="#FFFFFF" />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create(theme => ({
  dock: {
    position: 'absolute',
    left: 22,
    right: 22,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 4
  },
  host: {
    flex: 1,
    minHeight: 60
  },
  spacer: {
    flex: 1
  },
  pill: {
    width: 92,
    height: 56,
    borderRadius: 18,
    backgroundColor: theme.colors.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.pillBorder,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 }
  },
  pillPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.97 }]
  }
}))