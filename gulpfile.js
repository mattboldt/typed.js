const gulp = require('gulp');
const webpack = require('webpack-stream');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const livereload = require('gulp-livereload');

gulp.task('build', function() {
  return gulp.src('src/typed.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./lib'))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify({
      preserveComments: 'license',
      compress: {
        /*eslint-disable */
        negate_iife: false
        /*eslint-enable */
      }
    }))
    .pipe(rename('typed.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('lib/'))
    .pipe(livereload());
});

// Default Task
gulp.task('default', ['build']);

// Watch Task
gulp.task('watch', function() {
  livereload({ start: true });
  gulp.watch('src/*.js', ['build']);
});
