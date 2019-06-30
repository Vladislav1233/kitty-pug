/**
 * Created by biyk on 31.01.18.
 */

const $                     = require('gulp-load-plugins')();
const gulp                  = require('gulp');
// const notify                = require('gulp-notify');
const eslint                = require('gulp-eslint');
var reporter                = require('eslint-html-reporter');
var path                    = require('path');
var fs                      = require('fs');
var gulpIf                  = require('gulp-if');

function isFixed(file) {
    // Has ESLint fixed the file contents?
    return file.eslint != null && file.eslint.fixed;
}

module.exports = function(options) {

    /**
     * Генерирует уведомление об ошибках в консоле и в виде всплываюшего сообшения 
     * @param {Object} details содержит информацию по отработанному eslint
     */
    var reportErrors = function (details) {
        let messages = details.eslint.messages;
        let messagesLength = details.eslint.messages.length;
        let errorMessages = '';

        // Останавливаем, если сообшений нет
        if (messagesLength === 0) return;

        // Собираем сообшение более детально через цикл
        for (let error of messages) {
            errorMessages += error.message + ' ';
        }

        // Отсылаем сообшение для показа (всплывашка)
        return $.notify.onError({
            title: 'JavaScript error',
            message: 'Location: ' + details.relative + ' ' + errorMessages,
            sound: 'Beep'
        })(details);
    }

    return function(callback) {
        return gulp.src(['src/js/**/*.js', '!src/js/node_modules/**/*.*', '!src/js/require.js', '!src/js/external/**/*.*', '!src/js/internal.js', '!src/js/external.js'])
            .pipe(eslint({fix:true})) // Включаем сам eslint в поток и просим фиксить маленькие ошибки
            .pipe($.notify(reportErrors)) // Выводим ошибки после отработанного eslint
            .pipe(eslint.format('html', function(results) { // Собираем ресультат и генерируем документ
                fs.writeFileSync('build/report-results.html', results);
            }))
            .pipe(gulpIf(isFixed, gulp.dest('src/js/'))) // Перезапись файлов с фиксами eslint
            .pipe(eslint.results(function (results) { // Конечные результат, отоброжаеться в консоле
                console.log(`Total Errors: ${ results.errorCount }`);
            }));
    };
};