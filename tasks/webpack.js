import webpack from 'webpack'
import pkg from '../package.json'
import { resolve } from 'path'

const banner = `
  ${pkg.name} - ${pkg.description}
  Author: ${pkg.author}
  Version: v${pkg.version}
  Url: ${pkg.homepage}
  License(s): ${pkg.license}
`

export const config = {
  mode: 'development',
  entry: {
    base: resolve('src', 'base'),
    react: resolve('src', 'react'),
  },
  devtool: 'inline-source-map',
  externals: [
    {
      react: 'react',
      'react-dom': 'react-dom',
    },
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: resolve('dist'),
    library: 'Typed',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true,
    globalObject: `(typeof self !== 'undefined' ? self : this)`,
    publicPath: '/',
  },
  plugins: [
    new webpack.BannerPlugin(banner),
    new webpack.HotModuleReplacementPlugin({
      multiStep: true,
    }),
  ],
}

export const scripts = () => {
  return new Promise(resolve =>
    webpack(config, (err, stats) => {
      if (err) console.log('Webpack', err)

      console.log(
        stats.toString({
          /* stats options */
        })
      )

      resolve()
    })
  )
}
