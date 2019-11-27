import gulp from 'gulp'

import { scripts } from './tasks/webpack'
import { server } from './tasks/server'

export const dev = gulp.series(server)
export const build = gulp.series(scripts)

export default dev
