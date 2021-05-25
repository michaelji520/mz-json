const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    popup: path.resolve(__dirname, './src/popup/popup.js'),
    json: path.resolve(__dirname, './src/json/json.js')
  },
  output: {
    filename: 'js/[name]_[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {loader: MiniCssExtractPlugin.loader},
          {loader: 'css-loader'},
          {loader: 'less-loader',options: {lessOptions: {strictMath: true}}}
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ // chrome popup
      title: 'popup',
      filename: 'popup.html',
      favicon: path.resolve(__dirname, './src/assets/icon.ico'),
      template: path.resolve(__dirname, './src/popup/popup.html'),
      chunks: ['popup'],
      inject: true,
      minify: { collapseWhitespace: true }
    }),
    new HtmlWebpackPlugin({ // json format
      title: 'JSON格式化',
      filename: 'json.html',
      favicon: path.resolve(__dirname, './src/assets/icon.ico'),
      template: path.resolve(__dirname, './src/json/json.html'),
      chunks: ['json'],
      inject: true,
      minify: { collapseWhitespace: true, removeComments: true }
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, './src/manifest.json'), to: path.resolve(__dirname, './dist/manifest.json') },
        { from: path.resolve(__dirname, './src/assets/'), to: path.resolve(__dirname, './dist') },
      ]
    }),
    new MiniCssExtractPlugin({filename: 'css/[name]_[contenthash].css'}),
    new OptimizeCssAssetsPlugin(),
    new CleanWebpackPlugin()
  ]
}
