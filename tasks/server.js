import gulp from 'gulp'
import Browser from 'browser-sync'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import { config as webpackConfig } from './webpack'

const browser = Browser.create()
const bundler = webpack(webpackConfig)

export function server() {
  const config = {
    server: '.',
    open: false,
    middleware: [
      webpackDevMiddleware(bundler, { writeToDisk: true }),
      webpackHotMiddleware(bundler),
    ],
  }

  browser.init(config)

  gulp.watch('src/base/*.ts').on('change', () => browser.reload())
}
