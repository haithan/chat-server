var gulp = require('gulp'),
    util = require("gulp-util"),
    sass = require("gulp-sass"),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    log = util.log;

gulp.task('sass', function () {
  gulp.src('./client/app/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(minifycss())
    .pipe(gulp.dest('./client/app/'));
});

gulp.task('compress', function() {
  return gulp.src(['./client/app/*.js', './client/app/**/*.js', './client/components/*.js', './client/components/**/*.js'])
          .pipe(concat('all.js'))
          .pipe(uglify({mangle: false}))
          .pipe(gulp.dest('./client/'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./client/app/app.scss', ['sass']);
});
