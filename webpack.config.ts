import webpack from 'webpack';
import path from 'path';
import dotenv from 'dotenv';
import { Configuration } from 'webpack';
import cssnano from 'cssnano';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
const CopyWebpackPlugin = require('copy-webpack-plugin');
import { createEnvObjectForWebpack, getEnvFilePath, overrideEnvFileValuesWithRuntimeEnv } from './webpackUtils';

const envFilePath = getEnvFilePath(process.env);
const envFromFile = dotenv.config({ path: envFilePath }).parsed;
const envFromPathMergedWithRuntime = overrideEnvFileValuesWithRuntimeEnv(envFromFile, process.env);

const plugins = [
  new ForkTsCheckerWebpackPlugin({
    tsconfig: path.join(__dirname, 'src', 'tsconfig.json'),
  }),
  // Adds the index.html to the dist
  new HtmlWebpackPlugin({
    title: 'ORBS Staking Wallet',
    template: 'index.html',
  }),
  new CopyWebpackPlugin([
    {
      from: './404.html',
    },
  ]),
  // Adds the favicons to the dist
  new FaviconsWebpackPlugin('./assets/favicons/tetra_favicon.svg'),
  // DEV_NOTE : this plugin replaces the usage of 'process.env.X' with the actual values of the key.
  new webpack.DefinePlugin(createEnvObjectForWebpack(envFromPathMergedWithRuntime)),

  // DEV_NOTE : Ignore all locale files of moment.js (will include required ones manually)
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
];

// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
// plugins.push(new BundleAnalyzerPlugin());

const IS_DEV = process.env.NODE_ENV !== 'production';
const nodeModulesPath = path.resolve(__dirname, 'node_modules');

const config: Configuration = {
  mode: IS_DEV ? 'development' : 'production',
  target: 'web',
  devtool: IS_DEV ? 'inline-source-map' : false,
  entry: ['core-js', './src/client'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: `[name]-[hash:8]-bundle.js`,
    publicPath: IS_DEV ? '/' : '/staking/',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
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
        test: /.jpe?g$|.gif$|.png$|.woff$|.woff2$|.ttf$|.eot$/,
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
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};

export default config;
