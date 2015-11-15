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
  concatCss = require('gulp-concat-css'),
  clean = require('gulp-clean');

gulp.task('vendor:js', function () {
  gulp.src([
    './bower_components/angular/angular.min.js',
    './bower_components/angular-route/angular-route.min.js',
    './bower_components/angular-resource/angular-resource.min.js',
    './bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
    './bower_components/angular-ui-notification/dist/angular-ui-notification.min.js',
    './bower_components/lodash/lodash.min.js'
  ])
    .pipe(concat('vendor.js'))
    .pipe(rename('vendor.min.js'))
    .pipe(gulp.dest('./assets/js'))
});

gulp.task('js', function() {
  gulp.src('src/js/app.js')
    .pipe(plumber())
    .pipe(browserify({
      insertGlobals : true
    }))
    .pipe(gulp.dest('./assets/js'))
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('./assets/js'))
});

gulp.task('styl', function () {
  gulp.src('./src/styl/app.styl')
    .pipe(plumber())
    .pipe(stylus({use: koutoSwiss(), import: 'kouto-swiss'}))
    .pipe(gulp.dest('./assets/css'))
    .pipe(sourcemaps.init())
    .pipe(minifyCss())
    .pipe(rename('app.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.stream());
});

gulp.task('less', function () {
  gulp.src('./src/less/*.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(gulp.dest('./src/vendor'))
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
    .pipe(concatCss('vendor.css'))
    .pipe(gulp.dest('./assets/css'))
    .pipe(sourcemaps.init())
    .pipe(minifyCss())
    .pipe(rename('vendor.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./assets/css'))
});

gulp.task('img', function() {
  gulp.src('./src/img/**/*')
    .pipe(gulp.dest('./assets/img'))
});

gulp.task('fonts', function() {
  gulp.src('./src/fonts/**/*')
    .pipe(gulp.dest('./assets/fonts'))
});

gulp.task('clean', function() {
  return gulp.src('assets', {read: false})
    .pipe(clean());
});

gulp.task('serve', ['clean'], function() {
  gulp.start('js','styl','fonts','img','vendor:js','vendor:css');
  browserSync.init({
    proxy: "localhost:3000"
  });

  gulp.watch("templates/*.jade", browserSync.reload);
  gulp.watch("src/js/**/*.js", ['js']);
  gulp.watch("src/less/*.less", ['less']);
  gulp.watch("src/styl/**/*.styl", ['styl']);
});

gulp.task('default', ['serve']);
