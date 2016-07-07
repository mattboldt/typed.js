
// Grab node packages
var gulp = require('gulp')
    rename = require('gulp-rename')
    uglify = require('gulp-uglify');

 
gulp.task('compress', function() {
  gulp.src('js/*.js')
    .pipe(uglify())
    .pipe(rename('typed.min.js'))
    .pipe(gulp.dest('dist'))
});

// Default Task
gulp.task('default', ['compress']);
