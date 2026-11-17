import { Link } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AuroraGlow } from '../components/AuroraGlow'
import { colors } from '../theme/colors'

export default function LogScreen() {
  const insets = useSafeAreaInsets()

  return (
    <View style={styles.screen}>
      <AuroraGlow />
      <View style={[styles.content, { paddingTop: insets.top + 24 }]}>
        <Text style={styles.kicker}>Journal</Text>
        <Text style={styles.title}>Log</Text>
        <Text style={styles.body}>Notes, check-ins, and history will live here.</Text>

        <Link href="/" asChild>
          <Pressable style={styles.back}>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.black
  },
  content: {
    flex: 1,
    paddingHorizontal: 28
  },
  kicker: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: colors.muted,
    letterSpacing: 1.4,
    textTransform: 'uppercase'
  },
  title: {
    marginTop: 10,
    fontFamily: 'InstrumentSerif_400Regular',
    fontSize: 56,
    color: colors.white,
    letterSpacing: -1
  },
  body: {
    marginTop: 14,
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: colors.mutedStrong,
    maxWidth: 280
  },
  back: {
    marginTop: 36,
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: colors.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.pillBorder
  },
  backText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: colors.white
  }
})
