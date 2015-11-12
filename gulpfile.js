var gulp = require('gulp'),
    util = require("gulp-util"),
    sass = require("gulp-sass"),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    log = util.log;

gulp.task('build', function() {
  gulp.src('./client/app/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(minifycss())
    .pipe(gulp.dest('./client/app/'));

  gulp.src(['./client/app/*.js', './client/app/**/*.js', './client/components/*.js', './client/components/**/*.js'])
    .pipe(concat('all.js'))
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('./client/'));

  gulp.src(['./client/bower_components/jquery/dist/jquery.js',
            './client/bower_components/angular/angular.js',
            './client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            './client/bower_components/angular-cookies/angular-cookies.js',
            './client/bower_components/angular-emoji-filter-hd/dist/emoji.min.js',
            './client/bower_components/perfect-scrollbar/src/perfect-scrollbar.js',
            './client/bower_components/angular-perfect-scrollbar/src/angular-perfect-scrollbar.js',
            './client/bower_components/angular-resource/angular-resource.js',
            './client/bower_components/angular-sanitize/angular-sanitize.js',
            './client/bower_components/angular-socket-io/socket.js',
            './client/bower_components/angular-ui-router/release/angular-ui-router.js',
            './client/bower_components/async/lib/async.js',
            './client/bower_components/lodash/dist/lodash.compat.js',
            './client/bower_components/angular-click-outside/clickoutside.directive.js',
            './client/bower_components/spin.js/spin.js',
            './client/bower_components/angular-spinner/angular-spinner.js',
            './client/bower_components/angular-scroll-glue/src/scrollglue.js',
            './client/bower_components/crypto-js/crypto-js.js',])
    .pipe(concat('bundle.js'))
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('./client/'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./client/app/app.scss', ['sass']);
});
