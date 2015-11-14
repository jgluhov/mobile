var gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  koutoSwiss = require('kouto-swiss'),
  browserSync = require('browser-sync').create(),
  less = require('gulp-less'),
  plumber = require('gulp-plumber'),
  browserify = require('gulp-browserify'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  minifyCss = require('gulp-minify-css'),
  sourcemaps = require('gulp-sourcemaps'),
  concatCss = require('gulp-concat-css');

gulp.task('vendor:js', function () {
  gulp.src([
    './bower_components/angular/angular.min.js',
    './bower_components/angular-route/angular-route.min.js',
    './bower_components/angular-resource/angular-resource.min.js',
    './bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
    './bower_components/angular-ui-notification/dist/angular-ui-notification.min.js',
    './bower_components/lodash/lodash.min.js'
  ])
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('./assets/js'))
});

gulp.task('js', function() {
  gulp.src('src/js/app.js')
    .pipe(plumber())
    .pipe(browserify({
      insertGlobals : true
    }))
    .pipe(gulp.dest('./assets/js'))
});

gulp.task('less', function () {
  gulp.src('./src/less/*.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(gulp.dest('./src/vendor'))
    .pipe(browserSync.stream());
});

gulp.task('styl', function () {
  gulp.src('./src/styl/app.styl')
    .pipe(plumber())
    .pipe(stylus({use: koutoSwiss(), import: 'kouto-swiss'}))
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.stream());
});

gulp.task('sass', function () {
  gulp.src('./src/sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./src/vendor'))
    .pipe(browserSync.stream());
});

gulp.task('vendor:css',['less', 'sass'], function() {
  gulp.src([
    './src/vendor/*.css',
    './bower_components/angular-ui-notification/dist/angular-ui-notification.min.css'
  ])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concatCss('vendor.min.css'))
    .pipe(minifyCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./assets/css'))
});

gulp.task('serve', ['js','vendor:js','vendor:css','styl'], function() {
  browserSync.init({
    proxy: "localhost:3000"
  });

  gulp.watch("templates/*.jade", browserSync.reload);
  gulp.watch("src/js/**/*.js", ['js']);
  gulp.watch("src/less/*.less", ['less']);
  gulp.watch("src/styl/**/*.styl", ['styl']);
});

gulp.task('default', ['serve']);
