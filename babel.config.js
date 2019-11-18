module.exports = {
  presets: [['@babel/env', { loose: true }], '@babel/react', '@babel/typescript'],
  plugins: [
    '@babel/proposal-numeric-separator',
    '@babel/plugin-transform-runtime',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/proposal-object-rest-spread',
    'babel-plugin-styled-components',
  ],
};
