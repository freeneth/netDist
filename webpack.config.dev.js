const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  entry: {
    page: path.resolve('./test/page.js'),
  },
  output: {
    filename: 'test/[name].dist.js',
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './test',
    open: true,
    port: 3333,
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
});
