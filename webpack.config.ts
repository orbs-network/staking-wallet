import webpack from 'webpack';
import path from 'path';
import dotenv from 'dotenv';
import { Configuration } from 'webpack';
import cssnano from 'cssnano';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
const CopyWebpackPlugin = require('copy-webpack-plugin');
import { createEnvObjectForWebpack } from './webpackUtils';
const envFilePath = process.env.ENV_FILE || '.env';
const envFromFile = dotenv.config({ path: envFilePath }).parsed;
const envFromPathMergedWithRuntime = { ...envFromFile, ...process.env };

function normalizePublicBasePath(basePath?: string) {
  const fallbackBasePath = basePath || '/';
  return fallbackBasePath.endsWith('/') ? fallbackBasePath : `${fallbackBasePath}/`;
}

const publicBasePath = normalizePublicBasePath(envFromPathMergedWithRuntime.PUBLIC_BASE_PATH);
const plugins = [
  new ForkTsCheckerWebpackPlugin({
    tsconfig: path.join(__dirname, 'src', 'tsconfig.json'),
  }),
  // Adds the index.html to the dist
  new HtmlWebpackPlugin({
    title: 'ORBS Staking Wallet',
    template: 'index.html',
    publicBasePath,
  }),
  new CopyWebpackPlugin([
    {
      from: './404.html',
    },
  ]),
  new CopyWebpackPlugin([
    {
      from: './CNAME',
    },
  ]),
  new CopyWebpackPlugin([
    {
      from: './manifest.webmanifest',
    },
    {
      from: './sw.js',
    },
    {
      from: './pwa-icon-192.png',
    },
    {
      from: './pwa-icon-512.png',
    },
  ]),
  // Adds the favicons to the dist
  // DEV_NOTE : this plugin replaces the usage of 'process.env.X' with the actual values of the key.
  new webpack.DefinePlugin(createEnvObjectForWebpack(envFromPathMergedWithRuntime)),

  // DEV_NOTE : Ignore all locale files of moment.js (will include required ones manually)
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  new webpack.NormalModuleReplacementPlugin(/^@reown\/appkit-ui\/(.+)$/, (resource: any) => {
    const exportName = resource.request.replace('@reown/appkit-ui/', '');
    resource.request = path.resolve(__dirname, 'node_modules', '@reown/appkit-ui/dist/esm/exports', `${exportName}.js`);
  }),
  new webpack.NormalModuleReplacementPlugin(/^@reown\/appkit-scaffold-ui\/(.+)$/, (resource: any) => {
    const exportName = resource.request.replace('@reown/appkit-scaffold-ui/', '');
    resource.request = path.resolve(
      __dirname,
      'node_modules',
      '@reown/appkit-scaffold-ui/dist/esm/exports',
      `${exportName}.js`,
    );
  }),
  new webpack.NormalModuleReplacementPlugin(/^@phosphor-icons\/webcomponents\/(.+)$/, (resource: any) => {
    const exportName = resource.request.replace('@phosphor-icons/webcomponents/', '');
    resource.request = path.resolve(
      __dirname,
      'node_modules',
      '@phosphor-icons/webcomponents/dist/icons',
      `${exportName}.mjs`,
    );
  }),
  new webpack.NormalModuleReplacementPlugin(/^@noble\/curves\/(.+)$/, (resource: any) => {
    const exportName = resource.request.replace('@noble/curves/', '');
    const fileName = exportName.endsWith('.js') ? exportName : `${exportName}.js`;
    resource.request = path.resolve(__dirname, 'node_modules', '@noble/curves/esm', fileName);
  }),
];

// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
// plugins.push(new BundleAnalyzerPlugin());

const IS_DEV = process.env.IS_DEV;

const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const transpiledNodeModules = [
  path.resolve(nodeModulesPath, '@reown'),
  path.resolve(nodeModulesPath, '@walletconnect'),
  path.resolve(nodeModulesPath, '@coinbase'),
  path.resolve(nodeModulesPath, '@msgpack'),
  path.resolve(nodeModulesPath, '@noble'),
  path.resolve(nodeModulesPath, '@phosphor-icons'),
  path.resolve(nodeModulesPath, '@scure'),
  path.resolve(nodeModulesPath, '@safe-global'),
  path.resolve(nodeModulesPath, 'abitype'),
  path.resolve(nodeModulesPath, '@lit'),
  path.resolve(nodeModulesPath, 'lit'),
  path.resolve(nodeModulesPath, 'lit-html'),
  path.resolve(nodeModulesPath, 'ox'),
  path.resolve(nodeModulesPath, 'proxy-compare'),
  path.resolve(nodeModulesPath, 'viem'),
  path.resolve(nodeModulesPath, 'zustand'),
  path.resolve(nodeModulesPath, 'zod'),
];
const transpiledNestedNodeModulesPattern = /[\\/]node_modules[\\/](?:@coinbase|@lit|@msgpack|@noble|@phosphor-icons|@reown|@safe-global|@scure|@walletconnect|abitype|lit|lit-html|ox|proxy-compare|valtio|viem|zustand|zod)[\\/]/;

