module.exports = {
  publicPath: './', //process.env.NODE_ENV === 'production'?'/vue/user/':'/',
  //outputDir:'dist',
  // assetsDir: 'gokinsui/',
  lintOnSave: false,
  runtimeCompiler: true,
  configureWebpack: {
    //Necessary to run npm link https://webpack.js.org/configuration/resolve/#resolve-symlinks
    resolve: {
      symlinks: false
    }
  },
  transpileDependencies: [
    '@coreui/utils',
    '@coreui/vue'
  ],

  devServer: {
    host: '0.0.0.0', // 允许外部ip访问
    port: 8080, // 端口
    https: false, // 启用https
    disableHostCheck: true,//允许外网
    proxy: {
      '/api': {
        target: 'http://localhost:8030',
        changeOrigin: true,
        secure: false,
        /* pathRewrite: {
          '^/api': '/api'
        } */
      }
    }
  }
}