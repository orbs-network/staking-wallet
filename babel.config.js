const IS_DEV = process.env.NODE_ENV !== 'production';

// Limit browser support
const targets = IS_DEV ? { chrome: '79', firefox: '72' } : '> 0.25%, not dead';

module.exports = {
  presets: [['@babel/env', { loose: true, targets }], '@babel/react', '@babel/typescript'],
  plugins: [
    '@babel/proposal-numeric-separator',
    '@babel/plugin-transform-runtime',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/proposal-object-rest-spread',
    'babel-plugin-styled-components',
    [
      'transform-imports',
      {
        '@material-ui/core': {
          transform: '@material-ui/core/${member}',
          preventFullImport: true,
        },
        '@material-ui/core/colors': {
          transform: '@material-ui/core/colors/${member}',
          preventFullImport: true,
        },
      },
    ],
  ],
};
