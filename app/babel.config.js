/** @type {import('react-native-unistyles/plugin').UnistylesPluginOptions} */
const unistylesPluginOptions = {
  // Must be a subfolder (not '.'). Screens outside this root still process when
  // they import StyleSheet from react-native-unistyles.
  root: 'components'
}

module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['react-native-unistyles/plugin', unistylesPluginOptions],
      'react-native-reanimated/plugin'
    ]
  }
}
