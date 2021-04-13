const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')

const conf = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'tegund.umd.js',
    library: 'tegund',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        // js
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new CompressionPlugin({
      algorithm: 'gzip',
      test: new RegExp('\\.(js)$')
    })
  ]
}

module.exports = conf
