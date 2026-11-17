import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Host, Button, HStack } from '@expo/ui/swift-ui'
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

export function BottomPills() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const bottomPad = Math.max(insets.bottom, 16)

  if (Platform.OS === 'ios') {
    return (
      <Host
        style={[styles.row, { paddingBottom: bottomPad }]}
        colorScheme="dark"
        matchContents
      >
        <HStack spacing={14}>
          <Button
            label="Workout"
            systemImage="dumbbell.fill"
            onPress={() => router.push('/workout')}
            modifiers={[
              buttonStyle('glass'),
              controlSize('extraLarge'),
              labelStyle('iconOnly'),
              buttonBorderShape('capsule')
            ]}
          />
          <Button
            label="Log"
            systemImage="book"
            onPress={() => router.push('/log')}
            modifiers={[
              buttonStyle('glass'),
              controlSize('extraLarge'),
              labelStyle('iconOnly'),
              buttonBorderShape('capsule')
            ]}
          />
        </HStack>
      </Host>
    )
  }

  return (
    <View style={[styles.row, { paddingBottom: bottomPad }]}>
      <Pressable
        style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
        onPress={() => router.push('/workout')}
        accessibilityRole="button"
        accessibilityLabel="Workout"
      >
        <MaterialCommunityIcons name="dumbbell" size={22} color="#FFFFFF" />
      </Pressable>
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
  row: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.gap(1.75),
    paddingHorizontal: 24
  },
  pill: {
    width: 92,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.pillBorder,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pillPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.97 }]
  }
}))
