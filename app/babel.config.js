module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'react-native-unistyles/plugin',
        {
          // App package root: screens live in ./app, shared UI in ./components, etc.
          root: '.'
        }
      ]
    ]
  }
}
