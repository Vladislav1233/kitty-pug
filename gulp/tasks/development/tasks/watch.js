'use strict';

const $         = require('gulp-load-plugins')();
const gulp      = require('gulp');
const configDev = require('../config');
const config    = require('../../../config');

/*
 * Смотрим за изменениями
 */
module.exports = function(options) {
    return function() {
        // $.watch([configDev.watch.html], gulp.series('pug', 'webserver-reload'));
        global.watch = true;
        $.watch([configDev.watch.html], gulp.series('addInc2pug','emitty-scan', 'webserver-reload'))
        .on('all', (event, filepath) => {
            // console.log(filepath);
            global.emittyChangedFile = filepath;
        });

        $.watch(config.sass.bemblocks + '*/*.mobile.scss', gulp.series('dev:concat-mobile', 'dev:sass-compile'));

        $.watch(config.sass.bemblocks + '*/*.tablet.scss', gulp.series('dev:concat-tablet', 'dev:sass-compile'));

        $.watch(config.sass.bemblocks + '*/*.desktop.min.scss', gulp.series('dev:concat-desktop-min', 'dev:sass-compile'));

        $.watch(config.sass.bemblocks + '*/*.desktop.scss', gulp.series('dev:concat-desktop', 'dev:sass-compile'))
        // console.log(config.sass.bemblocks);

        $.watch(configDev.watch.sass, gulp.series('dev:sass-compile'));

        $.watch(configDev.watch.json, gulp.series('json'));

        // $.watch(configDev.watch.bower, gulp.series('bower-requirejs', 'dev:js'));

        $.watch(configDev.watch.srcExternal, gulp.series('js-external', 'webserver-reload'));

        // Добавил eslint перед js-internal
        $.watch(configDev.watch.srcInternal, gulp.series('eslint', 'js-internal', 'webserver-reload'));

        $.watch(configDev.watch.images, gulp.series('dev:images'));

        $.watch([configDev.watch.fonts], gulp.series('fonts'));

        $.watch(configDev.watch.otherfiles, gulp.series('otherfiles'));

        $.watch(configDev.watch.icons, gulp.series('iconfont'));
        $.watch(configDev.watch.icons, gulp.series('iconlist'));
    };
};