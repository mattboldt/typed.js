require('babel/register');
const gulp = require('gulp');
const webpack = require('webpack-stream');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const livereload = require('gulp-livereload');
const gulpDocumentation = require('gulp-documentation');

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

gulp.task('documentation-readme-example1', () => {
  // Generating README documentation
  return gulp.src('./index.js')
    .pipe(gulpDocumentation('md'))
    .pipe(gulp.dest('docs'));
});

gulp.task('documentation-readme-example2', () => {
  // Generating README documentation
  return gulp.src('./index.js')
    .pipe(gulpDocumentation('html'))
    .pipe(gulp.dest('docs'));
});

// Default Task
gulp.task('default', ['documentation-readme-example1', 'documentation-readme-example2', 'build']);

// Watch Task
gulp.task('watch', function() {
  livereload({ start: true });
  gulp.watch('src/*.js', ['build']);
});
