//---------------------------------------------------//
// Dependencies/Variables
//---------------------------------------------------//

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    pug = require('gulp-pug'),
    newer = require('gulp-newer'),
    imagemin = require('gulp-imagemin'),
    refresh = require('gulp-refresh'),
    watch = require('gulp-watch'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync').create();


//---------------------------------------------------//
// Styles
//---------------------------------------------------//

gulp.task('styles', function(){
  return gulp.src('./src/scss/**/*.+(scss|sass)')
    .pipe(plumber())
    //.pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
      })
      .on('error', sass.logError))
      .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.stream())
    .pipe(notify('Styles compiled'));
});


//---------------------------------------------------//
// Pages
//---------------------------------------------------//

gulp.task('pages', function(){
  return gulp.src('./src/pages/**/*.+(pug|jade)')
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(notify('Pages compiled'));
});

// Ensure pages have finished saving before browser reload
gulp.task('page-watch', ['pages'], function (done){
  browserSync.reload();
  done();
});


//---------------------------------------------------//
// Images
//---------------------------------------------------//

gulp.task('images', function(){
  gulp.src('./src/images/*')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/images/'))
    .pipe(notify('Images processed'));
});

// Ensure images have been processed before browser reload
gulp.task('image-watch', ['images'], function (done){
  browserSync.reload();
  done();
});


//---------------------------------------------------//
// Watch
//---------------------------------------------------//

gulp.task('watch', function(){
  gulp.watch('./src/scss/**/*.+(scss|sass)', ['styles']);
  gulp.watch('./src/pages/**/*.+(pug|jade)', ['pages']);
  gulp.watch('./src/images/*'), ['images'];
});


//---------------------------------------------------//
// Spin up the server and inject style changes -- ['styles']
//---------------------------------------------------//

gulp.task('serve', ['styles'], function(){
  browserSync.init({
    server: './dist'
  });
    gulp.watch("./src/scss/**/*.+(scss|sass)", ['styles']);
    gulp.watch('./src/pages/**/*.+(pug|jade)', ['page-watch']);
    gulp.watch('./src/images/*', ['image-watch']);
    gulp.watch('./dist/**/*.html').on('change', browserSync.reload);
});


//---------------------------------------------------//
// Fire everything ('styles' are run via 'serve' for injection)
//---------------------------------------------------//

gulp.task('default', ['serve', 'pages', 'images'], function() {
  // place code for your default task here
  //No
});
