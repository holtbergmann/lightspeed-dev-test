const HtmlWebpackPlugin = require('html-webpack-plugin');
const injectConfig = new HtmlWebpackPlugin({
  template: './parsecsv.html',
  filename: 'parsecsv.html',
  inject: 'body'
});

module.exports = {
  context: __dirname,
  entry: './parsecsv.js',
  output: {
    path: __dirname,
    filename: 'parsecsvbundle.js'
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [injectConfig]
}
