var config = require('../../config');
var testHtml = require('./tasks/backStop');

module.exports = {
    browsersync: {
        server: {
            baseDir: './' + config.build
        },
        tunnel: false,
        open: false,
        host: 'localhost',
        port: 3000,
        middleware: [
            {
                route: "/bs",
                handle: testHtml
            }
        ],
        logPrefix: 'Frontend_Blank'
    },
    watch: {
        html: 'src/**/*.pug',
        // less: ['src/style/**/*.less', '!src/style/concat-less/*.less', '!src/style/bem-blocks/**/*.less'],
        sass: ['src/style/**/*.scss', '!src/style/concat-sass/*.scss', '!src/style/bem-blocks/**/*.scss'],
        js: ['src/js/**/*.js', '!src/js/node_modules/**/*.*'],
        json: 'src/json/**/*.*',
        images: ['src/images/**/*.*', '!src/images/svg_for_icon/*.svg'],
        icons: 'src/images/svg_for_icon/*.*',
        fonts: 'src/fonts/**/*.*',
        angular: 'src/angular/*.ts',
        bower: 'src/js/node_modules/**/*.*',
        otherfiles: ['src/*.*', '!src/*.jade'],
        srcExternal: 'src/js/**/external.js',
        srcInternal: ['src/js/**/*.js', '!src/js/external.js'],
    }
};
