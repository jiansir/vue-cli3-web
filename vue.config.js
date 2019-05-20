const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
function resolve(dir) {
  return path.join(__dirname, dir)
}
const isProduction = process.env.NODE_ENV === 'production'
// cdn预加载使用
const externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  axios: 'axios'
}
const JS_CDN = isProduction
  ? [
      //生产环境cdn
      '//lib.baomitu.com/vue/2.6.10/vue.min.js',
      '//lib.baomitu.com/vue-router/3.0.6/vue-router.min.js',
      '//lib.baomitu.com/vuex/3.1.0/vuex.min.js',
      '//lib.baomitu.com/axios/0.19.0-beta.1/axios.min.js'
    ]
  : []
const CSS_CDN = isProduction ? [] : []
const cdn = {
  js: JS_CDN,
  css: CSS_CDN
}
module.exports = {
  // 项目部署的基础路径 默认"/"为根目录
  // 放在任意目录时使用'./'或者加你的域名
  publicPath: process.env.BASE_URL,
  // 是否使用运行时编译器的 Vue 构建版本,默认false
  runtimeCompiler: false,
  // 开启生产环境SourceMap，设为false打包时不生成.map文件,加速构建
  productionSourceMap: false,
  // 只在生产环境下关闭eslint
  lintOnSave: !isProduction,
  devServer: {
    open: true, // 是否自动打开浏览器页面
    host: '0.0.0.0', // 指定使用一个 host，默认是 localhost
    port: 8080, // 端口地址
    https: false, // 使用https提供服务
    // 这里写调用接口的基础路径，来解决跨域，如果设置了代理，那么本地开发环境的axios的baseUrl要写为 '' ，即空字符串
    proxy: 'http://demo.xx.com'
  },
  chainWebpack: config => {
    // 对vue-cli内部的webpack配置进行更细粒度的修改
    //添加CDN参数到 htmlWebpackPlugin配置中，详见public/index.html 修改
    config.plugin('html').tap(args => {
      args[0].cdn = cdn
      return args
    })
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('compotents', resolve('src/components'))
      .set('common', resolve('src/common'))
  },
  css: {
    // 是否使用css分离插件 ExtractTextPlugin ,默认生产环境开启，开发环境不兼容热重载
    // extract:process.env.NODE_ENV == 'production',
    sourceMap: false,
    loaderOptions: {
      //给stylus-loader传递选项
      stylus: {
        data: `
          @import "@/style/_var.styl";
          @import "@/style/mixin.styl";
          ` //全局导入styl变量和函数
      }
    },
    modules: false
  },
  configureWebpack: config => {
    if (isProduction) {
      //externals里的模块不打包
      Object.assign(config, {
        externals: externals
      })
      //为生产环境修改配置,gzip压缩去除coonsole等
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: false,
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log'] // 移除console
            }
          },
          sourceMap: false,
          parallel: true
        })
      )
      //开启gzip压缩
      const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8
        })
      )
    } else {
      //开发环境配置
    }
  }
}
