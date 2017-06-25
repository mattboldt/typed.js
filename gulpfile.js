var x = require("babel/register"),
    gulp = require("gulp"),
    webpack = require("webpack-stream"),
    sourcemaps = require("gulp-sourcemaps"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify"),
    livereload = require('gulp-livereload')

gulp.task("build", function() {
	return gulp.src("src/typed.js")
		.pipe(webpack(require("./webpack.config.js")))
		.pipe(gulp.dest("./lib"))
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(uglify({
			preserveComments: "license",
			compress: {
				/*eslint-disable */
				negate_iife: false
				/*eslint-enable */
			}
		}))
		.pipe(rename("typed.min.js"))
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest("lib/"));
});

// Default Task
gulp.task("default", ["build"]);

// Watch Task
gulp.task("watch", function() {
  livereload.listen();
  gulp.watch("src/*.js", ["build"]);
});
