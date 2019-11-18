import path from 'path';
import { Configuration } from 'webpack';
import cssnano from 'cssnano';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const plugins = [
  new HtmlWebpackPlugin({
    title: 'ORBS Staking Wallet',
    template: 'index.html',
  }),
];

// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
// plugins.push(new BundleAnalyzerPlugin());

const IS_DEV = process.env.NODE_ENV !== 'production';
const nodeModulesPath = path.resolve(__dirname, 'node_modules');

const config: Configuration = {
  mode: IS_DEV ? 'development' : 'production',
  devtool: IS_DEV ? 'inline-source-map' : false,
  entry: ['core-js', './src/client'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: `[name]-[hash:8]-bundle.js`,
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
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
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
        test: /.jpe?g$|.gif$|.png$|.svg$|.woff$|.woff2$|.ttf$|.eot$/,
        use: 'url-loader?limit=10000',
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
