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
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false,
    },
  },
  transpileDependencies: ['quasar'],
  devServer: {
    proxy: {
      '/api': {
        target: 'http://meal.wcmoon.com/',
        ws: true,
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://127.0.0.1:7001/',
        ws: true,
        changeOrigin: true,
      },
    },
  },
};
