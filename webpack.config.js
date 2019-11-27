import webpack from 'webpack'
import pkg from './package.json'
import { resolve } from 'path'

var banner = `
  ${pkg.name} - ${pkg.description}
  Author: ${pkg.author}
  Version: v${pkg.version}
  Url: ${pkg.homepage}
  License(s): ${pkg.license}
`

module.exports = {
  mode: 'development',
  entry: {
    base: resolve('src', 'base'),
    react: resolve('src', 'react'),
  },
  output: {
    filename: '[name].js',
    path: resolve('dist'),
    library: 'Typed',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: "typeof self !== 'undefined' ? self : this",
    umdNamedDefine: true,
  },
  // devtool: '#inline-source-map',
  externals: [
    {
      react: 'react',
      'react-dom': 'react-dom',
    },
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'entry',
                  corejs: 3,
                  targets: {
                    browsers: ['last 2 versions', 'ie >= 11'],
                  },
                },
              ],
              '@babel/preset-react',
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              'babel-plugin-transform-react-remove-prop-types',
            ],
          },
        },
      },
    ],
  },
  // plugins: [new webpack.BannerPlugin(banner)],
}
