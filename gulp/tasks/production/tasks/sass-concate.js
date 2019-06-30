'use strict';

const $           = require('gulp-load-plugins')();
const gulp        = require('gulp');
const config      = require('../../../config');
const through2    = require('through2').obj;
const File        = require('vinyl');

// concate styles for version
module.exports = function(options) {
    return function() {
        const lessImports = [];
        return gulp.src(config.sass.bemblocks + options.sassName)
            .pipe(through2(
            	function(file, enc, callback) {
					// console.log(file.relative.replace(/\\/g, "/"));
	            	lessImports.push('@import ' + '"../bem-blocks/' + file.relative.replace(/\\/g, "/") + '";');
	            	callback();
	            },
	            function(callback) {
	            	let lessFile = new File({
	            		contents: new Buffer(lessImports.join('\n'), 'utf-8'),
	            		base: '',
	            		path: options.concatName
	            	});

	            	this.push(lessFile);
	            	callback();
	            }
	        ))
            .pipe(gulp.dest(config.sass.concatsass));
    }
};