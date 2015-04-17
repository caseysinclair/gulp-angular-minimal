'use strict'

var
  gulp       = require('gulp'),
  stylus     = require('gulp-stylus'),
  sync       = require('browser-sync'),
  inline     = require('gulp-rework'),
  notify     = require('gulp-notify'),
  csso       = require('gulp-csso'),
  size       = require('gulp-filesize'),
  util       = require('gulp-util'),
  ugly       = require('gulp-uglify'),
  concat     = require('gulp-concat'),
  sourcemaps = require('gulp-sourcemaps'),
  connect    = require('gulp-connect');

/** Paths **/
var file = {
  path: {
    css : {
      files : './src/assets/styles/main.styl',
      stylus: ['./src/assets/styles/_*.styl', './src/modules/**/**/_*.styl']
    },
    js  : {
      files: ['./src/modules/common/_app.js', './src/modules/**/**_*.js', './src/modules/**/**/*.js']
    },
    html: {
      files: ['./src/modules/**/_*.html', './src/modules/*.html', './src/modules/**/*.html']
    }
  }
};

function notifyTerminal(message) {
  util.log(util.colors.inverse(message));
}

/** CSS **/
gulp.task('buildCSS', function () {
  notifyTerminal('Build styles');
  gulp.src(file.path.css.files)
    .pipe(stylus({linenos: true, compress: true}))
    .pipe(gulp.dest('./dev/assets/styles/'))
    .pipe(connect.reload());
});

/** Javascript ***/
gulp.task('buildJS', function () {
  notifyTerminal('Build scripts');
  gulp.src(file.path.js.files)
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dev/scripts/'))
    .pipe(connect.reload());
});

/** HTML **/
gulp.task('buildHTML', function () {
  notifyTerminal('Build HTML');
  gulp.src(file.path.html.files)
    .pipe(gulp.dest('./dev/views/'))
    .pipe(connect.reload());
  gulp.src('./src/index.html')
    .pipe(gulp.dest('./dev/'))
});

/** Bower packages **/
gulp.task('buildBowerPackages', function () {
  notifyTerminal('Build bower packages');
  gulp.src([
    './bower_components/angular/angular.js',
    './bower_components/angular-ui-router/release/angular-ui-router.js',
  ])
    .pipe(gulp.dest('./dev/bower_components/'))
});

gulp.task('watch', function () {
  gulp.watch(file.path.css.files, ['buildCSS']);
  gulp.watch(file.path.css.stylus, ['buildCSS']);
  gulp.watch(file.path.js.files, ['buildJS']);
  gulp.watch(file.path.html.files, ['buildHTML']);
  gulp.watch('gulpfile.js');
});

gulp.task('default', ['connect', 'watch', 'buildCSS', 'buildJS', 'buildHTML', 'buildBowerPackages', 'assets']);

// Misc
gulp.task('assets', function () {
  notifyTerminal(' Getting fonts and other assets ');
  gulp.src(['./src/assets/fonts/*.woff', './src/assets/fonts/*.ttf', './src/assets/fonts/*.css'])
    .pipe(gulp.dest('./dev/assets/styles/'));
});

gulp.task('connect', function () {
  connect.server({
    root            : 'dev',
    livereload      : true,
    directoryListing: false,
    port            : 3000,
    open            : true
  });
});
