var webpack = require('webpack');
var momentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin');
var isTest = process.env.TEST === 'true';
console.warn('this is test env');
module.exports = {
  outputDir: './cordova-app/www/',
  publicPath: './',
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        import: [],
      },
    },
  },
  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: false,
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:7002/',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  chainWebpack: (config) => {
    config
      .plugin('ignore')
      .use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
    config.plugin('momentTimezoneDataPlugin').use(
      new momentTimezoneDataPlugin({
        startYear: 2018,
        endYear: 2050,
      }),
    );
    isTest && config.optimization.minimize(false);
  },

  baseUrl: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: !isTest,
  parallel: undefined,
};
