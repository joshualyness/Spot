import { Text, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

type Props = {
  title: string
}

export function TabTitlePane({ title }: Props) {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create(theme => ({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 88,
    paddingTop: 72
  },
  title: {
    fontFamily: theme.fonts.serif,
    fontSize: 52,
    letterSpacing: -1,
    color: theme.colors.white
  }
}))