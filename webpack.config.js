const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

const plugins = [
  new MonacoWebpackPlugin({
    languages: ['json']
  }),
  new HtmlWebpackPlugin({ // chrome popup
    title: 'popup',
    filename: 'popup.html',
    favicon: path.resolve(__dirname, './src/assets/icon.ico'),
    template: path.resolve(__dirname, './src/popup/popup.html'),
    chunks: ['popup'],
    inject: true,
    minify: {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
    }
  }),
  new HtmlWebpackPlugin({
    title: 'JSON',
    filename: 'json.html',
    favicon: path.resolve(__dirname, './src/assets/icon.ico'),
    template: path.resolve(__dirname, './src/json/index.html'),
    chunks: ['json'],
    inject: true,
    minify: { collapseWhitespace: true, removeComments: true }
  }),
  new MiniCssExtractPlugin({filename: 'css/[name].[contenthash].css'}),
];

if (isProd) {
  plugins.push(
    // new CompressionWebpackPlugin({
    //   test: /\.js$|\.html$|\.css$/u,
    //   // compress if file is larger than 4kb
    //   threshold: 4096,
    // }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, './src/manifest.json'), to: path.resolve(__dirname, './dist/manifest.json') },
        { from: path.resolve(__dirname, './src/assets/'), to: path.resolve(__dirname, './dist') },
        { from: path.resolve(__dirname, './src/background.js'), to: path.resolve(__dirname, './dist/background.js') },
      ]
    }),
    new CssMinimizerWebpackPlugin({
      test: /\.css$/g,
    }),
    new CleanWebpackPlugin(),
  )
}

module.exports = {
  mode: process.env.NODE_ENV,
	entry: {
    popup: path.resolve(__dirname, './src/popup/popup.js'),
    json: path.resolve(__dirname, './src/json/index.js')
  },
	output: {
		filename: 'js/[name].[contenthash].js',
		path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
	},
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
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
      },
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.ttf$/,
				use: ['file-loader']
			}
		]
	},
	plugins
};