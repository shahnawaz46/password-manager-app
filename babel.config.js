module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // for import @ instead of ./src (Ex: @/component). It should be same as mention in tsconfig.json
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src',
        },
      },
    ],

    'react-native-worklets/plugin',
  ],
};
