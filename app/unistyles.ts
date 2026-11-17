import { StyleSheet } from 'react-native-unistyles'
import { colors } from './theme/colors'

const darkTheme = {
  colors,
  fonts: {
    sans: 'DMSans_400Regular',
    sansMedium: 'DMSans_500Medium',
    serif: 'InstrumentSerif_400Regular'
  },
  gap: (v: number) => v * 8
} as const

const appThemes = {
  dark: darkTheme
}

const breakpoints = {
  xs: 0,
  sm: 360,
  md: 768,
  lg: 1024
} as const

type AppThemes = typeof appThemes
type AppBreakpoints = typeof breakpoints

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  themes: appThemes,
  breakpoints,
  settings: {
    initialTheme: 'dark',
    adaptiveThemes: false
  }
})
