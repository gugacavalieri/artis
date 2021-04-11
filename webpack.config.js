/* eslint-disable max-len */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // rest of the webpack config
  resolve: {
    // ... rest of the resolve config
    fallback: {
      path: require.resolve('path-browserify'),
    },
  },
  // Where files should be sent once they are bundled
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'index.bundle.js',
  },
  // webpack 5 comes with devServer which loads in development mode
  devServer: {
    port: 3000,
    watchContentBase: true,
  },
  // Rules of how webpack will take our files, complie & bundle them for the browser
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /nodeModules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: require.resolve('svgr/webpack'),
            options: {
              replaceAttrValues: [
                ['#000', 'currentColor'],
                ['#000000', 'currentColor'],
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({
    inject: true,
    template: './public/index.html',
  })],
}
