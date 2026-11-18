import { Host, Button, Text, VStack } from '@expo/ui/swift-ui'
import { buttonStyle, controlSize, foregroundStyle } from '@expo/ui/swift-ui/modifiers'
import { useRouter } from 'expo-router'
import { Platform, Pressable, Text as RNText, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AuroraGlow } from '../components/AuroraGlow'

export default function WorkoutScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  return (
    <View style={styles.screen}>
      <AuroraGlow />
      <View style={[styles.content, { paddingTop: insets.top + 24 }]}>
        {Platform.OS === 'ios' ? (
          <Host style={styles.host} colorScheme="dark" matchContents>
            <VStack spacing={14} alignment="leading">
              <Text modifiers={[foregroundStyle('#FFFFFF61')]}>SESSION</Text>
              <RNText style={styles.title}>Workout</RNText>
              <Text modifiers={[foregroundStyle('#FFFFFF9E')]}>
                Your training flow will live here.
              </Text>
              <Button
                label="Back"
                onPress={() => router.back()}
                modifiers={[buttonStyle('glass'), controlSize('large')]}
              />
            </VStack>
          </Host>
        ) : (
          <>
            <RNText style={styles.kicker}>Session</RNText>
            <RNText style={styles.title}>Workout</RNText>
            <RNText style={styles.body}>Your training flow will live here.</RNText>
            <Pressable style={styles.back} onPress={() => router.back()}>
              <RNText style={styles.backText}>Back</RNText>
            </Pressable>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create(theme => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.black
  },
  content: {
    flex: 1,
    paddingHorizontal: 28
  },
  host: {
    alignSelf: 'stretch'
  },
  kicker: {
    fontFamily: theme.fonts.sans,
    fontSize: 13,
    color: theme.colors.muted,
    letterSpacing: 1.4,
    textTransform: 'uppercase'
  },
  title: {
    marginTop: 10,
    fontFamily: theme.fonts.serif,
    fontSize: 56,
    color: theme.colors.white,
    letterSpacing: -1
  },
  body: {
    marginTop: 14,
    fontFamily: theme.fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.mutedStrong,
    maxWidth: 280
  },
  back: {
    marginTop: 36,
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: theme.colors.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.pillBorder
  },
  backText: {
    fontFamily: theme.fonts.sansMedium,
    fontSize: 14,
    color: theme.colors.white
  }
}))
