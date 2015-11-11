var gulp = require('gulp');
var stylus = require('gulp-stylus');
var browserSync = require('browser-sync').create();

gulp.task('js', function () {
  gulp.src('./src/js/*.js')
    .pipe(gulp.dest('./assets/js'))
    .pipe(browserSync.stream());
});

gulp.task('styl', function () {
  gulp.src('./src/styl/app.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.stream());
});

gulp.task('serve', ['js','styl'], function() {
  browserSync.init({
    proxy: "localhost:3000"
  });

  gulp.watch("src/js/*.js", ['js']);
  gulp.watch("src/styl/*.styl", ['styl']);
});

gulp.task('default', ['serve']);
