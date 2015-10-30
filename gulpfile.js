var gulp = require('gulp'),
    util = require("gulp-util"),
    sass = require("gulp-sass"),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    log = util.log;

gulp.task('sass', function () {
  gulp.src('./client/app/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./client/app/'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./client/app/app.scss', ['sass']);
});