const config: Configuration = {
  mode: IS_DEV ? 'development' : 'production',
  target: 'web',
  devtool: IS_DEV ? 'inline-source-map' : false,
  entry: ['core-js', './src/client'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: `[name]-[hash:8]-bundle.js`,
    publicPath: publicBasePath,
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.tsx'],
    alias: {
      '@reown/appkit-utils/ethers$': path.resolve(nodeModulesPath, '@reown/appkit-utils/dist/esm/exports/ethers.js'),
      '@reown/appkit-wallet/utils$': path.resolve(nodeModulesPath, '@reown/appkit-wallet/dist/esm/exports/utils.js'),
      '@reown/appkit-controllers/features$': path.resolve(
        nodeModulesPath,
        '@reown/appkit-controllers/dist/esm/exports/features.js',
      ),
      '@reown/appkit-controllers/utils$': path.resolve(
        nodeModulesPath,
        '@reown/appkit-controllers/dist/esm/exports/utils.js',
      ),
      '@reown/appkit-scaffold-ui/email$': path.resolve(
        nodeModulesPath,
        '@reown/appkit-scaffold-ui/dist/esm/exports/email.js',
      ),
      '@reown/appkit-scaffold-ui/embedded-wallet$': path.resolve(
        nodeModulesPath,
        '@reown/appkit-scaffold-ui/dist/esm/exports/embedded-wallet.js',
      ),
      '@reown/appkit-scaffold-ui/onramp$': path.resolve(
        nodeModulesPath,
        '@reown/appkit-scaffold-ui/dist/esm/exports/onramp.js',
      ),
      '@reown/appkit-scaffold-ui/pay-with-exchange$': path.resolve(
        nodeModulesPath,
        '@reown/appkit-scaffold-ui/dist/esm/exports/pay-with-exchange.js',
      ),
      '@reown/appkit-scaffold-ui/receive$': path.resolve(
        nodeModulesPath,
        '@reown/appkit-scaffold-ui/dist/esm/exports/receive.js',
      ),
      '@reown/appkit-scaffold-ui/reown-authentication/data-capture$': path.resolve(
        nodeModulesPath,
        '@reown/appkit-scaffold-ui/dist/esm/exports/reown-authentication/data-capture.js',
      ),
      '@reown/appkit-scaffold-ui/send$': path.resolve(
        nodeModulesPath,
        '@reown/appkit-scaffold-ui/dist/esm/exports/send.js',
      ),
      '@reown/appkit-scaffold-ui/socials$': path.resolve(
        nodeModulesPath,
        '@reown/appkit-scaffold-ui/dist/esm/exports/socials.js',
      ),
      '@reown/appkit-scaffold-ui/swaps$': path.resolve(
        nodeModulesPath,
        '@reown/appkit-scaffold-ui/dist/esm/exports/swaps.js',
      ),
      '@reown/appkit-scaffold-ui/transactions$': path.resolve(
        nodeModulesPath,
        '@reown/appkit-scaffold-ui/dist/esm/exports/transactions.js',
      ),
      '@reown/appkit-scaffold-ui/w3m-modal$': path.resolve(
        nodeModulesPath,
        '@reown/appkit-scaffold-ui/dist/esm/exports/w3m-modal.js',
      ),
      '@reown/appkit-ui$': path.resolve(nodeModulesPath, '@reown/appkit-ui/dist/esm/exports/index.js'),
      '@base-org/account$': path.resolve(__dirname, 'src/services/wallet-connection/reownOptionalWalletStubs.ts'),
      '@coinbase/wallet-sdk$': path.resolve(__dirname, 'src/services/wallet-connection/reownOptionalWalletStubs.ts'),
      '@safe-global/safe-apps-provider$': path.resolve(
        __dirname,
        'src/services/wallet-connection/reownOptionalWalletStubs.ts',
      ),
      '@safe-global/safe-apps-sdk$': path.resolve(
        __dirname,
        'src/services/wallet-connection/reownOptionalWalletStubs.ts',
      ),
      'valtio/vanilla/utils$': path.resolve(nodeModulesPath, 'valtio/esm/vanilla/utils.mjs'),
      'valtio/vanilla$': path.resolve(nodeModulesPath, 'valtio/esm/vanilla.mjs'),
      'valtio/utils$': path.resolve(nodeModulesPath, 'valtio/esm/utils.mjs'),
      valtio$: path.resolve(nodeModulesPath, 'valtio/esm/index.mjs'),
      'zustand/middleware$': path.resolve(
        nodeModulesPath,
        '@coinbase/wallet-sdk/node_modules/zustand/esm/middleware.mjs',
      ),
    },
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    usedExports: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: ['babel-loader'],
        exclude: [/node_modules/, nodeModulesPath],
      },
      {
        test: /\.ts?$/,
        loaders: ['babel-loader'],
        exclude: [/node_modules/, nodeModulesPath],
      },
      {
        test: /\.m?js$/,
        type: 'javascript/auto',
        loaders: ['babel-loader'],
        include: (modulePath: string) =>
          transpiledNodeModules.some((transpiledPath) => modulePath.startsWith(transpiledPath)) ||
          transpiledNestedNodeModulesPattern.test(modulePath),
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localsConvention: 'camelCase',
              sourceMap: IS_DEV,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: IS_DEV,
              plugins: IS_DEV ? [cssnano()] : [],
            },
          },
        ],
      },
      {
        test: /.jpe?g$|.gif$|.png$|.woff$|.woff2$|.pdf$|.ttf$|.eot$/,
        use: 'url-loader?limit=10000',
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader?limit=10000'],
      },
    ],
  },
  plugins,
  devServer: {
    historyApiFallback: true,
    disableHostCheck: true, // disables checking of host server
    open: true,
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};

export default config;
