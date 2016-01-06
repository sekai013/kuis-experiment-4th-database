'use strict'
const gulp = require('gulp')
const babel = require('gulp-babel')
const plumber = require('gulp-plumber')
const browserify = require('browserify')
const watchify = require('watchify')
const source = require('vinyl-source-stream')

let watching = false

gulp.task('css', () => {
  gulp.src('./src/client/css/*.css')
      .pipe(gulp.dest('./dest/public/css'))
})

gulp.task('view', () => {
  gulp.src('./src/views/*.ejs')
      .pipe(gulp.dest('./dest/views'))
})

gulp.task('build-client', () => {
  const options = {
    entries: ['./src/client/js/index.js'],
    debug: true
  }
  const b = watching ? watchify(browserify(options)) : browserify(options)
  return b.transform('babelify')
          .bundle()
          .pipe(plumber())
          .pipe(source('client.js'))
          .pipe(gulp.dest('./dest/public/js'))
})

gulp.task('build-server', () => {
  return gulp.src('./src/server/*.js')
             .pipe(plumber())
             .pipe(babel())
             .pipe(gulp.dest('./dest/server'))
})

gulp.task('build-test', () => {
  gulp.src('./src/test/setup.js')
      .pipe(gulp.dest('./dest/test'))
  const options = {
    entries: ['./src/test/component.js'],
    debug: true
  }
  const b = watching ? watchify(browserify(options)) : browserify(options)
  return b.transform('babelify')
          .bundle()
          .pipe(plumber())
          .pipe(source('component.js'))
          .pipe(gulp.dest('./dest/test'))
})

gulp.task('build', ['css', 'view', 'build-client', 'build-server', 'build-test'])

gulp.task('enable-watch-mode', () => { watching = true })

gulp.task('watch', ['enable-watch-mode', 'build'], () => {
  gulp.watch('src/client/**/*.css', ['css'])
  gulp.watch('src/views/*.ejs', ['view'])
  gulp.watch('src/client/**/*.js', ['build-client', 'build-test'])
  gulp.watch('src/server/**/*.js', ['build-server'])
  gulp.watch('src/test/*.js', ['build-test'])
})

gulp.task('default', ['build'])
