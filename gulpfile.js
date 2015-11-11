var gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  nib = require('nib'),
  browserSync = require('browser-sync').create(),
  less = require('gulp-less'),
  plumber = require('gulp-plumber');

gulp.task('js', function () {
  gulp.src('./src/js/*.js')
    .pipe(plumber())
    .pipe(gulp.dest('./assets/js'))
    .pipe(browserSync.stream());
});

gulp.task('less', function () {
  gulp.src('./src/less/uikit.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.stream());
});

gulp.task('styl', function () {
  gulp.src('./src/styl/app.styl')
    .pipe(plumber())
    .pipe(stylus({use: nib(), import: 'nib'}))
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.stream());
});

gulp.task('serve', ['js','less','styl'], function() {
  browserSync.init({
    proxy: "localhost:3000"
  });

  gulp.watch("templates/*.jade", browserSync.reload);
  gulp.watch("src/js/*.js", ['js']);
  gulp.watch("src/less/*.less", ['less']);
  gulp.watch("src/styl/**/*.styl", ['styl']);
});

gulp.task('default', ['serve']);
