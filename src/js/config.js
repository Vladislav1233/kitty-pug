require.config({
    baseUrl: 'js',
    paths: {
        jquery: 'jquery/jquery',
        html5shiv: 'node_modules/html5shiv/dist/html5shiv',
        modernizr: 'external/modernizr-custom',
        ofi: 'external/ofi.min',
        'jquery-validation': 'node_modules/jquery-validation/dist/jquery.validate',
        nouislider: 'node_modules/nouislider/distribute/nouislider',
        slick: 'node_modules/slick-carousel/slick/slick.min',
        'slick-carousel': 'node_modules/slick-carousel/slick/slick'
    },
    packages: [

    ],
    shim: {

    }
});

// - Модули, подключаемые на всех страницах
require([
    'modernizr',
    'ofi',
    'partials/popup'
]);
