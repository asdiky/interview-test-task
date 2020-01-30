'use strict';

// Load plugins

const gulp = require('gulp');
const sass = require('gulp-sass');
const webserver = require('gulp-webserver');
const njkRender = require('gulp-nunjucks-render');
const plumber=require('gulp-plumber');
const livereload = require('gulp-livereload');
const imagemin = require('gulp-imagemin');

gulp.task('sass', function (done) {
   gulp.src('./src/sass/**/*.scss')
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./build/styles'))
		.pipe(livereload());
		done();
});

gulp.task('imagemin', function (done) {
   gulp.src('src/img/*')
		.pipe(plumber())
		.pipe(imagemin())
		.pipe(gulp.dest('./build/img'));
		done();
});

gulp.task ('scripts', function (done) {
	gulp.src('js/*.js+')
		.pipe(plumber())
		.pipe(gulp.dest('build/js'));
		done();
});

gulp.task('webserver', function (done) {
  gulp.src('./build')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});

gulp.task('webserver', function (done) {
  gulp.src('build')
    .pipe(webserver({
      fallback: 'index.html' 
    }));
	done();
});

gulp.task('nunjucks', function () {
	return gulp.src('src/templates/*.njk')
		.pipe(plumber())
		.pipe(njkRender({
      path: 'src/templates/' // String or Array
    }))
		.pipe(gulp.dest('build'))
		.pipe(livereload());
});

gulp.task('watch', function () {
	livereload.listen(); 
	gulp.watch ('js/*.js', gulp.series('scripts'));
	gulp.watch ('./src/sass/**/*.scss', gulp.series('sass'));
	gulp.watch ('src/templates/**/*.njk', gulp.series('nunjucks'));
	gulp.watch ('src/img/*', gulp.series('imagemin'));
	return
});

gulp.task('default',gulp.parallel('webserver',gulp.series('imagemin', 'sass', 'nunjucks', 'watch')));