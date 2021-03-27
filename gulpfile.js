require('babel/register');
const gulp = require('gulp');
const webpack = require('webpack-stream');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const livereload = require('gulp-livereload');
const gulpDocumentation = require('gulp-documentation');
const eslint = require('gulp-eslint');
const server = require('gulp-express');

gulp.task('lint', () => {
  return (
    gulp
      .src('src/*.js')
      // default: use local linting config
      .pipe(eslint())
      // format ESLint results and print them to the console
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
  );
});

gulp.task('build', () => {
  return gulp
    .src('src/*.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./lib'))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(
      uglify({
        preserveComments: 'license',
        compress: {
          /*eslint-disable */
          negate_iife: false
          /*eslint-enable */
        }
      })
    )
    .pipe(rename('typed.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('lib/'))
    .pipe(livereload());
});

gulp.task('md-docs', () => {
  return gulp
    .src('./src/*.js')
    .pipe(gulpDocumentation('md'))
    .pipe(gulp.dest('docs'));
});

gulp.task('html-docs', () => {
  return gulp
    .src('./src/*.js')
    .pipe(
      gulpDocumentation('html'),
      {},
      {
        name: 'Typed.js Docs',
        version: '2.0.12'
      }
    )
    .pipe(gulp.dest('docs'));
});

gulp.task('server', function() {
  // Start the server at the beginning of the task
  server.run(['app.js']);
  // Restart the server when file changes
  gulp.watch(['docs/**/*.html'], server.notify);
  gulp.watch(['docs/styles/**/*.scss'], ['styles:scss']);
  //gulp.watch(['{.tmp,app}/styles/**/*.css'], ['styles:css', server.notify]);
  //Event object won't pass down to gulp.watch's callback if there's more than one of them.
  //So the correct way to use server.notify is as following:
  gulp.watch(['{.tmp,docs}/styles/**/*.css'], function(event) {
    gulp.run('styles:css');
    server.notify(event);
    //pipe support is added for server.notify since v0.1.5,
    //see https://github.com/gimm/gulp-express#servernotifyevent
  });

  gulp.watch(['docs/scripts/**/*.js'], ['jshint']);
  gulp.watch(['docs/images/**/*'], server.notify);
});

gulp.task('serve', ['watch', 'server']);

// Watch Task
gulp.task('watch', () => {
  livereload({ start: true });
  gulp.watch('src/*.js', ['md-docs', 'html-docs', 'default']);
});

gulp.task('default', ['lint', 'build']);
