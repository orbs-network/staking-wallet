const IS_DEV = process.env.IS_DEV;

// Limit browser support
const targets = IS_DEV ? { chrome: '79', firefox: '72', safari: '11.1', edge: '17' } : '> 0.25%, not dead';
// const targets = IS_DEV ? { chrome: '79', firefox: '72', safari: '11.1', edge: '17' } : { chrome: '79', firefox: '72', safari: '11.1', edge: '17' } ;

function transformImportMeta() {
  return {
    manipulateOptions(_, parserOpts) {
      parserOpts.plugins.push('importMeta');
    },
    visitor: {
      MetaProperty(path) {
        if (path.node.meta.name === 'import' && path.node.property.name === 'meta') {
          path.replaceWithSourceString('({})');
        }
      },
    },
  };
}

module.exports = {
  presets: [['@babel/env', { loose: true, targets }], '@babel/react', '@babel/typescript'],
  plugins: [
    '@babel/proposal-numeric-separator',
    '@babel/plugin-transform-logical-assignment-operators',
    '@babel/plugin-transform-export-namespace-from',
    transformImportMeta,
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
