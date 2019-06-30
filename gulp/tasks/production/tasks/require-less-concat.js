'use strict';

const $       = require('gulp-load-plugins')();
const gulp    = require('gulp');
const config  = require('../../../config');
const through = require('through2').obj;
const path    = require('path');
const File    = require('vinyl');
// concate styles for version
module.exports = function(options) {
    return function() {
        return gulp.src('build/*.html')
            .pipe(through(function(file, enc, cb) {
                var f           = path.parse(file.path);
                var curFileName = f.name;

                gulp.src(f.dir + '/' + f.base)
                    .pipe($.dom(function () {
                        var bemClasses  = [];
                        var elements    = this.querySelectorAll('*');
                        var defaultCss = 'src/style/bem-blocks/default/';
                        var defaultCss2 = 'src/style/bem-blocks/b-default/';
                        var validationCss = 'src/style/bem-blocks/validation/';
                        var classesPaths     = {
                            'mobile':       [defaultCss + '*.mobile.scss', defaultCss2 + '*.mobile.scss', validationCss + '*.mobile.scss'],
                            'tablet':       [defaultCss + '*.tablet.scss', defaultCss2 + '*.tablet.scss', validationCss + '*.tablet.scss'],
                            'desktop.min':  [defaultCss + '*.desktop.min.scss', defaultCss2 + '*.desktop.min.scss', validationCss + '*.desktop.min.scss'],
                            'desktop':      [defaultCss + '*.desktop.scss', defaultCss2 + '*.desktop.scss', validationCss + '*.desktop.scss'],
                            'desktop.big' : [defaultCss + '*.desktop.big.scss', defaultCss2 + '*.desktop.big.scss', validationCss + '*.desktop.big.scss'],
                        };

                        //получаем все необходимые классы
                        [].forEach.call(elements, function(elem) {
                            var elemClass = elem.getAttribute('class');
                            if (elemClass != null) {
                                var arClasses = elemClass.split(' ');

                                [].forEach.call(arClasses, function(elClass) {
                                    if (bemClasses.indexOf(elClass) == -1
                                        && elClass.indexOf('js-') == -1
                                        && elClass.indexOf('__') == -1
                                        && elClass.indexOf('--') == -1
                                    ) {
                                        bemClasses.push(elClass);
                                        classesPaths.mobile.push('src/style/bem-blocks/' + elClass + '/*.mobile.scss');
                                        classesPaths.tablet.push('src/style/bem-blocks/' + elClass + '/*.tablet.scss');
                                        classesPaths['desktop.min'].push('src/style/bem-blocks/' + elClass + '/*.desktop.min.scss');
                                        classesPaths.desktop.push('src/style/bem-blocks/' + elClass + '/*.desktop.scss');
                                        classesPaths['desktop.big'].push('src/style/bem-blocks/' + elClass + '/*.desktop.big.scss');
                                    }
                                });
                            }
                        });

                        gulp.src(f.dir + '/' + f.base)
                            .pipe(through(function(file, enc, cb) {
                                //файл с блоками
                                let fileBlocks = new File({
                                    contents: new Buffer(bemClasses.join('\n\r')),
                                    base: process.cwd(),
                                    path: process.cwd() + '/' + curFileName + '.txt',
                                });
                                this.push(fileBlocks);

                                cb(null, fileBlocks);
                            })).
                            pipe(gulp.dest('build/css/bem/'));

                        // Concate scss for Desktop and Mobile
                        for (var type in classesPaths) {
                            gulp.src(classesPaths[type])
                                .pipe($.concat(curFileName + '.' + type + '.scss'))
                                .pipe(gulp.dest('src/style/require-concat-scss/' + curFileName + '/'));
                        }

                        //подключаем в html новый css файл
                        if (this.querySelectorAll('link')[0])
                            this.querySelectorAll('link')[0].setAttribute('href', 'css/' + curFileName + '.css');

                        return this;
                    }))
                    .pipe(gulp.dest('build/'));

                cb();
            }))
            .pipe(gulp.dest('build/'));
    }
};