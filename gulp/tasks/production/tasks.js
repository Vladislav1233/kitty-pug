'use strict';

const gulp  = require('gulp');
const config  = require('../../config');

function lazyRequireTask(taskName, path, options) {
    options = options || {};
    options.taskName = taskName;
    gulp.task(taskName, function(callback) {
        let task = require(path).call(this, options);

        return task(callback);
    });
}

// icons to font
lazyRequireTask('iconfont', './tasks/iconfont');

// Favicons
lazyRequireTask('favicon-check-for-updates', './tasks/favicon-check-for-updates');
lazyRequireTask('favicon-generate', './tasks/favicon-generate');
lazyRequireTask('favicon-inject-markups', './tasks/favicon-inject-markups');
gulp.task('favicon', gulp.parallel('favicon-check-for-updates', 'favicon-generate', 'favicon-inject-markups'));


// images from production
lazyRequireTask('images', './tasks/images');

// pug to html
// lazyRequireTask('pug', './tasks/pug');
// lazyRequireTask('emitty', './tasks/emitty');

const gulpif   = require('gulp-if');
const pug      = require('gulp-pug');
const emitty   = require('emitty').setup('src', 'pug');
gulp.task('emitty', () =>
    new Promise((resolve, reject) => {
        emitty.scan(global.emittyChangedFile).then(() => {
            gulp.src('src/*.pug')
                .pipe(gulpif(global.watch, emitty.filter(global.emittyChangedFile)))
                .pipe(pug({ pretty: true }))
                .pipe(gulp.dest(config.pug.dest))
                .on('end', resolve)
                .on('error', reject);
        });
    })
);
// less foe ie only
lazyRequireTask('ieless', './tasks/ieless');

// copy bower folder to build if requireJS is true
// lazyRequireTask('bower-requirejs', './tasks/bower-requirejs');
// generate js if requireJS is true
lazyRequireTask('js', './tasks/js');
// combine tasks to only for requireJS
// gulp.task('js-require', gulp.parallel('bower-requirejs', 'js'));

// external js from bower to only file if requireJS is false
lazyRequireTask('js-external', './tasks/js-external');
// inner js to only file if requireJS is false
lazyRequireTask('js-internal', './tasks/js-internal');

lazyRequireTask('js-assets', './tasks/js-assets');

// combine tasks to only for NOT requireJS
gulp.task('js-norequire', gulp.parallel('js-external', 'js-internal'));

// copy json folder
lazyRequireTask('json', './tasks/json');

// copy fonts folder
lazyRequireTask('fonts', './tasks/fonts');

// Less

lazyRequireTask('dev:sass-compile', './tasks/sass-compile');

// Concate LESS for Desktop and Mobile
lazyRequireTask('dev:concat-mobile', './tasks/sass-concate', {
    sassName:     '*/*.mobile.scss',
    concatName:   'bem.mobile.scss'
});

lazyRequireTask('dev:concat-tablet', './tasks/sass-concate', {
    sassName:     '*/*.tablet.scss',
    concatName:   'bem.tablet.scss'
});

lazyRequireTask('dev:concat-desktop-min', './tasks/sass-concate', {
    sassName:     '*/*.desktop.min.scss',
    concatName:   'bem.desktop.min.scss'
});

lazyRequireTask('dev:concat-desktop', './tasks/sass-concate', {
    sassName:     '*/*.desktop.scss',
    concatName:   'bem.desktop.scss'
});



lazyRequireTask('buster', './tasks/buster');

// Compile LESS to CSS
gulp.task('sass', gulp.series(
    gulp.parallel(
        'dev:concat-mobile',
        'dev:concat-tablet',
        'dev:concat-desktop-min',
        'dev:concat-desktop'
    ),
    'dev:sass-compile'
));

// delete build path
lazyRequireTask('clean', './tasks/clean');

// generate index.html for list of pages
lazyRequireTask('htmllist', './tasks/htmllist');

// generate iconlist.html for list of icons
lazyRequireTask('iconlist', './tasks/iconlist');

// copy files from root
lazyRequireTask('otherfiles', './tasks/otherfiles');

gulp.task('fonts-all', gulp.series(
    'fontmin',
    'fonts'
));

gulp.task('compile',
    gulp.series(
        gulp.parallel(
            (config.main.iconfont ? 'iconfont' : 'sprites'),
            'images',
            // 'pug',
            'emitty',
            (config.main.requireJs ? 'js-require' : 'js-norequire'),
            // 'ieless',
            'json',
            'otherfiles'
        ),
        // 'font',
        'fonts-all',
        'sass'
    )
);

//TODO: add testSystem task
// gulp.task('init', gulp.series('htmllist'));
gulp.task('init', gulp.series(
    'htmllist',
    'iconlist'
));



gulp.task('build',
    gulp.series(
        'clean',
        gulp.parallel(
            'compile',
            'init'
        )
    )
);

gulp.task('buildback',
    gulp.series(
        'clean',
        'init',
        'compile',
        'js-assets',
        //'buster'
    )
);

//Require CSS
lazyRequireTask('require-less-concat', './tasks/require-less-concat');
lazyRequireTask('require-less-compile', './tasks/require-less-compile');

gulp.task('require-css', gulp.series('require-less-concat', 'require-less-compile'));