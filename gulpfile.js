'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const concat = require('gulp-concat');

gulp.task('sass', () => {
    return gulp.src('./sass/_main.scss')
    .pipe(concat('styles.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'))
});

gulp.task('clean', () => {
    return del([
        './dist/css/styles.css',
    ]);
});

gulp.task('watch:sass', () => {
    gulp.watch('./sass/**/*.scss', (done) => {
        gulp.series(['clean', 'sass'])(done);
    });
});

gulp.task('default', gulp.series(['watch:sass']));