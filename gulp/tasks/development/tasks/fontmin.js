'use strict';

const $        = require('gulp-load-plugins')();
const gulp     = require('gulp');
const config   = require('../../../config');
const fontmin  = require('gulp-fontmin');
var concat     = require('gulp-concat');
var replace = require('gulp-replace');


function makeStyleName(font) {
    var arr = font.split(' ');
    var last = arr.length-1;
    if (last===0) return font.toLowerCase();

    return (arr[0]+'-'+arr[last]).toLowerCase();
}

function makeChange() {
    // you're going to receive Vinyl files as chunks
    function transform(file, cb) {
        // read and modify file contents
        var font = String(file.contents).match( /font-family: "(.*)";\n/i )[1];
        var style = makeStyleName(font);

        file.contents = new Buffer(String(file.contents) + '' +
            '\n\.'+style + '(){'+
            'font-family: "'+font+'";' +
            '}\n\n');

        // if there was some error, just pass as the first parameter here
        cb(null, file);
    }

    // returning the map will cause your transform function to be called
    // for each one of the chunks (files) you receive. And when this stream
    // receives a 'end' signal, it will end as well.
    //
    // Additionally, you want to require the `event-stream` somewhere else.
    return require('event-stream').map(transform);
}


/*
 * Compress fonts
 */



module.exports = function(options) {
	return config.wrapPipe(function(success, error) {

        // Превращаем .otf в ttf
        var Fontmin = require('fontmin');
        var _fontmin = new Fontmin()
            .src(config.fontmin.srcOtf)
            .dest(config.fontmin.srcTtf)
            .use(Fontmin.otf2ttf());
        
        return _fontmin.run(function (err, files) {
            if (err) {
                throw err;
            }
            // сжимаем шрифты
            gulp.src(config.fontmin.src)
                .pipe(fontmin({
                    quiet: true,
                    hinting: true
                }))
                .pipe(gulp.dest(config.fontmin.dest))
                .on('end',function(){
                    gulp.src(config.fontmin.destCSS)
                        .pipe(makeChange())
                        .pipe(concat('fonts.less'))
                        .pipe(replace('url("', 'url("../fonts/'))
                        .pipe(gulp.dest(config.fontmin.destLess))
                });
        });


    });
    
};