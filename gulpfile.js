require('babel/register');
const gulp = require('gulp');
const webpack = require('webpack-stream');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const livereload = require('gulp-livereload');
const gulpDocumentation = require('gulp-documentation');
const eslint = require('gulp-eslint');

gulp.task('lint', () => {
	return gulp.src('src/*.js')
		// default: use local linting config
		.pipe(eslint())
		// format ESLint results and print them to the console
		.pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('build', () => {
  return gulp.src('src/*.js')
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

gulp.task('md-docs', () => {
  return gulp.src('./src/*.js')
    .pipe(gulpDocumentation('md'))
    .pipe(gulp.dest('docs'));
});

gulp.task('html-docs', () => {
  return gulp.src('./src/*.js')
    .pipe(gulpDocumentation('html'), {}, {
      name: 'Typed.js Docs',
      version: '2.0.1'
    })
    .pipe(gulp.dest('docs'));
});

// Default Task
gulp.task('default', ['lint', 'md-docs', 'html-docs', 'build']);

// Watch Task
gulp.task('watch', () => {
  livereload({ start: true });
  gulp.watch('src/*.js', ['default']);
});
