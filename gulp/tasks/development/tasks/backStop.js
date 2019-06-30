var gulp = require('gulp'),
    chug = require('gulp-chug');
const backstop = require('backstopjs');
const browsersync = require('browser-sync');

module.exports = function (req, res, next) {

    function parseQuery(queryString) {
        var query = {};
        var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        return query;
    }
    var _get = parseQuery(req._parsedUrl.query);

    if (Boolean(_get) && Boolean(_get.test)){
        let test = _get.test;
        res.setHeader('Content-Type', 'text/json');


        console.log('run '+test);

        backstop(test/*TODO кастомный конфиг*/)
            .then(() => {
            // test successful
            res.end(JSON.stringify({done:true}));
            next();
        }).catch(() => {
            // test failed
            res.end(JSON.stringify({done:false}));
            next();
        });

    }

}