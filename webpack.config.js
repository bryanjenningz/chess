module.exports = {
  entry: ['./client/index.js'],
  output: {
    path: './dist',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/}
    ]
  }
}
