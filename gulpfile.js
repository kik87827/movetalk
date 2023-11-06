
var gulp = require("gulp"),
	fileinclude = require('gulp-file-include'),
	webserver = require('gulp-webserver'),
	connect = require('gulp-connect'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	scss = require('gulp-sass')(require('sass')),
	jshint = require('gulp-jshint'),
	beautify = require('gulp-beautify'),
	htmlbeautify = require('gulp-html-beautify');

gulp.task('default', ['scss','fileinclude','beautify','watch']);

gulp.task('scss', function () {
	gulp.src('./src/assets/scss/*.scss')
	.pipe(sourcemaps.init())
	.pipe(scss().on('error', scss.logError))
	.pipe(autoprefixer())
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./dist/assets/css/'))
});

gulp.task('jshint',function(){
	gulp.src('./src/assets/js/front.js')
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
});

gulp.task('beautify',function(){
	gulp.src('./src/assets/js/*.js')
	.pipe(beautify.js({indent_size: 2}))
	.pipe(gulp.dest('./dist/assets/js/'))
});

gulp.task('fileinclude',function(){
	gulp.src(['./src/**.html'],{base : "./src/"})
	.pipe(fileinclude({
		prefix : '@@',
		basepath : '@file'
	}).on('error', function(){ console.log('path error')}))
	// .pipe(removeEmptyLines())
	.pipe(htmlbeautify({indent_with_tabs : true}))
	.pipe(gulp.dest('./dist/'))
});

gulp.task('webserver',function(){
	gulp.src('./dist/')
	.pipe(webserver({
		livereload : true,
		open : true,
		port : 7474
	}));
});

gulp.task('watch', function () {
	gulp.watch(['./src/**.html', './src/*/**.html'], ["fileinclude"]);
	gulp.watch(['./src/assets/scss/**/*.scss'], ["scss"]);
	gulp.watch(['./src/assets/js/*.js'], ["beautify"]);
});