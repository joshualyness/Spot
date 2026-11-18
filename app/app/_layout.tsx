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
import * as SplashScreen from 'expo-splash-screen'
import * as SystemUI from 'expo-system-ui'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native-unistyles'
import { StatusBar } from 'expo-status-bar'
import { AppProviders } from '../providers/AppProviders'
import { colors } from '../theme/colors'

SplashScreen.preventAutoHideAsync().catch(() => {})

export default function RootLayout() {
  const [dmLoaded] = useDmSans({
    DMSans_400Regular,
    DMSans_500Medium
  })
  const [serifLoaded] = useInstrumentSerif({
    InstrumentSerif_400Regular
  })

  const ready = dmLoaded && serifLoaded

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.black)
  }, [])

  useEffect(() => {
    if (ready) {
      void SplashScreen.hideAsync()
    }
  }, [ready])

  if (!ready) {
    return null
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

const styles = StyleSheet.create(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.black
  }
}))
