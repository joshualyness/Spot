import {
  DMSans_400Regular,
  DMSans_500Medium,
  useFonts as useDmSans
} from '@expo-google-fonts/dm-sans'
import {
  InstrumentSerif_400Regular,
  useFonts as useInstrumentSerif
} from '@expo-google-fonts/instrument-serif'
import { Stack } from 'expo-router'
import * as SystemUI from 'expo-system-ui'
import { useEffect } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import { AppProviders } from '../providers/AppProviders'
import { colors } from '../theme/colors'

export default function RootLayout() {
  const [dmLoaded] = useDmSans({
    DMSans_400Regular,
    DMSans_500Medium
  })
  const [serifLoaded] = useInstrumentSerif({
    InstrumentSerif_400Regular
  })

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.black)
  }, [])

  if (!dmLoaded || !serifLoaded) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.white} />
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <AppProviders>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.black },
            animation: 'fade'
          }}
        />
      </AppProviders>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.black
  },
  boot: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
