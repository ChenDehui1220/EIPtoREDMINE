/**
 *  Redmind Convention Tool
 *  @2017/09/06
 */

'use strict';

// dependencies
var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var runSequence = require('run-sequence');

var srcFolder = './src/';
var buildFolder = './build/';

// 清空Dist
gulp.task('clean', function() {
    return del([buildFolder + '*'], {
        force: true
    });
});

// 複製
gulp.task('copy', function() {
    return gulp.src([srcFolder + '*.png'])
        .pipe(gulp.dest(buildFolder))
        .on('error', gutil.log);
});

// 佈署
gulp.task('deploy', function() {
    runSequence(
        'clean',
        'copy',
        function() {
            gutil.log('build completed!');
        }
    );
});
