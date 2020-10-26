'use strict';

const gulp       = require('gulp'),
      sass       = require('gulp-sass'),
      rename     = require('gulp-rename'),
      cssmin     = require('gulp-cssnano'),
      concat     = require('gulp-concat'),
      prefix     = require('gulp-autoprefixer'),      
      sourcemaps = require('gulp-sourcemaps'),
      plumber    = require('gulp-plumber'),      
      notify     = require('gulp-notify'),      
      del        = require('del')


const onError = (err) => {
  notify.onError({
    title:    "Gulp",
    subtitle: "Failure!",
    message:  "Error: <%= error.message %>",
    sound:    "Basso"
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
  return gulp.src('./sass/_main.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sourcemaps.init())
    .pipe(concat('styles.scss'))
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(prefix())
    .pipe(rename('styles.css'))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'))
});

gulp.task('clean', () => {
    return del([
        './dist/css/*.css'
    ]);
});

gulp.task('watch', () => {
    gulp.watch('./sass/**/*.scss', (done) => {
        gulp.series(['clean', 'styles'])(done);
    });
});

/**
 * BUILD TASKS
 * ------------
 */

gulp.task('default', gulp.series(['watch']));

gulp.task('build', gulp.series(['clean', 'styles']));