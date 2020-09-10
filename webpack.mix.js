let mix = require('laravel-mix');

mix

    .js('resources/js/map-sos.js', 'public/js')
    .js('resources/js/map-sos-admin.js', 'public/js')

    .version();
