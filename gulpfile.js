'use strict';

const gulp = require('gulp'),
      sass = require('gulp-sass'),
      rename = require('gulp-rename'),
      cssmin = require('gulp-cssnano'),
      concat = require('gulp-concat'),
      prefix = require('gulp-autoprefixer'),
      sourcemaps = require('gulp-sourcemaps'),
      plumber = require('gulp-plumber'),
      notify = require('gulp-notify'),
      del = require('del'),
      minify = require('gulp-minify');



const onError = (err) => {
    notify.onError({
        title: "Gulp",
        subtitle: "Failure!",
        message: "Error: <%= error.message %>",
        sound: "Basso"
    })(err);
    this.emit('end');
};

const sassOptions = {
    outputStyle: 'expanded'
};

/**
 * BUILD SUBTASKS
 * --------------
 */

gulp.task('styles', () => {
    return gulp.src('src/sass/_main.scss')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sourcemaps.init())
        .pipe(concat('styles.scss'))
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(prefix())
        .pipe(rename('styles.css'))
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'))
});

gulp.task('clean', () => {
    return del([
        'dist/css/*.css'
    ]);
});

gulp.task('watch', () => {
    return gulp.watch(['src/sass/**/*.scss', 'src/js/*.js', 'src/img/**', 'src/fonts/**', 'src/audio/**'], (done) => {
        gulp.series(['clean', 'styles', 'compress-js', 'copy-imgs', 'copy-fonts', 'copy-audio'])(done);
    });
});

gulp.task('compress-js', function () {
    return gulp.src('src/js/*.js')
        .pipe(minify({
            ext: {
                min: '.min.js'
            },
            noSource: true,
            preserveComments: 'some'
        }))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('copy-imgs', function () {
    return gulp.src('src/img/**')
        .pipe(gulp.dest('dist/img'));
});

gulp.task('copy-fonts', function () {
    return gulp.src('src/fonts/**')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('copy-audio', function () {
    return gulp.src('src/audio/**')
        .pipe(gulp.dest('dist/audio'));
});

/**
 * BUILD TASKS
 * ------------
 */

gulp.task('default', gulp.series('watch'));

gulp.task('build', gulp.series(['clean', 'styles', 'compress-js', 'copy-imgs', 'copy-fonts', 'copy-audio']));