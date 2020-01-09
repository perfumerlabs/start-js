const path = require('path');
const mix = require('laravel-mix');

const assetDir = __dirname;
const staticDir = path.resolve(__dirname, './example/assets');
// const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

console.log(assetDir);


const webpackOptions = {
    module: {
        rules: []
    },
    devtool: 'inline-source-map'
};


mix.webpackConfig(webpackOptions);

mix.disableSuccessNotifications().options({
    processCssUrls: false,
});

mix
    .setPublicPath('./example/assets')
    .js(assetDir + '/example/index.js', staticDir + '/js/app.js')
;

if (mix.inProduction()) {
    mix.version();
}
