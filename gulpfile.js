/* ------------------------------------------------------------------------------
 *
 *  # Gulp file
 *
 *  Basic Gulp tasks for Limitless template
 *
 *  Version: 1.1
 *  Latest update: Aug 20, 2016
 *
 * ---------------------------------------------------------------------------- */

'use strict';

// Include gulp
var gulp = require('gulp');

// Include our plugins

var ngAnnotate = require('gulp-ng-annotate');
var gutil = require('gulp-util');
var ngmin = require('gulp-ngmin');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var minifyCss = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

gulp.task('copy', function () {
    gutil.log('=== logging stuff ===')
    gulp.src('index.html')
        .pipe(gulp.dest('assets'))
});

gulp.task('app', function() {
    return gulp.src(['app/**/app.module.js', 'app/**/*.module.js', 'app/**/*.js'])
        .pipe(ngAnnotate({add: true}))
            .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
        .pipe(concat('script.js', {newLine: ';'}))
            .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
        .pipe(uglify())
            .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
        .pipe(gulp.dest('assets/dist'));
});

gulp.task('default', ['browser-sync'], function () {
});

gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
        proxy: "localhost:3000",
        files: ['app/**/*.js', 'app/**/*.html', './**/*.*'],
        port: 5000,
	});
});
gulp.task('nodemon', function (cb) {
	
	var started = false;
	
	return nodemon({
		script: 'app.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true; 
		} 
	});
});